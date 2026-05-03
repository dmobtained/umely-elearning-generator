// ── Eenmalig uitvoeren in Supabase (SQL) ──────────────────────────────────────
// ALTER TABLE elearning.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
// ALTER TABLE elearning.profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';
// ALTER TABLE elearning.profiles ADD COLUMN IF NOT EXISTS subscription_end TEXT;
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Stripe = require('stripe');
const stripe = process.env.STRIPE_SECRET_KEY ? Stripe(process.env.STRIPE_SECRET_KEY) : null;

const app = express();
app.set('trust proxy', 1);

// ── Stripe webhook moet raw body ontvangen — VOOR express.json() ──
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) return res.status(500).json({ error: 'Stripe niet geconfigureerd' });

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe webhook verificatie mislukt:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const subscription = event.data.object;

  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated'
  ) {
    const status = subscription.status === 'active' ? 'active' : 'inactive';
    const endDate = subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null;
    const startDate = subscription.start_date
      ? new Date(subscription.start_date * 1000).toISOString()
      : (subscription.created ? new Date(subscription.created * 1000).toISOString() : null);

    // subscription_start alleen zetten bij 'created', niet overschrijven bij updates
    const updateData = { subscription_status: status, subscription_end: endDate };
    if (event.type === 'customer.subscription.created' && startDate) {
      updateData.subscription_start = startDate;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('stripe_customer_id', subscription.customer);

    if (error) {
      console.error('Webhook: subscription update fout:', error.message);
      return res.status(500).json({ error: 'Database update mislukt' });
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const { error } = await supabase
      .from('profiles')
      .update({ subscription_status: 'inactive', subscription_end: null })
      .eq('stripe_customer_id', subscription.customer);

    if (error) {
      console.error('Webhook: subscription delete fout:', error.message);
      return res.status(500).json({ error: 'Database update mislukt' });
    }
  }

  res.json({ received: true });
});

app.use(express.json({ limit: '10mb' }));
app.get('/', (req, res) => res.redirect('/modules.html'));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://instant.page",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'"
  ].join('; '));
  const origin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return res.sendStatus(204);
  }
  next();
});

// ── Rate limiting ──
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuten
  max: 200,                  // max 200 requests per IP per venster
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Te veel verzoeken. Probeer het over 15 minuten opnieuw.' }
}));

app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, { db: { schema: 'elearning' } });
// Aparte client met anon key voor signUp — service role key negeert emailRedirectTo
const supabaseAuth = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// ── Auth middleware ──
async function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Niet ingelogd' });
  }
  const token = auth.slice(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: 'Ongeldige of verlopen sessie' });
  }
  req.user = user;
  next();
}

// ── Config voor frontend ──
app.get('/api/config', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || ''
  });
});

// ── Bestand uploaden en tekst extraheren ──
app.post('/extract-text', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Geen bestand ontvangen.' });
  const { mimetype, originalname, buffer } = req.file;
  try {
    let text = '';
    if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      originalname.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      text = buffer.toString('utf-8');
    }
    text = text.trim();
    if (text.length < 50) return res.status(400).json({ error: 'Bestand bevat te weinig tekst.' });
    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kon tekst niet lezen uit bestand.' });
  }
});

// ── API: lijst van alle modules + gebruikersrol ──
app.get('/api/modules', requireAuth, requireSubscription, async (req, res) => {
  let { data, error } = await supabase
    .from('modules')
    .select('filename, slug, title, created_at, created_date')
    .order('slug', { ascending: true });

  // Fallback: probeer zonder slug kolom als die niet bestaat
  if (error) {
    console.error('/api/modules fout:', error.message);
    ({ data, error } = await supabase
      .from('modules')
      .select('filename, title, created_at, created_date')
      .order('slug', { ascending: true }));
  }
  if (error) return res.status(500).json({ error: error.message });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', req.user.id)
    .single();

  res.json({
    role: profile?.role || 'user',
    modules: data.map(m => ({
      filename: m.filename,
      slug: m.slug || m.filename.replace('.html', ''),
      title: m.title,
      date: m.created_date || m.created_at.slice(0, 10),
      url: `/modules/${m.slug || m.filename.replace('.html', '')}`
    }))
  });
});

// ── Beveiligd HTML-endpoint (Bearer token vereist) ──
app.get('/api/module-html/:slug', requireAuth, requireSubscription, async (req, res) => {
  if (!/^[a-z0-9-]{1,80}$/.test(req.params.slug)) {
    return res.status(400).json({ error: 'Ongeldige module-URL' });
  }
  let { data, error } = await supabase
    .from('modules')
    .select('html')
    .eq('slug', req.params.slug)
    .single();
  if (error || !data) {
    ({ data, error } = await supabase
      .from('modules')
      .select('html')
      .eq('filename', req.params.slug + '.html')
      .single());
  }
  if (error || !data) return res.status(404).send('Module niet gevonden');
  res.setHeader('Content-Type', 'text/html');
  res.send(data.html);
});

// ── Auth-wrapper voor directe module-URL's ──
app.get('/modules/:slug', (req, res) => {
  const slug = req.params.slug;
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) {
    return res.status(400).send('Ongeldige module-URL');
  }
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Module laden...</title>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
  body { margin: 0; font-family: system-ui, sans-serif; background: #FFF8F2; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
  .loader { text-align: center; color: #FF8514; }
  .spinner { width: 36px; height: 36px; border: 4px solid #FFD7AD; border-top-color: #FF4D00; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  p { font-size: 15px; font-weight: 600; color: #FF8514; margin: 0; }
</style>
</head>
<body>
<div class="loader"><div class="spinner"></div><p>Module laden...</p></div>
<script>
(async () => {
  const config = await fetch('/api/config').then(r => r.json());
  const _supabase = supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
  const { data: { session } } = await _supabase.auth.getSession();
  if (!session) {
    window.location.href = '/?redirect=' + encodeURIComponent('/modules/${slug}');
    return;
  }
  const token = session.access_token;
  const res = await fetch('/api/module-html/${slug}', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (res.status === 402) {
    window.location.href = '/pricing.html';
    return;
  }
  if (!res.ok) {
    document.body.innerHTML = '<div style="text-align:center;padding:80px;font-family:system-ui"><h2>Module niet gevonden</h2><a href="/modules.html" style="color:#FF8514">← Terug naar bibliotheek</a></div>';
    return;
  }
  // Registreer module als gestart (score_pct 0 = gestart, nog niet afgerond)
  fetch('/api/user/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ module_slug: '${slug}', score_pct: 0, completed: false })
  }).catch(() => {});
  const html = await res.text();
  const userEmail = session.user.email || '';
  const userName  = session.user.user_metadata?.full_name || session.user.user_metadata?.name || userEmail.split('@')[0] || '';
  // Rol ophalen om admins van protection vrij te stellen
  let userRole = 'user';
  try {
    const profileRes = await fetch('/api/user/profile', { headers: { 'Authorization': 'Bearer ' + token } });
    if (profileRes.ok) { const p = await profileRes.json(); userRole = p.profile?.role || 'user'; }
  } catch (e) {}
  const isAdmin = userRole === 'admin';
  const tokenScript =
    '<script>' +
    'window.__AUTH_TOKEN__  = ' + JSON.stringify(token)     + ';' +
    'window.__USER_EMAIL__  = ' + JSON.stringify(userEmail) + ';' +
    'window.__USER_NAME__   = ' + JSON.stringify(userName)  + ';' +
    '<' + '/script>' +
    (isAdmin ? '' : '<script src="/protection.js"><' + '/script>');
  const injected = html.replace('</head>', tokenScript + '</head>');
  document.open();
  document.write(injected);
  document.close();
})();
</script>
</body>
</html>`);
});

// ── Subscription middleware ──
async function requireSubscription(req, res, next) {
  let { data, error } = await supabase
    .from('profiles')
    .select('role, subscription_status')
    .eq('id', req.user.id)
    .single();

  // Profiel bestaat nog niet — aanmaken met defaults
  if (error && error.code === 'PGRST116') {
    const { data: newProfile, error: insertErr } = await supabase
      .from('profiles')
      .insert({ id: req.user.id, email: req.user.email, role: 'user' })
      .select('role, subscription_status')
      .single();
    if (insertErr) return res.status(500).json({ error: 'Profiel aanmaken mislukt' });
    data = newProfile;
    error = null;
  }

  if (error) return res.status(500).json({ error: 'Profiel ophalen mislukt' });
  if (data?.role === 'admin' || data?.subscription_status === 'active') return next();
  return res.status(402).json({ error: 'Actief abonnement vereist', redirect: '/pricing.html' });
}

// ── Admin middleware ──
async function requireAdmin(req, res, next) {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', req.user.id)
    .single();
  if (error || !data || data.role !== 'admin') {
    return res.status(403).json({ error: 'Geen admin-rechten' });
  }
  req.role = 'admin';
  next();
}

// ── Profiel ophalen (eigen profiel + stats) ──
app.get('/api/user/profile', requireAuth, async (req, res) => {
  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  // Als profiel nog niet bestaat, maak het aan
  if (pErr || !profile) {
    const { data: newProfile, error: insertErr } = await supabase
      .from('profiles')
      .insert({ id: req.user.id, email: req.user.email, role: 'user' })
      .select()
      .single();
    if (insertErr) return res.status(500).json({ error: insertErr.message });

    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', req.user.id);

    return res.json({ profile: newProfile, progress: progress || [] });
  }

  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', req.user.id);

  res.json({ profile, progress: progress || [] });
});

// ── Alle gebruikers ophalen (admin) ──
app.get('/api/users', requireAuth, requireAdmin, async (req, res) => {
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('email', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });

  // Voortgang per gebruiker ophalen
  const { data: allProgress } = await supabase
    .from('user_progress')
    .select('*');

  const enriched = users.map(u => ({
    ...u,
    progress: (allProgress || []).filter(p => p.user_id === u.id)
  }));

  res.json(enriched);
});

// ── Gebruikersrol wijzigen (admin) ──
app.patch('/api/users/:userId/role', requireAuth, requireAdmin, async (req, res) => {
  const { role } = req.body;
  if (!role || !['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Ongeldige rol. Kies "admin" of "user".' });
  }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(req.params.userId)) {
    return res.status(400).json({ error: 'Ongeldig gebruikers-ID.' });
  }
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', req.params.userId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ── Voortgang opslaan ──
app.post('/api/user/progress', requireAuth, async (req, res) => {
  console.log('[progress] POST ontvangen voor user:', req.user?.id, 'body:', JSON.stringify(req.body));
  const { module_slug, score_pct, completed } = req.body;
  if (!module_slug) return res.status(400).json({ error: 'module_slug is verplicht.' });

  const record = {
    user_id: req.user.id,
    module_slug,
    score_pct: score_pct ?? 0,
    completed: !!completed,
    updated_at: new Date().toISOString()
  };
  if (completed) record.completed_at = new Date().toISOString();

  const isStartedOnly = (score_pct ?? 0) === 0 && !completed;
  let error;
  if (isStartedOnly) {
    // Eerste bezoek: alleen invoegen als er nog geen record is — negeer conflict atomair
    const result = await supabase.from('user_progress').upsert(record, { onConflict: 'user_id,module_slug', ignoreDuplicates: true });
    error = result.error;
  } else {
    // Quiz afgerond: altijd opslaan
    const result = await supabase.from('user_progress').upsert(record, { onConflict: 'user_id,module_slug' });
    error = result.error;
  }
  if (error) {
    console.error('Progress save error:', error.message, error.code, record);
    return res.status(500).json({ error: error.message });
  }
  res.json({ ok: true });
});

// ── I2 feedback opslaan ──
app.post('/api/i2/feedback', requireAuth, async (req, res) => {
  const { user_name, tb_verrast, tb_toegepast, tb_eerst, ambas_keuze, ambas_wie } = req.body;
  if (!tb_verrast || !tb_toegepast || !tb_eerst || !ambas_keuze) {
    return res.status(400).json({ error: 'Verplichte velden ontbreken.' });
  }
  const record = {
    user_id:      req.user.id,
    user_email:   req.user.email,
    user_name:    (user_name || '').trim(),
    tb_verrast:   tb_verrast.trim(),
    tb_toegepast: tb_toegepast.trim(),
    tb_eerst:     tb_eerst.trim(),
    ambas_keuze:  ambas_keuze.trim(),
    ambas_wie:    (ambas_wie || '').trim()
  };
  const { error } = await supabase.schema('elearning').from('i2_feedback').upsert(record, { onConflict: 'user_id' });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ── I2 feedback ophalen (admin) ──
app.get('/api/admin/i2-feedback', requireAuth, requireAdmin, async (req, res) => {
  const { data, error } = await supabase.schema('elearning')
    .from('i2_feedback')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// ── Voortgang ophalen (eigen gebruiker) ──
app.get('/api/user/progress', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('user_progress')
    .select('module_slug, score_pct, completed, completed_at')
    .eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ progress: data || [] });
});

// ── Certificaat data ophalen ──
app.get('/api/certificate', requireAuth, async (req, res) => {
  const [progressRes, profileRes, modulesRes] = await Promise.all([
    supabase.from('user_progress').select('module_slug, score_pct, completed, completed_at').eq('user_id', req.user.id).eq('completed', true),
    supabase.from('profiles').select('email').eq('id', req.user.id).single(),
    supabase.from('modules').select('slug, title')
  ]);

  const normalizeSlug = s => (s || '').replace(/-\d{8}$/, '');
  const completedSlugs = new Set((progressRes.data || []).map(p => normalizeSlug(p.module_slug)));
  const allSlugs = (modulesRes.data || []).map(m => normalizeSlug(m.slug));
  const allCompleted = allSlugs.length > 0 && allSlugs.every(s => completedSlugs.has(s));

  const lastCompleted = (progressRes.data || [])
    .filter(p => p.completed_at)
    .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))[0];

  res.json({
    email: profileRes.data?.email || req.user.email,
    name: req.user.user_metadata?.firstName || req.user.user_metadata?.full_name || null,
    allCompleted,
    totalModules: allSlugs.length,
    completedCount: completedSlugs.size,
    completedAt: lastCompleted?.completed_at || null,
    modules: (modulesRes.data || []).map(m => ({
      slug: normalizeSlug(m.slug),
      title: m.title,
      completed: completedSlugs.has(normalizeSlug(m.slug))
    }))
  });
});

// ── Hernoem een module (admin) ──
app.patch('/api/modules/:slug', requireAuth, requireAdmin, async (req, res) => {
  if (!/^[a-z0-9-]{1,80}$/.test(req.params.slug)) {
    return res.status(400).json({ error: 'Ongeldige module-URL' });
  }
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'Titel mag niet leeg zijn.' });
  if (title.trim().length > 200) return res.status(400).json({ error: 'Titel mag maximaal 200 tekens zijn.' });
  const { error } = await supabase.from('modules').update({ title: title.trim() }).eq('slug', req.params.slug);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ── Nieuwsbrief aanmelden ──
app.post('/api/newsletter/subscribe', requireAuth, async (req, res) => {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', req.user.id)
    .single();
  if (profileError) return res.status(500).json({ error: profileError.message });

  // Supabase bijwerken
  const { error } = await supabase
    .from('profiles')
    .update({ newsletter_subscribed: true })
    .eq('id', req.user.id);
  if (error) return res.status(500).json({ error: error.message });

  // MailerLite toevoegen (fire-and-forget, niet blocking)
  if (process.env.MAILERLITE_API_KEY && profile?.email) {
    fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.MAILERLITE_API_KEY
      },
      body: JSON.stringify({ email: profile.email, groups: ['181913132846810970'] })
    }).catch(err => console.error('MailerLite subscribe fout:', err));
  }

  res.json({ ok: true });
});

// ── Nieuwsbrief afmelden ──
app.post('/api/newsletter/unsubscribe', requireAuth, async (req, res) => {
  const { error } = await supabase
    .from('profiles')
    .update({ newsletter_subscribed: false })
    .eq('id', req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ── Review-pagina: JS-wrapper (zoals /modules/:slug) ──
app.get('/admin/review', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<title>Module Review</title>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
  body { margin: 0; font-family: system-ui, sans-serif; background: #f5f5f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
  .msg { text-align: center; color: #FF8514; font-size: 15px; font-weight: 600; }
</style>
</head>
<body>
<div class="msg">Laden...</div>
<script>
(async () => {
  const config = await fetch('/api/config').then(r => r.json());
  const _supabase = supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
  const { data: { session } } = await _supabase.auth.getSession();
  if (!session) { window.location.href = '/account.html?redirect=/admin/review'; return; }
  const res = await fetch('/admin/review-data', { headers: { 'Authorization': 'Bearer ' + session.access_token } });
  if (res.status === 401 || res.status === 403) {
    document.body.innerHTML = '<div class="msg">Geen toegang. Alleen admins kunnen deze pagina zien.</div>';
    return;
  }
  const html = await res.text();
  document.open(); document.write(html); document.close();
})();
</script>
</body>
</html>`);
});

// ── Review-data: echte inhoud, beveiligd voor admins ──
app.get('/admin/review-data', requireAuth, requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('modules')
    .select('slug, title, html')
    .order('slug', { ascending: true });

  if (error) return res.status(500).send('Fout: ' + error.message);

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  let page = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<title>Module Review — ${new Date().toLocaleDateString('nl-NL')}</title>
<style>
  body { font-family: system-ui, sans-serif; padding: 2rem; background: #f5f5f5; color: #111; }
  h1 { font-size: 1.4rem; margin-bottom: 2rem; }
  .mod { background: #fff; border: 1px solid #ddd; border-radius: 8px; margin: 1.5rem 0; padding: 1.5rem; }
  .mod h2 { font-size: 1rem; margin: 0 0 .75rem; color: #FF4D00; font-family: monospace; }
  pre { font-size: 11px; line-height: 1.55; white-space: pre-wrap; word-break: break-all; background: #fafafa; padding: 1rem; border-radius: 4px; border: 1px solid #eee; }
</style>
</head>
<body>
<h1>Umely Module Review &mdash; ${data.length} modules &mdash; ${new Date().toLocaleDateString('nl-NL')}</h1>\n`;

  for (const mod of data) {
    let content = mod.html;
    content = content.replace(/<style[\s\S]*?<\/style>/gi, '');
    content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
    content = content.replace(/\n{3,}/g, '\n\n').trim();

    page += `<div class="mod">
  <h2>${esc(mod.slug)} &mdash; ${esc(mod.title)}</h2>
  <pre>${esc(content)}</pre>
</div>\n`;
  }

  page += `</body></html>`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(page);
});

// ── Verwijder een module (admin) ──
app.delete('/api/modules/:slug', requireAuth, requireAdmin, async (req, res) => {
  if (!/^[a-z0-9-]{1,80}$/.test(req.params.slug)) {
    return res.status(400).json({ error: 'Ongeldige module-URL' });
  }
  const { error } = await supabase.from('modules').delete().eq('slug', req.params.slug);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ── Admin: activiteitenlog ──────────────────────────────────────────────────
app.get('/api/admin/activity', requireAuth, requireAdmin, async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [{ data: recentProfiles }, { data: progress }, { data: allProfiles }] = await Promise.all([
      supabase.from('profiles').select('id, email, created_at').gte('created_at', sevenDaysAgo).order('created_at', { ascending: false }),
      supabase.from('user_progress').select('user_id, module_slug, score_pct, completed, completed_at, updated_at').gte('updated_at', sevenDaysAgo).order('updated_at', { ascending: false }),
      supabase.from('profiles').select('id, email')
    ]);

    const profileMap = {};
    (allProfiles || []).forEach(p => { profileMap[p.id] = p.email; });

    const events = [];

    (recentProfiles || []).forEach(p => {
      events.push({ type: 'registered', email: p.email, ts: p.created_at });
    });

    (progress || []).forEach(p => {
      const email = profileMap[p.user_id] || p.user_id;
      const moduleName = (p.module_slug || '').replace(/^elearning-/, '').replace(/-\d{8}$/, '').replace(/-/g, ' ');
      if (p.completed && p.completed_at) {
        events.push({ type: 'completed', email, module: moduleName, score: p.score_pct, ts: p.completed_at });
      } else {
        events.push({ type: 'started', email, module: moduleName, ts: p.updated_at });
      }
    });

    events.sort((a, b) => new Date(b.ts) - new Date(a.ts));
    res.json(events);
  } catch (err) {
    console.error('Activity log fout:', err);
    res.status(500).json({ error: 'Kon activiteit niet ophalen' });
  }
});

// ── Task 6: POST /api/auth/signup ──
app.post('/api/auth/signup', rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Te veel registratiepogingen. Probeer het over een uur opnieuw.' }
}), async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Alle velden zijn verplicht.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Wachtwoord moet minstens 8 tekens zijn.' });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ error: 'Wachtwoord moet minimaal 1 hoofdletter bevatten.' });
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ error: 'Wachtwoord moet minimaal 1 cijfer bevatten.' });
    }

    const siteUrl = (process.env.SITE_URL || 'https://umely-elearning-generator-dev.up.railway.app').replace(/\/$/, '');
    const { data, error } = await supabaseAuth.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { firstName, lastName },
        emailRedirectTo: siteUrl + '/auth-callback.html'
      }
    });

    if (error) {
      console.error('Signup error:', error);
      if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already been registered')) {
        return res.status(400).json({ error: 'Dit e-mailadres is al geregistreerd.' });
      }
      return res.status(400).json({ error: error.message });
    }

    // Profiel aanmaken
    if (data.user) {
      const { error: profileErr } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, email: email, role: 'user' })
        .select();
      if (profileErr && profileErr.code !== '23505') {
        console.error('Profiel aanmaken mislukt bij signup:', profileErr.message);
      }
    }

    res.json({
      success: true,
      message: 'Account aangemaakt. Controleer je email voor verificatie.'
    });

  } catch (error) {
    console.error('Signup endpoint error:', error);
    res.status(500).json({ error: 'Interne serverfout' });
  }
});

// ── Task 7: GET /api/user/email-verified ──
app.get('/api/user/email-verified', async (req, res) => {
  try {
    // Get auth header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ emailVerified: false, error: 'Niet ingelogd' });
    }

    const token = authHeader.substring(7);

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ emailVerified: false, error: 'Token ongeldig' });
    }

    // Check if email is confirmed
    const emailVerified = !!user.email_confirmed_at;

    res.json({ emailVerified });

  } catch (error) {
    console.error('Email verified check error:', error);
    res.status(500).json({ emailVerified: false, error: 'Serverfout' });
  }
});

// ── Task 8: POST /api/auth/resend-verification ──
app.post('/api/auth/resend-verification', rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Te veel pogingen. Probeer het over 10 minuten opnieuw.' }
}), async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email vereist' });

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    });
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    res.status(500).json({ error: 'Kon verificatie-email niet versturen' });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Interne serverfout' });
});

// ── Stripe: maak checkout sessie aan ──────────────────────────────────────────
app.post('/api/stripe/create-checkout', requireAuth, async (req, res) => {
  if (!stripe) return res.status(500).json({ error: 'Stripe niet geconfigureerd' });

  try {
    // Haal bestaand stripe_customer_id op uit profiel
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', req.user.id)
      .single();

    if (profileErr) return res.status(500).json({ error: profileErr.message });

    let customerId = profile?.stripe_customer_id;

    // Maak nieuwe Stripe customer aan als die nog niet bestaat
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email || req.user.email,
        metadata: { supabase_user_id: req.user.id }
      });
      customerId = customer.id;

      // Sla customer ID op in profiel
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', req.user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: process.env.STRIPE_SUCCESS_URL || `${req.headers.origin || ''}/modules.html?subscribed=1`,
      cancel_url: process.env.STRIPE_CANCEL_URL || `${req.headers.origin || ''}/pricing.html`,
      allow_promotion_codes: true
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout fout:', err);
    res.status(500).json({ error: 'Betaling starten mislukt. Probeer het opnieuw.' });
  }
});

// ── Subscription status ophalen ───────────────────────────────────────────────
app.get('/api/user/subscription', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_end, subscription_start')
    .eq('id', req.user.id)
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json({
    subscription_status: data?.subscription_status || 'inactive',
    subscription_end:    data?.subscription_end    || null,
    subscription_start:  data?.subscription_start  || null
  });
});

// ── Abonnement opzeggen (alleen na minimale termijn van 3 maanden) ─────────────
app.post('/api/stripe/cancel-subscription', requireAuth, async (req, res) => {
  if (!stripe) return res.status(500).json({ error: 'Stripe niet geconfigureerd' });

  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('stripe_customer_id, subscription_start, subscription_status')
    .eq('id', req.user.id)
    .single();

  if (pErr || !profile) return res.status(500).json({ error: 'Profiel ophalen mislukt' });
  if (profile.subscription_status !== 'active') return res.status(400).json({ error: 'Geen actief abonnement' });

  // Controleer minimale termijn van 3 maanden
  if (profile.subscription_start) {
    const start = new Date(profile.subscription_start);
    const minEndDate = new Date(start);
    minEndDate.setMonth(minEndDate.getMonth() + 3);
    if (new Date() < minEndDate) {
      return res.status(403).json({ error: 'Minimale termijn van 3 maanden nog niet verstreken', earliest_cancel: minEndDate.toISOString() });
    }
  }

  // Zoek actief Stripe abonnement voor deze klant
  const subscriptions = await stripe.subscriptions.list({
    customer: profile.stripe_customer_id,
    status: 'active',
    limit: 1
  });

  if (!subscriptions.data.length) return res.status(404).json({ error: 'Geen actief Stripe abonnement gevonden' });

  // Opzeggen aan het einde van de huidige periode
  await stripe.subscriptions.update(subscriptions.data[0].id, { cancel_at_period_end: true });

  res.json({ ok: true, cancel_at: new Date(subscriptions.data[0].current_period_end * 1000).toISOString() });
});

// ── Use case ophalen ──
app.get('/api/user/usecase', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('use_case')
    .eq('id', req.user.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ use_case: data?.use_case || '' });
});

// ── Use case opslaan ──
app.post('/api/user/usecase', requireAuth, async (req, res) => {
  const { use_case } = req.body;
  if (!use_case || !use_case.trim()) return res.status(400).json({ error: 'use_case is verplicht.' });
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: req.user.id, email: req.user.email, use_case: use_case.trim() }, { onConflict: 'id' })
    .eq('id', req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

require('./community-routes')(app, supabase, requireAuth);

// ── Handout route: serveert het boekje-formaat direct als statisch bestand ──
app.get('/handout', (req, res) => {
  const path = require('path');
  res.sendFile(path.join(__dirname, 'public', 'handout.html'));
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Umely E-learning Generator draait op http://localhost:${PORT}`);
});
process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
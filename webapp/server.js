require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 3 });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

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

// In-memory job store
const jobs = {};

const SYSTEM_PROMPT = fs.readFileSync(path.join(__dirname, 'prompt.md'), 'utf8');


// ── Config voor frontend ──
app.get('/api/config', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
  });
});

// ── Start genereren (geeft direct jobId terug) ──
app.post('/generate', requireAuth, async (req, res) => {
  const { transcription } = req.body;
  if (!transcription || transcription.trim().length < 10) {
    return res.status(400).json({ error: 'Transcriptie is te kort of leeg.' });
  }

  const jobId = Date.now().toString(36) + Math.random().toString(36).slice(2);
  jobs[jobId] = { status: 'generating', progress: 0 };
  res.json({ jobId });

  // Genereer op de achtergrond
  (async () => {
    try {
      const stream = await client.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 64000,
        system: SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: `Genereer een complete interactieve e-learning op basis van de volgende transcriptie:\n\n${transcription}`
        }]
      });

      let fullHtml = '';
      let chars = 0;
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          fullHtml += event.delta.text;
          chars += event.delta.text.length;
          jobs[jobId].progress = Math.min(95, Math.round(chars / 300));
        }
      }

      if (fullHtml.includes('<!DOCTYPE html>')) {
        const titleMatch = fullHtml.match(/<title>([^<]+)<\/title>/i);
        const rawTitle = titleMatch
          ? titleMatch[1].replace(' | Umely E-learning', '').trim()
          : 'elearning';
        const slug = rawTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/gi, '-')
          .replace(/^-|-$/g, '')
          .slice(0, 40);
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const filename = `elearning-${slug}-${date}.html`;

        await supabase.from('modules').insert({ filename, title: rawTitle, html: fullHtml });

        jobs[jobId] = {
          status: 'done',
          slug: filename.replace('.html', ''),
          url: `/modules/${filename.replace('.html', '')}`
        };
      } else {
        jobs[jobId] = { status: 'error', error: 'Gegenereerde output is ongeldig.' };
      }
    } catch (err) {
      console.error(err);
      jobs[jobId] = { status: 'error', error: err.message };
    }
  })();
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

// ── Poll job status ──
app.get('/api/job/:jobId', (req, res) => {
  const job = jobs[req.params.jobId];
  if (!job) return res.status(404).json({ error: 'Job niet gevonden' });
  res.json(job);
});

// ── API: lijst van alle modules + gebruikersrol ──
app.get('/api/modules', requireAuth, async (req, res) => {
  let { data, error } = await supabase
    .from('modules')
    .select('filename, slug, title, created_at')
    .order('created_at', { ascending: true });

  // Fallback: probeer zonder slug kolom als die niet bestaat
  if (error) {
    console.error('/api/modules fout:', error.message);
    ({ data, error } = await supabase
      .from('modules')
      .select('filename, title, created_at')
      .order('created_at', { ascending: true }));
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
      date: m.created_at.slice(0, 10),
      url: `/modules/${m.slug || m.filename.replace('.html', '')}`
    }))
  });
});

// ── Beveiligd HTML-endpoint (Bearer token vereist) ──
app.get('/api/module-html/:slug', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('modules')
    .select('html')
    .eq('slug', req.params.slug)
    .single();
  if (error || !data) return res.status(404).send('Module niet gevonden');
  res.setHeader('Content-Type', 'text/html');
  res.send(data.html);
});

// ── Auth-wrapper voor directe module-URL's ──
app.get('/modules/:slug', (req, res) => {
  const slug = req.params.slug;
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
  window.__AUTH_TOKEN__ = token;
  document.open();
  document.write(html);
  document.close();
})();
</script>
</body>
</html>`);
});

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
    .order('created_at', { ascending: true });
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
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', req.params.userId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ── Voortgang opslaan ──
app.post('/api/user/progress', requireAuth, async (req, res) => {
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

  const { error } = await supabase
    .from('user_progress')
    .upsert(record, { onConflict: 'user_id,module_slug' });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
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

// ── Hernoem een module (admin) ──
app.patch('/api/modules/:slug', requireAuth, requireAdmin, async (req, res) => {
  const filename = req.params.slug + '.html';
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'Titel mag niet leeg zijn.' });
  const { error } = await supabase.from('modules').update({ title: title.trim() }).eq('filename', filename);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ── Verwijder een module (admin) ──
app.delete('/api/modules/:slug', requireAuth, requireAdmin, async (req, res) => {
  const filename = req.params.slug + '.html';
  const { error } = await supabase.from('modules').delete().eq('filename', filename);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ── Task 6: POST /api/auth/signup ──
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Alle velden zijn verplicht.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Wachtwoord moet minstens 8 tekens zijn.' });
    }

    // Sign up with Supabase Auth
    // Supabase will send verification email automatically (configured via SMTP)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: {
        firstName: firstName,
        lastName: lastName
      },
      email_confirm: true // Auto-confirm until custom SMTP is configured
    });

    if (error) {
      console.error('Signup error:', error);
      if (error.message.includes('already registered')) {
        return res.status(400).json({ error: 'Dit e-mailadres is al geregistreerd.' });
      }
      return res.status(400).json({ error: error.message });
    }

    // Auto-create profile row (will be updated when email verified via auth hook)
    await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: email,
        role: 'user'
      })
      .select();

    // Send verification email (admin.createUser does not send one automatically)
    const { error: resendError } = await supabaseAdmin.auth.resend({
      type: 'signup',
      email: email
    });
    if (resendError) {
      console.error('Could not send verification email:', resendError);
    }

    res.json({
      success: true,
      message: 'Account aangemaakt. Controleer je email voor verificatie.',
      userId: data.user.id
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
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ emailVerified: false, error: 'Token ongeldig' });
    }

    // Check if email is confirmed
    const emailVerified = user.email_confirmed_at !== null;

    res.json({ emailVerified });

  } catch (error) {
    console.error('Email verified check error:', error);
    res.status(500).json({ emailVerified: false, error: 'Serverfout' });
  }
});

// ── Task 8: POST /api/auth/resend-verification ──
app.post('/api/auth/resend-verification', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email vereist' });

  try {
    const { error } = await supabaseAdmin.auth.resend({
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Umely E-learning Generator draait op http://localhost:${PORT}`);
});
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
        max_tokens: 32000,
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

// ── API: lijst van alle modules ──
app.get('/api/modules', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('modules')
    .select('filename, title, created_at')
    .order('created_at', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(m => ({
    filename: m.filename,
    slug: m.filename.replace('.html', ''),
    title: m.title,
    date: m.created_at.slice(0, 10),
    url: `/modules/${m.filename.replace('.html', '')}`
  })));
});

// ── Beveiligd HTML-endpoint (Bearer token vereist) ──
app.get('/api/module-html/:slug', requireAuth, async (req, res) => {
  const filename = req.params.slug + '.html';
  const { data, error } = await supabase
    .from('modules')
    .select('html')
    .eq('filename', filename)
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
  const res = await fetch('/api/module-html/${slug}', {
    headers: { 'Authorization': 'Bearer ' + session.access_token }
  });
  if (!res.ok) {
    document.body.innerHTML = '<div style="text-align:center;padding:80px;font-family:system-ui"><h2>Module niet gevonden</h2><a href="/modules.html" style="color:#FF8514">← Terug naar bibliotheek</a></div>';
    return;
  }
  const html = await res.text();
  document.open();
  document.write(html);
  document.close();
})();
</script>
</body>
</html>`);
});

// ── Hernoem een module ──
app.patch('/api/modules/:slug', requireAuth, async (req, res) => {
  const filename = req.params.slug + '.html';
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'Titel mag niet leeg zijn.' });
  const { error } = await supabase.from('modules').update({ title: title.trim() }).eq('filename', filename);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ── Verwijder een module ──
app.delete('/api/modules/:slug', requireAuth, async (req, res) => {
  const filename = req.params.slug + '.html';
  const { error } = await supabase.from('modules').delete().eq('filename', filename);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Umely E-learning Generator draait op http://localhost:${PORT}`);
});
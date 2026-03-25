require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// In-memory job store
const jobs = {};

const SYSTEM_PROMPT = `Je bent een AI-agent van Umely — "Jouw vaste AI-partner." Jouw taak: automatisch complete, interactieve e-learning modules genereren vanuit transcripties of samenvattingen.

## Umely Huisstijl (EXACT overnemen)
- Achtergrond pagina: #FFF8F2 (Warm White)
- Primaire tekst: #27292D (Charcoal)
- Amber accent: #FF8514
- Flame accent: #FF4D00
- Gold: #FFD964
- Peach: #FFD7AD
- Cream: #F7E6C2
- Rand: #EDE0D4
- Lettertype: 'Inter', system-ui, sans-serif
- Knoppen: background linear-gradient(135deg, #FF8514, #FF4D00), border-radius 50px, color white, font-weight 700
- Header/Footer achtergrond: #27292D (Charcoal), witte/peach tekst
- Header bevat rechts altijd een "← Bibliotheek" link naar /modules.html (kleur: #FFD7AD, font-weight 600)
- Badges: background #F7E6C2, color #FF4D00
- VERBODEN: blauw, paars, of #FF5A1F als primaire kleur

## Output vereisten
Elke e-learning MOET bevatten:
1. Welkomstscherm — titel, intro, 3-5 leerdoelen, tijdsindicatie
2. Minimaal 4 inhoudsmodules — uitleg + kennischeck per module
3. Drag-and-drop oefening — minstens 1 (in module 2)
4. Voortgangsbalk — bovenaan, toont % voltooid
5. Afsluitquiz — 5 vragen, directe feedback
6. Resultaatscherm — score + certificaat bij ≥70% met downloadknop

## Kwaliteitseisen
- Één volledig werkend HTML-bestand (geen backend nodig)
- Mobile-responsive
- Umely branding in header en footer
- Nederlandse taal
- Geen placeholdertekst — altijd echte inhoud

## Werkwijze
1. Lees transcriptie → identificeer 4-6 kernthema's
2. Schrijf per module max 150 woorden beknopte uitleg
3. Maak inhoudelijk correcte quizvragen
4. Genereer compleet HTML-bestand in één keer

## Nooit doen
- Blauw of paars als primaire kleur
- Om bevestiging vragen — gewoon genereren
- Placeholder tekst laten staan
- Externe API's gebruiken anders dan Google Fonts

Genereer ALLEEN de volledige HTML — geen uitleg, geen markdown, geen code blocks. Begin direct met <!DOCTYPE html>.`;

// ── Start genereren (geeft direct jobId terug) ──
app.post('/generate', async (req, res) => {
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
        model: 'claude-opus-4-6',
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

// ── Poll job status ──
app.get('/api/job/:jobId', (req, res) => {
  const job = jobs[req.params.jobId];
  if (!job) return res.status(404).json({ error: 'Job niet gevonden' });
  res.json(job);
});

// ── API: lijst van alle modules ──
app.get('/api/modules', async (req, res) => {
  const { data, error } = await supabase
    .from('modules')
    .select('filename, title, created_at')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(m => ({
    filename: m.filename,
    slug: m.filename.replace('.html', ''),
    title: m.title,
    date: m.created_at.slice(0, 10),
    url: `/modules/${m.filename.replace('.html', '')}`
  })));
});

// ── Serveer een individuele module ──
app.get('/modules/:slug', async (req, res) => {
  const filename = req.params.slug + '.html';
  const { data, error } = await supabase
    .from('modules')
    .select('html')
    .eq('filename', filename)
    .single();
  if (error || !data) return res.status(404).send('<h1>Module niet gevonden</h1>');
  res.setHeader('Content-Type', 'text/html');
  res.send(data.html);
});

// ── Hernoem een module ──
app.patch('/api/modules/:slug', async (req, res) => {
  const filename = req.params.slug + '.html';
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'Titel mag niet leeg zijn.' });
  const { error } = await supabase.from('modules').update({ title: title.trim() }).eq('filename', filename);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ── Verwijder een module ──
app.delete('/api/modules/:slug', async (req, res) => {
  const filename = req.params.slug + '.html';
  const { error } = await supabase.from('modules').delete().eq('filename', filename);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Umely E-learning Generator draait op http://localhost:${PORT}`);
});

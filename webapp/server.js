require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const OUTPUT_DIR = path.join(__dirname, '..', 'output');

const SYSTEM_PROMPT = `Je bent een AI-agent van Umely — "Jouw vaste AI-partner." Jouw taak: automatisch complete, interactieve e-learning modules genereren vanuit transcripties of samenvattingen.

## Umely Huisstijl (EXACT overnemen)
- Primaire kleur: #FF5A1F (oranje)
- Hover oranje: #E04A10
- Zwart: #0F0F0F
- Wit: #FFFFFF
- Lichtgrijs: #F5F5F5
- Bodytekst: #4A4A4A
- Rand: #E8E8E8
- Lettertype: 'Inter', system-ui, sans-serif
- Knoppen: background #FF5A1F, border-radius 50px, color white, font-weight 700
- VERBODEN: blauw of paars als primaire kleur

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

// ── Haal metadata op uit een HTML-bestand ──
function getModuleMeta(filename) {
  const filepath = path.join(OUTPUT_DIR, filename);
  const html = fs.readFileSync(filepath, 'utf8');
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch
    ? titleMatch[1].replace(' | Umely E-learning', '').trim()
    : filename.replace('.html', '');
  const stat = fs.statSync(filepath);
  return {
    filename,
    slug: filename.replace('.html', ''),
    title,
    date: stat.mtime.toISOString().slice(0, 10),
    url: `/modules/${filename.replace('.html', '')}`
  };
}

// ── API: lijst van alle modules ──
app.get('/api/modules', (req, res) => {
  if (!fs.existsSync(OUTPUT_DIR)) return res.json([]);
  const files = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith('.html'))
    .sort((a, b) => {
      const statA = fs.statSync(path.join(OUTPUT_DIR, a));
      const statB = fs.statSync(path.join(OUTPUT_DIR, b));
      return statB.mtime - statA.mtime; // nieuwste eerst
    });
  res.json(files.map(getModuleMeta));
});

// ── Serveer een individuele module ──
app.get('/modules/:slug', (req, res) => {
  const filename = req.params.slug + '.html';
  const filepath = path.join(OUTPUT_DIR, filename);
  if (!fs.existsSync(filepath)) {
    return res.status(404).send('<h1>Module niet gevonden</h1>');
  }
  res.sendFile(filepath);
});

// ── Verwijder een module ──
app.delete('/api/modules/:slug', (req, res) => {
  const filename = req.params.slug + '.html';
  const filepath = path.join(OUTPUT_DIR, filename);
  if (!fs.existsSync(filepath)) return res.status(404).json({ error: 'Niet gevonden' });
  fs.unlinkSync(filepath);
  res.json({ ok: true });
});

// ── Generate endpoint (streaming) ──
app.post('/generate', async (req, res) => {
  const { transcription } = req.body;
  if (!transcription || transcription.trim().length < 10) {
    return res.status(400).json({ error: 'Transcriptie is te kort of leeg.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = await client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 32000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Genereer een complete interactieve e-learning op basis van de volgende transcriptie:\n\n${transcription}`
        }
      ]
    });

    let fullHtml = '';
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        fullHtml += event.delta.text;
        res.write(`data: ${JSON.stringify({ chunk: event.delta.text })}\n\n`);
      }
    }

    // Automatisch opslaan in output/
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
      if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      fs.writeFileSync(path.join(OUTPUT_DIR, filename), fullHtml, 'utf8');
      res.write(`data: ${JSON.stringify({ done: true, slug: filename.replace('.html', ''), url: `/modules/${filename.replace('.html', '')}` })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    }
    res.end();
  } catch (err) {
    console.error(err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Umely E-learning Generator draait op http://localhost:${PORT}`);
  console.log(`Module bibliotheek:            http://localhost:${PORT}/modules`);
});

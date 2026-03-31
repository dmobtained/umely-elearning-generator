# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Wat doet deze app?

Webapplicatie waarmee gebruikers een transcriptie of PDF/DOCX/TXT uploaden, waarna Claude automatisch een complete interactieve e-learning genereert als een standalone HTML-bestand. Modules worden opgeslagen in Supabase.

## Lokaal draaien

```bash
cd webapp
npm install
cp .env.example .env   # vul API keys in
node server.js         # of: npm start
# Open http://localhost:3000
```

## Omgevingsvariabelen (.env)

```
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=eyJ...           # service role key (server-side)
SUPABASE_ANON_KEY=eyJ...      # anon key (frontend config endpoint)
PORT=3000
```

## Projectstructuur

```
umely-elearning-generator/          <-- git root
├── CLAUDE.md                       <-- dit bestand
├── transcriptie-*.md               <-- 25 transcripties als invoer
├── module-content/                 <-- 25 HTML content-bestanden + _shared-css/js
├── output/                         <-- lokaal gegenereerde HTML (gitignored)
├── build-modules.js                <-- combineert shared CSS/JS + content naar output/
├── .claude/skills/                 <-- Claude Code skills
└── webapp/
    ├── server.js                   <-- Express backend
    ├── prompt.md                   <-- SYSTEM_PROMPT voor Claude (1500+ regels)
    ├── public/
    │   ├── index.html              <-- login + generator UI
    │   ├── modules.html            <-- bibliotheekpagina
    │   ├── account.html            <-- gebruikersbeheer (admin/user)
    │   ├── logo.png                <-- hoofdlogo
    │   └── logo-small.png          <-- klein logo
    └── package.json
```

## Architectuur

### Backend (server.js)
- Auth via Supabase JWT (`requireAuth` middleware op alle schrijf-endpoints)
- `SYSTEM_PROMPT` wordt ingeladen uit `prompt.md` via `fs.readFileSync`
- In-memory `jobs` object voor async generatiestatus (gaat verloren bij herstart)
- Generatie: Claude streamt HTML, valideer, sla op in Supabase `modules` tabel

**Endpoints:**
- `GET /api/config` - Supabase URL + anon key voor frontend
- `POST /generate` - start async generatie, geeft `jobId` terug
- `GET /api/job/:jobId` - poll status (pending/generating/done/error)
- `POST /extract-text` - parse PDF/DOCX/TXT naar plaintext
- `GET /api/modules` - lijst alle modules
- `GET /modules/:slug` - serveer module HTML
- `PATCH /api/modules/:slug` - hernoem
- `DELETE /api/modules/:slug` - verwijder

### Frontend
Vanilla HTML/CSS/JS, geen framework. Supabase JS SDK geladen via CDN. Frontend haalt config op via `/api/config` zodat geen secrets in HTML staan.

### Modulegeneratie pipeline
1. Frontend stuurt transcriptie + Bearer token naar `POST /generate`
2. Server maakt `jobId`, start Claude stream op de achtergrond
3. Claude genereert volledig HTML-bestand op basis van `prompt.md`
4. HTML opgeslagen in Supabase `modules` tabel (slug, title, html, created_date)
5. Frontend pollt `/api/job/:jobId` elke 2s tot `status === 'done'`

### Lokale buildpipeline (buiten webapp)
`build-modules.js` combineert `module-content/_shared-css.html` + `_shared-js.html` + per-module content naar `output/elearning-[slug]-[datum].html`.

## Database (Supabase)

Tabel `modules`: `id`, `filename`, `title`, `slug`, `html`, `created_at`, `created_date`

Geen migratiescript. Schema bestaat al in Supabase.

## Huisstijl

### Webapp UI (index.html, modules.html, account.html)
- Header + footer: `#27292D` (charcoal/donkergrijs)
- Achtergrond: `#FFF8F2` (warm wit)
- Knoppen: `linear-gradient(135deg, #FF8514, #FF4D00)`, pill-shaped (border-radius: 50px)

### Gegenereerde modules (via prompt.md)
- Fonts: **Arimo** (headings) + **Montserrat** (body)
- VERBODEN: Inter, Roboto, Poppins, system-ui als primair font
- Kleuren: `--amber: #FF8514`, `--flame: #FF4D00`, `--gold: #FFD964`, `--fg: #27292D`
- NOOIT blauw, paars of lichtblauw als primaire kleur
- Module-header (voortgangsbalk bovenaan): donkergrijs (`#27292D`), niet oranje gradient

## E-learning generatie

### Wie je bent
AI-agent van Umely. Taak: automatisch complete, interactieve e-learning modules genereren vanuit transcripties of samenvattingen.

### Doelgroep
Elk type bedrijf: makelaarskantoor, advocatenkantoor, accountantskantoor, marketingbureau. Technisch en niet-technisch. Mensen die van nul beginnen. Schrijf altijd laagdrempelig, toegankelijk en zonder jargon.

### Toon
- Eerlijk en direct, geen marketingpraat, geen valse beloften
- Benoem limitaties waar relevant
- Gewone taal die iedereen begrijpt

### Werkwijze
1. Lees de transcriptie, identificeer 4-6 kernthema's
2. Lees `webapp/prompt.md` voor de exacte huisstijl en JS-structuur
3. Genereer compleet HTML-bestand in een keer
4. Sla op als: `output/elearning-[onderwerp]-[YYYYMMDD].html`

### Inhoud per module
1. Welkomstscherm - titel, 3-5 leerdoelen, tijdsindicatie
2. 4-8 inhoudsmodules - uit 14 componenttypen (zie `prompt.md`)
3. Minimaal 5 verschillende componenttypen
4. Voortgangsbalk bovenaan
5. Afsluitquiz - 5 vragen met directe feedback
6. Resultaatscherm - score + certificaat bij >=70%

## Belangrijke regels

- `ANTHROPIC_API_KEY` is alleen voor de webapp (`server.js`), nooit voor lokale scripts
- Genereer HTML altijd direct. Maak geen scripts die de API aanroepen
- Geen placeholder-tekst in gegenereerde modules
- Nederlandse taal tenzij anders gevraagd
- Geen m-dashes in tekst
- Geen aannames of overstatements in content (bijv. niet "Claude is verreweg de veiligste")
- Bij elke e-learning opdracht: lees eerst `webapp/prompt.md`

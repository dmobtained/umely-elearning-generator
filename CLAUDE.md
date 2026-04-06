# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Werkmap

**Alle bash- en git-commando's beginnen altijd met:**
```bash
cd "C:\Users\davem\Desktop\DataDenkt\umely-elearning-generator\umely-elearning-generator"
```

## Wat doet deze app?

Webapplicatie waar betalende gebruikers (95 euro/maand) toegang krijgen tot curated e-learning modules over Claude AI. Dave of Sonny bepalen welke modules beschikbaar zijn. Gebruikers consumeren de modules, zij genereren ze niet zelf. Modules worden opgeslagen in Supabase en geserveerd als standalone HTML-bestanden.

## Lokaal draaien

```bash
cd "C:\Users\davem\Desktop\DataDenkt\umely-elearning-generator\umely-elearning-generator\webapp"
npm install
node server.js
# Open http://localhost:3000
```

## Omgevingsvariabelen (webapp/.env)

```
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=eyJ...           # service role key (server-side)
SUPABASE_ANON_KEY=eyJ...      # anon key (frontend config endpoint)
PORT=3000
```

## Projectstructuur

```
umely-elearning-generator/
├── CLAUDE.md                       <- dit bestand
├── transcriptie-*.md               <- 25 transcripties als bronmateriaal
├── module-content/                 <- 25 HTML content-bestanden + _shared-css/js
├── output/                         <- lokaal gebouwde HTML (gitignored)
├── build-modules.js                <- combineert shared CSS/JS + content -> output/
├── upload-modules.js               <- uploadt output/ naar Supabase
└── webapp/
    ├── server.js                   <- Express backend
    ├── prompt.md                   <- instructies + structuurregels (~70 regels)
    ├── boilerplate.html            <- alle CSS, JS en vaste HTML-blokken (startbasis)
    ├── public/
    │   ├── index.html              <- login UI
    │   ├── modules.html            <- modulebiblioteek
    │   ├── account.html            <- gebruikersbeheer
    │   ├── logo.png
    │   └── logo-small.png
    └── package.json
```

## Modulebouwpipeline

1. Schrijf/bewerk content in `module-content/elearning-*.html`
2. Run `node build-modules.js` -> genereert `output/elearning-*-YYYYMMDD.html`
3. Fix Supabase slug kolom (zie SQL hieronder), dan `node upload-modules.js`

### Supabase slug-kolom (eenmalig uitvoeren als kolom ontbreekt)

```sql
ALTER TABLE modules ADD COLUMN IF NOT EXISTS slug TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS modules_slug_unique ON modules(slug);
```

## Contentbestand-structuur (module-content/)

Elk content-HTML-bestand heeft metadata-comments bovenaan:

```html
<!-- TITLE: A1 - Wat is Claude? -->
<!-- SCHERMEN: 'screen-welcome','screen-module-1-1','screen-module-1-2','screen-module-1-3','screen-module-1-kc',...,'screen-quiz','screen-result' -->
<!-- MODULE_TITELS: 'screen-welcome':'','screen-module-1-1':'Onderdeel 1 - Uitleg',... -->
<!-- QUIZ_START -->
[ { "vraag": "...", "opties": ["..."], "correct": 0, "uitleg": "..." } ]
<!-- QUIZ_END -->
```

Daarna de schermen als `<div id="screen-*" class="screen">` blokken.

### Schermstructuur per module (standaard)

Per onderdeel (1-5): 3 sub-schermen + kennischeck:
- `screen-module-X-1` — Uitleg (kern van het onderwerp)
- `screen-module-X-2` — Verdieping (tabel, flashcards, scenario of vergelijking)
- `screen-module-X-3` — Praktijk (concrete toepassing, stappen of scenario)
- `screen-module-X-kc` — Kennischeck (multiple choice via `checkKC()`)

`screen-quiz` en `screen-result` worden toegevoegd door `build-modules.js`.

### Beschikbare CSS-componenten

Uit `_shared-css.html`:
- `.content-card` — standaard tekstblok
- `.module-header` — donkergrijze sectionheader met titel
- `.kennischeck` — donker blok voor multiple choice vragen
- `.tip-box` / `.tip-box.waarschuwing` — info- of waarschuwingsblok
- `.flashcard-set` / `.flashcard` — klikbare kaartjes
- `.stappen-lijst` / `.stap-item` — genummerde stappenlijst
- `.vergelijk-tabel` — vergelijkingstabel
- `.scenario-blok` / `.scenario-keuze` — klikbaar scenario
- `.processtroom` / `.proces-blok` — visuele processtroom
- `.tijdlijn` / `.tijdlijn-punt` — tijdlijn
- `.sorteer-lijst` / `.sorteer-item` — drag-to-sort
- `.drag-items` / `.drop-zone` — drag-and-drop
- `.invul-wrap` / `.invul-input` — invulvak in zin
- `.visual-block` — wrapper voor inline SVG-illustraties (margin, border-radius, overflow:hidden)

### Visuele illustraties in modules (SVG-mockups)

Gebruik altijd **inline SVG** voor visuele uitbeelding — geen externe afbeeldingen, geen screenshots als bestanden. SVG wordt direct in het HTML-bestand geschreven en werkt altijd, ook als de echte UI van Claude verandert.

**Wanneer een visual toevoegen:**
- Bij schermen die een interface uitleggen (web-app, desktop-app, Chrome-extensie)
- Bij architectuurdiagrammen (MCP-flow, Connectors-flow)
- Bij concepten die beter te begrijpen zijn met een visueel schema dan met tekst

**Hoe een visual plaatsen:**
```html
<div class="visual-block">
  <svg viewBox="0 0 580 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;border-radius:10px;box-shadow:0 2px 16px rgba(0,0,0,0.09);">
    <!-- SVG inhoud hier -->
  </svg>
</div>
```

**Regels voor SVG-illustraties:**
- Altijd `viewBox="0 0 580 [hoogte]"` + `width:100%` zodat het responsive is
- Gebruik uitsluitend Umely-kleuren: `#27292D` (charcoal), `#FF8514` (amber), `#FFF8F2` (warm wit), `#EAE6E0` (border)
- Gebruik `font-family="Arial, sans-serif"` (geen Google Fonts in SVG)
- Mockups van UI: toon alleen de essentiële elementen die in de module worden uitgelegd — geen decoratieve details
- Architectuurdiagrammen: gebruik blokken + pijlen, label elk blok kort, voeg een beschrijvende voetnoot toe
- SVG staat ALTIJD in een `.visual-block` div
- Positie: direct na de uitlegparagraaf, vóór de tip-box of kennischeck

**Huidige visuals per module:**
- `elearning-a2-ecosysteem.html` — web-app mockup (module-1-1), desktop-app mockup (module-2-1), Chrome-extensie + zijpaneel (module-3-1)
- `elearning-c1-webapp.html` — web-app interface met genummerde callouts (module-1-1)
- `elearning-c3-chrome.html` — Chrome-extensie browser + zijpaneel (module-1)
- `elearning-e1-mcp.html` — MCP architectuurdiagram Jij→Claude→MCP→tools (module-1-1)
- `elearning-e2-connectors.html` — Connectors flow Jij→Claude→Connector→services (module-1)

### Beschikbare JS-functies

Uit `_shared-js.html`:
- `goTo(screenId)` — navigeer naar scherm
- `checkKC(nr, el, isCorrect, volgendeScherm, uitleg)` — kennischeck antwoord verwerken
- `resetKC(nr)` — reset kennischeck
- `toggleFlashcard(el)` — open/sluit flashcard
- `checkScenario(nr, el, isCorrect, uitleg)` — scenario antwoord
- `checkInvul(inputId, correctAntwoord, feedbackId)` — invulvak check
- `checkSorteer(lijstId, correcteVolgorde, feedbackId)` — sorteeroefening check
- `toggleLeesMeer(btn, contentId)` — lees-meer knop
- `togglePopup(popupId)` — diagram popup

## Architectuur (webapp)

- Auth via Supabase JWT (`requireAuth` middleware)
- `prompt.md` + `boilerplate.html` worden samengevoegd tot `FULL_PROMPT` in `server.js`
- Endpoints: `GET /api/modules`, `GET /modules/:slug`, `PATCH /api/modules/:slug`, `DELETE /api/modules/:slug`

## Database (Supabase)

**MCP project ID:** `dsxyygvvtwnsoiubrwxc`
**Schema:** `elearning` (niet `public` — altijd `elearning.modules` schrijven, nooit alleen `modules`)
**Tabel:** `elearning.modules`: `id`, `filename`, `title`, `slug`, `html`, `created_at`, `created_date`

### Hoe de Supabase MCP gebruiken

Gebruik altijd de MCP-tools, nooit Node.js scripts of dotenv voor databasetoegang.

1. **Lijst opvragen:**
   ```
   mcp__claude_ai_Supabase__list_projects → geeft project ID dsxyygvvtwnsoiubrwxc
   ```
   Alleen nodig als je het project ID wil verifiëren.

2. **SQL uitvoeren:**
   ```
   mcp__claude_ai_Supabase__execute_sql
     project_id: dsxyygvvtwnsoiubrwxc
     query: SELECT ... FROM elearning.modules ...
   ```

3. **Schema opzoeken als je twijfelt:**
   ```sql
   SELECT table_schema, table_name FROM information_schema.tables WHERE table_name = 'modules';
   ```
   Resultaat: `elearning` en `public` bestaan beide — gebruik altijd `elearning`.

**Veelgemaakte fouten die je moet vermijden:**
- Project ID `ummcgaazziivvxgfwsio` staat in de `.env` maar is NIET het MCP project ID — het juiste ID is `dsxyygvvtwnsoiubrwxc`
- `FROM modules` zonder schema geeft lege resultaten — schrijf altijd `FROM elearning.modules`
- De MCP `execute_sql` werkt alleen met het juiste project ID; bij twijfel eerst `list_projects` aanroepen
- De Supabase REST API (`/rest/v1/modules`) gebruikt standaard het `public` schema — gebruik altijd de header `Content-Profile: elearning` bij POST/PATCH via de REST API, anders gaat de upsert naar de verkeerde tabel
- Verifieer na elke upload via MCP SQL of de HTML ook echt de verwachte inhoud bevat (bv. `html LIKE '%zoekterm%'`)

### Slugs
Modules worden opgeslagen met een schone slug zonder datum, bv. `elearning-a1-wat-is-claude`.
Bij een nieuwe upload: upsert op slug zodat de bestaande rij wordt overschreven, geen nieuwe aangemaakt.

### Opruimen van oude gedateerde versies
Als er dubbele slugs met datum-suffix in de database staan:
```sql
DELETE FROM elearning.modules WHERE slug ~ '-2026[0-9]{4}$';
```

## Huisstijl modules

- Fonts: **Arimo** (headings) + **Montserrat** (body). Nooit Inter/Roboto/Poppins.
- Kleuren: `--amber: #FF8514`, `--flame: #FF4D00`, `--gold: #FFD964`, `--fg: #27292D`
- Module-header: donkergrijs (`#27292D`), niet oranje gradient

## Schrijfregels

- Geen m-dashes (`--`) in tekst
- Geen placeholder-tekst in modules
- Geen aannames of overstatements (niet: "Claude is verreweg de veiligste")
- Laagdrempelig, eerlijk, beperkingen benoemen
- Nederlandse taal
- `ANTHROPIC_API_KEY` alleen in `server.js`, nooit in lokale scripts

### Universele/tijdloze formulering

Content moet tijdloos zijn. Vermijd:
- Vergelijkingen met andere tools ("beter dan GPT", "anders dan Copilot")
- Tijdsgebonden claims ("Claude kan nu X", "nieuwste versie")
- Specifieke limieten die snel verouderen — gebruik in plaats daarvan "controleer actuele limiet"
- Zinnen als "op dit moment" of "recent" — die worden snel onjuist

Formuleer altijd zo dat de inhoud over 6 maanden nog klopt.

### Diepgang verplicht

Elke uitleg moet verder gaan dan de oppervlakte. Verboden:
- Uitleggen WAT Claude doet zonder uit te leggen WAAROM of HOE
- Waarschuwingen zonder concrete handelswijze ("controleer altijd de inhoud" is te vaag — geef aan wat te controleren en hoe)
- Schermen met alleen een tip-box als enige inhoud

Verplicht: elk contentscherm heeft minstens één concrete handeling, voorbeeld of oefening.

### Geen AI-opvulling

Verwijder automatisch gegenereerde loze zinnen zoals:
- "zonder andere tools af te kraken"
- "dit is geen vervanging voor menselijk denken"
- "gebruik Claude verstandig"
- "de mogelijkheden zijn eindeloos"
- Elke zin die niets concreets toevoegt aan de leerdoelen

## Kwaliteitsregels voor module-content (VERPLICHT)

Dit zijn de regels die bij elke module gecontroleerd en gehandhaafd moeten worden. Afwijkingen zijn fouten, geen stijlkeuzes.

### Welkomscherm
- `class="screen start"` op het welkomscherm (niet alleen `class="screen"`)
- Verplichte classes: `welcome-badge`, `leerdoelen` (als `<ul>`), `tijdsbadge`
- Leerdoelen zijn specifiek en sluiten aan bij de inhoud — niet "Je begrijpt Claude beter"

### MODULE_TITELS
- Altijd beschrijvende namen — NOOIT "Module 1", "Module 2", "Topic 1", "Onderdeel 1" etc.
- Correct voorbeeld: `'screen-module-1-1':'Wat is een prompt?'`
- Fout voorbeeld: `'screen-module-1-1':'Module 1'`

### Schermstructuur
- Standaard per onderdeel: `-1` (uitleg), `-2` (verdieping), `-3` (praktijk), `-kc` (kennischeck)
- Kennischeck staat ALTIJD op een eigen `screen-module-X-kc` scherm — nooit embedded in een contentscherm
- Elke kennischeck (`checkKC`) heeft zinvolle feedbacktekst bij zowel correct als fout antwoord

### Navigatie
- GEEN inline Volgende/Ga verder/Verder-knoppen in contentschermen (`onclick="goTo(...)"`)
- Navigatie loopt uitsluitend via `renderNavButtons` — dat injecteert automatisch de juiste knoppen
- Uitzondering: de knop "Naar de afsluitquiz" op het laatste contentscherm is toegestaan

### Quiz
- Exact **5 vragen** — niet 6, niet 7
- Elk quizvraag heeft een `uitleg`-veld met inhoudelijke toelichting
- Quiz JSON staat altijd tussen `<!-- QUIZ_START -->` en `<!-- QUIZ_END -->`

### Prijzen en datums
- GEEN specifieke prijsbedragen ("$20/maand", "$25/gebruiker", "10-15 euro")
- Vervang altijd door: "zie actuele pricing op claude.ai" of "betaald abonnement"
- GEEN specifieke jaren of datums als voorbeeldinhoud ("in 2026", "Klanten 2026")
- Technische limieten die snel verouderen (bv. "30 MB uploadlimiet") benoemen als "controleer actuele limiet"

### Zelfpromotie
- GEEN marketingclaims over Umely in instructiemateriaal
- Verwijzingen naar Umely zijn informatief, niet promotioneel
- Geen persoonsgebonden marketing (bv. "Sonny de Leeuw beoordeelt persoonlijk")

### Componentvariatie
- Minimaal 5 verschillende componenttypen per module
- Maximaal 2 opeenvolgende `content-card` blokken zonder visueel element ertussen
- Flashcards hebben altijd `onclick="toggleFlashcard(this)"` op elke kaart

### Checklist voor nieuwe of bewerkte modules
Doorloop deze lijst voor elke module vóór upload:
- [ ] `class="screen start"` op welkomscherm
- [ ] `welcome-badge`, `leerdoelen`, `tijdsbadge` aanwezig
- [ ] MODULE_TITELS zijn beschrijvend
- [ ] Kennischecks op eigen -kc schermen
- [ ] Geen inline navigatieknoppen
- [ ] Quiz heeft exact 5 vragen met uitleg
- [ ] Geen prijsbedragen of verouderde datums
- [ ] Minimaal 5 componenttypen gebruikt
- [ ] Flashcards hebben onclick-handler

## Kwaliteitsproces: content audit en factcheck

### Content audit
Gebruik een agent om alle modules te scannen op:
- AI-opvulling (platitudes, loze zinnen)
- Te oppervlakkige schermen (alleen tip-box, geen concrete handeling)
- Tijdsgebonden taal ("op dit moment", "binnenkort", specifieke getallen)
- Ontbrekende nuance bij verificatie (slechts één bron zonder alternatieven)

Resultaat opslaan in `content-audit.md` in de projectroot.

### Factcheck
Gebruik een agent om alle modules te scannen op verifieerbare claims:

**Categorieën om te markeren:**
1. Specifieke feiten over Claude/Anthropic (oprichtingsjaar, versienamen, contextvenster-groottes)
2. Claims over hoe Claude werkt (functies, geheugen, Projects, Connectors, MCP)
3. Claims over andere tools/bedrijven (OpenAI, ChatGPT, Gemini, Microsoft Copilot)
4. UI-paden en menu-namen in claude.ai (verouderen bij interface-updates)
5. Getallen en limieten (bestandsgroottes, token-limieten, prijzen)

**Output:** `factcheck.md` in de projectroot — per claim: exacte zin, module, scherm-ID, type, risico (Hoog/Middel/Laag).

**Factcheck.md staat op:** `umely-elearning-generator/factcheck.md`

Na een factcheck: laat Dave of Sonny de Hoog-risico claims handmatig verifiëren via Anthropic's documentatie (docs.anthropic.com) of claude.ai zelf. Daarna modules fixen en opnieuw uploaden.

### Wanneer uitvoeren
- Na het schrijven of herschrijven van modules
- Minimaal eens per kwartaal (Claude-features veranderen snel)
- Na een grote Claude-update van Anthropic

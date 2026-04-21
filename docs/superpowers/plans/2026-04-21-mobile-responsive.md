# Mobile Responsiviteit E-learning Implementatieplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** De Umely e-learning webapp volledig functioneel maken op iOS en Android, zonder enige wijziging aan het desktopgedrag.

**Architecture:** Puur additief — alle bestaande CSS en JS blijft ongewijzigd. Mobiele stijlen worden toegevoegd in duidelijk gemarkeerde blokken onderaan bestaande bestanden. Voor de bibliotheekpagina: zijbalk verbergen + bottom nav toevoegen via CSS + HTML. Voor modulepagina's: gedeelde CSS uitbreiden via `_shared-css.html`, daarna rebuild + upload.

**Tech Stack:** Vanilla CSS (media queries, env()), vanilla JS, Node.js (build pipeline), Supabase (module storage)

---

## Bestandskaart

| Bestand | Wat er verandert |
|---|---|
| `build-modules.js:93` | `viewport-fit=cover` toevoegen aan meta viewport |
| `build-modules.js:118` | `class="header-back"` toevoegen aan terugknop |
| `module-content/_shared-css.html` | Globale input font-size + mobiele CSS C0–C6 |
| `webapp/public/modules.html:5` | `viewport-fit=cover` toevoegen |
| `webapp/public/modules.html` | Mobiele CSS + bottom nav HTML |
| `webapp/public/account.html:5` | `viewport-fit=cover` toevoegen |
| `webapp/public/account.html` | Mobiele CSS + bottom nav HTML |
| `output/*.html` | Gegenereerd door build — niet handmatig aanpassen |

---

## Task 1: viewport-fit=cover in alle HTML-bestanden

**Files:**
- Modify: `build-modules.js:93`
- Modify: `webapp/public/modules.html:5`
- Modify: `webapp/public/account.html:5`

- [ ] **Stap 1: Pas build-modules.js aan**

Regel 93 van `build-modules.js`, verander:
```js
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
naar:
```js
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

- [ ] **Stap 2: Pas modules.html aan**

Regel 5 van `webapp/public/modules.html`, verander:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
naar:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

- [ ] **Stap 3: Pas account.html aan**

Regel 5 van `webapp/public/account.html`, verander:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
naar:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

- [ ] **Stap 4: Verifieer**

```bash
grep -r "viewport-fit=cover" webapp/public/modules.html webapp/public/account.html build-modules.js
```

Verwacht: 3 regels output, elk met `viewport-fit=cover`.

- [ ] **Stap 5: Commit**

```bash
git add build-modules.js webapp/public/modules.html webapp/public/account.html
git commit -m "feat(mobile): viewport-fit=cover op alle HTML-bestanden"
```

---

## Task 2: `_shared-css.html` — mobiele CSS (modulepagina's)

**Files:**
- Modify: `module-content/_shared-css.html` (toevoegen na regel 180, na het bestaande `@media` blok)

Het bestaande mobiele blok eindigt op regel 180:
```css
@media(max-width:600px){
  ...
  .nav-buttons{flex-direction:row}.btn-vorige,.btn{font-size:0.85rem;padding:0.7rem 1.2rem}
}
```

- [ ] **Stap 1: Voeg globale iOS input-fix toe**

Direct ná het bestaande `@media(max-width:600px){...}` blok toevoegen — dit is géén media query, geldt altijd:

```css
/* ── iOS INPUT ZOOM FIX (global) ── */
input,textarea,select{font-size:16px}
```

- [ ] **Stap 2: Voeg mobiele CSS toe**

Direct daarna toevoegen:

```css
/* ── MOBILE (modulepagina's) ── */
@media(max-width:600px){
  /* C0 — Header safe area */
  header{padding-top:env(safe-area-inset-top)}

  /* C1 — Terugknop tap target */
  .header-back{min-height:44px;display:flex;align-items:center;padding:0 8px 0 0}

  /* C3 — Tap targets 44×44px */
  .btn,.kc-optie,.quiz-optie,.scenario-keuze,.flashcard,.sorteer-item{min-height:44px}
  .btn-vorige{min-height:44px;display:flex;align-items:center;justify-content:center}

  /* C4 — Tabel scroll-isolatie */
  .vergelijk-tabel{display:block;overflow-x:auto;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}

  /* C5 — Milestone toast boven home indicator */
  .milestone-toast{bottom:calc(env(safe-area-inset-bottom) + 12px);right:16px;left:16px;max-width:none}

  /* C6 — Navigatieknoppen full-width */
  .btn-vorige,.btn{flex:1;text-align:center;justify-content:center}
}
```

- [ ] **Stap 3: Bouw en valideer**

```bash
cd "c:/Users/davem/OneDrive/AI Space/Umely/umely-elearning-generator"
node build-modules.js && node validate-modules.js
```

Verwacht: `Exit code 0`, geen rode meldingen. Als validatie faalt: lees de foutmelding, herstel de CSS, herhaal.

- [ ] **Stap 4: Commit**

```bash
git add module-content/_shared-css.html
git commit -m "feat(mobile): iOS input fix + mobiele CSS modulepagina's (C0–C6)"
```

---

## Task 3: `build-modules.js` — klasse op terugknop

**Files:**
- Modify: `build-modules.js:118`

De terugknop op regel 118 heeft alleen inline stijlen en geen klasse. Door `class="header-back"` toe te voegen kan de mobiele CSS in C1 hem targeten.

- [ ] **Stap 1: Voeg klasse toe aan terugknop**

Regel 118 van `build-modules.js`, verander:
```js
      <a href="/modules.html" style="color:rgba(255,248,242,0.7);font-size:0.8rem;text-decoration:none;font-weight:600;padding:6px 14px;border:1.5px solid rgba(255,248,242,0.25);border-radius:50px;white-space:nowrap;transition:all 0.15s;">&#8592; Overzicht</a>
```
naar:
```js
      <a href="/modules.html" class="header-back" style="color:rgba(255,248,242,0.7);font-size:0.8rem;text-decoration:none;font-weight:600;padding:6px 14px;border:1.5px solid rgba(255,248,242,0.25);border-radius:50px;white-space:nowrap;transition:all 0.15s;">&#8592; Overzicht</a>
```

- [ ] **Stap 2: Bouw, valideer en upload**

```bash
node build-modules.js && node validate-modules.js && node upload-modules.js
```

Verwacht: build succesvol, validatie exit 0, upload logt elke module als geüpload.

- [ ] **Stap 3: Verifieer in browser**

Open een module via `http://localhost:3000/modules/elearning-a1-wat-is-claude` (webapp lokaal draaien: `cd webapp && node server.js`).

Open Chrome DevTools → toggle Device Toolbar → kies **iPhone 14 Pro Max** (430×932).

Controleer:
- Header zichtbaar, geen overlap met Dynamic Island
- "← Overzicht" zichtbaar en tapsbaar (44px hoogte)
- Knoppen makkelijk aantikbaar

- [ ] **Stap 4: Commit**

```bash
git add build-modules.js
git commit -m "feat(mobile): header-back klasse op terugknop in build-modules"
```

---

## Task 4: `modules.html` — mobiele CSS

**Files:**
- Modify: `webapp/public/modules.html` (toevoegen aan het einde van het `<style>` blok, vóór `</style>`)

- [ ] **Stap 1: Zoek het einde van het style-blok**

In `webapp/public/modules.html`, zoek naar `</style>` in de `<head>`. Voeg het volgende toe direct daarvóór:

```css
/* ── MOBILE ── */
@media (max-width: 768px) {

  /* B1 — Header safe area */
  header { padding-top: env(safe-area-inset-top); }

  /* B2 — Zijbalk verbergen */
  .sidebar { display: none; }
  .layout { flex-direction: column; }

  /* B4 — Content-container: ruimte voor bottom nav + home indicator */
  .main { padding: 16px 16px calc(49px + env(safe-area-inset-bottom) + 16px); }

  /* B5 — Stats-rij compacter */
  .stats-row { gap: 8px; }
  .stat-card { padding: 12px 10px; }
  .stat-value { font-size: 24px; }

  /* B6 — Cat-groepen altijd open, als lijst weergeven */
  .cat-group-body { display: block !important; }
  .cat-group-header { cursor: default !important; }
  .cat-group-chevron { display: none !important; }
  .cat-inner-grid { display: flex; flex-direction: column; gap: 6px; }

  /* Module cards als lijstitems */
  .module-card { min-height: 44px; }
  .module-card:hover { transform: none; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }

  /* Zoekbalk full-width */
  .search-input-wrap { width: 100%; }
  .section-header { flex-wrap: wrap; gap: 8px; }

  /* Header compacter op klein scherm */
  .logo img { height: 48px; }
  .user-pill { padding: 4px 10px 4px 4px; }

  /* Continue card compacter */
  .continue-title { font-size: 14px; }
  .btn-continue { padding: 9px 16px; font-size: 12px; }
}
```

- [ ] **Stap 2: Verifieer in browser**

Zorg dat webapp lokaal draait: `cd webapp && node server.js`

Open `http://localhost:3000/modules` in Chrome.

DevTools → Device Toolbar → **iPhone 14 Pro Max** (430×932).

Controleer:
- Zijbalk niet zichtbaar
- Drie stats naast elkaar leesbaar
- Modules als lijst gegroepeerd per reeks, allen zichtbaar zonder klikken
- Geen horizontale scroll op de pagina zelf

- [ ] **Stap 3: Commit**

```bash
git add webapp/public/modules.html
git commit -m "feat(mobile): mobiele CSS bibliotheekpagina (zijbalk, stats, cat-groepen)"
```

---

## Task 5: `modules.html` — bottom navigation HTML

**Files:**
- Modify: `webapp/public/modules.html` (toevoegen direct vóór `</body>`)

- [ ] **Stap 1: Voeg bottom nav HTML toe**

Direct vóór het afsluitende `</body>` tag in `webapp/public/modules.html`:

```html
<!-- ── MOBILE BOTTOM NAV ── -->
<nav class="mobile-bottom-nav" aria-label="Hoofdnavigatie">
  <a href="/modules" class="mobile-nav-item active" id="mobileNavModules">
    <span class="mobile-nav-icon">📚</span>
    <span class="mobile-nav-label">Modules</span>
  </a>
  <a href="/account" class="mobile-nav-item" id="mobileNavAccount">
    <span class="mobile-nav-icon">👤</span>
    <span class="mobile-nav-label">Account</span>
  </a>
</nav>
```

- [ ] **Stap 2: Voeg bottom nav CSS toe**

Voeg toe aan het mobiele CSS blok dat je in Task 4 hebt aangemaakt (binnen de bestaande `@media (max-width: 768px) { ... }`):

```css
  /* B3 — Bottom navigation */
  .mobile-bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    border-top: 1px solid #EAE6E0;
    padding-bottom: env(safe-area-inset-bottom);
    z-index: 200;
  }
  .mobile-nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 49px;
    min-width: 44px;
    padding: 8px 0;
    text-decoration: none;
    color: #AAA;
    font-size: 11px;
    font-weight: 600;
  }
  .mobile-nav-item.active { color: #FF8514; }
  .mobile-nav-icon { font-size: 20px; margin-bottom: 2px; }
```

En buiten het `@media` blok (zodat de nav op desktop verborgen blijft):

```css
.mobile-bottom-nav { display: none; }
```

Let op: deze regel moet **buiten** het `@media` blok staan, zodat de nav standaard verborgen is en alleen op mobiel verschijnt.

- [ ] **Stap 3: Verifieer in browser**

DevTools → iPhone 14 Pro Max.

Controleer:
- Bottom nav zichtbaar onderaan het scherm
- Modules-tab oranje (actief)
- Account-tab grijs
- Hoofd-content niet achter de nav verdwenen (padding-bottom uit Task 4 werkt)
- Op desktop (geen device toolbar): bottom nav onzichtbaar

- [ ] **Stap 4: Commit**

```bash
git add webapp/public/modules.html
git commit -m "feat(mobile): bottom navigation HTML + CSS op bibliotheekpagina"
```

---

## Task 6: `account.html` — mobiele CSS + bottom navigation

**Files:**
- Modify: `webapp/public/account.html`

- [ ] **Stap 1: Controleer de hoofd-content container in account.html**

```bash
grep -n "class=\"main\|class=\"content\|class=\"container\|<main" webapp/public/account.html | head -10
```

Kijk welke klasse of tag de hoofd-content omsluit. Gebruik die klasse in de `padding-bottom` regel van stap 2 (vervang `main, .main, .content, .container` door de exacte match als die afwijkt).

- [ ] **Stap 2: Voeg mobiele CSS toe aan account.html**

Zoek het einde van het `<style>` blok in `webapp/public/account.html` en voeg toe direct vóór `</style>`:

```css
/* ── MOBILE ── */
.mobile-bottom-nav { display: none; }

@media (max-width: 768px) {
  /* Header safe area */
  header { padding-top: env(safe-area-inset-top); }

  /* Content padding voor bottom nav */
  main, .main, .content, .container { 
    padding-bottom: calc(49px + env(safe-area-inset-bottom) + 16px) !important; 
  }

  /* Tabel horizontaal scrollbaar */
  table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; overscroll-behavior-x: contain; width: 100%; }

  /* Formuliervelden full-width */
  input, select, textarea { width: 100%; box-sizing: border-box; font-size: 16px; }

  /* Bottom nav */
  .mobile-bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    border-top: 1px solid #EAE6E0;
    padding-bottom: env(safe-area-inset-bottom);
    z-index: 200;
  }
  .mobile-nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 49px;
    min-width: 44px;
    padding: 8px 0;
    text-decoration: none;
    color: #AAA;
    font-size: 11px;
    font-weight: 600;
  }
  .mobile-nav-item.active { color: #FF8514; }
  .mobile-nav-icon { font-size: 20px; margin-bottom: 2px; }
}
```

- [ ] **Stap 3: Voeg bottom nav HTML toe**

Direct vóór `</body>` in `webapp/public/account.html`:

```html
<!-- ── MOBILE BOTTOM NAV ── -->
<nav class="mobile-bottom-nav" aria-label="Hoofdnavigatie">
  <a href="/modules" class="mobile-nav-item" id="mobileNavModules">
    <span class="mobile-nav-icon">📚</span>
    <span class="mobile-nav-label">Modules</span>
  </a>
  <a href="/account" class="mobile-nav-item active" id="mobileNavAccount">
    <span class="mobile-nav-icon">👤</span>
    <span class="mobile-nav-label">Account</span>
  </a>
</nav>
```

Let op: hier is `active` op Account-item, niet Modules.

- [ ] **Stap 4: Verifieer in browser**

Open `http://localhost:3000/account` in Chrome DevTools met iPhone-emulatie.

Controleer:
- Bottom nav onderaan, Account-tab oranje
- Tabel horizontaal scrollbaar als hij te breed is
- Formuliervelden full-width
- Inhoud niet achter de nav verdwenen

- [ ] **Stap 5: Commit**

```bash
git add webapp/public/account.html
git commit -m "feat(mobile): mobiele CSS + bottom nav accountpagina"
```

---

## Task 7: Eindverificatie

- [ ] **Stap 1: Volledige moduleflow testen**

Webapp lokaal draaien: `cd webapp && node server.js`

In Chrome DevTools → iPhone 14 Pro Max:

1. Open `http://localhost:3000/modules` — bibliotheek zichtbaar, zijbalk weg, bottom nav aanwezig
2. Klik een module aan — module opent, header zichtbaar, "← Overzicht" tapsbaar
3. Navigeer door schermen — knoppen voldoende groot
4. Ga terug via "← Overzicht" — landing op `/modules`
5. Open `http://localhost:3000/account` — Account-tab actief in bottom nav

- [ ] **Stap 2: Desktop regressiecheck**

In Chrome zonder device emulatie (normale breedte >768px):

1. Zijbalk zichtbaar
2. Bottom nav niet zichtbaar
3. Stats 3-koloms grid
4. Cat-groepen klapbaar
5. Module-cards als grid (niet als lijst)

- [ ] **Stap 3: Finale commit en push indien gewenst**

```bash
git log --oneline -6
```

Verwacht: 6 commits zichtbaar van deze feature.

---

## Testnoot

Na lokale verificatie: handmatig testen op een echt iOS-apparaat in Safari én Chrome. Specifiek controleren:
- Safe-area op iPhone met Dynamic Island (padding-top header, padding-bottom content)
- Bottom nav zichtbaarheid bij openen toetsenbord
- Scroll-bounce op tabellen (`overscroll-behavior-x: contain`)

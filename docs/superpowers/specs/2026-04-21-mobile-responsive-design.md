# Spec: Mobiele responsiviteit e-learning webapp

**Datum:** 2026-04-21
**Status:** Goedgekeurd — klaar voor implementatie

---

## Doel

De volledige Umely e-learning webapp moet volledig functioneren op een telefoon (iOS Safari, iOS Chrome, Android Chrome). Desktop-gedrag blijft exact ongewijzigd — alle mobiele wijzigingen zijn puur additief.

---

## Scope

Twee losse lagen:

1. **Bibliotheekpagina** — `webapp/public/modules.html`
2. **Modulepagina's** — `module-content/_shared-css.html` (geldt voor alle 32 modules na `node build-modules.js && node upload-modules.js`)

Overige webapp-pagina's (`account.html`) worden meegenomen waar relevant maar zijn niet het primaire doel.

---

## Ontwerpbeslissingen

### Navigatiepatroon bibliotheek

**Keuze: bottom navigation**

Op mobiel verdwijnt de vaste 240px zijbalk. In plaats daarvan komt een bottom navigation bar met twee items: Modules (📚) en Account (👤). De zijbalk blijft op desktop volledig ongewijzigd.

Rationale: duimbereik, native app-gevoel, passend bij de twee primaire bestemmingen.

### Reeksfilter

**Keuze: geen filter — scroll met sectiekoppen**

Modules worden getoond als één doorlopende verticale lijst, gegroepeerd per reeks met een sectiekop per reeks (bijv. "Reeks A — Basis"). Geen filterknopjes.

Rationale: 32 modules verdeeld over 6 reeksen is goed scrollbaar. De "Doorgaan"-kaart bovenaan dekt 90% van de sessies. Filterlogica voegt complexiteit toe zonder noemenswaardige winst.

---

## Gedetailleerde vereisten

### A — Meta viewport (alle HTML-bestanden)

Alle `<meta name="viewport">` tags worden:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

`viewport-fit=cover` is vereist voor `env(safe-area-inset-*)` ondersteuning op iPhone met Dynamic Island en home indicator.

**Let op:** zodra `viewport-fit=cover` actief is, kan content onder de Dynamic Island (boven) en home indicator (onder) verdwijnen. De safe-area regels hieronder vangen dit op voor header, bottom nav én de hoofd-content-container.

---

### B — Bibliotheekpagina (`modules.html`)

**Breakpoint: ≤768px**

#### B1 — Header

```css
@media (max-width: 768px) {
  header {
    padding-top: env(safe-area-inset-top);
  }
}
```

De sticky header krijgt `padding-top: env(safe-area-inset-top)` zodat de inhoud niet onder de Dynamic Island of notch schuift.

#### B2 — Zijbalk verbergen

```css
@media (max-width: 768px) {
  .sidebar { display: none; }
  .layout { flex-direction: column; }
}
```

#### B3 — Bottom navigation

Nieuw HTML-element, direct vóór `</body>`:

```html
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

CSS:

```css
.mobile-bottom-nav {
  display: none;
}

@media (max-width: 768px) {
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

  .mobile-nav-item.active {
    color: #FF8514;
  }

  .mobile-nav-icon {
    font-size: 20px;
    margin-bottom: 2px;
  }
}
```

#### B4 — Content-container padding (safe area)

De hoofd-content-container krijgt op mobiel padding-bottom zodat content bij het scrollen niet onder de home indicator of bottom nav verdwijnt:

```css
@media (max-width: 768px) {
  .main {
    padding-bottom: calc(49px + env(safe-area-inset-bottom) + 16px);
  }
}
```

#### B5 — Stats-rij

```css
@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .stat-card {
    padding: 12px 10px;
  }

  .stat-value {
    font-size: 24px;
  }
}
```

Alle drie stats blijven zichtbaar. Waarde-font daalt van 30px naar 24px, padding compacter. Geen herstructurering naar 2+1.

#### B6 — Modulelijst met sectiekoppen

**Aanpak: CSS-only — geen JS renderpad.**

De bestaande `renderGrid()` JavaScript genereert al `.cat-group` blokken met een kop per reeks en een body met modules. Op desktop zijn deze klapbaar. Op mobiel worden ze geforceerd open gehouden via CSS en omgezet naar een verticale lijst — zonder enige JS-wijziging.

```css
@media (max-width: 768px) {
  .cat-group-body { display: block !important; }
  .cat-group-header { cursor: default !important; }
  .cat-group-chevron { display: none !important; }
  .cat-inner-grid { display: flex; flex-direction: column; gap: 6px; }
  .module-card { min-height: 44px; }
  .module-card:hover { transform: none; }
}
```

De `.cat-group-title` fungeert automatisch als sectiekop per reeks. Geen nieuwe klassen nodig.

---

### C — Modulepagina's (`_shared-css.html`)

**Breakpoint: ≤600px** (uitbreiding van bestaand blok)

#### C0 — Header safe area (modulepagina's)

Modulepagina's krijgen ook `viewport-fit=cover`. Hun eigen sticky header heeft daardoor ook een safe-area fix nodig:

```css
@media (max-width: 600px) {
  header {
    padding-top: env(safe-area-inset-top);
  }
}
```

Dit staat los van de webapp-header in B1 — dit geldt alleen voor de `_shared-css.html` scope.

#### C1 — Terugknop in module-header

Nieuw element in de header van elke module (via `build-modules.js` injectie):

```html
<a href="/modules" class="header-back">← Modules</a>
```

Dit is een `<a href="/modules">` — géén `history.back()`. Bij directe links of deeplinks werkt history-navigatie niet voorspelbaar.

De `.header-back` klasse bestaat al in de CSS:

```css
.header-back { font-size: 0.8rem; color: #FFF8F2; text-decoration: none; font-weight: 600; opacity: 0.6; }
.header-back:hover { opacity: 1; }
```

Tap target:

```css
@media (max-width: 600px) {
  .header-back {
    min-height: 44px;
    display: flex;
    align-items: center;
    padding: 0 8px 0 0;
  }
}
```

#### C2 — iOS input zoom voorkomen

```css
input, textarea, select {
  font-size: 16px;
}
```

Dit geldt globaal (niet alleen mobiel) — iOS zoomt in bij inputs kleiner dan 16px, ongeacht viewport-breedte.

#### C3 — Tap targets 44×44px

```css
@media (max-width: 600px) {
  .btn,
  .kc-optie,
  .quiz-optie,
  .scenario-keuze,
  .flashcard,
  .sorteer-item {
    min-height: 44px;
  }

  .btn-vorige {
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

#### C4 — Tabel scroll-isolatie

Tabellen scrollen horizontaal zonder de rest van de pagina mee te trekken:

```css
@media (max-width: 600px) {
  .vergelijk-tabel {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-x: contain;
  }
}
```

`overscroll-behavior-x: contain` voorkomt dat de pagina zelf meebeweegt bij het scrollen in de tabel.

#### C5 — Milestone toast positie

```css
@media (max-width: 600px) {
  .milestone-toast {
    bottom: calc(env(safe-area-inset-bottom) + 12px);
    right: 16px;
    left: 16px;
    max-width: none;
  }
}
```

Modulepagina's hebben geen bottom nav — de 49px van de webapp-nav hoort hier niet. Toast verschijnt boven de home indicator.

#### C6 — Navigatieknoppen

```css
@media (max-width: 600px) {
  .nav-buttons {
    gap: 8px;
  }

  .btn-vorige,
  .btn {
    flex: 1;
    text-align: center;
    justify-content: center;
  }
}
```

---

### D — Overige webapp-pagina's

`account.html`: gebruikerstabel krijgt `overflow-x: auto` en formuliervelden worden full-width op mobiel. Zelfde bottom-nav HTML-structuur als modules.html, maar met `active` op het Account-item (niet Modules). De active-state wordt bepaald door de huidige URL via JS bij paginaladen:

```js
// toevoegen aan bestaande init-logica in account.html
if (document.getElementById('mobileNavAccount')) {
  document.getElementById('mobileNavAccount').classList.add('active');
  document.getElementById('mobileNavModules').classList.remove('active');
}
```

---

## Aanpak

**Puur additief.** Geen bestaande CSS of JS wordt gewijzigd. Alle mobiele stijlen komen in duidelijk gemarkeerde blokken (`/* ── MOBILE ── */`). Desktop-gedrag is gegarandeerd ongewijzigd.

**Volgorde:**
1. `_shared-css.html` → `node build-modules.js` → `node upload-modules.js`
2. `webapp/public/modules.html`
3. `webapp/public/account.html`

---

## Buiten scope

- Native app (iOS/Android)
- PWA-installatie
- Offlinewerking
- Swipegebaren voor modulenavigatie

## Testnoot

Na implementatie handmatig testen in:
- iOS Safari (primair)
- iOS Chrome (andere render-quirks)
- Android Chrome

Specifiek controleren: scroll-bounce op tabellen, safe-area rendering op iPhone met Dynamic Island, bottom nav zichtbaarheid bij openen toetsenbord.

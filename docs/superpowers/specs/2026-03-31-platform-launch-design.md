# Umely E-learning Platform - Launch Design

**Datum:** 2026-03-31
**Doel:** Platform klaar voor eerste betalende gebruikers (95 euro/maand)
**Tijdlijn:** 3 dagen

---

## Context

25 e-learning modules over Claude AI, gebouwd als standalone HTML-bestanden. Webapp met login/signup, generatie via Claude API, opslag in Supabase. Moet binnen 3 dagen klaar zijn voor betalende klanten.

## Aanpak: Parallel (content + UI tegelijk)

- Dag 1: UI/navigatie fixes + content-scan alle 25 modules
- Dag 2: Content herschrijven (deep dives, fact-checks)
- Dag 3: Stripe + admin + Railway deploy

---

## Deel 1: UI/Navigatie

### 1.1 Module header - donkergrijs

**Wat:** De oranje gradient bovenaan modules ("Module 1 van 5") wordt charcoal.

**Wijziging in `module-content/_shared-css.html`:**
- Module header background: `#27292D` in plaats van oranje gradient
- Tekst: wit op donkere achtergrond
- Logo: `logo-small.png`, hoogte 28-32px, links in de header

**Wijziging in `webapp/prompt.md`:**
- CSS voor `.module-header` updaten naar `background: #27292D`

### 1.2 Navigatie binnen modules

**Wat:** Vorige-knop toevoegen naast bestaande Volgende-knop.

**Layout per scherm:**
- Welkomstscherm: alleen `[Start]`
- Inhoudschermen: `[< Vorige]  [Volgende >]`
- Quizscherm: `[< Vorige]  [Controleer antwoorden]`
- Resultaatscherm: `[Opnieuw]  [Volgende module >]`

**Implementatie:**
- `goTo()` functie bestaat al, vorige-knop roept `goTo(previousScreen)` aan
- Knoppen: pill-shaped, vorige = outline style, volgende = filled gradient
- In `_shared-js.html`: navigatie-logica die vorige scherm berekent uit SCHERMEN array

### 1.3 Terug naar homepage

**Wat:** Link in module header terug naar `/modules.html`.

**Implementatie:**
- `< Terug naar overzicht` linkje links in de module header naast logo
- Kleur: `rgba(255,255,255,0.75)`, hover: wit
- Altijd zichtbaar

### 1.4 Volgende module na afronding

**Wat:** Na quiz-afronding een knop om naar de volgende module te gaan.

**Implementatie:**
- Resultaatscherm krijgt extra knop: "Volgende module"
- Module-volgorde hardcoded in elke module (of via data-attribuut)
- Volgorde: A1, A2, A3, B1, B2, B3, C1-C7, D1-D3, E1-E7, I1, I2
- Laatste module (I2): knop wordt "Terug naar overzicht" (linkt naar `/modules.html`)
- Knop URL: `/modules/elearning-[volgende-slug]` (slug afgeleid uit vaste modulevolgorde in build-modules.js)

### 1.5 Categoriegroepen op modules.html

**Wat:** Modules gegroepeerd per categorie (A t/m I), uitklapbaar.

**Categorieen:**
- A - Introductie tot Claude (A1, A2, A3)
- B - Veiligheid & beperkingen (B1, B2, B3)
- C - Claude gebruiken (C1-C7)
- D - Claude Code (D1-D3)
- E - MCP & Skills (E1-E7)
- I - Praktijktoets (I1, I2)

**Implementatie:**
- Modules ophalen via `/api/modules`, client-side groeperen op basis van slug prefix
- Elke categorie = klikbare header met chevron (open/dicht)
- Standaard: alle dicht
- Klik = toggle submodules zichtbaar
- Categorie header toont: naam + aantal modules + voortgang (X van Y afgerond)

---

## Deel 2: Content kwaliteit

### 2.1 Content-scan (alle 25 modules)

Ik ga elke module door en check op:
- **Aannames/overstatements** (bijv. "Claude is verreweg de veiligste")
- **Te kort door de bocht** (bijv. "Claude heeft geen internettoegang" zonder nuance over web tools)
- **Te weinig diepgang** (onderwerp in 2-3 zinnen afgedaan)
- **Feitelijke onjuistheden**
- **Marketingpraat** die er niet in hoort

Output: lijst per module met alle gevonden problemen.

### 2.2 Deep dives

Per belangrijk onderwerp het 4-stappen patroon:
1. **Uitleg** (1-3 pagina's) - wat is het, waarom is het belangrijk
2. **Voorbeeld** - concreet, herkenbaar scenario
3. **Waar rekening mee houden** - praktische tips, valkuilen
4. **Interactie** - kennischeck of oefening

### 2.3 Herschrijven

Modules die problemen hebben worden herschreven met:
- Meer diepgang per onderwerp
- Genuanceerde uitspraken
- Concrete voorbeelden uit de praktijk
- Eerlijke beperkingen benoemd

---

## Deel 3: Stripe + Admin + Deploy

### 3.1 Stripe betaling

**Prijsmodel:**
- 95 euro/maand voor eerste 3 maanden
- Daarna 22,50 euro/maand voor updates, nieuws, nieuwe modules

**Implementatie:**
- Stripe Checkout sessie via server-side endpoint (`POST /api/create-checkout-session`)
- Stripe webhook (`POST /api/stripe-webhook`) verwerkt betalingsbevestiging
- Na betaling: Supabase user metadata updaten met `subscription_status: active`, `subscription_start`
- `requireSubscription` middleware op `/modules/:slug` checkt status
- Admins krijgen altijd toegang (bypass subscription check)

### 3.2 Gebruikerspagina + admin

**account.html bestaat al, moet afgemaakt worden:**
- Gebruiker ziet: eigen profiel, abonnementsstatus, voortgang per module
- Admin ziet extra: lijst alle gebruikers, modules bewerken/verwijderen, gebruiker admin maken
- Admin-check via Supabase user metadata (`role: 'admin'`)

### 3.3 Railway deployment

- Push naar GitHub (al gedaan)
- Railway project koppelen aan `dmobtained/umely-elearning-generator`
- Root directory instellen op `umely-elearning-generator/webapp`
- Environment variables instellen in Railway dashboard
- Custom domain configureren

---

## Bestanden die aangepast worden

| Bestand | Wijziging |
|---------|-----------|
| `module-content/_shared-css.html` | Header donkergrijs, navigatieknoppen styling |
| `module-content/_shared-js.html` | Vorige-knop logica, volgende-module logica |
| `module-content/elearning-*.html` | Alle 25: vorige-knop HTML, volgende-module link |
| `webapp/prompt.md` | Template updates (header, navigatie, volgende module) |
| `webapp/public/modules.html` | Categoriegroepen UI |
| `webapp/public/account.html` | Admin/user features afmaken |
| `webapp/server.js` | Stripe endpoints, subscription middleware |
| `build-modules.js` | Dynamische datum, volgende-module link per module |

## Risico's

- **Content herschrijven kost meer tijd dan verwacht** - mitigatie: prioriteer modules met meeste problemen
- **Stripe integratie complexiteit** - mitigatie: Stripe Checkout is relatief eenvoudig
- **25 modules herbouwen na template-wijziging** - mitigatie: `build-modules.js` automatiseert dit

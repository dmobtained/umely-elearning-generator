# Module Uitbreiding Design — 7 schermen per onderdeel

**Datum:** 2026-03-31
**Doel:** Modules uitbreiden van 3 naar 7 inhoudschermen per onderdeel voor premium kwaliteit (95 euro/maand)
**Pilot:** Module A1 — daarna uitrollen naar alle 25 modules

---

## Probleem

Huidige structuur per onderdeel (3 schermen) is te dun voor een betaald product:
- Uitleg, Verdieping, Praktijk → Kennischeck
- Voelt als gratis YouTube-cursus
- Te weinig diepgang, nuance en interactie

---

## Nieuwe structuur per onderdeel (7 schermen + kennischeck)

| # | Naam | Doel | Typisch component |
|---|------|------|-------------------|
| 1 | Introductie | Wat behandelen we + waarom relevant? | content-card + welcome-badge sfeer |
| 2 | Kernuitleg A | Eerste concept grondig | content-card + tip-box |
| 3 | Kernuitleg B | Tweede concept / verdieping | content-card + vergelijk-tabel of stappen |
| 4 | Nuance & context | Grijze gebieden, eerlijke beperkingen | content-card + tip-box.waarschuwing |
| 5 | Concreet scenario | Herkenbaar praktijkvoorbeeld | scenario-blok of stappen-lijst |
| 6 | Interactieve verdieping | Flashcards / tijdlijn / drag-drop | varieert per onderdeel |
| 7 | Praktijk + terugblik | Wat doe je morgen anders? | content-card met concrete acties |
| → | Kennischeck | 1 multiple choice vraag | kennischeck component |

---

## Schermtelling module A1

- 1 welkomstscherm
- 5 onderdelen × 8 schermen (7 + kc) = 40 schermen
- 1 quizscherm (5 vragen)
- 1 resultaatscherm

**Totaal: 42 schermen**

---

## Module A1 — Onderdelen en onderwerpen

| Onderdeel | Onderwerp |
|-----------|-----------|
| 1 | Wat is Anthropic? |
| 2 | Wat is Claude? |
| 3 | Claude vs andere AI-assistenten |
| 4 | Hoe werkt Claude technisch (voor niet-developers)? |
| 5 | Beperkingen van Claude |

---

## Interactieve verdieping per onderdeel (scherm 6)

| Onderdeel | Type interactie | Reden |
|-----------|-----------------|-------|
| 1 — Anthropic | Tijdlijn (oprichting → nu) | Past bij historisch verhaal |
| 2 — Claude | Flashcards (begrippen) | Begrippen vastzetten |
| 3 — Vergelijking | Vergelijktabel (Claude / ChatGPT / Gemini) | Visuele vergelijking |
| 4 — Technisch | Processtroom (input → model → output) | Visualiseert het proces |
| 5 — Beperkingen | Scenario (wel/niet doen) | Praktische herkenning |

---

## Technische aanpak

- Content-bestand: `module-content/elearning-a1-wat-is-claude.html`
- Bestaande `_shared-css.html` en `_shared-js.html` blijven ongewijzigd
- `build-modules.js` ongewijzigd — past automatisch aan op basis van SCHERMEN array
- Na build: `node upload-modules.js` voor Supabase upload
- Test via webapp op `/modules/elearning-a1-wat-is-claude-YYYYMMDD`

---

## Schrijfregels (uit CLAUDE.md)

- Geen m-dashes
- Geen overstatements ("Claude is verreweg de veiligste")
- Eerlijk over beperkingen
- Laagdrempelig maar inhoudelijk diep
- Fonts Arimo + Montserrat, kleuren uit `_shared-css.html`
- Nederlandse taal

---

## Uitrol naar alle 25 modules (na A1 goedkeuring)

Per categorie als batch:
- Batch 1: A2, A3 (introductie-reeks)
- Batch 2: B1, B2, B3 (veiligheid)
- Batch 3: C1-C4
- Batch 4: C5-C7 + D1-D3
- Batch 5: E1-E4
- Batch 6: E5-E7 + I1, I2

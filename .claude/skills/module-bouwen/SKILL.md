---
name: module-bouwen
description: Schrijf, fix of verbeter een Umely e-learning module in module-content/. Gebruik bij nieuwe modules, fixes, kwaliteitscheck of schermen toevoegen.
version: "1.0"
author: Umely
---

# Module Bouwen

Lees `CLAUDE.md` voor structuur, componenttypen en upload-pipeline. Deze skill voegt toe: **de zelfevaluatieprocedure die je altijd uitvoert voor je klaar bent**, en een lijst verboden patronen.

---

## Vóór je begint

1. Lees het bestaande bestand volledig
2. Plan componentmix (min. 5 typen, nooit twee dezelfde achter elkaar)
3. Plan KC-schermen apart van contentschermen

---

## Zelfevaluatie — doe dit altijd voor je klaar bent

Loop dit af. Elke FOUT fix je direct.

**Technisch**
- [ ] Elk `goTo('X')` → `<div id="X">` bestaat (of wordt door build toegevoegd: screen-quiz, screen-result)
- [ ] `checkKC(N,...)` → `id="kc-N"` en `id="kc-feedback-N"` aanwezig
- [ ] `checkScenario(N,...)` → `id="scenario-N"` en `id="scenario-feedback-N"` aanwezig
- [ ] SCHERMEN-array bevat alle screen-IDs + screen-quiz + screen-result
- [ ] Quiz JSON geldig, 5-7 vragen, elk met `uitleg`, correct-index binnen 0..opties.length-1
- [ ] Geen externe CDN-URLs (scripts, fonts, afbeeldingen)

**Structuur**
- [ ] Welkomscherm: `class="screen start"`, welcome-badge aanwezig, leerdoelen `<ul>` VOOR tijdsbadge
- [ ] Leerdoelen meetbaar: "je beschrijft / past toe / kiest" — nooit "je begrijpt"
- [ ] Kennischecks: elk op eigen `-kc` scherm, NOOIT embedded in contentscherm
- [ ] Laatste contentscherm: "Naar de afsluitquiz" knop aanwezig
- [ ] MODULE_TITELS: alle KC-schermen beschrijvend (nooit enkel "Kennischeck")
- [ ] Min. 5 componenttypen (3 voor leeropdracht/certificaat-modules)

**Design**
- [ ] Alle SVG viewBox breedtes zijn 580 (`viewBox="0 0 580 [hoogte]"`)
- [ ] Geen verboden kleuren: #F7F4F0, #FAFAF8, #F5F3EF, #3B82F6, #6366F1, #4CAF50, #28c840, #ff5f57, #febc2e
- [ ] Alle flashcards: `onclick="toggleFlashcard(this)"`
- [ ] Module-header: geen gradient, geen oranje

**Schrijven**
- [ ] Geen m-dashes in HTML-tekst (—) → gebruik `:` `.` `,` of haakjes
- [ ] Geen tijdsgebonden taal ("op dit moment", "in 2025", "nieuwste versie")
- [ ] Geen prijsbedragen (€XX / $XX) → "zie claude.ai/pricing"
- [ ] Elke waarschuwing heeft concrete vervolgstap

---

## Verboden patronen

| Verboden | Correct |
|---|---|
| `class="module-naam"` | `class="module-num"` |
| KC embedded in contentscherm | Eigen `-kc` scherm |
| `onclick="toggleFlashcard()"` | `onclick="toggleFlashcard(this)"` |
| `viewBox="0 0 680 ..."` | `viewBox="0 0 580 ..."` |
| `fill="#F7F4F0"` | `fill="#FFF8F2"` |
| `fill="#4CAF50"` | `fill="#22c55e"` |
| `fill="#3B82F6"` of blauw | `fill="#FF8514"` |
| `font-family="Courier New"` in SVG | `font-family="Arial, sans-serif"` |
| MODULE_TITELS waarde `'Kennischeck'` | `'Kennischeck: wat de kc test'` |
| Lege `<div class="btn-wrap">` | Altijd vullen met actieknop |
| M-dash in `<p>` of `<h>` tekst | `:` of `.` of `,` |

---

## Afsluiten

```bash
node build-modules.js
node validate-modules.js   # moet 0 fouten teruggeven
node upload-modules.js
git add module-content/elearning-[slug].html
git commit -m "feat/fix: [slug] — [wat je deed]"
```

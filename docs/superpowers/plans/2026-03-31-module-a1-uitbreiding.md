# Module A1 Uitbreiding — 7 schermen per onderdeel

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Module A1 (Wat is Claude en Anthropic?) herschrijven met 7 inhoudschermen per onderdeel, bouwen en uploaden naar Supabase voor webapp-test.

**Architecture:** Bestaand content-bestand `module-content/elearning-a1-wat-is-claude.html` volledig vervangen met nieuwe structuur. `_shared-css.html` en `_shared-js.html` blijven ongewijzigd. `build-modules.js` genereert de output automatisch op basis van SCHERMEN-array.

**Tech Stack:** Vanilla HTML, bestaande CSS-componenten uit `_shared-css.html`, Node.js build-script, Supabase upload via `upload-modules.js`

---

## Schermoverzicht A1 (43 schermen totaal)

```
screen-welcome
--- Onderdeel 1: Wat is Anthropic? ---
screen-module-1-1  Introductie         content-card
screen-module-1-2  Kernuitleg A        content-card + tip-box
screen-module-1-3  Kernuitleg B        content-card + stappen-lijst
screen-module-1-4  Nuance & context    content-card + tip-box.waarschuwing
screen-module-1-5  Concreet scenario   scenario-blok
screen-module-1-6  Interactieve verd.  tijdlijn (2021→2025)
screen-module-1-7  Praktijk + terugblik content-card
screen-module-1-kc Kennischeck

--- Onderdeel 2: Wat is Claude? ---
screen-module-2-1  Introductie         content-card
screen-module-2-2  Kernuitleg A        content-card + tip-box
screen-module-2-3  Kernuitleg B        content-card + vergelijk-tabel (versies)
screen-module-2-4  Nuance & context    content-card + tip-box.waarschuwing
screen-module-2-5  Concreet scenario   stappen-lijst (werkdag met Claude)
screen-module-2-6  Interactieve verd.  flashcards (LLM, tokens, context, prompt)
screen-module-2-7  Praktijk + terugblik content-card
screen-module-2-kc Kennischeck

--- Onderdeel 3: Claude vs andere AI's ---
screen-module-3-1  Introductie         content-card
screen-module-3-2  Kernuitleg A        content-card (ChatGPT/OpenAI)
screen-module-3-3  Kernuitleg B        content-card (Gemini + Copilot)
screen-module-3-4  Nuance & context    content-card + tip-box
screen-module-3-5  Concreet scenario   scenario-blok (welke tool voor welke taak)
screen-module-3-6  Interactieve verd.  vergelijk-tabel (Claude/ChatGPT/Gemini/Copilot)
screen-module-3-7  Praktijk + terugblik content-card
screen-module-3-kc Kennischeck

--- Onderdeel 4: Hoe werkt Claude (niet-technisch)? ---
screen-module-4-1  Introductie         content-card
screen-module-4-2  Kernuitleg A        content-card (training op tekst)
screen-module-4-3  Kernuitleg B        content-card (context window + geheugen)
screen-module-4-4  Nuance & context    content-card + tip-box.waarschuwing (weten vs genereren)
screen-module-4-5  Concreet scenario   scenario-blok (waarom fouten?)
screen-module-4-6  Interactieve verd.  processtroom (input → model → output)
screen-module-4-7  Praktijk + terugblik content-card
screen-module-4-kc Kennischeck

--- Onderdeel 5: Beperkingen van Claude ---
screen-module-5-1  Introductie         content-card
screen-module-5-2  Kernuitleg A        content-card (geen internet, geen geheugen)
screen-module-5-3  Kernuitleg B        content-card (hallucinations)
screen-module-5-4  Nuance & context    content-card + tip-box
screen-module-5-5  Concreet scenario   scenario-blok (Claude maakt fout, wat doe je?)
screen-module-5-6  Interactieve verd.  kennischeck-scenario (wel/niet doen)
screen-module-5-7  Praktijk + terugblik content-card
screen-module-5-kc Kennischeck

screen-quiz
screen-result
```

## SCHERMEN array (voor bovenaan content-bestand)

```
'screen-welcome',
'screen-module-1-1','screen-module-1-2','screen-module-1-3','screen-module-1-4','screen-module-1-5','screen-module-1-6','screen-module-1-7','screen-module-1-kc',
'screen-module-2-1','screen-module-2-2','screen-module-2-3','screen-module-2-4','screen-module-2-5','screen-module-2-6','screen-module-2-7','screen-module-2-kc',
'screen-module-3-1','screen-module-3-2','screen-module-3-3','screen-module-3-4','screen-module-3-5','screen-module-3-6','screen-module-3-7','screen-module-3-kc',
'screen-module-4-1','screen-module-4-2','screen-module-4-3','screen-module-4-4','screen-module-4-5','screen-module-4-6','screen-module-4-7','screen-module-4-kc',
'screen-module-5-1','screen-module-5-2','screen-module-5-3','screen-module-5-4','screen-module-5-5','screen-module-5-6','screen-module-5-7','screen-module-5-kc',
'screen-quiz','screen-result'
```

## Afsluitquiz — 5 vragen

1. In welk jaar werd Anthropic opgericht?
   Opties: 2019 / 2021 / 2023 / 2015 — Correct: 2021

2. Wat is een context window?
   Opties: De schermgrootte van je browser / De hoeveelheid tekst die Claude tegelijk kan verwerken / Het aantal tokens dat een model kost / De snelheid waarmee Claude antwoord geeft
   Correct: De hoeveelheid tekst die Claude tegelijk kan verwerken

3. Wat is een hallucination bij een AI-model?
   Opties: Een visuele bug in de interface / Een antwoord dat klinkt als feit maar verzonnen is / Een langzame responstijd / Een weigering om een vraag te beantwoorden
   Correct: Een antwoord dat klinkt als feit maar verzonnen is

4. Wat is het belangrijkste verschil tussen Claude en ChatGPT?
   Opties: Claude is gratis, ChatGPT niet / Claude kan code schrijven, ChatGPT niet / Ze zijn gebouwd door verschillende bedrijven met andere prioriteiten / Claude heeft altijd internettoegang
   Correct: Ze zijn gebouwd door verschillende bedrijven met andere prioriteiten

5. Waarom heeft Claude standaard geen geheugen tussen gesprekken?
   Opties: Technische beperking die nog opgelost wordt / Privacy- en architectuurkeuze / Kosten besparen / Claude verwijdert bewust gesprekken
   Correct: Privacy- en architectuurkeuze

---

## Task 1: Schrijf A1 content-bestand

**Files:**
- Modify: `umely-elearning-generator/module-content/elearning-a1-wat-is-claude.html`

- [ ] Vervang het volledige bestand met de nieuwe structuur
- [ ] Bovenaan: `<!-- TITLE: A1 - Wat is Claude en Anthropic? -->`
- [ ] Bovenaan: `<!-- SCHERMEN: ... -->` (zie array hierboven)
- [ ] Bovenaan: `<!-- MODULE_TITELS: ... -->` (elke screen-id krijgt een titel)
- [ ] Bovenaan: `<!-- QUIZ_START --> [...] <!-- QUIZ_END -->` (5 vragen hierboven)
- [ ] Schrijf alle 43 screen-divs (welcome + 5×8 + quiz + result niet nodig — die genereert build-modules.js)
- [ ] Gebruik variatie in CSS-componenten per scherm (zie schermoverzicht)
- [ ] Geen m-dashes, geen overstatements, geen placeholder-tekst
- [ ] Elke kennischeck gebruikt `checkKC(nr, el, isCorrect, volgendeScherm, uitleg)`

## Task 2: Build

**Files:**
- Read: `umely-elearning-generator/build-modules.js`

- [ ] Navigeer naar de juiste map:
```bash
cd "C:\Users\davem\Desktop\DataDenkt\umely-elearning-generator\umely-elearning-generator"
node build-modules.js
```
- [ ] Verwacht output: `elearning-a1-wat-is-claude-YYYYMMDD.html` in `output/`
- [ ] Controleer dat er geen build-fouten zijn

## Task 3: Upload naar Supabase

- [ ] Run upload script:
```bash
cd "C:\Users\davem\Desktop\DataDenkt\umely-elearning-generator\umely-elearning-generator"
node upload-modules.js
```
- [ ] Verwacht: module verschijnt in Supabase `modules` tabel met juiste slug
- [ ] Test in webapp via `/modules/elearning-a1-wat-is-claude-YYYYMMDD`

## Task 4: Handmatig testen

- [ ] Navigeer door alle 43 schermen
- [ ] Test kennischeck in elk onderdeel
- [ ] Test afsluitquiz (5 vragen)
- [ ] Test resultaatscherm + certificaat bij score >=70%
- [ ] Test Vorige/Volgende navigatie
- [ ] Controleer op m-dashes of placeholder-tekst

---
name: elearning-generator
description: Genereer automatisch een complete interactieve e-learning HTML module vanuit een transcriptie of samenvatting. Gebruik deze skill wanneer de gebruiker een transcriptie, samenvatting of videocontent aanlevert en vraagt om een e-learning, cursus, module of leermateriaal te maken.
version: "4.0"
author: Umely
---

# E-learning Generator Skill

## Centrale bron van waarheid

De instructies en boilerplate zijn gesplitst in twee bestanden:

- **`webapp/prompt.md`** — instructies, structuurregels, 14 componenttypen (~70 regels)
- **`webapp/boilerplate.html`** — alle CSS, JS-functies en vaste HTML-blokken

Lees `webapp/prompt.md` voor de regels. Gebruik `webapp/boilerplate.html` als exacte startbasis: kopieer alle CSS en JS letterlijk over, vervang alleen de schermen en de drie aanpasbare JS-variabelen (SCHERMEN, MODULE_TITELS, quizVragen).

## Wanneer activeer je deze skill?
- Gebruiker geeft een transcriptie, samenvatting of tekst aan
- Gebruiker vraagt om een e-learning, cursus of module te maken
- Trefwoorden: "genereer e-learning", "maak cursus", "zet om naar module"

## Werkwijze

### Stap 1 - Lees de instructies
Lees `webapp/prompt.md`. Gebruik `webapp/boilerplate.html` als startbasis voor het HTML-bestand.

### Stap 2 - Analyseer het bronmateriaal
Identificeer uit de transcriptie:
- Hoofdonderwerp, wordt de module-titel
- 4-8 kernthema's, worden de modules
- Concrete feiten, tips, voorbeelden, voor interacties en quizvragen
- Niveau van de doelgroep, pas taalgebruik aan
- Geschikte componenttypen per thema (processen? stappenuitleg. Termen? flashcards. Vergelijking? tabel.)

### Stap 3 - Plan de componentmix
Voordat je begint met HTML schrijven, plan welke componenten je per module gebruikt.
Zorg voor:
- Minimaal 5 verschillende componenttypen in totaal
- Nooit twee dezelfde interactievormen achter elkaar
- Elke module minimaal 1 interactief of visueel component
- Maximaal 2 tekstcomponenten achter elkaar

### Stap 4 - Genereer het HTML-bestand
Gebruik `webapp/boilerplate.html` als basis. Kopieer alle CSS en JS letterlijk. Voeg de schermen toe op de plek van het `<!-- SCHERMEN HIER -->` comment. Pas SCHERMEN, MODULE_TITELS en quizVragen aan.
Output: een volledig werkend HTML-bestand.
Sla op als: `output/elearning-[onderwerp]-[YYYYMMDD].html`

### Stap 5 - Test lokaal voor opslaan
Voer altijd een geautomatiseerde test uit op het gegenereerde bestand voordat het naar Supabase gaat:

```bash
node test-elearning.js output/elearning-[bestand].html
```

Controleer minimaal:
- Start-knop aanwezig en linkt naar screen-module-1
- Alle kennischecks: `id="kc-N"` en `id="kc-feedback-N"` aanwezig
- Quiz-IDs aanwezig: `quiz-voortgang`, `quiz-vraag-tekst`, `quiz-opties`, `quiz-feedback`, `quiz-volgende-btn`
- Resultaat-IDs aanwezig: `score-display`, `resultaat-boodschap`, `certificaat-blok`, `cert-datum`
- Alle functies top-level gedefinieerd (niet in DOMContentLoaded)
- SCHERMEN-array compleet met alle screen-IDs
- Minimaal 5 verschillende componenttypen gebruikt

**Pas na een geslaagde test mag de module in Supabase worden opgeslagen.**

## Nooit doen
- Inter, Roboto of system-ui als primair font gebruiken
- Oranje of gradient als header-achtergrond
- Placeholder tekst laten staan
- CSS of JS afwijken van boilerplate.html
- Dezelfde structuur in elke module (altijd variëren)
- Marketingpraat of overdreven claims
- M-dashes gebruiken
- html-template.md gebruiken (vervangen door boilerplate.html)
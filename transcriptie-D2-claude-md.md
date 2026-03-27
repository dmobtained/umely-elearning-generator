# Transcriptie: D2 — CLAUDE.md: Projectgeheugen

## Wat leer je in deze module?
Je leert wat een CLAUDE.md-bestand is, waarom het bestaat en hoe je het gebruikt om Claude Code te voorzien van vaste context voor een project. Na deze module kun je een CLAUDE.md aanmaken die Claude Code automatisch inleest bij elke sessie.

## Wat is CLAUDE.md?

CLAUDE.md is een tekstbestand dat je aanmaakt in een projectmap. Elke keer dat je Claude Code opstart in die map, leest hij dit bestand automatisch in. Alles wat erin staat — instructies, context, regels, voorkeuren — weet Claude Code dan direct, zonder dat je het elke keer opnieuw hoeft te vertellen.

Vergelijk het met een interne briefing die je aan een nieuwe medewerker geeft: dit zijn onze regels, dit is hoe wij werken, dit zijn de dingen die je altijd moet doen of nooit moet doen.

## Waarom is dit handig?

Zonder CLAUDE.md begin je elke sessie met Claude Code met een schone lei. Je moet elke keer opnieuw uitleggen wie je bent, wat het project is, welke regels er gelden. Dat kost tijd en leidt tot inconsistente resultaten.

Met een goed CLAUDE.md-bestand heeft Claude Code direct de juiste context en werkt hij consistenter.

## Wat zet je in een CLAUDE.md?

Een CLAUDE.md bevat typisch:

**Wie je bent en wat het project is:**
"Dit is het project voor makelaarskantoor De Vries. We verwerken hier bezichtigingsrapporten en klantcommunicatie."

**Technische context:**
"Bestanden worden opgeslagen in de map /Documenten/Klanten/2026. Rapporten staan in PDF-formaat. Samenvattingen worden opgeslagen als .txt."

**Gedragsregels:**
"Schrijf altijd in het Nederlands. Gebruik een professionele maar vriendelijke toon. Vraag altijd om bevestiging voordat je een bestand overschrijft."

**Wat je nooit wilt:**
"Verwijder nooit bestanden zonder expliciete instructie. Maak geen wijzigingen buiten de aangewezen mappen."

## Hoe maak je een CLAUDE.md aan?

Open de terminal in je projectmap en typ:
```
claude
```
Dan typ je aan Claude Code:
"Maak een CLAUDE.md aan in deze map met de volgende inhoud: [jouw instructies]"

Of je maakt het bestand handmatig aan via een tekstverwerker — sla het op als CLAUDE.md (hoofdletters, zonder spaties) in de hoofdmap van je project.

## Houd het kort en praktisch

Een CLAUDE.md die te lang is werkt minder goed. Houd het onder de 200 regels. Schrijf alleen wat echt relevant is voor het dagelijkse werk in dit project. Alles wat je nooit gaat gebruiken is ruis.

Behandel CLAUDE.md als een levend document: pas het aan als je merkt dat Claude Code een fout maakt die je niet wilt herhalen. "Voeg toe aan CLAUDE.md: maak nooit een bestand aan met de naam 'definitief' — gebruik altijd een datum in de bestandsnaam."

## Samenvatting

CLAUDE.md is het geheugenbestand van een project in Claude Code. Het bevat context, regels en voorkeuren die Claude Code automatisch inleest bij elke sessie. Zonder CLAUDE.md begin je elke keer opnieuw. Met een goed CLAUDE.md werkt Claude Code consistenter en hoef je minder te herhalen. Houd het kort, praktisch en up-to-date.

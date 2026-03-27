# Transcriptie: E4 — Agent Skills en SKILL.md begrijpen

## Wat leer je in deze module?
Je leert wat Skills zijn in de context van Claude Code, hoe een SKILL.md-bestand werkt en hoe Skills ervoor zorgen dat Claude Code consistent hetzelfde doet zonder dat je elke keer opnieuw moet uitleggen hoe. Na deze module begrijp je het concept en kun je beoordelen wanneer een Skill nuttig is.

## Wat is een Skill?

Een Skill is een herbruikbaar instructiepakket voor een specifieke taak. Je schrijft één keer op wat Claude moet doen — stap voor stap, met regels en voorkeuren — en slaat dat op in een SKILL.md-bestand. Daarna laadt Claude Code die Skill automatisch als de taak overeenkomt.

Het is vergelijkbaar met een werkprocedure in een bedrijf: je schrijft één keer op hoe iets gedaan moet worden, en iedereen — inclusief Claude — volgt die procedure.

## Waarom zijn Skills nuttig?

Zonder Skills moet je Claude Code elke keer opnieuw uitleggen hoe hij een specifieke taak moet uitvoeren. Met een Skill doet hij dat automatisch, consistent en op de manier die jij hebt vastgelegd.

Voorbeeld: je verwerkt elke week tientallen bezichtigingsrapporten op dezelfde manier — samenvatten in vijf punten, opslaan met een specifieke bestandsnaam, toevoegen aan een overzichtsbestand. Zonder Skill geef je die instructies elke week opnieuw. Met een Skill geef je één keer de opdracht: "Verwerk de rapporten" — en Claude weet de rest.

## Hoe ziet een SKILL.md eruit?

Een SKILL.md is een tekstbestand in een vaste structuur:

```
---
name: bezichtigingsrapport-verwerken
description: Gebruik deze Skill als je bezichtigingsrapporten wilt verwerken
---

# Bezichtigingsrapport verwerken

## Stappen
1. Lees het PDF-bestand volledig
2. Maak een samenvatting van vijf bullet points
3. Sla de samenvatting op als [originele-naam]-samenvatting.txt
4. Voeg de bestandsnaam toe aan het overzichtsbestand rapporten-overzicht.txt

## Regels
- Schrijf altijd in het Nederlands
- Gebruik geen jargon
- De samenvatting mag maximaal 200 woorden zijn
```

De beschrijving bovenaan is cruciaal: Claude leest die om te bepalen of de Skill relevant is voor een opdracht. Een goede beschrijving zorgt dat de Skill op het juiste moment wordt geladen.

## Waar sla je Skills op?

Skills sla je op in een map `.claude/skills/` in je projectmap. Claude Code scant die map automatisch en laadt de juiste Skill op basis van de beschrijving en de opdracht die je geeft.

## Wanneer maak je een Skill?

Maak een Skill als:
- Je een taak regelmatig herhaalt op exact dezelfde manier
- De taak meerdere stappen heeft die altijd in dezelfde volgorde moeten
- Je wilt dat Claude Code consistent werkt zonder extra instructies

Maak geen Skill voor taken die je maar één keer uitvoert of die elke keer anders zijn.

## Samenvatting

Skills zijn herbruikbare instructiepakketten die je opslaat in SKILL.md-bestanden. Claude Code laadt ze automatisch als de taak overeenkomt. Skills zijn nuttig voor herhalende taken met vaste stappen en regels. Een goede beschrijving in de SKILL.md zorgt dat de Skill op het juiste moment wordt ingeladen. Begin met één Skill voor je meest herhalende taak en bouw van daaruit verder.

# Transcriptie: E5 — Je eerste Skill bouwen

## Wat leer je in deze module?
Je leert stap voor stap hoe je je eerste Skill bouwt — van het kiezen van de juiste taak tot het schrijven van de SKILL.md en het testen van de Skill in de praktijk. Na deze module heb je een werkende Skill voor een taak die jij regelmatig doet.

## Stap 1: Kies de juiste taak

Begin met een taak die je regelmatig doet, die altijd op dezelfde manier werkt en waarbij je nu telkens dezelfde instructies geeft aan Claude Code. Goede voorbeelden:

- Elke week bezichtigingsrapporten samenvatten
- Elke maand facturen verwerken en categoriseren
- Elke dag nieuwe e-mails sorteren en prioriteren
- Standaardbrieven opstellen op basis van een template

Slechte voorbeelden voor een eerste Skill:
- Taken die elke keer anders zijn
- Taken die je maar één keer uitvoert
- Taken waarbij je nog niet weet hoe je ze het beste aanpakt

## Stap 2: Schrijf de stappen op

Voordat je de SKILL.md schrijft, schrijf je de stappen op in gewone taal — alsof je het uitlegt aan een nieuwe collega. Wees specifiek:

Slecht: "Verwerk het rapport"
Goed: "Lees het PDF-bestand volledig, maak een samenvatting van maximaal 200 woorden in vijf bullet points, sla de samenvatting op als [originele-naam]-samenvatting.txt in de map Samenvattingen, voeg de bestandsnaam toe aan het logbestand overzicht.txt"

Hoe specifieker de stappen, hoe consistenter de Skill werkt.

## Stap 3: Schrijf de SKILL.md

Maak een bestand aan in de map `.claude/skills/` in je projectmap. Geef het een duidelijke naam, bijvoorbeeld `bezichtiging-verwerken.md`. De structuur:

```
---
name: bezichtiging-verwerken
description: Gebruik deze Skill als je een bezichtigingsrapport wilt verwerken en samenvatten
---

# Bezichtigingsrapport verwerken

## Stappen
1. Lees het PDF-bestand volledig
2. Maak een samenvatting van maximaal 200 woorden in vijf bullet points
3. Sla de samenvatting op als [originele-naam]-samenvatting.txt in de map Samenvattingen
4. Voeg de bestandsnaam en datum toe aan overzicht.txt

## Regels
- Schrijf altijd in het Nederlands
- Gebruik geen jargon
- Vraag om bevestiging als een bestand al bestaat
```

## Stap 4: Test de Skill

Open Claude Code in je projectmap en geef een opdracht die overeenkomt met de beschrijving van je Skill:

"Verwerk het bezichtigingsrapport Hoofdstraat12.pdf"

Claude Code laadt automatisch de juiste Skill en voert de stappen uit. Controleer of het resultaat klopt. Als iets niet goed gaat, pas je de SKILL.md aan en test je opnieuw.

## Stap 5: Verfijn

Na de eerste test merk je meestal dingen die beter kunnen. Misschien wil je dat de samenvatting korter is, of dat Claude een andere bestandsnaam gebruikt. Pas de SKILL.md aan, sla op en test opnieuw. Skills worden beter naarmate je ze vaker gebruikt en bijschaaft.

## Veelgemaakte fouten bij het bouwen van Skills

**De beschrijving is te vaag:** Als de beschrijving niet duidelijk aangeeft wanneer de Skill gebruikt moet worden, laadt Claude hem op het verkeerde moment of helemaal niet. Wees specifiek in de beschrijving.

**De stappen zijn te algemeen:** "Verwerk het bestand" is geen bruikbare stap. Schrijf precies wat er moet gebeuren.

**Te veel in één Skill:** Een Skill die tien verschillende taken uitvoert is moeilijk te onderhouden en geeft inconsistente resultaten. Maak liever meerdere kleine Skills dan één grote.

## Samenvatting

Je bouwt een Skill in vijf stappen: kies een herhalende taak, schrijf de stappen op in gewone taal, maak de SKILL.md aan in de juiste map, test de Skill, en verfijn op basis van de uitkomst. Een goede beschrijving is cruciaal — die bepaalt wanneer Claude de Skill laadt. Begin klein en bouw uit.

# Transcriptie: D3 — Plan Mode, Commando's en Hooks

## Wat leer je in deze module?
Je leert drie geavanceerde functies van Claude Code: Plan Mode (eerst plannen, dan uitvoeren), veelgebruikte commando's, en Hooks (automatische acties op bepaalde momenten). Na deze module gebruik je Claude Code efficiënter en heb je meer controle over wat hij doet.

## Plan Mode

Standaard voert Claude Code direct uit wat je vraagt — hij maakt het plan en voert het meteen uit. Plan Mode verandert dat: Claude maakt eerst een gedetailleerd plan van wat hij gaat doen, en wacht op jouw goedkeuring voordat hij begint.

Je schakelt Plan Mode in door voor je opdracht te typen:
```
/plan [jouw opdracht]
```

Voorbeeld:
```
/plan Verwerk alle PDF-bestanden in de map Rapporten: maak per bestand een samenvatting en sla die op in de map Samenvattingen
```

Claude beschrijft dan stap voor stap wat hij gaat doen. Jij keurt goed, past aan of zegt nee.

**Wanneer gebruik je Plan Mode?**
Gebruik Plan Mode voor taken met veel stappen, taken op grote aantallen bestanden, of elke keer dat je niet zeker weet wat Claude gaat doen. Het kost iets meer tijd maar geeft je volledige controle.

## Veelgebruikte commando's

Claude Code heeft een aantal ingebouwde commando's die je workflow versnellen:

**/help** — toont een overzicht van beschikbare commando's

**/clear** — wist het huidige gesprek en begint schoon

**/memory** — toont wat Claude Code onthouden heeft over je project

**/cost** — toont hoeveel API-kosten de huidige sessie heeft gemaakt

**/exit** of **Ctrl+C** — sluit Claude Code af

Deze commando's typ je direct in het invoerveld, beginnend met een slash.

## Hooks

Hooks zijn automatische acties die Claude Code uitvoert op vaste momenten — zonder dat je er elke keer om hoeft te vragen. Je stelt een Hook in door het te beschrijven in je CLAUDE.md of door Claude Code te instrueren.

Voorbeelden van Hooks:

**Voor elke sessie:** "Aan het begin van elke sessie: toon een overzicht van alle bestanden in de map Nieuw die vandaag zijn toegevoegd."

**Na elke opdracht:** "Na het aanmaken van een samenvatting: voeg de bestandsnaam en datum toe aan het logbestand sessie-log.txt."

**Bij een specifieke actie:** "Elke keer dat je een bestand overschrijft: maak eerst een back-up in de map Archief."

Hooks zijn krachtig voor terugkerende workflows. Ze werken het beste als je ze concreet en simpel houdt. Complexe Hooks kunnen onverwacht gedrag veroorzaken — begin eenvoudig.

## Commando's combineren

Je kunt commando's en Plan Mode combineren voor maximale controle:

```
/plan Gebruik de Hooks uit CLAUDE.md en verwerk de bestanden in de map Inbox
```

Claude maakt dan een plan inclusief alle automatische acties, zodat je precies weet wat er gaat gebeuren voordat het begint.

## Samenvatting

Plan Mode laat Claude Code eerst een plan maken voor je goedkeuring — gebruik dit voor complexe of grote taken. Slash-commando's geven je snel toegang tot hulp, geheugen, kosten en een schone start. Hooks automatiseren terugkerende acties zonder dat je er elke keer om hoeft te vragen. Begin eenvoudig met Hooks en bouw uit naarmate je meer ervaring krijgt.

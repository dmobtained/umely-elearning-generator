# Transcriptie: D1 — Claude Code: Wat is het en hoe start je?

## Wat leer je in deze module?
Je leert wat Claude Code is, waarom het anders is dan de web-app, en hoe je het installeert en opstart. Na deze module kun je Claude Code zelf opstarten en je eerste opdracht geven — zonder technische voorkennis.

## Wat is Claude Code?

Claude Code is een versie van Claude die je gebruikt via de terminal — een tekstgebaseerd scherm op je computer. In de web-app stel je één vraag en krijg je één antwoord. Claude Code kan meerdere stappen achter elkaar uitvoeren: bestanden lezen, mappen aanmaken, tekst schrijven, bestanden aanpassen — allemaal op jouw instructie.

Voor een kantoor betekent dit: je kunt Claude Code vragen om tientallen documenten te verwerken, een mappenstructuur aan te maken of herhalende taken te automatiseren — zonder dat je zelf elke stap hoeft uit te voeren.

Claude Code is niet alleen voor programmeurs. Als je gewone zinnen kunt typen, kun je Claude Code gebruiken.

## Wat is een terminal?

Een terminal is een programma op je computer waar je tekst-opdrachten intypt. Op Windows heet het "Command Prompt" of "PowerShell". Op Mac heet het "Terminal". Je kunt het openen via de zoekfunctie van je computer.

Het ziet er kaal uit — geen knoppen, geen menu's — maar dat is precies wat het krachtig maakt. Je typt een opdracht in gewone taal, Claude voert het uit.

## Installatie

Om Claude Code te installeren heb je Node.js nodig — een gratis programma dat je kunt downloaden via nodejs.org. Kies de LTS-versie (Long Term Support) — dat is de stabiele versie.

Na installatie van Node.js open je de terminal en typ je:
```
npm install -g @anthropic-ai/claude-code
```
Druk op Enter en wacht tot de installatie klaar is. Dit duurt een paar minuten.

Daarna typ je:
```
claude
```
Claude vraagt je om in te loggen met je Anthropic-account. Na het inloggen ben je klaar.

## Je eerste opdracht

Als Claude Code opgestart is, typ je gewoon wat je wilt. Een paar voorbeelden:

"Maak een map aan op mijn bureaublad met de naam Klanten 2026 en maak daarin vier submappen: Q1, Q2, Q3, Q4."

"Lees het bestand rapport.pdf in de map Downloads en geef mij een samenvatting van de vijf belangrijkste punten."

"Zoek alle bestanden in de map Contracten die de afgelopen 30 dagen niet zijn geopend."

Claude Code vraagt soms om bevestiging voordat hij iets uitvoert — type `y` voor ja of `n` voor nee.

## Wat kan Claude Code wel en niet?

Claude Code is sterk in het verwerken van bestanden, het aanmaken van structuren en het uitvoeren van herhalende taken. Heeft je vijftien Word-documenten die allemaal een nieuwe naam moeten krijgen? Claude Code doet dat in seconden.

Wat Claude Code niet kan: hij heeft geen toegang tot het internet tenzij je dat instelt, hij kan programma's als Word of Excel niet rechtstreeks openen, en hij werkt alleen met bestanden op jouw computer of in mappen waartoe hij toegang heeft.

## Veiligheid

Claude Code vraagt altijd om bevestiging bij ingrijpende acties zoals het verwijderen of overschrijven van bestanden. Je ziet altijd wat hij van plan is voordat hij het doet. Maak een back-up van belangrijke bestanden voordat je Claude Code op een grote map loslaat.

## Samenvatting

Claude Code is een versie van Claude die je via de terminal gebruikt en die meerdere stappen achter elkaar kan uitvoeren op je computer. Installatie vereist Node.js en een Anthropic-account. Je geeft opdrachten in gewone taal. Claude Code is geschikt voor bestandsverwerking, mapbeheer en herhalende taken — geen programmeerkennis vereist.

# Transcriptie: E6 — Agentic Workflows Ontwerpen

## Wat leer je in deze module?
Je leert wat agentic workflows zijn, hoe je ze ontwerpt en wanneer ze zinvol zijn. Na deze module kun je beoordelen welke werkprocessen in jouw organisatie geschikt zijn voor automatisering met Claude en hoe je die automatisering verantwoord opzet.

## Wat is een agentic workflow?

Een agentic workflow is een reeks taken die Claude zelfstandig uitvoert — stap voor stap, zonder dat jij elke stap handmatig goedkeurt. Claude neemt beslissingen onderweg op basis van de instructies die je hem hebt gegeven.

Voorbeeld: elke ochtend haalt Claude nieuwe bezichtigingsaanvragen op uit je e-mail, maakt per aanvraag een samenvatting, voegt die toe aan het CRM en stuurt een bevestigingsmail naar de klant. Dat is een agentic workflow — meerdere stappen, meerdere systemen, Claude voert het uit.

## Wanneer is een agentic workflow zinvol?

Een agentic workflow is zinvol als:
- De taak elke dag of week terugkomt
- De stappen altijd in dezelfde volgorde plaatsvinden
- De beslissingen onderweg eenvoudig en voorspelbaar zijn
- Een fout geen grote gevolgen heeft of makkelijk te herstellen is

Een agentic workflow is niet zinvol als:
- De taak veel menselijk oordeel vereist
- Een fout grote consequenties heeft (financieel, juridisch, reputatie)
- De stappen elke keer anders zijn

## Hoe ontwerp je een agentic workflow?

**Stap 1: Beschrijf de workflow in gewone taal**
Schrijf op wat er nu handmatig gebeurt, stap voor stap. Wie doet wat, in welke volgorde, met welke tools?

**Stap 2: Identificeer de beslismomenten**
Waar wordt er een beslissing genomen? Is die beslissing altijd hetzelfde of varieert die? Beslissingen die altijd hetzelfde zijn, kan Claude automatisch nemen. Beslissingen die variëren, houd je bij de mens.

**Stap 3: Bepaal welke systemen erbij betrokken zijn**
E-mail, agenda, CRM, opslag? Zorg dat Claude via Connectors of MCP toegang heeft tot die systemen.

**Stap 4: Bouw en test in kleine stappen**
Begin met één stap van de workflow. Test grondig. Voeg dan de volgende stap toe. Bouw nooit een complete workflow in één keer — de kans op fouten is dan te groot.

**Stap 5: Stel grenzen in**
Bepaal wat Claude mag doen zonder bevestiging en wat altijd menselijke goedkeuring vereist. Stel dit vast in de CLAUDE.md of de Skill.

## Praktisch voorbeeld: wekelijkse rapportage

Een accountantskantoor verwerkt elke vrijdag rapporten van tien klanten. Handmatig kost dit drie uur. De workflow:

1. Haal alle rapporten op uit de gedeelde map
2. Maak per rapport een samenvatting van vijf punten
3. Voeg de samenvatting toe aan het klantdossier in het CRM
4. Maak een weekoverzicht voor de directeur

Claude voert stappen 1, 2 en 4 volledig automatisch uit. Stap 3 — toevoegen aan het CRM — gebeurt pas na menselijke controle van de samenvatting. Dit is een bewuste keuze: CRM-data moet kloppen.

## Wat gaat er mis bij agentic workflows?

De meest voorkomende problemen:

**Claude neemt een verkeerde beslissing onderweg:** Voeg meer specifieke instructies toe voor die situatie, of maak van dat beslismoment een menselijk goedkeuringsmoment.

**De workflow stopt halverwege:** Dit gebeurt bij technische problemen of bij situaties die Claude niet herkent. Bouw altijd een foutmelding in: "Als stap X mislukt, stop dan en stuur een melding."

**De output klopt niet:** Test de workflow met echte data voordat je hem automatisch laat draaien. Wat er in de testomgeving goed gaat, werkt niet altijd perfect in de praktijk.

## Samenvatting

Agentic workflows laten Claude meerdere stappen automatisch uitvoeren zonder handmatige tussenkomst bij elke stap. Ze zijn zinvol voor terugkerende, voorspelbare taken met eenvoudige beslissingen. Ontwerp ze stap voor stap, test grondig en stel altijd grenzen in voor wat Claude wel en niet automatisch mag doen. Houd menselijke controle op beslissingen met grote gevolgen.

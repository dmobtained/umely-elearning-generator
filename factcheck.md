# Factcheck rapport — E-learning modules Umely

**Gegenereerd op:** 2026-04-04
**Gescande modules:** 25 (alle `elearning-*.html` bestanden)

---

## Samenvatting

| Risiconiveau | Aantal claims |
|---|---|
| **Hoog** | 14 |
| **Middel** | 19 |
| **Laag** | 11 |
| **Totaal** | 44 |

---

## A1 — Wat is Claude en Anthropic?

### Hoog risico

---

- **Claim:** "Anthropic is een Amerikaans AI-bedrijf, opgericht in 2021 door Dario Amodei, Daniela Amodei en een groep voormalige OpenAI-medewerkers."
- **Type:** Feit
- **Risico:** Hoog
- **Toelichting:** Het jaar 2021 en de namen zijn correct, maar de precieze achtergrond ("vanwege zorgen over veiligheid en tempo") is een interpretatie die vatbaar is voor nuancering.

---

- **Claim:** "Anthropic werd opgericht in 2021 door voormalige medewerkers van OpenAI, waaronder Dario en Daniela Amodei." (quizvraag met antwoord 2021)
- **Type:** Feit
- **Risico:** Hoog
- **Toelichting:** Staat als quiz-antwoord met getal 2021 — als het jaar onjuist zou zijn, leert de cursist een fout feit. Verificatie aanbevolen.

---

- **Claim:** "Dario Amodei en anderen verlieten OpenAI in 2021 en richtten Anthropic op, mede vanwege zorgen over de veiligheidsaanpak van OpenAI."
- **Type:** Feit
- **Risico:** Hoog
- **Toelichting:** Specifieke motivatie ("veiligheidsaanpak") wordt als feit gepresenteerd in feedbacktekst. Dit is een interpretatie van publieke uitspraken, niet een vaststaand feit.

---

### Middel risico

---

- **Claim:** "Claude werkt vanuit zijn trainingsdata, niet vanuit live informatie. Actuele nieuwtjes, prijzen, wetgeving of recente studies: Claude kan die niet ophalen tenzij je ze zelf meestuurt of een tool zoals de zoekfunctie actief is."
- **Type:** Functie
- **Risico:** Middel
- **Toelichting:** De situatie rond live-zoektoegang verandert snel. Als Claude straks standaard web-toegang heeft, klopt deze claim niet meer.

---

## A2 — Het Claude-ecosysteem

### Hoog risico

---

- **Claim:** "Claude is ook beschikbaar via Microsoft 365. In Excel kun je Claude inzetten om formules te schrijven, data te analyseren en samenvattingen te maken."
- **Type:** Functie
- **Risico:** Hoog
- **Toelichting:** Er bestaat geen directe Claude-integratie in Microsoft 365 (dit erkent module C5 zelf ook). De bewering in A2 is misleidend en tegenstrijdig met C5.

---

- **Claim:** "De Chrome-extensie werkt alleen in Google Chrome, niet in andere browsers."
- **Type:** Functie
- **Risico:** Hoog
- **Toelichting:** Browser-ondersteuning kan uitgebreid worden. Op het moment van schrijven correct, maar kan snel veranderen.

---

### Middel risico

---

- **Claim:** "Er is een gratis versie met een dagelijks gebruikslimiet... reken op een paar tientallen euro's per maand."
- **Type:** Getal
- **Risico:** Middel
- **Toelichting:** Prijzen veranderen regelmatig. De formulering "paar tientallen euro's" is vaag genoeg om niet direct fout te zijn, maar kan verouderd raken.

---

- **Claim:** "Met Pro kun je ook de Projects-functie gebruiken."
- **Type:** Functie
- **Risico:** Middel
- **Toelichting:** Projects-beschikbaarheid per abonnement kan veranderen. Elders in de modules wordt ook gratis Projects-toegang niet expliciet uitgesloten.

---

- **Claim:** "De desktop-app heeft drie functies: Chat, Cowork en Code."
- **Type:** Functie
- **Risico:** Middel
- **Toelichting:** De UI-structuur van de desktop-app kan worden bijgewerkt; namen en indeling van functies kunnen veranderen.

---

## B1 — Veiligheid & Privacy bij Claude

### Hoog risico

---

- **Claim:** "De gesprekken worden doorgaans 30 dagen bewaard voor veiligheidsdoeleinden, ook als je de training uitschakelt."
- **Type:** Getal
- **Risico:** Hoog
- **Toelichting:** De bewaarperiode van 30 dagen is een specifiek getal dat direct gebonden is aan Anthropic's privacybeleid. Dit beleid kan op elk moment wijzigen.

---

- **Claim:** "Gesprek bewaard in geschiedenis (standaard 30 dagen bij gratis/Pro)."
- **Type:** Getal
- **Risico:** Hoog
- **Toelichting:** Zelfde als bovenstaande claim — staat ook als feitelijk kader in een visueel schema.

---

- **Claim:** "Anthropic bewaart gesprekken tijdelijk op de servers (standaard 30 dagen), tenzij ze worden verwijderd."
- **Type:** Getal
- **Risico:** Hoog
- **Toelichting:** Herhaling van de 30-dagenterm als feedbacktekst in een scenario. Drie keer herhaald in dezelfde module — als het onjuist is, is de schade groot.

---

- **Claim:** "Het Enterprise-abonnement biedt aanvullende beveiligingsopties: Single Sign-On via SAML, uitgebreide auditlogs, betere beheermogelijkheden en de mogelijkheid om een formele verwerkersovereenkomst af te sluiten."
- **Type:** Functie
- **Risico:** Hoog
- **Toelichting:** Specifieke Enterprise-functionaliteiten (SSO/SAML exclusief voor Enterprise) kunnen veranderen als Anthropic haar aanbod aanpast. Tegenstrijdig met module C7 die stelt dat ook Teams een DPA biedt.

---

- **Claim:** "Bij structureel gebruik waarbij persoonsgegevens van Europese burgers worden ingevoerd [is een verwerkersovereenkomst vereist] — dat is alleen mogelijk via Enterprise."
- **Type:** Functie
- **Risico:** Hoog
- **Toelichting:** Tegenstrijdig met module C7 (regel 49) die stelt dat Teams al een standaard DPA biedt. Een van beide is fout.

---

### Middel risico

---

- **Claim:** "Bij een gratis of Pro-account kunnen je gesprekken door Anthropic worden gebruikt om het model te verbeteren, tenzij je dit zelf uitschakelt."
- **Type:** Functie
- **Risico:** Middel
- **Toelichting:** Correct op het moment van schrijven, maar Anthropic's trainingsbeleid kan veranderen.

---

- **Claim:** "Ga naar claude.ai, klik op je profielafbeelding rechtsonder, kies Instellingen en dan Privacy."
- **Type:** UI
- **Risico:** Middel
- **Toelichting:** Profielafbeelding staat elders in de modules consequent "rechtsboven" vermeld (C6). "Rechtsonder" is waarschijnlijk een fout of verouderd. Tegenstrijdig met module C6.

---

- **Claim:** "Anthropic biedt twee zakelijke varianten: Teams en Enterprise."
- **Type:** Feit
- **Risico:** Middel
- **Toelichting:** Het aantal en de naamgeving van abonnementen kan wijzigen.

---

## B2 — Claude voor niet-developers

### Laag risico

---

- **Claim:** "Technische kennis maakt Claude krachtiger. Maar voor zo'n 80% van de dagelijkse use cases, zoals teksten schrijven, documenten samenvatten en vragen beantwoorden, heb je die kennis simpelweg niet nodig."
- **Type:** Getal
- **Risico:** Laag
- **Toelichting:** Het getal 80% is een schatting zonder bronvermelding, maar is zo vaag geformuleerd dat het nauwelijks als hardclaim geldt.

---

## B3 — Fouten begrijpen en omgaan

### Middel risico

---

- **Claim:** "Je kunt de statuspagina raadplegen via status.anthropic.com."
- **Type:** UI
- **Risico:** Middel
- **Toelichting:** URL's kunnen veranderen. Hoewel status.anthropic.com op het moment van schrijven bestaat, verdient het een periodieke controle.

---

## C1 — De Claude.ai web-app

### Hoog risico

---

- **Claim:** "Je kunt inloggen met een e-mailadres of via Google of Apple."
- **Type:** UI
- **Risico:** Hoog
- **Toelichting:** Login-opties (met name Apple) zijn platform-afhankelijk en kunnen per regio of versie afwijken. Als Apple-login verdwijnt of bijkomt, klopt de lijst niet.

---

- **Claim:** "Projects zijn beschikbaar in de betaalde versies van Claude.ai (Pro en Teams). De gratis versie heeft geen toegang tot Projects."
- **Type:** Functie
- **Risico:** Hoog
- **Toelichting:** Beschikbaarheid van Projects per abonnement is een kritische claim die direct leergedrag stuurt. Als Anthropic Projects opent voor gratis gebruikers, is dit fout.

---

### Middel risico

---

- **Claim:** "Via Settings > Memory kun je geheugen inschakelen."
- **Type:** UI
- **Risico:** Middel
- **Toelichting:** UI-paden kunnen wijzigen bij interface-updates.

---

- **Claim:** "Geheugen schakel je in via Settings > Memory."
- **Type:** UI
- **Risico:** Middel
- **Toelichting:** Idem. Staat als quiz-antwoord, dus als het pad verandert is de quiz fout.

---

- **Claim:** "Projects zijn beschikbaar in de betaalde versies van Claude.ai: Pro en Teams."
- **Type:** Functie
- **Risico:** Middel
- **Toelichting:** Herhaald in tabel als quiz-antwoord. Zie ook hoge-risico-claim hierboven.

---

## C3 — Chrome-extensie

### Middel risico

---

- **Claim:** "Het Claude-icoon verschijnt rechtsboven in je browser."
- **Type:** UI
- **Risico:** Middel
- **Toelichting:** Browser-extensie UI is afhankelijk van de Chrome-versie en gebruikersinstellingen.

---

- **Claim:** "Open geen pagina's met vertrouwelijke klantgegevens als je niet wilt dat die informatie naar Anthropic's servers gaat."
- **Type:** Functie
- **Risico:** Middel
- **Toelichting:** Of de extensie automatisch pagina-inhoud doorstuurt is afhankelijk van de versie en instelling; de claim is vrij absoluut geformuleerd.

---

## C5 — Excel en PowerPoint

### Middel risico

---

- **Claim:** "Er is geen directe Claude-integratie in Microsoft Office. Microsoft 365 Copilot gebruikt een ander AI-model."
- **Type:** Tool-vergelijking
- **Risico:** Middel
- **Toelichting:** Correct op het moment van schrijven (Copilot draait op GPT-modellen van OpenAI), maar Microsoft kan integraties uitbreiden of wijzigen. "Ander AI-model" is voldoende vaag om niet snel fout te zijn.

---

## C6 — Claude Settings instellen

### Hoog risico

---

- **Claim:** "De instellingen vind je door op je profielfoto of initialen rechtsboven te klikken en dan Settings te kiezen. Je ziet vijf categorieën: Profile, Memory, Privacy, Appearance en Billing."
- **Type:** UI
- **Risico:** Hoog
- **Toelichting:** Specifieke navigatie en exact vijf categorieën met hun namen — UI-updates kunnen dit direct ongeldig maken. Staat bovendien als quiz-antwoord.

---

- **Claim:** "Uitschakelen doe je via: Settings > Privacy > zet de schakelaar uit bij 'Use my conversations to improve Claude'."
- **Type:** UI
- **Risico:** Hoog
- **Toelichting:** Exacte naam van de schakelaar ("Use my conversations to improve Claude") is gevoelig voor herformulering bij UI-updates.

---

- **Claim:** "Bij gratis en Pro accounts staat training standaard aan. Bij Teams en Enterprise is dit al standaard uitgeschakeld."
- **Type:** Functie
- **Risico:** Hoog
- **Toelichting:** Staat als quiz-antwoord. Als Anthropic het trainingsbeleid aanpast — of Pro standaard uitzet — is het quiz-antwoord onjuist.

---

### Middel risico

---

- **Claim:** "Hoe open je de Settings in Claude.ai? — Klik op je profielfoto of initialen rechtsboven."
- **Type:** UI
- **Risico:** Middel
- **Toelichting:** Staat als correcte quiz-optie. UI-pad kan veranderen.

---

- **Claim:** "Waar vind je je factuurgeschiedenis en abonnementsopties? — Bij Billing."
- **Type:** UI
- **Risico:** Middel
- **Toelichting:** Staat als quiz-antwoord. Als de categorienaam of locatie verandert, is dit fout.

---

## C7 — Organisatie-inzet

### Hoog risico

---

- **Claim:** "Teams biedt al een standaard verwerkersovereenkomst (DPA). Enterprise is pas nodig als je specifieke beveiligingseisen hebt zoals SSO, auditlogs en prioriteitssupport."
- **Type:** Functie
- **Risico:** Hoog
- **Toelichting:** Tegenstrijdig met module B1 die stelt dat een verwerkersovereenkomst "alleen mogelijk via Enterprise" is. Een van beide claims is fout. Hoog risico omdat het juridisch-compliance-advies betreft.

---

### Laag risico

---

- **Claim:** "Wachten tot Anthropic een speciaal trainingsprogramma aanbiedt." (als fout antwoord)
- **Type:** Feit
- **Risico:** Laag
- **Toelichting:** Impliciet: Anthropic biedt geen speciaal trainingsprogramma aan. Als dit verandert, klopt de feedback niet.

---

## E1 — MCP

### Hoog risico

---

- **Claim:** "Er zijn meer dan 50 kant-en-klare MCP-connectoren beschikbaar."
- **Type:** Getal
- **Risico:** Hoog
- **Toelichting:** Een specifiek getal dat snel verouderd kan zijn — zowel naar boven als naar beneden. Staat ook als quiz-antwoord.

---

- **Claim:** "Meer dan 50 connectoren zijn beschikbaar. Grote tools als Gmail en Google Calendar staan er standaard bij."
- **Type:** Getal
- **Risico:** Hoog
- **Toelichting:** Idem. Wordt twee keer herhaald in de module.

---

### Middel risico

---

- **Claim:** "De IT-beheerder schakelt de gewenste connectoren in via de Teams- of Enterprise-omgeving van Anthropic."
- **Type:** UI
- **Risico:** Middel
- **Toelichting:** Procedure voor het inschakelen van connectoren in een Teams/Enterprise-omgeving kan veranderen.

---

- **Claim:** "Welke tool is GEEN voorbeeld van een beschikbare MCP-connector? — Microsoft Word (offline)." (als quiz-antwoord)
- **Type:** Functie
- **Risico:** Middel
- **Toelichting:** Als Microsoft Word alsnog een connector krijgt, klopt het quiz-antwoord niet meer.

---

## E2 — Connectors

### Middel risico

---

- **Claim:** "Via Settings > Connectors, klik Connect en log in." (als quiz-antwoord voor het inschakelen van een Connector)
- **Type:** UI
- **Risico:** Middel
- **Toelichting:** Exacte UI-pad en knoplaabeling kan veranderen bij interface-updates.

---

- **Claim:** "Klik op het puzzelstukje-icoon in de zijbalk of ga naar Settings > Connectors."
- **Type:** UI
- **Risico:** Middel
- **Toelichting:** Icoonnaam ("puzzelstukje") en locatie in de zijbalk zijn gevoelig voor redesign.

---

- **Claim:** "Notion (pagina's lezen/schrijven), Slack (berichten), Asana/Trello (taken beheren)" en "Salesforce, HubSpot (klantdata), GitHub (code en projecten)"
- **Type:** Functie
- **Risico:** Middel
- **Toelichting:** De opsomming van beschikbare connectors per categorie kan verouderd raken als tools worden toegevoegd of verwijderd.

---

## E5 — Eerste Skill

### Laag risico

---

- **Claim:** "Door Anthropic om een review te vragen" (als fout antwoord)
- **Type:** Functie
- **Risico:** Laag
- **Toelichting:** Impliceert dat Anthropic geen review-service voor Skills aanbiedt. Stabiel, maar theoretisch te veranderen.

---

## E6 — Agentic Workflows

### Laag risico

---

- **Claim:** "Omdat Anthropic dit verplicht stelt" (als fout antwoord)
- **Type:** Feit
- **Risico:** Laag
- **Toelichting:** Impliceert dat Anthropic geen stapsgewijze werkwijze verplicht stelt. Stabiel.

---

## I2 — Certificaat

### Laag risico

---

- **Claim:** "Houd de releasenotes bij via het Anthropic-blog of de changelog in de app."
- **Type:** UI
- **Risico:** Laag
- **Toelichting:** De verwijzing naar "de changelog in de app" veronderstelt dat zo'n functie bestaat. Dit kan per versie variëren.

---

---

## Speciale aandacht: Interne tegenstrijdigheden

De volgende claims in verschillende modules spreken elkaar direct tegen. Dit is los van de vraag of ze kloppen met de werkelijkheid:

### Tegenstrijdigheid 1 — Verwerkersovereenkomst: Teams vs. Enterprise

| Module | Claim |
|---|---|
| **B1** (scherm-module-2-2, scherm-module-2-kc) | Verwerkersovereenkomst is "alleen mogelijk via Enterprise" |
| **C7** (scherm-module-1) | "Teams biedt al een standaard verwerkersovereenkomst (DPA)" |

Een van beide is fout. Dit is een **hoog-risico juridisch adviesgegeven** dat gebruikers direct beïnvloedt in hun keuze voor een abonnement.

### Tegenstrijdigheid 2 — Locatie profielafbeelding in UI

| Module | Claim |
|---|---|
| **B1** (scherm-module-1-1) | "klik op je profielafbeelding **rechtsonder**" |
| **C6** (scherm-module-1-1, quiz) | "klik op je profielfoto of initialen **rechtsboven**" |

Eén van beide beschrijvingen is onjuist.

### Tegenstrijdigheid 3 — Claude via Microsoft 365

| Module | Claim |
|---|---|
| **A2** (scherm-module-4-1) | "Claude is ook beschikbaar via Microsoft 365. In Excel kun je Claude inzetten..." |
| **C5** (scherm-module-2-2) | "Er is geen directe Claude-integratie in Microsoft Office." |

A2 suggereert een directe integratie die C5 expliciet ontkent.

# Content Audit - Umely E-learning Modules

Datum: 2026-04-04
Gecontroleerde modules: 25 (alle `elearning-*.html` in `module-content/`)

Controle op:
1. AI-opvulling (platitudes, loze zinnen)
2. Te oppervlakkige schermen (alleen een tip-box, geen echte uitleg)
3. Tijdsgebonden taal ("op dit moment", "binnenkort", "actuele versie", concrete tarieven)
4. Ontbrekende nuance bij verificatie (slechts één verificatiebron genoemd zonder alternatieven)

---

## MODULE: elearning-a1-wat-is-claude.html

Geen bevindingen. Alle bekende issues uit de vorige audit zijn opgelost:
- `screen-module-2-3` tip-box "Altijd controleren" bevat nu concrete verificatiebronnen per branche (wetten.overheid.nl, jaarverslag, CBS-statistieken).
- `screen-module-1-2` stap 3 bevat geen tijdsgebonden claim meer — "over drie maanden" is verwijderd; tekst verwijst nu naar "bij een volgende versie".
- Quiz-antwoordoptie "Technische beperking die binnenkort opgelost wordt" is vervangen door "Technische beperking van het systeem".

---

## MODULE: elearning-a2-ecosysteem.html

- **screen-module-1-1**: Tijdsgebonden formulering — exacte zin: `"Bekijk de actuele tarieven op claude.ai/pricing."` — Fix: gewijzigd naar `"Zie claude.ai/pricing voor actuele abonnementsprijzen."` — consistenter met tijdloze verwijzing.

- **screen-module-3-1**: Tijdsgebonden taal — exacte zin: `"controleer de actuele browser-ondersteuning in de Chrome Web Store, want dit kan uitgebreid worden."` — "kan uitgebreid worden" suggereert verwachte toekomstige wijziging. Fix: zin gesplitst; "want dit kan uitgebreid worden" verwijderd.

- **screen-module-3-2 (flashcard "Kan niet: andere browsers")**: Tijdsgebonden taal — exacte zin: `"controleer de actuele browser-ondersteuning, want dit kan uitgebreid worden."` — zelfde probleem. Fix: "want dit kan uitgebreid worden" vervangen door "in de Chrome Web Store".

---

## MODULE: elearning-a3-prompts.html

Geen bevindingen. Module bevat concrete voorbeeldprompts en scenario's met specifieke feedback.

---

## MODULE: elearning-a4-leeropdracht-a.html

Geen bevindingen. Module bevat geen tijdsgebonden taal, geen AI-opvulling en geen vage platitudes. Alle instructies zijn concreet en actiegerich; content is tijdloos geformuleerd.

---

## MODULE: elearning-b1-veiligheid.html

- **screen-module-2-2 (vergelijkingstabel)**: Tijdsgebonden / concrete tarieven — exacte zin: `"Gratis of ~$20/mnd"` en `"Teams ~$25/gebruiker/mnd"` — Specifieke prijzen in een tabel verouderen snel. Verwijder de bedragen of voeg een expliciete noot toe dat dit indicatieve prijzen zijn die kunnen veranderen.

---

## MODULE: elearning-b2-niet-developers.html

- **screen-module-1-1**: Leeg scherm-onderdeel — Dit scherm bevat een lege `<div class="content-card"></div>` (regels 44-45) tussen twee tip-boxes. Er staat geen inhoud in die content-card. Het scherm is daardoor opgebouwd uit enkel twee tip-boxes zonder een inhoudelijk blok. Geen specifieke zin maar een structureel probleem.

- **screen-module-3-1 (tip-box Beperkingen)**: AI-opvulling / onvoldoende nuance — exacte zin: `"Zijn kennis heeft ook een einddatum: recente gebeurtenissen of nieuwe wetgeving kent hij mogelijk niet."` — Dit is de enige keer dat de kennisgrens van Claude benoemd wordt in dit scherm. Er ontbreekt enige concrete actie: wat doe je als je vermoedt dat de info verouderd is? (bijv. vraag Claude naar zijn trainingsdatum, zoek de wetgeving op via officiële bronnen). Nu is het een blote constatering zonder handelingsperspectief.

---

## MODULE: elearning-b3-fouten.html

- **screen-module-1-1 (waarschuwing-tip)**: Vergelijking met andere tools — exacte zin: `"Hallucineren is geen bug die snel wordt opgelost. Het is een fundamentele eigenschap van hoe grote taalmodellen werken. Dit geldt voor Claude, ChatGPT, Gemini en alle andere vergelijkbare modellen."` — Noemen van ChatGPT en Gemini bij naam in een vergelijkingscontext is conform de designregel "geen tool-vergelijkingen". De namen zijn hier echter niet vergelijkend maar feitelijk (hallucinatie is universeel). Dit is een randgeval maar verdient herbeoordeling.

- **screen-module-4-3 (tip-box "Wat Claude niet is")**: AI-opvulling / platitude — exacte zin: `"Claude is geen zoekmachine met actuele informatie. Hij is geen jurist, arts of accountant die verantwoordelijkheid draagt. Hij is geen vervanging voor een expert bij beslissingen met grote gevolgen. Gebruik hem als een capabele assistent, niet als eindoordeel."` — Dit scherm ("Realistische verwachtingen") bevat twee tip-boxes maar nauwelijks inhoudelijke uitleg van WAT dan de juiste aanpak is voor elk van die beroepscontexten. De eerste tip ("Wat Claude niet is") is een rij ontkennende claims zonder concrete alternatieven. Een jurist die dit leest weet nog steeds niet wat hij dan wél met Claude doet bij juridisch werk.

---

## MODULE: elearning-c1-webapp.html

- **screen-module-4-3 (tip-box "Privacy en gratis gebruik")**: AI-opvulling / vage aanwijzing — exacte zin: `"Stuur geen vertrouwelijke bedrijfsinformatie via de gratis versie zonder de actuele privacyvoorwaarden te kennen en te vergelijken met de betaalde opties."` — "De actuele privacyvoorwaarden kennen" is een aansporing zonder handleiding: waar vind je die voorwaarden, wat moet je erin checken, en wat is het minimale criterium om te bepalen of iets mag?

- **screen-module-4-kc (feedback op correct antwoord)**: Tijdsgebonden taal — exacte zin: `"Controleer altijd de actuele privacyvoorwaarden."` — Als instructie in quiz-feedback is dit onvoldoende: geen link, geen uitleg wat je op die pagina concreet moet nagaan.

---

## MODULE: elearning-c2-desktop.html

*Niet volledig gelezen via grep. Geen patronen gevonden in de geautomatiseerde zoekopdrachten. Geen significante bevindingen op basis van de steekproef.*

---

## MODULE: elearning-c3-chrome.html

*Niet volledig gelezen via grep. Geen patronen gevonden in de geautomatiseerde zoekopdrachten. Geen significante bevindingen op basis van de steekproef.*

---

## MODULE: elearning-c4-cowork.html

*Niet volledig gelezen via grep. Geen patronen gevonden in de geautomatiseerde zoekopdrachten. Geen significante bevindingen op basis van de steekproef.*

---

## MODULE: elearning-c5-excel-powerpoint.html

- **screen-welcome (leerdoelen)**: Tijdsgebonden taal — exacte zin: `"Weten dat directe Office-integraties in ontwikkeling zijn"` — "In ontwikkeling" is een tijdgebonden claim. Als de integratie ondertussen is uitgebracht, is dit leerdoel al verouderd bij lancering. Verwijder dit leerdoel of formuleer het zonder tijdsclaim: "Weten waarom de copy-paste werkwijze altijd werkt, ongeacht toekomstige integraties."

- **screen-module-3 (content-card)**: Vergelijking met andere tool — exacte zin: `"Microsoft 365 Copilot gebruikt een ander AI-model."` — In de context van de module is dit een feitelijke toelichting, maar het is in combinatie met de quizvraag (zie hieronder) genuanceerder.

- **Quiz-vraag 4**: Vergelijking met andere tool — exacte zin: `"Nee, Microsoft 365 Copilot gebruikt een ander AI-model. Claude gebruik je naast Office via copy-paste"` — In een quiz-antwoord wordt Microsoft 365 Copilot expliciet vergeleken ("ander AI-model"). Dit kan verouderen als Copilot ook Claude gaat aanbieden. De antwoordformulering is daarmee tijdsgebonden.

---

## MODULE: elearning-c6-settings.html

- **screen-module-1-2 (flashcard Billing)**: Tijdsgebonden — exacte zin: `"Huidig abonnement, factuurgeschiedenis en de optie om te upgraden of op te zeggen."` — Het woord "huidig" in een flashcard-uitleg is een triviale beschrijving van wat Billing toont. Geen inhoudelijk probleem, maar het woord "huidig" verwijst impliciet naar een situatie die kan veranderen als Anthropic de interface wijzigt.

- **screen-module-4-2 (content-card Billing)**: Tijdsgebonden — exacte zin: `"Billing toont je huidige abonnement, factuurgeschiedenis en de opties om te upgraden of op te zeggen."` — Zelfde als bovenstaande, marginale kwestie.

---

## MODULE: elearning-c7-organisatie.html

*Niet volledig gelezen via grep. Geen patronen gevonden in de geautomatiseerde zoekopdrachten. Geen significante bevindingen op basis van de steekproef.*

---

## MODULE: elearning-d1-claude-code.html

*Niet volledig gelezen via grep. Geen patronen gevonden in de geautomatiseerde zoekopdrachten. Geen significante bevindingen op basis van de steekproef.*

---

## MODULE: elearning-d2-claude-md.html

*Niet volledig gelezen via grep. Geen patronen gevonden in de geautomatiseerde zoekopdrachten. Geen significante bevindingen op basis van de steekproef.*

---

## MODULE: elearning-d3-plan-mode.html

Geen significante problemen gevonden. Concrete uitleg van commando's met precieze beschrijvingen.

---

## MODULE: elearning-e1-mcp.html

*Niet volledig gelezen via grep. Geen patronen gevonden in de geautomatiseerde zoekopdrachten. Geen significante bevindingen op basis van de steekproef.*

---

## MODULE: elearning-e2-connectors.html

- **screen-module-2 (opmerking onderaan)**: Tijdsgebonden taal — exacte zin: `"Het aanbod van Connectors wordt regelmatig uitgebreid. Controleer in claude.ai welke Connectors op dit moment beschikbaar zijn voor jouw regio en abonnement."` — "Op dit moment" is tijdsgebonden. De zin suggereert ook dat de tabel erboven mogelijk al verouderd is zonder verdere aanwijzing wat incompleet kan zijn. Betere formulering: "Het beschikbare aanbod verschilt per regio en abonnement. Controleer in claude.ai > Settings > Connectors welke koppelingen beschikbaar zijn."

---

## MODULE: elearning-e3-plugins.html

- **screen (tip-box Let op over bestandsgrootte)**: Tijdsgebonden taal — exacte zin: `"Kennisbestanden hebben een maximale bestandsgrootte (momenteel ongeveer 30 MB per Project)."` — "Momenteel" en een concreet getal (30 MB) zijn samen een klassiek tijdgebonden detail. Als Anthropic de limiet verhoogt, klopt de informatie niet meer. Vervang door: "Kennisbestanden hebben een maximale bestandsgrootte per Project. Zie de actuele limiet in de instellingen van je Project."

- **screen (beperkingstabel)**: Tijdsgebonden — exacte zin: `"Maximale bestandsgrootte: Ongeveer 30 MB aan bestanden per Project."` — Zelfde probleem als hierboven, nu ook in een tabel.

---

## MODULE: elearning-e4-skills.html

*Niet volledig gelezen via grep. Geen patronen gevonden in de geautomatiseerde zoekopdrachten. Geen significante bevindingen op basis van de steekproef.*

---

## MODULE: elearning-e5-eerste-skill.html

*Niet volledig gelezen via grep. Geen patronen gevonden in de geautomatiseerde zoekopdrachten. Geen significante bevindingen op basis van de steekproef.*

---

## MODULE: elearning-e6-agentic-workflows.html

*Niet volledig gelezen via grep. Geen patronen gevonden in de geautomatiseerde zoekopdrachten. Geen significante bevindingen op basis van de steekproef.*

---

## MODULE: elearning-e7-portfolio-website.html

Geen significante problemen gevonden. Kosten voor domeinnamen zijn indicatief maar voldoende afgebakend ("circa 10-15 euro per jaar") en niet als exacte prijs gepresenteerd.

---

## MODULE: elearning-i1-praktijktoets.html

- **Quiz-vraag**: Tijdsgebonden taal — exacte zin: `"Een herhalende, tijdrovende taak met meerdere stappen"` bevat "momenteel tijdrovend" in de quizfeedback-uitleg: `"Kies een taak die regelmatig terugkomt, momenteel tijdrovend is en meerdere stappen heeft."` — "Momenteel" suggereert dat dit een tijdelijke toestand is, wat onbedoeld kan overkomen als een hint dat de taak straks niet meer handmatig uitgevoerd hoeft te worden (tautologie). Marginaal, maar de formulering kan strakker zonder "momenteel".

---

## MODULE: elearning-i2-certificaat.html

- **screen-module-4 (Na het certificaat)**: AI-opvulling / tijdsgebonden — exacte zin: `"Claude en de tools eromheen ontwikkelen zich snel. Nieuwe functies, nieuwe Connectors, nieuwe mogelijkheden. Blijf experimenteren, blijf testen en blijf vragen stellen."` — Dit is een opsomming van platitudes zonder concrete aanwijzing. "Nieuwe functies, nieuwe Connectors, nieuwe mogelijkheden" zegt niets actiefbaars. Wat moet een gecertificeerde deelnemer concreet doen om bij te blijven? Waar kijken? Hoe vaak?

- **screen-module-4 (Na het certificaat)**: Tijdsgebonden taal / vage belofte — exacte zin: `"Umely biedt voor gecertificeerde deelnemers updates aan als er significante veranderingen zijn in het ecosysteem. Zo blijf je up-to-date zonder het hele traject opnieuw te hoeven doorlopen."` — "Als er significante veranderingen zijn" is vaag. Wat is significant? Wanneer kun je een update verwachten? Hoe word je genotificeerd? Dit is een ongedekte belofte zonder mechanisme.

---

## Samenvatting van meest kritieke problemen

| Prioriteit | Module | Scherm | Type |
|------------|--------|--------|------|
| Hoog | elearning-b2-niet-developers.html | screen-module-1-1 | Leeg content-card (geen inhoud) |
| Hoog | elearning-e3-plugins.html | tip-box bestandsgrootte | Tijdsgebonden getal ("momenteel 30 MB") |
| Hoog | elearning-e3-plugins.html | beperkingstabel | Tijdsgebonden getal ("30 MB") |
| Hoog | elearning-b1-veiligheid.html | screen-module-2-2 | Concrete tarieven in tabel (~$20, ~$25) |
| Hoog | elearning-e2-connectors.html | screen-module-2 | Tijdsgebonden ("op dit moment beschikbaar") |
| Hoog | elearning-c5-excel-powerpoint.html | screen-welcome leerdoel | Tijdsgebonden ("in ontwikkeling") |
| Gefixed | elearning-a2-ecosysteem.html | screen-module-1-1 | Tijdsgebonden formulering ("Bekijk de actuele tarieven") → "Zie claude.ai/pricing voor actuele abonnementsprijzen" |
| Gefixed | elearning-a2-ecosysteem.html | screen-module-3-1 en screen-module-3-2 | Tijdsgebonden taal ("kan uitgebreid worden") → verwijderd |
| Medium | elearning-b3-fouten.html | screen-module-4-3 | AI-opvulling (rij ontkennende claims zonder handelingsperspectief) |
| Medium | elearning-c1-webapp.html | screen-module-4-3 | Vage aansporing zonder concrete instructie |
| Medium | elearning-i2-certificaat.html | screen-module-4 | AI-opvulling + tijdsgebonden + vage belofte |
| Laag | elearning-b3-fouten.html | screen-module-1-1 | Noemen van ChatGPT/Gemini bij naam |
| Laag | elearning-b2-niet-developers.html | screen-module-3-1 | Constatering zonder handelingsperspectief |
| Laag | elearning-i1-praktijktoets.html | quiz-uitleg | "Momenteel tijdrovend" tijdsgebonden formulering |
| Gefixed | elearning-a1-wat-is-claude.html | screen-module-1-2, screen-module-2-3, quiz | Alle bekende issues opgelost in vorige correctieronde |

---

## Aanvullende audit — C2, C3, C4, C7, D1, D2, E1, E4, E5, E6

Datum: 2026-04-04
Methode: volledig regel voor regel gelezen

---

### MODULE: elearning-c2-desktop.html

**Geen kritieke bevindingen.** De module is inhoudelijk solide: concrete vergelijkingstabel, flashcards met onclick, scenario's met directe feedback, en een kennischeck per onderdeel. De beperkingen van Cowork en Code worden eerlijk benoemd.

Aandachtspunt (laag):

```
MODULE: elearning-c2-desktop.html
SCHERM: screen-module-3-1
TYPE: Te oppervlakkig
CLAIM: "Bij Chat geef jij het antwoord uit. Bij Cowork voert Claude de actie zelf uit op je computer."
SUGGESTIE: Grammaticaal onhandig ("geef jij het antwoord uit" is geen gangbare zin). Beter: "Bij Chat geeft Claude een antwoord en voer jij de actie zelf uit."
```

```
MODULE: elearning-c2-desktop.html
SCHERM: screen-module-3-3 (scenario-keuze, knooptekst)
TYPE: Interne tegenstrijdigheid (HTML-fout met dubbele aanhalingstekens)
CLAIM: Knoptekst bevat een kapotte HTML-entiteit: `onclick="checkScenario(3, this, true, '...')">Cowork openen, toegang geven tot de map, en vragen: "Maak van elk PDF een samenvatting als tekstbestand in een nieuwe map Samenvattingen."')">` — de knooptekst wordt daarna nogmaals herhaald als zichtbare tekst op de knop.
SUGGESTIE: Technische fout: de onclick-attribuut sluit te vroeg door de aanhalingstekens in de knooptekst. Vervang binnenste aanhalingstekens in de onclick-string door &quot; of gebruik enkele aanhalingstekens consistent.
```

---

### MODULE: elearning-c3-chrome.html

**Geen inhoudelijke bevindingen.** Module is kort, gefocust en volledig. Beperkingen (geen Firefox/Safari, geen klikken op knoppen) zijn expliciet en concreet benoemd. Privacy-waarschuwing is praktisch geformuleerd.

---

### MODULE: elearning-c4-cowork.html

**Geen kritieke bevindingen.** Inhoudelijk sterk: concrete tabel met wel/niet, stappenproces, back-up waarschuwing. Scenario's zijn situationeel relevant.

Aandachtspunt (laag):

```
MODULE: elearning-c4-cowork.html
SCHERM: screen-module-3 (tabel "Niet geschikt")
TYPE: Ontbrekende nuance
CLAIM: "Alles met real-time data (beperkt web mogelijk via browserfunctie)"
SUGGESTIE: De toevoeging "beperkt web mogelijk via browserfunctie" is te kort door de bocht in een tabelcel. Wat is die browserfunctie precies, hoe schakel je die in, en wat zijn de beperkingen ervan? Als dit niet uitgelegd kan worden in een tabelcel, verwijder de toevoeging dan en laat de beperking staan als absolute grens.
```

---

### MODULE: elearning-c7-organisatie.html

**Geen kritieke bevindingen.** Inhoudelijk solide: concrete vergelijkingstabel Teams vs Enterprise zonder prijzen, stappenplan voor uitrol, aandacht voor adoptie-uitdagingen. Richtlijn-content is concreet (vier blokken in processtroom).

Aandachtspunt (medium):

```
MODULE: elearning-c7-organisatie.html
SCHERM: screen-module-2 (stap 4 in uitrolproces)
TYPE: AI-opvulling / platitude
CLAIM: "Laat resultaten spreken. Als collega's zien dat een taak van een uur nu tien minuten duurt, volgt adoptie vanzelf."
SUGGESTIE: Dezelfde zin staat ook letterlijk in screen-module-4 (tweede alinea). Dit is een interne herhaling van dezelfde frase op twee afzonderlijke schermen. Eén keer is genoeg; de andere instantie aanpassen of verwijderen.
```

```
MODULE: elearning-c7-organisatie.html
SCHERM: screen-module-1 (kennischeck, foutantwoord-feedback op "Enterprise")
TYPE: Ontbrekende nuance
CLAIM: "Enterprise is wel geschikt, maar is niet het enige geschikte abonnement. Teams biedt ook al een verwerkersovereenkomst en is voor veel kantoren voldoende."
SUGGESTIE: De vraag luidt: "Welk abonnement is NIET geschikt?" Het foutantwoord "Enterprise" krijgt de feedback dat het wél geschikt is, maar er staat niet waarom iemand dan toch voor Enterprise zou kiezen boven Teams. Voeg toe: "Enterprise voegt SSO en auditlogs toe, wat bij grotere of strikter gereguleerde kantoren een vereiste kan zijn."
```

---

### MODULE: elearning-d1-claude-code.html

**Geen kritieke bevindingen.** Module is concreet en goed opgebouwd: installatiestappen, flashcards met echte voorbeeldopdrachten, duidelijke beperkingtabel. De positionering voor niet-technische gebruikers is consequent doorgevoerd.

Aandachtspunt (medium):

```
MODULE: elearning-d1-claude-code.html
SCHERM: screen-module-5 (beperkingstabel, "Kan wel"-kolom)
TYPE: Tijdsgebonden / mogelijk onjuist
CLAIM: "Internettoegang (web search en web fetch)"
SUGGESTIE: Internettoegang in Claude Code is geen standaardfunctie maar een optionele tool die per sessie en per configuratie verschilt. De tabel presenteert het als een vaststaande mogelijkheid zonder voorbehoud. Voeg een noot toe: "Internettoegang via web search en web fetch is beschikbaar als Claude Code daarvoor toestemming heeft binnen de sessie."
```

```
MODULE: elearning-d1-claude-code.html
SCHERM: screen-module-2 (tip-box)
TYPE: AI-opvulling / platitude
CLAIM: "De terminal ziet er misschien intimiderend uit, maar je hoeft geen technische commando's te kennen. Claude Code begrijpt gewone taal."
SUGGESTIE: Dit is de derde keer in de module dat "gewone taal" als geruststelling wordt gebruikt (ook in de welkomstintro en in module 1). Op zichzelf is de boodschap correct, maar als losse tip-box zonder aanvullende inhoud draagt dit scherm niets nieuws bij. De tip-box kan worden versterkt door een concreet voorbeeld van een gewone-taal-opdracht toe te voegen, of samengevoegd met een ander scherm.
```

---

### MODULE: elearning-d2-claude-md.html

**Geen kritieke bevindingen.** Module is inhoudelijk sterk en praktisch: concrete voorbeelden in alle vier flashcards, helder verschil CLAUDE.md vs zonder, het "levend document"-concept is consistent doorgevoerd.

Aandachtspunt (laag):

```
MODULE: elearning-d2-claude-md.html
SCHERM: screen-module-3 (tip-box)
TYPE: Tijdsgebonden / arbitrair getal
CLAIM: "Houd CLAUDE.md onder de 200 regels."
SUGGESTIE: "200 regels" is een vuistregel zonder bronvermelding of onderbouwing. Als dit een concrete aanbeveling is op basis van contextvenster-limieten of praktijkervaring, onderbouw het dan kort: "Claude Code heeft een contextvenster. Een bestand van meer dan 200 regels raakt aan die grens en kan Claude afleiden." Als het puur een praktijkregel is, formuleer dan: "Houd CLAUDE.md beheersbaar. Als je het in vijf minuten niet kunt lezen, is het waarschijnlijk te lang."
```

---

### MODULE: elearning-e1-mcp.html

**Geen kritieke bevindingen.** Module is uitgebreid en structureel sterk: vier onderdelen met elk een verdieping en praktijkscherm, concrete voorbeelden per beroep, heldere risicotabel voor lees- vs schrijftoegang.

Aandachtspunt (medium):

```
MODULE: elearning-e1-mcp.html
SCHERM: screen-module-2-1 (content-card, eerste alinea)
TYPE: Tijdsgebonden taal
CLAIM: "Er zijn meer dan 50 kant-en-klare MCP-connectoren beschikbaar."
SUGGESTIE: Een concreet getal ("meer dan 50") veroudert zodra het aanbod groeit of krimpt. Formuleer als: "Er zijn tientallen kant-en-klare MCP-connectoren beschikbaar voor de meest gebruikte tools." Hetzelfde getal wordt herhaald in screen-module-2-3 stap 3: "Meer dan 50 connectoren zijn beschikbaar." Beide instanties aanpassen.
```

```
MODULE: elearning-e1-mcp.html
SCHERM: screen-module-4-2 (stap 2: kleine organisatie zonder IT-afdeling)
TYPE: AI-opvulling / zelfpromotie
CLAIM: "Je hebt hulp nodig van een implementatiepartner, zoals Umely."
SUGGESTIE: Het noemen van Umely bij naam in een inhoudelijk scherm is ongebruikelijk voor een e-learning die objectieve kennis overdraagt. Verwijder "zoals Umely" of vervang door "zoals een gespecialiseerde implementatiepartner". Zelfverwijzing in lesinhoud ondermijnt de geloofwaardigheid van de module als onafhankelijke bron.
```

---

### MODULE: elearning-e4-skills.html

**Geen kritieke bevindingen.** Compacte, goed gestructureerde module. Besliswijzer (tabel) en het laadproces (processtroom) zijn helder en concreet.

Aandachtspunt (laag):

```
MODULE: elearning-e4-skills.html
SCHERM: screen-module-3 (content-card, eerste alinea)
TYPE: Te oppervlakkig
CLAIM: "Skills sla je op in de map .claude/skills/ in je projectmap. Claude Code kan de juiste Skill laden via slash-commando's, automatisch via de Skill tool wanneer de taakomschrijving matcht, of je activeert een Skill handmatig."
SUGGESTIE: "Handmatig activeren" wordt in dit scherm twee keer vermeld (ook in de processtroom) maar nergens uitgelegd hoe dat handmatig activeren concreet werkt. Voeg één zin toe: "Handmatig activeren doe je door de Skill-naam expliciet te noemen in je opdracht aan Claude Code."
```

---

### MODULE: elearning-e5-eerste-skill.html

**Geen kritieke bevindingen.** Module is praktisch en goed opgebouwd: concrete vergelijkingstabel vaag vs specifiek, iteratief testproces, flashcards voor veelgemaakte fouten.

Aandachtspunt (laag):

```
MODULE: elearning-e5-eerste-skill.html
SCHERM: screen-module-1 (tabel "Slecht")
TYPE: Te oppervlakkig
CLAIM: "Taken waar je de aanpak nog niet kent"
SUGGESTIE: Dit criterium (aanpak nog niet kennen) is logisch maar staat zonder uitleg. Een gebruiker die dit leest weet niet wat de praktische gevolg is: als je de aanpak niet kent, kun je geen concrete stappen schrijven, en een Skill zonder concrete stappen werkt niet. Voeg één zin toe als toelichting onder de tabel of maak er een flashcard van.
```

---

### MODULE: elearning-e6-agentic-workflows.html

**Geen kritieke bevindingen.** Dit is inhoudelijk de sterkste module van de reeks: concrete criteria voor wel/niet automatiseren, een uitgewerkt werkend voorbeeld (accountantskantoor), en expliciete aandacht voor foutafhandeling. De nuance bij screen-module-2-2 (wanneer NIET automatiseren) en de foutafhandeling in screen-module-4-2 zijn uitstekend.

Aandachtspunt (laag):

```
MODULE: elearning-e6-agentic-workflows.html
SCHERM: screen-module-2-2 (flashcard "Fout heeft grote gevolgen")
TYPE: Spelfout
CLAIM: "Bij financiele transacties..."
SUGGESTIE: "financiele" moet "financiële" zijn (trema ontbreekt). Kleine fout maar zichtbaar voor de eindgebruiker.
```

---

## Samenvatting aanvullende audit

| Prioriteit | Module | Scherm | Type |
|------------|--------|--------|------|
| Hoog | elearning-c2-desktop.html | screen-module-3-3 | HTML-fout: kapotte onclick door aanhalingstekens in knooptekst |
| Medium | elearning-e1-mcp.html | screen-module-2-1 en screen-module-2-3 | Tijdsgebonden getal ("meer dan 50 connectoren") |
| Medium | elearning-e1-mcp.html | screen-module-4-2 | Zelfpromotie ("zoals Umely") in inhoudelijk scherm |
| Medium | elearning-c7-organisatie.html | screen-module-2 + screen-module-4 | Exacte frase letterlijk herhaald op twee schermen |
| Medium | elearning-d1-claude-code.html | screen-module-5 | Internettoegang als vaststaande mogelijkheid gepresenteerd zonder voorbehoud |
| Laag | elearning-c4-cowork.html | screen-module-3 | "browserfunctie" niet uitgelegd in tabelcel |
| Laag | elearning-d2-claude-md.html | screen-module-3 | "200 regels" als vuistregel zonder onderbouwing |
| Laag | elearning-d1-claude-code.html | screen-module-2 | Tip-box herhaalt "gewone taal" zonder nieuwe inhoud toe te voegen |
| Laag | elearning-e4-skills.html | screen-module-3 | "Handmatig activeren" twee keer vermeld zonder uitleg hoe |
| Laag | elearning-e5-eerste-skill.html | screen-module-1 | Criterium "aanpak nog niet kennen" staat zonder toelichting |
| Laag | elearning-e6-agentic-workflows.html | screen-module-2-2 | Spelfout: "financiele" moet "financiële" zijn |
| Laag | elearning-c2-desktop.html | screen-module-3-1 | Grammaticale fout: "geef jij het antwoord uit" |
| Laag | elearning-c7-organisatie.html | screen-module-1 (kennischeck feedback) | Foutantwoord-feedback mist reden waarom Enterprise wél nuttig kan zijn |

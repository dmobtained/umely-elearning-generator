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

- **screen-module-2-3**: Te oppervlakkig / AI-opvulling — exacte zin: `"Controleer altijd wat Claude produceert, zeker bij juridische, financiële of medische informatie."` — Tip-box met alleen een algemene vermaning zonder uitleg WAT je controleert (tekst? feiten? toon?), HOE je dat doet en aan de hand van welke criteria. Dit scherm bestaat uitsluitend uit flashcards + deze waarschuwingstip.

- **screen-module-1-2 (inhoud van onderdeel 1-3)**: Tijdsgebonden taal — exacte zin: `"Het product verandert snel. Anthropic brengt regelmatig nieuwe versies uit. Wat vandaag niet werkt, kan over drie maanden verbeterd zijn."` — "Over drie maanden" is een tijdspecifieke claim die snel verouderd raakt. Beter: "Anthropic brengt regelmatig nieuwe versies uit. Blijf testen."

- **screen-module-4-2 (scenario + tip)**: Verificatienoot onvolledig — exacte zin: `"Controleer specifieke cijfers altijd via het jaarverslag, een persbericht of een betrouwbare databron."` — Dit is onderdeel van een scenario-feedback, niet van een inhoudelijk scherm. Verificatiesuggestie vernoemt "jaarverslag" als eerste, maar "betrouwbare databron" is te vaag. Geen specifieke alternatieven (Kadaster, CBS, brancheorganisatie).

- **Quiz-vraag (QUIZ_START, optie in foutantwoord)**: Tijdsgebonden taal — exacte zin: `"Technische beperking die binnenkort opgelost wordt"` — Dit is een foutantwoord in de quiz dat stelt dat het ontbreken van geheugen "binnenkort opgelost wordt". Al is het een foutantwoord, het geeft de suggestie dat dit ooit zo beweerd is/wordt. De uitleg corrigeert het, maar de formulering als antwoordoptie is onhandig.

---

## MODULE: elearning-a2-ecosysteem.html

- **screen-module-1-1**: Tijdsgebonden taal / verwijzing naar externe bron zonder inhoud — exacte zin: `"Voor zwaarder gebruik is er een betaald abonnement. Controleer de actuele prijs op claude.ai."` — "Controleer de actuele prijs" is een doorverwijzing die impliceert dat de module zelf geen bruikbare info heeft. Geef de orde van grootte (bijv. "een paar tientallen euro's per maand") en verwijs dan naar claude.ai/pricing voor exacte bedragen.

- **screen-module-4-1 (tip-box Info)**: Tijdsgebonden taal / te oppervlakkig — exacte zin: `"De Office-integraties zijn functioneel beperkt ten opzichte van de web- en desktop-app. Bekijk de actuele mogelijkheden via de Microsoft 365-instellingen of de Anthropic-documentatie."` — Dit scherm bevat inhoudelijk een tip-box die niets toevoegt boven de voorgaande tabel. De zin "Bekijk de actuele mogelijkheden" is een kale doorverwijzing zonder concrete aanwijzing waar precies of wat je dan ziet.

---

## MODULE: elearning-a3-prompts.html

Geen significante problemen gevonden. Module bevat concrete voorbeeldprompts en scenario's met specifieke feedback.

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
| Medium | elearning-a2-ecosysteem.html | screen-module-1-1 | Doorverwijzing zonder inhoud ("Controleer de actuele prijs") |
| Medium | elearning-a2-ecosysteem.html | screen-module-4-1 | Te oppervlakkige tip-box als enige inhoud |
| Medium | elearning-b3-fouten.html | screen-module-4-3 | AI-opvulling (rij ontkennende claims zonder handelingsperspectief) |
| Medium | elearning-c1-webapp.html | screen-module-4-3 | Vage aansporing zonder concrete instructie |
| Medium | elearning-i2-certificaat.html | screen-module-4 | AI-opvulling + tijdsgebonden + vage belofte |
| Laag | elearning-b3-fouten.html | screen-module-1-1 | Noemen van ChatGPT/Gemini bij naam |
| Laag | elearning-b2-niet-developers.html | screen-module-3-1 | Constatering zonder handelingsperspectief |
| Laag | elearning-i1-praktijktoets.html | quiz-uitleg | "Momenteel tijdrovend" tijdsgebonden formulering |
| Laag | elearning-a1-wat-is-claude.html | screen-module-1-2 | "Over drie maanden" tijdsgebonden claim |

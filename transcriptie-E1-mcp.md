# Transcriptie: E1 — MCP: Claude verbinden met externe tools

## Wat leer je in deze module?
Je leert wat MCP is, waarom het bestaat en hoe het Claude verbindt met externe systemen zoals je e-mail, agenda of CRM. Na deze module begrijp je het concept en weet je wat er mogelijk is — ook als je de technische implementatie zelf niet doet.

## Wat is MCP?

MCP staat voor Model Context Protocol. Het is een standaard waarmee Claude verbinding kan maken met externe tools en systemen. Zonder MCP werkt Claude alleen met de informatie die jij hem geeft in het gespreksvenster. Met MCP kan Claude informatie ophalen uit en schrijven naar systemen die je dagelijks gebruikt.

Simpel gezegd: MCP is de brug tussen Claude en de rest van je digitale werkomgeving.

## Waarom is dit belangrijk?

Stel je werkt bij een makelaarskantoor en je wilt dat Claude automatisch de agenda bijwerkt als een bezichtiging wordt ingepland, of dat Claude je CRM raadpleegt voordat hij een klantmail opstelt. Zonder MCP moet je die informatie zelf kopiëren en plakken. Met MCP haalt Claude die informatie zelf op.

Dit bespaart tijd en vermindert fouten — Claude werkt met actuele, echte data in plaats van informatie die jij hem handmatig aanlevert.

## Welke tools kan Claude verbinden via MCP?

Anthropic biedt meer dan 50 kant-en-klare connectoren:

- **Communicatie:** Gmail, Outlook, Slack
- **Planning:** Google Calendar, Outlook Calendar
- **Opslag:** Google Drive, OneDrive, Dropbox
- **Productiviteit:** Notion, Trello, Asana
- **Design:** Figma
- **Development:** GitHub, GitLab
- **En meer:** Salesforce, HubSpot, en tientallen andere zakelijke tools

## Hoe werkt MCP in de praktijk?

Je schakelt een connector in via de Claude-instellingen (bij Teams of Enterprise) of via de desktop-app. Je logt in met het account van de externe tool. Daarna kan Claude die tool gebruiken als jij hem daarvoor opdracht geeft.

Voorbeeld: je schakelt de Gmail-connector in. Nu kun je Claude vragen: "Zoek alle e-mails van klant X uit de afgelopen maand en maak een samenvatting van de open vragen." Claude doorzoekt Gmail en geeft je het antwoord — jij hoeft zelf niets te zoeken.

## Wat kan er misgaan?

MCP geeft Claude toegang tot echte systemen. Dat betekent dat fouten ook echte gevolgen hebben. Als Claude een e-mail verstuurt die je niet wilde versturen, of een agenda-item verwijdert, is dat niet zomaar ongedaan te maken.

Begin altijd met lees-toegang (Claude kan informatie ophalen maar niet aanpassen). Geef schrijf-toegang alleen als je begrijpt wat Claude ermee kan doen en als je hem getest hebt met lees-toegang.

## Hoef ik dit zelf in te stellen?

Voor de meeste gebruikers: nee. MCP-integraties worden ingesteld door een IT-beheerder of een implementatiepartner. Jij als eindgebruiker merkt het resultaat: Claude weet dingen die hij eerder niet wist.

Als je een kleine organisatie bent zonder IT-afdeling, kan een partner als Umely dit voor je inrichten.

## Samenvatting

MCP is de technologie die Claude verbindt met externe tools zoals Gmail, agenda, CRM en opslag. Het maakt Claude veel praktischer voor dagelijks werk omdat hij informatie kan ophalen en verwerken zonder dat jij alles handmatig aanlevert. Begin altijd met lees-toegang en geef schrijf-toegang pas als je Claude goed getest hebt. Voor kleine organisaties is hulp van een implementatiepartner verstandig.

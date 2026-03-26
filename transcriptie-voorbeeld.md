# Transcriptie: Claude voor bedrijven — Skills, Connectors & Plugins

Claude Skills zijn herbruikbare instructiepakketten in een SKILL.md-bestand. Je schrijft één keer wat Claude moet doen, en hij past dat consequent toe zonder dat je het elke keer opnieuw hoeft uit te leggen. Een skill heeft altijd een naam, een beschrijving zodat Claude weet wanneer hij hem laadt, en stap-voor-stap instructies. Skills sla je op in een mapje, en Claude laadt ze automatisch als de taak overeenkomt.

Connectors zijn koppelingen tussen Claude en externe systemen via het Model Context Protocol (MCP). Claude heeft meer dan 50 kant-en-klare connectors: Gmail, Google Drive, Slack, Notion, Figma en meer. Je kunt ook eigen connectors maken via een naam en server-URL. Hiermee kan Claude data lezen uit én schrijven naar jouw bestaande tools.

Plugins bundelen skills en connectors samen voor een specifieke functie. Een HR-plugin bevat connectors naar je HRIS, skills voor vacatureteksten, en een slash command. Anthropic biedt kant-en-klare templates voor HR, Finance, Legal, Marketing en Engineering. Je bouwt eigen plugins met Plugin Create — Claude stelt je vragen en genereert de plugin.

CLAUDE.md is het geheugenbestand van je project. Het is een Markdown-bestand dat Claude bij elke sessie automatisch inleest. Hierin zet je architectuurinfo, codeerstandaarden, beschikbare tools en grenzen. Houd het onder 200 regels voor optimale prestaties. Behandel het als een levend document: update het als Claude een fout maakt die je niet wil herhalen.

De beste integratiestrategie: start met één concrete usecase, bewijs de waarde, breid dan pas uit. Gebruik de API voor maatwerk. Stel governance in: wie mag welke connectors gebruiken, wat logt Claude, en waar liggen de grenzen. AI bereidt voor — mensen beslissen.

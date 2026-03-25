# 🧠 Umely — E-learning Generator

Automatisch interactieve e-learning modules genereren vanuit transcripties of samenvattingen.

## Projectstructuur

```
umely-elearning-generator/
├── CLAUDE.md                                    ← Projectgeheugen & Umely huisstijl
├── README.md                                    ← Dit bestand
├── transcriptie-voorbeeld.md                   ← Testinput
├── output/                                      ← Gegenereerde e-learnings
└── .claude/
    └── skills/
        └── elearning-generator/
            └── SKILL.md                         ← De generator skill + HTML template
```

## Gebruik in Claude Code

### 1. Open het project
```bash
cd umely-elearning-generator
claude
```

### 2. Genereer een e-learning
```
Genereer een e-learning op basis van transcriptie-voorbeeld.md
```

Claude leest automatisch CLAUDE.md en SKILL.md en genereert een complete HTML e-learning in /output.

### 3. Gebruik met eigen transcripties
Maak een nieuw .md bestand met je transcriptie en typ:
```
Genereer een e-learning op basis van mijn-transcriptie.md
```

### 4. Open de output
Open het gegenereerde HTML-bestand in je browser. Werkt volledig offline.

## Huisstijl
- Primaire kleur: **#FF5A1F** (Umely oranje)
- Font: Inter
- Knoppen: pill-shape, oranje, vetgedrukt wit

## Contact
📧 info@umely.ai | 🌐 umely.ai

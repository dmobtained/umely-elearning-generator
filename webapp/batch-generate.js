// batch-generate.js
// Genereert e-learning HTML bestanden voor alle transcriptie-*.md bestanden
// Gebruik: node batch-generate.js (vanuit webapp/)

require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 3 });
const SYSTEM_PROMPT = fs.readFileSync(path.join(__dirname, 'prompt.md'), 'utf8');
const TRANSCRIPTIES_DIR = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(__dirname, '..', 'output');

// Haal modulecode uit bestandsnaam: transcriptie-A1-wat-is-claude.md → "A1"
function getModuleCode(filename) {
  const match = filename.match(/^transcriptie-([A-Z]\d+)-/i);
  return match ? match[1].toUpperCase() : null;
}

// Haal onderwerp uit de eerste H1 in het md-bestand
function getTitleFromContent(content) {
  const match = content.match(/^#\s+(?:Transcriptie:\s*)?(?:[A-Z]\d+\s*[—–-]\s*)?(.+)$/m);
  return match ? match[1].trim() : null;
}

async function generateElearning(transcriptieFile) {
  const content = fs.readFileSync(path.join(TRANSCRIPTIES_DIR, transcriptieFile), 'utf8');
  const code = getModuleCode(transcriptieFile);
  const titleFromContent = getTitleFromContent(content);

  // Bepaal gewenste titel
  let desiredTitle;
  if (code && titleFromContent) {
    desiredTitle = `${code} — ${titleFromContent}`;
  } else if (titleFromContent) {
    desiredTitle = titleFromContent;
  } else {
    desiredTitle = transcriptieFile.replace('transcriptie-', '').replace('.md', '');
  }

  // Bepaal output bestandsnaam
  const slug = transcriptieFile
    .replace('transcriptie-', '')
    .replace('.md', '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const outputFilename = `elearning-${slug}-${date}.html`;
  const outputPath = path.join(OUTPUT_DIR, outputFilename);

  // Skip als bestand al bestaat
  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  Al aanwezig, overgeslagen: ${outputFilename}`);
    return { status: 'skipped', filename: outputFilename };
  }

  console.log(`\n🔄 Genereren: ${desiredTitle}`);
  console.log(`   Bron: ${transcriptieFile}`);
  console.log(`   Output: ${outputFilename}`);

  try {
    const userMessage = `Genereer een complete interactieve e-learning op basis van de volgende transcriptie.

BELANGRIJK: De <title> tag MOET exact zijn: "${desiredTitle} | Umely E-learning"
De h1 op het welkomstscherm moet zijn: "${desiredTitle}"
Het certificaat moet dezelfde titel bevatten: "${desiredTitle}"

Transcriptie:

${content}`;

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 32000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }]
    });

    let fullHtml = '';
    let chars = 0;
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        fullHtml += event.delta.text;
        chars += event.delta.text.length;
        // Voortgang elke 5000 tekens
        if (chars % 5000 < 100) {
          process.stdout.write(`   ${Math.round(chars / 1000)}k tekens...\r`);
        }
      }
    }

    // Strip eventuele markdown code fences
    fullHtml = fullHtml.replace(/^```html?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();

    if (!fullHtml.includes('<!DOCTYPE html>')) {
      console.log(`❌ Ongeldige output voor: ${transcriptieFile}`);
      return { status: 'error', filename: outputFilename, error: 'Geen geldige HTML' };
    }

    fs.writeFileSync(outputPath, fullHtml, 'utf8');
    console.log(`✅ Klaar: ${outputFilename} (${Math.round(chars / 1000)}k tekens)`);
    return { status: 'success', filename: outputFilename };

  } catch (err) {
    console.log(`❌ Fout bij ${transcriptieFile}: ${err.message}`);
    return { status: 'error', filename: outputFilename, error: err.message };
  }
}

async function main() {
  // Maak output map aan als die niet bestaat
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Vind alle transcriptie-*.md bestanden
  const files = fs.readdirSync(TRANSCRIPTIES_DIR)
    .filter(f => f.startsWith('transcriptie-') && f.endsWith('.md'))
    .sort();

  console.log(`\n📂 ${files.length} transcriptie(s) gevonden\n`);
  console.log('Bestanden:');
  files.forEach(f => {
    const code = getModuleCode(f);
    console.log(`  ${code ? code : '  '} → ${f}`);
  });

  let success = 0, skipped = 0, failed = 0;

  for (const file of files) {
    const result = await generateElearning(file);
    if (result.status === 'success') success++;
    else if (result.status === 'skipped') skipped++;
    else failed++;
  }

  console.log(`\n════════════════════════════════`);
  console.log(`✅ Gegenereerd:  ${success}`);
  console.log(`⏭️  Overgeslagen: ${skipped}`);
  console.log(`❌ Mislukt:      ${failed}`);
  console.log(`════════════════════════════════`);
  console.log(`\nKlaar! Draai nu: node upload-to-supabase.js`);
}

main().catch(err => {
  console.error('Onverwachte fout:', err.message);
  process.exit(1);
});

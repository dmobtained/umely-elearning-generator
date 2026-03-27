// upload-to-supabase.js
// Zet gegenereerde HTML bestanden uit /output naar Supabase
// Gebruik: node upload-to-supabase.js
// Raakt NIETS aan de bestaande webapp of server.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const OUTPUT_DIR = path.join(__dirname, '..', 'output');

async function upload() {
  // Check of output map bestaat
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log('❌ Geen output map gevonden op:', OUTPUT_DIR);
    console.log('   Zorg dat je eerst modules genereert via Claude Code.');
    process.exit(1);
  }

  // Haal alle HTML bestanden op
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.html'));

  if (files.length === 0) {
    console.log('❌ Geen HTML bestanden gevonden in /output');
    process.exit(1);
  }

  console.log(`\n📂 ${files.length} bestand(en) gevonden in /output\n`);

  let success = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const filename of files) {
    const filepath = path.join(OUTPUT_DIR, filename);
    const html = fs.readFileSync(filepath, 'utf8');

    // Controleer of het geldige HTML is
    if (!html.includes('<!DOCTYPE html>')) {
      console.log(`⚠️  Overgeslagen (ongeldig HTML): ${filename}`);
      skipped++;
      continue;
    }

    // Haal titel op uit <title> tag
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const rawTitle = titleMatch
      ? titleMatch[1].replace(' | Umely E-learning', '').trim()
      : filename.replace('.html', '');

    // Maak slug (zelfde logica als server.js)
    const slug = filename.replace('.html', '');

    // Haal datum op uit bestandsnaam (bijv. elearning-claude-20260327.html)
    const dateMatch = filename.match(/(\d{8})\.html$/);
    const createdDate = dateMatch
      ? `${dateMatch[1].slice(0,4)}-${dateMatch[1].slice(4,6)}-${dateMatch[1].slice(6,8)}`
      : new Date().toISOString().slice(0, 10);

    // Check of module al bestaat in Supabase
    const { data: existing } = await supabase
      .from('modules')
      .select('filename')
      .eq('filename', filename)
      .single();

    if (existing) {
      // Update bestaande module
      const { error } = await supabase.from('modules')
        .update({ title: rawTitle, html })
        .eq('filename', filename);

      if (error) {
        console.log(`❌ Fout bij updaten: ${filename}`);
        console.log(`   ${error.message}`);
        failed++;
      } else {
        console.log(`🔄 Bijgewerkt: ${rawTitle}`);
        updated++;
      }
    } else {
      // Nieuwe module inserten
      const { error } = await supabase.from('modules').insert({
        filename,
        title: rawTitle,
        html
      });

      if (error) {
        console.log(`❌ Fout bij uploaden: ${filename}`);
        console.log(`   ${error.message}`);
        failed++;
      } else {
        console.log(`✅ Nieuw: ${rawTitle}`);
        success++;
      }
    }
  }

  console.log(`\n────────────────────────────────`);
  console.log(`✅ Nieuw:        ${success}`);
  console.log(`🔄 Bijgewerkt:   ${updated}`);
  console.log(`⏭️  Overgeslagen: ${skipped}`);
  console.log(`❌ Mislukt:      ${failed}`);
  console.log(`────────────────────────────────`);
  console.log(`\nKlaar! Open de bibliotheek om de modules te zien.`);
}

upload().catch(err => {
  console.error('Onverwachte fout:', err.message);
  process.exit(1);
});

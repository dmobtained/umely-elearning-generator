// upload-modules.js
// Uploadt alle gebouwde HTML modules naar Supabase (upsert op slug)
// Gebruik: node upload-modules.js (vanuit de umely-elearning-generator/ map)

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const OUTPUT_DIR = path.join(__dirname, '..', 'output');

async function uploadModules() {
  // Alleen de nieuwste build (meest recente datum per slug)
  const allFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.html'));

  // Deduplicate: bewaar alleen het nieuwste bestand per base-slug
  const latestFiles = {};
  for (const file of allFiles) {
    const baseSlug = file.replace(/-\d{8}\.html$/, '');
    if (!latestFiles[baseSlug] || file > latestFiles[baseSlug]) {
      latestFiles[baseSlug] = file;
    }
  }
  const files = Object.values(latestFiles);

  if (files.length === 0) {
    console.log('Geen bestanden gevonden in output/. Run eerst: node build-modules.js');
    process.exit(1);
  }

  console.log(`${files.length} module(s) uploaden naar Supabase...\n`);

  // Haal alle bestaande modules op
  const { data: existing } = await supabase.from('modules').select('filename');
  const existingFilenames = new Set((existing || []).map(r => r.filename));

  const today = new Date().toISOString().slice(0, 10);
  let ok = 0;
  let err = 0;

  for (const file of files) {
    const html = fs.readFileSync(path.join(OUTPUT_DIR, file), 'utf8');
    const titleMatch = html.match(/<title>(.+?) \| Umely E-learning<\/title>/);
    const title = titleMatch ? titleMatch[1] : file;
    const baseSlug = file.replace(/-\d{8}\.html$/, '');

    // Zoek bestaande module met dezelfde base-slug (bijv. elearning-a3-prompts-*.html)
    const existingMatch = (existing || []).find(r => r.filename.startsWith(baseSlug + '-'));

    let error;
    if (existingMatch) {
      // UPDATE bestaande rij
      ({ error } = await supabase
        .from('modules')
        .update({ filename: file, title, html, created_date: today })
        .eq('filename', existingMatch.filename));
    } else {
      // INSERT nieuwe rij
      ({ error } = await supabase
        .from('modules')
        .insert({ filename: file, title, html, created_date: today }));
    }

    if (error) {
      console.error(`FOUT: ${baseSlug} — ${error.message}`);
      err++;
    } else {
      console.log(`${existingMatch ? 'UPDATED' : 'NIEUW  '}: ${baseSlug}`);
      ok++;
    }
  }

  console.log(`\nKlaar! ${ok} succesvol, ${err} mislukt.`);
}

uploadModules();

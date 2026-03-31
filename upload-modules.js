// upload-modules.js
// Uploadt alle gebouwde HTML modules naar Supabase (upsert op slug)
// Gebruik: node upload-modules.js (vanuit de umely-elearning-generator/ map)

require('dotenv').config({ path: './webapp/.env' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const OUTPUT_DIR = path.join(__dirname, 'output');

async function uploadModules() {
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.html'));

  if (files.length === 0) {
    console.log('Geen bestanden gevonden in output/. Run eerst: node build-modules.js');
    process.exit(1);
  }

  console.log(`${files.length} module(s) uploaden naar Supabase...\n`);

  let ok = 0;
  let err = 0;

  for (const file of files) {
    const html = fs.readFileSync(path.join(OUTPUT_DIR, file), 'utf8');

    // Haal title uit <title> tag
    const titleMatch = html.match(/<title>(.+?) \| Umely E-learning<\/title>/);
    const title = titleMatch ? titleMatch[1] : file;

    // Slug = bestandsnaam zonder datum en zonder .html
    // elearning-a3-prompts-20260331.html -> elearning-a3-prompts
    const slug = file.replace(/-\d{8}\.html$/, '');

    const today = new Date().toISOString().slice(0, 10);

    const { error } = await supabase
      .from('modules')
      .upsert(
        {
          filename: file,
          title: title,
          slug: slug,
          html: html,
          created_date: today
        },
        { onConflict: 'slug' }
      );

    if (error) {
      console.error(`FOUT: ${slug} — ${error.message}`);
      err++;
    } else {
      console.log(`OK: ${slug}`);
      ok++;
    }
  }

  console.log(`\nKlaar! ${ok} succesvol, ${err} mislukt.`);
}

uploadModules();

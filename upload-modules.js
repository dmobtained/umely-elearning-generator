// upload-modules.js
// Uploadt gegenereerde HTML-modules vanuit output/ naar Supabase (schema: elearning).
// Gebruik: node upload-modules.js

const fs = require('fs');
const path = require('path');

// ── Configuratie ──────────────────────────────────────────────────────────────

const ROOT_DIR        = __dirname;
const OUTPUT_DIR      = path.join(ROOT_DIR, 'output');
const MODULE_CONTENT  = path.join(ROOT_DIR, 'module-content');
const ENV_FILE        = path.join(ROOT_DIR, 'webapp', '.env');

// ── .env inlezen (simpele regex, geen dotenv) ─────────────────────────────────

function loadEnv(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

const env = loadEnv(ENV_FILE);
const SUPABASE_URL = env['SUPABASE_URL'];
const SUPABASE_KEY = env['SUPABASE_KEY'];

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('FOUT: SUPABASE_URL of SUPABASE_KEY niet gevonden in webapp/.env');
  process.exit(1);
}

// ── Hulpfuncties ──────────────────────────────────────────────────────────────

/**
 * Bepaal de slug door de datum-suffix te strippen.
 * Bv. elearning-a1-wat-is-claude-20260404.html -> elearning-a1-wat-is-claude
 */
function slugFromFilename(filename) {
  // Verwijder .html en strip -YYYYMMDD aan het einde
  return filename
    .replace(/\.html$/, '')
    .replace(/-\d{8}$/, '');
}

/**
 * Lees de <!-- TITLE: ... --> comment uit het source-bestand in module-content/.
 * Als het source-bestand niet bestaat, gebruik dan een fallback op basis van de slug.
 */
function titleFromSource(slug) {
  const sourceFile = path.join(MODULE_CONTENT, slug + '.html');
  if (!fs.existsSync(sourceFile)) {
    // Fallback: slug als leesbare string
    return slug;
  }
  const content = fs.readFileSync(sourceFile, 'utf8');
  const m = content.match(/<!-- TITLE:\s*(.+?)\s*-->/);
  return m ? m[1] : slug;
}

/**
 * Upsert een module naar Supabase via de REST API.
 * Conflict op `slug` -> bestaande rij bijwerken (merge-duplicates).
 */
async function upsertModule(slug, title, html) {
  const url = `${SUPABASE_URL}/rest/v1/modules?on_conflict=slug`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey':          SUPABASE_KEY,
      'Authorization':   `Bearer ${SUPABASE_KEY}`,
      'Content-Type':    'application/json',
      'Content-Profile': 'elearning',
      'Prefer':          'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify({
      slug,
      title,
      html,
      filename:     slug + '.html',
      created_date: new Date().toISOString().slice(0, 10),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HTTP ${response.status}: ${body}`);
  }

  return await response.json();
}

/**
 * Verifieer via een SQL-check (RPC of REST filter) dat de HTML in Supabase
 * daadwerkelijk opgeslagen is (lengte > 0).
 */
async function verifyModule(slug) {
  const url = `${SUPABASE_URL}/rest/v1/modules?slug=eq.${encodeURIComponent(slug)}&select=slug,html`;

  const response = await fetch(url, {
    headers: {
      'apikey':          SUPABASE_KEY,
      'Authorization':   `Bearer ${SUPABASE_KEY}`,
      'Content-Profile': 'elearning',
      'Accept':          'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Verificatie mislukt (HTTP ${response.status}): ${body}`);
  }

  const rows = await response.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('Verificatie mislukt: rij niet gevonden na upsert');
  }

  const htmlLen = (rows[0].html || '').length;
  if (htmlLen === 0) {
    throw new Error('Verificatie mislukt: opgeslagen HTML heeft lengte 0');
  }

  return htmlLen;
}

// ── Hoofd ─────────────────────────────────────────────────────────────────────

async function main() {
  // Stap 1: zoek alle elearning-*-YYYYMMDD.html bestanden in output/
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.error(`FOUT: output/ map bestaat niet: ${OUTPUT_DIR}`);
    process.exit(1);
  }

  const allFiles = fs.readdirSync(OUTPUT_DIR)
    .filter(f => /^elearning-.+-\d{8}\.html$/.test(f));

  if (allFiles.length === 0) {
    console.log('Geen bestanden gevonden in output/ die matchen op elearning-*-YYYYMMDD.html');
    process.exit(0);
  }

  // Houd per slug alleen het bestand met de hoogste datum
  const latestPerSlug = new Map();
  for (const f of allFiles) {
    const slug = slugFromFilename(f);
    const dateMatch = f.match(/-(\d{8})\.html$/);
    const date = dateMatch ? dateMatch[1] : '00000000';
    if (!latestPerSlug.has(slug) || date > latestPerSlug.get(slug).date) {
      latestPerSlug.set(slug, { file: f, date });
    }
  }
  const files = [...latestPerSlug.values()].map(v => v.file);

  console.log(`${allFiles.length} bestand(en) gevonden, ${files.length} unieke slug(s) worden geupload\n`);

  let aantalGeupload = 0;
  let aantalGefaald  = 0;
  const fouten = [];

  for (const file of files) {
    const slug  = slugFromFilename(file);
    const title = titleFromSource(slug);
    const html  = fs.readFileSync(path.join(OUTPUT_DIR, file), 'utf8');

    process.stdout.write(`Uploaden: ${file} (slug: ${slug}) ... `);

    try {
      await upsertModule(slug, title, html);

      // Verificeer na upload
      const htmlLen = await verifyModule(slug);
      console.log(`OK (${htmlLen.toLocaleString('nl-NL')} tekens opgeslagen)`);
      aantalGeupload++;
    } catch (err) {
      console.log(`FOUT`);
      fouten.push({ file, fout: err.message });
      aantalGefaald++;
    }
  }

  // ── Eindoverzicht ──────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(60));
  console.log(`Overzicht: ${aantalGeupload} geupload, ${aantalGefaald} gefaald`);

  if (fouten.length > 0) {
    console.log('\nFouten:');
    for (const { file, fout } of fouten) {
      console.log(`  ${file}: ${fout}`);
    }
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Onverwachte fout:', err);
  process.exit(1);
});

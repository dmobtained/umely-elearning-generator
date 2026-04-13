// validate-modules.js
// Technische kwaliteitscheck voor alle module-content/*.html bestanden.
// Gebruik: node validate-modules.js

const fs = require('fs');
const path = require('path');

const MODULE_DIR = path.join(__dirname, 'module-content');
const files = fs.readdirSync(MODULE_DIR)
  .filter(f => f.startsWith('elearning-') && f.endsWith('.html'))
  .sort();

// Kleuren die NIET mogen voorkomen in SVG-attributen
const VERBODEN_KLEUREN = ['#F7F4F0', '#f7f4f0', '#FAFAF8', '#fafaf8', '#F5F3EF', '#f5f3ef'];

// Externe URL-patronen die NIET mogen voorkomen (whitelist-aanpak)
const EXTERNE_URL_REGEX = /(?:src|href|url)\s*=\s*["']https?:\/\/(?!claude\.ai|anthropic\.com|docs\.anthropic\.com|support\.anthropic\.com|status\.anthropic\.com|chromewebstore\.google\.com|netlify\.com|microsoft\.com|learn\.microsoft\.com|azure\.microsoft\.com|code\.visualstudio\.com|umely\.ai|linkedin\.com|github\.com)/gi;

let totaalFouten = 0;
let totaalWaarschuwingen = 0;
const rapport = [];

function check(module, fouten, waarschuwingen) {
  rapport.push({ module, fouten, waarschuwingen });
  totaalFouten += fouten.length;
  totaalWaarschuwingen += waarschuwingen.length;
}

for (const file of files) {
  const filepath = path.join(MODULE_DIR, file);
  const html = fs.readFileSync(filepath, 'utf8');
  const fouten = [];
  const waarschuwingen = [];

  // ── 1. SCHERMEN array uitlezen ──────────────────────────────────────────────
  const schermenMatch = html.match(/<!--\s*SCHERMEN:\s*([\s\S]*?)-->/);
  let schermen = [];
  if (!schermenMatch) {
    fouten.push('SCHERMEN-comment ontbreekt');
  } else {
    schermen = [...schermenMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
    if (schermen.length === 0) fouten.push('SCHERMEN-array is leeg');
    if (!schermen.includes('screen-quiz')) fouten.push('SCHERMEN mist screen-quiz');
    if (!schermen.includes('screen-result')) fouten.push('SCHERMEN mist screen-result');
  }

  // ── 2. MODULE_TITELS uitlezen ───────────────────────────────────────────────
  const titelMatch = html.match(/<!--\s*MODULE_TITELS:([\s\S]*?)-->/);
  if (!titelMatch) {
    fouten.push('MODULE_TITELS-comment ontbreekt');
  } else {
    const titelRaw = titelMatch[1];
    // Check op lege of generieke waarden
    const lege = [...titelRaw.matchAll(/'([^']+)':\s*''/g)]
      .map(m => m[1])
      .filter(id => id !== 'screen-welcome'); // welcome wordt nooit in header getoond
    if (lege.length > 0) waarschuwingen.push(`Lege MODULE_TITELS voor: ${lege.join(', ')}`);
    const generiek = [...titelRaw.matchAll(/'([^']+)':\s*'(Module \d+|Onderdeel \d+|Topic \d+[^']*|Kennischeck)'/g)].map(m => `${m[1]}: "${m[2]}"`);
    if (generiek.length > 0) fouten.push(`Generieke MODULE_TITELS: ${generiek.join('; ')}`);
  }

  // ── 3. Alle div-IDs in het bestand verzamelen ───────────────────────────────
  const divIds = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));

  // ── 4. goTo()-targets controleren ──────────────────────────────────────────
  const goToTargets = [...html.matchAll(/goTo\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
  for (const target of goToTargets) {
    if (target === 'screen-quiz' || target === 'screen-result' || target === 'screen-welcome') continue; // worden door build toegevoegd
    if (!divIds.has(target)) {
      fouten.push(`goTo('${target}') — div#${target} ontbreekt`);
    }
  }

  // ── 5. nav-divs: NIET checken — build-modules.js maakt ze automatisch aan ─────
  // De build-script injecteert bij page load voor elk scherm in SCHERMEN een nav-div
  // als die er niet al is. Source-bestanden hoeven ze niet te bevatten.

  // ── 6. checkKC() — kc-N en kc-feedback-N ───────────────────────────────────
  const kcNummers = new Set([...html.matchAll(/checkKC\((\d+),/g)].map(m => m[1]));
  for (const nr of kcNummers) {
    if (!divIds.has(`kc-${nr}`)) fouten.push(`checkKC(${nr}) — id="kc-${nr}" ontbreekt`);
    if (!divIds.has(`kc-feedback-${nr}`)) fouten.push(`checkKC(${nr}) — id="kc-feedback-${nr}" ontbreekt`);
  }

  // ── 7. checkScenario() — scenario-N en scenario-feedback-N ─────────────────
  const scenarioNummers = new Set([...html.matchAll(/checkScenario\((\d+),/g)].map(m => m[1]));
  for (const nr of scenarioNummers) {
    if (!divIds.has(`scenario-${nr}`)) fouten.push(`checkScenario(${nr}) — id="scenario-${nr}" ontbreekt`);
    if (!divIds.has(`scenario-feedback-${nr}`)) fouten.push(`checkScenario(${nr}) — id="scenario-feedback-${nr}" ontbreekt`);
  }

  // ── 8. Quiz JSON ────────────────────────────────────────────────────────────
  const quizStart = html.indexOf('<!-- QUIZ_START -->');
  const quizEnd = html.indexOf('<!-- QUIZ_END -->');
  if (quizStart === -1 || quizEnd === -1) {
    fouten.push('QUIZ_START of QUIZ_END marker ontbreekt');
  } else if (quizStart > quizEnd) {
    fouten.push('QUIZ_START staat NA QUIZ_END');
  } else {
    const quizJson = html.slice(quizStart + 19, quizEnd).trim();
    try {
      const vragen = JSON.parse(quizJson);
      if (!Array.isArray(vragen)) {
        fouten.push('Quiz JSON is geen array');
      } else {
        if (vragen.length < 5) fouten.push(`Quiz heeft ${vragen.length} vragen — minimaal 5 vereist`);
        if (vragen.length > 7) fouten.push(`Quiz heeft ${vragen.length} vragen — maximaal 7 toegestaan`);
        vragen.forEach((v, i) => {
          if (!v.vraag) fouten.push(`Quiz vraag ${i+1}: 'vraag' veld ontbreekt`);
          if (!Array.isArray(v.opties)) fouten.push(`Quiz vraag ${i+1}: 'opties' is geen array`);
          if (typeof v.correct !== 'number') fouten.push(`Quiz vraag ${i+1}: 'correct' is geen getal`);
          else if (v.opties && (v.correct < 0 || v.correct >= v.opties.length)) fouten.push(`Quiz vraag ${i+1}: correct=${v.correct} valt buiten opties (0-${v.opties.length - 1})`);
          if (!v.uitleg) fouten.push(`Quiz vraag ${i+1}: 'uitleg' veld ontbreekt`);
        });
      }
    } catch (e) {
      fouten.push(`Quiz JSON ongeldig: ${e.message}`);
    }
  }

  // ── 9. Welkomscherm structuur ───────────────────────────────────────────────
  if (!html.includes('class="screen start"')) {
    fouten.push('Welkomscherm mist class="screen start"');
  }
  if (!html.includes('welcome-badge')) {
    waarschuwingen.push('welcome-badge niet gevonden');
  }
  if (!html.includes('tijdsbadge')) {
    waarschuwingen.push('tijdsbadge niet gevonden');
  }
  if (!html.includes('<ul') || !html.includes('leerdoelen')) {
    waarschuwingen.push('leerdoelen (<ul>) mogelijk afwezig');
  }

  // ── 10. Flashcard onclick ───────────────────────────────────────────────────
  const flashcardCount = (html.match(/class="flashcard"/g) || []).length;
  const flashcardOnclick = (html.match(/onclick="toggleFlashcard\(this\)"/g) || []).length;
  if (flashcardCount > 0 && flashcardCount !== flashcardOnclick) {
    fouten.push(`${flashcardCount} flashcards maar slechts ${flashcardOnclick} met correcte onclick`);
  }

  // ── 11. SVG viewBox breedte ─────────────────────────────────────────────────
  const svgViewboxes = [...html.matchAll(/viewBox="0 0 (\d+)/g)].map(m => parseInt(m[1]));
  for (const breedte of svgViewboxes) {
    if (breedte !== 580) {
      fouten.push(`SVG viewBox breedte is ${breedte} — moet 580 zijn`);
    }
  }

  // ── 12. Verboden kleuren ────────────────────────────────────────────────────
  for (const kleur of VERBODEN_KLEUREN) {
    if (html.includes(kleur)) {
      fouten.push(`Verboden SVG-kleur gevonden: ${kleur}`);
    }
  }

  // ── 13. M-dashes in HTML-tekst ─────────────────────────────────────────────
  // Zoek naar — in <p>, <li>, <h1-6>, <td>, <span> inhoud (niet in comments, scripts of prompt-box)
  const stripScript = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  const stripComment = stripScript.replace(/<!--[\s\S]*?-->/g, '');
  // Verwijder prompt-box content (letterlijk te kopiëren tekst voor de student — exempt)
  const stripPromptBox = stripComment.replace(/<div[^>]+class="prompt-box"[^>]*>[\s\S]*?<\/div>/gi, '');
  const mdashInTekst = stripPromptBox.match(/(?<=<(?:p|li|h[1-6]|td|span|div)[^>]*>)[^<]*—[^<]*/g);
  if (mdashInTekst && mdashInTekst.length > 0) {
    waarschuwingen.push(`M-dashes in HTML-tekst (${mdashInTekst.length}x): ${mdashInTekst.slice(0, 2).map(s => s.trim().slice(0, 60)).join(' | ')}`);
  }

  // ── 14. Tijdsgebonden taal ──────────────────────────────────────────────────
  const tijdsTermen = ['op dit moment', 'momenteel', 'binnenkort', 'in 2024', 'in 2025', 'in 2026',
    'op moment van schrijven', 'zojuist gelanceerd', 'nieuwste versie', 'recentste versie'];
  const stripScriptHtml = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  for (const term of tijdsTermen) {
    if (stripScriptHtml.toLowerCase().includes(term)) {
      fouten.push(`Tijdsgebonden taal: "${term}"`);
    }
  }

  // ── 15. Prijsbedragen ───────────────────────────────────────────────────────
  if (/[€$]\d+/.test(html)) {
    fouten.push('Prijsbedrag gevonden (€XX of $XX) — vervang door claude.ai/pricing');
  }

  // ── 16. Externe bronnen ─────────────────────────────────────────────────────
  const externeMatch = html.match(EXTERNE_URL_REGEX);
  if (externeMatch) {
    fouten.push(`Externe bronnen: ${[...new Set(externeMatch)].slice(0, 3).join(', ')}`);
  }

  // ── 17. claude.com (moet claude.ai zijn) ───────────────────────────────────
  if (html.includes('claude.com') && !html.includes('docs.anthropic.com')) {
    const matches = [...html.matchAll(/claude\.com(?!\/code)/g)];
    if (matches.length > 0) waarschuwingen.push(`claude.com gevonden — controleer of claude.ai bedoeld is`);
  }

  // ── 18. Kennischecks NIET in contentschermen ────────────────────────────────
  // Controleer of een kc-N div direct in een niet-kc scherm zit
  const schermBlokken = [...html.matchAll(/<div[^>]+id="(screen-[^"]+)"[^>]*>([\s\S]*?)(?=<div[^>]+id="screen-|$)/g)];
  for (const [, schermId, inhoud] of schermBlokken) {
    if (schermId.endsWith('-kc') || schermId === 'screen-quiz' || schermId === 'screen-result') continue;
    if (/id="kc-\d+"/.test(inhoud)) {
      fouten.push(`Kennischeck (kc-N) gevonden in contentscherm "${schermId}" — moet op eigen -kc scherm`);
    }
  }

  // ── 19. Min. componenttypen (5 voor reguliere modules, 3 voor leeropdrachten/toetsen) ──
  const componentTypes = [
    'content-card', 'tip-box', 'flashcard', 'stappen-lijst', 'vergelijk-tabel',
    'scenario-blok', 'processtroom', 'tijdlijn', 'sorteer-lijst', 'drag-items',
    'invul-wrap', 'visual-block', 'kennischeck'
  ];
  const gevonden = componentTypes.filter(c => html.includes(`class="${c}`) || html.includes(`class="${c} `));
  const isLeeropdracht = file.includes('leeropdracht') || file.includes('eindopdracht') ||
    file.includes('praktijktoets');
  const isCertificaat = file.includes('certificaat');
  const minComponenten = isCertificaat ? 2 : isLeeropdracht ? 3 : 5;
  if (gevonden.length < minComponenten) {
    fouten.push(`Slechts ${gevonden.length} componenttypen: ${gevonden.join(', ')} — minimaal ${minComponenten} vereist`);
  }

  check(file, fouten, waarschuwingen);
}

// ── Output ──────────────────────────────────────────────────────────────────
console.log('');
console.log('═'.repeat(70));
console.log('  VALIDATIERAPPORT — Umely E-learning modules');
console.log('═'.repeat(70));
console.log('');

for (const { module, fouten, waarschuwingen } of rapport) {
  const status = fouten.length === 0 ? '✓' : '✗';
  const label = fouten.length === 0 && waarschuwingen.length === 0
    ? `${status} ${module}`
    : fouten.length === 0
    ? `⚠ ${module}`
    : `${status} ${module}`;
  console.log(label);
  for (const f of fouten) console.log(`    FOUT: ${f}`);
  for (const w of waarschuwingen) console.log(`    WAARSCHUWING: ${w}`);
}

console.log('');
console.log('─'.repeat(70));
console.log(`Gecontroleerd: ${files.length} modules`);
console.log(`Fouten:        ${totaalFouten}`);
console.log(`Waarschuwingen: ${totaalWaarschuwingen}`);
console.log('─'.repeat(70));

if (totaalFouten === 0) {
  console.log('');
  console.log('Alle technische checks geslaagd.');
}

process.exit(totaalFouten > 0 ? 1 : 0);

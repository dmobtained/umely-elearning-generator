// build-modules.js
// Combineert template (CSS/JS) met per-module content tot volledige HTML bestanden
// Gebruik: node build-modules.js

const fs = require('fs');
const path = require('path');

const TEMPLATE_DIR = path.join(__dirname, 'module-content');
const OUTPUT_DIR = path.join(__dirname, 'output');
const CSS_FILE = path.join(TEMPLATE_DIR, '_shared-css.html');
const JS_FILE = path.join(TEMPLATE_DIR, '_shared-js.html');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

// Lees gedeelde CSS en JS
const sharedCSS = fs.readFileSync(CSS_FILE, 'utf8');
const sharedJS = fs.readFileSync(JS_FILE, 'utf8');

const MODULE_ORDER = [
  'elearning-a1-wat-is-claude',
  'elearning-a2-ecosysteem',
  'elearning-a3-prompts',
  'elearning-a4-leeropdracht-a',
  'elearning-b1-veiligheid',
  'elearning-b2-niet-developers',
  'elearning-b3-fouten',
  'elearning-b4-leeropdracht-b',
  'elearning-c1-webapp',
  'elearning-c2-desktop',
  'elearning-c3-chrome',
  'elearning-c4-cowork',
  'elearning-c5-excel-powerpoint',
  'elearning-c6-settings',
  'elearning-c7-organisatie',
  'elearning-c8-leeropdracht-c',
  'elearning-d1-wanneer-meer',
  'elearning-d2-claude-code',
  'elearning-d3-claude-md',
  'elearning-d4-plan-mode',
  'elearning-d5-leeropdracht-d',
  'elearning-e1-mcp',
  'elearning-e2-connectors',
  'elearning-e3-plugins',
  'elearning-e4-skills',
  'elearning-e5-eerste-skill',
  'elearning-e6-agentic-workflows',
  'elearning-e7-portfolio-website',
  'elearning-e8-leeropdracht-e',
  'elearning-i0-eindopdracht',
  'elearning-i1-praktijktoets',
  'elearning-i2-certificaat'
];

// Zoek alle content bestanden (niet _shared*)
const contentFiles = fs.readdirSync(TEMPLATE_DIR)
  .filter(f => f.endsWith('.html') && !f.startsWith('_'));

console.log(`${contentFiles.length} module(s) gevonden\n`);

const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

for (const file of contentFiles) {
  const baseSlug = file.replace('.html', '');
  const currentSlug = baseSlug + '-' + today;
  const currentIdx = MODULE_ORDER.indexOf(baseSlug);
  const nextBaseSlug = currentIdx >= 0 && currentIdx < MODULE_ORDER.length - 1
    ? MODULE_ORDER[currentIdx + 1] : null;
  const nextModuleBtn = nextBaseSlug
    ? '<a class="btn" href="/modules/' + nextBaseSlug + '">Volgende module &#8594;</a>'
    : '<a class="btn" href="/modules.html">Terug naar overzicht</a>';

  const content = fs.readFileSync(path.join(TEMPLATE_DIR, file), 'utf8');

  // Haal title uit content (eerste regel moet <!-- TITLE: ... --> zijn)
  const titleMatch = content.match(/<!-- TITLE: (.+?) -->/);
  const title = titleMatch ? titleMatch[1] : file.replace('.html', '');

  // Haal SCHERMEN en MODULE_TITELS uit content
  const schermenMatch = content.match(/<!-- SCHERMEN: (.+?) -->/);
  const titelsMatch = content.match(/<!-- MODULE_TITELS: (.+?) -->/);
  const schermen = schermenMatch ? schermenMatch[1] : '';
  const titels = titelsMatch ? titelsMatch[1] : '';

  // Haal quizVragen uit content
  const quizMatch = content.match(/<!-- QUIZ_START -->([\s\S]*?)<!-- QUIZ_END -->/);
  const quizVragen = quizMatch ? quizMatch[1].trim() : '[]';

  // Bouw het volledige HTML bestand
  const html = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${title} | Umely E-learning</title>
<link href="https://fonts.googleapis.com/css2?family=Arimo:wght@400;700&family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
${sharedCSS}
@media print {
  header, footer, .btn-wrap, .nav-buttons, #pdf-download-btn { display: none !important; }
  body { background: white !important; }
  .screen { display: none !important; }
  #screen-result { display: block !important; max-width: 680px !important; margin: 0 auto !important; padding: 20mm !important; }
  .resultaat-hero { display: none !important; }
  .certificaat { display: block !important; border: 2px solid #FF8514 !important; box-shadow: none !important; page-break-inside: avoid; }
}
</style>
</head>
<body>

<header>
  <div class="header-inner">
    <a href="/modules.html" style="display:flex;align-items:center;text-decoration:none;flex-shrink:0;">
      <img src="/logo.png" alt="Umely" style="height:90px;filter:brightness(0) invert(1);display:block;">
    </a>
    <span class="header-title" id="header-module-title"></span>
    <div style="display:flex;align-items:center;gap:10px;flex-shrink:0;">
      <span id="progressLabel" style="font-size:0.8rem;color:rgba(255,248,242,0.8);font-weight:700;white-space:nowrap;">0% voltooid</span>
      <a href="/modules.html" style="color:rgba(255,248,242,0.7);font-size:0.8rem;text-decoration:none;font-weight:600;padding:6px 14px;border:1.5px solid rgba(255,248,242,0.25);border-radius:50px;white-space:nowrap;transition:all 0.15s;">&#8592; Overzicht</a>
    </div>
  </div>
  <div style="background:rgba(255,248,242,0.12);height:8px;overflow:hidden;margin-top:0.5rem;">
    <div id="progressBar" style="height:100%;background:var(--gradient);transition:width 0.5s ease;width:0%;box-shadow:0 0 8px rgba(255,133,20,0.5);"></div>
  </div>
</header>

${content
    .replace(/<!-- TITLE: .+? -->/, '')
    .replace(/<!-- SCHERMEN: .+? -->/, '')
    .replace(/<!-- MODULE_TITELS: .+? -->/, '')
    .replace(/<!-- QUIZ_START -->[\s\S]*?<!-- QUIZ_END -->/, '')
    .replace('<div class="welcome-badge">Umely E-learning</div>', '<div class="welcome-badge">Umely E-learning</div>')
    .trim()}

<!-- AFSLUITQUIZ -->
<div id="screen-quiz" class="screen">
  <div class="quiz-header">
    <h2>Afsluitquiz</h2>
  </div>
  <div class="content-card">
    <div id="quiz-voortgang" class="quiz-voortgang">Vraag 1 van 5</div>
    <p id="quiz-vraag-tekst" class="quiz-vraag-tekst"></p>
    <div id="quiz-opties" class="quiz-opties"></div>
    <div id="quiz-feedback" class="quiz-feedback"></div>
    <div class="btn-wrap">
      <button id="quiz-volgende-btn" class="btn" style="display:none;" onclick="volgendeQuizVraag()">Volgende vraag</button>
    </div>
  </div>
</div>

<!-- RESULTAAT -->
<div id="screen-result" class="screen">
  <div class="resultaat-hero">
    <div class="score-cirkel" id="score-display">...</div>
    <h2 style="font-family:var(--font-h);margin-bottom:0.5rem;">Training afgerond!</h2>
    <p id="resultaat-boodschap" style="color:rgba(255,248,242,0.85);position:relative;"></p>
  </div>
  <div class="btn-wrap">
    <button class="btn btn-outline" onclick="herstart()">Opnieuw beginnen</button>
    ${nextModuleBtn}
  </div>
</div>

<footer>
  <strong>Umely</strong> - Jouw vaste AI-partner<br>
  <a href="mailto:info@umely.ai">info@umely.ai</a> · umely.ai
</footer>

<script>
const SCHERMEN = [${schermen}];
const MODULE_TITELS = {${titels}};

${sharedJS}

const quizVragen = ${quizVragen};

// ── Voortgang opslaan ──
async function saveProgress(scorePct) {
  var token = window.__AUTH_TOKEN__;
  if (!token) return;
  try {
    await fetch('/api/user/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ module_slug: '${baseSlug}', score_pct: scorePct, completed: scorePct >= 70 })
    });
  } catch(e) {}
}

// ── Hook: aangeroepen door shared-js als quiz klaar is ──
function onQuizCompleted(pct) {
  saveProgress(pct);
  if (pct >= 70) {
    var btn = document.getElementById('pdf-download-btn');
    if (btn) btn.style.display = 'inline-block';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Inject module name into all module headers
  document.querySelectorAll('.module-header').forEach(function(header) {
    var nameDiv = document.createElement('div');
    nameDiv.className = 'module-naam';
    nameDiv.textContent = ${JSON.stringify(title)};
    header.insertBefore(nameDiv, header.firstChild);
  });
  // Inject nav-buttons class into each screen (except welcome, quiz, result)
  SCHERMEN.forEach(function(id) {
    if (id === 'screen-welcome' || id === 'screen-quiz' || id === 'screen-result') return;
    var navEl = document.getElementById('nav-' + id);
    if (navEl) {
      navEl.className = 'nav-buttons';
    } else {
      var screen = document.getElementById(id);
      if (screen) {
        var nav = document.createElement('div');
        nav.className = 'nav-buttons';
        nav.id = 'nav-' + id;
        screen.appendChild(nav);
      }
    }
  });
  goTo('screen-welcome');
  laadQuizVraag();
});
</script>
</body>
</html>`;

  const outputName = file.replace('.html', '-' + today + '.html');
  fs.writeFileSync(path.join(OUTPUT_DIR, outputName), html, 'utf8');
  console.log(`Gebouwd: ${outputName}`);
}

console.log('\nKlaar!');

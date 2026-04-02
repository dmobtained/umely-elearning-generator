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
  'elearning-b1-veiligheid',
  'elearning-b2-niet-developers',
  'elearning-b3-fouten',
  'elearning-c1-webapp',
  'elearning-c2-desktop',
  'elearning-c3-chrome',
  'elearning-c4-cowork',
  'elearning-c5-excel-powerpoint',
  'elearning-c6-settings',
  'elearning-c7-organisatie',
  'elearning-d1-claude-code',
  'elearning-d2-claude-md',
  'elearning-d3-plan-mode',
  'elearning-e1-mcp',
  'elearning-e2-connectors',
  'elearning-e3-plugins',
  'elearning-e4-skills',
  'elearning-e5-eerste-skill',
  'elearning-e6-agentic-workflows',
  'elearning-e7-portfolio-website',
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
  const nextSlug = nextBaseSlug ? nextBaseSlug + '-' + today : null;
  const nextModuleBtn = nextSlug
    ? '<a class="btn" href="/modules/' + nextSlug + '">Volgende module &#8594;</a>'
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
<meta name="viewport" content="width=device-width, initial-scale=1.0">
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
    <div style="display:flex;flex-direction:column;align-items:flex-start;gap:0.25rem;">
      <a href="/modules.html"><img src="/logo.png" alt="Umely" style="height:65px;filter:brightness(0) invert(1);display:block;"></a>
      <a href="/modules.html" style="color:rgba(255,248,242,0.6);font-size:0.75rem;text-decoration:none;font-weight:600;">&#8592; Overzicht</a>
    </div>
    <span class="header-title" id="header-module-title"></span>
    <span style="width:100px;"></span>
  </div>
  <div style="max-width:860px;margin:0.75rem auto 0;background:rgba(255,248,242,0.15);border-radius:50px;height:6px;overflow:hidden;">
    <div id="progressBar" style="height:100%;background:var(--gradient);border-radius:50px;transition:width 0.4s ease;width:0%;"></div>
  </div>
  <div id="progressLabel" style="text-align:right;font-size:0.75rem;color:rgba(255,248,242,0.6);font-weight:600;max-width:860px;margin:0.25rem auto 0.5rem;padding-right:0;">0% voltooid</div>
</header>

${content
    .replace(/<!-- TITLE: .+? -->/, '')
    .replace(/<!-- SCHERMEN: .+? -->/, '')
    .replace(/<!-- MODULE_TITELS: .+? -->/, '')
    .replace(/<!-- QUIZ_START -->[\s\S]*?<!-- QUIZ_END -->/, '')
    .replace('<div class="welcome-badge">Umely E-learning</div>', '<div class="welcome-badge"><img src="/logo.png" alt="Umely" style="height:28px;filter:brightness(0) invert(1);vertical-align:middle;"></div>')
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
      body: JSON.stringify({ module_slug: '${currentSlug}', score_pct: scorePct, completed: scorePct >= 70 })
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
    nameDiv.textContent = '${title}';
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

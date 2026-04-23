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
      <a href="/modules.html" class="header-back" style="color:rgba(255,248,242,0.7);font-size:0.8rem;text-decoration:none;font-weight:600;padding:6px 14px;border:1.5px solid rgba(255,248,242,0.25);border-radius:50px;white-space:nowrap;transition:all 0.15s;">&#8592; Overzicht</a>
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
  ${baseSlug === 'elearning-lezing-handout' ? `
  <div style="margin-top:2.5rem;">
    <div style="text-align:center;margin-bottom:1.5rem;">
      <p style="font-size:1rem;color:rgba(42,34,26,0.6);letter-spacing:0.05em;text-transform:uppercase;font-weight:700;margin-bottom:0.4rem">Wat komt hierna?</p>
      <h3 style="font-family:'Arimo',sans-serif;font-size:1.6rem;color:#2A221A;margin:0">De volledige Umely e-learning</h3>
    </div>
    <div style="background:#2A221A;border-radius:16px;padding:1.75rem;margin-bottom:1.25rem;">
      <p style="color:#FFF8F2;font-size:1rem;line-height:1.7;margin-bottom:1.25rem">Je hebt nu de basis. Maar er is nog veel meer: 33 interactieve modules over Claude, automatisering, slimme tools en veel meer. Stap voor stap, op jouw tempo.</p>
      <div style="display:grid;gap:0.75rem;">
        <div style="display:flex;align-items:flex-start;gap:0.75rem;">
          <span style="color:#FF8514;font-size:1.1rem;flex-shrink:0;margin-top:0.1rem">&#10003;</span>
          <span style="color:#FFF8F2;font-size:0.95rem">Claude instellen als jouw persoonlijke assistent die jouw stijl en context kent</span>
        </div>
        <div style="display:flex;align-items:flex-start;gap:0.75rem;">
          <span style="color:#FF8514;font-size:1.1rem;flex-shrink:0;margin-top:0.1rem">&#10003;</span>
          <span style="color:#FFF8F2;font-size:0.95rem">Automatiseringen bouwen die voor je werken terwijl jij iets anders doet</span>
        </div>
        <div style="display:flex;align-items:flex-start;gap:0.75rem;">
          <span style="color:#FF8514;font-size:1.1rem;flex-shrink:0;margin-top:0.1rem">&#10003;</span>
          <span style="color:#FFF8F2;font-size:0.95rem">Werkprocessen versnellen: e-mails, verslagen, presentaties in een fractie van de tijd</span>
        </div>
        <div style="display:flex;align-items:flex-start;gap:0.75rem;">
          <span style="color:#FF8514;font-size:1.1rem;flex-shrink:0;margin-top:0.1rem">&#10003;</span>
          <span style="color:#FFF8F2;font-size:0.95rem">Praktisch en direct toepasbaar — elke module eindigt met iets wat je die dag nog kunt gebruiken</span>
        </div>
        <div style="display:flex;align-items:flex-start;gap:0.75rem;">
          <span style="color:#FF8514;font-size:1.1rem;flex-shrink:0;margin-top:0.1rem">&#10003;</span>
          <span style="color:#FFF8F2;font-size:0.95rem">Certificaat bij afsluiting + toegang tot alle nieuwe modules</span>
        </div>
      </div>
    </div>
    <div style="background:rgba(255,133,20,0.07);border:1.5px solid rgba(255,133,20,0.25);border-radius:12px;padding:1.25rem;margin-bottom:1.25rem;display:flex;align-items:center;gap:1rem;">
      <span style="font-size:2rem;flex-shrink:0">&#128172;</span>
      <div>
        <p style="font-weight:700;color:#2A221A;margin:0 0 0.2rem">Liever eerst een gesprek?</p>
        <p style="color:rgba(42,34,26,0.7);font-size:0.9rem;margin:0">Sonny en het team helpen je bepalen wat AI voor jou of jouw organisatie kan betekenen. Gratis en vrijblijvend.</p>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:0.75rem;align-items:center;">
      <a href="/pricing" style="display:block;width:100%;max-width:400px;background:var(--gradient);color:white;text-decoration:none;padding:16px 32px;border-radius:50px;font-weight:800;font-size:1.05rem;text-align:center;box-shadow:0 4px 20px rgba(255,133,20,0.35);">Bekijk de volledige e-learning &#8594;</a>
      <a href="https://umely.ai" target="_blank" rel="noopener" style="display:block;width:100%;max-width:400px;background:transparent;color:#FF8514;text-decoration:none;padding:14px 32px;border-radius:50px;font-weight:700;font-size:0.95rem;text-align:center;border:1.5px solid #FF8514;">Plan een gratis gesprek</a>
    </div>
  </div>
  ` : ''}
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

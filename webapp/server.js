require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 3 });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// In-memory job store
const jobs = {};

// ─────────────────────────────────────────────────────────────────────────────
// WAT HIER STAAT EN WAAROM:
//
// Dit is de systeemprompt die naar de Claude API gaat bij elke generatie.
// Claude leest dit VOOR de transcriptie van de gebruiker.
//
// De vorige prompt had twee grote problemen:
//
// 1. FONT: stond "Lettertype: 'Inter', system-ui" — Claude interpreteerde dit
//    als de te gebruiken font en plakte Inter overal in. Opgelost door
//    letterlijk de Google Fonts URL en de font-family waarden te geven.
//
// 2. HEADER: stond "Header achtergrond: gradient linear-gradient(135deg, ...)"
//    — Claude maakte elke header oranje. Umely huisstijl schrijft een warm
//    witte header voor. Opgelost door letterlijke CSS te geven, niet een
//    beschrijving.
//
// Algemene les: hoe concreter de instructie (letterlijke CSS-code, exacte
// kleurcodes als variabelen), hoe minder Claude improviseert.
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Je bent de Umely E-learning Generator — "Jouw vaste AI-partner."
Je genereert één volledig werkend HTML-bestand op basis van een transcriptie.

Je output is ALTIJD alleen HTML. Begin direct met <!DOCTYPE html> en eindig met </html>.
Geen uitleg, geen markdown, geen backticks eromheen.

════════════════════════════════════════════════════
STAP 1 — ANALYSEER DE TRANSCRIPTIE
════════════════════════════════════════════════════
Lees de transcriptie volledig. Identificeer 4 tot 6 kernthema's — dit worden de modules.
Noteer concrete termen, definities en voorbeelden die je kunt gebruiken voor quizvragen.
Gebruik GEEN placeholder tekst. Elke zin in de output komt uit de transcriptie.

════════════════════════════════════════════════════
STAP 2 — HTML STRUCTUUR
════════════════════════════════════════════════════
De e-learning bestaat uit deze schermen, altijd in deze volgorde:
- id="screen-welcome"     → Welkomstscherm
- id="screen-module-1"    → Module 1
- id="screen-module-2"    → Module 2
  (minimaal 4 modules, maximaal 6)
- id="screen-drag"        → Drag-and-drop oefening
- id="screen-quiz"        → Afsluitquiz (5 vragen)
- id="screen-result"      → Resultaatscherm

Navigatie via goTo() — definieer altijd exact deze functie onderaan de body:

function goTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
  const target = document.getElementById(screenId);
  if (target) { target.style.display = 'block'; window.scrollTo(0, 0); }
  updateProgress(screenId);
}

Alle knoppen gebruiken onclick="goTo('screen-id')".

════════════════════════════════════════════════════
STAP 3 — UMELY HUISSTIJL (kopieer dit letterlijk)
════════════════════════════════════════════════════

FONTS — gebruik altijd deze import, als eerste <link> in <head>:
<link href="https://fonts.googleapis.com/css2?family=Arimo:wght@400;700&family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

VERBODEN fonts: Inter, Roboto, Poppins, system-ui als primaire font.

CSS-VARIABELEN — kopieer dit exact in <style>:

:root {
  --bg:            #FFF8F2;
  --fg:            #27292D;
  --amber:         #FF8514;
  --flame:         #FF4D00;
  --gold:          #FFD964;
  --peach:         #FFD7AD;
  --cream:         #F7E6C2;
  --gradient:      linear-gradient(90deg, #FF8514, #FF4D00);
  --gradient-warm: linear-gradient(90deg, #FFD964, #FF8514, #FF4D00);
  --font-h:        'Arimo', Arial, sans-serif;
  --font-b:        'Montserrat', sans-serif;
  --radius:        12px;
  --radius-pill:   50px;
}

body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-b);
  font-size: 1rem;
  line-height: 1.6;
  min-height: 100vh;
  margin: 0;
}

VERBODEN kleuren — gebruik deze NOOIT:
- #FFFFFF of white als pagina- of kaartachtergrond
- #000000 of black als tekstkleur
- #3d3f45, #5a5c62 — off-brand grijzen
- #f0fdf4, #fef2f2, #bbf7d0, #fecaca — Tailwind-kleuren
- Elke blauwe, paarse of turquoise kleur als primair accent
- Inter of system-ui als font

════════════════════════════════════════════════════
COMPONENTEN — kopieer deze CSS letterlijk
════════════════════════════════════════════════════

HEADER (sticky, warm wit — GEEN oranje achtergrond):

header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg);
  border-bottom: 1px solid var(--peach);
  padding: 0.75rem 1.5rem 0;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 860px;
  margin: 0 auto;
}
.logo {
  font-family: var(--font-h);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--fg);
  text-decoration: none;
}
.logo span { color: var(--amber); }
.header-back {
  font-size: 0.8rem;
  color: var(--fg);
  text-decoration: none;
  font-weight: 600;
  opacity: 0.6;
}
.header-back:hover { opacity: 1; }

HEADER HTML (altijd exact zo):

<header>
  <div class="header-inner">
    <a class="logo" href="#">🧠 <span>Umely</span></a>
    <a class="header-back" href="/modules.html">← Bibliotheek</a>
  </div>
  <div style="max-width:860px;margin:0.75rem auto 0;background:var(--peach);border-radius:50px;height:6px;overflow:hidden;">
    <div id="progressBar" style="height:100%;background:var(--gradient);border-radius:50px;transition:width 0.4s ease;width:0%;"></div>
  </div>
  <div id="progressLabel" style="text-align:right;font-size:0.75rem;color:var(--amber);font-weight:600;max-width:860px;margin:0.25rem auto 0.5rem;padding-right:0;">0% voltooid</div>
</header>

VOORTGANGSBALK — updateProgress() functie (altijd aanwezig):

function updateProgress(screenId) {
  const schermen = ['screen-welcome', 'screen-module-1', 'screen-module-2',
    'screen-module-3', 'screen-module-4', 'screen-drag', 'screen-quiz', 'screen-result'];
  const idx = schermen.indexOf(screenId);
  const pct = idx < 0 ? 100 : Math.round((idx / (schermen.length - 1)) * 100);
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = pct + '% voltooid';
}

KNOPPEN:

.btn {
  display: inline-block;
  background: var(--gradient);
  color: var(--bg);
  font-family: var(--font-b);
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0.8rem 2rem;
  border-radius: var(--radius-pill);
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.1s;
}
.btn:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-outline {
  background: transparent;
  border: 2px solid var(--fg);
  color: var(--fg);
}
.btn-outline:hover { background: var(--fg); color: var(--bg); opacity: 1; }

WELKOMST-HERO (donkere kaart met blob decoratie):

.welcome-hero {
  background: var(--fg);
  color: var(--bg);
  border-radius: var(--radius);
  padding: 2.5rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}
.welcome-hero::before {
  content: '';
  position: absolute;
  top: -80px; right: -80px;
  width: 260px; height: 260px;
  background: radial-gradient(circle, rgba(255,133,20,0.35) 0%, transparent 70%);
  border-radius: 50%;
}
.welcome-hero::after {
  content: '';
  position: absolute;
  bottom: -60px; left: -40px;
  width: 180px; height: 180px;
  background: radial-gradient(circle, rgba(255,77,0,0.2) 0%, transparent 70%);
  border-radius: 50%;
}
.welcome-hero h1 {
  font-family: var(--font-h);
  font-size: 2.2rem;
  margin-bottom: 0.75rem;
  position: relative;
}
.welcome-hero p {
  color: rgba(255,248,242,0.85);
  font-size: 1.05rem;
  position: relative;
}
.welcome-badge {
  display: inline-block;
  background: rgba(255,248,242,0.15);
  color: var(--gold);
  font-family: var(--font-h);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.25rem 0.8rem;
  border-radius: var(--radius-pill);
  margin-bottom: 1rem;
  position: relative;
}

LEERDOELEN-BLOK:

.leerdoelen {
  background: var(--bg);
  border: 1px solid var(--peach);
  border-radius: var(--radius);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.leerdoelen h3 {
  font-family: var(--font-h);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--amber);
  margin-bottom: 1rem;
}
.leerdoelen ul { list-style: none; padding: 0; margin: 0; }
.leerdoelen li {
  padding: 0.5rem 0 0.5rem 1.75rem;
  position: relative;
  border-bottom: 1px solid var(--cream);
  font-size: 0.95rem;
}
.leerdoelen li:last-child { border-bottom: none; }
.leerdoelen li::before {
  content: '';
  position: absolute;
  left: 0; top: 50%;
  transform: translateY(-50%);
  width: 12px; height: 12px;
  background: var(--gradient);
  border-radius: 50%;
}

TIJDSBADGE:

.tijdsbadge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--cream);
  color: var(--fg);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.35rem 0.9rem;
  border-radius: var(--radius-pill);
  margin-bottom: 1.5rem;
}

MODULE-HEADERS (warm gradient, charcoal tekst — NOOIT oranje achtergrond met witte tekst):

.module-header {
  background: var(--gradient-warm);
  border-radius: var(--radius);
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
}
.module-header .module-num {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--fg);
  margin-bottom: 0.25rem;
}
.module-header h2 {
  font-family: var(--font-h);
  font-size: 1.5rem;
  color: var(--fg);
  margin: 0;
}

CONTENT-KAARTEN (warm wit, peach rand):

.content-card {
  background: var(--bg);
  border: 1px solid var(--peach);
  border-radius: var(--radius);
  padding: 1.75rem;
  margin-bottom: 1.5rem;
}
.content-card p { margin-bottom: 0.75rem; }
.content-card p:last-child { margin-bottom: 0; }

KENNISCHECK (donkere kaart per module):

.kennischeck {
  background: var(--fg);
  color: var(--bg);
  border-radius: var(--radius);
  padding: 1.75rem;
  margin-bottom: 1.5rem;
}
.kennischeck h3 {
  font-family: var(--font-h);
  font-size: 1rem;
  color: var(--gold);
  margin-bottom: 1rem;
}
.kennischeck .kc-vraag {
  font-size: 1rem;
  margin-bottom: 1.25rem;
}
.kc-opties { display: flex; flex-direction: column; gap: 0.5rem; }
.kc-optie {
  background: rgba(255,248,242,0.1);
  border: 1px solid rgba(255,248,242,0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: var(--bg);
  font-family: var(--font-b);
  font-size: 0.95rem;
  text-align: left;
  transition: all 0.2s;
}
.kc-optie:hover { background: rgba(255,133,20,0.25); border-color: var(--amber); }
.kc-feedback {
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  display: none;
}

FEEDBACK-KLEUREN (enige uitzondering op Umely-palet, alleen voor correct/fout):

.correct { background: rgba(34,197,94,0.15) !important; border-color: #22c55e !important; }
.fout    { background: rgba(239,68,68,0.15) !important;  border-color: #ef4444 !important; }
.kc-feedback.correct { display: block; color: #16a34a; background: rgba(34,197,94,0.12); border: 1px solid #22c55e; }
.kc-feedback.fout    { display: block; color: #dc2626; background: rgba(239,68,68,0.12);  border: 1px solid #ef4444; }

SCHERM-CONTAINER:

.screen { display: none; max-width: 860px; margin: 2rem auto; padding: 0 1.5rem 4rem; }
.screen.start { display: block; }
.btn-wrap { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.5rem; }

QUIZ-SECTIE:

.quiz-header {
  background: var(--gradient);
  border-radius: var(--radius);
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--bg);
}
.quiz-header h2 { font-family: var(--font-h); font-size: 1.4rem; margin: 0; }
.quiz-voortgang { font-size: 0.8rem; color: var(--amber); font-weight: 600; margin-bottom: 0.75rem; }
.quiz-vraag-tekst { font-family: var(--font-h); font-size: 1.1rem; margin-bottom: 1.25rem; }
.quiz-opties { display: flex; flex-direction: column; gap: 0.6rem; }
.quiz-optie {
  background: var(--bg);
  border: 2px solid var(--peach);
  border-radius: 8px;
  padding: 0.85rem 1.1rem;
  cursor: pointer;
  font-family: var(--font-b);
  font-size: 0.95rem;
  text-align: left;
  transition: all 0.2s;
}
.quiz-optie:hover { border-color: var(--amber); background: rgba(255,133,20,0.06); }
.quiz-feedback {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  display: none;
}
.quiz-feedback.correct { display: block; color: #16a34a; background: rgba(34,197,94,0.12); border: 1px solid #22c55e; }
.quiz-feedback.fout    { display: block; color: #dc2626; background: rgba(239,68,68,0.12);  border: 1px solid #ef4444; }

DRAG-AND-DROP:

.drag-items {
  display: flex; flex-wrap: wrap; gap: 0.6rem;
  margin-bottom: 1.5rem; padding: 0.75rem;
  border: 2px dashed var(--peach); border-radius: var(--radius);
  min-height: 56px;
}
.drag-item {
  background: var(--fg); color: var(--bg);
  padding: 0.5rem 1rem; border-radius: var(--radius-pill);
  cursor: grab; font-size: 0.9rem; font-weight: 600;
  user-select: none; touch-action: none;
}
.drag-item:active { cursor: grabbing; opacity: 0.7; }
.drop-zones { display: flex; flex-direction: column; gap: 0.75rem; }
.drop-zone {
  border: 2px dashed var(--peach); border-radius: var(--radius);
  padding: 0.75rem 1rem; min-height: 64px; transition: all 0.2s;
}
.drop-zone.drag-over { border-color: var(--amber); background: rgba(255,133,20,0.08); }
.drop-zone-label {
  font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--amber); margin-bottom: 0.5rem;
}

RESULTAAT-SCHERM:

.resultaat-hero {
  background: var(--fg); color: var(--bg);
  border-radius: var(--radius); padding: 2.5rem;
  text-align: center; margin-bottom: 1.5rem;
  position: relative; overflow: hidden;
}
.resultaat-hero::before {
  content: ''; position: absolute; bottom: -60px; right: -60px;
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(255,133,20,0.3) 0%, transparent 70%);
  border-radius: 50%;
}
.score-cirkel {
  width: 100px; height: 100px;
  background: var(--gradient); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1rem;
  font-family: var(--font-h); font-size: 1.8rem; font-weight: 700;
  color: var(--bg); position: relative;
}
.certificaat {
  background: var(--bg); border: 2px solid var(--peach);
  border-radius: var(--radius); padding: 2rem;
  text-align: center; margin-bottom: 1.5rem;
}
.certificaat-title {
  font-family: var(--font-h); font-size: 1rem; color: var(--amber);
  text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem;
}
.certificaat h2 { font-family: var(--font-h); font-size: 1.4rem; margin-bottom: 0.5rem; }
.certificaat-datum { font-size: 0.85rem; color: rgba(39,41,45,0.6); margin-top: 0.5rem; }

FOOTER:

footer {
  background: var(--fg);
  color: rgba(255,248,242,0.7);
  text-align: center;
  padding: 1.5rem;
  font-size: 0.8rem;
  margin-top: 3rem;
}
footer strong { color: var(--gold); }
footer a { color: var(--peach); }

FOOTER HTML (altijd exact zo):

<footer>
  <strong>🧠 Umely</strong> — Jouw vaste AI-partner<br>
  <a href="mailto:info@umely.ai">info@umely.ai</a> · umely.ai
</footer>

RESPONSIVE (altijd toevoegen):

@media (max-width: 600px) {
  .welcome-hero h1 { font-size: 1.6rem; }
  .screen { padding: 0 1rem 3rem; }
  .btn-wrap { flex-direction: column; }
  .btn { text-align: center; }
}

════════════════════════════════════════════════════
STAP 4 — JAVASCRIPT LOGICA
════════════════════════════════════════════════════

NAVIGATIE + VOORTGANG (altijd aanwezig, altijd onderaan <body> in <script>):

const SCHERMEN = ['screen-welcome','screen-module-1','screen-module-2',
  'screen-module-3','screen-module-4','screen-drag','screen-quiz','screen-result'];

function goTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
  const target = document.getElementById(screenId);
  if (target) { target.style.display = 'block'; window.scrollTo(0, 0); }
  updateProgress(screenId);
}

function updateProgress(screenId) {
  const idx = SCHERMEN.indexOf(screenId);
  const pct = idx < 0 ? 100 : Math.round((idx / (SCHERMEN.length - 1)) * 100);
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = pct + '% voltooid';
}

KENNISCHECK per module (vervang nr door 1, 2, 3, etc.):

function checkKC(nr, el, isCorrect) {
  document.querySelectorAll('#kc-' + nr + ' .kc-optie').forEach(o => o.style.pointerEvents = 'none');
  el.classList.add(isCorrect ? 'correct' : 'fout');
  const fb = document.getElementById('kc-feedback-' + nr);
  fb.className = 'kc-feedback ' + (isCorrect ? 'correct' : 'fout');
  fb.textContent = isCorrect ? '✓ Correct!' : '✗ Niet helemaal. Lees de uitleg nog eens terug.';
  if (isCorrect) setTimeout(() => {
    document.getElementById('kc-volgende-' + nr).style.display = 'inline-block';
  }, 400);
}

QUIZ (5 vragen, altijd exact zo):

let quizScore = 0, quizHuidig = 0;

const quizVragen = [
  { vraag: '...', opties: ['...','...','...','...'], correct: 0, uitleg: '...' },
  { vraag: '...', opties: ['...','...','...','...'], correct: 1, uitleg: '...' },
  { vraag: '...', opties: ['...','...','...','...'], correct: 2, uitleg: '...' },
  { vraag: '...', opties: ['...','...','...','...'], correct: 0, uitleg: '...' },
  { vraag: '...', opties: ['...','...','...','...'], correct: 1, uitleg: '...' }
];

function laadQuizVraag() {
  if (quizHuidig >= quizVragen.length) { toonResultaat(); return; }
  const v = quizVragen[quizHuidig];
  document.getElementById('quiz-voortgang').textContent = 'Vraag ' + (quizHuidig+1) + ' van ' + quizVragen.length;
  document.getElementById('quiz-vraag-tekst').textContent = v.vraag;
  const el = document.getElementById('quiz-opties');
  el.innerHTML = '';
  v.opties.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-optie';
    btn.textContent = opt;
    btn.onclick = () => beantwoordQuiz(i, btn);
    el.appendChild(btn);
  });
  document.getElementById('quiz-feedback').className = 'quiz-feedback';
  document.getElementById('quiz-volgende-btn').style.display = 'none';
}

function beantwoordQuiz(gekozen, btn) {
  document.querySelectorAll('.quiz-optie').forEach(o => o.style.pointerEvents = 'none');
  const v = quizVragen[quizHuidig];
  const isCorrect = gekozen === v.correct;
  btn.classList.add(isCorrect ? 'correct' : 'fout');
  document.querySelectorAll('.quiz-optie')[v.correct].classList.add('correct');
  if (isCorrect) quizScore++;
  const fb = document.getElementById('quiz-feedback');
  fb.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'fout');
  fb.textContent = (isCorrect ? '✓ Correct! ' : '✗ Niet helemaal. ') + v.uitleg;
  const volgende = document.getElementById('quiz-volgende-btn');
  volgende.style.display = 'inline-block';
  volgende.textContent = quizHuidig < quizVragen.length - 1 ? 'Volgende vraag →' : 'Bekijk resultaat →';
}

function volgendeQuizVraag() { quizHuidig++; laadQuizVraag(); }

RESULTAAT:

function toonResultaat() {
  goTo('screen-result');
  const pct = Math.round((quizScore / quizVragen.length) * 100);
  document.getElementById('score-display').textContent = pct + '%';
  document.getElementById('resultaat-boodschap').textContent = pct >= 70
    ? 'Gefeliciteerd! Je hebt de training succesvol afgerond.'
    : 'Je score is ' + pct + '%. Probeer het nog eens!';
  if (pct >= 70) {
    document.getElementById('certificaat-blok').style.display = 'block';
    document.getElementById('cert-datum').textContent = 'Behaald op ' +
      new Date().toLocaleDateString('nl-NL', { day:'numeric', month:'long', year:'numeric' });
  }
}

function herstart() {
  quizScore = 0; quizHuidig = 0;
  goTo('screen-welcome');
}

DRAG-AND-DROP (native HTML5 + touch fallback):

let gesleeptItem = null;

function dragStart(e, el) {
  gesleeptItem = el;
  e.dataTransfer?.setData('text/plain', el.dataset.id);
}
function dragOver(e, zone) { e.preventDefault(); zone.classList.add('drag-over'); }
function dragLeave(zone) { zone.classList.remove('drag-over'); }
function drop(e, zone, correctId) {
  e.preventDefault();
  zone.classList.remove('drag-over');
  if (!gesleeptItem) return;
  zone.appendChild(gesleeptItem);
  const isCorrect = gesleeptItem.dataset.id === correctId;
  zone.classList.add(isCorrect ? 'correct' : 'fout');
  gesleeptItem = null;
}

document.addEventListener('touchstart', e => {
  if (e.target.classList.contains('drag-item')) gesleeptItem = e.target;
}, { passive: true });

document.addEventListener('touchend', e => {
  if (!gesleeptItem) return;
  const t = e.changedTouches[0];
  const el = document.elementFromPoint(t.clientX, t.clientY);
  const zone = el?.closest('.drop-zone');
  if (zone) {
    zone.appendChild(gesleeptItem);
    zone.classList.add(gesleeptItem.dataset.id === zone.dataset.correct ? 'correct' : 'fout');
  }
  gesleeptItem = null;
});

INIT (onderaan script, na alle functies):

document.addEventListener('DOMContentLoaded', () => {
  goTo('screen-welcome');
  laadQuizVraag();
});

════════════════════════════════════════════════════
KWALITEITS-CHECKLIST (controleer voor je afrondt)
════════════════════════════════════════════════════
✓ Font-import aanwezig: Arimo + Montserrat (GEEN Inter)
✓ body background: #FFF8F2 — niet wit, niet grijs
✓ header: background var(--bg) — NIET oranje of gradient
✓ Alle h1/h2/h3: font-family var(--font-h) = Arimo
✓ Module-headers: background var(--gradient-warm) = goud→amber→flame
✓ Geen #FFFFFF als kaart- of sectie-achtergrond
✓ Geen off-brand grijzen (#3d3f45, #5a5c62)
✓ Geen Tailwind-kleuren buiten feedback-states
✓ Footer aanwezig: charcoal achtergrond, gold logo, peach links
✓ Welcome-hero: charcoal achtergrond met ::before blob
✓ Alle schermen aanwezig: welkom, 4+ modules, drag, quiz, resultaat
✓ goTo() gedefinieerd als gewone function (niet arrow function)
✓ updateProgress() aanwezig en aangeroepen vanuit goTo()
✓ laadQuizVraag() aangeroepen bij DOMContentLoaded
✓ Geen placeholder tekst — alles uit de transcriptie
✓ Mobile-responsive @media blok aanwezig`;

// ── Start genereren (geeft direct jobId terug) ──
app.post('/generate', async (req, res) => {
  const { transcription } = req.body;
  if (!transcription || transcription.trim().length < 10) {
    return res.status(400).json({ error: 'Transcriptie is te kort of leeg.' });
  }

  const jobId = Date.now().toString(36) + Math.random().toString(36).slice(2);
  jobs[jobId] = { status: 'generating', progress: 0 };
  res.json({ jobId });

  // Genereer op de achtergrond
  (async () => {
    try {
      const stream = await client.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 16000,
        system: SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: `Genereer een complete interactieve e-learning op basis van de volgende transcriptie:\n\n${transcription}`
        }]
      });

      let fullHtml = '';
      let chars = 0;
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          fullHtml += event.delta.text;
          chars += event.delta.text.length;
          jobs[jobId].progress = Math.min(95, Math.round(chars / 300));
        }
      }

      if (fullHtml.includes('<!DOCTYPE html>')) {
        const titleMatch = fullHtml.match(/<title>([^<]+)<\/title>/i);
        const rawTitle = titleMatch
          ? titleMatch[1].replace(' | Umely E-learning', '').trim()
          : 'elearning';
        const slug = rawTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/gi, '-')
          .replace(/^-|-$/g, '')
          .slice(0, 40);
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const filename = `elearning-${slug}-${date}.html`;

        await supabase.from('modules').insert({ filename, title: rawTitle, html: fullHtml });

        jobs[jobId] = {
          status: 'done',
          slug: filename.replace('.html', ''),
          url: `/modules/${filename.replace('.html', '')}`
        };
      } else {
        jobs[jobId] = { status: 'error', error: 'Gegenereerde output is ongeldig.' };
      }
    } catch (err) {
      console.error(err);
      jobs[jobId] = { status: 'error', error: err.message };
    }
  })();
});

// ── Bestand uploaden en tekst extraheren ──
app.post('/extract-text', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Geen bestand ontvangen.' });
  const { mimetype, originalname, buffer } = req.file;
  try {
    let text = '';
    if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      originalname.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      text = buffer.toString('utf-8');
    }
    text = text.trim();
    if (text.length < 50) return res.status(400).json({ error: 'Bestand bevat te weinig tekst.' });
    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kon tekst niet lezen uit bestand.' });
  }
});

// ── Poll job status ──
app.get('/api/job/:jobId', (req, res) => {
  const job = jobs[req.params.jobId];
  if (!job) return res.status(404).json({ error: 'Job niet gevonden' });
  res.json(job);
});

// ── API: lijst van alle modules ──
app.get('/api/modules', async (req, res) => {
  const { data, error } = await supabase
    .from('modules')
    .select('filename, title, created_at')
    .order('created_at', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(m => ({
    filename: m.filename,
    slug: m.filename.replace('.html', ''),
    title: m.title,
    date: m.created_at.slice(0, 10),
    url: `/modules/${m.filename.replace('.html', '')}`
  })));
});

// ── Serveer een individuele module ──
app.get('/modules/:slug', async (req, res) => {
  const filename = req.params.slug + '.html';
  const { data, error } = await supabase
    .from('modules')
    .select('html')
    .eq('filename', filename)
    .single();
  if (error || !data) return res.status(404).send('<h1>Module niet gevonden</h1>');
  res.setHeader('Content-Type', 'text/html');
  res.send(data.html);
});

// ── Hernoem een module ──
app.patch('/api/modules/:slug', async (req, res) => {
  const filename = req.params.slug + '.html';
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'Titel mag niet leeg zijn.' });
  const { error } = await supabase.from('modules').update({ title: title.trim() }).eq('filename', filename);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ── Verwijder een module ──
app.delete('/api/modules/:slug', async (req, res) => {
  const filename = req.params.slug + '.html';
  const { error } = await supabase.from('modules').delete().eq('filename', filename);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Umely E-learning Generator draait op http://localhost:${PORT}`);
});

---
name: elearning-generator
description: Genereer automatisch een complete interactieve e-learning HTML module vanuit een transcriptie of samenvatting. Gebruik deze skill wanneer de gebruiker een transcriptie, samenvatting of videocontent aanlevert en vraagt om een e-learning, cursus, module of leermateriaal te maken.
version: "2.0"
author: Umely
---

# E-learning Generator Skill

## Wanneer activeer je deze skill?
- Gebruiker geeft een transcriptie, samenvatting of tekst aan
- Gebruiker vraagt om een e-learning, cursus of module te maken
- Trefwoorden: "genereer e-learning", "maak cursus", "zet om naar module"

## Stap 1 — Analyseer het bronmateriaal
Identificeer uit de transcriptie:
- Hoofdonderwerp → wordt de module-titel
- 4-6 kernthema's → worden de modules
- Concrete feiten, tips, voorbeelden → voor quizvragen
- Niveau van de doelgroep → pas taalgebruik aan

## Stap 2 — Ontwerp leerstructuur
```
Scherm 0: Welkomst (leerdoelen + tijdsindicatie)
Scherm 1: Module 1 + kennischeck (multiple choice)
Scherm 2: Module 2 + drag-and-drop oefening
Scherm 3: Module 3 + kennischeck
Scherm 4: Module 4 + kennischeck
Scherm 5: Afsluitquiz (5 vragen)
Scherm 6: Resultaat + certificaat bij ≥70%
```

## Stap 3 — Genereer het HTML-bestand

Gebruik onderstaande template. Vervang ALLE [PLACEHOLDERS] met echte inhoud uit de transcriptie. Laat GEEN placeholder staan.

```html
<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>[MODULE_TITEL] | Umely E-learning</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --orange: #FF5A1F;
    --orange-dark: #E04A10;
    --black: #0F0F0F;
    --white: #FFFFFF;
    --gray-light: #F5F5F5;
    --gray-text: #4A4A4A;
    --gray-border: #E8E8E8;
    --green: #22C55E;
    --red: #EF4444;
    --radius-btn: 50px;
    --radius-card: 12px;
    --shadow: 0 2px 16px rgba(0,0,0,0.07);
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', system-ui, sans-serif; background: var(--white); color: var(--gray-text); line-height: 1.6; }

  /* ── HEADER ── */
  header {
    position: sticky; top: 0; z-index: 100;
    background: var(--white); border-bottom: 1px solid var(--gray-border);
    padding: 0 32px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .logo { display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 800; color: var(--black); text-decoration: none; }
  .logo-icon { font-size: 22px; }
  .header-tag { font-size: 12px; color: var(--gray-text); font-weight: 500; opacity: 0.7; }

  /* ── VOORTGANGSBALK ── */
  .progress-track { height: 4px; background: var(--gray-border); }
  .progress-fill { height: 4px; background: var(--orange); width: 0%; transition: width 0.5s cubic-bezier(.4,0,.2,1); }

  /* ── LAYOUT ── */
  .page { max-width: 760px; margin: 0 auto; padding: 48px 20px; }
  .screen { display: none; }
  .screen.active { display: block; }

  /* ── KAARTEN ── */
  .card { background: var(--white); border: 1px solid var(--gray-border); border-radius: var(--radius-card); padding: 36px; box-shadow: var(--shadow); margin-bottom: 24px; }
  .card-gray { background: var(--gray-light); border: none; }

  /* ── TYPOGRAFIE ── */
  h1 { font-size: 32px; font-weight: 800; color: var(--black); line-height: 1.2; margin-bottom: 16px; }
  h2 { font-size: 22px; font-weight: 700; color: var(--black); margin-bottom: 14px; }
  h3 { font-size: 16px; font-weight: 600; color: var(--black); margin-bottom: 10px; }
  p { font-size: 15px; line-height: 1.75; color: var(--gray-text); margin-bottom: 14px; }
  p:last-child { margin-bottom: 0; }

  /* ── BADGE ── */
  .badge {
    display: inline-block; padding: 4px 14px;
    background: #FFF0EB; color: var(--orange);
    border-radius: 50px; font-size: 12px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px;
    margin-bottom: 16px;
  }

  /* ── LEERDOELEN ── */
  .goals { list-style: none; margin: 20px 0; display: flex; flex-direction: column; gap: 10px; }
  .goals li { display: flex; align-items: flex-start; gap: 12px; font-size: 15px; }
  .goals li::before { content: "✓"; background: var(--orange); color: white; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 1px; }

  /* ── KNOPPEN ── */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 28px; background: var(--orange); color: white;
    border: none; border-radius: var(--radius-btn);
    font-size: 15px; font-weight: 700; cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    text-decoration: none;
  }
  .btn:hover { background: var(--orange-dark); transform: translateY(-1px); }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; pointer-events: none; }
  .btn:active { transform: translateY(0); }
  .btn-ghost { background: transparent; color: var(--orange); border: 2px solid var(--orange); }
  .btn-ghost:hover { background: #FFF0EB; }
  .btn-row { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 28px; }

  /* ── INFOBLOK ── */
  .info-block { background: #FFF0EB; border-left: 4px solid var(--orange); border-radius: 0 8px 8px 0; padding: 14px 18px; margin: 20px 0; }
  .info-block p { color: var(--black); font-size: 14px; margin: 0; }

  /* ── QUIZ ── */
  .quiz-q { font-size: 16px; font-weight: 600; color: var(--black); margin-bottom: 14px; }
  .options { display: flex; flex-direction: column; gap: 10px; }
  .option {
    padding: 13px 18px; border: 2px solid var(--gray-border); border-radius: 10px;
    cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.15s;
    background: var(--white);
  }
  .option:hover { border-color: var(--orange); background: #FFF0EB; color: var(--black); }
  .option.correct { border-color: var(--green); background: #F0FDF4; color: #15803D; pointer-events: none; }
  .option.wrong { border-color: var(--red); background: #FEF2F2; color: #991B1B; pointer-events: none; }
  .option.disabled { pointer-events: none; opacity: 0.6; }
  .feedback-box { margin-top: 12px; padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; display: none; }
  .feedback-box.show { display: block; }
  .feedback-box.correct { background: #F0FDF4; color: #15803D; border: 1px solid #BBF7D0; }
  .feedback-box.wrong { background: #FEF2F2; color: #991B1B; border: 1px solid #FCA5A5; }

  /* ── DRAG & DROP ── */
  .dnd-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
  @media(max-width:560px){ .dnd-wrap { grid-template-columns: 1fr; } }
  .dnd-pool { display: flex; flex-direction: column; gap: 8px; }
  .dnd-pool-label, .dnd-col-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-text); margin-bottom: 4px; }
  .drag-chip {
    padding: 10px 16px; background: white; border: 2px solid var(--orange);
    border-radius: 8px; cursor: grab; font-size: 13px; font-weight: 600;
    color: var(--orange); transition: opacity 0.2s, transform 0.15s;
    user-select: none;
  }
  .drag-chip:active { cursor: grabbing; transform: scale(0.97); }
  .drag-chip.used { opacity: 0.35; cursor: not-allowed; }
  .dnd-cols { display: flex; flex-direction: column; gap: 16px; }
  .dnd-col { }
  .drop-area {
    min-height: 48px; border: 2px dashed var(--gray-border); border-radius: 8px;
    padding: 8px; display: flex; flex-direction: column; gap: 6px;
    transition: border-color 0.15s, background 0.15s;
  }
  .drop-area.over { border-color: var(--orange); background: #FFF7F4; }
  .drop-area .drag-chip { color: #15803D; border-color: var(--green); background: #F0FDF4; cursor: default; }
  .dnd-check-btn { margin-top: 12px; }

  /* ── AFSLUITQUIZ ── */
  .fq-item { background: var(--gray-light); border-radius: 10px; padding: 20px; margin-bottom: 16px; }
  .fq-item .options { margin-top: 12px; }

  /* ── SCORE ── */
  .score-ring { text-align: center; margin: 24px 0; }
  .score-number { font-size: 72px; font-weight: 800; color: var(--orange); line-height: 1; }
  .score-label { font-size: 14px; color: var(--gray-text); margin-top: 4px; }

  /* ── CERTIFICAAT ── */
  .cert {
    border: 3px solid var(--orange); border-radius: 16px; padding: 40px;
    text-align: center; background: linear-gradient(135deg, #FFF7F4 0%, white 100%);
    margin-top: 24px;
  }
  .cert-icon { font-size: 56px; margin-bottom: 12px; }
  .cert h2 { color: var(--orange); font-size: 26px; }
  .cert p { color: var(--gray-text); margin: 8px 0 0; }

  /* ── TIJDSINDICATIE ── */
  .meta { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 16px; }
  .meta-item { font-size: 13px; color: var(--gray-text); display: flex; align-items: center; gap: 6px; }

  /* ── FOOTER ── */
  footer { border-top: 1px solid var(--gray-border); padding: 24px 32px; text-align: center; }
  footer p { font-size: 13px; color: var(--gray-text); margin: 0; }
  footer a { color: var(--orange); text-decoration: none; font-weight: 600; }

  @media(max-width:600px){ .card { padding: 24px 18px; } h1 { font-size: 24px; } }
</style>
</head>
<body>

<header>
  <a class="logo" href="https://umely.ai">
    <span class="logo-icon">🧠</span>Umely
  </a>
  <span class="header-tag">[MODULE_TITEL]</span>
</header>
<div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>

<div class="page">

  <!-- ══ SCHERM 0: WELKOM ══ -->
  <div class="screen active" id="s0">
    <div class="card">
      <div class="badge">Umely E-learning</div>
      <h1>[MODULE_TITEL]</h1>
      <p>[MODULE_INTRO — 2-3 zinnen die uitleggen wat de leerling gaat leren en waarom dit relevant is.]</p>
      <h3 style="margin-top:24px">Na deze module kun je:</h3>
      <ul class="goals">
        <li>[LEERDOEL_1]</li>
        <li>[LEERDOEL_2]</li>
        <li>[LEERDOEL_3]</li>
        <li>[LEERDOEL_4]</li>
      </ul>
      <div class="meta">
        <span class="meta-item">⏱ [X] minuten</span>
        <span class="meta-item">📚 4 modules</span>
        <span class="meta-item">🎯 Quiz & certificaat</span>
      </div>
      <div class="btn-row">
        <button class="btn" onclick="goTo(1)">Start de module →</button>
      </div>
    </div>
  </div>

  <!-- ══ SCHERM 1: MODULE 1 ══ -->
  <div class="screen" id="s1">
    <div class="card">
      <div class="badge">Module 1 van 4</div>
      <h2>[MODULE_1_TITEL]</h2>
      <p>[MODULE_1_ALINEA_1]</p>
      <p>[MODULE_1_ALINEA_2]</p>
      <div class="info-block">
        <p>💡 <strong>Onthoud:</strong> [MODULE_1_KERNBOODSCHAP]</p>
      </div>
      <div style="margin-top:28px">
        <p class="quiz-q">✏️ [QUIZ_1_VRAAG]</p>
        <div class="options" id="opts1">
          <div class="option" onclick="pick(this,'opts1','wrong','[UITLEG_WRONG_A1]')">[OPTIE_A]</div>
          <div class="option" onclick="pick(this,'opts1','correct','[UITLEG_CORRECT_1]')">[OPTIE_B_CORRECT]</div>
          <div class="option" onclick="pick(this,'opts1','wrong','[UITLEG_WRONG_C1]')">[OPTIE_C]</div>
          <div class="option" onclick="pick(this,'opts1','wrong','[UITLEG_WRONG_D1]')">[OPTIE_D]</div>
        </div>
        <div class="feedback-box" id="fb1"></div>
      </div>
      <div class="btn-row"><button class="btn" id="nextBtn1" disabled onclick="goTo(2)">Volgende →</button></div>
    </div>
  </div>

  <!-- ══ SCHERM 2: MODULE 2 + DRAG & DROP ══ -->
  <div class="screen" id="s2">
    <div class="card">
      <div class="badge">Module 2 van 4</div>
      <h2>[MODULE_2_TITEL]</h2>
      <p>[MODULE_2_ALINEA_1]</p>
      <p>[MODULE_2_ALINEA_2]</p>

      <h3 style="margin-top:28px">🖱️ Oefening: Sleep naar de juiste categorie</h3>
      <p style="font-size:13px;color:var(--gray-text);margin-bottom:16px">Sleep elk item naar de bijbehorende kolom.</p>

      <div class="dnd-wrap">
        <div>
          <div class="dnd-pool-label">Te sorteren items</div>
          <div class="dnd-pool" id="pool">
            <div class="drag-chip" draggable="true" data-cat="[CAT_A]" ondragstart="ds(event)">[DND_ITEM_1]</div>
            <div class="drag-chip" draggable="true" data-cat="[CAT_B]" ondragstart="ds(event)">[DND_ITEM_2]</div>
            <div class="drag-chip" draggable="true" data-cat="[CAT_A]" ondragstart="ds(event)">[DND_ITEM_3]</div>
            <div class="drag-chip" draggable="true" data-cat="[CAT_B]" ondragstart="ds(event)">[DND_ITEM_4]</div>
            <div class="drag-chip" draggable="true" data-cat="[CAT_A]" ondragstart="ds(event)">[DND_ITEM_5]</div>
            <div class="drag-chip" draggable="true" data-cat="[CAT_B]" ondragstart="ds(event)">[DND_ITEM_6]</div>
          </div>
        </div>
        <div class="dnd-cols">
          <div class="dnd-col">
            <div class="dnd-col-label">[CAT_A_LABEL]</div>
            <div class="drop-area" data-cat="[CAT_A]" ondragover="dov(event)" ondrop="dp(event)" ondragleave="dl(event)"></div>
          </div>
          <div class="dnd-col">
            <div class="dnd-col-label">[CAT_B_LABEL]</div>
            <div class="drop-area" data-cat="[CAT_B]" ondragover="dov(event)" ondrop="dp(event)" ondragleave="dl(event)"></div>
          </div>
        </div>
      </div>
      <button class="btn dnd-check-btn" onclick="checkDnd()">Controleer antwoorden</button>
      <div class="feedback-box" id="fbDnd"></div>

      <div class="btn-row" style="margin-top:20px"><button class="btn" onclick="goTo(3)">Volgende →</button></div>
    </div>
  </div>

  <!-- ══ SCHERM 3: MODULE 3 ══ -->
  <div class="screen" id="s3">
    <div class="card">
      <div class="badge">Module 3 van 4</div>
      <h2>[MODULE_3_TITEL]</h2>
      <p>[MODULE_3_ALINEA_1]</p>
      <p>[MODULE_3_ALINEA_2]</p>
      <div class="info-block">
        <p>💡 <strong>Tip:</strong> [MODULE_3_TIP]</p>
      </div>
      <div style="margin-top:28px">
        <p class="quiz-q">✏️ [QUIZ_3_VRAAG]</p>
        <div class="options" id="opts3">
          <div class="option" onclick="pick(this,'opts3','correct','[UITLEG_CORRECT_3]')">[OPTIE_3_A_CORRECT]</div>
          <div class="option" onclick="pick(this,'opts3','wrong','[UITLEG_WRONG_3B]')">[OPTIE_3_B]</div>
          <div class="option" onclick="pick(this,'opts3','wrong','[UITLEG_WRONG_3C]')">[OPTIE_3_C]</div>
        </div>
        <div class="feedback-box" id="fb3"></div>
      </div>
      <div class="btn-row"><button class="btn" id="nextBtn3" disabled onclick="goTo(4)">Volgende →</button></div>
    </div>
  </div>

  <!-- ══ SCHERM 4: MODULE 4 ══ -->
  <div class="screen" id="s4">
    <div class="card">
      <div class="badge">Module 4 van 4</div>
      <h2>[MODULE_4_TITEL]</h2>
      <p>[MODULE_4_ALINEA_1]</p>
      <p>[MODULE_4_ALINEA_2]</p>
      <div class="card card-gray" style="margin-top:20px">
        <h3>📋 Samenvatting van deze module</h3>
        <ul style="padding-left:20px;margin-top:8px">
          <li style="margin-bottom:6px;font-size:14px">[SAMENVATTING_PUNT_1]</li>
          <li style="margin-bottom:6px;font-size:14px">[SAMENVATTING_PUNT_2]</li>
          <li style="font-size:14px">[SAMENVATTING_PUNT_3]</li>
        </ul>
      </div>
      <div style="margin-top:28px">
        <p class="quiz-q">✏️ [QUIZ_4_VRAAG]</p>
        <div class="options" id="opts4">
          <div class="option" onclick="pick(this,'opts4','wrong','[UITLEG_WRONG_4A]')">[OPTIE_4_A]</div>
          <div class="option" onclick="pick(this,'opts4','wrong','[UITLEG_WRONG_4B]')">[OPTIE_4_B]</div>
          <div class="option" onclick="pick(this,'opts4','correct','[UITLEG_CORRECT_4]')">[OPTIE_4_C_CORRECT]</div>
        </div>
        <div class="feedback-box" id="fb4"></div>
      </div>
      <div class="btn-row"><button class="btn" id="nextBtn4" disabled onclick="goTo(5)">Naar de afsluitquiz →</button></div>
    </div>
  </div>

  <!-- ══ SCHERM 5: AFSLUITQUIZ ══ -->
  <div class="screen" id="s5">
    <div class="card">
      <div class="badge">Afsluitquiz</div>
      <h2>🏁 Test je kennis</h2>
      <p>Beantwoord alle vragen. Je hebt minimaal <strong>70%</strong> nodig om je certificaat te ontvangen.</p>
      <div id="fqContainer" style="margin-top:24px"></div>
      <div class="btn-row">
        <button class="btn" onclick="submitFQ()">Verstuur antwoorden</button>
      </div>
    </div>
  </div>

  <!-- ══ SCHERM 6: RESULTAAT ══ -->
  <div class="screen" id="s6">
    <div class="card" style="text-align:center">
      <div class="badge">Resultaat</div>
      <div class="score-ring">
        <div class="score-number" id="scoreNum">–</div>
        <div class="score-label">van de vragen goed</div>
      </div>
      <div id="resultMsg"></div>
      <div class="cert" id="certBlock" style="display:none">
        <div class="cert-icon">🏆</div>
        <h2>Certificaat behaald!</h2>
        <p style="font-size:16px;margin-top:8px"><strong>[MODULE_TITEL]</strong></p>
        <p>Je hebt deze Umely module succesvol afgerond.</p>
        <p style="margin-top:12px;font-size:13px;color:var(--gray-text)">— Umely — umely.ai —</p>
      </div>
      <div class="btn-row" style="justify-content:center;margin-top:28px">
        <button class="btn btn-ghost" onclick="location.reload()">Opnieuw proberen</button>
      </div>
    </div>
  </div>

</div><!-- /page -->

<footer>
  <p>🧠 <strong>Umely</strong> — Jouw vaste AI-partner | <a href="https://umely.ai" target="_blank">umely.ai</a></p>
</footer>

<script>
// ── STATE ──
const TOTAL = 7;
let cur = 0;
const fqAnswers = {};

// ── NAVIGATIE ──
function goTo(n) {
  document.getElementById('s' + cur).classList.remove('active');
  cur = n;
  document.getElementById('s' + n).classList.add('active');
  document.getElementById('progressFill').style.width = (n / (TOTAL - 1) * 100) + '%';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (n === 5) buildFQ();
}

// ── MODULE QUIZ ──
function pick(el, groupId, result, explanation) {
  const opts = document.getElementById(groupId).querySelectorAll('.option');
  opts.forEach(o => o.classList.add('disabled'));
  el.classList.add(result);
  const num = groupId.replace('opts', '');
  const fb = document.getElementById('fb' + num);
  fb.textContent = (result === 'correct' ? '✅ Correct! ' : '❌ Helaas. ') + explanation;
  fb.className = 'feedback-box show ' + result;
  const btn = document.getElementById('nextBtn' + num);
  if (btn) btn.disabled = false;
}

// ── DRAG & DROP ──
let dragged = null;
function ds(e) { dragged = e.currentTarget; e.dataTransfer.effectAllowed = 'move'; }
function dov(e) { e.preventDefault(); e.currentTarget.classList.add('over'); }
function dl(e) { e.currentTarget.classList.remove('over'); }
function dp(e) {
  e.preventDefault();
  const zone = e.currentTarget;
  zone.classList.remove('over');
  if (!dragged) return;
  const chip = dragged.cloneNode(true);
  chip.removeAttribute('draggable');
  chip.removeAttribute('ondragstart');
  chip.style.cursor = 'default';
  zone.appendChild(chip);
  dragged.classList.add('used');
  dragged.setAttribute('draggable', false);
  dragged = null;
}
function checkDnd() {
  const zones = document.querySelectorAll('.drop-area');
  let correct = 0, total = 0;
  zones.forEach(zone => {
    const expected = zone.dataset.cat;
    zone.querySelectorAll('.drag-chip').forEach(chip => {
      total++;
      if (chip.dataset.cat === expected) correct++;
    });
  });
  const fb = document.getElementById('fbDnd');
  if (total === 0) { fb.textContent = 'Sleep eerst items naar de kolommen!'; fb.className = 'feedback-box show wrong'; return; }
  fb.textContent = correct === total
    ? `✅ Uitstekend! Alle ${total} items staan op de juiste plek.`
    : `${correct} van de ${total} items correct. Probeer de rest nog eens.`;
  fb.className = 'feedback-box show ' + (correct === total ? 'correct' : 'wrong');
}

// ── AFSLUITQUIZ ──
const FQ = [
  { q: "[FQ1_VRAAG]", opts: ["[FQ1_A]", "[FQ1_B]", "[FQ1_C]", "[FQ1_D]"], correct: 1 },
  { q: "[FQ2_VRAAG]", opts: ["[FQ2_A]", "[FQ2_B]", "[FQ2_C]"], correct: 0 },
  { q: "[FQ3_VRAAG]", opts: ["[FQ3_A]", "[FQ3_B]", "[FQ3_C]", "[FQ3_D]"], correct: 2 },
  { q: "[FQ4_VRAAG]", opts: ["[FQ4_A]", "[FQ4_B]", "[FQ4_C]"], correct: 1 },
  { q: "[FQ5_VRAAG]", opts: ["[FQ5_A]", "[FQ5_B]", "[FQ5_C]", "[FQ5_D]"], correct: 3 },
];
function buildFQ() {
  document.getElementById('fqContainer').innerHTML = FQ.map((q, i) => `
    <div class="fq-item">
      <div class="quiz-q">${i+1}. ${q.q}</div>
      <div class="options">
        ${q.opts.map((o, j) => `
          <div class="option" onclick="selFQ(${i},${j},this)">${o}</div>
        `).join('')}
      </div>
    </div>
  `).join('');
}
function selFQ(qi, ai, el) {
  const item = el.closest('.fq-item');
  item.querySelectorAll('.option').forEach(o => { o.style.background=''; o.style.borderColor=''; });
  el.style.background = '#FFF0EB';
  el.style.borderColor = 'var(--orange)';
  fqAnswers[qi] = ai;
}
function submitFQ() {
  let score = 0;
  FQ.forEach((q, i) => { if (fqAnswers[i] === q.correct) score++; });
  const pct = Math.round(score / FQ.length * 100);
  goTo(6);
  document.getElementById('scoreNum').textContent = pct + '%';
  const msg = document.getElementById('resultMsg');
  if (pct >= 70) {
    msg.innerHTML = '<p style="color:#15803D;font-weight:600;font-size:16px;margin-top:8px">🎉 Gefeliciteerd! Je hebt het certificaat behaald.</p>';
    document.getElementById('certBlock').style.display = 'block';
  } else {
    msg.innerHTML = `<p style="color:#991B1B;font-weight:600;font-size:16px;margin-top:8px">Je scoorde ${pct}%. Je hebt minimaal 70% nodig. Probeer het opnieuw!</p>`;
  }
}
</script>
</body>
</html>
```

## Stap 4 — Sla op en kwaliteitscheck

Sla op als `output/elearning-[onderwerp]-[YYYYMMDD].html`

Controleer vóór opslaan:
- [ ] GEEN [PLACEHOLDERS] meer zichtbaar — alles vervangen door echte inhoud
- [ ] Quiz-antwoorden zijn inhoudelijk correct
- [ ] DnD items hebben logische categorieën die uit de transcriptie komen
- [ ] Leerdoelen sluiten aan bij de module-inhoud
- [ ] Oranje kleur (#FF5A1F) is de primaire kleur — GEEN blauw
- [ ] Umely logo + branding correct in header en footer
- [ ] Bestand opent foutloos in browser

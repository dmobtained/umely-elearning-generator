// fix-nav-buttons.js
// Verwijdert inline navigatieknoppen (Volgende/Verder/Naar kennischeck) uit contentschermen.
// Houdt: "Start de module" (welkomscherm), "Naar de afsluitquiz" (laatste scherm).

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, 'module-content');
const files = fs.readdirSync(CONTENT_DIR).filter(f => f.match(/^elearning-.*\.html$/));

// Labels die mogen verwijderd worden (case-insensitive)
const REMOVE_LABELS = [
  'Volgende',
  'Verder',
  'Naar kennischeck',
  'Naar de kennischeck',
];

// Label dat BEWAARD blijft (ook al gaat het naar een volgend scherm)
const KEEP_LABELS = [
  'Start de module',
  'Naar de afsluitquiz',
];

let totalRemoved = 0;

for (const file of files) {
  const filePath = path.join(CONTENT_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Patroon 1: <div class="btn-wrap">...<button ...goTo(...)>LABEL</button>...</div>
  // Patroon 2: los <button ...goTo(...)>LABEL</button> (zonder btn-wrap wrapper)
  // We matchen op regel-niveau zodat we de hele btn-wrap div weggooien

  const lines = content.split('\n');
  const kept = [];
  let i = 0;
  let removed = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Controleer of deze regel een goTo()-knop bevat
    const hasGoTo = line.includes('goTo(') && line.includes('<button');
    if (!hasGoTo) {
      kept.push(line);
      i++;
      continue;
    }

    // Bepaal het label van de knop
    const labelMatch = line.match(/>([^<]+)<\/button>/);
    const label = labelMatch ? labelMatch[1].trim() : '';

    // Bewaar knoppen met toegestaan label
    if (KEEP_LABELS.some(k => label === k)) {
      kept.push(line);
      i++;
      continue;
    }

    // Verwijder knoppen met te-verwijderen label (of onbekend label dat toch goTo gebruikt)
    if (REMOVE_LABELS.some(r => label === r) || label === '') {
      // Kijk of de regel ook de hele btn-wrap div bevat (alles op 1 regel)
      if (line.includes('<div class="btn-wrap">') && line.includes('</div>')) {
        // Alles op 1 regel — skip
        removed++;
        i++;
        continue;
      }
      // Kijk of de knop zelf op 1 regel staat (geen btn-wrap wrapper op deze regel)
      if (!line.includes('<div class="btn-wrap">')) {
        // Standalone knop op 1 regel — skip
        removed++;
        i++;
        continue;
      }
      // btn-wrap opent op deze regel maar sluit niet — verwijder meerdere regels
      let j = i + 1;
      while (j < lines.length && !lines[j].includes('</div>')) j++;
      // j is de sluitende </div>
      removed++;
      i = j + 1; // sla alles t/m sluitende </div> over
      continue;
    }

    // Onbekend label maar heeft goTo() — bewaar (geen risico)
    kept.push(line);
    i++;
  }

  const newContent = kept.join('\n');
  if (newContent !== original) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`${file}: ${removed} knop(pen) verwijderd`);
    totalRemoved += removed;
  } else {
    console.log(`${file}: geen wijzigingen`);
  }
}

console.log(`\nKlaar — ${totalRemoved} knoppen totaal verwijderd.`);

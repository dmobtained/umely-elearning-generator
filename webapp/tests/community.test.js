const { computeLevel } = require('../community-routes');

// 10 modules: a1, a2, b1, b2 (A+B = 4), c1, c2, c3, d1, d2, d3 (overige = 6)
const MODULES = [
  { slug: 'elearning-a1-wat-is-claude' },
  { slug: 'elearning-a2-ecosysteem' },
  { slug: 'elearning-b1-prompts' },
  { slug: 'elearning-b2-context' },
  { slug: 'elearning-c1-webapp' },
  { slug: 'elearning-c2-projects' },
  { slug: 'elearning-c3-chrome' },
  { slug: 'elearning-d1-mcp' },
  { slug: 'elearning-d2-connectors' },
  { slug: 'elearning-d3-agents' },
];

function done(slug, score = 80) {
  return { module_slug: slug, score_pct: score, completed: score >= 70 };
}

describe('computeLevel', () => {
  test('level 0: geen voortgang', () => {
    expect(computeLevel(MODULES, [])).toBe(0);
  });

  test('level 0: A+B gedeeltelijk af', () => {
    const progress = [done('elearning-a1-wat-is-claude'), done('elearning-b1-prompts')];
    expect(computeLevel(MODULES, progress)).toBe(0);
  });

  test('level 1: alle A+B modules af (score >= 70)', () => {
    const progress = [
      done('elearning-a1-wat-is-claude'),
      done('elearning-a2-ecosysteem'),
      done('elearning-b1-prompts'),
      done('elearning-b2-context'),
    ];
    expect(computeLevel(MODULES, progress)).toBe(1);
  });

  test('level 1: A+B af maar score precies 70', () => {
    const progress = [
      done('elearning-a1-wat-is-claude', 70),
      done('elearning-a2-ecosysteem', 70),
      done('elearning-b1-prompts', 70),
      done('elearning-b2-context', 70),
    ];
    expect(computeLevel(MODULES, progress)).toBe(1);
  });

  test('level 1: A+B af maar score 69 telt niet mee', () => {
    const progress = [
      done('elearning-a1-wat-is-claude', 69),
      done('elearning-a2-ecosysteem', 80),
      done('elearning-b1-prompts', 80),
      done('elearning-b2-context', 80),
    ];
    // a1 heeft score 69 en completed=false -> niet geteld voor level 1
    expect(computeLevel(MODULES, progress)).toBe(0);
  });

  test('level 2: meer dan helft af', () => {
    const progress = [
      done('elearning-a1-wat-is-claude'),
      done('elearning-a2-ecosysteem'),
      done('elearning-b1-prompts'),
      done('elearning-b2-context'),
      done('elearning-c1-webapp'),
      done('elearning-c2-projects'),
    ];
    // 6 van 10 > 5 -> level 2
    expect(computeLevel(MODULES, progress)).toBe(2);
  });

  test('level 3: alle modules af met score >= 70', () => {
    const progress = MODULES.map(m => done(m.slug, 80));
    expect(computeLevel(MODULES, progress)).toBe(3);
  });

  test('level 4: alle modules met score 100', () => {
    const progress = MODULES.map(m => done(m.slug, 100));
    expect(computeLevel(MODULES, progress)).toBe(4);
  });

  test('level 3 niet level 4: één module niet 100', () => {
    const progress = MODULES.map((m, i) => done(m.slug, i === 0 ? 80 : 100));
    expect(computeLevel(MODULES, progress)).toBe(3);
  });

  test('level 0: lege modulelijst geeft 0', () => {
    expect(computeLevel([], [])).toBe(0);
  });
});

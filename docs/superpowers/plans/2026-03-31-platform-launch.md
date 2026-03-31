# Umely Platform Launch - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Umely e-learning platform ready for paying customers (95 euro/month) within 3 days.

**Architecture:** Standalone HTML modules built via `build-modules.js` from `module-content/` templates. Webapp served by Express (`server.js`) with Supabase auth/storage. Stripe Checkout for payments. All 25 modules need UI fixes, navigation improvements, and content quality review.

**Tech Stack:** Node.js, Express, Supabase, Stripe, vanilla HTML/CSS/JS

---

## File Structure

**Modified files:**
- `module-content/_shared-css.html` - Module header styling, navigation buttons
- `module-content/_shared-js.html` - Previous button logic, next-module logic
- `build-modules.js` - Dynamic date, next-module links, header updates
- `webapp/public/modules.html` - Category grouping UI
- `webapp/public/account.html` - Admin/user features
- `webapp/server.js` - Stripe endpoints, subscription middleware
- `webapp/prompt.md` - Template updates matching new shared CSS/JS
- All 25 `module-content/elearning-*.html` - Content fixes per module

**New files:**
- `webapp/public/pricing.html` - Stripe checkout page (optional, can be modal)

---

### Task 1: Module header - orange gradient to charcoal

**Files:**
- Modify: `module-content/_shared-css.html:35-37`
- Modify: `build-modules.js:55-63`

- [ ] **Step 1: Update module header CSS**

In `module-content/_shared-css.html`, change line 35:

```css
/* OLD */
.module-header{background:var(--gradient-warm);border-radius:var(--radius);padding:1.25rem 1.5rem;margin-bottom:1.5rem}
.module-header .module-num{font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--fg);margin-bottom:0.25rem}
.module-header h2{font-family:var(--font-h);font-size:1.5rem;color:var(--fg);margin:0}

/* NEW */
.module-header{background:var(--fg);border-radius:var(--radius);padding:1.25rem 1.5rem;margin-bottom:1.5rem}
.module-header .module-num{font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--gold);margin-bottom:0.25rem}
.module-header h2{font-family:var(--font-h);font-size:1.5rem;color:#FFF8F2;margin:0}
```

- [ ] **Step 2: Update sticky header in build-modules.js**

In `build-modules.js`, replace lines 55-63 (the header HTML) with:

```html
<header>
  <div class="header-inner">
    <div style="display:flex;align-items:center;gap:0.75rem;">
      <a href="/modules.html" style="color:rgba(255,248,242,0.7);font-size:0.85rem;text-decoration:none;font-weight:600;">&#8592; Overzicht</a>
      <img src="/logo-small.png" alt="Umely" style="height:28px;">
    </div>
    <span class="header-title" id="header-module-title"></span>
    <span style="width:100px;"></span>
  </div>
  <div style="max-width:860px;margin:0.75rem auto 0;background:var(--peach);border-radius:50px;height:6px;overflow:hidden;">
    <div id="progressBar" style="height:100%;background:var(--gradient);border-radius:50px;transition:width 0.4s ease;width:0%;"></div>
  </div>
  <div id="progressLabel" style="text-align:right;font-size:0.75rem;color:var(--amber);font-weight:600;max-width:860px;margin:0.25rem auto 0.5rem;padding-right:0;">0% voltooid</div>
</header>
```

Also update the sticky header CSS in `_shared-css.html` line 11:

```css
/* OLD */
header{position:sticky;top:0;z-index:100;background:var(--bg);border-bottom:1px solid var(--peach);padding:0.75rem 1.5rem 0}

/* NEW */
header{position:sticky;top:0;z-index:100;background:var(--fg);border-bottom:none;padding:0.75rem 1.5rem 0}
```

And update header-related text colors:

```css
/* OLD */
.logo{font-family:var(--font-h);font-weight:700;font-size:1.25rem;color:var(--fg);text-decoration:none}
.header-title{font-family:var(--font-h);font-size:0.85rem;font-weight:700;color:var(--fg);opacity:0.7;text-align:center}
.header-back{font-size:0.8rem;color:var(--fg);text-decoration:none;font-weight:600;opacity:0.6}

/* NEW */
.logo{font-family:var(--font-h);font-weight:700;font-size:1.25rem;color:#FFF8F2;text-decoration:none}
.header-title{font-family:var(--font-h);font-size:0.85rem;font-weight:700;color:#FFF8F2;opacity:0.7;text-align:center}
.header-back{font-size:0.8rem;color:#FFF8F2;text-decoration:none;font-weight:600;opacity:0.6}
```

Update progress label and bar colors for dark header:

```css
/* In build-modules.js header HTML, update progressLabel */
/* Change color:var(--amber) to color:rgba(255,248,242,0.6) for label on dark bg */
/* Change background:var(--peach) to background:rgba(255,248,242,0.15) for bar track */
```

- [ ] **Step 3: Build and verify**

```bash
node build-modules.js
```

Open `output/elearning-a3-prompts-20260331.html` in browser. Verify:
- Header is dark charcoal (#27292D)
- Module headers inside content are dark charcoal with gold label text and white title
- Logo is small and correct size
- "Overzicht" link is visible
- Progress bar visible on dark background

- [ ] **Step 4: Commit**

```bash
git add module-content/_shared-css.html build-modules.js
git commit -m "feat: module header and sticky header to charcoal dark theme"
```

---

### Task 2: Previous/Next navigation buttons

**Files:**
- Modify: `module-content/_shared-js.html`
- Modify: `module-content/_shared-css.html`
- Modify: `build-modules.js`

- [ ] **Step 1: Add navigation button CSS to _shared-css.html**

Append before the `@media` query (before line 154):

```css
.nav-buttons{display:flex;justify-content:space-between;align-items:center;gap:0.75rem;margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--peach)}
.btn-vorige{display:inline-block;background:transparent;border:2px solid var(--fg);color:var(--fg);font-family:var(--font-b);font-weight:700;font-size:0.95rem;padding:0.8rem 2rem;border-radius:var(--radius-pill);cursor:pointer;text-decoration:none;transition:all 0.2s}
.btn-vorige:hover{background:var(--fg);color:var(--bg)}
.nav-spacer{flex:1}
```

- [ ] **Step 2: Add getPreviousScreen and getNextScreen to _shared-js.html**

Add after the `updateProgress` function (after line 16):

```javascript
function getPreviousScreen(currentId) {
  const idx = SCHERMEN.indexOf(currentId);
  return idx > 0 ? SCHERMEN[idx - 1] : null;
}

function getNextScreen(currentId) {
  const idx = SCHERMEN.indexOf(currentId);
  return idx < SCHERMEN.length - 1 ? SCHERMEN[idx + 1] : null;
}

function renderNavButtons(screenId) {
  const navEl = document.getElementById('nav-' + screenId);
  if (!navEl) return;
  const prev = getPreviousScreen(screenId);
  const next = getNextScreen(screenId);
  let html = '';
  if (prev) {
    html += '<button class="btn-vorige" onclick="goTo(\'' + prev + '\')">&#8592; Vorige</button>';
  } else {
    html += '<span class="nav-spacer"></span>';
  }
  if (next) {
    html += '<button class="btn" onclick="goTo(\'' + next + '\')">Volgende &#8594;</button>';
  }
  navEl.innerHTML = html;
}
```

- [ ] **Step 3: Update goTo() to render nav buttons**

In `_shared-js.html`, update the `goTo` function to call `renderNavButtons`:

```javascript
function goTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
  const target = document.getElementById(screenId);
  if (target) { target.style.display = 'block'; window.scrollTo(0, 0); }
  updateProgress(screenId);
  const titleEl = document.getElementById('header-module-title');
  if (titleEl && MODULE_TITELS[screenId] !== undefined) {
    titleEl.textContent = MODULE_TITELS[screenId];
  }
  renderNavButtons(screenId);
}
```

- [ ] **Step 4: Add nav-button containers to build-modules.js**

In `build-modules.js`, after the content injection (line 64), add a script that injects `<div class="nav-buttons" id="nav-{screenId}"></div>` into each screen. Update the DOMContentLoaded handler:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // Inject nav-buttons into each screen
  SCHERMEN.forEach(id => {
    const screen = document.getElementById(id);
    if (screen && id !== 'screen-welcome' && id !== 'screen-quiz' && id !== 'screen-result') {
      const nav = document.createElement('div');
      nav.className = 'nav-buttons';
      nav.id = 'nav-' + id;
      screen.appendChild(nav);
    }
  });
  goTo('screen-welcome');
  laadQuizVraag();
});
```

- [ ] **Step 5: Build and verify**

```bash
node build-modules.js
```

Open a module in browser. Verify:
- Welcome screen: only "Start" button (no nav buttons)
- Module screens: "Vorige" (outline) left + "Volgende" (gradient) right
- First module: "Vorige" goes back to welcome
- Quiz/Result: no nav buttons injected (handled separately)
- Navigation works correctly through all screens

- [ ] **Step 6: Commit**

```bash
git add module-content/_shared-css.html module-content/_shared-js.html build-modules.js
git commit -m "feat: add previous/next navigation buttons to all module screens"
```

---

### Task 3: "Next module" button on result screen

**Files:**
- Modify: `build-modules.js:81-93`

- [ ] **Step 1: Define module order in build-modules.js**

Add after line 17 (after sharedJS const):

```javascript
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
```

- [ ] **Step 2: Generate next-module button in result screen**

Replace the result screen btn-wrap section in `build-modules.js` (lines 91-93):

```javascript
// Determine next module
const currentSlug = file.replace('.html', '');
const currentIdx = MODULE_ORDER.indexOf(currentSlug);
const nextSlug = currentIdx >= 0 && currentIdx < MODULE_ORDER.length - 1
  ? MODULE_ORDER[currentIdx + 1] : null;
const nextModuleBtn = nextSlug
  ? `<a class="btn" href="/modules/${nextSlug}">Volgende module &#8594;</a>`
  : `<a class="btn" href="/modules.html">Terug naar overzicht</a>`;
```

Then in the result screen HTML template, replace the btn-wrap:

```html
  <div class="btn-wrap">
    <button class="btn btn-outline" onclick="herstart()">Opnieuw beginnen</button>
    ${nextModuleBtn}
  </div>
```

- [ ] **Step 3: Fix hardcoded date**

In `build-modules.js` line 109, replace:

```javascript
// OLD
const outputName = file.replace('.html', '-20260329.html');

// NEW
const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const outputName = file.replace('.html', `-${today}.html`);
```

- [ ] **Step 4: Build and verify**

```bash
node build-modules.js
```

Open `output/elearning-a3-prompts-20260331.html` result screen. Verify:
- "Opnieuw beginnen" button (outline) is present
- "Volgende module" button (gradient) links to `/modules/elearning-b1-veiligheid`
- Open last module (I2): button says "Terug naar overzicht" and links to `/modules.html`
- Date in filename is today's date (20260331)

- [ ] **Step 5: Commit**

```bash
git add build-modules.js
git commit -m "feat: add next-module button on result screen + dynamic date"
```

---

### Task 4: Category grouping on modules.html

**Files:**
- Modify: `webapp/public/modules.html`

- [ ] **Step 1: Define category structure**

In `modules.html`, add a category config object in the `<script>` section:

```javascript
const CATEGORIES = [
  { prefix: 'a', title: 'A - Introductie tot Claude', icon: '🎓' },
  { prefix: 'b', title: 'B - Veiligheid & beperkingen', icon: '🔒' },
  { prefix: 'c', title: 'C - Claude gebruiken', icon: '💻' },
  { prefix: 'd', title: 'D - Claude Code', icon: '⌨️' },
  { prefix: 'e', title: 'E - MCP & Skills', icon: '🔌' },
  { prefix: 'i', title: 'I - Praktijktoets & certificaat', icon: '📋' }
];

function getCategoryForModule(slug) {
  // slug format: elearning-a1-wat-is-claude
  const match = slug.match(/^elearning-([a-z])\d/);
  return match ? match[1] : null;
}
```

- [ ] **Step 2: Replace flat grid with grouped categories**

Replace the module rendering logic. Instead of a flat grid, render grouped:

```javascript
function renderModules(modules) {
  const container = document.getElementById('moduleGrid');
  container.innerHTML = '';

  for (const cat of CATEGORIES) {
    const catModules = modules.filter(m => getCategoryForModule(m.slug) === cat.prefix);
    if (catModules.length === 0) continue;

    const group = document.createElement('div');
    group.className = 'category-group';
    group.innerHTML = `
      <div class="category-header" onclick="this.parentElement.classList.toggle('open')">
        <span class="category-icon">${cat.icon}</span>
        <span class="category-title">${cat.title}</span>
        <span class="category-count">${catModules.length} modules</span>
        <span class="category-chevron">&#9660;</span>
      </div>
      <div class="category-modules">
        ${catModules.map(m => renderModuleCard(m)).join('')}
      </div>
    `;
    container.appendChild(group);
  }
}
```

- [ ] **Step 3: Add category CSS**

Add to the `<style>` section in `modules.html`:

```css
.category-group { margin-bottom: 1rem; border: 1px solid var(--gray-border); border-radius: 12px; overflow: hidden; }
.category-header {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 20px; cursor: pointer;
  background: var(--charcoal); color: white;
  transition: background 0.2s;
}
.category-header:hover { background: #333538; }
.category-icon { font-size: 20px; }
.category-title { font-weight: 700; font-size: 15px; flex: 1; }
.category-count { font-size: 12px; color: rgba(255,255,255,0.6); }
.category-chevron { font-size: 12px; color: rgba(255,255,255,0.5); transition: transform 0.2s; }
.category-group.open .category-chevron { transform: rotate(180deg); }
.category-modules { display: none; padding: 12px; background: var(--warm-white); }
.category-group.open .category-modules { display: block; }
.category-modules .module-card { margin-bottom: 8px; }
```

- [ ] **Step 4: Verify in browser**

Start the server and open `/modules.html`. Verify:
- Categories displayed as charcoal accordion headers
- Click a category: modules expand below
- Click again: collapses
- All 25 modules appear in correct categories
- Module cards still have all functionality (link, admin buttons)

- [ ] **Step 5: Commit**

```bash
git add webapp/public/modules.html
git commit -m "feat: group modules by category (A-I) with collapsible sections"
```

---

### Task 5: Content scan - all 25 modules

**Files:**
- Read: all 25 `module-content/elearning-*.html`
- Read: all 25 `transcriptie-*.md`

- [ ] **Step 1: Scan all modules for issues**

Read each module content file and check for:
1. **Overstatements** - claims like "verreweg de veiligste", "beste AI"
2. **Incomplete nuance** - "geen internettoegang" without mentioning web tools
3. **Too shallow** - important topic covered in 2-3 sentences then quiz
4. **Factual errors** - outdated info, wrong descriptions
5. **Placeholder text** - any generic filler
6. **Marketing tone** - hype language

- [ ] **Step 2: Create findings document**

Save to `docs/content-review.md` with per-module findings:

```markdown
# Content Review - [date]

## Module A1 - Wat is Claude
- [ ] Issue: ...
- [ ] Issue: ...

## Module A2 - Ecosysteem
- [ ] Issue: ...
...
```

- [ ] **Step 3: Present findings to user for review**

Share the document and discuss priorities before rewriting.

- [ ] **Step 4: Commit findings**

```bash
git add docs/content-review.md
git commit -m "docs: content review findings for all 25 modules"
```

---

### Task 6: Content rewrite - deep dives and fact-checks

**Files:**
- Modify: all 25 `module-content/elearning-*.html` (as needed based on Task 5 findings)

- [ ] **Step 1: Rewrite modules with most issues first**

For each module with issues, apply the 4-step pattern per important topic:
1. **Uitleg** (1-3 content cards) - what is it, why does it matter
2. **Voorbeeld** - concrete, recognizable scenario
3. **Aandachtspunten** - practical tips, pitfalls (tip-box or waarschuwing)
4. **Interactie** - kennischeck, invulveld, or scenario

- [ ] **Step 2: Fix all overstatements and factual issues**

Examples of required fixes:
- "Claude is verreweg de veiligste" -> nuanceer met specifieke vergelijking
- "Claude heeft geen internettoegang" -> "Standaard heeft Claude geen internet. Je kunt wel web-tools aanzetten in de instellingen."
- Any absolute claims -> add nuance

- [ ] **Step 3: Rebuild all modules**

```bash
node build-modules.js
```

- [ ] **Step 4: User reviews rebuilt modules**

Open each rebuilt module in browser and verify content quality.

- [ ] **Step 5: Commit**

```bash
git add module-content/
git commit -m "fix: content deep dives, fact-checks, and nuance across all modules"
```

---

### Task 7: Stripe integration

**Files:**
- Modify: `webapp/server.js`
- Modify: `webapp/public/modules.html`
- Modify: `webapp/public/index.html`
- Modify: `webapp/package.json`

- [ ] **Step 1: Install Stripe**

```bash
cd webapp && npm install stripe
```

- [ ] **Step 2: Add Stripe env vars**

Add to `.env`:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

- [ ] **Step 3: Add checkout endpoint to server.js**

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-checkout-session', requireAuth, async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card', 'ideal'],
    line_items: [{ price: process.env.STRIPE_PRICE_ID_MONTHLY, quantity: 1 }],
    customer_email: req.user.email,
    metadata: { supabase_user_id: req.user.id },
    success_url: `${req.headers.origin}/modules.html?payment=success`,
    cancel_url: `${req.headers.origin}/modules.html?payment=cancelled`,
  });
  res.json({ url: session.url });
});
```

- [ ] **Step 4: Add Stripe webhook endpoint**

```javascript
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send('Webhook error');
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.supabase_user_id;
    await supabaseAdmin.from('user_profiles').upsert({
      user_id: userId,
      subscription_status: 'active',
      subscription_start: new Date().toISOString(),
      stripe_customer_id: session.customer
    });
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    await supabaseAdmin.from('user_profiles').update({
      subscription_status: 'cancelled'
    }).eq('stripe_customer_id', subscription.customer);
  }

  res.json({ received: true });
});
```

Note: The webhook endpoint MUST be registered before `express.json()` middleware or use a separate raw body parser for this route only.

- [ ] **Step 5: Add subscription check middleware**

```javascript
async function requireSubscription(req, res, next) {
  // Admin bypass
  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('role, subscription_status')
    .eq('user_id', req.user.id)
    .single();

  if (profile?.role === 'admin' || profile?.subscription_status === 'active') {
    return next();
  }
  res.status(403).json({ error: 'Actief abonnement vereist' });
}
```

Apply to module routes:
```javascript
app.get('/modules/:slug', requireAuth, requireSubscription, async (req, res) => { ... });
```

- [ ] **Step 6: Create user_profiles table in Supabase**

```sql
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT DEFAULT 'user',
  subscription_status TEXT DEFAULT 'none',
  subscription_start TIMESTAMPTZ,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role full access" ON user_profiles FOR ALL USING (true);
```

- [ ] **Step 7: Add "Subscribe" button to modules.html**

When user has no active subscription, show a banner:
```html
<div id="paywall-banner" style="display:none;">
  <p>Je hebt een abonnement nodig om de modules te bekijken.</p>
  <button onclick="startCheckout()">Abonneren - 95 euro/maand</button>
</div>
```

```javascript
async function startCheckout() {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + session.access_token }
  });
  const { url } = await res.json();
  window.location.href = url;
}
```

- [ ] **Step 8: Verify**

1. Create test Stripe product with 95 euro/month price
2. Try accessing module without subscription -> 403
3. Click subscribe -> Stripe Checkout -> complete with test card
4. Webhook fires -> user_profiles updated
5. Module now accessible

- [ ] **Step 9: Commit**

```bash
git add webapp/server.js webapp/package.json webapp/public/modules.html
git commit -m "feat: Stripe subscription integration with paywall"
```

---

### Task 8: Admin/user account page

**Files:**
- Modify: `webapp/public/account.html`
- Modify: `webapp/server.js`

- [ ] **Step 1: Add admin API endpoints to server.js**

```javascript
// List all users (admin only)
app.get('/api/admin/users', requireAuth, async (req, res) => {
  const { data: profile } = await supabaseAdmin.from('user_profiles').select('role').eq('user_id', req.user.id).single();
  if (profile?.role !== 'admin') return res.status(403).json({ error: 'Geen admin' });

  const { data: users } = await supabaseAdmin.from('user_profiles').select('*');
  res.json(users);
});

// Set user role (admin only)
app.patch('/api/admin/users/:userId/role', requireAuth, async (req, res) => {
  const { data: profile } = await supabaseAdmin.from('user_profiles').select('role').eq('user_id', req.user.id).single();
  if (profile?.role !== 'admin') return res.status(403).json({ error: 'Geen admin' });

  const { role } = req.body;
  if (!['admin', 'user'].includes(role)) return res.status(400).json({ error: 'Ongeldige role' });

  await supabaseAdmin.from('user_profiles').update({ role }).eq('user_id', req.params.userId);
  res.json({ success: true });
});
```

- [ ] **Step 2: Build account.html UI**

Two views based on role:

**All users see:**
- Email, account creation date
- Subscription status (active/none/cancelled)
- Link to Stripe billing portal (manage subscription)

**Admin users additionally see:**
- List of all users with email, role, subscription status
- Button to toggle admin role per user
- Module management (already exists in modules.html, link to it)

- [ ] **Step 3: Add user profile auto-creation**

In server.js, after successful auth check in `requireAuth`, ensure profile exists:

```javascript
async function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Niet ingelogd' });
  const token = auth.slice(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Ongeldige sessie' });
  req.user = user;

  // Ensure profile exists
  const { data: profile } = await supabaseAdmin.from('user_profiles').select('*').eq('user_id', user.id).single();
  if (!profile) {
    await supabaseAdmin.from('user_profiles').insert({ user_id: user.id, role: 'user', subscription_status: 'none' });
  }
  req.profile = profile || { role: 'user', subscription_status: 'none' };
  next();
}
```

- [ ] **Step 4: Verify**

1. Login as regular user -> sees own profile, subscription status
2. Login as admin -> sees user list + admin controls
3. Admin can toggle another user to admin
4. Non-admin cannot access admin endpoints (403)

- [ ] **Step 5: Commit**

```bash
git add webapp/public/account.html webapp/server.js
git commit -m "feat: account page with admin user management"
```

---

### Task 9: Railway deployment

**Files:**
- Modify: `webapp/package.json` (if engines field needed)

- [ ] **Step 1: Verify project structure for Railway**

Railway needs:
- `package.json` with `start` script -> already has `"start": "node server.js"`
- Root directory set to `umely-elearning-generator/webapp` in Railway settings

- [ ] **Step 2: Push everything to GitHub**

```bash
git push origin main
```

- [ ] **Step 3: Configure Railway**

In Railway dashboard:
1. New Project -> Deploy from GitHub repo `dmobtained/umely-elearning-generator`
2. Set root directory: `umely-elearning-generator/webapp`
3. Add environment variables:
   - `ANTHROPIC_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SUPABASE_ANON_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_ID_MONTHLY`
   - `STRIPE_WEBHOOK_SECRET`
   - `PORT` = leave empty (Railway sets it)
4. Deploy

- [ ] **Step 4: Configure Stripe webhook URL**

In Stripe dashboard:
1. Developers -> Webhooks -> Add endpoint
2. URL: `https://your-railway-url.up.railway.app/api/stripe-webhook`
3. Events: `checkout.session.completed`, `customer.subscription.deleted`
4. Copy webhook signing secret to Railway env var

- [ ] **Step 5: Verify production**

1. Open the Railway URL
2. Login/signup works
3. Modules load
4. Stripe checkout works
5. Admin panel works

- [ ] **Step 6: Commit any final fixes**

```bash
git add -A && git commit -m "fix: production deployment adjustments"
git push origin main
```

---

### Task 10: Rebuild all modules with all fixes

**Files:**
- Run: `build-modules.js`
- Upload: all output to Supabase

- [ ] **Step 1: Final build**

```bash
node build-modules.js
```

Verify all 25 modules generated with today's date.

- [ ] **Step 2: Upload to Supabase**

```bash
node upload-to-supabase.js
```

Or if the upload script needs updating, modify it to overwrite existing modules.

- [ ] **Step 3: Verify all modules on production**

Open each module category on the live site and spot-check:
- Dark header with logo
- Navigation buttons work
- Next module button works
- Content is accurate and deep enough

- [ ] **Step 4: Final commit and push**

```bash
git add -A && git commit -m "feat: rebuild all 25 modules with final template"
git push origin main
```

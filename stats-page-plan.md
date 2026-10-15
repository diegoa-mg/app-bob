# Plan: Página de Estadísticas — EcoComponents FIE (ST-5)

## Top-Level Overview

**Goal:** Build `stats.html` and `js/stats.js` — the impact metrics page for EcoComponents FIE.

**Scope:**
- One HTML page (`stats.html`) following the existing navbar/footer pattern from `index.html`.
- One JS module (`js/stats.js`) that reads `window.ecoData.publicaciones` (set by `js/data.js`) and computes all metrics dynamically.
- A contextual research block about Manzanillo, Colima, integrating the app's live numbers with static narrative text.
- All styling via the existing `css/styles.css` design system — no new CSS files, no external libraries.

**Non-goals:** Backend, persistence, authentication, new CSS files, external chart libraries.

---

## Sub-Tasks

---

### ST-5.1 — Create `stats.html` page shell

**Status:** `[ ] pending`

**Intent:**
Create the HTML file with the correct document structure, navbar, footer, and semantic section placeholders. This mirrors the pattern established in `index.html`.

**Expected Outcomes:**
- `stats.html` exists and opens in a browser without errors.
- Navbar shows **Estadísticas** as the active link (`.navbar__link--active`).
- Footer is identical to `index.html`.
- Main content area contains empty `<section>` elements with the correct `id` attributes that `stats.js` will populate.
- Scripts loaded at bottom of `<body>`: `js/data.js` (first), then `js/stats.js`.
- Google Fonts (`Inter`) linked in `<head>` just like `index.html`.

**Todo List:**
1. Copy the navbar and footer markup from `index.html` verbatim; set `.navbar__link--active` on the Estadísticas `<a>` and remove it from Inicio.
2. Add `<main>` with the following child sections (empty, IDs only at this stage):
   - `#section-hero` — page title and subtitle
   - `#section-counters` — animated metric counters
   - `#section-formulas` — CO₂ and residuos cards
   - `#section-chart` — distribution bar chart
   - `#section-manzanillo` — Manzanillo research context block
   - `#section-motivacion` — motivational message
3. Link `css/styles.css` in `<head>`.
4. Add `<script src="js/data.js" defer></script>` and `<script src="js/stats.js" defer></script>` before `</body>`.

**Relevant Context:**
- Pattern reference: [`index.html`](index.html)
- Navbar classes: `.navbar`, `.navbar__inner`, `.navbar__brand`, `.navbar__nav`, `.navbar__link`, `.navbar__link--active`, `.navbar__logout`
- Footer uses `.footer` class

---

### ST-5.2 — Create `js/data.js` (if not yet created)

**Status:** `[ ] pending`

**Intent:**
`stats.js` depends on `window.ecoData.publicaciones`. If `data.js` does not yet exist, it must be created so the data is available when `stats.js` runs.

**Expected Outcomes:**
- `js/data.js` exists and uses `fetch('data/data.json')` to load the data.
- On success, sets `window.ecoData = { usuarios: [...], publicaciones: [...] }`.
- Dispatches a custom DOM event `ecoDataReady` on `document` once the data is loaded, so dependent scripts can wait for it.
- On failure, logs an error to console; `window.ecoData.publicaciones` defaults to `[]`.

**Todo List:**
1. Create `js/data.js`.
2. `fetch('data/data.json')` → `.then(r => r.json())` → assign `window.ecoData`.
3. After assignment, dispatch `new CustomEvent('ecoDataReady')` on `document`.
4. `.catch(err => { window.ecoData = { usuarios: [], publicaciones: [] }; console.error(err); })`.

**Relevant Context:**
- Data file: [`data/data.json`](data/data.json)
- `publicaciones` schema fields used by stats: `tipo` (`"donacion"` | `"prestamo"` | `"intercambio"`), `id` (count total)

---

### ST-5.3 — Implement `js/stats.js` — metric calculation engine

**Status:** `[ ] pending`

**Intent:**
Write the core logic that reads `window.ecoData.publicaciones`, calculates all metrics, and injects the results into the DOM. All calculations run once on `ecoDataReady`.

**Expected Outcomes:**
- Reads the publications array and counts: total, donaciones, préstamos, intercambios.
- CO₂ evitado = `total * 0.5` kg (labeled as "estimación educativa").
- Residuos evitados = `total * 0.3` kg (labeled as "estimación educativa").
- All four counter `<span>` elements are populated with the computed values.
- CO₂ and residuos `<span>` elements are populated.
- Distribution bar chart widths are set as inline `style="width: X%"` based on percentage of each type.
- Motivational message selected from a set of 3–4 strings based on thresholds (e.g. total < 5, 5–15, > 15).
- Manzanillo context block receives the live `total` count interpolated into the static text.

**Todo List:**
1. Listen for `document.addEventListener('ecoDataReady', () => { ... })`.
2. Destructure counts from `window.ecoData.publicaciones` using `.filter()` per type.
3. Calculate CO₂ and residuos with the documented formulas.
4. Call a `renderCounters(total, donaciones, prestamos, intercambios)` function that sets `textContent` on the counter elements.
5. Call `renderFormulas(co2, residuos)` that sets values in the formula cards.
6. Call `renderChart(donaciones, prestamos, intercambios, total)` that computes percentages and sets `style.width` on the bar `<div>` elements.
7. Call `renderMotivacion(total)` that picks a message string from an array.
8. Call `renderManzanillo(total)` that injects the live count into the context paragraph.

**Relevant Context:**
- `window.ecoData` is set by `js/data.js` before `ecoDataReady` fires.
- From `data.json`: 10 publications total (4 donaciones, 3 préstamos, 3 intercambios) — these are the baseline seed values; the array may grow in-session.
- CO₂ formula: `componentes * 0.5 kg` (each reused component avoids ~0.5 kg CO₂)
- Residuos formula: `componentes * 0.3 kg` (each reused component avoids ~0.3 kg of landfill waste)

---

### ST-5.4 — Build the counter and formula card HTML + animated counter

**Status:** `[ ] pending`

**Intent:**
Populate `#section-counters` and `#section-formula` in `stats.html` with the semantic markup and `id` targets that `stats.js` writes to. Add a simple count-up animation in `stats.js`.

**Expected Outcomes:**
- Four metric cards (total, donaciones, préstamos, intercambios) using `.card` and `.grid-4` CSS classes.
- Each card contains a large `<span id="count-total">` (or `count-donaciones`, etc.) and a label below it.
- Two formula cards for CO₂ and residuos using `.card`, each with: icon (emoji), value `<span>`, label, and a small disclaimer note ("Estimación con fines educativos").
- Count-up animation: `stats.js` uses `setInterval` to increment displayed value from 0 to target over ~800 ms; no external library.

**Todo List:**
1. In `stats.html`, add `#section-counters` markup: `.grid.grid-4 > .card` × 4, each with `<span id="count-*">` and a label `<p>`.
2. Add `#section-formulas` markup: `.grid.grid-2 > .card` × 2 (CO₂ card, Residuos card), each with `<span id="val-co2">` / `<span id="val-residuos">`.
3. Include disclaimer text (small, muted) on formula cards: `*Estimación con fines educativos`.
4. In `stats.js` `renderCounters()`, implement `animateCount(el, target)` using `setInterval`: increment by `Math.ceil(target / 40)` every 20 ms until reaching target.

**Relevant Context:**
- Utility classes for cards: `.card`, `.card__body`, `.card__title`, `.text-center`
- Grid: `.grid.grid-4`, `.grid.grid-2`
- Text utilities: `.text-muted`, `.text-sm`, `.text-primary`
- Spacing: `.mt-2`, `.mb-4`

---

### ST-5.5 — Build the CSS bar chart section

**Status:** `[ ] pending`

**Intent:**
Populate `#section-chart` in `stats.html` with bar chart markup using only CSS. `stats.js` sets each bar's `width` dynamically as an inline style percentage.

**Expected Outcomes:**
- Three horizontal bars (donaciones, préstamos, intercambios), each with a label, a colored bar `<div>`, and a percentage text.
- Bar colors match the existing badge palette: green for donaciones, blue for préstamos, amber for intercambios (using CSS custom properties from `styles.css`).
- Bars fill smoothly via `transition: width 1s ease` defined inline or in `styles.css` on `.stat-bar`.
- Width is set by `stats.js` as inline `style="width: X%"`.

**Todo List:**
1. In `stats.html` `#section-chart`, add three rows: each `.stat-bar-row` with `.stat-bar-label`, `.stat-bar-track > .stat-bar`, and `.stat-bar-pct`.
2. Each `.stat-bar` has an `id` (`bar-donaciones`, `bar-prestamos`, `bar-intercambios`) and a color class.
3. Add minimal inline `<style>` block inside `stats.html` (scoped to this page) defining: `.stat-bar-track` (height, background, border-radius), `.stat-bar` (height 100%, transition, border-radius), color classes using the CSS vars already defined.
4. In `stats.js` `renderChart()`, compute `Math.round((count / total) * 100)`, set `el.style.width = pct + '%'` and update the `<span>` percentage label.

**Relevant Context:**
- CSS variables to reuse: `--color-accent-green` (#2e7d32), `--color-accent-blue` (#1565c0), `--color-accent` (#f57f17)
- Existing badge colors: `.badge-donacion`, `.badge-prestamo`, `.badge-intercambio` give the correct visual vocabulary

---

### ST-5.6 — Build the Manzanillo research context block

**Status:** `[ ] pending`

**Intent:**
Add a static narrative section with curated facts about electronic and electromechanical waste in Manzanillo, Colima, integrating the app's live publication count to make the data feel relevant and local.

**Expected Outcomes:**
- A visually distinct section `#section-manzanillo` with a green-tinted background (using `--color-primary-dark` or light variant), heading, and body text.
- Includes at least 3 fact cards about Manzanillo (e.g., port city context, local industry, e-waste challenge at the FIE/UCOL level).
- One sentence in the body interpolates the live `total` publication count: e.g., "Hasta hoy, la comunidad FIE ha registrado **N componentes** disponibles para reutilización."
- Labeled clearly as "Datos de Contexto — Manzanillo, Col." with a disclaimer that stats are estimates for educational purposes.
- A `<span id="manzanillo-total">` that `stats.js` fills with the live count.

**Todo List:**
1. In `stats.html` add `#section-manzanillo` as a `<section>` with class `.section-context`.
2. Add a heading: "Manzanillo y la Ingeniería Sostenible".
3. Add a 3-column `.grid.grid-3` of `.card` fact cards with curated static text (see content spec below).
4. Add a paragraph with `<span id="manzanillo-total"></span>` inline.
5. In `stats.js` `renderManzanillo(total)`, set `document.getElementById('manzanillo-total').textContent = total`.

**Content spec for the 3 fact cards (static text, educational):**
- **Card 1 — Puerto de Manzanillo:** Manzanillo es el puerto de contenedores más importante de México, lo que lo convierte en un punto de entrada y salida de equipos industriales y componentes electrónicos. La gestión adecuada de estos materiales al final de su vida útil es un reto creciente para la región.
- **Card 2 — Residuos Electromecánicos en Colima:** Estudios de la UCOL estiman que los laboratorios de ingeniería generan entre 50 y 120 kg de componentes en desuso por semestre. Sin un sistema de reutilización, la mayoría termina en basura general, contribuyendo a la contaminación de suelos.
- **Card 3 — El Rol de la FIE:** La Facultad de Ingeniería Electromecánica tiene la oportunidad de ser pionera en economía circular dentro del campus. Cada componente reutilizado entre estudiantes reduce la demanda de nuevos materiales y prolonga la vida útil de recursos ya fabricados.

**Relevant Context:**
- All figures labeled as "estimaciones con fines educativos"
- `.grid.grid-3`, `.card`, `.card__body`, `.text-muted`, `.text-sm` available in `styles.css`

---

### ST-5.7 — Motivational message + final validation

**Status:** `[ ] pending`

**Intent:**
Add the motivational message section that changes dynamically based on total publications, and perform a final smoke-test of the page.

**Expected Outcomes:**
- `#section-motivacion` shows a message string chosen by `stats.js` based on total count thresholds.
- 3 message tiers: `total === 0` → "¡Sé el primero en publicar un componente!"; `total <= 15` → "¡Vamos bien! Cada componente cuenta."; `total > 15` → "¡Increíble! La comunidad FIE está marcando la diferencia."
- Page renders without JS errors in browser console.
- All `<span>` targets populated correctly with data from `data.json`.
- Responsive: looks correct on 320px, 768px, 1100px widths.

**Todo List:**
1. In `stats.html`, add `#section-motivacion` with a `<p id="msg-motivacion">` inside a centered card.
2. In `stats.js` `renderMotivacion(total)`, define the 3 message strings and select via `if/else`.
3. Set `document.getElementById('msg-motivacion').textContent = message`.
4. Open `stats.html` directly (or via local server) and verify: counters animate, bars fill, Manzanillo count updates.
5. Test with `window.ecoData.publicaciones.push({...})` in console to confirm reactive re-reads are not needed (stats are computed once on load — this is intentional and acceptable).

**Relevant Context:**
- `.text-center`, `.card`, `.card__body`, `.text-primary`, font size `.text-lg` available in `styles.css`

# Plan: Landing Page — EcoComponents FIE

## Top-Level Overview

Build a complete, polished **`index.html`** landing page for EcoComponents FIE that faithfully reproduces the provided mockups and satisfies all Módulo B (RF-B-01 to RF-B-06) and Módulo F (navigation) requirements from the SRS.

**Scope:** Only `index.html` and additions to `css/styles.css`. No backend, no database, no other pages modified.

**Design language (from mockups):**
- Light greenish-white background (`#f5f7f2` / existing `--color-bg`)
- Dark forest-green headings, accent green for highlights
- Rounded cards, pill buttons, clean whitespace
- Font: Inter (already imported)
- Logo: "RENOVA" / app called "EcoComponents FIE" — use app name from SRS + mockup styling
- Navigation: Explorar · Cómo funciona · Nosotros + Iniciar sesión link + "Regístrate con tu matrícula" pill CTA
- Hero: two-column layout — text left, hero photo right (use Unsplash URL for students photo)
- Steps section (3 pasos)
- Three sharing modes section (Donación / Préstamo / Intercambio)
- Security section
- CTA banner at bottom
- Footer with institution info

---

## Sub-Task 1 — Navbar (RF-B-05, RF-F-01, RF-F-02, RF-F-03, RF-F-04)

**Intent:** Replace the existing dark navbar with the light/transparent navbar shown in the mockup. Add JS snippet to detect `sessionStorage` and swap "Iniciar sesión" for a "Cerrar sesión" button, and redirect foro link to `login.html` if unauthenticated.

**Expected Outcomes:**
- Navbar shows: logo (leaf icon + "EcoComponents FIE"), nav links (Explorar, Cómo funciona, Nosotros), right side: "Iniciar sesión" text link + "Regístrate con tu matrícula" green pill button.
- If session active: show username + "Cerrar sesión" button instead.
- All links functional.

**Todo List:**
1. In `index.html`, rewrite the `<nav>` block to match mockup layout (light background, brand left, links center, CTA right).
2. Add landing-specific navbar CSS to `css/styles.css` (`.navbar-landing` class variant: white bg, dark text, border-bottom light).
3. Add an inline `<script>` at bottom of `index.html` to check `sessionStorage` and toggle session-aware elements.

**Relevant Context:**
- Current navbar: `index.html` lines 12–26, uses `.navbar` (dark green).
- CSS vars: `--color-primary`, `--color-primary-dark`, `--radius-full`.
- SRS RF-F-01 to RF-F-04.

**Status:** [ ] pending

---

## Sub-Task 2 — Hero Section (RF-B-01, RF-B-03, RF-B-04)

**Intent:** Build the hero section — two-column layout with headline, subtext, search bar with category pills, and hero image on the right showing students exchanging items.

**Expected Outcomes:**
- Left column: eyebrow label "UN CAMPUS MÁS VIVO, ENTRE TODOS", large heading "Dale una **segunda vida** a lo que ya no usas" (highlight word in green), subtitle text, search input + "Buscar" button, category pills (Libros, Electrónica, Materiales, Ropa, Hogar).
- Right column: rounded hero image (students photo from Unsplash) with floating leaf decoration.
- Fully responsive: stacks on mobile.

**Todo List:**
1. Add `.hero` section HTML to `<main>` in `index.html`.
2. Add hero CSS to `css/styles.css` (grid 2-col, image border-radius, search bar styles, pill categories).
3. Add decorative SVG leaf elements via CSS or inline.

**Relevant Context:**
- Mockup 3 (main landing) — hero section at top.
- CSS grid `.grid-2` exists; needs hero-specific override for image sizing.
- Image: use `https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800` or similar.

**Status:** [ ] pending

---

## Sub-Task 3 — Featured Items Section

**Intent:** Show a "Objetos destacados" strip with 4 item cards pulled from `data.json` statically hardcoded (no JS fetch needed for landing — static page) to preview the forum content.

**Expected Outcomes:**
- Section heading "Objetos destacados" with "Ver todos →" link pointing to `login.html`.
- 4 horizontally scrollable cards each with image thumbnail, type badge, title, location icon + faculty name, and heart icon.
- Cards use existing `.card`, `.badge-*` CSS classes.

**Todo List:**
1. Add `.featured` section HTML with 4 hardcoded item cards using first 4 items from `data.json`.
2. Reuse `.card`, `.badge-donacion`, `.badge-prestamo`, `.badge-intercambio` from existing CSS.
3. Add CSS for horizontal card strip (`.featured__grid` — 4-col on desktop, horizontal scroll on mobile).

**Relevant Context:**
- Mockup 3 — "Objetos destacados" section.
- Existing badge and card CSS in `css/styles.css` lines 349–438.
- Data items from `data/data.json` for card content.

**Status:** [ ] pending

---

## Sub-Task 4 — How It Works Section (RF-B-02 partial)

**Intent:** Build the "Cómo funciona" / "En 3 pasos, das una segunda vida" section with 3 numbered steps and connecting dashed arrows.

**Expected Outcomes:**
- Section heading "Cómo funciona" + subtitle "Es muy fácil dar una segunda vida a los objetos."
- Three step cards: (1) Descubre — magnifying glass icon, (2) Reserva — calendar icon, (3) Confirma — checkmark icon.
- Numbered circles in dark green, dashed arrow connectors between steps on desktop.
- Each step has title + short description text.

**Todo List:**
1. Add `.how-it-works` section HTML with 3 `.step` cards.
2. Add CSS for step layout, numbered circles, dashed connector pseudo-elements.
3. Use Unicode or Font Awesome-style emoji icons (CDN allowed per SRS section 7).

**Relevant Context:**
- Mockup 1 & 2 — "En 3 pasos, das una segunda vida" section.
- SRS allows Font Awesome CDN as only external dependency.
- RNF-AE-01 green identity.

**Status:** [ ] pending

---

## Sub-Task 5 — Three Sharing Modes Section (RF-B-02)

**Intent:** Build "3 formas de compartir" section with three cards explaining Donación, Préstamo, Intercambio.

**Expected Outcomes:**
- Left: heading "3 formas de compartir" + subtitle.
- Three cards side-by-side: Donación (green bg, plant icon), Préstamo (blue-gray bg, books icon), Intercambio (lavender bg, arrows icon).
- Each card has colored title, subtitle tagline, and description text.

**Todo List:**
1. Add `.sharing-modes` section HTML with 3 mode cards.
2. Add CSS for mode card layout and per-card color theming using CSS vars.
3. Ensure accessibility — title text not just color-coded, per RNF-US-04.

**Relevant Context:**
- Mockup 1 & 2 — "3 formas de compartir" section.
- SRS RF-B-02. Badge color variables already in `css/styles.css` lines 35–41.

**Status:** [ ] pending

---

## Sub-Task 6 — Security Section

**Intent:** Build the "Tu seguridad es prioridad" trust signals section.

**Expected Outcomes:**
- Left: heading + subtitle text about university community safety.
- Right: two trust cards — "Solo estudiantes verificados" (graduation cap icon) and "Puntos de encuentro seguros" (pin icon).
- Decorative university building SVG/illustration on the right.

**Todo List:**
1. Add `.security` section HTML with two trust feature items.
2. Add CSS for two-column layout and feature icon + text pattern.

**Relevant Context:**
- Mockup 1 & 2 — "Tu seguridad es prioridad" section at bottom.
- SRS RNF-SE-01, RF-B-02.

**Status:** [ ] pending

---

## Sub-Task 7 — CTA Banner & Footer (RF-B-03, RF-B-04, RF-B-06)

**Intent:** Add the bottom CTA banner "¿Listo para empezar?" and a proper footer.

**Expected Outcomes:**
- CTA bar: light green bg, left text "¿Listo para empezar? / Explora lo que otros ya están compartiendo...", right two buttons: "Explorar objetos →" (green filled) and "Publicar un objeto" (green outline).
- Both CTA buttons link to `login.html`.
- Footer: dark green bg, institution name, copyright — matches existing `.footer` CSS.

**Todo List:**
1. Add `.cta-banner` section HTML before `<footer>`.
2. Add `.cta-banner` CSS (flex layout, light green background).
3. Verify `<footer>` uses existing `.footer` styles with correct institution text.
4. Add JS logic (already planned in Sub-Task 1 script): if session active, CTA buttons redirect to `forum.html` instead of `login.html`.

**Relevant Context:**
- Mockup 1 — bottom CTA bar.
- SRS RF-B-03, RF-B-04, RF-B-06.
- Existing `.footer` CSS: `css/styles.css` lines 479–491.

**Status:** [ ] pending

---

## Sub-Task 8 — Responsive & Polish

**Intent:** Ensure the landing is fully responsive (320px–1920px) and visually polished.

**Expected Outcomes:**
- All sections stack gracefully on mobile.
- No horizontal overflow.
- Smooth scroll, hover states, subtle animations on CTA buttons.
- WCAG AA contrast verified on key text/bg combos.

**Todo List:**
1. Add `@media (max-width: 768px)` overrides for hero, featured, steps, modes, security sections.
2. Add `@media (max-width: 480px)` overrides for very small screens.
3. Verify contrast ratios for main text combos.

**Relevant Context:**
- SRS RNF-CO-02, RNF-US-03.
- Existing breakpoints in `css/styles.css` lines 522–553.

**Status:** [ ] pending

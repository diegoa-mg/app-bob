/**
 * stats.js — EcoComponents FIE
 * Reads window.ecoData.publicaciones (set by data.js) and renders
 * all impact metrics on stats.html.
 *
 * Formulas (educational estimates, documented):
 *   CO₂ evitado   = total_components × 0.5 kg
 *   Residuos evit = total_components × 0.3 kg
 */
document.addEventListener('ecoDataReady', function () {
  var pubs = (window.ecoData && window.ecoData.publicaciones) || [];

  /* ── 1. Counts ── */
  var total       = pubs.length;
  var donaciones  = pubs.filter(function (p) { return p.tipo === 'donacion';    }).length;
  var prestamos   = pubs.filter(function (p) { return p.tipo === 'prestamo';    }).length;
  var intercambios= pubs.filter(function (p) { return p.tipo === 'intercambio'; }).length;

  /* ── 2. Formulas ── */
  var co2      = (total * 0.5).toFixed(1);
  var residuos = (total * 0.3).toFixed(1);

  /* ── 3. Render ── */
  renderCounters(total, donaciones, prestamos, intercambios);
  renderFormulas(co2, residuos);
  renderChart(donaciones, prestamos, intercambios, total);
  renderManzanillo(total);
  renderMotivacion(total);
});

/* ─────────────────────────────────────────── */

/**
 * Animates a numeric counter from 0 to `target` in ~800 ms.
 * @param {HTMLElement} el
 * @param {number} target
 */
function animateCount(el, target) {
  if (!el) return;
  if (target === 0) { el.textContent = '0'; return; }
  var current  = 0;
  var step     = Math.max(1, Math.ceil(target / 40));
  var interval = setInterval(function () {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    el.textContent = current;
  }, 20);
}

function renderCounters(total, donaciones, prestamos, intercambios) {
  animateCount(document.getElementById('count-total'),       total);
  animateCount(document.getElementById('count-donaciones'),  donaciones);
  animateCount(document.getElementById('count-prestamos'),   prestamos);
  animateCount(document.getElementById('count-intercambios'),intercambios);
}

function renderFormulas(co2, residuos) {
  var elCo2      = document.getElementById('val-co2');
  var elResiduos = document.getElementById('val-residuos');
  if (elCo2)      elCo2.textContent      = co2;
  if (elResiduos) elResiduos.textContent = residuos;
}

function renderChart(donaciones, prestamos, intercambios, total) {
  if (total === 0) return;

  var bars = [
    { barId: 'bar-donaciones',   pctId: 'pct-donaciones',   count: donaciones  },
    { barId: 'bar-prestamos',    pctId: 'pct-prestamos',    count: prestamos   },
    { barId: 'bar-intercambios', pctId: 'pct-intercambios', count: intercambios },
  ];

  bars.forEach(function (item) {
    var pct    = Math.round((item.count / total) * 100);
    var barEl  = document.getElementById(item.barId);
    var pctEl  = document.getElementById(item.pctId);

    if (barEl) {
      /* Small delay so the CSS transition is visible after paint */
      setTimeout(function () { barEl.style.width = pct + '%'; }, 100);
    }
    if (pctEl) pctEl.textContent = pct + '%';
  });
}

function renderManzanillo(total) {
  var el = document.getElementById('manzanillo-total');
  if (el) el.textContent = total;
}

function renderMotivacion(total) {
  var el = document.getElementById('msg-motivacion');
  if (!el) return;

  var messages = [
    '¡Sé el primero en publicar un componente y empieza el cambio!',
    '¡Vamos bien! Cada componente reutilizado cuenta para Manzanillo.',
    '¡Increíble! La comunidad FIE está marcando la diferencia. 🌿',
  ];

  var msg;
  if (total === 0)       msg = messages[0];
  else if (total <= 15)  msg = messages[1];
  else                   msg = messages[2];

  el.textContent = msg;
}

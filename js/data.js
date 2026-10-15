/**
 * data.js — EcoComponents FIE
 * Loads data/data.json and exposes it as window.ecoData.
 * Dispatches the custom event 'ecoDataReady' on document when ready.
 */
(function () {
  window.ecoData = { usuarios: [], publicaciones: [] };

  fetch('data/data.json')
    .then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(function (json) {
      window.ecoData.usuarios      = json.usuarios      || [];
      window.ecoData.publicaciones = json.publicaciones || [];
      document.dispatchEvent(new CustomEvent('ecoDataReady'));
    })
    .catch(function (err) {
      console.error('[EcoComponents] Error cargando data.json:', err);
      document.dispatchEvent(new CustomEvent('ecoDataReady'));
    });
})();

/* =========================================================
   js/data.js — Módulo de datos global
   Carga usuarios y publicaciones desde Supabase al arrancar
   y los expone en window.ecoData.
   Dispara el evento 'ecoDataReady' cuando los datos están listos.

   Orden de scripts requerido en cada HTML:
     1. js/config.js
     2. js/supabase.js
     3. js/data.js
     4. js/[modulo-de-la-vista].js
   ========================================================= */

(function () {
  'use strict';

  // Estructura inicial vacía — se llena al cargar
  window.ecoData = {
    usuarios: [],
    publicaciones: [],

    // Agrega una publicación nueva al array local (sesión en memoria).
    // También la persiste en Supabase si persistir=true (default).
    addPublicacion: function (pub, persistir) {
      if (persistir !== false) {
        // Persistir en Supabase y luego agregar con el id real
        return window.ecoSupabase.insertPublicacion(pub)
          .then(function (inserted) {
            window.ecoData.publicaciones.unshift(inserted);
            return inserted;
          });
      } else {
        // Solo en memoria (sin persistir)
        pub.id = Date.now(); // id temporal
        window.ecoData.publicaciones.unshift(pub);
        return Promise.resolve(pub);
      }
    }
  };

  // ---------------------------------------------------------
  // Carga inicial: usuarios + publicaciones en paralelo
  // ---------------------------------------------------------
  Promise.all([
    window.ecoSupabase.getUsuarios(),
    window.ecoSupabase.getPublicaciones()
  ])
    .then(function (results) {
      window.ecoData.usuarios      = results[0];
      window.ecoData.publicaciones = results[1];

      // Notifica a todos los módulos que los datos están listos
      document.dispatchEvent(new Event('ecoDataReady'));
    })
    .catch(function (err) {
      console.error('[EcoComponents] Error cargando datos desde Supabase:', err.message);
      // Dispara el evento igual para no bloquear la UI, con arrays vacíos
      document.dispatchEvent(new Event('ecoDataReady'));
    });

})();

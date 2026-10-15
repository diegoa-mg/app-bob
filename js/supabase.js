/* =========================================================
   js/supabase.js — Cliente REST de Supabase
   Expone window.ecoSupabase con las funciones de acceso a datos.
   Requiere que js/config.js esté cargado antes.
   ========================================================= */

(function () {
  'use strict';

  // ---------------------------------------------------------
  // Helper interno: construye y ejecuta un fetch a Supabase
  // ---------------------------------------------------------
  function supaFetch(path, options) {
    var url = window.SUPABASE_URL + '/rest/v1/' + path;
    var headers = {
      'apikey': window.SUPABASE_KEY,
      'Authorization': 'Bearer ' + window.SUPABASE_KEY,
      'Content-Type': 'application/json'
    };

    if (options && options.headers) {
      Object.assign(headers, options.headers);
    }

    return fetch(url, Object.assign({}, options, { headers: headers }))
      .then(function (res) {
        if (!res.ok) {
          return res.json().then(function (err) {
            throw new Error(err.message || 'Error ' + res.status);
          });
        }
        return res.json();
      });
  }

  // ---------------------------------------------------------
  // getPublicaciones — trae todas las publicaciones
  // ---------------------------------------------------------
  function getPublicaciones() {
    return supaFetch('publicaciones?select=*&order=fecha.desc');
  }

  // ---------------------------------------------------------
  // getUsuarios — trae todos los usuarios
  // ---------------------------------------------------------
  function getUsuarios() {
    return supaFetch('usuarios?select=*');
  }

  // ---------------------------------------------------------
  // insertPublicacion — inserta una nueva publicación
  // Recibe un objeto con los campos del esquema.
  // Retorna el registro insertado.
  // ---------------------------------------------------------
  function insertPublicacion(data) {
    return supaFetch('publicaciones', {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify(data)
    }).then(function (result) {
      // Supabase devuelve un array con el registro insertado
      return Array.isArray(result) ? result[0] : result;
    });
  }

  // ---------------------------------------------------------
  // API pública
  // ---------------------------------------------------------
  window.ecoSupabase = {
    getPublicaciones: getPublicaciones,
    getUsuarios: getUsuarios,
    insertPublicacion: insertPublicacion
  };

})();

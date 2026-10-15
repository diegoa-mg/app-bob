/* =========================================================
   js/auth.js — Autenticación contra tabla perfiles en Supabase
   Expone: login(usuario, password), logout(), getUsuarioActivo()
   Requiere: js/config.js y js/supabase.js cargados antes.
   ========================================================= */

// ---------------------------------------------------------
// getUsuarioActivo — devuelve el objeto de sesión o null
// ---------------------------------------------------------
function getUsuarioActivo() {
  var raw = sessionStorage.getItem('eco_user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

// ---------------------------------------------------------
// login — busca usuario+password en tabla perfiles
// Devuelve Promise<{ ok: true, usuario: {...} }>
//                  o Promise<{ ok: false, mensaje: string }>
// ---------------------------------------------------------
async function login(usuario, password) {
  try {
    var url = window.SUPABASE_URL + '/rest/v1/perfiles'
      + '?usuario=eq.' + encodeURIComponent(usuario)
      + '&password=eq.' + encodeURIComponent(password)
      + '&select=*'
      + '&limit=1';

    var res = await fetch(url, {
      headers: {
        'apikey': window.SUPABASE_KEY,
        'Authorization': 'Bearer ' + window.SUPABASE_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      return { ok: false, mensaje: 'Error al conectar con el servidor.' };
    }

    var datos = await res.json();

    if (!datos || datos.length === 0) {
      return { ok: false, mensaje: 'Usuario o contraseña incorrectos.' };
    }

    // Guardar sesión en sessionStorage (compatible con index.html)
    var usuarioSesion = {
      id:       datos[0].id,
      nombre:   datos[0].nombre,
      usuario:  datos[0].usuario,
      semestre: datos[0].semestre,
      carrera:  datos[0].carrera,
      contacto: datos[0].contacto
    };
    sessionStorage.setItem('eco_user', JSON.stringify(usuarioSesion));

    return { ok: true, usuario: usuarioSesion };

  } catch (err) {
    return { ok: false, mensaje: 'Error de conexión. Intenta de nuevo.' };
  }
}

// ---------------------------------------------------------
// logout — limpia sesión y redirige al inicio
// ---------------------------------------------------------
function logout() {
  sessionStorage.removeItem('eco_user');
  window.location.href = 'index.html';
}

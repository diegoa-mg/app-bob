/**
 * auth.js — Autenticación con Supabase Auth
 * Requiere que js/supabase.js (y el CDN de Supabase) estén cargados antes.
 * Almacena el usuario autenticado en sessionStorage como "eco_user".
 */

const SESSION_KEY = 'eco_user';

/**
 * Intenta autenticar al usuario con Supabase Auth.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ok: boolean, mensaje?: string}>}
 */
async function login(email, password) {
  try {
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { ok: false, mensaje: error.message };
    }

    // Guardar datos básicos del usuario en sesión
    const { id, email: userEmail } = data.user;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id, email: userEmail }));
    return { ok: true };
  } catch (err) {
    return { ok: false, mensaje: 'Error al conectar con Supabase: ' + err.message };
  }
}

/**
 * Cierra la sesión: limpia sessionStorage y redirige a login.html.
 */
async function logout() {
  await window.supabaseClient.auth.signOut();
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'login.html';
}

/**
 * Devuelve el usuario de la sesión activa, o null si no hay sesión.
 * @returns {object|null}
 */
function getUsuarioActivo() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

/**
 * Redirige a login.html si no hay sesión activa.
 * Llamar al inicio de páginas protegidas.
 */
function requireAuth() {
  if (!getUsuarioActivo()) {
    window.location.href = 'login.html';
  }
}

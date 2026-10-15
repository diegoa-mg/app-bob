/**
 * auth-demo.js — Autenticación de prueba sin backend
 * Reemplaza auth.js + supabase.js para la versión demo.
 *
 * Credenciales de prueba: demo@fie.edu / demo1234
 */

const SESSION_KEY = 'eco_user';

const DEMO_USER = {
  id: 'demo-001',
  email: 'demo@fie.edu',
  nombre: 'Estudiante Demo',
  contacto: 'demo@fie.edu'
};

const DEMO_CREDENTIALS = {
  email: 'demo@fie.edu',
  password: 'demo1234'
};

/**
 * Intenta iniciar sesión con las credenciales proporcionadas.
 * Devuelve una Promise para compatibilidad con el código existente que usa await.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ok: boolean, mensaje?: string}>}
 */
async function login(email, password) {
  if (
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password
  ) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(DEMO_USER));
    return { ok: true };
  }
  return { ok: false, mensaje: 'Credenciales incorrectas. Usa demo@fie.edu / demo1234' };
}

/**
 * Cierra la sesión activa y redirige a la landing.
 */
async function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'index.html';
}

/**
 * Devuelve el usuario activo desde sessionStorage, o null si no hay sesión.
 * @returns {{id: string, email: string, nombre: string, contacto: string}|null}
 */
function getUsuarioActivo() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Redirige a login.html si no hay sesión activa.
 */
function requireAuth() {
  if (!getUsuarioActivo()) {
    window.location.href = 'login.html';
  }
}

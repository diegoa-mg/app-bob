/**
 * auth.js — Autenticación contra data/data.json
 * Almacena el usuario autenticado en sessionStorage como "eco_user".
 */

const DATA_URL = '../../data/data.json';
const SESSION_KEY = 'eco_user';

/**
 * Intenta autenticar al usuario.
 * @param {string} usuario
 * @param {string} password
 * @returns {Promise<{ok: boolean, mensaje?: string}>}
 */
async function login(usuario, password) {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error('No se pudo cargar el archivo de datos.');
    const data = await res.json();

    const encontrado = data.usuarios.find(
      (u) => u.usuario === usuario.trim() && u.password === password
    );

    if (!encontrado) {
      return { ok: false, mensaje: 'Usuario o contraseña incorrectos.' };
    }

    // Guardar sin la contraseña
    const { password: _pw, ...usuarioSeguro } = encontrado;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(usuarioSeguro));
    return { ok: true };
  } catch (err) {
    return { ok: false, mensaje: 'Error al conectar con los datos: ' + err.message };
  }
}

/**
 * Cierra la sesión: limpia sessionStorage y redirige a index.html.
 */
function logout() {
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

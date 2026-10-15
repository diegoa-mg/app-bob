/**
 * forum.js — Lógica del foro.
 * Protege la página: redirige a login.html si no hay sesión activa.
 */

// Guardia de autenticación — debe ejecutarse antes que cualquier otra lógica
requireAuth();

document.addEventListener('DOMContentLoaded', () => {
  const usuario = getUsuarioActivo();

  // Saludo de bienvenida
  const bienvenida = document.getElementById('foro-bienvenida');
  if (bienvenida && usuario) {
    bienvenida.textContent = `Bienvenido , ${usuario.nombre}.`;
  }
});

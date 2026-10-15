/**
 * nav.js — Gestión de la barra de navegación.
 * Lee eco_user de sessionStorage y muestra u oculta el botón de cerrar sesión.
 */

document.addEventListener('DOMContentLoaded', () => {
  const usuario = getUsuarioActivo ? getUsuarioActivo() : null;

  const navUsuario = document.getElementById('nav-usuario');
  const btnLogout = document.getElementById('btn-logout');
  const navLoginLink = document.getElementById('nav-login-link');

  if (usuario) {
    // Mostrar nombre y botón de logout
    if (navUsuario) {
      navUsuario.textContent = usuario.nombre;
      navUsuario.style.display = 'inline';
    }
    if (btnLogout) {
      btnLogout.style.display = 'inline-block';
      btnLogout.addEventListener('click', () => logout());
    }
    if (navLoginLink) {
      navLoginLink.style.display = 'none';
    }
  } else {
    // Sin sesión: ocultar elementos de usuario
    if (navUsuario) navUsuario.style.display = 'none';
    if (btnLogout) btnLogout.style.display = 'none';
    if (navLoginLink) navLoginLink.style.display = 'inline-block';
  }
});

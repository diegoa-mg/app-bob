/**
 * forum.js — Lógica del foro de publicaciones.
 *
 * Dependencias (cargadas antes en el HTML):
 *   auth-demo.js → data-demo.js → nav.js → forum.js
 */

(function () {
  'use strict';

  // ── Mapa de SVG fallback por tipo de publicación ──────────────────────────
  var FALLBACK_IMG = {
    donacion:    'assets/images/motor.svg',
    prestamo:    'assets/images/sensor.svg',
    intercambio: 'assets/images/plc.svg',
    _default:    'assets/images/transformador.svg'
  };

  // ── Referencias al DOM ────────────────────────────────────────────────────
  var gridEl      = document.getElementById('grid-publicaciones');
  var estadoEl    = document.getElementById('foro-estado');
  var filtroTipo  = document.getElementById('filtro-tipo');
  var filtroSem   = document.getElementById('filtro-semestre');
  var btnAbrir    = document.getElementById('btn-abrir-modal');
  var btnCancelar = document.getElementById('btn-cancelar-modal');
  var overlay     = document.getElementById('overlay-modal');
  var formPub     = document.getElementById('form-publicacion');
  var btnEnviar   = document.getElementById('btn-enviar-pub');
  var modalError  = document.getElementById('modal-error');

  // ── Utilidades ────────────────────────────────────────────────────────────

  function badgeClass(tipo) {
    var mapa = { donacion: 'badge--donacion', prestamo: 'badge--prestamo', intercambio: 'badge--intercambio' };
    return mapa[tipo] || '';
  }

  function badgeLabel(tipo) {
    var mapa = { donacion: 'Donación', prestamo: 'Préstamo', intercambio: 'Intercambio' };
    return mapa[tipo] || tipo;
  }

  function imagenSrc(pub) {
    if (pub.imagen_url && pub.imagen_url.trim()) return pub.imagen_url.trim();
    return FALLBACK_IMG[pub.tipo] || FALLBACK_IMG._default;
  }

  function mostrarModalError(msg) {
    modalError.textContent = msg;
    modalError.classList.add('visible');
  }

  function ocultarModalError() {
    modalError.classList.remove('visible');
  }

  // ── Renderizado de cards ──────────────────────────────────────────────────

  function renderizarCards(publicaciones) {
    gridEl.innerHTML = '';

    if (!publicaciones || publicaciones.length === 0) {
      gridEl.innerHTML = '<div class="foro-estado">No hay publicaciones que coincidan con los filtros.</div>';
      return;
    }

    publicaciones.forEach(function (pub) {
      var perfil = pub.perfiles || {};
      var card = document.createElement('div');
      card.className = 'card-pub';
      card.dataset.id = pub.id;

      card.innerHTML =
        '<img class="card-pub__imagen" src="' + imagenSrc(pub) + '" alt="' + pub.titulo + '" loading="lazy" />' +
        '<div class="card-pub__body">' +
          '<p class="card-pub__titulo">' + pub.titulo + '</p>' +
          '<p class="card-pub__desc">' + pub.descripcion + '</p>' +
          '<div class="card-pub__meta">' +
            '<span class="badge ' + badgeClass(pub.tipo) + '">' + badgeLabel(pub.tipo) + '</span>' +
            '<span>· ' + pub.estado + '</span>' +
            '<span>· ' + pub.semestre_origen + '</span>' +
          '</div>' +
          '<button class="btn-contactar" data-id="' + pub.id + '">Contactar</button>' +
          '<div class="contacto-info" id="contacto-' + pub.id + '">' +
            '<strong>' + (perfil.nombre || 'Usuario') + '</strong><br>' +
            (perfil.contacto || 'Sin información de contacto') +
          '</div>' +
        '</div>';

      gridEl.appendChild(card);
    });

    // Delegación de eventos para los botones "Contactar"
    gridEl.addEventListener('click', function (e) {
      if (!e.target.classList.contains('btn-contactar')) return;
      var id = e.target.dataset.id;
      var info = document.getElementById('contacto-' + id);
      if (info) info.classList.toggle('visible');
    });
  }

  // ── Carga de publicaciones desde ecoData (localStorage) ──────────────────

  function obtenerFiltros() {
    var filtros = {};
    if (filtroTipo.value)  filtros.tipo             = filtroTipo.value;
    if (filtroSem.value)   filtros.semestre_origen  = filtroSem.value;
    return filtros;
  }

  function cargarPublicaciones() {
    if (estadoEl) estadoEl.textContent = 'Cargando publicaciones…';

    window.ecoData.getPublicaciones(obtenerFiltros())
      .then(function (publicaciones) {
        if (estadoEl) { estadoEl.remove(); estadoEl = null; }
        renderizarCards(publicaciones);
      })
      .catch(function (err) {
        console.error('[forum.js] Error cargando publicaciones:', err);
        gridEl.innerHTML = '<div class="foro-estado">Error al cargar las publicaciones. Intenta recargar la página.</div>';
      });
  }

  // ── Creación de publicación ───────────────────────────────────────────────

  function crearPublicacion(datos) {
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Publicando…';
    ocultarModalError();

    var usuario = getUsuarioActivo();
    if (!usuario) {
      mostrarModalError('No hay sesión activa. Inicia sesión nuevamente.');
      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Publicar';
      return;
    }

    window.ecoData.insertPublicacion(datos, usuario)
      .then(function () {
        cerrarModal();
        cargarPublicaciones();
      })
      .catch(function (err) {
        mostrarModalError(err.message || 'Error al publicar. Intenta de nuevo.');
      })
      .finally(function () {
        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Publicar';
      });
  }

  // ── Modal ─────────────────────────────────────────────────────────────────

  function abrirModal() {
    formPub.reset();
    ocultarModalError();
    overlay.classList.add('activo');
  }

  function cerrarModal() {
    overlay.classList.remove('activo');
  }

  btnAbrir.addEventListener('click', abrirModal);
  btnCancelar.addEventListener('click', cerrarModal);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) cerrarModal();
  });

  formPub.addEventListener('submit', function (e) {
    e.preventDefault();

    var titulo      = document.getElementById('pub-titulo').value.trim();
    var descripcion = document.getElementById('pub-descripcion').value.trim();
    var tipo        = document.getElementById('pub-tipo').value;
    var estado      = document.getElementById('pub-estado').value;
    var semestre    = document.getElementById('pub-semestre').value;
    var imagenUrl   = document.getElementById('pub-imagen').value.trim();

    if (!titulo || !descripcion || !tipo || !estado || !semestre) {
      mostrarModalError('Por favor completa todos los campos obligatorios.');
      return;
    }

    crearPublicacion({
      titulo:          titulo,
      descripcion:     descripcion,
      tipo:            tipo,
      estado:          estado,
      semestre_origen: semestre,
      imagen_url:      imagenUrl || null
    });
  });

  // ── Filtros ───────────────────────────────────────────────────────────────

  filtroTipo.addEventListener('change', cargarPublicaciones);
  filtroSem.addEventListener('change', cargarPublicaciones);

  // ── Guardia de autenticación + arranque ───────────────────────────────────

  var usuario = getUsuarioActivo();
  if (!usuario) {
    window.location.href = 'login.html';
  } else {
    var bienvenidaEl = document.getElementById('foro-bienvenida');
    if (bienvenidaEl) {
      bienvenidaEl.textContent = 'Bienvenido, ' + (usuario.nombre || usuario.email) + '.';
    }
    cargarPublicaciones();
  }

})();

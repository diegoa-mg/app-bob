/**
 * data-demo.js — Catálogo de prueba sin backend
 * Reemplaza data.js + supabase.js para la versión demo.
 *
 * - Primer arranque: carga 8 artículos de semilla en localStorage
 * - Artículos agregados persisten entre recargas (localStorage)
 * - Expone window.ecoData con la misma interfaz que data.js original
 */

const STORAGE_KEY = 'eco_publicaciones';

const SEED_DATA = [
  {
    id: 1,
    titulo: 'Motor DC 12V en buen estado',
    descripcion: 'Motor de corriente directa 12V, torque 2.5 kg·cm. Usado en proyecto de banda transportadora del semestre pasado. Funciona perfectamente, incluye conector tipo JST.',
    tipo: 'donacion',
    estado: 'buen estado',
    semestre_origen: '6to',
    imagen_url: null,
    fecha_creacion: '2024-11-10T10:30:00Z',
    perfiles: { nombre: 'Carlos Mendoza', contacto: 'carlos.mendoza@fie.edu' }
  },
  {
    id: 2,
    titulo: 'Sensor de temperatura PT100',
    descripcion: 'Sensor RTD PT100 de 3 hilos, rango -50°C a 450°C. Calibrado y probado. Ideal para proyectos de control de temperatura industrial. Préstamo por semestre.',
    tipo: 'prestamo',
    estado: 'nuevo',
    semestre_origen: '4to',
    imagen_url: null,
    fecha_creacion: '2024-11-12T14:00:00Z',
    perfiles: { nombre: 'Ana García', contacto: 'ana.garcia@fie.edu' }
  },
  {
    id: 3,
    titulo: 'PLC Siemens S7-200',
    descripcion: 'PLC Siemens S7-200 CPU 224, 14 entradas digitales, 10 salidas digitales. Con cable de programación PC/PPI. Busco a cambio un variador de frecuencia o módulo HMI.',
    tipo: 'intercambio',
    estado: 'desgaste leve',
    semestre_origen: '8vo',
    imagen_url: null,
    fecha_creacion: '2024-11-13T09:15:00Z',
    perfiles: { nombre: 'Roberto Jiménez', contacto: 'roberto.jimenez@fie.edu' }
  },
  {
    id: 4,
    titulo: 'Transformador 220V/12V 2A',
    descripcion: 'Transformador de núcleo de hierro 220V entrada, salida 12V a 2A. Apto para fuentes de alimentación de circuitos de control. Sin uso desde que terminé el proyecto.',
    tipo: 'donacion',
    estado: 'buen estado',
    semestre_origen: '3ro',
    imagen_url: null,
    fecha_creacion: '2024-11-14T16:45:00Z',
    perfiles: { nombre: 'María López', contacto: 'maria.lopez@fie.edu' }
  },
  {
    id: 5,
    titulo: 'Multímetro digital Fluke 115',
    descripcion: 'Multímetro Fluke 115 True RMS. Mide AC/DC voltaje, corriente, resistencia, continuidad y diodos. En perfectas condiciones, con puntas de prueba originales.',
    tipo: 'prestamo',
    estado: 'nuevo',
    semestre_origen: '5to',
    imagen_url: null,
    fecha_creacion: '2024-11-15T11:00:00Z',
    perfiles: { nombre: 'Diego Herrera', contacto: 'diego.herrera@fie.edu' }
  },
  {
    id: 6,
    titulo: 'Servomotor MG996R x2',
    descripcion: 'Dos servomotores MG996R de alto torque (9.4 kg·cm). Excelente para brazos robóticos y sistemas de posicionamiento. Busco sensores ultrasónicos o cámara OV2640.',
    tipo: 'intercambio',
    estado: 'buen estado',
    semestre_origen: '7mo',
    imagen_url: null,
    fecha_creacion: '2024-11-16T08:30:00Z',
    perfiles: { nombre: 'Sofía Torres', contacto: 'sofia.torres@fie.edu' }
  },
  {
    id: 7,
    titulo: 'Kit Arduino Uno + sensores',
    descripcion: 'Arduino Uno R3 original con kit de 37 sensores: temperatura, humedad, IR, ultrasonido, gas, lluvia, joystick y más. Ideal para practicar prototipos en semestres iniciales.',
    tipo: 'donacion',
    estado: 'buen estado',
    semestre_origen: '2do',
    imagen_url: null,
    fecha_creacion: '2024-11-17T13:20:00Z',
    perfiles: { nombre: 'Luis Ramírez', contacto: 'luis.ramirez@fie.edu' }
  },
  {
    id: 8,
    titulo: 'Osciloscopio Rigol DS1054Z',
    descripcion: 'Osciloscopio digital 4 canales, 50MHz, pantalla 7". Con sondas x1/x10. Disponible para préstamo en periodos de examen. Coordinar horario con anticipación.',
    tipo: 'prestamo',
    estado: 'buen estado',
    semestre_origen: '9no',
    imagen_url: null,
    fecha_creacion: '2024-11-18T10:00:00Z',
    perfiles: { nombre: 'Paola Vega', contacto: 'paola.vega@fie.edu' }
  }
];

/** Carga publicaciones desde localStorage; si no hay, siembra los datos iniciales. */
function cargarDesdeStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // Si el JSON está corrupto, comenzar de cero
    }
  }
  // Primera vez: sembrar datos iniciales
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
  return SEED_DATA.slice();
}

/** Guarda el array actual en localStorage. */
function persistir(publicaciones) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(publicaciones));
}

/** Devuelve el siguiente ID disponible. */
function siguienteId(publicaciones) {
  if (publicaciones.length === 0) return 1;
  return Math.max(...publicaciones.map(p => p.id)) + 1;
}

// ---------------------------------------------------------------------------
// Inicialización
// ---------------------------------------------------------------------------

const _publicaciones = cargarDesdeStorage();

window.ecoData = {
  publicaciones: _publicaciones,

  /**
   * Devuelve las publicaciones filtradas como Promise (para compatibilidad con forum.js).
   * @param {{ tipo?: string, semestre_origen?: string }} [filtros]
   * @returns {Promise<Array>}
   */
  getPublicaciones(filtros = {}) {
    let resultado = this.publicaciones.slice();

    if (filtros.tipo) {
      resultado = resultado.filter(p => p.tipo === filtros.tipo);
    }
    if (filtros.semestre_origen) {
      resultado = resultado.filter(p => p.semestre_origen === filtros.semestre_origen);
    }

    // Orden descendente por fecha_creacion (más recientes primero)
    resultado.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));

    return Promise.resolve(resultado);
  },

  /**
   * Inserta una nueva publicación en localStorage.
   * @param {{ titulo: string, descripcion: string, tipo: string, estado: string, semestre_origen: string, imagen_url?: string }} datos
   * @param {{ id: string, nombre: string, contacto: string }} usuario
   * @returns {Promise<Object>} La publicación creada
   */
  insertPublicacion(datos, usuario) {
    const nueva = {
      id: siguienteId(this.publicaciones),
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      tipo: datos.tipo,
      estado: datos.estado,
      semestre_origen: datos.semestre_origen,
      imagen_url: datos.imagen_url || null,
      fecha_creacion: new Date().toISOString(),
      perfiles: {
        nombre: usuario?.nombre || 'Estudiante Demo',
        contacto: usuario?.contacto || usuario?.email || 'demo@fie.edu'
      }
    };

    this.publicaciones.unshift(nueva);
    persistir(this.publicaciones);
    return Promise.resolve(nueva);
  },

  /**
   * Agrega una publicación al array local (compatibilidad con data.js original).
   * @param {Object} pub
   * @param {boolean} [persistir_=true]
   */
  addPublicacion(pub, persistir_ = true) {
    this.publicaciones.unshift(pub);
    if (persistir_) persistir(this.publicaciones);
  }
};

// Despachar evento de datos listos (compatibilidad con forum.js)
document.addEventListener('DOMContentLoaded', () => {
  document.dispatchEvent(new Event('ecoDataReady'));
});

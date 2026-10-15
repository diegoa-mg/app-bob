# Plan de Trabajo — Renova

## Resumen General

**Objetivo:** Desarrollar una aplicación web que permita a los estudiantes de la Facultad de Ingeniería Electromecánica (FIE) donar, prestar e intercambiar componentes electromecánicos de proyectos anteriores, promoviendo la conciencia ambiental y la reducción de residuos.

**Alcance:** Frontend estático con HTML, CSS y JavaScript Vanilla (ES6+). Backend y persistencia real provistos por **Supabase** (PostgreSQL gestionado en la nube). La comunicación entre el frontend y Supabase se realiza mediante llamadas `fetch()` a la API REST de Supabase directamente desde el navegador.

**Stack:**
- **Frontend:** HTML5, CSS3, JavaScript Vanilla (ES6+)
- **Backend / Base de datos:** Supabase (PostgreSQL + API REST + Auth integrada)
- **Autenticación:** Supabase Auth (email/password)
- **Dependencias externas opcionales:** Font Awesome CDN (íconos)

**Fuera de alcance:** Servidor PHP propio, registro público libre de usuarios (solo el administrador crea cuentas en Supabase), pagos, subida de archivos binarios.

---

## Arquitectura General

```
Navegador (HTML + CSS + JS Vanilla)
        │
        │  fetch() con API Key y JWT
        ▼
  Supabase Cloud
  ├── Auth          → Autenticación email/password, JWT
  ├── Database      → PostgreSQL: tablas usuarios, publicaciones
  └── REST API      → Endpoints auto-generados por tabla
```

---

## Estructura del Proyecto

```
renova/
├── index.html          # Landing page
├── login.html          # Login real (Supabase Auth)
├── forum.html          # Foro de publicaciones
├── about.html          # Sobre nosotros
├── stats.html          # Estadísticas de impacto
├── css/
│   └── styles.css      # Estilos globales
├── js/
│   ├── supabase.js     # Inicialización del cliente Supabase (URL + anon key)
│   ├── auth.js         # Login, logout y verificación de sesión con Supabase Auth
│   ├── forum.js        # CRUD de publicaciones via API REST de Supabase
│   ├── stats.js        # Consulta de conteos desde Supabase para métricas
│   └── nav.js          # Navegación y estado de sesión (JWT)
└── assets/
    └── images/         # Imágenes estáticas de UI
```

> **Nota:** Ya no existe la carpeta `data/` ni el archivo `data.json`. Los datos residen en Supabase.

---

## Sub-Tareas

---

### ST-0 — Configuración de Supabase y diseño del esquema de base de datos

**Status:** `[ ] pending`

**Intent:**
Preparar el entorno de Supabase antes de escribir cualquier línea de código frontend. Esta sub-tarea define la base de toda la persistencia real de la aplicación.

**Expected Outcomes:**
- Proyecto Supabase creado y accesible con URL y `anon key`.
- Tabla `perfiles` creada (extiende la tabla interna `auth.users` de Supabase).
- Tabla `publicaciones` creada con todos los campos necesarios.
- Políticas RLS (Row Level Security) configuradas: solo usuarios autenticados pueden leer; solo el autor puede insertar/editar sus propias publicaciones.
- Al menos 3 usuarios de prueba creados desde el panel de Supabase Auth.
- Al menos 10 publicaciones de datos de prueba insertadas directamente en el editor SQL de Supabase.
- Archivo `js/supabase.js` creado con la inicialización del cliente usando la URL y anon key del proyecto.

**Todo List:**
1. Crear una cuenta en [supabase.com](https://supabase.com) y crear un nuevo proyecto.
2. Diseñar y ejecutar el SQL para crear la tabla `perfiles`: `{ id (uuid, FK auth.users), nombre, semestre, carrera, contacto }`.
3. Diseñar y ejecutar el SQL para crear la tabla `publicaciones`: `{ id, titulo, descripcion, tipo, imagen_url, estado, semestre_origen, usuario_id (FK perfiles), fecha_creacion }`.
4. Habilitar RLS en ambas tablas y crear las políticas de acceso.
5. Crear los 3 usuarios de prueba desde Supabase Dashboard → Authentication → Users.
6. Insertar los datos de prueba (10+ publicaciones) usando el editor SQL del panel.
7. Crear `js/supabase.js` con la URL del proyecto y la `anon key` pública.

**Relevant Context:**
- La `anon key` de Supabase es pública y segura para usarse en el frontend, siempre que RLS esté correctamente configurado.
- Tipos de publicación: `'donacion'`, `'prestamo'`, `'intercambio'`
- Estados del componente: `'nuevo'`, `'buen estado'`, `'desgaste leve'`, `'para repuesto'`
- La tabla `perfiles` se llena automáticamente con un trigger de Supabase al crear un usuario nuevo en Auth.

---

### ST-1 — Estructura base y estilos globales

**Status:** `[ ] pending`

**Intent:**
Crear el esqueleto del proyecto: estructura de carpetas, archivos HTML vacíos con su estructura base y los estilos CSS globales con paleta de colores ecológica. Esta sub-tarea ya no incluye la creación del `data.json`.

**Expected Outcomes:**
- Estructura de carpetas y archivos HTML con cabecera, navbar placeholder y footer.
- `styles.css` con variables CSS, reset, tipografía, paleta verde/ecológica y componentes base (botones, cards, navbar, badges, modal).
- `js/supabase.js` ya disponible (viene de ST-0) y referenciado en todos los HTML.

**Todo List:**
1. Crear la estructura de carpetas del proyecto.
2. Crear `css/styles.css` con variables de color, tipografía y componentes base reutilizables.
3. Crear los 5 archivos HTML con estructura base (head con scripts, navbar placeholder, footer).
4. Referenciar `js/supabase.js` en el `<head>` de todos los HTML como primer script.

**Relevant Context:**
- `js/supabase.js` debe cargarse antes que cualquier otro script JS en todos los HTML.
- Paleta sugerida: verde primario `#2e7d32`, verde claro `#81c784`, neutros grises.

---

### ST-2 — Landing Page (index.html)

**Status:** `[ ] pending`

**Intent:**
Crear la página de entrada de la aplicación. Debe comunicar la misión del proyecto, invitar al login y presentar los tres tipos de publicación.

**Expected Outcomes:**
- Hero section con nombre, slogan y botón "Comenzar" que lleva a `login.html`.
- Sección "¿Cómo funciona?" con los 3 tipos de publicación (íconos + descripción breve).
- Sección de llamado a la acción con acceso al foro.
- Navbar y footer con información de la institución.

**Todo List:**
1. Construir la navbar con logo, nombre de la app y links de navegación.
2. Construir el hero section (imagen de fondo, titular, slogan, CTA hacia `login.html`).
3. Construir la sección "¿Cómo funciona?" con cards de los 3 tipos.
4. Construir el footer.
5. Vincular `css/styles.css` y asegurar responsividad básica.

**Relevant Context:**
- Si el usuario ya tiene una sesión JWT activa de Supabase (verificada en `auth.js`), el botón CTA puede redirigir directamente a `forum.html`.

---

### ST-3 — Autenticación Real (login.html + auth.js)

**Status:** `[ ] pending`

**Intent:**
Implementar el login y logout reales usando Supabase Auth. El usuario introduce su email y contraseña; Supabase valida y devuelve un JWT que se usa en todas las llamadas posteriores a la API.

**Expected Outcomes:**
- Formulario de login con campos email y contraseña.
- Llamada a `supabase.auth.signInWithPassword()` al enviar el formulario.
- Mensaje de error visible si las credenciales son incorrectas (manejando la respuesta de error de Supabase).
- Redirección automática a `forum.html` tras login exitoso.
- Si ya hay sesión activa (`supabase.auth.getSession()`), redirigir directamente al foro.
- Función `logout()` que llama a `supabase.auth.signOut()` y redirige a `index.html`.
- Navbar muestra nombre del usuario y botón "Cerrar sesión" cuando hay sesión activa.

**Todo List:**
1. Crear `login.html` con formulario estilizado (campos email y contraseña).
2. Crear `js/auth.js` con la función `login(email, password)` que usa `supabase.auth.signInWithPassword()`.
3. Manejar el error de Supabase y mostrarlo al usuario en español.
4. Guardar la sesión: Supabase la persiste automáticamente en `localStorage`; no se requiere manejo manual.
5. Redirigir a `forum.html` tras login exitoso.
6. Implementar `logout()` que llama a `supabase.auth.signOut()` y redirige.
7. En `js/nav.js`, usar `supabase.auth.getSession()` para leer la sesión y actualizar la navbar.
8. En `forum.html` y `stats.html`, verificar sesión al cargar; si no existe, redirigir a `login.html`.

**Relevant Context:**
- Supabase persiste el JWT en `localStorage` automáticamente; no es necesario escribirlo manualmente.
- Las contraseñas ya NO están en texto plano en ningún archivo del proyecto.
- Los usuarios de prueba fueron creados en ST-0 con sus emails y contraseñas.

---

### ST-4 — Foro de Publicaciones (forum.html + forum.js)

**Status:** `[ ] pending`

**Intent:**
Es el núcleo de la aplicación. Carga las publicaciones reales desde Supabase, permite filtrarlas, y permite crear nuevas publicaciones que se persisten en la base de datos.

**Expected Outcomes:**
- Grid de cards con publicaciones leídas desde la tabla `publicaciones` de Supabase.
- Filtros funcionales por tipo y semestre (filtrado en la consulta a Supabase con parámetros de query).
- Botón "Publicar oferta" que abre un formulario modal.
- Al enviar el formulario, la publicación se inserta en Supabase (`INSERT`) y la lista se recarga.
- Botón "Contactar" que muestra nombre y contacto del publicador (join con tabla `perfiles`).
- Badges visuales de color por tipo de publicación.

**Todo List:**
1. Crear la estructura HTML del foro con área de filtros y área de grid de cards.
2. En `forum.js`, crear función `cargarPublicaciones(filtros)` que hace `GET` a la API REST de Supabase con los filtros activos.
3. Renderizar las publicaciones como cards dinámicamente desde la respuesta JSON de Supabase.
4. Implementar los filtros de tipo y semestre; cada cambio en los selectores llama de nuevo a `cargarPublicaciones()`.
5. Crear el modal "Nueva Publicación" con el formulario completo.
6. Implementar `crearPublicacion(datos)` que hace `POST` a Supabase con el JWT del usuario autenticado; asignar `usuario_id` desde la sesión activa.
7. Tras inserción exitosa, cerrar el modal y recargar la lista de publicaciones.
8. Implementar el botón "Contactar" que muestra datos del perfil del publicador.
9. Aplicar badges de color por tipo.

**Relevant Context:**
- La API REST de Supabase permite filtros con parámetros de query: `?tipo=eq.donacion&semestre_origen=eq.4to`.
- El `usuario_id` de la nueva publicación se obtiene de `supabase.auth.getUser()`.
- La persistencia es **real**: las publicaciones nuevas sobreviven al recargar la página.
- Las imágenes siguen referenciándose por URL (no hay subida de archivos binarios en este alcance).

---

### ST-5 — Estadísticas de Impacto (stats.html + stats.js)

**Status:** `[ ] pending`

**Intent:**
Mostrar métricas de impacto ambiental calculadas a partir de los datos reales en Supabase. Los contadores reflejan el estado actual de la base de datos.

**Expected Outcomes:**
- Contadores con totales reales: total de publicaciones, donaciones, préstamos, intercambios.
- Estimación de CO₂ evitado calculada desde el total real.
- Estimación de residuos evitados calculada desde el total real.
- Visualización gráfica de distribución por tipo (barras CSS).
- Mensaje motivacional según el total.

**Todo List:**
1. Crear `stats.html` con la estructura de secciones de métricas.
2. En `js/stats.js`, crear función `cargarEstadisticas()` que consulta Supabase con `select=count` agrupado por tipo.
3. Calcular CO₂ evitado: `total_publicaciones × 0.5 kg`.
4. Calcular residuos evitados: `total_publicaciones × 0.3 kg`.
5. Renderizar los contadores con animación de incremento al cargar.
6. Crear el gráfico de barras CSS con los porcentajes reales de cada tipo.

**Relevant Context:**
- Supabase REST permite contar filas con `select=*&tipo=eq.donacion` y revisando el header `Content-Range` o usando funciones RPC.
- Los valores de CO₂ y residuos son estimaciones educativas; deben marcarse como tal en la UI.
- Esta vista requiere sesión activa (verificar al cargar).

---

### ST-6 — Sobre Nosotros (about.html)

**Status:** `[ ] pending`

**Intent:**
Página estática informativa sobre el origen del proyecto, la misión ecológica y el equipo.

**Expected Outcomes:**
- Sección de misión y visión del proyecto.
- Sección "Nuestro equipo" con cards de los integrantes (datos hardcodeados en HTML).
- Sección de contexto institucional.
- Diseño coherente con el resto de la aplicación.

**Todo List:**
1. Crear `about.html` con las tres secciones descritas.
2. Agregar cards de integrantes (nombre, rol, semestre) hardcodeados en HTML.
3. Redactar texto de misión, visión y contexto.
4. Asegurar consistencia visual con el resto del sitio.

**Relevant Context:**
- Esta página no realiza ninguna llamada a Supabase; es completamente estática.

---

### ST-7 — Revisión final, responsividad y pruebas de integración

**Status:** `[ ] pending`

**Intent:**
Asegurar que toda la aplicación funcione correctamente de extremo a extremo con la base de datos real, que sea responsiva y que no haya errores de integración con Supabase.

**Expected Outcomes:**
- Todas las páginas se renderizan correctamente en móvil (320px+) y escritorio.
- El flujo completo funciona: landing → login real → foro (datos reales) → filtrar → publicar (persiste) → estadísticas (datos reales).
- Las publicaciones creadas sobreviven al recargar la página.
- Sin errores en consola del navegador (ni errores 4xx/5xx de la API de Supabase).
- `README.md` con instrucciones de configuración, credenciales de prueba y URL del proyecto Supabase.

**Todo List:**
1. Revisar y ajustar responsividad con media queries en `styles.css`.
2. Probar el flujo completo: login → publicar → verificar en Supabase Dashboard → recargar → confirmar persistencia.
3. Verificar que RLS bloquea correctamente accesos no autenticados (probar sin sesión activa).
4. Corregir errores de consola y errores de API.
5. Crear `README.md` con: instrucciones de uso, emails y contraseñas de prueba, URL del proyecto Supabase.
6. Verificar coherencia de paleta, tipografía y espaciados en las 5 vistas.

---

## Flujo de Usuario Principal

```
Landing (index.html)
    └─► Login (login.html)  ─► Supabase Auth (JWT real)
            └─► Foro (forum.html)  ─► Supabase DB (datos reales)
                    ├─► Ver publicaciones  [GET /publicaciones]
                    ├─► Filtrar            [GET /publicaciones?tipo=eq.donacion]
                    ├─► Publicar oferta    [POST /publicaciones + JWT]
                    └─► Ver contacto       [JOIN con perfiles]
Navbar siempre visible:
    ├─► Inicio (index.html)
    ├─► Foro (forum.html)      [protegida: requiere JWT válido]
    ├─► Estadísticas (stats.html)  [protegida: requiere JWT válido]
    ├─► Sobre Nosotros (about.html)
    └─► Cerrar Sesión          [supabase.auth.signOut()]
```

---

## Credenciales de Prueba (creadas en Supabase Auth — ST-0)

| Email | Contraseña | Semestre |
|---|---|---|
| jperez@fie.edu | (definir en ST-0) | 6to |
| mlopez@fie.edu | (definir en ST-0) | 4to |
| csanchez@fie.edu | (definir en ST-0) | 8vo |

> Las contraseñas definitivas se establecen al crear los usuarios en el panel de Supabase durante ST-0 y se documentan en el `README.md`.

---

## Cambios Respecto a la Versión Original del Plan

| Elemento | Plan Original | Plan Actualizado |
|---|---|---|
| Persistencia | `data.json` estático | PostgreSQL en Supabase |
| Autenticación | Contraseñas en texto plano en JSON | Supabase Auth (JWT real) |
| Nuevas publicaciones | Solo en memoria (se pierden al recargar) | Persisten en base de datos real |
| Estadísticas | Calculadas desde array JS local | Calculadas desde consultas reales a Supabase |
| `data.js` | Módulo de gestión del JSON | ❌ Eliminado (reemplazado por `supabase.js`) |
| `auth.js` | Comparación manual en array JS | Usa `supabase.auth.signInWithPassword()` |
| Nueva sub-tarea | — | ST-0: Configuración de Supabase y esquema de BD |


---

## Setup local — cómo correr el proyecto

> **Requisitos:** Solo un browser. No se necesita Node, npm ni servidor.

1. Clona el repo:
   ```bash
   git clone https://github.com/diegoa-mg/app-bob.git
   cd app-bob
   ```

2. Crea tu archivo de credenciales locales:
   ```bash
   cp js/config.example.js js/config.js
   ```

3. Abre `js/config.js` y reemplaza los valores con las credenciales reales de Supabase.  
   Pídelas al responsable del proyecto (**Fer**).

4. Abre `index.html` en el browser (o usa **Live Server** en VS Code).

> `js/config.js` está en `.gitignore` — **nunca lo subas al repo**.

---

## Orden de scripts en cada página HTML

Todas las páginas deben incluir los scripts en este orden antes de su módulo propio:

```html
<script src="js/config.js"></script>
<script src="js/supabase.js"></script>
<script src="js/data.js"></script>
<script src="js/[modulo-de-la-vista].js"></script>
```

## Cómo consumir los datos desde cualquier módulo JS

```js
document.addEventListener('ecoDataReady', function () {
  // window.ecoData.publicaciones — array con todas las publicaciones
  // window.ecoData.usuarios      — array con todos los usuarios
  console.log(window.ecoData.publicaciones);
});
```
=======


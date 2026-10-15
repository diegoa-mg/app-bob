# Plan — ST-4: Foro de Publicaciones (forum.html + forum.js)

## Resumen General

**Objetivo:** Implementar el núcleo funcional de la aplicación: el foro de publicaciones. Lee publicaciones reales desde Supabase, las renderiza como cards con badges visuales, permite filtrarlas por tipo y semestre, abre un modal para crear nuevas publicaciones persistidas en Supabase, y muestra datos de contacto del publicador vía JOIN.

**Restricciones:**
- `forum.html` ya tiene estructura base con estilos inline — se extiende, no se reescribe.
- `js/auth.js` migrado a Supabase Auth es responsabilidad del equipo backend; ST-4 asume que `getSession()` ya funciona y devuelve un objeto con `user.id` y `user.email`.
- Sin subida de archivos binarios: el campo `imagen_url` acepta solo una URL de texto.
- La ruta de scripts en `forum.html` usa `../js/` — debe corregirse a `js/`.

**Schema de base de datos confirmado (Supabase):**
- Tabla `publicaciones`: `id` (int4), `titulo` (text), `descripcion` (text), `tipo` (text), `imagen_url` (text), `estado` (text), `semestre_origen` (text), `usuario_id` (uuid, FK → perfiles.id), `fecha_creacion` (timestamptz)
- Tabla `perfiles`: `id` (uuid, FK → auth.users.id), `nombre` (text), `semestre` (text), `carrera` (text), `contacto` (text)

**Dependencias previas requeridas:**
- `js/config.js` con credenciales Supabase (ya existe).
- `js/supabase.js` con `ecoSupabase.getPublicaciones()`, `getUsuarios()`, `insertPublicacion()` (ya existe).
- `js/data.js` con `window.ecoData` y evento `ecoDataReady` (ya existe).
- `js/auth.js` migrado a Supabase Auth con `getSession()` disponible (responsabilidad del equipo backend).
- Tablas `publicaciones` y `perfiles` creadas en Supabase (ya confirmadas en el diagrama).

---

## Sub-Tareas

---

### ST-4.1 — Corregir estructura base de forum.html y scripts

**Status:** `[x] done`

**Intent:**
El `forum.html` actual tiene rutas de scripts rotas (`../js/`) y no carga `config.js`, `supabase.js` ni `data.js`. Antes de agregar cualquier lógica del foro, la página debe cargar correctamente su cadena de dependencias.

**Expected Outcomes:**
- Las rutas de todos los `<script>` en `forum.html` apuntan a `js/` (sin `../`).
- La cadena de scripts en `forum.html` sigue el orden establecido: `config.js` → `supabase.js` → `data.js` → `auth.js` → `nav.js` → `forum.js`.
- La página se abre sin errores de red en la consola del navegador.

**Todo List:**
1. Corregir las tres rutas de scripts en `forum.html`: cambiar `../js/auth.js`, `../js/nav.js`, `../js/forum.js` por `js/auth.js`, `js/nav.js`, `js/forum.js`.
2. Agregar antes de esos scripts (en orden): `<script src="js/config.js">`, `<script src="js/supabase.js">`, `<script src="js/data.js">`.

**Relevant Context:**
- Archivo a modificar: `forum.html` líneas 116-118.
- El orden de scripts es crítico: `config.js` debe ir primero porque `supabase.js` lee `window.SUPABASE_URL` y `window.SUPABASE_KEY`.

---

### ST-4.2 — Ampliar js/supabase.js con soporte para filtros y JOIN con perfiles

**Status:** `[x] done`

**Intent:**
La función `getPublicaciones()` existente en `js/supabase.js` trae todas las publicaciones sin filtros y sin datos del publicador. Para el foro se necesita: filtrar por tipo y/o semestre, y obtener el nombre y contacto del publicador en la misma query (JOIN con `perfiles`).

**Expected Outcomes:**
- `ecoSupabase.getPublicaciones(filtros)` acepta un objeto `{ tipo, semestre }` opcional y construye los query params correctos para la API REST de Supabase.
- La misma función hace JOIN con `perfiles` para traer `nombre` y `contacto` del publicador en el mismo request (`select=*,perfiles(nombre,contacto)`).
- Si no se pasan filtros, trae todas las publicaciones (comportamiento actual conservado).

**Todo List:**
1. Modificar `getPublicaciones(filtros)` en `js/supabase.js` para construir dinámicamente los query params de filtro (`tipo=eq.X`, `semestre_origen=eq.Y`).
2. Cambiar el `select` de `*` a `*,perfiles(nombre,contacto)` para incluir el JOIN con la tabla `perfiles`.
3. Mantener el `order=fecha_creacion.desc` (o el campo de fecha real de la tabla).

**Relevant Context:**
- API REST de Supabase soporta filtros como query params: `?tipo=eq.donacion&semestre_origen=eq.4to`.
- El JOIN embedded se declara en el `select`: `select=*,perfiles(nombre,contacto)`.
- El campo de fecha en la tabla es **`fecha_creacion`** (timestamptz) — confirmado en el schema.
- Archivo a modificar: `js/supabase.js`, función `getPublicaciones` (línea 39-41).

---

### ST-4.3 — Estructura HTML del foro: filtros, grid de cards y modal

**Status:** `[x] done`

**Intent:**
Reemplazar el `<div class="foro-placeholder">` actual por la estructura completa del foro: barra de filtros, botón "Publicar oferta", grid donde se renderizarán las cards dinámicamente, y el HTML del modal de nueva publicación.

**Expected Outcomes:**
- `forum.html` tiene una barra de filtros con dos `<select>` (tipo y semestre) y un botón "Publicar oferta".
- Existe un `<div id="grid-publicaciones">` vacío donde `forum.js` inyectará las cards.
- El modal de nueva publicación existe en el HTML con los campos: título, descripción, tipo, estado, semestre de origen, URL de imagen. Está oculto por defecto.
- Los estilos del modal, filtros, grid, cards y badges se agregan inline en el `<style>` existente de `forum.html`.

**Todo List:**
1. En `forum.html`, reemplazar `<div class="foro-placeholder">` por la estructura de filtros + botón "Publicar oferta" + `<div id="grid-publicaciones">`.
2. Agregar al `<style>` existente: estilos para `.filtros-bar`, `.grid-publicaciones`, `.card-pub`, `.badge` (con variantes `.badge--donacion`, `.badge--prestamo`, `.badge--intercambio`), y el overlay/modal.
3. Agregar al final del `<main>` el HTML del modal: overlay, formulario con los campos requeridos, botón "Publicar" y botón "Cancelar".

**Relevant Context:**
- Colores de badges están definidos en `css/styles.css` como variables: `--badge-donacion-bg`, `--badge-prestamo-bg`, `--badge-intercambio-bg`. Usarlos si se importa `styles.css`; de lo contrario definirlos inline con los valores del archivo (`#e8f5e9`, `#eef0fb`, `#f3eefb`).
- El modal debe estar oculto por defecto (display:none en el overlay).
- El grid debe ser responsive: mínimo 1 columna en móvil, 2-3 columnas en escritorio.

---

### ST-4.4 — Implementar forum.js: renderizado, filtros y creación

**Status:** `[x] done`

**Intent:**
Implementar toda la lógica del foro en `js/forum.js`: proteger la página con auth, esperar `ecoDataReady`, renderizar las publicaciones como cards, conectar los filtros, y gestionar el modal de nueva publicación.

**Expected Outcomes:**
- Al cargar el foro, se llama `cargarPublicaciones()` que hace GET a Supabase y renderiza las cards.
- Cada card muestra: imagen (con fallback a `assets/images/` si no hay URL), título, descripción truncada, badge de tipo, estado, semestre de origen y un botón/sección "Contactar".
- Al hacer clic en "Contactar", la card expande o muestra un área con nombre y contacto del publicador (datos del JOIN con `perfiles`).
- Los filtros de tipo y semestre llaman a `cargarPublicaciones(filtros)` en cada cambio.
- El botón "Publicar oferta" abre el modal.
- Al enviar el formulario del modal, se llama `crearPublicacion(datos)` que usa `ecoSupabase.insertPublicacion()` con el `usuario_id` de la sesión activa, cierra el modal y recarga la lista.
- Si no hay sesión, se redirige a `login.html` antes de hacer nada más.

**Todo List:**
1. Al inicio de `forum.js`, verificar sesión con `getSession()` (de `auth.js`); si no hay sesión, redirigir a `login.html`.
2. Escuchar el evento `ecoDataReady` y llamar `cargarPublicaciones()` cuando dispare.
3. Implementar `cargarPublicaciones(filtros)`: llama `ecoSupabase.getPublicaciones(filtros)`, luego llama `renderizarCards(publicaciones)`.
4. Implementar `renderizarCards(publicaciones)`: genera el HTML de cada card e inyecta en `#grid-publicaciones`. Para imágenes: usar `imagen_url` si existe, sino mapear el tipo a un SVG fallback de `assets/images/`.
5. Implementar la sección expandible "Contactar" en cada card: al hacer clic en el botón, mostrar/ocultar un `<div>` con los datos del perfil (`pub.perfiles.nombre`, `pub.perfiles.contacto`).
6. Conectar los `<select>` de filtro con `cargarPublicaciones()` via `addEventListener('change', ...)`.
7. Implementar la apertura/cierre del modal con el botón "Publicar oferta" y el botón "Cancelar".
8. Implementar `crearPublicacion(datos)`: obtener `usuario_id` desde `getSession().user.id`, llamar `ecoSupabase.insertPublicacion(datos)`, manejar error mostrando mensaje al usuario, y en éxito cerrar modal y llamar `cargarPublicaciones()`.

**Relevant Context:**
- `forum.js` ya existe con solo la guardia de auth y el saludo — se reemplaza por completo.
- `ecoSupabase` es el objeto global de `js/supabase.js`.
- `ecoData` con el evento `ecoDataReady` viene de `js/data.js`.
- SVG fallbacks disponibles: `assets/images/motor.svg`, `sensor.svg`, `plc.svg`, `servo.svg`, `transformador.svg`.
- El campo `usuario_id` en `publicaciones` es **uuid** — se obtiene de `getSession().user.id`.
- `getSession()` contrato: retorna Promise → `{ user: { id, email } }` o `null`. Si `auth.js` lo implementa diferente, adaptar al recibir el código.
- Semestres fijos para el filtro: `1ro`, `2do`, `3ro`, `4to`, `5to`, `6to`, `7mo`, `8vo`, `9no`, `10mo`.
- El JOIN en la query REST quedará: `select=*,perfiles(nombre,contacto)` con FK `publicaciones.usuario_id → perfiles.id`.

---

## Flujo de datos del foro

```
forum.html carga
    → config.js → supabase.js → data.js (dispara ecoDataReady) → auth.js → nav.js → forum.js
forum.js
    → verifica sesión (getSession)
    → escucha ecoDataReady
    → cargarPublicaciones(filtros)
        → ecoSupabase.getPublicaciones(filtros)  [GET Supabase + JOIN perfiles]
        → renderizarCards(publicaciones)          [inyecta HTML en #grid-publicaciones]
Filtros
    → onChange → cargarPublicaciones(filtros actuales)
Modal nueva publicación
    → crearPublicacion(datos)
        → getSession().user.id → ecoSupabase.insertPublicacion(datos)
        → cerrar modal → cargarPublicaciones()
```

---

## Archivos que se modifican

| Archivo | Tipo de cambio |
|---|---|
| `forum.html` | Extender: corregir scripts, agregar estructura HTML y estilos inline |
| `js/supabase.js` | Extender: modificar `getPublicaciones` para filtros + JOIN |
| `js/forum.js` | Reemplazar: implementación completa de la lógica del foro |

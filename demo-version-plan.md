# Plan: Versión Demo sin Backend (Supabase-free)

## Overview

Eliminar completamente Supabase, `config.js`, y toda la lógica de base de datos.
Reemplazar con módulos JavaScript 100% en frontend que usan `sessionStorage` para
autenticación y `localStorage` para persistencia del catálogo.

El foro debe funcionar tal como está — mismo diseño, mismos filtros, misma modal de
publicación — pero sin ninguna llamada a red externa.

**Credenciales de prueba:** `demo@fie.edu` / `demo1234`

**Alcance:**
- `login.html` — auth hardcodeada, sin Supabase SDK
- `forum.html` — catálogo, filtros, modal de publicación, sin Supabase
- `js/auth-demo.js` — reemplaza `auth.js` + `supabase.js` para autenticación
- `js/data-demo.js` — reemplaza `data.js` + `supabase.js` para datos del catálogo
- `js/forum.js` — actualizar referencias para usar los nuevos módulos
- `js/nav.js` — actualizar para usar `auth-demo.js`
- `index.html` — remover referencias a Supabase, links de auth apuntan a login

**No-alcance:**
- No cambiar el diseño visual (CSS no se toca)
- No cambiar `about.html` (es estático y no usa Supabase)
- No eliminar `index.html` (landing page, no usa Supabase directamente)
- No implementar registro de usuario (solo login de prueba)

---

## Sub-Tarea 1: Crear `js/auth-demo.js`

**Status:** [ ] pending

**Intent:**
Reemplazar toda la lógica de `auth.js` y la parte de auth de `supabase.js` con un módulo
que valide contra credenciales hardcodeadas y maneje la sesión con `sessionStorage`.

**Expected Outcomes:**
- `login('demo@fie.edu', 'demo1234')` devuelve `{ ok: true }`
- Cualquier otra combinación devuelve `{ ok: false, mensaje: 'Credenciales incorrectas' }`
- `getUsuarioActivo()` devuelve el objeto de usuario desde `sessionStorage` o `null`
- `logout()` limpia `sessionStorage` y redirige a `index.html`
- `requireAuth()` redirige a `login.html` si no hay sesión activa
- El módulo expone las mismas funciones que `auth.js` original para compatibilidad

**Todo List:**
- [ ] Crear `js/auth-demo.js` con las funciones: `login()`, `logout()`, `getUsuarioActivo()`, `requireAuth()`
- [ ] Definir usuario de prueba: `{ id: 'demo-001', email: 'demo@fie.edu', nombre: 'Estudiante Demo' }`
- [ ] `login()` es síncrono (devuelve objeto directo, no Promise) — o usa Promise resuelta para compatibilidad
- [ ] `logout()` limpia `sessionStorage('eco_user')` y redirige a `index.html`

**Relevant Context:**
- `js/auth.js` — funciones originales a replicar (misma API pública)
- SESSION_KEY = `'eco_user'` (mantener igual para compatibilidad con `nav.js`)

---

## Sub-Tarea 2: Crear `js/data-demo.js`

**Status:** [ ] pending

**Intent:**
Reemplazar `data.js` y `supabase.js` con un módulo que maneje el catálogo completamente
en `localStorage`. Incluir ~8 artículos iniciales de semilla para que el foro no aparezca
vacío la primera vez.

**Expected Outcomes:**
- Al cargar la página por primera vez, el foro muestra 8+ artículos de prueba
- `getPublicaciones(filtros)` devuelve array filtrado por `tipo` y/o `semestre_origen`
- `insertPublicacion(data)` guarda en `localStorage` y retorna el artículo creado
- Los artículos persisten tras recargar la página (localStorage)
- Si ya hay datos en localStorage, NO sobreescribir con los de semilla
- El módulo expone `window.ecoData` con la misma interfaz que `data.js` original

**Todo List:**
- [ ] Crear `js/data-demo.js`
- [ ] Definir array `SEED_DATA` con 8 artículos falsos:
  - Motor DC 12V (donacion, 6to, buen estado, publicador: "Carlos Mendoza")
  - Sensor PT100 (prestamo, 4to, nuevo, publicador: "Ana García")
  - PLC Siemens S7-200 (intercambio, 8vo, desgaste leve, publicador: "Roberto Jiménez")
  - Transformador 220V/12V (donacion, 3ro, buen estado, publicador: "María López")
  - Multímetro digital Fluke (prestamo, 5to, nuevo, publicador: "Diego Herrera")
  - Servomotor MG996R (intercambio, 7mo, buen estado, publicador: "Sofía Torres")
  - Arduino Uno + kit sensores (donacion, 2do, buen estado, publicador: "Luis Ramírez")
  - Osciloscopio Rigol DS1054Z (prestamo, 9no, buen estado, publicador: "Paola Vega")
- [ ] Cada artículo tiene: `id`, `titulo`, `descripcion`, `tipo`, `estado`, `semestre_origen`, `imagen_url: null`, `fecha_creacion`, `perfiles: { nombre, contacto }`
- [ ] `getPublicaciones(filtros)` — filtrar en memoria, devolver como Promise resuelta para compatibilidad
- [ ] `insertPublicacion(data)` — asignar id auto-incremental, `fecha_creacion` actual, `perfiles` del usuario activo, guardar en localStorage
- [ ] `window.ecoData.publicaciones` — array en memoria sincronizado con localStorage
- [ ] Despachar evento `'ecoDataReady'` después de cargar (compatibilidad con forum.js)

**Relevant Context:**
- `js/data.js` — interfaz original a replicar
- `js/forum.js` — consume `ecoData.publicaciones` y llama `getPublicaciones(filtros)`
- STORAGE_KEY = `'eco_publicaciones'` para localStorage

---

## Sub-Tarea 3: Actualizar `login.html`

**Status:** [ ] pending

**Intent:**
Remover el Supabase CDN y los scripts de backend. Reemplazar con `auth-demo.js`.
El formulario sigue funcionando igual visualmente pero ahora valida contra credenciales
hardcodeadas. Agregar un hint visual de las credenciales demo para facilitar pruebas.

**Expected Outcomes:**
- No se carga ningún CDN de Supabase
- `config.js` y `supabase.js` NO se cargan
- El formulario valida `demo@fie.edu` / `demo1234` y redirige a `forum.html`
- Cualquier otra combinación muestra "Credenciales incorrectas"
- Hay un mensaje/hint visible con las credenciales de prueba
- La página se puede abrir sin conexión a internet y funciona

**Todo List:**
- [ ] Remover `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2">` del `<head>`
- [ ] Remover `<script src="js/config.js">` y `<script src="js/supabase.js">`
- [ ] Remover `<script src="js/auth.js">` y reemplazar con `<script src="js/auth-demo.js">`
- [ ] Actualizar el script inline del formulario para que use `auth-demo.js` (la API es compatible)
- [ ] Agregar hint debajo del formulario: "🔑 Credenciales de prueba: demo@fie.edu / demo1234"
- [ ] El link "← Volver al inicio" debe seguir apuntando a `index.html`

**Relevant Context:**
- `login.html` — script inline actual usa `login(email, password)` con `await` — mantener esa lógica

---

## Sub-Tarea 4: Actualizar `forum.html` y `js/forum.js`

**Status:** [ ] pending

**Intent:**
Remover todos los scripts de Supabase del foro y reemplazar con los nuevos módulos demo.
Actualizar `forum.js` para que llame a las nuevas funciones de `data-demo.js` en lugar de
las de `supabase.js`/`data.js`.

**Expected Outcomes:**
- `forum.html` no carga ningún script de Supabase
- Al abrir el foro, se muestran los 8 artículos de semilla (o los guardados en localStorage)
- Los filtros (tipo y semestre) funcionan igual que antes
- El modal "Publicar oferta" guarda el artículo en localStorage y lo muestra inmediatamente
- "Contactar" muestra el nombre y contacto del publicador
- El username del usuario demo aparece en la navbar

**Todo List:**
- [ ] En `forum.html`: remover `config.js`, `supabase.js`, reemplazar `auth.js` → `auth-demo.js`, `data.js` → `data-demo.js`
- [ ] En `forum.js`: actualizar `cargarPublicaciones()` para usar `window.ecoData.getPublicaciones(filtros)` de `data-demo.js`
- [ ] En `forum.js`: actualizar `crearPublicacion()` para usar `window.ecoData.insertPublicacion(datos)` de `data-demo.js`
- [ ] La función de inserción debe tomar el nombre del usuario activo de `getUsuarioActivo()` de `auth-demo.js`
- [ ] Verificar que el evento `'ecoDataReady'` se maneja correctamente para la carga inicial
- [ ] `nav.js` — verificar que sigue leyendo de `sessionStorage('eco_user')` (sin cambios si la key es la misma)

**Relevant Context:**
- `js/forum.js` — lógica actual de `cargarPublicaciones()` y `crearPublicacion()`
- `js/nav.js` — lee directamente de `sessionStorage`, no necesita cambios si la key es igual
- El script inline en `forum.html` maneja filtros y modal — revisar si llama a funciones de Supabase directamente

---

## Sub-Tarea 5: Limpiar `index.html`

**Status:** [ ] pending

**Intent:**
La landing page no usa Supabase directamente, pero puede cargar `config.js` o `supabase.js`.
Verificar y limpiar cualquier referencia, y asegurar que el script inline de sesión funcione
con `sessionStorage('eco_user')` tal como lo deja `auth-demo.js`.

**Expected Outcomes:**
- `index.html` no carga ningún script de Supabase
- El script inline de sesión en la navbar sigue leyendo `sessionStorage('eco_user')` correctamente
- Los links de CTA siguen apuntando a `login.html` (no autenticado) o `forum.html` (autenticado)
- La página funciona sin conexión a internet (excepto imágenes de Unsplash que son externas)

**Todo List:**
- [ ] Revisar `index.html` para detectar si carga `config.js`, `supabase.js`, o `auth.js`
- [ ] Remover cualquier referencia a esos scripts si existen
- [ ] Verificar que el script inline de sesión usa `sessionStorage.getItem('eco_user')` y sigue funcionando
- [ ] No se deben hacer cambios al diseño ni al contenido

**Relevant Context:**
- `index.html` — el script inline de la navbar controla qué botones se muestran según sesión

---

## Notas de Implementación

- **Compatibilidad de API:** Los nuevos módulos exponen las mismas interfaces públicas que los originales para minimizar cambios en `forum.js` y `nav.js`
- **Orden de carga:** `auth-demo.js` debe cargarse antes que `forum.js`; `data-demo.js` debe cargarse antes que `forum.js`
- **Sin CDN de Supabase:** Ninguna página debe cargar `@supabase/supabase-js` ya que causa requests de red innecesarios
- **localStorage key:** `'eco_publicaciones'` para el array de publicaciones
- **sessionStorage key:** `'eco_user'` — mantener igual para compatibilidad con `nav.js` sin modificarlo

# Plan — Integración Supabase (Capa de Datos Real)

## Resumen

**Objetivo:** Reemplazar el `data/data.json` local por llamadas reales a la base de datos PostgreSQL en Supabase. El frontend (HTML + JS Vanilla) se conecta directamente a Supabase usando la Publishable key. El resto del frontend consume los mismos datos sin cambios estructurales.

**Credenciales del proyecto:**
- Project URL: `https://kpoehfjjhlqqdvpbopva.supabase.co`
- Publishable key: guardada en `js/config.js` (excluido de git)

**Fuera de alcance en esta fase:** HTML de vistas, CSS, lógica del foro, estadísticas, autenticación. Solo la capa de datos.

---

## ST-1 — Proteger las credenciales del repo

**Status:** `[ ] pending`

**Intent:**
Evitar que la Publishable key quede expuesta en el historial de GitHub. Se crea un archivo de configuración que el `.gitignore` excluye, y un archivo de ejemplo para que otros colaboradores sepan qué credenciales necesitan.

**Expected Outcomes:**
- `js/config.js` existe localmente con las credenciales reales, pero NO está en git.
- `js/config.example.js` está en git con valores placeholder como documentación.
- `.gitignore` tiene entrada para `js/config.js`.

**Todo List:**
1. Crear `js/config.js` con la URL y la Publishable key reales.
2. Crear `js/config.example.js` con valores placeholder (este sí va al repo).
3. Agregar `js/config.js` al `.gitignore`.

**Relevant Context:**
- `js/config.js` expone `window.SUPABASE_URL` y `window.SUPABASE_KEY` como globals.
- La Publishable key (`sb_publishable_...`) está diseñada para uso en browser — es segura en el frontend, pero no debe estar en git por buenas prácticas.

---

## ST-2 — Cliente Supabase (`js/supabase.js`)

**Status:** `[ ] pending`

**Intent:**
Crear el módulo central que inicializa la conexión a Supabase y expone funciones de acceso a datos que el resto del frontend puede llamar. Reemplaza la responsabilidad que tenía `data/data.json` + `js/data.js`.

**Expected Outcomes:**
- `js/supabase.js` exporta/expone como global: `getPublicaciones()`, `getUsuarios()`, `insertPublicacion(data)`.
- Todas las funciones retornan Promises.
- La conexión usa `fetch` nativo contra la REST API de Supabase (sin instalar el SDK npm — el proyecto es HTML estático).
- Si hay error de red, la Promise rechaza con el mensaje de Supabase.

**Todo List:**
1. Crear `js/supabase.js` con las constantes de URL y key leídas desde `window.SUPABASE_URL` y `window.SUPABASE_KEY`.
2. Implementar función helper interna `supaFetch(table, options)` que construye el request con los headers correctos (`apikey`, `Authorization`, `Content-Type`).
3. Implementar `getPublicaciones()` — GET a `/rest/v1/publicaciones?select=*`.
4. Implementar `getUsuarios()` — GET a `/rest/v1/usuarios?select=*`.
5. Implementar `insertPublicacion(data)` — POST a `/rest/v1/publicaciones`.
6. Exponer las tres funciones en `window.ecoSupabase = { getPublicaciones, getUsuarios, insertPublicacion }`.

**Relevant Context:**
- La REST API de Supabase es: `{PROJECT_URL}/rest/v1/{tabla}`
- Headers requeridos:
  - `apikey: {PUBLISHABLE_KEY}`
  - `Authorization: Bearer {PUBLISHABLE_KEY}`
  - `Content-Type: application/json` (para POST)
  - `Prefer: return=representation` (para POST — devuelve el registro insertado)
- No se usa el SDK `@supabase/supabase-js` porque requeriría npm/bundler. Se usa `fetch` puro.

---

## ST-3 — Módulo de datos global (`js/data.js`)

**Status:** `[ ] pending`

**Intent:**
Crear el módulo que inicializa la app cargando los datos desde Supabase al arrancar, y los deja disponibles en `window.ecoData` — exactamente la misma forma en que el README original especificaba que funcionaría, pero ahora con datos reales en vez del JSON local.

**Expected Outcomes:**
- `js/data.js` al ejecutarse hace las llamadas a Supabase y popula `window.ecoData = { usuarios: [...], publicaciones: [...] }`.
- Expone `window.ecoData.addPublicacion(pub)` para agregar publicaciones nuevas en memoria durante la sesión (las persistidas ya van a Supabase vía `insertPublicacion`).
- Cualquier página que incluya `data.js` puede esperar el evento `ecoDataReady` en `document` para saber que los datos están disponibles.

**Todo List:**
1. Crear `js/data.js` que llama `ecoSupabase.getPublicaciones()` y `ecoSupabase.getUsuarios()` en paralelo con `Promise.all`.
2. Al resolver, asignar los resultados a `window.ecoData.publicaciones` y `window.ecoData.usuarios`.
3. Disparar `document.dispatchEvent(new Event('ecoDataReady'))` cuando los datos estén cargados.
4. Exponer `window.ecoData.addPublicacion(pub)` que hace push al array local (para nuevas publicaciones en sesión).

**Relevant Context:**
- El orden de scripts en cada HTML será: `config.js` → `supabase.js` → `data.js` → módulo de la vista (forum.js, stats.js, etc.).
- Los módulos de vistas escuchan `ecoDataReady` antes de renderizar — esto asegura que los datos ya llegaron de la red.

---

## Estructura final de archivos JS

```
js/
├── config.js          ← NO en git (credenciales reales)
├── config.example.js  ← SÍ en git (valores placeholder)
├── supabase.js        ← cliente REST de Supabase
├── data.js            ← carga datos y expone window.ecoData
├── auth.js            ← (próxima fase) login contra tabla usuarios
├── nav.js             ← (próxima fase) estado de sesión navbar
├── forum.js           ← (próxima fase) lógica del foro
└── stats.js           ← (próxima fase) cálculos de impacto
```

---

## Orden de inclusión de scripts en cada HTML

```html
<script src="js/config.js"></script>
<script src="js/supabase.js"></script>
<script src="js/data.js"></script>
<script src="js/[modulo-de-la-vista].js"></script>
```

---

## Validaciones antes de dar por terminado

- [ ] `js/config.js` NO aparece en `git status` (está en `.gitignore`).
- [ ] `js/config.example.js` SÍ aparece en git.
- [ ] Abrir `index.html` en el browser y verificar en consola que `window.ecoData.publicaciones` tiene los 10 registros de Supabase.
- [ ] Verificar que `window.ecoData.usuarios` tiene los 3 usuarios.
- [ ] El evento `ecoDataReady` se dispara sin errores en consola.

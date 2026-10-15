# Plan — Login con Supabase Auth

## Resumen

**Objetivo:** Reemplazar la autenticación mock (contra `data/data.json`) por Supabase Auth nativo usando `signInWithPassword` con email + password. El formulario de login cambia el campo "usuario" por "email". Se usa el SDK oficial de Supabase cargado vía CDN (sin npm ni bundler).

**Alcance:**
- `login.html` — cambiar campo usuario → email, cargar CDN del SDK
- `js/supabase.js` — inicializar cliente SDK y exponer `window.supabaseClient`
- `js/auth.js` — reemplazar lógica mock con llamadas reales a Supabase Auth

**Fuera de alcance:**
- Registro de nuevos usuarios
- Recuperación de contraseña
- Cambios de estilos CSS del formulario (salvo label del campo email)
- Lógica del foro, navbar, o páginas protegidas

---

## ST-1 — Inicializar el cliente SDK de Supabase

**Status:** `[x] done`

**Intent:**
El SDK de Supabase (`@supabase/supabase-js`) provee el módulo `supabase.auth` con `signInWithPassword` y `signOut`. Actualmente `js/supabase.js` usa `fetch` puro solo para la REST API de datos. Se debe ampliar para inicializar también el cliente SDK y exponerlo como `window.supabaseClient`, de modo que `auth.js` pueda usarlo sin necesidad de repetir la inicialización.

**Expected Outcomes:**
- `js/supabase.js` importa el SDK via CDN (usando un `<script>` tag en HTML antes de cargar el archivo)
- `window.supabaseClient` queda disponible como cliente SDK inicializado con `SUPABASE_URL` y `SUPABASE_KEY`
- Las funciones existentes `ecoSupabase.getPublicaciones`, `getUsuarios`, `insertPublicacion` siguen funcionando sin cambios (usan `fetch` puro)

**Todo List:**
1. Verificar en `login.html` que `js/config.js` se carga antes que cualquier otro script.
2. Al final de `js/supabase.js`, agregar la inicialización del cliente SDK:
   ```js
   window.supabaseClient = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
   ```
3. Asegurarse de que el CDN del SDK (`<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js">`) se incluya en `login.html` **antes** de `js/supabase.js`.

**Relevant Context:**
- [`js/supabase.js`](js/supabase.js) — actualmente solo usa `fetch` puro y expone `window.ecoSupabase`
- [`js/config.js`](js/config.js) — define `window.SUPABASE_URL` y `window.SUPABASE_KEY`
- El CDN UMD de Supabase expone el objeto global `supabase` con `supabase.createClient()`

---

## ST-2 — Reemplazar la lógica de autenticación en `js/auth.js`

**Status:** `[x] done`

**Intent:**
La función `login(usuario, password)` actual hace un `fetch` al archivo local `data/data.json` y compara credenciales en texto plano. Debe reemplazarse por `window.supabaseClient.auth.signInWithPassword({ email, password })`. La función `logout()` debe llamar a `supabaseClient.auth.signOut()` además de limpiar `sessionStorage`. El contrato de retorno de `login()` (`{ ok, mensaje }`) no cambia para que `login.html` no requiera ajustes en su lógica de manejo de resultados.

**Expected Outcomes:**
- `login(email, password)` llama a `supabaseClient.auth.signInWithPassword` y retorna `{ ok: true }` o `{ ok: false, mensaje: string }`
- El usuario autenticado se guarda en `sessionStorage` con la clave `eco_user` usando los datos del objeto `session.user` de Supabase
- `logout()` llama a `supabaseClient.auth.signOut()` y luego limpia `sessionStorage`
- `getUsuarioActivo()` y `requireAuth()` no cambian su comportamiento externo
- No queda ninguna referencia a `data/data.json` ni a comparación de contraseñas en texto plano

**Todo List:**
1. Eliminar la constante `DATA_URL` (línea 6 de `auth.js`).
2. Reemplazar el cuerpo de `login(usuario, password)` por:
   - Llamada a `window.supabaseClient.auth.signInWithPassword({ email: usuario, password })`
   - Si hay error en la respuesta de Supabase, retornar `{ ok: false, mensaje: error.message }`
   - Si la autenticación fue exitosa, guardar `session.user` (o un subconjunto seguro: `id`, `email`) en `sessionStorage` bajo la clave `SESSION_KEY`
   - Retornar `{ ok: true }`
3. Actualizar `logout()` para agregar `await window.supabaseClient.auth.signOut()` antes de limpiar `sessionStorage`.

**Relevant Context:**
- [`js/auth.js`](js/auth.js:15) — función `login()` actual (líneas 15-36) y `logout()` (líneas 41-44)
- `window.supabaseClient` estará disponible porque `js/supabase.js` se carga antes que `js/auth.js`
- Supabase `signInWithPassword` retorna `{ data: { session, user }, error }` — si `error` no es null, la autenticación falló

---

## ST-3 — Actualizar el formulario en `login.html`

**Status:** `[x] done`

**Intent:**
El formulario actual tiene un campo con `id="usuario"` pensado para un nombre de usuario de texto. Supabase Auth utiliza email como identificador. Se debe cambiar el campo a tipo `email` con la etiqueta correspondiente, actualizar el script inline que lee el valor del campo, y agregar el CDN de Supabase en el orden correcto de scripts.

**Expected Outcomes:**
- El formulario muestra un campo "Correo electrónico" con `type="email"` en lugar del campo "Usuario"
- El script inline de `login.html` lee `document.getElementById('usuario').value` (el `id` puede mantenerse para no romper referencias, solo cambia el `type` y el `label`)
- El CDN de Supabase SDK se carga **antes** de `js/supabase.js` y `js/auth.js`
- El flujo completo funciona: llenar email + password → click "Iniciar sesión" → redirige a `forum.html`

**Todo List:**
1. En `login.html`, agregar el script CDN de Supabase **antes** de los demás scripts:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
   <script src="../js/config.js"></script>
   <script src="../js/supabase.js"></script>
   <script src="../js/auth.js"></script>
   ```
2. Cambiar el `<label>` del campo de "Usuario" a "Correo electrónico".
3. Cambiar el `type` del input de `text` a `email`.
4. Actualizar el `placeholder` del input de `"Tu nombre de usuario"` a `"tu@correo.com"`.
5. Cambiar el `autocomplete` de `"username"` a `"email"`.

**Relevant Context:**
- [`login.html`](login.html:120) — formulario (líneas 120-148) y bloque de scripts (líneas 155-201)
- El `id="usuario"` del input puede mantenerse para no cambiar el script inline que lee `.getElementById('usuario').value`
- El orden correcto de carga de scripts es crítico: CDN → config.js → supabase.js → auth.js

---

## Orden final de scripts en `login.html`

```
CDN supabase-js@2  ← expone global `supabase`
js/config.js       ← define window.SUPABASE_URL y window.SUPABASE_KEY
js/supabase.js     ← inicializa window.supabaseClient + window.ecoSupabase
js/auth.js         ← login(), logout(), getUsuarioActivo(), requireAuth()
<script inline>    ← manejador del formulario
```

---

## Validaciones antes de dar por terminado

- [ ] Al ingresar un email/password válido, redirige a `forum.html`.
- [ ] Al ingresar credenciales incorrectas, muestra el mensaje de error de Supabase.
- [ ] `sessionStorage.getItem('eco_user')` contiene el objeto de usuario tras el login.
- [ ] Al llamar `logout()`, se limpia `sessionStorage` y redirige a `login.html`.
- [ ] No hay errores de consola relacionados con `supabase is not defined` o `supabaseClient is not defined`.
- [ ] No quedan referencias a `data/data.json` en `auth.js`.

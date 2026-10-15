# Plan de Trabajo — EcoComponents FIE

## Resumen General

**Objetivo:** Desarrollar una aplicación web estática con HTML, CSS y JavaScript Vanilla que permita a los estudiantes de la Facultad de Ingeniería Electromecánica (FIE) donar, prestar e intercambiar componentes electromecánicos de proyectos anteriores, promoviendo la conciencia ambiental y la reducción de residuos.

**Alcance:** Solo frontend estático. El "backend" es simulado mediante un archivo `data.json` con datos precargados. Las nuevas publicaciones se guardan en memoria (array JS, se pierden al recargar). Sin autenticación real.

**Stack:** HTML5, CSS3, JavaScript Vanilla (ES6+), sin frameworks ni librerías externas (opcional: íconos con Font Awesome CDN).

**Fuera de alcance:** Persistencia real, registro de usuarios, pagos, backend real, base de datos.

---

## Estructura del Proyecto

```
ecocomponents-fie/
├── index.html          # Landing page
├── login.html          # Login simulado
├── forum.html          # Foro de publicaciones
├── about.html          # Sobre nosotros
├── stats.html          # Estadísticas de impacto
├── css/
│   └── styles.css      # Estilos globales
├── js/
│   ├── data.js         # Carga y gestión del JSON en memoria
│   ├── auth.js         # Lógica de login simulado
│   ├── forum.js        # Lógica del foro (listar, filtrar, publicar)
│   ├── stats.js        # Cálculo dinámico de estadísticas
│   └── nav.js          # Navegación y estado de sesión
├── data/
│   └── data.json       # Datos simulados: usuarios, publicaciones, estadísticas base
└── assets/
    └── images/         # Imágenes de componentes y UI
```

---

## Sub-Tareas

---

### ST-1 — Estructura base y datos simulados

**Status:** `[ ] pending`

**Intent:**
Crear el esqueleto del proyecto con la estructura de archivos, el archivo `data.json` con datos precargados suficientes para que todas las demás vistas funcionen, y los estilos CSS globales con paleta de colores ecológica.

**Expected Outcomes:**
- Estructura de carpetas y archivos HTML vacíos creados.
- `data.json` con al menos 3 usuarios, 10 publicaciones (mezcla de donación, préstamo e intercambio) y metadatos base para estadísticas.
- `styles.css` con variables CSS, reset, tipografía, paleta verde/ecológica y componentes base (botones, cards, navbar).

**Todo List:**
1. Crear la estructura de carpetas del proyecto.
2. Crear `data/data.json` con el esquema de usuarios, publicaciones y estadísticas base.
3. Crear `css/styles.css` con variables de color, tipografía y componentes base reutilizables.
4. Crear los 5 archivos HTML con estructura base (head, navbar placeholder, footer).
5. Crear `js/data.js` que carga el JSON y expone los datos como módulo global.

**Relevant Context:**
- Esquema de usuarios: `{ id, nombre, usuario, password, semestre, carrera, contacto }`
- Esquema de publicaciones: `{ id, titulo, descripcion, tipo, imagen, estado, semestre_origen, usuario_id, fecha }`
- Tipos de publicación: `"donacion"`, `"prestamo"`, `"intercambio"`
- Estados del componente: `"nuevo"`, `"buen estado"`, `"desgaste leve"`, `"para repuesto"`

---

### ST-2 — Landing Page (index.html)

**Status:** `[ ] pending`

**Intent:**
Crear la página de entrada de la aplicación. Es la primera impresión del proyecto; debe comunicar claramente la misión, invitar al login y mostrar un resumen del impacto de la plataforma.

**Expected Outcomes:**
- Hero section con nombre, slogan y botón "Comenzar" que lleva a `login.html`.
- Sección de "Cómo funciona" con los 3 tipos de publicación (íconos + descripción breve).
- Sección de llamado a la acción con acceso al foro.
- Navbar con enlaces a todas las vistas.
- Footer con información de la facultad.

**Todo List:**
1. Construir la navbar con logo, nombre de la app y links de navegación.
2. Construir el hero section (imagen de fondo, titular, slogan, CTA).
3. Construir la sección "¿Cómo funciona?" con cards de los 3 tipos.
4. Construir el footer.
5. Vincular `css/styles.css` y asegurar responsividad básica.

**Relevant Context:**
- El botón "Comenzar" debe redirigir a `login.html`.
- Si ya hay sesión simulada (localStorage con `eco_user`), el CTA puede llevar directo al foro.

---

### ST-3 — Login Simulado (login.html + auth.js)

**Status:** `[ ] pending`

**Intent:**
Implementar una página de login que valide usuario y contraseña contra los datos del `data.json`. Al autenticar correctamente, guarda el usuario en `sessionStorage` o `localStorage` y redirige al foro.

**Expected Outcomes:**
- Formulario de login con campos usuario y contraseña.
- Validación contra los usuarios del JSON (en `auth.js`).
- Mensaje de error visible si las credenciales son incorrectas.
- Redirección automática al foro si ya hay sesión activa.
- Botón de "Cerrar sesión" en la navbar cuando el usuario está logueado.

**Todo List:**
1. Crear `login.html` con formulario estilizado.
2. Crear `js/auth.js` con función `login(usuario, password)` que busca en el array de usuarios.
3. Guardar el objeto de usuario autenticado en `sessionStorage` como `eco_user`.
4. Redirigir a `forum.html` tras login exitoso.
5. Implementar `logout()` que limpia `sessionStorage` y redirige a `index.html`.
6. En `js/nav.js`, leer `eco_user` y mostrar/ocultar el botón de logout en la navbar.

**Relevant Context:**
- Contraseñas están en texto plano en el JSON (simulación, no producción).
- Proteger el foro: si se accede a `forum.html` sin sesión, redirigir a `login.html`.

---

### ST-4 — Foro de Publicaciones (forum.html + forum.js)

**Status:** `[ ] pending`

**Intent:**
Es el núcleo de la aplicación. Muestra todas las publicaciones cargadas del JSON más las creadas en memoria durante la sesión. Permite filtrar por tipo de publicación y por semestre de origen.

**Expected Outcomes:**
- Grid/lista de cards con las publicaciones (imagen, nombre, tipo, estado, semestre, contacto).
- Filtros funcionales por tipo (donación / préstamo / intercambio) y por semestre.
- Botón "Publicar oferta" que abre un formulario modal.
- Formulario modal para crear nueva publicación (datos se agregan al array en memoria).
- Botón "Contactar" en cada card que muestra el dato de contacto del publicador.
- Indicador visual del tipo de publicación con color diferenciado.

**Todo List:**
1. Crear la estructura HTML del foro con área de filtros y área de grid de cards.
2. En `forum.js`, cargar publicaciones del JSON y renderizarlas como cards dinámicamente.
3. Implementar los filtros de tipo y semestre con event listeners.
4. Crear el modal "Nueva Publicación" con el formulario completo.
5. Implementar la función que toma los datos del formulario y agrega al array en memoria, luego re-renderiza.
6. Implementar el botón "Contactar" que muestra nombre y dato de contacto del publicador.
7. Diferenciar visualmente los tipos con badges de color (verde=donación, azul=préstamo, naranja=intercambio).

**Relevant Context:**
- Las nuevas publicaciones creadas en sesión no persisten al recargar (es esperado y documentado).
- El usuario logueado (desde `sessionStorage`) se asigna como `usuario_id` de las nuevas publicaciones.
- El campo imagen del formulario acepta URL de imagen (para simplicidad sin subida de archivos real).

---

### ST-5 — Estadísticas de Impacto (stats.html + stats.js)

**Status:** `[ ] pending`

**Intent:**
Mostrar métricas de impacto ambiental calculadas dinámicamente a partir de las publicaciones en memoria. Refuerza el mensaje de concientización del proyecto.

**Expected Outcomes:**
- Contadores animados de: total de publicaciones, donaciones, préstamos, intercambios.
- Estimación de CO₂ evitado (fórmula simple: cada componente reutilizado = X gramos de CO₂).
- Estimación de residuos evitados en gramos/kg (dato fijo por componente).
- Gráfico o visualización simple de la distribución por tipo (barras CSS o canvas básico).
- Mensaje motivacional basado en el total acumulado.

**Todo List:**
1. Crear `stats.html` con la estructura de secciones de métricas.
2. Crear `js/stats.js` que lee el array de publicaciones y calcula los totales.
3. Implementar la fórmula de CO₂ evitado: `componentes * 0.5 kg` (valor estimado documentado).
4. Implementar la fórmula de residuos evitados: `componentes * 0.3 kg`.
5. Renderizar los contadores con una animación simple de contador creciente.
6. Crear el gráfico de distribución con barras CSS (sin librerías).

**Relevant Context:**
- Los valores de CO₂ y residuos son estimaciones con fines educativos, deben marcarse como tal en la UI.
- Leer publicaciones desde el array global gestionado por `data.js`.

---

### ST-6 — Sobre Nosotros (about.html)

**Status:** `[ ] pending`

**Intent:**
Página informativa sobre el origen del proyecto, la misión ecológica y el equipo detrás de la iniciativa. Da credibilidad y contexto institucional.

**Expected Outcomes:**
- Sección de misión y visión del proyecto.
- Sección "Nuestro equipo" con cards de los integrantes.
- Sección de contexto: por qué la FIE adoptó esta iniciativa.
- Diseño coherente con el resto de la aplicación.

**Todo List:**
1. Crear `about.html` con las tres secciones descritas.
2. Agregar cards de integrantes del equipo (nombre, rol, semestre) con datos hardcodeados en HTML.
3. Redactar el texto de misión, visión y contexto institucional.
4. Asegurar consistencia visual con el resto del sitio.

**Relevant Context:**
- Esta página es completamente estática, sin JS dinámico necesario.

---

### ST-7 — Revisión final, responsividad y coherencia visual

**Status:** `[ ] pending`

**Intent:**
Asegurar que toda la aplicación funcione correctamente de extremo a extremo, que sea responsiva en móvil y escritorio, y que la experiencia de usuario sea coherente.

**Expected Outcomes:**
- Todas las páginas se renderizan correctamente en móvil (320px+) y escritorio.
- El flujo completo funciona: landing → login → foro → filtrar → publicar → estadísticas.
- Sin errores en consola del navegador.
- Navbar muestra correctamente el estado de sesión en todas las páginas.
- Las credenciales de prueba están documentadas en un `README.md`.

**Todo List:**
1. Revisar y ajustar responsividad con media queries en `styles.css`.
2. Probar el flujo completo de usuario (login, publicar, filtrar, logout).
3. Corregir errores de consola encontrados.
4. Crear `README.md` con instrucciones de uso y credenciales de prueba.
5. Verificar coherencia de paleta de colores, tipografía y espaciados en todas las vistas.

---

## Flujo de Usuario Principal

```
Landing (index.html)
    └─► Login (login.html)  [credenciales en data.json]
            └─► Foro (forum.html)
                    ├─► Ver cards de publicaciones
                    ├─► Filtrar por tipo / semestre
                    ├─► Publicar nueva oferta [modal]
                    └─► Ver contacto del publicador
Navbar siempre visible:
    ├─► Inicio (index.html)
    ├─► Foro (forum.html)  [protegida: requiere sesión]
    ├─► Estadísticas (stats.html)
    ├─► Sobre Nosotros (about.html)
    └─► Cerrar Sesión [visible solo con sesión activa]
```

---

## Credenciales de Prueba (definidas en data.json)

| Usuario | Contraseña | Semestre |
|---|---|---|
| jperez | fiepas123 | 6to |
| mlopez | fiepas123 | 4to |
| csanchez | fiepas123 | 8vo |
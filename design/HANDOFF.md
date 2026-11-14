# brunofrankenstein.com: especificación de interfaz (diseño C1 «Cianotipo»)

> Documento para que Claude Code construya el sitio real. Estado: **borrador v0.1 para revisar** (2026-11-14).
> Las pantallas de `design/pantallas/` son **referencia visual**, no código de producción (ver §2).

---

## 0. Problema y criterios de éxito

**Problema.** Bruno necesita un portfolio bilingüe (ES/EN) que muestre proyectos de ingeniería (impresión 3D, home automation, baterías, mecánica, código) y su trayectoria (Faraday Lab, Fing Hydrogen Racing, investigación). Hoy no hay sitio en producción [CONFIRMAR].

**Éxito cuando:**
1. Las 6 pestañas (Inicio, Proyectos, Proyecto, Experiencias, Sobre mí, Contacto) existen en ES y EN y se ven como las pantallas de referencia de 360 px a 1440 px.
2. Publicar un proyecto nuevo = crear **un** archivo de contenido (MDX con frontmatter) + sus imágenes. Sin tocar componentes.
3. Lighthouse ≥ 95 en Performance, Accesibilidad, Buenas prácticas y SEO (celular).
4. Navegable entero con teclado; `prefers-reduced-motion` desactiva todo movimiento no esencial.
5. Ninguna interacción esconde información que no esté también disponible sin hover (táctil y lector de pantalla).

**Fuera de alcance (v1):** blog, CMS visual, comentarios, modo claro, analítica con cookies.

---

## 1. Concepto: el sitio es un plano

Todo el lenguaje sale del **dibujo técnico en cianotipo**: papel azul, tinta clara, retícula de 24 px, línea de 1 px, cero bordes redondeados, cero sombras, cero degradés. Las interacciones toman vocabulario de dibujo técnico:

| Concepto de plano | Uso en la interfaz |
|---|---|
| **Lámina / FIG.** | Cada proyecto es una lámina numerada (`FIG. 03`). |
| **Cajetín** | La ficha técnica del proyecto (fecha, categoría, etiquetas). |
| **Cota** (línea de medida con flechas) | Separadores, indicador de progreso, tooltips «de medida». |
| **Líneas de construcción** | Marcos que se «dibujan» al entrar en pantalla. |
| **Detalle (DET. A)** | Pies de foto y ampliaciones. |
| **Nota** | Avisos y tooltips con línea guía. |
| **Revisión (REV. A)** | Sello de confirmación (formulario enviado, código copiado). |
| **Coordenadas** | Firma del autor (`34°54′ S · 56°11′ O`). |

**Regla de oro del movimiento:** preciso y mecánico, como un plotter. Sin rebotes, sin elasticidad, sin parallax. Si una animación no comunica estado o jerarquía, se va.

---

## 2. Cómo leer las pantallas de referencia

`design/pantallas/*.dc.html` salen de un editor de diseño:

- `{{accent}}` → reemplazar por `var(--c-accent)`.
- `<x-dc>`, `<helmet>`, `<script src="./support.js">` y el bloque `<script type="text/x-dc">` son del editor: **ignorarlos**.
- Todo está en estilos en línea a propósito (para el editor). En producción: componentes + CSS con los tokens de `design/tokens.css`. **No copiar los estilos en línea.**
- Ancho fijo 1280 px en las de escritorio: es solo el lienzo. El sitio real es fluido (ver §5).
- Los rectángulos rayados («FOTO DE PORTADA · 16:9») son marcadores de imagen; el rayado se reutiliza como *skeleton* de carga.
- `design/assets/retrato.jpg`: **Bruno tiene que agregarlo** (no viene en el paquete).

| Archivo | Pantalla |
|---|---|
| `C-Inicio-d.dc.html` | Inicio · escritorio |
| `C-Proyectos-d.dc.html` | Índice de proyectos con filtros · escritorio |
| `C-Proyecto-d.dc.html` | Detalle de proyecto · escritorio |
| `C-Experiencias-d.dc.html` | Cronograma · escritorio |
| `C-SobreMi-d.dc.html` | Sobre mí · escritorio |
| `C-Contacto-d.dc.html` | Contacto con formulario · escritorio |

**Celular (no incluidas como archivo; reglas):** header de 48 px con marca, ES/EN y botón de menú (abre un panel a pantalla completa con la nav numerada). Todo apila en una columna con padding lateral de 22 px. Categorías en grilla de 2 columnas. Detalle de proyecto: el cajetín pasa arriba del cuerpo, el índice lateral desaparece (o pasa a un desplegable «EN ESTA LÁMINA» fijo bajo el header), las tablas hacen scroll horizontal dentro de su caja.

---

## 3. Stack propuesto [DECIDIR]

Recomendación: **Astro + MDX + CSS propio con tokens** (sin framework de UI). Razones: sitio de contenido casi estático, cero JS por defecto, *content collections* tipadas para proyectos, i18n nativo, View Transitions integradas, imágenes optimizadas (`astro:assets`). Islas de JS solo para: filtros, tooltips, formulario, scroll-spy, lightbox.

Alternativas: Next.js (si después se quiere backend/app), Eleventy (más simple, menos tipado).
Deploy: Cloudflare Pages / Netlify / Vercel [DECIDIR]. Formulario: Formspree, Netlify Forms o una función serverless [DECIDIR].

### Modelo de contenido

```ts
// src/content/proyectos/<slug>.<es|en>.mdx — frontmatter
{
  fig: 3,                         // número de lámina, único
  titulo: "Soporte impreso para sensor de temperatura",
  resumen: "Un soporte en PETG que…",   // ≤ 140 caracteres, se usa en tarjetas y OG
  fecha: "2026-08-14",
  categorias: ["impresion-3d", "home-automation"],  // ids de la lista cerrada
  etiquetas: ["PETG", "Fusion 360", "ESPHome", "DS18B20"],
  portada: "./portada.jpg",       // 16:9 mínimo 1920 px
  repo?: "https://github.com/…",
  youtube?: "VIDEO_ID",
  destacado?: true,
  estado?: "publicado" | "en-preparacion"
}
```

Categorías (lista cerrada, cada una con ícono de `design/iconos/cat-*.svg`): `impresion-3d`, `home-automation`, `ingenieria-mecanica`, `baterias`, `vibe-code`, `otros`.

Experiencias: colección `experiencias` con `desde`, `hasta?`, `rol`, `lugar`, `descripcion`, `etiquetas`, `enlace?`.

Rutas: `/` y `/en/`, `/proyectos/`, `/proyectos/<slug>/`, `/experiencias/`, `/sobre-mi/`, `/contacto/` (+ equivalentes `/en/projects/…`). El selector ES/EN lleva a la **misma página** en el otro idioma.

---

## 4. Tokens

Ver `design/tokens.css` (colores con contraste verificado, tipografía, espaciado, movimiento). Reglas:

- **Mono (Fragment Mono)** = rótulos, navegación, datos, números. Siempre MAYÚSCULAS con `letter-spacing: .08em` para rótulos. Solo tiene peso 400.
- **Sans (Instrument Sans, variable 400–700)** = lectura y títulos.
- `--c-line` (#4C7199, 3.1:1) es **solo decorativo**: nunca para texto.
- Una sola variable de acento. El diseño probó cian `#7FD6FF` (por defecto), naranja `#FF7A1A` y rojo `#FF5A4D`. Que se pueda cambiar en un solo lugar.

---

## 5. Layout y responsive

- Contenedor `max-width: 1280px`, centrado, padding lateral `clamp(22px, 5vw, 72px)`.
- Breakpoints: `≥ 1024` escritorio (columnas de las referencias), `640–1023` tablet (2 columnas donde había 3; el detalle de proyecto en una columna con el cajetín arriba), `< 640` celular (1 columna).
- La retícula de fondo es fija al documento (`background-attachment: scroll`), alineada al contenedor.
- Header fijo (`position: sticky`). Al bajar más de 80 px se compacta de 64 → 52 px y gana el borde inferior (transición `--t-hover`).

---

## 6. Interacciones (especificación por componente)

Notación: **R** reposo · **H** hover (solo con `@media (hover: hover)`) · **F** foco de teclado · **A** activo/presionado · **T** táctil.
Regla general: **H y F siempre se ven igual.** Todo lo que pasa en H tiene que tener equivalente en T o no ser esencial.

### 6.1 Links de texto y navegación
- **R:** sin subrayado.
- **H/F:** subrayado de 1 px en `--c-accent` que se **dibuja de izquierda a derecha** (`transform: scaleX(0→1)`, origen izquierda, `--t-hover`, `--ease-out`). El color del texto pasa a `--c-accent`.
- **Página actual (nav):** `aria-current="page"`, color acento y subrayado fijo. Opcional: un marcador `▸` mono antes del texto.
- **Por qué no negrita:** cambiar el peso cambia el ancho del texto y la nav «salta». Si se quiere énfasis de peso en títulos sans, usar `font-variation-settings` reservando el ancho con el truco `::after { content: attr(data-text); font-weight: 600; visibility: hidden; height: 0 }`. En mono no hay negrita: usar color + subrayado.

### 6.2 Botones
- **Primario** (fondo acento): H/F → el fondo sube ~8 % de luminosidad y la flecha `→` (ícono `ui-flecha`) se desplaza 4 px a la derecha. A → `translateY(1px)`. `--t-micro`.
- **Secundario** (borde): H/F → el borde pasa a acento y aparecen las **4 esquinas de mira** (`deco-esquina`) 4 px por fuera, con fade de 120 ms.
- Deshabilitado: borde punteado, texto `--c-ink-muted`, `cursor: not-allowed`.
- Mínimo 48 px de alto en escritorio y 44 px en celular.

### 6.3 Tarjeta de proyecto (Inicio, Proyectos)
Toda la tarjeta es un solo link (el `<a>` en el título con `::after` cubriendo la tarjeta; no anidar links). Las etiquetas de categoría quedan por encima con `position: relative; z-index: 1`.
- **H/F:**
  1. El marco de la imagen se **despega**: `outline-offset` 6 → 10 px y el color del outline pasa a acento (`--t-hover`).
  2. La imagen hace zoom 1.00 → 1.03 dentro de su recorte (`overflow: hidden`), 400 ms.
  3. Si la portada tiene tratamiento cianotipo (§8.1): crossfade a la **foto a color real** (300 ms). Es la interacción «revelar».
  4. El rótulo `FIG. 03` se reemplaza por `FIG. 03 → ABRIR LÁMINA` (deslizamiento vertical de 100 %, overflow oculto).
  5. El título pasa a acento.
- **No** escalar la tarjeta entera (el texto se ve borroso al escalar) y **no** sombras.
- **T:** sin estado hover; al tocar se navega directo.
- Con View Transitions (§7.4), la portada se transforma en la portada del detalle.

### 6.4 Grilla de categorías (Inicio)
- **H/F en una celda:** el fondo se llena con **rayado a 45°** en acento al 12 % (el mismo patrón de los placeholders) que entra de izquierda a derecha con `clip-path` (250 ms); el ícono de categoría se **dibuja** (`stroke-dashoffset` de largo → 0, 500 ms); el contador `×2` pasa a acento.
- Las celdas vacías (`×0`) quedan en `--c-ink-muted` sin animación, pero siguen siendo link (muestran estado vacío).

### 6.5 Tooltips «Nota de plano» (descripción breve con hover sostenido)
Dónde: etiquetas de categoría y tecnología, botones de solo ícono, términos técnicos marcados en los textos (glosario: PETG, DS18B20, fuga térmica, Formula SAE…), las coordenadas, `ESC 1:1`.
- **Disparo:** hover sostenido **500 ms** (`--tooltip-delay`) o foco de teclado (inmediato). Se cierra a los 100 ms de salir, con `Esc` o al hacer scroll. Hay un «puente» invisible entre el disparador y la caja para poder entrar con el mouse sin que se cierre.
- **Forma:** caja recta con borde de 1 px en acento y fondo `--c-paper`, unida al disparador por una **línea guía** de 1 px con un punto en el extremo (como una nota en un plano). Rótulo mono pequeño arriba (`NOTA`, `DEF.`, `ATAJO`) + 1–2 líneas en sans. Máximo 240 px de ancho.
- **Entrada:** la línea guía se dibuja (150 ms) y la caja aparece con opacity + 4 px de desplazamiento (150 ms). Sin movimiento con `reduced-motion`.
- **Accesibilidad:** `aria-describedby` en el disparador; `role="tooltip"`. En los términos de glosario el disparador es un `<button>` con subrayado punteado. **T:** tocar abre y tocar afuera cierra. **Nunca** contenido esencial solo en tooltip.
- Implementación sugerida: Popover API + CSS Anchor Positioning con fallback a Floating UI.

### 6.6 Filtros y vista de Proyectos
- Filtrar por categoría/año es **instantáneo** (sin recarga) y actualiza la URL (`?cat=baterias&anio=2026`) para poder compartir y volver atrás.
- Las tarjetas que se quedan se reacomodan con animación **FLIP** (300 ms); las que salen hacen fade de 150 ms. Los contadores se actualizan.
- Toggle **Grilla / Lista** (`aria-pressed`): la lista es una tabla «índice de láminas» (FIG · título · categorías · fecha). La preferencia se guarda en `localStorage`.
- Estado vacío: marco punteado con «SIN LÁMINAS EN ESTA CATEGORÍA · TODAVÍA» + link «Ver todas».
- Sin JS: links normales a `/proyectos/?cat=…` que el servidor (o el build) resuelve, o todas visibles.

### 6.7 Detalle de proyecto
- **Barra de progreso de lectura como regla:** línea de 1 px en acento bajo el header, con marcas cada 10 % (como una regla milimetrada). `scaleX` según scroll (`animation-timeline: scroll()` con fallback JS).
- **Índice lateral (scroll-spy):** la sección visible se marca en acento con borde izquierdo continuo; las demás con borde punteado. Clic → scroll suave (desactivado con reduced-motion) y foco en el `h2`.
- **Imágenes:** clic → *lightbox* a pantalla completa con fondo `--c-paper` al 96 %, rótulo `DET. A · ESC 2:1`, zoom con rueda/pinch, navegación con flechas, `Esc` cierra y devuelve el foco.
- **Bloques de código:** botón `COPIAR` arriba a la derecha (ícono `ui-copiar`) → al copiar cambia a `ui-check` + `COPIADO` durante 1.5 s y anuncia por `aria-live`.
- **Video:** fachada estática (portada rayada + botón play). Solo al hacer clic se carga el `iframe` de `youtube-nocookie.com` (ahorra ~500 KB). H → el cuadrado del play se rellena en acento.
- **Navegación final:** anterior / siguiente lámina + «Índice».

### 6.8 Cronograma (Experiencias)
- La línea vertical del tiempo se **dibuja a medida que se hace scroll** (scroll-driven animation). Cada nodo cuadrado se rellena cuando cruza el centro de la pantalla.
- H/F en una fila: el año pasa a acento y aparece a la derecha una cota horizontal con la duración (`2 AÑOS 3 MESES`), calculada de `desde`/`hasta`.
- Botón `DESCARGAR CV · PDF` → mismo comportamiento que secundario + ícono `ui-descargar` que «baja» 2 px en hover.

### 6.9 Formulario de contacto
- Validación al salir del campo (`blur`), no mientras se escribe. Errores en mono, en `--c-error`, debajo del campo, con `aria-invalid` + `aria-describedby`. Borde del campo con error: punteado.
- Foco en un input: borde pasa a acento y aparece el rótulo `CAMPO ACTIVO` alineado a la derecha del label (sutil, `--c-ink-muted`).
- Envío: botón → `ENVIANDO…` (spinner = una cota que se dibuja en loop). Éxito: el formulario se reemplaza por un **sello `RECIBIDO · REV. A`** (marco doble, rotado −2°, aparece con escala 1.1 → 1 en 200 ms) + «Te respondo a [email]». Error: nota en rojo con opción de reintentar o copiar el email.
- Anti-spam: campo *honeypot* oculto + tiempo mínimo de llenado. Sin captcha visible.
- **Copiar email:** clic en el email → copia al portapapeles + tooltip `COPIADO` (en vez de abrir `mailto:` directamente; dejar un link secundario `Abrir en tu correo`).

### 6.10 Selector de idioma
- ES/EN como links reales (`hreflang`, `lang`). Al cambiar: misma ruta en el otro idioma, preservando el scroll si la página es la misma. Se recuerda la elección; primera visita → idioma del navegador.

### 6.11 Menú en celular
- El botón hamburguesa (`ui-menu`, `aria-expanded`) abre un panel a pantalla completa: nav numerada `01 INICIO … 05 CONTACTO` en mono grande, ES/EN y redes abajo. Las líneas de la hamburguesa rotan a una `×` (`ui-cerrar`) en 200 ms. Trampa de foco, `Esc` cierra, bloquea el scroll del fondo.

---

## 7. Animaciones y movimiento

| # | Animación | Dónde | Detalle | Prioridad |
|---|---|---|---|---|
| 7.1 | **Entrada «líneas de construcción»** | Primera carga de cada página | Los marcos (outlines de imágenes y cajas) se dibujan como trazo SVG (`--t-draw`), luego entra el contenido con opacity + 8 px (`--t-enter`), escalonado `--stagger`. Solo la primera vez por sesión. | Alta |
| 7.2 | **Revelado al hacer scroll** | Bloques debajo del pliegue | `IntersectionObserver` (o `animation-timeline: view()`): opacity 0→1 + 8 px, 400 ms, una sola vez. | Alta |
| 7.3 | **Subrayado que se dibuja** | Links | §6.1 | Alta |
| 7.4 | **View Transitions** | Tarjeta → detalle | La portada de la tarjeta se transforma en la portada del detalle (`view-transition-name: fig-03`). El resto hace crossfade de 200 ms. Fallback: navegación normal. | Media |
| 7.5 | **Ícono que se dibuja** | Categorías, íconos en hover | `stroke-dasharray`/`dashoffset` 500 ms. Todos los íconos usan trazo, así que funciona con cualquiera. | Media |
| 7.6 | **Regla de progreso** | Detalle de proyecto | §6.7 | Media |
| 7.7 | **Cronograma que se dibuja** | Experiencias | §6.8 | Media |
| 7.8 | **Coordenadas vivas** | Footer en escritorio | Opcional: `ESC 1:1` muestra la posición del puntero en «mm» (`X 0412 · Y 0188`) con números tabulares. Se activa al pasar sobre el footer o con un toggle. Desactivado en táctil. | Baja / divertida |
| 7.9 | **Contador mecánico** | Contadores `×2` y años | Al cambiar, los dígitos se deslizan verticalmente como un contador de odómetro (150 ms). | Baja |

`prefers-reduced-motion: reduce` → todo lo de esta tabla se apaga salvo cambios de color/opacidad instantáneos.

---

## 8. Imágenes y gráficos custom

### 8.1 Tratamiento cianotipo para fotos
Todas las portadas pasan por un **duotono** en build (con `sharp`): sombras `#0C2340` → luces `#EAF3FC`. Da unidad aunque las fotos vengan de celular. En hover/foco la tarjeta revela la foto original a color (§6.3). En el detalle de proyecto la portada se muestra **a color**.

### 8.2 Ilustraciones de línea propias (SVG)
Dibujadas con el mismo trazo de 1–1.25 px, sin relleno, animables con «dibujado»:
- **Hero de Inicio (opcional):** despiece isométrico de una celda 18650 (carcasa, jelly-roll, tapa con CID) o el contorno lateral del auto de Formula SAE, con 2–3 cotas reales. Se dibuja una vez al cargar.
- **Por proyecto:** un esquema propio (despiece, diagrama eléctrico, flujo de datos) como «LÁMINA 2» del proyecto. Campo opcional `esquema: ./esquema.svg` en el frontmatter.
- **Separadores:** cota horizontal (`deco-cota`) con un texto en el medio (`SECCIÓN 02`).
- **404:** «LÁMINA NO ENCONTRADA»: una cota rota con el texto `ERR 404 · REV. —`.

### 8.3 Íconos
`design/iconos/`: **20 SVG de partida** (abrir `_vista-previa.html`). Sistema: grilla de 24, trazo 1.25, extremos cuadrados, unión en ángulo, `currentColor`, sin relleno.
- Categorías: `cat-impresion-3d`, `cat-home-automation`, `cat-ingenieria-mecanica`, `cat-baterias`, `cat-vibe-code`, `cat-otros`.
- Interfaz: `ui-flecha`, `ui-externo`, `ui-descargar`, `ui-play`, `ui-menu`, `ui-cerrar`, `ui-copiar`, `ui-check`, `ui-idioma`, `ui-grilla`, `ui-lista`, `ui-mira`.
- Decorativos: `deco-cota`, `deco-esquina`.
Son un primer trazo: refinarlos a mano (Figma/Illustrator) antes de producción. Integrarlos como componente `<Icon name="…" />` con SVG en línea (para poder animar el trazo).

### 8.4 Otros
- **Favicon / ícono de app:** monograma `BF` en mono dentro de un cuadrado tipo cajetín, acento sobre papel. SVG + PNG 180/512.
- **Imágenes OG por proyecto:** generadas en build (Satori / `@vercel/og`): fondo papel con retícula, `FIG. 03`, título, categorías y cajetín con fecha. Una por idioma.
- **Skeleton de carga:** el mismo rayado a 45° de los placeholders, con un barrido de luminosidad lento (1.5 s). Sin barrido con reduced-motion.
- **Cursor:** dejar el del sistema. Opcional, solo sobre imágenes ampliables: cursor `zoom-in`.

---

## 9. Accesibilidad (requisitos, no sugerencias)

- Contraste de texto ≥ 4.5:1 (los tokens ya cumplen; `--c-line` nunca para texto).
- Foco visible en todo (`outline: 2px solid var(--c-accent); outline-offset: 2px`).
- HTML semántico: `<nav>` con `aria-label`, `aria-current`, `<button>` para acciones y `<a>` para navegación, `<dl>` para cajetines, `<table>` con `<th scope>`.
- Link «Saltar al contenido» al inicio.
- Áreas táctiles ≥ 44 × 44 px.
- `alt` real en fotos; SVG decorativos con `aria-hidden="true"`.
- Todo lo que aparece en hover está disponible con foco y con toque.
- Probar con VoiceOver y solo teclado antes de cerrar cada pantalla.

## 10. Rendimiento y SEO

- Fuentes autoalojadas en woff2 con subset y `font-display: swap`; precargar solo Instrument Sans 400.
- Imágenes AVIF/WebP con `srcset`, `loading="lazy"` debajo del pliegue, dimensiones explícitas (CLS 0).
- JS total < 30 KB comprimido en páginas de contenido.
- `sitemap.xml`, `hreflang` ES/EN, metadatos y OG por página, datos estructurados `Person` y `CreativeWork`.

---

## 11. Plan sugerido para Claude Code

1. **Base:** proyecto, tokens, fuentes, layout (header, footer, contenedor, retícula), i18n, rutas vacías.
2. **Contenido:** colecciones `proyectos` y `experiencias` con los 3 proyectos de ejemplo de las referencias.
3. **Pantallas estáticas:** las 6 pestañas fieles a las referencias, responsive, sin animaciones.
4. **Interacciones prioridad alta:** §6.1–6.3, 6.5, 6.7, 6.9–6.11, §7.1–7.3.
5. **Prioridad media:** filtros (6.6), cronograma (6.8), View Transitions, regla de progreso, íconos animados.
6. **Gráficos:** duotono en build, OG, favicon, 404.
7. **Pulido:** prioridad baja (7.8, 7.9), auditoría de accesibilidad y Lighthouse.

Cada paso termina con capturas en 375 / 768 / 1280 / 1440 px para revisión.

## 12. Preguntas abiertas

1. ¿Hay repo o sitio existente, o arrancamos de cero? ¿Dominio ya comprado?
2. Stack y hosting: ¿Astro + Cloudflare Pages está bien?
3. ¿Dónde llegan los mensajes del formulario?
4. Acento final: ¿cian `#7FD6FF`, o se deja configurable?
5. Contenido real: años de cada experiencia, rol en Fing Hydrogen Racing, título del artículo en *Fire*, email, usuarios de redes, CV en PDF.
6. ¿Versión EN completa desde v1 o primero solo ES?
7. ¿Ilustración de hero (celda 18650 vs. auto FSAE) o solo retrato?

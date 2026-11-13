# Plan de trabajo: brunofrankenstein.com

Portfolio personal de Bruno Frankenstein (ingeniero mecánico): proyectos y experiencias puntuales,
optimizado para que lo encuentren Google y los asistentes de IA.

Este archivo es la fuente de verdad para trabajar desde Claude Code. Va en la raíz del repositorio.
Cada agente lee primero "Decisiones tomadas" y "Contrato de contenido", y luego solo su pista.

---

## 1. Decisiones tomadas (no reabrir sin consultar a Bruno)

| Tema | Decisión |
|---|---|
| Dominio | `brunofrankenstein.com`, registrado en Cloudflare |
| Generador | Astro (última versión estable), salida estática |
| Contenido | Markdown en el repositorio, con colecciones de contenido de Astro |
| Panel de edición | Sveltia CMS en `/admin`. Reemplazo si falla: Pages CMS |
| Repositorio | GitHub |
| Alojamiento | Cloudflare (Pages o Workers con assets estáticos, lo que Cloudflare recomiende hoy) |
| Idiomas | Español e inglés, ambos con prefijo: `/es/` y `/en/`. La raíz `/` redirige al idioma principal |
| Idioma principal | Español. Debe poder cambiarse con una sola constante de configuración |
| Contacto | Formulario que envía un correo a Bruno, más enlace a LinkedIn |
| Costo fijo | Solo el dominio |
| Diseño visual | Fuera de v1. En v1 va un estilo mínimo, limpio y legible |

### Categorías de proyectos (en este orden)

| Orden | Español | Inglés | Slug |
|---|---|---|---|
| 1 | Impresión 3D | 3D Printing | `impresion-3d` / `3d-printing` |
| 2 | Home Automation | Home Automation | `home-automation` |
| 3 | Ingeniería Mecánica | Mechanical Engineering | `ingenieria-mecanica` / `mechanical-engineering` |
| 4 | Baterías | Batteries | `baterias` / `batteries` |
| 5 | Vibe Code | Vibe Code | `vibe-code` |
| 6 | Otros | Other | `otros` / `other` |

Un proyecto puede tener varias categorías y aparece en el listado de cada una.
Tiene una sola URL propia, que no incluye la categoría, para evitar contenido duplicado.

### Fuera de v1

Comentarios, newsletter, buscador interno, diseño visual definitivo.

---

## 2. Criterios de éxito

- [ ] Buscar "Bruno Frankenstein" en Google y Bing devuelve el sitio en la primera página
      (tarda semanas o meses; no se puede garantizar).
- [ ] Los asistentes de IA con búsqueda citan el sitio al preguntarles por Bruno.
- [ ] Bruno publica un proyecto nuevo en ambos idiomas desde el panel, sin IA, en menos de 30 minutos.
- [ ] Lighthouse: 95 o más en rendimiento, SEO y accesibilidad, en inicio y en una página de proyecto.
- [ ] Cambiar el idioma principal no rompe ninguna URL existente.

---

## 3. Contrato de contenido

Lo define la etapa 1 y lo usan todas las pistas. Cambiarlo después requiere avisar a las demás.

### Estructura de carpetas

```
src/
  config/site.ts          # idioma principal, categorías, datos de Bruno, redes
  content/
    proyectos/<slug>/es.md
    proyectos/<slug>/en.md
    proyectos/<slug>/*.jpg|png|webp|mp4   # medios del proyecto
    experiencias/<slug>/es.md
    experiencias/<slug>/en.md
  content.config.ts       # esquemas
  i18n/                   # textos de interfaz es/en
  layouts/
  components/
    seo/                  # pista C
    contact/              # pista D
  pages/
    index.astro           # redirige al idioma principal
    [lang]/...
public/
  admin/                  # pista B
functions/                # pista D (o worker equivalente)
```

### Campos de un proyecto

| Campo | Tipo | Obligatorio | Nota |
|---|---|---|---|
| `title` | texto | sí | |
| `summary` | texto, 160 caracteres máx. | sí | Se usa como meta descripción |
| `date` | fecha | sí | Fecha del proyecto |
| `updated` | fecha | no | |
| `categories` | lista de slugs | sí, al menos una | Slugs neutros definidos en `site.ts` |
| `cover` | imagen | sí | Con `coverAlt` obligatorio |
| `youtube` | ID de video | no | Se incrusta con carga diferida |
| `repo` | URL de GitHub | no | |
| `tags` | lista de texto | no | |
| `featured` | booleano | no | Destacado en el inicio |
| `draft` | booleano | no | No se publica ni se indexa |

El cuerpo es Markdown: texto, imágenes con texto alternativo, GIF o video corto.
Si hay video de YouTube, el cuerpo debe incluir un resumen escrito de lo que muestra.

### Campos de una experiencia

`title`, `summary`, `organization` (opcional), `role` (opcional), `start`, `end` (opcional),
`cover` (opcional), `draft`. Cuerpo en Markdown.

### URLs

| Página | Español | Inglés |
|---|---|---|
| Inicio | `/es/` | `/en/` |
| Sobre mí | `/es/sobre-mi/` | `/en/about/` |
| Proyectos | `/es/proyectos/` | `/en/projects/` |
| Categoría | `/es/proyectos/categoria/<slug>/` | `/en/projects/category/<slug>/` |
| Proyecto | `/es/proyectos/<slug>/` | `/en/projects/<slug>/` |
| Experiencias | `/es/experiencias/` | `/en/experience/` |
| Contacto | `/es/contacto/` | `/en/contact/` |

Si un proyecto existe en un solo idioma, se publica solo en ese y no se enlaza como traducción.

---

## 4. Etapas

### Etapa 0: cuentas (Bruno, manual)

- [ ] Comprar `brunofrankenstein.com` en Cloudflare.
- [ ] Activar Email Routing y crear una dirección (por ejemplo `hola@`) que reenvíe al correo personal.
- [ ] Crear un repositorio vacío en GitHub y abrirlo en Claude Code.
- [ ] Copiar este archivo a la raíz del repositorio.

### Etapa 1: base (un solo agente, secuencial)

Bloquea todo lo demás. No paralelizar.

- [ ] Crear el proyecto Astro con TypeScript.
- [ ] Escribir `src/config/site.ts`: idioma principal, lista ordenada de categorías con nombre y slug por idioma.
- [ ] Escribir los esquemas de `proyectos` y `experiencias` según el contrato.
- [ ] Armar las rutas `/es/` y `/en/`, la redirección de la raíz y un selector de idioma.
- [ ] Crear un layout base con un hueco para la cabecera SEO (lo completa la pista C).
- [ ] Cargar un proyecto y una experiencia de ejemplo en ambos idiomas, marcados para borrar antes del lanzamiento.
- [ ] Conectar el repositorio a Cloudflare y desplegar en el dominio.
- [ ] Escribir un `CLAUDE.md` breve: comandos, estructura y reglas de este plan.

**Listo cuando:** `brunofrankenstein.com` muestra el sitio de ejemplo en ambos idiomas y el build pasa sin errores.

### Etapa 2: construcción (pistas en paralelo)

Cada pista trabaja en su rama y solo toca su zona. Las pistas A a D arrancan al terminar la etapa 1.

#### Pista A: páginas — rama `pista-a-paginas`

Zona: `src/pages`, `src/layouts`, `src/components` (excepto `seo/` y `contact/`), `src/i18n`.

- [ ] Inicio: presentación breve, proyectos destacados, categorías.
- [ ] Sobre mí.
- [ ] Listado de proyectos con filtro por categoría, en el orden definido.
- [ ] Página de categoría: un proyecto con varias categorías aparece en cada una.
- [ ] Página de proyecto: portada, texto, galería, video de YouTube con carga diferida, enlace al repositorio.
- [ ] Listado y página de experiencias.
- [ ] Página de contacto que monta el componente de la pista D.
- [ ] Página 404 en ambos idiomas.
- [ ] Imágenes optimizadas con el componente de imágenes de Astro.
- [ ] Estilo mínimo, adaptable a celular, con contraste accesible.

**Listo cuando:** todas las URLs del contrato responden en ambos idiomas con el contenido de ejemplo.

#### Pista B: panel de edición — rama `pista-b-panel`

Zona: `public/admin`.

- [ ] Verificar primero en la documentación de Sveltia CMS: inicio de sesión con GitHub y soporte de
      contenido en dos idiomas con la estructura `<slug>/es.md` y `<slug>/en.md`.
      Si no encaja, avisar antes de cambiar el contrato o pasar a Pages CMS.
- [ ] Configurar las colecciones `proyectos` y `experiencias` con los campos del contrato.
- [ ] Categorías como selección múltiple, en el orden definido.
- [ ] Subida de imágenes a la carpeta del proyecto.
- [ ] Edición de ambos idiomas en la misma pantalla.
- [ ] Bloquear `/admin` a los buscadores.
- [ ] Escribir `docs/como-publicar.md`: guía paso a paso para Bruno, sin IA.

**Listo cuando:** se crea un proyecto desde `/admin`, se guarda como commit en GitHub y aparece publicado.

#### Pista C: SEO y visibilidad en IA — rama `pista-c-seo`

Zona: `src/components/seo`, la cabecera del layout base, `public/robots.txt`, configuración de sitemap.

- [ ] Componente de cabecera: título, descripción, URL canónica, Open Graph y tarjetas para redes.
- [ ] Etiquetas `hreflang` entre versiones de idioma, con `x-default` apuntando al idioma principal.
- [ ] Datos estructurados JSON-LD:
  - `Person` y `ProfilePage` en inicio y sobre mí, con `sameAs` a LinkedIn, GitHub y YouTube.
  - `WebSite` en el inicio.
  - `CreativeWork` o `Article` en cada proyecto, con autor, fechas e imagen.
  - `VideoObject` cuando hay video de YouTube.
  - `BreadcrumbList` en proyectos y categorías.
- [ ] Sitemap con ambos idiomas, sin borradores.
- [ ] `robots.txt` que permita buscadores y rastreadores de IA (GPTBot, OAI-SearchBot, ClaudeBot,
      PerplexityBot, Google-Extended) y bloquee `/admin`.
- [ ] `llms.txt` con resumen de quién es Bruno y enlaces a las secciones. Su efecto real es incierto; cuesta poco.
- [ ] Feed RSS por idioma.
- [ ] Imagen Open Graph por defecto y por proyecto (la portada).
- [ ] Validar los datos estructurados con la prueba de resultados enriquecidos de Google.

**Listo cuando:** inicio y una página de proyecto pasan la validación de datos estructurados y Lighthouse SEO da 100.

#### Pista D: contacto — rama `pista-d-contacto`

Zona: `functions` (o worker equivalente), `src/components/contact`.
Requiere el dominio activo y Email Routing configurado.

- [ ] Verificar primero en la documentación de Cloudflare si un Worker puede enviar correo a una dirección
      verificada mediante Email Routing. Si no, usar Resend en su plan gratuito.
- [ ] Formulario accesible: nombre, correo, mensaje, en ambos idiomas.
- [ ] Protección anti-spam con Cloudflare Turnstile y un campo trampa.
- [ ] Función que valida los datos y envía el correo, con el remitente del visitante en "responder a".
- [ ] Mensajes de éxito y de error en ambos idiomas.
- [ ] Las claves van como secretos de Cloudflare, nunca en el repositorio.
- [ ] El correo personal de Bruno no aparece en el código ni en el HTML.

**Listo cuando:** un envío desde el sitio publicado llega a la casilla de Bruno y un envío sin Turnstile se rechaza.

#### Pista E: contenido (Bruno, sin depender del código)

- [ ] Texto de "sobre mí" en español: quién es, qué hace, qué busca. Pegar el texto del perfil de LinkedIn.
- [ ] Foto de perfil.
- [ ] Enlaces a LinkedIn, GitHub y canal de YouTube.
- [ ] Primer proyecto: texto, 3 a 6 fotos y, si existe, video y repositorio.
- [ ] Revisar las traducciones al inglés que redacte la IA.

### Etapa 3: integración (un solo agente, secuencial)

- [ ] Unir las ramas en este orden: A, C, B, D. Resolver conflictos en la cabecera a favor de C.
- [ ] Build limpio y revisión de enlaces rotos.
- [ ] Lighthouse en inicio, proyecto y categoría, en celular y escritorio.
- [ ] Revisar ambos idiomas página por página.
- [ ] Borrar el contenido de ejemplo y cargar el de la pista E.
- [ ] Prueba de aceptación: Bruno publica un proyecto desde el panel siguiendo `docs/como-publicar.md`, sin IA.

### Etapa 4: lanzamiento

- [ ] Alta y verificación en Google Search Console; enviar el sitemap.
- [ ] Alta en Bing Webmaster Tools; enviar el sitemap.
- [ ] Activar Cloudflare Web Analytics.
- [ ] Poner el sitio en LinkedIn, en el perfil de GitHub y en la descripción del canal de YouTube.
- [ ] A las 2 y a las 6 semanas: buscar el nombre en Google, Bing y dos asistentes de IA, y anotar el resultado.

### Etapa 5: diseño visual y crecimiento

- [ ] Definir identidad visual: tipografía, colores, animaciones.
- [ ] Aplicarla sobre las plantillas sin tocar el contrato de contenido.
- [ ] Bruno sigue cargando proyectos. Objetivo: 5 o 6 publicados.

---

## 5. Dependencias

```
Etapa 0 ──> Etapa 1 ──┬──> Pista A ──┐
                      ├──> Pista B ──┤
                      ├──> Pista C ──┼──> Etapa 3 ──> Etapa 4 ──> Etapa 5
                      └──> Pista D ──┘
Pista E (Bruno) ─────────────────────┘
```

## 6. Reglas para agentes en paralelo

1. Un agente por pista, cada uno en su rama o worktree.
2. No tocar archivos fuera de la zona de la pista. Si hace falta, anotarlo en la sección 8 y avisar.
3. El contrato de contenido no se cambia dentro de una pista.
4. La cabecera de las páginas es de la pista C. La pista A solo invoca el componente.
5. Ningún secreto ni dato personal privado en el repositorio.
6. Antes de dar una pista por terminada: build limpio y su criterio "Listo cuando" comprobado.

## 7. Cómo lanzar cada parte en Claude Code

- Etapa 1: `Lee PLAN.md y ejecuta la etapa 1. No avances a la etapa 2.`
- Pistas: una sesión o un subagente con worktree por pista:
  `Lee PLAN.md y ejecuta solo la pista C en su rama. Respeta las reglas de la sección 6.`
- Etapa 3: `Lee PLAN.md y ejecuta la etapa 3.`

## 8. Puntos abiertos y notas

- [ ] Verificar inicio de sesión y manejo de dos idiomas en Sveltia CMS (pista B).
- [ ] Verificar envío de correo desde Cloudflare sin servicio externo (pista D).
- [ ] Falta el texto del perfil de LinkedIn para "sobre mí" y los datos estructurados (pista E).
- [ ] Repositorio público o privado: a definir por Bruno. Ambos funcionan con Cloudflare.

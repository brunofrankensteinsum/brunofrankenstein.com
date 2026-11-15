# brunofrankenstein.com

Portfolio personal de Bruno Frankenstein. Sitio estático con Astro, bilingüe (es/en).
El plan completo, las decisiones tomadas y el contrato de contenido están en `PLAN.md`: leerlo antes de trabajar.
Lo que falta hacer, en orden de prioridad, está en `TAREAS.md`: marcar cada tarea al terminarla.

## Comandos

- `npm install`: instala las dependencias.
- `npm run dev`: servidor local en http://localhost:4321 con recarga automática.
- `npm run build`: genera el sitio en `dist/`. Falla si algún contenido no cumple el esquema.
- `npm run check`: revisa errores de tipos.

## Estructura

- `src/config/site.ts`: idioma principal, categorías y datos del sitio.
- `src/config/routes.ts`: todas las URLs por idioma. Armar enlaces siempre con estas funciones.
- `src/content.config.ts`: esquemas de proyectos y experiencias (contrato de contenido).
- `src/content/<colección>/<slug>/es.md` y `en.md`: contenido, con sus imágenes en la misma carpeta.
- `src/pages/es/` y `src/pages/en/`: un archivo por URL. Son envoltorios de pocas líneas.
- `src/components/pages/`: el contenido real de cada página, compartido por ambos idiomas.
- `src/components/seo/Head.astro`: cabecera SEO de cada página (título, descripción, idiomas, Open Graph, ícono).
- `src/pages/sitemap.xml.ts` y `src/pages/robots.txt.ts`: se generan solos al compilar.
- `src/scripts/`: el JavaScript de las interacciones. `en-linea.mjs` tiene los dos scripts que van dentro del HTML.
- `src/config/glossary.mjs`: términos técnicos que el sitio explica con una nota.
- `src/config/profile.ts`: textos de presentación, email, CV y dirección de envío del formulario.
- `public/_headers`: cabeceras de seguridad y de caché que aplica Cloudflare.
- `astro.config.mjs`: incluye la política de seguridad de contenido (`security.csp`). Si se agrega contenido
  de otro dominio (un video, un mapa, un servicio de formularios), hay que permitirlo ahí o el navegador lo bloquea.
- `scripts/generar-favicon.mjs`: regenera el ícono del sitio.
- `src/components/layout/`: header, footer, selector de idioma y menú de celular.
- `src/components/ui/`: piezas chicas reutilizables (`Icon`, `Placeholder`, `PageIntro`).
- `src/styles/tokens.css`: colores, tipografía, espaciado y movimiento. `src/styles/base.css`: estilos comunes.
- `src/icons/`: íconos SVG. Se usan con `<Icon name="ui-flecha" />`.
- `public/fonts/`: fuentes autoalojadas (Instrument Sans y Fragment Mono, licencia OFL).
- `src/i18n/ui.ts`: textos de interfaz.
- `design/`: entrega del diseño C1 «Cianotipo». `design/HANDOFF.md` es la especificación de interfaz e
  interacciones; manda en lo visual. En contenido, URLs y edición manda `PLAN.md`.
- `npm test`: pruebas del formulario de contacto (`worker/contacto.test.mjs`).
- `worker/` y `wrangler.jsonc`: el servidor del formulario (`/api/contacto`). El correo de Bruno es un secreto de
  Cloudflare, nunca va en el repositorio ni se muestra en el sitio. Configuración: `docs/formulario-contacto.md`.
- `src/lib/validar-contenido.mjs`: avisos al compilar (es/en completos y coherentes, imágenes con texto alternativo).
- Experiencias: el campo `kind` (`formacion`, `trabajo` o `publicacion`) alimenta el filtro de la página.
- `npm run lamina -- "Título"`: crea una lámina nueva (carpeta, `es.md`, `en.md`, número `fig` siguiente). Plantilla de formato en `docs/plantillas/lamina-ejemplo.md`.
- `src/assets/retrato.jpg`: foto de perfil de Bruno (Inicio y Sobre mí). Si no existe, se ve un marcador.
- `docs/guia-obsidian.md`: cómo escribir láminas con Obsidian (ajustes, fotos, cabecera).
- `docs/instructivo-publicar-proyecto.md`: cómo convertir la información de un proyecto en una publicación. Seguirlo cuando Bruno pida publicar un proyecto.
- `docs/prompt-claude-design.md`: prompt para generar el diseño visual en Claude Design.

## Reglas

- Una página nueva necesita un envoltorio en `src/pages/es/` y otro en `src/pages/en/`, con las rutas de `PLAN.md`.
- No cambiar el contrato de contenido sin avisar a Bruno.
- No editar nada dentro de `dist/`: es el sitio ya compilado y se regenera entero en cada build. Los textos
  se cambian en `src/` (por ejemplo `src/config/profile.ts` y `src/i18n/ui.ts`).
- Publicar es unir un pull request con `main`; Cloudflare despliega solo. No hacer push directo a `main`.
- Ningún secreto ni dato personal privado en el repositorio.
- Bruno está aprendiendo Git, HTML y CSS: comentar el código en español y explicar los cambios en simple.
- Antes de dar algo por terminado: `npm run build` y `npm run check` sin errores.

# brunofrankenstein.com

Portfolio personal de Bruno Frankenstein. Sitio estático con Astro, bilingüe (es/en).
El plan completo, las decisiones tomadas y el contrato de contenido están en `PLAN.md`: leerlo antes de trabajar.

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
- `src/components/seo/`: cabecera SEO (pista C).
- `src/components/layout/`: header, footer, selector de idioma y menú de celular.
- `src/components/ui/`: piezas chicas reutilizables (`Icon`, `Placeholder`, `PageIntro`).
- `src/styles/tokens.css`: colores, tipografía, espaciado y movimiento. `src/styles/base.css`: estilos comunes.
- `src/icons/`: íconos SVG. Se usan con `<Icon name="ui-flecha" />`.
- `public/fonts/`: fuentes autoalojadas (Instrument Sans y Fragment Mono, licencia OFL).
- `src/i18n/ui.ts`: textos de interfaz.
- `design/`: entrega del diseño C1 «Cianotipo». `design/HANDOFF.md` es la especificación de interfaz e
  interacciones; manda en lo visual. En contenido, URLs y edición manda `PLAN.md`.
- `docs/instructivo-publicar-proyecto.md`: cómo convertir la información de un proyecto en una publicación. Seguirlo cuando Bruno pida publicar un proyecto.
- `docs/prompt-claude-design.md`: prompt para generar el diseño visual en Claude Design.

## Reglas

- Una página nueva necesita un envoltorio en `src/pages/es/` y otro en `src/pages/en/`, con las rutas de `PLAN.md`.
- No cambiar el contrato de contenido sin avisar a Bruno.
- Ningún secreto ni dato personal privado en el repositorio.
- Bruno está aprendiendo Git, HTML y CSS: comentar el código en español y explicar los cambios en simple.
- Antes de dar algo por terminado: `npm run build` y `npm run check` sin errores.

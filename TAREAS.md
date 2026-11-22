# Tareas pendientes: brunofrankenstein.com

Lista de lo que falta después de publicar el diseño C1 «Cianotipo» (pasos 1 a 4).
Complementa a `PLAN.md`: el plan dice qué se decidió; esta lista dice qué hacer ahora y en qué orden.

- **Estado al 2026-11-15:** sitio publicado con el diseño nuevo, contenido de ejemplo y marcadores a la vista.
- **Quién:** `[Bruno]` solo lo puede hacer Bruno (cuentas, datos, decisiones) · `[IA]` lo puede hacer Claude en el repo · `[Ambos]` la IA prepara y Bruno revisa.
- **Medido:** los datos marcados «hoy» salen de revisar el sitio publicado y el repo el 2026-11-15.
- Al terminar una tarea, marcarla con `[x]`. Si se descarta, tacharla y anotar por qué.

## Por dónde empezar

1. A1 y A3 — decidir qué hacer con los proyectos de ejemplo y si el sitio se indexa mientras tanto.
2. B1 y B3 — forzar HTTPS y redirigir `www` en Cloudflare.
3. B5 y B6 — proteger `main` (exigir que pase la revisión automática) y activar el doble factor.
4. C2 — sacar el repo de OneDrive.
5. A2 — cargar los datos reales y el primer proyecto real (con `npm run lamina` y `npm run imagenes`).
6. E13 a E15 — alta en buscadores, enlaces hacia el sitio y estadísticas, al quitar A3.

---

## A. Lo que hoy está a la vista del público

- [x] **A1. Proyectos de ejemplo** `[Bruno]` — Los tres proyectos (FIG. 01 a 03) salieron del diseño, no son reales, y hoy se ven como si lo fueran. Elegir: ocultarlos con `draft: true` hasta tener uno real, o dejarlos con un aviso «ejemplo». *Listo cuando:* ningún visitante puede tomar un ejemplo por un proyecto real. **Hecho el 2026-11-15:** se borraron los tres ejemplos y la lámina en preparación (siguen en el historial de Git); queda solo «Gridfinity Autobin» (FIG. 01), destacada en el inicio.
- [ ] **A2. Completar los marcadores** `[Bruno]` — Cada dato y dónde se carga:
  - ~~Retrato~~ → hecho el 2026-11-15: `src/assets/retrato.jpg` (sin datos de ubicación) se ve en Inicio y Sobre mí. Para cambiarlo, reemplazar el archivo con el mismo nombre.
  - ~~Email público~~ → decidido: no se publica; se contacta por el formulario (H4).
  - ~~CV~~ → hecho: el botón «Ver CV» abre la página de CVuy (campo `cv` de `profile.ts`).
  - ~~Párrafo pendiente y herramientas de Sobre mí~~ → borrador escrito el 2026-11-22 en `profile.ts` (párrafo + lista de materiales en 6 celdas). Falta que Bruno lo revise y lo ajuste con sus respuestas.
  - Años de inicio de Faraday Lab, Fing Hydrogen Racing y la carrera; rol en el equipo → `src/content/experiencias/*/es.md` y `en.md`.
  - Título, coautores y enlace del artículo en *Fire* → `src/content/experiencias/publicacion-fire/`.
- [ ] **A3. No indexar hasta el lanzamiento** `[Bruno]` — El interruptor ya existe: `indexable` en `src/config/site.ts`. Con `false`, todas las páginas piden «no indexar» y el sitemap queda vacío. Hoy está en `true`. Falta decidir si se apaga mientras haya ejemplos y marcadores, y volver a prenderlo el día del lanzamiento.
- [ ] **A4. Unificar los textos de presentación** `[Bruno]` — Inicio dice «participo en Fing Hydrogen Racing» y Sobre mí todavía dice «corro con». Revisar también la redacción de la bajada de Proyectos.
- [ ] **A5. Revisar el inglés** `[Bruno]` — Todas las traducciones las hizo la IA: `src/i18n/ui.ts`, `src/config/profile.ts` y los `en.md`.
- [ ] **A6. Confirmar el glosario** `[Bruno]` — Las siete definiciones de `src/config/glossary.mjs` las redactó la IA.

## B. Seguridad

- [ ] **B1. Forzar HTTPS** `[Bruno]` — Hoy `http://brunofrankenstein.com` responde sin redirigir a `https://`. En Cloudflare: SSL/TLS → Edge Certificates → activar «Always Use HTTPS» y HSTS. *Listo cuando:* abrir con `http://` lleva solo a `https://`.
- [x] **B2. Cabeceras de seguridad** `[IA]` — Hecho el 2026-11-15. `public/_headers` agrega `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` y `Permissions-Policy`. La política de contenido (CSP) la escribe Astro en cada página (`security.csp` en `astro.config.mjs`): solo corren los scripts propios y el único contenido ajeno permitido es el reproductor de `youtube-nocookie.com`. Probado sobre el sitio compilado: todo funciona y un script o una imagen ajenos quedan bloqueados. *Falta:* al publicarlo, comprobar las cabeceras en el sitio real y pasar securityheaders.com. HSTS queda en B1, del lado de Cloudflare.
- [ ] **B3. `www` da error** `[Bruno]` — `www.brunofrankenstein.com` responde 404. Crear en Cloudflare una regla que redirija `www` al dominio sin `www`.
- [x] **B4. Validar el identificador de YouTube** `[IA]` — Hecho el 2026-11-15 en `src/content.config.ts`: exige 11 caracteres (letras, números, «-» y «_»). Se acepta `VIDEO_ID` como marcador de los ejemplos.
- [ ] **B5. Proteger la rama `main`** `[Bruno]` — En GitHub: exigir pull request y que el build pase antes de unir. Activar «secret scanning», «push protection» y las alertas de Dependabot.
- [ ] **B6. Doble factor en las cuentas** `[Bruno]` — Las dos cuentas de GitHub y la de Cloudflare.
- [x] **B7. Fotos sin datos privados** `[IA]` — Hecho el 2026-11-15: `npm run imagenes -- <carpeta>` borra siempre los metadatos (GPS, cámara, fecha) y deja los originales en `_originales/`, que Git ignora. Probado con una foto que traía GPS. *Falta (hábito de Bruno):* correr el comando antes de subir fotos nuevas.
- [ ] **B8. Correo del dominio** `[Bruno]` — Crear la dirección pública con Email Routing (por ejemplo `hola@`) para no publicar el correo personal, y cargar los registros SPF y DMARC para que nadie envíe correo haciéndose pasar por el dominio.
- [x] **B9. Seguridad del formulario (va con la pista D)** `[IA]` — Hecho en el código el 2026-11-15 (`worker/contacto.js`, con pruebas): validación de nuevo en el servidor, límite de tamaño, Turnstile, solo pedidos del propio dominio, sin inyección de cabeceras, y claves como secretos de Cloudflare. *Falta (Bruno):* crear la regla de límite de envíos del paso 5 de `docs/formulario-contacto.md`.
- [ ] **B10. Seguridad del panel (va con la pista B)** `[IA]` — Si se hace `/admin`: acceso solo para la cuenta de Bruno, permisos mínimos en GitHub y bloqueo a buscadores.
- [x] **B11. Dependencias al día** `[IA]` — Hecho el 2026-11-15: `.github/dependabot.yml` pide una revisión semanal (npm) y mensual (GitHub Actions), agrupando las actualizaciones menores. Se activa al unir el cambio con `main`.

## C. Publicación y forma de trabajo

- [ ] **C1. Permiso de escritura en GitHub** `[Bruno]` — Esta máquina usa la cuenta `BrunoFrankenstein`, que solo puede leer el repo de `brunofrankensteinsum`. Invitarla como colaboradora con rol Write, o iniciar sesión acá con la cuenta dueña. *Listo cuando:* `git push` funciona sin pasos a mano en GitHub.
- [ ] **C2. Sacar el repo de OneDrive** `[Bruno]` — Ya perdió archivos una vez por la sincronización. Moverlo a una carpeta que OneDrive no toque (por ejemplo `C:\dev\`). GitHub ya es la copia de respaldo.
- [ ] **C3. Vista previa antes de publicar** `[Bruno]` — Activar en Cloudflare los despliegues de prueba por rama, para ver un cambio en una dirección temporal antes de unirlo a `main`.
- [x] **C4. Revisión automática** `[IA]` — Hecho el 2026-11-15: `.github/workflows/revision.yml` corre `npm test`, `npm run build` y `npm run check` en cada pull request. *Falta (Bruno):* en B5, exigir que pase antes de unir.
- [x] **C5. No editar `dist/`** `[IA]` — Hecho el 2026-11-15. La regla está en `CLAUDE.md` y `.vscode/settings.json` oculta `dist/`, `.astro/` y `node_modules/` en VS Code.
- [x] **C6. Finales de línea** `[IA]` — Hecho el 2026-11-15 con `.gitattributes`.
- [ ] **C7. Misma versión de Node** `[Bruno]` — El proyecto pide Node 22 (`.node-version`) y esta máquina tiene la 25. Instalar la 22 para compilar igual que Cloudflare.
- [x] **C8. Capturas con un comando** `[IA]` — Hecho el 2026-11-15: `npm run capturas` (con `npm run dev` andando) saca las 5 páginas en 375, 768, 1280 y 1440 px a la carpeta `capturas/`. Con argumentos elige otras páginas. Usa Edge o Chrome ya instalado.
- [x] **C9. Poner `PLAN.md` al día** `[IA]` — Hecho el 2026-11-15: marcadas las pistas A, C y D; la B (panel) y las pruebas de aceptación siguen abiertas.
- [ ] **C10. Borrar la rama `diseno-c1`** `[Bruno]` — Ya está unida a `main`. De acá en más, una rama corta por cada cambio.

## D. Cargar láminas nuevas con facilidad

- [x] **D1. Comando «lámina nueva»** `[IA]` — Hecho el 2026-11-15. `npm run lamina -- "Título del proyecto"` crea la carpeta con el slug, `es.md` y `en.md` con la cabecera (campos comentados para completar) y el siguiente número de `fig` libre; la lámina nace «en preparación». Probado: el sitio compila con la lámina creada.
- [x] **D2. Plantilla comentada** `[IA]` — Hecho el 2026-11-15 en `docs/plantillas/lamina-ejemplo.md`: subtítulos numerados, pie de foto en cursiva, dos imágenes lado a lado, nota con `>`, tabla, código y video.
- [x] **D3. Más avisos al compilar** `[IA]` — Hecho el 2026-11-15 en `src/lib/validar-contenido.mjs`. El build falla con un mensaje claro si: falta es.md o en.md, `fig`, `status`, fecha, categorías, `youtube` o `repo` difieren entre idiomas, una imagen citada no existe, falta su texto alternativo, o los dos idiomas no citan las mismas imágenes. En experiencias: falta un idioma o `kind`, `start` o `end` difieren. Se saltean las carpetas con `draft: true`. Probado con una carpeta sin `en.md`.
- [x] **D4. Preparar imágenes con un comando** `[IA]` — Hecho el 2026-11-15: `npm run imagenes -- src/content/proyectos/<carpeta>` endereza, achica a 2400 px, borra metadatos y renombra a `01-nombre.jpg` (las capturas PNG se quedan en PNG). Se puede volver a correr sin tocar lo ya preparado.
- [ ] **D5. Comando de Claude para publicar** `[IA]` — Un comando propio (`/nueva-lamina`) que siga `docs/instructivo-publicar-proyecto.md` paso a paso: pregunta lo que falta, escribe los dos idiomas, corre el build y abre el pull request.
- [x] **D6. Actualizar el instructivo** `[IA]` — Hecho el 2026-11-15: `docs/instructivo-publicar-proyecto.md` suma comandos, glosario, láminas en preparación, video, qué revisa el build y que publicar es un pull request.
- [x] **D7. Instructivo y plantilla de experiencias** `[IA]` — Hecho el 2026-11-15: `docs/instructivo-experiencias.md`, con el campo `kind` del filtro.
- [ ] **D8. Prueba con el primer proyecto real** `[Ambos]` — Cargar uno de punta a punta y tomar el tiempo. El criterio de `PLAN.md` es menos de 30 minutos. Anotar acá cada tropiezo.
- [ ] **D9. Decidir el panel de edición** `[Bruno]` — `PLAN.md` prevé Sveltia CMS en `/admin` (pista B). Con los comandos de D1 a D5 puede no hacer falta. Si se hace, sumarle los campos `fig`, `status` y `schematic`.
- [ ] **D10. Dos decisiones del contenido** `[Bruno]` — Orden del cronograma (hoy por fecha de inicio; el diseño usa otro) y si una lámina en preparación suma al contador de su categoría.

## E. SEO y visibilidad en asistentes de IA

Hoy el `<head>` de cada página tiene solo título, descripción y dirección canónica.

- [x] **E1. `<head>` completo** `[IA]` — Hecho el 2026-11-15 en `src/components/seo/Head.astro`: Open Graph, tarjeta para redes y `hreflang` (`es`, `en`, `x-default`). Falta la imagen para compartir (E6).
- [x] **E2. Sitemap** `[IA]` — Hecho el 2026-11-15 sin sumar dependencias: `src/pages/sitemap.xml.ts` lo arma al compilar con los dos idiomas. No incluye borradores, láminas en preparación ni categorías vacías.
- [ ] **E3. `robots.txt` propio** `[Bruno]` — El archivo ya está (`src/pages/robots.txt.ts`): declara el sitemap, permite buscadores y rastreadores de IA y bloquea `/admin/`. *Falta:* que Bruno revise en Cloudflare que no esté activado el bloqueo de bots de IA, porque el objetivo es que los asistentes citen el sitio.
- [x] **E4. Favicon** `[IA]` — Hecho el 2026-11-15. Monograma «BF» en SVG, ICO y PNG de 180, 192 y 512, más el manifiesto. Se regenera con `node scripts/generar-favicon.mjs` (ahí están los colores).
- [ ] **E5. Datos estructurados** `[IA]` — Hechos el 2026-11-15 (`src/lib/seo.ts`): `WebSite` y `Person` en Inicio, `ProfilePage` en Sobre mí, `CreativeWork` con `VideoObject` (solo con un video real) y `BreadcrumbList` en cada proyecto. JSON válido en todas las páginas. *Falta (Bruno):* pasar la prueba de resultados enriquecidos de Google (search.google.com/test/rich-results) con la dirección de un proyecto, cuando el sitio esté publicado.
- [ ] **E6. Imagen para compartir** `[IA]` — Cada proyecto ya usa su portada recortada a 1200 × 630 como `og:image` (2026-11-15). *Falta:* una imagen por defecto para Inicio, Sobre mí y el resto (no se hizo: necesita el diseño final con tipografía y retrato, §8.4).
- [x] **E7. Títulos y descripciones propios** `[IA]` — Hecho el 2026-11-15: cada categoría tiene su descripción (`categoryDescriptions` en `site.ts`), y Inicio y Proyectos tienen una de 50 a 160 caracteres (`meta.*` en `ui.ts`). Comprobado en las 26 páginas. Redactadas por la IA: Bruno las revisa (A5).
- [x] **E8. Categorías vacías** `[IA]` — Hecho el 2026-11-15: una categoría sin proyectos pide «no indexar» y queda fuera del sitemap.
- [ ] **E9. Redirección de la raíz** `[Ambos]` — Hoy `/` lleva a `/es/` con un 302 (temporal). Evaluar pasarla a 301 (permanente) y resolver junto con la detección de idioma del navegador (H5).
- [x] **E10. `llms.txt` y RSS** `[IA]` — Hecho el 2026-11-15: `/llms.txt` (resumen del sitio para asistentes de IA) y `/es/rss.xml` y `/en/rss.xml` (un feed por idioma), enlazados desde el `<head>`.
- [x] **E11. Caché de archivos fijos** `[IA]` — Hecho el 2026-11-15 en `public/_headers`: un año para `/_astro/*` y 30 días para `/fonts/*`. *Falta:* comprobarlo en el sitio real al publicarlo.
- [ ] **E12. Lighthouse** `[IA]` — Medir Inicio, un proyecto y Proyectos en celular. Meta: 95 o más en las cuatro categorías. Revisar cuánto demora la animación de entrada en mostrar el contenido principal.
- [ ] **E13. Alta en buscadores** `[Bruno]` — Google Search Console y Bing Webmaster Tools, verificar el dominio y enviar el sitemap. Hacerlo recién al quitar A3.
- [ ] **E14. Enlaces hacia el sitio** `[Bruno]` — Poner la dirección en LinkedIn, en el perfil de GitHub y, cuando exista, en el canal de YouTube.
- [ ] **E15. Estadísticas sin cookies** `[Bruno]` — Activar Cloudflare Web Analytics.
- [ ] **E16. Seguimiento** `[Bruno]` — A las 2 y a las 6 semanas del lanzamiento, buscar «Bruno Frankenstein» en Google, Bing y dos asistentes de IA, y anotar acá qué aparece.

## F. Navegadores y dispositivos

Hasta ahora el sitio se probó solo en un navegador basado en Chromium, en esta máquina.

- [ ] **F1. Prueba manual en navegadores reales** `[Bruno]` — Recorrer la lista F3 en: Chrome y Firefox en Windows, Safari en iPhone y Chrome en Android. Safari en iPhone es el más importante y el que más difiere.
- [ ] **F2. Pruebas automáticas** `[IA]` — Con Playwright (corre Chromium, Firefox y el motor de Safari): abrir cada página en 375, 768 y 1280 px, comprobar que no hay errores ni desborde horizontal, y guardar capturas. Es una dependencia de desarrollo: pedir el OK.
- [ ] **F3. Qué probar en cada uno** `[Ambos]`
  - Menú de celular: abre, cierra con el botón y con «atrás», no deja hacer scroll al fondo.
  - Tarjetas: en pantallas táctiles, un toque navega directo y no queda «pegado» el estado de mouse encima.
  - Visor de imágenes: zoom con dos dedos, arrastrar, flechas, cerrar.
  - Notas del glosario: abren al tocar y cierran al tocar afuera.
  - Botón «Copiar»: copia de verdad (en el navegador interno de Claude no se pudo comprobar).
  - Formulario: errores al salir del campo, teclado correcto para el email en el celular.
  - Video: carga al tocar.
  - Cambio de idioma: conserva la altura de la página.
  - Movimiento de entrada: los marcos se dibujan una sola vez y nada queda invisible.
- [ ] **F4. Puntos con riesgo conocido** `[IA]` — Revisar primero:
  - Columna lateral fija del proyecto: en una ventana baja (1024 × 600) puede quedar cortada.
  - Animación de la × del menú (`@starting-style`) y cota del botón «Enviando…» (`@property`): en navegadores viejos no se animan; confirmar que igual se ven bien.
  - Estilos con `:has()` (foco de las tarjetas, opción elegida del formulario): no existen en Firefox anterior a 2024.
  - Tablas y bloques de código largos en 360 px.
  - Títulos largos en inglés en 320 px.
- [ ] **F5. Sin JavaScript** `[IA]` — Desactivarlo y confirmar que se puede leer y navegar todo. El formulario necesita un plan para ese caso.
- [ ] **F6. Menos movimiento y alto contraste** `[IA]` — Con «reducir movimiento» activado no debe moverse nada. Probar también el modo de alto contraste de Windows.
- [ ] **F7. Texto agrandado** `[IA]` — Con el zoom del navegador al 200 % no debe cortarse ni superponerse nada.

## G. Accesibilidad

- [ ] **G1. Auditoría automática** `[IA]` — Pasar axe o Lighthouse por las seis pantallas y corregir lo que marque.
- [ ] **G2. Solo con teclado** `[Ambos]` — Recorrer el sitio con Tab: orden lógico, foco siempre visible, se puede abrir y cerrar todo.
- [ ] **G3. Lector de pantalla** `[Ambos]` — Probar con NVDA en Windows y VoiceOver en iPhone: menú, visor, notas del glosario, errores del formulario y aviso «Copiado».
- [x] **G4. Tamaño de las zonas táctiles** `[IA]` — Hecho el 2026-11-15: el índice lateral, «Copiar», las etiquetas que son links y los años del filtro llegan a 44 px; los términos del glosario ganan una zona de toque invisible en pantallas táctiles. *Falta:* probarlo en un celular real (F1).
- [ ] **G5. Textos alternativos reales** `[Bruno]` — Al reemplazar las imágenes marcador, describir lo que se ve en cada foto.

## H. Funcionalidad pendiente del diseño

- [ ] **H1. Paso 5 — prioridad media** `[IA]` — Filtros instantáneos por categoría y año con animación, vista de lista, cronograma que se dibuja con la duración de cada experiencia, transición de la portada entre tarjeta y detalle, regla de progreso de lectura, íconos y celdas de categoría animados.
- [ ] **H2. Paso 6 — gráficos** `[IA]` — Duotono cianotipo de las portadas con la foto a color al pasar el mouse, imágenes para compartir (E6), favicon (E4) y página 404 con su diseño.
- [x] **H3. Página 404 en producción** `[IA]` — Hecho el 2026-11-15: `not_found_handling: "404-page"` en `wrangler.jsonc`. Probado por Bruno: una dirección inexistente muestra la página 404 del diseño. Primera versión mostraba los dos idiomas juntos; ahora hay una por idioma (`es/404.html` y `en/404.html`, que Cloudflare elige por la dirección) y una bilingüe para las direcciones sin idioma. *Falta comprobar al publicar:* `/en/nada/` en inglés y `/es/nada/` en español.
- [x] **H4. Envío del formulario (pista D)** `[Bruno]` — Hecho el 2026-11-15: `worker/` recibe el mensaje en `/api/contacto`, lo valida de nuevo, comprueba Turnstile y lo manda por correo; el correo de Bruno no figura en el sitio. Bruno configuró Cloudflare según `docs/formulario-contacto.md` y el envío de prueba llegó (sin confirmar por la IA). Si falla, el formulario muestra un código de error.
- [ ] **H5. Idioma según el navegador** `[Bruno]` — El diseño pide detectarlo en la primera visita; `PLAN.md` fija que la raíz va siempre a `/es/`. Decidir cuál vale.
- [ ] **H6. Ilustración del inicio** `[Bruno]` — Celda 18650 en despiece, auto de Formula SAE, o dejar solo el retrato.
- [ ] **H7. Paso 7 — pulido** `[IA]` — Coordenadas vivas en el footer, contadores tipo odómetro y auditoría final.
- [ ] **H8. Archivos sueltos de la carpeta de trabajo** `[Bruno]` — En `pagina-web/` hay `cianotipo_style.py`, `demo.png` y dos `prompt-*.txt` que la IA no leyó. Decir si aplican al paso 6.

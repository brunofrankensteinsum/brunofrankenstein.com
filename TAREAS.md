# Tareas pendientes: brunofrankenstein.com

Lista de lo que falta después de publicar el diseño C1 «Cianotipo» (pasos 1 a 4).
Complementa a `PLAN.md`: el plan dice qué se decidió; esta lista dice qué hacer ahora y en qué orden.

- **Estado al 2026-11-15:** sitio publicado con el diseño nuevo, contenido de ejemplo y marcadores a la vista.
- **Quién:** `[Bruno]` solo lo puede hacer Bruno (cuentas, datos, decisiones) · `[IA]` lo puede hacer Claude en el repo · `[Ambos]` la IA prepara y Bruno revisa.
- **Medido:** los datos marcados «hoy» salen de revisar el sitio publicado y el repo el 2026-11-15.
- Al terminar una tarea, marcarla con `[x]`. Si se descarta, tacharla y anotar por qué.

## Por dónde empezar

1. A1 y A3 — decidir qué hacer con los proyectos de ejemplo y si el sitio se indexa mientras tanto.
2. B1 — forzar HTTPS en Cloudflare (5 minutos).
3. C1 — permiso de escritura en GitHub para esta máquina.
4. C2 — sacar el repo de OneDrive.
5. Publicar la rama `lista-de-tareas` y comprobar en el sitio real las cabeceras (B2) y la caché (E11).
6. D3 — avisos al compilar (D1 y D2 ya están).
7. A2 — cargar los datos reales y el primer proyecto real.
8. E5 y E6 — datos estructurados e imagen para compartir.

---

## A. Lo que hoy está a la vista del público

- [ ] **A1. Proyectos de ejemplo** `[Bruno]` — Los tres proyectos (FIG. 01 a 03) salieron del diseño, no son reales, y hoy se ven como si lo fueran. Elegir: ocultarlos con `draft: true` hasta tener uno real, o dejarlos con un aviso «ejemplo». *Listo cuando:* ningún visitante puede tomar un ejemplo por un proyecto real.
- [ ] **A2. Completar los marcadores** `[Bruno]` — Cada dato y dónde se carga:
  - ~~Retrato~~ → hecho el 2026-11-15: `src/assets/retrato.jpg` (sin datos de ubicación) se ve en Inicio y Sobre mí. Para cambiarlo, reemplazar el archivo con el mismo nombre.
  - ~~Email público~~ → decidido: no se publica; se contacta por el formulario (H4).
  - ~~CV~~ → hecho: el botón «Ver CV» abre la página de CVuy (campo `cv` de `profile.ts`).
  - Párrafo pendiente y herramientas de Sobre mí → `profile.ts`.
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
- [ ] **B4. Validar el identificador de YouTube** `[IA]` — El campo `youtube` acepta cualquier texto y con él se arma una dirección. Exigir en `src/content.config.ts` el formato real (11 caracteres entre letras, números, `-` y `_`).
- [ ] **B5. Proteger la rama `main`** `[Bruno]` — En GitHub: exigir pull request y que el build pase antes de unir. Activar «secret scanning», «push protection» y las alertas de Dependabot.
- [ ] **B6. Doble factor en las cuentas** `[Bruno]` — Las dos cuentas de GitHub y la de Cloudflare.
- [ ] **B7. Fotos sin datos privados** `[IA]` — El repo es público. Las fotos de celular guardan la ubicación (GPS) en sus metadatos. Hacer que el script de imágenes (D4) los borre siempre. *Listo cuando:* ninguna imagen del repo tiene datos de ubicación.
- [ ] **B8. Correo del dominio** `[Bruno]` — Crear la dirección pública con Email Routing (por ejemplo `hola@`) para no publicar el correo personal, y cargar los registros SPF y DMARC para que nadie envíe correo haciéndose pasar por el dominio.
- [x] **B9. Seguridad del formulario (va con la pista D)** `[IA]` — Hecho en el código el 2026-11-15 (`worker/contacto.js`, con pruebas): validación de nuevo en el servidor, límite de tamaño, Turnstile, solo pedidos del propio dominio, sin inyección de cabeceras, y claves como secretos de Cloudflare. *Falta (Bruno):* crear la regla de límite de envíos del paso 5 de `docs/formulario-contacto.md`.
- [ ] **B10. Seguridad del panel (va con la pista B)** `[IA]` — Si se hace `/admin`: acceso solo para la cuenta de Bruno, permisos mínimos en GitHub y bloqueo a buscadores.
- [ ] **B11. Dependencias al día** `[IA]` — Hoy `npm audit` da 0 vulnerabilidades. Configurar Dependabot para que avise una vez por semana.

## C. Publicación y forma de trabajo

- [ ] **C1. Permiso de escritura en GitHub** `[Bruno]` — Esta máquina usa la cuenta `BrunoFrankenstein`, que solo puede leer el repo de `brunofrankensteinsum`. Invitarla como colaboradora con rol Write, o iniciar sesión acá con la cuenta dueña. *Listo cuando:* `git push` funciona sin pasos a mano en GitHub.
- [ ] **C2. Sacar el repo de OneDrive** `[Bruno]` — Ya perdió archivos una vez por la sincronización. Moverlo a una carpeta que OneDrive no toque (por ejemplo `C:\dev\`). GitHub ya es la copia de respaldo.
- [ ] **C3. Vista previa antes de publicar** `[Bruno]` — Activar en Cloudflare los despliegues de prueba por rama, para ver un cambio en una dirección temporal antes de unirlo a `main`.
- [ ] **C4. Revisión automática** `[IA]` — Una GitHub Action que corra `npm run build` y `npm run check` en cada pull request. Se combina con B5.
- [x] **C5. No editar `dist/`** `[IA]` — Hecho el 2026-11-15. La regla está en `CLAUDE.md` y `.vscode/settings.json` oculta `dist/`, `.astro/` y `node_modules/` en VS Code.
- [x] **C6. Finales de línea** `[IA]` — Hecho el 2026-11-15 con `.gitattributes`.
- [ ] **C7. Misma versión de Node** `[Bruno]` — El proyecto pide Node 22 (`.node-version`) y esta máquina tiene la 25. Instalar la 22 para compilar igual que Cloudflare.
- [ ] **C8. Capturas con un comando** `[IA]` — Traer `herramientas/capturar.mjs` al repo como `npm run capturas`.
- [ ] **C9. Poner `PLAN.md` al día** `[IA]` — Marcar lo hecho (la pista A quedó cubierta por el diseño) y anotar las decisiones tomadas en los pasos 1 a 4.
- [ ] **C10. Borrar la rama `diseno-c1`** `[Bruno]` — Ya está unida a `main`. De acá en más, una rama corta por cada cambio.

## D. Cargar láminas nuevas con facilidad

- [x] **D1. Comando «lámina nueva»** `[IA]` — Hecho el 2026-11-15. `npm run lamina -- "Título del proyecto"` crea la carpeta con el slug, `es.md` y `en.md` con la cabecera (campos comentados para completar) y el siguiente número de `fig` libre; la lámina nace «en preparación». Probado: el sitio compila con la lámina creada.
- [x] **D2. Plantilla comentada** `[IA]` — Hecho el 2026-11-15 en `docs/plantillas/lamina-ejemplo.md`: subtítulos numerados, pie de foto en cursiva, dos imágenes lado a lado, nota con `>`, tabla, código y video.
- [x] **D3. Más avisos al compilar** `[IA]` — Hecho el 2026-11-15 en `src/lib/validar-contenido.mjs`. El build falla con un mensaje claro si: falta es.md o en.md, `fig`, `status`, fecha, categorías, `youtube` o `repo` difieren entre idiomas, una imagen citada no existe, falta su texto alternativo, o los dos idiomas no citan las mismas imágenes. En experiencias: falta un idioma o `kind`, `start` o `end` difieren. Se saltean las carpetas con `draft: true`. Probado con una carpeta sin `en.md`.
- [ ] **D4. Preparar imágenes con un comando** `[IA]` — `npm run imagenes -- <carpeta>`: achica a 2400 px, borra metadatos (B7) y renombra a `01-descripcion.jpg`.
- [ ] **D5. Comando de Claude para publicar** `[IA]` — Un comando propio (`/nueva-lamina`) que siga `docs/instructivo-publicar-proyecto.md` paso a paso: pregunta lo que falta, escribe los dos idiomas, corre el build y abre el pull request.
- [ ] **D6. Actualizar el instructivo** `[IA]` — Sumar: el glosario y cómo agregar un término, `status: en-preparacion` y cómo pasar una lámina a publicada, dónde va el resumen del video, y que publicar es abrir un pull request.
- [ ] **D7. Instructivo y plantilla de experiencias** `[IA]` — Hoy solo existe para proyectos.
- [ ] **D8. Prueba con el primer proyecto real** `[Ambos]` — Cargar uno de punta a punta y tomar el tiempo. El criterio de `PLAN.md` es menos de 30 minutos. Anotar acá cada tropiezo.
- [ ] **D9. Decidir el panel de edición** `[Bruno]` — `PLAN.md` prevé Sveltia CMS en `/admin` (pista B). Con los comandos de D1 a D5 puede no hacer falta. Si se hace, sumarle los campos `fig`, `status` y `schematic`.
- [ ] **D10. Dos decisiones del contenido** `[Bruno]` — Orden del cronograma (hoy por fecha de inicio; el diseño usa otro) y si una lámina en preparación suma al contador de su categoría.

## E. SEO y visibilidad en asistentes de IA

Hoy el `<head>` de cada página tiene solo título, descripción y dirección canónica.

- [x] **E1. `<head>` completo** `[IA]` — Hecho el 2026-11-15 en `src/components/seo/Head.astro`: Open Graph, tarjeta para redes y `hreflang` (`es`, `en`, `x-default`). Falta la imagen para compartir (E6).
- [x] **E2. Sitemap** `[IA]` — Hecho el 2026-11-15 sin sumar dependencias: `src/pages/sitemap.xml.ts` lo arma al compilar con los dos idiomas. No incluye borradores, láminas en preparación ni categorías vacías.
- [ ] **E3. `robots.txt` propio** `[Bruno]` — El archivo ya está (`src/pages/robots.txt.ts`): declara el sitemap, permite buscadores y rastreadores de IA y bloquea `/admin/`. *Falta:* que Bruno revise en Cloudflare que no esté activado el bloqueo de bots de IA, porque el objetivo es que los asistentes citen el sitio.
- [x] **E4. Favicon** `[IA]` — Hecho el 2026-11-15. Monograma «BF» en SVG, ICO y PNG de 180, 192 y 512, más el manifiesto. Se regenera con `node scripts/generar-favicon.mjs` (ahí están los colores).
- [ ] **E5. Datos estructurados** `[IA]` — JSON-LD: `Person` y `ProfilePage` (con `sameAs` a LinkedIn y GitHub), `WebSite`, `CreativeWork` por proyecto, `BreadcrumbList` y `VideoObject`. *Listo cuando:* la prueba de resultados enriquecidos de Google no marca errores.
- [ ] **E6. Imagen para compartir** `[IA]` — Una imagen Open Graph por defecto y una por proyecto, en cada idioma (§8.4).
- [ ] **E7. Títulos y descripciones propios** `[IA]` — Las páginas de categoría repiten la descripción de Proyectos. Cada página necesita la suya, de 50 a 160 caracteres.
- [x] **E8. Categorías vacías** `[IA]` — Hecho el 2026-11-15: una categoría sin proyectos pide «no indexar» y queda fuera del sitemap.
- [ ] **E9. Redirección de la raíz** `[Ambos]` — Hoy `/` lleva a `/es/` con un 302 (temporal). Evaluar pasarla a 301 (permanente) y resolver junto con la detección de idioma del navegador (H5).
- [ ] **E10. `llms.txt` y RSS** `[IA]` — Resumen del sitio para asistentes de IA y un feed por idioma. Ambos previstos en la pista C.
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
- [ ] **G4. Tamaño de las zonas táctiles** `[IA]` — Los términos de glosario dentro del texto y los links del índice lateral (40 px) quedan por debajo de los 44 px que pide el diseño.
- [ ] **G5. Textos alternativos reales** `[Bruno]` — Al reemplazar las imágenes marcador, describir lo que se ve en cada foto.

## H. Funcionalidad pendiente del diseño

- [ ] **H1. Paso 5 — prioridad media** `[IA]` — Filtros instantáneos por categoría y año con animación, vista de lista, cronograma que se dibuja con la duración de cada experiencia, transición de la portada entre tarjeta y detalle, regla de progreso de lectura, íconos y celdas de categoría animados.
- [ ] **H2. Paso 6 — gráficos** `[IA]` — Duotono cianotipo de las portadas con la foto a color al pasar el mouse, imágenes para compartir (E6), favicon (E4) y página 404 con su diseño.
- [ ] **H3. Página 404 en producción** `[IA]` — Hoy una dirección inexistente devuelve una página en blanco. Agregar `"not_found_handling": "404-page"` en `wrangler.jsonc`. Cambia el despliegue: avisar a Bruno antes.
- [ ] **H4. Envío del formulario (pista D)** `[Bruno]` — El código está hecho el 2026-11-15: `worker/` recibe el mensaje en `/api/contacto`, lo valida de nuevo, comprueba Turnstile y lo manda por correo. El correo de Bruno no figura en el sitio. Sus 8 pruebas automáticas pasan (`npm test`), pero **no se probó con Cloudflare real**. *Falta (solo Bruno):* seguir `docs/formulario-contacto.md` (Email Routing, widget de Turnstile y dos secretos). Hasta entonces el formulario avisa «todavía no está conectado». *Listo cuando:* un mensaje de prueba llega a la bandeja.
- [ ] **H5. Idioma según el navegador** `[Bruno]` — El diseño pide detectarlo en la primera visita; `PLAN.md` fija que la raíz va siempre a `/es/`. Decidir cuál vale.
- [ ] **H6. Ilustración del inicio** `[Bruno]` — Celda 18650 en despiece, auto de Formula SAE, o dejar solo el retrato.
- [ ] **H7. Paso 7 — pulido** `[IA]` — Coordenadas vivas en el footer, contadores tipo odómetro y auditoría final.
- [ ] **H8. Archivos sueltos de la carpeta de trabajo** `[Bruno]` — En `pagina-web/` hay `cianotipo_style.py`, `demo.png` y dos `prompt-*.txt` que la IA no leyó. Decir si aplican al paso 6.

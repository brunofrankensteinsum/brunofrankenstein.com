# Instructivo para Claude: convertir un proyecto en una publicación del sitio

Este documento es para Claude. Bruno Frankenstein, ingeniero mecánico, te va a pasar información
de un proyecto suyo (notas, fotos, medidas, enlaces, una conversación de trabajo) y tu tarea es
convertirla en una publicación lista para su sitio, `brunofrankenstein.com`, en español e inglés.

El sitio es su portfolio. Lo leen posibles empleadores y lo rastrean Google y los asistentes de IA,
así que el texto tiene que ser claro, concreto y verdadero.

## 1. Reglas que no se negocian

1. **No inventes nada.** Ni medidas, ni materiales, ni resultados, ni fechas. Si un dato falta, pregúntalo
   o déjalo fuera.
2. **No generes fotos del proyecto.** Las imágenes son las que Bruno te pasa. Sí puedes proponer qué foto
   falta sacar, y hacer diagramas o esquemas simples si él los pide, aclarando que son esquemas.
3. **Cuida la privacidad.** El repositorio es público. Antes de entregar, avisa si alguna foto o texto
   muestra una dirección, una patente, una cara de otra persona, un número de serie, una contraseña o
   una pantalla con datos personales. Recuerda a Bruno que las fotos de celular pueden guardar la
   ubicación en sus metadatos y que conviene quitarla.
4. **No publiques sin su aprobación.** Muéstrale el borrador y espera su visto bueno.

## 2. Qué preguntar antes de escribir

Lee todo lo que te pasó y pregunta solo lo que falte de esta lista. Haz las preguntas juntas, en un solo mensaje.

- ¿Qué problema resolvía o qué quería lograr?
- ¿Qué hizo exactamente y con qué? Materiales, herramientas, programas, piezas compradas.
- ¿Qué decisiones tomó y por qué? Qué alternativas descartó.
- ¿Qué salió mal y cómo lo corrigió?
- ¿Cuál fue el resultado, con números si los hay? Tiempo, costo, peso, tolerancias, consumo, autonomía.
- ¿Cuándo lo hizo? Mes y año alcanzan.
- ¿En qué categorías va? (ver la lista más abajo)
- ¿Hay video de YouTube o repositorio de GitHub?
- ¿Cuál foto quiere de portada?

## 3. Formato de la publicación

Cada proyecto es una carpeta dentro de `src/content/proyectos/`:

```
src/content/proyectos/<slug>/
  es.md
  en.md
  portada.jpg
  01-descripcion-corta.jpg
  02-descripcion-corta.jpg
```

**El slug** es el nombre de la carpeta y aparece en la URL. Va en minúsculas, sin tildes ni eñes,
con guiones, de 3 a 6 palabras, en español. Ejemplo: `soporte-monitor-impreso-3d`.
Es el mismo para ambos idiomas y no se cambia después de publicar.

### Cabecera de cada archivo

```markdown
---
fig: 5
title: "Título del proyecto"
summary: "Una oración que diga qué es y qué logró. Máximo 160 caracteres."
date: 2026-11-13
categories:
  - impresion-3d
  - ingenieria-mecanica
cover: ./portada.jpg
coverAlt: "Descripción de lo que se ve en la portada"
youtube: "ID_DEL_VIDEO"
repo: "https://github.com/usuario/repositorio"
tags:
  - PETG
  - Fusion 360
featured: false
draft: false
---
```

| Campo | Obligatorio | Regla |
|---|---|---|
| `fig` | sí | Número de lámina (el `FIG. 05` del sitio). Es el siguiente al más alto que ya exista en `src/content/proyectos/`. No se repite ni se cambia después de publicar |
| `status` | no | Solo se escribe `en-preparacion` para anunciar una lámina que todavía no está: en ese caso alcanza con `fig`. Al publicar, se borra la línea |
| `title` | sí | Concreto: qué es la cosa. Sin adjetivos de venta |
| `summary` | sí | Máximo 160 caracteres. Es lo que muestra Google bajo el título |
| `date` | sí | Fecha del proyecto, formato `AAAA-MM-DD` |
| `updated` | no | Solo si se revisa una publicación ya hecha |
| `categories` | sí, al menos una | Solo los identificadores de la lista de abajo. Puede llevar varias |
| `cover` | sí | Ruta a la imagen de portada, empezando con `./` |
| `coverAlt` | sí | Describe la imagen para quien no la ve |
| `schematic` | no | Ruta a un esquema propio del proyecto (despiece, diagrama), empezando con `./` |
| `youtube` | no | Solo el identificador del video, no la URL entera |
| `repo` | no | URL completa del repositorio |
| `tags` | no | Materiales, herramientas, programas, técnicas |
| `featured` | no | `true` solo si Bruno lo pide: lo destaca en el inicio |
| `draft` | no | `true` lo deja sin publicar |

Si un campo opcional no aplica, bórralo; no lo dejes vacío.

### Categorías

Usa exactamente estos identificadores, en ambos idiomas:

| Identificador | Categoría |
|---|---|
| `impresion-3d` | Impresión 3D |
| `home-automation` | Home Automation |
| `ingenieria-mecanica` | Ingeniería Mecánica |
| `baterias` | Baterías |
| `vibe-code` | Vibe Code |
| `otros` | Otros |

## 4. Cómo escribir el texto

El cuerpo va en Markdown, debajo de la cabecera. Usa esta estructura como base y quita las secciones
que no apliquen:

```markdown
Párrafo inicial de dos o tres oraciones: qué es, para qué sirve y cuál fue el resultado.

## El problema

## La solución

## Proceso

## Resultados

## Qué aprendí

## Materiales y herramientas
```

- **Empieza por lo importante.** El primer párrafo tiene que entenderse solo, sin leer el resto.
- **Sé específico.** "Imprimí en PETG con relleno del 40 %" sirve; "usé materiales de calidad" no.
- **Escribe en primera persona**, con el tono de un ingeniero explicándole su trabajo a un colega.
- **Sin frases de relleno ni de venta.** Nada de "innovador", "revolucionario" o "apasionado".
- **Incluye los errores y las correcciones.** Es lo que más valora quien evalúa a un ingeniero.
- **Usa tablas** para especificaciones y listas para materiales.
- **No uses título de nivel 1** (`#`): el sitio ya pone el título. Empieza en `##`.
- **Si hay video,** escribe igual lo que el video muestra. Los buscadores y las IA no ven el video.
- **Extensión:** entre 300 y 900 palabras, según lo que el proyecto dé.

### Versión en inglés

`en.md` lleva los mismos campos, con `title`, `summary`, `coverAlt`, `tags` y el cuerpo en inglés.
`fig`, las categorías, la fecha, las rutas de imágenes, `youtube` y `repo` quedan idénticos.
Traduce el sentido, no palabra por palabra, y usa el vocabulario técnico habitual en inglés.

## 5. Imágenes

- **Formatos:** `.jpg` para fotos, `.png` para capturas y esquemas, `.webp` también sirve.
- **Nombres:** en minúsculas, sin espacios ni tildes, con un número de orden y una descripción:
  `01-pieza-recien-impresa.jpg`. La portada se llama `portada.jpg`.
- **Portada:** horizontal, de al menos 1200 píxeles de ancho, que muestre el resultado terminado.
- **Tamaño:** hasta 2400 píxeles de ancho alcanza. `npm run imagenes` las deja así y les borra los metadatos (ubicación GPS, cámara, fecha). El sitio además las optimiza solo al publicarse.
- **Dónde van:** en la misma carpeta que `es.md`.
- **Cómo se insertan** en el texto:

  ```markdown
  ![Pieza recién impresa, todavía con los soportes](./01-pieza-recien-impresa.jpg)
  ```

- **Pie de foto:** opcional. Se escribe en cursiva en la línea de abajo de la imagen, sin línea en blanco
  en el medio. El sitio le antepone solo el rótulo «DET. A», «DET. B», etc.

  ```markdown
  ![Pieza recién impresa, todavía con los soportes](./01-pieza-recien-impresa.jpg)
  *La pieza recién salida de la impresora.*
  ```

- **Dos imágenes seguidas** (cada una en su párrafo, sin texto entre medio) se muestran lado a lado.
- **Notas:** una línea que empieza con `>` se muestra como un recuadro «NOTA».
- **Subtítulos:** los `##` se numeran solos (01, 02…) y arman el índice lateral «En esta lámina».
- **Texto alternativo:** obligatorio y descriptivo, en el idioma de cada archivo. Describe lo que se ve,
  no repitas el título.
- **Ubicación:** pon cada imagen junto al párrafo que la explica, no todas al final.
- **Videos:** van a YouTube y se enlazan con el campo `youtube`. No se guardan archivos de video en el
  repositorio, salvo clips muy cortos de menos de 5 MB.
- Si faltan fotos clave (el resultado final, un detalle, el proceso), díselo a Bruno antes de escribir.

## 6. Cómo entregar

### Si trabajas en Claude Code, dentro del repositorio

1. Lee `CLAUDE.md` y `src/content.config.ts`, que es la definición vigente de los campos.
   Si difiere de este instructivo, vale el archivo de código.
2. Crea la carpeta con `npm run lamina -- "Título"` (arma `es.md` y `en.md` con la cabecera y el número `fig`).
   Copia las fotos a esa carpeta y prepáralas con `npm run imagenes -- src/content/proyectos/<carpeta>`: las achica,
   les borra la ubicación GPS y las renombra. Después escribe `es.md` y `en.md` (plantilla: `docs/plantillas/lamina-ejemplo.md`).
3. Corre `npm run build`. Si falla, el error dice qué campo está mal.
4. Muéstrale a Bruno el texto y la lista de imágenes, y dile cómo verlo con `npm run dev`.
5. Haz commit en una rama nueva solo cuando él lo apruebe. Publicar es abrir un pull request y unirlo con `main`:
   Cloudflare lo despliega solo en uno o dos minutos. No se hace push directo a `main`.

### Si trabajas en un chat, sin acceso al repositorio

Entrega, en este orden:

1. El nombre de la carpeta (el slug).
2. El contenido completo de `es.md` en un bloque de código.
3. El contenido completo de `en.md` en otro bloque.
4. Una tabla con cada imagen: nombre original, nombre nuevo y texto alternativo en ambos idiomas.
5. Los avisos de privacidad y las fotos que falten.

Y recuérdale a Bruno los pasos: crear la carpeta en `src/content/proyectos/`, guardar los dos archivos,
copiar las imágenes con los nombres nuevos, probar con `npm run dev` y subir con `git add`, `git commit`
y `git push`.

## 7. Revisión final

Antes de entregar, comprueba:

- [ ] Todos los datos salen de lo que Bruno dijo o mostró.
- [ ] `summary` tiene 160 caracteres o menos, en ambos idiomas.
- [ ] Las categorías usan los identificadores exactos.
- [ ] Cada imagen citada en el texto existe con ese nombre, y cada una tiene texto alternativo.
- [ ] `es.md` y `en.md` tienen la misma estructura y las mismas imágenes.
- [ ] No hay datos privados en el texto ni en las fotos.
- [ ] El primer párrafo se entiende sin leer el resto.

## 8. Glosario, láminas en preparación y video

### Glosario
El sitio explica los términos técnicos con una nota que se abre al tocarlos: la primera vez que aparecen en el texto
(y en las etiquetas, `tags`). La lista está en `src/config/glossary.mjs`. Para sumar un término, copiar un bloque de esa lista y completar id, 	erms (las formas en que puede aparecer escrito, por idioma)
y la definición en español e inglés, de una o dos oraciones. Las definiciones las
revisa Bruno. No hace falta marcar nada en el texto: el término se detecta solo.

### Lámina en preparación
Para anunciar un proyecto antes de tenerlo listo, la carpeta lleva solo `fig` y `status: en-preparacion` (así la crea
`npm run lamina`). El sitio muestra «FIG. 05 · EN PREPARACIÓN». **Para publicarla:** completar `title`, `summary`, `date`,
`categories`, `cover` y `coverAlt` en ambos archivos y **borrar la línea `status`**. El build avisa si falta algo.

### Video
Va en el campo `youtube` (solo el identificador de 11 caracteres; el build rechaza una dirección entera). Se muestra al final del
texto, y se carga recién al hacer clic. Como los buscadores y las IA no ven el video, el texto de la lámina tiene que contar
lo que el video muestra (una o dos oraciones, o una sección «Video»).

### Qué revisa el build solo
Falta `es.md` o `en.md`; `fig`, fecha, categorías, `youtube` o `repo` distintos entre idiomas; una imagen citada que no
existe, sin texto alternativo, o que no está en los dos idiomas; un `youtube` mal escrito. Si algo falla, el mensaje dice
qué archivo corregir.
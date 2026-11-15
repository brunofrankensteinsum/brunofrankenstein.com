# Escribir láminas con Obsidian

Obsidian edita archivos Markdown y muestra las fotos dentro de la nota, así que sirve para escribir
las láminas de `src/content/proyectos/`. No muestra cómo se ve la lámina en el sitio: eso se ve con
`npm run dev` (ver «Ver el resultado»).

## 1. Abrir la carpeta

1. En Obsidian: **Abrir carpeta como bóveda** (Open folder as vault).
2. Elegir `src/content/proyectos` del repositorio. No abrir el repositorio entero: se llenaría de archivos
   que no son láminas.
3. Obsidian crea una carpeta `.obsidian/` adentro. Es solo tuya: `.gitignore` la deja afuera de GitHub.

## 2. Ajustes (se hacen una sola vez)

En **Ajustes → Archivos y vínculos** (Settings → Files & links):

| Ajuste | Valor | Por qué |
|---|---|---|
| Usar [[Wikilinks]] | **Apagado** | El sitio solo entiende `![texto](./foto.jpg)`, no `![[foto.jpg]]` |
| Formato de nuevos vínculos | **Ruta relativa al archivo** | Así el enlace empieza con `./` y apunta a la foto que está al lado |
| Ubicación de nuevos adjuntos | **En la misma carpeta que el archivo actual** | La foto pegada cae junto a `es.md` |

## 3. Crear una lámina

Lo más fácil es desde la terminal, en la carpeta del repositorio:

```bash
npm run lamina -- "Título del proyecto"
```

Crea la carpeta con `es.md` y `en.md`. En Obsidian aparece sola en la lista de la izquierda.
También se puede crear a mano: carpeta nueva, con `es.md`, `en.md` y las fotos adentro. La plantilla
para copiar es `docs/plantillas/lamina-ejemplo.md`.

## 4. Escribir

- **Cabecera (el bloque entre `---`):** Obsidian la muestra como una tabla de «Propiedades».
  Si la editás ahí, **Obsidian borra los comentarios** (las líneas con `#`) y puede cambiar las comillas.
  Para conservarlos, editá la cabecera como texto: clic derecho sobre la pestaña → **Modo código fuente**
  (Source mode), o abrí el archivo en VS Code.
- **Fotos:**
  - Arrastrá la foto a la nota o pegala con `Ctrl+V`. Cae en la misma carpeta.
  - Las fotos pegadas se llaman `Pasted image 2026….png`. **Renombralas** a algo como
    `01-pieza-impresa.jpg` (clic derecho sobre el archivo → Renombrar) y Obsidian corrige el enlace.
  - La portada se llama `portada.jpg`.
  - Formato del enlace: `![Descripción de lo que se ve](./01-pieza-impresa.jpg)`. La descripción
    (texto alternativo) es obligatoria.
  - El pie de foto va en cursiva en la línea de abajo, sin línea en blanco en medio.
- **Subtítulos:** `##` (nunca `#`). El sitio los numera solo.
- **Nota:** una línea que empieza con `>` se ve como recuadro «NOTA» en el sitio. En Obsidian se ve como cita.
- **Inglés:** `en.md` lleva lo mismo traducido. `fig`, categorías, fecha, rutas de imágenes, `youtube` y
  `repo` quedan iguales.

Más detalle de campos y convenciones: `docs/instructivo-publicar-proyecto.md`.

## 5. Ver el resultado

Obsidian muestra el texto y las fotos, pero no la numeración de subtítulos, el recuadro NOTA, las dos
fotos lado a lado ni el glosario. Eso lo arma el sitio. En una terminal, dentro del repositorio:

```bash
npm run dev
```

Abrí http://localhost:4321 en el navegador y dejalo al lado de Obsidian: se actualiza solo cada vez que
guardás. Si algo no cumple el contrato (falta un campo, una categoría mal escrita), el error aparece en
la terminal y en el navegador diciendo qué es.

## 6. Publicar

1. Borrar la línea `status: en-preparacion` de ambos archivos (si la lámina estaba en preparación).
2. `npm run build`: tiene que terminar sin errores.
3. Commit y pull request, como siempre. Publicar es unir el pull request con `main`.

## Antes de subir fotos

El repositorio es público. Las fotos de celular guardan la ubicación en sus metadatos, y también puede
verse una dirección, una patente o una pantalla con datos personales. Revisalo antes de commitear.
Más adelante habrá un comando que borre esos datos solo (tarea B7/D4 de `TAREAS.md`).

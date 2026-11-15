// Crea una lámina (proyecto) nueva lista para completar.
// Uso:  npm run lamina -- "Título del proyecto"
//
// Qué hace:
//   1. Arma el «slug» (el nombre de la carpeta y de la URL) a partir del título.
//   2. Busca el número de lámina («FIG.») más alto que ya existe y toma el siguiente.
//   3. Crea src/content/proyectos/<slug>/es.md y en.md con la cabecera para completar.
// La lámina nace como «en preparación»: el sitio la anuncia, pero todavía no tiene página propia.
// Cuando el proyecto está listo se completan los campos y se borra la línea `status`.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const titulo = process.argv.slice(2).join(' ').trim();
if (!titulo) {
  console.error('Falta el título.\nUso: npm run lamina -- "Título del proyecto"');
  process.exit(1);
}

// «Soporte para sensor» → «soporte-para-sensor» (sin tildes, eñes ni símbolos).
const slug = titulo
  .toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');
if (!slug) {
  console.error('El título no tiene letras ni números para armar el nombre de la carpeta.');
  process.exit(1);
}

const base = join('src', 'content', 'proyectos');
const carpeta = join(base, slug);
if (existsSync(carpeta)) {
  console.error(`Ya existe ${carpeta}. Elegí otro título o borrá esa carpeta.`);
  process.exit(1);
}

// Siguiente número de lámina libre: el más alto que haya en cualquier es.md o en.md, más uno.
let maximo = 0;
for (const nombre of readdirSync(base, { withFileTypes: true })) {
  if (!nombre.isDirectory()) continue;
  for (const idioma of ['es', 'en']) {
    const archivo = join(base, nombre.name, `${idioma}.md`);
    if (!existsSync(archivo)) continue;
    const m = readFileSync(archivo, 'utf8').match(/^fig:\s*(\d+)/m);
    if (m) maximo = Math.max(maximo, Number(m[1]));
  }
}
const fig = maximo + 1;

// Cabecera común. Los campos de abajo van comentados con «#»: se descomentan al completar.
const cabecera = (idioma) => {
  const es = idioma === 'es';
  return `---
# Lámina en preparación: el sitio solo muestra «FIG. ${String(fig).padStart(2, '0')} · ${es ? 'EN PREPARACIÓN' : 'IN PROGRESS'}».
# Para publicarla: completar los campos de abajo (sin el «#») y BORRAR la línea "status".
# El número "fig" tiene que ser el mismo en es.md y en en.md.
fig: ${fig}
status: en-preparacion
# title: "${es ? titulo : 'Title in English'}"
# summary: "${es ? 'Una oración: qué es y qué logró (máximo 160 caracteres).' : 'One sentence: what it is and what it achieved (160 characters max).'}"
# date: ${new Date().toISOString().slice(0, 10)}
# categories:        # impresion-3d, home-automation, ingenieria-mecanica, baterias, vibe-code, otros
#   - otros
# cover: ./portada.jpg
# coverAlt: "${es ? 'Lo que se ve en la portada' : 'What the cover shows'}"
# youtube: "ID_DEL_VIDEO"      # solo el identificador, no la dirección entera
# repo: "https://github.com/usuario/repositorio"
# tags:
#   - Fusion 360
---
`;
};

mkdirSync(carpeta, { recursive: true });
writeFileSync(join(carpeta, 'es.md'), cabecera('es'));
writeFileSync(join(carpeta, 'en.md'), cabecera('en'));

console.log(`Lámina creada: FIG. ${String(fig).padStart(2, '0')} en ${carpeta}`);
console.log('Siguiente: poné las fotos en esa carpeta (portada.jpg y las demás) y completá es.md y en.md.');
console.log('Guía de formato: docs/plantillas/lamina-ejemplo.md y docs/instructivo-publicar-proyecto.md');

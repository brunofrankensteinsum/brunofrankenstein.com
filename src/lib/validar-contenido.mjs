// Reglas de coherencia del contenido (tarea D3). Devuelve la lista de problemas encontrados;
// src/lib/content.ts detiene el build si la lista no está vacía.
// Es un .mjs (y no .ts) porque usa módulos de Node para comprobar que las imágenes existen.
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

// El id de cada entrada es "<carpeta>/<idioma>", por ejemplo "mi-proyecto/es".
function partirId(id) {
  const [slug, lang] = id.split('/');
  return { slug, lang };
}

// Agrupa las entradas por carpeta: { es, en }.
function porCarpeta(entradas) {
  const mapa = new Map();
  for (const e of entradas) {
    const { slug, lang } = partirId(e.id);
    mapa.set(slug, { ...mapa.get(slug), [lang]: e });
  }
  return mapa;
}

const mismo = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const fecha = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : undefined);

export function revisarContenido(proyectos, experiencias) {
  const errores = [];

  for (const [slug, par] of porCarpeta(proyectos)) {
    const donde = `proyectos/${slug}`;
    const { es, en } = par;
    // Las carpetas con draft: true no se publican: no se les exige nada.
    if (es?.data.draft || en?.data.draft) continue;
    if (!es) errores.push(`${donde}: falta es.md. Cada proyecto necesita es.md y en.md.`);
    if (!en) errores.push(`${donde}: falta en.md. Cada proyecto necesita es.md y en.md.`);
    if (!es || !en) continue;

    // Campos que tienen que ser idénticos en los dos idiomas.
    const iguales = [
      ['fig', es.data.fig, en.data.fig],
      ['status', es.data.status, en.data.status],
    ];
    if (es.data.status === 'publicado') {
      iguales.push(
        ['date', fecha(es.data.date), fecha(en.data.date)],
        ['categories', [...es.data.categories].sort(), [...en.data.categories].sort()],
        ['youtube', es.data.youtube, en.data.youtube],
        ['repo', es.data.repo, en.data.repo],
      );
    }
    for (const [campo, a, b] of iguales) {
      if (!mismo(a, b)) errores.push(`${donde}: "${campo}" es distinto en es.md (${JSON.stringify(a)}) y en en.md (${JSON.stringify(b)}). Tiene que ser igual.`);
    }

    // Imágenes del texto: con texto alternativo, existentes y las mismas en ambos idiomas.
    const imagenes = { es: [], en: [] };
    for (const [lang, entrada] of [['es', es], ['en', en]]) {
      for (const m of (entrada.body ?? '').matchAll(/!\[([^\]]*)\]\(([^)\s]+)/g)) {
        const [, alt, ruta] = m;
        if (!alt.trim()) errores.push(`${donde}/${lang}.md: la imagen ${ruta} no tiene texto alternativo (lo que va entre los corchetes).`);
        const externa = /^(https?:)?\/\//.test(ruta);
        if (!externa && !existsSync(resolve(dirname(entrada.filePath ?? ''), ruta))) {
          errores.push(`${donde}/${lang}.md: la imagen ${ruta} no existe en la carpeta del proyecto.`);
        }
        imagenes[lang].push(ruta);
      }
    }
    if (!mismo([...imagenes.es].sort(), [...imagenes.en].sort())) {
      errores.push(`${donde}: es.md y en.md no citan las mismas imágenes (es: ${imagenes.es.join(', ') || 'ninguna'}; en: ${imagenes.en.join(', ') || 'ninguna'}).`);
    }
  }

  for (const [slug, par] of porCarpeta(experiencias)) {
    const donde = `experiencias/${slug}`;
    const { es, en } = par;
    if (es?.data.draft || en?.data.draft) continue;
    if (!es || !en) {
      errores.push(`${donde}: falta ${es ? 'en' : 'es'}.md. Cada experiencia necesita es.md y en.md.`);
      continue;
    }
    if (!mismo(es.data.kind, en.data.kind)) errores.push(`${donde}: "kind" es distinto en es.md y en.md.`);
    for (const campo of ['start', 'end']) {
      if (fecha(es.data[campo]) !== fecha(en.data[campo])) errores.push(`${donde}: "${campo}" es distinto en es.md y en.md.`);
    }
  }

  return errores;
}

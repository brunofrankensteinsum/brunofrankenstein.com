// Configuración central del sitio. Lo que cambia acá se refleja en todas las páginas.

export const languages = ['es', 'en'] as const;
export type Lang = (typeof languages)[number];

// Idioma principal: es al que redirige la raíz del dominio ("/").
// Cambiarlo a 'en' no rompe ninguna URL, porque ambos idiomas llevan prefijo.
// Al cambiarlo, actualizar también public/_redirects.
export const defaultLang: Lang = 'es';

export const site = {
  name: 'Bruno Frankenstein',
  // Marca corta que se ve en el header y el footer.
  brand: 'B.FRANKENSTEIN',
  url: 'https://brunofrankenstein.com',
  // ¿Pueden los buscadores guardar el sitio? Con false, todas las páginas piden «no indexar»
  // y quedan fuera del sitemap. Sirve mientras haya contenido de ejemplo (tarea A3 de TAREAS.md).
  indexable: true,
  tagline: {
    es: 'Ingeniero mecánico. Proyectos y experiencias.',
    en: 'Mechanical engineer. Projects and experience.',
  },
  // Redes. Una red con la dirección vacía no se muestra en el sitio.
  social: {
    linkedin: 'https://www.linkedin.com/in/bruno-frankenstein-5b8144256/',
    github: 'https://github.com/brunofrankensteinsum',
    // Todavía no hay canal de YouTube: cuando exista, pegar acá la dirección.
    youtube: '',
  },
};

// Categorías de proyectos, en el orden en que se muestran.
// "id" es lo que se escribe en el campo "categories" de cada proyecto.
// "slug" es lo que aparece en la URL de cada idioma.
export const categories = [
  { id: 'impresion-3d', slug: { es: 'impresion-3d', en: '3d-printing' }, name: { es: 'Impresión 3D', en: '3D Printing' } },
  { id: 'home-automation', slug: { es: 'home-automation', en: 'home-automation' }, name: { es: 'Home Automation', en: 'Home Automation' } },
  { id: 'ingenieria-mecanica', slug: { es: 'ingenieria-mecanica', en: 'mechanical-engineering' }, name: { es: 'Ingeniería Mecánica', en: 'Mechanical Engineering' } },
  { id: 'baterias', slug: { es: 'baterias', en: 'batteries' }, name: { es: 'Baterías', en: 'Batteries' } },
  { id: 'vibe-code', slug: { es: 'vibe-code', en: 'vibe-code' }, name: { es: 'Vibe Code', en: 'Vibe Code' } },
  { id: 'otros', slug: { es: 'otros', en: 'other' }, name: { es: 'Otros', en: 'Other' } },
] as const;

export type CategoryId = (typeof categories)[number]['id'];
export const categoryIds = categories.map((c) => c.id) as [CategoryId, ...CategoryId[]];

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}

// Descripción de cada categoría: es lo que muestran Google y las redes bajo el título de su página.
// Entre 50 y 160 caracteres. Redactadas por la IA: Bruno las revisa (tarea A5 de TAREAS.md).
export const categoryDescriptions: Record<CategoryId, Record<Lang, string>> = {
  'impresion-3d': {
    es: 'Piezas diseñadas e impresas en 3D: soportes, carcasas y herramientas, con el material y los parámetros usados.',
    en: 'Parts designed and 3D printed: mounts, enclosures and tools, with the material and settings used.',
  },
  'home-automation': {
    es: 'Sensores, automatizaciones y paneles para la casa: qué se armó, con qué y cómo quedó configurado.',
    en: 'Sensors, automations and dashboards for the home: what was built, with what, and how it was set up.',
  },
  'ingenieria-mecanica': {
    es: 'Proyectos de ingeniería mecánica: diseño, cálculo y pruebas de piezas y sistemas, con el problema y la solución.',
    en: 'Mechanical engineering projects: design, calculation and testing of parts and systems, with the problem and the solution.',
  },
  baterias: {
    es: 'Proyectos sobre baterías: celdas, bancos de prueba, mediciones y seguridad térmica.',
    en: 'Battery projects: cells, test benches, measurements and thermal safety.',
  },
  'vibe-code': {
    es: 'Programas y herramientas armados junto a una IA: qué se pidió, qué salió bien y qué hubo que corregir.',
    en: 'Programs and tools built together with an AI: what was asked, what worked and what had to be fixed.',
  },
  otros: {
    es: 'Proyectos que no entran en las otras categorías, con el mismo formato: problema, solución y aprendizaje.',
    en: 'Projects that do not fit the other categories, in the same format: problem, solution and what I learned.',
  },
};

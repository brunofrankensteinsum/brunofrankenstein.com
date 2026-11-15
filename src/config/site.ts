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

// Textos de la interfaz (menú, botones, títulos) en cada idioma.
// Los rótulos se escriben en minúscula normal: el CSS los pasa a MAYÚSCULAS.
import type { Lang } from '../config/site';

export const ui = {
  es: {
    'skip': 'Saltar al contenido',
    'nav.label': 'Principal',
    'nav.home': 'Inicio',
    'nav.projects': 'Proyectos',
    'nav.experience': 'Experiencias',
    'nav.about': 'Sobre mí',
    'nav.contact': 'Contacto',
    'lang.label': 'Idioma',
    'menu.label': 'Menú',
    'menu.open': 'Abrir menú',
    'menu.close': 'Cerrar menú',
    'footer.social': 'Redes',
    'footer.scale': 'ESC 1:1',
    'home.latest': 'Últimos proyectos',
    'projects.title': 'Proyectos',
    'projects.label': 'Índice de láminas',
    'projects.intro':
      'Todo lo que construí, ordenado del más nuevo al más viejo. Cada lámina cuenta el problema, cómo lo resolví y qué aprendí.',
    'projects.empty': 'Todavía no hay proyectos publicados.',
    'category.label': 'Categoría',
    'project.repo': 'Ver repositorio en GitHub',
    'project.categories': 'Categorías',
    'experience.title': 'Experiencias',
    'experience.label': 'Cronograma',
    'experience.intro': 'Dónde trabajé, investigué y competí. Lo más reciente arriba.',
    'about.title': 'Sobre mí',
    'about.label': 'Memoria descriptiva',
    'contact.title': 'Contacto',
    'contact.label': 'Solicitud de cambio',
    'contact.intro': '¿Un proyecto, una pregunta o una idea para hacer juntos? Escribime.',
    'wip': 'Página en construcción · paso 3',
    'notfound.title': 'Lámina no encontrada',
    'notfound.label': 'ERR 404 · REV. —',
    'notfound.text': 'Esta página no existe o cambió de lugar.',
    'notfound.back': 'Volver al inicio',
  },
  en: {
    'skip': 'Skip to content',
    'nav.label': 'Main',
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.experience': 'Experience',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'lang.label': 'Language',
    'menu.label': 'Menu',
    'menu.open': 'Open menu',
    'menu.close': 'Close menu',
    'footer.social': 'Social',
    'footer.scale': 'SCALE 1:1',
    'home.latest': 'Latest projects',
    'projects.title': 'Projects',
    'projects.label': 'Sheet index',
    'projects.intro':
      'Everything I have built, newest first. Each sheet covers the problem, how I solved it and what I learned.',
    'projects.empty': 'No projects published yet.',
    'category.label': 'Category',
    'project.repo': 'View repository on GitHub',
    'project.categories': 'Categories',
    'experience.title': 'Experience',
    'experience.label': 'Timeline',
    'experience.intro': 'Where I have worked, done research and competed. Most recent first.',
    'about.title': 'About',
    'about.label': 'General notes',
    'contact.title': 'Contact',
    'contact.label': 'Change request',
    'contact.intro': 'A project, a question or an idea to build together? Write to me.',
    'wip': 'Page under construction · step 3',
    'notfound.title': 'Sheet not found',
    'notfound.label': 'ERR 404 · REV. —',
    'notfound.text': 'This page does not exist or has moved.',
    'notfound.back': 'Back to home',
  },
} as const;

export type UiKey = keyof (typeof ui)['es'];

export function t(lang: Lang, key: UiKey): string {
  return ui[lang][key];
}

export function formatDate(lang: Lang, date: Date): string {
  return date.toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
}

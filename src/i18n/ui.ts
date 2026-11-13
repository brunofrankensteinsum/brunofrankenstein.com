// Textos de la interfaz (menú, botones, títulos) en cada idioma.
import type { Lang } from '../config/site';

export const ui = {
  es: {
    'nav.home': 'Inicio',
    'nav.projects': 'Proyectos',
    'nav.experience': 'Experiencias',
    'nav.about': 'Sobre mí',
    'nav.contact': 'Contacto',
    'lang.switch': 'English',
    'home.latest': 'Últimos proyectos',
    'projects.title': 'Proyectos',
    'projects.empty': 'Todavía no hay proyectos publicados.',
    'project.repo': 'Ver repositorio en GitHub',
    'project.categories': 'Categorías',
  },
  en: {
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.experience': 'Experience',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'lang.switch': 'Español',
    'home.latest': 'Latest projects',
    'projects.title': 'Projects',
    'projects.empty': 'No projects published yet.',
    'project.repo': 'View repository on GitHub',
    'project.categories': 'Categories',
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

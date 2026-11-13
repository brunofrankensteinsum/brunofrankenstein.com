// Mapa de URLs del sitio en cada idioma. Usar siempre estas funciones para armar enlaces,
// así un cambio de dirección se hace en un solo lugar.
import { languages, getCategory, type Lang } from './site';

const segments = {
  about: { es: 'sobre-mi', en: 'about' },
  projects: { es: 'proyectos', en: 'projects' },
  category: { es: 'categoria', en: 'category' },
  experience: { es: 'experiencias', en: 'experience' },
  contact: { es: 'contacto', en: 'contact' },
} as const;

export type PageKey = 'home' | 'about' | 'projects' | 'experience' | 'contact';

export function pageUrl(lang: Lang, page: PageKey): string {
  if (page === 'home') return `/${lang}/`;
  return `/${lang}/${segments[page][lang]}/`;
}

export function projectUrl(lang: Lang, slug: string): string {
  return `/${lang}/${segments.projects[lang]}/${slug}/`;
}

export function categoryUrl(lang: Lang, categoryId: string): string {
  const category = getCategory(categoryId);
  const slug = category ? category.slug[lang] : categoryId;
  return `/${lang}/${segments.projects[lang]}/${segments.category[lang]}/${slug}/`;
}

export function experienceUrl(lang: Lang, slug: string): string {
  return `/${lang}/${segments.experience[lang]}/${slug}/`;
}

export function otherLang(lang: Lang): Lang {
  return languages.find((l) => l !== lang) ?? lang;
}

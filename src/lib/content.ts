// Funciones para leer el contenido ya filtrado por idioma.
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../config/site';

// El id de cada entrada es "<carpeta>/<idioma>", por ejemplo "mi-proyecto/es".
function parseId(id: string) {
  const [slug, lang] = id.split('/');
  return { slug, lang };
}

export type Project = CollectionEntry<'proyectos'> & { slug: string };
export type Experience = CollectionEntry<'experiencias'> & { slug: string };

// Proyectos publicados en un idioma, del más nuevo al más viejo.
export async function getProjects(lang: Lang): Promise<Project[]> {
  const entries = await getCollection('proyectos', (e) => parseId(e.id).lang === lang && !e.data.draft);
  return entries
    .map((e) => ({ ...e, slug: parseId(e.id).slug }))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getExperiences(lang: Lang): Promise<Experience[]> {
  const entries = await getCollection('experiencias', (e) => parseId(e.id).lang === lang && !e.data.draft);
  return entries
    .map((e) => ({ ...e, slug: parseId(e.id).slug }))
    .sort((a, b) => b.data.start.getTime() - a.data.start.getTime());
}

// Indica si un proyecto también está publicado en otro idioma.
export async function projectExists(lang: Lang, slug: string): Promise<boolean> {
  return (await getProjects(lang)).some((p) => p.slug === slug);
}

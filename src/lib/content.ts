// Funciones para leer el contenido ya filtrado por idioma.
import { getCollection, type CollectionEntry } from 'astro:content';
import { revisarContenido } from './validar-contenido.mjs';
import type { Lang } from '../config/site';

// El id de cada entrada es "<carpeta>/<idioma>", por ejemplo "mi-proyecto/es".
function parseId(id: string) {
  const [slug, lang] = id.split('/');
  return { slug, lang };
}

type ProjectEntry = CollectionEntry<'proyectos'>;
// Campos que un proyecto publicado tiene seguro (lo garantiza el esquema).
type CamposPublicado = 'title' | 'summary' | 'date' | 'cover' | 'coverAlt';
type PublishedData = ProjectEntry['data'] & Required<Pick<ProjectEntry['data'], CamposPublicado>>;

// Proyecto publicado: con título, resumen, fecha y portada.
export type Project = Omit<ProjectEntry, 'data'> & { data: PublishedData; slug: string };
// Proyecto en preparación: solo se conoce su número de lámina.
export type UpcomingProject = ProjectEntry & { slug: string };
export type Experience = CollectionEntry<'experiencias'> & { slug: string };

// ---------- Avisos al compilar (tarea D3) ----------
// Revisa que es.md y en.md de cada carpeta estén completos y coincidan (reglas en validar-contenido.mjs).
// Si algo no cuadra, el build (y `npm run dev`) se detiene con un mensaje que dice qué archivo y qué corregir.
// Se corre una sola vez por proceso.
let validacion: Promise<void> | undefined;

function validarContenido(): Promise<void> {
  validacion ??= (async () => {
    const errores = revisarContenido(await getCollection('proyectos'), await getCollection('experiencias'));
    if (errores.length > 0) throw new Error(`El contenido tiene ${errores.length} problema(s):\n - ${errores.join('\n - ')}`);
  })();
  return validacion;
}
// Todas las entradas de proyectos de un idioma, sin borradores.
async function getProjectEntries(lang: Lang) {
  await validarContenido();
  const entries = await getCollection('proyectos', (e) => parseId(e.id).lang === lang && !e.data.draft);
  // Dos proyectos no pueden compartir el número de lámina.
  const vistos = new Map<number, string>();
  for (const e of entries) {
    const otro = vistos.get(e.data.fig);
    if (otro) throw new Error(`El número de lámina FIG. ${e.data.fig} está repetido: "${otro}" y "${e.id}".`);
    vistos.set(e.data.fig, e.id);
  }
  return entries.map((e) => ({ ...e, slug: parseId(e.id).slug }));
}

// Proyectos publicados en un idioma, del más nuevo al más viejo.
export async function getProjects(lang: Lang): Promise<Project[]> {
  const entries = await getProjectEntries(lang);
  return (entries.filter((e) => e.data.status === 'publicado') as Project[]).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

// Proyectos en preparación, por número de lámina.
export async function getUpcomingProjects(lang: Lang): Promise<UpcomingProject[]> {
  const entries = await getProjectEntries(lang);
  return entries.filter((e) => e.data.status === 'en-preparacion').sort((a, b) => a.data.fig - b.data.fig);
}

// Experiencias de un idioma, de la más reciente a la más vieja según su fecha de inicio.
// Las que todavía no tienen fecha de inicio van al final.
export async function getExperiences(lang: Lang): Promise<Experience[]> {
  await validarContenido();
  const entries = await getCollection('experiencias', (e) => parseId(e.id).lang === lang && !e.data.draft);
  return entries
    .map((e) => ({ ...e, slug: parseId(e.id).slug }))
    .sort((a, b) => {
      const inicioA = a.data.start?.getTime();
      const inicioB = b.data.start?.getTime();
      if (inicioA !== undefined && inicioB !== undefined) return inicioB - inicioA;
      if (inicioA !== undefined) return -1;
      if (inicioB !== undefined) return 1;
      return a.slug.localeCompare(b.slug);
    });
}

// Indica si un proyecto también está publicado en otro idioma.
export async function projectExists(lang: Lang, slug: string): Promise<boolean> {
  return (await getProjects(lang)).some((p) => p.slug === slug);
}

// Número de lámina con dos cifras: 3 → "03".
export function figLabel(fig: number): string {
  return String(fig).padStart(2, '0');
}

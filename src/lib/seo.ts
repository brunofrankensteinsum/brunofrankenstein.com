// Datos estructurados (JSON-LD, schema.org): le explican a Google y a los asistentes de IA
// quién es Bruno, qué es cada página y cómo se relacionan, en un formato que entienden sin adivinar.
// Cada función devuelve un «nodo»; `grafo()` junta los de una página. Head.astro los escribe en el <head>.
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { site, type Lang } from '../config/site';
import { profile } from '../config/profile';
import { pageUrl } from '../config/routes';
import { retrato } from './retrato';

export const absoluta = (ruta: string) => new URL(ruta, site.url).href;

// Identificadores fijos: así todas las páginas hablan de la misma persona y del mismo sitio.
const personaId = `${site.url}/#bruno`;
const sitioId = `${site.url}/#sitio`;

// Imagen para compartir (Open Graph): 1200 × 630, recortada, en JPG (lo que mejor aceptan las redes).
export async function imagenCompartir(src: ImageMetadata): Promise<string> {
  const img = await getImage({ src, width: 1200, height: 630, fit: 'cover', format: 'jpg' });
  return absoluta(img.src);
}

// Versión mínima de la persona, para señalar al autor de un proyecto.
export const autor = { '@type': 'Person', '@id': personaId, name: site.name, url: absoluta('/') };

// La persona completa. Solo lleva datos que ya son públicos en el sitio.
export async function persona(lang: Lang) {
  const foto = retrato ? await getImage({ src: retrato, width: 800, height: 800, format: 'jpg' }) : undefined;
  return {
    '@type': 'Person',
    '@id': personaId,
    name: site.name,
    url: absoluta(pageUrl(lang, 'home')),
    description: profile.about.lead[lang],
    ...(foto && { image: absoluta(foto.src) }),
    // Perfiles propios: dejan que Google reconozca que son la misma persona.
    sameAs: Object.values(site.social).filter(Boolean),
    address: { '@type': 'PostalAddress', addressLocality: 'Montevideo', addressCountry: 'UY' },
  };
}

export function sitioWeb(lang: Lang) {
  return {
    '@type': 'WebSite',
    '@id': sitioId,
    name: site.name,
    url: absoluta(pageUrl(lang, 'home')),
    inLanguage: lang,
    author: { '@id': personaId },
  };
}

// Camino de migas: Inicio › Proyectos › esta lámina.
export function migas(elementos: { nombre: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: elementos.map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: e.nombre, item: absoluta(e.url) })),
  };
}

// Junta varios nodos en un solo bloque JSON-LD.
export function grafo(...nodos: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodos };
}

// Sitemap: la lista de páginas del sitio que leen los buscadores. Se publica en /sitemap.xml.
// Se arma solo al compilar, a partir de las mismas rutas y contenidos que usa el sitio:
// al publicar un proyecto nuevo, aparece acá sin tocar nada.
// No entran: borradores, láminas en preparación, categorías vacías ni la página 404.
import type { APIRoute } from 'astro';
import { site, languages, categories, type Lang } from '../config/site';
import { pageUrl, projectUrl, categoryUrl, type PageKey } from '../config/routes';
import { getProjects } from '../lib/content';

// Una página con sus versiones por idioma: { es: '/es/...', en: '/en/...' }.
type Versiones = Partial<Record<Lang, string>>;

export const GET: APIRoute = async () => {
  // Con el sitio marcado como no indexable, el sitemap queda vacío.
  const paginas: Versiones[] = [];

  if (site.indexable) {
    // Páginas fijas.
    const fijas: PageKey[] = ['home', 'projects', 'experience', 'about', 'contact'];
    for (const pagina of fijas) {
      paginas.push(Object.fromEntries(languages.map((l) => [l, pageUrl(l, pagina)])));
    }

    const proyectos = Object.fromEntries(await Promise.all(languages.map(async (l) => [l, await getProjects(l)] as const)));

    // Categorías que tienen al menos un proyecto en ese idioma.
    for (const categoria of categories) {
      const versiones: Versiones = {};
      for (const l of languages) {
        if (proyectos[l].some((p) => p.data.categories.includes(categoria.id))) versiones[l] = categoryUrl(l, categoria.id);
      }
      if (Object.keys(versiones).length > 0) paginas.push(versiones);
    }

    // Proyectos publicados. Uno que existe en un solo idioma aparece solo en ese.
    const slugs = new Set(languages.flatMap((l) => proyectos[l].map((p) => p.slug)));
    for (const slug of slugs) {
      const versiones: Versiones = {};
      for (const l of languages) {
        if (proyectos[l].some((p) => p.slug === slug)) versiones[l] = projectUrl(l, slug);
      }
      paginas.push(versiones);
    }
  }

  const absoluta = (ruta: string) => new URL(ruta, site.url).href;
  // Cada dirección lleva la lista de sus versiones en otros idiomas (hreflang).
  const entradas = paginas.flatMap((versiones) =>
    Object.values(versiones).map((ruta) => {
      const alternativas = Object.entries(versiones)
        .map(([l, r]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${absoluta(r)}"/>`)
        .join('\n');
      return `  <url>\n    <loc>${absoluta(ruta)}</loc>\n${alternativas}\n  </url>`;
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entradas.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

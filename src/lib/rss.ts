// Feed RSS de los proyectos publicados, uno por idioma (/es/rss.xml y /en/rss.xml).
// Quien se suscribe con un lector de feeds se entera de cada lámina nueva sin visitar el sitio.
// Se arma al compilar, a partir del mismo contenido que el resto del sitio.
import { site, type Lang } from '../config/site';
import { pageUrl, projectUrl } from '../config/routes';
import { t } from '../i18n/ui';
import { getProjects } from './content';
import { absoluta } from './seo';

// Escapa los caracteres que tienen significado en XML.
const xml = (texto: string) =>
  texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export async function feedRss(lang: Lang): Promise<Response> {
  // Con el sitio marcado como no indexable, el feed queda vacío (igual que el sitemap).
  const proyectos = site.indexable ? await getProjects(lang) : [];
  const items = proyectos.map(
    (p) => `    <item>
      <title>${xml(p.data.title)}</title>
      <link>${absoluta(projectUrl(lang, p.slug))}</link>
      <guid isPermaLink="true">${absoluta(projectUrl(lang, p.slug))}</guid>
      <pubDate>${p.data.date.toUTCString()}</pubDate>
      <description>${xml(p.data.summary)}</description>
    </item>`,
  );
  const cuerpo = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(`${site.name} · ${t(lang, 'projects.title')}`)}</title>
    <link>${absoluta(pageUrl(lang, 'projects'))}</link>
    <description>${xml(t(lang, 'meta.projects'))}</description>
    <language>${lang}</language>
    <atom:link href="${absoluta(`/${lang}/rss.xml`)}" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>
`;
  return new Response(cuerpo, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}

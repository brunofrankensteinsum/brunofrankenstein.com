// llms.txt: un resumen del sitio en texto simple, pensado para asistentes de IA.
// Les dice quién es Bruno, qué páginas hay y dónde está lo importante, sin tener que recorrer el HTML.
// Se arma al compilar con el mismo contenido que el resto del sitio. Formato: https://llmstxt.org
import type { APIRoute } from 'astro';
import { site, languages, type Lang } from '../config/site';
import { profile } from '../config/profile';
import { pageUrl, projectUrl, type PageKey } from '../config/routes';
import { t } from '../i18n/ui';
import { getProjects } from '../lib/content';
import { absoluta } from '../lib/seo';

const titulos: Record<Lang, { paginas: string; proyectos: string; opcional: string; feed: string }> = {
  es: { paginas: 'Páginas', proyectos: 'Proyectos', opcional: 'Opcional', feed: 'Feed RSS de proyectos nuevos' },
  en: { paginas: 'Pages', proyectos: 'Projects', opcional: 'Optional', feed: 'RSS feed of new projects' },
};

export const GET: APIRoute = async () => {
  const fijas: PageKey[] = ['home', 'projects', 'experience', 'about', 'contact'];
  const lineas: string[] = [`# ${site.name}`, '', `> ${profile.about.lead.en}`, '', `> ${profile.about.lead.es}`, ''];
  lineas.push(
    'Portfolio personal bilingüe (español e inglés). Cada proyecto es una «lámina» con el problema, la solución y lo aprendido.',
    'Bilingual personal portfolio (Spanish and English). Each project is a «sheet» with the problem, the solution and what was learned.',
    '',
  );

  // Con el sitio marcado como no indexable, solo queda el encabezado.
  if (site.indexable) {
    for (const lang of languages) {
      const proyectos = await getProjects(lang);
      lineas.push(`## ${titulos[lang].paginas} (${lang})`, '');
      for (const pagina of fijas) lineas.push(`- [${t(lang, `nav.${pagina}`)}](${absoluta(pageUrl(lang, pagina))})`);
      lineas.push('');
      if (proyectos.length > 0) {
        lineas.push(`## ${titulos[lang].proyectos} (${lang})`, '');
        for (const p of proyectos) lineas.push(`- [${p.data.title}](${absoluta(projectUrl(lang, p.slug))}): ${p.data.summary}`);
        lineas.push('');
      }
    }
    lineas.push(`## ${titulos.es.opcional} / ${titulos.en.opcional}`, '');
    for (const lang of languages) lineas.push(`- [${titulos[lang].feed}](${absoluta(`/${lang}/rss.xml`)})`);
    lineas.push('');
  }
  return new Response(lineas.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

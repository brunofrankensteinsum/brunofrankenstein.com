// robots.txt: las instrucciones para los rastreadores (buscadores y asistentes de IA).
// Se publica en /robots.txt. Política decidida en PLAN.md: permitir buscadores y
// rastreadores de IA (el objetivo es que citen el sitio) y bloquear el panel /admin.
// Nota: Cloudflare puede agregarle arriba un bloque de comentarios propio («content signals»).
import type { APIRoute } from 'astro';
import { site } from '../config/site';

// Rastreadores de IA que se nombran a propósito, para que quede claro que están permitidos.
const rastreadoresIA = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended'];

export const GET: APIRoute = () => {
  const lineas = [
    '# Buscadores y demás rastreadores: todo permitido, salvo el panel de edición.',
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    '',
    '# Asistentes de IA: permitidos, para que puedan citar el sitio.',
    ...rastreadoresIA.map((nombre) => `User-agent: ${nombre}`),
    'Allow: /',
    'Disallow: /admin/',
    '',
    `Sitemap: ${new URL('/sitemap.xml', site.url).href}`,
    '',
  ];
  return new Response(lineas.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

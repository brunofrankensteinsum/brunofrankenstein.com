// Configuración de Astro. Documentación: https://docs.astro.build/en/reference/configuration-reference/
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { marcarJs, prepararEntrada } from './src/scripts/en-linea.mjs';

// Huella (hash) de un script en línea, en el formato que pide la política de contenido.
const huella = (texto) => `sha256-${createHash('sha256').update(texto).digest('base64')}`;

// Cloudflare busca la página 404 «más cercana» a la dirección pedida: para /en/algo busca /en/404.html
// y recién después /404.html. Astro genera cada página como una carpeta (en/404/index.html), así que
// al terminar el build se copia a en/404.html (y a es/404.html) para que Cloudflare la encuentre.
const copiar404 = {
  name: 'copiar-404-por-idioma',
  hooks: {
    'astro:build:done': ({ dir }) => {
      for (const idioma of ['es', 'en']) {
        const origen = fileURLToPath(new URL(`${idioma}/404/index.html`, dir));
        if (existsSync(origen)) copyFileSync(origen, fileURLToPath(new URL(`${idioma}/404.html`, dir)));
      }
    },
  },
};

export default defineConfig({
  integrations: [copiar404],
  // Dirección pública del sitio. Se usa para armar URLs absolutas (sitemap, SEO).
  site: 'https://brunofrankenstein.com',
  // Todas las URLs terminan en "/" para que cada página tenga una sola dirección.
  trailingSlash: 'always',
  markdown: {
    // Los bloques de código van sin colores: una sola tinta, como en un plano.
    syntaxHighlight: false,
  },
  security: {
    // Política de seguridad de contenido (CSP): le dice al navegador de dónde puede cargar
    // cada tipo de recurso. Si alguien lograra inyectar un script ajeno, el navegador no lo ejecuta.
    // Astro la escribe en cada página y calcula solo las huellas de sus scripts y estilos.
    // Solo actúa en el sitio compilado (npm run build + npm run preview), no en npm run dev.
    // El resto de la política (lo que no se puede declarar dentro del HTML) está en public/_headers.
    csp: {
      directives: [
        // Por defecto, todo sale del propio sitio.
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        // Pedidos desde scripts: el formulario de contacto (que va al propio sitio, /api/contacto)
        // y Turnstile, el antispam de Cloudflare.
        // cloudflareinsights.com: estadísticas sin cookies (Cloudflare Web Analytics).
        "connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com",
        // Contenido ajeno que se incrusta: el reproductor de YouTube sin cookies y el widget de Turnstile.
        "frame-src https://www.youtube-nocookie.com https://challenges.cloudflare.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      scriptDirective: {
        // Además de los scripts propios, se permiten el de Turnstile (solo se carga en Contacto)
        // y el de las estadísticas de Cloudflare (Web Analytics), que Cloudflare agrega solo.
        resources: ["'self'", 'https://challenges.cloudflare.com', 'https://static.cloudflareinsights.com'],
        // Los dos scripts escritos dentro del HTML (src/scripts/en-linea.mjs).
        hashes: [huella(marcarJs), huella(prepararEntrada)],
      },
    },
  },
});

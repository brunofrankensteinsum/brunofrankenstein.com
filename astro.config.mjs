// Configuración de Astro. Documentación: https://docs.astro.build/en/reference/configuration-reference/
import { createHash } from 'node:crypto';
import { defineConfig } from 'astro/config';
import { marcarJs, prepararEntrada } from './src/scripts/en-linea.mjs';

// Huella (hash) de un script en línea, en el formato que pide la política de contenido.
const huella = (texto) => `sha256-${createHash('sha256').update(texto).digest('base64')}`;

export default defineConfig({
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
        // Pedidos desde scripts (el formulario de contacto). Si el envío se aloja en otro
        // dominio (pista D de PLAN.md), agregar acá su dirección.
        "connect-src 'self'",
        // Único contenido ajeno que se incrusta: el reproductor de YouTube sin cookies.
        "frame-src https://www.youtube-nocookie.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      scriptDirective: {
        // Los dos scripts escritos dentro del HTML (src/scripts/en-linea.mjs).
        hashes: [huella(marcarJs), huella(prepararEntrada)],
      },
    },
  },
});

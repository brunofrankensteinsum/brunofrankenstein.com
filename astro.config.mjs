// Configuración de Astro. Documentación: https://docs.astro.build/en/reference/configuration-reference/
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Dirección pública del sitio. Se usa para armar URLs absolutas (sitemap, SEO).
  site: 'https://brunofrankenstein.com',
  // Todas las URLs terminan en "/" para que cada página tenga una sola dirección.
  trailingSlash: 'always',
  markdown: {
    // Los bloques de código van sin colores: una sola tinta, como en un plano.
    syntaxHighlight: false,
  },
});

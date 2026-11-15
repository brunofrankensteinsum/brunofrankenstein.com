// Worker del sitio: Cloudflare lo ejecuta solo para las direcciones que empiezan con /api/
// (ver "run_worker_first" en wrangler.jsonc). Todo lo demás lo sirve directamente el sitio estático.
// Por ahora hay una sola ruta: POST /api/contacto, el formulario de contacto.
import { EmailMessage } from 'cloudflare:email';
import { manejarContacto } from './contacto.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/contacto') {
      return manejarContacto(request, env, {
        crearMensaje: (de, para, crudo) => new EmailMessage(de, para, crudo),
      });
    }
    if (pathname.startsWith('/api/')) return new Response(null, { status: 404 });
    // Cualquier otra dirección: el sitio estático.
    return env.ASSETS.fetch(request);
  },
};

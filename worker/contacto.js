// Lógica del formulario de contacto: valida lo que llega, comprueba el antispam y arma el correo.
// No usa nada propio de Cloudflare, así que se puede probar en Node (npm test).
// Quien la conecta con Cloudflare es worker/index.js.
//
// Camino de un mensaje:
//   navegador → POST /api/contacto → (1) pedido sano → (2) datos válidos → (3) Turnstile → (4) correo a Bruno
//
// Variables que necesita (se cargan en Cloudflare, ver docs/formulario-contacto.md):
//   TURNSTILE_SECRET  secreto de Turnstile (antispam)            [secreto]
//   DESTINO           correo de Bruno, donde llegan los mensajes [secreto: NO va en el repositorio]
//   REMITENTE         dirección del dominio que figura como emisor (wrangler.jsonc)
//   CORREO            servicio de envío de Cloudflare Email (wrangler.jsonc)
//   LIMITADOR         (opcional) límite de envíos por IP

// Tamaño máximo del pedido, en caracteres. Un mensaje normal ocupa una fracción de esto.
export const LIMITE_CUERPO = 10_000;

const MOTIVOS = { project: 'Proyecto', research: 'Investigacion', work: 'Trabajo', other: 'Otro' };
const IDIOMAS = ['es', 'en'];

// Saltos de linea de cualquier tipo: \r, \n y los separadores Unicode U+0085, U+2028 y U+2029.
// (Los tres ultimos se arman con su codigo para no escribirlos a mano dentro del archivo.)
const SALTOS_DE_LINEA = new RegExp('[\\r\\n' + String.fromCharCode(0x85, 0x2028, 0x2029) + ']+', 'g');

// Deja un texto en una sola linea y sin caracteres de control. Es la defensa contra la «inyeccion
// de cabeceras»: sin saltos de linea, nadie puede colar cabeceras extra (por ejemplo un destinatario
// mas) en el correo.
export function limpiarLinea(texto) {
  return String(texto)
    .replace(SALTOS_DE_LINEA, ' ')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim();
}

// Revisa los datos del formulario. Devuelve { ok: true, valor } o { ok: false, campo }.
export function validar(datos) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) return { ok: false, campo: 'cuerpo' };
  const { nombre, email, motivo, mensaje, idioma, turnstile } = datos;
  if (typeof nombre !== 'string' || !limpiarLinea(nombre) || nombre.length > 100) return { ok: false, campo: 'nombre' };
  // Email sencillo, sin espacios ni caracteres que tengan significado en un correo.
  if (
    typeof email !== 'string' ||
    email.length > 254 ||
    !/^[^\s@<>"',;:()[\]\\]+@[^\s@<>"',;:()[\]\\]+\.[^\s@<>"',;:()[\]\\]{2,}$/.test(email)
  ) {
    return { ok: false, campo: 'email' };
  }
  if (typeof motivo !== 'string' || !(motivo in MOTIVOS)) return { ok: false, campo: 'motivo' };
  if (typeof mensaje !== 'string' || mensaje.trim().length < 10 || mensaje.length > 5000) return { ok: false, campo: 'mensaje' };
  if (typeof turnstile !== 'string' || !turnstile || turnstile.length > 2048) return { ok: false, campo: 'turnstile' };
  return {
    ok: true,
    valor: {
      nombre: limpiarLinea(nombre),
      email,
      motivo,
      mensaje: mensaje.replace(/\r\n/g, '\n').trim(),
      idioma: IDIOMAS.includes(idioma) ? idioma : 'es',
      turnstile,
    },
  };
}

// Pregunta a Cloudflare si el token de Turnstile es de una persona.
// Devuelve { ok: true } o { ok: false, motivo } (el motivo ayuda a encontrar el problema).
export async function verificarTurnstile(token, secreto, ip, host, pedir = fetch) {
  const cuerpo = new URLSearchParams({ secret: secreto, response: token });
  if (ip) cuerpo.set('remoteip', ip);
  try {
    const respuesta = await pedir('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: cuerpo });
    const datos = await respuesta.json();
    if (datos.success !== true) return { ok: false, motivo: (datos['error-codes'] ?? ['sin-codigo']).join(',') };
    // El token tiene que haber sido emitido para este mismo sitio.
    if (host && datos.hostname && datos.hostname !== host) return { ok: false, motivo: `dominio-distinto:${datos.hostname}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, motivo: `no-responde:${String(e?.message ?? e).slice(0, 80)}` };
  }
}

// Texto en base64 en líneas de 76 caracteres, como pide el formato de correo.
function base64(texto) {
  const bytes = new TextEncoder().encode(texto);
  let binario = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binario += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binario).replace(/.{1,76}/g, '$&\r\n').trimEnd();
}

// Arma el correo completo (cabeceras + cuerpo) como texto.
export function armarCorreo({ de, para, datos, id, ahora }) {
  const dominio = de.split('@')[1];
  const cuerpo = [
    `Nombre: ${datos.nombre}`,
    `Email: ${datos.email}`,
    `Motivo: ${MOTIVOS[datos.motivo]}`,
    `Idioma de la pagina: ${datos.idioma}`,
    `Enviado: ${ahora.toISOString()}`,
    '',
    'Mensaje:',
    datos.mensaje,
    '',
    '---',
    'Enviado desde el formulario de contacto del sitio. Respondé a este correo para escribirle a la persona.',
  ].join('\n');
  return [
    `From: Formulario del sitio <${de}>`,
    `To: <${para}>`,
    // Reply-To: al responder, la respuesta va a quien escribió (el email ya fue validado, sin espacios).
    `Reply-To: <${datos.email}>`,
    `Subject: Nuevo mensaje del sitio - ${MOTIVOS[datos.motivo]}`,
    `Date: ${ahora.toUTCString()}`,
    `Message-ID: <${id}@${dominio}>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    base64(cuerpo),
    '',
  ].join('\r\n');
}

// Respuesta JSON que ningún navegador guarda en caché.
function responder(estado, datos) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}

// Atiende un POST a /api/contacto. `deps` permite reemplazar lo de afuera en las pruebas.
export async function manejarContacto(request, env, deps = {}) {
  const { crearMensaje, pedir = fetch, ahora = () => new Date(), uuid = () => crypto.randomUUID() } = deps;

  if (request.method !== 'POST') return responder(405, { ok: false, error: 'metodo' });

  // (1) Pedido sano. Solo se aceptan envíos hechos desde este mismo sitio.
  const url = new URL(request.url);
  if (request.headers.get('Origin') !== url.origin) return responder(403, { ok: false, error: 'origen' });
  if (!(request.headers.get('Content-Type') ?? '').includes('application/json')) return responder(415, { ok: false, error: 'tipo' });
  if (Number(request.headers.get('Content-Length') ?? 0) > LIMITE_CUERPO) return responder(413, { ok: false, error: 'tamano' });
  const texto = await request.text();
  if (texto.length > LIMITE_CUERPO) return responder(413, { ok: false, error: 'tamano' });
  let datos;
  try {
    datos = JSON.parse(texto);
  } catch {
    return responder(400, { ok: false, error: 'json' });
  }

  // Si falta configurar algo en Cloudflare, el formulario avisa que no está conectado (503).
  if (!env.TURNSTILE_SECRET || !env.DESTINO || !env.REMITENTE || !env.CORREO) return responder(503, { ok: false, error: 'no-configurado' });

  // Campo trampa completado: es un robot. Se responde «bien» para no darle pistas, pero no se envía nada.
  if (datos && typeof datos === 'object' && datos.sitio) return responder(200, { ok: true });

  // (2) Datos válidos (se revisan de nuevo acá: lo que valida el navegador no sirve contra un robot).
  const revision = validar(datos);
  if (!revision.ok) return responder(400, { ok: false, error: 'datos', campo: revision.campo });

  // Límite de envíos por IP, si está configurado.
  const ip = request.headers.get('CF-Connecting-IP') ?? '';
  if (env.LIMITADOR) {
    const { success } = await env.LIMITADOR.limit({ key: ip || 'sin-ip' });
    if (!success) return responder(429, { ok: false, error: 'demasiados' });
  }

  // (3) Turnstile.
  const humano = await verificarTurnstile(revision.valor.turnstile, env.TURNSTILE_SECRET, ip, url.hostname, pedir);
  if (!humano.ok) {
    // Los motivos quedan en los registros de Cloudflare y se devuelven (son códigos, sin datos privados).
    console.warn('[contacto] Turnstile rechazó el mensaje:', humano.motivo);
    return responder(403, { ok: false, error: 'antispam', detalle: humano.motivo });
  }

  // (4) Correo a Bruno.
  try {
    const crudo = armarCorreo({ de: env.REMITENTE, para: env.DESTINO, datos: revision.valor, id: uuid(), ahora: ahora() });
    await env.CORREO.send(crearMensaje(env.REMITENTE, env.DESTINO, crudo));
    // Queda en los registros de Cloudflare: si esta línea aparece pero el correo no llega, el problema
    // está después del Worker (carpeta de spam, destino sin verificar, filtros del correo).
    console.log('[contacto] Cloudflare aceptó el correo para enviarlo.');
  } catch (e) {
    // El texto del error lo escribe Cloudflare (por ejemplo «destination address is not verified»).
    const detalle = String(e?.message ?? e).slice(0, 200);
    console.error('[contacto] No se pudo enviar el correo:', detalle);
    return responder(502, { ok: false, error: 'envio', detalle });
  }
  return responder(200, { ok: true });
}

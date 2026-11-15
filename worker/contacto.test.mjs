// Pruebas de la lógica del formulario. Se corren con:  npm test
// Usan solo lo que trae Node (node:test), sin instalar nada.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { armarCorreo, limpiarLinea, manejarContacto, validar } from './contacto.js';

const valido = {
  nombre: 'Ana Pérez',
  email: 'ana@ejemplo.com',
  motivo: 'project',
  mensaje: 'Hola Bruno, me gustó el soporte de sensor. ¿Lo podemos hablar? 🙂',
  idioma: 'es',
  turnstile: 'token-de-prueba',
};

// Entorno de prueba: guarda lo que se «envía» en vez de mandar un correo.
function entorno(extra = {}) {
  const enviados = [];
  return {
    enviados,
    env: {
      TURNSTILE_SECRET: 'secreto',
      DESTINO: 'bruno@privado.test',
      REMITENTE: 'formulario@brunofrankenstein.com',
      CORREO: { send: async (m) => enviados.push(m) },
      ...extra,
    },
  };
}
const deps = (enviados, turnstileOk = true) => ({
  crearMensaje: (de, para, crudo) => ({ de, para, crudo }),
  pedir: async () => ({ json: async () => ({ success: turnstileOk, hostname: 'brunofrankenstein.com' }) }),
  ahora: () => new Date('2026-11-15T12:00:00Z'),
  uuid: () => 'id-fijo',
});
const pedido = (cuerpo, { origen = 'https://brunofrankenstein.com', metodo = 'POST', tipo = 'application/json' } = {}) =>
  new Request('https://brunofrankenstein.com/api/contacto', {
    method: metodo,
    headers: { Origin: origen, 'Content-Type': tipo },
    body: metodo === 'POST' ? (typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo)) : undefined,
  });

test('limpiarLinea deja una sola línea', () => {
  assert.equal(limpiarLinea('Ana\r\nBcc: otro@x.com\nmás'), 'Ana Bcc: otro@x.com más');
  // También los separadores de línea raros de Unicode (U+0085, U+2028, U+2029).
  assert.equal(limpiarLinea('A' + String.fromCharCode(0x85, 0x2028, 0x2029) + 'B'), 'A B');
});

test('validar acepta un envío correcto y rechaza los incorrectos', () => {
  assert.equal(validar(valido).ok, true);
  assert.equal(validar({ ...valido, nombre: '' }).campo, 'nombre');
  assert.equal(validar({ ...valido, email: 'sin-arroba' }).campo, 'email');
  assert.equal(validar({ ...valido, email: 'a@b.com\r\nBcc: x@y.com' }).campo, 'email');
  assert.equal(validar({ ...valido, email: 'a b@c.com' }).campo, 'email');
  assert.equal(validar({ ...valido, motivo: 'hack' }).campo, 'motivo');
  assert.equal(validar({ ...valido, mensaje: 'corto' }).campo, 'mensaje');
  assert.equal(validar({ ...valido, mensaje: 'x'.repeat(5001) }).campo, 'mensaje');
  assert.equal(validar({ ...valido, turnstile: '' }).campo, 'turnstile');
  assert.equal(validar(null).ok, false);
  assert.equal(validar({ ...valido, idioma: 'fr' }).valor.idioma, 'es');
});

test('el correo no admite cabeceras inyectadas', () => {
  const datos = validar({ ...valido, nombre: 'Ana\r\nBcc: espia@x.com' }).valor;
  const crudo = armarCorreo({ de: 'formulario@brunofrankenstein.com', para: 'bruno@privado.test', datos, id: 'id', ahora: new Date() });
  const cabeceras = crudo.split('\r\n\r\n')[0].split('\r\n');
  for (const linea of cabeceras) assert.match(linea, /^(From|To|Reply-To|Subject|Date|Message-ID|MIME-Version|Content-Type|Content-Transfer-Encoding): /);
  assert.equal(cabeceras.filter((l) => l.startsWith('To:')).length, 1);
  // El cuerpo viaja en base64 y recupera tildes y emojis sin cambios.
  const cuerpo = Buffer.from(crudo.split('\r\n\r\n')[1].replace(/\r\n/g, ''), 'base64').toString('utf8');
  assert.match(cuerpo, /Nombre: Ana Bcc: espia@x.com/);
});

test('un envío correcto manda un correo a Bruno con Reply-To', async () => {
  const { env, enviados } = entorno();
  const r = await manejarContacto(pedido(valido), env, deps(enviados));
  assert.equal(r.status, 200);
  assert.equal(enviados.length, 1);
  assert.equal(enviados[0].para, 'bruno@privado.test');
  assert.equal(enviados[0].de, 'formulario@brunofrankenstein.com');
  assert.match(enviados[0].crudo, /Reply-To: <ana@ejemplo\.com>/);
  const cuerpo = Buffer.from(enviados[0].crudo.split('\r\n\r\n')[1].replace(/\r\n/g, ''), 'base64').toString('utf8');
  assert.match(cuerpo, /ejemplo|Hola Bruno, me gustó el soporte de sensor\. ¿Lo podemos hablar\? 🙂/);
});

test('rechaza lo que no debe', async () => {
  const { env, enviados } = entorno();
  const d = deps(enviados);
  assert.equal((await manejarContacto(pedido(valido, { metodo: 'GET' }), env, d)).status, 405);
  assert.equal((await manejarContacto(pedido(valido, { origen: 'https://malo.com' }), env, d)).status, 403);
  assert.equal((await manejarContacto(pedido(valido, { tipo: 'text/plain' }), env, d)).status, 415);
  assert.equal((await manejarContacto(pedido('{no es json'), env, d)).status, 400);
  assert.equal((await manejarContacto(pedido({ ...valido, mensaje: 'x'.repeat(20_000) }), env, d)).status, 413);
  assert.equal((await manejarContacto(pedido({ ...valido, email: 'mal' }), env, d)).status, 400);
  // Turnstile dice que no es una persona.
  assert.equal((await manejarContacto(pedido(valido), env, deps(enviados, false))).status, 403);
  assert.equal(enviados.length, 0, 'nada de esto debe enviar correo');
});

test('el campo trampa responde bien pero no envía', async () => {
  const { env, enviados } = entorno();
  const r = await manejarContacto(pedido({ ...valido, sitio: 'http://spam.com' }), env, deps(enviados));
  assert.equal(r.status, 200);
  assert.equal(enviados.length, 0);
});

test('sin configurar avisa 503, y un fallo del correo avisa 502', async () => {
  const sinSecreto = entorno({ TURNSTILE_SECRET: undefined });
  assert.equal((await manejarContacto(pedido(valido), sinSecreto.env, deps(sinSecreto.enviados))).status, 503);
  const roto = entorno({ CORREO: { send: async () => { throw new Error('no se pudo'); } } });
  assert.equal((await manejarContacto(pedido(valido), roto.env, deps(roto.enviados))).status, 502);
});

test('el límite por IP corta con 429', async () => {
  const { env, enviados } = entorno({ LIMITADOR: { limit: async () => ({ success: false }) } });
  assert.equal((await manejarContacto(pedido(valido), env, deps(enviados))).status, 429);
  assert.equal(enviados.length, 0);
});

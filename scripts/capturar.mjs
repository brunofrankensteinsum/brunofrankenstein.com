// Capturas de página completa en 375, 768, 1280 y 1440 px, para revisar el diseño en los cuatro anchos.
// Maneja Edge (o Chrome) por su protocolo de depuración: no instala nada.
//
// Uso:
//   npm run capturas                              → las 5 páginas principales en español, desde http://localhost:4321
//   npm run capturas -- salida/ inicio=http://localhost:4321/es/ otra=http://localhost:4321/en/about/
//
// Primero hay que tener el sitio andando (`npm run dev` en otra terminal). Las capturas van a la carpeta
// `capturas/` (Git la ignora) salvo que se indique otra como primer argumento.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const anchos = [375, 768, 1280, 1440];
const PUERTO = 9333;
const BASE = 'http://localhost:4321';

// Navegadores que puede usar, en orden de preferencia.
const candidatos = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];
const navegador = process.env.NAVEGADOR || candidatos.find((c) => existsSync(c));
if (!navegador) {
  console.error('No encontré Edge ni Chrome. Indicá la ruta con la variable NAVEGADOR.');
  process.exit(1);
}

// Argumentos: [carpeta] nombre=url …  (la carpeta es el primero que no lleva «=»).
const args = process.argv.slice(2);
const salida = args[0] && !args[0].includes('=') ? args.shift() : 'capturas';
const paginas = args.length
  ? args
  : ['inicio=/es/', 'proyectos=/es/proyectos/', 'experiencias=/es/experiencias/', 'sobre-mi=/es/sobre-mi/', 'contacto=/es/contacto/'];
mkdirSync(salida, { recursive: true });

const perfil = mkdtempSync(join(tmpdir(), 'capturas-'));
const edge = spawn(
  navegador,
  ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', `--remote-debugging-port=${PUERTO}`, `--user-data-dir=${perfil}`, 'about:blank'],
  { stdio: 'ignore' },
);

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
async function pestana() {
  for (let i = 0; i < 40; i++) {
    try {
      const lista = await (await fetch(`http://127.0.0.1:${PUERTO}/json/list`)).json();
      const p = lista.find((t) => t.type === 'page');
      if (p) return p.webSocketDebuggerUrl;
    } catch {
      // Todavía arrancando.
    }
    await esperar(250);
  }
  throw new Error('El navegador no respondió.');
}

try {
  const ws = new WebSocket(await pestana());
  await new Promise((ok, mal) => {
    ws.onopen = ok;
    ws.onerror = mal;
  });
  let id = 0;
  const pendientes = new Map();
  const eventos = [];
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pendientes.has(msg.id)) {
      pendientes.get(msg.id)(msg);
      pendientes.delete(msg.id);
    } else if (msg.method) eventos.forEach((f) => f(msg));
  };
  const cdp = (method, params = {}) =>
    new Promise((ok, mal) => {
      const n = ++id;
      pendientes.set(n, (msg) => (msg.error ? mal(new Error(`${method}: ${msg.error.message}`)) : ok(msg.result)));
      ws.send(JSON.stringify({ id: n, method, params }));
    });
  const evento = (nombre) =>
    new Promise((ok) => {
      const f = (msg) => {
        if (msg.method === nombre) {
          eventos.splice(eventos.indexOf(f), 1);
          ok();
        }
      };
      eventos.push(f);
    });

  await cdp('Page.enable');
  for (const par of paginas) {
    const corte = par.indexOf('=');
    const nombre = par.slice(0, corte);
    const destino = par.slice(corte + 1);
    const url = destino.startsWith('http') ? destino : BASE + destino;
    for (const ancho of anchos) {
      await cdp('Emulation.setDeviceMetricsOverride', { width: ancho, height: 900, deviceScaleFactor: 1, mobile: ancho < 768 });
      const cargada = evento('Page.loadEventFired');
      await cdp('Page.navigate', { url });
      await cargada;
      // Fuerza la carga de las imágenes diferidas y espera fuentes e imágenes.
      await cdp('Runtime.evaluate', {
        awaitPromise: true,
        expression: `(async () => {
          const imgs = [...document.images];
          imgs.forEach((i) => { i.loading = 'eager'; });
          await Promise.all(imgs.map((i) => i.complete && i.naturalWidth ? null : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 8000); })));
          await Promise.all(imgs.map((i) => i.decode().catch(() => {})));
          await document.fonts.ready;
          // Quita la barra de herramientas de Astro (solo aparece con npm run dev).
          document.querySelector('astro-dev-toolbar')?.remove();
          // Recorre la página de punta a punta: así se activan los elementos que aparecen al hacer scroll.
          for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight / 2) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 120));
          }
          window.scrollTo(0, 0);
          await new Promise((r) => setTimeout(r, 900));
          document.querySelector('astro-dev-toolbar')?.remove();
        })()`,
      });
      const { cssContentSize } = await cdp('Page.getLayoutMetrics');
      const alto = Math.ceil(cssContentSize.height);
      const { data } = await cdp('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: ancho, height: alto, scale: 1 },
      });
      const archivo = join(salida, `${nombre}-${ancho}.png`);
      writeFileSync(archivo, Buffer.from(data, 'base64'));
      console.log(`${archivo}  ${ancho}x${alto}`);
    }
  }
  ws.close();
} finally {
  edge.kill();
  await esperar(1000);
  try {
    rmSync(perfil, { recursive: true, force: true, maxRetries: 5 });
  } catch {
    // Si Windows todavía tiene archivos abiertos, queda en la carpeta temporal y se limpia solo más tarde.
  }
}

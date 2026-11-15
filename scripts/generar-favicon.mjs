// Genera el ícono del sitio (favicon) en todos los tamaños, a partir de un solo dibujo.
// Uso:  node scripts/generar-favicon.mjs
// Solo hace falta correrlo de nuevo si se cambia el dibujo o los colores.
//
// El dibujo: monograma «BF» dentro de un cuadrado tipo cajetín, en acento sobre papel.
// Las letras están hechas con trazos rectos (no con una fuente), así se ven igual en
// cualquier máquina y siguen la regla del diseño: todo recto, sin curvas.
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const PAPEL = '#0C2340';
const ACENTO = '#7FD6FF'; // si cambia --c-accent en src/styles/tokens.css, cambiar acá y volver a correr

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${PAPEL}"/>
  <g fill="none" stroke="${ACENTO}" stroke-linecap="square" stroke-linejoin="miter">
    <rect x="2.5" y="2.5" width="27" height="27" stroke-width="1.5"/>
    <path stroke-width="2" d="M8 9v14h5l2-2v-3l-2-2 2-2v-3l-2-2H8M8 16h5"/>
    <path stroke-width="2" d="M19 23V9h6M19 16h4"/>
  </g>
</svg>
`;

mkdirSync('public', { recursive: true });
writeFileSync('public/favicon.svg', svg);

// PNG en el tamaño pedido. "density" hace que el dibujo se trace nítido, sin agrandar píxeles.
const png = (lado) =>
  sharp(Buffer.from(svg), { density: Math.ceil((72 * lado) / 32) })
    .resize(lado, lado)
    .png()
    .toBuffer();

writeFileSync('public/apple-touch-icon.png', await png(180)); // pantalla de inicio de iPhone
writeFileSync('public/icon-192.png', await png(192)); // Android
writeFileSync('public/icon-512.png', await png(512)); // Android, pantalla de carga

// favicon.ico: el archivo que los navegadores piden por costumbre. Es un PNG de 32 px
// envuelto en la cabecera del formato .ico (6 bytes + 16 bytes de índice).
const chico = await png(32);
const cabecera = Buffer.alloc(22);
cabecera.writeUInt16LE(0, 0); // reservado
cabecera.writeUInt16LE(1, 2); // tipo: ícono
cabecera.writeUInt16LE(1, 4); // cantidad de imágenes
cabecera.writeUInt8(32, 6); // ancho
cabecera.writeUInt8(32, 7); // alto
cabecera.writeUInt8(0, 8); // sin paleta
cabecera.writeUInt8(0, 9); // reservado
cabecera.writeUInt16LE(1, 10); // planos de color
cabecera.writeUInt16LE(32, 12); // bits por píxel
cabecera.writeUInt32LE(chico.length, 14); // tamaño de la imagen
cabecera.writeUInt32LE(22, 18); // dónde empieza la imagen
writeFileSync('public/favicon.ico', Buffer.concat([cabecera, chico]));

// Manifiesto: nombre, colores e íconos para cuando alguien agrega el sitio a su pantalla de inicio.
const manifiesto = {
  name: 'Bruno Frankenstein',
  short_name: 'B.Frankenstein',
  start_url: '/',
  display: 'browser',
  background_color: PAPEL,
  theme_color: PAPEL,
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
};
writeFileSync('public/site.webmanifest', JSON.stringify(manifiesto, null, 2) + '\n');

console.log('Listo: favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png y site.webmanifest en public/.');

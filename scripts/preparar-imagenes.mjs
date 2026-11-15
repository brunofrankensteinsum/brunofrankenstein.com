// Prepara las fotos de una lámina para publicarlas.
// Uso:  npm run imagenes -- src/content/proyectos/<carpeta>
//
// Qué hace con cada foto suelta de la carpeta (jpg, jpeg, png, webp):
//   1. La endereza según como se sacó (las fotos de celular traen un giro escondido).
//   2. La achica a 2400 px de ancho como máximo (nunca la agranda).
//   3. BORRA todos sus metadatos: ubicación GPS, modelo de cámara, fecha y hora. El repositorio es público.
//   4. La guarda con nombre ordenado: 01-nombre-original.jpg, 02-…  (si se llama «portada», queda portada.jpg).
//   5. Mueve el archivo original a la subcarpeta _originales/, que Git ignora (no se sube a GitHub).
// Las fotos ya preparadas (01-algo.jpg, portada.jpg) no se tocan, así que se puede volver a correr sin problema.
import { existsSync, mkdirSync, readdirSync, renameSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';

const carpeta = process.argv[2];
if (!carpeta || !existsSync(carpeta)) {
  console.error('Falta la carpeta (o no existe).\nUso: npm run imagenes -- src/content/proyectos/<carpeta>');
  process.exit(1);
}

const ANCHO_MAXIMO = 2400;
const esImagen = (n) => /\.(jpe?g|png|webp)$/i.test(n);
// Ya preparada: «portada.jpg» o «01-algo.jpg».
const yaPreparada = (n) => /^(portada|\d{2}-[a-z0-9-]+)\.(jpg|png)$/.test(n);

// Nombre sin tildes, en minúsculas y con guiones: «Foto Soporte (1).JPG» → «foto-soporte-1».
const limpiar = (nombre) =>
  nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'foto';

const archivos = readdirSync(carpeta).filter((n) => esImagen(n) && !yaPreparada(n)).sort();
if (archivos.length === 0) {
  console.log('No hay fotos nuevas para preparar en', carpeta);
  process.exit(0);
}

// El próximo número libre: sigue después del más alto que ya exista.
let numero = Math.max(0, ...readdirSync(carpeta).map((n) => Number(n.match(/^(\d{2})-/)?.[1] ?? 0)));
mkdirSync(join(carpeta, '_originales'), { recursive: true });

for (const nombre of archivos) {
  const base = limpiar(basename(nombre, extname(nombre)));
  const png = /\.png$/i.test(nombre); // las capturas y esquemas se quedan en PNG para no perder nitidez
  const ext = png ? 'png' : 'jpg';
  const destino = base === 'portada' ? `portada.${ext}` : `${String(++numero).padStart(2, '0')}-${base}.${ext}`;

  // Si ya hay otro archivo con ese nombre (por ejemplo, otra «portada»), no se pisa.
  if (existsSync(join(carpeta, destino)) && destino.toLowerCase() !== nombre.toLowerCase()) {
    console.warn(`Salteada ${nombre}: ya existe ${destino}. Renombrala y volvé a correr el comando.`);
    continue;
  }
  // Se escribe primero con un nombre temporal y recién después se mueve el original: así
  // funciona también cuando la foto ya se llama igual (por ejemplo «Portada.JPG» → «portada.jpg»).
  const temporal = join(carpeta, `.preparando-${destino}`);
  // sharp no copia los metadatos a la imagen nueva salvo que se le pida: por eso queda sin GPS.
  const imagen = sharp(join(carpeta, nombre)).rotate().resize({ width: ANCHO_MAXIMO, withoutEnlargement: true });
  await (png ? imagen.png({ compressionLevel: 9 }) : imagen.jpeg({ quality: 85, mozjpeg: true })).toFile(temporal);
  renameSync(join(carpeta, nombre), join(carpeta, '_originales', nombre));
  renameSync(temporal, join(carpeta, destino));
  console.log(`${nombre}  →  ${destino}`);
}
console.log(`\nListo. Los originales quedaron en ${join(carpeta, '_originales')} (no se suben a GitHub).`);
console.log('Siguiente: citar cada foto en es.md y en.md con su texto alternativo.');

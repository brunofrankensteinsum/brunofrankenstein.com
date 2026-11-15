// Glosario: términos técnicos que el sitio explica con una «nota de plano» (tooltip).
//
// - En el texto de los proyectos, la PRIMERA vez que aparece un término se marca sola
//   (lo hace src/scripts/lamina.ts cuando se abre la página).
// - También se marcan las etiquetas que coincidan con un término.
// - "terms" son las formas en que puede aparecer escrito, por idioma.
// - "es" y "en" son la definición: una o dos oraciones cortas.
//
// Para sumar un término, copiar un bloque y completarlo.
// REVISAR: estas definiciones las redactó Claude; Bruno tiene que confirmarlas.

/** @typedef {{ id: string, terms: { es: string[], en: string[] }, es: string, en: string }} Termino */

/** @type {Termino[]} */
export const glossary = [
  {
    id: 'petg',
    terms: { es: ['PETG'], en: ['PETG'] },
    es: 'Plástico para impresión 3D. Aguanta más calor y humedad que el PLA.',
    en: 'A 3D-printing plastic. It handles more heat and moisture than PLA.',
  },
  {
    id: 'pla',
    terms: { es: ['PLA'], en: ['PLA'] },
    es: 'El plástico más común en impresión 3D. Se ablanda cerca de los 60 °C.',
    en: 'The most common 3D-printing plastic. It softens at around 60 °C.',
  },
  {
    id: 'ds18b20',
    terms: { es: ['DS18B20'], en: ['DS18B20'] },
    es: 'Sensor digital de temperatura. Se comunica por un solo cable de datos (1-Wire).',
    en: 'A digital temperature sensor. It talks over a single data wire (1-Wire).',
  },
  {
    id: 'esphome',
    terms: { es: ['ESPHome'], en: ['ESPHome'] },
    es: 'Sistema para programar microcontroladores ESP con un archivo de configuración.',
    en: 'A system for programming ESP microcontrollers from a configuration file.',
  },
  {
    id: 'fuga-termica',
    terms: { es: ['fuga térmica'], en: ['thermal runaway'] },
    es: 'Reacción en cadena dentro de una celda: se calienta sola, cada vez más rápido.',
    en: 'A chain reaction inside a cell: it heats itself up, faster and faster.',
  },
  {
    id: 'formula-sae',
    terms: { es: ['Formula SAE'], en: ['Formula SAE'] },
    es: 'Competencia universitaria: cada equipo diseña, construye y corre un monoplaza.',
    en: 'A university competition: each team designs, builds and races a single-seater.',
  },
  {
    id: '18650',
    terms: { es: ['18650'], en: ['18650'] },
    es: 'Celda cilíndrica de litio de 18 mm de diámetro y 65 mm de largo.',
    en: 'A cylindrical lithium cell, 18 mm in diameter and 65 mm long.',
  },
  // --- Gridfinity Autobin (definiciones redactadas por Claude: Bruno tiene que revisarlas) ---
  {
    id: 'gridfinity',
    terms: { es: ['Gridfinity'], en: ['Gridfinity'] },
    es: 'Sistema abierto de almacenamiento modular: cajillas apilables que encajan en una grilla de 42 mm.',
    en: 'An open modular storage system: stackable bins that snap into a 42 mm grid.',
  },
  {
    id: 'aruco',
    terms: { es: ['ArUco'], en: ['ArUco'] },
    es: 'Cuadrado blanco y negro que una cámara reconoce y ubica con precisión. Cuatro de ellos fijan la escala y el plano de la foto.',
    en: 'A black-and-white square a camera can recognise and locate precisely. Four of them fix the scale and plane of a photo.',
  },
  {
    id: 'paralaje',
    terms: { es: ['paralaje'], en: ['parallax'] },
    es: 'Corrimiento aparente de un objeto según desde dónde se lo mire. En una foto, el borde alto de una pieza parece más grande que su base.',
    en: 'The apparent shift of an object depending on where you look from. In a photo, the top edge of a tall part looks bigger than its base.',
  },
  {
    id: 'homografia',
    terms: { es: ['homografía'], en: ['homography'] },
    es: 'Transformación que convierte una foto en perspectiva en una vista desde arriba, con medidas en milímetros.',
    en: 'A transformation that turns a photo taken at an angle into a top-down view with measurements in millimetres.',
  },
  {
    id: 'stl',
    terms: { es: ['STL'], en: ['STL'] },
    es: 'Formato de archivo con la forma 3D de una pieza como una malla de triángulos. Es lo que lee el laminador antes de imprimir.',
    en: 'A file format that stores the 3D shape of a part as a mesh of triangles. It is what the slicer reads before printing.',
  },
];

const escapar = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Términos del glosario que aparecen en un texto, con su definición en ese idioma.
 * La página del proyecto se los pasa al script para que los marque.
 * @param {'es' | 'en'} lang
 * @param {string} texto
 */
export function terminosEn(lang, texto) {
  return glossary
    .filter((g) => new RegExp(`(^|[^\\p{L}\\p{N}])(${g.terms[lang].map(escapar).join('|')})(?![\\p{L}\\p{N}])`, 'iu').test(texto))
    .map((g) => ({ formas: g.terms[lang], def: g[lang] }));
}

/**
 * Definición de un término exacto (por ejemplo, el texto de una etiqueta), o undefined si no está.
 * @param {'es' | 'en'} lang
 * @param {string} texto
 */
export function definicion(lang, texto) {
  const buscado = texto.trim().toLowerCase();
  const termino = glossary.find((g) => [...g.terms.es, ...g.terms.en].some((t) => t.toLowerCase() === buscado));
  return termino ? termino[lang] : undefined;
}

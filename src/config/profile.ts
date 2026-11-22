// Textos de presentación de Bruno (inicio, sobre mí, contacto) en cada idioma.
// Lo que está entre [CORCHETES] es un marcador: falta el dato real.
import type { Lang } from './site';

export const profile = {
  // Dónde está Bruno, como firma de plano.
  location: { es: 'Montevideo, UY', en: 'Montevideo, UY' },
  coords: { es: '34°54′ S · 56°11′ O', en: '34°54′ S · 56°11′ W' },
  // El correo NO se publica: se contacta por el formulario. El correo que recibe los mensajes
  // es un secreto de Cloudflare (DESTINO), no está en el repositorio. Ver docs/formulario-contacto.md.
  // Dirección a la que el formulario envía los mensajes: la atiende worker/index.js.
  // Recibe un POST con JSON: { nombre, email, motivo, mensaje, idioma, turnstile }.
  // Responde 2xx si salió bien. Vacío = el formulario valida pero avisa que no está conectado.
  formEndpoint: '/api/contacto',
  // Clave PÚBLICA del widget Turnstile (antispam de Cloudflare). Se crea en el panel de Cloudflare
  // → Turnstile. Vacío = sin Turnstile (el formulario sigue protegido por el campo trampa y el tiempo
  // mínimo, pero el servidor no acepta mensajes sin Turnstile: ver docs/formulario-contacto.md).
  turnstileSiteKey: '0x4AAAAAAGCPrh2RzIAuQCVs',
  // CV: dirección de la página de CVuy (ANII). El botón «Ver CV» abre esa página en otra pestaña.
  cv: 'https://exportcvuy.anii.org.uy/cv/?847399f61e6686ee67dc433e446e68a4',

  home: {
    lead: {
      es: 'Estudio Ingeniería Industrial Mecánica en Uruguay. Soy investigador en el Faraday Lab y participo en Fing Hydrogen Racing, el equipo de Formula SAE.',
      en: 'I study Industrial Mechanical Engineering in Uruguay. I am a researcher at the Faraday Lab and take part in Fing Hydrogen Racing, the Formula SAE team.',
    },
    sub: {
      es: 'Aprendo mejor cuando hay un proyecto de por medio. Acá queda el registro: qué hicimos, cómo lo resolvimos y qué aprendí.',
      en: 'I learn best when there is a project involved. This is the record: what we did, how we solved it and what I learned.',
    },
  },

  about: {
    lead: {
      es: 'Soy Bruno. Estudio Ingeniería Industrial Mecánica en Montevideo, investigo baterías en el Faraday Lab y corro con Fing Hydrogen Racing.',
      en: 'I am Bruno. I study Industrial Mechanical Engineering in Montevideo, research batteries at the Faraday Lab and race with Fing Hydrogen Racing.',
    },
    paragraphs: {
      es: [
        'Aprendo mejor cuando hay un proyecto de por medio. Me interesa lo que pasa adentro de una batería cuando algo sale mal: cómo se calienta, cómo se propaga y cómo se evita.',
        'Fuera de la facultad sigo con lo mismo, pero a escala de taller: opero y mantengo mis impresoras 3D, hago domótica con ESPHome y desarmo sistemas y componentes eléctricos para entender cómo funcionan. Si algo se puede medir o automatizar, termino armando una planilla con macros o un script en Python. Ahora estoy aprendiendo a simular vehículos en GT-SUITE para probar estrategias de control de la gestión energética, y a leer lo que dicen los equipos por el bus CAN.',
      ],
      en: [
        'I learn best when there is a project involved. I am interested in what happens inside a battery when something goes wrong: how it heats up, how it spreads and how to prevent it.',
        'Outside university it is the same thing at workshop scale: I run and maintain my 3D printers, do home automation with ESPHome and take electrical systems and components apart to understand how they work. If something can be measured or automated, I end up building a spreadsheet with macros or a Python script. Right now I am learning to simulate vehicles in GT-SUITE to test control strategies for energy management, and to read what devices say over the CAN bus.',
      ],
    },
    now: {
      es: 'Preparando una estancia de investigación en el CMT de la Universitat Politècnica de València, sobre seguridad térmica de baterías.',
      en: 'Preparing a research stay at CMT, Universitat Politècnica de València, on battery thermal safety.',
    },
    // «Lista de materiales»: tres columnas.
    materials: {
      es: [
        { label: 'Investigo', items: 'Electroquímica de baterías · Ensayos de baterías de litio · Seguridad térmica' },
        { label: 'Diseño', items: 'Modelado 3D en Fusion 360 · Proyectos en Inventor · Modelado orientado a impresión 3D' },
        { label: 'Simulo', items: 'Análisis de esfuerzos en Ansys · Vehículos y estrategias de control de gestión energética en GT-SUITE' },
        { label: 'Fabrico', items: 'Impresión 3D: operación y mantenimiento de impresoras · Manejo de herramientas' },
        { label: 'Electrónica', items: 'Protocolo de comunicación CAN · Ingeniería inversa de sistemas y componentes eléctricos · Home Automation · ESPHome' },
        { label: 'Datos y código', items: 'Python · Excel avanzado (macros y fórmulas) · Prompts e IA · Vibe Code' },
      ],
      en: [
        { label: 'I research', items: 'Battery electrochemistry · Lithium battery testing · Thermal safety' },
        { label: 'I design', items: '3D modelling in Fusion 360 · Inventor projects · Modelling for 3D printing' },
        { label: 'I simulate', items: 'Stress analysis in Ansys · Vehicles and energy management control strategies in GT-SUITE' },
        { label: 'I make', items: '3D printing: operating and maintaining printers · Hand and workshop tools' },
        { label: 'Electronics', items: 'CAN communication protocol · Reverse engineering of electrical systems and components · Home Automation · ESPHome' },
        { label: 'Data and code', items: 'Python · Advanced Excel (macros and formulas) · Prompting and AI · Vibe Code' },
      ],
    },
  },
} as const;

export function tr<T>(valor: Record<Lang, T>, lang: Lang): T {
  return valor[lang];
}

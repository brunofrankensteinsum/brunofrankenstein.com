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
        '[UN PÁRRAFO MÁS: qué te mueve fuera de la facultad, qué estás aprendiendo ahora.]',
      ],
      en: [
        'I learn best when there is a project involved. I am interested in what happens inside a battery when something goes wrong: how it heats up, how it spreads and how to prevent it.',
        '[ONE MORE PARAGRAPH: what drives you outside university, what you are learning now.]',
      ],
    },
    now: {
      es: 'Preparando una estancia de investigación en el CMT de la Universitat Politècnica de València, sobre seguridad térmica de baterías.',
      en: 'Preparing a research stay at CMT, Universitat Politècnica de València, on battery thermal safety.',
    },
    // «Lista de materiales»: tres columnas.
    materials: {
      es: [
        { label: 'Investigo', items: 'Electroquímica de baterías · Modelado · Seguridad térmica' },
        { label: 'Construyo', items: 'Impresión 3D · Home Automation · Vibe Code' },
        { label: 'Herramientas', items: 'Fusion 360 · ESPHome · [OTRAS]' },
      ],
      en: [
        { label: 'I research', items: 'Battery electrochemistry · Modelling · Thermal safety' },
        { label: 'I build', items: '3D Printing · Home Automation · Vibe Code' },
        { label: 'Tools', items: 'Fusion 360 · ESPHome · [OTHERS]' },
      ],
    },
  },
} as const;

export function tr<T>(valor: Record<Lang, T>, lang: Lang): T {
  return valor[lang];
}

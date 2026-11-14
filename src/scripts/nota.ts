// Notas de plano (tooltips).
// Cualquier elemento con el atributo data-nota="texto" muestra una nota:
//   - con el mouse quieto encima durante medio segundo,
//   - enseguida al recibir foco con el teclado,
//   - al tocarlo o hacerle clic si es un término de glosario (.glosa).
// Se cierra al salir, con Esc, al hacer scroll o al tocar afuera.
// data-nota-rotulo cambia el rótulo de arriba (por defecto «Nota»).

const DEMORA_ABRIR = 500;
const DEMORA_CERRAR = 100;
const SEPARACION = 14; // largo de la línea guía, en px

let caja: HTMLElement | null = null;
let actual: HTMLElement | null = null;
let relojAbrir = 0;
let relojCerrar = 0;

function crearCaja(): HTMLElement {
  const c = document.createElement('div');
  c.className = 'nota';
  c.id = 'nota';
  c.setAttribute('role', 'tooltip');
  c.hidden = true;
  c.innerHTML =
    '<span class="nota__rotulo"></span><span class="nota__texto"></span><span class="nota__guia" aria-hidden="true"></span>';
  // Si el mouse entra a la caja, no se cierra.
  c.addEventListener('pointerenter', () => clearTimeout(relojCerrar));
  c.addEventListener('pointerleave', programarCierre);
  caja = c;
  return c;
}

export function abrirNota(el: HTMLElement, texto = el.dataset.nota ?? '', rotulo = el.dataset.notaRotulo) {
  if (!texto) return;
  clearTimeout(relojAbrir);
  clearTimeout(relojCerrar);
  const c = caja ?? crearCaja();
  if (actual && actual !== el) actual.removeAttribute('aria-describedby');
  actual = el;

  const ingles = document.documentElement.lang === 'en';
  c.querySelector('.nota__rotulo')!.textContent = rotulo || (ingles ? 'Note' : 'Nota');
  c.querySelector('.nota__texto')!.textContent = texto;

  // Dentro de un <dialog> abierto (el visor de imágenes) la nota tiene que vivir adentro,
  // porque el diálogo tapa todo lo demás.
  const dialogo = el.closest<HTMLElement>('dialog[open]');
  const anfitrion = dialogo ?? document.body;
  if (c.parentElement !== anfitrion) anfitrion.append(c);

  c.hidden = false;
  c.classList.remove('nota--visible');

  // Ubicación: arriba de la palabra; si no entra, abajo. Nunca se sale por los costados.
  const r = el.getBoundingClientRect();
  const ancho = c.offsetWidth;
  const alto = c.offsetHeight;
  const arriba = r.top - alto - SEPARACION >= 72;
  const centro = r.left + r.width / 2;
  const x = Math.max(8, Math.min(centro - ancho / 2, window.innerWidth - ancho - 8));
  const y = arriba ? r.top - alto - SEPARACION : r.bottom + SEPARACION;
  const base = dialogo ? dialogo.getBoundingClientRect() : { left: -window.scrollX, top: -window.scrollY };
  c.classList.toggle('nota--abajo', !arriba);
  c.style.left = `${x - base.left}px`;
  c.style.top = `${y - base.top}px`;
  c.style.setProperty('--guia-x', `${Math.max(6, Math.min(centro - x, ancho - 6))}px`);

  el.setAttribute('aria-describedby', 'nota');
  // Leer una medida obliga al navegador a registrar el estado inicial; recién entonces
  // se agrega la clase, para que la animación de entrada arranque desde ahí.
  void c.offsetWidth;
  c.classList.add('nota--visible');
}

export function cerrarNota() {
  clearTimeout(relojAbrir);
  clearTimeout(relojCerrar);
  if (!caja || !actual) return;
  caja.classList.remove('nota--visible');
  caja.hidden = true;
  actual.removeAttribute('aria-describedby');
  actual = null;
}

function programarCierre() {
  clearTimeout(relojAbrir);
  clearTimeout(relojCerrar);
  relojCerrar = window.setTimeout(cerrarNota, DEMORA_CERRAR);
}

const disparador = (objetivo: EventTarget | null) =>
  objetivo instanceof Element ? objetivo.closest<HTMLElement>('[data-nota]') : null;

// Mouse: abre con medio segundo de espera.
document.addEventListener('pointerover', (e) => {
  if (e.pointerType !== 'mouse') return;
  const el = disparador(e.target);
  if (!el || el === actual) {
    if (el) clearTimeout(relojCerrar);
    return;
  }
  clearTimeout(relojAbrir);
  relojAbrir = window.setTimeout(() => abrirNota(el), DEMORA_ABRIR);
});
document.addEventListener('pointerout', (e) => {
  if (e.pointerType !== 'mouse') return;
  const el = disparador(e.target);
  if (!el || (e.relatedTarget instanceof Node && el.contains(e.relatedTarget))) return;
  programarCierre();
});

// Teclado: abre enseguida al llegar con Tab.
document.addEventListener('focusin', (e) => {
  const el = disparador(e.target);
  if (el && el.matches(':focus-visible')) abrirNota(el);
});
document.addEventListener('focusout', (e) => {
  if (disparador(e.target) === actual) cerrarNota();
});

// Toque o clic: los términos de glosario abren y cierran su nota; tocar afuera cierra.
document.addEventListener('click', (e) => {
  const el = disparador(e.target);
  if (el && el.classList.contains('glosa')) {
    if (el === actual) cerrarNota();
    else abrirNota(el);
    return;
  }
  if (caja && e.target instanceof Node && caja.contains(e.target)) return;
  cerrarNota();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && actual) cerrarNota();
});
// Con capture: true también escucha el scroll de cajas internas.
window.addEventListener('scroll', cerrarNota, { passive: true, capture: true });

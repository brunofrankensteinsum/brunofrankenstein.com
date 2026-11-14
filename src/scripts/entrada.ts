// Movimiento de entrada.
// 1) «Líneas de construcción»: la primera vez que se abre el sitio en una sesión,
//    los marcos visibles se dibujan como un trazo, como lo haría un plotter.
// 2) Revelado: los bloques que están más abajo aparecen al entrar en pantalla.
// Las clases .trazo, .entra y .reveal las pone el script del final de Base.astro,
// antes de que la página se pinte, para que nada «salte».

// --- 2) Revelado al hacer scroll ---
const pendientes = document.querySelectorAll('.reveal');
if (pendientes.length > 0) {
  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        entrada.target.classList.add('reveal--in');
        observador.unobserve(entrada.target);
      }
    },
    // El bloque aparece cuando asoma un 10 % por encima del borde de abajo.
    { rootMargin: '0px 0px -10% 0px' },
  );
  pendientes.forEach((el) => observador.observe(el));
}

// --- 1) Marcos que se dibujan ---
const SVG = 'http://www.w3.org/2000/svg';
const estilos = getComputedStyle(document.documentElement);
// Lee una duración de tokens.css ("700ms") y la pasa a número.
const duracion = (nombre: string) => parseFloat(estilos.getPropertyValue(nombre)) || 0;

function dibujarMarco(el: HTMLElement, orden: number) {
  const cs = getComputedStyle(el);
  // El marco puede ser un outline (separado de la caja) o un borde.
  const conOutline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
  const sep = conOutline ? parseFloat(cs.outlineOffset) + parseFloat(cs.outlineWidth) : 0;
  const r = el.getBoundingClientRect();
  // Si el bloque que lo contiene todavía está entrando (corrido 8 px hacia abajo),
  // se descuenta ese corrimiento para dibujar el marco en su lugar definitivo.
  const bloque = el.closest<HTMLElement>('.entra');
  const corrido = bloque ? new DOMMatrixReadOnly(getComputedStyle(bloque).transform).m42 : 0;
  const ancho = r.width + sep * 2;
  const alto = r.height + sep * 2;
  if (ancho < 2 || alto < 2) {
    el.classList.remove('trazo');
    return;
  }

  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('class', 'trazo-svg');
  svg.setAttribute('width', String(ancho));
  svg.setAttribute('height', String(alto));
  svg.setAttribute('aria-hidden', 'true');
  svg.style.left = `${r.left + window.scrollX - sep}px`;
  svg.style.top = `${r.top - corrido + window.scrollY - sep}px`;

  const rect = document.createElementNS(SVG, 'rect');
  rect.setAttribute('x', '0.5');
  rect.setAttribute('y', '0.5');
  rect.setAttribute('width', String(ancho - 1));
  rect.setAttribute('height', String(alto - 1));
  rect.setAttribute('fill', 'none');
  rect.setAttribute('stroke', estilos.getPropertyValue('--c-line').trim());
  rect.setAttribute('stroke-width', '1');
  // pathLength = 1 permite animar el trazo de 0 a 1 sin calcular el perímetro.
  rect.setAttribute('pathLength', '1');
  rect.setAttribute('stroke-dasharray', '1');
  rect.setAttribute('stroke-dashoffset', '1');
  svg.append(rect);
  document.body.append(svg);

  const dura = duracion('--t-draw');
  const espera = orden * duracion('--stagger');
  const animacion = rect.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
    duration: dura,
    delay: espera,
    easing: estilos.getPropertyValue('--ease-draw').trim() || 'ease-in-out',
    fill: 'forwards',
  });
  // Al terminar, vuelve la línea real del marco y se quita el trazo de arriba.
  const terminar = () => {
    el.classList.remove('trazo');
    svg.remove();
  };
  animacion.finished.then(terminar, terminar);
  // Respaldo: si la pestaña está en segundo plano la animación se frena; el marco vuelve igual.
  window.setTimeout(terminar, dura + espera + 1500);
}

const marcos = [...document.querySelectorAll<HTMLElement>('.trazo')];
if (marcos.length > 0) {
  // Espera a las fuentes (como mucho 400 ms) para medir los marcos en su lugar definitivo.
  const listo = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 400))]);
  listo.then(() => marcos.forEach(dibujarMarco));
}

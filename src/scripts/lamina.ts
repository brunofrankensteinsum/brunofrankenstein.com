// Interacciones de la página de un proyecto (una «lámina»):
//   1) índice lateral que marca la sección visible,
//   2) visor de imágenes a pantalla completa,
//   3) botón «Copiar» en los bloques de código,
//   4) video que se carga recién al hacer clic.

import { copiar } from './portapapeles.ts';

const prosa = document.querySelector<HTMLElement>('.prosa');
const ingles = document.documentElement.lang === 'en';
const aviso = document.querySelector<HTMLElement>('[data-aviso]');
const anunciar = (texto: string) => {
  if (aviso) aviso.textContent = texto;
};

// ---------- 0) Glosario ----------
// La página trae la lista de términos que aparecen en el texto. Acá se busca la primera
// aparición de cada uno y se la convierte en un botón que abre su definición.
const datosGlosario = document.querySelector('#glosario');
if (prosa && datosGlosario) {
  const terminos: { formas: string[]; def: string }[] = JSON.parse(datosGlosario.textContent ?? '[]');
  const escapar = (texto: string) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Textos donde no se marca nada: links, código, títulos y botones.
  const saltar = 'a, code, pre, button, h1, h2, h3, h4';
  const recorrido = document.createTreeWalker(prosa, NodeFilter.SHOW_TEXT, {
    acceptNode: (nodo) => (nodo.parentElement?.closest(saltar) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const textos: Text[] = [];
  while (recorrido.nextNode()) textos.push(recorrido.currentNode as Text);

  for (const termino of terminos) {
    // El término tiene que estar «suelto»: sin letras ni números pegados a los costados.
    const patron = new RegExp(`(^|[^\\p{L}\\p{N}])(${termino.formas.map(escapar).join('|')})(?![\\p{L}\\p{N}])`, 'iu');
    for (let i = 0; i < textos.length; i++) {
      const coincide = patron.exec(textos[i].data);
      if (!coincide) continue;
      // Parte el texto en tres: antes, la palabra y después. La palabra pasa a ser un botón.
      const palabra = textos[i].splitText(coincide.index + coincide[1].length);
      const resto = palabra.splitText(coincide[2].length);
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'glosa';
      boton.dataset.nota = termino.def;
      boton.dataset.notaRotulo = 'Def.';
      palabra.replaceWith(boton);
      boton.append(palabra);
      textos.splice(i + 1, 0, resto);
      break;
    }
  }
}

// ---------- 1) Índice lateral ----------
const links = [...document.querySelectorAll<HTMLAnchorElement>('.toc__lista a')];
const titulos = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))));
if (links.length > 0) {
  const marcar = () => {
    // La sección actual es la última cuyo título ya pasó por arriba de la pantalla.
    let actual = 0;
    titulos.forEach((titulo, i) => {
      if (titulo && titulo.getBoundingClientRect().top <= 140) actual = i;
    });
    links.forEach((a, i) => {
      if (i === actual) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  };
  let agendado = false;
  window.addEventListener(
    'scroll',
    () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(() => {
        agendado = false;
        marcar();
      });
    },
    { passive: true },
  );
  marcar();

  // Al elegir una sección, el foco pasa a su título (para seguir leyendo con el teclado).
  links.forEach((a, i) => {
    a.addEventListener('click', () => {
      const titulo = titulos[i];
      if (!titulo) return;
      titulo.tabIndex = -1;
      titulo.focus({ preventScroll: true });
    });
  });
}

// ---------- 2) Visor de imágenes ----------
const visor = document.querySelector<HTMLDialogElement>('#visor');
const imagenes = prosa ? [...prosa.querySelectorAll<HTMLImageElement>('p > img')] : [];
if (visor && imagenes.length > 0) {
  const grande = visor.querySelector<HTMLImageElement>('[data-visor-img]')!;
  const lienzo = visor.querySelector<HTMLElement>('[data-visor-lienzo]')!;
  const rotuloDet = visor.querySelector<HTMLElement>('[data-visor-det]')!;
  const rotuloEsc = visor.querySelector<HTMLElement>('[data-visor-esc]')!;
  const pie = visor.querySelector<HTMLElement>('[data-visor-pie]')!;
  const anterior = visor.querySelector<HTMLButtonElement>('[data-visor-prev]')!;
  const siguiente = visor.querySelector<HTMLButtonElement>('[data-visor-next]')!;

  let indice = 0;
  let zoom = 1;
  let x = 0;
  let y = 0;

  const aplicar = () => {
    if (zoom <= 1) {
      zoom = 1;
      x = 0;
      y = 0;
    }
    grande.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
    lienzo.classList.toggle('visor__lienzo--zoom', zoom > 1);
    // La escala se lee como en un plano: «ESC 2:1».
    const numero = Number.isInteger(zoom) ? String(zoom) : zoom.toFixed(1);
    rotuloEsc.textContent = `${ingles ? 'SCALE' : 'ESC'} ${numero}:1`;
  };
  // Cambia el zoom dejando quieto el punto (px, py), medido desde el centro del lienzo.
  const zoomEn = (nuevo: number, px = 0, py = 0) => {
    const z = Math.max(1, Math.min(4, nuevo));
    x = px - (px - x) * (z / zoom);
    y = py - (py - y) * (z / zoom);
    zoom = z;
    aplicar();
  };
  const desdeCentro = (e: { clientX: number; clientY: number }) => {
    const r = lienzo.getBoundingClientRect();
    return [e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2] as const;
  };

  const mostrar = (i: number) => {
    indice = (i + imagenes.length) % imagenes.length;
    const img = imagenes[indice];
    grande.src = img.currentSrc || img.src;
    grande.alt = img.alt;
    rotuloDet.textContent = `DET. ${String.fromCharCode(65 + indice)}`;
    pie.textContent = img.parentElement?.querySelector('em')?.textContent ?? '';
    zoom = 1;
    aplicar();
  };

  imagenes.forEach((img, i) => {
    // Las imágenes del texto pasan a ser «botones» para poder abrirlas también con el teclado.
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `${ingles ? 'Enlarge image' : 'Ampliar imagen'}: ${img.alt}`);
    img.classList.add('ampliable');
    const abrir = () => {
      mostrar(i);
      visor.showModal();
    };
    img.addEventListener('click', abrir);
    img.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      abrir();
    });
  });

  if (imagenes.length < 2) {
    anterior.hidden = true;
    siguiente.hidden = true;
  }
  anterior.addEventListener('click', () => mostrar(indice - 1));
  siguiente.addEventListener('click', () => mostrar(indice + 1));
  visor.querySelector('[data-visor-cerrar]')!.addEventListener('click', () => visor.close());
  // Esc cierra solo: lo trae <dialog>, y devuelve el foco a la imagen.
  visor.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mostrar(indice - 1);
    else if (e.key === 'ArrowRight') mostrar(indice + 1);
    else if (e.key === '+' || e.key === '=') zoomEn(zoom + 0.5);
    else if (e.key === '-') zoomEn(zoom - 0.5);
  });
  // Clic en el fondo (fuera de la imagen) cierra.
  lienzo.addEventListener('click', (e) => {
    if (e.target === lienzo && zoom === 1) visor.close();
  });

  // Rueda del mouse: zoom hacia donde apunta el cursor.
  lienzo.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      zoomEn(zoom * Math.exp(-e.deltaY * 0.0015), ...desdeCentro(e));
    },
    { passive: false },
  );
  // Doble clic: alterna entre 1:1 y 2:1.
  lienzo.addEventListener('dblclick', (e) => zoomEn(zoom > 1 ? 1 : 2, ...desdeCentro(e)));

  // Arrastrar para mover la imagen ampliada; dos dedos para hacer zoom (pinch).
  const dedos = new Map<number, { x: number; y: number }>();
  let distancia = 0;
  lienzo.addEventListener('pointerdown', (e) => {
    dedos.set(e.pointerId, { x: e.clientX, y: e.clientY });
    lienzo.setPointerCapture(e.pointerId);
    if (dedos.size === 2) {
      const [a, b] = [...dedos.values()];
      distancia = Math.hypot(a.x - b.x, a.y - b.y);
    }
  });
  lienzo.addEventListener('pointermove', (e) => {
    const previo = dedos.get(e.pointerId);
    if (!previo) return;
    dedos.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (dedos.size === 2) {
      const [a, b] = [...dedos.values()];
      const nueva = Math.hypot(a.x - b.x, a.y - b.y);
      if (distancia > 0) zoomEn(zoom * (nueva / distancia), ...desdeCentro({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 }));
      distancia = nueva;
    } else if (zoom > 1) {
      x += e.clientX - previo.x;
      y += e.clientY - previo.y;
      aplicar();
    }
  });
  const soltar = (e: PointerEvent) => {
    dedos.delete(e.pointerId);
    distancia = 0;
  };
  lienzo.addEventListener('pointerup', soltar);
  lienzo.addEventListener('pointercancel', soltar);
}

// ---------- 3) Copiar código ----------
const molde = document.querySelector<HTMLTemplateElement>('#tpl-copiar');
if (prosa && molde) {
  prosa.querySelectorAll('pre').forEach((pre) => {
    // Envuelve el bloque en una caja para poder ubicar el botón arriba a la derecha.
    const caja = document.createElement('div');
    caja.className = 'codigo';
    pre.replaceWith(caja);
    const boton = (molde.content.cloneNode(true) as DocumentFragment).querySelector('button')!;
    caja.append(pre, boton);

    const texto = boton.querySelector<HTMLElement>('[data-copiar-texto]')!;
    const original = texto.textContent ?? '';
    let reloj = 0;
    boton.addEventListener('click', async () => {
      if (!(await copiar(pre.innerText))) return;
      const hecho = boton.dataset.copiado ?? '';
      texto.textContent = hecho;
      boton.classList.add('copiar--ok');
      anunciar(hecho);
      clearTimeout(reloj);
      // A los 1,5 segundos vuelve a decir «Copiar».
      reloj = window.setTimeout(() => {
        texto.textContent = original;
        boton.classList.remove('copiar--ok');
        anunciar('');
      }, 1500);
    });
  });
}

// ---------- 4) Video ----------
// La fachada es un link a YouTube (sirve sin JavaScript). Con JavaScript, el clic
// carga el reproductor acá mismo: hasta ese momento no se baja nada de YouTube.
document.querySelectorAll<HTMLAnchorElement>('a[data-video]').forEach((fachada) => {
  fachada.addEventListener('click', (e) => {
    e.preventDefault();
    const marco = document.createElement('iframe');
    marco.className = fachada.className;
    marco.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(fachada.dataset.video ?? '')}?autoplay=1`;
    marco.title = fachada.dataset.titulo ?? '';
    marco.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    marco.allowFullscreen = true;
    // Copia el atributo que Astro usa para aplicar los estilos del componente.
    for (const atributo of fachada.attributes) {
      if (atributo.name.startsWith('data-astro-cid')) marco.setAttribute(atributo.name, '');
    }
    fachada.replaceWith(marco);
    marco.focus();
  });
});

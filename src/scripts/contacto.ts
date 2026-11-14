// Formulario de contacto.
//   - Valida cada campo cuando se sale de él (no mientras se escribe).
//   - Al enviar: el botón pasa a «Enviando…»; si sale bien, el formulario se reemplaza
//     por el sello «RECIBIDO · REV. A»; si sale mal, aparece una nota para reintentar.
//   - Anti-spam sin captcha: un campo trampa invisible y un tiempo mínimo de llenado.
//   - Clic en el email: lo copia al portapapeles.
// Los textos vienen del HTML (atributos data-*), así este archivo no sabe de idiomas.
import { abrirNota, cerrarNota } from './nota.ts';
import { copiar } from './portapapeles.ts';

const form = document.querySelector<HTMLFormElement>('[data-form-contacto]');
if (form) {
  const textos = form.dataset;
  const boton = form.querySelector<HTMLButtonElement>('[data-enviar]')!;
  const rotuloBoton = boton.querySelector<HTMLElement>('[data-enviar-texto]')!;
  const notaError = form.querySelector<HTMLElement>('[data-form-error]')!;
  const textoError = notaError.querySelector<HTMLElement>('[data-form-error-texto]')!;
  const campos = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-validar]')];
  // Momento en que se abrió la página: un envío en menos de 3 segundos es un robot.
  const inicio = Date.now();

  // Devuelve el mensaje de error de un campo, o '' si está bien.
  const revisar = (campo: HTMLInputElement | HTMLTextAreaElement): string => {
    const valor = campo.value.trim();
    if (!valor) return textos.errRequired ?? '';
    if (campo.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) return textos.errEmail ?? '';
    if (campo.tagName === 'TEXTAREA' && valor.length < 10) return textos.errShort ?? '';
    return '';
  };
  // Muestra u oculta el error debajo del campo y lo avisa a los lectores de pantalla.
  const validar = (campo: HTMLInputElement | HTMLTextAreaElement): boolean => {
    const mensaje = revisar(campo);
    const error = document.getElementById(`e-${campo.id}`)!;
    error.textContent = mensaje;
    error.hidden = !mensaje;
    if (mensaje) {
      campo.setAttribute('aria-invalid', 'true');
      campo.setAttribute('aria-describedby', error.id);
    } else {
      campo.removeAttribute('aria-invalid');
      campo.removeAttribute('aria-describedby');
    }
    return !mensaje;
  };

  campos.forEach((campo) => {
    campo.addEventListener('blur', () => validar(campo));
    // Si ya estaba marcado con error, se revisa de nuevo mientras se corrige.
    campo.addEventListener('input', () => {
      if (campo.hasAttribute('aria-invalid')) validar(campo);
    });
  });

  const ocupado = (si: boolean) => {
    boton.disabled = si;
    boton.classList.toggle('form__enviar--ocupado', si);
    rotuloBoton.textContent = (si ? textos.sending : textos.send) ?? '';
  };

  const mostrarRecibido = (email: string) => {
    const molde = document.querySelector<HTMLTemplateElement>('#tpl-recibido')!;
    const recibido = (molde.content.cloneNode(true) as DocumentFragment).firstElementChild as HTMLElement;
    recibido.querySelector('[data-recibido-email]')!.textContent = email;
    form.replaceWith(recibido);
    recibido.focus();
  };

  const mostrarError = (mensaje: string) => {
    textoError.textContent = mensaje;
    notaError.hidden = false;
    notaError.focus();
  };

  async function enviar(datos: Record<string, string>): Promise<'ok' | 'fallo' | 'sin-conexion'> {
    const destino = textos.endpoint;
    if (!destino) {
      // Todavía no existe el servicio de envío (pista D). En el servidor local se simula
      // un envío correcto para poder ver el sello; en el sitio publicado se avisa.
      if (import.meta.env.DEV) {
        console.info('[contacto] Envío simulado (solo en desarrollo):', datos);
        await new Promise((r) => setTimeout(r, 1200));
        return 'ok';
      }
      return 'sin-conexion';
    }
    try {
      const respuesta = await fetch(destino, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      return respuesta.ok ? 'ok' : 'fallo';
    } catch {
      return 'fallo';
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    notaError.hidden = true;
    // Valida todo y lleva el foco al primer campo con error.
    const invalidos = campos.filter((campo) => !validar(campo));
    if (invalidos.length > 0) {
      invalidos[0].focus();
      return;
    }
    const datos = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const trampa = datos.sitio;
    delete datos.sitio;
    datos.idioma = document.documentElement.lang;

    // Campo trampa completado: es un robot. Se le muestra el sello y no se envía nada.
    if (trampa) {
      mostrarRecibido(datos.email);
      return;
    }
    if (Date.now() - inicio < 3000) {
      mostrarError(textos.fail ?? '');
      return;
    }

    ocupado(true);
    const resultado = await enviar(datos);
    ocupado(false);
    if (resultado === 'ok') mostrarRecibido(datos.email);
    else mostrarError((resultado === 'sin-conexion' ? textos.failOffline : textos.fail) ?? '');
  });

  // «Reintentar» vuelve a enviar el formulario.
  notaError.querySelector('[data-reintentar]')?.addEventListener('click', () => form.requestSubmit());
}

// ---------- Copiar el email ----------
document.querySelectorAll<HTMLButtonElement>('[data-copiar-email]').forEach((boton) => {
  boton.addEventListener('click', async () => {
    if (!(await copiar(boton.dataset.copiarEmail ?? ''))) return;
    const aviso = document.querySelector<HTMLElement>('[data-aviso]');
    const hecho = boton.dataset.copiado ?? '';
    if (aviso) aviso.textContent = hecho;
    // Muestra una nota «COPIADO» sobre el botón durante un segundo y medio.
    abrirNota(boton, boton.dataset.copiarEmail ?? '', hecho);
    window.setTimeout(() => {
      cerrarNota();
      if (aviso) aviso.textContent = '';
    }, 1500);
  });
});

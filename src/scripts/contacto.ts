// Formulario de contacto.
//   - Valida cada campo cuando se sale de él (no mientras se escribe).
//   - Al enviar: el botón pasa a «Enviando…»; si sale bien, el formulario se reemplaza
//     por el sello «RECIBIDO · REV. A»; si sale mal, aparece una nota para reintentar.
//   - Antispam: un campo trampa invisible, un tiempo mínimo de llenado y Turnstile (Cloudflare).
//     Después el servidor vuelve a revisar todo (worker/contacto.js).
// Los textos vienen del HTML (atributos data-*), así este archivo no sabe de idiomas.

export {}; // marca este archivo como módulo (hace falta para declarar Window abajo)

// Lo mínimo que se usa de la API de Turnstile.
interface Turnstile {
  render(
    contenedor: HTMLElement,
    opciones: {
      sitekey: string;
      appearance: 'interaction-only';
      language: string;
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': (codigo: string) => void;
    },
  ): string;
  reset(id?: string): void;
}
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

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

  // ---------- Turnstile ----------
  // El script de Cloudflare se descarga recién cuando alguien toca el formulario, para no
  // cargar nada ajeno a quien solo mira la página. El widget es invisible casi siempre.
  const clave = textos.turnstileClave ?? '';
  const contenedor = form.querySelector<HTMLElement>('[data-turnstile]');
  let token = '';
  // Último error de Turnstile (por ejemplo 110200 = dominio no permitido): se muestra si falla el envío.
  let errorTurnstile = '';
  let widget: string | undefined;
  let esperandoToken: ((t: string) => void)[] = [];
  let preparado: Promise<void> | undefined;

  const prepararTurnstile = () => {
    if (!clave || !contenedor || import.meta.env.DEV) return Promise.resolve();
    preparado ??= new Promise<void>((listo) => {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.onload = () => {
        widget = window.turnstile?.render(contenedor, {
          sitekey: clave,
          appearance: 'interaction-only',
          language: document.documentElement.lang,
          callback: (t) => {
            token = t;
            esperandoToken.forEach((avisar) => avisar(t));
            esperandoToken = [];
          },
          'expired-callback': () => (token = ''),
          'error-callback': (codigo) => {
            token = '';
            errorTurnstile = codigo;
            console.warn('[contacto] Turnstile falló con el código', codigo);
          },
        });
        listo();
      };
      script.onerror = () => {
        errorTurnstile = 'script-bloqueado';
        listo();
      };
      document.head.append(script);
    });
    return preparado;
  };
  form.addEventListener('focusin', () => void prepararTurnstile(), { once: true });

  // Devuelve el token de Turnstile; si no llega en 15 segundos, devuelve ''.
  const conseguirToken = async (): Promise<string> => {
    if (!clave || import.meta.env.DEV) return '';
    await prepararTurnstile();
    if (token) return token;
    return new Promise<string>((resolver) => {
      esperandoToken.push(resolver);
      window.setTimeout(() => resolver(token), 15000);
    });
  };
  // El token sirve una sola vez: después de cada envío se pide uno nuevo.
  const renovarToken = () => {
    token = '';
    if (widget !== undefined) window.turnstile?.reset(widget);
  };

  // ---------- Validación de campos ----------
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

  // El código (entre paréntesis) dice qué falló: sirve para avisarle a Bruno o a la IA qué arreglar.
  const mostrarError = (mensaje: string, codigo?: string) => {
    textoError.textContent = codigo ? `${mensaje} (${codigo})` : mensaje;
    notaError.hidden = false;
    notaError.focus();
  };

  type Resultado = { estado: 'ok' | 'fallo' | 'sin-conexion'; codigo?: string };
  async function enviar(datos: Record<string, string>): Promise<Resultado> {
    const destino = textos.endpoint;
    // En el servidor local (npm run dev) no existe el Worker: se simula un envío correcto
    // para poder ver el sello. El envío real solo funciona en el sitio publicado.
    if (import.meta.env.DEV) {
      console.info('[contacto] Envío simulado (solo en desarrollo):', datos);
      await new Promise((r) => setTimeout(r, 1200));
      return { estado: 'ok' };
    }
    if (!destino) return { estado: 'sin-conexion' };
    try {
      const respuesta = await fetch(destino, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      if (respuesta.ok) return { estado: 'ok' };
      // El servidor explica qué pasó con un código (ver worker/contacto.js).
      let codigo = String(respuesta.status);
      try {
        const cuerpo = await respuesta.json();
        codigo = [cuerpo.error, cuerpo.detalle].filter(Boolean).join(': ') || codigo;
      } catch {
        // La respuesta no era JSON: queda el número de estado.
      }
      // 503: el servidor todavía no está configurado (faltan secretos en Cloudflare).
      return { estado: respuesta.status === 503 ? 'sin-conexion' : 'fallo', codigo };
    } catch {
      return { estado: 'fallo', codigo: 'sin-red' };
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
    // Turnstile: sin la verificación de Cloudflare el servidor no acepta el mensaje.
    datos.turnstile = await conseguirToken();
    if (clave && !import.meta.env.DEV && !datos.turnstile) {
      ocupado(false);
      mostrarError(textos.fail ?? '', `turnstile: ${errorTurnstile || 'sin-respuesta'}`);
      return;
    }
    const resultado = await enviar(datos);
    renovarToken();
    ocupado(false);
    if (resultado.estado === 'ok') mostrarRecibido(datos.email);
    else mostrarError((resultado.estado === 'sin-conexion' ? textos.failOffline : textos.fail) ?? '', resultado.codigo);
  });

  // «Reintentar» vuelve a enviar el formulario.
  notaError.querySelector('[data-reintentar]')?.addEventListener('click', () => form.requestSubmit());
}

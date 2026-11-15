// Los dos scripts que van escritos dentro del HTML (no en un archivo aparte), porque tienen
// que correr antes de que la página se pinte.
//
// Están acá, como texto, por la política de seguridad de contenido (CSP): el navegador solo
// ejecuta un script en línea si su «huella» figura en la política. astro.config.mjs lee
// estos mismos textos para calcular las huellas, así nunca quedan desparejos.
// Si se cambia algo acá, no hay que tocar nada más.

// 1) Marca que hay JavaScript. El CSS lo usa para cambiar la navegación por el botón de menú.
export const marcarJs = `document.documentElement.classList.add('js');`;

// 2) Prepara el movimiento de entrada antes de que la página se pinte, para que nada «salte».
//    - data-reveal visible al abrir: entra de a uno (solo la primera vez por sesión).
//    - data-reveal más abajo: queda esperando a entrar en pantalla (src/scripts/entrada.ts).
//    - marcos visibles: se van a dibujar como trazo (solo la primera vez por sesión).
//    Con «menos movimiento» activado en el sistema no hace nada.
export const prepararEntrada = `(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var primera = false;
  try {
    primera = !sessionStorage.getItem('bf-visto');
    sessionStorage.setItem('bf-visto', '1');
  } catch (e) {}
  var alto = window.innerHeight;
  var i = 0;
  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    if (el.getBoundingClientRect().top < alto) {
      if (primera) {
        el.style.setProperty('--i', i++);
        el.classList.add('entra');
      }
    } else {
      el.classList.add('reveal');
    }
  });
  if (!primera) return;
  document.querySelectorAll('.marco, .caja, [data-marco]').forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.top < alto && r.bottom > 0) el.classList.add('trazo');
  });
  // Red de seguridad: si algo falla, a los 3 segundos los marcos se ven igual.
  setTimeout(function () {
    document.querySelectorAll('.trazo').forEach(function (el) {
      el.classList.remove('trazo');
    });
  }, 3000);
})();`;

// Copia un texto al portapapeles. Devuelve true si pudo.
// Primero prueba la forma moderna; si el navegador no la permite (por ejemplo, porque
// la página no tiene el foco), usa la forma vieja con un campo de texto temporal.
export async function copiar(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const campo = document.createElement('textarea');
    campo.value = texto;
    campo.setAttribute('readonly', '');
    campo.style.position = 'fixed';
    campo.style.opacity = '0';
    // Dentro de un diálogo abierto, el campo tiene que estar adentro para poder seleccionarse.
    (document.querySelector('dialog[open]') ?? document.body).append(campo);
    campo.select();
    let pudo = false;
    try {
      pudo = document.execCommand('copy');
    } catch {
      pudo = false;
    }
    campo.remove();
    return pudo;
  }
}

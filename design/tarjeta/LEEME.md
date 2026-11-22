# Tarjeta de presentación

Frente y dorso en el estilo «Cianotipo» del sitio: papel azul, retícula, rótulos en mono, el logo BF. Sin fotos.

- **Frente:** nombre, correo, web, ciudad y un QR que lleva al sitio (la dirección se lee de `src/config/site.ts`).
- **Dorso:** una regla de 8 cm arriba, otra de 3 cm a la izquierda y un transportador de 180° con rayas
  de referencia (30°, 45°, 60°, 90°, 120°, 135°, 150°). Todo a escala 1:1; el logo BF hace de eje.
  Cada regla tiene su cero marcado a 5 mm del borde (no en el borde), para que midan bien aunque el corte se corra.

Esta carpeta **no forma parte del sitio**: no se publica ni afecta `npm run build`.

## Qué mandar a la imprenta

`salida/tarjeta-imprenta.pdf`: 2 páginas (frente y dorso), 90 × 50 mm de corte + 3 mm de sangrado por lado,
con las tipografías incluidas. El corte (TrimBox) y el sangrado (BleedBox) están marcados dentro del PDF.

Otros archivos en `salida/`: `vista-previa.png` (las dos caras recortadas), `frente.png` y `dorso.png`
(con sangrado), `frente.svg` y `dorso.svg` (para ver o editar; para imprimir usar el PDF).
Página 1 del PDF = frente (datos y QR); página 2 = dorso (regla y ángulos).

## Cambiar un dato y volver a generar

1. Editar el bloque `DATOS` al principio de `generar.py` (nombre, rol, correo, medidas).
2. Correr, desde la carpeta del proyecto:

```bash
pip install -r design/tarjeta/requirements.txt
python design/tarjeta/generar.py
```

Necesita Edge o Chrome instalado. Si el QR cambia (porque cambia la dirección del sitio), hay que
volver a generar y **volver a probar el QR con el celular** antes de imprimir.

## Pendiente de confirmar antes de imprimir

- **Correo.** `contacto@brunofrankenstein.com` todavía no existe: hay que crearlo como reenvío en Cloudflare
  (Email Routing) y mandarse un mensaje de prueba. El correo personal no va en la tarjeta ni en este proyecto.
- **Rol.** Por ahora no hay línea bajo el nombre. Si se quiere una, completar `rol` en `DATOS` (el sitio dice
  «ingeniero» pero el perfil dice que todavía estudia: confirmar el título antes de ponerlo).
- **Teléfono.** No hay. Si se quiere, completar `telefono` en `DATOS` (reemplaza la fila «BASE»).
- **Tamaño.** 90 × 50 mm es lo habitual en Uruguay; confirmar con la imprenta.
- **Regla.** Está a escala real, pero si la imprenta ajusta o escala el archivo deja de medir bien: pedir
  «impresión al 100 %, sin ajustar a la página», y comprobar con una regla de verdad en la prueba impresa.
- **Colores.** El azul oscuro y el cian se ven distintos en tinta (CMYK) que en pantalla. Pedir una prueba
  impresa del fondo azul de borde a borde antes de imprimir la tirada completa.

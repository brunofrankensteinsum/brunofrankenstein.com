// Retrato de Bruno: se carga desde src/assets/retrato.jpg (también sirve .jpeg, .png o .webp).
// Si el archivo no existe, devuelve `undefined` y las páginas muestran el marcador rayado «[Retrato]».
// Así el sitio compila igual antes y después de que Bruno suba su foto.
import type { ImageMetadata } from 'astro';

const archivos = import.meta.glob<{ default: ImageMetadata }>('/src/assets/retrato.{jpg,jpeg,png,webp}', {
  eager: true,
});

export const retrato: ImageMetadata | undefined = Object.values(archivos)[0]?.default;

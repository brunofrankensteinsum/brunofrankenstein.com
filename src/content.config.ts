// Esquemas de contenido: definen qué campos lleva cada proyecto y cada experiencia.
// Si un archivo Markdown no cumple el esquema, el build falla y avisa qué falta.
// Es el "contrato de contenido" descrito en PLAN.md: no cambiar sin avisar a Bruno.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categoryIds } from './config/site';

const proyectos = defineCollection({
  // Cada proyecto es una carpeta con es.md y/o en.md, más sus imágenes.
  loader: glob({ pattern: '*/{es,en}.md', base: './src/content/proyectos' }),
  schema: ({ image }) =>
    z
      .object({
        // Número de lámina: el «FIG. 03» que se ve en el sitio. Único por proyecto.
        fig: z.number().int().positive(),
        // "publicado": proyecto completo, con su página.
        // "en-preparacion": solo se anuncia como «FIG. 04 · EN PREPARACIÓN»; alcanza con `fig`.
        status: z.enum(['publicado', 'en-preparacion']).default('publicado'),
        title: z.string().optional(),
        summary: z.string().max(160).optional(),
        date: z.coerce.date().optional(),
        updated: z.coerce.date().optional(),
        categories: z.array(z.enum(categoryIds)).default([]),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        // Esquema propio del proyecto (despiece, diagrama), como segunda lámina. Opcional.
        schematic: image().optional(),
        youtube: z.string().optional(),
        repo: z.url().optional(),
        tags: z.array(z.string()).default([]),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
      })
      // Un proyecto publicado necesita todos estos campos; uno en preparación, no.
      .superRefine((data, ctx) => {
        if (data.status !== 'publicado') return;
        const obligatorios = ['title', 'summary', 'date', 'cover', 'coverAlt'] as const;
        for (const campo of obligatorios) {
          if (data[campo] === undefined) {
            ctx.addIssue({ code: 'custom', path: [campo], message: `Falta "${campo}" en un proyecto publicado.` });
          }
        }
        if (data.categories.length === 0) {
          ctx.addIssue({ code: 'custom', path: ['categories'], message: 'Un proyecto publicado lleva al menos una categoría.' });
        }
      }),
});

const experiencias = defineCollection({
  loader: glob({ pattern: '*/{es,en}.md', base: './src/content/experiencias' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Tipo de experiencia: es lo que usa el filtro de la página de Experiencias.
      // "formacion" (estudios, estancias), "trabajo" (cargos, equipos) o "publicacion" (artículos).
      kind: z.enum(['formacion', 'trabajo', 'publicacion']),
      // Descripción breve que se muestra en el cronograma. Opcional.
      summary: z.string().max(160).optional(),
      organization: z.string().optional(),
      role: z.string().optional(),
      // Renglón de contexto bajo el título: institución, ciudad, evento.
      place: z.string().optional(),
      // Si falta `start`, el cronograma muestra [AÑO]. Si falta `end`, sigue hasta hoy.
      start: z.coerce.date().optional(),
      end: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      // Enlace opcional (por ejemplo, a un artículo publicado).
      link: z.url().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { proyectos, experiencias };

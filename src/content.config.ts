// Esquemas de contenido: definen qué campos lleva cada proyecto y cada experiencia.
// Si un archivo Markdown no cumple el esquema, el build falla y avisa qué falta.
// Es el "contrato de contenido" descrito en PLAN.md: no cambiar sin avisar a las demás pistas.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categoryIds } from './config/site';

const proyectos = defineCollection({
  // Cada proyecto es una carpeta con es.md y/o en.md, más sus imágenes.
  loader: glob({ pattern: '*/{es,en}.md', base: './src/content/proyectos' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(160),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      categories: z.array(z.enum(categoryIds)).min(1),
      cover: image(),
      coverAlt: z.string(),
      youtube: z.string().optional(),
      repo: z.string().url().optional(),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

const experiencias = defineCollection({
  loader: glob({ pattern: '*/{es,en}.md', base: './src/content/experiencias' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(160),
      organization: z.string().optional(),
      role: z.string().optional(),
      start: z.coerce.date(),
      end: z.coerce.date().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { proyectos, experiencias };

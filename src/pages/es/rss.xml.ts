// Feed RSS en español. La lógica está en src/lib/rss.ts.
import type { APIRoute } from 'astro';
import { feedRss } from '../../lib/rss';

export const GET: APIRoute = () => feedRss('es');

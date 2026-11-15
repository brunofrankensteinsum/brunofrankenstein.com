// Feed RSS en inglés. La lógica está en src/lib/rss.ts.
import type { APIRoute } from 'astro';
import { feedRss } from '../../lib/rss';

export const GET: APIRoute = () => feedRss('en');

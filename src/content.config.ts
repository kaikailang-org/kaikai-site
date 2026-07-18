import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Book chapters live under src/content/book/{es,en}/<slug>.md and are synced
// from the kaikai-book repo by scripts/sync-book-content.sh. Entry ids look
// like "es/cap01-tour"; the language prefix drives which route renders them.
const book = defineCollection({
  loader: glob({ pattern: '{es,en}/*.md', base: './src/content/book' }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(['es', 'en']),
    slug: z.string(),
    order: z.number(),
    part: z.enum(['chapter', 'appendix']),
  }),
});

export const collections = { book };

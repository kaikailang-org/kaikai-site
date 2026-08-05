import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Book chapters live under src/content/book/{es,en}/<slug>.md and are synced
// from the kaikai-book repo by scripts/sync-book-content.sh. Entry ids look
// like "es/cap01-tour"; the language prefix drives which route renders them.
const book = defineCollection({
  // Include the language dir in the id so same-named files across editions
  // (e.g. es/apA-bootstrap.md and en/apA-bootstrap.md) don't collide.
  loader: glob({
    pattern: '{es,en}/*.md',
    base: './src/content/book',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(['es', 'en']),
    slug: z.string(),
    order: z.number(),
    part: z.enum(['chapter', 'appendix']),
  }),
});

export const collections = { book };

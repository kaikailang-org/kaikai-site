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

// Blog posts are written in Spanish under src/content/blog/es/ and translated
// into src/content/blog/en/ under the same file name, which is what pairs the
// two editions. The language comes from the directory, not the frontmatter.
const blog = defineCollection({
  loader: glob({
    pattern: '{es,en}/*.md',
    base: './src/content/blog',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    // URL segment; defaults to the file name without its date prefix.
    slug: z.string().optional(),
    // Footnote hung from the title, e.g. to say a post is a translation.
    titleNote: z.string().optional(),
    // Drafts render in `astro dev` and are left out of the build.
    draft: z.boolean().default(false),
  }),
});

export const collections = { book, blog };

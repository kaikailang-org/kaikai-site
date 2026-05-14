import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const kaikaiGrammar = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('./src/syntax/kaikai.tmLanguage.json', import.meta.url)),
    'utf-8',
  ),
);

export default defineConfig({
  site: 'https://kaikai-lang.org',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      langs: [{ ...kaikaiGrammar, aliases: ['kai'] }],
    },
  },
});

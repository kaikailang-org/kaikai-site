import { defineConfig } from 'astro/config';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const kaikaiGrammar = require('./src/syntax/kaikai.tmLanguage.json');

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

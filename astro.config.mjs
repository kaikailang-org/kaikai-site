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
  // In development the playground page talks to a local playground server.
  vite: {
    server: {
      proxy: { '/api': 'http://127.0.0.1:8090' },
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      langs: [{ ...kaikaiGrammar, aliases: ['kai'] }],
    },
  },
});

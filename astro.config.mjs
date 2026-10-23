import { defineConfig } from 'astro/config';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const kaikaiGrammar = require('./src/syntax/kaikai.tmLanguage.json');

export default defineConfig({
  site: 'https://kaikai-lang.org',
  // The WebAssembly demos had a page of their own before joining the examples.
  redirects: {
    '/web': '/examples#web',
    '/en/web': '/en/examples#web',
  },
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

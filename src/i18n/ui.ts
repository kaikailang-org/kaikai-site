export const languages = {
  es: 'Español',
  en: 'English',
} as const;

export const defaultLang = 'es';

export type Lang = keyof typeof languages;

export const ui = {
  es: {
    'nav.start': 'Empezar',
    'nav.examples': 'Ejemplos',
    'nav.name': 'El nombre',
    'nav.book': 'El libro',
    'nav.ecosystem': 'Ecosistema',
    'nav.community': 'Comunidad',

    'book.contents': 'Contenidos',
    'book.chapters': 'Capítulos',
    'book.appendices': 'Apéndices',
    'book.readOnline': 'Leer online',
    'book.startReading': 'Empezar a leer',
    'book.prev': 'Anterior',
    'book.next': 'Siguiente',
    'book.backToIndex': 'Volver al índice',

    'hero.tagline.line1':
      'Lenguaje funcional con efectos algebraicos y fibras aisladas. Sin recolector de basura, sin borrow checker.',
    'hero.tagline.line2':
      'Diseñado para que humanos y agentes lo escriban juntos.',
    'hero.cta.install': 'Instalar',
    'hero.cta.start': 'Empezar',
    'hero.cta.book': 'Leer el libro',
    'hero.whyName': '¿por qué este nombre?', // intencionalmente minúscula: enlace pequeño

    'features.title': 'Por qué kaikai',
    'features.effects.title': 'Efectos algebraicos',
    'features.effects.body':
      'Efectos visibles en el tipo, handlers compositivos. Sin async/await que se propaga por toda la pila de llamadas.',
    'features.pipelines.title': 'Familia de pipes',
    'features.pipelines.body':
      'Cuatro operadores, cuatro intenciones: |> aplica, | mapea, || aplana, |? filtra. Cada forma dice qué hace antes de leer la función.',
    'features.memory.title': 'Sin GC, sin borrow checker',
    'features.memory.body':
      'Perceus reference counting + fibras aisladas. La memoria es por-fibra; no hay pausas globales.',
    'features.units.title': 'Kinds: unidades, monedas, regiones',
    'features.units.body':
      'Real<m/s> para medidas, monedas que no se mezclan, arenas con region { }. Información en el tipo, costo cero en runtime.',
    'features.contracts.title': 'Contratos y refinements',
    'features.contracts.body':
      'requires, ensures, Int where >= 0. Lo que hace SPARK, sin SMT solver.',
    'features.agents.title': 'Diálogo con el compilador',
    'features.agents.body':
      'Holes (?), --holes-json, diagnósticos JSON. Diseñado para que humanos y agentes escriban juntos.',

    'examples.title': 'Ejemplos',
    'examples.intro':
      'Seis programas que muestran la forma del lenguaje. Todos se ejecutan con kai run.',
    'examples.tab.hello': 'Hola',
    'examples.tab.fizzbuzz': 'FizzBuzz',
    'examples.tab.effect': 'Efecto',
    'examples.tab.pipes': 'Pipes',
    'examples.tab.uom': 'Unidades',
    'examples.tab.contracts': 'Contratos',

    'footer.tagline': 'Lenguaje de programación.',
    'footer.copy': 'Por Eduardo Díaz.',
  },
  en: {
    'nav.start': 'Get started',
    'nav.examples': 'Examples',
    'nav.name': 'The name',
    'nav.book': 'The book',
    'nav.ecosystem': 'Ecosystem',
    'nav.community': 'Community',

    'book.contents': 'Contents',
    'book.chapters': 'Chapters',
    'book.appendices': 'Appendices',
    'book.readOnline': 'Read online',
    'book.startReading': 'Start reading',
    'book.prev': 'Previous',
    'book.next': 'Next',
    'book.backToIndex': 'Back to contents',

    'hero.tagline.line1':
      'A functional language with algebraic effects and isolated fibers. No garbage collector, no borrow checker.',
    'hero.tagline.line2':
      'Designed to be written with — and by — agents.',
    'hero.cta.install': 'Install',
    'hero.cta.start': 'Get started',
    'hero.cta.book': 'Read the book',
    'hero.whyName': 'why this name?',

    'features.title': 'Why kaikai',
    'features.effects.title': 'Algebraic effects',
    'features.effects.body':
      'Effects visible in the type, composable handlers. No async/await infecting the whole call stack.',
    'features.pipelines.title': 'Pipe family',
    'features.pipelines.body':
      'Four operators, four intents: |> applies, | maps, || flat-maps, |? filters. Each form tells you what it does before you read the function.',
    'features.memory.title': 'No GC, no borrow checker',
    'features.memory.body':
      'Perceus reference counting + isolated fibers. Memory is per-fiber; no global pauses.',
    'features.units.title': 'Kinds: units, currencies, regions',
    'features.units.body':
      'Real<m/s> for measures, currencies that never mix, arenas via region { }. Information in the type, zero runtime cost.',
    'features.contracts.title': 'Contracts & refinements',
    'features.contracts.body':
      'requires, ensures, Int where >= 0. What SPARK does, without an SMT solver.',
    'features.agents.title': 'Dialogue with the compiler',
    'features.agents.body':
      'Holes (?), --holes-json, structured diagnostics. Designed for humans and agents to write together.',

    'examples.title': 'Examples',
    'examples.intro':
      'Six programs that show the shape of the language. All run with kai run.',
    'examples.tab.hello': 'Hello',
    'examples.tab.fizzbuzz': 'FizzBuzz',
    'examples.tab.effect': 'Effect',
    'examples.tab.pipes': 'Pipes',
    'examples.tab.uom': 'Units',
    'examples.tab.contracts': 'Contracts',

    'footer.tagline': 'Programming language.',
    'footer.copy': 'By Eduardo Díaz.',
  },
} as const;

export function t(lang: Lang) {
  return (key: keyof typeof ui['es']) => ui[lang][key] ?? ui[defaultLang][key];
}

export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  if (seg === 'en') return 'en';
  return 'es';
}

export function pathInLang(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === 'es') return clean === '/' ? '/' : clean;
  return clean === '/' ? '/en/' : `/en${clean}`;
}

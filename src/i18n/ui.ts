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
      'Siete programas que muestran la forma del lenguaje. Todos se ejecutan con kai run.',
    'examples.tab.hello': 'Hola',
    'examples.tab.fizzbuzz': 'FizzBuzz',
    'examples.tab.effect': 'Efecto',
    'examples.tab.pipes': 'Pipes',
    'examples.tab.uom': 'Unidades',
    'examples.tab.kinds': 'Kinds',
    'examples.tab.contracts': 'Contratos',

    'examples.page.title': 'Ejemplos',
    'examples.page.lead':
      'Los programas del quickstart, en orden de lectura. Cada uno cabe en una pantalla y muestra una idea del lenguaje.',
    'examples.page.note':
      'Todos se ejecutan tal cual con kai run. La salida que documenta cada cabecera es la que produce el programa en kaikai 0.110.',
    'examples.page.index': 'Índice de ejemplos',

    'examples.item.hello.title': 'Hola, mundo',
    'examples.item.hello.desc':
      'El punto de entrada y el efecto de salida estándar, con handler por defecto.',
    'examples.item.fizzbuzz.title': 'FizzBuzz',
    'examples.item.fizzbuzz.desc':
      'Tipos suma, guardas en el match y un pipeline sobre un literal de rango.',
    'examples.item.calculator.title': 'Calculadora',
    'examples.item.calculator.desc':
      'Un tipo suma recursivo como AST, recorrido con calce de patrones.',
    'examples.item.effect.title': 'Efectos',
    'examples.item.effect.desc':
      'Un efecto propio: la función declara qué usa, quien la llama decide cómo se cumple.',
    'examples.item.concurrent.title': 'Concurrencia',
    'examples.item.concurrent.desc':
      'Dos fibras cooperativas que ceden el control en puntos explícitos.',
    'examples.item.pipes.title': 'Pipes',
    'examples.item.pipes.desc':
      'Cuatro operadores para cuatro intenciones: aplicar, mapear, aplanar y filtrar.',
    'examples.item.uom.title': 'Unidades de medida',
    'examples.item.uom.desc':
      'Las unidades viven en el tipo, así que el compilador no deja mezclar monedas.',
    'examples.item.kinds.title': 'Kinds',
    'examples.item.kinds.desc':
      'Por qué las unidades no son un caso especial, y cómo declarar un kind propio.',
    'examples.item.contracts.title': 'Contratos',
    'examples.item.contracts.desc':
      'Precondiciones y postcondiciones que viven en la firma de la función.',

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
      'Seven programs that show the shape of the language. All run with kai run.',
    'examples.tab.hello': 'Hello',
    'examples.tab.fizzbuzz': 'FizzBuzz',
    'examples.tab.effect': 'Effect',
    'examples.tab.pipes': 'Pipes',
    'examples.tab.uom': 'Units',
    'examples.tab.kinds': 'Kinds',
    'examples.tab.contracts': 'Contracts',

    'examples.page.title': 'Examples',
    'examples.page.lead':
      'The quickstart programs, in reading order. Each fits on a screen and shows one idea from the language.',
    'examples.page.note':
      'They all run as-is with kai run. The output each header documents is what the program prints on kaikai 0.110.',
    'examples.page.index': 'Example index',

    'examples.item.hello.title': 'Hello, world',
    'examples.item.hello.desc':
      'The entry point and the default-handled stdout effect.',
    'examples.item.fizzbuzz.title': 'FizzBuzz',
    'examples.item.fizzbuzz.desc':
      'Sum types, match guards, and a pipeline over a range literal.',
    'examples.item.calculator.title': 'Calculator',
    'examples.item.calculator.desc':
      'A recursive sum type as an AST, walked by pattern matching.',
    'examples.item.effect.title': 'Effects',
    'examples.item.effect.desc':
      'A custom effect: the function declares what it uses, the caller decides how it is met.',
    'examples.item.concurrent.title': 'Concurrency',
    'examples.item.concurrent.desc':
      'Two cooperative fibers yielding control at explicit points.',
    'examples.item.pipes.title': 'Pipes',
    'examples.item.pipes.desc':
      'Four operators for four intents: apply, map, flat-map and filter.',
    'examples.item.uom.title': 'Units of measure',
    'examples.item.uom.desc':
      'Units live in the type, so the compiler will not let you mix currencies.',
    'examples.item.kinds.title': 'Kinds',
    'examples.item.kinds.desc':
      'Why units are not a special case, and how to declare a kind of your own.',
    'examples.item.contracts.title': 'Contracts',
    'examples.item.contracts.desc':
      'Preconditions and postconditions that live in the function signature.',

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

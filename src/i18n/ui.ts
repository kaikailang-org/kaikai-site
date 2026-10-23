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
    'nav.blog': 'Blog',
    'nav.playground': 'Playground',

    'play.title': 'Playground',
    'play.lead':
      'Escribe kaikai y ejecútalo aquí mismo. El programa se compila y corre en nuestro servidor, sin acceso a la red.',
    'play.examples': 'Ejemplos',
    'play.run': 'Ejecutar',
    'play.format': 'Formatear',
    'play.share': 'Compartir',
    'play.shared': 'Enlace copiado',
    'play.output': 'Salida',
    'play.hint': 'Presiona Ejecutar (o Ctrl+Enter) para compilar y correr este programa. Después cámbialo y vuelve a ejecutarlo.',
    'play.running': 'Compilando y ejecutando…',
    'play.formatting': 'Formateando…',
    'play.noOutput': 'El programa terminó sin imprimir nada.',
    'play.honuError': 'El compilador tiene algo que decirte.',
    'play.honuErrorAt': 'Revisa la línea {n}. El compilador no inventa.',
    'play.honuTimeout': 'Se acabó el tiempo. ¿Un bucle sin salida?',
    'play.honuFirst': 'Compiló. Ahora cámbialo.',
    'play.exit': 'El programa terminó con código',
    'play.timeout': 'El programa superó el tiempo máximo y fue detenido.',
    'play.outputLimit': 'La salida superó el límite y fue cortada.',
    'play.killed': 'El sistema detuvo el programa. ¿Usó demasiada memoria?',
    'play.buildTimeout': 'La compilación tardó demasiado y fue detenida.',
    'play.internal': 'El playground falló por dentro. Intenta de nuevo.',
    'play.tooFast': 'Vas muy rápido. Espera unos segundos y vuelve a intentar.',
    'play.busy': 'El playground está ocupado. Intenta de nuevo en unos segundos.',
    'play.tooLarge': 'El programa es demasiado grande para el playground.',
    'play.offline': 'No se pudo contactar al servidor.',
    'play.limits':
      'Cada programa tiene 5 segundos para correr y 64 KB de salida. Los resultados se guardan en caché, así que un programa repetido responde igual.',

    'blog.lead':
      'Novedades, decisiones de diseño y la historia de cómo se construye kaikai.',
    'blog.empty': 'Todavía no hay publicaciones. Vuelve pronto.',
    'blog.back': 'Volver al blog',
    'blog.draft': 'Borrador',
    'blog.note': 'Nota al pie',
    'blog.noteBack': 'Volver al título',
    'blog.feedTitle': 'Blog de kaikai',
    'blog.feed': 'Seguir por RSS',
    'blog.share': 'Compartir',
    'blog.copyLink': 'Copiar enlace',
    'blog.copied': 'Enlace copiado',
    'blog.shareMore': 'Más opciones',

    'theme.toggle': 'Cambiar entre claro y oscuro',

    'book.contents': 'Contenidos',
    'book.chapters': 'Capítulos',
    'book.appendices': 'Apéndices',
    'book.readOnline': 'Leer en línea',
    'book.startReading': 'Empezar a leer',
    'book.prev': 'Anterior',
    'book.next': 'Siguiente',
    'book.backToIndex': 'Volver al índice',
    'book.onThisPage': 'En este capítulo',

    'hero.pill': 'Mira cómo trabaja un agente con kaikai',
    'hero.title.line1': 'Diseñado para que humanos y agentes',
    'hero.title.line2': 'lo escriban juntos.',
    'hero.lead':
      'Lenguaje funcional con efectos algebraicos y fibras aisladas. Sin recolector de basura ni verificador de préstamos.',
    'hero.cta.install': 'Instalar',
    'hero.cta.start': 'Empezar',
    'hero.cta.examples': 'Ver ejemplos',
    'hero.cta.book': 'Leer el libro',
    'hero.whyName': '¿por qué este nombre?', // intencionalmente minúscula: enlace pequeño

    'install.copy': 'Copiar',
    'install.copied': 'Copiado',

    'features.title': 'Por qué kaikai',
    'features.intro':
      'Seis ideas que definen el lenguaje, cada una con el código que la muestra.',
    'features.effects.title': 'Efectos algebraicos',
    'features.effects.body':
      'Lo que una función hace queda escrito en su tipo, y tú decides cómo se resuelve con un manejador. Adiós al async/await que contagia toda la cadena de llamadas.',
    'features.pipelines.title': 'Familia de tuberías',
    'features.pipelines.body':
      'Cuatro operadores, cuatro intenciones: |> aplica, | transforma, || aplana y |? filtra. Sabes qué hace cada paso antes de leer la función.',
    'features.memory.title': 'Memoria sin recolector de basura',
    'features.memory.body':
      'Conteo de referencias Perceus y fibras aisladas. Cada fibra cuida su propia memoria, así que no hay pausas globales ni un verificador de préstamos al que convencer.',
    'features.units.title': 'Unidades, monedas y regiones',
    'features.units.body':
      'Real<m/s> para medidas, monedas que no se mezclan y regiones de memoria con region { }. La información va en el tipo y no cuesta nada al ejecutar.',
    'features.contracts.title': 'Contratos y refinamientos',
    'features.contracts.body':
      'requires, ensures e Int where >= 0. Lo que la función exige y lo que promete se escribe junto a ella, al estilo de SPARK y sin un demostrador SMT.',
    'features.agents.title': 'Diálogo con el compilador',
    'features.agents.body':
      'Deja un hueco con ? y el compilador te cuenta qué tipo espera ahí, también en JSON. Pensado para que personas y agentes escriban juntos.',

    'examples.title': 'Ejemplos',
    'examples.intro':
      'Siete programas que muestran la forma del lenguaje. Todos se ejecutan con kai run.',
    'examples.tab.hello': 'Hola',
    'examples.tab.fizzbuzz': 'FizzBuzz',
    'examples.tab.effect': 'Efecto',
    'examples.tab.pipes': 'Tuberías',
    'examples.tab.uom': 'Unidades',
    'examples.tab.kinds': 'Kinds',
    'examples.tab.contracts': 'Contratos',

    'examples.page.title': 'Ejemplos',
    'examples.page.lead':
      'Nueve programas cortos para conocer el lenguaje paso a paso. Cada uno cabe en una pantalla y te muestra una sola idea.',
    'examples.page.note':
      'Puedes ejecutarlos tal cual con kai run. La salida que ves junto a cada uno es la que produce kaikai 0.173.',
    'examples.page.eyebrow': 'Inicio rápido',
    'examples.page.index': 'Índice de ejemplos',
    'examples.page.output': 'Salida',
    'examples.page.try': 'Probar en el playground',
    'examples.page.web': 'Al final hay tres más, compilados a WebAssembly, que corren aquí mismo, en tu navegador.',
    'examples.page.web.link': 'Ir a ellos',

    'web.eyebrow': 'WebAssembly',
    'web.title': 'kaikai en el navegador',
    'web.lead':
      'Estos tres programas están escritos en kaikai y compilados a WebAssembly con kai build --target=wasm32-browser. No corren en un servidor: corren aquí, en tu navegador.',
    'web.note':
      'Los tres esperan eventos o el reloj sin bloquear la página, y para eso necesitan JavaScript Promise Integration: Chrome o Edge 137, Firefox 153 o Safari 27, o una versión posterior.',
    'web.live': 'En vivo',
    'web.more': 'El apéndice G del libro cuenta los dos destinos de WebAssembly, qué corre en cada uno y por qué el compilador lo sabe antes de generar nada:',
    'web.more.link': 'WebAssembly',
    'web.item.counter.title': 'Un contador sin callbacks',
    'web.item.counter.desc':
      'Un clic no llama a ninguna función tuya. Dom.next_event espera el siguiente evento como si leyeras una línea de la entrada, y el estado del contador es el argumento de una función recursiva.',
    'web.item.counter.hint': 'Haz clic en el botón',
    'web.item.race.title': 'Honu contra la liebre',
    'web.item.race.desc':
      'Dos actores corren en fibras separadas y le mandan sus pasos a un juez. El juez es el único que toca la página, porque una fibra no hereda los handlers de quien la lanza. La liebre es más rápida, pero se duerme.',
    'web.item.race.hint': 'Presiona ▶ para largar',
    'web.item.life.title': 'El Juego de la Vida',
    'web.item.life.desc':
      'El tablero es un Vec[Bool] inmutable: cada generación es un vector nuevo, calculado con una tubería sobre un rango. Se dibuja en un canvas con el efecto Dom.',
    'web.item.life.hint': 'Clic para sembrar otro tablero',

    'featured.title': 'Míralo correr',
    'featured.intro':
      'Un programa completo con su salida. Toma los números del 1 al 4 y encadena las cuatro tuberías para sumar los cuadrados pares.',
    'featured.seeAll': 'Ver los doce ejemplos',

    'examples.item.hello.title': 'Hola, mundo',
    'examples.item.hello.desc':
      'Tu primer programa: una función main y una línea que saluda. No hay nada que importar.',
    'examples.item.fizzbuzz.title': 'FizzBuzz',
    'examples.item.fizzbuzz.desc':
      'El clásico, resuelto sin bucles: un tipo suma clasifica cada número y una cadena de operadores hace el recorrido.',
    'examples.item.calculator.title': 'Calculadora',
    'examples.item.calculator.desc':
      'Una expresión aritmética es un árbol. Aquí lo defines con un tipo suma y lo recorres calzando patrones.',
    'examples.item.effect.title': 'Efectos',
    'examples.item.effect.desc':
      'Defines tu propio efecto. La función dice qué necesita y quien la llama decide cómo se resuelve.',
    'examples.item.concurrent.title': 'Concurrencia',
    'examples.item.concurrent.desc':
      'Dos fibras que se turnan: cada una avanza un paso y le cede el control a la otra.',
    'examples.item.pipes.title': 'Tuberías',
    'examples.item.pipes.desc':
      'Cuatro operadores para encadenar pasos: aplicar, transformar, aplanar y filtrar. Se lee de arriba hacia abajo, como una receta.',
    'examples.item.uom.title': 'Unidades de medida',
    'examples.item.uom.desc':
      'Las unidades van en el tipo, así que el compilador no te deja sumar dólares con euros por descuido.',
    'examples.item.kinds.title': 'Kinds',
    'examples.item.kinds.desc':
      'Las unidades no son un caso especial del lenguaje. Aquí ves por qué, y cómo declarar un kind propio.',
    'examples.item.contracts.title': 'Contratos',
    'examples.item.contracts.desc':
      'Lo que la función exige y lo que promete, escrito en su propia firma.',

    'cta.title': '¿Lo probamos?',
    'cta.body':
      'Se instala con un solo comando en macOS, Linux y Windows (con WSL2), sin dependencias. Y el libro te acompaña desde el primer programa hasta un caso de estudio completo.',

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
    'nav.blog': 'Blog',
    'nav.playground': 'Playground',

    'play.title': 'Playground',
    'play.lead':
      'Write kaikai and run it right here. The program is compiled and run on our server, with no network access.',
    'play.examples': 'Examples',
    'play.run': 'Run',
    'play.format': 'Format',
    'play.share': 'Share',
    'play.shared': 'Link copied',
    'play.output': 'Output',
    'play.hint': 'Press Run (or Ctrl+Enter) to compile and run this program. Then change it and run it again.',
    'play.running': 'Compiling and running…',
    'play.formatting': 'Formatting…',
    'play.noOutput': 'The program finished without printing anything.',
    'play.honuError': 'The compiler has something to tell you.',
    'play.honuErrorAt': "Check line {n}. The compiler doesn't make things up.",
    'play.honuTimeout': "Time's up. A loop with no way out?",
    'play.honuFirst': 'It compiled. Now change it.',
    'play.exit': 'The program exited with code',
    'play.timeout': 'The program ran past the time limit and was stopped.',
    'play.outputLimit': 'The output went past the limit and was cut off.',
    'play.killed': 'The system stopped the program. Did it use too much memory?',
    'play.buildTimeout': 'The build took too long and was stopped.',
    'play.internal': 'The playground failed on its side. Try again.',
    'play.tooFast': 'Too fast. Wait a few seconds and try again.',
    'play.busy': 'The playground is busy. Try again in a few seconds.',
    'play.tooLarge': 'The program is too large for the playground.',
    'play.offline': 'Could not reach the server.',
    'play.limits':
      'Each program gets 5 seconds to run and 64 KB of output. Results are cached, so a repeated program answers the same.',

    'blog.lead':
      'News, design decisions and the story of how kaikai gets built.',
    'blog.empty': 'No posts yet. Check back soon.',
    'blog.back': 'Back to the blog',
    'blog.draft': 'Draft',
    'blog.note': 'Footnote',
    'blog.noteBack': 'Back to the title',
    'blog.feedTitle': 'kaikai blog',
    'blog.feed': 'Follow via RSS',
    'blog.share': 'Share',
    'blog.copyLink': 'Copy link',
    'blog.copied': 'Link copied',
    'blog.shareMore': 'More options',

    'theme.toggle': 'Toggle light and dark',

    'book.contents': 'Contents',
    'book.chapters': 'Chapters',
    'book.appendices': 'Appendices',
    'book.readOnline': 'Read online',
    'book.startReading': 'Start reading',
    'book.prev': 'Previous',
    'book.next': 'Next',
    'book.backToIndex': 'Back to contents',
    'book.onThisPage': 'In this chapter',

    'hero.pill': 'See how an agent works with kaikai',
    'hero.title.line1': 'Designed to be written with,',
    'hero.title.line2': 'and by, agents.',
    'hero.lead':
      'A functional language with algebraic effects and isolated fibers. No garbage collector, no borrow checker.',
    'hero.cta.install': 'Install',
    'hero.cta.start': 'Get started',
    'hero.cta.examples': 'See examples',
    'hero.cta.book': 'Read the book',
    'hero.whyName': 'why this name?',

    'install.copy': 'Copy',
    'install.copied': 'Copied',

    'features.title': 'Why kaikai',
    'features.intro':
      'Six ideas that define the language, each with the code that shows it.',
    'features.effects.title': 'Algebraic effects',
    'features.effects.body':
      'What a function does is written in its type, and you decide how it is resolved with a handler. No more async/await spreading through the whole call stack.',
    'features.pipelines.title': 'Pipe family',
    'features.pipelines.body':
      'Four operators, four intents: |> applies, | maps, || flat-maps and |? filters. You know what each step does before you read the function.',
    'features.memory.title': 'No GC, no borrow checker',
    'features.memory.body':
      'Perceus reference counting and isolated fibers. Each fiber looks after its own memory, so there are no global pauses and no borrow checker to argue with.',
    'features.units.title': 'Kinds: units, currencies, regions',
    'features.units.body':
      'Real<m/s> for measures, currencies that never mix, and memory regions with region { }. The information lives in the type and costs nothing at run time.',
    'features.contracts.title': 'Contracts & refinements',
    'features.contracts.body':
      'requires, ensures and Int where >= 0. What a function demands and what it promises sit right next to it, in the spirit of SPARK and without an SMT solver.',
    'features.agents.title': 'Dialogue with the compiler',
    'features.agents.body':
      'Leave a hole with ? and the compiler tells you what type it expects there, in JSON too. Designed for people and agents to write together.',

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
      'Nine short programs to get to know the language one step at a time. Each fits on a screen and shows you a single idea.',
    'examples.page.note':
      'You can run them as they are with kai run. The output next to each one is what kaikai 0.173 prints.',
    'examples.page.eyebrow': 'Quickstart',
    'examples.page.index': 'Example index',
    'examples.page.output': 'Output',
    'examples.page.try': 'Try it in the playground',
    'examples.page.web': 'At the end there are three more, compiled to WebAssembly, that run right here in your browser.',
    'examples.page.web.link': 'Jump to them',

    'web.eyebrow': 'WebAssembly',
    'web.title': 'kaikai in the browser',
    'web.lead':
      'These three programs are written in kaikai and compiled to WebAssembly with kai build --target=wasm32-browser. They don’t run on a server: they run right here, in your browser.',
    'web.note':
      'All three wait on events or the clock without blocking the page, which takes JavaScript Promise Integration: Chrome or Edge 137, Firefox 153 or Safari 27, or later.',
    'web.live': 'Live',
    'web.more': 'Appendix G of the book covers both WebAssembly targets, what runs on each, and how the compiler knows before it generates anything:',
    'web.more.link': 'WebAssembly',
    'web.item.counter.title': 'A counter without callbacks',
    'web.item.counter.desc':
      'A click doesn’t call any function of yours. Dom.next_event waits for the next event the way you’d read a line of input, and the counter’s state is the argument of a recursive function.',
    'web.item.counter.hint': 'Click the button',
    'web.item.race.title': 'Honu and the hare',
    'web.item.race.desc':
      'Two actors run on separate fibers and report their steps to a judge. The judge is the only one that touches the page, because a fiber doesn’t inherit the handlers of whoever spawned it. The hare is faster, but it falls asleep.',
    'web.item.race.hint': 'Press ▶ to start',
    'web.item.life.title': 'The Game of Life',
    'web.item.life.desc':
      'The board is an immutable Vec[Bool]: each generation is a new vector, computed with a pipe over a range. It’s drawn on a canvas through the Dom effect.',
    'web.item.life.hint': 'Click to seed a new board',

    'featured.title': 'See it run',
    'featured.intro':
      'A whole program and what it prints. It takes the numbers 1 to 4 and chains all four pipes to sum the even squares.',
    'featured.seeAll': 'See all twelve examples',

    'examples.item.hello.title': 'Hello, world',
    'examples.item.hello.desc':
      'Your first program: a main function and one line that says hello. Nothing to import.',
    'examples.item.fizzbuzz.title': 'FizzBuzz',
    'examples.item.fizzbuzz.desc':
      'The classic, solved without loops: a sum type classifies each number and a chain of operators does the walking.',
    'examples.item.calculator.title': 'Calculator',
    'examples.item.calculator.desc':
      'An arithmetic expression is a tree. Here you define it with a sum type and walk it by pattern matching.',
    'examples.item.effect.title': 'Effects',
    'examples.item.effect.desc':
      'You define your own effect. The function says what it needs and the caller decides how it is resolved.',
    'examples.item.concurrent.title': 'Concurrency',
    'examples.item.concurrent.desc':
      'Two fibers taking turns: each one moves a step forward and hands control to the other.',
    'examples.item.pipes.title': 'Pipes',
    'examples.item.pipes.desc':
      'Four operators for chaining steps: apply, map, flat-map and filter. It reads top to bottom, like a recipe.',
    'examples.item.uom.title': 'Units of measure',
    'examples.item.uom.desc':
      'Units live in the type, so the compiler will not let you add dollars to euros by accident.',
    'examples.item.kinds.title': 'Kinds',
    'examples.item.kinds.desc':
      'Units are not a special case in the language. Here you see why, and how to declare a kind of your own.',
    'examples.item.contracts.title': 'Contracts',
    'examples.item.contracts.desc':
      'What a function demands and what it promises, written in its own signature.',

    'cta.title': 'Shall we try it?',
    'cta.body':
      'It installs with a single command on macOS, Linux and Windows (via WSL2), with no dependencies. And the book walks with you from the first program to a complete case study.',

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

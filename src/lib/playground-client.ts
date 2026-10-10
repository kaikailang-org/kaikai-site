import { basicSetup } from 'codemirror';
import { EditorState, RangeSetBuilder, StateEffect, StateField } from '@codemirror/state';
import { Decoration, EditorView, keymap, type DecorationSet } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { indentUnit } from '@codemirror/language';
import { kaikai, kaikaiLook } from './kaikai-mode';

interface Example {
  id: string;
  title: string;
  code: string;
}

interface CompileReply {
  errors: string;
  events: { kind: string; message: string; delay: number }[];
  status: number;
  reason: string;
}

const DRAFT_KEY = 'kaikai-playground-draft';

// ---- lines the compiler complained about ----------------------------

const markErrors = StateEffect.define<number[]>();

const errorLines = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(marks, tr) {
    marks = marks.map(tr.changes);
    for (const e of tr.effects) {
      if (!e.is(markErrors)) continue;
      const builder = new RangeSetBuilder<Decoration>();
      const lines = [...new Set(e.value)]
        .filter((n) => n >= 1 && n <= tr.state.doc.lines)
        .sort((a, b) => a - b);
      for (const n of lines) {
        builder.add(
          tr.state.doc.line(n).from,
          tr.state.doc.line(n).from,
          Decoration.line({ class: 'cm-kai-error' }),
        );
      }
      marks = builder.finish();
    }
    return marks;
  },
  provide: (f) => EditorView.decorations.from(f),
});

// ---- sharing through the URL fragment --------------------------------

function toBase64Url(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array {
  const s = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
}

async function through(bytes: Uint8Array, stream: TransformStream): Promise<Uint8Array> {
  const piped = new Blob([bytes as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(piped).arrayBuffer());
}

/** `z` marks a deflated payload, `p` a plain one for browsers that cannot compress. */
async function pack(source: string): Promise<string> {
  const bytes = new TextEncoder().encode(source);
  if ('CompressionStream' in window) {
    return 'z' + toBase64Url(await through(bytes, new CompressionStream('deflate-raw')));
  }
  return 'p' + toBase64Url(bytes);
}

async function unpack(packed: string): Promise<string | null> {
  try {
    const bytes = fromBase64Url(packed.slice(1));
    if (packed[0] === 'p') return new TextDecoder().decode(bytes);
    if (packed[0] === 'z' && 'DecompressionStream' in window) {
      return new TextDecoder().decode(
        await through(bytes, new DecompressionStream('deflate-raw')),
      );
    }
  } catch {
    /* a mangled link: fall through to the default program */
  }
  return null;
}

// ---- the page ---------------------------------------------------------

export async function mountPlayground(root: HTMLElement): Promise<void> {
  const $ = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const text: Record<string, string> = JSON.parse($('[data-strings]').textContent!);
  const examples: Example[] = JSON.parse($('[data-examples]').textContent!);

  const output = $<HTMLPreElement>('[data-output]');
  const runBtn = $<HTMLButtonElement>('[data-run]');
  const fmtBtn = $<HTMLButtonElement>('[data-format]');
  const shareBtn = $<HTMLButtonElement>('[data-share]');
  const picker = $<HTMLSelectElement>('[data-picker]');
  const version = $('[data-version]');

  const fromLink = location.hash.startsWith('#code=')
    ? await unpack(location.hash.slice('#code='.length))
    : null;
  let draft: string | null = null;
  try {
    draft = localStorage.getItem(DRAFT_KEY);
  } catch {
    /* storage unavailable: start from the first example */
  }

  let busy = false;

  const view = new EditorView({
    parent: $('[data-editor]'),
    state: EditorState.create({
      doc: fromLink ?? draft ?? examples[0].code,
      extensions: [
        keymap.of([
          { key: 'Mod-Enter', run: () => (void run(), true) },
          indentWithTab,
        ]),
        basicSetup,
        indentUnit.of('  '),
        EditorState.tabSize.of(2),
        kaikai,
        kaikaiLook,
        errorLines,
        EditorView.updateListener.of((u) => {
          if (!u.docChanged) return;
          try {
            localStorage.setItem(DRAFT_KEY, u.state.doc.toString());
          } catch {
            /* nothing to do without storage */
          }
        }),
      ],
    }),
  });

  type Part = { text: string; kind: 'out' | 'err' | 'note' };

  function show(parts: Part[]): void {
    output.replaceChildren(
      ...parts.map((p) => {
        const span = document.createElement('span');
        span.className = `pg-${p.kind}`;
        span.textContent = p.text;
        return span;
      }),
    );
  }

  const note = (key: string) => show([{ text: text[key], kind: 'note' }]);

  function setBusy(on: boolean): void {
    busy = on;
    runBtn.disabled = fmtBtn.disabled = on;
    root.toggleAttribute('data-busy', on);
  }

  async function call(path: string): Promise<unknown | null> {
    let res: Response;
    try {
      res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: view.state.doc.toString() }),
      });
    } catch {
      note('offline');
      return null;
    }
    if (res.status === 429) return note('tooFast'), null;
    if (res.status === 503) return note('busy'), null;
    if (res.status === 413) return note('tooLarge'), null;
    if (!res.ok) return note('internal'), null;
    return res.json();
  }

  async function run(): Promise<void> {
    if (busy) return;
    setBusy(true);
    note('running');
    view.dispatch({ effects: markErrors.of([]) });
    const reply = (await call('/api/compile')) as CompileReply | null;
    setBusy(false);
    if (!reply) return;

    if (reply.errors) {
      const lines = [...reply.errors.matchAll(/main\.kai:(\d+):\d+/g)].map((m) => Number(m[1]));
      view.dispatch({ effects: markErrors.of(lines) });
      show([{ text: reply.errors, kind: 'err' }]);
      return;
    }

    const parts: Part[] = reply.events.map((e) => ({ text: e.message, kind: 'out' }));
    const reasons: Record<string, string> = {
      timeout: 'timeout',
      output_limit: 'outputLimit',
      killed: 'killed',
      build_timeout: 'buildTimeout',
      build_killed: 'buildTimeout',
      internal: 'internal',
    };
    const printed = parts.length > 0;
    // Notes go on a line of their own, set apart from what the program printed.
    const lead = !printed ? '' : parts[parts.length - 1].text.endsWith('\n') ? '\n' : '\n\n';
    if (reply.reason) {
      parts.push({ text: lead + text[reasons[reply.reason] ?? 'internal'], kind: 'note' });
    } else if (reply.status !== 0) {
      parts.push({ text: `${lead}${text.exit} ${reply.status}.`, kind: 'note' });
    } else if (!printed) {
      parts.push({ text: text.noOutput, kind: 'note' });
    }
    show(parts);
  }

  async function format(): Promise<void> {
    if (busy) return;
    setBusy(true);
    note('formatting');
    const reply = (await call('/api/fmt')) as { body: string; error: string } | null;
    setBusy(false);
    if (!reply) return;
    if (reply.error) {
      show([{ text: reply.error, kind: 'err' }]);
      return;
    }
    if (reply.body !== view.state.doc.toString()) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: reply.body },
        effects: markErrors.of([]),
      });
    }
    note('hint');
  }

  async function share(): Promise<void> {
    const url = `${location.origin}${location.pathname}#code=${await pack(view.state.doc.toString())}`;
    history.replaceState(null, '', url);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* the link is in the address bar either way */
    }
    const label = shareBtn.querySelector('span')!;
    const before = label.textContent;
    label.textContent = text.shared;
    setTimeout(() => (label.textContent = before), 1800);
  }

  runBtn.addEventListener('click', () => void run());
  fmtBtn.addEventListener('click', () => void format());
  shareBtn.addEventListener('click', () => void share());
  picker.addEventListener('change', () => {
    const chosen = examples.find((e) => e.id === picker.value);
    if (!chosen) return;
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: chosen.code },
      effects: markErrors.of([]),
      selection: { anchor: 0 },
    });
    picker.value = '';
    note('hint');
    view.focus();
  });

  fetch('/api/version')
    .then((r) => (r.ok ? r.json() : null))
    .then((v) => {
      // "kaikai 0.139.3 - hanga-roa (…)": the name and number are enough here.
      if (v?.version) version.textContent = String(v.version).split(' - ')[0];
    })
    .catch(() => {});
}

import {
  HighlightStyle,
  StreamLanguage,
  syntaxHighlighting,
  type StreamParser,
} from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';

/**
 * kaikai for CodeMirror. A hand-written tokenizer that follows the same
 * categories as the TextMate grammar in src/syntax, so the editor and the
 * highlighted snippets elsewhere on the site read alike.
 */

type Frame =
  | { kind: 'string' }
  | { kind: 'triple' }
  /** Inside `#{ ... }`; `depth` counts the braces opened within it. */
  | { kind: 'interp'; depth: number };

interface State {
  stack: Frame[];
  /** The next identifier names the function being declared. */
  afterFn: boolean;
  /** Brackets open at this point, for indentation. */
  depth: number;
}

const CONTROL = new Set([
  'if', 'else', 'match', 'case', 'when', 'handle', 'with', 'where',
  'requires', 'ensures',
]);
const DECLARATION = new Set([
  'type', 'effect', 'protocol', 'impl', 'for', 'axiom', 'const', 'theory',
  'unit', 'kind', 'let', 'var',
]);
const OTHER = new Set([
  'import', 'use', 'as', 'pub', 'priv', 'extern', 'test', 'bench', 'check',
  'assert',
]);
const LOGICAL = new Set(['and', 'or', 'not']);
const ATOMS = new Set(['None', 'Some', 'Ok', 'Err', 'Nothing']);

const ESCAPE = /^\\(u\{[0-9a-fA-F]{1,6}\}|x[0-9a-fA-F]{2}|.)/;
const CHAR = /^'(\\(u\{[0-9a-fA-F]{1,6}\}|x[0-9a-fA-F]{2}|.)|[^'\\])'/;
const NUMBER =
  /^(0[xX][0-9a-fA-F_]+|0[bB][01_]+|\d[\d_]*(\.\d[\d_]*)?([eE][+-]?\d+)?)(i128|i32|u32|u64|i)?/;
const OPERATOR =
  /^(\|>|\|\||\|\?|\||->|=>|:=|==|!=|<=|>=|\+\+|\.\.\.|\.\.|[-+*/%<>=!?@^])/;

const parser: StreamParser<State> = {
  name: 'kaikai',

  startState: () => ({ stack: [], afterFn: false, depth: 0 }),

  copyState: (s) => ({
    stack: s.stack.map((f) => ({ ...f })),
    afterFn: s.afterFn,
    depth: s.depth,
  }),

  token(stream, state) {
    let top = state.stack[state.stack.length - 1];

    // A "..." string cannot span lines; drop one left open so a typo does
    // not paint the rest of the file as text.
    if (stream.sol() && top?.kind === 'string') {
      state.stack.pop();
      top = state.stack[state.stack.length - 1];
    }

    if (top?.kind === 'string' || top?.kind === 'triple') {
      const closer = top.kind === 'triple' ? '"""' : '"';
      if (stream.match(closer)) {
        state.stack.pop();
        return 'string';
      }
      if (stream.match('#{')) {
        state.stack.push({ kind: 'interp', depth: 0 });
        return 'interpolation';
      }
      if (stream.match(ESCAPE)) return 'escape';
      if (!stream.match(/^[^"\\#]+/)) stream.next();
      return 'string';
    }

    if (stream.eatSpace()) return null;

    if (top?.kind === 'interp' && top.depth === 0 && stream.peek() === '}') {
      stream.next();
      state.stack.pop();
      return 'interpolation';
    }

    if (stream.match('#[')) {
      state.depth++;
      return 'meta';
    }
    if (stream.peek() === '#') {
      stream.skipToEnd();
      return 'lineComment';
    }

    if (stream.match('"""')) {
      state.stack.push({ kind: 'triple' });
      return 'string';
    }
    if (stream.match('"')) {
      state.stack.push({ kind: 'string' });
      return 'string';
    }
    if (stream.match(CHAR)) return 'character';
    if (stream.match(/^~r\/(\\.|[^/\\])*\/[a-z]*/)) return 'regexp';
    if (stream.match(NUMBER)) return 'number';

    const word = stream.match(/^[A-Za-z_][A-Za-z0-9_]*/) as RegExpMatchArray | null;
    if (word) {
      const w = word[0];
      if (state.afterFn) {
        state.afterFn = false;
        return 'fnName';
      }
      if (w === 'fn') {
        state.afterFn = true;
        return 'definitionKeyword';
      }
      if (CONTROL.has(w)) return 'controlKeyword';
      if (DECLARATION.has(w)) return 'definitionKeyword';
      if (OTHER.has(w)) return 'keyword';
      if (LOGICAL.has(w)) return 'operatorKeyword';
      if (w === 'true' || w === 'false') return 'bool';
      if (ATOMS.has(w)) return 'atom';
      if (/^[A-Z]/.test(w)) return 'typeName';
      return 'variableName';
    }
    state.afterFn = false;

    if (stream.match(OPERATOR)) return 'operator';

    const ch = stream.next();
    if (ch === '(' || ch === '[' || ch === '{') {
      state.depth++;
      if (top?.kind === 'interp' && ch === '{') top.depth++;
      return 'bracket';
    }
    if (ch === ')' || ch === ']' || ch === '}') {
      state.depth = Math.max(0, state.depth - 1);
      if (top?.kind === 'interp' && ch === '}') top.depth--;
      return 'bracket';
    }
    if (ch && ',.:;'.includes(ch)) return 'punctuation';
    return null;
  },

  indent(state, textAfter, cx) {
    const top = state.stack[state.stack.length - 1];
    if (top?.kind === 'triple') return null;
    const closes = /^\s*[)\]}]/.test(textAfter) ? 1 : 0;
    return Math.max(0, state.depth - closes) * cx.unit;
  },

  languageData: {
    commentTokens: { line: '#' },
    closeBrackets: { brackets: ['(', '[', '{', '"'] },
    indentOnInput: /^\s*[)\]}]$/,
  },

  tokenTable: {
    fnName: t.function(t.definition(t.variableName)),
    interpolation: t.special(t.brace),
  },
};

export const kaikai = StreamLanguage.define(parser);

/* Colours of github-dark-dimmed, the theme the site's static snippets use. */
const palette = {
  fg: '#adbac7',
  comment: '#768390',
  keyword: '#f47067',
  string: '#96d0ff',
  constant: '#6cb6ff',
  fn: '#dcbdfb',
  type: '#f69d50',
  meta: '#8ddb8c',
};

const highlight = HighlightStyle.define([
  { tag: t.lineComment, color: palette.comment, fontStyle: 'italic' },
  {
    tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.operatorKeyword],
    color: palette.keyword,
  },
  { tag: [t.string, t.character, t.regexp], color: palette.string },
  { tag: [t.escape, t.special(t.brace)], color: palette.keyword },
  { tag: [t.number, t.bool, t.atom], color: palette.constant },
  { tag: t.function(t.definition(t.variableName)), color: palette.fn },
  { tag: t.typeName, color: palette.type },
  { tag: t.operator, color: palette.keyword },
  { tag: t.meta, color: palette.meta },
  { tag: [t.variableName, t.punctuation, t.bracket], color: palette.fg },
]);

const theme = EditorView.theme(
  {
    '&': {
      color: palette.fg,
      backgroundColor: 'transparent',
      height: '100%',
      fontSize: '0.86rem',
    },
    '&.cm-focused': { outline: 'none' },
    '.cm-scroller': {
      fontFamily: 'var(--font-mono)',
      lineHeight: '1.65',
    },
    '.cm-content': { padding: '0.9rem 0', caretColor: '#ffd166' },
    '.cm-line': { padding: '0 1.1rem 0 0.6rem' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#ffd166', borderLeftWidth: '2px' },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      color: 'rgba(173, 186, 199, 0.35)',
      border: 'none',
      paddingLeft: '0.5rem',
    },
    '.cm-activeLine': { backgroundColor: 'rgba(255, 255, 255, 0.035)' },
    '.cm-activeLineGutter': {
      backgroundColor: 'transparent',
      color: 'rgba(173, 186, 199, 0.85)',
    },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, ::selection':
      { backgroundColor: 'rgba(108, 182, 255, 0.25)' },
    '.cm-matchingBracket, &.cm-focused .cm-matchingBracket': {
      backgroundColor: 'rgba(255, 209, 102, 0.18)',
      outline: '1px solid rgba(255, 209, 102, 0.4)',
    },
    '.cm-foldPlaceholder': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: 'none',
      color: palette.comment,
    },
    '.cm-panels': { backgroundColor: '#1c2128', color: palette.fg },
    '.cm-panels.cm-panels-bottom': { borderTop: '1px solid var(--code-border)' },
    '.cm-textfield': {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      border: '1px solid var(--code-border)',
      color: palette.fg,
    },
    '.cm-button': {
      backgroundImage: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid var(--code-border)',
      color: palette.fg,
    },
    '.cm-tooltip': {
      backgroundColor: '#1c2128',
      border: '1px solid var(--code-border)',
      color: palette.fg,
    },
    '.cm-kai-error': { backgroundColor: 'rgba(244, 112, 103, 0.16)' },
    '.cm-kai-error-gutter': { color: '#f47067 !important', fontWeight: '600' },
  },
  { dark: true },
);

export const kaikaiLook = [theme, syntaxHighlighting(highlight)];

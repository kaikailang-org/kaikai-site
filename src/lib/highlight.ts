import { createHighlighter, type Highlighter } from 'shiki';
import kaikaiGrammar from '../syntax/kaikai.tmLanguage.json';

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark-dimmed'],
      langs: [{ ...kaikaiGrammar, aliases: ['kai'] }],
    });
  }
  return highlighterPromise;
}

export async function highlightKai(code: string): Promise<string> {
  const h = await getHighlighter();
  return h.codeToHtml(code.trimEnd(), {
    lang: 'kaikai',
    theme: 'github-dark-dimmed',
  });
}

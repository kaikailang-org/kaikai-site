export interface ParsedSnippet {
  /** Header prose, comment markers stripped, without the transcript block. */
  prose: string[];
  /** The `kai run …` invocation the header documents, if any. */
  command: string | null;
  /** The output lines that follow the invocation. */
  output: string[];
  /** The program itself, header removed. */
  code: string;
}

const COMMENT = /^#\s?/;
const PROMPT = /^\s*\$\s+(.*)$/;

/**
 * Split a quickstart snippet into its three parts.
 *
 * Every snippet opens with a comment header that explains the program and
 * then shows a shell transcript — the `kai run` line plus the output it
 * produces. Rendering that header verbatim above the code duplicates the
 * page's own prose, so the parts are separated and laid out on their own.
 */
export function parseSnippet(source: string): ParsedSnippet {
  const lines = source.split('\n');

  let i = 0;
  const header: string[] = [];
  while (i < lines.length && (lines[i].startsWith('#') || lines[i].trim() === '')) {
    // A blank line ends the header only once some header was collected;
    // it never appears before the first comment in these files.
    if (lines[i].trim() === '') {
      if (header.length > 0) break;
      i++;
      continue;
    }
    header.push(lines[i].replace(COMMENT, ''));
    i++;
  }

  const code = lines.slice(i).join('\n').replace(/^\n+/, '').replace(/\s+$/, '');

  // The transcript starts at the `$ …` line; everything after it is output.
  const promptAt = header.findIndex((l) => PROMPT.test(l));
  const prose = (promptAt === -1 ? header : header.slice(0, promptAt))
    .join('\n')
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);

  let command: string | null = null;
  let output: string[] = [];
  if (promptAt !== -1) {
    command = header[promptAt].match(PROMPT)![1].trim();
    output = header
      .slice(promptAt + 1)
      .map((l) => l.replace(/^ {0,3}/, ''))
      .filter((l, idx, arr) => !(l.trim() === '' && idx === arr.length - 1));
    while (output.length && output[output.length - 1].trim() === '') output.pop();
  }

  return { prose, command, output, code };
}

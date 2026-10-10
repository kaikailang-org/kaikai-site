import { getCollection, type CollectionEntry } from 'astro:content';
import { t, type Lang } from '../i18n/ui';

export type BlogEntry = CollectionEntry<'blog'>;

const langOf = (entry: BlogEntry) => entry.id.split('/')[0] as Lang;
/** File name shared by a post and its translation. */
const keyOf = (entry: BlogEntry) => entry.id.split('/')[1];

export function blogSlug(entry: BlogEntry): string {
  return entry.data.slug ?? keyOf(entry).replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

export function blogIndexPath(lang: Lang): string {
  return lang === 'es' ? '/blog' : '/en/blog';
}

export function blogPostPath(entry: BlogEntry): string {
  return `${blogIndexPath(langOf(entry))}/${blogSlug(entry)}`;
}

/** Posts for one edition, newest first. Drafts only show while developing. */
export async function getBlogPosts(lang: Lang): Promise<BlogEntry[]> {
  const all = await getCollection(
    'blog',
    (entry) => langOf(entry) === lang && (import.meta.env.DEV || !entry.data.draft),
  );
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Where the language switch lands from a post: its translation when there is
 * one, the other edition's index otherwise.
 */
export async function blogCounterpartPath(entry: BlogEntry): Promise<string> {
  const otherLang: Lang = langOf(entry) === 'es' ? 'en' : 'es';
  const counterpart = (await getBlogPosts(otherLang)).find(
    (other) => keyOf(other) === keyOf(entry),
  );
  return counterpart ? blogPostPath(counterpart) : blogIndexPath(otherLang);
}

export function formatPostDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-CL' : 'en-US', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(date);
}

export function blogFeedPath(lang: Lang): string {
  return `${blogIndexPath(lang)}/rss.xml`;
}

const escapeXml = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** RSS 2.0 feed for one edition. Items carry the post summary, not its body. */
export async function blogFeed(lang: Lang, site: URL): Promise<Response> {
  const tt = t(lang);
  const abs = (path: string) => new URL(path, site).href;
  const posts = await getBlogPosts(lang);
  const items = posts.map((post) => {
    const link = abs(`${blogPostPath(post)}/`);
    return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
      <description>${escapeXml(post.data.description ?? '')}</description>
    </item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(tt('blog.feedTitle'))}</title>
    <link>${abs(`${blogIndexPath(lang)}/`)}</link>
    <description>${escapeXml(tt('blog.lead'))}</description>
    <language>${lang}</language>
    <atom:link href="${abs(blogFeedPath(lang))}" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}

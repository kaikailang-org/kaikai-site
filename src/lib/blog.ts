import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

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

import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type BookEntry = CollectionEntry<'book'>;

/** Chapters + appendices for one edition, in reading order. */
export async function getBookChapters(lang: Lang): Promise<BookEntry[]> {
  const all = await getCollection('book', ({ data }) => data.lang === lang);
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** URL of a chapter page for the given edition. */
export function bookChapterPath(lang: Lang, slug: string): string {
  return lang === 'es' ? `/book/${slug}` : `/en/book/${slug}`;
}

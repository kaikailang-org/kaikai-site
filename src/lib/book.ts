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

/**
 * Where the language switch should land from a chapter of the other edition.
 *
 * The two editions use different slugs for the same chapter (cap01-tour vs
 * ch01-tour), so a path rewrite cannot map one onto the other. They do share
 * the position the sync assigns, so `part` + `order` is the join key. An
 * edition that lacks the counterpart falls back to its index rather than
 * sending the reader to a 404.
 */
export async function bookCounterpartPath(entry: BookEntry): Promise<string> {
  const otherLang: Lang = entry.data.lang === 'es' ? 'en' : 'es';
  const counterpart = (await getBookChapters(otherLang)).find(
    (c) => c.data.part === entry.data.part && c.data.order === entry.data.order,
  );
  return counterpart
    ? bookChapterPath(otherLang, counterpart.data.slug)
    : bookChapterPath(otherLang, '').replace(/\/$/, '');
}

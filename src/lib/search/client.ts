/**
 * Browser-side site search shared by the home "Ask AI" box and the chat
 * fallback. MiniSearch, the tokenizer (with its synonym dictionary) and the
 * per-language index (/api/search-index/[lang], built at build time) are only
 * downloaded on first use, then reused.
 */
import type MiniSearch from 'minisearch';
import type { SupportedLocale } from '@/data/types';
import type { SearchDoc } from './documents';

export type SiteHit = Pick<SearchDoc, 'id' | 'title' | 'snippet' | 'url' | 'type'> & {
  /** FAQ entries: the official answer (the chat shows it instead of linking to a page). */
  answer?: string;
};

const indexes = new Map<SupportedLocale, MiniSearch<SearchDoc>>();
const loading = new Map<SupportedLocale, Promise<MiniSearch<SearchDoc> | null>>();

/** The loaded index for `locale`, if it is already in memory. */
export function getLoadedSiteSearch(locale: SupportedLocale): MiniSearch<SearchDoc> | null {
  return indexes.get(locale) ?? null;
}

/** Loads (once) the index for `locale`. Resolves to null on failure; a later call retries. */
export function loadSiteSearch(locale: SupportedLocale): Promise<MiniSearch<SearchDoc> | null> {
  const ready = indexes.get(locale);
  if (ready) return Promise.resolve(ready);

  let pending = loading.get(locale);
  if (!pending) {
    pending = Promise.all([
      import('minisearch'),
      import('./tokenize'),
      fetch(`/api/search-index/${locale}`).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status))))),
    ])
      .then(([{ default: MiniSearchCtor }, { SEARCH_OPTIONS }, { docs }]: [typeof import('minisearch'), typeof import('./tokenize'), { docs: SearchDoc[] }]) => {
        const ms = new MiniSearchCtor<SearchDoc>({ ...SEARCH_OPTIONS, storeFields: ['title', 'snippet', 'url', 'type', 'text'] });
        ms.addAll(docs);
        indexes.set(locale, ms);
        return ms;
      })
      .catch(() => null)
      .finally(() => loading.delete(locale));
    loading.set(locale, pending);
  }
  return pending;
}

export function searchSite(ms: MiniSearch<SearchDoc>, query: string, limit = 5): SiteHit[] {
  return ms.search(query).slice(0, limit).map((r) => ({
    id: r.id,
    title: r.title,
    snippet: r.snippet,
    url: r.url,
    type: r.type,
    ...(r.type === 'faq' && r.text ? { answer: r.text as string } : {}),
  }));
}

/** Like searchSite, but tops up with these documents (by id) when there are fewer than `limit` matches. */
export function searchSiteOrDefaults(ms: MiniSearch<SearchDoc>, query: string, limit: number, defaultIds: string[]): SiteHit[] {
  const hits = searchSite(ms, query, limit);
  for (const id of defaultIds) {
    if (hits.length >= limit) break;
    if (hits.some((h) => h.id === id)) continue;
    const doc = ms.getStoredFields(id) as Partial<SiteHit> | undefined;
    if (doc?.url && doc.title) hits.push({ id, title: doc.title, snippet: doc.snippet ?? '', url: doc.url, type: doc.type ?? 'contact' });
  }
  return hits;
}

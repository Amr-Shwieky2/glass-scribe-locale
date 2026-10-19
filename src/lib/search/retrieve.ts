/**
 * Server-side retrieval for AI answers: the full site corpus split into
 * passages and indexed with MiniSearch (built once per language per instance).
 */
import MiniSearch from 'minisearch';
import type { SupportedLocale } from '@/data/types';
import { buildSearchDocs, type SearchDoc } from './documents';
import { SEARCH_OPTIONS } from './tokenize';

export interface Passage {
  id: string;
  title: string;
  url: string;
  type: SearchDoc['type'];
  snippet: string;
  keywords: string;
  text: string;
}

const MAX_PASSAGE = 900;

function toPassages(doc: SearchDoc): Passage[] {
  const paragraphs = doc.text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const passages: Passage[] = [];
  let buf = '';
  const flush = () => {
    if (buf) passages.push({ ...doc, id: `${doc.id}#${passages.length}`, text: buf });
    buf = '';
  };
  for (const p of paragraphs.length ? paragraphs : [doc.snippet]) {
    if (buf && buf.length + p.length > MAX_PASSAGE) flush();
    buf = buf ? `${buf}\n\n${p}` : p;
    if (buf.length > MAX_PASSAGE) flush();
  }
  flush();
  return passages;
}

const indexes = new Map<SupportedLocale, MiniSearch<Passage>>();

function getIndex(locale: SupportedLocale): MiniSearch<Passage> {
  let index = indexes.get(locale);
  if (!index) {
    index = new MiniSearch<Passage>({ ...SEARCH_OPTIONS, storeFields: ['title', 'url', 'type', 'text'] });
    index.addAll(buildSearchDocs(locale).flatMap(toPassages));
    indexes.set(locale, index);
  }
  return index;
}

/** Top passages for a question (at most one per page, so links stay varied). */
export function retrievePassages(question: string, locale: SupportedLocale, limit = 5): Pick<Passage, 'title' | 'url' | 'text'>[] {
  const results = getIndex(locale).search(question);
  const seen = new Set<string>();
  const out: Pick<Passage, 'title' | 'url' | 'text'>[] = [];
  for (const r of results) {
    const url = r.url as string;
    if (seen.has(url)) continue;
    seen.add(url);
    out.push({ title: r.title as string, url, text: r.text as string });
    if (out.length >= limit) break;
  }
  return out;
}

/** The question's language from its script (Latin → English); otherwise the page language. */
export function detectLanguage(text: string, pageLocale: SupportedLocale): SupportedLocale {
  if (/[\u0590-\u05FF]/.test(text)) return 'he';
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  if (/[\u0400-\u04FF]/.test(text)) return 'ru';
  if (/[a-z]/i.test(text)) return 'en';
  return pageLocale;
}

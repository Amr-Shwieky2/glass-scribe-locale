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
/** Ranking weight of an FAQ entry vs. a page passage, so AI answers follow our official answers. */
const FAQ_BOOST = 2;
/** At most this many FAQ entries per answer, so related pages still get in. */
const MAX_FAQ_PASSAGES = 3;

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
    index = new MiniSearch<Passage>({ ...SEARCH_OPTIONS, storeFields: ['title', 'url', 'type', 'keywords', 'text'] });
    index.addAll(buildSearchDocs(locale).flatMap(toPassages));
    indexes.set(locale, index);
  }
  return index;
}

export type RetrievedPassage = Pick<Passage, 'title' | 'url' | 'type' | 'keywords' | 'text'>;

/**
 * Top passages for a question: FAQ entries weighted up (at most MAX_FAQ_PASSAGES),
 * and at most one passage per page, so links stay varied.
 */
export function retrievePassages(question: string, locale: SupportedLocale, limit = 5): RetrievedPassage[] {
  const results = getIndex(locale).search(question, {
    boostDocument: (_id, _term, stored) => (stored?.type === 'faq' ? FAQ_BOOST : 1),
  });
  const seenPages = new Set<string>();
  const out: RetrievedPassage[] = [];
  let faqs = 0;
  for (const r of results) {
    const passage: RetrievedPassage = { title: r.title, url: r.url, type: r.type, keywords: r.keywords, text: r.text };
    if (passage.type === 'faq') {
      if (faqs >= MAX_FAQ_PASSAGES) continue;
      faqs++;
    } else {
      if (seenPages.has(passage.url)) continue;
      seenPages.add(passage.url);
    }
    out.push(passage);
    if (out.length >= limit) break;
  }
  return out;
}

/**
 * The <site_content> block of an AI prompt: numbered passages, with FAQ entries
 * marked "Official FAQ" (and their service, if any) — the system prompts tell the
 * model to follow those answers.
 */
export function formatSiteContent(passages: RetrievedPassage[]): string {
  const items = passages.map((p, i) => {
    const url = p.url ? `\nURL: ${p.url}` : '';
    return p.type === 'faq'
      ? `[${i + 1}] Official FAQ${p.keywords ? ` (${p.keywords})` : ''}${url}\nQ: ${p.title}\nA: ${p.text}`
      : `[${i + 1}] ${p.title}${url}\n${p.text}`;
  });
  return ['<site_content>', ...items, '</site_content>'].join('\n');
}

/** The question's language from its script (Latin → English); otherwise the page language. */
export function detectLanguage(text: string, pageLocale: SupportedLocale): SupportedLocale {
  if (/[\u0590-\u05FF]/.test(text)) return 'he';
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  if (/[\u0400-\u04FF]/.test(text)) return 'ru';
  if (/[a-z]/i.test(text)) return 'en';
  return pageLocale;
}

/**
 * Language of a conversation for the chat: the newest visitor message written
 * decisively in one script wins. Hebrew/Arabic/Cyrillic text is always decisive;
 * Latin text only with at least two words, so "OK", "Dana" or a phone number
 * doesn't flip a Hebrew conversation to English. Falls back to the page language.
 */
export function conversationLanguage(visitorMessages: string[], pageLocale: SupportedLocale): SupportedLocale {
  for (let i = visitorMessages.length - 1; i >= 0; i--) {
    const text = visitorMessages[i];
    if (/[\u0590-\u05FF\u0600-\u06FF\u0400-\u04FF]/.test(text)) return detectLanguage(text, pageLocale);
    if ((text.match(/[a-z]{2,}/gi) ?? []).length >= 2) return 'en';
  }
  return pageLocale;
}

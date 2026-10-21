/**
 * Questions our answer engine could not answer with confidence, so the owner
 * can see what customers ask that the knowledge base doesn't cover yet
 * (Admin → Unanswered questions). Stored in Upstash Redis as a capped list of
 * the last 500 — only the cleaned text (phone numbers, e-mails and names after
 * "my name is…" removed), the language, the time, which layer answered and why.
 * Besides questions with no answer, it keeps the ones that only got "Did you mean"
 * buttons or the general price reply — the knowledge base may be missing them too. Without Upstash
 * (local development) the list is kept in memory.
 */
import type { SupportedLocale } from '@/data/types';
import { scrubPersonalData } from '@/lib/llm/privacy';
import { textUnits } from '@/lib/answer-engine/kb-index';
import { getRedis, redisErrorSummary } from '@/lib/redis';

export interface MissedQuestion {
  text: string;
  lang: SupportedLocale;
  /** Unix ms. */
  at: number;
  /** Who answered: 1 = our engine ("Did you mean" / general price reply), 2 = free-tier AI, 3 = hand-off to our team. */
  layer: 1 | 2 | 3;
  reason: 'low-confidence' | 'out-of-scope' | 'did-you-mean' | 'price-general';
}

export interface MissedQuestionGroup {
  /** The most recent wording. */
  example: string;
  count: number;
  langs: SupportedLocale[];
  lastAt: number;
  /** Every other wording, newest first (the admin list shows the first 5). */
  samples: string[];
  /** How many of them the free-tier AI answered (layer 2). */
  answeredByAi: number;
  /** How many looked out of scope (poems, weather…). */
  outOfScope: number;
  /** How many got "Did you mean" buttons instead of an answer. */
  didYouMean: number;
  /** How many got only the general "price depends on…" reply. */
  priceGeneral: number;
}

const KEY = 'assistant:missed';
const MAX = 500;
const MAX_TEXT = 300;
const memory: MissedQuestion[] = [];

export async function recordMissedQuestion(q: Omit<MissedQuestion, 'at' | 'text'> & { text: string }): Promise<void> {
  const item: MissedQuestion = { ...q, text: scrubPersonalData(q.text).replace(/\s+/g, ' ').trim().slice(0, MAX_TEXT), at: Date.now() };
  if (!item.text) return;
  const redis = getRedis();
  if (!redis) {
    memory.unshift(item);
    memory.length = Math.min(memory.length, MAX);
    return;
  }
  try {
    // One round trip: add and cap together
    await redis.multi().lpush(KEY, JSON.stringify(item)).ltrim(KEY, 0, MAX - 1).exec();
  } catch (err) {
    // Only the error's name and text: Upstash adds the command, which holds the question
    console.error('[missed-questions] Upstash error:', redisErrorSummary(err));
  }
}

/** Newest first, or null when Upstash couldn't be read. */
async function readMissedQuestions(): Promise<MissedQuestion[] | null> {
  const redis = getRedis();
  if (!redis) return [...memory];
  try {
    const raw = await redis.lrange<unknown>(KEY, 0, MAX - 1);
    return raw.flatMap((r) => {
      try {
        const v = (typeof r === 'string' ? JSON.parse(r) : r) as MissedQuestion;
        return v && typeof v.text === 'string' ? [v] : [];
      } catch {
        return [];
      }
    });
  } catch (err) {
    console.error('[missed-questions] Upstash error:', redisErrorSummary(err));
    return null;
  }
}

/** Newest first (empty when Upstash couldn't be read). */
export async function listMissedQuestions(): Promise<MissedQuestion[]> {
  return (await readMissedQuestions()) ?? [];
}

/** Synonym concepts too general to tell two questions apart ("how much…", "glass", a city…). */
const GENERIC_CONCEPTS = /^~(glass|price|install|time|human|contact|repair|clean|city-.*)$/;
/** Share of words two questions must have in common (of all their distinct words) to be grouped. */
const GROUP_SIMILARITY = 0.5;

/** A question's words for grouping (each with its variants), and all those variants. */
interface Words {
  list: string[][];
  all: Set<string>;
}

/**
 * A question's words for grouping: each word with its variants (stems without
 * their "=" marker, so "aquariums" meets "aquarium"; product synonyms), without
 * generic concepts. A question made only of generic words ("how much?") keeps
 * them, so it still meets the same question.
 */
function groupingWords(text: string): Words {
  const units = textUnits(text).map((u) => u.map((v) => v.replace(/^=/, '')));
  let list = units.map((u) => u.filter((v) => !GENERIC_CONCEPTS.test(v))).filter((w) => w.length);
  if (!list.length) list = units.length ? units : [[text.toLowerCase()]];
  return { list, all: new Set(list.flat()) };
}

/** How many of `words` share a variant with `other`. */
function sharedWords(words: string[][], other: Set<string>): number {
  let n = 0;
  for (const w of words) if (w.some((v) => other.has(v))) n++;
  return n;
}

/** Shared words ÷ all distinct words of both (Jaccard); words match on any variant. */
function similarity(a: Words, b: Words): number {
  const shared = Math.min(sharedWords(a.list, b.all), sharedWords(b.list, a.all));
  return shared / (a.list.length + b.list.length - shared);
}

/**
 * Groups similar questions, biggest groups first. Each question joins the group
 * whose first (newest) question it is most similar to — compared with that one
 * question, not with everything the group collected, so groups don't drift.
 */
export function groupMissedQuestions(items: MissedQuestion[]): MissedQuestionGroup[] {
  const groups: { words: Words; items: MissedQuestion[] }[] = [];
  for (const item of items) {
    const words = groupingWords(item.text);
    let best: (typeof groups)[number] | null = null;
    let bestScore = 0;
    for (const g of groups) {
      const score = similarity(words, g.words);
      if (score > bestScore) [best, bestScore] = [g, score];
    }
    if (best && bestScore >= GROUP_SIMILARITY) best.items.push(item);
    else groups.push({ words, items: [item] });
  }
  return groups
    .map((g) => ({
      example: g.items[0].text,
      count: g.items.length,
      langs: [...new Set(g.items.map((i) => i.lang))],
      lastAt: Math.max(...g.items.map((i) => i.at)),
      samples: [...new Set(g.items.slice(1).map((i) => i.text))].filter((t) => t !== g.items[0].text),
      answeredByAi: g.items.filter((i) => i.layer === 2).length,
      outOfScope: g.items.filter((i) => i.reason === 'out-of-scope').length,
      didYouMean: g.items.filter((i) => i.reason === 'did-you-mean').length,
      priceGeneral: g.items.filter((i) => i.reason === 'price-general').length,
    }))
    .sort((a, b) => b.count - a.count || b.lastAt - a.lastAt);
}

/** How many were added after `since`, up to `until` (for the daily summary); null when Upstash couldn't be read. */
export async function countMissedSince(since: number, until = Date.now()): Promise<number | null> {
  const items = await readMissedQuestions();
  return items && items.filter((q) => q.at > since && q.at <= until).length;
}

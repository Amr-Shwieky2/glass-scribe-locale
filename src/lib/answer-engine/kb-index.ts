/**
 * Knowledge base search with a confidence score (0–1).
 *
 * Every approved entry's question, each paraphrase and the answer are indexed
 * as separate small documents per language (MiniSearch, with the site's
 * tokenizer: stems, synonyms, typo-tolerant matching). MiniSearch finds the
 * candidates; the confidence is then computed from how much of the visitor's
 * message the best document covers (rarer words count more, typo/prefix
 * matches count partly) and how much of that document the message covers —
 * so one shared word with a long paraphrase is not a confident match.
 */
import MiniSearch from 'minisearch';
import { APPROVED_ENTRIES, type KnowledgeEntry } from '@/data/knowledge';
import type { SupportedLocale } from '@/data/types';
import { normalizeText, splitWords } from '@/lib/search/normalize';
import { SEARCH_OPTIONS, maskedSpans, oneTypoApart, processTerm, stems, tokenize, typoConcepts } from '@/lib/search/tokenize';

/** All variants (word, stems, synonym concepts) of one word of a text. */
export type Unit = string[];

interface KbDoc {
  id: string;
  entryId: string;
  /** question, paraphrase or answer */
  kind: 'q' | 'p' | 'a';
  text: string;
}

interface LangIndex {
  ms: MiniSearch<KbDoc>;
  units: Map<string, Unit[]>;
  df: Map<string, number>;
  docs: number;
  /** Products each entry's question is about. */
  products: Map<string, Set<string>>;
  /** Concepts of each entry's question. */
  questionConcepts: Map<string, Set<string>>;
  /** Concepts in each entry's question and paraphrases: what the entry is about. */
  topics: Map<string, Set<string>>;
  /** Every word (and ending stem) of each entry: its question, paraphrases and answer. */
  entryVocab: Map<string, Set<string>>;
  /** In how many entries each word occurs. */
  entryDf: Map<string, number>;
  /** Per wording: its units right after a "without" word (see WITHOUT). */
  negated: Map<string, Set<number>>;
}

export interface Match {
  entry: KnowledgeEntry;
  confidence: number;
  /**
   * The entry is about a product the message doesn't name, and the message has a word no entry
   * uses ("do you sell glass for telescopes?" vs the glass shelves entry): a guess, not an answer.
   */
  offProduct: boolean;
  /** The entry's question names a product (see PRODUCT_CONCEPTS) and the message names none of its products. */
  otherProduct: boolean;
  unknownShare: number;
  /** Share of the message's weight that the best matching wording doesn't cover at all (known words included). */
  uncoveredShare: number;
  /** Share of the best matching wording's words that the message has (0 for an answer text). */
  docCoverage: number;
  /** The best matching wording covers at least one of the message's words itself, not only through a synonym concept. */
  wordsCovered: boolean;
  /** The best matching wording: the question, a paraphrase or the answer text. */
  via: 'q' | 'p' | 'a';
  /** Concept tokens of the message that the best matching wording contains. */
  coveredConcepts: Set<string>;
  /** Concept tokens of the best matching wording (what it asks about). */
  docConcepts: Set<string>;
  /** Concepts in the entry's question and paraphrases (what it is about). */
  topics: Set<string>;
  /** Products the entry's question names. */
  products: Set<string>;
  /** Concepts of the entry's question (what it is about first of all). */
  questionConcepts: Set<string>;
  /**
   * Share of the message's weight in words that occur nowhere in the entry — not in its question, paraphrases or
   * answer ("how long is the warranty on my sofa": the warranty entry never mentions a sofa).
   */
  entryUncovered: number;
}

export interface ScoreParams {
  /** A partial (typo or prefix) match of a word counts this much of an exact one. */
  partial: number;
  /** An answer-text match counts this much of a question/paraphrase match. */
  answerDoc: number;
  /** City names matter little for which answer fits (cities are handled separately). */
  cityWeight: number;
  /** Words the knowledge base never uses (chatter: "hi, we just moved…") weigh this much of a rare known word. */
  unknownWeight: number;
  /** Share of the confidence that comes from covering the visitor's words (the rest: covering the matched paraphrase). */
  queryShare: number;
  /** A second matching wording of the same entry adds this share of its own confidence. */
  support: number;
  /** An entry about a product the visitor didn't mention keeps this share ("how long does installation take?" → the general answer, not the storefront one). */
  productMismatch: number;
  /** Added for the site's official FAQ answers (preferred in a near tie). */
  officialBonus: number;
  /** Share of the message's weight in unknown words above which an entry about another product is only a guess. */
  offProductUnknown: number;
}

export const DEFAULT_SCORE: ScoreParams = { partial: 0.6, answerDoc: 0.75, cityWeight: 0.35, unknownWeight: 1, queryShare: 0.6, support: 0.2, productMismatch: 0.9, officialBonus: 0.03, offProductUnknown: 0.4 };

/**
 * MiniSearch candidates (best text matches) that get a confidence score. The cut also keeps out
 * close rival paraphrases: scoring 80, 120 or all candidates (or adding those with a rare query
 * word) gained some unseen questions but lost more in every language (paraphrase fold check, Oct 2026);
 * so did keeping at most 3, 5 or 8 per entry. An entry pushed out of the cut ("במה תלויה העלות?") gets
 * "Did you mean…?" instead of its answer, not a wrong answer.
 */
const CANDIDATES = 60;

/**
 * Synonym concepts that tie a message to us only loosely ("how much is a flight to Eilat?", "do you have glass
 * for eyeglasses?"): see anchorOf in index.ts. Almost every answer text mentions them in passing ("the cheapest
 * panel", "glass", "installation"), so they don't count in an answer-text match.
 */
export const WEAK_CONCEPTS = new Set(['~price', '~cheap', '~glass', '~install']);

/** Synonym concepts that name a product (see synonyms.ts). */
export const PRODUCT_CONCEPTS = new Set(['~shower', '~railing', '~mirror', '~storefront', '~partition', '~door', '~backsplash', '~shelf']);

// The product of an entry's topic (glass doors, backsplashes and shelves share "other-products")
const TOPIC_PRODUCTS: Partial<Record<KnowledgeEntry['topic'], string>> = {
  showers: '~shower', railings: '~railing', mirrors: '~mirror', storefronts: '~storefront', partitions: '~partition',
};
const ID_PRODUCTS: [RegExp, string][] = [[/^doors-/, '~door'], [/^backsplash-/, '~backsplash'], [/^shelves-/, '~shelf']];
const topicProduct = (e: KnowledgeEntry) => TOPIC_PRODUCTS[e.topic] ?? ID_PRODUCTS.find(([re]) => re.test(e.id))?.[1];

// "قديش"/"adesh"/"how much" ask how much of anything: a price only when nothing else is measured — "قديش بياخد وقت
// التركيب؟" asks the time, "adesh smakit el zjaj" the thickness, "how much does a railing weigh" the weight
// (and "בכמה ימים" asks in how many days)
const HOW_MUCH = new Set(['قديش', 'اديش', 'قداش', 'كديش', 'بقديش', 'adesh', '2adesh', 'addesh', 'בכמה']);
const HOW_MUCH_PHRASE = / how much /;
// "…сколько будет?" ending a message asks how much it will be; with more after it, how many or how long ("сколько будет
// мастеров", "сколько будет длиться")
const PRICE_AT_END = / сколько будет( примерно| по деньгам| в шекелях)? $/;
const QUANTITY_CONCEPTS = new Set(['~time', '~lifespan', '~thickness', '~weight', '~validity', '~dimension']);
// "כמה זה גבוה?", "قديش عالي الدرابزين؟": how high, wide, long or deep something is — not its price, nor what a "high"
// balcony needs: a size ("~dimension", which no entry is about: see STRICT_SUBJECTS in index.ts); "כמה זה כבד?" its weight
const HOW_MUCH_WORD = '(?:כמה|בכמה|قديش|اديش|كم|adesh) (?:זה |הוא |היא |هو |هي |بيكون |بتكون )?';
const HOW_MUCH_SIZE = new RegExp(` ${HOW_MUCH_WORD}(?:גבוה|גבוהה|גבוהים|גבוהות|רחב|רחבה|ארוך|ארוכה|עמוק|עמוקה|عالي|عاليه|طويل|طويله|عريض|عريضه|غميق|عميق) `);
const HOW_MUCH_HEAVY = new RegExp(` ${HOW_MUCH_WORD}(?:כבד|כבדה|כבדים|تقيل|تقيله|ثقيل|ثقيله) `);

// "During" ("لازم اكون بالبيت وقت التركيب؟", "во время установки"): a time word that doesn't ask how long — unless
// the text asks that too ("كم وقت التركيب؟", "сколько времени")
const DURING: [string, RegExp][] = [['وقت', /^ال/], ['بوقت', /^ال/], ['خلال', /^ال/], ['время', /^/]];
function duringTime(text: string, units: Unit[]): void {
  const words = splitWords(normalizeText(text));
  const during = new Set(words.filter((w, i) => DURING.some(([d, next]) => w === d && i + 1 < words.length && next.test(words[i + 1]) && (d !== 'время' || words[i - 1] === 'во'))));
  if (!during.size) return;
  const otherTime = units.some((u) => !during.has(u[0]) && u.includes('~time'));
  if (otherTime) return;
  for (const u of units) if (during.has(u[0])) u.splice(0, u.length, ...u.filter((v) => v !== '~time'));
}

// "How long does the glass stay clear?": how long a state lasts is the product's lifespan, not a lead time — while "a
// mirror that stays clear after a shower" is the anti-fog one
const HOW_LONG = / (how long|for how long|כמה זמן|לכמה זמן|как долго|сколько времени|сколько лет|قديش|اديش|adesh|كم سنه) /;
const STAYS = / (stay|stays|remain|remains) (clear|clean|new|shiny|transparent|like new)| (נשאר|נשארת|נשארים|יישאר|תישאר) (שקוף|שקופה|נקי|נקייה|חדש|חדשה)| (بيضل|بتضل|يضل|تضل) (شفاف|شفافه|نظيف|نظيفه|جديد|جديده)| (останется|остается|останутся|сохранится) (прозрачным|прозрачной|чистым|чистой|новым|новой)/;
function lastingState(text: string, units: Unit[]): void {
  const t = ` ${splitWords(normalizeText(text)).join(' ')} `;
  if (HOW_LONG.test(t) && STAYS.test(t) && !units.some((u) => u.includes('~lifespan'))) units.push(['~lifespan']);
}

/** A word in another sense than usual: its forms marked "#", without concepts (see textUnits). */
const otherSense = (unit: Unit): Unit => unit.filter((v) => !v.startsWith('~')).map((v) => `#${v}`);

/**
 * The words of a text as units (repeated words counted once). A word that loses its concept in a phrase of
 * PHRASE_MASKS ("במרכז" in "במרכז מסחרי", "time" in "on time") is a word of its own, "#word": it matches only
 * the same phrase elsewhere, not the word's usual meaning.
 */
export function textUnits(text: string): Unit[] {
  const words = splitWords(normalizeText(text));
  const spans = maskedSpans(words);
  const masked = new Set(spans.map((m) => m.concept));
  const seen = new Set<string>();
  const units: Unit[] = [];
  tokenize(text).forEach((token, i) => {
    const v = processTerm(token);
    if (!v) return;
    let unit = Array.isArray(v) ? v : [v];
    // (a phrase's concept token comes after the words: not when that concept is masked here)
    if (i >= words.length && unit.length === 1 && masked.has(unit[0])) return;
    if (i < words.length && spans.some((m) => i >= m.from && i < m.to && unit.includes(m.concept))) unit = otherSense(unit);
    const key = unit[0];
    if (seen.has(key)) return;
    seen.add(key);
    units.push(unit);
  });
  duringTime(text, units);
  lastingState(text, units);
  const t = ` ${words.join(' ')} `;
  if (PRICE_AT_END.test(t) && !units.some((u) => u.includes('~price'))) units.push(['~price']);
  const size = HOW_MUCH_SIZE.test(t);
  const heavy = HOW_MUCH_HEAVY.test(t);
  if (size && !units.some((u) => u.includes('~dimension'))) units.push(['~dimension']);
  if (heavy && !units.some((u) => u.includes('~weight'))) units.push(['~weight']);
  if (!units.some((u) => u.some((v) => QUANTITY_CONCEPTS.has(v)))) return units;
  const askWord = (u: Unit) => u.some((v) => HOW_MUCH.has(v));
  // (a phrase's concept is a unit of its own: "how much" → ["~price"])
  const phrase = (u: Unit) => u.length === 1 && u[0] === '~price';
  const howMuch = units.some(askWord) || HOW_MUCH_PHRASE.test(t) || size || heavy;
  if (!howMuch || units.some((u) => !askWord(u) && !phrase(u) && u.includes('~price'))) return units;
  // (and the how-much word itself is then not the one of price questions: "בכמה ימים…" doesn't match "בכמה מקלחון?")
  return units.filter((u) => !phrase(u)).map((u) => (askWord(u) ? otherSense(u) : u));
}

const indexes = new Map<SupportedLocale, LangIndex>();

function getIndex(lang: SupportedLocale): LangIndex {
  let index = indexes.get(lang);
  if (index) return index;

  const docs: KbDoc[] = [];
  for (const e of APPROVED_ENTRIES) {
    docs.push({ id: `${e.id}#q`, entryId: e.id, kind: 'q', text: e.question[lang] });
    e.paraphrases[lang].forEach((text, i) => docs.push({ id: `${e.id}#p${i}`, entryId: e.id, kind: 'p', text }));
    docs.push({ id: `${e.id}#a`, entryId: e.id, kind: 'a', text: e.answer[lang] });
  }

  const ms = new MiniSearch<KbDoc>({
    fields: ['text'],
    storeFields: ['entryId', 'kind'],
    tokenize,
    processTerm,
    // Candidates only: which prefix and typo matches count for the confidence is decided by partialMatch
    searchOptions: { prefix: SEARCH_OPTIONS.searchOptions.prefix, fuzzy: SEARCH_OPTIONS.searchOptions.fuzzy, combineWith: 'OR' },
  });
  ms.addAll(docs);

  const units = new Map<string, Unit[]>();
  const df = new Map<string, number>();
  for (const d of docs) {
    const u = textUnits(d.text);
    units.set(d.id, u);
    for (const term of new Set(u.flat())) df.set(term, (df.get(term) ?? 0) + 1);
  }

  const products = new Map<string, Set<string>>();
  const questionConcepts = new Map<string, Set<string>>();
  for (const e of APPROVED_ENTRIES) {
    const concepts = textUnits(e.question[lang]).flat().filter((t) => t.startsWith('~'));
    const named = concepts.filter((t) => PRODUCT_CONCEPTS.has(t));
    // An entry of a product topic is about that product even when its question doesn't say so
    // ("Do you handle both new bathrooms and renovations?" is about showers)
    const topic = topicProduct(e);
    products.set(e.id, new Set(named.length || !topic ? named : [topic]));
    questionConcepts.set(e.id, new Set(concepts));
  }

  const topics = new Map<string, Set<string>>();
  for (const d of docs) {
    if (d.kind === 'a') continue;
    const set = topics.get(d.entryId) ?? new Set<string>();
    for (const t of (units.get(d.id) ?? []).flat()) if (t.startsWith('~')) set.add(t);
    topics.set(d.entryId, set);
  }

  const entryVocab = new Map<string, Set<string>>();
  for (const d of docs) {
    const set = entryVocab.get(d.entryId) ?? new Set<string>();
    for (const t of (units.get(d.id) ?? []).flat()) if (!t.startsWith('~')) set.add(t);
    entryVocab.set(d.entryId, set);
  }
  const entryDf = new Map<string, number>();
  for (const set of entryVocab.values()) for (const t of set) entryDf.set(t, (entryDf.get(t) ?? 0) + 1);

  const negated = new Map<string, Set<number>>();
  for (const d of docs) {
    const u = units.get(d.id) ?? [];
    const after = new Set(u.flatMap((unit, j) => (j + 1 < u.length && unit.some((v) => WITHOUT.has(v)) ? [j + 1] : [])));
    if (after.size) negated.set(d.id, after);
  }

  index = { ms, units, df, docs: docs.length, products, questionConcepts, topics, entryVocab, entryDf, negated };
  indexes.set(lang, index);
  return index;
}

const isKnown = (unit: Unit, index: LangIndex) => unit.some((v) => (index.df.get(v) ?? 0) > 0);

/**
 * "Without": the word after one in a wording is what that wording is without ("הצעת מחיר בלי ביקור בבית" is a quote
 * without a home visit). It doesn't cover a visitor's word unless the message negates something too ("כמה עולה
 * ביקור בבית?" asks what the visit costs, not how to do without it).
 */
const WITHOUT = new Set(['בלי', 'ללא', 'without', 'без', 'بدون', 'بلا']);
const NEGATION_WORDS = new Set([...WITHOUT, 'לא', 'אין', 'אל', 'no', 'not', 'dont', 'doesnt', 'didnt', 'wont', 'cant', 'never', 'не', 'нет', 'ни', 'لا', 'ما', 'مش', 'مو', 'بلاش', 'غير']);
const negates = (message: string) => splitWords(normalizeText(message)).some((w) => NEGATION_WORDS.has(w) || stems(w).some((s) => NEGATION_WORDS.has(s)));

// ---- partial matches (prefix or typo) ------------------------------------------------
// MiniSearch finds candidates with prefix and typo matching; which of those count (partly) for the
// confidence is decided here, by the owner's rules: a typo only in a word of 5+ letters, a prefix only
// of 4+ letters, and never towards a place or price word ("haifo" is not Haifa, "prize" is not price,
// "מזגן" is not "זגג", "לא" is not "לאה"). Those match only exactly or through synonyms.ts.
const PREFIX_MIN = 4;
const TYPO_MIN = 5;
const EXACT_ONLY_CONCEPT = /^~(city-.*|region|village|far|nationwide|location|price|cheap|discount|per-meter|quote)$/;
// (not "#word": a word that lost its concept in a phrase, see textUnits)
const plain = (v: string) => !/^[~=#]/.test(v);
const exactOnlyCache = new Map<string, boolean>();
function exactOnly(word: string): boolean {
  let v = exactOnlyCache.get(word);
  if (v === undefined) {
    const t = processTerm(word);
    v = [t ?? []].flat().some((c) => EXACT_ONLY_CONCEPT.test(c));
    exactOnlyCache.set(word, v);
  }
  return v;
}
/** Edit distance of two words, or `max + 1` once it is over `max`. */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}
const HEBREW = /^[\u0590-\u05FF]+$/;
/** Hebrew verb forms one letter apart at the edges: a tense prefix ("תכתבו"/"כתבו") or an ending ("כתבו"/"כתב"). */
function verbForm(a: string, b: string): boolean {
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  if (long.length !== short.length + 1 || short.length < 4) return false;
  return (long.endsWith(short) && /^[תינא]/.test(long)) || (long.startsWith(short) && /[והית]$/.test(long));
}
/** One letter (not the first, and not the vowel letters ו/י, which tell real words apart) typed for another: "אחריוד". */
function oneLetterTypo(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let at = -1;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) continue;
    if (at >= 0) return false;
    at = i;
  }
  return at > 0 && !/[וי]/.test(a[at] + b[at]);
}
/**
 * Whether visitor word `q` partly matches knowledge base word `d`: `d` starts with it, or they are one typo
 * apart (two from 8 letters). Hebrew uses the stricter typo rule of tokenize.ts (oneTypoApart: a letter typed
 * for a look- or sound-alike, or two letters swapped): a missing or extra letter there is usually another
 * real word ("מעולה"/"מעלה", "ביטוח"/"בטוח").
 */
function partialMatch(q: string, d: string): boolean {
  if (q === d || exactOnly(d)) return false;
  if (q.length >= PREFIX_MIN && d.length > q.length && d.startsWith(q)) return true;
  if (q.length < TYPO_MIN) return false;
  if (HEBREW.test(q) && HEBREW.test(d)) return oneTypoApart(q, d) || oneLetterTypo(q, d) || verbForm(q, d);
  const max = q.length >= 8 ? 2 : 1;
  return editDistance(q, d, max) <= max;
}

/**
 * The visitor's words as units; a Hebrew word the knowledge base doesn't know also gets the concepts
 * of a dictionary word one typo away ("אחריוט" → ~warranty, see typoConcepts), so it counts as that word.
 * Only the word itself and the word without one glued prefix letter ("באחריוט"): stripping more
 * letters as prefixes and then guessing a typo is two guesses ("ובוטיקים" is not "ו" + "ב" + "ותיקים").
 */
function queryUnits(message: string, index: LangIndex): Unit[] {
  return textUnits(message).map((unit) => {
    if (isKnown(unit, index)) return unit;
    const [word] = unit;
    const typos = new Set([word, ...stems(word).filter((s) => s.length === word.length - 1)].flatMap(typoConcepts));
    return typos.size ? [...unit, ...[...typos].filter((c) => !unit.includes(c))] : unit;
  });
}

// A number or a size ("120", "2x1", "120х80"): the knowledge base never has the visitor's exact measurements
const SIZE = /^\d+([x×х*]\d+)*$/u;

function unitWeight(unit: Unit, index: LangIndex, p: ScoreParams): number {
  // A number or size the knowledge base doesn't use neither helps nor hurts a match ("כמה עולה זכוכית 120x80?")
  if (SIZE.test(unit[0]) && !isKnown(unit, index)) return 0;
  let idf = 0;
  for (const v of unit) idf = Math.max(idf, Math.log(1 + index.docs / ((index.df.get(v) ?? 0) + 1)));
  if (!isKnown(unit, index)) idf *= p.unknownWeight;
  return unit.some((v) => v.startsWith('~city-')) ? idf * p.cityWeight : idf;
}

/**
 * See Match.entryUncovered: words weigh by how few entries use them; numbers, sizes and concept-only units don't count,
 * and those for which `explained` is true count as found.
 */
function entryUncovered(units: Unit[], entryId: string, index: LangIndex, explained?: (unit: Unit) => boolean): number {
  const vocab = index.entryVocab.get(entryId);
  if (!vocab) return 1;
  const entries = index.entryVocab.size;
  let total = 0;
  let uncovered = 0;
  for (const unit of units) {
    const words = unit.filter((t) => !t.startsWith('~'));
    if (!words.length || SIZE.test(unit[0])) continue;
    const weight = Math.log(1 + entries / (Math.min(...words.map((t) => index.entryDf.get(t) ?? 0)) + 1));
    total += weight;
    if (!words.some((t) => vocab.has(t)) && !explained?.(unit)) uncovered += weight;
  }
  return total ? uncovered / total : 0;
}

/** Knowledge base entries for a message, best first, with confidence (0–1). */
export function searchKnowledge(message: string, lang: SupportedLocale, limit = 5, p: ScoreParams = DEFAULT_SCORE): Match[] {
  const index = getIndex(lang);
  const units = queryUnits(message, index);
  if (!units.length) return [];
  const queryTerms = new Set(units.flat());
  const weights = units.map((u) => unitWeight(u, index, p));
  const known = units.map((u) => isKnown(u, index));
  const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;

  type Best = {
    confidence: number; second: number; score: number; unknownShare: number; uncoveredShare: number; wordsCovered: boolean; docCoverage: number;
    via: Match['via']; coveredConcepts: Set<string>; docConcepts: Set<string>; named: Set<string>;
  };
  const best = new Map<string, Best>();
  const queryPlain = units.map((u) => u.filter(plain));
  const queryNegates = negates(message);
  for (const r of index.ms.search(message).slice(0, CANDIDATES)) {
    const docUnits = index.units.get(r.id) ?? [];
    // (a word the wording is "without" covers nothing, unless the message negates too: see WITHOUT)
    const without = queryNegates ? undefined : index.negated.get(r.id);
    const docTerms = new Set(docUnits.filter((_, j) => !without?.has(j)).flat());
    if (r.kind === 'a') for (const c of WEAK_CONCEPTS) docTerms.delete(c);
    // Which visitor words and which words of this wording match only partly (see partialMatch)
    const partQuery = new Set<number>();
    const partDoc = new Set<number>();
    units.forEach((u, i) => {
      if (u.some((v) => docTerms.has(v))) return;
      docUnits.forEach((du, j) => {
        if (without?.has(j)) return;
        if (du.some((d) => plain(d) && queryPlain[i].some((q) => partialMatch(q, d)))) {
          partQuery.add(i);
          partDoc.add(j);
        }
      });
    });

    let covered = 0;
    let unknown = 0;
    let uncovered = 0;
    let wordsCovered = false;
    units.forEach((u, i) => {
      if (u.some((v) => docTerms.has(v))) {
        covered += weights[i];
        if (u.some((v) => plain(v) && docTerms.has(v)) || u.some((v) => v.startsWith('=') && docTerms.has(v))) wordsCovered = true;
      } else if (partQuery.has(i)) {
        covered += weights[i] * p.partial;
        wordsCovered = true;
      } else {
        uncovered += weights[i];
        if (!known[i]) unknown += weights[i];
      }
    });
    const unknownShare = unknown / totalWeight;
    const uncoveredShare = uncovered / totalWeight;
    const queryCoverage = covered / totalWeight;

    let confidence: number;
    let docCoverage = 0;
    if (r.kind === 'a') {
      confidence = queryCoverage * p.answerDoc;
    } else {
      let docCovered = 0;
      docUnits.forEach((u, j) => {
        if (without?.has(j)) return;
        if (u.some((v) => queryTerms.has(v))) docCovered += 1;
        else if (partDoc.has(j)) docCovered += p.partial;
      });
      docCoverage = docUnits.length ? docCovered / docUnits.length : 0;
      confidence = p.queryShare * queryCoverage + (1 - p.queryShare) * docCoverage;
    }

    const entryId = r.entryId as string;
    const prev = best.get(entryId);
    const doc = () => ({
      via: r.kind as Match['via'],
      coveredConcepts: new Set([...queryTerms].filter((t) => t.startsWith('~') && docTerms.has(t))),
      docConcepts: new Set([...docTerms].filter((t) => t.startsWith('~'))),
      // Products the message names with a typo ("railng", "מקלחנים") count as named
      named: new Set([...partDoc].flatMap((j) => docUnits[j].filter((t) => PRODUCT_CONCEPTS.has(t)))),
    });
    if (!prev) best.set(entryId, { confidence, second: 0, score: r.score, unknownShare, uncoveredShare, wordsCovered, docCoverage, ...doc() });
    else if (confidence > prev.confidence) best.set(entryId, { confidence, second: prev.confidence, score: Math.max(prev.score, r.score), unknownShare, uncoveredShare, wordsCovered, docCoverage, ...doc() });
    else prev.second = Math.max(prev.second, confidence);
  }

  const entryById = new Map(APPROVED_ENTRIES.map((e) => [e.id, e]));
  return [...best.entries()]
    .map(([id, v]) => {
      let confidence = v.confidence + p.support * v.second;
      const products = index.products.get(id);
      const otherProduct = !!products?.size && ![...products].some((c) => queryTerms.has(c) || v.named.has(c));
      if (otherProduct) confidence *= p.productMismatch;
      if (entryById.get(id)?.official) confidence += p.officialBonus;
      // Normalized by the highest possible score, not capped — so near-perfect matches still rank
      return { ...v, id, otherProduct, offProduct: otherProduct && v.unknownShare >= p.offProductUnknown, confidence: confidence / (1 + p.support + p.officialBonus) };
    })
    .sort((a, b) => b.confidence - a.confidence || b.score - a.score)
    .slice(0, limit)
    .map((v) => ({
      entry: entryById.get(v.id)!,
      confidence: Math.round(v.confidence * 1000) / 1000,
      offProduct: v.offProduct,
      otherProduct: v.otherProduct,
      unknownShare: v.unknownShare,
      uncoveredShare: v.uncoveredShare,
      docCoverage: v.docCoverage,
      wordsCovered: v.wordsCovered,
      via: v.via,
      coveredConcepts: v.coveredConcepts,
      docConcepts: v.docConcepts,
      topics: index.topics.get(v.id) ?? new Set<string>(),
      products: index.products.get(v.id) ?? new Set<string>(),
      questionConcepts: index.questionConcepts.get(v.id) ?? new Set<string>(),
      entryUncovered: entryUncovered(units, v.id, index),
    }));
}

/**
 * Match.entryUncovered of one entry, whether or not the search finds it (1 for an entry that isn't approved); words for
 * which `explained` is true count as found in it.
 */
export function entryUncoveredShare(message: string, lang: SupportedLocale, entryId: string, explained?: (unit: Unit) => boolean): number {
  const index = getIndex(lang);
  return entryUncovered(queryUnits(message, index), entryId, index, explained);
}

/** Share of a message's weight in words the knowledge base never uses (0–1; typos of dictionary words count as unknown, numbers and sizes not at all). */
export function unknownShare(message: string, lang: SupportedLocale, p: ScoreParams = DEFAULT_SCORE): number {
  const index = getIndex(lang);
  const units = textUnits(message);
  const weights = units.map((u) => unitWeight(u, index, p));
  const total = weights.reduce((a, b) => a + b, 0);
  return total ? units.reduce((sum, u, i) => sum + (isKnown(u, index) ? 0 : weights[i]), 0) / total : 0;
}

/** Concept tokens (~price, ~city-haifa…) in a message; with a language, also those of typos ("אחריוט" → ~warranty, see queryUnits). */
export function messageConcepts(message: string, lang?: SupportedLocale): Set<string> {
  const units = lang ? queryUnits(message, getIndex(lang)) : textUnits(message);
  return new Set(units.flat().filter((t) => t.startsWith('~')));
}

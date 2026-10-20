/**
 * Language-aware term processing shared by the browser index (instant results),
 * the server retrieval and the answer engine (src/lib/answer-engine). Plain
 * functions only — safe to import anywhere.
 *
 * - normalizeText(): case, niqqud, Arabic letter variants, "ё" (normalize.ts)
 * - Hebrew one-letter prefixes (ב/ה/ו/כ/ל/מ/ש) and Arabic prefixes (ال/و/ب/ل/ف)
 *   are glued to words ("בחיפה", "والزجاج"): both the word and its stem are indexed.
 * - Synonyms (synonyms.ts): a word or phrase in a synonym group also yields the
 *   group's concept token ("~price"), on both the indexed text and the query.
 */
import { normalizeText, splitWords } from './normalize';
import { SYNONYM_GROUPS } from './synonyms';

const HE_PREFIX = /^[בהוכלמש]/;
const AR_PREFIXES = ['وال', 'بال', 'لل', 'فال', 'كال', 'عال', 'ال', 'و', 'ب', 'ل', 'ف']; // عال = على + ال ("عالدرج")

const STOP_WORDS = new Set([
  // en
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'is', 'are', 'do', 'does', 'you', 'your', 'i', 'my', 'me', 'what', 'how', 'it', 'with', 'can', 'much', 'which',
  // he
  'של', 'את', 'על', 'עם', 'זה', 'מה', 'איך', 'כמה', 'האם', 'אני', 'אתם', 'יש', 'לי', 'גם', 'או', 'איזה', 'איזו', 'אילו',
  // ar
  'في', 'من', 'على', 'هل', 'ما', 'كم', 'كيف', 'عن', 'مع', 'او', 'هذا', 'اي', 'ماذا',
  // ru
  'и', 'в', 'на', 'с', 'по', 'для', 'что', 'как', 'сколько', 'ли', 'вы', 'это', 'или', 'у', 'какой', 'какая', 'какое', 'какие', 'какую', 'каким',
]);

/** Concept token for a synonym group. */
export const conceptToken = (concept: string) => `~${concept}`;

// Synonym lookups, built once from the normalized dictionary; phrases are indexed by their first word
const wordConcepts = new Map<string, string[]>();
const phrasesByFirstWord = new Map<string, { words: string[]; concept: string }[]>();
for (const group of SYNONYM_GROUPS) {
  for (const term of group.terms) {
    const words = splitWords(normalizeText(term));
    if (words.length === 1) {
      const list = wordConcepts.get(words[0]) ?? [];
      if (!list.includes(group.concept)) list.push(group.concept);
      wordConcepts.set(words[0], list);
    } else if (words.length > 1) {
      const list = phrasesByFirstWord.get(words[0]) ?? [];
      list.push({ words, concept: group.concept });
      phrasesByFirstWord.set(words[0], list);
    }
  }
}

// Words whose first letter only looks like a Hebrew prefix ("מעולה" is not מ + "עולה" = costs)
const HE_NO_PREFIX = new Set(['מעולה', 'מעולים', 'מעולות', 'מעלות', 'מעלה', 'משקל', 'משקוף', 'שקוף', 'מבצע', 'הלו', 'שלום']);

/** Word stems: the word without a glued Hebrew (one or two letters) or Arabic prefix. */
export function stems(t: string): string[] {
  const out: string[] = [];
  if (/^[\u0590-\u05FF]/.test(t) && t.length > 3 && HE_PREFIX.test(t) && !HE_NO_PREFIX.has(t)) {
    out.push(t.slice(1));
    if (t.length > 4 && HE_PREFIX.test(t.slice(1))) out.push(t.slice(2)); // "ובחיפה"
  } else if (/^[\u0600-\u06FF]/.test(t)) {
    const prefix = AR_PREFIXES.find((p) => t.startsWith(p) && t.length - p.length >= 2);
    if (prefix) out.push(t.slice(prefix.length));
  }
  return out;
}

// Light ending stemming, so inflected forms meet: "душевую"/"душевой", "railings"/"railing",
// "מעקות"/"מעקה", "مرايات"/"مراية". Longest ending first; the stem keeps at least `min` letters.
const ENDINGS: { script: RegExp; endings: string[]; min: number }[] = [
  { script: /^[a-z]/, endings: ['ings', 'ing', 'ies', 'es', 'ed', 's'], min: 3 },
  {
    script: /^[\u0400-\u04FF]/,
    endings: ['иями', 'ями', 'ами', 'ого', 'его', 'ому', 'ему', 'ыми', 'ими', 'иях', 'ах', 'ях', 'ов', 'ев', 'ей', 'ой', 'ий', 'ый', 'ая', 'яя', 'ое', 'ее', 'ые', 'ие', 'ую', 'юю', 'ом', 'ем', 'ам', 'ям', 'ы', 'и', 'а', 'я', 'о', 'е', 'у', 'ю', 'ь'],
    min: 4,
  },
  { script: /^[\u0590-\u05FF]/, endings: ['יות', 'ים', 'ות', 'ית', 'ה'], min: 3 },
  { script: /^[\u0600-\u06FF]/, endings: ['ات', 'ين', 'ون', 'ها', 'هم', 'كم', 'نا', 'ه', 'ي'], min: 3 },
];

// Hebrew final letters in their normal form, so a stem like "שולחנ" (שולחנות) meets "שולחן"
const HE_FINALS: Record<string, string> = { ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' };
const unfinal = (s: string) => s.replace(/[ךםןףץ]$/, (c) => HE_FINALS[c]);

/**
 * The word's ending stems; a word without an ending is its own stem, so "rail"
 * meets "railing" and "מקלחון" meets "מקלחונים". English gets two candidates
 * where one ending has two readings: "prices" → pric/price, "measuring" → measur/measure.
 */
function endingStems(word: string): string[] {
  for (const { script, endings, min } of ENDINGS) {
    if (!script.test(word)) continue;
    // "glass" is not glas + s
    const ending = endings.find((e) => word.endsWith(e) && word.length - e.length >= min && !(e === 's' && word.endsWith('ss')));
    if (!ending) return [unfinal(word)];
    const stem = word.slice(0, -ending.length);
    // Hebrew: masculine stems (מקלחון/מקלחונים) and feminine ones (מעקה/מעקות) are kept
    // apart, so "תקן" (standard) doesn't meet "התקנה" (installation); "ות" can be either
    if (ending === 'ים') return [unfinal(stem)];
    if (ending === 'ה') return [`${stem}ה`];
    if (ending === 'ית') return [`${stem}ית`];
    if (ending === 'ות') return [unfinal(stem), `${stem}ה`];
    if (ending === 'יות') return [unfinal(stem), `${stem}ית`];
    if (ending === 'ies') return [`${stem}y`];
    if (ending === 'es') return [stem, word.slice(0, -1)];
    if (ending === 'ing' || ending === 'ings' || ending === 'ed') return [stem, `${stem}e`];
    return [unfinal(stem)];
  }
  return [];
}

/**
 * Splits text into normalized words, plus a concept token for every multi-word
 * synonym phrase it contains ("כמה עולה", "сколько стоит", "how much").
 */
export function tokenize(text: string): string[] {
  const words = splitWords(normalizeText(text));
  const tokens = [...words];
  if (phrasesByFirstWord.size) {
    const forms = words.map((w) => [w, ...stems(w)]);
    const found = new Set<string>();
    forms.forEach((first, i) => {
      for (const f of first) {
        for (const { words: phrase, concept } of phrasesByFirstWord.get(f) ?? []) {
          if (found.has(concept) || i + phrase.length > forms.length) continue;
          if (phrase.every((p, j) => j === 0 || forms[i + j].includes(p))) found.add(concept);
        }
      }
    });
    for (const concept of found) tokens.push(conceptToken(concept));
  }
  return tokens;
}

// processTerm is pure and called for every word of every indexed text: remember results
const termCache = new Map<string, string | string[] | null>();
const TERM_CACHE_MAX = 50_000;

/** Normalizes one token; may return several terms (word, stems, synonym concepts). */
export function processTerm(term: string): string | string[] | null {
  const cached = termCache.get(term);
  if (cached !== undefined) return Array.isArray(cached) ? [...cached] : cached;
  const result = computeTerm(term);
  if (termCache.size < TERM_CACHE_MAX) termCache.set(term, result);
  return Array.isArray(result) ? [...result] : result;
}

function computeTerm(term: string): string | string[] | null {
  if (term.startsWith('~') || term.startsWith('=')) return term; // concept/stem token
  const t = normalizeText(term);
  if (t.length < 2 || STOP_WORDS.has(t)) return null;

  const terms = [t, ...stems(t)];
  // Ending stems of the word and its prefix-less forms ("=" tokens only match each other)
  for (const form of [...terms]) {
    for (const stem of endingStems(form)) if (!terms.includes(`=${stem}`)) terms.push(`=${stem}`);
  }
  for (const form of [...terms]) {
    for (const concept of wordConcepts.get(form) ?? []) {
      const token = conceptToken(concept);
      if (!terms.includes(token)) terms.push(token);
    }
  }
  return terms.length === 1 ? terms[0] : terms;
}

/** MiniSearch options shared by client and server. */
export const SEARCH_OPTIONS = {
  fields: ['title', 'keywords', 'text'],
  storeFields: ['title', 'snippet', 'url', 'type'],
  tokenize,
  processTerm,
  searchOptions: {
    boost: { title: 3, keywords: 2 },
    // Concept and stem tokens match exactly; words also by prefix and with small typos
    prefix: (term: string) => !/^[~=]/.test(term),
    fuzzy: (term: string) => (/^[~=]/.test(term) ? false : 0.2),
    combineWith: 'OR' as const,
  },
};

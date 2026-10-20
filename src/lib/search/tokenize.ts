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
  // he chat filler ("אחי, שאלה לגבי…", "וואלה פשוט…"): words the knowledge base never needs
  'אחי', 'אחותי', 'בעצם', 'וואלה', 'ואלה', 'ואללה', 'רציתי', 'לשאול', 'שאלה', 'לגבי', 'בנוגע', 'פשוט',
  'כאילו', 'סתם', 'ממש', 'נו', 'היי', 'אהלן', 'יאללה', 'סבבה', 'אוקיי', 'אוקי',
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

// Single dictionary words by length, for typo lookups (typoConcepts)
const dictionaryByLength = new Map<number, string[]>();
for (const word of wordConcepts.keys()) {
  if (!/^\p{L}+$/u.test(word)) continue;
  const list = dictionaryByLength.get(word.length) ?? [];
  list.push(word);
  dictionaryByLength.set(word.length, list);
}

// Hebrew letters typed for one another: same sound (ט/ת, כ/ח, ק/כ, א/ע, ס/ש, ב/ו), or look-alikes (ו/י, ן/ם, ה/ח)
const HE_CONFUSABLE = new Set(['טת', 'כח', 'קכ', 'אע', 'סש', 'בו', 'וי', 'ןם', 'הח', 'אה'].flatMap((p) => [p, p[1] + p[0]]));

/**
 * How two words are one typo apart: a letter missing or extra ("indel"), two neighbours swapped,
 * a Hebrew letter typed for one that sounds or looks like it ("similar"), or another letter changed ("sub").
 */
function typoKind(a: string, b: string): 'indel' | 'swap' | 'similar' | 'sub' | null {
  if (a === b || Math.abs(a.length - b.length) > 1) return null;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  if (a.length !== b.length) {
    const [long, short] = a.length > b.length ? [a, b] : [b, a];
    return long.slice(i + 1) === short.slice(i) ? 'indel' : null;
  }
  if (a.slice(i + 1) === b.slice(i + 1)) return HE_CONFUSABLE.has(a[i] + b[i]) ? 'similar' : 'sub';
  return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2) ? 'swap' : null;
}

// typoConcepts is pure and scans the dictionary: remember results
const typoCache = new Map<string, string[]>();
const TYPO_CACHE_MAX = 10_000;

/**
 * Synonym concepts of a dictionary word one typo away ("אחריוט" → warranty, "מחסומת" → tempered,
 * "מעקא" → railing), for a word the knowledge base doesn't know. Hebrew words are too often one
 * letter from another real word ("קונים"/"קטנים", "מוכרים"/"מוארים", "טיסה"/"טרסה"), so from 5
 * letters: a missing, extra or swapped letter, or one that sounds or looks alike; any other changed
 * letter only from 7; below 5 only the final א/ה slip. Nothing when the nearby words mean different things.
 */
export function typoConcepts(word: string): string[] {
  const cached = typoCache.get(word);
  if (cached) return [...cached];
  const result = computeTypoConcepts(word);
  if (typoCache.size < TYPO_CACHE_MAX) typoCache.set(word, result);
  return [...result];
}

function computeTypoConcepts(word: string): string[] {
  if (wordConcepts.has(word) || !/^\p{L}+$/u.test(word)) return [];
  const candidates: string[] = [];
  if (word.length >= 3 && /[אה]$/.test(word)) {
    const swapped = word.slice(0, -1) + (word.endsWith('א') ? 'ה' : 'א');
    if (wordConcepts.has(swapped)) candidates.push(swapped);
  }
  if (word.length >= 5) {
    for (const len of [word.length - 1, word.length, word.length + 1]) {
      for (const d of dictionaryByLength.get(len) ?? []) {
        const kind = typoKind(word, d);
        if (kind === 'indel' || kind === 'swap' || kind === 'similar' || (kind === 'sub' && word.length >= 7)) candidates.push(d);
      }
    }
  }
  const meanings = new Set(candidates.map((c) => wordConcepts.get(c)!.join(' ')));
  return meanings.size === 1 ? wordConcepts.get(candidates[0])!.map(conceptToken) : [];
}

// Words whose first letter only looks like a Hebrew prefix ("מעולה" is not מ + "עולה" = costs)
const HE_NO_PREFIX = new Set(['מעולה', 'מעולים', 'מעולות', 'מעלות', 'מעלה', 'משקל', 'משקוף', 'שקוף', 'מבצע', 'הלו', 'שלום']);

// Three glued Hebrew prefix letters ("כשהזכוכית", "ושבמקלחון", "ומהמראה"): only these combinations.
// Not ב/כ/ל + ה: they absorb "the" ("לבית"), so in "שבהתקנה" the ה belongs to the word
const HE_PREFIX_3 = /^(וכש|כשה|ושה|ושב|ושל|ושמ|ושכ|ומה|שמה)/;

/** Word stems: the word without a glued Hebrew (one to three letters) or Arabic prefix. */
export function stems(t: string): string[] {
  const out: string[] = [];
  if (/^[\u0590-\u05FF]/.test(t) && t.length > 3 && HE_PREFIX.test(t) && !HE_NO_PREFIX.has(t)) {
    out.push(t.slice(1));
    if (t.length > 4 && HE_PREFIX.test(t.slice(1))) out.push(t.slice(2)); // "ובחיפה"
    if (t.length > 5 && HE_PREFIX_3.test(t)) out.push(t.slice(3)); // "כשהזכוכית"
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

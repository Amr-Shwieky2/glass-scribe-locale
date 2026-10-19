/**
 * Language-aware term processing shared by the browser index (instant results)
 * and the server retrieval used to ground AI answers. Plain functions only —
 * safe to import anywhere.
 */

// Hebrew one-letter prefixes (ב/ה/ו/כ/ל/מ/ש) and Arabic prefixes (ال/و/ب/ل/ف) are
// glued to words ("בחיפה", "والزجاج"); index/search both the word and its stem.
const HE_PREFIX = /^[בהוכלמש]/;
const AR_PREFIXES = ['وال', 'بال', 'لل', 'فال', 'كال', 'ال', 'و', 'ب', 'ل', 'ف'];

const STOP_WORDS = new Set([
  // en
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'is', 'are', 'do', 'does', 'you', 'your', 'i', 'my', 'me', 'what', 'how', 'it', 'with', 'can', 'much', 'which',
  // he
  'של', 'את', 'על', 'עם', 'זה', 'מה', 'איך', 'כמה', 'האם', 'אני', 'אתם', 'יש', 'לי', 'גם', 'או', 'איזה', 'איזו', 'אילו',
  // ar
  'في', 'من', 'على', 'هل', 'ما', 'كم', 'كيف', 'عن', 'مع', 'أو', 'هذا', 'أي', 'ماذا',
  // ru
  'и', 'в', 'на', 'с', 'по', 'для', 'что', 'как', 'сколько', 'ли', 'вы', 'это', 'или', 'у', 'какой', 'какая', 'какое', 'какие', 'какую', 'каким',
]);

/** Normalizes one token; may return several terms (word + stem). */
export function processTerm(term: string): string | string[] | null {
  const t = term
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\u0591-\u05C7]/g, '') // Hebrew niqqud
    .replace(/[\u064B-\u065F\u0670]/g, '') // Arabic diacritics
    .replace(/["'\u05F3\u05F4]/g, ''); // quotes, geresh, gershayim
  if (t.length < 2 || STOP_WORDS.has(t)) return null;

  const terms = [t];
  if (/^[\u0590-\u05FF]/.test(t) && t.length > 3 && HE_PREFIX.test(t)) {
    terms.push(t.slice(1));
    if (t.length > 4 && HE_PREFIX.test(t.slice(1))) terms.push(t.slice(2)); // "ובחיפה"
  } else if (/^[\u0600-\u06FF]/.test(t)) {
    const prefix = AR_PREFIXES.find((p) => t.startsWith(p) && t.length - p.length >= 2);
    if (prefix) terms.push(t.slice(prefix.length));
  }
  return terms.length === 1 ? terms[0] : terms;
}

/** MiniSearch options shared by client and server. */
export const SEARCH_OPTIONS = {
  fields: ['title', 'keywords', 'text'],
  storeFields: ['title', 'snippet', 'url', 'type'],
  processTerm,
  searchOptions: {
    boost: { title: 3, keywords: 2 },
    prefix: true,
    fuzzy: 0.2,
    combineWith: 'OR' as const,
  },
};

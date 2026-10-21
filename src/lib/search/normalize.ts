/**
 * Text normalization shared by the search index, the synonym dictionary and the
 * answer engine, so a visitor's spelling variants meet the same terms:
 * case, Hebrew niqqud and gershayim, Arabic diacritics and letter variants
 * (أ/إ/آ→ا, ة→ه, ى→ي), Russian "ё", Arabic-Indic digits. Plain functions only.
 */

const ARABIC_INDIC_DIGITS = /[\u0660-\u0669\u06F0-\u06F9]/g;

export function normalizeText(text: string): string {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u0591-\u05C7]/g, '') // Hebrew niqqud and cantillation
    .replace(/["'`´‘’\u05F3\u05F4]/g, '') // quotes, geresh, gershayim (מ"מ → ממ, צ'אט → צאט)
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '') // Arabic diacritics and tatweel
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ё/g, 'е')
    .replace(ARABIC_INDIC_DIGITS, (d) => String((d.charCodeAt(0) & 0xf) % 10));
}

// A number glued to its unit ("8ממ", "10мм", "12mm") is two words, as when written apart ("8 מ"מ").
// Latin only for units: Arabizi spells letters with digits ("3ard", "2adesh").
const NUMBER_UNIT = /^(\d+)(\p{Script=Hebrew}+|\p{Script=Cyrillic}+|\p{Script=Arabic}+|mm|cm|m|mtr|kg)$/u;

/** Words of already-normalized text (letters and digits; everything else separates words). */
export function splitWords(normalized: string): string[] {
  return normalized.split(/[^\p{L}\p{N}]+/u).filter(Boolean).flatMap((w) => {
    const unit = NUMBER_UNIT.exec(w);
    return unit ? [unit[1], unit[2]] : [w];
  });
}

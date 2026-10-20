/**
 * Removes personal details before any text leaves our server (free-tier AI) or
 * is stored (unanswered questions): phone numbers (in any digits — Arabic-Indic
 * and full-width too), e-mail addresses, and the name after "my name is…" or an
 * introduction ("I'm Dana", "אני דנה, …", "انا احمد من حيفا") in our 4 languages.
 */
import { normalizeText } from '@/lib/search/normalize';
import { processTerm, stems, tokenize } from '@/lib/search/tokenize';

const ARABIC_INDIC_DIGITS = /[\u0660-\u0669\u06F0-\u06F9]/g;
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
/** Digits with spaces, dashes, dots, slashes or brackets between them (not "×", "x" or letters: "90×190", "10 mm"). */
const DIGIT_RUN = /\+?\d(?:[\s\-\u2010-\u2015().\/]*\d)*/g;
const MIN_PHONE_DIGITS = 7;
const NAME_AFTER = [
  /\b(my name is|my name's|name:)\s+[^\s,.!?;:]+(?:\s+[^\s,.!?;:]+)?/gi,
  /(שמי|קוראים לי|השם שלי הוא|השם שלי)\s+[^\s,.!?;:]+(?:\s+[^\s,.!?;:]+)?/g,
  /(اسمي|انا اسمي|إسمي)\s+[^\s,.!?;:،]+(?:\s+[^\s,.!?;:،]+)?/g,
  /(меня зовут|моё имя|мое имя)\s+[^\s,.!?;:]+(?:\s+[^\s,.!?;:]+)?/gi,
];

/** A run of 7+ digits is a phone number — unless it is a size like "900/1900" (slashes only, no group starting with 0, at most 8 digits). */
function isPhone(run: string): boolean {
  const digits = run.replace(/\D/g, '');
  if (digits.length < MIN_PHONE_DIGITS) return false;
  const size = /^\d+(\/\d+)+$/.test(run) && run.split('/').every((g) => g.length <= 4 && !g.startsWith('0')) && digits.length <= 8;
  return !size;
}

// Introductions: "I'm Dana", "Это Дима" (a capitalized name), "אני דנה, …", "انا احمد من حيفا" (no capitals:
// only at the start of a sentence or after a greeting, and only before a comma, dash, period, the end or "from").
const EN_INTRO = /(?<![\p{L}'’])([Ii]['’]?m|[Ii] am|[Tt]his is|[Ii]t['’]?s|[Cc]all me)\s+(\p{Lu}[\p{L}'’-]*)((?:\s+\p{Lu}[\p{L}'’-]*)?)/gu;
const RU_INTRO = /(?<!\p{L})([Яя]|[Ээ]то|[Мм]еня)\s+([А-ЯЁ][а-яё]+(?:-[А-ЯЁ][а-яё]+)?)((?:\s+[А-ЯЁ][а-яё]+)?)/gu;
const HE_WORD = "[\\u05D0-\\u05EA][\\u05D0-\\u05EA'\"\\u05F3\\u05F4]*";
const HE_INTRO = new RegExp(
  `(^|[.,!?;:\\n\\-–—]\\s*|(?:היי|הי|שלום|אהלן|הלו|בוקר טוב|ערב טוב)[,!]?\\s+)(אני|זה|כאן)\\s+(${HE_WORD})((?:\\s+${HE_WORD})?)(?=\\s*(?:[,.\\-–—]|$)|\\s+מ)`,
  'g',
);
const AR_WORD = '[\\u0621-\\u063A\\u0641-\\u064A][\\u0621-\\u063A\\u0641-\\u065F\\u0670]*';
const AR_INTRO = new RegExp(
  `(^|[.,!?;:\\n،؛؟\\-–—]\\s*|(?:مرحبا|مرحبه|مرحبة|هلا|[اأ]هلا|السلام عليكم|سلام|مساء الخير|مسا الخير|صباح الخير|هاي)[,!،]?\\s+)([أاإ]نا|معك|معاك|ال[اإ]سم)[:]?\\s+(${AR_WORD})((?:\\s+${AR_WORD})?)(?=\\s*(?:[,.،\\-–—]|$)|\\s+من(?![\\u0621-\\u064A]))`,
  'g',
);

// Common words after an introduction that are not names ("I am looking…", "אני רוצה…", "انا بدي…", "Я хочу…"). Normalized spelling.
const NOT_NAMES = new Set([
  // en (capitalized by habit)
  'not', 'just', 'also', 'here', 'back', 'sorry', 'ok', 'okay', 'the', 'a', 'an', 'in', 'at', 'from', 'looking', 'interested',
  'israeli', 'english', 'hebrew', 'arabic', 'russian', 'jewish', 'arab', 'israel', 'monday', 'tuesday', 'wednesday', 'thursday',
  'friday', 'saturday', 'sunday', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october',
  'november', 'december', 'tel', 'aviv', 'haifa', 'jerusalem',
  // he
  'רוצה', 'רוצים', 'צריך', 'צריכה', 'צריכים', 'מחפש', 'מחפשת', 'מחפשים', 'מעוניין', 'מעוניינת', 'מעוניינים', 'מתעניין', 'מתעניינת',
  'גר', 'גרה', 'גרים', 'לא', 'כבר', 'רק', 'פה', 'שם', 'כאן', 'גם', 'שואל', 'שואלת', 'חושב', 'חושבת', 'יכול', 'יכולה', 'יכולים',
  'אשמח', 'נשמח', 'בונה', 'בונים', 'משפץ', 'משפצת', 'משפצים', 'מתכנן', 'מתכננת', 'מתכננים', 'קבלן', 'קבלנית', 'אדריכל', 'אדריכלית',
  'מעצב', 'מעצבת', 'מהנדס', 'מהנדסת', 'מבקש', 'מבקשת', 'מדבר', 'מדברת', 'פונה', 'פונים', 'כותב', 'כותבת', 'מתקשר', 'מתקשרת',
  'מנסה', 'עובד', 'עובדת', 'הולך', 'הולכת', 'מקווה', 'בטוח', 'בטוחה', 'מרוצה', 'שמח', 'שמחה', 'בסדר', 'טוב', 'טובה', 'יקר', 'זול',
  'חשוב', 'דחוף', 'נכון', 'מעולה', 'מצוין', 'מושלם', 'יפה', 'ברור', 'עכשיו', 'היום', 'מחר', 'אתמול', 'ממש', 'עדיין', 'שוב',
  'בדיוק', 'בעל', 'בעלת', 'זה', 'זו', 'זאת', 'הוא', 'היא', 'אני', 'כל', 'הכל', 'מה', 'איך', 'למה', 'כמה', 'איפה', 'מתי', 'אחד', 'אחת',
  'תודה', 'שלום', 'פשוט', 'אמור', 'אמורה', 'עוד', 'שוקל', 'שוקלת', 'מחכה',
  // ar
  'بدي', 'بدنا', 'عايز', 'عايزه', 'عاوز', 'محتاج', 'محتاجه', 'ساكن', 'ساكنه', 'بسال', 'اسال', 'مهتم', 'مهتمه', 'حاب', 'حابه',
  'حابب', 'بفكر', 'من', 'في', 'مش', 'ما', 'لا', 'كمان', 'هون', 'هنا', 'بدور', 'بحكي', 'عم', 'رح', 'راح', 'بس', 'بشتغل', 'مقاول',
  'مهندس', 'مهندسه', 'صاحب', 'جاي', 'مستعجل', 'عندي', 'ابغي', 'اريد', 'نريد', 'اسمي', 'متاكد', 'مبسوط', 'زبون', 'بعرف', 'شايف',
  'كنت', 'برضو', 'كتير', 'منيح', 'تمام', 'اكيد', 'هلا', 'هلق', 'هسا', 'بخير', 'الحمدلله', 'شكرا',
  // ru (capitalized by habit)
  'хочу', 'ищу', 'живу', 'нужна', 'нужно', 'нужен', 'не', 'из', 'тоже', 'сам', 'сама', 'интересует', 'интересуюсь', 'хотел',
  'хотела', 'думаю', 'здесь', 'тут', 'там', 'уже', 'снова', 'просто', 'очень', 'строю', 'делаю', 'планирую', 'подрядчик',
  'архитектор', 'хайфа', 'израиль', 'иерусалим', 'тель',
]);

const concepts = (text: string) => tokenize(text).flatMap((t) => [processTerm(t) ?? []].flat()).filter((t) => t.startsWith('~'));

/** A common word or a word of our domain ("מקלחון", "glass", "مقاول") — not a name. A city alone can be a name (אילת, כרמל). */
function notName(word: string): boolean {
  const w = normalizeText(word);
  return NOT_NAMES.has(w) || concepts(w).some((c) => !c.startsWith('~city-'));
}

/** "From/in <city>": a city after a glued prefix letter ("מחיפה", "מתל אביב", "بحيفا") — not a name. */
function fromCity(first: string, second: string): boolean {
  const w = normalizeText(first);
  const forms = new Set([...stems(w), ...(/^[ובלמכשהوبلف]/.test(w) ? [w.slice(1)] : [])]);
  const next = normalizeText(second.trim());
  return [...forms].some((f) => [f, `${f} ${next}`].some((t) => concepts(t).some((c) => c.startsWith('~city-'))));
}

/** "Intro Name" → "Intro [name]"; a second word that is not a name is kept. */
function capitalizedIntro(m: string, intro: string, first: string, second: string): string {
  if (notName(first)) return m;
  return second && notName(second.trim()) ? `${intro} [name]${second}` : `${intro} [name]`;
}

/** Hebrew / Arabic: `second` is kept when it is "from…" (מ…, Hebrew) or not a name — then only if "from…" follows. */
function lowercaseIntro(m: string, pre: string, intro: string, first: string, second: string): string {
  if (notName(first) || fromCity(first, second)) return m;
  const next = second.trim();
  if (!next || (!notName(next) && !next.startsWith('מ'))) return `${pre}${intro} [name]`;
  return next.startsWith('מ') ? `${pre}${intro} [name]${second}` : m;
}

export function scrubPersonalData(text: string): string {
  let out = text.normalize('NFKC').replace(ARABIC_INDIC_DIGITS, (d) => String((d.charCodeAt(0) & 0xf) % 10));
  out = out.replace(EMAIL, '[email]').replace(DIGIT_RUN, (run) => (isPhone(run) ? '[phone]' : run));
  for (const re of NAME_AFTER) out = out.replace(re, (_, intro: string) => `${intro} [name]`);
  out = out.replace(EN_INTRO, capitalizedIntro).replace(RU_INTRO, capitalizedIntro);
  return out.replace(HE_INTRO, lowercaseIntro).replace(AR_INTRO, lowercaseIntro);
}

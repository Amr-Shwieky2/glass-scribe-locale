/**
 * Checks a free-tier AI answer before a visitor sees it. The AI is never the
 * source of facts: an answer is dropped (and Layer 1/3 used instead) if it
 *  - is empty or too long,
 *  - is not in the visitor's language,
 *  - has a number, price, duration or percentage that is not in the content we
 *    gave it or in the visitor's own messages,
 *  - links anywhere but our own pages, our WhatsApp or our phone, or writes a
 *    URL, domain or e-mail address as text,
 *  - doesn't talk about the question and the content we retrieved for it (off-topic).
 */
import type { SupportedLocale } from '@/data/types';
import { CONTACT_INFO } from '@/data/contact';
import { normalizeText } from '@/lib/search/normalize';
import { textUnits, type Unit } from '@/lib/answer-engine/kb-index';

const MAX_CHARS = 1200;
const MAX_WORDS = 170;

// Number words (2 and up — "one" is too common to mean a figure; see ONE_WORDS).
// Normalized spelling (normalizeText): Arabic ة→ه, أ/إ→ا, ى→ي; Russian ё→е.
// Left out because they are also common other words: Hebrew "שנים" (years; see
// numbersIn), Arabic "ميه" (also water), "ست" (also madam), "تمن"/"ثمن" (price),
// Russian "пол" (floor).
const NUMBER_WORDS = new Map<string, number>(Object.entries({
  // en
  two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
  seventy: 70, eighty: 80, ninety: 90, hundred: 100, hundreds: 100, thousand: 1000, thousands: 1000, million: 1e6,
  twice: 2, double: 2, dozen: 12, half: 0.5,
  // he (also with one glued prefix letter: "בשלושה", "כשבועיים", "וחצי")
  שניים: 2, שתיים: 2, שתים: 2, שתי: 2, שני: 2, שלוש: 3, שלושה: 3, שלושת: 3, ארבע: 4, ארבעה: 4, ארבעת: 4, חמש: 5, חמישה: 5, חמשת: 5,
  שש: 6, שישה: 6, ששת: 6, שבע: 7, שבעה: 7, שבעת: 7, שמונה: 8, שמונת: 8, תשע: 9, תשעה: 9, תשעת: 9, עשר: 10, עשרה: 10, עשרת: 10,
  עשרים: 20, שלושים: 30, ארבעים: 40, חמישים: 50, שישים: 60, שבעים: 70, שמונים: 80, תשעים: 90,
  מאה: 100, מאות: 100, מאתיים: 200, אלף: 1000, אלפים: 1000, אלפי: 1000, אלפיים: 2000, מיליון: 1e6,
  שנתיים: 2, יומיים: 2, שבועיים: 2, חודשיים: 2, שעתיים: 2, חצי: 0.5,
  // ar
  اثنين: 2, اثنان: 2, اثنتين: 2, ثنتين: 2, اثنا: 2, اثني: 2, اتنين: 2, ثلاث: 3, ثلاثه: 3, تلات: 3, تلاته: 3, اربع: 4, اربعه: 4,
  خمس: 5, خمسه: 5, سته: 6, سبع: 7, سبعه: 7, ثمان: 8, ثماني: 8, ثمانيه: 8, تمانيه: 8, تسع: 9, تسعه: 9, عشر: 10, عشره: 10,
  حداعش: 11, احداعش: 11, اطناعش: 12, اتناعش: 12, تلتعش: 13, اربعتعش: 14, خمستعش: 15, ستعش: 16, سبعتعش: 17, تمنتعش: 18, تسعتعش: 19,
  عشرين: 20, عشرون: 20, ثلاثين: 30, ثلاثون: 30, تلاتين: 30, اربعين: 40, اربعون: 40, خمسين: 50, خمسون: 50, ستين: 60, ستون: 60,
  سبعين: 70, سبعون: 70, ثمانين: 80, ثمانون: 80, تمانين: 80, تسعين: 90, تسعون: 90,
  ميتين: 200, ميتان: 200, ثلاثميه: 300, ثلاثمايه: 300, تلتميه: 300, اربعميه: 400, اربعمايه: 400, خمسميه: 500, خمسمايه: 500,
  ستميه: 600, ستمايه: 600, سبعميه: 700, سبعمايه: 700, ثمانميه: 800, ثمانمايه: 800, تمنميه: 800, تسعميه: 900, تسعمايه: 900,
  الف: 1000, الاف: 1000, الفين: 2000, الفان: 2000, مليون: 1e6,
  سنتين: 2, سنتان: 2, يومين: 2, اسبوعين: 2, شهرين: 2, ساعتين: 2, دقيقتين: 2, نص: 0.5, نصف: 0.5,
  // ru
  два: 2, две: 2, двух: 2, двум: 2, двое: 2, три: 3, трех: 3, трем: 3, трое: 3, четыре: 4, четырех: 4, пять: 5, пяти: 5,
  шесть: 6, шести: 6, семь: 7, семи: 7, восемь: 8, восьми: 8, девять: 9, девяти: 9, десять: 10, десяти: 10,
  одиннадцать: 11, одиннадцати: 11, двенадцать: 12, двенадцати: 12, тринадцать: 13, тринадцати: 13, четырнадцать: 14, четырнадцати: 14,
  пятнадцать: 15, пятнадцати: 15, шестнадцать: 16, шестнадцати: 16, семнадцать: 17, семнадцати: 17, восемнадцать: 18, восемнадцати: 18,
  девятнадцать: 19, девятнадцати: 19, двадцать: 20, двадцати: 20, тридцать: 30, тридцати: 30, сорок: 40, сорока: 40,
  пятьдесят: 50, пятидесяти: 50, шестьдесят: 60, шестидесяти: 60, семьдесят: 70, семидесяти: 70, восемьдесят: 80, восьмидесяти: 80,
  девяносто: 90, девяноста: 90, сто: 100, ста: 100, двести: 200, двухсот: 200, триста: 300, трехсот: 300, четыреста: 400,
  пятьсот: 500, пятисот: 500, шестьсот: 600, семьсот: 700, восемьсот: 800, девятьсот: 900,
  тысяча: 1000, тысячи: 1000, тысяч: 1000, тысячу: 1000, миллион: 1e6,
  полтора: 1.5, полторы: 1.5, полутора: 1.5, половина: 0.5, половину: 0.5, половины: 0.5, полчаса: 0.5, полгода: 0.5, полдня: 0.5, полметра: 0.5,
}));
/** "One": a figure only next to another number word ("one hundred", "עשרים ואחת", "احد عشر", "двадцать один"). */
const ONE_WORDS = new Set(['one', 'אחד', 'אחת', 'واحد', 'واحده', 'احد', 'احدي', 'один', 'одна', 'одно']);
/** The 10 of a Hebrew/Arabic teen ("שלוש עשרה" = 13, "خمسه عشر" = 15). */
const TEEN_TENS = new Set(['עשר', 'עשרה', 'عشر', 'عشره']);
const HE_PREFIX = /^[ובלמכשה]/;
/** Number words whose prefixed forms mean something else ("השני" = the other, "משני" = secondary). */
const HE_NO_PREFIX = new Set(['שני']);
// Place names that contain a number word (Beer Sheva = "well of seven", Kiryat Shmona = "town of eight")
const PLACE_NAMES = /באר שבע|תל שבע|קריית שמונה|קרית שמונה|קריית ארבע|קרית ארבע|بير السبع/g;

interface NumToken {
  /** Its value(s): a figure, or a number word. */
  values: number[];
  /** A "one" word (ONE_WORDS). */
  one: boolean;
  digits: boolean;
  word: string;
  /** Glued to "and" (ו / و), or to another Hebrew prefix letter. */
  prefix: '' | 'and' | 'other';
  start: number;
  end: number;
}

/** "3,000" / "1,500.00" → one number; "1.5" / "1,5" → 1.5; "15.11.2026" / "60,80,90" → each part. */
function digitValues(raw: string): number[] {
  if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(raw)) return [Number(raw.replace(/,/g, ''))];
  const whole = Number(raw.replace(',', '.'));
  return Number.isFinite(whole) ? [whole] : raw.split(/[.,]/).map(Number);
}

function toToken(raw: string, start: number): NumToken {
  const token: NumToken = { values: [], one: false, digits: /^\d/.test(raw), word: raw, prefix: '', start, end: start + raw.length };
  if (token.digits) {
    token.values = digitValues(raw);
    return token;
  }
  const lookup = (w: string) => NUMBER_WORDS.has(w) || ONE_WORDS.has(w);
  let word = raw;
  if (!lookup(word)) {
    const rest = raw.slice(1);
    if (HE_PREFIX.test(raw) && rest.length >= 2 && !HE_NO_PREFIX.has(rest) && lookup(rest)) {
      word = rest;
      token.prefix = raw[0] === 'ו' ? 'and' : 'other';
    } else if (raw.startsWith('و') && rest.length >= 2 && lookup(rest)) {
      word = rest; // "وعشرين", "ونص"
      token.prefix = 'and';
    }
  }
  token.word = word;
  token.one = ONE_WORDS.has(word);
  const value = NUMBER_WORDS.get(word);
  if (value !== undefined) token.values = [value];
  return token;
}

const isUnit = (v: number) => Number.isInteger(v) && v >= 1 && v <= 9;
const isTens = (v: number) => v >= 20 && v <= 90 && v % 10 === 0;

/**
 * The value of a number followed by a number word, if together they are one
 * number: "twenty five", "עשרים וחמש", "خمسه وعشرين", "שלוש עשרה", "three hundred", "5 אלף".
 * `gap` is the text between them (only spaces or a hyphen).
 */
function combined(a: NumToken, b: NumToken, gap: string): number | undefined {
  const x = a.one ? 1 : a.values.length === 1 ? a.values[0] : undefined;
  const y = b.one ? 1 : b.values.length === 1 ? b.values[0] : undefined;
  if (x === undefined || y === undefined || b.digits) return undefined;
  if (Number.isInteger(x) && x >= 1 && x < 1000 && (y === 100 || y === 1000) && b.prefix === '') return x * y;
  if (a.digits) return undefined;
  if (isTens(x) && isUnit(y) && b.prefix !== 'other') return x + y;
  if (isUnit(x) && isTens(y) && b.prefix === 'and') return x + y;
  if (isUnit(x) && TEEN_TENS.has(b.word) && b.prefix === '' && !/[-–]/.test(gap)) return x + 10; // "חמש-עשר" is 5–10
  return undefined;
}

/** Number of tokens from `i` that say "and a half" (וחצי, ونص, "and a half", "с половиной"); 0 if none. */
function halfAt(tokens: NumToken[], i: number, glued: (a: NumToken, b: NumToken) => boolean): number {
  const t = tokens[i];
  if (!t || !glued(tokens[i - 1], t)) return 0;
  if (t.prefix === 'and' && t.values[0] === 0.5) return 1;
  // The next n words, if nothing but spaces is between them
  const words = (n: number) => {
    const run = tokens.slice(i, i + n);
    return run.every((x, j) => j === 0 || glued(run[j - 1], x)) ? run.map((x) => x.word).join(' ') : '';
  };
  if (words(3) === 'and a half') return 3;
  if (words(2) === 'с половиной') return 2;
  return 0;
}

/**
 * Every figure in a text, as plain numbers ("3,000" → 3000, "1-2" → 1 and 2,
 * "שנתיים" → 2, "twenty five" → 25, "שנה וחצי" → 1.5).
 */
export function numbersIn(text: string): Set<number> {
  const norm = normalizeText(text)
    .replace(PLACE_NAMES, ' ')
    .replace(/(?<!\p{L})שנים(?= עשרה?(?!\p{L}))/gu, 'שניים'); // "שנים עשר" = 12 ("שנים" alone is "years")
  const tokens = [...norm.matchAll(/\d+(?:[.,]\d+)*|\p{L}+/gu)].map((m) => toToken(m[0], m.index));
  const gap = (a: NumToken, b: NumToken) => norm.slice(a.end, b.start);
  const glued = (a: NumToken, b: NumToken) => /^[\s\-–]*$/.test(gap(a, b));
  const out = new Set<number>();
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const half = t.values.length <= 1 ? halfAt(tokens, i + 1, glued) : 0;
    if (half) {
      // "2 וחצי" → 2.5; "שנה וחצי", "an hour and a half", "one and a half" → 1.5
      out.add((t.values.length === 1 ? t.values[0] : 1) + 0.5);
      i += half;
      continue;
    }
    const next = tokens[i + 1];
    const value = next && glued(t, next) ? combined(t, next, gap(t, next)) : undefined;
    if (value !== undefined) {
      out.add(value);
      i++;
      continue;
    }
    for (const v of t.values) out.add(v);
  }
  return out;
}

const SCRIPTS: Record<SupportedLocale, RegExp> = {
  he: /[֐-׿]/g,
  ar: /[؀-ۿ]/g,
  ru: /[Ѐ-ӿ]/g,
  en: /[a-z]/gi,
};

function inLanguage(text: string, lang: SupportedLocale): boolean {
  const letters = (text.match(/\p{L}/gu) ?? []).length;
  if (!letters) return false;
  const own = (text.match(SCRIPTS[lang]) ?? []).length;
  return own / letters >= (lang === 'en' ? 0.85 : 0.6);
}

const OUR_WHATSAPP = CONTACT_INFO.whatsapp.replace(/\D/g, '');
const OUR_PHONE = CONTACT_INFO.phoneIntl.replace(/\D/g, '');

/** A Markdown link — one pattern for checking links and for removing them from the text, so none is skipped. */
const LINK = /\[([^\]]*)\]\(([^)]*)\)/g;
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const DOMAIN = /\b[\w-]+\.(?:com|co\.il|net|org|io|info|biz|ru|il)\b/i;

function linkAllowed(url: string, allowedUrls: Set<string>): boolean {
  if (url.startsWith('/')) return allowedUrls.has(url.split('#')[0]);
  const wa = /^https:\/\/wa\.me\/(\d+)/.exec(url);
  if (wa) return wa[1] === OUR_WHATSAPP;
  const tel = /^tel:(\+?[\d-]+)$/.exec(url);
  if (tel) return tel[1].replace(/\D/g, '') === OUR_PHONE;
  return false;
}

/** Synonym concepts that don't make a text about glass or our services (as GENERIC_CONCEPTS in answer-engine/index.ts). */
const GENERIC_CONCEPTS = /^~(time|human|contact|repair|clean|city-.*)$/;
/** Place concepts: they match words, but don't make a text about our domain either (a weather report has "the coast", "the north"). */
const PLACE_CONCEPTS = /^~(region|village|far|nationwide|location|coastal)$/;
/** Share of an answer's content words that must appear in the question or the content retrieved for it. */
const MIN_GROUNDED = 0.25;

// Words that say nothing about the topic (on top of the tokenizer's stop words and words under 3 letters):
// pronouns, prepositions, auxiliaries and politeness. Normalized spelling.
const FILLER = new Set([
  // en
  'the', 'and', 'but', 'for', 'from', 'with', 'about', 'into', 'over', 'under', 'between', 'after', 'before', 'than', 'then', 'also',
  'just', 'only', 'very', 'really', 'more', 'most', 'less', 'some', 'any', 'all', 'each', 'every', 'both', 'other', 'such', 'same',
  'too', 'not', 'yes', 'when', 'where', 'why', 'who', 'whom', 'whose', 'what', 'which', 'how', 'that', 'this', 'these', 'those',
  'there', 'here', 'its', 'are', 'was', 'were', 'been', 'being', 'does', 'did', 'done', 'have', 'has', 'had', 'having', 'can',
  'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'our', 'ours', 'you', 'your', 'yours', 'they', 'their',
  'them', 'she', 'his', 'her', 'him', 'one', 'ones', 'get', 'got', 'let', 'lets', 'make', 'made', 'like', 'well', 'sure', 'glad',
  'happy', 'help', 'please', 'thanks', 'thank', 'hello', 'hey', 'great', 'good', 'still', 'even', 'much', 'many', 'way', 'thing',
  'things', 'etc', 'via', 'per', 'out', 'off', 'yet', 'ever', 'never', 'always', 'often', 'usually', 'because', 'while', 'though',
  'although', 'whether', 'within', 'without', 'through', 'during', 'including', 'theres', 'heres', 'dont', 'doesnt', 'cant', 'wont',
  'youre', 'ill', 'ive', 'youll', 'youd', 'weve', 'wed', 'theyre', 'need', 'want', 'know', 'see', 'feel',
  // he
  'של', 'את', 'על', 'עם', 'זה', 'זו', 'זאת', 'מה', 'איך', 'כמה', 'האם', 'אני', 'אתה', 'אתם', 'אתן', 'אנחנו', 'הוא', 'היא', 'הם', 'הן',
  'יש', 'אין', 'לי', 'לך', 'לו', 'לה', 'לנו', 'לכם', 'להם', 'שלי', 'שלך', 'שלו', 'שלה', 'שלנו', 'שלכם', 'שלהם', 'אותו', 'אותה',
  'אותם', 'אותך', 'אתכם', 'אותנו', 'גם', 'או', 'אבל', 'כי', 'אם', 'רק', 'כל', 'הכל', 'עוד', 'כבר', 'מאוד', 'יותר', 'פחות', 'כך',
  'ככה', 'כן', 'לא', 'אז', 'שם', 'פה', 'כאן', 'הזה', 'הזאת', 'הזו', 'האלה', 'אלה', 'אלו', 'היה', 'הייתה', 'היתה', 'יהיה', 'תהיה',
  'להיות', 'אפשר', 'ניתן', 'צריך', 'רוצה', 'בשמחה', 'נשמח', 'שמח', 'שמחים', 'תודה', 'בבקשה', 'שלום', 'היי', 'כמו', 'בין', 'לפי',
  'אחרי', 'לפני', 'תוך', 'עד', 'אצל', 'אצלנו', 'בלי', 'ללא', 'כדי', 'לגבי', 'בערך', 'כאשר', 'אשר', 'מאשר', 'איזה', 'איזו', 'אילו',
  'למה', 'מתי', 'איפה', 'בנוסף', 'כמובן', 'למשל', 'כלומר', 'ממש', 'בדרך', 'כלל', 'בכל', 'מכל', 'הרבה', 'קצת', 'עכשיו', 'תמיד',
  'יכול', 'יכולה', 'יכולים', 'נוכל', 'תוכלו', 'מוזמן', 'מוזמנת', 'מוזמנים', 'לעזור', 'עליו', 'עליה', 'עליהם', 'בו', 'בה', 'בהם',
  'ממנו', 'ממנה', 'מהם', 'שזה', 'שיש', 'שאין', 'וגם', 'ולא', 'ואם',
  // ar
  'في', 'من', 'علي', 'الي', 'عن', 'مع', 'او', 'ام', 'ثم', 'هل', 'ما', 'ماذا', 'كم', 'كيف', 'اين', 'وين', 'متي', 'ليش', 'لماذا', 'هذا',
  'هذه', 'هاد', 'هاي', 'هيك', 'ذلك', 'تلك', 'الذي', 'التي', 'اللي', 'الذين', 'ان', 'انه', 'انها', 'اذا', 'لو', 'لما', 'لان', 'لكن',
  'بس', 'كمان', 'ايضا', 'كل', 'بعض', 'غير', 'بعد', 'قبل', 'عند', 'عندنا', 'عنا', 'لدينا', 'احنا', 'نحن', 'انت', 'انتم', 'انتو',
  'هو', 'هي', 'هم', 'انا', 'لنا', 'لكم', 'لك', 'له', 'لها', 'لهم', 'منا', 'منكم', 'فيه', 'فيها', 'فيهم', 'عليه', 'عليها', 'لا', 'نعم',
  'مش', 'مو', 'ليس', 'يعني', 'جدا', 'كتير', 'كثير', 'اكثر', 'اقل', 'شو', 'ايش', 'اي', 'يمكن', 'ممكن', 'بنقدر', 'نقدر', 'يمكنك',
  'تقدر', 'بتقدر', 'بدك', 'بدكم', 'يسعدنا', 'بكل', 'سرور', 'شكرا', 'اهلا', 'مرحبا', 'تفضل', 'تفضلوا', 'طبعا', 'مثلا', 'حسب', 'خلال',
  'بدون', 'حتي', 'مثل', 'زي', 'هناك', 'هنا', 'هون', 'كان', 'كانت', 'يكون', 'تكون', 'رح', 'راح', 'عم', 'قد', 'لقد', 'نساعدك',
  // ru
  'для', 'что', 'чтобы', 'как', 'вы', 'вас', 'вам', 'ваш', 'ваша', 'ваше', 'ваши', 'вашего', 'вашей', 'это', 'этот', 'эта', 'эти',
  'этого', 'этой', 'или', 'мы', 'нас', 'нам', 'наш', 'наша', 'наше', 'наши', 'нашей', 'нашего', 'нет', 'при', 'без', 'под', 'над',
  'так', 'также', 'тоже', 'уже', 'только', 'если', 'все', 'весь', 'вся', 'его', 'ее', 'их', 'она', 'они', 'оно', 'ему', 'ей', 'есть',
  'быть', 'будет', 'будут', 'может', 'можно', 'нужно', 'надо', 'очень', 'более', 'менее', 'где', 'там', 'тут', 'здесь', 'который',
  'которые', 'которая', 'которое', 'которых', 'свой', 'свои', 'своих', 'кто', 'чем', 'чего', 'рады', 'рад', 'рада', 'помочь',
  'пожалуйста', 'спасибо', 'здравствуйте', 'конечно', 'например', 'еще', 'всегда', 'обычно', 'просто', 'много',
]);

/** The words of an answer that carry its topic: no stop words, words under 3 letters or bare numbers. */
function contentUnits(text: string): Unit[] {
  return textUnits(text).filter((u) => u[0].length >= 3 && !/^[~=]/.test(u[0]) && !/^\d+$/.test(u[0]) && !u.some((v) => FILLER.has(v)));
}

/**
 * On topic: at least MIN_GROUNDED of the answer's content words (or their stems
 * and synonyms) appear in the question or the retrieved content, and they share
 * a concept of our domain (~shower, ~price, ~install… — not just ~time, a city or the coast).
 */
function onTopic(answer: string, grounding: string): boolean {
  const known = new Set(textUnits(grounding).flat().filter((t) => !GENERIC_CONCEPTS.test(t)));
  const units = contentUnits(answer);
  if (!units.length) return false;
  const grounded = units.filter((u) => u.some((v) => known.has(v))).length;
  const domain = textUnits(answer).some((u) => u.some((v) => v.startsWith('~') && !PLACE_CONCEPTS.test(v) && known.has(v)));
  return domain && grounded / units.length >= MIN_GROUNDED;
}

export type Verdict = { ok: true; text: string } | { ok: false; reason: string };

export function verifyAnswer(
  answer: string,
  opts: {
    lang: SupportedLocale;
    /** Where the answer's numbers may come from: the system prompt, the content we gave it, the visitor's messages. */
    allowedText: string;
    /** What the answer must be about: the visitor's question and the retrieved knowledge/site content. */
    groundingText: string;
    allowedUrls: Set<string>;
  },
): Verdict {
  const text = answer.trim();
  if (!text) return { ok: false, reason: 'empty' };
  if (text.length > MAX_CHARS || text.split(/\s+/).length > MAX_WORDS) return { ok: false, reason: 'too-long' };

  for (const [, , url] of text.matchAll(LINK)) {
    if (!linkAllowed(url, opts.allowedUrls)) return { ok: false, reason: 'link' };
  }
  const plain = text.replace(LINK, '$1');
  if (plain.includes('](')) return { ok: false, reason: 'link' }; // a link the pattern didn't take ("[a [b]](…)")
  if (/https?:\/\/|www\.|\b(?:mailto|tel):/i.test(plain)) return { ok: false, reason: 'raw-url' };
  if (EMAIL.test(plain) || DOMAIN.test(plain)) return { ok: false, reason: 'raw-contact' };
  if (!inLanguage(plain, opts.lang)) return { ok: false, reason: 'language' };

  const allowedNumbers = numbersIn(opts.allowedText);
  for (const n of numbersIn(plain)) {
    if (!allowedNumbers.has(n)) return { ok: false, reason: `number ${n}` };
  }

  if (!onTopic(plain, opts.groundingText)) return { ok: false, reason: 'off-topic' };

  return { ok: true, text };
}

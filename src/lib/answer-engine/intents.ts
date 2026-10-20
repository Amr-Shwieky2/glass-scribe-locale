/**
 * Rule-based intents (keyword lists per language) for the answer engine:
 * greeting, thanks, complaint, quote request, price, opening hours, contact /
 * human, city coverage and out-of-scope. Lists are in normalized form
 * (normalize.ts): lowercase, no niqqud/gershayim, Arabic ا/ه/ي, Russian е for ё.
 */
import { LOCATIONS, LOCATION_SLUGS, type LocationKey } from '@/data/locations';
import { normalizeText, splitWords } from '@/lib/search/normalize';
import { stems } from '@/lib/search/tokenize';

export interface MessageText {
  /** Normalized words. */
  words: string[];
  /** " word word word " — for phrase checks. */
  padded: string;
  /** Each word with its Hebrew/Arabic prefix-less stems. */
  forms: Set<string>;
}

export function readMessage(message: string): MessageText {
  const words = splitWords(normalizeText(message));
  const forms = new Set<string>();
  for (const w of words) {
    forms.add(w);
    for (const s of stems(w)) forms.add(s);
  }
  return { words, padded: ` ${words.join(' ')} `, forms };
}

/** Normalized list: single words match a word (or its stem); phrases match word sequences. */
const list = (...items: string[]) => items.map((i) => splitWords(normalizeText(i)).join(' '));

function has(m: MessageText, items: string[]): boolean {
  return items.some((i) => (i.includes(' ') ? m.padded.includes(` ${i} `) : m.forms.has(i)));
}

/** Words that start with one of these (Russian/English inflections: "перезвон…", "complain…"). */
function hasPrefix(m: MessageText, prefixes: string[]): boolean {
  return m.words.some((w) => prefixes.some((p) => w.startsWith(p)));
}

const GREETING = list(
  'hi', 'hello', 'hey', 'hiya', 'shalom', 'good morning', 'good evening', 'good afternoon',
  'שלום', 'היי', 'הי', 'הלו', 'אהלן', 'בוקר טוב', 'ערב טוב', 'צהריים טובים',
  'مرحبا', 'مرحبه', 'مرحبتين', 'اهلا', 'اهلين', 'هلا', 'هاي', 'سلام', 'السلام عليكم', 'صباح الخير', 'مساء الخير',
  'привет', 'здравствуйте', 'здрасте', 'здравствуй', 'добрый день', 'добрый вечер', 'доброе утро', 'шалом',
);
const THANKS = list(
  'thanks', 'thank you', 'thx', 'ty', 'appreciate it', 'bye', 'goodbye', 'great thanks', 'ok thanks',
  'תודה', 'תודה רבה', 'תנקס', 'ביי', 'להתראות', 'יום טוב',
  'شكرا', 'شكرا جزيلا', 'مشكور', 'مشكورين', 'يعطيك العافيه', 'مع السلامه', 'باي', 'تسلم',
  'спасибо', 'благодарю', 'спс', 'пока', 'до свидания',
);
const COMPLAINT = list(
  'complaint', 'complain', 'terrible service', 'worst service', 'very disappointed', 'disappointed with', 'not happy with', 'unhappy with', 'scam', 'unprofessional', 'rude',
  'תלונה', 'להתלונן', 'מאוכזב', 'מאוכזבת', 'לא מרוצה', 'לא מרוצים', 'שירות גרוע', 'שירות נוראי', 'זלזול', 'לא מקצועי', 'חוצפה',
  'شكوى', 'اشتكي', 'بدي اشتكي', 'مش راضي', 'مش راضيه', 'غير راضي', 'خدمه سيئه', 'خدمه زفت', 'زعلان منكم',
  'жалоба', 'пожаловаться', 'недоволен', 'недовольна', 'ужасный сервис', 'ужасное обслуживание', 'разочарован', 'разочарована', 'обман', 'непрофессионально', 'хамство',
);
// Unambiguous quote words ("offer", "عرض" = width, "предложение" alone are not)
const QUOTE_NOUNS = list(
  'quote', 'quotation', 'estimate', 'price offer', 'offer price', '3ard si3r',
  'הצעת מחיר', 'הצעות מחיר', 'הצעה', 'הצעת', 'הצעות', 'תמחור', // "הצעת"/"הצעות" alone also match "להצעת מחיר"
  'عرض سعر', 'عرض اسعار', 'عرض السعر', 'تسعيره', 'اوفر',
  'смета', 'смету', 'расчет', 'просчет', 'коммерческое предложение', 'предложение по цене',
);
// Clearly asking for something…
const REQUEST_VERBS = list(
  'want', 'would like', 'like to get', 'give me', 'send me', 'get me', 'i d like', 'id like', 'please send', 'interested in', 'book',
  'רוצה', 'רוצים', 'מבקש', 'מבקשת', 'אשמח', 'תשלחו', 'תנו לי', 'מעוניין', 'מעוניינת', 'בא לי', 'הייתי רוצה', 'לתאם', 'נתאם',
  'בואו נקבע', 'לקבוע מדידה', 'לקבוע ביקור', 'תקבעו', 'תקבעו לי', // not bare "נקבע"/"לקבוע": "ממה נקבע המחיר"
  'بدي', 'بدنا', 'اريد', 'نريد', 'ابغى', 'عايز', 'حاب', 'حابب', 'ابعتولي', 'ابعثولي', 'مهتم', 'bade', 'badi', 'bdi', 'badna',
  'хочу', 'хотим', 'пришлите', 'дайте', 'хотел бы', 'хотела бы', 'интересует', 'запишите', 'записаться', 'запишите меня',
  // "come and measure", "calculate it for me"
  'come measure', 'come and measure', 'приедьте', 'приезжайте', 'приедете', 'посчитайте',
);
// …or maybe only asking about it ("do I need a measurement?") — used only when no answer fits
const MAYBE_REQUEST_VERBS = list(
  'need', 'צריך', 'צריכה', 'צריכים', 'אפשר לקבל', 'ممكن', 'нужен', 'нужна', 'нужно', 'нужны', 'можно получить',
);
const CALLBACK = list(
  'call me', 'call me back', 'contact me', 'get back to me', 'have someone call', 'reach me',
  'תתקשרו', 'תתקשרו אליי', 'תתקשרו אלי', 'תחזרו אליי', 'תחזרו אלי', 'שיחזרו אליי', 'שיתקשרו אליי', 'תחזרו אלינו', 'חזרה טלפונית', 'יתקשר אליי', 'יתקשר אלי', 'שיתקשר אליי', 'יחזור אליי',
  'اتصلوا فيي', 'اتصلو فيي', 'اتصلوا علي', 'اتصلو علي', 'رنولي', 'رجعولي', 'تواصلوا معي', 'يتصل فيي', 'يتصلوا فيي', 'يتصل علي', 'يرن علي', 'حدا يتصل',
  'перезвоните', 'позвоните мне', 'свяжитесь со мной', 'наберите меня',
);
const PRICE = list(
  'price', 'prices', 'cost', 'costs', 'how much', 'pricing', 'rate', 'budget',
  'מחיר', 'מחירים', 'עולה', 'עולים', 'עלות', 'עלויות', 'כמה זה', 'כמה עולה', 'תקציב',
  'سعر', 'اسعار', 'تكلفه', 'كلفه', 'يكلف', 'بكم', 'قديش', 'قداش', 'ثمن',
  'цена', 'цены', 'стоимость', 'стоит', 'почем', 'прайс', 'сколько стоит', 'бюджет',
);
// Opening-hours phrases only — bare "hours", "שעות", "часы", "open" are also durations and product words
const HOURS = list(
  'opening hours', 'working hours', 'business hours', 'your hours', 'are you open', 'open today', 'open now', 'open tomorrow', 'open on', 'when do you open', 'when do you close', 'closed on', 'what time do you open', 'what time do you close',
  'שעות פעילות', 'שעות הפעילות', 'שעות פתיחה', 'שעות העבודה שלכם', 'אתם פתוחים', 'פתוחים היום', 'פתוחים עכשיו', 'פתוחים מחר', 'פתוחים בשישי', 'אתם סגורים', 'עד מתי אתם', 'עד איזה שעה', 'עד איזו שעה', 'מתי אתם פותחים', 'מתי אתם סוגרים',
  'ساعات العمل', 'ساعات الدوام', 'دوامكم', 'الدوام', 'فاتحين', 'مسكرين', 'لوقتيش', 'لايمتى', 'متى بتفتحوا', 'متى بتسكروا',
  'часы работы', 'открыты', 'закрыты', 'до скольки', 'график работы', 'режим работы', 'работаете сегодня', 'работаете сейчас', 'во сколько открываетесь', 'во сколько закрываетесь',
);
const CONTACT = list(
  'phone number', 'your number', 'your phone', 'email', 'e mail', 'whatsapp number', 'contact details', 'how to contact', 'talk to someone', 'talk to a human', 'human', 'representative', 'real person', 'agent',
  'מספר טלפון', 'מספר הטלפון', 'טלפון שלכם', 'מייל', 'אימייל', 'דואל', 'פרטי התקשרות', 'איך יוצרים קשר', 'נציג', 'נציגה', 'בן אדם', 'לדבר עם מישהו', 'מוקד',
  'رقمكم', 'رقمك', 'رقم التلفون', 'رقم تلفون', 'تلفونكم', 'تلفونك', 'رقم الهاتف', 'رقم الجوال', 'رقم الواتس', 'ايميل', 'كيف اتواصل', 'موظف', 'حدا احكي معه', 'بني ادم', 'ممثل',
  'номер телефона', 'ваш телефон', 'ваш номер', 'почта', 'емейл', 'имейл', 'как связаться', 'оператор', 'менеджер', 'поговорить с человеком', 'живой человек',
);
const CITY_QUESTION = list(
  'do you work in', 'do you come to', 'do you serve', 'do you install in', 'work in my area', 'in my city', 'my area', 'which areas', 'which cities',
  'באזור שלי', 'בעיר שלי', 'באיזה אזורים', 'באילו אזורים', 'איזה ערים', 'לאזור שלי', 'לאזור שלנו', 'באזור שלנו', 'לעיר שלי', 'לעיר שלנו', 'בעיר שלנו',
  'بتشتغلوا في', 'تشتغلوا في', 'بتيجوا على', 'بتوصلوا', 'تعملون في', 'منطقتي', 'مدينتي', 'وين بتشتغلوا',
  'вы работаете в', 'работаете в', 'приезжаете в', 'приедете в', 'мой город', 'мой район', 'в каких городах',
);
// Hebrew glues the preposition to the place ("אתם עובדים בירוחם?", "מגיעים לטמרה?")
const HE_CITY_QUESTION = /(^| )(אתם )?(עובדים|מגיעים|מתקינים|עושים עבודות|נותנים שירות) (גם )?[בל][א-ת]/;
// Only words that never belong in a glass question ("story", "code", "doctor", "car", "weather",
// "policy", "towers" can: a two-story house, building code, a clinic partition, a car showroom,
// weather-resistant railings, warranty policy, glass for towers). Not names or homographs
// (שיר is also a first name, شعر also means hair).
const OUT_OF_SCOPE = list(
  'poem', 'poetry', 'song lyrics', 'joke', 'weather forecast', 'weather tomorrow', 'weather today', 'whats the weather', 'how is the weather', 'hows the weather', 'recipe', 'football', 'soccer', 'basketball', 'movie', 'politics', 'election', 'bitcoin', 'crypto', 'homework', 'horoscope', 'girlfriend', 'boyfriend', 'translate', 'programming', 'essay', 'python', 'javascript', 'brake pads', 'brakes', 'married', 'chatbot', 'pharmacy',
  'שיר על', 'תכתוב שיר', 'כתוב לי שיר', 'תכתבי שיר', 'תכתוב לי שיר', 'תכתבי לי שיר', 'שיר יום הולדת', 'שיר אהבה', 'בדיחה', 'מה מזג האוויר', 'איך מזג האוויר', 'מזג האוויר מחר', 'מזג האוויר היום', 'תחזית', 'מתכון', 'כדורגל', 'כדורסל', 'פוליטיקה', 'בחירות', 'ביטקוין', 'שיעורי בית', 'הורוסקופ', 'תתרגם', 'תכנות', 'חיבור על', 'פייתון', 'בלמים', 'נשואים', 'צ׳אטבוט', 'צאטבוט', 'בית מרקחת',
  'قصيده', 'نكته', 'حاله الطقس', 'الطقس بكرا', 'الطقس اليوم', 'شو الطقس', 'كيف الطقس', 'كيفو الطقس', 'رح تشتي', 'وصفه', 'كوره', 'مباراه', 'انتخابات', 'بيتكوين', 'واجب مدرسي', 'برج الحظ', 'ترجم', 'برمجه', 'بايثون', 'فرامل', 'متجوز', 'متزوج', 'صيدليه', 'شات بوت',
  'стих', 'стихи', 'стихотворение', 'анекдот', 'шутка', 'какая погода', 'как погода', 'погода завтра', 'погода сегодня', 'прогноз погоды', 'рецепт', 'футбол', 'баскетбол', 'выборы', 'биткоин', 'домашнее задание', 'гороскоп', 'переведи', 'программирование', 'сочинение', 'питон', 'питоне', 'тормоза', 'тормозные', 'колодки', 'женаты', 'чат бот', 'чатбот', 'аптека', 'аптеку',
  // Job seekers
  'job application', 'apply for a job', 'looking for a job', 'job opening', 'job openings', 'vacancy', 'vacancies', 'are you hiring',
  'קורות חיים', 'מחפש עבודה', 'מחפשת עבודה', 'משרה פנויה', 'משרות פנויות',
  'سيره ذاتيه', 'بدور على شغل', 'بدي اشتغل عندكم', 'وظيفه شاغره', 'وظايف شاغره',
  'резюме', 'ищу работу', 'вакансия', 'вакансии', 'вакансию',
  // Glass we don't make: eyeglasses, car glass, phone screens. Not cups, bottles or jars ("will the shelf hold
  // wine glasses?"), nor bare "screen"/"מסך"/"شاشه" ("קיר מסך" is a curtain wall) or "שמשה" (a window pane)
  'eyeglasses', 'sunglasses', 'reading glasses', 'prescription glasses', 'contact lenses', 'windshield', 'windscreen', 'car window', 'car glass', 'auto glass', 'screen protector', 'phone screen',
  'משקפיים', 'משקפי שמש', 'עדשות', 'אופטיקה', 'שמשה קדמית', 'שמשה אחורית', 'שמשה לרכב', 'שמשה לאוטו', 'שמשה של אוטו', 'שמשה של האוטו', 'שמשה של הרכב', 'שמשת רכב', 'שמשת הרכב', 'שמשות לרכב', 'זכוכית לרכב', 'זכוכית לאוטו', 'זכוכית של האוטו', 'זכוכית של הרכב', 'חלון של האוטו', 'חלון של הרכב', 'מגן מסך', 'מגני מסך', 'מסך הטלפון', 'מסך של הטלפון', 'מסך טלפון', 'מסך הפלאפון', 'מסך של הפלאפון', 'מסך פלאפון',
  'نظارات', 'نظاره', 'نظارة شمس', 'عدسات', 'زجاج السياره', 'زجاج سياره', 'شباك السياره', 'قزاز السياره', 'واقي شاشه', 'شاشه التلفون', 'شاشه الجوال', 'شاشه الموبايل',
  'очки', 'очков', 'линзы', 'лобовое стекло', 'лобового стекла', 'стекло на машину', 'стекло для машины', 'автостекло', 'автостекла', 'стекло на телефон', 'стекло для телефона', 'экран телефона',
);
// A greeting or thanks may come with these and still be only small talk ("thanks a lot guys")
const FILLER = list(
  'there', 'guys', 'all', 'everyone', 'team', 'again', 'so', 'much', 'very', 'lot', 'lots', 'you', 'a', 'and',
  'לכם', 'רבה', 'לך', 'גם', 'שוב', 'מאוד', 'אחי', 'חברים', 'צוות', 'ענק',
  'جزيلا', 'كتير', 'الك', 'الكم', 'يا', 'شباب', 'اخي', 'حبيبي', 'كثير',
  'вам', 'всем', 'большое', 'огромное', 'ребята', 'друзья', 'еще', 'раз',
);
const AFFIRM = list(
  'yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'of course', 'please', 'yes please', 'sounds good', 'great', 'cool',
  'כן', 'בטח', 'בסדר', 'אוקיי', 'אוקי', 'יאללה', 'סבבה', 'ברור', 'נשמע טוב', 'כן בבקשה', 'מעולה',
  'نعم', 'اه', 'ايوه', 'ايوا', 'اكيد', 'تمام', 'ماشي', 'طيب', 'اوكي', 'يلا', 'منيح',
  'да', 'ага', 'конечно', 'хорошо', 'ок', 'окей', 'давайте', 'давай', 'отлично', 'да пожалуйста',
);
const NEGATE = list(
  'no', 'nope', 'not now', 'no thanks', 'no thank you', 'maybe later',
  'לא', 'לא תודה', 'לא כרגע', 'אולי אחר כך',
  'لا', 'لا شكرا', 'مش هلق', 'مش هلا', 'بعدين',
  'нет', 'не надо', 'не сейчас', 'нет спасибо', 'позже',
);
// The assistant's previous turn offered a quote or a measurement ("Would you like a free quote?")
const QUOTE_OFFER = list(
  'free quote', 'quote', 'measurement', 'הצעת מחיר', 'מדידה', 'عرض سعر', 'قياس', 'расчет', 'замер',
);

export type SmallTalk = 'greeting' | 'thanks';

/** Words of the message left after removing these phrases and filler words. */
function restAfter(m: MessageText, items: string[]): number {
  let text = m.padded;
  for (const i of [...items, ...FILLER].sort((a, b) => b.length - a.length)) text = text.split(` ${i} `).join(' ');
  return splitWords(text).length;
}

/** A message that is only a greeting or a thank-you ("thanks a lot guys") — not "hi, prices?". */
export function smallTalk(m: MessageText): SmallTalk | null {
  if (m.words.length === 0 || m.words.length > 6) return null;
  if (has(m, THANKS) && restAfter(m, THANKS) === 0) return 'thanks';
  if (has(m, GREETING) && restAfter(m, GREETING) === 0) return 'greeting';
  return null;
}

/** A bare yes/ok or no — a reply to the assistant's own question. */
export function acknowledgement(m: MessageText): 'yes' | 'no' | null {
  if (m.words.length === 0 || m.words.length > 4) return null;
  if (has(m, NEGATE) && restAfter(m, NEGATE) === 0) return 'no';
  if (has(m, AFFIRM) && restAfter(m, AFFIRM) === 0) return 'yes';
  return null;
}

/** The assistant's last turn asked whether the visitor wants a quote or a measurement. */
export const offeredQuote = (assistantText: string) => {
  const m = readMessage(assistantText);
  return /\?\s*$/.test(assistantText.trim()) && has(m, QUOTE_OFFER);
};

/** Strips a leading greeting ("hi, how much is…" → "how much is…"). */
export function withoutGreeting(message: string): string {
  return message.replace(/^\s*(hi|hello|hey|שלום|היי|הי|אהלן|مرحبا|اهلا|هلا|السلام عليكم|привет|здравствуйте|добрый день)[\s,.!:;-]+/i, '');
}

export const isComplaint = (m: MessageText) => has(m, COMPLAINT) || hasPrefix(m, ['complain', 'жалоб']);
const MEASUREMENT_VISIT = list(
  'measurement', 'measure', 'site visit', 'מדידה', 'מדידות', 'מודד', 'למדוד', 'قياس', 'قياسات', 'تقيسو', 'تقيسوا', 'تقيسولي', 'زياره',
  'замер', 'замеры', 'замерщик', 'замерить', 'измерить', 'посчитать', 'посчитайте', 'просчитать',
);

/**
 * Wants a quote, a measurement visit or to be contacted: "strong" ("I want a
 * quote for…", "call me back") starts the quote request at once; "maybe"
 * ("do I need a measurement?") only when no answer fits.
 */
export function quoteRequest(m: MessageText): 'strong' | 'maybe' | null {
  if (has(m, CALLBACK) || hasPrefix(m, ['перезвон'])) return 'strong';
  const about = has(m, QUOTE_NOUNS) || has(m, MEASUREMENT_VISIT);
  if (about && has(m, REQUEST_VERBS)) return 'strong';
  if (about && has(m, MAYBE_REQUEST_VERBS)) return 'maybe';
  return null;
}
export const isPriceQuestion = (m: MessageText) => has(m, PRICE);
export const isHoursQuestion = (m: MessageText) => has(m, HOURS);
export const isContactQuestion = (m: MessageText) => has(m, CONTACT);
export const isCityQuestion = (m: MessageText) => has(m, CITY_QUESTION) || HE_CITY_QUESTION.test(m.padded);
export const looksOutOfScope = (m: MessageText) => has(m, OUT_OF_SCOPE);

// ---- cities -----------------------------------------------------------------

const cityNames: { slug: LocationKey; name: string }[] = [];
for (const slug of LOCATION_SLUGS) {
  const loc = LOCATIONS[slug];
  // City names, and only multi-word neighbourhoods: single-word ones are often everyday
  // words or first names (רמות = levels, קדימה = forward, Omer, Hadar, Dora)
  const areas = [...loc.areas, ...loc.areasHe].filter((a) => a.trim().includes(' '));
  for (const name of [...Object.values(loc.name), ...areas]) {
    cityNames.push({ slug, name: splitWords(normalizeText(name)).join(' ') });
  }
}

/**
 * The city in a message: one of our city pages (by name in any language or a
 * listed multi-word neighbourhood), or another Israeli place known to the
 * synonym dictionary (concept "~city-…").
 */
export function findCity(m: MessageText, concepts: Set<string>): { slug?: LocationKey; other?: boolean } | null {
  for (const { slug, name } of cityNames) {
    if (name.includes(' ') ? m.padded.includes(` ${name} `) : m.forms.has(name)) return { slug };
  }
  for (const c of concepts) {
    if (!c.startsWith('~city-')) continue;
    const key = c.slice('~city-'.length).replace(/-/g, '');
    const slug = LOCATION_SLUGS.find((s) => s.replace(/-/g, '') === key);
    return slug ? { slug } : { other: true };
  }
  return null;
}

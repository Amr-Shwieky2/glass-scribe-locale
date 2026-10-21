/**
 * Rule-based intents (keyword lists per language) for the answer engine:
 * greeting, thanks, complaint, quote request, price, opening hours, contact /
 * human, city coverage and out-of-scope. Lists are in normalized form
 * (normalize.ts): lowercase, no niqqud/gershayim, Arabic ا/ه/ي, Russian е for ё.
 */
import { LOCATIONS, LOCATION_SLUGS, type LocationKey } from '@/data/locations';
import { normalizeText, splitWords } from '@/lib/search/normalize';
import { SYNONYM_GROUPS } from '@/lib/search/synonyms';
import { maskedSpans, processTerm, stems, tokenize } from '@/lib/search/tokenize';

export interface MessageText {
  /** Normalized words. */
  words: string[];
  /** " word word word " — for phrase checks. */
  padded: string;
  /** Each word with its Hebrew/Arabic prefix-less stems. */
  forms: Set<string>;
  /** Per word: the word and its stems (for phrases whose first word has a glued prefix: "להצעת מחיר"). */
  wordForms: string[][];
  /** The message has a question mark. */
  question: boolean;
  /** Per word: the number of its clause (clauses end at , . ! ? ; : — "לא צריך מדידה, תשלחו הצעת מחיר"). */
  clause: number[];
}

export function readMessage(message: string): MessageText {
  const clauses = normalizeText(message).split(/[,.!?;:،؟\n]+/);
  const words: string[] = [];
  const clause: number[] = [];
  clauses.forEach((c, i) => {
    for (const w of splitWords(c)) {
      words.push(w);
      clause.push(i);
    }
  });
  const forms = new Set<string>();
  const wordForms = words.map((w) => [w, ...stems(w)]);
  for (const f of wordForms.flat()) forms.add(f);
  return { words, padded: ` ${words.join(' ')} `, forms, wordForms, question: /[?؟]/.test(message), clause };
}

/** Normalized list: single words match a word (or its stem); phrases match word sequences. */
const list = (...items: string[]) => items.map((i) => splitWords(normalizeText(i)).join(' '));

/**
 * Word positions where a phrase of the list starts. `glued`: its first word may carry a Hebrew/Arabic
 * prefix ("להצעת מחיר", "שתחזרו אליי") — only for lists where that keeps the meaning.
 */
function phraseStarts(m: MessageText, items: string[], glued = false): number[] {
  const starts: number[] = [];
  for (const item of items) {
    const words = item.split(' ');
    for (let i = 0; i + words.length <= m.words.length; i++) {
      const first = glued ? m.wordForms[i].includes(words[0]) : m.words[i] === words[0];
      if (first && words.every((w, j) => j === 0 || m.words[i + j] === w)) starts.push(i);
    }
  }
  return starts;
}

function has(m: MessageText, items: string[], glued = false): boolean {
  return items.some((i) => (i.includes(' ') ? phraseStarts(m, [i], glued).length > 0 : m.forms.has(i)));
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
  // Shabbat, weekend and holiday greetings ("שבת שלום" is hello and goodbye)
  'shabbat shalom', 'shabat shalom', 'good shabbos', 'happy holidays', 'happy new year',
  'שבת שלום', 'שבוע טוב', 'חג שמח', 'שנה טובה', 'מועדים לשמחה', 'חודש טוב',
  'how are you', 'whats up', 'מה נשמע', 'מה שלומך', 'מה שלומכם', 'מה המצב', 'كيفك', 'كيف حالك', 'كيفكم', 'شو اخبارك', 'как дела', 'как вы', 'как ты',
  'جمعه مباركه', 'جمعتك مباركه', 'جمعه سعيده', 'عيد مبارك', 'عيد سعيد', 'كل عام وانتم بخير', 'رمضان كريم',
  'шабат шалом', 'шаббат шалом', 'хорошей субботы', 'с праздником', 'с наступающим',
);
const THANKS = list(
  'thanks', 'thank you', 'thx', 'ty', 'appreciate it', 'bye', 'goodbye', 'great thanks', 'ok thanks',
  'תודה', 'תודה רבה', 'תנקס', 'ביי', 'להתראות', 'יום טוב',
  'شكرا', 'شكرا جزيلا', 'مشكور', 'مشكورين', 'يعطيك العافيه', 'مع السلامه', 'باي', 'تسلم',
  'спасибо', 'благодарю', 'спс', 'пока', 'до свидания',
  // Have a nice day / weekend
  'have a nice day', 'have a good day', 'have a great day', 'have a nice weekend', 'have a good weekend', 'have a great weekend',
  'nice weekend', 'good weekend', 'enjoy your weekend',
  'יום נעים', 'המשך יום נעים', 'המשך יום טוב', 'ערב נעים', 'ערב טוב לכם', 'לילה טוב', 'סוף שבוע נעים', 'סופש נעים', 'סוף שבוע טוב',
  'يومك سعيد', 'نهارك سعيد', 'نهاركم سعيد', 'يوم سعيد', 'ويكند سعيد', 'عطله سعيده',
  'хорошего дня', 'хорошего вечера', 'хороших выходных', 'приятного дня', 'приятных выходных', 'удачи',
  // Praise
  'you are the best', 'youre the best', 'you guys are the best', 'great job', 'well done', 'amazing work',
  'אתם הכי טובים', 'אתם תותחים', 'כל הכבוד', 'כל הכבוד לכם', 'עבודה מעולה', 'אלופים', 'אתם אלופים',
  'انتو الافضل', 'انتم الافضل', 'يعطيكم العافيه', 'الله يعطيكم العافيه', 'كل الاحترام', 'كل الاحترام والتقدير', 'تسلم ايديكم', 'تسلمو',
  'вы лучшие', 'вы молодцы', 'молодцы', 'отличная работа', 'спасибо большое',
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
  // Not bare "הצעות"/"הצעת": suggestions, job offers, a marriage proposal ("הצעות לעיצוב", "הצעת נישואין")
  'הצעת מחיר', 'הצעות מחיר', 'הצעה', 'תמחור',
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
// "I want to know / understand / ask…": what follows is a question, not a request ("хочу понять, зачем нужен замер",
// "بدي افهم ليش لازم قياس", "i want to know when you can measure")
const KNOW_VERBS = list(
  'know', 'understand', 'ask', 'find out', 'learn', 'clarify', 'to know', 'to understand', 'to ask', 'to find out',
  'לדעת', 'להבין', 'לשאול', 'לברר', 'להתייעץ',
  'افهم', 'اعرف', 'اسال', 'استفسر', 'نعرف', 'نفهم', 'نسال', 'استوضح',
  'понять', 'узнать', 'спросить', 'уточнить', 'выяснить', 'разобраться', 'поинтересоваться',
);
// …or maybe only asking about it ("do I need a measurement?") — used only when no answer fits
const MAYBE_REQUEST_VERBS = list(
  'need', 'צריך', 'צריכה', 'צריכים', 'אפשר לקבל', 'ممكن', 'нужен', 'нужна', 'нужно', 'нужны', 'можно получить',
);
const CALLBACK = list(
  'call me', 'call me back', 'contact me', 'get back to me', 'have someone call', 'reach me',
  'תתקשרו אליי', 'תתקשרו אלי', 'תתקשרו אלינו', 'תחזרו אליי', 'תחזרו אלי', 'שיחזרו אליי', 'שיתקשרו אליי', 'תחזרו אלינו', 'חזרה טלפונית', 'יתקשר אליי', 'יתקשר אלי', 'שיתקשר אליי', 'יחזור אליי',
  'اتصلوا فيي', 'اتصلو فيي', 'اتصلوا علي', 'اتصلو علي', 'رنولي', 'رجعولي', 'تواصلوا معي', 'يتصل فيي', 'يتصلوا فيي', 'يتصل علي', 'يرن علي', 'حدا يتصل',
  'перезвоните', 'позвоните мне', 'свяжитесь со мной', 'наберите меня',
);
// Without "me": a request only when the message is not a question ("תתקשרו לפני המדידה?", "מתי תתקשרו?")
const CALLBACK_BARE = list('תתקשרו');
const PRICE = list(
  'price', 'prices', 'cost', 'costs', 'how much', 'pricing', 'rate', 'budget',
  'מחיר', 'מחירים', 'עולה', 'עולים', 'עלות', 'עלויות', 'כמה זה', 'כמה עולה', 'תקציב', 'בכמה',
  'سعر', 'اسعار', 'تكلفه', 'كلفه', 'يكلف', 'بكم', 'قديش', 'قداش', 'ثمن',
  'цена', 'цены', 'стоимость', 'стоит', 'почем', 'прайс', 'сколько стоит', 'бюджет',
);
// Opening-hours phrases only — bare "hours", "שעות", "часы", "open" are also durations and product words
const HOURS = list(
  'opening hours', 'working hours', 'business hours', 'your hours', 'store hours', 'shop hours', 'showroom hours', 'are you open', 'you open today', 'you open now', 'you open tomorrow', 'open on sunday', 'when do you open', 'when do you close', 'what time do you open', 'what time do you close',
  'work on sunday', 'work on sundays', 'work on monday', 'work on mondays', 'work on yom rishon', 'open on yom rishon',
  'שעות פעילות', 'שעות הפעילות', 'שעות פתיחה', 'שעות העבודה שלכם', 'אתם פתוחים', 'פתוחים היום', 'פתוחים עכשיו', 'פתוחים מחר', 'פתוחים בשישי', 'אתם סגורים היום', 'עד מתי אתם פתוחים', 'עד איזה שעה', 'עד איזו שעה', 'מתי אתם פותחים', 'מתי אתם סוגרים',
  'עובדים ביום ראשון', 'עובדים בימי ראשון', 'פתוחים ביום ראשון',
  'ساعات العمل', 'ساعات الدوام', 'دوامكم', 'الدوام', 'فاتحين', 'مسكرين', 'لوقتيش', 'لايمتى', 'متى بتفتحوا', 'متى بتسكروا', 'بتشتغلوا يوم الاحد', 'بتشتغلوا الاحد',
  'часы работы', 'вы открыты', 'вы закрыты', 'до скольки работаете', 'до скольки вы работаете', 'график работы', 'режим работы', 'работаете сегодня', 'работаете сейчас', 'во сколько открываетесь', 'во сколько закрываетесь',
  'работаете в воскресенье', 'работаете по воскресеньям', 'работаете в йом ришон',
);
const CONTACT = list(
  'phone number', 'your number', 'your phone', 'email', 'e mail', 'whatsapp number', 'contact details', 'how to contact', 'talk to someone', 'talk to a human', 'human', 'representative', 'real person', 'live agent', 'an agent',
  'מספר טלפון', 'מספר הטלפון', 'טלפון שלכם', 'מייל', 'אימייל', 'דואל', 'פרטי התקשרות', 'איך יוצרים קשר', 'נציג', 'נציגה', 'בן אדם', 'לדבר עם מישהו', 'מוקד',
  'رقمكم', 'رقمك', 'رقم التلفون', 'رقم تلفون', 'تلفونكم', 'تلفونك', 'رقم الهاتف', 'رقم الجوال', 'رقم الواتس', 'ايميل', 'كيف اتواصل', 'موظف', 'حدا احكي معه', 'بني ادم', 'ممثل خدمه', 'ممثل الشركه',
  'номер телефона', 'ваш телефон', 'ваш номер', 'ваша почта', 'электронная почта', 'почту', 'емейл', 'имейл', 'как связаться', 'оператор', 'менеджер', 'поговорить с человеком', 'живой человек',
);
// Where do you work? (no place asked about)
const AREAS_QUESTION = list(
  'work in my area', 'which areas', 'which cities', 'what areas', 'באיזה אזורים', 'באילו אזורים', 'איזה ערים', 'באיזה ערים',
  'وين بتشتغلوا', 'в каких городах', 'в каких районах',
);
// Do you work in <place>? — the place follows the phrase
const CITY_QUESTION = list(
  'do you work in', 'do you come to', 'do you serve', 'do you install in',
  'بتشتغلوا في', 'تشتغلوا في', 'بتشتغلو في', 'بتيجوا على', 'بتيجو على', 'بتيجوا ع', 'بتيجو ع', 'بتوصلوا', 'بتوصلو', 'تعملون في',
  'вы работаете в', 'работаете в', 'приезжаете в', 'приедете в',
);
// The visitor's own town: the place of a coverage question ("do you come to my area?"), but not a
// coverage question by itself ("a good electrician in our city?", "traffic to my city today")
const MY_AREA = list(
  'my area', 'my city', 'our area', 'our city',
  'באזור שלי', 'בעיר שלי', 'לאזור שלי', 'לאזור שלנו', 'באזור שלנו', 'לעיר שלי', 'לעיר שלנו', 'בעיר שלנו',
  'منطقتي', 'مدينتي', 'منطقتنا', 'مدينتنا',
  'мой город', 'мой район', 'наш город', 'наш район',
);
// Verbs of a coverage question ("…do you come to my area?")
const COVERAGE_VERBS = list(
  'work', 'come', 'serve', 'install', 'cover', 'reach',
  'עובדים', 'מגיעים', 'מתקינים', 'משרתים', 'מגיע', 'באים', 'נותנים שירות', 'עושים עבודות',
  'بتشتغلوا', 'تشتغلوا', 'بتيجوا', 'تيجوا', 'بتوصلوا', 'بتركبوا', 'بتخدموا', 'تعملون',
  'работаете', 'приезжаете', 'приедете', 'выезжаете', 'обслуживаете', 'устанавливаете',
);
// Hebrew glues the preposition to the place ("אתם עובדים בירוחם?", "מגיעים לטמרה?")
const HE_CITY_QUESTION = /(^| )(אתם )?(עובדים|מגיעים|מתקינים|עושים עבודות|נותנים שירות) (?=[בל][א-ת])/;
// "…גם ב/ל…" ("do you also…") asks about anything ("גם בערב?", "גם לעסקים?"): a coverage question only before a place
const HE_CITY_QUESTION_ALSO = /(^| )(אתם )?(עובדים|מגיעים|מתקינים|עושים עבודות|נותנים שירות) גם (?=[בל][א-ת])/;
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
  'job application', 'apply for a job', 'looking for a job', 'job opening', 'job openings', 'vacancy', 'vacancies', 'are you hiring', 'work for you', 'working for you', 'do you hire',
  'קורות חיים', 'מחפש עבודה', 'מחפשת עבודה', 'משרה פנויה', 'משרות פנויות', 'לעבוד אצלכם', 'לעבודה אצלכם', 'עבודה אצלכם', 'מחפשים עובדים', 'מגייסים', 'דרושים',
  'אתם משלמים למתקין', 'משלמים לעובדים', 'משכורת',
  'سيره ذاتيه', 'بدور على شغل', 'بدي اشتغل عندكم', 'اشتغل عندكم', 'وظيفه شاغره', 'وظايف شاغره', 'بتوظفوا', 'توظيف', 'راتب',
  'резюме', 'ищу работу', 'вакансия', 'вакансии', 'вакансию', 'работать у вас', 'работу у вас', 'зарплата',
  // Chatting with the bot itself, accounts and passwords
  'how old are you', 'בן כמה אתה', 'בת כמה את', 'قديش عمرك', 'сколько тебе лет',
  'password', 'סיסמה', 'סיסמא', 'הסיסמה', 'كلمه السر', 'كلمه المرور', 'пароль', 'email account', 'open an email', 'create an email', 'לפתוח מייל', 'פותחים מייל', 'לפתוח חשבון',
  'بعمل ايميل', 'اعمل ايميل', 'افتح ايميل', 'انشئ ايميل', 'انشاء ايميل', 'حساب ايميل', 'حساب جيميل',
  // A job seeker's own portfolio (not "do you have a portfolio?": our gallery)
  'my portfolio', 'תיק העבודות שלי', 'התיק עבודות שלי', 'תיק עבודות שלי', 'ملف اعمالي', 'البورتفوليو تبعي', 'мое портфолио', 'свое портфолио',
  // Recipes (plural), other services
  'מתכונים', 'recipes', 'рецепты', 'وصفات',
  'wedding photography', 'تصوير اعراس', 'تصوير عرس', 'צילום חתונות', 'свадебная съемка',
  'social security', 'ביטוח לאומי', 'معاش الضمان', 'الضمان الاجتماعي', 'التامين الوطني', 'пенсия',
  'surgery', 'ניתוח', 'عمليه جراحيه', 'операция на', 'носовой перегородке', 'носовой перегородки', 'носовая перегородка',
  'طقس بكرا', 'طقس بكره', 'طقس اليوم',
  // Gold, currency and stock prices
  'gold price', 'price of gold', 'gold prices', 'exchange rate', 'dollar rate', 'stock price', 'stock market',
  'מחיר הזהב', 'מחירי הזהב', 'מחיר זהב', 'שער הדולר', 'שער היורו', 'שערי מטבע', 'הבורסה', 'מחיר המניה',
  'سعر الذهب', 'اسعار الذهب', 'سعر الدهب', 'سعر الدولار', 'سعر صرف', 'سعر اليورو', 'البورصه', 'سعر السهم',
  'цена золота', 'цены на золото', 'курс золота', 'курс доллара', 'курс евро', 'курс валют', 'биржа', 'акции',
  // Glass we don't make: eyeglasses, car glass, phone screens. Not cups, bottles or jars ("will the shelf hold
  // wine glasses?"), nor bare "screen"/"מסך"/"شاشه" ("קיר מסך" is a curtain wall) or "שמשה" (a window pane)
  // Events and things called by our product words: a baby shower, a satellite dish ("دش"), a circuit breaker or an
  // electrical cabinet ("قاطع", "كابينة"), an ad break ("فاصل")
  'baby shower', 'bridal shower', 'meteor shower', 'shower party', 'בייבי שאוור', 'בייבי שאואר', 'بيبي شاور', 'بيبي شور', 'беби шауэр', 'бэби шауэр',
  'دش ستلايت', 'دش الستلايت', 'دش ساتلايت', 'دش الساتلايت', 'صحن ستلايت', 'قاطع كهربا', 'قاطع الكهربا', 'قاطع كهرباء', 'قاطع الكهرباء',
  'كابينه كهربا', 'كابينه الكهربا', 'كابينه كهرباء', 'كابينه الكهرباء', 'فاصل اعلاني', 'الفاصل الاعلاني', 'circuit breaker', 'fuse box', 'электрощит', 'электрощиток',
  // Watch glass
  'watch glass', 'watch crystal', 'my watch', 'זכוכית לשעון', 'זכוכית של השעון', 'זכוכית השעון', 'זכוכית שעון', 'זכוכית לשעונים',
  'زجاج الساعه', 'زجاج ساعه', 'قزاز الساعه', 'شاشه الساعه', 'стекло для часов', 'стекло на часы', 'стекло часов', 'стекло для часиков',
  // Drinking glasses ("how many glasses of water a day")
  'glass of water', 'glasses of water', 'glass of wine', 'glasses of wine', 'glass of milk', 'glass of juice', 'drinking glass', 'drinking glasses',
  'כוס מים', 'כוסות מים', 'כוס יין', 'כוסות יין', 'כוס חלב', 'كاسه مي', 'كاسات مي', 'كاس مي', 'كوب ماء', 'كوب مي', 'كاسه ميه', 'كباية مي', 'كبايه مي',
  'стакан воды', 'стакана воды', 'стаканов воды', 'стаканы воды', 'бокал вина', 'бокала вина',
  'eyeglasses', 'sunglasses', 'reading glasses', 'prescription glasses', 'contact lenses', 'windshield', 'windscreen', 'car window', 'car glass', 'auto glass', 'screen protector', 'phone screen',
  'my glasses', 'broke my glasses', 'broken glasses', 'pair of glasses', 'car mirror', 'side mirror', 'wing mirror', 'rear view mirror', 'rearview mirror', 'iphone', 'smartphone',
  'משקפיים', 'משקפי שמש', 'עדשות', 'אופטיקה', 'מראה צד', 'מראת צד', 'מראה לרכב', 'מראה של הרכב', 'מראה של האוטו', 'מראה אחורית לרכב', 'אייפון', 'סמארטפון', 'שמשה קדמית', 'שמשה אחורית', 'שמשה לרכב', 'שמשה לאוטו', 'שמשה של אוטו', 'שמשה של האוטו', 'שמשה של הרכב', 'שמשת רכב', 'שמשת הרכב', 'שמשות לרכב', 'זכוכית לרכב', 'זכוכית לאוטו', 'זכוכית של האוטו', 'זכוכית של הרכב', 'חלון של האוטו', 'חלון של הרכב', 'מגן מסך', 'מגני מסך', 'מסך הטלפון', 'מסך של הטלפון', 'מסך טלפון', 'מסך הפלאפון', 'מסך של הפלאפון', 'מסך פלאפון',
  'نظارات', 'نظاره', 'نظارة شمس', 'عدسات', 'مرايه السياره', 'مرايه سياره', 'مرايات السياره', 'ايفون', 'zjaj sayara', 'zjaj lal sayara', 'zjaj el sayara', 'qzaz sayara', 'زجاج السياره', 'زجاج سياره', 'شباك السياره', 'قزاز السياره', 'واقي شاشه', 'شاشه التلفون', 'شاشه الجوال', 'شاشه الموبايل',
  'очки', 'очков', 'линзы', 'зеркало заднего вида', 'боковое зеркало', 'зеркало машины', 'зеркало на машину', 'айфон', 'смартфон', 'лобовое стекло', 'лобового стекла', 'стекло на машину', 'стекло для машины', 'автостекло', 'автостекла', 'стекло на телефон', 'стекло для телефона', 'экран телефона',
);
// A greeting or thanks may come with these and still be only small talk ("thanks a lot guys")
const FILLER = list(
  'there', 'guys', 'all', 'everyone', 'team', 'again', 'so', 'much', 'very', 'lot', 'lots', 'you', 'a', 'and',
  'לכם', 'רבה', 'לך', 'גם', 'שוב', 'מאוד', 'אחי', 'חברים', 'צוות', 'ענק',
  'جزيلا', 'كتير', 'الك', 'الكم', 'يا', 'شباب', 'اخي', 'حبيبي', 'كثير',
  'вам', 'всем', 'большое', 'огромное', 'ребята', 'друзья', 'еще', 'раз', 'и', 'а',
  'ו', 'و', 'and', 'too', 'לכולם', 'גם לכם', 'وانتو', 'وانت', 'انت', 'انتو', 'тоже', 'вам тоже', 'у вас',
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

/** Words of the message left after removing these phrases and filler words (also with a glued "and": "וביי", "وشكرا"). */
function restAfter(m: MessageText, items: string[]): number {
  const covered = new Set<number>();
  for (const { start, length } of occurrences(m, [...items, ...FILLER])) for (let i = start; i < start + length; i++) covered.add(i);
  return m.words.filter((_, i) => !covered.has(i)).length;
}
// "Thanks for the quick answer" is a thank-you too
const THANKS_FOR = list('thanks for', 'thank you for', 'תודה על', 'תודה רבה על', 'شكرا على', 'شكرا ع', 'спасибо за', 'благодарю за');

/** A message that is only a greeting or a thank-you ("thanks a lot guys") — not "hi, prices?". */
export function smallTalk(m: MessageText): SmallTalk | null {
  if (m.words.length === 0 || m.words.length > 6) return null;
  if (has(m, THANKS) && restAfter(m, THANKS) === 0) return 'thanks';
  if (!m.question && phraseStarts(m, THANKS_FOR, true).includes(0) && new Set(m.clause).size === 1 && m.words.length <= 5) return 'thanks';
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

// ---- introductions and phone numbers ---------------------------------------------------
// "My name is Arad", "קוראים לי אילת", "اسمي يافا": a name, not a question (names are often towns too)
const NAMED = list('my name is', 'my names', 'קוראים לי', 'שמי', 'השם שלי', 'اسمي', 'انا اسمي', 'меня зовут', 'мое имя');
// "This is Arad", "זאת אילת", "معك يافا", "это Арад": only before a name (not "זה עולה הרבה?")
const PRESENTING = list('this is', 'זה', 'זאת', 'זו', 'כאן', 'معك', 'معاك', 'معكم', 'это', 'на связи');
// "Arad speaking", "ערד מדבר"
const SPEAKING = list('speaking', 'here', 'מדבר', 'מדברת', 'כאן', 'на связи');
const FROM = list('from', 'من', 'из');
const AND = new Set(list('and', 'и', 'а'));

/**
 * The message without the visitor introducing themselves ("שלום, קוראים לי ערד, כמה עולה מקלחון?" → "כמה עולה
 * מקלחון?"; "this is Arad from the office" → ""). `isName(word)`: whether a word can be a name (one the
 * knowledge base doesn't use, or a place: many first names are towns).
 */
export function withoutIntroduction(m: MessageText, isName: (i: number) => boolean): string | null {
  const drop = new Set<number>();
  const places = placeWordIndexes(m);
  const isPlace = (w: string) => cityConcepts(w).length > 0 || contextPlaces.some(({ words }) => words.length === 1 && words[0] === w);
  // A place as a name, but not with a glued preposition ("זה בחיפה?" asks where)
  const name = (i: number) =>
    i < m.words.length && (isName(i) || ((places.has(i) || isPlace(m.words[i])) && !stems(m.words[i]).some(isPlace)));
  const clauseStart = (i: number) => i === 0 || m.clause[i - 1] !== m.clause[i];
  const take = (from: number, to: number) => {
    for (let i = from; i < to; i++) drop.add(i);
    // "…from the office", "…מהמשרד"
    if (to < m.words.length && m.clause[to] === m.clause[from]) {
      if (FROM.includes(m.words[to]) && to + 1 < m.words.length) [to, to + 1].forEach((i) => drop.add(i));
      else if (/^מ[א-ת]{2,}/.test(m.words[to]) && to === m.words.length - 1) drop.add(to);
    }
  };
  for (const { start, length } of occurrences(m, NAMED)) if (start + length < m.words.length) take(start, start + length + 1);
  for (const { start, length } of occurrences(m, PRESENTING)) if (clauseStart(start) && name(start + length)) take(start, start + length + 1);
  for (const { start } of occurrences(m, SPEAKING)) if (start > 0 && clauseStart(start - 1) && name(start - 1)) take(start - 1, start + 1);
  if (!drop.size) return null;
  // "…and I want a mirror", "…وبدي مراية", "…ואני רוצה": the "and" joined the introduction to the question
  const words = m.words.map((w, i) => {
    if (drop.has(i) || !drop.has(i - 1)) return w;
    if (AND.has(w)) return '';
    return /^[וو]/.test(w) && stems(w).includes(w.slice(1)) ? w.slice(1) : w;
  });
  return words.filter((w, i) => w && !drop.has(i)).join(' ');
}

/** An Israeli phone number in the message ("0521234567", "052-123-4567", "+972 52…"): the visitor wants a call. */
export const hasPhoneNumber = (text: string) => /(^|[^\d])(\+?972|0)([\s-]?\d){8,9}([^\d]|$)/.test(text);

/** Strips a leading greeting ("hi, how much is…" → "how much is…"). */
export function withoutGreeting(message: string): string {
  return message.replace(/^\s*(hi|hello|hey|שלום|היי|הי|אהלן|مرحبا|اهلا|هلا|السلام عليكم|привет|здравствуйте|добрый день)[\s,.!:;-]+/i, '');
}

export const isComplaint = (m: MessageText) => has(m, COMPLAINT) || hasPrefix(m, ['complain', 'жалоб']);
const MEASUREMENT_VISIT = list(
  'measurement', 'measure', 'site visit', 'מדידה', 'מדידות', 'מודד', 'למדוד', 'قياس', 'قياسات', 'تقيسو', 'تقيسوا', 'تقيسولي', 'زياره',
  'замер', 'замеры', 'замерщик', 'замерить', 'измерить', 'посчитать', 'посчитайте', 'просчитать',
);

// Someone coming to measure ("…שמישהו יבוא למדוד", "can someone come and measure")
const COME_TO_MEASURE = list(
  'come measure', 'come and measure', 'come to measure', 'come over to measure',
  'יבוא למדוד', 'שיבוא למדוד', 'תבואו למדוד', 'שתבואו למדוד', 'תגיעו למדוד', 'שתגיעו למדוד', 'יגיע למדוד', 'שיגיע למדוד', 'לבוא למדוד', 'להגיע למדוד',
  'يجي يقيس', 'تيجوا تقيسوا', 'تيجو تقيسو', 'حدا يجي يقيس', 'приехать на замер', 'приедет на замер', 'приехать замерить', 'приедете замерить',
);

// Cancelling, postponing or changing an appointment or a quote the visitor already has: for the team, not a new request
const CHANGE_VERBS = list(
  'cancel', 'cancelled', 'postpone', 'reschedule', 'change the date', 'change the time', 'move the',
  'לבטל', 'ביטול', 'מבטל', 'מבטלת', 'לדחות', 'דחייה', 'לשנות את', 'להזיז', 'להקדים',
  'الغي', 'الغاء', 'نلغي', 'تلغي', 'اجل', 'نأجل', 'تأجيل', 'اغير الموعد', 'نغير الموعد', 'تغيير الموعد',
  'отменить', 'отмена', 'отменяю', 'перенести', 'перенос', 'поменять дату', 'изменить дату', 'поменять время',
);
// Quote words that also mean something else, next to a word of that other meaning: an estimate of the time,
// a job offer, settling the bill, a saying ("an estimate of how long it takes", "הצעה לעבודה", "расчет наличными",
// "a quote from the bible")
const AMBIGUOUS_QUOTE_NOUNS: [string[], string[]][] = [
  [list('estimate', 'estimates'), list('how long', 'timeline', 'time frame', 'timeframe', 'lead time', 'duration')],
  [list('הצעה'), list('עבודה אצלכם', 'לעבודה', 'משרה', 'נישואין')],
  [list('расчет', 'просчет'), list('наличными', 'наличные', 'картой', 'кредит', 'кредитной', 'перевод')],
  [list('اوفر'), list('كاش', 'فيزا')],
  // A saying, not a price quote ("a quote from the bible", "quote of the day")
  [list('quote', 'quotes'), list(
    'bible', 'quran', 'koran', 'torah', 'inspirational', 'inspiring', 'motivational', 'famous', 'funny', 'wise', 'wisdom',
    'proverb', 'proverbs', 'saying', 'sayings', 'citation', 'author', 'poet', 'philosopher', 'movie', 'book', 'of the day',
    'about life', 'about love', 'love quote', 'love quotes', 'life quote', 'life quotes',
  )],
];
/** Positions of quote words that mean something else in this message ("a rough estimate of the timeline", "расчет наличными"). */
export function otherMeaningQuoteWords(m: MessageText): number[] {
  return AMBIGUOUS_QUOTE_NOUNS.flatMap(([nouns, other]) => (has(m, other, true) ? occurrences(m, nouns).map(({ start }) => start) : []));
}
/** A quote word (not a negated one: "I don't want a quote, just…"), unless it means something else here. */
function quoteNounAsked(m: MessageText): boolean {
  const other = new Set(otherMeaningQuoteWords(m));
  return occurrences(m, QUOTE_NOUNS).some(({ start, length }) => !negated(m, start) && !(length === 1 && other.has(start)));
}
/** A "need"-type verb right before a quote or measurement word ("צריך מדידה?", "нужен замер"), not a question about something else. */
function needsNear(m: MessageText, nouns: { start: number }[]): boolean {
  return occurrences(m, MAYBE_REQUEST_VERBS).some(({ start, length }) =>
    !negated(m, start) && nouns.some((n) => n.start >= start + length && n.start - (start + length) <= 1 && m.clause[n.start] === m.clause[start]));
}

/** Asks for something ("I want…", "I need…"): see requestAsked and MAYBE_REQUEST_VERBS. */
export const wantsSomething = (m: MessageText) => requestAsked(m) || asked(m, MAYBE_REQUEST_VERBS);

/**
 * Wants a quote, a measurement visit or to be contacted: "strong" ("I want a
 * quote for…", "call me back") starts the quote request at once; "maybe"
 * ("do I need a measurement?") only when no answer fits; "change": about an
 * appointment or quote the visitor already has ("I want to cancel the measurement").
 */
export function quoteRequest(m: MessageText): 'strong' | 'maybe' | 'change' | null {
  // (a call that already happened or that the visitor will make is not a request: "did you just call me?", "я вам перезвоню")
  if (has(m, PAST_CALL)) return null;
  if (asked(m, CALLBACK, CALL_QUESTION) || m.words.some((w, i) => w.startsWith('перезвон') && !PAST_CALL_RU.test(w) && !negated(m, i, CALL_QUESTION))) return 'strong';
  // "…חיפוי למטבח, תתקשרו" asks for a call; "תתקשרו לפני המדידה?" asks about one
  if (!m.question && asked(m, CALLBACK_BARE, CALL_QUESTION)) return 'strong';
  // "אפשר שמישהו יבוא למדוד מחר" asks for a visit; "מתי אתם יכולים לבוא למדוד?", "למה צריך שתבואו למדוד?", "do I have to
  // pay if you come to measure?" ask about one
  // (or how long until it: "قديش بدي استنى لحتى تيجو تقيسو", even without a question mark)
  if (occurrences(m, COME_TO_MEASURE).some(({ start }) => !negated(m, start, CALL_QUESTION) && !conditional(m, start) && !howLongBefore(m, start))) return 'strong';
  const quoteNoun = quoteNounAsked(m);
  const visits = has(m, SELF, true) ? [] : occurrences(m, MEASUREMENT_VISIT).filter(({ start }) => !negated(m, start));
  const about = quoteNoun || visits.length > 0;
  if (about && has(m, CHANGE_VERBS, true)) return 'change';
  if (about && requestAsked(m)) return 'strong';
  // "need a price offer for…" asks for one; "do I need a measurement?" asks about it
  if (quoteNoun && !m.question && asked(m, MAYBE_REQUEST_VERBS)) return 'strong';
  if (about && needsNear(m, [...occurrences(m, QUOTE_NOUNS), ...visits])) return 'maybe';
  return null;
}

// "If you come to measure…": a condition, not a request — unless it is "if possible" ("אם אפשר שתבואו למדוד מחר")
const IF_WORDS = new Set(list('if', 'אם', 'ואם', 'במידה', 'اذا', 'إذا', 'если'));
const POSSIBLE = new Set(list(
  'possible', 'can', 'could', 'convenient', 'אפשר', 'ניתן', 'נוח', 'תוכלו', 'תוכל', 'יכולים', 'יכול',
  'ممكن', 'بتقدروا', 'بتقدرو', 'بقدر', 'فيكم', 'можно', 'сможете', 'можете', 'удобно',
));
function conditional(m: MessageText, index: number): boolean {
  for (let i = Math.max(0, index - 3); i < index; i++) {
    if (m.clause[i] !== m.clause[index] || !IF_WORDS.has(m.words[i])) continue;
    if (!m.wordForms.slice(i + 1, index).some((forms) => forms.some((f) => POSSIBLE.has(f)))) return true;
  }
  return false;
}

// A call that already happened or that the visitor will make
const PAST_CALL = list(
  'did you call', 'did you just call', 'you called me', 'you just called', 'someone called me', 'i got a call', 'i will call you', 'ill call you',
  'התקשרתם אליי', 'התקשרתם אלי', 'התקשרתם', 'קיבלתי שיחה', 'מישהו התקשר', 'אני אתקשר', 'אחזור אליכם',
  'اتصلتوا فيي', 'اتصلتو فيي', 'اتصلتوا', 'حدا اتصل', 'اجاني اتصال', 'رح اتصل', 'برجع بتصل',
  'вы звонили', 'мне звонили', 'вы мне звонили', 'мне уже перезвонили', 'я перезвоню', 'я вам перезвоню',
  // (in other words and word orders: "someone called me from 054…", "وصلني اتصال", "мне звонил кто-то")
  'got a call', 'received a call', 'missed call', 'someone called', 'who called me', 'called me from', 'calling me from',
  'קיבלתי טלפון', 'הייתה לי שיחה', 'היתה לי שיחה', 'שיחה שלא נענתה', 'פספסתי שיחה',
  'اتصل فيي حدا', 'اتصل علي حدا', 'رن علي حدا', 'رنلي حدا', 'حدا رن علي', 'حدا رنلي', 'وصلني اتصال', 'وصلتني مكالمه', 'اجتني مكالمه', 'اجاني تلفون', 'وصلني تلفون', 'مكالمه فائته',
  'мне звонил', 'мне звонила', 'мне позвонили', 'мне позвонил', 'кто то звонил', 'кто то позвонил', 'пропущенный звонок', 'был звонок', 'mne zvonili', 'mne zvonil',
);
// A call word with "yesterday" ("etasalu fiye mbare7", "вчера звонили"), or a number the call came from ("…from 054…")
const YESTERDAY = list('yesterday', 'אתמול', 'שלשום', 'مبارح', 'امبارح', 'mbare7', 'mbareh', 'embare7', 'imbare7', 'вчера', 'позавчера', 'vchera');
const CALLED = list(
  'call', 'called', 'calls', 'calling', 'phoned', 'שיחה', 'התקשר', 'התקשרו', 'התקשרה', 'צלצל', 'צלצלו', 'اتصال', 'اتصل', 'اتصلوا', 'اتصلو', 'رن', 'رنو', 'مكالمه',
  'etasal', 'etasalu', 'itasalu', 'itsalu', 'звонили', 'звонил', 'звонила', 'позвонили', 'позвонил', 'звонок', 'zvonili', 'zvonil', 'pozvonili',
);
const FROM_NUMBER = /(^|[\s(])(from|מ-?|מה|من|mn|men|min|с|со|s)\s*-?\s*(\+?972|0)([\s-]?\d){8,9}([^\d]|$)/i;
const PAST_CALL_RU = /^перезвон(ю|ил|ила|или|ило)$/;
/** A call that already happened or that the visitor will make ("קיבלתי שיחה מ-052…, זה אתם?"). */
export const pastCall = (m: MessageText) =>
  has(m, PAST_CALL) || m.words.some((w) => /^(по)?звонил(а|и|о)?$/.test(w)) || (has(m, YESTERDAY) && has(m, CALLED, true));
/** "…called me from 054…": the number a call came from, not one to call back. */
export const callFromNumber = (text: string) => FROM_NUMBER.test(normalizeText(text));

// "Is this your number?", "is your WhatsApp 058…?", "זה אתם?": the visitor checks a number, it is not theirs to call back
const IS_IT_YOURS = list(
  'is this you', 'is that you', 'is it you', 'was it you', 'is this your', 'is that your', 'is it your', 'is your', 'is this number', 'is this the number',
  'זה אתם', 'זה הייתם אתם', 'הייתם אתם', 'זה שלכם', 'זה המספר שלכם', 'זה הטלפון שלכם', 'זה הוואטסאפ שלכם', 'המספר הזה שלכם', 'המספר שלכם הוא',
  'هاد انتو', 'هذا انتو', 'هاد انتم', 'هذا انتم', 'هاد رقمكم', 'هذا رقمكم', 'هل هذا رقمكم', 'رقمكم هو', 'هاد الرقم الكم', 'هذا الرقم الكم',
  'это вы', 'это были вы', 'это ваш', 'это ваш номер', 'ваш номер', 'ваш ватсап', 'ваш вотсап',
);
export const asksIfOurs = (m: MessageText) => m.question && has(m, IS_IT_YOURS);

/**
 * Whether a word of a message is part of asking for a quote, a visit or a call (or a greeting, filler or courtesy):
 * what is left of a quote request names what it is about.
 */
export function requestWord(unit: string[]): boolean {
  requestWords ??= new Set(
    [GREETING, QUOTE_NOUNS, REQUEST_VERBS, MAYBE_REQUEST_VERBS, CALLBACK, CALLBACK_BARE, FILLER, MEASUREMENT_VISIT, COME_TO_MEASURE, [...DESIRE], list(
      'please', 'pls', 'plz', 'someone', 'somebody', 'anyone', 'today', 'tomorrow', 'asap', 'urgent', 'free', 'phone', 'number', 'back', 'possible', 'can', 'could',
      'בבקשה', 'מישהו', 'היום', 'מחר', 'דחוף', 'חינם', 'טלפון', 'מספר', 'אפשר', 'אליי', 'אלי', 'לי',
      'لو', 'سمحت', 'حدا', 'اليوم', 'بكرا', 'بكره', 'ضروري', 'مستعجل', 'رقم', 'تلفون', 'ممكن', 'فيي', 'علي',
      'пожалуйста', 'кто', 'нибудь', 'сегодня', 'завтра', 'срочно', 'бесплатно', 'номер', 'телефон', 'можно', 'мне',
    )].flatMap((items) => items.flatMap((i) => i.split(' '))).flatMap((w) => [w, ...stems(w)]),
  );
  return unit.some((v) => requestWords!.has(v));
}
let requestWords: Set<string> | undefined;

// "About": what follows names what a request is about ("call me about the loan", "תחזרו אליי בקשר למשכנתא", "رنولي بخصوص…")
const ABOUT = list(
  'about', 'regarding', 'concerning', 're', 'בקשר', 'בעניין', 'לגבי', 'בנוגע', 'بخصوص', 'بشان', 'عن', 'حول', 'مشان', 'منشان',
  'насчет', 'по поводу', 'поводу', 'про', 'касательно', 'относительно',
);
// How a request or a question is put — when, if, or, thanks — not what it is about ("call me after noon", "رنولي بعد
// الظهر", "אם אפשר שתבואו למדוד", "לשבוע הבא", "هسا فاتحين ولا مسكرين?")
const REQUEST_TALK = list(
  'morning', 'afternoon', 'evening', 'noon', 'lunch', 'night', 'tonight', 'week', 'next', 'this', 'soon', 'later', 'after', 'before', 'now', 'right now',
  'currently', 'still', 'if', 'or', 'im', 'i m', 'thanks', 'thank', 'possible', 'usually', 'normally', 'typically', 'roughly', 'approximately', 'average',
  'בדרך כלל', 'בערך', 'בממוצע', 'عاده', 'بالعاده', 'تقريبا', 'обычно', 'примерно', 'приблизительно', 'в среднем',
  'בוקר', 'צהריים', 'הצהריים', 'אחהצ', 'ערב', 'לילה', 'הערב', 'שבוע', 'השבוע', 'הבא', 'הבאה', 'הקרוב', 'הקרובה', 'בהקדם', 'מאוחר', 'יותר',
  'אחרי', 'לפני', 'עכשיו', 'כרגע', 'עדיין', 'אם', 'ואם', 'תודה',
  'الصبح', 'الصباح', 'الظهر', 'المسا', 'المساء', 'الليل', 'الاسبوع', 'الجاي', 'الجايه', 'قريب', 'بعدين', 'بعد', 'قبل', 'هسا', 'هسه', 'هلق',
  'هلا', 'الحين', 'لسا', 'اذا', 'ولا', 'شكرا',
  'утром', 'днем', 'вечером', 'ночью', 'обеда', 'после', 'до', 'неделе', 'неделю', 'следующей', 'следующий', 'скорее', 'позже', 'потом',
  'сейчас', 'щас', 'если', 'или', 'спасибо',
);
// …and this chat itself: "די עם הבוט, אפשר לדבר עם מישהו אמיתי", "a real person not a bot"
const THE_BOT = list('bot', 'bots', 'chatbot', 'בוט', 'בוטים', 'צאטבוט', 'بوت', 'روبوت', 'бот', 'бота', 'боту', 'ботом', 'робот', 'робота');
/** The message talks about this chat ("די עם הבוט", "not a bot"): it is about us. */
export const mentionsTheBot = (m: MessageText) => has(m, THE_BOT, true);
let talkWords: Set<string> | undefined;
/** Part of how a request or a question is put (see requestWord, ABOUT, REQUEST_TALK), not what it is about. */
export function chatWord(unit: string[]): boolean {
  talkWords ??= new Set([...ABOUT, ...REQUEST_TALK, ...THE_BOT].flatMap((i) => i.split(' ')).flatMap((w) => [w, ...stems(w)]));
  return requestWord(unit) || unit.some((v) => talkWords!.has(v));
}
/**
 * A request that names what it is about: a quote or a measurement is always of something ("a quote for laminate",
 * "нужен замер давления"), and so is a call about something ("call me about the loan"). A bare callback isn't:
 * the word left may be a name ("call me back, Dana").
 */
export const namesRequestSubject = (m: MessageText) =>
  quoteNounAsked(m) || occurrences(m, MEASUREMENT_VISIT).length > 0 || occurrences(m, COME_TO_MEASURE).length > 0 || has(m, ABOUT, true);

// "Don't call me", "no need to call", "אל תתקשרו", "שלא תתקשרו", "не нужно перезванивать", "ما في داعي": not a request
const NEGATION = new Set(list(
  'not', 'dont', 'don', 'no', 'never', 'didnt', 'doesnt', 'wont', 'cant', 'isnt', 'arent', 'wasnt', 'werent', 'havent', 'shouldnt', 'wouldnt', 'nobody',
  'לא', 'אל', 'אין', 'בלי', 'שלא', 'שאל', 'לאף', 'אף',
  'لا', 'ما', 'مش', 'بلاش', 'بدون',
  'не', 'нет', 'никто', 'ни',
  // "stop calling me", "תפסיקו להתקשר", "بطلوا تتصلوا", "перестаньте звонить"
  'stop', 'quit', 'תפסיקו', 'תפסיק', 'תפסיקי', 'بطلوا', 'بطلو', 'بطل', 'وقفوا', 'перестаньте', 'перестань', 'прекратите', 'хватит',
));
// "When will you call me?", "will you call me before the measurement?", "מי יחזור אליי?", "через сколько вы
// перезвоните?", "how fast can someone come to measure?": a question about the call or the visit (in a question,
// anywhere before the call words in that clause)
const CALL_QUESTION = new Set(list(
  'when', 'will', 'why', 'who', 'long', 'soon', 'fast', 'quickly', 'much', 'מתי', 'האם', 'מי', 'למה', 'זמן', 'מהר', 'כמה', 'בכמה', 'متى', 'امتى', 'ايمتى', 'ليش', 'مين', 'قديش', 'بقديش', 'بكم', 'بسرعه',
  'когда', 'через', 'почему', 'кто', 'быстро', 'скоро', 'сколько',
));
// Wanting or needing something: "I don't want anyone to call me", "ما بدي انه حدا يتصل فيي" negate the whole clause
const DESIRE = new Set(list(
  'want', 'need', 'interested', 'wish', 'רוצה', 'רוצים', 'צריך', 'צריכה', 'צריכים', 'מעוניין', 'מעוניינת', 'מעוניינים', 'מבקש', 'מבקשת',
  'بدي', 'بدنا', 'بدو', 'حابب', 'حاب', 'محتاج', 'хочу', 'хотим', 'нужно', 'надо', 'нужен', 'нужна', 'интересует',
));
/**
 * Index of the negation (or one of `also`) that applies to word `index`: one in the three words before it in its
 * clause, one before a "want"/"need" verb earlier in the clause ("I don't want you to call me"), or — in a
 * question — one anywhere before it in the clause ("why didn't anyone call me?"). -1 when there is none.
 */
function negationBefore(m: MessageText, index: number, also?: Set<string>): number {
  const inClause = (i: number) => m.clause[i] === m.clause[index];
  const isNeg = (i: number) => NEGATION.has(m.words[i]) || !!also?.has(m.words[i]);
  for (let i = Math.max(0, index - 3); i < index; i++) if (inClause(i) && isNeg(i)) return i;
  for (let j = index - 1; j >= 0 && inClause(j); j--) {
    if (!m.wordForms[j].some((f) => DESIRE.has(f))) continue;
    for (let i = Math.max(0, j - 2); i < j; i++) if (inClause(i) && NEGATION.has(m.words[i])) return i;
  }
  if (m.question) for (let i = 0; i < index; i++) if (inClause(i) && isNeg(i)) return i;
  return -1;
}
const negated = (m: MessageText, index: number, also?: Set<string>) => negationBefore(m, index, also) >= 0;
/** Where these words or phrases occur (glued prefixes allowed): first word and length. */
function occurrences(m: MessageText, items: string[]): { start: number; length: number }[] {
  const found: { start: number; length: number }[] = [];
  for (const item of items) {
    const length = item.split(' ').length;
    const starts = length > 1 ? phraseStarts(m, [item], true) : m.wordForms.flatMap((forms, i) => (forms.includes(item) ? [i] : []));
    for (const start of starts) found.push({ start, length });
  }
  return found;
}
/** The message has one of these words or phrases (glued prefixes allowed), not negated (nor after one of `also`). */
const asked = (m: MessageText, items: string[], also?: Set<string>) => occurrences(m, items).some(({ start }) => !negated(m, start, also));
// "How long / when … want or need to…" asks how long, not for something ("قديش بدي استنى لحتى تيجو تقيسو")
const HOW_LONG_WORDS = new Set(list(
  'when', 'long', 'soon', 'כמה', 'מתי', 'בכמה', 'قديش', 'بقديش', 'اديش', 'متى', 'امتى', 'ايمتى', 'كم', 'когда', 'сколько', 'скоро',
));
/** A how-long / when word earlier in the clause of word `index`. */
const howLongBefore = (m: MessageText, index: number) => m.words.slice(0, index).some((w, i) => m.clause[i] === m.clause[index] && HOW_LONG_WORDS.has(w));
/** A request verb (not negated) that asks for something, not one that introduces a question ("I want to know…"). */
export const requestAsked = (m: MessageText) =>
  occurrences(m, REQUEST_VERBS).some(({ start, length }) => {
    if (negated(m, start)) return false;
    if ([start - 1, start - 2].some((i) => i >= 0 && m.clause[i] === m.clause[start] && HOW_LONG_WORDS.has(m.words[i]))) return false;
    const next = occurrences(m, KNOW_VERBS).map((k) => k.start);
    return !next.some((k) => k >= start + length && k - (start + length) <= 1 && m.clause[k] === m.clause[start]);
  });

// Call words, for declinedRequest
const CALL_WORDS = [...CALLBACK, ...CALLBACK_BARE, ...list(
  'call', 'calling', 'calls', 'phone', 'phoning', 'ring', 'ringing', 'להתקשר', 'תתקשר', 'תחזרו', 'تتصلوا', 'تتصلو', 'تتصل', 'تتصلي', 'تدقوا', 'ترنوا',
  'перезванивать', 'перезвонить', 'звонить', 'позвонить', 'звоните', 'названивать',
)];
// Writing to the visitor ("don't send me WhatsApp messages", "не пишите мне в ватсап"): declined like a call
const MESSAGE_WORDS = list(
  'send', 'sending', 'text', 'texting', 'message', 'messaging', 'messages', 'write', 'writing', 'email', 'emailing', 'whatsapp', 'sms', 'spam',
  'תכתבו', 'לכתוב', 'תשלחו', 'לשלוח', 'הודעות', 'הודעה', 'וואטסאפ', 'ווטסאפ', 'סמס', 'ספאם',
  'تبعتوا', 'تبعتو', 'تبعتولي', 'تكتبوا', 'تكتبو', 'تكتبولي', 'تراسلوا', 'رسايل', 'رسائل', 'مسجات', 'واتس', 'واتساب',
  'пишите', 'писать', 'напишите', 'присылайте', 'присылать', 'отправляйте', 'слать', 'сообщения', 'сообщений', 'смс', 'ватсап', 'вотсап', 'спам',
);
// …and the words after a declined call or message that belong to it ("stop calling me", "не пишите мне в ватсап")
const DECLINE_TAIL = new Set(list(
  'me', 'us', 'to', 'on', 'via', 'by', 'in', 'a', 'any', 'more', 'anymore', 'again', 'messages', 'whatsapp', 'sms', 'emails', 'texts',
  'לי', 'לנו', 'אליי', 'אלי', 'אלינו', 'יותר', 'שוב', 'בוואטסאפ', 'וואטסאפ', 'הודעות', 'הודעה',
  'لي', 'الي', 'فيي', 'علي', 'النا', 'النا', 'كمان', 'رسايل', 'مسجات', 'عالواتس', 'واتس',
  'мне', 'нам', 'в', 'на', 'по', 'больше', 'снова', 'ватсап', 'вотсап', 'сообщения', 'смс',
));

// "…not needed" after a call word ("звонить не надо", "להתקשר לא צריך", "الاتصال مش ضروري")
const NOT_NEEDED_AFTER = list(
  'not needed', 'not necessary', 'is not needed', 'is not necessary', 'לא צריך', 'לא חייבים', 'לא חובה', 'מיותר',
  'مش لازم', 'مش ضروري', 'ما في داعي', 'لا داعي', 'не надо', 'не нужно', 'не стоит', 'не обязательно', 'не требуется',
);
/** Length of a NOT_NEEDED_AFTER phrase starting at word `at` (0 when there is none). */
function notNeededAfter(m: MessageText, at: number): number {
  const found = NOT_NEEDED_AFTER.map((p) => p.split(' ')).find((p) => p.every((w, j) => m.words[at + j] === w && m.clause[at + j] === m.clause[at]));
  return found?.length ?? 0;
}

/** Phrases that decline phone calls as such. */
const NO_CALLS = list(
  'no calls', 'no phone calls', 'no phone', 'not by phone', 'cant talk on the phone', 'cant take calls', 'i dont answer the phone', 'dont phone me', 'text only', 'whatsapp only',
  'בלי טלפונים', 'בלי טלפון', 'בלי שיחות', 'בלי שיחות טלפון', 'לא בטלפון', 'אל תצלצלו', 'לא עונה לטלפון', 'לא עונה לטלפונים', 'לא יכול לדבר בטלפון', 'לא יכולה לדבר בטלפון', 'רק וואטסאפ', 'רק בוואטסאפ', 'רק הודעות',
  'بدون تلفونات', 'بلا تلفونات', 'بدون اتصالات', 'بلا اتصالات', 'ما بقدر احكي بالتلفون', 'ما برد عالتلفون', 'ما برد على التلفون', 'بس واتساب', 'بس واتس',
  'без звонков', 'не по телефону', 'не могу говорить по телефону', 'не отвечаю на звонки', 'только ватсап', 'только whatsapp', 'только в ватсап',
);

/**
 * A call or a quote that the message declines ("don't call me, just send the price", "לא רוצה הצעת מחיר, רק
 * בערך") or a call it asks about ("will you call me before the measurement?"). `rest`: the message without
 * those words — what the visitor asks is the rest, not our phone number or the quote form. Null when there is none.
 */
export function declinedRequest(m: MessageText): { rest: string; aboutCall: boolean; declinedCall: boolean } | null {
  const drop = new Set<number>();
  let aboutCall = false;
  let declinedCall = false;
  const mark = (items: string[], also?: Set<string>, contact = false) => {
    for (const { start, length } of occurrences(m, items)) {
      const from = negationBefore(m, start, also);
      // "звонить не надо", "להתקשר לא צריך": the negation follows the call
      const after = contact && from < 0 ? notNeededAfter(m, start + length) : 0;
      if (after) {
        declinedCall = true;
        for (let i = start; i < start + length + after; i++) drop.add(i);
        continue;
      }
      if (from < 0) continue;
      if (!negated(m, start)) aboutCall = true;
      else if (contact) declinedCall = true;
      let end = start + length;
      // "stop calling me", "не пишите мне в ватсап": the words that go with the declined call or message
      if (contact && negated(m, start)) while (end < m.words.length && m.clause[end] === m.clause[start] && m.wordForms[end].some((f) => DECLINE_TAIL.has(f))) end++;
      for (let i = from; i < end; i++) drop.add(i);
    }
  };
  mark(CALL_WORDS, CALL_QUESTION, true);
  // (only a declined message: "will you send me the price?" asks for one)
  for (const { start, length } of occurrences(m, MESSAGE_WORDS)) {
    if (!negated(m, start) || drop.has(start)) continue;
    declinedCall = true;
    let end = start + length;
    while (end < m.words.length && m.clause[end] === m.clause[start] && m.wordForms[end].some((f) => DECLINE_TAIL.has(f))) end++;
    for (let i = negationBefore(m, start); i < end; i++) drop.add(i);
  }
  // "בלי טלפונים בבקשה", "אני לא עונה לטלפון", "no phone calls", "без звонков": the quote form asks for a phone number
  for (const { start, length } of occurrences(m, NO_CALLS)) {
    declinedCall = true;
    for (let i = start; i < start + length; i++) drop.add(i);
  }
  mark(QUOTE_NOUNS);
  const rest = m.words.filter((_, i) => !drop.has(i));
  return drop.size ? { rest: rest.join(' '), aboutCall, declinedCall } : null;
}

// ---- not about our glass ---------------------------------------------------------
// Things we don't make or install. A message about one of them without a glass word or one of our products is not
// ours, whatever it shares with an entry ("כמה עולה התקנת מזגן?", "how to remove limescale from my kettle",
// "my oven is broken"); "a mirror above the sink" names a product, so it stays ours
const FOREIGN_THINGS = list(
  'תנור', 'כיריים', 'oven', 'stove', 'cooker', 'فرن', 'غاز الطبخ', 'плита', 'плиту', 'духовка', 'духовку',
  'ארון', 'ארונות', 'ארון מטבח', 'מזגן', 'מזגנים', 'מקרר', 'מקררים', 'מחשב', 'מחשבים', 'טלוויזיה', 'מכונת כביסה', 'קומקום', 'דוד שמש',
  'פרקט', 'שטיח', 'שטיחים', 'אסלה', 'כיור', 'ברז', 'ברזים', 'גג', 'הגג', 'שיניים', 'חולצה', 'בגדים', 'קפה', 'מסעדה',
  'דירה למכירה', 'טלפון חדש', 'מטר בנייה', 'למטר בנייה', 'חשמלאי', 'אינסטלטור', 'שרברב',
  'closet', 'closets', 'wardrobe', 'cabinet', 'cabinets', 'air conditioner', 'fridge', 'refrigerator', 'computer', 'laptop', 'tv', 'television',
  'washing machine', 'kettle', 'parquet', 'flooring', 'carpet', 'toilet', 'sink', 'faucet', 'tap', 'roof', 'teeth',
  'shirt', 'clothes', 'clothing', 'coffee', 'restaurant', 'new phone', 'electrician', 'plumber',
  'apartment for sale', 'apartments for sale', 'apartments in', 'sea view', 'of an apartment', 'apartment prices',
  // the price of a square meter in a town is a home's ("how much is a square meter in haifa")
  'square meter in', 'square metre in', 'sqm in', 'квадратный метр в', 'квадратного метра в', 'متر مربع في', 'المتر المربع في',
  'خزانه', 'خزائن', 'مكيف', 'مكيفات', 'ثلاجه', 'براد', 'كمبيوتر', 'لابتوب', 'تلفزيون', 'غساله', 'غلايه', 'باركيه', 'سجاد', 'مرحاض', 'مغسله',
  'حنفيه', 'سطح', 'اسنان', 'ملابس', 'قهوه', 'مطعم', 'شقق', 'سعر الشقه', 'تلفون جديد', 'كهربجي', 'سباك',
  'asnan',
  'шкаф', 'шкафы', 'шкафа', 'кондиционер', 'кондиционера', 'холодильник', 'холодильника', 'компьютер', 'телевизор', 'стиральная машина',
  'чайник', 'чайнике', 'паркет', 'ковер', 'унитаз', 'раковина', 'смеситель', 'крыша', 'крышу', 'зубы', 'одежда',
  'одежды', 'кофе', 'ресторан', 'квартиры в', 'квартира с', 'метр квартиры', 'цена квартиры', 'новый телефон', 'гарантия на телефон', 'электрик', 'сантехник',
  // Real estate: the price, sale or appraisal of a home ("قديش سعر البيت بحيفا", "сколько стоит оценка квартиры")
  'עולה בית', 'עולה דירה', 'מחיר בית', 'מחיר דירה', 'מחירי דירות', 'מחירי בתים', 'בית למכירה', 'בתים למכירה', 'נדלן', 'הערכת שווי', 'שמאי', 'שמאות',
  'how much is a house', 'price of a house', 'cost of a house', 'house price', 'house prices', 'buy a house', 'house for sale', 'houses for sale',
  'real estate', 'property prices', 'house value', 'home value', 'property value', 'home appraisal', 'value of my house', 'value of my home',
  'سعر البيت', 'سعر بيت', 'سعر الدار', 'سعر دار', 'بيت للبيع', 'بيوت للبيع', 'سعر شقه', 'شقه للبيع', 'عقارات', 'سعر الارض', 'ارض للبيع', 'تخمين عقار',
  'цена дома', 'стоит дом', 'стоимость дома', 'купить дом', 'купить квартиру', 'дом на продажу', 'недвижимость', 'недвижимости',
  'оценка квартиры', 'оценку квартиры', 'оценка дома', 'оценку дома', 'оценка недвижимости', 'ремонт квартиры', 'ремонт квартир',
  // Insurance, travel, weddings and parties, security cameras ("بدي عرض سعر لتأمين السيارة", "хочу расчет стоимости свадьбы")
  'insurance', 'ביטוח', 'ביטוחים', 'تامين', 'التامين', 'ta2meen', 'tameen', 'страховка', 'страховку', 'страховки', 'страхование', 'страхования',
  'flights', 'plane ticket', 'plane tickets', 'airline', 'טיסה', 'טיסות', 'رحله', 'رحلات', 'تذكره طياره', 'перелет', 'авиабилет', 'авиабилеты', 'путевка', 'путевку',
  'wedding', 'weddings', 'bar mitzvah', 'catering', 'חתונה', 'חתונות', 'בר מצווה', 'קייטרינג', 'عرس', 'اعراس', 'زفاف', 'حفله', 'حفلات',
  'свадьба', 'свадьбы', 'свадьбу', 'банкет', 'кейтеринг',
  'security cameras', 'cctv', 'cameras', 'מצלמות', 'מצלמות אבטחה', 'كاميرات', 'كاميرات مراقبه', 'камеры', 'камер', 'видеонаблюдение', 'видеонаблюдения',
  // Websites and apps ("хочу смету на сайт", "a quote for a website design"); not "באתר" (on site) or "на сайте" (on our website)
  'website design', 'web design', 'mobile app', 'build a website', 'make a website', 'website for my business', 'בניית אתר', 'בניית אתרים', 'עיצוב אתר', 'אתר אינטרנט', 'אתר לעסק',
  'تصميم موقع', 'موقع الكتروني', 'موقع انترنت', 'ويب سايت', 'на сайт', 'для сайта', 'разработка сайта', 'разработку сайта', 'создание сайта', 'сделать сайт',
  // Household appliances (limescale in an iron or a coffee machine is not on shower glass)
  'מגהץ', 'מגהצים', 'מכונת קפה', 'מדיח', 'מדיח כלים', 'clothes iron', 'steam iron', 'flat iron', 'my iron', 'coffee machine', 'espresso machine', 'dishwasher',
  'مكوى', 'مكوايه', 'مكواه', 'ماكينه قهوه', 'ماكنه قهوه', 'جلايه', 'утюг', 'утюга', 'кофеварка', 'кофемашина', 'посудомойка', 'посудомоечная',
);
// Vehicles: a car's door, mirror or glass is not ours, even when the message names glass or one of our products
// ("дверь машины не закрывается", "is tinted glass legal for cars?") — unless the message is about premises
// (a car showroom, a garage) or street noise (acoustic glass)
const VEHICLES = list(
  'car', 'cars', 'my car', 'vehicle', 'vehicles', 'truck', 'trucks', 'motorcycle',
  'רכב', 'רכבים', 'אוטו', 'מכונית', 'מכוניות', 'משאית', 'משאיות', 'טנדר', 'אופנוע',
  'سياره', 'سيارات', 'سيارتي', 'شاحنه', 'تراك', 'sayara', 'sayyara', 'siyara',
  'машина', 'машины', 'машину', 'машине', 'машиной', 'машин', 'автомобиль', 'автомобиля', 'автомобилю', 'автомобиле', 'грузовик', 'грузовика', 'мотоцикл',
);
const PREMISES = list(
  'showroom', 'showrooms', 'show room', 'dealership', 'dealerships', 'dealer', 'dealers', 'garage', 'garages', 'car wash', 'parking', 'rental',
  'agency', 'office', 'offices', 'shop', 'shops', 'store', 'stores', 'business', 'businesses',
  'אולם תצוגה', 'אולמות תצוגה', 'סוכנות', 'סוכנויות', 'מוסך', 'מוסכים', 'שטיפת רכב', 'חניה', 'חניון', 'משרד', 'משרדים', 'חנות', 'חנויות', 'עסק', 'עסקים',
  'معرض', 'معارض', 'وكاله', 'كراج', 'جراج', 'مغسله سيارات', 'موقف', 'محل', 'محلات', 'مكتب', 'مكاتب', 'شركه',
  'автосалон', 'автосалона', 'автосалоне', 'салон', 'шоурум', 'гараж', 'автомойка', 'парковка', 'стоянка', 'офис', 'магазин',
);
// Appliances whose own glass (an oven door, a fireplace door, a fridge shelf) is not ours: an appliance word next to
// a glass, door or shelf word ("oven glass door", "דלת התנור", "стекло духовки", "زجاج الفرن") — not glass near one
// ("a backsplash behind the stove")
const APPLIANCES = list(
  'oven', 'ovens', 'stove', 'cooker', 'fireplace', 'microwave', 'fridge', 'refrigerator', 'dishwasher', 'washing machine',
  'תנור', 'התנור', 'כיריים', 'קמין', 'מיקרוגל', 'מקרר', 'המקרר', 'מדיח', 'מכונת כביסה',
  'فرن', 'الفرن', 'ميكروويف', 'ثلاجه', 'براد', 'جلايه', 'غساله', 'مدفاه', 'شومينه',
  'духовка', 'духовки', 'духовку', 'духовке', 'плита', 'плиты', 'плиту', 'камин', 'камина', 'камину', 'микроволновка', 'микроволновки', 'холодильник', 'холодильника', 'посудомойка', 'посудомойки',
);
const LINK_WORDS = new Set(list('of', 'for', 'the', 'my', 'our', 'a', 'in', 'של', 'для', 'от', 'у', 'в', 'на'));
const APPLIANCE_PART = /^~(glass|door|shelf)$/;
// Another trade's work on one of our products ("do you also do the plumbing for the shower?", "אינסטלציה למקלחת")
const TRADES = list(
  'plumbing', 'plumbing work', 'אינסטלציה', 'עבודות אינסטלציה', 'سباكه', 'تمديدات صحيه', 'сантехника', 'сантехнику', 'сантехнические работы',
);
// A wardrobe's, closet's or cupboard's door is the furniture's ("אתם עושים דלת זכוכית לארון?", "дверца шкафа не закрывается") — not
// a walk-in closet's ("glass door for my walk-in closet", "דלת הזזה לחדר ארונות")
const WARDROBES = list(
  'ארון', 'ארונות', 'ארונית', 'wardrobe', 'wardrobes', 'closet', 'closets', 'cupboard', 'cupboards', 'шкаф', 'шкафа', 'шкафу', 'шкафы', 'шкафов',
  'шкафчик', 'خزانه', 'خزائن', 'خزانات', 'خزاين', 'كبت', 'كبتات',
);
const WALK_IN = list('חדר ארונות', 'חדר הארונות', 'walk in closet', 'walk in closets', 'walk in wardrobe', 'гардеробная', 'гардеробную', 'гардеробной', 'غرفه ملابس', 'غرفه الملابس');
// Painting one of our products (a railing, a door) is not glass work: a painting word next to a product word ("how much
// to paint a railing", "покраска перил", "צביעה של מעקה") — not "we just finished painting everything". Not "צבע"/"color"
// or "painted": glass colors and back-painted glass are ours
const PAINTING = list(
  'paint', 'painting', 'repaint', 'repainting', 'צביעה', 'צביעת', 'לצבוע', 'לצבוע את', 'دهان', 'دهن', 'بويه', 'صبغ',
  'покраска', 'покраску', 'покраски', 'покрасить', 'перекрасить', 'покрасите',
);
const PAINTED_PART = /^~(shower|railing|mirror|storefront|partition|door|backsplash|shelf)$/;
// …and materials of things we don't make: a wooden door, a gypsum partition, an iron fence are not glass ones,
// even when the message names the product
const OTHER_MATERIALS = list(
  // (iron and metal words alone are hardware: "ברזל", "حديد", "low iron")
  'עץ', 'מעץ', 'גבס', 'מעקה ברזל', 'גדר ברזל', 'דלת ברזל', 'סורגים', 'פלדלת', 'פלסטיק', 'פוליקרבונט', 'פרספקס', 'מנעול', 'מנעולים', 'פעמון', 'אינטרקום',
  'wood', 'wooden', 'gypsum', 'drywall', 'plasterboard', 'iron railing', 'iron railings', 'iron fence', 'wrought iron', 'iron door', 'steel door',
  'plastic', 'polycarbonate', 'perspex', 'plexiglass', 'acrylic', 'lock', 'locks', 'door bell', 'doorbell', 'intercom', 'shower head', 'showerhead',
  // Armoured (steel security) doors: "باب مصفح", "פלדלת" (an armoured glass is "زجاج مصفح": glass is named then)
  'armored door', 'armoured door', 'armored doors', 'armoured doors', 'security door', 'metal door', 'דלת פלדה', 'דלתות פלדה', 'דלת ביטחון', 'דלת מיגון',
  'باب مصفح', 'ابواب مصفحه', 'بواب مصفحه', 'الباب المصفح', 'باب حماية', 'бронированная дверь', 'бронированную дверь', 'бронированной двери', 'бронедверь', 'бронедвери',
  'металлическая дверь', 'металлическую дверь', 'стальная дверь', 'стальную дверь',
  // railings of another material ("перила из нержавейки делаете?", "بتعملوا درابزين المنيوم؟"): ours are glass
  'перила из нержавейки', 'перила из нержавеющей стали', 'нержавеющие перила', 'перила из алюминия', 'алюминиевые перила', 'перила из металла',
  'металлические перила', 'кованые перила', 'درابزين المنيوم', 'درابزين الومنيوم', 'درابزين ستانلس', 'درابزين ستانلس ستيل', 'درابزين معدن',
  'aluminium railing', 'aluminium railings', 'aluminum railing', 'aluminum railings', 'stainless railing', 'stainless railings',
  'stainless steel railing', 'stainless steel railings', 'metal railing', 'metal railings', 'מעקה אלומיניום', 'מעקות אלומיניום', 'מעקה נירוסטה',
  'מעקות נירוסטה', 'מעקה מתכת', 'מעקות מתכת',
  'garden fence', 'fence for the garden', 'ראש מקלחת', 'ראש למקלחת', 'גדר לגינה', 'راس الدوش', 'سياج للجنينه', 'سياج الجنينه',
  'лейка', 'лейку', 'ограждение участка', 'ограждения участка', 'забор', 'забора', 'заборы',
  // Shower curtains and their rods (not "шторка" alone: a glass bath screen is also called that)
  'shower curtain', 'shower curtains', 'curtain rod', 'curtain rods', 'curtain rail', 'curtains', 'וילון למקלחת', 'וילון מקלחת', 'וילון לאמבטיה',
  'וילונות', 'بردايه', 'برادي', 'ستاره للحمام', 'ستاره الحمام', 'ستاره للشاور', 'карниз', 'карниза', 'карнизы', 'штора для ванной', 'шторы для ванной',
  // Arabizi ("drabzin 7adid" = an iron railing, "khashab" = wood)
  'drabzin 7adid', 'darabzin 7adid', 'drabzeen 7adid', 'bab 7adid', 'siyaj 7adid', 'shubbak 7adid', 'khashab', '5ashab', '5shab', 'jibs', 'jebs', 'blastik',
  'خشب', 'جبس', 'سياج حديد', 'باب حديد', 'شباك حديد', 'درابزين حديد', 'بلاستيك', 'قفل', 'اقفال', 'جرس',
  'дерево', 'дерева', 'деревянная', 'деревянные', 'деревянную', 'деревянный', 'гипсокартон', 'гипсокартона', 'железо', 'железный', 'железные',
  'пластик', 'пластиковые', 'поликарбонат', 'оргстекло', 'замок', 'замка', 'звонок',
);
// Russian lists name a word in one or two case forms: the others match by their ending stem ("лейки" — "лейка",
// "машины" — "машина"), as in the search (processTerm)
const ruStems = (word: string) => [processTerm(word) ?? []].flat().filter((t) => t.startsWith('='));
const CYRILLIC = /^[\u0400-\u04FF]+$/;
const stemSet = (items: string[]) => new Set(items.filter((i) => !i.includes(' ') && CYRILLIC.test(i)).flatMap(ruStems));
const FOREIGN_STEMS = stemSet(FOREIGN_THINGS);
const MATERIAL_STEMS = stemSet(OTHER_MATERIALS);
const VEHICLE_STEMS = stemSet(VEHICLES);
/** One of these words or phrases (glued prefixes allowed), or a Russian word of the same stem. */
function hasThing(m: MessageText, items: string[], ruStemSet: Set<string>): boolean {
  return has(m, items, true) || m.words.some((w) => CYRILLIC.test(w) && ruStems(w).some((t) => ruStemSet.has(t)));
}

/** A vehicle the message is about (see VEHICLES): not premises, nor the street noise of an acoustic glass question. */
export const aboutVehicle = (m: MessageText, acoustic = false) => !acoustic && hasThing(m, VEHICLES, VEHICLE_STEMS) && !has(m, PREMISES, true);

/** One of `items` next to a word with a concept of `part` (skipping up to two linking words: "the door of the oven"). */
function nextTo(m: MessageText, items: string[], part: RegExp): boolean {
  const isPart = (i: number) => [processTerm(m.words[i]) ?? []].flat().some((c) => part.test(c));
  return occurrences(m, items).some(({ start, length }) => {
    const near = (from: number, step: number) => {
      for (let i = from, links = 0; i >= 0 && i < m.words.length && m.clause[i] === m.clause[start] && links <= 2; i += step) {
        if (isPart(i)) return true;
        if (!LINK_WORDS.has(m.words[i])) return false;
        links++;
      }
      return false;
    };
    return near(start - 1, -1) || near(start + length, 1);
  });
}
/** An appliance's own glass, door or shelf (see APPLIANCES): unless the message is about a backsplash. */
const applianceGlass = (m: MessageText) => nextTo(m, APPLIANCES, APPLIANCE_PART);
// Furniture: glass for kitchen cabinets or a closet is the furniture's own, not one of our products — unless the
// message names one ("a mirror for the wardrobe door", "glass shelves in the closet")
const FURNITURE = list(
  'cabinet', 'cabinets', 'kitchen cabinet', 'kitchen cabinets', 'closet', 'closets', 'wardrobe', 'wardrobes', 'cupboard', 'cupboards', 'sideboard',
  'ארון', 'ארונות', 'ארון מטבח', 'ארונות מטבח', 'ארונית', 'ויטרינה לכלים', 'מזנון',
  'خزانه', 'خزائن', 'خزانات', 'كبت', 'كبتات', 'خزانه مطبخ', 'خزاين المطبخ', 'نملية',
  'шкаф', 'шкафа', 'шкафы', 'шкафов', 'шкафу', 'шкафчик', 'шкафчики', 'шкафчиков', 'буфет', 'сервант',
);
const FURNITURE_STEMS = stemSet(FURNITURE);
// …and the door or glass of a kitchen cabinet or cupboard ("glass for kitchen cabinet doors", "זכוכית לדלתות של ארונות
// המטבח") is the cabinet's, even though a door is one of our products (a walk-in closet's glass door is ours)
const CABINETS = list(
  'cabinet', 'cabinets', 'kitchen cabinet', 'kitchen cabinets', 'cupboard', 'cupboards', 'sideboard', 'ארון מטבח', 'ארונות מטבח', 'ארונות המטבח', 'ארונית',
  'خزانه مطبخ', 'خزاين المطبخ', 'خزائن المطبخ', 'كبت المطبخ', 'кухонный шкаф', 'кухонного шкафа', 'кухонных шкафов', 'шкафчик', 'шкафчика', 'шкафчиков',
);
const CABINET_PART = /^~(glass|door)$/;
const WARDROBE_STEMS = stemSet(WARDROBES);

// "Without": "…перила из нержавейки без стекла?" names glass only as what it is without
const WITHOUT_WORDS = new Set(list('without', 'no', 'בלי', 'ללא', 'без', 'بدون', 'بلا', 'غير'));
/** Every glass word of the message comes right after a "without" word. */
export const onlyWithoutGlass = (m: MessageText) => {
  const glass = m.words.map((w, i) => ([processTerm(w) ?? []].flat().includes('~glass') ? i : -1)).filter((i) => i >= 0);
  return glass.length > 0 && glass.every((i) => i > 0 && WITHOUT_WORDS.has(m.words[i - 1]));
};

/**
 * About things we don't make (see FOREIGN_THINGS, OTHER_MATERIALS), unless the message names glass (`glass`) or, for
 * things, one of our products (`product`); a vehicle or an appliance's own glass even then (see VEHICLES, APPLIANCES).
 */
export function foreignSubject(
  m: MessageText, glass: boolean, product: boolean, opts: { acoustic?: boolean; backsplash?: boolean; productBesidesDoor?: boolean; door?: boolean } = {},
): boolean {
  if (aboutVehicle(m, opts.acoustic) || (!opts.backsplash && applianceGlass(m)) || nextTo(m, PAINTING, PAINTED_PART) || has(m, TRADES, true)) return true;
  if (!product && hasThing(m, FURNITURE, FURNITURE_STEMS)) return true;
  if (!opts.productBesidesDoor && nextTo(m, CABINETS, CABINET_PART)) return true;
  if (opts.door && !opts.productBesidesDoor && hasThing(m, WARDROBES, WARDROBE_STEMS) && !has(m, WALK_IN, true)) return true;
  if (glass) return false;
  return hasThing(m, OTHER_MATERIALS, MATERIAL_STEMS) || (!product && hasThing(m, FOREIGN_THINGS, FOREIGN_STEMS));
}

// Where an order, a quote or an installer the visitor is waiting for is ("where are you with my quote?", "איפה אתם?
// המתקין לא הגיע", "الفني ما اجا", "мастер так и не пришел"): for the team, not our address or the lead times
const STATUS = list(
  'where are you with', 'where is my', 'wheres my', 'whats the status', 'what is the status', 'status of my', 'any update', 'any updates', 'any news',
  'still waiting', 'been waiting', 'its been', 'it has been', 'didnt come', 'didnt arrive', 'didnt show', 'never came', 'never showed', 'never arrived',
  'no one came', 'nobody came', 'hasnt arrived', 'hasnt come', 'havent heard', 'never called back', 'no one called', 'nobody called',
  'לא הגיע', 'לא הגיעו', 'לא הגיעה', 'לא באו', 'לא בא', 'עדיין מחכה', 'עדיין מחכים', 'עדיין לא קיבלתי', 'עוד לא קיבלתי', 'לא קיבלתי', 'מה קורה עם',
  'מה הסטטוס', 'מה המצב עם', 'איפה ההזמנה', 'איפה ההצעה', 'אף אחד לא', 'לא חזרו אליי', 'לא חזרתם',
  'ما اجا', 'ما اجو', 'ما حدا اجا', 'ما وصل', 'ما وصلت', 'ما وصلني', 'لسا بستنى', 'لسه بستنى', 'لهلا بستنى', 'لسا ما', 'لسه ما', 'شو صار مع', 'وين صار',
  'не пришел', 'не пришли', 'не приехал', 'не приехали', 'никто не пришел', 'никто не приехал', 'все еще жду', 'до сих пор жду', 'до сих пор не',
  'жду уже', 'так и не', 'что с моим', 'что с моей', 'что с заказом', 'какой статус', 'где мой', 'где моя',
);
// ("بعد ما اجا الفني" is "after the technician came")
const NOT_NEGATION_BEFORE = new Set(list('بعد', 'قبل', 'من', 'لما'));
export const asksStatus = (m: MessageText) =>
  occurrences(m, STATUS).some(({ start }) => !(m.words[start] === 'ما' && start > 0 && NOT_NEGATION_BEFORE.has(m.words[start - 1])));

// Removing or repairing scratches ("can you polish scratches out of glass?", "بتصلحوا خدش بزجاج الشاور؟"): no entry says
// whether we do — the care entries are about not scratching the glass, the breakage ones about broken glass
const SCRATCHES = list(
  'scratch', 'scratches', 'scratched', 'scratching', 'שריטה', 'שריטות', 'שרוט', 'שרוטה', 'שרוטים', 'خدش', 'خدوش', 'مخدوش', 'مخدوشه',
  'царапина', 'царапины', 'царапин', 'царапину', 'царапинами', 'поцарапано', 'поцарапал', 'поцарапалось', 'поцарапалась',
);
const REMOVE_OR_FIX = list(
  'fix', 'fixing', 'repair', 'repairing', 'remove', 'removing', 'removal', 'polish', 'polishing', 'polish out', 'get rid', 'buff', 'buffing', 'restore',
  'לתקן', 'מתקנים', 'תתקנו', 'תיקון', 'להוריד', 'מורידים', 'תורידו', 'להסיר', 'הסרת', 'ליטוש', 'ללטש', 'מלטשים', 'תלטשו',
  'تصليح', 'تصلحوا', 'بتصلحوا', 'تصلحو', 'بتصلحو', 'صلح', 'تشيلوا', 'بتشيلوا', 'تشيل', 'ازاله', 'تلميع', 'تلمعوا', 'بتلمعوا',
  'убрать', 'убираете', 'уберете', 'удалить', 'удаляете', 'удаление', 'отполировать', 'полировка', 'полируете', 'починить', 'исправить',
);
export const asksScratchRepair = (m: MessageText) => {
  const fixes = occurrences(m, REMOVE_OR_FIX);
  return occurrences(m, SCRATCHES).some(({ start }) => fixes.some((f) => m.clause[f.start] === m.clause[start]));
};

// Someone else's opening hours or phone number ("עד איזה שעה הסופר פתוח?", "the police's phone number")…
const THIRD_PARTY = list(
  'בנק', 'הבנק', 'דואר', 'הדואר', 'קניון', 'הקניון', 'סופר', 'הסופר', 'סופרמרקט', 'עירייה', 'העירייה', 'עיריית', 'משטרה', 'המשטרה',
  'בית חולים', 'קופת חולים', 'כללית', 'מכבי', 'מאוחדת', 'בזק', 'איקאה', 'ביטוח לאומי', 'מס הכנסה', 'המוקד העירוני', 'מוקד עירוני',
  'bank', 'post office', 'mall', 'supermarket', 'municipality', 'city hall', 'police', 'hospital', 'ikea', 'pharmacy', 'the shops', 'the stores',
  'بنك', 'البنك', 'البريد', 'البوسطه', 'المول', 'السوبرماركت', 'البلديه', 'بلديه', 'الشرطه', 'المستشفى', 'ايكيا',
  'банк', 'банка', 'почта', 'почты', 'почтой', 'торговый центр', 'супермаркет', 'муниципалитет', 'мэрия', 'полиция', 'полиции', 'больница',
  'больничная касса', 'икеа', 'магазины',
);
// …unless the message speaks to us ("your", "שלכם", "عندكم", "ваш")
const SECOND_PERSON = list(
  'you', 'your', 'u', 'ur', 'אתם', 'שלכם', 'לכם', 'אליכם', 'אתכם', 'איתכם', 'עמכם', 'אצלכם', 'מכם', 'انتو', 'انتم', 'عندكم', 'الكم', 'معكم', 'منكم', 'تبعكم', 'عندكو', 'الكو',
  'вы', 'ваш', 'ваша', 'ваше', 'ваши', 'вас', 'вам', 'вами',
);
// How many people work for us, whether we work as a team: the knowledge base doesn't say
const TEAM = list(
  'כמה עובדים', 'כמה מתקינים', 'כמה אנשים', 'עובדים בצוות', 'how many employees', 'how many workers', 'how many installers',
  'how many people work', 'сколько сотрудников', 'сколько у вас сотрудников', 'сколько мастеров', 'сколько работников', 'كم عامل', 'كم موظف',
  'كم واحد بشتغل',
);
export const aboutTheTeam = (m: MessageText) => has(m, TEAM, true);

// Selling glass to the trade ("do you sell glass to other glaziers?", "מוכרים בסיטונאות?"): for the team
const SELL = list('sell', 'selling', 'מוכרים', 'למכור', 'מוכר', 'продаете', 'продать', 'продаж', 'بتبيعوا', 'بتبيعو', 'تبيعوا', 'بيع');
const TRADE_BUYERS = list(
  'glaziers', 'other glaziers', 'wholesale', 'זגגים', 'סיטונאי', 'סיטונאות', 'стекольщикам', 'стекольщиков', 'оптом', 'оптовые', 'زجاجين', 'بالجمله', 'جمله',
);
export const sellsToTrade = (m: MessageText) => has(m, SELL, true) && has(m, TRADE_BUYERS, true);

/** The message speaks to us ("your", "שלכם", "عندكم", "ваш"). */
export const speaksToUs = (m: MessageText) => has(m, SECOND_PERSON);

/** A question about someone else (a bank, the post office, the police), not about us. */
export const aboutSomeoneElse = (m: MessageText) => has(m, THIRD_PARTY, true) && !speaksToUs(m);

// "I want to measure it myself first": the visitor measures, not us
const SELF = list('myself', 'ourselves', 'by myself', 'בעצמי', 'בעצמנו', 'لحالي', 'بنفسي', 'لحالنا', 'сам', 'сама', 'самостоятельно');

// Looking for (or the price of) another professional: "can you recommend an interior designer?", "ищу дизайнера
// интерьера", "כמה עולה קבלן שיפוצים?" — not "do you work with contractors?" or "a price for contractors"
const PROFESSIONALS = list(
  'קבלן', 'מעצב', 'מעצבת', 'אדריכל', 'אדריכלית', 'contractor', 'builder', 'designer', 'architect', 'agent',
  'مقاول', 'مصمم', 'مصممه', 'معماري', 'подрядчик', 'подрядчика', 'дизайнер', 'дизайнера', 'архитектор', 'архитектора', 'строитель', 'прораб',
);
const SEEKING = list(
  'recommend a', 'recommend an', 'looking for a', 'looking for an', 'need a good', 'best', 'מומלץ', 'מומלצת', 'תמליצו', 'ממליצים על', 'מחפש', 'מחפשת',
  'טוב', 'טובה', 'بدور على', 'بدي', 'بتنصحوني', 'احسن', 'ищу', 'посоветуйте', 'порекомендуйте', 'хороший',
);
/** Looking for another professional, or asking what one costs ("for contractors" — "לקבלנים", "للمقاولين" — is a price for them). */
const PRO_SELF = list(
  'אני קבלן', 'אני אדריכל', 'אני אדריכלית', 'אני מעצב', 'אני מעצבת', 'im a', 'i am a', 'we are a', 'انا مقاول', 'انا مصمم', 'انا معماري',
  'я подрядчик', 'я архитектор', 'я дизайнер', 'мы подрядчики', 'עם קבלנים', 'with contractors', 'مع المقاولين', 'مع مقاولين', 'с подрядчиками',
);
export function seeksProfessional(m: MessageText): boolean {
  const pros = occurrences(m, PROFESSIONALS);
  if (!pros.length || has(m, PRO_SELF, true)) return false;
  const prices = occurrences(m, PRICE).map(({ start, length }) => start + length);
  const priced = pros.some(({ start }) => prices.some((end) => end <= start && start - end <= 1));
  return has(m, SEEKING, true) || priced;
}

// A glazier, supplier or installer presenting themselves or offering us their services or a quote ("אני ספק זכוכית,
// רוצה לתת לכם הצעת מחיר", "אני זגג עם 10 שנות ניסיון", "we supply tempered glass, can we offer you a price?"): not a
// customer's question — unlike a contractor or an architect, who orders from us (PRO_SELF)
const PROVIDER_SELF = list(
  'אני זגג', 'אנחנו זגגים', 'אני ספק', 'אנחנו ספק', 'אנחנו ספקים', 'ספק זכוכית', 'ספקי זכוכית', 'אני מתקין זכוכית', 'אני יבואן', 'אנחנו יבואנים',
  'אנחנו יבואן', 'אנחנו מפעל', 'מחפש עבודה כזגג', 'מחפש עבודה כמתקין',
  'im a glazier', 'i am a glazier', 'we are glaziers', 'im a supplier', 'i am a supplier', 'we are a supplier', 'we are suppliers', 'glass supplier', 'glass suppliers',
  'we supply glass', 'im a glass installer', 'i am a glass installer', 'we are a glass factory', 'we are importers',
  'انا مورد', 'احنا موردين', 'نحن موردين', 'مورد زجاج', 'موردين زجاج', 'انا معلم زجاج', 'انا مركب زجاج', 'احنا مصنع زجاج',
  'я стекольщик', 'я поставщик', 'мы поставщик', 'мы поставщики', 'поставщик стекла', 'поставщики стекла', 'мы производитель стекла', 'я мастер по стеклу',
  // tradespeople presenting themselves ("я мастер по установке стекла, мой номер…", "انا فني تركيب، رقمي…")
  'я мастер по', 'я монтажник', 'я установщик', 'я стекольщик по', 'انا فني', 'انا فني تركيب', 'انا معلم تركيب', 'انا مركب', 'انا بركب زجاج',
  'im an installer', 'i am an installer', 'im a glass fitter', 'i am a glass fitter', 'אני מתקין מקלחונים', 'אני מתקין מעקות',
);
const OFFER_TO_US = list(
  'לתת לכם הצעת מחיר', 'לתת לכם הצעה', 'להציע לכם', 'להציע לך', 'אציע לכם', 'נציע לכם', 'לעבוד בשבילכם', 'לעבוד איתכם כקבלן',
  'offer you', 'give you a quote', 'give you a price', 'quote you', 'work for you as', 'supply you',
  'اعرض عليكم', 'نعرض عليكم', 'اقدملكم', 'اقدم لكم', 'نقدم لكم', 'اعطيكم عرض', 'نعطيكم عرض',
  'предложить вам', 'предлагаю вам', 'предлагаем вам', 'поставлять вам',
);
/**
 * Offers us services or a quote, or presents a glass trade (see PROVIDER_SELF) — the latter unless the message asks
 * about something we sell (`asksOurs`: a product, a price, a quote): a glazier may also order from us ("אני זגג, צריך
 * מקלחון"), but one who only names the trade and a number doesn't ask anything ("אני מתקין מקלחונים, הטלפון שלי 054…").
 */
export const offersServices = (m: MessageText, asksOurs: boolean) =>
  has(m, OFFER_TO_US, true) || (has(m, PROVIDER_SELF, true) && (!asksOurs || !asksSomething(m)));
/** A question, a request, a need or a price asked. */
const asksSomething = (m: MessageText) => m.question || requestAsked(m) || quoteNounAsked(m) || asked(m, MAYBE_REQUEST_VERBS) || has(m, PRICE);

// "Do you do / have / install mirrors?": a product and nothing asked about it (see existenceQuestion)
const EXISTENCE_VERBS = list(
  'do', 'have', 'make', 'sell', 'install', 'offer', 'provide', 'supply', 'carry', 'fit', 'work with', 'deal with',
  'יש', 'עושים', 'מתקינים', 'מוכרים', 'מייצרים', 'מכינים', 'מספקים', 'מבצעים', 'מציעים', 'עובדים עם', 'מתעסקים עם',
  'بتعملوا', 'بتعملو', 'تعملوا', 'تعملو', 'عندكم', 'عندكو', 'بتركبوا', 'بتركبو', 'تركبوا', 'بتبيعوا', 'بتبيعو', 'بتصنعوا', 'بتصنعو', 'بتسووا', 'بتسوو',
  'بتشتغلوا', 'بتشتغلو', '3andkom', '3ndkom', 'bt3mlo', 'bt3mlu', 'bta3mlo',
  'делаете', 'есть', 'устанавливаете', 'ставите', 'продаете', 'изготавливаете', 'производите', 'монтируете', 'занимаетесь', 'предлагаете',
);
const EXISTENCE_FILLER = new Set(list(
  'you', 'u', 'guys', 'ya', 'also', 'too', 'any', 'as', 'well', 'some', 'there', 'a', 'an', 'the',
  'אתם', 'לכם', 'גם', 'האם', 'אצלכם', 'בכלל', 'גם כן',
  'انتو', 'انتم', 'كمان', 'برضو', 'هل', 'في', 'شي',
  'вы', 'у', 'вас', 'также', 'тоже', 'ли', 'а', 'и',
).flatMap((p) => p.split(' ')));
const EXISTENCE_WORDS = new Set(EXISTENCE_VERBS.flatMap((p) => p.split(' ')));
/**
 * Only asks whether we do, have or install something: an existence verb, filler, and words for which `ours(i)` is true
 * (the product, glass and install words — decided by the caller from their concepts). "יש לכם מראות?", "do you also do
 * railings?", "بتعملوا كمان مرايات؟" — not "do you do mirrors for gyms?" or "do mirrors fog up?".
 */
export function existenceQuestion(m: MessageText, ours: (i: number) => boolean): boolean {
  if (!m.words.length || !occurrences(m, EXISTENCE_VERBS).length) return false;
  return m.words.every((w, i) => ours(i) || m.wordForms[i].some((f) => EXISTENCE_WORDS.has(f) || EXISTENCE_FILLER.has(f)));
}

/** A shop or a store as premises ("חנות", "store", "محل", "магазин"): alone it is a shop, not a shop front. */
export const isPremisesWord = (word: string) => [word, ...stems(word)].some((w) => PREMISES_WORDS.has(w));
/** One shop or store, as ours can be ("store hours") — not shops in general ("חנויות פתוחות בשישי"). */
export const isOnePremises = (word: string) => [word, ...stems(word)].some((w) => ONE_PREMISES.has(w));
const ONE_PREMISES = new Set(list('shop', 'store', 'showroom', 'חנות', 'محل', 'магазин', 'магазина', 'магазине'));
const PREMISES_WORDS = new Set(list(
  'shop', 'shops', 'store', 'stores', 'חנות', 'חנויות', 'محل', 'محلات', 'магазин', 'магазина', 'магазине', 'магазины', 'магазинов', 'магазину',
));

// Words that describe the product a visitor wants, not a question about it ("بدي مراية جديدة محل المراية القديمة")
const DESCRIPTORS = new Set(list(
  'new', 'old', 'another', 'replacement', 'instead', 'one',
  'חדש', 'חדשה', 'חדשים', 'חדשות', 'ישן', 'ישנה', 'הישן', 'הישנה', 'במקום', 'עוד', 'נוסף', 'נוספת',
  'جديد', 'جديده', 'قديم', 'قديمه', 'بدل', 'محل', 'كمان', 'تاني', 'ثاني', 'واحد', 'وحده',
  'новый', 'новое', 'новую', 'новая', 'новые', 'старый', 'старое', 'старую', 'старая', 'старые', 'вместо', 'еще', 'одну', 'один',
));
export const isDescriptor = (word: string) => [word, ...stems(word)].some((w) => DESCRIPTORS.has(w));

// "My neighbour recommended you", "ממליץ בחום": a remark, not a question
const RECOMMENDED = list(
  'recommended you', 'recommend you', 'highly recommend', 'המליץ עליכם', 'המליצה עליכם', 'המליצו עליכם', 'ממליץ עליכם', 'ממליצה עליכם',
  'ממליץ בחום', 'ממליצה בחום', 'מומלצים בחום', 'מומלץ בחום', 'بنصح فيكم', 'نصحني فيكم', 'نصحوني فيكم', 'بنصح فيك',
  'рекомендую вас', 'вас рекомендовали', 'вас посоветовали', 'очень рекомендую', 'рекомендую вашего',
);
export const isRemark = (m: MessageText) => !m.question && has(m, RECOMMENDED, true);

// ---- what a question asks -------------------------------------------------------
// How, what with, which: a question about how something is done ("איך מנקים…", "what do you recommend for cleaning…")
const HOW = new Set(list(
  'how', 'what', 'which', 'why', 'whats', 'איך', 'כיצד', 'במה', 'מה', 'באיזה', 'באיזו', 'איזה', 'איזו', 'למה', 'מדוע',
  'كيف', 'شو', 'ايش', 'بشو', 'بايش', 'ليش', 'شلون', 'как', 'чем', 'что', 'какой', 'какая', 'какое', 'какие', 'каким', 'почему', 'зачем',
));
export const asksHow = (m: MessageText) => m.wordForms.some((forms) => forms.some((f) => HOW.has(f)));
// Second person plural verbs: "بتعملوا", "بتنظفوا", "بتقصوا"; "делаете", "чистите"
const AR_YOU_VERB = /^(ب|م)?ت[\u0621-\u064A]{2,}(وا|و)$/;
const RU_YOU_VERB = /^[\u0400-\u04FF]{3,}(ете|ите)$/;
/** Speaks to us: "you", "אתם", "вы" (see speaksToUs), or a second-person verb. */
const toUs = (m: MessageText) => speaksToUs(m) || m.words.some((w) => AR_YOU_VERB.test(w) || RU_YOU_VERB.test(w));
// ("is there…?" is not "do you…?")
const THERE_IS = list('יש', 'есть', 'have', 'there');
/** Asks whether we do something: speaks to us ("do you clean…", "אתם מנקים…", "بتعملوا صيانة…?") or "do / make / install…?". */
export const asksIfWeDo = (m: MessageText) => toUs(m) || (has(m, EXISTENCE_VERBS) && !has(m, THERE_IS));
/** "Do you do / make / install…?" (not how: "how do you clean…?"): whether we offer something. */
export const asksIfWeMake = (m: MessageText) => has(m, EXISTENCE_VERBS) && toUs(m) && !asksHow(m);
// Removing something from glass ("how do I remove glue from the mirror?", "איך מורידים דבק מהמראה")
const REMOVE = list(
  'remove', 'removing', 'get rid of', 'take off', 'להוריד', 'מורידים', 'מוריד', 'מורידה', 'להסיר', 'מסירים', 'מסיר', 'הסרה',
  'اشيل', 'نشيل', 'بشيل', 'تشيل', 'ازيل', 'نزيل', 'ازاله', 'убрать', 'удалить', 'отмыть', 'оттереть', 'снять', 'удаляется', 'убирается',
);
export const asksRemoval = (m: MessageText) => has(m, REMOVE, true);
// A photo as the way to get a price ("price from a photo", "אשלח תמונה", "по фото") — not as the thing priced ("כמה עולה
// זכוכית לתמונה", "قديش سعر برواز للصورة", "сколько стоит фото?")
const SEND = list(
  'send', 'sending', 'sent', 'upload', 'attach', 'whatsapp', 'לשלוח', 'אשלח', 'שולח', 'שולחת', 'נשלח', 'תשלחו', 'שלחתי', 'וואטסאפ', 'ווטסאפ',
  'ابعت', 'ابعتلكم', 'ابعتلك', 'بعتلك', 'بعتلكم', 'بعتت', 'ارسل', 'ارسال', 'بعت', 'واتس', 'واتساب',
  'отправить', 'отправлю', 'отправляю', 'скинуть', 'скину', 'пришлю', 'прислать', 'присылаю', 'ватсап', 'вотсап',
);
const BY_MEANS = new Set(list('by', 'from', 'via', 'with', 'using', 'through', 'off', 'לפי', 'דרך', 'פי', 'по', 'с', 'через', 'من', 'حسب', 'بواسطه', 'طريق'));
export const photoIsTheMeans = (m: MessageText) => {
  if (has(m, SEND, true)) return true;
  return m.words.some((w, i) => {
    if (![processTerm(w) ?? []].flat().includes('~photo')) return false;
    // (a glued "by"/"from": "בתמונה", "מתמונה", "بصوره")
    const glued = /^[במ][\u05D0-\u05EA]/.test(w) || /^ب[\u0621-\u064A]/.test(w);
    return (glued && stems(w).some((st) => [processTerm(st) ?? []].flat().includes('~photo'))) || (i > 0 && BY_MEANS.has(m.words[i - 1]));
  });
};
// A window (not a shop window: "חלון ראווה", "shop window", "витрина"): windows are not one of our products
const WINDOWS = new Set(list(
  'חלון', 'חלונות', 'window', 'windows', 'окно', 'окна', 'окон', 'окне', 'окнах', 'окнам', 'شباك', 'شبابيك', 'نافذه', 'نوافذ', 'شباكين',
));
const SHOP_WINDOW_NEXT = new Set(list('ראווה', 'הראווה', 'عرض'));
const SHOP_WINDOW_BEFORE = new Set(list('shop', 'store', 'display', 'storefront'));
export const plainWindow = (m: MessageText) =>
  m.wordForms.some((forms, i) => forms.some((f) => WINDOWS.has(f)) && !SHOP_WINDOW_NEXT.has(m.words[i + 1] ?? '') && !SHOP_WINDOW_BEFORE.has(m.words[i - 1] ?? ''));

/**
 * One of these words or phrases, outside the phrases where it means something else (PHRASE_MASKS in synonyms.ts:
 * "אתם פתוחים להצעות?" is not about opening hours, "עד איפה עולה החיפוי?" not a price).
 */
function hasUnmasked(m: MessageText, items: string[], concept: string): boolean {
  const spans = maskedSpans(m.words).filter((s) => s.concept === `~${concept}`);
  if (!spans.length) return has(m, items);
  return occurrences(m, items).some(({ start, length }) => !spans.some((s) => start < s.to && start + length > s.from));
}

export const isPriceQuestion = (m: MessageText) => hasUnmasked(m, PRICE, 'price');
export const isHoursQuestion = (m: MessageText) => hasUnmasked(m, HOURS, 'hours');

// A person who asks about the people who measure or install ("does the representative who measures also install?",
// "ваш менеджер сам делает замер?") doesn't ask to talk to someone: the contact words that only name a person count
// only without such a job
const CONTACT_PERSON = list(
  'human', 'representative', 'real person', 'live agent', 'an agent', 'נציג', 'נציגה', 'בן אדם', 'מוקד',
  'موظف', 'بني ادم', 'ممثل خدمه', 'ممثل الشركه', 'оператор', 'менеджер', 'живой человек',
);
const PERSON_JOB = list(
  'measure', 'measures', 'measuring', 'measurement', 'install', 'installs', 'installing', 'installation', 'installer', 'installers',
  'מודד', 'מודדים', 'למדוד', 'מדידה', 'למדידה', 'מתקין', 'מתקינים', 'להתקין', 'התקנה', 'להתקנה',
  'بيقيس', 'يقيس', 'قياس', 'للقياس', 'بيركب', 'يركب', 'تركيب', 'للتركيب', 'فني', 'الفني', 'معلم',
  'замер', 'замеры', 'замерщик', 'замеряет', 'мерить', 'устанавливает', 'установка', 'установку', 'монтаж', 'монтирует', 'мастер', 'монтажник',
);
export const isContactQuestion = (m: MessageText) => {
  if (!has(m, CONTACT)) return false;
  const person = new Set(occurrences(m, CONTACT_PERSON).map((o) => o.start));
  const other = occurrences(m, CONTACT).some((o) => !person.has(o.start));
  return other || !has(m, PERSON_JOB, true);
};

/** Whether a place starts at word `i`: a city, a town known to the dictionary, a region word or "my area". */
function placeAt(m: MessageText, i: number): boolean {
  if (phraseStarts(m, MY_AREA, true).includes(i)) return true;
  if (contextPlaceAt(m, i)) return true;
  const words = m.words.slice(i, i + 2);
  if (cityNames.some(({ name }) => (name.includes(' ') ? ` ${words.join(' ')} `.includes(` ${name} `) : m.wordForms[i].includes(name)))) return true;
  return tokenize(words.join(' ')).flatMap((t) => [processTerm(t) ?? []].flat()).some((c) => c.startsWith('~city-') || PLACE_CONCEPT.test(c));
}

/** Index of the word right after a regex match in the padded message. */
function wordAfter(m: MessageText, match: RegExpExecArray): number {
  const before = m.padded.slice(0, match.index + match[0].length).trim();
  return before ? before.split(' ').length : 0;
}

/**
 * A coverage question: "where do you work?" (no `slot`), or "do you work in / come to X?" with X at word
 * `slot` (Hebrew glues the preposition: "אתם עובדים בירוחם?"). "…גם ב/ל…" ("do you also…") counts only
 * before a place; the visitor's own town ("באזור שלי", "my area") only with a coverage verb, or alone.
 */
export function cityQuestion(m: MessageText): { slot?: number } | null {
  const he = HE_CITY_QUESTION.exec(m.padded);
  // "איך מגיעים לחיפה?" asks the way there
  if (he && /(^| )ו?איך $/.test(m.padded.slice(0, he.index + he[1].length))) return null;
  if (he) return { slot: wordAfter(m, he) };
  const also = HE_CITY_QUESTION_ALSO.exec(m.padded);
  if (also && placeAt(m, wordAfter(m, also))) return { slot: wordAfter(m, also) };
  const [start] = phraseStarts(m, CITY_QUESTION);
  if (start !== undefined) {
    const phrase = CITY_QUESTION.find((p) => phraseStarts(m, [p]).includes(start))!;
    let slot = start + phrase.split(' ').length;
    while (slot < m.words.length - 1 && ARTICLES.has(m.words[slot])) slot++;
    return { slot };
  }
  if (has(m, AREAS_QUESTION)) return {};
  return has(m, MY_AREA, true) && (has(m, COVERAGE_VERBS) || restAfter(m, MY_AREA) === 0) ? {} : null;
}
const ARTICLES = new Set(['the', 'a', 'an', 'your', 'my', 'ع', 'على', 'عل', 'لعند']);
export const looksOutOfScope = (m: MessageText) => has(m, OUT_OF_SCOPE, true);

/** The message names the visitor's own town ("my area", "בעיר שלנו"): a place for a coverage question. */
export const namesOwnArea = (m: MessageText) => has(m, MY_AREA, true);

/** Synonym concepts for places (cities have their own "~city-…" concepts). */
export const PLACE_CONCEPT = /^~(region|village|far|nationwide|location)$/;

// ---- cities -----------------------------------------------------------------

const conceptOf = (slug: string) => `~city-${slug}`;
const cityConcepts = (text: string) => tokenize(text).flatMap((t) => [processTerm(t) ?? []].flat()).filter((c) => c.startsWith('~city-'));
const cityNames: { slug: LocationKey; name: string }[] = [];
/** Neighbourhood names of the city pages: a place, but alone not a question about where we work ("נווה צדק"). */
const NEIGHBOURHOODS = new Set<string>();
for (const slug of LOCATION_SLUGS) {
  const loc = LOCATIONS[slug];
  for (const a of [...loc.areas, ...loc.areasHe]) NEIGHBOURHOODS.add(splitWords(normalizeText(a)).join(' '));
  // City names, and only multi-word neighbourhoods: single-word ones are often everyday words or first names
  // (רמות = levels, קדימה = forward, Omer, Hadar, Dora). And only those the synonym dictionary gives to this city:
  // "Old City" and "German Colony" are also in other cities
  const areas = [...loc.areas, ...loc.areasHe].filter((a) => a.trim().includes(' ') && cityConcepts(a).includes(conceptOf(slug)));
  for (const name of [...Object.values(loc.name), ...areas]) {
    cityNames.push({ slug, name: splitWords(normalizeText(name)).join(' ') });
  }
}

// Place names that are also everyday words or first names (synonyms.ts `contextTerms`: "רחובות" = streets, "ערד",
// "كرمل", "يافا"): a place only where a place is asked about — after "do you work in / come to…" or "I live in…"
const contextPlaces: { concept: string; words: string[] }[] = SYNONYM_GROUPS.flatMap((g) =>
  (g.contextTerms ?? []).map((t) => ({ concept: `~${g.concept}`, words: splitWords(normalizeText(t)) })));
// "I live in…", "I'm from…" ("אני גרה ברחובות", "ساكن بعراد", "живу в Араде")
const LIVE_IN = list('גר', 'גרה', 'גרים', 'גרות', 'מתגורר', 'מתגוררת', 'live in', 'lives in', 'living in', 'based in', 'im from', 'i am from', 'ساكن', 'ساكنه', 'ساكنين', 'عايش', 'живу в', 'живем в', 'живём в', 'я из', 'мы из');
/** The concept of a context place (see contextPlaces) at word `i`, if one starts there. */
function contextPlaceAt(m: MessageText, i: number): string | undefined {
  return contextPlaces.find(({ words }) => i + words.length <= m.words.length && words.every((w, j) => (j === 0 ? m.wordForms[i].includes(w) : m.words[i + j] === w)))?.concept;
}
/** A context place where the message asks about one: at the coverage question's slot, or right after "I live in". */
function askedContextPlace(m: MessageText): string | undefined {
  const slot = cityQuestion(m)?.slot;
  if (slot !== undefined) {
    const c = contextPlaceAt(m, slot);
    if (c) return c;
  }
  for (const { start, length } of occurrences(m, LIVE_IN)) {
    const at = start + length;
    const c = at < m.words.length ? contextPlaceAt(m, at) ?? (ARTICLES.has(m.words[at]) || m.words[at] === 'в' ? contextPlaceAt(m, at + 1) : undefined) : undefined;
    if (c) return c;
  }
  return undefined;
}

/** Words of the message that are part of a place name (a city, a town, a neighbourhood, a region). */
function placeWordIndexes(m: MessageText): Set<number> {
  const found = new Set<number>();
  const isPlace = (c: string) => c.startsWith('~city-') || PLACE_CONCEPT.test(c);
  // A phrase's concept token (tokenize adds one per synonym phrase in the text)
  const phrase = (ws: string[]) => ws.length > 1 && tokenize(ws.join(' ')).some((t) => t.startsWith('~') && isPlace(t));
  m.words.forEach((w, i) => {
    if ([processTerm(w) ?? []].flat().some(isPlace) || cityNames.some(({ name }) => !name.includes(' ') && m.wordForms[i].includes(name))) found.add(i);
  });
  for (let len = 2; len <= 4; len++) {
    for (let i = 0; i + len <= m.words.length; i++) {
      const span = m.words.slice(i, i + len);
      const named = cityNames.some(({ name }) => name === span.join(' '));
      if (named || (phrase(span) && !phrase(span.slice(1)) && !phrase(span.slice(0, -1)))) for (let j = i; j < i + len; j++) found.add(j);
    }
  }
  return found;
}

// Words that go with a place in a message that only asks whether we work there ("גם בחיפה?", "ומה עם נתניה",
// "haifa area", "я живу в Хайфе") — anything else is another question ("נפל טיל בחיפה", "yoga classes in haifa")
const PLACE_TALK = new Set(list(
  'גם', 'ומה', 'מה', 'עם', 'לגבי', 'אזור', 'באזור', 'האזור', 'לאזור', 'סביבה', 'הסביבה', 'והסביבה', 'בסביבה', 'בסביבת', 'סביבת', 'ליד', 'קרוב', 'קרובה',
  'אני', 'אנחנו', 'גר', 'גרה', 'גרים', 'גרות', 'עובדים', 'מגיעים', 'מגיע', 'מתקינים', 'משרתים', 'באים', 'אתם', 'לשם', 'שם', 'עד', 'כולל', 'רק', 'עיר', 'העיר', 'בעיר',
  'שירות', 'נותנים', 'אצל', 'אצלנו', 'אפשר', 'וגם', 'או', 'ו', 'שלום', 'היי', 'תודה',
  'in', 'to', 'at', 'near', 'around', 'area', 'region', 'district', 'also', 'too', 'what', 'about', 'how', 'and', 'or', 'i', 'im', 'we', 'live', 'living',
  'from', 'there', 'city', 'you', 'do', 'does', 'work', 'come', 'serve', 'cover', 'install', 'is', 'it', 'available', 'service', 'ok', 'hi', 'hello',
  'كمان', 'برضو', 'منطقه', 'المنطقه', 'بمنطقه', 'جنب', 'قريب', 'حوالين', 'انا', 'احنا', 'ساكن', 'ساكنه', 'شو', 'بالنسبه', 'طيب', 'او', 'و', 'وين', 'هل', 'مرحبا',
  'بتشتغلوا', 'بتشتغلو', 'تشتغلوا', 'بتيجوا', 'بتيجو', 'بتوصلوا', 'بتوصلو', 'بتركبوا', 'بتخدموا', 'ع', 'على', 'عند', 'لعند',
  'также', 'тоже', 'район', 'районе', 'рядом', 'около', 'возле', 'я', 'мы', 'живу', 'живем', 'из', 'насчет', 'город', 'городе', 'область', 'области',
  'окрестности', 'работаете', 'приезжаете', 'приедете', 'выезжаете', 'обслуживаете', 'устанавливаете', 'а', 'и', 'там', 'здравствуйте', 'привет',
));
/**
 * A message that names a place and nothing else ("חיפה?", "ובנתניה?", "Haifa area", "живу в Хайфе"): only place
 * words and the words of PLACE_TALK. A neighbourhood alone is not enough ("נווה צדק", "יפו העתיקה" are places
 * people talk about for other reasons).
 */
export function onlyPlace(m: MessageText): boolean {
  const places = placeWordIndexes(m);
  const talk = (i: number) => m.wordForms[i].some((f) => PLACE_TALK.has(f)) || processTerm(m.words[i]) === null || /^\d+$/.test(m.words[i]);
  if (!places.size || !m.words.every((_, i) => places.has(i) || talk(i))) return false;
  const named = m.words.filter((_, i) => places.has(i)).join(' ');
  return !NEIGHBOURHOODS.has(named) && !(m.words.length === 1 && NEIGHBOURHOODS.has(m.words[0]));
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
  const context = askedContextPlace(m);
  for (const c of context ? [...concepts, context] : concepts) {
    if (!c.startsWith('~city-')) continue;
    const key = c.slice('~city-'.length).replace(/-/g, '');
    const slug = LOCATION_SLUGS.find((s) => s.replace(/-/g, '') === key);
    return slug ? { slug } : { other: true };
  }
  return null;
}

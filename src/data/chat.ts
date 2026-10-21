/**
 * Chat assistant — localized UI strings.
 * The launcher strings are separate so the always-loaded button stays tiny; the
 * rest is only downloaded with the chat panel.
 */
import type { LocalizedText, SupportedLocale } from './types';

export const CHAT_LAUNCHER_STRINGS = {
  /** Floating button (desktop). */
  label: { he: 'שאלו את ה-AI שלנו', en: 'Ask our AI', ar: 'اسأل الذكاء الاصطناعي', ru: 'Спросите наш ИИ' },
  /** Greeting bubble shown once per session next to the launcher. */
  greeting: {
    he: 'היי! שאלות על מקלחונים, מעקות או מראות? שאלו אותי 👋',
    en: 'Hi! Questions about showers, railings or mirrors? Ask me 👋',
    ar: 'مرحباً! لديك أسئلة عن كبائن الدش أو الدرابزين أو المرايا؟ اسألني 👋',
    ru: 'Здравствуйте! Вопросы о душевых, перилах или зеркалах? Спросите меня 👋',
  },
  dismiss: { he: 'סגירת ההודעה', en: 'Dismiss', ar: 'إغلاق الرسالة', ru: 'Закрыть сообщение' },
  loading: { he: "פותח את הצ'אט…", en: 'Opening the chat…', ar: 'جارٍ فتح المحادثة…', ru: 'Открываем чат…' },
} satisfies Record<string, LocalizedText>;

export type ChatLauncherStrings = { [K in keyof typeof CHAT_LAUNCHER_STRINGS]: string };

export function getChatLauncherStrings(locale: SupportedLocale): ChatLauncherStrings {
  return Object.fromEntries(Object.entries(CHAT_LAUNCHER_STRINGS).map(([k, v]) => [k, v[locale]])) as ChatLauncherStrings;
}

export const CHAT_STRINGS = {
  title: {
    he: 'העוזר של אחים שוואקי',
    en: 'Shwaki Brothers Assistant',
    ar: 'مساعد شويكي اخوان',
    ru: 'Ассистент «Братья Шваки»',
  },
  online: { he: 'מחוברים עכשיו', en: 'Online now', ar: 'متصلون الآن', ru: 'Сейчас на связи' },
  offline: {
    he: 'לא מחוברים — נחזור ביום העסקים הבא',
    en: 'Offline — we reply next business day',
    ar: 'غير متصلين — نرد في يوم العمل التالي',
    ru: 'Не в сети — ответим в следующий рабочий день',
  },
  welcome: {
    he: 'שלום! 👋 אני העוזר הדיגיטלי (AI) של אחים שוואקי זכוכית. אפשר לשאול אותי כל שאלה על זכוכית ועל השירותים שלנו, ואעזור לכם להכין בקשה להצעת מחיר חינם. אני מבוסס AI, ולכן עלול לטעות.',
    en: "Hi! 👋 I'm the Shwaki Brothers AI assistant. Ask me anything about glass and our services, and I can help you prepare a free quote request. I'm an AI, so I can make mistakes.",
    ar: 'مرحباً! 👋 أنا المساعد الذكي (AI) لشويكي اخوان للزجاج. اسألني أي شيء عن الزجاج وخدماتنا، ويمكنني مساعدتك في تجهيز طلب عرض سعر مجاني. أنا ذكاء اصطناعي وقد أخطئ أحياناً.',
    ru: 'Здравствуйте! 👋 Я ИИ-ассистент компании «Братья Шваки». Спрашивайте о стекле и наших услугах — и я помогу подготовить заявку на бесплатный расчёт. Я искусственный интеллект и могу ошибаться.',
  },
  startersLabel: { he: 'שאלות נפוצות', en: 'Popular questions', ar: 'أسئلة شائعة', ru: 'Популярные вопросы' },
  officialAnswer: { he: 'תשובה רשמית שלנו', en: 'Our official answer', ar: 'إجابتنا الرسمية', ru: 'Наш официальный ответ' },
  placeholder: { he: 'כתבו את השאלה שלכם…', en: 'Type your question…', ar: 'اكتب سؤالك…', ru: 'Напишите ваш вопрос…' },
  inputLabel: { he: 'ההודעה שלכם', en: 'Your message', ar: 'رسالتك', ru: 'Ваше сообщение' },
  send: { he: 'שליחה', en: 'Send', ar: 'إرسال', ru: 'Отправить' },
  close: { he: "סגירת הצ'אט", en: 'Close chat', ar: 'إغلاق المحادثة', ru: 'Закрыть чат' },
  newConversation: { he: 'שיחה חדשה', en: 'New conversation', ar: 'محادثة جديدة', ru: 'Новый разговор' },
  footerNote: {
    he: 'עוזר מבוסס AI. למחיר מדויק נגיע למדידה בשטח.',
    en: "AI assistant. For an exact price we'll measure on site.",
    ar: 'مساعد ذكاء اصطناعي. للحصول على سعر دقيق نأتي للقياس في الموقع.',
    ru: 'ИИ-ассистент. Точную цену назовём после замера на месте.',
  },
  whatsapp: { he: 'וואטסאפ', en: 'WhatsApp', ar: 'واتساب', ru: 'WhatsApp' },
  call: { he: 'התקשרו', en: 'Call us', ar: 'اتصل بنا', ru: 'Позвонить' },
  typing: { he: 'כותב תשובה…', en: 'Typing…', ar: 'يكتب…', ru: 'Печатает…' },
  you: { he: 'אתם', en: 'You', ar: 'أنت', ru: 'Вы' },
  assistant: { he: 'העוזר', en: 'Assistant', ar: 'المساعد', ru: 'Ассистент' },
  newMessage: { he: 'הודעה חדשה מהעוזר', en: 'New message from the assistant', ar: 'رسالة جديدة من المساعد', ru: 'Новое сообщение от ассистента' },
  notSure: {
    he: 'אני לא בטוח לגבי זה. הצוות שלנו יכול לענות מהר:',
    en: "I'm not sure about that one. Our team can answer quickly:",
    ar: 'لست متأكداً من هذا. فريقنا يقدر يجاوبك بسرعة:',
    ru: 'Тут я не уверен. Наша команда быстро ответит:',
  },
  getQuote: { he: 'קבלו הצעת מחיר חינם', en: 'Get a free quote', ar: 'احصل على عرض سعر مجاني', ru: 'Бесплатный расчёт' },
  relatedQuestions: { he: 'שאלות קשורות', en: 'Related questions', ar: 'أسئلة ذات صلة', ru: 'Похожие вопросы' },
  usefulPages: { he: 'עמודים שימושיים', en: 'Helpful pages', ar: 'صفحات مفيدة', ru: 'Полезные страницы' },
  // Guided quote request (no AI): one step per message, every step skippable except name and phone
  quoteProduct: { he: 'איזה מוצר מעניין אתכם?', en: 'Which product are you interested in?', ar: 'أي منتج يهمك؟', ru: 'Что вас интересует?' },
  quoteCity: { he: 'באיזו עיר העבודה?', en: 'Which city is the job in?', ar: 'بأي مدينة الشغل؟', ru: 'В каком городе работа?' },
  quoteSize: {
    he: 'מה הגודל המשוער או מספר הפנלים? (למשל: 90×190 ס"מ, או 3 פנלים)',
    en: 'Roughly what size, or how many panels? (e.g. 90×190 cm, or 3 panels)',
    ar: 'شو المقاس التقريبي أو عدد الألواح؟ (مثلاً: 90×190 سم، أو 3 ألواح)',
    ru: 'Примерный размер или количество панелей? (например: 90×190 см или 3 панели)',
  },
  quoteTiming: { he: 'מתי תרצו להתקין?', en: 'When would you like it installed?', ar: 'إيمتى بدك التركيب؟', ru: 'Когда хотите установить?' },
  quoteName: { he: 'איך קוראים לכם?', en: 'What is your name?', ar: 'شو اسمك؟', ru: 'Как вас зовут?' },
  quotePhone: { he: 'לאיזה מספר טלפון לחזור אליכם?', en: 'Which phone number should we call you back on?', ar: 'على أي رقم نتصل فيك؟', ru: 'По какому номеру вам перезвонить?' },
  // Product and timing have buttons; the composer takes anything else
  quoteProductPlaceholder: { he: 'או כתבו את המוצר…', en: 'Or type the product…', ar: 'أو اكتب المنتج…', ru: 'Или напишите, что нужно…' },
  quoteCityPlaceholder: { he: 'שם העיר…', en: 'City…', ar: 'اسم المدينة…', ru: 'Город…' },
  quoteSizePlaceholder: { he: 'גודל או מספר פנלים…', en: 'Size or number of panels…', ar: 'المقاس أو عدد الألواح…', ru: 'Размер или число панелей…' },
  quoteTimingPlaceholder: { he: 'או כתבו מתי…', en: 'Or type when…', ar: 'أو اكتب الموعد…', ru: 'Или напишите срок…' },
  quoteNamePlaceholder: { he: 'השם שלכם…', en: 'Your name…', ar: 'اسمك…', ru: 'Ваше имя…' },
  quotePhonePlaceholder: { he: 'מספר טלפון…', en: 'Phone number…', ar: 'رقم الهاتف…', ru: 'Номер телефона…' },
  skip: { he: 'דלג', en: 'Skip', ar: 'تخطي', ru: 'Пропустить' },
  cancelQuote: { he: 'ביטול הבקשה', en: 'Cancel request', ar: 'إلغاء الطلب', ru: 'Отменить заявку' },
  productShower: { he: 'מקלחון', en: 'Shower', ar: 'كابينة دش', ru: 'Душевая кабина' },
  productRailing: { he: 'מעקה זכוכית', en: 'Glass railing', ar: 'درابزين زجاج', ru: 'Стеклянные перила' },
  productMirror: { he: 'מראה', en: 'Mirror', ar: 'مراية', ru: 'Зеркало' },
  productStorefront: { he: 'חזית חנות', en: 'Shop front', ar: 'واجهة محل', ru: 'Витрина магазина' },
  productPartition: { he: 'מחיצת זכוכית', en: 'Glass partition', ar: 'فاصل زجاج', ru: 'Стеклянная перегородка' },
  productDoor: { he: 'דלת זכוכית', en: 'Glass door', ar: 'باب زجاج', ru: 'Стеклянная дверь' },
  productBacksplash: { he: 'חיפוי זכוכית למטבח', en: 'Kitchen backsplash', ar: 'زجاج خلفية المطبخ', ru: 'Кухонный фартук' },
  productShelf: { he: 'מדפי זכוכית', en: 'Glass shelves', ar: 'رفوف زجاج', ru: 'Стеклянные полки' },
  productOther: { he: 'אחר', en: 'Other', ar: 'غير ذلك', ru: 'Другое' },
  timingAsap: { he: 'כמה שיותר מהר', en: 'As soon as possible', ar: 'بأسرع وقت', ru: 'Как можно скорее' },
  timingMonth: { he: 'בחודש הקרוב', en: 'Within a month', ar: 'خلال شهر', ru: 'В течение месяца' },
  timingLater: { he: 'בעוד 1–3 חודשים', en: 'In 1–3 months', ar: 'خلال 1–3 أشهر', ru: 'Через 1–3 месяца' },
  timingBrowsing: { he: 'רק בודקים מחירים', en: 'Just checking prices', ar: 'بس بسأل عن الأسعار', ru: 'Пока узнаю цены' },
  detailsSize: { he: 'גודל / פנלים', en: 'Size / panels', ar: 'المقاس / الألواح', ru: 'Размер / панели' },
  detailsTiming: { he: 'מועד', en: 'Timing', ar: 'الموعد', ru: 'Сроки' },
  quoteIntro: {
    he: 'בדקו את הפרטים למטה ולחצו "שליחת הבקשה".',
    en: 'Please check the details below and press "Send request".',
    ar: 'يرجى مراجعة التفاصيل أدناه والضغط على "إرسال الطلب".',
    ru: 'Проверьте данные ниже и нажмите «Отправить заявку».',
  },
  quoteTitle: { he: 'בקשת הצעת המחיר שלכם', en: 'Your quote request', ar: 'طلب عرض السعر الخاص بك', ru: 'Ваша заявка на расчёт' },
  fieldName: { he: 'שם', en: 'Name', ar: 'الاسم', ru: 'Имя' },
  fieldPhone: { he: 'טלפון', en: 'Phone', ar: 'الهاتف', ru: 'Телефон' },
  fieldCity: { he: 'עיר', en: 'City', ar: 'المدينة', ru: 'Город' },
  fieldService: { he: 'שירות', en: 'Service', ar: 'الخدمة', ru: 'Услуга' },
  fieldDetails: { he: 'פרטים', en: 'Details', ar: 'التفاصيل', ru: 'Детали' },
  fieldSummary: {
    he: 'ההודעות שלכם בצ\'אט (יישלחו עם הבקשה — אפשר לערוך או למחוק)',
    en: 'Your chat messages (sent with the request — you can edit or delete them)',
    ar: 'رسائلك في المحادثة (تُرسل مع الطلب — يمكنك تعديلها أو حذفها)',
    ru: 'Ваши сообщения в чате (отправляются с заявкой — можно изменить или удалить)',
  },
  sendRequest: { he: 'שליחת הבקשה', en: 'Send request', ar: 'إرسال الطلب', ru: 'Отправить заявку' },
  cancel: { he: 'ביטול', en: 'Cancel', ar: 'إلغاء', ru: 'Отмена' },
  sending: { he: 'שולח…', en: 'Sending…', ar: 'جارٍ الإرسال…', ru: 'Отправка…' },
  nameInvalid: { he: 'נא להזין שם (2–60 תווים).', en: 'Please enter your name (2–60 characters).', ar: 'يرجى إدخال الاسم (2–60 حرفاً).', ru: 'Введите имя (2–60 символов).' },
  phoneInvalid: { he: 'נא להזין מספר טלפון תקין.', en: 'Please enter a valid phone number.', ar: 'يرجى إدخال رقم هاتف صحيح.', ru: 'Введите корректный номер телефона.' },
  consentRequired: { he: 'יש לאשר את ההסכמה כדי להמשיך.', en: 'Please confirm the consent to continue.', ar: 'يرجى تأكيد الموافقة للمتابعة.', ru: 'Подтвердите согласие, чтобы продолжить.' },
  sendFailed: {
    he: 'לא הצלחנו לשלוח את הבקשה. אפשר לשלוח לנו אותה בוואטסאפ:',
    en: "We couldn't send your request. You can send it to us on WhatsApp instead:",
    ar: 'تعذّر إرسال طلبك. يمكنك إرساله إلينا عبر واتساب بدلاً من ذلك:',
    ru: 'Не удалось отправить заявку. Вы можете отправить её нам в WhatsApp:',
  },
  thankYou: {
    he: 'תודה! ניצור איתכם קשר בקרוב (בדרך כלל תוך שעתיים בשעות הפעילות).',
    en: "Thanks! We'll contact you soon (usually within 2 hours during working hours).",
    ar: 'شكراً! سنتواصل معك قريباً (عادةً خلال ساعتين خلال ساعات العمل).',
    ru: 'Спасибо! Мы скоро свяжемся с вами (обычно в течение 2 часов в рабочее время).',
  },
  fasterWhatsapp: {
    he: 'רוצים תשובה מהירה יותר? כתבו לנו בוואטסאפ.',
    en: 'Want a faster answer? Message us on WhatsApp.',
    ar: 'تريد رداً أسرع؟ راسلنا عبر واتساب.',
    ru: 'Нужен ответ быстрее? Напишите нам в WhatsApp.',
  },
  cancelled: {
    he: 'אין בעיה — הבקשה לא נשלחה. אפשר לעזור במשהו נוסף?',
    en: 'No problem — the request was not sent. Anything else I can help with?',
    ar: 'لا مشكلة — لم يتم إرسال الطلب. هل يمكنني المساعدة في شيء آخر؟',
    ru: 'Хорошо — заявка не отправлена. Чем ещё могу помочь?',
  },
  whatsappPrefix: {
    he: 'שלום, הגעתי מהצ\'אט באתר. אני מתעניין/ת ב:',
    en: "Hi, I'm coming from the website chat. I'm interested in:",
    ar: 'مرحباً، أتواصل من محادثة الموقع. أنا مهتم بـ:',
    ru: 'Здравствуйте, пишу из чата на сайте. Меня интересует:',
  },
  whatsappLeadPrefix: {
    he: 'שלום, אשמח להצעת מחיר:',
    en: "Hi, I'd like a quote:",
    ar: 'مرحباً، أرغب في عرض سعر:',
    ru: 'Здравствуйте, хочу получить расчёт:',
  },
} satisfies Record<string, LocalizedText>;

export type ChatStrings = { [K in keyof typeof CHAT_STRINGS]: string };

export function getChatStrings(locale: SupportedLocale): ChatStrings {
  return Object.fromEntries(Object.entries(CHAT_STRINGS).map(([k, v]) => [k, v[locale]])) as ChatStrings;
}

/** Label of the home "Ask AI" button that hands the answer over to the chat. */
export const CONTINUE_IN_CHAT: LocalizedText = {
  he: "המשיכו בצ'אט",
  en: 'Continue in chat',
  ar: 'تابع في المحادثة',
  ru: 'Продолжить в чате',
};

/**
 * Service landing pages: one line where the FAQ block was ("Have a question
 * about …? Ask our AI"). It opens the chat with `draft` in the message box.
 * {service} is replaced by the service name.
 */
export const SERVICE_ASK_AI = {
  question: {
    he: 'יש לכם שאלה על {service}?',
    en: 'Have a question about {service}?',
    ar: 'لديك سؤال عن {service}؟',
    ru: 'Есть вопрос по теме «{service}»?',
  },
  cta: { he: 'שאלו את ה-AI שלנו', en: 'Ask our AI', ar: 'اسأل الذكاء الاصطناعي', ru: 'Спросите наш ИИ' },
  draft: {
    he: 'שאלה על {service}: ',
    en: 'Question about {service}: ',
    ar: 'سؤال عن {service}: ',
    ru: 'Вопрос по теме «{service}»: ',
  },
} satisfies Record<string, LocalizedText>;

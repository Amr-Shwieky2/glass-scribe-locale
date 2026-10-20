/**
 * Fixed replies of the website assistant's own answer engine
 * (src/lib/answer-engine), in 4 languages. Facts only from our content:
 * free measurement / free no-obligation quote and "price depends on size,
 * glass type and hardware" (src/data/faq.ts), hours and contact details
 * (src/data/contact.ts), "serving all of Israel" (src/data/business-info.ts).
 * {placeholders} are filled in by the engine.
 */
import type { LocalizedText } from './types';

export const ASSISTANT_REPLIES = {
  greeting: {
    he: 'שלום! 👋 איך אפשר לעזור? אפשר לשאול על מקלחונים, מעקות, מראות, חזיתות ועוד — או לבקש הצעת מחיר חינם.',
    en: 'Hi! 👋 How can I help? Ask me about showers, railings, mirrors, storefronts and more — or ask for a free quote.',
    ar: 'مرحباً! 👋 كيف أقدر أساعدك؟ اسألني عن كبائن الدش، الدرابزين، المرايا، الواجهات وغيرها — أو اطلب عرض سعر مجاني.',
    ru: 'Здравствуйте! 👋 Чем помочь? Спрашивайте о душевых кабинах, перилах, зеркалах, витринах и не только — или запросите бесплатный расчёт.',
  },
  thanks: {
    he: 'בשמחה! אם יש עוד שאלה — אני כאן. 😊',
    en: "You're welcome! If you have another question, I'm here. 😊",
    ar: 'العفو! إذا عندك سؤال ثاني، أنا هون. 😊',
    ru: 'Пожалуйста! Если появится ещё вопрос — я здесь. 😊',
  },
  complaint: {
    he: 'אנחנו מצטערים לשמוע. נשמח לטפל בזה אישית — כתבו לנו בוואטסאפ או התקשרו, ונחזור אליכם בהקדם.',
    en: "We're sorry to hear that. We'd like to sort it out personally — message us on WhatsApp or call, and we'll get back to you as soon as we can.",
    ar: 'نأسف لسماع ذلك. يهمنا نحل الموضوع شخصياً — راسلنا على واتساب أو اتصل بنا، وسنعود إليك بأقرب وقت.',
    ru: 'Нам очень жаль. Мы хотим разобраться лично — напишите нам в WhatsApp или позвоните, и мы свяжемся с вами как можно скорее.',
  },
  outOfScope: {
    he: 'אני יכול לעזור רק בשאלות על זכוכית ועל השירותים שלנו — מקלחונים, מעקות, מראות, חזיתות ועוד. יש לכם שאלה בנושא?',
    en: 'I can only help with questions about glass and our services — showers, railings, mirrors, storefronts and more. Do you have a question about those?',
    ar: 'أقدر أساعد فقط بأسئلة عن الزجاج وخدماتنا — كبائن الدش، الدرابزين، المرايا، الواجهات وغيرها. عندك سؤال بهالموضوع؟',
    ru: 'Я могу помочь только с вопросами о стекле и наших услугах — душевые, перила, зеркала, витрины и другое. Есть вопрос на эту тему?',
  },
  notSure: {
    he: 'אני לא בטוח לגבי זה. הצוות שלנו יכול לענות מהר:',
    en: "I'm not sure about that one. Our team can answer quickly:",
    ar: 'لست متأكداً من هذا. فريقنا يقدر يجاوبك بسرعة:',
    ru: 'Тут я не уверен. Наша команда быстро ответит:',
  },
  didYouMean: {
    he: 'התכוונתם לאחת מהשאלות האלה?',
    en: 'Did you mean…?',
    ar: 'هل تقصد…؟',
    ru: 'Вы имели в виду…?',
  },
  priceGeneral: {
    he: 'המחיר תלוי בגודל, בסוג הזכוכית ובפרזול, ולכן אין מחיר אחד קבוע. המדידה אצלכם חינם והצעת המחיר בלי התחייבות. בואו נכין בקשה להצעת מחיר — כמה שאלות קצרות:',
    en: "The price depends on the size, the glass type and the hardware, so there's no single fixed price. The on-site measurement is free and the quote comes with no obligation. Let's prepare a quote request — a few quick questions:",
    ar: 'السعر يعتمد على المقاس ونوع الزجاج والإكسسوارات، لذلك ما في سعر واحد ثابت. القياس عندك مجاني وعرض السعر بدون التزام. خلينا نجهز طلب عرض سعر — كم سؤال قصير:',
    ru: 'Цена зависит от размера, типа стекла и фурнитуры, поэтому единой фиксированной цены нет. Замер на месте бесплатный, расчёт — без обязательств. Давайте подготовим заявку на расчёт — несколько коротких вопросов:',
  },
  quoteStart: {
    he: 'מעולה, בואו נכין בקשה להצעת מחיר חינם. כמה שאלות קצרות — אפשר לדלג על כל שאלה חוץ משם וטלפון.',
    en: "Great — let's prepare a free quote request. A few quick questions; you can skip any of them except your name and phone.",
    ar: 'ممتاز، خلينا نجهز طلب عرض سعر مجاني. كم سؤال قصير — بتقدر تتخطى أي سؤال ما عدا الاسم والهاتف.',
    ru: 'Отлично, подготовим заявку на бесплатный расчёт. Несколько коротких вопросов — любой можно пропустить, кроме имени и телефона.',
  },
  /** {status} {hours} */
  hours: {
    he: '{status} שעות הפעילות שלנו: {hours}.',
    en: '{status} Our opening hours: {hours}.',
    ar: '{status} ساعات عملنا: {hours}.',
    ru: '{status} Наши часы работы: {hours}.',
  },
  openNow: {
    he: 'אנחנו פתוחים עכשיו.',
    en: "We're open right now.",
    ar: 'نحن فاتحين الآن.',
    ru: 'Сейчас мы открыты.',
  },
  closedNow: {
    he: 'כרגע אנחנו סגורים — השאירו הודעה ונחזור אליכם ביום העסקים הבא.',
    en: "We're closed right now — leave us a message and we'll reply on the next business day.",
    ar: 'نحن مسكرين حالياً — اترك لنا رسالة وسنرد في يوم العمل التالي.',
    ru: 'Сейчас мы закрыты — оставьте сообщение, и мы ответим в следующий рабочий день.',
  },
  /** {phone} {email} {hours} */
  contact: {
    he: 'אפשר לדבר איתנו בטלפון או בוואטסאפ: {phone}, או במייל: {email}. שעות הפעילות: {hours}.',
    en: 'You can reach us by phone or WhatsApp at {phone}, or by email at {email}. Opening hours: {hours}.',
    ar: 'تقدر تتواصل معنا بالهاتف أو واتساب على {phone}، أو بالإيميل {email}. ساعات العمل: {hours}.',
    ru: 'Связаться с нами можно по телефону или в WhatsApp: {phone}, или по почте: {email}. Часы работы: {hours}.',
  },
  /** {city} {areas} {serviceArea} — a city with its own page */
  cityPage: {
    he: 'כן! אנחנו עובדים ב{city} והסביבה{areas}. {serviceArea}. רוצים הצעת מחיר חינם?',
    en: 'Yes! We work in {city} and the area{areas}. {serviceArea}. Would you like a free quote?',
    ar: 'نعم! نعمل في {city} والمنطقة{areas}. {serviceArea}. بدك عرض سعر مجاني؟',
    ru: 'Да! Мы работаем в городе {city} и окрестностях{areas}. {serviceArea}. Хотите бесплатный расчёт?',
  },
  /** A bare "yes"/"ok" that doesn't answer an offer */
  ackYes: {
    he: 'מעולה 👍 מה עוד תרצו לדעת?',
    en: 'Great 👍 What else would you like to know?',
    ar: 'تمام 👍 شو كمان حابب تعرف؟',
    ru: 'Отлично 👍 Что ещё хотите узнать?',
  },
  ackNo: {
    he: 'אין בעיה. אפשר לעזור במשהו אחר?',
    en: 'No problem. Anything else I can help with?',
    ar: 'ولا يهمك. في شي ثاني بقدر أساعدك فيه؟',
    ru: 'Хорошо. Могу помочь чем-то ещё?',
  },
  /** {serviceArea} — a place we can't confirm (not a known Israeli city): no "yes" */
  cityUnknown: {
    he: '{serviceArea}. כתבו לנו בוואטסאפ את המיקום המדויק ונאשר אם אנחנו מגיעים.',
    en: '{serviceArea}. Send us the exact location on WhatsApp and we’ll confirm.',
    ar: '{serviceArea}. ابعتلنا الموقع بالضبط على واتساب ومنأكدلك.',
    ru: '{serviceArea}. Напишите нам в WhatsApp точное место, и мы подтвердим.',
  },
  /** {serviceArea} — any other Israeli place */
  cityOther: {
    he: 'כן — {serviceArea}. כתבו לנו בוואטסאפ עם המיקום המדויק ונתאם מדידה חינם.',
    en: 'Yes — {serviceArea}. Message us on WhatsApp with the exact location and we’ll arrange a free measurement.',
    ar: 'نعم — {serviceArea}. راسلنا على واتساب مع الموقع بالضبط ومنرتب قياس مجاني.',
    ru: 'Да — {serviceArea}. Напишите нам в WhatsApp точный адрес, и мы договоримся о бесплатном замере.',
  },
} satisfies Record<string, LocalizedText>;

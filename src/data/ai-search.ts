/**
 * "Ask AI" home section — localized UI strings.
 */
import type { LocalizedText, SupportedLocale } from './types';

export const AI_SEARCH_STRINGS = {
  title: {
    he: 'שאלו אותנו כל דבר על זכוכית',
    en: 'Ask us anything about glass',
    ar: 'اسألنا أي شيء عن الزجاج',
    ru: 'Спросите нас о стекле',
  },
  subtitle: {
    he: 'כתבו שאלה במילים שלכם וקבלו תשובה מיידית מהתוכן שלנו',
    en: 'Type a question in your own words and get an instant answer from our content',
    ar: 'اكتب سؤالك بكلماتك واحصل على إجابة فورية من محتوانا',
    ru: 'Задайте вопрос своими словами и получите мгновенный ответ по материалам нашего сайта',
  },
  placeholder: {
    he: 'לדוגמה: כמה עולה מקלחון ללא מסגרת?',
    en: 'e.g. How much does a frameless shower cost?',
    ar: 'مثال: كم تكلفة كابينة دش بدون إطار؟',
    ru: 'Например: сколько стоит безрамная душевая?',
  },
  inputLabel: {
    he: 'השאלה שלכם', en: 'Your question', ar: 'سؤالك', ru: 'Ваш вопрос',
  },
  ask: { he: 'שאלו', en: 'Ask', ar: 'اسأل', ru: 'Спросить' },
  suggestionsLabel: {
    he: 'שאלות נפוצות', en: 'Popular questions', ar: 'أسئلة شائعة', ru: 'Популярные вопросы',
  },
  instantResults: {
    he: 'תוצאות מהאתר', en: 'From our site', ar: 'من موقعنا', ru: 'На нашем сайте',
  },
  noResults: {
    he: 'לא נמצאו עמודים מתאימים — לחצו "שאלו" לתשובה מלאה',
    en: 'No matching pages — press "Ask" for a full answer',
    ar: 'لا توجد صفحات مطابقة — اضغط "اسأل" للحصول على إجابة كاملة',
    ru: 'Подходящих страниц нет — нажмите «Спросить», чтобы получить ответ',
  },
  answerLabel: { he: 'תשובה', en: 'Answer', ar: 'الإجابة', ru: 'Ответ' },
  thinking: { he: 'מכין תשובה…', en: 'Preparing an answer…', ar: 'جارٍ إعداد الإجابة…', ru: 'Готовим ответ…' },
  disclaimer: {
    he: 'תשובות AI עלולות להכיל טעויות — למחיר מדויק צרו איתנו קשר.',
    en: 'AI answers may contain mistakes — for an exact price contact us.',
    ar: 'قد تحتوي إجابات الذكاء الاصطناعي على أخطاء — للحصول على سعر دقيق تواصل معنا.',
    ru: 'Ответы ИИ могут содержать ошибки — точную цену уточняйте у нас.',
  },
  whatsappCta: {
    he: 'קבלו הצעת מחיר חינם בוואטסאפ',
    en: 'Get a free quote on WhatsApp',
    ar: 'احصل على عرض سعر مجاني عبر واتساب',
    ru: 'Бесплатный расчёт в WhatsApp',
  },
  callCta: { he: 'התקשרו אלינו', en: 'Call us', ar: 'اتصل بنا', ru: 'Позвоните нам' },
  whatsappPrefix: {
    he: 'שלום, יש לי שאלה:',
    en: 'Hi, I have a question:',
    ar: 'مرحباً، لدي سؤال:',
    ru: 'Здравствуйте, у меня вопрос:',
  },
  unavailable: {
    he: 'העוזר החכם לא זמין כרגע. כתבו לנו בוואטסאפ ונחזור אליכם במהירות!',
    en: 'Our AI assistant is not available right now. Message us on WhatsApp and we’ll get back to you quickly!',
    ar: 'المساعد الذكي غير متاح حالياً. راسلنا عبر واتساب وسنرد عليك بسرعة!',
    ru: 'ИИ-помощник сейчас недоступен. Напишите нам в WhatsApp — мы быстро ответим!',
  },
  rateLimited: {
    he: 'הגעתם למספר השאלות המרבי לשעה. נשמח לענות אישית בוואטסאפ!',
    en: 'You’ve reached the question limit for now. We’d be happy to answer personally on WhatsApp!',
    ar: 'لقد وصلت إلى الحد الأقصى من الأسئلة حالياً. يسعدنا الرد عليك شخصياً عبر واتساب!',
    ru: 'Вы достигли лимита вопросов. С радостью ответим лично в WhatsApp!',
  },
  tooLong: {
    he: 'השאלה ארוכה מדי (עד 300 תווים).',
    en: 'The question is too long (max 300 characters).',
    ar: 'السؤال طويل جداً (حتى 300 حرف).',
    ru: 'Вопрос слишком длинный (до 300 символов).',
  },
} satisfies Record<string, LocalizedText>;

export type AiSearchStrings = { [K in keyof typeof AI_SEARCH_STRINGS]: string };

export function getAiSearchStrings(locale: SupportedLocale): AiSearchStrings {
  return Object.fromEntries(
    Object.entries(AI_SEARCH_STRINGS).map(([k, v]) => [k, v[locale]])
  ) as AiSearchStrings;
}

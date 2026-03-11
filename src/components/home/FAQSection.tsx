/**
 * FAQSection - Frequently Asked Questions
 * Optimized for SEO featured snippets and AI search (GEO)
 * Uses Schema.org FAQPage markup pattern
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { getLocalizedText, type SupportedLocale } from '@/data';

// FAQ Content - Comprehensive Q&A for glass installation
const FAQ_CONTENT = {
  sectionTitle: {
    en: 'Frequently Asked Questions',
    he: 'שאלות נפוצות',
    ar: 'الأسئلة الشائعة',
    ru: 'Часто задаваемые вопросы',
  },
  sectionSubtitle: {
    en: 'Everything you need to know about our glass installation services',
    he: 'כל מה שצריך לדעת על שירותי התקנת הזכוכית שלנו',
    ar: 'كل ما تحتاج معرفته عن خدمات تركيب الزجاج لدينا',
    ru: 'Всё, что нужно знать о наших услугах по установке стекла',
  },
  faqs: [
    {
      question: {
        en: 'How much does glass installation cost in Israel?',
        he: 'כמה עולה התקנת זכוכית בישראל?',
        ar: 'كم تكلفة تركيب الزجاج في إسرائيل؟',
        ru: 'Сколько стоит установка стекла в Израиле?',
      },
      answer: {
        en: 'Glass installation costs vary based on type, size, and complexity. Shower enclosures typically range from ₪3,000-15,000, glass railings from ₪1,200-2,500 per meter, and mirror walls from ₪800-2,000 per sqm. We offer free on-site measurements and detailed quotes with no obligation.',
        he: 'עלות התקנת זכוכית משתנה בהתאם לסוג, גודל ומורכבות. מקלחונים נעים בדרך כלל בין ₪3,000-15,000, מעקות זכוכית בין ₪1,200-2,500 למטר, וקירות מראה בין ₪800-2,000 למ"ר. אנו מציעים מדידות חינם באתר והצעות מחיר מפורטות ללא התחייבות.',
        ar: 'تختلف تكاليف تركيب الزجاج حسب النوع والحجم والتعقيد. تتراوح حواجز الدش عادة بين 3,000-15,000 شيكل، والدرابزين الزجاجي بين 1,200-2,500 شيكل للمتر، وجدران المرايا بين 800-2,000 شيكل للمتر المربع. نقدم قياسات مجانية في الموقع وعروض أسعار مفصلة بدون التزام.',
        ru: 'Стоимость установки стекла зависит от типа, размера и сложности. Душевые кабины обычно стоят от 3,000 до 15,000 ₪, стеклянные перила — от 1,200 до 2,500 ₪ за метр, зеркальные стены — от 800 до 2,000 ₪ за кв.м. Мы предлагаем бесплатные замеры на месте и детальные сметы без обязательств.',
      },
    },
    {
      question: {
        en: 'How long does glass installation take?',
        he: 'כמה זמן לוקחת התקנת זכוכית?',
        ar: 'كم من الوقت يستغرق تركيب الزجاج؟',
        ru: 'Сколько времени занимает установка стекла?',
      },
      answer: {
        en: 'Most residential glass installations are completed in 1-2 days. After measurement, custom glass production takes 3-5 business days. The actual installation typically takes a few hours to a full day depending on complexity. We provide exact timelines during the consultation.',
        he: 'רוב התקנות הזכוכית הביתיות מסתיימות תוך 1-2 ימים. לאחר המדידה, ייצור זכוכית מותאמת אישית לוקח 3-5 ימי עסקים. ההתקנה עצמה לוקחת בדרך כלל מספר שעות עד יום מלא בהתאם למורכבות. אנו מספקים לוחות זמנים מדויקים במהלך הייעוץ.',
        ar: 'يتم إنجاز معظم تركيبات الزجاج السكنية في 1-2 يوم. بعد القياس، يستغرق إنتاج الزجاج المخصص 3-5 أيام عمل. يستغرق التركيب الفعلي عادة بضع ساعات إلى يوم كامل حسب التعقيد. نقدم جداول زمنية دقيقة خلال الاستشارة.',
        ru: 'Большинство бытовых установок стекла выполняются за 1-2 дня. После замера изготовление стекла на заказ занимает 3-5 рабочих дней. Сама установка обычно занимает от нескольких часов до полного дня в зависимости от сложности. Мы предоставляем точные сроки во время консультации.',
      },
    },
    {
      question: {
        en: 'What type of glass is best for shower enclosures?',
        he: 'איזה סוג זכוכית הכי טוב למקלחונים?',
        ar: 'ما هو أفضل نوع زجاج لحواجز الدش؟',
        ru: 'Какое стекло лучше для душевых кабин?',
      },
      answer: {
        en: 'We recommend 8mm-10mm tempered (safety) glass for shower enclosures. Tempered glass is 4-5 times stronger than regular glass and breaks into small, less harmful pieces if shattered. For added privacy, frosted or patterned glass options are available. All our shower glass meets Israeli safety standards.',
        he: 'אנו ממליצים על זכוכית מחוסמת (בטיחותית) בעובי 8-10 מ"מ למקלחונים. זכוכית מחוסמת חזקה פי 4-5 מזכוכית רגילה ומתפוררת לחתיכות קטנות ופחות מסוכנות במקרה של שבירה. לפרטיות נוספת, קיימות אפשרויות לזכוכית חלבית או מעוטרת. כל זכוכית המקלחונים שלנו עומדת בתקנים הישראליים.',
        ar: 'نوصي بالزجاج المقسى (الآمن) بسماكة 8-10 ملم لحواجز الدش. الزجاج المقسى أقوى 4-5 مرات من الزجاج العادي وينكسر إلى قطع صغيرة أقل ضرراً في حالة التحطم. لمزيد من الخصوصية، تتوفر خيارات الزجاج المصنفر أو المنقوش. جميع زجاج الدش لدينا يلبي المعايير الإسرائيلية.',
        ru: 'Для душевых кабин мы рекомендуем закалённое (безопасное) стекло толщиной 8-10 мм. Закалённое стекло в 4-5 раз прочнее обычного и при разрушении распадается на мелкие, менее опасные осколки. Для дополнительной приватности доступны матовое или узорчатое стекло. Всё наше душевое стекло соответствует израильским стандартам безопасности.',
      },
    },
    {
      question: {
        en: 'Do you offer a warranty on glass installations?',
        he: 'האם אתם מציעים אחריות על התקנות זכוכית?',
        ar: 'هل تقدمون ضمان على تركيبات الزجاج؟',
        ru: 'Предоставляете ли вы гарантию на установку стекла?',
      },
      answer: {
        en: 'Yes! All our glass installations come with a 2-year warranty covering workmanship and hardware. This includes hinges, handles, seals, and installation quality. The glass itself carries a manufacturer warranty. We stand behind our work and respond promptly to any warranty claims.',
        he: 'כן! כל התקנות הזכוכית שלנו מגיעות עם אחריות לשנתיים המכסה עבודה וחומרים. זה כולל צירים, ידיות, איטום ואיכות ההתקנה. הזכוכית עצמה מגיעה עם אחריות יצרן. אנו עומדים מאחורי העבודה שלנו ומגיבים במהירות לכל תביעת אחריות.',
        ar: 'نعم! جميع تركيبات الزجاج لدينا تأتي مع ضمان لمدة سنتين يغطي جودة العمل والأجهزة. يشمل ذلك المفصلات والمقابض والأختام وجودة التركيب. الزجاج نفسه يحمل ضمان الشركة المصنعة. نحن نقف وراء عملنا ونستجيب بسرعة لأي مطالبات ضمان.',
        ru: 'Да! На все наши стеклянные конструкции предоставляется 2-летняя гарантия на работу и фурнитуру. Это включает петли, ручки, уплотнители и качество монтажа. На само стекло действует гарантия производителя. Мы отвечаем за свою работу и оперативно реагируем на гарантийные обращения.',
      },
    },
    {
      question: {
        en: 'Do you serve all areas in Israel?',
        he: 'האם אתם עובדים בכל רחבי ישראל?',
        ar: 'هل تخدمون جميع المناطق في إسرائيل؟',
        ru: 'Вы работаете по всему Израилю?',
      },
      answer: {
        en: 'Yes, we provide glass installation services nationwide across Israel. Our team regularly works in Jerusalem, Tel Aviv, Haifa, Beersheba, Netanya, and surrounding areas. Free consultations and measurements are available throughout the country. Contact us to confirm service availability in your area.',
        he: 'כן, אנו מספקים שירותי התקנת זכוכית בכל רחבי ישראל. הצוות שלנו עובד באופן קבוע בירושלים, תל אביב, חיפה, באר שבע, נתניה ובאזורים הסמוכים. ייעוץ ומדידות חינם זמינים בכל הארץ. צרו קשר לאימות זמינות השירות באזורכם.',
        ar: 'نعم، نقدم خدمات تركيب الزجاج في جميع أنحاء إسرائيل. يعمل فريقنا بانتظام في القدس وتل أبيب وحيفا وبئر السبع ونتانيا والمناطق المحيطة. الاستشارات والقياسات المجانية متاحة في جميع أنحاء البلاد. اتصل بنا للتأكد من توفر الخدمة في منطقتك.',
        ru: 'Да, мы предоставляем услуги по установке стекла по всему Израилю. Наша команда регулярно работает в Иерусалиме, Тель-Авиве, Хайфе, Беэр-Шеве, Нетании и окрестностях. Бесплатные консультации и замеры доступны по всей стране. Свяжитесь с нами для подтверждения доступности услуг в вашем районе.',
      },
    },
    {
      question: {
        en: 'Can I get a free quote without commitment?',
        he: 'האם אפשר לקבל הצעת מחיר חינם ללא התחייבות?',
        ar: 'هل يمكنني الحصول على عرض سعر مجاني بدون التزام؟',
        ru: 'Могу ли я получить бесплатную смету без обязательств?',
      },
      answer: {
        en: 'Absolutely! We offer free on-site consultations and measurements with no obligation. Our expert will visit your location, assess your needs, take precise measurements, and provide a detailed quote within 24-48 hours. There\'s no pressure to proceed - you can take your time to decide.',
        he: 'בהחלט! אנו מציעים ייעוץ ומדידות חינם באתר ללא התחייבות. המומחה שלנו יבקר במיקומכם, יעריך את הצרכים, יבצע מדידות מדויקות ויספק הצעת מחיר מפורטת תוך 24-48 שעות. אין לחץ להמשיך - תוכלו לקחת את הזמן להחליט.',
        ar: 'بالتأكيد! نقدم استشارات وقياسات مجانية في الموقع بدون التزام. سيقوم خبيرنا بزيارة موقعك، وتقييم احتياجاتك، وأخذ قياسات دقيقة، وتقديم عرض سعر مفصل خلال 24-48 ساعة. لا يوجد ضغط للمتابعة - يمكنك أخذ وقتك للقرار.',
        ru: 'Конечно! Мы предлагаем бесплатные выездные консультации и замеры без обязательств. Наш специалист посетит ваш объект, оценит потребности, произведёт точные замеры и предоставит детальную смету в течение 24-48 часов. Никакого давления — вы можете не торопиться с решением.',
      },
    },
  ],
};

interface FAQSectionProps {
  locale: SupportedLocale;
}

const FAQSection: React.FC<FAQSectionProps> = ({ locale }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center gap-2 bg-brand-gold/10 text-brand-gold px-4 py-2 rounded-full text-sm font-medium mb-4">
              <HelpCircle className="w-4 h-4" />
              <span>FAQ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {getLocalizedText(FAQ_CONTENT.sectionTitle, locale)}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
              {getLocalizedText(FAQ_CONTENT.sectionSubtitle, locale)}
            </p>
          </motion.div>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQ_CONTENT.faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className={`bg-white rounded-xl shadow-sm border transition-all duration-300 ${
                  openIndex === index ? 'border-brand-gold shadow-md' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-start"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-base sm:text-lg font-medium text-brand-navy pe-4">
                    {getLocalizedText(faq.question, locale)}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className={`w-5 h-5 transition-colors ${
                      openIndex === index ? 'text-brand-gold' : 'text-gray-400'
                    }`} />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            {getLocalizedText(faq.answer, locale)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

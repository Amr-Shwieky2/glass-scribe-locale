'use client';
/**
 * Privacy Policy Page
 * Israeli Privacy Law compliant privacy policy
 */

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';;
import { Shield, Mail, Phone, MessageSquare, Trash2, Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import { BUSINESS_INFO, CONTACT_INFO, getLocalizedText, type SupportedLocale } from '@/data';

const PRIVACY_CONTENT = {
  title: {
    he: 'מדיניות פרטיות',
    en: 'Privacy Policy',
    ar: 'سياسة الخصوصية',
    ru: 'Политика конфиденциальности',
  },
  lastUpdated: {
    he: 'עודכן לאחרונה: מרץ 2026',
    en: 'Last updated: March 2026',
    ar: 'آخر تحديث: مارس 2026',
    ru: 'Последнее обновление: март 2026',
  },
  intro: {
    he: 'אנו באחים שוואקי זכוכית מחויבים להגנה על פרטיותך. מדיניות זו מסבירה אילו נתונים אנו אוספים, מדוע אנו אוספים אותם, וכיצד אנו משתמשים בהם.',
    en: 'At Shwaki Brothers Glassworks, we are committed to protecting your privacy. This policy explains what data we collect, why we collect it, and how we use it.',
    ar: 'نحن في شويكي اخوان للزجاج ملتزمون بحماية خصوصيتك. توضح هذه السياسة البيانات التي نجمعها ولماذا نجمعها وكيف نستخدمها.',
    ru: 'В компании «Шваки Бразерс» мы стремимся защитить вашу конфиденциальность. Эта политика объясняет, какие данные мы собираем, зачем мы их собираем и как мы их используем.',
  },
  sections: {
    dataCollection: {
      title: {
        he: 'מידע שאנו אוספים',
        en: 'Information We Collect',
        ar: 'المعلومات التي نجمعها',
        ru: 'Информация, которую мы собираем',
      },
      content: {
        he: 'כאשר אתה יוצר איתנו קשר דרך טופס יצירת הקשר, אנו אוספים את המידע הבא:',
        en: 'When you contact us through our contact form, we collect the following information:',
        ar: 'عندما تتصل بنا من خلال نموذج الاتصال الخاص بنا، نقوم بجمع المعلومات التالية:',
        ru: 'Когда вы связываетесь с нами через контактную форму, мы собираем следующую информацию:',
      },
      items: {
        name: {
          he: 'שם מלא',
          en: 'Full name',
          ar: 'الاسم الكامل',
          ru: 'Полное имя',
        },
        email: {
          he: 'כתובת דוא"ל',
          en: 'Email address',
          ar: 'عنوان البريد الإلكتروني',
          ru: 'Адрес электронной почты',
        },
        phone: {
          he: 'מספר טלפון',
          en: 'Phone number',
          ar: 'رقم الهاتف',
          ru: 'Номер телефона',
        },
        message: {
          he: 'תוכן ההודעה שלך',
          en: 'Your message content',
          ar: 'محتوى رسالتك',
          ru: 'Содержание вашего сообщения',
        },
        service: {
          he: 'סוג השירות המבוקש (אופציונלי)',
          en: 'Requested service type (optional)',
          ar: 'نوع الخدمة المطلوبة (اختياري)',
          ru: 'Тип запрашиваемой услуги (необязательно)',
        },
      },
    },
    purpose: {
      title: {
        he: 'מטרת איסוף המידע',
        en: 'Purpose of Data Collection',
        ar: 'الغرض من جمع البيانات',
        ru: 'Цель сбора данных',
      },
      content: {
        he: 'אנו אוספים מידע זה אך ורק למטרה אחת: לאפשר לנו ליצור איתך קשר בתגובה לפנייתך. איננו משתמשים במידע שלך לשיווק, לפרסום, או לכל מטרה אחרת.',
        en: 'We collect this information for one purpose only: to enable us to contact you in response to your inquiry. We do not use your information for marketing, advertising, or any other purpose.',
        ar: 'نجمع هذه المعلومات لغرض واحد فقط: لتمكيننا من الاتصال بك ردًا على استفسارك. نحن لا نستخدم معلوماتك للتسويق أو الإعلان أو أي غرض آخر.',
        ru: 'Мы собираем эту информацию только с одной целью: чтобы связаться с вами в ответ на ваш запрос. Мы не используем вашу информацию для маркетинга, рекламы или любых других целей.',
      },
    },
    dataTransmission: {
      title: {
        he: 'העברת המידע',
        en: 'Data Transmission',
        ar: 'نقل البيانات',
        ru: 'Передача данных',
      },
      content: {
        he: 'כאשר אתה שולח את טופס יצירת הקשר, המידע שלך נשלח אלינו באופן מאובטח דרך שירות Telegram. אנו משתמשים ב-Telegram כדי לקבל התראות על פניות חדשות ולאפשר תגובה מהירה. המידע נשלח בצורה מוצפנת ונשמר בהתאם למדיניות האבטחה של Telegram.',
        en: 'When you submit the contact form, your information is securely sent to us via Telegram service. We use Telegram to receive notifications about new inquiries and to enable quick response. The information is sent encrypted and stored according to Telegram\'s security policy.',
        ar: 'عندما ترسل نموذج الاتصال، يتم إرسال معلوماتك إلينا بشكل آمن عبر خدمة Telegram. نستخدم Telegram لتلقي إشعارات حول الاستفسارات الجديدة ولتمكين الاستجابة السريعة. يتم إرسال المعلومات مشفرة وتخزينها وفقًا لسياسة أمان Telegram.',
        ru: 'Когда вы отправляете контактную форму, ваша информация безопасно отправляется нам через сервис Telegram. Мы используем Telegram для получения уведомлений о новых запросах и обеспечения быстрого ответа. Информация отправляется в зашифрованном виде и хранится в соответствии с политикой безопасности Telegram.',
      },
    },
    dataUsage: {
      title: {
        he: 'שימוש במידע',
        en: 'Data Usage',
        ar: 'استخدام البيانات',
        ru: 'Использование данных',
      },
      content: {
        he: 'המידע שלך משמש אך ורק לתקשורת איתך בנוגע לפנייתך. אנו לא מוכרים, משכירים, או משתפים את המידע שלך עם צדדים שלישיים. אנו לא שולחים דיוור פרסומי ללא הסכמתך המפורשת.',
        en: 'Your information is used solely for communicating with you regarding your inquiry. We do not sell, rent, or share your information with third parties. We do not send promotional mailings without your explicit consent.',
        ar: 'تُستخدم معلوماتك فقط للتواصل معك بخصوص استفسارك. نحن لا نبيع أو نؤجر أو نشارك معلوماتك مع أطراف ثالثة. نحن لا نرسل رسائل بريدية ترويجية دون موافقتك الصريحة.',
        ru: 'Ваша информация используется исключительно для связи с вами по поводу вашего запроса. Мы не продаем, не сдаем в аренду и не передаем вашу информацию третьим лицам. Мы не отправляем рекламные рассылки без вашего явного согласия.',
      },
    },
    cookies: {
      title: {
        he: 'עוגיות (Cookies)',
        en: 'Cookies',
        ar: 'ملفات تعريف الارتباط (Cookies)',
        ru: 'Файлы cookie',
      },
      content: {
        he: 'אתר זה משתמש בעוגיות מינימליות לצורך:',
        en: 'This website uses minimal cookies for:',
        ar: 'يستخدم هذا الموقع ملفات تعريف الارتباط البسيطة لـ:',
        ru: 'Этот веб-сайт использует минимальное количество файлов cookie для:',
      },
      items: {
        language: {
          he: 'שמירת העדפת השפה שלך',
          en: 'Saving your language preference',
          ar: 'حفظ تفضيلات اللغة الخاصة بك',
          ru: 'Сохранения ваших языковых настроек',
        },
        accessibility: {
          he: 'שמירת הגדרות הנגישות שלך',
          en: 'Saving your accessibility settings',
          ar: 'حفظ إعدادات إمكانية الوصول الخاصة بك',
          ru: 'Сохранения настроек доступности',
        },
        analytics: {
          he: 'ניתוח אנונימי של תעבורת האתר (רק אם הסכמת)',
          en: 'Anonymous website traffic analysis (only if you consent)',
          ar: 'تحليل مجهول لحركة مرور الموقع (فقط إذا وافقت)',
          ru: 'Анонимного анализа трафика сайта (только с вашего согласия)',
        },
      },
    },
    deletion: {
      title: {
        he: 'מחיקת מידע',
        en: 'Data Deletion',
        ar: 'حذف البيانات',
        ru: 'Удаление данных',
      },
      content: {
        he: 'יש לך את הזכות לבקש מחיקה של כל המידע שמסרת לנו. כדי לבקש מחיקת מידע, אנא צור איתנו קשר באמצעות הטלפון או הדוא"ל המופיעים למטה. נטפל בבקשתך תוך 30 יום.',
        en: 'You have the right to request deletion of all information you have provided to us. To request data deletion, please contact us via phone or email listed below. We will process your request within 30 days.',
        ar: 'لديك الحق في طلب حذف جميع المعلومات التي قدمتها لنا. لطلب حذف البيانات، يرجى الاتصال بنا عبر الهاتف أو البريد الإلكتروني المدرج أدناه. سنقوم بمعالجة طلبك في غضون 30 يومًا.',
        ru: 'Вы имеете право запросить удаление всей предоставленной вами информации. Чтобы запросить удаление данных, свяжитесь с нами по телефону или электронной почте, указанным ниже. Мы обработаем ваш запрос в течение 30 дней.',
      },
    },
    security: {
      title: {
        he: 'אבטחת מידע',
        en: 'Data Security',
        ar: 'أمن البيانات',
        ru: 'Безопасность данных',
      },
      content: {
        he: 'אנו מיישמים אמצעי אבטחה מתאימים כדי להגן על המידע שלך:',
        en: 'We implement appropriate security measures to protect your information:',
        ar: 'نحن ننفذ تدابير أمنية مناسبة لحماية معلوماتك:',
        ru: 'Мы применяем соответствующие меры безопасности для защиты вашей информации:',
      },
      items: {
        https: {
          he: 'כל התקשורת באתר מוצפנת באמצעות HTTPS',
          en: 'All website communication is encrypted via HTTPS',
          ar: 'جميع الاتصالات على الموقع مشفرة عبر HTTPS',
          ru: 'Все коммуникации на сайте зашифрованы через HTTPS',
        },
        sanitization: {
          he: 'הנתונים מסוננים ומאומתים לפני העיבוד',
          en: 'Data is sanitized and validated before processing',
          ar: 'يتم تنظيف البيانات والتحقق من صحتها قبل المعالجة',
          ru: 'Данные очищаются и проверяются перед обработкой',
        },
        tokens: {
          he: 'מפתחות API מוגנים ואינם חשופים בקוד',
          en: 'API keys are protected and not exposed in code',
          ar: 'مفاتيح API محمية وغير معروضة في الكود',
          ru: 'Ключи API защищены и не отображаются в коде',
        },
      },
    },
    contact: {
      title: {
        he: 'יצירת קשר בנושא פרטיות',
        en: 'Privacy Contact',
        ar: 'الاتصال بشأن الخصوصية',
        ru: 'Контакт по вопросам конфиденциальности',
      },
      content: {
        he: 'לכל שאלה בנוגע לפרטיות או לבקשת מחיקת מידע, אנא צור קשר:',
        en: 'For any privacy questions or data deletion requests, please contact:',
        ar: 'لأي أسئلة تتعلق بالخصوصية أو طلبات حذف البيانات، يرجى الاتصال:',
        ru: 'По любым вопросам конфиденциальности или запросам на удаление данных обращайтесь:',
      },
    },
    israeliLaw: {
      title: {
        he: 'חוק הגנת הפרטיות',
        en: 'Israeli Privacy Law',
        ar: 'قانون حماية الخصوصية الإسرائيلي',
        ru: 'Израильский закон о защите конфиденциальности',
      },
      content: {
        he: 'אתר זה פועל בהתאם לחוק הגנת הפרטיות, התשמ"א-1981. זכויותיך על פי החוק כוללות את הזכות לעיין במידע שנאסף עליך ולבקש את תיקונו או מחיקתו.',
        en: 'This website operates in accordance with the Protection of Privacy Law, 5741-1981. Your rights under the law include the right to access information collected about you and to request its correction or deletion.',
        ar: 'يعمل هذا الموقع وفقًا لقانون حماية الخصوصية لعام 1981. تشمل حقوقك بموجب القانون الحق في الوصول إلى المعلومات التي تم جمعها عنك وطلب تصحيحها أو حذفها.',
        ru: 'Этот веб-сайт работает в соответствии с Законом о защите конфиденциальности 1981 года. Ваши права в соответствии с законом включают право на доступ к собранной о вас информации и запрос на ее исправление или удаление.',
      },
    },
  },
  backToHome: {
    he: 'חזרה לדף הבית',
    en: 'Back to Home',
    ar: 'العودة إلى الصفحة الرئيسية',
    ru: 'Вернуться на главную',
  },
};

const PrivacyPolicy: React.FC = () => {
  const { currentLanguage, isRTL } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const t = (obj: Record<string, string>) => getLocalizedText(obj, locale);
  const Arrow = isRTL ? ArrowRight : ArrowLeft;

  const SectionTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-brand-navy">{title}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-light py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-brand-navy flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-brand-gold" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-navy mb-4">{t(PRIVACY_CONTENT.title)}</h1>
          <p className="text-gray-500">{t(PRIVACY_CONTENT.lastUpdated)}</p>
        </div>

        {/* Intro */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <p className="text-gray-700 leading-relaxed">{t(PRIVACY_CONTENT.intro)}</p>
        </div>

        {/* Data Collection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <SectionTitle icon={<MessageSquare className="w-5 h-5" />} title={t(PRIVACY_CONTENT.sections.dataCollection.title)} />
          <p className="text-gray-700 mb-4">{t(PRIVACY_CONTENT.sections.dataCollection.content)}</p>
          <ul className="space-y-2">
            {Object.values(PRIVACY_CONTENT.sections.dataCollection.items).map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-600">
                <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                {t(item)}
              </li>
            ))}
          </ul>
        </div>

        {/* Purpose */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <SectionTitle icon={<Mail className="w-5 h-5" />} title={t(PRIVACY_CONTENT.sections.purpose.title)} />
          <p className="text-gray-700">{t(PRIVACY_CONTENT.sections.purpose.content)}</p>
        </div>

        {/* Data Transmission */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <SectionTitle icon={<Phone className="w-5 h-5" />} title={t(PRIVACY_CONTENT.sections.dataTransmission.title)} />
          <p className="text-gray-700">{t(PRIVACY_CONTENT.sections.dataTransmission.content)}</p>
        </div>

        {/* Data Usage */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <SectionTitle icon={<MessageSquare className="w-5 h-5" />} title={t(PRIVACY_CONTENT.sections.dataUsage.title)} />
          <p className="text-gray-700">{t(PRIVACY_CONTENT.sections.dataUsage.content)}</p>
        </div>

        {/* Cookies */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <SectionTitle icon={<Lock className="w-5 h-5" />} title={t(PRIVACY_CONTENT.sections.cookies.title)} />
          <p className="text-gray-700 mb-4">{t(PRIVACY_CONTENT.sections.cookies.content)}</p>
          <ul className="space-y-2">
            {Object.values(PRIVACY_CONTENT.sections.cookies.items).map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-600">
                <span className="w-2 h-2 rounded-full bg-brand-gold"></span>
                {t(item)}
              </li>
            ))}
          </ul>
        </div>

        {/* Data Deletion */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 sm:p-8 mb-6">
          <SectionTitle icon={<Trash2 className="w-5 h-5" />} title={t(PRIVACY_CONTENT.sections.deletion.title)} />
          <p className="text-gray-700">{t(PRIVACY_CONTENT.sections.deletion.content)}</p>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <SectionTitle icon={<Lock className="w-5 h-5" />} title={t(PRIVACY_CONTENT.sections.security.title)} />
          <p className="text-gray-700 mb-4">{t(PRIVACY_CONTENT.sections.security.content)}</p>
          <ul className="space-y-2">
            {Object.values(PRIVACY_CONTENT.sections.security.items).map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-600">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {t(item)}
              </li>
            ))}
          </ul>
        </div>

        {/* Israeli Law */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <SectionTitle icon={<Shield className="w-5 h-5" />} title={t(PRIVACY_CONTENT.sections.israeliLaw.title)} />
          <p className="text-gray-700">{t(PRIVACY_CONTENT.sections.israeliLaw.content)}</p>
        </div>

        {/* Contact */}
        <div className="bg-brand-navy rounded-2xl p-6 sm:p-8 mb-8 text-white">
          <h2 className="text-xl font-bold mb-4">{t(PRIVACY_CONTENT.sections.contact.title)}</h2>
          <p className="mb-4 text-gray-300">{t(PRIVACY_CONTENT.sections.contact.content)}</p>
          <div className="space-y-3">
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-gold" />
              <span className="text-gray-400 text-sm">{locale === 'he' ? 'פרטיות:' : locale === 'ar' ? 'الخصوصية:' : locale === 'ru' ? 'Конфиденциальность:' : 'Privacy:'}</span>
              <a href={`mailto:${CONTACT_INFO.privacyEmail}`} className="hover:text-brand-gold transition-colors font-medium">{CONTACT_INFO.privacyEmail}</a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-gold" />
              <span className="text-gray-400 text-sm">{locale === 'he' ? 'כללי:' : locale === 'ar' ? 'عام:' : locale === 'ru' ? 'Общие вопросы:' : 'General:'}</span>
              <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-brand-gold transition-colors">{CONTACT_INFO.email}</a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-gold" />
              <a href={`tel:${CONTACT_INFO.phoneIntl}`} className="hover:text-brand-gold transition-colors">{CONTACT_INFO.phone}</a>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            href={`/${currentLanguage}`} 
            className="inline-flex items-center gap-2 text-brand-navy hover:text-brand-gold transition-colors font-medium"
          >
            <Arrow className="w-5 h-5" />
            {t(PRIVACY_CONTENT.backToHome)}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

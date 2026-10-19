/**
 * Terms of Use Page
 * Copyright and usage terms for website content
 */

import React from 'react';
import Link from 'next/link';
import { FileText, Copyright, Shield, AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react';
import { isRTLLocale } from '@/lib/i18n';
import { BUSINESS_INFO } from '@/data/business-info';
import { CONTACT_INFO } from '@/data/contact';
import { getLocalizedText } from '@/data/helpers';
import type { SupportedLocale } from '@/data/types';

const TERMS_CONTENT = {
  title: {
    he: 'תנאי שימוש',
    en: 'Terms of Use',
    ar: 'شروط الاستخدام',
    ru: 'Условия использования',
  },
  lastUpdated: {
    he: 'עודכן לאחרונה: מרץ 2026',
    en: 'Last updated: March 2026',
    ar: 'آخر تحديث: مارس 2026',
    ru: 'Последнее обновление: март 2026',
  },
  intro: {
    he: 'ברוכים הבאים לאתר אחים שוואקי זכוכית. השימוש באתר זה כפוף לתנאים הבאים. על ידי גישה או שימוש באתר, אתה מסכים לתנאים אלה.',
    en: 'Welcome to Shwaki Brothers Glassworks website. Use of this website is subject to the following terms. By accessing or using the site, you agree to these terms.',
    ar: 'مرحبًا بك في موقع شويكي اخوان للزجاج. استخدام هذا الموقع يخضع للشروط التالية. من خلال الوصول إلى الموقع أو استخدامه، فإنك توافق على هذه الشروط.',
    ru: 'Добро пожаловать на сайт «Шваки Бразерс». Использование этого сайта регулируется следующими условиями. Получая доступ к сайту или используя его, вы соглашаетесь с этими условиями.',
  },
  sections: {
    ownership: {
      title: {
        he: 'בעלות על התוכן',
        en: 'Content Ownership',
        ar: 'ملكية المحتوى',
        ru: 'Права собственности на контент',
      },
      content: {
        he: 'כל התכנים באתר זה, לרבות אך לא רק: תמונות, עיצובים, טקסטים, לוגואים, גרפיקה, סרטונים ותוכן אחר, הם רכוש בלעדי של אחים שוואקי זכוכית ומוגנים על ידי חוקי זכויות יוצרים וקניין רוחני בישראל ובעולם.',
        en: 'All content on this website, including but not limited to: images, designs, texts, logos, graphics, videos and other content, is the exclusive property of Shwaki Brothers Glassworks and is protected by copyright and intellectual property laws in Israel and worldwide.',
        ar: 'جميع المحتويات الموجودة على هذا الموقع، بما في ذلك على سبيل المثال لا الحصر: الصور والتصاميم والنصوص والشعارات والرسومات ومقاطع الفيديو والمحتويات الأخرى، هي ملكية حصرية لشويكي اخوان للزجاج ومحمية بموجب قوانين حقوق النشر والملكية الفكرية في إسرائيل وحول العالم.',
        ru: 'Весь контент на этом сайте, включая, но не ограничиваясь: изображения, дизайны, тексты, логотипы, графику, видео и другой контент, является исключительной собственностью «Шваки Бразерс» и защищен законами об авторском праве и интеллектуальной собственности в Израиле и во всем мире.',
      },
    },
    images: {
      title: {
        he: 'תמונות ועיצובים',
        en: 'Images and Designs',
        ar: 'الصور والتصاميم',
        ru: 'Изображения и дизайны',
      },
      content: {
        he: 'כל התמונות המוצגות באתר, כולל תמונות של עבודות זכוכית, מקלחונים, מעקות ופרויקטים אחרים, הן תיעוד של עבודות שבוצעו על ידי אחים שוואקי זכוכית ומוגנות בזכויות יוצרים. אין להעתיק, לשכפל, להפיץ או להשתמש בתמונות אלה ללא אישור מפורש בכתב מאיתנו.',
        en: 'All images displayed on the website, including images of glasswork, shower enclosures, railings and other projects, are documentation of work performed by Shwaki Brothers Glassworks and are protected by copyright. These images may not be copied, reproduced, distributed or used without our express written permission.',
        ar: 'جميع الصور المعروضة على الموقع، بما في ذلك صور أعمال الزجاج والمقصورات الاستحمام والدرابزين والمشاريع الأخرى، هي توثيق للأعمال التي تم تنفيذها بواسطة شويكي اخوان للزجاج ومحمية بموجب حقوق النشر. لا يجوز نسخ هذه الصور أو إعادة إنتاجها أو توزيعها أو استخدامها دون إذن كتابي صريح منا.',
        ru: 'Все изображения, представленные на сайте, включая фотографии стеклянных работ, душевых кабин, перил и других проектов, являются документацией работ, выполненных компанией «Шваки Бразерс», и защищены авторским правом. Эти изображения не могут быть скопированы, воспроизведены, распространены или использованы без нашего явного письменного разрешения.',
      },
    },
    prohibited: {
      title: {
        he: 'שימושים אסורים',
        en: 'Prohibited Uses',
        ar: 'الاستخدامات المحظورة',
        ru: 'Запрещенные действия',
      },
      items: {
        copy: {
          he: 'העתקה או הורדה של תמונות לשימוש מסחרי או אישי',
          en: 'Copying or downloading images for commercial or personal use',
          ar: 'نسخ أو تنزيل الصور للاستخدام التجاري أو الشخصي',
          ru: 'Копирование или скачивание изображений для коммерческого или личного использования',
        },
        modify: {
          he: 'שינוי, עיבוד או יצירת יצירות נגזרות מתכני האתר',
          en: 'Modifying, editing or creating derivative works from website content',
          ar: 'تعديل أو تحرير أو إنشاء أعمال مشتقة من محتوى الموقع',
          ru: 'Изменение, редактирование или создание производных работ из контента сайта',
        },
        distribute: {
          he: 'הפצה, פרסום או שיתוף של תכנים מהאתר ללא אישור',
          en: 'Distributing, publishing or sharing website content without permission',
          ar: 'توزيع أو نشر أو مشاركة محتوى الموقع دون إذن',
          ru: 'Распространение, публикация или обмен контентом сайта без разрешения',
        },
        commercial: {
          he: 'שימוש בתכנים למטרות מסחריות או שיווקיות',
          en: 'Using content for commercial or marketing purposes',
          ar: 'استخدام المحتوى لأغراض تجارية أو تسويقية',
          ru: 'Использование контента в коммерческих или маркетинговых целях',
        },
        misrepresent: {
          he: 'הצגת התכנים כשלך או של גורם אחר',
          en: 'Presenting content as your own or as belonging to another party',
          ar: 'تقديم المحتوى على أنه خاص بك أو أنه ينتمي إلى طرف آخر',
          ru: 'Представление контента как своего собственного или принадлежащего другой стороне',
        },
      },
    },
    permission: {
      title: {
        he: 'בקשת אישור',
        en: 'Requesting Permission',
        ar: 'طلب الإذن',
        ru: 'Запрос разрешения',
      },
      content: {
        he: 'אם ברצונך להשתמש בתכנים מהאתר, אנא צור איתנו קשר לקבלת אישור בכתב. אנו עשויים לאשר שימושים מסוימים לפי שיקול דעתנו.',
        en: 'If you wish to use content from the website, please contact us for written permission. We may approve certain uses at our discretion.',
        ar: 'إذا كنت ترغب في استخدام محتوى من الموقع، يرجى الاتصال بنا للحصول على إذن كتابي. قد نوافق على استخدامات معينة وفقًا لتقديرنا.',
        ru: 'Если вы хотите использовать контент с сайта, пожалуйста, свяжитесь с нами для получения письменного разрешения. Мы можем одобрить определенные виды использования по нашему усмотрению.',
      },
    },
    liability: {
      title: {
        he: 'הגבלת אחריות',
        en: 'Limitation of Liability',
        ar: 'تحديد المسؤولية',
        ru: 'Ограничение ответственности',
      },
      content: {
        he: 'האתר מסופק "כפי שהוא". אנו לא אחראים לנזקים ישירים או עקיפים הנובעים משימוש באתר. תמונות הפרויקטים מוצגות למטרות המחשה בלבד ואינן מהוות התחייבות לתוצאות זהות.',
        en: 'The website is provided "as is". We are not liable for direct or indirect damages arising from use of the website. Project images are displayed for illustration purposes only and do not constitute a guarantee of identical results.',
        ar: 'يتم توفير الموقع "كما هو". نحن غير مسؤولين عن الأضرار المباشرة أو غير المباشرة الناتجة عن استخدام الموقع. يتم عرض صور المشاريع لأغراض التوضيح فقط ولا تشكل ضمانًا لنتائج مماثلة.',
        ru: 'Сайт предоставляется «как есть». Мы не несем ответственности за прямые или косвенные убытки, возникающие в результате использования сайта. Изображения проектов представлены только в иллюстративных целях и не являются гарантией идентичных результатов.',
      },
    },
    changes: {
      title: {
        he: 'שינויים בתנאים',
        en: 'Changes to Terms',
        ar: 'التغييرات في الشروط',
        ru: 'Изменения условий',
      },
      content: {
        he: 'אנו שומרים את הזכות לעדכן תנאים אלה בכל עת. המשך השימוש באתר לאחר עדכון התנאים מהווה הסכמה לתנאים המעודכנים.',
        en: 'We reserve the right to update these terms at any time. Continued use of the website after terms are updated constitutes acceptance of the updated terms.',
        ar: 'نحتفظ بالحق في تحديث هذه الشروط في أي وقت. يشكل الاستخدام المستمر للموقع بعد تحديث الشروط قبولًا للشروط المحدثة.',
        ru: 'Мы оставляем за собой право обновлять эти условия в любое время. Продолжение использования сайта после обновления условий означает принятие обновленных условий.',
      },
    },
    contact: {
      title: {
        he: 'יצירת קשר',
        en: 'Contact Us',
        ar: 'اتصل بنا',
        ru: 'Связаться с нами',
      },
      content: {
        he: 'לשאלות בנוגע לתנאי השימוש או לבקשות לשימוש בתכנים, אנא צור קשר:',
        en: 'For questions about terms of use or content usage requests, please contact:',
        ar: 'للاستفسارات حول شروط الاستخدام أو طلبات استخدام المحتوى، يرجى الاتصال:',
        ru: 'По вопросам об условиях использования или запросам на использование контента обращайтесь:',
      },
    },
    israeliLaw: {
      title: {
        he: 'דין ושיפוט',
        en: 'Governing Law',
        ar: 'القانون الحاكم',
        ru: 'Применимое право',
      },
      content: {
        he: 'תנאי שימוש אלה כפופים לחוקי מדינת ישראל. כל מחלוקת תתברר בבתי המשפט המוסמכים בישראל.',
        en: 'These terms of use are governed by the laws of the State of Israel. Any dispute will be resolved in the competent courts in Israel.',
        ar: 'تخضع شروط الاستخدام هذه لقوانين دولة إسرائيل. سيتم حل أي نزاع في المحاكم المختصة في إسرائيل.',
        ru: 'Настоящие условия использования регулируются законодательством Государства Израиль. Любой спор будет разрешен в компетентных судах Израиля.',
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

const TermsOfUse: React.FC<{ locale: SupportedLocale }> = ({ locale }) => {
  const isRTL = isRTLLocale(locale);
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
            <FileText className="w-10 h-10 text-brand-gold" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-navy mb-4">{t(TERMS_CONTENT.title)}</h1>
          <p className="text-gray-500">{t(TERMS_CONTENT.lastUpdated)}</p>
        </div>

        {/* Intro */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <p className="text-gray-700 leading-relaxed">{t(TERMS_CONTENT.intro)}</p>
        </div>

        {/* Content Ownership */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <SectionTitle icon={<Copyright className="w-5 h-5" />} title={t(TERMS_CONTENT.sections.ownership.title)} />
          <p className="text-gray-700">{t(TERMS_CONTENT.sections.ownership.content)}</p>
        </div>

        {/* Images and Designs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <SectionTitle icon={<Copyright className="w-5 h-5" />} title={t(TERMS_CONTENT.sections.images.title)} />
          <p className="text-gray-700">{t(TERMS_CONTENT.sections.images.content)}</p>
        </div>

        {/* Prohibited Uses */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 sm:p-8 mb-6">
          <SectionTitle icon={<AlertTriangle className="w-5 h-5" />} title={t(TERMS_CONTENT.sections.prohibited.title)} />
          <ul className="space-y-3">
            {Object.values(TERMS_CONTENT.sections.prohibited.items).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                {t(item)}
              </li>
            ))}
          </ul>
        </div>

        {/* Permission */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <SectionTitle icon={<Shield className="w-5 h-5" />} title={t(TERMS_CONTENT.sections.permission.title)} />
          <p className="text-gray-700">{t(TERMS_CONTENT.sections.permission.content)}</p>
        </div>

        {/* Liability */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <SectionTitle icon={<Shield className="w-5 h-5" />} title={t(TERMS_CONTENT.sections.liability.title)} />
          <p className="text-gray-700">{t(TERMS_CONTENT.sections.liability.content)}</p>
        </div>

        {/* Changes */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <SectionTitle icon={<FileText className="w-5 h-5" />} title={t(TERMS_CONTENT.sections.changes.title)} />
          <p className="text-gray-700">{t(TERMS_CONTENT.sections.changes.content)}</p>
        </div>

        {/* Israeli Law */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <SectionTitle icon={<Shield className="w-5 h-5" />} title={t(TERMS_CONTENT.sections.israeliLaw.title)} />
          <p className="text-gray-700">{t(TERMS_CONTENT.sections.israeliLaw.content)}</p>
        </div>

        {/* Contact */}
        <div className="bg-brand-navy rounded-2xl p-6 sm:p-8 mb-8 text-white">
          <h2 className="text-xl font-bold mb-4">{t(TERMS_CONTENT.sections.contact.title)}</h2>
          <p className="mb-4 text-gray-300">{t(TERMS_CONTENT.sections.contact.content)}</p>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <span className="text-brand-gold">📧</span>
              <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-brand-gold transition-colors">{CONTACT_INFO.email}</a>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-brand-gold">📱</span>
              <a href={`tel:${CONTACT_INFO.phoneIntl}`} className="hover:text-brand-gold transition-colors">{CONTACT_INFO.phone}</a>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            href={`/${locale}`} 
            className="inline-flex items-center gap-2 text-brand-navy hover:text-brand-gold transition-colors font-medium"
          >
            <Arrow className="w-5 h-5" />
            {t(TERMS_CONTENT.backToHome)}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;

/**
 * JSON-LD Schema Component
 * Provides structured data for SEO and AI search optimization
 * Includes LocalBusiness, FAQPage, and Service schemas
 */
'use client';

import { usePathname } from 'next/navigation';
import { CONTACT_INFO, BUSINESS_INFO, SERVICES, getLocalizedText, type SupportedLocale } from '@/data';

interface JsonLdSchemaProps {
  lang: string;
}

const JsonLdSchema: React.FC<JsonLdSchemaProps> = ({ lang }) => {
  const pathname = usePathname();
  const locale = lang as SupportedLocale;

  // Determine current page
  const pathParts = pathname.split('/').filter(Boolean);
  const page = pathParts[1] || 'home';

  // Check if we are on a specialized page that provides its own specific schemas
  const isLocationPage = pathParts[1] === 'location' || 
                         pathname.includes('glass-installation-') || 
                         ['jerusalem', 'tel-aviv', 'haifa', 'beer-sheva'].includes(pathParts[1]);
                         
  const isServicePage = (pathParts[1] === 'services' && pathParts.length > 2) || 
                        ['glass-shower-installation', 'glass-railing', 'glass-mirrors', 'shop-front-glass', 'glass-partitions'].includes(pathParts[1]);

  const shouldRenderGlobalBusiness = !isLocationPage;
  const shouldRenderGlobalBreadcrumb = !isLocationPage && !isServicePage;

  // LocalBusiness schema (always present unless on location page)
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.shwakiglassworks.com/#business',
    name: getLocalizedText(BUSINESS_INFO.name, locale),
    alternateName: ['Shwaki Brothers Glassworks', 'אחים שוואקי זכוכית', 'شويكي اخوان للزوجاج'],
    description: locale === 'he' 
      ? 'מומחים להתקנת זכוכית בישראל - מקלחונים, מעקות זכוכית, מראות, חזיתות חנויות. מדידה חינם, אחריות שנתיים.'
      : 'Professional glass installation in Israel - shower enclosures, glass railings, mirrors, storefronts. Free measurement, 2-year warranty.',
    url: 'https://www.shwakiglassworks.com',
    telephone: CONTACT_INFO.phoneIntl,
    email: CONTACT_INFO.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jerusalem',
      addressCountry: 'IL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.7683,
      longitude: 35.2137,
    },
    areaServed: [
      { '@type': 'City', name: 'Jerusalem', sameAs: 'https://en.wikipedia.org/wiki/Jerusalem' },
      { '@type': 'City', name: 'Tel Aviv', sameAs: 'https://en.wikipedia.org/wiki/Tel_Aviv' },
      { '@type': 'City', name: 'Haifa', sameAs: 'https://en.wikipedia.org/wiki/Haifa' },
      { '@type': 'City', name: 'Beer Sheva' },
      { '@type': 'City', name: 'Netanya' },
      { '@type': 'City', name: 'Rishon LeZion' },
      { '@type': 'City', name: 'Petah Tikva' },
      { '@type': 'City', name: 'Ashdod' },
      { '@type': 'City', name: 'Herzliya' },
      { '@type': 'City', name: 'Rehovot' },
      { '@type': 'City', name: 'Modiin' },
      { '@type': 'City', name: 'Ramat Gan' },
      { '@type': 'Country', name: 'Israel', sameAs: 'https://en.wikipedia.org/wiki/Israel' },
    ],
    knowsAbout: [
      'Glass Installation', 'Shower Enclosures', 'Glass Railings', 'Mirrors',
      'Tempered Glass', 'Glass Partitions', 'Storefronts', 'Glass Doors',
      'מקלחונים', 'מעקות זכוכית', 'מראות', 'זכוכית מחוסמת',
      'زجاج الدش', 'درابزين زجاجي', 'مرايا', 'واجهات زجاجية',
      'Душевые кабины', 'Стеклянные ограждения', 'Зеркала',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
    },
    priceRange: '₪₪',
    currenciesAccepted: 'ILS',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Friday',
        opens: '08:00',
        closes: '13:00',
      },
    ],
    sameAs: [
      `https://wa.me/${CONTACT_INFO.whatsapp}`,
      'https://www.instagram.com/shwaki_glassworks/',
      'https://www.facebook.com/profile.php?id=100063765481345',
      'https://g.page/r/shwaki-glassworks',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Glass Installation Services',
      itemListElement: SERVICES.slice(0, 6).map((service, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: getLocalizedText(service.title, 'en'),
          description: getLocalizedText(service.description, 'en'),
        },
        position: index + 1,
      })),
    },
    image: [
      'https://www.shwakiglassworks.com/og-image.jpg',
    ],
    foundingDate: BUSINESS_INFO.established,
  };



  // FAQ schema (multilingual — boosts AI citation)
  const faqItems: Record<SupportedLocale, { q: string; a: string }[]> = {
    he: [
      { q: 'כמה עולה התקנת מקלחון זכוכית?', a: 'מחיר מקלחון זכוכית תלוי בגודל, סוג הזכוכית והפרזול. אחים שוואקי מציעים מדידה חינם והצעת מחיר מותאמת אישית ללא עלות.' },
      { q: 'האם אתם מותקנים בכל הארץ?', a: 'כן, אחים שוואקי מציעים שירות בכל ישראל – ירושלים, תל אביב, חיפה, באר שבע, נתניה ועוד.' },
      { q: 'מה ההבדל בין זכוכית מחוסמת לרגילה?', a: 'זכוכית מחוסמת חזקה פי 4-5 מזכוכית רגילה ומתפוררת לרסיסים קטנים כשנשברת – בטוחה יותר ונדרשת בתקן ישראלי למקלחונים ומעקות.' },
      { q: 'כמה זמן לוקחת ההתקנה?', a: 'רוב ההתקנות מסתיימות תוך יום עסקים אחד. מדידה מוקדמת מתבצעת לפני ההתקנה לדיוק מקסימלי.' },
      { q: 'האם יש אחריות על ההתקנה?', a: 'כן, אחים שוואקי מציעים אחריות מלאה של שנתיים על חומרים ועבודה על כל ההתקנות.' },
    ],
    en: [
      { q: 'How much does glass shower installation cost in Israel?', a: 'The cost depends on size, glass type, and hardware. Shwaki Brothers offer a free on-site measurement and personalized quote at no charge.' },
      { q: 'Do you serve all of Israel?', a: 'Yes, Shwaki Brothers serve the entire country — Jerusalem, Tel Aviv, Haifa, Beer Sheva, Netanya, and all other cities.' },
      { q: 'What is the difference between tempered and regular glass?', a: 'Tempered glass is 4–5× stronger than regular glass and crumbles into small rounded pieces when broken — required by Israeli building code for showers and railings.' },
      { q: 'How long does glass installation take?', a: 'Most installations are completed within one business day. A measurement visit is scheduled first to ensure precision.' },
      { q: 'Is there a warranty on installations?', a: 'Yes, Shwaki Brothers provide a full 2-year warranty on all materials and workmanship.' },
    ],
    ar: [
      { q: 'كم تكلفة تركيب كابينة الدش الزجاجية في إسرائيل؟', a: 'التكلفة تعتمد على الحجم ونوع الزجاج والمعدات. إخوة شواكي يقدمون قياسًا مجانيًا وعرض سعر مخصصًا بدون أي رسوم.' },
      { q: 'هل تخدمون جميع أنحاء إسرائيل؟', a: 'نعم، إخوة شواكي يخدمون جميع أنحاء البلاد — القدس، تل أبيب، حيفا، بئر السبع، ونتانيا وسائر المدن.' },
      { q: 'ما الفرق بين الزجاج المقسى والزجاج العادي؟', a: 'الزجاج المقسى أقوى 4-5 مرات من الزجاج العادي ويتفتت إلى قطع صغيرة مستديرة عند الكسر — وهو مطلوب بموجب قانون البناء الإسرائيلي للدش والدرابزين.' },
      { q: 'كم يستغرق تركيب الزجاج؟', a: 'تكتمل معظم عمليات التركيب في يوم عمل واحد. يُحدَّد موعد زيارة قياس مسبق لضمان الدقة.' },
      { q: 'هل يوجد ضمان على التركيب؟', a: 'نعم، إخوة شواكي يقدمون ضمانًا كاملًا لمدة سنتين على جميع المواد والعمالة.' },
    ],
    ru: [
      { q: 'Сколько стоит установка стеклянной душевой кабины в Израиле?', a: 'Стоимость зависит от размера, типа стекла и фурнитуры. Братья Шваки предлагают бесплатный выезд для замера и персональное коммерческое предложение.' },
      { q: 'Вы обслуживаете всю территорию Израиля?', a: 'Да, Братья Шваки работают по всей стране — Иерусалим, Тель-Авив, Хайфа, Беэр-Шева, Нетания и все остальные города.' },
      { q: 'В чём разница между закалённым и обычным стеклом?', a: 'Закалённое стекло в 4–5 раз прочнее обычного и при разрушении рассыпается на мелкие округлые осколки. Обязательно по израильскому строительному стандарту для душевых и ограждений.' },
      { q: 'Сколько времени занимает установка?', a: 'Большинство монтажей завершается за один рабочий день. Перед установкой проводится предварительный выезд для замеров.' },
      { q: 'Есть ли гарантия на установку?', a: 'Да, Братья Шваки предоставляют полную гарантию 2 года на материалы и работу.' },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faqItems[locale] ?? faqItems.en).map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  // WebSite schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Shwaki Brothers Glassworks',
    alternateName: 'אחים שוואקי זכוכית',
    url: 'https://www.shwakiglassworks.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.shwakiglassworks.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['he', 'en', 'ar', 'ru'],
  };

  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'he' ? 'בית' : 'Home',
        item: `https://www.shwakiglassworks.com/${locale}`,
      },
      ...(page !== 'home' ? [{
        '@type': 'ListItem',
        position: 2,
        name: page.charAt(0).toUpperCase() + page.slice(1),
        item: `https://www.shwakiglassworks.com/${locale}/${page}`,
      }] : []),
    ],
  };

  return (
    <>
      {shouldRenderGlobalBusiness && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {shouldRenderGlobalBreadcrumb && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      )}
    </>
  );
};

export default JsonLdSchema;

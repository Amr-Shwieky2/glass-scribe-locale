/**
 * Server-safe SEO data + metadata builder.
 *
 * Every route's `generateMetadata` goes through `buildPageMetadata` so each page
 * gets its own localized title/description, a self-referencing canonical and a
 * full hreflang set (he/en/ar/ru + x-default → he).
 */
import type { Metadata } from 'next';
import type { SupportedLocale } from './types';
import { BUSINESS_INFO } from './business-info';
import { LOCALES, DEFAULT_LOCALE } from '@/lib/i18n';
import type { AggregateRating } from '@/lib/google-places';

export const SITE_URL = 'https://www.shwakiglassworks.com';
export const SITE_NAME = 'Shwaki Brothers Glassworks';
export const OG_IMAGE =
  'https://res.cloudinary.com/dc1q8upxt/image/upload/c_fill,w_1200,h_630,g_auto,q_auto,f_jpg/shwaki-glassworks/hero/1';

export const OG_LOCALE: Record<SupportedLocale, string> = {
  he: 'he_IL',
  en: 'en_US',
  ar: 'ar_SA',
  ru: 'ru_RU',
};

export interface PageSeo {
  title: string;
  description: string;
  keywords?: string;
}

type LocalizedSeo = Record<SupportedLocale, PageSeo>;

// =============================================================================
// DEFAULTS (keywords are shared by pages that don't define their own)
// =============================================================================

export const DEFAULT_SEO: LocalizedSeo = {
  he: {
    title: 'אחים שוואקי זכוכית | מקלחונים, מעקות זכוכית, מראות | זגג מקצועי',
    description: 'אחים שוואקי זכוכית - זגג מקצועי ומומחים להתקנת זכוכית בישראל. מקלחונים, מעקות זכוכית, מראות, חזיתות חנויות. מדידה חינם, שירות בכל הארץ.',
    keywords: 'מקלחון, מקלחונים, מעקה זכוכית, מעקות זכוכית, מראה, מראות, חזית זכוכית, חזיתות זכוכית, התקנת זכוכית, זכוכית מחוסמת, מחיצה זכוכית, מחיצות זכוכית, זגג, זגגים, זגגות, עבודות זגגות, בעל מקצוע זכוכית, מומחה זכוכית, מתקין מקלחונים, מתקין מעקות, דלת זכוכית, דלתות זכוכית, קיר זכוכית, קירות זכוכית, מעקה למרפסת, מעקות למרפסת, מעקה למדרגות, מעקות למדרגות, חיפוי זכוכית, זכוכית לאמבטיה, זכוכית למטבח, זכוכית בטיחותית, זכוכית שקופה, זכוכית מט, זכוכית חלבית, מעקות זכוכית ונירוסטה, ויטרינה, ויטרינות, חלון ראווה, חלונות ראווה, דלת כניסה זכוכית, מחיצות משרד, מקלחון ללא מסגרת, מקלחון פינתי, מקלחון חזיתי, מקלחון הזזה, מקלחון צירים, מקלחון מתקפל, מקלחון בהתאמה אישית, מקלחון ללא מסגרת, זגג מקצועי, אחים שוואקי, שוואקי זכוכית, זכוכית ירושלים, זכוכית תל אביב, זכוכית חיפה, זכוכית באר שבע, זכוכית נתניה, זכוכית הרצליה, זכוכית רמת גן, זכוכית פתח תקווה, זכוכית אשדוד, זכוכית ראשון לציון, מקלחונים ירושלים, מקלחונים תל אביב, מעקות זכוכית ירושלים, זכוכית אקוסטית, זכוכית מבודדת, זכוכית כפולה, הזמנת מקלחון, התקנת מראות, עבודות זכוכית, גידור בריכה, מעקה בריכה, מדף זכוכית, מדפי זכוכית, שולחן זכוכית, רצפת זכוכית, תקרת זכוכית, גג זכוכית, פרגולת זכוכית',
  },
  en: {
    title: 'Shwaki Brothers Glassworks | Shower Glass, Railings, Mirrors | Glazier Israel',
    description: 'Professional glazier and glass installation in Israel - shower enclosures, glass railings, mirrors, storefronts. Free measurements, nationwide service.',
    keywords: 'glass installation Israel, shower glass, shower door, shower screen, shower enclosure, shower cabin, glass shower, frameless shower, walk-in shower, sliding shower door, pivot shower door, hinged shower door, glass railings, glass balustrade, glass fence, pool fencing, balcony glass, stair railing, mirrors, bathroom mirror, gym mirror, custom mirror, LED mirror, storefronts, shopfront, display window, glass partitions, office glass, room divider, tempered glass, toughened glass, safety glass, laminated glass, float glass, frosted glass, etched glass, sandblasted glass, patterned glass, acoustic glass, glass doors, interior glass, exterior glass, glazier, glazing, glass fitter, glass installer, glass contractor, glass company Israel, Shwaki Brothers, glassworks, professional glass, commercial glass, residential glass, glass work, glazing services, glass entrance, custom glass, Tel Aviv glass, Jerusalem glass, Haifa glass, glass fitting Israel',
  },
  ar: {
    title: 'شويكي اخوان للزوجاج | زجاج الدش، درابزين، مرايا | زجّاج محترف',
    description: 'زجّاج محترف وتركيب زجاج في إسرائيل - كبائن الدش، درابزين زجاجي، مرايا، واجهات. قياسات مجانية، خدمة في جميع أنحاء البلاد.',
    keywords: 'زجاج, تركيب زجاج, زجّاج, زجاجي, بلور, زجاج الدش, كابينة دش, كبينة دش, دش زجاج, باب دش, باب دش منزلق, دش بدون إطار, درابزين زجاجي, دربزون, درابزين شرفة, درابزين درج, سياج زجاج, سياج مسبح, مرآة, مرايا, مراية, مرايات, مرآة حمام, مرآة مضاءة, واجهة زجاجية, واجهات, فترينا, فترينات, فواصل زجاجية, مكتب زجاج, حاجز زجاجي, زجاج مقسى, زجاج أمان, زجاج مصنفر, زجاج مزخرف, أبواب زجاجية, باب زجاج, شباك زجاج, نافذة زجاج, جدران زجاجية, جدار زجاج, سقف زجاج, أرضية زجاج, زجاج حمام, زجاج مطبخ, شركة زجاج إسرائيل, مقاول زجاج, ورشة زجاج, تفصيل زجاج, أعمال زجاج, خدمات تزجيج, زجاج القدس, زجاج حيفا, زجاج الناصرة, زجاج يافا, شويكي اخوان',
  },
  ru: {
    title: 'Братья Шваки — Стеклянные работы | Душевые кабины, Ограждения, Зеркала | Стекольщик Израиль',
    description: 'Профессиональный стекольщик и установка стекла в Израиле - душевые кабины, стеклянные ограждения, зеркала, витрины. Бесплатные замеры по всей стране.',
    keywords: 'стекло, стекольщик, стеклянные работы, установка стекла Израиль, душевая, душевая кабина, душевые кабины, душевое стекло, душевая дверь, раздвижная дверь душа, распашная дверь душа, безрамная душевая, стеклянные ограждения, перила, балконные ограждения, перила для лестниц, стеклянный забор, ограждение бассейна, зеркало, зеркала, зеркало для ванной, зеркало с подсветкой, зеркало на заказ, витрина, витрины, стеклянные перегородки, офисное стекло, перегородка комнаты, закаленное стекло, безопасное стекло, ламинированное стекло, матовое стекло, узорчатое стекло, акустическое стекло, стеклянные двери, внутреннее стекло, наружное стекло, остекление, стеклянная компания Израиль, монтаж стекла, подрядчик по стеклу, стекольные услуги, коммерческое стекло, жилое стекло, Братья Шваки, стекло Тель-Авив, стекло Иерусалим, стекло Хайфа',
  },
};

// =============================================================================
// HOME — the rating sentence is only inserted when live Google data exists
// =============================================================================

const HOME_TITLE: Record<SupportedLocale, string> = {
  he: 'אחים שוואקי זכוכית | מקלחונים, מעקות זכוכית, מראות | זגג מקצועי ישראל',
  en: 'Shwaki Brothers Glassworks | Shower Glass, Railings, Mirrors | #1 Glazier Israel',
  ar: 'شويكي اخوان للزوجاج | كابينات دش، درابزين زجاجي، مرايا | زجّاج محترف في إسرائيل',
  ru: 'Братья Шваки — Стеклянные работы | Душевые кабины, Ограждения, Зеркала | Стекольщик Израиль',
};

const HOME_DESCRIPTION: Record<SupportedLocale, { lead: string; tail: string }> = {
  he: {
    lead: 'אחים שוואקי זכוכית – מומחים להתקנת זכוכית בישראל מאז 2015. מקלחונים, מעקות זכוכית, מראות, חזיתות חנויות.',
    tail: 'מדידה חינם, אחריות שנתיים, שירות בכל הארץ.',
  },
  en: {
    lead: 'Professional glazier & glass installation in Israel since 2015 — shower enclosures, glass railings, mirrors, storefronts.',
    tail: 'Free measurement, 2-year warranty, nationwide service.',
  },
  ar: {
    lead: 'زجّاج محترف وتركيب زجاج في إسرائيل منذ 2015 – كابينات الدش، درابزين زجاجي، مرايا، واجهات.',
    tail: 'قياسات مجانية، ضمان سنتين، خدمة في جميع أنحاء البلاد.',
  },
  ru: {
    lead: 'Профессиональный стекольщик в Израиле с 2015 г. — душевые кабины, стеклянные ограждения, зеркала, витрины.',
    tail: 'Бесплатный замер, гарантия 2 года, работаем по всей стране.',
  },
};

function ratingSentence(locale: SupportedLocale, rating: AggregateRating): string {
  const value = rating.ratingValue.toFixed(1);
  const count = rating.reviewCount;
  switch (locale) {
    case 'he': return `⭐ ${value}/5 מ-${count} ביקורות.`;
    case 'ar': return `⭐ ${value}/5 من ${count} تقييم.`;
    case 'ru': return `⭐ ${value}/5 по ${count} отзывам.`;
    default: return `⭐ ${value}/5 from ${count} reviews.`;
  }
}

export function getHomeSeo(locale: SupportedLocale, rating: AggregateRating | null): PageSeo {
  const { lead, tail } = HOME_DESCRIPTION[locale];
  const parts = rating ? [lead, ratingSentence(locale, rating), tail] : [lead, tail];
  return {
    title: HOME_TITLE[locale],
    description: parts.join(' '),
    keywords: DEFAULT_SEO[locale].keywords,
  };
}

// =============================================================================
// STATIC PAGES
// =============================================================================

export type StaticPageKey =
  | 'services' | 'projects' | 'about' | 'contact' | 'contractors'
  | 'blog' | 'privacy' | 'terms' | 'admin';

export const PAGE_SEO: Record<StaticPageKey, LocalizedSeo> = {
  services: {
    he: { title: 'השירותים שלנו | מקלחונים, מעקות, מראות, חזיתות', description: 'מגוון שירותי התקנת זכוכית - מקלחונים ללא מסגרת, מעקות זכוכית, מראות מעוצבות, חזיתות חנויות, מחיצות משרד. איכות פרימיום.' },
    en: { title: 'Our Services | Showers, Railings, Mirrors, Storefronts', description: 'Comprehensive glass installation services - frameless showers, glass railings, custom mirrors, storefronts, office partitions. Premium quality.' },
    ar: { title: 'خدماتنا | الدش، درابزين، مرايا، واجهات', description: 'خدمات تركيب زجاج شاملة - دش بدون إطار، درابزين زجاجي، مرايا مخصصة، واجهات، فواصل مكتبية. جودة متميزة.' },
    ru: { title: 'Наши услуги | Душевые, Ограждения, Зеркала, Витрины', description: 'Комплексные услуги по установке стекла - безрамные душевые, ограждения, зеркала на заказ, витрины, офисные перегородки.' },
  },
  projects: {
    he: { title: 'גלריית עבודות זכוכית | מקלחונים, מעקות, מראות | אחים שוואקי', description: 'צפו בגלריית עבודות הזכוכית שלנו - מקלחונים מעוצבים, מעקות זכוכית, מראות, חזיתות חנויות ועוד. עבודות איכותיות ברחבי ישראל.', keywords: 'גלריית מקלחונים, תמונות מעקות זכוכית, עבודות זכוכית, פרויקטים מקלחונים, התקנת מקלחון' },
    en: { title: 'Glass Projects Gallery | Showers, Railings, Mirrors | Shwaki Brothers', description: 'View our glass work gallery - designer shower enclosures, glass railings, mirrors, storefronts and more. Quality installations across Israel.', keywords: 'glass gallery, shower photos, glass railing projects, glass installations, mirror gallery' },
    ar: { title: 'معرض أعمال الزجاج | دش زجاجي، درابزين، مرايا | إخوة شواكي', description: 'شاهد معرض أعمال الزجاج لدينا - حمامات زجاجية، درابزين زجاجي، مرايا وواجهات متاجر. أعمال عالية الجودة في جميع أنحاء إسرائيل.', keywords: 'معرض زجاج، صور دش زجاجي، مشاريع درابزين زجاج، تركيب زجاج' },
    ru: { title: 'Галерея стеклянных работ | Душевые, Ограждения, Зеркала | Братья Шваки', description: 'Смотрите галерею наших стеклянных работ - дизайнерские душевые кабины, стеклянные ограждения, зеркала, витрины магазинов. Качественные работы по всему Израилю.', keywords: 'галерея стекла, фото душевых, проекты стеклянных ограждений, установка стекла' },
  },
  about: {
    he: { title: 'אודות | אחים שוואקי זכוכית', description: 'הכירו את אחים שוואקי זכוכית - עסק משפחתי עם ניסיון של שנים בהתקנת זכוכית מקצועית. מחויבות לאיכות ושירות.' },
    en: { title: 'About Us | Shwaki Brothers Glassworks', description: 'Meet Shwaki Brothers Glassworks - a family business with years of experience in professional glass installation. Commitment to quality.' },
    ar: { title: 'من نحن | شويكي اخوان للزوجاج', description: 'تعرف على شويكي اخوان - شركة عائلية مع سنوات من الخبرة في تركيب الزجاج الاحترافي. الالتزام بالجودة والخدمة.' },
    ru: { title: 'О нас | Братья Шваки', description: 'Познакомьтесь с Братьями Шваки - семейный бизнес с многолетним опытом профессиональной установки стекла.' },
  },
  contact: {
    he: { title: 'צור קשר | אחים שוואקי זכוכית', description: 'צרו קשר לקבלת הצעת מחיר חינם. טלפון, וואטסאפ, טופס יצירת קשר. שירות מהיר בכל רחבי ישראל.' },
    en: { title: 'Contact Us | Shwaki Brothers Glassworks', description: 'Contact us for a free quote. Phone, WhatsApp, contact form. Fast service throughout Israel.' },
    ar: { title: 'اتصل بنا | شويكي اخوان للزوجاج', description: 'اتصل بنا للحصول على عرض أسعار مجاني. هاتف، واتساب، نموذج اتصال. خدمة سريعة في جميع أنحاء إسرائيل.' },
    ru: { title: 'Контакты | Братья Шваки', description: 'Свяжитесь с нами для бесплатной консультации. Телефон, WhatsApp, форма обратной связи. Быстрый сервис по всему Израилю.' },
  },
  contractors: {
    he: { title: 'לקבלנים ואדריכלים | שירותי B2B', description: 'שירותי זכוכית לקבלנים, אדריכלים ומעצבים. מחירים מיוחדים, אספקה בזמן, תמיכה מקצועית.' },
    en: { title: 'For Contractors & Architects | B2B Services', description: 'Glass services for contractors, architects and designers. Special pricing, on-time delivery, professional support.' },
    ar: { title: 'للمقاولين والمهندسين | خدمات B2B', description: 'خدمات زجاج للمقاولين والمهندسين المعماريين والمصممين. أسعار خاصة، تسليم في الوقت المحدد، دعم احترافي.' },
    ru: { title: 'Для подрядчиков и архитекторов | B2B услуги', description: 'Стеклянные услуги для подрядчиков, архитекторов и дизайнеров. Специальные цены, своевременная доставка.' },
  },
  blog: {
    he: { title: 'בלוג ומדריכים | אחים שוואקי זכוכית', description: 'קראו את המדריכים המקצועיים שלנו בנושאי התקנת מקלחונים, זכוכית, מעקות וטרנדים בעיצוב הבית בגובה העיניים.' },
    en: { title: 'Blog & Guides | Shwaki Brothers Glassworks', description: 'Read our professional guides on glass installation, shower enclosures, railings, and home design trends.' },
    ar: { title: 'المدونة والأدلة | إخوة شواكي للزجاج', description: 'اقرأ أدلتنا المهنية حول تركيب الزجاج وكابينات الدش والدرابزين واتجاهات تصميم المنازل.' },
    ru: { title: 'Блог и руководства | Братья Шваки', description: 'Читайте наши профессиональные руководства по установке стекла, душевых кабин, ограждений и тенденциям дизайна.' },
  },
  privacy: {
    he: { title: 'מדיניות פרטיות | אחים שוואקי זכוכית', description: 'מדיניות הפרטיות של אחים שוואקי זכוכית – אילו נתונים אנו אוספים, מדוע, וכיצד אנו משתמשים בהם ומגנים עליהם.' },
    en: { title: 'Privacy Policy | Shwaki Brothers Glassworks', description: 'Shwaki Brothers Glassworks privacy policy – what data we collect, why we collect it, and how we use and protect it.' },
    ar: { title: 'سياسة الخصوصية | شويكي اخوان للزوجاج', description: 'سياسة الخصوصية لشويكي اخوان للزجاج – البيانات التي نجمعها ولماذا نجمعها وكيف نستخدمها ونحميها.' },
    ru: { title: 'Политика конфиденциальности | Братья Шваки', description: 'Политика конфиденциальности «Братья Шваки» — какие данные мы собираем, зачем и как мы их используем и защищаем.' },
  },
  terms: {
    he: { title: 'תנאי שימוש | אחים שוואקי זכוכית', description: 'תנאי השימוש באתר אחים שוואקי זכוכית.' },
    en: { title: 'Terms of Use | Shwaki Brothers Glassworks', description: 'Terms of use for the Shwaki Brothers Glassworks website.' },
    ar: { title: 'شروط الاستخدام | شويكي اخوان للزوجاج', description: 'شروط استخدام موقع شويكي اخوان للزجاج.' },
    ru: { title: 'Условия использования | Братья Шваки', description: 'Условия использования сайта «Братья Шваки».' },
  },
  admin: {
    he: { title: 'ניהול | אחים שוואקי זכוכית', description: 'אזור ניהול.' },
    en: { title: 'Admin | Shwaki Brothers Glassworks', description: 'Admin area.' },
    ar: { title: 'الإدارة | شويكي اخوان للزوجاج', description: 'منطقة الإدارة.' },
    ru: { title: 'Администрирование | Братья Шваки', description: 'Административная панель.' },
  },
};

export function getPageSeo(page: StaticPageKey, locale: SupportedLocale): PageSeo {
  return PAGE_SEO[page][locale];
}

/** Location landing pages (/[lang]/jerusalem …). */
export function getLocationSeo(locale: SupportedLocale, cityName: string): PageSeo {
  switch (locale) {
    case 'he':
      return {
        title: `מקלחונים ומעקות זכוכית ${cityName} | שירותי זכוכית | אחים שוואקי`,
        description: `אחים שוואקי זכוכית - מומחים להתקנת מקלחונים ומעקות זכוכית ב${cityName}. שירות מקצועי, מדידה חינם.`,
        keywords: `מקלחונים ${cityName}, מעקות זכוכית ${cityName}, זגג ${cityName}`,
      };
    case 'ar':
      return {
        title: `كابينات دش ودرابزين زجاجي في ${cityName} | خدمات الزجاج | شويكي اخوان`,
        description: `شويكي اخوان للزجاج - خبراء في تركيب كابينات الدش والدرابزين الزجاجي في ${cityName}. خدمة احترافية وقياس مجاني.`,
        keywords: `كابينة دش ${cityName}, درابزين زجاجي ${cityName}, زجّاج ${cityName}`,
      };
    case 'ru':
      return {
        title: `Душевые кабины и стеклянные ограждения — ${cityName} | Стекольные услуги | Братья Шваки`,
        description: `Братья Шваки — специалисты по установке душевых кабин и стеклянных ограждений: ${cityName}. Профессиональный сервис, бесплатный замер.`,
        keywords: `душевые кабины ${cityName}, стеклянные ограждения ${cityName}, стекольщик ${cityName}`,
      };
    default:
      return {
        title: `Showers and Glass Railings ${cityName} | Glass Services | Shwaki Brothers`,
        description: `Shwaki Brothers Glassworks - Experts in installing showers and glass railings in ${cityName}. Professional service, free measurement.`,
        keywords: `showers ${cityName}, glass railings ${cityName}, glazier ${cityName}`,
      };
  }
}

export const BLOG_BRAND: Record<SupportedLocale, string> = {
  he: 'הבלוג של אחים שוואקי',
  en: 'Shwaki Brothers Blog',
  ar: 'مدونة إخوة شواكي',
  ru: 'Блог Братьев Шваки',
};

// =============================================================================
// SITEMAP — date each page's content last changed. Update when you edit a page.
// =============================================================================

export const CONTENT_LAST_MODIFIED = {
  home: '2026-10-19',
  services: '2026-10-19',
  projects: '2026-10-19',
  about: '2026-10-19',
  contact: '2026-10-19',
  blog: '2026-10-19',
  contractors: '2026-10-19',
  privacy: '2026-10-19',
  terms: '2026-03-01',
  servicePages: '2026-10-19',
  locationPages: '2026-10-19',
} as const;

// =============================================================================
// METADATA BUILDER
// =============================================================================

const BRAND_MARKERS = ['Shwaki', 'שוואקי', 'شويكي', 'شواكي', 'Шваки'];

/** Appends the localized brand unless the title already names it. */
function withBrand(title: string, locale: SupportedLocale): string {
  if (BRAND_MARKERS.some((m) => title.includes(m))) return title;
  return `${title} | ${BUSINESS_INFO.name[locale]}`;
}

export function pageUrl(locale: SupportedLocale, path = ''): string {
  return `${SITE_URL}/${locale}${path}`;
}

/** hreflang map for the same `path` in every locale, x-default → Hebrew. */
export function languageAlternates(path = ''): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = pageUrl(l, path);
  languages['x-default'] = pageUrl(DEFAULT_LOCALE, path);
  return languages;
}

interface BuildOptions {
  type?: 'website' | 'article';
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  image?: string;
}

/**
 * @param path Path after the locale, starting with '/' ('' for the home page).
 */
export function buildPageMetadata(
  locale: SupportedLocale,
  path: string,
  seo: PageSeo,
  options: BuildOptions = {}
): Metadata {
  const title = withBrand(seo.title, locale);
  const url = pageUrl(locale, path);
  const image = options.image ?? OG_IMAGE;

  return {
    title: { absolute: title },
    description: seo.description,
    keywords: seo.keywords ?? DEFAULT_SEO[locale].keywords,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      title,
      description: seo.description,
      url,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [{ url: image, width: 1200, height: 630 }],
      ...(options.type === 'article'
        ? {
            type: 'article' as const,
            publishedTime: options.publishedTime,
            modifiedTime: options.modifiedTime ?? options.publishedTime,
          }
        : { type: 'website' as const }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: seo.description,
      images: [image],
    },
    ...(options.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

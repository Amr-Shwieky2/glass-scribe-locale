/**
 * SEO Head Component
 * Dynamically updates meta tags for each page
 * Improves SEO and social sharing for all pages
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SupportedLocale } from '@/data';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
}

const BASE_URL = 'https://shwakiglassworks.com';

const DEFAULT_SEO: Record<SupportedLocale, { title: string; description: string; keywords: string }> = {
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

const PAGE_SEO: Record<string, Record<SupportedLocale, { title: string; description: string }>> = {
  services: {
    he: { title: 'השירותים שלנו | מקלחונים, מעקות, מראות, חזיתות', description: 'מגוון שירותי התקנת זכוכית - מקלחונים ללא מסגרת, מעקות זכוכית, מראות מעוצבות, חזיתות חנויות, מחיצות משרד. איכות פרימיום.' },
    en: { title: 'Our Services | Showers, Railings, Mirrors, Storefronts', description: 'Comprehensive glass installation services - frameless showers, glass railings, custom mirrors, storefronts, office partitions. Premium quality.' },
    ar: { title: 'خدماتنا | الدش، درابزين، مرايا، واجهات', description: 'خدمات تركيب زجاج شاملة - دش بدون إطار، درابزين زجاجي، مرايا مخصصة، واجهات، فواصل مكتبية. جودة متميزة.' },
    ru: { title: 'Наши услуги | Душевые, Ограждения, Зеркала, Витрины', description: 'Комплексные услуги по установке стекла - безрамные душевые, ограждения, зеркала на заказ, витрины, офисные перегородки.' },
  },
  projects: {
    he: { title: 'הפרויקטים שלנו | גלריית עבודות זכוכית', description: 'צפו בפרויקטים האחרונים שלנו - מקלחונים, מעקות זכוכית, מראות, חזיתות. השראה לפרויקט הבא שלכם.' },
    en: { title: 'Our Projects | Glass Works Gallery', description: 'View our recent projects - showers, glass railings, mirrors, storefronts. Get inspiration for your next project.' },
    ar: { title: 'مشاريعنا | معرض أعمال الزجاج', description: 'شاهد مشاريعنا الأخيرة - الدش، الدرابزين الزجاجي، المرايا، الواجهات. احصل على إلهام لمشروعك القادم.' },
    ru: { title: 'Наши проекты | Галерея стеклянных работ', description: 'Посмотрите наши последние проекты - душевые, ограждения, зеркала, витрины. Вдохновение для вашего проекта.' },
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
};

// Cloudinary-based OG image - using a hero image with optimal social media dimensions
// The image is from the hero gallery, cropped to 1200x630 for optimal OG display
const CLOUDINARY_CLOUD = 'dc1q8upxt';
const OG_IMAGE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/c_fill,w_1200,h_630,g_auto,q_auto,f_jpg/shwaki-glassworks/hero/1`;

const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = OG_IMAGE,
  type = 'website',
  noindex = false,
}) => {
  const { currentLanguage } = useLanguage();
  const location = useLocation();
  const locale = currentLanguage as SupportedLocale;

  useEffect(() => {
    // Determine page from path
    const pathParts = location.pathname.split('/').filter(Boolean);
    const page = pathParts[1] || 'home'; // e.g., /he/services -> 'services'
    
    // Get SEO data
    const pageSeo = PAGE_SEO[page]?.[locale];
    const defaultSeo = DEFAULT_SEO[locale];
    
    const finalTitle = title || pageSeo?.title || defaultSeo.title;
    const finalDescription = description || pageSeo?.description || defaultSeo.description;
    const finalKeywords = keywords || defaultSeo.keywords;
    const currentUrl = `${BASE_URL}${location.pathname}`;

    // Update document title
    document.title = finalTitle;

    // Helper to update/create meta tag
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Standard meta tags
    setMeta('description', finalDescription);
    setMeta('keywords', finalKeywords);
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    // Open Graph
    setMeta('og:title', finalTitle, true);
    setMeta('og:description', finalDescription, true);
    setMeta('og:url', currentUrl, true);
    setMeta('og:image', image, true);
    setMeta('og:type', type, true);
    setMeta('og:locale', locale === 'he' ? 'he_IL' : locale === 'ar' ? 'ar_SA' : locale === 'ru' ? 'ru_RU' : 'en_US', true);

    // Twitter
    setMeta('twitter:title', finalTitle);
    setMeta('twitter:description', finalDescription);
    setMeta('twitter:image', image);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Update hreflang tags
    const languages = ['he', 'en', 'ar', 'ru'];
    languages.forEach(lang => {
      const href = `${BASE_URL}/${lang}${pathParts.length > 1 ? '/' + pathParts.slice(1).join('/') : ''}`;
      let hreflang = document.querySelector(`link[hreflang="${lang}"]`);
      if (!hreflang) {
        hreflang = document.createElement('link');
        hreflang.setAttribute('rel', 'alternate');
        hreflang.setAttribute('hreflang', lang);
        document.head.appendChild(hreflang);
      }
      hreflang.setAttribute('href', href);
    });

    // Update x-default
    let xDefault = document.querySelector('link[hreflang="x-default"]');
    if (!xDefault) {
      xDefault = document.createElement('link');
      xDefault.setAttribute('rel', 'alternate');
      xDefault.setAttribute('hreflang', 'x-default');
      document.head.appendChild(xDefault);
    }
    xDefault.setAttribute('href', `${BASE_URL}/he${pathParts.length > 1 ? '/' + pathParts.slice(1).join('/') : ''}`);

    // Update HTML lang attribute
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'he' || locale === 'ar' ? 'rtl' : 'ltr';

  }, [location.pathname, currentLanguage, title, description, keywords, image, type, noindex, locale]);

  return null; // This component doesn't render anything
};

export default SEOHead;

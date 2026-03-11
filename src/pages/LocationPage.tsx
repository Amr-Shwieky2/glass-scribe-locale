/**
 * Location Landing Page Component
 * Dynamic page for city-specific SEO landing pages
 * Optimized for local search: "זגג ירושלים", "glass installation Tel Aviv", etc.
 */

import React, { useMemo } from 'react';
import { useParams, Link, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Phone, MessageCircle, CheckCircle, Star, Clock, ArrowRight, Shield } from 'lucide-react';
import { CONTACT_INFO, UI_STRINGS, SERVICES, getLocalizedText, type SupportedLocale } from '@/data';
import SEOHead from '@/components/SEOHead';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import GoogleReviews from '@/components/home/GoogleReviews';
import LocationJsonLd from '@/components/LocationJsonLd';
import Breadcrumbs from '@/components/Breadcrumbs';

// Location data with comprehensive content
const LOCATIONS = {
  jerusalem: {
    slug: 'jerusalem',
    name: {
      en: 'Jerusalem',
      he: 'ירושלים',
      ar: 'القدس',
      ru: 'Иерусалим',
    },
    heroTitle: {
      en: 'Glass Installation in Jerusalem',
      he: 'התקנת זכוכית בירושלים',
      ar: 'تركيب الزجاج في القدس',
      ru: 'Установка стекла в Иерусалиме',
    },
    heroSubtitle: {
      en: 'Premium glass installation services for Jerusalem homes and businesses. Shower enclosures, glass railings, mirrors, and storefronts.',
      he: 'שירותי התקנת זכוכית פרימיום לבתים ועסקים בירושלים. מקלחונים, מעקות זכוכית, מראות וחזיתות חנויות.',
      ar: 'خدمات تركيب الزجاج المتميزة للمنازل والشركات في القدس. حواجز الدش، الدرابزين الزجاجي، المرايا وواجهات المحلات.',
      ru: 'Премиальные услуги по установке стекла для домов и предприятий Иерусалима.',
    },
    description: {
      en: 'Shwaki Brothers Glassworks has been serving Jerusalem residents for over 15 years. Our expert glaziers provide professional glass installation throughout the Jerusalem district, including Ein Kerem, Talpiot, Katamon, German Colony, Beit HaKerem, and surrounding areas. We understand the unique architectural styles of Jerusalem homes, from traditional stone buildings to modern apartments, and customize our glass solutions accordingly.',
      he: 'אחים שוואקי זכוכית משרתים את תושבי ירושלים למעלה מ-15 שנה. הזגגים המומחים שלנו מספקים התקנת זכוכית מקצועית בכל רחבי מחוז ירושלים, כולל עין כרם, תלפיות, קטמון, המושבה הגרמנית, בית הכרם והאזורים הסמוכים. אנו מבינים את הסגנונות האדריכליים הייחודיים של בתי ירושלים, ממבנים מסורתיים מאבן ועד דירות מודרניות, ומתאימים את פתרונות הזכוכית שלנו בהתאם.',
      ar: 'شويكي إخوان للزجاج تخدم سكان القدس لأكثر من 15 عامًا. يقدم خبراء الزجاج لدينا تركيب زجاج احترافي في جميع أنحاء منطقة القدس.',
      ru: 'Братья Шваки обслуживают жителей Иерусалима более 15 лет. Наши эксперты-стекольщики выполняют профессиональную установку стекла по всему округу Иерусалим.',
    },
    areas: ['Ein Kerem', 'Talpiot', 'Katamon', 'German Colony', 'Beit HaKerem', 'Rehavia', 'Givat Ram', 'Malha'],
    areasHe: ['עין כרם', 'תלפיות', 'קטמון', 'המושבה הגרמנית', 'בית הכרם', 'רחביה', 'גבעת רם', 'מלחה'],
    projectsCount: '120+',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108139.98878458674!2d35.1064679!3d31.7683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502d7d634c1fc4b%3A0xd96f623e456ee1cb!2sJerusalem!5e0!3m2!1sen!2sil!4v1234567890',
    seoKeywords: {
      en: 'glass installation Jerusalem, glazier Jerusalem, shower glass Jerusalem, glass railings Jerusalem, mirror installation Jerusalem',
      he: 'התקנת זכוכית ירושלים, זגג ירושלים, מקלחונים ירושלים, מעקות זכוכית ירושלים, התקנת מראות ירושלים',
    },
    seoMetaDescription: {
      en: 'Glass installation services in Jerusalem - shower enclosures, glass railings, mirrors. Serving Ein Kerem, Talpiot, German Colony. Free measurement. Call now!',
      he: 'שירותי התקנת זכוכית בירושלים - מקלחונים, מעקות זכוכית, מראות. עין כרם, תלפיות, המושבה הגרמנית. מדידה חינם. התקשרו עכשיו!',
      ar: 'خدمات تركيب الزجاج في القدس - حواجز الدش، الدرابزين الزجاجي، المرايا. قياسات مجانية. اتصل الآن!',
      ru: 'Услуги по установке стекла в Иерусалиме - душевые кабины, стеклянные ограждения, зеркала. Бесплатные замеры. Звоните!',
    },
  },
  'tel-aviv': {
    slug: 'tel-aviv',
    name: {
      en: 'Tel Aviv',
      he: 'תל אביב',
      ar: 'تل أبيب',
      ru: 'Тель-Авив',
    },
    heroTitle: {
      en: 'Glass Installation in Tel Aviv',
      he: 'התקנת זכוכית בתל אביב',
      ar: 'تركيب الزجاج في تل أبيب',
      ru: 'Установка стекла в Тель-Авиве',
    },
    heroSubtitle: {
      en: 'Modern glass solutions for Tel Aviv\'s contemporary architecture. Frameless showers, balcony railings, and commercial glass.',
      he: 'פתרונות זכוכית מודרניים לאדריכלות העכשווית של תל אביב. מקלחונים ללא מסגרת, מעקות מרפסת וזכוכית מסחרית.',
      ar: 'حلول زجاج حديثة للهندسة المعمارية المعاصرة في تل أبيب.',
      ru: 'Современные стеклянные решения для современной архитектуры Тель-Авива.',
    },
    description: {
      en: 'Tel Aviv\'s modern architecture demands sleek, contemporary glass installations. Our team specializes in frameless shower enclosures, minimalist glass railings, and large-format glass walls that complement the city\'s design aesthetic. We serve all Tel Aviv neighborhoods including Florentin, Neve Tzedek, Rothschild Boulevard, Ramat Aviv, and the Central Bus Station area.',
      he: 'האדריכלות המודרנית של תל אביב דורשת התקנות זכוכית אלגנטיות ועכשוויות. הצוות שלנו מתמחה במקלחונים ללא מסגרת, מעקות זכוכית מינימליסטיים וקירות זכוכית בפורמט גדול שמשלימים את האסתטיקה העיצובית של העיר.',
      ar: 'تتطلب الهندسة المعمارية الحديثة في تل أبيب تركيبات زجاج أنيقة ومعاصرة.',
      ru: 'Современная архитектура Тель-Авива требует элегантных современных стеклянных конструкций.',
    },
    areas: ['Florentin', 'Neve Tzedek', 'Rothschild', 'Ramat Aviv', 'Jaffa', 'North Tel Aviv', 'Sarona', 'HaYarkon'],
    areasHe: ['פלורנטין', 'נווה צדק', 'רוטשילד', 'רמת אביב', 'יפו', 'צפון תל אביב', 'שרונה', 'הירקון'],
    projectsCount: '180+',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108166.73095994286!2d34.7515202!3d32.0852999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4ca6193b7c1f%3A0xc1fb72a2c0963f90!2sTel%20Aviv-Yafo!5e0!3m2!1sen!2sil!4v1234567890',
    seoKeywords: {
      en: 'glass installation Tel Aviv, glazier Tel Aviv, shower glass Tel Aviv, glass railings Tel Aviv, frameless shower Tel Aviv',
      he: 'התקנת זכוכית תל אביב, זגג תל אביב, מקלחונים תל אביב, מעקות זכוכית תל אביב, מקלחון ללא מסגרת תל אביב',
    },
    seoMetaDescription: {
      en: 'Glass installation services in Tel Aviv - frameless showers, glass railings, mirrors. Serving Florentin, Neve Tzedek, Ramat Aviv. Free measurement. Call now!',
      he: 'שירותי התקנת זכוכית בתל אביב - מקלחונים ללא מסגרת, מעקות זכוכית, מראות. פלורנטין, נווה צדק, רמת אביב. מדידה חינם!',
      ar: 'خدمات تركيب الزجاج في تل أبيب - دش بدون إطار، درابزين زجاجي، مرايا. قياسات مجانية. اتصل الآن!',
      ru: 'Установка стекла в Тель-Авиве - безрамные душевые, стеклянные ограждения, зеркала. Бесплатные замеры. Звоните!',
    },
  },
  haifa: {
    slug: 'haifa',
    name: {
      en: 'Haifa',
      he: 'חיפה',
      ar: 'حيفا',
      ru: 'Хайфа',
    },
    heroTitle: {
      en: 'Glass Installation in Haifa',
      he: 'התקנת זכוכית בחיפה',
      ar: 'تركيب الزجاج في حيفا',
      ru: 'Установка стекла в Хайфе',
    },
    heroSubtitle: {
      en: 'Expert glass installation for Haifa and the Carmel region. Sea-resistant glass solutions for coastal properties.',
      he: 'התקנת זכוכית מומחית לחיפה ואזור הכרמל. פתרונות זכוכית עמידים בים לנכסים חופיים.',
      ar: 'تركيب زجاج خبير لحيفا ومنطقة الكرمل.',
      ru: 'Экспертная установка стекла для Хайфы и региона Кармель.',
    },
    description: {
      en: 'Haifa\'s coastal location requires specialized glass solutions that withstand salt air and humidity. Our team uses marine-grade hardware and sealants to ensure lasting performance. We serve the entire Haifa metropolitan area including Carmel, Hadar, Neve Sha\'anan, Bat Galim, and extending to Krayot.',
      he: 'המיקום החופי של חיפה דורש פתרונות זכוכית מיוחדים שעמידים באוויר מלוח ולחות. הצוות שלנו משתמש בחומרי חומרה ואיטום ימיים כדי להבטיח ביצועים ארוכי טווח.',
      ar: 'يتطلب موقع حيفا الساحلي حلول زجاج متخصصة تتحمل الهواء المالح والرطوبة.',
      ru: 'Прибрежное расположение Хайфы требует специализированных стеклянных решений.',
    },
    areas: ['Carmel', 'Hadar', 'Neve Sha\'anan', 'Bat Galim', 'Kiryat Eliezer', 'Krayot', 'Nesher', 'Tirat Carmel'],
    areasHe: ['הכרמל', 'הדר', 'נווה שאנן', 'בת גלים', 'קרית אליעזר', 'קריות', 'נשר', 'טירת כרמל'],
    projectsCount: '95+',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108164.55095994286!2d34.9515202!3d32.7940463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151dba3c8410ae17%3A0x80ade1d39e3c7e38!2sHaifa!5e0!3m2!1sen!2sil!4v1234567890',
    seoKeywords: {
      en: 'glass installation Haifa, glazier Haifa, shower glass Haifa, glass railings Haifa, coastal glass installation',
      he: 'התקנת זכוכית חיפה, זגג חיפה, מקלחונים חיפה, מעקות זכוכית חיפה',
    },
    seoMetaDescription: {
      en: 'Glass installation services in Haifa - sea-resistant showers, glass railings, mirrors. Serving Carmel, Hadar, Krayot. Free measurement. Call now!',
      he: 'שירותי התקנת זכוכית בחיפה - מקלחונים עמידים בים, מעקות זכוכית, מראות. הכרמל, הדר, קריות. מדידה חינם!',
      ar: 'خدمات تركيب الزجاج في حيفا - دش مقاوم للملح، درابزين زجاجي، مرايا. قياسات مجانية. اتصل الآن!',
      ru: 'Установка стекла в Хайфе - морестойкие душевые, стеклянные ограждения, зеркала. Бесплатные замеры. Звоните!',
    },
  },
  'beer-sheva': {
    slug: 'beer-sheva',
    name: {
      en: 'Beer Sheva',
      he: 'באר שבע',
      ar: 'بئر السبع',
      ru: 'Беэр-Шева',
    },
    heroTitle: {
      en: 'Glass Installation in Beer Sheva',
      he: 'התקנת זכוכית בבאר שבע',
      ar: 'تركيب الزجاج في بئر السبع',
      ru: 'Установка стекла в Беэр-Шеве',
    },
    heroSubtitle: {
      en: 'Professional glass services for Beer Sheva and the Negev region. Heat-resistant solutions for desert climate.',
      he: 'שירותי זכוכית מקצועיים לבאר שבע ואזור הנגב. פתרונות עמידים בחום לאקלים מדברי.',
      ar: 'خدمات زجاج احترافية لبئر السبع ومنطقة النقب.',
      ru: 'Профессиональные услуги по установке стекла для Беэр-Шевы и региона Негев.',
    },
    description: {
      en: 'Beer Sheva and the Negev region present unique challenges with extreme temperatures. Our glass installations are designed to handle thermal stress while maintaining beauty and functionality. We serve all Beer Sheva neighborhoods and surrounding communities including Omer, Meitar, and Dimona.',
      he: 'באר שבע ואזור הנגב מציבים אתגרים ייחודיים עם טמפרטורות קיצוניות. התקנות הזכוכית שלנו מתוכננות להתמודד עם עומס תרמי תוך שמירה על יופי ופונקציונליות.',
      ar: 'تقدم بئر السبع ومنطقة النقب تحديات فريدة مع درجات الحرارة القصوى.',
      ru: 'Беэр-Шева и регион Негев представляют уникальные проблемы с экстремальными температурами.',
    },
    areas: ['Old City', 'Ramot', 'Neve Noy', 'Neve Ze\'ev', 'Omer', 'Meitar', 'Dimona', 'Arad'],
    areasHe: ['העיר העתיקה', 'רמות', 'נווה נוי', 'נווה זאב', 'עומר', 'מיתר', 'דימונה', 'ערד'],
    projectsCount: '65+',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108164.55095994286!2d34.7913134!3d31.2529619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502650089c56de3%3A0x8c7a68eef75cbc91!2sBe%27er%20Sheva!5e0!3m2!1sen!2sil!4v1234567890',
    seoKeywords: {
      en: 'glass installation Beer Sheva, glazier Beer Sheva, shower glass Beer Sheva, glass railings Negev',
      he: 'התקנת זכוכית באר שבע, זגג באר שבע, מקלחונים באר שבע, מעקות זכוכית נגב',
    },
    seoMetaDescription: {
      en: 'Glass installation services in Beer Sheva - heat-resistant showers, glass railings, mirrors. Serving Omer, Meitar, Dimona. Free measurement. Call now!',
      he: 'שירותי התקנת זכוכית בבאר שבע - מקלחונים עמידים בחום, מעקות זכוכית, מראות. עומר, מיתר, דימונה. מדידה חינם!',
      ar: 'خدمات تركيب الزجاج في بئر السبع - دش مقاوم للحرارة، درابزين زجاجي، مرايا. قياسات مجانية. اتصل الآن!',
      ru: 'Установка стекла в Беэр-Шеве - термостойкие душевые, стеклянные ограждения, зеркала. Бесплатные замеры. Звоните!',
    },
  },
};

type LocationKey = keyof typeof LOCATIONS;

const COMMON_CONTENT = {
  servicesTitle: {
    en: 'Our Services in',
    he: 'השירותים שלנו ב',
    ar: 'خدماتنا في',
    ru: 'Наши услуги в',
  },
  areasTitle: {
    en: 'Areas We Serve',
    he: 'אזורים שאנו משרתים',
    ar: 'المناطق التي نخدمها',
    ru: 'Районы обслуживания',
  },
  whyChoose: {
    en: 'Why Choose Shwaki Brothers in',
    he: 'למה לבחור באחים שוואקי ב',
    ar: 'لماذا تختار شويكي إخوان في',
    ru: 'Почему выбирают Братьев Шваки в',
  },
  ctaTitle: {
    en: 'Ready for a Free Quote?',
    he: 'מוכנים להצעת מחיר חינם?',
    ar: 'مستعد لعرض سعر مجاني؟',
    ru: 'Готовы к бесплатной оценке?',
  },
  ctaSubtitle: {
    en: 'Get in touch today for professional glass installation in',
    he: 'צרו קשר היום להתקנת זכוכית מקצועית ב',
    ar: 'تواصل معنا اليوم لتركيب زجاج احترافي في',
    ru: 'Свяжитесь с нами сегодня для профессиональной установки стекла в',
  },
  projectsCompleted: {
    en: 'Projects Completed',
    he: 'פרויקטים שהושלמו',
    ar: 'مشروع مكتمل',
    ru: 'Выполненных проектов',
  },
  freeQuote: {
    en: 'Free Quote',
    he: 'הצעת מחיר חינם',
    ar: 'عرض سعر مجاني',
    ru: 'Бесплатная оценка',
  },
  benefits: [
    {
      title: {
        en: 'Local Expertise',
        he: 'מומחיות מקומית',
        ar: 'خبرة محلية',
        ru: 'Местный опыт',
      },
      description: {
        en: 'We know the local architecture, building codes, and preferences',
        he: 'אנו מכירים את האדריכלות המקומית, תקנות הבנייה וההעדפות',
        ar: 'نعرف الهندسة المعمارية المحلية وقوانين البناء والتفضيلات',
        ru: 'Мы знаем местную архитектуру, строительные нормы и предпочтения',
      },
    },
    {
      title: {
        en: 'Fast Response',
        he: 'תגובה מהירה',
        ar: 'استجابة سريعة',
        ru: 'Быстрый ответ',
      },
      description: {
        en: 'Same-day or next-day measurement appointments available',
        he: 'תורי מדידה באותו יום או ביום שלמחרת',
        ar: 'مواعيد قياس متاحة في نفس اليوم أو اليوم التالي',
        ru: 'Возможна запись на замер в тот же или на следующий день',
      },
    },
    {
      title: {
        en: 'Proven Track Record',
        he: 'רקורד מוכח',
        ar: 'سجل حافل',
        ru: 'Проверенный опыт',
      },
      description: {
        en: 'Hundreds of satisfied customers in the area',
        he: 'מאות לקוחות מרוצים באזור',
        ar: 'مئات العملاء الراضين في المنطقة',
        ru: 'Сотни довольных клиентов в районе',
      },
    },
  ],
};

const LocationPage: React.FC = () => {
  const { location: locationParam, lang } = useParams<{ location: string; lang: string }>();
  const { currentLanguage } = useLanguage();
  const routeLocation = useLocation();
  const locale = (lang || currentLanguage) as SupportedLocale;
  
  // Extract location from either /location/:location or direct /:lang/city patterns
  const locationSlug = useMemo(() => {
    if (locationParam) return locationParam;
    
    // Extract from path like /he/jerusalem
    const pathParts = routeLocation.pathname.split('/').filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    
    // Check if last part is a valid location
    if (lastPart && LOCATIONS[lastPart as LocationKey]) {
      return lastPart;
    }
    return null;
  }, [locationParam, routeLocation.pathname]);
  
  // Get location data
  const locationData = locationSlug ? LOCATIONS[locationSlug as LocationKey] : null;
  
  // If location not found, redirect to home
  if (!locationData) {
    return <Navigate to={`/${locale}`} replace />;
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      locale === 'he' 
        ? `שלום, אני מעוניין בשירותי זכוכית ב${getLocalizedText(locationData.name, locale)}` 
        : `Hello, I'm interested in glass services in ${getLocalizedText(locationData.name, locale)}`
    );
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${CONTACT_INFO.phoneIntl}`;
  };

  return (
    <>
      <SEOHead 
        title={`${getLocalizedText(locationData.heroTitle, locale)} | ${locale === 'he' ? 'אחים שוואקי זכוכית' : 'Shwaki Brothers'}`}
        description={getLocalizedText(locationData.seoMetaDescription, locale)}
        keywords={locationData.seoKeywords[locale === 'he' || locale === 'ar' ? 'he' : 'en']}
      />
      
      {/* Location-specific JSON-LD Schema */}
      <LocationJsonLd 
        city={locationSlug as string} 
        cityName={getLocalizedText(locationData.name, locale)} 
      />

      {/* Hero Section */}
      <AnimatedPageHeader>
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-brand-gold">
            {getLocalizedText(locationData.heroTitle, locale)}
          </h1>
          <p className="text-lg sm:text-xl text-white/80">
            {getLocalizedText(locationData.heroSubtitle, locale)}
          </p>
        </div>
      </AnimatedPageHeader>

      <div className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 sm:px-6">
          <Breadcrumbs 
            items={[
              { label: getLocalizedText(locationData.name, locale) }
            ]}
          />
        </div>

        {/* Stats Bar */}
        <section className="bg-brand-navy py-6">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-gold">{locationData.projectsCount}</div>
                <div className="text-sm text-white/70">
                  {getLocalizedText(COMMON_CONTENT.projectsCompleted, locale)} {getLocalizedText(locationData.name, locale)}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-3xl font-bold text-brand-gold">
                  4.9 <Star className="w-6 h-6 fill-brand-gold" />
                </div>
                <div className="text-sm text-white/70">Google Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-gold">15+</div>
                <div className="text-sm text-white/70">{locale === 'he' ? 'שנות ניסיון' : 'Years Experience'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {getLocalizedText(locationData.description, locale)}
                  </p>
                </motion.div>

                {/* Services */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-bold text-brand-navy mb-6">
                    {getLocalizedText(COMMON_CONTENT.servicesTitle, locale)} {getLocalizedText(locationData.name, locale)}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {SERVICES.slice(0, 6).map((service) => (
                      <Link
                        key={service.id}
                        to={`/${locale}/services`}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-brand-gold/10 transition-colors group"
                      >
                        <span className="text-2xl">{service.icon}</span>
                        <span className="font-medium text-gray-800 group-hover:text-brand-navy">
                          {getLocalizedText(service.title, locale)}
                        </span>
                        <ArrowRight className="w-4 h-4 ms-auto text-gray-400 group-hover:text-brand-gold" />
                      </Link>
                    ))}
                  </div>
                </motion.div>

                {/* Areas Served */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-bold text-brand-navy mb-6">
                    {getLocalizedText(COMMON_CONTENT.areasTitle, locale)}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {(locale === 'he' ? locationData.areasHe : locationData.areas).map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy/5 text-brand-navy rounded-full text-sm"
                      >
                        <MapPin className="w-3 h-3" />
                        {area}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Why Choose Us */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-bold text-brand-navy mb-6">
                    {getLocalizedText(COMMON_CONTENT.whyChoose, locale)} {getLocalizedText(locationData.name, locale)}
                  </h2>
                  <div className="space-y-4">
                    {COMMON_CONTENT.benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-4">
                        <CheckCircle className="w-6 h-6 text-brand-gold flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-brand-navy">
                            {getLocalizedText(benefit.title, locale)}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {getLocalizedText(benefit.description, locale)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Map */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-bold text-brand-navy mb-6">
                    {locale === 'he' ? 'מיקום' : 'Location'}
                  </h2>
                  <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      src={locationData.mapEmbed}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map of ${getLocalizedText(locationData.name, 'en')}`}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* CTA Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-brand-navy text-white rounded-2xl p-6 shadow-xl"
                  >
                    <h3 className="text-xl font-bold mb-2">
                      {getLocalizedText(COMMON_CONTENT.ctaTitle, locale)}
                    </h3>
                    <p className="text-white/70 text-sm mb-6">
                      {getLocalizedText(COMMON_CONTENT.ctaSubtitle, locale)} {getLocalizedText(locationData.name, locale)}
                    </p>
                    
                    <div className="space-y-3">
                      <button
                        onClick={handleWhatsApp}
                        className="w-full flex items-center justify-center gap-2 bg-brand-gold text-brand-navy font-semibold py-3 rounded-full hover:bg-brand-gold/90 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        {getLocalizedText(UI_STRINGS.whatsapp, locale)}
                      </button>
                      <button
                        onClick={handleCall}
                        className="w-full flex items-center justify-center gap-2 bg-white/10 text-white font-medium py-3 rounded-full hover:bg-white/20 transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                        {CONTACT_INFO.phone}
                      </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/20">
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <Clock className="w-4 h-4" />
                        <span>{locale === 'he' ? 'מענה תוך שעתיים' : 'Response within 2 hours'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 mt-2">
                        <Shield className="w-4 h-4" />
                        <span>{locale === 'he' ? 'ללא התחייבות' : 'No obligation'}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Trust Badges */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-50 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-brand-gold" />
                      <span className="font-semibold text-brand-navy">
                        {locale === 'he' ? 'אחריות מלאה' : 'Full Warranty'}
                      </span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {locale === 'he' ? 'אחריות שנתיים על עבודה' : '2-year workmanship warranty'}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {locale === 'he' ? 'מורשה ומבוטח' : 'Licensed & insured'}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {locale === 'he' ? 'מדידה חינם' : 'Free measurement'}
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Google Reviews */}
        <GoogleReviews locale={locale} limit={3} />

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-br from-brand-navy to-brand-navy/95 text-white">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-brand-gold">
              {locale === 'he' 
                ? `מחפשים זגג מקצועי ב${getLocalizedText(locationData.name, locale)}?`
                : `Looking for a Professional Glazier in ${getLocalizedText(locationData.name, locale)}?`
              }
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              {locale === 'he'
                ? 'צרו קשר היום לקבלת הצעת מחיר חינם. מענה מהיר, ללא התחייבות.'
                : 'Contact us today for a free quote. Fast response, no obligation.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-navy font-semibold px-8 py-4 rounded-full hover:bg-brand-gold/90 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                {getLocalizedText(UI_STRINGS.whatsapp, locale)}
              </button>
              <Link
                to={`/${locale}/contact`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-medium px-8 py-4 rounded-full hover:bg-white/20 transition-colors"
              >
                {getLocalizedText(UI_STRINGS.ctaContactUs, locale)}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LocationPage;

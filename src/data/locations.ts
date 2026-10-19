/**
 * Location landing page content (/[lang]/jerusalem, /[lang]/tel-aviv …).
 * Server-safe: used by the route, sitemap, JSON-LD and the site search index.
 */

// Location data with comprehensive content
export const LOCATIONS = {
  jerusalem: {
    slug: 'jerusalem',
    name: { en: 'Jerusalem', he: 'ירושלים', ar: 'القدس', ru: 'Иерусалим' },
    heroTitle: {
      en: 'Showers and Glass Railings in Jerusalem',
      he: 'מקלחונים ומעקות זכוכית בירושלים',
      ar: 'حواجز الدش والدرابزين الزجاجي في القدس',
      ru: 'Душевые кабины и стеклянные ограждения в Иерусалиме',
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
  },
  'tel-aviv': {
    slug: 'tel-aviv',
    name: { en: 'Tel Aviv', he: 'תל אביב', ar: 'تل أبيب', ru: 'Тель-Авив' },
    heroTitle: {
      en: 'Showers and Glass Railings in Tel Aviv',
      he: 'מקלחונים ומעקות זכוכית בתל אביב',
      ar: 'حواجز الدش والدرابزين الزجاجي في تل أبيب',
      ru: 'Душевые кабины и стеклянные ограждения в Тель-Авиве',
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
  },
  haifa: {
    slug: 'haifa',
    name: { en: 'Haifa', he: 'חיפה', ar: 'حيفا', ru: 'Хайфа' },
    heroTitle: {
      en: 'Showers and Glass Railings in Haifa',
      he: 'מקלחונים ומעקות זכוכית בחיפה',
      ar: 'حواجز الدش والدرابزين الزجاجي في حيفا',
      ru: 'Душевые кабины и стеклянные ограждения в Хайфе',
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
  },
  'beer-sheva': {
    slug: 'beer-sheva',
    name: { en: 'Beer Sheva', he: 'באר שבע', ar: 'بئر السبع', ru: 'Беэр-Шева' },
    heroTitle: {
      en: 'Showers and Glass Railings in Beer Sheva',
      he: 'מקלחונים ומעקות זכוכית בבאר שבע',
      ar: 'حواجز الدش والدرابزين الزجاجي في بئر السبع',
      ru: 'Душевые кабины и стеклянные ограждения в Беэр-Шеве',
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
  },
  netanya: {
    slug: 'netanya',
    name: { en: 'Netanya', he: 'נתניה', ar: 'نتانيا', ru: 'Нетания' },
    heroTitle: {
      en: 'Showers and Glass Railings in Netanya',
      he: 'מקלחונים ומעקות זכוכית בנתניה',
      ar: 'حواجز الدش والدرابزين الزجاجي في نتانيا',
      ru: 'Душевые кабины и стеклянные ограждения в Нетании',
    },
    heroSubtitle: {
      en: 'Expert glass installation for Netanya and the Sharon region. Premium shower enclosures, glass railings, and mirrors.',
      he: 'התקנת זכוכית מומחית לנתניה ואזור השרון. מקלחוני פרימיום, מעקות זכוכית ומראות.',
      ar: 'تركيب زجاج خبير لنتانيا ومنطقة الشارون.',
      ru: 'Экспертная установка стекла для Нетании и региона Шарон.',
    },
    description: {
      en: 'Serving Netanya and the Sharon region with premium glass installations. Whether you are renovating an apartment overlooking the sea or upgrading a private home in the surrounding areas, our custom glass solutions combine elegant design with durability against coastal humidity.',
      he: 'משרתים את נתניה ואזור השרון עם התקנות זכוכית פרימיום. בין אם אתם משפצים דירה הצופה לים או משדרגים בית פרטי באזורים הסמוכים, פתרונות הזכוכית המותאמים אישית שלנו משלבים עיצוב אלגנטי עם עמידות בפני הלחות מהחוף.',
      ar: 'نخدم نتانيا ومنطقة الشارون بتركيبات زجاج فاخرة.',
      ru: 'Обслуживаем Нетанию и регион Шарон премиальными установками стекла.',
    },
    areas: ['Poleg', 'Ir Yamim', 'Kiryat Hasharon', 'Dora', 'Ramat Poleg', 'Even Yehuda', 'Kadima'],
    areasHe: ['פולג', 'עיר ימים', 'קרית השרון', 'דורה', 'רמת פולג', 'אבן יהודה', 'קדימה'],
    projectsCount: '75+',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107877.925232924!2d34.8519!3d32.3215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d3e8ed5b1fbad%3A0xc3c940bd0fcf6002!2sNetanya!5e0!3m2!1sen!2sil!4v1234567890',
  },
};

export type LocationKey = keyof typeof LOCATIONS;

export const LOCATION_COMMON_CONTENT = {
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

export const LOCATION_SLUGS = Object.keys(LOCATIONS) as LocationKey[];

export function getLocation(slug: string) {
  return (LOCATIONS as Record<string, (typeof LOCATIONS)[LocationKey]>)[slug] ?? null;
}

export function hasLocationPage(slug: string): slug is LocationKey {
  return Object.prototype.hasOwnProperty.call(LOCATIONS, slug);
}

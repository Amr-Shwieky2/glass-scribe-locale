/**
 * Shwaki Brothers Glassworks - Static Business Data
 * 
 * All text content is hardcoded here to ensure consistency and reliability.
 * Only project images and categories are managed through the backend.
 */

// =============================================================================
// BUSINESS INFORMATION
// =============================================================================

export const BUSINESS_INFO = {
  name: {
    en: 'Shwaki Brothers Glassworks',
    he: 'אחים שווקי עבודות זכוכית',
    ar: 'إخوة شواقي للزجاج',
  },
  owner: 'Mohammad Shwaki',
  tagline: {
    en: 'Premium Glass Solutions for Every Space',
    he: 'פתרונות זכוכית פרימיום לכל מרחב',
    ar: 'حلول زجاجية متميزة لكل مساحة',
  },
  description: {
    en: 'Professional glass installation and custom glass works serving all of Israel. We transform spaces with elegant, high-quality glass solutions.',
    he: 'התקנת זכוכית מקצועית ועבודות זכוכית מותאמות אישית בכל רחבי ישראל. אנו משנים מרחבים עם פתרונות זכוכית אלגנטיים ואיכותיים.',
    ar: 'تركيب زجاج احترافي وأعمال زجاجية مخصصة في جميع أنحاء إسرائيل. نحول المساحات بحلول زجاجية أنيقة وعالية الجودة.',
  },
  location: {
    en: 'Jerusalem, Israel',
    he: 'ירושלים, ישראל',
    ar: 'القدس، إسرائيل',
  },
  serviceArea: {
    en: 'Serving all of Israel',
    he: 'משרתים את כל ישראל',
    ar: 'نخدم جميع أنحاء إسرائيل',
  },
  established: '2015',
} as const;

// =============================================================================
// CONTACT INFORMATION
// =============================================================================

export const CONTACT_INFO = {
  phone: {
    mobile: '+972-58-502-2264',
    office: '+972-58-741-8292',
  },
  email: 'info@shwakiglassworks.com',
  whatsapp: '+972585022264',
  workingHours: {
    en: 'Sunday - Thursday: 8:00 AM - 6:00 PM | Friday: 8:00 AM - 2:00 PM',
    he: 'ראשון - חמישי: 8:00 - 18:00 | שישי: 8:00 - 14:00',
    ar: 'الأحد - الخميس: 8:00 صباحاً - 6:00 مساءً | الجمعة: 8:00 صباحاً - 2:00 مساءً',
  },
  responseTime: {
    en: 'We typically respond within 24 hours',
    he: 'אנו בדרך כלל מגיבים תוך 24 שעות',
    ar: 'عادة ما نرد خلال 24 ساعة',
  },
} as const;

// =============================================================================
// SERVICES
// =============================================================================

export interface ServiceData {
  id: string;
  icon: string;
  image?: string; // Optional service image path
  title: { en: string; he: string; ar: string };
  description: { en: string; he: string; ar: string };
  features: { en: string[]; he: string[]; ar: string[] };
}

export const SERVICES: ServiceData[] = [
  {
    id: 'shower-glass',
    icon: '🚿',
    image: '/services/shower-glass.jpg',
    title: {
      en: 'Shower Glass',
      he: 'זכוכית למקלחות',
      ar: 'زجاج الدش',
    },
    description: {
      en: 'Transform your bathroom with our premium frameless shower enclosures. Custom-designed to fit any space with elegant, durable glass solutions.',
      he: 'שנו את חדר האמבטיה שלכם עם מארזי המקלחת הפרימיום ללא מסגרת שלנו. מעוצבים בהתאמה אישית לכל מרחב עם פתרונות זכוכית אלגנטיים ועמידים.',
      ar: 'حوّل حمامك مع حاويات الدش الزجاجية الفاخرة بدون إطار. مصممة خصيصاً لتناسب أي مساحة بحلول زجاجية أنيقة ومتينة.',
    },
    features: {
      en: ['Frameless designs', 'Custom measurements', 'Safety tempered glass', 'Easy-clean coating'],
      he: ['עיצובים ללא מסגרת', 'מידות מותאמות אישית', 'זכוכית מחוסמת בטיחותית', 'ציפוי קל לניקוי'],
      ar: ['تصاميم بدون إطار', 'قياسات مخصصة', 'زجاج مقسى آمن', 'طلاء سهل التنظيف'],
    },
  },
  {
    id: 'glass-railings',
    icon: '🏗️',
    image: '/services/glass-railings.jpg',
    title: {
      en: 'Glass Railings',
      he: 'מעקות זכוכית',
      ar: 'درابزين زجاجي',
    },
    description: {
      en: 'Modern glass railings that combine safety with stunning aesthetics. Perfect for balconies, staircases, and terraces.',
      he: 'מעקות זכוכית מודרניים המשלבים בטיחות עם אסתטיקה מרהיבה. מושלמים למרפסות, מדרגות וטרסות.',
      ar: 'درابزين زجاجي حديث يجمع بين السلامة والجماليات المذهلة. مثالي للشرفات والسلالم والتراسات.',
    },
    features: {
      en: ['Structural glass panels', 'Stainless steel hardware', 'Code compliant', 'Unobstructed views'],
      he: ['לוחות זכוכית מבניים', 'אביזרי נירוסטה', 'עומדים בתקנים', 'נוף ללא הפרעה'],
      ar: ['ألواح زجاجية هيكلية', 'أجهزة من الفولاذ المقاوم للصدأ', 'متوافق مع المعايير', 'مناظر غير معرقلة'],
    },
  },
  {
    id: 'mirrors',
    icon: '🪞',
    image: '/services/mirrors.jpg',
    title: {
      en: 'Mirrors',
      he: 'מראות',
      ar: 'مرايا',
    },
    description: {
      en: 'Custom mirrors for any application - from decorative wall mirrors to gym mirrors and bathroom vanities.',
      he: 'מראות מותאמות אישית לכל שימוש - ממראות קיר דקורטיביות ועד מראות חדר כושר ומראות אמבטיה.',
      ar: 'مرايا مخصصة لأي تطبيق - من المرايا الجدارية الزخرفية إلى مرايا الصالة الرياضية ومرايا الحمام.',
    },
    features: {
      en: ['Custom sizes', 'Beveled edges', 'LED backlit options', 'Anti-fog technology'],
      he: ['מידות מותאמות', 'קצוות משופעים', 'אפשרויות תאורת LED אחורית', 'טכנולוגיה נגד אדים'],
      ar: ['أحجام مخصصة', 'حواف مشطوفة', 'خيارات إضاءة LED خلفية', 'تقنية مضادة للضباب'],
    },
  },
  {
    id: 'glass-partitions',
    icon: '🏢',
    image: '/services/glass-partitions.jpg',
    title: {
      en: 'Glass Partitions',
      he: 'מחיצות זכוכית',
      ar: 'فواصل زجاجية',
    },
    description: {
      en: 'Create modern, open workspaces with our glass partition systems. Maintain natural light flow while defining separate areas.',
      he: 'צרו מרחבי עבודה מודרניים ופתוחים עם מערכות מחיצות הזכוכית שלנו. שמרו על זרימת אור טבעי תוך הגדרת אזורים נפרדים.',
      ar: 'أنشئ مساحات عمل حديثة ومفتوحة مع أنظمة الفواصل الزجاجية لدينا. حافظ على تدفق الضوء الطبيعي مع تحديد المناطق المنفصلة.',
    },
    features: {
      en: ['Office partitions', 'Soundproof options', 'Sliding systems', 'Frosted glass available'],
      he: ['מחיצות משרד', 'אפשרויות אטימת קול', 'מערכות הזזה', 'זכוכית חלבית זמינה'],
      ar: ['فواصل مكتبية', 'خيارات عازلة للصوت', 'أنظمة منزلقة', 'زجاج مصنفر متاح'],
    },
  },
  {
    id: 'storefront-glass',
    icon: '🏪',
    image: '/services/storefront-glass.jpg',
    title: {
      en: 'Storefront Glass',
      he: 'חזיתות זכוכית',
      ar: 'واجهات زجاجية',
    },
    description: {
      en: 'Professional storefront glass installations for retail spaces, restaurants, and commercial buildings.',
      he: 'התקנות זכוכית חזית מקצועיות לחללים קמעונאיים, מסעדות ומבני מסחר.',
      ar: 'تركيبات زجاج واجهات احترافية للمساحات التجارية والمطاعم والمباني التجارية.',
    },
    features: {
      en: ['Display windows', 'Entrance systems', 'Security glass', 'Energy efficient'],
      he: ['חלונות תצוגה', 'מערכות כניסה', 'זכוכית ביטחון', 'חסכוניות באנרגיה'],
      ar: ['نوافذ العرض', 'أنظمة المدخل', 'زجاج أمني', 'موفر للطاقة'],
    },
  },
  {
    id: 'custom-glass',
    icon: '✨',
    image: '/services/custom-glass.jpg',
    title: {
      en: 'Custom Glass Works',
      he: 'עבודות זכוכית מותאמות',
      ar: 'أعمال زجاجية مخصصة',
    },
    description: {
      en: 'Unique glass solutions tailored to your specific needs. From glass tables to decorative panels, we bring your vision to life.',
      he: 'פתרונות זכוכית ייחודיים המותאמים לצרכים הספציפיים שלכם. משולחנות זכוכית ועד פאנלים דקורטיביים, אנו מגשימים את החזון שלכם.',
      ar: 'حلول زجاجية فريدة مصممة لاحتياجاتك الخاصة. من طاولات الزجاج إلى الألواح الزخرفية، نحقق رؤيتك.',
    },
    features: {
      en: ['Glass tables', 'Decorative panels', 'Splashbacks', 'Custom designs'],
      he: ['שולחנות זכוכית', 'פאנלים דקורטיביים', 'חיפויי קיר', 'עיצובים מותאמים'],
      ar: ['طاولات زجاجية', 'ألواح زخرفية', 'واقيات رذاذ', 'تصاميم مخصصة'],
    },
  },
  {
    id: 'glass-doors',
    icon: '🚪',
    title: {
      en: 'Glass Doors',
      he: 'דלתות זכוכית',
      ar: 'أبواب زجاجية',
    },
    description: {
      en: 'Elegant glass doors for interiors and exteriors. Sliding, pivot, and hinged designs that add a modern touch to any entrance.',
      he: 'דלתות זכוכית אלגנטיות לפנים ולחוץ. עיצובים הזזה, ציר ותלויים המוסיפים נגיעה מודרנית לכל כניסה.',
      ar: 'أبواب زجاجية أنيقة للداخل والخارج. تصاميم منزلقة ومحورية ومفصلية تضيف لمسة عصرية لأي مدخل.',
    },
    features: {
      en: ['Sliding doors', 'Pivot systems', 'Frosted options', 'Smart glass available'],
      he: ['דלתות הזזה', 'מערכות ציר', 'אפשרויות חלבית', 'זכוכית חכמה זמינה'],
      ar: ['أبواب منزلقة', 'أنظمة محورية', 'خيارات مصنفرة', 'زجاج ذكي متاح'],
    },
  },
  {
    id: 'backsplashes',
    icon: '🎨',
    title: {
      en: 'Glass Backsplashes',
      he: 'חיפוי זכוכית למטבח',
      ar: 'واقيات زجاجية للمطبخ',
    },
    description: {
      en: 'Stunning kitchen and bathroom backsplashes in tempered glass. Available in any color, with a seamless easy-to-clean finish.',
      he: 'חיפויי זכוכית מרהיבים למטבחים ואמבטיות. זמינים בכל צבע, עם גימור חלק ונוח לניקוי.',
      ar: 'واقيات زجاجية مذهلة للمطابخ والحمامات. متوفرة بأي لون، مع تشطيب سلس وسهل التنظيف.',
    },
    features: {
      en: ['Any RAL color', 'Tempered safety glass', 'Seamless design', 'Heat resistant'],
      he: ['כל צבע RAL', 'זכוכית מחוסמת בטיחותית', 'עיצוב חלק', 'עמיד בחום'],
      ar: ['أي لون RAL', 'زجاج مقسى آمن', 'تصميم سلس', 'مقاوم للحرارة'],
    },
  },
  {
    id: 'shelves',
    icon: '📐',
    title: {
      en: 'Glass Shelves',
      he: 'מדפי זכוכית',
      ar: 'رفوف زجاجية',
    },
    description: {
      en: 'Custom glass shelving for retail displays, bathrooms, and living spaces. Clean, modern look with strong tempered glass.',
      he: 'מדפי זכוכית מותאמים אישית לתצוגות חנויות, אמבטיות ומרחבי מגורים. מראה נקי ומודרני עם זכוכית מחוסמת חזקה.',
      ar: 'أرفف زجاجية مخصصة لعروض المتاجر والحمامات والمساحات المعيشية. مظهر نظيف وعصري مع زجاج مقسى قوي.',
    },
    features: {
      en: ['Custom sizes', 'Floating mounts', 'LED lighting options', 'Heavy-duty brackets'],
      he: ['מידות מותאמות', 'תליה צפה', 'אפשרויות תאורת LED', 'תושבות כבדות'],
      ar: ['أحجام مخصصة', 'تثبيت عائم', 'خيارات إضاءة LED', 'أقواس شديدة التحمل'],
    },
  },
  {
    id: 'lobbies',
    icon: '🏛️',
    title: {
      en: 'Lobby Glass',
      he: 'זכוכית ללובי',
      ar: 'زجاج اللوبي',
    },
    description: {
      en: 'Grand glass features for building lobbies and reception areas. Create an impressive first impression with our premium installations.',
      he: 'אלמנטי זכוכית מרשימים ללובי בניינים ואזורי קבלה. צרו רושם ראשוני מרשים עם ההתקנות הפרימיום שלנו.',
      ar: 'ميزات زجاجية فخمة لردهات المباني ومناطق الاستقبال. اخلق انطباعاً أولياً مميزاً مع تركيباتنا الفاخرة.',
    },
    features: {
      en: ['Feature walls', 'Reception screens', 'Decorative panels', 'Lobby partitions'],
      he: ['קירות ייחודיים', 'מסכי קבלה', 'פאנלים דקורטיביים', 'מחיצות לובי'],
      ar: ['جدران مميزة', 'شاشات استقبال', 'ألواح زخرفية', 'فواصل اللوبي'],
    },
  },
];

// =============================================================================
// TESTIMONIALS
// =============================================================================

export interface TestimonialData {
  id: string;
  name: string;
  location: { en: string; he: string; ar: string };
  rating: number;
  text: { en: string; he: string; ar: string };
  project: { en: string; he: string; ar: string };
}

export const TESTIMONIALS: TestimonialData[] = [
  {
    id: '1',
    name: 'David Cohen',
    location: {
      en: 'Tel Aviv',
      he: 'תל אביב',
      ar: 'تل أبيب',
    },
    rating: 5,
    text: {
      en: 'Exceptional quality and professionalism. The shower enclosure they installed transformed our bathroom completely. Highly recommended!',
      he: 'איכות ומקצועיות יוצאי דופן. מארז המקלחת שהתקינו שינה את חדר האמבטיה שלנו לחלוטין. ממליץ בחום!',
      ar: 'جودة واحترافية استثنائية. حاوية الدش التي قاموا بتركيبها حولت حمامنا بالكامل. موصى به بشدة!',
    },
    project: {
      en: 'Frameless Shower Installation',
      he: 'התקנת מקלחון ללא מסגרת',
      ar: 'تركيب دش بدون إطار',
    },
  },
  {
    id: '2',
    name: 'Sarah Levy',
    location: {
      en: 'Jerusalem',
      he: 'ירושלים',
      ar: 'القدس',
    },
    rating: 5,
    text: {
      en: 'The glass railing on our balcony is absolutely stunning. Great attention to detail and the team was very professional throughout the process.',
      he: 'מעקה הזכוכית במרפסת שלנו פשוט מדהים. תשומת לב רבה לפרטים והצוות היה מקצועי מאוד לאורך כל התהליך.',
      ar: 'الدرابزين الزجاجي على شرفتنا مذهل تماماً. اهتمام كبير بالتفاصيل وكان الفريق محترفاً للغاية طوال العملية.',
    },
    project: {
      en: 'Balcony Glass Railing',
      he: 'מעקה זכוכית למרפסת',
      ar: 'درابزين زجاجي للشرفة',
    },
  },
  {
    id: '3',
    name: 'Ahmed Hassan',
    location: {
      en: 'Haifa',
      he: 'חיפה',
      ar: 'حيفا',
    },
    rating: 5,
    text: {
      en: 'They did an amazing job with our office glass partitions. The space looks modern and the team was respectful of our work schedule.',
      he: 'הם עשו עבודה מדהימה עם מחיצות הזכוכית במשרד שלנו. המרחב נראה מודרני והצוות כיבד את לוח הזמנים שלנו.',
      ar: 'قاموا بعمل رائع مع الفواصل الزجاجية في مكتبنا. تبدو المساحة حديثة وكان الفريق يحترم جدول عملنا.',
    },
    project: {
      en: 'Office Glass Partitions',
      he: 'מחיצות זכוכית למשרד',
      ar: 'فواصل زجاجية للمكتب',
    },
  },
  {
    id: '4',
    name: 'Rachel Ben-David',
    location: {
      en: 'Ramat Gan',
      he: 'רמת גן',
      ar: 'رمات غان',
    },
    rating: 5,
    text: {
      en: 'From measurement to installation, everything was seamless. The custom mirror they made for our living room is exactly what we envisioned.',
      he: 'מהמדידה ועד ההתקנה, הכל היה חלק. המראה המותאמת שהכינו לסלון שלנו היא בדיוק מה שדמיינו.',
      ar: 'من القياس إلى التثبيت، كل شيء كان سلساً. المرآة المخصصة التي صنعوها لغرفة المعيشة هي بالضبط ما تصورناه.',
    },
    project: {
      en: 'Custom Wall Mirror',
      he: 'מראה קיר מותאמת',
      ar: 'مرآة حائط مخصصة',
    },
  },
];

// =============================================================================
// WHY CHOOSE US
// =============================================================================

export interface WhyChooseUsItem {
  icon: string;
  title: { en: string; he: string; ar: string };
  description: { en: string; he: string; ar: string };
}

export const WHY_CHOOSE_US: WhyChooseUsItem[] = [
  {
    icon: '🏆',
    title: {
      en: 'Expert Craftsmanship',
      he: 'מלאכת יד מומחית',
      ar: 'حرفية خبيرة',
    },
    description: {
      en: 'Years of experience in premium glass installations',
      he: 'שנים של ניסיון בהתקנות זכוכית פרימיום',
      ar: 'سنوات من الخبرة في تركيبات الزجاج الفاخرة',
    },
  },
  {
    icon: '🎯',
    title: {
      en: 'Custom Solutions',
      he: 'פתרונות מותאמים',
      ar: 'حلول مخصصة',
    },
    description: {
      en: 'Every project tailored to your exact specifications',
      he: 'כל פרויקט מותאם למפרט המדויק שלכם',
      ar: 'كل مشروع مصمم وفقاً لمواصفاتك الدقيقة',
    },
  },
  {
    icon: '⚡',
    title: {
      en: 'Fast & Reliable',
      he: 'מהיר ואמין',
      ar: 'سريع وموثوق',
    },
    description: {
      en: 'On-time delivery and professional installation',
      he: 'אספקה בזמן והתקנה מקצועית',
      ar: 'تسليم في الوقت المحدد وتثبيت احترافي',
    },
  },
  {
    icon: '💎',
    title: {
      en: 'Premium Materials',
      he: 'חומרים פרימיום',
      ar: 'مواد متميزة',
    },
    description: {
      en: 'Only the highest quality glass and hardware',
      he: 'רק זכוכית ואביזרים באיכות הגבוהה ביותר',
      ar: 'فقط الزجاج والأجهزة بأعلى جودة',
    },
  },
  {
    icon: '🤝',
    title: {
      en: 'Customer First',
      he: 'הלקוח במקום הראשון',
      ar: 'العميل أولاً',
    },
    description: {
      en: 'Your satisfaction is our top priority',
      he: 'שביעות רצונכם היא בראש סדר העדיפויות שלנו',
      ar: 'رضاك هو أولويتنا القصوى',
    },
  },
  {
    icon: '🛡️',
    title: {
      en: 'Warranty Included',
      he: 'כולל אחריות',
      ar: 'الضمان مشمول',
    },
    description: {
      en: 'All our work comes with a comprehensive warranty',
      he: 'כל העבודות שלנו כוללות אחריות מקיפה',
      ar: 'جميع أعمالنا تأتي مع ضمان شامل',
    },
  },
];

// =============================================================================
// PAGE CONTENT
// =============================================================================

export const PAGE_CONTENT = {
  home: {
    hero: {
      title: {
        en: 'Premium Glass Solutions',
        he: 'פתרונות זכוכית פרימיום',
        ar: 'حلول زجاجية متميزة',
      },
      subtitle: {
        en: 'Transforming Spaces with Elegance',
        he: 'משנים מרחבים באלגנטיות',
        ar: 'تحويل المساحات بأناقة',
      },
      description: {
        en: 'Professional glass installation services for homes and businesses throughout Israel. From shower enclosures to glass railings, we deliver excellence.',
        he: 'שירותי התקנת זכוכית מקצועיים לבתים ועסקים בכל רחבי ישראל. ממארזי מקלחת ועד מעקות זכוכית, אנו מספקים מצוינות.',
        ar: 'خدمات تركيب الزجاج الاحترافية للمنازل والشركات في جميع أنحاء إسرائيل. من حاويات الدش إلى الدرابزين الزجاجي، نقدم التميز.',
      },
      cta: {
        en: 'Get Free Quote',
        he: 'קבלו הצעת מחיר חינם',
        ar: 'احصل على عرض أسعار مجاني',
      },
    },
    sections: {
      services: {
        title: {
          en: 'Our Services',
          he: 'השירותים שלנו',
          ar: 'خدماتنا',
        },
        subtitle: {
          en: 'Comprehensive glass solutions for every need',
          he: 'פתרונות זכוכית מקיפים לכל צורך',
          ar: 'حلول زجاجية شاملة لكل حاجة',
        },
      },
      projects: {
        title: {
          en: 'Our Work',
          he: 'העבודות שלנו',
          ar: 'أعمالنا',
        },
        subtitle: {
          en: 'Browse our portfolio of completed projects',
          he: 'עיינו בתיק העבודות של הפרויקטים שהושלמו',
          ar: 'تصفح معرض أعمالنا المكتملة',
        },
      },
      testimonials: {
        title: {
          en: 'What Our Clients Say',
          he: 'מה הלקוחות שלנו אומרים',
          ar: 'ماذا يقول عملاؤنا',
        },
        subtitle: {
          en: 'Real feedback from satisfied customers',
          he: 'משוב אמיתי מלקוחות מרוצים',
          ar: 'تعليقات حقيقية من عملاء راضين',
        },
      },
      whyUs: {
        title: {
          en: 'Why Choose Us',
          he: 'למה לבחור בנו',
          ar: 'لماذا تختارنا',
        },
        subtitle: {
          en: 'What sets us apart from the competition',
          he: 'מה מייחד אותנו מהמתחרים',
          ar: 'ما يميزنا عن المنافسة',
        },
      },
    },
  },
  about: {
    title: {
      en: 'About Shwaki Brothers',
      he: 'אודות אחים שווקי',
      ar: 'عن إخوة شواقي',
    },
    subtitle: {
      en: 'Your Trusted Glass Experts Since 2015',
      he: 'מומחי הזכוכית האמינים שלכם מאז 2015',
      ar: 'خبراء الزجاج الموثوقون منذ 2015',
    },
    story: {
      en: 'Shwaki Brothers Glassworks was founded with a simple vision: to provide the highest quality glass solutions with exceptional customer service. What started as a small family business has grown into one of the most trusted names in glass installation across Israel. Our commitment to craftsmanship, attention to detail, and customer satisfaction has earned us a reputation for excellence.',
      he: 'אחים שווקי עבודות זכוכית הוקמה עם חזון פשוט: לספק פתרונות זכוכית באיכות הגבוהה ביותר עם שירות לקוחות יוצא דופן. מה שהתחיל כעסק משפחתי קטן צמח לאחד השמות האמינים ביותר בהתקנת זכוכית ברחבי ישראל. המחויבות שלנו למלאכת יד, תשומת לב לפרטים ושביעות רצון הלקוחות הקנו לנו מוניטין של מצוינות.',
      ar: 'تأسست إخوة شواقي للزجاج برؤية بسيطة: تقديم حلول زجاجية بأعلى جودة مع خدمة عملاء استثنائية. ما بدأ كشركة عائلية صغيرة نما ليصبح أحد أكثر الأسماء الموثوقة في تركيب الزجاج في جميع أنحاء إسرائيل. التزامنا بالحرفية والاهتمام بالتفاصيل ورضا العملاء أكسبنا سمعة التميز.',
    },
    stats: [
      {
        value: '500+',
        label: {
          en: 'Projects Completed',
          he: 'פרויקטים שהושלמו',
          ar: 'مشاريع مكتملة',
        },
      },
      {
        value: '10+',
        label: {
          en: 'Years Experience',
          he: 'שנות ניסיון',
          ar: 'سنوات خبرة',
        },
      },
      {
        value: '100%',
        label: {
          en: 'Customer Satisfaction',
          he: 'שביעות רצון לקוחות',
          ar: 'رضا العملاء',
        },
      },
    ],
  },
  services: {
    title: {
      en: 'Our Services',
      he: 'השירותים שלנו',
      ar: 'خدماتنا',
    },
    subtitle: {
      en: 'Professional glass solutions for every need',
      he: 'פתרונות זכוכית מקצועיים לכל צורך',
      ar: 'حلول زجاجية احترافية لكل حاجة',
    },
  },
  projects: {
    title: {
      en: 'Our Projects',
      he: 'הפרויקטים שלנו',
      ar: 'مشاريعنا',
    },
    subtitle: {
      en: 'Explore our portfolio of completed glass installations',
      he: 'חקרו את תיק העבודות של התקנות הזכוכית שהושלמו',
      ar: 'استكشف معرض أعمالنا من تركيبات الزجاج المكتملة',
    },
    allCategories: {
      en: 'All Projects',
      he: 'כל הפרויקטים',
      ar: 'جميع المشاريع',
    },
    noProjects: {
      en: 'No projects found in this category',
      he: 'לא נמצאו פרויקטים בקטגוריה זו',
      ar: 'لم يتم العثور على مشاريع في هذه الفئة',
    },
  },
  contact: {
    title: {
      en: 'Contact Us',
      he: 'צרו קשר',
      ar: 'اتصل بنا',
    },
    subtitle: {
      en: 'Get in touch for a free consultation',
      he: 'צרו קשר לייעוץ חינם',
      ar: 'تواصل معنا للحصول على استشارة مجانية',
    },
    form: {
      name: {
        en: 'Your Name',
        he: 'שמכם',
        ar: 'اسمك',
      },
      email: {
        en: 'Email Address',
        he: 'כתובת אימייל',
        ar: 'عنوان البريد الإلكتروني',
      },
      phone: {
        en: 'Phone Number',
        he: 'מספר טלפון',
        ar: 'رقم الهاتف',
      },
      service: {
        en: 'Service Interested In',
        he: 'שירות מעניין',
        ar: 'الخدمة المهتم بها',
      },
      message: {
        en: 'Your Message',
        he: 'ההודעה שלכם',
        ar: 'رسالتك',
      },
      submit: {
        en: 'Send Message',
        he: 'שלחו הודעה',
        ar: 'إرسال الرسالة',
      },
      sending: {
        en: 'Sending...',
        he: 'שולח...',
        ar: 'جاري الإرسال...',
      },
      success: {
        en: 'Message sent successfully! We\'ll get back to you soon.',
        he: 'ההודעה נשלחה בהצלחה! ניצור איתכם קשר בקרוב.',
        ar: 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.',
      },
      error: {
        en: 'Failed to send message. Please try again or call us directly.',
        he: 'שליחת ההודעה נכשלה. אנא נסו שוב או התקשרו אלינו ישירות.',
        ar: 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.',
      },
    },
  },
  contractors: {
    title: {
      en: 'For Contractors',
      he: 'לקבלנים',
      ar: 'للمقاولين',
    },
    subtitle: {
      en: 'Partner with us for your glass installation needs',
      he: 'שתפו איתנו פעולה לצרכי התקנת הזכוכית שלכם',
      ar: 'شاركنا لتلبية احتياجاتك من تركيب الزجاج',
    },
    benefits: [
      {
        title: {
          en: 'Competitive Pricing',
          he: 'מחירים תחרותיים',
          ar: 'أسعار تنافسية',
        },
        description: {
          en: 'Special rates for ongoing partnerships and bulk orders',
          he: 'תעריפים מיוחדים לשותפויות מתמשכות והזמנות גדולות',
          ar: 'أسعار خاصة للشراكات المستمرة والطلبات بالجملة',
        },
      },
      {
        title: {
          en: 'Reliable Scheduling',
          he: 'תזמון אמין',
          ar: 'جدولة موثوقة',
        },
        description: {
          en: 'We work with your timelines to meet project deadlines',
          he: 'אנו עובדים עם לוחות הזמנים שלכם לעמידה בלוחות זמנים של פרויקטים',
          ar: 'نعمل مع جداولك الزمنية للوفاء بمواعيد المشاريع',
        },
      },
      {
        title: {
          en: 'Quality Guaranteed',
          he: 'איכות מובטחת',
          ar: 'جودة مضمونة',
        },
        description: {
          en: 'Premium materials and expert installation every time',
          he: 'חומרים פרימיום והתקנה מקצועית בכל פעם',
          ar: 'مواد متميزة وتركيب احترافي في كل مرة',
        },
      },
    ],
  },
} as const;

// =============================================================================
// NAVIGATION
// =============================================================================

export const NAVIGATION = {
  items: [
    {
      href: '/',
      label: {
        en: 'Home',
        he: 'ראשי',
        ar: 'الرئيسية',
      },
    },
    {
      href: '/services',
      label: {
        en: 'Services',
        he: 'שירותים',
        ar: 'الخدمات',
      },
    },
    {
      href: '/projects',
      label: {
        en: 'Projects',
        he: 'פרויקטים',
        ar: 'المشاريع',
      },
    },
    {
      href: '/about',
      label: {
        en: 'About',
        he: 'אודות',
        ar: 'حول',
      },
    },
    {
      href: '/contact',
      label: {
        en: 'Contact',
        he: 'צור קשר',
        ar: 'اتصل',
      },
    },
  ],
  cta: {
    label: {
      en: 'Get Quote',
      he: 'הצעת מחיר',
      ar: 'عرض أسعار',
    },
  },
} as const;

// =============================================================================
// FOOTER
// =============================================================================

export const FOOTER_CONTENT = {
  description: {
    en: 'Premium glass solutions for homes and businesses. Serving all of Israel with excellence since 2015.',
    he: 'פתרונות זכוכית פרימיום לבתים ועסקים. משרתים את כל ישראל במצוינות מאז 2015.',
    ar: 'حلول زجاجية متميزة للمنازل والشركات. نخدم جميع أنحاء إسرائيل بتميز منذ 2015.',
  },
  quickLinks: {
    title: {
      en: 'Quick Links',
      he: 'קישורים מהירים',
      ar: 'روابط سريعة',
    },
  },
  services: {
    title: {
      en: 'Services',
      he: 'שירותים',
      ar: 'الخدمات',
    },
  },
  contact: {
    title: {
      en: 'Contact',
      he: 'יצירת קשר',
      ar: 'اتصل',
    },
  },
  copyright: {
    en: '© 2024 Shwaki Brothers Glassworks. All rights reserved.',
    he: '© 2024 אחים שווקי עבודות זכוכית. כל הזכויות שמורות.',
    ar: '© 2024 إخوة شواقي للزجاج. جميع الحقوق محفوظة.',
  },
  licensedBusiness: {
    en: 'Licensed Sole Proprietor (Osek Morshe)',
    he: 'עוסק מורשה',
    ar: 'صاحب عمل مرخص',
  },
} as const;

// =============================================================================
// COMMON UI STRINGS
// =============================================================================

export const UI_STRINGS = {
  loading: {
    en: 'Loading...',
    he: 'טוען...',
    ar: 'جاري التحميل...',
  },
  error: {
    en: 'An error occurred',
    he: 'אירעה שגיאה',
    ar: 'حدث خطأ',
  },
  retry: {
    en: 'Try Again',
    he: 'נסה שוב',
    ar: 'حاول مرة أخرى',
  },
  viewAll: {
    en: 'View All',
    he: 'צפה בכל',
    ar: 'عرض الكل',
  },
  learnMore: {
    en: 'Learn More',
    he: 'למידע נוסף',
    ar: 'اعرف المزيد',
  },
  getQuote: {
    en: 'Get Free Quote',
    he: 'הצעת מחיר חינם',
    ar: 'عرض أسعار مجاني',
  },
  callNow: {
    en: 'Call Now',
    he: 'התקשר עכשיו',
    ar: 'اتصل الآن',
  },
  whatsapp: {
    en: 'WhatsApp Us',
    he: 'שלחו לנו וואטסאפ',
    ar: 'راسلنا على واتساب',
  },
  backToHome: {
    en: 'Back to Home',
    he: 'חזרה לדף הבית',
    ar: 'العودة للرئيسية',
  },
  pageNotFound: {
    en: 'Page Not Found',
    he: 'הדף לא נמצא',
    ar: 'الصفحة غير موجودة',
  },
  pageNotFoundMessage: {
    en: 'The page you\'re looking for doesn\'t exist or has been moved.',
    he: 'הדף שאתם מחפשים לא קיים או הועבר.',
    ar: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
  },
} as const;

// =============================================================================
// SAMPLE PROJECTS (Placeholder for real images)
// =============================================================================

export interface SampleProjectData {
  id: string;
  title: { en: string; he: string; ar: string };
  category: { en: string; he: string; ar: string };
  description: { en: string; he: string; ar: string };
  image: string | null; // Will be null until you add real images
  placeholderText: { en: string; he: string; ar: string }; // Shows what image should go here
}

export const SAMPLE_PROJECTS: SampleProjectData[] = [
  {
    id: 'project-1',
    title: {
      en: 'Luxury Shower Enclosure',
      he: 'מארז מקלחת יוקרתי',
      ar: 'حاوية دش فاخرة',
    },
    category: {
      en: 'Shower Glass',
      he: 'זכוכית למקלחות',
      ar: 'زجاج الدش',
    },
    description: {
      en: 'Custom frameless shower for a Tel Aviv penthouse',
      he: 'מקלחון ללא מסגרת מותאם אישית לפנטהאוז בתל אביב',
      ar: 'حاوية دش بدون إطار مخصصة لشقة بنتهاوس في تل أبيب',
    },
    image: null, // Add: /shower-project-1.jpg
    placeholderText: {
      en: 'Add shower enclosure photo',
      he: 'הוסף תמונת מקלחון',
      ar: 'أضف صورة حاوية الدش',
    },
  },
  {
    id: 'project-2',
    title: {
      en: 'Balcony Glass Railing',
      he: 'מעקה זכוכית למרפסת',
      ar: 'درابزين زجاجي للشرفة',
    },
    category: {
      en: 'Glass Railings',
      he: 'מעקות זכוכית',
      ar: 'درابزين زجاجي',
    },
    description: {
      en: 'Modern glass railing with sea view in Haifa',
      he: 'מעקה זכוכית מודרני עם נוף לים בחיפה',
      ar: 'درابزين زجاجي حديث مع إطلالة على البحر في حيفا',
    },
    image: null, // Add: /railing-project-1.jpg
    placeholderText: {
      en: 'Add glass railing photo',
      he: 'הוסף תמונת מעקה',
      ar: 'أضف صورة الدرابزين',
    },
  },
  {
    id: 'project-3',
    title: {
      en: 'Office Glass Partitions',
      he: 'מחיצות זכוכית למשרד',
      ar: 'فواصل زجاجية للمكتب',
    },
    category: {
      en: 'Glass Partitions',
      he: 'מחיצות זכוכית',
      ar: 'فواصل زجاجية',
    },
    description: {
      en: 'Modern workspace design for a Jerusalem startup',
      he: 'עיצוב מרחב עבודה מודרני לסטארטאפ בירושלים',
      ar: 'تصميم مساحة عمل حديثة لشركة ناشئة في القدس',
    },
    image: null, // Add: /partition-project-1.jpg
    placeholderText: {
      en: 'Add office partition photo',
      he: 'הוסף תמונת מחיצה',
      ar: 'أضف صورة فاصل مكتبي',
    },
  },
  {
    id: 'project-4',
    title: {
      en: 'Custom Wall Mirror',
      he: 'מראה קיר מותאמת',
      ar: 'مرآة حائط مخصصة',
    },
    category: {
      en: 'Mirrors',
      he: 'מראות',
      ar: 'مرايا',
    },
    description: {
      en: 'Large decorative mirror for a luxury home in Ramat Gan',
      he: 'מראה דקורטיבית גדולה לבית יוקרתי ברמת גן',
      ar: 'مرآة زخرفية كبيرة لمنزل فاخر في رمات غان',
    },
    image: null, // Add: /mirror-project-1.jpg
    placeholderText: {
      en: 'Add mirror photo',
      he: 'הוסף תמונת מראה',
      ar: 'أضف صورة مرآة',
    },
  },
  {
    id: 'project-5',
    title: {
      en: 'Restaurant Storefront',
      he: 'חזית מסעדה',
      ar: 'واجهة مطعم',
    },
    category: {
      en: 'Storefront Glass',
      he: 'חזיתות זכוכית',
      ar: 'واجهات زجاجية',
    },
    description: {
      en: 'Full glass storefront for a café in Jaffa',
      he: 'חזית זכוכית מלאה לבית קפה ביפו',
      ar: 'واجهة زجاجية كاملة لمقهى في يافا',
    },
    image: null, // Add: /storefront-project-1.jpg
    placeholderText: {
      en: 'Add storefront photo',
      he: 'הוסף תמונת חזית',
      ar: 'أضف صورة واجهة',
    },
  },
  {
    id: 'project-6',
    title: {
      en: 'Glass Table Top',
      he: 'משטח שולחן זכוכית',
      ar: 'سطح طاولة زجاجي',
    },
    category: {
      en: 'Custom Glass',
      he: 'זכוכית מותאמת',
      ar: 'زجاج مخصص',
    },
    description: {
      en: 'Custom tempered glass dining table',
      he: 'שולחן אוכל זכוכית מחוסמת מותאם אישית',
      ar: 'طاولة طعام من الزجاج المقسى المخصص',
    },
    image: null, // Add: /table-project-1.jpg
    placeholderText: {
      en: 'Add glass table photo',
      he: 'הוסף תמונת שולחן',
      ar: 'أضف صورة طاولة',
    },
  },
];

// =============================================================================
// GALLERY PLACEHOLDERS (For real work photos)
// =============================================================================

export interface GalleryPlaceholder {
  id: string;
  image: string | null;
  category: { en: string; he: string; ar: string };
  placeholderText: { en: string; he: string; ar: string };
}

export const GALLERY_PLACEHOLDERS: GalleryPlaceholder[] = [
  { id: 'g1', image: null, category: { en: 'Showers', he: 'מקלחונים', ar: 'دشات' }, placeholderText: { en: 'Shower work photo', he: 'תמונת עבודת מקלחון', ar: 'صورة عمل الدش' } },
  { id: 'g2', image: null, category: { en: 'Railings', he: 'מעקות', ar: 'درابزين' }, placeholderText: { en: 'Railing work photo', he: 'תמונת עבודת מעקה', ar: 'صورة عمل الدرابزين' } },
  { id: 'g3', image: null, category: { en: 'Mirrors', he: 'מראות', ar: 'مرايا' }, placeholderText: { en: 'Mirror work photo', he: 'תמונת עבודת מראה', ar: 'صورة عمل المرآة' } },
  { id: 'g4', image: null, category: { en: 'Partitions', he: 'מחיצות', ar: 'فواصل' }, placeholderText: { en: 'Partition work photo', he: 'תמונת עבודת מחיצה', ar: 'صورة عمل الفاصل' } },
  { id: 'g5', image: null, category: { en: 'Storefronts', he: 'חזיתות', ar: 'واجهات' }, placeholderText: { en: 'Storefront work photo', he: 'תמונת עבודת חזית', ar: 'صورة عمل الواجهة' } },
  { id: 'g6', image: null, category: { en: 'Custom', he: 'מותאם', ar: 'مخصص' }, placeholderText: { en: 'Custom work photo', he: 'תמונת עבודה מותאמת', ar: 'صورة عمل مخصص' } },
  { id: 'g7', image: null, category: { en: 'Showers', he: 'מקלחונים', ar: 'دشات' }, placeholderText: { en: 'Shower detail photo', he: 'תמונת פרט מקלחון', ar: 'صورة تفصيل الدش' } },
  { id: 'g8', image: null, category: { en: 'Railings', he: 'מעקות', ar: 'درابزين' }, placeholderText: { en: 'Railing detail photo', he: 'תמונת פרט מעקה', ar: 'صورة تفصيل الدرابزين' } },
];

// =============================================================================
// HELPER FUNCTION
// =============================================================================

export type SupportedLocale = 'en' | 'he' | 'ar';

/**
 * Get localized text from a multi-language object
 */
export function getLocalizedText<T extends Record<SupportedLocale, string>>(
  textObj: T,
  locale: string
): string {
  const supportedLocale = (locale as SupportedLocale) || 'en';
  return textObj[supportedLocale] || textObj.en;
}

/**
 * Get localized array from a multi-language object
 */
export function getLocalizedArray<T extends Record<SupportedLocale, string[]>>(
  arrayObj: T,
  locale: string
): string[] {
  const supportedLocale = (locale as SupportedLocale) || 'en';
  return arrayObj[supportedLocale] || arrayObj.en;
}

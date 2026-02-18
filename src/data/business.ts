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
    ru: 'Братья Шваки — Стеклянные работы',
  },
  owner: 'Mohammad Shwaki',
  tagline: {
    en: 'Premium Glass Solutions for Every Space',
    he: 'פתרונות זכוכית פרימיום לכל מרחב',
    ar: 'حلول زجاجية متميزة لكل مساحة',
    ru: 'Премиальные стеклянные решения для любого пространства',
  },
  description: {
    en: 'Professional glass installation and custom glass works serving all of Israel. We transform spaces with elegant, high-quality glass solutions.',
    he: 'התקנת זכוכית מקצועית ועבודות זכוכית מותאמות אישית בכל רחבי ישראל. אנו משנים מרחבים עם פתרונות זכוכית אלגנטיים ואיכותיים.',
    ar: 'تركيب زجاج احترافي وأعمال زجاجية مخصصة في جميع أنحاء إسرائيل. نحول المساحات بحلول زجاجية أنيقة وعالية الجودة.',
    ru: 'Профессиональная установка стекла и индивидуальные стеклянные работы по всему Израилю. Мы преображаем пространства элегантными и качественными стеклянными решениями.',
  },
  location: {
    en: 'Jerusalem, Israel',
    he: 'ירושלים, ישראל',
    ar: 'القدس، إسرائيل',
    ru: 'Иерусалим, Израиль',
  },
  serviceArea: {
    en: 'Serving all of Israel',
    he: 'משרתים את כל ישראל',
    ar: 'نخدم جميع أنحاء إسرائيل',
    ru: 'Обслуживаем весь Израиль',
  },
  established: '2015',
} as const;

// =============================================================================
// CONTACT INFORMATION
// =============================================================================

export const CONTACT_INFO = {
  phone: '058-502-2264',
  phoneIntl: '+972585022264',
  email: 'info@shwakiglassworks.com',
  whatsapp: '+972585022264',
  workingHours: {
    en: 'Sunday - Thursday: 8:00 AM - 6:00 PM | Friday: 8:00 AM - 2:00 PM',
    he: 'ראשון - חמישי: 8:00 - 18:00 | שישי: 8:00 - 14:00',
    ar: 'الأحد - الخميس: 8:00 صباحاً - 6:00 مساءً | الجمعة: 8:00 صباحاً - 2:00 مساءً',
    ru: 'Воскресенье - Четверг: 8:00 - 18:00 | Пятница: 8:00 - 14:00',
  },
  responseTime: {
    en: 'We typically respond within 24 hours',
    he: 'אנו בדרך כלל מגיבים תוך 24 שעות',
    ar: 'عادة ما نرد خلال 24 ساعة',
    ru: 'Обычно мы отвечаем в течение 24 часов',
  },
} as const;

// =============================================================================
// SERVICES
// =============================================================================

export interface ServiceData {
  id: string;
  icon: string;
  image?: string; // Optional service image path
  title: { en: string; he: string; ar: string; ru: string };
  description: { en: string; he: string; ar: string; ru: string };
  features: { en: string[]; he: string[]; ar: string[]; ru: string[] };
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
      ru: 'Душевое стекло',
    },
    description: {
      en: 'Transform your bathroom with our premium frameless shower enclosures. Custom-designed to fit any space with elegant, durable glass solutions.',
      he: 'שנו את חדר האמבטיה שלכם עם מארזי המקלחת הפרימיום ללא מסגרת שלנו. מעוצבים בהתאמה אישית לכל מרחב עם פתרונות זכוכית אלגנטיים ועמידים.',
      ar: 'حوّل حمامك مع حاويات الدش الزجاجية الفاخرة بدون إطار. مصممة خصيصاً لتناسب أي مساحة بحلول زجاجية أنيقة ومتينة.',
      ru: 'Преобразите вашу ванную комнату с нашими безрамными душевыми кабинами. Индивидуальный дизайн для любого пространства.',
    },
    features: {
      en: ['Frameless designs', 'Custom measurements', 'Safety tempered glass', 'Easy-clean coating'],
      he: ['עיצובים ללא מסגרת', 'מידות מותאמות אישית', 'זכוכית מחוסמת בטיחותית', 'ציפוי קל לניקוי'],
      ar: ['تصاميم بدون إطار', 'قياسات مخصصة', 'زجاج مقسى آمن', 'طلاء سهل التنظيف'],
      ru: ['Безрамный дизайн', 'Индивидуальные размеры', 'Закалённое безопасное стекло', 'Лёгкое в уходе покрытие'],
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
      ru: 'Стеклянные ограждения',
    },
    description: {
      en: 'Modern glass railings that combine safety with stunning aesthetics. Perfect for balconies, staircases, and terraces.',
      he: 'מעקות זכוכית מודרניים המשלבים בטיחות עם אסתטיקה מרהיבה. מושלמים למרפסות, מדרגות וטרסות.',
      ar: 'درابزين زجاجي حديث يجمع بين السلامة والجماليات المذهلة. مثالي للشرفات والسلالم والتراسات.',
      ru: 'Современные стеклянные ограждения, сочетающие безопасность и эстетику. Для балконов, лестниц и террас.',
    },
    features: {
      en: ['Structural glass panels', 'Stainless steel hardware', 'Code compliant', 'Unobstructed views'],
      he: ['לוחות זכוכית מבניים', 'אביזרי נירוסטה', 'עומדים בתקנים', 'נוף ללא הפרעה'],
      ar: ['ألواح زجاجية هيكلية', 'أجهزة من الفولاذ المقاوم للصدأ', 'متوافق مع المعايير', 'مناظر غير معرقلة'],
      ru: ['Структурные стеклянные панели', 'Фурнитура из нержавеющей стали', 'Соответствие стандартам', 'Беспрепятственный обзор'],
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
      ru: 'Зеркала',
    },
    description: {
      en: 'Custom mirrors for any application - from decorative wall mirrors to gym mirrors and bathroom vanities.',
      he: 'מראות מותאמות אישית לכל שימוש - ממראות קיר דקורטיביות ועד מראות חדר כושר ומראות אמבטיה.',
      ar: 'مرايا مخصصة لأي تطبيق - من المرايا الجدارية الزخرفية إلى مرايا الصالة الرياضية ومرايا الحمام.',
      ru: 'Зеркала на заказ для любого применения — от декоративных настенных до зеркал для спортзалов и ванных комнат.',
    },
    features: {
      en: ['Custom sizes', 'Beveled edges', 'LED backlit options', 'Anti-fog technology'],
      he: ['מידות מותאמות', 'קצוות משופעים', 'אפשרויות תאורת LED אחורית', 'טכנולוגיה נגד אדים'],
      ar: ['أحجام مخصصة', 'حواف مشطوفة', 'خيارات إضاءة LED خلفية', 'تقنية مضادة للضباب'],
      ru: ['Индивидуальные размеры', 'Фацетные края', 'LED-подсветка', 'Технология анти-запотевания'],
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
      ru: 'Стеклянные перегородки',
    },
    description: {
      en: 'Create modern, open workspaces with our glass partition systems. Maintain natural light flow while defining separate areas.',
      he: 'צרו מרחבי עבודה מודרניים ופתוחים עם מערכות מחיצות הזכוכית שלנו. שמרו על זרימת אור טבעי תוך הגדרת אזורים נפרדים.',
      ar: 'أنشئ مساحات عمل حديثة ومفتوحة مع أنظمة الفواصل الزجاجية لدينا. حافظ على تدفق الضوء الطبيعي مع تحديد المناطق المنفصلة.',
      ru: 'Создавайте современные открытые рабочие пространства с нашими стеклянными перегородками. Естественное освещение с разделением зон.',
    },
    features: {
      en: ['Office partitions', 'Soundproof options', 'Sliding systems', 'Frosted glass available'],
      he: ['מחיצות משרד', 'אפשרויות אטימת קול', 'מערכות הזזה', 'זכוכית חלבית זמינה'],
      ar: ['فواصل مكتبية', 'خيارات عازلة للصوت', 'أنظمة منزلقة', 'زجاج مصنفر متاح'],
      ru: ['Офисные перегородки', 'Звукоизоляция', 'Раздвижные системы', 'Матовое стекло'],
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
      ru: 'Витринное стекло',
    },
    description: {
      en: 'Professional storefront glass installations for retail spaces, restaurants, and commercial buildings.',
      he: 'התקנות זכוכית חזית מקצועיות לחללים קמעונאיים, מסעדות ומבני מסחר.',
      ar: 'تركيبات زجاج واجهات احترافية للمساحات التجارية والمطاعم والمباني التجارية.',
      ru: 'Профессиональные витринные стеклянные конструкции для торговых площадей, ресторанов и коммерческих зданий.',
    },
    features: {
      en: ['Display windows', 'Entrance systems', 'Security glass', 'Energy efficient'],
      he: ['חלונות תצוגה', 'מערכות כניסה', 'זכוכית ביטחון', 'חסכוניות באנרגיה'],
      ar: ['نوافذ العرض', 'أنظمة المدخل', 'زجاج أمني', 'موفر للطاقة'],
      ru: ['Витрины', 'Входные системы', 'Защитное стекло', 'Энергоэффективность'],
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
      ru: 'Стеклянные работы на заказ',
    },
    description: {
      en: 'Unique glass solutions tailored to your specific needs. From glass tables to decorative panels, we bring your vision to life.',
      he: 'פתרונות זכוכית ייחודיים המותאמים לצרכים הספציפיים שלכם. משולחנות זכוכית ועד פאנלים דקורטיביים, אנו מגשימים את החזון שלכם.',
      ar: 'حلول زجاجية فريدة مصممة لاحتياجاتك الخاصة. من طاولات الزجاج إلى الألواح الزخرفية، نحقق رؤيتك.',
      ru: 'Уникальные стеклянные решения под ваши потребности. От стеклянных столов до декоративных панелей.',
    },
    features: {
      en: ['Glass tables', 'Decorative panels', 'Splashbacks', 'Custom designs'],
      he: ['שולחנות זכוכית', 'פאנלים דקורטיביים', 'חיפויי קיר', 'עיצובים מותאמים'],
      ar: ['طاولات زجاجية', 'ألواح زخرفية', 'واقيات رذاذ', 'تصاميم مخصصة'],
      ru: ['Стеклянные столы', 'Декоративные панели', 'Фартуки', 'Индивидуальный дизайн'],
    },
  },
  {
    id: 'glass-doors',
    icon: '🚪',
    title: {
      en: 'Glass Doors',
      he: 'דלתות זכוכית',
      ar: 'أبواب زجاجية',
      ru: 'Стеклянные двери',
    },
    description: {
      en: 'Elegant glass doors for interiors and exteriors. Sliding, pivot, and hinged designs that add a modern touch to any entrance.',
      he: 'דלתות זכוכית אלגנטיות לפנים ולחוץ. עיצובים הזזה, ציר ותלויים המוסיפים נגיעה מודרנית לכל כניסה.',
      ar: 'أبواب زجاجية أنيقة للداخل والخارج. تصاميم منزلقة ومحورية ومفصلية تضيف لمسة عصرية لأي مدخل.',
      ru: 'Элегантные стеклянные двери для интерьера и экстерьера. Раздвижные, поворотные и распашные конструкции.',
    },
    features: {
      en: ['Sliding doors', 'Pivot systems', 'Frosted options', 'Smart glass available'],
      he: ['דלתות הזזה', 'מערכות ציר', 'אפשרויות חלבית', 'זכוכית חכמה זמינה'],
      ar: ['أبواب منزلقة', 'أنظمة محورية', 'خيارات مصنفرة', 'زجاج ذكي متاح'],
      ru: ['Раздвижные двери', 'Поворотные системы', 'Матовые варианты', 'Умное стекло'],
    },
  },
  {
    id: 'backsplashes',
    icon: '🎨',
    title: {
      en: 'Glass Backsplashes',
      he: 'חיפוי זכוכית למטבח',
      ar: 'واقيات زجاجية للمطبخ',
      ru: 'Стеклянные фартуки',
    },
    description: {
      en: 'Stunning kitchen and bathroom backsplashes in tempered glass. Available in any color, with a seamless easy-to-clean finish.',
      he: 'חיפויי זכוכית מרהיבים למטבחים ואמבטיות. זמינים בכל צבע, עם גימור חלק ונוח לניקוי.',
      ar: 'واقيات زجاجية مذهلة للمطابخ والحمامات. متوفرة بأي لون، مع تشطيب سلس وسهل التنظيف.',
      ru: 'Потрясающие кухонные и ванные фартуки из закалённого стекла. Любой цвет, бесшовная отделка.',
    },
    features: {
      en: ['Any RAL color', 'Tempered safety glass', 'Seamless design', 'Heat resistant'],
      he: ['כל צבע RAL', 'זכוכית מחוסמת בטיחותית', 'עיצוב חלק', 'עמיד בחום'],
      ar: ['أي لون RAL', 'زجاج مقسى آمن', 'تصميم سلس', 'مقاوم للحرارة'],
      ru: ['Любой цвет RAL', 'Закалённое безопасное стекло', 'Бесшовный дизайн', 'Термостойкость'],
    },
  },
  {
    id: 'shelves',
    icon: '📐',
    title: {
      en: 'Glass Shelves',
      he: 'מדפי זכוכית',
      ar: 'رفوف زجاجية',
      ru: 'Стеклянные полки',
    },
    description: {
      en: 'Custom glass shelving for retail displays, bathrooms, and living spaces. Clean, modern look with strong tempered glass.',
      he: 'מדפי זכוכית מותאמים אישית לתצוגות חנויות, אמבטיות ומרחבי מגורים. מראה נקי ומודרני עם זכוכית מחוסמת חזקה.',
      ar: 'أرفف زجاجية مخصصة لعروض المتاجر والحمامات والمساحات المعيشية. مظهر نظيف وعصري مع زجاج مقسى قوي.',
      ru: 'Стеклянные полки на заказ для магазинов, ванных комнат и жилых помещений. Чистый современный вид.',
    },
    features: {
      en: ['Custom sizes', 'Floating mounts', 'LED lighting options', 'Heavy-duty brackets'],
      he: ['מידות מותאמות', 'תליה צפה', 'אפשרויות תאורת LED', 'תושבות כבדות'],
      ar: ['أحجام مخصصة', 'تثبيت عائم', 'خيارات إضاءة LED', 'أقواس شديدة التحمل'],
      ru: ['Индивидуальные размеры', 'Парящее крепление', 'LED-подсветка', 'Усиленные кронштейны'],
    },
  },
  {
    id: 'lobbies',
    icon: '🏛️',
    title: {
      en: 'Lobby Glass',
      he: 'זכוכית ללובי',
      ar: 'زجاج اللوبي',
      ru: 'Стекло для лобби',
    },
    description: {
      en: 'Grand glass features for building lobbies and reception areas. Create an impressive first impression with our premium installations.',
      he: 'אלמנטי זכוכית מרשימים ללובי בניינים ואזורי קבלה. צרו רושם ראשוני מרשים עם ההתקנות הפרימיום שלנו.',
      ar: 'ميزات زجاجية فخمة لردهات المباني ومناطق الاستقبال. اخلق انطباعاً أولياً مميزاً مع تركيباتنا الفاخرة.',
      ru: 'Впечатляющие стеклянные элементы для лобби зданий и приёмных. Создайте незабываемое первое впечатление.',
    },
    features: {
      en: ['Feature walls', 'Reception screens', 'Decorative panels', 'Lobby partitions'],
      he: ['קירות ייחודיים', 'מסכי קבלה', 'פאנלים דקורטיביים', 'מחיצות לובי'],
      ar: ['جدران مميزة', 'شاشات استقبال', 'ألواح زخرفية', 'فواصل اللوبي'],
      ru: ['Декоративные стены', 'Экраны ресепшн', 'Декоративные панели', 'Перегородки для лобби'],
    },
  },
];

// =============================================================================
// TESTIMONIALS
// =============================================================================

export interface TestimonialData {
  id: string;
  name: string;
  location: { en: string; he: string; ar: string; ru: string };
  rating: number;
  text: { en: string; he: string; ar: string; ru: string };
  project: { en: string; he: string; ar: string; ru: string };
}

export const TESTIMONIALS: TestimonialData[] = [
  {
    id: '1',
    name: 'David Cohen',
    location: {
      en: 'Tel Aviv',
      he: 'תל אביב',
      ar: 'تل أبيب',
      ru: 'Тель-Авив',
    },
    rating: 5,
    text: {
      en: 'Exceptional quality and professionalism. The shower enclosure they installed transformed our bathroom completely. Highly recommended!',
      he: 'איכות ומקצועיות יוצאי דופן. מארז המקלחת שהתקינו שינה את חדר האמבטיה שלנו לחלוטין. ממליץ בחום!',
      ar: 'جودة واحترافية استثنائية. حاوية الدش التي قاموا بتركيبها حولت حمامنا بالكامل. موصى به بشدة!',
      ru: 'Исключительное качество и профессионализм. Душевая кабина полностью преобразила нашу ванную. Очень рекомендую!',
    },
    project: {
      en: 'Frameless Shower Installation',
      he: 'התקנת מקלחון ללא מסגרת',
      ar: 'تركيب دش بدون إطار',
      ru: 'Установка безрамной душевой кабины',
    },
  },
  {
    id: '2',
    name: 'Sarah Levy',
    location: {
      en: 'Jerusalem',
      he: 'ירושלים',
      ar: 'القدس',
      ru: 'Иерусалим',
    },
    rating: 5,
    text: {
      en: 'The glass railing on our balcony is absolutely stunning. Great attention to detail and the team was very professional throughout the process.',
      he: 'מעקה הזכוכית במרפסת שלנו פשוט מדהים. תשומת לב רבה לפרטים והצוות היה מקצועי מאוד לאורך כל התהליך.',
      ar: 'الدرابزين الزجاجي على شرفتنا مذهل تماماً. اهتمام كبير بالتفاصيل وكان الفريق محترفاً للغاية طوال العملية.',
      ru: 'Стеклянное ограждение на нашем балконе просто потрясающее. Отличное внимание к деталям, очень профессиональная команда.',
    },
    project: {
      en: 'Balcony Glass Railing',
      he: 'מעקה זכוכית למרפסת',
      ar: 'درابزين زجاجي للشرفة',
      ru: 'Стеклянное ограждение балкона',
    },
  },
  {
    id: '3',
    name: 'Ahmed Hassan',
    location: {
      en: 'Haifa',
      he: 'חיפה',
      ar: 'حيفا',
      ru: 'Хайфа',
    },
    rating: 5,
    text: {
      en: 'They did an amazing job with our office glass partitions. The space looks modern and the team was respectful of our work schedule.',
      he: 'הם עשו עבודה מדהימה עם מחיצות הזכוכית במשרד שלנו. המרחב נראה מודרני והצוות כיבד את לוח הזמנים שלנו.',
      ar: 'قاموا بعمل رائع مع الفواصل الزجاجية في مكتبنا. تبدو المساحة حديثة وكان الفريق يحترم جدول عملنا.',
      ru: 'Они проделали потрясающую работу со стеклянными перегородками в нашем офисе. Пространство выглядит современно, и команда уважала наш график.',
    },
    project: {
      en: 'Office Glass Partitions',
      he: 'מחיצות זכוכית למשרד',
      ar: 'فواصل زجاجية للمكتب',
      ru: 'Офисные стеклянные перегородки',
    },
  },
  {
    id: '4',
    name: 'Rachel Ben-David',
    location: {
      en: 'Ramat Gan',
      he: 'רמת גן',
      ar: 'رمات غان',
      ru: 'Рамат-Ган',
    },
    rating: 5,
    text: {
      en: 'From measurement to installation, everything was seamless. The custom mirror they made for our living room is exactly what we envisioned.',
      he: 'מהמדידה ועד ההתקנה, הכל היה חלק. המראה המותאמת שהכינו לסלון שלנו היא בדיוק מה שדמיינו.',
      ar: 'من القياس إلى التثبيت، كل شيء كان سلساً. المرآة المخصصة التي صنعوها لغرفة المعيشة هي بالضبط ما تصورناه.',
      ru: 'От замера до установки — всё было безупречно. Зеркало на заказ для нашей гостиной — именно то, что мы представляли.',
    },
    project: {
      en: 'Custom Wall Mirror',
      he: 'מראה קיר מותאמת',
      ar: 'مرآة حائط مخصصة',
      ru: 'Настенное зеркало на заказ',
    },
  },
];

// =============================================================================
// WHY CHOOSE US
// =============================================================================

export interface WhyChooseUsItem {
  icon: string;
  title: { en: string; he: string; ar: string; ru: string };
  description: { en: string; he: string; ar: string; ru: string };
}

export const WHY_CHOOSE_US: WhyChooseUsItem[] = [
  {
    icon: '🏆',
    title: {
      en: 'Expert Craftsmanship',
      he: 'מלאכת יד מומחית',
      ar: 'حرفية خبيرة',
      ru: 'Мастерство экспертов',
    },
    description: {
      en: 'Years of experience in premium glass installations',
      he: 'שנים של ניסיון בהתקנות זכוכית פרימיום',
      ar: 'سنوات من الخبرة في تركيبات الزجاج الفاخرة',
      ru: 'Годы опыта в премиальных стеклянных установках',
    },
  },
  {
    icon: '🎯',
    title: {
      en: 'Custom Solutions',
      he: 'פתרונות מותאמים',
      ar: 'حلول مخصصة',
      ru: 'Индивидуальные решения',
    },
    description: {
      en: 'Every project tailored to your exact specifications',
      he: 'כל פרויקט מותאם למפרט המדויק שלכם',
      ar: 'كل مشروع مصمم وفقاً لمواصفاتك الدقيقة',
      ru: 'Каждый проект адаптирован под ваши требования',
    },
  },
  {
    icon: '⚡',
    title: {
      en: 'Fast & Reliable',
      he: 'מהיר ואמין',
      ar: 'سريع وموثوق',
      ru: 'Быстро и надёжно',
    },
    description: {
      en: 'On-time delivery and professional installation',
      he: 'אספקה בזמן והתקנה מקצועית',
      ar: 'تسليم في الوقت المحدد وتثبيت احترافي',
      ru: 'Доставка в срок и профессиональная установка',
    },
  },
  {
    icon: '💎',
    title: {
      en: 'Premium Materials',
      he: 'חומרים פרימיום',
      ar: 'مواد متميزة',
      ru: 'Премиальные материалы',
    },
    description: {
      en: 'Only the highest quality glass and hardware',
      he: 'רק זכוכית ואביזרים באיכות הגבוהה ביותר',
      ar: 'فقط الزجاج والأجهزة بأعلى جودة',
      ru: 'Только стекло и фурнитура высшего качества',
    },
  },
  {
    icon: '🤝',
    title: {
      en: 'Customer First',
      he: 'הלקוח במקום הראשון',
      ar: 'العميل أولاً',
      ru: 'Клиент на первом месте',
    },
    description: {
      en: 'Your satisfaction is our top priority',
      he: 'שביעות רצונכם היא בראש סדר העדיפויות שלנו',
      ar: 'رضاك هو أولويتنا القصوى',
      ru: 'Ваше удовлетворение — наш главный приоритет',
    },
  },
  {
    icon: '🛡️',
    title: {
      en: 'Warranty Included',
      he: 'כולל אחריות',
      ar: 'الضمان مشمول',
      ru: 'Гарантия включена',
    },
    description: {
      en: 'All our work comes with a comprehensive warranty',
      he: 'כל העבודות שלנו כוללות אחריות מקיפה',
      ar: 'جميع أعمالنا تأتي مع ضمان شامل',
      ru: 'На все работы предоставляется полная гарантия',
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
        ru: 'Премиальные стеклянные решения',
      },
      subtitle: {
        en: 'Transforming Spaces with Elegance',
        he: 'משנים מרחבים באלגנטיות',
        ar: 'تحويل المساحات بأناقة',
        ru: 'Преображаем пространства с элегантностью',
      },
      description: {
        en: 'Professional glass installation services for homes and businesses throughout Israel. From shower enclosures to glass railings, we deliver excellence.',
        he: 'שירותי התקנת זכוכית מקצועיים לבתים ועסקים בכל רחבי ישראל. ממארזי מקלחת ועד מעקות זכוכית, אנו מספקים מצוינות.',
        ar: 'خدمات تركيب الزجاج الاحترافية للمنازل والشركات في جميع أنحاء إسرائيل. من حاويات الدش إلى الدرابزين الزجاجي، نقدم التميز.',
        ru: 'Профессиональные услуги по установке стекла для домов и бизнеса по всему Израилю.',
      },
      cta: {
        en: 'Get Free Quote',
        he: 'קבלו הצעת מחיר חינם',
        ar: 'احصل على عرض أسعار مجاني',
        ru: 'Бесплатная оценка',
      },
    },
    sections: {
      services: {
        title: {
          en: 'Our Services',
          he: 'השירותים שלנו',
          ar: 'خدماتنا',
          ru: 'Наши услуги',
        },
        subtitle: {
          en: 'Comprehensive glass solutions for every need',
          he: 'פתרונות זכוכית מקיפים לכל צורך',
          ar: 'حلول زجاجية شاملة لكل حاجة',
          ru: 'Комплексные стеклянные решения для любых нужд',
        },
      },
      projects: {
        title: {
          en: 'Our Work',
          he: 'העבודות שלנו',
          ar: 'أعمالنا',
          ru: 'Наши работы',
        },
        subtitle: {
          en: 'Browse our portfolio of completed projects',
          he: 'עיינו בתיק העבודות של הפרויקטים שהושלמו',
          ar: 'تصفح معرض أعمالنا المكتملة',
          ru: 'Портфолио выполненных проектов',
        },
      },
      testimonials: {
        title: {
          en: 'What Our Clients Say',
          he: 'מה הלקוחות שלנו אומרים',
          ar: 'ماذا يقول عملاؤنا',
          ru: 'Что говорят наши клиенты',
        },
        subtitle: {
          en: 'Real feedback from satisfied customers',
          he: 'משוב אמיתי מלקוחות מרוצים',
          ar: 'تعليقات حقيقية من عملاء راضين',
          ru: 'Реальные отзывы довольных клиентов',
        },
      },
      whyUs: {
        title: {
          en: 'Why Choose Us',
          he: 'למה לבחור בנו',
          ar: 'لماذا تختارنا',
          ru: 'Почему выбирают нас',
        },
        subtitle: {
          en: 'What sets us apart from the competition',
          he: 'מה מייחד אותנו מהמתחרים',
          ar: 'ما يميزنا عن المنافسة',
          ru: 'Что отличает нас от конкурентов',
        },
      },
    },
  },
  about: {
    title: {
      en: 'About Shwaki Brothers',
      he: 'אודות אחים שווקי',
      ar: 'عن إخوة شواقي',
      ru: 'Об Братьях Шваки',
    },
    subtitle: {
      en: 'Your Trusted Glass Experts Since 2015',
      he: 'מומחי הזכוכית האמינים שלכם מאז 2015',
      ar: 'خبراء الزجاج الموثوقون منذ 2015',
      ru: 'Ваши надёжные эксперты по стеклу с 2015 года',
    },
    story: {
      en: 'Shwaki Brothers Glassworks was founded with a simple vision: to provide the highest quality glass solutions with exceptional customer service. What started as a small family business has grown into one of the most trusted names in glass installation across Israel. Our commitment to craftsmanship, attention to detail, and customer satisfaction has earned us a reputation for excellence.',
      he: 'אחים שווקי עבודות זכוכית הוקמה עם חזון פשוט: לספק פתרונות זכוכית באיכות הגבוהה ביותר עם שירות לקוחות יוצא דופן. מה שהתחיל כעסק משפחתי קטן צמח לאחד השמות האמינים ביותר בהתקנת זכוכית ברחבי ישראל. המחויבות שלנו למלאכת יד, תשומת לב לפרטים ושביעות רצון הלקוחות הקנו לנו מוניטין של מצוינות.',
      ar: 'تأسست إخوة شواقي للزجاج برؤية بسيطة: تقديم حلول زجاجية بأعلى جودة مع خدمة عملاء استثنائية. ما بدأ كشركة عائلية صغيرة نما ليصبح أحد أكثر الأسماء الموثوقة في تركيب الزجاج في جميع أنحاء إسرائيل. التزامنا بالحرفية والاهتمام بالتفاصيل ورضا العملاء أكسبنا سمعة التميز.',
      ru: 'Братья Шваки Стеклянные работы были основаны с простой целью: предоставлять стеклянные решения высочайшего качества с исключительным обслуживанием клиентов. Начав как небольшой семейный бизнес, мы стали одним из самых надёжных имён в установке стекла по всему Израилю. Наша приверженность мастерству, внимание к деталям и удовлетворение клиентов принесли нам репутацию превосходства.',
    },
    stats: [
      {
        value: '500+',
        label: {
          en: 'Projects Completed',
          he: 'פרויקטים שהושלמו',
          ar: 'مشاريع مكتملة',
          ru: 'Выполненных проектов',
        },
      },
      {
        value: '10+',
        label: {
          en: 'Years Experience',
          he: 'שנות ניסיון',
          ar: 'سنوات خبرة',
          ru: 'Лет опыта',
        },
      },
      {
        value: '100%',
        label: {
          en: 'Customer Satisfaction',
          he: 'שביעות רצון לקוחות',
          ar: 'رضا العملاء',
          ru: 'Удовлетворённость клиентов',
        },
      },
    ],
  },
  services: {
    title: {
      en: 'Our Services',
      he: 'השירותים שלנו',
      ar: 'خدماتنا',
      ru: 'Наши услуги',
    },
    subtitle: {
      en: 'Professional glass solutions for every need',
      he: 'פתרונות זכוכית מקצועיים לכל צורך',
      ar: 'حلول زجاجية احترافية لكل حاجة',
      ru: 'Профессиональные стеклянные решения для любых нужд',
    },
  },
  projects: {
    title: {
      en: 'Our Projects',
      he: 'הפרויקטים שלנו',
      ar: 'مشاريعنا',
      ru: 'Наши проекты',
    },
    subtitle: {
      en: 'Explore our portfolio of completed glass installations',
      he: 'חקרו את תיק העבודות של התקנות הזכוכית שהושלמו',
      ar: 'استكشف معرض أعمالنا من تركيبات الزجاج المكتملة',
      ru: 'Портфолио выполненных стеклянных установок',
    },
    allCategories: {
      en: 'All Projects',
      he: 'כל הפרויקטים',
      ar: 'جميع المشاريع',
      ru: 'Все проекты',
    },
    noProjects: {
      en: 'No projects found in this category',
      he: 'לא נמצאו פרויקטים בקטגוריה זו',
      ar: 'لم يتم العثور على مشاريع في هذه الفئة',
      ru: 'Проекты в этой категории не найдены',
    },
  },
  contact: {
    title: {
      en: 'Contact Us',
      he: 'צרו קשר',
      ar: 'اتصل بنا',
      ru: 'Связаться с нами',
    },
    subtitle: {
      en: 'Get in touch for a free consultation',
      he: 'צרו קשר לייעוץ חינם',
      ar: 'تواصل معنا للحصول على استشارة مجانية',
      ru: 'Свяжитесь с нами для бесплатной консультации',
    },
    form: {
      name: {
        en: 'Your Name',
        he: 'שמכם',
        ar: 'اسمك',
        ru: 'Ваше имя',
      },
      email: {
        en: 'Email Address',
        he: 'כתובת אימייל',
        ar: 'عنوان البريد الإلكتروني',
        ru: 'Электронная почта',
      },
      phone: {
        en: 'Phone Number',
        he: 'מספר טלפון',
        ar: 'رقم الهاتف',
        ru: 'Номер телефона',
      },
      service: {
        en: 'Service Interested In',
        he: 'שירות מעניין',
        ar: 'الخدمة المهتم بها',
        ru: 'Интересующая услуга',
      },
      message: {
        en: 'Your Message',
        he: 'ההודעה שלכם',
        ar: 'رسالتك',
        ru: 'Ваше сообщение',
      },
      submit: {
        en: 'Send Message',
        he: 'שלחו הודעה',
        ar: 'إرسال الرسالة',
        ru: 'Отправить сообщение',
      },
      sending: {
        en: 'Sending...',
        he: 'שולח...',
        ar: 'جاري الإرسال...',
        ru: 'Отправка...',
      },
      success: {
        en: 'Message sent successfully! We\'ll get back to you soon.',
        he: 'ההודעה נשלחה בהצלחה! ניצור איתכם קשר בקרוב.',
        ar: 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.',
        ru: 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.',
      },
      error: {
        en: 'Failed to send message. Please try again or call us directly.',
        he: 'שליחת ההודעה נכשלה. אנא נסו שוב או התקשרו אלינו ישירות.',
        ar: 'فشل إرسال الرسالة. يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.',
        ru: 'Не удалось отправить сообщение. Пожалуйста, попробуйте ещё раз или позвоните нам.',
      },
    },
  },
  contractors: {
    title: {
      en: 'For Contractors',
      he: 'לקבלנים',
      ar: 'للمقاولين',
      ru: 'Для подрядчиков',
    },
    subtitle: {
      en: 'Partner with us for your glass installation needs',
      he: 'שתפו איתנו פעולה לצרכי התקנת הזכוכית שלכם',
      ar: 'شاركنا لتلبية احتياجاتك من تركيب الزجاج',
      ru: 'Сотрудничайте с нами для стеклянных работ',
    },
    benefits: [
      {
        title: {
          en: 'Competitive Pricing',
          he: 'מחירים תחרותיים',
          ar: 'أسعار تنافسية',
          ru: 'Конкурентные цены',
        },
        description: {
          en: 'Special rates for ongoing partnerships and bulk orders',
          he: 'תעריפים מיוחדים לשותפויות מתמשכות והזמנות גדולות',
          ar: 'أسعار خاصة للشراكات المستمرة والطلبات بالجملة',
          ru: 'Специальные тарифы для постоянного сотрудничества и оптовых заказов',
        },
      },
      {
        title: {
          en: 'Reliable Scheduling',
          he: 'תזמון אמין',
          ar: 'جدولة موثوقة',
          ru: 'Надёжное планирование',
        },
        description: {
          en: 'We work with your timelines to meet project deadlines',
          he: 'אנו עובדים עם לוחות הזמנים שלכם לעמידה בלוחות זמנים של פרויקטים',
          ar: 'نعمل مع جداولك الزمنية للوفاء بمواعيد المشاريع',
          ru: 'Мы работаем в ваших сроках для соблюдения дедлайнов проектов',
        },
      },
      {
        title: {
          en: 'Quality Guaranteed',
          he: 'איכות מובטחת',
          ar: 'جودة مضمونة',
          ru: 'Гарантия качества',
        },
        description: {
          en: 'Premium materials and expert installation every time',
          he: 'חומרים פרימיום והתקנה מקצועית בכל פעם',
          ar: 'مواد متميزة وتركيب احترافي في كل مرة',
          ru: 'Премиальные материалы и профессиональная установка каждый раз',
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
        ru: 'Главная',
      },
    },
    {
      href: '/services',
      label: {
        en: 'Services',
        he: 'שירותים',
        ar: 'الخدمات',
        ru: 'Услуги',
      },
    },
    {
      href: '/projects',
      label: {
        en: 'Projects',
        he: 'פרויקטים',
        ar: 'المشاريع',
        ru: 'Проекты',
      },
    },
    {
      href: '/about',
      label: {
        en: 'About',
        he: 'אודות',
        ar: 'حول',
        ru: 'О нас',
      },
    },
    {
      href: '/contact',
      label: {
        en: 'Contact',
        he: 'צור קשר',
        ar: 'اتصل',
        ru: 'Контакты',
      },
    },
  ],
  cta: {
    label: {
      en: 'Get Quote',
      he: 'הצעת מחיר',
      ar: 'عرض أسعار',
      ru: 'Оценка',
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
    ru: 'Премиальные стеклянные решения для домов и бизнеса. Обслуживаем весь Израиль с 2015 года.',
  },
  quickLinks: {
    title: {
      en: 'Quick Links',
      he: 'קישורים מהירים',
      ar: 'روابط سريعة',
      ru: 'Быстрые ссылки',
    },
  },
  services: {
    title: {
      en: 'Services',
      he: 'שירותים',
      ar: 'الخدمات',
      ru: 'Услуги',
    },
  },
  contact: {
    title: {
      en: 'Contact',
      he: 'יצירת קשר',
      ar: 'اتصل',
      ru: 'Контакты',
    },
  },
  copyright: {
    en: '© 2024 Shwaki Brothers Glassworks. All rights reserved.',
    he: '© 2024 אחים שווקי עבודות זכוכית. כל הזכויות שמורות.',
    ar: '© 2024 إخوة شواقي للزجاج. جميع الحقوق محفوظة.',
    ru: '© 2024 Братья Шваки Стеклянные работы. Все права защищены.',
  },
  licensedBusiness: {
    en: 'Licensed Sole Proprietor (Osek Morshe)',
    he: 'עוסק מורשה',
    ar: 'صاحب عمل مرخص',
    ru: 'Лицензированный индивидуальный предприниматель',
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
    ru: 'Загрузка...',
  },
  error: {
    en: 'An error occurred',
    he: 'אירעה שגיאה',
    ar: 'حدث خطأ',
    ru: 'Произошла ошибка',
  },
  retry: {
    en: 'Try Again',
    he: 'נסה שוב',
    ar: 'حاول مرة أخرى',
    ru: 'Повторить',
  },
  viewAll: {
    en: 'View All',
    he: 'צפה בכל',
    ar: 'عرض الكل',
    ru: 'Смотреть все',
  },
  learnMore: {
    en: 'Learn More',
    he: 'למידע נוסף',
    ar: 'اعرف المزيد',
    ru: 'Подробнее',
  },
  getQuote: {
    en: 'Get Free Quote',
    he: 'הצעת מחיר חינם',
    ar: 'عرض أسعار مجاني',
    ru: 'Бесплатная оценка',
  },
  callNow: {
    en: 'Call Now',
    he: 'התקשר עכשיו',
    ar: 'اتصل الآن',
    ru: 'Позвонить',
  },
  whatsapp: {
    en: 'WhatsApp Us',
    he: 'שלחו לנו וואטסאפ',
    ar: 'راسلنا على واتساب',
    ru: 'Написать в WhatsApp',
  },
  backToHome: {
    en: 'Back to Home',
    he: 'חזרה לדף הבית',
    ar: 'العودة للرئيسية',
    ru: 'На главную',
  },
  pageNotFound: {
    en: 'Page Not Found',
    he: 'הדף לא נמצא',
    ar: 'الصفحة غير موجودة',
    ru: 'Страница не найдена',
  },
  pageNotFoundMessage: {
    en: 'The page you\'re looking for doesn\'t exist or has been moved.',
    he: 'הדף שאתם מחפשים לא קיים או הועבר.',
    ar: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
    ru: 'Страница, которую вы ищете, не существует или была перемещена.',
  },

  // =========================================================================
  // CTA SECTION STRINGS
  // =========================================================================

  ctaReadyToTransform: {
    en: 'Ready to Transform Your Space?',
    he: 'מוכנים לשנות את המרחב שלכם?',
    ar: 'مستعد لتحويل مساحتك؟',
    ru: 'Готовы преобразить ваше пространство?',
  },
  ctaContactToday: {
    en: 'Contact us today for a free consultation and quote',
    he: 'צרו קשר היום לייעוץ והצעת מחיר ללא עלות',
    ar: 'اتصل بنا اليوم للحصول على استشارة وعرض أسعار مجاني',
    ru: 'Свяжитесь с нами сегодня для бесплатной консультации и расчёта стоимости',
  },
  ctaContactUs: {
    en: 'Contact Us',
    he: 'צרו קשר',
    ar: 'اتصل بنا',
    ru: 'Связаться с нами',
  },

  // About CTA
  ctaReadyToWork: {
    en: 'Ready to Work With Us?',
    he: 'מוכנים לעבוד איתנו?',
    ar: 'مستعد للعمل معنا؟',
    ru: 'Готовы работать с нами?',
  },
  ctaVisionToReality: {
    en: 'Contact us today and let\'s turn your vision into reality',
    he: 'צרו קשר היום ונהפוך את החזון שלכם למציאות',
    ar: 'اتصل بنا اليوم ودعنا نحول رؤيتك إلى واقع',
    ru: 'Свяжитесь с нами сегодня, и мы воплотим ваше видение в реальность',
  },

  // Projects CTA
  ctaHaveProject: {
    en: 'Have a Project in Mind?',
    he: 'יש לכם פרויקט בראש?',
    ar: 'هل لديك مشروع في ذهنك؟',
    ru: 'Есть проект на примете?',
  },
  ctaNoObligation: {
    en: 'We\'d love to hear about your project and provide a no-obligation quote',
    he: 'נשמח לשמוע על הפרויקט שלכם ולספק הצעת מחיר ללא התחייבות',
    ar: 'نحب أن نسمع عن مشروعك ونقدم عرض أسعار بدون التزام',
    ru: 'Мы будем рады узнать о вашем проекте и предоставить расчёт без обязательств',
  },

  // Services CTA
  ctaReadyToStart: {
    en: 'Ready to Get Started?',
    he: 'מוכנים להתחיל?',
    ar: 'مستعد للبدء؟',
    ru: 'Готовы начать?',
  },

  // Contractors CTA
  ctaLetsWorkTogether: {
    en: 'Let\'s Work Together',
    he: 'בואו נעבוד יחד',
    ar: 'دعنا نعمل معاً',
    ru: 'Давайте работать вместе',
  },
  ctaSimpleContact: {
    en: 'Getting in touch is simple - send us a message or call and we\'ll get back to you within 24 hours',
    he: 'יצירת קשר פשוטה - שלחו לנו הודעה או התקשרו ונחזור אליכם תוך 24 שעות',
    ar: 'التواصل بسيط - أرسل لنا رسالة أو اتصل وسنعود إليك خلال 24 ساعة',
    ru: 'Связаться просто — напишите или позвоните, и мы ответим в течение 24 часов',
  },

  // =========================================================================
  // INSTAGRAM STRINGS
  // =========================================================================

  instagramView: {
    en: 'View on Instagram',
    he: 'צפה באינסטגרם',
    ar: 'شاهد على إنستغرام',
    ru: 'Смотреть в Instagram',
  },
  instagramFollow: {
    en: 'Follow Us on Instagram',
    he: 'עקבו אחרינו באינסטגרם',
    ar: 'تابعونا على إنستغرام',
    ru: 'Подписывайтесь на нас в Instagram',
  },

  // =========================================================================
  // PROJECTS PAGE STRINGS
  // =========================================================================

  projectPhotos: {
    en: 'Photos',
    he: 'תמונות',
    ar: 'صور',
    ru: 'Фото',
  },
  projectCategories: {
    en: 'Categories',
    he: 'קטגוריות',
    ar: 'فئات',
    ru: 'Категории',
  },
  projectSatisfaction: {
    en: 'Satisfaction',
    he: 'שביעות רצון',
    ar: 'رضا',
    ru: 'Удовлетворённость',
  },
  projectComingSoon: {
    en: 'Images coming soon. Contact us to discuss your project',
    he: 'תמונות יעלו בקרוב. צרו קשר כדי לדבר על הפרויקט שלכם',
    ar: 'سيتم إضافة الصور قريباً. اتصل بنا للتحدث عن مشروعك',
    ru: 'Изображения появятся в ближайшее время. Свяжитесь с нами, чтобы обсудить ваш проект',
  },
  projectFeatured: {
    en: 'Featured',
    he: 'מומלץ',
    ar: 'مميز',
    ru: 'Избранное',
  },

  // =========================================================================
  // ABOUT PAGE STRINGS
  // =========================================================================

  aboutOurStory: {
    en: 'Our Story',
    he: 'הסיפור שלנו',
    ar: 'قصتنا',
    ru: 'Наша история',
  },
  aboutSince: {
    en: 'Since',
    he: 'מאז',
    ar: 'منذ',
    ru: 'С',
  },
  aboutOwnerTitle: {
    en: 'Owner & Manager',
    he: 'בעלים ומנהל',
    ar: 'المالك والمدير',
    ru: 'Владелец и управляющий',
  },

  // =========================================================================
  // CONTACT PAGE STRINGS
  // =========================================================================

  contactGetInTouch: {
    en: 'Get in Touch',
    he: 'פרטי התקשרות',
    ar: 'معلومات الاتصال',
    ru: 'Свяжитесь с нами',
  },
  contactPhone: {
    en: 'Phone',
    he: 'טלפון',
    ar: 'هاتف',
    ru: 'Телефон',
  },
  contactEmail: {
    en: 'Email',
    he: 'אימייל',
    ar: 'بريد إلكتروني',
    ru: 'Эл. почта',
  },
  contactLocation: {
    en: 'Location',
    he: 'מיקום',
    ar: 'الموقع',
    ru: 'Местоположение',
  },
  contactWorkingHours: {
    en: 'Working Hours',
    he: 'שעות פעילות',
    ar: 'ساعات العمل',
    ru: 'Рабочие часы',
  },
  contactWhatsappMessage: {
    en: 'Message Us on WhatsApp',
    he: 'שלחו הודעה בוואטסאפ',
    ar: 'أرسل رسالة على واتساب',
    ru: 'Напишите нам в WhatsApp',
  },
  contactThankYou: {
    en: 'Thank You!',
    he: 'תודה!',
    ar: 'شكراً!',
    ru: 'Спасибо!',
  },
  contactSendAnother: {
    en: 'Send Another Message',
    he: 'שלחו הודעה נוספת',
    ar: 'أرسل رسالة أخرى',
    ru: 'Отправить ещё сообщение',
  },
  contactSendMessage: {
    en: 'Send Us a Message',
    he: 'שלחו לנו הודעה',
    ar: 'أرسل لنا رسالة',
    ru: 'Напишите нам',
  },
  contactSelectService: {
    en: 'Select a service',
    he: 'בחרו שירות',
    ar: 'اختر خدمة',
    ru: 'Выберите услугу',
  },

  // =========================================================================
  // SERVICES PROCESS STRINGS
  // =========================================================================

  processStep: {
    en: 'Step',
    he: 'שלב',
    ar: 'الخطوة',
    ru: 'Шаг',
  },
  processHowWeWork: {
    en: 'How We Work',
    he: 'איך אנחנו עובדים',
    ar: 'كيف نعمل',
    ru: 'Как мы работаем',
  },
  processSimple: {
    en: 'Simple and transparent process from start to finish',
    he: 'תהליך פשוט ושקוף מההתחלה ועד הסוף',
    ar: 'عملية بسيطة وشفافة من البداية إلى النهاية',
    ru: 'Простой и прозрачный процесс от начала до конца',
  },
  processFreeQuote: {
    en: 'Get a Free Quote',
    he: 'קבלו הצעת מחיר חינם',
    ar: 'احصل على عرض أسعار مجاني',
    ru: 'Получите бесплатный расчёт',
  },

  // =========================================================================
  // CONTRACTORS PAGE STRINGS
  // =========================================================================

  contractorsBadge: {
    en: 'Business Partners',
    he: 'שותפים עסקיים',
    ar: 'شركاء الأعمال',
    ru: 'Деловые партнёры',
  },
  contractorsSendEmail: {
    en: 'Send Email',
    he: 'שלחו אימייל',
    ar: 'أرسل بريداً إلكترونياً',
    ru: 'Отправить письмо',
  },
  contractorsWhyWork: {
    en: 'Why Work With Us',
    he: 'למה לעבוד איתנו',
    ar: 'لماذا تعمل معنا',
    ru: 'Почему стоит работать с нами',
  },
  contractorsUnderstand: {
    en: 'We understand the needs of contractors and architects',
    he: 'אנו מבינים את הצרכים של קבלנים ואדריכלים',
    ar: 'نحن نفهم احتياجات المقاولين والمهندسين المعماريين',
    ru: 'Мы понимаем потребности подрядчиков и архитекторов',
  },
  contractorsOurServices: {
    en: 'Our Services for Contractors',
    he: 'השירותים שלנו לקבלנים',
    ar: 'خدماتنا للمقاولين',
    ru: 'Наши услуги для подрядчиков',
  },
  contractorsSendDrawings: {
    en: 'Send us your drawings and specifications for a quote',
    he: 'שלחו לנו את השרטוטים והמפרטים שלכם לקבלת הצעת מחיר',
    ar: 'أرسل لنا رسوماتك ومواصفاتك للحصول على عرض أسعار',
    ru: 'Отправьте нам чертежи и спецификации для расчёта стоимости',
  },
  contractorsWhatsappMessage: {
    en: 'Hello, I am a contractor and would like to discuss partnership',
    he: 'שלום, אני קבלן ומעוניין לדבר על שיתוף פעולה',
    ar: 'مرحباً، أنا مقاول وأود التحدث عن التعاون',
    ru: 'Здравствуйте, я подрядчик и хотел бы обсудить сотрудничество',
  },
  contractorsEmailSubject: {
    en: 'Business Partner Inquiry',
    he: 'פנייה משותף עסקי',
    ar: 'استفسار من شريك تجاري',
    ru: 'Запрос от делового партнёра',
  },

  // =========================================================================
  // MOBILE CTA STRINGS
  // =========================================================================

  mobileCTACall: {
    en: 'Call Now',
    he: 'התקשר עכשיו',
    ar: 'اتصل الآن',
    ru: 'Позвонить',
  },

  // =========================================================================
  // HERO / HEADER STRINGS
  // =========================================================================

  heroViewWork: {
    en: 'View Our Work',
    he: 'צפו בעבודות',
    ar: 'شاهد أعمالنا',
    ru: 'Смотреть работы',
  },
  heroLocation: {
    en: 'Jerusalem, Israel',
    he: 'ירושלים, ישראל',
    ar: 'القدس، إسرائيل',
    ru: 'Иерусалим, Израиль',
  },
  heroServingAll: {
    en: 'Serving all of Israel',
    he: 'משרתים את כל ישראל',
    ar: 'نخدم جميع أنحاء إسرائيل',
    ru: 'Обслуживаем всю территорию Израиля',
  },
  headerSelectLanguage: {
    en: 'Select Language',
    he: 'בחר שפה',
    ar: 'اختر اللغة',
    ru: 'Выбрать язык',
  },
  headerCallShort: {
    en: 'Call',
    he: 'התקשר',
    ar: 'اتصل',
    ru: 'Позвонить',
  },
} as const;

// =============================================================================
// HELPER FUNCTION
// =============================================================================

export type SupportedLocale = 'en' | 'he' | 'ar' | 'ru';

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

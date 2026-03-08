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

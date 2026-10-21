/**
 * FAQ content — server-safe. Indexed by the site search and used to ground AI
 * answers; shown on the home page (with its FAQPage JSON-LD) only while
 * SHOW_FAQ_SECTIONS (src/data/site-features.ts) is on.
 */
import type { LocalizedText, SupportedLocale } from './types';

export interface FaqItem {
  question: LocalizedText;
  answer: LocalizedText;
}

export const HOME_FAQ_CONTENT: {
  sectionTitle: LocalizedText;
  sectionSubtitle: LocalizedText;
  faqs: FaqItem[];
} = {
  sectionTitle: {
    en: 'Frequently Asked Questions',
    he: 'שאלות נפוצות',
    ar: 'الأسئلة الشائعة',
    ru: 'Часто задаваемые вопросы',
  },
  sectionSubtitle: {
    en: 'Everything you need to know about our glass installation services',
    he: 'כל מה שצריך לדעת על שירותי התקנת הזכוכית שלנו',
    ar: 'كل ما تحتاج معرفته عن خدمات تركيب الزجاج لدينا',
    ru: 'Всё, что нужно знать о наших услугах по установке стекла',
  },
  faqs: [
    {
      question: {
        en: 'How much does glass installation cost in Israel?',
        he: 'כמה עולה התקנת זכוכית בישראל?',
        ar: 'كم تكلفة تركيب الزجاج في إسرائيل؟',
        ru: 'Сколько стоит установка стекла в Израиле?',
      },
      answer: {
        en: 'Glass installation costs vary based on type, size, and complexity. Shower enclosures typically range from ₪3,000-15,000, glass railings from ₪1,200-2,500 per meter, and mirror walls from ₪800-2,000 per sqm. We offer free on-site measurements and detailed quotes with no obligation.',
        he: 'עלות התקנת זכוכית משתנה בהתאם לסוג, גודל ומורכבות. מקלחונים נעים בדרך כלל בין ₪3,000-15,000, מעקות זכוכית בין ₪1,200-2,500 למטר, וקירות מראה בין ₪800-2,000 למ"ר. אנו מציעים מדידות חינם באתר והצעות מחיר מפורטות ללא התחייבות.',
        ar: 'تختلف تكاليف تركيب الزجاج حسب النوع والحجم والتعقيد. تتراوح حواجز الدش عادة بين 3,000-15,000 شيكل، والدرابزين الزجاجي بين 1,200-2,500 شيكل للمتر، وجدران المرايا بين 800-2,000 شيكل للمتر المربع. نقدم قياسات مجانية في الموقع وعروض أسعار مفصلة بدون التزام.',
        ru: 'Стоимость установки стекла зависит от типа, размера и сложности. Душевые кабины обычно стоят от 3,000 до 15,000 ₪, стеклянные перила — от 1,200 до 2,500 ₪ за метр, зеркальные стены — от 800 до 2,000 ₪ за кв.м. Мы предлагаем бесплатные замеры на месте и детальные сметы без обязательств.',
      },
    },
    {
      question: {
        en: 'How long does glass installation take?',
        he: 'כמה זמן לוקחת התקנת זכוכית?',
        ar: 'كم من الوقت يستغرق تركيب الزجاج؟',
        ru: 'Сколько времени занимает установка стекла?',
      },
      answer: {
        en: 'Most residential glass installations are completed in 1-2 days. After measurement, custom glass production takes 3-5 business days. The actual installation typically takes a few hours to a full day depending on complexity. We provide exact timelines during the consultation.',
        he: 'רוב התקנות הזכוכית הביתיות מסתיימות תוך 1-2 ימים. לאחר המדידה, ייצור זכוכית מותאמת אישית לוקח 3-5 ימי עסקים. ההתקנה עצמה לוקחת בדרך כלל מספר שעות עד יום מלא בהתאם למורכבות. אנו מספקים לוחות זמנים מדויקים במהלך הייעוץ.',
        ar: 'يتم إنجاز معظم تركيبات الزجاج السكنية في 1-2 يوم. بعد القياس، يستغرق إنتاج الزجاج المخصص 3-5 أيام عمل. يستغرق التركيب الفعلي عادة بضع ساعات إلى يوم كامل حسب التعقيد. نقدم جداول زمنية دقيقة خلال الاستشارة.',
        ru: 'Большинство бытовых установок стекла выполняются за 1-2 дня. После замера изготовление стекла на заказ занимает 3-5 рабочих дней. Сама установка обычно занимает от нескольких часов до полного дня в зависимости от сложности. Мы предоставляем точные сроки во время консультации.',
      },
    },
    {
      question: {
        en: 'What type of glass is best for shower enclosures?',
        he: 'איזה סוג זכוכית הכי טוב למקלחונים?',
        ar: 'ما هو أفضل نوع زجاج لحواجز الدش؟',
        ru: 'Какое стекло лучше для душевых кабин?',
      },
      answer: {
        en: 'We recommend 8mm-10mm tempered (safety) glass for shower enclosures. Tempered glass is 4-5 times stronger than regular glass and breaks into small, less harmful pieces if shattered. For added privacy, frosted or patterned glass options are available. All our shower glass meets Israeli safety standards.',
        he: 'אנו ממליצים על זכוכית מחוסמת (בטיחותית) בעובי 8-10 מ"מ למקלחונים. זכוכית מחוסמת חזקה פי 4-5 מזכוכית רגילה ומתפוררת לחתיכות קטנות ופחות מסוכנות במקרה של שבירה. לפרטיות נוספת, קיימות אפשרויות לזכוכית חלבית או מעוטרת. כל זכוכית המקלחונים שלנו עומדת בתקנים הישראליים.',
        ar: 'نوصي بالزجاج المقسى (الآمن) بسماكة 8-10 ملم لحواجز الدش. الزجاج المقسى أقوى 4-5 مرات من الزجاج العادي وينكسر إلى قطع صغيرة أقل ضرراً في حالة التحطم. لمزيد من الخصوصية، تتوفر خيارات الزجاج المصنفر أو المنقوش. جميع زجاج الدش لدينا يلبي المعايير الإسرائيلية.',
        ru: 'Для душевых кабин мы рекомендуем закалённое (безопасное) стекло толщиной 8-10 мм. Закалённое стекло в 4-5 раз прочнее обычного и при разрушении распадается на мелкие, менее опасные осколки. Для дополнительной приватности доступны матовое или узорчатое стекло. Всё наше душевое стекло соответствует израильским стандартам безопасности.',
      },
    },
    {
      question: {
        en: 'Do you offer a warranty on glass installations?',
        he: 'האם אתם מציעים אחריות על התקנות זכוכית?',
        ar: 'هل تقدمون ضمان على تركيبات الزجاج؟',
        ru: 'Предоставляете ли вы гарантию на установку стекла?',
      },
      answer: {
        en: 'Yes! All our glass installations come with a 2-year warranty covering workmanship and hardware. This includes hinges, handles, seals, and installation quality. The glass itself carries a manufacturer warranty. We stand behind our work and respond promptly to any warranty claims.',
        he: 'כן! כל התקנות הזכוכית שלנו מגיעות עם אחריות לשנתיים המכסה עבודה וחומרים. זה כולל צירים, ידיות, איטום ואיכות ההתקנה. הזכוכית עצמה מגיעה עם אחריות יצרן. אנו עומדים מאחורי העבודה שלנו ומגיבים במהירות לכל תביעת אחריות.',
        ar: 'نعم! جميع تركيبات الزجاج لدينا تأتي مع ضمان لمدة سنتين يغطي جودة العمل والأجهزة. يشمل ذلك المفصلات والمقابض والأختام وجودة التركيب. الزجاج نفسه يحمل ضمان الشركة المصنعة. نحن نقف وراء عملنا ونستجيب بسرعة لأي مطالبات ضمان.',
        ru: 'Да! На все наши стеклянные конструкции предоставляется 2-летняя гарантия на работу и фурнитуру. Это включает петли, ручки, уплотнители и качество монтажа. На само стекло действует гарантия производителя. Мы отвечаем за свою работу и оперативно реагируем на гарантийные обращения.',
      },
    },
    {
      question: {
        en: 'Do you serve all areas in Israel?',
        he: 'האם אתם עובדים בכל רחבי ישראל?',
        ar: 'هل تخدمون جميع المناطق في إسرائيل؟',
        ru: 'Вы работаете по всему Израилю?',
      },
      answer: {
        en: 'Yes, we provide glass installation services nationwide across Israel. Our team regularly works in Jerusalem, Tel Aviv, Haifa, Beersheba, Netanya, and surrounding areas. Free consultations and measurements are available throughout the country. Contact us to confirm service availability in your area.',
        he: 'כן, אנו מספקים שירותי התקנת זכוכית בכל רחבי ישראל. הצוות שלנו עובד באופן קבוע בירושלים, תל אביב, חיפה, באר שבע, נתניה ובאזורים הסמוכים. ייעוץ ומדידות חינם זמינים בכל הארץ. צרו קשר לאימות זמינות השירות באזורכם.',
        ar: 'نعم، نقدم خدمات تركيب الزجاج في جميع أنحاء إسرائيل. يعمل فريقنا بانتظام في القدس وتل أبيب وحيفا وبئر السبع ونتانيا والمناطق المحيطة. الاستشارات والقياسات المجانية متاحة في جميع أنحاء البلاد. اتصل بنا للتأكد من توفر الخدمة في منطقتك.',
        ru: 'Да, мы предоставляем услуги по установке стекла по всему Израилю. Наша команда регулярно работает в Иерусалиме, Тель-Авиве, Хайфе, Беэр-Шеве, Нетании и окрестностях. Бесплатные консультации и замеры доступны по всей стране. Свяжитесь с нами для подтверждения доступности услуг в вашем районе.',
      },
    },
    {
      question: {
        en: 'Can I get a free quote without commitment?',
        he: 'האם אפשר לקבל הצעת מחיר חינם ללא התחייבות?',
        ar: 'هل يمكنني الحصول على عرض سعر مجاني بدون التزام؟',
        ru: 'Могу ли я получить бесплатную смету без обязательств?',
      },
      answer: {
        en: 'Absolutely! We offer free on-site consultations and measurements with no obligation. Our expert will visit your location, assess your needs, take precise measurements, and provide a detailed quote within 24-48 hours. There\'s no pressure to proceed - you can take your time to decide.',
        he: 'בהחלט! אנו מציעים ייעוץ ומדידות חינם באתר ללא התחייבות. המומחה שלנו יבקר במיקומכם, יעריך את הצרכים, יבצע מדידות מדויקות ויספק הצעת מחיר מפורטת תוך 24-48 שעות. אין לחץ להמשיך - תוכלו לקחת את הזמן להחליט.',
        ar: 'بالتأكيد! نقدم استشارات وقياسات مجانية في الموقع بدون التزام. سيقوم خبيرنا بزيارة موقعك، وتقييم احتياجاتك، وأخذ قياسات دقيقة، وتقديم عرض سعر مفصل خلال 24-48 ساعة. لا يوجد ضغط للمتابعة - يمكنك أخذ وقتك للقرار.',
        ru: 'Конечно! Мы предлагаем бесплатные выездные консультации и замеры без обязательств. Наш специалист посетит ваш объект, оценит потребности, произведёт точные замеры и предоставит детальную смету в течение 24-48 часов. Никакого давления — вы можете не торопиться с решением.',
      },
    },
  ],
}

// Additional FAQs injected for SEO
const ADDITIONAL_FAQS: FaqItem[] = [
  {
    question: {
      en: 'What is the standard glass thickness for a shower enclosure?',
      he: 'מהו עובי הזכוכית הסטנדרטי למקלחון?',
      ar: 'ما هو سمك الزجاج القياسي لحاجز الدش؟',
      ru: 'Какова стандартная толщина стекла для душевой кабины?',
    },
    answer: {
      en: 'The industry standard for high-quality frameless shower enclosures is 8mm to 10mm tempered safety glass. This thickness provides the perfect balance of structural integrity, safety, and a premium luxury feel while remaining elegant.',
      he: 'התקן בתעשייה למקלחונים יוקרתיים ללא מסגרת הוא זכוכית מחוסמת בעובי 8 מ"מ עד 10 מ"מ. עובי זה מספק את האיזון המושלם של חוזק מבני, בטיחות ותחושת יוקרה תוך שמירה על מראה אלגנטי.',
      ar: 'المعيار الصناعي لحواجز الدش الفاخرة بدون إطار هو زجاج أمان مقسى بسمك 8 ملم إلى 10 ملم.',
      ru: 'Отраслевой стандарт для высококачественных безрамных душевых кабин — это закалённое безопасное стекло толщиной от 8 до 10 мм.',
    },
  },
  {
    question: {
      en: 'Are frameless glass railings safe for high balconies?',
      he: 'האם מעקות זכוכית ללא מסגרת בטוחים למרפסות גבוהות?',
      ar: 'هل الدرابزين الزجاجي بدون إطار آمن للشرفات العالية؟',
      ru: 'Безопасны ли безрамные стеклянные перила для высоких балконов?',
    },
    answer: {
      en: 'Absolutely. All our exterior and balcony glass railings use thick laminated tempered safety glass (usually 12mm- 16mm or more) approved by Israeli engineering standards. They are designed to withstand extreme wind loads and impact forces.',
      he: 'בהחלט. כל מעקות הזכוכית החיצוניים שלנו למרפסות משתמשים בזכוכית בטיחות מחוסמת רבודה עבה (בדרך כלל 12 מ"מ - 16 מ"מ ויותר) המאושרים על ידי תקינה ישראלית. הם מתוכננים לעמוד בעומסי רוח חזקים ובפגיעות.',
      ar: 'بالتأكيد. تستخدم جميع درابزينات الزجاج الخارجية لدينا زجاج أمان مقسى سميك ومعتمد.',
      ru: 'Абсолютно. Во всех наших внешних стеклянных перилах используется толстое ламинированное закаленное стекло (обычно 12-16 мм и более), одобренное израильскими инженерными стандартами.',
    },
  },
  {
    question: {
      en: 'How do I clean and maintain my glass shower doors?',
      he: 'איך אני מנקה ומתחזק את דלתות המקלחון שלי?',
      ar: 'كيف أنظف وأحافظ على أبواب الاستحمام الزجاجية؟',
      ru: 'Как мне чистить и обслуживать стеклянные двери душа?',
    },
    answer: {
      en: 'For daily maintenance, we recommend using a simple squeegee after showering to prevent water spots and limescale buildup. For deeper cleaning, use a non-abrasive glass cleaner or a mixture of white vinegar and water. Avoid harsh scrubbing pads that can scratch the glass or ruin protective coatings.',
      he: 'לתחזוקה יומיומית, אנו ממליצים להשתמש במגב קטן לאחר המקלחת כדי למנוע היווצרות אבנית וכתמי מים. לניקוי יסודי יותר, השתמשו במנקה חלונות עדין או בתערובת של חומץ ומים. הימנעו מספוגים גסים שעלולים לשרוט את הזכוכית.',
      ar: 'للصيانة اليومية، نوصي باستخدام ممسحة بسيطة بعد الاستحمام لمنع بقع الماء وتراكم الترسبات الكلسية.',
      ru: 'Для ежедневного ухода мы рекомендуем использовать скребок после душа, чтобы предотвратить появление пятен от воды и известкового налета.',
    },
  },
  {
    question: {
      en: 'Do you design custom mirrors for commercial gyms and dance studios?',
      he: 'האם אתם מעצבים מראות בהתאמה אישית לחדרי כושר וסטודיו לריקוד?',
      ar: 'هل تصممون مرايا مخصصة للصالات الرياضية التجارية واستوديوهات الرقص؟',
      ru: 'Вы проектируете зеркала на заказ для коммерческих спортзалов и танцевальных студий?',
    },
    answer: {
      en: 'Yes, we specialize in large-format commercial mirror installations. Our mirrors are installed with heavy-duty safety backing and precise J-channels or standoffs, ensuring zero distortion and making them perfect for gyms, dance studios, and retail boutiques.',
      he: 'כן, אנו מתמחים בהתקנת מראות מסחריות בפורמט גדול. המראות שלנו מותקנות עם גיבוי בטיחותי ופרופילים מדויקים המבטיחים אפס עיוות, מה שהופך אותן למושלמות עבור חדרי כושר, סטודיו לריקוד ובוטיקים.',
      ar: 'نعم، نحن متخصصون في تركيب المرايا التجارية ذات التنسيق الكبير.',
      ru: 'Да, мы специализируемся на установке широкоформатных коммерческих зеркал.',
    },
  },
  {
    question: {
      en: 'Emergency Services: Do you replace broken storefront glass on the same day?',
      he: 'שירותי חירום: האם אתם מחליפים זכוכית חלון ראווה שבורה באותו היום?',
      ar: 'خدمات الطوارئ: هل تستبدلون زجاج واجهة المتجر المكسور في نفس اليوم؟',
      ru: 'Аварийные службы: вы меняете разбитое стекло витрины в тот же день?',
    },
    answer: {
      en: 'We prioritize commercial emergencies and aim to board up or replace broken storefront glass as quickly as possible. Same-day service depends on the type of glass and sizing availability. If custom fabrication is needed, we will secure the premises immediately and install the final glass within days.',
      he: 'אנו נותנים עדיפות למקרי חירום מסחריים ושואפים לאטום או להחליף חלונות ראווה שבורים מהר ככל האפשר. שירות באותו יום תלוי בסוג הזכוכית והמידות הזמינות. אם נדרש ייצור מיוחד, נאבטח את המקום מיד ונתקין את הזכוכית הסופית תוך מספר ימים.',
      ar: 'نحن نعطي الأولوية لحالات الطوارئ التجارية ونهدف إلى استبدال زجاج واجهات المتاجر المكسور في أسرع وقت ممكن.',
      ru: 'Мы отдаем приоритет коммерческим чрезвычайным ситуациям и стремимся как можно быстрее закрыть или заменить разбитое стекло витрины.',
    },
  },
  {
    question: {
      en: 'Can you install glass partitions in an active office environment?',
      he: 'האם ניתן להתקין מחיצות זכוכית בסביבת משרד פעילה?',
      ar: 'هل يمكنكم تركيب قواطع زجاجية في بيئة مكتبية نشطة؟',
      ru: 'Можете ли вы установить стеклянные перегородки в активной офисной среде?',
    },
    answer: {
      en: 'Yes, we have extensive experience working in corporate environments. Our installers are quiet, clean, and minimize disruption. We can also schedule installations after hours or over the weekend for large projects like conference room partitions to ensure zero downtime for your business.',
      he: 'כן, יש לנו ניסיון רב בעבודה בסביבות תאגידיות. המתקינים שלנו שקטים, נקיים ומצמצמים הפרעות. אנו גם יכולים לתזמן התקנות לאחר שעות הפעילות או בסופי שבוע עבור פרויקטים גדולים, כדי להבטיח אפס זמני השבתה עבור העסק שלך.',
      ar: 'نعم، لدينا خبرة واسعة في العمل في بيئات الشركات. يمكننا أيضًا جدولة التركيبات بعد ساعات العمل.',
      ru: 'Да, у нас большой опыт работы в корпоративной среде. Монтажники работают тихо и чисто. Мы также можем запланировать установку в нерабочее время.',
    },
  },
  {
    question: {
      en: 'What is the difference between laminated acoustic glass and regular glass?',
      he: 'מה ההבדל בין זכוכית רבודה אקוסטית לזכוכית רגילה?',
      ar: 'ما الفرق بين الزجاج الصوتي الرقائقي والزجاج العادي؟',
      ru: 'В чем разница между многослойным акустическим стеклом и обычным стеклом?',
    },
    answer: {
      en: 'Laminated acoustic glass consists of two panes of glass bonded closely together with a specialized sound-dampening interlayer (PVB). It significantly reduces noise transmission, making it the premier choice for busy street-facing windows, soundproof meeting rooms, and high-end residential bedrooms.',
      he: 'זכוכית אקוסטית רבודה מורכבת משני לוחות זכוכית המחוברים יחד עם שכבת ביניים מיוחדת בולמת רעשים (PVB). היא מפחיתה משמעותית את מעבר הרעש, מה שהופך אותה לבחירה המובילה לחלונות הפונים לרחובות סואנים, חדרי ישיבות אטומים לקול, וחדרי שינה יוקרתיים.',
      ar: 'يتكون الزجاج الصوتي المصفح من لوحين من الزجاج ملتصقين معاً بطبقة داخلية لعزل الصوت.',
      ru: 'Ламинированное акустическое стекло состоит из двух стекол, скрепленных вместе со специальным звукопоглощающим слоем (PVB).',
    },
  },
  {
    question: {
      en: 'Are your glass fittings and hardware rust-proof?',
      he: 'האם חלקי הפרזול והצירים שלכם עמידים בפני חלודה?',
      ar: 'هل تركيبات الزجاج والأجهزة لديكم مقاومة للصدأ؟',
      ru: 'Является ли ваша фурнитура из стекла устойчивой к ржавчине?',
    },
    answer: {
      en: 'Yes. We specifically use premium marine-grade stainless steel (304 or 316) and solid brass hardware engineered specifically for wet environments like bathrooms, coastal balconies, and outdoor pool enclosures, ensuring lifelong resistance to rust and corrosion.',
      he: 'כן. אנו משתמשים במדויק בציוד פרימיום כמו נירוסטה ברמה ימית (304 או 316) ופליז מלא אשר מתוכננים במיוחד לסביבות רטובות כגון חדרי אמבטיה, מרפסות על הים, ומעטפות בריכה חיצוניות, מה שמבטיח עמידות של שנים בפני חלודה וקורוזיה.',
      ar: 'نعم. نستخدم الفولاذ المقاوم للصدأ عالي الجودة والأجهزة النحاسية الصلبة.',
      ru: 'Да. Мы используем высококачественную нержавеющую сталь (304 или 316) и прочную латунную фурнитуру.',
    },
  },
  {
    question: {
      en: 'Do you offer tinted or frosted glass options?',
      he: 'האם אתם מציעים אפשרויות לזכוכית כהה או חלבית?',
      ar: 'هل تقدمون خيارات زجاج ملون أو مصنفر؟',
      ru: 'Предлагаете ли вы тонированные или матовые варианты стекла?',
    },
    answer: {
      en: 'We offer a wide variety of architectural glass finishes. Options include acid-etched (frosted) for privacy, bronze or grey tinted glass to control glare and UV exposure, low-iron ultra-clear glass for museums and luxury displays, and digitally printed custom textured glass.',
      he: 'אנו מציעים מגוון רחב של גימורים לזכוכית אדריכלית. האפשרויות כוללות זכוכית חלבית (מותזת חומצה) לפרטיות, זכוכית כהה בארד או אפור לשליטה בסנוור ובקרינת השמש, זכוכית קליר (דלת ברזל) שקופה במיוחד למוזיאונים ותצוגות יוקרה, וזכוכית מודפסת דיגיטלית בטקסטורה אישית.',
      ar: 'نقدم مجموعة متنوعة من تشطيبات الزجاج المعماري، بما في ذلك المصنفر للخصوصية والزجاج الملون بألوان البرونز أو الرمادي.',
      ru: 'Мы предлагаем широкий выбор отделки архитектурного стекла, включая матовое, тонированное под бронзу или серое стекло.',
    },
  },
];

HOME_FAQ_CONTENT.faqs = [...HOME_FAQ_CONTENT.faqs, ...ADDITIONAL_FAQS];


/** Additional general Q&A (warranty, standards, framed vs frameless). */
export const GENERAL_FAQ: Record<SupportedLocale, { q: string; a: string }[]> = {
  he: [
    { q: 'כמה עולה התקנת מקלחון זכוכית?', a: 'מחיר מקלחון זכוכית תלוי בגודל, סוג הזכוכית והפרזול. אחים שוואקי מציעים מדידה חינם והצעת מחיר מותאמת אישית ללא עלות.' },
    { q: 'האם אתם מותקנים בכל הארץ?', a: 'כן, אחים שוואקי מציעים שירות בכל ישראל – ירושלים, תל אביב, חיפה, באר שבע, נתניה ועוד.' },
    { q: 'מה ההבדל בין זכוכית מחוסמת לרגילה?', a: 'זכוכית מחוסמת חזקה פי 4-5 מזכוכית רגילה ומתפוררת לרסיסים קטנים כשנשברת – בטוחה יותר ונדרשת בתקן ישראלי למקלחונים ומעקות.' },
    { q: 'כמה זמן לוקחת ההתקנה?', a: 'רוב התקנות הזכוכית הביתיות מסתיימות תוך 1-2 ימים. לאחר המדידה, ייצור זכוכית מותאמת אישית לוקח 3-5 ימי עסקים. ההתקנה עצמה לוקחת בדרך כלל מספר שעות עד יום מלא בהתאם למורכבות. אנו מספקים לוחות זמנים מדויקים במהלך הייעוץ.' },
    { q: 'האם יש אחריות על ההתקנה?', a: 'כן, אחים שוואקי מציעים אחריות מלאה של שנתיים על חומרים ועבודה על כל ההתקנות.' },
    { q: 'מה ההבדל בין מקלחון עם מסגרת למקלחון ללא מסגרת?', a: 'מקלחון ללא מסגרת משתמש בזכוכית עבה יותר (בדרך כלל 8-10 מ"מ) עם פרזול מינימלי, ונראה נקי יותר וקל יותר לניקוי. מקלחון עם מסגרת משתמש בזכוכית דקה יותר התלויה על מסגרת אלומיניום – עולה פחות אך עם קצוות מתכת גלויים.' },
    { q: 'איך בוחרים זגג מקצועי בישראל?', a: 'חשוב לבדוק שימוש בזכוכית בטיחות בתקן ישראלי (ת"י 1226), מדידה חינם בשטח, אחריות בכתב, וביקורות לקוחות מאומתות.' },
  ],
  en: [
    { q: 'How much does glass shower installation cost in Israel?', a: 'The cost depends on size, glass type, and hardware. Shwaki Brothers offer a free on-site measurement and personalized quote at no charge.' },
    { q: 'Do you serve all of Israel?', a: 'Yes, Shwaki Brothers serve the entire country — Jerusalem, Tel Aviv, Haifa, Beer Sheva, Netanya, and all other cities.' },
    { q: 'What is the difference between tempered and regular glass?', a: 'Tempered glass is 4–5× stronger than regular glass and crumbles into small rounded pieces when broken — required by Israeli building code for showers and railings.' },
    { q: 'How long does glass installation take?', a: 'Most residential glass installations are completed in 1-2 days. After measurement, custom glass production takes 3-5 business days. The actual installation typically takes a few hours to a full day depending on complexity. We provide exact timelines during the consultation.' },
    { q: 'Is there a warranty on installations?', a: 'Yes, Shwaki Brothers provide a full 2-year warranty on all materials and workmanship.' },
    { q: 'What is the difference between a frameless and a framed shower enclosure?', a: 'A frameless enclosure uses thicker glass (typically 8-10mm) held by minimal hardware, giving a cleaner look and easier cleaning. A framed enclosure uses thinner glass supported by an aluminum frame, which costs less but has visible metal edges.' },
    { q: 'How do I choose a glass installer in Israel?', a: 'Check for certified safety glass meeting Israeli standard SI 1226, a free on-site measurement, a written warranty, and verified customer reviews.' },
  ],
  ar: [
    { q: 'كم تكلفة تركيب كابينة الدش الزجاجية في إسرائيل؟', a: 'التكلفة تعتمد على الحجم ونوع الزجاج والمعدات. إخوة شواكي يقدمون قياسًا مجانيًا وعرض سعر مخصصًا بدون أي رسوم.' },
    { q: 'هل تخدمون جميع أنحاء إسرائيل؟', a: 'نعم، إخوة شواكي يخدمون جميع أنحاء البلاد — القدس، تل أبيب، حيفا، بئر السبع، ونتانيا وسائر المدن.' },
    { q: 'ما الفرق بين الزجاج المقسى والزجاج العادي؟', a: 'الزجاج المقسى أقوى 4-5 مرات من الزجاج العادي ويتفتت إلى قطع صغيرة مستديرة عند الكسر — وهو مطلوب بموجب قانون البناء الإسرائيلي للدش والدرابزين.' },
    { q: 'كم يستغرق تركيب الزجاج؟', a: 'يتم إنجاز معظم تركيبات الزجاج السكنية في 1-2 يوم. بعد القياس، يستغرق إنتاج الزجاج المخصص 3-5 أيام عمل. يستغرق التركيب الفعلي عادة بضع ساعات إلى يوم كامل حسب التعقيد. نقدم جداول زمنية دقيقة خلال الاستشارة.' },
    { q: 'هل يوجد ضمان على التركيب؟', a: 'نعم، إخوة شواكي يقدمون ضمانًا كاملًا لمدة سنتين على جميع المواد والعمالة.' },
    { q: 'ما الفرق بين مقصورة دش بدون برواز ومقصورة بإطار؟', a: 'المقصورة بدون برواز تستخدم زجاجاً أثخن (8-10 مم عادة) بتركيبات قليلة، فتبدو أنظف وأسهل في التنظيف. المقصورة بإطار تستخدم زجاجاً أرق محمولاً على إطار ألمنيوم، وتكلفتها أقل لكن حوافها المعدنية ظاهرة.' },
    { q: 'كيف أختار زجّاجًا محترفًا في إسرائيل؟', a: 'تحقق من استخدام زجاج أمان معتمد بالمواصفة الإسرائيلية SI 1226، وقياس مجاني في الموقع، وضمان مكتوب، وتقييمات عملاء موثقة.' },
  ],
  ru: [
    { q: 'Сколько стоит установка стеклянной душевой кабины в Израиле?', a: 'Стоимость зависит от размера, типа стекла и фурнитуры. Братья Шваки предлагают бесплатный выезд для замера и персональное коммерческое предложение.' },
    { q: 'Вы обслуживаете всю территорию Израиля?', a: 'Да, Братья Шваки работают по всей стране — Иерусалим, Тель-Авив, Хайфа, Беэр-Шева, Нетания и все остальные города.' },
    { q: 'В чём разница между закалённым и обычным стеклом?', a: 'Закалённое стекло в 4–5 раз прочнее обычного и при разрушении рассыпается на мелкие округлые осколки. Обязательно по израильскому строительному стандарту для душевых и ограждений.' },
    { q: 'Сколько времени занимает установка?', a: 'Большинство бытовых установок стекла выполняются за 1-2 дня. После замера изготовление стекла на заказ занимает 3-5 рабочих дней. Сама установка обычно занимает от нескольких часов до полного дня в зависимости от сложности. Мы предоставляем точные сроки во время консультации.' },
    { q: 'Есть ли гарантия на установку?', a: 'Да, Братья Шваки предоставляют полную гарантию 2 года на материалы и работу.' },
    { q: 'В чём разница между душевой кабиной без рамы и с рамой?', a: 'Кабина без рамы использует более толстое стекло (обычно 8-10 мм) с минимальной фурнитурой — выглядит чище и легче в уборке. Кабина с рамой использует более тонкое стекло на алюминиевом профиле — стоит дешевле, но с заметными металлическими краями.' },
    { q: 'Как выбрать стекольную компанию в Израиле?', a: 'Проверьте использование сертифицированного безопасного стекла по израильскому стандарту SI 1226, бесплатный замер на месте, письменную гарантию и подтверждённые отзывы клиентов.' },
  ],
};

/** schema.org FAQPage for the home FAQ, in one language. */
export function buildHomeFaqSchema(locale: SupportedLocale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQ_CONTENT.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question[locale],
      acceptedAnswer: { '@type': 'Answer', text: faq.answer[locale] },
    })),
  };
}

export interface QuestionAnswer {
  question: string;
  answer: string;
}

/**
 * The home FAQ entries offered as "Popular questions": chips in the home Ask AI
 * section and the chat's starter suggestions. Clicking one shows its official
 * answer at once, without an AI call. Listed by their English question, so
 * reordering the FAQ can't silently swap them.
 */
const POPULAR_QUESTIONS_EN = [
  'How much does glass installation cost in Israel?',
  'How long does glass installation take?',
  'What type of glass is best for shower enclosures?',
  'Do you offer a warranty on glass installations?',
  'Do you serve all areas in Israel?',
  'Can I get a free quote without commitment?',
];

const POPULAR_FAQS: FaqItem[] = POPULAR_QUESTIONS_EN.map((en) => {
  const item = HOME_FAQ_CONTENT.faqs.find((faq) => faq.question.en === en);
  if (!item) throw new Error(`Popular question missing from HOME_FAQ_CONTENT: ${en}`);
  return item;
});

/** The popular questions with their official answers, in one language. */
export function getPopularQuestions(locale: SupportedLocale): QuestionAnswer[] {
  return POPULAR_FAQS.map((faq) => ({ question: faq.question[locale], answer: faq.answer[locale] }));
}

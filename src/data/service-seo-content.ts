
import type { LocalizedArray, LocalizedText } from './types';

export interface ServiceSeoFaq {
  question: LocalizedText;
  answer: LocalizedText;
}

export interface ServiceSeoPage {
  serviceId: string;
  projectCategoryId: string;
  cloudinaryCategory: string;
  slug: string;
  eyebrow: LocalizedText;
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
  metaTitle: LocalizedText;
  metaDescription: LocalizedText;
  keywords: LocalizedText;
  intro: LocalizedText;
  overview: LocalizedText;
  options: LocalizedText;
  process: LocalizedText;
  benefits: LocalizedText;
  areasSummary: LocalizedText;
  highlights: LocalizedArray;
  materialOptions: LocalizedArray;
  faqs: ServiceSeoFaq[];
  relatedLocations: string[];
}

export interface SeoLocationLink {
  slug: string;
  label: LocalizedText;
}

const localizedText = (en: string, he: string, ar: string = en, ru: string = en): LocalizedText => ({
  en,
  he,
  ar,
  ru,
});

const localizedArray = (en: string[], he: string[], ar: string[] = en, ru: string[] = en): LocalizedArray => ({
  en,
  he,
  ar,
  ru,
});

export const LOCATION_SEO_ALIAS_PREFIX = 'glass-installation';

export const LOCATION_SEO_LINKS: SeoLocationLink[] = [
  { slug: 'jerusalem', label: localizedText('Jerusalem', 'ירושלים', 'القدس', 'Иерусалим') },
  { slug: 'tel-aviv', label: localizedText('Tel Aviv', 'תל אביב', 'تل أبيب', 'Тель-Авив') },
  { slug: 'modiin', label: localizedText('Modiin', 'מודיעין', 'موديعين', 'Модиин') },
  { slug: 'haifa', label: localizedText('Haifa', 'חיפה', 'حيفا', 'Хайфа') },
  { slug: 'beer-sheva', label: localizedText('Beer Sheva', 'באר שבע', 'بئر السبع', 'Беэр-Шева') },
  { slug: 'netanya', label: localizedText('Netanya', 'נתניה', 'نتانيا', 'Нетания') },
];

export const SERVICE_SEO_SECTION_TITLES = {
  overview: localizedText('What This Service Includes', 'מה כולל השירות הזה'),
  options: localizedText('Glass Types, Hardware, and Finishes', 'סוגי זכוכית, פרזול וגימורים'),
  process: localizedText('How Installation Works', 'איך תהליך ההתקנה עובד'),
  benefits: localizedText('Why Clients Choose This Solution', 'למה לקוחות בוחרים בפתרון הזה'),
  areas: localizedText('Service Areas Across Israel', 'אזורי שירות ברחבי ישראל'),
  highlights: localizedText('Popular Features', 'מאפיינים נפוצים'),
  materials: localizedText('Recommended Options', 'אפשרויות מומלצות'),
  photos: localizedText('Recent Project Photos', 'תמונות מפרויקטים אחרונים'),
  faq: localizedText('Common Questions', 'שאלות נפוצות'),
  locations: localizedText('Location Pages', 'דפי אזורים'),
};

export const SERVICE_SEO_PAGES: ServiceSeoPage[] = [
  {
    serviceId: 'shower-glass',
    projectCategoryId: 'shower-glass',
    cloudinaryCategory: 'shower-enclosures',
    slug: 'glass-shower-installation',
    eyebrow: localizedText(
      'Frameless and custom shower glass', 'מקלחונים בהתאמה אישית וללא מסגרת',
      'زجاج دش بدون برواز وبتصميم خاص', 'Стеклянные душевые кабины без рамы на заказ'
    ),
    heroTitle: localizedText(
      'Glass Shower Installation', 'התקנת מקלחוני זכוכית',
      'تركيب زجاج الدش', 'Установка стеклянных душевых кабин'
    ),
    heroSubtitle: localizedText(
      'Custom glass shower installation for apartments, villas, renovations, and contractor projects in Jerusalem, Tel Aviv, Modiin, and across Israel.',
      'התקנת מקלחוני זכוכית בהתאמה אישית לדירות, בתים פרטיים, שיפוצים ופרויקטים לקבלנים בירושלים, תל אביב, מודיעין ובכל רחבי ישראל.',
      'تركيب مقصورات دش زجاجية بتصميم خاص للشقق والفلل وأعمال التجديد ومشاريع المقاولين في القدس وتل أبيب وموديعين وفي جميع مناطق إسرائيل.',
      'Изготовление и установка стеклянных душевых кабин на заказ для квартир, частных домов, ремонта и подрядных проектов в Иерусалиме, Тель-Авиве, Модиине и по всему Израилю.'
    ),
    metaTitle: localizedText(
      'Glass Shower Installation in Israel | Frameless Shower Glass', 'התקנת מקלחוני זכוכית בישראל | מקלחונים ללא מסגרת',
      'تركيب زجاج الدش في إسرائيل | مقصورات دش بدون برواز', 'Душевые кабины из стекла в Израиле | Кабины без рамы на заказ'
    ),
    metaDescription: localizedText(
      'Custom glass shower installation in Jerusalem, Tel Aviv, Modiin, and across Israel. Frameless showers, sliding systems, fixed panels, free measurement and fast installation.',
      'התקנת מקלחוני זכוכית בהתאמה אישית בירושלים, תל אביב, מודיעין ובכל הארץ. מקלחונים ללא מסגרת, דלתות הזזה, פנלים קבועים, מדידה חינם והתקנה מהירה.',
      'تركيب مقصورات دش زجاجية بتصميم خاص في القدس وتل أبيب وموديعين وفي جميع مناطق إسرائيل. زجاج دش بدون برواز، أبواب سحب، ألواح ثابتة، قياس مجاني وتركيب سريع.',
      'Изготовление и установка стеклянных душевых кабин на заказ в Иерусалиме, Тель-Авиве, Модиине и по всему Израилю. Кабины без рамы, раздвижные двери, стационарные панели, бесплатный замер и быстрый монтаж.'
    ),
    keywords: localizedText(
      'glass shower installation, frameless shower glass, shower enclosure installation, custom shower glass Jerusalem, shower glass Tel Aviv, shower glass Modiin',
      'התקנת מקלחוני זכוכית, מקלחון ללא מסגרת, מקלחון זכוכית בהתאמה אישית, מקלחונים ירושלים, מקלחונים תל אביב, מקלחונים מודיעין',
      'تركيب زجاج الدش, مقصورة دش زجاجية, زجاج دش بدون برواز, تركيب زجاج دش القدس, زجاج دش تل أبيب, زجاج دش موديعين',
      'установка стеклянных душевых кабин, душевая кабина из стекла без рамы, душевые перегородки на заказ, стеклянная душевая кабина Иерусалим, душевая кабина Тель-Авив, душевая кабина Модиин'
    ),
    intro: localizedText(
      'A well planned shower enclosure changes the way a bathroom feels. Instead of bulky profiles, heavy curtains, or awkward corners, custom glass shower installation creates a clean opening, lets more light move through the room, and makes even compact bathrooms feel bigger. We build shower glass to fit the exact measurements of the space, whether the layout calls for a fixed walk-in panel, a hinged door, a sliding system, or a corner enclosure. Each project starts with the actual site conditions, because tiles, slopes, walls, and plumbing details all affect how the glass should be fabricated and installed. That is why dedicated service pages matter for SEO and for clients: they explain what is included, what glass types are available, and how the work is completed from measurement through final sealing.',
      'מקלחון מתוכנן היטב משנה לגמרי את תחושת חדר הרחצה. במקום פרופילים כבדים, וילונות מסורבלים או פינות לא נוחות, התקנת מקלחון זכוכית בהתאמה אישית יוצרת מראה נקי, מכניסה יותר אור לחלל וגורמת גם לחדרי רחצה קטנים להרגיש פתוחים יותר. אנחנו מייצרים ומתקינים זכוכית לפי המידות המדויקות של המקום, בין אם צריך פנל קבוע, דלת צירים, מערכת הזזה או מקלחון פינתי. כל פרויקט מתחיל בתנאי השטח האמיתיים, כי אריחים, שיפועים, קירות ופרטי אינסטלציה משפיעים על אופן הייצור וההתקנה. זו גם הסיבה שדף שירות ייעודי חשוב גם ללקוחות וגם לקידום אורגני: הוא מסביר בדיוק מה כלול בשירות, אילו סוגי זכוכית קיימים ואיך העבודה מתבצעת משלב המדידה ועד האיטום הסופי.',
      'مقصورة دش مخططة بشكل جيد تغير تماماً شعورك بحمامك. بدلاً من البروازات الثقيلة أو الستائر المزعجة أو الزوايا غير المريحة، يخلق تركيب زجاج الدش بتصميم خاص فتحة نظيفة، يسمح بدخول مزيد من الضوء، ويجعل حتى الحمامات الصغيرة تبدو أوسع. نصنّع الزجاج بالضبط على مقاسات المساحة، سواء كان التصميم يتطلب لوحاً ثابتاً، باباً بمفصلات، نظام سحب، أو مقصورة زاوية. كل مشروع يبدأ من واقع الموقع نفسه، لأن البلاط والمنحدرات والحوائط وتفاصيل السباكة كلها تؤثر على طريقة تصنيع وتركيب الزجاج. لهذا السبب صفحة خدمة مخصصة مهمة لتحسين محركات البحث وللعملاء معاً: فهي تشرح بدقة ما تشمله الخدمة وما هي أنواع الزجاج المتوفرة وكيف يتم العمل من القياس وحتى السد النهائي.',
      'Грамотно спроектированная душевая кабина полностью меняет ощущение от ванной комнаты. Вместо громоздких профилей, тяжёлых занавесок или неудобных углов, установка стеклянной душевой кабины на заказ создаёт чистый, лёгкий проём, пропускает больше света и делает даже небольшую ванную комнату визуально просторнее. Мы изготавливаем стекло точно по размерам помещения — будь то стационарная панель, дверь на петлях, раздвижная система или угловая кабина. Каждый проект начинается с реальных условий объекта, потому что плитка, уклоны, стены и сантехнические детали влияют на то, как стекло должно быть изготовлено и установлено. Именно поэтому отдельная страница услуги важна и для SEO, и для клиентов: она объясняет, что входит в услугу, какие виды стекла доступны и как проходит работа от замера до финальной герметизации.'
    ),
    overview: localizedText(
      'Our glass shower installation service is built around accuracy and long term usability. We measure openings, wall alignment, and access points before the glass is cut, then match the enclosure to the way the bathroom is actually used. Some clients want a minimalist frameless look with hidden hardware and clear glass. Others need a more practical solution with soft privacy, black hardware, sliding access, or easier movement inside a family bathroom. We design around those goals instead of forcing one standard model into every home. The result is a shower enclosure that looks intentional, opens smoothly, seals correctly, and sits neatly against finished tile, stone, or microcement surfaces. This kind of clarity helps search engines understand the service and helps homeowners compare options before requesting a quote.',
      'שירות התקנת המקלחונים שלנו מבוסס על דיוק ועל שימוש נוח לאורך זמן. לפני חיתוך הזכוכית אנחנו מודדים את הפתח, בודקים יישור קירות, נקודות גישה ופרטי גמר, ואז מתאימים את המקלחון לאופן שבו באמת משתמשים בחדר הרחצה. יש לקוחות שמחפשים מראה מינימליסטי ללא מסגרת עם זכוכית שקופה ופרזול עדין, ואחרים מעדיפים פתרון פרקטי יותר עם פרטיות חלקית, פרזול שחור, פתיחת הזזה או כניסה נוחה יותר לחדר רחצה משפחתי. אנחנו לא כופים דגם סטנדרטי על כל בית, אלא מתכננים סביב הצרכים של הלקוח. כך מתקבל מקלחון שנראה נכון, נפתח בצורה חלקה, נאטם היטב ומתחבר בצורה מדויקת לאריחים, אבן או מיקרוצמנט. התוכן המפורט הזה עוזר גם לגוגל להבין את השירות וגם ללקוחות להשוות אפשרויות לפני שהם פונים.',
      'خدمة تركيب زجاج الدش لدينا مبنية على الدقة والاستخدام المريح لسنوات طويلة. قبل قطع الزجاج، نقيس الفتحة ومحاذاة الحائط ونقاط الوصول، ثم نوائم المقصورة مع طريقة استخدام الحمام بالفعل. بعض العملاء يريدون مظهراً بسيطاً بدون برواز مع زجاج شفاف وتركيبات خفية، وآخرون يحتاجون حلاً عملياً أكثر مع خصوصية جزئية أو تركيبات سوداء أو باب سحب يسهّل الحركة داخل حمام عائلي. نصمم حسب أهداف العميل بدلاً من فرض نموذج واحد موحّد على كل منزل. النتيجة مقصورة دش تبدو مدروسة، تُفتح بسلاسة، تُغلق بإحكام، وتتلاءم تماماً مع البلاط أو الحجر أو الميكروسمنت. هذا الوضوح يساعد محركات البحث على فهم الخدمة ويساعد أصحاب المنازل على المقارنة قبل طلب عرض السعر.',
      'Наша услуга по установке стеклянных душевых кабин основана на точности и долговечности в использовании. Перед резкой стекла мы измеряем проём, проверяем выравнивание стен и точки доступа, а затем подбираем кабину под реальный способ использования ванной комнаты. Одним клиентам нужен минималистичный вид без рамы, с прозрачным стеклом и скрытой фурнитурой. Другим — более практичное решение с лёгкой приватностью, чёрной фурнитурой или раздвижной дверью для удобства в семейной ванной. Мы проектируем под конкретные цели, а не навязываем один стандартный вариант. В результате получается душевая кабина, которая выглядит продуманной, плавно открывается, надёжно герметизирована и точно прилегает к плитке, камню или микроцементу. Такая детальность помогает поисковым системам понять суть услуги, а владельцам жилья — сравнить варианты перед заказом.'
    ),
    options: localizedText(
      'Most shower projects use tempered safety glass in 8 mm or 10 mm thickness, but the finish and hardware package make a big difference in the final look. Clear glass keeps the room bright and open, extra clear glass removes the green tint, frosted glass adds privacy, and patterned or fluted options soften visibility without making the space feel closed. We also help clients choose between chrome, black, brushed nickel, brass, and stainless hardware depending on the rest of the bathroom. In many homes, a protective coating is worth adding because it helps reduce water marks and makes weekly cleaning easier. When the page explains these choices in plain language, it gives the site stronger keyword coverage around shower glass types, frameless showers, and custom bathroom glass installation.',
      'ברוב פרויקטי המקלחונים אנחנו משתמשים בזכוכית מחוסמת בעובי 8 או 10 מ"מ, אבל הגימור והפרזול הם מה שמשפיע באמת על המראה הסופי. זכוכית שקופה שומרת על תחושה פתוחה ומוארת, זכוכית אקסטרה קליר מפחיתה את הגוון הירקרק, זכוכית חלבית מוסיפה פרטיות, ואפשרויות כמו זכוכית מפוספסת או טקסטורלית יוצרות סינון עדין בלי לסגור את החלל. אנחנו מסייעים גם בבחירת פרזול כרום, שחור, ניקל מוברש, פליז או נירוסטה לפי שפת העיצוב של חדר הרחצה. בהרבה בתים כדאי להוסיף גם ציפוי הגנה שמפחית סימני מים ומקל על התחזוקה השוטפת. כשמסבירים את כל האפשרויות האלו בצורה ברורה, מתקבל גם כיסוי טוב יותר לביטויי חיפוש סביב מקלחונים, זכוכית מחוסמת, מקלחון ללא מסגרת והתקנת זכוכית לאמבטיה.',
      'تستخدم معظم مشاريع الدش زجاجاً مقسى بسمك 8 أو 10 مم، لكن نوع التشطيب وتركيبات الفتح والإغلاق هي ما تصنع الفرق الحقيقي في المظهر النهائي. الزجاج الشفاف يحافظ على إضاءة وانفتاح الحمام، الزجاج الإكسترا كلير يزيل الصبغة الخضراء، الزجاج المصنفر يضيف خصوصية، والخيارات المنقوشة أو المخططة تخفف الرؤية دون أن تجعل المساحة مغلقة. نساعد العملاء أيضاً على الاختيار بين تركيبات الكروم والأسود والنيكل المصقول والنحاس والستانلس بحسب طابع الحمام. في كثير من المنازل يُفضَّل إضافة طلاء حماية يقلل آثار المياه ويسهّل التنظيف الأسبوعي. عندما تشرح الصفحة هذه الخيارات بوضوح، تحصل على تغطية أفضل لكلمات البحث المتعلقة بأنواع زجاج الدش والمقصورات بدون برواز وتركيب زجاج الحمامات.',
      'В большинстве проектов используется закалённое стекло толщиной 8 или 10 мм, но именно отделка и фурнитура определяют итоговый вид кабины. Прозрачное стекло сохраняет ощущение света и простора, экстра-прозрачное стекло убирает зеленоватый оттенок, матовое стекло добавляет приватность, а узорчатое или рифлёное стекло смягчает видимость без эффекта закрытого пространства. Мы также помогаем выбрать между хромированной, чёрной, латунной фурнитурой или фурнитурой из нержавеющей стали в зависимости от остального интерьера ванной. Во многих домах стоит добавить защитное покрытие — оно уменьшает следы от воды и облегчает еженедельную уборку. Когда страница объясняет эти варианты простым языком, это даёт сайту более широкое покрытие по запросам о видах стекла для душа, кабинах без рамы и установке стекла в ванной.'
    ),
    process: localizedText(
      'The installation process begins with on site measurement, not with guesswork from a floor plan. We inspect walls, check where hinges or channels can sit safely, confirm drainage direction, and note anything that may affect sealing. After fabrication, the glass is brought to site with the selected hardware and installed in a controlled sequence so that alignment, door swing, and water protection are all checked before final handover. For renovated apartments in Jerusalem, modern towers in Tel Aviv, and family homes in Modiin, the same principle applies: measure precisely, fabricate accurately, and install cleanly. That is exactly the kind of detailed service content Google expects to find on a page that wants to rank for glass shower installation and custom shower enclosure terms.',
      'תהליך ההתקנה מתחיל במדידה בשטח, ולא בניחוש לפי תוכנית כללית. אנחנו בודקים קירות, מוודאים איפה ניתן למקם צירים או פרופילים בצורה בטוחה, מאשרים את כיוון הניקוז ורושמים כל פרט שעשוי להשפיע על האיטום. לאחר הייצור הזכוכית והפרזול מגיעים לאתר, וההתקנה מתבצעת בסדר עבודה מדויק כדי לבדוק יישור, פתיחת דלת והגנה מפני מים לפני מסירה סופית. בין אם מדובר בדירה משופצת בירושלים, במגדל מודרני בתל אביב או בבית משפחתי במודיעין, העיקרון זהה: מדידה מדויקת, ייצור נכון והתקנה נקייה. זה בדיוק סוג התוכן המפורט שגוגל מצפה למצוא בדף שמנסה לדרג על ביטויים כמו התקנת מקלחוני זכוכית, מקלחון בהתאמה אישית או זכוכית לחדר רחצה.',
      'تبدأ عملية التركيب بالقياس في الموقع نفسه، وليس بالتخمين من مخطط عام. نفحص الحوائط، ونتحقق من أين يمكن وضع المفصلات أو القنوات بأمان، ونؤكد اتجاه تصريف المياه، ونلاحظ أي تفصيل قد يؤثر على السد. بعد التصنيع، يصل الزجاج إلى الموقع مع التركيبات المختارة ويتم تركيبه بترتيب عمل دقيق للتحقق من المحاذاة وحركة الباب والحماية من المياه قبل التسليم النهائي. سواء كانت شقة مجددة في القدس، أو برجاً حديثاً في تل أبيب، أو منزلاً عائلياً في موديعين، المبدأ واحد: قياس دقيق، تصنيع صحيح، وتركيب نظيف. هذا هو تماماً نوع المحتوى التفصيلي الذي تتوقعه جوجل من صفحة تريد الترتيب لكلمات مثل تركيب زجاج الدش ومقصورات الدش المخصصة.',
      'Процесс установки начинается с замера на месте, а не с предположений по чертежу. Мы проверяем стены, определяем, где безопасно разместить петли или направляющие, уточняем направление слива и отмечаем всё, что может повлиять на герметизацию. После изготовления стекло привозят на объект вместе с выбранной фурнитурой и устанавливают в строгой последовательности, проверяя выравнивание, ход двери и защиту от воды перед окончательной сдачей. Для отремонтированных квартир в Иерусалиме, современных башен в Тель-Авиве и семейных домов в Модиине принцип один: точный замер, правильное изготовление и аккуратный монтаж. Именно такой подробный контент о процессе работы помогает странице ранжироваться по запросам об установке стеклянных душевых кабин на заказ.'
    ),
    benefits: localizedText(
      'Clients usually choose glass showers for a mix of design, maintenance, and resale value. A custom enclosure makes the bathroom feel larger, highlights tile and stone finishes, and eliminates many of the visual interruptions caused by bulky frames. It also creates a solution that fits the exact dimensions of the room rather than leaving wasted gaps or awkward overlaps. From an SEO standpoint, this section helps target the reasons people search before they buy: easy to clean shower glass, walk in shower installation, frameless shower benefits, and custom bathroom renovation ideas. From a practical standpoint, it gives homeowners the confidence to ask for the right layout, the right privacy level, and the right hardware package before fabrication begins.',
      'לקוחות בוחרים במקלחוני זכוכית בדרך כלל משילוב של עיצוב, תחזוקה וערך לנכס. מקלחון מותאם אישית גורם לחדר הרחצה להרגיש גדול יותר, מדגיש חיפויי אבן וקרמיקה ומעלים הרבה מהעומס הוויזואלי שנוצר על ידי מסגרות כבדות. מעבר לכך, הוא יוצר פתרון שמתאים בדיוק למידות של החדר במקום להשאיר רווחים מיותרים או חפיפות לא נוחות. מבחינת SEO, החלק הזה תומך בביטויי חיפוש שלקוחות מקלידים לפני שהם מחליטים: זכוכית מקלחון קלה לניקוי, מקלחון הליכה פנימה, יתרונות מקלחון ללא מסגרת ורעיונות לשיפוץ חדר רחצה. מבחינה מעשית, הוא עוזר ללקוח להבין איזה מבנה, איזו רמת פרטיות ואיזה סוג פרזול נכון לבחור עוד לפני תחילת הייצור.',
      'يختار العملاء مقصورات الدش الزجاجية عادةً لمزيج من التصميم وسهولة الصيانة وقيمة العقار. المقصورة المخصصة تجعل الحمام يبدو أكبر، وتُبرز تشطيبات البلاط والحجر، وتُلغي الكثير من الانقطاع البصري الذي تسببه البروازات الثقيلة. كما أنها تخلق حلاً يتناسب بدقة مع أبعاد الغرفة بدلاً من ترك فراغات أو تراكبات غير مريحة. من منظور تحسين محركات البحث، يدعم هذا القسم الأسباب التي يبحث عنها الناس قبل الشراء: زجاج دش سهل التنظيف، تركيب دش بدون عتبة، مزايا الدش بدون برواز، وأفكار تجديد الحمام. ومن الناحية العملية، يمنح أصحاب المنازل الثقة لطلب التصميم المناسب ومستوى الخصوصية والتركيبات الصحيحة قبل بدء التصنيع.',
      'Клиенты выбирают стеклянные душевые кабины из-за сочетания дизайна, простоты обслуживания и влияния на стоимость недвижимости. Кабина на заказ делает ванную комнату визуально больше, подчёркивает плитку и каменные поверхности и убирает визуальные помехи от громоздких рам. Кроме того, она точно соответствует размерам помещения, без лишних зазоров и неудобных стыков. С точки зрения SEO этот раздел отвечает на запросы, которые люди ищут перед покупкой: стекло для душа легкое в уборке, душевая кабина без порога, преимущества кабины без рамы, идеи для ремонта ванной комнаты. На практике это помогает владельцам жилья увереннее выбирать планировку, уровень приватности и фурнитуру ещё до начала изготовления.'
    ),
    areasSummary: localizedText(
      'We install shower glass across Israel and regularly handle bathroom projects in Jerusalem, Tel Aviv, Modiin, Haifa, and Beer Sheva. Every city brings different site conditions, from compact urban bathrooms and high rise apartments to larger family homes and renovation projects with older walls. Dedicated location pages let us explain those differences in a way that strengthens local SEO and helps customers land on a page that matches both the service and the city they searched for. If someone is looking for custom glass shower installation in Jerusalem or frameless shower glass in Tel Aviv, they should reach a page that addresses that need directly instead of being forced into a generic gallery.',
      'אנחנו מתקינים מקלחוני זכוכית בכל רחבי ישראל ומבצעים באופן קבוע פרויקטים בירושלים, תל אביב, מודיעין, חיפה ובאר שבע. לכל עיר יש תנאי שטח שונים, החל מחדרי רחצה קטנים בדירות עירוניות ובמגדלים, ועד בתים משפחתיים גדולים ושיפוצים בדירות עם קירות ישנים. דפי אזור ייעודיים מאפשרים לנו להסביר את ההבדלים האלו בצורה שתומכת גם בקידום מקומי וגם בחוויית המשתמש. אם מישהו מחפש התקנת מקלחוני זכוכית בירושלים או מקלחון ללא מסגרת בתל אביב, הוא צריך להגיע לדף שמדבר בדיוק על השירות והעיר שהוא חיפש, ולא להיאבד בתוך גלריה כללית.',
      'نقوم بتركيب زجاج الدش في جميع مناطق إسرائيل، ونعمل بشكل منتظم في مشاريع حمامات في القدس وتل أبيب وموديعين وحيفا وبئر السبع. كل مدينة لها ظروف موقع مختلفة، من الحمامات الصغيرة في الشقق الحضرية والأبراج، إلى المنازل العائلية الكبيرة ومشاريع التجديد في شقق ذات جدران قديمة. صفحات المواقع المخصصة تتيح لنا شرح هذه الفروقات بطريقة تدعم تحسين محركات البحث المحلي وتساعد العملاء على الوصول لصفحة تطابق الخدمة والمدينة التي يبحثون عنها بالضبط. من يبحث عن تركيب زجاج دش مخصص في القدس أو زجاج دش بدون برواز في تل أبيب، يجب أن يصل لصفحة تجيب على حاجته مباشرة بدلاً من معرض صور عام.',
      'Мы устанавливаем стеклянные душевые кабины по всему Израилю и регулярно работаем над проектами в Иерусалиме, Тель-Авиве, Модиине, Хайфе и Беэр-Шеве. В каждом городе свои условия — от компактных ванных в городских квартирах и высотках до больших семейных домов и ремонта в квартирах со старыми стенами. Отдельные страницы по городам позволяют нам объяснить эти различия и усиливают локальное SEO, помогая клиентам попасть именно на ту страницу, которая соответствует и услуге, и городу запроса. Если кто-то ищет установку стеклянной душевой кабины на заказ в Иерусалиме или кабину без рамы в Тель-Авиве, он должен попасть на страницу, отвечающую именно на этот запрос, а не в общую галерею.'
    ),
    highlights: localizedArray(
      ['Frameless walk-in showers', 'Sliding shower systems', 'Corner enclosures', 'Black, brass, or stainless hardware', 'Clear, frosted, or fluted glass', 'Free on-site measurement'],
      ['מקלחוני הליכה פנימה ללא מסגרת', 'מערכות הזזה למקלחון', 'מקלחונים פינתיים', 'פרזול שחור, פליז או נירוסטה', 'זכוכית שקופה, חלבית או מפוספסת', 'מדידה חינם בבית הלקוח'],
      ['مقصورات دش بدون برواز', 'أنظمة دش بباب سحب', 'مقصورات زاوية', 'تركيبات سوداء أو نحاسية أو ستانلس', 'زجاج شفاف أو مصنفر أو مخطط', 'قياس مجاني في الموقع'],
      ['Душевые кабины без рамы', 'Раздвижные душевые системы', 'Угловые кабины', 'Чёрная, латунная или стальная фурнитура', 'Прозрачное, матовое или рифлёное стекло', 'Бесплатный замер на месте']
    ),
    materialOptions: localizedArray(
      ['8 mm tempered safety glass', '10 mm premium frameless panels', 'Easy-clean protective coating', 'Custom handles, hinges, and support bars'],
      ['זכוכית מחוסמת 8 מ"מ', 'פנלים פרימיום 10 מ"מ ללא מסגרת', 'ציפוי הגנה קל לניקוי', 'ידיות, צירים ומוטות תמיכה בהתאמה'],
      ['زجاج مقسى 8 مم', 'ألواح فاخرة 10 مم بدون برواز', 'طلاء حماية سهل التنظيف', 'مقابض ومفصلات وقضبان دعم مخصصة'],
      ['Закалённое стекло 8 мм', 'Премиальные панели без рамы 10 мм', 'Защитное покрытие для лёгкой очистки', 'Ручки, петли и опорные штанги на заказ']
    ),
    faqs: [
      {
        question: localizedText(
          'What glass thickness is recommended for a shower enclosure?', 'איזה עובי זכוכית מומלץ למקלחון?',
          'ما هو سمك الزجاج الموصى به لمقصورة الدش؟', 'Какая толщина стекла рекомендуется для душевой кабины?'
        ),
        answer: localizedText(
          'For most custom shower installations we recommend tempered safety glass in 8 mm or 10 mm thickness, depending on the opening, hardware, and design style.',
          'ברוב פרויקטי המקלחונים אנחנו ממליצים על זכוכית מחוסמת בטיחותית בעובי 8 או 10 מ"מ, בהתאם לפתח, לפרזול ולסגנון העיצובי.',
          'في معظم مشاريع الدش المخصصة، نوصي بزجاج مقسى بسمك 8 أو 10 مم، بحسب الفتحة والتركيبات والطابع التصميمي.',
          'В большинстве проектов мы рекомендуем закалённое безопасное стекло толщиной 8 или 10 мм, в зависимости от проёма, фурнитуры и стиля дизайна.'
        ),
      },
      {
        question: localizedText(
          'Can you install shower glass in small bathrooms?', 'האם אפשר להתקין מקלחון זכוכית גם בחדר רחצה קטן?',
          'هل يمكنكم تركيب زجاج الدش في الحمامات الصغيرة؟', 'Можно ли установить стеклянную кабину в маленькой ванной?'
        ),
        answer: localizedText(
          'Yes. Small bathrooms often benefit the most from custom shower glass because a fixed panel, precise hinge layout, or sliding door can save space and keep the room visually open.',
          'כן. דווקא חדרי רחצה קטנים נהנים במיוחד ממקלחון מותאם אישית, כי פנל קבוע, פתיחת צירים מדויקת או דלת הזזה יכולים לחסוך מקום ולשמור על תחושה פתוחה.',
          'نعم. الحمامات الصغيرة غالباً ما تستفيد أكثر من زجاج الدش المخصص، لأن اللوح الثابت أو ترتيب المفصلات الدقيق أو باب السحب يمكن أن يوفر مساحة ويحافظ على شعور بالانفتاح.',
          'Да. Маленькие ванные комнаты особенно выигрывают от стекла на заказ — стационарная панель, точное расположение петель или раздвижная дверь экономят место и сохраняют ощущение простора.'
        ),
      },
      {
        question: localizedText(
          'Do you handle both new bathrooms and renovations?', 'האם אתם עובדים גם בשיפוץ וגם בבנייה חדשה?',
          'هل تعملون في الحمامات الجديدة وأعمال التجديد أيضاً؟', 'Вы работаете и с новыми ванными комнатами, и с ремонтом?'
        ),
        answer: localizedText(
          'We do. We install shower glass for new construction, full bathroom renovations, apartment upgrades, and contractor handover projects across Israel.',
          'בהחלט. אנחנו מתקינים מקלחונים בבנייה חדשה, בשיפוצי אמבטיה מלאים, בשדרוג דירות ובפרויקטים לקבלנים בכל רחבי הארץ.',
          'بالتأكيد. نقوم بتركيب زجاج الدش في البناء الجديد، وتجديد الحمامات الكامل، وترقية الشقق، ومشاريع تسليم المقاولين في جميع مناطق إسرائيل.',
          'Да. Мы устанавливаем стеклянные кабины при новом строительстве, полном ремонте ванной, обновлении квартир и в подрядных проектах по всему Израилю.'
        ),
      },
    ],
    relatedLocations: ['jerusalem', 'tel-aviv', 'modiin'],
  },
  {
    serviceId: 'glass-railings',
    projectCategoryId: 'glass-railings',
    cloudinaryCategory: 'glass-railings',
    slug: 'glass-railing',
    eyebrow: localizedText(
      'Balcony and staircase safety glass', 'מעקות זכוכית למרפסות ומדרגות',
      'درابزين زجاج للشرفات والدرج', 'Стеклянные перила для балконов и лестниц'
    ),
    heroTitle: localizedText(
      'Glass Railing Installation', 'התקנת מעקות זכוכית',
      'تركيب درابزين زجاج', 'Установка стеклянных перил и ограждений'
    ),
    heroSubtitle: localizedText(
      'Custom glass railing installation for balconies, stairs, rooftops, and interior voids with a clean modern finish and code-aware detailing.',
      'התקנת מעקות זכוכית בהתאמה אישית למרפסות, מדרגות, גגות וחללים פנימיים עם גמר מודרני, בטיחותי ומדויק.',
      'تركيب درابزين زجاج بتصميم خاص للشرفات والدرج والأسطح والفتحات الداخلية بمظهر عصري نظيف ومواصفات سلامة دقيقة.',
      'Изготовление и установка стеклянных перил на заказ для балконов, лестниц, крыш и внутренних проёмов с чистой современной отделкой и соблюдением норм безопасности.'
    ),
    metaTitle: localizedText(
      'Glass Railing Installation in Israel | Balcony and Stair Glass', 'התקנת מעקות זכוכית בישראל | מעקות למרפסות ולמדרגות',
      'تركيب درابزين زجاج في إسرائيل | درابزين شرفات ودرج', 'Стеклянные перила в Израиле | Ограждения для балконов и лестниц'
    ),
    metaDescription: localizedText(
      'Professional glass railing installation in Jerusalem, Tel Aviv, Modiin, Haifa, and across Israel. Balcony railings, stair railings, laminated glass and premium hardware.',
      'התקנת מעקות זכוכית מקצועית בירושלים, תל אביב, מודיעין, חיפה ובכל ישראל. מעקות למרפסות ולמדרגות, זכוכית למינציה ופרזול איכותי.',
      'تركيب درابزين زجاج باحترافية في القدس وتل أبيب وموديعين وحيفا وفي جميع مناطق إسرائيل. درابزين للشرفات والدرج، زجاج لامينيت، وتركيبات فاخرة.',
      'Профессиональная установка стеклянных перил в Иерусалиме, Тель-Авиве, Модиине, Хайфе и по всему Израилю. Перила для балконов и лестниц, ламинированное стекло и качественная фурнитура.'
    ),
    keywords: localizedText(
      'glass railing installation, balcony glass railing, staircase glass railing, glass balustrade Israel, glass railing Jerusalem, glass railing Tel Aviv',
      'התקנת מעקות זכוכית, מעקה זכוכית למרפסת, מעקה זכוכית למדרגות, מעקה זכוכית ישראל, מעקות זכוכית ירושלים, מעקות זכוכית תל אביב',
      'تركيب درابزين زجاج, درابزين زجاج للشرفة, درابزين زجاج للدرج, حاجز زجاجي إسرائيل, درابزين زجاج القدس, درابزين زجاج تل أبيب',
      'установка стеклянных перил, стеклянные перила для балкона, стеклянные перила для лестницы, стеклянное ограждение Израиль, стеклянные перила Иерусалим, стеклянные перила Тель-Авив'
    ),
    intro: localizedText(
      'Glass railing installation is one of the clearest examples of a service that deserves its own landing page. People search for balcony glass railings, staircase glass balustrades, pool-edge safety glass, and frameless railings with very specific intent. A generic services page does not explain enough about safety, hardware systems, or the differences between indoor and outdoor conditions. Our railing work is designed around structural requirements and clean visual lines. We fabricate and install railings that keep views open while protecting balconies, landings, and staircases. Whether the project is for a modern apartment tower, a private villa, a rooftop terrace, or a commercial stair, the design has to balance transparency, safety, wind exposure, and the style of the surrounding architecture.',
      'התקנת מעקות זכוכית היא דוגמה מצוינת לשירות שצריך דף ייעודי משלו. אנשים מחפשים מעקה זכוכית למרפסת, מעקה זכוכית למדרגות, מעקה בריכה או מעקה ללא מסגרת עם כוונה מאוד ברורה, ודף שירות כללי לא מסביר מספיק על בטיחות, על סוגי פרזול או על ההבדל בין חוץ לפנים. עבודות המעקות שלנו מתוכננות סביב דרישות מבניות וקווים נקיים מבחינה עיצובית. אנחנו מייצרים ומתקינים מעקות ששומרים על שדה ראייה פתוח ובו זמנית מגנים על מרפסות, פודסטים ומדרגות. בין אם מדובר במגדל מגורים מודרני, וילה פרטית, גג אירוח או גרם מדרגות מסחרי, התכנון צריך לאזן בין שקיפות, בטיחות, עומסי רוח והשפה האדריכלית של המבנה.',
      'تركيب درابزين الزجاج هو من أوضح الأمثلة على خدمة تستحق صفحة خاصة بها. الناس يبحثون عن درابزين زجاج للشرفة، حاجز زجاجي للدرج، حاجز زجاجي لحمام السباحة، أو درابزين بدون برواز بنية شراء واضحة جداً، وصفحة خدمات عامة لا تشرح بما يكفي عن السلامة أو أنواع التركيبات أو الفرق بين الداخل والخارج. أعمال الدرابزين عندنا مصممة حول متطلبات الإنشاء وخطوط بصرية نظيفة. نصنّع ونركّب درابزين يحافظ على الرؤية مفتوحة بينما يحمي الشرفات والممرات والدرج. سواء كان المشروع برجاً سكنياً حديثاً أو فيلا خاصة أو تراساً على السطح أو درجاً تجارياً، يجب أن يوازن التصميم بين الشفافية والسلامة والتعرض للرياح وطابع العمارة المحيطة.',
      'Установка стеклянных перил — один из самых наглядных примеров услуги, которая заслуживает отдельной страницы. Люди ищут стеклянные перила для балкона, стеклянное ограждение для лестницы, защитное стекло у бассейна или перила без рамы с очень конкретным намерением, а общая страница услуг недостаточно объясняет вопросы безопасности, виды фурнитуры или различия между уличными и внутренними условиями. Наши перила проектируются с учётом конструктивных требований и чистых визуальных линий. Мы изготавливаем и устанавливаем перила, которые сохраняют открытый вид и одновременно защищают балконы, площадки и лестницы. Будь это современная жилая башня, частная вилла, терраса на крыше или коммерческая лестница, дизайн должен сочетать прозрачность, безопасность, ветровую нагрузку и стиль окружающей архитектуры.'
    ),
    overview: localizedText(
      'Every railing project begins with the actual span, fixing points, and edge conditions. Some systems rely on base shoes, some use standoffs, and some combine glass with slim metal handrails for additional guidance. Our job is to match the system to the structure, the usage, and the visual brief. Balcony railings need different detailing from an internal stair, especially when they are exposed to weather, cleaning chemicals, and ongoing movement. For homeowners and contractors, this page gives a clearer understanding of what is possible and why the same term “glass railing” can describe several different build methods. For SEO, that specificity helps the site match searches for balcony glass railing installation, stair glass railing, and frameless balustrade systems.',
      'כל פרויקט מעקות מתחיל בבדיקה של המפתח, נקודות העיגון ותנאי הקצה. יש מערכות שמבוססות על נעל בסיס, אחרות על נקודות עיגון צדדיות, ואחרות משלבות זכוכית עם מאחז יד דק ממתכת לצורך הנחיה נוספת. התפקיד שלנו הוא להתאים את השיטה למבנה, לשימוש ולשפה העיצובית. מעקה למרפסת דורש תכנון שונה ממעקה לגרם מדרגות פנימי, במיוחד כשיש חשיפה למזג אוויר, חומרי ניקוי ותנועה מתמשכת. מבחינת לקוחות וקבלנים, הדף הזה מסביר טוב יותר מה אפשרי ולמה אותו ביטוי, “מעקה זכוכית”, יכול להתייחס לכמה שיטות ביצוע שונות. מבחינת קידום אורגני, הפירוט הזה מחזק התאמה לחיפושים כמו מעקה זכוכית למרפסת, מעקה זכוכית למדרגות או מערכת בלוסטרדה ללא מסגרת.',
      'كل مشروع درابزين يبدأ بفحص المدى الفعلي ونقاط التثبيت وحالة الحواف. بعض الأنظمة تعتمد على قاعدة تثبيت، وبعضها يستخدم نقاط تثبيت جانبية، وبعضها يجمع الزجاج مع مقبض معدني رفيع لمزيد من الإرشاد. مهمتنا هي مطابقة النظام مع البنية والاستخدام والطابع البصري المطلوب. درابزين الشرفة يحتاج تفصيلاً مختلفاً عن درج داخلي، خصوصاً عند التعرض للطقس ومواد التنظيف والحركة المستمرة. لأصحاب المنازل والمقاولين، تمنحهم هذه الصفحة فهماً أوضح لما هو ممكن، ولماذا يمكن أن يصف نفس المصطلح "درابزين زجاج" عدة طرق تنفيذ مختلفة. من ناحية تحسين محركات البحث، هذا التفصيل يساعد الموقع على مطابقة عمليات البحث عن تركيب درابزين زجاج للشرفة، درابزين زجاج للدرج، وأنظمة حاجز بدون برواز.',
      'Каждый проект перил начинается с проверки реального пролёта, точек крепления и состояния кромок. Одни системы основаны на базовом профиле, другие — на точечных крепежах, третьи сочетают стекло с тонким металлическим поручнем для дополнительной опоры. Наша задача — подобрать систему под конструкцию, способ использования и визуальную задачу. Перила для балкона требуют иной детализации, чем для внутренней лестницы, особенно при воздействии погоды, чистящих средств и постоянного движения. Эта страница помогает домовладельцам и подрядчикам лучше понять, что возможно и почему один и тот же термин "стеклянные перила" может означать разные способы исполнения. Для SEO такая конкретика помогает сайту соответствовать запросам об установке стеклянных перил для балкона, перилах для лестниц и системах ограждения без рамы.'
    ),
    options: localizedText(
      'Outdoor railings often use laminated and tempered safety glass together with corrosion resistant hardware, while interior stair railings may allow a lighter visual solution. We help clients compare clear and extra-clear glass, top rails versus frameless edges, concealed base channels versus visible brackets, and finishes that coordinate with aluminum, stone, wood, or steel. These details matter because railing decisions affect both safety and the overall facade or interior line. A detailed service page also captures valuable keywords around laminated glass railings, balcony safety glass, rooftop railings, and custom staircase glazing. That written content gives search engines enough context to understand that the site specializes in this exact service instead of mentioning it only once on a crowded overview page.',
      'במעקות חוץ אנחנו משתמשים בדרך כלל בזכוכית בטיחות רבודה ומחוסמת יחד עם פרזול עמיד לקורוזיה, בעוד שבמעקות פנימיים למדרגות אפשר לעיתים לבחור פתרון ויזואלי קל יותר. אנחנו מסייעים להשוות בין זכוכית שקופה לאקסטרה קליר, בין מאחז יד עליון לקצה זכוכית נקי, בין תעלת בסיס נסתרת לתושבות גלויות ובין גימורים שמתאימים לאלומיניום, אבן, עץ או פלדה. הפרטים האלה חשובים כי בחירת המעקה משפיעה גם על הבטיחות וגם על קו החזית או הפנים. דף שירות מפורט מאפשר לכסות גם מילות מפתח חשובות סביב מעקות זכוכית רבודה, מעקות בטיחות למרפסת, מעקה לגג ומעקות זכוכית למדרגות, וכך גוגל מבין שמדובר בהתמחות אמיתית ולא באזכור בודד בדף עמוס.',
      'الدرابزين الخارجي غالباً يستخدم زجاجاً مصفّحاً ومقسى مع تركيبات مقاومة للصدأ، بينما الدرابزين الداخلي للدرج يمكن أن يسمح بحل بصري أخف. نساعد العملاء على المقارنة بين الزجاج الشفاف والإكسترا كلير، بين مقبض علوي وحافة زجاج بدون برواز، بين قناة تثبيت مخفية وحوامل ظاهرة، وبين تشطيبات تتناسب مع الألمنيوم أو الحجر أو الخشب أو الفولاذ. هذه التفاصيل مهمة لأن اختيار الدرابزين يؤثر على السلامة وعلى خط الواجهة أو الداخل معاً. صفحة خدمة مفصّلة تغطي أيضاً كلمات بحث مهمة حول درابزين الزجاج المصفّح، حاجز سلامة للشرفة، درابزين السطح، وزجاج درج مخصص.',
      'В наружных перилах часто применяется ламинированное закалённое безопасное стекло вместе с коррозионностойкой фурнитурой, тогда как внутренние лестничные перила позволяют более лёгкое визуальное решение. Мы помогаем сравнить прозрачное и экстра-прозрачное стекло, верхний поручень и кромку без рамы, скрытый базовый профиль и видимые крепления, а также отделку, сочетающуюся с алюминием, камнем, деревом или сталью. Эти детали важны, потому что выбор перил влияет и на безопасность, и на общую линию фасада или интерьера. Подробная страница услуги также охватывает важные запросы о ламинированных стеклянных перилах, защитном стекле для балкона, перилах для крыши и стекле для лестниц на заказ.'
    ),
    process: localizedText(
      'Installation includes measurement, system selection, fabrication planning, and clean fitting on site. We coordinate around tile edges, concrete parapets, steel substrates, and finished stone details so the railing sits correctly and looks intentional from every angle. On stairs, the rise and run of the staircase influence where joints, brackets, and hand support should be placed. On balconies and rooftops, we account for exposure and sight lines. This is the sort of content people actually search for before spending money, and it is also the kind of structured text Google uses to understand expertise. A dedicated page that explains the installation process performs far better than a thin paragraph that simply says “we also do railings.”',
      'תהליך ההתקנה כולל מדידה, בחירת מערכת, תכנון ייצור והתקנה נקייה באתר. אנחנו מתאמים את העבודה סביב קצות ריצוף, מעקות בטון, תשתיות פלדה וגמרי אבן כדי שהמערכת תשב נכון ותראה מדויקת מכל זווית. במדרגות, גם הגובה והרום של כל מדרגה משפיעים על מיקום החיבורים, התושבות והמאחז. במרפסות ובגגות צריך להתייחס לחשיפה למזג אוויר ולשדה הראייה. זה בדיוק סוג התוכן שאנשים מחפשים לפני הוצאה משמעותית, וזה גם סוג הטקסט שגוגל נעזר בו כדי להבין מומחיות. דף ייעודי שמסביר את תהליך ההתקנה עובד הרבה יותר טוב מפסקה קצרה שמסתפקת במשפט “אנחנו גם עושים מעקות”.',
      'يشمل التركيب القياس واختيار النظام وتخطيط التصنيع والتثبيت النظيف في الموقع. ننسّق العمل حول حواف البلاط وحواجز الخرسانة وقواعد الفولاذ وتفاصيل الحجر النهائية حتى يجلس الدرابزين بشكل صحيح ويبدو مدروساً من كل زاوية. في الدرج، يؤثر ارتفاع وعرض كل درجة على مكان الوصلات والحوامل ودعم اليد. في الشرفات والأسطح، نأخذ بالحسبان التعرض للطقس وخطوط الرؤية. هذا تماماً نوع المحتوى الذي يبحث عنه الناس قبل إنفاق مبلغ كبير، وهو أيضاً نوع النص المنظم الذي تستخدمه جوجل لفهم الخبرة. صفحة مخصصة تشرح عملية التركيب تعمل بشكل أفضل بكثير من فقرة قصيرة تقول فقط "نقوم أيضاً بالدرابزين".',
      'Установка включает замер, выбор системы, планирование изготовления и аккуратный монтаж на объекте. Мы согласовываем работу с кромками плитки, бетонными парапетами, стальным основанием и каменной отделкой, чтобы перила сидели правильно и выглядели продуманно с любого угла. На лестницах высота и ширина ступеней влияют на расположение стыков, креплений и опоры для руки. На балконах и крышах мы учитываем воздействие погоды и линии обзора. Именно такой контент люди ищут перед серьёзной тратой денег, и именно такой структурированный текст помогает Google понять экспертность. Отдельная страница, объясняющая процесс установки, работает намного лучше короткого абзаца "мы также делаем перила".'
    ),
    benefits: localizedText(
      'Clients choose glass railings because they preserve light and views while giving the property a sharper, more contemporary finish. On a balcony, the difference is immediate: the horizon stays visible instead of being cut by heavy bars or filled panels. Inside the home, glass keeps stair zones visually connected and can make narrow vertical spaces feel much more open. The benefits section is also valuable for search intent. It answers why someone would search for balcony glass railing, modern stair railing, or frameless railing installation in the first place. By combining practical benefits with location-specific landing pages, the site becomes much more relevant for local searches like glass railing Jerusalem or balcony railing Tel Aviv.',
      'לקוחות בוחרים במעקות זכוכית כי הם שומרים על אור ועל נוף פתוח ובאותו זמן נותנים לנכס מראה חד, אלגנטי ועכשווי יותר. במרפסת ההבדל מורגש מיד: קו האופק נשאר פתוח במקום להיחתך על ידי סורגים או פאנלים אטומים. בתוך הבית, זכוכית שומרת על חיבור חזותי בין מפלסים ויכולה לגרום גם לאזורי מדרגות צרים להרגיש פתוחים הרבה יותר. גם לחלק הזה יש ערך לקידום אורגני, כי הוא עונה על השאלה למה בכלל לחפש מעקה זכוכית למרפסת, מעקה מודרני למדרגות או התקנת מעקה ללא מסגרת. כשהתוכן הזה מחובר גם לדפי מיקום מקומיים, האתר הופך לרלוונטי הרבה יותר לחיפושים כמו מעקות זכוכית ירושלים או מעקה מרפסת זכוכית תל אביב.',
      'يختار العملاء درابزين الزجاج لأنه يحافظ على الضوء والمنظر بينما يعطي العقار مظهراً أحدّ وأكثر عصرية. في الشرفة، الفرق فوري: يبقى خط الأفق ظاهراً بدلاً من أن يقطعه قضبان ثقيلة أو ألواح مغلقة. داخل المنزل، يحافظ الزجاج على ترابط بصري بين الطبقات ويمكن أن يجعل المساحات الرأسية الضيقة تبدو أوسع بكثير. هذا القسم له قيمة أيضاً لنية البحث، فهو يجيب عن سبب البحث أساساً عن درابزين زجاج للشرفة أو درابزين عصري للدرج أو تركيب درابزين بدون برواز. عند ربط هذه الفوائد العملية بصفحات مواقع محددة، يصبح الموقع أكثر صلة بكثير لعمليات البحث المحلية مثل درابزين زجاج القدس أو درابزين شرفة تل أبيب.',
      'Клиенты выбирают стеклянные перила, потому что они сохраняют свет и вид, придавая объекту более чёткий, современный облик. На балконе разница ощущается сразу: горизонт остаётся открытым, а не разбивается тяжёлыми прутьями или сплошными панелями. Внутри дома стекло сохраняет визуальную связь между уровнями и делает узкие вертикальные пространства заметно просторнее. Этот раздел также важен для поискового намерения — он отвечает, почему вообще ищут стеклянные перила для балкона, современные перила для лестницы или установку перил без рамы. Сочетая практическую пользу со страницами по конкретным городам, сайт становится гораздо релевантнее для локальных запросов вроде стеклянные перила Иерусалим или перила для балкона Тель-Авив.'
    ),
    areasSummary: localizedText(
      'We install glass railings across Israel, including city apartments, hillside homes, private villas, offices, and rooftop spaces. Jerusalem projects often involve stone parapets and renovation details, Tel Aviv projects lean toward clean contemporary lines, and Modiin homes frequently combine family use with open balcony layouts. A strong location strategy matters because people search by city almost as often as they search by service. Linking this railing page to city pages gives both users and search engines a clearer path between the service and the places where it is offered.',
      'אנחנו מתקינים מעקות זכוכית בכל רחבי ישראל, בדירות עירוניות, בבתים על מדרון, בוילות, במשרדים ובחללי גג. פרויקטים בירושלים כוללים לא פעם מעקות אבן ושיפוצים מורכבים, בתל אביב יש נטייה לקווים עכשוויים נקיים, ובמודיעין הרבה בתים משלבים שימוש משפחתי עם מרפסות פתוחות. אסטרטגיית מיקום חזקה חשובה כי אנשים מחפשים לפי עיר כמעט באותה תדירות שבה הם מחפשים לפי שירות. הקישור בין דף המעקות לבין דפי הערים נותן גם למשתמשים וגם למנועי חיפוש מסלול ברור יותר בין השירות לבין המקומות שבהם הוא מוצע.',
      'نقوم بتركيب درابزين الزجاج في جميع مناطق إسرائيل، بما في ذلك الشقق الحضرية والمنازل على المنحدرات والفلل الخاصة والمكاتب وأسطح المباني. مشاريع القدس غالباً تشمل حواجز حجرية وتفاصيل تجديد، مشاريع تل أبيب تميل لخطوط عصرية نظيفة، ومنازل موديعين كثيراً ما تجمع بين الاستخدام العائلي وتصميم شرفات مفتوحة. استراتيجية المواقع القوية مهمة لأن الناس يبحثون بحسب المدينة بقدر ما يبحثون بحسب الخدمة. ربط صفحة الدرابزين هذه بصفحات المدن يعطي المستخدمين ومحركات البحث مساراً أوضح بين الخدمة والأماكن التي تُقدَّم فيها.',
      'Мы устанавливаем стеклянные перила по всему Израилю — в городских квартирах, домах на склонах, частных виллах, офисах и на крышах. Проекты в Иерусалиме часто включают каменные парапеты и детали ремонта, в Тель-Авиве предпочитают чистые современные линии, а в Модиине дома часто сочетают семейное использование с открытой планировкой балконов. Сильная стратегия по локациям важна, потому что люди ищут по городу почти так же часто, как по услуге. Связь этой страницы о перилах со страницами городов даёт пользователям и поисковым системам более чёткий путь между услугой и местами, где она предоставляется.'
    ),
    highlights: localizedArray(
      ['Balcony glass railings', 'Staircase glass balustrades', 'Rooftop safety glazing', 'Laminated and tempered glass', 'Concealed base or bracket systems', 'Interior and exterior applications'],
      ['מעקות זכוכית למרפסות', 'בלוסטרדות זכוכית למדרגות', 'מעקות בטיחות לגגות', 'זכוכית רבודה ומחוסמת', 'מערכות בסיס נסתר או תושבות', 'התקנות לפנים ולחוץ'],
      ['درابزين زجاج للشرفات', 'حواجز زجاجية للدرج', 'زجاج سلامة للأسطح', 'زجاج مصفّح ومقسى', 'أنظمة قاعدة مخفية أو حوامل', 'تركيبات داخلية وخارجية'],
      ['Стеклянные перила для балконов', 'Стеклянные ограждения для лестниц', 'Защитное стекло для крыш', 'Ламинированное и закалённое стекло', 'Скрытый профиль или крепления', 'Применение внутри и снаружи']
    ),
    materialOptions: localizedArray(
      ['Laminated safety glass', 'Tempered glass panels', 'Stainless or black hardware', 'Optional top rail integration'],
      ['זכוכית בטיחות רבודה', 'פנלים מחוסמים', 'פרזול נירוסטה או שחור', 'אפשרות לשילוב מאחז יד עליון'],
      ['زجاج أمان مصفّح', 'ألواح مقساة', 'تركيبات ستانلس أو سوداء', 'إمكانية دمج مقبض علوي'],
      ['Ламинированное безопасное стекло', 'Закалённые стеклянные панели', 'Фурнитура из нержавейки или чёрная', 'Опциональный верхний поручень']
    ),
    faqs: [
      {
        question: localizedText(
          'What type of glass is best for a balcony railing?', 'איזה סוג זכוכית מתאים למעקה מרפסת?',
          'ما هو أفضل نوع زجاج لدرابزين الشرفة؟', 'Какое стекло лучше для перил балкона?'
        ),
        answer: localizedText(
          'Balcony railings usually require safety-focused glazing, often laminated and tempered, together with hardware suited to the edge condition and exposure.',
          'במעקות מרפסת נדרש בדרך כלל זיגוג בטיחותי, לרוב זכוכית רבודה ומחוסמת, יחד עם פרזול שמתאים לתנאי הקצה ולחשיפה למזג אוויר.',
          'يتطلب درابزين الشرفة غالباً زجاجاً يركز على السلامة، عادة مصفّح ومقسى، مع تركيبات تناسب حالة الحافة والتعرض للعوامل الجوية.',
          'Для балконных перил обычно требуется безопасное стекло, чаще всего ламинированное и закалённое, в сочетании с фурнитурой, подходящей под состояние кромки и воздействие погоды.'
        ),
      },
      {
        question: localizedText(
          'Can glass railings be installed on stairs as well?', 'האם אפשר להתקין מעקות זכוכית גם במדרגות?',
          'هل يمكن تركيب درابزين الزجاج على الدرج أيضاً؟', 'Можно ли устанавливать стеклянные перила на лестницах?'
        ),
        answer: localizedText(
          'Yes. Glass railings are widely used for interior staircases and need to be planned around the stair geometry, support points, and hand guidance requirements.',
          'כן. מעקות זכוכית נפוצים מאוד במדרגות פנימיות, וצריך לתכנן אותם לפי גיאומטריית המדרגות, נקודות העיגון ודרישות ההנחיה ביד.',
          'نعم. درابزين الزجاج يستخدم بشكل واسع في الدرج الداخلي، ويجب تخطيطه بحسب هندسة الدرج ونقاط الدعم ومتطلبات الإرشاد اليدوي.',
          'Да. Стеклянные перила широко используются для внутренних лестниц, и их нужно планировать с учётом геометрии лестницы, точек опоры и требований к поручню для руки.'
        ),
      },
      {
        question: localizedText(
          'Do frameless railings still use metal hardware?', 'האם מעקה ללא מסגרת עדיין כולל פרזול מתכתי?',
          'هل يستخدم الدرابزين بدون برواز تركيبات معدنية؟', 'Используется ли металлическая фурнитура в перилах без рамы?'
        ),
        answer: localizedText(
          'Usually yes. Even very clean frameless systems depend on hidden base channels, standoffs, or other engineered hardware to secure the glass safely.',
          'ברוב המקרים כן. גם מערכות שנראות נקיות וללא מסגרת נשענות על תעלות בסיס נסתרות, נקודות עיגון או פרזול הנדסי אחר שמחבר את הזכוכית בצורה בטוחה.',
          'في الغالب نعم. حتى الأنظمة النظيفة جداً بدون برواز تعتمد على قنوات قاعدة مخفية، أو نقاط تثبيت، أو تركيبات هندسية أخرى لتثبيت الزجاج بأمان.',
          'Как правило, да. Даже самые чистые на вид системы без рамы держатся на скрытых базовых профилях, точечных крепежах или другой инженерной фурнитуре, надёжно фиксирующей стекло.'
        ),
      },
    ],
    relatedLocations: ['jerusalem', 'tel-aviv', 'haifa'],
  },
  {
    serviceId: 'mirrors',
    projectCategoryId: 'mirrors',
    cloudinaryCategory: 'mirrors',
    slug: 'glass-mirrors',
    eyebrow: localizedText(
      'Bathroom, gym, decorative, and wall mirrors', 'מראות לחדרי רחצה, חדרי כושר וקירות דקורטיביים',
      'مرايا للحمامات وصالات الرياضة والديكور والجدران', 'Зеркала для ванной, спортзала и декоративные настенные'
    ),
    heroTitle: localizedText(
      'Custom Glass Mirrors', 'מראות זכוכית בהתאמה אישית',
      'مرايا زجاج بتصميم خاص', 'Зеркала на заказ'
    ),
    heroSubtitle: localizedText(
      'Custom mirror supply and installation for bathrooms, entry halls, living rooms, studios, gyms, and commercial interiors across Israel.',
      'אספקה והתקנה של מראות בהתאמה אישית לחדרי רחצה, מבואות, סלונים, סטודיו, חדרי כושר וחללים מסחריים בכל רחבי ישראל.',
      'توريد وتركيب مرايا بتصميم خاص للحمامات والمداخل وغرف المعيشة والاستوديوهات وصالات الرياضة والمساحات التجارية في جميع مناطق إسرائيل.',
      'Изготовление и установка зеркал на заказ для ванных комнат, прихожих, гостиных, студий, спортзалов и коммерческих помещений по всему Израилю.'
    ),
    metaTitle: localizedText(
      'Custom Mirrors in Israel | Bathroom, Gym, and Decorative Mirrors', 'מראות בהתאמה אישית בישראל | מראות לאמבטיה, חדר כושר ודקורציה',
      'مرايا بتصميم خاص في إسرائيل | مرايا حمامات وصالات رياضة وديكور', 'Зеркала на заказ в Израиле | Зеркала для ванной, спортзала и декора'
    ),
    metaDescription: localizedText(
      'Custom mirror installation in Jerusalem, Tel Aviv, Modiin, and across Israel. Bathroom mirrors, full wall mirrors, gym mirrors, LED options and precise fitting.',
      'התקנת מראות בהתאמה אישית בירושלים, תל אביב, מודיעין ובכל ישראל. מראות אמבטיה, קירות מראה, מראות לחדר כושר, תאורת LED והתקנה מדויקת.',
      'تركيب مرايا بتصميم خاص في القدس وتل أبيب وموديعين وفي جميع مناطق إسرائيل. مرايا حمامات، جدران مرايا كاملة، مرايا صالات رياضة، خيارات LED وتركيب دقيق.',
      'Изготовление и установка зеркал на заказ в Иерусалиме, Тель-Авиве, Модиине и по всему Израилю. Зеркала для ванной, зеркальные стены, зеркала для спортзала, LED-подсветка и точная установка.'
    ),
    keywords: localizedText(
      'custom mirrors, mirror installation, bathroom mirror installation, gym mirrors, decorative wall mirror, mirror wall Israel',
      'מראות בהתאמה אישית, התקנת מראות, מראה לאמבטיה, קיר מראות, מראות לחדר כושר, מראה דקורטיבית',
      'مرايا بتصميم خاص, تركيب مرايا, تركيب مرايا حمامات, مرايا صالة رياضة, مرايا ديكور, جدار مرايا إسرائيل',
      'зеркала на заказ, установка зеркал, зеркало для ванной, зеркальная стена, зеркала для спортзала, декоративное зеркало Израиль'
    ),
    intro: localizedText(
      'Mirror projects often get treated like a small accessory, but custom mirror installation is a specialized service with real design and technical impact. A mirror can brighten a narrow corridor, enlarge a compact bathroom, complete a dressing area, or turn a plain wall into a strong design feature. In gyms, studios, and commercial interiors, mirror layout affects both function and safety. Because mirror searches are so specific, a dedicated page gives Google much clearer signals around bathroom mirrors, full wall mirrors, gym mirrors, LED mirrors, and mirror installation. It also helps clients understand the difference between a ready-made product and a mirror cut, edged, and installed precisely for their space.',
      'פרויקטי מראות נתפסים לפעמים כתוספת קטנה, אבל התקנת מראות בהתאמה אישית היא שירות מקצועי עם השפעה אמיתית על תכנון ועיצוב החלל. מראה יכולה להאיר מסדרון צר, להגדיל תחושת מרחב בחדר רחצה, להשלים אזור הלבשה או להפוך קיר פשוט לאלמנט עיצובי חזק. בחדרי כושר, סטודיו וחללים מסחריים, מיקום המראות משפיע גם על הפונקציה וגם על הבטיחות. מאחר שחיפושים בתחום הזה מאוד ממוקדים, דף ייעודי נותן לגוגל אותות ברורים הרבה יותר סביב מראות לאמבטיה, קירות מראה, מראות לחדר כושר, מראות עם תאורה והתקנת מראות. הוא גם עוזר ללקוחות להבין מה ההבדל בין מוצר מדף לבין מראה שנחתכת, עוברת ליטוש ומותקנת בדיוק לפי המידה של החלל.',
      'كثيراً ما يُنظر لمشاريع المرايا كإضافة صغيرة، لكن تركيب المرايا بتصميم خاص هو خدمة متخصصة لها تأثير تصميمي وتقني حقيقي. المرآة يمكن أن تُضيء ممراً ضيقاً، تُكبّر حماماً صغيراً، تُكمّل غرفة تبديل ملابس، أو تحوّل جداراً عادياً إلى عنصر تصميم قوي. في صالات الرياضة والاستوديوهات والمساحات التجارية، يؤثر توضيع المرايا على الوظيفة والسلامة معاً. ولأن عمليات البحث عن المرايا محددة جداً، فإن صفحة مخصصة تعطي جوجل إشارات أوضح بكثير حول مرايا الحمامات وجدران المرايا الكاملة ومرايا صالات الرياضة والمرايا المزودة بإضاءة LED وتركيب المرايا. كما تساعد العملاء على فهم الفرق بين منتج جاهز ومرآة مقطوعة ومصقولة الحواف ومركّبة بدقة على مقاس المساحة.',
      'К зеркальным проектам часто относятся как к мелкому аксессуару, но установка зеркал на заказ — это специализированная услуга с реальным влиянием на дизайн и технические детали. Зеркало может осветить узкий коридор, увеличить тесную ванную, дополнить гардеробную зону или превратить простую стену в яркий элемент дизайна. В спортзалах, студиях и коммерческих интерьерах расположение зеркал влияет и на функциональность, и на безопасность. Поскольку запросы о зеркалах очень конкретны, отдельная страница даёт Google гораздо более чёткие сигналы о зеркалах для ванной, зеркальных стенах, зеркалах для спортзала, зеркалах с LED-подсветкой и установке зеркал. Она также помогает клиентам понять разницу между готовым изделием и зеркалом, вырезанным, отполированным по краю и точно установленным под конкретное помещение.'
    ),
    overview: localizedText(
      'Our mirror service covers both residential and commercial spaces. In homes, we install bathroom mirrors above vanities, full height mirrors for bedrooms and closets, and decorative mirrors for entrances, dining rooms, and living spaces. In commercial settings we handle gym walls, studio mirrors, retail mirrors, salon mirrors, and office details where scale and alignment matter. Precision is important because mirror edges, sockets, lighting, tile joints, and neighboring cabinetry all need to work together visually. That level of detail makes the page stronger for SEO and more useful for visitors. Instead of only seeing a photo, they get written information about mirror types, edge finishes, mounting methods, and the best use cases for each option.',
      'שירות המראות שלנו כולל גם חללים פרטיים וגם מסחריים. בבתים אנחנו מתקינים מראות אמבטיה מעל ארונות, מראות בגובה מלא לחדרי שינה וחדרי ארונות, ומראות דקורטיביות למבואות, פינות אוכל וסלונים. בחללים מסחריים אנחנו מבצעים קירות מראה לחדרי כושר, מראות לסטודיו, מראות לחנויות, לסלונים ולעמדות עבודה שבהן קנה המידה והיישור חשובים במיוחד. הדיוק משמעותי כי שפת המראה צריכה לעבוד נכון עם שקעים, תאורה, פוגות, נגרות וחיפויים סמוכים. רמת הפירוט הזו מחזקת גם את הקידום האורגני וגם את חוויית המשתמש, כי במקום לראות רק תמונה, המבקר מקבל מידע כתוב על סוגי מראות, גימורי קצה, שיטות התקנה והשימושים המתאימים לכל אפשרות.',
      'تشمل خدمة المرايا لدينا المساحات السكنية والتجارية معاً. في المنازل، نُركّب مرايا حمامات فوق الخزائن، ومرايا بارتفاع كامل لغرف النوم والخزائن، ومرايا ديكور للمداخل وغرف الطعام وغرف المعيشة. في المساحات التجارية، نتولى جدران مرايا صالات الرياضة، مرايا الاستوديو، مرايا المحال، مرايا الصالونات، وتفاصيل المكاتب حيث يهم المقياس والمحاذاة بشكل خاص. الدقة مهمة لأن حافة المرآة يجب أن تتناسق مع المقابس والإضاءة وفواصل البلاط والنجارة المجاورة. هذا المستوى من التفصيل يقوي الصفحة لتحسين محركات البحث ويجعلها أكثر فائدة للزوار، فبدلاً من رؤية صورة فقط، يحصلون على معلومات مكتوبة عن أنواع المرايا وتشطيبات الحواف وطرق التركيب وأفضل استخدام لكل خيار.',
      'Наша услуга по зеркалам охватывает и жильё, и коммерческие помещения. В домах мы устанавливаем зеркала над раковинами в ванной, зеркала в полный рост для спален и гардеробных, декоративные зеркала для прихожих, столовых и гостиных. В коммерческих интерьерах мы делаем зеркальные стены для спортзалов, зеркала для студий, магазинов, салонов и офисов, где важны масштаб и точное выравнивание. Точность важна, потому что край зеркала, розетки, освещение, швы плитки и соседняя мебель должны визуально сочетаться. Такая детальность усиливает страницу для SEO и делает её полезнее для посетителей: вместо одной фотографии они получают текст о видах зеркал, отделке краёв, способах монтажа и подходящих сценариях использования.'
    ),
    options: localizedText(
      'A custom mirror can be polished, beveled, backlit, anti-fog prepared, or shaped to fit a niche, column, or furniture line. In bathrooms, moisture resistance and integration with lighting matter. In gyms and studios, panel sizing, joint alignment, and safe wall fixing are usually the priority. Decorative mirrors may focus more on edge treatment, tint, or how the mirror reflects a key part of the room. Explaining these distinctions on the page improves the site’s keyword coverage around bathroom mirror installation, LED mirror walls, gym mirrors, and custom decorative mirrors. It also helps clients choose the right product instead of guessing from a single gallery image.',
      'מראה בהתאמה אישית יכולה להגיע עם ליטוש קצוות, פאזה, תאורה אחורית, הכנה נגד אדים או צורה מיוחדת שמתאימה לגומחה, לעמוד או לקו נגרות. בחדרי רחצה חשובים עמידות ללחות וחיבור נכון לתאורה. בחדרי כושר ובסטודיו, הדגש עובר לעיתים לגודל הפנלים, ליישור החיבורים ולעיגון בטוח לקיר. מראות דקורטיביות יכולות להישען יותר על טיפול בקצה, על גוון או על האופן שבו הן מחזירות חלק מסוים מהחלל. כשמסבירים את ההבדלים האלה בדף עצמו, מתקבל כיסוי טוב יותר לביטויי חיפוש כמו מראה לאמבטיה, קיר מראות עם תאורה, מראות לחדר כושר או מראה דקורטיבית בהתאמה אישית. בנוסף, זה עוזר ללקוחות לבחור נכון במקום להסתמך רק על תמונת גלריה אחת.',
      'يمكن للمرآة المخصصة أن تأتي مصقولة الحواف، بفازة، بإضاءة خلفية، معالَجة ضد التبخر، أو مشكّلة لتلائم فجوة أو عموداً أو خط نجارة. في الحمامات، تهم مقاومة الرطوبة والتكامل مع الإضاءة. في صالات الرياضة والاستوديوهات، يكون التركيز غالباً على مقاس الألواح ومحاذاة الفواصل والتثبيت الآمن على الحائط. المرايا الديكورية قد تعتمد أكثر على معالجة الحافة أو اللون أو الجزء الذي تعكسه من الغرفة. شرح هذه الفروقات في الصفحة يحسّن تغطية الموقع لكلمات البحث حول تركيب مرايا الحمامات، جدران المرايا بإضاءة LED، مرايا صالات الرياضة، والمرايا الديكورية المخصصة. كما يساعد العملاء على اختيار المنتج الصحيح بدلاً من التخمين من صورة معرض واحدة.',
      'Зеркало на заказ может быть с полированным краем, фацетом, подсветкой, антизапотевающим покрытием или вырезано по форме нишы, колонны или мебельной линии. В ванных комнатах важна влагостойкость и совместимость с освещением. В спортзалах и студиях приоритет обычно отдают размеру панелей, выравниванию швов и надёжному креплению к стене. Декоративные зеркала чаще делают акцент на обработке края, оттенке или том, что именно отражается в конкретной части комнаты. Объяснение этих различий на странице улучшает покрытие запросов об установке зеркал в ванной, зеркальных стенах с LED-подсветкой, зеркалах для спортзала и декоративных зеркалах на заказ. Это также помогает клиентам выбрать правильный продукт, а не гадать по одной фотографии в галерее.'
    ),
    process: localizedText(
      'Measurement is especially important with mirrors because even small deviations become visible next to cabinetry, stone tops, wall lights, and tiled surfaces. We measure on site, account for cutouts and obstacles, plan the edge finish, and install the mirror so that reflections line up cleanly with the rest of the room. For large gym or studio installations, this can include panel sequencing and careful placement of joints. For bathroom mirrors, we coordinate with vanities, faucets, and wall lights. Detailed written content around the process makes this page much more useful for search engines and for customers who want a realistic sense of what happens before installation day.',
      'המדידה חשובה במיוחד במראות כי גם סטייה קטנה נראית מיד ליד נגרות, משטחי אבן, גופי תאורה וחיפויים. אנחנו מודדים בשטח, מתייחסים לפתחים, לשקעים ולמכשולים, מתכננים את גימור הקצה ומתקינים את המראה כך שההשתקפות תשתלב בצורה נקייה עם שאר מרכיבי החלל. בהתקנות גדולות לחדרי כושר או סטודיו זה כולל גם סדר פנלים ותכנון נכון של החיבורים. במראות אמבטיה אנחנו מתאמים עם הארון, הברזים וגופי התאורה. תיאור מפורט של תהליך העבודה הופך את הדף להרבה יותר שימושי גם למנועי חיפוש וגם ללקוחות שרוצים להבין מה קורה בפועל לפני יום ההתקנה.',
      'القياس مهم بشكل خاص في المرايا لأن أي انحراف صغير يصبح واضحاً بجانب النجارة أو أسطح الحجر أو إضاءة الحائط أو البلاط. نقيس في الموقع، ونأخذ بالحسبان الفتحات والعوائق، ونخطط تشطيب الحافة، ونركّب المرآة بحيث تتناسق الانعكاسات بشكل نظيف مع باقي الغرفة. في التركيبات الكبيرة لصالات الرياضة أو الاستوديوهات، قد يشمل ذلك ترتيب الألواح ووضع الفواصل بدقة. في مرايا الحمامات، ننسّق مع الخزائن والحنفيات وإضاءة الحائط. هذا الوصف التفصيلي لعملية العمل يجعل الصفحة أكثر فائدة لمحركات البحث وللعملاء الذين يريدون فهماً واقعياً لما يحدث قبل يوم التركيب.',
      'Замер особенно важен для зеркал, потому что даже небольшое отклонение становится заметным рядом с мебелью, каменными столешницами, светильниками и плиткой. Мы измеряем на месте, учитываем вырезы и препятствия, продумываем обработку края и устанавливаем зеркало так, чтобы отражения аккуратно сочетались с остальной частью комнаты. При крупных установках для спортзалов или студий это может включать порядок панелей и точное расположение швов. Для зеркал в ванной мы согласовываем работу с раковинами, смесителями и светильниками. Подробное описание процесса делает страницу полезнее для поисковых систем и для клиентов, которые хотят реально понимать, что происходит до дня установки.'
    ),
    benefits: localizedText(
      'Mirrors add more than reflection. They can improve light distribution, expand visual depth, reinforce symmetry in a bathroom or corridor, and give commercial interiors a more complete finish. They are also one of the easiest ways to improve a room without adding bulk. This benefits section supports searches like full wall mirror, mirror for small bathroom, custom vanity mirror, or gym mirror installation because it answers the design problem behind those phrases. For the user, it clarifies why exact sizing, clean edges, and installation quality matter more than just buying the cheapest mirror panel available.',
      'מראות נותנות הרבה יותר מהשתקפות. הן משפרות את פיזור האור, מרחיבות עומק ויזואלי, מחזקות סימטריה בחדר רחצה או במסדרון ונותנות לחללים מסחריים תחושת גמר שלמה יותר. הן גם אחת הדרכים הפשוטות לשדרג חלל בלי להוסיף נפח. החלק הזה תומך בחיפושים כמו קיר מראה, מראה לחדר רחצה קטן, מראת ארון בהתאמה אישית או התקנת מראות לחדר כושר, כי הוא עונה על הבעיה העיצובית שמאחורי הביטויים האלה. עבור המשתמש, הוא מסביר למה מידה מדויקת, קצה נקי ואיכות התקנה חשובים יותר מאשר רכישת פנל המראה הזול ביותר שאפשר למצוא.',
      'المرايا تضيف أكثر من الانعكاس فقط. يمكنها تحسين توزيع الضوء، توسيع العمق البصري، تقوية التناسق في الحمام أو الممر، وإعطاء المساحات التجارية تشطيباً أكثر اكتمالاً. وهي أيضاً من أسهل طرق تحسين الغرفة دون إضافة حجم. هذا القسم يدعم عمليات بحث مثل جدار مرايا كامل، مرآة لحمام صغير، مرآة خزانة مخصصة، أو تركيب مرايا صالة رياضة، لأنه يجيب على المشكلة التصميمية التي تقف خلف هذه العبارات. وللمستخدم، يوضح لماذا المقاس الدقيق والحافة النظيفة وجودة التركيب أهم من شراء أرخص لوح مرآة متوفر.',
      'Зеркала дают больше, чем просто отражение. Они улучшают распределение света, увеличивают визуальную глубину, усиливают симметрию в ванной или коридоре и придают коммерческим интерьерам более завершённый вид. Это также один из самых простых способов улучшить помещение без лишнего объёма. Этот раздел отвечает на запросы вроде зеркальная стена целиком, зеркало для маленькой ванной, зеркало над раковиной на заказ или установка зеркал для спортзала, потому что отвечает на дизайнерскую задачу за этими фразами. Для пользователя он объясняет, почему точный размер, чистый край и качество установки важнее покупки самой дешёвой зеркальной панели.'
    ),
    areasSummary: localizedText(
      'We install mirrors in Jerusalem, Tel Aviv, Modiin, and throughout Israel for homes, fitness spaces, offices, salons, and retail interiors. Local pages matter here because search behavior is strongly city-based: many clients look for bathroom mirror Jerusalem, gym mirrors Tel Aviv, or custom mirrors Modiin. Connecting this service page to location pages helps the site match those searches with stronger relevance.',
      'אנחנו מתקינים מראות בירושלים, תל אביב, מודיעין ובכל רחבי ישראל לבתים פרטיים, חללי כושר, משרדים, מספרות וחנויות. לדפי אזור יש כאן חשיבות מיוחדת כי דפוס החיפוש הוא מאוד מקומי: לקוחות רבים מחפשים מראה לאמבטיה בירושלים, מראות לחדר כושר בתל אביב או מראות בהתאמה אישית במודיעין. החיבור בין דף השירות לבין דפי הערים משפר את הרלוונטיות של האתר לחיפושים האלה.',
      'نُركّب المرايا في القدس وتل أبيب وموديعين وفي جميع مناطق إسرائيل للمنازل ومساحات اللياقة والمكاتب والصالونات والمحال التجارية. صفحات المواقع مهمة هنا لأن سلوك البحث محلي جداً: كثير من العملاء يبحثون عن مرآة حمام القدس، مرايا صالة رياضة تل أبيب، أو مرايا مخصصة موديعين. ربط صفحة الخدمة هذه بصفحات المواقع يساعد الموقع على مطابقة هذه العمليات بصلة أقوى.',
      'Мы устанавливаем зеркала в Иерусалиме, Тель-Авиве, Модиине и по всему Израилю — для домов, фитнес-залов, офисов, салонов и торговых помещений. Локальные страницы здесь особенно важны, потому что поведение поиска сильно привязано к городу: многие клиенты ищут зеркало для ванной Иерусалим, зеркала для спортзала Тель-Авив или зеркала на заказ Модиин. Связь этой страницы услуги со страницами городов помогает сайту точнее соответствовать таким запросам.'
    ),
    highlights: localizedArray(
      ['Bathroom vanity mirrors', 'Full-wall gym and studio mirrors', 'Decorative entry and living room mirrors', 'LED and backlit options', 'Beveled or polished edges', 'Custom cutouts for sockets and lighting'],
      ['מראות לארונות אמבטיה', 'קירות מראה לחדרי כושר וסטודיו', 'מראות דקורטיביות למבואות וסלונים', 'אפשרויות LED ותאורה אחורית', 'פאזות או ליטוש קצוות', 'חיתוכים מיוחדים לשקעים ותאורה'],
      ['مرايا خزائن الحمامات', 'جدران مرايا كاملة لصالات الرياضة والاستوديو', 'مرايا ديكور للمداخل وغرف المعيشة', 'خيارات LED وإضاءة خلفية', 'حواف مفازة أو مصقولة', 'فتحات مخصصة للمقابس والإضاءة'],
      ['Зеркала над раковиной в ванной', 'Зеркальные стены для спортзала и студии', 'Декоративные зеркала для прихожей и гостиной', 'LED-подсветка и встроенное освещение', 'Полированный или фацетный край', 'Вырезы под розетки и светильники']
    ),
    materialOptions: localizedArray(
      ['Standard and extra-clear mirror glass', 'Polished edge finishing', 'Optional bevel detailing', 'Anti-fog and backlit bathroom solutions'],
      ['זכוכית מראה סטנדרטית ואקסטרה קליר', 'ליטוש קצוות', 'אפשרות לפאזה דקורטיבית', 'פתרונות נגד אדים ותאורה לחדרי רחצה'],
      ['زجاج مرايا قياسي وإكسترا كلير', 'تشطيب حواف مصقول', 'إمكانية إضافة فازة ديكور', 'حلول مضادة للتبخر وإضاءة لحمامات'],
      ['Стандартное и экстра-прозрачное зеркальное стекло', 'Полированная обработка края', 'Опциональная декоративная фацетка', 'Антизапотевающие и подсвеченные решения для ванной']
    ),
    faqs: [
      {
        question: localizedText(
          'Can you install full-wall mirrors for gyms or studios?', 'האם אפשר להתקין קיר מראות מלא לחדר כושר או סטודיו?',
          'هل يمكنكم تركيب جدران مرايا كاملة لصالات الرياضة أو الاستوديوهات؟', 'Можно ли установить зеркальную стену целиком для спортзала или студии?'
        ),
        answer: localizedText(
          'Yes. We measure large mirror walls carefully, plan panel layout, and install them with attention to alignment, safety, and visual continuity.',
          'כן. אנחנו מודדים קירות מראה גדולים בקפידה, מתכננים את פריסת הפנלים ומתקינים אותם תוך הקפדה על יישור, בטיחות ורצף חזותי.',
          'نعم. نقيس جدران المرايا الكبيرة بدقة، ونخطط توزيع الألواح، ونركّبها مع الاهتمام بالمحاذاة والسلامة والاستمرارية البصرية.',
          'Да. Мы тщательно измеряем большие зеркальные стены, планируем раскладку панелей и устанавливаем их с учётом выравнивания, безопасности и визуальной непрерывности.'
        ),
      },
      {
        question: localizedText(
          'Do bathroom mirrors need special preparation?', 'האם מראות אמבטיה דורשות הכנה מיוחדת?',
          'هل تحتاج مرايا الحمامات لتحضير خاص؟', 'Нужна ли особая подготовка для зеркал в ванной?'
        ),
        answer: localizedText(
          'In many cases yes. Bathroom mirrors need to work with lighting, moisture, sockets, and vanity alignment, so on-site measurement is important.',
          'במקרים רבים כן. מראות אמבטיה צריכות לעבוד נכון עם תאורה, לחות, שקעים ויישור מול הארון, ולכן מדידה בשטח חשובה מאוד.',
          'في كثير من الحالات نعم. مرايا الحمامات يجب أن تتناسق مع الإضاءة والرطوبة والمقابس ومحاذاة الخزانة، لذا القياس في الموقع مهم جداً.',
          'В большинстве случаев да. Зеркала в ванной должны учитывать освещение, влажность, розетки и выравнивание с раковиной, поэтому замер на месте очень важен.'
        ),
      },
      {
        question: localizedText(
          'Can mirrors be custom-shaped or backlit?', 'האם אפשר לייצר מראות בצורה מיוחדת או עם תאורה?',
          'هل يمكن تصنيع مرايا بشكل مخصص أو بإضاءة خلفية؟', 'Можно ли изготовить зеркало особой формы или с подсветкой?'
        ),
        answer: localizedText(
          'Yes. Depending on the project, mirrors can be shaped, edge-finished, and prepared for LED or other integrated lighting solutions.',
          'כן. בהתאם לפרויקט, אפשר לייצר מראות בצורה מיוחדת, עם גימור קצה מותאם ועם הכנה לתאורת LED או פתרונות תאורה משולבים אחרים.',
          'نعم. بحسب المشروع، يمكن تصنيع مرايا بشكل خاص، بتشطيب حواف مخصص، وتحضيرها لإضاءة LED أو حلول إضاءة مدمجة أخرى.',
          'Да. В зависимости от проекта зеркала могут быть выполнены особой формы, с индивидуальной обработкой края и подготовкой под LED или другую встроенную подсветку.'
        ),
      },
    ],
    relatedLocations: ['jerusalem', 'tel-aviv', 'modiin'],
  },
  {
    serviceId: 'storefront-glass',
    projectCategoryId: 'storefront',
    cloudinaryCategory: 'storefronts',
    slug: 'shop-front-glass',
    eyebrow: localizedText(
      'Retail and commercial glazing', 'חזיתות זכוכית לעסקים וחנויות',
      'زجاج تجاري للمحال والشركات', 'Коммерческое и торговое стекло'
    ),
    heroTitle: localizedText(
      'Shop Front Glass', 'חזיתות זכוכית לחנויות',
      'واجهات زجاجية للمحال', 'Витражные фасады для магазинов'
    ),
    heroSubtitle: localizedText(
      'Commercial storefront glass installation for shops, offices, showrooms, clinics, restaurants, and street-facing businesses across Israel.',
      'התקנת חזיתות זכוכית מסחריות לחנויות, משרדים, אולמות תצוגה, מרפאות, מסעדות ועסקים עם חזית לרחוב בכל רחבי ישראל.',
      'تركيب واجهات زجاجية تجارية للمحال والمكاتب وصالات العرض والعيادات والمطاعم والأعمال التي تواجه الشارع في جميع مناطق إسرائيل.',
      'Установка коммерческих витражных фасадов для магазинов, офисов, шоурумов, клиник, ресторанов и предприятий с выходом на улицу по всему Израилю.'
    ),
    metaTitle: localizedText(
      'Shop Front Glass in Israel | Storefront and Commercial Glass', 'חזיתות זכוכית לחנויות בישראל | זכוכית מסחרית וויטרינות',
      'واجهات زجاجية للمحال في إسرائيل | زجاج تجاري وفاترينات', 'Витражные фасады в Израиле | Коммерческое стекло и витрины'
    ),
    metaDescription: localizedText(
      'Storefront glass installation in Jerusalem, Tel Aviv, Modiin, and across Israel. Commercial glass fronts, entry systems, display glazing and safety glass solutions.',
      'התקנת חזיתות זכוכית לחנויות בירושלים, תל אביב, מודיעין ובכל ישראל. ויטרינות, דלתות כניסה, זכוכית תצוגה ופתרונות זכוכית בטיחותיים.',
      'تركيب واجهات زجاجية للمحال في القدس وتل أبيب وموديعين وفي جميع مناطق إسرائيل. واجهات زجاجية تجارية، أنظمة دخول، زجاج عرض، وحلول زجاج أمان.',
      'Установка витражных фасадов в Иерусалиме, Тель-Авиве, Модиине и по всему Израилю. Коммерческие стеклянные фасады, входные системы, витринное и защитное стекло.'
    ),
    keywords: localizedText(
      'shop front glass, storefront glass installation, commercial glass front, retail glass installation, display window glass, storefront Jerusalem, storefront Tel Aviv',
      'חזית זכוכית לחנות, ויטרינה לעסק, התקנת חזית מסחרית, זכוכית תצוגה, חזיתות חנויות ירושלים, חזיתות זכוכית תל אביב',
      'واجهة زجاجية للمحل, فاترينة للمحل, تركيب واجهة تجارية, زجاج عرض, واجهات محال القدس, واجهات زجاجية تل أبيب',
      'витражный фасад магазина, установка витрины, коммерческий стеклянный фасад, витринное стекло, витражный фасад Иерусалим, витрина Тель-Авив'
    ),
    intro: localizedText(
      'A commercial facade does more than close the front of a building. It shapes first impressions, controls visibility into the business, affects daylight, and influences how secure and professional the premises feel from the street. That is why storefront glass deserves a dedicated SEO page instead of being buried inside a general services block. Searchers looking for shop front glass, commercial glass facade installation, display window replacement, or retail entrance glazing have a clear business intent. They need to know what kinds of storefront systems are available, how safety glass choices work, and whether the installer can handle active commercial sites. Our storefront work covers new installations, upgrades, and tailored glazing solutions for businesses that want a sharp, reliable front-facing finish.',
      'חזית מסחרית עושה הרבה יותר מלסגור את הפתח של המבנה. היא יוצרת רושם ראשוני, קובעת את רמת החשיפה לעסק, משפיעה על אור טבעי וקובעת עד כמה המקום נראה בטוח, מקצועי ומזמין מהרחוב. בגלל זה חזיתות זכוכית לעסקים צריכות דף SEO נפרד ולא רק אזכור בתוך רשימת שירותים כללית. אנשים שמחפשים ויטרינה לחנות, התקנת חזית זכוכית מסחרית, החלפת חלון ראווה או דלת כניסה מזכוכית מגיעים עם כוונת רכישה ברורה. הם רוצים להבין אילו מערכות קיימות, איך בוחרים זכוכית בטיחותית והאם המתקין יודע לעבוד בסביבת עסק פעיל. השירות שלנו כולל חזיתות חדשות, שדרוגים ופתרונות זכוכית מותאמים לעסקים שרוצים מראה חד ואמין כלפי הרחוב.',
      'الواجهة التجارية تفعل أكثر بكثير من إغلاق فتحة المبنى. هي تصنع الانطباع الأول، وتتحكم في مدى الرؤية إلى داخل العمل، وتؤثر على الإضاءة الطبيعية، وتحدد إلى أي درجة يبدو المكان آمناً ومحترفاً ومرحّباً من الشارع. لهذا السبب تستحق واجهات الزجاج التجارية صفحة SEO مخصصة بدلاً من أن تُدفن داخل قسم خدمات عام. من يبحث عن واجهة زجاجية للمحل، تركيب واجهة زجاجية تجارية، استبدال واجهة عرض، أو زجاج مدخل تجاري، يأتي بنية شراء واضحة. يريدون معرفة أنواع أنظمة الواجهات المتوفرة، وكيف تُختار الزجاج الآمن، وهل يستطيع المُركِّب العمل في موقع تجاري نشط. عملنا في الواجهات يشمل تركيبات جديدة وترقيات وحلول زجاج مخصصة للأعمال التي تريد مظهراً حاداً وموثوقاً من الشارع.',
      'Коммерческий фасад делает гораздо больше, чем просто закрывает проём здания. Он формирует первое впечатление, определяет уровень видимости внутрь бизнеса, влияет на естественное освещение и на то, насколько безопасным и профессиональным выглядит заведение с улицы. Именно поэтому витражные фасады заслуживают отдельной SEO-страницы, а не упоминания внутри общего раздела услуг. Те, кто ищет витражный фасад магазина, установку коммерческого стеклянного фасада, замену витринного окна или остекление входа в магазин, приходят с явным деловым намерением. Им нужно знать, какие системы фасадов существуют, как выбирается защитное стекло и может ли установщик работать на действующем коммерческом объекте. Наша работа включает новые установки, модернизацию и индивидуальные решения для бизнесов, которым нужен чёткий и надёжный фасад.'
    ),
    overview: localizedText(
      'Storefront projects often combine large glazed areas, entry doors, locks, metal framing, and precise interface details with stone, aluminum, or existing construction. Some businesses want maximum transparency to show products and interior design. Others need a balance between openness, privacy strips, branding graphics, or stronger security glazing. Because each frontage works differently, the service page explains the decision points instead of reducing everything to one label. This written content is valuable for Google because it reinforces relevance around storefront glass installation, shopfront glazing, commercial entry systems, and display windows. It is equally useful for business owners who are comparing an upgrade, fitting out a new location, or planning a renovation while staying open to customers.',
      'פרויקטי חזית מסחרית משלבים בדרך כלל שטחי זכוכית גדולים, דלתות כניסה, מנעולים, פרופילי מתכת וחיבורים מדויקים לאבן, לאלומיניום או לבנייה קיימת. יש עסקים שמחפשים מקסימום שקיפות כדי לחשוף מוצרים ועיצוב פנים, ואחרים צריכים איזון בין פתיחות, פסי פרטיות, מיתוג מודפס או שכבת בטיחות גבוהה יותר. מכיוון שכל חזית מתפקדת אחרת, דף השירות מסביר את נקודות ההחלטה במקום לצמצם הכל לכותרת אחת. מבחינת גוגל זה מחזק רלוונטיות סביב התקנת חזיתות זכוכית, ויטרינות, דלתות כניסה מסחריות וחלונות ראווה. מבחינת בעל העסק, זה עוזר להבין את האפשרויות לפני שדרוג, פתיחת סניף חדש או שיפוץ תוך כדי פעילות שוטפת.',
      'مشاريع الواجهات غالباً تجمع بين مساحات زجاجية كبيرة، أبواب دخول، أقفال، براويز معدنية، وتفاصيل ربط دقيقة مع الحجر أو الألمنيوم أو البناء القائم. بعض الأعمال تريد أقصى درجة من الشفافية لعرض المنتجات والتصميم الداخلي. وأخرى تحتاج توازناً بين الانفتاح وأشرطة الخصوصية والرسومات التجارية أو زجاج أمان أقوى. ولأن كل واجهة تعمل بشكل مختلف، تشرح صفحة الخدمة نقاط القرار بدلاً من تبسيط كل شيء لعنوان واحد. هذا المحتوى المكتوب مهم لجوجل لأنه يعزز الصلة حول تركيب واجهات الزجاج، الفاترينات، أنظمة الدخول التجارية، ونوافذ العرض. وهو مفيد بالقدر نفسه لأصحاب الأعمال الذين يقارنون بين ترقية، أو تجهيز موقع جديد، أو تخطيط تجديد مع الاستمرار في استقبال الزبائن.',
      'Проекты фасадов часто сочетают большие стеклянные поверхности, входные двери, замки, металлический профиль и точное сопряжение с камнем, алюминием или существующей конструкцией. Одним бизнесам нужна максимальная прозрачность для демонстрации товаров и интерьера. Другим — баланс между открытостью, полосами приватности, брендированной графикой или более прочным защитным стеклом. Поскольку каждый фасад работает по-своему, страница услуги объясняет точки принятия решений, а не сводит всё к одному названию. Такой текстовый контент важен для Google, потому что усиливает релевантность по запросам об установке витражных фасадов, остеклении магазинов, коммерческих входных системах и витринных окнах. Он также полезен владельцам бизнеса, которые сравнивают варианты модернизации, оснащения новой точки или ремонта без закрытия для клиентов.'
    ),
    options: localizedText(
      'Commercial glass can involve tempered panels, laminated safety glass, framed or frameless entrances, sidelights, transoms, and branded privacy films. We help clients choose the right combination based on traffic, visibility, security, and maintenance. Retail storefronts may prioritize display clarity, while clinics, salons, and offices often need a softer balance between openness and privacy. Restaurants and hospitality spaces may need entrance solutions that coordinate with airflow, seating, and street presentation. Explaining those use cases in text gives the site stronger coverage for business-facing search terms and makes the page more persuasive for owners who need more than a gallery image before they request a quote.',
      'זכוכית מסחרית יכולה לכלול פנלים מחוסמים, זכוכית רבודה, כניסות ממוסגרות או ללא מסגרת, חלונות צד, טרנסומים וסרטי פרטיות ממותגים. אנחנו מסייעים לבחור את השילוב הנכון לפי תנועה, נראות, אבטחה ותחזוקה. חנויות קמעונאיות מדגישות לרוב שקיפות ותצוגה, בעוד שמרפאות, מספרות ומשרדים מחפשים איזון רך יותר בין פתיחות לפרטיות. מסעדות ועסקי אירוח צריכים לפעמים מערכת כניסה שמתאימה גם לזרימת אוויר, לישיבה ולנוכחות ברחוב. כשהשימושים האלה מוסברים בטקסט, האתר מקבל כיסוי טוב יותר למונחי חיפוש עסקיים, והדף הופך למשכנע יותר עבור בעלי עסקים שצריכים יותר מתמונת גלריה אחת לפני בקשת הצעה.',
      'الزجاج التجاري يمكن أن يشمل ألواحاً مقساة، زجاجاً أمنياً مصفّحاً، مداخل بإطار أو بدون إطار، نوافذ جانبية، فتحات علوية، وأفلام خصوصية بطابع تجاري. نساعد العملاء على اختيار التركيبة الصحيحة بحسب الحركة والرؤية والأمان والصيانة. المحال التجارية غالباً تُعطي الأولوية لوضوح العرض، بينما العيادات والصالونات والمكاتب تحتاج توازناً ألطف بين الانفتاح والخصوصية. المطاعم وأماكن الضيافة قد تحتاج حلول دخول تتناسق مع تدفق الهواء والجلوس والظهور على الشارع. شرح هذه الاستخدامات في النص يعطي الموقع تغطية أقوى لكلمات بحث الأعمال، ويجعل الصفحة أكثر إقناعاً لأصحاب الأعمال الذين يحتاجون أكثر من صورة معرض قبل طلب عرض سعر.',
      'Коммерческое стекло может включать закалённые панели, ламинированное защитное стекло, обрамлённые или безрамные входы, боковые витражи, фрамуги и брендированную защитную плёнку. Мы помогаем выбрать правильное сочетание в зависимости от потока людей, видимости, безопасности и обслуживания. Розничным магазинам часто важна максимальная прозрачность витрины, а клиникам, салонам и офисам нужен более мягкий баланс между открытостью и приватностью. Ресторанам и заведениям гостеприимства может требоваться входное решение, согласованное с вентиляцией, посадочными местами и видом с улицы. Объяснение этих сценариев в тексте даёт сайту более широкое покрытие деловых поисковых запросов и делает страницу убедительнее для владельцев, которым нужно больше, чем просто фото из галереи, перед запросом цены.'
    ),
    process: localizedText(
      'Storefront installation starts with accurate site inspection because commercial fronts often include irregular thresholds, existing profiles, signage constraints, and active customer circulation. We measure openings, discuss the entrance pattern, check hardware requirements, and plan the glazing so the frontage feels consistent and operates reliably. In some projects the goal is a fresh new facade. In others, the job is a replacement or upgrade that needs to respect the existing structure and minimize disruption. Detailed process text is important SEO content because it answers exactly what business owners want to know when they search for commercial glass installers near them.',
      'התקנת חזית מסחרית מתחילה בבדיקת שטח מדויקת, כי בחזיתות של עסקים יש לעיתים ספים לא אחידים, פרופילים קיימים, מגבלות שילוט ותנועת לקוחות פעילה. אנחנו מודדים את הפתח, בודקים את אופי הכניסה, מוודאים דרישות פרזול ומתכננים את הזיגוג כך שהחזית תרגיש אחידה ותעבוד בצורה אמינה. בחלק מהפרויקטים המטרה היא ליצור חזית חדשה לגמרי, ובאחרים מדובר בהחלפה או בשדרוג שצריך להתאים למבנה קיים ולצמצם הפרעה לעסק. תיאור מפורט של התהליך הוא גם תוכן SEO חשוב, כי הוא עונה בדיוק על מה שבעלי עסקים רוצים לדעת כשהם מחפשים מתקין זכוכית מסחרית בסביבה שלהם.',
      'تركيب الواجهة يبدأ بفحص دقيق للموقع، لأن الواجهات التجارية غالباً تتضمن عتبات غير منتظمة، براويز قائمة، قيود لوحات إعلانية، وحركة زبائن نشطة. نقيس الفتحات، نناقش نمط الدخول، نتحقق من متطلبات التركيبات، ونخطط الزجاج بحيث تبدو الواجهة متناسقة وتعمل بشكل موثوق. في بعض المشاريع الهدف واجهة جديدة بالكامل، وفي أخرى استبدال أو ترقية يجب أن تحترم البناء القائم وتقلل التعطيل. نص العملية المفصّل محتوى SEO مهم لأنه يجيب بالضبط على ما يريد أصحاب الأعمال معرفته عند البحث عن مُركِّب زجاج تجاري قريب منهم.',
      'Установка фасада начинается с точного осмотра объекта, потому что коммерческие фасады часто имеют неровные пороги, существующий профиль, ограничения по вывескам и активный поток клиентов. Мы измеряем проёмы, обсуждаем тип входа, проверяем требования к фурнитуре и планируем остекление так, чтобы фасад выглядел цельно и надёжно работал. В одних проектах цель — полностью новый фасад, в других — замена или модернизация с уважением к существующей конструкции и минимальным нарушением работы. Подробный текст о процессе — важный SEO-контент, потому что отвечает именно на то, что владельцы бизнеса хотят знать при поиске установщика коммерческого стекла рядом с ними.'
    ),
    benefits: localizedText(
      'A strong storefront can improve visibility, make the business feel cleaner and more established, and create a more professional handoff between street and interior. It can also make product presentation more effective and support branding, lighting, and customer confidence. Those practical benefits are closely tied to search intent. People searching for storefront glass do not just want “glass”; they want a better business front. The more clearly a page explains those outcomes, the better it performs for both SEO and conversion. It becomes easier for a visitor to understand why custom storefront glazing is different from a generic repair or an off-the-shelf door solution.',
      'חזית מסחרית טובה יכולה לשפר נראות, לגרום לעסק להיראות נקי ומבוסס יותר וליצור מעבר מקצועי יותר בין הרחוב לחלל הפנימי. היא יכולה גם לשפר תצוגת מוצרים, לתמוך במיתוג ובתאורה ולחזק את תחושת הביטחון של הלקוח. היתרונות האלה קשורים ישירות לכוונת החיפוש. מי שמחפש חזית זכוכית לחנות לא מחפש רק “זכוכית”, אלא חזית עסקית טובה יותר. ככל שהדף מסביר את התוצאה הזו באופן ברור יותר, כך הוא עובד טוב יותר גם ב-SEO וגם בהמרה. למבקר קל יותר להבין למה חזית מסחרית מותאמת שונה מהחלפת זכוכית כללית או מדלת מדף פשוטה.',
      'الواجهة القوية يمكن أن تحسّن الرؤية، وتجعل العمل يبدو أنظف وأكثر رسوخاً، وتخلق انتقالاً أكثر احترافية بين الشارع والداخل. كما يمكنها أن تجعل عرض المنتجات أكثر فعالية وتدعم الهوية التجارية والإضاءة وثقة الزبون. هذه الفوائد العملية مرتبطة مباشرة بنية البحث. من يبحث عن واجهة زجاجية للمحل لا يريد "زجاجاً" فقط، بل واجهة تجارية أفضل. كلما شرحت الصفحة هذه النتائج بوضوح أكبر، كلما عملت بشكل أفضل في تحسين محركات البحث والتحويل. يصبح أسهل على الزائر فهم لماذا تختلف الواجهة الزجاجية المخصصة عن إصلاح عام أو حل باب جاهز.',
      'Сильный фасад улучшает видимость, делает бизнес визуально более чистым и солидным и создаёт более профессиональный переход между улицей и интерьером. Он также делает презентацию товара эффективнее и поддерживает брендинг, освещение и доверие клиента. Эти практические выгоды напрямую связаны с поисковым намерением. Тот, кто ищет витражный фасад магазина, не просит просто "стекло" — он хочет лучший фасад для бизнеса. Чем яснее страница объясняет такой результат, тем лучше она работает и для SEO, и для конверсии. Посетителю становится проще понять, почему индивидуальный витражный фасад отличается от обычного ремонта или готового дверного решения.'
    ),
    areasSummary: localizedText(
      'We build shop front glass solutions across Israel, including busy urban storefronts in Jerusalem and Tel Aviv, neighborhood businesses in Modiin, and commercial projects in other cities. Location pages matter because business owners often search for commercial glass by city and service together. Linking this page to local city pages makes that search path much clearer.',
      'אנחנו מתקינים חזיתות זכוכית לעסקים בכל רחבי ישראל, כולל חזיתות עירוניות בירושלים ובתל אביב, עסקים שכונתיים במודיעין ופרויקטים מסחריים בערים נוספות. לדפי מיקום יש כאן חשיבות רבה כי בעלי עסקים מחפשים לעיתים קרובות גם לפי שירות וגם לפי עיר. החיבור בין הדף הזה לדפי הערים מייצר מסלול חיפוש ברור הרבה יותר.',
      'نبني حلول واجهات زجاجية في جميع مناطق إسرائيل، بما في ذلك واجهات حضرية مزدحمة في القدس وتل أبيب، أعمال محلية في موديعين، ومشاريع تجارية في مدن أخرى. صفحات المواقع مهمة هنا لأن أصحاب الأعمال غالباً يبحثون عن زجاج تجاري بحسب المدينة والخدمة معاً. ربط هذه الصفحة بصفحات المدن المحلية يجعل مسار البحث هذا أوضح بكثير.',
      'Мы создаём витражные фасады по всему Израилю, включая оживлённые городские витрины в Иерусалиме и Тель-Авиве, локальные бизнесы в Модиине и коммерческие проекты в других городах. Страницы по локациям важны, потому что владельцы бизнеса часто ищут коммерческое стекло по городу и услуге одновременно. Связь этой страницы со страницами городов делает такой путь поиска намного понятнее.'
    ),
    highlights: localizedArray(
      ['Retail storefronts', 'Commercial entry doors', 'Display window glazing', 'Clinic and office fronts', 'Privacy films and branding bands', 'Safety-focused commercial glass'],
      ['חזיתות לחנויות', 'דלתות כניסה מסחריות', 'זכוכית לחלונות ראווה', 'חזיתות למשרדים ומרפאות', 'פסי פרטיות ומיתוג', 'זכוכית מסחרית בדגש על בטיחות'],
      ['واجهات للمحال التجارية', 'أبواب دخول تجارية', 'زجاج نوافذ عرض', 'واجهات للعيادات والمكاتب', 'أفلام خصوصية وأشرطة هوية تجارية', 'زجاج تجاري بمعايير سلامة'],
      ['Витрины для розничных магазинов', 'Коммерческие входные двери', 'Витринное остекление', 'Фасады для клиник и офисов', 'Защитная плёнка и брендинг', 'Коммерческое стекло с упором на безопасность']
    ),
    materialOptions: localizedArray(
      ['Tempered commercial glass', 'Laminated safety glass', 'Framed or frameless entry systems', 'Graphic or privacy film integration'],
      ['זכוכית מסחרית מחוסמת', 'זכוכית בטיחות רבודה', 'מערכות כניסה ממוסגרות או ללא מסגרת', 'שילוב סרטי מיתוג או פרטיות'],
      ['زجاج تجاري مقسى', 'زجاج أمان مصفّح', 'أنظمة دخول بإطار أو بدون إطار', 'دمج أفلام رسومية أو خصوصية'],
      ['Закалённое коммерческое стекло', 'Ламинированное защитное стекло', 'Обрамлённые или безрамные входные системы', 'Графическая или защитная плёнка']
    ),
    faqs: [
      {
        question: localizedText(
          'Do you install storefront glass for new businesses and renovations?', 'האם אתם מתקינים חזיתות זכוכית גם לעסק חדש וגם לשיפוץ?',
          'هل تركّبون واجهات زجاجية للأعمال الجديدة والتجديدات؟', 'Вы устанавливаете витражные фасады для новых бизнесов и при ремонте?'
        ),
        answer: localizedText(
          'Yes. We handle both new commercial fit-outs and replacement or upgrade projects for existing businesses.',
          'כן. אנחנו מבצעים גם חזיתות לעסקים חדשים וגם החלפה או שדרוג לעסקים קיימים.',
          'نعم. نتولى تجهيزات تجارية جديدة ومشاريع استبدال أو ترقية للأعمال القائمة.',
          'Да. Мы выполняем как новое коммерческое оснащение, так и проекты замены или модернизации для существующего бизнеса.'
        ),
      },
      {
        question: localizedText(
          'Can storefront glass include privacy or branding elements?', 'האם אפשר לשלב בחזית הזכוכית פרטיות או מיתוג?',
          'هل يمكن أن تشمل الواجهة الزجاجية عناصر خصوصية أو هوية تجارية؟', 'Можно ли добавить в витражный фасад элементы приватности или брендинга?'
        ),
        answer: localizedText(
          'Yes. Depending on the project, storefront glazing can include privacy films, branding bands, or other treatments that support the business concept.',
          'כן. בהתאם לפרויקט, אפשר לשלב בחזית סרטי פרטיות, פסי מיתוג או טיפולים נוספים שתומכים בקונספט של העסק.',
          'نعم. بحسب المشروع، يمكن أن تشمل الواجهة أفلام خصوصية، أشرطة هوية تجارية، أو معالجات أخرى تدعم مفهوم العمل.',
          'Да. В зависимости от проекта витражный фасад может включать защитную плёнку, брендированные полосы или другую отделку, поддерживающую концепцию бизнеса.'
        ),
      },
      {
        question: localizedText(
          'Is storefront glass suitable for offices and clinics too?', 'האם חזית זכוכית מתאימה גם למשרדים ומרפאות?',
          'هل تناسب الواجهة الزجاجية المكاتب والعيادات أيضاً؟', 'Подходят ли витражные фасады для офисов и клиник?'
        ),
        answer: localizedText(
          'Absolutely. Storefront systems are widely used for offices, clinics, showrooms, and hospitality spaces, not just retail shops.',
          'בהחלט. מערכות חזית זכוכית מתאימות גם למשרדים, מרפאות, אולמות תצוגה וחללי אירוח, ולא רק לחנויות קמעונאיות.',
          'بالتأكيد. تُستخدم أنظمة الواجهات الزجاجية على نطاق واسع في المكاتب والعيادات وصالات العرض وأماكن الضيافة، وليس فقط في المحال التجارية.',
          'Безусловно. Витражные системы широко используются для офисов, клиник, шоурумов и заведений гостеприимства, а не только для розничных магазинов.'
        ),
      },
    ],
    relatedLocations: ['jerusalem', 'tel-aviv', 'modiin'],
  },
  {
    serviceId: 'glass-partitions',
    projectCategoryId: 'glass-partitions',
    cloudinaryCategory: 'partitions',
    slug: 'glass-partitions',
    eyebrow: localizedText(
      'Office, clinic, and home zoning solutions', 'מחיצות זכוכית למשרדים, מרפאות וחלוקה פנימית',
      'حلول تقسيم للمكاتب والعيادات والمنازل', 'Зонирование для офисов, клиник и дома'
    ),
    heroTitle: localizedText(
      'Glass Partitions', 'מחיצות זכוכית',
      'فواصل زجاجية', 'Стеклянные перегородки'
    ),
    heroSubtitle: localizedText(
      'Custom glass partition systems for offices, clinics, studios, meeting rooms, home workspaces, and interior zoning projects throughout Israel.',
      'מערכות מחיצות זכוכית בהתאמה אישית למשרדים, מרפאות, סטודיו, חדרי ישיבות, חללי עבודה ביתיים ופרויקטים לחלוקה פנימית בכל ישראל.',
      'أنظمة فواصل زجاجية بتصميم خاص للمكاتب والعيادات والاستوديوهات وغرف الاجتماعات ومساحات العمل المنزلية ومشاريع التقسيم الداخلي في جميع مناطق إسرائيل.',
      'Изготовление стеклянных перегородок на заказ для офисов, клиник, студий, переговорных, домашних рабочих зон и проектов внутреннего зонирования по всему Израилю.'
    ),
    metaTitle: localizedText(
      'Glass Partitions in Israel | Office and Interior Glass Walls', 'מחיצות זכוכית בישראל | קירות זכוכית למשרד ולפנים',
      'فواصل زجاجية في إسرائيل | جدران زجاجية للمكاتب والداخل', 'Стеклянные перегородки в Израиле | Офисные и интерьерные стеклянные стены'
    ),
    metaDescription: localizedText(
      'Glass partitions and interior glass wall installation in Jerusalem, Tel Aviv, Modiin, and across Israel. Office partitions, meeting rooms, sliding systems and frosted glass.',
      'מחיצות זכוכית וקירות זכוכית פנימיים בירושלים, תל אביב, מודיעין ובכל ישראל. מחיצות למשרד, חדרי ישיבות, מערכות הזזה וזכוכית חלבית.',
      'تركيب فواصل زجاجية وجدران زجاجية داخلية في القدس وتل أبيب وموديعين وفي جميع مناطق إسرائيل. فواصل مكاتب، غرف اجتماعات، أنظمة سحب، وزجاج مصنفر.',
      'Изготовление и установка стеклянных перегородок и внутренних стеклянных стен в Иерусалиме, Тель-Авиве, Модиине и по всему Израилю. Офисные перегородки, переговорные комнаты, раздвижные системы и матовое стекло.'
    ),
    keywords: localizedText(
      'glass partitions, office glass partitions, interior glass wall, meeting room glass, sliding glass partition, glass partition Jerusalem, glass partition Tel Aviv',
      'מחיצות זכוכית, מחיצות זכוכית למשרד, קיר זכוכית פנימי, חדר ישיבות זכוכית, מחיצת הזזה מזכוכית, מחיצות זכוכית ירושלים, מחיצות זכוכית תל אביב',
      'فواصل زجاجية, فواصل زجاجية للمكاتب, جدار زجاجي داخلي, زجاج غرفة اجتماعات, فاصل زجاجي بباب سحب, فواصل زجاجية القدس, فواصل زجاجية تل أبيب',
      'стеклянные перегородки, офисные стеклянные перегородки, внутренняя стеклянная стена, стекло для переговорной, раздвижная стеклянная перегородка, перегородки Иерусалим, перегородки Тель-Авив'
    ),
    intro: localizedText(
      'Glass partitions are one of the most effective ways to divide space without closing it off completely. They allow daylight to continue moving through an office, clinic, showroom, or home workspace while creating visual order and clearer functional zones. This is exactly the kind of service that should not live only as a short bullet on a generic services page. Search intent around office glass partitions, meeting room glass, sliding glass partitions, and interior glass walls is very specific. A dedicated page gives the site enough written context to rank for those searches and gives customers more confidence before they contact us. It explains how partitions are used, which finishes are available, and how we adapt the system to practical workflow needs.',
      'מחיצות זכוכית הן אחת הדרכים היעילות ביותר לחלק חלל בלי לסגור אותו לחלוטין. הן מאפשרות לאור טבעי להמשיך לנוע במשרד, במרפאה, בחלל תצוגה או במשרד ביתי, ובו בזמן יוצרות סדר ויזואלי ואזורים פונקציונליים ברורים יותר. זה בדיוק סוג השירות שלא צריך להסתפק באזכור קצר בתוך רשימת שירותים כללית. כוונת החיפוש סביב מחיצות זכוכית למשרד, חדר ישיבות מזכוכית, מחיצות הזזה וקירות זכוכית פנימיים היא מאוד ממוקדת. דף ייעודי נותן לאתר מספיק הקשר כתוב כדי לדרג לחיפושים האלה, וגם מעניק ללקוחות יותר ביטחון לפני שהם פונים. הוא מסביר איך משתמשים במחיצות, אילו גימורים קיימים ואיך אנחנו מתאימים את המערכת לצרכים אמיתיים של עבודה ותנועה בחלל.',
      'الفواصل الزجاجية هي من أكثر الطرق فعالية لتقسيم المساحة دون إغلاقها تماماً. تسمح للضوء الطبيعي بالاستمرار في الانتقال عبر المكتب أو العيادة أو صالة العرض أو مساحة العمل المنزلية، بينما تخلق نظاماً بصرياً ومناطق وظيفية أوضح. هذا تماماً نوع الخدمة التي لا يجب أن تبقى مجرد نقطة قصيرة في صفحة خدمات عامة. نية البحث حول فواصل المكاتب الزجاجية، زجاج غرف الاجتماعات، الفواصل بباب سحب، والجدران الزجاجية الداخلية محددة جداً. صفحة مخصصة تعطي الموقع سياقاً مكتوباً كافياً للترتيب لهذه العمليات وتعطي العملاء ثقة أكبر قبل التواصل معنا. تشرح كيف تُستخدم الفواصل، وما هي التشطيبات المتوفرة، وكيف نوائم النظام مع احتياجات سير العمل الفعلية.',
      'Стеклянные перегородки — один из самых эффективных способов разделить пространство без полного закрытия. Они позволяют дневному свету проходить через офис, клинику, шоурум или домашнее рабочее пространство, создавая визуальный порядок и более чёткие функциональные зоны. Это именно та услуга, которая не должна оставаться короткой строчкой на общей странице услуг. Поисковое намерение по офисным стеклянным перегородкам, стеклу для переговорных, раздвижным перегородкам и внутренним стеклянным стенам очень конкретно. Отдельная страница даёт сайту достаточно текстового контекста для ранжирования по этим запросам и придаёт клиентам больше уверенности перед обращением. Она объясняет, как используются перегородки, какая отделка доступна и как мы адаптируем систему под реальные рабочие задачи.'
    ),
    overview: localizedText(
      'Partition projects vary widely. Some clients want frameless meeting room fronts with slim hardware and clear sight lines. Others need privacy bands, frosted glazing, sliding doors, acoustic considerations, or a clean way to separate customer-facing and back-office areas. In homes, partitions can define an office corner, a kitchen boundary, or a studio zone while keeping the space open. In commercial interiors, they often need to support branding, repeated circulation, and easy maintenance. All of that makes written detail important. Search engines can understand that this page is about glass partitions specifically, and potential clients can understand that there are multiple ways to build a partition system depending on use, budget, and design language.',
      'פרויקטי מחיצות משתנים מאוד זה מזה. יש לקוחות שמחפשים חזית חדר ישיבות נקייה ללא מסגרת עם פרזול עדין וקווי ראייה פתוחים, ואחרים זקוקים לפסי פרטיות, זכוכית חלבית, דלתות הזזה, דרישות אקוסטיות או דרך מסודרת להפריד בין אזור קבלת קהל לבין אזור עבודה פנימי. בבתים פרטיים אפשר להשתמש במחיצה כדי להגדיר פינת עבודה, תחום מטבח או אזור סטודיו תוך שמירה על תחושת פתיחות. בחללים מסחריים, המחיצה צריכה לעיתים לתמוך גם במיתוג, בתנועה חוזרת ובתחזוקה נוחה. בגלל כל זה, לתוכן כתוב ומפורט יש ערך אמיתי: מנועי חיפוש מבינים שמדובר בדף שמוקדש למחיצות זכוכית, והלקוח מבין שיש יותר מדרך אחת לבנות מחיצה בהתאם לשימוש, לתקציב ולשפה העיצובית.',
      'مشاريع الفواصل تختلف بشكل كبير. بعض العملاء يريدون واجهة غرفة اجتماعات بدون برواز بتركيبات رفيعة وخطوط رؤية واضحة. وآخرون يحتاجون أشرطة خصوصية، زجاجاً مصنفراً، أبواب سحب، اعتبارات صوتية، أو طريقة منظمة لفصل منطقة استقبال الزبائن عن منطقة العمل الداخلي. في المنازل، يمكن للفاصل أن يحدد زاوية مكتب، حد مطبخ، أو منطقة استوديو مع الحفاظ على شعور الانفتاح. في المساحات التجارية، يحتاج الفاصل غالباً لدعم الهوية التجارية والحركة المتكررة وسهولة الصيانة. كل ذلك يجعل التفصيل المكتوب مهماً: تفهم محركات البحث أن هذه الصفحة مخصصة للفواصل الزجاجية، ويفهم العميل أن هناك أكثر من طريقة لبناء نظام فاصل بحسب الاستخدام والميزانية والطابع التصميمي.',
      'Проекты перегородок сильно различаются. Одним клиентам нужен безрамный фасад переговорной с тонкой фурнитурой и чистыми линиями обзора. Другим — полосы приватности, матовое стекло, раздвижные двери, акустические решения или аккуратный способ разделить зону для клиентов и внутреннюю рабочую зону. В домах перегородка может обозначить угол офиса, границу кухни или зону студии, сохраняя ощущение открытости. В коммерческих интерьерах перегородка часто должна поддерживать брендинг, повторяющееся движение людей и удобное обслуживание. Всё это делает письменную детализацию важной: поисковые системы понимают, что страница посвящена именно стеклянным перегородкам, а потенциальные клиенты понимают, что существует несколько способов построить систему перегородок в зависимости от использования, бюджета и стиля.'
    ),
    options: localizedText(
      'Glass partitions can be fully clear, frosted, banded, framed, frameless, hinged, sliding, or paired with soft-close hardware. Some projects prioritize openness and transparency, while others focus on privacy and acoustic balance. We guide clients through the finish level that suits the way the room is used. A medical room, office corridor, beauty studio, or executive meeting room each demands a different balance between visibility and separation. This section gives the page stronger keyword depth around office partitions, sliding glass walls, frosted meeting rooms, and interior glass room dividers. It also helps clients choose the right system before fabrication rather than trying to reverse-engineer the look from a photo after the fact.',
      'מחיצות זכוכית יכולות להיות שקופות לחלוטין, חלביות, עם פסים, עם מסגרת, ללא מסגרת, עם דלת צירים, דלת הזזה או פרזול סגירה רכה. יש פרויקטים שמדגישים פתיחות ושקיפות, ואחרים מחפשים פרטיות ואיזון אקוסטי. אנחנו מלווים את הלקוח בבחירת רמת הגמר שמתאימה לאופן שבו החלל באמת פועל. חדר טיפולים, מסדרון משרד, סטודיו יופי או חדר ישיבות הנהלה דורשים כל אחד איזון אחר בין חשיפה לבין הפרדה. החלק הזה מוסיף לדף עומק מילות מפתח סביב מחיצות למשרד, קירות הזזה מזכוכית, חדרי ישיבות חלביים ומחלקי חלל פנימיים, ובו בזמן עוזר ללקוח לבחור את המערכת הנכונה לפני הייצור במקום לנסות לשחזר פתרון מתמונה בלבד.',
      'الفواصل الزجاجية يمكن أن تكون شفافة بالكامل، مصنفرة، بأشرطة، بإطار، بدون إطار، بمفصلات، بباب سحب، أو مع تركيبات إغلاق ناعم. بعض المشاريع تعطي الأولوية للانفتاح والشفافية، وأخرى تركز على الخصوصية والتوازن الصوتي. نُرشد العملاء لمستوى التشطيب الذي يناسب طريقة استخدام الغرفة الفعلية. غرفة طبية، ممر مكتب، استوديو تجميل، أو غرفة اجتماعات تنفيذية، كل منها يتطلب توازناً مختلفاً بين الرؤية والفصل. هذا القسم يعطي الصفحة عمقاً أقوى في كلمات البحث حول فواصل المكاتب، جدران الزجاج بباب سحب، غرف الاجتماعات المصنفرة، ومقسمات الغرف الداخلية الزجاجية. كما يساعد العملاء على اختيار النظام الصحيح قبل التصنيع بدلاً من محاولة استنتاج المظهر من صورة فقط.',
      'Стеклянные перегородки могут быть полностью прозрачными, матовыми, с полосами, обрамлёнными, безрамными, на петлях, раздвижными или с доводчиком. В одних проектах приоритет — открытость и прозрачность, в других — приватность и акустический баланс. Мы помогаем клиентам выбрать уровень отделки, который подходит реальному использованию помещения. Медицинский кабинет, офисный коридор, студия красоты или кабинет руководителя — каждому нужен свой баланс между видимостью и разделением. Этот раздел добавляет странице глубину по запросам об офисных перегородках, раздвижных стеклянных стенах, матовых переговорных и внутренних стеклянных разделителях. Он также помогает клиентам выбрать правильную систему до изготовления, а не пытаться угадать решение по одной фотографии.'
    ),
    process: localizedText(
      'As with any custom glass project, the process starts with a site visit and precise measurement. We check floor and ceiling conditions, door swings, alignment points, and how the partition integrates with existing furniture, electrical elements, or finishes. From there we define the opening type, the glass treatment, and the hardware package. Installation needs to be clean because partitions are usually installed in finished interiors where details are highly visible. This process content is useful because it sets expectations and gives Google a strong text signal around custom partition installation, not just generic “glass work.”',
      'כמו בכל עבודת זכוכית מותאמת, התהליך מתחיל בביקור שטח ובמדידה מדויקת. אנחנו בודקים רצפה ותקרה, כיווני פתיחה, נקודות יישור ואופן החיבור של המחיצה לריהוט, לחשמל ולגמרים קיימים. משם אנחנו מגדירים את סוג הפתח, את טיפול הזכוכית ואת חבילת הפרזול. ההתקנה עצמה חייבת להיות נקייה במיוחד, כי מחיצות מותקנות בדרך כלל בחללים שכבר גמורים וכל פרט נראה לעין. תיאור התהליך הזה חשוב משום שהוא יוצר ציפיות ברורות ללקוח ונותן לגוגל אות טקסטואלי חזק שמדובר בהתקנת מחיצות זכוכית מותאמות, ולא רק ב”עבודות זכוכית” כלליות.',
      'كما في أي مشروع زجاج مخصص، تبدأ العملية بزيارة الموقع وقياس دقيق. نتحقق من حالة الأرض والسقف، اتجاهات فتح الأبواب، نقاط المحاذاة، وكيف يتكامل الفاصل مع الأثاث القائم أو العناصر الكهربائية أو التشطيبات. من هناك نحدد نوع الفتحة، معالجة الزجاج، وحزمة التركيبات. يجب أن يكون التركيب نظيفاً بشكل خاص لأن الفواصل تُركَّب عادة في مساحات داخلية منتهية حيث كل تفصيل واضح للعين. وصف العملية هذا مفيد لأنه يحدد توقعات واضحة ويعطي جوجل إشارة نصية قوية بأن الموضوع هو تركيب فواصل زجاجية مخصصة، وليس فقط "أعمال زجاج" عامة.',
      'Как и в любом проекте по стеклу на заказ, процесс начинается с осмотра объекта и точного замера. Мы проверяем состояние пола и потолка, направление открывания дверей, точки выравнивания и то, как перегородка сочетается с существующей мебелью, электрикой или отделкой. Затем мы определяем тип проёма, обработку стекла и комплект фурнитуры. Установка должна быть особенно аккуратной, потому что перегородки обычно монтируются в готовых интерьерах, где каждая деталь хорошо заметна. Это описание процесса полезно, потому что задаёт ожидания и даёт Google чёткий текстовый сигнал о том, что речь идёт именно об установке перегородок на заказ, а не об общих "стекольных работах".'
    ),
    benefits: localizedText(
      'The main benefit of glass partitions is control without heaviness. They divide space, support workflow, and improve privacy where needed, but they still preserve daylight and a contemporary feel. For offices, that can mean better room hierarchy without closing the floor plan. For homes, it can mean an office zone that does not darken the rest of the room. For clinics and studios, it can help create cleaner movement between service areas and waiting zones. These practical outcomes make the page more persuasive for visitors and help target the phrases people actually use when they are ready to hire: office glass partition installation, meeting room glazing, and interior glass divider systems.',
      'היתרון המרכזי של מחיצות זכוכית הוא שליטה בלי כובד. הן מחלקות את החלל, משפרות את זרימת העבודה ויוצרות פרטיות במקומות הנכונים, אבל עדיין שומרות על אור טבעי ועל תחושה עכשווית. במשרדים זה יכול להיות היררכיה טובה יותר של חדרים בלי לסגור את התוכנית, בבתים זה יכול להיות אזור עבודה שלא מחשיך את שאר החלל, ובמרפאות או בסטודיו זה יוצר תנועה מסודרת יותר בין אזור שירות להמתנה. התוצאות המעשיות האלו הופכות את הדף למשכנע יותר עבור המשתמשים וגם עוזרות לכוון לביטויי חיפוש אמיתיים כמו התקנת מחיצת זכוכית למשרד, חדר ישיבות מזכוכית או מערכת חלוקה פנימית מזכוכית.',
      'الفائدة الرئيسية للفواصل الزجاجية هي التحكم دون ثقل. هي تقسم المساحة، وتدعم سير العمل، وتحسن الخصوصية عند الحاجة، لكنها تحافظ على الضوء الطبيعي والشعور العصري. في المكاتب، يعني ذلك تسلسلاً أفضل للغرف دون إغلاق المخطط. في المنازل، يعني منطقة مكتب لا تُعتّم باقي الغرفة. في العيادات والاستوديوهات، يساعد على حركة أنظف بين مناطق الخدمة والانتظار. هذه النتائج العملية تجعل الصفحة أكثر إقناعاً للزوار وتساعد على استهداف العبارات التي يستخدمها الناس فعلاً عندما يكونون جاهزين للتوظيف: تركيب فاصل زجاجي للمكتب، تزجيج غرفة اجتماعات، وأنظمة مقسمات زجاجية داخلية.',
      'Главное преимущество стеклянных перегородок — контроль без громоздкости. Они разделяют пространство, поддерживают рабочий процесс и улучшают приватность там, где нужно, но при этом сохраняют дневной свет и современный вид. Для офисов это может означать лучшую иерархию помещений без закрытия планировки. Для дома — рабочую зону, которая не затемняет остальное пространство. Для клиник и студий — более чистое движение между зонами обслуживания и ожидания. Эти практические результаты делают страницу убедительнее для посетителей и помогают попасть в реальные фразы, которые используют люди, готовые заказать услугу: установка офисной стеклянной перегородки, остекление переговорной, системы внутренних стеклянных разделителей.'
    ),
    areasSummary: localizedText(
      'We install glass partitions in Jerusalem, Tel Aviv, Modiin, and across Israel for offices, clinics, beauty spaces, work-from-home rooms, and commercial interiors. City-specific pages matter because partition demand is often tied to local business districts and renovation trends. Linking this service page to location pages helps local SEO and gives users a better path to the city content that matches their search.',
      'אנחנו מתקינים מחיצות זכוכית בירושלים, תל אביב, מודיעין ובכל רחבי ישראל למשרדים, מרפאות, חללי יופי, משרדים ביתיים וחללים מסחריים. לדפי עיר יש כאן משמעות אמיתית כי הביקוש למחיצות קשור לעיתים קרובות לאזורי עסקים מקומיים ולמגמות שיפוץ בכל עיר. החיבור בין דף השירות הזה לבין דפי הערים מחזק את ה-SEO המקומי ונותן למשתמש מסלול טוב יותר אל התוכן העירוני שמתאים לחיפוש שלו.',
      'نقوم بتركيب فواصل زجاجية في القدس وتل أبيب وموديعين وفي جميع مناطق إسرائيل للمكاتب والعيادات ومساحات التجميل ومكاتب العمل من المنزل والمساحات التجارية. صفحات المدن مهمة هنا لأن الطلب على الفواصل غالباً مرتبط بمناطق الأعمال المحلية واتجاهات التجديد في كل مدينة. ربط صفحة الخدمة هذه بصفحات المواقع يقوي تحسين محركات البحث المحلي ويعطي المستخدم مساراً أفضل للمحتوى المحلي الذي يطابق بحثه.',
      'Мы устанавливаем стеклянные перегородки в Иерусалиме, Тель-Авиве, Модиине и по всему Израилю — для офисов, клиник, бьюти-пространств, домашних рабочих кабинетов и коммерческих интерьеров. Страницы по городам важны здесь, потому что спрос на перегородки часто связан с местными деловыми районами и тенденциями ремонта в каждом городе. Связь этой страницы услуги со страницами локаций усиливает локальное SEO и даёт пользователю более понятный путь к городскому контенту, соответствующему его запросу.'
    ),
    highlights: localizedArray(
      ['Office partitions', 'Meeting room fronts', 'Clinic and studio zoning', 'Sliding glass partition options', 'Frosted privacy treatments', 'Interior glass room dividers'],
      ['מחיצות למשרדים', 'חזיתות לחדרי ישיבות', 'חלוקה למרפאות וסטודיו', 'אפשרויות מחיצת זכוכית בהזזה', 'טיפולי פרטיות חלביים', 'מחלקי חלל פנימיים מזכוכית'],
      ['فواصل للمكاتب', 'واجهات لغرف الاجتماعات', 'تقسيم للعيادات والاستوديوهات', 'خيارات فاصل زجاجي بباب سحب', 'معالجات خصوصية مصنفرة', 'مقسمات غرف داخلية زجاجية'],
      ['Офисные перегородки', 'Фасады переговорных комнат', 'Зонирование клиник и студий', 'Раздвижные стеклянные перегородки', 'Матовая отделка для приватности', 'Внутренние стеклянные разделители']
    ),
    materialOptions: localizedArray(
      ['Clear or frosted safety glass', 'Framed or frameless systems', 'Sliding or hinged doors', 'Privacy bands and custom graphic films'],
      ['זכוכית בטיחות שקופה או חלבית', 'מערכות עם מסגרת או ללא מסגרת', 'דלתות הזזה או צירים', 'פסי פרטיות וסרטים גרפיים מותאמים'],
      ['زجاج أمان شفاف أو مصنفر', 'أنظمة بإطار أو بدون إطار', 'أبواب سحب أو مفصلات', 'أشرطة خصوصية وأفلام رسومية مخصصة'],
      ['Прозрачное или матовое безопасное стекло', 'Обрамлённые или безрамные системы', 'Раздвижные или распашные двери', 'Полосы приватности и графическая плёнка на заказ']
    ),
    faqs: [
      {
        question: localizedText(
          'Are glass partitions only for offices?', 'האם מחיצות זכוכית מתאימות רק למשרדים?',
          'هل الفواصل الزجاجية للمكاتب فقط؟', 'Стеклянные перегородки подходят только для офисов?'
        ),
        answer: localizedText(
          'No. They are also used in homes, clinics, studios, salons, and many other interiors where space needs definition without losing light.',
          'לא. משתמשים בהן גם בבתים, במרפאות, בסטודיו, במספרות ובחללים נוספים שצריכים חלוקה בלי לאבד אור ותחושת פתיחות.',
          'لا. تُستخدم أيضاً في المنازل والعيادات والاستوديوهات والصالونات وأماكن داخلية أخرى تحتاج تحديداً للمساحة دون فقدان الضوء.',
          'Нет. Их также используют в домах, клиниках, студиях, салонах и многих других интерьерах, где пространству нужно разделение без потери света.'
        ),
      },
      {
        question: localizedText(
          'Can partitions include privacy glass?', 'האם אפשר לשלב במחיצה זכוכית עם פרטיות?',
          'هل يمكن أن تشمل الفواصل زجاج خصوصية؟', 'Могут ли перегородки включать стекло с приватностью?'
        ),
        answer: localizedText(
          'Yes. Depending on the project, partitions can use frosted glass, privacy bands, or other treatments to control visibility.',
          'כן. בהתאם לפרויקט אפשר לשלב זכוכית חלבית, פסי פרטיות או טיפולים נוספים שמאפשרים שליטה ברמת החשיפה.',
          'نعم. بحسب المشروع، يمكن أن تستخدم الفواصل زجاجاً مصنفراً، أشرطة خصوصية، أو معالجات أخرى للتحكم في الرؤية.',
          'Да. В зависимости от проекта перегородки могут использовать матовое стекло, полосы приватности или другую отделку для контроля видимости.'
        ),
      },
      {
        question: localizedText(
          'Do you install sliding glass partition systems?', 'האם אתם מתקינים גם מחיצות זכוכית בהזזה?',
          'هل تركّبون أنظمة فواصل زجاجية بباب سحب؟', 'Вы устанавливаете раздвижные стеклянные перегородки?'
        ),
        answer: localizedText(
          'Yes. Sliding systems are one of the available solutions when the layout or circulation pattern benefits from a space-saving opening.',
          'כן. מערכות הזזה הן אחת האפשרויות הקיימות כאשר התכנון או דפוס התנועה בחלל נהנים מפתרון חוסך מקום.',
          'نعم. أنظمة السحب هي أحد الحلول المتوفرة عندما يستفيد التخطيط أو نمط الحركة من فتحة توفر المساحة.',
          'Да. Раздвижные системы — одно из доступных решений, когда планировка или схема движения выигрывают от экономящего место открывания.'
        ),
      },
    ],
    relatedLocations: ['jerusalem', 'tel-aviv', 'modiin'],
  },
  {
    serviceId: 'glass-doors',
    projectCategoryId: 'glass-doors',
    cloudinaryCategory: 'glass-doors',
    slug: 'glass-doors',
    eyebrow: localizedText(
      'Sliding, pivot, and hinged glass doors', 'דלתות זכוכית בהזזה, בציר ובתליה',
      'أبواب زجاجية منزلقة ومحورية ومفصلية', 'Раздвижные, поворотные и распашные стеклянные двери'
    ),
    heroTitle: localizedText(
      'Glass Doors', 'דלתות זכוכית',
      'أبواب زجاجية', 'Стеклянные двери'
    ),
    heroSubtitle: localizedText(
      'Custom glass door installation for homes and businesses — sliding, pivot, and hinged systems for entrances, offices, and interior openings across Israel.',
      'התקנת דלתות זכוכית בהתאמה אישית לבתים ולעסקים — מערכות הזזה, ציר ותלייה לכניסות, משרדים ופתחים פנימיים בכל רחבי ישראל.',
      'تركيب أبواب زجاجية بتصميم خاص للمنازل والأعمال — أنظمة منزلقة ومحورية ومفصلية للمداخل والمكاتب والفتحات الداخلية في جميع مناطق إسرائيل.',
      'Изготовление и установка стеклянных дверей на заказ для дома и бизнеса — раздвижные, поворотные и распашные системы для входов, офисов и внутренних проёмов по всему Израилю.'
    ),
    metaTitle: localizedText(
      'Glass Doors in Israel | Sliding, Pivot & Hinged Glass Doors', 'דלתות זכוכית בישראל | דלתות הזזה, ציר ותלייה',
      'أبواب زجاجية في إسرائيل | أبواب منزلقة ومحورية ومفصلية', 'Стеклянные двери в Израиле | Раздвижные и распашные двери на заказ'
    ),
    metaDescription: localizedText(
      'Custom glass door installation in Jerusalem, Tel Aviv, Modiin, and across Israel. Sliding doors, pivot doors, hinged entrances, and frosted glass options.',
      'התקנת דלתות זכוכית בהתאמה אישית בירושלים, תל אביב, מודיעין ובכל ישראל. דלתות הזזה, דלתות ציר, כניסות מזכוכית ואפשרויות זכוכית חלבית.',
      'تركيب أبواب زجاجية بتصميم خاص في القدس وتل أبيب وموديعين وفي جميع مناطق إسرائيل. أبواب منزلقة، أبواب محورية، مداخل زجاجية، وخيارات زجاج مصنفر.',
      'Изготовление и установка стеклянных дверей на заказ в Иерусалиме, Тель-Авиве, Модиине и по всему Израилю. Раздвижные двери, поворотные двери, входные группы и матовое стекло.'
    ),
    keywords: localizedText(
      'glass door installation, sliding glass door, pivot glass door, frameless glass door, glass entrance door, glass door Jerusalem, glass door Tel Aviv',
      'התקנת דלתות זכוכית, דלת זכוכית הזזה, דלת זכוכית ציר, דלת זכוכית ללא מסגרת, דלת כניסה מזכוכית, דלתות זכוכית ירושלים, דלתות זכוכית תל אביב',
      'تركيب أبواب زجاجية, باب زجاج منزلق, باب زجاج محوري, باب زجاجي بدون برواز, باب مدخل زجاجي, أبواب زجاجية القدس, أبواب زجاجية تل أبيب',
      'установка стеклянных дверей, раздвижная стеклянная дверь, поворотная стеклянная дверь, дверь без рамы, входная стеклянная дверь, стеклянные двери Иерусалим, стеклянные двери Тель-Авив'
    ),
    intro: localizedText(
      'A glass door changes how an entrance feels before anyone even walks through it. It keeps sightlines open, lets light move between rooms, and gives homes, offices, and shops a cleaner, more contemporary edge than a solid door ever can. Searches for sliding glass doors, pivot glass doors, frameless entrances, and interior glass doors come from people who already know roughly what they want and need to compare systems before they commit. We fabricate and install glass doors to the exact opening, choosing between sliding, pivot, and hinged hardware based on the space, the traffic pattern, and the look the client is after.',
      'דלת זכוכית משנה את התחושה של כניסה עוד לפני שמישהו עובר בה. היא שומרת על שדה ראייה פתוח, מאפשרת לאור לזרום בין החללים ונותנת לבתים, משרדים וחנויות מראה נקי ועכשווי הרבה יותר מדלת אטומה. אנשים שמחפשים דלת זכוכית הזזה, דלת ציר, כניסה ללא מסגרת או דלת זכוכית פנימית כבר יודעים בערך מה הם רוצים וצריכים להשוות בין מערכות לפני שהם מחליטים. אנחנו מייצרים ומתקינים דלתות זכוכית בדיוק לפי מידות הפתח, ובוחרים בין פרזול הזזה, ציר או תלייה בהתאם לחלל, לתנועה בו ולמראה המבוקש.',
      'الباب الزجاجي يغيّر شعورك بالمدخل قبل أن يعبره أحد. يحافظ على خطوط الرؤية مفتوحة، يسمح بانتقال الضوء بين الغرف، ويعطي المنازل والمكاتب والمحال مظهراً أنظف وأكثر عصرية من أي باب مصمت. من يبحث عن باب زجاج منزلق، باب زجاج محوري، مدخل بدون برواز، أو باب زجاجي داخلي يعرف غالباً ما يريده تقريباً ويحتاج لمقارنة الأنظمة قبل أن يقرر. نصنّع ونركّب أبواباً زجاجية بالضبط على مقاس الفتحة، ونختار بين تركيبات السحب أو المحور أو المفصلات بحسب المساحة وحركة المرور والمظهر المطلوب.',
      'Стеклянная дверь меняет ощущение от входа ещё до того, как через неё кто-то пройдёт. Она сохраняет открытые линии обзора, пропускает свет между помещениями и придаёт дому, офису или магазину более чистый и современный вид, чем любая глухая дверь. Те, кто ищет раздвижную стеклянную дверь, поворотную дверь, безрамный вход или внутреннюю стеклянную дверь, обычно уже примерно знают, что хотят, и им нужно сравнить системы перед заказом. Мы изготавливаем и устанавливаем стеклянные двери точно по размеру проёма, выбирая раздвижную, поворотную или распашную фурнитуру в зависимости от помещения, потока людей и желаемого вида.'
    ),
    overview: localizedText(
      'Glass door projects range from a single sliding panel between a living room and a balcony to a full pivot entrance for a villa or office lobby. Sliding systems work well where floor space is tight, pivot doors create a strong architectural statement at a main entrance, and hinged glass doors suit interior openings like home offices or walk-in closets. We help clients match the hardware to the opening rather than picking a system first and forcing the space to fit it, which is the most common mistake in DIY-priced glass door quotes.',
      'פרויקטי דלתות זכוכית נעים בין פנל הזזה בודד בין סלון למרפסת ועד כניסת ציר מלאה לוילה או לובי משרדים. מערכות הזזה מתאימות כשיש מגבלת שטח רצפה, דלתות ציר יוצרות הצהרה אדריכלית חזקה בכניסה המרכזית, ודלתות זכוכית עם תלייה מתאימות לפתחים פנימיים כמו חדר עבודה או חדר ארונות הליכה. אנחנו עוזרים ללקוחות להתאים את הפרזול לפתח, במקום לבחור מערכת קודם ולנסות לדחוף את החלל להתאים אליה — הטעות הנפוצה ביותר בהצעות מחיר זולות לדלתות זכוכית.',
      'مشاريع الأبواب الزجاجية تتراوح بين لوح سحب واحد بين الصالون والشرفة، إلى مدخل محوري كامل لفيلا أو ردهة مكتب. الأنظمة المنزلقة مناسبة عندما تكون مساحة الأرض محدودة، الأبواب المحورية تخلق حضوراً معمارياً قوياً عند المدخل الرئيسي، والأبواب الزجاجية المفصلية تناسب الفتحات الداخلية كغرفة المكتب المنزلي أو غرفة الملابس. نساعد العملاء على مطابقة التركيبات مع الفتحة بدلاً من اختيار نظام أولاً وإجبار المساحة على ملاءمته، وهو الخطأ الأكثر شيوعاً في عروض الأسعار الرخيصة للأبواب الزجاجية.',
      'Проекты стеклянных дверей варьируются от одной раздвижной панели между гостиной и балконом до полноценного поворотного входа для виллы или офисного лобби. Раздвижные системы хороши там, где мало места на полу, поворотные двери создают сильное архитектурное впечатление у главного входа, а распашные стеклянные двери подходят для внутренних проёмов — домашнего кабинета или гардеробной. Мы помогаем клиентам подбирать фурнитуру под проём, а не выбирать систему заранее и подгонять под неё помещение — самая частая ошибка в дешёвых предложениях на стеклянные двери.'
    ),
    options: localizedText(
      'Glass doors are typically made from 10-12mm tempered safety glass, with the hardware package deciding most of the final cost and look. Sliding doors need a track system (floor-mounted or suspended), pivot doors need a structurally rated floor and ceiling pivot, and hinged doors need standard or heavy-duty hinges depending on the glass weight. Clear, frosted, or fluted glass are all available, and handles can be matched in chrome, black, or brass. We walk clients through these choices up front so the quote reflects the real hardware needed, not a generic placeholder price.',
      'דלתות זכוכית מיוצרות בדרך כלל מזכוכית בטיחות מחוסמת בעובי 10-12 מ"מ, וחבילת הפרזול היא מה שקובע את רוב המחיר והמראה הסופי. דלתות הזזה צריכות מערכת מסילה (ברצפה או תלויה), דלתות ציר צריכות נקודת ציר ברצפה ובתקרה בעלת דירוג מבני, ודלתות עם תלייה צריכות צירים סטנדרטיים או מוגברים בהתאם למשקל הזכוכית. קיימת זכוכית שקופה, חלבית או מפוספסת, וניתן להתאים ידיות בכרום, שחור או פליז. אנחנו עוברים עם הלקוח על הבחירות האלה מראש כדי שההצעה תשקף את הפרזול האמיתי הנדרש ולא מחיר גנרי.',
      'الأبواب الزجاجية تُصنع عادة من زجاج أمان مقسى بسمك 10-12 مم، وحزمة التركيبات هي ما تحدد معظم السعر النهائي والمظهر. الأبواب المنزلقة تحتاج نظام مسار (أرضي أو معلق)، الأبواب المحورية تحتاج نقطة محور في الأرض والسقف بتصنيف إنشائي مناسب، والأبواب المفصلية تحتاج مفصلات قياسية أو معززة بحسب وزن الزجاج. يتوفر زجاج شفاف أو مصنفر أو مخطط، ويمكن مطابقة المقابض بالكروم أو الأسود أو النحاس. نراجع هذه الخيارات مع العميل مسبقاً حتى يعكس العرض التركيبات الحقيقية المطلوبة وليس سعراً عاماً.',
      'Стеклянные двери обычно изготавливаются из закалённого безопасного стекла толщиной 10-12 мм, и именно комплект фурнитуры определяет большую часть итоговой цены и вида. Раздвижным дверям нужна направляющая система (напольная или подвесная), поворотным — точка опоры в полу и потолке с соответствующей конструктивной нагрузкой, распашным — стандартные или усиленные петли в зависимости от веса стекла. Доступно прозрачное, матовое или рифлёное стекло, ручки подбираются в хроме, чёрном цвете или латуни. Мы разбираем эти варианты с клиентом заранее, чтобы смета отражала реальную необходимую фурнитуру, а не общую цену.'
    ),
    process: localizedText(
      'We measure the opening on site, check floor flatness and ceiling structure for pivot installations, and confirm which way the door needs to swing or slide based on furniture layout and foot traffic. After fabrication, the glass and hardware are installed and adjusted so the door closes flush, seals properly if needed, and moves smoothly under everyday use. For commercial entrances, we also account for daily traffic volume when selecting hinge and track hardware so the door holds up over years of use, not just the first few months.',
      'אנחנו מודדים את הפתח בשטח, בודקים ישרות רצפה ומבנה תקרה להתקנות ציר, ומאשרים לאיזה כיוון הדלת צריכה להיפתח או להזיז בהתאם לפריסת הריהוט ולתנועה בחלל. לאחר הייצור, הזכוכית והפרזול מותקנים ומכוונים כך שהדלת נסגרת ישר, נאטמת כשצריך ונעה בחלקות בשימוש יומיומי. בכניסות מסחריות אנחנו מתחשבים גם בנפח התנועה היומי בבחירת הצירים והמסילה, כדי שהדלת תעמוד בשימוש לאורך שנים ולא רק בחודשים הראשונים.',
      'نقيس الفتحة في الموقع، نتحقق من استواء الأرض وبنية السقف لتركيبات المحور، ونؤكد الاتجاه الذي يجب أن يفتح أو ينزلق فيه الباب بحسب توزيع الأثاث وحركة المرور. بعد التصنيع، يتم تركيب الزجاج والتركيبات وضبطها بحيث يُغلق الباب بشكل متساوٍ، يُحكم الإغلاق عند الحاجة، ويتحرك بسلاسة في الاستخدام اليومي. في المداخل التجارية، نأخذ بالحسبان أيضاً حجم الحركة اليومية عند اختيار المفصلات والمسار حتى يدوم الباب لسنوات وليس فقط للأشهر الأولى.',
      'Мы измеряем проём на месте, проверяем ровность пола и конструкцию потолка для поворотных установок, и уточняем, в какую сторону должна открываться или сдвигаться дверь, исходя из расстановки мебели и потока людей. После изготовления стекло и фурнитура устанавливаются и регулируются так, чтобы дверь закрывалась плотно, при необходимости герметично, и двигалась плавно при повседневном использовании. Для коммерческих входов мы также учитываем ежедневный поток людей при выборе петель и направляющих, чтобы дверь служила годами, а не только первые месяцы.'
    ),
    benefits: localizedText(
      'Glass doors make small spaces feel larger, let natural light travel deeper into a home or office, and give a more premium first impression than a standard door. For businesses, a glass entrance signals openness and modernity, which matters for retail, clinics, and offices alike. For homes, a sliding glass door between indoor and outdoor space is one of the highest-impact, most requested upgrades in renovations. The right hardware also means lower long-term maintenance than a door with multiple moving parts and panel joints.',
      'דלתות זכוכית גורמות לחללים קטנים להרגיש גדולים יותר, מאפשרות לאור טבעי לחדור עמוק יותר לבית או למשרד ונותנות רושם ראשוני יוקרתי יותר מדלת רגילה. לעסקים, כניסה מזכוכית משדרת פתיחות ומודרניות, וזה משנה גם בקמעונאות, גם במרפאות וגם במשרדים. בבתים, דלת זכוכית הזזה בין פנים לחוץ היא אחת השדרוגים המבוקשים והבעלי ההשפעה הגדולה ביותר בשיפוצים. פרזול נכון גם אומר תחזוקה נמוכה יותר בטווח הארוך מדלת עם הרבה חלקים נעים ומפרקים.',
      'الأبواب الزجاجية تجعل المساحات الصغيرة تبدو أكبر، تسمح بانتقال الضوء الطبيعي بعمق أكبر داخل المنزل أو المكتب، وتعطي انطباعاً أولياً أكثر رفاهية من باب عادي. للأعمال التجارية، يشير المدخل الزجاجي إلى الانفتاح والعصرية، وهذا مهم للمحال والعيادات والمكاتب على حد سواء. في المنازل، الباب الزجاجي المنزلق بين الداخل والخارج هو أحد أكثر الترقيات المطلوبة وذات التأثير الأكبر في التجديدات. التركيبات الصحيحة تعني أيضاً صيانة أقل على المدى الطويل من باب بأجزاء متحركة ومفاصل كثيرة.',
      'Стеклянные двери делают маленькие помещения визуально больше, пропускают естественный свет глубже в дом или офис и создают более премиальное первое впечатление, чем обычная дверь. Для бизнеса стеклянный вход сигнализирует об открытости и современности — это важно и для розницы, и для клиник, и для офисов. В домах раздвижная стеклянная дверь между внутренним и внешним пространством — одно из самых востребованных и заметных обновлений при ремонте. Правильная фурнитура также означает меньше обслуживания в долгосрочной перспективе, чем дверь с множеством движущихся частей и стыков.'
    ),
    areasSummary: localizedText(
      'We install glass doors across Israel, from city apartments and villas to offices, clinics, and retail spaces in Jerusalem, Tel Aviv, Modiin, and beyond. Door hardware choices often depend on local building conventions — older Jerusalem apartments and new-build Tel Aviv towers can call for different pivot and sliding solutions, which is exactly the kind of detail covered when this page is linked to city-specific pages.',
      'אנחנו מתקינים דלתות זכוכית בכל רחבי ישראל, מדירות עירוניות וילות ועד משרדים, מרפאות וחללי מסחר בירושלים, תל אביב, מודיעין ועוד. בחירת פרזול הדלת תלויה לעיתים בקונבנציות בנייה מקומיות — דירות ישנות בירושלים ומגדלים חדשים בתל אביב יכולים לדרוש פתרונות ציר והזזה שונים, וזה בדיוק סוג הפרט שמכוסה כשהדף הזה מקושר לדפי ערים.',
      'نقوم بتركيب أبواب زجاجية في جميع مناطق إسرائيل، من الشقق الحضرية والفلل إلى المكاتب والعيادات والمحال التجارية في القدس وتل أبيب وموديعين وغيرها. اختيار تركيبات الباب يعتمد غالباً على عادات البناء المحلية — الشقق القديمة في القدس والأبراج الجديدة في تل أبيب قد تتطلب حلول محور وسحب مختلفة، وهذا بالضبط نوع التفصيل الذي تغطيه هذه الصفحة عند ربطها بصفحات المدن.',
      'Мы устанавливаем стеклянные двери по всему Израилю — от городских квартир и вилл до офисов, клиник и торговых помещений в Иерусалиме, Тель-Авиве, Модиине и других городах. Выбор фурнитуры часто зависит от местных строительных особенностей — старые квартиры в Иерусалиме и новые башни в Тель-Авиве могут требовать разных поворотных и раздвижных решений, и именно это раскрывается при связи этой страницы со страницами городов.'
    ),
    highlights: localizedArray(
      ['Sliding glass doors', 'Pivot entrance doors', 'Hinged interior doors', 'Frameless designs', 'Clear, frosted, or fluted glass', 'Chrome, black, or brass hardware'],
      ['דלתות זכוכית הזזה', 'דלתות כניסה בציר', 'דלתות פנים בתלייה', 'עיצובים ללא מסגרת', 'זכוכית שקופה, חלבית או מפוספסת', 'פרזול כרום, שחור או פליז'],
      ['أبواب زجاجية منزلقة', 'أبواب مدخل محورية', 'أبواب داخلية مفصلية', 'تصاميم بدون برواز', 'زجاج شفاف أو مصنفر أو مخطط', 'تركيبات كروم أو سوداء أو نحاسية'],
      ['Раздвижные стеклянные двери', 'Поворотные входные двери', 'Распашные внутренние двери', 'Безрамный дизайн', 'Прозрачное, матовое или рифлёное стекло', 'Хромированная, чёрная или латунная фурнитура']
    ),
    materialOptions: localizedArray(
      ['10-12 mm tempered safety glass', 'Floor or ceiling pivot systems', 'Floor-mounted or suspended sliding tracks', 'Standard or heavy-duty hinges'],
      ['זכוכית בטיחות מחוסמת 10-12 מ"מ', 'מערכות ציר רצפה או תקרה', 'מסילות הזזה ברצפה או תלויות', 'צירים סטנדרטיים או מוגברים'],
      ['زجاج أمان مقسى 10-12 مم', 'أنظمة محور أرضية أو سقفية', 'مسارات سحب أرضية أو معلقة', 'مفصلات قياسية أو معززة'],
      ['Закалённое безопасное стекло 10-12 мм', 'Напольные или потолочные поворотные системы', 'Напольные или подвесные раздвижные направляющие', 'Стандартные или усиленные петли']
    ),
    faqs: [
      {
        question: localizedText(
          'How thick should glass be for an entrance door?', 'איזה עובי זכוכית מתאים לדלת כניסה?',
          'ما هو سمك الزجاج المناسب لباب المدخل؟', 'Какая толщина стекла нужна для входной двери?'
        ),
        answer: localizedText(
          'Entrance doors typically use 10-12mm tempered safety glass, with the exact thickness depending on door size and the hardware system selected.',
          'דלתות כניסה משתמשות בדרך כלל בזכוכית בטיחות מחוסמת בעובי 10-12 מ"מ, והעובי המדויק תלוי בגודל הדלת ובמערכת הפרזול שנבחרה.',
          'تستخدم أبواب المدخل عادة زجاجاً مقسى بسمك 10-12 مم، ويعتمد السمك الدقيق على حجم الباب ونظام التركيبات المختار.',
          'Входные двери обычно используют закалённое безопасное стекло толщиной 10-12 мм, точная толщина зависит от размера двери и выбранной системы фурнитуры.'
        ),
      },
      {
        question: localizedText(
          'Is a sliding or pivot door better for a small space?', 'מה מתאים יותר לחלל קטן, דלת הזזה או ציר?',
          'هل الباب المنزلق أم المحوري أفضل للمساحات الصغيرة؟', 'Что лучше для маленького помещения — раздвижная или поворотная дверь?'
        ),
        answer: localizedText(
          'Sliding doors are usually the better fit for tight spaces since they don\'t need floor clearance to swing open, while pivot doors need room to arc.',
          'דלתות הזזה מתאימות בדרך כלל יותר לחללים צפופים, כי הן לא דורשות שטח פתיחה ברצפה, בעוד שדלתות ציר צריכות מקום לקשת הפתיחה.',
          'الأبواب المنزلقة عادة أفضل للمساحات الضيقة لأنها لا تحتاج فراغاً أرضياً لتنفتح، بينما الأبواب المحورية تحتاج مساحة لقوس الفتح.',
          'Раздвижные двери обычно лучше подходят для тесных помещений, так как не требуют свободного пространства для открывания, в отличие от поворотных дверей.'
        ),
      },
      {
        question: localizedText(
          'Can glass doors be used for both interior and exterior openings?', 'האם דלתות זכוכית מתאימות גם לפנים וגם לחוץ?',
          'هل يمكن استخدام الأبواب الزجاجية للفتحات الداخلية والخارجية؟', 'Можно ли использовать стеклянные двери и внутри, и снаружи?'
        ),
        answer: localizedText(
          'Yes. The glass thickness, hardware, and sealing requirements simply differ between interior openings and exterior entrances exposed to weather.',
          'כן. רק שעובי הזכוכית, הפרזול ודרישות האיטום שונים בין פתחים פנימיים לכניסות חוץ החשופות למזג אוויר.',
          'نعم. سمك الزجاج والتركيبات ومتطلبات العزل تختلف فقط بين الفتحات الداخلية والمداخل الخارجية المعرضة للعوامل الجوية.',
          'Да. Толщина стекла, фурнитура и требования к герметизации просто отличаются для внутренних проёмов и наружных входов, подверженных погодным условиям.'
        ),
      },
    ],
    relatedLocations: ['jerusalem', 'tel-aviv', 'modiin'],
  },
  {
    serviceId: 'backsplashes',
    projectCategoryId: 'backsplashes',
    cloudinaryCategory: 'backsplashes',
    slug: 'glass-backsplash',
    eyebrow: localizedText(
      'Kitchen and bathroom glass backsplashes', 'חיפויי זכוכית למטבח ולחדר רחצה',
      'واجهات زجاجية خلفية للمطبخ والحمام', 'Стеклянные фартуки для кухни и ванной'
    ),
    heroTitle: localizedText(
      'Glass Backsplashes', 'חיפויי זכוכית למטבח',
      'زجاج خلفية المطبخ', 'Стеклянные кухонные фартуки'
    ),
    heroSubtitle: localizedText(
      'Custom tempered glass backsplashes for kitchens and bathrooms, in any color, with a seamless and easy-to-clean finish, installed across Israel.',
      'חיפויי זכוכית מחוסמת בהתאמה אישית למטבחים וחדרי רחצה, בכל צבע, עם גימור חלק ונוח לניקוי, מותקנים בכל רחבי ישראל.',
      'تركيب واجهات زجاجية مقساة بتصميم خاص للمطابخ والحمامات، بأي لون، مع تشطيب سلس وسهل التنظيف، في جميع مناطق إسرائيل.',
      'Изготовление и установка закалённых стеклянных фартуков на заказ для кухни и ванной — любой цвет, бесшовная и легко очищаемая отделка — по всему Израилю.'
    ),
    metaTitle: localizedText(
      'Glass Backsplash Installation in Israel | Kitchen Glass Panels', 'חיפוי זכוכית למטבח בישראל | פנלי זכוכית לקיר',
      'تركيب زجاج خلفية المطبخ في إسرائيل | ألواح زجاجية للمطبخ', 'Стеклянные фартуки в Израиле | Кухонные стеклянные панели на заказ'
    ),
    metaDescription: localizedText(
      'Custom glass backsplash installation in Jerusalem, Tel Aviv, Modiin, and across Israel. Any RAL color, tempered safety glass, seamless heat-resistant finish.',
      'התקנת חיפויי זכוכית בהתאמה אישית בירושלים, תל אביב, מודיעין ובכל ישראל. כל צבע RAL, זכוכית בטיחות מחוסמת, גימור חלק ועמיד בחום.',
      'تركيب واجهات زجاجية خلفية بتصميم خاص في القدس وتل أبيب وموديعين وفي جميع مناطق إسرائيل. أي لون RAL، زجاج أمان مقسى، تشطيب سلس مقاوم للحرارة.',
      'Изготовление стеклянных фартуков на заказ в Иерусалиме, Тель-Авиве, Модиине и по всему Израилю. Любой цвет RAL, закалённое безопасное стекло, бесшовная термостойкая отделка.'
    ),
    keywords: localizedText(
      'glass backsplash, kitchen glass backsplash, colored glass panel, tempered glass wall panel, glass backsplash Jerusalem, glass backsplash Tel Aviv',
      'חיפוי זכוכית למטבח, חיפוי זכוכית צבעוני, פנל זכוכית לקיר, זכוכית מחוסמת למטבח, חיפוי זכוכית ירושלים, חיפוי זכוכית תל אביב',
      'زجاج خلفية المطبخ, واجهة زجاجية للمطبخ, لوح زجاجي ملون, زجاج مقسى للحائط, زجاج خلفية المطبخ القدس, زجاج خلفية المطبخ تل أبيب',
      'стеклянный фартук, кухонный стеклянный фартук, цветная стеклянная панель, закалённая стеклянная панель, стеклянный фартук Иерусалим, стеклянный фартук Тель-Авив'
    ),
    intro: localizedText(
      'A glass backsplash solves a problem tile grout never really does: it gives a kitchen or bathroom wall a completely seamless, easy-to-wipe surface in any color the client wants, with no joints for grease, steam, or mold to collect in. People searching for kitchen glass backsplash, colored glass panel, or glass wall behind a stove already know they want this clean look — what they need from a service page is clarity on color options, heat resistance near cooktops, and how the panel is cut around outlets and cabinetry.',
      'חיפוי זכוכית פותר בעיה שפוגות אריחים לא באמת פותרות: הוא נותן לקיר במטבח או בחדר רחצה משטח חלק לחלוטין וקל לניקוי בכל צבע שהלקוח רוצה, בלי פוגות שבהן מצטברים שמן, אדים או עובש. אנשים שמחפשים חיפוי זכוכית למטבח, פנל זכוכית צבעוני או זכוכית לקיר מאחורי הכיריים כבר יודעים שהם רוצים את המראה הנקי הזה — מה שהם צריכים מדף שירות הוא בהירות לגבי אפשרויות צבע, עמידות בחום קרוב לכיריים ואיך הפנל נחתך מסביב לשקעים ולנגרות.',
      'الزجاج الخلفي للمطبخ يحل مشكلة لا تحلها فواصل البلاط حقاً: يعطي حائط المطبخ أو الحمام سطحاً سلساً تماماً وسهل المسح بأي لون يريده العميل، بدون فواصل تتجمع فيها الدهون أو البخار أو العفن. من يبحث عن زجاج خلفية المطبخ، لوح زجاجي ملون، أو زجاج خلف الموقد يعرف غالباً أنه يريد هذا المظهر النظيف — وما يحتاجه من صفحة خدمة هو وضوح حول خيارات الألوان، ومقاومة الحرارة قرب الموقد، وكيفية قطع اللوح حول المقابس والخزائن.',
      'Стеклянный фартук решает проблему, которую затирка между плиткой никогда по-настоящему не решает: он даёт стене на кухне или в ванной полностью бесшовную, легко протираемую поверхность любого цвета, без швов, где скапливается жир, пар или плесень. Те, кто ищет кухонный стеклянный фартук, цветную стеклянную панель или стекло за плитой, уже знают, что хотят такой чистый вид — им нужна от страницы услуги ясность по вариантам цвета, термостойкости у плиты и тому, как панель вырезается под розетки и мебель.'
    ),
    overview: localizedText(
      'Backsplash panels are fabricated from tempered glass and painted on the back in any RAL color, which means the visible front face stays perfectly glossy and smooth. We measure the wall, mark outlet and switch positions, and cut the panel with precise holes so everything sits flush once installed. The same approach works behind a stove, across a full kitchen wall, or in a bathroom behind a vanity — the fabrication process is identical, only the dimensions and cutouts change.',
      'פנלי החיפוי מיוצרים מזכוכית מחוסמת וצבועים בגב בכל צבע RAL, כך שהפן הקדמי הנראה נשאר מבריק וחלק לחלוטין. אנחנו מודדים את הקיר, מסמנים מיקומי שקעים ומפסקים וחותכים את הפנל עם פתחים מדויקים כך שהכל יושב בצורה שווה אחרי ההתקנה. אותה שיטה עובדת מאחורי כיריים, על קיר מטבח שלם או בחדר רחצה מאחורי ארון — תהליך הייצור זהה, רק המידות והחיתוכים משתנים.',
      'تُصنع ألواح الواجهة الخلفية من زجاج مقسى وتُطلى من الخلف بأي لون RAL، بحيث يبقى الوجه الأمامي الظاهر لامعاً وسلساً تماماً. نقيس الحائط، نحدد مواقع المقابس والمفاتيح، ونقطع اللوح بفتحات دقيقة حتى يجلس كل شيء بشكل متساوٍ بعد التركيب. نفس الطريقة تعمل خلف الموقد، على حائط مطبخ كامل، أو في حمام خلف الخزانة — عملية التصنيع متطابقة، فقط الأبعاد والقطع تختلف.',
      'Панели фартука изготавливаются из закалённого стекла и окрашиваются с тыльной стороны в любой цвет RAL, благодаря чему видимая передняя поверхность остаётся идеально глянцевой и гладкой. Мы измеряем стену, отмечаем расположение розеток и выключателей и вырезаем панель с точными отверстиями, чтобы всё точно совпало после установки. Тот же подход работает за плитой, на всей стене кухни или в ванной за раковиной — процесс изготовления одинаков, меняются только размеры и вырезы.'
    ),
    options: localizedText(
      'Color is the main decision: any RAL shade can be matched, from a soft white that blends into the wall to a bold accent color that becomes the focal point of the kitchen. Finish options include gloss, low-iron glass for a truer color (regular glass has a slight green tint that shifts pale colors), and back-painted glass for the most common budget-friendly option. Heat resistance matters directly behind a stove, where the panel needs to handle sustained heat without cracking or discoloring.',
      'הצבע הוא ההחלטה המרכזית: אפשר להתאים כל גוון RAL, מלבן עדין שמשתלב בקיר ועד צבע בולט שהופך לנקודת המוקד של המטבח. אפשרויות הגימור כוללות זכוכית מבריקה, זכוכית דלת ברזל (low-iron) לצבע אמיתי יותר (זכוכית רגילה יש לה גוון ירקרק קל שמשנה צבעים בהירים), וזכוכית צבועה מהגב, האפשרות הנפוצה והכלכלית ביותר. עמידות בחום חשובה מאחורי כיריים, שם הפנל צריך לעמוד בחום מתמשך בלי להישבר או להשתנות בצבע.',
      'الألوان هي القرار الأساسي: يمكن مطابقة أي درجة RAL، من أبيض ناعم يندمج مع الحائط إلى لون جريء يصبح نقطة التركيز في المطبخ. تشمل خيارات التشطيب الزجاج اللامع، والزجاج منخفض الحديد (low-iron) للحصول على لون أصدق (الزجاج العادي له صبغة خضراء خفيفة تغيّر الألوان الفاتحة)، والزجاج المطلي من الخلف وهو الخيار الأكثر شيوعاً واقتصادية. مقاومة الحرارة مهمة خلف الموقد مباشرة، حيث يجب أن يتحمل اللوح حرارة مستمرة دون أن يتشقق أو يتغير لونه.',
      'Цвет — главное решение: можно подобрать любой оттенок RAL, от мягкого белого, сливающегося со стеной, до яркого акцентного цвета, становящегося центром внимания кухни. Варианты отделки включают глянцевое стекло, стекло с низким содержанием железа для более точного цвета (обычное стекло имеет лёгкий зеленоватый оттенок, искажающий светлые цвета), и окрашенное с тыльной стороны стекло — самый распространённый и бюджетный вариант. Термостойкость важна прямо за плитой, где панель должна выдерживать постоянный нагрев без трещин и изменения цвета.'
    ),
    process: localizedText(
      'We visit the site to measure the wall and mark every outlet, switch, and pipe that the panel needs to clear. The glass is then cut, tempered, and back-painted to order before being installed with a silicone adhesive system designed for kitchen and bathroom conditions. Because the panel is a single sheet rather than dozens of tiles, installation is fast — most backsplash projects are completed in a single visit once the glass is ready.',
      'אנחנו מגיעים לשטח למדידת הקיר וסימון כל שקע, מפסק וצנרת שהפנל צריך להתחמק מהם. הזכוכית נחתכת, מחוסמת ונצבעת מהגב לפי הזמנה, ולאחר מכן מותקנת עם מערכת דבק סיליקון שמתוכננת לתנאי מטבח וחדר רחצה. מכיוון שהפנל הוא יחידה אחת ולא עשרות אריחים, ההתקנה מהירה — רוב פרויקטי החיפוי מסתיימים בביקור אחד כשהזכוכית מוכנה.',
      'نزور الموقع لقياس الحائط وتحديد كل مقبس ومفتاح وأنبوب يجب أن يتجاوزه اللوح. يُقطع الزجاج ويُقسى ويُطلى من الخلف حسب الطلب، ثم يُركَّب بنظام لاصق سيليكون مصمم لظروف المطبخ والحمام. ولأن اللوح قطعة واحدة وليس عشرات البلاطات، يكون التركيب سريعاً — تكتمل معظم مشاريع الواجهة الخلفية في زيارة واحدة بعد جهوز الزجاج.',
      'Мы выезжаем на объект для замера стены и отметки всех розеток, выключателей и труб, которые должна обходить панель. Затем стекло режется, закаляется и окрашивается с тыльной стороны на заказ, после чего устанавливается с помощью силиконовой клеевой системы, рассчитанной на условия кухни и ванной. Поскольку панель — это единый лист, а не десятки плиток, установка проходит быстро: большинство проектов фартука завершается за один визит после готовности стекла.'
    ),
    benefits: localizedText(
      'A glass backsplash has zero grout lines, which means no scrubbing grout and no mold growing in joints — a real, practical advantage over tile that matters daily, not just on installation day. It also lets a kitchen take on a color that no tile range offers, since the paint can be matched to almost any RAL reference. For renovations, it is one of the fastest visual upgrades available: a single afternoon of installation changes the entire feel of a kitchen wall.',
      'לחיפוי זכוכית אין פוגות בכלל, מה שאומר שאין ניקוי פוגות ואין עובש שגדל בין אריחים — יתרון אמיתי ופרקטי על פני אריחים שמורגש כל יום, לא רק ביום ההתקנה. הוא גם מאפשר למטבח לקבל צבע שאף סט אריחים לא מציע, כי הצבע יכול להתאים לכל גוון RAL כמעט. בשיפוצים, זה אחד השדרוגים הוויזואליים המהירים ביותר שקיימים: אחר צהריים אחד של התקנה משנה את כל התחושה של קיר המטבח.',
      'الزجاج الخلفي لا يحتوي على فواصل بلاط على الإطلاق، وهذا يعني عدم تنظيف الفواصل وعدم نمو العفن بينها — ميزة حقيقية وعملية تُلمَس يومياً، وليس فقط يوم التركيب. كما يسمح للمطبخ بالحصول على لون لا تقدمه أي مجموعة بلاط، لأن الطلاء يمكن مطابقته مع أي مرجع RAL تقريباً. في التجديدات، إنه أحد أسرع الترقيات البصرية المتاحة: تركيب بعد ظهر واحد يغيّر شعور حائط المطبخ بالكامل.',
      'У стеклянного фартука вообще нет швов от затирки — а значит, не нужно чистить швы и не растёт плесень между ними — реальное практическое преимущество над плиткой, ощутимое каждый день, а не только в день установки. Он также позволяет кухне получить цвет, который не предлагает ни одна линейка плитки, поскольку краска подбирается почти под любой эталон RAL. При ремонте это одно из самых быстрых визуальных обновлений: один день установки полностью меняет ощущение от стены кухни.'
    ),
    areasSummary: localizedText(
      'We fabricate and install glass backsplashes throughout Israel, for new kitchen fit-outs in Tel Aviv apartments, renovation projects in Jerusalem, and family homes in Modiin and beyond. Because every panel is custom-cut, the service works the same way nationwide — only the site visit changes by location.',
      'אנחנו מייצרים ומתקינים חיפויי זכוכית בכל רחבי ישראל, להתקנות מטבח חדשות בדירות בתל אביב, לפרויקטי שיפוץ בירושלים ולבתים משפחתיים במודיעין ועוד. מכיוון שכל פנל נחתך בהתאמה אישית, השירות עובד באותה צורה בכל הארץ — רק ביקור השטח משתנה לפי המיקום.',
      'نصنّع ونركّب واجهات زجاجية خلفية في جميع مناطق إسرائيل، لتجهيزات مطابخ جديدة في شقق تل أبيب، ومشاريع تجديد في القدس، ومنازل عائلية في موديعين وغيرها. ولأن كل لوح يُقطع بشكل مخصص، تعمل الخدمة بنفس الطريقة على مستوى البلاد — فقط زيارة الموقع تختلف بحسب المكان.',
      'Мы изготавливаем и устанавливаем стеклянные фартуки по всему Израилю — для новых кухонь в квартирах Тель-Авива, ремонтных проектов в Иерусалиме и семейных домов в Модиине и других городах. Поскольку каждая панель вырезается индивидуально, услуга работает одинаково по всей стране — меняется только выезд на объект в зависимости от местоположения.'
    ),
    highlights: localizedArray(
      ['Any RAL color match', 'Tempered safety glass', 'Seamless, grout-free finish', 'Heat-resistant near cooktops', 'Precise cutouts for outlets', 'Kitchen and bathroom use'],
      ['התאמת כל צבע RAL', 'זכוכית בטיחות מחוסמת', 'גימור חלק בלי פוגות', 'עמיד בחום קרוב לכיריים', 'חיתוכים מדויקים לשקעים', 'שימוש למטבח ולחדר רחצה'],
      ['مطابقة أي لون RAL', 'زجاج أمان مقسى', 'تشطيب سلس بدون فواصل', 'مقاوم للحرارة قرب الموقد', 'فتحات دقيقة للمقابس', 'استخدام للمطبخ والحمام'],
      ['Подбор любого цвета RAL', 'Закалённое безопасное стекло', 'Бесшовная отделка без затирки', 'Термостойкость у плиты', 'Точные вырезы под розетки', 'Использование на кухне и в ванной']
    ),
    materialOptions: localizedArray(
      ['Tempered back-painted glass', 'Low-iron glass for true color', 'Gloss finish', 'Custom cutouts for outlets and switches'],
      ['זכוכית מחוסמת צבועה מהגב', 'זכוכית דלת ברזל לצבע אמיתי', 'גימור מבריק', 'חיתוכים מותאמים לשקעים ומפסקים'],
      ['زجاج مقسى مطلي من الخلف', 'زجاج منخفض الحديد لون أصدق', 'تشطيب لامع', 'فتحات مخصصة للمقابس والمفاتيح'],
      ['Закалённое стекло, окрашенное с тыльной стороны', 'Стекло с низким содержанием железа для точного цвета', 'Глянцевая отделка', 'Вырезы на заказ под розетки и выключатели']
    ),
    faqs: [
      {
        question: localizedText(
          'Can a glass backsplash handle the heat behind a stove?', 'האם חיפוי זכוכית עומד בחום מאחורי כיריים?',
          'هل يتحمل الزجاج الخلفي الحرارة خلف الموقد؟', 'Выдерживает ли стеклянный фартук жар за плитой?'
        ),
        answer: localizedText(
          'Yes. Tempered glass backsplashes are designed to handle sustained heat directly behind cooktops without cracking or discoloring.',
          'כן. חיפויי זכוכית מחוסמת מתוכננים לעמוד בחום מתמשך ישירות מאחורי כיריים בלי להישבר או להשתנות בצבע.',
          'نعم. تُصمَّم الواجهات الزجاجية المقساة لتحمل الحرارة المستمرة خلف الموقد مباشرة دون أن تتشقق أو يتغير لونها.',
          'Да. Закалённые стеклянные фартуки рассчитаны на постоянный жар прямо за плитой без трещин и изменения цвета.'
        ),
      },
      {
        question: localizedText(
          'Can the color match my existing kitchen?', 'האם הצבע יכול להתאים למטבח הקיים שלי?',
          'هل يمكن أن يطابق اللون مطبخي الحالي؟', 'Можно ли подобрать цвет под мою существующую кухню?'
        ),
        answer: localizedText(
          'Yes. The back-painted glass can be matched to almost any RAL color reference, so it can blend in or stand out as needed.',
          'כן. הזכוכית הצבועה מהגב יכולה להתאים לכל גוון RAL כמעט, כך שהיא יכולה להשתלב או לבלוט בהתאם לצורך.',
          'نعم. يمكن مطابقة الزجاج المطلي من الخلف مع أي مرجع لون RAL تقريباً، بحيث يندمج أو يبرز بحسب الحاجة.',
          'Да. Окрашенное с тыльной стороны стекло можно подобрать почти под любой цвет RAL — оно может сливаться с интерьером или выделяться.'
        ),
      },
      {
        question: localizedText(
          'How are outlets and switches handled in the panel?', 'איך מתמודדים עם שקעים ומפסקים בפנל?',
          'كيف يتم التعامل مع المقابس والمفاتيح في اللوح؟', 'Как панель обходит розетки и выключатели?'
        ),
        answer: localizedText(
          'We measure their exact position on site and cut precise holes in the glass before installation, so everything sits flush once mounted.',
          'אנחנו מודדים את המיקום המדויק שלהם בשטח וחותכים פתחים מדויקים בזכוכית לפני ההתקנה, כך שהכל יושב בצורה שווה אחרי ההרכבה.',
          'نقيس موضعها الدقيق في الموقع ونقطع فتحات دقيقة في الزجاج قبل التركيب، حتى يجلس كل شيء بشكل متساوٍ بعد التثبيت.',
          'Мы измеряем их точное расположение на месте и вырезаем точные отверстия в стекле перед установкой, чтобы всё точно совпало после монтажа.'
        ),
      },
    ],
    relatedLocations: ['jerusalem', 'tel-aviv', 'modiin'],
  },
  {
    serviceId: 'shelves',
    projectCategoryId: 'shelves',
    cloudinaryCategory: 'shelves',
    slug: 'glass-shelves',
    eyebrow: localizedText(
      'Custom floating glass shelves', 'מדפי זכוכית צפים בהתאמה אישית',
      'أرفف زجاجية عائمة بتصميم خاص', 'Парящие стеклянные полки на заказ'
    ),
    heroTitle: localizedText(
      'Glass Shelves', 'מדפי זכוכית',
      'أرفف زجاجية', 'Стеклянные полки'
    ),
    heroSubtitle: localizedText(
      'Custom tempered glass shelving for retail displays, bathrooms, and living spaces, cut to size and installed with strong, discreet brackets across Israel.',
      'מדפי זכוכית מחוסמת בהתאמה אישית לתצוגות חנויות, חדרי רחצה ומרחבי מגורים, נחתכים למידה ומותקנים עם תושבות חזקות ודיסקרטיות בכל רחבי ישראל.',
      'أرفف زجاجية مقساة بتصميم خاص لعروض المتاجر والحمامات والمساحات المعيشية، تُقطع على المقاس وتُركَّب بحوامل قوية وغير ملحوظة في جميع مناطق إسرائيل.',
      'Изготовление стеклянных полок из закалённого стекла на заказ для торговых витрин, ванных комнат и жилых пространств — точный размер и надёжные незаметные крепления по всему Израилю.'
    ),
    metaTitle: localizedText(
      'Glass Shelves in Israel | Custom Floating Glass Shelving', 'מדפי זכוכית בישראל | מדפים צפים בהתאמה אישית',
      'أرفف زجاجية في إسرائيل | أرفف زجاجية عائمة مخصصة', 'Стеклянные полки в Израиле | Парящие полки на заказ'
    ),
    metaDescription: localizedText(
      'Custom glass shelf installation in Jerusalem, Tel Aviv, Modiin, and across Israel. Tempered glass, floating mounts, LED lighting options, heavy-duty brackets.',
      'התקנת מדפי זכוכית בהתאמה אישית בירושלים, תל אביב, מודיעין ובכל ישראל. זכוכית מחוסמת, תלייה צפה, אפשרויות תאורת LED, תושבות חזקות.',
      'تركيب أرفف زجاجية بتصميم خاص في القدس وتل أبيب وموديعين وفي جميع مناطق إسرائيل. زجاج مقسى، تثبيت عائم، خيارات إضاءة LED، حوامل شديدة التحمل.',
      'Изготовление стеклянных полок на заказ в Иерусалиме, Тель-Авиве, Модиине и по всему Израилю. Закалённое стекло, парящее крепление, LED-подсветка, усиленные кронштейны.'
    ),
    keywords: localizedText(
      'glass shelves, floating glass shelf, custom glass shelving, tempered glass shelf, glass shelf Jerusalem, glass shelf Tel Aviv',
      'מדפי זכוכית, מדף זכוכית צף, מדפי זכוכית בהתאמה אישית, מדף זכוכית מחוסם, מדפי זכוכית ירושלים, מדפי זכוכית תל אביב',
      'أرفف زجاجية, رف زجاجي عائم, أرفف زجاجية مخصصة, رف زجاجي مقسى, أرفف زجاجية القدس, أرفف زجاجية تل أبيب',
      'стеклянные полки, парящая стеклянная полка, полки на заказ, закалённая стеклянная полка, стеклянные полки Иерусалим, стеклянные полки Тель-Авив'
    ),
    intro: localizedText(
      'A glass shelf does a job a wooden one cannot: it displays whatever sits on it without blocking the view behind, which is exactly why retail displays, bathroom storage, and living room shelving so often use it. People searching for floating glass shelf, custom glass shelving, or glass shelf brackets are usually planning a specific spot — above a vanity, inside a display case, or across a feature wall — and want to know what thickness and mounting system will actually hold the weight they have in mind.',
      'מדף זכוכית עושה דבר שמדף עץ לא יכול: הוא מציג כל מה שעומד עליו בלי לחסום את הראייה מאחוריו, וזו בדיוק הסיבה שתצוגות חנויות, אחסון בחדר רחצה ומדפים בסלון משתמשים בו כך הרבה. אנשים שמחפשים מדף זכוכית צף, מדפי זכוכית בהתאמה אישית או תושבות למדף זכוכית מתכננים בדרך כלל מיקום מסוים — מעל ארון אמבטיה, בתוך ויטרינת תצוגה או על קיר מאפיין — ורוצים לדעת איזה עובי ומערכת תלייה יחזיקו את המשקל שהם מתכננים.',
      'الرف الزجاجي يقوم بمهمة لا يستطيع الرف الخشبي القيام بها: يعرض كل ما يوضع عليه دون حجب الرؤية خلفه، وهذا تماماً سبب استخدامه كثيراً في عروض المتاجر وتخزين الحمامات وأرفف الصالون. من يبحث عن رف زجاجي عائم، أرفف زجاجية مخصصة، أو حوامل رف زجاجي يخطط عادة لموقع محدد — فوق خزانة الحمام، داخل واجهة عرض، أو على حائط مميز — ويريد معرفة السمك ونظام التثبيت الذي يحمل فعلاً الوزن الذي يفكر فيه.',
      'Стеклянная полка делает то, чего не может деревянная: она показывает всё, что на ней стоит, не закрывая вид за собой — именно поэтому её так часто используют в торговых витринах, для хранения в ванной и на полках в гостиной. Те, кто ищет парящую стеклянную полку, полки на заказ или кронштейны для стеклянной полки, обычно уже планируют конкретное место — над раковиной, внутри витрины или на акцентной стене — и хотят знать, какая толщина и система крепления реально удержит нужный вес.'
    ),
    overview: localizedText(
      'Shelf projects range from a single small shelf above a bathroom sink to a full run of display shelving across a retail wall. The right glass thickness and bracket type depend entirely on the span and the expected load — a short cosmetics shelf needs far less support than a long shelf meant to hold books or retail stock. We measure the wall, confirm what the shelf needs to carry, and recommend a bracket and glass combination that will hold that weight safely over years of use, not just on day one.',
      'פרויקטי מדפים נעים בין מדף קטן בודד מעל כיור באמבטיה ועד שורה שלמה של מדפי תצוגה על קיר חנות. עובי הזכוכית הנכון וסוג התושבת תלויים לחלוטין בטווח ובעומס הצפוי — מדף קוסמטיקה קצר צריך הרבה פחות תמיכה ממדף ארוך שמיועד להחזיק ספרים או מלאי חנות. אנחנו מודדים את הקיר, מאשרים מה המדף צריך לשאת, ומציעים שילוב תושבת וזכוכית שיחזיק את המשקל בבטחה לאורך שנות שימוש, לא רק ביום הראשון.',
      'مشاريع الأرفف تتراوح بين رف صغير واحد فوق مغسلة الحمام إلى سلسلة كاملة من أرفف العرض على حائط متجر. سمك الزجاج الصحيح ونوع الحامل يعتمدان كلياً على المدى والحمل المتوقع — رف مستحضرات تجميل قصير يحتاج دعماً أقل بكثير من رف طويل مخصص لحمل كتب أو مخزون متجر. نقيس الحائط، نؤكد ما يحتاج الرف لحمله، ونوصي بمزيج من الحامل والزجاج يحمل هذا الوزن بأمان لسنوات من الاستخدام، وليس فقط في اليوم الأول.',
      'Проекты полок варьируются от одной небольшой полки над раковиной в ванной до целого ряда витринных полок на стене магазина. Правильная толщина стекла и тип кронштейна полностью зависят от пролёта и ожидаемой нагрузки — короткая полка для косметики требует намного меньше опоры, чем длинная полка для книг или товара. Мы измеряем стену, уточняем, что должна выдерживать полка, и рекомендуем сочетание кронштейна и стекла, которое надёжно удержит этот вес годами, а не только в первый день.'
    ),
    options: localizedText(
      'Most shelves use 8-10mm tempered glass with polished edges, mounted on either discreet metal brackets or fully concealed floating supports for a cleaner look. LED strip lighting can be built into the bracket or the wall behind the shelf, which works especially well for retail displays and bathroom mirrors. Edge finishing options include flat polish, beveled, or rounded corners depending on where the shelf sits and how exposed its edge is to daily contact.',
      'רוב המדפים משתמשים בזכוכית מחוסמת בעובי 8-10 מ"מ עם קצוות מלוטשים, מותקנים על תושבות מתכת דיסקרטיות או על תמיכות צפות נסתרות לחלוטין למראה נקי יותר. ניתן לשלב תאורת LED בתושבת או בקיר מאחורי המדף, וזה עובד מצוין במיוחד לתצוגות חנויות ולמראות אמבטיה. אפשרויות גימור הקצה כוללות ליטוש שטוח, פאזה או פינות מעוגלות בהתאם למיקום המדף ולמידת המגע היומי עם הקצה.',
      'معظم الأرفف تستخدم زجاجاً مقسى بسمك 8-10 مم بحواف مصقولة، مثبتة على حوامل معدنية غير ملحوظة أو على دعامات عائمة مخفية بالكامل لمظهر أنظف. يمكن دمج إضاءة LED شريطية في الحامل أو في الحائط خلف الرف، وهذا يعمل بشكل ممتاز خاصة لعروض المتاجر ومرايا الحمامات. تشمل خيارات تشطيب الحافة الصقل المسطح، الفازة، أو الزوايا المدورة بحسب موقع الرف ودرجة التعرض اليومي لحافته.',
      'Большинство полок используют закалённое стекло толщиной 8-10 мм с полированным краем, на незаметных металлических кронштейнах или полностью скрытых парящих опорах для более чистого вида. LED-подсветку можно встроить в кронштейн или в стену за полкой — это особенно хорошо работает для торговых витрин и зеркал в ванной. Варианты обработки края включают плоскую полировку, фацет или закруглённые углы, в зависимости от расположения полки и того, насколько часто к её краю прикасаются.'
    ),
    process: localizedText(
      'We measure the wall and confirm the exact load the shelf needs to support before recommending glass thickness and bracket type. The glass is cut, tempered, and edge-finished to order, then installed with brackets rated for the expected weight and checked for level before handover. For retail and display installations involving multiple shelves, we plan spacing and bracket positions together so the whole run reads as one coherent system rather than separate pieces.',
      'אנחנו מודדים את הקיר ומאשרים את העומס המדויק שהמדף צריך לשאת לפני שמומלץ עובי זכוכית וסוג תושבת. הזכוכית נחתכת, מחוסמת ומגומרת בקצה לפי הזמנה, ולאחר מכן מותקנת עם תושבות בעלות דירוג מתאים למשקל הצפוי ונבדקת לאיזון לפני המסירה. בהתקנות תצוגה וקמעונאות עם כמה מדפים, אנחנו מתכננים את המרחקים ומיקומי התושבות יחד כך שכל השורה תיראה כמערכת אחת קוהרנטית ולא חלקים נפרדים.',
      'نقيس الحائط ونؤكد الحمل الدقيق الذي يحتاج الرف لحمله قبل التوصية بسمك الزجاج ونوع الحامل. يُقطع الزجاج ويُقسى ويُشطَّب من الحافة حسب الطلب، ثم يُركَّب بحوامل مصنفة لتحمل الوزن المتوقع ويُفحص للتسوية قبل التسليم. في تركيبات العرض والمتاجر التي تشمل أرففاً متعددة، نخطط المسافات ومواقع الحوامل معاً حتى تبدو السلسلة كاملة كنظام واحد متماسك وليس قطعاً منفصلة.',
      'Мы измеряем стену и уточняем точную нагрузку, которую должна выдерживать полка, прежде чем рекомендовать толщину стекла и тип кронштейна. Стекло режется, закаляется и обрабатывается по краю на заказ, затем устанавливается на кронштейны, рассчитанные на ожидаемый вес, и проверяется на уровень перед сдачей. Для торговых и витринных установок с несколькими полками мы планируем расстояния и расположение кронштейнов вместе, чтобы весь ряд воспринимался как единая слаженная система, а не отдельные элементы.'
    ),
    benefits: localizedText(
      'Glass shelves hold weight without visually adding any, which matters most in small bathrooms and compact retail displays where every centimeter of perceived space counts. They are also easier to keep clean than wood or painted MDF, since a damp cloth is all they ever need. For shops, glass shelving lets the product be the focus instead of the furniture — exactly what a display shelf is supposed to do.',
      'מדפי זכוכית מחזיקים משקל בלי להוסיף נראות בכלל, וזה חשוב במיוחד בחדרי רחצה קטנים ובתצוגות חנות צפופות שבהן כל סנטימטר של תחושת מרחב חשוב. הם גם קלים יותר לשמירה על ניקיון מעץ או MDF צבוע, כי כל מה שצריך הוא מטלית לחה. בחנויות, מדפי זכוכית נותנים למוצר להיות במרכז במקום לרהיט — בדיוק מה שמדף תצוגה צריך לעשות.',
      'الأرفف الزجاجية تحمل الوزن دون أن تضيف أي ثقل بصري، وهذا مهم خاصة في الحمامات الصغيرة وعروض المتاجر الضيقة حيث يهم كل سنتيمتر من المساحة المُتصوَّرة. كما أنها أسهل في الحفاظ على نظافتها من الخشب أو الـ MDF المطلي، لأن كل ما تحتاجه هو قطعة قماش مبللة. في المحال، تجعل الأرفف الزجاجية المنتج هو محور التركيز بدلاً من الأثاث — وهذا تماماً ما يجب أن يفعله رف العرض.',
      'Стеклянные полки выдерживают вес, не добавляя визуальной тяжести — это особенно важно в маленьких ванных и компактных торговых витринах, где важен каждый сантиметр воспринимаемого пространства. Их также легче содержать в чистоте, чем дерево или окрашенный МДФ — достаточно влажной тряпки. В магазинах стеклянные полки делают акцент на товаре, а не на мебели — именно для этого и нужна витринная полка.'
    ),
    areasSummary: localizedText(
      'We fabricate and install glass shelving throughout Israel, for retail fit-outs in Tel Aviv, bathroom renovations in Jerusalem, and living spaces in Modiin and beyond. As with backsplashes, the fabrication process is the same nationwide — only the site visit and delivery change by city.',
      'אנחנו מייצרים ומתקינים מדפי זכוכית בכל רחבי ישראל, להתקנות קמעונאות בתל אביב, שיפוצי חדרי רחצה בירושלים ומרחבי מגורים במודיעין ועוד. כמו בחיפויי הזכוכית, תהליך הייצור זהה בכל הארץ — רק ביקור השטח והאספקה משתנים לפי העיר.',
      'نصنّع ونركّب أرففاً زجاجية في جميع مناطق إسرائيل، لتجهيزات متاجر في تل أبيب، وتجديدات حمامات في القدس، ومساحات معيشية في موديعين وغيرها. كما هو الحال مع الواجهات الخلفية، عملية التصنيع متطابقة على مستوى البلاد — فقط زيارة الموقع والتسليم يختلفان بحسب المدينة.',
      'Мы изготавливаем и устанавливаем стеклянные полки по всему Израилю — для торговых помещений в Тель-Авиве, ремонта ванных в Иерусалиме и жилых пространств в Модиине и других городах. Как и с фартуками, процесс изготовления одинаков по всей стране — меняются только выезд на объект и доставка в зависимости от города.'
    ),
    highlights: localizedArray(
      ['Floating glass shelves', 'Retail display shelving', 'Bathroom glass shelves', 'LED lighting integration', 'Polished, beveled, or rounded edges', 'Heavy-duty load-rated brackets'],
      ['מדפי זכוכית צפים', 'מדפי תצוגה לחנויות', 'מדפי זכוכית לחדר רחצה', 'שילוב תאורת LED', 'קצוות מלוטשים, פאזה או מעוגלים', 'תושבות עומס חזקות'],
      ['أرفف زجاجية عائمة', 'أرفف عرض للمتاجر', 'أرفف زجاجية للحمام', 'دمج إضاءة LED', 'حواف مصقولة أو مفازة أو مدورة', 'حوامل شديدة التحمل'],
      ['Парящие стеклянные полки', 'Витринные полки для магазинов', 'Стеклянные полки для ванной', 'Встроенная LED-подсветка', 'Полированный, фацетный или округлый край', 'Усиленные кронштейны с расчётной нагрузкой']
    ),
    materialOptions: localizedArray(
      ['8-10 mm tempered glass', 'Concealed floating brackets', 'Decorative metal brackets', 'Optional integrated LED lighting'],
      ['זכוכית מחוסמת 8-10 מ"מ', 'תושבות צפות נסתרות', 'תושבות מתכת דקורטיביות', 'אפשרות לתאורת LED משולבת'],
      ['زجاج مقسى 8-10 مم', 'حوامل عائمة مخفية', 'حوامل معدنية زخرفية', 'إمكانية دمج إضاءة LED'],
      ['Закалённое стекло 8-10 мм', 'Скрытые парящие кронштейны', 'Декоративные металлические кронштейны', 'Опциональная встроенная LED-подсветка']
    ),
    faqs: [
      {
        question: localizedText(
          'How much weight can a glass shelf hold?', 'כמה משקל מדף זכוכית יכול להחזיק?',
          'كم وزن يمكن أن يحمل الرف الزجاجي؟', 'Какой вес может выдержать стеклянная полка?'
        ),
        answer: localizedText(
          'It depends on the glass thickness, the shelf span, and the bracket type — we calculate this based on the specific load you need the shelf to carry.',
          'זה תלוי בעובי הזכוכית, בטווח המדף ובסוג התושבת — אנחנו מחשבים את זה בהתאם לעומס הספציפי שהמדף צריך לשאת.',
          'يعتمد ذلك على سمك الزجاج ومدى الرف ونوع الحامل — نحسب ذلك بحسب الحمل المحدد الذي تحتاج الرف لحمله.',
          'Это зависит от толщины стекла, пролёта полки и типа кронштейна — мы рассчитываем это исходя из конкретной нагрузки, которую должна выдерживать полка.'
        ),
      },
      {
        question: localizedText(
          'Can LED lighting be added to a glass shelf?', 'האם אפשר להוסיף תאורת LED למדף זכוכית?',
          'هل يمكن إضافة إضاءة LED إلى رف زجاجي؟', 'Можно ли добавить LED-подсветку к стеклянной полке?'
        ),
        answer: localizedText(
          'Yes. LED strips can be built into the bracket or the wall behind the shelf, which works especially well for display shelving and bathroom storage.',
          'כן. ניתן לשלב פסי LED בתושבת או בקיר מאחורי המדף, וזה עובד מצוין במיוחד למדפי תצוגה ולאחסון בחדר רחצה.',
          'نعم. يمكن دمج شرائط LED في الحامل أو في الحائط خلف الرف، وهذا يعمل بشكل ممتاز خاصة لأرفف العرض وتخزين الحمام.',
          'Да. LED-ленты можно встроить в кронштейн или в стену за полкой — это особенно хорошо работает для витринных полок и хранения в ванной.'
        ),
      },
      {
        question: localizedText(
          'Are glass shelves safe for everyday use?', 'האם מדפי זכוכית בטוחים לשימוש יומיומי?',
          'هل الأرفف الزجاجية آمنة للاستخدام اليومي؟', 'Безопасны ли стеклянные полки для повседневного использования?'
        ),
        answer: localizedText(
          'Yes. We use tempered safety glass rated for the expected load, which is far stronger than regular glass and shatters into small, less dangerous pieces if it ever breaks.',
          'כן. אנחנו משתמשים בזכוכית בטיחות מחוסמת בדירוג שמתאים לעומס הצפוי, שהיא חזקה בהרבה מזכוכית רגילה ומתפוררת לרסיסים קטנים ופחות מסוכנים אם היא נשברת.',
          'نعم. نستخدم زجاج أمان مقسى مصنفاً للحمل المتوقع، وهو أقوى بكثير من الزجاج العادي ويتحطم إلى قطع صغيرة وأقل خطورة إذا انكسر.',
          'Да. Мы используем закалённое безопасное стекло, рассчитанное на ожидаемую нагрузку — оно намного прочнее обычного стекла и при разрушении рассыпается на мелкие, менее опасные осколки.'
        ),
      },
    ],
    relatedLocations: ['jerusalem', 'tel-aviv', 'modiin'],
  },
];

export const getServiceSeoPageBySlug = (slug: string) =>
  SERVICE_SEO_PAGES.find((page) => page.slug === slug);

export const getServiceSeoPageByServiceId = (serviceId: string) =>
  SERVICE_SEO_PAGES.find((page) => page.serviceId === serviceId);

export const getServiceSeoPageByProjectCategoryId = (projectCategoryId: string) =>
  SERVICE_SEO_PAGES.find((page) => page.projectCategoryId === projectCategoryId);

export const getServicePageHref = (locale: string, serviceId: string) => {
  const page = getServiceSeoPageByServiceId(serviceId);
  return page ? `/${locale}/${page.slug}` : null;
};

export const getLocationSeoSegment = (locationSlug: string) =>
  `${LOCATION_SEO_ALIAS_PREFIX}-${locationSlug}`;

export const normalizeLocationSeoSlug = (locationSlug: string) =>
  locationSlug.startsWith(`${LOCATION_SEO_ALIAS_PREFIX}-`)
    ? locationSlug.slice(LOCATION_SEO_ALIAS_PREFIX.length + 1)
    : locationSlug;

export const getLocationPageHref = (locale: string, locationSlug: string) =>
  `/${locale}/${getLocationSeoSegment(locationSlug)}`;

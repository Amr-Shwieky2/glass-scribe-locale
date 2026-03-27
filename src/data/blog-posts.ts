import { LocalizedText } from './types';

export interface BlogPost {
  id: string;
  slug: string;
  date: string;
  author: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText;
  readTime: string;
  category: string;
  relatedServiceId?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'guide-to-choosing-glass-shower',
    date: '2026-03-25',
    author: 'Shwaki Brothers',
    title: {
      he: 'מדריך מלא לבחירת מקלחון זכוכית',
      en: 'Complete Guide to Choosing a Glass Shower',
      ar: 'الدليل الكامل لاختيار كابينة دش زجاجية',
      ru: 'Полное руководство по выбору стеклянной душевой кабины',
    },
    excerpt: {
      he: 'כל מה שצריך לדעת לפני שמתקינים מקלחון: עובי זכוכית, סוגי פתיחה, פרזול ופתרונות לחדרי רחצה קטנים.',
      en: 'Everything you need to know before installing a shower enclosure: glass thickness, opening types, hardware, and solutions for small bathrooms.',
      ar: 'كل ما تحتاج معرفته قبل تركيب كابينة الدش: سمك الزجاج، أنواع الفتح، الأجهزة الملحقة، وحلول للحمامات الصغيرة.',
      ru: 'Всё, что вам нужно знать перед установкой душевой кабины: толщина стекла, типы открытия, фурнитура и решения для небольших ванных комнат.',
    },
    content: {
      he: `## איך לבחור מקלחון זכוכית מושלם

בחירת מקלחון היא אחת ההחלטות החשובות ביותר בשיפוץ או עיצוב חדר רחצה. המקלחון לא רק קובע את המראה של החלל, אלא גם את רמת הנוחות והתחזוקה לאורך שנים.

### עובי הזכוכית: 8 מ"מ או 10 מ"מ?
למקלחונים ללא מסגרת ההמלצה הגורפת היא להשתמש בזכוכית מחוסמת ובטיחותית בעובי 8 מ"מ. היא חזקה מספיק כדי לעמוד בפני פגיעות ושומרת על מראה אלגנטי. במקלחונים רחבים במיוחד או בכנפיים כבדות ניתן לבחון זכוכית 10 מ"מ לייצוב נוסף.

### סוגי זכוכית
- **זכוכית שקופה (Clear):** אידיאלית להגדלת חלל קטן, אך דורשת תחזוקה שוטפת לניקוי אבנית.
- **זכוכית אקסטרה-קליר (Extra Clear):** זכוכית מופחתת עופרת שאין לה גוון ירקרק. מומלצת במיוחד על רקע אריחים לבנים או בהירים.
- **זכוכית חלבית (קליר אסיד):** מספקת פרטיות ומטשטשת כתמי מים ואבנית.

### סגנונות פתיחה
1. **דלת צירית:** הפתרון הקלאסי. מתאים למי שיש לו מספיק מרחב לפתיחה נוחה של הדלת כלפי חוץ.
2. **מערכת הזזה:** מושלם לחדרי רחצה קטנים שבהם דלת תופסת יותר מדי מקום, אך דורש אטימה מדויקת.
3. **קבוע (Walk-in):** המראה המינימליסטי ביותר. פלטת זכוכית אחת המגן מפני מים, ללא כל מנגנון.

**טיפ למקצוענים:** ודאו שאתם מזמינים טיפול דוחה אבנית לזכוכית (ציפוי ננו) שיקל משמעותית על הניקוי היומיומי!`,
      en: `## How to Choose the Perfect Glass Shower

Choosing a shower enclosure is one of the most important decisions in a bathroom renovation. It not only dictates the look of the space but also the comfort and long-term maintenance.

### Glass Thickness: 8mm or 10mm?
For frameless showers, the universal recommendation is 8mm tempered safety glass. It is strong enough to withstand impacts while maintaining an elegant aesthetic. For exceptionally wide panels or heavy doors, 10mm glass can be considered for added stability.

### Glass Types
- **Standard Clear Glass:** Ideal for enlarging a small space but requires regular maintenance to clean water spots.
- **Extra Clear Glass:** Low-iron glass that removes the green tint found in standard glass. Highly recommended against white or light-colored tiles.
- **Frosted (Acid Etched):** Provides privacy and naturally hides water and limescale marks.

### Opening Styles
1. **Hinged Door:** The classic solution. Suitable for bathrooms with ample space for the door to swing outwards.
2. **Sliding System:** Perfect for smaller bathrooms where a swinging door takes up too much room, but requires precise sealing.
3. **Fixed Panel (Walk-in):** The most minimalist look. A single glass panel acting as a splash guard, with no moving parts.

**Pro Tip:** Ensure you request an anti-limescale (nano-coating) treatment applied to the glass to make everyday cleaning effortless!`,
      ar: 'محتوى يركز على كيفية اختيار أفضل كابينة دش زجاجية لحمامك. التفاصيل حول سمك الزجاج وأنماط الفتح.',
      ru: 'Текст, посвященный выбору идеальной стеклянной душевой кабины для вашей ванной комнаты. Детали о толщине стекла и стилях открывания.',
    },
    readTime: '4 min',
    category: 'Guides',
    relatedServiceId: 'shower-glass'
  },
  {
    id: 'post-2',
    slug: 'cost-of-glass-railing-installation',
    date: '2026-03-20',
    author: 'Shwaki Brothers',
    title: {
      he: 'כמה עולה להתקין מעקה זכוכית?',
      en: 'How Much Does Glass Railing Installation Cost?',
      ar: 'كم تكلفة تركيب درابزين زجاجي؟',
      ru: 'Сколько стоит установка стеклянного ограждения?',
    },
    excerpt: {
      he: 'פירוט מלא של הגורמים המשפיעים על מחיר התקנת מעקות זכוכית, עוביי זכוכית מומלצים ותקני בטיחות.',
      en: 'A full breakdown of the factors affecting the cost of glass railing installation, recommended glass thicknesses, and safety standards.',
      ar: 'تفصيل كامل للعوامل التي تؤثر على تكلفة تركيب درابزين الزجاج، وسمك الزجاج الموصى به، ومعايير السلامة.',
      ru: 'Полный обзор факторов, влияющих на стоимость установки стеклянного ограждения, рекомендуемая толщина стекла и стандарты безопасности.',
    },
    content: {
      he: `## התמחור של התקנת מעקות זכוכית בישראל

לקוחות רבים שואלים אותנו מהו המחיר הממוצע למטר של התקנת מעקה זכוכית. האמת היא שהמחיר אינו קבוע ותלוי במספר משתנים קריטיים שמשפיעים הן על העיצוב והן על הבטיחות.

### הגורמים המרכזיים המשפיעים על המחיר
1. **שיטת ההתקנה:**
   - **מעקה עמודים (מנגנון פינים):** בדרך כלל הפתרון הזול יותר, שכן הוא אינו מצריך תשתית נסתרת מורכבת.
   - **שתילה בבטון (תעלה נסתרת):** המראה המינימליסטי והיוקרתי ביותר, בו הזכוכית "יוצאת" מהרצפה. דורש הכנה מוקדמת ותעלות אלומיניום מחוזקות, ולכן יקר יותר.
   - **ספיידרים / מנטים (עיגון צד):** התקנה לחזית המדרגה או המרפסת באמצעות עוגני נירוסטה מעוצבים.

2. **עובי וסוג הזכוכית:**
   בכל מעקה מרפסת ומדרגות התקן הישראלי מחייב זכוכית בטיחות מסוג **רבודה ומחוסמת (טריפלקס)**. ההרכבים הנפוצים ביותר הם 8+8 מ"מ מחובר (בפועל מעל 16 מ"מ) או 10+10 מ"מ, בהתאם לגובה המעקה וללחצי הרוח במיקום הספציפי. זכוכית אקסטרה-קליר (שקופה לחלוטין) תעלה יותר מזכוכית רגילה.

3. **סוג הפרזול המשלים:** מאחזי יד עליונים מנירוסטה או עץ, כיסויי פרופילים וצבע האלומיניום.

### האם אפשר לחסוך?
אין לחסוך בעובי או בסוג הזכוכית שכן הדבר נוגע לבטיחות ולעמידה בתקנים! עם זאת, ניתן להוזיל את עלויות ההתקנה על ידי בחירת התקנה עילית פשוטה במקום תעלות נסתרות, ובחירה בזכוכית רגילה במקום אקסטרה-קליר.

לקבלת הצעת מחיר מדויקת ומדידה חינם לפרויקט שלכם, צרו עמנו קשר.`,
      en: `## Pricing Glass Railings in Israel

Many clients ask us about the average per-meter cost for installing a glass railing. The reality is that the price is not fixed and depends on several critical variables that affect both design and safety.

### Main Factors Influencing Cost
1. **Installation Method:**
   - **Post and Clamp:** Generally the more affordable option, as it does not require complex concealed infrastructure.
   - **Base Shoe (Concealed Channel):** The ultimate minimalist and luxurious look, where the glass appears to 'grow' out of the floor. Requires rigorous preparation and reinforced aluminum channels, making it more expensive.
   - **Standoffs / Spiders (Fascia Mount):** Bolted to the side of the stairs or balcony slab using stainless steel anchors.

2. **Glass Thickness and Type:**
   For any balcony or staircase railing, Israeli building codes mandate **tempered and laminated safety glass (Triplex)**. The most common compositions are 8+8mm (totaling over 16mm thick) or 10+10mm, depending on the railing height and local wind loads. Extra-clear glass will cost more than standard clear glass.

3. **Complementary Hardware:** Stainless steel or wooden handrails, profile covers, and the color of the aluminum.

### Can You Save Money?
You should *never* compromise on glass thickness or type, as this directly impacts life safety and strict code compliance! However, you can reduce installation costs by opting for a simpler top-mounted channel instead of structurally embedded ones, and by choosing standard clear glass instead of extra-clear.

For an accurate quote and free measurement for your specific project, contact us today.`,
      ar: 'محتوى يركز على تسعير و معايير درابزين الزجاج.',
      ru: 'Текст о ценообразовании и стандартах на стеклянные перила.',
    },
    readTime: '5 min',
    category: 'Pricing',
    relatedServiceId: 'glass-railings'
  },
  {
    id: 'post-3',
    slug: 'tempered-vs-regular-glass',
    date: '2026-03-12',
    author: 'Shwaki Brothers',
    title: {
      he: 'הבדלים בין זכוכית מחוסמת לרגילה',
      en: 'Differences Between Tempered and Regular Glass',
      ar: 'الاختلافات بين الزجاج المقسى والزجاج العادي',
      ru: 'Различия между закаленным и обычным стеклом',
    },
    excerpt: {
      he: 'מהי זכוכית מחוסמת, מדוע היא חיונית לבטיחות בבית, ובאילו מקרים צריך להשתמש בה על פי התקן.',
      en: 'What is tempered glass, why is it crucial for home safety, and when does the building code require its use.',
      ar: 'ما هو الزجاج المقسى، ولماذا هو حاسم لسلامة المنزل.',
      ru: 'Что такое закаленное стекло, почему оно имеет решающее значение для безопасности дома.',
    },
    content: {
      he: `## ההבדל שמציל חיים

זכוכית נמצאת היום בכל מקום בבית – ממקלחונים ומראות ועד שולחנות וחיפויי קיר. אך לא כל הזכוכיות נוצרו שוות. ההבדל בין זכוכית רגילה (נקראת לעיתים 'אניל חלוט') לזכוכית מחוסמת הוא לעיתים קרובות ההבדל בין פציעה חמורה לשריטה קלה ולעמידה בתקני הבטיחות המחמירים ביותר.

### תהליך החיסום
זכוכית מחוסמת עוברת תהליך תרמי בו היא מחוממת לטמפרטורה של כ-700 מעלות צלזיוס ואז מקוררת במהירות עצומה. הקירור המהיר כולא מאמצי דחיסה בפני השטח של הזכוכית ומאמצי מתיחה במרכזה.

### יתרונות הזכוכית המחוסמת:
1. **חוזק מכני:** זכוכית מחוסמת חזקה פי 4 עד 5 מזכוכית רגילה באותו עובי. היא עמידה בהרבה בפני מכות פיזיות ועומסי כיפוף.
2. **בטיחות שבירה:** זהו היתרון החשוב ביותר. כאשר זכוכית רגילה נשברת, היא מתנפצת לשברים גדולים ומשוננים דמויי סכין ומסכנת חיים. לעומת זאת, כאשר זכוכית מחוסמת נשברת (דבר קשה מאוד בפני עצמו), היא מתפוררת לאלפי רסיסים קטנים וקהים, שאינם גורמים לחתכים עמוקים.
3. **עמידות תרמית:** יכולה לפגוש הבדלי טמפרטורות גבוהים במיוחד, מה שהופך אותה לאידיאלית למטבחים וליד תנורים.

### היכן חובה להשתמש בזכוכית מחוסמת?
על פי התקן, חובה להתקין זכוכית מחוסמת או רבודה ביישומי בטיחות: מקלחונים (חובה!), דלתות פנים וחוץ, מעקות, ויטרינות בגובה הרצפה ומידוף זכוכית נושא משקל. אנו באחים שוואקי מקפידים על כללי הבטיחות המחמירים ביותר למען שקט נפשי של לקוחותינו.`,
      en: `## The Difference That Saves Lives

Glass is everywhere in modern homes – from showers and mirrors to tables and wall claddings. But not all glass is created equal. The difference between regular (annealed) glass and tempered glass is often the difference between a serious injury and a minor scratch, and is dictated by strict safety codes.

### The Tempering Process
Tempered glass undergoes a thermal process where it is heated to about 700°C (1,200°F) and then rapidly cooled. This rapid quenching locks the surfaces in compression and the core in tension.

### Benefits of Tempered Glass:
1. **Mechanical Strength:** Tempered glass is 4 to 5 times stronger than regular glass of the same thickness. It is highly resistant to blunt impacts and bending loads.
2. **Breakage Safety:** This is the most crucial advantage. When regular glass breaks, it shatters into large, razor-sharp shards that are lethal. Conversely, if tempered glass breaks (which is difficult to do), it shatters into thousands of small, blunt pebbles that do not cause deep lacerations.
3. **Thermal Resistance:** It can withstand dramatic temperature swings, making it ideal for kitchen splashbacks and near heat sources.

### Where is Tempered Glass Mandatory?
According to building codes, safety glass (tempered or laminated) must be installed in high-risk areas: shower enclosures (mandatory!), indoor and outdoor doors, railings, floor-level windows, and weight-bearing shelving. At Shwaki Brothers, we rigorously adhere to the strictest safety standards to guarantee our clients' peace of mind.`,
      ar: 'محتوى حول الفرق بين الزجاج المقسى والعادي.',
      ru: 'Разница между закаленным и обычным стеклом.',
    },
    readTime: '3 min',
    category: 'Education',
    relatedServiceId: 'glass-partitions'
  },
  {
    id: 'post-4',
    slug: 'tips-maintaining-glass-showers',
    date: '2026-02-28',
    author: 'Shwaki Brothers',
    title: {
      he: 'טיפים לתחזוקת מקלחוני זכוכית',
      en: 'Tips for Maintaining Glass Showers',
      ar: 'نصائح للحفاظ على كبائن الدش الزجاجية',
      ru: 'Советы по уходу за стеклянными душевыми',
    },
    excerpt: {
      he: 'כיצד למנוע הצטברות אבנית, לנקות נכון את הזכוכית ולשמור על מראה חדש של המקלחון לשנים.',
      en: 'How to prevent limescale buildup, clean your glass correctly, and keep your shower looking brand new for years.',
      ar: 'كيفية منع تراكم الترسبات الكلسية، وتنظيف الزجاج بشكل صحيح، والحفاظ على كابينة الدش كأنها جديدة لسنوات.',
      ru: 'Как предотвратить накопление известкового налета, правильно чистить стекло и сохранить вашу душевую кабину новой на долгие годы.',
    },
    content: {
      he: `## להשאיר את המקלחון נוצץ באמת

מים קשים בישראל הם האויב הגדול ביותר של מקלחוני זכוכית. עם הזמן, טיפות מים שמתייבשות משאירות כתמי אבנית עיקשים שפוגמים במראה הנקי. הנה הטיפים של המומחים שלנו לתחזוקה נכונה.

1. **מגב סיליקון - הסוד האמיתי:**
הדרך הטובה והיעילה ביותר למנוע כתמים היא להשתמש במגב סיליקון מיד לאחר המקלחת. פעולה פשוטה של 10 שניות מסלקת את רוב המים לפני שהם מתייבשים ומונעת התגבשות אבנית מראש.

2. **ציפוי ננו:**
מומלץ מאוד להזמין מקלחונים "משודרגים" עם ציפוי ננו הדוחה מים. הציפוי יוצר שכבה חלקה שגורמת למים להחליק למטה ולא להיאחז בזכוכית. זה לא פוטר אתכם מניקיון, אך הופך את פעולת הניקוי לקלה משמעותית.

3. **חומרים שצריך להימנע מהם:**
לעולם אל תשתמשו בחומרים שורטים כמו ספוגי הפלא (ספוג מלמין) או צמר פלדה. הימנעו מכימיקלים אגרסיביים מדי, במיוחד כאלה המכילים חומצות חריפות, כיוון שהם יכולים להרוס את ציפויי הננו, לאכל את גומיות האטימה או לפגוע בגימור של צבעי הפרזול (כמו פרופיל שחור מט).

4. **ניקיון טבעי:**
תמיסה ביתית של חומץ טבעי מהול במים וסבון כלים ממיסה אבנית בצורה בטוחה ויעילה במקומות הנדרשים ללא סכנה למשטחים רגישים.`,
      en: `## Keeping Your Shower Enclosure Sparkling

Hard water in Israel is the biggest enemy of glass shower enclosures. Over time, water droplets dry and leave behind stubborn limescale deposits that ruin the pristine look. Here are our experts' top maintenance tips.

1. **A Silicone Squeegee – The Real Secret:**
The most effective way to prevent water spots is to use a silicone squeegee immediately after showering. A quick 10-second swipe removes the bulk of the water before it can dry, stopping limescale crystallization in its tracks.

2. **Nano Coatings:**
We highly recommend ordering shower enclosures upgraded with a water-repellent nano-coating. The coating creates a frictionless microscopic layer that forces water to bead up and roll off rather than clinging to the glass. While it doesn't eliminate cleaning entirely, it makes wiping it down incredibly effortless.

3. **What NOT to Use:**
Never use abrasive materials like magic erasers (melamine foam) or steel wool. Avoid highly aggressive chemicals, particularly strong industrial acids. These can not only strip nano-coatings off the glass but also degrade the rubber seals and damage the finishes of colored hardware (like matte black channels).

4. **Natural Cleaning Solutions:**
A homemade mixture of white vinegar, water, and a dash of dish soap securely and effectively dissolves limescale without risking harm to sensitive bathroom surfaces.`,
      ar: 'محتوى حول صيانة الدش الزجاجي.',
      ru: 'Советы по уборке душевой кабины.',
    },
    readTime: '4 min',
    category: 'Maintenance',
    relatedServiceId: 'shower-glass'
  },
  {
    id: 'post-5',
    slug: 'mirrors-in-interior-design',
    date: '2026-02-15',
    author: 'Shwaki Brothers',
    title: {
      he: 'מראות בעיצוב פנים - טרנדים ורעיונות',
      en: 'Mirrors in Interior Design Trends',
      ar: 'المرايا في اتجاهات التصميم الداخلي',
      ru: 'Зеркала в тенденциях дизайна интерьера',
    },
    excerpt: {
      he: 'איך מראות מרחפות, צורות א-סימטריות וקירוי זכוכית משנים את תחושת המרחב בחלל הבית.',
      en: 'How floating mirrors, asymmetric shapes, and glass cladding alter the perception of space in your home.',
      ar: 'كيف تغير المرايا العائمة والأشكال غير المتماثلة والكسوة الزجاجية الشعور بالمساحة.',
      ru: 'Как плавающие зеркала, асимметричные формы и стеклянная облицовка меняют восприятие пространства.',
    },
    content: {
      he: `## מעבר להשתקפות

עיצוב פנים מודרני מנצל מראות לא רק כדי לראות את ההשתקפות שלנו, אלא ככלי אדריכלי עוצמתי לשליטה באור ותחושת המרחב. מראה הממוקמת היטב יכולה להכפיל את כמות האור בחדר ולגרום לחלל קטן להיראות מרווח.

### הטרנדים הבולטים של השנה
1. **עיצוב א-סימטרי ואמורפי:**
העידן של מראות מלבניות פשוטות הגיע לקיצו. הטרנד החם היום הוא מראות בצורות לא גיאומטריות (כמו טיפות, צורות אורגניות חופשיות או מראות אובליות) התלויות בגבהים לא סטנדרטיים. מראות אלו שוברות את הקווים הישרים של הקירות וארונות האמבטיה ומוסיפות רכות.

2. **תאורת לד היקפית (מראות מרחפות):**
מראות שמכילות תאורת לד נסתרת בגבן כך שהן נראות מנותקות מהקיר ומרחפות בחלל. מראות ענקיות מקיר לקיר מעל כיור כפול יוצרות אווירה של מלון בוטיק יוצא ויוקרתי.

3. **שילוב מראות בחיפוי קיר:**
בסלונים או אזורי פינות אוכל, התקנת מראה גדולה ומעוצבת לאורך קיר שלם מחזירה את הנוף שמחוץ לחלון פנימה אל תוך הבית, ומכפילה ויזואלית את גודל החדר.

### התקנה מקצועית זה הכל
עבודה עם מראות גדולות (High Def) דורשת התקנה מדויקת מאוד כדי למנוע "עיוותי מראה" (כאשר המשטח אינו ישר לחלוטין ויש פיתול שגורם להשתקפות להיראות מצחיקה). באחים שוואקי אנו מוודאים שהקיר מוכן כראוי, מספקים מראות בעובי מתאים ליציבות, ומשתמשים בדבקים עמידי לחות להגנה גם בחדרי אמבטיה.`,
      en: `## Beyond the Reflection

Modern interior design utilizes mirrors not simply for seeing our reflection, but as a powerful architectural tool to manipulate light and the perception of space. A well-placed mirror can double the amount of natural daylight in a room and make a small space feel remarkably expansive.

### This Year's Leading Trends
1. **Asymmetric and Amorphous Designs:**
The era of plain rectangular mirrors is fading. The hottest trend today features irregularly shaped mirrors (organic fluid forms, pebbles, asymmetrical drops). These mirrors break up the rigid, straight lines of standard walls and bathroom vanities, introducing a sense of softness and flow.

2. **Backlit Floating Mirrors:**
These mirrors feature concealed LED lighting mounted on the back framing. The glow washes against the wall, making the mirror appear as if it's floating effortlessly in space. Wall-to-wall floating mirrors over a double vanity instantly bring a luxury boutique hotel atmosphere to your master bathroom.

3. **Architectural Wall Cladding:**
In living rooms and dining areas, installing large-format mirrors across an entire structural wall reflects the view from adjacent windows, drawing the outside deeply into the interior and visually doubling the room’s footprint.

### Professional Installation is Everything
Working with large-format, high-definition mirrors requires exceptionally precise installation to prevent "funhouse distortion" (which occurs when the mounting surface isn't perfectly flat, causing the mirror to bow slightly). At Shwaki Brothers, we ensure the wall substrate is properly prepped, supply appropriately thick glass for rigid stability, and use high-grade moisture-resistant adhesives for guaranteed longevity even in damp bathrooms.`,
      ar: 'محتوى حول اتجاهات تصميم المرايا.',
      ru: 'Текст о тенденциях в дизайне зеркал.',
    },
    readTime: '3 min',
    category: 'Design',
    relatedServiceId: 'glass-mirrors'
  }
];

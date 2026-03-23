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

const localizedText = (en: string, he: string): LocalizedText => ({
  en,
  he,
  ar: en,
  ru: en,
});

const localizedArray = (en: string[], he: string[]): LocalizedArray => ({
  en,
  he,
  ar: en,
  ru: en,
});

export const LOCATION_SEO_ALIAS_PREFIX = 'glass-installation';

export const LOCATION_SEO_LINKS: SeoLocationLink[] = [
  { slug: 'jerusalem', label: localizedText('Jerusalem', 'ירושלים') },
  { slug: 'tel-aviv', label: localizedText('Tel Aviv', 'תל אביב') },
  { slug: 'modiin', label: localizedText('Modiin', 'מודיעין') },
  { slug: 'haifa', label: localizedText('Haifa', 'חיפה') },
  { slug: 'beer-sheva', label: localizedText('Beer Sheva', 'באר שבע') },
  { slug: 'netanya', label: localizedText('Netanya', 'נתניה') },
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
    eyebrow: localizedText('Frameless and custom shower glass', 'מקלחונים בהתאמה אישית וללא מסגרת'),
    heroTitle: localizedText('Glass Shower Installation', 'התקנת מקלחוני זכוכית'),
    heroSubtitle: localizedText(
      'Custom glass shower installation for apartments, villas, renovations, and contractor projects in Jerusalem, Tel Aviv, Modiin, and across Israel.',
      'התקנת מקלחוני זכוכית בהתאמה אישית לדירות, בתים פרטיים, שיפוצים ופרויקטים לקבלנים בירושלים, תל אביב, מודיעין ובכל רחבי ישראל.'
    ),
    metaTitle: localizedText(
      'Glass Shower Installation in Israel | Frameless Shower Glass',
      'התקנת מקלחוני זכוכית בישראל | מקלחונים ללא מסגרת'
    ),
    metaDescription: localizedText(
      'Custom glass shower installation in Jerusalem, Tel Aviv, Modiin, and across Israel. Frameless showers, sliding systems, fixed panels, free measurement and fast installation.',
      'התקנת מקלחוני זכוכית בהתאמה אישית בירושלים, תל אביב, מודיעין ובכל הארץ. מקלחונים ללא מסגרת, דלתות הזזה, פנלים קבועים, מדידה חינם והתקנה מהירה.'
    ),
    keywords: localizedText(
      'glass shower installation, frameless shower glass, shower enclosure installation, custom shower glass Jerusalem, shower glass Tel Aviv, shower glass Modiin',
      'התקנת מקלחוני זכוכית, מקלחון ללא מסגרת, מקלחון זכוכית בהתאמה אישית, מקלחונים ירושלים, מקלחונים תל אביב, מקלחונים מודיעין'
    ),
    intro: localizedText(
      'A well planned shower enclosure changes the way a bathroom feels. Instead of bulky profiles, heavy curtains, or awkward corners, custom glass shower installation creates a clean opening, lets more light move through the room, and makes even compact bathrooms feel bigger. We build shower glass to fit the exact measurements of the space, whether the layout calls for a fixed walk-in panel, a hinged door, a sliding system, or a corner enclosure. Each project starts with the actual site conditions, because tiles, slopes, walls, and plumbing details all affect how the glass should be fabricated and installed. That is why dedicated service pages matter for SEO and for clients: they explain what is included, what glass types are available, and how the work is completed from measurement through final sealing.',
      'מקלחון מתוכנן היטב משנה לגמרי את תחושת חדר הרחצה. במקום פרופילים כבדים, וילונות מסורבלים או פינות לא נוחות, התקנת מקלחון זכוכית בהתאמה אישית יוצרת מראה נקי, מכניסה יותר אור לחלל וגורמת גם לחדרי רחצה קטנים להרגיש פתוחים יותר. אנחנו מייצרים ומתקינים זכוכית לפי המידות המדויקות של המקום, בין אם צריך פנל קבוע, דלת צירים, מערכת הזזה או מקלחון פינתי. כל פרויקט מתחיל בתנאי השטח האמיתיים, כי אריחים, שיפועים, קירות ופרטי אינסטלציה משפיעים על אופן הייצור וההתקנה. זו גם הסיבה שדף שירות ייעודי חשוב גם ללקוחות וגם לקידום אורגני: הוא מסביר בדיוק מה כלול בשירות, אילו סוגי זכוכית קיימים ואיך העבודה מתבצעת משלב המדידה ועד האיטום הסופי.'
    ),
    overview: localizedText(
      'Our glass shower installation service is built around accuracy and long term usability. We measure openings, wall alignment, and access points before the glass is cut, then match the enclosure to the way the bathroom is actually used. Some clients want a minimalist frameless look with hidden hardware and clear glass. Others need a more practical solution with soft privacy, black hardware, sliding access, or easier movement inside a family bathroom. We design around those goals instead of forcing one standard model into every home. The result is a shower enclosure that looks intentional, opens smoothly, seals correctly, and sits neatly against finished tile, stone, or microcement surfaces. This kind of clarity helps search engines understand the service and helps homeowners compare options before requesting a quote.',
      'שירות התקנת המקלחונים שלנו מבוסס על דיוק ועל שימוש נוח לאורך זמן. לפני חיתוך הזכוכית אנחנו מודדים את הפתח, בודקים יישור קירות, נקודות גישה ופרטי גמר, ואז מתאימים את המקלחון לאופן שבו באמת משתמשים בחדר הרחצה. יש לקוחות שמחפשים מראה מינימליסטי ללא מסגרת עם זכוכית שקופה ופרזול עדין, ואחרים מעדיפים פתרון פרקטי יותר עם פרטיות חלקית, פרזול שחור, פתיחת הזזה או כניסה נוחה יותר לחדר רחצה משפחתי. אנחנו לא כופים דגם סטנדרטי על כל בית, אלא מתכננים סביב הצרכים של הלקוח. כך מתקבל מקלחון שנראה נכון, נפתח בצורה חלקה, נאטם היטב ומתחבר בצורה מדויקת לאריחים, אבן או מיקרוצמנט. התוכן המפורט הזה עוזר גם לגוגל להבין את השירות וגם ללקוחות להשוות אפשרויות לפני שהם פונים.'
    ),
    options: localizedText(
      'Most shower projects use tempered safety glass in 8 mm or 10 mm thickness, but the finish and hardware package make a big difference in the final look. Clear glass keeps the room bright and open, extra clear glass removes the green tint, frosted glass adds privacy, and patterned or fluted options soften visibility without making the space feel closed. We also help clients choose between chrome, black, brushed nickel, brass, and stainless hardware depending on the rest of the bathroom. In many homes, a protective coating is worth adding because it helps reduce water marks and makes weekly cleaning easier. When the page explains these choices in plain language, it gives the site stronger keyword coverage around shower glass types, frameless showers, and custom bathroom glass installation.',
      'ברוב פרויקטי המקלחונים אנחנו משתמשים בזכוכית מחוסמת בעובי 8 או 10 מ"מ, אבל הגימור והפרזול הם מה שמשפיע באמת על המראה הסופי. זכוכית שקופה שומרת על תחושה פתוחה ומוארת, זכוכית אקסטרה קליר מפחיתה את הגוון הירקרק, זכוכית חלבית מוסיפה פרטיות, ואפשרויות כמו זכוכית מפוספסת או טקסטורלית יוצרות סינון עדין בלי לסגור את החלל. אנחנו מסייעים גם בבחירת פרזול כרום, שחור, ניקל מוברש, פליז או נירוסטה לפי שפת העיצוב של חדר הרחצה. בהרבה בתים כדאי להוסיף גם ציפוי הגנה שמפחית סימני מים ומקל על התחזוקה השוטפת. כשמסבירים את כל האפשרויות האלו בצורה ברורה, מתקבל גם כיסוי טוב יותר לביטויי חיפוש סביב מקלחונים, זכוכית מחוסמת, מקלחון ללא מסגרת והתקנת זכוכית לאמבטיה.'
    ),
    process: localizedText(
      'The installation process begins with on site measurement, not with guesswork from a floor plan. We inspect walls, check where hinges or channels can sit safely, confirm drainage direction, and note anything that may affect sealing. After fabrication, the glass is brought to site with the selected hardware and installed in a controlled sequence so that alignment, door swing, and water protection are all checked before final handover. For renovated apartments in Jerusalem, modern towers in Tel Aviv, and family homes in Modiin, the same principle applies: measure precisely, fabricate accurately, and install cleanly. That is exactly the kind of detailed service content Google expects to find on a page that wants to rank for glass shower installation and custom shower enclosure terms.',
      'תהליך ההתקנה מתחיל במדידה בשטח, ולא בניחוש לפי תוכנית כללית. אנחנו בודקים קירות, מוודאים איפה ניתן למקם צירים או פרופילים בצורה בטוחה, מאשרים את כיוון הניקוז ורושמים כל פרט שעשוי להשפיע על האיטום. לאחר הייצור הזכוכית והפרזול מגיעים לאתר, וההתקנה מתבצעת בסדר עבודה מדויק כדי לבדוק יישור, פתיחת דלת והגנה מפני מים לפני מסירה סופית. בין אם מדובר בדירה משופצת בירושלים, במגדל מודרני בתל אביב או בבית משפחתי במודיעין, העיקרון זהה: מדידה מדויקת, ייצור נכון והתקנה נקייה. זה בדיוק סוג התוכן המפורט שגוגל מצפה למצוא בדף שמנסה לדרג על ביטויים כמו התקנת מקלחוני זכוכית, מקלחון בהתאמה אישית או זכוכית לחדר רחצה.'
    ),
    benefits: localizedText(
      'Clients usually choose glass showers for a mix of design, maintenance, and resale value. A custom enclosure makes the bathroom feel larger, highlights tile and stone finishes, and eliminates many of the visual interruptions caused by bulky frames. It also creates a solution that fits the exact dimensions of the room rather than leaving wasted gaps or awkward overlaps. From an SEO standpoint, this section helps target the reasons people search before they buy: easy to clean shower glass, walk in shower installation, frameless shower benefits, and custom bathroom renovation ideas. From a practical standpoint, it gives homeowners the confidence to ask for the right layout, the right privacy level, and the right hardware package before fabrication begins.',
      'לקוחות בוחרים במקלחוני זכוכית בדרך כלל משילוב של עיצוב, תחזוקה וערך לנכס. מקלחון מותאם אישית גורם לחדר הרחצה להרגיש גדול יותר, מדגיש חיפויי אבן וקרמיקה ומעלים הרבה מהעומס הוויזואלי שנוצר על ידי מסגרות כבדות. מעבר לכך, הוא יוצר פתרון שמתאים בדיוק למידות של החדר במקום להשאיר רווחים מיותרים או חפיפות לא נוחות. מבחינת SEO, החלק הזה תומך בביטויי חיפוש שלקוחות מקלידים לפני שהם מחליטים: זכוכית מקלחון קלה לניקוי, מקלחון הליכה פנימה, יתרונות מקלחון ללא מסגרת ורעיונות לשיפוץ חדר רחצה. מבחינה מעשית, הוא עוזר ללקוח להבין איזה מבנה, איזו רמת פרטיות ואיזה סוג פרזול נכון לבחור עוד לפני תחילת הייצור.'
    ),
    areasSummary: localizedText(
      'We install shower glass across Israel and regularly handle bathroom projects in Jerusalem, Tel Aviv, Modiin, Haifa, and Beer Sheva. Every city brings different site conditions, from compact urban bathrooms and high rise apartments to larger family homes and renovation projects with older walls. Dedicated location pages let us explain those differences in a way that strengthens local SEO and helps customers land on a page that matches both the service and the city they searched for. If someone is looking for custom glass shower installation in Jerusalem or frameless shower glass in Tel Aviv, they should reach a page that addresses that need directly instead of being forced into a generic gallery.',
      'אנחנו מתקינים מקלחוני זכוכית בכל רחבי ישראל ומבצעים באופן קבוע פרויקטים בירושלים, תל אביב, מודיעין, חיפה ובאר שבע. לכל עיר יש תנאי שטח שונים, החל מחדרי רחצה קטנים בדירות עירוניות ובמגדלים, ועד בתים משפחתיים גדולים ושיפוצים בדירות עם קירות ישנים. דפי אזור ייעודיים מאפשרים לנו להסביר את ההבדלים האלו בצורה שתומכת גם בקידום מקומי וגם בחוויית המשתמש. אם מישהו מחפש התקנת מקלחוני זכוכית בירושלים או מקלחון ללא מסגרת בתל אביב, הוא צריך להגיע לדף שמדבר בדיוק על השירות והעיר שהוא חיפש, ולא להיאבד בתוך גלריה כללית.'
    ),
    highlights: localizedArray(
      ['Frameless walk-in showers', 'Sliding shower systems', 'Corner enclosures', 'Black, brass, or stainless hardware', 'Clear, frosted, or fluted glass', 'Free on-site measurement'],
      ['מקלחוני הליכה פנימה ללא מסגרת', 'מערכות הזזה למקלחון', 'מקלחונים פינתיים', 'פרזול שחור, פליז או נירוסטה', 'זכוכית שקופה, חלבית או מפוספסת', 'מדידה חינם בבית הלקוח']
    ),
    materialOptions: localizedArray(
      ['8 mm tempered safety glass', '10 mm premium frameless panels', 'Easy-clean protective coating', 'Custom handles, hinges, and support bars'],
      ['זכוכית מחוסמת 8 מ"מ', 'פנלים פרימיום 10 מ"מ ללא מסגרת', 'ציפוי הגנה קל לניקוי', 'ידיות, צירים ומוטות תמיכה בהתאמה']
    ),
    faqs: [
      {
        question: localizedText('What glass thickness is recommended for a shower enclosure?', 'איזה עובי זכוכית מומלץ למקלחון?'),
        answer: localizedText(
          'For most custom shower installations we recommend tempered safety glass in 8 mm or 10 mm thickness, depending on the opening, hardware, and design style.',
          'ברוב פרויקטי המקלחונים אנחנו ממליצים על זכוכית מחוסמת בטיחותית בעובי 8 או 10 מ"מ, בהתאם לפתח, לפרזול ולסגנון העיצובי.'
        ),
      },
      {
        question: localizedText('Can you install shower glass in small bathrooms?', 'האם אפשר להתקין מקלחון זכוכית גם בחדר רחצה קטן?'),
        answer: localizedText(
          'Yes. Small bathrooms often benefit the most from custom shower glass because a fixed panel, precise hinge layout, or sliding door can save space and keep the room visually open.',
          'כן. דווקא חדרי רחצה קטנים נהנים במיוחד ממקלחון מותאם אישית, כי פנל קבוע, פתיחת צירים מדויקת או דלת הזזה יכולים לחסוך מקום ולשמור על תחושה פתוחה.'
        ),
      },
      {
        question: localizedText('Do you handle both new bathrooms and renovations?', 'האם אתם עובדים גם בשיפוץ וגם בבנייה חדשה?'),
        answer: localizedText(
          'We do. We install shower glass for new construction, full bathroom renovations, apartment upgrades, and contractor handover projects across Israel.',
          'בהחלט. אנחנו מתקינים מקלחונים בבנייה חדשה, בשיפוצי אמבטיה מלאים, בשדרוג דירות ובפרויקטים לקבלנים בכל רחבי הארץ.'
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
    eyebrow: localizedText('Balcony and staircase safety glass', 'מעקות זכוכית למרפסות ומדרגות'),
    heroTitle: localizedText('Glass Railing Installation', 'התקנת מעקות זכוכית'),
    heroSubtitle: localizedText(
      'Custom glass railing installation for balconies, stairs, rooftops, and interior voids with a clean modern finish and code-aware detailing.',
      'התקנת מעקות זכוכית בהתאמה אישית למרפסות, מדרגות, גגות וחללים פנימיים עם גמר מודרני, בטיחותי ומדויק.'
    ),
    metaTitle: localizedText(
      'Glass Railing Installation in Israel | Balcony and Stair Glass',
      'התקנת מעקות זכוכית בישראל | מעקות למרפסות ולמדרגות'
    ),
    metaDescription: localizedText(
      'Professional glass railing installation in Jerusalem, Tel Aviv, Modiin, Haifa, and across Israel. Balcony railings, stair railings, laminated glass and premium hardware.',
      'התקנת מעקות זכוכית מקצועית בירושלים, תל אביב, מודיעין, חיפה ובכל ישראל. מעקות למרפסות ולמדרגות, זכוכית למינציה ופרזול איכותי.'
    ),
    keywords: localizedText(
      'glass railing installation, balcony glass railing, staircase glass railing, glass balustrade Israel, glass railing Jerusalem, glass railing Tel Aviv',
      'התקנת מעקות זכוכית, מעקה זכוכית למרפסת, מעקה זכוכית למדרגות, מעקה זכוכית ישראל, מעקות זכוכית ירושלים, מעקות זכוכית תל אביב'
    ),
    intro: localizedText(
      'Glass railing installation is one of the clearest examples of a service that deserves its own landing page. People search for balcony glass railings, staircase glass balustrades, pool-edge safety glass, and frameless railings with very specific intent. A generic services page does not explain enough about safety, hardware systems, or the differences between indoor and outdoor conditions. Our railing work is designed around structural requirements and clean visual lines. We fabricate and install railings that keep views open while protecting balconies, landings, and staircases. Whether the project is for a modern apartment tower, a private villa, a rooftop terrace, or a commercial stair, the design has to balance transparency, safety, wind exposure, and the style of the surrounding architecture.',
      'התקנת מעקות זכוכית היא דוגמה מצוינת לשירות שצריך דף ייעודי משלו. אנשים מחפשים מעקה זכוכית למרפסת, מעקה זכוכית למדרגות, מעקה בריכה או מעקה ללא מסגרת עם כוונה מאוד ברורה, ודף שירות כללי לא מסביר מספיק על בטיחות, על סוגי פרזול או על ההבדל בין חוץ לפנים. עבודות המעקות שלנו מתוכננות סביב דרישות מבניות וקווים נקיים מבחינה עיצובית. אנחנו מייצרים ומתקינים מעקות ששומרים על שדה ראייה פתוח ובו זמנית מגנים על מרפסות, פודסטים ומדרגות. בין אם מדובר במגדל מגורים מודרני, וילה פרטית, גג אירוח או גרם מדרגות מסחרי, התכנון צריך לאזן בין שקיפות, בטיחות, עומסי רוח והשפה האדריכלית של המבנה.'
    ),
    overview: localizedText(
      'Every railing project begins with the actual span, fixing points, and edge conditions. Some systems rely on base shoes, some use standoffs, and some combine glass with slim metal handrails for additional guidance. Our job is to match the system to the structure, the usage, and the visual brief. Balcony railings need different detailing from an internal stair, especially when they are exposed to weather, cleaning chemicals, and ongoing movement. For homeowners and contractors, this page gives a clearer understanding of what is possible and why the same term “glass railing” can describe several different build methods. For SEO, that specificity helps the site match searches for balcony glass railing installation, stair glass railing, and frameless balustrade systems.',
      'כל פרויקט מעקות מתחיל בבדיקה של המפתח, נקודות העיגון ותנאי הקצה. יש מערכות שמבוססות על נעל בסיס, אחרות על נקודות עיגון צדדיות, ואחרות משלבות זכוכית עם מאחז יד דק ממתכת לצורך הנחיה נוספת. התפקיד שלנו הוא להתאים את השיטה למבנה, לשימוש ולשפה העיצובית. מעקה למרפסת דורש תכנון שונה ממעקה לגרם מדרגות פנימי, במיוחד כשיש חשיפה למזג אוויר, חומרי ניקוי ותנועה מתמשכת. מבחינת לקוחות וקבלנים, הדף הזה מסביר טוב יותר מה אפשרי ולמה אותו ביטוי, “מעקה זכוכית”, יכול להתייחס לכמה שיטות ביצוע שונות. מבחינת קידום אורגני, הפירוט הזה מחזק התאמה לחיפושים כמו מעקה זכוכית למרפסת, מעקה זכוכית למדרגות או מערכת בלוסטרדה ללא מסגרת.'
    ),
    options: localizedText(
      'Outdoor railings often use laminated and tempered safety glass together with corrosion resistant hardware, while interior stair railings may allow a lighter visual solution. We help clients compare clear and extra-clear glass, top rails versus frameless edges, concealed base channels versus visible brackets, and finishes that coordinate with aluminum, stone, wood, or steel. These details matter because railing decisions affect both safety and the overall facade or interior line. A detailed service page also captures valuable keywords around laminated glass railings, balcony safety glass, rooftop railings, and custom staircase glazing. That written content gives search engines enough context to understand that the site specializes in this exact service instead of mentioning it only once on a crowded overview page.',
      'במעקות חוץ אנחנו משתמשים בדרך כלל בזכוכית בטיחות רבודה ומחוסמת יחד עם פרזול עמיד לקורוזיה, בעוד שבמעקות פנימיים למדרגות אפשר לעיתים לבחור פתרון ויזואלי קל יותר. אנחנו מסייעים להשוות בין זכוכית שקופה לאקסטרה קליר, בין מאחז יד עליון לקצה זכוכית נקי, בין תעלת בסיס נסתרת לתושבות גלויות ובין גימורים שמתאימים לאלומיניום, אבן, עץ או פלדה. הפרטים האלה חשובים כי בחירת המעקה משפיעה גם על הבטיחות וגם על קו החזית או הפנים. דף שירות מפורט מאפשר לכסות גם מילות מפתח חשובות סביב מעקות זכוכית רבודה, מעקות בטיחות למרפסת, מעקה לגג ומעקות זכוכית למדרגות, וכך גוגל מבין שמדובר בהתמחות אמיתית ולא באזכור בודד בדף עמוס.'
    ),
    process: localizedText(
      'Installation includes measurement, system selection, fabrication planning, and clean fitting on site. We coordinate around tile edges, concrete parapets, steel substrates, and finished stone details so the railing sits correctly and looks intentional from every angle. On stairs, the rise and run of the staircase influence where joints, brackets, and hand support should be placed. On balconies and rooftops, we account for exposure and sight lines. This is the sort of content people actually search for before spending money, and it is also the kind of structured text Google uses to understand expertise. A dedicated page that explains the installation process performs far better than a thin paragraph that simply says “we also do railings.”',
      'תהליך ההתקנה כולל מדידה, בחירת מערכת, תכנון ייצור והתקנה נקייה באתר. אנחנו מתאמים את העבודה סביב קצות ריצוף, מעקות בטון, תשתיות פלדה וגמרי אבן כדי שהמערכת תשב נכון ותראה מדויקת מכל זווית. במדרגות, גם הגובה והרום של כל מדרגה משפיעים על מיקום החיבורים, התושבות והמאחז. במרפסות ובגגות צריך להתייחס לחשיפה למזג אוויר ולשדה הראייה. זה בדיוק סוג התוכן שאנשים מחפשים לפני הוצאה משמעותית, וזה גם סוג הטקסט שגוגל נעזר בו כדי להבין מומחיות. דף ייעודי שמסביר את תהליך ההתקנה עובד הרבה יותר טוב מפסקה קצרה שמסתפקת במשפט “אנחנו גם עושים מעקות”.'
    ),
    benefits: localizedText(
      'Clients choose glass railings because they preserve light and views while giving the property a sharper, more contemporary finish. On a balcony, the difference is immediate: the horizon stays visible instead of being cut by heavy bars or filled panels. Inside the home, glass keeps stair zones visually connected and can make narrow vertical spaces feel much more open. The benefits section is also valuable for search intent. It answers why someone would search for balcony glass railing, modern stair railing, or frameless railing installation in the first place. By combining practical benefits with location-specific landing pages, the site becomes much more relevant for local searches like glass railing Jerusalem or balcony railing Tel Aviv.',
      'לקוחות בוחרים במעקות זכוכית כי הם שומרים על אור ועל נוף פתוח ובאותו זמן נותנים לנכס מראה חד, אלגנטי ועכשווי יותר. במרפסת ההבדל מורגש מיד: קו האופק נשאר פתוח במקום להיחתך על ידי סורגים או פאנלים אטומים. בתוך הבית, זכוכית שומרת על חיבור חזותי בין מפלסים ויכולה לגרום גם לאזורי מדרגות צרים להרגיש פתוחים הרבה יותר. גם לחלק הזה יש ערך לקידום אורגני, כי הוא עונה על השאלה למה בכלל לחפש מעקה זכוכית למרפסת, מעקה מודרני למדרגות או התקנת מעקה ללא מסגרת. כשהתוכן הזה מחובר גם לדפי מיקום מקומיים, האתר הופך לרלוונטי הרבה יותר לחיפושים כמו מעקות זכוכית ירושלים או מעקה מרפסת זכוכית תל אביב.'
    ),
    areasSummary: localizedText(
      'We install glass railings across Israel, including city apartments, hillside homes, private villas, offices, and rooftop spaces. Jerusalem projects often involve stone parapets and renovation details, Tel Aviv projects lean toward clean contemporary lines, and Modiin homes frequently combine family use with open balcony layouts. A strong location strategy matters because people search by city almost as often as they search by service. Linking this railing page to city pages gives both users and search engines a clearer path between the service and the places where it is offered.',
      'אנחנו מתקינים מעקות זכוכית בכל רחבי ישראל, בדירות עירוניות, בבתים על מדרון, בוילות, במשרדים ובחללי גג. פרויקטים בירושלים כוללים לא פעם מעקות אבן ושיפוצים מורכבים, בתל אביב יש נטייה לקווים עכשוויים נקיים, ובמודיעין הרבה בתים משלבים שימוש משפחתי עם מרפסות פתוחות. אסטרטגיית מיקום חזקה חשובה כי אנשים מחפשים לפי עיר כמעט באותה תדירות שבה הם מחפשים לפי שירות. הקישור בין דף המעקות לבין דפי הערים נותן גם למשתמשים וגם למנועי חיפוש מסלול ברור יותר בין השירות לבין המקומות שבהם הוא מוצע.'
    ),
    highlights: localizedArray(
      ['Balcony glass railings', 'Staircase glass balustrades', 'Rooftop safety glazing', 'Laminated and tempered glass', 'Concealed base or bracket systems', 'Interior and exterior applications'],
      ['מעקות זכוכית למרפסות', 'בלוסטרדות זכוכית למדרגות', 'מעקות בטיחות לגגות', 'זכוכית רבודה ומחוסמת', 'מערכות בסיס נסתר או תושבות', 'התקנות לפנים ולחוץ']
    ),
    materialOptions: localizedArray(
      ['Laminated safety glass', 'Tempered glass panels', 'Stainless or black hardware', 'Optional top rail integration'],
      ['זכוכית בטיחות רבודה', 'פנלים מחוסמים', 'פרזול נירוסטה או שחור', 'אפשרות לשילוב מאחז יד עליון']
    ),
    faqs: [
      {
        question: localizedText('What type of glass is best for a balcony railing?', 'איזה סוג זכוכית מתאים למעקה מרפסת?'),
        answer: localizedText(
          'Balcony railings usually require safety-focused glazing, often laminated and tempered, together with hardware suited to the edge condition and exposure.',
          'במעקות מרפסת נדרש בדרך כלל זיגוג בטיחותי, לרוב זכוכית רבודה ומחוסמת, יחד עם פרזול שמתאים לתנאי הקצה ולחשיפה למזג אוויר.'
        ),
      },
      {
        question: localizedText('Can glass railings be installed on stairs as well?', 'האם אפשר להתקין מעקות זכוכית גם במדרגות?'),
        answer: localizedText(
          'Yes. Glass railings are widely used for interior staircases and need to be planned around the stair geometry, support points, and hand guidance requirements.',
          'כן. מעקות זכוכית נפוצים מאוד במדרגות פנימיות, וצריך לתכנן אותם לפי גיאומטריית המדרגות, נקודות העיגון ודרישות ההנחיה ביד.'
        ),
      },
      {
        question: localizedText('Do frameless railings still use metal hardware?', 'האם מעקה ללא מסגרת עדיין כולל פרזול מתכתי?'),
        answer: localizedText(
          'Usually yes. Even very clean frameless systems depend on hidden base channels, standoffs, or other engineered hardware to secure the glass safely.',
          'ברוב המקרים כן. גם מערכות שנראות נקיות וללא מסגרת נשענות על תעלות בסיס נסתרות, נקודות עיגון או פרזול הנדסי אחר שמחבר את הזכוכית בצורה בטוחה.'
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
    eyebrow: localizedText('Bathroom, gym, decorative, and wall mirrors', 'מראות לחדרי רחצה, חדרי כושר וקירות דקורטיביים'),
    heroTitle: localizedText('Custom Glass Mirrors', 'מראות זכוכית בהתאמה אישית'),
    heroSubtitle: localizedText(
      'Custom mirror supply and installation for bathrooms, entry halls, living rooms, studios, gyms, and commercial interiors across Israel.',
      'אספקה והתקנה של מראות בהתאמה אישית לחדרי רחצה, מבואות, סלונים, סטודיו, חדרי כושר וחללים מסחריים בכל רחבי ישראל.'
    ),
    metaTitle: localizedText(
      'Custom Mirrors in Israel | Bathroom, Gym, and Decorative Mirrors',
      'מראות בהתאמה אישית בישראל | מראות לאמבטיה, חדר כושר ודקורציה'
    ),
    metaDescription: localizedText(
      'Custom mirror installation in Jerusalem, Tel Aviv, Modiin, and across Israel. Bathroom mirrors, full wall mirrors, gym mirrors, LED options and precise fitting.',
      'התקנת מראות בהתאמה אישית בירושלים, תל אביב, מודיעין ובכל ישראל. מראות אמבטיה, קירות מראה, מראות לחדר כושר, תאורת LED והתקנה מדויקת.'
    ),
    keywords: localizedText(
      'custom mirrors, mirror installation, bathroom mirror installation, gym mirrors, decorative wall mirror, mirror wall Israel',
      'מראות בהתאמה אישית, התקנת מראות, מראה לאמבטיה, קיר מראות, מראות לחדר כושר, מראה דקורטיבית'
    ),
    intro: localizedText(
      'Mirror projects often get treated like a small accessory, but custom mirror installation is a specialized service with real design and technical impact. A mirror can brighten a narrow corridor, enlarge a compact bathroom, complete a dressing area, or turn a plain wall into a strong design feature. In gyms, studios, and commercial interiors, mirror layout affects both function and safety. Because mirror searches are so specific, a dedicated page gives Google much clearer signals around bathroom mirrors, full wall mirrors, gym mirrors, LED mirrors, and mirror installation. It also helps clients understand the difference between a ready-made product and a mirror cut, edged, and installed precisely for their space.',
      'פרויקטי מראות נתפסים לפעמים כתוספת קטנה, אבל התקנת מראות בהתאמה אישית היא שירות מקצועי עם השפעה אמיתית על תכנון ועיצוב החלל. מראה יכולה להאיר מסדרון צר, להגדיל תחושת מרחב בחדר רחצה, להשלים אזור הלבשה או להפוך קיר פשוט לאלמנט עיצובי חזק. בחדרי כושר, סטודיו וחללים מסחריים, מיקום המראות משפיע גם על הפונקציה וגם על הבטיחות. מאחר שחיפושים בתחום הזה מאוד ממוקדים, דף ייעודי נותן לגוגל אותות ברורים הרבה יותר סביב מראות לאמבטיה, קירות מראה, מראות לחדר כושר, מראות עם תאורה והתקנת מראות. הוא גם עוזר ללקוחות להבין מה ההבדל בין מוצר מדף לבין מראה שנחתכת, עוברת ליטוש ומותקנת בדיוק לפי המידה של החלל.'
    ),
    overview: localizedText(
      'Our mirror service covers both residential and commercial spaces. In homes, we install bathroom mirrors above vanities, full height mirrors for bedrooms and closets, and decorative mirrors for entrances, dining rooms, and living spaces. In commercial settings we handle gym walls, studio mirrors, retail mirrors, salon mirrors, and office details where scale and alignment matter. Precision is important because mirror edges, sockets, lighting, tile joints, and neighboring cabinetry all need to work together visually. That level of detail makes the page stronger for SEO and more useful for visitors. Instead of only seeing a photo, they get written information about mirror types, edge finishes, mounting methods, and the best use cases for each option.',
      'שירות המראות שלנו כולל גם חללים פרטיים וגם מסחריים. בבתים אנחנו מתקינים מראות אמבטיה מעל ארונות, מראות בגובה מלא לחדרי שינה וחדרי ארונות, ומראות דקורטיביות למבואות, פינות אוכל וסלונים. בחללים מסחריים אנחנו מבצעים קירות מראה לחדרי כושר, מראות לסטודיו, מראות לחנויות, לסלונים ולעמדות עבודה שבהן קנה המידה והיישור חשובים במיוחד. הדיוק משמעותי כי שפת המראה צריכה לעבוד נכון עם שקעים, תאורה, פוגות, נגרות וחיפויים סמוכים. רמת הפירוט הזו מחזקת גם את הקידום האורגני וגם את חוויית המשתמש, כי במקום לראות רק תמונה, המבקר מקבל מידע כתוב על סוגי מראות, גימורי קצה, שיטות התקנה והשימושים המתאימים לכל אפשרות.'
    ),
    options: localizedText(
      'A custom mirror can be polished, beveled, backlit, anti-fog prepared, or shaped to fit a niche, column, or furniture line. In bathrooms, moisture resistance and integration with lighting matter. In gyms and studios, panel sizing, joint alignment, and safe wall fixing are usually the priority. Decorative mirrors may focus more on edge treatment, tint, or how the mirror reflects a key part of the room. Explaining these distinctions on the page improves the site’s keyword coverage around bathroom mirror installation, LED mirror walls, gym mirrors, and custom decorative mirrors. It also helps clients choose the right product instead of guessing from a single gallery image.',
      'מראה בהתאמה אישית יכולה להגיע עם ליטוש קצוות, פאזה, תאורה אחורית, הכנה נגד אדים או צורה מיוחדת שמתאימה לגומחה, לעמוד או לקו נגרות. בחדרי רחצה חשובים עמידות ללחות וחיבור נכון לתאורה. בחדרי כושר ובסטודיו, הדגש עובר לעיתים לגודל הפנלים, ליישור החיבורים ולעיגון בטוח לקיר. מראות דקורטיביות יכולות להישען יותר על טיפול בקצה, על גוון או על האופן שבו הן מחזירות חלק מסוים מהחלל. כשמסבירים את ההבדלים האלה בדף עצמו, מתקבל כיסוי טוב יותר לביטויי חיפוש כמו מראה לאמבטיה, קיר מראות עם תאורה, מראות לחדר כושר או מראה דקורטיבית בהתאמה אישית. בנוסף, זה עוזר ללקוחות לבחור נכון במקום להסתמך רק על תמונת גלריה אחת.'
    ),
    process: localizedText(
      'Measurement is especially important with mirrors because even small deviations become visible next to cabinetry, stone tops, wall lights, and tiled surfaces. We measure on site, account for cutouts and obstacles, plan the edge finish, and install the mirror so that reflections line up cleanly with the rest of the room. For large gym or studio installations, this can include panel sequencing and careful placement of joints. For bathroom mirrors, we coordinate with vanities, faucets, and wall lights. Detailed written content around the process makes this page much more useful for search engines and for customers who want a realistic sense of what happens before installation day.',
      'המדידה חשובה במיוחד במראות כי גם סטייה קטנה נראית מיד ליד נגרות, משטחי אבן, גופי תאורה וחיפויים. אנחנו מודדים בשטח, מתייחסים לפתחים, לשקעים ולמכשולים, מתכננים את גימור הקצה ומתקינים את המראה כך שההשתקפות תשתלב בצורה נקייה עם שאר מרכיבי החלל. בהתקנות גדולות לחדרי כושר או סטודיו זה כולל גם סדר פנלים ותכנון נכון של החיבורים. במראות אמבטיה אנחנו מתאמים עם הארון, הברזים וגופי התאורה. תיאור מפורט של תהליך העבודה הופך את הדף להרבה יותר שימושי גם למנועי חיפוש וגם ללקוחות שרוצים להבין מה קורה בפועל לפני יום ההתקנה.'
    ),
    benefits: localizedText(
      'Mirrors add more than reflection. They can improve light distribution, expand visual depth, reinforce symmetry in a bathroom or corridor, and give commercial interiors a more complete finish. They are also one of the easiest ways to improve a room without adding bulk. This benefits section supports searches like full wall mirror, mirror for small bathroom, custom vanity mirror, or gym mirror installation because it answers the design problem behind those phrases. For the user, it clarifies why exact sizing, clean edges, and installation quality matter more than just buying the cheapest mirror panel available.',
      'מראות נותנות הרבה יותר מהשתקפות. הן משפרות את פיזור האור, מרחיבות עומק ויזואלי, מחזקות סימטריה בחדר רחצה או במסדרון ונותנות לחללים מסחריים תחושת גמר שלמה יותר. הן גם אחת הדרכים הפשוטות לשדרג חלל בלי להוסיף נפח. החלק הזה תומך בחיפושים כמו קיר מראה, מראה לחדר רחצה קטן, מראת ארון בהתאמה אישית או התקנת מראות לחדר כושר, כי הוא עונה על הבעיה העיצובית שמאחורי הביטויים האלה. עבור המשתמש, הוא מסביר למה מידה מדויקת, קצה נקי ואיכות התקנה חשובים יותר מאשר רכישת פנל המראה הזול ביותר שאפשר למצוא.'
    ),
    areasSummary: localizedText(
      'We install mirrors in Jerusalem, Tel Aviv, Modiin, and throughout Israel for homes, fitness spaces, offices, salons, and retail interiors. Local pages matter here because search behavior is strongly city-based: many clients look for bathroom mirror Jerusalem, gym mirrors Tel Aviv, or custom mirrors Modiin. Connecting this service page to location pages helps the site match those searches with stronger relevance.',
      'אנחנו מתקינים מראות בירושלים, תל אביב, מודיעין ובכל רחבי ישראל לבתים פרטיים, חללי כושר, משרדים, מספרות וחנויות. לדפי אזור יש כאן חשיבות מיוחדת כי דפוס החיפוש הוא מאוד מקומי: לקוחות רבים מחפשים מראה לאמבטיה בירושלים, מראות לחדר כושר בתל אביב או מראות בהתאמה אישית במודיעין. החיבור בין דף השירות לבין דפי הערים משפר את הרלוונטיות של האתר לחיפושים האלה.'
    ),
    highlights: localizedArray(
      ['Bathroom vanity mirrors', 'Full-wall gym and studio mirrors', 'Decorative entry and living room mirrors', 'LED and backlit options', 'Beveled or polished edges', 'Custom cutouts for sockets and lighting'],
      ['מראות לארונות אמבטיה', 'קירות מראה לחדרי כושר וסטודיו', 'מראות דקורטיביות למבואות וסלונים', 'אפשרויות LED ותאורה אחורית', 'פאזות או ליטוש קצוות', 'חיתוכים מיוחדים לשקעים ותאורה']
    ),
    materialOptions: localizedArray(
      ['Standard and extra-clear mirror glass', 'Polished edge finishing', 'Optional bevel detailing', 'Anti-fog and backlit bathroom solutions'],
      ['זכוכית מראה סטנדרטית ואקסטרה קליר', 'ליטוש קצוות', 'אפשרות לפאזה דקורטיבית', 'פתרונות נגד אדים ותאורה לחדרי רחצה']
    ),
    faqs: [
      {
        question: localizedText('Can you install full-wall mirrors for gyms or studios?', 'האם אפשר להתקין קיר מראות מלא לחדר כושר או סטודיו?'),
        answer: localizedText(
          'Yes. We measure large mirror walls carefully, plan panel layout, and install them with attention to alignment, safety, and visual continuity.',
          'כן. אנחנו מודדים קירות מראה גדולים בקפידה, מתכננים את פריסת הפנלים ומתקינים אותם תוך הקפדה על יישור, בטיחות ורצף חזותי.'
        ),
      },
      {
        question: localizedText('Do bathroom mirrors need special preparation?', 'האם מראות אמבטיה דורשות הכנה מיוחדת?'),
        answer: localizedText(
          'In many cases yes. Bathroom mirrors need to work with lighting, moisture, sockets, and vanity alignment, so on-site measurement is important.',
          'במקרים רבים כן. מראות אמבטיה צריכות לעבוד נכון עם תאורה, לחות, שקעים ויישור מול הארון, ולכן מדידה בשטח חשובה מאוד.'
        ),
      },
      {
        question: localizedText('Can mirrors be custom-shaped or backlit?', 'האם אפשר לייצר מראות בצורה מיוחדת או עם תאורה?'),
        answer: localizedText(
          'Yes. Depending on the project, mirrors can be shaped, edge-finished, and prepared for LED or other integrated lighting solutions.',
          'כן. בהתאם לפרויקט, אפשר לייצר מראות בצורה מיוחדת, עם גימור קצה מותאם ועם הכנה לתאורת LED או פתרונות תאורה משולבים אחרים.'
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
    eyebrow: localizedText('Retail and commercial glazing', 'חזיתות זכוכית לעסקים וחנויות'),
    heroTitle: localizedText('Shop Front Glass', 'חזיתות זכוכית לחנויות'),
    heroSubtitle: localizedText(
      'Commercial storefront glass installation for shops, offices, showrooms, clinics, restaurants, and street-facing businesses across Israel.',
      'התקנת חזיתות זכוכית מסחריות לחנויות, משרדים, אולמות תצוגה, מרפאות, מסעדות ועסקים עם חזית לרחוב בכל רחבי ישראל.'
    ),
    metaTitle: localizedText(
      'Shop Front Glass in Israel | Storefront and Commercial Glass',
      'חזיתות זכוכית לחנויות בישראל | זכוכית מסחרית וויטרינות'
    ),
    metaDescription: localizedText(
      'Storefront glass installation in Jerusalem, Tel Aviv, Modiin, and across Israel. Commercial glass fronts, entry systems, display glazing and safety glass solutions.',
      'התקנת חזיתות זכוכית לחנויות בירושלים, תל אביב, מודיעין ובכל ישראל. ויטרינות, דלתות כניסה, זכוכית תצוגה ופתרונות זכוכית בטיחותיים.'
    ),
    keywords: localizedText(
      'shop front glass, storefront glass installation, commercial glass front, retail glass installation, display window glass, storefront Jerusalem, storefront Tel Aviv',
      'חזית זכוכית לחנות, ויטרינה לעסק, התקנת חזית מסחרית, זכוכית תצוגה, חזיתות חנויות ירושלים, חזיתות זכוכית תל אביב'
    ),
    intro: localizedText(
      'A commercial facade does more than close the front of a building. It shapes first impressions, controls visibility into the business, affects daylight, and influences how secure and professional the premises feel from the street. That is why storefront glass deserves a dedicated SEO page instead of being buried inside a general services block. Searchers looking for shop front glass, commercial glass facade installation, display window replacement, or retail entrance glazing have a clear business intent. They need to know what kinds of storefront systems are available, how safety glass choices work, and whether the installer can handle active commercial sites. Our storefront work covers new installations, upgrades, and tailored glazing solutions for businesses that want a sharp, reliable front-facing finish.',
      'חזית מסחרית עושה הרבה יותר מלסגור את הפתח של המבנה. היא יוצרת רושם ראשוני, קובעת את רמת החשיפה לעסק, משפיעה על אור טבעי וקובעת עד כמה המקום נראה בטוח, מקצועי ומזמין מהרחוב. בגלל זה חזיתות זכוכית לעסקים צריכות דף SEO נפרד ולא רק אזכור בתוך רשימת שירותים כללית. אנשים שמחפשים ויטרינה לחנות, התקנת חזית זכוכית מסחרית, החלפת חלון ראווה או דלת כניסה מזכוכית מגיעים עם כוונת רכישה ברורה. הם רוצים להבין אילו מערכות קיימות, איך בוחרים זכוכית בטיחותית והאם המתקין יודע לעבוד בסביבת עסק פעיל. השירות שלנו כולל חזיתות חדשות, שדרוגים ופתרונות זכוכית מותאמים לעסקים שרוצים מראה חד ואמין כלפי הרחוב.'
    ),
    overview: localizedText(
      'Storefront projects often combine large glazed areas, entry doors, locks, metal framing, and precise interface details with stone, aluminum, or existing construction. Some businesses want maximum transparency to show products and interior design. Others need a balance between openness, privacy strips, branding graphics, or stronger security glazing. Because each frontage works differently, the service page explains the decision points instead of reducing everything to one label. This written content is valuable for Google because it reinforces relevance around storefront glass installation, shopfront glazing, commercial entry systems, and display windows. It is equally useful for business owners who are comparing an upgrade, fitting out a new location, or planning a renovation while staying open to customers.',
      'פרויקטי חזית מסחרית משלבים בדרך כלל שטחי זכוכית גדולים, דלתות כניסה, מנעולים, פרופילי מתכת וחיבורים מדויקים לאבן, לאלומיניום או לבנייה קיימת. יש עסקים שמחפשים מקסימום שקיפות כדי לחשוף מוצרים ועיצוב פנים, ואחרים צריכים איזון בין פתיחות, פסי פרטיות, מיתוג מודפס או שכבת בטיחות גבוהה יותר. מכיוון שכל חזית מתפקדת אחרת, דף השירות מסביר את נקודות ההחלטה במקום לצמצם הכל לכותרת אחת. מבחינת גוגל זה מחזק רלוונטיות סביב התקנת חזיתות זכוכית, ויטרינות, דלתות כניסה מסחריות וחלונות ראווה. מבחינת בעל העסק, זה עוזר להבין את האפשרויות לפני שדרוג, פתיחת סניף חדש או שיפוץ תוך כדי פעילות שוטפת.'
    ),
    options: localizedText(
      'Commercial glass can involve tempered panels, laminated safety glass, framed or frameless entrances, sidelights, transoms, and branded privacy films. We help clients choose the right combination based on traffic, visibility, security, and maintenance. Retail storefronts may prioritize display clarity, while clinics, salons, and offices often need a softer balance between openness and privacy. Restaurants and hospitality spaces may need entrance solutions that coordinate with airflow, seating, and street presentation. Explaining those use cases in text gives the site stronger coverage for business-facing search terms and makes the page more persuasive for owners who need more than a gallery image before they request a quote.',
      'זכוכית מסחרית יכולה לכלול פנלים מחוסמים, זכוכית רבודה, כניסות ממוסגרות או ללא מסגרת, חלונות צד, טרנסומים וסרטי פרטיות ממותגים. אנחנו מסייעים לבחור את השילוב הנכון לפי תנועה, נראות, אבטחה ותחזוקה. חנויות קמעונאיות מדגישות לרוב שקיפות ותצוגה, בעוד שמרפאות, מספרות ומשרדים מחפשים איזון רך יותר בין פתיחות לפרטיות. מסעדות ועסקי אירוח צריכים לפעמים מערכת כניסה שמתאימה גם לזרימת אוויר, לישיבה ולנוכחות ברחוב. כשהשימושים האלה מוסברים בטקסט, האתר מקבל כיסוי טוב יותר למונחי חיפוש עסקיים, והדף הופך למשכנע יותר עבור בעלי עסקים שצריכים יותר מתמונת גלריה אחת לפני בקשת הצעה.'
    ),
    process: localizedText(
      'Storefront installation starts with accurate site inspection because commercial fronts often include irregular thresholds, existing profiles, signage constraints, and active customer circulation. We measure openings, discuss the entrance pattern, check hardware requirements, and plan the glazing so the frontage feels consistent and operates reliably. In some projects the goal is a fresh new facade. In others, the job is a replacement or upgrade that needs to respect the existing structure and minimize disruption. Detailed process text is important SEO content because it answers exactly what business owners want to know when they search for commercial glass installers near them.',
      'התקנת חזית מסחרית מתחילה בבדיקת שטח מדויקת, כי בחזיתות של עסקים יש לעיתים ספים לא אחידים, פרופילים קיימים, מגבלות שילוט ותנועת לקוחות פעילה. אנחנו מודדים את הפתח, בודקים את אופי הכניסה, מוודאים דרישות פרזול ומתכננים את הזיגוג כך שהחזית תרגיש אחידה ותעבוד בצורה אמינה. בחלק מהפרויקטים המטרה היא ליצור חזית חדשה לגמרי, ובאחרים מדובר בהחלפה או בשדרוג שצריך להתאים למבנה קיים ולצמצם הפרעה לעסק. תיאור מפורט של התהליך הוא גם תוכן SEO חשוב, כי הוא עונה בדיוק על מה שבעלי עסקים רוצים לדעת כשהם מחפשים מתקין זכוכית מסחרית בסביבה שלהם.'
    ),
    benefits: localizedText(
      'A strong storefront can improve visibility, make the business feel cleaner and more established, and create a more professional handoff between street and interior. It can also make product presentation more effective and support branding, lighting, and customer confidence. Those practical benefits are closely tied to search intent. People searching for storefront glass do not just want “glass”; they want a better business front. The more clearly a page explains those outcomes, the better it performs for both SEO and conversion. It becomes easier for a visitor to understand why custom storefront glazing is different from a generic repair or an off-the-shelf door solution.',
      'חזית מסחרית טובה יכולה לשפר נראות, לגרום לעסק להיראות נקי ומבוסס יותר וליצור מעבר מקצועי יותר בין הרחוב לחלל הפנימי. היא יכולה גם לשפר תצוגת מוצרים, לתמוך במיתוג ובתאורה ולחזק את תחושת הביטחון של הלקוח. היתרונות האלה קשורים ישירות לכוונת החיפוש. מי שמחפש חזית זכוכית לחנות לא מחפש רק “זכוכית”, אלא חזית עסקית טובה יותר. ככל שהדף מסביר את התוצאה הזו באופן ברור יותר, כך הוא עובד טוב יותר גם ב-SEO וגם בהמרה. למבקר קל יותר להבין למה חזית מסחרית מותאמת שונה מהחלפת זכוכית כללית או מדלת מדף פשוטה.'
    ),
    areasSummary: localizedText(
      'We build shop front glass solutions across Israel, including busy urban storefronts in Jerusalem and Tel Aviv, neighborhood businesses in Modiin, and commercial projects in other cities. Location pages matter because business owners often search for commercial glass by city and service together. Linking this page to local city pages makes that search path much clearer.',
      'אנחנו מתקינים חזיתות זכוכית לעסקים בכל רחבי ישראל, כולל חזיתות עירוניות בירושלים ובתל אביב, עסקים שכונתיים במודיעין ופרויקטים מסחריים בערים נוספות. לדפי מיקום יש כאן חשיבות רבה כי בעלי עסקים מחפשים לעיתים קרובות גם לפי שירות וגם לפי עיר. החיבור בין הדף הזה לדפי הערים מייצר מסלול חיפוש ברור הרבה יותר.'
    ),
    highlights: localizedArray(
      ['Retail storefronts', 'Commercial entry doors', 'Display window glazing', 'Clinic and office fronts', 'Privacy films and branding bands', 'Safety-focused commercial glass'],
      ['חזיתות לחנויות', 'דלתות כניסה מסחריות', 'זכוכית לחלונות ראווה', 'חזיתות למשרדים ומרפאות', 'פסי פרטיות ומיתוג', 'זכוכית מסחרית בדגש על בטיחות']
    ),
    materialOptions: localizedArray(
      ['Tempered commercial glass', 'Laminated safety glass', 'Framed or frameless entry systems', 'Graphic or privacy film integration'],
      ['זכוכית מסחרית מחוסמת', 'זכוכית בטיחות רבודה', 'מערכות כניסה ממוסגרות או ללא מסגרת', 'שילוב סרטי מיתוג או פרטיות']
    ),
    faqs: [
      {
        question: localizedText('Do you install storefront glass for new businesses and renovations?', 'האם אתם מתקינים חזיתות זכוכית גם לעסק חדש וגם לשיפוץ?'),
        answer: localizedText(
          'Yes. We handle both new commercial fit-outs and replacement or upgrade projects for existing businesses.',
          'כן. אנחנו מבצעים גם חזיתות לעסקים חדשים וגם החלפה או שדרוג לעסקים קיימים.'
        ),
      },
      {
        question: localizedText('Can storefront glass include privacy or branding elements?', 'האם אפשר לשלב בחזית הזכוכית פרטיות או מיתוג?'),
        answer: localizedText(
          'Yes. Depending on the project, storefront glazing can include privacy films, branding bands, or other treatments that support the business concept.',
          'כן. בהתאם לפרויקט, אפשר לשלב בחזית סרטי פרטיות, פסי מיתוג או טיפולים נוספים שתומכים בקונספט של העסק.'
        ),
      },
      {
        question: localizedText('Is storefront glass suitable for offices and clinics too?', 'האם חזית זכוכית מתאימה גם למשרדים ומרפאות?'),
        answer: localizedText(
          'Absolutely. Storefront systems are widely used for offices, clinics, showrooms, and hospitality spaces, not just retail shops.',
          'בהחלט. מערכות חזית זכוכית מתאימות גם למשרדים, מרפאות, אולמות תצוגה וחללי אירוח, ולא רק לחנויות קמעונאיות.'
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
    eyebrow: localizedText('Office, clinic, and home zoning solutions', 'מחיצות זכוכית למשרדים, מרפאות וחלוקה פנימית'),
    heroTitle: localizedText('Glass Partitions', 'מחיצות זכוכית'),
    heroSubtitle: localizedText(
      'Custom glass partition systems for offices, clinics, studios, meeting rooms, home workspaces, and interior zoning projects throughout Israel.',
      'מערכות מחיצות זכוכית בהתאמה אישית למשרדים, מרפאות, סטודיו, חדרי ישיבות, חללי עבודה ביתיים ופרויקטים לחלוקה פנימית בכל ישראל.'
    ),
    metaTitle: localizedText(
      'Glass Partitions in Israel | Office and Interior Glass Walls',
      'מחיצות זכוכית בישראל | קירות זכוכית למשרד ולפנים'
    ),
    metaDescription: localizedText(
      'Glass partitions and interior glass wall installation in Jerusalem, Tel Aviv, Modiin, and across Israel. Office partitions, meeting rooms, sliding systems and frosted glass.',
      'מחיצות זכוכית וקירות זכוכית פנימיים בירושלים, תל אביב, מודיעין ובכל ישראל. מחיצות למשרד, חדרי ישיבות, מערכות הזזה וזכוכית חלבית.'
    ),
    keywords: localizedText(
      'glass partitions, office glass partitions, interior glass wall, meeting room glass, sliding glass partition, glass partition Jerusalem, glass partition Tel Aviv',
      'מחיצות זכוכית, מחיצות זכוכית למשרד, קיר זכוכית פנימי, חדר ישיבות זכוכית, מחיצת הזזה מזכוכית, מחיצות זכוכית ירושלים, מחיצות זכוכית תל אביב'
    ),
    intro: localizedText(
      'Glass partitions are one of the most effective ways to divide space without closing it off completely. They allow daylight to continue moving through an office, clinic, showroom, or home workspace while creating visual order and clearer functional zones. This is exactly the kind of service that should not live only as a short bullet on a generic services page. Search intent around office glass partitions, meeting room glass, sliding glass partitions, and interior glass walls is very specific. A dedicated page gives the site enough written context to rank for those searches and gives customers more confidence before they contact us. It explains how partitions are used, which finishes are available, and how we adapt the system to practical workflow needs.',
      'מחיצות זכוכית הן אחת הדרכים היעילות ביותר לחלק חלל בלי לסגור אותו לחלוטין. הן מאפשרות לאור טבעי להמשיך לנוע במשרד, במרפאה, בחלל תצוגה או במשרד ביתי, ובו בזמן יוצרות סדר ויזואלי ואזורים פונקציונליים ברורים יותר. זה בדיוק סוג השירות שלא צריך להסתפק באזכור קצר בתוך רשימת שירותים כללית. כוונת החיפוש סביב מחיצות זכוכית למשרד, חדר ישיבות מזכוכית, מחיצות הזזה וקירות זכוכית פנימיים היא מאוד ממוקדת. דף ייעודי נותן לאתר מספיק הקשר כתוב כדי לדרג לחיפושים האלה, וגם מעניק ללקוחות יותר ביטחון לפני שהם פונים. הוא מסביר איך משתמשים במחיצות, אילו גימורים קיימים ואיך אנחנו מתאימים את המערכת לצרכים אמיתיים של עבודה ותנועה בחלל.'
    ),
    overview: localizedText(
      'Partition projects vary widely. Some clients want frameless meeting room fronts with slim hardware and clear sight lines. Others need privacy bands, frosted glazing, sliding doors, acoustic considerations, or a clean way to separate customer-facing and back-office areas. In homes, partitions can define an office corner, a kitchen boundary, or a studio zone while keeping the space open. In commercial interiors, they often need to support branding, repeated circulation, and easy maintenance. All of that makes written detail important. Search engines can understand that this page is about glass partitions specifically, and potential clients can understand that there are multiple ways to build a partition system depending on use, budget, and design language.',
      'פרויקטי מחיצות משתנים מאוד זה מזה. יש לקוחות שמחפשים חזית חדר ישיבות נקייה ללא מסגרת עם פרזול עדין וקווי ראייה פתוחים, ואחרים זקוקים לפסי פרטיות, זכוכית חלבית, דלתות הזזה, דרישות אקוסטיות או דרך מסודרת להפריד בין אזור קבלת קהל לבין אזור עבודה פנימי. בבתים פרטיים אפשר להשתמש במחיצה כדי להגדיר פינת עבודה, תחום מטבח או אזור סטודיו תוך שמירה על תחושת פתיחות. בחללים מסחריים, המחיצה צריכה לעיתים לתמוך גם במיתוג, בתנועה חוזרת ובתחזוקה נוחה. בגלל כל זה, לתוכן כתוב ומפורט יש ערך אמיתי: מנועי חיפוש מבינים שמדובר בדף שמוקדש למחיצות זכוכית, והלקוח מבין שיש יותר מדרך אחת לבנות מחיצה בהתאם לשימוש, לתקציב ולשפה העיצובית.'
    ),
    options: localizedText(
      'Glass partitions can be fully clear, frosted, banded, framed, frameless, hinged, sliding, or paired with soft-close hardware. Some projects prioritize openness and transparency, while others focus on privacy and acoustic balance. We guide clients through the finish level that suits the way the room is used. A medical room, office corridor, beauty studio, or executive meeting room each demands a different balance between visibility and separation. This section gives the page stronger keyword depth around office partitions, sliding glass walls, frosted meeting rooms, and interior glass room dividers. It also helps clients choose the right system before fabrication rather than trying to reverse-engineer the look from a photo after the fact.',
      'מחיצות זכוכית יכולות להיות שקופות לחלוטין, חלביות, עם פסים, עם מסגרת, ללא מסגרת, עם דלת צירים, דלת הזזה או פרזול סגירה רכה. יש פרויקטים שמדגישים פתיחות ושקיפות, ואחרים מחפשים פרטיות ואיזון אקוסטי. אנחנו מלווים את הלקוח בבחירת רמת הגמר שמתאימה לאופן שבו החלל באמת פועל. חדר טיפולים, מסדרון משרד, סטודיו יופי או חדר ישיבות הנהלה דורשים כל אחד איזון אחר בין חשיפה לבין הפרדה. החלק הזה מוסיף לדף עומק מילות מפתח סביב מחיצות למשרד, קירות הזזה מזכוכית, חדרי ישיבות חלביים ומחלקי חלל פנימיים, ובו בזמן עוזר ללקוח לבחור את המערכת הנכונה לפני הייצור במקום לנסות לשחזר פתרון מתמונה בלבד.'
    ),
    process: localizedText(
      'As with any custom glass project, the process starts with a site visit and precise measurement. We check floor and ceiling conditions, door swings, alignment points, and how the partition integrates with existing furniture, electrical elements, or finishes. From there we define the opening type, the glass treatment, and the hardware package. Installation needs to be clean because partitions are usually installed in finished interiors where details are highly visible. This process content is useful because it sets expectations and gives Google a strong text signal around custom partition installation, not just generic “glass work.”',
      'כמו בכל עבודת זכוכית מותאמת, התהליך מתחיל בביקור שטח ובמדידה מדויקת. אנחנו בודקים רצפה ותקרה, כיווני פתיחה, נקודות יישור ואופן החיבור של המחיצה לריהוט, לחשמל ולגמרים קיימים. משם אנחנו מגדירים את סוג הפתח, את טיפול הזכוכית ואת חבילת הפרזול. ההתקנה עצמה חייבת להיות נקייה במיוחד, כי מחיצות מותקנות בדרך כלל בחללים שכבר גמורים וכל פרט נראה לעין. תיאור התהליך הזה חשוב משום שהוא יוצר ציפיות ברורות ללקוח ונותן לגוגל אות טקסטואלי חזק שמדובר בהתקנת מחיצות זכוכית מותאמות, ולא רק ב”עבודות זכוכית” כלליות.'
    ),
    benefits: localizedText(
      'The main benefit of glass partitions is control without heaviness. They divide space, support workflow, and improve privacy where needed, but they still preserve daylight and a contemporary feel. For offices, that can mean better room hierarchy without closing the floor plan. For homes, it can mean an office zone that does not darken the rest of the room. For clinics and studios, it can help create cleaner movement between service areas and waiting zones. These practical outcomes make the page more persuasive for visitors and help target the phrases people actually use when they are ready to hire: office glass partition installation, meeting room glazing, and interior glass divider systems.',
      'היתרון המרכזי של מחיצות זכוכית הוא שליטה בלי כובד. הן מחלקות את החלל, משפרות את זרימת העבודה ויוצרות פרטיות במקומות הנכונים, אבל עדיין שומרות על אור טבעי ועל תחושה עכשווית. במשרדים זה יכול להיות היררכיה טובה יותר של חדרים בלי לסגור את התוכנית, בבתים זה יכול להיות אזור עבודה שלא מחשיך את שאר החלל, ובמרפאות או בסטודיו זה יוצר תנועה מסודרת יותר בין אזור שירות להמתנה. התוצאות המעשיות האלו הופכות את הדף למשכנע יותר עבור המשתמשים וגם עוזרות לכוון לביטויי חיפוש אמיתיים כמו התקנת מחיצת זכוכית למשרד, חדר ישיבות מזכוכית או מערכת חלוקה פנימית מזכוכית.'
    ),
    areasSummary: localizedText(
      'We install glass partitions in Jerusalem, Tel Aviv, Modiin, and across Israel for offices, clinics, beauty spaces, work-from-home rooms, and commercial interiors. City-specific pages matter because partition demand is often tied to local business districts and renovation trends. Linking this service page to location pages helps local SEO and gives users a better path to the city content that matches their search.',
      'אנחנו מתקינים מחיצות זכוכית בירושלים, תל אביב, מודיעין ובכל רחבי ישראל למשרדים, מרפאות, חללי יופי, משרדים ביתיים וחללים מסחריים. לדפי עיר יש כאן משמעות אמיתית כי הביקוש למחיצות קשור לעיתים קרובות לאזורי עסקים מקומיים ולמגמות שיפוץ בכל עיר. החיבור בין דף השירות הזה לבין דפי הערים מחזק את ה-SEO המקומי ונותן למשתמש מסלול טוב יותר אל התוכן העירוני שמתאים לחיפוש שלו.'
    ),
    highlights: localizedArray(
      ['Office partitions', 'Meeting room fronts', 'Clinic and studio zoning', 'Sliding glass partition options', 'Frosted privacy treatments', 'Interior glass room dividers'],
      ['מחיצות למשרדים', 'חזיתות לחדרי ישיבות', 'חלוקה למרפאות וסטודיו', 'אפשרויות מחיצת זכוכית בהזזה', 'טיפולי פרטיות חלביים', 'מחלקי חלל פנימיים מזכוכית']
    ),
    materialOptions: localizedArray(
      ['Clear or frosted safety glass', 'Framed or frameless systems', 'Sliding or hinged doors', 'Privacy bands and custom graphic films'],
      ['זכוכית בטיחות שקופה או חלבית', 'מערכות עם מסגרת או ללא מסגרת', 'דלתות הזזה או צירים', 'פסי פרטיות וסרטים גרפיים מותאמים']
    ),
    faqs: [
      {
        question: localizedText('Are glass partitions only for offices?', 'האם מחיצות זכוכית מתאימות רק למשרדים?'),
        answer: localizedText(
          'No. They are also used in homes, clinics, studios, salons, and many other interiors where space needs definition without losing light.',
          'לא. משתמשים בהן גם בבתים, במרפאות, בסטודיו, במספרות ובחללים נוספים שצריכים חלוקה בלי לאבד אור ותחושת פתיחות.'
        ),
      },
      {
        question: localizedText('Can partitions include privacy glass?', 'האם אפשר לשלב במחיצה זכוכית עם פרטיות?'),
        answer: localizedText(
          'Yes. Depending on the project, partitions can use frosted glass, privacy bands, or other treatments to control visibility.',
          'כן. בהתאם לפרויקט אפשר לשלב זכוכית חלבית, פסי פרטיות או טיפולים נוספים שמאפשרים שליטה ברמת החשיפה.'
        ),
      },
      {
        question: localizedText('Do you install sliding glass partition systems?', 'האם אתם מתקינים גם מחיצות זכוכית בהזזה?'),
        answer: localizedText(
          'Yes. Sliding systems are one of the available solutions when the layout or circulation pattern benefits from a space-saving opening.',
          'כן. מערכות הזזה הן אחת האפשרויות הקיימות כאשר התכנון או דפוס התנועה בחלל נהנים מפתרון חוסך מקום.'
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

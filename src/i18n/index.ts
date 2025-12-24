import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: "Home",
        services: "Services", 
        projects: "Projects",
        contractors: "Contractors & Architects",
        process: "Process",
        about: "About",
        contact: "Contact"
      },
      // Hero section
      hero: {
        badge: "Architectural Glass Excellence",
        title: "Architectural Glass, Perfectly Engineered",
        subtitle: "Premium glass facades, interiors and bespoke installations for residential, commercial and highrise projects.",
        tagline: "Precision-engineered glass for interiors, facades and bespoke installations",
        stats: {
          experience: "Years Experience",
          projects: "Completed Projects",
          satisfaction: "Client Satisfaction"
        },
        badge_years: "Years",
        badge_precision: "Precision Engineering",
        cta: {
          quote: "Get a Quick Quote",
          whatsapp: "WhatsApp Now",
          call: "Call Now",
          learn_more: "Learn More"
        }
      },
      // Services
      services: {
        title: "Our Services",
        badge: "Services",
        heading: "Glass systems engineered for light, clarity and precision.",
        description: "From frameless interiors to high-exposure facades, Fusion Glassworks designs, fabricates and installs complete glass packages that respect both architecture and performance.",
        shower: {
          title: "Shower Enclosures",
          description: "Custom glass shower doors and partitions with precise measurement and professional installation."
        },
        railings: {
          title: "Glass Railings", 
          description: "Modern glass railings for stairs, balconies, and terraces with safety and style."
        },
        storefronts: {
          title: "Storefronts",
          description: "Commercial glass storefronts and entrance systems for businesses."
        },
        windows: {
          title: "Windows",
          description: "Custom window glass replacement and installation for residential and commercial properties."
        },
        mirrors: {
          title: "Mirrors",
          description: "Custom cut mirrors for bathrooms, gyms, and decorative applications."
        },
        repairs: {
          title: "Glass Repairs",
          description: "Emergency glass repair services for windows, doors, and safety glass."
        }
      },
      // Form
      form: {
        name: "Name",
        phone: "Phone",
        city: "City", 
        serviceType: "Service Type",
        width: "Width (mm)",
        height: "Height (mm)",
        photos: "Upload Photos",
        tempered: "Tempered glass needed?",
        date: "Preferred date",
        notes: "Notes",
        submit: "Submit Quote Request",
        required: "Required field",
        success: "Thank you! We'll contact you within 24 hours."
      },
      // Process
      process: {
        title: "Our 5-Step Process",
        badge: "Process",
        description: "From the first phone call to final inspection, every step is structured to protect timelines, budgets and design intent.",
        step_label: "Step",
        step1: {
          title: "Consultation",
          description: "Initial call to understand your needs and provide estimate"
        },
        step2: {
          title: "Measurement", 
          description: "Precise on-site measurement by our professionals"
        },
        step3: {
          title: "Fabrication",
          description: "Custom glass cutting and preparation in our workshop"
        },
        step4: {
          title: "Installation",
          description: "Professional installation with quality guarantee"
        },
        step5: {
          title: "Warranty",
          description: "Comprehensive warranty and ongoing support"
        },
        step6: {
          title: "Support",
          description: "Ongoing maintenance and customer support"
        }
      },
      // CTA Section
      cta: {
        heading: "Ready to Transform Your Space?",
        description: "Contact us today for a free consultation. We respond within 24 hours."
      },
      // About
      about: {
        badge: "About",
        heading: "Fusion Glassworks is a studio for light, structure and precision.",
        description1: "We combine engineering discipline with a design-led approach to glass. From minimal interior partitions to high-rise envelopes, our teams manage detailing, fabrication and installation with the same level of care.",
        description2: "Every project is coordinated closely with architects, contractors and owners to ensure that lines remain clean, tolerances are respected and the final space performs as beautifully as it looks.",
        stats: {
          years: "Years in architectural glass",
          projects: "Completed projects",
          partners: "Returning trade partners",
          ontime: "On-time installations"
        }
      },
      // Projects
      projects: {
        badge: "Portfolio",
        heading: "Built projects by Fusion Glassworks",
        description: "A curated selection of residential, commercial and high-rise glass work, showcasing precision detailing, clean lines and light-driven spaces.",
        view_details: "View details",
        items: {
          highrise: { title: "High-rise curtain wall", type: "Commercial tower" },
          staircase: { title: "Floating glass staircase", type: "Luxury residence" },
          storefront: { title: "Minimal storefront system", type: "Retail flagship" },
          balcony: { title: "Frameless balcony glazing", type: "Residential tower" },
          lobby: { title: "Lobby feature wall", type: "Hotel lobby" },
          conference: { title: "Conference room partitions", type: "Corporate office" }
        }
      },
      // Contractors
      contractors: {
        badge: "Trade partners",
        heading: "A glass partner for contractors & architects",
        description: "Fusion Glassworks supports GCs, builders and design teams with detailed coordination, technical expertise and reliable on-site execution.",
        cta_label: "Send drawings or BOQs directly to our estimating team.",
        cta_button: "Email drawings",
        benefits: {
          coordination: {
            title: "Dedicated project coordination",
            description: "Single point of contact from shop drawings to final punch list."
          },
          documentation: {
            title: "Technical documentation",
            description: "Shop drawings, glass specifications and hardware schedules delivered on time."
          },
          logistics: {
            title: "Site-ready logistics",
            description: "Sequenced deliveries, protection and installation windows planned with your team."
          }
        },
        next_steps: {
          badge: "Next steps",
          heading: "Share your plans and we will return with a coordinated glass package.",
          description: "Include elevations, sections and any performance requirements so our team can respond with technical options and budgets."
        }
      },
      // Contact
      contact: {
        heading: "Tell us about your project",
        description: "Share a few details and our team will respond with next steps, budget guidance and possible timelines.",
        form: {
          name: "Name",
          name_placeholder: "Your full name",
          phone: "Phone",
          phone_placeholder: "Best number to reach you",
          email: "Email (optional)",
          email_placeholder: "name@company.com",
          message: "Project details",
          message_placeholder: "Location, type of glass work, rough timelines and any drawings you have.",
          submit: "Send message",
          submitting: "Sending…",
          success: "Thank you. Your email client should now open with the details prefilled.",
          required: "Required"
        },
        mobile_cta: {
          call: "Call",
          whatsapp: "WhatsApp"
        }
      },
      // Footer
      footer: {
        hours: "Business Hours",
        contact: "Contact Information",
        areas: "Service Areas"
      }
    }
  },
  he: {
    translation: {
      nav: {
        home: "בית",
        services: "שירותים",
        projects: "פרויקטים", 
        contractors: "קבלנים ואדריכלים",
        process: "תהליך",
        about: "אודות",
        contact: "צור קשר"
      },
      hero: {
        badge: "מצוינות בזכוכית אדריכלית",
        title: "זכוכית בהתאמה אישית – התקנה מדויקת",
        subtitle: "מקלחונים, מעקות, ויטרינות ועוד—מדידה, ייצור והתקנה בזמן.",
        tagline: "זכוכית מהונדסת בדיוק לחללים פנימיים, חזיתות והתקנות מותאמות אישית",
        stats: {
          experience: "שנות ניסיון",
          projects: "פרויקטים שהושלמו",
          satisfaction: "שביעות רצון לקוחות"
        },
        badge_years: "שנים",
        badge_precision: "הנדסה מדויקת",
        cta: {
          quote: "קבלו הצעת מחיר מהירה",
          whatsapp: "וואטסאפ עכשיו", 
          call: "חייגו עכשיו",
          learn_more: "למידע נוסף"
        }
      },
      services: {
        title: "השירותים שלנו",
        badge: "שירותים",
        heading: "מערכות זכוכית מהונדסות לאור, בהירות ודיוק.",
        description: "מחלונות פנימיים ללא מסגרת ועד חזיתות בחשיפה גבוהה, Fusion Glassworks מתכננת, מייצרת ומתקינה חבילות זכוכית מלאות המכבדות גם את האדריכלות וגם את הביצועים.",
        shower: {
          title: "מקלחונים",
          description: "דלתות זכוכית ומחיצות למקלחת בהתאמה אישית עם מדידה מדויקת והתקנה מקצועית."
        },
        railings: {
          title: "מעקות זכוכית",
          description: "מעקות זכוכית מודרניים למדרגות, מרפסות וטרסות עם בטיחות וסטייל."
        },
        storefronts: {
          title: "ויטרינות",
          description: "ויטרינות זכוכית מסחריות ומערכות כניסה לעסקים."
        },
        windows: {
          title: "חלונות", 
          description: "החלפת זכוכית חלונות והתקנה בהתאמה אישית לנכסים למגורים ומסחריים."
        },
        mirrors: {
          title: "מראות",
          description: "מראות בחיתוך מותאם לחדרי רחצה, חדרי כושר ויישומים דקורטיביים."
        },
        repairs: {
          title: "תיקוני זכוכית",
          description: "שירותי תיקון זכוכית חירום לחלונות, דלתות וזכוכית בטיחות."
        }
      },
      form: {
        name: "שם",
        phone: "טלפון",
        city: "עיר",
        serviceType: "סוג שירות",
        width: "רוחב (מ״מ)",
        height: "גובה (מ״מ)", 
        photos: "העלאת תמונות",
        tempered: "נדרשת זכוכית מחוסמת?",
        date: "תאריך מועדף",
        notes: "הערות",
        submit: "שלח בקשת הצעת מחיר",
        required: "שדה חובה",
        success: "תודה! ניצור איתכם קשר תוך 24 שעות."
      },
      process: {
        title: "תהליך העבודה שלנו בחמישה שלבים",
        badge: "תהליך",
        description: "משיחת הטלפון הראשונה ועד לבדיקה הסופית, כל שלב מובנה להגן על לוחות זמנים, תקציבים וכוונת העיצוב.",
        step_label: "שלב",
        step1: {
          title: "ייעוץ",
          description: "שיחת ייעוץ ראשונית להבנת הצרכים ומתן הערכת מחיר"
        },
        step2: {
          title: "מדידה",
          description: "מדידה מדויקת באתר על ידי המקצוענים שלנו"
        },
        step3: {
          title: "ייצור",
          description: "חיתוך זכוכית בהתאמה אישית והכנה בבית המלאכה שלנו"
        },
        step4: {
          title: "התקנה",
          description: "התקנה מקצועית עם אחריות איכות"
        },
        step5: {
          title: "אחריות",
          description: "אחריות מקיפה ותמיכה שוטפת"
        },
        step6: {
          title: "תמיכה",
          description: "תחזוקה שוטפת ותמיכת לקוחות"
        }
      },
      // CTA Section
      cta: {
        heading: "מוכנים לשדרג את החלל שלכם?",
        description: "צרו איתנו קשר היום לייעוץ חינם. אנחנו עונים תוך 24 שעות."
      },
      // About
      about: {
        badge: "אודות",
        heading: "Fusion Glassworks הוא אולפן לאור, מבנה ודיוק.",
        description1: "אנו משלבים משמעת הנדסית עם גישה מובילת עיצוב לזכוכית. ממחיצות פנימיות מינימליות ועד למעטפות גורדי שחקים, הצוותים שלנו מנהלים את התכנון, הייצור וההתקנה באותה רמת טיפול.",
        description2: "כל פרויקט מתואם מקרוב עם אדריכלים, קבלנים ובעלים כדי להבטיח שהקווים נשארים נקיים, הסובלנויות מכובדות והחלל הסופי מתפקד יפה כמו שהוא נראה.",
        stats: {
          years: "שנים בזכוכית אדריכלית",
          projects: "פרויקטים שהושלמו",
          partners: "שותפים מסחריים חוזרים",
          ontime: "התקנות בזמן"
        }
      },
      // Projects
      projects: {
        badge: "תיק עבודות",
        heading: "פרויקטים שנבנו על ידי Fusion Glassworks",
        description: "מבחר מתוקן של עבודות זכוכית למגורים, מסחריות ומגדלים, המציג תכנון מדויק, קווים נקיים וחללים מונעי אור.",
        view_details: "הצג פרטים",
        items: {
          highrise: { title: "קיר מסך גורד שחקים", type: "מגדל מסחרי" },
          staircase: { title: "מדרגות זכוכית מרחפות", type: "מגורים יוקרתיים" },
          storefront: { title: "מערכת חזית חנות מינימלית", type: "דגל קמעונאי" },
          balcony: { title: "זיגוג מרפסת ללא מסגרת", type: "מגדל מגורים" },
          lobby: { title: "קיר תכונה בלובי", type: "לובי מלון" },
          conference: { title: "מחיצות חדר ישיבות", type: "משרד תאגידי" }
        }
      },
      // Contractors
      contractors: {
        badge: "שותפים מסחריים",
        heading: "שותף זכוכית לקבלנים ואדריכלים",
        description: "Fusion Glassworks תומכת בקבלנים כלליים, בונים וצוותי עיצוב עם תיאום מפורט, מומחיות טכנית וביצוע אמין באתר.",
        cta_label: "שלחו שרטוטים או כתבי כמויות ישירות לצוות ההערכה שלנו.",
        cta_button: "שלח שרטוטים במייל",
        benefits: {
          coordination: {
            title: "תיאום פרויקט ייעודי",
            description: "נקודת קשר יחידה משרטוטי עבודה ועד לרשימת ליקויים סופית."
          },
          documentation: {
            title: "תיעוד טכני",
            description: "שרטוטי עבודה, מפרטי זכוכית ולוחות זמנים לחומרה שנמסרים בזמן."
          },
          logistics: {
            title: "לוגיסטיקה מוכנה לאתר",
            description: "משלוחים ברצף, הגנה וחלונות התקנה המתוכננים עם הצוות שלכם."
          }
        },
        next_steps: {
          badge: "שלבים הבאים",
          heading: "שתפו את התוכניות שלכם ואנו נחזיר חבילת זכוכית מתואמת.",
          description: "כללו גבהים, חתכים וכל דרישות ביצועים כך שהצוות שלנו יוכל להגיב עם אפשרויות טכניות ותקציבים."
        }
      },
      // Contact
      contact: {
        heading: "ספרו לנו על הפרויקט שלכם",
        description: "שתפו כמה פרטים והצוות שלנו יגיב עם השלבים הבאים, הנחיות תקציב ולוחות זמנים אפשריים.",
        form: {
          name: "שם",
          name_placeholder: "שמך המלא",
          phone: "טלפון",
          phone_placeholder: "המספר הטוב ביותר להגיע אליך",
          email: "אימייל (אופציונלי)",
          email_placeholder: "name@company.com",
          message: "פרטי פרויקט",
          message_placeholder: "מיקום, סוג עבודת זכוכית, לוחות זמנים גסים וכל שרטוטים שיש לכם.",
          submit: "שלח הודעה",
          submitting: "שולח...",
          success: "תודה. לקוח האימייל שלך אמור להיפתח כעת עם הפרטים שמולאו מראש.",
          required: "שדה חובה"
        },
        mobile_cta: {
          call: "התקשר",
          whatsapp: "וואטסאפ"
        }
      },
      // Footer
      footer: {
        hours: "שעות פעילות",
        contact: "פרטי התקשרות",
        areas: "אזורי שירות"
      }
    }
  },
  ar: {
    translation: {
      nav: {
        home: "الرئيسية",
        services: "الخدمات",
        projects: "المشاريع",
        contractors: "المقاولون والمعماريون",
        process: "العملية", 
        about: "من نحن",
        contact: "اتصل بنا"
      },
      hero: {
        badge: "تميز في الزجاج المعماري",
        title: "زجاج حسب الطلب مع تركيب دقيق",
        subtitle: "دش، درابزين، واجهات زجاجية والمزيد—قياس وتصنيع وتركيب في الموعد.",
        tagline: "زجاج مهندس بدقة للدواخل والواجهات والتركيبات المخصصة",
        stats: {
          experience: "سنوات الخبرة",
          projects: "مشاريع منجزة",
          satisfaction: "رضا العملاء"
        },
        badge_years: "سنوات",
        badge_precision: "هندسة دقيقة",
        cta: {
          quote: "احصل على عرض سعر سريع",
          whatsapp: "واتساب الآن",
          call: "اتصل الآن",
          learn_more: "معرفة المزيد"
        }
      },
      services: {
        title: "خدماتنا",
        badge: "الخدمات",
        heading: "أنظمة زجاجية مهندسة للضوء والوضوح والدقة.",
        description: "من الدواخل بدون إطار إلى الواجهات عالية التعرض، تصمم Fusion Glassworks وتصنع وتركب حزم زجاجية كاملة تحترم الهندسة المعمارية والأداء.",
        shower: {
          title: "كابينات الدش",
          description: "أبواب الدش الزجاجية المخصصة والحواجز مع القياس الدقيق والتركيب المهني."
        },
        railings: {
          title: "درابزين زجاجي",
          description: "درابزين زجاجي حديث للسلالم والشرفات والمدرجات مع الأمان والأناقة."
        },
        storefronts: {
          title: "واجهات المحلات",
          description: "واجهات زجاجية تجارية وأنظمة مداخل للأعمال."
        },
        windows: {
          title: "النوافذ",
          description: "استبدال زجاج النوافذ المخصص والتركيب للعقارات السكنية والتجارية."
        },
        mirrors: {
          title: "المرايا",
          description: "مرايا مقطوعة حسب الطلب لدورات المياه والصالات الرياضية والتطبيقات الزخرفية."
        },
        repairs: {
          title: "إصلاح الزجاج",
          description: "خدمات إصلاح الزجاج الطارئة للنوافذ والأبواب وزجاج الأمان."
        }
      },
      form: {
        name: "الاسم",
        phone: "الهاتف", 
        city: "المدينة",
        serviceType: "نوع الخدمة",
        width: "العرض (مم)",
        height: "الارتفاع (مم)",
        photos: "رفع صور",
        tempered: "هل تحتاج زجاج مقسّى؟",
        date: "التاريخ المفضل",
        notes: "ملاحظات",
        submit: "إرسال طلب عرض السعر",
        required: "حقل مطلوب",
        success: "شكرًا لك! سنتواصل معك خلال 24 ساعة."
      },
      process: {
        title: "عمليتنا من خمس خطوات",
        badge: "العملية",
        description: "من المكالمة الهاتفية الأولى إلى الفحص النهائي، كل خطوة منظمة لحماية الجداول الزمنية والميزانيات ونية التصميم.",
        step_label: "الخطوة",
        step1: {
          title: "الاستشارة",
          description: "مكالمة أولية لفهم احتياجاتك وتقديم تقدير"
        },
        step2: {
          title: "القياس",
          description: "قياس دقيق في الموقع من قبل محترفينا"
        },
        step3: {
          title: "التصنيع",
          description: "قطع الزجاج المخصص والتحضير في ورشتنا"
        },
        step4: {
          title: "التركيب",
          description: "تركيب مهني مع ضمان الجودة"
        },
        step5: {
          title: "الضمان",
          description: "ضمان شامل ودعم مستمر"
        },
        step6: {
          title: "الدعم",
          description: "صيانة مستمرة ودعم العملاء"
        }
      },
      // CTA Section
      cta: {
        heading: "هل أنت مستعد لتحويل مساحتك؟",
        description: "اتصل بنا اليوم للحصول على استشارة مجانية. نرد خلال 24 ساعة."
      },
      // About
      about: {
        badge: "من نحن",
        heading: "Fusion Glassworks هو استوديو للضوء والهيكل والدقة.",
        description1: "نحن نجمع بين النظام الهندسي ونهج قائد بالتصميم للزجاج. من الفواصل الداخلية البسيطة إلى أغلفة ناطحات السحاب، تدير فرقنا التفاصيل والتصنيع والتركيب بنفس مستوى العناية.",
        description2: "يتم تنسيق كل مشروع عن كثب مع المهندسين المعماريين والمقاولين والملاك لضمان بقاء الخطوط نظيفة واحترام التحملات وأن يعمل المساحة النهائية بشكل جميل كما تبدو.",
        stats: {
          years: "سنوات في الزجاج المعماري",
          projects: "مشاريع منجزة",
          partners: "شركاء تجاريين عائدين",
          ontime: "التركيبات في الموعد"
        }
      },
      // Projects
      projects: {
        badge: "معرض الأعمال",
        heading: "مشاريع منجزة من قبل Fusion Glassworks",
        description: "مجموعة مختارة من أعمال الزجاج السكنية والتجارية وناطحات السحاب، تظهر تفاصيل دقيقة وخطوط نظيفة ومساحات مدفوعة بالضوء.",
        view_details: "عرض التفاصيل",
        items: {
          highrise: { title: "جدار ستاري لناطحة سحاب", type: "برج تجاري" },
          staircase: { title: "درج زجاجي عائم", type: "سكن فاخر" },
          storefront: { title: "نظام واجهة محل بسيط", type: "متجر رئيسي" },
          balcony: { title: "زجاج شرفة بدون إطار", type: "برج سكني" },
          lobby: { title: "جدار مميز في الصالة", type: "صالة فندق" },
          conference: { title: "فواصل غرفة مؤتمرات", type: "مكتب شركة" }
        }
      },
      // Contractors
      contractors: {
        badge: "شركاء تجاريين",
        heading: "شريك زجاجي للمقاولين والمعماريين",
        description: "تدعم Fusion Glassworks المقاولين العامين والبنائين وفرق التصميم بتنسيق مفصل وخبرة تقنية وتنفيذ موثوق في الموقع.",
        cta_label: "أرسل الرسومات أو جداول الكميات مباشرة إلى فريق التقدير لدينا.",
        cta_button: "إرسال الرسومات بالبريد الإلكتروني",
        benefits: {
          coordination: {
            title: "تنسيق مشروع مخصص",
            description: "نقطة اتصال واحدة من رسومات الورشة إلى قائمة اللكمات النهائية."
          },
          documentation: {
            title: "التوثيق الفني",
            description: "رسومات الورشة ومواصفات الزجاج وجداول المعدات المسلمة في الوقت المحدد."
          },
          logistics: {
            title: "لوجستيات جاهزة للموقع",
            description: "تسليمات متسلسلة وحماية ونوافذ تركيب مخططة مع فريقك."
          }
        },
        next_steps: {
          badge: "الخطوات التالية",
          heading: "شارك خططك وسنعود بحزمة زجاجية منسقة.",
          description: "قم بتضمين الارتفاعات والمقاطع وأي متطلبات أداء حتى يتمكن فريقنا من الرد بالخيارات الفنية والميزانيات."
        }
      },
      // Contact
      contact: {
        heading: "أخبرنا عن مشروعك",
        description: "شارك بعض التفاصيل وسيرد فريقنا بالخطوات التالية وإرشادات الميزانية والجداول الزمنية المحتملة.",
        form: {
          name: "الاسم",
          name_placeholder: "اسمك الكامل",
          phone: "الهاتف",
          phone_placeholder: "أفضل رقم للوصول إليك",
          email: "البريد الإلكتروني (اختياري)",
          email_placeholder: "name@company.com",
          message: "تفاصيل المشروع",
          message_placeholder: "الموقع، نوع عمل الزجاج، الجداول الزمنية التقريبية وأي رسومات لديك.",
          submit: "إرسال رسالة",
          submitting: "جاري الإرسال...",
          success: "شكرًا لك. يجب أن يفتح عميل البريد الإلكتروني الآن مع التفاصيل المملوءة مسبقًا.",
          required: "حقل مطلوب"
        },
        mobile_cta: {
          call: "اتصل",
          whatsapp: "واتساب"
        }
      },
      // Footer
      footer: {
        hours: "ساعات العمل",
        contact: "معلومات الاتصال",
        areas: "مناطق الخدمة"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'he', 'ar'],
    detection: {
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
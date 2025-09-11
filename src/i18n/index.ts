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
        process: "Process",
        about: "About",
        contact: "Contact"
      },
      // Hero section
      hero: {
        title: "Custom Glass, Precisely Installed",
        subtitle: "Showers, railings, storefronts and more—measured, fabricated and installed on time.",
        cta: {
          quote: "Get a Quick Quote",
          whatsapp: "WhatsApp Now",
          call: "Call Now"
        }
      },
      // Services
      services: {
        title: "Our Services",
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
        process: "תהליך",
        about: "אודות",
        contact: "צור קשר"
      },
      hero: {
        title: "זכוכית בהתאמה אישית – התקנה מדויקת",
        subtitle: "מקלחונים, מעקות, ויטרינות ועוד—מדידה, ייצור והתקנה בזמן.",
        cta: {
          quote: "קבלו הצעת מחיר מהירה",
          whatsapp: "וואטסאפ עכשיו", 
          call: "חייגו עכשיו"
        }
      },
      services: {
        title: "השירותים שלנו",
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
        }
      },
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
        process: "العملية", 
        about: "من نحن",
        contact: "اتصل بنا"
      },
      hero: {
        title: "زجاج حسب الطلب مع تركيب دقيق",
        subtitle: "دش، درابزين، واجهات زجاجية والمزيد—قياس وتصنيع وتركيب في الموعد.",
        cta: {
          quote: "احصل على عرض سعر سريع",
          whatsapp: "واتساب الآن",
          call: "اتصل الآن"
        }
      },
      services: {
        title: "خدماتنا",
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
        }
      },
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
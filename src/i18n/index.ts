import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      common: {
        learn_more: "Learn More",
        view_all: "View All Services",
        get_quote: "Get Free Quote",
        call_now: "Call Now",
        whatsapp: "WhatsApp",
        loading: "Loading..."
      },
      // Trust badges
      trust: {
        warranty: "Comprehensive Warranty",
        warranty_desc: "All installations backed by our guarantee",
        response: "24-Hour Response",
        response_desc: "Fast quotes and emergency service",
        measurement: "Free Measurement",
        measurement_desc: "Professional on-site consultation",
        experience: "15+ Years Experience",
        experience_desc: "Trusted by 500+ clients"
      },
      // Navigation
      nav: {
        home: "Home",
        services: "Services", 
        projects: "Projects",
        contractors: "Contractors & Architects",
        process: "Process",
        about: "About",
        contact: "Contact",
        language: "Language"
      },
      // Hero section
      hero: {
        badge: "15+ Years | 500+ Projects | Israel-Wide",
        title: "Premium Glass Installation You Can Trust",
        subtitle: "From custom shower doors to commercial storefronts—installed right, on time, backed by warranty. Serving residential and commercial clients across Israel.",
        value_1: "✓ Professional measurement & installation",
        value_2: "✓ Warranty on all work",
        value_3: "✓ 24-hour response time",
        tagline: "Professional glass works for residential and commercial projects",
        stats: {
          experience: "Years Experience",
          projects: "Completed Projects",
          satisfaction: "Client Satisfaction"
        },
        badge_years: "Years",
        badge_precision: "Precision Engineering",
        cta: {
          quote: "Get Free Quote",
          whatsapp: "WhatsApp Now",
          call: "Call Now",
          learn_more: "View Our Work",
          secondary: "See Projects"
        }
      },
      // Services
      services: {
        title: "Our Services",
        badge: "Services",
        heading: "Professional glass installation services for every need.",
        description: "Shwaki Glassworks provides professional glass installation services for residential and commercial projects. We operate by appointments with on-site installations throughout Israel.",
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
        },
        partitions: {
          title: "Glass Partitions",
          description: "Office and room dividers with modern glass partitions."
        },
        doors: {
          title: "Glass Doors",
          description: "Sliding and hinged glass doors for entrances and interiors."
        }
      },
      // Quote Form
      quote: {
        title: "Get Your Free Quote",
        subtitle: "Response within 24 hours",
        name_label: "Your Name",
        name_placeholder: "Enter your full name",
        phone_label: "Phone Number",
        phone_placeholder: "05X-XXX-XXXX",
        service_label: "Select Service",
        service_placeholder: "Choose a service...",
        service_other: "Other / Not Sure",
        details_label: "Project Details (Optional)",
        details_placeholder: "Tell us about your project, measurements, location, timeline...",
        reassurance_1: "✓ Free on-site measurement",
        reassurance_2: "✓ No obligation",
        reassurance_3: "✓ Secure & private",
        submit_button: "Get Quote",
        call_button: "Call",
        success_title: "Request Sent!",
        success_message: "We'll contact you within 24 hours."
      },
      // Testimonials
      testimonials: {
        title: "What Our Clients Say",
        subtitle: "Join 500+ satisfied customers who chose quality and professionalism",
        testimonial_1: {
          name: "Sarah M.",
          location: "Tel Aviv",
          service: "Shower Doors",
          text: "The team measured everything perfectly and installed our frameless shower in one day. Two years later, it still looks brand new. Highly recommend!"
        },
        testimonial_2: {
          name: "David L.",
          location: "Jerusalem",
          service: "Glass Railings",
          text: "Professional service from start to finish. The glass railings transformed our balcony. Great quality and fair pricing."
        },
        testimonial_3: {
          name: "Rachel K.",
          location: "Haifa",
          service: "Storefront",
          text: "They completed our store renovation on time and within budget. The storefront looks amazing and the quality is excellent."
        }
      },
      // Trust Promises Section (detailed promises for homepage)
      trustPromises: {
        title: "Our Promise to You",
        subtitle: "Quality work backed by guarantees and professional service",
        promises: {
          warranty: {
            title: "2-Year Warranty",
            description: "All installations backed by comprehensive warranty"
          },
          consultation: {
            title: "Free Consultation",
            description: "Expert advice and on-site measurement at no cost"
          },
          licensed: {
            title: "Insured & Licensed",
            description: "Fully licensed professionals with liability insurance"
          },
          no_hidden_costs: {
            title: "Transparent Pricing",
            description: "Clear quotes with no hidden fees or surprises"
          },
          professional_team: {
            title: "Expert Team",
            description: "15+ years experience with trained technicians"
          },
          clean_installation: {
            title: "Clean Work",
            description: "Professional installation with thorough cleanup"
          }
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
        heading: "Shwaki Glassworks - Professional glass installation services.",
        description1: "We are a service-based glass installation business operating throughout Israel. With years of experience, we provide professional on-site installations by appointment.",
        description2: "No physical storefront - we come to you. Every project is coordinated closely with clients to ensure quality installation and customer satisfaction.",
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
        heading: "Completed projects by Shwaki Glassworks",
        description: "A selection of professional glass installation projects across Israel, showcasing quality workmanship and attention to detail.",
        allProjects: "All Projects",
        noProjects: "No projects found",
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
        badge: "For Contractors",
        heading: "Professional glass installation for contractors & architects",
        description: "Shwaki Glassworks supports contractors, builders and architects with reliable on-site glass installation services throughout Israel.",
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
        about_text: "Professional glass installation and works. Service-based business operating by appointments and on-site installations across Israel.",
        hours: "Business Hours",
        contact: "Contact Information",
        areas: "Service Areas"
      }
    }
  },
  he: {
    translation: {
      // Common
      common: {
        learn_more: "למד עוד",
        view_all: "כל השירותים",
        get_quote: "קבל הצעת מחיר חינם",
        call_now: "התקשר עכשיו",
        whatsapp: "WhatsApp",
        loading: "טוען..."
      },
      // Trust badges
      trust: {
        warranty: "אחריות מקיפה",
        warranty_desc: "כל ההתקנות מגובות באחריות שלנו",
        response: "תגובה תוך 24 שעות",
        response_desc: "הצעות מחיר מהירות ושירות חירום",
        measurement: "מדידה חינמית",
        measurement_desc: "ייעוץ מקצועי באתר",
        experience: "15+ שנות ניסיון",
        experience_desc: "נבחרנו על ידי 500+ לקוחות"
      },
      nav: {
        home: "בית",
        services: "שירותים",
        projects: "פרויקטים", 
        contractors: "קבלנים ואדריכלים",
        process: "תהליך",
        about: "אודות",
        contact: "צור קשר",
        language: "שפה"
      },
      hero: {
        badge: "15+ שנים | 500+ פרויקטים | בכל רחבי ישראל",
        title: "התקנת זכוכית מקצועית שאפשר לסמוך עליה",
        subtitle: "ממקלחונים מותאמים אישית ועד חזיתות מסחריות—מותקן נכון, בזמן, מגובה באחריות. משרתים לקוחות פרטיים ומסחריים בכל רחבי ישראל.",
        value_1: "✓ מדידה והתקנה מקצועית",
        value_2: "✓ אחריות על כל העבודות",
        value_3: "✓ זמן תגובה של 24 שעות",
        tagline: "זכוכית מהונדסת בדיוק לחללים פנימיים, חזיתות והתקנות מותאמות אישית",
        stats: {
          experience: "שנות ניסיון",
          projects: "פרויקטים שהושלמו",
          satisfaction: "שביעות רצון לקוחות"
        },
        badge_years: "שנים",
        badge_precision: "הנדסה מדויקת",
        cta: {
          quote: "קבל הצעת מחיר חינם",
          whatsapp: "וואטסאפ עכשיו",
          call: "התקשר עכשיו",
          learn_more: "צפה בעבודות שלנו",
          secondary: "ראה פרויקטים"
        }
      },
      services: {
        title: "השירותים שלנו",
        badge: "שירותים",
        heading: "מערכות זכוכית מהונדסות לאור, בהירות ודיוק.",
        description: "אחים שוואקי זכוכית מספקת שירותי התקנת זכוכית מקצועיים לפרויקטים מגורים ומסחריים. אנו פועלים על פי תיאומים עם התקנות באתר ברחבי ישראל.",
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
        },
        partitions: {
          title: "מחיצות זכוכית",
          description: "מחיצות זכוכית למשרדים וחללים עם עיצוב מודרני."
        },
        doors: {
          title: "דלתות זכוכית",
          description: "דלתות זכוכית הזזה וצירים לכניסות ופנים."
        }
      },
      // Quote Form
      quote: {
        title: "קבל הצעת מחיר חינם",
        subtitle: "תגובה תוך 24 שעות",
        name_label: "שם מלא",
        name_placeholder: "הכנס את שמך המלא",
        phone_label: "מספר טלפון",
        phone_placeholder: "05X-XXX-XXXX",
        service_label: "בחר שירות",
        service_placeholder: "בחר שירות...",
        service_other: "אחר / לא בטוח",
        details_label: "פרטי הפרויקט (אופציונלי)",
        details_placeholder: "ספר לנו על הפרויקט, מידות, מיקום, לוחות זמנים...",
        reassurance_1: "✓ מדידה באתר ללא עלות",
        reassurance_2: "✓ ללא התחייבות",
        reassurance_3: "✓ מאובטח ופרטי",
        submit_button: "קבל הצעת מחיר",
        call_button: "התקשר",
        success_title: "הבקשה נשלחה!",
        success_message: "ניצור קשר תוך 24 שעות."
      },
      // Testimonials
      testimonials: {
        title: "מה הלקוחות שלנו אומרים",
        subtitle: "הצטרף ל-500+ לקוחות מרוצים שבחרו באיכות ומקצועיות",
        testimonial_1: {
          name: "שרה מ.",
          location: "תל אביב",
          service: "מקלחונים",
          text: "הצוות מדד הכל בצורה מושלמת והתקין את המקלחון הפרמלס ביום אחד. שנתיים אחרי, זה עדיין נראה חדש. מומלץ מאוד!"
        },
        testimonial_2: {
          name: "דוד ל.",
          location: "ירושלים",
          service: "מעקות זכוכית",
          text: "שירות מקצועי מתחילה ועד סוף. מעקות הזכוכית שינו את המרפסת שלנו. איכות מעולה ומחיר הוגן."
        },
        testimonial_3: {
          name: "רחל כ.",
          location: "חיפה",
          service: "חזית חנות",
          text: "הם השלימו את שיפוץ החנות בזמן ובתקציב. החזית נראית מדהים והאיכות מצוינת."
        }
      },
      // Trust Promises Section (detailed promises for homepage)
      trustPromises: {
        title: "ההבטחה שלנו אליך",
        subtitle: "עבודה איכותית מגובה באחריות ושירות מקצועי",
        promises: {
          warranty: {
            title: "אחריות לשנתיים",
            description: "כל ההתקנות מגובות באחריות מקיפה"
          },
          consultation: {
            title: "ייעוץ חינם",
            description: "ייעוץ מקצועי ומדידה באתר ללא עלות"
          },
          licensed: {
            title: "מבוטח ובעל רישיון",
            description: "אנשי מקצוע מורשים עם ביטוח אחריות"
          },
          no_hidden_costs: {
            title: "תמחור שקוף",
            description: "הצעות מחיר ברורות ללא עלויות נסתרות"
          },
          professional_team: {
            title: "צוות מומחים",
            description: "15+ שנות ניסיון עם טכנאים מיומנים"
          },
          clean_installation: {
            title: "עבודה נקייה",
            description: "התקנה מקצועית עם ניקיון יסודי"
          }
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
        heading: "אחים שוואקי זכוכית - שירותי התקנת זכוכית מקצועיים.",
        description1: "אנו עסק מבוסס שירות להתקנת זכוכית הפועל בכל רחבי ישראל. עם שנות ניסיון, אנו מספקים התקנות מקצועיות באתר על פי תיאום.",
        description2: "ללא חנות פיזית - אנו מגיעים אליכם. כל פרויקט מתואם בצמוד עם הלקוחות להבטחת התקנה איכותית ושביעות רצון לקוחות.",
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
        heading: "פרויקטים שבוצעו על ידי אחים שוואקי זכוכית",
        description: "מבחר פרויקטים מקצועיים של התקנת זכוכית ברחבי ישראל, מציגים איכות ביצוע ותשומת לב לפרטים.",
        allProjects: "כל הפרויקטים",
        noProjects: "לא נמצאו פרויקטים",
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
        badge: "לקבלנים",
        heading: "שירותי התקנת זכוכית מקצועיים לקבלנים ואדריכלים",
        description: "אחים שוואקי זכוכית תומכת בקבלנים, בונים ואדריכלים עם שירותי התקנת זכוכית מוסמכים באתר בכל רחבי ישראל.",
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
        about_text: "התקנת זכוכית מקצועית ועבודות זכוכית. עסק מבוסס שירות הפועל לפי תיאום מראש והתקנות באתר בכל רחבי ישראל.",
        hours: "שעות פעילות",
        contact: "פרטי התקשרות",
        areas: "אזורי שירות"
      }
    }
  },
  ar: {
    translation: {
      // Common
      common: {
        learn_more: "اعرف المزيد",
        view_all: "جميع الخدمات",
        get_quote: "احصل على عرض مجاني",
        call_now: "اتصل الآن",
        whatsapp: "واتساب",
        loading: "جار التحميل..."
      },
      // Trust badges
      trust: {
        warranty: "ضمان شامل",
        warranty_desc: "جميع التركيبات مدعومة بضماننا",
        response: "استجابة خلال 24 ساعة",
        response_desc: "عروض أسعار سريعة وخدمة طوارئ",
        measurement: "قياس مجاني",
        measurement_desc: "استشارة احترافية في الموقع",
        experience: "15+ سنة خبرة",
        experience_desc: "موثوق به من قبل 500+ عميل"
      },
      nav: {
        home: "الرئيسية",
        services: "الخدمات",
        projects: "المشاريع",
        contractors: "المقاولون والمعماريون",
        process: "العملية", 
        about: "من نحن",
        contact: "اتصل بنا",
        language: "اللغة"
      },
      hero: {
        badge: "15+ عامًا | 500+ مشروع | في جميع أنحاء إسرائيل",
        title: "تركيب زجاج متميز يمكنك الوثوق به",
        subtitle: "من أبواب الدش المخصصة إلى الواجهات التجارية—تركيب صحيح، في الوقت المحدد، مدعوم بالضمان. نخدم العملاء السكنيين والتجاريين في جميع أنحاء إسرائيل.",
        value_1: "✓ قياس وتركيب احترافي",
        value_2: "✓ ضمان على جميع الأعمال",
        value_3: "✓ وقت استجابة 24 ساعة",
        tagline: "زجاج مهندس بدقة للدواخل والواجهات والتركيبات المخصصة",
        stats: {
          experience: "سنوات الخبرة",
          projects: "مشاريع منجزة",
          satisfaction: "رضا العملاء"
        },
        badge_years: "سنوات",
        badge_precision: "هندسة دقيقة",
        cta: {
          quote: "احصل على عرض مجاني",
          whatsapp: "واتساب الآن",
          call: "اتصل الآن",
          learn_more: "شاهد أعمالنا",
          secondary: "انظر المشاريع"
        }
      },
      services: {
        title: "خدماتنا",
        badge: "الخدمات",
        heading: "أنظمة زجاجية مهندسة للضوء والوضوح والدقة.",
        description: "أخوة شواكي للزجاج توفر خدمات تركيب زجاج محترفة للمشاريع السكنية والتجارية. نعمل بالمواعيد مع تركيبات في الموقع في جميع أنحاء إسرائيل.",
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
          description: "خدمات إصلاح الزجاج الطارئة للنوافذ والأبواب وزجاج الأمان."        },
        partitions: {
          title: "فواصل زجاجية",
          description: "فواصل زجاجية للمكاتب والغرف بتصميم عصري."
        },
        doors: {
          title: "أبواب زجاجية",
          description: "أبواب زجاجية منزلقة ومفصلية للمداخل والداخل."
        }
      },
      // Quote Form
      quote: {
        title: "احصل على عرض مجاني",
        subtitle: "رد خلال 24 ساعة",
        name_label: "الاسم الكامل",
        name_placeholder: "أدخل اسمك الكامل",
        phone_label: "رقم الهاتف",
        phone_placeholder: "05X-XXX-XXXX",
        service_label: "اختر الخدمة",
        service_placeholder: "اختر خدمة...",
        service_other: "أخرى / غير متأكد",
        details_label: "تفاصيل المشروع (اختياري)",
        details_placeholder: "أخبرنا عن مشروعك، القياسات، الموقع، الجدول الزمني...",
        reassurance_1: "✓ قياس في الموقع مجاناً",
        reassurance_2: "✓ بدون التزام",
        reassurance_3: "✓ آمن وخاص",
        submit_button: "احصل على عرض",
        call_button: "اتصل",
        success_title: "تم إرسال الطلب!",
        success_message: "سنتواصل معك خلال 24 ساعة."
      },
      // Testimonials
      testimonials: {
        title: "ماذا يقول عملاؤنا",
        subtitle: "انضم إلى 500+ عميل راضٍ اختاروا الجودة والاحتراف",
        testimonial_1: {
          name: "سارة م.",
          location: "تل أبيب",
          service: "أبواب دش",
          text: "قاس الفريق كل شيء بشكل مثالي وقاموا بتركيب الدش الخالي من الإطار في يوم واحد. بعد عامين، لا يزال يبدو جديداً. أوصي به بشدة!"
        },
        testimonial_2: {
          name: "داود ل.",
          location: "القدس",
          service: "درابزين زجاجي",
          text: "خدمة احترافية من البداية إلى النهاية. غيّر الدرابزين الزجاجي شرفتنا. جودة ممتازة وأسعار عادلة."
        },
        testimonial_3: {
          name: "راحيل ك.",
          location: "حيفا",
          service: "واجهة محل",
          text: "أكملوا تجديد متجرنا في الموعد وضمن الميزانية. الواجهة تبدو رائعة والجودة ممتازة."
        }
      },
      // Trust Promises Section (detailed promises for homepage)
      trustPromises: {
        title: "وعدنا لك",
        subtitle: "عمل عالي الجودة مدعوم بضمانات وخدمة احترافية",
        promises: {
          warranty: {
            title: "ضمان لمدة عامين",
            description: "جميع التركيبات مدعومة بضمان شامل"
          },
          consultation: {
            title: "استشارة مجانية",
            description: "نصيحة خبراء وقياس في الموقع بدون تكلفة"
          },
          licensed: {
            title: "مؤمن ومرخص",
            description: "محترفون مرخصون مع تأمين المسؤولية"
          },
          no_hidden_costs: {
            title: "أسعار شفافة",
            description: "عروض أسعار واضحة بدون رسوم مخفية"
          },
          professional_team: {
            title: "فريق خبراء",
            description: "خبرة 15+ سنة مع فنيين مدربين"
          },
          clean_installation: {
            title: "عمل نظيف",
            description: "تركيب احترافي مع تنظيف شامل"
          }        }
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
        heading: "أخوة شواكي للزجاج - خدمات تركيب زجاج محترفة.",
        description1: "نحن عمل قائم على الخدمة لتركيب الزجاج يعمل في جميع أنحاء إسرائيل. مع سنوات من الخبرة، نقدم تركيبات احترافية في الموقع بالموعد.",
        description2: "بدون متجر فعلي - نأتي إليك. يتم تنسيق كل مشروع عن كثب مع العملاء لضمان تركيب عالي الجودة ورضا العملاء.",
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
        heading: "مشاريع منجزة من قبل أخوة شواكي للزجاج",
        description: "مجموعة من مشاريع تركيب الزجاج المهنية في جميع أنحاء إسرائيل، تظهر جودة التنفيذ والاهتمام بالتفاصيل.",
        allProjects: "جميع المشاريع",
        noProjects: "لم يتم العثور على مشاريع",
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
        badge: "للمقاولين",
        heading: "خدمات تركيب زجاج محترفة للمقاولين والمعماريين",
        description: "أخوة شواكي للزجاج تدعم المقاولين والبنائين والمعماريين بخدمات تركيب زجاج موثوقة في الموقع في جميع أنحاء إسرائيل.",
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
        about_text: "تركيب زجاج وأعمال زجاج احترافية. نعمل بنظام المواعيد المسبقة والتركيب في الموقع في جميع أنحاء إسرائيل.",
        hours: "ساعات العمل",
        contact: "معلومات الاتصال",
        areas: "مناطق الخدمة"
      }
    }
  },
  ru: {
    translation: {
      common: {
        learn_more: "Подробнее",
        view_all: "Все услуги",
        get_quote: "Бесплатная оценка",
        call_now: "Позвонить",
        whatsapp: "WhatsApp",
        loading: "Загрузка..."
      },
      trust: {
        warranty: "Полная гарантия",
        warranty_desc: "Все установки с нашей гарантией",
        response: "Ответ за 24 часа",
        response_desc: "Быстрые расчёты и экстренный сервис",
        measurement: "Бесплатный замер",
        measurement_desc: "Профессиональная консультация на месте",
        experience: "15+ лет опыта",
        experience_desc: "Нам доверяют 500+ клиентов"
      },
      nav: {
        home: "Главная",
        services: "Услуги",
        projects: "Проекты",
        contractors: "Подрядчики и архитекторы",
        process: "Процесс",
        about: "О нас",
        contact: "Контакты",
        language: "Язык"
      },
      hero: {
        badge: "15+ лет | 500+ проектов | По всему Израилю",
        title: "Профессиональная установка стекла, которой можно доверять",
        subtitle: "От душевых кабин до витрин — установка качественная, в срок, с гарантией. Обслуживаем частных и коммерческих клиентов по всему Израилю.",
        value_1: "✓ Профессиональный замер и установка",
        value_2: "✓ Гарантия на все работы",
        value_3: "✓ Время ответа — 24 часа",
        tagline: "Профессиональные стеклянные работы для жилых и коммерческих проектов",
        stats: {
          experience: "Лет опыта",
          projects: "Выполненных проектов",
          satisfaction: "Удовлетворённость клиентов"
        },
        badge_years: "Лет",
        badge_precision: "Точная инженерия",
        cta: {
          quote: "Бесплатная оценка",
          whatsapp: "WhatsApp сейчас",
          call: "Позвонить",
          learn_more: "Наши работы",
          secondary: "Смотреть проекты"
        }
      },
      services: {
        title: "Наши услуги",
        badge: "Услуги",
        heading: "Профессиональные услуги по установке стекла для любых задач.",
        description: "Братья Шваки предоставляют профессиональные услуги по установке стекла для жилых и коммерческих проектов. Работаем по записи с выездом по всему Израилю.",
        shower: {
          title: "Душевые кабины",
          description: "Стеклянные двери и перегородки для душа с точным замером и профессиональной установкой."
        },
        railings: {
          title: "Стеклянные ограждения",
          description: "Современные стеклянные ограждения для лестниц, балконов и террас — безопасно и стильно."
        },
        storefronts: {
          title: "Витрины",
          description: "Коммерческие стеклянные витрины и входные системы для бизнеса."
        },
        windows: {
          title: "Окна",
          description: "Замена и установка оконного стекла для жилых и коммерческих объектов."
        },
        mirrors: {
          title: "Зеркала",
          description: "Зеркала на заказ для ванных комнат, спортзалов и декоративных целей."
        },
        repairs: {
          title: "Ремонт стекла",
          description: "Экстренный ремонт стекла для окон, дверей и защитного стекла."
        },
        partitions: {
          title: "Стеклянные перегородки",
          description: "Офисные и комнатные перегородки с современным дизайном."
        },
        doors: {
          title: "Стеклянные двери",
          description: "Раздвижные и распашные стеклянные двери для входов и интерьеров."
        }
      },
      quote: {
        title: "Получите бесплатную оценку",
        subtitle: "Ответ в течение 24 часов",
        name_label: "Ваше имя",
        name_placeholder: "Введите ваше полное имя",
        phone_label: "Номер телефона",
        phone_placeholder: "05X-XXX-XXXX",
        service_label: "Выберите услугу",
        service_placeholder: "Выберите услугу...",
        service_other: "Другое / Не уверен",
        details_label: "Детали проекта (необязательно)",
        details_placeholder: "Расскажите о проекте, размерах, местоположении, сроках...",
        reassurance_1: "✓ Бесплатный замер на месте",
        reassurance_2: "✓ Без обязательств",
        reassurance_3: "✓ Безопасно и конфиденциально",
        submit_button: "Получить оценку",
        call_button: "Позвонить",
        success_title: "Запрос отправлен!",
        success_message: "Мы свяжемся с вами в течение 24 часов."
      },
      testimonials: {
        title: "Что говорят наши клиенты",
        subtitle: "Присоединяйтесь к 500+ довольным клиентам, выбравшим качество и профессионализм",
        testimonial_1: {
          name: "Сара М.",
          location: "Тель-Авив",
          service: "Душевые двери",
          text: "Команда всё точно замерила и установила безрамную душевую за один день. Через два года она всё ещё выглядит как новая. Очень рекомендую!"
        },
        testimonial_2: {
          name: "Давид Л.",
          location: "Иерусалим",
          service: "Стеклянные ограждения",
          text: "Профессиональный сервис от начала до конца. Стеклянные ограждения преобразили наш балкон. Отличное качество и честные цены."
        },
        testimonial_3: {
          name: "Рахель К.",
          location: "Хайфа",
          service: "Витрина",
          text: "Они завершили ремонт нашего магазина вовремя и в рамках бюджета. Витрина выглядит потрясающе, качество отличное."
        }
      },
      trustPromises: {
        title: "Наше обещание",
        subtitle: "Качественная работа с гарантией и профессиональным сервисом",
        promises: {
          warranty: {
            title: "Гарантия 2 года",
            description: "Все установки с полной гарантией"
          },
          consultation: {
            title: "Бесплатная консультация",
            description: "Экспертный совет и замер на месте бесплатно"
          },
          licensed: {
            title: "Лицензия и страховка",
            description: "Лицензированные специалисты со страхованием"
          },
          no_hidden_costs: {
            title: "Прозрачные цены",
            description: "Чёткие расчёты без скрытых платежей"
          },
          professional_team: {
            title: "Команда экспертов",
            description: "15+ лет опыта с обученными техниками"
          },
          clean_installation: {
            title: "Чистая работа",
            description: "Профессиональная установка с тщательной уборкой"
          }
        }
      },
      form: {
        name: "Имя",
        phone: "Телефон",
        city: "Город",
        serviceType: "Тип услуги",
        width: "Ширина (мм)",
        height: "Высота (мм)",
        photos: "Загрузить фото",
        tempered: "Нужно закалённое стекло?",
        date: "Желаемая дата",
        notes: "Заметки",
        submit: "Отправить запрос",
        required: "Обязательное поле",
        success: "Спасибо! Мы свяжемся с вами в течение 24 часов."
      },
      process: {
        title: "Наш процесс в 5 шагов",
        badge: "Процесс",
        description: "От первого звонка до финальной проверки — каждый этап структурирован для соблюдения сроков, бюджетов и замысла дизайна.",
        step_label: "Шаг",
        step1: {
          title: "Консультация",
          description: "Первичный звонок для понимания ваших потребностей и предварительной оценки"
        },
        step2: {
          title: "Замер",
          description: "Точный замер на месте нашими специалистами"
        },
        step3: {
          title: "Изготовление",
          description: "Резка стекла по индивидуальным размерам в нашей мастерской"
        },
        step4: {
          title: "Установка",
          description: "Профессиональная установка с гарантией качества"
        },
        step5: {
          title: "Гарантия",
          description: "Полная гарантия и постоянная поддержка"
        },
        step6: {
          title: "Поддержка",
          description: "Постоянное обслуживание и поддержка клиентов"
        }
      },
      cta: {
        heading: "Готовы преобразить ваше пространство?",
        description: "Свяжитесь с нами сегодня для бесплатной консультации. Мы отвечаем в течение 24 часов."
      },
      about: {
        badge: "О нас",
        heading: "Братья Шваки — профессиональные услуги по установке стекла.",
        description1: "Мы — сервисная компания по установке стекла, работающая по всему Израилю. С многолетним опытом мы предоставляем профессиональные выездные установки по записи.",
        description2: "Без физического магазина — мы приезжаем к вам. Каждый проект координируется с клиентами для обеспечения качественной установки и удовлетворённости.",
        stats: {
          years: "Лет в архитектурном стекле",
          projects: "Выполненных проектов",
          partners: "Постоянных партнёров",
          ontime: "Установок в срок"
        }
      },
      projects: {
        badge: "Портфолио",
        heading: "Выполненные проекты Братьев Шваки",
        description: "Подборка профессиональных стеклянных установок по всему Израилю, демонстрирующих качество и внимание к деталям.",
        allProjects: "Все проекты",
        noProjects: "Проекты не найдены",
        view_details: "Подробнее",
        items: {
          highrise: { title: "Навесная стена высотки", type: "Коммерческая башня" },
          staircase: { title: "Парящая стеклянная лестница", type: "Элитное жильё" },
          storefront: { title: "Минималистичная витрина", type: "Флагманский магазин" },
          balcony: { title: "Безрамное остекление балкона", type: "Жилая башня" },
          lobby: { title: "Декоративная стена лобби", type: "Лобби отеля" },
          conference: { title: "Перегородки переговорной", type: "Корпоративный офис" }
        }
      },
      contractors: {
        badge: "Для подрядчиков",
        heading: "Профессиональная установка стекла для подрядчиков и архитекторов",
        description: "Братья Шваки поддерживают подрядчиков, строителей и архитекторов надёжными выездными услугами по установке стекла по всему Израилю.",
        cta_label: "Отправьте чертежи или спецификации нашей команде.",
        cta_button: "Отправить чертежи",
        benefits: {
          coordination: {
            title: "Координация проекта",
            description: "Единая точка контакта от чертежей до финальной приёмки."
          },
          documentation: {
            title: "Техническая документация",
            description: "Рабочие чертежи, спецификации стекла и графики поставок вовремя."
          },
          logistics: {
            title: "Логистика на объект",
            description: "Последовательные поставки, защита и окна установки спланированы с вашей командой."
          }
        },
        next_steps: {
          badge: "Следующие шаги",
          heading: "Поделитесь вашими планами, и мы подготовим комплексное стеклянное решение.",
          description: "Включите фасады, разрезы и требования к характеристикам, чтобы наша команда могла ответить с техническими вариантами и бюджетами."
        }
      },
      contact: {
        heading: "Расскажите о вашем проекте",
        description: "Поделитесь деталями, и наша команда ответит с планом действий, ориентиром по бюджету и возможными сроками.",
        form: {
          name: "Имя",
          name_placeholder: "Ваше полное имя",
          phone: "Телефон",
          phone_placeholder: "Лучший номер для связи",
          email: "Email (необязательно)",
          email_placeholder: "name@company.com",
          message: "Детали проекта",
          message_placeholder: "Местоположение, тип стеклянных работ, примерные сроки и чертежи.",
          submit: "Отправить сообщение",
          submitting: "Отправка...",
          success: "Спасибо. Ваш почтовый клиент откроется с заполненными данными.",
          required: "Обязательное поле"
        },
        mobile_cta: {
          call: "Позвонить",
          whatsapp: "WhatsApp"
        }
      },
      footer: {
        about_text: "Профессиональная установка стекла и стеклянные работы. Сервисный бизнес по записи с выездом по всему Израилю.",
        hours: "Часы работы",
        contact: "Контактная информация",
        areas: "Зоны обслуживания"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'he',
    supportedLngs: ['he', 'en', 'ar', 'ru'],
    detection: {
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
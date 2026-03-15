/**
 * JSON-LD Schema Component
 * Provides structured data for SEO and AI search optimization
 * Includes LocalBusiness, FAQPage, and Service schemas
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { CONTACT_INFO, BUSINESS_INFO, SERVICES, getLocalizedText, type SupportedLocale } from '@/data';

// FAQ data for schema
const FAQ_SCHEMA_DATA = [
  {
    question: {
      en: 'How much does glass installation cost in Israel?',
      he: 'כמה עולה התקנת זכוכית בישראל?',
    },
    answer: {
      en: 'Glass installation costs vary based on type, size, and complexity. Shower enclosures typically range from ₪3,000-15,000, glass railings from ₪1,200-2,500 per meter, and mirror walls from ₪800-2,000 per sqm. We offer free on-site measurements and detailed quotes with no obligation.',
      he: 'עלות התקנת זכוכית משתנה בהתאם לסוג, גודל ומורכבות. מקלחונים נעים בדרך כלל בין ₪3,000-15,000, מעקות זכוכית בין ₪1,200-2,500 למטר, וקירות מראה בין ₪800-2,000 למ"ר.',
    },
  },
  {
    question: {
      en: 'How long does glass installation take?',
      he: 'כמה זמן לוקחת התקנת זכוכית?',
    },
    answer: {
      en: 'Most residential glass installations are completed in 1-2 days. After measurement, custom glass production takes 3-5 business days. The actual installation typically takes a few hours to a full day.',
      he: 'רוב התקנות הזכוכית הביתיות מסתיימות תוך 1-2 ימים. לאחר המדידה, ייצור זכוכית מותאמת אישית לוקח 3-5 ימי עסקים.',
    },
  },
  {
    question: {
      en: 'What type of glass is best for shower enclosures?',
      he: 'איזה סוג זכוכית הכי טוב למקלחונים?',
    },
    answer: {
      en: 'We recommend 8mm-10mm tempered (safety) glass for shower enclosures. Tempered glass is 4-5 times stronger than regular glass and breaks into small, less harmful pieces if shattered.',
      he: 'אנו ממליצים על זכוכית מחוסמת בעובי 8-10 מ"מ למקלחונים. זכוכית מחוסמת חזקה פי 4-5 מזכוכית רגילה ומתפוררת לחתיכות קטנות במקרה של שבירה.',
    },
  },
  {
    question: {
      en: 'Do you offer a warranty on glass installations?',
      he: 'האם אתם מציעים אחריות על התקנות זכוכית?',
    },
    answer: {
      en: 'Yes! All our glass installations come with a 2-year warranty covering workmanship and hardware. This includes hinges, handles, seals, and installation quality.',
      he: 'כן! כל התקנות הזכוכית שלנו מגיעות עם אחריות לשנתיים המכסה עבודה וחומרים.',
    },
  },
  {
    question: {
      en: 'Do you serve all areas in Israel?',
      he: 'האם אתם עובדים בכל רחבי ישראל?',
    },
    answer: {
      en: 'Yes, we provide glass installation services nationwide across Israel including Jerusalem, Tel Aviv, Haifa, Beersheba, Netanya, and surrounding areas.',
      he: 'כן, אנו מספקים שירותי התקנת זכוכית בכל רחבי ישראל כולל ירושלים, תל אביב, חיפה, באר שבע, נתניה ובאזורים הסמוכים.',
    },
  },
];

const JsonLdSchema: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const location = useLocation();
  const locale = currentLanguage as SupportedLocale;

  useEffect(() => {
    // Remove existing JSON-LD scripts
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach((script) => script.remove());

    // Determine current page
    const pathParts = location.pathname.split('/').filter(Boolean);
    const page = pathParts[1] || 'home';

    // LocalBusiness schema (always present)
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://www.shwakiglassworks.com/#business',
      name: getLocalizedText(BUSINESS_INFO.name, locale),
      alternateName: ['Shwaki Brothers Glassworks', 'אחים שוואקי זכוכית', 'شويكي اخوان للزوجاج'],
      description: locale === 'he' 
        ? 'מומחים להתקנת זכוכית בישראל - מקלחונים, מעקות זכוכית, מראות, חזיתות חנויות. מדידה חינם, אחריות שנתיים.'
        : 'Professional glass installation in Israel - shower enclosures, glass railings, mirrors, storefronts. Free measurement, 2-year warranty.',
      url: 'https://www.shwakiglassworks.com',
      telephone: CONTACT_INFO.phoneIntl,
      email: CONTACT_INFO.email,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IL',
        addressLocality: 'Israel',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 31.7683, // Israel center
        longitude: 35.2137,
      },
      areaServed: {
        '@type': 'Country',
        name: 'Israel',
      },
      priceRange: '₪₪',
      currenciesAccepted: 'ILS',
      paymentAccepted: 'Cash, Credit Card, Bank Transfer',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: '08:00',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Friday',
          opens: '08:00',
          closes: '13:00',
        },
      ],
      sameAs: [
        `https://wa.me/${CONTACT_INFO.whatsapp}`,
        'https://www.instagram.com/shwaki_glassworks/',
        'https://www.facebook.com/profile.php?id=100063765481345',
        'https://g.page/r/shwaki-glassworks',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Glass Installation Services',
        itemListElement: SERVICES.slice(0, 6).map((service, index) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: getLocalizedText(service.title, 'en'),
            description: getLocalizedText(service.description, 'en'),
          },
          position: index + 1,
        })),
      },
      image: [
        'https://www.shwakiglassworks.com/og-image.jpg',
      ],
      foundingDate: BUSINESS_INFO.established,
    };

    // FAQ schema (for home page and services page)
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_SCHEMA_DATA.map((faq) => ({
        '@type': 'Question',
        name: locale === 'he' || locale === 'ar' ? faq.question.he : faq.question.en,
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'he' || locale === 'ar' ? faq.answer.he : faq.answer.en,
        },
      })),
    };

    // WebSite schema
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Shwaki Brothers Glassworks',
      alternateName: 'אחים שוואקי זכוכית',
      url: 'https://www.shwakiglassworks.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.shwakiglassworks.com/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
      inLanguage: ['he', 'en', 'ar', 'ru'],
    };

    // BreadcrumbList schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: locale === 'he' ? 'בית' : 'Home',
          item: `https://www.shwakiglassworks.com/${locale}`,
        },
        ...(page !== 'home' ? [{
          '@type': 'ListItem',
          position: 2,
          name: page.charAt(0).toUpperCase() + page.slice(1),
          item: `https://www.shwakiglassworks.com/${locale}/${page}`,
        }] : []),
      ],
    };

    // Add LocalBusiness schema
    const businessScript = document.createElement('script');
    businessScript.type = 'application/ld+json';
    businessScript.textContent = JSON.stringify(localBusinessSchema);
    document.head.appendChild(businessScript);

    // Add WebSite schema
    const websiteScript = document.createElement('script');
    websiteScript.type = 'application/ld+json';
    websiteScript.textContent = JSON.stringify(websiteSchema);
    document.head.appendChild(websiteScript);

    // Add BreadcrumbList schema
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);

    // Add FAQ schema on home and services pages
    if (page === 'home' || page === 'services') {
      const faqScript = document.createElement('script');
      faqScript.type = 'application/ld+json';
      faqScript.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(faqScript);
    }

    // Cleanup
    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach((script) => script.remove());
    };
  }, [location.pathname, currentLanguage, locale]);

  return null;
};

export default JsonLdSchema;

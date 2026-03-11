/**
 * Location-Specific JSON-LD Schema Component
 * Generates LocalBusiness schema with city-specific areaServed
 * Optimized for local SEO: "זגג ירושלים", "glass installation Tel Aviv", etc.
 */

import { useEffect, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CONTACT_INFO, BUSINESS_INFO, SERVICES, getLocalizedText, type SupportedLocale } from '@/data';

// City geo coordinates
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  jerusalem: { lat: 31.7683, lng: 35.2137 },
  'tel-aviv': { lat: 32.0853, lng: 34.7818 },
  haifa: { lat: 32.7940, lng: 34.9896 },
  'beer-sheva': { lat: 31.2530, lng: 34.7915 },
};

// City names for schema
const CITY_NAMES: Record<string, Record<SupportedLocale, string>> = {
  jerusalem: {
    he: 'ירושלים',
    en: 'Jerusalem',
    ar: 'القدس',
    ru: 'Иерусалим',
  },
  'tel-aviv': {
    he: 'תל אביב',
    en: 'Tel Aviv',
    ar: 'تل أبيب',
    ru: 'Тель-Авив',
  },
  haifa: {
    he: 'חיפה',
    en: 'Haifa',
    ar: 'حيفا',
    ru: 'Хайфа',
  },
  'beer-sheva': {
    he: 'באר שבע',
    en: 'Beer Sheva',
    ar: 'بئر السبع',
    ru: 'Беэр-Шева',
  },
};

// Neighborhoods served per city
const CITY_NEIGHBORHOODS: Record<string, string[]> = {
  jerusalem: ['Ein Kerem', 'Talpiot', 'Katamon', 'German Colony', 'Beit HaKerem', 'Rehavia', 'Givat Ram', 'Malha'],
  'tel-aviv': ['Florentin', 'Neve Tzedek', 'Rothschild', 'Ramat Aviv', 'Jaffa', 'North Tel Aviv', 'Sarona', 'HaYarkon'],
  haifa: ['Carmel', 'Hadar', 'Neve Sha\'anan', 'Bat Galim', 'Kiryat Eliezer', 'Krayot', 'Nesher', 'Tirat Carmel'],
  'beer-sheva': ['Old City', 'Ramot', 'Neve Noy', 'Neve Ze\'ev', 'Omer', 'Meitar', 'Dimona', 'Arad'],
};

interface LocationJsonLdProps {
  city: string;
  cityName: string;
}

const LocationJsonLd: React.FC<LocationJsonLdProps> = ({ city, cityName }) => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  
  const coords = useMemo(() => CITY_COORDINATES[city] || CITY_COORDINATES['jerusalem'], [city]);
  const localizedCityName = useMemo(() => CITY_NAMES[city]?.[locale] || cityName, [city, locale, cityName]);
  const neighborhoods = useMemo(() => CITY_NEIGHBORHOODS[city] || [], [city]);

  useEffect(() => {
    // Remove existing location-specific JSON-LD scripts
    const existingScripts = document.querySelectorAll('script[data-location-schema="true"]');
    existingScripts.forEach((script) => script.remove());

    // LocalBusiness schema with city-specific areaServed
    const locationBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `https://shwakiglassworks.com/${locale}/${city}#business`,
      name: `${getLocalizedText(BUSINESS_INFO.name, locale)} - ${localizedCityName}`,
      alternateName: [
        `Shwaki Brothers Glassworks ${CITY_NAMES[city]?.en}`,
        `אחים שוואקי זכוכית ${CITY_NAMES[city]?.he}`,
        `شويكي اخوان للزوجاج ${CITY_NAMES[city]?.ar}`,
      ],
      description: locale === 'he'
        ? `שירותי התקנת זכוכית מקצועיים ב${localizedCityName} - מקלחונים, מעקות זכוכית, מראות, חזיתות. מדידה חינם, אחריות שנתיים.`
        : `Professional glass installation services in ${CITY_NAMES[city]?.en} - shower enclosures, glass railings, mirrors, storefronts. Free measurement, 2-year warranty.`,
      url: `https://shwakiglassworks.com/${locale}/${city}`,
      telephone: CONTACT_INFO.phoneIntl,
      email: CONTACT_INFO.email,
      address: {
        '@type': 'PostalAddress',
        addressLocality: CITY_NAMES[city]?.en || cityName,
        addressRegion: city === 'beer-sheva' ? 'Southern District' : city === 'haifa' ? 'Haifa District' : city === 'tel-aviv' ? 'Tel Aviv District' : 'Jerusalem District',
        addressCountry: 'IL',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: coords.lat,
        longitude: coords.lng,
      },
      areaServed: [
        {
          '@type': 'City',
          name: CITY_NAMES[city]?.en || cityName,
          '@id': `https://www.wikidata.org/wiki/${getWikidataId(city)}`,
        },
        ...neighborhoods.map(neighborhood => ({
          '@type': 'Place',
          name: neighborhood,
        })),
      ],
      serviceArea: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: coords.lat,
          longitude: coords.lng,
        },
        geoRadius: '50km',
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
        'https://www.instagram.com/shwakiglassworks/',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: locale === 'he' 
          ? `שירותי התקנת זכוכית ב${localizedCityName}` 
          : `Glass Installation Services in ${CITY_NAMES[city]?.en}`,
        itemListElement: SERVICES.slice(0, 6).map((service, index) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: getLocalizedText(service.title, 'en'),
            description: getLocalizedText(service.description, 'en'),
            areaServed: {
              '@type': 'City',
              name: CITY_NAMES[city]?.en || cityName,
            },
          },
          position: index + 1,
        })),
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: getReviewCount(city),
        bestRating: '5',
        worstRating: '1',
      },
      image: [
        'https://shwakiglassworks.com/og-image.jpg',
      ],
      foundingDate: BUSINESS_INFO.established,
    };

    // BreadcrumbList schema for location page
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: locale === 'he' ? 'בית' : 'Home',
          item: `https://shwakiglassworks.com/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: localizedCityName,
          item: `https://shwakiglassworks.com/${locale}/${city}`,
        },
      ],
    };

    // Service schema for each service in this location
    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Glass Installation',
      provider: {
        '@type': 'LocalBusiness',
        '@id': `https://shwakiglassworks.com/${locale}/${city}#business`,
        name: `${getLocalizedText(BUSINESS_INFO.name, locale)} - ${localizedCityName}`,
      },
      areaServed: {
        '@type': 'City',
        name: CITY_NAMES[city]?.en || cityName,
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Glass Installation Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Shower Enclosure Installation',
              description: 'Custom frameless and framed shower glass installation',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Glass Railing Installation',
              description: 'Balcony and staircase glass railing installation',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Mirror Installation',
              description: 'Custom mirror installation for bathrooms, gyms, and decorative purposes',
            },
          },
        ],
      },
    };

    // Add LocationBusiness schema
    const businessScript = document.createElement('script');
    businessScript.type = 'application/ld+json';
    businessScript.setAttribute('data-location-schema', 'true');
    businessScript.textContent = JSON.stringify(locationBusinessSchema);
    document.head.appendChild(businessScript);

    // Add Breadcrumb schema
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.setAttribute('data-location-schema', 'true');
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);

    // Add Service schema
    const serviceScript = document.createElement('script');
    serviceScript.type = 'application/ld+json';
    serviceScript.setAttribute('data-location-schema', 'true');
    serviceScript.textContent = JSON.stringify(serviceSchema);
    document.head.appendChild(serviceScript);

    // Cleanup
    return () => {
      const scripts = document.querySelectorAll('script[data-location-schema="true"]');
      scripts.forEach((script) => script.remove());
    };
  }, [city, cityName, locale, localizedCityName, coords, neighborhoods]);

  return null;
};

// Helper to get Wikidata IDs for cities
function getWikidataId(city: string): string {
  const ids: Record<string, string> = {
    jerusalem: 'Q1218',
    'tel-aviv': 'Q33935',
    haifa: 'Q41621',
    'beer-sheva': 'Q165305',
  };
  return ids[city] || 'Q801';
}

// Helper to get approximate review count per city
function getReviewCount(city: string): string {
  const counts: Record<string, string> = {
    jerusalem: '45',
    'tel-aviv': '62',
    haifa: '28',
    'beer-sheva': '20',
  };
  return counts[city] || '30';
}

export default LocationJsonLd;

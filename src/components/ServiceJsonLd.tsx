import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  BUSINESS_INFO,
  LOCATION_SEO_LINKS,
  getLocalizedText,
  getLocalizedArray,
  CONTACT_INFO,
  type ServiceSeoPage,
  type SupportedLocale,
} from '@/data';

interface ServiceJsonLdProps {
  service: ServiceSeoPage;
  locale: SupportedLocale;
}

const BASE_URL = 'https://www.shwakiglass.co.il';

const ServiceJsonLd: React.FC<ServiceJsonLdProps> = ({ service, locale }) => {
  const location = useLocation();

  useEffect(() => {
    const existingScripts = document.querySelectorAll('script[data-service-schema="true"]');
    existingScripts.forEach((script) => script.remove());

    const currentUrl = `${BASE_URL}${location.pathname}`;
    const serviceName = getLocalizedText(service.heroTitle, locale);
    const serviceDescription = getLocalizedText(service.metaDescription, locale);
    const areaServed = service.relatedLocations
      .map((slug) => LOCATION_SEO_LINKS.find((locationLink) => locationLink.slug === slug))
      .filter(Boolean)
      .map((locationLink) => ({
        '@type': 'City',
        name: getLocalizedText(locationLink!.label, locale),
        url: `${BASE_URL}/${locale}/glass-installation-${locationLink!.slug}`,
      }));

    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${currentUrl}#service`,
      name: serviceName,
      description: serviceDescription,
      serviceType: getLocalizedText(service.heroTitle, 'en'),
      areaServed,
      provider: {
        '@type': 'LocalBusiness',
        '@id': `${BASE_URL}/#business`,
        name: getLocalizedText(BUSINESS_INFO.name, locale),
        telephone: CONTACT_INFO.phoneIntl,
        areaServed: {
          '@type': 'Country',
          name: 'Israel',
        },
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: serviceName,
        itemListElement: getLocalizedArray(service.highlights, locale).map((feature, index) => ({
          '@type': 'Offer',
          position: index + 1,
          itemOffered: {
            '@type': 'Service',
            name: feature,
          },
        })),
      },
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: locale === 'he' ? 'בית' : 'Home',
          item: `${BASE_URL}/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: locale === 'he' ? 'שירותים' : 'Services',
          item: `${BASE_URL}/${locale}/services`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: serviceName,
          item: currentUrl,
        },
      ],
    };

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: service.faqs.map((faq) => ({
        '@type': 'Question',
        name: getLocalizedText(faq.question, locale),
        acceptedAnswer: {
          '@type': 'Answer',
          text: getLocalizedText(faq.answer, locale),
        },
      })),
    };

    [serviceSchema, breadcrumbSchema, faqSchema].forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-service-schema', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      const scripts = document.querySelectorAll('script[data-service-schema="true"]');
      scripts.forEach((script) => script.remove());
    };
  }, [location.pathname, locale, service]);

  return null;
};

export default ServiceJsonLd;

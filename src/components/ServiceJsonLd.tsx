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

const BASE_URL = 'https://www.shwakiglassworks.com';

const ServiceJsonLd: React.FC<ServiceJsonLdProps> = ({ service, locale }) => {
  const location = useLocation();

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

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};

export default ServiceJsonLd;

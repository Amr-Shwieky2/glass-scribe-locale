import { BUSINESS_INFO } from '@/data/business-info';
import { LOCATION_SEO_LINKS, type ServiceSeoPage } from '@/data/service-seo-content';
import { getLocalizedText, getLocalizedArray } from '@/data/helpers';
import { CONTACT_INFO } from '@/data/contact';
import type { SupportedLocale } from '@/data/types';

import { SITE_URL as BASE_URL, pageUrl } from '@/data/seo';
import { BUSINESS_ID } from './JsonLdSchema';

interface ServiceJsonLdProps {
  service: ServiceSeoPage;
  locale: SupportedLocale;
}

/** Server Component — Service, Breadcrumb and FAQPage schemas for a service landing page. */
const ServiceJsonLd: React.FC<ServiceJsonLdProps> = ({ service, locale }) => {
  const currentUrl = pageUrl(locale, `/${service.slug}`);
  const serviceName = getLocalizedText(service.heroTitle, locale);
  const serviceDescription = getLocalizedText(service.metaDescription, locale);
  const areaServed = service.relatedLocations
    .map((slug) => LOCATION_SEO_LINKS.find((locationLink) => locationLink.slug === slug))
    .filter(Boolean)
    .map((locationLink) => ({
      '@type': 'City',
      name: getLocalizedText(locationLink!.label, locale),
      url: pageUrl(locale, `/${locationLink!.slug}`),
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
      '@id': BUSINESS_ID,
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
};

export default ServiceJsonLd;

export { type SupportedLocale, type LocalizedText, type LocalizedArray } from './types';
export { getLocalizedText, getLocalizedArray } from './helpers';
export { BUSINESS_INFO } from './business-info';
export { CONTACT_INFO } from './contact';
export { type ServiceData, SERVICES } from './services';
export { type TestimonialData, TESTIMONIALS } from './testimonials';
export { type WhyChooseUsItem, WHY_CHOOSE_US } from './why-choose-us';
export { PAGE_CONTENT } from './page-content';
export { NAVIGATION } from './navigation';
export { FOOTER_CONTENT } from './footer';
export { UI_STRINGS } from './ui-strings';
export { PROJECT_CATEGORIES, type ProjectCategory } from './project-categories';
export {
  LOCATION_SEO_ALIAS_PREFIX,
  LOCATION_SEO_LINKS,
  SERVICE_SEO_PAGES,
  SERVICE_SEO_SECTION_TITLES,
  type SeoLocationLink,
  type ServiceSeoFaq,
  type ServiceSeoPage,
  getLocationPageHref,
  getLocationSeoSegment,
  getServicePageHref,
  getServiceSeoPageByProjectCategoryId,
  getServiceSeoPageByServiceId,
  getServiceSeoPageBySlug,
  normalizeLocationSeoSlug,
} from './service-seo-content';

/**
 * Strapi Index
 * Central export for all Strapi functionality
 */

// Client
export { strapiClient, getStrapiImageUrl, getStrapiImageFormat, checkStrapiConnection } from './client';

// Utilities
export {
  getImageUrl,
  getImageFormat,
  getImageAlt,
  getGalleryImages,
  getImageSrcSet,
  getImageProps,
  extractPlainText,
  truncateText,
  getExcerpt,
} from './utils';

// API Functions
export {
  getSiteSettings,
  getHomePage,
  getContactPage,
  getServices,
  getServiceBySlug,
  getProjects,
  getProjectsByCategory,
  getProjectCategories,
  getFeaturedProjects,
  getProcessSteps,
} from './api';

// React Query Hooks
export {
  useSiteSettings,
  useHomePage,
  useContactPage,
  useServices,
  useService,
  useProjects,
  useFeaturedProjects,
  useProjectsByCategory,
  useProjectCategories,
  useProcessSteps,
} from './hooks';

// Types
export type {
  StrapiResponse,
  StrapiImage,
  ImageFormat,
  StrapiPagination,
  SiteSettings,
  HomePage,
  ContactPage,
  Service,
  Project,
  ProjectCategory,
  ProcessStep,
} from './types';

// Query Helpers
export {
  buildPopulateQuery,
  buildDeepPopulate,
  buildLocaleFilter,
  buildSort,
  buildPagination,
  buildFilters,
  combineParams,
  POPULATE_PATTERNS,
} from './queries';

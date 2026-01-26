/**
 * Strapi API Response Types (v4 - New Format)
 */

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: StrapiPagination;
  };
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    large?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    thumbnail?: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: unknown | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Site Settings (Single Type)
export interface SiteSettings {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  siteName: string;
  brandPrimary: string;
  brandSecondary: string;
  brandAccent: string;
  phone: string;
  whatsApp: string;
  email: string;
  footerText: string | null;
  globalCtaText: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  logo: StrapiImage;
  ogImage: StrapiImage | null;
}

// Service
export interface Service {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  icon: StrapiImage;
  coverImage: StrapiImage;
  gallery: StrapiImage[];
}

// Project Category
export interface ProjectCategory {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  project?: Project[];
}

// Project
export interface Project {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string | null;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  coverImage: StrapiImage;
  gallery: StrapiImage[];
  category: ProjectCategory;
}

// Process Step
export interface ProcessStep {
  id: number;
  documentId: string;
  stepNumber: number;
  title: string;
  description: Array<{
    type: string;
    children: Array<{
      text: string;
      type: string;
    }>;
  }>;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  icon: StrapiImage;
}

// Home Page (Single Type)
export interface HomePage {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: StrapiImage;
  primaryCtaText: string;
  secondaryCtaText: string;
  servicesSectionTitle: string;
  featuredProjectsSectionTitle: string;
}

// Contact Page (Single Type)
export interface ContactPage {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  pageTitle: string;
  description: string;
  openingHours: string;
  serviceAreas: string;
  addressText: string;
  mapEmbedUrl: string;
}

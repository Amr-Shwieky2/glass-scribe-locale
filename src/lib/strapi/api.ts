/**
 * Strapi API Functions
 * High-level API functions for fetching data from Strapi
 */

import { strapiClient } from './client';
import {
  combineParams,
  buildLocaleFilter,
  buildSort,
  buildPagination,
  buildFilters,
} from './queries';
import type {
  StrapiResponse,
  StrapiPagination,
  SiteSettings,
  HomePage,
  ContactPage,
  Service,
  Project,
  ProjectCategory,
  ProcessStep,
} from './types';

/**
 * Get site settings (Single Type - no locale filter needed)
 */
export async function getSiteSettings(locale: string = 'en'): Promise<SiteSettings | null> {
  try {
    const response = await strapiClient<StrapiResponse<SiteSettings>>(
      '/site-setting',
      {
        params: { populate: '*' },
      }
    );
    
    return response.data || null;
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    return null;
  }
}

/**
 * Get home page content (Single Type)
 */
export async function getHomePage(locale: string = 'en'): Promise<HomePage | null> {
  try {
    const response = await strapiClient<StrapiResponse<HomePage>>(
      '/home-page',
      {
        params: { populate: '*' },
      }
    );
    
    return response.data || null;
  } catch (error) {
    console.error('Failed to fetch home page:', error);
    return null;
  }
}

/**
 * Get contact page content (Single Type)
 */
export async function getContactPage(locale: string = 'en'): Promise<ContactPage | null> {
  try {
    const response = await strapiClient<StrapiResponse<ContactPage>>(
      '/contact-page',
      {
        params: combineParams(
          buildLocaleFilter(locale),
          { populate: '*' }
        ),
      }
    );
    
    return response.data || null;
  } catch (error) {
    console.error('Failed to fetch contact page:', error);
    return null;
  }
}

/**
 * Get all services
 */
export async function getServices(locale: string = 'en'): Promise<Service[]> {
  try {
    const response = await strapiClient<StrapiResponse<Service[]>>(
      '/services',
      {
        params: combineParams(
          buildLocaleFilter(locale),
          buildSort('order', 'asc'),
          { populate: '*' },
          { 'filters[isActive][$eq]': 'true' }
        ),
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return [];
  }
}

/**
 * Get single service by slug
 */
export async function getServiceBySlug(
  slug: string,
  locale: string = 'en'
): Promise<Service | null> {
  try {
    const response = await strapiClient<StrapiResponse<Service[]>>(
      '/services',
      {
        params: combineParams(
          buildLocaleFilter(locale),
          buildFilters({ slug }),
          { populate: '*' }
        ),
      }
    );

    return response.data?.[0] || null;
  } catch (error) {
    console.error('Failed to fetch service:', error);
    return null;
  }
}

/**
 * Get all project categories
 */
export async function getProjectCategories(locale: string = 'en'): Promise<ProjectCategory[]> {
  try {
    const response = await strapiClient<StrapiResponse<ProjectCategory[]>>(
      '/project-categories',
      {
        params: combineParams(
          buildLocaleFilter(locale),
          buildSort('order', 'asc'),
          { populate: '*' },
          { 'filters[isActive][$eq]': 'true' }
        ),
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch project categories:', error);
    return [];
  }
}

/**
 * Get all projects
 */
export async function getProjects(
  locale: string = 'en',
  page: number = 1,
  pageSize: number = 50
): Promise<{ projects: Project[]; pagination: StrapiPagination | undefined }> {
  try {
    const response = await strapiClient<StrapiResponse<Project[]>>(
      '/projects',
      {
        params: combineParams(
          buildLocaleFilter(locale),
          buildSort('order', 'asc'),
          buildPagination(page, pageSize),
          { populate: '*' }
        ),
      }
    );
    
    return {
      projects: response.data || [],
      pagination: response.meta?.pagination,
    };
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return { projects: [], pagination: undefined };
  }
}

/**
 * Get projects by category
 */
export async function getProjectsByCategory(
  categorySlug: string,
  locale: string = 'en'
): Promise<Project[]> {
  try {
    const response = await strapiClient<StrapiResponse<Project[]>>(
      '/projects',
      {
        params: combineParams(
          buildLocaleFilter(locale),
          buildSort('order', 'asc'),
          { 'filters[category][slug][$eq]': categorySlug },
          { populate: '*' }
        ),
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch projects by category:', error);
    return [];
  }
}

/**
 * Get single project by slug
 */
export async function getProjectBySlug(
  slug: string,
  locale: string = 'en'
): Promise<Project | null> {
  try {
    const response = await strapiClient<StrapiResponse<Project[]>>(
      '/projects',
      {
        params: combineParams(
          buildLocaleFilter(locale),
          buildFilters({ slug }),
          { populate: '*' }
        ),
      }
    );

    return response.data?.[0] || null;
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return null;
  }
}

/**
 * Get featured projects only
 */
export async function getFeaturedProjects(
  locale: string = 'en',
  limit: number = 6
): Promise<Project[]> {
  try {
    const response = await strapiClient<StrapiResponse<Project[]>>(
      '/projects',
      {
        params: combineParams(
          buildLocaleFilter(locale),
          buildSort('order', 'asc'),
          buildPagination(1, limit),
          { 'filters[isFeatured][$eq]': 'true' },
          { populate: '*' }
        ),
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch featured projects:', error);
    return [];
  }
}

/**
 * Get all process steps
 */
export async function getProcessSteps(locale: string = 'en'): Promise<ProcessStep[]> {
  try {
    const response = await strapiClient<StrapiResponse<ProcessStep[]>>(
      '/process-steps',
      {
        params: combineParams(
          buildLocaleFilter(locale),
          buildSort('stepNumber', 'asc'),
          { 'filters[isActive][$eq]': 'true' },
          { populate: '*' }
        ),
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch process steps:', error);
    return [];
  }
}

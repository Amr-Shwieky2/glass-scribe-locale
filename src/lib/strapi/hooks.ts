/**
 * React Query Hooks for Strapi Data
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import {
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
import type {
  SiteSettings,
  HomePage,
  ContactPage,
  Service,
  Project,
  ProjectCategory,
  ProcessStep,
  StrapiPagination,
} from './types';

/**
 * Hook to fetch site settings
 * Cached globally with long stale time
 */
export function useSiteSettings(): UseQueryResult<SiteSettings | null> {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: ['siteSettings', currentLanguage],
    queryFn: () => getSiteSettings(currentLanguage),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
}

/**
 * Hook to fetch home page content
 */
export function useHomePage(): UseQueryResult<HomePage | null> {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: ['homePage', currentLanguage],
    queryFn: () => getHomePage(currentLanguage),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook to fetch contact page content
 */
export function useContactPage(): UseQueryResult<ContactPage | null> {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: ['contactPage', currentLanguage],
    queryFn: () => getContactPage(currentLanguage),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook to fetch services
 */
export function useServices(): UseQueryResult<Service[]> {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: ['services', currentLanguage],
    queryFn: () => getServices(currentLanguage),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to fetch single service by slug
 */
export function useService(slug: string): UseQueryResult<Service | null> {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: ['service', slug, currentLanguage],
    queryFn: () => getServiceBySlug(slug, currentLanguage),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook to fetch project categories
 */
export function useProjectCategories(): UseQueryResult<ProjectCategory[]> {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: ['projectCategories', currentLanguage],
    queryFn: () => getProjectCategories(currentLanguage),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook to fetch all projects
 */
export function useProjects(
  page: number = 1,
  pageSize: number = 50
): UseQueryResult<{ projects: Project[]; pagination: StrapiPagination | undefined }> {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: ['projects', currentLanguage, page, pageSize],
    queryFn: () => getProjects(currentLanguage, page, pageSize),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook to fetch featured projects
 */
export function useFeaturedProjects(limit: number = 6): UseQueryResult<Project[]> {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: ['projects', 'featured', currentLanguage, limit],
    queryFn: () => getFeaturedProjects(currentLanguage, limit),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook to fetch projects by category
 */
export function useProjectsByCategory(categorySlug: string): UseQueryResult<Project[]> {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: ['projects', 'category', categorySlug, currentLanguage],
    queryFn: () => getProjectsByCategory(categorySlug, currentLanguage),
    enabled: !!categorySlug,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook to fetch process steps
 */
export function useProcessSteps(): UseQueryResult<ProcessStep[]> {
  const { currentLanguage } = useLanguage();
  
  return useQuery({
    queryKey: ['processSteps', currentLanguage],
    queryFn: () => getProcessSteps(currentLanguage),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}

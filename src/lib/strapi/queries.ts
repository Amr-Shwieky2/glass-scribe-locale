/**
 * Strapi Query Helpers
 * Helper functions to build populate and filter queries
 */

/**
 * Build populate query for deep relations
 */
export function buildPopulateQuery(fields: string[]): Record<string, string> {
  const params: Record<string, string> = {};
  fields.forEach((field, index) => {
    params[`populate[${index}]`] = field;
  });
  return params;
}

/**
 * Build deep populate for nested relations
 */
export function buildDeepPopulate(structure: Record<string, unknown>): string {
  return JSON.stringify(structure);
}

/**
 * Common populate patterns
 */
export const POPULATE_PATTERNS = {
  // Populate single image
  image: {
    populate: '*',
  },
  
  // Populate gallery
  gallery: {
    populate: {
      gallery: {
        populate: '*',
      },
    },
  },
  
  // Populate service with images
  service: {
    populate: {
      coverImage: {
        populate: '*',
      },
      gallery: {
        populate: '*',
      },
    },
  },
  
  // Populate project with category and images
  project: {
    populate: {
      coverImage: {
        populate: '*',
      },
      gallery: {
        populate: '*',
      },
      category: {
        populate: '*',
      },
    },
  },
  
  // Populate site settings
  siteSettings: {
    populate: {
      logo: {
        populate: '*',
      },
      socialMedia: {
        populate: '*',
      },
    },
  },
};

/**
 * Build locale filter
 */
export function buildLocaleFilter(locale: string): Record<string, string> {
  return {
    'locale': locale,
  };
}

/**
 * Build sort query
 */
export function buildSort(field: string, order: 'asc' | 'desc' = 'asc'): Record<string, string> {
  return {
    'sort': `${field}:${order}`,
  };
}

/**
 * Build pagination query
 */
export function buildPagination(page: number = 1, pageSize: number = 25): Record<string, string> {
  return {
    'pagination[page]': String(page),
    'pagination[pageSize]': String(pageSize),
  };
}

/**
 * Build filters query
 */
export function buildFilters(filters: Record<string, string | number | boolean>): Record<string, string> {
  const params: Record<string, string> = {};
  Object.entries(filters).forEach(([key, value]) => {
    params[`filters[${key}][$eq]`] = String(value);
  });
  return params;
}

/**
 * Combine multiple query params
 */
export function combineParams(...paramObjects: Record<string, string>[]): Record<string, string> {
  return Object.assign({}, ...paramObjects);
}

/**
 * Environment Variable Validation
 * Validates required environment variables at application startup
 */

interface EnvConfig {
  STRAPI_URL: string;
  STRAPI_TOKEN: string;
}

/**
 * Validates and returns required environment variables
 * Throws error if any required variable is missing
 */
export function validateEnv(): EnvConfig {
  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
  const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN;

  const missing: string[] = [];

  if (!STRAPI_URL) {
    missing.push('VITE_STRAPI_URL');
  }

  if (!STRAPI_TOKEN) {
    missing.push('VITE_STRAPI_TOKEN');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n\n` +
      'Please create a .env file in the project root with:\n' +
      missing.map(key => `${key}=<your_value>`).join('\n') +
      '\n\nSee .env.example for reference.'
    );
  }

  return {
    STRAPI_URL,
    STRAPI_TOKEN,
  };
}

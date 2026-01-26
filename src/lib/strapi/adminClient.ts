import { StrapiError } from './client';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

type AdminRequestOptions = {
  token: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
};

function buildUrl(path: string, params?: AdminRequestOptions['params']): string {
  const url = new URL(`/api${path}`, STRAPI_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) return;
      url.searchParams.append(key, String(value));
    });
  }
  return url.toString();
}

export async function adminRequest<T>(path: string, options: AdminRequestOptions): Promise<T> {
  const url = buildUrl(path, options.params);

  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${options.token}`,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const json = await response.json().catch(() => ({}));

  const errorMessage = (() => {
    if (!json || typeof json !== 'object') return undefined;
    const obj = json as Record<string, unknown>;
    const err = obj.error as Record<string, unknown> | undefined;
    const message = err?.message;
    return typeof message === 'string' ? message : undefined;
  })();

  if (!response.ok) {
    throw new StrapiError(
      errorMessage || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      json
    );
  }

  return json as T;
}

export function stripSystemFields<T extends Record<string, unknown>>(value: T): T {
  const {
    id,
    documentId,
    createdAt,
    updatedAt,
    publishedAt,
    ...rest
  } = value;
  return rest as T;
}

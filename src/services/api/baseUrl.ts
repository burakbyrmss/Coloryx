import { API_BASE_URL as ENV_API_BASE_URL } from '@env';

const FALLBACK_API_BASE_URL = 'https://coloryx-test.utilizing.work';

export const API_BASE_URL = ENV_API_BASE_URL || FALLBACK_API_BASE_URL;

export function buildApiUrl(inputUrl: string): string {
  // React Native's URL handling can be inconsistent for relative paths.
  // For OpenAPI-generated clients we almost always receive a path like `/ping`
  // so we build it deterministically.
  const base = API_BASE_URL.replace(/\/+$/, '');

  if (inputUrl.startsWith('/')) {
    return `${base}${inputUrl}`;
  }

  try {
    const url = new URL(inputUrl);
    return `${base}${url.pathname}${url.search}`;
  } catch {
    const normalizedPath = inputUrl.startsWith('/') ? inputUrl : `/${inputUrl}`;
    return `${base}${normalizedPath}`;
  }
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit & { locale?: string; useLocalePrefix?: boolean } = {}
): Promise<T | null> {
  const { locale = DEFAULT_LOCALE, useLocalePrefix = true, ...fetchOptions } = options;

  let path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (useLocalePrefix && !path.startsWith(`/${locale}/`)) {
    path = `/${locale}${path}`;
  }

  const url = `${API_BASE_URL}${path}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...fetchOptions.headers,
      },
      next: { revalidate: 60 },
      ...fetchOptions,
    });

    if (!res.ok) {
      console.warn(`[API Client Warning] Failed request to ${url} (Status: ${res.status})`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(`[API Client Error] Network or parse failure at ${url}:`, error);
    return null;
  }
}

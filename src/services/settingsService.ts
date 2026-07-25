import { fetchApi } from './apiClient';
import { SiteSettings, AdsManagerCredentials, ThemeOptions } from '@/types/settings';
import { ApiResponse } from '@/types/api';

export async function getSiteSettings(locale = 'en'): Promise<SiteSettings | null> {
  const response = await fetchApi<ApiResponse<SiteSettings>>('/site-settings', { locale, useLocalePrefix: true });
  return response?.data || null;
}

export async function getThemeOptions(locale = 'en'): Promise<ThemeOptions | null> {
  const response = await fetchApi<ApiResponse<ThemeOptions> | ThemeOptions>('/theme-options', { locale, useLocalePrefix: true });
  if (!response) return null;
  return (response as ApiResponse<ThemeOptions>).data || (response as ThemeOptions);
}

export async function getAdsManagerCredentials(): Promise<AdsManagerCredentials | null> {
  const response = await fetchApi<AdsManagerCredentials>('/ads-manager-credentials', { useLocalePrefix: false });
  return response || null;
}

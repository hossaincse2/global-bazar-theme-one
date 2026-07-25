import { fetchApi } from './apiClient';
import { SiteSettings, AdsManagerCredentials } from '@/types/settings';
import { ApiResponse } from '@/types/api';

export async function getSiteSettings(locale = 'en'): Promise<SiteSettings | null> {
  const response = await fetchApi<ApiResponse<SiteSettings>>('/site-settings', { locale, useLocalePrefix: true });
  return response?.data || null;
}

export async function getAdsManagerCredentials(): Promise<AdsManagerCredentials | null> {
  const response = await fetchApi<AdsManagerCredentials>('/ads-manager-credentials', { useLocalePrefix: false });
  return response || null;
}

import { fetchApi } from './apiClient';
import { CmsBlock } from '@/types/cms';
import { ApiResponse } from '@/types/api';

export interface HeaderMenuItem {
  title: string;
  url: string;
  badge?: string;
}

export interface FooterMenuColumn {
  column_title: string;
  links: { title: string; url: string }[];
}

export interface StoreMenusResponse {
  header_menu: HeaderMenuItem[];
  footer_menu: FooterMenuColumn[];
}

export async function getCmsBlocks(locale = 'en', isCommon?: number): Promise<CmsBlock[]> {
  const queryParam = isCommon !== undefined ? `?is_common=${isCommon}` : '';
  const response = await fetchApi<ApiResponse<CmsBlock[]>>(`/cms-blocks${queryParam}`, { locale, useLocalePrefix: true });
  return response?.data || [];
}

export async function getCmsBlockByKey(key: string, locale = 'en'): Promise<CmsBlock | null> {
  const response = await fetchApi<ApiResponse<CmsBlock>>(`/cms-blocks/${key}`, { locale, useLocalePrefix: true });
  return response?.data || null;
}

export async function getCmsBlocksByKeys(keys: string[], locale = 'en'): Promise<Record<string, CmsBlock>> {
  const keysStr = keys.join(',');
  const response = await fetchApi<ApiResponse<Record<string, CmsBlock>>>(`/cms-blocks/by-keys?keys=${keysStr}`, { locale, useLocalePrefix: true });
  return response?.data || {};
}

export async function getStoreMenus(locale = 'en'): Promise<StoreMenusResponse> {
  const response = await fetchApi<ApiResponse<StoreMenusResponse>>('/menus', { locale, useLocalePrefix: true });
  return response?.data || { header_menu: [], footer_menu: [] };
}

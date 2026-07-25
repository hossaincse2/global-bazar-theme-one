import { fetchApi } from './apiClient';
import { Category, Brand } from '@/types/product';
import { ApiResponse, PaginatedResponse } from '@/types/api';

export async function getAllCategories(locale = 'en', featured = false, isMenuShow = true): Promise<Category[]> {
  const query = new URLSearchParams();
  if (featured) query.append('featured', 'true');
  if (isMenuShow) query.append('is_menu_show', 'true');

  const response = await fetchApi<PaginatedResponse<Category> | ApiResponse<Category[]>>(`/categories?${query.toString()}`, { locale, useLocalePrefix: true });

  if (!response) return [];
  if (Array.isArray((response as ApiResponse<Category[]>).data)) {
    return (response as ApiResponse<Category[]>).data;
  }
  return (response as PaginatedResponse<Category>).data || [];
}

export async function getAllBrands(locale = 'en'): Promise<Brand[]> {
  const response = await fetchApi<ApiResponse<Brand[]>>('/brands', { locale, useLocalePrefix: true });
  return response?.data || [];
}

import { fetchApi } from './apiClient';
import { Product, CouponCode, ProductVariant } from '@/types/product';
import { HeroImage } from '@/types/settings';
import { ApiResponse, PaginatedResponse } from '@/types/api';

export async function getHeroImages(): Promise<HeroImage[]> {
  const response = await fetchApi<ApiResponse<HeroImage[]>>('/hero-images', { useLocalePrefix: false });
  return response?.data || [];
}

export async function getAllProducts(
  params: {
    locale?: string;
    perPage?: number;
    search?: string;
    category?: string;
    brand_id?: number;
    sort_by?: 'new_arrival' | 'best_selling' | 'discount';
    min_price?: number;
    max_price?: number;
  } = {}
): Promise<PaginatedResponse<Product> | null> {
  const { locale = 'en', perPage = 12, search, category, brand_id, sort_by, min_price, max_price } = params;
  
  const query = new URLSearchParams();
  query.append('perPage', perPage.toString());
  if (search) query.append('search', search);
  if (category) query.append('category', category);
  if (brand_id) query.append('brand_id', brand_id.toString());
  if (sort_by) query.append('sort_by', sort_by);
  if (min_price) query.append('min_price', min_price.toString());
  if (max_price) query.append('max_price', max_price.toString());

  const response = await fetchApi<PaginatedResponse<Product>>(`/products?${query.toString()}`, { locale, useLocalePrefix: true });
  return response;
}

export async function getCategoryWiseProducts(locale = 'en', category?: string): Promise<Product[]> {
  const queryParam = category ? `?category=${encodeURIComponent(category)}` : '';
  const response = await fetchApi<ApiResponse<Product[]>>(`/category-wise-products${queryParam}`, { locale, useLocalePrefix: true });
  return response?.data || [];
}

export async function getSingleProduct(slug: string, locale = 'en'): Promise<Product | null> {
  const response = await fetchApi<ApiResponse<Product>>(`/product/${slug}`, { locale, useLocalePrefix: true });
  return response?.data || null;
}

export async function getProductVariants(productId: number, attribute1?: string, attribute2?: string): Promise<{ stock: number } | null> {
  const query = new URLSearchParams();
  if (attribute1) query.append('attribute_1', attribute1);
  if (attribute2) query.append('attribute_2', attribute2);

  const response = await fetchApi<{ stock: number }>(`/product/${productId}/variants?${query.toString()}`, { useLocalePrefix: false });
  return response;
}

export async function getCouponCode(): Promise<CouponCode | null> {
  const response = await fetchApi<CouponCode>('/coupon-code', { useLocalePrefix: false });
  return response || null;
}

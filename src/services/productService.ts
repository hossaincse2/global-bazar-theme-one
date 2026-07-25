import { fetchApi } from './apiClient';
import { Product, CouponCode, ProductDetailData } from '@/types/product';
import { HeroImage } from '@/types/settings';
import { ApiResponse, PaginatedResponse } from '@/types/api';

export async function getHeroImages(): Promise<HeroImage[]> {
  const response = await fetchApi<ApiResponse<HeroImage[]>>('/hero-images', { useLocalePrefix: false });
  return response?.data || [];
}

export async function getAllProducts(
  params: {
    locale?: string;
    page?: number;
    perPage?: number;
    search?: string;
    category?: string;
    sub_category?: string;
    brand_id?: string | number;
    sort_by?: string;
    business_category?: string;
    min_price?: number;
    max_price?: number;
  } = {}
): Promise<PaginatedResponse<Product> | null> {
  const {
    locale = 'en',
    page = 1,
    perPage = 12,
    search = '',
    category = 'all',
    sub_category = '',
    brand_id = 'all',
    sort_by = 'all',
    business_category = 'default',
    min_price,
    max_price,
  } = params;

  const query = new URLSearchParams();
  query.append('search', search);
  query.append('category', category);
  query.append('sub_category', sub_category);
  query.append('page', page.toString());
  query.append('perPage', perPage.toString());
  query.append('sort_by', sort_by);
  query.append('brand_id', brand_id.toString());
  query.append('business_category', business_category);

  if (min_price !== undefined) query.append('min_price', min_price.toString());
  if (max_price !== undefined) query.append('max_price', max_price.toString());

  const response = await fetchApi<PaginatedResponse<Product>>(`/products?${query.toString()}`, { locale, useLocalePrefix: true });
  return response;
}

export async function getCategoryWiseProducts(locale = 'en', category?: string): Promise<Product[]> {
  const queryParam = category ? `?category=${encodeURIComponent(category)}` : '';
  const response = await fetchApi<ApiResponse<Product[]>>(`/category-wise-products${queryParam}`, { locale, useLocalePrefix: true });
  return response?.data || [];
}

export async function getSingleProduct(slug: string, locale = 'en'): Promise<ProductDetailData | null> {
  let response = await fetchApi<ApiResponse<ProductDetailData>>(`/product/${slug}`, { locale, useLocalePrefix: true });
  if (!response?.data && locale !== 'bn') {
    response = await fetchApi<ApiResponse<ProductDetailData>>(`/product/${slug}`, { locale: 'bn', useLocalePrefix: true });
  }
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

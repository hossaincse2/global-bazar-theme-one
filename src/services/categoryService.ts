import { fetchApi } from './apiClient';
import { Category, Brand } from '@/types/product';
import { ApiResponse, PaginatedResponse } from '@/types/api';

const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 4,
    name: "Electric",
    slug: "electric",
    content: null,
    is_featured: true,
    total_products: "1",
    category_image: "https://admin.karbar.shop/storage/160/package-box.png",
    sub_category: []
  },
  {
    id: 5,
    name: "Polo Shirts",
    slug: "polo-shirts",
    content: null,
    is_featured: true,
    total_products: "5",
    category_image: "https://admin.karbar.shop/storage/161/polo-shirt-(1).png",
    sub_category: []
  },
  {
    id: 6,
    name: "Accessories",
    slug: "accessories",
    content: null,
    is_featured: true,
    total_products: "6",
    category_image: "https://admin.karbar.shop/storage/162/kitchen.png",
    sub_category: [
      { id: 11, name: "Clock", slug: "clock", is_featured: true },
      { id: 16, name: "Mobile", slug: "mobile", is_featured: true }
    ]
  },
  {
    id: 7,
    name: "Home Decor Item",
    slug: "home-decor-item",
    content: null,
    is_featured: true,
    total_products: "5",
    category_image: "https://admin.karbar.shop/storage/163/interior-design.png",
    sub_category: []
  },
  {
    id: 8,
    name: "Gadget",
    slug: "gadget",
    content: null,
    is_featured: true,
    total_products: "0",
    category_image: "https://admin.karbar.shop/storage/169/gadget.png",
    sub_category: []
  },
  {
    id: 9,
    name: "Travel Item",
    slug: "travel-item",
    content: null,
    is_featured: true,
    total_products: "1",
    category_image: "https://admin.karbar.shop/storage/168/lost-items.png",
    sub_category: []
  },
  {
    id: 10,
    name: "Computer Accessories",
    slug: "computer-accessories",
    content: null,
    is_featured: true,
    total_products: "0",
    category_image: "https://admin.karbar.shop/storage/175/computer.png",
    sub_category: []
  },
  {
    id: 12,
    name: "Foodie",
    slug: "foodie",
    content: null,
    is_featured: true,
    total_products: "0",
    category_image: "https://admin.karbar.shop/storage/171/foodie.png",
    sub_category: []
  },
  {
    id: 13,
    name: "Electronics",
    slug: "electronics",
    content: null,
    is_featured: true,
    total_products: "11",
    category_image: "https://admin.karbar.shop/storage/172/electronic-devices.png",
    sub_category: []
  },
  {
    id: 18,
    name: "Television",
    slug: "television",
    content: null,
    is_featured: true,
    total_products: "1",
    category_image: "https://admin.karbar.shop/storage/173/smart-tv.png",
    sub_category: []
  }
];

export async function getApiCategories(
  params: {
    locale?: string;
    business_category?: string;
    featured?: boolean;
    most_sub_cat?: boolean;
    is_menu_show?: boolean;
  } = {}
): Promise<Category[]> {
  const {
    locale = 'bn',
    business_category = 'default',
    featured = false,
    most_sub_cat = false,
    is_menu_show = false,
  } = params;

  const url = `https://admin.karbar.shop/api/${locale}/categories?business_category=${business_category}&featured=${featured}&most_sub_cat=${most_sub_cat}&is_menu_show=${is_menu_show}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(`[Categories API Warning] Status ${res.status}, using fallback categories.`);
      return FALLBACK_CATEGORIES;
    }

    const data = await res.json();
    if (data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data;
    }
    return FALLBACK_CATEGORIES;
  } catch (error) {
    console.error('[Categories API Error]', error);
    return FALLBACK_CATEGORIES;
  }
}

export async function getAllCategories(locale = 'bn', featured = false, isMenuShow = false): Promise<Category[]> {
  return getApiCategories({ locale, featured, is_menu_show: isMenuShow });
}

export async function getAllBrands(locale = 'en'): Promise<Brand[]> {
  const response = await fetchApi<ApiResponse<Brand[]>>('/brands', { locale, useLocalePrefix: true });
  return response?.data || [];
}

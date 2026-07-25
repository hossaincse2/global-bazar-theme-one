export interface Category {
  id: number;
  name: string;
  slug: string;
  is_featured?: boolean;
  is_menu_show?: boolean;
  image?: string;
  image_url?: string;
  children_count?: number;
  products_count?: number;
  parent_id?: number | null;
  children?: Category[];
  parent?: Category;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  image?: string;
  preview_image?: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  attribute_one?: string;
  attribute_two?: string;
  sku?: string;
  price?: number;
  sale_price?: number;
  stock?: {
    quantity: number;
  };
}

export interface ProductMedia {
  id: number;
  original_url: string;
  file_name?: string;
}

export interface ProductReview {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku_code?: string;
  barcode?: string;
  unit_price: number;
  sale_price?: number;
  discount_percentage?: number;
  description?: string;
  summary?: string;
  specification?: string;
  image?: string;
  image_url?: string;
  is_featured?: boolean;
  status?: string;
  category?: Category;
  categories?: Category[];
  brand?: Brand;
  variants?: ProductVariant[];
  media?: ProductMedia[];
  reviews?: ProductReview[];
  reviews_avg_rating?: number;
  sales_count?: number;
}

export interface CouponCode {
  title: string;
  campaign_type: string;
  discount_type: string;
  discount: number;
  is_active: boolean;
  start_date: string;
  end_date: string;
}

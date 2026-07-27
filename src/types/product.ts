export interface SubCategory {
  id: number;
  name: string;
  slug: string;
  is_featured?: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  content?: string | null;
  is_featured?: boolean;
  is_menu_show?: boolean;
  image?: string;
  image_url?: string;
  category_image?: string;
  total_products?: string | number;
  children_count?: number;
  products_count?: number;
  parent_id?: number | null;
  children?: Category[];
  sub_category?: SubCategory[];
  parent?: Category;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  image?: string;
  preview_image?: string;
}

export interface ProductImageItem {
  preview_url: string;
  original_url: string;
}

export interface SingleProductVariant {
  product_variant_id: number;
  attributes: Record<string, string>;
  additional_price?: number | null;
  qty: number;
  stock?: number;
  variant_images?: ProductImageItem[] | null;
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
  } | number;
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
  preview_image?: string;
  is_featured?: boolean;
  status?: string;
  category?: Category | string;
  categories?: Category[];
  brand?: Brand;
  variants?: SingleProductVariant[] | ProductVariant[];
  media?: ProductMedia[];
  reviews?: ProductReview[];
  reviews_avg_rating?: number;
  sales_count?: number;
  stock?: number;
}

export interface ProductDetailData {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  sku_code?: string;
  unit_price: number;
  sale_price?: number;
  stock: number;
  description?: string;
  summary?: string;
  specification?: string;
  category?: string;
  reviews?: ProductReview[];
  variants?: SingleProductVariant[];
  product_images?: ProductImageItem[];
  preview_image?: string;
  total_ratings?: number;
  average_rating?: number;
  total_five_stars?: number;
  total_four_stars?: number;
  total_three_stars?: number;
  total_two_stars?: number;
  total_one_stars?: number;
  currency?: string;
  video_link?: string | null;
  product_unit?: string | null;
  free_delivery?: boolean;
  pre_order?: boolean;
  show_price?: boolean;
  warranty?: string | null;
  related_products?: Product[];
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

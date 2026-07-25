export interface CmsBlockItem {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  image_url?: string;
  url?: string;
  action_name?: string;
  action_url?: string;
  badge?: string;
  price?: number;
  discount_price?: number;
  [key: string]: any;
}

export interface CmsBlock {
  id: number;
  name: string;
  key: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  image_url?: string;
  action_name?: string;
  action_url?: string;
  items: CmsBlockItem[];
  is_common: boolean;
  is_active?: boolean;
  order: number;
  updated_at: string;
}

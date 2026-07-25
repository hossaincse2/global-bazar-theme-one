export interface SiteSettings {
  country_code?: string;
  module?: string[];
  company_name?: string;
  currency_icon: string;
  title: string;
  phone?: string;
  email?: string;
  whatsapp_id?: string;
  website?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  vat?: string;
  inside_dhaka: string;
  dhaka_sub_area?: string;
  outside_dhaka: string;
  currency: string;
  footer_description?: string;
  btn_bg_color?: string;
  btn_text_color?: string;
  invoice_footer_note?: string;
  fev_icon?: string;
  header_logo?: string;
  footer_logo?: string;
  business_category?: string;
  primary_color?: string;
  secondary_color?: string;
  header_bg_color?: string;
  header_text_color?: string;
  footer_bg_color?: string;
  footer_text_color?: string;
  announcement_text?: string;
  card_button_text?: string;
}

export interface ThemeOptions {
  base_colors?: {
    primary_color?: string;
    secondary_color?: string;
    font_family?: string;
  };
  button_settings?: {
    text?: string;
    bg_color?: string;
    text_color?: string;
    hover_bg_color?: string;
    hover_text_color?: string;
    card_button_text?: string;
    card_bg_color?: string;
    card_text_color?: string;
    card_hover_bg_color?: string;
    card_hover_text_color?: string;
  };
  announcement_bar?: {
    text?: string;
  };
  header?: {
    bg_color?: string;
    top_bg_color?: string;
    text_color?: string;
    font_family?: string;
  };
  footer?: {
    bg_color?: string;
    text_color?: string;
    font_family?: string;
  };
}

export interface HeroImage {
  id: number;
  title: string;
  is_approved: string;
  url: string;
  image_url: string;
}

export interface PixelConfig {
  id: number;
  pixel_id: string;
  token: string;
}

export interface AdsManagerCredentials {
  tag_managers: any;
  pixels: PixelConfig[];
}

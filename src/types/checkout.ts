export interface PaymentGatewayMethod {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  country_code?: string;
  sort_order?: number;
  type?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItemPayload {
  product_name: string;
  product_id: number;
  quantity: number;
  price: number;
  product_variant_id: number | null;
  total: number;
}

export interface ProductOrderPayload {
  name: string;
  phone: string;
  email: string;
  address: string;
  spacial_instruction: string;
  payment_method: string;
  products: OrderItemPayload[];
  delivery_fee: number;
  total_quantity: number;
  total_amount: number;
  delivery_location: string;
  currency: string;
  discount_amount: number;
  sub_total: number;
  create_account: boolean;
}

export interface ProductOrderResponse {
  success?: string;
  order_number?: number;
  is_digital_product?: boolean;
  message?: string;
  error?: string;
}

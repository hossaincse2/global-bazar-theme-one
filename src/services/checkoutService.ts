import { PaymentGatewayMethod, ProductOrderPayload, ProductOrderResponse } from '@/types/checkout';

const PAYMENT_GATEWAY_API = 'https://admin.karbar.shop/api/payment-gateway';
const PRODUCT_ORDER_API = 'https://admin.karbar.shop/api/product-order';

// Fallback payment methods in case API fails due to CORS or network errors
const FALLBACK_PAYMENT_METHODS: PaymentGatewayMethod[] = [
  {
    id: 1,
    uuid: '95a83188-8ef3-41c8-b837-5ead572377f5',
    name: 'Cash',
    slug: 'cash',
    description: 'Cash payment method (Pay cash on delivery)',
    image: 'https://admin.karbar.shop/storage/images/payment-methods/1771066151_360_F_604866831_hHgCSigPumPTzg0Vcad9sFOEzdX1xC4t.jpg',
    country_code: 'BD',
    sort_order: 1,
    type: null,
    created_at: '2025-12-08 23:39:52',
    updated_at: '2026-02-14 10:49:11',
  },
  {
    id: 2,
    uuid: 'a2b3c4d5-8ef3-41c8-b837-5ead572377f6',
    name: 'bKash',
    slug: 'bkash',
    description: 'Pay securely via bKash Mobile Wallet',
    image: 'https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.png',
    country_code: 'BD',
    sort_order: 2,
    type: null,
    created_at: '2025-12-08 23:39:52',
    updated_at: '2026-02-14 10:49:11',
  },
  {
    id: 3,
    uuid: 'b3c4d5e6-8ef3-41c8-b837-5ead572377f7',
    name: 'Nagad',
    slug: 'nagad',
    description: 'Pay via Nagad digital payment',
    image: '',
    country_code: 'BD',
    sort_order: 3,
    type: null,
    created_at: '2025-12-08 23:39:52',
    updated_at: '2026-02-14 10:49:11',
  }
];

export async function getPaymentGateways(): Promise<PaymentGatewayMethod[]> {
  try {
    const res = await fetch(PAYMENT_GATEWAY_API, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(`[Payment Gateway API] Status ${res.status}, using fallback.`);
      return FALLBACK_PAYMENT_METHODS;
    }

    const data = await res.json();
    if (data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data;
    }
    return FALLBACK_PAYMENT_METHODS;
  } catch (error) {
    console.error('[Payment Gateway API Error]', error);
    return FALLBACK_PAYMENT_METHODS;
  }
}

export async function placeProductOrder(payload: ProductOrderPayload): Promise<ProductOrderResponse> {
  try {
    const res = await fetch(PRODUCT_ORDER_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        error: data?.message || data?.error || `Order creation failed (Status ${res.status})`,
      };
    }

    return data as ProductOrderResponse;
  } catch (error: any) {
    console.error('[Product Order API Error]', error);
    return {
      error: error?.message || 'Network error occurred while placing order. Please try again.',
    };
  }
}

export function stripKarbarLogoFromInvoice(rawHtml: string): string {
  if (!rawHtml) return rawHtml;

  let cleaned = rawHtml;

  // Remove pos-logo container divs
  cleaned = cleaned.replace(/<div\s+class=["']pos-logo["'][\s\S]*?<\/div>/gi, '');

  // Remove any img tags loading karbar-logo or signature logo images
  cleaned = cleaned.replace(/<img[^>]*karbar-logo[^>]*>/gi, '');
  cleaned = cleaned.replace(/<img[^>]*class=["'][^"']*ab-signature-img[^"']*["'][^>]*>/gi, '');

  // Replace SR, SAR, \u09f3, ৳, BDT currency representations with TK
  cleaned = cleaned.replace(/\bSR\b/g, 'TK');
  cleaned = cleaned.replace(/\bSAR\b/g, 'TK');
  cleaned = cleaned.replace(/\u09f3/g, 'TK');
  cleaned = cleaned.replace(/৳/g, 'TK');

  // Inject CSS rule into style tag to guarantee logo is hidden on screen and print
  const hideLogoCss = `
    .pos-logo, .ab-signature-img, img[src*="karbar-logo"] {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      width: 0 !important;
    }
  `;

  if (cleaned.includes('</style>')) {
    cleaned = cleaned.replace('</style>', `${hideLogoCss}</style>`);
  }

  return cleaned;
}

export async function getOrderInvoice(orderNumber: string | number): Promise<string | null> {
  try {
    const url = `https://admin.karbar.shop/api/pos/pos-recent-sales-invoice/${orderNumber}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(`[Invoice API Warning] Failed to fetch invoice for ${orderNumber} (Status ${res.status})`);
      return null;
    }

    const data = await res.json();
    if (data && typeof data.invoice === 'string') {
      return stripKarbarLogoFromInvoice(data.invoice);
    }
    return null;
  } catch (error) {
    console.error('[Invoice API Error]', error);
    return null;
  }
}


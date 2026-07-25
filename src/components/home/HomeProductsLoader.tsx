'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { FlashSaleSection } from '@/components/cms/FlashSaleSection';
import { ElectronicsSection } from '@/components/cms/ElectronicsSection';
import { FashionSection } from '@/components/cms/FashionSection';
import { TrendingProducts } from '@/components/cms/TrendingProducts';
import { NewArrivals } from '@/components/cms/NewArrivals';
import { MegaDeals } from '@/components/cms/MegaDeals';
import { CmsBlock } from '@/types/cms';

interface HomeProductsLoaderProps {
  cmsBlocks?: CmsBlock[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';
const LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'bn';

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
          <div className="aspect-square bg-slate-100" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-slate-100 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
            <div className="h-4 bg-slate-100 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomeProductsLoader({ cmsBlocks = [] }: HomeProductsLoaderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          search: '',
          category: 'all',
          sub_category: '',
          page: '1',
          perPage: '24',
          sort_by: 'all',
          brand_id: 'all',
          business_category: 'default',
        });

        const url = `${API_BASE}/${LOCALE}/products?${params.toString()}`;
        console.log('[HomeProductsLoader] Fetching products from:', url);

        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`API responded with status ${res.status}`);
        }

        const json = await res.json();
        const items: Product[] = (json?.data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          sku_code: p.sku_code,
          unit_price: p.unit_price,
          sale_price: p.sale_price > 0 ? p.sale_price : undefined,
          preview_image: p.preview_image,
          image_url: p.preview_image,
          category: p.category
            ? { id: 0, name: p.category, slug: p.category_slug || '' }
            : undefined,
          sales_count: p.sales_count,
          reviews_avg_rating: p.product_rating || 0,
          variants: p.variants || [],
        }));

        console.log(`[HomeProductsLoader] Loaded ${items.length} products`);
        setProducts(items);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('[HomeProductsLoader] Error fetching products:', err);
          setError(err.message || 'Failed to load products');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
    return () => controller.abort();
  }, []);

  // Find CMS blocks for sections
  const getBlock = (key: string) => cmsBlocks.find((b) => b.key === key);

  if (loading) {
    return (
      <div className="space-y-12 py-8">
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-sm text-slate-500">
            <svg className="animate-spin w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading products from API...
          </div>
        </div>
        <ProductSkeleton />
        <ProductSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-red-500">⚠️ {error}</p>
        <p className="text-xs text-slate-400 mt-1">Please check your API connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <FlashSaleSection cmsBlock={getBlock('flash_sale')} products={products} />
      <ElectronicsSection cmsBlock={getBlock('electronics')} products={products} />
      <FashionSection cmsBlock={getBlock('fashion')} products={products} />
      <TrendingProducts cmsBlock={getBlock('trending_products')} products={products} />
      <NewArrivals cmsBlock={getBlock('new_arrivals')} products={products} />
      <MegaDeals />
    </div>
  );
}

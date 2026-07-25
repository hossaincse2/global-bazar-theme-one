'use client';

import React from 'react';
import { CmsBlock } from '@/types/cms';
import { ProductCard } from '@/components/common/ProductCard';
import { Product } from '@/types/product';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface TrendingProductsProps {
  cmsBlock?: CmsBlock | null;
  products?: Product[];
}

export const TrendingProducts: React.FC<TrendingProductsProps> = ({ cmsBlock, products = [] }) => {
  // Sort products by sales_count or unit_price or take top items
  const sorted = [...products].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0));
  const items = sorted.length > 0 ? sorted.slice(0, 4) : products.slice(0, 4);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                <span>⭐ {cmsBlock?.title || 'Trending Products'}</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {cmsBlock?.subtitle || 'Most popular items based on customer purchases & reviews.'}
              </p>
            </div>
          </div>
          <Link
            href="/products?sort_by=best_selling"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
          >
            View All Trending Products →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};

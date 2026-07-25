'use client';

import React from 'react';
import { CmsBlock } from '@/types/cms';
import { ProductCard } from '@/components/common/ProductCard';
import { Product } from '@/types/product';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

interface NewArrivalsProps {
  cmsBlock?: CmsBlock | null;
  products?: Product[];
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({ cmsBlock, products = [] }) => {
  // Take latest products by ID descending
  const sorted = [...products].sort((a, b) => (b.id || 0) - (a.id || 0));
  const items = sorted.length > 0 ? sorted.slice(0, 4) : products.slice(0, 4);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                <span>🛍️ {cmsBlock?.title || 'New Arrivals'}</span>
                <span className="text-xs bg-emerald-100 text-emerald-700 font-extrabold px-2.5 py-0.5 rounded-full uppercase">Just In</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {cmsBlock?.subtitle || 'Explore our newest collection fresh off the store.'}
              </p>
            </div>
          </div>
          <Link
            href="/products?sort_by=new_arrival"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
          >
            Explore All New Arrivals →
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

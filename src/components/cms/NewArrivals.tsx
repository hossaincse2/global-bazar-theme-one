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
  const defaultNewArrivals: Product[] = [
    {
      id: 501,
      name: 'Ultra Slim Smart Ring Fitness Tracker',
      slug: 'smart-ring-fitness-tracker',
      unit_price: 15000,
      sale_price: 12900,
      image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80',
      category: { id: 3, name: 'Accessories', slug: 'accessories' },
      reviews_avg_rating: 5.0,
    },
    {
      id: 502,
      name: 'Portable Mini Projector 1080P Full HD',
      slug: 'portable-mini-projector',
      unit_price: 22000,
      sale_price: 18500,
      image_url: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500&q=80',
      category: { id: 1, name: 'Electronics', slug: 'electronics' },
      reviews_avg_rating: 4.8,
    },
    {
      id: 503,
      name: "Women's Designer Leather Handbag",
      slug: 'womens-designer-leather-handbag',
      unit_price: 8500,
      sale_price: 6900,
      image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80',
      category: { id: 11, name: "Women's Wear", slug: 'womens-wear' },
      reviews_avg_rating: 4.9,
    },
    {
      id: 504,
      name: 'Foldable Drone 4K Camera Dual Battery',
      slug: 'foldable-drone-4k-camera',
      unit_price: 32000,
      sale_price: 27900,
      image_url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=500&q=80',
      category: { id: 1, name: 'Electronics', slug: 'electronics' },
      reviews_avg_rating: 4.7,
    },
  ];

  const items = products.length > 0 ? products : defaultNewArrivals;

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

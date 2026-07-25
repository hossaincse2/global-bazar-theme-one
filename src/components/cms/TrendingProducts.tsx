'use client';

import React from 'react';
import { CmsBlock } from '@/types/cms';
import { ProductCard } from '@/components/common/ProductCard';
import { Product } from '@/types/product';
import { Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface TrendingProductsProps {
  cmsBlock?: CmsBlock | null;
  products?: Product[];
}

export const TrendingProducts: React.FC<TrendingProductsProps> = ({ cmsBlock, products = [] }) => {
  const defaultTrendingProducts: Product[] = [
    {
      id: 401,
      name: 'Wireless Mechanical Gaming Keyboard RGB',
      slug: 'wireless-mechanical-gaming-keyboard',
      unit_price: 9500,
      sale_price: 7800,
      image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
      category: { id: 3, name: 'Accessories', slug: 'accessories' },
      reviews_avg_rating: 5.0,
    },
    {
      id: 402,
      name: 'Ergonomic Office Chair Mesh High-Back',
      slug: 'ergonomic-office-chair',
      unit_price: 18500,
      sale_price: 15900,
      image_url: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=500&q=80',
      category: { id: 20, name: 'Furniture', slug: 'furniture' },
      reviews_avg_rating: 4.9,
    },
    {
      id: 403,
      name: 'Smart 4K Ultra HD Android TV 55 Inch',
      slug: 'smart-4k-ultra-hd-tv',
      unit_price: 65000,
      sale_price: 54900,
      image_url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&q=80',
      category: { id: 1, name: 'Electronics', slug: 'electronics' },
      reviews_avg_rating: 4.8,
    },
    {
      id: 404,
      name: 'Stainless Steel Insulated Smart Water Bottle',
      slug: 'smart-water-bottle',
      unit_price: 2500,
      sale_price: 1890,
      image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
      category: { id: 21, name: 'Lifestyle', slug: 'lifestyle' },
      reviews_avg_rating: 4.9,
    },
  ];

  const items = products.length > 0 ? products : defaultTrendingProducts;

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

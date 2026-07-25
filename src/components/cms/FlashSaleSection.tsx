'use client';

import React, { useState, useEffect } from 'react';
import { CmsBlock } from '@/types/cms';
import { ProductCard } from '@/components/common/ProductCard';
import { Product } from '@/types/product';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FlashSaleSectionProps {
  cmsBlock?: CmsBlock | null;
  products?: Product[];
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({ cmsBlock, products = [] }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const defaultFlashProducts: Product[] = [
    {
      id: 101,
      name: 'Flagship Smartphone Pro 256GB',
      slug: 'flagship-smartphone-pro',
      unit_price: 95000,
      sale_price: 79900,
      image_url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&q=80',
      category: { id: 1, name: 'Smartphones', slug: 'smartphones' },
      reviews_avg_rating: 4.9,
    },
    {
      id: 102,
      name: 'Ultrabook Laptop 16GB RAM 512GB SSD',
      slug: 'ultrabook-laptop-16gb',
      unit_price: 125000,
      sale_price: 108900,
      image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80',
      category: { id: 2, name: 'Laptops', slug: 'laptops' },
      reviews_avg_rating: 4.8,
    },
    {
      id: 103,
      name: 'Active Noise Cancelling Wireless Headphones',
      slug: 'noise-cancelling-headphones',
      unit_price: 18500,
      sale_price: 13900,
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      category: { id: 3, name: 'Accessories', slug: 'accessories' },
      reviews_avg_rating: 4.7,
    },
    {
      id: 104,
      name: 'Premium Leather Jacket - Men Edition',
      slug: 'premium-leather-jacket',
      unit_price: 12000,
      sale_price: 8900,
      image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',
      category: { id: 4, name: "Men's Wear", slug: 'mens-wear' },
      reviews_avg_rating: 4.9,
    },
  ];

  const itemsToDisplay = products.length > 0 ? products.slice(0, 4) : defaultFlashProducts;

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-red-500/5 border-y border-amber-200/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-600/30 animate-pulse">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                <span>🔥 {cmsBlock?.title || 'Flash Sale'}</span>
                <span className="text-xs bg-red-100 text-red-600 font-bold px-2.5 py-0.5 rounded-full uppercase">Hot Deals</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {cmsBlock?.subtitle || 'Limited time offer! Grab the biggest discounts before stock runs out.'}
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-md">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400 font-semibold uppercase">Ends In:</span>
            <div className="flex items-center gap-1 font-black text-sm">
              <span className="bg-slate-800 px-2 py-1 rounded text-amber-400">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-slate-800 px-2 py-1 rounded text-amber-400">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-slate-800 px-2 py-1 rounded text-amber-400">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {itemsToDisplay.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center mt-8">
          <Link
            href="/products?sort_by=discount"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full transition shadow-md"
          >
            <span>View All Flash Deals</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>

      </div>
    </section>
  );
};

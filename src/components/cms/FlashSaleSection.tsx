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

  // Filter products with discounts first, or take top 4 products
  const discountedProducts = products.filter(p => p.sale_price && p.sale_price < p.unit_price);
  const itemsToDisplay = discountedProducts.length > 0 ? discountedProducts.slice(0, 4) : products.slice(0, 4);

  if (itemsToDisplay.length === 0) {
    return null;
  }

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

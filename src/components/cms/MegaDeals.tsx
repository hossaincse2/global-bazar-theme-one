'use client';

import React from 'react';
import { CmsBlock } from '@/types/cms';
import { Zap, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface MegaDealsProps {
  cmsBlock?: CmsBlock | null;
}

export const MegaDeals: React.FC<MegaDealsProps> = ({ cmsBlock }) => {
  return (
    <section className="py-12 px-4 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-amber-500 text-slate-900 rounded-2xl shadow-lg">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <span>💥 {cmsBlock?.title || 'Mega Deals & Extra Discounts'}</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {cmsBlock?.subtitle || 'Combine coupon codes with seasonal promos for maximum savings!'}
            </p>
          </div>
        </div>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1 */}
          <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 shadow-2xl flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold mb-3">
                <Tag className="w-3.5 h-3.5" />
                <span>Coupon Code: SUMMER20</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Flat 20% OFF Everything</h3>
              <p className="text-xs text-blue-100 max-w-sm">Use coupon code at checkout on orders over ৳ 5,000</p>
            </div>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold text-xs rounded-xl hover:bg-blue-50 transition shadow-lg"
              >
                <span>Claim Offer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative rounded-3xl overflow-hidden p-8 bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 shadow-2xl flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold mb-3">
                <Zap className="w-3.5 h-3.5" />
                <span>Free Express Shipping</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Zero Delivery Fee Nationwide</h3>
              <p className="text-xs text-amber-100 max-w-sm">Valid on all electronics and smartphone bundles this week.</p>
            </div>
            <div className="mt-6">
              <Link
                href="/products?category=electronics"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-700 font-bold text-xs rounded-xl hover:bg-amber-50 transition shadow-lg"
              >
                <span>Shop Tech Bundles</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

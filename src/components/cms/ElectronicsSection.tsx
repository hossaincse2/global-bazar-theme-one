'use client';

import React, { useState } from 'react';
import { CmsBlock } from '@/types/cms';
import { ProductCard } from '@/components/common/ProductCard';
import { Product } from '@/types/product';
import { Smartphone, Laptop, Headphones, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ElectronicsSectionProps {
  cmsBlock?: CmsBlock | null;
  products?: Product[];
}

export const ElectronicsSection: React.FC<ElectronicsSectionProps> = ({ cmsBlock, products = [] }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'smartphones' | 'laptops' | 'accessories'>('all');

  const getCatName = (cat?: any) => {
    if (!cat) return '';
    if (typeof cat === 'string') return cat.toLowerCase();
    return (cat.name || cat.slug || '').toLowerCase();
  };

  const electronicsList = products.filter((p) => {
    const name = (p.name || '').toLowerCase();
    const cat = getCatName(p.category);
    return (
      cat.includes('electr') ||
      cat.includes('smart') ||
      cat.includes('phone') ||
      cat.includes('laptop') ||
      cat.includes('computer') ||
      cat.includes('audio') ||
      cat.includes('headphone') ||
      name.includes('iphone') ||
      name.includes('samsung') ||
      name.includes('macbook') ||
      name.includes('dell') ||
      name.includes('sony') ||
      name.includes('watch')
    );
  });

  const displayList = electronicsList.length > 0 ? electronicsList : products;

  const filteredProducts = activeTab === 'all'
    ? displayList.slice(0, 4)
    : displayList.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const cat = getCatName(p.category);
        if (activeTab === 'smartphones') return cat.includes('smart') || cat.includes('phone') || name.includes('iphone') || name.includes('samsung');
        if (activeTab === 'laptops') return cat.includes('laptop') || cat.includes('computer') || name.includes('macbook') || name.includes('dell');
        if (activeTab === 'accessories') return cat.includes('audio') || cat.includes('headphone') || name.includes('sony') || name.includes('watch');
        return true;
      }).slice(0, 4);

  if (filteredProducts.length === 0 && products.length === 0) {
    return null;
  }

  const itemsToRender = filteredProducts.length > 0 ? filteredProducts : products.slice(0, 4);

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title & Subcategory Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
              <span>📱 {cmsBlock?.title || 'Electronics Hub'}</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {cmsBlock?.subtitle || 'Smartphones, Laptops, Audio Gear & Smart Accessories.'}
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'all', label: 'All Tech', icon: Smartphone },
              { id: 'smartphones', label: 'Smartphones', icon: Smartphone },
              { id: 'laptops', label: 'Laptops', icon: Laptop },
              { id: 'accessories', label: 'Accessories', icon: Headphones },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {itemsToRender.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Banner Link */}
        <div className="mt-8 flex justify-end">
          <Link
            href="/products?category=electronics"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition group"
          >
            <span>Explore All Electronics</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
};

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

  const defaultElectronics: Product[] = [
    {
      id: 201,
      name: 'Flagship Smartphone 5G 128GB',
      slug: 'flagship-smartphone-5g',
      unit_price: 68000,
      sale_price: 62900,
      image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80',
      category: { id: 1, name: 'Smartphones', slug: 'smartphones' },
      reviews_avg_rating: 4.8,
    },
    {
      id: 202,
      name: 'Slim Studio Pro Laptop M2 512GB',
      slug: 'slim-studio-pro-laptop',
      unit_price: 145000,
      sale_price: 132000,
      image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
      category: { id: 2, name: 'Laptops', slug: 'laptops' },
      reviews_avg_rating: 4.9,
    },
    {
      id: 203,
      name: 'Pro Wireless Charging Earbuds ANC',
      slug: 'pro-wireless-earbuds-anc',
      unit_price: 14500,
      sale_price: 11900,
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
      category: { id: 3, name: 'Accessories', slug: 'accessories' },
      reviews_avg_rating: 4.7,
    },
    {
      id: 204,
      name: 'Smart Watch Series 8 GPS + Cellular',
      slug: 'smart-watch-series-8',
      unit_price: 38000,
      sale_price: 32500,
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
      category: { id: 3, name: 'Accessories', slug: 'accessories' },
      reviews_avg_rating: 4.8,
    },
  ];

  const electronicsList = products.length > 0 ? products : defaultElectronics;

  const filteredProducts = activeTab === 'all'
    ? electronicsList
    : electronicsList.filter((p) => p.category?.slug === activeTab || p.category?.name.toLowerCase().includes(activeTab));

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
          {filteredProducts.map((product) => (
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

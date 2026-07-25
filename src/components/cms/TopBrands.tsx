'use client';

import React from 'react';
import { CmsBlock } from '@/types/cms';
import { Brand } from '@/types/product';
import { Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface TopBrandsProps {
  cmsBlock?: CmsBlock | null;
  brands?: Brand[];
}

export const TopBrands: React.FC<TopBrandsProps> = ({ cmsBlock, brands = [] }) => {
  const defaultBrands: Brand[] = [
    { id: 1, name: 'Samsung', slug: 'samsung' },
    { id: 2, name: 'Apple', slug: 'apple' },
    { id: 3, name: 'Xiaomi', slug: 'xiaomi' },
    { id: 4, name: 'Sony', slug: 'sony' },
    { id: 5, name: 'HP', slug: 'hp' },
    { id: 6, name: 'Asus', slug: 'asus' },
    { id: 7, name: 'Nike', slug: 'nike' },
    { id: 8, name: 'Adidas', slug: 'adidas' },
  ];

  const brandList = brands.length > 0 ? brands : defaultBrands;

  return (
    <section className="py-12 px-4 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                <span>🏷️ {cmsBlock?.title || 'Top Featured Brands'}</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {cmsBlock?.subtitle || 'Shop directly from official brand partners with full warranty.'}
              </p>
            </div>
          </div>
        </div>

        {/* Brand Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {brandList.map((brand) => (
            <Link
              key={brand.id}
              href={`/products?brand_id=${brand.id}`}
              className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center hover:bg-white hover:shadow-lg hover:border-blue-200 transition duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xs text-slate-800 font-black text-sm group-hover:text-blue-600 transition">
                {brand.name.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-700 mt-2 truncate w-full text-center group-hover:text-blue-600">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

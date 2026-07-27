'use client';

import React, { useRef } from 'react';
import { CmsBlock } from '@/types/cms';
import { Brand } from '@/types/product';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface TopBrandsProps {
  cmsBlock?: CmsBlock | null;
  brands?: Brand[];
}

export const TopBrands: React.FC<TopBrandsProps> = ({ cmsBlock, brands = [] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const defaultBrands: Brand[] = [
    { id: 1, name: 'Apple', slug: 'apple' },
    { id: 2, name: 'Samsung', slug: 'samsung' },
    { id: 3, name: 'Xiaomi', slug: 'xiaomi' },
    { id: 4, name: 'Sony', slug: 'sony' },
    { id: 5, name: 'HP', slug: 'hp' },
    { id: 6, name: 'Asus', slug: 'asus' },
    { id: 7, name: 'Nike', slug: 'nike' },
    { id: 8, name: 'Adidas', slug: 'adidas' },
    { id: 9, name: 'LG Electronics', slug: 'lg-electronics' },
    { id: 10, name: 'Apex', slug: 'apex' },
  ];

  const brandList = brands.length > 0 ? brands : defaultBrands;

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-white via-slate-50/50 to-white border-t border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Navigation Controls */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/25">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                <span>🏷️ {cmsBlock?.title || 'Top Featured Brands'}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                {cmsBlock?.subtitle || 'Shop directly from official brand partners with full warranty.'}
              </p>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition shadow-xs active:scale-95"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition shadow-xs active:scale-95"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Brand Slider Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-1 scrollbar-none [::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {brandList.map((brand) => {
            const hasImage = brand.image || brand.preview_image;

            return (
              <Link
                key={brand.id}
                href={`/products?brand_id=${brand.id}`}
                className="shrink-0 w-36 sm:w-44 p-5 bg-white border border-slate-200/80 rounded-2xl flex flex-col items-center justify-center snap-start hover:shadow-xl hover:border-blue-500/40 hover:-translate-y-1 transition duration-300 group relative overflow-hidden"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 group-hover:bg-blue-50/50 flex items-center justify-center text-slate-800 font-black text-base group-hover:text-blue-600 transition border border-slate-100 group-hover:border-blue-200/60 shadow-xs mb-3 group-hover:scale-110">
                  {hasImage ? (
                    <img
                      src={hasImage}
                      alt={brand.name}
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <span>{brand.name.substring(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 truncate w-full text-center transition">
                  {brand.name}
                </span>
                <span className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider group-hover:text-blue-500">
                  Official Store
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};

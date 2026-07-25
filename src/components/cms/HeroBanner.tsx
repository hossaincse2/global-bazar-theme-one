'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroImage } from '@/types/settings';
import { CmsBlock } from '@/types/cms';
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  heroImages?: HeroImage[];
  cmsBlock?: CmsBlock | null;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ heroImages = [], cmsBlock }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const fallbackSlides = [
    {
      title: 'Next-Gen Smartphones & Laptops',
      subtitle: 'Mega Discounts up to 40% OFF on Top Electronics',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
      action_name: 'Explore Deals',
      action_url: '/products?category=electronics',
    },
    {
      title: 'Trendy Fashion & Lifestyle Collection',
      subtitle: 'Discover Premium Wear for Men, Women & Kids',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
      action_name: 'Shop Fashion',
      action_url: '/products?category=fashion',
    },
  ];

  const slides = heroImages.length > 0
    ? heroImages.map((img) => ({
        title: img.title || cmsBlock?.title || 'Exclusive Season Offers',
        subtitle: cmsBlock?.subtitle || 'Get the best deal on latest products',
        image: img.image_url,
        action_name: 'Shop Now',
        action_url: img.url && img.url !== '#' ? img.url : '/products',
      }))
    : cmsBlock?.items?.length
    ? cmsBlock.items.map((item) => ({
        title: item.title || cmsBlock.title || 'Special Collection',
        subtitle: item.subtitle || cmsBlock.subtitle || 'Discover premium tech & fashion',
        image: item.image_url || item.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
        action_name: item.action_name || 'Shop Now',
        action_url: item.action_url || '/products',
      }))
    : fallbackSlides;

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="py-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Slider (2 cols on lg) */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-2xl min-h-[380px] sm:min-h-[460px] bg-slate-900 group">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent flex flex-col justify-center p-8 sm:p-12 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-full text-blue-300 text-xs font-bold w-fit mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Featured Campaign</span>
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight max-w-xl mb-4 drop-shadow-md">
                  {slide.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-md mb-6 font-medium">
                  {slide.subtitle}
                </p>
                <div>
                  <Link
                    href={slide.action_url}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{slide.action_name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Nav Controls */}
          {slides.length > 1 && (
            <>
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentSlide ? 'w-8 bg-blue-500' : 'w-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Side Promo Cards */}
        <div className="flex flex-col gap-6">
          <div className="relative flex-1 rounded-3xl overflow-hidden shadow-lg group bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-white/20 px-2.5 py-1 rounded-full">Limited Edition</span>
              <h3 className="text-xl font-bold mt-2">Smart Accessories</h3>
              <p className="text-xs text-amber-100 mt-1">Extra 20% OFF on Bluetooth Earbuds</p>
            </div>
            <Link
              href="/products?category=accessories"
              className="inline-flex items-center gap-1 text-xs font-bold bg-white text-amber-600 px-4 py-2 rounded-xl w-fit hover:bg-amber-50 transition mt-4"
            >
              <span>Shop Accessories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="relative flex-1 rounded-3xl overflow-hidden shadow-lg group bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase bg-white/20 px-2.5 py-1 rounded-full">New Season</span>
              <h3 className="text-xl font-bold mt-2">Fashion Flash Deals</h3>
              <p className="text-xs text-emerald-100 mt-1">Trendy outfits for everyday wear</p>
            </div>
            <Link
              href="/products?category=fashion"
              className="inline-flex items-center gap-1 text-xs font-bold bg-white text-emerald-700 px-4 py-2 rounded-xl w-fit hover:bg-emerald-50 transition mt-4"
            >
              <span>View Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

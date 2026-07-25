'use client';

import React from 'react';
import { CmsBlock } from '@/types/cms';
import { ProductCard } from '@/components/common/ProductCard';
import { Product } from '@/types/product';
import { Shirt, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FashionSectionProps {
  cmsBlock?: CmsBlock | null;
  products?: Product[];
}

export const FashionSection: React.FC<FashionSectionProps> = ({ cmsBlock, products = [] }) => {
  const defaultFashionProducts: Product[] = [
    {
      id: 301,
      name: "Men's Premium Cotton Casual Shirt",
      slug: 'mens-premium-cotton-shirt',
      unit_price: 3500,
      sale_price: 2690,
      image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80',
      category: { id: 10, name: "Men's Wear", slug: 'mens-wear' },
      reviews_avg_rating: 4.8,
    },
    {
      id: 302,
      name: "Women's Floral Summer Designer Dress",
      slug: 'womens-floral-summer-dress',
      unit_price: 5800,
      sale_price: 4350,
      image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80',
      category: { id: 11, name: "Women's Wear", slug: 'womens-wear' },
      reviews_avg_rating: 4.9,
    },
    {
      id: 303,
      name: "Kids Organic Cotton Hoodie Set",
      slug: 'kids-cotton-hoodie-set',
      unit_price: 2800,
      sale_price: 1990,
      image_url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&q=80',
      category: { id: 12, name: 'Kids Wear', slug: 'kids-wear' },
      reviews_avg_rating: 4.7,
    },
    {
      id: 304,
      name: "Men's Classic Slim-Fit Denim Jeans",
      slug: 'mens-classic-slim-denim-jeans',
      unit_price: 4200,
      sale_price: 3490,
      image_url: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=500&q=80',
      category: { id: 10, name: "Men's Wear", slug: 'mens-wear' },
      reviews_avg_rating: 4.8,
    },
  ];

  const fashionList = products.length > 0 ? products : defaultFashionProducts;

  const categories = [
    { name: "Men's Wear", slug: 'mens-wear', count: '120+ Styles', bg: 'from-blue-600 to-indigo-700' },
    { name: "Women's Wear", slug: 'womens-wear', count: '250+ Styles', bg: 'from-pink-500 to-rose-600' },
    { name: 'Kids Wear', slug: 'kids-wear', count: '90+ Styles', bg: 'from-amber-500 to-orange-600' },
  ];

  return (
    <section className="py-12 px-4 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
              <span>👕 {cmsBlock?.title || 'Fashion & Lifestyle'}</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {cmsBlock?.subtitle || 'Trendy Collections for Men, Women & Kids.'}
            </p>
          </div>
          <Link
            href="/products?category=fashion"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
          >
            <span>View Full Fashion Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Subcategory Visual Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={`/products?category=${cat.slug}`}
              className={`relative rounded-2xl overflow-hidden p-6 text-white bg-gradient-to-r ${cat.bg} shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-300 flex items-center justify-between group`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">{cat.count}</span>
                <h3 className="text-xl font-bold mt-2">{cat.name}</h3>
                <p className="text-xs text-white/80 mt-1">Shop Latest Trends</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                <Shirt className="w-6 h-6" />
              </div>
            </Link>
          ))}
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fashionList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};

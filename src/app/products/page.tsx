'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllProducts } from '@/services/productService';
import { getAllCategories, getAllBrands } from '@/services/categoryService';
import { ProductCard } from '@/components/common/ProductCard';
import { Product, Category, Brand } from '@/types/product';
import { Filter, Loader2 } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = (searchParams.get('sort_by') as any) || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<'new_arrival' | 'best_selling' | 'discount' | ''>(initialSort);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodRes, catList, brandList] = await Promise.all([
          getAllProducts({
            category: selectedCategory || undefined,
            search: searchQuery || undefined,
            sort_by: sortBy || undefined,
            perPage: 24,
          }),
          getAllCategories('en'),
          getAllBrands('en'),
        ]);

        if (prodRes?.data) setProducts(prodRes.data);
        if (catList) setCategories(catList);
        if (brandList) setBrands(brandList);
      } catch (err) {
        console.error('Error fetching products catalog:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 capitalize">
            {selectedCategory ? `${selectedCategory.replace('-', ' ')} Products` : 'All E-Commerce Products'}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Browse our top rated items across all categories.</p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-4 py-2.5 pr-8 focus:outline-hidden shadow-xs cursor-pointer"
            >
              <option value="">Sort by: Featured</option>
              <option value="new_arrival">New Arrivals</option>
              <option value="best_selling">Best Selling</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="space-y-6">
          
          {/* Categories */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Categories</span>
            </h3>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left font-medium transition ${
                  selectedCategory === '' ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left font-medium transition ${
                    selectedCategory === cat.slug ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-xs font-semibold">Loading catalog products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 space-y-3">
              <p className="text-slate-500 font-medium">No products found matching your filters.</p>
              <button
                onClick={() => { setSelectedCategory(''); setSearchQuery(''); setSortBy(''); }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-xs font-semibold">Loading catalog page...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

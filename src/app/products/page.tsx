'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAllProducts } from '@/services/productService';
import { getAllCategories, getAllBrands } from '@/services/categoryService';
import { ProductCard } from '@/components/common/ProductCard';
import { Product, Category, Brand } from '@/types/product';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { Filter, Loader2, RotateCcw, Tag, Award, X, SlidersHorizontal, Check } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currencyIcon } = useSiteSettings();

  const initialCategory = searchParams.get('category') || '';
  const initialBrand = searchParams.get('brand_id') || searchParams.get('brand') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = (searchParams.get('sort_by') as any) || '';
  const initialMinPrice = searchParams.get('min_price') || '';
  const initialMaxPrice = searchParams.get('max_price') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<string>(initialSort);

  // Price range inputs
  const [minPriceInput, setMinPriceInput] = useState(initialMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(initialMaxPrice);
  const [appliedMinPrice, setAppliedMinPrice] = useState(initialMinPrice);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(initialMaxPrice);

  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Synchronize state when searchParams URL changes
  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const brand = searchParams.get('brand_id') || searchParams.get('brand') || '';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort_by') || '';
    const minP = searchParams.get('min_price') || '';
    const maxP = searchParams.get('max_price') || '';

    setSelectedCategory(cat);
    setSelectedBrand(brand);
    setSearchQuery(search);
    setSortBy(sort);
    setMinPriceInput(minP);
    setMaxPriceInput(maxP);
    setAppliedMinPrice(minP);
    setAppliedMaxPrice(maxP);
  }, [searchParams]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodRes, catList, brandList] = await Promise.all([
          getAllProducts({
            category: selectedCategory || undefined,
            brand_id: selectedBrand || undefined,
            search: searchQuery || undefined,
            sort_by: sortBy || undefined,
            min_price: appliedMinPrice ? Number(appliedMinPrice) : undefined,
            max_price: appliedMaxPrice ? Number(appliedMaxPrice) : undefined,
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
  }, [selectedCategory, selectedBrand, searchQuery, sortBy, appliedMinPrice, appliedMaxPrice]);

  const handleApplyPriceFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedMinPrice(minPriceInput);
    setAppliedMaxPrice(maxPriceInput);
  };

  const handleQuickPriceSelect = (min: string, max: string) => {
    setMinPriceInput(min);
    setMaxPriceInput(max);
    setAppliedMinPrice(min);
    setAppliedMaxPrice(max);
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSearchQuery('');
    setSortBy('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setAppliedMinPrice('');
    setAppliedMaxPrice('');
    router.push('/products');
  };

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (appliedMinPrice || appliedMaxPrice ? 1 : 0) +
    (sortBy ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 capitalize flex items-center gap-2">
            <span>
              {selectedCategory
                ? `${selectedCategory.replace('-', ' ')} Products`
                : selectedBrand
                ? `${brands.find((b) => b.id.toString() === selectedBrand)?.name || 'Brand'} Products`
                : 'Catalog Products'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Browse our catalog with category, brand, and price range filters.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-4 py-2.5 pr-8 focus:outline-hidden shadow-xs cursor-pointer hover:border-blue-500 transition"
            >
              <option value="">Sort by: Featured</option>
              <option value="price_low_high">Price: Low to High</option>
              <option value="price_high_low">Price: High to Low</option>
              <option value="new_arrival">Newest Arrivals</option>
              <option value="best_selling">Best Selling</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-blue-50/50 border border-blue-100 rounded-2xl">
          <span className="text-xs font-bold text-blue-900 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Active Filters:
          </span>

          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold shadow-2xs">
              Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
              <button onClick={() => setSelectedCategory('')} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedBrand && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold shadow-2xs">
              Brand: {brands.find((b) => b.id.toString() === selectedBrand)?.name || selectedBrand}
              <button onClick={() => setSelectedBrand('')} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(appliedMinPrice || appliedMaxPrice) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold shadow-2xs">
              Price: {currencyIcon}{appliedMinPrice || '0'} - {currencyIcon}{appliedMaxPrice || '∞'}
              <button
                onClick={() => {
                  setMinPriceInput('');
                  setMaxPriceInput('');
                  setAppliedMinPrice('');
                  setAppliedMaxPrice('');
                }}
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold shadow-2xs">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline ml-auto flex items-center gap-1 px-2 py-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset All
          </button>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className={`space-y-6 lg:block ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          
          {/* Categories Filter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                <span>Categories</span>
              </span>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory('')}
                  className="text-[10px] text-blue-600 hover:underline font-bold"
                >
                  Clear
                </button>
              )}
            </h3>
            <div className="space-y-1 text-xs max-h-56 overflow-y-auto pr-1 scrollbar-thin">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition flex items-center justify-between ${
                  selectedCategory === '' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === '' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug === selectedCategory ? '' : cat.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition flex items-center justify-between ${
                    selectedCategory === cat.slug ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {selectedCategory === cat.slug && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span>Featured Brands</span>
              </span>
              {selectedBrand && (
                <button
                  onClick={() => setSelectedBrand('')}
                  className="text-[10px] text-blue-600 hover:underline font-bold"
                >
                  Clear
                </button>
              )}
            </h3>
            <div className="space-y-1 text-xs max-h-56 overflow-y-auto pr-1 scrollbar-thin">
              <button
                onClick={() => setSelectedBrand('')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition flex items-center justify-between ${
                  selectedBrand === '' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Brands</span>
                {selectedBrand === '' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
              {brands.map((b) => {
                const brandIdStr = b.id.toString();
                const isSelected = selectedBrand === brandIdStr;

                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrand(isSelected ? '' : brandIdStr)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition flex items-center justify-between ${
                      isSelected ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{b.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">{currencyIcon}</span>
                <span>Price Filter ({currencyIcon})</span>
              </span>
              {(appliedMinPrice || appliedMaxPrice) && (
                <button
                  onClick={() => {
                    setMinPriceInput('');
                    setMaxPriceInput('');
                    setAppliedMinPrice('');
                    setAppliedMaxPrice('');
                  }}
                  className="text-[10px] text-blue-600 hover:underline font-bold"
                >
                  Clear
                </button>
              )}
            </h3>

            {/* Min Max Inputs Form */}
            <form onSubmit={handleApplyPriceFilter} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Min Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Max Price</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-blue-500/20 active:scale-98"
              >
                Apply Price Filter
              </button>
            </form>

            {/* Quick Price Select Presets */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Quick Presets</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickPriceSelect('0', '500')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-[11px] font-semibold rounded-md transition"
                >
                  Under {currencyIcon}500
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPriceSelect('500', '2000')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-[11px] font-semibold rounded-md transition"
                >
                  {currencyIcon}500 - {currencyIcon}2000
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPriceSelect('2000', '10000')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-[11px] font-semibold rounded-md transition"
                >
                  {currencyIcon}2000+
                </button>
              </div>
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
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-3">
              <p className="text-slate-500 font-medium">No products match your selected filters.</p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-blue-700 transition"
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

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useCart } from '@/context/CartContext';
import { getStoreMenus, HeaderMenuItem } from '@/services/cmsService';
import { getApiCategories } from '@/services/categoryService';
import { getAllProducts } from '@/services/productService';
import { Category, Product } from '@/types/product';
import { Search, ShoppingCart, Heart, ChevronDown, Sparkles, Menu, X, Store, Layers, Loader2 } from 'lucide-react';

export const Header: React.FC = () => {
  const router = useRouter();
  const { settings, currencyIcon } = useSiteSettings();
  const { totalCount, wishlist, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchGrid, setShowSearchGrid] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerMenus, setHeaderMenus] = useState<HeaderMenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const customLogo = settings?.header_logo;

  useEffect(() => {
    async function loadData() {
      try {
        const [menuData, catData] = await Promise.all([
          getStoreMenus('en'),
          getApiCategories({ locale: 'bn' }),
        ]);

        if (menuData?.header_menu && menuData.header_menu.length > 0) {
          setHeaderMenus(menuData.header_menu);
        }

        if (catData && catData.length > 0) {
          setCategories(catData);
        }
      } catch (err) {
        console.warn('Error loading header dynamic data:', err);
      }
    }
    loadData();
  }, []);

  // Live Search Products Grid
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 1) {
      setSearchResults([]);
      setShowSearchGrid(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await getAllProducts({ search: searchQuery.trim(), perPage: 6 });
        if (res?.data) {
          setSearchResults(res.data);
          setShowSearchGrid(true);
        }
      } catch (err) {
        console.error('Error fetching live search results:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search grid when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchGrid(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const defaultHeaderMenus: HeaderMenuItem[] = [
    { title: 'Home', url: '/' },
    { title: 'Flash Sale', url: '/products?sort_by=discount', badge: 'HOT' },
    { title: 'Electronics', url: '/products?category=electronics' },
    { title: 'Fashion', url: '/products?category=fashion' },
    { title: 'Trending Products', url: '/products?sort_by=best_selling' },
    { title: 'New Arrivals', url: '/products?sort_by=new_arrival', badge: 'NEW' },
    { title: 'Mega Deals', url: '/products' },
  ];

  const activeHeaderMenus = headerMenus.length > 0 ? headerMenus : defaultHeaderMenus;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {customLogo ? (
              <img src={customLogo} alt={settings?.title || 'Global Bazar'} className="h-10 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Store className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-600 to-amber-500 bg-clip-text text-transparent">
                {settings?.title || 'Global Bazar'}
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Premium Store</p>
            </div>
          </Link>

          {/* Search Bar with Live Product Grid Dropdown */}
          <div ref={searchRef} className="flex-1 max-w-xl hidden md:block relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  setShowSearchGrid(false);
                  router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              className="relative"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setShowSearchGrid(true); }}
                placeholder="Search smartphones, laptops, fashion & deals..."
                className="w-full bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-slate-800 text-sm rounded-full py-3 pl-5 pr-12 border border-transparent focus:border-blue-500 focus:outline-hidden transition shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-md"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Live Product Grid Popup */}
            {showSearchGrid && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-blue-600" />
                    <span>Search Results ({searchResults.length})</span>
                  </span>
                  <button
                    onClick={() => setShowSearchGrid(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {isSearching ? (
                  <div className="py-8 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Searching products...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs font-medium">
                    No products found for "{searchQuery}".
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* 3-Column Product Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {searchResults.map((product) => {
                        const price = product.sale_price || product.unit_price;
                        const imageSrc = product.preview_image || product.image_url || product.image || '/placeholder.png';

                        return (
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            onClick={() => setShowSearchGrid(false)}
                            className="p-2.5 bg-slate-50 border border-slate-100 hover:border-blue-300 hover:bg-blue-50/30 rounded-xl flex flex-col justify-between transition group"
                          >
                            <div className="w-full h-24 bg-white rounded-lg overflow-hidden relative mb-2 border border-slate-100 flex items-center justify-center">
                              <img
                                src={imageSrc}
                                alt={product.name}
                                className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                              />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition">
                                {product.name}
                              </h4>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs font-extrabold text-blue-600">
                                  {currencyIcon} {price.toLocaleString()}
                                </span>
                                {product.sale_price && product.unit_price > product.sale_price && (
                                  <span className="text-[10px] text-slate-400 line-through">
                                    {currencyIcon} {product.unit_price.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* View All Link - Search button wise action */}
                    <button
                      onClick={() => {
                        setShowSearchGrid(false);
                        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                      }}
                      className="block w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-center text-xs font-bold rounded-xl transition mt-2 shadow-md shadow-blue-500/20 active:scale-98"
                    >
                      View All Results for "{searchQuery}" →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions: Wishlist, Cart & Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/wishlist"
              className="p-2 text-slate-600 hover:text-blue-600 rounded-full hover:bg-slate-100 transition relative flex items-center gap-1 text-xs font-semibold"
              title="View Favorites / Wishlist"
            >
              <Heart className="w-5 h-5 text-red-500 fill-red-500/20 hover:fill-red-500 transition" />
              <span className="hidden sm:inline font-bold text-slate-700">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold transition shadow-md shadow-blue-500/20 active:scale-95"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {totalCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden text-slate-700 hover:text-blue-600"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Dynamic Categories Bar & Admin Navigation Links */}
        <div className="hidden md:flex items-center justify-between py-3 border-t border-slate-100 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-6 overflow-x-auto">
            {/* Categories Dropdown */}
            <div className="relative shrink-0" onMouseLeave={() => setIsCategoryOpen(false)}>
              <button
                onMouseEnter={() => setIsCategoryOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition"
              >
                <Menu className="w-4 h-4 text-blue-400" />
                <span>Browse Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[75vh] overflow-y-auto divide-y divide-slate-100">
                  {categories.length === 0 ? (
                    <div className="py-4 text-center text-slate-400 text-xs font-medium">Loading categories...</div>
                  ) : (
                    categories.map((cat) => (
                      <div key={cat.id || cat.slug} className="py-2.5 first:pt-0 last:pb-0">
                        <Link
                          href={`/products?category=${encodeURIComponent(cat.slug)}`}
                          onClick={() => setIsCategoryOpen(false)}
                          className="flex items-center justify-between group py-1"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {cat.category_image ? (
                              <img
                                src={cat.category_image}
                                alt={cat.name}
                                className="w-5 h-5 object-contain shrink-0 rounded"
                                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                              />
                            ) : (
                              <Layers className="w-4 h-4 text-blue-600 shrink-0" />
                            )}
                            <span className="font-bold text-slate-800 text-xs group-hover:text-blue-600 transition truncate">
                              {cat.name}
                            </span>
                          </div>
                          {cat.total_products !== undefined && (
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                              {cat.total_products} items
                            </span>
                          )}
                        </Link>

                        {/* Sub-categories */}
                        {cat.sub_category && cat.sub_category.length > 0 && (
                          <div className="pl-7 mt-1.5 space-y-1">
                            {cat.sub_category.map((sub) => (
                              <Link
                                key={sub.id || sub.slug}
                                href={`/products?category=${encodeURIComponent(cat.slug)}&sub_category=${encodeURIComponent(sub.slug)}`}
                                onClick={() => setIsCategoryOpen(false)}
                                className="block text-[11px] font-medium text-slate-500 hover:text-blue-600 transition"
                              >
                                • {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Dynamic Admin-Managed Header Links */}
            {activeHeaderMenus.map((item, idx) => (
              <Link
                key={idx}
                href={item.url || '/'}
                className="hover:text-blue-600 transition shrink-0 flex items-center gap-1.5"
              >
                <span>{item.title}</span>
                {item.badge && (
                  <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Nationwide Delivery</span>
          </div>
        </div>
      </div>
    </header>
  );
};

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useCart } from '@/context/CartContext';
import { getStoreMenus, HeaderMenuItem } from '@/services/cmsService';
import { getApiCategories } from '@/services/categoryService';
import { getAllProducts } from '@/services/productService';
import { Category, Product } from '@/types/product';
import { Search, ShoppingCart, Heart, ChevronDown, ChevronRight, Sparkles, Menu, X, Store, Layers, Loader2 } from 'lucide-react';

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const customLogo = settings?.header_logo;

  const isMenuItemActive = (menuUrl?: string) => {
    if (!menuUrl) return false;

    let urlPath = menuUrl;
    try {
      if (menuUrl.startsWith('http://') || menuUrl.startsWith('https://')) {
        const parsed = new URL(menuUrl);
        urlPath = parsed.pathname + parsed.search;
      }
    } catch (e) {
      urlPath = menuUrl;
    }

    const [targetPath, targetQuery] = urlPath.split('?');

    if (pathname !== targetPath) {
      return false;
    }

    if (!targetQuery) {
      if (targetPath === '/') return pathname === '/';
      const activeKeys = Array.from(searchParams.keys());
      return activeKeys.length === 0;
    }

    const targetParams = new URLSearchParams(targetQuery);
    for (const [key, value] of Array.from(targetParams.entries())) {
      if (searchParams.get(key) !== value) {
        return false;
      }
    }
    return true;
  };

  // Handle click outside to close search and category dropdowns
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch header menu links on mount
  useEffect(() => {
    async function loadMenus() {
      try {
        const menuData = await getStoreMenus('en');
        if (menuData?.header_menu && menuData.header_menu.length > 0) {
          setHeaderMenus(menuData.header_menu);
        }
      } catch (err) {
        console.warn('Error loading header menus:', err);
      }
    }
    loadMenus();
  }, []);

  // Lazy load categories only on demand when user opens dropdown
  const fetchCategoriesOnDemand = async () => {
    if (categories.length > 0 || isLoadingCategories) return;
    setIsLoadingCategories(true);
    try {
      const catData = await getApiCategories({ locale: 'bn' });
      if (catData && catData.length > 0) {
        setCategories(catData);
        const firstWithSub = catData.find(c => c.sub_category && c.sub_category.length > 0) || catData[0];
        if (firstWithSub) {
          setActiveCategorySlug(firstWithSub.slug);
        }
      }
    } catch (err) {
      console.error('Error loading categories on demand:', err);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleToggleCategoryDropdown = () => {
    const nextState = !isCategoryOpen;
    setIsCategoryOpen(nextState);
    if (nextState && categories.length === 0) {
      fetchCategoriesOnDemand();
    }
  };

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
        <div className="hidden md:flex items-center justify-between py-2 border-t border-slate-100 text-xs font-bold text-slate-700 relative z-30">
          <div className="flex items-center gap-4 lg:gap-6 min-w-0">
            
            {/* Categories Dropdown - Kept OUTSIDE overflow box so absolute dropdown is NEVER clipped */}
            <div ref={categoryDropdownRef} className="relative shrink-0 z-50">
              <button
                type="button"
                onClick={handleToggleCategoryDropdown}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer active:scale-95 shadow-xs shrink-0"
              >
                <Menu className="w-4 h-4 text-blue-400" />
                <span>Browse Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-2 w-[560px] max-w-[92vw] bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden flex flex-col md:flex-row gap-4">
                  {/* Left Column: Main Categories List */}
                  <div className="w-full md:w-60 shrink-0 max-h-[60vh] overflow-y-auto space-y-1 pr-1 scrollbar-thin divide-y divide-slate-100/60">
                    <div className="pb-2.5 mb-1.5 flex items-center justify-between border-b border-slate-100 px-1">
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
                        Categories ({categories.length})
                      </span>
                      <Link
                        href="/products"
                        onClick={() => setIsCategoryOpen(false)}
                        className="text-[10px] font-bold text-blue-600 hover:underline"
                      >
                        All Products →
                      </Link>
                    </div>

                    {isLoadingCategories ? (
                      <div className="py-8 flex flex-col items-center justify-center text-slate-400 space-y-2">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        <span className="text-xs font-semibold text-slate-500">Loading categories...</span>
                      </div>
                    ) : categories.length === 0 ? (
                      <div className="py-6 text-center text-slate-400 text-xs font-medium">No categories available</div>
                    ) : (
                      categories.map((cat) => {
                        const hasSub = cat.sub_category && cat.sub_category.length > 0;
                        const isActive = (activeCategorySlug || categories[0]?.slug) === cat.slug;

                        return (
                          <div key={cat.id || cat.slug} className="pt-1">
                            <Link
                              href={`/products?category=${encodeURIComponent(cat.slug)}`}
                              onMouseEnter={() => setActiveCategorySlug(cat.slug)}
                              onClick={() => setIsCategoryOpen(false)}
                              className={`flex items-center justify-between p-2 rounded-xl group transition cursor-pointer ${
                                isActive ? 'bg-blue-50/90 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700 font-semibold'
                              }`}
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
                                <span className="text-xs truncate">{cat.name}</span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {(() => {
                                  const rawVal = cat.total_products ?? cat.products_count ?? 0;
                                  const count = Number(rawVal) || 0;
                                  return (
                                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border transition-all ${
                                      isActive
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                        : count > 0
                                        ? 'bg-blue-50 text-blue-700 border-blue-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600'
                                        : 'bg-slate-100 text-slate-400 border-slate-200/60'
                                    }`}>
                                      {count} {count === 1 ? 'item' : 'items'}
                                    </span>
                                  );
                                })()}
                                {hasSub && (
                                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                                    isActive ? 'text-blue-600 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
                                  }`} />
                                )}
                              </div>
                            </Link>

                            {/* Mobile inline fallback for sub-categories */}
                            {hasSub && isActive && (
                              <div className="md:hidden pl-7 mt-1.5 space-y-1 pb-2 border-b border-slate-100">
                                {cat.sub_category!.map((sub) => (
                                  <Link
                                    key={sub.id || sub.slug}
                                    href={`/products?category=${encodeURIComponent(cat.slug)}&sub_category=${encodeURIComponent(sub.slug)}`}
                                    onClick={() => setIsCategoryOpen(false)}
                                    className="block text-[11px] font-medium text-slate-500 hover:text-blue-600"
                                  >
                                    • {sub.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Right Column: Sub-Categories Panel (Desktop Flyout) */}
                  <div className="hidden md:flex flex-1 flex-col bg-slate-50/70 rounded-2xl p-4 border border-slate-100 max-h-[60vh] overflow-y-auto">
                    {(() => {
                      const activeCat = categories.find((c) => c.slug === activeCategorySlug) || categories[0];
                      if (!activeCat) return <div className="py-12 text-center text-slate-400 text-xs">Select a category</div>;

                      const activeCatCount = Number(activeCat.total_products ?? activeCat.products_count ?? 0) || 0;

                      return (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80">
                            <div className="flex items-center gap-2">
                              {activeCat.category_image ? (
                                <img src={activeCat.category_image} alt={activeCat.name} className="w-5 h-5 object-contain" />
                              ) : (
                                <Layers className="w-4 h-4 text-blue-600" />
                              )}
                              <div>
                                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">{activeCat.name}</h4>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {activeCatCount} {activeCatCount === 1 ? 'product' : 'products'} available
                                </span>
                              </div>
                            </div>
                            <Link
                              href={`/products?category=${encodeURIComponent(activeCat.slug)}`}
                              onClick={() => setIsCategoryOpen(false)}
                              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                            >
                              Explore →
                            </Link>
                          </div>

                          {activeCat.sub_category && activeCat.sub_category.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2">
                              {activeCat.sub_category.map((sub) => (
                                <Link
                                  key={sub.id || sub.slug}
                                  href={`/products?category=${encodeURIComponent(activeCat.slug)}&sub_category=${encodeURIComponent(sub.slug)}`}
                                  onClick={() => setIsCategoryOpen(false)}
                                  className="p-2.5 bg-white hover:bg-blue-600 hover:text-white text-slate-800 rounded-xl border border-slate-200/70 transition shadow-2xs group flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-blue-50 group-hover:bg-white/20 text-blue-600 group-hover:text-white flex items-center justify-center font-bold text-xs">
                                      {sub.name.charAt(0)}
                                    </div>
                                    <div>
                                      <span className="font-bold text-xs block">{sub.name}</span>
                                      <span className="text-[10px] text-slate-400 group-hover:text-blue-100 block">Sub-category collection</span>
                                    </div>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-white transition" />
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <div className="py-12 text-center text-slate-400 space-y-2">
                              <Sparkles className="w-6 h-6 text-amber-400 mx-auto" />
                              <p className="text-xs font-semibold text-slate-600">Discover top deals in {activeCat.name}</p>
                              <Link
                                href={`/products?category=${encodeURIComponent(activeCat.slug)}`}
                                onClick={() => setIsCategoryOpen(false)}
                                className="inline-block px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-xs"
                              >
                                Browse Catalog
                              </Link>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Admin-Managed Header Links */}
            <div className="flex items-center gap-2 lg:gap-3 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1">
              {activeHeaderMenus.map((item, idx) => {
                const isActive = isMenuItemActive(item.url);
                return (
                  <Link
                    key={idx}
                    href={item.url || '/'}
                    className={`transition shrink-0 flex items-center gap-1.5 whitespace-nowrap py-1.5 px-3 rounded-xl text-xs font-bold ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100/70'
                    }`}
                  >
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase ${
                        isActive ? 'bg-white text-blue-700' : 'bg-amber-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

          </div>

          <div className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5 shrink-0 ml-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Nationwide Delivery</span>
          </div>
        </div>

        {/* Mobile Navigation Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1.5 px-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {activeHeaderMenus.map((item, idx) => {
              const isActive = isMenuItemActive(item.url);
              return (
                <Link
                  key={idx}
                  href={item.url || '/'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase ${
                      isActive ? 'bg-white text-blue-700' : 'bg-amber-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

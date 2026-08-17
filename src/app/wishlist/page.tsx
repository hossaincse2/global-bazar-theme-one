'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { ProductCard } from '@/components/common/ProductCard';
import { Heart, ShoppingBag, Trash2, ArrowLeft, Sparkles, Check, ShoppingCart, Loader2 } from 'lucide-react';

function WishlistContent() {
  const { wishlistProducts, toggleWishlist, clearWishlist, addToCart } = useCart();
  const { currencyIcon } = useSiteSettings();

  const handleAddAllToCart = () => {
    wishlistProducts.forEach((product) => {
      addToCart(product, 1);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 text-red-500 rounded-2xl border border-red-100">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                <span>My Saved Favorites</span>
                <span className="text-xs bg-red-500 text-white font-extrabold px-2.5 py-0.5 rounded-full">
                  {wishlistProducts.length} {wishlistProducts.length === 1 ? 'Item' : 'Items'}
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Manage your bookmarked products and quickly add them to your shopping cart.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>

          {wishlistProducts.length > 0 && (
            <>
              <button
                onClick={handleAddAllToCart}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-98"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Move All to Cart</span>
              </button>

              <button
                onClick={clearWishlist}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 text-red-600 hover:bg-red-50 border border-red-100 text-xs font-bold rounded-xl transition"
                title="Clear entire wishlist"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear List</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Empty State */}
      {wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-200/80 shadow-xs max-w-2xl mx-auto my-12 space-y-5">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto border border-red-100">
            <Heart className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Your Favorites List is Empty</h2>
            <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
              You haven't saved any items to your wishlist yet. Tap the heart icon on any product to save it here for later!
            </p>
          </div>

          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Products Catalog</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              <button
                onClick={() => toggleWishlist(product)}
                className="w-full mt-2 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl border border-red-100 transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove from Favorites</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WishlistPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
        <p className="text-xs font-semibold">Loading wishlist...</p>
      </div>
    }>
      <WishlistContent />
    </Suspense>
  );
}

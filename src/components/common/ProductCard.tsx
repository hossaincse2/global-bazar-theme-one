'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const { currencyIcon, settings } = useSiteSettings();

  const isWishlisted = wishlist.includes(product.id);
  const imageSrc = product.preview_image || product.image_url || product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
  
  const hasDiscount = product.sale_price && product.sale_price < product.unit_price;
  const discountPercent = hasDiscount
    ? Math.round(((product.unit_price - product.sale_price!) / product.unit_price) * 100)
    : 0;

  const btnText = settings?.card_button_text || 'ADD CART';

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all duration-300 flex flex-col justify-between relative">
      
      {/* Badges & Wishlist overlay */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
            -{discountPercent}% OFF
          </span>
        )}

        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
            isWishlisted
              ? 'bg-red-50 text-red-500 shadow-md'
              : 'bg-white/80 text-slate-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover overlay */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="p-3 bg-white text-slate-800 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category / Brand badge */}
          <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
            {typeof product.category === 'string' ? product.category : product.category?.name || 'Top Pick'}
          </div>

          <Link href={`/product/${product.slug}`}>
            <h3 className="font-semibold text-slate-800 text-sm hover:text-blue-600 transition line-clamp-2 min-h-[40px]">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < (product.reviews_avg_rating || 5) ? 'fill-current' : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">(4.8)</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900">
                {currencyIcon} {(product.sale_price || product.unit_price).toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  {currencyIcon} {product.unit_price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-500/10"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{btnText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

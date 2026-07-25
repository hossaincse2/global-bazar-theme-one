'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getSingleProduct } from '@/services/productService';
import { useCart } from '@/context/CartContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { Product } from '@/types/product';
import { Star, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Loader2 } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const { addToCart, toggleWishlist, wishlist } = useCart();
  const { currencyIcon } = useSiteSettings();

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await getSingleProduct(slug);
        setProduct(data);
        if (data) {
          setSelectedImage(data.image_url || data.image || '');
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
        <p className="text-xs text-slate-500 font-semibold">Fetching product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-black text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The product you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const finalPrice = product.sale_price || product.unit_price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-xs">
        
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 relative">
            <img
              src={selectedImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.media && product.media.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.media.map((media) => (
                <button
                  key={media.id}
                  onClick={() => setSelectedImage(media.original_url)}
                  className={`w-20 h-20 rounded-xl border-2 overflow-hidden shrink-0 transition ${
                    selectedImage === media.original_url ? 'border-blue-600' : 'border-slate-200'
                  }`}
                >
                  <img src={media.original_url} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
              {product.category?.name || 'Official Item'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-3">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">4.9 / 5.0 Rating</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-black text-blue-600">
                {currencyIcon} {finalPrice.toLocaleString()}
              </span>
              {product.sale_price && (
                <span className="text-base text-slate-400 line-through">
                  {currencyIcon} {product.unit_price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              {product.description || 'Premium quality product built with high grade materials and backed by full official warranty.'}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 font-bold text-slate-600 hover:bg-white rounded-lg transition"
                >
                  -
                </button>
                <span className="px-4 text-xs font-black">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 font-bold text-slate-600 hover:bg-white rounded-lg transition"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 w-full sm:w-auto py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Cart</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xl border transition ${
                  isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-[10px] font-bold text-slate-800">100% Genuine</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <Truck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-[10px] font-bold text-slate-800">Fast Delivery</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <RotateCcw className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <p className="text-[10px] font-bold text-slate-800">7 Days Return</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

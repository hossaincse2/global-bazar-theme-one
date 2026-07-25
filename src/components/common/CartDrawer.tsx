'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();
  const { currencyIcon } = useSiteSettings();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold">Shopping Cart ({cart.length})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-slate-500 font-medium">Your cart is currently empty.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => {
                const itemPrice = product.sale_price || product.unit_price;
                const imageSrc = product.image_url || product.image || '/placeholder.png';

                return (
                  <div key={product.id} className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 relative group">
                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden relative shrink-0 border border-slate-200">
                      <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm truncate">{product.name}</h4>
                        <div className="text-xs text-blue-600 font-bold mt-1">
                          {currencyIcon} {itemPrice.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-200 bg-white rounded-lg">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 transition"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-slate-800">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 hover:bg-slate-100 text-slate-600 transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-red-500 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                <span>Subtotal</span>
                <span className="text-lg text-blue-600">
                  {currencyIcon} {totalAmount.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-500">Taxes and shipping calculated at checkout.</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={clearCart}
                  className="py-2.5 text-xs font-semibold text-slate-600 border border-slate-300 hover:bg-white rounded-lg transition"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => alert('Proceeding to Checkout...')}
                  className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/types/product';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariantId?: number;
  selectedAttributes?: Record<string, string>;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: number[];
  wishlistProducts: Product[];
  isCartOpen: boolean;
  addToCart: (product: Product, quantity?: number, selectedAttributes?: Record<string, string>) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productOrId: Product | number) => void;
  clearWishlist: () => void;
  setIsCartOpen: (open: boolean) => void;
  totalAmount: number;
  totalCount: number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  wishlist: [],
  wishlistProducts: [],
  isCartOpen: false,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  toggleWishlist: () => {},
  clearWishlist: () => {},
  setIsCartOpen: () => {},
  totalAmount: 0,
  totalCount: 0,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('gb_cart');
      const savedWishlist = localStorage.getItem('gb_wishlist');
      const savedWishlistProds = localStorage.getItem('gb_wishlist_products');

      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedWishlistProds) setWishlistProducts(JSON.parse(savedWishlistProds));
    } catch (e) {
      console.warn('Could not read cart/wishlist from localStorage', e);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('gb_cart', JSON.stringify(cart));
      localStorage.setItem('gb_wishlist', JSON.stringify(wishlist));
      localStorage.setItem('gb_wishlist_products', JSON.stringify(wishlistProducts));
    }
  }, [cart, wishlist, wishlistProducts, isInitialized]);

  const addToCart = (product: Product, quantity = 1, selectedAttributes?: Record<string, string>) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedAttributes }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productOrId: Product | number) => {
    const id = typeof productOrId === 'number' ? productOrId : productOrId.id;

    setWishlist((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });

    setWishlistProducts((prev) => {
      const exists = prev.some((p) => p.id === id);
      if (exists) {
        return prev.filter((p) => p.id !== id);
      }
      if (typeof productOrId !== 'number') {
        return [...prev, productOrId];
      }
      return prev;
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
    setWishlistProducts([]);
  };

  const totalAmount = cart.reduce((sum, item) => {
    const price = item.product.sale_price || item.product.unit_price;
    return sum + price * item.quantity;
  }, 0);

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        wishlistProducts,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        clearWishlist,
        setIsCartOpen,
        totalAmount,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

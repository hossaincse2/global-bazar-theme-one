'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Product, SingleProductVariant } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { getSingleProduct } from '@/services/productService';
import { X, ShoppingBag, CheckCircle2, XCircle, Star } from 'lucide-react';

interface ProductVariantModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductVariantModal: React.FC<ProductVariantModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const { currencyIcon } = useSiteSettings();

  const [fullVariants, setFullVariants] = useState<SingleProductVariant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  // Reset state when product changes or opens
  useEffect(() => {
    if (!product || !isOpen) return;

    setQuantity(1);
    const initialImg = product.preview_image || product.image_url || product.image || '';
    setSelectedImage(initialImg);

    if (product.variants && product.variants.length > 0) {
      setFullVariants(product.variants as SingleProductVariant[]);
    } else {
      setLoading(true);
      getSingleProduct(product.slug)
        .then((data) => {
          if (data && data.variants) {
            setFullVariants(data.variants);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [product, isOpen]);

  // Extract attribute groups
  const attributeGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    if (fullVariants && fullVariants.length > 0) {
      fullVariants.forEach((v) => {
        if (v.attributes) {
          Object.entries(v.attributes).forEach(([key, val]) => {
            if (!groups[key]) groups[key] = [];
            const strVal = String(val);
            if (!groups[key].includes(strVal)) groups[key].push(strVal);
          });
        }
      });
    }
    return groups;
  }, [fullVariants]);

  // Initialize selectedAttributes when attributeGroups change
  useEffect(() => {
    const initial: Record<string, string> = {};
    Object.entries(attributeGroups).forEach(([key, values]) => {
      if (values.length > 0) initial[key] = values[0];
    });
    setSelectedAttributes(initial);
  }, [attributeGroups]);

  // Find variant matching current selectedAttributes
  const selectedVariant = useMemo(() => {
    if (!fullVariants || fullVariants.length === 0) return null;
    return (
      fullVariants.find((v) => {
        if (!v.attributes) return false;
        return Object.entries(selectedAttributes).every(([key, val]) => v.attributes[key] === val);
      }) || null
    );
  }, [fullVariants, selectedAttributes]);

  // Handle attribute selection
  const handleSelectAttribute = (attrKey: string, attrVal: string) => {
    const nextAttributes = { ...selectedAttributes, [attrKey]: attrVal };
    setSelectedAttributes(nextAttributes);

    const defaultImg = product?.preview_image || product?.image_url || product?.image || '';

    const match = fullVariants.find((v) => {
      if (!v.attributes) return false;
      return Object.entries(nextAttributes).every(([k, val]) => v.attributes[k] === val);
    });

    if (match) {
      let varImg: string | null = null;
      if (match.preview_image) {
        varImg = match.preview_image;
      } else if (match.variant_images && match.variant_images.length > 0) {
        varImg = match.variant_images[0].original_url || match.variant_images[0].preview_url || null;
      }

      if (varImg) {
        setSelectedImage(varImg);
      } else {
        // Fallback to default product image if variant has no custom image
        setSelectedImage(defaultImg);
      }
    } else {
      setSelectedImage(defaultImg);
    }
  };

  if (!isOpen || !product) return null;

  // Price calculations
  const additionalPrice = selectedVariant?.additional_price || 0;
  const unitPrice = (product.unit_price || 0) + additionalPrice;
  const baseSalePrice = product.sale_price && product.sale_price > 0 ? product.sale_price : null;
  const salePrice = baseSalePrice ? baseSalePrice + additionalPrice : null;
  const effectivePrice = salePrice || unitPrice;
  const isDiscounted = salePrice !== null && salePrice < unitPrice;

  // Stock status
  const currentStock = selectedVariant
    ? (selectedVariant.qty ?? selectedVariant.stock ?? 0)
    : (product.stock ?? 0);
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const defaultImg = product.preview_image || product.image_url || product.image || '';

    const cartProduct: Product = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      unit_price: unitPrice,
      sale_price: salePrice || undefined,
      preview_image: selectedImage || defaultImg,
      image_url: selectedImage || defaultImg,
      category: product.category,
    };

    addToCart(cartProduct, quantity, selectedAttributes);
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Modal backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-sm truncate">Select Product Options</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm animate-pulse">
              Loading variant details...
            </div>
          ) : (
            <>
              {/* Product Preview Info */}
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shrink-0">
                  <img
                    src={selectedImage || product.preview_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-2">{product.name}</h4>
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-extrabold text-blue-600">
                      {currencyIcon} {effectivePrice.toLocaleString()}
                    </span>
                    {isDiscounted && (
                      <span className="text-xs text-slate-400 line-through">
                        {currencyIcon} {unitPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Stock status */}
                  <div className="mt-1">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        <XCircle className="w-3.5 h-3.5" /> Out of Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({currentStock} available)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Variant Attribute Selectors */}
              {Object.keys(attributeGroups).length > 0 && (
                <div className="space-y-4 pt-2">
                  {Object.entries(attributeGroups).map(([attrKey, attrValues]) => (
                    <div key={attrKey}>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        {attrKey}: <span className="text-blue-600 font-normal">{selectedAttributes[attrKey]}</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {attrValues.map((val) => {
                          const isSelected = selectedAttributes[attrKey] === val;
                          return (
                            <button
                              key={val}
                              onClick={() => handleSelectAttribute(attrKey, val)}
                              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-600/20'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Quantity:
                </label>
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl w-32 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isOutOfStock || quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg disabled:opacity-40 transition"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center text-sm font-bold text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                    disabled={isOutOfStock || quantity >= currentStock}
                    className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg disabled:opacity-40 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Action Button */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-sm py-3 px-6 rounded-xl transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

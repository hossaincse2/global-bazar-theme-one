'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ProductDetailData, Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { ProductCard } from '@/components/common/ProductCard';
import {
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface ProductDetailViewProps {
  product: ProductDetailData;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product }) => {
  const { addToCart, setIsCartOpen, toggleWishlist, wishlist } = useCart();
  const { currencyIcon } = useSiteSettings();

  // Combine product gallery images & variant images into gallery list
  const allImages = useMemo(() => {
    const images: { url: string; alt: string }[] = [];

    if (product.preview_image) {
      images.push({ url: product.preview_image, alt: product.name });
    }

    if (product.product_images && product.product_images.length > 0) {
      product.product_images.forEach((img) => {
        const url = img.original_url || img.preview_url;
        if (url && !images.some((i) => i.url === url)) {
          images.push({ url, alt: product.name });
        }
      });
    }

    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((v) => {
        if (v.preview_image && !images.some((i) => i.url === v.preview_image)) {
          images.push({ url: v.preview_image, alt: `${product.name} Variant` });
        }
        if (v.variant_images && v.variant_images.length > 0) {
          v.variant_images.forEach((vImg) => {
            const url = vImg.original_url || vImg.preview_url;
            if (url && !images.some((i) => i.url === url)) {
              images.push({ url, alt: `${product.name} Variant` });
            }
          });
        }
      });
    }

    return images.length > 0 ? images : [{ url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', alt: product.name }];
  }, [product]);

  const [selectedImage, setSelectedImage] = useState<string>(allImages[0].url);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specification' | 'summary' | 'reviews'>('specification');

  // Extract available variant attributes
  const attributeGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((variant) => {
        if (variant.attributes) {
          Object.entries(variant.attributes).forEach(([key, val]) => {
            if (!groups[key]) groups[key] = [];
            if (!groups[key].includes(val)) groups[key].push(val);
          });
        }
      });
    }
    return groups;
  }, [product.variants]);

  // Initial selected attributes state
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    Object.entries(attributeGroups).forEach(([key, values]) => {
      if (values.length > 0) initial[key] = values[0];
    });
    return initial;
  });

  // Find variant matching current selectedAttributes
  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null;
    return (
      product.variants.find((v) => {
        if (!v.attributes) return false;
        return Object.entries(selectedAttributes).every(([key, val]) => v.attributes[key] === val);
      }) || null
    );
  }, [product.variants, selectedAttributes]);

  // Handle attribute change and switch main image if variant has a custom image, or fallback to default product image
  const handleSelectAttribute = (attrKey: string, attrVal: string) => {
    const nextAttributes = { ...selectedAttributes, [attrKey]: attrVal };
    setSelectedAttributes(nextAttributes);

    const defaultProductImage =
      product.preview_image ||
      (product.product_images && product.product_images.length > 0
        ? product.product_images[0].original_url || product.product_images[0].preview_url
        : '') ||
      (allImages.length > 0 ? allImages[0].url : '');

    if (product.variants) {
      const match = product.variants.find((v) => {
        if (!v.attributes) return false;
        return Object.entries(nextAttributes).every(([k, val]) => v.attributes[k] === val);
      });

      if (match) {
        let variantImg: string | null = null;
        if (match.preview_image) {
          variantImg = match.preview_image;
        } else if (match.variant_images && match.variant_images.length > 0) {
          variantImg = match.variant_images[0].original_url || match.variant_images[0].preview_url || null;
        }

        if (variantImg) {
          setSelectedImage(variantImg);
        } else if (defaultProductImage) {
          // Fallback to default product image if variant has no custom image
          setSelectedImage(defaultProductImage);
        }
      } else if (defaultProductImage) {
        setSelectedImage(defaultProductImage);
      }
    }
  };

  // Price calculations
  const additionalPrice = selectedVariant?.additional_price || 0;
  const unitPrice = (product.unit_price || 0) + additionalPrice;
  const salePrice = product.sale_price && product.sale_price > 0 ? product.sale_price + additionalPrice : null;
  const effectivePrice = salePrice || unitPrice;
  const isDiscounted = salePrice !== null && salePrice < unitPrice;
  const discountPercent = isDiscounted ? Math.round(((unitPrice - salePrice) / unitPrice) * 100) : 0;

  // Stock status
  const currentStock = selectedVariant ? selectedVariant.qty : product.stock;
  const isOutOfStock = currentStock <= 0;

  // Wishlist state
  const isWishlisted = wishlist.includes(product.id);

  // Cart item preparation
  const handleAddToCart = (openDrawer = true) => {
    if (isOutOfStock) return;

    const defaultProductImage =
      product.preview_image ||
      (product.product_images && product.product_images.length > 0
        ? product.product_images[0].original_url || product.product_images[0].preview_url
        : '') ||
      (allImages.length > 0 ? allImages[0].url : '');

    const cartProduct: Product = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      unit_price: unitPrice,
      sale_price: salePrice || undefined,
      preview_image: selectedImage || defaultProductImage,
      image_url: selectedImage || defaultProductImage,
      category: product.category,
    };

    addToCart(cartProduct, quantity, selectedAttributes);

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-blue-600 transition">Products</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-700 font-medium">{product.category}</span>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-400 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* LEFT COLUMN: Gallery & Thumbnails */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {/* Main Image Stage */}
              <div className="relative aspect-4/3 w-full bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center group">
                <img
                  src={selectedImage || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80'}
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80';
                  }}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-500"
                />

                {/* Discount Badge */}
                {isDiscounted && (
                  <span className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-red-500 text-white font-black text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    SAVE {discountPercent}%
                  </span>
                )}

                {/* Wishlist Action Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-4 right-4 z-20 p-3 rounded-full backdrop-blur-md transition shadow-md cursor-pointer active:scale-95 ${
                    isWishlisted ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-white/80 text-slate-600 hover:text-rose-600 hover:bg-white'
                  }`}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>
              </div>

              {/* Thumbnails Gallery Carousel */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img.url)}
                      className={`relative w-20 h-20 shrink-0 rounded-xl bg-slate-50 border-2 overflow-hidden transition ${
                        selectedImage === img.url ? 'border-blue-600 ring-2 ring-blue-600/20 scale-95' : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                      }`}
                    >
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Product Info & Actions */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* SKU Code & Category Tag */}
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  {product.category && (
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {product.category}
                    </span>
                  )}
                  {product.sku_code && (
                    <span className="text-[11px] font-medium text-slate-400 border border-slate-200 px-2 py-0.5 rounded">
                      SKU: {product.sku_code}
                    </span>
                  )}
                  {product.warranty && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      🛡️ {product.warranty} Warranty
                    </span>
                  )}
                </div>

                {/* Product Title */}
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-3">
                  {product.name}
                </h1>

                {/* Rating & Reviews Bar */}
                <div className="flex items-center gap-3 mb-4 text-xs">
                  <div className="flex items-center gap-1 text-amber-400 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                    <Star className="w-4 h-4 fill-current text-amber-400" />
                    <span className="font-bold text-amber-900">{product.average_rating || 5.0}</span>
                  </div>
                  <span className="text-slate-400">
                    ({product.total_ratings || 0} reviews)
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Official Product
                  </span>
                </div>

                {/* Pricing Display */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-blue-600 tracking-tight">
                    {currencyIcon}{effectivePrice.toLocaleString()}
                  </span>
                  {isDiscounted && (
                    <span className="text-lg font-semibold text-slate-400 line-through">
                      {currencyIcon}{unitPrice.toLocaleString()}
                    </span>
                  )}
                  {isDiscounted && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Save {currencyIcon}{(unitPrice - (salePrice || 0)).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Variant Attributes Selector */}
                {Object.keys(attributeGroups).length > 0 && (
                  <div className="space-y-4 mb-6">
                    {Object.entries(attributeGroups).map(([attrKey, attrValues]) => (
                      <div key={attrKey}>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Select {attrKey}: <span className="text-blue-600 font-normal">{selectedAttributes[attrKey]}</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {attrValues.map((val) => {
                            const isSelected = selectedAttributes[attrKey] === val;
                            return (
                              <button
                                key={val}
                                onClick={() => handleSelectAttribute(attrKey, val)}
                                className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
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

                {/* Stock Status Indicator */}
                <div className="flex items-center gap-2 mb-6">
                  {isOutOfStock ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
                      <XCircle className="w-4 h-4" /> Out of Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" /> In Stock ({currentStock} items left)
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Selector & Action Buttons */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={isOutOfStock || quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg disabled:opacity-40 transition"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-slate-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                      disabled={isOutOfStock || quantity >= currentStock}
                      className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg disabled:opacity-40 transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(true)}
                    disabled={isOutOfStock}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-sm py-3.5 px-6 rounded-xl transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
                  </button>

                  {/* Buy Now Button */}
                  <button
                    onClick={() => handleAddToCart(true)}
                    disabled={isOutOfStock}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white font-bold text-sm py-3.5 px-6 rounded-xl transition shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    BUY NOW
                  </button>
                </div>

                {/* Trust Badges Assurance */}
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>100% Genuine Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Fast Nationwide Shipping</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Product Description / Specifications Tabs */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 mb-12">
          {/* Tab Header Links */}
          <div className="flex items-center gap-6 border-b border-slate-200 pb-4 mb-6">
            <button
              onClick={() => setActiveTab('specification')}
              className={`text-sm font-bold pb-2 relative transition ${
                activeTab === 'specification' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Specifications & Details
            </button>
            {product.summary && (
              <button
                onClick={() => setActiveTab('summary')}
                className={`text-sm font-bold pb-2 relative transition ${
                  activeTab === 'summary' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Key Highlights
              </button>
            )}
            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-sm font-bold pb-2 relative transition ${
                activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Customer Reviews ({product.total_ratings || 0})
            </button>
          </div>

          {/* TAB 1: HTML Specification / Description */}
          {activeTab === 'specification' && (
            <div className="prose prose-slate max-w-none prose-table:w-full prose-td:p-3 prose-tr:border-b prose-tr:border-slate-100">
              {product.description ? (
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              ) : (
                <p className="text-slate-400 text-sm italic">No detailed specifications provided for this product.</p>
              )}
            </div>
          )}

          {/* TAB 2: Summary Highlights */}
          {activeTab === 'summary' && product.summary && (
            <div className="prose prose-slate max-w-none">
              <div dangerouslySetInnerHTML={{ __html: product.summary }} />
            </div>
          )}

          {/* TAB 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="text-center">
                  <div className="text-4xl font-black text-slate-900">{product.average_rating || 5.0}</div>
                  <div className="flex justify-center text-amber-400 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <div className="text-xs text-slate-500">Based on {product.total_ratings || 0} reviews</div>
                </div>
              </div>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-slate-800">{rev.user_name}</span>
                        <span className="text-xs text-slate-400">{rev.created_at}</span>
                      </div>
                      <p className="text-xs text-slate-600">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">No reviews submitted yet for this product.</p>
              )}
            </div>
          )}
        </div>

        {/* Related Products Grid */}
        {product.related_products && product.related_products.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Related Products</h3>
                <p className="text-xs text-slate-500">Customers also bought these items</p>
              </div>
              <Link href="/products" className="text-xs font-bold text-blue-600 hover:underline">
                View All Catalog →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {product.related_products.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

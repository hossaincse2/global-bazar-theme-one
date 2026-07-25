import React from 'react';
import { getSingleProduct } from '@/services/productService';
import { ProductDetailView } from '@/components/product/ProductDetailView';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 0; // Dynamic rendering for latest product pricing & stock updates

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getSingleProduct(slug, 'en');

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <h2 className="text-3xl font-black text-slate-800">Product Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          The requested product &quot;{slug}&quot; could not be retrieved from the store catalog.
        </p>
      </div>
    );
  }

  return <ProductDetailView product={product} />;
}

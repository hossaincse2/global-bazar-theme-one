'use client';

import React from 'react';
import { CmsBlock } from '@/types/cms';
import { HeroImage } from '@/types/settings';
import { Product, Brand } from '@/types/product';
import { HeroBanner } from './HeroBanner';
import { FlashSaleSection } from './FlashSaleSection';
import { ElectronicsSection } from './ElectronicsSection';
import { FashionSection } from './FashionSection';
import { TrendingProducts } from './TrendingProducts';
import { NewArrivals } from './NewArrivals';
import { MegaDeals } from './MegaDeals';
import { TopBrands } from './TopBrands';
import { TrustBadgeBar } from '@/components/common/TrustBadgeBar';
import { AnnouncementBar } from '@/components/common/AnnouncementBar';

interface DynamicCmsSectionProps {
  block: CmsBlock;
  heroImages?: HeroImage[];
  products?: Product[];
  brands?: Brand[];
}

export const DynamicCmsSection: React.FC<DynamicCmsSectionProps> = ({ block, heroImages, products, brands }) => {
  const key = block.key.toLowerCase();

  if (key.includes('announcement')) {
    return null; // Rendered globally in RootLayout (AnnouncementBar)
  }

  if (key.includes('hero')) {
    return <HeroBanner heroImages={heroImages} cmsBlock={block} />;
  }

  if (key.includes('trust') || key.includes('badge')) {
    return <TrustBadgeBar cmsBlock={block} />;
  }

  if (key.includes('flash')) {
    return <FlashSaleSection cmsBlock={block} products={products} />;
  }

  if (key.includes('electronic')) {
    return <ElectronicsSection cmsBlock={block} products={products} />;
  }

  if (key.includes('fashion')) {
    return <FashionSection cmsBlock={block} products={products} />;
  }

  if (key.includes('trending') || key.includes('popular')) {
    return <TrendingProducts cmsBlock={block} products={products} />;
  }

  if (key.includes('arrival') || key.includes('new')) {
    return <NewArrivals cmsBlock={block} products={products} />;
  }

  if (key.includes('deal') || key.includes('promo')) {
    return <MegaDeals cmsBlock={block} />;
  }

  if (key.includes('brand')) {
    return <TopBrands cmsBlock={block} brands={brands} />;
  }

  // Generic CMS Block fallback rendering items
  return (
    <section className="py-10 px-4 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{block.title || block.name}</h3>
        {block.subtitle && <p className="text-xs text-slate-500 mb-6">{block.subtitle}</p>}
        {block.items && block.items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {block.items.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                {item.image_url && (
                  <img src={item.image_url} alt={item.title || 'CMS Item'} className="w-full h-40 object-cover rounded-xl mb-3" />
                )}
                {item.title && <h4 className="font-bold text-sm text-slate-800">{item.title}</h4>}
                {item.subtitle && <p className="text-xs text-slate-500 mt-1">{item.subtitle}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

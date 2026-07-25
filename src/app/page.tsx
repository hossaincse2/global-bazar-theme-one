import { getCmsBlocks } from '@/services/cmsService';
import { getHeroImages, getAllProducts } from '@/services/productService';
import { getAllBrands } from '@/services/categoryService';
import { DynamicCmsSection } from '@/components/cms/DynamicCmsSection';
import { TrustBadgeBar } from '@/components/common/TrustBadgeBar';
import { HeroBanner } from '@/components/cms/HeroBanner';
import { FlashSaleSection } from '@/components/cms/FlashSaleSection';
import { ElectronicsSection } from '@/components/cms/ElectronicsSection';
import { FashionSection } from '@/components/cms/FashionSection';
import { TrendingProducts } from '@/components/cms/TrendingProducts';
import { NewArrivals } from '@/components/cms/NewArrivals';
import { MegaDeals } from '@/components/cms/MegaDeals';
import { TopBrands } from '@/components/cms/TopBrands';
import { CmsBlock } from '@/types/cms';

export const revalidate = 0; // Dynamic rendering for instant admin updates

export default async function HomePage() {
  const [cmsBlocks, heroImages, productsRes, brands] = await Promise.all([
    getCmsBlocks('en'),
    getHeroImages(),
    getAllProducts({ locale: 'en', perPage: 24 }),
    getAllBrands('en'),
  ]);

  const products = productsRes?.data || [];

  // Sort blocks strictly by 'order' ascending (1, 2, 3, 4...)
  const activeOrderedBlocks = (cmsBlocks || [])
    .filter((block: CmsBlock) => block.is_active !== false)
    .sort((a: CmsBlock, b: CmsBlock) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6 bg-slate-50 pb-12">
      {activeOrderedBlocks && activeOrderedBlocks.length > 0 ? (
        // Render dynamically ordered active CMS blocks from Admin API
        activeOrderedBlocks.map((block: CmsBlock) => (
          <DynamicCmsSection
            key={block.id || block.key}
            block={block}
            heroImages={heroImages}
            products={products}
            brands={brands}
          />
        ))
      ) : (
        // Fallback default dynamic section layout ordered 1 through 9
        <>
          <HeroBanner heroImages={heroImages} />
          <TrustBadgeBar />
          <FlashSaleSection products={products} />
          <ElectronicsSection products={products} />
          <FashionSection products={products} />
          <TrendingProducts products={products} />
          <NewArrivals products={products} />
          <MegaDeals />
          <TopBrands brands={brands} />
        </>
      )}
    </div>
  );
}

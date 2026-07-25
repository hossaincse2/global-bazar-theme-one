import { getCmsBlocks } from '@/services/cmsService';
import { getHeroImages } from '@/services/productService';
import { getAllBrands } from '@/services/categoryService';
import { TrustBadgeBar } from '@/components/common/TrustBadgeBar';
import { HeroBanner } from '@/components/cms/HeroBanner';
import { TopBrands } from '@/components/cms/TopBrands';
import { HomeProductsLoader } from '@/components/home/HomeProductsLoader';
import { CmsBlock } from '@/types/cms';

export const dynamic = 'force-dynamic'; // Always SSR, never cache this page

export default async function HomePage() {
  const [cmsBlocks, heroImages, brands] = await Promise.all([
    getCmsBlocks('en'),
    getHeroImages(),
    getAllBrands('en'),
  ]);

  // Sort active blocks by order
  const activeBlocks: CmsBlock[] = (cmsBlocks || [])
    .filter((b: CmsBlock) => b.is_active !== false)
    .sort((a: CmsBlock, b: CmsBlock) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-0 bg-slate-50 pb-12">
      {/* Hero Banner - SSR (from server) */}
      <HeroBanner heroImages={heroImages} />

      {/* Trust Badges */}
      <TrustBadgeBar />

      {/* Product Sections - CLIENT-SIDE fetch (visible in browser Network tab) */}
      <HomeProductsLoader cmsBlocks={activeBlocks} />

      {/* Top Brands - SSR */}
      <TopBrands brands={brands} />
    </div>
  );
}

import { Suspense } from "react";
import { HeroMarketplace } from "@/components/features/HeroMarketplace";
import { CategoryQuickLinks } from "@/components/features/CategoryQuickLinks";
import { FlashSaleSection } from "@/components/features/FlashSaleSection";
import { VoucherStrip } from "@/components/features/VoucherStrip";
import { EcommerceProductGrid } from "@/components/features/EcommerceProductGrid";
import { LookbookBanner } from "@/components/features/LookbookBanner";
import { CraftStoriesSection } from "@/components/features/CraftStoriesSection";
import { productService } from "@/services/product.service";
import type { Product } from "@/types/product";

export const instant = false;

// Skeleton loader cho Feed Sản Phẩm Trang Chủ
function HomeProductGridSkeleton() {
  return (
    <section className="py-8 bg-stone-100/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b-2 border-amber-800 pb-3 mb-4 flex items-center justify-between">
          <div className="h-6 w-60 bg-stone-200 animate-pulse rounded-md" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 w-28 bg-stone-200 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden border border-stone-200 p-3 flex flex-col gap-3 animate-pulse"
            >
              <div className="aspect-4/5 bg-stone-200 rounded-lg w-full" />
              <div className="h-4 bg-stone-200 rounded w-3/4" />
              <div className="h-5 bg-stone-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Component async chuyên biệt để truy vấn dữ liệu sản phẩm trong Suspense
async function HomeProductFeed() {
  let products: Product[] = [];
  try {
    products = await productService.getProducts({ limit: 24 });
  } catch (error) {
    console.error("Lỗi nạp danh sách sản phẩm từ API Backend:", error);
    products = [];
  }

  return <EcommerceProductGrid products={products} />;
}

export default function Home() {
  return (
    <main className="min-h-screen pb-16 md:pb-8">
      {/* 1. Hero Marketplace Banner Slider + Side Promos + Trust Badges */}
      <HeroMarketplace />

      {/* 2. Round Category Quick Links Icons */}
      <CategoryQuickLinks />

      {/* 3. Flash Sale Section with Countdown Timer */}
      <FlashSaleSection />

      {/* 4. Voucher & Discount Codes Collection */}
      <VoucherStrip />

      {/* 5. Main E-Commerce Feed: Gợi Ý Hôm Nay (Đồng bộ trực tiếp từ API) */}
      <Suspense fallback={<HomeProductGridSkeleton />}>
        <HomeProductFeed />
      </Suspense>

      {/* 6. Bespoke Tailoring & Sa Pa Artisans */}
      <LookbookBanner />

      {/* 7. Traditional Craft Heritage Stories */}
      <CraftStoriesSection />
    </main>
  );
}

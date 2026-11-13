import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { EcommerceProductGrid } from "@/components/features/EcommerceProductGrid";
import { VoucherStrip } from "@/components/features/VoucherStrip";
import { productService } from "@/services/product.service";
import type { Product } from "@/types/product";

export const metadata: Metadata = {
  title: "Tất Cả Sản Phẩm | HMONG.MALL",
  description: "Khám phá hàng trăm mẫu trang phục Hmong cách tân, áo khoác thổ cẩm, khăn batik sáp ong và trang sức bạc Sa Pa.",
};

// Cho phép route hoạt động linh hoạt kể cả khi API chưa có dữ liệu cache tĩnh
export const instant = false;

// Skeleton loader hiển thị tức thì trong lúc dữ liệu sản phẩm đang được stream
function ProductGridSkeleton() {
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

// Component async chuyên biệt để truy vấn danh sách sản phẩm bên trong Suspense
async function ProductsGridFeed() {
  let products: Product[] = [];

  try {
    products = await productService.getProducts({ limit: 100 });
  } catch (error) {
    console.error("Lỗi nạp sản phẩm từ API /products/:", error);
    products = [];
  }

  return (
    <EcommerceProductGrid
      products={products}
      title="TẤT CẢ SẢN PHẨM ĐANG MỞ BÁN"
    />
  );
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen py-6">
      {/* Breadcrumb & Marketplace Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <nav className="text-xs text-stone-500 mb-3 flex items-center space-x-2">
          <Link href="/" className="hover:text-amber-800 transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-semibold">Tất cả sản phẩm</span>
        </nav>

        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-sans font-black text-stone-900 tracking-tight uppercase">
              Chợ Thời Trang & Di Sản Hmong
            </h1>
            <p className="mt-1 text-stone-600 text-xs sm:text-sm">
              Khám phá các sản phẩm thổ cẩm thủ công, trang phục truyền thống và cách tân đồng bộ từ hệ thống.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              🚚 100% Freeship Đơn Từ 300K
            </span>
          </div>
        </div>
      </div>

      {/* Vouchers */}
      <VoucherStrip />

      {/* Main E-Commerce Grid with Streaming Suspense */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductsGridFeed />
      </Suspense>
    </main>
  );
}

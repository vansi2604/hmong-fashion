import Link from "next/link";
import { notFound } from "next/navigation";
import { formatVND } from "@/lib/utils";
import { productService } from "@/services/product.service";
import { getProductImageUrl, getCategoryLabel, formatCurrency, getStockBadge } from "@/utils/product.utils";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const instant = false;

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  let product = null;
  try {
    product = await productService.getProductBySlugOrId(slug);
  } catch (error) {
    console.error("Lỗi nạp chi tiết sản phẩm từ API:", error);
  }

  if (!product) {
    notFound();
  }

  const discount =
    product.discountPercent ||
    (product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null);

  const mainImageUrl = getProductImageUrl(product);
  const categoryLabel = getCategoryLabel(product.category);
  const stockInfo = getStockBadge(product.stock ?? 0);

  return (
    <main className="min-h-screen py-4 sm:py-6 bg-stone-100/50 pb-20 md:pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-stone-500 mb-3 flex items-center space-x-2">
          <Link href="/" className="hover:text-amber-800 transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-amber-800 transition-colors">
            {categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Card Box (Shopee / Lazada style) */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Product Gallery (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 relative group">
                <img
                  src={mainImageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                  <span className="bg-rose-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-xs">
                    HMONG.MALL
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${stockInfo.badgeClass}`}>
                    {stockInfo.label}
                  </span>
                </div>
              </div>

              {/* Album ảnh phụ nếu có */}
              {product.images && product.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {product.images.map((img, i) => (
                    <div
                      key={img.id || i}
                      className="aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-50 cursor-pointer hover:border-amber-600 transition-colors"
                    >
                      <img
                        src={getProductImageUrl({ primary_image_url: img.image_url })}
                        alt={`Chi tiết ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Share & Wishlist Bar */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-2 px-1">
                <div className="flex items-center gap-3">
                  <span>Chia sẻ:</span>
                  <span className="cursor-pointer hover:text-stone-900">Facebook</span>
                  <span className="cursor-pointer hover:text-stone-900">Zalo</span>
                  <span className="cursor-pointer hover:text-stone-900">Sao chép link</span>
                </div>
                <button type="button" className="flex items-center gap-1 hover:text-rose-600 cursor-pointer">
                  <span>❤️</span>
                  <span>Đã thích (428)</span>
                </button>
              </div>
            </div>

            {/* Right: Product Purchasing Details (7 cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              {/* Product Title */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-xs uppercase">
                    Yêu Thích+
                  </span>
                  <span className="text-xs text-stone-500">{categoryLabel} Sa Pa</span>
                </div>
                <h1 className="text-lg sm:text-2xl font-bold text-stone-900 leading-snug">
                  {product.name}
                </h1>
                <span className="text-[11px] text-stone-400 font-mono mt-0.5 block">
                  Mã sản phẩm: #{product.id} • /{product.slug}
                </span>
              </div>

              {/* Rating, Reviews and Sold Counter Strip */}
              <div className="flex items-center gap-4 text-xs sm:text-sm border-b border-stone-100 pb-3">
                <div className="flex items-center gap-1.5 text-rose-600 font-bold border-b border-rose-600 pb-0.5">
                  <span>{product.rating || 5.0}</span>
                  <div className="flex text-amber-500 text-xs">★★★★★</div>
                </div>
                <span className="text-stone-300">|</span>
                <div className="text-stone-700">
                  <span className="font-bold underline text-stone-900">{product.reviewCount || 120}</span> Đánh Giá
                </div>
                <span className="text-stone-300">|</span>
                <div className="text-stone-700">
                  <span className="font-bold text-stone-900">{product.soldCount || 84}</span> Đã Bán
                </div>
              </div>

              {/* 2 Mức Giá: Giá Mua Đứt & Giá Cho Thuê (Hybrid Retail & Rental) */}
              <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200/90 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Giá Mua */}
                <div className="space-y-1">
                  <span className="text-xs text-stone-500 uppercase tracking-wider font-bold block">
                    Giá mua đứt sản phẩm
                  </span>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-black text-rose-600">
                      {formatVND(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-stone-400 line-through">
                        {formatVND(product.originalPrice)}
                      </span>
                    )}
                    {discount && (
                      <span className="bg-amber-400 text-amber-950 font-black text-[10px] px-1.5 py-0.5 rounded-md uppercase">
                        -{discount}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Giá Thuê Theo Ngày */}
                <div className="sm:border-l sm:border-stone-200 sm:pl-4 space-y-1">
                  <span className="text-xs text-stone-500 uppercase tracking-wider font-bold block">
                    Giá thuê trang phục
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                      {formatCurrency(product.rental_price_per_day)}
                    </span>
                    <span className="text-xs font-normal text-stone-500">/ngày</span>
                  </div>
                  <span className="text-[11px] text-emerald-800 font-medium block">
                    ⚡ Phù hợp chụp ảnh kỷ yếu, lễ hội du lịch
                  </span>
                </div>
              </div>

              {/* Vouchers Section */}
              <div className="flex items-start gap-4 text-xs py-2">
                <span className="text-stone-500 font-medium w-24 flex-shrink-0">Mã Giảm Giá:</span>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-xs font-semibold">
                    Giảm 50k
                  </span>
                  <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-xs font-semibold">
                    Giảm 100k
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-xs font-semibold">
                    🚚 Freeship Xtra
                  </span>
                </div>
              </div>

              {/* Shipping Block */}
              <div className="flex items-start gap-4 text-xs py-2 border-t border-stone-100">
                <span className="text-stone-500 font-medium w-24 flex-shrink-0">Vận Chuyển:</span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-stone-800 font-semibold">
                    <span>🚚 Miễn phí vận chuyển</span>
                    <span className="text-[11px] font-normal text-stone-500">cho đơn hàng từ 300.000₫</span>
                  </div>
                  <p className="text-stone-500 text-[11px]">
                    Gửi từ: <strong className="text-stone-700">{product.location || "Sa Pa, Lào Cai"}</strong> | Nhận hàng sau 2-3 ngày
                  </p>
                </div>
              </div>

              {/* Mô tả chất liệu di sản */}
              {product.description && (
                <div className="flex items-start gap-4 text-xs py-2 border-t border-stone-100">
                  <span className="text-stone-500 font-medium w-24 flex-shrink-0">Chất Liệu:</span>
                  <p className="text-stone-700 text-xs leading-relaxed flex-1">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 text-xs py-2 border-t border-stone-100">
                <span className="text-stone-500 font-medium w-24 flex-shrink-0">Số Lượng:</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
                    <button type="button" className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 cursor-pointer">
                      -
                    </button>
                    <span className="px-4 py-1.5 font-bold text-stone-900 bg-white">1</span>
                    <button type="button" className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 cursor-pointer">
                      +
                    </button>
                  </div>
                  <span className="text-stone-500 text-[11px]">
                    {product.stock && product.stock > 0
                      ? `${product.stock} sản phẩm có sẵn trong kho`
                      : 'Tạm hết hàng mua đứt'}
                  </span>
                </div>
              </div>

              {/* CTA Buttons: Mua Đứt & Thuê Trang Phục */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-stone-100">
                {/* Nút Mua Hàng */}
                <Link
                  href="/cart"
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl border-2 border-rose-600 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
                >
                  <span>🛒</span>
                  <span>{product.stock && product.stock > 0 ? 'Thêm Vào Giỏ Hàng' : 'Xem Giỏ Hàng'}</span>
                </Link>

                {/* Nút Thuê Trang Phục */}
                <Link
                  href="/rentals"
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 text-center"
                >
                  <span>👘</span>
                  <span>Thuê Trang Phục</span>
                </Link>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-3 text-[11px] text-stone-600 text-center bg-stone-50 p-2.5 rounded-xl">
                <div>🛡️ 7 Ngày Trả Hàng</div>
                <div>✦ 100% Thủ Công Bản Địa</div>
                <div>🚚 Freeship Xtra</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

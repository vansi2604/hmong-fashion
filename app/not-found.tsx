import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Không Tìm Thấy Trang | HMONG.MALL",
  description:
    "Trang phục thổ cẩm hoặc liên kết bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang địa chỉ mới.",
};

/**
 * Giao diện 404 Not Found cấp Root trong Next.js App Router.
 * Tự động hiển thị khi route không khớp hoặc khi hàm notFound() được kích hoạt
 * (ví dụ: khi khách hàng truy cập sản phẩm hoặc bài viết không tồn tại).
 */
export default function NotFound() {
  const quickCategories = [
    { name: "Áo Khoác Thổ Cẩm", href: "/products?category=ao-khoac", icon: "🧥" },
    { name: "Khăn Choàng Batik", href: "/products?category=khan-batik", icon: "🧣" },
    { name: "Đầm Linen Cách Tân", href: "/products?category=dam-linen", icon: "👗" },
    { name: "Trang Sức Bạc Sa Pa", href: "/products?category=trang-suc-bac", icon: "💍" },
    { name: "Kênh Đặt May Đo", href: "/tailors", icon: "✂️" },
  ];

  return (
    <main className="min-h-[75vh] bg-[#faf8f5] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-xl w-full text-center">
        {/* Đồ họa số 404 mang âm hưởng dệt vải & thổ cẩm Hmong */}
        <div className="relative inline-block mb-4">
          <span className="text-7xl sm:text-9xl font-black tracking-widest text-stone-200 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-xs sm:text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
              Trang không tồn tại
            </span>
          </div>
        </div>

        {/* Tiêu đề & Thông điệp */}
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-3">
          Không tìm thấy trang hoặc sản phẩm
        </h1>
        <p className="text-sm sm:text-base text-stone-600 mb-8 max-w-md mx-auto leading-relaxed">
          Mẫu trang phục thổ cẩm hoặc đường dẫn bạn truy cập có thể đã hết hàng, đổi tên hoặc tạm thời ngừng kinh doanh.
        </p>

        {/* Nút điều hướng chính */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition-all shadow-xs active:scale-[0.98]"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Về Trang Chủ
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-all shadow-xs active:scale-[0.98]"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            Xem Tất Cả Sản Phẩm
          </Link>
        </div>

        {/* Gợi ý danh mục nhanh */}
        <div className="pt-6 border-t border-stone-200/80">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
            Gợi ý danh mục thổ cẩm nổi bật
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {quickCategories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200 transition-all hover:border-amber-400"
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

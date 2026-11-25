import React from "react";

/**
 * Loading fallback cho toàn bộ route cấp root trong App Router.
 * Tự động kích hoạt khi chuyển trang hoặc nạp dữ liệu Server Component.
 * Thiết kế giao diện khung xương (Skeleton) ăn khớp hoàn hảo với màu sắc
 * nhận diện thương hiệu HMONG.MALL (chàm Hmong Indigo và vàng hổ phách Amber).
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      {/* 1. Thanh tiến trình tải màu hổ phách phía trên cùng */}
      <div className="w-full h-1 bg-stone-200 overflow-hidden">
        <div className="h-full bg-linear-to-r from-amber-600 via-amber-400 to-amber-600 animate-[pulse_1.5s_ease-in-out_infinite] w-full" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 flex-1">
        {/* 2. Khung Skeleton Hero / Banner đầu trang */}
        <div className="w-full bg-stone-200/70 rounded-2xl h-44 sm:h-64 md:h-80 animate-pulse relative overflow-hidden flex flex-col justify-end p-6 sm:p-10">
          <div className="h-4 sm:h-5 bg-stone-300/80 rounded w-1/4 mb-3" />
          <div className="h-7 sm:h-10 bg-stone-300/90 rounded-md w-2/3 sm:w-1/2 mb-4" />
          <div className="h-9 w-32 bg-stone-300 rounded-full" />
        </div>

        {/* 3. Skeleton Danh mục nhanh (Category Quick Links) */}
        <div className="space-y-3">
          <div className="h-5 w-40 bg-stone-200 animate-pulse rounded" />
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-4 py-2 bg-white rounded-full border border-stone-200/80 shrink-0 animate-pulse"
              >
                <div className="w-7 h-7 rounded-full bg-stone-200" />
                <div className="w-20 h-3.5 bg-stone-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* 4. Skeleton Lưới Sản phẩm Thổ Cẩm (Product Grid) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="h-6 w-52 bg-stone-200 animate-pulse rounded" />
            <div className="h-4 w-24 bg-stone-200 animate-pulse rounded" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden border border-stone-200/70 p-2.5 sm:p-3 flex flex-col gap-2.5 animate-pulse shadow-xs"
              >
                {/* Hình ảnh sản phẩm tỷ lệ 4:5 */}
                <div className="aspect-4/5 bg-stone-200/80 rounded-lg w-full relative">
                  <div className="absolute top-2 left-2 w-10 h-4 bg-stone-300/80 rounded-sm" />
                </div>
                {/* Tên danh mục */}
                <div className="h-3 bg-stone-200 rounded w-1/3" />
                {/* Tên sản phẩm */}
                <div className="h-4 bg-stone-200 rounded w-5/6" />
                {/* Giá tiền & Đánh giá */}
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-stone-100">
                  <div className="h-4 bg-amber-200/60 rounded w-2/5" />
                  <div className="h-3 bg-stone-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Gợi ý trạng thái dệt vải / nạp dữ liệu */}
        <div className="text-center py-4 text-xs text-stone-600 flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-600 animate-ping" />
          <span>Đang nạp dữ liệu trang phục & hoa văn thổ cẩm HMONG.MALL...</span>
        </div>
      </div>
    </div>
  );
}

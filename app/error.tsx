"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary cấp Route trong Next.js App Router.
 * Bắt tất cả các ngoại lệ không mong muốn xảy ra trong page và route con,
 * đồng thời giữ nguyên Navbar và Footer của Root Layout.
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Ghi nhận lỗi chẩn đoán cho đội ngũ phát triển / giám sát
    console.error("HMONG.MALL Route Error Boundary:", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] bg-[#faf8f5] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-sm text-center">
        {/* Biểu tượng cảnh báo mang phong cách hoa văn thổ cẩm */}
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-5 text-amber-700">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        {/* Tiêu đề & Thông điệp thân thiện */}
        <span className="inline-block text-[11px] font-bold tracking-wider text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full uppercase mb-2">
          Sự cố kết nối
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mb-2">
          Đã xảy ra sự cố khi tải dữ liệu
        </h1>
        <p className="text-sm text-stone-600 mb-6 leading-relaxed">
          Rất tiếc vì sự bất tiện này. Dữ liệu trang phục thổ cẩm chưa thể hiển thị ngay. Vui lòng thử tải lại hoặc quay về trang chủ.
        </p>

        {/* Các nút hành động xử lý */}
        <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium transition-all shadow-xs active:scale-[0.98] cursor-pointer"
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
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            Thử lại ngay
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-medium transition-all active:scale-[0.98]"
          >
            Về trang chủ
          </Link>
        </div>

        {/* Mã chẩn đoán lỗi rút gọn (Diagnostic Digest) */}
        {error?.digest && (
          <div className="mt-6 pt-4 border-t border-stone-100 text-[11px] text-stone-500 font-mono">
            Mã chẩn đoán: <span className="text-stone-600">{error.digest}</span>
          </div>
        )}
      </div>
    </main>
  );
}

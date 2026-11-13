"use client";

import React from "react";
import Link from "next/link";
import { formatVND } from "@/lib/utils";

export default function DashboardAnalyticsPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-stone-500 mb-1.5 font-medium">
            <Link href="/" className="hover:text-amber-800 transition-colors">
              Trang Chủ
            </Link>
            <span>/</span>
            <Link href="/dashboard_control" className="hover:text-amber-800 transition-colors">
              Bảng Điều Khiển
            </Link>
            <span>/</span>
            <span className="text-amber-900 font-bold">Báo Cáo & Thống Kê</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
            Báo Cáo & Phân Tích Doanh Thu
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Biểu đồ tăng trưởng doanh số, tỷ lệ chuyển đổi đơn hàng và dự báo tồn kho thổ cẩm.
          </p>
        </div>

        <Link
          href="/dashboard_control"
          className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-xs self-start sm:self-auto"
        >
          ← Bảng Điều Khiển
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <span className="text-xs text-stone-400 font-bold uppercase">Doanh thu tháng này</span>
          <p className="text-2xl font-serif font-black text-stone-900">{formatVND(248500000)}</p>
          <p className="text-xs text-emerald-700 font-semibold">↑ +18.2% so với tháng trước</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <span className="text-xs text-stone-400 font-bold uppercase">Tổng đơn hoàn tất</span>
          <p className="text-2xl font-serif font-black text-stone-900">312 đơn hàng</p>
          <p className="text-xs text-emerald-700 font-semibold">Tỷ lệ giao thành công 96.8%</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <span className="text-xs text-stone-400 font-bold uppercase">Giá trị trung bình/đơn</span>
          <p className="text-2xl font-serif font-black text-stone-900">{formatVND(796000)}</p>
          <p className="text-xs text-amber-800 font-semibold">Tăng do khách đặt may đo riêng</p>
        </div>
      </div>

      {/* Top sản phẩm bán chạy */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-serif font-black text-lg text-stone-900">Top 3 Sản Phẩm Bán Chạy Nhất</h3>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-stone-900">1. Áo Khoác Bomber Chàm Sáp Ong</span>
            <span className="text-amber-900 font-bold">142 sản phẩm • {formatVND(262700000)}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-stone-900">2. Khăn Choàng Batik Nhuộm Chàm Tự Nhiên</span>
            <span className="text-amber-900 font-bold">98 sản phẩm • {formatVND(60760000)}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="font-bold text-stone-900">3. Váy Đầm Cách Tân May Đo Theo Số Đo</span>
            <span className="text-amber-900 font-bold">64 bộ • {formatVND(179200000)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}

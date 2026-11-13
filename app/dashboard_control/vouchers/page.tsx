"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatVND } from "@/lib/utils";
import { MOCK_VOUCHERS } from "@/lib/mock-data";

export default function DashboardVouchersPage() {
  const [vouchers, setVouchers] = useState(MOCK_VOUCHERS);

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
            <span className="text-amber-900 font-bold">Mã Giảm Giá</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
            Quản Lý Mã Khuyến Mãi & Voucher
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Cấu hình mã giảm giá freeship toàn quốc, coupon flash sale và ưu đãi may đo theo mùa lễ hội.
          </p>
        </div>

        <Link
          href="/dashboard_control"
          className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-xs self-start sm:self-auto"
        >
          ← Bảng Điều Khiển
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {vouchers.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-mono font-bold text-xs uppercase tracking-wider">
                {v.code}
              </span>
              <span className="text-[10px] text-stone-400 font-semibold">{v.expiry}</span>
            </div>

            <div>
              <h3 className="font-serif font-black text-base text-stone-900">
                {v.discountText}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Áp dụng cho đơn hàng từ {formatVND(v.minSpend)}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-bold">● Đang mở áp dụng</span>
              <button
                type="button"
                onClick={() => alert(`Chỉnh sửa voucher ${v.code}`)}
                className="text-stone-400 hover:text-stone-900 font-semibold"
              >
                Cấu hình
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

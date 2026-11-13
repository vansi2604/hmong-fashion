"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatVND } from "@/lib/utils";

export default function DashboardRentalsPage() {
  const [rentals, setRentals] = useState([
    {
      id: 1,
      booking_code: "RENT-20261113-44E2",
      customer_name: "Trần Mai Anh",
      customer_phone: "0904 789 012",
      product_name: "Set Trang Phục Hmong Đen Sa Pa Đầy Đủ Nón Bạc",
      start_date: "2026-11-13",
      end_date: "2026-11-16",
      total_price: 650000,
      deposit_amount: 300000,
      deposit_status: "DEPOSITED",
      status: "ACTIVE",
      notes: "Khách lấy đồ sáng 13/11 tại cửa hàng Sa Pa để chụp ảnh Tả Van.",
    },
    {
      id: 2,
      booking_code: "RENT-20261114-12B7",
      customer_name: "Nguyễn Hải Yến",
      customer_phone: "0918 333 444",
      product_name: "Váy Thổ Cẩm Hoa Hmong Cách Tân Chụp Kỷ Yếu",
      start_date: "2026-11-15",
      end_date: "2026-11-17",
      total_price: 500000,
      deposit_amount: 200000,
      deposit_status: "DEPOSITED",
      status: "CONFIRMED",
      notes: "Hẹn giao khách tại khách sạn Bamboo Sa Pa chiều 14/11.",
    },
    {
      id: 3,
      booking_code: "RENT-20261110-88C9",
      customer_name: "Vũ Phương Linh",
      customer_phone: "0977 123 999",
      product_name: "Bộ Đồ Nam Hmong Xanh Đậm + Khăn Quấn Đầu",
      start_date: "2026-11-10",
      end_date: "2026-11-12",
      total_price: 450000,
      deposit_amount: 200000,
      deposit_status: "REFUNDED",
      status: "RETURNED",
      notes: "Đã trả đồ nguyên vẹn, đã hoàn lại 200k tiền cọc cho khách.",
    },
  ]);

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
            <span className="text-amber-900 font-bold">Cho Thuê Trang Phục</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
            Quản Lý Lịch Cho Thuê Trang Phục (Rentals)
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Theo dõi ngày giao, hạn trả, tình trạng giữ cọc và đồ thuê chụp ảnh lễ hội.
          </p>
        </div>

        <Link
          href="/dashboard_control"
          className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-xs self-start sm:self-auto"
        >
          ← Bảng Điều Khiển
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3 px-4">Mã Đặt Thuê</th>
                <th className="py-3 px-4">Khách Hàng</th>
                <th className="py-3 px-4">Trang Phục Thuê</th>
                <th className="py-3 px-4">Thời Gian Thuê</th>
                <th className="py-3 px-4">Tiền Thuê & Cọc</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rentals.map((r) => (
                <tr key={r.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                    {r.booking_code}
                  </td>
                  <td className="py-3.5 px-4">
                    <strong className="block text-stone-900">{r.customer_name}</strong>
                    <span className="text-stone-400 text-[11px]">{r.customer_phone}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-stone-800 max-w-xs">
                    {r.product_name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="block font-semibold text-stone-900">
                      {r.start_date} → {r.end_date}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-stone-900 block">
                      {formatVND(r.total_price)}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Cọc: {formatVND(r.deposit_amount)} ({r.deposit_status})
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        r.status === "ACTIVE"
                          ? "bg-purple-100 text-purple-900 border-purple-300"
                          : r.status === "RETURNED"
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : "bg-blue-100 text-blue-900 border-blue-300"
                      }`}
                    >
                      {r.status === "ACTIVE"
                        ? "Đang thuê"
                        : r.status === "RETURNED"
                        ? "Đã trả đồ"
                        : "Đã duyệt lịch"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Cập nhật đơn thuê ${r.booking_code}`)}
                      className="px-3 py-1 bg-stone-900 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Xử lý
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

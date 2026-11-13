"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatVND } from "@/lib/utils";

export default function DashboardCustomersPage() {
  const [customers] = useState([
    {
      id: 1,
      name: "Sùng A Dũng",
      phone: "0988 123 456",
      email: "sungadung@gmail.com",
      address: "Bản Cát Cát, Sa Pa, Lào Cai",
      totalSpent: 8450000,
      orderCount: 5,
      tier: "VIP Kim Cương",
      tierColor: "bg-amber-100 text-amber-900 border-amber-300",
    },
    {
      id: 2,
      name: "Hoàng Thị Mỷ",
      phone: "0912 345 678",
      email: "hoangmy.sapa@gmail.com",
      address: "Sa Pa, Lào Cai",
      totalSpent: 12600000,
      orderCount: 8,
      tier: "Khách May Đo Riêng",
      tierColor: "bg-purple-100 text-purple-900 border-purple-300",
    },
    {
      id: 3,
      name: "Trần Mai Anh",
      phone: "0904 789 012",
      email: "maianh.tran@gmail.com",
      address: "Hà Nội",
      totalSpent: 3400000,
      orderCount: 3,
      tier: "Thành Viên Thân Thiết",
      tierColor: "bg-blue-100 text-blue-900 border-blue-300",
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
            <span className="text-amber-900 font-bold">Khách Hàng</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
            Quản Lý Danh Bạ & Khách Hàng Thân Thiết
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Lưu trữ số đo, lịch sử may đo, chi tiêu tích lũy và xếp hạng hội viên.
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
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[10px] tracking-wider font-bold">
              <th className="py-3 px-4">Khách Hàng</th>
              <th className="py-3 px-4">Số Điện Thoại</th>
              <th className="py-3 px-4">Địa Chỉ</th>
              <th className="py-3 px-4">Đơn Đã Mua</th>
              <th className="py-3 px-4">Tổng Chi Tiêu</th>
              <th className="py-3 px-4">Phân Hạng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-amber-50/30 transition-colors">
                <td className="py-3.5 px-4 font-bold text-stone-900">
                  {c.name}
                  <span className="block text-[11px] font-normal text-stone-400">{c.email}</span>
                </td>
                <td className="py-3.5 px-4 text-stone-700">{c.phone}</td>
                <td className="py-3.5 px-4 text-stone-600">{c.address}</td>
                <td className="py-3.5 px-4 font-semibold text-stone-800">{c.orderCount} đơn</td>
                <td className="py-3.5 px-4 font-bold text-amber-900">
                  {formatVND(c.totalSpent)}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${c.tierColor}`}
                  >
                    {c.tier}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

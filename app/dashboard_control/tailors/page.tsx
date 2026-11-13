"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatVND } from "@/lib/utils";

export default function DashboardTailorsPage() {
  const [filterStatus, setFilterStatus] = useState("ALL");

  const [tailorOrders, setTailorOrders] = useState([
    {
      id: 1,
      order_code: "TAILOR-20261113-91C4",
      customer_name: "Hoàng Thị Mỷ",
      customer_phone: "0912 345 678",
      customer_address: "Số 45 Đường Fansipan, Sa Pa, Lào Cai",
      design_code: "VAY-HMOOB-HOA-02",
      height: 162,
      weight: 52,
      measurements: { bust: 88, waist: 68, hips: 92, shoulder_width: 38, dress_length: 115 },
      estimated_price: 2800000,
      deposit_amount: 1000000,
      deposit_status: "DEPOSITED",
      status: "IN_PROGRESS",
      notes: "Vải lanh dệt tay, nhuộm chàm tự nhiên, cổ đính hoa văn con ốc ngũ sắc.",
      artisan: "Nghệ nhân Vàng Thị Mai (Bản Tả Van)",
      created_at: "2026-11-13T08:45:00Z",
    },
    {
      id: 2,
      order_code: "TAILOR-20261112-55D1",
      customer_name: "Lê Thảo Nhi",
      customer_phone: "0987 654 321",
      customer_address: "Hoàn Kiếm, Hà Nội",
      design_code: "AO-KHOAC-CHAM-NAM-01",
      height: 175,
      weight: 68,
      measurements: { bust: 96, waist: 82, hips: 98, shoulder_width: 44, dress_length: 72 },
      estimated_price: 3500000,
      deposit_amount: 0,
      deposit_status: "PENDING_DEPOSIT",
      status: "PENDING_CONFIRMATION",
      notes: "May áo khoác form đứng, phối thổ cẩm cổ tay và ve áo.",
      artisan: "Chưa phân công",
      created_at: "2026-11-12T16:20:00Z",
    },
    {
      id: 3,
      order_code: "TAILOR-20261110-33A8",
      customer_name: "Trần Bảo Ngọc",
      customer_phone: "0934 112 233",
      customer_address: "TP. Đà Nẵng",
      design_code: "DAM-DA-HOI-BATIK-05",
      height: 158,
      weight: 48,
      measurements: { bust: 84, waist: 64, hips: 89, shoulder_width: 36, dress_length: 120 },
      estimated_price: 4200000,
      deposit_amount: 2000000,
      deposit_status: "DEPOSITED",
      status: "READY",
      notes: "May xong, chuẩn bị đóng hộp quà thổ cẩm gửi chuyển phát nhanh.",
      artisan: "Nghệ nhân Thào Thị Dở (Bắc Hà)",
      created_at: "2026-11-10T10:15:00Z",
    },
  ]);

  const filtered = tailorOrders.filter((t) => {
    if (filterStatus === "ALL") return true;
    return t.status === filterStatus;
  });

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
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
            <span className="text-amber-900 font-bold">Quản Trị May Đo</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
            Quản Trị May Đo Cá Nhân Hóa (Bespoke Tailoring)
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Theo dõi đơn đặt may theo số đo cơ thể, phân công nghệ nhân Sa Pa / Bắc Hà và tiền cọc.
          </p>
        </div>

        <Link
          href="/dashboard_control"
          className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-xs self-start sm:self-auto"
        >
          ← Bảng Điều Khiển
        </Link>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200/90 shadow-xs flex items-center gap-2 overflow-x-auto">
        {[
          { key: "ALL", label: "Tất cả đơn may đo" },
          { key: "PENDING_CONFIRMATION", label: "Chờ gọi xác nhận & lấy cọc" },
          { key: "IN_PROGRESS", label: "Đang may đo tại xưởng" },
          { key: "READY", label: "Đã may xong (Sẵn sàng giao)" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilterStatus(tab.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              filterStatus === tab.key
                ? "bg-amber-600 text-stone-950 font-bold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Danh sách thẻ may đo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4 relative"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-amber-900">
                  {item.order_code}
                </span>
                <h3 className="font-bold text-base text-stone-900 mt-0.5">
                  {item.customer_name}
                </h3>
                <span className="text-xs text-stone-500">{item.customer_phone}</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                  item.status === "READY"
                    ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                    : item.status === "IN_PROGRESS"
                    ? "bg-purple-100 text-purple-900 border-purple-300"
                    : "bg-amber-100 text-amber-900 border-amber-300"
                }`}
              >
                {item.status === "READY"
                  ? "May xong"
                  : item.status === "IN_PROGRESS"
                  ? "Đang may"
                  : "Chờ cọc"}
              </span>
            </div>

            {/* Số đo */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
              <div className="font-semibold text-stone-900 flex justify-between">
                <span>Thiết kế: {item.design_code}</span>
                <span>
                  {item.height}cm • {item.weight}kg
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Ngực: {item.measurements.bust} | Eo: {item.measurements.waist} | Mông:{" "}
                {item.measurements.hips} | Dài váy: {item.measurements.dress_length}cm
              </p>
            </div>

            <p className="text-xs text-stone-600 italic">"{item.notes}"</p>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-stone-400 block">Nghệ nhân phụ trách:</span>
                <strong className="text-stone-800">{item.artisan}</strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 block">Giá ước tính:</span>
                <strong className="text-amber-800 text-sm font-serif">
                  {formatVND(item.estimated_price)}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

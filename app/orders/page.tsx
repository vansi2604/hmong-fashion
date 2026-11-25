"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { formatVND } from "@/lib/utils";

function OrdersContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "tailors";
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const { user, isAuthenticated } = useAuth();

  // Dữ liệu mẫu đơn hàng may đo của tôi
  const tailorOrders = [
    {
      code: "TAILOR-20261113-91C4",
      item: "Váy Nữ H'Mông Hoa Sa Pa (Vải lanh dệt tay)",
      measurements: "Cao 162cm • Nặng 52kg • Ngực 88 • Eo 68 • Mông 92",
      price: 2800000,
      deposit: 1000000,
      status: "IN_PROGRESS",
      statusLabel: "Nghệ nhân đang dệt & thêu sáp ong",
      statusColor: "bg-purple-100 text-purple-900 border-purple-300",
      artisan: "Nghệ nhân Vàng Thị Mai (Bản Tả Van)",
      date: "13/11/2026",
    },
    {
      code: "TAILOR-20261102-33A1",
      item: "Áo Khoác Bomber Chàm Phối Thổ Cẩm Cổ Tay",
      measurements: "Cao 175cm • Nặng 68kg • Dài áo 72cm",
      price: 3200000,
      deposit: 3200000,
      status: "COMPLETED",
      statusLabel: "Đã hoàn tất & Giao thành công",
      statusColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      artisan: "Xưởng may thổ cẩm Cát Cát",
      date: "02/11/2026",
    },
  ];

  // Dữ liệu mẫu đơn thuê trang phục
  const rentalOrders = [
    {
      code: "RENT-20261113-44E2",
      item: "Set Trang Phục H'Mông Đen Sa Pa (Kèm nón bạc & xà tích)",
      dates: "14/11/2026 → 16/11/2026 (3 ngày)",
      totalPrice: 650000,
      deposit: 300000,
      status: "CONFIRMED",
      statusLabel: "Đã giữ đồ • Sẵn sàng nhận tại Sa Pa",
      statusColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      location: "Nhận tại Cửa hàng Fansipan, Sa Pa",
    },
  ];

  // Dữ liệu mẫu đơn mua sắm
  const shoppingOrders = [
    {
      code: "HMOOB-20261111-77F2",
      item: "Khăn Choàng Batik Nhuộm Chàm Tự Nhiên (x1)",
      total: 620000,
      payment: "COD (Thanh toán khi nhận)",
      status: "SHIPPED",
      statusLabel: "Đang giao bưu tá",
      statusColor: "bg-blue-100 text-blue-900 border-blue-300",
      date: "11/11/2026",
    },
  ];

  const tabs = [
    { id: "tailors", label: "✂️ Đơn May Đo", count: tailorOrders.length },
    { id: "rentals", label: "👘 Lịch Thuê Trang Phục", count: rentalOrders.length },
    { id: "buy", label: "📦 Đơn Hàng Mua Sắm", count: shoppingOrders.length },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "bg-amber-800 text-white shadow-xs"
                  : "bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-white text-amber-900 font-extrabold" : "bg-stone-200 text-stone-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab: Đơn May Đo */}
      {activeTab === "tailors" && (
        <div className="space-y-4">
          {tailorOrders.map((order) => (
            <div
              key={order.code}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4 hover:border-amber-400 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-900">#{order.code}</span>
                  <span className="text-[11px] text-stone-400">• Ngày tạo: {order.date}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold border self-start sm:self-auto ${order.statusColor}`}
                >
                  ● {order.statusLabel}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8 space-y-1.5">
                  <h3 className="font-serif font-black text-stone-900 text-sm sm:text-base">
                    {order.item}
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">{order.measurements}</p>
                  <p className="text-xs text-amber-800 font-medium">📍 {order.artisan}</p>
                </div>

                <div className="md:col-span-4 flex flex-col md:items-end justify-center space-y-1 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                  <div className="text-xs text-stone-500">
                    Tổng giá ước tính:{" "}
                    <strong className="text-stone-900 text-sm">{formatVND(order.price)}</strong>
                  </div>
                  <div className="text-xs text-emerald-700 font-semibold">
                    Đã đặt cọc: {formatVND(order.deposit)}
                  </div>
                  <Link
                    href={`/tracking?code=${encodeURIComponent(order.code)}`}
                    className="mt-2 inline-flex items-center gap-1 px-3.5 py-1.5 bg-stone-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    🔍 Xem Tiến Độ
                  </Link>
                </div>
              </div>
            </div>
          ))}

          <div className="text-center pt-4">
            <Link
              href="/tailors"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-amber-800 text-amber-900 hover:bg-amber-50 text-xs font-bold transition-colors"
            >
              <span>+ Đặt May Đơn Mới</span>
            </Link>
          </div>
        </div>
      )}

      {/* Tab: Thuê Đồ */}
      {activeTab === "rentals" && (
        <div className="space-y-4">
          {rentalOrders.map((order) => (
            <div
              key={order.code}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4 hover:border-emerald-400 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-900">#{order.code}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold border self-start sm:self-auto ${order.statusColor}`}
                >
                  ● {order.statusLabel}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8 space-y-1.5">
                  <h3 className="font-serif font-black text-stone-900 text-sm sm:text-base">
                    {order.item}
                  </h3>
                  <p className="text-xs text-stone-600 font-medium">🗓️ Thời gian: {order.dates}</p>
                  <p className="text-xs text-stone-500">📍 {order.location}</p>
                </div>

                <div className="md:col-span-4 flex flex-col md:items-end justify-center space-y-1 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                  <div className="text-xs text-stone-500">
                    Tiền thuê:{" "}
                    <strong className="text-stone-900 text-sm">{formatVND(order.totalPrice)}</strong>
                  </div>
                  <div className="text-xs text-emerald-700 font-semibold">
                    Đã cọc đồ: {formatVND(order.deposit)}
                  </div>
                  <Link
                    href={`/tracking?code=${encodeURIComponent(order.code)}`}
                    className="mt-2 inline-flex items-center gap-1 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    🔍 Chi Tiết Lịch Thuê
                  </Link>
                </div>
              </div>
            </div>
          ))}

          <div className="text-center pt-4">
            <Link
              href="/rentals"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-emerald-800 text-emerald-900 hover:bg-emerald-50 text-xs font-bold transition-colors"
            >
              <span>+ Đặt Thuê Trang Phục Mới</span>
            </Link>
          </div>
        </div>
      )}

      {/* Tab: Mua Sắm */}
      {activeTab === "buy" && (
        <div className="space-y-4">
          {shoppingOrders.map((order) => (
            <div
              key={order.code}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4 hover:border-blue-400 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-stone-900">#{order.code}</span>
                  <span className="text-[11px] text-stone-400">• Ngày: {order.date}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold border self-start sm:self-auto ${order.statusColor}`}
                >
                  ● {order.statusLabel}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8 space-y-1.5">
                  <h3 className="font-serif font-black text-stone-900 text-sm sm:text-base">
                    {order.item}
                  </h3>
                  <p className="text-xs text-stone-500">Hình thức thanh toán: {order.payment}</p>
                </div>

                <div className="md:col-span-4 flex flex-col md:items-end justify-center space-y-1 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                  <div className="text-xs text-stone-500">
                    Tổng thanh toán:{" "}
                    <strong className="text-rose-600 text-base">{formatVND(order.total)}</strong>
                  </div>
                  <Link
                    href={`/tracking?code=${encodeURIComponent(order.code)}`}
                    className="mt-2 inline-flex items-center gap-1 px-3.5 py-1.5 bg-stone-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    🔍 Theo Dõi Bưu Tá
                  </Link>
                </div>
              </div>
            </div>
          ))}

          <div className="text-center pt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-stone-800 text-stone-900 hover:bg-stone-50 text-xs font-bold transition-colors"
            >
              <span>Tiếp Tục Mua Sắm</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerOrdersPage() {
  return (
    <main className="min-h-screen py-8 sm:py-12 bg-[#faf8f5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-4">
          <Link href="/" className="hover:text-amber-800 transition-colors">
            Trang Chủ
          </Link>
          <span>/</span>
          <span className="text-amber-900 font-bold">Lịch Sử Đơn Hàng Của Tôi</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
              Quản Lý Đơn Hàng Của Bạn
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Theo dõi tình trạng đơn đặt may riêng, lịch thuê trang phục chụp ảnh và đơn mua sắm.
            </p>
          </div>
          <Link
            href="/tracking"
            className="px-4 py-2 bg-stone-900 hover:bg-amber-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            🔍 Tra cứu theo mã đơn
          </Link>
        </div>

        <Suspense fallback={<div className="py-12 text-center text-xs text-stone-500">Đang nạp danh sách đơn...</div>}>
          <OrdersContent />
        </Suspense>
      </div>
    </main>
  );
}

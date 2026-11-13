"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { formatVND } from "@/lib/utils";

// Interface đại diện cho tính năng con trên Dashboard Control
interface DashboardFeatureCard {
  id: string;
  title: string;
  shortDesc: string;
  icon: string;
  href: string;
  badgeText: string;
  badgeColor: "amber" | "emerald" | "blue" | "rose" | "purple" | "stone";
  category: "Kinh Doanh" | "Vận Hành" | "Hệ Thống";
  metrics?: { label: string; value: string };
  primaryActionLabel: string;
}

export default function DashboardControlPage() {
  const { user, isAuthenticated, isLoading, isStaffOrAdmin } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");

  // Danh mục tất cả các ô tính năng con trong hệ sinh thái HMONG.CONTROL
  const featureCards: DashboardFeatureCard[] = [
    {
      id: "orders",
      title: "Quản Lý Đơn Hàng",
      shortDesc:
        "Theo dõi, xác nhận và cập nhật tiến trình đơn mua hàng, may đo và thuê trang phục. Xử lý thanh toán COD / VNPAY.",
      icon: "📦",
      href: "/dashboard_control/orders",
      badgeText: "48 đơn mới",
      badgeColor: "amber",
      category: "Kinh Doanh",
      metrics: { label: "Cần duyệt gấp", value: "12 đơn" },
      primaryActionLabel: "Xử lý đơn hàng →",
    },
    {
      id: "products",
      title: "Quản Lý Sản Phẩm",
      shortDesc:
        "Quản lý kho áo khoác thổ cẩm, váy đầm cách tân, trang sức bạc Sa Pa, cấu hình biến thể size, số lượng và giá niêm yết.",
      icon: "👗",
      href: "/dashboard_control/products",
      badgeText: "156 sản phẩm",
      badgeColor: "emerald",
      category: "Kinh Doanh",
      metrics: { label: "Sắp hết hàng", value: "8 mẫu" },
      primaryActionLabel: "Quản lý kho sản phẩm →",
    },
    {
      id: "tailors",
      title: "Quản Trị May Đo Riêng",
      shortDesc:
        "Tiếp nhận số đo cơ thể từ khách hàng, phân công nghệ nhân Sa Pa / Bắc Hà may đo thủ công, thu tiền cọc và theo dõi tiến độ.",
      icon: "✂️",
      href: "/dashboard_control/tailors",
      badgeText: "14 đơn chờ cọc",
      badgeColor: "rose",
      category: "Vận Hành",
      metrics: { label: "Đang may", value: "19 bộ" },
      primaryActionLabel: "Xem kênh may đo →",
    },
    {
      id: "rentals",
      title: "Cho Thuê Trang Phục",
      shortDesc:
        "Kiểm tra lịch trống trang phục lễ hội/chụp ảnh kỷ yếu, giữ cọc đồ thuê, quản lý ngày nhận và ngày hẹn trả đồ của khách.",
      icon: "👘",
      href: "/dashboard_control/rentals",
      badgeText: "9 bộ đang thuê",
      badgeColor: "purple",
      category: "Vận Hành",
      metrics: { label: "Hạn trả hôm nay", value: "3 khách" },
      primaryActionLabel: "Lịch thuê trang phục →",
    },
    {
      id: "media",
      title: "Quản Lý Tệp & Media",
      shortDesc:
        "Kho lưu trữ tập trung hình ảnh hoa văn thổ cẩm, video nghệ nhân dệt lanh, banner tiếp thị và ảnh mẫu thiết kế khách gửi.",
      icon: "📁",
      href: "/dashboard_control/media",
      badgeText: "Kho dữ liệu",
      badgeColor: "blue",
      category: "Vận Hành",
      metrics: { label: "Dung lượng", value: "1.4 GB" },
      primaryActionLabel: "Mở thư viện Media →",
    },
    {
      id: "vouchers",
      title: "Mã Giảm Giá & Voucher",
      shortDesc:
        "Cài đặt mã khuyến mãi freeship vùng cao, giảm giá theo giá trị đơn hàng, mã ưu đãi độc quyền khách hàng thân thiết.",
      icon: "🏷️",
      href: "/dashboard_control/vouchers",
      badgeText: "4 chiến dịch",
      badgeColor: "amber",
      category: "Kinh Doanh",
      metrics: { label: "Đã sử dụng", value: "215 lượt" },
      primaryActionLabel: "Cấu hình voucher →",
    },
    {
      id: "customers",
      title: "Khách Hàng & Thành Viên",
      shortDesc:
        "Danh bạ khách hàng, phân loại khách may đo VIP, lưu trữ lịch sử số đo đo đạc cá nhân hóa và điểm tích lũy thành viên.",
      icon: "👥",
      href: "/dashboard_control/customers",
      badgeText: "1.280 hồ sơ",
      badgeColor: "emerald",
      category: "Kinh Doanh",
      metrics: { label: "Khách mới tháng này", value: "+84" },
      primaryActionLabel: "Danh sách khách hàng →",
    },
    {
      id: "analytics",
      title: "Báo Cáo & Doanh Thu",
      shortDesc:
        "Biểu đồ phân tích doanh số bán lẻ, doanh thu may đo và cho thuê, tỷ lệ chuyển đổi đơn hàng và dự báo hàng tồn kho.",
      icon: "📊",
      href: "/dashboard_control/analytics",
      badgeText: "Thống kê",
      badgeColor: "blue",
      category: "Hệ Thống",
      metrics: { label: "Tăng trưởng", value: "+18.2%" },
      primaryActionLabel: "Xem bảng biểu đồ →",
    },
    {
      id: "settings",
      title: "Cài Đặt & Cấu Hình",
      shortDesc:
        "Cấu hình thông tin sàn Hmong.Mall, số tài khoản ngân hàng nhận cọc may đo, bảng giá vận chuyển viễn thông vùng cao.",
      icon: "⚙️",
      href: "/dashboard_control/settings",
      badgeText: "Cấu hình",
      badgeColor: "stone",
      category: "Hệ Thống",
      metrics: { label: "Trạng thái", value: "Sẵn sàng" },
      primaryActionLabel: "Thiết lập hệ thống →",
    },
  ];

  // Lọc tính năng theo danh mục tab
  const filteredFeatures =
    selectedFilter === "ALL"
      ? featureCards
      : featureCards.filter((c) => c.category === selectedFilter);

  // Dữ liệu đơn hàng mới nhất cần nhân viên xử lý ngay
  const recentOrdersMock = [
    {
      code: "HMOOB-20261113-88A1",
      customer: "Sùng A Dũng",
      phone: "0988***123",
      type: "BUY",
      typeLabel: "Mua sắm",
      total: 1850000,
      payment: "COD",
      status: "Chờ xác nhận",
      statusColor: "bg-amber-100 text-amber-900 border-amber-300",
      time: "10 phút trước",
    },
    {
      code: "TAILOR-20261113-91C4",
      customer: "Hoàng Thị Mỷ",
      phone: "0912***456",
      type: "TAILOR",
      typeLabel: "May đo riêng",
      total: 2800000,
      payment: "Chuyển khoản (Đã cọc 1Tr)",
      status: "Đang cắt vải",
      statusColor: "bg-purple-100 text-purple-900 border-purple-300",
      time: "25 phút trước",
    },
    {
      code: "RENT-20261113-44E2",
      customer: "Trần Mai Anh",
      phone: "0904***789",
      type: "RENT",
      typeLabel: "Thuê trang phục",
      total: 650000,
      payment: "Đã giữ cọc",
      status: "Hẹn trả hôm nay",
      statusColor: "bg-rose-100 text-rose-900 border-rose-300",
      time: "1 giờ trước",
    },
    {
      code: "HMOOB-20261113-72F8",
      customer: "Vàng Thị Chơ",
      phone: "0977***662",
      type: "BUY",
      typeLabel: "Mua sắm",
      total: 3200000,
      payment: "VNPAY QR (Đã thanh toán)",
      status: "Đang đóng gói",
      statusColor: "bg-blue-100 text-blue-900 border-blue-300",
      time: "2 giờ trước",
    },
  ];

  const getBadgeClass = (color: DashboardFeatureCard["badgeColor"]) => {
    switch (color) {
      case "amber":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "emerald":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "rose":
        return "bg-rose-100 text-rose-900 border-rose-300";
      case "purple":
        return "bg-purple-100 text-purple-900 border-purple-300";
      case "blue":
        return "bg-sky-100 text-sky-900 border-sky-300";
      case "stone":
      default:
        return "bg-stone-200 text-stone-800 border-stone-300";
    }
  };

  // 1. Trạng thái đang tải nạp tài khoản
  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-amber-700 border-t-transparent animate-spin mb-4" />
        <p className="text-sm text-stone-500 font-medium">Đang kiểm tra quyền truy cập hệ thống...</p>
      </main>
    );
  }

  // 2. Chặn truy cập nếu chưa đăng nhập hoặc không phải Staff / Admin (FE_AUTH_REQUIREMENTS.md Section 7)
  if (!isAuthenticated || !isStaffOrAdmin) {
    return (
      <main className="container mx-auto px-4 py-16 max-w-xl text-center">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-3xl mx-auto">
            🔒
          </div>
          <h1 className="text-xl font-serif font-black text-stone-900">
            Khu Vực Quản Trị Hệ Thống Dành Cho Nhân Viên & Quản Trị Viên
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Phân hệ Quản trị yêu cầu tài khoản có vai trò{" "}
            <span className="font-semibold text-amber-800">ROLE_STAFF</span> hoặc{" "}
            <span className="font-semibold text-amber-800">ROLE_ADMIN</span>.
          </p>
          <div className="pt-4 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors"
            >
              Về Trang Chủ
            </Link>
            <Link
              href="/login?redirect=/dashboard_control"
              className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-amber-800 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Đăng Nhập Ngay
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* 1. Header Bảng Điều Khiển & Thông Tin Tài Khoản */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-800 relative overflow-hidden">
        {/* Họa tiết nền trang trí văn hóa Hmong */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-xs text-amber-400 font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Hệ thống trực tuyến • Port 3000 Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white">
              Bảng Điều Khiển Quản Trị Hệ Thống
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Chào mừng {user?.username ? <strong className="text-amber-400">@{user.username}</strong> : "bạn"} trở lại trung tâm vận hành{" "}
              <strong className="text-white">HMONG.CONTROL</strong>. Quản trị đơn hàng may đo, kho sản phẩm thổ cẩm và tệp đa phương tiện.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
            <Link
              href="/dashboard_control/orders"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-sm transition-all flex items-center gap-2 active:scale-95"
            >
              <span>📦</span>
              <span>Duyệt Đơn Hàng</span>
            </Link>
            <Link
              href="/dashboard_control/products"
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs border border-stone-700 transition-all flex items-center gap-2 active:scale-95"
            >
              <span>👗</span>
              <span>+ Thêm Sản Phẩm</span>
            </Link>
            <Link
              href="/dashboard_control/media"
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs border border-stone-700 transition-all flex items-center gap-2 active:scale-95"
            >
              <span>📁</span>
              <span>Upload Media</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Dải KPI Thống Kê Tổng Quan Trong Ngày */}
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Doanh thu hôm nay</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center text-sm font-bold">
              💰
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-serif font-black text-stone-900">
              {formatVND(38500000)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <span>↑ 8.5%</span>
            <span className="text-stone-400 font-normal">so với hôm qua</span>
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Đơn hàng mới</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center text-sm font-bold">
              📦
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-serif font-black text-stone-900">
              48 đơn
            </span>
          </div>
          <p className="mt-1 text-[11px] text-amber-800 font-semibold flex items-center gap-1">
            <span>• 12 đơn</span>
            <span className="text-stone-400 font-normal">đang chờ xác nhận gấp</span>
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">May đo chờ cọc</span>
            <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center text-sm font-bold">
              ✂️
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-serif font-black text-stone-900">
              14 đơn
            </span>
          </div>
          <p className="mt-1 text-[11px] text-rose-700 font-semibold flex items-center gap-1">
            <span>• 19 đơn</span>
            <span className="text-stone-400 font-normal">đang may tại xưởng Sa Pa</span>
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Kho sản phẩm</span>
            <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center text-sm font-bold">
              👗
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-serif font-black text-stone-900">
              156 mã
            </span>
          </div>
          <p className="mt-1 text-[11px] text-purple-800 font-semibold flex items-center gap-1">
            <span>• 8 mã</span>
            <span className="text-stone-400 font-normal">chạm ngưỡng sắp hết hàng</span>
          </p>
        </div>
      </section>

      {/* 3. Phân Đoạn Chính: CÁC Ô ĐIỀU HƯỚNG TỚI CÁC TÍNH NĂNG CON */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 tracking-tight flex items-center gap-2">
              <span>Các Tính Năng Quản Trị Hệ Thống</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                {filteredFeatures.length} phân hệ
              </span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Nhấp vào ô tính năng để mở trang điều hành chi tiết tương ứng.
            </p>
          </div>

          {/* Bộ lọc theo nhóm nghiệp vụ */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 text-xs font-semibold self-start sm:self-auto">
            {["ALL", "Kinh Doanh", "Vận Hành", "Hệ Thống"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedFilter(tab)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedFilter === tab
                    ? "bg-stone-900 text-white font-bold"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                {tab === "ALL" ? "Tất cả" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Lưới các ô điều hướng (Feature Navigation Cards Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFeatures.map((feat) => (
            <Link
              key={feat.id}
              href={feat.href}
              className="group bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs hover:shadow-lg hover:border-amber-600/60 hover:-translate-y-1 transition-all flex flex-col justify-between relative overflow-hidden"
            >
              {/* Highlight thanh màu trên đầu thẻ khi hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-amber-600 transition-colors" />

              <div className="space-y-4">
                {/* Hàng trên: Icon + Badge đếm */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-200/80 group-hover:bg-amber-50 group-hover:border-amber-200 flex items-center justify-center text-2xl transition-colors shadow-xs">
                    {feat.icon}
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide border shadow-2xs ${getBadgeClass(
                      feat.badgeColor
                    )}`}
                  >
                    {feat.badgeText}
                  </span>
                </div>

                {/* Tiêu đề & Mô tả */}
                <div>
                  <h3 className="font-serif font-black text-lg sm:text-xl text-stone-900 group-hover:text-amber-900 transition-colors flex items-center justify-between">
                    <span>{feat.title}</span>
                    <span className="text-stone-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all text-sm">
                      →
                    </span>
                  </h3>
                  <p className="mt-1.5 text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {feat.shortDesc}
                  </p>
                </div>
              </div>

              {/* Hàng dưới: Chỉ số đo lường + Nút bấm điều hướng */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                {feat.metrics && (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-stone-400 font-semibold uppercase">
                      {feat.metrics.label}
                    </span>
                    <span className="font-bold text-stone-900">
                      {feat.metrics.value}
                    </span>
                  </div>
                )}

                <span className="font-bold text-amber-800 group-hover:text-amber-900 group-hover:underline ml-auto flex items-center gap-1">
                  <span>{feat.primaryActionLabel}</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Danh Sách Đơn Hàng Mới Nhất Cần Xử Lý (Recent Pending Orders) */}
      <section className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-lg font-serif font-black text-stone-900 flex items-center gap-2">
              <span>Đơn Hàng Gần Đây Cần Xử Lý</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Cập nhật trực tiếp từ hệ thống giỏ hàng, may đo cá nhân hóa và thuê trang phục bản Tả Van.
            </p>
          </div>

          <Link
            href="/dashboard_control/orders"
            className="text-xs font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Xem toàn bộ 48 đơn hàng</span>
            <span>→</span>
          </Link>
        </div>

        {/* Bảng đơn hàng trực quan */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-2.5 px-3">Mã Đơn</th>
                <th className="py-2.5 px-3">Khách Hàng</th>
                <th className="py-2.5 px-3">Phân Loại</th>
                <th className="py-2.5 px-3">Tổng Tiền</th>
                <th className="py-2.5 px-3">Thanh Toán</th>
                <th className="py-2.5 px-3">Trạng Thái</th>
                <th className="py-2.5 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrdersMock.map((order) => (
                <tr
                  key={order.code}
                  className="hover:bg-amber-50/40 transition-colors group"
                >
                  <td className="py-3 px-3 font-mono font-bold text-stone-900">
                    <Link
                      href={`/dashboard_control/orders?code=${order.code}`}
                      className="hover:text-amber-800 hover:underline"
                    >
                      {order.code}
                    </Link>
                    <span className="block text-[10px] text-stone-400 font-normal font-sans">
                      {order.time}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-semibold text-stone-900 block">
                      {order.customer}
                    </span>
                    <span className="text-stone-400 text-[11px]">
                      {order.phone}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                        order.type === "TAILOR"
                          ? "bg-rose-50 text-rose-800 border border-rose-200"
                          : order.type === "RENT"
                          ? "bg-purple-50 text-purple-800 border border-purple-200"
                          : "bg-stone-100 text-stone-800 border border-stone-200"
                      }`}
                    >
                      {order.typeLabel}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-bold text-stone-900">
                    {formatVND(order.total)}
                  </td>

                  <td className="py-3 px-3 text-stone-600 max-w-[150px] truncate">
                    {order.payment}
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${order.statusColor}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/dashboard_control/orders?code=${order.code}`}
                      className="inline-block px-3 py-1 bg-stone-900 group-hover:bg-amber-800 text-white rounded-lg text-[11px] font-semibold transition-colors"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Khối Hỗ Trợ Kỹ Thuật & Tài Liệu Backend */}
      <footer className="bg-stone-200/70 rounded-2xl p-4 sm:p-5 text-xs text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-3 border border-stone-300/80">
        <div className="flex items-center gap-2">
          <span>🌿</span>
          <span>
            <strong>HMONG.MALL Backoffice Hub</strong> • Đồng bộ dữ liệu với FastAPI REST Backend tại{" "}
            <code className="bg-stone-300/80 px-1.5 py-0.5 rounded-md font-mono text-[11px] text-stone-800">
              http://127.0.0.1:8000/api/v1
            </code>
          </span>
        </div>

        <div className="flex items-center gap-4 text-stone-500 font-medium">
          <Link
            href="/dashboard_control/media"
            className="hover:text-stone-900 transition-colors"
          >
            Quản lý Media
          </Link>
          <span>•</span>
          <Link
            href="/dashboard_control/orders"
            className="hover:text-stone-900 transition-colors"
          >
            Đơn hàng
          </Link>
          <span>•</span>
          <Link
            href="/dashboard_control/products"
            className="hover:text-stone-900 transition-colors"
          >
            Sản phẩm
          </Link>
        </div>
      </footer>
    </main>
  );
}

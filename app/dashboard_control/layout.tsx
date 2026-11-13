"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
  * Layout chuyên biệt dành riêng cho Phân hệ Quản trị Dashboard Control
  * Đã loại bỏ 100% các thành phần bán lẻ dành cho khách hàng:
  * - Không có thanh tìm kiếm sản phẩm khách lẻ
  * - Không có giỏ hàng (Cart)
  * - Không có các thẻ tag xu hướng mua sắm
  * - Không có thông báo khuyến mãi / freeship
  * - Không có Footer bán lẻ và Mobile Bottom Bar
  */
export default function DashboardControlLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const isOverview = pathname === "/dashboard_control";
  const isOrders = pathname?.startsWith("/dashboard_control/orders");
  const isProducts = pathname?.startsWith("/dashboard_control/products");
  const isTailors = pathname?.startsWith("/dashboard_control/tailors") || pathname?.startsWith("/admin/tailors");
  const isRentals = pathname?.startsWith("/dashboard_control/rentals");
  const isMedia = pathname?.startsWith("/dashboard_control/media");

  const navLinks = [
    { href: "/dashboard_control", label: "Tổng quan", icon: "📊", active: isOverview },
    { href: "/dashboard_control/orders", label: "Đơn hàng", icon: "📦", active: isOrders },
    { href: "/dashboard_control/products", label: "Sản phẩm", icon: "👗", active: isProducts },
    { href: "/dashboard_control/tailors", label: "May đo", icon: "✂️", active: isTailors },
    { href: "/dashboard_control/rentals", label: "Thuê đồ", icon: "👘", active: isRentals },
    { href: "/dashboard_control/media", label: "Media", icon: "📁", active: isMedia },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col text-stone-900 font-sans">
      {/* 1. Header Quản Trị Tối Giản (Admin Control Topbar) */}
      <header className="sticky top-0 z-40 bg-stone-950 text-white border-b border-stone-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15 gap-4">
            {/* Logo & Nhãn Phân Hệ Nội Bộ */}
            <Link
              href="/dashboard_control"
              className="flex items-center gap-3 group focus:outline-none flex-shrink-0"
              title="Về Bảng Điều Khiển Tổng Quan"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-600 group-hover:bg-amber-500 text-stone-950 flex items-center justify-center font-serif font-black text-lg shadow-sm transition-colors">
                H
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-sm sm:text-base font-black tracking-wider text-white uppercase leading-none">
                  HMONG<span className="text-amber-400">.CONTROL</span>
                </span>
                <span className="text-[9px] tracking-widest text-stone-400 uppercase font-semibold mt-0.5">
                  Bảng Điều Khiển Quản Trị
                </span>
              </div>
            </Link>

            {/* Menu Công Cụ Quản Trị Nội Bộ (Desktop Navigation) */}
            <nav className="hidden lg:flex items-center gap-1 bg-stone-900/90 p-1.5 rounded-2xl border border-stone-800 text-xs font-semibold">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    link.active
                      ? "bg-amber-600 text-stone-950 font-bold shadow-xs scale-102"
                      : "text-stone-300 hover:text-white hover:bg-stone-800/80"
                  }`}
                >
                  <span className="text-sm">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            {/* Thông Tin Tài Khoản Đang Đăng Nhập & Hành Động */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Nút Xem Website Khách Lẻ (Mở tab mới) */}
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors border border-stone-800 shadow-xs"
                title="Mở giao diện website bán lẻ của khách hàng trong tab mới"
              >
                <span>Xem Website</span>
                <span className="text-amber-400 text-xs">↗</span>
              </Link>

              {/* Thông tin User & Nút Logout */}
              {isAuthenticated && (
                <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-stone-800">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-bold text-stone-100 max-w-[130px] truncate leading-tight">
                      {user?.username || user?.email}
                    </span>
                    <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wide">
                      {user?.roles?.includes("ROLE_ADMIN") ? "👑 ADMIN" : "⭐ STAFF"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={logout}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 rounded-xl transition-colors border border-rose-900/50 cursor-pointer"
                    title="Đăng xuất khỏi tài khoản"
                  >
                    🚪 <span className="hidden sm:inline">Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Quick Nav Bar */}
          <div className="flex lg:hidden items-center gap-1.5 py-2 overflow-x-auto no-scrollbar border-t border-stone-800/80 text-xs font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 whitespace-nowrap transition-colors ${
                  link.active
                    ? "bg-amber-600 text-stone-950 font-bold"
                    : "text-stone-300 hover:text-white bg-stone-900"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Vùng Nội Dung Chính Của Phân Hệ Dashboard */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}

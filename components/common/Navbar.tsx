"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { getImageUrl } from "@/lib/api-client";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const { user, isAuthenticated, logout, isStaffOrAdmin } = useAuth();

  const trendingTags = [
    "Áo khoác thổ cẩm",
    "Khăn batik sáp ong",
    "Đầm linen cách tân",
    "Vòng bạc Hmong",
    "May đo bản Tả Van",
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-xs">
      {/* 1. Top Utility Notification Bar */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 truncate">
            <span className="bg-amber-500 text-stone-950 font-extrabold text-[10px] px-1.5 py-0.2 rounded-xs uppercase">
              HOT
            </span>
            <span className="truncate">
              🚚 Miễn phí vận chuyển toàn quốc cho đơn từ 300K | 🔥 Đặt may đo cá nhân hóa theo số đo
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-[11px] text-stone-400">
            <Link href="/tracking" className="hover:text-amber-400 transition-colors">
              🔍 Tra Cứu Đơn Hàng
            </Link>
            <Link href="/tailors" className="hover:text-amber-400 transition-colors">
              ✂️ Kênh May Đo Thổ Cẩm
            </Link>
            <Link href="/rentals" className="hover:text-amber-400 transition-colors">
              👘 Thuê Trang Phục
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main E-Commerce Header Bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-stone-900 text-white flex items-center justify-center font-serif font-black text-xl shadow-xs">
              H
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-black tracking-wider text-stone-900 group-hover:text-amber-800 transition-colors uppercase leading-none">
                HMONG<span className="text-rose-600">.MALL</span>
              </span>
              <span className="text-[9px] tracking-widest text-stone-500 uppercase font-semibold mt-0.5">
                Chợ Thời Trang Bản Địa
              </span>
            </div>
          </Link>

          {/* Large Marketplace Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-2xl flex-col">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="relative flex items-center rounded-xl border-2 border-stone-800 hover:border-amber-700 focus-within:border-amber-700 bg-stone-50 transition-colors overflow-hidden"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm áo khoác thổ cẩm, váy batik sáp ong, may đo riêng..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-transparent text-stone-900 placeholder-stone-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-stone-900 hover:bg-amber-800 text-white px-5 py-2.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="hidden md:inline">Tìm Kiếm</span>
              </button>
            </form>

            {/* Trending Tags below search */}
            <div className="flex items-center gap-2 mt-1.5 overflow-x-auto no-scrollbar text-[11px] text-stone-500">
              <span className="text-stone-400 font-medium">Gợi ý:</span>
              {trendingTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/products?search=${encodeURIComponent(tag)}`}
                  className="hover:text-amber-800 whitespace-nowrap transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* User & Cart Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5 flex-shrink-0">
            {/* Account dropdown / Login state */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-100 transition-colors text-left cursor-pointer"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-stone-200 border border-amber-800/20 flex items-center justify-center">
                    {user.profile?.avatar_url ? (
                      <Image
                        src={getImageUrl(user.profile.avatar_url)}
                        alt={user.profile.full_name || user.username}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="32px"
                      />
                    ) : (
                      <span className="text-xs font-black text-amber-900 uppercase">
                        {user.username.slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-[10px] text-stone-400 font-semibold leading-none">
                      Xin chào,
                    </span>
                    <span className="text-xs font-bold text-stone-900 leading-tight truncate max-w-[100px]">
                      {user.profile?.full_name || user.username}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="font-bold text-stone-900 truncate">
                        {user.profile?.full_name || user.username}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2.5 hover:bg-stone-50 text-stone-700 font-medium transition-colors"
                    >
                      👤 Hồ sơ cá nhân & Mật khẩu
                    </Link>
                    <Link
                      href="/orders?tab=tailors"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2.5 hover:bg-stone-50 text-stone-700 font-medium transition-colors"
                    >
                      ✂️ Đơn may đo của tôi
                    </Link>
                    <Link
                      href="/orders?tab=rentals"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2.5 hover:bg-stone-50 text-stone-700 font-medium transition-colors"
                    >
                      👘 Lịch thuê trang phục
                    </Link>
                    <Link
                      href="/orders?tab=buy"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2.5 hover:bg-stone-50 text-stone-700 font-medium transition-colors"
                    >
                      📦 Đơn hàng mua sắm
                    </Link>

                    {isStaffOrAdmin && (
                      <div className="border-t border-stone-100 my-1 pt-1">
                        <Link
                          href="/dashboard_control"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold transition-colors"
                        >
                          ⚙️ Bảng Quản Trị Staff
                        </Link>
                      </div>
                    )}

                    <div className="border-t border-stone-100 my-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-rose-50 text-rose-700 font-semibold transition-colors"
                      >
                        🚪 Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-amber-800 transition-colors"
                >
                  Đăng Nhập
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-bold bg-stone-900 hover:bg-amber-800 text-white rounded-xl shadow-xs transition-colors"
                >
                  Đăng Ký
                </Link>
              </div>
            )}

            {/* Cart Button */}
            <Link
              href="/cart"
              className="flex items-center gap-2.5 p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 transition-colors border border-amber-200"
            >
              <div className="relative">
                <svg className="w-6 h-6 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-[10px] text-amber-800 font-semibold leading-none">Giỏ hàng</span>
                <span className="text-xs font-bold text-stone-900 leading-tight">Giỏ hàng</span>
              </div>
            </Link>

            {/* Mobile menu hamburger toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-950 rounded-lg"
              aria-label="Mở menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Category Navigation Bar */}
      <nav className="hidden md:block bg-stone-50 border-t border-stone-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs font-medium text-stone-700">
            <div className="flex items-center space-x-1 lg:space-x-2">
              <Link
                href="/products"
                className="flex items-center gap-1.5 px-3 py-2.5 bg-amber-700 text-white font-bold rounded-t-md hover:bg-amber-800 transition-colors"
              >
                <span>☰</span>
                <span>TẤT CẢ SẢN PHẨM</span>
              </Link>

              <Link
                href="/tailors"
                className="flex items-center gap-1 px-3 py-2.5 text-amber-900 font-bold hover:text-amber-700 transition-colors"
              >
                <span>✂️</span> MAY ĐO RIÊNG
              </Link>

              <Link
                href="/rentals"
                className="flex items-center gap-1 px-3 py-2.5 text-stone-800 font-semibold hover:text-amber-800 transition-colors"
              >
                <span>👘</span> THUÊ TRANG PHỤC
              </Link>

              <Link
                href="/tracking"
                className="flex items-center gap-1 px-3 py-2.5 text-stone-800 font-semibold hover:text-amber-800 transition-colors"
              >
                <span>🔍</span> TRA CỨU ĐƠN
              </Link>

              <Link href="/products?category=TRADITIONAL" className="px-3 py-2.5 hover:text-stone-950 transition-colors">
                Truyền Thống
              </Link>

              <Link href="/products?category=MODERN" className="px-3 py-2.5 hover:text-stone-950 transition-colors">
                Cách Tân Hiện Đại
              </Link>

              <Link href="/products?category=ACCESSORIES" className="px-3 py-2.5 hover:text-stone-950 transition-colors">
                Vòng Bạc & Khăn Choàng
              </Link>
            </div>

            <div className="flex items-center gap-2 text-amber-900 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Hỗ trợ nghệ nhân bản địa Sa Pa</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white py-3 px-4 space-y-2">
          {isAuthenticated && user ? (
            <div className="p-3 bg-stone-50 rounded-xl mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-stone-900">
                  {user.profile?.full_name || user.username}
                </p>
                <p className="text-[11px] text-stone-500">{user.phone}</p>
              </div>
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs text-amber-800 font-semibold"
              >
                Xem hồ sơ ›
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center py-2 text-xs font-semibold border border-stone-300 rounded-lg text-stone-800"
              >
                Đăng Nhập
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center py-2 text-xs font-bold bg-stone-900 text-white rounded-lg"
              >
                Đăng Ký
              </Link>
            </div>
          )}

          <Link
            href="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-stone-900"
          >
            📦 Tất Cả Sản Phẩm
          </Link>
          <Link
            href="/tailors"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-amber-800"
          >
            ✂️ Đặt May Đo Thổ Cẩm Riêng
          </Link>
          <Link
            href="/rentals"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-stone-800"
          >
            👘 Thuê Trang Phục Biểu Diễn
          </Link>
          <Link
            href="/tracking"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-stone-800"
          >
            🔍 Tra Cứu Tiến Độ Đơn Hàng
          </Link>
          <Link
            href="/cart"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-stone-900"
          >
            🛒 Giỏ Hàng Mua Sắm
          </Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;

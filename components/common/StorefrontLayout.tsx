"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MobileBottomBar } from "@/components/common/MobileBottomBar";

interface StorefrontLayoutProps {
  children: React.ReactNode;
}

/**
 * Shell bọc giao diện bán lẻ cho khách hàng.
 * Tự động ẩn toàn bộ Navbar bán lẻ (Tìm kiếm, Giỏ hàng, Trending tags),
 * Footer và MobileBottomBar khi người dùng truy cập các tuyến đường quản trị (/dashboard_control, /admin).
 */
export function StorefrontLayout({ children }: StorefrontLayoutProps) {
  const pathname = usePathname();

  // Kiểm tra xem trang hiện tại có thuộc phân hệ quản trị không
  const isBackoffice =
    pathname?.startsWith("/dashboard_control") ||
    pathname?.startsWith("/admin");

  // Nếu là khu vực quản trị: Chỉ hiển thị nội dung dashboard chuyên biệt, loại bỏ toàn bộ giao diện bán lẻ
  if (isBackoffice) {
    return <main className="flex-1 flex flex-col">{children}</main>;
  }

  // Nếu là khu vực bán lẻ thông thường cho khách hàng: Hiển thị đầy đủ Navbar, Footer, Giỏ hàng
  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <MobileBottomBar />
    </>
  );
}

export default StorefrontLayout;

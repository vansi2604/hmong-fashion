"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { MediaManager } from '@/components/media/MediaManager';

export default function DashboardMediaPage() {
  const { user, isAuthenticated, isLoading, isStaffOrAdmin } = useAuth();

  // 1. Trạng thái đang tải nạp tài khoản
  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-amber-700 border-t-transparent animate-spin mb-4" />
        <p className="text-sm text-stone-500 font-medium">Đang kiểm tra quyền truy cập hệ thống...</p>
      </main>
    );
  }

  // 2. Chặn truy cập nếu chưa đăng nhập hoặc không phải Staff / Admin
  if (!isAuthenticated || !isStaffOrAdmin) {
    return (
      <main className="container mx-auto px-4 py-16 max-w-xl text-center">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-3xl mx-auto">
            🔒
          </div>
          <h1 className="text-xl font-serif font-black text-stone-900">
            Khu Vực Quản Trị Dành Cho Nhân Viên & Quản Trị Viên
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Phân hệ Quản lý File Tập Trung (Media Management) yêu cầu tài khoản có vai trò{' '}
            <span className="font-semibold text-amber-800">ROLE_STAFF</span> hoặc{' '}
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
              href="/login"
              className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-amber-800 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Đăng Nhập Ngay
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 3. Giao diện chính của Trang Quản Trị Media
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumb Navigation & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-500 mb-1.5 font-medium">
            <Link href="/" className="hover:text-amber-800 transition-colors">
              Trang Chủ
            </Link>
            <span>/</span>
            <Link href="/dashboard_control" className="hover:text-amber-800 transition-colors">
              Bảng Điều Khiển
            </Link>
            <span>/</span>
            <span className="text-amber-900 font-bold">Quản Lý Tệp Media</span>
          </nav>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
              Quản Lý File Tập Trung
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold uppercase tracking-wide">
              {user?.roles?.includes('ROLE_ADMIN') ? '👑 ADMIN' : '⭐ STAFF'}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Lưu trữ, tải lên và phân loại hình ảnh thổ cẩm, video sản phẩm, banner tiếp thị toàn hệ thống.
          </p>
        </div>

        {/* Nhanh tới Kênh May Đo / Đơn Hàng Staff */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard_control/tailors"
            className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-xs transition-colors"
          >
            ✂️ Quản Trị May Đo
          </Link>
        </div>
      </div>

      {/* Media Manager Workspace Component */}
      <div className="w-full">
        <MediaManager />
      </div>
    </main>
  );
}

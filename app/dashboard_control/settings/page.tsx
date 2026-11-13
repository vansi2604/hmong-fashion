"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function DashboardSettingsPage() {
  const [storeName, setStoreName] = useState("HMONG.MALL - Sàn Thời Trang & Thủ Công Hmong");
  const [hotline, setHotline] = useState("0988 888 999");
  const [address, setAddress] = useState("Bản Cát Cát, Sa Pa, Lào Cai");
  const [bankAccount, setBankAccount] = useState("MB Bank - 0988888999 - CTCP THOI TRANG HMOOB");

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
            <span className="text-amber-900 font-bold">Cài Đặt Hệ Thống</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
            Cấu Hình & Cài Đặt Hệ Thống
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Cấu hình thông tin thương hiệu Hmong.Mall, tài khoản ngân hàng nhận tiền cọc may đo và chính sách vận chuyển.
          </p>
        </div>

        <Link
          href="/dashboard_control"
          className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-xs self-start sm:self-auto"
        >
          ← Bảng Điều Khiển
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs max-w-2xl space-y-4 text-xs">
        <div>
          <label className="block text-stone-700 font-bold mb-1">Tên sàn thương mại</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-stone-700 font-bold mb-1">Hotline CSKH / May đo</label>
            <input
              type="text"
              value={hotline}
              onChange={(e) => setHotline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-700"
            />
          </div>
          <div>
            <label className="block text-stone-700 font-bold mb-1">Địa chỉ xưởng Sa Pa</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-stone-700 font-bold mb-1">
            Tài khoản ngân hàng nhận cọc may đo / thuê đồ
          </label>
          <input
            type="text"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-700"
          />
        </div>

        <div className="pt-3 border-t border-stone-100 flex justify-end">
          <button
            type="button"
            onClick={() => alert("Đã lưu cấu hình hệ thống thành công!")}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold shadow-xs cursor-pointer"
          >
            Lưu Thay Đổi
          </button>
        </div>
      </div>
    </main>
  );
}

"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatVND } from "@/lib/utils";

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const [orderCode, setOrderCode] = useState(initialCode);
  const [searchedCode, setSearchedCode] = useState(initialCode);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Mẫu dữ liệu tra cứu giả lập thông minh theo tiền tố mã
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = orderCode.trim().toUpperCase();
    if (!cleanCode) return;

    setIsLoading(true);
    setSearchedCode(cleanCode);
    setHasSearched(true);

    setTimeout(() => {
      if (cleanCode.startsWith("TAILOR")) {
        setResult({
          code: cleanCode,
          type: "TAILOR",
          typeLabel: "Đơn May Đo Cá Nhân Hóa",
          customerName: "Khách hàng May Đo Sa Pa",
          item: "Mẫu may: " + (cleanCode.includes("VAY") ? "Váy Nữ H'Mông Hoa Sa Pa" : "Trang Phục Thổ Cẩm Riêng"),
          status: "IN_PROGRESS",
          statusLabel: "Nghệ nhân đang dệt & may đo",
          statusColor: "bg-purple-100 text-purple-900 border-purple-300",
          progressStep: 2,
          date: new Date().toLocaleDateString("vi-VN"),
          notes: "Nghệ nhân bản Tả Van đang hoàn thiện hoa văn thêu tay và đính cườm.",
          estDelivery: "Dự kiến hoàn tất trong 5-7 ngày tới",
        });
      } else if (cleanCode.startsWith("RENT")) {
        setResult({
          code: cleanCode,
          type: "RENTAL",
          typeLabel: "Đơn Thuê Trang Phục",
          customerName: "Khách hàng Thuê Đồ",
          item: "Trọn bộ trang phục chụp ảnh kỷ yếu / du lịch Sa Pa",
          status: "CONFIRMED",
          statusLabel: "Đã xác nhận & Giữ đồ sẵn sàng",
          statusColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
          progressStep: 1,
          date: new Date().toLocaleDateString("vi-VN"),
          notes: "Trang phục đã giặt hấp và chuẩn bị sẵn tại cửa hàng Sa Pa.",
          estDelivery: "Nhận đồ tại cửa hàng hoặc giao tận nơi theo lịch hẹn",
        });
      } else {
        // Mua sắm thông thường
        setResult({
          code: cleanCode,
          type: "BUY",
          typeLabel: "Đơn Mua Hàng Trực Tuyến",
          customerName: "Khách hàng Mua Sắm",
          item: "Sản phẩm thời trang & phụ kiện thổ cẩm Hmong",
          status: "SHIPPED",
          statusLabel: "Đang vận chuyển toàn quốc",
          statusColor: "bg-blue-100 text-blue-900 border-blue-300",
          progressStep: 3,
          date: new Date().toLocaleDateString("vi-VN"),
          notes: "Kiện hàng đã xuất kho Sa Pa và đang được bưu tá giao tận tay.",
          estDelivery: "Giao dự kiến trong 1-2 ngày",
        });
      }
      setIsLoading(false);
    }, 450);
  };

  useEffect(() => {
    if (initialCode) {
      handleSearch();
    }
  }, [initialCode]);

  const steps = [
    { step: 1, title: "Tiếp Nhận Đơn", desc: "Xác nhận thông tin & số đo" },
    { step: 2, title: "Xử Lý & Chế Tác", desc: "Nghệ nhân thêu dệt / Chuẩn bị đồ" },
    { step: 3, title: "Đang Giao Hàng", desc: "Vận chuyển bưu tá tận tay" },
    { step: 4, title: "Hoàn Tất", desc: "Nhận hàng & đánh giá" },
  ];

  return (
    <div className="space-y-8">
      {/* Search Bar Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
            Nhập Mã Đơn Hàng / Mã May Đo / Mã Thuê Đồ
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              placeholder="VD: TAILOR-20261113-91C4 hoặc RENT-20261113..."
              className="flex-1 px-4 py-3 rounded-xl border-2 border-stone-300 focus:border-amber-700 focus:outline-none text-sm font-mono text-stone-900"
            />
            <button
              type="submit"
              disabled={isLoading || !orderCode.trim()}
              className="px-6 py-3 bg-stone-900 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Đang tra..." : "Tra Cứu"}
            </button>
          </div>
          <p className="text-[11px] text-stone-500">
            💡 Mã đơn được gửi qua tin nhắn SMS hoặc hiển thị sau khi bạn gửi đơn đặt may/thuê đồ.
          </p>
        </form>
      </div>

      {/* Kết quả tra cứu */}
      {isLoading ? (
        <div className="py-16 text-center text-stone-500 text-sm">
          <div className="w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Đang truy vấn dữ liệu đơn hàng từ hệ thống...
        </div>
      ) : result ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm max-w-3xl mx-auto space-y-8">
          {/* Header kết quả */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                {result.typeLabel}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 font-mono">
                #{result.code}
              </h2>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${result.statusColor}`}
            >
              ● {result.statusLabel}
            </span>
          </div>

          {/* Stepper tiến độ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((st) => {
              const isDone = st.step <= result.progressStep;
              const isCurrent = st.step === result.progressStep;

              return (
                <div
                  key={st.step}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    isCurrent
                      ? "border-amber-700 bg-amber-50/50 shadow-xs ring-2 ring-amber-700/20"
                      : isDone
                      ? "border-emerald-300 bg-emerald-50/30 text-stone-800"
                      : "border-stone-200 bg-stone-50 text-stone-400"
                  }`}
                >
                  <div
                    className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                      isDone
                        ? "bg-emerald-700 text-white"
                        : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {isDone ? "✓" : st.step}
                  </div>
                  <h4 className="text-xs font-bold text-stone-900">{st.title}</h4>
                  <p className="text-[10px] text-stone-500 mt-0.5 leading-tight">{st.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Chi tiết tiến trình */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-stone-500">Mặt hàng / Mẫu:</span>
              <span className="font-bold text-stone-900 text-right">{result.item}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Ngày khởi tạo:</span>
              <span className="font-medium text-stone-800">{result.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Tiến độ cập nhật:</span>
              <span className="font-semibold text-amber-900 text-right">{result.notes}</span>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-2 font-bold">
              <span className="text-stone-600">Thời gian dự kiến:</span>
              <span className="text-emerald-700">{result.estDelivery}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/tailors"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs text-center transition-colors"
            >
              ✂️ Kênh May Đo Mới
            </Link>
            <Link
              href="/rentals"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs text-center transition-colors"
            >
              👘 Thuê Trang Phục
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-bold text-xs text-center shadow-xs transition-colors"
            >
              Mua Sắm Thêm
            </Link>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center max-w-md mx-auto space-y-3">
          <span className="text-4xl block">🔍</span>
          <h3 className="text-base font-bold text-stone-900">Không tìm thấy mã &ldquo;{searchedCode}&rdquo;</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Vui lòng kiểm tra lại chính xác mã đơn trên hóa đơn hoặc tin nhắn SMS gửi về từ nghệ nhân.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <main className="min-h-screen py-8 sm:py-12 bg-[#faf8f5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-4">
          <Link href="/" className="hover:text-amber-800 transition-colors">
            Trang Chủ
          </Link>
          <span>/</span>
          <span className="text-amber-900 font-bold">Tra Cứu Đơn Hàng & May Đo</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            Hệ Thống Theo Dõi Trực Tuyến
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-black text-stone-900 tracking-tight">
            Tra Cứu Tiến Độ Đơn Hàng
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Theo dõi từng khâu may đo thủ công của nghệ nhân Sa Pa, tiến độ giữ đồ thuê và vận chuyển toàn quốc.
          </p>
        </div>

        <Suspense fallback={<div className="py-12 text-center text-xs text-stone-500">Đang nạp form tra cứu...</div>}>
          <TrackingContent />
        </Suspense>
      </div>
    </main>
  );
}

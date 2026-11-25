"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { tailorService } from "@/services/tailor.service";
import { mediaService } from "@/services/media.service";
import { getErrorMessage } from "@/lib/errors";
import type { TailorOrderResponse } from "@/types/tailor";

const SAMPLE_DESIGNS = [
  {
    code: "VAY-HMOOB-HOA-02",
    title: "Váy Nữ H'Mông Hoa Sa Pa",
    desc: "Vải lanh dệt tay, nhuộm chàm tự nhiên, cổ đính hoa văn con ốc ngũ sắc.",
    estPrice: "2.800.000₫ - 3.500.000₫",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
  },
  {
    code: "AO-KHOAC-CHAM-NAM-01",
    title: "Áo Khoác Bomber Chàm Nam",
    desc: "Form đứng hiện đại, phối họa tiết sáp ong cổ tay và ve áo thổ cẩm.",
    estPrice: "3.200.000₫ - 4.000.000₫",
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80",
  },
  {
    code: "DAM-DA-HOI-BATIK-05",
    title: "Đầm Dạ Hội Phối Thổ Cẩm",
    desc: "Đầm dạ tiệc cách tân, chân váy xòe hoa văn vẽ sáp ong Bắc Hà cao cấp.",
    estPrice: "3.800.000₫ - 4.800.000₫",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
  },
  {
    code: "SET-CUOI-TRUYEN-THONG-01",
    title: "Set Cưới H'Mông Đen Truyền Thống",
    desc: "Đầy đủ trang phục cô dâu chú rể, nón đính chuỗi hạt bạc và tạp dề thêu tỉ mỉ.",
    estPrice: "6.500.000₫ - 8.500.000₫",
    image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=600&q=80",
  },
];

export default function TailorBookingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedDesign, setSelectedDesign] = useState("VAY-HMOOB-HOA-02");
  const [customDesignCode, setCustomDesignCode] = useState("");
  const [designImageUrl, setDesignImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Measurements State
  const [height, setHeight] = useState<number | "">(160);
  const [weight, setWeight] = useState<number | "">(50);
  const [bust, setBust] = useState<number | "">(86);
  const [waist, setWaist] = useState<number | "">(66);
  const [hips, setHips] = useState<number | "">(90);
  const [shoulderWidth, setShoulderWidth] = useState<number | "">(38);
  const [armLength, setArmLength] = useState<number | "">(54);
  const [dressLength, setDressLength] = useState<number | "">(110);
  const [extraNotes, setExtraNotes] = useState("");
  const [notes, setNotes] = useState("");

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<TailorOrderResponse | null>(null);

  // Prefill user data if logged in
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      if (user.profile?.full_name) setCustomerName((prev) => prev || user.profile?.full_name || "");
      if (user.phone) setCustomerPhone((prev) => prev || user.phone || "");
      if (user.profile?.address) setCustomerAddress((prev) => prev || user.profile?.address || "");
    }, 0);
    return () => clearTimeout(timer);
  }, [user]);

  // Upload custom design image (Public upload folder "tailors")
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setErrorMessage(null);
    try {
      const media = await mediaService.upload(file, "tailors", "Mẫu thiết kế may đo riêng");
      setDesignImageUrl(media.url);
    } catch (err) {
      setErrorMessage(getErrorMessage(err, "Không thể tải lên ảnh mẫu thiết kế."));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const designCodeToSubmit =
      selectedDesign === "CUSTOM"
        ? customDesignCode.trim() || "THIET_KE_RIENG"
        : selectedDesign;

    if (!designCodeToSubmit) {
      setErrorMessage("Vui lòng chọn hoặc nhập mã mẫu thiết kế.");
      return;
    }

    if (!customerPhone.trim()) {
      setErrorMessage("Vui lòng nhập số điện thoại để nhân viên xưởng may liên hệ tư vấn.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await tailorService.createTailorOrder({
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_address: customerAddress.trim() || undefined,
        design_code: designCodeToSubmit,
        design_image_url: designImageUrl || undefined,
        height: typeof height === "number" ? height : undefined,
        weight: typeof weight === "number" ? weight : undefined,
        measurements: {
          height: typeof height === "number" ? height : undefined,
          weight: typeof weight === "number" ? weight : undefined,
          bust: typeof bust === "number" ? bust : undefined,
          waist: typeof waist === "number" ? waist : undefined,
          hips: typeof hips === "number" ? hips : undefined,
          shoulder_width: typeof shoulderWidth === "number" ? shoulderWidth : undefined,
          arm_length: typeof armLength === "number" ? armLength : undefined,
          dress_length: typeof dressLength === "number" ? dressLength : undefined,
          extra_notes: extraNotes.trim() || undefined,
        },
        notes: notes.trim() || undefined,
      });

      setCreatedOrder(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrorMessage(getErrorMessage(err, "Không thể gửi yêu cầu may đo. Vui lòng thử lại."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen py-8 sm:py-12 bg-[#faf8f5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-4">
          <Link href="/" className="hover:text-amber-800 transition-colors">
            Trang Chủ
          </Link>
          <span>/</span>
          <span className="text-amber-900 font-bold">Kênh May Đo Cá Nhân Hóa</span>
        </nav>

        {/* Hero Banner Header */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-stone-800 mb-8 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold tracking-wider uppercase">
              ✂️ Nghệ Nhân Sa Pa & Bắc Hà
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
              May Đo Trang Phục H'Mông Theo Số Đo Riêng
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Từng đường kim mũi chỉ được thêu tay tỉ mỉ từ vải lanh dệt thủ công và sáp ong tự nhiên.
              Điền thông số cơ thể và nhận trang phục vừa vặn hoàn hảo tận tay.
            </p>
          </div>
        </div>

        {/* THÀNH CÔNG: Hiển thị Card khi đã gửi đơn */}
        {createdOrder ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-md text-center max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl mx-auto">
              ✓
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-black text-stone-900">
                Gửi Yêu Cầu May Đo Thành Công!
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Mã đơn may đo của bạn là:{" "}
                <strong className="text-amber-900 font-mono text-base block mt-1">
                  {createdOrder.order_code}
                </strong>
              </p>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Nhân viên xưởng may Sa Pa sẽ gọi điện đến số <strong>{createdOrder.customer_phone}</strong> trong vòng 2-4 giờ làm việc để tư vấn hoa văn, chốt giá chính thức và nhận tiền cọc.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Mẫu thiết kế:</span>
                <span className="font-bold text-stone-900">{createdOrder.design_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Trạng thái:</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                  CHỜ TƯ VẤN & CHỐT CỌC
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Ngày tạo:</span>
                <span>{new Date(createdOrder.created_at).toLocaleString("vi-VN")}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href={`/tracking?code=${encodeURIComponent(createdOrder.order_code)}`}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                🔍 Tra Cứu Tiến Độ May
              </Link>
              {isAuthenticated && (
                <Link
                  href="/orders?tab=tailors"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs transition-colors"
                >
                  Xem Đơn May Đo Của Tôi
                </Link>
              )}
              <button
                type="button"
                onClick={() => setCreatedOrder(null)}
                className="w-full sm:w-auto px-4 py-2 text-xs text-stone-500 hover:text-stone-800 underline"
              >
                Gửi yêu cầu may đơn khác
              </button>
            </div>
          </div>
        ) : (
          /* FORM ĐẶT MAY */
          <form onSubmit={handleSubmit} className="space-y-8">
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2.5">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Bước 1: Chọn mẫu thiết kế */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                    Bước 1
                  </span>
                  <h2 className="text-lg font-serif font-black text-stone-900">
                    Chọn Mẫu Thiết Kế Hoặc Tải Lên Ảnh Mẫu Riêng
                  </h2>
                </div>
              </div>

              {/* Lưới các mẫu gợi ý */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SAMPLE_DESIGNS.map((item) => (
                  <div
                    key={item.code}
                    onClick={() => setSelectedDesign(item.code)}
                    className={`rounded-2xl p-3 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      selectedDesign === item.code
                        ? "border-amber-700 bg-amber-50/50 shadow-sm"
                        : "border-stone-200 bg-white hover:border-amber-400"
                    }`}
                  >
                    <div className="relative h-40 w-full rounded-xl overflow-hidden bg-stone-100 mb-2">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                      {selectedDesign === item.code && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                          ✓
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-stone-900 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">
                        {item.desc}
                      </p>
                      <span className="font-bold text-amber-900 text-xs block mt-1">
                        Ước tính: {item.estPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tùy chọn thiết kế mẫu riêng */}
              <div className="pt-4 border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="radio"
                    name="designSelect"
                    checked={selectedDesign === "CUSTOM"}
                    onChange={() => setSelectedDesign("CUSTOM")}
                    className="accent-amber-700 w-4 h-4"
                  />
                  <span className="text-xs sm:text-sm font-bold text-stone-900">
                    Tôi có mẫu thiết kế riêng (Muốn may theo ảnh mẫu hoặc mô tả tùy biến)
                  </span>
                </label>

                {selectedDesign === "CUSTOM" && (
                  <div className="pl-6 space-y-3">
                    <input
                      type="text"
                      value={customDesignCode}
                      onChange={(e) => setCustomDesignCode(e.target.value)}
                      placeholder="Nhập tên phong cách (Ví dụ: Váy cưới H'Mông Trắng Mèo Vạc...)"
                      className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
                    />
                  </div>
                )}

                {/* Upload ảnh mẫu tùy chọn */}
                <div className="mt-3 flex items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="px-4 py-2 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold cursor-pointer flex items-center gap-2"
                  >
                    <span>📷</span>
                    <span>{isUploadingImage ? "Đang tải ảnh..." : "Tải lên ảnh mẫu thiết kế (nếu có)"}</span>
                  </button>

                  {designImageUrl && (
                    <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                      <span>✓ Đã tải ảnh lên thành công</span>
                      <a
                        href={mediaService.getImageUrl(designImageUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        (Xem ảnh)
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bước 2: Thông số số đo cơ thể */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
              <div className="border-b border-stone-100 pb-3">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  Bước 2
                </span>
                <h2 className="text-lg font-serif font-black text-stone-900">
                  Thông Số Cơ Thể & Số Đo 3 Vòng (cm)
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Nghệ nhân may đo sẽ dựa trên số đo này để cắt rập chuẩn xác nhất cho vóc dáng của bạn.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Chiều cao (cm) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={height}
                    onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : "")}
                    placeholder="160"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cân nặng (kg) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
                    placeholder="50"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Vòng 1 - Ngực (cm)
                  </label>
                  <input
                    type="number"
                    value={bust}
                    onChange={(e) => setBust(e.target.value ? Number(e.target.value) : "")}
                    placeholder="86"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Vòng 2 - Eo (cm)
                  </label>
                  <input
                    type="number"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value ? Number(e.target.value) : "")}
                    placeholder="66"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Vòng 3 - Mông (cm)
                  </label>
                  <input
                    type="number"
                    value={hips}
                    onChange={(e) => setHips(e.target.value ? Number(e.target.value) : "")}
                    placeholder="90"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Rộng vai (cm)
                  </label>
                  <input
                    type="number"
                    value={shoulderWidth}
                    onChange={(e) => setShoulderWidth(e.target.value ? Number(e.target.value) : "")}
                    placeholder="38"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Dài tay áo (cm)
                  </label>
                  <input
                    type="number"
                    value={armLength}
                    onChange={(e) => setArmLength(e.target.value ? Number(e.target.value) : "")}
                    placeholder="54"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Dài váy / Áo (cm)
                  </label>
                  <input
                    type="number"
                    value={dressLength}
                    onChange={(e) => setDressLength(e.target.value ? Number(e.target.value) : "")}
                    placeholder="110"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Đặc điểm vóc dáng hoặc yêu cầu riêng
                </label>
                <input
                  type="text"
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                  placeholder="Ví dụ: Eo nhỏ lưng dài, muốn may tùng váy xòe rộng, phối viền thổ cẩm đỏ..."
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            {/* Bước 3: Thông tin liên hệ nhận hàng */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
              <div className="border-b border-stone-100 pb-3">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  Bước 3
                </span>
                <h2 className="text-lg font-serif font-black text-stone-900">
                  Thông Tin Liên Hệ Tư Vấn & Nhận Hàng
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Họ và tên của bạn <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Giàng Thị Hoa"
                    className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Số điện thoại liên hệ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0988 123 456"
                    className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Địa chỉ giao nhận trang phục sau khi may xong
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Số nhà, đường phố, thị trấn, huyện, tỉnh..."
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ghi chú thêm về chất liệu vải hoặc thời hạn nhận đồ
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tôi muốn dùng vải lanh dệt tay cổ truyền, cần nhận trước ngày 20 tháng sau để kịp dự lễ hội..."
                  className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl resize-none"
                />
              </div>
            </div>

            {/* Nút gửi form */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-stone-500">
                🔒 Thông tin số đo được bảo mật và chỉ chuyển tiếp cho thợ may phụ trách.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-stone-900 hover:bg-amber-800 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi Yêu Cầu May Đo Ngay →"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

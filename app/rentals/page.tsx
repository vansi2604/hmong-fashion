"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { productService } from "@/services/product.service";
import { rentalService } from "@/services/rental.service";
import { formatVND } from "@/lib/utils";
import { getProductImageUrl } from "@/utils/product.utils";
import { getErrorMessage } from "@/lib/errors";
import type { Product } from "@/types/product";
import type { RentalBookingResponse } from "@/types/rental";

export default function RentalsStorefrontPage() {
  const { user, isAuthenticated } = useAuth();

  // Danh sách sản phẩm cho thuê
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Modal Đặt Thuê State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [depositAmount, setDepositAmount] = useState(300000);

  // Availability Check State
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState<{
    available: boolean;
    text: string;
  } | null>(null);

  // Booking Submit State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<RentalBookingResponse | null>(null);

  // Khởi tạo ngày mặc định (Ngày mai và ngày kia)
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 3);

    const fmt = (d: Date) => d.toISOString().split("T")[0];
    setStartDate(fmt(tomorrow));
    setEndDate(fmt(dayAfter));
  }, []);

  // Nạp danh sách sản phẩm có cho thuê (rental_price_per_day > 0)
  useEffect(() => {
    const fetchRentalProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const allProducts = await productService.getProducts({ limit: 50 });
        const rentalList = (allProducts || []).filter(
          (p) => (p.rental_price_per_day ?? 0) > 0
        );
        setProducts(rentalList);
      } catch (err) {
        console.error("Lỗi nạp sản phẩm cho thuê:", err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchRentalProducts();
  }, []);

  // Prefill thông tin user nếu đã đăng nhập
  useEffect(() => {
    if (user) {
      if (user.profile?.full_name) setCustomerName(user.profile.full_name);
      if (user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Tính số ngày thuê
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    if (end < start) return 1;
    return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const days = calculateDays();
  const rentalPricePerDay = selectedProduct?.rental_price_per_day || 0;
  const estimatedTotal = days * rentalPricePerDay;

  // Kiểm tra lịch trống
  const handleCheckAvailability = async () => {
    if (!selectedProduct || !startDate || !endDate) return;
    setIsChecking(true);
    setAvailabilityMessage(null);
    setBookingError(null);

    try {
      const res = await rentalService.checkAvailability({
        product_id: selectedProduct.id,
        start_date: startDate,
        end_date: endDate,
      });

      setAvailabilityMessage({
        available: res.is_available,
        text: res.message || (res.is_available ? "Lịch thuê còn trống, có thể đặt lịch ngay!" : "Trang phục đã có người đặt trong khoảng ngày này."),
      });
    } catch (err) {
      setAvailabilityMessage({
        available: false,
        text: getErrorMessage(err, "Không thể kiểm tra lịch trống vào lúc này."),
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Gửi đơn đặt thuê
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setBookingError(null);

    if (!customerPhone.trim()) {
      setBookingError("Vui lòng nhập số điện thoại để nhân viên liên hệ xác nhận lịch nhận đồ.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await rentalService.createBooking({
        product_id: selectedProduct.id,
        customer_name: customerName.trim() || undefined,
        customer_phone: customerPhone.trim(),
        start_date: startDate,
        end_date: endDate,
        total_price: 0, // Server tự tính
        deposit_amount: depositAmount || undefined,
      });

      setCreatedBooking(res);
      setSelectedProduct(null);
    } catch (err) {
      setBookingError(getErrorMessage(err, "Đặt thuê trang phục không thành công."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen py-8 sm:py-12 bg-[#faf8f5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-4">
          <Link href="/" className="hover:text-amber-800 transition-colors">
            Trang Chủ
          </Link>
          <span>/</span>
          <span className="text-amber-900 font-bold">Dịch Vụ Cho Thuê Trang Phục</span>
        </nav>

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-stone-800 mb-8 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold tracking-wider uppercase">
              👘 Thuê Trang Phục Bản Địa
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
              Cho Thuê Trang Phục H'Mông Truyền Thống & Cách Tân
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Trải nghiệm mặc trang phục H'Mông nguyên bản để chụp ảnh kỷ yếu, du lịch Sa Pa, Bắc Hà, Y Tý.
              Trọn bộ phụ kiện nón bạc, khuyên tai, xà tích và tạp dề thổ cẩm thêu tay.
            </p>
          </div>
        </div>

        {/* Thông báo đặt thuê thành công */}
        {createdBooking && (
          <div className="mb-8 bg-white rounded-3xl p-8 border border-emerald-300 shadow-md text-center max-w-2xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl mx-auto">
              ✓
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900">
              Đặt Lịch Thuê Thành Công!
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Mã lịch thuê của bạn:{" "}
              <strong className="text-emerald-800 font-mono text-base block mt-1">
                {createdBooking.booking_code}
              </strong>
            </p>
            <p className="text-xs text-stone-500">
              Khoảng ngày: <strong>{createdBooking.start_date}</strong> đến <strong>{createdBooking.end_date}</strong> • Tổng chi phí ước tính:{" "}
              <strong className="text-stone-900">{formatVND(createdBooking.total_price)}</strong>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href={`/tracking?code=${encodeURIComponent(createdBooking.booking_code)}`}
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                🔍 Tra Cứu Lịch Thuê
              </Link>
              {isAuthenticated && (
                <Link
                  href="/orders?tab=rentals"
                  className="px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs transition-colors"
                >
                  Xem Lịch Thuê Của Tôi
                </Link>
              )}
              <button
                type="button"
                onClick={() => setCreatedBooking(null)}
                className="px-4 py-2 text-xs text-stone-500 hover:text-stone-800 underline"
              >
                Đóng thông báo
              </button>
            </div>
          </div>
        )}

        {/* Danh sách trang phục cho thuê */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-black text-stone-900">
                Danh Sách Trang Phục Có Sẵn Cho Thuê
              </h2>
              <p className="text-xs text-stone-500">
                Chọn mẫu ưng ý và kiểm tra ngày trống để giữ chỗ ngay.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              {products.length} bộ sẵn sàng
            </span>
          </div>

          {isLoadingProducts ? (
            <div className="py-16 text-center text-xs text-stone-500">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-700 border-t-transparent animate-spin mx-auto mb-2" />
              Đang tải danh sách trang phục cho thuê...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-64 w-full bg-stone-100 overflow-hidden">
                      <Image
                        src={getProductImageUrl(item)}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-800/90 text-white font-bold text-[10px] tracking-wider uppercase shadow-xs">
                        Thuê theo ngày
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-emerald-800 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-2">
                        {item.description || "Set trang phục thổ cẩm đính chuỗi hạt cườm, khăn xếp và phụ kiện bạc H'Mông đi kèm trọn gói."}
                      </p>

                      <div className="pt-2 flex items-baseline gap-1.5">
                        <span className="text-xs text-stone-400 font-medium">Giá thuê:</span>
                        <strong className="text-lg font-black text-emerald-800 font-serif">
                          {formatVND(item.rental_price_per_day)}
                        </strong>
                        <span className="text-xs text-stone-500">/ngày</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProduct(item);
                        setAvailabilityMessage(null);
                        setBookingError(null);
                      }}
                      className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>📅</span>
                      <span>Chọn Ngày & Đặt Thuê</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL ĐẶT THUÊ & KIỂM TRA LỊCH TRỐNG */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-stone-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
              {/* Header Modal */}
              <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider block">
                    Đăng Ký Thuê Đồ
                  </span>
                  <h3 className="text-base sm:text-lg font-serif font-black text-stone-900">
                    {selectedProduct.name}
                  </h3>
                  <span className="text-xs text-emerald-700 font-bold">
                    {formatVND(selectedProduct.rental_price_per_day)}/ngày
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {bookingError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  ⚠️ {bookingError}
                </div>
              )}

              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
                {/* Chọn khoảng ngày */}
                <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Ngày nhận trang phục
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setAvailabilityMessage(null);
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Ngày hẹn trả đồ
                    </label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setAvailabilityMessage(null);
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="col-span-2 pt-1 flex items-center justify-between">
                    <span className="text-stone-500">
                      Thời gian: <strong>{days} ngày</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleCheckAvailability}
                      disabled={isChecking}
                      className="text-emerald-800 hover:text-emerald-900 font-bold underline cursor-pointer"
                    >
                      {isChecking ? "Đang kiểm tra..." : "⚡ Kiểm tra lịch trống"}
                    </button>
                  </div>
                </div>

                {/* Kết quả kiểm tra lịch trống */}
                {availabilityMessage && (
                  <div
                    className={`p-3 rounded-xl border text-[11px] font-medium flex items-center gap-2 ${
                      availabilityMessage.available
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}
                  >
                    <span>{availabilityMessage.available ? "✓" : "⚠️"}</span>
                    <span>{availabilityMessage.text}</span>
                  </div>
                )}

                {/* Thông tin khách hàng */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Họ và tên người thuê
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Lò Thị Mai"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Số điện thoại <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Tóm tắt chi phí & Tiền cọc */}
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-1.5">
                  <div className="flex justify-between text-stone-600">
                    <span>Đơn giá thuê:</span>
                    <span>{formatVND(rentalPricePerDay)} x {days} ngày</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-900">
                    <span>Tổng tiền thuê dự kiến:</span>
                    <span className="text-emerald-800 font-serif text-sm">
                      {formatVND(estimatedTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                    <span className="text-stone-600 font-medium">Tiền đặt cọc trang phục:</span>
                    <span className="font-bold text-amber-900">{formatVND(depositAmount)}</span>
                  </div>
                  <p className="text-[10px] text-stone-400 italic">
                    * Tiền cọc sẽ được hoàn trả 100% ngay khi quý khách trả lại trang phục nguyên vẹn.
                  </p>
                </div>

                {/* Nút bấm */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-semibold cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? "Đang gửi đơn..." : "Xác Nhận Đặt Thuê →"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

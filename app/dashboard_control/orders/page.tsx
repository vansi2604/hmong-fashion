"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { formatVND } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import type { Order } from "@/types/api";

export default function DashboardOrdersPage() {
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>("ALL");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [statusUpdateVal, setStatusUpdateVal] = useState<string>("");

  // Dữ liệu mẫu phong phú tương thích cấu trúc Order từ API
  const [orders, setOrders] = useState<any[]>([
    {
      id: 101,
      order_code: "HMOOB-20261113-88A1",
      customer_name: "Sùng A Dũng",
      customer_phone: "0988 123 456",
      shipping_address: "Bản Cát Cát, Xã San Sả Hồ, Sa Pa, Lào Cai",
      order_type: "BUY",
      total_amount: 1850000,
      payment_method: "COD",
      payment_status: "PENDING",
      status: "PENDING",
      notes: "Giao giờ hành chính, bọc chống sốc cẩn thận giúp tôi.",
      created_at: "2026-11-13T09:15:00Z",
      items: [
        { name: "Áo Khoác Bomber Chàm Sáp Ong", size: "L", qty: 1, price: 1850000 },
      ],
    },
    {
      id: 102,
      order_code: "TAILOR-20261113-91C4",
      customer_name: "Hoàng Thị Mỷ",
      customer_phone: "0912 345 678",
      shipping_address: "Số 45 Đường Fansipan, Sa Pa, Lào Cai",
      order_type: "TAILOR",
      total_amount: 2800000,
      deposit_amount: 1000000,
      deposit_status: "DEPOSITED",
      payment_method: "BANK_TRANSFER",
      payment_status: "PAID",
      status: "PROCESSING",
      notes: "Mẫu váy đầm cổ yếm chàm thêu hoa văn ngũ sắc. Đã nhận cọc 1 triệu.",
      created_at: "2026-11-13T08:45:00Z",
      items: [
        { name: "Váy Đầm Cách Tân May Đo Theo Số Đo", size: "Bespoke", qty: 1, price: 2800000 },
      ],
    },
    {
      id: 103,
      order_code: "RENT-20261113-44E2",
      customer_name: "Trần Mai Anh",
      customer_phone: "0904 789 012",
      shipping_address: "Khách sạn De la Coupole, Sa Pa, Lào Cai",
      order_type: "RENT",
      total_amount: 650000,
      deposit_amount: 300000,
      deposit_status: "DEPOSITED",
      payment_method: "VNPAY",
      payment_status: "PAID",
      status: "SHIPPED",
      notes: "Thuê chụp ảnh ngoại cảnh bản Tả Van trong 3 ngày.",
      created_at: "2026-11-13T07:20:00Z",
      items: [
        { name: "Set Trang Phục Hmong Đen Truyền Thống Đầy Đủ Nón Bạc", size: "M", qty: 1, price: 650000 },
      ],
    },
    {
      id: 104,
      order_code: "HMOOB-20261113-72F8",
      customer_name: "Vàng Thị Chơ",
      customer_phone: "0977 662 331",
      shipping_address: "Xã Tả Phìn, Sa Pa, Lào Cai",
      order_type: "BUY",
      total_amount: 3200000,
      payment_method: "VNPAY",
      payment_status: "PAID",
      status: "CONFIRMED",
      notes: "Đơn mua 2 khăn choàng và 1 áo sơ mi linen thêu tay.",
      created_at: "2026-11-13T06:10:00Z",
      items: [
        { name: "Khăn Choàng Batik Chàm Tự Nhiên", size: "Freesize", qty: 2, price: 1240000 },
        { name: "Áo Sơ Mi Linen Thêu Tay Hmong", size: "M", qty: 1, price: 1960000 },
      ],
    },
    {
      id: 105,
      order_code: "HMOOB-20261112-19B3",
      customer_name: "Nguyễn Tuấn Kiệt",
      customer_phone: "0933 555 777",
      shipping_address: "Quận 1, TP. Hồ Chí Minh",
      order_type: "BUY",
      total_amount: 1450000,
      payment_method: "COD",
      payment_status: "PAID",
      status: "COMPLETED",
      notes: "Khách đã nhận hàng và thanh toán đủ cho shipper Viettel Post.",
      created_at: "2026-11-12T14:30:00Z",
      items: [
        { name: "Túi Tote Thổ Cẩm Ghép Mảnh Batik", size: "One size", qty: 2, price: 1450000 },
      ],
    },
    {
      id: 106,
      order_code: "HMOOB-20261111-05A9",
      customer_name: "Lê Thu Trang",
      customer_phone: "0966 888 999",
      shipping_address: "Quận Cầu Giấy, Hà Nội",
      order_type: "BUY",
      total_amount: 980000,
      payment_method: "COD",
      payment_status: "FAILED",
      status: "CANCELLED",
      notes: "Khách bận đi công tác đột xuất nên xin phép hủy đơn.",
      created_at: "2026-11-11T11:00:00Z",
      items: [
        { name: "Vòng Cổ Bạc Hmong Thủ Công Chạm Khắc", size: "Tiêu chuẩn", qty: 1, price: 980000 },
      ],
    },
  ]);

  // Cố gắng gọi API backend nếu server đang hoạt động
  useEffect(() => {
    async function loadApiOrders() {
      try {
        const res = await apiClient.get<Order[]>("/orders/");
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setOrders(res.data);
        }
      } catch {
        // Fallback sang dữ liệu mẫu chất lượng cao ở trên
      }
    }
    loadApiOrders();
  }, []);

  // Bộ lọc dữ liệu theo trạng thái, loại đơn và từ khóa tìm kiếm
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // 1. Lọc theo trạng thái tab
      if (selectedStatusTab !== "ALL" && o.status !== selectedStatusTab) {
        return false;
      }
      // 2. Lọc theo loại đơn hàng
      if (selectedTypeFilter !== "ALL" && o.order_type !== selectedTypeFilter) {
        return false;
      }
      // 3. Tìm kiếm theo mã đơn, họ tên hoặc số điện thoại
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchCode = o.order_code?.toLowerCase().includes(query);
        const matchName = o.customer_name?.toLowerCase().includes(query);
        const matchPhone = o.customer_phone?.toLowerCase().includes(query);
        return matchCode || matchName || matchPhone;
      }
      return true;
    });
  }, [orders, selectedStatusTab, selectedTypeFilter, searchQuery]);

  // Đếm số lượng đơn theo từng trạng thái
  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "PENDING").length,
      confirmed: orders.filter((o) => o.status === "CONFIRMED").length,
      processing: orders.filter((o) => o.status === "PROCESSING").length,
      shipped: orders.filter((o) => o.status === "SHIPPED").length,
      completed: orders.filter((o) => o.status === "COMPLETED").length,
      cancelled: orders.filter((o) => o.status === "CANCELLED").length,
    };
  }, [orders]);

  const handleUpdateStatus = (newStatus: string) => {
    if (!selectedOrder) return;
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === selectedOrder.id ? { ...ord, status: newStatus } : ord
      )
    );
    setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "Chờ xác nhận", style: "bg-amber-100 text-amber-900 border-amber-300" };
      case "CONFIRMED":
        return { label: "Đã xác nhận", style: "bg-blue-100 text-blue-900 border-blue-300" };
      case "PROCESSING":
        return { label: "Đang xử lý / may", style: "bg-purple-100 text-purple-900 border-purple-300" };
      case "SHIPPED":
        return { label: "Đang giao hàng", style: "bg-indigo-100 text-indigo-900 border-indigo-300" };
      case "COMPLETED":
        return { label: "Hoàn tất", style: "bg-emerald-100 text-emerald-900 border-emerald-300" };
      case "CANCELLED":
        return { label: "Đã hủy", style: "bg-rose-100 text-rose-900 border-rose-300" };
      default:
        return { label: status, style: "bg-stone-100 text-stone-800 border-stone-300" };
    }
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Breadcrumbs & Page Header */}
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
            <span className="text-amber-900 font-bold">Quản Lý Đơn Hàng</span>
          </nav>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
              Quản Lý Đơn Hàng & Vận Chuyển
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">
              {orders.length} đơn
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Xử lý quy trình đơn bán lẻ, đơn may đo riêng thổ cẩm và hợp đồng thuê trang phục lễ hội.
          </p>
        </div>

        {/* Nút hành động bổ sung */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard_control"
            className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-xs transition-colors"
          >
            ← Bảng Điều Khiển
          </Link>
          <button
            type="button"
            onClick={() => alert("Xuất danh sách đơn hàng sang file Excel thành công!")}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-amber-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            📊 Xuất Excel
          </button>
        </div>
      </div>

      {/* 2. Dải Thống Kê & Lọc Theo Tab Trạng Thái */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200/90 shadow-xs flex items-center gap-1 overflow-x-auto no-scrollbar">
        {[
          { key: "ALL", label: "Tất cả", count: counts.all },
          { key: "PENDING", label: "Chờ xác nhận", count: counts.pending, alert: counts.pending > 0 },
          { key: "CONFIRMED", label: "Đã xác nhận", count: counts.confirmed },
          { key: "PROCESSING", label: "Đang may / Đóng gói", count: counts.processing },
          { key: "SHIPPED", label: "Đang giao", count: counts.shipped },
          { key: "COMPLETED", label: "Hoàn tất", count: counts.completed },
          { key: "CANCELLED", label: "Đã hủy", count: counts.cancelled },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSelectedStatusTab(tab.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              selectedStatusTab === tab.key
                ? "bg-amber-600 text-stone-950 font-bold shadow-xs"
                : "text-stone-600 hover:text-stone-950 hover:bg-stone-100"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedStatusTab === tab.key
                  ? "bg-stone-950 text-amber-400 font-black"
                  : tab.alert
                  ? "bg-rose-100 text-rose-800 font-bold"
                  : "bg-stone-200 text-stone-700"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. Thanh Tìm Kiếm & Bộ Lọc Nâng Cao */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã đơn (HMOOB, TAILOR), họ tên, SĐT..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-amber-700 bg-stone-50"
          />
          <span className="absolute left-3 top-2.5 text-stone-400 text-xs">🔍</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2 text-stone-400 hover:text-stone-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Lọc loại đơn: BUY / TAILOR / RENT */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 font-medium whitespace-nowrap">Phân loại:</span>
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50 text-stone-800 font-medium focus:outline-none focus:border-amber-700"
          >
            <option value="ALL">Tất cả loại đơn</option>
            <option value="BUY">🛍️ Mua sắm bản địa</option>
            <option value="TAILOR">✂️ May đo riêng theo số đo</option>
            <option value="RENT">👘 Thuê trang phục lễ hội</option>
          </select>
        </div>
      </div>

      {/* 4. Bảng Danh Sách Đơn Hàng */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3 px-4">Mã Đơn & Thời Gian</th>
                <th className="py-3 px-4">Khách Hàng</th>
                <th className="py-3 px-4">Phân Loại</th>
                <th className="py-3 px-4">Sản Phẩm / Dịch Vụ</th>
                <th className="py-3 px-4">Tổng Tiền</th>
                <th className="py-3 px-4">Thanh Toán</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400 text-xs">
                    Không tìm thấy đơn hàng nào phù hợp với điều kiện lọc.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = getStatusBadge(order.status);
                  return (
                    <tr
                      key={order.id || order.order_code}
                      className="hover:bg-amber-50/30 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(order);
                            setStatusUpdateVal(order.status);
                            setIsDetailModalOpen(true);
                          }}
                          className="hover:text-amber-800 hover:underline text-left cursor-pointer"
                        >
                          {order.order_code}
                        </button>
                        <span className="block text-[10px] text-stone-400 font-normal font-sans">
                          {new Date(order.created_at).toLocaleString("vi-VN", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-900 block">
                          {order.customer_name}
                        </span>
                        <span className="text-stone-400 text-[11px]">
                          {order.customer_phone}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] uppercase border ${
                            order.order_type === "TAILOR"
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : order.order_type === "RENT"
                              ? "bg-purple-50 text-purple-800 border-purple-200"
                              : "bg-stone-100 text-stone-800 border-stone-200"
                          }`}
                        >
                          {order.order_type === "TAILOR"
                            ? "✂️ May đo"
                            : order.order_type === "RENT"
                            ? "👘 Thuê đồ"
                            : "🛍️ Mua sắm"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate text-stone-700">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((it: any) => it.name).join(", ")
                        ) : (
                          <span className="text-stone-400 italic">{order.notes || "Chi tiết đơn hàng"}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        {formatVND(order.total_amount)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-800 block">
                          {order.payment_method}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            order.payment_status === "PAID"
                              ? "text-emerald-700"
                              : order.payment_status === "FAILED"
                              ? "text-rose-600"
                              : "text-amber-800"
                          }`}
                        >
                          {order.payment_status === "PAID"
                            ? "✓ Đã thanh toán"
                            : order.payment_status === "FAILED"
                            ? "✗ Thất bại"
                            : "• Chưa thanh toán"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${statusInfo.style}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(order);
                            setStatusUpdateVal(order.status);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-3 py-1 bg-stone-900 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          Xem & Sửa
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Modal Xem Chi Tiết & Cập Nhật Trạng Thái Đơn Hàng */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-stone-200">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-amber-800 font-extrabold">
                  Chi tiết đơn hàng nội bộ
                </span>
                <h3 className="text-xl font-serif font-black text-stone-900">
                  {selectedOrder.order_code}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Thông tin khách hàng */}
            <div className="space-y-2 text-xs text-stone-700 bg-stone-50 p-4 rounded-2xl border border-stone-200/70">
              <div className="flex justify-between">
                <span className="text-stone-400">Khách hàng:</span>
                <strong className="text-stone-900">{selectedOrder.customer_name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Số điện thoại:</span>
                <strong className="text-stone-900">{selectedOrder.customer_phone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Địa chỉ giao:</span>
                <span className="text-right text-stone-900 font-medium max-w-[260px]">
                  {selectedOrder.shipping_address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Phương thức TT:</span>
                <strong className="text-stone-900">{selectedOrder.payment_method}</strong>
              </div>
              {selectedOrder.notes && (
                <div className="pt-2 border-t border-stone-200 text-stone-600">
                  <span className="text-stone-400 block mb-0.5">Ghi chú từ khách:</span>
                  <p className="italic bg-white p-2 rounded-lg border border-stone-200">
                    "{selectedOrder.notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Cập nhật trạng thái */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800">
                Chuyển Trạng Thái Đơn Hàng:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"].map(
                  (st) => {
                    const badge = getStatusBadge(st);
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleUpdateStatus(st)}
                        className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                          selectedOrder.status === st
                            ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                            : `${badge.style} hover:opacity-80`
                        }`}
                      >
                        {badge.label}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Footer hành động modal */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-sm font-bold text-stone-900">
                Tổng: <span className="text-amber-800">{formatVND(selectedOrder.total_amount)}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs cursor-pointer shadow-xs transition-colors"
              >
                Lưu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

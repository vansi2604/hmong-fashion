"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/types/product";

export interface EcommerceProductGridProps {
  products: Product[];
  title?: string;
}

export function EcommerceProductGrid({
  products,
  title = "GỢI Ý HÔM NAY DÀNH RIÊNG CHO BẠN",
}: EcommerceProductGridProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [displayCount, setDisplayCount] = useState<number>(8);

  const tabs = [
    { id: "all", label: "Tất Cả" },
    { id: "TRADITIONAL", label: "👘 Truyền Thống H'Mông" },
    { id: "MODERN", label: "✨ Cách Tân Hiện Đại" },
    { id: "ACCESSORIES", label: "💍 Bạc & Phụ Kiện" },
    { id: "best-seller", label: "🔥 Bán Chạy Nhất" },
  ];

  const filtered = products.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "best-seller") return (p.soldCount ?? 0) > 100 || p.badge === "Bán chạy";

    const cat = String(p.category || "").toUpperCase();
    if (activeTab === "TRADITIONAL") return cat === "TRADITIONAL" || cat === "VAY-DAM";
    if (activeTab === "MODERN") return cat === "MODERN" || cat === "AO-KHOAC" || cat === "AO-SO-MI";
    if (activeTab === "ACCESSORIES") return cat === "ACCESSORIES" || cat === "PHU-KIEN";

    return p.category === activeTab;
  });

  const visibleProducts = filtered.slice(0, displayCount);

  return (
    <section className="py-8 bg-stone-100/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Marketplace Section Title with Red underline */}
        <div className="border-b-2 border-amber-800 pb-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-700 animate-ping" />
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-stone-900">
              {title}
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-medium hidden sm:inline">
            Dữ liệu đồng bộ trực tiếp từ máy chủ Backend
          </span>
        </div>

        {/* E-Commerce Sticky Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setDisplayCount(8);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-amber-800 text-white shadow-xs"
                    : "bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Marketplace Grid (2 cols mobile, 3 tablet, 4 desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {visibleProducts.length === 0 && (
          <div className="text-center py-12 text-stone-500 text-sm bg-white rounded-xl border border-stone-200 mt-4">
            Chưa có sản phẩm nào trong danh mục này.
          </div>
        )}

        {/* Load More Button */}
        {filtered.length > displayCount && (
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => setDisplayCount((prev) => prev + 4)}
              className="bg-white hover:bg-stone-50 text-stone-800 font-bold px-8 py-3 rounded-xl border border-stone-300 hover:border-amber-700 shadow-xs text-xs sm:text-sm uppercase tracking-wider transition-colors cursor-pointer"
            >
              Xem Thêm Sản Phẩm Khác ({filtered.length - displayCount})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default EcommerceProductGrid;

"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/types/product";

export interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export function ProductGrid({
  products,
  title = "Bộ Sưu Tập Tiêu Biểu",
  subtitle = "Những thiết kế cách tân kết hợp nghệ thuật thủ công Hmong được yêu thích nhất",
}: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "Tất Cả" },
    { id: "ao-khoac", label: "Áo Khoác" },
    { id: "vay-dam", label: "Váy & Đầm" },
    { id: "ao-so-mi", label: "Áo Sơ Mi" },
    { id: "phu-kien", label: "Khăn & Phụ Kiện" },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section className="py-16 sm:py-24 bg-stone-50/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            Tuyển Chọn Đặc Sắc
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            {title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
            {subtitle}
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-stone-900 text-white shadow-sm"
                      : "bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-stone-500 text-sm">
            Hiện chưa có sản phẩm nào thuộc danh mục này.
          </div>
        )}
      </div>
    </section>
  );
}
export default ProductGrid;

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatVND } from "@/lib/utils";
import type { Product } from "@/types/product";
import { getProductImageUrl, getCategoryLabel } from "@/utils/product.utils";

export interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const discount =
    product.discountPercent ||
    (product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null);

  const imageUrl = getProductImageUrl(product);
  const soldCount = product.soldCount ?? 0;

  return (
    <div
      className={`group relative flex flex-col bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-amber-600 hover:shadow-lg transition-all duration-200 ${
        className || ""
      }`}
    >
      {/* Product Image Container */}
      <Link
        href={`/products/${product.slug || product.id}`}
        className="relative block aspect-4/5 overflow-hidden bg-stone-100"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />

        {/* Mall / Yêu thích Tag */}
        {product.isOfficial && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-rose-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-wider uppercase shadow-xs">
              MALL
            </span>
          </div>
        )}

        {/* Discount Ribbon Tag (Top Right) */}
        {discount && discount > 0 && (
          <div className="absolute top-0 right-0 z-10 bg-amber-400 text-amber-950 px-2 py-1 rounded-bl-lg font-black text-xs text-center shadow-xs leading-tight">
            <span>-{discount}%</span>
            <span className="block text-[8px] font-semibold uppercase tracking-tighter text-amber-900">
              GIẢM
            </span>
          </div>
        )}

        {/* Badge Cho thuê nếu có giá thuê */}
        {(product.rental_price_per_day ?? 0) > 0 && (
          <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
            <span>👘</span> Thuê {formatVND(product.rental_price_per_day!)}/ng
          </div>
        )}
      </Link>

      {/* Product Content Body */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Category Tag */}
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
            {getCategoryLabel(product.category)}
          </span>

          {/* Product Title (2 lines clamp) */}
          <h3 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-2 leading-snug group-hover:text-amber-800 transition-colors">
            <Link href={`/products/${product.slug || product.id}`}>{product.name}</Link>
          </h3>
        </div>

        {/* Price & Sold Information */}
        <div className="pt-2 border-t border-stone-100 space-y-1.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-black text-rose-600">
              {formatVND(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-stone-400 line-through">
                {formatVND(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Rating, Sold Count */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
            <div className="flex items-center gap-1">
              <span className="text-amber-500 text-xs">★</span>
              <span className="font-semibold text-stone-700">{product.rating || 5.0}</span>
              <span className="text-stone-300">|</span>
              <span>
                Đã bán {soldCount > 1000 ? `${(soldCount / 1000).toFixed(1)}k` : soldCount}
              </span>
            </div>

            <span className="text-[10px] text-stone-400">
              Kho: {product.stock ?? 0}
            </span>
          </div>

          {/* Quick Add To Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full mt-2 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-stone-100 text-stone-800 hover:bg-stone-900 hover:text-white"
            }`}
          >
            <span>{isAdded ? "✓ Đã thêm" : "🛒 Thêm vào giỏ"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

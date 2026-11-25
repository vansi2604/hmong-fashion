"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatVND } from "@/lib/utils";
import { productService } from "@/services/product.service";
import type { Product } from "@/types/product";
import { getProductImageUrl } from "@/utils/product.utils";

interface FlashSaleSectionProps {
  products?: Product[];
}

export function FlashSaleSection({ products: initialProducts }: FlashSaleSectionProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 48,
    seconds: 35,
  });

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Nạp sản phẩm từ Backend API nếu chưa được truyền vào
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      return;
    }

    let ignore = false;
    const fetchFlashSales = async () => {
      try {
        const data = await productService.getProducts({ limit: 8 });
        if (!ignore) {
          setProducts(data || []);
        }
      } catch (err) {
        console.warn("Không thể tải sản phẩm flash sale từ API:", err);
      }
    };

    fetchFlashSales();

    return () => {
      ignore = true;
    };
  }, [initialProducts]);

  const flashSaleItems = products.slice(0, 6);

  const formatDigits = (num: number) => num.toString().padStart(2, "0");

  if (flashSaleItems.length === 0) {
    return null;
  }

  return (
    <section id="flash-sale" className="py-6 bg-white border-b border-stone-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flash Sale Header with Live Countdown */}
        <div className="bg-gradient-to-r from-amber-900 via-rose-900 to-amber-950 rounded-2xl p-4 sm:p-5 text-white shadow-sm mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xl sm:text-2xl font-black text-amber-400 uppercase tracking-wider">
                <span className="animate-bounce">⚡</span>
                <span>FLASH SALE</span>
              </div>

              {/* Countdown timer boxes */}
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <span className="text-stone-300 mr-1 text-xs font-medium">Kết thúc trong:</span>
                <span className="bg-black/60 px-2 py-1 rounded-md text-amber-400 font-mono text-sm">
                  {formatDigits(timeLeft.hours)}
                </span>
                <span>:</span>
                <span className="bg-black/60 px-2 py-1 rounded-md text-amber-400 font-mono text-sm">
                  {formatDigits(timeLeft.minutes)}
                </span>
                <span>:</span>
                <span className="bg-black/60 px-2 py-1 rounded-md text-amber-400 font-mono text-sm">
                  {formatDigits(timeLeft.seconds)}
                </span>
              </div>
            </div>

            <Link
              href="/products"
              className="text-xs sm:text-sm font-semibold text-amber-300 hover:text-white flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Xem Tất Cả Flash Sale</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Flash Sale Product Row / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {flashSaleItems.map((product, idx) => {
            const soldCount = product.soldCount ?? (idx + 1) * 12;
            const discountPercent =
              product.discountPercent ||
              (product.originalPrice && product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 15);

            const imageUrl = getProductImageUrl(product);

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug || product.id}`}
                className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-rose-100 hover:border-rose-400 hover:shadow-md transition-all p-2.5 sm:p-3"
              >
                {/* Discount Ribbon */}
                <div className="absolute top-2 right-2 z-10 bg-amber-400 text-amber-950 font-black text-[11px] px-1.5 py-0.5 rounded-md shadow-xs">
                  -{discountPercent}%
                </div>

                {/* Product Image */}
                <div className="relative aspect-square rounded-lg overflow-hidden bg-stone-100 mb-2.5">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Product Title */}
                <h3 className="text-xs font-semibold text-stone-900 line-clamp-1 group-hover:text-amber-800">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-sm sm:text-base font-bold text-rose-600">
                    {formatVND(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-[10px] text-stone-400 line-through">
                      {formatVND(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* E-Commerce Sold Progress Bar */}
                <div className="mt-2 relative w-full bg-rose-100 rounded-full h-4 overflow-hidden flex items-center justify-center">
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                    style={{ width: "75%" }}
                  />
                  <span className="relative z-10 text-[9px] font-black uppercase text-white drop-shadow-xs flex items-center gap-1">
                    <span>🔥</span>
                    <span>ĐÃ BÁN {soldCount}</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FlashSaleSection;

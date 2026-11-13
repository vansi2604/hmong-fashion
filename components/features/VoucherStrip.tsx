"use client";

import { useState } from "react";
import { MOCK_VOUCHERS } from "@/lib/mock-data";
import { formatVND } from "@/lib/utils";

export function VoucherStrip() {
  const [claimedCodes, setClaimedCodes] = useState<string[]>([]);

  const handleClaim = (code: string) => {
    if (!claimedCodes.includes(code)) {
      setClaimedCodes((prev) => [...prev, code]);
    }
  };

  return (
    <section id="vouchers" className="py-6 bg-stone-100/60 border-b border-stone-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
            <span>🏷️</span> KHO MÃ GIẢM GIÁ & MIỄN PHÍ VẬN CHUYỂN
          </h2>
          <span className="text-xs text-stone-500">Thu thập mã trước khi mua</span>
        </div>

        {/* Voucher Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MOCK_VOUCHERS.map((voucher) => {
            const isClaimed = claimedCodes.includes(voucher.code);

            return (
              <div
                key={voucher.id}
                className="relative bg-white border border-amber-300/80 rounded-xl p-3 flex items-center justify-between shadow-xs overflow-hidden"
              >
                {/* Left ticket decoration */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-stone-100 rounded-full border-r border-amber-300" />
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-stone-100 rounded-full border-l border-amber-300" />

                <div className="pl-2">
                  <span className="text-xs font-bold text-rose-600 block">
                    {voucher.discountText}
                  </span>
                  <span className="text-[11px] text-stone-500 block">
                    Đơn tối thiểu {formatVND(voucher.minSpend)}
                  </span>
                  <span className="text-[10px] text-amber-800 font-medium block mt-0.5">
                    {voucher.expiry}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleClaim(voucher.code)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
                    isClaimed
                      ? "bg-stone-200 text-stone-500 cursor-default"
                      : "bg-amber-600 hover:bg-amber-500 text-white shadow-xs"
                  }`}
                >
                  {isClaimed ? "Đã Lưu" : "Lưu Mã"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default VoucherStrip;

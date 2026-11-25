"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface BrandLogoProps {
  /** Kích thước biểu tượng logo */
  size?: "sm" | "md" | "lg" | "xl";
  /** Hiển thị chữ bên cạnh logo hay chỉ lấy icon */
  showText?: boolean;
  /** Biến thể văn bản: storefront (bán lẻ), admin (quản trị), auth (đăng nhập/đăng ký), footer (chân trang) */
  variant?: "storefront" | "admin" | "auth" | "footer";
  /** Đường dẫn khi click, mặc định về "/" hoặc "/dashboard_control" tuỳ biến thể */
  href?: string | null;
  /** Class tùy biến ngoài */
  className?: string;
  /** Ưu tiên tải ảnh ngay lập tức (LCP) */
  priority?: boolean;
}

const SIZE_MAP = {
  sm: {
    container: "w-8 h-8 rounded-lg",
    pixels: 32,
    textTitle: "text-base",
    textSub: "text-[8px]",
  },
  md: {
    container: "w-10 h-10 sm:w-11 sm:h-11 rounded-xl",
    pixels: 44,
    textTitle: "text-xl sm:text-2xl",
    textSub: "text-[9px]",
  },
  lg: {
    container: "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl",
    pixels: 56,
    textTitle: "text-2xl sm:text-3xl",
    textSub: "text-[10px]",
  },
  xl: {
    container: "w-16 h-16 sm:w-20 sm:h-20 rounded-3xl",
    pixels: 80,
    textTitle: "text-3xl sm:text-4xl",
    textSub: "text-xs",
  },
};

export function BrandLogo({
  size = "md",
  showText = true,
  variant = "storefront",
  href = variant === "admin" ? "/dashboard_control" : "/",
  className = "",
  priority = true,
}: BrandLogoProps) {
  const currentSize = SIZE_MAP[size] || SIZE_MAP.md;

  const logoImage = (
    <div
      className={`relative ${currentSize.container} overflow-hidden bg-[#faf8f5] border border-amber-900/15 shadow-xs flex-shrink-0 group-hover:scale-105 group-hover:shadow-md transition-all duration-200`}
    >
      <Image
        src="/images/logo.jpg"
        alt="HMONG Fashion Logo"
        width={currentSize.pixels}
        height={currentSize.pixels}
        className="w-full h-full object-cover object-center"
        priority={priority}
      />
    </div>
  );

  const textContent = showText && (
    <div className="flex flex-col">
      {variant === "admin" ? (
        <>
          <span className="font-serif text-sm sm:text-base font-black tracking-wider text-white uppercase leading-none">
            HMONG<span className="text-amber-400">.CONTROL</span>
          </span>
          <span className="text-[9px] tracking-widest text-stone-400 uppercase font-semibold mt-0.5">
            Bảng Điều Khiển Quản Trị
          </span>
        </>
      ) : variant === "auth" ? (
        <>
          <span className={`font-serif ${currentSize.textTitle} font-black tracking-wider text-stone-900 uppercase leading-none`}>
            HMONG<span className="text-amber-700">.MALL</span>
          </span>
        </>
      ) : variant === "footer" ? (
        <>
          <span className="font-serif text-2xl font-extrabold tracking-widest text-white uppercase leading-none">
            H M O N G
          </span>
          <span className="text-[10px] tracking-[0.25em] text-amber-500 uppercase font-sans font-semibold mt-1">
            Fashion & Heritage
          </span>
        </>
      ) : (
        <>
          <span
            className={`font-serif ${currentSize.textTitle} font-black tracking-wider text-stone-900 group-hover:text-amber-800 transition-colors uppercase leading-none`}
          >
            HMONG <span className="text-amber-700">SHOP</span>
          </span>
          <span
            className={`${currentSize.textSub} tracking-widest text-stone-500 uppercase font-semibold mt-0.5`}
          >
            Where Fashion Meets Heritage
          </span>
        </>
      )}
    </div>
  );

  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 flex-shrink-0 ${className}`}>
      {logoImage}
      {textContent}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group focus:outline-none inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}

export default BrandLogo;

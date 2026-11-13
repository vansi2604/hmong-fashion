"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export function MobileBottomBar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const items = [
    { label: "Trang Chủ", icon: "🏠", href: "/" },
    { label: "Sản Phẩm", icon: "📂", href: "/products" },
    { label: "May Đo", icon: "✂️", href: "/tailors" },
    { label: "Thuê Đồ", icon: "👘", href: "/rentals" },
    {
      label: isAuthenticated ? "Tài Khoản" : "Đăng Nhập",
      icon: isAuthenticated ? "👤" : "🔑",
      href: isAuthenticated ? "/profile" : "/login",
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200 py-2 px-3 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center relative text-center py-1 px-2 ${
                isActive ? "text-amber-800 font-bold" : "text-stone-500"
              }`}
            >
              <span className="text-xl relative">{item.icon}</span>
              <span className="text-[10px] mt-0.5 leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomBar;

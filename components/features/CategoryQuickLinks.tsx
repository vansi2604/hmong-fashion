import Link from "next/link";
import type { Category } from "@/types/product";

const QUICK_CATEGORIES: Category[] = [
  {
    id: "ao-khoac",
    name: "Áo Khoác Thổ Cẩm",
    icon: "🧥",
    imageUrl: "",
    itemCount: 128,
    isHot: true,
  },
  {
    id: "vay-dam",
    name: "Váy Đầm Cách Tân",
    icon: "👗",
    imageUrl: "",
    itemCount: 94,
    isHot: true,
  },
  {
    id: "ao-so-mi",
    name: "Áo Sơ Mi Linen",
    icon: "👔",
    imageUrl: "",
    itemCount: 65,
  },
  {
    id: "phu-kien",
    name: "Bạc & Khăn Choàng",
    icon: "💍",
    imageUrl: "",
    itemCount: 182,
    isHot: true,
  },
  {
    id: "tui-vi",
    name: "Túi Tote & Ví Thêu",
    icon: "👜",
    imageUrl: "",
    itemCount: 47,
  },
  {
    id: "flash-sale",
    name: "Flash Sale Sốc",
    icon: "⚡",
    imageUrl: "",
    itemCount: 20,
    isHot: true,
  },
  {
    id: "set-truyen-thong",
    name: "Set Cưới Truyền Thống",
    icon: "👘",
    imageUrl: "",
    itemCount: 36,
  },
  {
    id: "thu-cong",
    name: "Họa Tiết Sáp Ong",
    icon: "🎨",
    imageUrl: "",
    itemCount: 52,
  },
];

export function CategoryQuickLinks() {
  return (
    <section className="py-4 bg-white border-y border-stone-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-100">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
            <span>🏷️</span> DANH MỤC NỔI BẬT HÔM NAY
          </h2>
          <Link href="/products" className="text-xs text-amber-800 hover:text-amber-950 font-medium">
            Xem tất cả danh mục →
          </Link>
        </div>

        {/* 8 Circular category icons */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
          {QUICK_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="group flex flex-col items-center text-center p-2 rounded-xl hover:bg-stone-50 transition-colors"
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 group-hover:bg-amber-100 border border-amber-200 flex items-center justify-center text-2xl sm:text-3xl shadow-xs transition-transform group-hover:scale-105">
                {cat.icon}
                {cat.isHot && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase shadow-xs">
                    HOT
                  </span>
                )}
              </div>
              <span className="mt-2 text-xs font-medium text-stone-800 group-hover:text-amber-900 line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[10px] text-stone-400">
                {cat.itemCount}+ mẫu
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
export default CategoryQuickLinks;

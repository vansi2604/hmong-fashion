import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { formatVND } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Giỏ Hàng | HMONG Fashion",
  description: "Xem lại danh sách sản phẩm trang phục Hmong của bạn.",
};

export default function CartPage() {
  const cartItems = [
    {
      id: "hm-01",
      slug: "ao-khoac-bomber-indigo-batik",
      name: "Áo Khoác Bomber Chàm Sáp Ong",
      size: "L",
      price: 1850000,
      quantity: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "hm-04",
      slug: "khan-batik-nhuom-cham-tu-nhien",
      name: "Khăn Choàng Batik Chàm Núi Rừng",
      size: "Freesize",
      price: 620000,
      quantity: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <main className="min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-sans font-black text-stone-900 mb-8">
          Giỏ Hàng Của Bạn (2 sản phẩm)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-white rounded-2xl border border-stone-200/80 shadow-sm"
              >
                <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-stone-900 text-sm sm:text-base truncate">
                    <Link href={`/products/${item.slug}`} className="hover:text-amber-800">
                      {item.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">Size: {item.size}</p>
                  <p className="text-sm font-bold text-stone-900 mt-2">
                    {formatVND(item.price)}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 text-xs"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-semibold text-stone-800">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 text-xs"
                  >
                    +
                  </button>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  aria-label="Xóa sản phẩm"
                  className="text-stone-400 hover:text-rose-600 p-2 cursor-pointer transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}

            <div className="pt-4 flex justify-between items-center">
              <Link href="/products" className="text-sm text-stone-600 hover:text-stone-900 underline">
                ← Tiếp tục khám phá sản phẩm
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-sm space-y-4">
              <h2 className="text-lg font-serif font-bold text-stone-900 border-b border-stone-100 pb-3">
                Tóm Tắt Đơn Hàng
              </h2>

              <div className="space-y-2 text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-stone-900">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="text-emerald-700 font-medium">Miễn phí toàn quốc</span>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-4 flex justify-between items-baseline">
                <span className="text-base font-bold text-stone-900">Tổng thanh toán</span>
                <span className="text-xl font-bold text-amber-800">{formatVND(subtotal)}</span>
              </div>

              <Button size="lg" className="w-full bg-stone-900 hover:bg-stone-800 text-white mt-4">
                Tiến Hành Đặt Hàng
              </Button>

              <p className="text-[11px] text-stone-400 text-center leading-normal pt-2">
                Bảo đảm thanh toán an toàn. Bạn sẽ nhận được cuộc gọi xác nhận size và thời gian giao từ nghệ nhân.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

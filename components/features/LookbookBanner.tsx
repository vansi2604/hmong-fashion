import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function LookbookBanner() {
  return (
    <section id="lookbook" className="py-16 sm:py-24 bg-stone-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Visual Showcase */}
          <div className="lg:col-span-7 relative">
            <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-2xl relative">
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80"
                alt="Lookbook HMONG Fashion 2026"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-stone-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                  Sa Pa Runway 2026
                </span>
                <p className="text-lg font-sans font-bold text-white mt-1">
                  &ldquo;Thời trang không chỉ là áo quần, đó là danh tính và niềm tự hào dân tộc.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-5 space-y-6 lg:pl-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Dịch Vụ Độc Quyền
            </span>
            <h2 className="text-3xl sm:text-4xl font-sans font-black text-stone-100 leading-tight">
              May Đo Cá Nhân Hóa & Đặt Hàng Riêng
            </h2>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              Bạn có thể lựa chọn họa tiết sáp ong theo ý nghĩa riêng biệt (bình an, sung túc, sum vầy) và đặt may đo theo số đo chính xác của mình cùng các nghệ nhân bản Tả Van và Sa Pa.
            </p>

            <ul className="space-y-3 text-sm text-stone-300">
              <li className="flex items-center gap-2">
                <span className="text-amber-400">✔</span> Tư vấn họa tiết và màu chàm thủ công riêng
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400">✔</span> May đo theo số đo cơ thể chuẩn xác
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400">✔</span> Chứng nhận sản phẩm thủ công từ nghệ nhân
              </li>
            </ul>

            <div className="pt-2">
              <Link href="/products">
                <Button className="bg-amber-600 hover:bg-amber-500 text-white font-semibold">
                  Xem Toàn Bộ Bộ Sưu Tập →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default LookbookBanner;

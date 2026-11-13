import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-white py-24 sm:py-32 lg:py-40">
      {/* Background with gradient and subtle texture */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-r from-stone-950 via-stone-950/80 to-transparent" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-8">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            BST Đương Đại 2026
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-stone-100 leading-[1.15]">
            Bản Sắc Hmong <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-amber-400 to-amber-100">
              Trong Nhịp Thở Đương Đại
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-xl">
            Sự kết hợp tinh tế giữa nghệ thuật vẽ sáp ong Batik, màu chàm tự nhiên vùng cao Tây Bắc và ngôn ngữ thời trang ứng dụng tối giản, sang trọng.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/products">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-500 text-white font-semibold">
                Khám Phá Sản Phẩm
              </Button>
            </Link>
            <Link href="#craft-stories">
              <Button
                variant="outline"
                size="lg"
                className="border-stone-500 text-stone-200 hover:bg-stone-800 hover:text-white"
              >
                Nghệ Thuật Thủ Công
              </Button>
            </Link>
          </div>

          {/* Highlights */}
          <div className="pt-8 border-t border-stone-800/80 grid grid-cols-3 gap-4 text-left">
            <div>
              <p className="text-2xl font-serif font-bold text-amber-400">100%</p>
              <p className="text-xs text-stone-400 mt-0.5">Sợi lanh dệt tay</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-amber-400">14-20</p>
              <p className="text-xs text-stone-400 mt-0.5">Lần nhúng chàm</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-amber-400">Độc Bản</p>
              <p className="text-xs text-stone-400 mt-0.5">Họa tiết vẽ sáp ong</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default HeroBanner;

import Image from "next/image";
import Link from "next/link";

export function HeroMarketplace() {
  const serviceGuarantees = [
    { icon: "🚚", title: "Miễn Phí Vận Chuyển", desc: "Đơn từ 300.000₫" },
    { icon: "🛡️", title: "Đổi Trả 7 Ngày", desc: "Miễn phí nếu lỗi sản phẩm" },
    { icon: "✦", title: "100% Vải Lanh Dệt Tay", desc: "Nhuộm chàm tự nhiên" },
    { icon: "🏷️", title: "Voucher Độc Quyền", desc: "Giảm đến 100K cho thành viên" },
    { icon: "📦", title: "Giao Hàng Toàn Quốc", desc: "Kiểm tra hàng trước khi nhận" },
  ];

  return (
    <section className="bg-stone-100/70 pt-4 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Marketplace Banner Grid (Main banner + 2 right banners) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4">
          {/* Main Hero Slider / Banner (8 cols) */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden shadow-sm aspect-16/9 sm:aspect-21/9 lg:aspect-auto lg:h-[380px] bg-stone-900 group">
            <Image
              src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=1600&q=80"
              alt="Đại Hội Thời Trang Hmong 2026"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-linear-to-r from-stone-950/85 via-stone-950/50 to-transparent" />

            <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center max-w-lg space-y-3 sm:space-y-4">
              <span className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider">
                ⚡ ĐẠI HỘI SALE CHỢ PHIÊN 2026
              </span>
              <h1 className="text-2xl sm:text-4xl font-sans font-black text-white leading-tight tracking-tight">
                Thời Trang Hmong <br />
                <span className="text-amber-400">Giảm Sốc Đến 40%</span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-200 line-clamp-2">
                Bộ sưu tập áo khoác bomber chàm, váy xếp ly batik sáp ong và trang sức bạc thủ công chính hiệu Sa Pa.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/products"
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-md transition-colors"
                >
                  Mua Ngay Hôm Nay
                </Link>
                <span className="text-xs text-amber-200 font-semibold">✦ Hơn 1.200+ đơn đã đặt</span>
              </div>
            </div>
          </div>

          {/* Right Sub-banners (4 cols) */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5 sm:gap-4">
            {/* Promo 1: Voucher */}
            <Link
              href="#vouchers"
              className="relative rounded-2xl overflow-hidden shadow-sm aspect-16/7 sm:aspect-auto lg:h-[182px] bg-gradient-to-r from-amber-900 to-amber-700 p-5 flex flex-col justify-between text-white group"
            >
              <div className="relative z-10">
                <span className="bg-white/20 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  VOUCHER CHỢ PHIÊN
                </span>
                <h3 className="text-lg font-bold font-sans mt-1">Giảm Thêm 100.000₫</h3>
                <p className="text-xs text-amber-100">Áp dụng cho đơn hàng từ 1.2 Triệu</p>
              </div>
              <div className="relative z-10 flex items-center gap-1 text-xs font-bold text-amber-200 group-hover:underline">
                <span>Thu Thập Mã Ngay</span>
                <span>→</span>
              </div>
            </Link>

            {/* Promo 2: Custom Tailoring / Lookbook */}
            <Link
              href="#may-do"
              className="relative rounded-2xl overflow-hidden shadow-sm aspect-16/7 sm:aspect-auto lg:h-[182px] bg-gradient-to-r from-stone-900 to-stone-800 p-5 flex flex-col justify-between text-white group"
            >
              <div className="relative z-10">
                <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  MAY ĐO RIÊNG
                </span>
                <h3 className="text-lg font-bold font-sans mt-1">Đặt May Nghệ Nhân Sa Pa</h3>
                <p className="text-xs text-stone-300">Tùy biến họa tiết sáp ong theo yêu cầu</p>
              </div>
              <div className="relative z-10 flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:underline">
                <span>Khám Phá Dịch Vụ</span>
                <span>→</span>
              </div>
            </Link>
          </div>
        </div>

        {/* E-Commerce Trust Badges Strip (Shopee / Lazada style) */}
        <div className="mt-4 bg-white rounded-xl p-3 sm:p-4 border border-stone-200 shadow-xs grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {serviceGuarantees.map((item, index) => (
            <div key={index} className="flex items-center gap-2.5">
              <span className="text-2xl">{item.icon}</span>
              <div className="leading-tight">
                <p className="text-xs font-bold text-stone-900">{item.title}</p>
                <p className="text-[10px] text-stone-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default HeroMarketplace;

import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand & Culture Vision */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" variant="footer" />
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Chúng tôi bảo tồn và làm mới các giá trị văn hóa trang phục truyền thống của đồng bào Hmong thông qua thiết kế thời trang ứng dụng cao cấp. Mỗi sản phẩm là một câu chuyện về đất trời và con người vùng cao.
            </p>
            <div className="flex items-center space-x-3 text-stone-400 pt-2">
              <span className="text-xs bg-stone-800 px-3 py-1.5 rounded-full border border-stone-700">
                Thuê trang phục Hmong cho sự kiện
              </span>
              <span className="text-xs bg-stone-800 px-3 py-1.5 rounded-full border border-stone-700">
                May theo đo & thiết kế riêng
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Khám Phá
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Bộ Sưu Tập Mới
                </Link>
              </li>
              <li>
                <Link href="/products?category=ao-khoac" className="hover:text-white transition-colors">
                  Áo Khoác Thổ Cẩm
                </Link>
              </li>
              <li>
                <Link href="/products?category=vay-dam" className="hover:text-white transition-colors">
                  Váy & Đầm Cách Tân
                </Link>
              </li>
              <li>
                <Link href="/products?category=phu-kien" className="hover:text-white transition-colors">
                  Khăn & Trang Sức Bạc
                </Link>
              </li>
            </ul>
          </div>

          {/* Heritage & Artisan */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Văn Hóa & Thủ Công
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#craft-stories" className="hover:text-white transition-colors">
                  Kỹ Thuật Vẽ Sáp Ong
                </Link>
              </li>
              <li>
                <Link href="/#craft-stories" className="hover:text-white transition-colors">
                  Nghệ Thuật Nhuộm Chàm
                </Link>
              </li>
              <li>
                <Link href="/#craft-stories" className="hover:text-white transition-colors">
                  Gặp Gỡ Nghệ Nhân
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-white transition-colors">
                  Nhật Ký Bản Làng
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Đăng Ký Bản Tin
            </h4>
            <p className="text-xs text-stone-400 mb-3">
              Nhận thông tin về các bộ sưu tập giới hạn và câu chuyện văn hóa vùng cao.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-stone-800 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 HMONG Fashion. Bản quyền thuộc về HMONG FASHIONS</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-stone-300 transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/terms" className="hover:text-stone-300 transition-colors">
              Điều khoản dịch vụ
            </Link>
            <Link href="/contact" className="hover:text-stone-300 transition-colors">
              Liên hệ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;

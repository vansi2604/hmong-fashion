import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { formatCurrency, getStockBadge, getProductImageUrl, getCategoryLabel } from '@/utils/product.utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

/**
 * Thẻ Sản phẩm hiển thị 2 mức giá song song: Giá Mua Đứt & Giá Cho Thuê theo ngày
 * Tham chiếu Section 7.3 trong FE_SPECS_PRODUCTS.md
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const stockInfo = getStockBadge(product.stock ?? 0);
  const imageUrl = getProductImageUrl(product);

  return (
    <div
      className={`group rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-600 transition-all overflow-hidden flex flex-col ${className}`}
    >
      {/* Hình ảnh sản phẩm */}
      <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />

        {/* Badge Tồn kho */}
        <span
          className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${stockInfo.badgeClass}`}
        >
          {stockInfo.label}
        </span>

        {/* Badge Thuê nếu có */}
        {(product.rental_price_per_day ?? 0) > 0 && (
          <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-white shadow-2xs">
            Có cho thuê
          </span>
        )}
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
            {getCategoryLabel(product.category)}
          </span>
          <Link href={`/products/${product.slug || product.id}`}>
            <h3 className="font-bold text-stone-900 text-xs sm:text-sm mt-1 line-clamp-2 hover:text-amber-800 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* 2 Mức Giá Song Song: Giá Mua & Giá Thuê */}
        <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-stone-400 block font-medium">Giá mua đứt</span>
            <span className="text-xs sm:text-sm font-black text-stone-900">
              {formatCurrency(product.price)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-stone-400 block font-medium">Giá thuê</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-700">
              {formatCurrency(product.rental_price_per_day)}
              <span className="text-[9px] text-stone-400 font-normal">/ngày</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

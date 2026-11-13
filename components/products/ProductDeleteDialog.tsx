"use client";

import React, { useState } from 'react';
import { Product } from '@/types/product';
import { productService } from '@/services/product.service';
import { formatCurrency, getProductImageUrl } from '@/utils/product.utils';
import { useAuth } from '@/contexts/auth-context';

interface ProductDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: (deletedId: number | string, isHardDelete: boolean) => void;
}

export function ProductDeleteDialog({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ProductDeleteDialogProps) {
  const { user } = useAuth();
  const isAdmin = Boolean(user?.roles?.includes('ROLE_ADMIN'));

  const [deleteMode, setDeleteMode] = useState<'soft' | 'hard'>('soft');
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conflictDetail, setConflictDetail] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);
    setConflictDetail(null);

    try {
      if (deleteMode === 'hard') {
        await productService.hardDeleteProduct(product.id);
        onSuccess(product.id, true);
      } else {
        await productService.softDeleteProduct(product.id);
        onSuccess(product.id, false);
      }
      onClose();
    } catch (err: unknown) {
      const isConflict = productService.isHasActiveRentalsError(err);
      if (isConflict) {
        setConflictDetail(
          `Không thể xóa vĩnh viễn trang phục "${product.name}" vì hiện đang có hợp đồng thuê hoạt động (Đang chờ xác nhận, Đã đặt cọc hoặc Khách đang mặc). Bạn vui lòng dùng chức năng Ẩn sản phẩm thay thế!`
        );
      } else {
        const msg =
          (err as { message?: string })?.message ||
          'Có lỗi xảy ra khi thực hiện thao tác xóa sản phẩm.';
        setErrorMessage(msg);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-stone-200 space-y-4">
        {/* Header Dialog */}
        <div className="flex items-start gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
              deleteMode === 'hard'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {deleteMode === 'hard' ? '🗑️' : '👁️‍🗨️'}
          </div>
          <div>
            <h3 className="text-lg font-serif font-black text-stone-900">
              {deleteMode === 'hard'
                ? 'Xóa Vĩnh Viễn Sản Phẩm (Hard Delete)'
                : 'Xóa Mềm / Ẩn Khỏi Gian Hàng (Soft Delete)'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Chọn phương án gỡ sản phẩm theo đúng quy trình kiểm soát an toàn.
            </p>
          </div>
        </div>

        {/* Thông tin sản phẩm được chọn */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
          <div className="w-12 h-14 rounded-xl overflow-hidden bg-stone-200 border border-stone-300 flex-shrink-0">
            <img
              src={getProductImageUrl(product)}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-bold text-stone-900 text-xs block truncate">
              {product.name}
            </span>
            <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
              <span>Giá bán: <strong>{formatCurrency(product.price)}</strong></span>
              <span>•</span>
              <span className="text-emerald-700">Thuê: <strong>{formatCurrency(product.rental_price_per_day)}/ng</strong></span>
            </div>
          </div>
        </div>

        {/* Lựa chọn chế độ xóa */}
        <div className="space-y-2 text-xs">
          <label className="font-bold text-stone-700 block">Chọn hành động xử lý:</label>

          {/* Option 1: Soft Delete */}
          <div
            onClick={() => setDeleteMode('soft')}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
              deleteMode === 'soft'
                ? 'border-amber-700 bg-amber-50/50 text-stone-900 shadow-2xs'
                : 'border-stone-200 hover:border-stone-300 text-stone-600'
            }`}
          >
            <input
              type="radio"
              checked={deleteMode === 'soft'}
              onChange={() => setDeleteMode('soft')}
              className="mt-0.5 text-amber-700 focus:ring-amber-600"
            />
            <div>
              <span className="font-bold block text-stone-900">
                1. Ẩn sản phẩm (Xóa mềm - Khuyến nghị)
              </span>
              <span className="text-[11px] text-stone-500 block mt-0.5">
                Chuyển trạng thái <code>is_active = false</code>. Sản phẩm không còn xuất hiện trên gian hàng bán lẻ/cho thuê nhưng vẫn lưu toàn bộ lịch sử đơn hàng và may đo.
              </span>
            </div>
          </div>

          {/* Option 2: Hard Delete (Admin only) */}
          {isAdmin ? (
            <div
              onClick={() => setDeleteMode('hard')}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                deleteMode === 'hard'
                  ? 'border-rose-600 bg-rose-50/60 text-rose-950 shadow-2xs'
                  : 'border-stone-200 hover:border-stone-300 text-stone-600'
              }`}
            >
              <input
                type="radio"
                checked={deleteMode === 'hard'}
                onChange={() => setDeleteMode('hard')}
                className="mt-0.5 text-rose-600 focus:ring-rose-600"
              />
              <div>
                <span className="font-bold block text-rose-900 flex items-center gap-1.5">
                  <span>2. Xóa vĩnh viễn khỏi Database (Hard Delete)</span>
                  <span className="px-1.5 py-0.2 rounded-xs bg-rose-600 text-white text-[9px] font-mono">
                    ADMIN ONLY
                  </span>
                </span>
                <span className="text-[11px] text-rose-800/80 block mt-0.5">
                  Xóa sạch bản ghi sản phẩm và album ảnh khỏi máy chủ. Thao tác này <strong>không thể hoàn tác</strong>. Server sẽ chặn xóa nếu đang có khách thuê hoạt động.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-dashed border-stone-200 bg-stone-50 text-[11px] text-stone-400">
              🔒 Tùy chọn <strong>Xóa vĩnh viễn (Hard Delete)</strong> chỉ dành riêng cho tài khoản Quản trị viên (<code>ROLE_ADMIN</code>).
            </div>
          )}
        </div>

        {/* Cảnh báo mã lỗi 409 Conflict: PRODUCT_HAS_ACTIVE_RENTALS */}
        {conflictDetail && (
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <span>⚠️</span>
              <span>CẢNH BÁO XUNG ĐỘT HỢP ĐỒNG THUÊ (MÃ: PRODUCT_HAS_ACTIVE_RENTALS)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900 font-medium">
              {conflictDetail}
            </p>
            <button
              type="button"
              onClick={() => {
                setConflictDetail(null);
                setDeleteMode('soft');
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-800 text-white font-bold text-[11px] hover:bg-amber-900 transition-colors cursor-pointer"
            >
              Chuyển sang Xóa mềm (Ẩn sản phẩm) ngay
            </button>
          </div>
        )}

        {/* Lỗi chung */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs cursor-pointer transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className={`px-5 py-2 rounded-xl text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 ${
              deleteMode === 'hard'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-amber-700 hover:bg-amber-800'
            }`}
          >
            {isDeleting ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>{deleteMode === 'hard' ? 'Xác Nhận Xóa Vĩnh Viễn' : 'Xác Nhận Ẩn Sản Phẩm'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDeleteDialog;

"use client";

import React from 'react';
import { MediaFile } from '@/types/media';

interface MediaDeleteDialogProps {
  isOpen: boolean;
  file: MediaFile | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function MediaDeleteDialog({
  isOpen,
  file,
  isDeleting,
  onClose,
  onConfirm,
}: MediaDeleteDialogProps) {
  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
        {/* Header cảnh báo */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xl flex-shrink-0">
            ⚠️
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Xác nhận xóa tệp vĩnh viễn?
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Thao tác này sẽ xóa bản ghi trong cơ sở dữ liệu và xóa file vật lý trên máy chủ.
            </p>
          </div>
        </div>

        {/* Thông tin tệp sắp xóa */}
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-stone-500">Tên tệp:</span>
            <span className="font-semibold text-stone-900 truncate max-w-[200px]">
              {file.filename}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-500">Thư mục:</span>
            <span className="font-mono text-stone-700">{file.folder}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-500">Mã ID:</span>
            <span className="text-stone-700 font-mono">#{file.id}</span>
          </div>
        </div>

        {/* Lời cảnh báo nguy cơ */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
          <strong>Lưu ý quan trọng:</strong> Nếu tệp này đang được liên kết trong Sản phẩm, Mẫu may đo hoặc Banner trang chủ, việc xóa tệp có thể khiến ảnh trên website bị mất.
        </div>

        {/* Các nút hành động */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isDeleting ? 'Đang xóa...' : '🗑️ Xóa Vĩnh Viễn'}
          </button>
        </div>
      </div>
    </div>
  );
}

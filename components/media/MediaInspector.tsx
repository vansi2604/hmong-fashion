"use client";

import React, { useState, useEffect } from 'react';
import { MediaFile, MediaType, formatBytes, formatDateTime } from '@/types/media';
import { getImageUrl } from '@/lib/api-client';
import { mediaService } from '@/services/media.service';

interface MediaInspectorProps {
  file: MediaFile | null;
  onClose: () => void;
  onFileUpdated: (updatedFile: MediaFile) => void;
  onRequestDelete: (file: MediaFile) => void;
  onOpenPreview: (file: MediaFile) => void;
  className?: string;
}

export function MediaInspector({
  file,
  onClose,
  onFileUpdated,
  onRequestDelete,
  onOpenPreview,
  className = '',
}: MediaInspectorProps) {
  const [altText, setAltText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (file) {
      setAltText(file.alt_text || '');
      setUpdateMessage(null);
    }
  }, [file]);

  if (!file) {
    return (
      <aside
        className={`w-full lg:w-80 bg-white border-l border-stone-200 p-6 flex flex-col items-center justify-center text-center text-stone-400 ${className}`}
      >
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-2xl mb-3">
          📁
        </div>
        <p className="text-xs font-semibold text-stone-600">Chưa chọn tệp tin</p>
        <p className="text-[11px] text-stone-400 mt-1">
          Nhấp vào bất kỳ ảnh hoặc video nào trong thư viện để xem và chỉnh sửa thông tin chi tiết.
        </p>
      </aside>
    );
  }

  const isVideo = file.media_type === MediaType.VIDEO;
  const fullUrl = getImageUrl(file.url);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAltText = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage(null);

    try {
      const updated = await mediaService.update(file.id, { alt_text: altText });
      onFileUpdated(updated);
      setUpdateMessage('Đã lưu chú thích thành công!');
      setTimeout(() => setUpdateMessage(null), 3000);
    } catch (err: any) {
      setUpdateMessage(err.message || 'Lỗi khi cập nhật chú thích');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <aside
      className={`w-full lg:w-80 bg-white border-l border-stone-200 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto ${className}`}
    >
      <div className="space-y-5">
        {/* Header Inspector */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Chi Tiết Tệp Tin
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 text-xs"
            title="Đóng bảng chi tiết"
          >
            ✕
          </button>
        </div>

        {/* Khung Preview Lớn */}
        <div className="relative aspect-video rounded-xl bg-stone-950 overflow-hidden flex items-center justify-center group shadow-xs">
          {isVideo ? (
            <div className="text-center space-y-1">
              <span className="text-3xl">🎬</span>
              <p className="text-[10px] text-stone-300 font-mono">Video Player</p>
            </div>
          ) : (
            <img
              src={fullUrl}
              alt={file.alt_text || file.filename}
              className="w-full h-full object-contain"
            />
          )}

          <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onOpenPreview(file)}
              className="px-3 py-1.5 bg-white text-stone-900 rounded-lg text-xs font-bold shadow-md hover:bg-stone-100 transition-colors"
            >
              Phóng to 🔍
            </button>
          </div>
        </div>

        {/* Nút Sao chép liên kết nhanh */}
        <button
          type="button"
          onClick={handleCopyUrl}
          className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border ${
            copied
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-300'
          }`}
        >
          <span>{copied ? '✓ Đã sao chép vào bộ nhớ đệm' : '📋 Sao chép URL Tuyệt Đối'}</span>
        </button>

        {/* Bảng Metadata Thông số */}
        <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
          <div className="flex items-start justify-between gap-2">
            <span className="text-stone-400">Tên file:</span>
            <span className="font-semibold text-stone-900 text-right truncate max-w-[170px]" title={file.filename}>
              {file.filename}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-400">Mã ID:</span>
            <span className="font-mono text-stone-700 font-semibold">#{file.id}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-400">Thư mục:</span>
            <span className="font-mono text-amber-900 font-semibold">{file.folder}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-400">Dung lượng:</span>
            <span className="font-medium text-stone-800">{formatBytes(file.file_size)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-400">Định dạng:</span>
            <span className="uppercase text-stone-600 font-semibold font-mono text-[11px]">
              {file.file_type}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-400">Ngày tạo:</span>
            <span className="text-stone-600">{formatDateTime(file.created_at)}</span>
          </div>
        </div>

        {/* Form Chỉnh Sửa Alt Text */}
        <form onSubmit={handleSaveAltText} className="space-y-2 pt-3 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <label htmlFor="alt-text-input" className="text-xs font-bold text-stone-800">
              Chú thích ảnh (Alt text / SEO)
            </label>
          </div>
          <textarea
            id="alt-text-input"
            rows={3}
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Mô tả hoa văn thổ cẩm, chất vải, phục vụ tìm kiếm Google..."
            className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-700 focus:bg-white text-stone-900 resize-none transition-colors"
          />

          {updateMessage && (
            <p
              className={`text-[11px] font-medium ${
                updateMessage.includes('thành công') ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {updateMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isUpdating || altText === (file.alt_text || '')}
            className="w-full py-2 bg-stone-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Đang lưu...' : 'Lưu Thay Đổi Chú Thích'}
          </button>
        </form>
      </div>

      {/* Vùng Nguy Hiểm: Xóa tệp vĩnh viễn */}
      <div className="pt-6 border-t border-stone-100 mt-6">
        <button
          type="button"
          onClick={() => onRequestDelete(file)}
          className="w-full py-2 px-3 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
        >
          <span>🗑️ Xóa Tệp Vĩnh Viễn</span>
        </button>
      </div>
    </aside>
  );
}

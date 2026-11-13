"use client";

import React, { useState } from 'react';
import { MediaFile, MediaType, formatBytes } from '@/types/media';
import { getImageUrl } from '@/lib/api-client';

interface MediaCardProps {
  file: MediaFile;
  isSelected: boolean;
  onSelect: (file: MediaFile, multi: boolean) => void;
  onOpenPreview?: (file: MediaFile) => void;
  onQuickCopy?: (file: MediaFile) => void;
}

export function MediaCard({
  file,
  isSelected,
  onSelect,
  onOpenPreview,
  onQuickCopy,
}: MediaCardProps) {
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isVideo = file.media_type === MediaType.VIDEO || file.file_type.startsWith('video');

  const fullUrl = getImageUrl(file.url);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onQuickCopy) onQuickCopy(file);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(file, true);
  };

  return (
    <div
      onClick={(e) => {
        // Nếu giữ Shift hoặc Ctrl thì multi-select, ngược lại chọn đơn
        onSelect(file, e.shiftKey || e.metaKey || e.ctrlKey);
      }}
      className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer select-none bg-white ${
        isSelected
          ? 'border-amber-600 ring-2 ring-amber-600/30 shadow-md bg-amber-50/20'
          : 'border-stone-200 hover:border-amber-500 hover:shadow-md'
      }`}
    >
      {/* Khung Thumbnail */}
      <div className="relative aspect-square w-full bg-stone-100 overflow-hidden flex items-center justify-center">
        {/* Nền checkered pattern nhẹ để hiển thị rõ ảnh transparent */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
          }}
        />

        {isVideo ? (
          <div className="relative z-10 flex flex-col items-center justify-center text-stone-600 group-hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-full bg-stone-900/80 text-white flex items-center justify-center text-xl shadow-md">
              ▶
            </div>
            <span className="text-[10px] font-bold text-stone-500 uppercase mt-1">Video</span>
          </div>
        ) : (
          <img
            src={fullUrl}
            alt={file.alt_text || file.filename}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`relative z-10 w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Checkbox chọn ở góc trên bên trái */}
        <div
          onClick={handleCheckboxClick}
          className={`absolute top-2.5 left-2.5 z-20 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-amber-700 text-white shadow-xs'
              : 'bg-white/80 backdrop-blur-xs text-transparent group-hover:text-stone-300 border border-stone-300 hover:border-amber-700'
          }`}
        >
          <span className="text-xs font-black">{isSelected ? '✓' : '•'}</span>
        </div>

        {/* Badge Loại file & Dung lượng ở góc trên bên phải */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1">
          <span className="px-1.5 py-0.5 rounded-md bg-stone-900/70 text-white text-[10px] font-semibold backdrop-blur-xs">
            {formatBytes(file.file_size)}
          </span>
        </div>

        {/* Hover Action Bar: Copy link & Xem trước phóng to */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-2 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={handleCopy}
            className="px-2 py-1 bg-white/90 hover:bg-white text-stone-800 rounded-md text-[11px] font-bold shadow-xs transition-colors"
            title="Sao chép URL"
          >
            {copied ? '✓ Đã chép' : '📋 Link'}
          </button>

          {onOpenPreview && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenPreview(file);
              }}
              className="px-2 py-1 bg-stone-800/90 hover:bg-stone-800 text-white rounded-md text-[11px] font-bold shadow-xs transition-colors"
              title="Phóng to xem chi tiết"
            >
              🔍 Xem
            </button>
          )}
        </div>
      </div>

      {/* Thông tin Text bên dưới */}
      <div className="p-2.5 space-y-1">
        <p className="text-xs font-semibold text-stone-900 truncate" title={file.filename}>
          {file.filename}
        </p>
        <div className="flex items-center justify-between text-[11px] text-stone-400">
          <span className="truncate max-w-[130px]" title={file.folder}>
            {file.folder}
          </span>
          <span className="uppercase text-[9px] font-bold text-stone-500 bg-stone-100 px-1 py-0.5 rounded-xs">
            {file.file_type.split('/')[1] || file.media_type}
          </span>
        </div>
      </div>
    </div>
  );
}

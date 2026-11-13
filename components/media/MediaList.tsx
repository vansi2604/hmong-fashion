"use client";

import React, { useState } from 'react';
import { MediaFile, MediaType, formatBytes, formatDateTime } from '@/types/media';
import { getImageUrl } from '@/lib/api-client';

interface MediaListProps {
  files: MediaFile[];
  isLoading: boolean;
  selectedIds: number[];
  onSelect: (file: MediaFile, multi: boolean) => void;
  onOpenPreview?: (file: MediaFile) => void;
  onQuickCopy?: (file: MediaFile) => void;
}

export function MediaList({
  files,
  isLoading,
  selectedIds,
  onSelect,
  onOpenPreview,
  onQuickCopy,
}: MediaListProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-14 bg-stone-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center text-3xl mb-3">
          📭
        </div>
        <p className="text-sm font-bold text-stone-800">Không có tệp tin nào</p>
      </div>
    );
  }

  const handleCopy = (file: MediaFile, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(getImageUrl(file.url));
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
    if (onQuickCopy) onQuickCopy(file);
  };

  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full text-left text-xs text-stone-700 border-collapse">
        <thead>
          <tr className="border-b border-stone-200 text-stone-400 font-semibold uppercase text-[10px]">
            <th className="py-2.5 px-3 w-8">#</th>
            <th className="py-2.5 px-3">Tệp tin</th>
            <th className="py-2.5 px-3">Thư mục</th>
            <th className="py-2.5 px-3">Định dạng</th>
            <th className="py-2.5 px-3">Dung lượng</th>
            <th className="py-2.5 px-3">Chú thích Alt SEO</th>
            <th className="py-2.5 px-3">Ngày tải lên</th>
            <th className="py-2.5 px-3 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {files.map((file) => {
            const isSelected = selectedIds.includes(file.id);
            const isVideo = file.media_type === MediaType.VIDEO;
            const fullUrl = getImageUrl(file.url);

            return (
              <tr
                key={file.id}
                onClick={(e) => onSelect(file, e.shiftKey || e.metaKey || e.ctrlKey)}
                className={`hover:bg-amber-50/40 cursor-pointer transition-colors ${
                  isSelected ? 'bg-amber-100/50 font-medium' : ''
                }`}
              >
                {/* Checkbox */}
                <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(file, true)}
                    className="rounded-md border-stone-300 text-amber-700 focus:ring-amber-600"
                  />
                </td>

                {/* Thumbnail + Tên file */}
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {isVideo ? (
                        <span className="text-sm">🎬</span>
                      ) : (
                        <img
                          src={fullUrl}
                          alt={file.filename}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-stone-900 truncate max-w-xs" title={file.filename}>
                        {file.filename}
                      </p>
                      <span className="text-[10px] text-stone-400">ID: #{file.id}</span>
                    </div>
                  </div>
                </td>

                {/* Thư mục */}
                <td className="py-2.5 px-3 text-stone-600 font-mono text-[11px]">
                  {file.folder}
                </td>

                {/* Định dạng */}
                <td className="py-2.5 px-3 uppercase text-[10px] text-stone-500">
                  <span className="bg-stone-100 px-1.5 py-0.5 rounded-md font-semibold">
                    {file.file_type.split('/')[1] || file.media_type}
                  </span>
                </td>

                {/* Dung lượng */}
                <td className="py-2.5 px-3 font-medium text-stone-600">
                  {formatBytes(file.file_size)}
                </td>

                {/* Alt Text */}
                <td className="py-2.5 px-3 max-w-xs truncate text-stone-500 italic">
                  {file.alt_text || <span className="text-stone-300">Chưa thiết lập</span>}
                </td>

                {/* Ngày tạo */}
                <td className="py-2.5 px-3 text-stone-500 text-[11px]">
                  {formatDateTime(file.created_at)}
                </td>

                {/* Thao tác */}
                <td className="py-2.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleCopy(file, e)}
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-[11px] font-medium"
                      title="Sao chép link tuyệt đối"
                    >
                      {copiedId === file.id ? '✓ Đã chép' : '📋 Link'}
                    </button>
                    {onOpenPreview && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenPreview(file);
                        }}
                        className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-md text-[11px] font-medium"
                        title="Xem chi tiết"
                      >
                        🔍 Xem
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

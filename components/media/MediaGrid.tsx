"use client";

import React from 'react';
import { MediaFile } from '@/types/media';
import { MediaCard } from './MediaCard';

interface MediaGridProps {
  files: MediaFile[];
  isLoading: boolean;
  selectedIds: number[];
  onSelect: (file: MediaFile, multi: boolean) => void;
  onOpenPreview?: (file: MediaFile) => void;
  onQuickCopy?: (file: MediaFile) => void;
}

export function MediaGrid({
  files,
  isLoading,
  selectedIds,
  onSelect,
  onOpenPreview,
  onQuickCopy,
}: MediaGridProps) {
  // Trạng thái đang tải (Loading Skeleton)
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 p-4">
        {Array.from({ length: 15 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-stone-200 bg-white overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-stone-200" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-stone-200 rounded-md w-3/4" />
              <div className="h-2.5 bg-stone-100 rounded-md w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Trạng thái không có dữ liệu (Empty State)
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center text-3xl mb-3">
          📭
        </div>
        <h3 className="text-sm sm:text-base font-bold text-stone-800">
          Chưa có tệp tin nào trong danh mục này
        </h3>
        <p className="text-xs text-stone-500 mt-1 max-w-sm">
          Bạn có thể kéo thả ảnh hoặc video mới vào khu vực tải lên phía trên để bắt đầu thêm tài sản số.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 p-4">
      {files.map((file) => (
        <MediaCard
          key={file.id}
          file={file}
          isSelected={selectedIds.includes(file.id)}
          onSelect={onSelect}
          onOpenPreview={onOpenPreview}
          onQuickCopy={onQuickCopy}
        />
      ))}
    </div>
  );
}

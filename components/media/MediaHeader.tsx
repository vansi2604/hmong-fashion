"use client";

import React from 'react';
import { MediaType } from '@/types/media';

interface MediaHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedMediaType: MediaType | 'ALL';
  onMediaTypeChange: (type: MediaType | 'ALL') => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  isDropzoneOpen: boolean;
  onToggleDropzone: () => void;
  onRefresh: () => void;
  selectedCount: number;
  onClearSelection?: () => void;
}

export function MediaHeader({
  searchQuery,
  onSearchChange,
  selectedMediaType,
  onMediaTypeChange,
  viewMode,
  onViewModeChange,
  isDropzoneOpen,
  onToggleDropzone,
  onRefresh,
  selectedCount,
  onClearSelection,
}: MediaHeaderProps) {
  return (
    <div className="bg-white border-b border-stone-200 p-4 space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Thanh tìm kiếm */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên tệp hoặc chú thích alt_text..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-700 focus:bg-white transition-colors text-stone-900 placeholder-stone-400"
          />
          <span className="absolute left-3 top-2.5 text-stone-400 text-sm">🔍</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Các nút hành động bên phải */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
          {/* Nút Refresh */}
          <button
            type="button"
            onClick={onRefresh}
            className="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs transition-colors"
            title="Tải lại danh sách"
          >
            🔄
          </button>

          {/* Toggle Chế độ xem Grid / List */}
          <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Chế độ Lưới"
            >
              ⊞ Lưới
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Chế độ Danh sách"
            >
              ☰ Bảng
            </button>
          </div>

          {/* Nút bật/tắt vùng Upload */}
          <button
            type="button"
            onClick={onToggleDropzone}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs ${
              isDropzoneOpen
                ? 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                : 'bg-stone-900 text-white hover:bg-amber-800'
            }`}
          >
            <span>{isDropzoneOpen ? '✕ Đóng Tải Lên' : '☁️ Tải Lên Tệp'}</span>
          </button>
        </div>
      </div>

      {/* Thanh lọc phụ: Lọc theo loại tệp (Tất cả / Ảnh / Video) & Đếm số lượng chọn */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
        <div className="flex items-center gap-1.5">
          <span className="text-stone-400 font-medium mr-1">Bộ lọc:</span>
          {(['ALL', MediaType.IMAGE, MediaType.VIDEO] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onMediaTypeChange(type)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedMediaType === type
                  ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {type === 'ALL' ? 'Tất cả loại' : type === MediaType.IMAGE ? '📸 Hình ảnh' : '🎬 Video'}
            </button>
          ))}
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-amber-900 font-medium">
            <span>Đã chọn {selectedCount} tệp</span>
            {onClearSelection && (
              <button
                type="button"
                onClick={onClearSelection}
                className="text-amber-700 hover:underline text-[11px]"
              >
                Bỏ chọn
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

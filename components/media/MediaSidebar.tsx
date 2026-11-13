"use client";

import React from 'react';
import { MediaFolder, MEDIA_FOLDERS_CONFIG } from '@/types/media';

interface MediaSidebarProps {
  selectedFolder: string | null;
  onSelectFolder: (folder: string | null) => void;
  className?: string;
}

export function MediaSidebar({
  selectedFolder,
  onSelectFolder,
  className = '',
}: MediaSidebarProps) {
  const productFolders = MEDIA_FOLDERS_CONFIG.filter((f) => f.group === 'products');
  const tailorFolders = MEDIA_FOLDERS_CONFIG.filter((f) => f.group === 'tailors');
  const marketingFolders = MEDIA_FOLDERS_CONFIG.filter((f) => f.group === 'marketing');

  return (
    <aside
      className={`w-full md:w-64 bg-white border-r border-stone-200 p-4 flex flex-col justify-between flex-shrink-0 ${className}`}
    >
      <div className="space-y-6">
        {/* Tiêu đề Phân hệ */}
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-lg bg-amber-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            📁
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 leading-none">Thư Viện Media</h2>
            <span className="text-[10px] text-stone-500 font-medium">Hệ thống tệp tập trung</span>
          </div>
        </div>

        {/* Nút xem Tất cả tệp */}
        <div>
          <button
            type="button"
            onClick={() => onSelectFolder(null)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              selectedFolder === null
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🗂️</span>
              <span>Tất cả tệp tin</span>
            </div>
          </button>
        </div>

        {/* Nhóm 1: Sản phẩm & Hoa văn Thổ Cẩm */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            Sản phẩm & Vải Thổ Cẩm
          </span>
          <div className="space-y-0.5 pt-1">
            {productFolders.map((folder) => {
              const isActive = selectedFolder === folder.key;
              return (
                <button
                  key={folder.key}
                  type="button"
                  onClick={() => onSelectFolder(folder.key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-amber-100/70 text-amber-950 font-bold border border-amber-200'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base">{folder.icon}</span>
                    <span className="truncate">{folder.label}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-500">
                    {folder.maxSizeMB}MB
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nhóm 2: May đo & Khách hàng */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            Khách Hàng & May Đo
          </span>
          <div className="space-y-0.5 pt-1">
            {tailorFolders.map((folder) => {
              const isActive = selectedFolder === folder.key;
              return (
                <button
                  key={folder.key}
                  type="button"
                  onClick={() => onSelectFolder(folder.key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-amber-100/70 text-amber-950 font-bold border border-amber-200'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base">{folder.icon}</span>
                    <span className="truncate">{folder.label}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-500">
                    {folder.maxSizeMB}MB
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nhóm 3: Marketing & Truyền thông */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            Chiến Dịch & Truyền Thông
          </span>
          <div className="space-y-0.5 pt-1">
            {marketingFolders.map((folder) => {
              const isActive = selectedFolder === folder.key;
              return (
                <button
                  key={folder.key}
                  type="button"
                  onClick={() => onSelectFolder(folder.key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-amber-100/70 text-amber-950 font-bold border border-amber-200'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base">{folder.icon}</span>
                    <span className="truncate">{folder.label}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-500">
                    {folder.maxSizeMB}MB
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Thông tin lưu trữ đĩa tĩnh ảo (Storage Quota Indicator) */}
      <div className="pt-6 border-t border-stone-200 mt-6 space-y-2">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>Dung lượng máy chủ</span>
          <span className="font-semibold text-stone-700">Ổ cứng cục bộ</span>
        </div>
        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
          <div className="bg-amber-700 h-full w-2/5 rounded-full" />
        </div>
        <p className="text-[11px] text-stone-400">
          Lưu trữ tại <code className="text-stone-600">/uploads/...</code>
        </p>
      </div>
    </aside>
  );
}

"use client";

import React, { useState } from 'react';
import { MediaFile, MediaFolder } from '@/types/media';
import { MediaManager } from './MediaManager';
import { MediaDropzone } from './MediaDropzone';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (files: MediaFile[]) => void;
  multiple?: boolean;
  targetFolder?: MediaFolder | string;
  title?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
  targetFolder = MediaFolder.PRODUCTS_ORIGINALS,
  title = 'Chọn tệp Media từ thư viện',
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelect(selectedFiles);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-base font-bold text-stone-900">{title}</h2>
            <p className="text-xs text-stone-500">
              {multiple ? 'Hỗ trợ chọn nhiều tệp tin' : 'Chế độ chọn 1 tệp tin'} • Thư mục mục tiêu: {targetFolder}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 bg-stone-200 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'library'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              📁 Thư viện có sẵn
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'upload'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ☁️ Tải lên mới
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Nội dung Modal theo Tab */}
        <div className="flex-1 overflow-hidden p-4">
          {activeTab === 'library' ? (
            <MediaManager
              initialFolder={targetFolder}
              isPickerMode={true}
              multipleSelection={multiple}
              onSelectFiles={(files) => setSelectedFiles(files)}
            />
          ) : (
            <div className="max-w-2xl mx-auto py-12">
              <MediaDropzone
                currentFolder={targetFolder}
                onUploadSuccess={(uploaded) => {
                  setSelectedFiles(uploaded);
                  setActiveTab('library');
                }}
              />
            </div>
          )}
        </div>

        {/* Footer Modal: Hành động */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            {selectedFiles.length > 0 ? (
              <span className="font-semibold text-amber-900">
                Đã chọn {selectedFiles.length} tệp tin
              </span>
            ) : (
              <span>Vui lòng click chọn ít nhất 1 tệp tin trong danh sách</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              disabled={selectedFiles.length === 0}
              onClick={handleConfirm}
              className="px-5 py-2 text-xs font-bold bg-stone-900 hover:bg-amber-800 text-white rounded-xl shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Xác Nhận Chọn {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

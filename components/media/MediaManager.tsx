"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MediaFile,
  MediaFolder,
  MediaType,
  MediaListParams,
} from '@/types/media';
import { mediaService } from '@/services/media.service';
import { MediaSidebar } from './MediaSidebar';
import { MediaHeader } from './MediaHeader';
import { MediaDropzone } from './MediaDropzone';
import { MediaGrid } from './MediaGrid';
import { MediaList } from './MediaList';
import { MediaPagination } from './MediaPagination';
import { MediaInspector } from './MediaInspector';
import { MediaDeleteDialog } from './MediaDeleteDialog';
import { MediaPreviewModal } from './MediaPreviewModal';

interface MediaManagerProps {
  initialFolder?: string | null;
  onSelectFiles?: (files: MediaFile[]) => void;
  isPickerMode?: boolean;
  multipleSelection?: boolean;
}

export function MediaManager({
  initialFolder = null,
  onSelectFiles,
  isPickerMode = false,
  multipleSelection = true,
}: MediaManagerProps) {
  // 1. Quản lý Bộ lọc & Phân trang
  const [selectedFolder, setSelectedFolder] = useState<string | null>(initialFolder);
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(50);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDropzoneOpen, setIsDropzoneOpen] = useState(false);

  // 2. Dữ liệu Media & Trạng thái tải
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 3. Selection & Inspector State
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeFile, setActiveFile] = useState<MediaFile | null>(null);

  // 4. Modals State
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const [fileToDelete, setFileToDelete] = useState<MediaFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch dữ liệu từ API Backend
  const fetchMediaList = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const params: MediaListParams = {
      folder: selectedFolder || undefined,
      media_type: selectedMediaType === 'ALL' ? undefined : selectedMediaType,
      skip,
      limit,
    };

    try {
      const data = await mediaService.getList(params);
      setFiles(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể tải danh sách tệp tin');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFolder, selectedMediaType, skip, limit]);

  useEffect(() => {
    fetchMediaList();
  }, [fetchMediaList]);

  // Reset skip về 0 khi đổi folder hoặc loại media
  const handleSelectFolder = (folder: string | null) => {
    setSelectedFolder(folder);
    setSkip(0);
  };

  const handleMediaTypeChange = (type: MediaType | 'ALL') => {
    setSelectedMediaType(type);
    setSkip(0);
  };

  // Lọc tìm kiếm theo tên hoặc alt_text phía client (nếu có từ khóa)
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    const query = searchQuery.toLowerCase().trim();
    return files.filter(
      (f) =>
        f.filename.toLowerCase().includes(query) ||
        (f.alt_text && f.alt_text.toLowerCase().includes(query)) ||
        f.folder.toLowerCase().includes(query)
    );
  }, [files, searchQuery]);

  // Xử lý chọn tệp tin (hỗ trợ chọn đơn & chọn nhiều)
  const handleSelectFile = (file: MediaFile, isMulti: boolean) => {
    setActiveFile(file);

    if (isPickerMode && !multipleSelection) {
      setSelectedIds([file.id]);
      if (onSelectFiles) onSelectFiles([file]);
      return;
    }

    if (isMulti) {
      setSelectedIds((prev) =>
        prev.includes(file.id) ? prev.filter((id) => id !== file.id) : [...prev, file.id]
      );
    } else {
      setSelectedIds([file.id]);
    }
  };

  // Cập nhật sau khi upload tệp mới
  const handleUploadSuccess = (newFiles: MediaFile[]) => {
    setFiles((prev) => [...newFiles, ...prev]);
    if (newFiles.length > 0) {
      setActiveFile(newFiles[0]);
    }
  };

  // Cập nhật sau khi sửa alt_text
  const handleFileUpdated = (updated: MediaFile) => {
    setFiles((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    setActiveFile(updated);
  };

  // Xóa tệp vĩnh viễn
  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);

    try {
      await mediaService.delete(fileToDelete.id);
      setFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      setSelectedIds((prev) => prev.filter((id) => id !== fileToDelete.id));
      if (activeFile?.id === fileToDelete.id) {
        setActiveFile(null);
      }
      setFileToDelete(null);
    } catch (err: any) {
      alert(err.message || 'Xóa tệp thất bại');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[750px] bg-stone-100 rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      {/* 1. Sidebar Thư mục bên trái */}
      <MediaSidebar
        selectedFolder={selectedFolder}
        onSelectFolder={handleSelectFolder}
      />

      {/* 2. Vùng Canvas Trung Tâm */}
      <div className="flex-1 flex flex-col min-w-0 bg-stone-50">
        {/* Header Toolbar */}
        <MediaHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedMediaType={selectedMediaType}
          onMediaTypeChange={handleMediaTypeChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isDropzoneOpen={isDropzoneOpen}
          onToggleDropzone={() => setIsDropzoneOpen((prev) => !prev)}
          onRefresh={fetchMediaList}
          selectedCount={selectedIds.length}
          onClearSelection={() => setSelectedIds([])}
        />

        {/* Thông báo lỗi nếu có */}
        {errorMessage && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <span>⚠️ {errorMessage}</span>
            <button
              type="button"
              onClick={fetchMediaList}
              className="text-rose-900 font-bold hover:underline"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Dropzone Kéo Thả Upload (Mở ra khi bấm nút hoặc kéo file) */}
        {isDropzoneOpen && (
          <div className="p-4 border-b border-stone-200 bg-amber-50/30 animate-in slide-in-from-top-2 duration-150">
            <MediaDropzone
              currentFolder={selectedFolder || MediaFolder.PRODUCTS_ORIGINALS}
              onUploadSuccess={handleUploadSuccess}
            />
          </div>
        )}

        {/* Vùng Lưới / Bảng danh sách Tệp */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'grid' ? (
            <MediaGrid
              files={filteredFiles}
              isLoading={isLoading}
              selectedIds={selectedIds}
              onSelect={handleSelectFile}
              onOpenPreview={(f) => setPreviewFile(f)}
            />
          ) : (
            <MediaList
              files={filteredFiles}
              isLoading={isLoading}
              selectedIds={selectedIds}
              onSelect={handleSelectFile}
              onOpenPreview={(f) => setPreviewFile(f)}
            />
          )}
        </div>

        {/* Thanh Phân Trang Pagination */}
        <MediaPagination
          skip={skip}
          limit={limit}
          currentCount={filteredFiles.length}
          onPageChange={setSkip}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setSkip(0);
          }}
        />
      </div>

      {/* 3. Bảng Inspector Chi tiết bên phải (chỉ hiện trên màn hình desktop lớn hoặc khi có activeFile) */}
      <MediaInspector
        file={activeFile}
        onClose={() => setActiveFile(null)}
        onFileUpdated={handleFileUpdated}
        onRequestDelete={(f) => setFileToDelete(f)}
        onOpenPreview={(f) => setPreviewFile(f)}
      />

      {/* 4. Modal Lightbox Phóng to Chi tiết */}
      <MediaPreviewModal
        isOpen={Boolean(previewFile)}
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      {/* 5. Modal Cảnh Báo Xóa Vĩnh Viễn */}
      <MediaDeleteDialog
        isOpen={Boolean(fileToDelete)}
        file={fileToDelete}
        isDeleting={isDeleting}
        onClose={() => setFileToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

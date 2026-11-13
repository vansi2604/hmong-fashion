"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from '@/lib/use-dropzone';
import { mediaService } from '@/services/media.service';
import { MediaFile, MediaFolder, MediaType, formatBytes } from '@/types/media';

interface UploadItem {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
  result?: MediaFile;
}

interface MediaDropzoneProps {
  currentFolder: MediaFolder | string;
  onUploadSuccess?: (uploadedFiles: MediaFile[]) => void;
  className?: string;
}

export function MediaDropzone({
  currentFolder,
  onUploadSuccess,
  className = '',
}: MediaDropzoneProps) {
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const isVideoFolder = currentFolder === MediaFolder.VIDEOS_PRODUCTS;
  const maxSizeBytes = isVideoFolder ? 100 * 1024 * 1024 : 15 * 1024 * 1024;
  const maxMb = isVideoFolder ? 100 : 15;

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      // 1. Tạo items cho các file được chấp nhận
      const newItems: UploadItem[] = acceptedFiles.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        progress: 0,
        status: 'pending',
      }));

      // 2. Thêm các file bị reject từ client-side validation
      fileRejections.forEach((rej) => {
        const errorMsg = rej.errors[0]?.message || 'Tệp không hợp lệ';
        newItems.push({
          id: `${rej.file.name}-${Date.now()}`,
          file: rej.file,
          previewUrl: '',
          progress: 0,
          status: 'error',
          errorMessage: errorMsg.includes('larger than')
            ? `Dung lượng vượt quá giới hạn (${maxMb}MB)`
            : errorMsg,
        });
      });

      if (newItems.length === 0) return;

      setUploadQueue((prev) => [...newItems, ...prev]);
      setIsProcessing(true);

      const successfulUploads: MediaFile[] = [];

      // 3. Tiến hành upload tuần tự từng file hợp lệ
      for (const item of newItems) {
        if (item.status === 'error') continue;

        // Cập nhật trạng thái đang upload
        setUploadQueue((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'uploading' } : i))
        );

        try {
          const res = await mediaService.upload(
            item.file,
            currentFolder,
            item.file.name.replace(/\.[^/.]+$/, ''),
            (percent) => {
              setUploadQueue((prev) =>
                prev.map((i) => (i.id === item.id ? { ...i, progress: percent } : i))
              );
            }
          );

          successfulUploads.push(res);
          setUploadQueue((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: 'success', progress: 100, result: res }
                : i
            )
          );
        } catch (error: any) {
          const message = error.message || 'Tải lên thất bại';
          setUploadQueue((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, status: 'error', errorMessage: message }
                : i
            )
          );
        }
      }

      setIsProcessing(false);

      if (successfulUploads.length > 0 && onUploadSuccess) {
        onUploadSuccess(successfulUploads);
      }
    },
    [currentFolder, maxMb, maxSizeBytes, onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxSize: maxSizeBytes,
    accept: isVideoFolder
      ? {
          'video/*': ['.mp4', '.mov', '.webm', '.mkv'],
        }
      : {
          'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'],
        },
  });

  const removeQueueItem = (id: string) => {
    setUploadQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCompleted = () => {
    setUploadQueue((prev) => prev.filter((item) => item.status === 'uploading'));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Vùng Dropzone kéo thả chính */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragReject
            ? 'border-rose-500 bg-rose-50/50'
            : isDragActive
            ? 'border-amber-600 bg-amber-50/60 scale-[1.005]'
            : 'border-stone-300 hover:border-amber-700 bg-stone-50/70 hover:bg-stone-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-2xl shadow-xs">
            {isVideoFolder ? '🎬' : '☁️'}
          </div>

          <div className="space-y-1">
            <p className="text-sm sm:text-base font-semibold text-stone-900">
              {isDragActive
                ? 'Thả tệp vào đây để tải lên ngay...'
                : 'Kéo thả ảnh hoặc video vào đây, hoặc bấm để duyệt tệp'}
            </p>
            <p className="text-xs text-stone-500">
              Đích tải lên: <span className="font-semibold text-amber-800">{currentFolder}</span> • Tối đa {maxMb}MB mỗi tệp
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <span>Hỗ trợ: {isVideoFolder ? 'MP4, MOV, WEBM, MKV' : 'JPG, PNG, WEBP, GIF, SVG'}</span>
            <span>•</span>
            <span>Hỗ trợ chọn nhiều tệp cùng lúc</span>
          </div>
        </div>
      </div>

      {/* Danh sách hàng đợi tải lên (Upload Queue) */}
      {uploadQueue.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-xs font-bold text-stone-800 uppercase tracking-wide">
              Tiến trình tải lên ({uploadQueue.filter((i) => i.status === 'success').length}/{uploadQueue.length} hoàn tất)
            </span>
            <div className="flex items-center gap-2">
              {!isProcessing && uploadQueue.some((i) => i.status === 'success' || i.status === 'error') && (
                <button
                  type="button"
                  onClick={clearCompleted}
                  className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
                >
                  Xóa mục đã xong
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {uploadQueue.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-stone-50 border border-stone-100 text-xs"
              >
                {/* Thumbnail nhỏ */}
                <div className="w-10 h-10 rounded-md bg-stone-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {item.previewUrl ? (
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-stone-500 text-sm">
                      {item.file.type.startsWith('video') ? '🎬' : '📄'}
                    </span>
                  )}
                </div>

                {/* Thông tin file & tiến trình */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-stone-900 truncate max-w-[220px] sm:max-w-xs">
                      {item.file.name}
                    </span>
                    <span className="text-[11px] text-stone-500 flex-shrink-0 ml-2">
                      {formatBytes(item.file.size)}
                    </span>
                  </div>

                  {/* Thanh tiến trình Progress bar */}
                  {item.status === 'uploading' && (
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-600 h-full transition-all duration-150 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Thông báo trạng thái */}
                  <div className="flex items-center gap-2 text-[11px]">
                    {item.status === 'uploading' && (
                      <span className="text-amber-700 font-medium">
                        Đang tải lên {item.progress}%...
                      </span>
                    )}
                    {item.status === 'success' && (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        ✓ Tải lên thành công
                      </span>
                    )}
                    {item.status === 'error' && (
                      <span className="text-rose-600 font-medium">
                        ✕ {item.errorMessage}
                      </span>
                    )}
                    {item.status === 'pending' && (
                      <span className="text-stone-400">Đang chờ xử lý...</span>
                    )}
                  </div>
                </div>

                {/* Nút hủy / xóa khỏi queue */}
                {item.status !== 'uploading' && (
                  <button
                    type="button"
                    onClick={() => removeQueueItem(item.id)}
                    className="text-stone-400 hover:text-stone-700 p-1 rounded-md"
                    title="Xóa mục này"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

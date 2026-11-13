"use client";

import React, { useState } from 'react';
import { MediaFile, MediaType, formatBytes } from '@/types/media';
import { getImageUrl } from '@/lib/api-client';

interface MediaPreviewModalProps {
  isOpen: boolean;
  file: MediaFile | null;
  onClose: () => void;
}

export function MediaPreviewModal({
  isOpen,
  file,
  onClose,
}: MediaPreviewModalProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !file) return null;

  const fullUrl = getImageUrl(file.url);
  const isVideo = file.media_type === MediaType.VIDEO;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleZoom = (level: number) => {
    setZoomLevel(level);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-5xl w-full max-h-[92vh] bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-100">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-800 bg-stone-900/90">
          <div className="flex items-center gap-2.5 truncate">
            <span className="text-amber-400 font-bold text-sm">
              {isVideo ? '🎬' : '🔍'}
            </span>
            <div className="truncate">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-md">
                {file.filename}
              </h3>
              <p className="text-[11px] text-stone-400">
                {file.folder} • {formatBytes(file.file_size)} • ID: #{file.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isVideo && (
              <div className="hidden sm:flex items-center bg-stone-800 rounded-lg p-0.5 border border-stone-700 text-xs">
                <button
                  type="button"
                  onClick={() => handleZoom(1)}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    zoomLevel === 1 ? 'bg-amber-700 text-white font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  100%
                </button>
                <button
                  type="button"
                  onClick={() => handleZoom(1.5)}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    zoomLevel === 1.5 ? 'bg-amber-700 text-white font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  150% (Soi vải)
                </button>
                <button
                  type="button"
                  onClick={() => handleZoom(2)}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    zoomLevel === 2 ? 'bg-amber-700 text-white font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  200% (Chi tiết)
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <span>{copied ? '✓ Đã chép' : '📋 Sao chép URL'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Main Viewport */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-stone-950/95 min-h-[400px]">
          {isVideo ? (
            <video
              src={fullUrl}
              controls
              autoPlay
              className="max-h-[70vh] max-w-full rounded-xl shadow-lg border border-stone-800"
            />
          ) : (
            <div className="overflow-auto max-h-[72vh] max-w-full flex items-center justify-center">
              <img
                src={fullUrl}
                alt={file.alt_text || file.filename}
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease',
                }}
                className="max-h-[70vh] object-contain rounded-lg shadow-2xl select-none"
              />
            </div>
          )}
        </div>

        {/* Footer Alt Text */}
        {file.alt_text && (
          <div className="px-5 py-2.5 bg-stone-900 border-t border-stone-800 text-xs text-stone-400">
            <span className="text-amber-400 font-semibold mr-1.5">Chú thích SEO:</span>
            <span>{file.alt_text}</span>
          </div>
        )}
      </div>
    </div>
  );
}

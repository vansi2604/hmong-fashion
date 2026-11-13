"use client";

import React from 'react';

interface MediaPaginationProps {
  skip: number;
  limit: number;
  currentCount: number;
  onPageChange: (newSkip: number) => void;
  onLimitChange: (newLimit: number) => void;
}

export function MediaPagination({
  skip,
  limit,
  currentCount,
  onPageChange,
  onLimitChange,
}: MediaPaginationProps) {
  const currentPage = Math.floor(skip / limit) + 1;
  // Giả định nếu trang hiện tại trả về đủ số lượng limit thì có trang tiếp theo
  const hasNextPage = currentCount === limit;
  const hasPrevPage = skip > 0;

  const startRecord = skip + 1;
  const endRecord = skip + currentCount;

  return (
    <div className="bg-white border-t border-stone-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
      {/* Thông tin số lượng hiển thị */}
      <div className="flex items-center gap-3 text-stone-500">
        <span>
          {currentCount > 0
            ? `Hiển thị ${startRecord} – ${endRecord} tệp`
            : '0 tệp tin'}
        </span>
        <div className="flex items-center gap-1.5 pl-2 border-l border-stone-200">
          <span>Mỗi trang:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-stone-50 border border-stone-200 rounded-md px-1.5 py-0.5 text-stone-800 font-medium focus:outline-none"
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Điều hướng chuyển trang Pagination */}
      <div className="flex items-center gap-1.5">
        {/* Nút Đầu trang */}
        <button
          type="button"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(0)}
          className="px-2 py-1 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          title="Về trang đầu"
        >
          ««
        </button>

        {/* Nút Trang trước */}
        <button
          type="button"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(Math.max(0, skip - limit))}
          className="px-3 py-1 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 font-medium disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          ‹ Trang trước
        </button>

        {/* Huy hiệu Trang hiện tại */}
        <div className="px-3 py-1 bg-stone-900 text-white rounded-lg font-bold">
          Trang {currentPage}
        </div>

        {/* Nút Trang kế tiếp */}
        <button
          type="button"
          disabled={!hasNextPage}
          onClick={() => onPageChange(skip + limit)}
          className="px-3 py-1 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 font-medium disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          Trang sau ›
        </button>
      </div>
    </div>
  );
}

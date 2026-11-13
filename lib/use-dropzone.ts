"use client";

import React, { useState, useRef, useCallback } from 'react';

export interface FileError {
  message: string;
  code: string;
}

export interface FileRejection {
  file: File;
  errors: FileError[];
}

export interface DropzoneOptions {
  accept?: Record<string, string[]>;
  maxSize?: number;
  minSize?: number;
  multiple?: boolean;
  disabled?: boolean;
  onDrop?: (acceptedFiles: File[], fileRejections: FileRejection[]) => void;
}

export interface DropzoneState {
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
  open: () => void;
  getRootProps: <T extends React.HTMLAttributes<HTMLElement>>(props?: T) => T & {
    ref: React.RefObject<any>;
    onClick: (e: React.MouseEvent) => void;
    onDragEnter: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
  getInputProps: <T extends React.InputHTMLAttributes<HTMLInputElement>>(props?: T) => T & {
    ref: React.RefObject<any>;
    type: 'file';
    style: React.CSSProperties;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

/**
 * Kiểm tra xem tệp có hợp lệ với cấu hình accept không
 */
function isFileAccepted(file: File, accept?: Record<string, string[]>): boolean {
  if (!accept || Object.keys(accept).length === 0) return true;

  const fileName = file.name.toLowerCase();
  const fileMime = file.type.toLowerCase();

  for (const [mimeGroup, extensions] of Object.entries(accept)) {
    // 1. Kiểm tra wildcard mime (vd: image/*, video/*)
    if (mimeGroup.endsWith('/*')) {
      const baseType = mimeGroup.slice(0, -2);
      if (fileMime.startsWith(baseType)) return true;
    } else if (fileMime === mimeGroup.toLowerCase()) {
      return true;
    }

    // 2. Kiểm tra phần mở rộng đuôi tệp (vd: .jpg, .png, .mp4)
    for (const ext of extensions) {
      if (fileName.endsWith(ext.toLowerCase())) return true;
    }
  }

  return false;
}

/**
 * Hook `useDropzone` chuẩn React 19 tương thích 100% API của `react-dropzone`
 * Giúp ứng dụng hoạt động mượt mà không phụ thuộc vào node_modules ngoại vi
 */
export function useDropzone(options: DropzoneOptions = {}): DropzoneState {
  const {
    accept,
    maxSize,
    minSize,
    multiple = true,
    disabled = false,
    onDrop,
  } = options;

  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);
  const dragTargetRef = useRef<EventTarget | null>(null);

  // Xử lý kiểm tra danh sách file
  const processFiles = useCallback(
    (fileList: FileList | File[]) => {
      if (!fileList || fileList.length === 0) return;

      const rawFiles = Array.from(fileList);
      const targetFiles = multiple ? rawFiles : [rawFiles[0]];

      const acceptedFiles: File[] = [];
      const fileRejections: FileRejection[] = [];

      for (const file of targetFiles) {
        const errors: FileError[] = [];

        // Kiểm tra loại file
        if (!isFileAccepted(file, accept)) {
          errors.push({
            code: 'file-invalid-type',
            message: 'Định dạng tệp không được hỗ trợ',
          });
        }

        // Kiểm tra kích thước tối đa
        if (maxSize && file.size > maxSize) {
          errors.push({
            code: 'file-too-large',
            message: `Tệp lớn hơn dung lượng cho phép (${Math.round(maxSize / (1024 * 1024))}MB)`,
          });
        }

        // Kiểm tra kích thước tối thiểu
        if (minSize && file.size < minSize) {
          errors.push({
            code: 'file-too-small',
            message: `Tệp nhỏ hơn dung lượng tối thiểu (${minSize} bytes)`,
          });
        }

        if (errors.length > 0) {
          fileRejections.push({ file, errors });
        } else {
          acceptedFiles.push(file);
        }
      }

      if (onDrop) {
        onDrop(acceptedFiles, fileRejections);
      }
    },
    [accept, maxSize, minSize, multiple, onDrop]
  );

  const open = useCallback(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  }, [disabled]);

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragTargetRef.current = e.target;

      if (disabled) return;
      setIsDragActive(true);
    },
    [disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      e.dataTransfer.dropEffect = 'copy';
      setIsDragActive(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;

      if (dragTargetRef.current === e.target) {
        setIsDragActive(false);
        setIsDragReject(false);
      }
    },
    [disabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;

      setIsDragActive(false);
      setIsDragReject(false);

      if (e.dataTransfer?.files) {
        processFiles(e.dataTransfer.files);
      }
    },
    [disabled, processFiles]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files);
      }
      // Reset giá trị input để có thể chọn lại cùng 1 file nếu muốn
      e.target.value = '';
    },
    [processFiles]
  );

  // Tạo chuỗi accept cho thẻ input
  const acceptAttr = React.useMemo(() => {
    if (!accept) return undefined;
    const tokens: string[] = [];
    for (const [mime, exts] of Object.entries(accept)) {
      tokens.push(mime);
      exts.forEach((ext) => tokens.push(ext));
    }
    return tokens.join(',');
  }, [accept]);

  const getRootProps = useCallback(
    <T extends React.HTMLAttributes<HTMLElement>>(props?: T) => {
      return {
        ...props,
        ref: rootRef,
        onClick: (e: React.MouseEvent) => {
          if (props?.onClick) props.onClick(e);
          open();
        },
        onDragEnter: (e: React.DragEvent) => {
          if (props?.onDragEnter) props.onDragEnter(e);
          handleDragEnter(e);
        },
        onDragOver: (e: React.DragEvent) => {
          if (props?.onDragOver) props.onDragOver(e);
          handleDragOver(e);
        },
        onDragLeave: (e: React.DragEvent) => {
          if (props?.onDragLeave) props.onDragLeave(e);
          handleDragLeave(e);
        },
        onDrop: (e: React.DragEvent) => {
          if (props?.onDrop) props.onDrop(e);
          handleDrop(e);
        },
      };
    },
    [handleDragEnter, handleDragLeave, handleDragOver, handleDrop, open]
  );

  const getInputProps = useCallback(
    <T extends React.InputHTMLAttributes<HTMLInputElement>>(props?: T) => {
      return {
        ...props,
        ref: inputRef,
        type: 'file' as const,
        style: { display: 'none' },
        accept: acceptAttr,
        multiple,
        disabled,
        onChange: handleInputChange,
      };
    },
    [acceptAttr, disabled, handleInputChange, multiple]
  );

  return {
    isDragActive,
    isDragAccept: isDragActive && !isDragReject,
    isDragReject,
    open,
    getRootProps,
    getInputProps,
  };
}

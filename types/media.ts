/**
 * H'Mông Fashion - Định nghĩa TypeScript cho Phân hệ Quản lý File Tập Trung (Media Management)
 * Khớp chuẩn 100% với đặc tả kỹ thuật backend: medial-module-be-des.md
 */

// 1. Enum các thư mục lưu trữ nghiệp vụ chuẩn hóa
export enum MediaFolder {
  PRODUCTS_ORIGINALS = 'products/originals',
  PRODUCTS_THUMBNAILS = 'products/thumbnails',
  PRODUCTS_ZOOMS = 'products/zooms',
  TAILORS = 'tailors',
  BANNERS = 'banners',
  AVATARS = 'avatars',
  VIDEOS_PRODUCTS = 'videos/products',
}

// 2. Enum loại media
export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

// 3. Đối tượng Media File trả về từ API Backend
export interface MediaFile {
  id: number;
  filename: string;
  url: string;
  folder: MediaFolder | string;
  media_type: MediaType | string;
  file_type: string;
  file_size: number;
  alt_text?: string | null;
  created_at: string;
}

// 4. Payload cập nhật thông tin Media
export interface MediaUpdateRequest {
  alt_text?: string;
}

// 5. Query parameters khi lấy danh sách media
export interface MediaListParams {
  folder?: MediaFolder | string;
  media_type?: MediaType | string;
  skip?: number;
  limit?: number;
}

// 6. Cấu trúc thông tin thư mục hiển thị trên UI
export interface FolderMeta {
  key: MediaFolder;
  label: string;
  description: string;
  mediaType: MediaType;
  icon: string;
  maxSizeMB: number;
  group: 'products' | 'tailors' | 'marketing';
}

export const MEDIA_FOLDERS_CONFIG: FolderMeta[] = [
  {
    key: MediaFolder.PRODUCTS_ORIGINALS,
    label: 'Ảnh gốc sản phẩm',
    description: 'Ảnh chất lượng cao cho trang chi tiết sản phẩm',
    mediaType: MediaType.IMAGE,
    icon: '🖼️',
    maxSizeMB: 15,
    group: 'products',
  },
  {
    key: MediaFolder.PRODUCTS_THUMBNAILS,
    label: 'Ảnh thu nhỏ (1:1)',
    description: 'Ảnh vuông tỷ lệ 1:1 dùng cho thẻ card, danh sách',
    mediaType: MediaType.IMAGE,
    icon: '🔲',
    maxSizeMB: 15,
    group: 'products',
  },
  {
    key: MediaFolder.PRODUCTS_ZOOMS,
    label: 'Ảnh chi tiết / Zoom',
    description: 'Ảnh zoom siêu nét hoa văn thổ cẩm & batik sáp ong',
    mediaType: MediaType.IMAGE,
    icon: '🔍',
    maxSizeMB: 15,
    group: 'products',
  },
  {
    key: MediaFolder.TAILORS,
    label: 'Ảnh mẫu may đo',
    description: 'Ảnh mẫu đặt may của khách hàng & nghệ nhân Sa Pa',
    mediaType: MediaType.IMAGE,
    icon: '✂️',
    maxSizeMB: 15,
    group: 'tailors',
  },
  {
    key: MediaFolder.AVATARS,
    label: 'Ảnh đại diện',
    description: 'Ảnh hồ sơ cá nhân người dùng và nhân viên',
    mediaType: MediaType.IMAGE,
    icon: '👤',
    maxSizeMB: 15,
    group: 'tailors',
  },
  {
    key: MediaFolder.BANNERS,
    label: 'Banner quảng cáo',
    description: 'Banner trang chủ, lookbook & chiến dịch theo mùa',
    mediaType: MediaType.IMAGE,
    icon: '🏷️',
    maxSizeMB: 15,
    group: 'marketing',
  },
  {
    key: MediaFolder.VIDEOS_PRODUCTS,
    label: 'Video sản phẩm',
    description: 'Video ngắn review trang phục, cận cảnh chất vải may',
    mediaType: MediaType.VIDEO,
    icon: '🎬',
    maxSizeMB: 100,
    group: 'marketing',
  },
];

/**
 * Định dạng số bytes sang dung lượng đọc được (B, KB, MB, GB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Định dạng ngày giờ chuẩn hiển thị tiếng Việt
 */
export function formatDateTime(isoString?: string): string {
  if (!isoString) return '--';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(d);
  } catch {
    return isoString;
  }
}

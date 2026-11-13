import { Product, ProductCategory } from '@/types/product';
import { BACKEND_SERVER_URL, API_BASE_URL } from '@/lib/api-client';

/**
 * Định dạng tiền tệ VND (ví dụ: 150000 -> "150.000 ₫")
 */
export const formatCurrency = (amount?: number | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0 ₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Lấy Badge hiển thị trạng thái tồn kho
 */
export const getStockBadge = (stock: number = 0) => {
  if (stock <= 0) {
    return {
      label: 'Tạm hết hàng',
      badgeClass: 'bg-red-100 text-red-700 border-red-200',
      dotClass: 'bg-red-500',
    };
  }
  if (stock <= 3) {
    return {
      label: `Sắp hết (Còn ${stock})`,
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      dotClass: 'bg-amber-500',
    };
  }
  return {
    label: `Còn hàng (${stock})`,
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dotClass: 'bg-emerald-500',
  };
};

/**
 * Helper lấy URL ảnh chính an toàn từ trường primary_image_url hoặc gallery
 */
export const getProductImageUrl = (product?: Partial<Product> | null): string => {
  if (!product) return '/placeholder-dress.png';

  const rawUrl =
    product.primary_image_url ||
    product.images?.[0]?.image_url ||
    product.imageUrl;

  if (!rawUrl) return '/placeholder-dress.png';

  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl;
  }

  // Ghép với domain Backend Server
  const serverBase =
    process.env.NEXT_PUBLIC_BASE_URL ||
    BACKEND_SERVER_URL ||
    'http://127.0.0.1:8000';

  const cleanPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
  return `${serverBase.replace(/\/$/, '')}${cleanPath}`;
};

/**
 * Lấy nhãn tiếng Việt hiển thị cho Danh mục sản phẩm
 */
export const getCategoryLabel = (category?: ProductCategory | string | null): string => {
  if (!category) return 'Chưa phân loại';

  const catStr = String(category).toUpperCase();
  switch (catStr) {
    case ProductCategory.TRADITIONAL:
    case 'TRADITIONAL':
      return "Truyền thống H'Mông";
    case ProductCategory.MODERN:
    case 'MODERN':
      return "Cách tân hiện đại";
    case ProductCategory.ACCESSORIES:
    case 'ACCESSORIES':
      return "Phụ kiện & Trang sức";
    case 'AO-KHOAC':
      return "Áo khoác thổ cẩm";
    case 'VAY-DAM':
      return "Váy đầm cách tân";
    case 'AO-SO-MI':
      return "Áo sơ mi linen";
    case 'PHU-KIEN':
      return "Bạc & Khăn choàng";
    default:
      return String(category);
  }
};

/**
 * Lấy CSS class cho Badge danh mục
 */
export const getCategoryBadgeStyle = (category?: ProductCategory | string | null): {
  bg: string;
  icon: string;
} => {
  const catStr = String(category || '').toUpperCase();
  switch (catStr) {
    case ProductCategory.TRADITIONAL:
    case 'TRADITIONAL':
      return { bg: 'bg-rose-50 text-rose-800 border-rose-200', icon: '👘' };
    case ProductCategory.MODERN:
    case 'MODERN':
      return { bg: 'bg-indigo-50 text-indigo-800 border-indigo-200', icon: '✨' };
    case ProductCategory.ACCESSORIES:
    case 'ACCESSORIES':
      return { bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: '💍' };
    default:
      return { bg: 'bg-stone-100 text-stone-800 border-stone-200', icon: '🏷️' };
  }
};

/**
 * Tự động sinh slug chuẩn SEO từ tên sản phẩm tiếng Việt
 */
export const generateProductSlug = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

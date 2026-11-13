/**
 * H'Mông Fashion - TypeScript Types & Interfaces cho Module Sản phẩm & Phụ kiện
 * Căn cứ trực tiếp từ docs/FE_SPECS_PRODUCTS.md
 */

// Danh mục sản phẩm chuẩn theo Backend
export enum ProductCategory {
  TRADITIONAL = 'TRADITIONAL',
  MODERN = 'MODERN',
  ACCESSORIES = 'ACCESSORIES',
}

// Đối tượng ảnh phụ của sản phẩm
export interface ProductImage {
  id: number;
  product_id?: number;
  media_id: number | null;
  image_url: string;
  display_order: number;
  is_primary: boolean;
}

// Đối tượng Sản phẩm đầy đủ (Response từ API /products/)
export interface Product {
  id: number | string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  rental_price_per_day: number;
  stock: number;
  category: ProductCategory | string;
  primary_media_id?: number | null;
  primary_image_url?: string | null;
  is_active: boolean;
  created_at?: string;
  images?: ProductImage[];

  // Trường tương thích giao diện bán lẻ (Storefront Legacy & Mock)
  categoryName?: string;
  originalPrice?: number;
  discountPercent?: number;
  imageUrl?: string;
  gallery?: string[];
  craftDetails?: string;
  material?: string;
  badge?: "Mới" | "Bán chạy" | "Thủ công 100%" | "Phiên bản giới hạn" | string;
  inStock?: boolean;
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  isOfficial?: boolean;
  location?: string;
  isFreeship?: boolean;
  flashSale?: {
    discount: number;
    totalStock: number;
    soldStock: number;
  };
}

// Payload khi tạo mới sản phẩm (POST /products/)
export interface ProductCreatePayload {
  name: string;
  slug?: string;
  description?: string;
  price?: number;
  rental_price_per_day?: number;
  stock?: number;
  category?: ProductCategory | string;
  primary_media_id?: number | null;
  primary_image_url?: string;
  image_media_ids?: number[];
}

// Payload khi cập nhật thông tin sản phẩm (PUT /products/{id})
export interface ProductUpdatePayload {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  rental_price_per_day?: number;
  stock?: number;
  category?: ProductCategory | string;
  primary_media_id?: number | null;
  primary_image_url?: string;
  is_active?: boolean;
  image_media_ids?: number[];
}

// Query parameters tìm kiếm & lọc danh sách
export interface ProductListParams {
  category?: ProductCategory | string;
  search?: string;
  skip?: number;
  limit?: number;
  is_active?: boolean;
}

// Interfaces phụ trợ cho Storefront
export interface Category {
  id: string;
  name: string;
  icon: string;
  imageUrl: string;
  itemCount: number;
  isHot?: boolean;
}

export interface Voucher {
  id: string;
  code: string;
  discountText: string;
  minSpend: number;
  expiry: string;
  isClaimed?: boolean;
}

export interface CraftStory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  authorNote: string;
}

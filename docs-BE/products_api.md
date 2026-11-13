# Tài Liệu API Module Sản Phẩm & Phụ Kiện (Products Module API Specification)

> **Mục đích tài liệu:** Tài liệu này được biên soạn chuẩn hóa để cung cấp trực tiếp cho **AI (LLM / Copilot / Cursor / Claude / ChatGPT)** hoặc lập trình viên Frontend (FE) đọc hiểu và sinh mã nguồn giao diện: Trang danh mục sản phẩm (Catalog / Shop), Trang chi tiết sản phẩm (Product Detail), Tìm kiếm & Lọc, và Bảng điều khiển quản trị sản phẩm (Admin / Staff CRUD).

---

## 📌 Hướng dẫn dành cho AI Lập trình Frontend (AI Prompting Context)

1. **Base URL:** `http://127.0.0.1:8000/api/v1/products`
2. **Quyền truy cập:**
   - **Khách mua hàng / Vãng lai (Public):** Xem danh sách sản phẩm, lọc theo danh mục, tìm kiếm và xem chi tiết sản phẩm (Không cần đăng nhập / không cần token).
   - **Quản trị viên & Nhân viên (`ROLE_ADMIN`, `ROLE_STAFF`):** Tạo mới, chỉnh sửa, xóa sản phẩm.
   - **Chỉ Quản trị viên (`ROLE_ADMIN`):** Xóa vĩnh viễn (Hard delete).
3. **Hiển thị hình ảnh sản phẩm:**
   - Ảnh đại diện chính: nằm ở trường `primary_image_url`. Nếu trường này là đường dẫn tương đối (ví dụ `uploads/products/...`), FE cần nối với host backend: `http://127.0.0.1:8000/uploads/...`
   - Bộ sưu tập ảnh phụ (Gallery): nằm trong mảng `images: ProductImageResponse[]`.
4. **Hỗ trợ 2 hình thức kinh doanh:**
   - **Bán đứt:** `price > 0`
   - **Cho thuê theo ngày:** `rental_price_per_day > 0`

---

## 📐 1. Hệ Thống Kiểu Dữ Liệu TypeScript (TypeScript Interfaces)

Hãy copy trực tiếp các type/interface dưới đây vào `src/types/product.ts`:

```typescript
// ==============================================================================
// 1. DATA MODELS & ENTITIES
// ==============================================================================

export type ProductCategory =
  | "TRADITIONAL"  // Trang phục truyền thống các nhóm H'Mông (Đen, Hoa, Trắng, Đỏ...)
  | "MODERN"       // Trang phục cách tân phong cách H'Mông
  | "ACCESSORIES"  // Phụ kiện: vòng bạc, khuyên tai, xà tích, mũ, khăn...
  | "FABRICS";     // Vải lanh dệt thủ công, sáp ong, thổ cẩm

export interface ProductImage {
  id: number;
  media_id: number | null;
  image_url: string;           // URL ảnh (tuyệt đối hoặc tương đối /uploads/...)
  display_order: number;       // Thứ tự hiển thị trong bộ sưu tập (từ 0 trở đi)
  is_primary: boolean;         // Có phải ảnh chính không
}

export interface ProductResponse {
  id: number;
  name: string;                // Tên sản phẩm (vd: "Trang phục Nữ H'Mông Hoa Sa Pa")
  slug: string | null;         // Slug URL thân thiện SEO (vd: "trang-phuc-nu-hmong-hoa-sa-pa")
  description: string | null;  // Mô tả chi tiết, chất liệu, hướng dẫn bảo quản
  price: number;               // Giá bán lẻ niêm yết (VNĐ)
  rental_price_per_day: number;// Giá cho thuê mỗi ngày (VNĐ/ngày). Bằng 0 nếu không cho thuê
  stock: number;               // Số lượng tồn kho sẵn có
  category: string;            // TRADITIONAL, MODERN, ACCESSORIES...
  primary_media_id: number | null;
  primary_image_url: string | null; // Ảnh đại diện hiển thị ở thẻ sản phẩm (Card)
  is_active: boolean;          // true: đang mở bán; false: tạm ẩn / hết hàng
  created_at: string;          // ISO 8601 string
  images: ProductImage[];      // Danh sách ảnh chi tiết / bộ sưu tập
}

// ==============================================================================
// 2. REQUEST PAYLOADS
// ==============================================================================

export interface ProductQueryParams {
  category?: string;           // Lọc theo danh mục
  search?: string;             // Tìm kiếm theo tên sản phẩm
  skip?: number;               // Phân trang (mặc định: 0)
  limit?: number;              // Số lượng bản ghi (mặc định: 50, min: 1, max: 100)
}

export interface ProductCreatePayload {
  name: string;                // Bắt buộc (2 - 200 ký tự)
  slug?: string;
  description?: string;
  price?: number;              // Mặc định: 0
  rental_price_per_day?: number;// Mặc định: 0
  stock?: number;              // Mặc định: 0
  category?: string;           // Mặc định: "TRADITIONAL"
  primary_media_id?: number;   // ID ảnh từ module media
  primary_image_url?: string;  // Hoặc URL ảnh trực tiếp
  image_media_ids?: number[];  // Mảng ID các ảnh phụ từ module /media
}

export interface ProductUpdatePayload {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  rental_price_per_day?: number;
  stock?: number;
  category?: string;
  primary_media_id?: number;
  primary_image_url?: string;
  is_active?: boolean;
}
```

---

## 🚀 2. Danh Sách Các Endpoint Module Products (`/api/v1/products`)

| Method | Endpoint | Quyền hạn | Mục đích sử dụng trên Frontend |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/products/` | Public | Xem danh sách sản phẩm, lọc theo danh mục, tìm kiếm và phân trang |
| `GET` | `/api/v1/products/{product_id}` | Public | Xem chi tiết 1 sản phẩm (kèm giá bán, giá thuê và bộ ảnh) |
| `POST` | `/api/v1/products/` | Admin / Staff | Tạo mới sản phẩm hoặc phụ kiện |
| `PUT` | `/api/v1/products/{product_id}` | Admin / Staff | Cập nhật thông tin chi tiết sản phẩm |
| `DELETE` | `/api/v1/products/{product_id}` | Admin / Staff | Xóa mềm sản phẩm (ẩn khỏi danh sách hiển thị) |
| `DELETE` | `/api/v1/products/{product_id}/hard` | Chỉ Admin | Xóa vĩnh viễn sản phẩm khỏi Database |

---

### 2.1. Lấy danh sách sản phẩm (`GET /api/v1/products/`)

- **Xác thực:** Public (Không yêu cầu token).
- **Query Parameters:**
  - `category` (string, optional): Lọc theo danh mục (`TRADITIONAL`, `MODERN`, `ACCESSORIES`...).
  - `search` (string, optional): Tìm kiếm gần đúng theo tên sản phẩm.
  - `skip` (integer, default: 0): Vị trí bắt đầu.
  - `limit` (integer, default: 50, max: 100): Số lượng sản phẩm mỗi trang.
- **Phản hồi thành công (HTTP 200 OK):** Mảng các `ProductResponse`.

#### Ví dụ JSON Response:
```json
[
  {
    "id": 1,
    "name": "Trang Phục Nữ H'Mông Hoa Sa Pa Cao Cấp",
    "slug": "trang-phuc-nu-hmong-hoa-sa-pa-cao-cap",
    "description": "Váy thêu tay thủ công tinh xảo, chất vải lanh nhuộm chàm truyền thống kết hợp phụ kiện bạc đính kèm.",
    "price": 2800000.0,
    "rental_price_per_day": 350000.0,
    "stock": 10,
    "category": "TRADITIONAL",
    "primary_media_id": 15,
    "primary_image_url": "uploads/products/originals/hmong_hoa_thumb.jpg",
    "is_active": true,
    "created_at": "2026-11-13T07:15:00Z",
    "images": [
      {
        "id": 1,
        "media_id": 15,
        "image_url": "uploads/products/originals/hmong_hoa_thumb.jpg",
        "display_order": 0,
        "is_primary": true
      },
      {
        "id": 2,
        "media_id": 16,
        "image_url": "uploads/products/originals/hmong_hoa_detail_1.jpg",
        "display_order": 1,
        "is_primary": false
      }
    ]
  }
]
```

---

### 2.2. Xem chi tiết sản phẩm (`GET /api/v1/products/{product_id}`)

- **Xác thực:** Public.
- **Path Parameters:** `product_id` (integer) - ID của sản phẩm.
- **Phản hồi thành công (HTTP 200 OK):** Trả về đối tượng `ProductResponse`.
- **Lỗi:** `404 Not Found` (`PRODUCT_NOT_FOUND`) nếu ID không tồn tại.

---

### 2.3. Tạo mới sản phẩm (`POST /api/v1/products/`)

- **Xác thực:** Bắt buộc (`Authorization: Bearer <access_token>`).
- **Yêu cầu vai trò:** `ROLE_ADMIN` hoặc `ROLE_STAFF`.
- **Request Body (`ProductCreatePayload`):**
  ```json
  {
    "name": "Vòng Cổ Bạc H'Mông Chạm Khắc Chim Phượng",
    "description": "Phụ kiện bạc thủ công truyền thống của nghệ nhân H'Mông Lào Cai",
    "price": 850000.0,
    "rental_price_per_day": 80000.0,
    "stock": 25,
    "category": "ACCESSORIES",
    "primary_media_id": 18,
    "primary_image_url": "uploads/products/originals/vong_bac_1.jpg",
    "image_media_ids": [18, 19, 20]
  }
  ```
- **Phản hồi thành công (HTTP 201 Created):** Đối tượng `ProductResponse` vừa tạo.

---

### 2.4. Cập nhật thông tin sản phẩm (`PUT /api/v1/products/{product_id}`)

- **Xác thực:** Bắt buộc (`Authorization: Bearer <access_token>`). Yêu cầu `ROLE_ADMIN` hoặc `ROLE_STAFF`.
- **Request Body (`ProductUpdatePayload`):** Chỉ cần truyền các trường muốn thay đổi.
  ```json
  {
    "price": 820000.0,
    "stock": 30,
    "is_active": true
  }
  ```
- **Phản hồi thành công (HTTP 200 OK):** Đối tượng `ProductResponse` đã cập nhật.

---

### 2.5. Xóa mềm sản phẩm (`DELETE /api/v1/products/{product_id}`)

- **Xác thực:** Bắt buộc (`ROLE_ADMIN` hoặc `ROLE_STAFF`).
- **Nghiệp vụ:** Chuyển `is_active = False` để sản phẩm không xuất hiện trên giao diện khách hàng nhưng vẫn lưu giữ dữ liệu cho lịch sử đơn hàng cũ.
- **Phản hồi:** `204 No Content`.

---

### 2.6. Xóa vĩnh viễn (`DELETE /api/v1/products/{product_id}/hard`)

- **Xác thực:** Bắt buộc (`ROLE_ADMIN` - Chỉ Quản trị viên tối cao).
- **Phản hồi:** `204 No Content`.

---

## 💻 3. Code Mẫu Tích Hợp Frontend (Product Service & Helpers)

```typescript
import axios from "axios";
import { ProductCreatePayload, ProductQueryParams, ProductResponse, ProductUpdatePayload } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
const STATIC_ASSET_BASE = process.env.NEXT_PUBLIC_STATIC_URL || "http://127.0.0.1:8000";

/**
 * Helper chuẩn hóa URL hình ảnh từ Backend
 */
export const resolveImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return "/images/placeholder-product.png";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  const cleanPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return `${STATIC_ASSET_BASE}${cleanPath}`;
};

export const productService = {
  /**
   * Lấy danh sách sản phẩm công khai
   */
  getProducts: async (params?: ProductQueryParams): Promise<ProductResponse[]> => {
    const res = await axios.get<ProductResponse[]>(`${API_BASE_URL}/products/`, { params });
    return res.data;
  },

  /**
   * Xem chi tiết sản phẩm theo ID
   */
  getProductDetail: async (productId: number): Promise<ProductResponse> => {
    const res = await axios.get<ProductResponse>(`${API_BASE_URL}/products/${productId}`);
    return res.data;
  },

  /**
   * Tạo sản phẩm mới (Admin / Staff)
   */
  createProduct: async (payload: ProductCreatePayload, token: string): Promise<ProductResponse> => {
    const res = await axios.post<ProductResponse>(`${API_BASE_URL}/products/`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  /**
   * Cập nhật sản phẩm (Admin / Staff)
   */
  updateProduct: async (
    productId: number,
    payload: ProductUpdatePayload,
    token: string
  ): Promise<ProductResponse> => {
    const res = await axios.put<ProductResponse>(`${API_BASE_URL}/products/${productId}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  /**
   * Xóa mềm sản phẩm (Admin / Staff)
   */
  deleteProduct: async (productId: number, token: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
```

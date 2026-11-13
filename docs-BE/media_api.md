# Tài Liệu API Module Quản Lý Media Tập Trung (Media Module API Specification)

> **Mục đích tài liệu:** Tài liệu này được biên soạn chuẩn hóa để cung cấp trực tiếp cho **AI (LLM / Copilot / Cursor / Claude / ChatGPT)** hoặc lập trình viên Frontend (FE) đọc hiểu và sinh mã nguồn: Tải lên hình ảnh/video bằng `FormData`, hiển thị ảnh sản phẩm/banner/avatar, quản lý thư viện hình ảnh phân cấp và xử lý Static File URL trên giao diện.

---

## 📌 Hướng dẫn dành cho AI Lập trình Frontend (AI Prompting Context)

1. **Base URL API:** `http://127.0.0.1:8000/api/v1/media`
2. **Static Asset URL (Đường dẫn tải ảnh tĩnh):**
   - Backend phục vụ thư mục static tại: `http://127.0.0.1:8000/uploads/{path}`
   - Trường `url` trả về từ API Media có dạng `uploads/products/originals/abc.jpg`.
   - Để hiển thị trên thẻ `<img>` của Frontend: Nối Host với `url` -> `http://127.0.0.1:8000/uploads/products/originals/abc.jpg`.
3. **Phân quyền thư mục tải lên (`folder`):**
   - `tailors`: **Công khai (Public)** - Khách hàng vãng lai gửi ảnh mẫu may đo không cần đăng nhập.
   - `avatars`: **Người dùng đăng nhập** - Yêu cầu Bearer Token của người dùng.
   - `products/originals`, `products/thumbnails`, `products/zooms`, `banners`, `videos/products`: **Yêu cầu quyền Admin / Staff (`ROLE_ADMIN`, `ROLE_STAFF`)**.
4. **Giới hạn định dạng & dung lượng:**
   - **Ảnh:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.svg` (Tối đa **15MB**).
   - **Video:** `.mp4`, `.mov`, `.webm`, `.mkv` (Tối đa **100MB**).

---

## 📐 1. Hệ Thống Kiểu Dữ Liệu TypeScript (TypeScript Interfaces)

Hãy copy trực tiếp các type/interface dưới đây vào `src/types/media.ts`:

```typescript
// ==============================================================================
// 1. ENUMS VÀ HẰNG SỐ PHÂN CẤP THƯ MỤC
// ==============================================================================

export type MediaFolderType =
  | "products/originals"   // Ảnh gốc sản phẩm chất lượng cao
  | "products/thumbnails"  // Ảnh thu nhỏ hiển thị danh sách sản phẩm
  | "products/zooms"       // Ảnh siêu nét phục vụ tính năng phóng to (Zoom)
  | "tailors"              // Ảnh mẫu thiết kế may đo do khách hoặc xưởng tải lên
  | "banners"              // Banner trang chủ, slider quảng cáo
  | "avatars"              // Ảnh đại diện của người dùng
  | "videos/products";     // Video quay cận cảnh trang phục thực tế

export type MediaType = "IMAGE" | "VIDEO";

// ==============================================================================
// 2. DATA MODELS & RESPONSE SCHEMAS
// ==============================================================================

export interface MediaResponse {
  id: number;
  filename: string;        // Tên file lưu trên đĩa (vd: "3a9f1b2c4d_hmong_hoa.jpg")
  url: string;             // Đường dẫn tương đối (vd: "uploads/products/originals/3a9f1b2c4d_hmong_hoa.jpg")
  folder: MediaFolderType; // Thư mục phân loại
  media_type: MediaType;   // "IMAGE" hoặc "VIDEO"
  file_type: string;       // MIME type (vd: "image/jpeg", "image/png", "video/mp4")
  file_size: number;       // Kích thước tệp (bytes)
  alt_text: string | null; // Văn bản thay thế hỗ trợ SEO & Accessibility
  created_at: string;      // ISO 8601 string
}

export interface MediaUpdatePayload {
  alt_text?: string;
}

export interface MediaQueryParams {
  folder?: string;         // Lọc theo thư mục (vd: "products/originals", "banners")
  media_type?: MediaType;  // Lọc "IMAGE" hoặc "VIDEO"
  skip?: number;
  limit?: number;          // Mặc định: 50, max: 100
}
```

---

## 🚀 2. Danh Sách Các Endpoint Module Media (`/api/v1/media`)

| Method | Endpoint | Content-Type | Quyền hạn | Mục đích sử dụng trên Frontend |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/media/upload` | `multipart/form-data` | Tùy thư mục | Tải lên file ảnh hoặc video |
| `GET` | `/api/v1/media/list` | - | Public | Lấy danh sách tệp media (Lọc theo thư mục, loại tệp) |
| `GET` | `/api/v1/media/{media_id}` | - | Public | Lấy thông tin chi tiết của 1 file media |
| `PUT` | `/api/v1/media/{media_id}` | `application/json` | Admin / Staff | Cập nhật `alt_text` của ảnh |
| `DELETE` | `/api/v1/media/{media_id}` | - | Admin / Staff | Xóa file media khỏi ổ cứng máy chủ và Database |

---

### 2.1. Upload tệp Media (`POST /api/v1/media/upload`)

- **Headers:** `Content-Type: multipart/form-data`
- **Xác thực:**
  - Nếu `folder = "tailors"`: Không cần Token (Khách vãng lai gửi ảnh mẫu may đo).
  - Nếu `folder = "avatars"`: Cần Bearer Token của người dùng.
  - Các thư mục khác: Cần Bearer Token tài khoản có vai trò `ROLE_ADMIN` hoặc `ROLE_STAFF`.
- **FormData Parameters:**
  - `file` (File, Bắt buộc): Tệp hình ảnh hoặc video từ máy khách.
  - `folder` (string, Mặc định: `"products/originals"`): Thư mục lưu trữ theo enum `MediaFolderType`.
  - `alt_text` (string, Tùy chọn): Mô tả hình ảnh.
- **Phản hồi thành công (HTTP 201 Created):**
  ```json
  {
    "id": 15,
    "filename": "f4c9a871d3e248b9_vay_hmong_hoa.jpg",
    "url": "uploads/products/originals/f4c9a871d3e248b9_vay_hmong_hoa.jpg",
    "folder": "products/originals",
    "media_type": "IMAGE",
    "file_type": "image/jpeg",
    "file_size": 2451024,
    "alt_text": "Váy H'Mông Hoa thêu hoa văn sáp ong",
    "created_at": "2026-11-13T07:50:00Z"
  }
  ```
- **Lỗi thường gặp:**
  - `400 Bad Request` (`UNSUPPORTED_FILE_TYPE`): Đuôi file không được hỗ trợ (chỉ nhận `.jpg, .jpeg, .png, .webp, .gif, .svg, .mp4, .mov, .webm, .mkv`).
  - `400 Bad Request` (`IMAGE_SIZE_EXCEEDED`): Ảnh vượt quá 15MB.
  - `400 Bad Request` (`VIDEO_SIZE_EXCEEDED`): Video vượt quá 100MB.
  - `401 Unauthorized`: Chưa đăng nhập khi upload vào thư mục yêu cầu tài khoản.
  - `403 Forbidden`: Tài khoản không đủ quyền Staff/Admin.

---

### 2.2. Lấy danh sách Media (`GET /api/v1/media/list`)

- **Xác thực:** Public.
- **Query Params:**
  - `folder` (string, optional): Lọc theo thư mục (`products/originals`, `banners`, `tailors`...).
  - `media_type` (string, optional): `IMAGE` hoặc `VIDEO`.
  - `skip` (integer, default: 0).
  - `limit` (integer, default: 50, max: 100).
- **Phản hồi (HTTP 200 OK):** Danh sách mảng `MediaResponse[]`.

---

### 2.3. Cập nhật Alt Text (`PUT /api/v1/media/{media_id}`)

- **Xác thực:** Bắt buộc (`ROLE_ADMIN` hoặc `ROLE_STAFF`).
- **Request Body:**
  ```json
  {
    "alt_text": "Mẫu trang phục phụ nữ H'Mông đen Sa Pa mùa lễ hội"
  }
  ```
- **Phản hồi (HTTP 200 OK):** Đối tượng `MediaResponse` đã cập nhật.

---

### 2.4. Xóa tệp Media (`DELETE /api/v1/media/{media_id}`)

- **Xác thực:** Bắt buộc (`ROLE_ADMIN` hoặc `ROLE_STAFF`).
- **Nghiệp vụ:** Backend sẽ xóa file vật lý trên ổ cứng (`uploads/...`) và xóa bản ghi trong bảng `media_files`.
- **Phản hồi (HTTP 204 No Content)**.

---

## 💻 3. Code Mẫu Tích Hợp Frontend (Media Upload Service & Component)

```typescript
import axios from "axios";
import { MediaFolderType, MediaQueryParams, MediaResponse } from "@/types/media";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
const STATIC_BASE_URL = process.env.NEXT_PUBLIC_STATIC_URL || "http://127.0.0.1:8000";

/**
 * Nối URL đầy đủ để hiển thị ảnh
 */
export const getFullMediaUrl = (relativePath: string | null | undefined): string => {
  if (!relativePath) return "/images/placeholder.png";
  if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
    return relativePath;
  }
  const clean = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return `${STATIC_BASE_URL}${clean}`;
};

export const mediaService = {
  /**
   * Upload tệp hình ảnh hoặc video
   */
  uploadFile: async (
    file: File,
    folder: MediaFolderType = "products/originals",
    altText?: string,
    token?: string
  ): Promise<MediaResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    if (altText) {
      formData.append("alt_text", altText);
    }

    const headers: Record<string, string> = {
      "Content-Type": "multipart/form-data",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await axios.post<MediaResponse>(`${API_BASE_URL}/media/upload`, formData, {
      headers,
    });
    return res.data;
  },

  /**
   * Danh sách tệp media
   */
  getMediaList: async (params?: MediaQueryParams): Promise<MediaResponse[]> => {
    const res = await axios.get<MediaResponse[]>(`${API_BASE_URL}/media/list`, { params });
    return res.data;
  },

  /**
   * Xóa tệp media (Admin / Staff)
   */
  deleteMedia: async (mediaId: number, token: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/media/${mediaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
```

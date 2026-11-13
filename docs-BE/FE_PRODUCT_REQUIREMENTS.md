# TÀI LIỆU ĐẶC TẢ THIẾT KẾ FRONTEND (FE REQUIREMENTS & SPECS)
## MODULE: SẢN PHẨM & QUẢN LÝ SẢN PHẨM (PRODUCTS & PRODUCT MANAGEMENT)
**Dự án:** Hmong Fashion (H'Mông May)  
**Phiên bản Backend:** FastAPI + SQLAlchemy 2.0  
**Tài liệu dành cho:** AI Agents, Lập trình viên Frontend (React, Next.js, Vue, Nuxt,...)

---

## 1. TỔNG QUAN & PHẠM VI NGHIỆP VỤ

Module Sản phẩm phục vụ 2 nhóm đối tượng người dùng chính:
1. **Khách hàng (Public / Customer):** Duyệt danh mục, tìm kiếm, xem chi tiết sản phẩm thổ cẩm H'Mông, xem giá mua đứt và giá thuê theo ngày, kiểm tra tình trạng còn hàng (`stock`).
2. **Quản trị viên & Nhân viên (Admin & Staff):** Quản lý toàn bộ vòng đời sản phẩm: Thêm mới, Chỉnh sửa thông tin, Bật/tắt trạng thái kinh doanh (`is_active`), Xóa mềm (Soft Delete) và Xóa vĩnh viễn (Hard Delete - chỉ Admin).

---

## 2. PHÂN QUYỀN TRUY CẬP (RBAC MATRIX)

| Hành động | Public / Guest | Staff (`ROLE_STAFF`) | Admin (`ROLE_ADMIN`) | Ghi chú kỹ thuật |
| :--- | :---: | :---: | :---: | :--- |
| **Xem danh sách sản phẩm** | ✅ | ✅ | ✅ | `GET /products/` (chỉ trả về `is_active=true`) |
| **Xem chi tiết sản phẩm** | ✅ | ✅ | ✅ | `GET /products/{id}` |
| **Upload ảnh sản phẩm** | ❌ | ✅ | ✅ | `POST /media/upload` (thư mục `products/originals`) |
| **Thêm mới sản phẩm** | ❌ | ✅ | ✅ | `POST /products/` |
| **Cập nhật thông tin** | ❌ | ✅ | ✅ | `PUT /products/{id}` |
| **Bật/Tắt trạng thái (`is_active`)** | ❌ | ✅ | ✅ | `PUT /products/{id}` với payload `{ "is_active": bool }` |
| **Xóa mềm (Soft Delete)** | ❌ | ✅ | ✅ | `DELETE /products/{id}` (chuyển `is_active=false`) |
| **Xóa vĩnh viễn (Hard Delete)** | ❌ | ❌ | ✅ | `DELETE /products/{id}/hard` (kiểm tra xung đột lịch thuê) |

---

## 3. TYPESCRIPT INTERFACES (DÀNH CHO AI & FE DEVELOPER)

```typescript
// ==========================================
// 1. Enums & Danh mục
// ==========================================
export type ProductCategory = 'TRADITIONAL' | 'MODERN' | 'ACCESSORIES' | string;

// ==========================================
// 2. Hình ảnh sản phẩm (Product Image)
// ==========================================
export interface ProductImage {
  id: number;
  media_id: number | null;
  image_url: string;
  display_order: number;
  is_primary: boolean;
}

// ==========================================
// 3. Thông tin sản phẩm đầy đủ (Response)
// ==========================================
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;                 // Giá bán đứt (VNĐ)
  rental_price_per_day: number;  // Giá cho thuê mỗi ngày (VNĐ)
  stock: number;                 // Số lượng tồn kho
  category: ProductCategory;
  primary_media_id: number | null;
  primary_image_url: string | null;
  is_active: boolean;            // Tình trạng kinh doanh (true: hiện, false: ẩn)
  created_at: string;            // ISO 8601 UTC
  images: ProductImage[];
}

// ==========================================
// 4. Payload tạo mới sản phẩm
// ==========================================
export interface ProductCreatePayload {
  name: string;                          // 2 - 200 ký tự (Bắt buộc)
  slug?: string;                         // Max 220 ký tự (Tùy chọn, backend tự sinh nếu null)
  description?: string;                  // Tùy chọn
  price?: number;                        // >= 0, mặc định 0.0
  rental_price_per_day?: number;         // >= 0, mặc định 0.0
  stock?: number;                        // >= 0, mặc định 0
  category?: ProductCategory;            // Mặc định "TRADITIONAL"
  primary_media_id?: number | null;      // ID ảnh đại diện từ module Media
  primary_image_url?: string | null;     // URL ảnh đại diện trực tiếp
  image_media_ids?: number[];            // Danh sách ID ảnh phụ từ module Media
}

// ==========================================
// 5. Payload cập nhật sản phẩm
// ==========================================
export interface ProductUpdatePayload {
  name?: string;
  slug?: string;
  description?: string | null;
  price?: number;
  rental_price_per_day?: number;
  stock?: number;
  category?: ProductCategory;
  primary_media_id?: number | null;
  primary_image_url?: string | null;
  is_active?: boolean;
}

// ==========================================
// 6. Response upload Media
// ==========================================
export interface MediaUploadResponse {
  id: number;
  filename: string;
  url: string;
  folder: string;
  media_type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  file_size: number;
  mime_type: string;
  alt_text?: string | null;
  created_at: string;
}

// ==========================================
// 7. Cấu trúc phản hồi lỗi chuẩn (Standard Backend Error)
// ==========================================
export interface ErrorDetail {
  field?: string;
  location?: string;
  message: string;
  type?: string;
}

export interface AppErrorResponse {
  success: boolean;        // Luôn là false khi gặp lỗi
  status_code: number;
  error_code: string;      // VALIDATION_ERROR, NOT_FOUND, CONFLICT,...
  message: string;
  detail?: string;
  details?: ErrorDetail[];
  timestamp: string;
  path: string;
}
```

---

## 4. CHI TIẾT CÁC ENDPOINT API

### 4.1. Lấy danh sách sản phẩm (Public List)
* **Phương thức:** `GET`
* **Đường dẫn:** `/products/`
* **Xác thực:** Không bắt buộc.
* **Query Parameters:**
  * `category` *(string, optional)*: Lọc theo danh mục (`TRADITIONAL`, `MODERN`, `ACCESSORIES`).
  * `search` *(string, optional)*: Tìm kiếm theo tên sản phẩm (case-insensitive substring).
  * `skip` *(int, default=0, ge=0)*: Số bản ghi bỏ qua (phân trang).
  * `limit` *(int, default=50, ge=1, le=100)*: Số bản ghi tối đa trên một trang.
* **Success Response:** `200 OK` $\rightarrow$ `Product[]`

### 4.2. Lấy chi tiết sản phẩm
* **Phương thức:** `GET`
* **Đường dẫn:** `/products/{product_id}`
* **Xác thực:** Không bắt buộc.
* **Success Response:** `200 OK` $\rightarrow$ `Product`
* **Error Response:** `404 Not Found` nếu ID không tồn tại.

### 4.3. Upload hình ảnh sản phẩm (Media Integration)
* **Phương thức:** `POST`
* **Đường dẫn:** `/media/upload`
* **Xác thực:** Bắt buộc Bearer Token (`ROLE_ADMIN` hoặc `ROLE_STAFF`).
* **Content-Type:** `multipart/form-data`
* **Form Fields:**
  * `file`: Tệp nhị phân ảnh (`.jpg`, `.jpeg`, `.png`, `.webp`).
  * `folder`: Giá trị bắt buộc truyền là `"products/originals"`.
  * `alt_text`: Mô tả thẻ alt ảnh (tùy chọn).
* **Success Response:** `201 Created` $\rightarrow$ `MediaUploadResponse`.

### 4.4. Thêm mới sản phẩm
* **Phương thức:** `POST`
* **Đường dẫn:** `/products/`
* **Xác thực:** Bắt buộc Bearer Token (`ROLE_ADMIN` hoặc `ROLE_STAFF`).
* **Content-Type:** `application/json`
* **Body:** `ProductCreatePayload`
* **Success Response:** `201 Created` $\rightarrow$ `Product`

### 4.5. Cập nhật thông tin sản phẩm
* **Phương thức:** `PUT`
* **Đường dẫn:** `/products/{product_id}`
* **Xác thực:** Bắt buộc Bearer Token (`ROLE_ADMIN` hoặc `ROLE_STAFF`).
* **Content-Type:** `application/json`
* **Body:** `ProductUpdatePayload`
* **Success Response:** `200 OK` $\rightarrow$ `Product`

### 4.6. Xóa mềm sản phẩm (Ẩn khỏi shop)
* **Phương thức:** `DELETE`
* **Đường dẫn:** `/products/{product_id}`
* **Xác thực:** Bắt buộc Bearer Token (`ROLE_ADMIN` hoặc `ROLE_STAFF`).
* **Cơ chế Backend:** Đổi `is_active = False` (không xóa dòng trong DB).
* **Success Response:** `204 No Content` (Empty body).

### 4.7. Xóa vĩnh viễn sản phẩm (Hard Delete)
* **Phương thức:** `DELETE`
* **Đường dẫn:** `/products/{product_id}/hard`
* **Xác thực:** **Chỉ dành cho `ROLE_ADMIN`**.
* **Cơ chế Backend:** Xóa dòng sản phẩm và toàn bộ bản ghi `product_images`. Sẽ từ chối nếu sản phẩm có liên kết lịch thuê.
* **Success Response:** `204 No Content`
* **Xung đột nghiệp vụ (`409 Conflict`):**
  * Mã lỗi: `PRODUCT_HAS_ACTIVE_RENTALS`
  * Thông điệp: *"Không thể xóa vĩnh viễn sản phẩm vì đang có lịch thuê hoạt động (Mã lịch thuê: #...)"*.

---

## 5. THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX SPECS)

### 5.1. Màn hình Quản lý Sản phẩm (Admin/Staff Dashboard)
* **Data Table:**
  * **Cột 1: Ảnh thumbnail** (Kích thước 48x48px, bo góc, click để phóng to).
  * **Cột 2: Tên sản phẩm & Slug** (Tên in đậm, slug in nghiêng màu xám).
  * **Cột 3: Danh mục** (Tag Badge: `TRADITIONAL` - Xanh ngọc, `MODERN` - Tím, `ACCESSORIES` - Cam).
  * **Cột 4: Giá bán lẻ** (Định dạng tiền tệ VNĐ, ví dụ `1,250,000 đ`).
  * **Cột 5: Giá thuê/ngày** (Định dạng `150,000 đ/ngày`).
  * **Cột 6: Tồn kho** (Số nguyên. Nếu `stock == 0` hiển thị Badge đỏ "Hết hàng", nếu `< 5` hiển thị cảnh báo vàng).
  * **Cột 7: Tình trạng (`is_active`)** (Component Toggle Switch. Xanh lá: "Đang bán", Xám: "Tạm ẩn").
  * **Cột 8: Hành động:**
    * Nút Xem chi tiết (Icon con mắt).
    * Nút Chỉnh sửa (Icon bút chì).
    * Nút Ẩn / Xóa mềm (Icon thùng rác vàng).
    * Nút Xóa vĩnh viễn (Icon cảnh báo đỏ - Chỉ hiển thị cho Quản trị viên).
* **Bộ lọc và Tìm kiếm:**
  * Search Input có icon kính lúp, tính năng debounce (300ms) trước khi kích hoạt API call.
  * Dropdown Select chọn Danh mục (Tất cả, Truyền thống, Cách tân, Phụ kiện).
  * Nút CTA **"+ Thêm sản phẩm mới"** nổi bật ở góc trên bên phải.
* **Phân trang:**
  * Hiển thị số dòng trên trang (10, 25, 50).
  * Nút Previous / Next trang.

### 5.2. Modal / Form Thêm mới Sản phẩm
* **Bố cục form (Grid 2 cột):**
  * **Cột trái - Thông tin văn bản:**
    * `Tên sản phẩm` (Text input, bắt buộc, placeholder: "Váy thổ cẩm H'Mông Hoa thêu tay...").
    * `Đường dẫn thân thiện (Slug)` (Text input, tự động biến đổi từ Tên sản phẩm, ví dụ: "vay-tho-cam-hmong-hoa-theu-tay").
    * `Danh mục` (Select dropdown).
    * Hàng ngang 3 ô số:
      * `Giá bán (VNĐ)` (Number input, định dạng phân cách hàng nghìn).
      * `Giá thuê/ngày (VNĐ)` (Number input).
      * `Số lượng tồn kho` (Number stepper).
    * `Mô tả chi tiết` (Rich Text Editor hoặc Textarea hỗ trợ định dạng đoạn văn, chất liệu, hướng dẫn giặt).
  * **Cột phải - Quản lý hình ảnh:**
    * Khu vực **Ảnh đại diện chính (Primary Image):** Hộp Dropzone kéo thả ảnh. Khi chọn ảnh, hiển thị preview ngay lập tức, có thanh tiến độ upload và nút "Đổi ảnh".
    * Khu vực **Bộ sưu tập ảnh phụ (Gallery Images):** Hỗ trợ kéo thả chọn nhiều ảnh cùng lúc, hiển thị danh sách thẻ ảnh thumbnail có nút xóa và icon kéo thả sắp xếp thứ tự hiển thị (`display_order`).
* **Validation & Phản hồi UI:**
  * Báo lỗi đỏ ngay dưới ô nhập nếu tên < 2 ký tự hoặc để trống.
  * Nút "Tạo sản phẩm" chuyển sang trạng thái disabled + loading khi đang thực hiện request.

### 5.3. Modal / Form Chỉnh sửa Sản phẩm
* Fetch chi tiết từ `GET /products/{id}` và pre-populate toàn bộ dữ liệu vào form.
* Hỗ trợ cập nhật từng trường hoặc toàn bộ.
* Chế độ **Dirty State Check:** Nếu người dùng đã gõ thay đổi mà bấm đóng Modal hoặc rời trang, hiển thị dialog xác nhận: *"Bạn có thay đổi chưa lưu. Bạn có chắc muốn thoát?"*.

### 5.4. Thao tác Cập nhật Tình trạng (`is_active`)
* Áp dụng **Optimistic Update**:
  * Khi người dùng gạt Toggle Switch trên bảng: UI đổi màu ngay lập tức.
  * Gửi ngầm request `PUT /products/{id}` với body `{ "is_active": new_state }`.
  * Nếu thành công: Hiển thị Toast nhỏ góc phải: *"Cập nhật trạng thái thành công"*.
  * Nếu thất bại: Revert lại vị trí switch và hiển thị Toast lỗi đỏ.

### 5.5. Dialog Xác nhận Xóa sản phẩm
1. **Xác nhận Xóa mềm (Soft Delete):**
   * Tiêu đề: "Ẩn sản phẩm khỏi cửa hàng"
   * Nội dung: *"Sản phẩm sẽ không còn hiển thị với khách mua hàng nhưng vẫn được lưu lại trong lịch sử hệ thống. Bạn có muốn tiếp tục?"*
   * Nút bấm: "Hủy" và "Xác nhận ẩn".
2. **Xác nhận Xóa vĩnh viễn (Hard Delete - Danger Modal):**
   * Tiêu đề (Màu đỏ): "CẢNH BÁO: XÓA VĨNH VIỄN SẢN PHẨM"
   * Nội dung: *"Hành động này sẽ xóa hoàn toàn sản phẩm và các ảnh liên quan khỏi cơ sở dữ liệu. Thao tác này KHÔNG THỂ HOÀN TÁC."*
   * Xác thực an toàn: Yêu cầu người dùng nhập chữ `"DELETE"` hoặc nhập đúng tên sản phẩm vào ô xác nhận trước khi nút "Xóa vĩnh viễn" kích hoạt.
   * Xử lý lỗi `409`: Nếu backend trả về mã `PRODUCT_HAS_ACTIVE_RENTALS`, hiển thị Modal cảnh báo: *"Không thể xóa: Sản phẩm đang nằm trong hợp đồng thuê trang phục chưa hoàn tất. Vui lòng kiểm tra lại module Cho thuê!"*.

---

## 6. QUY TẮC HIỂN THỊ LỖI (ERROR HANDLING CHO FE)

Tất cả phản hồi lỗi từ Backend tuân theo chuẩn `AppErrorResponse`. FE cần xử lý thống nhất như sau:

1. **Lỗi 422 Unprocessable Entity (Validate Form Thất bại):**
   * Duyệt qua mảng `details`:
     * Đọc trường `field` (ví dụ: `name`, `price`).
     * Hiển thị dòng chữ thông báo đỏ `message` ngay dưới ô input tương ứng.
2. **Lỗi 401 Unauthorized:**
   * Token hết hạn hoặc chưa đăng nhập $\rightarrow$ Xóa token local/cookie và chuyển hướng về màn hình `/login`.
3. **Lỗi 403 Forbidden:**
   * Hiển thị Toast cảnh báo: *"Bạn không có quyền thực hiện hành động này. Yêu cầu quyền Quản trị viên/Nhân viên."*
4. **Lỗi 404 Not Found:**
   * Hiển thị trang hoặc thông báo: *"Không tìm thấy thông tin sản phẩm hoặc sản phẩm đã bị xóa."*
5. **Lỗi 409 Conflict:**
   * Hiển thị Modal/Alert thông báo xung đột dữ liệu nghiệp vụ (ví dụ: đang có lịch thuê).
6. **Lỗi 500 Internal Server Error:**
   * Hiển thị Toast thông báo: *"Đã xảy ra lỗi máy chủ, vui lòng thử lại sau giây lát."*

---

## 7. GỢI Ý CẤU TRÚC CODE FRONTEND (REACT / NEXT.JS)

```text
src/
├── features/products/
│   ├── api/
│   │   ├── get-products.ts          # useQuery hook gọi GET /products/
│   │   ├── get-product.ts           # useQuery hook gọi GET /products/{id}
│   │   ├── create-product.ts        # useMutation hook gọi POST /products/
│   │   ├── update-product.ts        # useMutation hook gọi PUT /products/{id}
│   │   ├── delete-product.ts        # useMutation hook gọi DELETE /products/{id}
│   │   └── hard-delete-product.ts   # useMutation hook gọi DELETE /products/{id}/hard
│   ├── components/
│   │   ├── product-table.tsx        # Bảng danh sách sản phẩm quản trị
│   │   ├── product-status-switch.tsx# Switch toggle is_active
│   │   ├── product-form-modal.tsx   # Form modal Thêm / Sửa sản phẩm
│   │   ├── product-image-uploader.tsx# Component upload ảnh tích hợp /media/upload
│   │   ├── product-delete-dialog.tsx# Dialog xác nhận xóa mềm
│   │   └── product-hard-delete-dialog.tsx # Danger dialog xóa vĩnh viễn
│   ├── types/
│   │   └── index.ts                 # Chứa toàn bộ TypeScript interfaces ở Mục 3
│   └── pages/
│       ├── products-page.tsx        # Trang quản lý sản phẩm Admin
│       └── product-detail-page.tsx  # Trang chi tiết sản phẩm Client
```

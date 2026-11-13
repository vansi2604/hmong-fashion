# Bộ Tài Liệu Đặc Tả API H'Mông May (Hmong Fashion Backend API Documentation)

> **Dành cho:** AI Coding Assistants (ChatGPT, Claude, Cursor, Copilot) & Lập trình viên Frontend (React, Next.js, Vue, Nuxt, Flutter, React Native).
> **Backend Framework:** FastAPI, SQLAlchemy 2.0, Redis, Python 3.12+.

---

## 🗂️ Mục Lục Các Module API Đầy Đủ

Hệ thống Backend được kiến trúc theo dạng **Feature-based (Module hóa theo nghiệp vụ)**. Dưới đây là danh sách toàn bộ các tài liệu đặc tả chi tiết của từng module:

| Module | Tên Tài Liệu Đặc Tả | Mô tả chức năng chính | Trạng thái |
| :--- | :--- | :--- | :---: |
| **Orders** | [order_api.md](order_api.md) | Đặt hàng (mua/thuê/may đo), thanh toán COD/VNPay, tra cứu công khai `HMOOB-...`, hủy đơn | ✅ Hoàn thành |
| **Auth** | [auth_api.md](auth_api.md) | Đăng ký, đăng nhập, JWT Token (Access & Refresh), hồ sơ cá nhân `/me`, đổi mật khẩu, phân quyền RBAC | ✅ Hoàn thành |
| **Products** | [products_api.md](products_api.md) | Danh mục sản phẩm, bộ sưu tập ảnh, giá bán lẻ, giá thuê/ngày, tìm kiếm & lọc, Admin CRUD | ✅ Hoàn thành |
| **Rentals** | [rentals_api.md](rentals_api.md) | Cho thuê trang phục, kiểm tra trùng lịch, cơ chế giữ chỗ tạm thời bằng Redis Lock, quản lý tiền cọc | ✅ Hoàn thành |
| **Tailors** | [tailors_api.md](tailors_api.md) | May đo theo yêu cầu, tiếp nhận thông số 3 vòng JSON, ảnh mẫu thiết kế, theo dõi tiến độ xưởng | ✅ Hoàn thành |
| **Media** | [media_api.md](media_api.md) | Quản lý media tập trung, upload ảnh/video phân cấp (`products`, `tailors`, `avatars`, `banners`) | ✅ Hoàn thành |
| **System** | [system_api.md](system_api.md) | Health check máy chủ, Root info, cấu hình CORS & Bảng mã lỗi định danh toàn hệ thống (Master Error Dictionary) | ✅ Hoàn thành |

---

## 🌐 1. Quy Ước Máy Chủ & Môi Trường Phát Triển

- **Host cục bộ mặc định:** `http://127.0.0.1:8000`
- **Prefix phiên bản API:** `/api/v1`
- **Đường dẫn Swagger UI (Interactive Docs):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Đường dẫn Static Files Media:** `http://127.0.0.1:8000/uploads/{path}`
- **Cấu hình biến môi trường Frontend khuyến nghị:**
  ```env
  NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
  NEXT_PUBLIC_STATIC_URL=http://127.0.0.1:8000
  ```

---

## 🔐 2. Chuẩn Xác Thực (Authentication & Security)

Hệ thống dùng chuẩn **JSON Web Token (JWT Bearer Token)**:
- Sau khi gọi `POST /api/v1/auth/login`, Client nhận được:
  - `access_token` (Hết hạn sau 24 giờ trên môi trường dev).
  - `refresh_token` (Hết hạn sau 30 ngày).
- Mọi request cần quyền đăng nhập gửi kèm Header:
  ```http
  Authorization: Bearer <access_token>
  ```
- **Tài khoản mặc định sẵn có trong hệ thống:**
  - **Quản trị viên (Admin):** Username: `admin` | Mật khẩu: `Admin@123456` (`ROLE_ADMIN`)
  - **Nhân viên (Staff):** Username: `nhanvien1` | Mật khẩu: `Staff@123456` (`ROLE_STAFF`)

---

## ⚠️ 3. Cấu Trúc Báo Lỗi Chuẩn Toàn Hệ Thống (Standard Error Response)

Mọi phản hồi lỗi (HTTP status `400`, `401`, `403`, `404`, `409`, `422`, `500`) đều trả về JSON đồng nhất:

```json
{
  "success": false,
  "status_code": 400,
  "error_code": "MISSING_CONTACT_INFO",
  "message": "Thông điệp lỗi chi tiết thân thiện với người dùng",
  "detail": "Thông điệp lỗi chi tiết thân thiện với người dùng",
  "details": [
    {
      "field": "customer_phone",
      "location": "body",
      "message": "Trường 'customer_phone' là bắt buộc.",
      "type": "missing"
    }
  ],
  "timestamp": "2026-11-13T07:20:00Z",
  "path": "/api/v1/orders/"
}
```

> **Gợi ý xử lý trên Frontend:**
> Khi bắt lỗi Axios (`error: AxiosError`), ưu tiên hiển thị toast với:
> `error.response?.data?.message || error.response?.data?.detail || "Đã xảy ra lỗi"`.

---

## 💡 4. Gợi Ý Prompts Mẫu Đưa Cho AI Lập Trình Frontend

### 🟢 Prompt 1: Viết module xác thực & lưu token
> *"Tôi đang lập trình Frontend Next.js / React cho dự án H'Mông Fashion. Dưới đây là tài liệu API của module Xác thực (Auth). Hãy đọc kỹ tài liệu này và viết giúp tôi: 1/ Thiết lập Axios Interceptor tự động refresh token khi nhận 401; 2/ Form Đăng nhập & Đăng ký đẹp mắt (Tailwind CSS); 3/ Context / Zustand store quản lý state User và Profile. [Dán nội dung docs/auth_api.md vào]"*

### 🟢 Prompt 2: Viết trang Danh mục & Chi tiết sản phẩm
> *"Dưới đây là tài liệu API module Sản phẩm (Products). Hãy tạo trang danh sách sản phẩm có bộ lọc theo danh mục, tìm kiếm theo tên, phân trang, và trang chi tiết sản phẩm hiển thị bộ sưu tập ảnh và nút Đặt mua / Đặt thuê. [Dán nội dung docs/products_api.md vào]"*

### 🟢 Prompt 3: Viết tính năng Đặt thuê & Lịch trống
> *"Dưới đây là tài liệu API module Cho thuê (Rentals). Hãy viết Component chọn khoảng ngày thuê (DateRangePicker) tự động gọi API check-availability và form đặt thuê xử lý trường hợp bị khóa giữ chỗ (429 RENTAL_SLOT_LOCKED). [Dán nội dung docs/rentals_api.md vào]"*

### 🟢 Prompt 4: Viết tính năng May đo theo yêu cầu
> *"Dưới đây là tài liệu API module May đo (Tailors) và Media (Media). Hãy viết Form cho khách hàng chọn mẫu thiết kế, upload ảnh mẫu tùy chọn, nhập số đo chiều cao/cân nặng/3 vòng và gửi yêu cầu may đo lên hệ thống. [Dán nội dung docs/tailors_api.md và docs/media_api.md vào]"*

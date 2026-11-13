# Tài Liệu API Hệ Thống & Bảng Mã Lỗi Toàn Cục (System & Error Dictionary Specification)

> **Mục đích tài liệu:** Tài liệu này cung cấp đặc tả cho các endpoint kiểm tra trạng thái máy chủ (Health Check, Root info), cấu hình CORS, danh sách biến môi trường chuẩn Frontend và **Bảng mã lỗi định danh toàn cục (Master Error Dictionary)** của hệ thống H'Mông Fashion giúp AI / lập trình viên FE map trực tiếp mã lỗi sang thông báo đa ngôn ngữ / toast thông báo.

---

## 📌 Hướng dẫn dành cho AI Lập trình Frontend (AI Prompting Context)

1. **Kiểm tra trạng thái hệ thống (Health Check):**
   - Trước khi thực hiện các tác vụ quan trọng hoặc khi app khởi động, FE có thể gọi `GET /api/v1/health` để kiểm tra máy chủ backend có đang hoạt động hay đang bảo trì.
2. **Cấu hình CORS (Cross-Origin Resource Sharing):**
   - Backend đã mở CORS cho các domain: `http://localhost:3000`, `http://127.0.0.1:3000` (hoặc cấu hình qua biến `CORS_ORIGINS`).
   - Hỗ trợ đầy đủ các methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`.
3. **Mã lỗi định danh (`error_code`):**
   - Thay vì kiểm tra chuỗi message thay đổi theo ngôn ngữ, FE **bắt buộc** phải dựa vào trường `error_code` để phân nhánh xử lý (ví dụ: `TOKEN_INVALID_OR_EXPIRED` -> redirect đăng nhập; `RENTAL_SLOT_LOCKED` -> thông báo chờ 5 phút...).

---

## 🚀 1. Danh Sách Endpoint Hệ Thống (System Endpoints)

| Method | Endpoint | Xác thực | Mục đích sử dụng trên Frontend |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Thông tin phiên bản & danh sách các module đang mở |
| `GET` | `/health` hoặc `/api/v1/health` | Public | Health check kiểm tra máy chủ sống/chết (dùng cho status indicator hoặc load balancer) |

---

### 1.1. Health Check Endpoint (`GET /api/v1/health`)

- **Đường dẫn:** `GET /health` hoặc `GET /api/v1/health`
- **Xác thực:** Không (Public).
- **Phản hồi thành công (HTTP 200 OK):**
  ```json
  {
    "status": "healthy",
    "app_name": "Hmong Fashion API",
    "environment": "development"
  }
  ```

---

### 1.2. Root Information (`GET /`)

- **Đường dẫn:** `GET /`
- **Xác thực:** Không (Public).
- **Phản hồi thành công (HTTP 200 OK):**
  ```json
  {
    "message": "Welcome to Hmong Fashion API",
    "version": "0.1.0",
    "docs": "/docs",
    "modules": [
      "auth",
      "admin",
      "media",
      "products",
      "rentals",
      "tailors",
      "orders"
    ]
  }
  ```

---

## 📖 2. Bảng Tra Cứu Mã Lỗi Toàn Hệ Thống (Master Error Dictionary)

Dưới đây là danh sách đầy đủ tất cả các `error_code` được định nghĩa trong hệ thống Backend:

### 2.1. Nhóm Xác Thực & Phân Quyền (Auth & RBAC)

| Mã lỗi (`error_code`) | HTTP Status | Ý nghĩa nghiệp vụ | Hướng xử lý trên Frontend |
| :--- | :---: | :--- | :--- |
| `MISSING_CREDENTIALS` | 400 | Thiếu tài khoản hoặc mật khẩu | Yêu cầu người dùng điền đầy đủ form |
| `INVALID_CREDENTIALS` | 401 | Tên đăng nhập/email hoặc mật khẩu không chính xác | Hiển thị: "Tài khoản hoặc mật khẩu không đúng" |
| `TOKEN_MISSING` | 401 | Request không có Authorization Bearer Token | Chuyển hướng sang trang `/login` |
| `TOKEN_INVALID_OR_EXPIRED` | 401 | Access token hết hạn hoặc giả mạo | Kích hoạt Silent Refresh Token |
| `TOKEN_PAYLOAD_INVALID` | 401 | Token không chứa thông tin định danh `sub` | Xóa token và yêu cầu đăng nhập lại |
| `REFRESH_TOKEN_INVALID_OR_EXPIRED`| 401 | Refresh token đã bị thu hồi hoặc hết hạn 30 ngày | Xóa LocalStorage và chuyển trang `/login` |
| `ACCOUNT_INACTIVE` | 403 | Tài khoản chưa kích hoạt hoặc bị khóa | Thông báo: "Tài khoản của bạn đang bị khóa" |
| `INSUFFICIENT_ROLE` | 403 | Thiếu vai trò yêu cầu (ví dụ: cần `ROLE_ADMIN`) | Hiển thị thông báo quyền truy cập bị từ chối |
| `INSUFFICIENT_PERMISSIONS` | 403 | Thiếu quyền thao tác trên tài nguyên | Không cho phép thực hiện hành động |
| `USERNAME_ALREADY_EXISTS` | 409 | Tên đăng nhập đã có người đăng ký | Báo lỗi tại ô input `username` |
| `EMAIL_ALREADY_EXISTS` | 409 | Email đã được sử dụng | Báo lỗi tại ô input `email` |
| `PHONE_ALREADY_EXISTS` | 409 | Số điện thoại đã được đăng ký | Báo lỗi tại ô input `phone` |
| `USER_NOT_FOUND` | 404 | Không tìm thấy người dùng | Thông báo người dùng không tồn tại |

---

### 2.2. Nhóm Sản Phẩm (Products)

| Mã lỗi (`error_code`) | HTTP Status | Ý nghĩa nghiệp vụ | Hướng xử lý trên Frontend |
| :--- | :---: | :--- | :--- |
| `PRODUCT_NOT_FOUND` | 404 | Không tìm thấy sản phẩm theo ID | Hiển thị trang 404 Not Found hoặc quay về Catalog |
| `CATEGORY_NOT_FOUND` | 404 | Danh mục không tồn tại | Reset bộ lọc danh mục |

---

### 2.3. Nhóm Cho Thuê Trang Phục (Rentals)

| Mã lỗi (`error_code`) | HTTP Status | Ý nghĩa nghiệp vụ | Hướng xử lý trên Frontend |
| :--- | :---: | :--- | :--- |
| `INVALID_DATE_RANGE` | 400 | Ngày bắt đầu lớn hơn ngày kết thúc | Báo lỗi trên DateRangePicker |
| `PRODUCT_NOT_FOR_RENT` | 400 | Sản phẩm không hỗ trợ thuê hoặc giá thuê = 0 | Ẩn nút "Đặt thuê" |
| `RENTAL_NOT_FOUND` | 404 | Không tìm thấy đơn thuê theo ID hoặc mã | Báo: "Không tìm thấy thông tin đơn thuê" |
| `RENTAL_SCHEDULE_CONFLICT` | 409 | Đã có người đặt thuê trong khoảng ngày này | Đổi màu đỏ các ngày trùng trên DatePicker |
| `RENTAL_SLOT_LOCKED` | 429 | Đang có người giữ chỗ thanh toán bằng Redis Lock | Thông báo: "Khung giờ đang có người giữ chỗ, vui lòng thử lại sau 5 phút" |

---

### 2.4. Nhóm May Đo Theo Yêu Cầu (Tailors)

| Mã lỗi (`error_code`) | HTTP Status | Ý nghĩa nghiệp vụ | Hướng xử lý trên Frontend |
| :--- | :---: | :--- | :--- |
| `MISSING_MEASUREMENTS` | 400 | Chưa nhập chiều cao hoặc bất kỳ số đo nào | Focus vào ô nhập chiều cao / số đo |
| `TAILOR_ORDER_NOT_FOUND` | 404 | Không tìm thấy đơn may đo theo ID hoặc mã | Thông báo mã đơn không tồn tại |
| `TAILOR_ORDER_CANNOT_BE_CANCELLED` | 400 | Đơn may đã xác nhận hoặc đang may, khách không thể tự hủy | Hiển thị popup số hotline hỗ trợ |

---

### 2.5. Nhóm Đơn Hàng & Thanh Toán (Orders)

| Mã lỗi (`error_code`) | HTTP Status | Ý nghĩa nghiệp vụ | Hướng xử lý trên Frontend |
| :--- | :---: | :--- | :--- |
| `MISSING_CONTACT_INFO` | 400 | Khách vãng lai thiếu họ tên, SĐT hoặc địa chỉ | Bắt buộc người dùng điền đủ form nhận hàng |
| `INVALID_ORDER_TYPE` | 400 | Loại đơn không hợp lệ (`BUY, RENT, TAILOR`) | Kiểm tra lại giá trị gửi lên |
| `INVALID_PAYMENT_METHOD` | 400 | Phương thức thanh toán không hợp lệ | Kiểm tra lại option chọn thanh toán |
| `ORDER_NOT_FOUND` | 404 | Không tìm thấy đơn hàng | Thông báo mã đơn hàng không tồn tại |
| `ORDER_CANNOT_BE_CANCELLED` | 400 | Đơn hàng đã sang trạng thái xử lý/vận chuyển | Không cho phép tự hủy, yêu cầu liên hệ shop |

---

### 2.6. Nhóm Media & Tải Lên Tệp (Media)

| Mã lỗi (`error_code`) | HTTP Status | Ý nghĩa nghiệp vụ | Hướng xử lý trên Frontend |
| :--- | :---: | :--- | :--- |
| `UNSUPPORTED_FILE_TYPE` | 400 | Đuôi tệp không được hỗ trợ | Validate đuôi file ở client trước khi gửi |
| `IMAGE_SIZE_EXCEEDED` | 400 | Dung lượng ảnh vượt quá 15MB | Nén ảnh ở client trước khi upload |
| `VIDEO_SIZE_EXCEEDED` | 400 | Dung lượng video vượt quá 100MB | Cảnh báo tệp quá lớn |
| `MEDIA_NOT_FOUND` | 404 | Không tìm thấy tệp media | Hiển thị placeholder image |

---

### 2.7. Lỗi Chung Hệ Thống (General Validation & Server Errors)

| Mã lỗi (`error_code`) | HTTP Status | Ý nghĩa nghiệp vụ |
| :--- | :---: | :--- |
| `VALIDATION_ERROR` | 422 | Lỗi validate dữ liệu đầu vào Pydantic (Xem chi tiết trong mảng `details`) |
| `BAD_REQUEST` | 400 | Yêu cầu cú pháp không hợp lệ |
| `METHOD_NOT_ALLOWED` | 405 | Method HTTP không hỗ trợ trên endpoint này |
| `INTERNAL_SERVER_ERROR`| 500 | Lỗi máy chủ chưa được xử lý |

---

## 💻 3. Code Mẫu Trợ Giúp Map Mã Lỗi Trên Frontend (`src/utils/errorHandler.ts`)

```typescript
import { ApiErrorResponse } from "@/types/order";

/**
 * Bản đồ thông báo tiếng Việt theo mã lỗi định danh
 */
export const ERROR_MESSAGES: Record<string, string> = {
  MISSING_CREDENTIALS: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.",
  INVALID_CREDENTIALS: "Tên đăng nhập hoặc mật khẩu không chính xác.",
  TOKEN_MISSING: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  TOKEN_INVALID_OR_EXPIRED: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.",
  ACCOUNT_INACTIVE: "Tài khoản của bạn hiện đang bị khóa.",
  INSUFFICIENT_ROLE: "Bạn không có quyền quản trị để thực hiện hành động này.",
  USERNAME_ALREADY_EXISTS: "Tên đăng nhập này đã được sử dụng.",
  EMAIL_ALREADY_EXISTS: "Địa chỉ email này đã được sử dụng.",
  PHONE_ALREADY_EXISTS: "Số điện thoại này đã được sử dụng.",
  MISSING_CONTACT_INFO: "Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.",
  PRODUCT_NOT_FOUND: "Sản phẩm không tồn tại hoặc đã ngừng kinh doanh.",
  RENTAL_SCHEDULE_CONFLICT: "Trang phục đã có người đặt thuê trong khoảng thời gian này.",
  RENTAL_SLOT_LOCKED: "Khung giờ này đang có người giữ chỗ thanh toán. Vui lòng thử lại sau 5 phút.",
  TAILOR_ORDER_CANNOT_BE_CANCELLED: "Đơn may đã được xưởng tiếp nhận xử lý, không thể tự hủy. Vui lòng liên hệ hotline.",
  ORDER_CANNOT_BE_CANCELLED: "Đơn hàng đang xử lý hoặc đang giao, không thể tự hủy.",
  IMAGE_SIZE_EXCEEDED: "Ảnh tải lên vượt quá dung lượng tối đa cho phép (15MB).",
  VIDEO_SIZE_EXCEEDED: "Video tải lên vượt quá dung lượng tối đa cho phép (100MB).",
  UNSUPPORTED_FILE_TYPE: "Định dạng tệp không được hỗ trợ.",
  VALIDATION_ERROR: "Dữ liệu nhập vào chưa đúng định dạng. Vui lòng kiểm tra lại các trường.",
  INTERNAL_SERVER_ERROR: "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.",
};

/**
 * Hàm phân tích và trả về thông báo lỗi thân thiện cho Toast
 */
export const getFriendlyErrorMessage = (errorResponse?: ApiErrorResponse): string => {
  if (!errorResponse) return "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";

  // 1. Ưu tiên tra cứu theo mã lỗi định danh chuẩn
  if (errorResponse.error_code && ERROR_MESSAGES[errorResponse.error_code]) {
    return ERROR_MESSAGES[errorResponse.error_code];
  }

  // 2. Lấy thông báo do backend trả về trực tiếp
  if (errorResponse.message) return errorResponse.message;
  if (errorResponse.detail) return errorResponse.detail;

  return "Yêu cầu thất bại. Vui lòng thử lại sau.";
};
```

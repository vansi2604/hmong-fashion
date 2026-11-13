# TÀI LIỆU ĐẶC TẢ TÍCH HỢP FRONTEND - MODULE XÁC THỰC & PHÂN QUYỀN (AUTH & RBAC)
## AUTHENTICATION & USER MANAGEMENT API SPECIFICATION FOR AI & FRONTEND DEVELOPER
**Dự án:** Hmong Fashion (H'Mông May) Backend API  
**Nền tảng Backend:** FastAPI + SQLAlchemy 2.0 + PyJWT + Passlib/Bcrypt  
**Tài liệu dành cho:** AI Coding Assistant, Lập trình viên Frontend (React, Next.js, Vue, Nuxt,...)

---

## 1. TỔNG QUAN HỆ THỐNG XÁC THỰC (AUTHENTICATION OVERVIEW)

Hệ thống xác thực sử dụng cơ chế **JWT (JSON Web Token)** kết hợp **Refresh Token lưu trữ cơ sở dữ liệu** với mô hình phân quyền kép:
- **RBAC (Role-Based Access Control):** Dựa trên vai trò (`ROLE_ADMIN`, `ROLE_STAFF`, `ROLE_CUSTOMER`).
- **PBAC (Permission-Based Access Control):** Dựa trên quyền hạn chi tiết (`product:create`, `rental:manage`,...).
- **Cơ chế Token:**
  - **Access Token:** Định dạng JWT chuẩn (`HS256`), hạn sống mặc định **24 giờ** (1440 phút ở môi trường dev), đính kèm thông tin `sub` (User ID), `email`, `roles`, và `permissions`.
  - **Refresh Token:** Chuỗi ngẫu nhiên an toàn (64 ký tự hex) lưu trong bảng `user_tokens`, hạn sống **14 - 30 ngày**, dùng để cấp lại Access Token mới khi hết hạn mà không bắt người dùng đăng nhập lại.

---

## 2. TÀI KHOẢN MẪU KHỞI TẠO ĐỂ TEST (DEFAULT SEED ACCOUNTS)

Hệ thống tự động khởi tạo sẵn các tài khoản sau khi backend khởi động:

| Vai trò (Role) | Username | Mật khẩu mặc định | Email | Quyền hạn mặc định |
| :--- | :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin` | `Admin@123456` | `admin@hmongfashion.com` | `ROLE_ADMIN` (Toàn quyền quản trị user, role, media, sản phẩm, đơn hàng) |
| **Nhân viên (Staff)** | `nhanvien1` | `Staff@123456` | `nhanvien1@hmongfashion.com` | `ROLE_STAFF` (Quản lý sản phẩm, đơn hàng, cho thuê, may đo) |
| **Khách hàng mẫu** | *Tự đăng ký* | Tối thiểu 6 ký tự | Bất kỳ hợp lệ | `ROLE_CUSTOMER` (Mặc định khi đăng ký qua API `/auth/register`) |

---

## 3. TYPESCRIPT INTERFACES CHUẨN (DÙNG CHO AI / FRONTEND)

```typescript
// ==========================================
// 1. Roles & Permissions Constants
// ==========================================
export type UserRole = 'ROLE_ADMIN' | 'ROLE_STAFF' | 'ROLE_CUSTOMER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';
export type GenderType = 'MALE' | 'FEMALE' | 'OTHER';

// ==========================================
// 2. Auth Payload Types
// ==========================================
export interface UserRegisterPayload {
  username: string;          // 3 - 50 ký tự (Bắt buộc)
  email: string;             // Email hợp lệ (Bắt buộc)
  password: string;          // 6 - 100 ký tự (Bắt buộc)
  phone?: string;            // 8 - 20 ký tự (Tùy chọn)
  full_name?: string;        // Max 100 ký tự (Tùy chọn)
  address?: string;          // (Tùy chọn)
}

export interface UserLoginPayload {
  username_or_email: string; // Có thể nhập username hoặc email
  password: string;
  device_info?: string;      // Tùy chọn, mặc định "Web Browser"
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  expires_in: number;        // Thời gian sống của access token tính bằng giây
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

// ==========================================
// 3. User & Profile Models
// ==========================================
export interface CustomerProfile {
  id: number;
  full_name: string | null;
  avatar_url: string | null;
  gender: GenderType | string | null;
  date_of_birth: string | null;  // YYYY-MM-DD
  address: string | null;
  loyalty_points: number;
}

export interface UserMe {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  status: UserStatus;
  roles: UserRole[];
  permissions: string[];
  profile: CustomerProfile | null;
  created_at: string;        // ISO 8601 UTC
}

export interface CustomerProfileUpdatePayload {
  new_username?: string;     // 3 - 50 ký tự (Nếu muốn đổi username)
  current_password?: string; // BẮT BUỘC nếu đổi username, mật khẩu, hoặc số điện thoại
  new_password?: string;     // 6 - 100 ký tự (Nếu muốn đổi mật khẩu)
  new_phone?: string;        // 8 - 20 ký tự (Nếu muốn đổi số điện thoại)
  full_name?: string;
  avatar_url?: string;
  gender?: GenderType | string;
  date_of_birth?: string;    // YYYY-MM-DD
  address?: string;
}

// ==========================================
// 4. Admin Management Models
// ==========================================
export interface RoleItem {
  id: number;
  code: string;              // ROLE_ADMIN, ROLE_STAFF,...
  name: string;
  description: string | null;
}

export interface UserUpdateStatusPayload {
  status: UserStatus;        // ACTIVE, INACTIVE, SUSPENDED, PENDING
}

export interface AssignRolesPayload {
  role_ids: number[];
}

export interface AssignPermissionsPayload {
  permission_ids: number[];
}

// ==========================================
// 5. Chuẩn phản hồi lỗi Backend (AppErrorResponse)
// ==========================================
export interface ErrorDetailItem {
  field?: string;
  location?: string;
  message: string;
  type?: string;
}

export interface AppErrorResponse {
  success: boolean;          // Luôn là false khi lỗi
  status_code: number;
  error_code: string;        // Mã lỗi nghiệp vụ cụ thể
  message: string;           // Thông báo hiển thị cho người dùng
  detail?: string;
  details?: ErrorDetailItem[];
  timestamp: string;
  path: string;
}
```

---

## 4. DANH SÁCH CHI TIẾT ENDPOINTS API AUTH

*Lưu ý: Tiền tố toàn hệ thống là `/api/v1` (tuy nhiên một số router hỗ trợ cả không prefix, FE nên cấu hình baseURL là `/api/v1` hoặc gọi đầy đủ).*

### 4.1. Đăng ký tài khoản khách hàng mới
* **Phương thức:** `POST`
* **Đường dẫn:** `/api/v1/auth/register`
* **Xác thực:** Công khai (Public).
* **Content-Type:** `application/json`
* **Request Body:** `UserRegisterPayload`
* **Quy trình Backend:**
  1. Kiểm tra trùng lặp `username`, `email`, `phone`.
  2. Băm mật khẩu bằng Bcrypt (`password_hash`).
  3. Gán mặc định vai trò `ROLE_CUSTOMER`.
  4. Tự động khởi tạo hồ sơ `CustomerProfile` liên kết.
* **Success Response:** `201 Created` $\rightarrow$ Trả về `UserMe` (chưa kèm token, client điều hướng sang login hoặc tự động gọi login).
* **Mã lỗi thường gặp:**
  * `409 Conflict` $\rightarrow$ `error_code`:
    * `"USERNAME_ALREADY_EXISTS"`: Tên đăng nhập đã tồn tại.
    * `"EMAIL_ALREADY_EXISTS"`: Email đã được đăng ký.
    * `"PHONE_ALREADY_EXISTS"`: Số điện thoại đã được đăng ký.
  * `422 Validation Error`: Dữ liệu thiếu hoặc sai quy cách (email sai định dạng, mật khẩu < 6 ký tự).

---

### 4.2. Đăng nhập & Nhận cặp Token
* **Phương thức:** `POST`
* **Đường dẫn:** `/api/v1/auth/login`
* **Xác thực:** Công khai (Public).
* **Content-Type:** `application/json` *(Hỗ trợ cả `application/x-www-form-urlencoded` cho Swagger)*
* **Request Body (JSON):**
  ```json
  {
    "username_or_email": "admin",
    "password": "Admin@123456",
    "device_info": "Chrome trên Windows 11"
  }
  ```
* **Success Response:** `200 OK`
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "a1b2c3d4e5f6...",
    "token_type": "bearer",
    "expires_in": 86400
  }
  ```
* **Mã lỗi thường gặp:**
  * `400 Bad Request` $\rightarrow$ `INVALID_JSON` hoặc `MISSING_CREDENTIALS`.
  * `401 Unauthorized` $\rightarrow$ `INVALID_CREDENTIALS`: "Tên đăng nhập hoặc mật khẩu không chính xác."
  * `403 Forbidden` $\rightarrow$ `ACCOUNT_INACTIVE`: "Tài khoản đang ở trạng thái 'INACTIVE/SUSPENDED', vui lòng liên hệ hỗ trợ."

---

### 4.3. Cấp lại Access Token mới (Refresh Token)
* **Phương thức:** `POST`
* **Đường dẫn:** `/api/v1/auth/refresh-token`
* **Xác thực:** Công khai (Dùng Refresh Token).
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "refresh_token": "a1b2c3d4e5f6..."
  }
  ```
* **Quy trình Backend:** Kiểm tra tính hợp lệ và hạn sống của Refresh Token trong bảng `user_tokens`, nếu hợp lệ sẽ cấp lại cặp Token mới.
* **Success Response:** `200 OK` $\rightarrow$ `TokenResponse`.
* **Mã lỗi thường gặp:**
  * `401 Unauthorized` $\rightarrow$ `INVALID_REFRESH_TOKEN`: "Refresh Token không hợp lệ hoặc đã bị thu hồi."
  * `401 Unauthorized` $\rightarrow$ `REFRESH_TOKEN_EXPIRED`: "Refresh Token đã hết hạn, vui lòng đăng nhập lại."

---

### 4.4. Đăng xuất & Thu hồi Token (Logout)
* **Phương thức:** `POST`
* **Đường dẫn:** `/api/v1/auth/logout`
* **Xác thực:** Không bắt buộc (nhưng khuyến nghị gửi kèm Bearer Header).
* **Content-Type:** `application/json`
* **Request Body:**
  ```json
  {
    "refresh_token": "a1b2c3d4e5f6..."
  }
  ```
* **Success Response:** `200 OK`
  ```json
  {
    "message": "Đăng xuất thành công, Refresh Token đã được thu hồi."
  }
  ```

---

### 4.5. Lấy thông tin tài khoản hiện tại (Get Me)
* **Phương thức:** `GET`
* **Đường dẫn:** `/api/v1/auth/me`
* **Xác thực:** Bắt buộc Header: `Authorization: Bearer <access_token>`.
* **Success Response:** `200 OK` $\rightarrow$ `UserMe`
  ```json
  {
    "id": 1,
    "username": "admin",
    "email": "admin@hmongfashion.com",
    "phone": "0900000001",
    "status": "ACTIVE",
    "roles": ["ROLE_ADMIN"],
    "permissions": ["product:create", "product:delete", "order:manage"],
    "profile": {
      "id": 1,
      "full_name": "Quản Trị Viên Hệ Thống",
      "avatar_url": "/uploads/avatars/admin_avatar.png",
      "gender": "MALE",
      "date_of_birth": "1990-01-01",
      "address": "Sa Pa, Lào Cai",
      "loyalty_points": 0
    },
    "created_at": "2026-03-24T10:00:00Z"
  }
  ```
* **Mã lỗi:** `401 Unauthorized` (Token hết hạn, chữ ký sai, hoặc tài khoản đã bị khóa).

---

### 4.6. Cập nhật hồ sơ cá nhân & Đổi thông tin bảo mật
* **Phương thức:** `PUT`
* **Đường dẫn:** `/api/v1/auth/me/profile`
* **Xác thực:** Bắt buộc Header: `Authorization: Bearer <access_token>`.
* **Content-Type:** `application/json`
* **Request Body:** `CustomerProfileUpdatePayload`
* **Quy tắc bảo mật nghiệp vụ (Rất quan trọng cho FE):**
  * **Nếu chỉ cập nhật thông tin hồ sơ thông thường** (`full_name`, `avatar_url`, `gender`, `date_of_birth`, `address`): Không cần truyền `current_password`.
  * **Nếu có thay đổi các trường nhạy cảm** (`new_username`, `new_password`, `new_phone`): **BẮT BUỘC** phải truyền `current_password` chính xác. Nếu sai, backend trả về `400 Bad Request` (`INVALID_PASSWORD`: "Mật khẩu hiện tại không chính xác.").
  * Nếu đổi sang username/phone đã tồn tại ở tài khoản khác: Backend trả về `409 Conflict`.
* **Success Response:** `200 OK` $\rightarrow$ `UserMe` (Dữ liệu sau khi cập nhật).

---

## 5. CÁC API QUẢN TRỊ NGƯỜI DÙNG DÀNH CHO ADMIN (`/api/v1/admin`)

Tất cả các endpoint dưới đây yêu cầu tài khoản có vai trò **`ROLE_ADMIN`**. Nếu tài khoản là `ROLE_STAFF` hoặc `ROLE_CUSTOMER`, backend sẽ trả về mã lỗi **`403 Forbidden`**.

### 5.1. Danh sách người dùng
* **`GET /api/v1/admin/users`**
* **Query Params:**
  * `status_filter` *(string, optional)*: `ACTIVE`, `INACTIVE`, `SUSPENDED`, `PENDING`.
  * `role_filter` *(string, optional)*: `ROLE_CUSTOMER`, `ROLE_STAFF`, `ROLE_ADMIN`.
  * `skip` *(int, default 0)*, `limit` *(int, default 50)*.
* **Success:** `200 OK` $\rightarrow$ `UserMe[]`

### 5.2. Khóa / Mở khóa tài khoản
* **`PUT /api/v1/admin/users/{user_id}/status`**
* **Body:** `{ "status": "SUSPENDED" }` (hoặc `"ACTIVE"`, `"INACTIVE"`)
* **Success:** `200 OK` $\rightarrow$ `UserMe`

### 5.3. Gán vai trò cho người dùng
* **`POST /api/v1/admin/users/{user_id}/roles`**
* **Body:** `{ "role_ids": [1, 2] }`
* **Success:** `200 OK` $\rightarrow$ `UserMe`

### 5.4. Tạo vai trò mới & Phân quyền chi tiết
* **`POST /api/v1/admin/roles`** $\rightarrow$ Tạo role (`RoleCreate`)
* **`POST /api/v1/admin/roles/{role_id}/permissions`** $\rightarrow$ Gán danh sách quyền `permission_ids` cho role.

---

## 6. HƯỚNG DẪN CẤU HÌNH & XỬ LÝ TOKEN TRÊN FRONTEND (FE INTEGRATION GUIDE)

### 6.1. Quy chuẩn lưu trữ Token (Storage Strategy)
* **Access Token:** Lưu trong Memory (React Context/Zustand State) hoặc `sessionStorage` / Secure Cookie.
* **Refresh Token:** Lưu trong `localStorage` hoặc Cookie an toàn.
* **Header đính kèm cho mọi Request:**
  ```http
  Authorization: Bearer <access_token>
  ```

### 6.2. Mã nguồn mẫu Axios Interceptor tự động Refresh Token (AI có thể sinh trực tiếp)

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Tự động gắn Bearer Token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor: Tự động Refresh khi gặp lỗi 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Bỏ qua nếu lỗi không phải 401 hoặc request là login/refresh
    if (!error.response || error.response.status !== 401 || originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh-token')) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      // Xóa state đăng nhập & chuyển sang trang /login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    try {
      const response = await axios.post<{ access_token: string; refresh_token: string }>(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/refresh-token`,
        { refresh_token: refreshToken }
      );

      const { access_token, refresh_token: newRefreshToken } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', newRefreshToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
      }
      processQueue(null, access_token);
      return apiClient(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
```

---

## 7. BẢO VỆ ROUTE & ĐIỀU HƯỚNG PHÂN QUYỀN (ROUTE GUARDS)

Khi xây dựng giao diện người dùng, FE cần dựa vào `user.roles` lấy từ API `GET /api/v1/auth/me`:

1. **Khách hàng (Client Customer App):**
   - Các trang giỏ hàng, thông tin cá nhân `/profile`, lịch sử đơn hàng `/orders`: Yêu cầu đã đăng nhập (bất kể role nào).
2. **Trang Quản trị viên & Nhân viên (`/admin/*`):**
   - Chỉ cho phép truy cập nếu `user.roles.includes('ROLE_ADMIN')` hoặc `user.roles.includes('ROLE_STAFF')`.
   - Nếu là tài khoản `ROLE_CUSTOMER` cố tình truy cập: Điều hướng về trang chủ `/` kèm Toast cảnh báo *"Bạn không có quyền truy cập trang quản trị."*
3. **Chức năng nhạy cảm trong Admin (Quản trị User, Phân quyền Role, Xóa vĩnh viễn):**
   - **Chỉ hiển thị hoặc cho phép click** nếu `user.roles.includes('ROLE_ADMIN')`.
   - Ẩn hoàn toàn tab "Quản lý người dùng & Phân quyền" đối với nhân viên `ROLE_STAFF`.

---

## 8. DANH SÁCH MÃ LỖI NGHIỆP VỤ AUTH CẦN BẮT (ERROR CODES DICTIONARY)

| Mã lỗi (`error_code`) | HTTP Status | Thông điệp Backend | Hành động gợi ý cho FE UI |
| :--- | :---: | :--- | :--- |
| `USERNAME_ALREADY_EXISTS` | 409 | Tên đăng nhập đã tồn tại. | Báo đỏ dưới ô input Tên đăng nhập |
| `EMAIL_ALREADY_EXISTS` | 409 | Email đã được đăng ký. | Báo đỏ dưới ô input Email |
| `PHONE_ALREADY_EXISTS` | 409 | Số điện thoại đã được đăng ký. | Báo đỏ dưới ô input Số điện thoại |
| `INVALID_CREDENTIALS` | 401 | Tên đăng nhập hoặc mật khẩu không chính xác. | Hiển thị Banner Alert trên Form đăng nhập |
| `ACCOUNT_INACTIVE` | 403 | Tài khoản đang ở trạng thái '{status}', vui lòng liên hệ hỗ trợ. | Hiển thị Popup thông báo tài khoản bị khóa |
| `INVALID_PASSWORD` | 400 | Mật khẩu hiện tại không chính xác. | Báo đỏ dưới ô "Mật khẩu hiện tại" trong form đổi thông tin |
| `INVALID_REFRESH_TOKEN` | 401 | Refresh Token không hợp lệ hoặc đã bị thu hồi. | Xóa Token, chuyển hướng người dùng về `/login` |
| `REFRESH_TOKEN_EXPIRED` | 401 | Refresh Token đã hết hạn, vui lòng đăng nhập lại. | Hiển thị Toast "Phiên đăng nhập hết hạn", đưa về `/login` |
| `UNAUTHORIZED` | 401 | Chưa xác thực hoặc token không hợp lệ. | Bắt buộc đăng nhập lại |
| `FORBIDDEN` | 403 | Quyền bị từ chối / Không đủ thẩm quyền. | Chặn thao tác, hiển thị Toast cảnh báo quyền hạn |
| `VALIDATION_ERROR` | 422 | Dữ liệu yêu cầu không hợp lệ. | Duyệt mảng `details` để hiển thị lỗi từng trường cụ thể |

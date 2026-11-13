# Tài Liệu API Module Xác Thực & Tài Khoản (Auth Module API Specification)

> **Mục đích tài liệu:** Tài liệu này được biên soạn chuẩn hóa để cung cấp trực tiếp cho **AI (LLM / Copilot / Cursor / Claude / ChatGPT)** hoặc lập trình viên Frontend (FE) đọc hiểu và sinh mã nguồn giao diện xác thực (Đăng ký, Đăng nhập, Quản lý hồ sơ cá nhân, Đổi mật khẩu/username, Refresh Token, Đăng xuất, và Quản trị User/Role).

---

## 📌 Hướng dẫn dành cho AI Lập trình Frontend (AI Prompting Context)

1. **Base URL:**
   - Client Auth: `http://127.0.0.1:8000/api/v1/auth`
   - Admin RBAC: `http://127.0.0.1:8000/api/v1/admin`
2. **Cơ chế xác thực (JWT Bearer Token):**
   - Đăng nhập thành công trả về cặp token: `access_token` (thời hạn 24h trên dev) và `refresh_token` (thời hạn 30 ngày).
   - Lưu trữ an toàn:
     - Với Next.js / Web: lưu `access_token` và `refresh_token` vào Cookie hoặc LocalStorage.
     - Mọi request cần xác thực gửi header: `Authorization: Bearer <access_token>`.
   - Cơ chế Silent Refresh: Khi gọi API bị trả về `401 Unauthorized` (`TOKEN_INVALID_OR_EXPIRED`), FE cần tự động gọi `POST /api/v1/auth/refresh-token` với `refresh_token` để lấy `access_token` mới rồi replay lại request cũ.
3. **Phân quyền người dùng (Roles & RBAC):**
   - Người dùng đăng ký mặc định có vai trò: `ROLE_CUSTOMER`.
   - Hệ thống có 2 tài khoản quản trị mặc định:
     - Admin: `admin` / `Admin@123456` (có vai trò `ROLE_ADMIN`).
     - Staff: `nhanvien1` / `Staff@123456` (có vai trò `ROLE_STAFF`).

---

## 📐 1. Hệ Thống Kiểu Dữ Liệu TypeScript (TypeScript Interfaces)

Hãy copy trực tiếp các type/interface dưới đây vào `src/types/auth.ts`:

```typescript
// ==============================================================================
// 1. DATA MODELS & ENTITIES
// ==============================================================================

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface CustomerProfile {
  id: number;
  full_name: string | null;
  avatar_url: string | null;
  gender: Gender | null;
  date_of_birth: string | null; // "YYYY-MM-DD"
  address: string | null;
  loyalty_points: number;
}

export interface UserMeResponse {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  status: UserStatus;
  roles: string[];           // ["ROLE_CUSTOMER"] hoặc ["ROLE_ADMIN", "ROLE_STAFF"]
  permissions: string[];     // ["order:create", "product:read", ...]
  profile: CustomerProfile | null;
  created_at: string;        // ISO 8601
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  expires_in: number;        // Thời gian sống tính bằng giây (vd: 86400)
}

// ==============================================================================
// 2. REQUEST PAYLOADS
// ==============================================================================

export interface UserRegisterPayload {
  username: string;          // min: 3, max: 50
  email: string;             // email format
  password: string;          // min: 6, max: 100
  phone?: string;            // min: 8, max: 20
  full_name?: string;
  address?: string;
}

export interface UserLoginPayload {
  username_or_email: string; // Có thể nhập username hoặc email
  password: string;
  device_info?: string;      // Tên trình duyệt hoặc thiết bị (mặc định: "Web Browser")
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

export interface CustomerProfileUpdatePayload {
  // Thay đổi thông tin tài khoản đăng nhập (cần current_password nếu đổi mật khẩu hoặc username)
  new_username?: string;
  current_password?: string;
  new_password?: string;
  new_phone?: string;

  // Cập nhật thông tin cá nhân
  full_name?: string;
  avatar_url?: string;
  gender?: Gender;
  date_of_birth?: string;    // "YYYY-MM-DD"
  address?: string;
}

// ==============================================================================
// 3. ADMIN MANAGEMENT PAYLOADS
// ==============================================================================

export interface UserUpdateStatusPayload {
  status: UserStatus;
}

export interface RoleResponse {
  id: number;
  code: string;              // "ROLE_ADMIN", "ROLE_STAFF", "ROLE_CUSTOMER"
  name: string;
  description: string | null;
}

export interface RoleCreatePayload {
  code: string;
  name: string;
  description?: string;
}

export interface AssignRolesPayload {
  role_ids: number[];
}

export interface AssignPermissionsPayload {
  permission_ids: number[];
}
```

---

## 🚀 2. Danh Sách Các Endpoint Module Auth (`/api/v1/auth`)

| Method | Endpoint | Xác thực | Mục đích trên Frontend |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Đăng ký tài khoản khách hàng mới |
| `POST` | `/api/v1/auth/login` | Public | Đăng nhập tài khoản & nhận cặp Access/Refresh Token |
| `POST` | `/api/v1/auth/refresh-token` | Public | Đổi Refresh Token lấy Access Token mới |
| `POST` | `/api/v1/auth/logout` | Public | Thu hồi Refresh Token & đăng xuất |
| `GET` | `/api/v1/auth/me` | Bearer Token | Lấy thông tin tài khoản, hồ sơ cá nhân và quyền hạn |
| `PUT` | `/api/v1/auth/me/profile` | Bearer Token | Cập nhật hồ sơ cá nhân, đổi mật khẩu / tên đăng nhập |

---

### 2.1. Đăng ký tài khoản (`POST /api/v1/auth/register`)

- **Headers:** `Content-Type: application/json`
- **Request Body (`UserRegisterPayload`):**
  ```json
  {
    "username": "sung_a_si",
    "email": "sungasi@example.com",
    "password": "Password123@",
    "phone": "0987111222",
    "full_name": "Sùng A Sí",
    "address": "Bản Cát Cát, Sa Pa, Lào Cai"
  }
  ```
- **Phản hồi thành công (HTTP 201 Created):** Trả về đối tượng `UserMeResponse`.
- **Lỗi thường gặp:**
  - `409 Conflict`: Tên người dùng (`USERNAME_ALREADY_EXISTS`), Email (`EMAIL_ALREADY_EXISTS`) hoặc Số điện thoại (`PHONE_ALREADY_EXISTS`) đã được sử dụng.
  - `422 Unprocessable Entity`: Định dạng email sai, hoặc mật khẩu dưới 6 ký tự.

---

### 2.2. Đăng nhập (`POST /api/v1/auth/login`)

- **Hỗ trợ định dạng:** Cả `application/json` (cho Frontend Next.js/React) và `application/x-www-form-urlencoded` (cho Swagger UI).
- **Request Body JSON (`UserLoginPayload`):**
  ```json
  {
    "username_or_email": "sung_a_si",
    "password": "Password123@",
    "device_info": "Chrome on Windows 11"
  }
  ```
- **Phản hồi thành công (HTTP 200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1Ni...",
    "refresh_token": "def50200...",
    "token_type": "bearer",
    "expires_in": 86400
  }
  ```
- **Lỗi thường gặp:**
  - `401 Unauthorized` (`INVALID_CREDENTIALS`): Sai tài khoản hoặc mật khẩu.
  - `403 Forbidden` (`ACCOUNT_INACTIVE` / `ACCOUNT_SUSPENDED`): Tài khoản bị khóa.

---

### 2.3. Cấp lại Access Token (`POST /api/v1/auth/refresh-token`)

- **Request Body (`RefreshTokenPayload`):**
  ```json
  {
    "refresh_token": "def50200..."
  }
  ```
- **Phản hồi thành công (HTTP 200 OK):** Cặp token mới tương tự API đăng nhập.
- **Lỗi:** `401 Unauthorized` (`REFRESH_TOKEN_INVALID_OR_EXPIRED`) -> Yêu cầu người dùng đăng nhập lại.

---

### 2.4. Đăng xuất (`POST /api/v1/auth/logout`)

- **Request Body (`RefreshTokenPayload`):**
  ```json
  {
    "refresh_token": "def50200..."
  }
  ```
- **Phản hồi thành công (HTTP 200 OK):**
  ```json
  {
    "message": "Đăng xuất thành công, Refresh Token đã được thu hồi."
  }
  ```

---

### 2.5. Xem thông tin cá nhân (`GET /api/v1/auth/me`)

- **Headers:** `Authorization: Bearer <access_token>`
- **Phản hồi thành công (HTTP 200 OK):**
  ```json
  {
    "id": 5,
    "username": "sung_a_si",
    "email": "sungasi@example.com",
    "phone": "0987111222",
    "status": "ACTIVE",
    "roles": ["ROLE_CUSTOMER"],
    "permissions": [],
    "profile": {
      "id": 5,
      "full_name": "Sùng A Sí",
      "avatar_url": null,
      "gender": "MALE",
      "date_of_birth": "1998-05-15",
      "address": "Bản Cát Cát, Sa Pa, Lào Cai",
      "loyalty_points": 50
    },
    "created_at": "2026-11-13T07:20:00Z"
  }
  ```

---

### 2.6. Cập nhật hồ sơ & Đổi mật khẩu (`PUT /api/v1/auth/me/profile`)

- **Headers:** `Authorization: Bearer <access_token>`
- **Quy tắc bảo mật:**
  - Khi cập nhật thông tin cá nhân thông thường (`full_name`, `avatar_url`, `gender`, `date_of_birth`, `address`): không cần truyền `current_password`.
  - Khi đổi `new_username` hoặc `new_password`: **bắt buộc** phải truyền `current_password` đúng. Nếu sai hoặc thiếu, Backend trả về `400 Bad Request`.
- **Request Body Ví dụ (Đổi mật khẩu & họ tên):**
  ```json
  {
    "current_password": "Password123@",
    "new_password": "NewSecretPassword456@",
    "full_name": "Sùng A Sí (Cập nhật)",
    "address": "Thị xã Sa Pa, Lào Cai"
  }
  ```
- **Phản hồi thành công (HTTP 200 OK):** Đối tượng `UserMeResponse` đã cập nhật.

---

## 👑 3. Danh Sách Các Endpoint Quản Trị RBAC (`/api/v1/admin`)

> **Yêu cầu:** Bắt buộc tài khoản có vai trò `ROLE_ADMIN` (`Authorization: Bearer <access_token>`).

| Method | Endpoint | Mục đích trên Admin Portal |
| :--- | :--- | :--- |
| `GET` | `/api/v1/admin/users` | Danh sách người dùng (Filter `status_filter`, `role_filter`, phân trang `skip`, `limit`) |
| `PUT` | `/api/v1/admin/users/{user_id}/status` | Khóa/Mở khóa tài khoản (`ACTIVE`, `INACTIVE`, `SUSPENDED`) |
| `POST` | `/api/v1/admin/users/{user_id}/roles` | Gán vai trò cho người dùng (`role_ids: [1, 2]`) |
| `POST` | `/api/v1/admin/roles` | Tạo vai trò mới |
| `POST` | `/api/v1/admin/roles/{role_id}/permissions` | Gán danh sách quyền cho vai trò |

---

## 💻 4. Code Mẫu Tích Hợp Frontend (Axios Client với Tự Động Refresh Token)

Dưới đây là thiết lập Axios Interceptor hoàn chỉnh có cơ chế tự động làm mới Token khi bị `401`:

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { TokenResponse } from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn Access Token vào Header
authClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Xử lý khi Token hết hạn (401)
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

authClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh-token")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return authClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post<TokenResponse>(`${API_BASE_URL}/auth/refresh-token`, {
          refresh_token: refreshToken,
        });

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        authClient.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
        processQueue(null, data.access_token);

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return authClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

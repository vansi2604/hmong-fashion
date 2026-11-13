import { apiClient } from '@/lib/api-client';
import type {
  UserMe,
  TokenResponse,
  RegisterRequest,
  LoginRequest,
  UpdateProfileRequest,
} from '@/types/api';

/**
 * Service xử lý toàn bộ logic nghiệp vụ Xác thực & Tài khoản
 * Tham chiếu Section 5.1 trong FRONTEND_API_GUIDE.md
 */
export const authService = {
  /**
   * Đăng ký tài khoản khách hàng mới
   * POST /auth/register
   */
  async register(payload: RegisterRequest): Promise<UserMe> {
    const response = await apiClient.post<UserMe>('/auth/register', payload);
    return response.data;
  },

  /**
   * Đăng nhập lấy cặp Access Token & Refresh Token
   * POST /auth/login
   */
  async login(payload: LoginRequest): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/auth/login', {
      username_or_email: payload.username_or_email.trim(),
      password: payload.password,
      device_info:
        payload.device_info ||
        (typeof navigator !== 'undefined' ? navigator.userAgent : 'Web Client'),
    });

    const tokenData = response.data;
    if (typeof window !== 'undefined' && tokenData.access_token) {
      localStorage.setItem('access_token', tokenData.access_token);
      if (tokenData.refresh_token) {
        localStorage.setItem('refresh_token', tokenData.refresh_token);
      }
    }

    return tokenData;
  },

  /**
   * Lấy thông tin tài khoản đang đăng nhập
   * GET /auth/me
   */
  async getMe(): Promise<UserMe> {
    const response = await apiClient.get<UserMe>('/auth/me');
    return response.data;
  },

  /**
   * Cập nhật hồ sơ cá nhân hoặc đổi mật khẩu
   * PUT /auth/me/profile
   */
  async updateProfile(payload: UpdateProfileRequest): Promise<UserMe> {
    const response = await apiClient.put<UserMe>('/auth/me/profile', payload);
    return response.data;
  },

  /**
   * Cấp lại token mới khi token cũ hết hạn
   * POST /auth/refresh-token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/auth/refresh-token', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  /**
   * Đăng xuất khỏi hệ thống: gọi API thu hồi Refresh Token trên server và xóa token local
   * POST /api/v1/auth/logout (FE_AUTH_REQUIREMENTS.md Section 4.4)
   */
  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          await apiClient.post('/auth/logout', { refresh_token: refreshToken });
        } catch (err) {
          console.warn('Lỗi thu hồi token trên máy chủ khi đăng xuất:', err);
        }
      }
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  /**
   * Kiểm tra xem đang có token trong localStorage hay không
   */
  hasToken(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(localStorage.getItem('access_token'));
  },

  // ==========================================
  // CÁC API QUẢN TRỊ DÀNH CHO ADMIN (Section 5)
  // ==========================================

  /**
   * [Admin Only] Lấy danh sách người dùng toàn hệ thống
   * GET /api/v1/admin/users
   */
  async getUsers(params?: {
    status_filter?: string;
    role_filter?: string;
    skip?: number;
    limit?: number;
  }): Promise<UserMe[]> {
    const response = await apiClient.get<UserMe[]>('/admin/users', { params });
    return response.data || [];
  },

  /**
   * [Admin Only] Khóa / Mở khóa trạng thái tài khoản người dùng
   * PUT /api/v1/admin/users/{user_id}/status
   */
  async updateUserStatus(userId: number, status: string): Promise<UserMe> {
    const response = await apiClient.put<UserMe>(`/admin/users/${userId}/status`, {
      status,
    });
    return response.data;
  },

  /**
   * [Admin Only] Gán vai trò cho người dùng
   * POST /api/v1/admin/users/{user_id}/roles
   */
  async assignUserRoles(userId: number, roleIds: number[]): Promise<UserMe> {
    const response = await apiClient.post<UserMe>(`/admin/users/${userId}/roles`, {
      role_ids: roleIds,
    });
    return response.data;
  },
};

export default authService;

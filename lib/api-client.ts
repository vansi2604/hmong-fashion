import type { TokenResponse } from '@/types/api';

/**
 * Base URL cho Backend FastAPI
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

/**
 * Base URL tĩnh cho static uploads (hình ảnh, video)
 */
export const BACKEND_SERVER_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Helper hàm nối URL hình ảnh từ API tương đối (/uploads/...) thành URL tuyệt đối
 */
export function getImageUrl(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_SERVER_URL}${cleanPath}`;
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  _retry?: boolean;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

/**
 * Lớp lỗi chuẩn tương thích cấu trúc AxiosError
 */
export class ApiError<T = unknown> extends Error {
  response?: {
    data: T;
    status: number;
    statusText: string;
    headers: Headers;
  };
  config?: RequestOptions;

  constructor(
    message: string,
    response?: { data: T; status: number; statusText: string; headers: Headers },
    config?: RequestOptions
  ) {
    super(message);
    this.name = 'ApiError';
    this.response = response;
    this.config = config;
  }
}

// Trạng thái refresh token để tránh refresh nhiều lần đồng thời
let isRefreshing = false;
let refreshSubscribers: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const subscribeTokenRefresh = (
  resolve: (token: string) => void,
  reject: (err: unknown) => void
) => {
  refreshSubscribers.push({ resolve, reject });
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((sub) => sub.resolve(token));
  refreshSubscribers = [];
};

const onRefreshFailed = (err: unknown) => {
  refreshSubscribers.forEach((sub) => sub.reject(err));
  refreshSubscribers = [];
};

/**
 * Hàm gọi API gốc với xử lý Bearer Token & Tự động Refresh Token khi 401
 */
async function baseFetch<T>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  // 1. Chuẩn bị full URL và query params
  const fullUrl = new URL(
    url.startsWith('http') ? url : `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`
  );

  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        fullUrl.searchParams.append(key, String(value));
      }
    });
  }

  // 2. Chuẩn bị headers
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  // Tự động gắn Bearer Token nếu có trong localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Nếu body không phải FormData thì mặc định là JSON
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(fullUrl.toString(), {
      ...options,
      headers,
    });

    let data: T;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = (await response.json()) as T;
    } else {
      data = (await response.text()) as unknown as T;
    }

    // 3. Nếu HTTP thành công (200 - 299)
    if (response.ok) {
      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    }

    // 4. Nếu bị lỗi 401 Unauthorized -> Thực hiện Refresh Token
    if (response.status === 401 && !options._retry && !url.includes('/auth/refresh-token') && !url.includes('/auth/login')) {
      if (isRefreshing) {
        // Đang có request khác refresh, xếp hàng chờ
        return new Promise<ApiResponse<T>>((resolve, reject) => {
          subscribeTokenRefresh(
            (newToken: string) => {
              options._retry = true;
              options.headers = {
                ...options.headers,
                Authorization: `Bearer ${newToken}`,
              };
              baseFetch<T>(url, options).then(resolve).catch(reject);
            },
            (err: unknown) => {
              reject(err);
            }
          );
        });
      }

      options._retry = true;
      isRefreshing = true;

      try {
        const refreshToken =
          typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!refreshRes.ok) {
          throw new Error('Refresh token expired');
        }

        const tokenData = (await refreshRes.json()) as TokenResponse;
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', tokenData.access_token);
          if (tokenData.refresh_token) {
            localStorage.setItem('refresh_token', tokenData.refresh_token);
          }
        }

        onRefreshed(tokenData.access_token);

        // Gọi lại request ban đầu với token mới
        headers['Authorization'] = `Bearer ${tokenData.access_token}`;
        return baseFetch<T>(url, { ...options, headers });
      } catch (refreshErr) {
        onRefreshFailed(refreshErr);

        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          const publicPaths = ['/', '/login', '/register', '/tracking', '/products', '/tailors', '/rentals'];
          const currentPath = window.location.pathname;
          if (!publicPaths.some((p) => currentPath === p || currentPath.startsWith('/products/'))) {
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
        }
        throw new ApiError(
          'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.',
          { data, status: response.status, statusText: response.statusText, headers: response.headers },
          options
        );
      } finally {
        isRefreshing = false;
      }
    }

    // Ném lỗi ApiError
    throw new ApiError(
      (data as { message?: string })?.message || `HTTP ${response.status}: ${response.statusText}`,
      { data, status: response.status, statusText: response.statusText, headers: response.headers },
      options
    );
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      err instanceof Error ? err.message : 'Lỗi kết nối máy chủ',
      undefined,
      options
    );
  }
}

/**
 * Object apiClient chuẩn hóa (Zero-dependency, tương thích chuẩn Axios API)
 */
export const apiClient = {
  get<T>(url: string, config?: RequestOptions) {
    return baseFetch<T>(url, { method: 'GET', ...config });
  },

  post<T>(url: string, data?: unknown, config?: RequestOptions) {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return baseFetch<T>(url, {
      method: 'POST',
      body: isFormData ? (data as FormData) : JSON.stringify(data),
      ...config,
    });
  },

  put<T>(url: string, data?: unknown, config?: RequestOptions) {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return baseFetch<T>(url, {
      method: 'PUT',
      body: isFormData ? (data as FormData) : JSON.stringify(data),
      ...config,
    });
  },

  patch<T>(url: string, data?: unknown, config?: RequestOptions) {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return baseFetch<T>(url, {
      method: 'PATCH',
      body: isFormData ? (data as FormData) : JSON.stringify(data),
      ...config,
    });
  },

  delete<T>(url: string, config?: RequestOptions) {
    return baseFetch<T>(url, { method: 'DELETE', ...config });
  },
};

export default apiClient;

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type {
  UserMe,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from '@/types/api';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: UserMe | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  updateProfile: (payload: UpdateProfileRequest) => Promise<UserMe>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  isAdmin: boolean;
  isStaffOrAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserMe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Nạp thông tin tài khoản từ Backend khi mở trang
  const fetchCurrentUser = useCallback(async () => {
    if (!authService.hasToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch {
      // Token lỗi hoặc hết hạn và refresh thất bại
      authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    const initAuth = async () => {
      // Chuyển sang microtask để tránh gọi setState đồng bộ trong Effect gây cascading renders
      await Promise.resolve();
      if (ignore) return;

      if (!authService.hasToken()) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authService.getMe();
        if (!ignore) {
          setUser(userData);
        }
      } catch {
        // Token lỗi hoặc hết hạn và refresh thất bại
        authService.logout();
        if (!ignore) {
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      ignore = true;
    };
  }, []);

  // Hành động Đăng nhập
  const login = async (payload: LoginRequest) => {
    setIsLoading(true);
    try {
      await authService.login(payload);
      const userData = await authService.getMe();
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  // Hành động Đăng ký (đăng ký xong tự động đăng nhập nếu thành công)
  const register = async (payload: RegisterRequest) => {
    setIsLoading(true);
    try {
      await authService.register(payload);
      // Đăng nhập tự động sau khi đăng ký
      await authService.login({
        username_or_email: payload.username,
        password: payload.password,
      });
      const userData = await authService.getMe();
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  // Cập nhật hồ sơ
  const updateProfile = async (payload: UpdateProfileRequest): Promise<UserMe> => {
    const updatedUser = await authService.updateProfile(payload);
    setUser(updatedUser);
    return updatedUser;
  };

  // Đăng xuất (thu hồi Refresh Token trên máy chủ và xóa local storage)
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  // Helper kiểm tra quyền vai trò (RBAC)
  const hasRole = (role: string): boolean => {
    return Boolean(user?.roles?.includes(role));
  };

  // Helper kiểm tra quyền hạn chi tiết (PBAC)
  const hasPermission = (permission: string): boolean => {
    return Boolean(user?.permissions?.includes(permission));
  };

  const isAdmin = Boolean(user?.roles?.includes('ROLE_ADMIN'));

  const isStaffOrAdmin = Boolean(
    user?.roles?.some((r) => r === 'ROLE_ADMIN' || r === 'ROLE_STAFF')
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        updateProfile,
        logout,
        refreshUser: fetchCurrentUser,
        hasRole,
        hasPermission,
        isAdmin,
        isStaffOrAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

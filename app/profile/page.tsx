"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { mediaService } from "@/services/media.service";
import { getErrorMessage } from "@/lib/errors";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, updateProfile, logout, isStaffOrAdmin } =
    useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile fields state
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFullName(user.profile?.full_name || "");
      setAddress(user.profile?.address || "");
      setAvatarUrl(user.profile?.avatar_url || "");
    }
  }, [user]);

  // Upload Avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setFeedback(null);
    try {
      const media = await mediaService.upload(file, "avatars");
      await updateProfile({ avatar_url: media.url });
      setAvatarUrl(media.url);
      setFeedback({
        type: "success",
        message: "Cập nhật ảnh đại diện thành công!",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: getErrorMessage(err, "Không thể tải lên ảnh đại diện."),
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Submit Update Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsUpdatingProfile(true);

    try {
      await updateProfile({
        full_name: fullName.trim(),
        address: address.trim(),
      });
      setFeedback({
        type: "success",
        message: "Thông tin hồ sơ đã được cập nhật thành công!",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: getErrorMessage(err, "Cập nhật hồ sơ thất bại."),
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Submit Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (newPassword !== confirmPassword) {
      setFeedback({
        type: "error",
        message: "Mật khẩu mới và mật khẩu xác nhận không trùng khớp.",
      });
      return;
    }

    if (newPassword.length < 6) {
      setFeedback({
        type: "error",
        message: "Mật khẩu mới phải có tối thiểu 6 ký tự.",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      await updateProfile({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFeedback({
        type: "success",
        message: "Đổi mật khẩu thành công! Vui lòng ghi nhớ mật khẩu mới.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: getErrorMessage(err, "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại."),
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-stone-500 text-sm">
          <svg className="animate-spin h-5 w-5 text-amber-700" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Đang nạp thông tin hồ sơ...</span>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const avatarDisplayUrl = avatarUrl ? mediaService.getImageUrl(avatarUrl) : null;

  return (
    <main className="min-h-screen py-8 sm:py-12 bg-stone-100/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <Link href="/" className="hover:text-amber-800">Trang chủ</Link>
              <span>/</span>
              <span className="text-stone-800 font-semibold">Tài khoản cá nhân</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900">
              Hồ Sơ & Cài Đặt Tài Khoản
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            {isStaffOrAdmin && (
              <Link
                href="/admin/tailors"
                className="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>⚙️ Quản Trị Staff</span>
              </Link>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-stone-200 hover:border-rose-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Đăng Xuất
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-xs sm:text-sm flex items-center gap-3 transition-all ${
              feedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <span className="text-lg">{feedback.type === "success" ? "✓" : "⚠️"}</span>
            <span className="font-medium">{feedback.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cột trái: User Card & Quick Navigation (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* User Profile Summary Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-stone-900 to-amber-900" />

              <div className="relative pt-6">
                <div className="relative w-24 h-24 mx-auto rounded-full ring-4 ring-white shadow-md overflow-hidden bg-stone-200 flex items-center justify-center">
                  {avatarDisplayUrl ? (
                    <Image
                      src={avatarDisplayUrl}
                      alt={user.profile?.full_name || user.username}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <span className="font-serif font-black text-3xl text-stone-600 uppercase">
                      {user.username.slice(0, 2)}
                    </span>
                  )}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="mt-3 text-xs text-amber-800 hover:text-amber-900 font-semibold cursor-pointer underline underline-offset-2"
                >
                  {isUploadingAvatar ? "Đang tải ảnh..." : "Đổi ảnh đại diện"}
                </button>

                <h2 className="text-lg font-bold text-stone-900 mt-2">
                  {user.profile?.full_name || user.username}
                </h2>
                <p className="text-xs text-stone-500">@{user.username}</p>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                    {user.status}
                  </span>
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900"
                    >
                      {role.replace("ROLE_", "")}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-stone-100 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between text-stone-600">
                  <span className="text-stone-400">Email:</span>
                  <span className="font-medium truncate max-w-[180px]">{user.email}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span className="text-stone-400">Số điện thoại:</span>
                  <span className="font-medium">{user.phone || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span className="text-stone-400">Điểm tích lũy:</span>
                  <span className="font-bold text-amber-700">{user.profile?.loyalty_points ?? 0} điểm</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span className="text-stone-400">Ngày tham gia:</span>
                  <span className="font-medium">
                    {new Date(user.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider px-3 mb-2">
                Quản lý hoạt động
              </h3>
              <Link
                href="/orders?tab=tailors"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-50 text-stone-700 hover:text-stone-900 text-xs font-medium transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base">✂️</span> Đơn May Đo Của Tôi
                </span>
                <span className="text-stone-400">›</span>
              </Link>
              <Link
                href="/orders?tab=rentals"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-50 text-stone-700 hover:text-stone-900 text-xs font-medium transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base">👘</span> Lịch Thuê Trang Phục
                </span>
                <span className="text-stone-400">›</span>
              </Link>
              <Link
                href="/orders?tab=buy"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-50 text-stone-700 hover:text-stone-900 text-xs font-medium transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base">📦</span> Đơn Hàng Mua Sắm
                </span>
                <span className="text-stone-400">›</span>
              </Link>
              <Link
                href="/tracking"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-50 text-stone-700 hover:text-stone-900 text-xs font-medium transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base">🔍</span> Tra Cứu Tiến Độ Công Khai
                </span>
                <span className="text-stone-400">›</span>
              </Link>
            </div>
          </div>

          {/* Cột phải: Forms Cập nhật Hồ sơ & Đổi Mật khẩu (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Form 1: Cập nhật thông tin */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
              <h2 className="text-lg font-bold font-serif text-stone-900 mb-1">
                Thông Tin Cá Nhân
              </h2>
              <p className="text-xs text-stone-500 mb-6">
                Thông tin này sẽ được tự động điền khi bạn gửi yêu cầu may đo hoặc đặt mua hàng
              </p>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Hoàng Thị Mai"
                      className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Số điện thoại (Cố định)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user.phone}
                      className="w-full px-4 py-2.5 text-sm bg-stone-100 border border-stone-200 rounded-xl text-stone-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Địa chỉ nhận hàng mặc định
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Số nhà, thôn bản, xã, huyện, tỉnh..."
                    className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white transition-all resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="px-6 py-2.5 bg-stone-900 hover:bg-amber-800 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-60"
                  >
                    {isUpdatingProfile ? "Đang lưu..." : "Lưu Thay Đổi"}
                  </button>
                </div>
              </form>
            </div>

            {/* Form 2: Đổi Mật khẩu */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
              <h2 className="text-lg font-bold font-serif text-stone-900 mb-1">
                Bảo Mật & Mật Khẩu
              </h2>
              <p className="text-xs text-stone-500 mb-6">
                Để bảo đảm an toàn cho tài khoản, vui lòng dùng mật khẩu mạnh tối thiểu 6 ký tự
              </p>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu đang dùng"
                    className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-6 py-2.5 bg-stone-900 hover:bg-amber-800 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-60"
                  >
                    {isChangingPassword ? "Đang đổi mật khẩu..." : "Đổi Mật Khẩu"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

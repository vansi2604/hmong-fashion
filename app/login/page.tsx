"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { getErrorMessage } from "@/lib/errors";
import { BrandLogo } from "@/components/common/BrandLogo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/profile";

  const { login } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!usernameOrEmail.trim() || !password) {
      setErrorMessage("Vui lòng điền đầy đủ tên đăng nhập/email và mật khẩu.");
      return;
    }

    setIsLoading(true);
    try {
      await login({
        username_or_email: usernameOrEmail.trim(),
        password,
      });
      router.push(redirectUrl);
    } catch (err) {
      setErrorMessage(getErrorMessage(err, "Đăng nhập không thành công. Vui lòng thử lại."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-stone-200">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <BrandLogo size="md" variant="auth" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          Chào mừng trở lại
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Đăng nhập để theo dõi đơn may đo, lịch thuê đồ và mua sắm thổ cẩm
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
          <span className="text-base leading-none">⚠️</span>
          <span className="flex-1 font-medium">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Tên đăng nhập hoặc Email
          </label>
          <input
            type="text"
            required
            autoComplete="username"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            placeholder="hoangmai hoặc hoangmai@example.com"
            className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Mật khẩu
            </label>
            <Link
              href="/contact"
              className="text-xs text-amber-700 hover:text-amber-800 font-medium"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white transition-all pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-semibold p-1"
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 bg-stone-900 hover:bg-amber-800 active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Đang xác thực...</span>
            </>
          ) : (
            <span>Đăng Nhập</span>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-stone-100 text-center">
        <p className="text-xs text-stone-500">
          Chưa có tài khoản H'Mông Fashion?{" "}
          <Link
            href={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
            className="text-amber-800 hover:text-amber-900 font-bold underline underline-offset-2"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-100 via-stone-50 to-[#faf8f5]">
      <Suspense fallback={<div className="text-sm text-stone-500">Đang tải...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}

"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Product, ProductCategory, ProductListParams } from '@/types/product';
import { productService } from '@/services/product.service';
import {
  formatCurrency,
  getStockBadge,
  getProductImageUrl,
  getCategoryLabel,
  getCategoryBadgeStyle,
} from '@/utils/product.utils';
import { ProductFormModal } from '@/components/products/ProductFormModal';
import { ProductDeleteDialog } from '@/components/products/ProductDeleteDialog';

export default function DashboardProductsPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading, isStaffOrAdmin } = useAuth();
  const isAdmin = Boolean(user?.roles?.includes('ROLE_ADMIN'));

  // Danh sách sản phẩm & trạng thái tải từ Backend API
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bộ lọc & Tìm kiếm
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL'); // ALL | ACTIVE | INACTIVE
  const [stockFilter, setStockFilter] = useState<string>('ALL'); // ALL | IN_STOCK | LOW_STOCK | OUT_OF_STOCK

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Debounce tìm kiếm 350ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Thông báo Toast tự tắt sau 4s
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Nạp danh sách sản phẩm trực tiếp từ Backend API (GET /api/v1/products/)
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const params: ProductListParams = {
        category: selectedCategory === 'ALL' ? undefined : selectedCategory,
        search: debouncedSearch || undefined,
        skip: 0,
        limit: 100,
      };

      const data = await productService.getProducts(params);
      setProducts(data || []);
    } catch (err: unknown) {
      console.error('Lỗi nạp sản phẩm từ Backend API:', err);
      const msg =
        (err as { message?: string })?.message ||
        'Không thể kết nối đến Backend API /api/v1/products/. Vui lòng đảm bảo server FastAPI đang chạy.';
      setErrorMessage(msg);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, debouncedSearch]);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const params: ProductListParams = {
          category: selectedCategory === 'ALL' ? undefined : selectedCategory,
          search: debouncedSearch || undefined,
          skip: 0,
          limit: 100,
        };
        const data = await productService.getProducts(params);
        if (!ignore) {
          setProducts(data || []);
        }
      } catch (err: unknown) {
        console.error('Lỗi nạp sản phẩm từ Backend API:', err);
        const msg =
          (err as { message?: string })?.message ||
          'Không thể kết nối đến Backend API /api/v1/products/. Vui lòng đảm bảo server FastAPI đang chạy.';
        if (!ignore) {
          setErrorMessage(msg);
          setProducts([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [selectedCategory, debouncedSearch]);

  // Lọc sản phẩm ở client (Trạng thái hiển thị & Tồn kho)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Trạng thái hiển thị (is_active)
      if (statusFilter === 'ACTIVE' && !p.is_active) return false;
      if (statusFilter === 'INACTIVE' && p.is_active) return false;

      // 2. Tồn kho
      const stock = p.stock ?? 0;
      if (stockFilter === 'IN_STOCK' && stock <= 0) return false;
      if (stockFilter === 'LOW_STOCK' && (stock <= 0 || stock > 3)) return false;
      if (stockFilter === 'OUT_OF_STOCK' && stock > 0) return false;

      return true;
    });
  }, [products, statusFilter, stockFilter]);

  // Thống kê nhanh KPI
  const stats = useMemo(() => {
    const total = products.length;
    const activeCount = products.filter((p) => p.is_active).length;
    const rentalCount = products.filter((p) => (p.rental_price_per_day ?? 0) > 0).length;
    const lowStockCount = products.filter((p) => (p.stock ?? 0) <= 3).length;
    return { total, activeCount, rentalCount, lowStockCount };
  }, [products]);

  // Xử lý bật/tắt nhanh trạng thái hiển thị (Soft toggle)
  const handleToggleStatus = async (product: Product) => {
    const newStatus = !product.is_active;
    try {
      if (!newStatus) {
        // Tắt = Soft delete (DELETE /api/v1/products/{id})
        await productService.softDeleteProduct(product.id);
      } else {
        // Bật = Update is_active: true (PUT /api/v1/products/{id})
        await productService.updateProduct(product.id, { is_active: true });
      }

      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, is_active: newStatus } : item
        )
      );

      showToast(
        newStatus
          ? `Đã mở bán lại sản phẩm "${product.name}".`
          : `Đã ẩn sản phẩm "${product.name}" khỏi gian hàng bán lẻ.`
      );
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message ||
        'Không thể cập nhật trạng thái sản phẩm.';
      showToast(`Lỗi: ${msg}`);
    }
  };

  // Callback sau khi Thêm/Sửa sản phẩm thành công
  const handleFormSuccess = (savedProduct: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === savedProduct.id);
      if (exists) {
        return prev.map((p) => (p.id === savedProduct.id ? savedProduct : p));
      }
      return [savedProduct, ...prev];
    });
    showToast(
      productToEdit
        ? `Cập nhật sản phẩm "${savedProduct.name}" thành công!`
        : `Tạo mới sản phẩm "${savedProduct.name}" thành công!`
    );
  };

  // Callback sau khi Xóa sản phẩm thành công
  const handleDeleteSuccess = (deletedId: number | string, isHardDelete: boolean) => {
    if (isHardDelete) {
      setProducts((prev) => prev.filter((p) => p.id !== deletedId));
      showToast('Đã xóa vĩnh viễn sản phẩm khỏi cơ sở dữ liệu!');
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === deletedId ? { ...p, is_active: false } : p))
      );
      showToast('Đã chuyển sản phẩm sang chế độ Ẩn (Soft Delete)!');
    }
  };

  // 1. Màn hình chờ nạp Auth
  if (isAuthLoading) {
    return (
      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-amber-700 border-t-transparent animate-spin mb-4" />
        <p className="text-sm text-stone-500 font-medium">Đang xác thực thông tin quyền truy cập...</p>
      </main>
    );
  }

  // 2. Chặn truy cập nếu chưa đăng nhập hoặc không có quyền Staff/Admin
  if (!isAuthenticated || !isStaffOrAdmin) {
    return (
      <main className="container mx-auto px-4 py-16 max-w-xl text-center">
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-3xl mx-auto">
            🔒
          </div>
          <h1 className="text-xl font-serif font-black text-stone-900">
            Khu Vực Quản Trị Kho Hàng & Sản Phẩm
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Phân hệ Quản lý Sản phẩm yêu cầu tài khoản được cấp quyền{' '}
            <span className="font-semibold text-amber-800">ROLE_STAFF</span> hoặc{' '}
            <span className="font-semibold text-amber-800">ROLE_ADMIN</span>.
          </p>
          <div className="pt-4 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors"
            >
              Về Trang Chủ
            </Link>
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-amber-800 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Đăng Nhập Ngay
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-3 duration-200">
          <div className="bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-stone-700 text-xs font-semibold">
            <span>✨</span>
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-stone-400 hover:text-white ml-2 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 1. Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-stone-500 mb-1.5 font-medium">
            <Link href="/" className="hover:text-amber-800 transition-colors">
              Trang Chủ
            </Link>
            <span>/</span>
            <Link href="/dashboard_control" className="hover:text-amber-800 transition-colors">
              Bảng Điều Khiển
            </Link>
            <span>/</span>
            <span className="text-amber-900 font-bold">Quản Lý Sản Phẩm</span>
          </nav>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
              Quản Trị Kho Sản Phẩm & Phụ Kiện
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold uppercase tracking-wide">
              {isAdmin ? '👑 ADMIN (FULL CRUD)' : '⭐ STAFF'}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Dữ liệu kết nối trực tiếp FastAPI Backend: <code>/api/v1/products/</code> • Mô hình Hybrid Bán đứt & Cho thuê.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchProducts}
            disabled={isLoading}
            className="px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Làm mới danh sách sản phẩm"
          >
            <span className={isLoading ? 'animate-spin' : ''}>🔄</span>
            <span className="hidden sm:inline">Làm mới</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setProductToEdit(null);
              setIsFormModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>+</span>
            <span>Thêm Sản Phẩm Mới</span>
          </button>
        </div>
      </div>

      {/* Hiển thị Thông Báo Lỗi API nếu có */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={fetchProducts}
            className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold self-start sm:self-auto transition-colors cursor-pointer"
          >
            Thử kết nối lại
          </button>
        </div>
      )}

      {/* 2. KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
          <span className="text-[11px] text-stone-500 font-semibold uppercase tracking-wider block">
            Tổng Sản Phẩm API
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-serif font-black text-stone-900">{stats.total}</span>
            <span className="text-[11px] text-stone-400 font-medium">mã</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
          <span className="text-[11px] text-stone-500 font-semibold uppercase tracking-wider block">
            Đang Mở Bán
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-serif font-black text-emerald-700">{stats.activeCount}</span>
            <span className="text-[11px] text-emerald-700/80 font-medium">hiển thị</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
          <span className="text-[11px] text-stone-500 font-semibold uppercase tracking-wider block">
            Hỗ Trợ Cho Thuê
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-serif font-black text-indigo-700">{stats.rentalCount}</span>
            <span className="text-[11px] text-indigo-700/80 font-medium">bộ đồ</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
          <span className="text-[11px] text-stone-500 font-semibold uppercase tracking-wider block">
            Sắp / Hết Hàng
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-serif font-black text-rose-600">{stats.lowStockCount}</span>
            <span className="text-[11px] text-rose-600/80 font-medium">cần nhập</span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Ô tìm kiếm có debounce 350ms */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên sản phẩm, slug..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-amber-700 bg-stone-50 font-medium"
            />
            <span className="absolute left-3 top-2.5 text-stone-400 text-xs">🔍</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Nhóm Bộ lọc Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Lọc Trạng thái hiển thị */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50 text-stone-800 font-semibold focus:outline-none focus:border-amber-700"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">✓ Đang mở bán (Active)</option>
              <option value="INACTIVE">✗ Đã ẩn (Inactive)</option>
            </select>

            {/* Lọc Tồn kho */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50 text-stone-800 font-semibold focus:outline-none focus:border-amber-700"
            >
              <option value="ALL">Tất cả kho hàng</option>
              <option value="IN_STOCK">Còn hàng (&gt;0)</option>
              <option value="LOW_STOCK">Sắp hết hàng (1-3 sp)</option>
              <option value="OUT_OF_STOCK">Tạm hết hàng (0 sp)</option>
            </select>
          </div>
        </div>

        {/* Tab Lọc Nhanh Danh Mục Chuẩn */}
        <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-semibold">
          <span className="text-stone-400 text-[11px] mr-1 hidden sm:inline">Danh mục:</span>
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: ProductCategory.TRADITIONAL, label: "Truyền thống H'Mông (TRADITIONAL)" },
            { id: ProductCategory.MODERN, label: 'Cách tân hiện đại (MODERN)' },
            { id: ProductCategory.ACCESSORIES, label: 'Phụ kiện & Bạc (ACCESSORIES)' },
          ].map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white font-bold'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Product Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3 px-4">Sản Phẩm</th>
                <th className="py-3 px-4">Danh Mục</th>
                <th className="py-3 px-4">Giá Mua Đứt</th>
                <th className="py-3 px-4">Giá Thuê / Ngày</th>
                <th className="py-3 px-4">Tồn Kho</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-stone-400">
                    <div className="w-8 h-8 rounded-full border-2 border-amber-700 border-t-transparent animate-spin mx-auto mb-2" />
                    <span>Đang nạp dữ liệu sản phẩm từ API Backend...</span>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-stone-400 space-y-3">
                    <span className="text-4xl block">👗</span>
                    <p className="font-bold text-stone-700 text-sm">
                      {products.length === 0
                        ? 'Chưa có sản phẩm nào trong hệ thống Backend API'
                        : 'Không tìm thấy sản phẩm nào khớp với bộ lọc'}
                    </p>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      {products.length === 0
                        ? 'Hãy nhấn nút bên dưới để tạo sản phẩm đầu tiên và tải ảnh lên máy chủ.'
                        : 'Vui lòng thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.'}
                    </p>
                    {products.length === 0 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setProductToEdit(null);
                          setIsFormModalOpen(true);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <span>+</span>
                        <span>Thêm Sản Phẩm Đầu Tiên</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('ALL');
                          setStatusFilter('ALL');
                          setStockFilter('ALL');
                        }}
                        className="text-amber-800 hover:underline font-bold text-xs"
                      >
                        Xóa toàn bộ bộ lọc
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const stockBadge = getStockBadge(prod.stock ?? 0);
                  const catStyle = getCategoryBadgeStyle(prod.category);
                  const imageUrl = getProductImageUrl(prod);

                  return (
                    <tr
                      key={prod.id}
                      className={`hover:bg-amber-50/20 transition-colors ${
                        !prod.is_active ? 'opacity-60 bg-stone-50/40' : ''
                      }`}
                    >
                      {/* Cột 1: Thông tin Sản phẩm & Ảnh */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                            <img
                              src={imageUrl}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {prod.images && prod.images.length > 0 && (
                              <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[8px] px-1 rounded-xs font-mono">
                                +{prod.images.length}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/products/${prod.slug || prod.id}`}
                              target="_blank"
                              className="font-bold text-stone-900 text-xs block truncate max-w-xs hover:text-amber-800"
                            >
                              {prod.name}
                            </Link>
                            <span className="text-[10px] text-stone-400 font-mono block mt-0.5 truncate max-w-xs">
                              ID: #{prod.id} • /{prod.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Danh mục */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${catStyle.bg}`}
                        >
                          <span>{catStyle.icon}</span>
                          <span>{getCategoryLabel(prod.category)}</span>
                        </span>
                      </td>

                      {/* Cột 3: Giá Mua Đứt */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-stone-900 text-xs block">
                          {formatCurrency(prod.price)}
                        </span>
                        <span className="text-[10px] text-stone-400">Giá bán lẻ</span>
                      </td>

                      {/* Cột 4: Giá Thuê theo ngày */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-emerald-700 text-xs block">
                          {formatCurrency(prod.rental_price_per_day)}
                          <span className="text-[10px] font-normal text-stone-400">/ngày</span>
                        </span>
                        <span className="text-[10px] text-stone-400">Cho thuê</span>
                      </td>

                      {/* Cột 5: Tồn kho & Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${stockBadge.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${stockBadge.dotClass}`} />
                          <span>{stockBadge.label}</span>
                        </span>
                      </td>

                      {/* Cột 6: Trạng thái hiển thị (Soft Toggle) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(prod)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer transition-colors ${
                            prod.is_active
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-stone-200 text-stone-700 border-stone-300 hover:bg-stone-300'
                          }`}
                          title="Bấm để ẩn hoặc mở bán lại sản phẩm"
                        >
                          {prod.is_active ? '● Đang mở bán' : '○ Đang tạm ẩn'}
                        </button>
                      </td>

                      {/* Cột 7: Thao tác (Sửa / Xóa) */}
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setProductToEdit(prod);
                            setIsFormModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setProductToDelete(prod);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm / Chỉnh Sửa Sản Phẩm */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        productToEdit={productToEdit}
        onSuccess={handleFormSuccess}
      />

      {/* Dialog Xóa Sản Phẩm (Soft Delete vs Hard Delete với 409 Conflict) */}
      <ProductDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        product={productToDelete}
        onSuccess={handleDeleteSuccess}
      />
    </main>
  );
}

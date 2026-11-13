"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Product,
  ProductCategory,
  ProductCreatePayload,
  ProductUpdatePayload,
} from '@/types/product';
import { MediaFile, MediaFolder } from '@/types/media';
import { productService } from '@/services/product.service';
import { formatCurrency, generateProductSlug, getProductImageUrl } from '@/utils/product.utils';
import { MediaPickerModal } from '@/components/media/MediaPickerModal';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSuccess: (savedProduct: Product) => void;
}

interface GalleryImageItem {
  mediaId?: number | null;
  imageUrl: string;
}

export function ProductFormModal({
  isOpen,
  onClose,
  productToEdit,
  onSuccess,
}: ProductFormModalProps) {
  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [category, setCategory] = useState<ProductCategory | string>(ProductCategory.TRADITIONAL);
  const [price, setPrice] = useState<number>(0);
  const [rentalPrice, setRentalPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Media state
  const [primaryMediaId, setPrimaryMediaId] = useState<number | null>(null);
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImageItem[]>([]);

  // Modals for Media Picker
  const [isPrimaryPickerOpen, setIsPrimaryPickerOpen] = useState(false);
  const [isGalleryPickerOpen, setIsGalleryPickerOpen] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync form data when editing or opening
  useEffect(() => {
    if (!isOpen) return;

    if (productToEdit) {
      setName(productToEdit.name || '');
      setSlug(productToEdit.slug || '');
      setIsSlugManual(true);
      setCategory(productToEdit.category || ProductCategory.TRADITIONAL);
      setPrice(productToEdit.price ?? 0);
      setRentalPrice(productToEdit.rental_price_per_day ?? 0);
      setStock(productToEdit.stock ?? 0);
      setDescription(productToEdit.description || '');
      setIsActive(productToEdit.is_active ?? true);
      setPrimaryMediaId(productToEdit.primary_media_id ?? null);
      setPrimaryImageUrl(productToEdit.primary_image_url || productToEdit.imageUrl || null);

      if (productToEdit.images && productToEdit.images.length > 0) {
        setGalleryImages(
          productToEdit.images.map((img) => ({
            mediaId: img.media_id,
            imageUrl: img.image_url,
          }))
        );
      } else {
        setGalleryImages([]);
      }
    } else {
      // Reset form
      setName('');
      setSlug('');
      setIsSlugManual(false);
      setCategory(ProductCategory.TRADITIONAL);
      setPrice(1500000);
      setRentalPrice(150000);
      setStock(5);
      setDescription('');
      setIsActive(true);
      setPrimaryMediaId(null);
      setPrimaryImageUrl(null);
      setGalleryImages([]);
    }

    setErrorMessage(null);
    setIsSubmitting(false);
  }, [isOpen, productToEdit]);

  // Tự động sinh slug khi đổi tên sản phẩm (nếu chưa can thiệp thủ công)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isSlugManual) {
      setSlug(generateProductSlug(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setIsSlugManual(true);
  };

  // Xử lý chọn ảnh chính từ Media Picker
  const handleSelectPrimaryMedia = (files: MediaFile[]) => {
    if (files.length > 0) {
      const selected = files[0];
      setPrimaryMediaId(selected.id);
      setPrimaryImageUrl(selected.url);
    }
  };

  // Xử lý chọn ảnh phụ từ Media Picker
  const handleSelectGalleryMedia = (files: MediaFile[]) => {
    const newItems: GalleryImageItem[] = files.map((f) => ({
      mediaId: f.id,
      imageUrl: f.url,
    }));
    setGalleryImages((prev) => [...prev, ...newItems]);
  };

  // Xóa ảnh phụ khỏi album
  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Xử lý submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập tên sản phẩm.');
      return;
    }
    if (price < 0 || rentalPrice < 0 || stock < 0) {
      setErrorMessage('Giá bán, giá thuê và số lượng tồn kho không được là số âm.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (productToEdit) {
        // Cập nhật sản phẩm
        const updatePayload: ProductUpdatePayload = {
          name: name.trim(),
          slug: slug.trim() || undefined,
          category,
          price: Number(price),
          rental_price_per_day: Number(rentalPrice),
          stock: Number(stock),
          description: description.trim() || undefined,
          is_active: isActive,
          primary_media_id: primaryMediaId ?? undefined,
          primary_image_url: primaryImageUrl ?? undefined,
          image_media_ids: galleryImages
            .map((item) => item.mediaId)
            .filter((id): id is number => typeof id === 'number'),
        };

        const updated = await productService.updateProduct(productToEdit.id, updatePayload);
        onSuccess(updated);
        onClose();
      } else {
        // Tạo mới sản phẩm
        const createPayload: ProductCreatePayload = {
          name: name.trim(),
          slug: slug.trim() || undefined,
          category,
          price: Number(price),
          rental_price_per_day: Number(rentalPrice),
          stock: Number(stock),
          description: description.trim() || undefined,
          primary_media_id: primaryMediaId ?? undefined,
          primary_image_url: primaryImageUrl ?? undefined,
          image_media_ids: galleryImages
            .map((item) => item.mediaId)
            .filter((id): id is number => typeof id === 'number'),
        };

        const created = await productService.createProduct(createPayload);
        onSuccess(created);
        onClose();
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { message?: string })?.message ||
        'Có lỗi xảy ra khi lưu sản phẩm. Vui lòng kiểm tra lại kết nối máy chủ.';
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150">
        <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div>
              <h2 className="text-lg font-serif font-black text-stone-900">
                {productToEdit ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm Mới Vào Hệ Thống'}
              </h2>
              <p className="text-xs text-stone-500">
                Mô hình Hybrid: Bán đứt & Cho thuê trang phục • Tích hợp Media tập trung
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Khối 1: Tên & Slug SEO */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 space-y-1">
                <label className="block text-stone-700 font-bold">
                  Tên sản phẩm <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Ví dụ: Váy H'Mông Hoa Đỏ Cổ Truyền Xòe Xếp Ly..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-700 font-medium text-stone-900"
                />
              </div>

              <div className="md:col-span-4 space-y-1">
                <label className="block text-stone-700 font-bold">
                  Danh mục chuẩn <span className="text-rose-600">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-700 bg-stone-50 font-semibold text-stone-800"
                >
                  <option value={ProductCategory.TRADITIONAL}>👘 Truyền thống H'Mông (TRADITIONAL)</option>
                  <option value={ProductCategory.MODERN}>✨ Cách tân hiện đại (MODERN)</option>
                  <option value={ProductCategory.ACCESSORIES}>💍 Phụ kiện & Trang sức (ACCESSORIES)</option>
                </select>
              </div>

              <div className="md:col-span-12 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-stone-600 font-semibold">
                    Đường dẫn SEO (Slug URL)
                  </label>
                  <span className="text-[11px] text-stone-400">
                    Tự động tạo hoặc chỉnh sửa thủ công
                  </span>
                </div>
                <div className="flex items-center rounded-xl border border-stone-300 bg-stone-50 overflow-hidden focus-within:border-amber-700">
                  <span className="px-3 text-stone-400 font-mono text-[11px]">/products/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={handleSlugChange}
                    placeholder="vay-hmong-hoa-do-co-truyen"
                    className="flex-1 py-2 pr-3 bg-transparent font-mono text-stone-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Khối 2: 2 Mức Giá & Tồn Kho (Hybrid Retail & Rental) */}
            <div className="bg-stone-50/80 rounded-2xl p-4 sm:p-5 border border-stone-200/90 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                  Cấu Hình Mức Giá & Kho Hàng (Hybrid Pricing)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Giá bán đứt */}
                <div className="space-y-1">
                  <label className="block text-stone-700 font-bold">
                    Giá mua đứt (VNĐ) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    required
                    value={price}
                    onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-700 font-bold text-stone-900 bg-white"
                  />
                  <span className="text-[11px] text-stone-500 block">
                    {formatCurrency(price)}
                  </span>
                </div>

                {/* Giá thuê mỗi ngày */}
                <div className="space-y-1">
                  <label className="block text-stone-700 font-bold">
                    Giá thuê theo ngày (VNĐ)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={5000}
                    value={rentalPrice}
                    onChange={(e) => setRentalPrice(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-700 font-bold text-emerald-700 bg-white"
                  />
                  <span className="text-[11px] text-emerald-700 font-semibold block">
                    {formatCurrency(rentalPrice)} / ngày
                  </span>
                </div>

                {/* Số lượng tồn kho */}
                <div className="space-y-1">
                  <label className="block text-stone-700 font-bold">
                    Tồn kho bán lẻ (sp)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-700 font-bold text-stone-900 bg-white"
                  />
                  <span className="text-[11px] text-stone-500 block">
                    {stock === 0 ? '⚠️ Tạm hết hàng mua đứt' : `Sẵn sàng bán: ${stock}`}
                  </span>
                </div>
              </div>

              {/* Trạng thái hiển thị */}
              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-800">Trạng thái mở bán (is_active)</span>
                  <p className="text-[11px] text-stone-500">
                    Bật để hiển thị công khai trên website. Tắt để tạm ẩn sản phẩm mà không làm mất lịch sử đơn.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>
            </div>

            {/* Khối 3: Tích hợp Quản lý Media (Ảnh chính & Bộ sưu tập) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-xs">
                    Hình Ảnh Sản Phẩm & Album Bộ Sưu Tập
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Chọn tệp từ Thư viện Media tập trung hoặc tải lên trực tiếp.
                  </p>
                </div>
              </div>

              {/* Ảnh đại diện chính */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-stone-200 border border-stone-300 flex-shrink-0 flex items-center justify-center">
                    {primaryImageUrl ? (
                      <img
                        src={getProductImageUrl({ primary_image_url: primaryImageUrl })}
                        alt="Ảnh đại diện"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl text-stone-400">👗</span>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-stone-800 block">
                      Ảnh Đại Diện Chính (Primary Thumbnail)
                    </span>
                    <span className="text-[11px] text-stone-500 block truncate max-w-xs font-mono">
                      {primaryMediaId ? `Media ID: #${primaryMediaId} • ${primaryImageUrl}` : 'Chưa chọn ảnh chính'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {primaryImageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setPrimaryMediaId(null);
                        setPrimaryImageUrl(null);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-600 text-xs transition-colors cursor-pointer"
                    >
                      Xóa ảnh
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsPrimaryPickerOpen(true)}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                  >
                    📁 {primaryImageUrl ? 'Đổi ảnh đại diện' : 'Chọn ảnh đại diện'}
                  </button>
                </div>
              </div>

              {/* Bộ sưu tập ảnh phụ (Gallery) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-700">
                    Bộ sưu tập ảnh chi tiết ({galleryImages.length} ảnh)
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsGalleryPickerOpen(true)}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    + Thêm ảnh từ Thư viện
                  </button>
                </div>

                {galleryImages.length === 0 ? (
                  <div className="border border-dashed border-stone-300 rounded-2xl p-6 text-center text-stone-400 text-xs bg-stone-50/50">
                    Chưa có ảnh phụ nào trong bộ sưu tập. Nhấn nút &quot;Thêm ảnh&quot; để chọn thêm ảnh chi tiết hoa văn.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100 group"
                      >
                        <img
                          src={getProductImageUrl({ primary_image_url: img.imageUrl })}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-stone-900/80 hover:bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Xóa ảnh này"
                        >
                          ✕
                        </button>
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded-xs bg-black/60 text-white text-[9px] font-mono">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Khối 4: Mô tả chi tiết */}
            <div className="space-y-1">
              <label className="block text-stone-700 font-bold">
                Mô tả sản phẩm, hoa văn & chất liệu thổ cẩm
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả kỹ thuật thêu tay, chất liệu vải lanh bản địa, ý nghĩa họa tiết vẽ sáp ong..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-700 text-stone-800"
              />
            </div>

            {/* Footer Modal */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold cursor-pointer transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-stone-900 border-t-transparent animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <span>{productToEdit ? 'Lưu Thay Đổi' : 'Tạo Mới Sản Phẩm'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal Chọn Ảnh Chính */}
      <MediaPickerModal
        isOpen={isPrimaryPickerOpen}
        onClose={() => setIsPrimaryPickerOpen(false)}
        onSelect={handleSelectPrimaryMedia}
        multiple={false}
        targetFolder={MediaFolder.PRODUCTS_ORIGINALS}
        title="Chọn ảnh đại diện cho sản phẩm"
      />

      {/* Modal Chọn Album Ảnh Phụ */}
      <MediaPickerModal
        isOpen={isGalleryPickerOpen}
        onClose={() => setIsGalleryPickerOpen(false)}
        onSelect={handleSelectGalleryMedia}
        multiple={true}
        targetFolder={MediaFolder.PRODUCTS_ORIGINALS}
        title="Chọn ảnh thêm vào bộ sưu tập sản phẩm"
      />
    </>
  );
}

export default ProductFormModal;

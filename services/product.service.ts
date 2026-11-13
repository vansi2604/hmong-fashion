import { apiClient, ApiError } from '@/lib/api-client';
import {
  Product,
  ProductCreatePayload,
  ProductListParams,
  ProductUpdatePayload,
  ProductCategory,
} from '@/types/product';

/**
 * Service xử lý toàn bộ logic nghiệp vụ Module Sản Phẩm & Phụ Kiện
 * Tham chiếu Section 4 & Section 7.1 trong FE_SPECS_PRODUCTS.md
 */
export const productService = {
  /**
   * [Public / Admin] Lấy danh sách sản phẩm có bộ lọc và phân trang từ Backend API
   * GET /api/v1/products/
   */
  async getProducts(params?: ProductListParams): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>('/products/', {
        params: {
          category: params?.category || undefined,
          search: params?.search?.trim() || undefined,
          skip: params?.skip ?? 0,
          limit: params?.limit ?? 50,
          ...(params?.is_active !== undefined ? { is_active: params.is_active } : {}),
        },
      });
      return response.data || [];
    } catch (error) {
      console.warn('Backend API /products/ không phản hồi hoặc lỗi kết nối. Kiểm tra server FastAPI:', error);
      throw error;
    }
  },

  /**
   * [Public] Lấy chi tiết sản phẩm theo ID
   * GET /api/v1/products/{product_id}
   */
  async getProductById(productId: number | string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${productId}`);
    return response.data;
  },

  /**
   * [Public] Lấy chi tiết sản phẩm theo slug hoặc ID
   * Nếu truyền số -> gọi GET /products/{id}
   * Nếu truyền chuỗi slug -> tra cứu qua API /products/
   */
  async getProductBySlugOrId(slugOrId: string | number): Promise<Product | null> {
    const isNum =
      typeof slugOrId === 'number' ||
      (!isNaN(Number(slugOrId)) && !isNaN(parseFloat(String(slugOrId))));

    if (isNum) {
      try {
        const prod = await this.getProductById(slugOrId);
        if (prod) return prod;
      } catch {
        // Bỏ qua lỗi và tiếp tục tìm theo slug
      }
    }

    try {
      const list = await this.getProducts({ search: String(slugOrId), limit: 50 });
      const found = list.find(
        (p) => String(p.slug) === String(slugOrId) || String(p.id) === String(slugOrId)
      );
      if (found) return found;

      // Tra cứu dự phòng trong danh sách tổng
      const all = await this.getProducts({ limit: 100 });
      return (
        all.find(
          (p) => String(p.slug) === String(slugOrId) || String(p.id) === String(slugOrId)
        ) || null
      );
    } catch {
      return null;
    }
  },

  /**
   * [Admin/Staff] Tạo mới sản phẩm kèm liên kết Media
   * POST /api/v1/products/
   */
  async createProduct(payload: ProductCreatePayload): Promise<Product> {
    const response = await apiClient.post<Product>('/products/', payload);
    return response.data;
  },

  /**
   * [Admin/Staff] Cập nhật thông tin sản phẩm
   * PUT /api/v1/products/{product_id}
   */
  async updateProduct(
    productId: number | string,
    payload: ProductUpdatePayload
  ): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${productId}`, payload);
    return response.data;
  },

  /**
   * [Admin/Staff] Xóa mềm sản phẩm (Soft delete: Đổi is_active = false)
   * DELETE /api/v1/products/{product_id}
   */
  async softDeleteProduct(productId: number | string): Promise<void> {
    await apiClient.delete(`/products/${productId}`);
  },

  /**
   * [Admin Only] Xóa vĩnh viễn sản phẩm khỏi Database (Hard delete)
   * DELETE /api/v1/products/{product_id}/hard
   * Lưu ý: Ném lỗi 409 Conflict nếu sản phẩm đang có lịch thuê hoạt động (PRODUCT_HAS_ACTIVE_RENTALS)
   */
  async hardDeleteProduct(productId: number | string): Promise<void> {
    await apiClient.delete(`/products/${productId}/hard`);
  },

  /**
   * Helper kiểm tra xem lỗi trả về có phải do sản phẩm đang có lịch thuê hoạt động không
   */
  isHasActiveRentalsError(error: unknown): boolean {
    if (error instanceof ApiError && error.response) {
      const data = error.response.data as { error_code?: string };
      return (
        error.response.status === 409 ||
        data?.error_code === 'PRODUCT_HAS_ACTIVE_RENTALS'
      );
    }
    return false;
  },
};

export default productService;

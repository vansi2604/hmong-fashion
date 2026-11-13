import { apiClient } from "@/lib/api-client";
import type {
  TailorOrderCreatePayload,
  TailorOrderResponse,
  TailorOrderUpdateStatusPayload,
  TailorQueryParams,
} from "@/types/tailor";

/**
 * Service gọi API Phân hệ May Đo Theo Yêu Cầu (Tailors)
 * Khớp chuẩn 100% với đặc tả Backend: docs-BE/tailors_api.md
 */
export const tailorService = {
  /**
   * Khách hàng gửi đơn đặt may đo
   * POST /api/v1/tailors/
   */
  async createTailorOrder(payload: TailorOrderCreatePayload): Promise<TailorOrderResponse> {
    const res = await apiClient.post<TailorOrderResponse>("/tailors/", payload);
    return res.data;
  },

  /**
   * Tra cứu công khai đơn may theo mã TAILOR-...
   * GET /api/v1/tailors/code/{order_code}
   */
  async getOrderByCode(orderCode: string): Promise<TailorOrderResponse> {
    const cleanCode = encodeURIComponent(orderCode.trim());
    const res = await apiClient.get<TailorOrderResponse>(`/tailors/code/${cleanCode}`);
    return res.data;
  },

  /**
   * Lấy danh sách đơn may của tôi / tất cả đơn (Admin/Staff)
   * GET /api/v1/tailors/
   */
  async getMyTailorOrders(params?: TailorQueryParams): Promise<TailorOrderResponse[]> {
    const res = await apiClient.get<TailorOrderResponse[]>("/tailors/", { params });
    return res.data || [];
  },

  /**
   * Xem chi tiết 1 đơn may theo ID
   * GET /api/v1/tailors/{order_id}
   */
  async getOrderById(orderId: number): Promise<TailorOrderResponse> {
    const res = await apiClient.get<TailorOrderResponse>(`/tailors/${orderId}`);
    return res.data;
  },

  /**
   * Hủy đơn may (khi đang PENDING_CONFIRMATION)
   * POST /api/v1/tailors/{order_id}/cancel
   */
  async cancelTailorOrder(orderId: number): Promise<TailorOrderResponse> {
    const res = await apiClient.post<TailorOrderResponse>(`/tailors/${orderId}/cancel`);
    return res.data;
  },

  /**
   * Admin/Staff cập nhật tiến độ & chốt cọc
   * PATCH /api/v1/tailors/{order_id}/status
   */
  async updateTailorStatus(
    orderId: number,
    payload: TailorOrderUpdateStatusPayload
  ): Promise<TailorOrderResponse> {
    const res = await apiClient.patch<TailorOrderResponse>(`/tailors/${orderId}/status`, payload);
    return res.data;
  },
};

export default tailorService;

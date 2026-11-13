import { apiClient } from "@/lib/api-client";
import type {
  OrderCreatePayload,
  OrderQueryParams,
  OrderResponse,
  OrderUpdateStatusPayload,
} from "@/types/order";

/**
 * Service gọi API Phân hệ Đơn Hàng (Orders)
 * Khớp chuẩn 100% với đặc tả Backend: docs-BE/order_api.md
 */
export const orderService = {
  /**
   * Tạo mới đơn hàng (Khách vãng lai hoặc Khách đã đăng nhập)
   * POST /api/v1/orders/
   */
  async createOrder(payload: OrderCreatePayload): Promise<OrderResponse> {
    const res = await apiClient.post<OrderResponse>("/orders/", payload);
    return res.data;
  },

  /**
   * Lấy danh sách lịch sử đơn hàng của tài khoản hiện tại / tất cả đơn (Admin/Staff)
   * GET /api/v1/orders/
   */
  async getMyOrders(params?: OrderQueryParams): Promise<OrderResponse[]> {
    const res = await apiClient.get<OrderResponse[]>("/orders/", { params });
    return res.data || [];
  },

  /**
   * Tra cứu đơn hàng công khai theo mã vận đơn HMOOB-
   * GET /api/v1/orders/code/{order_code}
   */
  async getOrderByCode(orderCode: string): Promise<OrderResponse> {
    const cleanCode = encodeURIComponent(orderCode.trim());
    const res = await apiClient.get<OrderResponse>(`/orders/code/${cleanCode}`);
    return res.data;
  },

  /**
   * Xem chi tiết đơn hàng theo ID
   * GET /api/v1/orders/{order_id}
   */
  async getOrderById(orderId: number): Promise<OrderResponse> {
    const res = await apiClient.get<OrderResponse>(`/orders/${orderId}`);
    return res.data;
  },

  /**
   * Khách hàng hoặc Admin hủy đơn hàng (Khách chỉ hủy khi PENDING)
   * POST /api/v1/orders/{order_id}/cancel
   */
  async cancelOrder(orderId: number): Promise<OrderResponse> {
    const res = await apiClient.post<OrderResponse>(`/orders/${orderId}/cancel`);
    return res.data;
  },

  /**
   * Admin / Staff cập nhật trạng thái đơn và thanh toán
   * PATCH /api/v1/orders/{order_id}
   */
  async updateOrderStatus(
    orderId: number,
    payload: OrderUpdateStatusPayload
  ): Promise<OrderResponse> {
    const res = await apiClient.patch<OrderResponse>(`/orders/${orderId}`, payload);
    return res.data;
  },
};

export default orderService;

/**
 * Định nghĩa TypeScript cho Module Đơn Hàng (Orders Module)
 * Khớp chuẩn 100% với đặc tả Backend: docs-BE/order_api.md
 */

export type OrderType = "BUY" | "RENT" | "TAILOR";

export type PaymentMethod = "COD" | "BANK_TRANSFER" | "VNPAY";

export type OrderStatus =
  | "PENDING"     // Chờ xác nhận
  | "CONFIRMED"   // Đã xác nhận
  | "PROCESSING"  // Đang xử lý / May đo / Chuẩn bị hàng
  | "SHIPPED"     // Đang vận chuyển
  | "COMPLETED"   // Hoàn tất đơn hàng
  | "CANCELLED";  // Đã hủy

export type PaymentStatus =
  | "PENDING"     // Chờ thanh toán
  | "PAID"        // Đã thanh toán thành công
  | "FAILED"      // Thanh toán thất bại
  | "REFUNDED";   // Đã hoàn tiền

export interface OrderResponse {
  id: number;
  user_id: number | null;
  order_code: string;         // Định dạng HMOOB-YYYYMMDD-XXXXXX
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  order_type: OrderType;      // BUY | RENT | TAILOR
  total_amount: number;       // VNĐ
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;
  notes: string | null;
  created_at: string;         // ISO 8601
}

export interface OrderCreatePayload {
  customer_name?: string;
  customer_phone?: string;
  shipping_address?: string;
  order_type?: OrderType;
  total_amount: number;
  payment_method?: PaymentMethod;
  notes?: string;
}

export interface OrderUpdateStatusPayload {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
}

export interface OrderQueryParams {
  order_type?: OrderType;
  customer_phone?: string;
  skip?: number;
  limit?: number;
}

/**
 * Định nghĩa TypeScript cho Module Cho Thuê Trang Phục (Rentals Module)
 * Khớp chuẩn 100% với đặc tả Backend: docs-BE/rentals_api.md
 */

export type RentalStatus =
  | "PENDING"     // Chờ cửa hàng duyệt & yêu cầu đặt cọc
  | "CONFIRMED"   // Đã duyệt lịch thuê & đã chốt tiền cọc
  | "ACTIVE"      // Khách hàng đang nhận và sử dụng đồ thuê
  | "RETURNED"    // Khách đã trả lại đồ nguyên vẹn cho cửa hàng
  | "CANCELLED";  // Đơn thuê đã bị hủy

export type DepositStatus =
  | "PENDING_DEPOSIT" // Chờ khách chuyển khoản hoặc nộp cọc
  | "DEPOSITED"       // Cửa hàng đã nhận đủ tiền cọc
  | "REFUNDED";       // Cửa hàng đã hoàn lại cọc sau khi kiểm tra đồ trả

export interface RentalBookingResponse {
  id: number;
  booking_code: string;        // Định dạng RENT-YYYYMMDD-XXXX
  user_id: number | null;
  product_id: number;
  customer_name: string;
  customer_phone: string;
  start_date: string;          // "YYYY-MM-DD"
  end_date: string;            // "YYYY-MM-DD"
  total_price: number;         // Tổng chi phí thuê (VNĐ)
  deposit_amount: number;      // Tiền đặt cọc trang phục (VNĐ)
  deposit_status: DepositStatus;
  status: RentalStatus;
  staff_notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface RentalAvailabilityCheckPayload {
  product_id: number;
  start_date: string;          // "YYYY-MM-DD"
  end_date: string;            // "YYYY-MM-DD"
}

export interface RentalAvailabilityResponse {
  product_id: number;
  is_available: boolean;       // true nếu còn lịch trống
  message: string;             // Thông báo gợi ý
}

export interface RentalBookingCreatePayload {
  product_id: number;
  customer_name?: string;
  customer_phone?: string;
  start_date: string;          // "YYYY-MM-DD"
  end_date: string;            // "YYYY-MM-DD"
  total_price?: number;        // 0 để server tự tính
  deposit_amount?: number;
}

export interface RentalBookingUpdateStatusPayload {
  status?: RentalStatus;
  deposit_amount?: number;
  deposit_status?: DepositStatus;
  staff_notes?: string;
}

export interface RentalQueryParams {
  product_id?: number;
  order_status?: RentalStatus;
  customer_phone?: string;
  skip?: number;
  limit?: number;
}

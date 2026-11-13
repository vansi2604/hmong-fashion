/**
 * Định nghĩa TypeScript cho Module May Đo Theo Yêu Cầu (Tailors Module)
 * Khớp chuẩn 100% với đặc tả Backend: docs-BE/tailors_api.md
 */

export type TailorOrderStatus =
  | "PENDING_CONFIRMATION" // Chờ nhân viên xưởng gọi điện tư vấn & xác nhận
  | "CONFIRMED"            // Đã xác nhận mẫu & thỏa thuận xong giá
  | "MEASURING"            // Thợ may đang cắt rập theo thông số
  | "IN_PROGRESS"          // Đang tiến hành may, dệt thổ cẩm, thêu hoa văn
  | "READY"                // Trang phục đã may xong, sẵn sàng đóng gói
  | "DELIVERED"            // Đã giao tận tay cho khách hàng
  | "CANCELLED";           // Đã hủy

export type TailorDepositStatus =
  | "PENDING_DEPOSIT"      // Chờ đặt cọc
  | "DEPOSITED"            // Đã nộp/chuyển khoản cọc
  | "REFUNDED";            // Đã hoàn cọc

export interface MeasurementDetail {
  height?: number;         // Chiều cao (cm)
  weight?: number;         // Cân nặng (kg)
  bust?: number;           // Vòng 1 - ngực (cm)
  waist?: number;          // Vòng 2 - eo (cm)
  hips?: number;           // Vòng 3 - mông (cm)
  shoulder_width?: number; // Rộng vai (cm)
  arm_length?: number;     // Dài tay áo (cm)
  dress_length?: number;   // Dài áo hoặc váy (cm)
  extra_notes?: string;    // Dáng người hoặc ghi chú
}

export interface TailorOrderResponse {
  id: number;
  order_code: string;           // Định dạng TAILOR-YYYYMMDD-XXXX
  user_id: number | null;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  design_code: string;          // Tên mẫu hoặc mã mẫu (vd: "HMONG_HOA_BAC_HA_02")
  design_image_url: string | null;
  measurements: Record<string, any>;
  notes: string | null;
  estimated_price: number;
  deposit_amount: number;
  deposit_status: TailorDepositStatus;
  status: TailorOrderStatus;
  staff_notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface TailorOrderCreatePayload {
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  height?: number;
  weight?: number;
  design_code: string;
  design_image_url?: string;
  measurements?: MeasurementDetail;
  notes?: string;
}

export interface TailorOrderUpdateStatusPayload {
  status?: TailorOrderStatus;
  deposit_amount?: number;
  deposit_status?: TailorDepositStatus;
  estimated_price?: number;
  staff_notes?: string;
}

export interface TailorQueryParams {
  design_code?: string;
  order_status?: TailorOrderStatus;
  customer_phone?: string;
  skip?: number;
  limit?: number;
}

/**
 * H'Mông Fashion - TypeScript Interfaces chuẩn hóa kết nối Backend FastAPI
 * Tham chiếu trực tiếp từ FRONTEND_API_GUIDE.md
 */

// ==========================================
// 1. CẤU TRÚC LỖI (ERROR RESPONSE)
// ==========================================
export interface ErrorDetail {
  field?: string;
  location?: string;
  message: string;
  type?: string;
}

export interface ApiErrorResponse {
  success: boolean;
  status_code: number;
  error_code: string;
  message: string;
  detail?: string;
  details?: ErrorDetail[];
  timestamp: string;
  path: string;
}

// ==========================================
// 2. AUTH & USER PROFILE
// ==========================================
export type UserRole = 'ROLE_ADMIN' | 'ROLE_STAFF' | 'ROLE_CUSTOMER' | string;
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING' | string;
export type GenderType = 'MALE' | 'FEMALE' | 'OTHER';

export interface CustomerProfile {
  id: number;
  full_name?: string | null;
  avatar_url?: string | null;
  gender?: GenderType | string | null;
  date_of_birth?: string | null;
  address?: string | null;
  loyalty_points?: number;
}

export interface UserMe {
  id: number;
  username: string;
  email: string;
  phone?: string | null;
  status: UserStatus;
  roles: UserRole[]; // e.g. ['ROLE_CUSTOMER'], ['ROLE_STAFF'], ['ROLE_ADMIN']
  permissions: string[];
  profile?: CustomerProfile | null;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  expires_in: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
  full_name?: string;
  address?: string;
}
export type UserRegisterPayload = RegisterRequest;

export interface LoginRequest {
  username_or_email: string;
  password: string;
  device_info?: string;
}
export type UserLoginPayload = LoginRequest;

export interface UpdateProfileRequest {
  new_username?: string;
  current_password?: string;
  new_password?: string;
  new_phone?: string;
  full_name?: string;
  avatar_url?: string;
  gender?: GenderType | string;
  date_of_birth?: string;
  address?: string;
}
export type CustomerProfileUpdatePayload = UpdateProfileRequest;

// ==========================================
// 2.1. ADMIN USER MANAGEMENT MODELS
// ==========================================
export interface RoleItem {
  id: number;
  code: string;
  name: string;
  description?: string | null;
}

export interface UserUpdateStatusPayload {
  status: UserStatus;
}

export interface AssignRolesPayload {
  role_ids: number[];
}

export interface AssignPermissionsPayload {
  permission_ids: number[];
}

// ==========================================
// 3. TAILORS (MAY ĐO THEO YÊU CẦU)
// ==========================================
export interface MeasurementDetail {
  height?: number;           // Chiều cao (cm)
  weight?: number;           // Cân nặng (kg)
  bust?: number;             // Vòng 1 (cm)
  waist?: number;            // Vòng 2 (cm)
  hips?: number;             // Vòng 3 (cm)
  shoulder_width?: number;   // Rộng vai (cm)
  arm_length?: number;       // Dài tay (cm)
  dress_length?: number;     // Dài áo/váy (cm)
  extra_notes?: string;      // Dáng người
}

export interface TailorOrderCreateRequest {
  customer_name?: string;     // Để trống nếu đã đăng nhập
  customer_phone?: string;    // Để trống nếu đã đăng nhập
  customer_address?: string;  // Để trống nếu đã đăng nhập
  height?: number;            // Có thể truyền ở ngoài hoặc trong measurements
  weight?: number;
  design_code: string;        // Bắt buộc: Mã mẫu thiết kế
  design_image_url?: string;  // Link ảnh tải lên từ /media/upload
  measurements?: MeasurementDetail;
  notes?: string;             // Yêu cầu vải, hoạ tiết thổ cẩm
}

export interface TailorOrder {
  id: number;
  order_code: string;         // Mã định dạng TAILOR-YYYYMMDD-XXXX
  user_id?: number | null;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  design_code: string;
  design_image_url?: string;
  measurements: MeasurementDetail;
  notes?: string;
  estimated_price: number;    // Giá chốt sau khi nhân viên gọi điện
  deposit_amount: number;     // Tiền cọc đã lấy
  deposit_status: 'PENDING_DEPOSIT' | 'DEPOSITED' | 'REFUNDED';
  status:
    | 'PENDING_CONFIRMATION'  // Đang chờ nhân viên gọi điện xác nhận & lấy cọc
    | 'CONFIRMED'             // Đã xác nhận & nhận cọc
    | 'MEASURING'             // Đang lấy số đo / cắt vải
    | 'IN_PROGRESS'           // Đang may
    | 'READY'                 // Đã may xong, chuẩn bị giao
    | 'DELIVERED'             // Đã giao cho khách
    | 'CANCELLED';            // Đã hủy
  staff_notes?: string;       // Ghi chú của nhân viên sau khi gọi điện thoại
  created_at: string;
  updated_at?: string;
}

export interface TailorStatusUpdateRequest {
  status?: TailorOrder['status'];
  estimated_price?: number;
  deposit_amount?: number;
  deposit_status?: 'PENDING_DEPOSIT' | 'DEPOSITED' | 'REFUNDED';
  staff_notes?: string;
}

// ==========================================
// 4. RENTALS (CHO THUÊ TRANG PHỤC)
// ==========================================
export interface RentalAvailabilityCheck {
  product_id: number;
  start_date: string;         // Format: YYYY-MM-DD
  end_date: string;
}

export interface RentalAvailabilityResponse {
  product_id: number;
  is_available: boolean;
  message: string;
}

export interface RentalBookingCreateRequest {
  product_id: number;
  customer_name?: string;
  customer_phone?: string;
  start_date: string;
  end_date: string;
  total_price?: number;       // Để 0 để server tự tính
  deposit_amount?: number;
}

export interface RentalBooking {
  id: number;
  booking_code?: string;      // Mã định dạng RENT-YYYYMMDD-XXXX
  user_id?: number | null;
  product_id: number;
  customer_name: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  total_price: number;
  deposit_amount: number;
  deposit_status: 'PENDING_DEPOSIT' | 'DEPOSITED' | 'REFUNDED';
  status: 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'RETURNED' | 'CANCELLED';
  staff_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface RentalStatusUpdateRequest {
  status?: RentalBooking['status'];
  deposit_amount?: number;
  deposit_status?: 'PENDING_DEPOSIT' | 'DEPOSITED' | 'REFUNDED';
  staff_notes?: string;
}

// ==========================================
// 5. ORDERS (ĐƠN HÀNG)
// ==========================================
export interface OrderCreateRequest {
  customer_name?: string;
  customer_phone?: string;
  shipping_address?: string;
  order_type: 'BUY' | 'RENT' | 'TAILOR';
  total_amount: number;
  payment_method: 'COD' | 'BANK_TRANSFER' | 'VNPAY';
  notes?: string;
}

export interface Order {
  id: number;
  order_code: string;         // Mã định dạng HMOOB-YYYYMMDD-XXXX
  user_id?: number | null;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  order_type: 'BUY' | 'RENT' | 'TAILOR';
  total_amount: number;
  payment_method: string;
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  created_at: string;
}

// ==========================================
// 6. PRODUCTS (SẢN PHẨM)
// ==========================================
export interface ProductImage {
  id: number;
  media_id?: number;
  image_url: string;
  display_order: number;
  is_primary: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  rental_price_per_day: number;
  stock: number;
  category: 'TRADITIONAL' | 'MODERN' | 'ACCESSORIES' | string;
  primary_image_url?: string;
  is_active: boolean;
  created_at: string;
  images: ProductImage[];
}

export interface ProductQueryParams {
  category?: string;
  search?: string;
  skip?: number;
  limit?: number;
}

// ==========================================
// 7. MEDIA FILE
// ==========================================
export interface MediaFile {
  id: number;
  filename: string;
  url: string;                // URL tương đối: /uploads/tailors/xxx.jpg
  folder: string;
  media_type: 'IMAGE' | 'VIDEO';
  file_type: string;
  file_size: number;
  alt_text?: string;
  created_at: string;
}

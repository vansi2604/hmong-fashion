import type { ApiErrorResponse, ErrorDetail } from '@/types/api';
import { ApiError } from '@/lib/api-client';

/**
 * Bản đồ mã lỗi định danh từ Backend sang thông điệp tiếng Việt thân thiện
 */
export const ERROR_CODE_MESSAGES: Record<string, string> = {
  // ==========================================
  // AUTH & USER MANAGEMENT (FE_AUTH_REQUIREMENTS.md Section 8)
  // ==========================================
  USERNAME_ALREADY_EXISTS: 'Tên đăng nhập đã tồn tại trong hệ thống. Vui lòng chọn tên khác.',
  EMAIL_ALREADY_EXISTS: 'Địa chỉ email này đã được đăng ký tài khoản.',
  PHONE_ALREADY_EXISTS: 'Số điện thoại này đã được đăng ký tài khoản.',
  INVALID_CREDENTIALS: 'Tên đăng nhập hoặc mật khẩu không chính xác.',
  INVALID_PASSWORD: 'Mật khẩu hiện tại không chính xác.',
  INVALID_REFRESH_TOKEN: 'Refresh Token không hợp lệ hoặc đã bị thu hồi. Vui lòng đăng nhập lại.',
  REFRESH_TOKEN_EXPIRED: 'Phiên làm việc đã hết hạn, vui lòng đăng nhập lại.',
  FORBIDDEN: 'Quyền bị từ chối / Bạn không có đủ thẩm quyền thực hiện thao tác này.',
  ACCOUNT_INACTIVE:
    'Tài khoản của bạn đã bị khóa hoặc chưa được kích hoạt. Vui lòng liên hệ hỗ trợ.',
  UNAUTHORIZED:
    'Phiên đăng nhập đã hết hạn hoặc chưa được xác thực. Vui lòng đăng nhập lại.',
  INSUFFICIENT_ROLE:
    'Tài khoản không đủ thẩm quyền (chỉ dành riêng cho Quản trị viên / Nhân viên).',
  INSUFFICIENT_PERMISSIONS:
    'Bạn không có quyền thao tác trên chức năng này.',

  // ==========================================
  // ORDERS, RENTALS, TAILORS, PRODUCTS
  // ==========================================
  MISSING_CONTACT_INFO:
    'Vui lòng cung cấp họ tên và số điện thoại để nhân viên liên hệ tư vấn và xác nhận cọc may đo.',
  MISSING_MEASUREMENTS:
    'Vui lòng nhập chiều cao, cân nặng hoặc các số đo cơ bản khi đặt may đo.',
  INVALID_STATUS: 'Trạng thái cập nhật không nằm trong danh mục cho phép.',
  INVALID_DEPOSIT_STATUS:
    'Trạng thái cọc sai quy định (PENDING_DEPOSIT, DEPOSITED, REFUNDED).',
  INVALID_ORDER_TYPE: 'Loại đơn hàng không hợp lệ (BUY, RENT, TAILOR).',
  INVALID_PAYMENT_METHOD:
    'Phương thức thanh toán không hợp lệ (COD, BANK_TRANSFER, VNPAY).',
  TAILOR_ORDER_CANNOT_BE_CANCELLED:
    'Đơn may đo đã được xác nhận hoặc đang may, không thể tự hủy. Vui lòng gọi Hotline để được hỗ trợ.',
  RENTAL_CANNOT_BE_CANCELLED:
    'Đơn thuê trang phục đã được duyệt, không thể tự hủy.',
  ORDER_CANNOT_BE_CANCELLED:
    'Đơn hàng đã được xác nhận và đóng gói, không thể tự hủy.',
  TAILOR_ORDER_NOT_FOUND:
    'Không tìm thấy mã đơn may đo. Vui lòng kiểm tra lại chính xác mã TAILOR-...',
  RENTAL_NOT_FOUND:
    'Không tìm thấy lịch thuê trang phục với mã đã cung cấp.',
  ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng trong hệ thống.',
  PRODUCT_NOT_FOUND: 'Sản phẩm không tồn tại hoặc đã ngừng cung cấp.',
  PRODUCT_NOT_FOR_RENT:
    'Sản phẩm này hiện chỉ hỗ trợ bán đứt, không có sẵn cho thuê.',
  PRODUCT_HAS_ACTIVE_RENTALS:
    'Không thể xóa vĩnh viễn sản phẩm vì đang có hợp đồng thuê hoạt động của khách hàng.',
  RENTAL_SCHEDULE_CONFLICT:
    'Khung ngày bạn chọn đã bị khách khác đặt trước. Vui lòng chọn ngày khác.',
  RENTAL_SLOT_LOCKED:
    'Khung ngày này đang có người tiến hành giữ chỗ. Vui lòng thử lại sau 3-5 phút.',
  VALIDATION_ERROR: 'Dữ liệu không đúng định dạng. Vui lòng kiểm tra lại các trường thông tin.',
};

/**
 * Trích xuất lỗi từ ApiError hoặc Error bất kỳ thành cấu trúc ApiErrorResponse chuẩn
 */
export function parseApiError(error: unknown): ApiErrorResponse | null {
  if (error instanceof ApiError && error.response?.data) {
    const data = error.response.data;
    if (typeof data === 'object' && data !== null) {
      return data as ApiErrorResponse;
    }
  }

  // Tương thích thêm nếu có response.data từ Axios nếu dùng sau này
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const res = (error as { response?: { data?: unknown } }).response;
    if (res?.data && typeof res.data === 'object') {
      return res.data as ApiErrorResponse;
    }
  }

  return null;
}

/**
 * Lấy câu thông báo lỗi thân thiện để hiển thị Toast hoặc Alert
 */
export function getErrorMessage(error: unknown, fallbackMessage = 'Đã có lỗi xảy ra, vui lòng thử lại!'): string {
  const apiError = parseApiError(error);

  if (apiError) {
    // 1. Kiểm tra mã lỗi định danh từ bảng mã lỗi
    if (apiError.error_code && ERROR_CODE_MESSAGES[apiError.error_code]) {
      return ERROR_CODE_MESSAGES[apiError.error_code];
    }

    // 2. Ưu tiên message từ Backend
    if (apiError.message) {
      return apiError.message;
    }

    // 3. Fallback detail
    if (apiError.detail) {
      return apiError.detail;
    }

    // 4. Nếu là validation errors, lấy dòng đầu tiên
    if (apiError.details && apiError.details.length > 0) {
      const first = apiError.details[0];
      return first.field ? `${first.field}: ${first.message}` : first.message;
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
      return 'Không thể kết nối tới máy chủ Backend (FastAPI). Vui lòng đảm bảo server đang chạy tại http://127.0.0.1:8000.';
    }
    return error.message;
  }

  return fallbackMessage;
}

/**
 * Lấy chi tiết lỗi từng trường input khi submit form
 */
export function getFieldErrors(error: unknown): Record<string, string> {
  const apiError = parseApiError(error);
  const result: Record<string, string> = {};

  if (apiError?.details && Array.isArray(apiError.details)) {
    apiError.details.forEach((item: ErrorDetail) => {
      if (item.field) {
        result[item.field] = item.message;
      }
    });
  }

  return result;
}

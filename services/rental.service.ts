import { apiClient } from "@/lib/api-client";
import type {
  RentalAvailabilityCheckPayload,
  RentalAvailabilityResponse,
  RentalBookingCreatePayload,
  RentalBookingResponse,
  RentalBookingUpdateStatusPayload,
  RentalQueryParams,
} from "@/types/rental";

/**
 * Service gọi API Phân hệ Cho Thuê Trang Phục (Rentals)
 * Khớp chuẩn 100% với đặc tả Backend: docs-BE/rentals_api.md
 */
export const rentalService = {
  /**
   * Kiểm tra xem sản phẩm có trống lịch không
   * POST /api/v1/rentals/check-availability
   */
  async checkAvailability(
    payload: RentalAvailabilityCheckPayload
  ): Promise<RentalAvailabilityResponse> {
    const res = await apiClient.post<RentalAvailabilityResponse>(
      "/rentals/check-availability",
      payload
    );
    return res.data;
  },

  /**
   * Gửi yêu cầu đặt thuê trang phục
   * POST /api/v1/rentals/
   */
  async createBooking(
    payload: RentalBookingCreatePayload
  ): Promise<RentalBookingResponse> {
    const res = await apiClient.post<RentalBookingResponse>("/rentals/", payload);
    return res.data;
  },

  /**
   * Tra cứu công khai theo mã RENT-...
   * GET /api/v1/rentals/code/{booking_code}
   */
  async getBookingByCode(bookingCode: string): Promise<RentalBookingResponse> {
    const cleanCode = encodeURIComponent(bookingCode.trim());
    const res = await apiClient.get<RentalBookingResponse>(`/rentals/code/${cleanCode}`);
    return res.data;
  },

  /**
   * Lấy danh sách lịch thuê của tôi / tất cả đơn (Admin/Staff)
   * GET /api/v1/rentals/
   */
  async getMyRentals(params?: RentalQueryParams): Promise<RentalBookingResponse[]> {
    const res = await apiClient.get<RentalBookingResponse[]>("/rentals/", { params });
    return res.data || [];
  },

  /**
   * Xem chi tiết lịch thuê theo ID
   * GET /api/v1/rentals/{booking_id}
   */
  async getBookingById(bookingId: number): Promise<RentalBookingResponse> {
    const res = await apiClient.get<RentalBookingResponse>(`/rentals/${bookingId}`);
    return res.data;
  },

  /**
   * Hủy đơn thuê (khi đang PENDING)
   * POST /api/v1/rentals/{booking_id}/cancel
   */
  async cancelBooking(bookingId: number): Promise<RentalBookingResponse> {
    const res = await apiClient.post<RentalBookingResponse>(
      `/rentals/${bookingId}/cancel`
    );
    return res.data;
  },

  /**
   * Admin/Staff cập nhật trạng thái đơn & tiền cọc
   * PATCH /api/v1/rentals/{booking_id}/status
   */
  async updateRentalStatus(
    bookingId: number,
    payload: RentalBookingUpdateStatusPayload
  ): Promise<RentalBookingResponse> {
    const res = await apiClient.patch<RentalBookingResponse>(
      `/rentals/${bookingId}/status`,
      payload
    );
    return res.data;
  },
};

export default rentalService;

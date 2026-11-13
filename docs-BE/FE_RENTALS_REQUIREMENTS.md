# TÀI LIỆU ĐẶC TẢ TÍCH HỢP FRONTEND - MODULE CHO THUÊ TRANG PHỤC (RENTALS)
## RENTAL BOOKING & MANAGEMENT API SPECIFICATION FOR AI & FRONTEND DEVELOPER
**Dự án:** Hmong Fashion (H'Mông May) Backend API  
**Nền tảng Backend:** FastAPI + SQLAlchemy 2.0 + Redis Lock  
**Tài liệu dành cho:** AI Coding Assistant, Lập trình viên Frontend (React, Next.js, Vue, Nuxt,...)

---

## 1. TỔNG QUAN & PHẠM VI NGHIỆP VỤ (RENTALS OVERVIEW)

Module **Cho thuê trang phục (Rentals)** là một trong những tính năng kinh doanh cốt lõi của thương hiệu H'Mông May:
- Cho phép khách hàng thuê trang phục truyền thống và cách tân H'Mông theo ngày (chụp ảnh kỷ yếu, du lịch Sa Pa, Hà Giang, dự lễ hội...).
- **Kiểm tra trùng lịch (Overlap Check):** Không cho phép 2 khách hàng đặt cùng một trang phục trong các khoảng ngày giao nhau nếu đơn cũ đang ở trạng thái `PENDING`, `CONFIRMED`, hoặc `ACTIVE`.
- **Cơ chế Khóa giữ chỗ Redis (Redis Hold Lock):** Khi khách hàng tiến hành bấm đặt thuê, hệ thống tạm giữ chỗ 5 phút (300 giây) để tránh tình trạng nhiều người cùng thanh toán 1 trang phục tại 1 thời điểm.
- **Tính giá tự động:** `Tổng tiền = (Số ngày thuê) × rental_price_per_day`.
- **Vòng đời trạng thái đơn thuê (Status Lifecycle):**
  $$\text{PENDING} \longrightarrow \text{CONFIRMED} \longrightarrow \text{ACTIVE} \text{ (Đang mặc/Đã nhận)} \longrightarrow \text{RETURNED} \text{ (Đã trả)}$$
  *(Khách hàng có thể tự hủy đơn khi trạng thái còn là `PENDING`)*.
- **Quản lý tiền cọc (Deposit Management):** `PENDING_DEPOSIT` (Chờ cọc) $\rightarrow$ `DEPOSITED` (Đã cọc) $\rightarrow$ `REFUNDED` (Đã hoàn cọc sau khi kiểm tra đồ nguyên vẹn).

---

## 2. MA TRẬN PHÂN QUYỀN (RBAC MATRIX)

| Chức năng | Khách vãng lai (Guest) | Khách đăng nhập (`ROLE_CUSTOMER`) | Nhân viên (`ROLE_STAFF`) | Quản trị viên (`ROLE_ADMIN`) |
| :--- | :---: | :---: | :---: | :---: |
| **Kiểm tra lịch trống** | ✅ | ✅ | ✅ | ✅ |
| **Tạo yêu cầu thuê đồ** | ✅ *(Cung cấp Tên + SĐT)* | ✅ *(Tự điền thông tin)* | ✅ | ✅ |
| **Tra cứu đơn theo mã `RENT-...`** | ✅ | ✅ | ✅ | ✅ |
| **Xem danh sách đơn thuê của mình** | ❌ | ✅ | ✅ *(Xem toàn bộ)* | ✅ *(Xem toàn bộ)* |
| **Xem chi tiết đơn thuê** | Chỉ qua mã code | ✅ *(Đơn của mình)* | ✅ *(Tất cả)* | ✅ *(Tất cả)* |
| **Hủy đơn thuê** | ❌ *(Liên hệ hotline)* | ✅ *(Chỉ khi `PENDING`)* | ✅ *(Mọi trạng thái)* | ✅ *(Mọi trạng thái)* |
| **Duyệt đơn, xác nhận cọc, đổi trạng thái** | ❌ | ❌ | ✅ | ✅ |

---

## 3. TYPESCRIPT INTERFACES CHUẨN (DÀNH CHO AI & FE DEVELOPER)

```typescript
// ==========================================
// 1. Trạng thái Đơn thuê & Tiền cọc
// ==========================================
export type RentalStatus = 
  | 'PENDING'    // Mới tạo, chờ nhân viên xác nhận & kiểm tra cọc
  | 'CONFIRMED'  // Đã xác nhận đơn, sẵn sàng giao đồ
  | 'ACTIVE'     // Khách đã nhận đồ, đang trong thời gian thuê
  | 'RETURNED'   // Đã hoàn trả đồ nguyên vẹn
  | 'CANCELLED'; // Đã hủy đơn

export type RentalDepositStatus = 
  | 'PENDING_DEPOSIT' // Chưa đặt cọc
  | 'DEPOSITED'       // Đã nhận tiền cọc
  | 'REFUNDED';       // Đã hoàn trả cọc cho khách

// ==========================================
// 2. Request Payloads
// ==========================================
export interface RentalAvailabilityCheckPayload {
  product_id: number;
  start_date: string; // Định dạng YYYY-MM-DD (Bắt buộc)
  end_date: string;   // Định dạng YYYY-MM-DD (Bắt buộc)
}

export interface RentalBookingCreatePayload {
  product_id: number;
  start_date: string;           // YYYY-MM-DD
  end_date: string;             // YYYY-MM-DD
  customer_name?: string;       // Họ tên người thuê (nếu login có thể bỏ trống)
  customer_phone?: string;      // SĐT người thuê (nếu login có thể bỏ trống)
  total_price?: number;         // Tùy chọn, để 0 hoặc bỏ qua để backend tự tính
  deposit_amount?: number;      // Tiền cọc thỏa thuận ban đầu (mặc định 0)
}

export interface RentalBookingUpdateStatusPayload {
  status?: RentalStatus;
  deposit_amount?: number;
  deposit_status?: RentalDepositStatus;
  staff_notes?: string;
}

// ==========================================
// 3. Response Models
// ==========================================
export interface RentalAvailabilityResponse {
  product_id: number;
  is_available: boolean;
  message: string;
}

export interface RentalBooking {
  id: number;
  booking_code: string;         // Mã định danh dạng RENT-YYYYMMDD-XXXX
  user_id: number | null;
  product_id: number;
  customer_name: string;
  customer_phone: string;
  start_date: string;           // YYYY-MM-DD
  end_date: string;             // YYYY-MM-DD
  total_price: number;          // Tổng giá tiền thuê
  deposit_amount: number;       // Số tiền cọc
  deposit_status: RentalDepositStatus;
  status: RentalStatus;
  staff_notes: string | null;   // Ghi chú của nhân viên về tình trạng đồ
  created_at: string;           // ISO 8601 UTC
  updated_at: string | null;    // ISO 8601 UTC
}

// ==========================================
// 4. Chuẩn phản hồi lỗi Backend
// ==========================================
export interface AppErrorResponse {
  success: boolean;
  status_code: number;
  error_code: string;
  message: string;
  details?: Array<{
    field?: string;
    location?: string;
    message: string;
  }>;
}
```

---

## 4. CHI TIẾT CÁC ENDPOINT API CHO THUÊ TRANG PHỤC

### 4.1. Kiểm tra lịch trống trang phục (Check Availability)
* **Phương thức:** `POST`
* **Đường dẫn:** `/api/v1/rentals/check-availability`
* **Xác thực:** Công khai (Public).
* **Request Body:**
  ```json
  {
    "product_id": 12,
    "start_date": "2026-12-01",
    "end_date": "2026-12-03"
  }
  ```
* **Success Response (`200 OK`):**
  * *Nếu còn trống:*
    ```json
    {
      "product_id": 12,
      "is_available": true,
      "message": "Lịch thuê còn trống, có thể đặt lịch."
    }
    ```
  * *Nếu đã có người thuê trùng ngày:*
    ```json
    {
      "product_id": 12,
      "is_available": false,
      "message": "Sản phẩm đã có lịch thuê trong khoảng thời gian này."
    }
    ```
* **Lỗi `400 Bad Request`:** `INVALID_DATE_RANGE` ("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.").

---

### 4.2. Tạo đơn đặt thuê trang phục (Create Booking)
* **Phương thức:** `POST`
* **Đường dẫn:** `/api/v1/rentals/`
* **Xác thực:** Tùy chọn (Optional Auth).
  * Nếu đã đăng nhập (`Bearer Token`): Tự động liên kết `user_id`, tự lấy `customer_name` và `customer_phone` từ profile nếu FE không truyền.
  * Nếu là khách vãng lai (Guest): **Bắt buộc** truyền `customer_name` và `customer_phone`.
* **Request Body:**
  ```json
  {
    "product_id": 12,
    "customer_name": "Trần Thị Lan",
    "customer_phone": "0987654321",
    "start_date": "2026-12-01",
    "end_date": "2026-12-03",
    "deposit_amount": 200000
  }
  ```
* **Success Response:** `201 Created` $\rightarrow$ Trả về `RentalBooking` (có `booking_code` ví dụ `RENT-20261113-B4C1A9`).
* **Các lỗi nghiệp vụ cần xử lý:**
  * `400 Bad Request` $\rightarrow$ `PRODUCT_NOT_FOR_RENT`: Sản phẩm không hỗ trợ cho thuê hoặc đang bị ẩn (`is_active=false`).
  * `400 Bad Request` $\rightarrow$ `MISSING_CONTACT_INFO`: Chưa cung cấp tên và số điện thoại liên hệ.
  * `409 Conflict` $\rightarrow$ `RENTAL_SCHEDULE_CONFLICT`: "Sản phẩm đã được đặt thuê trong khoảng thời gian này."
  * `429 Too Many Requests` $\rightarrow$ `RENTAL_SLOT_LOCKED`: "Đang có người giữ chỗ khung giờ này qua Redis. Vui lòng thử lại sau giây lát (trong vòng 5 phút)."

---

### 4.3. Tra cứu đơn thuê theo mã (Public Tracking by Code)
* **Phương thức:** `GET`
* **Đường dẫn:** `/api/v1/rentals/code/{booking_code}`
* **Xác thực:** Công khai (Public).
* **Ví dụ:** `GET /api/v1/rentals/code/RENT-20261113-B4C1A9`
* **Success Response:** `200 OK` $\rightarrow$ Trả về `RentalBooking`.
* **Error Response:** `404 Not Found` $\rightarrow$ `RENTAL_NOT_FOUND` ("Không tìm thấy đơn thuê với mã đã cung cấp").

---

### 4.4. Lấy danh sách đơn thuê (List Bookings)
* **Phương thức:** `GET`
* **Đường dẫn:** `/api/v1/rentals/`
* **Xác thực:** Bắt buộc đăng nhập (`Bearer Token`).
* **Hành vi theo vai trò (RBAC):**
  * Khách hàng (`ROLE_CUSTOMER`): **Chỉ xem được các đơn thuê do chính mình đặt** (backend tự filter theo `current_user.id`).
  * Quản trị viên & Nhân viên (`ROLE_ADMIN`, `ROLE_STAFF`): Xem được **toàn bộ đơn của mọi khách hàng**.
* **Query Parameters (Hỗ trợ lọc & phân trang):**
  * `product_id` *(int, optional)*: Lọc đơn của sản phẩm cụ thể.
  * `order_status` *(string, optional)*: Lọc theo trạng thái (`PENDING`, `CONFIRMED`, `ACTIVE`, `RETURNED`, `CANCELLED`).
  * `customer_phone` *(string, optional, chỉ Admin/Staff)*: Tìm theo SĐT khách.
  * `skip` *(int, default 0)*, `limit` *(int, default 50, max 100)*.
* **Success Response:** `200 OK` $\rightarrow$ `RentalBooking[]`.

---

### 4.5. Xem chi tiết đơn thuê theo ID
* **Phương thức:** `GET`
* **Đường dẫn:** `/api/v1/rentals/{booking_id}`
* **Xác thực:** Bắt buộc đăng nhập. Khách hàng chỉ xem được đơn của mình (nếu xem đơn người khác nhận `403 Forbidden`).
* **Success Response:** `200 OK` $\rightarrow$ `RentalBooking`.

---

### 4.6. Cập nhật trạng thái đơn thuê & Tiền cọc (Staff/Admin Only)
* **Phương thức:** `PATCH`
* **Đường dẫn:** `/api/v1/rentals/{booking_id}/status`
* **Xác thực:** Bắt buộc quyền `ROLE_ADMIN` hoặc `ROLE_STAFF`.
* **Request Body:**
  ```json
  {
    "status": "CONFIRMED",
    "deposit_amount": 200000,
    "deposit_status": "DEPOSITED",
    "staff_notes": "Đã nhận cọc chuyển khoản qua ngân hàng, hẹn 8h sáng mai lấy đồ."
  }
  ```
* **Success Response:** `200 OK` $\rightarrow$ `RentalBooking`.
* **Lỗi thường gặp:**
  * `400 Bad Request` $\rightarrow$ `INVALID_STATUS` hoặc `INVALID_DEPOSIT_STATUS`.

---

### 4.7. Hủy đơn thuê (Cancel Booking)
* **Phương thức:** `POST`
* **Đường dẫn:** `/api/v1/rentals/{booking_id}/cancel`
* **Xác thực:** Bắt buộc đăng nhập.
* **Quy tắc nghiệp vụ:**
  * Khách hàng chỉ được hủy khi đơn ở trạng thái **`PENDING`**. Nếu đơn đã `CONFIRMED` hoặc `ACTIVE`, backend trả về `400 Bad Request` (`RENTAL_CANNOT_BE_CANCELLED`: "Đơn thuê đã được xác nhận hoặc đang hoạt động, không thể tự hủy. Vui lòng liên hệ hotline/nhân viên.").
  * Quản trị viên/Nhân viên có quyền hủy ở bất kỳ giai đoạn nào.
* **Success Response:** `200 OK` $\rightarrow$ `RentalBooking` (status chuyển thành `CANCELLED`).

---

## 5. THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX SPECS)

### 5.1. Khối Đặt Thuê trên Trang Chi Tiết Sản Phẩm (Client Rental Widget)
* **Bộ chọn khoảng ngày thuê (Date Range Picker):**
  * Không cho chọn ngày trong quá khứ (`minDate = today`).
  * Khi chọn ngày xong, FE tự động trigger hàm kiểm tra hoặc hiển thị nút **"Kiểm tra lịch trống"**.
* **Bảng tính tiền tức thì (Real-time Price Breakdown):**
  * Số ngày thuê = $(End - Start) + 1$ ngày.
  * Hiển thị công thức: `Số ngày × Giá thuê/ngày = Tổng tiền thuê`.
  * Tiền cọc quy định (ví dụ: hiển thị gợi ý cọc 30% - 50% giá trị hoặc mức cọc cố định).
* **Trạng thái giữ chỗ Redis (Lock Feedback):**
  * Nếu API trả về `429 RENTAL_SLOT_LOCKED`: Hiển thị thông báo màu vàng: *"Đang có khách hàng giữ chỗ khung giờ này. Vui lòng thử lại sau 3-5 phút hoặc chọn ngày khác."*
* **Xác nhận đặt thuê thành công:**
  * Hiển thị Modal Popup chúc mừng kèm:
    * **Mã đặt thuê (Booking Code):** Có nút sao chép nhanh (Copy to clipboard).
    * Thông tin tài khoản ngân hàng của shop để khách chuyển khoản cọc.
    * Nút "Tra cứu đơn thuê" hoặc "Xem lịch sử đơn của tôi".

### 5.2. Trang Tra Cứu Đơn Thuê Công Khai (`/rentals/lookup`)
* Một ô Input lớn nhập mã đơn: placeholder `"Nhập mã đơn ví dụ: RENT-20261113-..."`.
* **Trình theo dõi tiến độ (Status Stepper / Timeline):**
  * Bước 1: Tiếp nhận đơn (`PENDING`)
  * Bước 2: Đã xác nhận & Đặt cọc (`CONFIRMED`)
  * Bước 3: Đã giao đồ cho khách (`ACTIVE`)
  * Bước 4: Hoàn tất & Trả cọc (`RETURNED`)
* Hiển thị chi tiết: Tên trang phục, ngày bắt đầu - ngày kết thúc, số tiền thuê, tình trạng cọc.

### 5.3. Màn hình Quản lý Lịch Thuê dành cho Nhân viên/Admin (`/admin/rentals`)
* **Chế độ xem kép (Dual View):**
  * **Dạng Lịch (Calendar View):** Hiển thị theo tháng/tuần, các thanh màu biểu diễn khoảng thời gian đồ đang được thuê. Giúp nhân viên tránh trùng lịch và chuẩn bị giặt là trang phục trước ngày giao.
  * **Dạng Bảng (Data Table View):**
    * Cột: Mã đơn, Khách hàng & SĐT, Trang phục (link sang sản phẩm), Thời gian thuê (`start_date` $\rightarrow$ `end_date`), Tổng tiền, Trạng thái cọc (Badge: `PENDING_DEPOSIT` - Vàng, `DEPOSITED` - Xanh lá, `REFUNDED` - Xanh dương), Trạng thái đơn (Badge màu tương ứng).
    * Cột Thao tác: Nút "Xử lý đơn" mở Modal.
* **Modal Xử lý Đơn Thuê (Quick Update Modal):**
  * Chuyển đổi trạng thái đơn hàng (Dropdown).
  * Cập nhật số tiền cọc thực tế đã nhận và trạng thái cọc.
  * Ô nhập "Ghi chú nhân viên" (Ví dụ: *"Khách báo trễ 2 tiếng"*, *"Đồ bị rách nhẹ ở viền váy, trừ 50k tiền cọc"*).

---

## 6. BẢNG MÃ LỖI NGHIỆP VỤ MODULE CHO THUÊ (ERROR CODES DICTIONARY)

| Mã lỗi (`error_code`) | HTTP Status | Nguyên nhân | Hướng xử lý trên FE |
| :--- | :---: | :--- | :--- |
| `INVALID_DATE_RANGE` | 400 | Ngày bắt đầu > ngày kết thúc hoặc sai định dạng. | Báo lỗi đỏ tại Date Picker, vô hiệu hóa nút Tiếp tục. |
| `PRODUCT_NOT_FOR_RENT` | 400 | Sản phẩm chỉ bán chứ không cho thuê (`rental_price_per_day <= 0`) hoặc đã bị ẩn. | Ẩn tab "Đặt thuê" trên trang chi tiết sản phẩm. |
| `MISSING_CONTACT_INFO` | 400 | Chưa nhập họ tên hoặc số điện thoại người thuê. | Focus vào ô nhập Họ tên / SĐT còn thiếu. |
| `RENTAL_SCHEDULE_CONFLICT` | 409 | Khoảng ngày chọn đã có đơn thuê khác đang hoạt động. | Hiển thị Banner cảnh báo trùng lịch, gợi ý chọn ngày khác. |
| `RENTAL_SLOT_LOCKED` | 429 | Redis đang khóa giữ chỗ tạm thời do có người đang thao tác. | Hiển thị Toast cảnh báo giữ chỗ, đếm ngược thử lại sau 3-5 phút. |
| `RENTAL_NOT_FOUND` | 404 | Không tìm thấy mã đơn hoặc ID đơn thuê. | Hiển thị màn hình Empty State "Mã đơn không tồn tại". |
| `RENTAL_CANNOT_BE_CANCELLED` | 400 | Khách hàng tự bấm hủy khi đơn đã được duyệt (`CONFIRMED`/`ACTIVE`). | Hiển thị Dialog: "Đơn đã duyệt, vui lòng gọi hotline để được hỗ trợ hủy/đổi lịch". |
| `INSUFFICIENT_PERMISSIONS` | 403 | Xem hoặc thao tác trên đơn thuê của tài khoản khác. | Toast cảnh báo từ chối truy cập. |

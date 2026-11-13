# TÀI LIỆU ĐẶC TẢ TÍCH HỢP FRONTEND - MODULE MAY ĐO THEO YÊU CẦU (TAILORS)
## CUSTOM TAILORING SERVICE API SPECIFICATION FOR AI & FRONTEND DEVELOPER
**Dự án:** Hmong Fashion (H'Mông May) Backend API  
**Nền tảng Backend:** FastAPI + SQLAlchemy 2.0 + Media Storage  
**Tài liệu dành cho:** AI Coding Assistant, Lập trình viên Frontend (React, Next.js, Vue, Nuxt,...)

---

## 1. TỔNG QUAN & PHẠM VI NGHIỆP VỤ (TAILORING OVERVIEW)

Module **May đo theo yêu cầu (Tailors)** cung cấp dịch vụ may trang phục thổ cẩm H'Mông thủ công theo phom dáng và số đo riêng của từng khách hàng:
- **Tải ảnh mẫu thiết kế tự do:** Khách hàng có thể chọn mẫu có sẵn trên hệ thống (`design_code`) hoặc tải lên ảnh trang phục mẫu tự thiết kế/sưu tầm qua module Media (`folder="tailors"` - không yêu cầu đăng nhập).
- **Bộ số đo nhân trắc học chi tiết:** Lưu trữ cấu trúc JSON linh hoạt (`measurements`) bao gồm: chiều cao, cân nặng, vòng 1 (ngực), vòng 2 (eo), vòng 3 (mông), rộng vai, dài tay, dài áo/váy và ghi chú phom dáng.
- **Quy trình tư vấn & chốt giá 2 bước:**
  1. Khách gửi yêu cầu với giá dự kiến = 0đ (`PENDING_CONFIRMATION`).
  2. Nhân viên xưởng gọi điện tư vấn chất liệu thổ cẩm, thỏa thuận giá chính thức (`estimated_price`) và nhận tiền cọc (`deposit_amount`).
- **Vòng đời tiến độ may đo (Status Lifecycle):**
  $$\text{PENDING\_CONFIRMATION} \longrightarrow \text{CONFIRMED} \longrightarrow \text{MEASURING} \longrightarrow \text{IN\_PROGRESS} \longrightarrow \text{READY} \longrightarrow \text{DELIVERED}$$
  *(Trạng thái `CANCELLED` chỉ được thực hiện bởi khách khi đơn còn đang ở bước `PENDING_CONFIRMATION`)*.
- **Tra cứu công khai:** Khách vãng lai có thể tra cứu toàn bộ tiến độ, giá chốt, tiền cọc qua mã đơn dạng `TAILOR-YYYYMMDD-XXXX`.

---

## 2. MA TRẬN PHÂN QUYỀN (RBAC MATRIX)

| Chức năng | Khách vãng lai (Guest) | Khách đăng nhập (`ROLE_CUSTOMER`) | Nhân viên (`ROLE_STAFF`) | Quản trị viên (`ROLE_ADMIN`) |
| :--- | :---: | :---: | :---: | :---: |
| **Upload ảnh mẫu may đo** | ✅ *(Folder `tailors`)* | ✅ | ✅ | ✅ |
| **Gửi yêu cầu may đo** | ✅ *(Cung cấp Tên + SĐT)* | ✅ *(Tự điền thông tin)* | ✅ | ✅ |
| **Tra cứu đơn theo mã `TAILOR-...`** | ✅ | ✅ | ✅ | ✅ |
| **Xem danh sách đơn may của mình** | ❌ | ✅ | ✅ *(Toàn hệ thống)* | ✅ *(Toàn hệ thống)* |
| **Xem chi tiết đơn may đo** | Chỉ qua mã code | ✅ *(Đơn của mình)* | ✅ *(Tất cả)* | ✅ *(Tất cả)* |
| **Khách tự hủy yêu cầu** | ❌ *(Liên hệ hotline)* | ✅ *(Chỉ khi `PENDING_CONFIRMATION`)* | ✅ *(Mọi trạng thái)* | ✅ *(Mọi trạng thái)* |
| **Chốt giá, cập nhật cọc & tiến độ** | ❌ | ❌ | ✅ | ✅ |

---

## 3. TYPESCRIPT INTERFACES CHUẨN (DÀNH CHO AI & FE DEVELOPER)

```typescript
// ==========================================
// 1. Trạng thái Quy trình May đo & Tiền cọc
// ==========================================
export type TailorStatus =
  | 'PENDING_CONFIRMATION' // Mới gửi yêu cầu, chờ nhân viên xưởng gọi điện tư vấn
  | 'CONFIRMED'            // Đã tư vấn, chốt giá và thỏa thuận may
  | 'MEASURING'            // Đang lấy số đo chuẩn / lên rập thiết kế
  | 'IN_PROGRESS'          // Thợ may đang cắt vải, dệt/thêu hoa văn thổ cẩm
  | 'READY'                // Hoàn thiện trang phục, đóng gói chờ giao
  | 'DELIVERED'            // Đã giao trang phục tận tay khách hàng
  | 'CANCELLED';           // Đã hủy đơn

export type TailorDepositStatus =
  | 'PENDING_DEPOSIT'      // Chờ chuyển khoản tiền cọc
  | 'DEPOSITED'            // Đã nhận đủ tiền cọc
  | 'REFUNDED';            // Đã hoàn cọc (nếu hủy đơn hợp lệ)

// ==========================================
// 2. Chi tiết Số đo cơ thể (Measurements Detail)
// ==========================================
export interface MeasurementDetail {
  height?: number;         // Chiều cao (cm) [50 - 250]
  weight?: number;         // Cân nặng (kg) [20 - 300]
  bust?: number;           // Vòng 1 - Ngực (cm) [40 - 200]
  waist?: number;          // Vòng 2 - Eo (cm) [30 - 200]
  hips?: number;           // Vòng 3 - Mông (cm) [40 - 200]
  shoulder_width?: number; // Rộng vai (cm)
  arm_length?: number;     // Dài tay (cm)
  dress_length?: number;   // Dài áo / Dài váy (cm)
  extra_notes?: string;    // Dáng người đặc thù (ngực nở, lưng dài, vai xuôi...)
}

// ==========================================
// 3. Request Payloads
// ==========================================
export interface TailorOrderCreatePayload {
  customer_name?: string;       // Họ tên (tự lấy từ user nếu đã login)
  customer_phone?: string;      // SĐT liên lạc (bắt buộc để nhân viên gọi)
  customer_address?: string;    // Địa chỉ nhận đồ sau khi may xong
  
  height?: number;              // Chiều cao cơ thể (cm)
  weight?: number;              // Cân nặng cơ thể (kg)
  
  design_code: string;          // Mã mẫu (VD: "HMONG-HOA-01" hoặc "CUSTOM")
  design_image_url?: string;    // URL ảnh mẫu khách upload qua /api/v1/media/upload
  measurements?: MeasurementDetail;
  notes?: string;               // Yêu cầu chi tiết về vải lanh, màu chàm, họa tiết thêu
}

export interface TailorOrderUpdateStatusPayload {
  status?: TailorStatus;
  estimated_price?: number;     // Giá may chốt chính thức sau tư vấn (VNĐ)
  deposit_amount?: number;      // Số tiền cọc đã thu (VNĐ)
  deposit_status?: TailorDepositStatus;
  staff_notes?: string;         // Ghi chú của thợ may / nhân viên tư vấn
}

// ==========================================
// 4. Response Models
// ==========================================
export interface TailorOrder {
  id: number;
  order_code: string;           // Mã vận đơn: TAILOR-YYYYMMDD-XXXX
  user_id: number | null;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  design_code: string;
  design_image_url: string | null;
  measurements: MeasurementDetail;
  notes: string | null;
  estimated_price: number;      // Giá chính thức sau khi chốt
  deposit_amount: number;       // Số tiền cọc đã nộp
  deposit_status: TailorDepositStatus;
  status: TailorStatus;
  staff_notes: string | null;
  created_at: string;           // ISO 8601 UTC
  updated_at: string | null;    // ISO 8601 UTC
}

// ==========================================
// 5. Chuẩn phản hồi lỗi Backend
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

## 4. QUY TRÌNH TẢI ẢNH MẪU MAY ĐO (MEDIA INTEGRATION)

Khách hàng gửi mẫu thiết kế tự sưu tầm có thể upload ảnh trực tiếp lên hệ thống mà **không cần đăng nhập tài khoản**:

1. **Gọi API Upload Media:**
   * **URL:** `POST /api/v1/media/upload`
   * **Content-Type:** `multipart/form-data`
   * **Form Fields:**
     * `file`: Tệp ảnh mẫu (`.jpg`, `.png`, `.webp`)
     * `folder`: Giá trị bắt buộc truyền là `"tailors"`
     * `alt_text`: Tên mô tả mẫu (tùy chọn)
2. **Nhận Response:**
   ```json
   {
     "id": 85,
     "filename": "mau_vay_hmong_den_2026.png",
     "url": "/uploads/tailors/mau_vay_hmong_den_2026.png",
     "folder": "tailors",
     "media_type": "IMAGE"
   }
   ```
3. **Gắn vào yêu cầu may đo:**
   * Truyền giá trị `url` nhận được vào trường `design_image_url` khi gửi `POST /api/v1/tailors/`.

---

## 5. CHI TIẾT CÁC ENDPOINT API MAY ĐO

### 5.1. Gửi yêu cầu đặt may đo trang phục (Create Tailor Order)
* **Phương thức:** `POST`
* **Đường dẫn:** `/api/v1/tailors/`
* **Xác thực:** Công khai (Optional Auth).
  * Nếu đăng nhập: Tự động gán `user_id`, tự điền tên, SĐT, địa chỉ từ hồ sơ nếu FE không gửi đè.
  * Nếu là khách vãng lai (Guest): **Bắt buộc** điền `customer_name` và `customer_phone`.
* **Ràng buộc số đo:** Bắt buộc có thông tin `height` hoặc ít nhất một trường trong `measurements`.
* **Request Body (JSON):**
  ```json
  {
    "customer_name": "Sùng Thị Mái",
    "customer_phone": "0912345678",
    "customer_address": "Bản Cát Cát, Sa Pa, Lào Cai",
    "design_code": "HMONG-HOA-DAI-02",
    "design_image_url": "/uploads/tailors/sample_dress.jpg",
    "height": 160,
    "weight": 50,
    "measurements": {
      "bust": 86,
      "waist": 68,
      "hips": 92,
      "shoulder_width": 38,
      "arm_length": 54,
      "dress_length": 110,
      "extra_notes": "Thắt lưng thổ cẩm bản to 8cm, hoa văn con chim én thêu chỉ đỏ"
    },
    "notes": "Ưu tiên vải lanh nhuộm chàm truyền thống, không dùng vải bóng nhân tạo."
  }
  ```
* **Success Response:** `201 Created` $\rightarrow$ Trả về `TailorOrder` (kèm `order_code` dạng `TAILOR-20261113-7A9B12`, trạng thái `PENDING_CONFIRMATION`).
* **Lỗi thường gặp:**
  * `400 Bad Request` $\rightarrow$ `MISSING_CONTACT_INFO`: Chưa nhập họ tên hoặc số điện thoại.
  * `400 Bad Request` $\rightarrow$ `MISSING_MEASUREMENTS`: Không có chiều cao hoặc số đo cơ thể nào được cung cấp.

---

### 5.2. Tra cứu tiến độ đơn may đo theo mã (Public Tracking by Code)
* **Phương thức:** `GET`
* **Đường dẫn:** `/api/v1/tailors/code/{order_code}`
* **Xác thực:** Công khai (Public).
* **Ví dụ:** `GET /api/v1/tailors/code/TAILOR-20261113-7A9B12`
* **Success Response:** `200 OK` $\rightarrow$ Trả về `TailorOrder`.
* **Error Response:** `404 Not Found` $\rightarrow$ `TAILOR_ORDER_NOT_FOUND` ("Không tìm thấy đơn may đo với mã đã cung cấp").

---

### 5.3. Lấy danh sách đơn đặt may đo (List Orders)
* **Phương thức:** `GET`
* **Đường dẫn:** `/api/v1/tailors/`
* **Xác thực:** Bắt buộc đăng nhập (`Bearer Token`).
* **Phân quyền theo vai trò (RBAC):**
  * Khách hàng (`ROLE_CUSTOMER`): Chỉ xem các đơn may do chính mình tạo.
  * Quản trị viên & Nhân viên (`ROLE_ADMIN`, `ROLE_STAFF`): Xem được toàn bộ đơn may trong hệ thống.
* **Query Parameters (Bộ lọc & Phân trang):**
  * `design_code` *(string, optional)*: Lọc theo mã mẫu.
  * `order_status` *(string, optional)*: Lọc theo tiến độ (`PENDING_CONFIRMATION`, `CONFIRMED`, `MEASURING`, `IN_PROGRESS`, `READY`, `DELIVERED`, `CANCELLED`).
  * `customer_phone` *(string, optional, chỉ Admin/Staff)*: Lọc theo SĐT khách.
  * `skip` *(int, default 0)*, `limit` *(int, default 50)*.
* **Success Response:** `200 OK` $\rightarrow$ `TailorOrder[]`.

---

### 5.4. Xem chi tiết đơn may đo theo ID
* **Phương thức:** `GET`
* **Đường dẫn:** `/api/v1/tailors/{order_id}`
* **Xác thực:** Bắt buộc đăng nhập (Khách hàng chỉ xem được đơn của mình, nếu không nhận `403 Forbidden`).
* **Success Response:** `200 OK` $\rightarrow$ `TailorOrder`.

---

### 5.5. Cập nhật tiến độ may đo, chốt giá & tiền cọc (Staff/Admin Only)
* **Phương thức:** `PATCH`
* **Đường dẫn:** `/api/v1/tailors/{order_id}/status`
* **Xác thực:** Bắt buộc quyền `ROLE_ADMIN` hoặc `ROLE_STAFF`.
* **Request Body:**
  ```json
  {
    "status": "IN_PROGRESS",
    "estimated_price": 3200000,
    "deposit_amount": 1000000,
    "deposit_status": "DEPOSITED",
    "staff_notes": "Đã chốt vải lanh dệt tay Sa Pa, khách đã cọc 1 triệu qua chuyển khoản. Hẹn hoàn thành ngày 25/11."
  }
  ```
* **Success Response:** `200 OK` $\rightarrow$ `TailorOrder`.
* **Lỗi:** `400 Bad Request` $\rightarrow$ `INVALID_STATUS` hoặc `INVALID_DEPOSIT_STATUS`.

---

### 5.6. Hủy yêu cầu đặt may (Cancel Order)
* **Phương thức:** `POST`
* **Đường dẫn:** `/api/v1/tailors/{order_id}/cancel`
* **Xác thực:** Bắt buộc đăng nhập.
* **Quy tắc nghiệp vụ:**
  * Khách hàng chỉ có thể tự hủy đơn khi trạng thái vẫn đang là **`PENDING_CONFIRMATION`** (chưa chốt cắt may).
  * Nếu đơn đã được xác nhận hoặc đang may (`CONFIRMED`, `MEASURING`, `IN_PROGRESS`), hệ thống trả về lỗi `400 Bad Request` (`TAILOR_ORDER_CANNOT_BE_CANCELLED`: "Đơn may đo đã được xác nhận hoặc đang tiến hành may, không thể tự hủy. Vui lòng liên hệ nhân viên tư vấn.").
  * Quản trị viên/Nhân viên có quyền hủy ở bất kỳ trạng thái nào.
* **Success Response:** `200 OK` $\rightarrow$ `TailorOrder` (`status = CANCELLED`).

---

## 6. THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX SPECS)

### 6.1. Form Đặt May Đo Trực Tuyến (Multi-Step Form Wizard)
Form được chia làm 3 bước rõ ràng giúp khách hàng không bị ngợp:
* **Bước 1: Chọn mẫu thiết kế & Phong cách**
  * Danh sách thẻ mẫu có sẵn (Click chọn tự động điền `design_code`).
  * Hoặc Upload ảnh mẫu riêng của khách (gọi ngầm `POST /api/v1/media/upload` với `folder="tailors"`, hiển thị preview ảnh sắc nét).
  * Textarea ghi chú hoa văn thêu, màu sắc thổ cẩm.
* **Bước 2: Hướng dẫn & Nhập số đo nhân trắc học**
  * **Hình minh họa tương tác (Body Diagram Graphic):** Hình phác thảo cơ thể người với các điểm chỉ rõ vị trí đo (vòng ngực, vòng eo ngang rốn, vòng mông, độ dài tay).
  * 2 ô bắt buộc: Chiều cao (cm), Cân nặng (kg).
  * Các ô số đo chi tiết (ngực, eo, mông, vai, dài váy): Có nút chuyển đổi đơn vị cm, placeholder gợi ý chuẩn.
* **Bước 3: Thông tin giao hàng & Xác nhận**
  * Nhập Họ tên, Số điện thoại (tự động điền nếu đã đăng nhập).
  * Địa chỉ nhận đồ may.
  * Hộp thông tin thông báo: *"Đơn may đo không thu phí ngay. Sau khi gửi, nhân viên xưởng H'Mông May sẽ liên hệ trong 24h để tư vấn chất liệu, báo giá và hướng dẫn đặt cọc."*
* **Màn hình thành công:**
  * Hiển thị mã `TAILOR-YYYYMMDD-XXXX` có nút copy.
  * Nút "Tra cứu tiến độ may" hoặc "Về trang chủ".

### 6.2. Trang Tra Cứu Tiến Độ May Đo Công Khai (`/tailors/tracking`)
* **Ô tìm kiếm lớn:** Nhập mã đơn may đo.
* **Tiến trình may đo trực quan (Progress Stepper 6 bước):**
  1. `Tiếp nhận yêu cầu` (Icon danh sách)
  2. `Tư vấn & Chốt giá` (Icon điện thoại)
  3. `Lấy số đo & Lên rập` (Icon thước dây)
  4. `Đang may & Thêu hoa văn` (Icon máy may / cuộn chỉ)
  5. `Trang phục hoàn thiện` (Icon váy hoàn chỉnh)
  6. `Đã giao hàng` (Icon xe giao hàng)
* **Card thông tin tóm tắt:** Ảnh mẫu thiết kế, số tiền may chốt (`estimated_price`), số tiền cọc đã đóng (`deposit_amount`), ghi chú mới nhất từ thợ may (`staff_notes`).

### 6.3. Màn hình Quản Lý Đơn May Đo cho Xưởng & Nhân viên (`/admin/tailors`)
* **Bảng danh sách đơn may đo:**
  * Cột: Mã đơn, Khách hàng & SĐT (nút gọi nhanh), Mẫu thiết kế (thumbnail ảnh mẫu), Số đo tóm tắt (Cao/Nặng/3 vòng), Giá chốt, Trạng thái cọc, Trạng thái tiến độ (Badge màu), Thao tác.
* **Drawer / Modal Cập nhật Tiến độ & Thỏa thuận giá:**
  * Hiển thị toàn bộ bảng số đo chi tiết dạng Grid.
  * Nút cập nhật trạng thái đơn (Dropdown 6 trạng thái).
  * Ô nhập giá may chốt chính thức sau cuộc gọi.
  * Ô nhập tiền cọc đã nhận và chọn trạng thái `DEPOSITED`.
  * Ô ghi chú của thợ may (staff_notes).

---

## 7. BẢNG MÃ LỖI NGHIỆP VỤ MODULE MAY ĐO (ERROR CODES DICTIONARY)

| Mã lỗi (`error_code`) | HTTP Status | Nguyên nhân | Hướng xử lý trên FE |
| :--- | :---: | :--- | :--- |
| `MISSING_CONTACT_INFO` | 400 | Khách không nhập họ tên hoặc số điện thoại. | Báo đỏ dưới ô Họ tên / SĐT, focus vào trường bị thiếu. |
| `MISSING_MEASUREMENTS` | 400 | Không cung cấp chiều cao hoặc bất kỳ số đo nào. | Hiển thị cảnh báo: "Vui lòng nhập chiều cao hoặc số đo cơ bản để tiếp tục". |
| `TAILOR_ORDER_NOT_FOUND` | 404 | Sai mã đơn hoặc ID đơn không tồn tại. | Hiển thị màn hình Không tìm thấy đơn may đo. |
| `TAILOR_ORDER_CANNOT_BE_CANCELLED` | 400 | Khách tự bấm hủy khi đơn đã được duyệt hoặc đang may. | Bật Dialog: "Đơn may đã được xưởng cắt may. Vui lòng liên hệ nhân viên để được hỗ trợ!". |
| `INVALID_STATUS` | 400 | Truyền trạng thái quy trình không hợp lệ. | Kiểm tra lại giá trị enum `TailorStatus`. |
| `INVALID_DEPOSIT_STATUS` | 400 | Truyền trạng thái cọc không hợp lệ. | Kiểm tra lại giá trị enum `TailorDepositStatus`. |
| `INSUFFICIENT_PERMISSIONS` | 403 | Xem đơn may đo của khách hàng khác khi không phải Staff/Admin. | Chặn hiển thị, Toast báo lỗi quyền truy cập. |

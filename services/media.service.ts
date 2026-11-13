import { apiClient, API_BASE_URL, getImageUrl } from '@/lib/api-client';
import {
  MediaFile,
  MediaFolder,
  MediaListParams,
  MediaUpdateRequest,
} from '@/types/media';

/**
 * Service quản lý gọi API Phân hệ Media Management
 * Tuân thủ chuẩn RESTful API từ FastAPI Backend:
 * - POST /api/v1/media/upload
 * - GET /api/v1/media/list
 * - GET /api/v1/media/{id}
 * - PUT /api/v1/media/{id}
 * - DELETE /api/v1/media/{id}
 */
export const mediaService = {
  /**
   * Helper chuyển đường dẫn tương đối từ backend thành URL tuyệt đối
   */
  getImageUrl,
  resolveUrl: getImageUrl,

  /**
   * Upload tệp tin đơn lẻ lên hệ thống (hỗ trợ theo dõi tiến trình % qua XMLHttpRequest)
   */
  async upload(
    file: File,
    folder: MediaFolder | string = MediaFolder.PRODUCTS_ORIGINALS,
    altText?: string,
    onProgress?: (percent: number) => void
  ): Promise<MediaFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    if (altText) {
      formData.append('alt_text', altText);
    }

    // Nếu có callback onProgress và chạy trên trình duyệt, sử dụng XMLHttpRequest để bắt tiến trình %
    if (typeof window !== 'undefined' && onProgress) {
      return new Promise<MediaFile>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `${API_BASE_URL.replace(/\/$/, '')}/media/upload`;

        xhr.open('POST', url);

        const token = localStorage.getItem('access_token');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded * 100) / event.total);
            onProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const resData: MediaFile = JSON.parse(xhr.responseText);
              resolve(resData);
            } catch (err) {
              reject(new Error('Lỗi phân tích phản hồi từ máy chủ.'));
            }
          } else {
            try {
              const errData = JSON.parse(xhr.responseText);
              reject(new Error(errData.message || `Lỗi tải lên (${xhr.status})`));
            } catch {
              reject(new Error(`Tải lên thất bại với mã lỗi HTTP ${xhr.status}`));
            }
          }
        };

        xhr.onerror = () => {
          reject(new Error('Mất kết nối mạng khi tải lên tệp tin.'));
        };

        xhr.send(formData);
      });
    }

    // Ngược lại gọi qua apiClient tiêu chuẩn
    const response = await apiClient.post<MediaFile>('/media/upload', formData);
    return response.data;
  },

  /**
   * Lấy danh sách media có lọc theo folder, loại media và phân trang skip/limit
   */
  async getList(params?: MediaListParams): Promise<MediaFile[]> {
    const response = await apiClient.get<MediaFile[]>('/media/list', {
      params: {
        folder: params?.folder || undefined,
        media_type: params?.media_type || undefined,
        skip: params?.skip ?? 0,
        limit: params?.limit ?? 50,
      },
    });
    return response.data || [];
  },

  /**
   * Lấy chi tiết thông tin 1 tệp tin
   */
  async getById(mediaId: number): Promise<MediaFile> {
    const response = await apiClient.get<MediaFile>(`/media/${mediaId}`);
    return response.data;
  },

  /**
   * Cập nhật alt_text phục vụ SEO & mô tả hình ảnh
   */
  async update(mediaId: number, data: MediaUpdateRequest): Promise<MediaFile> {
    const response = await apiClient.put<MediaFile>(`/media/${mediaId}`, data);
    return response.data;
  },

  /**
   * Xóa tệp tin vĩnh viễn khỏi Database và ổ đĩa server
   */
  async delete(mediaId: number): Promise<void> {
    await apiClient.delete(`/media/${mediaId}`);
  },
};

export type ApiErrorDetail = {
  code?: string;
  message?: string;
  details?: Record<string, unknown> | null;
};

export type ApiResponse<T> = {
  success?: boolean;
  data: T;
  error?: ApiErrorDetail | null;
  message?: string;
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value?: string | null): value is string {
  return typeof value === 'string' && UUID_REGEX.test(value);
}

/**
 * Unwraps backend `ApiResponse<T>` envelope `{ success, data, error }` cleanly.
 */
export function unwrapApiResponse<T>(response: { data: ApiResponse<T> | T }): T {
  const payload = response.data as ApiResponse<T>;
  if (payload && typeof payload === 'object' && 'data' in payload && 'success' in payload) {
    return payload.data;
  }
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data !== undefined) {
    return payload.data;
  }
  return response.data as T;
}

export function getApiErrorCode(error: unknown): string | undefined {
  const resData = (
    error as { response?: { data?: { error?: { code?: string }; code?: string } } }
  )?.response?.data;
  return resData?.error?.code ?? resData?.code;
}

export function getApiErrorStatus(error: unknown): number | undefined {
  return (error as { response?: { status?: number } })?.response?.status;
}

const DOMAIN_ERROR_MESSAGES: Record<string, string> = {
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  VALIDATION_ERROR: 'Dữ liệu nhập không hợp lệ. Vui lòng kiểm tra lại.',
  INVALID_PARAMETER: 'Tham số yêu cầu không hợp lệ.',
  INVALID_SERVING_AMOUNT: 'Khẩu phần ăn phải lớn hơn 0.',
  INVALID_WATER_AMOUNT: 'Lượng nước phải nằm trong khoảng 1 - 5000 ml.',
  FUTURE_DATE_NOT_ALLOWED: 'Không thể ghi nhận dữ liệu cho ngày quá xa trong tương lai.',
  FOOD_ITEM_DELETED: 'Món ăn này đã bị xóa khỏi từ điển.',
  FOOD_NOT_FOUND: 'Không tìm thấy món ăn.',
  FOOD_LOG_NOT_FOUND: 'Không tìm thấy bản ghi nhật ký bữa ăn.',
  WATER_LOG_NOT_FOUND: 'Không tìm thấy bản ghi uống nước.',
  RECORD_DELETED: 'Bản ghi này đã bị xóa trước đó.',
  FORBIDDEN_FOOD_ACCESS: 'Bạn không có quyền truy cập món ăn cá nhân của người dùng khác.',
  FORBIDDEN_INGREDIENT_ACCESS: 'Bạn không có quyền sử dụng nguyên liệu của người dùng khác.',
  CANNOT_MODIFY_SYSTEM_FOOD: 'Không thể chỉnh sửa hoặc xóa món ăn chuẩn của hệ thống.',
  CANNOT_MODIFY_SYSTEM_INGREDIENT: 'Không thể chỉnh sửa hoặc xóa nguyên liệu chuẩn của hệ thống.',
  INGREDIENT_NOT_FOUND: 'Không tìm thấy nguyên liệu.',
  INVALID_BARCODE: 'Định dạng mã vạch không hợp lệ.',
  BARCODE_NOT_FOUND: 'Không tìm thấy sản phẩm trong hệ thống hoặc Open Food Facts.',
  UNSUPPORTED_IMAGE_TYPE: 'Chỉ hỗ trợ ảnh định dạng JPEG hoặc PNG.',
  INVALID_FILE: 'Tệp ảnh không hợp lệ hoặc bị hỏng. Vui lòng chọn ảnh JPEG/PNG khác.',
  NON_FOOD_DETECTED: 'Không phát hiện món ăn trong ảnh. Vui lòng chụp rõ hơn.',
  INVALID_TIME_RANGE: 'Khoảng thời gian tra cứu không hợp lệ (tối đa 90 ngày).',
  PAYLOAD_TOO_LARGE: 'Ảnh tải lên vượt quá dung lượng tối đa 2MB.',
  TOO_MANY_REQUESTS: 'Bạn đã thao tác quá nhanh hoặc vượt giới hạn trong ngày. Vui lòng thử lại sau.',
  AI_SERVICE_UNAVAILABLE: 'Dịch vụ AI nhận diện tạm thời không khả dụng. Vui lòng thử lại sau.',
  AI_SERVICE_TIMEOUT: 'Dịch vụ AI nhận diện phản hồi quá lâu. Vui lòng thử lại sau.',
  PROFILE_NOT_FOUND: 'Bạn chưa hoàn tất hồ sơ sức khỏe. Vui lòng thiết lập hồ sơ trước.',
  MEAL_PLAN_NOT_FOUND: 'Không tìm thấy thực đơn.',
  MEAL_PLAN_ITEM_NOT_FOUND: 'Không tìm thấy món ăn trong thực đơn.',
  MEAL_PLAN_ALREADY_APPLIED: 'Thực đơn này đã được áp dụng vào nhật ký trước đó.',
  MEAL_PLAN_NOT_SAVED: 'Vui lòng lưu thực đơn trước khi áp dụng vào nhật ký.',
  MEAL_LOG_ALREADY_EXISTS: 'Bữa ăn trong ngày đích đã có dữ liệu nhật ký.',
  INSUFFICIENT_FOOD_DATA: 'Không đủ món ăn thỏa mãn đồng thời ràng buộc dị ứng, bệnh nền, calo và ngân sách.',
  NO_SUITABLE_SWAP_FOOD: 'Không tìm thấy món thay thế phù hợp với ràng buộc hiện tại.',
};

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Đã xảy ra lỗi kết nối. Vui lòng thử lại.'
): string {
  const resData = (
    error as {
      response?: {
        data?: {
          error?: { code?: string; message?: string };
          message?: string;
        };
      };
    }
  )?.response?.data;

  const code = getApiErrorCode(error);
  if (code && DOMAIN_ERROR_MESSAGES[code]) {
    return DOMAIN_ERROR_MESSAGES[code];
  }

  const serverMessage = resData?.error?.message ?? resData?.message;
  if (typeof serverMessage === 'string' && serverMessage.trim().length > 0) {
    return serverMessage;
  }

  return fallback;
}

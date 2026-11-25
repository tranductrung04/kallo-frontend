import { api } from '@/services/api/client';
import type {
  ApiResponse,
  CustomFoodRequest,
  CustomIngredientRequest,
  FoodCategory,
  FoodResponse,
  IngredientResponse,
  PageFoodSearchResponse,
  RecipeFoodRequest,
} from './foodTypes';

/**
 * Helper to unwrap standard ApiResponse<T>
 */
function unwrap<T>(response: { data: ApiResponse<T> | T }): T {
  const payload = response.data as ApiResponse<T>;
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data;
  }
  return response.data as T;
}

// =========================================================================
// FOODS ENDPOINTS
// =========================================================================

export type SearchFoodsParams = {
  q?: string;
  category?: FoodCategory;
  page?: number;
  size?: number;
};

/**
 * 1. Tìm kiếm món ăn có phân trang (GET /api/foods/search)
 * Tìm kiếm kết hợp cả món Hệ thống (SYSTEM), sản phẩm mã vạch (OFF) và món Tùy chỉnh (USER_CUSTOM).
 * Hỗ trợ Full-text Trigram tiếng Việt không dấu (VD: "pho", "bun bo", "com tam").
 */
export async function searchFoodsApi(
  params?: SearchFoodsParams | string
): Promise<PageFoodSearchResponse> {
  const query = new URLSearchParams();
  if (typeof params === 'string') {
    if (params.trim()) query.set('q', params.trim());
  } else if (params) {
    if (params.q?.trim()) query.set('q', params.q.trim());
    if (params.category) query.set('category', params.category);
    if (params.page !== undefined) query.set('page', String(params.page));
    if (params.size !== undefined) query.set('size', String(params.size));
  }

  const qs = query.toString();
  const url = `/foods/search${qs ? `?${qs}` : ''}`;
  const response = await api.get<ApiResponse<PageFoodSearchResponse>>(url);
  return unwrap(response);
}

/**
 * 2. Lấy chi tiết món ăn (GET /api/foods/{id})
 * Lấy thông tin chi tiết đầy đủ của một món ăn theo UUID bao gồm dinh dưỡng, nguyên liệu, dị ứng.
 */
export async function getFoodDetailApi(id: string): Promise<FoodResponse> {
  const response = await api.get<ApiResponse<FoodResponse>>(
    `/foods/${encodeURIComponent(id)}`
  );
  return unwrap(response);
}

/**
 * 3. Tạo món ăn tùy chỉnh (POST /api/foods/custom)
 * Nhập trực tiếp số calo/macro trên 100g, Backend tự động quy đổi ra giá trị trên 1 khẩu phần.
 */
export async function createCustomFoodApi(
  payload: CustomFoodRequest
): Promise<FoodResponse> {
  const response = await api.post<ApiResponse<FoodResponse>>(
    '/foods/custom',
    payload
  );
  return unwrap(response);
}

/**
 * 4. Tạo món ăn từ nguyên liệu - Recipe Calculation (POST /api/foods/recipe)
 * Ghép món từ danh sách nguyên liệu và gam tương ứng. Backend tự động tính toán Snapshot dinh dưỡng và dị ứng.
 */
export async function createRecipeFoodApi(
  payload: RecipeFoodRequest
): Promise<FoodResponse> {
  const response = await api.post<ApiResponse<FoodResponse>>(
    '/foods/recipe',
    payload
  );
  return unwrap(response);
}

/**
 * 5. Cập nhật món ăn tùy chỉnh (PUT /api/foods/custom/{id})
 */
export async function updateCustomFoodApi(
  id: string,
  payload: CustomFoodRequest
): Promise<FoodResponse> {
  const response = await api.put<ApiResponse<FoodResponse>>(
    `/foods/custom/${encodeURIComponent(id)}`,
    payload
  );
  return unwrap(response);
}

/**
 * 6. Xóa món ăn tùy chỉnh - Soft Delete (DELETE /api/foods/custom/{id})
 */
export async function deleteCustomFoodApi(id: string): Promise<void> {
  await api.delete(`/foods/custom/${encodeURIComponent(id)}`);
}

// =========================================================================
// INGREDIENTS ENDPOINTS
// =========================================================================

export type GetIngredientsParams = {
  q?: string;
  allergenOnly?: boolean;
};

/**
 * 7. Tra cứu danh mục nguyên liệu & Dị ứng Onboarding (GET /api/ingredients)
 * - allergenOnly=true: lấy danh sách 10 nhóm dị ứng chuẩn của hệ thống (PEANUT, DAIRY, EGG...) cho Onboarding.
 * - q=...: tìm kiếm nguyên liệu theo tên không dấu cho ghép Recipe.
 */
export async function getIngredientsApi(
  params?: GetIngredientsParams
): Promise<IngredientResponse[]> {
  const query = new URLSearchParams();
  if (params?.q?.trim()) query.set('q', params.q.trim());
  if (params?.allergenOnly !== undefined) {
    query.set('allergenOnly', String(params.allergenOnly));
  }

  const qs = query.toString();
  const url = `/ingredients${qs ? `?${qs}` : ''}`;
  const response = await api.get<ApiResponse<IngredientResponse[]>>(url);
  return unwrap(response);
}

/**
 * 8. Tự tạo nguyên liệu cá nhân (POST /api/ingredients/custom)
 * Ràng buộc: tối đa 30 nguyên liệu/ngày, calo <= 950, tổng P+C+F <= 105g.
 */
export async function createCustomIngredientApi(
  payload: CustomIngredientRequest
): Promise<IngredientResponse> {
  const response = await api.post<ApiResponse<IngredientResponse>>(
    '/ingredients/custom',
    payload
  );
  return unwrap(response);
}

/**
 * 9. Cập nhật nguyên liệu cá nhân (PUT /api/ingredients/custom/{id})
 * Tự động tính lại Snapshot Recipe của các món chứa nguyên liệu này.
 */
export async function updateCustomIngredientApi(
  id: string,
  payload: CustomIngredientRequest
): Promise<IngredientResponse> {
  const response = await api.put<ApiResponse<IngredientResponse>>(
    `/ingredients/custom/${encodeURIComponent(id)}`,
    payload
  );
  return unwrap(response);
}

/**
 * 10. Xóa nguyên liệu cá nhân - Soft Delete (DELETE /api/ingredients/custom/{id})
 */
export async function deleteCustomIngredientApi(id: string): Promise<void> {
  await api.delete(`/ingredients/custom/${encodeURIComponent(id)}`);
}

// =========================================================================
// BARCODE ENDPOINTS
// =========================================================================

/**
 * 11. Quét mã vạch thực phẩm qua Read-Through Cache & Open Food Facts (GET /api/foods/barcode/{code})
 * Trả về 200 với FoodResponse nếu tìm thấy, 404 nếu không tìm thấy (cả CSDL nội bộ và Open Food Facts).
 */
export async function getFoodByBarcodeApi(code: string): Promise<FoodResponse> {
  const cleanCode = code.trim().replace(/\s/g, '');
  const response = await api.get<ApiResponse<FoodResponse>>(
    `/foods/barcode/${encodeURIComponent(cleanCode)}`
  );
  return unwrap(response);
}

import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';

export const MAX_IMAGE_UPLOAD_BYTES = 2 * 1024 * 1024;

const LOCAL_URI_RE = /^(file:\/\/|content:\/\/|data:|blob:|ph:\/\/|assets-library:\/\/)/i;

/** Kiểm tra xem URI ảnh có phải file cục bộ trên thiết bị cần upload lên backend hay không. */
export function isLocalImageUri(uri?: string | null): uri is string {
  return typeof uri === 'string' && LOCAL_URI_RE.test(uri.trim());
}

function inferImageMimeType(uri: string, blobType?: string): 'image/jpeg' | 'image/png' | null {
  const normalizedType = blobType?.toLowerCase().trim();
  if (normalizedType === 'image/png') return 'image/png';
  if (normalizedType === 'image/jpeg' || normalizedType === 'image/jpg') return 'image/jpeg';

  const normalizedUri = uri.toLowerCase();
  if (normalizedUri.startsWith('data:image/png') || normalizedUri.endsWith('.png')) {
    return 'image/png';
  }
  if (
    normalizedUri.startsWith('data:image/jpeg') ||
    normalizedUri.startsWith('data:image/jpg') ||
    normalizedUri.endsWith('.jpg') ||
    normalizedUri.endsWith('.jpeg')
  ) {
    return 'image/jpeg';
  }
  return null;
}

/**
 * Chuẩn hóa ảnh về định dạng JPEG/PNG và dung lượng <= 2MB trước khi upload multipart/form-data.
 */
export async function prepareImageForUpload(
  uri: string
): Promise<{ uri: string; mimeType: 'image/jpeg' | 'image/png' }> {
  const uriMime = inferImageMimeType(uri);
  try {
    const res = await fetch(uri);
    const blob = await res.blob();
    const detectedMime = inferImageMimeType(uri, blob.type);
    if (blob.size > 0 && blob.size <= MAX_IMAGE_UPLOAD_BYTES && detectedMime) {
      return { uri, mimeType: detectedMime };
    }

    const actions: ImageManipulator.Action[] =
      blob.size > MAX_IMAGE_UPLOAD_BYTES ? [{ resize: { width: 1024 } }] : [];
    const compressed = await ImageManipulator.manipulateAsync(
      uri,
      actions,
      { compress: blob.size > MAX_IMAGE_UPLOAD_BYTES ? 0.65 : 0.85, format: ImageManipulator.SaveFormat.JPEG }
    );
    const compressedRes = await fetch(compressed.uri);
    const compressedBlob = await compressedRes.blob();
    if (compressedBlob.size <= MAX_IMAGE_UPLOAD_BYTES) {
      return { uri: compressed.uri, mimeType: 'image/jpeg' };
    }

    const smaller = await ImageManipulator.manipulateAsync(
      compressed.uri,
      [{ resize: { width: 800 } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
    );
    return { uri: smaller.uri, mimeType: 'image/jpeg' };
  } catch {
    try {
      const converted = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
      );
      return { uri: converted.uri, mimeType: 'image/jpeg' };
    } catch {
      return { uri, mimeType: uriMime ?? 'image/jpeg' };
    }
  }
}

/**
 * Đóng gói ảnh vào FormData thống nhất cho cả Web (File/Blob) và React Native ({ uri, name, type }).
 */
export async function buildImageFormData(options: {
  imageUri: string;
  fieldName: string;
  filePrefix?: string;
  mimeType?: 'image/jpeg' | 'image/png';
}): Promise<FormData> {
  const { imageUri, fieldName, filePrefix = 'image', mimeType = 'image/jpeg' } = options;
  const form = new FormData();

  if (Platform.OS === 'web') {
    const res = await fetch(imageUri);
    const rawBlob = await res.blob();
    if (!rawBlob || rawBlob.size === 0) {
      throw new Error('Ảnh tải lên bị rỗng (0 bytes). Vui lòng chọn lại ảnh.');
    }
    const resolvedType: 'image/jpeg' | 'image/png' =
      rawBlob.type === 'image/png'
        ? 'image/png'
        : rawBlob.type === 'image/jpeg' || rawBlob.type === 'image/jpg'
        ? 'image/jpeg'
        : mimeType;
    const ext = resolvedType === 'image/png' ? 'png' : 'jpg';
    const fileName = `${filePrefix}.${ext}`;
    if (typeof File !== 'undefined') {
      const file = new File([rawBlob], fileName, { type: resolvedType });
      form.append(fieldName, file);
    } else {
      const typedBlob =
        rawBlob.type === resolvedType
          ? rawBlob
          : new Blob([rawBlob], { type: resolvedType, lastModified: Date.now() });
      (form as unknown as { append: (name: string, value: Blob, filename?: string) => void }).append(
        fieldName,
        typedBlob,
        fileName
      );
    }
    return form;
  }

  const ext = mimeType === 'image/png' ? 'png' : 'jpg';
  form.append(fieldName, {
    uri: imageUri,
    name: `${filePrefix}.${ext}`,
    type: mimeType,
  } as unknown as Blob);
  return form;
}

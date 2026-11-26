import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { images } from '@/assets/images';
import { API_BASE_URL } from '@/services/api/client';
import { useTheme } from '@/theme';

const DIRECT_URI_RE = /^(https?:\/\/|file:\/\/|content:\/\/|data:|blob:|ph:\/\/|assets-library:\/\/)/i;

/**
 * Chuẩn hóa URI ảnh món ăn (hỗ trợ URL tuyệt đối, URI local và đường dẫn tương đối từ backend).
 */
export function resolveFoodImageUri(uri?: string | null): string | null {
  if (!uri) return null;
  const trimmed = uri.trim();
  if (!trimmed) return null;
  if (DIRECT_URI_RE.test(trimmed)) return trimmed;
  const origin = API_BASE_URL.replace(/\/api\/?$/, '');
  return trimmed.startsWith('/') ? `${origin}${trimmed}` : `${origin}/${trimmed}`;
}

export type FoodThumbnailProps = {
  uri?: string | null;
  size?: number;
  borderRadius?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Ảnh thu nhỏ món ăn thống nhất cho Dashboard, Nhật ký, Tìm kiếm và Chi tiết món ăn.
 */
export function FoodThumbnail({
  uri,
  size = 44,
  borderRadius = 12,
  accessibilityLabel,
  style,
}: FoodThumbnailProps) {
  const { colors } = useTheme();
  const resolvedUri = resolveFoodImageUri(uri);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [resolvedUri]);

  const showRemote = Boolean(resolvedUri) && !failed;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: colors.surfaceHigh,
          borderColor: colors.surfaceBorder,
        },
        style,
      ]}
    >
      {showRemote ? (
        <Image
          source={{ uri: resolvedUri! }}
          style={styles.coverImage}
          resizeMode="cover"
          onError={() => setFailed(true)}
          accessibilityLabel={accessibilityLabel}
        />
      ) : (
        <Image
          source={images.foodDefault}
          style={{ width: size * 0.72, height: size * 0.72 }}
          resizeMode="contain"
          accessibilityLabel={accessibilityLabel}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
});

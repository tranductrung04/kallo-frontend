import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, useAlert } from '@/components/common';
import { CheckIcon, ChevronLeftIcon, CloseXIcon, MessageCircleIcon, PenLineIcon, RefreshCwIcon } from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { IS_DEMO_MODE } from '@/features/auth/localAccount';
import { deleteConversation, getConversations, renameConversation } from '../api';
import type { Conversation } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatHistory'>;

export function ChatHistoryScreen({ navigation }: Props) {
  const theme = useTheme();
  const { showConfirm } = useAlert();
  const [items, setItems] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(!IS_DEMO_MODE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');

  const load = useCallback(async () => {
    if (IS_DEMO_MODE) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getConversations(0, 20);
      setItems(result.items);
      setPage(result.page);
      setHasMore(result.page + 1 < result.totalPages);
    } catch {
      setError('Không tải được lịch sử trò chuyện.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (IS_DEMO_MODE || loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await getConversations(nextPage, 20);
      setItems((current) => {
        const seen = new Set(current.map((item) => item.id));
        return [...current, ...result.items.filter((item) => !seen.has(item.id))];
      });
      setPage(result.page);
      setHasMore(result.page + 1 < result.totalPages);
    } catch {
      setError('Không tải thêm được lịch sử trò chuyện.');
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loading, loadingMore, page]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const saveTitle = async (conversation: Conversation) => {
    const title = draftTitle.trim();
    if (!title || title === conversation.title) {
      setEditingId(null);
      return;
    }
    try {
      const updated = await renameConversation(conversation.id, title);
      setItems((current) => current.map((item) => item.id === conversation.id ? updated : item));
      setEditingId(null);
    } catch {
      setError('Không đổi tên được cuộc trò chuyện.');
    }
  };

  const remove = (conversation: Conversation) => {
    showConfirm({
      title: 'Xóa cuộc trò chuyện?',
      message: 'Lịch sử này sẽ bị ẩn khỏi danh sách.',
      destructive: true,
      onConfirm: async () => {
        try {
          await deleteConversation(conversation.id);
          setItems((current) => current.filter((item) => item.id !== conversation.id));
        } catch {
          setError('Không xóa được cuộc trò chuyện.');
        }
      },
    });
  };

  return <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
    <View style={[styles.header, { borderBottomColor: theme.colors.surfaceBorder }]}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.iconButton}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
        accessibilityLabel="Quay lại"
      >
        <ChevronLeftIcon size={24} color={theme.colors.textPrimary} />
      </Pressable>
      <AppText variant="headlineSm" style={styles.headerTitle}>Lịch sử trò chuyện</AppText>
      <View style={styles.iconButton} />
    </View>
    {error ? <Pressable onPress={() => { setError(null); void load(); }} style={styles.error} accessibilityRole="alert"><RefreshCwIcon size={16} color={theme.colors.statusDanger} /><AppText variant="caption" color={theme.colors.statusDanger}>{error}</AppText></Pressable> : null}
    {loading ? <View style={styles.center}><ActivityIndicator color={theme.colors.brandPrimary} /></View> : <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      contentContainerStyle={items.length ? styles.list : styles.emptyList}
      onEndReached={() => void loadMore()}
      onEndReachedThreshold={0.3}
      ListFooterComponent={loadingMore ? <ActivityIndicator style={styles.footerLoader} color={theme.colors.brandPrimary} /> : null}
      ListEmptyComponent={<View style={styles.center}><MessageCircleIcon size={40} color={theme.colors.textDisabled} /><AppText variant="headlineSm">Chưa có cuộc trò chuyện</AppText><AppText variant="bodyMd" color={theme.colors.textSecondary} align="center">Các cuộc trò chuyện với Kallo sẽ xuất hiện ở đây.</AppText></View>}
      renderItem={({ item }) => <Pressable onPress={() => navigation.navigate('NutritionChat', { conversationId: item.id })} style={({ pressed }) => [styles.row, { backgroundColor: theme.colors.surfaceMid, borderColor: theme.colors.surfaceBorder }, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={`Mở ${item.title || 'cuộc trò chuyện mới'}`}>
        <View style={[styles.avatar, { backgroundColor: 'transparent' }]}><MessageCircleIcon size={20} color={theme.colors.brandPrimary} /></View>
        <View style={styles.rowCopy}>
          {editingId === item.id ? <TextInput value={draftTitle} onChangeText={setDraftTitle} onSubmitEditing={() => void saveTitle(item)} autoFocus style={[styles.titleInput, { color: theme.colors.textPrimary, borderColor: theme.colors.brandPrimary }]} maxLength={120} accessibilityLabel="Tên cuộc trò chuyện" /> : <AppText variant="labelLg" numberOfLines={1}>{item.title || 'Cuộc trò chuyện mới'}</AppText>}
          <AppText variant="caption" color={theme.colors.textSecondary}>{item.messageCount} tin nhắn · {item.lastMessageAt ? new Date(item.lastMessageAt).toLocaleDateString('vi-VN') : 'Chưa có tin nhắn'}</AppText>
        </View>
        <Pressable onPress={(event) => { event.stopPropagation(); if (editingId === item.id) void saveTitle(item); else { setEditingId(item.id); setDraftTitle(item.title || ''); } }} style={styles.actionButton} accessibilityRole="button" accessibilityLabel={editingId === item.id ? 'Lưu tên' : 'Đổi tên'}>{editingId === item.id ? <CheckIcon size={18} color={theme.colors.brandPrimary} /> : <PenLineIcon size={18} color={theme.colors.textSecondary} />}</Pressable>
        <Pressable onPress={(event) => { event.stopPropagation(); remove(item); }} style={styles.actionButton} accessibilityRole="button" accessibilityLabel="Xóa cuộc trò chuyện"><CloseXIcon size={18} color={theme.colors.statusDanger} /></Pressable>
      </Pressable>}
    />}
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { minHeight: 68, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderBottomWidth: 1 },
  headerTitle: { flex: 1, textAlign: 'center' },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  error: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: 16, padding: 12, borderRadius: 12 },
  list: { padding: 16, gap: 10 },
  emptyList: { flexGrow: 1, padding: 24 },
  row: { minHeight: 76, flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderRadius: 16, gap: 10 },
  pressed: { opacity: 0.8 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  rowCopy: { flex: 1, gap: 4 },
  titleInput: { minHeight: 36, borderBottomWidth: 1, paddingVertical: 4 },
  actionButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  footerLoader: { paddingVertical: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
});

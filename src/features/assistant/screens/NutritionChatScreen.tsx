import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { images } from '@/assets/images';
import { AppText } from '@/components/common';
import {
  ChevronLeftIcon,
  CutleryIcon,
  MessageCircleIcon,
  MessagesCircleIcon,
  RefreshCwIcon,
  SendIcon,
  ShieldSecurityIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  TriangleAlertIcon,
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { IS_DEMO_MODE } from '@/features/auth/localAccount';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import type { MealSlot } from '@/features/nutrition/types';
import { todayKey } from '@/features/nutrition/utils';
import { randomUUID } from 'expo-crypto';
import {
  getChatErrorMessage,
  getChatSuggestions,
  getConversationMessages,
  retryChatMessage,
  sendChatFeedback,
  sendChatMessage,
} from '../api';
import type { ChatApiMessage, ChatMessage, ChatReply, ChatSuggestion } from '../types';
import { generateAssistantResponse, QUICK_PROMPTS } from '../utils';
import { useChatAutoScroll } from '../hooks/useChatAutoScroll';
import { TypingIndicator } from '../components/TypingIndicator';

type Props = NativeStackScreenProps<RootStackParamList, 'NutritionChat'>;

function getDefaultMealSlot(): MealSlot {
  const hour = new Date().getHours();
  if (hour < 10) return 'breakfast';
  if (hour < 14) return 'lunch';
  if (hour < 17) return 'snack';
  return 'dinner';
}

function toUiMessage(message: ChatApiMessage): ChatMessage {
  return {
    id: message.id,
    role: message.role === 'USER' ? 'user' : message.role === 'SYSTEM' ? 'system' : 'assistant',
    content: message.content ?? '',
    timestamp: new Date(message.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    status: message.status,
    feedback: message.feedback,
    clientMessageId: message.clientMessageId ?? undefined,
    metadata: message.metadata ?? undefined,
  };
}

const welcomeMessage = (): ChatMessage => ({
  id: 'welcome',
  role: 'assistant',
  content: 'Chào bạn! Mình là trợ lý dinh dưỡng AI của Kallo. Mình nắm rõ tiến độ calo và bữa ăn hôm nay của bạn. Bạn muốn hỏi gì nào?',
  timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  status: 'COMPLETED',
});

export function NutritionChatScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { getSummary } = useNutrition();
  const summary = getSummary(todayKey());
  const conversationId = route.params?.conversationId;
  const initialPrompt = route.params?.initialPrompt;
  const [activeConversationId, setActiveConversationId] = useState(conversationId ?? null);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage()]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [suggestions, setSuggestions] = useState<ChatSuggestion[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(conversationId));
  const [error, setError] = useState<string | null>(null);
  const sentInitialPrompt = useRef(false);
  const messageUpdateKey = useMemo(
    () =>
      messages
        .map(
          (message) =>
            `${message.id}:${message.status ?? ''}:${message.isStreaming ? '1' : '0'}:${message.content}:${message.errorText ?? ''}`
        )
        .join('|'),
    [messages]
  );
  const { flatListRef, requestScrollToBottom, listScrollProps } = useChatAutoScroll<ChatMessage>({
    messageKey: messageUpdateKey,
    isLoading,
  });

  const loadConversation = useCallback(async () => {
    setActiveConversationId(conversationId ?? null);
    setNextCursor(null);
    setHasMoreMessages(false);
    if (!conversationId || IS_DEMO_MODE) return;
    setIsLoading(true);
    setError(null);
    try {
      const page = await getConversationMessages(conversationId);
      setMessages(page.items.slice().reverse().map(toUiMessage));
      setNextCursor(page.nextCursor ?? null);
      setHasMoreMessages(Boolean(page.hasMore && page.nextCursor));
    } catch {
      setError('Không tải được lịch sử trò chuyện. Kiểm tra kết nối rồi thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const loadOlderMessages = useCallback(async () => {
    if (!activeConversationId || !nextCursor || !hasMoreMessages || isLoadingMore || IS_DEMO_MODE) return;
    setIsLoadingMore(true);
    try {
      const page = await getConversationMessages(activeConversationId, { before: nextCursor });
      const older = page.items.slice().reverse().map(toUiMessage);
      setMessages((current) => {
        const seen = new Set(current.map((item) => item.id));
        return [...older.filter((item) => !seen.has(item.id)), ...current];
      });
      setNextCursor(page.nextCursor ?? null);
      setHasMoreMessages(Boolean(page.hasMore && page.nextCursor));
    } catch {
      setError('Không tải thêm được tin nhắn cũ hơn.');
    } finally {
      setIsLoadingMore(false);
    }
  }, [activeConversationId, hasMoreMessages, isLoadingMore, nextCursor]);

  useEffect(() => {
    void loadConversation();
  }, [loadConversation]);

  useEffect(() => {
    if (IS_DEMO_MODE) return;
    void getChatSuggestions().then(setSuggestions).catch(() => undefined);
  }, []);

  const applyChatReply = useCallback((reply: ChatReply, localUserId: string, localPendingId: string) => {
    setActiveConversationId(reply.conversationId);
    const serverUser = toUiMessage(reply.userMessage);
    const serverAssistant = toUiMessage(reply.assistantMessage);
    setMessages((current) => {
      const mapped = current.map((msg) => {
        if (msg.id === localUserId) return serverUser;
        if (msg.id === localPendingId) return serverAssistant;
        return msg;
      });
      const hasAssistant = mapped.some((msg) => msg.id === serverAssistant.id);
      return hasAssistant ? mapped : [...mapped, serverAssistant];
    });
  }, []);

  const handleSend = useCallback(async (textToSend?: string) => {
    const content = (textToSend ?? inputText).trim();
    if (!content || isSending || content.length > 2000) return;

    const clientMessageId = randomUUID();
    const userMessage: ChatMessage = {
      id: clientMessageId,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: 'COMPLETED',
      clientMessageId,
    };
    requestScrollToBottom();
    setMessages((current) => [...current.filter((message) => message.id !== 'welcome'), userMessage]);
    setInputText('');
    setIsSending(true);
    setError(null);

    if (IS_DEMO_MODE) {
      const answer = generateAssistantResponse(content, { summary, allergens: [] });
      setMessages((current) => [...current, {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: answer,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        status: 'COMPLETED',
      }]);
      setIsSending(false);
      return;
    }

    const pendingId = `pending-${clientMessageId}`;
    setMessages((current) => [...current, {
      id: pendingId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING',
      isStreaming: true,
      clientMessageId,
      retryContent: content,
    }]);
    try {
      const reply = await sendChatMessage({ conversationId: activeConversationId, content, clientMessageId });
      applyChatReply(reply, clientMessageId, pendingId);
    } catch (requestError: unknown) {
      const message = getChatErrorMessage(requestError);
      setError(message);
      setMessages((current) =>
        current.map((item) =>
          item.id === pendingId ? { ...item, status: 'FAILED', isStreaming: false, errorText: message } : item
        )
      );
    } finally {
      setIsSending(false);
    }
  }, [activeConversationId, applyChatReply, inputText, isSending, requestScrollToBottom, summary]);

  useEffect(() => {
    if (initialPrompt && !sentInitialPrompt.current && !isLoading) {
      sentInitialPrompt.current = true;
      void handleSend(initialPrompt);
    }
  }, [handleSend, initialPrompt, isLoading]);

  const handleRetry = async (item: ChatMessage) => {
    if (isSending || IS_DEMO_MODE) return;
    setIsSending(true);
    setError(null);
    setMessages((current) =>
      current.map((msg) =>
        msg.id === item.id ? { ...msg, status: 'PENDING', isStreaming: true, errorText: undefined } : msg
      )
    );
    try {
      if (item.id.startsWith('pending-') && item.clientMessageId) {
        const fallbackContent =
          item.retryContent ?? messages.find((msg) => msg.id === item.clientMessageId)?.content ?? '';
        if (!fallbackContent) {
          throw new Error('Missing retry content');
        }
        const reply = await sendChatMessage({
          conversationId: activeConversationId,
          content: fallbackContent,
          clientMessageId: item.clientMessageId,
        });
        requestScrollToBottom();
        applyChatReply(reply, item.clientMessageId, item.id);
      } else {
        const reply = await retryChatMessage(item.id);
        setActiveConversationId(reply.conversationId);
        requestScrollToBottom();
        setMessages((current) =>
          current.map((msg) => (msg.id === item.id ? toUiMessage(reply.assistantMessage) : msg))
        );
      }
    } catch (requestError: unknown) {
      const message = getChatErrorMessage(requestError);
      setError(message);
      setMessages((current) =>
        current.map((msg) =>
          msg.id === item.id ? { ...msg, status: 'FAILED', isStreaming: false, errorText: message } : msg
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleFeedback = async (messageId: string, feedback: -1 | 1) => {
    if (IS_DEMO_MODE) return;
    setMessages((current) => current.map((item) => item.id === messageId ? { ...item, feedback } : item));
    try {
      await sendChatFeedback(messageId, feedback);
    } catch {
      setMessages((current) => current.map((item) => item.id === messageId ? { ...item, feedback: null } : item));
    }
  };

  const promptItems = suggestions.length > 0 ? suggestions.map((item) => item.prompt) : QUICK_PROMPTS;

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
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
        <View style={styles.headerBrand}>
          <View style={[styles.headerLogoWrap, { backgroundColor: theme.colors.brandPrimary, borderColor: theme.colors.surfaceBorder }]}>
            <Image
              source={images.mascotAvatar}
              style={styles.headerLogo}
              accessibilityLabel="Trợ lý Kallo AI"
            />
          </View>
          <View style={styles.headerCopy}>
            <AppText variant="headlineSm">Trợ lý Kallo AI</AppText>
            <View style={styles.statusLine}>
              <View style={[styles.statusDot, { backgroundColor: theme.colors.quickScanner }]} />
              <AppText variant="caption" color={theme.colors.textSecondary}>Dinh dưỡng cá nhân</AppText>
            </View>
          </View>
        </View>
        <Pressable
          onPress={() => navigation.navigate('ChatHistory')}
          style={styles.iconButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Mở lịch sử trò chuyện"
        >
          <MessagesCircleIcon size={22} color={theme.colors.textPrimary} />
        </Pressable>
      </View>

      <View style={[styles.disclaimerBanner, { backgroundColor: theme.colors.surfaceMid }]}>
        <TriangleAlertIcon size={16} color={theme.colors.statusWarning} />
        <AppText variant="caption" color={theme.colors.textSecondary} style={styles.disclaimerText}>Thông tin tham khảo, không thay thế chẩn đoán hoặc chỉ định của bác sĩ.</AppText>
      </View>

      {error ? <Pressable onPress={() => setError(null)} style={[styles.errorBanner, { backgroundColor: theme.colors.surfaceHigh }]} accessibilityRole="alert"><RefreshCwIcon size={16} color={theme.colors.statusDanger} /><AppText variant="caption" color={theme.colors.statusDanger} style={styles.errorText}>{error}</AppText></Pressable> : null}

      {isLoading ? <View style={styles.loading}><ActivityIndicator color={theme.colors.brandPrimary} /><AppText variant="bodyMd" color={theme.colors.textSecondary}>Đang tải cuộc trò chuyện...</AppText></View> : <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        {...listScrollProps}
        ListHeaderComponent={
          hasMoreMessages ? (
            <Pressable
              onPress={() => void loadOlderMessages()}
              disabled={isLoadingMore}
              style={[styles.loadMoreButton, { borderColor: theme.colors.surfaceBorder, backgroundColor: theme.colors.surfaceMid }]}
              accessibilityRole="button"
              accessibilityLabel="Tải tin nhắn cũ hơn"
            >
              {isLoadingMore ? (
                <ActivityIndicator size="small" color={theme.colors.brandPrimary} />
              ) : (
                <AppText variant="caption" color={theme.colors.brandPrimary}>Tải tin nhắn cũ hơn</AppText>
              )}
            </Pressable>
          ) : null
        }
        ListFooterComponent={null}
        renderItem={({ item }) => {
          const isUser = item.role === 'user';
          const failed = item.status === 'FAILED';
          const isPending = !isUser && !failed && (item.status === 'PENDING' || (!item.content && item.isStreaming));
          const suggestedFoods = !isUser && item.status === 'COMPLETED' ? item.metadata?.suggestedFoods ?? [] : [];
          const hasAllergenWarning = !isUser && item.status === 'COMPLETED' && Boolean(item.metadata?.allergenWarning);
          return <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAssistant]}>
            <View style={[styles.messageBubble, isUser ? [styles.bubbleUser, { backgroundColor: theme.colors.brandPrimary }] : [styles.bubbleAssistant, { backgroundColor: theme.colors.surfaceMid, borderColor: theme.colors.surfaceBorder }]]}>
              {!isUser ? <AppText variant="labelSm" color={theme.colors.brandPrimary}>KALLO AI</AppText> : null}
              {isPending ? (
                <View style={styles.typingContainer}>
                  <TypingIndicator color={theme.colors.brandPrimary} />
                  <AppText variant="caption" color={theme.colors.textSecondary} style={styles.typingLabel}>
                    Đang soạn câu trả lời…
                  </AppText>
                </View>
              ) : (
                <AppText variant="bodyMd" color={isUser ? theme.colors.onBrand : theme.colors.textPrimary}>
                  {failed ? (item.errorText ?? (item.content || 'Tin nhắn chưa nhận được phản hồi.')) : item.content}
                </AppText>
              )}
              {hasAllergenWarning ? (
                <View style={[styles.allergenBadge, { backgroundColor: theme.colors.surfaceHigh, borderColor: theme.colors.surfaceBorder }]}>
                  <ShieldSecurityIcon size={14} color={theme.colors.statusWarning} />
                  <AppText variant="caption" color={theme.colors.textSecondary} style={styles.allergenBadgeText}>
                    Đã kiểm tra và lọc theo hồ sơ dị ứng
                  </AppText>
                </View>
              ) : null}
              {suggestedFoods.length > 0 ? (
                <View style={styles.suggestedFoodsWrap}>
                  {suggestedFoods.map((food, index) => {
                    const canOpenFood = Boolean(food.foodId);
                    return (
                      <Pressable
                        key={`${food.foodId ?? food.name}-${index}`}
                        disabled={!canOpenFood}
                        onPress={() => {
                          if (food.foodId) {
                            navigation.navigate('FoodDetail', {
                              foodId: food.foodId,
                              date: todayKey(),
                              meal: getDefaultMealSlot(),
                            });
                          }
                        }}
                        style={[
                          styles.foodChip,
                          {
                            backgroundColor: theme.colors.surfaceHigh,
                            borderColor: canOpenFood ? theme.colors.brandPrimary : theme.colors.surfaceBorder,
                          },
                        ]}
                        accessibilityRole={canOpenFood ? 'button' : 'text'}
                        accessibilityLabel={
                          food.kcal != null ? `${food.name}, ${food.kcal} kcal` : food.name
                        }
                      >
                        <CutleryIcon size={13} color={theme.colors.brandPrimary} />
                        <AppText variant="caption" color={theme.colors.textPrimary} style={styles.foodChipText}>
                          {food.kcal != null ? `${food.name} · ${food.kcal} kcal` : food.name}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}
              <AppText variant="caption" color={isUser ? 'rgba(255,255,255,0.75)' : theme.colors.textSecondary} align={isUser ? 'right' : 'left'}>{item.timestamp}</AppText>
              {!isUser && item.status === 'COMPLETED' && item.id !== 'welcome' ? <View style={styles.feedbackRow}>
                <Pressable onPress={() => void handleFeedback(item.id, 1)} style={styles.feedbackButton} accessibilityRole="button" accessibilityLabel="Câu trả lời hữu ích"><ThumbsUpIcon size={16} color={item.feedback === 1 ? theme.colors.brandPrimary : theme.colors.textSecondary} /></Pressable>
                <Pressable onPress={() => void handleFeedback(item.id, -1)} style={styles.feedbackButton} accessibilityRole="button" accessibilityLabel="Câu trả lời chưa hữu ích"><ThumbsDownIcon size={16} color={item.feedback === -1 ? theme.colors.statusDanger : theme.colors.textSecondary} /></Pressable>
              </View> : null}
              {failed ? <Pressable onPress={() => void handleRetry(item)} style={[styles.retryButton, { borderColor: theme.colors.surfaceBorder }]} accessibilityRole="button" accessibilityLabel="Thử lại câu trả lời"><RefreshCwIcon size={15} color={theme.colors.brandPrimary} /><AppText variant="labelMd" color={theme.colors.brandPrimary}>Thử lại</AppText></Pressable> : null}
            </View>
          </View>;
        }}
      />}

      <View style={[styles.quickPromptsWrap, { borderTopColor: theme.colors.surfaceBorder }]}>
        <FlatList horizontal showsHorizontalScrollIndicator={false} data={promptItems} keyExtractor={(item) => item} contentContainerStyle={styles.promptsList} renderItem={({ item }) => <Pressable style={[styles.promptChip, { backgroundColor: theme.colors.surfaceMid, borderColor: theme.colors.surfaceBorder }]} onPress={() => void handleSend(item)} disabled={isSending} accessibilityRole="button" accessibilityLabel={`Gợi ý: ${item}`}><MessageCircleIcon size={14} color={theme.colors.brandPrimary} /><AppText variant="caption" color={theme.colors.textPrimary}>{item}</AppText></Pressable>} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}>
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.surfaceMid, borderTopColor: theme.colors.surfaceBorder }]}>
          <TextInput style={[styles.input, { color: theme.colors.textPrimary, borderColor: theme.colors.surfaceBorder, backgroundColor: theme.colors.surfaceHigh }]} placeholder="Hỏi Kallo về calo, thực đơn..." placeholderTextColor={theme.colors.textSecondary} value={inputText} onChangeText={setInputText} onSubmitEditing={() => void handleSend()} returnKeyType="send" editable={!isSending} maxLength={2000} accessibilityLabel="Nội dung tin nhắn" />
          <Pressable onPress={() => void handleSend()} style={[styles.sendButton, { backgroundColor: inputText.trim() && !isSending ? theme.colors.brandPrimary : theme.colors.textDisabled }]} disabled={!inputText.trim() || isSending} accessibilityRole="button" accessibilityLabel="Gửi tin nhắn"><SendIcon size={19} color={theme.colors.onBrand} /></Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderBottomWidth: 1, gap: 8 },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
  headerBrand: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerLogoWrap: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1 },
  headerLogo: { width: 38, height: 38, borderRadius: 19 },
  headerCopy: { flex: 1, gap: 2 },
  statusLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  disclaimerBanner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  disclaimerText: { flex: 1 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 10, padding: 10, borderRadius: 12, gap: 8 },
  errorText: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  loadMoreButton: { alignSelf: 'center', minHeight: 36, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  typingContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 },
  typingLabel: { fontSize: 13 },
  messageList: { padding: 16, gap: 12, paddingBottom: 20 },
  messageRow: { flexDirection: 'row' },
  messageRowUser: { justifyContent: 'flex-end' },
  messageRowAssistant: { justifyContent: 'flex-start' },
  messageBubble: { maxWidth: '84%', padding: 14, borderRadius: 18, gap: 7 },
  bubbleUser: { borderBottomRightRadius: 4 },
  bubbleAssistant: { borderBottomLeftRadius: 4, borderWidth: 1 },
  allergenBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  allergenBadgeText: { flex: 1 },
  suggestedFoodsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  foodChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, borderWidth: 1 },
  foodChipText: { flexShrink: 1 },
  feedbackRow: { flexDirection: 'row', gap: 4, marginTop: 2 },
  feedbackButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  retryButton: { minHeight: 40, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, gap: 6 },
  quickPromptsWrap: { paddingVertical: 8, borderTopWidth: 1 },
  promptsList: { paddingHorizontal: 16, gap: 8 },
  promptChip: { minHeight: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, gap: 6 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, gap: 8, borderTopWidth: 1 },
  input: { flex: 1, minHeight: 44, maxHeight: 100, borderRadius: 22, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15 },
  sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});

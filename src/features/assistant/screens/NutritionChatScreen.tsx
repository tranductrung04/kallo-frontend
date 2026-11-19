import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from '@/components/common';
import {
  ChevronLeftIcon,
  MessageSquareIcon,
  QuickVoiceIcon,
  RefreshCwIcon,
  SendIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  TriangleAlertIcon,
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { IS_DEMO_MODE } from '@/features/auth/localAccount';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { todayKey } from '@/features/nutrition/utils';
import { randomUUID } from 'expo-crypto';
import {
  getChatSuggestions,
  getConversationMessages,
  retryChatMessage,
  sendChatFeedback,
  sendChatMessage,
} from '../api';
import type { ChatApiMessage, ChatMessage, ChatSuggestion } from '../types';
import { generateAssistantResponse, QUICK_PROMPTS } from '../utils';

type Props = NativeStackScreenProps<RootStackParamList, 'NutritionChat'>;

function toUiMessage(message: ChatApiMessage): ChatMessage {
  return {
    id: message.id,
    role: message.role === 'USER' ? 'user' : message.role === 'SYSTEM' ? 'system' : 'assistant',
    content: message.content ?? '',
    timestamp: new Date(message.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    status: message.status,
    feedback: message.feedback,
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
  const [suggestions, setSuggestions] = useState<ChatSuggestion[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(conversationId));
  const [error, setError] = useState<string | null>(null);
  const sentInitialPrompt = useRef(false);
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const loadConversation = useCallback(async () => {
    if (!activeConversationId || IS_DEMO_MODE) return;
    setIsLoading(true);
    setError(null);
    try {
      const page = await getConversationMessages(activeConversationId);
      setMessages(page.items.slice().reverse().map(toUiMessage));
    } catch {
      setError('Không tải được lịch sử trò chuyện. Kiểm tra kết nối rồi thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId]);

  useEffect(() => {
    void loadConversation();
  }, [loadConversation]);

  useEffect(() => {
    if (IS_DEMO_MODE) return;
    void getChatSuggestions().then(setSuggestions).catch(() => undefined);
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
    };
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
    }]);
    try {
      const reply = await sendChatMessage({ conversationId: activeConversationId, content, clientMessageId });
      setActiveConversationId(reply.conversationId);
      setMessages((current) => [
        ...current.filter((message) => message.id !== pendingId),
        toUiMessage(reply.assistantMessage),
      ]);
    } catch (requestError: any) {
      const message = requestError?.response?.data?.error?.message ?? 'Kallo chưa thể trả lời lúc này. Bạn có thể thử lại.';
      setError(message);
      setMessages((current) => current.map((item) => item.id === pendingId ? { ...item, status: 'FAILED' } : item));
    } finally {
      setIsSending(false);
    }
  }, [activeConversationId, inputText, isSending, summary]);

  useEffect(() => {
    if (initialPrompt && !sentInitialPrompt.current && !isLoading) {
      sentInitialPrompt.current = true;
      void handleSend(initialPrompt);
    }
  }, [handleSend, initialPrompt, isLoading]);

  const handleRetry = async (messageId: string) => {
    if (isSending || IS_DEMO_MODE) return;
    setIsSending(true);
    setError(null);
    try {
      const reply = await retryChatMessage(messageId);
      setMessages((current) => [...current.filter((item) => item.id !== messageId), toUiMessage(reply.assistantMessage)]);
    } catch {
      setError('Thử lại chưa thành công. Vui lòng kiểm tra kết nối.');
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
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.surfaceBorder }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Quay lại">
          <ChevronLeftIcon size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <View style={styles.headerCopy}>
          <AppText variant="headlineSm">Trợ lý Kallo</AppText>
          <View style={styles.statusLine}><View style={[styles.statusDot, { backgroundColor: theme.colors.quickScanner }]} /><AppText variant="caption" color={theme.colors.textSecondary}>Dinh dưỡng cá nhân</AppText></View>
        </View>
        <Pressable onPress={() => navigation.navigate('ChatHistory')} style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Mở lịch sử trò chuyện">
          <MessageSquareIcon size={22} color={theme.colors.textPrimary} />
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
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const isUser = item.role === 'user';
          const failed = item.status === 'FAILED';
          return <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAssistant]}>
            <View style={[styles.messageBubble, isUser ? [styles.bubbleUser, { backgroundColor: theme.colors.brandPrimary }] : [styles.bubbleAssistant, { backgroundColor: theme.colors.surfaceMid, borderColor: theme.colors.surfaceBorder }]]}>
              {!isUser ? <AppText variant="labelSm" color={theme.colors.brandPrimary}>KALLO AI</AppText> : null}
              <AppText variant="bodyMd" color={isUser ? theme.colors.onBrand : theme.colors.textPrimary}>{failed ? 'Tin nhắn chưa nhận được phản hồi.' : item.content || 'Đang suy nghĩ...'}</AppText>
              <AppText variant="caption" color={isUser ? 'rgba(255,255,255,0.75)' : theme.colors.textSecondary} align={isUser ? 'right' : 'left'}>{item.timestamp}</AppText>
              {!isUser && item.status === 'COMPLETED' && item.id !== 'welcome' ? <View style={styles.feedbackRow}>
                <Pressable onPress={() => void handleFeedback(item.id, 1)} style={styles.feedbackButton} accessibilityRole="button" accessibilityLabel="Câu trả lời hữu ích"><ThumbsUpIcon size={16} color={item.feedback === 1 ? theme.colors.brandPrimary : theme.colors.textSecondary} /></Pressable>
                <Pressable onPress={() => void handleFeedback(item.id, -1)} style={styles.feedbackButton} accessibilityRole="button" accessibilityLabel="Câu trả lời chưa hữu ích"><ThumbsDownIcon size={16} color={item.feedback === -1 ? theme.colors.statusDanger : theme.colors.textSecondary} /></Pressable>
              </View> : null}
              {failed ? <Pressable onPress={() => void handleRetry(item.id)} style={[styles.retryButton, { borderColor: theme.colors.surfaceBorder }]} accessibilityRole="button" accessibilityLabel="Thử lại câu trả lời"><RefreshCwIcon size={15} color={theme.colors.brandPrimary} /><AppText variant="labelMd" color={theme.colors.brandPrimary}>Thử lại</AppText></Pressable> : null}
            </View>
          </View>;
        }}
      />}

      <View style={[styles.quickPromptsWrap, { borderTopColor: theme.colors.surfaceBorder }]}>
        <FlatList horizontal showsHorizontalScrollIndicator={false} data={promptItems} keyExtractor={(item) => item} contentContainerStyle={styles.promptsList} renderItem={({ item }) => <Pressable style={[styles.promptChip, { backgroundColor: theme.colors.surfaceMid, borderColor: theme.colors.surfaceBorder }]} onPress={() => void handleSend(item)} disabled={isSending} accessibilityRole="button" accessibilityLabel={`Gợi ý: ${item}`}><MessageSquareIcon size={14} color={theme.colors.brandPrimary} /><AppText variant="caption" color={theme.colors.textPrimary}>{item}</AppText></Pressable>} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}>
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.surfaceMid, borderTopColor: theme.colors.surfaceBorder }]}>
          <Pressable onPress={() => navigation.navigate('VoiceLogModal')} style={styles.inputIconButton} accessibilityRole="button" accessibilityLabel="Mở ghi nhật ký bằng giọng nói"><QuickVoiceIcon size={21} color={theme.colors.brandPrimary} /></Pressable>
          <TextInput style={[styles.input, { color: theme.colors.textPrimary, borderColor: theme.colors.surfaceBorder, backgroundColor: theme.colors.surfaceHigh }]} placeholder="Hỏi Kallo về calo, thực đơn..." placeholderTextColor={theme.colors.textSecondary} value={inputText} onChangeText={setInputText} onSubmitEditing={() => void handleSend()} returnKeyType="send" editable={!isSending} maxLength={2000} accessibilityLabel="Nội dung tin nhắn" />
          <Pressable onPress={() => void handleSend()} style={[styles.sendButton, { backgroundColor: inputText.trim() && !isSending ? theme.colors.brandPrimary : theme.colors.textDisabled }]} disabled={!inputText.trim() || isSending} accessibilityRole="button" accessibilityLabel="Gửi tin nhắn"><SendIcon size={19} color={theme.colors.onBrand} /></Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { minHeight: 68, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderBottomWidth: 1, gap: 8 },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerCopy: { flex: 1, gap: 2 },
  statusLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  disclaimerBanner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  disclaimerText: { flex: 1 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 10, padding: 10, borderRadius: 12, gap: 8 },
  errorText: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  messageList: { padding: 16, gap: 12, paddingBottom: 20 },
  messageRow: { flexDirection: 'row' },
  messageRowUser: { justifyContent: 'flex-end' },
  messageRowAssistant: { justifyContent: 'flex-start' },
  messageBubble: { maxWidth: '84%', padding: 14, borderRadius: 18, gap: 7 },
  bubbleUser: { borderBottomRightRadius: 4 },
  bubbleAssistant: { borderBottomLeftRadius: 4, borderWidth: 1 },
  feedbackRow: { flexDirection: 'row', gap: 4, marginTop: 2 },
  feedbackButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  retryButton: { minHeight: 40, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, gap: 6 },
  quickPromptsWrap: { paddingVertical: 8, borderTopWidth: 1 },
  promptsList: { paddingHorizontal: 16, gap: 8 },
  promptChip: { minHeight: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, gap: 6 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, gap: 8, borderTopWidth: 1 },
  inputIconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, minHeight: 44, maxHeight: 100, borderRadius: 22, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15 },
  sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});

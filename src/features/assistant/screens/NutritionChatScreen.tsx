import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from '@/components/common';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { todayKey } from '@/features/nutrition/utils';
import type { ChatMessage } from '../types';
import { generateAssistantResponse, QUICK_PROMPTS } from '../utils';

type Props = NativeStackScreenProps<RootStackParamList, 'NutritionChat'>;

export function NutritionChatScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { getSummary } = useNutrition();
  const date = todayKey();
  const summary = getSummary(date);

  const initialPrompt = route.params?.initialPrompt;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Chào bạn! Mình là trợ lý dinh dưỡng AI của Kallo. Mình nắm rõ tiến độ calo và bữa ăn hôm nay của bạn. Bạn muốn hỏi gì nào?',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const handleSend = (textToSend?: string) => {
    const content = (textToSend ?? inputText).trim();
    if (!content || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Compute answer
    const answer = generateAssistantResponse(content, {
      summary,
      allergens: [],
    });

    // Simulated real-time streaming response (FR-CHAT-03)
    const assistantMsgId = `assistant-${Date.now()}`;
    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, assistantMsg]);

    let charIndex = 0;
    const chunkSize = 6;
    const interval = setInterval(() => {
      charIndex += chunkSize;
      if (charIndex >= answer.length) {
        clearInterval(interval);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId ? { ...msg, content: answer, isStreaming: false } : msg
          )
        );
        setIsTyping(false);
      } else {
        const partial = answer.slice(0, charIndex);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId ? { ...msg, content: partial } : msg
          )
        );
      }
    }, 40);
  };

  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: 'Cuộc trò chuyện đã được làm mới. Bạn cần hỗ trợ gì tiếp theo nhé?',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
      {/* ── FR-CHAT-06: Medical Disclaimer Banner ───────────────────── */}
      <View style={[styles.disclaimerBanner, { backgroundColor: theme.colors.surface }]}>
        <AppText variant="caption" color={theme.colors.calorieIn}>
          ⚠️ LƯU Ý Y TẾ
        </AppText>
        <AppText variant="caption" color={theme.colors.textSecondary}>
          Trợ lý AI dựa trên dữ liệu dinh dưỡng tham khảo, không thay thế chẩn đoán hoặc chỉ định của bác sĩ.
        </AppText>
      </View>

      {/* ── Message List ────────────────────────────────────────────── */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const isUser = item.role === 'user';
          return (
            <View
              style={[
                styles.messageRow,
                isUser ? styles.messageRowUser : styles.messageRowAssistant,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  isUser
                    ? [styles.bubbleUser, { backgroundColor: theme.colors.brandPrimary }]
                    : [styles.bubbleAssistant, { backgroundColor: theme.colors.surface }],
                ]}
              >
                {!isUser && (
                  <AppText variant="caption" color={theme.colors.brandPrimary} style={styles.botTag}>
                    KALLO AI ASSISTANT
                  </AppText>
                )}
                <AppText
                  variant="bodyMd"
                  color={isUser ? '#FFFFFF' : theme.colors.textPrimary}
                  style={styles.messageText}
                >
                  {item.content || (item.isStreaming ? '...' : '')}
                </AppText>
                <AppText
                  variant="caption"
                  color={isUser ? 'rgba(255,255,255,0.7)' : theme.colors.textSecondary}
                  align={isUser ? 'right' : 'left'}
                >
                  {item.timestamp}
                </AppText>
              </View>
            </View>
          );
        }}
      />

      {/* ── FR-CHAT-05: Quick Prompts Strip ─────────────────────────── */}
      <View style={styles.quickPromptsWrap}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={QUICK_PROMPTS}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.promptsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.promptChip,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}
              onPress={() => handleSend(item)}
              disabled={isTyping}
            >
              <AppText variant="caption" color={theme.colors.textPrimary}>
                💬 {item}
              </AppText>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* ── Input Bar ───────────────────────────────────────────────── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={() => navigation.navigate('VoiceLogModal')}
            accessibilityRole="button"
            accessibilityLabel="Mở ghi nhật ký bằng giọng nói"
          >
            <AppText variant="headlineSm">🎙️</AppText>
          </TouchableOpacity>

          <TextInput
            style={[styles.input, { color: theme.colors.textPrimary }]}
            placeholder="Hỏi Kallo về calo, thực đơn..."
            placeholderTextColor={theme.colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
            editable={!isTyping}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim() && !isTyping
                  ? theme.colors.brandPrimary
                  : 'rgba(128,128,128,0.3)',
              },
            ]}
            onPress={() => handleSend()}
            disabled={!inputText.trim() || isTyping}
            accessibilityRole="button"
            accessibilityLabel="Gửi tin nhắn"
          >
            <AppText variant="bodySm" color="#FFFFFF">
              Gửi
            </AppText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  disclaimerBanner: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(128,128,128,0.15)',
    gap: 2,
  },
  messageList: {
    padding: 16,
    gap: 12,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAssistant: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '82%',
    padding: 14,
    borderRadius: 18,
    gap: 6,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.15)',
  },
  botTag: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  messageText: {
    lineHeight: 22,
  },
  quickPromptsWrap: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: 'rgba(128,128,128,0.1)',
  },
  promptsList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  promptChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    borderTopWidth: 1,
    borderColor: 'rgba(128,128,128,0.15)',
  },
  voiceButton: {
    padding: 6,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 15,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});

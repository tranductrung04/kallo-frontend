import axios from 'axios';
import { api } from '@/services/api/client';
import type {
  ChatApiMessage,
  ChatReply,
  ChatSuggestion,
  Conversation,
} from './types';

export const CHAT_TIMEOUT_MS = 60_000;

export type SendChatMessageInput = {
  conversationId?: string | null;
  content: string;
  clientMessageId: string;
};

export type SendChatMessageResult = ChatReply;

type ApiEnvelope<T> = { data?: T; success?: boolean; error?: { code?: string; message?: string } | null };
type ConversationPage = { items: Conversation[]; page: number; size: number; totalElements: number; totalPages: number };
type MessagePage = { items: ChatApiMessage[]; nextCursor?: string | null; hasMore: boolean };

function unwrap<T>(response: { data: ApiEnvelope<T> | T }): T {
  const payload = response.data as ApiEnvelope<T>;
  return (payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload) as T;
}

export function sendChatMessage(payload: SendChatMessageInput): Promise<SendChatMessageResult> {
  return api.post<ApiEnvelope<ChatReply>>('/chat/messages', payload, { timeout: CHAT_TIMEOUT_MS }).then(unwrap);
}

export function retryChatMessage(messageId: string): Promise<ChatReply> {
  return api.post<ApiEnvelope<ChatReply>>(`/chat/messages/${encodeURIComponent(messageId)}/retry`, undefined, { timeout: CHAT_TIMEOUT_MS }).then(unwrap);
}

export function sendChatFeedback(messageId: string, feedback: -1 | 1) {
  return api.post(`/chat/messages/${encodeURIComponent(messageId)}/feedback`, { feedback });
}

export function getChatSuggestions() {
  return api.get<ApiEnvelope<ChatSuggestion[]>>('/chat/suggestions').then(unwrap);
}

export function getConversations(page = 0, size = 20) {
  return api.get<ApiEnvelope<ConversationPage>>(`/chat/conversations?page=${page}&size=${size}`).then(unwrap);
}

export function createConversation() {
  return api.post<ApiEnvelope<Conversation>>('/chat/conversations').then(unwrap);
}

export function getConversation(conversationId: string) {
  return api.get<ApiEnvelope<Conversation>>(`/chat/conversations/${encodeURIComponent(conversationId)}`).then(unwrap);
}

export function renameConversation(conversationId: string, title: string) {
  return api.patch<ApiEnvelope<Conversation>>(`/chat/conversations/${encodeURIComponent(conversationId)}`, { title }).then(unwrap);
}

export function deleteConversation(conversationId: string) {
  return api.delete(`/chat/conversations/${encodeURIComponent(conversationId)}`);
}

export function getConversationMessages(
  conversationId: string,
  paramsOrBefore?: string | { before?: string; limit?: number },
  limit = 30
) {
  let before: string | undefined;
  let pageLimit = limit;
  if (typeof paramsOrBefore === 'object' && paramsOrBefore !== null) {
    before = paramsOrBefore.before;
    if (paramsOrBefore.limit !== undefined) pageLimit = paramsOrBefore.limit;
  } else if (typeof paramsOrBefore === 'string') {
    before = paramsOrBefore;
  }
  const query = new URLSearchParams({ limit: String(pageLimit) });
  if (before) query.set('before', before);
  return api.get<ApiEnvelope<MessagePage>>(`/chat/conversations/${encodeURIComponent(conversationId)}/messages?${query.toString()}`).then(unwrap);
}

export function getChatErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) return 'Có lỗi xảy ra, bạn thử lại nhé.';
  if (!error.response) return 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại nhé.';
  switch (error.response.status) {
    case 400:
    case 413:
    case 422:
      return 'Tin nhắn chưa phù hợp hoặc quá dài (tối đa 2000 ký tự).';
    case 409:
      return 'Kallo đang trả lời tin nhắn trước, bạn chờ một chút nhé.';
    case 429: {
      const retryAfter = Number(error.response.headers?.['retry-after']);
      return Number.isFinite(retryAfter) && retryAfter > 0
        ? `Bạn gửi hơi nhanh, thử lại sau ${retryAfter} giây nhé.`
        : 'Bạn gửi hơi nhanh, thử lại sau ít phút nhé.';
    }
    case 502:
    case 503:
    case 504:
      return 'Trợ lý AI đang bận hoặc phản hồi chưa hợp lệ. Bạn bấm thử lại nhé.';
    default:
      return (error.response.data as any)?.error?.message ?? 'Không gửi được tin nhắn, bạn thử lại nhé.';
  }
}

export function isRetryableChatError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  const status = error.response?.status;
  return !status || status === 409 || status === 429 || status === 502 || status === 503 || status === 504;
}

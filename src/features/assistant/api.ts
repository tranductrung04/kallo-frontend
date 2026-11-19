import { api } from '@/services/api/client';
import type {
  ChatApiMessage,
  ChatReply,
  ChatSuggestion,
  Conversation,
} from './types';

type ApiEnvelope<T> = { data?: T; success?: boolean; error?: { code?: string; message?: string } | null };
type ConversationPage = { items: Conversation[]; page: number; size: number; totalElements: number; totalPages: number };
type MessagePage = { items: ChatApiMessage[]; nextCursor?: string | null; hasMore: boolean };

function unwrap<T>(response: { data: ApiEnvelope<T> | T }): T {
  const payload = response.data as ApiEnvelope<T>;
  return (payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload) as T;
}

export function sendChatMessage(payload: {
  conversationId?: string | null;
  content: string;
  clientMessageId: string;
}) {
  return api.post<ApiEnvelope<ChatReply>>('/chat/messages', payload).then(unwrap);
}

export function retryChatMessage(messageId: string) {
  return api.post<ApiEnvelope<ChatReply>>(`/chat/messages/${encodeURIComponent(messageId)}/retry`).then(unwrap);
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

export function renameConversation(conversationId: string, title: string) {
  return api.patch<ApiEnvelope<Conversation>>(`/chat/conversations/${encodeURIComponent(conversationId)}`, { title }).then(unwrap);
}

export function deleteConversation(conversationId: string) {
  return api.delete(`/chat/conversations/${encodeURIComponent(conversationId)}`);
}

export function getConversationMessages(conversationId: string, before?: string, limit = 30) {
  const query = new URLSearchParams({ limit: String(limit) });
  if (before) query.set('before', before);
  return api.get<ApiEnvelope<MessagePage>>(`/chat/conversations/${encodeURIComponent(conversationId)}/messages?${query.toString()}`).then(unwrap);
}

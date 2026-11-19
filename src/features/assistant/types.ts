import type { NutritionSummary } from '@/features/nutrition/types';

export type MessageRole = 'user' | 'assistant' | 'system';
export type ChatApiRole = 'USER' | 'ASSISTANT' | 'SYSTEM';
export type ChatMessageStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  status?: ChatMessageStatus;
  feedback?: -1 | 1 | null;
  isStreaming?: boolean;
};

export type ChatApiMessage = {
  id: string;
  role: ChatApiRole;
  content: string | null;
  status: ChatMessageStatus;
  clientMessageId?: string | null;
  metadata?: Record<string, unknown> | null;
  feedback?: -1 | 1 | null;
  createdAt: string;
};

export type ChatReply = {
  conversationId: string;
  userMessage: ChatApiMessage;
  assistantMessage: ChatApiMessage;
};

export type ChatSuggestion = {
  prompt: string;
  reason: string;
};

export type Conversation = {
  id: string;
  title?: string | null;
  messageCount: number;
  lastMessageAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AssistantContext = {
  summary: NutritionSummary;
  allergens: string[];
  userName?: string;
  weightKg?: number;
};

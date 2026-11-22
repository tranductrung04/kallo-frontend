import type { NutritionSummary } from '@/features/nutrition/types';

export type MessageRole = 'user' | 'assistant' | 'system';
export type ChatApiRole = 'USER' | 'ASSISTANT' | 'SYSTEM';
export type ChatMessageStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  status?: ChatMessageStatus | 'sending' | 'sent' | 'failed';
  feedback?: -1 | 1 | null;
  isStreaming?: boolean;
  clientMessageId?: string;
  errorText?: string;
};

export type ChatApiMessage = {
  id: string;
  role: ChatApiRole;
  content: string | null;
  status?: ChatMessageStatus;
  clientMessageId?: string | null;
  metadata?: {
    suggestedFoods?: { name: string; kcal?: number }[];
    disclaimerAdded?: boolean;
    [key: string]: unknown;
  } | null;
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

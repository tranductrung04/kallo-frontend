import type { NutritionSummary } from '@/features/nutrition/types';

export type MessageRole = 'user' | 'assistant' | 'system';

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isStreaming?: boolean;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
};

export type AssistantContext = {
  summary: NutritionSummary;
  allergens: string[];
  userName?: string;
  weightKg?: number;
};

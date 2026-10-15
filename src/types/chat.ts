export type MessageType = 'user' | 'ai' | 'human' | 'system';

export type RecommendationType = 'gemstone' | 'tarot' | 'consultation' | 'article' | 'promotion';

export interface RecommendationItem {
  id: string;
  type: RecommendationType;
  title: string;
  subtitle?: string;
}

export type MessageStatus = 'sending' | 'sent' | 'failed';

export interface FeedbackState {
  liked?: boolean;
  disliked?: boolean;
  reason?: string;
}

export interface Message {
  id: string;
  type: MessageType;
  text: string;
  timestamp: number;
  recommendations?: RecommendationItem[];
  status?: MessageStatus;
  replyToId?: string;
  feedback?: FeedbackState;
}
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Message, FeedbackState, RecommendationItem } from '../types/chat';

interface ChatContextType {
  messages: Message[];
  loading: boolean;
  error: string | null;
  replyingTo: Message | null;
  addMessage: (text: string) => void;
  deleteMessage: (id: string) => void;
  setReplyingTo: (message: Message | null) => void;
  setFeedback: (id: string, feedback: FeedbackState) => void;
  retryMessage: (id: string) => void;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    type: 'system',
    text: 'Your session with AI Astrologer has started.',
    timestamp: Date.now() - 3600000,
  },
  {
    id: '2',
    type: 'user',
    text: 'Can you tell me about my career this year?',
    timestamp: Date.now() - 3000000,
    status: 'sent',
  },
  {
    id: '3',
    type: 'ai',
    text: 'I can already see a strong Saturn influence in your chart. Based on this, here are a few recommendations that may help you.',
    timestamp: Date.now() - 2400000,
    recommendations: [
      { id: '1', type: 'gemstone', title: 'Blue Sapphire', subtitle: 'Recommended for Saturn' },
      { id: '2', type: 'tarot', title: 'Career Tarot Reading' },
      { id: '3', type: 'consultation', title: 'Talk to an Astrologer' },
      { id: '4', type: 'article', title: 'Understanding Saturn Mahadasha' },
    ],
  },
  {
    id: '4',
    type: 'human',
    text: 'I also recommend focusing on your upcoming Jupiter transit.',
    timestamp: Date.now() - 1000000,
  },
];

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  const addMessage = (text: string) => {
      const userMessageId = Date.now().toString();
      const newMessage: Message = {
        id: userMessageId,
        type: 'user',
        text,
        timestamp: Date.now(),
        status: 'sending',
        replyToId: replyingTo?.id,
      };

      setMessages((prev) => [...prev, newMessage]);
      setReplyingTo(null);

      // 1. Simulate API success for user message after 800ms
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === userMessageId ? { ...m, status: 'sent' } : m))
        );

        // 2. Simulate incoming AI response after another 1200ms
        setTimeout(() => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            text: `I analyzed your query about "${text}". Based on your planetary alignment, here are tailored recommendations for your path forward:`,
            timestamp: Date.now(),
            recommendations: [
              { id: 'rec-1', type: 'tarot', title: 'Daily Guidance Tarot', subtitle: 'Card of the day' },
              { id: 'rec-2', type: 'consultation', title: 'Book 1-on-1 Astrologer', subtitle: '15 min live session' },
              { id: 'rec-3', type: 'promotion', title: 'Special Puja Offering', subtitle: '20% off today' },
            ],
          };
          setMessages((prev) => [...prev, aiResponse]);
        }, 1200);

      }, 800);
    };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const setFeedback = (id: string, feedback: FeedbackState) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback: { ...m.feedback, ...feedback } } : m))
    );
  };

  const retryMessage = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'sending' } : m))
    );
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: 'sent' } : m))
      );
    }, 1000);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        error,
        replyingTo,
        addMessage,
        deleteMessage,
        setReplyingTo,
        setFeedback,
        retryMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
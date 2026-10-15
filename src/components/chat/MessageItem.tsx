import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Message, RecommendationItem } from '../../types/chat';
import { recommendationRegistry } from '../recommendations';
import { useChat } from '../../context/ChatContext';

interface MessageItemProps {
  message: Message;
  onLongPress: (message: Message) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, onLongPress }) => {
  const { setFeedback, retryMessage } = useChat();
  const [showFeedbackChips, setShowFeedbackChips] = useState(false);

  const handleRecommendationPress = (item: RecommendationItem) => {
    Alert.alert(item.title, item.subtitle ? `${item.subtitle}\n(Action triggered)` : 'Action triggered');
  };

  const handleLike = () => {
    setFeedback(message.id, { liked: true, disliked: false, reason: undefined });
    setShowFeedbackChips(false);
  };

  const handleDislike = () => {
    setFeedback(message.id, { liked: false, disliked: true });
    setShowFeedbackChips(true);
  };

  const handleSelectReason = (reason: string) => {
    setFeedback(message.id, { disliked: true, reason });
    setShowFeedbackChips(false);
  };

  // 1. System Events
  if (message.type === 'system') {
    return (
      <View style={styles.systemContainer}>
        <Text style={styles.systemText}>{message.text}</Text>
      </View>
    );
  }

  const isUser = message.type === 'user';
  const isHuman = message.type === 'human';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onLongPress={() => onLongPress(message)}
      style={[
        styles.messageWrapper,
        isUser ? styles.userWrapper : styles.aiWrapper,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser
            ? styles.userBubble
            : isHuman
            ? styles.humanBubble
            : styles.aiBubble,
        ]}
      >
        {/* Sender label for human astrologer */}
        {isHuman && <Text style={styles.senderLabel}>👨‍🏫 Human Astrologer</Text>}
        
        <Text style={styles.messageText}>{message.text}</Text>

        {/* Dynamic Horizontal Recommendations for AI messages */}
        {message.recommendations && message.recommendations.length > 0 && (
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationsHeader}>Recommended for you:</Text>
            <FlatList
              data={message.recommendations}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const CardComponent = recommendationRegistry.get(item.type);
                if (!CardComponent) return null;
                return <CardComponent item={item} onPress={handleRecommendationPress} />;
              }}
            />
          </View>
        )}

        {/* AI Feedback Section */}
        {message.type === 'ai' && (
          <View style={styles.feedbackSection}>
            <View style={styles.feedbackRow}>
              <TouchableOpacity
                style={[styles.feedbackButton, message.feedback?.liked && styles.activeFeedback]}
                onPress={handleLike}
              >
                <Text>👍</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.feedbackButton, message.feedback?.disliked && styles.activeFeedback]}
                onPress={handleDislike}
              >
                <Text>👎</Text>
              </TouchableOpacity>
            </View>

            {/* Expandable Dislike Chips */}
            {showFeedbackChips && (
              <View style={styles.chipsContainer}>
                {['Inaccurate', 'Too Generic', "Didn't Help", 'Too Long'].map((reason) => (
                  <TouchableOpacity
                    key={reason}
                    style={[
                      styles.chip,
                      message.feedback?.reason === reason && styles.activeChip,
                    ]}
                    onPress={() => handleSelectReason(reason)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        message.feedback?.reason === reason && styles.activeChipText,
                      ]}
                    >
                      {reason}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Status / Timestamp footer */}
        <View style={styles.footerRow}>
          <Text style={styles.timestampText}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {isUser && message.status && (
            <View style={styles.statusRow}>
              {message.status === 'sending' && <Text style={styles.statusText}>Sending...</Text>}
              {message.status === 'sent' && <Text style={styles.statusText}>✓ Sent</Text>}
              {message.status === 'failed' && (
                <TouchableOpacity onPress={() => retryMessage(message.id)}>
                  <Text style={styles.failedText}>Failed (Retry)</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  systemContainer: {
    alignSelf: 'center',
    backgroundColor: '#2A2A3C',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginVertical: 8,
  },
  systemText: {
    color: '#A0A0B2',
    fontSize: 12,
  },
  messageWrapper: {
    marginVertical: 6,
    maxWidth: '85%',
  },
  userWrapper: {
    alignSelf: 'flex-end',
  },
  aiWrapper: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#4F46E5',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#1E1E2E',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#2D2D3F',
  },
  humanBubble: {
    backgroundColor: '#1B3B36',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#2E6E60',
  },
  senderLabel: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  recommendationsContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2D2D3F',
    paddingTop: 10,
  },
  recommendationsHeader: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
  },
  feedbackSection: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#2D2D3F',
    paddingTop: 8,
  },
  feedbackRow: {
    flexDirection: 'row',
    gap: 8,
  },
  feedbackButton: {
    backgroundColor: '#2D2D3F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeFeedback: {
    backgroundColor: '#4F46E5',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  chip: {
    backgroundColor: '#2D2D3F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeChip: {
    backgroundColor: '#EC4899',
  },
  chipText: {
    color: '#D1D5DB',
    fontSize: 11,
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  timestampText: {
    color: '#9CA3AF',
    fontSize: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: '#9CA3AF',
    fontSize: 10,
  },
  failedText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '600',
  },
});
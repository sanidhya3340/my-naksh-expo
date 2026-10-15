import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useChat } from '../../context/ChatContext';

export const MessageComposer: React.FC = () => {
  const [text, setText] = useState('');
  const { addMessage, replyingTo, setReplyingTo } = useChat();

  const handleSend = () => {
    if (!text.trim()) return;
    addMessage(text.trim());
    setText('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        {/* Reply Preview Banner */}
        {replyingTo && (
          <View style={styles.replyBanner}>
            <View style={styles.replyContent}>
              <Text style={styles.replyTitle}>Replying to {replyingTo.type.toUpperCase()}</Text>
              <Text style={styles.replyText} numberOfLines={1}>
                {replyingTo.text}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setReplyingTo(null)} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Text Input Row */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask AI Astrologer..."
            placeholderTextColor="#6B7280"
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !text.trim() && styles.disabledSend]}
            onPress={handleSend}
            disabled={!text.trim()}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E2E',
    borderTopWidth: 1,
    borderTopColor: '#2D2D3F',
    padding: 10,
  },
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A3C',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4F46E5',
  },
  replyContent: {
    flex: 1,
  },
  replyTitle: {
    color: '#818CF8',
    fontSize: 11,
    fontWeight: '600',
  },
  replyText: {
    color: '#D1D5DB',
    fontSize: 12,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#2A2A3C',
    color: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  disabledSend: {
    backgroundColor: '#374151',
  },
  sendText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
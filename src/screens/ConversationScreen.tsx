import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { useChat } from '../context/ChatContext';
import { ChatList } from '../components/chat/ChatList';
import { MessageComposer } from '../components/chat/MessageComposer';
import { Message } from '../types/chat';

export const ConversationScreen: React.FC = () => {
  const { messages, loading, error, deleteMessage, setReplyingTo } = useChat();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleLongPress = (message: Message) => {
    setSelectedMessage(message);
  };

  const handleCopy = () => {
    if (selectedMessage) {
      Clipboard.setStringAsync(selectedMessage.text);
      setSelectedMessage(null);
      Alert.alert('Copied', 'Message copied to clipboard');
    }
  };

  const handleReply = () => {
    if (selectedMessage) {
      setReplyingTo(selectedMessage);
      setSelectedMessage(null);
    }
  };

  const handleDelete = () => {
    if (selectedMessage) {
      deleteMessage(selectedMessage.id);
      setSelectedMessage(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MyNaksh AI Astrologer</Text>
        <Text style={styles.headerSubtitle}>Online • Realtime Guidance</Text>
      </View>

      {/* Main Content States */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.stateText}>Loading conversation...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.stateText}>Unable to load conversation.</Text>
        </View>
      ) : messages.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.stateText}>Start your conversation with MyNaksh AI.</Text>
        </View>
      ) : (
        <ChatList messages={messages} onLongPressMessage={handleLongPress} />
      )}

      {/* Message Input */}
      <MessageComposer />

      {/* Long Press Action Modal */}
      <Modal
        visible={!!selectedMessage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMessage(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedMessage(null)}
        >
          <View style={styles.actionMenu}>
            <TouchableOpacity style={styles.actionItem} onPress={handleReply}>
              <Text style={styles.actionText}>💬 Reply</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={handleCopy}>
              <Text style={styles.actionText}>📋 Copy Text</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionItem, styles.deleteAction]} onPress={handleDelete}>
              <Text style={styles.deleteText}>🗑️ Delete Message</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12121D',
  },
  header: {
    padding: 16,
    backgroundColor: '#1E1E2E',
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D3F',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#10B981',
    fontSize: 12,
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionMenu: {
    width: '75%',
    backgroundColor: '#2A2A3C',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#3B3B4F',
  },
  actionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3B3B4F',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  deleteAction: {
    borderBottomWidth: 0,
  },
  deleteText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '600',
  },
});
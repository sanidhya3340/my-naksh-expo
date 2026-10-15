import React, { useRef } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Message } from '../../types/chat';
import { MessageItem } from './MessageItem';

interface ChatListProps {
  messages: Message[];
  onLongPressMessage: (message: Message) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ messages, onLongPressMessage }) => {
  const flatListRef = useRef<FlatList>(null);

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MessageItem message={item} onLongPress={onLongPressMessage} />
      )}
      contentContainerStyle={styles.container}
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      initialNumToRender={15}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
});
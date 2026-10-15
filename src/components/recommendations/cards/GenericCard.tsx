import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { RecommendationComponentProps } from '../RecommendationRegistry';

const getIconForType = (type: string) => {
  switch (type) {
    case 'gemstone': return '💎';
    case 'tarot': return '🔮';
    case 'consultation': return '👨‍🏫';
    case 'article': return '📄';
    case 'promotion': return '🎁';
    default: return '✨';
  }
};

export const RecommendationCard: React.FC<RecommendationComponentProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.8}>
      <Text style={styles.icon}>{getIconForType(item.type)}</Text>
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      {item.subtitle && <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 130,
    backgroundColor: '#262636',
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B3B4F',
  },
  icon: {
    fontSize: 20,
    marginBottom: 6,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  subtitle: {
    color: '#A0A0B2',
    fontSize: 10,
    marginTop: 4,
  },
});
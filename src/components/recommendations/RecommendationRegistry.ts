import React from 'react';
import { RecommendationItem, RecommendationType } from '../../types/chat';

export type RecommendationComponentProps = {
  item: RecommendationItem;
  onPress: (item: RecommendationItem) => void;
};

class RecommendationRegistry {
  private registry = new Map<RecommendationType, React.ComponentType<RecommendationComponentProps>>();

  register(type: RecommendationType, component: React.ComponentType<RecommendationComponentProps>) {
    this.registry.set(type, component);
  }

  get(type: RecommendationType): React.ComponentType<RecommendationComponentProps> | undefined {
    return this.registry.get(type);
  }
}

export const recommendationRegistry = new RecommendationRegistry();
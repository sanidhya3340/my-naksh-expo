import { recommendationRegistry } from './RecommendationRegistry';
import { RecommendationCard } from './cards/GenericCard';

recommendationRegistry.register('gemstone', RecommendationCard);
recommendationRegistry.register('tarot', RecommendationCard);
recommendationRegistry.register('consultation', RecommendationCard);
recommendationRegistry.register('article', RecommendationCard);
recommendationRegistry.register('promotion', RecommendationCard);

export { recommendationRegistry };
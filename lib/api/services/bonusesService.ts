import { BaseService } from './baseService';
import type { 
  BonusesQuery, 
  BonusesQueryVariables,
  BonusesConnectionQuery, 
  BonusesConnectionQueryVariables 
} from '@/tina/__generated__/types';

/**
 * Service for bonuses-related queries
 * Follows the Single Responsibility Principle from SOLID
 */
export class BonusesService extends BaseService {
  private static instance: BonusesService;
  
  private constructor() {
    super();
  }
  
  /**
   * Singleton pattern implementation
   */
  public static getInstance(): BonusesService {
    if (!BonusesService.instance) {
      BonusesService.instance = new BonusesService();
    }
    return BonusesService.instance;
  }
  
  /**
   * Get a bonus by relative path
   */
  async getBonus(relativePath: string): Promise<BonusesQuery['bonuses']> {
    try {
      const { data } = await this.getQueries().bonuses({
        relativePath,
      });
      return data.bonuses;
    } catch (error) {
      console.error('[BonusesService] Failed to fetch bonus:', error);
      throw error;
    }
  }
  
  /**
   * Get bonuses collection with pagination and filtering options
   */
  async getBonusesConnection(variables?: BonusesConnectionQueryVariables): Promise<BonusesConnectionQuery['bonusesConnection']> {
    try {
      const response = await this.getQueries().bonusesConnection(variables);
      return response.data.bonusesConnection;
    } catch (error) {
      console.error('[BonusesService] Failed to fetch bonuses connection:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const bonusesService = BonusesService.getInstance(); 
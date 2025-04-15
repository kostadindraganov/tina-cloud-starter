import { BaseService } from './baseService';
import type { 
  BannersQuery, 
  BannersQueryVariables,
  BannersConnectionQuery, 
  BannersConnectionQueryVariables 
} from '@/tina/__generated__/types';

/**
 * Service for banners-related queries
 * Follows the Single Responsibility Principle from SOLID
 */
export class BannersService extends BaseService {
  private static instance: BannersService;
  
  private constructor() {
    super();
  }
  
  /**
   * Singleton pattern implementation
   */
  public static getInstance(): BannersService {
    if (!BannersService.instance) {
      BannersService.instance = new BannersService();
    }
    return BannersService.instance;
  }
  
  /**
   * Get a banner by relative path
   */
  async getBanner(relativePath: string): Promise<BannersQuery['banners']> {
    try {
      const { data } = await this.getQueries().banners({
        relativePath,
      });
      return data.banners;
    } catch (error) {
      console.error('[BannersService] Failed to fetch banner:', error);
      throw error;
    }
  }
  
  /**
   * Get banners collection with pagination and filtering options
   */
  async getBannersConnection(variables?: BannersConnectionQueryVariables): Promise<BannersConnectionQuery['bannersConnection']> {
    try {
      const response = await this.getQueries().bannersConnection(variables);
      return response.data.bannersConnection;
    } catch (error) {
      console.error('[BannersService] Failed to fetch banners connection:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const bannersService = BannersService.getInstance(); 
import { BaseService } from './baseService';
import type { 
  SlidersQuery, 
  SlidersQueryVariables,
  SlidersConnectionQuery, 
  SlidersConnectionQueryVariables 
} from '@/tina/__generated__/types';

/**
 * Service for sliders-related queries
 * Follows the Single Responsibility Principle from SOLID
 */
export class SlidersService extends BaseService {
  private static instance: SlidersService;
  
  private constructor() {
    super();
  }
  
  /**
   * Singleton pattern implementation
   */
  public static getInstance(): SlidersService {
    if (!SlidersService.instance) {
      SlidersService.instance = new SlidersService();
    }
    return SlidersService.instance;
  }
  
  /**
   * Get a slider by relative path
   */
  async getSlider(relativePath: string): Promise<SlidersQuery['sliders']> {
    try {
      const { data } = await this.getQueries().sliders({
        relativePath,
      });
      return data.sliders;
    } catch (error) {
      console.error('[SlidersService] Failed to fetch slider:', error);
      throw error;
    }
  }
  
  /**
   * Get sliders collection with pagination and filtering options
   */
  async getSlidersConnection(variables?: SlidersConnectionQueryVariables): Promise<SlidersConnectionQuery['slidersConnection']> {
    try {
      const response = await this.getQueries().slidersConnection(variables);
      return response.data.slidersConnection;
    } catch (error) {
      console.error('[SlidersService] Failed to fetch sliders connection:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const slidersService = SlidersService.getInstance(); 
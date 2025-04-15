import { BaseService } from './baseService';
import type { 
  SweepstakesQuery, 
  SweepstakesQueryVariables,
  SweepstakesConnectionQuery, 
  SweepstakesConnectionQueryVariables 
} from '@/tina/__generated__/types';

/**
 * Service for sweepstakes-related queries
 * Follows the Single Responsibility Principle from SOLID
 */
export class SweepstakesService extends BaseService {
  private static instance: SweepstakesService;
  
  private constructor() {
    super();
  }
  
  /**
   * Singleton pattern implementation
   */
  public static getInstance(): SweepstakesService {
    if (!SweepstakesService.instance) {
      SweepstakesService.instance = new SweepstakesService();
    }
    return SweepstakesService.instance;
  }
  
  /**
   * Get a sweepstakes by relative path
   */
  async getSweepstakes(relativePath: string): Promise<SweepstakesQuery['sweepstakes']> {
    try {
      const { data } = await this.getQueries().sweepstakes({
        relativePath,
      });
      return data.sweepstakes;
    } catch (error) {
      console.error('[SweepstakesService] Failed to fetch sweepstakes:', error);
      throw error;
    }
  }
  
  /**
   * Get sweepstakes collection with pagination and filtering options
   */
  async getSweepstakesConnection(variables?: SweepstakesConnectionQueryVariables): Promise<SweepstakesConnectionQuery['sweepstakesConnection']> {
    try {
      const response = await this.getQueries().sweepstakesConnection(variables);
      return response.data.sweepstakesConnection;
    } catch (error) {
      console.error('[SweepstakesService] Failed to fetch sweepstakes connection:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const sweepstakesService = SweepstakesService.getInstance(); 
import { BaseService } from './baseService';
import type { 
  GlobalQuery, 
  GlobalQueryVariables
} from '@/tina/__generated__/types';

/**
 * Service for global-related queries
 * Follows the Single Responsibility Principle from SOLID
 */
export class GlobalService extends BaseService {
  private static instance: GlobalService;
  
  private constructor() {
    super();
  }
  
  /**
   * Singleton pattern implementation
   */
  public static getInstance(): GlobalService {
    if (!GlobalService.instance) {
      GlobalService.instance = new GlobalService();
    }
    return GlobalService.instance;
  }
  
  /**
   * Get global settings
   */
  async getGlobal(relativePath: string = 'global.json'): Promise<GlobalQuery['global']> {
    try {
      const { data } = await this.getQueries().global({
        relativePath,
      });
      return data.global;
    } catch (error) {
      console.error('[GlobalService] Failed to fetch global settings:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const globalService = GlobalService.getInstance(); 
import { BaseService } from './baseService';
import type { 
  CasinoQuery, 
  CasinoQueryVariables,
  CasinoConnectionQuery, 
  CasinoConnectionQueryVariables 
} from '@/tina/__generated__/types';

/**
 * Service for casino-related queries
 * Follows the Single Responsibility Principle from SOLID
 */
export class CasinoService extends BaseService {
  private static instance: CasinoService;
  
  private constructor() {
    super();
  }
  
  /**
   * Singleton pattern implementation
   */
  public static getInstance(): CasinoService {
    if (!CasinoService.instance) {
      CasinoService.instance = new CasinoService();
    }
    return CasinoService.instance;
  }
  
  /**
   * Get a casino by relative path
   */
  async getCasino(relativePath: string): Promise<CasinoQuery['casino']> {
    try {
      const { data } = await this.getQueries().casino({
        relativePath,
      });
      return data.casino;
    } catch (error) {
      console.error('[CasinoService] Failed to fetch casino:', error);
      throw error;
    }
  }
  
  /**
   * Get casinos collection with pagination and filtering options
   */
  async getCasinoConnection(variables?: CasinoConnectionQueryVariables): Promise<CasinoConnectionQuery['casinoConnection']> {
    try {
      const response = await this.getQueries().casinoConnection(variables);
      return response.data.casinoConnection;
    } catch (error) {
      console.error('[CasinoService] Failed to fetch casino connection:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const casinoService = CasinoService.getInstance(); 
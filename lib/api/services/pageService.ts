import { BaseService } from './baseService';
import type { 
  PageQuery, 
  PageQueryVariables,
  PageConnectionQuery, 
  PageConnectionQueryVariables 
} from '@/tina/__generated__/types';

/**
 * Service for page-related queries
 * Follows the Single Responsibility Principle from SOLID
 */
export class PageService extends BaseService {
  private static instance: PageService;
  
  private constructor() {
    super();
  }
  
  /**
   * Singleton pattern implementation
   */
  public static getInstance(): PageService {
    if (!PageService.instance) {
      PageService.instance = new PageService();
    }
    return PageService.instance;
  }
  
  /**
   * Get a page by relative path
   */
  async getPage(relativePath: string): Promise<PageQuery['page']> {
    try {
      const { data } = await this.getQueries().page({
        relativePath,
      });
      return data.page;
    } catch (error) {
      console.error('[PageService] Failed to fetch page:', error);
      throw error;
    }
  }
  
  /**
   * Get pages collection with pagination and filtering options
   */
  async getPageConnection(variables?: PageConnectionQueryVariables): Promise<PageConnectionQuery['pageConnection']> {
    try {
      const response = await this.getQueries().pageConnection(variables);
      return response.data.pageConnection;
    } catch (error) {
      console.error('[PageService] Failed to fetch page connection:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const pageService = PageService.getInstance(); 
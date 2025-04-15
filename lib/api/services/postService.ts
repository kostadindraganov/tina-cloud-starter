import { BaseService } from './baseService';
import type { 
  PostQuery, 
  PostQueryVariables,
  PostConnectionQuery, 
  PostConnectionQueryVariables 
} from '@/tina/__generated__/types';

/**
 * Service for post-related queries
 * Follows the Single Responsibility Principle from SOLID
 */
export class PostService extends BaseService {
  private static instance: PostService;
  
  private constructor() {
    super();
  }
  
  /**
   * Singleton pattern implementation
   */
  public static getInstance(): PostService {
    if (!PostService.instance) {
      PostService.instance = new PostService();
    }
    return PostService.instance;
  }
  
  /**
   * Get a post by relative path
   */
  async getPost(relativePath: string): Promise<PostQuery['post']> {
    try {
      const { data } = await this.getQueries().post({
        relativePath,
      });
      return data.post;
    } catch (error) {
      console.error('[PostService] Failed to fetch post:', error);
      throw error;
    }
  }
  
  /**
   * Get posts collection with pagination and filtering options
   */
  async getPostConnection(variables?: PostConnectionQueryVariables): Promise<PostConnectionQuery['postConnection']> {
    try {
      const response = await this.getQueries().postConnection(variables);
      return response.data.postConnection;
    } catch (error) {
      console.error('[PostService] Failed to fetch post connection:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const postService = PostService.getInstance(); 
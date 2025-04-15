import { tinaClient } from '../tinaClient';

/**
 * Base service class that follows the Single Responsibility Principle
 * Each service is responsible for a specific entity type
 */
export abstract class BaseService {
  protected client = tinaClient;
  
  /**
   * Get the client
   */
  getClient() {
    return this.client.getClient();
  }
  
  /**
   * Get queries from the client
   */
  getQueries() {
    return this.client.getQueries();
  }
} 
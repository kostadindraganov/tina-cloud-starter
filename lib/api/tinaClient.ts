import client from '@/tina/__generated__/client';
import type { Sdk } from '@/tina/__generated__/types';

/**
 * Abstract API client interface
 * This follows the Interface Segregation Principle from SOLID
 */
export interface ApiClient {
  getClient(): any;
  getQueries(): any;
}

/**
 * TinaCMS API client implementation
 * This follows the Dependency Inversion Principle from SOLID
 */
export class TinaClient implements ApiClient {
  private static instance: TinaClient;
  
  private constructor() {}
  
  /**
   * Singleton pattern implementation
   */
  public static getInstance(): TinaClient {
    if (!TinaClient.instance) {
      TinaClient.instance = new TinaClient();
    }
    return TinaClient.instance;
  }
  
  /**
   * Get the raw TinaCMS client
   */
  public getClient() {
    return client;
  }
  
  /**
   * Get the queries from the client
   */
  public getQueries() {
    return client.queries;
  }
}

// Export a singleton instance
export const tinaClient = TinaClient.getInstance(); 
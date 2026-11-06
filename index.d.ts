import { Server } from 'node:http';

export interface RouteDefinition {
  status?: number;
  body?: any;
}

export interface MockServerConfig {
  routes?: Record<string, any>;
  latency?: string | number;
  chaosRate?: number;
  rateLimit?: number;
  rateLimitWindowMs?: number;
  quiet?: boolean;
}

export declare function createMockServer(config?: MockServerConfig): Server;
export declare class ChaosEngine {
  constructor(options?: { latency?: string | number; chaosRate?: number; rateLimit?: number });
  applyLatency(): Promise<number>;
  shouldInjectFailure(): boolean;
  getRandomChaosStatus(): number;
  isRateLimited(): boolean;
}


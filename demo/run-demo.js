#!/usr/bin/env node
/**
 * hyper-mock: Interactive Live Demo
 */

import { ChaosEngine } from '../src/chaos.js';

console.log('\n🚀 Starting hyper-mock Interactive Demo...\n');

console.log('1. Chaos Latency Engine Simulation:');
const chaos = new ChaosEngine({ latency: '150-400', chaosRate: 0.25, rateLimit: 5 });

console.log('------------------------------------------------------------');
for (let i = 1; i <= 6; i++) {
  const isRateLimited = chaos.isRateLimited();
  const shouldFail = chaos.shouldInjectFailure();
  const status = isRateLimited ? 429 : shouldFail ? chaos.getRandomChaosStatus() : 200;
  const statusBadge = status === 200 ? '✅ 200 OK' : status === 429 ? '⚠️  429 RATE LIMIT' : `❌ ${status} CHAOS FAILURE`;
  console.log(`Request #${i} -> ${statusBadge}`);
}
console.log('------------------------------------------------------------\n');

console.log('2. Server-Sent Events (SSE) AI Streaming Preview:');
console.log('------------------------------------------------------------');
console.log('data: {"id":"chatcmpl-1","delta":{"content":"Here"}}');
console.log('data: {"id":"chatcmpl-2","delta":{"content":" is"}}');
console.log('data: {"id":"chatcmpl-3","delta":{"content":" an"}}');
console.log('data: {"id":"chatcmpl-4","delta":{"content":" AI stream."}}');
console.log('data: [DONE]');
console.log('------------------------------------------------------------');
console.log('🎉 Demo completed successfully!\n');


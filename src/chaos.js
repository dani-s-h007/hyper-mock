/**
 * hyper-mock: Chaos Engine (Latency Jitter, Flakiness & Rate Limiting)
 */

export class ChaosEngine {
  /**
   * @param {object} [options]
   * @param {string|number} [options.latency] e.g. "100-400" or 200
   * @param {number} [options.chaosRate=0] 0.0 to 1.0 (e.g. 0.2 = 20% failure rate)
   * @param {number} [options.rateLimit] max requests per window
   * @param {number} [options.rateLimitWindowMs=1000]
   */
  constructor(options = {}) {
    this.minLatency = 0;
    this.maxLatency = 0;
    this.parseLatency(options.latency);
    this.chaosRate = options.chaosRate ?? 0;
    this.rateLimit = options.rateLimit ?? 0;
    this.rateLimitWindowMs = options.rateLimitWindowMs ?? 1000;

    this.requestTimestamps = [];
  }

  parseLatency(val) {
    if (!val) return;
    if (typeof val === 'number') {
      this.minLatency = val;
      this.maxLatency = val;
      return;
    }
    const parts = String(val).split('-');
    if (parts.length === 2) {
      this.minLatency = parseInt(parts[0], 10) || 0;
      this.maxLatency = parseInt(parts[1], 10) || this.minLatency;
    } else {
      this.minLatency = parseInt(parts[0], 10) || 0;
      this.maxLatency = this.minLatency;
    }
  }

  async applyLatency() {
    if (this.maxLatency <= 0) return 0;
    const delay = Math.floor(Math.random() * (this.maxLatency - this.minLatency + 1)) + this.minLatency;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return delay;
  }

  shouldInjectFailure() {
    if (this.chaosRate <= 0) return false;
    return Math.random() < this.chaosRate;
  }

  getRandomChaosStatus() {
    const statuses = [500, 502, 503, 504];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  isRateLimited() {
    if (this.rateLimit <= 0) return false;
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter((t) => now - t < this.rateLimitWindowMs);
    if (this.requestTimestamps.length >= this.rateLimit) {
      return true;
    }
    this.requestTimestamps.push(now);
    return false;
  }
}


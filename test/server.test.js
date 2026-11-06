import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Readable, Writable } from 'node:stream';
import { createMockServer } from '../src/server.js';
import { ChaosEngine } from '../src/chaos.js';

class MockResponse extends Writable {
  constructor() {
    super();
    this.statusCode = 200;
    this.headers = {};
    this.body = '';
  }

  setHeader(name, val) {
    this.headers[name.toLowerCase()] = val;
  }

  writeHead(status, headers = {}) {
    this.statusCode = status;
    for (const [k, v] of Object.entries(headers)) {
      this.headers[k.toLowerCase()] = v;
    }
  }

  _write(chunk, encoding, callback) {
    this.body += chunk.toString();
    callback();
  }
}

function createMockRequest(method, url) {
  const req = new Readable({
    read() {
      this.push(null);
    }
  });
  req.method = method;
  req.url = url;
  req.headers = { host: 'localhost:4000' };
  return req;
}

describe('hyper-mock', () => {
  describe('ChaosEngine', () => {
    it('parses latency ranges correctly', () => {
      const chaos = new ChaosEngine({ latency: '100-300' });
      assert.equal(chaos.minLatency, 100);
      assert.equal(chaos.maxLatency, 300);
    });

    it('enforces rate limits accurately', () => {
      const chaos = new ChaosEngine({ rateLimit: 3, rateLimitWindowMs: 1000 });
      assert.equal(chaos.isRateLimited(), false); // 1
      assert.equal(chaos.isRateLimited(), false); // 2
      assert.equal(chaos.isRateLimited(), false); // 3
      assert.equal(chaos.isRateLimited(), true);  // 4 exceeds limit
    });
  });

  describe('createMockServer HTTP dispatcher', () => {
    it('serves custom defined routes and status codes', async () => {
      const server = createMockServer({
        quiet: true,
        routes: {
          'GET /api/v1/users': { status: 200, body: [{ id: 1, name: 'Alice' }] }
        }
      });

      const req = createMockRequest('GET', '/api/v1/users');
      const res = new MockResponse();

      await new Promise((resolve) => {
        res.on('finish', resolve);
        server.emit('request', req, res);
      });

      assert.equal(res.statusCode, 200);
      assert.equal(res.headers['access-control-allow-origin'], '*');
      assert.deepEqual(JSON.parse(res.body), [{ id: 1, name: 'Alice' }]);
    });

    it('serves SSE streaming endpoint with token events', async () => {
      const server = createMockServer({ quiet: true });
      const req = createMockRequest('GET', '/api/chat/stream');
      const res = new MockResponse();

      await new Promise((resolve) => {
        res.on('finish', resolve);
        server.emit('request', req, res);
      });

      assert.equal(res.statusCode, 200);
      assert.equal(res.headers['content-type'], 'text/event-stream');
      assert.ok(res.body.includes('data:'));
      assert.ok(res.body.includes('[DONE]'));
    });
  });
});

# hyper-mock

[![CI](https://github.com/dani-s-h007/hyper-mock/actions/workflows/ci.yml/badge.svg)](https://github.com/dani-s-h007/hyper-mock/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](package.json)

> **Instant zero-config mock API, SSE streaming & chaos testing server for frontends and microservices.**

Building resilient client applications requires testing adverse real-world network conditions: high latency, flaky 500 errors, rate-limiting (HTTP 429), and streaming AI token responses. Setting up bloated mock tools or waiting for backend endpoints slows development. `hyper-mock` starts in under 5 milliseconds with zero dependencies, offers built-in chaos engineering, full CORS support, and out-of-the-box Server-Sent Events (SSE) AI streaming.

---

## Features

- **Instant Zero-Config Boot**: Spawns an HTTP mock server in < 5ms using native Node.js HTTP.
- **Built-in Chaos Engineering**:
  - `--latency 150-600`: Injects realistic network jitter.
  - `--chaos 0.2`: Randomly fails 20% of requests with 500, 502, 503, or 504 errors.
  - `--rate-limit 10`: Enforces rate limits with automatic 429 responses.
- **AI SSE Streaming Generator**: Built-in `/api/chat/stream` endpoint mimics OpenAI/Claude streaming with token deltas, typewriter animations, and `data: [DONE]` termination.
- **JSON Route Schema**: Load declarative route configurations from any JSON file.
- **Full CORS Enabled**: Preflight `OPTIONS` and standard headers allowed by default.
- **Zero Runtime Dependencies**: Ultra-fast execution with zero third-party dependencies.

---

## Installation

```bash
# Run on-demand with npx
npx hyper-mock --help

# Or install globally
npm install -g hyper-mock
```

---

## CLI Usage

### Instant Boot
```bash
# Start mock server on port 4000:
hyper-mock -p 4000
```

### Chaos & Latency Simulation
```bash
# Add 200-800ms latency and 15% random failure rate:
hyper-mock --latency 200-800 --chaos 0.15
```

### Load Custom Route Definitions
```bash
# mock-routes.json
# {
#   "GET /api/v1/users": [{ "id": 1, "name": "Ada Lovelace" }],
#   "POST /api/v1/login": { "status": 200, "body": { "token": "jwt-token-xyz" } }
# }

hyper-mock --routes mock-routes.json
```

### Test AI Streaming UI
```bash
# Stream token chunks token-by-token:
curl -N http://localhost:4000/api/chat/stream
```

---

## Programmatic TypeScript API

```typescript
import { createMockServer } from 'hyper-mock';

const server = createMockServer({
  latency: '100-300',
  chaosRate: 0.1,
  routes: {
    'GET /api/status': { ok: true, version: '1.0.0' }
  }
});

server.listen(4000, () => {
  console.log('Mock server running on http://localhost:4000');
});
```

---

## Testing

```bash
npm test
```

---

## License

MIT © Essentials Toolkit Authors


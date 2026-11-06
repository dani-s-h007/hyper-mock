/**
 * hyper-mock: CLI Interface
 */

import { parseArgs } from 'node:util';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createMockServer } from './server.js';

export async function runCli(argv = process.argv.slice(2)) {
  const options = {
    help: { type: 'boolean', short: 'h', default: false },
    version: { type: 'boolean', short: 'v', default: false },
    port: { type: 'string', short: 'p', default: '4000' },
    routes: { type: 'string', short: 'r' },
    latency: { type: 'string', short: 'l' },
    chaos: { type: 'string', short: 'c' },
    'rate-limit': { type: 'string' },
    quiet: { type: 'boolean', short: 'q', default: false }
  };

  let parsed;
  try {
    parsed = parseArgs({ args: argv, options, allowPositionals: true });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  const { values } = parsed;

  if (values.help) {
    printHelp();
    return 0;
  }

  if (values.version) {
    console.log('hyper-mock v1.0.0');
    return 0;
  }

  const port = parseInt(values.port, 10);
  let loadedRoutes = {};

  if (values.routes) {
    try {
      const content = readFileSync(resolve(values.routes), 'utf8');
      loadedRoutes = JSON.parse(content);
    } catch (err) {
      console.error(`Error loading routes from "${values.routes}": ${err.message}`);
      process.exit(1);
    }
  }

  const chaosRate = values.chaos ? parseFloat(values.chaos) : 0;
  const rateLimit = values['rate-limit'] ? parseInt(values['rate-limit'], 10) : 0;

  const server = createMockServer({
    routes: loadedRoutes,
    latency: values.latency,
    chaosRate,
    rateLimit,
    quiet: values.quiet
  });

  server.listen(port, () => {
    if (!values.quiet) {
      console.log('\n[hyper-mock] Server listening on:');
      console.log(`   http://localhost:${port}`);
      console.log('------------------------------------------------------------');
      console.log(`- Base Endpoint:      http://localhost:${port}/health`);
      console.log(`- AI SSE Stream:      http://localhost:${port}/api/chat/stream`);
      if (values.latency) console.log(`- Latency Simulation: ${values.latency}ms`);
      if (chaosRate > 0) console.log(`- Chaos Failure Rate: ${(chaosRate * 100).toFixed(0)}%`);
      if (rateLimit > 0) console.log(`- Rate Limit:         ${rateLimit} req/sec`);
      console.log('------------------------------------------------------------\n');
    }
  });

  return new Promise(() => {}); // Keep alive
}

function printHelp() {
  console.log(`
hyper-mock - Instant Zero-Config Mock API, SSE Streaming & Chaos Server

USAGE:
  $ hyper-mock [flags]

FLAGS:
  -p, --port <number>       Port to listen on (default: 4000)
  -r, --routes <file.json>  Load custom route schema file
  -l, --latency <ms|min-max> Add artificial latency (e.g. 200 or 150-600)
  -c, --chaos <rate>        Inject random 500/502/503 errors (0.0 to 1.0)
      --rate-limit <reqs>   Max requests allowed per second before 429
  -q, --quiet               Disable request logging to stdout
  -v, --version             Show version
  -h, --help                Show help

EXAMPLES:
  # Boot an instant mock server on port 5000:
  $ hyper-mock -p 5000

  # Simulate slow cellular network (400-900ms jitter) with 15% server errors:
  $ hyper-mock -l 400-900 -c 0.15

  # Test AI streaming UI with built-in SSE endpoint:
  $ curl -N http://localhost:4000/api/chat/stream
`);
}


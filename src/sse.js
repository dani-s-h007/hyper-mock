/**
 * hyper-mock: Server-Sent Events (SSE) AI Streaming Simulator
 */

const DEFAULT_STREAM_WORDS = [
  'Here', ' is', ' a', ' simulated', ' response', ' demonstrating', ' streaming',
  ' Server-Sent', ' Events', ' for', ' your', ' application.', ' It', ' allows',
  ' you', ' to', ' test', ' token-by-token', ' UI', ' rendering', ' and', ' typewriter',
  ' animations', ' without', ' incurring', ' cloud', ' AI', ' inference', ' charges.'
];

export async function handleSseStream(res, options = {}) {
  const words = options.words || DEFAULT_STREAM_WORDS;
  const chunkIntervalMs = options.intervalMs || 45;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  for (let i = 0; i < words.length; i++) {
    const chunk = JSON.stringify({
      id: `chatcmpl-${Date.now()}-${i}`,
      delta: { content: words[i] },
      index: i,
      finish_reason: i === words.length - 1 ? 'stop' : null
    });

    res.write(`data: ${chunk}\n\n`);
    await new Promise((resolve) => setTimeout(resolve, chunkIntervalMs));
  }

  res.write('data: [DONE]\n\n');
  res.end();
}


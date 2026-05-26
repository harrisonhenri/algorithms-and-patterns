---
tags: [javascript, nodejs, streams, backpressure, generators, concurrency, queuing]
title: "Node.js Stream Concurrency: Backpressure, Generators & Queuing Strategies"
domain: "language-mechanics"
---

# Node.js Stream Concurrency: Backpressure, Generators & Queuing Strategies

Processing large datasets efficiently in Node.js requires understanding **how data flows** through your application and **how to prevent overwhelming** your system. This guide ties together three core concepts: backpressure, generators, and queuing strategies.

---

## Overview: Three Complementary Patterns

```
┌─────────────────────────────────────────────────────────────┐
│ DATA SOURCE                                                 │
│ (File, API, Database, Array)                                │
└────────────────────┬────────────────────────────────────────┘
                     │
    ┌────────────────▼────────────────┐
    │ GENERATORS / ASYNC ITERATION     │
    │ (Lazy evaluation, memory efficient)
    └────────────┬─────────────────────┘
                 │
    ┌────────────▼────────────────┐
    │ TRANSFORM STREAM            │
    │ (Process items in batches)  │
    └────────────┬─────────────────┘
                 │
    ┌────────────▼────────────────┐
    │ BACKPRESSURE               │
    │ (Auto-throttles producer)  │
    └────────────┬─────────────────┘
                 │
    ┌────────────▼────────────────┐
    │ QUEUING STRATEGY           │
    │ (p-queue, p-limit, custom) │
    └────────────┬─────────────────┘
                 │
    ┌────────────▼────────────────────────────┐
    │ SINK (Database, API, Cache)            │
    └──────────────────────────────────────────┘
```

---

## Quick Reference: When to Use What

| Problem | Solution | File |
|---------|----------|------|
| Producer generating data faster than consumer can handle | **Backpressure** | [backpressure.md](backpressure.md) |
| Need lazy evaluation, memory efficiency, iterate without loading all data | **Generators** | [generators-and-async-iteration.md](generators-and-async-iteration.md) |
| Group items into fixed-size chunks before processing | **Batch Processing** | [queuing-strategies.md](queuing-strategies.md) |
| Limit concurrent operations (e.g., max 5 parallel API calls) | **p-queue / p-limit** | [queuing-strategies.md](queuing-strategies.md) |
| Process items one-by-one with automatic flow control | **Transform Streams** | [backpressure.md](backpressure.md) |

---

## Mental Model: The Three-Layer Stack

### Layer 1: Generators & Async Iteration (Source)
**"Lazy production of items"**

Generators yield items on-demand instead of loading everything into memory upfront.

```ts
async function* readLargeFile(path: string) {
  // Yields items lazily
  yield item1;
  yield item2;
  // ... etc
}
```

**Benefit**: Memory constant regardless of dataset size.

**Deep dive**: [generators-and-async-iteration.md](generators-and-async-iteration.md)

---

### Layer 2: Transform Streams + Backpressure (Processing)
**"Controlled transformation with automatic throttling"**

The Transform Stream:
- Processes items one-by-one
- Accumulates results in batches
- Sends batches downstream
- Automatically pauses if downstream can't keep up (backpressure)

```ts
const transformStream = new Transform({
  objectMode: true,
  async transform(item, encoding, callback) {
    const results = await processItem(item);
    batch.push(...results);
    
    if (batch.length >= batchSize) {
      callback(null, batch);
      batch = [];
    } else {
      callback();
    }
  }
});

sourceStream.pipe(transformStream);
```

**Benefit**: Data flows at the pace the system can handle; automatic pause/resume.

**Deep dive**: [backpressure.md](backpressure.md)

---

### Layer 3: Queuing Strategies (Concurrency Control)
**"Explicit concurrency limits for batch operations"**

When backpressure isn't enough (e.g., you need to limit concurrent API calls within a batch), use:

- **p-queue**: Full-featured queue with priority, delays, concurrency limits
- **p-limit**: Lightweight concurrency limiter (simpler than p-queue)
- **Custom**: Roll your own for specific needs

```ts
const queue = new PQueue({ concurrency: 5 });

const results = await Promise.all(
  batch.map(item => queue.add(() => callExpensiveAPI(item)))
);
```

**Benefit**: Explicit control over resource usage (network connections, thread pools, etc.).

**Deep dive**: [queuing-strategies.md](queuing-strategies.md)

---

## Real-World Example: Full Pipeline

**Scenario**: Process 1 million log entries, extract metrics, send to API in batches of 100.

```ts
import { Transform, Readable, pipeline } from 'stream';
import { promisify } from 'util';
import PQueue from 'p-queue';

const asyncPipeline = promisify(pipeline);

// Layer 1: Generator source (memory efficient)
async function* readLogs(filePath: string) {
  const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
  for await (const line of fileStream) {
    yield JSON.parse(line);
  }
}

// Layer 2: Transform stream + backpressure
let batch: any[] = [];
const batchSize = 100;
const queue = new PQueue({ concurrency: 3 }); // Layer 3: Queuing

const transformStream = new Transform({
  objectMode: true,
  async transform(logEntry, encoding, callback) {
    try {
      const metrics = extractMetrics(logEntry);
      batch.push(metrics);

      if (batch.length >= batchSize) {
        const batchToSend = [...batch];
        batch = [];

        // Queue the API call; backpressure pauses generator if queue fills up
        queue.add(() => sendToAPI(batchToSend));
      }
      callback();
    } catch (err) {
      callback(err);
    }
  },
  async flush(callback) {
    if (batch.length > 0) {
      await queue.add(() => sendToAPI(batch));
    }
    callback();
  }
});

// Run the pipeline
(async () => {
  const sourceStream = Readable.from(readLogs('./logs.jsonl'));
  await asyncPipeline(sourceStream, transformStream);
  console.log('Done!');
})();
```

---

## Key Takeaways

1. **Backpressure** is automatic in Node.js Streams—data pauses upstream when the downstream can't keep up.
2. **Generators** provide memory-efficient data sources with lazy evaluation.
3. **Queuing strategies** (p-queue, p-limit) add explicit concurrency control when needed.
4. **Combine all three** for robust, scalable data processing.

---

## Further Reading

- [Backpressure in Node.js](backpressure.md) — Understand flow control and when it triggers
- [Generators and Async Iteration](generators-and-async-iteration.md) — Memory-efficient data sources
- [Queuing Strategies](queuing-strategies.md) — Concurrency control and batch processing
- [Event Loop, libuv & V8](event-loop-libuv-v8.md) — How Node.js executes async code

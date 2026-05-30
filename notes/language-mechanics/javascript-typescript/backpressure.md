---
tags: [javascript, nodejs, streams, backpressure, flow-control]
title: "Backpressure in Node.js Streams"
domain: "language-mechanics"
---

# Backpressure in Node.js Streams

Backpressure is Node.js's automatic mechanism for **preventing a producer from overwhelming a consumer**. When the consumer can't keep up, the producer pauses automatically.

---

## The Problem: Producer-Consumer Mismatch

Imagine:
- Producer writes 10,000 items/second
- Consumer processes 100 items/second

Without backpressure, all 10,000 items queue up in memory → **memory leak**.

With backpressure:
- Consumer signals: "I'm busy, slow down"
- Producer pauses automatically
- Memory stays constant

---

## How Backpressure Works in Streams

### The Core Mechanism

```ts
readable.pipe(transformStream).pipe(writable);
```

When you call `stream.write()` or `stream.push()`:

1. **If internal buffer is below `highWaterMark`** → returns `true` ("keep writing")
2. **If internal buffer exceeds `highWaterMark`** → returns `false` ("pause, I'm full")

```ts
const writeStream = fs.createWriteStream('output.txt');
writeStream.highWaterMark; // Default: 16KB (for most streams)

// Producer respects the return value
if (!writeStream.write(data)) {
  console.log('Backpressure: pausing producer');
  producer.pause(); // Your code must handle this
}
```

### Automatic Backpressure with `.pipe()`

When you use `.pipe()`, backpressure is **automatic**:

```ts
readable.pipe(writable); // ✅ Backpressure handled automatically
```

Internally, `.pipe()` listens to the return value of `.write()` and calls `.pause()` / `.resume()` on the source stream automatically.

### Manual Backpressure Handling

If you're **not using `.pipe()`**, you handle backpressure manually:

```ts
const readable = getInputStream();
const writable = getOutputStream();

readable.on('data', (chunk) => {
  const canContinue = writable.write(chunk);
  
  if (!canContinue) {
    console.log('Backpressure triggered: pausing readable');
    readable.pause();
  }
});

writable.on('drain', () => {
  console.log('Buffer drained: resuming readable');
  readable.resume();
});
```

---

## Transform Streams: Backpressure Example

A Transform Stream is both a consumer (receives input) and a producer (sends output). It must handle backpressure in both directions.

```ts
import { Transform } from 'stream';

const transformStream = new Transform({
  objectMode: true,
  highWaterMark: 16, // Small buffer to demonstrate backpressure

  async transform(chunk, encoding, callback) {
    try {
      // Simulate slow processing
      const result = await slowAsyncOperation(chunk);

      // Push result; if buffer is full, callback will pause automatically
      // when you call callback(null, result)
      callback(null, result);
    } catch (err) {
      callback(err);
    }
  },
});

readable.pipe(transformStream).pipe(writable);
```

**What happens:**
1. `readable` produces chunks
2. `transformStream` processes slowly
3. If `transformStream`'s internal buffer fills to `highWaterMark`:
   - `writable.write()` returns `false`
   - `.pipe()` automatically pauses `readable`
4. As `writable` drains, `readable` resumes

---

## Monitoring Backpressure: Metrics

From [common-metrics.md](../common-metrics.md):

### Queue Depth
```ts
const queueDepth = writable.writableLength; // bytes pending in buffer
const highWaterMark = writable.writableHighWaterMark;
const backpressureRatio = queueDepth / highWaterMark;

if (backpressureRatio > 0.8) {
  console.warn('High backpressure detected');
}
```

### Throughput
```ts
let bytesProcessed = 0;
let startTime = Date.now();

stream.on('data', (chunk) => {
  bytesProcessed += chunk.length;
  const elapsed = (Date.now() - startTime) / 1000;
  const throughput = bytesProcessed / elapsed; // bytes/sec
  console.log(`Throughput: ${(throughput / 1024 / 1024).toFixed(2)} MB/s`);
});
```

---

## Real-World Example: File Copy with Backpressure

```ts
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

const asyncPipeline = promisify(pipeline);

async function copyFile(src: string, dest: string) {
  let bytesRead = 0;
  let startTime = Date.now();

  const readable = fs.createReadStream(src);
  const writable = fs.createWriteStream(dest);

  // Monitor backpressure
  readable.on('pause', () => {
    console.log(`Backpressure: paused at ${bytesRead} bytes`);
  });

  readable.on('resume', () => {
    console.log(`Backpressure: resumed`);
  });

  readable.on('data', (chunk) => {
    bytesRead += chunk.length;
  });

  try {
    await asyncPipeline(readable, writable);
    const elapsed = (Date.now() - startTime) / 1000;
    console.log(
      `Copied ${(bytesRead / 1024 / 1024).toFixed(2)} MB in ${elapsed.toFixed(2)}s`
    );
  } catch (err) {
    console.error('Pipeline failed:', err);
  }
}

copyFile('./large-file.bin', './copy.bin');
```

---

## Transform Stream + Batch Processing Example

This example (translated from the original Portuguese documentation) demonstrates backpressure in a real batch processor:

```ts
import { Transform, Readable } from 'stream';
import { promisify } from 'util';
import { pipeline } from 'stream';

interface BatchProcessorOptions<T, R> {
  batchSize: number;
  processItem: (item: T) => Promise<R[]>;
  processBatch: (batch: R[]) => Promise<void>;
  identifier?: string;
}

interface BatchProcessingResult {
  totalProcessed: number;
  failedBatches: number;
}

function createBatchProcessor<T, R>(
  options: BatchProcessorOptions<T, R>
): {
  transformStream: Transform;
  getResults: () => BatchProcessingResult;
} {
  const {
    batchSize,
    processItem,
    processBatch,
    identifier = 'BatchProcessor',
  } = options;

  let batch: R[] = [];
  let totalProcessed = 0;
  let failedBatches = 0;

  const transformStream = new Transform({
    objectMode: true,

    async transform(item: T, encoding, callback) {
      try {
        // Process single item; can produce multiple results
        const processedItems = await processItem(item);
        batch.push(...processedItems);

        // Send batch when it reaches target size
        if (batch.length >= batchSize) {
          const batchToSend = [...batch];
          batch = [];

          try {
            await processBatch(batchToSend);
            totalProcessed += batchToSend.length;
          } catch (err) {
            failedBatches++;
            console.error(
              `${identifier}: Batch processing failed:`,
              err
            );
          }
        }

        callback(); // Signal ready for next item; backpressure handled by pipe()
      } catch (err) {
        callback(err); // Error stops the pipeline
      }
    },

    async flush(callback) {
      // Send remaining items in the batch when stream ends
      if (batch.length > 0) {
        try {
          await processBatch(batch);
          totalProcessed += batch.length;
        } catch (err) {
          failedBatches++;
          console.error(
            `${identifier}: Final batch processing failed:`,
            err
          );
        }
      }
      callback();
    },
  });

  return {
    transformStream,
    getResults: () => ({ totalProcessed, failedBatches }),
  };
}

// Usage Example
async function example() {
  const data = Array.from({ length: 10000 }, (_, i) => ({ id: i }));

  const { transformStream, getResults } = createBatchProcessor({
    batchSize: 100,
    processItem: async (item) => {
      // Single item → multiple results
      return [
        { ...item, processed: true },
        { ...item, duplicated: true },
      ];
    },
    processBatch: async (batch) => {
      // Simulate slow API call
      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log(`Processed batch of ${batch.length} items`);
    },
    identifier: 'LogBatchProcessor',
  });

  const sourceStream = Readable.from(data, { objectMode: true });
  const asyncPipeline = promisify(pipeline);

  try {
    await asyncPipeline(sourceStream, transformStream);
    const result = getResults();
    console.log('Result:', result);
    // Result: { totalProcessed: 20000, failedBatches: 0 }
  } catch (err) {
    console.error('Pipeline failed:', err);
  }
}

example();
```

---

## Why Backpressure Matters

| Scenario | Without Backpressure | With Backpressure |
|----------|---------------------|-------------------|
| Copying 1GB file | OOM (all 1GB buffered) | Constant memory |
| API ingestion | Network timeouts | Smooth flow |
| Database insert | Crashed process | Graceful throttling |

---

## Key Takeaways

1. **Backpressure is automatic with `.pipe()`**—use it unless you have special needs.
2. **Manual backpressure**: respect the return value of `.write()` and listen to `'drain'` events.
3. **Transform Streams** bridge producer and consumer, managing backpressure in both directions.
4. **Monitor backpressure** using `writableLength`, `writableHighWaterMark`, and `'pause'`/`'resume'` events.
5. **Batching + Backpressure** = scalable processing of large datasets.

---

## Related

- [Queuing Strategies](queuing-strategies.md) — Explicit concurrency limits (p-queue, p-limit)
- [Generators and Async Iteration](generators-and-async-iteration.md) — Lazy data sources for streams
- [Event Loop, libuv & V8](event-loop-libuv-v8.md) — How async operations are scheduled

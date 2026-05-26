---
tags: [javascript, nodejs, queuing, concurrency-control, batch-processing, p-queue, p-limit]
title: "Queuing Strategies: p-queue, p-limit & Batch Processing"
domain: "language-mechanics"
---

# Queuing Strategies: p-queue, p-limit & Batch Processing

When automatic backpressure isn't enough, you need explicit **concurrency control** and **batch processing**. This guide covers practical queuing strategies for Node.js.

---

## Problem: Too Many Concurrent Operations

Scenario: You need to process 10,000 API calls, but the API only allows 5 concurrent requests.

**Without queuing** (fails):
```ts
const results = await Promise.all(
  items.map((item) => callAPI(item))
); // ❌ All 10,000 run in parallel → rate limit errors
```

**With queuing** (succeeds):
```ts
const queue = new PQueue({ concurrency: 5 });
const results = await Promise.all(
  items.map((item) => queue.add(() => callAPI(item)))
); // ✅ Only 5 run at a time
```

---

## Overview: p-queue vs p-limit vs p-* Utilities

The quickest comparison for the most common tools:

| Feature | p-queue | p-limit | Notes |
|---------|---------|---------|-------|
| **Concurrency limit** | ✅ | ✅ | Primary feature |
| **Priority queue** | ✅ | ❌ | Run important tasks first |
| **Delays** | ✅ | ❌ | `delay` option before task runs |
| **Retries** | ✅ | ❌ | Built-in retry logic |
| **Complexity** | Heavier | Lighter | p-limit is simpler |
| **Use case** | Complex workflows | Simple concurrency control |

**Rule of thumb**: Start with **p-limit**, graduate to **p-queue** if you need priority or retries.

---

## p-limit: Lightweight Concurrency Control

Install: `npm install p-limit`

```ts
import pLimit from 'p-limit';

const limit = pLimit(5); // Max 5 concurrent
const items = Array.from({ length: 100 }, (_, i) => i);

const results = await Promise.all(
  items.map((item) => limit(() => callExpensiveAPI(item)))
);
```

### Real Example: Batch Resize Images

```ts
import pLimit from 'p-limit';
import sharp from 'sharp';

const limit = pLimit(3); // 3 concurrent image operations

async function resizeImages(imagePaths: string[]) {
  const tasks = imagePaths.map((path) =>
    limit(() => sharp(path).resize(800, 600).toFile(`${path}.resized.jpg`))
  );

  try {
    await Promise.all(tasks);
    console.log('All images resized');
  } catch (err) {
    console.error('Resize failed:', err);
  }
}

resizeImages(['img1.jpg', 'img2.jpg', 'img3.jpg']);
```

---

## p-queue: Full-Featured Queuing

Install: `npm install p-queue`

```ts
import PQueue from 'p-queue';

const queue = new PQueue({
  concurrency: 5, // Max 5 concurrent
  timeout: 30000, // Task timeout in ms
  throwOnTimeout: true,
});

queue.add(() => callAPI(item));
```

### Example: Priority Queue for Database Writes

```ts
import PQueue from 'p-queue';

const queue = new PQueue({ concurrency: 3 });

// High-priority write (e.g., critical order)
queue.add(
  () => saveToDatabase({ ...criticalOrder }),
  { priority: 10 } // Higher priority = runs first
);

// Low-priority write (e.g., analytics)
queue.add(
  () => saveToDatabase({ ...analyticsData }),
  { priority: 1 }
);

// Wait for all tasks
await queue.onIdle();
console.log('All tasks complete');
```

### Example: Exponential Backoff with p-queue

```ts
async function callAPIWithRetry(item: any) {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await fetch(`/api/items/${item.id}`).then((r) => r.json());
    } catch (err) {
      attempt++;
      if (attempt === maxRetries) throw err;

      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

const queue = new PQueue({ concurrency: 5 });

const results = await Promise.all(
  items.map((item) => queue.add(() => callAPIWithRetry(item)))
);
```

---

## Batch Processing: Group + Process + Send

Batch processing accumulates items and processes them in groups. It's **different from concurrency control**:

| Aspect | Concurrency Control | Batch Processing |
|--------|---------------------|------------------|
| **Goal** | Limit parallel tasks | Group items before processing |
| **Trigger** | Item count | Size threshold reached |
| **Example** | Max 5 API calls | Send 100 items to DB at once |

### Simple Batch Processor

```ts
class BatchProcessor<T, R> {
  private batch: T[] = [];
  private batchSize: number;
  private processFunc: (items: T[]) => Promise<R[]>;

  constructor(batchSize: number, processFunc: (items: T[]) => Promise<R[]>) {
    this.batchSize = batchSize;
    this.processFunc = processFunc;
  }

  async add(item: T): Promise<void> {
    this.batch.push(item);

    if (this.batch.length >= this.batchSize) {
      await this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.batch.length === 0) return;

    const toProcess = [...this.batch];
    this.batch = [];

    try {
      await this.processFunc(toProcess);
      console.log(`Processed batch of ${toProcess.length}`);
    } catch (err) {
      console.error('Batch processing failed:', err);
    }
  }
}

// Usage
const processor = new BatchProcessor<any, any>(
  100,
  async (items) => {
    // Send to database in one operation
    await db.insert(items);
  }
);

for (const item of items) {
  await processor.add(item);
}

await processor.flush(); // Send remaining items
```

---

## Advanced: Batch Processing with p-queue

Combine batch accumulation with concurrency control:

```ts
import PQueue from 'p-queue';

class BatchQueueProcessor<T, R> {
  private batch: T[] = [];
  private batchSize: number;
  private processFunc: (items: T[]) => Promise<R[]>;
  private queue: PQueue;

  constructor(
    batchSize: number,
    processFunc: (items: T[]) => Promise<R[]>,
    concurrency: number = 3
  ) {
    this.batchSize = batchSize;
    this.processFunc = processFunc;
    this.queue = new PQueue({ concurrency });
  }

  async add(item: T): Promise<void> {
    this.batch.push(item);

    if (this.batch.length >= this.batchSize) {
      const toProcess = [...this.batch];
      this.batch = [];

      // Queue the batch processing; limits concurrent batch operations
      this.queue.add(() => this.processFunc(toProcess));
    }
  }

  async flush(): Promise<void> {
    if (this.batch.length > 0) {
      this.queue.add(() => this.processFunc([...this.batch]));
      this.batch = [];
    }

    // Wait for all queued tasks
    await this.queue.onIdle();
  }
}

// Usage: Insert 10,000 records in batches of 100, max 3 concurrent batches
const processor = new BatchQueueProcessor<any, any>(
  100, // batch size
  async (batch) => {
    console.log(`Inserting batch of ${batch.length}`);
    await db.insert(batch);
  },
  3 // max concurrent batches
);

for (const record of records) {
  await processor.add(record);
}

await processor.flush();
```

---

## Real-World: Stream + Batch + Queue

Combining backpressure, batching, and queuing:

```ts
import { Transform, Readable, pipeline } from 'stream';
import { promisify } from 'util';
import PQueue from 'p-queue';

async function* dataSource() {
  for (let i = 1; i <= 100000; i++) {
    yield { id: i, value: Math.random() };
  }
}

const queue = new PQueue({ concurrency: 5 }); // Max 5 DB operations
let batch: any[] = [];
const batchSize = 1000;

const transformStream = new Transform({
  objectMode: true,
  async transform(item, encoding, callback) {
    batch.push(item);

    if (batch.length >= batchSize) {
      const toInsert = [...batch];
      batch = [];

      // Queue the batch insert; backpressure pauses if queue fills up
      queue.add(() =>
        db.collection('items').insertMany(toInsert).then(() => {
          console.log(`Inserted batch of ${toInsert.length}`);
        })
      );
    }

    callback();
  },

  async flush(callback) {
    if (batch.length > 0) {
      await queue.add(() =>
        db.collection('items').insertMany(batch).then(() => {
          console.log(`Inserted final batch of ${batch.length}`);
        })
      );
    }
    callback();
  },
});

(async () => {
  const source = Readable.from(dataSource(), { objectMode: true });
  const asyncPipeline = promisify(pipeline);

  try {
    await asyncPipeline(source, transformStream);
    console.log('All data processed');
  } catch (err) {
    console.error('Pipeline failed:', err);
  }
})();
```

---

## Monitoring Queue Health

```ts
import PQueue from 'p-queue';

const queue = new PQueue({ concurrency: 5 });

// Monitor queue size
setInterval(() => {
  const pending = queue.pending;
  const size = queue.size;
  console.log(`Pending: ${pending}, Queued: ${size}`);

  if (size > 1000) {
    console.warn('Queue backing up!');
  }
}, 1000);

// Wait for completion
queue.onIdle().then(() => {
  console.log('All tasks complete');
});
```

---

## Decision Tree: Which Strategy?

```
Do you need to limit concurrent operations?
├─ Yes, simple concurrency → p-limit
├─ Yes, need priority/retries → p-queue
└─ No, proceed to next

Need to group items before processing?
├─ Yes → Batch Processor + Queue
└─ No, just queue individual tasks

Need automatic flow control?
├─ Yes, use Streams → Transform Stream + Backpressure
└─ No, use explicit queuing → p-queue / p-limit
```

---

## Next Steps: Advanced Topics

This guide covers the **fundamentals** of queuing. For more advanced topics, see:

- **All p-* utilities** (p-retry, p-timeout, p-throttle, etc.) → [Complete p-* Utilities Guide](p-utilities-complete-guide.md)
- **Real-world composition patterns** → [Queue Patterns & Composition](queue-patterns-and-composition.md)
- **Performance tuning & monitoring** → [Queue Performance & Tuning](queue-performance-and-tuning.md)

---

## Related

- [Backpressure in Node.js Streams](backpressure.md) — Automatic flow control
- [Generators and Async Iteration](generators-and-async-iteration.md) — Lazy data sources
- [Node.js Stream Concurrency Overview](node-stream-concurrency.md) — Full integration pattern

---
tags:
  [
    javascript,
    nodejs,
    queuing,
    patterns,
    composition,
    p-queue,
    p-retry,
    p-timeout,
    p-throttle,
    real-world,
  ]
title: "Queue Patterns & Composition: Real-World Examples"
domain: "language-mechanics"
---

# Queue Patterns & Composition: Real-World Examples

Learn how to compose multiple p-\* utilities and queuing strategies into production-ready systems.

---

## Advanced Patterns: Composing p-\*

### Pattern 1: Throttle + Retry + Timeout (Triple Defense)

**Use case**: Robust API client that respects rate limits, retries failures, and has time bounds.

```ts
import pThrottle from "p-throttle";
import pRetry from "p-retry";
import pTimeout from "p-timeout";

const robustFetch = pThrottle({ limit: 5, interval: 10000 })(async (
  url: string,
) => {
  return await pRetry(async () => pTimeout(fetch(url), 3000), {
    retries: 3,
    minTimeout: 500,
  });
});

// Each call:
// - Respects 5 calls per 10s rate limit
// - Retries up to 3 times on failure
// - Times out after 3s per attempt
const results = await Promise.all(urls.map((url) => robustFetch(url)));
```

**Flow**:

```
URL → Throttle → Retry loop → Timeout → Response
     (rate)      (resilience)  (bounds)
```

---

### Pattern 2: Queue + Retry + Monitoring

**Use case**: Process tasks with concurrency control, automatic retries, and health monitoring.

```ts
import PQueue from "p-queue";
import pRetry from "p-retry";

class RobustQueue {
  private queue = new PQueue({ concurrency: 5 });
  private failedTasks: string[] = [];

  async addWithRetry(name: string, task: () => Promise<any>): Promise<void> {
    return this.queue.add(() =>
      pRetry(task, {
        retries: 3,
        minTimeout: 1000,
        onFailedAttempt: (error) => {
          console.warn(
            `[${name}] Attempt ${error.attemptNumber} failed:`,
            error.message,
          );
        },
      }).catch((error) => {
        console.error(`[${name}] Failed after all retries:`, error);
        this.failedTasks.push(name);
      }),
    );
  }

  getHealth() {
    return {
      pending: this.queue.pending,
      queued: this.queue.size,
      failedTasks: this.failedTasks.length,
    };
  }

  async waitForCompletion() {
    await this.queue.onIdle();
    return {
      success: this.failedTasks.length === 0,
      failed: this.failedTasks,
    };
  }
}

// Usage
const robustQueue = new RobustQueue();

await robustQueue.addWithRetry("User API", () => callAPI("/api/users"));
await robustQueue.addWithRetry("Posts API", () => callAPI("/api/posts"));

const result = await robustQueue.waitForCompletion();
console.log("Completion status:", result);
```

---

### Pattern 3: Nested Concurrency (p-all + p-limit)

**Use case**: Fetch parent resources, then child resources for each parent, with different concurrency limits.

```ts
import pAll from "p-all";
import pLimit from "p-limit";

async function fetchUsersWithPosts() {
  const userIds = Array.from({ length: 1000 }, (_, i) => i);
  const userLimit = pLimit(10); // Max 10 concurrent users

  const users = await pAll(
    userIds.map(
      (id) => () =>
        userLimit(async () => {
          // Fetch user
          const user = await fetch(`/api/users/${id}`).then((r) => r.json());

          // For each user, fetch their posts (max 5 concurrent per user)
          const postLimit = pLimit(5);
          const posts = await pAll(
            Array.from(
              { length: 20 },
              (_, i) => () =>
                postLimit(() =>
                  fetch(`/api/users/${id}/posts/${i}`).then((r) => r.json()),
                ),
            ),
            { concurrency: 5 },
          );

          return { ...user, posts };
        }),
    ),
    { concurrency: 10 },
  );

  return users;
}
```

**Concurrency hierarchy**:

```
Users (10 concurrent)
├─ User 1 → Posts (5 concurrent)
├─ User 2 → Posts (5 concurrent)
├─ User 3 → Posts (5 concurrent)
└─ ...
```

---

### Pattern 4: Batch Processing + Queue + Retry

**Use case**: Insert 100,000 records in batches with concurrency control and failure tracking.

```ts
import PQueue from "p-queue";
import pRetry from "p-retry";

class ResilientBatchProcessor<T> {
  private queue = new PQueue({ concurrency: 3 });
  private batch: T[] = [];
  private batchSize: number;
  private processFunc: (batch: T[]) => Promise<void>;
  private stats = { succeeded: 0, failed: 0, totalItems: 0 };

  constructor(batchSize: number, processFunc: (batch: T[]) => Promise<void>) {
    this.batchSize = batchSize;
    this.processFunc = processFunc;
  }

  async add(item: T): Promise<void> {
    this.batch.push(item);
    this.stats.totalItems++;

    if (this.batch.length >= this.batchSize) {
      await this.processBatch();
    }
  }

  private async processBatch(): Promise<void> {
    const toProcess = [...this.batch];
    this.batch = [];

    this.queue.add(() =>
      pRetry(() => this.processFunc(toProcess), {
        retries: 3,
        minTimeout: 1000,
        onFailedAttempt: (error) => {
          console.warn(
            `Batch failed (attempt ${error.attemptNumber}), retrying...`,
          );
        },
      })
        .then(() => {
          this.stats.succeeded += toProcess.length;
        })
        .catch((error) => {
          this.stats.failed += toProcess.length;
          console.error("Batch failed after retries:", error);
        }),
    );
  }

  async flush(): Promise<{ succeeded: number; failed: number }> {
    if (this.batch.length > 0) {
      await this.processBatch();
    }

    await this.queue.onIdle();
    return {
      succeeded: this.stats.succeeded,
      failed: this.stats.failed,
    };
  }
}

// Usage
const processor = new ResilientBatchProcessor(100, async (batch) => {
  await db.collection("items").insertMany(batch);
});

for (const record of records) {
  await processor.add(record);
}

const result = await processor.flush();
console.log(
  `Processed: ${result.succeeded} succeeded, ${result.failed} failed`,
);
```

---

## Complete Real-World Example: Robust API Client

**Requirements**:

- Max 5 concurrent requests
- 3 retries per request with exponential backoff
- 3-second timeout per attempt
- Priority support (critical requests first)
- Debug logging with side-effect-free inspection
- Health monitoring

```ts
import PQueue from "p-queue";
import pRetry from "p-retry";
import pTimeout from "p-timeout";
import pTap from "p-tap";

interface FetchOptions {
  retries?: number;
  timeout?: number;
  priority?: number;
  debug?: boolean;
}

interface ClientStats {
  pending: number;
  queued: number;
  totalRequests: number;
  failedRequests: number;
}

class RobustAPIClient {
  private queue = new PQueue({ concurrency: 5, timeout: 60000 });
  private stats = {
    totalRequests: 0,
    failedRequests: 0,
  };

  async fetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
    const {
      retries = 3,
      timeout = 5000,
      priority = 0,
      debug = false,
    } = options;

    this.stats.totalRequests++;

    return this.queue
      .add(
        async () => {
          const response = await pRetry(
            async () => {
              const result = await pTimeout(fetch(url), timeout);
              return result.json();
            },
            {
              retries,
              minTimeout: 500,
              maxTimeout: 10000,
              randomizationFactor: 0.1,
              onFailedAttempt: (error) => {
                if (debug) {
                  console.warn(
                    `[${url}] Attempt ${error.attemptNumber} failed:`,
                    error.message,
                  );
                }
              },
            },
          );

          return debug
            ? pTap(response, (data) => {
                console.log(`[${url}] Success:`, {
                  timestamp: new Date().toISOString(),
                  items: Array.isArray(data) ? data.length : "single",
                });
              })
            : response;
        },
        { priority },
      )
      .catch((error) => {
        this.stats.failedRequests++;
        console.error(`[${url}] Request failed:`, error);
        throw error;
      });
  }

  getStats(): ClientStats {
    return {
      pending: this.queue.pending,
      queued: this.queue.size,
      totalRequests: this.stats.totalRequests,
      failedRequests: this.stats.failedRequests,
    };
  }

  async waitForCompletion(): Promise<ClientStats> {
    await this.queue.onIdle();
    return this.getStats();
  }
}

// Usage Example
const api = new RobustAPIClient();

// High-priority request
api.fetch("/api/critical-data", {
  retries: 5,
  timeout: 3000,
  priority: 10,
  debug: true,
});

// Standard requests
api.fetch("/api/users", { priority: 5, debug: true });
api.fetch("/api/posts", { priority: 5 });

// Low-priority request
api.fetch("/api/analytics", { priority: 1 });

// Monitor progress
setInterval(() => {
  const stats = api.getStats();
  console.log("API Stats:", stats);
}, 1000);

// Wait for all requests
const finalStats = await api.waitForCompletion();
console.log("All requests complete:", finalStats);
```

---

## Composition Decision Guide

**Choosing composition patterns:**

```
Are you building:

1. Simple API client?
   → p-limit + basic retry
   → See: queuing-strategies.md

2. Rate-limited API integration?
   → p-throttle + p-retry
   → Examples in this guide

3. Resilient service with priorities?
   → p-queue + p-retry + p-tap
   → Examples in this guide

4. Batch processing pipeline?
   → Batch processor + p-queue + p-retry
   → Examples in this guide

5. Multi-level concurrent fetch (users → posts)?
   → p-all + p-limit (nested)
   → Examples in this guide

6. Full production system?
   → Combine all patterns above
   → See: RobustAPIClient example
```

---

## Key Patterns Summary

| Pattern                 | Tools                                 | Use Case              |
| ----------------------- | ------------------------------------- | --------------------- |
| **Triple Defense**      | p-throttle + p-retry + p-timeout      | Rate-limited APIs     |
| **Resilient Queue**     | p-queue + p-retry + monitoring        | Batch operations      |
| **Nested Concurrency**  | p-all + p-limit (multiple levels)     | Hierarchical fetching |
| **Full Pipeline**       | p-queue + p-retry + p-timeout + p-tap | Production systems    |
| **Batch + Concurrency** | Batch processor + p-queue + p-retry   | Bulk inserts          |

---

## Related

- [Queuing Strategies Fundamentals](queuing-strategies.md) — p-limit, p-queue, batch processing basics
- [Complete p-\* Utilities Guide](p-utilities-complete-guide.md) — All individual p-\* tools
- [Queue Performance & Tuning](queue-performance-and-tuning.md) — Performance, monitoring, resource limits
- [Backpressure in Node.js Streams](backpressure.md) — Automatic flow control
- [Node.js Stream Concurrency Overview](node-stream-concurrency.md) — Full integration pattern

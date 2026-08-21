---
tags: [concurrency, paradigms, patterns, nodejs, javascript, typescript]
title: "Node.js Concurrent Programming"
---

# Concurrent Programming (Node.js)

## Important Context

Unlike Java, Node.js executes JavaScript on a **single-threaded event loop** with **cooperative multitasking**. Concurrency problems still occur because asynchronous operations can **interleave** while sharing mutable state or external resources.

Concurrency issues commonly appear when:

- Multiple async operations modify shared in-memory state
- HTTP requests interleave access to shared objects
- `worker_threads` introduce true parallelism
- `cluster` or multiple Node.js processes are used
- Multiple application instances share Redis, databases, files, or APIs
- Retries and background jobs execute concurrently

**Important distinction:**

> Single-threaded execution does not eliminate race conditions.

Node.js does not provide built-in mutexes or semaphores in the standard library, but libraries such as `async-mutex` and `p-queue` provide common synchronization primitives.

---

## Low-Level Primitives

| Mechanism              | Controls                       | Typical Use                   |
| ---------------------- | ------------------------------ | ----------------------------- |
| Mutex                  | 1 concurrent execution         | Protect shared state          |
| Semaphore              | N concurrent executions        | Limit parallelism             |
| Queue / P-Queue        | Ordered task execution         | Rate limiting, backpressure   |
| Promise.all            | Concurrent async scheduling    | Independent operations        |
| Worker Threads         | True parallel CPU execution    | CPU-bound work                |
| Atomic operations      | Lock-free shared memory        | Worker thread shared counters |
| Redis distributed lock | Cross-process mutual exclusion | Multiple Node instances       |

### Mutex

A mutex allows only one async section to execute at a time inside a single Node.js process.

```ts
import { Mutex } from "async-mutex";

const mutex = new Mutex();
let balance = 100;

async function withdraw(amount: number) {
  await mutex.runExclusive(async () => {
    const current = balance;
    await new Promise((resolve) => setTimeout(resolve, 100));
    balance = current - amount;
  });
}
```

**Typical use cases:** in-memory counters, shared caches, session state, preventing duplicate processing in one process.

**Important limitation:** protects execution inside the current process only — does NOT coordinate across multiple instances, containers, Kubernetes replicas, or cluster workers.

---

### Semaphore

A semaphore allows up to N concurrent executions simultaneously — controls throughput rather than strict mutual exclusion.

```ts
import { Semaphore } from "async-mutex";

const semaphore = new Semaphore(3);

async function callApi(id: number) {
  const [value, release] = await semaphore.acquire();
  try {
    await doWork(id);
  } finally {
    release();
  }
}
```

**Typical use cases:** limiting outbound API requests, restricting database concurrency, file processing limits.

---

### Promise.all

`Promise.all` schedules multiple async operations concurrently. Use only when tasks are independent, share no mutable state, and no concurrency limit is required.

```ts
await Promise.all([fetchUser(), fetchOrders(), fetchPayments()]);
```

Does not guarantee parallel CPU execution — actual parallelism depends on libuv's thread pool, external services, and OS scheduling.

---

### Worker Threads

Worker threads provide real parallel execution for CPU-bound workloads. The event loop already handles I/O concurrency — reserve Worker Threads for computation.

```ts
import { Worker } from "worker_threads";

new Worker("./heavy-task.js");
```

**Best use cases:** image processing, compression, ML inference, cryptography, video processing.

---

### Atomics and SharedArrayBuffer

`Atomics` provide lock-free synchronization between worker threads via shared memory. Only use when performance requirements justify the low-level complexity.

```ts
const shared = new SharedArrayBuffer(4);
const counter = new Int32Array(shared);

Atomics.add(counter, 0, 1);
```

---

### Distributed Locks with Redis

A local mutex is insufficient when multiple instances share the same resource. A distributed lock coordinates ownership across processes or machines.

```ts
const lock = await redlock.acquire(["order:123"], 5000);
try {
  await processOrder();
} finally {
  await lock.release();
}
```

**Typical use cases:** preventing duplicate jobs, payment processing, inventory updates, distributed cron, leader election.

**Production requirements:** expiration timeouts, retry strategies, clock-skew tolerance, fencing tokens, and failure recovery. Incorrect distributed locking can introduce split-brain behavior.

---

### Common Mistake: Locking Database Writes With a Local Mutex

```ts
// ❌ Wrong — another instance can still update the same row
await mutex.runExclusive(async () => {
  await db.query("UPDATE accounts SET balance = balance - 10");
});
```

A local mutex does not coordinate across processes, containers, or autoscaled replicas. Use database transactions instead:

```sql
BEGIN;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;
UPDATE accounts SET balance = balance - 10 WHERE id = 1;
COMMIT;
```

---

## Streaming & Flow Control

For processing large datasets with automatic flow control. See [Node.js Stream Concurrency Overview](node-stream-concurrency.md) for the combined approach:

- **[Generators & Async Iteration](generators-and-async-iteration.md)** — Lazy evaluation, memory-efficient data sources
- **[Backpressure](backpressure.md)** — Automatic flow control that pauses producers when consumers lag
- **Streams** — Pipe-based transformation with built-in backpressure

**Core principle:** Backpressure automatically prevents producers from overwhelming consumers. Data flows at the pace the system can handle.

---

## Promise-Based Queuing

For controlling concurrency of independent operations. See [Queuing Strategies Fundamentals](queuing-strategies.md) for:

- **p-limit**: Simple concurrency limiter (max N parallel operations)
- **p-queue**: Full-featured queue with priority, delays, retries
- **Batch processing**: Group items before sending to API/database

**Complete p-\* ecosystem** in [Complete p-\* Utilities Guide](p-utilities-complete-guide.md): p-retry, p-timeout, p-throttle, p-whilst, p-all, p-lazy, p-tap.

**Real-world patterns** in [Queue Patterns & Composition](queue-patterns-and-composition.md)

---

## Memory Visibility in Node.js

Unlike Java, Node.js doesn't have the same memory visibility issues because:

1. **Single-threaded event loop** — Within one event loop iteration, all JavaScript runs sequentially
2. **Async boundaries are implicit barriers** — An `await` point creates a visibility boundary similar to a memory fence
3. **No CPU cache coherence problems** — Only one thread interprets JavaScript at a time

**However**, distributed coordination is still needed when:

- Multiple Node.js processes share Redis/database
- External systems can modify state (APIs, message queues)
- Worker Threads introduce true parallelism

---

## Concurrency Problems and Solutions

| Problem                   | Cause                                 | Solution                                              |
| ------------------------- | ------------------------------------- | ----------------------------------------------------- |
| **Race condition**        | Multiple async ops modify same object | Mutex (`async-mutex`) or queue                        |
| **Lost updates**          | Concurrent writes to database         | Distributed locking (Redis) or optimistic concurrency |
| **Event loop starvation** | CPU-heavy code blocks async tasks     | Move to Worker Thread or `setImmediate()`             |
| **Backpressure collapse** | Producer faster than consumer         | Use streams with built-in backpressure or queue       |
| **Promise leak**          | Unhandled promise rejection           | Always `.catch()` or `try/catch`                      |
| **Memory leak**           | Event listeners never unsubscribed    | Always unsubscribe when done                          |

---

## Decision Framework: Which Pattern When?

### Use Mutex when:

- You need to protect a critical section of code from simultaneous execution
- Simple `async-mutex` lock suffices for in-process coordination
- **Example:** Protecting a shared counter or object update

### Use Streams + Backpressure when:

- Processing large datasets (files, API responses, database queries)
- Data naturally flows through a pipeline
- Memory efficiency is critical
- **Example:** Reading 1GB file, transforming, writing to database

### Use p-queue / p-limit when:

- You need to control concurrency of independent operations
- Limit parallel API calls, database writes, etc.
- Want retries, timeouts, or priority ordering
- **Example:** Process 1000 items with max 5 concurrent API calls

### Use Worker Threads when:

- CPU-intensive computation (encoding, crypto, ML inference)
- Need true parallelism on multi-core systems
- **Example:** Image processing, video encoding

### Use Distributed Locks when:

- Multiple Node.js processes or services share state
- Need cross-process mutual exclusion
- **Example:** Coordinating between multiple server instances

---

## Code Example: Combining All Patterns

```ts
import { Readable, Transform, pipeline } from "stream";
import { Mutex } from "async-mutex";
import PQueue from "p-queue";

// Shared state protected by mutex
let processedCount = 0;
const countMutex = new Mutex();

// Pattern 1: Async generator (lazy data source)
async function* fetchLargeDataset() {
  for (let i = 0; i < 1_000_000; i++) {
    yield { id: i, data: Math.random() };
  }
}

// Pattern 2: Transform stream with batching
let batch = [];
const batchSize = 100;
const queue = new PQueue({ concurrency: 5 }); // Pattern 3: Queue for API calls

const transformStream = new Transform({
  objectMode: true,
  async transform(item, encoding, callback) {
    batch.push(item);

    if (batch.length >= batchSize) {
      const toSend = [...batch];
      batch = [];

      // Queue the API call with concurrency control
      queue.add(async () => {
        const result = await sendToAPI(toSend);

        // Protect shared counter with mutex
        await countMutex.runExclusive(async () => {
          processedCount += toSend.length;
          console.log(`Processed: ${processedCount}`);
        });

        return result;
      });
    }

    callback(); // Continue stream
  },

  async flush(callback) {
    if (batch.length > 0) {
      await queue.add(async () => {
        await sendToAPI(batch);
        await countMutex.runExclusive(async () => {
          processedCount += batch.length;
        });
      });
    }
    callback();
  },
});

// Run the pipeline (combines patterns 1 & 2)
const source = Readable.from(fetchLargeDataset(), { objectMode: true });
await pipeline(source, transformStream, (err) => {
  if (err) console.error("Pipeline failed:", err);
  else console.log("Done!");
});
```

---

## Node.js vs Java

Node.js: single-threaded event loop, cooperative async — ask "how many async ops may run concurrently?"

Java: preemptive OS threads, shared mutable memory — ask "how many threads may access this simultaneously?"

See [Concurrency Across Languages](../concurrency-across-languages-and-models.md) for the full cross-language comparison.

---

## See Also

- [Scheduling Models](../scheduling-models.md) — Understand preemptive vs cooperative scheduling
- [Java Concurrent Programming](../java/concurrent-programming.md) — Compare with Java's approach
- [Concurrency Models & Languages](../concurrency-across-languages-and-models.md) — Deep comparison across languages

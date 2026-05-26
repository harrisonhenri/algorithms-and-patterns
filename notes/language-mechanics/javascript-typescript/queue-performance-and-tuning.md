---
tags: [javascript, nodejs, queuing, performance, monitoring, tuning, resource-limits, decision-tree]
title: "Queue Performance & Tuning: Monitoring and Resource Limits"
domain: "language-mechanics"
---

# Queue Performance & Tuning: Monitoring and Resource Limits

Optimize queue performance, monitor health, and match concurrency limits to your system's resources.

---

## Performance Considerations

### Memory Usage by Package

```ts
// p-limit: ~1KB (just stores limit function)
import pLimit from 'p-limit';
const limit = pLimit(5); // negligible memory overhead

// p-queue: ~10KB base + task storage
// WARNING: Each queued task consumes memory
import PQueue from 'p-queue';
const queue = new PQueue({ concurrency: 5 });
// If you queue 100k tasks, expect 10MB+ in memory

// p-retry: ~2KB (minimal state)
// p-timeout: ~500B (just a timer)
// p-throttle: ~1.5KB + timestamp array (grows with time windows)
```

### Practical Memory Estimation

```ts
// For a p-queue storing task closures:
// Each queued task: ~1-5KB (depends on closure size)
// Example: 10,000 queued tasks = 10-50MB

const queue = new PQueue({ concurrency: 5 });

// Monitor memory over time
setInterval(() => {
  const mem = process.memoryUsage();
  const heapMB = (mem.heapUsed / 1024 / 1024).toFixed(2);
  const queueSize = queue.size;
  
  console.log(
    `Queue: ${queueSize} tasks | Heap: ${heapMB}MB`
  );

  if (queueSize > 50000) {
    console.warn('Queue size critical! Reduce input rate.');
  }
}, 5000);
```

---

## Monitoring Queue Health

### Real-Time Monitoring

```ts
import PQueue from 'p-queue';

const queue = new PQueue({ concurrency: 5 });

// Monitor every second
const monitor = setInterval(() => {
  const pending = queue.pending;
  const queued = queue.size;
  const total = pending + queued;

  console.log(`
    Pending: ${pending} (running)
    Queued:  ${queued} (waiting)
    Total:   ${total}
    Load:    ${((pending / 5) * 100).toFixed(0)}%
  `);

  // Alert conditions
  if (total > 1000) {
    console.warn('⚠️  Queue backing up!');
  }
  if (queued > total * 0.8) {
    console.error('🔴 Most tasks waiting, consider reducing concurrency');
  }
}, 1000);

// Clean up when done
queue.onIdle().then(() => clearInterval(monitor));
```

### Health Check Function

```ts
class QueueHealth {
  constructor(private queue: PQueue, private maxSize: number = 10000) {}

  check() {
    const pending = this.queue.pending;
    const queued = this.queue.size;
    const total = pending + queued;
    const concurrency = this.queue.concurrency;

    return {
      healthy: total < this.maxSize,
      pending,
      queued,
      total,
      utilizationPercent: ((pending / concurrency) * 100).toFixed(0),
      backlogPercent: ((queued / total) * 100).toFixed(0) || 0,
      recommendation: this.getRecommendation(pending, queued, total),
    };
  }

  private getRecommendation(
    pending: number,
    queued: number,
    total: number
  ): string {
    if (total > this.maxSize * 0.9) {
      return 'CRITICAL: Reduce input rate or increase concurrency';
    }
    if (queued > total * 0.8) {
      return 'WARNING: Queue backing up, consider increasing concurrency';
    }
    if (pending === 0 && queued === 0) {
      return 'OK: Queue idle';
    }
    return 'OK: Queue healthy';
  }
}

// Usage
const health = new QueueHealth(queue);
setInterval(() => {
  const status = health.check();
  console.log(status);
}, 1000);
```

---

## Recommended Concurrency Limits

### By Resource Type

```ts
import os from 'os';
import pLimit from 'p-limit';
import PQueue from 'p-queue';

// 1️⃣ Network I/O (HTTP Requests)
// Rule: API servers typically allow 100-500 concurrent per IP
// Safe default: 5-10
const httpLimit = pLimit(5);

// 2️⃣ Database Connections
// Rule: Connection pool size (usually 5-20)
// Check: db.getPool().length
const dbQueue = new PQueue({
  concurrency: Math.min(15, process.env.DB_POOL_SIZE || 15)
});

// 3️⃣ CPU-Intensive Operations
// Rule: Don't exceed number of CPU cores
// More threads = context switching overhead
const cpuCores = os.cpus().length;
const cpuQueue = pLimit(cpuCores);

// 4️⃣ File I/O Operations
// Rule: OS file descriptor limit (~1024) / max processes
// Safe default: 20-50
const fileQueue = pLimit(32);

// 5️⃣ Message Queue (RabbitMQ, Redis, etc.)
// Rule: Broker max concurrent consumers
// Check: broker configuration
const msgQueue = new PQueue({ concurrency: 20 });

// 6️⃣ Memory-Heavy Operations
// Rule: Avoid OOM by limiting concurrent tasks
// Monitor: process.memoryUsage().heapUsed
const memLimit = pLimit(2); // Conservative for heavy tasks

// 7️⃣ Image Processing / Sharp
// Rule: Each operation uses significant memory/CPU
// Safe default: 3-5
import sharp from 'sharp';
const imageLimit = pLimit(3);

// 8️⃣ External Service Calls (Stripe, AWS, etc.)
// Rule: Service rate limits + your quota
// Check: service documentation
const stripeLimit = pLimit(10);
```

### Resource Limit Configuration

```ts
interface ResourceLimits {
  cpu: number; // CPU cores
  memory: number; // MB
  diskIO: number; // concurrent file ops
  networkIO: number; // concurrent network ops
  database: number; // db connections
}

function calculateConcurrencyLimits(
  resources: ResourceLimits
): Record<string, number> {
  return {
    // CPU: 1:1 concurrency with cores
    cpu: resources.cpu,

    // Memory: concurrent tasks * avg task memory
    memory: Math.floor(resources.memory / 50), // Assume 50MB per task

    // Disk: Based on sequential I/O capacity
    disk: Math.min(50, resources.diskIO),

    // Network: Based on bandwidth (assume 1Mbps per connection)
    network: Math.min(resources.networkIO, 10),

    // Database: Fraction of connection pool
    database: Math.min(resources.database, 15),
  };
}

// Example: 4-core machine with 8GB RAM
const limits = calculateConcurrencyLimits({
  cpu: 4,
  memory: 8000,
  diskIO: 100,
  networkIO: 50,
  database: 20,
});

console.log('Recommended limits:', limits);
// { cpu: 4, memory: 160, disk: 50, network: 10, database: 15 }
```

---

## Tuning Queue Behavior

### Adjusting Concurrency Dynamically

```ts
import PQueue from 'p-queue';

class AdaptiveQueue {
  private queue: PQueue;
  private targetUtilization = 0.8; // Aim for 80% busy

  constructor(initialConcurrency: number = 5) {
    this.queue = new PQueue({ concurrency: initialConcurrency });
    this.startAdaptation();
  }

  private startAdaptation() {
    setInterval(() => {
      const { pending, concurrency } = this.queue;
      const utilization = pending / concurrency;

      if (utilization > this.targetUtilization && pending > 0) {
        // Increase concurrency
        const newConcurrency = Math.min(
          concurrency + 1,
          100 // Max limit
        );
        this.queue.concurrency = newConcurrency;
        console.log(`📈 Increased concurrency to ${newConcurrency}`);
      } else if (utilization < 0.5 && concurrency > 1) {
        // Decrease concurrency
        const newConcurrency = Math.max(
          Math.ceil(concurrency - 1),
          1
        );
        this.queue.concurrency = newConcurrency;
        console.log(`📉 Decreased concurrency to ${newConcurrency}`);
      }
    }, 5000);
  }

  add<T>(fn: () => PromiseLike<T>) {
    return this.queue.add(fn);
  }

  async onIdle() {
    return this.queue.onIdle();
  }
}

// Usage
const adaptiveQueue = new AdaptiveQueue(5);
for (const task of tasks) {
  adaptiveQueue.add(() => processTask(task));
}
await adaptiveQueue.onIdle();
```

### Backpressure: Pause Input When Queue Backs Up

```ts
import PQueue from 'p-queue';

class BackpressureQueue {
  private queue = new PQueue({ concurrency: 5 });
  private maxQueueSize = 1000;

  async addWithBackpressure<T>(
    fn: () => PromiseLike<T>
  ): Promise<T> {
    // Wait if queue is full
    while (this.queue.size >= this.maxQueueSize) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return this.queue.add(fn);
  }

  getStats() {
    return {
      queued: this.queue.size,
      pending: this.queue.pending,
      backpressure: this.queue.size >= this.maxQueueSize * 0.9,
    };
  }
}

// Usage: Producer respects backpressure
const queue = new BackpressureQueue();

for (const item of items) {
  const stats = queue.getStats();
  if (stats.backpressure) {
    console.log('Backpressure: pausing producer');
  }

  await queue.addWithBackpressure(() => processItem(item));
}
```

---

## Decision Tree: Choosing Concurrency Limits

```
┌─ What resource are you concerned about?
│
├─ CPU usage
│  └─ Match concurrency to CPU core count
│     Core count: $(nproc) or $(sysctl -n hw.ncpu)
│     concurrency = numCores
│
├─ Memory usage
│  └─ Estimate memory per task, divide by available heap
│     Available heap = max heap size (--max-old-space-size)
│     Task memory = measure from profiler
│     concurrency = availableHeap / (taskMemory * 2)
│
├─ Network throughput
│  └─ API rate limits (check docs)
│     concurrency = apiRateLimit / (avg response time in seconds)
│     Example: 1000 req/min, 100ms = 1000/60 = ~17
│
├─ Database connections
│  └─ Check connection pool size
│     SELECT COUNT(*) FROM pg_stat_activity;  -- PostgreSQL
│     concurrency = poolSize * 0.75
│
├─ Disk I/O
│  └─ Conservative: number of disk spindles * 2-4
│     Modern SSDs: 20-50
│     Mechanical: 5-10
│
└─ Multiple constraints
   └─ Use the MINIMUM of all calculated values
      Example:
      - CPU: 4
      - Memory: 160
      - Network: 10
      - Database: 15
      → Use concurrency = 4 (most restrictive)
```

---

## Performance Testing

### Load Testing a Queue

```ts
import PQueue from 'p-queue';
import { performance } from 'perf_hooks';

async function loadTest() {
  const queue = new PQueue({ concurrency: 5 });
  const testSize = 10000;
  const results = {
    totalTime: 0,
    tasksPerSecond: 0,
    errorRate: 0,
  };

  let successCount = 0;
  let errorCount = 0;

  const startTime = performance.now();

  // Add test tasks
  for (let i = 0; i < testSize; i++) {
    queue.add(async () => {
      try {
        // Simulate work: 10-100ms
        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 90 + 10)
        );
        successCount++;
      } catch (err) {
        errorCount++;
      }
    });
  }

  // Wait for completion
  await queue.onIdle();

  const endTime = performance.now();
  const durationSeconds = (endTime - startTime) / 1000;

  results.totalTime = durationSeconds;
  results.tasksPerSecond = testSize / durationSeconds;
  results.errorRate = (errorCount / testSize) * 100;

  console.log('Load Test Results:');
  console.log(`  Total time: ${results.totalTime.toFixed(2)}s`);
  console.log(`  Throughput: ${results.tasksPerSecond.toFixed(0)} tasks/s`);
  console.log(`  Error rate: ${results.errorRate.toFixed(2)}%`);

  return results;
}

loadTest();
```

---

## Key Takeaways

1. **Monitor queue health continuously** — Check pending, queued, and utilization
2. **Match concurrency to resources** — CPU, memory, network, database each have limits
3. **Implement backpressure** — Pause input when queue backs up
4. **Dynamic adjustment** — Adapt concurrency based on load
5. **Memory matters** — Each queued task consumes memory; limit queue size
6. **Test under load** — Profile your specific workload before production
7. **Alert on thresholds** — Queue backing up? Utilization low? Adjust concurrency
8. **Resource constraints** — Find the bottleneck (CPU, memory, network, DB) and optimize there

---

## Related

- [Queuing Strategies Fundamentals](queuing-strategies.md) — p-limit, p-queue, batch processing basics
- [Complete p-* Utilities Guide](p-utilities-complete-guide.md) — All individual p-* tools
- [Queue Patterns & Composition](queue-patterns-and-composition.md) — Real-world examples
- [Node.js Stream Concurrency Overview](node-stream-concurrency.md) — Full integration pattern

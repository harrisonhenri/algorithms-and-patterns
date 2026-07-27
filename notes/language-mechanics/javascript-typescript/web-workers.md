---
tags: [javascript, browser, theory]
title: "Web Workers"
---

# Web workers

Provide a set of APIs to create background threads to solve heavy operations without blocking JS single thread. Since workers run its tasks in different threads:

- Worker thread does not have access to some browser features like dom, global objects, etc
- But the worker can run tasks using websocket, indexedb
- A worker can create child workers
- **Dedicated** (only interacts with the script that initially created) vs **Shared** (can be accessed from different scripts)

## Use cases

- Prefetch data
- Real-time tasks
- Heavy data processing (image processing, data transformation)
- Long polling
- Parallel computation

## Data transfering

| **Mechanism**             | **Description**                                                                                                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Structured cloned message | The basic form of data transfer between main thread and worker thread. However, in some cases where large data needs to be transmitted, structured cloning can slow down performance. |
| Transferable              | Improves the lack of performance when the data has several tens of MB. Ownership of `ArrayBuffer` or `MessagePort` transfers to the worker.                                           |

---

## Worker Pool Pattern

Manage multiple workers with a task queue to balance load and prevent thread explosion.

### Example: Simple Worker Pool

```ts
// worker-pool.ts
type WorkerTask<T> = {
  id: string;
  data: T;
  resolve: (r: any) => void;
  reject: (e: Error) => void;
};

class WorkerPool {
  private workers: Worker[] = [];
  private taskQueue: WorkerTask<any>[] = [];
  private workerAvailable: boolean[] = [];

  constructor(
    private poolSize: number,
    private workerScript: string,
  ) {
    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerScript);
      worker.onmessage = (e) => this.onWorkerComplete(i, e.data);
      worker.onerror = (e) => this.onWorkerError(i, e);
      this.workers.push(worker);
      this.workerAvailable[i] = true;
    }
  }

  async execute<T, R>(data: T): Promise<R> {
    return new Promise((resolve, reject) => {
      const task = { id: crypto.randomUUID(), data, resolve, reject };
      this.taskQueue.push(task);
      this.assignNextTask();
    });
  }

  private assignNextTask() {
    if (this.taskQueue.length === 0) return;

    const availableIdx = this.workerAvailable.indexOf(true);
    if (availableIdx === -1) return; // No workers available

    const task = this.taskQueue.shift()!;
    this.workerAvailable[availableIdx] = false;
    this.workers[availableIdx].postMessage({ id: task.id, data: task.data });
  }

  private onWorkerComplete(workerIdx: number, { id, result }: any) {
    // Find task with this ID and resolve it
    this.workerAvailable[workerIdx] = true;
    this.assignNextTask();
  }

  terminate() {
    this.workers.forEach((w) => w.terminate());
  }
}

// Usage
const pool = new WorkerPool(4, "./processor.worker.ts");
const results = await Promise.all([
  pool.execute({ value: 1000 }),
  pool.execute({ value: 2000 }),
  pool.execute({ value: 3000 }),
]);
await pool.terminate();
```

### Worker Pool with Queue Integration

For production systems, combine worker pools with queue libraries:

```ts
import PQueue from "p-queue";

class ConcurrentWorkerPool {
  private queue = new PQueue({ concurrency: 4 }); // Max 4 workers

  async process<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
  ): Promise<R[]> {
    return Promise.all(
      items.map((item) => this.queue.add(() => processor(item))),
    );
  }
}

// Usage: process 1000 images in parallel (max 4 concurrent)
const pool = new ConcurrentWorkerPool();
const thumbnails = await pool.process(images, (img) => generateThumbnail(img));
```

---

## See Also

- **[Queue Patterns & Composition](queue-patterns-and-composition.md)** — Learn how to combine p-queue with retry, throttle, and timeout for robust task management. Many patterns apply to distributing work across workers.
- **[Node Stream Concurrency](node-stream-concurrency.md)** — Stream-based approach to handling concurrent data flows. Useful for coordinating worker output.
- **[Backpressure](backpressure.md)** — How workers should handle backpressure when output exceeds consumer capacity.

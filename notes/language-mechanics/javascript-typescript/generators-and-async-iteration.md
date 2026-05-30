---
tags: [javascript, nodejs, generators, async-iteration, iterators, lazy-evaluation]
title: "Generators and Async Iteration in Node.js"
domain: "language-mechanics"
---

# Generators and Async Iteration in Node.js

Generators provide **lazy evaluation and memory efficiency**. Instead of loading an entire dataset into memory, generators **yield items on-demand**.

---

## Fundamentals: Generator Functions

A generator is a special function that can **pause** and **resume** execution using `yield`.

```ts
function* simpleGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = simpleGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

Key points:
- `function*` declares a generator
- `yield` pauses execution and returns a value
- `.next()` resumes and returns `{ value, done }`
- **No execution until you call `.next()`** (lazy)

---

## Iteration: `for...of` Loop

Generators are iterable, so you can use `for...of`:

```ts
function* countTo(n: number) {
  for (let i = 1; i <= n; i++) {
    yield i;
  }
}

for (const num of countTo(5)) {
  console.log(num); // 1, 2, 3, 4, 5
}
```

**Benefit**: Processes one item at a time; memory usage is constant regardless of `n`.

---

## Async Generators: `async function*`

Async generators combine `async` and `function*`, allowing `await` inside:

```ts
async function* fetchUsersPaginated(pageSize: number) {
  let page = 1;
  while (true) {
    const users = await fetch(`/api/users?page=${page}`);
    if (users.length === 0) break;

    for (const user of users) {
      yield user; // Yields one user at a time
    }
    page++;
  }
}

// Consume with for await...of
for await (const user of fetchUsersPaginated(10)) {
  console.log(user.name);
}
```

**Pattern**:
```ts
async function* source() {
  // Can use await; pauses between yields
  yield value1;
  yield value2;
}

// Consume with for await...of
for await (const item of source()) {
  // Process item
}
```

---

## Use Case: Read Large File Line-by-Line

Without generators (loads entire file):
```ts
const content = fs.readFileSync('./huge-file.txt', 'utf-8');
const lines = content.split('\n');

for (const line of lines) {
  processLine(line);
}
// ❌ Memory usage = entire file size
```

With async generators (constant memory):
```ts
import fs from 'fs';
import readline from 'readline';

async function* readLinesFromFile(filePath: string) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    yield line;
  }
}

// Usage
for await (const line of readLinesFromFile('./huge-file.txt')) {
  processLine(line);
}
// ✅ Memory usage = one line at a time
```

---

## Generator + Stream Integration: `Readable.from()`

Node.js Streams can be created from generators using `Readable.from()`:

```ts
import { Readable } from 'stream';

async function* dataSource() {
  for (let i = 1; i <= 1000000; i++) {
    yield { id: i, value: Math.random() };
  }
}

// Convert generator to Readable Stream
const readableStream = Readable.from(dataSource(), {
  objectMode: true,
});

// Now you can pipe it to a transform stream
readableStream
  .pipe(transformStream)
  .pipe(writeStream);
```

**Why this is powerful**:
- Generator provides **lazy data source**
- `.pipe()` adds **automatic backpressure**
- Transform Stream processes **in batches**
- Constant memory usage throughout

---

## Example: Processing API Responses in Batches

```ts
async function* fetchAllUsers(pageSize: number = 100) {
  let page = 1;
  while (true) {
    const response = await fetch(
      `https://api.example.com/users?page=${page}&limit=${pageSize}`
    );

    if (response.status === 404) break; // No more pages

    const users = await response.json();
    if (users.length === 0) break;

    for (const user of users) {
      yield user;
    }

    page++;
  }
}

// Integrate with stream and backpressure
import { Readable, Transform, pipeline } from 'stream';
import { promisify } from 'util';

const asyncPipeline = promisify(pipeline);

async function processAllUsers() {
  const source = Readable.from(fetchAllUsers(), { objectMode: true });

  let batch: any[] = [];
  const batchSize = 10;

  const batchTransform = new Transform({
    objectMode: true,
    async transform(user, encoding, callback) {
      batch.push(user);

      if (batch.length >= batchSize) {
        const toSend = [...batch];
        batch = [];

        try {
          // Save batch to database
          await saveUsersToDB(toSend);
          console.log(`Saved batch of ${toSend.length} users`);
        } catch (err) {
          callback(err);
          return;
        }
      }

      callback();
    },

    async flush(callback) {
      if (batch.length > 0) {
        try {
          await saveUsersToDB(batch);
          console.log(`Saved final batch of ${batch.length} users`);
        } catch (err) {
          callback(err);
          return;
        }
      }
      callback();
    },
  });

  try {
    await asyncPipeline(source, batchTransform);
    console.log('Done processing all users');
  } catch (err) {
    console.error('Pipeline failed:', err);
  }
}
```

---

## Generator Composition: Chaining Generators

Generators can yield from other generators:

```ts
function* gen1() {
  yield 1;
  yield 2;
}

function* gen2() {
  yield 3;
  yield 4;
}

function* combined() {
  yield* gen1(); // Delegates to gen1
  yield* gen2(); // Delegates to gen2
}

for (const value of combined()) {
  console.log(value); // 1, 2, 3, 4
}
```

**Use case**: Compose multiple data sources into a single stream:

```ts
async function* multipleAPIs() {
  yield* fetchAPI1();
  yield* fetchAPI2();
  yield* fetchAPI3();
}
```

---

## Key Differences: Generator vs Array

| Aspect | Generator | Array |
|--------|-----------|-------|
| **Memory** | Constant (one item at a time) | O(n) (all items in memory) |
| **Execution** | Lazy (yields on-demand) | Eager (all computed) |
| **Infinite** | ✅ Possible | ❌ Not practical |
| **Backpressure** | ✅ Auto with `.pipe()` | ❌ Must handle manually |
| **Use Case** | Large datasets, APIs, files | Small datasets, computed values |

---

## Example: Infinite Generator

A generator can theoretically yield forever (lazy evaluation prevents memory issues):

```ts
function* infiniteCounter() {
  let n = 0;
  while (true) {
    yield n++;
  }
}

// Take only the first 10
let count = 0;
for (const num of infiniteCounter()) {
  console.log(num);
  if (++count === 10) break; // Manually stop
}
```

With arrays, this would be impossible:
```ts
const infiniteArray = Array.from({ length: Infinity }); // ❌ Crash
```

---

## Async Generator Error Handling

```ts
async function* readWithRetry(filePath: string) {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      for await (const line of readLines(filePath)) {
        yield line;
      }
      return; // Success
    } catch (err) {
      attempt++;
      if (attempt === maxRetries) throw err;
      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
}
```

---

## Real-World Pattern: Generator + Backpressure + Queuing

Combining all three concepts:

```ts
import { Readable, Transform, pipeline } from 'stream';
import PQueue from 'p-queue';

// Step 1: Async generator (lazy data source)
async function* fetchLogsFromAPI() {
  for (let page = 1; page <= 1000; page++) {
    const logs = await fetch(`/api/logs?page=${page}`).then((r) =>
      r.json()
    );
    for (const log of logs) {
      yield log;
    }
  }
}

// Step 2: Transform stream (batching + backpressure)
const queue = new PQueue({ concurrency: 3 }); // Explicit concurrency limit

let batch: any[] = [];
const batchSize = 50;

const transformStream = new Transform({
  objectMode: true,
  async transform(log, encoding, callback) {
    batch.push(log);

    if (batch.length >= batchSize) {
      const toSend = [...batch];
      batch = [];

      // Queue the processing; backpressure automatically pauses generator if queue fills
      queue.add(() => sendToDatabase(toSend));
    }

    callback();
  },

  async flush(callback) {
    if (batch.length > 0) {
      await queue.add(() => sendToDatabase(batch));
    }
    callback();
  },
});

// Step 3: Run the pipeline
(async () => {
  const source = Readable.from(fetchLogsFromAPI(), {
    objectMode: true,
  });
  await promisify(pipeline)(source, transformStream);
  console.log('All logs processed');
})();
```

---

## Key Takeaways

1. **Generators are lazy**: They don't execute until you call `.next()` or iterate.
2. **Async generators** support `await`, making them perfect for I/O-bound operations.
3. **`Readable.from()` converts generators to streams**, enabling automatic backpressure.
4. **Constant memory**: Process infinite or very large datasets without loading everything at once.
5. **Compose generators** with `yield*` to combine multiple sources.

---

## Related

- [Backpressure in Node.js Streams](backpressure.md) — How automatic flow control works
- [Queuing Strategies](queuing-strategies.md) — Explicit concurrency control (p-queue, p-limit)
- [Node.js Stream Concurrency Overview](node-stream-concurrency.md) — Full pipeline integration

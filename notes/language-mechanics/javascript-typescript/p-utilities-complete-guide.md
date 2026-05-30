---
tags: [javascript, nodejs, p-retry, p-timeout, p-throttle, p-whilst, p-all, p-lazy, p-tap, promise-utilities]
title: "Complete Guide to p-* Utilities: A-Z Reference"
domain: "language-mechanics"
---

# Complete Guide to p-* Utilities: A-Z Reference

The `p-*` family of packages (by Sindre Sorhus and contributors) provides composable, promise-based utilities for async control flow. This guide covers the complete ecosystem.

---

## The p-* Ecosystem: Complete Overview

The `p-*` family provides modular, zero-dependency utilities for async patterns. Each tool does **one thing well** and composes with others.

### Feature Matrix: All p-* Utilities

| Package | Purpose | Size | Learning Curve | Use Case |
|---------|---------|------|---|---|
| **p-limit** | Concurrency limiter | ~1KB | ⭐ Easy | Simple: max N concurrent |
| **p-queue** | Full queue management | ~10KB | ⭐⭐ Medium | Complex: priority, delays, retries |
| **p-retry** | Retry with backoff | ~2KB | ⭐ Easy | Add retry logic to any promise |
| **p-timeout** | Promise timeout | ~500B | ⭐ Easy | Reject promise if takes too long |
| **p-throttle** | Rate limiter | ~1.5KB | ⭐ Easy | Max X calls per Y milliseconds |
| **p-whilst** | Loop with async condition | ~1KB | ⭐⭐ Medium | Repeat operation while condition true |
| **p-all** | Promise.all with concurrency | ~1KB | ⭐ Easy | `Promise.all()` but with limits |
| **p-settle** | Settle promises with control | ~1.5KB | ⭐ Easy | `Promise.allSettled()` + features |
| **p-tap** | Inspect promise value | ~500B | ⭐ Easy | Debug/log without affecting flow |
| **p-lazy** | Lazy promise evaluation | ~1KB | ⭐⭐ Medium | Defer promise until needed |

---

## p-retry: Automatic Retry with Backoff

Install: `npm install p-retry`

```ts
import pRetry from 'p-retry';

// Automatic exponential backoff
const result = await pRetry(
  () => fetch('/api/flaky-endpoint'),
  {
    retries: 5, // Total attempts
    factor: 2, // Exponential backoff multiplier
    minTimeout: 1000, // Start with 1s
    maxTimeout: 60000, // Cap at 60s
    randomizationFactor: 0.1, // Add 10% jitter
    onFailedAttempt: (error) => {
      console.warn(
        `Attempt ${error.attemptNumber} failed. Retrying...`,
        error.message
      );
    },
  }
);
```

**Backoff formula**: `min(maxTimeout, minTimeout * factor ^ (attemptNumber - 1))`

### Real Example: Database Connection Retry

```ts
import pRetry from 'p-retry';
import mongoose from 'mongoose';

async function connectToDatabase() {
  await pRetry(
    () => mongoose.connect(process.env.MONGO_URI!),
    {
      retries: 10,
      minTimeout: 2000, // Start with 2s
      maxTimeout: 30000, // Cap at 30s
      onFailedAttempt: (error) => {
        console.log(
          `DB connection failed (attempt ${error.attemptNumber}). Retrying...`
        );
      },
    }
  );

  console.log('Database connected');
}

connectToDatabase();
```

---

## p-timeout: Time-Bound Operations

Install: `npm install p-timeout`

```ts
import pTimeout from 'p-timeout';

// Reject if takes longer than 5 seconds
const result = await pTimeout(
  fetch('/api/slow-endpoint'),
  5000,
  'API call took too long'
);
```

### Combining p-retry + p-timeout

```ts
import pRetry from 'p-retry';
import pTimeout from 'p-timeout';

const result = await pRetry(
  async () => {
    // Each attempt has a 3-second timeout
    return await pTimeout(fetch('/api/endpoint'), 3000);
  },
  { retries: 5, minTimeout: 500 }
);
```

---

## p-throttle: Rate Limiting

Install: `npm install p-throttle`

```ts
import pThrottle from 'p-throttle';

// Max 5 calls per 10 seconds
const throttled = pThrottle({
  limit: 5, // concurrent
  interval: 10000, // milliseconds
})(async (userId: number) => {
  return await fetch(`/api/users/${userId}`);
});

// Usage: Will respect 5 calls per 10s limit
const results = await Promise.all(
  Array.from({ length: 100 }, (_, i) => throttled(i))
);
```

**Key difference from p-limit:**
- **p-limit**: X concurrent at any time
- **p-throttle**: X per Y milliseconds (rate limiting)

### Real Example: API Rate Limit Control

```ts
import pThrottle from 'p-throttle';

// Twitter API: 15 requests per 15 minutes
const throttledTweet = pThrottle({
  limit: 15,
  interval: 15 * 60 * 1000,
})(async (text: string) => {
  return await twitterAPI.tweet(text);
});

for (const tweet of tweets) {
  await throttledTweet(tweet);
  console.log('Tweet posted');
}
```

---

## p-whilst: Conditional Loops

Install: `npm install p-whilst`

```ts
import pWhilst from 'p-whilst';

let count = 0;

await pWhilst(
  () => count < 10, // Condition
  async () => {
    // Action
    await processItem(count);
    count++;
  }
);

console.log('Processed 10 items');
```

### Real Example: Polling Until Success

```ts
import pWhilst from 'p-whilst';

async function pollUntilReady() {
  let attempts = 0;
  const maxAttempts = 30;

  await pWhilst(
    () => attempts < maxAttempts,
    async () => {
      const response = await fetch('/api/status');
      const data = await response.json();

      if (data.ready) {
        throw new Error('Service ready!');
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  ).catch((err) => {
    if (err.message !== 'Service ready!') throw err;
  });

  console.log('Service is ready');
}
```

---

## p-all: Concurrent Promise.all()

Install: `npm install p-all`

```ts
import pAll from 'p-all';

const items = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  task: () => fetchAndProcess(i),
}));

// Process with max 10 concurrent
const results = await pAll(
  items.map((item) => item.task),
  { concurrency: 10 }
);
```

**Difference from p-limit:**
- **p-limit**: Apply limit to existing promises/functions
- **p-all**: Manages array of task functions with concurrency

```ts
// p-limit style
import pLimit from 'p-limit';
const limit = pLimit(10);
const results = await Promise.all(
  items.map((item) => limit(() => item.task()))
);

// p-all style (cleaner for arrays)
import pAll from 'p-all';
const results = await pAll(items.map((item) => item.task), {
  concurrency: 10,
});
```

---

## p-lazy: Deferred Promise Execution

Install: `npm install p-lazy`

```ts
import pLazy from 'p-lazy';

// Promise doesn't execute until .then() is called
const lazyPromise = pLazy((resolve) => {
  console.log('Starting expensive operation...');
  setTimeout(() => resolve('Done!'), 5000);
});

// Nothing logged yet
console.log('Created promise');

// Logged and executed only when awaited
const result = await lazyPromise;
```

### Real Example: Lazy Database Connection

```ts
import pLazy from 'p-lazy';

const lazyConnection = pLazy(async (resolve) => {
  const connection = await mongoose.connect(MONGO_URI);
  resolve(connection);
});

// Connection doesn't open until first use
app.get('/data', async (req, res) => {
  const db = await lazyConnection;
  const data = await db.collection('items').find().toArray();
  res.json(data);
});
```

---

## p-tap: Debugging Without Side Effects

Install: `npm install p-tap`

```ts
import pTap from 'p-tap';

const result = await pTap(
  fetch('/api/users'),
  (users) => {
    console.log('DEBUG: Received users:', users);
    // Can also log to file, send to analytics, etc.
  }
);

// result still has the original value
```

### Real Example: Logging Pipeline

```ts
import pTap from 'p-tap';

const data = await fetch('/api/data')
  .then((r) => r.json())
  .then((data) =>
    pTap(data, (result) => {
      console.log(`[Fetch] Received ${result.length} items`);
    })
  )
  .then((data) =>
    pTap(data, (result) => {
      console.log(`[Transform] Processed ${result.length} items`);
    })
  );

// No side effects; value flows through untouched
```

---

## Quick Reference: When to Use Each

**Need to wait for X concurrent tasks?** → p-limit, p-queue, or p-all

**Need automatic retries?** → p-retry

**Need to limit API rate (X calls/minute)?** → p-throttle

**Need time bounds?** → p-timeout

**Need conditional polling loop?** → p-whilst

**Need lazy evaluation?** → p-lazy

**Need debugging without side effects?** → p-tap

---

## Related

- [Queuing Strategies Fundamentals](queuing-strategies.md) — p-limit, p-queue, and batch processing
- [Queue Patterns & Composition](queue-patterns-and-composition.md) — Real-world composition patterns
- [Queue Performance & Tuning](queue-performance-and-tuning.md) — Monitoring, resource limits, and decision trees
- [Backpressure in Node.js Streams](backpressure.md) — Automatic flow control
- **Official**: [promise-fun on GitHub](https://github.com/sindresorhus/promise-fun) — Complete ecosystem reference

---
tags: [java, concurrency, theory, multithreading, synchronization]
title: "Java Concurrent Programming"
---

# Concurrent Programming (Java)

## Important Context

Unlike Node.js, Java applications commonly execute many operating system threads simultaneously. Because multiple threads may access the same memory concurrently, Java concurrency focuses heavily on:

- Mutual exclusion (preventing simultaneous access)
- Memory visibility (ensuring thread updates are observed by others)
- Coordination (synchronizing between threads)
- Ordering guarantees (happens-before relationships)
- Throughput under contention (performance with lock contention)

The Java ecosystem provides a rich concurrency toolkit through:

- JVM synchronization primitives
- `java.util.concurrent` package
- Lock-free atomic structures
- Coordination utilities

---

## Core Concepts

### Visibility vs Atomicity

Two distinct problems must be solved when sharing data between threads:

| Problem        | Meaning                                                                 | Solved by                                                 |
| -------------- | ----------------------------------------------------------------------- | --------------------------------------------------------- |
| **Visibility** | A write by thread A may not be seen by thread B (CPU cache, reordering) | `volatile`, `synchronized`, locks, `happens-before` rules |
| **Atomicity**  | A compound action (read-modify-write) can be interrupted mid-way        | `synchronized`, atomic classes, locks                     |

---

## Low-Level Primitives

### `volatile`

Marks a field so that every read goes straight to main memory and every write is immediately flushed — guarantees **visibility** but **not atomicity**.

```java
class Flag {
    volatile boolean running = true; // visible to all threads immediately

    void stop() { running = false; }
    void loop() { while (running) { /* ... */ } }
}
```

**Use when:** one thread writes, others only read, and the write is a **single assignment** (not read-modify-write).

### `synchronized`

Provides both **visibility and atomicity** (mutual exclusion). Only one thread can hold the monitor at a time — **pessimistic locking**.

```java
class Counter {
    private int count = 0;

    // method-level lock — locks on `this`
    public synchronized void increment() { count++; }

    // block-level lock — can use a dedicated lock object
    public void decrement() {
        synchronized (this) { count--; }
    }
}
```

**Characteristics:**

- Automatic unlock on exit
- Reentrant (a thread that already holds a lock can re-enter `synchronized` blocks on the same object)
- JVM optimized
- Easy to use

**Limitations:**

- Cannot timeout while waiting
- Cannot interrupt blocked acquisition
- Only one intrinsic condition queue
- Less flexible than explicit locks

### Atomic Variables (`java.util.concurrent.atomic`)

Lock-free thread-safe operations on a **single variable**, implemented via **CAS (Compare-And-Swap)** hardware instructions — no blocking.

| Class                          | Purpose                                  |
| ------------------------------ | ---------------------------------------- |
| `AtomicInteger` / `AtomicLong` | Integer counter, CAS update              |
| `AtomicBoolean`                | Boolean flag                             |
| `AtomicReference<V>`           | Object reference                         |
| `AtomicStampedReference<V>`    | Reference + stamp (solves ABA problem)   |
| `LongAdder` / `DoubleAdder`    | High-contention counters (striped cells) |

```java
AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet();           // thread-safe, no lock
counter.compareAndSet(1, 2);        // CAS: set to 2 only if current value is 1
```

Here is the improved explanation. The previous example was slightly flawed because in lock-free linked lists, the ABA problem typically manifests when manipulating the `head` pointer (like in a Treiber Stack), causing the data structure to point to a freed or disconnected node.

The revised version uses the classic lock-free stack scenario, which is the industry standard for illustrating the ABA problem.

---

#### CAS (Compare-And-Swap)

The fundamental primitive behind lock-free algorithms. Hardware (e.g., `CMPXCHG` on x86) atomically:

1. Reads the current value.
2. Compares it with an expected value.
3. Writes a new value **only if** the current == expected.

```text
CAS(variable, expected, newValue):
  if variable == expected:
    variable = newValue → return true
  else:
    return false  (caller retries)

```

**ABA problem:** A value changes from **A** → **B** → back to **A** between a read and a CAS. The CAS succeeds because the value looks unchanged, but the underlying state or context of the data structure has actually been modified.

**Concrete example (Lock-Free Stack):**
Imagine a stack where threads are popping and pushing nodes.

```text
Initial Stack:  Top → A → B → C

Thread 1: wants to pop().
          reads Top = A
          reads A.next = B
          (Plans to CAS(Top, A, B) to make B the new Top)
          **[Thread 1 is preempted by the OS and pauses]**

Thread 2: pops A.            # Stack: Top → B → C
Thread 2: pops B.            # Stack: Top → C  (Node B is freed/deleted)
Thread 2: pushes A back.     # Stack: Top → A → C

Thread 1: wakes up and executes its CAS:
          CAS(Top, A, B)
          # Compares Top to A. They match! CAS succeeds.
          # Sets Top = B.

```

**The Crash:** Thread 1 successfully sets `Top` to **B**. However, **B** was already removed by Thread 2! The stack is now corrupted, pointing to garbage memory, and node **C** is lost entirely.

**Solution:** `AtomicStampedReference<V>` fixes this by attaching a **stamp** (version counter) to the reference, which increments on every update. Both the reference and the stamp must match for the CAS to succeed:

```java
// Initialize reference to nodeA with a stamp of 0
AtomicStampedReference<Node> top = new AtomicStampedReference<>(nodeA, 0);

// Thread 1 reads the value and the current stamp
Node expectedNode = top.getReference();  // nodeA
int expectedStamp = top.getStamp();      // 0

// ... Meanwhile, Thread 2 modifies the stack, bumping the stamp to 3 ...

// Thread 1 attempts CAS.
// Fails because the stamp is now 3 (0 != 3), even though the node is A again!
boolean success = top.compareAndSet(
    expectedNode, nodeB,          // expected reference, new reference
    expectedStamp, expectedStamp + 1 // expected stamp, new stamp
);

```

#### Adders (`LongAdder`)

Higher throughput than `AtomicLong` under **write-heavy contention** by maintaining a **striped array of cells** — each thread typically updates its own cell. `sum()` aggregates all cells.

**Trade-off:** higher memory usage, `sum()` is not atomic with respect to updates.

**Usage guide:**

- Use `AtomicLong` when you need an **exact snapshot**
- Use `LongAdder` when writes vastly outnumber reads (e.g., counters, statistics)

---

## Thread Execution

### Creating Threads

```java
// Runnable — no return value, no checked exception
Runnable task = () -> System.out.println("running");
new Thread(task).start();

// Callable — returns a value, can throw checked exceptions
Callable<Integer> computation = () -> 42;
```

### ExecutorService

High-level API that decouples task **submission** from thread **management**.

```java
ExecutorService executor = Executors.newFixedThreadPool(4);

// submit Runnable
executor.submit(() -> System.out.println("task"));

// submit Callable — returns a Future
Future<Integer> future = executor.submit(() -> 42);
Integer result = future.get(); // blocks until complete

// shutdown gracefully
executor.shutdown();           // waits for in-flight tasks
executor.shutdownNow();        // interrupts all running tasks, returns pending list
```

#### Thread Pool Types

| Factory                     | Behaviour                                                |
| --------------------------- | -------------------------------------------------------- |
| `newFixedThreadPool(n)`     | Fixed number of threads; tasks queue if all busy         |
| `newCachedThreadPool()`     | Spawns threads on demand; idle threads expire after 60 s |
| `newSingleThreadExecutor()` | Single thread; tasks execute sequentially                |
| `newScheduledThreadPool(n)` | Supports delayed and periodic tasks                      |
| `newWorkStealingPool()`     | ForkJoinPool; work-stealing for CPU-bound tasks          |

#### ScheduledExecutorService

```java
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
scheduler.scheduleAtFixedRate(() -> System.out.println("tick"), 0, 1, TimeUnit.SECONDS);
scheduler.scheduleWithFixedDelay(task, 0, 500, TimeUnit.MILLISECONDS); // delay measured from task end
```

### CompletableFuture (Async Pipelines)

Non-blocking, composable async computations introduced in Java 8.

```java
CompletableFuture.supplyAsync(() -> fetchUser(id))     // runs in ForkJoinPool
    .thenApply(user -> enrichWithProfile(user))         // transform result
    .thenCompose(user -> fetchOrders(user.id()))        // flat-map (async chaining)
    .thenCombine(fetchInventory(), (orders, inv) -> merge(orders, inv)) // zip two futures
    .exceptionally(ex -> fallback())                    // error handling
    .thenAccept(System.out::println);                   // terminal consumer
```

---

## Monitors & Explicit Locks (`java.util.concurrent.locks`)

### Intrinsic Monitor (`synchronized` + `wait/notify`)

Every Java object has a built-in monitor. `wait()` releases the lock and suspends the thread; `notify()` / `notifyAll()` wakes waiting threads.

```java
synchronized (lock) {
    while (!conditionMet()) lock.wait();  // always use a loop, not if
    // ... do work
    lock.notifyAll();
}
```

### ReentrantLock

Same mutual exclusion as `synchronized` but with more control: **timed**, **interruptible**, and **fairness** options.

```java
ReentrantLock lock = new ReentrantLock(true); // fair mode — FIFO ordering

lock.lock();
try {
    // critical section
} finally {
    lock.unlock(); // always in finally
}

// tryLock — avoids deadlocks
if (lock.tryLock(100, TimeUnit.MILLISECONDS)) {
    try { /* ... */ } finally { lock.unlock(); }
}
```

**Key point:** A re-acquired lock by the same thread increments a hold count; `unlock()` decrements it. Thread releases when count reaches 0.

**Advantages over `synchronized`:**

- `tryLock()` for non-blocking attempts
- `lockInterruptibly()` for cancellation support
- Fairness configuration
- Multiple `Condition` variables for advanced coordination
- Explicit lock management

### ReentrantReadWriteLock

Separates read and write access — multiple concurrent readers are allowed as long as no writer holds the lock. Optimizes **read-heavy** workloads.

```java
ReadWriteLock rwLock = new ReentrantReadWriteLock();

// multiple threads can hold the read lock simultaneously
rwLock.readLock().lock();
try { /* read */ } finally { rwLock.readLock().unlock(); }

// exclusive write access
rwLock.writeLock().lock();
try { /* write */ } finally { rwLock.writeLock().unlock(); }
```

**Best use cases:**

- In-memory caches
- Configuration stores
- Shared dictionaries
- Read-heavy systems

### StampedLock (Java 8+)

Extends ReadWriteLock with an **optimistic read** mode — reads proceed without acquiring any lock and validate with a stamp at the end. Highest throughput for read-mostly data.

```java
StampedLock sl = new StampedLock();

// optimistic read — no lock acquired
long stamp = sl.tryOptimisticRead();
int value = this.value;              // read without lock
if (!sl.validate(stamp)) {           // was a write interleaved?
    stamp = sl.readLock();           // fall back to real read lock
    try { value = this.value; } finally { sl.unlockRead(stamp); }
}

// write
long ws = sl.writeLock();
try { this.value = newValue; } finally { sl.unlockWrite(ws); }
```

**Advantages:**

- Very high read throughput
- Reduced lock contention
- Efficient optimistic reads

**Limitations:**

- Not reentrant
- More complex than `ReadWriteLock`
- Easier to misuse; subtle bugs if validation is skipped

---

## Semaphores

Controls access to a **pool of resources** by maintaining a set of permits.

```java
Semaphore semaphore = new Semaphore(3); // max 3 concurrent threads

semaphore.acquire(); // blocks if no permits available
try {
    // access limited resource
} finally {
    semaphore.release();
}
```

**Key difference from locks:** A semaphore is **not ownership-based** — any thread can release a permit.

**Best use cases:**

- Database connection pools
- Thread throttling
- Rate limiting
- Resource management

---

## Concurrent Collections (`java.util.concurrent`)

Thread-safe collections that avoid coarse-grained locking for better throughput.

| Class                   | Based on    | Key property                                            |
| ----------------------- | ----------- | ------------------------------------------------------- |
| `ConcurrentHashMap`     | HashMap     | Segment/node-level locking; `computeIfAbsent` is atomic |
| `CopyOnWriteArrayList`  | ArrayList   | Writes copy the entire array; reads are lock-free       |
| `ConcurrentLinkedQueue` | Linked list | Lock-free FIFO queue (CAS-based)                        |
| `LinkedBlockingQueue`   | Linked list | Bounded/unbounded blocking queue                        |
| `ArrayBlockingQueue`    | Array       | Bounded blocking queue; backpressure for producers      |
| `PriorityBlockingQueue` | Heap        | Unbounded priority queue                                |
| `ConcurrentSkipListMap` | Skip list   | Sorted concurrent map                                   |

---

## Synchronizers

High-level coordination primitives.

| Class            | Use case                                               |
| ---------------- | ------------------------------------------------------ |
| `CountDownLatch` | Wait until N events have occurred (one-time)           |
| `CyclicBarrier`  | Wait until N threads all reach a checkpoint (reusable) |
| `Phaser`         | Flexible, reusable multi-phase barrier                 |
| `Exchanger`      | Two threads swap an object at a synchronisation point  |

```java
// CountDownLatch — main thread waits for 3 workers
CountDownLatch latch = new CountDownLatch(3);
executor.submit(() -> { doWork(); latch.countDown(); });
// ... (x3)
latch.await(); // blocks until count reaches 0
```

---

## Common Concurrency Pitfalls

| Problem            | Description                                                                                 | Prevention                                       |
| ------------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Race condition** | Outcome depends on thread scheduling order                                                  | Proper synchronisation                           |
| **Deadlock**       | Two threads each wait for a lock the other holds                                            | Consistent lock ordering; `tryLock` with timeout |
| **Livelock**       | Threads keep changing state in response to each other but make no progress                  | Randomised back-off                              |
| **Starvation**     | A thread never gets CPU time                                                                | Fair locks; proper thread priorities             |
| **False sharing**  | Two variables share a cache line; writes by different threads invalidate each other's cache | Padding (`@Contended`)                           |
| **ABA problem**    | CAS succeeds on a value that changed A→B→A                                                  | `AtomicStampedReference` (stamp detects reuse)   |

---

## Decision Framework: Choosing a Concurrency Primitive

This table helps you select the right tool based on your scenario. Key criteria:

- **Scope:** what you need to synchronise (single variable, multiple, coordination)
- **Contention:** expected thread conflict level (low, medium, high)
- **Throughput:** blocking vs. lock-free performance

### Quick Decision Table

| Requirement                  | Recommended Primitive      |
| ---------------------------- | -------------------------- |
| Simple mutual exclusion      | `synchronized`             |
| Timeout / interruption       | `ReentrantLock`            |
| Limit concurrent access      | `Semaphore`                |
| Read-heavy shared state      | `ReadWriteLock`            |
| Extreme read performance     | `StampedLock`              |
| Fast thread-safe counter     | `AtomicInteger`            |
| High-contention counters     | `LongAdder`                |
| Wait for tasks to finish     | `CountDownLatch`           |
| Synchronize execution phases | `CyclicBarrier` / `Phaser` |

### Comprehensive Decision Matrix

| Primitive                        | Problem                    | Scope                  | Contention  | Blocking                | Best for                                                                       |
| -------------------------------- | -------------------------- | ---------------------- | ----------- | ----------------------- | ------------------------------------------------------------------------------ |
| **`volatile`**                   | Visibility only            | Single variable        | Low         | No                      | Simple flag/counter with single writer (e.g., shutdown signal)                 |
| **`synchronized`**               | Atomicity + visibility     | Object/method          | Low–medium  | Yes                     | Simple critical sections; easier than locks when you don't need fairness       |
| **`AtomicInteger`** / **`Long`** | Atomicity without lock     | Single variable        | Low–medium  | No                      | Counters, flags, or single-variable updates where lock-free is needed          |
| **`AtomicStampedReference`**     | ABA prevention             | Single reference       | Low–medium  | No                      | Lock-free data structures (linked lists, stacks) where reuse is a risk         |
| **`LongAdder`**                  | High-contention counter    | Single logical counter | **High**    | No                      | Write-heavy metrics/statistics where exact snapshots aren't critical           |
| **`ReentrantLock`**              | Atomicity + control        | Critical section       | Low–medium  | Yes                     | Complex synchronisation: timeouts, interruption, fairness options              |
| **`ReentrantReadWriteLock`**     | Read-heavy workloads       | Shared resource        | Low–medium  | Yes                     | Cache/index with many readers and occasional writers                           |
| **`StampedLock`**                | Optimistic read            | Shared resource        | Low–medium  | Mostly no               | Read-heavy data with very high throughput (e.g., coordinates, stats)           |
| **`ConcurrentHashMap`**          | Thread-safe map            | Multiple keys          | Medium–high | Mostly no               | Shared cache/dictionary; better than synchronized Map                          |
| **`CopyOnWriteArrayList`**       | Read-heavy list            | Multiple elements      | Low–medium  | No                      | Lists with many readers, few writers (e.g., listeners, snapshots)              |
| **`ConcurrentLinkedQueue`**      | Lock-free FIFO             | Multiple elements      | Medium–high | No                      | High-throughput task queues without blocking                                   |
| **`LinkedBlockingQueue`**        | Blocking producer–consumer | Multiple elements      | Medium      | Yes                     | Decoupling producers/consumers with backpressure                               |
| **`CountDownLatch`**             | Wait for N events          | Coordination           | Low         | Yes (blocking on await) | One-time synchronisation: "wait for all workers to finish"                     |
| **`CyclicBarrier`**              | Reusable barrier           | Coordination           | Low         | Yes (blocking on await) | Multi-phase algorithm: "all threads rendezvous at checkpoint"                  |
| **`Semaphore`**                  | Resource pool access       | Coordination           | Medium      | Yes                     | Limit concurrent access to bounded resources (connection pools, thread limits) |

---

## Memory Visibility: Happens-Before Guarantees

The Java Memory Model defines a **happens-before** relationship: if action A happens-before action B, the effects of A are guaranteed visible to B.

Key edges in the happens-before graph:

- A `volatile` write **happens-before** any subsequent `volatile` read of the same variable.
- An `unlock` of a monitor **happens-before** any subsequent `lock` of the same monitor.
- `Thread.start()` **happens-before** any action in the started thread.
- All actions in a thread **happen-before** `Thread.join()` returns.
- `CompletableFuture` completion **happens-before** dependent stages.

**Key principle:** Without proper visibility guarantees, one thread may not observe updates made by another thread, leading to subtle, hard-to-debug race conditions.

---

## Java vs Node.js

Java uses preemptive OS threads with shared mutable memory — the central question is "how many threads may access this simultaneously?"

Node.js uses a single-threaded cooperative event loop — the central question is "how many async operations may run concurrently?"

See [Concurrency Across Languages](../concurrency-across-languages-and-models.md) for the full cross-language comparison.

---

## Rule of Thumb

### Prefer Simplicity First

Start with:

- `synchronized`
- Executors
- Standard concurrent collections

Only move toward advanced primitives when measurements justify additional complexity.

### Performance Without Measurement Is Dangerous

Concurrency optimizations frequently introduce:

- Deadlocks
- Starvation
- Priority inversion
- Livelocks
- Visibility bugs
- Throughput collapse under contention

Always benchmark and profile before introducing lower-level synchronization strategies.

---

## See Also

- [Scheduling Models](../scheduling-models.md) — Processes, threads, futures, coroutines
- [Node.js Concurrent Programming](../javascript-typescript/concurrent-programming.md) — Async-focused concurrency
- [Concurrency Across Languages](../concurrency-across-languages-and-models.md) — Comparative guide

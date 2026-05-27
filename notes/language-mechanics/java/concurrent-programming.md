---
tags: [java, concurrency, theory]
title: "Java concurrent programming"
---

# Concurrent Programming (Java)

---

## Core concepts

### Visibility vs Atomicity

Two distinct problems must be solved when sharing data between threads:

| Problem        | Meaning                                                                 | Solved by                                                 |
| -------------- | ----------------------------------------------------------------------- | --------------------------------------------------------- |
| **Visibility** | A write by thread A may not be seen by thread B (CPU cache, reordering) | `volatile`, `synchronized`, locks, `happens-before` rules |
| **Atomicity**  | A compound action (read-modify-write) can be interrupted mid-way        | `synchronized`, atomic classes, locks                     |

---

## Low-level primitives

### `volatile`

Marks a field so that every read goes straight to main memory and every write is immediately flushed — guarantees **visibility** but **not atomicity**.

```java
class Flag {
    volatile boolean running = true; // visible to all threads immediately

    void stop() { running = false; }
    void loop() { while (running) { /* ... */ } }
}
```

> Use when: one thread writes, others only read, and the write is a **single assignment** (not read-modify-write).

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

> Reentrancy: a thread that already holds a lock can re-enter `synchronized` blocks on the same object.

### Atomic variables (`java.util.concurrent.atomic`)

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

#### CAS (Compare-And-Swap)

The fundamental primitive behind lock-free algorithms. Hardware (e.g., `CMPXCHG` on x86) atomically:

1. Reads the current value.
2. Compares it with an expected value.
3. Writes a new value **only if** the current == expected.

```
CAS(variable, expected, newValue):
  if variable == expected:
    variable = newValue → return true
  else:
    return false  (caller retries)
```

**ABA problem:** a value changes A → B → A between a read and a CAS, making the CAS succeed incorrectly.

**Concrete example:** removing a node from a linked list:

```
Initial:  list = [A → B → C]

Thread 1: reads node = A           # stores reference to A
Thread 1: reads node.next = B      # plans to set it to C
Thread 2: removes A from list      # list = [B → C]
Thread 2: adds A back              # list = [A → B → C]
Thread 1: CAS(A.next, B, C)        # succeeds because A.next is still B!
         # but A was removed & re-added, causing logical errors
```

The issue: CAS only compares the reference value (A), not the semantic state. `AtomicStampedReference<V>` adds a **stamp** (version counter) that increments on each update:

```java
AtomicStampedReference<Node> ref = new AtomicStampedReference<>(nodeA, 0);
int stamp = ref.getStamp();              // 0
ref.compareAndSet(nodeA, nodeB, 0, 1); // succeeds, stamp increments to 1

// Even if nodeA is re-added later with a different stamp, the old stamp won't match
ref.compareAndSet(nodeA, nodeC, 0, 1); // fails because stamp is now > 1
```

#### Adders (`LongAdder`)

Higher throughput than `AtomicLong` under **write-heavy contention** by maintaining a **striped array of cells** — each thread typically updates its own cell. `sum()` aggregates all cells. Trade-off: higher memory usage, `sum()` is not atomic with respect to updates.

> Use `AtomicLong` when you need an **exact snapshot**. Use `LongAdder` when writes vastly outnumber reads (e.g., counters, statistics).

---

## Thread execution

### Creating threads

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

#### Thread pool types

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

### CompletableFuture (async pipelines)

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

## Monitors & explicit locks (`java.util.concurrent.locks`)

### Intrinsic monitor (`synchronized` + `wait/notify`)

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

> A re-acquired lock by the same thread increments a hold count; `unlock()` decrements it. Thread releases when count reaches 0.

### ReentrantReadWriteLock

Separates read and write access — multiple concurrent readers are allowed as long as no writer holds the lock. Optimises **read-heavy** workloads.

```java
ReadWriteLock rwLock = new ReentrantReadWriteLock();

// multiple threads can hold the read lock simultaneously
rwLock.readLock().lock();
try { /* read */ } finally { rwLock.readLock().unlock(); }

// exclusive write access
rwLock.writeLock().lock();
try { /* write */ } finally { rwLock.writeLock().unlock(); }
```

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

> Unlike a lock, a semaphore is **not ownership-based** — any thread can release a permit.

---

## Concurrent collections (`java.util.concurrent`)

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

## Common concurrency pitfalls

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

| Primitive | Problem | Scope | Contention | Blocking | Best for |
| --- | --- | --- | --- | --- | --- |
| **`volatile`** | Visibility only | Single variable | Low | No | Simple flag/counter with single writer (e.g., shutdown signal) |
| **`synchronized`** | Atomicity + visibility | Object/method | Low–medium | Yes | Simple critical sections; easier than locks when you don't need fairness |
| **`AtomicInteger`** / **`Long`** | Atomicity without lock | Single variable | Low–medium | No | Counters, flags, or single-variable updates where lock-free is needed |
| **`AtomicStampedReference`** | ABA prevention | Single reference | Low–medium | No | Lock-free data structures (linked lists, stacks) where reuse is a risk |
| **`LongAdder`** | High-contention counter | Single logical counter | **High** | No | Write-heavy metrics/statistics where exact snapshots aren't critical |
| **`ReentrantLock`** | Atomicity + control | Critical section | Low–medium | Yes | Complex synchronisation: timeouts, interruption, fairness options |
| **`ReentrantReadWriteLock`** | Read-heavy workloads | Shared resource | Low–medium | Yes | Cache/index with many readers and occasional writers |
| **`StampedLock`** | Optimistic read | Shared resource | Low–medium | Mostly no | Read-heavy data with very high throughput (e.g., coordinates, stats) |
| **`ConcurrentHashMap`** | Thread-safe map | Multiple keys | Medium–high | Mostly no | Shared cache/dictionary; better than synchronized Map |
| **`CopyOnWriteArrayList`** | Read-heavy list | Multiple elements | Low–medium | No | Lists with many readers, few writers (e.g., listeners, snapshots) |
| **`ConcurrentLinkedQueue`** | Lock-free FIFO | Multiple elements | Medium–high | No | High-throughput task queues without blocking |
| **`LinkedBlockingQueue`** | Blocking producer–consumer | Multiple elements | Medium | Yes | Decoupling producers/consumers with backpressure |
| **`CountDownLatch`** | Wait for N events | Coordination | Low | Yes (blocking on await) | One-time synchronisation: "wait for all workers to finish" |
| **`CyclicBarrier`** | Reusable barrier | Coordination | Low | Yes (blocking on await) | Multi-phase algorithm: "all threads rendezvous at checkpoint" |
| **`Semaphore`** | Resource pool access | Coordination | Medium | Yes | Limit concurrent access to bounded resources (connection pools, thread limits) |

---

## `happens-before` guarantee

The Java Memory Model defines a **happens-before** relationship: if action A happens-before action B, the effects of A are guaranteed visible to B.

Key edges in the happens-before graph:

- A `volatile` write **happens-before** any subsequent `volatile` read of the same variable.
- An `unlock` of a monitor **happens-before** any subsequent `lock` of the same monitor.
- `Thread.start()` **happens-before** any action in the started thread.
- All actions in a thread **happen-before** `Thread.join()` returns.
- `CompletableFuture` completion **happens-before** dependent stages.

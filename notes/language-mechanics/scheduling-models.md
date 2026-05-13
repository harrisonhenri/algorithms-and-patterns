---
tags: [concurrency, theory]
title: "Scheduling models"
---

# Scheduling models

- **Necessary:** To manage CPU time among multiple tasks and ensure responsiveness, fairness, or real-time guarantees.
- **Unnecessary:** In very simple, single-task systems where no concurrency is required.

---

## Preemptive vs Cooperative Scheduling

Scheduling strategies that define **who controls when a task stops running**.

### Cooperative scheduling (non-preemptive)

A cooperative model where **tasks voluntarily yield control** of the CPU.

- A task runs until it:
  - explicitly yields
  - blocks on I/O
  - finishes execution
- The scheduler **cannot interrupt** a running task

**Characteristics**

- Simple to implement
- Low overhead
- A single misbehaving task can block the entire system
- Poor real-time guarantees

**Common use cases**

- Event loops
- Coroutines / async–await
- UI frameworks
- Early operating systems

---

### Preemptive scheduling

A preemptive model where the **scheduler can interrupt tasks at any time**.

- Tasks are stopped via:
  - timer interrupts
  - priority rules
- The system saves context and switches execution automatically

**Characteristics**

- Fair CPU sharing
- Strong responsiveness
- Supports real-time constraints
- Requires synchronization primitives (locks, mutexes)

**Common use cases**

- Modern operating systems (Linux, Windows, macOS)
- RTOS environments
- Multithreaded applications

---

## Time slicing

A mechanism commonly used in **preemptive systems**.

- Each task gets a fixed time quantum
- When time expires, the scheduler preempts the task
- Often implemented as round-robin scheduling

---

## Priority-based scheduling

A scheduling strategy where **higher-priority tasks preempt lower-priority ones**.

- Critical tasks can interrupt non-critical ones
- Common in real-time systems

**Risk**

- Priority inversion (mitigated with priority inheritance)

---

## Coroutines and async models

Concurrency mechanisms that are **cooperative by design**.

- Execution switches only at explicit suspension points
- No true parallelism unless backed by threads

**Examples**

- JavaScript async/await
- Python asyncio
- Kotlin coroutines

---

## Workload characteristics

Understanding what **limits** a task determines which concurrency model should be used.

| Workload         | Definition                                                                                            | Best fit                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **I/O bound**    | Task is limited by input/output operations — reading/writing to disk, network calls, database queries | Threads or async I/O (event loop) — CPU is idle during waits, so concurrency is cheap                         |
| **CPU bound**    | Task is limited by processing power — computation, encoding, cryptography                             | Separate **processes** (bypass GIL-style locks) or threads when data sharing is safe; leverage multiple cores |
| **Memory bound** | Task is limited by memory bandwidth — large matrix ops, data-intensive transforms                     | Threads are fine for shared data; use **processes** if data isolation is needed to prevent corruption         |

### Practical mapping

| Runtime        | I/O bound                                                | CPU bound                                                          |
| -------------- | -------------------------------------------------------- | ------------------------------------------------------------------ |
| **Node.js**    | Native — event loop + libuv async I/O                    | Worker Threads (`worker_threads`) or child processes               |
| **Python**     | `asyncio` / `threading` (GIL released on I/O)            | `multiprocessing` (bypasses GIL)                                   |
| **Java / JVM** | Virtual threads (Project Loom) or async frameworks       | Platform threads with thread pools; `ForkJoinPool` for parallelism |
| **Go**         | Goroutines — M:N scheduler maps goroutines to OS threads | Same goroutines; GOMAXPROCS controls parallelism                   |

### Why it matters for system design

- **I/O bound services** (APIs, gateways) scale well with more threads or async concurrency — the bottleneck is network/disk, not CPU.
- **CPU bound services** (video encoding, ML inference) need true parallelism — more threads on a single core won't help; scale horizontally or use dedicated worker pools.
- **Memory bound tasks** need large caches and memory-efficient data layouts — more threads may increase contention, not throughput.

---

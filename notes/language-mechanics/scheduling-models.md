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

## Processes vs Threads

Two common execution units with different isolation and coordination costs.

### Process

- Own memory space and OS resources
- Strong isolation from other processes
- Communication requires IPC (pipes, sockets, shared memory, message queues)

**When it fits**

- CPU-bound workloads that need true parallelism
- Fault isolation between components
- Multi-tenant or security-sensitive boundaries

---

### Thread

- Shares memory space inside one process
- Low communication overhead via shared data
- Requires synchronization (locks, atomics, semaphores)

**When it fits**

- I/O concurrency and request handling
- Workloads with frequent data sharing
- Low-latency in-process coordination

---

## Thread models: OS threads vs green threads

### OS threads (1:1)

- Each runtime thread maps to a kernel thread
- Preemptive scheduling by the operating system
- Good true parallelism on multiple cores

**Tradeoff**

- Higher context-switch overhead and stack memory cost

---

### Green threads (M:N or user-space)

- Managed by language runtime, not directly by kernel
- Usually cooperative at suspension points
- Very lightweight for large concurrent task counts

**Tradeoff**

- Blocking calls can stall progress unless runtime handles non-blocking I/O

**Examples**

- Go goroutines (M:N runtime scheduling)
- Java virtual threads (Loom)
- Erlang processes

---

## Futures and promises

A future/promise is a handle to a value that may not be available yet.

- **Future** usually means "read a result later"
- **Promise** usually means "complete this result" (resolve/reject)

They enable:

- Non-blocking composition of dependent work
- Failure propagation across async boundaries
- Timeout/cancellation wrappers (runtime dependent)

**Common pitfalls**

- Hidden blocking (`get()`/`await` in hot paths)
- Unbounded fan-out (too many concurrent operations)
- Lost errors when tasks are not awaited/observed

---

## Coroutines and async models

Concurrency mechanisms that are **cooperative by design**.

- Execution switches only at explicit suspension points
- No true parallelism unless backed by threads/processes
- Excellent for high I/O concurrency with predictable scheduling points

**Examples**

- JavaScript async/await
- Python asyncio
- Kotlin coroutines

**Common pitfall**

- CPU-heavy work inside coroutine tasks can starve the event loop

---

## Model comparison

| Model              | Isolation                     | Who schedules      | Context switch cost | Parallelism                     | Typical failure mode               |
| ------------------ | ----------------------------- | ------------------ | ------------------- | ------------------------------- | ---------------------------------- |
| **Process**        | Strong (separate memory)      | OS scheduler       | Higher              | Yes                             | IPC bottlenecks, heavy startup     |
| **OS thread**      | Shared process memory         | OS scheduler       | Medium              | Yes                             | Data races, lock contention        |
| **Green thread**   | Shared runtime/process memory | Runtime scheduler  | Low                 | Usually only with runtime+cores | Blocking calls stall many tasks    |
| **Future/Promise** | Depends on executor model     | Runtime + executor | N/A (abstraction)   | Depends on backing model        | Forgotten awaits, fan-out overload |
| **Coroutine**      | Depends on runtime scope      | Runtime scheduler  | Low                 | No by itself                    | Event-loop starvation              |

---

## Repository examples

- FIFO scheduling intuition: [Queue](../../structures/queue/index.ts)
- Priority scheduling intuition: [Heap](../../structures/heap/index.ts)
- Dependency scheduling flow: [Kahn topological sort](../../algorithms/graph/kahn/index.ts)

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

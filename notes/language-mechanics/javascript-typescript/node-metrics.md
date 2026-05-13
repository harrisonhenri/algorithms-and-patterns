---
tags: [nodejs, observability, theory]
title: "Node.js metrics"
---

# Node.js Metrics

> For language-agnostic signals (latency, traffic, errors, DORA) see [common-metrics.md](../common-metrics.md).

Node.js runs on the **V8 engine** with a **single-threaded event loop**. The metrics that matter most are those that expose event loop health, V8 heap behavior, and GC activity.

---

## 1. Heap & Memory Metrics (V8)

| Metric                      | Description                                        | Signal                           |
| --------------------------- | -------------------------------------------------- | -------------------------------- |
| **Heap Used**               | Memory occupied by live JS objects                 | Steady growth → memory leak      |
| **Heap Total**              | V8 heap space allocated from the OS                | Growth → GC expansion            |
| **Heap Size Limit**         | Max heap before OOM crash (`--max-old-space-size`) | Used / Limit > 80% → danger zone |
| **External Memory**         | Memory outside V8 heap (Buffers, native add-ons)   | Growth → native or Buffer leak   |
| **RSS (Resident Set Size)** | Total process memory (heap + stack + native)       | Tracks real OS footprint         |
| **Array Buffers**           | Detached / live ArrayBuffer allocations            | Untracked growth → leak          |

```js
// Built-in snapshot
process.memoryUsage();
// { rss, heapTotal, heapUsed, external, arrayBuffers }
```

---

## 2. Garbage Collection Metrics

V8 uses a **generational GC** (Scavenger for Young Gen, Mark-Sweep/Compact for Old Gen).

| Metric                               | Description                      | Signal                                         |
| ------------------------------------ | -------------------------------- | ---------------------------------------------- |
| **Minor GC (Scavenge) Count / Time** | Young Gen collections            | Frequent → high allocation rate                |
| **Major GC Count / Time**            | Old Gen mark-sweep or compaction | Any long pause → latency spike                 |
| **GC Pause Time**                    | Stop-the-world duration          | > 50 ms → visible latency; > 200 ms → SLO risk |
| **Young Gen Usage**                  | Short-lived object space         | Fast churn is normal                           |
| **Old Gen Usage**                    | Tenured objects                  | Steady growth → objects promoted but not freed |

> Use `--expose-gc` + `perf_hooks.PerformanceObserver` (entry type `'gc'`) to capture GC events.

---

## 3. Event Loop Metrics

The event loop is Node's core scheduler. Blocking it stalls **all** in-flight requests.

| Metric                           | Description                                           | Signal                                                     |
| -------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| **Event Loop Lag**               | Delay between scheduling a callback and its execution | > 10 ms → investigate blocking; > 100 ms → serious problem |
| **Event Loop Utilization (ELU)** | Fraction of time the loop is active vs. idle          | ELU > 0.85 → loop is saturated                             |
| **Active Handles**               | Open sockets, timers, servers                         | Unexpected growth → handle leak                            |
| **Active Requests**              | In-flight async I/O requests                          | Spike without matching responses → stall                   |

```js
const { eventLoopUtilization } = require("perf_hooks").performance;
const start = eventLoopUtilization();
setTimeout(() => console.log(eventLoopUtilization(start)), 1000);
```

---

## 4. Application-Level Metrics

| Metric                            | Description                                                          |
| --------------------------------- | -------------------------------------------------------------------- |
| **Active HTTP connections**       | Open keep-alive connections                                          |
| **Request queue depth**           | Requests buffered before processing                                  |
| **Cache sizes**                   | In-memory caches — oversized → heap pressure                         |
| **Buffer pool usage**             | `Buffer.allocUnsafe` pools — unmanaged → External memory growth      |
| **Worker thread pool saturation** | `libuv` thread pool (`UV_THREADPOOL_SIZE`) — saturated → delayed I/O |

---

## 5. Monitoring & Tooling

| Tool                                  | Purpose                                                          |
| ------------------------------------- | ---------------------------------------------------------------- |
| **`process.memoryUsage()`**           | Built-in heap/RSS snapshot                                       |
| **`perf_hooks` PerformanceObserver**  | Built-in GC and event loop timing                                |
| **`--heap-prof` / `--cpu-prof`**      | Built-in V8 profiling flags (Node 12+)                           |
| **prom-client**                       | Prometheus metrics library for Node.js                           |
| **Prometheus + Grafana**              | Heap, RSS, GC, ELU dashboards                                    |
| **Clinic.js**                         | `clinic doctor` (diagnostics), `clinic flame` (CPU flame graphs) |
| **0x**                                | Flame graph CPU profiler                                         |
| **Datadog / New Relic / Elastic APM** | Full APM with distributed tracing                                |

---

## Key ratios to watch

```
Heap Pressure      = heap_used / heap_size_limit     → alert > 80%
GC Overhead        = gc_pause_time / total_time       → alert > 5%
ELU                = event_loop_active / total        → alert > 0.85
External Growth    = d(external) / dt                 → alert if steadily increasing
```

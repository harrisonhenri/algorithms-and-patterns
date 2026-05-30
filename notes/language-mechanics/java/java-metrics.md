---
tags: [java, jvm, observability, theory]
title: "JVM & Java metrics"
---

# JVM & Java Metrics

> For language-agnostic signals (latency, traffic, errors, DORA) see [common-metrics.md](../common-metrics.md).

---

## 1. JVM Memory Metrics

The JVM divides heap into **generations**. Understanding them is key to diagnosing GC behavior and memory leaks.

| Metric                          | Description                                  | Signal                               |
| ------------------------------- | -------------------------------------------- | ------------------------------------ |
| **Heap Used**                   | Memory occupied by live objects              | Steady growth → leak                 |
| **Heap Committed**              | Reserved heap the OS has granted             | Sudden jumps → GC expansion          |
| **Heap Max**                    | `-Xmx` limit                                 | Used / Max > 80% → GC pressure       |
| **Young Gen (Eden + Survivor)** | Where new objects are allocated              | High churn → frequent Minor GCs      |
| **Old Gen (Tenured)**           | Objects that survived promotions             | High usage → Major/Full GC risk      |
| **Metaspace**                   | Class metadata (replaced PermGen in Java 8+) | Unbounded growth → class loader leak |
| **Non-Heap**                    | Code cache, class data sharing               | Increases with JIT compilation       |

---

## 2. Garbage Collection Metrics

| Metric                    | Description                            | Signal                                     |
| ------------------------- | -------------------------------------- | ------------------------------------------ |
| **Minor GC Count / Rate** | Young Gen collections per second       | High rate → excessive allocation           |
| **Minor GC Pause Time**   | Duration of Young Gen collections      | > a few ms → investigate allocation rate   |
| **Major / Full GC Count** | Old Gen or full-heap collections       | Any is notable — target near-zero          |
| **Full GC Pause Time**    | Stop-the-world duration                | > 500 ms → latency spike; > 1 s → SLO risk |
| **GC Overhead %**         | % of CPU time spent in GC              | > 5% is a warning; > 10% is critical       |
| **Promotion Rate**        | Rate at which objects move Young → Old | High rate → objects living too long        |
| **Allocation Rate**       | New object allocation per second       | Excessive → GC pressure                    |

> Use G1GC (Java 9+ default) or ZGC/Shenandoah for sub-millisecond pause targets.

---

## 3. Thread & Concurrency Metrics

| Metric                              | Description                        | Signal                            |
| ----------------------------------- | ---------------------------------- | --------------------------------- |
| **Thread Count**                    | Total live threads                 | Unbounded growth → thread leak    |
| **Daemon vs Non-Daemon Threads**    | Threads that block JVM shutdown    | Non-daemon leak → JVM won't exit  |
| **Blocked Threads**                 | Threads waiting on a monitor       | High count → lock contention      |
| **Thread Pool Active / Queue Size** | Executor service utilization       | Queue growth → processing lag     |
| **Deadlock Count**                  | Cycles of mutually waiting threads | Any > 0 → immediate investigation |

---

## 4. Class Loading Metrics

| Metric               | Description                    | Signal                                      |
| -------------------- | ------------------------------ | ------------------------------------------- |
| **Loaded Classes**   | Total classes currently loaded | Unbounded growth → class loader leak        |
| **Unloaded Classes** | Cumulative unloaded classes    | Low ratio vs. loaded → classes not released |

---

## 5. JIT Compilation Metrics

| Metric               | Description                                                    |
| -------------------- | -------------------------------------------------------------- |
| **Compilation Time** | Total time spent by JIT compiler                               |
| **Code Cache Used**  | Compiled code stored by JIT                                    |
| **Deoptimizations**  | JIT reverts to interpreted mode — too many → performance cliff |

---

## 6. Application-Level Metrics (Spring / Java)

| Metric                    | Description                                          |
| ------------------------- | ---------------------------------------------------- |
| **HTTP Request Duration** | p50/p95/p99 per endpoint                             |
| **JDBC / DB Pool Active** | Active connections vs. pool max                      |
| **DB Pool Pending**       | Requests waiting for a connection — > 0 is a warning |
| **Cache Hit Ratio**       | For Caffeine, EhCache, Redis client                  |
| **Message Consumer Lag**  | For Kafka / RabbitMQ consumers                       |

---

## 7. Monitoring & Tooling

| Tool                                  | Purpose                                                     |
| ------------------------------------- | ----------------------------------------------------------- |
| **Micrometer**                        | Vendor-neutral metrics facade (Spring Boot Actuator)        |
| **Prometheus JVM Client**             | JVM metrics exporter for Prometheus                         |
| **Grafana JVM Dashboard**             | Pre-built dashboards for heap, GC, threads                  |
| **JFR (Java Flight Recorder)**        | Low-overhead continuous profiling built into the JDK        |
| **Async Profiler**                    | CPU / allocation / lock profiling with flame graphs         |
| **JVisualVM / JConsole**              | GUI tools for live JMX monitoring                           |
| **JMX**                               | Standard JDK management interface for all the metrics above |
| **Datadog / New Relic / Elastic APM** | Full APM with distributed tracing for Java                  |

---

## Key ratios to watch

```
Heap Utilization    = heap_used / heap_max          → alert > 80%
GC Overhead         = gc_time / total_time           → alert > 5%
Thread Pool Load    = active_threads / pool_size     → alert > 90%
DB Pool Saturation  = pending_requests / pool_size   → alert > 0
```

---
tags: [nodejs, observability, theory]
title: "Node.js and engineering metrics"
---
# Engineering/JS important metrics

## 1. System Reliability & Delivery Metrics

| Metric | Description | Why It Matters |
| --- | --- | --- |
| **Latency** | Time taken to serve a request | Directly affects user experience |
| **Throughput** | How many messages (or bytes) can be processed per second | Directly affects user experience |
| **Traffic** | Demand on the system (req/s, QPS) | Helps with capacity planning |
| **Errors** | Rate of failed requests | Indicates reliability problems |
| **Saturation** | Resource usage (CPU, memory, queues) | Predicts overload conditions |
| **Deployment Frequency** | How often code is released to production | Higher frequency → faster iteration |
| **Lead Time for Changes** | Time from commit to production | Shorter lead time → agility |
| **Change Failure Rate** | % of deployments causing incidents | Lower rate → safer releases |
| **Mean Time to Recovery (MTTR)** | Time to restore service after failure | Lower MTTR → resilience |

## 2. Heap & Memory Metrics

| Metric | Description | Importance |
| --- | --- | --- |
| **Heap Used** | Memory used by live objects | Growth → possible memory leak |
| **Heap Total / Capacity** | Allocated heap space | Growth → GC pressure or memory expansion |
| **External Memory** | Allocated outside V8 (Buffers, native add-ons) | Can cause OOM even if heap looks fine |
| **RSS (Resident Set Size)** | Process memory (heap + stack + native) | Shows overall memory footprint |
| **GC Count / Time** | Number & duration of GCs | Frequent/long → latency spikes |
| **Young vs Old Generation Usage** | Memory in short/long-lived generations | Survivors in old gen → long-term leaks |

## 3. CPU & Event Loop Metrics

| Metric | Why It Matters |
| --- | --- |
| **Event Loop Lag** | High lag → blocking code or GC pauses |
| **CPU Usage** | High CPU → object churn, inefficient loops |
| **GC Pause Time** | Long pauses → request latency spikes |

## 4. Application-Level Metrics

- **Active requests / connections** – monitor per-request memory allocation
- **Cache sizes** – oversized caches → memory pressure
- **Buffer usage** – unmanaged buffers → leaks outside V8 heap

## 5. Monitoring & Tools

- **Node.js built-ins:** `process.memoryUsage()`, `perf_hooks`
- **Prometheus + Grafana:** heap, RSS, GC, event loop lag dashboards
- **APM tools:** New Relic, Datadog, Elastic APM for distributed tracing
- **Profiling:** Clinic.js (`clinic doctor`, `clinic flame`) for runtime diagnostics

This way you have **end-to-end visibility**:

- **(1) Delivery & system health** (SRE + DORA)
- **(2–4) Runtime behavior** (Node.js internals)
- **(5) Tooling** for observability

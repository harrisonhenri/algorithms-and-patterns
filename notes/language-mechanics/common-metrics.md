---
tags: [observability, theory, sre]
title: "Common engineering metrics (language agnostic)"
---

# Common Engineering Metrics

These metrics apply regardless of language or runtime. They form the foundation of **SRE** (using the four Golden Signals) and **DevOps** (using the DORA metrics).

---

## 1. The Four Golden Signals (SRE)

Coined by Google's SRE book — the minimum set of signals needed to reason about any service.

| Signal         | Description                                              | Why It Matters                                 |
| -------------- | -------------------------------------------------------- | ---------------------------------------------- |
| **Latency**    | Time to serve a request (p50, p95, p99)                  | Directly affects user experience               |
| **Traffic**    | Demand on the system (req/s, QPS, messages/s)            | Capacity planning and scaling decisions        |
| **Errors**     | Rate of failed requests (5xx, timeouts, exceptions)      | Indicates reliability and correctness problems |
| **Saturation** | How "full" key resources are (CPU, memory, queues, disk) | Predicts overload and degradation              |

> Track **percentiles** (p95, p99), not just averages — averages hide tail latency.

---

## 2. DORA Metrics (Delivery Performance)

The four metrics from the [DORA research program](https://dora.dev/) that best predict software delivery performance and organizational outcomes.

| Metric                           | Description                                           | Elite Benchmark          |
| -------------------------------- | ----------------------------------------------------- | ------------------------ |
| **Deployment Frequency**         | How often code is released to production              | On-demand (multiple/day) |
| **Lead Time for Changes**        | Time from commit to serving in production             | < 1 hour                 |
| **Change Failure Rate**          | % of deployments that cause a degradation or incident | 0–15%                    |
| **Mean Time to Recovery (MTTR)** | Time to restore service after a failure               | < 1 hour                 |

> High performers score well on all four — they are not trade-offs. Faster delivery **and** higher stability reinforce each other.

---

## 3. Availability & Reliability

| Metric              | Description                                                           |
| ------------------- | --------------------------------------------------------------------- |
| **Availability**    | `uptime / (uptime + downtime)` — often expressed as SLA (e.g., 99.9%) |
| **Error Budget**    | `1 - SLO` — how much unreliability you can afford in a period         |
| **SLI / SLO / SLA** | Indicator / Objective / Agreement — the contract around reliability   |
| **MTTF**            | Mean Time to Failure — average uptime between failures                |
| **MTBF**            | Mean Time Between Failures — `MTTF + MTTR`                            |

---

## 4. Resource Utilization

| Metric           | Description                                                       |
| ---------------- | ----------------------------------------------------------------- |
| **CPU Usage**    | % of CPU consumed — sustained > 80% is a saturation signal        |
| **Memory Usage** | RAM consumed — watch for steady growth (leaks)                    |
| **Disk I/O**     | Read/write throughput and IOPS — relevant for DB-heavy services   |
| **Network I/O**  | Bytes in/out — relevant for high-throughput or streaming services |

---

## 5. Queue & Backpressure Metrics

| Metric              | Description                                                         |
| ------------------- | ------------------------------------------------------------------- |
| **Queue Depth**     | Number of pending items — growth points to consumer lag             |
| **Consumer Lag**    | How far behind consumers are vs. producers (e.g., Kafka offset lag) |
| **Processing Rate** | Items processed per second                                          |
| **Rejection Rate**  | Items dropped or rejected due to capacity limits                    |

---

## Data Units Reference

![image.png](../assets/miscellaneous/basic-units.png)

Understanding data units is essential for capacity planning, performance estimation, and resource allocation. The table above shows how data units scale from individual bits up to terabytes, helping developers reason about storage requirements.

---

## Further reading

- [Google SRE Book — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [DORA Research](https://dora.dev/)
- [The USE Method (Brendan Gregg)](https://www.brendangregg.com/usemethod.html) — Utilization, Saturation, Errors per resource

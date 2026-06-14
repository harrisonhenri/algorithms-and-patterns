---
tags:
  [system-design, interview-prep, distributed-systems, reliability, performance]
title: "System design interview core concepts"
---

# System design interview core concepts

A compact interview guide focused on tradeoffs, not buzzwords. Use this as a decision cheat sheet, then jump to deep dives.

---

## 1) Scaling and consistency

### Vertical vs horizontal scaling

| Option                 | What you gain                        | What you pay                                         |
| ---------------------- | ------------------------------------ | ---------------------------------------------------- |
| **Vertical scaling**   | Simpler architecture and operations  | Hard upper limits, bigger blast radius               |
| **Horizontal scaling** | Elastic capacity and fault isolation | Coordination complexity, data consistency challenges |

### CAP theorem (during partitions)

**During network partitions, choose:** Consistency (reject requests) **or** Availability (serve stale data). See [consensus-and-replication.md#cap-theorem](./consensus-and-replication.md#cap-theorem) for detailed discussion.

**Quick rule of thumb:**

- **CP** (Consistency-first): Financial ledgers, coordination services → reject requests during partitions
- **AP** (Availability-first): Social feeds, timelines → keep serving, accept temporary divergence

### PACELC (beyond partitions)

Extension of CAP: **P**artition (choose **A**vailability or **C**onsistency) **E**lse (choose **L**atency or **C**onsistency). See [consensus-and-replication.md#cap-theorem](./consensus-and-replication.md#cap-theorem) for detailed analysis.

### ACID vs BASE

**ACID** prioritizes correctness; **BASE** prioritizes availability and performance. See [transactions-and-concurrency.md](./transactions-and-concurrency.md) for detailed coverage of ACID properties and consistency models.

**Quick comparison:**

| Model    | Best for                                   | Main tradeoff                                 |
| -------- | ------------------------------------------ | --------------------------------------------- |
| **ACID** | Payments, inventory, critical invariants   | Throughput/latency under strict transactions  |
| **BASE** | Feeds, analytics, high-scale async systems | Eventual consistency and reconciliation logic |

Deep dives:

- [Consistency, consensus, and replication](./consensus-and-replication.md)
- [Transactions and concurrency](./transactions-and-concurrency.md)

---

## 2) Performance and architecture

### Throughput vs latency

- **Throughput**: how much work per unit time (req/s, msg/s)
- **Latency**: how long one request takes (p50/p95/p99)

You can improve throughput while making latency worse, and vice versa.

### Common optimization levers

**For throughput**

- Batch operations
- Async processing
- Connection pooling

**For latency**

- Cache hot reads
- Reduce network hops
- Place content close to users (CDN/edge)

### Amdahl's Law (parallelism limit)

If fraction $S$ is strictly serial, max speedup is:

$$
\text{speedup}_{max} = \frac{1}{S}
$$

If $S = 0.1$, best-case speedup is $10\times$ no matter how many cores are added.

### Architectural choices that show up in interviews

- Monolith vs microservices
- Stateful vs stateless servers
- Serverless functions (operational simplicity vs cold starts and provider constraints)

Deep dives:

- [Distributed systems fundamentals](./reliability-and-networking.md)
- [Event-driven architecture](./event-driven-architecture.md)

---

## 3) Database and storage

### Sharding

Partition data by a stable, high-cardinality key.

- Good shard key: user/account IDs with balanced distribution
- Risky shard key: monotonically increasing timestamps causing hotspots

### Replication

**See** [consensus-and-replication.md#linearizability-in-different-replication-models](./consensus-and-replication.md#linearizability-in-different-replication-models) **for detailed analysis of replication models and their consistency guarantees.**

| Pattern             | Strength                        | Risk                             |
| ------------------- | ------------------------------- | -------------------------------- |
| **Primary-replica** | Simple write path, read scaling | Replica lag, failover complexity |
| **Multi-primary**   | Regional write locality         | Conflict resolution complexity   |
| **Leaderless**      | High availability               | Consistency challenges           |

### Indexing and write path

- **B-tree**: strong for read-heavy and range-heavy workloads
- **LSM tree**: strong for write-heavy ingestion and compaction-based storage
- **WAL**: durability anchor before applying in-place/derived changes

### Normalization vs denormalization

- Normalize for consistency and update correctness
- Denormalize for query speed and read simplicity
- Most large systems mix both, guided by access patterns

Deep dive:

- [Databases and storage](./databases-and-storage.md)

---

## 4) Caching and messaging

### Caching strategies

| Strategy          | Behavior                                      | Tradeoff                                       |
| ----------------- | --------------------------------------------- | ---------------------------------------------- |
| **Cache-aside**   | App reads DB on miss and populates cache      | Stale-read handling is app responsibility      |
| **Write-through** | Write cache and DB together                   | Better consistency, higher write latency       |
| **Write-back**    | Acknowledge write to cache first, flush later | Faster writes, durability and consistency risk |

### Eviction policies

- **LRU** works well for temporal locality
- **LFU** helps with skewed popularity distributions

### Queues, pub-sub, and DLQ

- Queue: decouple producer/consumer rates and absorb bursts
- Pub-sub: one event to many subscribers
- DLQ: isolate poison messages after retry budget

Deep dives:

- [Event-driven architecture](./event-driven-architecture.md)
- [Pattern selection guide](../integration-patterns/pattern-selection-guide.md)

---

## 5) Reliability and observability

### Traffic and failure protection

- **Rate limiting** (token bucket/leaky bucket) to control overload
- **Circuit breaker** to avoid cascading failures
- **Retries with exponential backoff + jitter** to smooth recovery behavior
- **Prefer delayed retries** over immediate retries under failure storms to reduce synchronized retry spikes
- **Timeout as an event** for long-running workflows (schedule timeout checks instead of periodic scans)

Reference retry shape:

```python
sleep = (2 ** attempt) + random.uniform(0, 1)
```

### Coordination and distributed workflows

- **Leader election** — See [consensus-and-replication.md#consensus-algorithms](./consensus-and-replication.md#consensus-algorithms) for Raft-like systems achieving single-writer/coordination safety
- **SAGA** — See [transactions-and-concurrency.md#saga-pattern](./transactions-and-concurrency.md#saga-pattern) for cross-service transaction orchestration with compensating actions

### Observability triad

- **Metrics** for trend/health
- **Logs** for event detail
- **Traces** for cross-service request flow

Deep dives:

- [Distributed systems fundamentals](./reliability-and-networking.md)
- [Transactions and concurrency](./transactions-and-concurrency.md)

---

## Practical interview framing

When presenting a design, explicitly state:

1. Workload shape (read/write ratio, latency SLO, growth assumptions)
2. Chosen tradeoff (for example: "AP + eventual consistency for timeline reads")
3. Failure behavior (timeouts, retries, circuit breaking, fallback mode)
4. Migration path (how design evolves at 10x load)

Interview quality usually improves more from clear tradeoff reasoning than from listing many tools.

---

## Repository examples

- FIFO and buffering intuition: [Queue](../../structures/queue/index.ts)
- Priority scheduling intuition: [Heap](../../structures/heap/index.ts)
- Dependency scheduling intuition: [Kahn topological sort](../../algorithms/graph/kahn/index.ts)

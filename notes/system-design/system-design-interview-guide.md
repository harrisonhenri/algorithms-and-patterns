---
tags:
  [
    system-design,
    interview-prep,
    distributed-systems,
    scalability,
    reliability,
    performance,
    architecture-evolution,
  ]
title: "System design interview guide"
---

# System design interview guide

A practical system design interview guide focused on:

- bottleneck identification
- tradeoff reasoning
- architectural evolution
- reliability under failure
- scaling patterns used in real systems

The goal is not to memorize technologies or design a globally distributed system on day one.

Strong system design discussions usually demonstrate:

- understanding of workload shape
- awareness of operational constraints
- clear tradeoff reasoning
- incremental architectural evolution

---

# 1. Interview framing strategy

When presenting a design:

1. Define the workload
2. Identify bottlenecks
3. Explain tradeoffs
4. Introduce targeted architectural improvements
5. Describe failure handling
6. Explain how the system evolves at larger scale

Good interview answers usually optimize for clarity and reasoning more than complexity.

---

## Workload framing

Always clarify assumptions:

- read/write ratio
- expected traffic
- latency requirements
- consistency requirements
- storage growth
- traffic distribution
- peak vs average load

Example:

```text
Read-heavy social feed
- High availability
- Eventual consistency acceptable
- Low-latency reads prioritized
```

---

## Tradeoff framing

Explicitly state architectural choices.

Examples:

```text
"We choose AP + eventual consistency for timeline reads."

"We use asynchronous processing to improve responsiveness."

"We optimize for read scalability using caching and replicas."
```

---

# 2. Framework for system design interviews

## Goal

The interviewer evaluates how you think, not whether you produce the "perfect architecture".

Communication, tradeoffs, and collaboration matter more than the final solution.

---

## Step 1 — Understand the problem (3–10 min)

Do not start designing immediately.

Clarify:

- functional requirements
- non-functional requirements
- scale (users, QPS, storage)
- constraints
- existing infrastructure
- assumptions

Typical questions:

- What features are required?
- How many users are expected?
- What is the expected growth?
- What are the latency requirements?
- What are the consistency requirements?

Goal:

- define scope before proposing a solution

---

## Step 2 — High-level design (10–15 min)

Present an initial architecture and validate it with the interviewer.

Usually include:

- clients
- APIs
- load balancer
- application servers
- database
- cache
- CDN
- message queue

Also:

- perform rough capacity estimation
- walk through important use cases
- gather feedback early

Goal:

- build the architecture collaboratively

---

## Step 3 — Deep dive (10–25 min)

Focus on the most critical components.

Possible discussion topics:

- database schema
- scaling strategy
- bottlenecks
- caching
- algorithms
- data consistency
- failure handling

Avoid spending too much time on unimportant implementation details.

Goal:

- demonstrate engineering depth where it matters

---

## Step 4 — Wrap up (3–5 min)

Discuss:

- bottlenecks
- failure scenarios
- monitoring
- future scalability
- possible improvements

End by summarizing the design.

Goal:

- show critical thinking and awareness that no design is perfect

---

## Interview dos

- clarify requirements first
- think aloud
- discuss tradeoffs
- collaborate with the interviewer
- prioritize important components
- ask for feedback frequently

---

## Interview don'ts

- do not jump directly into implementation
- do not assume requirements
- do not dive into details too early
- do not stay silent
- do not over-engineer

---

## Time allocation

| Step              | Time      |
| ----------------- | --------- |
| Understand        | 3–10 min  |
| High-level design | 10–15 min |
| Deep dive         | 10–25 min |
| Wrap up           | 3–5 min   |

---

# 3. Core scaling concepts

## Vertical vs horizontal scaling

| Option                 | What you gain                        | What you pay                                       |
| ---------------------- | ------------------------------------ | -------------------------------------------------- |
| **Vertical scaling**   | Simpler architecture and operations  | Hard upper limits, larger blast radius             |
| **Horizontal scaling** | Elastic capacity and fault isolation | Coordination complexity and consistency challenges |

---

## Vertical scaling (Scale Up)

Increase machine capacity:

- more CPU
- more RAM
- larger disks

Advantages:

- simple operationally
- minimal architecture changes
- easier debugging

Problems:

- hardware limits
- expensive upgrades
- single point of failure remains

---

## Horizontal scaling (Scale Out)

Add more servers.

```text
Users
  ↓
+------+------+------+
| Web | Web | Web |
+------+------+------+
```

Advantages:

- redundancy
- fault tolerance
- elastic growth
- improved availability

Horizontal scaling becomes necessary at large scale.

---

## Throughput vs latency

### Throughput

Amount of work completed per unit time.

Examples:

- requests/sec
- messages/sec
- jobs/sec

### Latency

Time required to complete one request.

Examples:

- p50
- p95
- p99 response times

Improving throughput can worsen latency and vice versa.

---

## Common optimization levers

### Throughput optimization

- batching
- asynchronous processing
- connection pooling
- partitioning

### Latency optimization

- caching
- reducing network hops
- CDN usage
- colocating services

---

## Amdahl's Law

If fraction `S` of a workload is strictly serial:

```text
max_speedup = 1 / S
```

Example:

```text
S = 0.1
Maximum theoretical speedup = 10x
```

Parallelism has diminishing returns when serial bottlenecks remain.

---

# 4. Consistency and distributed systems tradeoffs

## CAP theorem

During network partitions, distributed systems must choose between:

- Consistency
- Availability

### CP systems

Prioritize consistency.

Behavior:

- reject requests during partitions
- preserve correctness

Examples:

- financial ledgers
- coordination systems

### AP systems

Prioritize availability.

Behavior:

- continue serving requests
- tolerate temporary inconsistency

Examples:

- social feeds
- recommendation systems

See:
[consensus-and-replication.md#cap-theorem](./consensus-and-replication.md#cap-theorem)

---

## PACELC theorem

Beyond partitions:

```text
If Partition:
  choose Availability or Consistency

Else:
  choose Latency or Consistency
```

Even without partitions, distributed systems trade consistency for latency.

---

## ACID vs BASE

| Model    | Best for                                  | Main tradeoff                                 |
| -------- | ----------------------------------------- | --------------------------------------------- |
| **ACID** | Payments, inventory, strict invariants    | Lower scalability and higher coordination     |
| **BASE** | Feeds, analytics, async distributed flows | Eventual consistency and reconciliation logic |

### ACID systems prioritize

- correctness
- transactional guarantees
- strong consistency

### BASE systems prioritize

- availability
- scalability
- eventual consistency

See:
[transactions-and-concurrency.md](./transactions-and-concurrency.md)

---

# 5. Architectural evolution patterns

Large systems typically evolve incrementally.

Common progression:

```text
Single server
  ↓
Separate DB
  ↓
Load balancer
  ↓
Replication
  ↓
Cache
  ↓
Queue
  ↓
Sharding
  ↓
Multi-region
```

The goal is to solve the current bottleneck without prematurely introducing complexity.

---

# 6. Single server architecture

Initially everything often runs on one machine.

```text
Client
  ↓
Single Server
  ├── Web App
  ├── API
  ├── Database
  └── Cache
```

---

## Why this works initially

Advantages:

- extremely simple
- cheap
- fast iteration
- low operational overhead
- easy deployment

Early-stage systems benefit more from simplicity than scalability.

---

## Typical request flow

1. Client resolves DNS
2. DNS returns server IP
3. Client sends HTTP request
4. Server processes request
5. Server returns response

---

## Limitations

As traffic grows:

- CPU contention appears
- memory pressure increases
- database competes for resources
- maintenance impacts the entire system
- single points of failure emerge

Eventually one machine becomes insufficient.

---

# 7. Splitting application and database tiers

The first major scaling step is separating responsibilities.

```text
           ┌──────────────┐
           │  Web Server  │
           └──────┬───────┘
                  │
                  ▼
           ┌──────────────┐
           │   Database   │
           └──────────────┘
```

Now:

- application servers handle business logic
- database servers focus on persistence

---

## Benefits

- independent scaling
- better resource isolation
- easier operational tuning
- improved reliability

---

## Database selection

### Relational databases (SQL)

Examples:

- PostgreSQL
- MySQL
- Oracle

Best for:

- transactional systems
- structured relationships
- strong consistency

### NoSQL databases

Examples:

- Cassandra
- DynamoDB
- MongoDB
- Redis

Best for:

- massive scale
- flexible schemas
- low-latency workloads
- distributed systems

See:
[databases-and-storage.md](./databases-and-storage.md)

---

# 8. Load balancers and stateless services

Once multiple application servers exist, traffic must be distributed.

```text
Users
   ↓
Load Balancer
   ↓
+------+------+
|             |
Web1        Web2
```

---

## Benefits

Load balancers improve:

- availability
- failover
- resource utilization
- operational flexibility

If one server fails, traffic shifts automatically.

---

## Stateful vs stateless servers

### Stateful servers

Problematic pattern:

```text
User session stored on web server
```

Problems:

- sticky sessions
- difficult failover
- uneven traffic distribution
- scaling complexity

---

## Stateless pattern

Move state outside application servers.

Possible storage:

- Redis
- databases
- distributed session stores
- JWTs

Benefits:

- autoscaling
- easier deployments
- simpler failover
- better resilience

Any server can process any request.

---

# 9. Replication and consistency

Eventually one database becomes overloaded.

A common solution is primary-replica replication.

```text
          Primary
         (Writes)

      /      |      \
 Replica  Replica  Replica
 (Reads)  (Reads)  (Reads)
```

---

## Responsibilities

### Primary handles

- INSERT
- UPDATE
- DELETE

### Replicas handle

- SELECT queries

---

## Benefits

### Better read scalability

Reads distribute across replicas.

### Better availability

Replica can replace failed primary.

### Better fault tolerance

Data exists on multiple machines.

---

## Replication models

| Pattern             | Strength                        | Risk                             |
| ------------------- | ------------------------------- | -------------------------------- |
| **Primary-replica** | Simple write path, read scaling | Replica lag, failover complexity |
| **Multi-primary**   | Regional write locality         | Conflict resolution complexity   |
| **Leaderless**      | High availability               | Consistency challenges           |

---

## Challenges

- replica lag
- failover complexity
- split-brain risks
- consistency tradeoffs

See:
[consensus-and-replication.md](./consensus-and-replication.md)

---

# 10. Caching

Databases eventually become bottlenecks.

Caching reduces load by storing frequently accessed data in memory.

```text
Client
   ↓
Cache
   ↓
Database
```

Typical flow:

1. Check cache
2. Cache hit → return immediately
3. Cache miss → query database
4. Store result in cache

---

## When caching works well

Best for:

- read-heavy workloads
- hot data
- expensive queries

---

## Caching strategies

| Strategy          | Behavior                                      | Tradeoff                                       |
| ----------------- | --------------------------------------------- | ---------------------------------------------- |
| **Cache-aside**   | App reads DB on miss and populates cache      | Stale-read handling becomes app responsibility |
| **Write-through** | Write cache and DB together                   | Better consistency, higher write latency       |
| **Write-back**    | Acknowledge write to cache first, flush later | Faster writes, durability and consistency risk |

---

## Eviction policies

- LRU works well for temporal locality
- LFU works well for skewed popularity

---

## Cache tradeoffs

### Expiration tuning

Too short:

- higher DB load

Too long:

- stale data

### Consistency

Cache and DB may diverge temporarily.

### Availability

A single cache server can become a bottleneck.

---

# 11. CDN and edge delivery

Static assets become expensive to serve globally.

Examples:

- images
- CSS
- JavaScript
- videos

CDNs move content closer to users.

```text
User
  ↓
Nearest CDN Edge
  ↓
Origin Server
```

---

## Benefits

- lower latency
- reduced origin load
- improved user experience

---

## Common CDN concerns

- cache invalidation
- TTL configuration
- regional routing
- asset versioning
- cost management

Example:

```text
logo.png?v=2
```

---

# 12. Messaging and asynchronous processing

Synchronous systems eventually become tightly coupled.

Message queues decouple producers and consumers.

```text
Producer
   ↓
Queue
   ↓
Consumer
```

---

## Benefits

- buffering
- independent scaling
- failure isolation
- reliability

---

## Example: image processing

Instead of processing uploads synchronously:

```text
Upload
  ↓
Queue
  ↓
Workers
  ↓
Image Processing
```

Users receive fast responses while workers process asynchronously.

---

## Queues vs pub-sub

### Queue

One consumer processes each message.

Good for:

- background jobs
- task distribution
- buffering spikes

### Pub-sub

One event fan-outs to many consumers.

Good for:

- event-driven systems
- analytics pipelines
- notifications

---

## Dead letter queues (DLQ)

DLQs isolate poison messages after retries fail.

Benefits:

- protects pipelines
- improves debugging
- prevents infinite retry loops

See:
[event-driven-architecture.md](./event-driven-architecture.md)

---

# 13. Reliability patterns

As systems grow, failure becomes normal.

Assume:

- machines fail
- networks partition
- replicas lag
- retries happen
- clocks drift

Distributed systems are fundamentally failure-oriented systems.

---

## Rate limiting

Protect systems from overload.

Common algorithms:

- token bucket
- leaky bucket

---

## Circuit breakers

Prevent cascading failures.

Behavior:

- stop calling unhealthy services
- fail fast
- recover gradually

---

## Retries with backoff and jitter

Immediate retries can amplify outages.

Preferred pattern:

```python
sleep = (2 ** attempt) + random.uniform(0, 1)
```

Benefits:

- smoother recovery
- reduced retry storms
- better resilience

---

## Timeout handling

Treat timeouts as events in long-running workflows instead of repeatedly scanning for expired operations.

---

## Coordination patterns

### Leader election

Used when one node must coordinate writes or scheduling.

See:
[consensus-and-replication.md#consensus-algorithms](./consensus-and-replication.md#consensus-algorithms)

### SAGA pattern

Coordinates distributed workflows using compensating actions.

See:
[transactions-and-concurrency.md#saga-pattern](./transactions-and-concurrency.md#saga-pattern)

---

# 14. Observability and operations

As systems grow, debugging becomes harder.

Observability becomes mandatory.

---

## Observability triad

### Metrics

Used for:

- health monitoring
- trend analysis
- alerting

Examples:

- CPU
- memory
- latency
- throughput
- error rates

### Logs

Capture:

- errors
- stack traces
- audit trails
- debugging details

### Traces

Track requests across distributed systems.

Useful for:

- latency analysis
- dependency debugging
- bottleneck detection

---

## Business metrics

Examples:

- DAU
- retention
- revenue
- conversion rate

---

## Automation

Examples:

- CI/CD
- infrastructure-as-code
- automated testing
- deployment automation
- autoscaling

See:
[reliability-and-networking.md](./reliability-and-networking.md)

---

# 15. Database scaling and sharding

Eventually one database machine becomes insufficient.

Horizontal partitioning distributes data across multiple shards.

Example:

```text
user_id % 4

0 → Shard0
1 → Shard1
2 → Shard2
3 → Shard3
```

---

## Shard key selection

Good shard keys:

- distribute load evenly
- minimize hotspots
- support query patterns

Bad shard keys create:

- skew
- hotspots
- operational complexity

---

## Common challenges

### Resharding

Adding or removing shards requires redistribution.

### Hotspots

Some shards receive disproportionate traffic.

### Cross-shard queries

Distributed joins become expensive.

---

## Common solutions

- consistent hashing
- denormalization
- partition-aware routing
- caching

---

## Indexing and storage engines

### B-tree

Strong for:

- range scans
- read-heavy workloads

### LSM tree

Strong for:

- write-heavy ingestion
- compaction-oriented storage

### WAL

Write-ahead logs provide durability before applying changes.

See:
[databases-and-storage.md](./databases-and-storage.md)

---

# 16. Multi-region systems

As systems become global, one datacenter becomes insufficient.

```text
Europe Users
    ↓
EU Region

US Users
    ↓
US Region
```

Traffic is often routed using:

- GeoDNS
- edge routing
- regional load balancing

---

## Benefits

- lower latency
- disaster recovery
- regional redundancy
- regulatory compliance

---

## Challenges

- replication latency
- deployment coordination
- consistency management
- operational complexity

See:
[reliability-and-networking.md](./reliability-and-networking.md)

---

# 17. Monoliths, microservices, and serverless

## Monoliths

Advantages:

- simpler deployment
- easier local development
- lower operational overhead

Problems at scale:

- slower deployments
- tight coupling
- scaling inefficiencies

---

## Microservices

Advantages:

- independent scaling
- team autonomy
- service isolation

Tradeoffs:

- distributed complexity
- network failures
- observability challenges
- operational overhead

---

## Serverless

Advantages:

- operational simplicity
- automatic scaling
- pay-per-use economics

Tradeoffs:

- cold starts
- provider constraints
- execution limits

---

# 18. Typical mature large-scale architecture

A mature large-scale system often includes:

```text
Users
  ↓
CDN
  ↓
Load Balancer
  ↓
Stateless App Servers
  ↓
Cache
  ↓
Message Queue
  ↓
Services / Workers
  ↓
Sharded Databases
       ↓
Replication
```

Additional layers commonly include:

- distributed tracing
- service discovery
- autoscaling
- multi-region deployment
- infrastructure automation

---

# 19. Architectural evolution principles

## 1. Scale incrementally

Do not build globally distributed systems prematurely.

Introduce complexity only when bottlenecks justify it.

---

## 2. Remove single points of failure

As traffic grows:

- replicate services
- add redundancy
- isolate failures

---

## 3. Keep services stateless

Stateless systems:

- scale more easily
- recover faster
- simplify deployments

---

## 4. Prefer asynchronous workflows

Queues improve:

- resilience
- throughput
- decoupling

---

## 5. Cache aggressively

Most large systems are read-heavy.

Caching dramatically improves latency and reduces database pressure.

---

## 6. Partition before you absolutely need to

Sharding migrations become harder as systems grow.

---

## 7. Optimize for failure

Reliable systems are designed assuming failure is inevitable.

---

# Visual cheat sheets

![image.png](../assets/microservices/system-design-cheat-sheet-1.png)
![image.png](../assets/microservices/system-design-cheat-sheet-2.png)

---

# Repository examples

- FIFO and buffering intuition: [Queue](../../structures/queue/index.ts)
- Priority scheduling intuition: [Heap](../../structures/heap/index.ts)
- Dependency scheduling intuition: [Kahn topological sort](../../algorithms/graph/kahn/index.ts)

---

# Recommended deep dives

- [Consensus and replication](./consensus-and-replication.md)
- [Databases and storage](./databases-and-storage.md)
- [Distributed systems algorithms](./distributed-systems-algorithms.md)
- [Event-driven architecture](./event-driven-architecture.md)
- [Reliability and networking](./reliability-and-networking.md)
- [Transactions and concurrency](./transactions-and-concurrency.md)

---
tags: [system-design, aws, interview-prep, gotchas, cheat-sheet, cloud]
title: "AWS Services — Interview Gotchas"
---

# AWS Services — Interview Gotchas

> This note does not explain AWS services in detail. The focus is on the specific details, traps, and architectural decisions that frequently come up in system design interviews.

---

# Storage

## S3

### When to Choose

- Image uploads
- Videos
- PDFs
- Backups
- Static files
- Data Lake
- Logs

---

### Gotchas

#### Presigned URLs

One of the most common interview questions.

**Wrong:**

```
Client → Backend → S3
```

Problems: backend becomes a bottleneck, higher bandwidth cost, increased latency, scales poorly.

**Correct:**

```
Client → Backend (generates Presigned URL) → Client → S3
```

The backend only: authenticates, authorizes, and generates the temporary URL.

Common use cases: photo uploads, videos, attachments, documents.

---

#### Multipart Upload

Required above 5 GB. In practice, worth using above ~100 MB.

Benefits:

- Parallel upload
- Retry per part
- Higher throughput

---

#### Object Versioning ≠ Object Lock

- **Versioning** → keeps multiple versions.
- **Object Lock** → prevents deletion.

These are independent features.

---

#### Glacier Vault Lock (WORM)

Classic interview question. Implements Write Once Read Many.

After applied: nobody can alter or remove the data — not even administrators.

Used in: auditing, finance, compliance.

---

#### Replication

- **CRR** — Cross Region Replication.
- **SRR** — Same Region Replication.

Important: replication only applies automatically to **new** objects. Existing objects require **S3 Batch Replication**.

---

#### S3 Is Not a Filesystem

S3 is Object Storage. If you need mount, real directories, or POSIX semantics, use **EFS** or **FSx**.

---

#### Events

S3 sends events to: Lambda, SNS, SQS Standard, EventBridge.

It **never** sends events directly to **SQS FIFO**.

---

#### Consistency

Today S3 has **Strong Read After Write** consistency. It is no longer eventually consistent as it was before 2020.

---

# Databases

---

## RDS

### When to Choose

Ideal for: SQL, JOINs, ACID, transactions, strong consistency.

Examples: orders, payments, ERP, financial systems.

### Gotchas

#### Multi-AZ Does NOT Scale

Very common mistake.

Multi-AZ exists for: availability and failover. It does **not** increase throughput.

#### Read Replica

Used to scale reads. Does not replace Multi-AZ. Does not perform automatic failover (in traditional RDS).

#### Replica Lag

Read Replicas use **asynchronous** replication → eventual consistency.

#### RDS Proxy

Critical for: Lambda, ECS, serverless applications.

Problem: thousands of simultaneous open connections.
RDS Proxy solves this with **connection pooling**.

---

## Aurora

Aurora is not just a faster RDS. It has a different architecture.

Advantages:

- Storage separated from compute
- Up to 15 replicas
- Fast failover
- Distributed storage
- Self-healing

Excellent for very large SQL workloads.

---

## DynamoDB

### When to Choose

Excellent for: key-value, documents, very high throughput, low latency, serverless.

### Gotchas

#### No JOINs

Modeling is based on **Access Patterns**, never on entities.

#### Maximum Item Size

Each item is limited to **400 KB**. For files, use S3 — the database stores only the URL or key.

#### Partition Key

A bad partition key creates a **Hot Partition**.

Bad example: `country = BR` — all writes go to the same partition.

#### GSI (Global Secondary Index)

Not an SQL index. Each GSI: costs money, replicates data, occupies storage.

#### On Demand vs Provisioned

- **On Demand**: ideal for unpredictable traffic; simpler but more expensive per request.
- **Provisioned**: ideal for constant traffic; more cost-efficient.

#### DAX

DAX is a cache specific to DynamoDB. It does **not** replace Redis for general-purpose caching.

#### Streams

Useful for event-driven patterns:

```
Order created → DynamoDB Stream → Lambda → Email
```

---

## Cassandra

### When to Choose

Excellent for: massive writes, availability, multi-region, horizontal scalability.

### Gotchas

#### No JOINs

Same concept as DynamoDB. Modeling is based on query patterns.

#### Configurable Consistency

Can choose: `ONE`, `QUORUM`, `ALL`.

Trade-off: latency vs consistency.

#### Tombstones

Deletes create **Tombstones**. Many deletes degrade query performance over time.

#### Partition Key

Same problem as DynamoDB. A bad partition key → Hot Partition.

---

## Redis

Not a database replacement.

Excellent for:

- Cache
- Session
- Leaderboard
- Rate limiter
- Distributed locks

---

# CDN (CloudFront)

Common interview question: _How do you reduce global latency?_

Answer: **CDN**.

### Signed URL

Controls access to **one file**.

### Signed Cookies

Controls access to **multiple files**.

---

# Lambda

### Cold Starts

Cold starts still exist but are less frequent thanks to AWS improvements. Most noticeable in: Java, .NET, rarely-used functions, scale-out spikes.

Mitigations:

- Provisioned Concurrency
- SnapStart (Java)
- Reduce deployment size and dependencies
- Lazy initialization where possible

### Lambda Is Not a Server

Avoid full Express.js. Prefer native handlers.

### Execution Limit

Maximum: **15 minutes**.

For longer processes use: ECS, Batch, Step Functions.

---

# Messaging

## SQS

| Type     | Delivery       | Ordering       |
| -------- | -------------- | -------------- |
| Standard | At Least Once  | Not guaranteed |
| FIFO     | Exactly Once\* | Guaranteed     |

\*FIFO achieves exactly-once in practice through deduplication.

### DLQ (Dead Letter Queue)

Always ask: _What happens when a message fails?_

Answer: **Dead Letter Queue** for isolation, inspection, and retry.

---

## SNS

Excellent for **fan-out**:

```
Event → SNS → Lambda / SQS / Email / Webhook
```

---

## EventBridge

One of the most underrated services.

Ideal for:

- Event-driven architecture
- Service integration
- SaaS events
- Cron jobs
- Decoupling

Can receive events from: S3, ECS, Lambda, DynamoDB (indirectly), custom applications, AWS services.

Can send to: Lambda, Step Functions, ECS, SQS, SNS, API Destinations, Kinesis.

### EventBridge vs SNS

| Feature   | SNS              | EventBridge                   |
| --------- | ---------------- | ----------------------------- |
| Use when  | Simple broadcast | Intelligent routing + filters |
| Latency   | Lower            | Higher                        |
| Filtering | Basic            | Advanced rule-based           |
| Best for  | Push fan-out     | Cross-service event routing   |

---

## Kinesis

### When to Choose

Ideal for: continuous event ingestion, real-time streaming, logs, telemetry, clickstream, IoT, real-time analytics.

### Gotchas

#### Kinesis ≠ SQS

- **SQS**: queue. Consumer typically removes the message.
- **Kinesis**: stream. Records remain in the stream for a retention period. Multiple consumers can read the same data.

#### Ordering

Order is guaranteed **only within a shard**. There is no global ordering across shards.

#### Partition Key

A bad partition key creates a **Hot Shard**.

Bad example: `country = BR` — all events go to the same shard.

#### Throughput Depends on Shards

More shards → more throughput → more parallelism, but also more cost and need for rebalancing.

#### Scalability Is Not Automatic

Adding shards increases capacity; removing shards reduces cost. Plan resharding according to load.

#### Retention and Replay

Records remain in the stream for a configurable retention period. Consumers can replay events — very useful for fixing bugs, reconstructing materialized views, and reprocessing pipelines.

#### Lambda + Kinesis

Lambda polls the stream (no push). Concurrency depends on the number of shards: more shards → higher parallelism.

#### Enhanced Fan-Out

Without Enhanced Fan-Out: consumers share read throughput.
With Enhanced Fan-Out: each consumer gets dedicated throughput. Useful when there are multiple independent consumers.

### Kinesis Data Streams vs Firehose

| Feature      | Data Streams                                   | Firehose                       |
| ------------ | ---------------------------------------------- | ------------------------------ |
| Use when     | Real-time processing, replay, custom consumers | Delivery to a destination only |
| Replay       | Yes                                            | Limited                        |
| Management   | Manual shard management                        | Fully managed                  |
| Destinations | Custom consumers                               | S3, Redshift, OpenSearch, etc. |

Rule of thumb:

- Need to **process events in real-time**? → **Kinesis Data Streams**
- Need to **deliver data to a destination**? → **Kinesis Firehose**

---

# Networking

## Security Group

- **Stateful**
- Accepts only **Allow** rules

## NACL

- **Stateless**
- Accepts **Allow** and **Deny** rules
- Rule order matters

## NAT Gateway

Allows: Private Subnet → Internet.

Does not allow connections initiated from the internet.

## VPC Endpoint

Often forgotten.

Allows accessing **S3** and **DynamoDB** without Internet Gateway or NAT Gateway. Saves money and keeps traffic private.

## Load Balancers

| Type | Protocols       | Layer   |
| ---- | --------------- | ------- |
| ALB  | HTTP, HTTPS, WS | Layer 7 |
| NLB  | TCP, UDP, TLS   | Layer 4 |

NLB has significantly lower latency than ALB.

---

# Consistency

Always ask: **Strong or eventual consistency?**

| Strong consistency | Eventual consistency |
| ------------------ | -------------------- |
| Payments           | Likes                |
| Inventory          | Feeds                |
| Financial systems  | View counts          |
|                    | Counters             |

---

# Scalability

First question: vertical or horizontal scaling?

Almost always: **Horizontal**.

---

# Rate Limiting

Tools: Redis, API Gateway, WAF.

Algorithms: Token Bucket, Leaky Bucket, Sliding Window.

See [design-rate-limiter.md](./design-rate-limiter.md) for a full breakdown.

---

# Observability

Never forget:

- Logs
- Metrics
- Traces
- Dashboards
- Alerts

---

# Security

Always consider:

- IAM Least Privilege
- MFA
- Secrets Manager (never hardcode credentials)
- KMS encryption
- Encryption at rest
- Encryption in transit (TLS)

---

# Interview Mental Checklist

When given a system design problem, run through the following mentally:

## Requirements

- Functional?
- Non-functional?
- Scale?
- Latency?
- Availability?

## Data

- SQL or NoSQL?
- RDS / Aurora / DynamoDB / Cassandra / Redis?
- Hot Partition risk?
- Read Replica?
- Multi-AZ?
- Backup?

## Files

- Goes to S3?
- Needs Presigned URL?
- Multipart Upload?
- CDN?
- Object Lock?
- Glacier?

## Cache

- Worth caching?
- How to invalidate?
- TTL?
- Cache-Aside pattern?

## Events

- Needs a queue?
- SQS / SNS / EventBridge / Kinesis?
- DLQ?
- Retry strategy?
- Idempotency?

## Scalability

- Horizontal scaling?
- Auto Scaling?
- Load Balancer?
- Sharding?
- Partition Key?

## Security

- IAM?
- MFA?
- Least Privilege?
- KMS?
- Secrets Manager?

## Observability

- Logs?
- Metrics?
- Traces?
- Alarms?

## Disaster Recovery

- Backup?
- Failover?
- Multi-AZ?
- Multi-Region?
- RPO?
- RTO?

## Bottlenecks

- Is there a SPOF?
- Is the backend passing files through directly instead of using Presigned URLs?
- Can the database handle the load?
- Is there a Hot Partition?
- Is there a risk of Connection Pool Exhaustion?
- Is there backpressure handling?
- Is the system idempotent?

---

# Related Notes

- [design-rate-limiter.md](../interview-prep/cases/design-rate-limiter.md) — rate limiting algorithms, Redis atomicity, distributed challenges
- [design-news-feed.md](../interview-prep/cases/design-news-feed.md) — S3/CDN for media, DynamoDB for timeline, SQS/SNS for fanout
- [design-payment-system.md](../interview-prep/cases/design-payment-system.md) — SQS DLQ, Kinesis, RDS/Aurora for ledger
- [databases-and-storage.md](./databases-and-storage.md) — deep dive on SQL vs NoSQL, partitioning, indexing
- [reliability-and-networking.md](./reliability-and-networking.md) — load balancers, CDN, circuit breakers
- [event-driven-architecture.md](./event-driven-architecture.md) — Kafka vs Kinesis, event sourcing, CQRS

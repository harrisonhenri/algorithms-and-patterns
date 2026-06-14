---
tags: [system-design, eda, messaging, theory]
title: "Event-driven architecture"
---

# EDA

## Introduction

Event-driven architecture is a software design pattern that allows decoupled applications to asynchronously publish and subscribe to events.

## Working with events

There are many forms of working with events:

- Event sourcing: You have a representation of the current state of the world, but you also have a log of all the events happened.
- CQRS: You separate the components that read and write to your permanent store.
- Event notification (can be also called, delta events): details a change between one state to another `{"pedido": "1", "status": "aprovado"}` . Good for consumers react to changes. Poor if consumers need the full state.
- Event-carried state transfer (also called facts):

```
{"pedido": "1", "status": "aprovado", "data": "2023-10-01", "valor": 100.00, "cliente": {"nome": "João", "email": "joao@gmail.com", "telefone": "123456789"}, "produtos": [{"id": 1, "nome": "Produto A", "quantidade": 2, "preco_unitario": 50.00}, {"id": 2, "nome": "Produto B", "quantidade": 1, "preco_unitario": 100.00}]}
```

## Event sourcing

![Event-Driven Architecture](../../assets/system-design/eda.png)

## Delayed and scheduled messages

Not all events should be consumed immediately. Some actions are intentionally deferred:

- Cancel unpaid order after 30 minutes
- Retry failed operation in 5 minutes
- Send reminder tomorrow at 09:00

Two common forms:

| Type | Example |
| ---- | ------- |
| Delayed message | Deliver in 30 minutes |
| Scheduled message | Deliver at 15:30 |

At runtime, both are "message + release time".

**Basic flow:**

```
Producer
  |
  | send with delay/schedule
  v
Broker temporary storage
  |
  | release at target time
  v
Topic/Queue
  |
  v
Consumer
```

### Common implementation strategies

- Delay queue/topic with TTL + forward/dead-letter routing
- Predefined delay levels (for simpler broker internals)
- Hierarchical timing wheels for large timer cardinality

Timing-wheel based schedulers are common in high-scale systems because they keep timer operations close to O(1)-like behavior per event.

### Why this matters for sagas

Delayed delivery is a practical way to model distributed timeouts:

```
OrderCreated
  -> schedule CheckPaymentTimeout(+30m)
  -> if still pending at timeout: cancel order
```

This avoids periodic scans for timeout checks and keeps workflow logic event-driven.

## Kafka x RabbitMQ

<aside>

Use **Kafka** when you need **durable, replayable event streams** with **high throughput** and **horizontal scalability**—for example, audit logs, analytics pipelines, event sourcing, or asynchronous microservice communication at scale. Kafka excels when messages must be retained for long periods, reprocessed later, or fanned out to many independent consumers.

Use **RabbitMQ** when you need **immediate, short-lived task handling** or **request–reply style communication**—for example, background job dispatch, command queues, or notification systems. It shines when low latency, strong **configurable** delivery guarantees, and simpler operational setup matter more than throughput or event retention. In short, Kafka is for **streams of facts over time**, while RabbitMQ is for **commands to be done right now**.

</aside>

| **Feature**                | **Apache Kafka**                                                                  | **RabbitMQ**                                                                        |
| -------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Type**                   | Distributed event streaming platform (log-based, stream-oriented)                 | Traditional message broker with optional stream capabilities                        |
| **Primary Abstraction**    | Immutable event log                                                               | Smart broker with queues and routing                                                |
| **Architecture**           | Pub/Sub with distributed commit log                                               | Traditional message broker with queues and exchanges                                |
| **Message Model**          | Pull-based (consumer-driven fetch with long polling)                              | Push-based (messages delivered to consumers)                                        |
| **Consumption Model**      | Non-destructive read (messages remain after consumption)                          | Destructive consumption by default (removed after acknowledgment)                   |
| **Ordering**               | Strong ordering within a partition; global ordering reduces scalability           | Queue ordering preserved unless parallel consumption or redelivery occurs           |
| **Durability**             | High (data persisted on disk by default)                                          | Configurable (persistent queues or transient)                                       |
| **Throughput**             | Very high (millions of messages/sec)                                              | Moderate to high (lower than Kafka generally). Moderate data volumes                |
| **Latency**                | Low for large throughput, slightly higher per message                             | Low for individual messages                                                         |
| **Message Retention**      | Configurable retention (time-based, size-based, or infinite). Replay-native       | Traditionally removes after ack; Streams plugin supports retention and replay       |
| **Reprocessing / Replay**  | Native replay from offsets                                                        | Classic queues: no replay after ack. Streams: replay supported                      |
| **Data Storage**           | Distributed append-only persistent log                                            | Queue-based broker; Streams use append-only log internally                          |
| **Scalability**            | Horizontally scalable with partitions and brokers                                 | Scales vertically and via clustering/federation                                     |
| **Backpressure**           | Disk-backed retention naturally absorbs bursts                                    | Broker-mediated flow control; queues can grow under sustained overload              |
| **Broker Responsibility**  | Lightweight broker; consumers manage offsets and retries                          | Broker manages routing, acknowledgments, retries, and DLQs                          |
| **Consumer Pattern**       | Independent consumers track offsets; consumer groups share partitions             | Competing consumers on queues; fanout via exchanges                                 |
| **Fanout / Multiconsumer** | Multiple consumers independently replay the same immutable stream                 | Exchanges duplicate messages into queues for each consumer group                    |
| **Protocol Support**       | Kafka protocol, REST, some connectors                                             | AMQP, MQTT, STOMP, HTTP, WebSockets, etc.                                           |
| **Transactions**           | Supported (exactly-once semantics possible)                                       | Supported (publisher confirms preferred; transactions are costly)                   |
| **Use Cases**              | Event sourcing, streaming analytics, CDC, log aggregation, replayable pipelines   | Task distribution, RPC, workflows, low-latency command processing                   |
| **Complexity**             | Higher (setup, maintenance, scaling)                                              | Lower (easier to deploy and manage)                                                 |
| **Latency Sensitivity**    | Low and stable at high throughput; slightly higher per message due to batching    | Better suited for low-latency workloads                                             |
| **Developer Ecosystem**    | Rich (Kafka Streams, Kafka Connect, kSQL)                                         | Broad language support and plugins                                                  |
| **Error Handling**         | Mostly consumer responsibility (retries, DLQs implemented at app/framework level) | Easier since the broker manages most of the lifecycle (DLQs, backpressure, retries) |
| **Delivery Semantics**     | At-least-once, at-most-once, exactly-once                                         | At-most-once and at-least-once (manual acks)                                        |
| **High Availability**      | Built-in replication via partitions                                               | Clustering and mirrored queues for HA                                               |
| **Monitoring**             | Requires external tools (Prometheus, Grafana, Confluent Control Center)           | Built-in management UI and metrics out of the box                                   |
| **Security**               | SASL, TLS, ACLs (broker and topic level)                                          | TLS, user/password, vhosts, fine-grained permissions                                |
| **Message Size**           | Optimized for large volumes of small to medium messages                           | Handles smaller messages best; large payloads impact performance                    |
| **Deployment Options**     | Kafka OSS, Confluent Cloud, AWS MSK                                               | RabbitMQ OSS, CloudAMQP, AWS MQ                                                     |
| **Not Ideal For**          | Real-time RPC, fine-grained per-message ordering                                  | Persistent event sourcing or analytics pipelines                                    |
| **Typical Latency**        | ~5–50 ms typical (batching, replication, and config dependent)                    | < 1 ms to a few ms per message                                                      |

---

# Exactly-Once Semantics in Event-Driven Systems

## Delivery Guarantee Semantics

Event systems provide different delivery guarantees. For comprehensive definitions and use cases, see [transactions-and-concurrency.md#delivery-guarantee-semantics](transactions-and-concurrency.md#delivery-guarantee-semantics).

The following sections detail how Kafka, RabbitMQ, and stream processors implement these guarantees.

---

## Kafka Exactly-Once Implementation

Modern Kafka (0.11+) achieves exactly-once through integrated mechanisms. See [transactions-and-concurrency.md#real-world-exactly-once-implementations](transactions-and-concurrency.md#real-world-exactly-once-implementations) for the conceptual foundation.

### Important boundary

Kafka EOS is "exactly-once within Kafka transactional boundaries". It is not universal "exactly one side effect everywhere".

Example boundary break:

```
Consume OrderPlaced
Charge external payment API
Crash before offset commit
Restart and replay
Charge attempted again
```

For side effects outside Kafka, combine at-least-once delivery with idempotency keys, deduplication, outbox/inbox patterns, and reconciliation.

### 1. Idempotent Producer

```
Configuration: enable.idempotence = true

Kafka tracks:
  - Producer ID
  - Message sequence numbers
  - Per-partition per-producer

Guarantees:
  - Each message sent exactly once
  - No duplicates on network retry
  - Producer-level deduplication
```

---

### 2. Transactional Semantics

```
producer.initTransactions()

try {
    producer.beginTransaction()
    producer.send(record1)
    producer.send(record2)
    producer.commitTransaction()  // atomic
} catch {
    producer.abortTransaction()   // all-or-nothing
}

All messages committed together
All messages aborted together
Partial success impossible
```

---

### 3. Offset and Result Atomicity

See [transactions-and-concurrency.md#offset-and-result-atomicity](transactions-and-concurrency.md#offset-and-result-atomicity) for detailed explanation and code examples.

```
Consumer with exactly-once:

Key insight:
  Atomic store of (offset, processing_result)

1. Fetch message from partition 5, offset 100
2. Process message (idempotently)
3. Atomically store:
   - Offset 100 processed
   - Result of processing (e.g., in database)

Failure scenario:
  If crash between step 2 and 3:
  - On recovery: consumer sees offset 100 not committed
  - Replays message from 100
  - Idempotent handler deduplicates
  - Result: exactly-once end-to-end
```

---

### 4. Isolation Level

See [transactions-and-concurrency.md#isolation-level-configuration](transactions-and-concurrency.md#isolation-level-configuration) for details.

```
Configuration: isolation.level = read_committed

Consumer behavior:
  - Only reads committed messages
  - Ignores in-flight transactions
  - Prevents reading aborted operations
  - Ensures consistency
```

---

## RabbitMQ Exactly-Once Patterns

RabbitMQ doesn't natively provide exactly-once like Kafka. See [transactions-and-concurrency.md#rabbitmq-exactly-once-patterns](transactions-and-concurrency.md#rabbitmq-exactly-once-patterns) for detailed implementation patterns and code examples.

**Quick summary:**

- Publisher confirms + correlation IDs
- Consumer-side idempotent processing
- Application-level deduplication storage

---

## Stream Processing and Exactly-Once

### Apache Flink Model

```
Checkpointing:
  1. Pause all inputs
  2. Snapshot all state
  3. Flush outputs atomically
  4. Resume processing

Failure recovery:
  ✓ Restore from checkpoint
  ✓ Replay from offset
  ✓ Deterministic reprocessing
  ✓ Exactly-once state updates
```

References:

- [1] Akidau et al.: "The Dataflow Model" (Apache Beam/Flink inspiration)
- [92] Tzoumas et al.: "High-Throughput, Low-Latency, and Exactly-Once Stream Processing with Apache Flink"

---

## Exactly-Once Verification Checklist

See [transactions-and-concurrency.md#achieving-exactly-once-checklist](transactions-and-concurrency.md#achieving-exactly-once-checklist) for comprehensive checklist when designing exactly-once systems.

**Quick reference for event systems:**

- [ ] Unique message IDs (correlation ID, request ID, or offset)
- [ ] Idempotent processing (same message = same result)
- [ ] Atomic writes (offset and result stored together)
- [ ] Deduplication (processed IDs tracked and checked)
- [ ] Failure recovery (no work lost or duplicated)
- [ ] State persistence (processed state survives restart)
- [ ] End-to-end coverage (full producer-broker-consumer pipeline)

---

## Domain Quality Drives Architecture Quality

Event-driven architecture works best when **domain boundaries are clear**. If domain decomposition is poor (tangled responsibilities, god objects), event-driven systems will struggle with tight coupling and unclear service ownership.

**Key principle:**

> Architecture quality follows domain model quality. Design your domains first (DDD), then build event-driven systems that respect domain boundaries.

**See also:** [Domain-Driven Design](./domain-driven-design.md#architecture-quality-depends-on-domain-model-quality) for bounded context design and context mapping patterns.

---

![image.png](../assets/microservices/system-design-cheat-sheet-1.png)
![image.png](../assets/microservices/system-design-cheat-sheet-2.png)

---
type: integration-pattern
category: messaging-channels
aliases: [channel, queue, topic]
tags: [integration-pattern, messaging-channels, channel, core-concept]
---

# Message Channel

## Problem

How does one application communicate with another using messaging?

## Solution

Connect the applications with a Message Channel, a logical pathway that conveys messages. Create separate channels for different types of messages, so that applications can select which messages to consume.

## Context & Forces

**When to use:**
- Asynchronous communication needed
- Applications need loose coupling
- Message delivery required; synchronous call not appropriate
- Pub-Sub or Point-to-Point semantics fit use case

## Key Concepts

**Message Channel** is the **foundation** of all messaging patterns. It's the virtual "pipe" through which messages flow.

**Two main types:**
1. **Point-to-Point**: Exactly one receiver per message
2. **Publish-Subscribe**: All subscribers receive copy

**Characteristics:**
- **Logical abstraction**: Hides physical transport (TCP, HTTP, etc.)
- **Asynchronous**: Sender and receiver decouple in time
- **Directed**: Messages travel from sender to receiver(s)
- **Reliable** (depends on implementation): May guarantee delivery

## Channel Responsibilities

1. **Buffer messages**: Hold messages until consumer ready
2. **Queue/deliver**: Put messages in order, pass to recipient
3. **Connect**: Bridge sender and receiver
4. **Decouple**: Sender doesn't know receiver; vice versa

## Related Patterns

- **Channel types**: Point-to-Point Channel, Publish-Subscribe Channel
- **Properties**: Guaranteed Delivery, Dead Letter Channel
- **Connectivity**: Channel Adapter (connect apps to channels), Messaging Bridge (connect channels)
- **Architecture**: Message Bus (central hub of channels)

## Technology Implementations

| Technology | P2P Channel | Pub-Sub Channel |
|-----------|-------------|-----------------|
| **RabbitMQ** | Queue | Topic Exchange + Binding |
| **Apache Kafka** | Topic (single partition) | Topic (multiple subscribers) |
| **AWS** | SQS Queue | SNS Topic |
| **Azure** | Service Bus Queue | Service Bus Topic |
| **GCP** | Cloud Pub/Sub (subscription) | Cloud Pub/Sub (multiple subscriptions) |
| **Redis** | List/Queue | Pub/Sub / Streams |

## Channel Properties

**Capacity:**
- Unbounded (limited only by storage)
- Bounded (queue size limit; drop/reject excess)

**Ordering:**
- FIFO (typical for P2P)
- Unordered (typical for Pub-Sub)

**Delivery guarantees:**
- At-most-once (may lose messages)
- At-least-once (may duplicate)
- Exactly-once (ideal, hard to achieve)

**Persistence:**
- In-memory (fast, lost on crash)
- Persistent (durable, slower)

## Channel Adapter Pattern

**Connect non-messaging apps to channel:**
```
Legacy File System ← File Channel Adapter ← Message Channel
   ↓                                            ↑
(write files)      ← File Channel Adapter ← New App
```

## Messaging Bridge

**Connect separate messaging systems:**
```
Kafka Topic ← Messaging Bridge ← RabbitMQ Queue
  ↓                                   ↑
(consume)                          (publish)
```

## Channel Naming & Organization

**Best practices:**
- Descriptive names: `orders.created` not `topic123`
- Namespace/prefix: `domain.event.action` (e.g., `orders.order.created`)
- Separate logical channels for different message types
- Avoid overly granular channels (maintenance burden)

## Example Scenarios

1. **Order system**: `orders.created` channel carries OrderCreated events
2. **User system**: `users.registered` channel carries UserRegistered events
3. **Task queue**: `tasks.pending` channel holds pending work items
4. **Event stream**: `events.all` collects all system events

## Channel Discovery & Routing

**How do apps find channels?**
- **Configuration**: Hard-coded channel names in config
- **Service registry**: Dynamic lookup (Consul, Eureka)
- **Convention**: Standard naming scheme
- **Broker**: Central broker manages channels (Message Bus)

## Scalability via Channels

**Partitioned channels:**
```
Single logical channel partitioned by key
Partition 0: Messages with key % N == 0
Partition 1: Messages with key % N == 1
...
Partition N: Messages with key % N == N-1
```
Kafka topic with N partitions = N parallel consumers with ordering.

**Sharding via channels:**
```
Orders for region A → channel-a (scale independently)
Orders for region B → channel-b (scale independently)
Orders for region C → channel-c (scale independently)
```

## Security Considerations

- **Access control**: Who can publish/subscribe?
- **Encryption**: Messages in transit, at rest
- **Authentication**: Verify sender/receiver
- **Message validation**: Verify message content

## Channel Capacity Planning

**Calculate storage needed:**
```
Messages/sec × Average message size × Retention time
Example: 100 msg/sec × 5KB × 1 hour = 1.8GB/hour
```

## References

- [Message Channel on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/MessageChannel.html)
- **Foundational pattern**: All other patterns depend on channels
- **Channel types**: Point-to-Point Channel, Publish-Subscribe Channel
- **Channel enhancement**: Guaranteed Delivery, Dead Letter Channel
- **Architecture**: Message Bus (central hub), Messaging Bridge (multi-system)
- Book: Enterprise Integration Patterns, Chapter 4

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

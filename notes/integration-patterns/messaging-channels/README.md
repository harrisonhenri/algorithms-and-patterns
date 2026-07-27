---
type: index
domain: integration-patterns
tags: [integration-pattern, index, messaging]
---

# Messaging Channels

Channels are the virtual pipes through which messages flow. This section covers channel types, properties, reliability mechanisms, and connectivity patterns.

## Core Concepts (6 patterns)

### [Message Channel](./message-channel.md)
Foundational pattern. Virtual pipe connecting sender to receiver(s). Basis for all messaging.

### [Message](./message.md)
Data structure flowing through channel. Contains header, payload, metadata. Pattern for message construction.

### [Pipes and Filters](./pipes-and-filters.md)
Chain of independent processors. Each filter processes input, passes to next. Natural for linear transformations.

### [Message Router](./message-router.md)
Routes messages to destination based on input. Basis for content-based, dynamic, recipient-list routing.

### [Message Translator](./message-translator.md)
Converts message between formats. Maps data from one schema to another.

### [Message Endpoint](./message-endpoint.md)
Application connection point to messaging channel. Encapsulates send/receive mechanics from application logic.

## Channel Types (9 patterns)

### [Point-to-Point Channel](./point-to-point-channel.md)
Exactly one receiver per message. Queue semantics. Load balancing across consumers.

### [Publish-Subscribe Channel](./publish-subscribe-channel.md)
All subscribers receive copy. Broadcast semantics. Loose coupling; fan-out capability.

### [Datatype Channel](./datatype-channel.md)
Channel carries specific message type. Subscribers know what type to expect. Organization pattern.

### [Invalid Message Channel](./invalid-message-channel.md)
Receives messages that don't match expected format/schema. Graceful handling of malformed data.

### [Dead Letter Channel](./dead-letter-channel.md)
Receives messages that can't be delivered/processed. Prevents message loss; allows manual review.

### [Guaranteed Delivery](./guaranteed-delivery.md)
Message persisted in storage. Survives application/broker failure. Critical for reliability.

### [Channel Adapter](./channel-adapter.md)
Connects non-messaging app to channel. Bridges legacy/external systems to messaging.

### [Messaging Bridge](./messaging-bridge.md)
Connects separate messaging systems. Kafka ↔ RabbitMQ, etc. System-of-systems integration.

### [Message Bus](./message-bus.md)
Central hub of channels and routes. All apps connect to bus. Alternative to point-to-point wiring.

## Category Overview

**Channel selection:**
- Point-to-Point: One receiver per message (work queues)
- Pub-Sub: Multiple independent subscribers (events)
- Datatype: Organize by message type
- Dead Letter: Handle undeliverable/unprocessable
- Guaranteed Delivery: Durability critical
- Adapters/Bridge: Connect diverse systems

**Architecture styles:**
- Hub-and-Spoke: Message Bus (central)
- Point-to-Point: Direct channels between pairs
- Hybrid: Combination of above

## Reliability Spectrum

| Pattern | Durability | Typical Use |
|---------|-----------|------------|
| **Channel** | In-memory (volatile) | Messages in flight |
| **Guaranteed Delivery** | Persistent | Critical messages |
| **Dead Letter** | Persistent | Failed messages |
| **Message Store** | Queryable | Audit, replay |

---

*Patterns from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

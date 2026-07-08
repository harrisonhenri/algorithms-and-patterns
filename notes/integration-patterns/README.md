# Enterprise Integration Patterns

A comprehensive reference for **65 messaging patterns** from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/), organized by category for easy discovery and learning.

## Overview

Enterprise Integration Patterns (EIP) provide a technology-independent vocabulary and visual notation for designing distributed, asynchronous systems. These patterns are proven solutions to recurring integration challenges across diverse technologies: message brokers, ESBs, cloud platforms, serverless architectures, and microservices.

**Key Insight**: The same integration problems that existed 20 years ago (with JMS, SOAP, MSMQ) persist today in modern architectures (Kafka, AWS EventBridge, Azure Service Bus, Google Cloud Pub/Sub, Kubernetes).

## Quick Start

**New to Enterprise Integration Patterns?**

1. Read this Overview section (5 min)
2. Check your use case in [By Use Case](#by-use-case) section
3. Browse your category below
4. See [Pattern Selection Guide](./pattern-selection-guide.md) for decision matrix
5. Follow the [Reading Order](#reading-order) for structured learning

## Pattern Categories (65 Total)

### 1. [Integration Styles](./integration-styles/) — 4 patterns

Foundational approaches to integrating multiple applications.

- **Messaging** (recommended) — Loose coupling, asynchronous
- Remote Procedure Invocation — Synchronous queries (limited scope)
- Shared Database — **Legacy approach** (avoid for new systems; migrate to messaging)
- File Transfer — **Legacy approach** (batch/EDI only; prefer messaging)

### 2. [Messaging Channels](./messaging-channels/) — 15 patterns (6 Core + 9 Types)

Core concepts and channel patterns for transporting messages.

**Core Concepts**:

- Message Channel, Message, Pipes and Filters, Message Router, Message Translator, Message Endpoint

**Channel Types** (recommended first: Point-to-Point, Pub-Subscribe):

- **Point-to-Point Channel** — One receiver per message (queues)
- **Publish-Subscribe Channel** — All subscribers receive (events)
- Dead Letter Channel, Guaranteed Delivery, Channel Adapter, Messaging Bridge, Message Bus, Datatype Channel, Invalid Message Channel

### 3. [Message Construction](./message-construction/) — 9 patterns

Patterns for structuring and correlating messages.

- **Event Message** — "This happened" (broadcast)
- **Command Message** — "Do this" (request action)
- **Document Message** — "Here's data" (neutral data transfer)
- **Request-Reply** — Async request-response
- Return Address, Correlation Identifier, Message Sequence, Message Expiration, Format Indicator

### 4. [Routing Patterns](./routing-patterns/) — 12 patterns

How messages are directed from sender to receiver(s).

- **Content-Based Router** — Route by message content
- **Splitter** — Split composite into individuals
- **Aggregator** — Combine results
- **Process Manager** — Orchestrate workflows
- Message Filter, Dynamic Router, Recipient List, Resequencer, Composed Message Processor, Scatter-Gather, Routing Slip, Message Broker

### 5. [Transformation Patterns](./transformation-patterns/) — 6 patterns

Changing message content and format.

- **Content Enricher** — Add missing data
- Envelope Wrapper, Content Filter, Claim Check, Normalizer, Canonical Data Model

### 6. [Messaging Endpoints](./messaging-endpoints/) — 11 patterns

How applications produce and consume messages.

- **Event-Driven Consumer** — React immediately (push)
- **Idempotent Receiver** — Handle duplicates safely
- Messaging Gateway, Messaging Mapper, Transactional Client, Polling Consumer, Competing Consumers, Message Dispatcher, Selective Consumer, Durable Subscriber, Service Activator

### 7. [System Management](./system-management/) — 8 patterns

Monitoring, debugging, and administering message-based systems.

- **Message History** — Query message flow
- Control Bus, Detour, Wire Tap, Message Store, Smart Proxy, Test Message, Channel Purger

## By Use Case

### "I need async messaging"

→ [Messaging](./integration-styles/messaging.md) + [Pub-Subscribe Channel](./messaging-channels/publish-subscribe-channel.md)

### "I'm processing orders"

→ [Content-Based Router](./routing-patterns/content-based-router.md) + [Dead Letter Channel](./messaging-channels/dead-letter-channel.md) + [Idempotent Receiver](./messaging-endpoints/idempotent-receiver.md)

### "I need request-response"

→ [Request-Reply](./message-construction/request-reply.md) + [Correlation Identifier](./message-construction/correlation-identifier.md)

### "I'm splitting work across services"

→ [Splitter](./routing-patterns/splitter.md) + [Aggregator](./routing-patterns/aggregator.md) + [Competing Consumers](./messaging-endpoints/competing-consumers.md)

### "I'm orchestrating workflows"

→ [Process Manager](./routing-patterns/process-manager.md) + [Command Message](./message-construction/command-message.md)

### "I need event sourcing"

→ [Event Message](./message-construction/event-message.md) + [Message Store](./system-management/message-store.md)

### "I'm debugging a failure"

→ [Message History](./system-management/message-history.md) + [Correlation Identifier](./message-construction/correlation-identifier.md) + [Wire Tap](./system-management/wire-tap.md)

## By Technology

### Kafka

- [Pub-Subscribe Channel](./messaging-channels/publish-subscribe-channel.md) (topics)
- [Event-Driven Consumer](./messaging-endpoints/event-driven-consumer.md) (listeners)
- [Competing Consumers](./messaging-endpoints/competing-consumers.md) (consumer groups)
- [Message History](./system-management/message-history.md) (log-compacted topics)
- [Splitter](./routing-patterns/splitter.md) + [Aggregator](./routing-patterns/aggregator.md)

### RabbitMQ

- [Point-to-Point Channel](./messaging-channels/point-to-point-channel.md) (queues)
- [Pub-Subscribe Channel](./messaging-channels/publish-subscribe-channel.md) (topic exchange)
- [Content-Based Router](./routing-patterns/content-based-router.md) (exchange routing)
- [Message Translator](./transformation-patterns/message-translator.md) (headers exchange)
- [Dead Letter Channel](./messaging-channels/dead-letter-channel.md) (dead-letter exchange)

### AWS (SQS/SNS/EventBridge)

- [Point-to-Point Channel](./messaging-channels/point-to-point-channel.md) (SQS)
- [Pub-Subscribe Channel](./messaging-channels/publish-subscribe-channel.md) (SNS)
- [Content-Based Router](./routing-patterns/content-based-router.md) (EventBridge rules)
- [Process Manager](./routing-patterns/process-manager.md) (Step Functions)
- [Event-Driven Consumer](./messaging-endpoints/event-driven-consumer.md) (Lambda)

### Azure (Service Bus)

- [Point-to-Point Channel](./messaging-channels/point-to-point-channel.md) (queues)
- [Pub-Subscribe Channel](./messaging-channels/publish-subscribe-channel.md) (topics)
- [Content-Based Router](./routing-patterns/content-based-router.md) (subscription filters)
- [Process Manager](./routing-patterns/process-manager.md) (Logic Apps)
- [Message History](./system-management/message-history.md) (Application Insights)

### Google Cloud (Pub/Sub)

- [Pub-Subscribe Channel](./messaging-channels/publish-subscribe-channel.md) (topics/subscriptions)
- [Event-Driven Consumer](./messaging-endpoints/event-driven-consumer.md) (pull subscriptions)
- [Process Manager](./routing-patterns/process-manager.md) (Workflows)
- [Splitter](./routing-patterns/splitter.md) + [Aggregator](./routing-patterns/aggregator.md) (Dataflow)

## Reading Order

**Beginner:**

1. [Integration Styles README](./integration-styles/README.md) — Understand approaches
2. [Messaging](./integration-styles/messaging.md) — Why async?
3. [Message Channel](./messaging-channels/message-channel.md) — How messages flow
4. [Point-to-Point Channel](./messaging-channels/point-to-point-channel.md) + [Pub-Subscribe Channel](./messaging-channels/publish-subscribe-channel.md) — Channel types

**Intermediate:** 5. [Message types](./message-construction/) — Command, Event, Document 6. [Request-Reply](./message-construction/request-reply.md) + [Correlation Identifier](./message-construction/correlation-identifier.md) — Conversations 7. [Content-Based Router](./routing-patterns/content-based-router.md) — Routing basics 8. [Event-Driven Consumer](./messaging-endpoints/event-driven-consumer.md) + [Polling Consumer](./messaging-endpoints/polling-consumer.md) — Endpoints 9. [Idempotent Receiver](./messaging-endpoints/idempotent-receiver.md) — Reliability

**Advanced:** 10. [Splitter](./routing-patterns/splitter.md) + [Aggregator](./routing-patterns/aggregator.md) — Parallel processing 11. [Process Manager](./routing-patterns/process-manager.md) — Orchestration 12. [Dead Letter Channel](./messaging-channels/dead-letter-channel.md) — Error handling 13. [Message History](./system-management/message-history.md) — Observability 14. [Content Enricher](./transformation-patterns/content-enricher.md) + other transformations

## Pro Tips

1. **Don't memorize patterns** — Understand problems; patterns are solutions to those problems
2. **Patterns work together** — Splitter + Aggregator, Request-Reply + Correlation ID, etc.
3. **Technology doesn't matter** — Use any technology (Kafka, RabbitMQ, cloud); patterns are universal
4. **Start simple** — Master Point-to-Point + Content-Based Router before advanced patterns
5. **Think async first** — Default to async patterns; use sync (RPC) only when justified

## Pattern Selection Guide

**Choosing the right patterns** depends on your system requirements. See [Pattern Selection Guide](./pattern-selection-guide.md) for a decision matrix based on:

- Coupling requirements (loose vs. tight)
- Scalability needs (throughput, latency)
- Failure handling (durability, reliability)
- Technology stack (Kafka, RabbitMQ, cloud platforms, serverless)
- Synchronicity (synchronous vs. asynchronous)

## Modern Applications

These patterns apply across modern architectures:

- **Microservices**: Service-to-service communication via async messaging
- **Event-Driven Architecture**: Event messages, pub-sub channels, process managers
- **Serverless**: Function orchestration, stateless workers, message-based triggers
- **Message Brokers**: Kafka, RabbitMQ, AWS SQS/SNS, Azure Service Bus, Google Pub/Sub

See [modern examples on the EIP site](https://www.enterpriseintegrationpatterns.com/ramblings/eip1_examples_updated.html) for implementation details with specific technologies.

## Related Notes

- [Event-Driven Architecture](../system-design/event-driven-architecture.md) — System design patterns incorporating EIP messaging
- [Transactions and Concurrency](../system-design/transactions-and-concurrency.md) — Exactly-once boundaries, idempotency, and contention strategies
- [Process Manager](./routing-patterns/process-manager.md) — Orchestration and timeout scheduling in long-running workflows
- [Idempotent Receiver](./messaging-endpoints/idempotent-receiver.md) — Duplicate and out-of-order safety patterns
- [Design Patterns Comparisons](../paradigms-and-patterns/design-patterns-comparisons.md) — Relationship to OOP design patterns

## License & Attribution

All pattern names, problem statements, solution sketches, and icons are used under the **Creative Commons Attribution 4.0 (CC-BY)** license from [enterpriseintegrationpatterns.com](https://www.enterpriseintegrationpatterns.com/).

For comprehensive coverage with examples and discussion, see:

- **Book**: [Enterprise Integration Patterns](https://amzn.to/3Vqh3V3) by Gregor Hohpe and Bobby Woolf (Addison-Wesley, 2003)
- **Website**: [enterpriseintegrationpatterns.com](https://www.enterpriseintegrationpatterns.com/)
- **Blog**: [Gregor Hohpe's Ramblings](https://www.enterpriseintegrationpatterns.com/ramblings)

---

**Total Patterns**: 4 + 15 + 9 + 12 + 6 + 11 + 8 = **65 messaging patterns**

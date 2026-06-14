# Enterprise Integration Patterns

A comprehensive reference for **65 messaging patterns** from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/), organized by category for easy discovery and learning.

## Overview

Enterprise Integration Patterns (EIP) provide a technology-independent vocabulary and visual notation for designing distributed, asynchronous systems. These patterns are proven solutions to recurring integration challenges across diverse technologies: message brokers, ESBs, cloud platforms, serverless architectures, and microservices.

**Key Insight**: The same integration problems that existed 20 years ago (with JMS, SOAP, MSMQ) persist today in modern architectures (Kafka, AWS EventBridge, Azure Service Bus, Google Cloud Pub/Sub, Kubernetes).

## Pattern Categories

### 1. [Integration Styles](./integration-styles/) — 4 patterns
Foundational approaches to integrating multiple applications. Establishes the context for message-based integration.

- File Transfer
- Shared Database
- Remote Procedure Invocation
- Messaging

### 2. [Messaging Channels](./messaging-channels/) — 15 patterns
Core concepts and channel patterns for transporting messages. Covers message construction, channel types, reliability, and connectivity.

**Core Concepts** (6):
- Message Channel
- Message
- Pipes and Filters
- Message Router
- Message Translator
- Message Endpoint

**Channel Types** (9):
- Point-to-Point Channel
- Publish-Subscribe Channel
- Datatype Channel
- Invalid Message Channel
- Dead Letter Channel
- Guaranteed Delivery
- Channel Adapter
- Messaging Bridge
- Message Bus

### 3. [Message Construction](./message-construction/) — 9 patterns
Patterns for structuring and correlating messages. Defines message types, headers, expiration, and sequence handling.

- Command Message
- Document Message
- Event Message
- Request-Reply
- Return Address
- Correlation Identifier
- Message Sequence
- Message Expiration
- Format Indicator

### 4. [Routing Patterns](./routing-patterns/) — 12 patterns
How messages are directed from sender to receiver(s). Includes message filtering, dynamic routing, aggregation, and process orchestration.

- Content-Based Router
- Message Filter
- Dynamic Router
- Recipient List
- Splitter
- Aggregator
- Resequencer
- Composed Message Processor
- Scatter-Gather
- Routing Slip
- Process Manager
- Message Broker

### 5. [Transformation Patterns](./transformation-patterns/) — 6 patterns
Changing message content and format. Handles data enrichment, filtering, and format normalization.

- Envelope Wrapper
- Content Enricher
- Content Filter
- Claim Check
- Normalizer
- Canonical Data Model

### 6. [Messaging Endpoints](./messaging-endpoints/) — 11 patterns
How applications produce and consume messages. Covers synchronization, transactionality, concurrency, and idempotency.

- Messaging Gateway
- Messaging Mapper
- Transactional Client
- Polling Consumer
- Event-Driven Consumer
- Competing Consumers
- Message Dispatcher
- Selective Consumer
- Durable Subscriber
- Idempotent Receiver
- Service Activator

### 7. [System Management](./system-management/) — 8 patterns
Monitoring, debugging, and administering message-based systems. For visibility, testing, and control.

- Control Bus
- Detour
- Wire Tap
- Message History
- Message Store
- Smart Proxy
- Test Message
- Channel Purger

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

Last updated: May 2026 | Based on EIP by Gregor Hohpe & Bobby Woolf

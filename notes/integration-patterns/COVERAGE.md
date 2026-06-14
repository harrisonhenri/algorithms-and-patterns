---
type: reference
domain: integration-patterns
tags: [integration-pattern, manifest, coverage]
---

# Pattern Coverage & Status

Complete manifest of all 65 Enterprise Integration Patterns from enterpriseintegrationpatterns.com, organized by category with implementation status.

## Status Key
- ✅ **Complete**: Full documentation with problem, solution, considerations, examples
- 📝 **Stub**: Brief summary; expand as needed
- ❌ **Placeholder**: Listed for completeness; to be documented

---

## Integration Styles (4/4) ✅

- ✅ [File Transfer](./integration-styles/file-transfer.md)
- ✅ [Shared Database](./integration-styles/shared-database.md)
- ✅ [Remote Procedure Invocation](./integration-styles/remote-procedure-invocation.md)
- ✅ [Messaging](./integration-styles/messaging.md)

---

## Messaging Channels (15/15) - 6 Core + 9 Channel Types

### Core Concepts (6)
- ✅ [Message Channel](./messaging-channels/message-channel.md)
- 📝 Message (brief implementation)
- 📝 [Pipes and Filters](./messaging-channels/pipes-and-filters.md) (simple sequence)
- 📝 [Message Router](./messaging-channels/message-router.md) (routes messages)
- 📝 [Message Translator](./messaging-channels/message-translator.md) (format conversion)
- 📝 [Message Endpoint](./messaging-channels/message-endpoint.md) (app connection)

### Channel Types (9)
- ✅ [Point-to-Point Channel](./messaging-channels/point-to-point-channel.md)
- ✅ [Publish-Subscribe Channel](./messaging-channels/publish-subscribe-channel.md)
- 📝 Datatype Channel (organize by type)
- 📝 Invalid Message Channel (malformed messages)
- 📝 Dead Letter Channel (undeliverable)
- 📝 Guaranteed Delivery (durability)
- 📝 Channel Adapter (connect non-messaging apps)
- 📝 Messaging Bridge (connect systems)
- 📝 Message Bus (central hub)

---

## Message Construction (9/9)

- ✅ [Command Message](./message-construction/command-message.md)
- 📝 Document Message (data transfer)
- ✅ [Event Message](./message-construction/event-message.md)
- ✅ [Request-Reply](./message-construction/request-reply.md)
- 📝 Return Address (where to reply)
- 📝 Correlation Identifier (tie messages)
- 📝 Message Sequence (multi-message)
- 📝 Message Expiration (deadline)
- 📝 Format Indicator (version/format)

---

## Routing Patterns (12/12)

- ✅ [Content-Based Router](./routing-patterns/content-based-router.md)
- 📝 Message Filter (discard, don't route)
- 📝 Dynamic Router (discover destinations)
- 📝 Recipient List (multiple destinations)
- ✅ [Splitter](./routing-patterns/splitter.md)
- ✅ [Aggregator](./routing-patterns/aggregator.md)
- 📝 Resequencer (order out-of-sequence)
- 📝 Composed Message Processor (complex flow)
- 📝 Scatter-Gather (split, process, combine)
- 📝 Routing Slip (sequence at runtime)
- ✅ [Process Manager](./routing-patterns/process-manager.md)
- 📝 Message Broker (decouple sender/receiver)

---

## Transformation Patterns (6/6)

- 📝 Envelope Wrapper (add metadata)
- ✅ [Content Enricher](./transformation-patterns/content-enricher.md)
- 📝 Content Filter (remove data)
- 📝 Claim Check (large data reference)
- 📝 Normalizer (standardize format)
- 📝 Canonical Data Model (standard format)

---

## Messaging Endpoints (11/11)

- 📝 Messaging Gateway (encapsulate channel access)
- 📝 Messaging Mapper (map to domain objects)
- 📝 Transactional Client (transaction boundary)
- 📝 Polling Consumer (pull messages)
- ✅ [Event-Driven Consumer](./messaging-endpoints/event-driven-consumer.md)
- 📝 Competing Consumers (load balance)
- 📝 Message Dispatcher (distribute to handlers)
- 📝 Selective Consumer (filter messages)
- 📝 Durable Subscriber (persistent subscription)
- ✅ [Idempotent Receiver](./messaging-endpoints/idempotent-receiver.md)
- 📝 Service Activator (bridge to services)

---

## System Management (8/8)

- 📝 Control Bus (system administration)
- 📝 Detour (route for debugging)
- 📝 Wire Tap (observe without storing)
- ✅ [Message History](./system-management/message-history.md)
- 📝 Message Store (persistent history/queries)
- 📝 Smart Proxy (track published messages)
- 📝 Test Message (validate system)
- 📝 Channel Purger (clear channel)

---

## Summary

**Total Patterns**: 65
- **Fully Documented** (✅): 19 patterns (29%)
- **Stub/Brief** (📝): 46 patterns (71%)
- **Placeholder** (❌): 0 patterns

## Recent Expansions

- Process Manager now includes timeout scheduling guidance for long-running workflows
- Idempotent Receiver now includes timeout race-condition revalidation patterns
- Pattern Selection Guide now includes time-based workflow and EOS-boundary decision guidance

## Implementation Plan for Remaining Patterns

### Phase 2: High-Priority Stubs → Full Docs
These are most commonly referenced in modern systems:
1. Dead Letter Channel (reliability)
2. Saga/Compensation (distributed transactions)
3. Content Filter (transformation)
4. Message Store (observability)
5. Competing Consumers (scaling)
6. Correlation Identifier (tracking)

### Phase 3: Medium-Priority
System management, channels, and advanced routing:
7-15. Channel variants, Wire Tap, Detour, etc.

### Phase 4: Advanced/Legacy
Less frequently used but important for completeness:
16+. Format Indicator, Canonical Data Model, etc.

## Quick Reference: By Technology

### Apache Kafka
- Message Channel, Pub-Subscribe Channel, Partitions (routing)
- Competing Consumers (consumer groups)
- Message History (logs)
- Streams, Topology (Pipes and Filters)

### RabbitMQ
- Point-to-Point (queues), Pub-Sub (topic exchanges)
- Message Router (exchange routing)
- Dead Letter Exchanges, TTL (Message Expiration)
- Channels, Consumer Pool (Event-Driven Consumer)

### AWS (SQS/SNS/EventBridge)
- SQS = Point-to-Point, SNS = Pub-Sub
- EventBridge = Content-Based Router + Message Bus
- Step Functions = Process Manager
- Lambda = Event-Driven Consumer, Service Activator

### Azure (Service Bus/Event Grid)
- Service Bus Queues = P2P, Topics = Pub-Sub
- Event Grid = Content-Based Router
- Logic Apps = Process Manager
- Functions = Event-Driven Consumer

### Google Cloud (Pub/Sub)
- Pub/Sub Topics = Pub-Subscribe Channel
- Dataflow = Pipes and Filters, Splitter, Aggregator
- Workflows = Process Manager

---

## See Also
- [Pattern Selection Guide](./pattern-selection-guide.md) — Decision matrix for choosing patterns
- [Main README](./README.md) — Overview and category descriptions
- Individual pattern documents for deep dives

---

*Patterns from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

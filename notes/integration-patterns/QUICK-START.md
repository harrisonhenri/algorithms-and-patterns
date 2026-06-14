---
type: guide
domain: integration-patterns
tags: [integration-pattern, navigation, quickstart]
---

# Quick Navigation Guide

## 🚀 Start Here

**New to Enterprise Integration Patterns?**

1. Read [README.md](./README.md) — 5-min overview of 65 patterns
2. Check your use case in [Pattern Selection Guide](./pattern-selection-guide.md) — Decision matrix
3. Browse your category below

## 📚 By Category

### [Integration Styles](./integration-styles/) — Choose your integration approach
- **Messaging** (recommended) — Loose coupling, asynchronous
- Remote Procedure Invocation — Synchronous queries
- Shared Database / File Transfer — Legacy approaches

### [Messaging Channels](./messaging-channels/) — How messages flow
- **Point-to-Point Channel** — One receiver per message (queues)
- **Publish-Subscribe Channel** — All subscribers receive (events)
- Dead Letter Channel — Undeliverable messages
- Guaranteed Delivery — Persistent, durable
- Message Channel — Foundational concept

### [Message Construction](./message-construction/) — What message types
- **Event Message** — "This happened" (broadcast)
- **Command Message** — "Do this" (request action)
- **Request-Reply** — Async request-response
- Correlation Identifier — Track related messages
- Document Message — Data transfer

### [Routing Patterns](./routing-patterns/) — Where messages go
- **Content-Based Router** — Route by message content
- **Splitter** — Split composite into individuals
- **Aggregator** — Combine results
- **Process Manager** — Orchestrate workflows
- Message Filter — Discard uninteresting
- Routing Slip — Sequence at runtime

### [Transformation Patterns](./transformation-patterns/) — Convert messages
- **Content Enricher** — Add missing data
- Envelope Wrapper — Add headers
- Content Filter — Remove data
- Message Translator — Change format

### [Messaging Endpoints](./messaging-endpoints/) — App connection
- **Event-Driven Consumer** — React immediately (push)
- **Polling Consumer** — Pull when ready
- **Idempotent Receiver** — Handle duplicates safely
- Competing Consumers — Load balance
- Service Activator — Invoke services

### [System Management](./system-management/) — Observability & debugging
- **Message History** — Query message flow
- Wire Tap — Observe without storing
- Control Bus — Administration
- Message Store — Persistent queryable history
- Test Message — Validate system

## 🎯 By Use Case

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

## 🛠 By Technology

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

## 🔍 Finding What You Need

**I know the pattern name:**
→ Use browser search (Ctrl+F / Cmd+F) for quick find

**I know the problem I'm solving:**
→ Check [Pattern Selection Guide](./pattern-selection-guide.md) decision matrix

**I want to learn a category:**
→ Go to [category README](./integration-styles/README.md) for overview + links

**I want everything:**
→ See [COVERAGE.md](./COVERAGE.md) for all 65 patterns + status

## 📖 Reading Order (Progressive)

**Beginner:**
1. [Integration Styles README](./integration-styles/README.md) — Understand approaches
2. [Messaging](./integration-styles/messaging.md) — Why async?
3. [Message Channel](./messaging-channels/message-channel.md) — How messages flow
4. [Point-to-Point Channel](./messaging-channels/point-to-point-channel.md) + [Pub-Subscribe Channel](./messaging-channels/publish-subscribe-channel.md) — Channel types

**Intermediate:**
5. [Message types](./message-construction/) — Command, Event, Document
6. [Request-Reply](./message-construction/request-reply.md) + [Correlation Identifier](./message-construction/correlation-identifier.md) — Conversations
7. [Content-Based Router](./routing-patterns/content-based-router.md) — Routing basics
8. [Event-Driven Consumer](./messaging-endpoints/event-driven-consumer.md) + [Polling Consumer](./messaging-endpoints/polling-consumer.md) — Endpoints
9. [Idempotent Receiver](./messaging-endpoints/idempotent-receiver.md) — Reliability

**Advanced:**
10. [Splitter](./routing-patterns/splitter.md) + [Aggregator](./routing-patterns/aggregator.md) — Parallel processing
11. [Process Manager](./routing-patterns/process-manager.md) — Orchestration
12. [Dead Letter Channel](./messaging-channels/dead-letter-channel.md) — Error handling
13. [Message History](./system-management/message-history.md) — Observability
14. [Content Enricher](./transformation-patterns/content-enricher.md) + other transformations

## 🏗️ Pattern Coverage

**Fully documented**: 23 patterns (35%)
**Stubs/Brief**: 42 patterns (65%)
**Total**: 65 patterns (100%)

See [COVERAGE.md](./COVERAGE.md) for detailed status.

## 💡 Pro Tips

1. **Don't memorize patterns** — Understand problems; patterns are solutions to those problems
2. **Patterns work together** — Splitter + Aggregator, Request-Reply + Correlation ID, etc.
3. **Technology doesn't matter** — Use any technology (Kafka, RabbitMQ, cloud); patterns are universal
4. **Start simple** — Master Point-to-Point + Content-Based Router before advanced patterns
5. **Think async first** — Default to async patterns; use sync (RPC) only when justified

## 📚 Related Reading

- [Pattern Selection Guide](./pattern-selection-guide.md) — Full decision matrix
- [Main README](./README.md) — Overview of all 65 patterns
- [System Design: Event-Driven Architecture](../system-design/event-driven-architecture.md) — Applications of EIP patterns
- [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) — Original source (CC-BY)

---

*Navigation guide for [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

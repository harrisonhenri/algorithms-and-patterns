---
type: integration-pattern
category: integration-styles
aliases: [async-integration, messaging-integration]
tags: [integration-pattern, integration-styles, messaging, asynchronous]
---

# Messaging

## Problem

How can I integrate multiple applications so that they work together and can exchange information, when each application processing is independent and doesn't require immediate response?

## Solution

Have the applications connect asynchronously via messages. Senders and receivers are decoupled through a messaging channel and need not know about each other directly.

## Context & Forces

**When to use:**
- Loose coupling between applications is important
- Asynchronous processing is acceptable (or preferred)
- System must survive individual application failures
- Scalability across many services/instances
- Events or state changes need broadcast

**Avoid when:**
- Synchronous, immediate response absolutely required
- Request-response interaction pattern dominant
- Real-time streaming with minimal latency critical
- Complexity of async programming unacceptable to team

## Key Advantages

1. **Loose Coupling**: Sender doesn't know receivers; easy to add/remove consumers
2. **Failure Isolation**: One application failure doesn't cascade
3. **Scalability**: Queued messages survive load spikes
4. **Asynchronicity**: Non-blocking; sender returns immediately
5. **Distribution**: Works naturally across network boundaries
6. **Flexibility**: Complex routing rules possible (Content-Based Router)

## Key Considerations

1. **Eventual Consistency**: Results arrive asynchronously; not immediate
2. **Complexity**: Async programming requires understanding event-driven models
3. **Debugging**: Harder to trace multi-step workflows across systems
4. **Message Loss**: Must ensure delivery guarantees (Dead Letter Channel, Guaranteed Delivery)
5. **Ordering**: Messages may arrive out of sequence (Resequencer if needed)
6. **Correlation**: Track related messages across workflow (Correlation Identifier)

## Related Patterns

- **Foundation for**: All subsequent EIP messaging patterns
- **Alternative to**: File Transfer, Shared Database, Remote Procedure Invocation
- **Core channel types**: Point-to-Point Channel, Publish-Subscribe Channel
- **Coordination**: Process Manager, Saga patterns

## Implementation Notes

- **Technology-agnostic**: Works with Kafka, RabbitMQ, cloud platforms, message buses
- **Hybrid approach**: RPC for queries; Messaging for commands/events
- **Monitoring**: Message History, Wire Tap for observability
- **Testing**: Test Message, Detour patterns for quality assurance

## Example Use Cases

- **Microservices**: Service A publishes OrderCreated event; Service B subscribes, prepares shipment
- **Event-driven**: User action triggers async workflow (email, notification, analytics)
- **Batch processing**: Files/data queued; workers process asynchronously
- **Publish-subscribe**: Multiple subscribers to same event stream
- **Async request-reply**: Client sends Request Message; replies arrive via separate channel

## Messaging vs. RPC

| Aspect | Messaging | RPC |
|--------|-----------|-----|
| **Coupling** | Loose | Tight |
| **Latency** | Async (high latency OK) | Sync (low latency) |
| **Failure** | Isolated | Cascading |
| **Scalability** | High | Limited |
| **Complexity** | Moderate | Simple |
| **Reliability** | Built-in (queues) | Via retry logic |
| **Use case** | State changes, events | Queries, RPC |

## Modern Context

Messaging is foundational to:
- **Microservices architecture**: Inter-service async communication
- **Event-driven systems**: Event sourcing, CQRS patterns
- **Serverless**: Lambda/Function orchestration via messaging
- **Real-time data**: Streaming platforms (Kafka)
- **Cloud-native**: SNS/SQS, Pub/Sub, Event Hubs

## Getting Started

1. Choose technology: Kafka, RabbitMQ, cloud service
2. Define message types: Command, Event, Document messages
3. Establish channels: Point-to-Point or Pub-Subscribe
4. Handle failure: Dead Letter Channel, Guaranteed Delivery
5. Track workflows: Correlation Identifier, Message History
6. Monitor: Wire Tap, Message Store for observability

## References

- [Messaging pattern on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/Messaging.html)
- **Foundation pattern**: Spawns 60+ related patterns for routing, transformation, endpoints
- **Modern examples**: [EIP examples updated](https://www.enterpriseintegrationpatterns.com/ramblings/eip1_examples_updated.html) for Kafka, AWS, GCP, Azure
- Book: Enterprise Integration Patterns, Chapter 2 & 3+

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

---
type: integration-pattern
category: messaging-channels
aliases: [broadcast, topic, event-stream]
tags: [integration-pattern, messaging-channels, channel, publish-subscribe]
---

# Publish-Subscribe Channel

## Problem

How can the sender broadcast an event to all interested receivers?

## Solution

Send the event to a Publish-Subscribe Channel, which delivers a copy of the message to each receiver.

## Context & Forces

**When to use:**
- One event needs to reach multiple independent consumers
- Loose coupling; sender doesn't know who subscribers are
- Event notification pattern (user signed up, order placed, etc.)
- Broadcast or fanout required

**Avoid when:**
- Only one consumer should process message (use Point-to-Point)
- Tight coupling acceptable
- Request-response interaction pattern

## Key Characteristics

1. **Broadcast delivery**: Each subscriber receives independent copy
2. **Loose coupling**: Publishers and subscribers don't know about each other
3. **Event-driven**: Natural fit for event-based architecture
4. **Fan-out**: Single message → many destinations
5. **Multiple instances**: Multiple instances of same subscriber type = ?
   - **Competing Consumers**: Each instance gets copy (watch for duplicates)
   - **Durable Subscriber**: Subscribers registered; late subscribers can receive past events

## Implementation Notes

- **Technology**: Topics, fanout exchanges, event streams
- **Late subscribers**: Risk of missed events (use Durable Subscriber if needed)
- **Filtering**: Subscribers typically filter events they care about (Content Filter)
- **Ordering**: Event order maintained within single topic; parallel subscribers may process out-of-order

## Example Scenarios

1. **Order placed**: OMS publishes OrderPlaced; Warehouse, Billing, Analytics each subscribe
2. **User signup**: Auth service publishes UserSignedUp; Onboarding, CRM, Analytics react
3. **Data changed**: Database publishes Change Data Capture events; read models update
4. **System events**: Microservice publishes events; any interested service subscribes

## Related Patterns

- **Alternative to**: Point-to-Point Channel (when multiple recipients needed)
- **Content filter**: Subscribers can filter (Content Filter, Selective Consumer)
- **Ordering**: Resequencer if messages out of order
- **Late arrival**: Durable Subscriber (store events), Message Store (query history)
- **Fan-out**: Splitter pattern combined with Pub-Sub

## Technology Examples

- **Apache Kafka**: Topics are Pub-Sub; consumer groups optionally load-balance
- **RabbitMQ**: Topic exchange + multiple queues = Pub-Sub
- **AWS**: SNS (Pub-Sub), EventBridge (event routing), SQS (P2P)
- **Azure**: Service Bus Topics + Subscriptions
- **GCP**: Pub/Sub service
- **Apache Pulsar**: Topics with subscriptions
- **Redis**: Pub/Sub or Streams

## Durable Subscriber Consideration

**Basic Pub-Sub**: Subscribers must be listening; messages sent when subscriber down = lost
**Durable Subscriber**: Broker stores messages; subscriber retrieves when available
- Kafka: Offset tracking = durability built-in
- RabbitMQ: Queue + Topic Exchange = durability
- AWS SNS+SQS: SQS as dead-letter for durability

## Scale Considerations

- **Many subscribers**: Each must process independently; scale each separately
- **High throughput**: Partition topics; assign partitions to subscriber groups
- **Ordering guarantee**: Within single partition only; lossy across parallel subscribers
- **Late subscribers**: Consider Event Sourcing / Message Store for replay

## References

- [Publish-Subscribe Channel on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/PublishSubscribeChannel.html)
- **Counterpart**: Point-to-Point Channel
- **Resilience**: Durable Subscriber, Dead Letter Channel
- **Modern implementations**: Kafka, RabbitMQ, cloud event buses
- Book: Enterprise Integration Patterns, Chapter 4

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

---
type: integration-pattern
category: messaging-channels
aliases: [queue, point-to-point]
tags: [integration-pattern, messaging-channels, channel, point-to-point]
---

# Point-to-Point Channel

## Problem

How can the caller be sure that exactly one receiver will receive the document or perform the call?

## Solution

Send the message to a Point-to-Point Channel, which ensures that only one receiver will receive a particular message.

## Context & Forces

**When to use:**
- Exactly-once delivery required; one consumer must process each message
- Task assignment to workers (one worker per task)
- Load balancing across multiple consumers
- Work queue pattern

**Avoid when:**
- Multiple independent consumers need same message (use Publish-Subscribe)
- Broadcasting to all interested parties required
- Pub-Sub semantics more appropriate

## Key Characteristics

1. **Exclusive access**: Only one consumer receives each message; message consumed and removed from channel
2. **Queue semantics**: FIFO ordering (typically); messages wait until consumer available
3. **Load balancing**: Multiple consumers can share load; each message goes to one
4. **Scalability**: Add more consumers to handle load; messages automatically distributed

## Implementation Notes

- **Technology**: Implemented by message queues (RabbitMQ queues, AWS SQS, Azure Service Bus Queues, Kafka with consumer groups)
- **Consumer groups**: Multiple instances of same consumer = parallel processing, load balancing
- **Ordering**: Typically FIFO within single partition/shard; can reorder across parallel consumers
- **Polling**: Consumer pulls messages (Polling Consumer) or waits for delivery (Event-Driven Consumer)

## Example Scenarios

1. **Task queue**: Send emails as messages; email service has 10 worker threads consuming from queue
2. **Load balancing**: HTTP request batched as messages; multiple backend handlers process in parallel
3. **Work distribution**: Order processing; single queue, multiple Order Processors consuming
4. **Competing consumers**: Multiple instances of same service; each gets different message

## Related Patterns

- **Alternative to**: Publish-Subscribe Channel (when broadcast needed)
- **Consumer patterns**: Competing Consumers (load balance), Selective Consumer (filter)
- **Coordination**: Message Dispatcher (route single message to multiple sequential steps)
- **Resilience**: Dead Letter Channel (handle unprocessable messages), Guaranteed Delivery

## Trade-Offs

| Aspect | Point-to-Point | Publish-Subscribe |
|--------|----------------|-------------------|
| **Recipients** | One | Many |
| **Ordering** | Typical FIFO | Varies |
| **Load balancing** | Automatic | Manual (multiple topics) |
| **Flexibility** | Tight (single recipient) | Flexible (any subscriber) |
| **Efficiency** | One copy per message | One copy per subscriber |

## Common Implementations

- **RabbitMQ**: Queue (P2P) vs. Topic Exchange + Binding (Pub-Sub)
- **Apache Kafka**: Single partition = P2P ordering; consumer groups load balance
- **AWS**: SQS (P2P), SNS (Pub-Sub)
- **Azure**: Service Bus Queues (P2P), Topics (Pub-Sub)
- **In-memory**: Java BlockingQueue, Go channels

## References

- [Point-to-Point Channel on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/PointToPointChannel.html)
- **Counterpart**: Publish-Subscribe Channel
- **Consumer patterns**: Polling Consumer, Event-Driven Consumer, Competing Consumers
- Book: Enterprise Integration Patterns, Chapter 4

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

---
type: integration-pattern
category: messaging-endpoints
aliases: [message-consumer, message-receiver]
tags: [integration-pattern, messaging-endpoints, endpoint, consumer]
---

# Event-Driven Consumer

## Problem

How can an application automatically consume messages as they become available?

## Solution

Make the application a Event-Driven Consumer that waits for a message to arrive on the messaging channel and then processes the message.

## Context & Forces

**When to use:**
- Messages arrive with unpredictable frequency
- Want to minimize resource usage; only active when work available
- Throughput important; want to process many messages concurrently
- Can handle asynchronous, event-driven model

**Avoid when:**
- Predictable polling interval acceptable (Polling Consumer simpler)
- Low-frequency messages (waste of resources on listener thread)
- Synchronous request-response pattern (use Request-Reply)
- Cannot handle concurrent processing

## Key Characteristics

1. **Non-blocking**: Message handler invoked by broker; doesn't poll
2. **Concurrent**: Can process multiple messages in parallel (if handler allows)
3. **Event-driven**: React immediately when message arrives
4. **Callback model**: Implement listener/handler interface
5. **Resource efficient**: Not spinning on polling loop

## Implementation Pattern

**Structure:**
1. Register message handler/listener with messaging channel
2. Handler implements callback interface (onMessage, handle, etc.)
3. Broker calls handler when message arrives
4. Handler processes message
5. Confirm/acknowledge message (automatic or explicit)

**Pseudo-code:**
```
messageChannel.subscribe(new MessageHandler {
  void onMessage(Message msg) {
    try {
      processOrder(msg);
      msg.acknowledge(); // message successfully processed
    } catch (Exception e) {
      msg.nack(); // requeue for retry
      // or send to Dead Letter Channel
    }
  }
});
```

## Related Patterns

- **Alternative**: Polling Consumer (explicit polling, more control)
- **Concurrency**: Competing Consumers (multiple handlers, load balancing)
- **Filtering**: Selective Consumer (only handle certain messages)
- **Failure**: Dead Letter Channel (unhandleable messages)
- **Idempotency**: Idempotent Receiver (handle duplicates)

## Example Scenarios

1. **Web service handler**: HTTP request arrives → handler processes → response sent
2. **Message broker listener**: Message arrives on queue → background worker processes
3. **Event subscriber**: Event published → all subscribers' handlers invoked
4. **Stream processor**: Record appears in Kafka → handler processes in real-time
5. **Webhook receiver**: Incoming webhook → event handler processes

## Comparison: Event-Driven vs. Polling Consumer

| Aspect | Event-Driven | Polling |
|--------|--------------|---------|
| **Latency** | Low (immediate) | Depends on poll interval |
| **Resource usage** | Efficient (listener thread only) | Wasteful (constant polling) |
| **Control** | Less (broker decides) | More (explicit sleep) |
| **Scalability** | High (scales naturally) | Limited (poll interval * instance count) |
| **Complexity** | Moderate (async model) | Simple (synchronous) |
| **Late arrival** | Automatic | Manual (retry logic) |

## Implementation Notes

- **Acknowledgment**: Critical to confirm message handled
  - Implicit (auto-ack): Fast but risky; message lost if handler fails
  - Explicit: Handler confirms; safe but requires code
  - Transaction: Wrap in transaction; commit on success
- **Error handling**: What if handler fails?
  - Retry (configurable)
  - Dead Letter Channel (unrecoverable)
  - Error queue (human review)
- **Concurrency**: Handler can process messages in parallel
  - Thread pool; multiple handler instances
  - Each message gets isolated processing
  - Ensure thread safety in shared resources

## Technology Examples

- **JMS**: `MessageListener` interface, onMessage() callback
- **RabbitMQ**: Channel.basicConsume() with DeliverCallback
- **Apache Kafka**: KafkaListener annotation, poll-based but automatic
- **AWS SQS**: Receive messages, auto-acknowledge
- **Spring**: @EventListener, @KafkaListener, @RabbitListener
- **Node.js**: on('message') event handler
- **Go**: Channel receiver with goroutine

## Scalability Considerations

- **Throughput**: Multiple handler instances = automatic scaling
- **Ordering**: Single-threaded handler = ordered; multi-threaded = may reorder
- **Backpressure**: Handler slow → messages queue up (built-in backpressure)
- **Long messages**: Broker manages; don't load all into memory

## Error Handling Strategy

**Handler fails:**
1. **Transient error**: Retry (broker may auto-retry)
2. **Persistent error**: Send to Dead Letter Channel
3. **Unknown error**: Log, send to Dead Letter Channel, alert

**Example:**
```
try {
  processMessage(msg);
  acknowledge(msg);
} catch (TransientException e) {
  nack(msg); // requeue for retry
} catch (PersistentException e) {
  sendToDeadLetterChannel(msg);
  acknowledge(msg); // don't retry
} catch (Exception e) {
  log.error("Unexpected error", e);
  sendToErrorQueue(msg);
  acknowledge(msg);
}
```

## References

- [Event-Driven Consumer on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/EventDrivenConsumer.html)
- **Counterpart**: Polling Consumer (explicit polling alternative)
- **Concurrency**: Competing Consumers (multiple instances)
- **Advanced**: Message Dispatcher (distribute messages to multiple consumers)
- Book: Enterprise Integration Patterns, Chapter 9

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

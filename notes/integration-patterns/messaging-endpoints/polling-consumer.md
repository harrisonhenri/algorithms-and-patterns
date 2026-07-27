---
type: integration-pattern
category: messaging-endpoints
aliases: [pull-consumer, polling, message-pull]
tags: [integration-pattern, messaging-endpoints, endpoint, consumer]
---

# Polling Consumer

## Problem

How can an application consume a message when the application is ready?

## Solution

Make the application a Polling Consumer that polls the message channel for messages and processes them when they arrive.

## Context & Forces

**When to use:**
- Application controls when to consume (vs. being pushed)
- Predictable processing schedule
- Resource-constrained environment
- Simple blocking model acceptable

**Avoid when:**
- Low-latency required (polling adds delay)
- Messages arrive unpredictably (inefficient polling)
- Event-driven consumer better fit (reactive)

## Key Differences: Polling vs. Event-Driven

**Polling Consumer (Pull):**
```
Consumer polls channel: "Any messages?"
  ↓ 
Channel: "No messages"
Consumer waits/sleeps
Consumer polls again: "Any messages?"
  ↓
Channel: "Yes, message X"
Consumer processes message
```

**Event-Driven Consumer (Push):**
```
Message arrives on channel
  ↓
Broker immediately invokes handler
Handler processes message
```

## Polling Interval Trade-Off

**Short interval (poll every 100ms):**
- Pro: Low latency; messages processed quickly
- Con: Wasted cycles when no messages; high CPU

**Long interval (poll every 10s):**
- Pro: Low CPU; efficient resource usage
- Con: High latency; messages sit 5-10s on average

**Adaptive interval:**
- Start with long interval
- Increase frequency when messages arriving
- Back off when quiet

## Implementation Pattern

**Basic polling loop:**
```java
while (true) {
  Message msg = channel.receive(timeout=5000);
  if (msg != null) {
    processMessage(msg);
    msg.acknowledge();
  }
  // Loop continues; polls again
}
```

**Blocking call:**
- `receive(timeout)`: Blocks until message or timeout
- More efficient than tight loop
- Saves CPU while waiting

## Related Patterns

- **Alternative**: Event-Driven Consumer (push vs. pull)
- **Concurrency**: Competing Consumers (multiple polling instances)
- **Transactionality**: Transactional Client (atomic processing)

## Technology Examples

**JMS:**
```java
while (true) {
  Message msg = consumer.receive(5000);  // 5s timeout
  if (msg != null) {
    process(msg);
  }
}
```

**Kafka:**
```java
while (true) {
  ConsumerRecords<String, String> records = 
    consumer.poll(Duration.ofMillis(100));
  for (ConsumerRecord record : records) {
    process(record);
  }
}
```

**Spring Integration:**
```java
@Bean
public IntegrationFlow pollingFlow() {
  return IntegrationFlows
    .from(MessageChannels.queue(), 
          e -> e.poller(p -> p.fixedRate(1000)))
    .handle(...)
    .get();
}
```

## Scaling Polling Consumers

**Multiple consumers (Competing Consumers pattern):**
```
Channel with 100 messages
Consumer 1 polls: Gets message 1
Consumer 2 polls: Gets message 2
Consumer 3 polls: Gets message 3
...
Automatic load balancing
```

**Throughput calculation:**
```
If 1 consumer can process 10 msgs/sec
And channel has 1000 msgs/sec incoming
Need at least 100 consumers
```

## Throughput vs. Latency

**Throughput-focused:**
- Batch messages in single poll
- Process batch efficiently
- Higher latency per message (amortized)

**Latency-focused:**
- Poll frequently
- Small batches or single messages
- Lower latency but less efficient

## Error Handling

**Message processing fails:**
```
Polling Consumer poll
Process message
Exception thrown
  ↓
Option 1: Re-poll (lost message; bad)
Option 2: Nack/negative-ack → requeue
Option 3: Send to Dead Letter Channel
Option 4: Retry logic
```

## Polling Parameters

**Timeout**: How long to wait for message?
- Short (100ms): Responsive but inefficient
- Long (10s): Efficient but high latency

**Batch size**: How many messages poll at once?
- Single: Simple processing; many polls
- Batch: Efficient; more buffering

**Error handling**: Retry? Dead-letter? Skip?

## Testing Polling Consumers

1. **Message arrives**: Verify processed
2. **No message**: Verify timeout occurs
3. **Error during processing**: Verify error handling
4. **Multiple messages**: Verify all processed in order

## References

- [Polling Consumer on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/PollingConsumer.html)
- **Alternative**: Event-Driven Consumer (push vs. pull)
- **Scaling**: Competing Consumers (multiple polling instances)
- **Transactions**: Transactional Client (atomic processing)
- Book: Enterprise Integration Patterns, Chapter 9

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

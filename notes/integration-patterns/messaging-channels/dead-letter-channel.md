---
type: integration-pattern
category: messaging-channels
aliases: [undeliverable, error-queue, dead-letter]
tags: [integration-pattern, messaging-channels, reliability, error-handling]
---

# Dead Letter Channel

## Problem

What will the messaging system do with a message it cannot deliver?

## Solution

Place failed messages on a Dead Letter Channel where they can be handled out-of-band.

## Context & Forces

**When to use:**
- Message delivery may fail (undeliverable, unprocessable)
- Need to preserve message for analysis/retry
- Want to continue processing others without blocking
- Manual intervention may be needed

**Avoid when:**
- All messages guaranteed valid
- Failure handling handled elsewhere
- In-memory queues only (no persistence)

## Key Mechanisms

1. **Undeliverable**: Message can't be routed to destination
2. **Unprocessable**: Message received but can't be processed (validation error, handler exception)
3. **Dead Letter**: Move to separate channel for manual review
4. **Analysis**: Inspect, understand issue, reprocess or discard

## When Messages Go to Dead Letter

**Undeliverable:**
- Destination queue not found
- Message format doesn't match subscription filter
- Message expires before delivery

**Unprocessable:**
- Handler throws exception
- Message validation fails
- Required data missing
- Business rule violation

## Implementation Pattern

**Basic flow:**
```
Message arrives
  ↓
Try to process
  ↓
Success? → Acknowledge
Failure? → Move to Dead Letter Channel
          ↓
          Manual review
          ↓
          Fix issue? → Reprocess
          Give up? → Archive
```

**Technology:**
- RabbitMQ: Dead Letter Exchanges (requeue with TTL to DLX)
- Kafka: Error topic + consumer group
- AWS SQS: Dead Letter Queue (standard feature)
- Azure Service Bus: Dead Letter Subqueue
- Spring: ErrorChannel, @ServiceActivator(defaultOutputChannel=...)

## Example Scenarios

1. **Order processing**: Message without required fields → Dead Letter Channel → manual validation
2. **Data transformation**: Can't parse JSON → Dead Letter Channel → fix schema, reprocess
3. **Service unavailable**: Service down, retry timeout → Dead Letter Channel → wait, manually retry
4. **Permission denied**: Sender not authorized → Dead Letter Channel → audit, security review
5. **Rate limit**: Too many requests → Dead Letter Channel with delay → retry

## Message Preservation

**Information to capture:**
- Original message (for reprocessing)
- Error details (exception, validation errors)
- Timestamp (when failed)
- Attempt count (how many retries)
- Metadata (source, correlation ID)

**Storage:**
- Database table (queryable)
- File system (archived)
- Monitoring system (alerting)

## Manual Intervention Workflow

**Typical process:**
1. **Alert**: Dead letter message arrives
2. **Investigate**: Examine message, error, context
3. **Diagnose**: Root cause analysis
4. **Fix**: Apply fix (code, data, configuration)
5. **Reprocess**: Send message back to original queue or process manually

## Automatic Retry Pattern

**Don't immediately dead letter; retry first:**
```
Failed message
  ↓
Retry 1 (wait 5s)
  ↓
Retry 2 (wait 30s)
  ↓
Retry 3 (wait 2m)
  ↓
All retries exhausted → Dead Letter Channel
```

**Exponential backoff** prevents hammering failing service.

## Technology Patterns

**RabbitMQ:**
```
Queue with Dead Letter Exchange
Message TTL + Max Length
  → Expired/overflow messages → Dead Letter Exchange
  → Separate dead letter queue
```

**AWS SQS:**
```
Standard feature: Dead Letter Queue
Max receive count: 3 attempts
  → After 3 failed messages → moves to DLQ
```

**Kafka:**
```
No built-in; implement in application
Try-catch → send to error topic
Error topic monitoring → alerting
```

## Monitoring & Alerting

**Critical alerts:**
- Dead letter message count > threshold
- Same messageId repeated (not progressing)
- Age of oldest dead letter (stuck messages)

**Metrics:**
- Messages to dead letter / sec
- Time in dead letter (remediation lag)
- Success rate after reprocessing

## Prevention Strategies

**Reduce dead letters:**
1. **Validation early**: Validate before sending
2. **Contract clarity**: Clear message schema, version
3. **Error documentation**: Clear errors for consumers
4. **Monitoring**: Catch issues before they become dead letters

## References

- [Dead Letter Channel on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/DeadLetterChannel.html)
- **Related**: Invalid Message Channel, Guaranteed Delivery
- **Monitoring**: Message History, Wire Tap
- Book: Enterprise Integration Patterns, Chapter 4

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

---
type: integration-pattern
category: message-construction
aliases: [async-reply, reply-pattern]
tags: [integration-pattern, message-construction, message-type, request-reply]
---

# Request-Reply

## Problem

When an application sends a message, how can it get a response from the receiver?

## Solution

Send a Request-Reply Message that contains not just the request data, but also a Return Address telling the receiver where to send the reply message.

## Context & Forces

**When to use:**
- Need response from remote operation
- Asynchronous response acceptable (don't wait synchronously)
- Correlation between request and reply needed
- Loose coupling important (vs. RPC synchronous call)

**Avoid when:**
- Synchronous response required immediately (use RPC or REST)
- Request-response interaction fits (just use RPC; simpler)
- One-way fire-and-forget appropriate (use Command Message)

## Key Components

1. **Request Message**: Original request sent to receiver
2. **Return Address**: Where to send reply (queue/topic name)
3. **Correlation ID**: Tie reply back to original request
4. **Reply Message**: Response sent back to return address

## Implementation Pattern

**Sender:**
```
Request: {
  "requestId": "req-12345",
  "returnAddress": "http://requestor/orders/reply/req-12345",
  "correlationId": "order-abc",
  "action": "checkInventory",
  "sku": "WIDGET-1"
}
```

**Receiver responds:**
```
Reply: {
  "requestId": "req-12345",  // matches request
  "correlationId": "order-abc",  // tying back
  "inStock": true,
  "qty": 100
}
```

**Sender receives reply on return address** and correlates with original request.

## Related Patterns

- **Reply location**: Return Address (where to send response)
- **Correlation**: Correlation Identifier (tie request to reply)
- **Sequencing**: Message Sequence (multi-message conversation)
- **Timeout**: Message Expiration (set reply deadline)

## Technology Examples

- **JMS**: Message.getJMSReplyTo(), Message.getJMSCorrelationID()
- **RabbitMQ**: reply-to header, correlation-id property
- **HTTP Callback**: POST request, wait for webhook callback
- **Kafka**: Separate reply topic, correlation tracking
- **AWS SQS**: Message attributes for correlation, separate reply queue

## Timeout & Correlation

**Critical considerations:**
```
Sender: Send request, start timer, wait for reply
Wait time: Usually configurable (10s, 1m, etc.)
Timeout: If reply not received; treat as failure

Correlation: Must tie reply to correct request!
  - Use requestId in both request + reply
  - Or: Correlation ID (business-specific)
  - Risk: Mismatch = request-reply pairing fails
```

## Synchronous vs. Asynchronous Request-Reply

**Synchronous (blocking):**
```
Send request
WAIT for reply (blocking)
Receive reply
Continue
```
High latency if reply slow.

**Asynchronous (callback):**
```
Send request
Register callback
Continue (non-blocking)
Reply arrives → Callback triggered
```
Lower latency; more complex.

## Error Handling

**Reply never arrives:**
- Timeout (configurable)
- Retry (with caution; at-least-once semantics)
- Dead Letter Channel (unresolved requests)
- Circuit breaker (if receiver continuously failing)

**Malformed reply:**
- Unmatched correlation ID: Log, ignore, timeout eventual
- Missing required data: Error reply (vs. success reply)

## Comparison: Request-Reply vs. RPC

| Aspect | Request-Reply | RPC |
|--------|---------------|-----|
| **Mechanism** | Async messages | Sync call |
| **Latency** | Higher | Lower |
| **Coupling** | Loose | Tight |
| **Complexity** | Moderate | Simple |
| **Scaling** | Better | Limited |
| **Failure** | Isolated | Cascading |

## Return Address Variations

**Static queue:**
```
All replies go to: reply-queue://myapp/replies
```

**Dynamic (per request):**
```
Reply to: reply-queue://myapp/requests/req-12345
Receiver sends reply to this unique queue
Pro: Can use per-request reply queue
Con: More queues to manage
```

## References

- [Request-Reply on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/RequestReply.html)
- **Components**: Return Address, Correlation Identifier
- **Sequences**: Message Sequence (multi-step conversations)
- **Timeout**: Message Expiration
- Book: Enterprise Integration Patterns, Chapter 3

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

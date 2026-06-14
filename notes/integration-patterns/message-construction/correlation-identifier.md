---
type: integration-pattern
category: message-construction
aliases: [correlation-id, tracking-id, request-id]
tags: [integration-pattern, message-construction, tracking, correlation]
---

# Correlation Identifier

## Problem

How does a requestor that has received a reply know which request this is the reply for?

## Solution

When an application sends a message, it adds a Correlation Identifier — a unique ID that the reply can refer back to, allowing the requestor to match reply with request.

## Context & Forces

**When to use:**
- Request-Reply pattern (async response)
- Multiple requests in flight (need matching)
- Tracking workflows across systems
- Audit trail and traceability

**Avoid when:**
- Single request-response (no correlation needed)
- Synchronous RPC (immediate reply)
- Fire-and-forget (no response expected)

## Key Concept

**Problem scenario:**
```
Requestor sends 5 requests:
  Req-1: Check inventory for item A
  Req-2: Check inventory for item B
  Req-3: Check inventory for item C
  Req-4: Check price for item A
  Req-5: Check price for item D

Replies arrive (out of order):
  Rep-X: 100 units available
  Rep-Y: $29.99
  Rep-Z: 50 units available
  ...

How does requestor know which reply goes with which request?
Answer: Correlation ID!
```

## Solution: Correlation ID

**Sender:**
```json
{
  "correlationId": "corr-12345",
  "requestType": "InventoryCheck",
  "itemId": "A"
}
```

**Receiver sends reply:**
```json
{
  "correlationId": "corr-12345",  // ← matches request
  "quantity": 100
}
```

**Requestor receives reply:**
```
Find pending request with correlationId = "corr-12345"
Deliver response to that request
```

## Correlation ID Sources

**Option 1: Requestor generates**
```
Requestor creates unique ID before sending
  correlationId = UUID.randomUUID()
Send in request; expect in response
```

**Option 2: Receiver generates**
```
Receiver creates ID from request
  correlationId = message.requestId  (if present)
  or correlationId = newUUID()
Send in response
```

**Option 3: Conversation ID**
```
Multi-message conversation = single correlationId
All messages in conversation carry same ID
Tracks entire workflow
```

## Related Patterns

- **Request-Reply**: Correlation ID enables async request-reply
- **Return Address**: Where to send reply
- **Message Sequence**: Correlate multi-message conversations
- **Message History**: Track messages by correlation ID

## Implementation Patterns

**HTTP header:**
```
X-Correlation-ID: corr-12345
X-Request-ID: req-98765
X-Trace-ID: trace-11111
```

**Message property:**
```
Message.CorrelationID = "corr-12345"
Message.GroupID = "order-ABC"  (grouping)
```

**JSON field:**
```json
{
  "correlationId": "corr-12345",
  "traceId": "trace-11111",
  "spanId": "span-22222"
}
```

## Tracking Workflows

**Single request-reply:**
```
Request → correlationId = "corr-1"
Reply   → correlationId = "corr-1"
```

**Multi-step workflow:**
```
OrderService → OrderPlaced event (correlationId = "order-ABC")
  ↓
WarehouseService receives, publishes ItemsReserved (same correlationId = "order-ABC")
  ↓
BillingService receives, publishes InvoiceCreated (same correlationId = "order-ABC")
  ↓
Track entire flow via correlationId = "order-ABC"
```

## Distributed Tracing Integration

**Modern correlation:**
```
correlationId (business): order-12345
traceId (distributed tracing): trace-uuid
spanId: span-uuid
parentSpanId: parent-uuid

All messages carry all IDs for full observability
```

**Tools:**
- Jaeger, Zipkin (distributed tracing)
- OpenTelemetry (standard correlation)
- APM platforms (automatic instrumentation)

## Storage & Querying

**Query by correlation ID:**
```sql
SELECT * FROM messages
WHERE correlationId = 'order-ABC'
ORDER BY timestamp
```

**Analytics:**
```
Group messages by correlationId
Analyze workflow patterns
Performance by correlationId
Error rates by correlationId
```

## Best Practices

1. **Always include**: Every message should carry correlation ID
2. **Propagate**: Pass downstream; don't create new
3. **Unique**: Use UUID or similar; avoid guessing
4. **Immutable**: Don't change mid-workflow
5. **Queryable**: Store in searchable medium

## Example: Order Processing

```
User clicks "Place Order"
  → OrderService generates: correlationId = UUID()
  → Creates Order with correlationId
  → Publishes OrderPlaced(correlationId)

WarehouseService receives:
  → Reads correlationId from OrderPlaced
  → Reserves inventory
  → Publishes ItemsReserved(correlationId)

BillingService receives:
  → Reads correlationId from OrderPlaced
  → Creates invoice
  → Publishes InvoiceCreated(correlationId)

User visits order status page:
  → Query: SELECT * FROM events WHERE correlationId = ...
  → Shows: Order placed, inventory reserved, invoice created
```

## Debugging with Correlation ID

**Find all related messages:**
```
correlationId = "order-ABC"
Shows entire workflow: when each step occurred, duration, errors
Helps diagnose: Where did it slow down? Where did it fail?
```

## References

- [Correlation Identifier on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/CorrelationIdentifier.html)
- **Pair**: Return Address (where to reply), Request-Reply (how to respond)
- **Tracking**: Message History (query by correlation ID)
- **Tracing**: OpenTelemetry, Jaeger (modern distributed tracing)
- Book: Enterprise Integration Patterns, Chapter 3

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

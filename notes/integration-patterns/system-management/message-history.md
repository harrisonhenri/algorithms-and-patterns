---
type: integration-pattern
category: system-management
aliases: [message-tracing, audit-trail, message-tracking]
tags: [integration-pattern, system-management, observability, debugging]
---

# Message History

## Problem

How can we effectively analyze and debug the flow of messages in a loosely coupled system?

## Solution

Store a copy of each message sent through the system in a Message Store along with information identifying its origin. The Message History then is a record of all the messages, along with the order in which they were processed, which applications touched them and in what sequence.

## Context & Forces

**When to use:**
- Debugging complex multi-system workflows
- Audit requirements; trace message path through system
- Investigating failures; understand flow leading to error
- Performance analysis; identify bottlenecks
- Compliance; record transaction history

**Avoid when:**
- Volume so high storage becomes issue (sampling or aggregation needed)
- Real-time processing; history adds latency
- Privacy concerns; sensitive data in messages
- Simple systems; overhead not justified

## Key Mechanisms

1. **Capture**: Intercept messages at key points (channels, routers, endpoints)
2. **Enrich**: Add metadata (timestamp, origin, routing info, correlation ID)
3. **Store**: Persist to database, log file, or data warehouse
4. **Query**: Retrieve history for analysis, debugging, auditing

## Capture Points

**Typical capture locations:**
- At channel entry (all messages)
- At router outputs (which destination chosen)
- At transformer outputs (before/after data)
- At endpoint entry (message delivered to application)
- At error handlers (failures, dead-letter)

**Metadata to capture:**
```
{
  "timestamp": "2026-05-16T10:30:00Z",
  "messageId": "msg-12345",
  "correlationId": "corr-98765",
  "source": "OrderService",
  "destination": "InventoryService",
  "messageType": "OrderPlaced",
  "status": "success",
  "duration": 145,  // milliseconds
  "errorMessage": null,
  "metadata": {...}
}
```

## Implementation Approaches

**Approach 1: Interceptor/Middleware**
```
MessageChannel.addInterceptor(historyRecorder);
// Records all messages flowing through channel
```

**Approach 2: Dedicated logger**
```
- Explicit history.record(message) calls
- Fine-grained control; requires code changes
```

**Approach 3: Message Store**
```
- Broker persists all messages to storage
- Kafka: Log-compacted topics = built-in history
- Database: Custom schema for messages + metadata
```

## Related Patterns

- **Related trackers**: Wire Tap (observe without persistence), Correlation Identifier (tie messages)
- **Storage**: Message Store (persistent history), Event Sourcing (event-based replay)
- **Visibility**: Control Bus (system administration), Detour (route for debugging)

## Example Scenarios

1. **Order debugging**: Trace order through order service → inventory → warehouse → shipping
2. **Failure analysis**: "Order 12345 failed; review history to find where"
3. **Performance**: "Why is this order type slow? Review timings at each step"
4. **Audit trail**: "Prove that this transaction was processed correctly" (compliance)
5. **CQRS replay**: "Rebuild read model from event history"

## Storage Strategies

**Local logs:**
- Simplest; logs per application
- Hard to correlate across systems
- Good for single-app debugging

**Centralized database:**
- Single source of truth
- Query across all systems
- Scalability concern; requires index strategy

**Data warehouse:**
- Append-only (efficient storage)
- Full query capability (SQL)
- Latency acceptable for analysis (not real-time)

**Event stream (Kafka):**
- Built-in durability
- Replay capability
- Real-time analysis possible
- Scalable architecture

## Query Examples

**Find message flow:**
```
SELECT * FROM message_history
WHERE correlationId = 'corr-98765'
ORDER BY timestamp
```

**Performance analysis:**
```
SELECT source, destination, AVG(duration) as avg_latency
FROM message_history
WHERE messageType = 'OrderPlaced'
  AND timestamp > now() - interval '1 hour'
GROUP BY source, destination
ORDER BY avg_latency DESC
```

**Error tracking:**
```
SELECT * FROM message_history
WHERE status = 'error'
  AND timestamp > now() - interval '1 day'
ORDER BY timestamp DESC
LIMIT 100
```

**Audit trail:**
```
SELECT * FROM message_history
WHERE source = 'InventoryService'
  AND destination = 'Database'
  AND timestamp BETWEEN '2026-05-15' AND '2026-05-16'
```

## Technology Implementations

- **ELK Stack**: Logstash captures, Elasticsearch stores, Kibana visualizes
- **Kafka**: Log-compacted topics, consumer offset tracking
- **Distributed tracing**: Jaeger, Zipkin (correlated logging)
- **Observability platform**: Datadog, New Relic (APM + messaging)
- **Custom**: Application logging → centralized log store
- **Cloud**: AWS CloudWatch, Azure Monitor, GCP Cloud Logging

## Storage Capacity Considerations

**Volume calculation:**
- Messages/sec × Size per message × Retention period
- Example: 1000 msg/sec × 1KB × 30 days = 2.6TB

**Retention strategy:**
- Hot data (recent): Fast access (database)
- Warm data (weeks old): Slower access (archive)
- Cold data (months old): Compliance only (cold storage)

**Sampling:**
- Too much data? Sample: store 1 in 10, or sample by type
- Risk: May miss rare issues

## Privacy & Compliance

**Sensitive data:**
- Mask PII before storing history
- Encrypt at rest
- Audit access to history
- Retention policy (GDPR: deletion after X months)

## Limitations & Pitfalls

1. **Overhead**: Recording adds latency, storage cost
2. **Storage bloat**: High volume = expensive storage; need retention policy
3. **Performance queries**: Large dataset → slow queries; need indexing
4. **Late capture**: If capturing after error, some context lost
5. **Debugging complexity**: Still need correlation IDs to tie messages together

## Debugging Workflow

1. **Identify issue**: "Order 12345 failed"
2. **Get correlation ID**: From error logs or UI
3. **Query history**: `SELECT * FROM message_history WHERE correlationId = '...'`
4. **Review timeline**: Message path, timings, errors
5. **Root cause**: Identify which step failed, why, potential fix

## References

- [Message History on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/MessageHistory.html)
- **Related**: Wire Tap (similar info, less persistent), Correlation Identifier (tie messages)
- **Storage**: Message Store (history as queryable store)
- **Advanced**: Distributed Tracing (cross-process correlation)
- Book: Enterprise Integration Patterns, Chapter 10

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

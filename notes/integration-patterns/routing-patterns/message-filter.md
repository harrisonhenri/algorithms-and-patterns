---
type: integration-pattern
category: routing-patterns
aliases: [message-selector, content-filter-routing]
tags: [integration-pattern, routing-patterns, routing, filtering]
---

# Message Filter

## Problem

How can a component avoid receiving uninteresting messages?

## Solution

Use a Message Filter to discard uninteresting messages before they reach a processing step.

## Context & Forces

**When to use:**
- Only interested in subset of messages
- Want to filter at source (vs. processing & discarding)
- Multiple receivers; only some care about message
- Reduce processing overhead

**Avoid when:**
- All messages needed (no filtering)
- Content-Based Routing more appropriate (route, don't discard)
- Filtering logic belongs in application (not messaging)

## Key Difference: Filter vs. Router

**Content-Based Router**: Routes to different destinations based on condition
```
IF amount > 1000 → HighValueQueue
ELSE → StandardQueue
```

**Message Filter**: Discards uninteresting messages; passes through interesting
```
IF amount > 1000 → Pass through
ELSE → Discard (dead-end)
```

## Implementation Pattern

**Input stream:**
```
Message 1: {"amount": 100, ...}     → ❌ Discard (< 1000)
Message 2: {"amount": 2500, ...}    → ✅ Pass through (>= 1000)
Message 3: {"amount": 50, ...}      → ❌ Discard (< 1000)
Message 4: {"amount": 5000, ...}    → ✅ Pass through (>= 1000)
```

**Output stream:**
```
Message 2: {"amount": 2500, ...}    → Downstream processing
Message 4: {"amount": 5000, ...}    → Downstream processing
```

## Filtering Strategies

**Simple condition:**
```
IF message.type == "OrderPlaced" THEN pass through
```

**Complex condition:**
```
IF (message.amount > 1000 AND message.country == "US") THEN pass through
```

**Regex/pattern:**
```
IF message.email MATCHES ".*@company.com" THEN pass through
```

**Subscriber selector (message broker):**
```
Kafka: topic.name LIKE "orders.%"
RabbitMQ: Binding key matches pattern
AWS: SNS filter policy on subscription
```

## Related Patterns

- **Opposite**: Content-Based Router (route, don't filter)
- **Combined**: Filter → Router → Process (filter, then route, then handle)
- **Storage**: Dead Letter Channel (where filtered messages go? optional)
- **Selective Consumer**: Similar filtering at consumer level

## Example Scenarios

1. **Order filtering**: Only process orders > $1000 (high-value path)
2. **Priority filtering**: Only handle priority=urgent (critical path)
3. **Geography filtering**: Only orders from US (regional service)
4. **Event filtering**: Only subscribe to events of interest (Kafka consumer)
5. **User filtering**: Only messages from verified users

## Implementation Notes

**Broker-side filtering (preferred):**
- Filter at subscription (Kafka, RabbitMQ, AWS SNS)
- Messages don't consume bandwidth/processing if filtered
- More efficient

**Application-side filtering:**
- Receive all messages, filter in app logic
- More flexible but less efficient
- Use when filtering logic is application-specific

## Technology Examples

**Kafka Consumer:**
```java
// Register only for topics matching pattern
consumer.subscribe(Pattern.compile("orders.*"));
```

**RabbitMQ Subscription:**
```
Queue: HighValue
Binding to: orders.* (pattern)
Only messages matching pattern delivered
```

**AWS SNS Subscription Filter:**
```json
{
  "price": [{"numeric": [">", 1000]}]
}
```

**Spring Integration:**
```java
@Bean
public IntegrationFlow filterFlow() {
  return IntegrationFlows
    .from(...)
    .filter(m -> (Integer) m.getPayload() > 1000)
    .to(...)
    .get();
}
```

## Performance Impact

**Broker-side filtering:**
- No bandwidth wasted on filtered messages
- Reduces load on consumer
- Recommended for high-volume scenarios

**Application-side filtering:**
- Must receive and process all messages
- More flexible but less scalable
- Use for complex, application-specific logic

## Dropped Messages

**What happens to filtered messages?**

**Option 1: Discard silently**
- Most common
- Filtered messages simply dropped
- Risk: Message lost if filter logic wrong

**Option 2: Dead Letter Channel**
- Important messages that get filtered
- Send to separate channel for review
- "Why was this filtered out?"

**Option 3: Archive**
- Keep record of filtered messages
- Queryable for debugging/audit
- Database storage or log file

## Design Considerations

1. **Filter early**: At broker/subscription, not application
2. **Document criteria**: Why filter? What's excluded?
3. **Testable**: Unit test filter conditions
4. **Monitorable**: Track filtering rate, dropped count
5. **Reversible**: Can undo filtering if needed

## References

- [Message Filter on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/MessageFilter.html)
- **Pair**: Content-Based Router (route vs. filter)
- **Consumer-level**: Selective Consumer (similar filtering)
- **Storage**: Dead Letter Channel (optional; archived filtered messages)
- Book: Enterprise Integration Patterns, Chapter 5

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

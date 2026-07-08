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

## Channel Filter vs. Message Content Filter

It's important to distinguish between two related but different filtering approaches:

### Channel Filter (Topic/Routing Key Pattern)

Consumer subscribes only to channels matching a pattern:

```java
consumer.subscribe(Pattern.compile("orders.*"));
```

Result: Only `orders.created`, `orders.updated`, `orders.cancelled` arrive; `payments.*` is never delivered.

**This is NOT the classic Message Filter EIP.** It filters by **channel name**, reducing network traffic at subscription.

### Message Content Filter (True EIP Pattern)

All messages arrive from a channel; filter decides based on **message content**:

```java
consumer.subscribe("orders.created");
// All messages arrive:
records.forEach(record -> {
    Order order = record.value();
    if (order.amount() > 1000) {
        process(order);  // ✅ Accept
    } else {
        // ❌ Discard
    }
});
```

**This matches the Message Filter EIP: inspect content and decide pass/discard.**

### Key Differences

| Aspect             | Channel Filter          | Content Filter                                                            |
| ------------------ | ----------------------- | ------------------------------------------------------------------------- |
| Decision based on  | Topic/channel name      | Message payload                                                           |
| Network traffic    | Reduced                 | Full bandwidth consumed                                                   |
| Broker involvement | Yes (subscription)      | No (application-side) or Yes (if broker supports content-based selectors) |
| Flexibility        | Limited to naming       | Unlimited conditions                                                      |
| Example            | `subscribe("orders.*")` | `if (price > 1000)`                                                       |

**In Kafka specifically:**

- Channel filtering: `Pattern.compile("orders.*")` ← Not a true Message Filter
- Content filtering: Consumer-side `if` logic ← True Message Filter EIP
- Hybrid approach: Kafka Streams / ksqlDB for stream-level filtering

## Technology Examples

### True Broker-Side Content Filtering

**JMS Message Selectors (ActiveMQ, WebSphere):**

```java
// Broker evaluates selector before delivery
MessageConsumer consumer = session.createConsumer(
    queue,
    "status = 'APPROVED' AND amount > 1000"
);
```

The broker inspects message properties and only delivers matching messages. This is the cleanest broker-side implementation of Message Filter EIP.

**RabbitMQ Headers Exchange:**

```text
Order Created Event
        |
    Headers Exchange
        |
  (country = 'BR')
        |
   Queue: BrazilOrders
```

Messages are routed based on headers; mismatches are rejected.

### Application-Side Content Filtering

**Kafka Consumer (Content-Based):**

```java
// Subscribe to topic; filter based on message content
consumer.subscribe(List.of("orders"));

consumer.poll(Duration.ofSeconds(1))
    .forEach(record -> {
        Order order = record.value();
        // True Message Filter: inspect content
        if (order.status().equals("APPROVED") && order.amount() > 1000) {
            processHighValue(order);  // ✅ Pass through
        }
        // else: discard ❌
    });
```

**Note:** Kafka's `Pattern.compile("orders.*")` is **channel filtering**, not content filtering (see Channel Filter vs. Message Content Filter section).

**Spring Integration:**

```java
@Bean
public IntegrationFlow filterFlow() {
    return IntegrationFlows
        .from(...)
        .filter(m -> ((Order) m.getPayload()).amount() > 1000)  // Content-based
        .to(...)
        .get();
}
```

### Integration Layer Filtering

**Apache Camel:**

```java
from("kafka:orders")
    .filter(simple("${body.status} == 'APPROVED' && ${body.amount} > 1000"))
    .to("bean:orderProcessor");
```

Camel acts as the integration layer, inspecting message content and deciding pass/discard.

**AWS SNS Subscription Filter Policy:**

```json
{
  "status": ["APPROVED"],
  "price": [{ "numeric": [">", 1000] }]
}
```

Broker-side filtering before delivery to subscribers.

## Broker Support Comparison

| Technology        | Broker-Side Content Filtering? | Method                          |
| ----------------- | ------------------------------ | ------------------------------- |
| **JMS**           | ✅ Yes                         | Message Selectors (SQL-like)    |
| **ActiveMQ**      | ✅ Yes                         | Message Selectors               |
| **RabbitMQ**      | ✅ Yes                         | Headers Exchange, Routing Keys  |
| **AWS SNS**       | ✅ Yes                         | Subscription Filter Policy      |
| **Kafka**         | ❌ Generally No                | Consumer-side or Streams/ksqlDB |
| **Kafka Streams** | ✅ Via stream processor        | `stream.filter(predicate)`      |
| **ksqlDB**        | ✅ Via stream processor        | SQL `WHERE` clause              |
| **Apache Camel**  | ✅ Via integration layer       | `filter()` DSL                  |

## Performance Impact

**Broker-side filtering:**

- No bandwidth wasted on filtered messages
- Reduces load on consumer
- Recommended for high-volume scenarios
- Not available for all brokers/use cases

**Application-side filtering:**

- Must receive and process all messages
- More flexible but less scalable
- Use for complex, application-specific logic
- Better when filtering criteria changes frequently

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

_Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)_

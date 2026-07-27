---
type: integration-pattern
category: message-construction
tags: [integration-pattern, message-construction, message-type, event]
---

# Event Message

## Problem

How can messaging be used to transmit events from one application to another?

## Solution

Send an Event Message, which notifies other applications that something has happened.

## Context & Forces

**When to use:**

- State change in one system must notify others
- Multiple independent subscribers need notification
- Loose coupling; publisher doesn't know subscribers
- Asynchronous notification appropriate

**Avoid when:**

- Publisher needs acknowledgment all received (use Command Message)
- Response needed (use Request-Reply)
- Simple data transfer without semantic meaning (use Document Message)

## Event Message Structure

**Typical event:**

```json
{
  "eventType": "OrderPlaced",
  "eventId": "evt-98765",
  "timestamp": "2026-05-16T10:30:00Z",
  "aggregateId": "order-12345",
  "aggregatType": "Order",
  "data": {
    "orderId": "ORD-12345",
    "customerId": "CUST-5555",
    "totalAmount": 999.99
  },
  "metadata": {
    "source": "OrderService",
    "version": 1
  }
}
```

**Key elements:**

- Event type (what happened)
- Event ID (unique identifier)
- Timestamp (when occurred)
- Aggregate ID (what changed)
- Data (relevant information)
- Metadata (provenance)

## Event vs. Command vs. Document

| Pattern      | Intent          | Direction | Response |
| ------------ | --------------- | --------- | -------- |
| **Event**    | "This happened" | Broadcast | No       |
| **Command**  | "Do this"       | Directed  | Optional |
| **Document** | "Here's data"   | Transfer  | No       |

## Implementation Notes

- **Naming**: Verb in past tense ("OrderPlaced", "PaymentProcessed")
- **Immutable**: Event represents what occurred; can't change past
- **Complete**: Include all data subscribers might need
- **Versioning**: Version events for schema evolution

## Related Patterns

- **Distribution**: Publish-Subscribe Channel (event distribution)
- **Late arrival**: Durable Subscriber, Message Store (history)
- **Orchestration**: Process Manager (reacts to events)
- **Sourcing**: Event Sourcing (all state from events)

## Example Scenarios

1. **Order placed**: OMS publishes OrderPlaced; Warehouse, Billing, Analytics listen
2. **User registered**: Auth publishes UserRegistered; Onboarding, CRM, Analytics react
3. **Payment failed**: Payment service publishes PaymentFailed; Order, Customer Care react
4. **Data synced**: Database publishes DataChanged; other systems update read models
5. **Milestone reached**: Project publishes MilestoneCompleted; team notified

## Event-Driven Architecture

**Pattern:**

```
Event Source (generates events)
    ↓
Event Stream (carries events)
    ↓
Event Subscribers (react to events)
    ↓
Reactions (email, notifications, state changes)
```

**Choreography (event-driven coordination):**

```
OrderService publishes OrderPlaced
    → WarehouseService listens, publishes ItemsReserved
    → BillingService listens, publishes InvoiceCreated
    → (no central coordinator)
```

**Orchestration (centralized coordination):**

```
OrderService publishes OrderPlaced
    → ProcessManager listens, sends commands to Warehouse, Billing
    → Publishes OrderCompleted when all done
```

## Guarantees & Concerns

**Delivery:**

- At-most-once (may miss events)
- At-least-once (may duplicate)
- Exactly-once (ideal; hard to achieve)

**Ordering:**

- Total order (all events in order)
- Causal order (causally dependent events ordered)
- No order (independent events unordered)

**Subscribers:**

- May miss events (if not listening when published)
- May arrive out-of-order (if processing in parallel)
- May receive duplicates (network retry)

## Event Sourcing Pattern

**Store events instead of state:**

```
Traditional:     State (current account balance)
Event Sourced:   Events (deposits, withdrawals, fees)
                 → Replay to get current balance
```

**Benefits:**

- Complete audit trail
- Can rebuild state from events
- Temporal queries (what was balance on date X?)

## Large Event Payloads

**Problem:** Events too large; storage/bandwidth

**Solutions:**

1. **Claim Check**: Store large data separately; reference in event
2. **Projection**: Include only essential; subscribers query for details
3. **Compression**: Compress event payload

## Late Subscribers

**Problem:** New subscriber misses past events

**Solutions:**

1. **Message Store**: Persist all events; new subscriber can query/replay
2. **Durable Subscriber**: Broker stores events for subscribers
3. **Event Sourcing**: All history in event log (Kafka, Event Store)

## Testing Events

1. **Publish event**: Verify correct fields, data
2. **Subscribe**: Verify handler receives and processes correctly
3. **Multiple subscribers**: Verify independent processing
4. **Replay**: Verify can replay from history without duplicates

## Technology Implementation

### Apache Kafka

**Publishing an event:**

```yaml
# Topic config
Topic: order-events
Partitions: 3
Replication Factor: 3
Retention: 7 days

# Producer code (pseudocode)
event = {
  eventType: "OrderPlaced",
  eventId: "evt-98765",
  timestamp: 2026-05-16T10:30:00Z,
  aggregateId: "order-12345",
  data: { orderId: "ORD-12345", customerId: "CUST-5555", totalAmount: 999.99 }
}
producer.send("order-events", key="order-12345", value=json(event))
```

**Subscribing to events:**

```yaml
# Consumer config
Group: warehouse-service
Topic: order-events
From: latest (or "earliest" to replay)

# Consumer code (pseudocode)
@KafkaListener(topics = "order-events")
handleOrderPlaced(OrderPlacedEvent event) {
  if (event.eventType == "OrderPlaced") {
    warehouse.reserveItems(event.data.orderId, event.data.items)
  }
}
```

### RabbitMQ

**Publishing an event:**

```yaml
# Exchange config
Name: order-events (type: topic)
Durable: true

# Producer code (pseudocode)
event = { eventType: "OrderPlaced", ... }
channel.basicPublish(
  exchange="order-events",
  routingKey="order.placed",
  body=json(event),
  properties={persistent: true}
)
```

**Multiple subscribers:**

```yaml
# Each service declares its own queue
Warehouse Queue: warehouse-queue
  ↓ (binds to) ↓
  exchange: order-events, routing key: order.*

Billing Queue: billing-queue
  ↓ (binds to) ↓
  exchange: order-events, routing key: order.*

# Each consumer independently processes
@RabbitListener(queues = "warehouse-queue")
handleOrderPlaced(OrderPlacedEvent event) { ... }

@RabbitListener(queues = "billing-queue")
handleOrderPlaced(OrderPlacedEvent event) { ... }
```

### AWS (SNS + SQS / EventBridge)

**SNS approach (Pub-Sub):**

```yaml
# SNS Topic
Topic: OrderEvents
Subscribers:
  - Warehouse Queue (SQS)
  - Billing Queue (SQS)
  - Analytics Lambda

# Publish event
sns.publish(
  TopicArn="arn:aws:sns:order-events",
  Message=json({ eventType: "OrderPlaced", ... })
)

# Each subscriber receives copy
warehouse_handler(message) { ... }
billing_handler(message) { ... }
analytics_handler(message) { ... }
```

**EventBridge approach (event routing):**

```yaml
# Event pattern
Detail Type: Order
Source: order.service
Detail-type: OrderPlaced

# Rule 1: Send to Warehouse SQS
Rule: route-to-warehouse
Pattern: { source: ["order.service"], detail-type: ["OrderPlaced"] }
Target: warehouse-queue

# Rule 2: Send to Billing Lambda
Rule: route-to-billing
Pattern: { source: ["order.service"], detail-type: ["OrderPlaced"] }
Target: billing-lambda

# Publish
eventBridge.putEvent({
  Source: "order.service",
  DetailType: "OrderPlaced",
  Detail: json({ orderId: "ORD-12345", ... })
})
```

### Azure Service Bus

**Topic + Subscriptions:**

```yaml
# Topic config
Topic: order-events
Subscriptions:
  - warehouse-sub
  - billing-sub
  - analytics-sub

# Publish event
topicClient.sendMessage(
  new Message(json({ eventType: "OrderPlaced", ... }))
)

# Subscribe (Warehouse)
subscriptionClient.registerMessageHandler(
  (message) => {
    event = json.parse(message.body)
    if (event.eventType == "OrderPlaced") {
      warehouse.reserveItems(event)
    }
    message.complete()
  }
)
```

### Pattern Comparison

| Platform        | Topic/Exchange          | Channel Pattern                | Durability              | Ordering         |
| --------------- | ----------------------- | ------------------------------ | ----------------------- | ---------------- |
| **Kafka**       | Topic (append-only log) | Pub-Sub + Point-to-Point       | Partition log           | Per partition    |
| **RabbitMQ**    | Topic Exchange + Queue  | Pub-Sub + P2P                  | Queue backing           | Per queue        |
| **AWS SNS**     | SNS Topic               | Pub-Sub fanout                 | Subscriber queues       | No guarantees    |
| **EventBridge** | Event Bus + Rules       | Content-Based Router + Pub-Sub | Target queues/functions | No guarantees    |
| **Azure Bus**   | Topic + Subscriptions   | Pub-Sub                        | Subscription backlog    | Per subscription |

## References

- [Event Message on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/EventMessage.html)
- **Distribution**: Publish-Subscribe Channel
- **History**: Message Store, Durable Subscriber
- **Sourcing**: Event Sourcing (store events, not state)
- Book: Enterprise Integration Patterns, Chapter 3

---

_Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)_

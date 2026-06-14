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

| Pattern | Intent | Direction | Response |
|---------|--------|-----------|----------|
| **Event** | "This happened" | Broadcast | No |
| **Command** | "Do this" | Directed | Optional |
| **Document** | "Here's data" | Transfer | No |

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

## References

- [Event Message on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/EventMessage.html)
- **Distribution**: Publish-Subscribe Channel
- **History**: Message Store, Durable Subscriber
- **Sourcing**: Event Sourcing (store events, not state)
- Book: Enterprise Integration Patterns, Chapter 3

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

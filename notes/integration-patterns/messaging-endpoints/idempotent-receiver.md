---
type: integration-pattern
category: messaging-endpoints
aliases: [idempotent-handling, duplicate-detection, duplicate-rejection]
tags: [integration-pattern, messaging-endpoints, reliability, idempotency]
---

# Idempotent Receiver

## Problem

How can a message receiver deal with duplicate messages?

## Solution

Design the message receiver to be an Idempotent Receiver that can gracefully handle duplicate messages.

## Context & Forces

**When to use:**
- Message delivery not guaranteed exactly-once
- At-least-once delivery (may duplicate)
- Can't avoid duplicates at broker level
- Critical to not process same message twice

**Avoid when:**
- Broker guarantees exactly-once
- Duplicate detection expensive vs. risk
- Some re-processing acceptable

## Why Duplicates Occur

1. **Network retry**: Message sent, timeout suspected, resent (but first arrived)
2. **Broker failure**: Message replayed on recovery
3. **Consumer failure**: Message processed, but crash before acknowledgment
4. **Exactly-once semantics**: Distributed systems can't guarantee; usually at-least-once

## Idempotency Strategies

**Strategy 1: Message ID tracking**
```
Before processing:
  - Check: Have we seen message ID before?
  - If yes: Log as duplicate, skip processing
  - If no: Add to seen IDs, process

Storage: Database, distributed cache, message store
```

**Strategy 2: Business logic idempotency**
```
Operation is naturally idempotent:
  - GetBalance() - query; duplicate call OK
  - SetAttribute(name, value) - overwrite; duplicate OK
  - CreateAccount - idempotency key prevents duplicate

Non-idempotent:
  - Transfer(amount) - duplicate = double transfer
  - Increment(counter) - duplicate = double increment
```

**Strategy 3: Deduplication in process**
```
Detect within single handling:
  - Multiple messages at once (batch)
  - Deduplicate before processing
  - Less reliable than persistent dedup
```

## Implementation Pattern

**Persistent dedup store:**
```
messageIdSeen = cache or database

function handleMessage(message):
  if messageIdSeen.contains(message.id):
    log("Duplicate message: " + message.id)
    return  // skip processing
  
  messageIdSeen.add(message.id)
  processMessage(message)
```

**Idempotent operation:**
```
// SET is idempotent; any duplicates are harmless
SET account.balance = 1000

// SUBTRACT is NOT idempotent; need dedup
SUBTRACT account.balance - 100  // Wrong! Needs dedup

// Better:
SET account.balance = (current - 100)  // With version check
```

## Deduplication Storage

**Option 1: Local cache**
- Fast; in-process
- Lost on restart
- Works only for single instance

**Option 2: Persistent database**
- Survives restart
- Shared across instances
- Slower; adds DB query per message
- Risk: DB performance bottleneck

**Option 3: Distributed cache (Redis, Memcached)**
- Fast
- Shared across instances
- Configurable expiration (space efficiency)
- Trade-off: Not persistent; old IDs may be forgotten

**Option 4: Message deduplication ID**
- Some brokers track message IDs
- Deduplication built-in (some offset tracking)
- Depends on broker capabilities

## Idempotency Window

**How long to track message IDs?**
```
Short window: Less storage, risk of duplicates after window
Long window: More storage, safer
```

**Strategy:**
- Track recent messages: Last 1 hour (default)
- Assume: If not seen in 1 hour, won't see again
- Trade-off: Storage vs. safety window

## Related Patterns

- **Detection**: Correlation Identifier (tie duplicate to original)
- **Handling failure**: Dead Letter Channel (unprocessable duplicates)
- **Transport level**: Some brokers offer deduplication (Kafka idempotent producer)

## Example Scenarios

1. **Payment processing**: Transfer $100; must not process duplicate
2. **Account creation**: Create account with email; duplicate must not create two accounts
3. **Order processing**: Order placed; duplicate must not create duplicate order
4. **Inventory update**: Stock -= 10; duplicate must not reduce twice
5. **Notification**: Send email; duplicate must not send twice

## Exactly-Once vs. Idempotent Receiver

**Exactly-once semantics:**
- Broker + application guarantee no duplicates
- Hard to implement; high complexity
- Only if absolutely necessary

**Idempotent receiver:**
- At-least-once delivery from broker
- Application deduplicates or handles naturally
- Simpler; practical approach

**Recommendation:** Idempotent receiver (simpler, more practical)

## Performance Considerations

**Dedup overhead:**
- Cache lookup: O(1) typically; negligible
- Database lookup: Network latency; can be bottleneck
- Risk: High-throughput system; dedup adds cost

**Optimization:**
- Batch dedup (check multiple IDs at once)
- Bloom filters (probabilistic; some false negatives)
- Sample-based (track X% of messages)

## Transactional Dedup

**Atomic operation:**
```
BEGIN TRANSACTION
  IF messageId NOT IN processed_ids:
    INSERT INTO processed_ids
    PROCESS_MESSAGE(message)
  COMMIT
```

Ensures dedup and processing are atomic.

## Example: Payment Transfer

**Non-idempotent (risky):**
```
accountA.balance -= 100
accountB.balance += 100
// If duplicate arrives: transfers $200 total!
```

**Idempotent with dedup:**
```
if messageId in processedIds:
  return  // already handled
  
if accountA.balance >= 100:
  accountA.balance -= 100
  accountB.balance += 100
  addToProcessedIds(messageId)
```

**Idempotent by design (better):**
```
SET accountA.balance = SELECT balance - 100 WHERE id = A AND version = 5
SET accountB.balance = SELECT balance + 100 WHERE id = B AND version = 7
UPDATE transaction SET status = 'settled' WHERE idempotency_key = key

// Replay same message:
// Already set; same values applied (idempotent)
```

## Timeout race-condition pattern

Idempotency is also required for delayed timeout events.

Scenario:

```
29:59 -> PaymentApproved arrives
30:00 -> CheckPaymentTimeout arrives
```

Safe consumer behavior:

```
on CheckPaymentTimeout(orderId):
  order = readCurrentOrderState(orderId)

  if order.status == PENDING_PAYMENT:
    cancelOrder(orderId)
  else:
    ignore timeout event
```

This revalidation step prevents valid paid orders from being cancelled by late or out-of-order timeout events.

## Testing Idempotency

1. **Send message once**: Verify correct result
2. **Send message twice immediately**: Verify no change
3. **Send message after delay**: Verify dedup still works (or graceful re-processing)
4. **Stress test**: High-frequency duplicates; verify system stable

## Pitfalls & Gotchas

1. **Forgetting dedup**: Processing without dedup = duplicates applied
2. **Dedup window too short**: Duplicates after window = re-processed
3. **Dedup storage failure**: DB down = can't deduplicate = risk duplicates
4. **Partial processing**: Message partially processed when failure occurs
5. **Dedup ID not unique**: Different messages same ID = false dedup

## References

- [Idempotent Receiver on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/IdempotentReceiver.html)
- **Related**: Correlation Identifier (duplicate tracking), Dead Letter Channel (failures)
- **Guarantee**: Combine with Guaranteed Delivery for robust system
- Book: Enterprise Integration Patterns, Chapter 9

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

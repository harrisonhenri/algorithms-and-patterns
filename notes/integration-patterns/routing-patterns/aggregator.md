---
type: integration-pattern
category: routing-patterns
aliases: [combiner, message-combiner, message-aggregation]
tags: [integration-pattern, routing-patterns, routing, aggregation]
---

# Aggregator

## Problem

How do we combine the results of individual, but related messages so that they can be processed as a whole?

## Solution

Use a stateful filter, an Aggregator, to collect and store individual messages until a complete set of related messages has been received. Then, the Aggregator publishes a single message containing all the information from the individual messages.

## Context & Forces

**When to use:**
- Multiple related messages need combining (inverse of Splitter)
- Messages are partial results from parallel processing
- Need complete dataset before proceeding
- Correlation ID ties messages together

**Avoid when:**
- Single message sufficient (no combining needed)
- Can't wait for all messages (timeout risk)
- Out-of-order or missing messages common

## Key Mechanisms

1. **Collection**: Gather related messages (identified by correlation ID)
2. **Condition**: Determine when collection is complete
   - Count: Expect N messages
   - Timeout: Wait max time, process what arrived
   - Condition: Custom logic (all variants received, etc.)
3. **Assembly**: Combine into single output message
4. **Emit**: Send combined message downstream

## Completion Strategies

**Fixed count:**
```
Expect 5 item-processing results
After 5 arrive: aggregate and continue
```

**Timeout:**
```
Start timer when first message arrives
After 10 seconds OR 5 messages: aggregate
Whichever comes first
```

**Custom condition:**
```
Have result from Warehouse AND Billing AND Inventory
Then: aggregate and continue
```

## Implementation Pattern

**Input (3 related messages):**
```
Message 1: {"correlationId": "A", "source": "Service1", "data": {...}}
Message 2: {"correlationId": "A", "source": "Service2", "data": {...}}
Message 3: {"correlationId": "A", "source": "Service3", "data": {...}}
```

**Output (combined):**
```
Message: {
  "correlationId": "A",
  "results": [
    {"source": "Service1", "data": {...}},
    {"source": "Service2", "data": {...}},
    {"source": "Service3", "data": {...}}
  ]
}
```

## Related Patterns

- **Inverse (decompose)**: Splitter (opposite operation)
- **Coordination**: Correlation Identifier (tie messages together)
- **Orchestration**: Scatter-Gather (split, process, aggregate in one pattern)
- **Ordering**: Resequencer (may be needed before aggregation)

## Example Scenarios

1. **Fan-out result collection**: Request sent to 3 services; aggregate 3 responses
2. **Order enrichment**: Collect inventory, pricing, shipping info; combine for final decision
3. **Vote/consensus**: Multiple nodes vote; aggregate results for decision
4. **Multi-step workflow**: Different steps produce intermediate results; aggregate for next step
5. **Data correlation**: Combine data from multiple sources for analysis

## Aggregation Strategies

**Combine data:**
```
Input: Item1 (qty=2), Item2 (qty=1), Item3 (qty=5)
Output: TotalItems = 8, ItemCount = 3
```

**Merge objects:**
```
Input: UserProfile, UserPreferences, UserActivity
Output: UserEnriched { profile, preferences, activity }
```

**Flatten/restructure:**
```
Input: Multiple flat message objects
Output: Structured result object
```

## Handling Missing/Late Messages

**Partial aggregation:**
- Wait max 10 seconds
- Aggregate whatever arrived
- Send to Dead Letter Channel for completeness check

**Duplicate detection:**
- Ignore duplicate messages (same correlationId + source)
- Or: Overwrite with latest

**Out-of-order:**
- Accept any order
- Or: Use Resequencer first to order

## State Management

**Where stored?**
- In-memory (fast, lost on restart)
- Persistent (safe, slower)
- Distributed cache (scale across instances)

**State cleanup:**
- Remove aggregation state after emit
- Timeout cleanup (aged aggregations)
- Watch for memory leaks with many pending aggregations

## Timeout Tuning

**Too short:** Timeout before all messages arrive
**Too long:** Delay processing; queue backup

**Strategy:**
- Monitor incoming message frequency
- Set timeout to 2-3x average time between messages
- Alert if timeouts frequent (indicates slow/missing messages)

## Error Handling

**One message fails:**
- Abandon aggregation (wait will timeout)
- Or: Proceed with partial data
- Or: Retry failed component

**Example:**
```
Waiting for: Service1, Service2, Service3
Service2 fails → 
  Option A: Wait for timeout, fail entire request
  Option B: Proceed with Service1 + Service3, mark Service2 missing
  Option C: Retry Service2
```

## Splitter-Aggregator Pattern

**Complete round-trip:**
```
CompositeMessage
  → Splitter (1 → 5 individual)
  → Process each (parallel)
  → Aggregator (5 → 1 combined)
  → Result
```

**Example: Order processing:**
```
Order with 5 items
  → Split into 5 item-processing tasks
  → Process items in parallel (inventory check, pricing, etc.)
  → Aggregate results
  → Combine into final order summary
```

## Technology Examples

- **Apache Camel**: `aggregate()` DSL with completion predicate
- **Spring Integration**: Aggregator component, completion strategy
- **Kafka Streams**: Windowing + aggregation
- **AWS Lambda**: DynamoDB for state storage + aggregation logic

## References

- [Aggregator on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/Aggregator.html)
- **Pair**: Splitter (inverse operation)
- **Combined**: Scatter-Gather (split, process, aggregate)
- **Ordering**: Resequencer (may be needed before)
- Book: Enterprise Integration Patterns, Chapter 5

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

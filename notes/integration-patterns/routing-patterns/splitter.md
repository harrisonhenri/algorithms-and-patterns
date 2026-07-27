---
type: integration-pattern
category: routing-patterns
aliases: [splitter, message-splitter, decompose]
tags: [integration-pattern, routing-patterns, routing, decompose]
---

# Splitter

## Problem

How can we process a message if it contains multiple elements, each of which may have to be processed in a different way?

## Solution

Use a Splitter to break out the composite message into a series of individual messages, each containing data related to one item.

## Context & Forces

**When to use:**
- Message contains collection (list/array) of similar items
- Each item needs processing (possibly different)
- Want to process items in parallel
- Downstream handlers expect single-item messages

**Avoid when:**
- Message is simple scalar value (no splitting needed)
- Items must be processed together (keep composite)
- Want to aggregate results immediately (use after aggregation)

## Key Mechanisms

1. **Message inspection**: Identify collection in message
2. **Split logic**: Extract individual items
3. **Emit**: Send separate message per item
4. **Optional sequence**: Maintain order or shuffle as needed

## Implementation Pattern

**Input:**
```json
{
  "orderId": "ORD-12345",
  "items": [
    {"sku": "ITEM-1", "qty": 2},
    {"sku": "ITEM-2", "qty": 1},
    {"sku": "ITEM-3", "qty": 5}
  ]
}
```

**Output (3 separate messages):**
```
Message 1: {"orderId": "ORD-12345", "sku": "ITEM-1", "qty": 2}
Message 2: {"orderId": "ORD-12345", "sku": "ITEM-2", "qty": 1}
Message 3: {"orderId": "ORD-12345", "sku": "ITEM-3", "qty": 5}
```

## Related Patterns

- **Inverse (combine)**: Aggregator (combine split messages back)
- **Sequential splitting**: Pipes and Filters
- **Combining with routing**: Splitter → Content-Based Router → parallel processing
- **Tracking**: Use Correlation ID to tie split messages back to original order

## Example Scenarios

1. **Order processing**: Split order with 10 items into 10 item-processing messages
2. **Batch file**: Split CSV file with 1000 rows into 1000 row messages
3. **Multi-recipient**: Split email with list of recipients into per-recipient messages
4. **Event distribution**: Split event batch into individual events for subscribers
5. **Collection unpacking**: Transform any collection into message stream

## Technology Examples

- **Apache Camel**: `.split()` DSL
- **Spring Integration**: Splitter component
- **Kafka Streams**: `.flatMap()` to split
- **Custom**: Loop through items, emit per item

## Ordering & Correlation

**Maintain order:**
```
Split with sequence ID: msg-1, msg-2, msg-3
Use Resequencer downstream if needed
```

**Correlation:**
```
All split messages share same correlationId
Allows re-aggregation or tracking
```

## Performance Considerations

- **Sequential vs. parallel**: Split naturally enables parallelization
- **Resource usage**: Each split message needs processing; watch resource limits
- **Throughput**: More messages = more processing overhead
- **Ordering**: Splitting may break order; use Resequencer to restore

## Splitter + Aggregator Pattern

**Common workflow:**
```
Composite message
  ↓
Splitter (1 → N)
  ↓
Content-Based Router (route each by type)
  ↓
Process items (parallel)
  ↓
Aggregator (N → 1)
  ↓
Result message
```

**Example: Order processing:**
```
Order with 5 items
  → Split into 5 item messages
  → Route by item type (Electronics vs. Clothing)
  → Process each type differently
  → Aggregate results
  → Send invoice
```

## Splitter Variations

- **Sequential**: One at a time (slower, less resource usage)
- **Parallel**: All at once (faster, more resources)
- **Throttled**: Limit concurrent processing (backpressure)

## Error Handling

**One item fails:**
- Option 1: Fail entire message (rollback all splits)
- Option 2: Skip failed item, continue others
- Option 3: Retry individual item (idempotent processing)

**Example:**
```
3 splits succeed, 1 fails
→ Send 3 success results to Aggregator
→ Send 1 error to Dead Letter Channel
→ Aggregator waits for completion signal (error/success)
```

## References

- [Splitter on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/Splitter.html)
- **Pair**: Aggregator (inverse operation)
- **Sequencing**: Resequencer (restore order if needed)
- **Correlation**: Correlation Identifier (tie split messages)
- Book: Enterprise Integration Patterns, Chapter 5

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

---
type: integration-pattern
category: transformation-patterns
aliases: [message-enrichment, data-enrichment]
tags: [integration-pattern, transformation-patterns, transformation, enrichment]
---

# Content Enricher

## Problem

How do we communicate with another system if the message originator does not have all the required data items available?

## Solution

Use a special filter, a Content Enricher, to access an external data source and augment a message with missing information before delivering it to the destination.

## Context & Forces

**When to use:**
- Message lacks data needed by downstream consumer
- Data available from external source (database, service, cache)
- Cost acceptable to enrich all messages (vs. lazy-load in consumer)
- Transformation is data augmentation not creation

**Avoid when:**
- Data rarely needed; lazy-load at consumer
- Data too large; performance impact
- Source data frequently changes; would need cache invalidation
- Enrichment requires complex business logic (move to consumer)

## Key Mechanisms

1. **Message inspection**: Identify what data is needed
2. **External lookup**: Query database, call service, cache lookup
3. **Augmentation**: Add retrieved data to message
4. **Forward**: Send enriched message downstream

## Implementation Approaches

**Approach 1: Database lookup**
```
Message contains: order_id
Enricher queries: SELECT order_details WHERE order_id = ?
Adds to message: customer_name, shipping_address, ...
```

**Approach 2: Service call**
```
Message contains: user_id
Enricher calls: UserService.getUserProfile(user_id)
Adds to message: user_name, preferences, credit_score
```

**Approach 3: Cached reference**
```
Message contains: product_code
Enricher looks up: ProductCatalog[product_code]
Adds to message: product_name, price, category
```

## Related Patterns

- **Inverse (filter data)**: Content Filter (remove data, not add)
- **Lazy alternative**: Move enrichment to consumer (less efficient)
- **Large data**: Claim Check (avoid attaching huge objects; use reference)
- **Format transformation**: Message Translator (convert format)
- **Wrapper**: Envelope Wrapper (add metadata headers)

## Example Scenarios

1. **Order enrichment**: Add customer profile, inventory levels to order message
2. **Event enrichment**: Add user context to analytics event before processing
3. **Transaction enrichment**: Add fraud score, risk assessment to payment message
4. **Request enrichment**: Add authorization details before routing to handler
5. **Log enrichment**: Add correlation ID, user context to log entries

## Implementation Considerations

1. **Performance**: Lookup cost added per message; can become bottleneck
2. **Latency**: Synchronous lookup adds latency; consider caching
3. **Failure handling**: Lookup fails → what happens?
   - Dead Letter Channel (unrecoverable)
   - Retry (temporary outage)
   - Default values (partial enrichment)
4. **Cache strategy**: Cache external data? Refresh interval?
5. **Consistency**: Data may have changed since lookup; acceptable?

## Technology Examples

- **Apache Camel**: `enrich()` DSL, `enricher` component
- **Spring Integration**: Enricher gateway
- **Kafka Streams**: `leftJoin()`, `globalKTable` for reference data
- **AWS Lambda**: Invoke external API; return enriched object
- **Custom**: Database query middleware

## Common Pitfalls

1. **Lookup fails silently**: Always handle error case
2. **Performance impact**: Profile before use; ensure lookup is fast
3. **Stale data**: Cache invalidation; refresh strategy critical
4. **Tight coupling**: Enricher becomes tightly coupled to data source
5. **Over-enrichment**: Adding data nobody uses; wastes resources

## Data Size Considerations

**Small data (e.g., customer name, score)**: Embed in message
**Large data (e.g., full customer history, image)**: Use Claim Check pattern instead
- Store large data in external storage (database, blob store)
- Message contains reference/ID only
- Consumer retrieves full data as needed

## Alternative: Lazy Loading

**vs. Content Enricher:**
- Enricher: All messages enriched, more data at consumption point
- Lazy: Each consumer enriches independently, repeated lookups

**Choose Enricher when:**
- Most consumers need enriched data
- Lookup cost is reasonable
- Want to centralize enrichment logic

**Choose Lazy when:**
- Few consumers need enrichment
- Enrichment rarely needed
- Lookup is expensive

## References

- [Content Enricher on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/ContentEnricher.html)
- **Related**: Content Filter (opposite), Claim Check (large data)
- **Comparison**: Message Translator (format change), Envelope Wrapper (metadata)
- Book: Enterprise Integration Patterns, Chapter 6

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

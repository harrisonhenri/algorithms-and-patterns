---
type: integration-pattern
category: routing-patterns
aliases: [content-based-routing, conditional-routing, switch-statement]
tags: [integration-pattern, routing-patterns, routing, conditional]
---

# Content-Based Router

## Problem

How do we handle a situation where the implementation of a single logical function (e.g., inventory check) is spread across multiple physical systems?

## Solution

Construct a message router that evaluates a set of conditions on the incoming message and directs the message to the appropriate destination channel based on data contained in the message.

## Context & Forces

**When to use:**
- Message must be routed to different destinations based on content
- Logic for routing is complex and data-dependent
- Destinations are known upfront but routing rules may change
- Centralizing routing logic is desired

**Avoid when:**
- Simple destination always same (direct channel)
- Routing rules unknowable at design-time (use Dynamic Router)
- Destinations are list of subscribers (use Publish-Subscribe)

## Key Mechanisms

1. **Message inspection**: Extract data from message header/content
2. **Condition evaluation**: Apply rules (if X > threshold, route to A; else B)
3. **Destination routing**: Send to appropriate channel based on result
4. **Multi-criteria**: Can combine multiple conditions (AND, OR)

## Implementation Patterns

**Simple conditional:**
```
IF message.customerType == "Premium" THEN route to PremiumQueue
ELSE route to StandardQueue
```

**Multi-branch routing:**
```
SWITCH on message.product:
  CASE "Electronics" → WarehouseA
  CASE "Clothing" → WarehouseB
  CASE "Food" → WarehouseC
  DEFAULT → DefaultQueue
```

**Complex rules:**
```
IF (message.amount > 10000 AND message.riskScore > 0.8)
THEN route to ManualReviewQueue
ELSE route to AutoApprovalQueue
```

## Related Patterns

- **Alternative destination selection**:
  - Message Filter: Filter OUT messages (don't route)
  - Recipient List: Route to multiple destinations
  - Dynamic Router: Discover destinations at runtime
  - Routing Slip: Route through sequence of steps
- **Condition-based transformation**: Content Enricher (add data before routing)

## Implementation Notes

- **Technology-independent**: Logic applies across all messaging platforms
- **DSL vs code**: Use routing DSL (Apache Camel) vs. custom code trade-off
- **Performance**: Condition evaluation is fast; bottleneck usually elsewhere
- **Maintenance**: Complex rules become hard to test; keep conditions simple
- **Versioning**: New product types require code change; consider external config

## Example Scenarios

1. **Order routing**: Route orders to warehouse based on product type, location
2. **Claim processing**: Route insurance claims to different processors based on type/amount
3. **Patient triage**: Route patient requests based on severity, specialty
4. **Request routing**: Route API requests to different backend services by endpoint
5. **Device routing**: Route device data based on device type, model, firmware version

## Common Mistakes

1. **Over-complex conditions**: Becomes unmaintainable; break into multiple routers
2. **Tight coupling to destinations**: Hard-coded destination names; use indirection
3. **Missing default case**: Unknown message types silently lost; always include dead letter
4. **Performance concern**: Unnecessary optimization; condition evaluation is typically fast
5. **Hard to test**: Isolate routing logic; unit test conditions independently

## Scalability Considerations

- **High volume**: Condition evaluation is O(1) or O(n) in number of routes (typically small)
- **Many routes**: Break into hierarchical routers (router → sub-router)
- **Dynamic rules**: Consider Dynamic Router or externalize config

## Technology Examples

- **Apache Camel**: `choice().when(predicate).to(endpoint)...`
- **Spring Integration**: `@Router` annotation, expression-based
- **Kafka Streams**: `branch()` method for conditional routing
- **AWS Lambda**: Custom logic in function; route via SNS/SQS topics
- **RabbitMQ**: Exchange routing logic (limited; mostly via headers/routing keys)
- **Mule ESB**: Choice router component

## Related Patterns

- **Splitter**: Split message into parts; route each differently
- **Aggregator**: Combine multiple routed messages
- **Message Filter**: Filter (discard) rather than route
- **Compose**: Multiple routers in sequence (Pipes and Filters)

## References

- [Content-Based Router on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/ContentBasedRouter.html)
- **Variant**: Dynamic Router (discovery at runtime)
- **Recipient destination**: Recipient List (multiple destinations), Splitter → route
- Book: Enterprise Integration Patterns, Chapter 5

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

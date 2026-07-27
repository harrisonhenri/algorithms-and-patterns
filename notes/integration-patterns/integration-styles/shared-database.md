---
type: integration-pattern
category: integration-styles
tags: [integration-pattern, integration-styles, shared-database]
---

# Shared Database

## Problem

How can I integrate multiple applications so that they work together and can exchange information, when the only practical way for them to share data is through a database?

## Solution

Have the applications store the data they wish to share in a common database, and retrieve data from the database that has been written by other applications.

## Context & Forces

**When to use:**
- All applications have database access (common in monolithic enterprise architectures)
- Applications use relational databases natively
- Data is highly relational and normalized
- Some coupling between applications is acceptable

**Avoid when:**
- Need loose coupling or independent evolution
- Scaling each application independently
- Different data models or technologies required
- Database has become bottleneck

## Key Considerations

1. **Schema Coupling**: All applications tightly coupled to shared schema; schema changes are problematic
2. **Concurrency Control**: Database must handle concurrent access; locks, isolation levels critical
3. **Performance**: Queries can become complex; indexes essential for scalability
4. **Data Ownership**: Unclear who "owns" which tables; can lead to conflicts
5. **Transactions**: Multi-application transactions are hard; eventual consistency not supported
6. **Scalability**: Single database becomes bottleneck; difficult to shard/replicate

## Related Patterns

- **Predecessor to**: Messaging (recommended modern alternative)
- **Often combined with**: Channel Adapter (adapters read/write database, feed to Message Channel)
- **Successor pattern**: Event-Driven Architecture (events replace shared DB)

## Implementation Notes

- **Anti-pattern in microservices**: Shared database violates service autonomy; avoid
- **Legacy systems**: Common in monolithic applications; consider strangler fig pattern for migration
- **Hybrid approach**: Database for historical data, Messaging for new integrations

## Example Use Cases (Historical)

- **Traditional ERP**: Single database shared across modules (Finance, HR, Supply Chain)
- **Data warehouse**: Operational systems write to data warehouse; BI systems read
- **Monolithic application**: Multiple components access shared schema
- **Legacy integration**: Before messaging systems became mainstream

## Evolution to Messaging

| Aspect | Shared Database | Messaging |
|--------|-----------------|-----------|
| **Coupling** | Tight (schema) | Loose (interface) |
| **Independence** | Low (shared schema) | High (autonomous) |
| **Scalability** | Poor | Good |
| **Failure** | Cascading | Isolated |
| **Latency** | Synchronous | Asynchronous |
| **Data Ownership** | Unclear | Clear |

## Modern Perspective

**Not recommended** for new integrations. Consider:
1. **Per-service databases**: Each microservice owns its data
2. **Event-driven sync**: Services subscribe to events and maintain read models
3. **API-based queries**: Query service owns its database, exposes via API
4. **CQRS**: Separate read/write models; Messaging for eventual consistency

## References

- [Shared Database pattern on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/SharedDataBaseIntegration.html)
- **Migration path**: Strangler Fig, CQRS (maintaining database during transition)
- Book: Enterprise Integration Patterns, Chapter 2

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

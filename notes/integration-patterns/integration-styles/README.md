---
type: index
domain: integration-patterns
tags: [integration-pattern, index]
---

# Integration Styles

Four foundational approaches to integrating multiple applications. Choose based on available technology, coupling tolerance, and latency requirements.

## Patterns

### [File Transfer](./file-transfer.md)
Applications exchange data via files. Simple but high-latency; common in batch processing and legacy systems.

### [Shared Database](./shared-database.md)
Applications access common database. Tight coupling; schema becomes bottleneck. Avoid for new systems; migrate legacy to messaging.

### [Remote Procedure Invocation](./remote-procedure-invocation.md)
Synchronous calls (RPC, REST, gRPC) between applications. Tight coupling; cascading failures; use for queries or low-volume, low-latency paths.

### [Messaging](./messaging.md)
Asynchronous, decoupled communication via message channels. Foundation for all subsequent patterns. Recommended for integration.

## Choosing a Style

| Style | Best For | Coupling | Latency | Reliability |
|-------|----------|----------|---------|-------------|
| **File Transfer** | Batch, legacy | Loose | High | Fair |
| **Shared Database** | Legacy monoliths | Tight | Low | Poor (cascading) |
| **RPC** | Queries, sync calls | Tight | Low | Fair (retry needed) |
| **Messaging** | Modern systems, async | Loose | Medium | Good |

## Modern Perspective

**Messaging is recommended** for new systems because:
- Loose coupling allows independent evolution
- Asynchronous processing natural for distributed systems
- Scales better under load
- Failure isolation (one app down ≠ cascade)

RPC has role for queries/lightweight requests; Messaging for state changes.

File Transfer & Shared Database are legacy; consider migration.

---

*Patterns from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

---
type: integration-pattern
category: integration-styles
aliases: [rpc-integration, synchronous-invocation]
tags: [integration-pattern, integration-styles, rpc, synchronous]
---

# Remote Procedure Invocation

## Problem

How can I integrate multiple applications so that they work together and can exchange information, when each application is easily accessible via a remote invocation interface?

## Solution

Have the applications call each other's functions and services as if they were local calls, using some kind of remote invocation technology (RPC, CORBA, SOAP, gRPC, REST).

## Context & Forces

**When to use:**
- Synchronous request-response required; caller must wait for result
- Low-latency, immediate responses necessary
- Applications already expose service/procedure interfaces
- Network connectivity reliable; failures unacceptable

**Avoid when:**
- Loose coupling needed; tight coupling problematic
- System must survive network failures
- Asynchronous processing preferred
- Cascading failures unacceptable
- Significant latency jitter acceptable

## Key Considerations

1. **Temporal Coupling**: Caller and callee must be alive simultaneously; failure of one cascades
2. **Synchronous Wait**: Caller blocks waiting for response; resource expensive
3. **Latency**: Network latency adds up; chains of calls multiply latency
4. **Versioning**: API changes require coordination between caller/callee
5. **Scalability**: Each call ties up resources; hard to scale under load
6. **Partial Failure**: Network partitions cause timeouts; can't distinguish failure types

## Related Patterns

- **Modern implementations**: gRPC, REST APIs, SOAP Web Services
- **Classic versions**: CORBA, RMI, DCOM
- **Async alternative**: Messaging (Request-Reply pattern)
- **Timeout handling**: Message Expiration (applied to RPC calls)

## Implementation Notes

- **Synchronous wrapper**: REST/gRPC is RPC; wrap in Messaging Gateway if async needed
- **Correlation**: Correlation Identifier helps track multi-step RPC chains
- **Timeout policy**: Always set timeouts; avoid unbounded waits
- **Circuit breaker**: Protect against cascading failures
- **Fallback**: Have fallback behavior when service unavailable

## Example Use Cases

- **REST APIs**: Client calls server endpoint; waits for JSON response
- **gRPC**: Low-latency inter-service calls in microservices architecture
- **Legacy SOAP**: Enterprise services called via WSDL contracts
- **Microservices**: Service A calls Service B's REST endpoint synchronously

## RPC vs. Messaging

| Aspect | RPC | Messaging |
|--------|-----|-----------|
| **Latency** | Synchronous | Asynchronous |
| **Coupling** | Tight | Loose |
| **Failure** | Cascading | Isolated |
| **Scalability** | Limited | High |
| **Complexity** | Simple | Moderate |
| **Reliability** | Requires retry logic | Built-in durability |
| **Load spike** | Cascading failures | Queue absorption |

## Modern Hybrid Approach

**Recommended**: Use RPC for:
- Query operations (read-heavy, fast responses)
- Synchronous workflows (tight temporal coupling acceptable)
- Low-volume, low-latency paths

**Use Messaging for:**
- State changes (write-heavy operations)
- Asynchronous notifications
- High-volume, fire-and-forget operations
- Resilience to failure

## Gotchas & Pitfalls

1. **Network calls ≠ Local calls**: Higher latency, partial failures possible
2. **Synchronous chains**: A→B→C→D; latency multiplies, one failure stops all
3. **Resource exhaustion**: Each RPC call consumes connection/thread; load testing critical
4. **Timeout tuning**: Too short = false failures; too long = cascading delays
5. **Versioning hell**: Breaking API changes require client/server coordination

## References

- [Remote Procedure Invocation pattern on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/RemoteProcedureInvocation.html)
- **Modern implementations**: gRPC, REST API design
- **Fallback to async**: Messaging patterns (Request-Reply) when sync problematic
- Book: Enterprise Integration Patterns, Chapter 2

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

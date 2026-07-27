---
tags: [concurrency, paradigms, patterns, system-design]
title: "Concurrency models"
---

# Concurrency models

This note compares major concurrency paradigms and explains when to choose each one.

**See also:** [transactions-and-concurrency.md](../system-design/transactions-and-concurrency.md) for locking patterns (Pessimistic/Optimistic locking, Distributed locking) and their application in managing concurrent access to shared resources.

---

## Shared memory model (threads + locks)

Workers share memory and coordinate with synchronization primitives.

**Strengths**

- Fast in-process communication
- Good fit for CPU parallelism
- Mature ecosystem in most languages

**Risks**

- Data races
- Deadlocks/livelocks
- Hard reasoning under heavy contention

**Best fit**

- High-performance compute services
- In-memory analytics
- Low-latency data sharing within one process boundary

---

## CSP model (communicating sequential processes)

Workers communicate through channels and avoid shared mutable state when possible.

**Core idea**

- "Do not communicate by sharing memory; share memory by communicating"

**Strengths**

- Clear ownership boundaries
- Reduced lock complexity
- Natural pipeline composition

**Risks**

- Channel misuse can still deadlock
- Backpressure design must be explicit
- Debugging blocked channel graphs can be difficult

**Best fit**

- Streaming pipelines
- Fan-out/fan-in workflows
- Services that prioritize deterministic flow over shared-state speed

---

## Petri nets model (formal concurrency modeling)

A Petri net models states as places and transitions as events, with tokens representing current system state.

**Strengths**

- Precise representation of concurrent workflows
- Supports formal checks (deadlock, reachability)
- Useful for protocol and workflow validation

**Risks**

- Higher modeling overhead
- Often too formal for small application code paths
- Requires team familiarity with formal notation

**Best fit**

- Safety-critical workflows
- Complex orchestration logic
- Verifying process correctness before implementation

---

## Quick decision table

| Need                                  | Prefer                            | Why                                          |
| ------------------------------------- | --------------------------------- | -------------------------------------------- |
| Shared in-memory speed                | **Threads + locks**               | Lowest communication overhead                |
| Clear async pipelines                 | **CSP/channels**                  | Explicit dataflow and ownership              |
| Formal correctness guarantees         | **Petri nets**                    | Enables verification of behavior             |
| Team is new to concurrency            | **CSP/channels**                  | Simpler local reasoning than lock-heavy code |
| Max raw CPU throughput in one process | **Threads + work-stealing pools** | Better core utilization                      |

---

## How this connects to runtime scheduling

Paradigms describe _how components coordinate_. Scheduling models describe _how work gets CPU time_.

For scheduling-level tradeoffs, see:

- [Scheduling models](../language-mechanics/scheduling-models.md)

For consistency and reliability decisions in distributed systems, see:

- [Consistency, consensus, and replication](../system-design/consensus-and-replication.md)
- [Transactions and concurrency](../system-design/transactions-and-concurrency.md)

---

## Repository examples

- FIFO task processing intuition: [Queue](../../structures/queue/index.ts)
- Priority-first processing intuition: [Heap](../../structures/heap/index.ts)
- Dependency ordering intuition: [Kahn topological sort](../../algorithms/graph/kahn/index.ts)

---

## Etc.

Other important models and ecosystems:

- Actor model (isolation + mailbox semantics)
- Reactive streams (backpressure-oriented event flow)
- Dataflow systems (DAG scheduling and pipeline optimization)

Use these when your domain is message-heavy, resilience-focused, or stream-native.

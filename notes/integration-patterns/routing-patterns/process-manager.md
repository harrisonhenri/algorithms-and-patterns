---
type: integration-pattern
category: routing-patterns
aliases: [saga-pattern, orchestrator, workflow-coordinator]
tags: [integration-pattern, routing-patterns, routing, orchestration]
---

# Process Manager

## Problem

How do we route a message through multiple processing steps when the required steps may not be known at design-time and may not be sequential?

## Solution

Use a Process Manager to route a message through multiple steps, where the manager maintains state about how far the message has progressed and determines next steps.

## Context & Forces

**When to use:**

- Multi-step process; steps depend on state/conditions
- Order of steps not fixed; data-driven routing
- Coordination across multiple services needed
- Stateful workflow (vs. stateless)

**Avoid when:**

- Simple, fixed sequence (use Routing Slip or Pipes and Filters)
- No state needed
- Choreography more appropriate (event-driven)

## Key Characteristics

1. **Stateful**: Tracks progress through workflow
2. **Orchestrating**: Tells services what to do (commands)
3. **Reactive**: Reacts to events from services
4. **Decision-making**: Makes next-step decisions based on data

## Process Manager Pattern

**Structure:**

```
Request arrives
    ↓
Process Manager
    • Read state
    • Decide next step
    • Send command to Service A
    ↓
Service A completes → sends event back
    ↓
Process Manager
    • Update state
    • Decide next step
    • Send command to Service B
    ↓
Service B completes → sends event back
    ↓
Process Manager
    • Workflow complete?
    • Send completion event
```

## Process Manager vs. Choreography

**Orchestration (Process Manager):**

```
Manager: "Warehouse, reserve items"
Warehouse: (reserves)
Manager: "Billing, create invoice"
Billing: (invoices)
Manager: "Shipping, prepare package"
Shipping: (ships)
Manager: (complete)
```

Centralized control; manager knows overall flow.

**Choreography (Event-driven):**

```
OrderService: publishes OrderPlaced
    → WarehouseService listens, reserves, publishes ItemsReserved
    → BillingService listens, invoices, publishes InvoiceCreated
    → ShippingService listens, ships, publishes PackageShipped
```

Distributed control; each service reacts to events.

## Example Scenarios

1. **Order processing**: Manager orchestrates warehouse → billing → shipping → delivery
2. **Loan approval**: Manager orchestrates credit check → income verification → underwriting → approval
3. **Travel booking**: Manager orchestrates flights → hotels → rental cars → insurance
4. **Insurance claim**: Manager orchestrates assessment → approval → payment
5. **Onboarding**: Manager orchestrates training → equipment → account setup → notification

## State Management

**Track:**

- Current step
- Completed steps
- Retry count
- Data accumulated so far

**Storage:**

- Database (persistent)
- Cache (fast, volatile)
- Message (stateless; pass state in messages)

**Cleanup:**

- Remove state after completion
- Timeout for long-running processes
- Archive for audit

## Failure Handling

**Service fails:**

1. **Retry**: Resend command to service
2. **Timeout**: Wait max time; assume failure
3. **Dead Letter**: Send to manual queue
4. **Compensation**: Undo prior steps (saga pattern)

**Process Manager fails:**

- Restart from last saved state
- Persist state before sending commands

## Timeout scheduling pattern

Process Managers are a natural place to coordinate long-running timeouts.

Example (order payment timeout):

```
OrderCreated
    -> Process Manager schedules CheckPaymentTimeout(+30m)

At timeout:
    -> read current order/payment state
    -> if still pending: emit CancelOrder command
    -> else: ignore timeout event
```

This keeps timeout logic explicit and avoids periodic database scans.

For duplicate and out-of-order safety on timeout consumers, pair with [Idempotent Receiver](../messaging-endpoints/idempotent-receiver.md).

## Saga Pattern (Distributed Transaction)

**Extended Process Manager for consistency:**

**Happy path:**

```
OrderService: Create order
Warehouse: Reserve inventory
Billing: Charge customer
Shipping: Send package
```

**Failure at step 3 (billing fails):**

```
Compensation:
Warehouse: Unreserve inventory (compensating transaction)
OrderService: Cancel order
```

**Ensures consistency across multiple services** without 2-phase commit.

## Correlation & Tracking

```
OrderId = 12345
CorrelationId = corr-98765

All messages carry both:
  - OrderId (business key)
  - CorrelationId (workflow tracking)

Process Manager tracks: CorrelationId → workflow state
```

## Process Manager Implementation

**Technology options:**

- Custom: Database + polling + logic
- Workflow engine: Apache Camel, Spring Integration
- Orchestration platform: AWS Step Functions, GCP Workflows, Azure Logic Apps
- BPMN engine: Camunda, Activiti

## Comparison: Choreography vs. Orchestration

| Aspect               | Choreography            | Orchestration                  |
| -------------------- | ----------------------- | ------------------------------ |
| **Control**          | Distributed             | Centralized                    |
| **Visibility**       | Hard to see flow        | Clear flow (process manager)   |
| **Coupling**         | Loose (event-driven)    | Tighter (commands)             |
| **Testing**          | Hard (async)            | Easier (orchestrator testable) |
| **Failure handling** | Distributed (hard)      | Centralized (easier)           |
| **Complexity**       | Grows with interactions | Grows with steps               |

## Recommended: Hybrid

**Combination:**

- Orchestration for critical workflows (transactions, orders)
- Choreography for notifications (event-driven)
- Process Manager for long-running processes

## References

- [Process Manager on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/ProcessManager.html)
- **Alternative**: Routing Slip (simpler; fixed sequence known)
- **Pattern**: Saga (distributed transactions; compensation)
- **Implementation**: Apache Camel, Spring Integration, AWS Step Functions
- Book: Enterprise Integration Patterns, Chapter 5

---

_Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)_

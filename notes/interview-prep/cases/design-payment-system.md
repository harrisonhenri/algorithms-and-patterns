---
tags:
  [
    system-design,
    interview-prep,
    payments,
    reliability,
    idempotency,
    kafka,
    ledger,
  ]
title: "Design a Payment System"
---

# Design a Payment System

## Goal

Design a reliable payment platform that supports:

- **Pay-in**: customer → merchant
- **Pay-out**: merchant/platform → bank account
- High reliability
- Exactly-once payment execution
- Security and compliance

---

## Requirements

### Functional

- Process customer payments
- Support payouts
- Integrate with external PSPs (Stripe, Adyen, PayPal)
- Keep accounting records (ledger)
- Handle retries
- Prevent duplicate charges

### Non-functional

- Reliability and fault tolerance
- High consistency
- Security (PCI DSS)
- Scalability
- Auditability

---

# High-Level Architecture

```
Client
    │
    ▼
Payment Service
    │
    ├── Payment Executor
    ├── Ledger
    ├── Wallet
    ├── PSP Integration
    └── Reconciliation
           │
           ▼
    Payment Service Provider
           │
           ▼
      Card Scheme / Bank
```

---

# Payment Flows

## Pay-in Flow

Customer purchases something:

```
Client → Payment Service → PSP → Card Network → Bank
```

Steps:

1. Create payment order
2. Generate nonce/token
3. Send payment to PSP
4. PSP authorizes payment
5. Update ledger
6. Update merchant wallet

## Pay-out Flow

Merchant requests withdrawal:

```
Merchant → Payment Service → Third-party payout provider → Bank
```

---

# Core Components

## Payment Service

Coordinates the entire payment process.

Responsibilities:

- Validate requests
- Call PSP
- Update internal state
- Handle retries
- Ensure consistency

## Payment Executor

Executes payment logic — calling PSP APIs, processing responses, updating payment status.

## Ledger

Immutable accounting system. Stores credits, debits, and transaction history.

Properties:

- Append-only
- Source of truth
- Auditable

## Wallet

Stores merchant balances. Updated only after successful payment.

---

# PSP Integration

Common pattern:

```
Payment Service → Generate nonce → PSP → Token → Hosted Payment Page
```

The PSP usually hosts the checkout page, handling card data directly to reduce PCI scope.

---

# Reconciliation

Even if everything succeeds, systems may diverge.

Every day:

```
Settlement File
        │
        ▼
Reconciliation Service
        │
    Compare: PSP ↔ Ledger ↔ Wallet
```

Mismatch handling:

1. Automatic correction
2. Manual finance adjustment
3. Investigation for unknown issues

---

# Long-running Payments

Some payments take minutes or days (fraud review, 3D Secure, manual approval).

Common flow:

```
Client → Pending → Webhook / Polling → Completed
```

Most PSPs notify status through webhooks (preferred) or polling.

---

# Internal Communication

## Synchronous (HTTP)

- Simple, but tight coupling and cascading failures.

## Asynchronous

### Queue (Point-to-Point)

One consumer per message. Used for: retry queues, payment processing.

### Event Streaming (Kafka)

Multiple consumers process the same event. Used for: analytics, billing, notifications, reporting.

Preferred for large payment platforms.

---

# Failure Handling

## Retry Queue

Temporary failures (network timeout, transient PSP failure):

```
Payment → Fail → Retry Queue → Retry
```

## Dead Letter Queue (DLQ)

Messages that repeatedly fail. Useful for debugging, manual inspection, and isolation.

---

# Exactly-Once Delivery

A customer must never be charged twice.

```
Exactly-once = At-least-once (retries) + At-most-once (idempotency)
```

## Retry Strategies (At-least-once)

- Immediate
- Fixed interval
- Incremental
- Exponential backoff ⭐
- Cancel

Use exponential backoff for transient failures.

## Idempotency (At-most-once)

Every request carries an idempotency key:

```
POST /payments
Idempotency-Key: 550e8400...
```

Flow:

```
Receive request
        │
Already seen?
   ├── Yes → Return previous result
   └── No  → Process payment
```

Implementation: UUID, shopping cart ID, database unique constraint.

Benefits: safe retries, double-click protection, network retry safety.

---

# Consistency

State exists in multiple systems: Payment Service, Ledger, Wallet, PSP, database replicas.

Techniques:

- Exactly-once processing
- Idempotency
- Reconciliation

Replication consistency options:

- Read/write primary only
- Consensus databases (Raft, Paxos, CockroachDB, YugabyteDB)

---

# Security

| Threat         | Mitigation                    |
| -------------- | ----------------------------- |
| Eavesdropping  | HTTPS                         |
| Data tampering | Encryption + integrity checks |
| MITM           | TLS + certificate pinning     |
| Data loss      | Replication + backups         |
| DDoS           | Rate limiting + firewall      |
| Card theft     | Tokenization                  |
| Fraud          | CVV, AVS, behavior analysis   |
| Compliance     | PCI DSS                       |

---

# Monitoring

Track:

- Payment success rate
- Retry count
- PSP latency
- Failed transactions
- Queue sizes
- Reconciliation mismatches
- Acceptance rate
- Fraud rate

---

# Cheat Sheet

| Concept            | Recommendation         |
| ------------------ | ---------------------- |
| Accounting         | Immutable ledger       |
| Merchant balance   | Wallet                 |
| Prevent duplicates | Idempotency            |
| Reliability        | Retry queue            |
| Failed retries     | DLQ                    |
| Consistency        | Reconciliation         |
| External updates   | Webhooks               |
| Events             | Kafka                  |
| Temporary failures | Exponential backoff    |
| Security           | Tokenization + PCI DSS |

---

# Additional Interview Topics

- Currency exchange
- Geographic payment methods
- Cash payments
- Webhooks vs polling
- Ledger design and double-entry bookkeeping
- PCI DSS scope reduction via tokenization
- Fraud detection pipelines
- Settlement process

---

# Related Notes

- [transactions-and-concurrency.md](../transactions-and-concurrency.md) — ACID, isolation levels, distributed transactions
- [event-driven-architecture.md](../event-driven-architecture.md) — Kafka, event sourcing, CQRS
- [databases-and-storage.md](../databases-and-storage.md) — SQL vs NoSQL, replication, partitioning
- [design-digital-wallet.md](./design-digital-wallet.md) — wallet balances, TCC, 2PC, event sourcing
- [aws-services-gotchas.md](../aws-services-gotchas.md) — SQS DLQ, Kinesis for event streaming, RDS for ledger

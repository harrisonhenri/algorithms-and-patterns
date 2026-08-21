---
tags:
  [
    system-design,
    interview-prep,
    wallet,
    distributed-transactions,
    event-sourcing,
    sharding,
  ]
title: "Design a Digital Wallet"
---

# Design a Digital Wallet

## Goal

Design a digital wallet that supports:

- Balance transfers between users
- High throughput (1M transfers/sec)
- Transactions
- High availability
- Reproducible account history

---

## Requirements

### Functional

- Transfer money between wallets
- Prevent duplicate transfers
- Support transactions
- Reconstruct balances from history

### Non-functional

- 1M TPS
- 99.99% availability
- Strong correctness
- Scalability and reliability

---

# Back-of-the-Envelope

```
1M transfers/sec
     ↓
2M DB operations/sec (debit + credit)
     ↓
≈2,000 DB nodes at 1,000 TPS each
```

Increasing TPS per node reduces cluster size.

---

# API

```
POST /v1/wallet/balance_transfer
```

Request body:

- `from_account`
- `to_account`
- `amount`
- `currency`
- `transaction_id` — enables deduplication

> Store money as **string/decimal**, not floating-point, to avoid precision loss.

---

# High-Level Architecture

```
Client → Wallet Service → Sharded Storage → Database Cluster
```

Wallet Service is stateless and horizontally scalable.

---

# Design 1 — In-memory Solution

Use Redis as a distributed key-value store.

```
Account → hash(account) → Redis Cluster
```

ZooKeeper stores partition metadata.

**Problem:** Transferring `A → B` requires updating two different Redis nodes. If one update succeeds and the other fails, money is lost. No atomicity.

---

# Design 2 — Distributed Transactions

Replace Redis with transactional relational databases (sharded SQL).

Still need atomic updates across shards → requires distributed transaction protocol.

---

# Two-Phase Commit (2PC)

Goal: atomic transaction across multiple databases.

## Phase 1 — Prepare

Coordinator asks every database: "Can you commit?"

All participants lock data and prepare the transaction.

## Phase 2

- All agree → Commit
- Any disagree → Rollback

## Pros

- Strong consistency
- Atomic

## Cons

- Long-held locks
- Coordinator is a single point of failure
- High latency
- Does not scale well

---

# Try-Confirm/Cancel (TCC)

Alternative distributed transaction protocol. Each phase is its own independent transaction.

## Try

Reserve resources:

```
A: -$1 (reserved)
C: no-op
```

## Confirm

Complete the operation:

```
C: +$1
```

## Cancel

Undo reserved work (compensation):

```
A: +$1
```

---

# 2PC vs TCC

| Feature     | 2PC    | TCC          |
| ----------- | ------ | ------------ |
| Locks       | Long   | Short        |
| Rollback    | Native | Compensation |
| Performance | Lower  | Higher       |
| Scalability | Lower  | Better       |
| Complexity  | Lower  | Higher       |

---

# Sharding

Accounts are partitioned by hash:

```
partition = hash(account_id) % N
```

Partition metadata stored in ZooKeeper.

Benefits:

- Even distribution
- Horizontal scaling

---

# Correctness

Wallets require:

- Atomic transfers
- No lost money
- No duplicated money
- Transaction durability

Distributed transactions guarantee:

```
Debit + Credit = One atomic transfer
```

---

# Reproducibility

Historical balances must always be reconstructable. Instead of relying only on current balance:

```
Replay all transfers → Current balance
```

This leads naturally to Event Sourcing.

Benefits:

- Auditing
- Debugging
- Recovery
- Financial correctness

---

# Event Sourcing

Instead of storing mutable balances, store immutable transfer events:

```
+100 → -20 → +5 → -10
```

Current balance is computed by replaying events.

**Benefits:**

- Immutable history
- Easy replay
- Excellent auditability

**Trade-offs:**

- More storage
- Read-side projections needed
- Higher implementation complexity

---

# Scalability

- Shard databases by account
- Keep Wallet Service stateless
- Scale horizontally
- Increase per-node TPS to reduce cluster size
- Use partition-aware routing

---

# Monitoring

Track:

- Transfer latency
- Failed transfers
- Retry count
- TPS
- Database contention
- Coordinator failures
- Shard balance
- Queue backlog

---

# Cheat Sheet

| Problem            | Solution                |
| ------------------ | ----------------------- |
| Scale              | Sharding                |
| Duplicate transfer | Transaction ID          |
| Cross-shard update | Distributed transaction |
| Strong atomicity   | 2PC                     |
| Better scalability | TCC                     |
| Historical replay  | Event Sourcing          |
| Money precision    | Decimal/String          |
| Partition lookup   | ZooKeeper               |
| Wallet service     | Stateless               |
| Auditability       | Immutable events        |

---

# Additional Interview Topics

- Event sourcing vs mutable state
- CQRS
- Distributed transactions (2PC vs Saga vs TCC)
- ZooKeeper for coordination
- Database sharding
- Idempotency key design
- Decimal vs floating-point money
- Financial auditability requirements

---

# Related Notes

- [transactions-and-concurrency.md](../transactions-and-concurrency.md) — ACID, isolation levels, 2PC, optimistic/pessimistic locking
- [consensus-and-replication.md](../consensus-and-replication.md) — Raft, Paxos, leader election, replication
- [event-driven-architecture.md](../event-driven-architecture.md) — event sourcing, CQRS, Kafka
- [design-payment-system.md](./design-payment-system.md) — PSP integration, ledger, idempotency, reconciliation
- [distributed-systems-algorithms.md](../distributed-systems-algorithms.md) — consistent hashing, ZooKeeper

---
tags:
  [
    system-design,
    transactions,
    concurrency,
    theory,
    exactly-once,
    safety,
    liveness,
  ]
title: "Transactions and concurrency"
---

# Safety vs Liveness in Transactional Systems

Two foundational properties guide distributed transactional design:

## Safety

"**Nothing bad happens.**"

In transactional context:

- No duplicate execution of commands
- No partial state corruption
- No lost updates
- Invariants always hold
- ACID properties maintained

Characteristics:

- Violations are **catastrophic and permanent**
- Cannot be recovered after violation occurs
- Systems **prioritize safety above all else**

Example:

- Better to be unavailable than to corrupt account balance
- Better to reject a transaction than to execute it twice

---

## Liveness

"**Something good eventually happens.**"

In transactional context:

- Requests eventually complete
- Transactions eventually commit or abort
- Lock holders eventually release
- Progress continues despite component failures

Characteristics:

- Temporary liveness violations acceptable
- System can recover
- Users tolerate brief unavailability

Example:

- Temporary database lock is okay
- Distributed commit delayed is okay
- As long as it eventually resolves

---

## Safety vs Liveness Tradeoff

During failure scenarios, systems must choose:

| Scenario                | Safety Priority                       | Liveness Priority                         |
| ----------------------- | ------------------------------------- | ----------------------------------------- |
| **Network partition**   | Reject requests to ensure consistency | Serve stale data to stay available        |
| **Coordinator failure** | Block other nodes (2PC)               | Retry or failover (risk inconsistency)    |
| **Lock contention**     | Hold lock (ensure atomicity)          | Timeout and abort (sacrifice consistency) |

Most production systems choose:

> **Safety over Liveness**
>
> "It is better to be consistent and occasionally unavailable than to serve inconsistent data."

---

# Exactly-Once Semantics

## The Core Problem

In distributed systems with **retries, failures, and message loss**, it's nearly impossible to guarantee exactly-once execution.

Why exactly-once is hard:

1. **Messages may be lost** — no ACK received
2. **Nodes may crash mid-processing** — partial execution
3. **Retries send duplicates** — was first one delivered?
4. **Acknowledgments can be lost** — producer doesn't know status
5. **Failure detection is uncertain** — slow vs dead?
6. **Process pauses** — operation appears to hang

Example: Banking transfer

```
Account A: debit $100
Account B: credit $100

Failure scenarios:
• Debit succeeds, credit fails, retry debits again → wrong balance
• Both fail → money lost
• Both succeed but ACK lost → appears to fail, operator retries
• Node pauses between debit and credit → inconsistent state
```

---

## Delivery Guarantee Semantics

Distributed systems offer different delivery guarantees, each with tradeoffs. These guarantees apply to message systems, RPC calls, and database operations.

### At-Most-Once

- Message delivered **zero or one time**
- May be lost
- Never duplicated

**Use when:**

- Data loss acceptable (analytics, metrics, non-critical events)
- Duplicate worse than loss (ad impressions, unique counts)

**Examples:** UDP, fire-and-forget RPC, some message brokers without retries

**Trade-offs:**

- ✓ Lowest latency
- ✓ Simplest implementation
- ✗ Data loss possible
- ✗ Unreliable for critical operations

---

### At-Least-Once

- Message delivered **one or more times**
- Never lost
- May be duplicated

**Use when:**

- Duplicates tolerable (operations are idempotent)
- Data loss unacceptable (important transactions)

**Examples:** Kafka default, RabbitMQ with manual acknowledgments, retry-based systems

**Implementation:**

- Broker/sender retries on no acknowledgment
- Consumer may see duplicates on failure recovery

**Trade-offs:**

- ✓ Never loses data
- ✓ Good for most practical use cases
- ✓ Relatively simple
- ✗ Requires idempotent processing
- ✗ Slightly higher latency due to retries

---

### Exactly-Once

- Message delivered **precisely once**
- Never lost
- Never duplicated

**Use when:**

- Financial transactions (no duplicates allowed)
- Accounting systems (every transaction counted once)
- Inventory management (duplicate decrement breaks stock)
- Mission-critical operations (both loss AND duplication unacceptable)

**Implementation:**
Combination of mechanisms:

- Unique message IDs (request ID, correlation ID, offset)
- Idempotent processing
- Deduplication tracking
- Atomic offset commits
- State persistence

**Examples:** Modern Kafka transactional mode, Apache Flink checkpoints, traditional ACID databases with 2PC

**Trade-offs:**

- ✓ Perfect correctness
- ✓ No data loss
- ✓ No duplicates
- ✗ Most complex implementation
- ✗ Higher latency (coordination overhead)
- ✗ Lower throughput (atomic operations)

---

## Why Exactly-Once Matters

Industries relying on exactly-once:

- **Financial systems** — every transaction must execute precisely once
- **Payments** — duplicate charge is catastrophic
- **Inventory** — duplicate decrement breaks stock tracking
- **Accounting** — every transaction must be recorded
- **Data pipelines** — duplicates skew analytics

Failure = data loss or corruption.

---

## Foundation: Idempotency

The key to achieving exactly-once behavior.

### Definition

An operation is **idempotent** if executing it multiple times produces the same result as executing it once.

### Examples

**Idempotent operations:**

- Setting `user.name = "Alice"` (multiple sets = same result)
- Deleting a record (delete once or multiple times = gone)
- Inserting with unique constraint (duplicate insert fails, already in DB)
- HTTP PUT (replace resource with same value = same state)

**Non-idempotent operations:**

- Incrementing counter (5 → 6 → 7, different each time)
- Appending to list (each append adds duplicate)
- Charging credit card (each charge deducts money)
- HTTP POST (each POST creates new resource)

### Achieving Idempotency

**Strategy 1: Unique Request ID**

```
Every request includes unique ID (UUID, nonce, etc.)
Server stores processed IDs
If duplicate request arrives:
  ✓ Already in processed set?
  → Return cached result immediately
  → Don't re-execute operation
```

**Strategy 2: Compare-and-Swap (CAS)**

```
if (balance == $1000) {
    balance = $900  // deduct $100
}

If operation retried:
  • First retry: balance != $1000 (now $900), CAS fails, safe
  • No duplicate deduction
```

### CAS loops in practice

CAS is optimistic concurrency at CPU level. A typical update uses a retry loop:

```java
while (true) {
  int oldValue = counter.get();
  int newValue = oldValue + 1;
  if (counter.compareAndSet(oldValue, newValue)) {
    break;
  }
}
```

This is efficient when conflicts are rare. Under high contention, many threads repeatedly fail CAS and burn CPU on retries.

Practical rule:

- Low contention: CAS/optimistic strategies are usually best
- High contention on one key: serialize by owner/partition, or prefer lock/wait over endless retries

See also CAS details and ABA handling in [../language-mechanics/java/concurrent-programming.md](../language-mechanics/java/concurrent-programming.md).

**Strategy 3: Deterministic Processing**

```
Replay from event log deterministically
Given same input events → always same output
No side effects, purely computed
```

---

## Mechanism: Deduplication

### Request ID Deduplication

Systems deduplicate by tracking processed request IDs:

```
Message arrives: RequestID=12345, Action=Transfer $100

Deduplication table:
  12345 → Transfer result (cached)

If same message redelivered:
  ✓ RequestID 12345 found
  → Return cached result immediately
  → Never re-execute transfer
```

**Trade-offs:**

- ✓ Handles retries perfectly
- ✓ Works across network partitions
- ✓ No duplicate charges
- ✗ Requires state (dedup table)
- ✗ Dedup table must persist
- ✗ Garbage collection of old entries needed

---

## Mechanism: Offset Management

### Log-Based Exactly-Once (Kafka Model)

In systems with append-only logs (Kafka, Pulsar):

```
Topic: payments
Offset 100: Debit $100 from A
Offset 101: Credit $100 to B
Offset 102: Log transfer complete

Consumer state:
  Last processed offset: 102

Failure and recovery:
  ✓ Restart consumer → begins at offset 103
  ✓ Never reprocesses 100-102
  ✓ No duplicates
```

**Key property:**

Offset + Topic uniquely identifies a message. Storing last offset ensures exactly-once.

**Requirements:**

1. **Atomic reads** — fetch message and offset together
2. **Atomic writes** — update offset only after processing succeeds
3. **Durable offset storage** — offset persists across restarts

**Kafka Implementation:**

```java
consumer.poll()  // fetch message and offset
processMessage() // application logic
consumer.commitSync()  // atomic: offset stored in Kafka broker
```

If crash between process and commit:

- On restart: offset not updated
- Consumer replays message
- Application sees it again
- Idempotent handler deduplicates
- Result: exactly-once

---

### Offset and Result Atomicity

The key requirement for reliable event processing is:

> **Business state and processing progress must be persisted atomically.**

Whenever a message is processed, the system must ensure that both are stored together:

- Business result (database update, side effect, etc.)
- Processing progress (offset, sequence number, event ID)

---

### The Pattern

```text
1. Read message at offset 100
2. Process message
3. Atomically persist:
   - Business result
   - Offset/event ID

If crash occurs before step 3:
  → Message is replayed

If crash occurs after step 3:
  → Progress already recorded
  → Replay is skipped or deduplicated
```

---

### Why Atomicity Matters

#### ❌ Result first, offset later

```text
1. Process message
2. Store result
3. Commit offset
```

Crash between 2 and 3:

```text
Result persisted
Offset not committed

→ Message is replayed
→ Duplicate processing
```

#### ❌ Offset first, result later

```text
1. Commit offset
2. Store result
```

Crash between 1 and 2:

```text
Offset committed
Result lost

→ Message is never replayed
→ Data loss
```

---

### Kafka Transactions

Kafka's Exactly-Once Semantics (EOS) provides atomicity between:

```text
Consumed offsets
+
Produced Kafka records
```

Example:

```text
Topic A
   ↓
Process
   ↓
Topic B
```

Kafka guarantees:

```text
Either:
  - Output records are written
  - Offsets are committed

Or:
  - Neither happens
```

This works well for:

```text
Kafka → Process → Kafka
```

---

### External Database Pattern

Kafka transactions do **not** automatically include PostgreSQL, MySQL, Redis, etc.

For:

```text
Kafka → Process → Database
```

a common solution is storing both business state and processing progress in the same database transaction:

```sql
BEGIN;

INSERT INTO orders (...);

INSERT INTO processed_events (
    topic,
    partition,
    offset
) VALUES (
    'orders',
    5,
    100
);

COMMIT;
```

Now:

```text
Order created
+
Offset 100 recorded
```

are committed atomically.

---

### In Practice

Many systems achieve correctness through:

```text
At-least-once delivery
+
Idempotent processing
+
Atomic state/progress persistence
```

rather than relying solely on Kafka transactions.

---

### Isolation Level Configuration

Kafka consumers can be configured to read only committed messages:

```
Configuration: isolation.level = read_committed

Consumer behavior:
  - Only reads fully committed messages
  - Ignores in-flight transactions (not yet committed)
  - Prevents reading aborted operations
  - Ensures consistency across replicas

Alternative: isolation.level = read_uncommitted
  - Reads all messages (even uncommitted)
  - Higher throughput but weaker consistency
```

---

## Mechanism: Atomic Commits

### Two-Phase Commit (2PC)

System ensures atomicity across multiple databases:

```
Prepare phase:
  Coordinator asks all: "Can you commit?"
  DB_A: writes transaction, locks, replies "YES"
  DB_B: writes transaction, locks, replies "YES"

Commit phase:
  Coordinator: "COMMIT to all"
  DB_A: commit succeeds, releases locks
  DB_B: commit succeeds, releases locks
  Result: All-or-nothing atomicity
```

**Failure scenario:**

```
Coordinator crashes after Prepare, before Commit:
  DB_A and DB_B: locked, waiting
  On recovery: Coordinator reruns → sends COMMIT
  Operations complete without duplication
```

**Limitations:**

- ✓ Ensures atomicity
- ✓ Prevents partial updates
- ✗ Blocks other transactions (waiting for locks)
- ✗ Slow (3-phase communication)
- ✗ Unavailable if coordinator crashes (blocked indefinitely)

---

## Mechanism: Distributed Transactions

### Saga Pattern

Long-running transactions in microservices (2PC too slow):

```
Step 1: Debit from Account A
Step 2: Credit to Account B
Step 3: Log transfer

If Step 2 fails:
  Compensating transaction: Undo Step 1 (refund)
  Result: Never charged customer
```

**Choreography vs Orchestration:**

- **Choreography:** Services emit events, others react (complex to debug)
- **Orchestration:** Coordinator directs steps (clearer but adds dependencies)

---

## Real-World Exactly-Once Implementations

### Kafka (EOS Mode)

Modern Kafka (0.11+) provides exactly-once:

```
Idempotent producer (prevents duplicates on network retry)
Transactions (atomic offset commits)
Exactly-once consumer (offset + message paired)

Configuration:
  enable.idempotence = true
  isolation.level = read_committed

Result: Exactly-once across Kafka producer-broker-consumer chain
```

### Boundary of Kafka EOS guarantees

Kafka EOS does not guarantee exactly-once side effects in external systems by itself.

Failure ambiguity example:

```
Consumer reads OrderPlaced
Calls external payment API
External charge succeeds
Process crashes before offset/result commit
Message is replayed
```

Without external idempotency, the charge may execute twice.

Mitigation patterns:

- Idempotency key per business operation (for example, `chargeId`)
- Deduplication table/inbox for processed operations
- Transactional outbox to atomically persist domain change + event publication intent
- Reconciliation jobs for eventual correctness and audit repair

In production, this is often modeled as "at-least-once delivery + idempotent side effects".

Reference: [96] Gustafson et al. "KIP-98 – Exactly Once Delivery and Transactional Messaging"

---

### Apache Flink

Stream processor with exactly-once semantics:

```
Checkpointing: Periodically snapshot state + offset
On failure: Restore from checkpoint
Message processing: Deterministic + idempotent
Result: Exactly-once state updates

Key: Combines offset tracking + deterministic state + idempotence
```

Reference: [92] Tzoumas et al. "High-Throughput, Low-Latency, and Exactly-Once Stream Processing with Apache Flink"

---

### Kafka Transactions Example

```java
// Producer: exactly-once with transactional semantics
producer.initTransactions();

try {
    producer.beginTransaction();
    producer.send(new ProducerRecord("topic", key, value));
    producer.commitTransaction();  // all-or-nothing
} catch (Exception e) {
    producer.abortTransaction();
}

// Consumer: read committed + offset tracking
consumer.seek(lastCommittedOffset + 1);
while (true) {
    ConsumerRecords records = consumer.poll(...);
    for (ConsumerRecord record : records) {
        processRecord(record);  // must be idempotent
    }
    consumer.commitSync();  // atomic offset store
}
```

---

### RabbitMQ Exactly-Once Patterns

RabbitMQ doesn't natively provide exactly-once semantics like Kafka does. Instead, use this pattern:

#### Publisher Confirms + Idempotency

```
1. Publisher sends each message with unique correlation ID
2. RabbitMQ confirms receipt (publisher confirms feature)
3. Consumer processes message idempotently
4. Consumer stores correlation ID of processed messages

Duplicate detection:
  If same correlation ID seen again:
    ✓ Message already processed
    → Return cached result
    → Skip application logic
```

**Implementation:**

```java
// Publisher with confirms
Channel channel = connection.createChannel();
channel.confirmSelect();  // Enable publisher confirms

String correlationId = UUID.randomUUID().toString();
AMQP.BasicProperties props = new AMQP.BasicProperties.Builder()
    .correlationId(correlationId)
    .build();

channel.basicPublish("exchange", "routing.key", props, body);
channel.waitForConfirms();  // Wait for broker confirmation

// Consumer with deduplication
channel.basicConsume("queue", false, (tag, message) -> {
    String corrId = message.getProperties().getCorrelationId();

    if (isAlreadyProcessed(corrId)) {
        channel.basicAck(message.getEnvelope().getDeliveryTag(), false);
        return;
    }

    try {
        processMessage(message);  // must be idempotent
        recordProcessed(corrId);
        channel.basicAck(message.getEnvelope().getDeliveryTag(), false);
    } catch (Exception e) {
        channel.basicNack(message.getEnvelope().getDeliveryTag(), true);
    }
});
```

**Trade-offs:**

- ✓ Works with RabbitMQ's simpler architecture
- ✓ No special broker features needed
- ✗ Requires application-level deduplication state
- ✗ Dedup table must persist across restarts
- ✗ Garbage collection of old correlation IDs needed

---

## Stream Processing and Exactly-Once

### Apache Flink Checkpointing Model

Stream processing frameworks achieve exactly-once through **periodic snapshots**:

```
Checkpointing process:
  1. Pause all inputs momentarily
  2. Snapshot all in-flight state
  3. Flush outputs atomically
  4. Resume processing

Failure recovery:
  ✓ Restore from checkpoint
  ✓ Replay from saved offset
  ✓ Deterministic reprocessing
  ✓ Exactly-once state updates (no duplicates)
```

**Key insight:** Combining offset tracking + deterministic processing + atomic snapshots = exactly-once.

**Apache Flink Implementation:**

```
Configuration: execution.checkpointing.mode = EXACTLY_ONCE

Guarantees:
  - Periodic snapshots of operator state
  - Exactly-once writes to external systems
  - Replay deterministically on failure
  - No duplicate state updates
```

---

## Achieving Exactly-Once: Checklist

To claim exactly-once semantics, ensure:

- [ ] **Idempotent processing** — same message processed multiple times = same result
- [ ] **Unique message identifiers** — request ID, correlation ID, or offset
- [ ] **Deduplication state** — persistent log of processed IDs or offsets
- [ ] **Atomic offset commits** — offset and processing results stored atomically
- [ ] **Failure recovery** — crash recovery doesn't duplicate
- [ ] **State persistence** — processed state survives restarts
- [ ] **End-to-end semantics** — covers full pipeline (not just broker)

**Note:** Many systems claim "effectively-once" (at-least-once + idempotent) rather than strict exactly-once. The distinction matters operationally.

Reference: [90] Klang, Viktor. "I'm coining the phrase 'effectively-once' for message processing with at-least-once + idempotent operations"

---

# Transactions and locking

<aside>
Some databases commands acquire lock automatically, like TRUNCATE.

</aside>

## Pessimistic locking

Components preemptively acquire exclusive locks on resources, preventing other components to access or modify the locked resource:

- Straightforward approach to managing concurrent access, but has the potential for increased contention (threads in idle waiting the lock be released) and even starvation, especially in scenarios with high concurrency
- It's worth to say that locks held for extended periods might impact system performance and throughput
- SELECT FOR UPDATE OR SHARE are a form of pessimistic locking
- Pessimistic locking is safe and simple for centralized financial systems but can create performance bottlenecks and retry amplification in highly distributed, horizontally scaled architectures with high contention.

## Optimistic locking

Manage concurrent access to shared resources with an optimistic assumption that conflicts are infrequent or less likely to occur:

- Rather than preventing concurrent access, optimistic locking defers conflict detection until the time of committing changes
- Reduced contention
- When to use: read-heavy systems where conflicts are rare or infrequent or the transactions are short-lived

### Contention management decision ladder

When retries start dominating useful work, escalate your strategy:

1. Optimistic retry (best for low conflict rates)
2. Bounded retries with backoff/jitter
3. Serialize by key (single-writer ownership, partitioning, queue)
4. Pessimistic lock/wait for hotspot resources

Under hotspot contention, waiting can outperform infinite optimistic retries because it limits retry storms and CPU churn.

## Distributed locking

Method used to prevent multiple nodes from reading and writing to the same resource simultaneously by using a global lock. If the lock acquisition is successful, the node can safely perform the operation knowing. Despite its potential, distributed locking introduces some challenges:

- Deadlocks can occur if some node fails to release the lock, or event if there is a network partition
- Lock timeouts

## Distributed transactions

- **Necessary:** For fast, atomic updates of related data across multiple databases where the operation needs to be done almost immediately.
- **Unnecessary:** When speed is not critical; alternative methods can ensure data consistency.

## 2PC and 3PC

Protocols that help to span transaction across multiple nodes when strong consistency is required.

### 2PC (or XA transactions)

The 2PC is a blocking protocol (e.g: if the coordinator fails after some nodes have voted but before a decision is made, the nodes remain blocked) that has two phases:

1. The coordinator sends a “prepare” message to all the participants, asking if they are ready to commit the transaction. Then, each participant executes the transaction up to the point where it will be asked to commit
2. If the coordinator receives a “Yes” vote from all participants, it sends a “commit” message; otherwise, it sends an “abort” message

### 3PC

It's more of a theoretical model (does not have too much addoption in practice). Unlike 2PC, 3PC is a non-blocking protocol. To achieve this, an additional phase (and a timeout rule) is necessary to recover from possible failures:

1. The coordinator sends a “prepare” message to all the participants, asking if they are ready to commit the transaction. Then, each participant executes the transaction up to the point where it will be asked to commit
2. If the coordinator receives a “Yes” vote from all participants, it sends a “pre-commit” message. The participants, after receiving the “pre-commit” message, also enter the “pre-committed” state and acknowledge the coordinator
3. After receiving an acknowledgment from all participants, the coordinator sends a “do-commit” message. Upon receiving the “do-commit” message, the participants also move to the “committed” state

| Protocol | Availability | Failure Handling              | Complexity | Performance                             | Best Use Case                                     |
| -------- | ------------ | ----------------------------- | ---------- | --------------------------------------- | ------------------------------------------------- |
| **2PC**  | Low          | Blocking if coordinator fails | Moderate   | **Slow** (waiting for all participants) | Financial transactions, strong consistency needed |
| **3PC**  | Medium       | Non-blocking with timeouts    | High       | **Slower** (extra communication step)   | Fault-tolerant distributed systems                |

## Saga pattern

Long distributed transactions in a microservices architecture are tipically implemented using this pattern. Here, 2 and 3pc are not a option since they need a confirmation from all nodes, what reduces the avaliability of the system.

### Choreographed

Choreographed transactions can be somewhat brittle, generally require a strict ordering, and can be problematic to monitor. They work best in services with a very small number of microservices, such as a pair or a trio with very strict ordering and a low likelihood of needing workflow changes.

### Orchestrated

Orchestrated transactions offer better visibility into workflow dependencies, more flexibility for changes, and clearer monitoring options than choreographed transactions. The orchestrator instance adds overhead to the workflow and requires management, but can provide to complex workflows the clarity and structure that choreographed transactions cannot provide.

---

# High-Concurrency Systems and Conflict Avoidance

## The Fundamental Problem

When conflicts are common, systems operating at high concurrency face a critical challenge:

> **Truly high-scale systems avoid "everyone concurrently updating the same thing."**

This is one of the hardest problems in distributed systems and databases. The naive approach of optimistic retries collapses under heavy contention because:

- Each abort requires a retry
- Retries cause cascading load
- Aborts increase exponentially with contention
- System throughput plummets despite more resources

Instead of accepting conflicts, successful high-concurrency systems **redesign the architecture** to:

- Minimize contention at the source
- Serialize ownership (one owner per entity)
- Partition state (divide responsibility)
- Avoid global coordination

---

## A. Single-Writer Ownership

**Key principle:** Instead of allowing many threads to concurrently update the same entity, assign one logical owner to process all updates sequentially.

This is **extremely common** in production systems because it completely eliminates conflicting writes.

Example:

```
❌ Bad: 100 threads update account 123 concurrently
   → Conflicts, retries, contention

✅ Good: One logical owner processes all account 123 updates sequentially
   → No conflicts, no retries
```

---

## B. Kafka Partitioning Model

A practical application of single-writer ownership:

```
Partition key = accountId

all operations for account 123 → same partition → same processing thread
```

**Results:**

- Kafka guarantees order per partition
- All operations for one account process sequentially
- **Single-threaded semantics without application complexity**
- Naturally eliminates read-modify-write conflicts

This pattern is **fundamental to modern data pipeline architecture**.

---

## C. Actor Model

Frameworks like Akka and Project Orleans implement this at the application level:

```
Actor = logical owner of one entity

AccountActor(123) processes:
  - deposit messages
  - withdraw messages
  - transfer messages
  ... sequentially
```

**Advantages:**

- No shared-memory concurrency
- No explicit locking needed
- Scales horizontally across clusters
- Natural failure isolation

**Trade-off:**

- Must think in message passing terms
- Cross-actor coordination adds complexity

---

## D. Ledger and Event Sourcing

Financial systems frequently avoid mutable state:

**Instead of:**

```sql
UPDATE account SET balance = balance - 100
WHERE id = 123;
```

**They do:**

```
append transaction event:
  { account_id: 123, delta: -100, timestamp: T }
```

Then compute balance as derived state:

| Transaction | Delta | Running Balance |
| ----------- | ----- | --------------- |
| T1          | +100  | 100             |
| T2          | -30   | 70              |
| T3          | +50   | 120             |

**Why it reduces contention:**

- Appends almost never conflict (append-only semantics)
- No read-modify-write race conditions
- Entire history is immutable audit trail
- Balance is eventually consistent but safe

---

## E. Partitioning and Sharding

Reduce collision domain by dividing responsibility:

**Instead of:**

```
global account balance table
```

**Shard by:**

- Customer ID
- Geographic region
- Account type
- Merchant category

**Effect:**

- Different shards operate independently
- Conflicts localized to one shard
- Shard-level contention far lower than global
- Horizontal scaling becomes possible

---

## F. Queues Instead of Free Concurrency

Replace unbounded concurrent access with controlled processing:

**Instead of:**

```
all requests hit database simultaneously
  → severe contention
  → high abort rates
  → cascading failures
```

**Use:**

```
request queue
  → partitioned by business key
  → bounded processing rate
  → backpressure naturally applied
```

Systems like Kafka, RabbitMQ, and Apache Pulsar are critical for this architecture because they provide:

- Ordered processing per partition
- Natural rate limiting
- Failure isolation
- Replayability

---

## G. Idempotent Operations and Deduplication

High-concurrency systems assume retries will happen. Prepare for them:

**Instead of:**

```
transfer_id = random()
withdraw from source  (might fail and retry)
```

**Do:**

```
transfer_id = UUID (deterministic or provided by caller)

operation: {
  id: transfer_id,
  source_account: 123,
  amount: 100
}

database tracks seen transfer_ids
  → prevents duplicate execution on retry
```

Every operation must be:

- Idempotent (safe to replay)
- Uniquely identified (deduplicatable)
- Safely retryable (no side effects outside transaction)

This is **essential** for exactly-once semantics in distributed systems.

---

## H. Serializable Isolation Only Where Necessary

Full serializability everywhere is expensive. High-concurrency systems mix approaches:

| Workflow Type            | Isolation Level       | Reasoning                                           |
| ------------------------ | --------------------- | --------------------------------------------------- |
| Critical ledger movement | Serializable          | Must be correct; cost acceptable                    |
| Account balance checks   | Snapshot isolation    | Eventual consistency acceptable; no race conditions |
| Analytics/reporting      | Read committed        | Old data okay; minimal locks needed                 |
| Notifications            | Eventually consistent | Order doesn't matter; speed over correctness        |
| Search indexing          | Eventually consistent | Stale results acceptable                            |

**Key insight:**

> Different transactions need different guarantees. Use serializability surgically.

---

## Architectural Pattern: High-Scale Financial Systems

Conceptually, systems handling billions of operations resemble:

```
partitioned append-only event logs
  +
single-writer ownership per entity
  +
idempotent command deduplication
  +
event sourcing for derived state
  +
careful serializability boundaries
  +
queue-based rate limiting
```

**NOT:**

```
massive shared mutable tables
  with global contention
  and optimistic retry loops
```

Examples in production:

- **Stripe, Square**: Event-sourced transaction logs per merchant
- **Financial institutions**: Partitioned ledger systems
- **Booking platforms**: Actor-model for inventory per property
- **Message brokers**: Single-writer per partition topic

---

## Decision: When to Apply Each Pattern

| Pattern                 | Best For                      | Trade-off                                |
| ----------------------- | ----------------------------- | ---------------------------------------- |
| Single-writer ownership | High-frequency entity updates | Must coordinate across entities          |
| Partitioning            | Scaling hot data              | Cross-partition transactions expensive   |
| Event sourcing          | Audit + temporal queries      | Storage overhead, eventual consistency   |
| Queuing                 | Rate limiting + backpressure  | Latency increase, operational complexity |
| Idempotent ops          | Failure resilience            | Deduplication storage + logic            |
| Mix isolation levels    | Cost optimization             | Consistency complexity, harder reasoning |

---

# Isolation Levels

## ACID Properties Summary

### 1. Atomicity

Atomicity ensures that a transaction is **all-or-nothing**.

If any part of a transaction fails (crash, network issue, constraint violation), the entire transaction is aborted and **all partial writes are undone**.

The system must end either:

- in the state _before_ the transaction, or
- in the state _after_ it,
  but never an in-between state.

Without atomicity, partial updates lead to inconsistent data and unsafe retries.

> Atomicity = ability to abort and roll back completely.

---

### 2. Consistency (ACID sense)

Consistency refers to **application-defined invariants** that must always hold.

Examples:

- Total credits = total debits
- A referenced record must exist

A transaction preserves consistency if:

- It starts from a valid (consistent) database state, and
- Its writes do not violate invariants.

Important notes:

- The database **cannot guarantee your business logic**.
- Some constraints (FK, uniqueness) help, but domain logic is your responsibility.

> Consistency is an application-level property, not a database property.

---

### 3. Isolation

Isolation ensures that transactions **do not interfere with each other**, even when executed concurrently.

Ideal target: **serializability**

> The final result is the same as if all transactions ran sequentially (one after another).

In practice:

- Full serializability is often expensive.
- Many systems use weaker guarantees like **snapshot isolation**.

Isolation prevents race conditions such as two clients incrementing the same counter and overwriting each other’s results.

---

### 4. Durability

Durability guarantees that once a transaction **commits**, its data will persist.

Mechanisms commonly used:

- Writing to disk/SSD
- Write-ahead logs
- Replication to other nodes
- Backups

Durability is not perfect:

- Hardware can fail
- Multiple replicas may crash
- Filesystems and firmware may corrupt data
- SSDs may lose data after power loss
- Backups may carry corrupted data

> Durability reduces risk — no system can provide absolute guarantees.

---

## Read Committed

### Main Guarantees

1. **No dirty reads** — transactions only see committed data.
2. **No dirty writes** — transactions only overwrite committed data.

---

### No Dirty Reads

- Prevents seeing uncommitted (temporary) changes made by other transactions.
- Avoids inconsistent partial updates and data that could later be rolled back.
- **Example:** a user sees an unread email but an outdated counter — a confusing, partial state.

---

### No Dirty Writes

- Prevents overwriting uncommitted data from another transaction.
- Databases ensure this by delaying a write until previous writers commit or abort.
- **Example:** two users buying the same car—without protection, one might get the listing, the other the invoice.
- Prevents mixed writes but not **lost updates** (a separate problem).

---

### Implementation

- Databases (Oracle, PostgreSQL, SQL Server, etc.) usually use **row-level locks** to prevent dirty writes.
- To prevent dirty reads, most use **multi-version concurrency control (MVCC)**:
  - Keeps both the old committed value and the new uncommitted one.
  - Readers see the old value until the write commits.
- Avoids performance issues caused by read locks blocking transactions.

---

## Snapshot Isolation and Repeatable Read

### Problem with Read Committed

- Can cause **nonrepeatable reads (read skew)** — data may be inconsistent across queries.
  - **Example:** in-progress transfer shows $400 and $500 totaling $900 instead of $1000.

---

### Snapshot Isolation

- Each transaction reads from a **consistent snapshot** of the database.
- Prevents read skew during:
  - Backups
  - Analytics
  - Integrity checks
- Supported by PostgreSQL, MySQL (InnoDB), Oracle, SQL Server, etc.
- Principle: **“Readers never block writers, and writers never block readers.”**

---

### Implementation via MVCC

- Database stores **multiple versions** of each object:
  - `created_by` and `deleted_by` transaction IDs
  - Updates behave like delete + insert
- Visibility rules:
  1. Ignore in-progress/aborted transactions
  2. Ignore transactions that started later
  3. Show only data committed before snapshot

---

### Indexes in MVCC

- Indexes may contain pointers to multiple row versions.
- Some DBs use **append-only B-trees** (CouchDB, Datomic, LMDB).

---

### Naming Confusion

- Snapshot isolation ≈ Repeatable Read (PostgreSQL/MySQL)
- Oracle calls it Serializable
- SQL standard is ambiguous and predates MVCC

---

## Preventing Lost Updates

### The Lost Update Problem

Occurs when two transactions **read–modify–write** the same data concurrently.

Examples: counters, balances, wikis, JSON blobs.

---

### Solutions

### 1. Atomic Write Operations

```sql
UPDATE counters SET value = value + 1 WHERE key = 'foo';

```

- Also in MongoDB (`$inc`) and Redis (`INCR`)

---

### 2. Explicit Locking

```sql
BEGIN;
SELECT * FROM figures WHERE name = 'robot' FOR UPDATE;
UPDATE figures SET position = 'c4';
COMMIT;

```

---

### 3. Automatic Lost Update Detection

Supported by:

- PostgreSQL (repeatable read)
- Oracle (serializable)
- SQL Server (snapshot)
  Not supported by:
- MySQL/InnoDB

---

### 4. Compare-and-Set (CAS)

```sql
UPDATE wiki_pages
SET content = 'new'
WHERE id = 1234 AND content = 'old';

```

---

### 5. Conflict Resolution in Replicated Systems

- CRDTs, commutative ops
- Avoid LWW unless necessary

---

## Write Skew and Phantoms

### Write Skew

Occurs when **two transactions read overlapping data and write different rows**, breaking an invariant.

Example: both doctors go off call → no doctor left.

---

### Characteristics

- Not a lost update
- Not the same row
- Requires serializable to prevent

---

### Solutions

1. Serializable isolation
2. Explicit locking:

   ```sql
   SELECT * FROM doctors
   WHERE on_call = true
   FOR UPDATE;

   ```

3. Materialized conflict tables

---

### Common Scenarios

| Scenario             | Anomaly                 |
| -------------------- | ----------------------- |
| Meeting room booking | Double booking          |
| Multiplayer game     | Two pieces to same tile |
| Username claim       | Duplicate username      |
| Double spending      | Overdraw                |

---

### Phantoms

- When a write changes the result of another transaction’s earlier query
- Snapshot isolation prevents read phantoms but not write phantoms
- Serializable isolation or materialized conflicts required

---

## Serializability

### Overview

- Strongest isolation level
- Ensures **serial equivalence** even with concurrency
- Prevents:
  - Dirty reads
  - Dirty writes
  - Lost updates
  - Write skew
  - Phantoms

---

### Why Not Always Use It?

- Historically slow
- Complex logic
- Hard to debug

---

## Implementations of Serializability

### 1. Actual Serial Execution

### Concept

- One transaction at a time, one thread.

### Pros

- Perfect serializability
- No locking

### Cons

- Single CPU core
- Needs partitioning
- Slow transactions block all

---

### 2. Two-Phase Locking (2PL)

### Behavior

- Readers block writers
- Writers block readers
- Locks held until commit
- May cause deadlocks

### Pros

- Full serializability

### Cons

- High latency
- Poor concurrency

---

### 3. Serializable Snapshot Isolation (SSI)

### How It Works

- Uses snapshot reads
- Checks conflicts at commit
- Aborts conflicting transactions

### Pros

- High concurrency
- Close to SI performance

### Cons

- Many aborts under contention
- Requires retry logic

---

## Summary Table

| Isolation Level    | Dirty Reads | Dirty Writes | Read Skew | Lost Updates | Write Skew | Implementation     |
| ------------------ | ----------- | ------------ | --------- | ------------ | ---------- | ------------------ |
| Read Committed     | Prevented   | Prevented    | ❌        | ❌           | ❌         | Locks / MVCC       |
| Snapshot Isolation | Prevented   | Prevented    | Prevented | ⚠️ Sometimes | ❌         | MVCC               |
| Serializable       | Prevented   | Prevented    | Prevented | Prevented    | Prevented  | Serial / 2PL / SSI |

---

# MongoDB Locking Model

MongoDB uses **multi-granularity locking**:

- **Global**
- **Database**
- **Collection**
- **Document**
- **Index entry**

All locks are:

- **internal**
- **short-lived**
- **released automatically**
- **not controllable by the user**

---

## 🔐 Lock Types (simplified)

| Lock | Meaning           |
| ---- | ----------------- |
| IS   | Intent Shared     |
| IX   | Intent Exclusive  |
| S    | Shared (read)     |
| X    | Exclusive (write) |

Intent locks signal _future_ lower-level locks.

---

## 🧠 Master Table — Operations vs Locks

### 📄 Document & CRUD Operations

| Operation            | Lock Scope            | Lock Mode   | Duration      | Notes                      |
| -------------------- | --------------------- | ----------- | ------------- | -------------------------- |
| `find()`             | Collection            | IS          | While reading | Uses snapshot; no blocking |
| `findOne()`          | Collection            | IS          | While reading | Same as `find()`           |
| `insertOne()`        | Collection + Document | IX + X      | During insert | Short                      |
| `updateOne()`        | Document              | X           | During update | Auto-retried               |
| `updateMany()`       | Documents             | X (per doc) | Per doc       | No table lock              |
| `deleteOne()`        | Document              | X           | During delete |                            |
| `deleteMany()`       | Documents             | X (per doc) | Per doc       |                            |
| `findOneAndUpdate()` | Document              | X           | During op     | Atomic                     |

---

### 🔁 Transactions

| Operation            | Lock Scope             | Lock Mode | Duration               | Notes              |
| -------------------- | ---------------------- | --------- | ---------------------- | ------------------ |
| Transaction start    | None                   | —         | —                      | No lock yet        |
| Write in transaction | Document               | X         | **Until commit/abort** | Key difference     |
| Read in transaction  | Collection             | IS        | While reading          | Snapshot isolation |
| Commit               | Global + affected docs | X (brief) | Very short             | Metadata update    |
| Abort                | Affected docs          | X         | Very short             | Rollback           |

⚠️ **Important**

Transactional writes **hold document locks longer** than normal writes.

---

### 📚 Index Operations

| Operation                | Lock Scope         | Lock Mode | Duration      | Notes          |
| ------------------------ | ------------------ | --------- | ------------- | -------------- |
| Index read               | Index entry        | S         | While reading |                |
| Index write              | Index entry        | X         | During update |                |
| Index build (foreground) | Collection         | X         | Entire build  | Blocking       |
| Index build (background) | Collection + Index | IX/X      | Intermittent  | Online build   |
| TTL index delete         | Document           | X         | During delete | Background job |

---

### 🧱 Collection / Database DDL

| Operation            | Lock Scope      | Lock Mode | Duration       | Notes           |
| -------------------- | --------------- | --------- | -------------- | --------------- |
| `createCollection()` | Database        | X         | Brief          |                 |
| `dropCollection()`   | Collection      | X         | Until complete | Blocking        |
| `renameCollection()` | DB + Collection | X         | Until complete | Blocking        |
| `createIndex()`      | Collection      | IX/X      | During build   | Depends on mode |
| `collMod()`          | Collection      | X         | Brief          |                 |

---

### 🧑‍💼 Administrative Operations

| Operation         | Lock Scope | Lock Mode | Duration     | Notes         |
| ----------------- | ---------- | --------- | ------------ | ------------- |
| `compact`         | Collection | X         | Long         | Blocking      |
| `fsyncLock`       | Global     | X         | Until unlock | Very blocking |
| `fsyncUnlock`     | Global     | —         | —            | Releases      |
| `shutdown`        | Global     | X         | Until stop   |               |
| `replSetStepDown` | Global     | X         | Short        | Elections     |

---

### 🔄 Replication & Background

| Operation    | Lock Scope | Lock Mode | Duration   | Notes       |
| ------------ | ---------- | --------- | ---------- | ----------- |
| Oplog apply  | Document   | X         | Per op     | Secondaries |
| Initial sync | Collection | IX/X      | Long       | Read-heavy  |
| Checkpoint   | Global     | IS        | Very brief | WiredTiger  |

---

### 🧹 Maintenance / Background Jobs

| Operation      | Lock Scope | Lock Mode | Duration     | Notes     |
| -------------- | ---------- | --------- | ------------ | --------- |
| TTL cleanup    | Document   | X         | Per delete   | Periodic  |
| Journal flush  | Global     | IS        | Microseconds |           |
| Cache eviction | None       | —         | —            | Lock-free |

---

## 🔑 Key Rules You Must Remember

### 1️⃣ No application-visible locks

MongoDB **never says**:

> “This document is locked”

Even when it is.

---

### 2️⃣ No lock survives outside an operation

Except:

- **Transactional writes**
- **DDL**
- **fsyncLock**

---

### 3️⃣ No “SELECT FOR UPDATE”

Isolation ≠ locking.

---

### 4️⃣ Auto-retry hides conflicts

Non-transactional writes retry internally → illusion of no locks.

---

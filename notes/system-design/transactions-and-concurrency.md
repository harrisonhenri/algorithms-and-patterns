---
tags: [system-design, transactions, concurrency, theory]
title: "Transactions and concurrency"
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

| Protocol | Availability | Failure Handling | Complexity | Performance | Best Use Case |
| --- | --- | --- | --- | --- | --- |
| **2PC** | Low | Blocking if coordinator fails | Moderate | **Slow** (waiting for all participants) | Financial transactions, strong consistency needed |
| **3PC** | Medium | Non-blocking with timeouts | High | **Slower** (extra communication step) | Fault-tolerant distributed systems |

## Saga pattern

Long distributed transactions in a microservices architecture are tipically implemented using this pattern. Here, 2 and 3pc are not a option since they need a confirmation from all nodes, what reduces the avaliability of the system.

### Choreographed

Choreographed transactions can be somewhat brittle, generally require a strict ordering, and can be problematic to monitor. They work best in services with a very small number of microservices, such as a pair or a trio with very strict ordering and a low likelihood of needing workflow changes.

### Orchestrated

Orchestrated transactions offer better visibility into workflow dependencies, more flexibility for changes, and clearer monitoring options than choreographed transactions. The orchestrator instance adds overhead to the workflow and requires management, but can provide to complex workflows the clarity and structure that choreographed transactions cannot provide.

---



---

# Isolation Levels

## ACID Properties Summary

### 1. Atomicity

Atomicity ensures that a transaction is **all-or-nothing**.

If any part of a transaction fails (crash, network issue, constraint violation), the entire transaction is aborted and **all partial writes are undone**.

The system must end either:

- in the state *before* the transaction, or
- in the state *after* it,
but never an in-between state.

Without atomicity, partial updates lead to inconsistent data and unsafe retries.

> Atomicity = ability to abort and roll back completely.
> 

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
> 

---

### 3. Isolation

Isolation ensures that transactions **do not interfere with each other**, even when executed concurrently.

Ideal target: **serializability**

> The final result is the same as if all transactions ran sequentially (one after another).
> 

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
> 

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

| Scenario | Anomaly |
| --- | --- |
| Meeting room booking | Double booking |
| Multiplayer game | Two pieces to same tile |
| Username claim | Duplicate username |
| Double spending | Overdraw |

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

| Isolation Level | Dirty Reads | Dirty Writes | Read Skew | Lost Updates | Write Skew | Implementation |
| --- | --- | --- | --- | --- | --- | --- |
| Read Committed | Prevented | Prevented | ❌ | ❌ | ❌ | Locks / MVCC |
| Snapshot Isolation | Prevented | Prevented | Prevented | ⚠️ Sometimes | ❌ | MVCC |
| Serializable | Prevented | Prevented | Prevented | Prevented | Prevented | Serial / 2PL / SSI |



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

| Lock | Meaning |
| --- | --- |
| IS | Intent Shared |
| IX | Intent Exclusive |
| S | Shared (read) |
| X | Exclusive (write) |

Intent locks signal *future* lower-level locks.

---

## 🧠 Master Table — Operations vs Locks

### 📄 Document & CRUD Operations

| Operation | Lock Scope | Lock Mode | Duration | Notes |
| --- | --- | --- | --- | --- |
| `find()` | Collection | IS | While reading | Uses snapshot; no blocking |
| `findOne()` | Collection | IS | While reading | Same as `find()` |
| `insertOne()` | Collection + Document | IX + X | During insert | Short |
| `updateOne()` | Document | X | During update | Auto-retried |
| `updateMany()` | Documents | X (per doc) | Per doc | No table lock |
| `deleteOne()` | Document | X | During delete |  |
| `deleteMany()` | Documents | X (per doc) | Per doc |  |
| `findOneAndUpdate()` | Document | X | During op | Atomic |

---

### 🔁 Transactions

| Operation | Lock Scope | Lock Mode | Duration | Notes |
| --- | --- | --- | --- | --- |
| Transaction start | None | — | — | No lock yet |
| Write in transaction | Document | X | **Until commit/abort** | Key difference |
| Read in transaction | Collection | IS | While reading | Snapshot isolation |
| Commit | Global + affected docs | X (brief) | Very short | Metadata update |
| Abort | Affected docs | X | Very short | Rollback |

⚠️ **Important**

Transactional writes **hold document locks longer** than normal writes.

---

### 📚 Index Operations

| Operation | Lock Scope | Lock Mode | Duration | Notes |
| --- | --- | --- | --- | --- |
| Index read | Index entry | S | While reading |  |
| Index write | Index entry | X | During update |  |
| Index build (foreground) | Collection | X | Entire build | Blocking |
| Index build (background) | Collection + Index | IX/X | Intermittent | Online build |
| TTL index delete | Document | X | During delete | Background job |

---

### 🧱 Collection / Database DDL

| Operation | Lock Scope | Lock Mode | Duration | Notes |
| --- | --- | --- | --- | --- |
| `createCollection()` | Database | X | Brief |  |
| `dropCollection()` | Collection | X | Until complete | Blocking |
| `renameCollection()` | DB + Collection | X | Until complete | Blocking |
| `createIndex()` | Collection | IX/X | During build | Depends on mode |
| `collMod()` | Collection | X | Brief |  |

---

### 🧑‍💼 Administrative Operations

| Operation | Lock Scope | Lock Mode | Duration | Notes |
| --- | --- | --- | --- | --- |
| `compact` | Collection | X | Long | Blocking |
| `fsyncLock` | Global | X | Until unlock | Very blocking |
| `fsyncUnlock` | Global | — | — | Releases |
| `shutdown` | Global | X | Until stop |  |
| `replSetStepDown` | Global | X | Short | Elections |

---

### 🔄 Replication & Background

| Operation | Lock Scope | Lock Mode | Duration | Notes |
| --- | --- | --- | --- | --- |
| Oplog apply | Document | X | Per op | Secondaries |
| Initial sync | Collection | IX/X | Long | Read-heavy |
| Checkpoint | Global | IS | Very brief | WiredTiger |

---

### 🧹 Maintenance / Background Jobs

| Operation | Lock Scope | Lock Mode | Duration | Notes |
| --- | --- | --- | --- | --- |
| TTL cleanup | Document | X | Per delete | Periodic |
| Journal flush | Global | IS | Microseconds |  |
| Cache eviction | None | — | — | Lock-free |

---

## 🔑 Key Rules You Must Remember

### 1️⃣ No application-visible locks

MongoDB **never says**:

> “This document is locked”
> 

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

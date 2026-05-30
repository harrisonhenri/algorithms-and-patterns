---
tags:
  [
    system-design,
    distributed-systems,
    consensus,
    theory,
    system-models,
    FLP,
    linearizability,
  ]
title: "Consistency, consensus, and replication"
---

# System Models and Theoretical Foundations

Different distributed systems operate under different assumptions about timing and failures. These assumptions determine what's possible to guarantee.

---

## Synchronous Model

### Assumptions

- **Bounded message delays** — all messages arrive within max time $D$
- **Bounded processing time** — all nodes process within time $P$
- **Bounded clock drift** — clocks diverge by at most rate $r$

### Implications

- If no response within $D + P$ → node is definitely dead
- Can implement reliable failure detection with certainty
- Can guarantee safety properties hold always

### Reality

- **Rarely true in practice**
- Real networks have unbounded delays
- Real systems experience arbitrarily long pauses

---

## Partially Synchronous Model

### Assumptions

- System is **usually synchronous**
- But occasionally experiences:
  - Arbitrarily long delays
  - Network partitions
  - Scheduling pauses
  - Extreme latency spikes

### Characteristics

- Most realistic for real systems
- Most practical consensus algorithms designed for this
- Assumes synchrony _usually_, not always

### Examples

- Datacenters (normally predictable, but occasional pauses)
- Cloud systems (scaling events cause delays)
- Geographically distributed systems (routing changes)

---

## Asynchronous Model

### Assumptions

- **No timing guarantees whatsoever**
- Messages can be arbitrarily delayed
- Nodes can be arbitrarily slow
- No clock synchronization assumed

### Implications

- Cannot reliably distinguish slow node from crashed node
- No reliable failure detection possible
- Many consensus problems **impossible to solve**

### Historical Significance

Foundation for **FLP Impossibility Theorem** (below).

---

## FLP Impossibility Result

One of the most important theorems in distributed systems.

### Theorem Statement

**Fischer-Lynch-Paterson (FLP) Impossibility Theorem:**

> In a purely asynchronous system, **no deterministic consensus algorithm can guarantee both safety and liveness** if even **one node may crash**.

### What It Means

**In asynchronous setting:**

- Cannot have an algorithm that:
  - Always produces correct consensus (safety)
  - AND always terminates (liveness)
  - AND tolerates even one crash fault

Must sacrifice one of:

1. **Safety** — wrong decisions possible
2. **Liveness** — may never terminate
3. **Fault tolerance** — cannot tolerate failures

### Why It Matters

**FLP proves:**

- Synchrony assumptions necessary
- Timeout-based detection essential
- Paxos/Raft rely on partial synchrony
- No "perfect" distributed consensus

### Practical Workarounds

Real systems assume **partial synchrony** and use:

- **Timeouts** — heuristically detect failures
- **Leader election** — simplify with strong leader
- **Majority quorums** — ensure progress
- **Epochs/terms** — prevent split-brain

### Connection to Reality

- FLP is a **theoretical lower bound**
- Practical systems work around it
- Explains why consensus is hard
- Justifies complexity of Paxos/Raft

---

# Consistency and Consensus

## Core Concept

Distributed systems must solve the **agreement problem**: How do replicas agree on state?

Different approaches provide different consistency guarantees.

---

## Consistency Guarantees

### Eventual Consistency

Many distributed databases replicate data **asynchronously**.

Behavior:

- Replicas temporarily diverge
- Eventually converge to same state
- Temporary inconsistency visible to clients

Advantages:

- High availability
- Low latency
- Partition tolerant
- Scales easily

Problems:

- Stale reads visible
- Conflicting updates possible
- Confusing application behavior
- Not suitable for critical data

Examples:

- Amazon Dynamo
- Cassandra
- Riak
- Most NoSQL databases

---

### Linearizability (Strong Consistency)

A system is **linearizable** if:

> Every operation appears to take effect **atomically at a single instant in time**, even in a distributed system.

#### Properties

If:

1. Client A writes `x = 5`
2. Client B reads afterward

Then B **must see** `x = 5`, never older data.

#### Why It Matters

Required for:

- **Locks** — must be exclusive
- **Leader election** — at most one leader
- **Uniqueness guarantees** — no duplicate IDs
- **Financial systems** — consistency critical
- **Distributed coordination** — shared truth

Without linearizability:

- Two leaders simultaneously possible
- Duplicate work occurs
- Invariants break

#### Cost of Linearizability

Strong consistency is **expensive**:

- **Latency** — requires coordination, quorum agreement, replication acknowledgments
- **Availability** — if quorum unavailable, must reject writes
- **Multi-region** — WAN latency adds coordination delay

---

### Linearizability vs Serializability

Critical distinction often confused.

#### Serializability

Concerned with:

- Transactions
- Multiple objects
- Database isolation levels

Property:

> **Equivalent to sequential execution** of transactions

Focus: Transaction isolation, not real-time ordering.

---

#### Linearizability Distinction

Concerned with:

- Real-time ordering
- Visibility of operations
- Recency of reads

Property:

> **Real-time ordering** of individual operations visible

Focus: One object at a time, real-world timing.

---

#### Comparison

System can be:

- ✓ Serializable but not linearizable (snapshot isolation)
- ✓ Linearizable but not serializable (violations of transaction isolation possible)
- ✓ Both (serializable snapshot isolation)
- ✗ Neither (neither isolation nor ordering)

---

## CAP Theorem

### Core Statement

In a distributed system, when a **network partition** occurs, choose between:

- **Consistency** — all nodes see same data (linearizable)
- **Availability** — system continues serving requests

You **cannot fully guarantee both simultaneously** during partitions.

### Critical Misunderstanding

CAP is **NOT about**:

- Normal operation performance
- Replication in general
- System performance trade-offs

CAP is **specifically about**:

> **Behavior during network partitions**

In non-partitioned system, consistency and availability both possible.

---

### CP Systems (Consistency over Availability)

Choose consistency, sacrifice availability during partitions.

Behavior during partition:

- May reject requests
- System becomes unavailable
- Data remains consistent
- Example: "majority partition continues, minority blocked"

Examples:

- ZooKeeper (Zab algorithm)
- etcd (Raft algorithm)
- Consul (Raft algorithm)
- Traditional databases (strong consistency)

Trade-off:

- ✓ Correct data always
- ✗ May be unavailable
- ✓ Suitable for metadata, locks, critical data

---

### AP Systems (Availability over Consistency)

Choose availability, sacrifice consistency during partitions.

Behavior during partition:

- Every partition continues serving
- Nodes may return stale/conflicting data
- Replicas diverge
- Example: "each partition has different view"

Examples:

- Dynamo (Amazon)
- Cassandra (Apache)
- Riak
- Most NoSQL databases
- DNS (eventually consistent)

Trade-off:

- ✓ Always available
- ✗ Temporarily inconsistent
- ✗ Requires conflict resolution
- ✓ Suitable for high-availability services

---

## Achieving Linearizability

Usually implemented through:

1. **Single-leader replication**
   - Leader serializes all writes
   - Followers replicate
   - Reads from leader → usually linearizable
   - Reads from followers → stale

2. **Consensus algorithms**
   - Paxos, Raft, Zab
   - Prevent split-brain via quorum
   - Linearizable by construction

3. **Quorum coordination**
   - Read and write quorums
   - Overlap requirement
   - Linearizable if quorum sizes chosen right

---

## Ordering Guarantees

Distributed systems need ordering for:

- Causality (A happens before B)
- Transactions (sequence of operations)
- Event processing (replay deterministically)
- Replication (all nodes see same order)

---

## Total Order Broadcast

Also called **atomic broadcast**.

### Guarantee

- **All nodes receive all messages**
- **In exactly the same order**
- **Guaranteed delivery**

### Importance

Deeply connected to consensus.

Example:

```
Node A sends: Update(x=1), Update(x=2), Delete(x)
Node B receives: Update(x=1), Update(x=2), Delete(x)  ← same order
Node C receives: Update(x=1), Update(x=2), Delete(x)  ← same order
```

Without ordering, replicas diverge.

### Implementation

Total order broadcast can be implemented using consensus:

- Consensus on each message's position
- Equivalent to solving consensus repeatedly

---

# Linearizability in Different Replication Models

## Single-leader replication (potentially linearizable)

- Writes always go to the leader; followers replicate.
- **Reads from the leader** (or followers with synchronous replication) **can be linearizable**.
- Not every single-leader system is linearizable:
  - Some use _snapshot isolation_ (break recency since SI gives you a consistent snapshot from the past, not a guarantee that reads reflect the most recent committed write).
  - Concurrency bugs can cause inconsistency.
- Risk: a node may believe it is the leader when it isn’t → **split-brain** → violates linearizability.
- In asynchronous replication, **failover can lose commits**, breaking durability and linearizability.
- **Examples:** PostgreSQL (read from primary), MySQL/MariaDB Primary–Replica, MongoDB (readPreference: primary).

## Consensus algorithms (linearizable)

- They resemble single-leader systems, but include mechanisms against split-brain and stale replicas.
- They safely implement linearizable storage.
- **Examples:** ZooKeeper (ZAB), etcd (Raft), Consul (Raft).

## Multi-leader replication (not linearizable)

- Multiple leaders accepting writes simultaneously.
- Writes reach each node in different orders → conflicts are inevitable.
- Conflicts exist because **there is no single “true” copy** of the state.
- **Examples:** CouchDB (multi-master), older MySQL active–active setups, Active–Active NoSQL topologies.

## Leaderless replication (likely not linearizable)

- Dynamo-like model.
- Quorums (w + r > n) do not guarantee linearizability depending on configuration.
- **Last-write-wins** based on timestamps → almost certainly nonlinearizable (clock skew).
- **Sloppy quorums** and hinted handoff → eliminate any chance.
- Even with “strict” quorums, nonlinearizable behavior still occurs.
- **Examples:** Amazon Dynamo (original), Apache Cassandra, Riak.

---

# Distributed Coordination and Consensus Models

## Two-Phase Commit (2PC) (not fault-tolerant consensus)

- Designed for **atomic commit** across multiple participants (all-or-nothing).
- Uses a **fixed coordinator** (no leader election).
- Requires **unanimous agreement**:
  - Every participant must vote _YES_.
- If the coordinator fails after participants vote _YES_:
  - Participants are **blocked indefinitely** (in-doubt state).
- **No progress guarantee** under failures → violates termination.
- Safety is preserved (no inconsistent commit), but **availability is lost**.
- Assumes failures are rare and short-lived.

### How 2PC works (step-by-step example)

**Scenario:** Transaction updating balances in DB_A and DB_B.

1. **Prepare phase**
   - Coordinator sends `PREPARE` to DB_A and DB_B.
   - DB_A checks constraints, writes intent to disk, replies `YES`.
   - DB_B does the same, replies `YES`.
2. **Commit phase**
   - Coordinator receives all `YES` votes.
   - Coordinator sends `COMMIT` to DB_A and DB_B.
3. **Failure case**
   - Coordinator crashes **after** DB_A and DB_B voted `YES`, **before** sending `COMMIT`.
   - DB_A and DB_B:
     - Cannot commit (no COMMIT received).
     - Cannot abort (they already voted YES).
     - Stay blocked waiting for coordinator recovery.

**Result**

- Atomicity preserved.
- System progress halted indefinitely.

### Key risks

- Coordinator failure → system-wide blocking.
- Not resilient to permanent node crashes.
- Requires stable storage and careful recovery logic per participant.

### Typical use cases

- Distributed databases within a single datacenter.
- Systems where blocking is acceptable.

### Examples

- XA transactions
- Traditional distributed RDBMS transactions
- Some message broker transaction models

---

## Consensus Algorithms (fault-tolerant, progress-guaranteed)

- Designed to **continuously make decisions** despite failures.
- Nodes **elect a leader dynamically**.
- Decisions require approval from a **quorum (usually a majority)**.
- Leader failures are handled automatically via **new elections**.
- Safety properties are preserved **even during network partitions**.
- Guarantees **termination** as long as a majority is alive.

### How consensus works (generic example)

**Scenario:** 5-node cluster deciding the next value for a log entry.

1. One node becomes **leader**.
2. Client sends a command to the leader.
3. Leader proposes the command to all nodes.
4. Leader waits for acknowledgments from **any 3 nodes (majority)**.
5. Once a majority accepts:
   - The value is **decided**.
   - The leader commits and notifies followers.

**Failure case**

- Leader crashes after step 3.
- Followers detect timeout.
- A new leader is elected.
- The new leader continues from the last committed entry.

**Result**

- No blocking.
- Progress continues with a majority.

### Key strengths

- No single point of failure.
- Safe recovery after crashes.
- Prevents split-brain via epochs/terms.

### Typical use cases

- Leader election
- Metadata management
- Distributed locks
- Linearizable key-value storage

### Examples

- ZooKeeper (ZAB)
- etcd (Raft)
- Consul (Raft)

---

## Paxos (consensus algorithm, powerful but complex)

- Oldest widely-used consensus algorithm.
- Very flexible, minimal assumptions.
- Uses **ballot (proposal) numbers** to order leadership attempts.
- Hard to understand, implement, and debug.
- Safety is easy to get right; **liveness is subtle**.
- Often optimized as **Multi-Paxos** for practical use.

### How Paxos works (simplified example)

**Scenario:** Decide a single value `V`.

1. **Prepare phase**
   - Proposer sends `PREPARE(n)` with proposal number `n`.
   - Acceptors reply with:
     - Promise not to accept proposals `< n`.
     - The highest-numbered value they already accepted (if any).
2. **Accept phase**
   - Proposer selects:
     - The highest-numbered previously accepted value, or
     - Its own value if none exist.
   - Sends `ACCEPT(n, V)` to acceptors.
3. **Decision**
   - If a majority accepts `ACCEPT(n, V)`, the value is chosen.

**Failure case**

- Multiple proposers race with different proposal numbers.
- Higher-numbered proposals preempt lower ones.
- Progress may stall unless one proposer stabilizes.

**Result**

- Very strong safety guarantees.
- Liveness depends on careful coordination.

### Operational characteristics

- Leadership is implicit.
- Fewer constraints → more room for misconfiguration.
- Harder to reason about during incidents.

### Examples

- Google Chubby
- Early Google Spanner internals
- Some legacy distributed systems

---

## Raft (consensus algorithm, engineered for clarity)

- Designed explicitly to be **understandable and implementable**.
- Uses clear roles:
  - Leader
  - Follower
  - Candidate
- Uses **terms** to represent epochs.
- Log replication and leader election are tightly specified.
- Easier operational reasoning and debugging.

### How Raft works (step-by-step example)

**Scenario:** 3-node cluster appending a log entry.

1. **Leader election**
   - Followers time out.
   - One node becomes a candidate, increments term.
   - Requests votes from others.
   - Receives majority → becomes leader.
2. **Log replication**
   - Client sends command to leader.
   - Leader appends entry to its log.
   - Leader sends `AppendEntries` to followers.
   - Followers append and acknowledge.
3. **Commit**
   - Leader receives majority acknowledgments.
   - Entry is committed.
   - Leader notifies followers.

**Failure case**

- Leader crashes after appending but before commit.
- New leader is elected.
- Uncommitted entries may be rolled back safely.

**Result**

- Clear rules.
- Predictable recovery.

### Operational characteristics

- Strong leader-centric model.
- Clear invariants (log matching property).
- Easier correctness reasoning for humans.

### Examples

- etcd
- Consul
- CockroachDB (inspired by Raft)
- TiKV

---

## 2PC vs Consensus (Key Differences)

- **Goal**
  - 2PC: atomic commit of a single transaction
  - Consensus: continuous agreement over time
- **Coordinator / Leader**
  - 2PC: fixed coordinator
  - Consensus: dynamically elected leader
- **Failure handling**
  - 2PC: blocks on coordinator failure
  - Consensus: recovers automatically if majority survives
- **Votes required**
  - 2PC: all participants
  - Consensus: majority quorum
- **Termination**
  - 2PC: not guaranteed
  - Consensus: guaranteed with majority

### Concrete contrast example

_2PC:_

Coordinator crashes → participants freeze.

_Consensus:_

Leader crashes → new leader elected → system continues.

---

## Paxos vs Raft (Key Differences)

- **Design goal**
  - Paxos: theoretical minimalism
  - Raft: practical understandability
- **Leader concept**
  - Paxos: implicit
  - Raft: explicit
- **Ease of implementation**
  - Paxos: very hard
  - Raft: much easier
- **Operational clarity**
  - Paxos: difficult during incidents
  - Raft: predictable behavior
- **Adoption trend**
  - Paxos: declining for new systems
  - Raft: dominant in modern systems

### Practical takeaway example

- Paxos: “We know it’s correct, but why is the cluster stuck?”
- Raft: “Leader lost quorum in term 42; new election started.”

---

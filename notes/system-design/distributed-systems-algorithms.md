# Distributed Systems Algorithms & Patterns

This document covers fundamental algorithms and patterns that transcend specific system domains. These techniques are used in failure detection, cluster coordination, data integrity, and partition handling.

---

# Consistent Hashing

**Problem:** With simple hash-based sharding (`hash(key) % num_shards`), adding or removing shards requires rehashing **all keys**. Consistent hashing solves this by minimizing key redistribution.

## How Consistent Hashing Works

1. **Hash both keys and shards** onto a ring (0 to 2^32 - 1)
2. **Walk clockwise** from key to find the nearest shard
3. Adding/removing a shard only affects keys in a **narrow range**

**Example: 3 shards on a ring**

```
         Shard A (hash = 10)
              ↑
    Key K3 → |
            /
    ────────     ────────
   /              \
  |                | Shard B (hash = 140)
  | Key K1 (95)  →|
   \                /
    ──────────────
       ↑
   Shard C (hash = 240)
   ← Key K2 (200)
```

**Distribution:**

- K1 (95) → nearest shard clockwise → Shard B
- K2 (200) → nearest shard clockwise → Shard C
- K3 (350) → nearest shard clockwise → Shard A

## Adding a Shard (Minimal Redistribution)

**Before:** 3 shards (A, B, C)
**After:** Adding Shard D (hash = 180)

Only keys between Shard B (140) and Shard D (180) are remapped. Other keys remain on their original shards!

**Rehash cost:** ~N/num_shards keys (vs. rehashing all N keys with simple hashing)

## Virtual Nodes (Improves Balance)

### The Problem: Load Imbalance Without Virtual Nodes

With only one hash point per physical shard, the ring can become **unbalanced**:

```
Scenario: 3 shards, unlucky hash positions

0 ────────────── 100M ────────── 200M ────────────── 300M
      ↑               ↑                    ↑
   Shard A        Shard B              Shard C
   (0-100M)      (100M-200M)          (200M-300M)

Problem: If Shard A fails, its entire range (100M keys)
redistributes unevenly to B and C instead of equally!
```

### Solution: Virtual Nodes

Map each **physical shard** to **multiple replica points** on the ring. This dramatically improves distribution, especially when nodes fail.

**With Virtual Nodes:**

```
Shard A replicas: hash(A#0), hash(A#1), ..., hash(A#149)
Shard B replicas: hash(B#0), hash(B#1), ..., hash(B#149)
Shard C replicas: hash(C#0), hash(C#1), ..., hash(C#149)

Ring with 450 points → Keys distributed more uniformly
↓ When Shard A fails, its keys spread across B and C more evenly
```

### Implementation: Optimized Ring Structure

```ts
// Binary search-optimized ring for O(log n) lookups
class ConsistentHashRing {
  private sortedHashes: number[];
  private hashToNode: Map<number, string>;

  constructor(nodes: string[], vnodes: number = 150) {
    this.hashToNode = new Map();
    this.sortedHashes = [];

    // Create virtual nodes for each physical node
    for (const node of nodes) {
      for (let i = 0; i < vnodes; i++) {
        const hash = this.hash(`${node}#${i}`);
        this.hashToNode.set(hash, node);
        this.sortedHashes.push(hash);
      }
    }

    // Pre-sort for binary search (O(n log n) on construction)
    this.sortedHashes.sort((a, b) => a - b);
  }

  // O(log n) lookup using binary search
  getNode(key: string): string {
    const keyHash = this.hash(key);
    const idx = this.binarySearch(keyHash);
    const targetHash = this.sortedHashes[idx];
    return this.hashToNode.get(targetHash)!;
  }

  private binarySearch(target: number): number {
    let left = 0,
      right = this.sortedHashes.length - 1;

    // Find first hash >= target
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.sortedHashes[mid] < target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    // Wrap around if necessary
    return left < this.sortedHashes.length ? left : 0;
  }

  private hash(key: string): number {
    // In production, use a fast hash like MurmurHash or xxHash
    let h = 5381;
    for (let i = 0; i < key.length; i++) {
      h = (h << 5) + h + key.charCodeAt(i);
    }
    return Math.abs(h) % 2 ** 32;
  }
}

// Usage
const ring = new ConsistentHashRing(["shard-1", "shard-2", "shard-3"], 150);
const shard = ring.getNode("user:123"); // O(log n) lookup
```

### Virtual Nodes: Configuration Guide

| Scenario                   | Recommended VNodes | Trade-offs                                           |
| -------------------------- | ------------------ | ---------------------------------------------------- |
| **Few nodes (≤5)**         | 150-300            | More replicas → better balance; small memory cost    |
| **Many nodes (100+)**      | 50-100             | Fewer replicas reduce memory; still good balance     |
| **Highly dynamic cluster** | 100-200            | Handle node churn well; moderate memory overhead     |
| **Memory-constrained**     | 20-50              | Lower memory but coarser distribution; more hotspots |

**Rule of thumb:** `vnodes = 160 / num_nodes` (ensures ~160 total replicas per joining node)

### Impact of Virtual Nodes on Distribution

```
Scenario: 3 shards, randomly fail one shard

WITHOUT virtual nodes:
- Failed shard's keys: heavily skewed to one neighbor
- Max load imbalance: ~33% overshoot
- Latency spike: significant

WITH 150 virtual nodes per shard:
- Failed shard's keys: spread across neighbors
- Max load imbalance: ~5-8% overshoot
- Latency spike: minimal

Example: 1M keys, shard fails
- Without vnodes: One neighbor gets ~700k keys (neighbor capacity: 500k)
- With vnodes: Each neighbor gets ~533k keys (capacity: 500k)
```

## Advantages of Consistent Hashing

| Aspect              | Benefit                                                                |
| ------------------- | ---------------------------------------------------------------------- |
| **Scaling**         | Adding/removing nodes redistributes ~1/N keys (not all)                |
| **Caching**         | Works well for distributed caches (Memcached, Redis)                   |
| **Load balancing**  | Fairly distributes load across equal-capacity nodes                    |
| **Fault tolerance** | When node fails, its keys spread proportionally across remaining nodes |
| **Flexibility**     | **Weighted nodes:** Nodes can have different capacities (more vnodes)  |

## Disadvantages & Limitations

- ❌ **Hash randomness:** Hotspots can still occur with unlucky hash collisions (mitigated by many vnodes)
- ❌ **Range queries:** Cannot efficiently query key ranges (e.g., find all user IDs in range [1M, 2M])
- ❌ **Rebalancing cost:** Moving shards still requires data migration (though minimized to ~1/N keys)
- ❌ **Implementation complexity:** Requires careful tuning of vnode count and hash function
- ❌ **Cascade failures:** If multiple nodes fail simultaneously, survivors can be overloaded

### Best Practices

1. **Choose a fast hash function:** Use MurmurHash or xxHash instead of MD5/SHA1
   - For TypeScript/Node.js: `@node-rs/xxhash` or `murmurhash3js`
2. **Tune virtual nodes:**
   - Measure P99 latency before/after increasing vnodes
   - Too few → hotspots on node failure
   - Too many → extra memory, slower ring construction

3. **Monitor ring imbalance:**
   - Track standard deviation of keys per physical node
   - Alert if any node exceeds 110% of expected load

4. **Handle failures gracefully:**
   - Implement backpressure during rebalancing
   - Use read replicas to serve traffic while rebalancing writes

5. **Weighted Consistent Hashing:**
   - For heterogeneous clusters, assign more vnodes to powerful nodes
   ```ts
   const nodeWeights = { "shard-1": 1, "shard-2": 2, "shard-3": 1 };
   // shard-2 gets 2x vnodes → handles 2x load
   for (const node of nodes) {
     const vnodes = 150 * (nodeWeights[node] || 1);
     // ... create vnodes
   }
   ```

## Complexity Analysis

| Operation        | Time               | Space   | Notes                                 |
| ---------------- | ------------------ | ------- | ------------------------------------- |
| **Construction** | O(n*v log(n*v))    | O(n\*v) | n = nodes, v = vnodes per node        |
| **Lookup**       | O(log(n\*v))       | —       | Binary search on sorted hashes        |
| **Add node**     | O(v log(n\*v) + M) | O(v)    | M = keys to migrate (~total keys / n) |
| **Remove node**  | O(M)               | —       | Redistribute removed node's keys      |
| **Rebalancing**  | O(n\*v + M)        | —       | Rebuild ring + migrate keys           |

## Use Cases & When to Use Consistent Hashing

### ✅ Good Fit

| Use Case                       | Why Consistent Hashing Works Well               |
| ------------------------------ | ----------------------------------------------- |
| **Distributed caches**         | Keys evenly spread; minimal data shift on fail  |
| **Database sharding**          | Growing cluster; add nodes without full rehash  |
| **Load balancing (stateful)**  | Route session to same server; ~1/N rebalance    |
| **CDN/blob storage sharding**  | Distribute files; minimize copying on rebalance |
| **Message queue partitioning** | Keys map to consistent brokers/partitions       |
| **In-memory session stores**   | SessionID → replica group stays stable          |

### ❌ Poor Fit

| Use Case                                       | Better Alternative                            |
| ---------------------------------------------- | --------------------------------------------- |
| **Range queries** (e.g., user IDs in [1M, 2M]) | Range-based sharding or secondary indexes     |
| **Temporal data** (time-series, logs)          | Time-based partitioning (e.g., by day)        |
| **Complex joins** across shards                | Denormalization or consistent hash + replicas |
| **Analytics workloads**                        | Directory-based partitioning                  |
| **Extremely dynamic cluster** (<100ms joins)   | May struggle with rapid scaling               |

### Configuration Decision Tree

```
Need to shard?
    ├─ YES: Query pattern?
    │   ├─ Mostly lookups by key (e.g., cache, session)
    │   │   └─ → Use consistent hashing ✅
    │   ├─ Range queries (e.g., time-series)
    │   │   └─ → Use range/time-based sharding ✅
    │   └─ Unknown/evolving access patterns
    │       └─ → Start with consistent hashing (easiest to extend)
    │
    └─ NO: Use single node (PostgreSQL scales to millions of QPS)
```

## Real-World Implementation: Uber's Ringpop

**Ringpop** is an open-source Node.js library developed at Uber that brings consistent hashing to production applications. It demonstrates how consistent hashing can be integrated at the application level for self-healing, scalable systems.

**Architecture:**

Ringpop combines three core components:

1. **SWIM Membership Protocol** — Nodes discover each other and detect failures without centralized coordination
2. **Consistent Hashing Ring** — Assigns work across nodes using FarmHash (hashing function) + Red-Black tree (ring structure) + virtual replica points
3. **Handle-or-Forward Pattern** — Transparent routing: requests arriving at any node are either handled locally or forwarded to the responsible node

**Technical Details:**

- **Hashing function:** FarmHash (Google's fast hashing algorithm)
- **Ring data structure:** Red-Black tree for efficient lookups
- **Virtual replicas:** Uniform number of replica points per node to ensure balanced distribution
- **Transport:** TChannel (Uber's custom RPC protocol) for forwarding

**Key Design Decision: Handle-or-Forward Pattern**

```
Client Request
    ↓
Node A (receives request for key K)
    ↓
Hash(K) → Determine owner on ring
    ↓
If A is owner: Handle locally
If B is owner: Forward request to B transparently
    ↓
Client unaware of routing complexity
```

**Advantages for Applications:**

- **Decoupling:** Clients don't need to know sharding scheme
- **Self-healing:** When nodes fail, work migrates to neighbors automatically
- **Minimal rebalancing:** Adding/removing nodes only affects ~1/N keys
- **No external infrastructure:** Coordination happens within application code

**Real-World Application: Uber Geospatial Service**

Ringpop powers Uber's Geospatial service, which maintains real-time locations of millions of active driver partners. Without sharding, a single service would have to search every car to find drivers near a pickup location. With Ringpop:

- Driver locations are partitioned across multiple nodes by geographic proximity or ID hash
- Each node maintains a subset of current driver state (in-memory for low-latency updates)
- Requests automatically route to the correct partition
- When nodes join/leave, state rebalances automatically

**Use Cases at Uber:**

- Sharding large datasets
- Leader election
- Batching writes into distributed databases
- Request coalescing (combining duplicate requests)
- Work delegation and task scheduling
- Data aggregation
- Distributed caching

**Implementation Pattern (Pseudo-code):**

```ts
import Ringpop from "ringpop";

// Create Ringpop instance
const ringpop = new Ringpop({
  channel: tchannel, // RPC transport
  hostfile: "hosts.txt", // Bootstrap list
});

// Nodes discover each other via SWIM protocol
ringpop.on("ready", () => {
  // Ring is formed, consistent hashing active
});

// Routing middleware
app.use((req, res, next) => {
  const key = req.params.id;
  const owner = ringpop.lookup(key); // Which node owns this key?

  if (owner === ringpop.whoami()) {
    // We own it - handle locally
    next();
  } else {
    // Forward to owner transparently
    ringpop.forward(owner, req, res);
  }
});

// When a node fails
ringpop.on("membershipChange", () => {
  // Ring rebalances automatically
  // Affected keys migrate to new owner
});
```

**Why Consistent Hashing Matters Here:**

Without consistent hashing, adding a new node would require:

- Recalculating `hash(key) % num_shards` for every key in the system
- Migrating data across potentially all nodes
- Causing massive latency spikes

With Ringpop's consistent hashing:

- Only ~1/N keys are affected by scaling events
- Rebalancing happens incrementally
- Application remains responsive during cluster changes

## Production Considerations for Consistent Hashing

### Common Gotchas ⚠️

1. **Cascading Overload (Thundering Herd)**
   - When a node dies, neighbors receive extra traffic proportionally
   - **Mitigation:** Implement gradual load shedding and circuit breakers

   ```ts
   // When 1 out of 3 nodes fails, other 2 each handle ~1.5x load
   // If they're at 60% capacity, they may briefly hit 90%
   ```

2. **Hash Function Matters**
   - Bad hash → poor distribution → some nodes get 2-3x more keys
   - **Use:** MurmurHash3, xxHash, FarmHash (NOT MD5/SHA1—too slow)

3. **Vnode Count Paradox**
   - Too few vnodes (e.g., 10) → recovery from failure is unbalanced
   - Too many vnodes (e.g., 1000) → slow ring construction, more memory
   - **Rule:** Start with 150 vnodes, measure tail latency, adjust

4. **Key Hotspots**
   - Consistent hashing distributes uniformly only if **all keys access equally**
   - If 5% of keys get 50% of traffic, those keys' nodes get overloaded
   - **Mitigation:** Monitor per-key access rates, replicate hot keys

5. **Rebalancing During Joins (not Failures)**
   - Adding a node should be gradual (avoid simultaneous joins)
   - Rapid multi-node joins can trigger excessive rebalancing
   - **Best practice:** Add one node every 5-10 minutes

### Monitoring Metrics

Track these to stay healthy:

```
1. Ring Imbalance Ratio
   = max_keys_on_any_node / average_keys_per_node
   Alert: > 1.15 (15% above average)

2. Rebalancing Duration
   = Time to migrate keys after membership change
   Alert: > 30 seconds (app should still be responsive)

3. P99 Lookup Latency
   = 99th percentile of ring.lookup(key) calls
   Alert: > 5ms (should be microseconds for in-memory ring)

4. Failed Forwards
   = Requests forwarded to node that died mid-request
   Alert: > 0.1% (indicates stale ring view)
```

### Performance Tuning Checklist

- [ ] Hash function is fast (< 100 ns per key)
- [ ] Binary search works (ring sorted at construction time)
- [ ] Vnode count matches cluster dynamics (150 is often good)
- [ ] Membership protocol detects failures < 10 seconds
- [ ] Rebalancing is incremental (not all at once)
- [ ] Hot keys are monitored and replicated separately
- [ ] Reads during rebalancing don't block (use read-through cache)

---

# Membership Protocols (SWIM and Gossip)

Membership protocols maintain cluster views and support failure detection at scale.

## SWIM (Scalable Weakly-consistent Infection-style Membership)

Core ideas:

- Each node periodically probes a random peer
- If direct probe fails, node asks indirect peers to probe (indirect ping)
- Nodes spread membership updates using gossip
- Failures move through states like **alive -> suspect -> dead**

Why it works well:

- Decentralized (no single coordinator)
- Constant-size probing work per node per round
- Scales to large clusters with bounded overhead

Typical uses:

- Service discovery and health membership in large fleets
- Consul-style cluster membership

---

## Gossip-Based Membership

Gossip protocols disseminate membership state probabilistically:

- Nodes periodically exchange partial views
- Updates spread epidemically through the cluster
- Convergence is eventually consistent

Strengths:

- Highly fault tolerant
- Easy horizontal scale
- Handles frequent node churn

Trade-off:

- Temporary view divergence is expected
- Membership accuracy converges over time rather than instantly

Examples:

- Cassandra-style peer dissemination
- Akka cluster membership dissemination

---

## Comparison

| Approach                      | Detection Model                                 | Overhead Pattern                                | Consistency of View                                    | Failure Mode Risk                                       |
| ----------------------------- | ----------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------- |
| Centralized heartbeat manager | Single observer and heartbeat timeout           | Central bottleneck grows with cluster size      | Fast if manager healthy                                | Single point of failure and overload                    |
| Generic gossip membership     | Probabilistic peer exchange                     | Distributed, typically moderate per round       | Eventual consistency                                   | Temporary divergence during churn                       |
| SWIM-style membership         | Direct + indirect probes + gossip dissemination | Constant probing work per node + gossip updates | Eventual consistency with strong practical convergence | False suspicions still possible under severe partitions |

Key takeaway:

> **In distributed systems, membership is usually probabilistic and suspicion-based, not absolute truth.**

---

# Checksums and Data Integrity

Checksums verify that data hasn't been corrupted or tampered with. In distributed systems, data traverses multiple components: networks, disks, replicas. Integrity checks can happen at multiple layers.

## CRC (Cyclic Redundancy Check)

**Purpose:** Detect **accidental** corruption (bit flips, transmission errors)

**How it works:**

- Treat data as a polynomial; divide by a fixed generator polynomial
- Remainder is the CRC checksum
- Receiver recalculates CRC; if mismatch, corruption detected

**Characteristics:**

- ✅ Fast (hardware accelerated on modern CPUs)
- ✅ Detects burst errors well
- ❌ Not cryptographically secure (attacker can forge matching CRC)
- ❌ Relatively weak (32-bit CRC)

**Use cases:**

- Network protocols (Ethernet CRC32)
- Storage reads/writes (ZFS, Btrfs)
- Detect random memory bit flips

**Example:**

```python
import zlib

data = b"Hello, world!"
crc = zlib.crc32(data) & 0xffffffff  # CRC32
# On receive, recalculate and compare
received_crc = zlib.crc32(received_data) & 0xffffffff
assert crc == received_crc, "Data corrupted"
```

---

## Cryptographic Hashing (SHA-256, BLAKE3)

**Purpose:** Detect **intentional** tampering; provide cryptographic proof of identity

**How it works:**

- Apply one-way hash function (SHA-256, BLAKE3)
- Hash is deterministic: same input → same hash always
- Collision-resistant: impossible to find two inputs with same hash
- Pre-image resistant: can't reverse hash to find original input

**Characteristics:**

- ✅ Cryptographically secure (resists tampering)
- ✅ Collision-resistant (SHA-256 has 2^256 complexity)
- ✅ Deterministic for audit trails
- ❌ Slower than CRC (software-based, more computation)

**Use cases:**

- Immutable audit logs (blockchain, event sourcing)
- Digital signatures (verify message authenticity)
- Git commits (integrity of code history)
- Package verification (npm, Docker images)

**Example:**

```python
import hashlib

data = b"Important transaction"
hash_value = hashlib.sha256(data).hexdigest()
# Later, verify data hasn't changed
assert hashlib.sha256(received_data).hexdigest() == hash_value
```

---

## End-to-End Verification Patterns

Data can be corrupted at different layers. Strategies depend on trust model:

### 1. Hop-by-Hop Verification

Verify at each layer independently:

```
Source → [Network CRC] → Router → [Disk CRC] → Replica → [CRC] → Destination
```

**Pros:**

- Catch corruption early
- Localize failures

**Cons:**

- Multiple checksum computations
- Doesn't protect against undetected corruption (cosmic ray between verify + use)

---

### 2. End-to-End Verification

Single hash from source to final destination:

```
Source calculates SHA-256(data)
         ↓
Data + SHA-256 traverse network/storage
         ↓
Destination verifies SHA-256(data)
```

**Pros:**

- Comprehensive: catches corruption anywhere on path
- Simple: single checksum per message

**Cons:**

- Can't localize where corruption occurred
- Slower to propagate (hash computed at endpoints only)

---

### 3. Hybrid: CRC + Cryptographic Hash

Fast hop-by-hop detection + Strong end-to-end guarantee:

```
Hop-by-hop: CRC32 (fast, catch obvious corruption)
End-to-end: SHA-256 (strong guarantee for immutable records)
```

---

## When to Use Each

| Method              | Cost        | Security           | Use Case                               |
| ------------------- | ----------- | ------------------ | -------------------------------------- |
| **No checksum**     | None        | ❌ None            | Trusted LAN, non-critical data         |
| **CRC32**           | ⚡ Minimal  | ✅ Accidental only | Network protocols, disk I/O            |
| **SHA-256**         | 🐢 Moderate | ✅✅ Cryptographic | Audit logs, digital signatures, git    |
| **CRC32 + SHA-256** | 🐢 Moderate | ✅✅ Both          | Critical systems (blockchain, ledgers) |

---

# Split-Brain Scenarios

**Split-brain** occurs when a network partition causes different parts of a cluster to operate independently, each believing it's the authoritative version, leading to inconsistency.

## Anatomy of Split-Brain

```
Initial cluster: [Node A] ←→ [Node B] ←→ [Node C]
                      Leader

Network partition occurs:
Partition 1: [Node A]        (isolated)
Partition 2: [Node B] ←→ [Node C]

Problem:
  - Partition 1: Node A still has lease, thinks it's leader
  - Partition 2: B+C hold quorum, elect new leader
  → Two leaders, two sources of truth
```

---

## Root Causes

1. **Network partition** — packets don't flow between groups
2. **Slow failure detection** — takes too long to declare a node dead
3. **Clock skew** — leases expire at different times on different nodes
4. **GC pauses** — stop-the-world GC causes false dead detection

---

## Consequences

**Data corruption:**

```
Client 1 → Leader A (isolated) → Write X
Client 2 → Leader B (majority) → Write Y

Both think they're the "real" leader. Both confirm writes.
After partition heals, consensus impossible: which write wins?
```

**Duplicate actions:**

```
Payment processed by Leader A (in partition)
Payment also processed by Leader B (majority partition)
→ Customer charged twice
```

**Conflicting state:**

```
Replica 1: key=value_old
Replica 2: key=value_new
→ Inconsistent read depending on which replica you hit
```

---

## Prevention Strategies

### 1. Quorum-Based Decisions

Require **majority approval** before proceeding:

```
5-node cluster:
  - Quorum = 3 nodes
  - Partition with 3+ nodes can proceed (has quorum)
  - Partition with 2 nodes blocks (no quorum)

After partition heals, minority partition discards its changes
```

**Trade-off:**

- ✅ Guarantees consistency
- ❌ May become unavailable if minority grows (network partition, node failures)

---

### 2. Fencing Tokens

Lease + token combination:

```
Old leader: token=1, lease_until=T1
New leader: token=2, lease_until=T2

Server only accepts writes from token >= current_token
Even if old leader resumes and sends writes, token=1 is rejected
```

**Trade-off:**

- ✅ Prevents old leader from corrupting state
- ❌ Requires external fencing mechanism (coordination server, shared storage)

---

### 3. Heartbeat / Lease Timeouts

Faster failure detection = faster recovery:

```
Default heartbeat timeout: 30s
Optimized: 1-5s

Risk: False positives (node pauses, GC, slow network)
Mitigation: adaptive timeouts, multiple heartbeat rounds
```

---

### 4. Stone Marker Pattern (External Arbiter)

Cluster cannot decide alone; ask external authority:

```
Cluster A: "Is B alive?"
External Arbiter: "B heartbeat seen 2s ago"
→ B is alive, A should not elect new leader

External Arbiter: "B heartbeat last seen 60s ago"
→ B is presumed dead, A can elect new leader
```

**Real-world:**

- Zookeeper (distributed quorum)
- etcd (consensus with external witness)
- AWS availability zones (AZ-aware partition detection)

---

## Real-World Example: PostgreSQL Streaming Replication (Split-Brain Risk)

**Without quorum:**

```
Primary (Master):   Accepts writes
Standby (Replica):  Reads-only

Network partition:
  - Primary: still writes, thinks standby is slow
  - Standby: promotes itself to primary after timeout
  → Two primaries, divergent writes
```

**Prevention:**

- Upgrade to **PostgreSQL 11+** with streaming replication quorum
- Or use external tool (Patroni, etcd) to prevent double-promotion

---

## Decision Tree: Which Strategy?

```
Is consistency critical?
  NO  → Use gossip, accept eventual consistency, risk split-brain
  YES → Continue

Is availability during partition important?
  NO  → Use quorum (blocks minority)
  YES → Use fencing + external arbiter (complex)

Is external infrastructure available?
  NO  → Use fencing (requires shared storage) or quorum (all nodes)
  YES → Use external arbiter (Zookeeper, etcd)
```

---

## Summary: Split-Brain Prevention Checklist

- [ ] Use quorum voting for leadership election
- [ ] Implement fencing tokens to block stale leaders
- [ ] Set aggressive heartbeat timeouts (but account for GC/pauses)
- [ ] Use external arbiters (Zookeeper, etcd) for tie-breaking
- [ ] Test partition scenarios (chaos engineering)
- [ ] Monitor and alert on partition detection
- [ ] Document recovery procedure when partition heals

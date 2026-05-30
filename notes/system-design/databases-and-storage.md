---
tags: [system-design, databases, storage, data-modeling, theory]
title: "Databases and storage"
---

# Data Model

A **data model** is a structured way to represent, organize, and interact with data in software systems. It defines:

- **What data** is stored
- **How it is structured**
- **How it can be accessed and manipulated**

---

## Layers of Data Models

Most software applications are built by **layering data models** on top of each other. Each layer hides the complexity of the one below it.

| Layer                             | Description                                            | Example                                            |
| --------------------------------- | ------------------------------------------------------ | -------------------------------------------------- |
| **1. Application Layer**          | Models the real world using objects or data structures | Classes for `User`, `Order`, etc.                  |
| **2. General-Purpose Data Model** | Maps structures to a database-friendly format          | Relational (SQL), Document (JSON), Graph           |
| **3. Storage Engine**             | Manages low-level representation of data               | Indexes, memory structures, serialization          |
| **4. Hardware Layer**             | Stores data as physical signals                        | Electrical currents, light pulses, magnetic fields |

## Why Data Models Matter

- They **shape how we think** about the problem we're solving.
- They influence **how data is stored, queried, and processed**.
- The wrong model can make certain tasks **slow, awkward, or impossible**.
- Choosing the right model helps you build **efficient, maintainable software**.

## Choosing the Right Data Model

Different models have different strengths:

| Data Model     | Best For                                           | Format          | Example                           |
| -------------- | -------------------------------------------------- | --------------- | --------------------------------- |
| **Relational** | Structured, tabular data with strong relationships | Tables          | SQL databases (PostgreSQL, MySQL) |
| **Document**   | Semi-structured or nested data                     | JSON, BSON, XML | MongoDB, CouchDB                  |
| **Graph**      | Complex, interconnected data                       | Nodes and Edges | Neo4j, ArangoDB                   |

Each model has trade-offs in:

- **Query performance**
- **Schema flexibility**
- **Ease of use**
- **Scalability**

---

# Indexes

## 📦 Why Indexes Exist

A naive key-value database:

```bash
db_set key value
db_get key
```

Internally stores data like:

```
key,value
42,San Francisco
42,Exploratorium
```

To retrieve a value, the database may need to scan the whole file:

> ❌ O(n) lookup → too slow for large datasets

---

## 🧭 Solution: Indexes

An **index** is an additional structure that helps locate data quickly.

- Speeds up reads
- Slows down writes (because it must be maintained)
- Trades storage + complexity for performance

---

## 🔑 Hash Indexes (Simple Case)

A basic optimization is an **in-memory hash map**:

```
key → file offset
```

So lookup becomes:

1. Find key in hash map
2. Jump directly to disk offset
3. Read value

### ✔ Advantages

- Very fast reads
- Simple

### ❌ Limitations

- Must fit in memory
- No efficient range queries
- Not suitable for large key sets

---

## 📚 Log-Structured Storage (Foundation for Modern Indexes)

Instead of overwriting data:

- Always **append to a log file**
- Keep writes sequential (fast)

Example:

```
123, London
42, San Francisco
42, Exploratorium
```

### Key idea:

> New writes append; old values are ignored

---

## 🧹 Compaction

To avoid infinite growth:

- Remove duplicate keys
- Keep only latest value
- Merge segments

This creates **segment files**

---

## ⚡ SSTables (Sorted String Tables)

Now we improve logs:

> Store data sorted by key

```
handbag
handsome
handiwork
```

### Benefits

- Faster merging (like merge sort)
- Easier range queries
- Smaller indexes needed

---

## 🧠 Memtable + SSTable System

1. Writes go to **memtable (in-memory tree)**
2. When full → flush to disk as SSTable
3. Background compaction merges SSTables

---

## 🚀 Resulting system: LSM Tree

Used in:

- LevelDB
- RocksDB
- Cassandra
- HBase

### Characteristics:

- Fast writes
- Good compression
- Efficient range scans
- Background compaction required

---

## 🌳 B-Trees (Traditional Index Structure)

B-Trees store data differently:

### Structure:

- Fixed-size pages (e.g. 4KB)
- Tree of pages
- Each node has pointers to children

---

## 🔎 Lookup process

1. Start at root
2. Follow range boundaries
3. Reach leaf page
4. Retrieve value

---

## ✏️ Updates

- Modify page in place
- May split pages if full

---

## ⚠️ Reliability mechanisms

- Write-Ahead Log (WAL)
- Latches for concurrency control

---

## ✔ Advantages

- Very stable
- Efficient reads
- Great for transactional systems

## ❌ Limitations

- More random writes
- Page fragmentation
- Write amplification

---

## ⚔️ LSM Tree vs B-Tree

| Feature       | LSM Tree   | B-Tree     |
| ------------- | ---------- | ---------- |
| Writes        | Very fast  | Slower     |
| Reads         | Slower     | Faster     |
| Storage       | Efficient  | Fragmented |
| Compaction    | Required   | Not needed |
| Write pattern | Sequential | Random     |

---

## 🌍 Geospatial Indexing Problem

Now we extend indexes to 2D space:

> latitude + longitude

---

## ❌ Naive approach: 2D filtering

```sql
WHERE lat BETWEEN X AND Y
AND long BETWEEN A AND B
```

### Problem:

- Each filter returns large sets
- Must compute intersection
- Indexes work in 1D, not 2D

---

## 🧭 Geohash Approach (1D mapping of 2D space)

Geohash converts:

```
(lat, long) → string
```

Example:

```
u000, ezzz
```

---

## ✔ Key property: prefix similarity

### Figure 1.9: Shared prefix

Nearby locations often share prefix:

```
abc123
abc124
```

---

## ⚠️ Boundary Problem 1

Two close points may have **no shared prefix**:

- La Roche-Chalais → `u000`
- Pomerol → `ezzz`

Even though they are only 30km apart.

---

## ⚠️ Boundary Problem 2

Opposite issue:

> Long shared prefix but actually far apart

---

## 🧩 Solution: neighbor search

To fix this:

- Query current geohash cell
- Also query neighboring cells

---

## 📈 Expanding search problem

If not enough results:

### Option 1:

- Return only radius-limited results

### Option 2:

- Expand geohash precision
- Remove digits → larger region

---

## 🌳 Quadtree (Hierarchical space partitioning)

Instead of hashing, we split space:

- Divide world into 4 quadrants
- Recursively subdivide

---

## 🧠 Rule

Split until:

> each cell has ≤ N businesses (e.g. 100)

---

## 🧱 Structure

- Root = whole world
- Children = NW, NE, SW, SE
- Leaves = dense regions split further

---

## ✔ Advantages

- Adaptive resolution
- Dense areas → small cells
- Sparse areas → large cells

---

## ⚠️ Operational concerns

- Built in memory at startup
- Can take minutes for large datasets
- Needs careful deployment (blue/green)

---

## 🌐 Google S2 (Advanced geospatial system)

Instead of grid:

- Projects Earth onto sphere
- Uses Hilbert curve (space-filling curve)

### Key idea:

> Nearby points in 2D → close in 1D ordering

---

## ✔ Advantages

- Great for geofencing
- Flexible region queries
- High precision control (min/max levels)

---

## 🧠 Final intuition

All systems solve the same problem:

> Convert 2D spatial search into efficient 1D indexing

---

## 📌 Summary

| Technique  | Idea                        |
| ---------- | --------------------------- |
| Hash index | Direct lookup               |
| LSM tree   | Append + merge logs         |
| B-tree     | Balanced page tree          |
| Geohash    | Encode 2D → 1D string       |
| Quadtree   | Recursive spatial partition |
| S2         | Sphere → curve → 1D         |

---

# Databases

| Type                                | Workload / System Pattern                                                  | Description                                                                                          | Tradeoffs                                                                                                                  | Use Cases                                                                             | Examples                               | Key Takeaways                                                                      |
| ----------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------- |
| **NewSQL Databases**                | Distributed OLTP with balanced read/write workloads and strong consistency | Combines SQL, ACID guarantees, and horizontal scalability using distributed architectures and MVCC.  | Excellent scalability and consistency, but operationally complex and sometimes immature compared to traditional RDBMS.     | Global transactional systems, financial platforms, real-time distributed applications | CockroachDB, Google Spanner            | Best for globally distributed transactional workloads requiring strong consistency |
| **Relational Databases**            | OLTP systems with structured, often read-heavy transactional workloads     | Structured schema with relationships, SQL querying, and ACID compliance.                             | Excellent consistency and querying capabilities, but harder to scale horizontally and less flexible for unstructured data. | ERP, CRM, banking systems, transactional business applications                        | PostgreSQL, MySQL                      | Best for structured data and transactional consistency                             |
| **Document Databases** (NoSQL)      | Read-heavy or mixed workloads with flexible schemas                        | Stores semi-structured JSON-like documents with schema flexibility and denormalized access patterns. | Fast development and scalability, but weaker relational modeling and potential data duplication.                           | CMS, product catalogs, user profiles, microservices                                   | MongoDB, CouchDB                       | Best for rapidly evolving semi-structured applications                             |
| **Time-series Databases** (NoSQL)   | Extremely write-heavy append-only telemetry workloads                      | Optimized for time-stamped data, sequential writes, compression, and retention policies.             | Extremely efficient for temporal data, but limited for relational or general-purpose querying.                             | Monitoring, IoT, forecasting, financial ticks                                         | InfluxDB, Prometheus, TimescaleDB      | Best for metrics, telemetry, and forecasting systems                               |
| **Graph Databases** (NoSQL)         | Read-heavy relationship traversal workloads                                | Models entities as nodes and edges for efficient relationship exploration.                           | Excellent for connected data, but harder to scale and less efficient for tabular analytics.                                | Social networks, recommendation engines, fraud detection                              | Neo4j, ArangoDB                        | Best for highly connected and relationship-centric data                            |
| **Key-Value Databases** (NoSQL)     | Ultra-low-latency read/write workloads                                     | Stores simple key-value pairs optimized for speed and scalability.                                   | Extremely fast and scalable, but limited querying and weak relational capabilities.                                        | Caching, sessions, gaming state, shopping carts                                       | Redis, Amazon DynamoDB                 | Best for caching and ultra-low-latency access                                      |
| **Wide-column Databases** (NoSQL)   | Massive-scale write-heavy distributed workloads                            | Stores data by columns for scalable distributed storage and high throughput.                         | Excellent scalability and ingestion performance, but more complex data modeling and weaker consistency in some systems.    | Event pipelines, IoT, messaging, large-scale analytics                                | Apache Cassandra, HBase                | Best for massive distributed workloads and high write throughput                   |
| **Data Warehouse / OLAP Databases** | Read-heavy analytical and aggregation workloads                            | Columnar systems optimized for large-scale analytical queries and BI processing.                     | Extremely fast for aggregations and analytics, but poor for transactional workloads and frequent small writes.             | BI, reporting, ML analytics, enterprise dashboards                                    | Snowflake, Google BigQuery, ClickHouse | Best for large-scale analytics and reporting                                       |
| **Search Engines**                  | Read-heavy indexing and text-search workloads                              | Specialized systems optimized for indexing, ranking, and full-text search.                           | Excellent search capabilities and aggregation support, but usually unsuitable as primary transactional storage.            | Product search, observability, log analytics, document indexing                       | Elasticsearch, Apache Solr             | Best for search, indexing, and observability systems                               |

---

# Sharding (Data Partitioning)

## 🎯 What is Sharding?

**Sharding** is a horizontal scaling technique that splits data across multiple independent database instances (shards), where each shard holds a subset of the total dataset. Unlike replication (where each node holds all data), sharding distributes data so that no single node contains the complete dataset.

### Key Idea:

> Divide data into smaller chunks and distribute them across multiple machines to improve throughput and reduce load on any single server.

---

## 🔑 Sharding Strategies

### 1. **Range-Based Sharding**

Partition data by key ranges.

**Example:**

```
Shard 1: user_ids 1-1,000,000
Shard 2: user_ids 1,000,001-2,000,000
Shard 3: user_ids 2,000,001-3,000,000
```

**Advantages:**

- Simple to understand and implement
- Range queries are efficient within a shard
- Easy to add new shards for expanding ranges

**Disadvantages:**

- ❌ **Hot shards**: If data distribution is uneven (e.g., most users in range 1), one shard becomes a bottleneck
- ❌ Risk of unbalanced load across shards

---

### 2. **Hash-Based Sharding**

Apply a hash function to the shard key to determine which shard stores the data.

**Example:**

```
shard_id = hash(user_id) % num_shards

hash(42) % 3 = 0 → Shard 1
hash(99) % 3 = 1 → Shard 2
hash(156) % 3 = 2 → Shard 3
```

**Advantages:**

- Distributes data uniformly across shards (assuming good hash function)
- Automatically balances load

**Disadvantages:**

- ❌ **Scaling problem**: Adding/removing shards requires rehashing all keys (expensive)
- ❌ Range queries are inefficient (records span multiple shards)

---

### 2.5 **Consistent Hashing** (Solves Hash-Based Scaling)

**Problem:** With simple hash-based sharding (`hash(key) % num_shards`), adding or removing shards requires rehashing **all keys**. Consistent hashing solves this by minimizing key redistribution.

#### How Consistent Hashing Works

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

#### Adding a Shard (Minimal Redistribution)

**Before:** 3 shards (A, B, C)
**After:** Adding Shard D (hash = 180)

Only keys between Shard B (140) and Shard D (180) are remapped. Other keys remain on their original shards!

**Rehash cost:** ~N/num_shards keys (vs. rehashing all N keys with simple hashing)

#### Virtual Nodes (Improves Balance)

Map each physical shard to multiple points on the ring to reduce hotspots.

```ts
const ring = new Map<number, string>(); // hash → shard_id

// Create 150 virtual nodes per shard
for (const shard of shards) {
  for (let i = 0; i < 150; i++) {
    const hash = hashFunction(`${shard}#${i}`);
    ring.set(hash, shard);
  }
}

// Find shard for key
function findShard(key: string): string {
  const keyHash = hashFunction(key);
  const shardHashes = Array.from(ring.keys()).sort((a, b) => a - b);

  // Find first hash >= keyHash, or wrap around to first
  for (const h of shardHashes) {
    if (h >= keyHash) return ring.get(h)!;
  }
  return ring.get(shardHashes[0])!;
}
```

#### Advantages of Consistent Hashing

| Aspect             | Benefit                                                            |
| ------------------ | ------------------------------------------------------------------ |
| **Scaling**        | Adding/removing shards redistributes ~1/N keys (not all)           |
| **Caching**        | Works well for distributed caches (Memcached, Redis)               |
| **Load balancing** | Fairly distributes load across shards                              |
| **Flexibility**    | Shards can have different capacities (weighted consistent hashing) |

#### Disadvantages

- ❌ Implementation complexity (need hash ring, virtual nodes)
- ❌ Still no range query support (like simple hash sharding)
- ❌ Data rebalancing still happens (though minimized)

#### Use Cases

✅ **Distributed caches** (Memcached, Redis clusters)
✅ **Database sharding** (when adding shards frequently)
✅ **Load balancing** (distributing requests across servers)
✅ **CDN/blob storage** (distributing files across datacenters)

---

### 3. **Directory-Based Sharding**

Maintain a lookup table that maps shard keys to shard locations.

**Example:**

```
Directory:
user_id → shard location
42 → Shard 1
99 → Shard 2
156 → Shard 3
```

**Advantages:**

- Flexible and can adapt to any partitioning strategy
- Easy to rebalance (update directory)
- No reshuffling of data across network

**Disadvantages:**

- ❌ Adds latency (lookup required before each query)
- ❌ Directory becomes a single point of failure
- ❌ Directory must be cached or replicated for performance

---

### 4. **Geographic Sharding**

Partition data based on geographic location (region, country, continent).

**Example:**

```
Shard 1 (North America): users in US, Canada
Shard 2 (Europe): users in EU, UK
Shard 3 (Asia): users in China, India, Japan
```

**Advantages:**

- Improves latency (data closer to users)
- Helps with data residency/compliance (GDPR, etc.)

**Disadvantages:**

- ❌ Uneven distribution if populations vary
- ❌ Cross-region queries require distributed joins
- ❌ Complex failover and replication strategies

---

## ⚖️ Sharding vs. Replication

| Aspect            | Sharding                         | Replication                    |
| ----------------- | -------------------------------- | ------------------------------ |
| **Data**          | Each node holds a subset         | Each node holds all data       |
| **Scaling Read**  | Distributes reads across shards  | Scales reads via replicas      |
| **Scaling Write** | Distributes writes across shards | Limited (bottleneck at master) |
| **Consistency**   | Eventual (within shard = strong) | Can be strong or eventual      |
| **Failover**      | Shard unavailable = data loss    | Replicas provide redundancy    |
| **Query**         | May span multiple shards         | Any replica can answer         |

---

## 🎯 Shard Key Selection

The **shard key** is critical for performance. It determines how data is distributed.

### Good Shard Keys:

- ✅ Distribute data **evenly** across shards
- ✅ Minimize **cross-shard queries**
- ✅ Support **query patterns** in your application

### Bad Shard Keys:

- ❌ `is_active` (too many hot records on one shard)
- ❌ `timestamp` (all new data goes to one shard)
- ❌ `country` (if one country dominates traffic)

### Examples:

| Use Case          | Good Shard Key       | Why                                       |
| ----------------- | -------------------- | ----------------------------------------- |
| User service      | `user_id`            | Evenly distributed, supports user queries |
| E-commerce        | `customer_id`        | Orders/transactions naturally grouped     |
| Multi-tenant SaaS | `tenant_id`          | Isolates tenant data, scales per tenant   |
| Time-series       | `metric_name + time` | Distributes across metrics + time windows |

---

## ⚠️ Challenges of Sharding

### 1. **Cross-Shard Queries**

Queries that span multiple shards are expensive:

```sql
-- Needs to query all shards
SELECT * FROM users WHERE country = 'USA'
```

**Solution**: Use materialized views or denormalization

---

### 2. **Distributed Transactions**

ACID guarantees become harder across shards:

```sql
-- Updates user in Shard 1 AND order in Shard 2?
-- How to ensure both succeed or both fail?
```

**Solutions**:

- Two-phase commit (slow, risky)
- Saga pattern (eventual consistency)
- Keep related data on same shard

---

### 3. **Rebalancing (Shard Migration)**

When growth requires moving data between shards:

```
Add Shard 4: Need to rebalance ~25% of data from other shards
```

**Challenges**:

- Time-consuming
- Risk of downtime
- Requires careful coordination

---

### 4. **Hotspots (Load Imbalance)**

If shard key distribution is skewed:

```
Shard 1: 1 million users  ← HOT
Shard 2: 100,000 users
Shard 3: 100,000 users
```

**Solutions**:

- Re-choose shard key (difficult, expensive)
- Use micro-sharding (subdivide hot shard further)
- Implement per-shard caching

---

## 🛠️ When to Shard

**Start sharding when:**

- Single database reaches capacity (storage, QPS, connections)
- Write throughput exceeds single node limits
- Geographic distribution improves user experience
- Tenant isolation is a requirement

**Avoid sharding if:**

- Data fits on one powerful machine
- Queries are complex and span many dimensions
- Team lacks experience (adds significant complexity)

---

## 📊 Sharding + Replication Pattern

Most production systems combine both:

```
┌─────────────────────────────────────┐
│ Application                          │
└────────────────────┬────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
    Shard 1      Shard 2      Shard 3
    (Primary)    (Primary)    (Primary)
        │            │            │
    ┌───┴────┐   ┌───┴────┐  ┌───┴────┐
    ▼        ▼   ▼        ▼  ▼        ▼
  Replica  Replica Replica Replica Replica Replica
```

**Benefits:**

- Sharding scales writes
- Replication scales reads + provides failover
- Data is distributed and redundant

---

## 💡 Real-World Examples

| System         | Strategy                             | Notes                                       |
| -------------- | ------------------------------------ | ------------------------------------------- |
| MongoDB        | Range or hash sharding               | Supports auto-sharding with replica sets    |
| Cassandra      | Token-based (hash) + replication     | Distributed by design; no single point      |
| PostgreSQL     | Citus (extension) - hash sharding    | Transforms PostgreSQL into distributed DB   |
| MySQL Vitess   | Range-based with automatic rebalance | Built by YouTube for massive scale          |
| DynamoDB       | Partition key (hash) + sort key      | Managed; AWS handles sharding transparently |
| Google Spanner | Range-based + geographic replication | Globally distributed, strong consistency    |

---

## In-memory vs on-disk structures

| **Characteristic**        | **In-Memory**                                                                                                  | **On-Disk**                                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Access speed**          | Nanoseconds                                                                                                    | Milliseconds (HDD) / Microseconds (SSD)                                                                  |
| **Random access**         | Very fast (O(1) pointer deref)                                                                                 | Expensive (requires separate I/O operation)                                                              |
| **Sequential access**     | Very fast (prefetching, CPU cache)                                                                             | Very fast (streaming reads/writes)                                                                       |
| **Best data structures**  | Hash Tables, AVL/Red-Black Trees, Heaps, Skip Lists, Binary Search Trees, Graph adjacency lists, Bloom Filters | B-Trees, B+ Trees, LSM-Trees, SSTables, Heap files, Sorted runs, ISAM (Indexed Sequential Access Method) |
| **Persistence**           | No                                                                                                             | Yes                                                                                                      |
| **Update pattern**        | Frequent in-place updates (O(1) or O(log n))                                                                   | Append-only or batched updates (minimize random I/O)                                                     |
| **Write pattern**         | Random writes are fine                                                                                         | Sequential writes preferred (write-ahead logs, compaction)                                               |
| **Compression**           | Optional (CPU can handle decompression cheaply)                                                                | Common (reduces I/O and disk footprint)                                                                  |
| **Concurrency control**   | Fine-grained locks or lock-free (CAS, atomic ops)                                                              | Coarse-grained locking, transaction logs, journaling                                                     |
| **Caching strategy**      | CPU cache, LRU in-memory cache                                                                                 | Buffer pool, page cache                                                                                  |
| **Examples of systems**   | Redis, Memcached, Spark (in-memory RDDs), in-memory databases (H2, HSQLDB)                                     | PostgreSQL, MySQL, LevelDB, RocksDB, Cassandra                                                           |
| **Algorithms suited for** | Dijkstra’s, A\*, in-memory sort (QuickSort, MergeSort in RAM)                                                  | External merge sort, external hash join, MapReduce shuffle/sort                                          |
| **Indexing**              | In-memory hash index, radix tree (Trie), segment tree                                                          | B+ Tree index, LSM index, bitmap index                                                                   |
| **Search complexity**     | O(1) or O(log n) — negligible I/O cost                                                                         | O(logB n) — each node fetch = disk I/O                                                                   |
| **Durability**            | Lost on restart unless checkpointed                                                                            | Persistent; journaling ensures crash recovery                                                            |

---

## SQL Joins and Query Design

![image.png](../assets/miscellaneous/joins.png)

SQL JOINs are fundamental operations for combining data from multiple tables in relational queries. Different join types (INNER, LEFT, RIGHT, FULL, CROSS) determine which rows are included in the result set based on matching conditions between tables.

---

# Pagination Patterns

When datasets become large, APIs should return data in chunks instead of loading everything at once.

The 2 main strategies are:

1. Offset pagination
2. Cursor/Keyset pagination

---

# 1. Offset Pagination

Uses:

```sql id="fe8j4n"
LIMIT x OFFSET y
```

Example:

```sql id="csy3xp"
SELECT *
FROM users
ORDER BY created_at DESC
LIMIT 10 OFFSET 50;
```

Meaning:

- skip 50 rows
- return next 10

---

## API Example

```http id="gtp3h2"
GET /users?page=6&limit=10
```

---

## Advantages

- Simple
- Supports page numbers
- Allows random access
- Easy for admin dashboards

---

## Problems

Large offsets become slow:

```text id="7b8qoj"
OFFSET 1000000
```

The database still scans/skips rows internally.

Also inconsistent with live data:

- inserts cause duplicates
- deletes cause gaps

---

## Best for

- small/medium datasets
- admin UIs
- traditional pagination

---

# 2. Cursor / Keyset Pagination

Instead of positions, pagination continues from a key.

Example:

```sql id="hzvbqw"
SELECT *
FROM users
WHERE id > 100
ORDER BY id
LIMIT 10;
```

Meaning:

> “give me rows after ID 100”

---

## API Example

```http id="e1n6si"
GET /users?cursor=abc123
```

The cursor usually contains:

```json id="c9xms5"
{
  "last_id": 100
}
```

encoded as an opaque token.

---

## Advantages

- Very fast on large datasets
- Uses index seek instead of scan+skip
- Stable with inserts/deletes
- Excellent for feeds and infinite scroll

---

## Problems

- No real page numbers
- Sequential navigation
- Requires stable unique ordering

Bad:

```sql id="j2q3b1"
ORDER BY created_at
```

Better:

```sql id="9r4t6v"
ORDER BY created_at, id
```

---

# Keyset vs Cursor

These terms are related but not identical.

## Keyset

Database access pattern:

```sql id="bfx6qm"
WHERE id > 100
```

---

## Cursor

API mechanism:

```http id="ngbr1h"
?cursor=abc123
```

The cursor usually stores the keyset internally.

---

# Comparison Table

| Aspect                        | Offset           | Cursor/Keyset          |
| ----------------------------- | ---------------- | ---------------------- |
| Performance on large datasets | Poor             | Excellent              |
| Random page access            | ✅ Yes           | ❌ No                  |
| Consistency with live updates | ❌ Weak          | ✅ Strong              |
| Easy to implement             | ✅ Yes           | ⚠️ Moderate            |
| Infinite scroll / feeds       | ❌ Poor          | ✅ Excellent           |
| Supports page numbers         | ✅ Yes           | ❌ No                  |
| Best dataset size             | Small/medium     | Large                  |
| Typical use case              | Admin dashboards | APIs, feeds, timelines |

---

# Decision Framework

## Use Offset when:

- users think in page numbers
- random access matters
- dataset is not huge
- slight inconsistencies are acceptable

Typical examples:

- admin panels
- reporting UIs
- backoffice systems

---

## Use Cursor/Keyset when:

- performance matters
- dataset is large
- data changes frequently
- building feeds or infinite scroll
- consistency matters

Typical examples:

- social feeds
- timelines
- logs/events
- public APIs

---

# Rule of Thumb

## Offset

```text id="v7l0vh"
"Go to page 20"
```

---

## Cursor/Keyset

```text id="e3xyfw"
"Continue after this item"
```

---

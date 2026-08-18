---
tags: [system-design, databases, storage, data-modeling, theory]
title: "Databases and storage"
---

# Databases and Storage

## Data Modeling

A **data model** is a structured way to represent, organize, and interact with data in software systems. It defines:

- **What data** is stored
- **How it is structured**
- **How it can be accessed and manipulated**

---

### Layers of Data Models

Most software applications are built by **layering data models** on top of each other. Each layer hides the complexity of the one below it.

| Layer                             | Description                                            | Example                                            |
| --------------------------------- | ------------------------------------------------------ | -------------------------------------------------- |
| **1. Application Layer**          | Models the real world using objects or data structures | Classes for `User`, `Order`, etc.                  |
| **2. General-Purpose Data Model** | Maps structures to a database-friendly format          | Relational (SQL), Document (JSON), Graph           |
| **3. Storage Engine**             | Manages low-level representation of data               | Indexes, memory structures, serialization          |
| **4. Hardware Layer**             | Stores data as physical signals                        | Electrical currents, light pulses, magnetic fields |

### Why Data Models Matter

- They **shape how we think** about the problem we're solving.
- They influence **how data is stored, queried, and processed**.
- The wrong model can make certain tasks **slow, awkward, or impossible**.
- Choosing the right model helps you build **efficient, maintainable software**.

### Choosing the Right Data Model

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

## Storage Engines and Indexing

### 📦 Why Indexes Exist

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

### 🧭 Solution: Indexes

An **index** is an additional structure that helps locate data quickly.

- Speeds up reads
- Slows down writes (because it must be maintained)
- Trades storage + complexity for performance

---

### 🔑 Hash Indexes (Simple Case)

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

### 📚 Log-Structured Storage (Foundation for Modern Indexes)

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

#### 🧹 Compaction

To avoid infinite growth:

- Remove duplicate keys
- Keep only latest value
- Merge segments

This creates **segment files**

---

#### ⚡ SSTables (Sorted String Tables)

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

#### 🧠 Memtable + SSTable System

1. Writes go to **memtable (in-memory tree)**
2. When full → flush to disk as SSTable
3. Background compaction merges SSTables

---

#### 🚀 Resulting system: LSM Tree

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

### 🌳 B-Trees (Traditional Index Structure)

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

### ⚔️ LSM Tree vs B-Tree

| Feature       | LSM Tree   | B-Tree     |
| ------------- | ---------- | ---------- |
| Writes        | Very fast  | Slower     |
| Reads         | Slower     | Faster     |
| Storage       | Efficient  | Fragmented |
| Compaction    | Required   | Not needed |
| Write pattern | Sequential | Random     |

---

## Specialized Indexing

### 🌍 Geospatial Indexing Problem

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

#### 🧭 Geohash Approach (1D mapping of 2D space)

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

#### 🌳 Quadtree (Hierarchical space partitioning)

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

#### 🌐 Google S2 (Advanced geospatial system)

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

| Technique      | Idea                        |
| -------------- | --------------------------- |
| Hash index     | Direct lookup               |
| LSM tree       | Append + merge logs         |
| B-tree         | Balanced page tree          |
| Inverted index | Term → document mapping     |
| Geohash        | Encode 2D → 1D string       |
| Quadtree       | Recursive spatial partition |
| S2             | Sphere → curve → 1D         |

---

### Inverted Indexes (Full-Text Search)

> Full coverage of inverted indexes, BM25, fuzzy search, N-grams, Levenshtein automata, LSH/MinHash, distributed search, and Lucene/Elasticsearch internals is in [text-and-lexical-search.md](./text-and-lexical-search.md).

---

## Database Selection

### Database Selection Mental Model

## Step 1 — Is it transactional?

**Question:** Does the business require ACID transactions and strong consistency?

Examples:

- Payments
- Orders
- Banking
- Inventory

**→ Yes:** Use **SQL**

- PostgreSQL
- MySQL

If you also need **global distribution + strong consistency**, choose **NewSQL**.

- CockroachDB
- Google Spanner

Otherwise, continue.

---

## Step 2 — What is the dominant access pattern?

Choose the one that best describes your system.

| Pattern                    | Database                                |
| -------------------------- | --------------------------------------- |
| Flexible JSON documents    | **Document** (MongoDB)                  |
| Time-stamped data          | **Time-series** (TimescaleDB, InfluxDB) |
| Relationship traversal     | **Graph** (Neo4j)                       |
| Simple key lookups         | **Key-Value** (Redis, DynamoDB)         |
| Massive distributed writes | **Wide-column** (Cassandra, HBase)      |

---

## Step 3 — Is this operational or analytical?

**Operational (OLTP)**

- Users create/update data
- Low latency
- Small reads/writes

→ Stay with the database chosen above.

**Analytical (OLAP)**

- Reports
- Dashboards
- GROUP BY
- Aggregations over billions of rows

→ Use a **Data Warehouse**

- BigQuery
- Snowflake
- ClickHouse

---

## Step 4 — Do users need to search text?

If users type things like:

- "iphone 16"
- "error timeout"
- "how to reset password"

→ Add a **Search Engine**

- Elasticsearch
- Solr

Search engines usually complement—not replace—your primary database.

---

# Summary

```text
Need transactions?
│
├── Yes
│   ├── Global consistency? → NewSQL
│   └── Otherwise → SQL
│
└── No
    │
    ├── JSON documents?      → Document
    ├── Time-series data?    → Time-series
    ├── Relationships?       → Graph
    ├── Key lookups?         → Key-Value
    └── Massive writes?      → Wide-column

Need analytics? → OLAP
Need text search? → Search Engine
```

## Rule of Thumb

- **SQL/NewSQL** → Transactions
- **Document** → Flexible schema
- **Time-series** → Time-based data
- **Graph** → Relationships
- **Key-Value** → Ultra-fast lookups
- **Wide-column** → Massive ingestion
- **OLAP** → Analytics
- **Search Engine** → Full-text search

---

### Database Categories

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

## Distributed Data Architecture

### Sharding (Data Partitioning)

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

For detailed treatment of consistent hashing — including the ring algorithm, virtual nodes, and Uber's Ringpop implementation — see [distributed-systems-algorithms.md#consistent-hashing](distributed-systems-algorithms.md#consistent-hashing).

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

For detailed analysis of replication models (Primary-replica, Multi-primary, Leaderless) and their consistency guarantees, see [consensus-and-replication.md#linearizability-in-different-replication-models](./consensus-and-replication.md#linearizability-in-different-replication-models).

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

## Memory and Storage Internals

### In-memory vs on-disk structures

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

## Query Patterns and Access Optimization

### SQL Joins and Query Design

![image.png](../assets/miscellaneous/joins.png)

SQL JOINs are fundamental operations for combining data from multiple tables in relational queries. Different join types (INNER, LEFT, RIGHT, FULL, CROSS) determine which rows are included in the result set based on matching conditions between tables.

---

### N+1 Query Problem & Loading Strategies

The **N+1 Query Problem** occurs when an application executes:

- one query to fetch a collection
- followed by one additional query for each item in that collection

It is one of the most common performance problems in ORMs and GraphQL APIs because it generates many unnecessary database round trips.

---

# The Problem

Suppose we want to display all users and their orders.

First query:

```sql
SELECT *
FROM users;
```

Then, for each user:

```sql
SELECT *
FROM orders
WHERE user_id = 1;

SELECT *
FROM orders
WHERE user_id = 2;

SELECT *
FROM orders
WHERE user_id = 3;
```

Total queries:

```text
1 + N
```

Examples:

- 10 users → 11 queries
- 100 users → 101 queries
- 10,000 users → 10,001 queries

The biggest cost is usually:

> repeated database round trips

not the SQL execution itself.

---

# Why It Happens

The N+1 problem usually appears when relationships are loaded lazily or queried inside loops.

Example:

```java
for (User user : users) {
    user.getOrders();
}
```

Each call may trigger another database query.

---

# Common Causes

- ORM lazy loading
- GraphQL nested resolvers
- Repository calls inside loops
- REST endpoints repeatedly fetching related entities

---

# Mitigation Strategies

## 1. JOIN Fetching

Instead of separate queries, fetch related data together.

```sql
SELECT *
FROM users
JOIN orders
ON users.id = orders.user_id;
```

### Advantages

- One database round trip
- Simple implementation
- Fast for moderate datasets

### Disadvantages

- Repeated parent data
- Large joins may consume significant memory
- Joining many relationships can create huge result sets

---

## 2. Batch Loading

Instead of:

```sql
SELECT *
FROM orders
WHERE user_id = 1;

SELECT *
FROM orders
WHERE user_id = 2;

SELECT *
FROM orders
WHERE user_id = 3;
```

batch requests into:

```sql
SELECT *
FROM orders
WHERE user_id IN (1, 2, 3);
```

Flow:

```text
Users
  ↓
Collect IDs
  ↓
Single IN Query
  ↓
Map Results
```

This reduces:

```text
1 + N queries
```

to:

```text
2 queries
```

This is one of the most common mitigation strategies.

---

## 3. GraphQL DataLoader

GraphQL executes each field through a separate **resolver**.

For example:

```graphql
users {
  id
  orders {
    id
  }
}
```

A typical execution looks like this:

```text
Resolve users

↓

SELECT * FROM users
```

Suppose the result is:

```text
User1
User2
User3
```

GraphQL now resolves the `orders` field for **each user** independently.

Without DataLoader:

```text
Resolve Orders(User1)

↓

SELECT * FROM orders WHERE user_id = 1

Resolve Orders(User2)

↓

SELECT * FROM orders WHERE user_id = 2

Resolve Orders(User3)

↓

SELECT * FROM orders WHERE user_id = 3
```

This produces the classic **N+1 query problem**.

### How DataLoader Helps

Instead of executing each query immediately, DataLoader collects all requested IDs during the current GraphQL request.

Rather than:

```text
User1 → Query

User2 → Query

User3 → Query
```

it batches them into a single query:

```sql
SELECT *
FROM orders
WHERE user_id IN (1, 2, 3);
```

The results are then grouped by `user_id` and returned to the corresponding resolver.

```text
Database

↓

Orders

↓

Group by user_id

↓

Resolver(User1)
Resolver(User2)
Resolver(User3)
```

From the resolver's perspective, nothing changes—it still receives only that user's orders—but the database is queried only once.

### Benefits

- Automatic batching
- Request-scoped cache
- Eliminates duplicate lookups
- Reduces database round trips

DataLoader caches results only during a single GraphQL request. It is **not** a distributed cache like Redis.

---

## 4. Eager Loading

Relationships are loaded immediately together with the parent entity.

Examples:

```java
@EntityGraph
JOIN FETCH
```

### Advantages

- Prevents many N+1 issues
- Simpler application logic

### Disadvantages

- May over-fetch data
- Higher memory usage

---

# Lazy vs Eager Loading

| Lazy Loading                    | Eager Loading                           |
| ------------------------------- | --------------------------------------- |
| Loads on demand                 | Loads immediately                       |
| Smaller initial query           | Larger initial query                    |
| Can create N+1 queries          | Prevents many N+1 cases                 |
| Lower initial memory usage      | Higher memory usage                     |
| Good for optional relationships | Good when related data is always needed |

Neither strategy is universally better.

The correct choice depends on:

- access patterns
- relationship size
- latency requirements
- memory constraints

---

# ORM Fetch Strategies

Many ORMs support configurable fetch strategies.

Examples:

- Hibernate
- JPA
- Entity Framework
- Django ORM
- SQLAlchemy

Common techniques include:

- `JOIN FETCH`
- `EntityGraph`
- `Include()`
- `select_related()`
- `prefetch_related()`

---

# Additional Mitigation Techniques

## Projection Queries

Instead of loading full entities:

```sql
SELECT id, name
FROM users;
```

retrieve only required columns.

### Benefits

- Smaller payloads
- Less memory usage
- Faster serialization

---

## Pagination

Instead of loading:

```text
100,000 users
```

load:

```text
50 users
```

This reduces query size and limits N+1 amplification.

---

## Caching

Frequently requested relationships can be cached.

Example:

```text
Application
  ↓
Redis
  ↓
Database
```

Caching reduces latency but does not eliminate poor query patterns.

---

# Strategy Comparison

| Strategy      | Queries   | Best For                    | Trade-offs               |
| ------------- | --------- | --------------------------- | ------------------------ |
| JOIN          | 1         | Small/medium relationships  | Duplicate rows           |
| Batch Loading | 2         | Large collections           | Additional mapping logic |
| DataLoader    | 2         | GraphQL                     | Request-scoped only      |
| Eager Loading | Usually 1 | Always-needed relationships | Over-fetching            |
| Lazy Loading  | 1 + N     | Optional relationships      | N+1 risk                 |
| Cache         | Varies    | Frequently reused data      | Invalidation complexity  |

---

# Typical Usage Guidance

| Scenario                            | Recommended Strategy  |
| ----------------------------------- | --------------------- |
| GraphQL API                         | DataLoader            |
| REST endpoint returning nested data | Batch Loading or JOIN |
| Small related dataset               | JOIN FETCH            |
| Large optional relationships        | Lazy Loading          |
| Frequently reused reference data    | Cache                 |
| Reporting/dashboard queries         | Projection Queries    |

---

# Key Takeaways

- N+1 occurs when one query triggers many additional queries.
- The largest cost is usually network/database round trips.
- JOINs solve many N+1 cases with a single query.
- Batch loading replaces many queries with a single `WHERE ... IN (...)` query.
- GraphQL DataLoader batches and caches lookups within a request.
- Lazy loading improves initial query cost but can accidentally create N+1 problems.
- Eager loading prevents many N+1 issues but may over-fetch data.
- The best strategy depends on dataset size, relationship cardinality, and access patterns.

---

## Pagination and Result Navigation

### Pagination Patterns

When datasets become large, APIs should return data in chunks instead of loading everything at once.

The 2 main strategies are:

1. Offset pagination
2. Cursor/Keyset pagination

---

#### 1. Offset Pagination

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

#### 2. Cursor / Keyset Pagination

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

#### Keyset vs Cursor

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

#### Comparison Table

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

#### Decision Framework

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

#### Rule of Thumb

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

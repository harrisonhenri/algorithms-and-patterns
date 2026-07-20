---
tags: [data-structures, caching, design-patterns, theory]
title: "Caching Strategies"
---

# Caching Strategies: LRU & LFU

Caching is a performance optimization technique that stores frequently accessed data in a limited-capacity, fast-access data structure. This document covers two fundamental cache eviction policies: **Least Recently Used (LRU)** and **Least Frequently Used (LFU)**.

> **Prerequisites:** Understand [Hash Tables](../../structures/hash-table/index.ts) (O(1) lookups) and [Linked Lists](../../structures/linked-list/index.ts) (O(1) insertions/deletions at ends).

---

## Core Concepts

### LRU Cache (Least Recently Used)

**Mechanism:** Evicts the item that was **accessed longest ago**, regardless of how many times it was used.

**Key Insight:** Tracks **temporal locality** — assumes recently used items are likely to be used again soon.

**Operations:**

- **Get(key)**: Return value and mark as recently used (move to front)
- **Put(key, value)**: Insert/update and mark as recently used; evict least recently used if at capacity

**Time Complexity:**

| Operation | Complexity |
| --------- | ---------- |
| Get       | O(1)       |
| Put       | O(1)       |
| Eviction  | O(1)       |

**Space Complexity:** O(capacity)

**Implementation Pattern:**

```text
┌─────────────────────────────────────────┐
│  HashMap: key → node reference          │  ← O(1) lookup
├─────────────────────────────────────────┤
│  Doubly Linked List: MRU ← → LRU        │  ← O(1) move/evict
│  (head = most recently used)            │
│  (tail = least recently used)           │
└─────────────────────────────────────────┘
```

**Use Case Example:**

```text
Cache Capacity: 3
│ Operations             │ Cache State       │ Notes                    │
├────────────────────────┼───────────────────┼──────────────────────────┤
│ Put(1, "a")            │ [1]               │ Insert                   │
│ Put(2, "b")            │ [2, 1]            │ Insert (head)            │
│ Put(3, "c")            │ [3, 2, 1]         │ Insert (head)            │
│ Get(1)                 │ [1, 3, 2]         │ Move 1 to head           │
│ Put(4, "d")            │ [4, 1, 3]         │ Evict 2 (tail, LRU)      │
│ Get(3)                 │ [3, 4, 1]         │ Move 3 to head           │
```

---

### LFU Cache (Least Frequently Used)

**Mechanism:** Evicts the item with the **lowest access frequency**; ties broken by least recently used.

**Key Insight:** Tracks **frequency locality** — assumes frequently used items remain important even if not recently accessed.

**Operations:**

- **Get(key)**: Return value and increment frequency counter
- **Put(key, value)**: Insert/update, increment frequency; evict item with lowest frequency (ties: LRU within frequency)

**Time Complexity:**

| Operation | Complexity |
| --------- | ---------- |
| Get       | O(1)       |
| Put       | O(1)       |
| Eviction  | O(1)       |

**Space Complexity:** O(capacity)

**Implementation Pattern:**

```text
┌──────────────────────────────────────────────────┐
│  HashMap: key → (value, freq, timestamp)         │
├──────────────────────────────────────────────────┤
│  HashMap: freq → Doubly Linked List              │
├──────────────────────────────────────────────────┤
│  Min-Frequency Pointer                           │
└──────────────────────────────────────────────────┘
```

**Use Case Example:**

```text
Cache Capacity: 3
│ Operations             │ Cache State (freq) │ Notes                          │
├────────────────────────┼────────────────────┼────────────────────────────────┤
│ Put(1, "a")            │ 1:(1)              │ freq=1                         │
│ Put(2, "b")            │ 1:(2,1)            │ freq=1                         │
│ Put(3, "c")            │ 1:(3,2,1)          │ freq=1                         │
│ Get(1)                 │ 1:(3,2) 2:(1)      │ 1 moves to freq=2              │
│ Get(2)                 │ 1:(3) 2:(2,1)      │ 2 moves to freq=2              │
│ Put(4, "d")            │ 1:() 2:(2,1,4)     │ Evict 3 (freq=1)               │
│ Get(1)                 │ 2:(1) 3:(4)        │ 1 moves to freq=3              │
│ Put(5, "e")            │ 2:(1) 3:(4,5)      │ Evict 4 (oldest in freq=2)     │
```

---

## Comparison: LRU vs LFU

| Aspect             | LRU                     | LFU                     |
| ------------------ | ----------------------- | ----------------------- |
| **Eviction Rule**  | Least recently accessed | Lowest access frequency |
| **Access Pattern** | Recency matters         | Frequency matters       |
| **Best For**       | Browsing, pagination    | Stable hot datasets     |
| **Implementation** | HashMap + DLL           | 2 HashMaps + DLLs       |
| **Complexity**     | Simpler                 | More complex            |

### When to Use Each

**Use LRU when:**

- Access patterns have strong temporal locality
- Simplicity matters
- Building page caches, session stores or browser caches

**Use LFU when:**

- Some objects remain hot for long periods
- Bursty traffic should not evict popular items
- Building query caches, DNS caches or recommendation systems

---

## Advanced Cache Algorithms & Access Locality

Modern cache systems are designed around how applications access data. Some algorithms favor recently accessed objects, while others favor frequently accessed ones.

Understanding these access patterns helps explain why caches like LRU, ARC, CLOCK and 2Q exist.

---

## Temporal vs Frequency Locality

### Temporal Locality

**Idea:** If data was accessed recently, it is likely to be accessed again soon.

Examples:

- Browser pages
- Recently opened files
- Session data
- Current shopping carts

Example:

```text
A B C D A
```

Since `A` was recently used, keeping it in cache is likely beneficial.

This is exactly what **LRU** optimizes.

---

### Frequency Locality

**Idea:** Frequently accessed data tends to remain important over time.

Examples:

- Popular products
- Frequently executed SQL queries
- Trending videos
- Popular API endpoints

Example:

```text
A B A C A D A
```

Even if `A` was not the most recent access, it is clearly the hottest object.

This is what **LFU** optimizes.

---

### Locality Comparison

| Temporal Locality                   | Frequency Locality                  |
| ----------------------------------- | ----------------------------------- |
| Recently used data is likely reused | Frequently used data stays valuable |
| Optimized by LRU                    | Optimized by LFU                    |
| Reacts quickly to workload changes  | Keeps long-term hot items           |
| Better for browsing workloads       | Better for stable workloads         |

Most real-world systems exhibit both types of locality.

---

## ARC (Adaptive Replacement Cache)

ARC dynamically balances **recency (LRU)** and **frequency (LFU)** without requiring manual tuning.

Instead of choosing one policy, ARC continuously adapts based on the workload.

### Structure

ARC maintains four lists:

```text
Recent Cache (T1)
Frequently Used Cache (T2)

Recent History (B1)
Frequent History (B2)
```

- `T1` → recently accessed items
- `T2` → frequently reused items
- `B1` → recently evicted from T1
- `B2` → recently evicted from T2

The history lists only store keys, not values.

### How It Works

When an item is accessed:

- New item → enters `T1`
- Accessed again → promoted to `T2`
- Evicted items leave ghost entries in `B1/B2`
- Future accesses to ghost entries help ARC decide whether to favor recency or frequency

The cache automatically adjusts its balance as workloads change.

### Advantages

- Adapts automatically
- Performs well across many workloads
- Resistant to scan pollution
- No manual tuning required

### Disadvantages

- More complex implementation
- Higher metadata overhead

---

## CLOCK

CLOCK is a lightweight approximation of LRU.

Instead of maintaining a linked list, it uses a circular buffer with a reference bit.

### Structure

```text
          Hand
            ↓

[A][B][C][D][E]
 1  0  1  1  0
```

Each cache entry stores:

- value
- reference bit (`0` or `1`)

### Algorithm

When an entry is accessed:

```text
Reference Bit = 1
```

When eviction is needed:

1. Inspect current item
2. If bit = `0` → evict it
3. If bit = `1` → set bit to `0`
4. Move the clock hand forward
5. Repeat until a `0` is found

### Advantages

- Very low overhead
- Close to LRU performance
- Simple implementation

### Disadvantages

- Approximate rather than exact LRU
- Slightly less accurate eviction decisions

---

## 2Q Cache

2Q improves LRU by preventing one-time accesses from polluting the cache.

A normal LRU may evict valuable data after a large sequential scan.

2Q separates recently seen items from frequently reused ones.

### Structure

```text
A1-in
↓

Recent Queue

↓

Am
↓

Main Queue

↓

A1-out

↓

History Queue
```

### How It Works

#### First Access

A new item enters the Recent Queue (`A1-in`).

```text
A
↓

Recent Queue
```

#### Second Access

If accessed again before eviction:

```text
A

↓

Main Queue
```

Now it is considered a genuinely useful item.

#### Eviction

If an item is evicted before being reused:

```text
History Queue (A1-out)
```

Only its key is kept.

If it is requested again later, it can be promoted directly to the Main Queue.

### Advantages

- Prevents cache pollution from sequential scans
- Better than pure LRU for mixed workloads
- Simpler than ARC

### Disadvantages

- Requires tuning queue sizes
- Slightly more metadata than LRU

---

## Multi-Algorithm Comparison

| Algorithm | Main Idea                                         | Best For                | Complexity |
| --------- | ------------------------------------------------- | ----------------------- | ---------- |
| **LRU**   | Keep recently used items                          | Temporal locality       | Low        |
| **LFU**   | Keep frequently used items                        | Stable hot data         | Medium     |
| **CLOCK** | Approximate LRU using a reference bit             | Operating systems       | Low        |
| **2Q**    | Separate first-time and reused items              | Mixed workloads         | Medium     |
| **ARC**   | Adapt between recency and frequency automatically | General-purpose caching | High       |

---

## Recommended Algorithms by Workload

| Workload                              | Recommended Algorithm |
| ------------------------------------- | --------------------- |
| Browser cache                         | LRU                   |
| CPU page replacement                  | CLOCK                 |
| Database buffer pool                  | CLOCK / LRU           |
| Redis-like cache                      | LRU or LFU            |
| Mixed workloads with sequential scans | 2Q                    |
| Highly dynamic enterprise workloads   | ARC                   |

---

## Real-World Applications

### LRU

- Browser caches
- Database page caches
- CDN edge caches
- Session stores

### LFU

- DNS caches
- Query caches
- ML inference caches
- Recommendation systems

### CLOCK

- CPU page replacement
- Operating system memory management
- Database buffer pools

### 2Q

- Mixed transactional and analytical workloads
- Database caching layers
- Sequential scan-heavy systems

### ARC

- Enterprise storage systems
- Adaptive database caches
- Dynamic multi-tenant workloads

---

## Key Takeaways

- **Temporal locality** means recently used items are likely to be reused soon.
- **Frequency locality** means frequently accessed items tend to remain important.
- **LRU** optimizes for recency.
- **LFU** optimizes for long-term popularity.
- **CLOCK** approximates LRU with much lower overhead.
- **2Q** protects caches from one-time sequential scans.
- **ARC** dynamically balances recency and frequency automatically.

---

## Implementation Considerations

### Common Pitfalls

- LRU tie-breaking
- LFU frequency aging
- Memory leaks
- Concurrent access

### Optimizations

- Segmented LRU
- Frequency decay
- Bloom filters
- Lazy deletion

---

## Complexity Summary

| Operation | LRU  | LFU  |
| --------- | ---- | ---- |
| Get       | O(1) | O(1) |
| Put       | O(1) | O(1) |
| Space     | O(n) | O(n) |

---

# Distributed Cache

Modern systems rarely use a single cache. Instead, they build a **cache hierarchy**, where each level serves a different purpose.

## Cache Levels

```text
Request
   │
   ▼
L1 Cache (Application Memory)
   │
   ▼
L2 Cache (Shared/Distributed Cache)
   │
   ▼
Database
```

### L1 Cache (Local)

Lives inside each application instance.

Examples:

- Caffeine
- Guava Cache
- Spring Cache (local providers)

Pros:

- Fastest access (memory)
- No network call

Cons:

- Each instance has its own copy
- Can become stale across replicas

---

### L2 Cache (Distributed)

Shared by all application instances.

Examples:

- Redis
- Memcached

Pros:

- Shared cache across the cluster
- Higher hit rate
- Much larger capacity

Cons:

- Network hop
- Higher latency than L1

---

### ORM-Level Cache (Hibernate/JPA)

Hibernate itself also provides cache levels.

```text
Application

↓

Hibernate L1 Cache
(Session)

↓

Hibernate L2 Cache
(Entity Cache)

↓

Database
```

- **L1 Cache**: automatic, per transaction/session.
- **L2 Cache**: optional, shared across sessions using providers such as Redis, Ehcache or Hazelcast.

This reduces repeated database queries while remaining transparent to the application.

---

## Typical Read Flow

A common layered lookup is:

```text
Request
   │
   ▼
L1 Cache
   │ miss
   ▼
L2 Cache
   │ miss
   ▼
Database
   │
   ▼
Populate L2
   │
   ▼
Populate L1
```

Most requests are served before reaching the database.

---

## Common Distributed Cache Techniques

Large systems often combine multiple cache types.

| Technique                       | Purpose                                  |
| ------------------------------- | ---------------------------------------- |
| **CDN**                         | Cache static assets near users           |
| **Hot Cache**                   | Keep extremely popular objects in memory |
| **Cache Warming**               | Preload expected hot data                |
| **Long TTLs**                   | Reduce cache misses                      |
| **Dedicated Cache Clusters**    | Isolate heavy workloads                  |
| **Separate Content & Counters** | Avoid invalidating entire objects        |

Example:

```text
Images
    ↓
CDN

Products
    ↓
Redis

Views/Likes
    ↓
Counter Cache
```

---

## Cache Invalidation

Keeping cache consistent with the database is one of the hardest problems in distributed systems.

### Cache-Aside (Most Common)

```text
Read

Cache

↓

Miss

↓

Database

↓

Populate Cache
```

On writes:

```text
Update Database

↓

Delete Cache Entry
```

The next read reloads fresh data.

---

### Write-Through

```text
Update Database

↓

Update Cache
```

The cache is updated immediately after the database.

Trade-offs:

- fresher reads
- more expensive writes

---

## TTL

TTL acts as a safety net.

```text
TTL expires

↓

Cache Miss

↓

Database

↓

Fresh Cache Entry
```

Even if invalidation fails, stale entries eventually disappear.

---

## Separate Mutable Data

Large objects rarely change.

Counters change constantly.

Instead of caching:

```text
Post

↓

Content
Likes
Views
Replies
```

systems often split them into:

```text
Content Cache
```

and

```text
Counter Cache
```

Updating likes no longer invalidates the entire object.

Large systems often take this further by caching collections separately from the underlying objects themselves.

---

## Cache IDs, Not Full Objects

Large systems rarely cache complete objects inside collections such as feeds, timelines or search results.

Instead of storing:

```text
Feed

↓

[
  Post A,
  Post B,
  Post C
]
```

they typically cache only object identifiers:

```text
Feed

↓

[
  post:101,
  post:205,
  post:887
]
```

Each object is then loaded independently:

```text
Request Feed

↓

List of Post IDs

↓

Content Cache

+

Counter Cache

↓

Compose Response
```

### Why?

If a post changes, only that post's cache entry needs to be refreshed.

The feed itself remains valid.

### Benefits

- Smaller cache entries
- Higher cache reuse across multiple feeds
- Simpler cache invalidation
- Lower memory usage
- Fewer cascading updates

This pattern is widely used by social networks, recommendation systems and search engines, where many collections reference the same underlying objects.

---

## Cache Refresh

Some updates trigger asynchronous refreshes.

```text
Object Updated

↓

Message Queue

↓

Workers

↓

Refresh Cache
```

This keeps write latency low while eventually updating derived caches.

---

## Sharding & Hot Keys

As cache clusters grow, data is partitioned across nodes.

```text
hash(key)

↓

Shard A
Shard B
Shard C
```

Benefits:

- horizontal scaling
- balanced storage
- higher throughput

### Hot Keys

Some keys receive far more traffic than others.

Mitigation techniques include:

- cache replication
- dedicated cache nodes
- consistent hashing
- virtual nodes

These prevent a single hot object from overwhelming one server.

---

## Further Reading

- **LeetCode #146 (LRU Cache)**
- **LeetCode #460 (LFU Cache)**

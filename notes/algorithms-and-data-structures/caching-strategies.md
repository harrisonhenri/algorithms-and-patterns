---
tags: [data-structures, caching, design-patterns, theory]
title: "Caching Strategies: LRU & LFU"
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
| Get | O(1) |
| Put | O(1) |
| Eviction | O(1) |

**Space Complexity:** O(capacity)

**Implementation Pattern:**

```
┌─────────────────────────────────────────┐
│  HashMap: key → node reference          │  ← O(1) lookup
├─────────────────────────────────────────┤
│  Doubly Linked List: MRU ← → LRU        │  ← O(1) move/evict
│  (head = most recently used)            │
│  (tail = least recently used)           │
└─────────────────────────────────────────┘
```

**Use Case Example:**

```
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
| ---------- | ---------- |
| Get | O(1) |
| Put | O(1) |
| Eviction | O(1) |

**Space Complexity:** O(capacity)

**Implementation Pattern:**

```
┌──────────────────────────────────────────────────┐
│  HashMap: key → (value, freq, timestamp)         │  ← O(1) lookup
├──────────────────────────────────────────────────┤
│  HashMap: freq → Doubly Linked List              │  ← O(1) freq lookup
│    (tracks insertion order for LRU within freq)  │
├──────────────────────────────────────────────────┤
│  Min-Frequency Pointer                           │  ← O(1) eviction
│    (marks lowest non-empty frequency)            │
└──────────────────────────────────────────────────┘
```

**Use Case Example:**

```
Cache Capacity: 3
│ Operations             │ Cache State (freq) │ Notes                          │
├────────────────────────┼────────────────────┼────────────────────────────────┤
│ Put(1, "a")            │ 1:(1)              │ freq=1                         │
│ Put(2, "b")            │ 1:(2,1)            │ freq=1                         │
│ Put(3, "c")            │ 1:(3,2,1)          │ freq=1                         │
│ Get(1)                 │ 1:(3,2) 2:(1)      │ 1 moves to freq=2              │
│ Get(2)                 │ 1:(3) 2:(2,1)      │ 2 moves to freq=2              │
│ Put(4, "d")            │ 1:() 2:(2,1,4)     │ Evict 3 (freq=1, only one)     │
│ Get(1)                 │ 1:() 2:(1) 3:(4)   │ 1 moves to freq=3              │
│ Put(5, "e")            │ 2:(1) 3:(4,5)      │ Evict 4 (freq=2, oldest in freq) │
```

---

## Comparison: LRU vs LFU

| Aspect              | LRU                                | LFU                                                |
| ------------------- | ---------------------------------- | -------------------------------------------------- |
| **Eviction Rule**   | Least recently accessed            | Lowest frequency access                            |
| **Access Pattern**  | Recency matters most               | Frequency matters most                             |
| **Locality Type**   | Temporal (recent = relevant)       | Frequency (hot = relevant)                         |
| **Best For**        | Browsing, pagination, time-series  | Workloads, caching stats, CDNs                     |
| **Space Overhead**  | Linked list + hash map             | Linked lists per freq + 2 hash maps + min-freq ptr |
| **Complexity**      | Simpler to implement               | More complex logic                                 |
| **Cache Pollution** | Bursty access patterns waste space | Resists bursty patterns better                     |

### When to Use Each

**Use LRU when:**

- Access patterns follow **temporal locality** (e.g., web browsing: just-opened pages are more likely to be revisited)
- **Simplicity** and low overhead are priorities
- You're building **page caches, undo/redo stacks, session stores**

**Use LFU when:**

- Workload has **stable, predictable access patterns** (e.g., frequently accessed API endpoints, cached database queries)
- You want to **resist bursty traffic** (one-time scans don't evict hot data)
- **Memory efficiency** matters: keep only truly "hot" items

**Hybrid Approaches:**

- **Time-Windowed Frequency:** Combine recency + frequency by decaying frequencies over time
- **Adaptive:** Switch between LRU/LFU based on workload characteristics

---

## Real-World Applications

### LRU Caches

- **Browser caching** (recently visited pages)
- **CPU caches** (L1/L2/L3: most recently accessed memory)
- **Database page buffers** (recently queried data blocks)
- **CDN edge caches** (hot content served from edge, slower content from origin)
- **Undo/Redo buffers** (recent edits more likely needed)

### LFU Caches

- **DNS caches** (popular domains queried repeatedly)
- **Query result caches** (same queries run frequently)
- **Image/video transcoding pipelines** (encode popular sizes more often)
- **Machine learning inference servers** (model #1 called 100x/day, model #2 called 1x/day)
- **Recommendation systems** (cache popular item embeddings)

---

## Implementation Considerations

### Common Pitfalls

1. **LRU Tie-Breaking:** If multiple items have same recent access time, ensure consistent eviction order
2. **LFU Frequency Decay:** Old items may stay in cache indefinitely if never evicted; consider aging frequencies
3. **Memory Leaks:** Ensure removed nodes are properly garbage-collected (clear references)
4. **Concurrent Access:** Single-threaded implementations break under concurrent Get/Put; add locks or use lock-free algorithms

### Optimization Techniques

- **Lazy Deletion:** Mark items as "deleted" without actual removal; clean up on next eviction
- **Bloom Filters:** Pre-check if key might exist before hash table lookup (reduces cache line misses)
- **Segmented LRU:** Divide cache into hot/warm/cold segments; promote items on hits
- **Consistent Hashing:** For distributed caches (e.g., Redis cluster), minimize data movement on eviction

---

## Data Structures Used

### Required

- **[Hash Table](../../structures/hash-table/index.ts)** — O(1) key lookups
- **[Doubly Linked List](../../structures/linked-list/index.ts)** — O(1) node reordering/removal

### Optional (Advanced)

- **[Heap](../../structures/heap/index.ts)** — Priority-based eviction (slower, use LFU Map instead)
- **[BST](../../structures/tree/bst/index.ts)** — For ordered frequency tracking (overkill for LFU)

---

## Complexity Summary

| Operation | LRU  | LFU  |
| --------- | ---- | ---- |
| Get       | O(1) | O(1) |
| Put       | O(1) | O(1) |
| Space     | O(n) | O(n) |

Both achieve **O(1) amortized** time complexity for all operations through careful data structure composition.

---

## Further Reading

- **Temporal vs Frequency Locality:** Computer architecture fundamentals (cache hierarchies)
- **Practical Implementation:** [LeetCode #146 (LRU Cache)](https://leetcode.com/problems/lru-cache/), [#460 (LFU Cache)](https://leetcode.com/problems/lfu-cache/)
- **Variations:**
  - **2-Q Cache:** Separates recently accessed and recently accessed-twice items
  - **ARC (Adaptive Replacement Cache):** Dynamically adapts between LRU and LFU
  - **CLOCK:** Approximation of LRU using a circular buffer (used in Linux page replacement)

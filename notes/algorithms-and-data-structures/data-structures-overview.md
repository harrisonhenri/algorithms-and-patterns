---
tags: [data-structures, theory]
title: "Data structures in repo"
---

# Data Structures Overview

> **Entry point:** [structures](../../structures)

## ADT vs Data Structures

An **Abstract Data Type (ADT)** defines _what_ operations are supported and their expected behaviour, without specifying _how_ they are implemented (e.g. List, Queue, Stack, Priority Queue).

A **Data Structure** is a concrete implementation of an ADT — it defines how data is organised in memory and how each operation executes (e.g. Array, Linked List, Hash Table, Heap, BST).

> The same ADT can be implemented with different data structures; each carries different time/space trade-offs.

This section maps the concrete implementations in this repository and where they are commonly applied.

### Practical ADT mapping example

The **Queue ADT** can be implemented in multiple ways depending on constraints:

- Array + head pointer (used here in [queue](../../structures/queue/index.ts))
- Linked list with head/tail pointers
- Circular buffer for fixed-capacity, low-allocation workloads

All implement FIFO semantics, but with different memory behavior and operational trade-offs.

---

## Data Structures

### Quick Reference

| Structure        | File                                                     | Mechanism                                                                 |  insert / add  | remove / poll  | lookup / peek | Space  | Key Use Cases                                                                            |
| ---------------- | -------------------------------------------------------- | ------------------------------------------------------------------------- | :------------: | :------------: | :-----------: | :----: | ---------------------------------------------------------------------------------------- |
| **MinHeap**      | [heap/min-heap](../../structures/heap/min-heap/index.ts) | Array-backed complete binary tree; insert → bubble up, poll → bubble down |    O(log n)    |    O(log n)    |     O(1)      |  O(n)  | Priority queues, Dijkstra, Kth-smallest in stream, meeting rooms                         |
| **MaxHeap**      | [heap/max-heap](../../structures/heap/max-heap/index.ts) | Array-backed complete binary tree; insert → bubble up, poll → bubble down |    O(log n)    |    O(log n)    |     O(1)      |  O(n)  | Keep k-smallest (gatekeeper), streaming median (lower half)                              |
| **Graph**        | [graph](../../structures/graph/index.ts)                 | Adjacency list (nested map: vertex → {neighbor → weight})                 |      O(1)      |     O(V+E)     |     O(1)      | O(V+E) | Network modelling, pathfinding, social graphs                                            |
| **Binary Tree**  | [tree](../../structures/tree/index.ts)                   | Linked nodes with left/right pointers; Queue for level-order insertion    |      O(n)      |      O(n)      |     O(n)      |  O(n)  | Hierarchical data, expression trees, level-order problems                                |
| **BST**          | [tree/bst](../../structures/tree/bst/index.ts)           | Binary tree enforcing left < node < right; no auto-balance                |  O(log n) avg  |  O(log n) avg  | O(log n) avg  |  O(n)  | Ordered data, range queries, symbol tables                                               |
| **AVL Tree**     | [tree/avl](../../structures/tree/avl/index.ts)           | BST + depth tracking; LL/RR rotations maintain balance factor ≤ 1         |    O(log n)    |    O(log n)    |   O(log n)    |  O(n)  | DB indexes, ordered maps, guaranteed O(log n) on BST ops                                 |
| **Disjoint Set** | [disjoint-set](../../structures/disjoint-set/index.ts)   | parent[] + rank[] arrays; path compression + union by rank                |    O(α(n))     |       —        |    O(α(n))    |  O(n)  | Connected components, Kruskal's MST, cycle detection                                     |
| **Linked List**  | [linked-list](../../structures/linked-list/index.ts)     | Doubly-linked nodes (val, next, prev); head + tail pointers               | O(1) head/tail | O(1) head/tail |     O(n)      |  O(n)  | LRU/LFU caches (see [caching strategies](caching-strategies.md)), deque, order-sensitive |
| **Stack**        | [stack](../../structures/stack/index.ts)                 | JS array; LIFO access via push/pop at end                                 |      O(1)      |      O(1)      |     O(1)      |  O(n)  | Iterative DFS, undo/redo, expression parsing, backtracking                               |
| **Queue**        | [queue](../../structures/queue/index.ts)                 | JS array + head pointer; enqueue = push, dequeue = arr[head++] (no shift) |      O(1)      |      O(1)      |     O(1)      |  O(n)  | BFS, level-order traversal, task scheduling                                              |
| **Hash Table**   | [hash-table](../../structures/hash-table/index.ts)       | Two parallel arrays + linear probing; hash = key % size                   |    O(1) avg    |    O(1) avg    |   O(1) avg    |  O(n)  | Frequency counting, caching, deduplication, fast lookup                                  |

> α(n) = inverse Ackermann function — effectively O(1) for all practical inputs.

### Caching Strategies

The **Linked List** and **Hash Table** combine to form powerful caching data structures. See **[Caching Strategies: LRU & LFU](caching-strategies.md)** for comprehensive coverage of:

- **LRU (Least Recently Used):** Evicts least-recently-accessed items; best for temporal locality (e.g., browser caches, page buffers)
- **LFU (Least Frequently Used):** Evicts lowest-frequency items; best for stable, frequency-based workloads (e.g., API response caches, DNS caches)

Both achieve O(1) Get/Put operations through Hash Map (key lookup) + Doubly Linked List (order tracking).

### Heap — Decision Framework

| Heap Type                 | Mental Model                            | Typical Pattern                                                                                        |
| ------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **MinHeap**               | "What is the smallest thing right now?" | Dijkstra, priority queues, keeping the **k-largest** elements (MinHeap of size k — peek = kth largest) |
| **MaxHeap**               | "What should I discard?" (gatekeeper)   | Keeping the **k-smallest** elements — peek = largest of those k → replace when a smaller value arrives |
| **Dual Heap (Min + Max)** | Split the data stream at the median     | MaxHeap for lower half, MinHeap for upper half; median = peek of one or average of both                |

---

## Algorithms

### Graph Algorithms

| Algorithm                          | File                                                                 | Mechanism                                                                                                          |           Time            | Space  | Use Cases                                                                   | LeetCode                                                                                       |
| ---------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | :-----------------------: | :----: | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **BFS**                            | [graph/bfs](../../algorithms/graph/breadth-first-search/index.ts)    | Queue (FIFO) + visited set; explores all neighbours at current depth before going deeper                           |          O(V+E)           |  O(V)  | Shortest path (unweighted), level-order, grid flood-fill, connectivity      | All Paths (BFS), Valid Path, Populating Next Pointers, Shortest Path in Binary Matrix          |
| **DFS**                            | [graph/dfs](../../algorithms/graph/depth-first-search/index.ts)      | Explicit stack (LIFO) + visited set; goes as deep as possible then backtracks                                      |          O(V+E)           |  O(V)  | Path enumeration, cycle detection, backtracking, Eulerian path              | All Paths (DFS), Clone Graph, Valid Path, Reconstruct Itinerary, All Paths Lead to Destination |
| **Dijkstra**                       | [graph/dijkstra](../../algorithms/graph/dijkstra/index.ts)           | MinHeap + distance[∞]; greedy extract-min → relax adjacent edges; **non-negative weights only**                    |       O((V+E)logV)        | O(V+E) | Weighted shortest path, GPS routing, network delay                          | Network Delay Time                                                                             |
| **Kahn's (Topological Sort)**      | [graph/kahn](../../algorithms/graph/kahn/index.ts)                   | BFS + in-degree map; enqueue 0-in-degree nodes; decrement neighbours on dequeue; cycle if nodes remain unprocessed |          O(V+E)           | O(V+E) | Dependency ordering, course prerequisites, build order, DAG cycle detection | Course Schedule II, Alien Dictionary, Min Height Trees, Min Semesters                          |
| **Spanning Tree (Kruskal / Prim)** | [graph/spanning-tree](../../algorithms/graph/spanning-tree/index.ts) | Kruskal: sort edges + DisjointSet (skip edge if creates cycle); Prim: MinHeap greedy expansion from seed vertex    | O(E log E) / O((V+E)logV) | O(V+E) | Minimum spanning tree, network design, clustering                           | —                                                                                              |

### Sorting Algorithms

| Algorithm      | Category         | File                                                                       | Mechanism                                                                              |    Avg     |   Worst    |  Space   | Stable | Use Cases                                          |
| -------------- | ---------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | :--------: | :--------: | :------: | :----: | -------------------------------------------------- |
| Bubble Sort    | Comparison       | [bubble-sort](../../algorithms/sort/comparison/bubble-sort/index.ts)       | Adjacent swap passes; largest element bubbles to end each pass                         |   O(n²)    |   O(n²)    |   O(1)   |   ✓    | Teaching, tiny arrays                              |
| Insertion Sort | Comparison       | [insertion-sort](../../algorithms/sort/comparison/insertion-sort/index.ts) | Build sorted prefix; shift larger elements right, insert current in correct position   |   O(n²)    |   O(n²)    |   O(1)   |   ✓    | Small / nearly-sorted arrays, online sorting       |
| Selection Sort | Comparison       | [selection-sort](../../algorithms/sort/comparison/selection-sort/index.ts) | Find min in unsorted region; swap into first unsorted position; no early exit          |   O(n²)    |   O(n²)    |   O(1)   |   ✗    | Memory-write-limited environments                  |
| Merge Sort     | Divide & Conquer | [merge-sort](../../algorithms/sort/divide-conquer/merge-sort/index.ts)     | Recursive halving until single elements; two-pointer merge of sorted halves            | O(n log n) | O(n log n) |   O(n)   |   ✓    | Stable sort, linked list sort, external sorting    |
| Quick Sort     | Divide & Conquer | [quick-sort](../../algorithms/sort/divide-conquer/quick-sort/index.ts)     | Hoare partition selects pivot; recurse on left (< pivot) and right (≥ pivot) subarrays | O(n log n) |   O(n²)    | O(log n) |   ✗    | General-purpose, cache-efficient in-place sort     |
| Heap Sort      | Heap             | [heap-sort](../../algorithms/sort/heap-sort/index.ts)                      | Heapify into MinHeap; repeatedly poll min into result array                            | O(n log n) | O(n log n) |   O(1)   |   ✗    | Guaranteed worst-case, O(1) extra space            |
| Count Sort     | Non-comparison   | [count-sort](../../algorithms/sort/non-comparison/count-sort/index.ts)     | Frequency array → cumulative sum → stable placement by index                           |   O(n+k)   |   O(n+k)   |  O(n+k)  |   ✓    | Small integer range, inner step of Radix Sort      |
| Radix Sort     | Non-comparison   | [radix-sort](../../algorithms/sort/non-comparison/radix-sort/index.ts)     | LSD: counting-sort digit by digit, right to left; stability preserves prior ordering   | O(w·(n+k)) | O(w·(n+k)) |  O(n+k)  |   ✓    | Large datasets with bounded key width              |
| Bucket Sort    | Non-comparison   | [bucket-sort](../../algorithms/sort/non-comparison/bucket-sort/index.ts)   | Map elements to range buckets via floor(k × x / max); sort each bucket; concatenate    |   O(n+k)   |   O(n²)    |  O(n+k)  |   ✓    | Uniformly distributed floats, performance-critical |

### Other Algorithms

| Algorithm          | File                                                        | Mechanism                                                                                                                        |          Time          | Space  | Use Cases                                                         | LeetCode                                               |
| ------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | :--------------------: | :----: | ----------------------------------------------------------------- | ------------------------------------------------------ |
| **QuickSelect**    | [quick-select](../../algorithms/sort/quick-select/index.ts) | Hoare partition; compare pivot index with target k; recurse only on the side that contains k — skips full sort                   | O(n) avg / O(n²) worst |  O(1)  | Kth smallest/largest without a full sort                          | Kth Largest Element in Array                           |
| **Recursion / DP** | [recursion](../../algorithms/recursion/index.ts)            | Top-down: recursion + hash map memoisation; bottom-up: fill DP table iteratively; both reduce exponential O(2ⁿ) to O(n) or O(n²) |         varies         | varies | Overlapping subproblems, optimal substructure, divide-and-conquer | Fibonacci, Pascal's Triangle, Pow(x,n), Unique BSTs II |

---

## LeetCode Problems by Category

### Heap

| Problem                         | File                                                              | Heap Type         | Key Technique                     |
| ------------------------------- | ----------------------------------------------------------------- | ----------------- | --------------------------------- |
| Minimum Cost to Connect Sticks  | [connect-sticks](../../leetcode/heap/connect-sticks.ts)           | MinHeap           | Greedy: always merge 2 smallest   |
| Furthest Building You Can Reach | [furthest-building](../../leetcode/heap/furthest-building.ts)     | MinHeap           | Greedy ladder/brick allocation    |
| K Closest Points to Origin      | [k-closest-points](../../leetcode/heap/k-closest-points.ts)       | MaxHeap(k)        | Gatekeeper: discard farthest of k |
| Kth Largest in a Stream         | [kth-largest-stream](../../leetcode/heap/kth-largest-stream.ts)   | MinHeap(k)        | Peek = kth largest in live stream |
| Kth Largest Element in Array    | [kth-largest](../../leetcode/heap/kth-largest.ts)                 | MinHeap(k)        | Find kth without full sort        |
| Kth Smallest in Sorted Matrix   | [kth-smallest-matrix](../../leetcode/heap/kth-smallest-matrix.ts) | MinHeap           | Multi-pointer matrix extraction   |
| Last Stone Weight               | [last-stone](../../leetcode/heap/last-stone.ts)                   | MaxHeap           | Repeatedly smash two heaviest     |
| Find Median from Data Stream    | [median-finder](../../leetcode/heap/median-finder.ts)             | MinHeap + MaxHeap | Dual-heap partition at median     |
| Meeting Rooms II                | [meeting-rooms](../../leetcode/heap/meeting-rooms.ts)             | MinHeap           | Track earliest room release time  |
| Top K Frequent Elements         | [top-k-frequent](../../leetcode/heap/top-k-frequent.ts)           | MinHeap(k) + Map  | Frequency map + heap filter       |
| K Weakest Rows in Matrix        | [weakest-rows](../../leetcode/heap/weakest-rows.ts)               | MaxHeap(k)        | Row-strength gatekeeper           |

### Graph — BFS

| Problem                        | File                                                                                   | Key Technique                              |
| ------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------ |
| All Paths Source to Target     | [all-paths](../../leetcode/graph/bfs/all-paths.ts)                                     | Queue-based path enumeration               |
| Valid Path in Graph            | [path-existence](../../leetcode/graph/bfs/path-existence.ts)                           | Level-order traversal + visited set        |
| Populating Next Right Pointers | [populating-next-pointers](../../leetcode/graph/bfs/populating-next-pointers.ts)       | Level-order linking in perfect binary tree |
| Shortest Path in Binary Matrix | [shortest-path-binary-matrix](../../leetcode/graph/bfs/shortest-path-binary-matrix.ts) | 8-directional BFS grid shortest path       |

### Graph — DFS

| Problem                       | File                                                                                       | Key Technique                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------- |
| All Paths Lead to Destination | [all-paths-lead-to-destination](../../leetcode/graph/dfs/all-paths-lead-to-destination.ts) | DFS DAG verification — all paths reach target |
| All Paths Source to Target    | [all-paths](../../leetcode/graph/dfs/all-paths.ts)                                         | DFS + backtracking path enumeration           |
| Clone Graph                   | [clone-graph](../../leetcode/graph/dfs/clone-graph.ts)                                     | Deep copy with visited-node mapping           |
| Valid Path in Graph           | [path-existence](../../leetcode/graph/dfs/path-existence.ts)                               | DFS traversal with visited tracking           |
| Reconstruct Itinerary         | [reconstruct-itinerary](../../leetcode/graph/dfs/reconstruct-itinerary.ts)                 | Hierholzer's algorithm (Eulerian path)        |

### Graph — Dijkstra

| Problem            | File                                                                      | Key Technique                                       |
| ------------------ | ------------------------------------------------------------------------- | --------------------------------------------------- |
| Network Delay Time | [network-delay-time](../../leetcode/graph/dijkstra/network-delay-time.ts) | Dijkstra from source; answer = max of all distances |

### Graph — Topological Sort (Kahn's)

| Problem                          | File                                                                      | Key Technique                                            |
| -------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------- |
| Course Schedule II               | [course-schedule-ii](../../leetcode/graph/kahn/course-schedule-ii.ts)     | In-degree BFS for valid course ordering                  |
| Alien Dictionary                 | [alien-dictionary](../../leetcode/graph/kahn/alien-dictionary.ts)         | Extract character ordering constraints + cycle detection |
| Minimum Height Trees             | [minimum-height-trees](../../leetcode/graph/kahn/minimum-height-trees.ts) | Iterative leaf removal                                   |
| Parallel Courses (Min Semesters) | [minimum-semesters](../../leetcode/graph/kahn/minimum-semesters.ts)       | Longest path in DAG via level tracking                   |

### Graph — Disjoint Sets (Union-Find)

| Problem                    | File                                                                       | Key Technique                                     |
| -------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------- |
| Number of Provinces        | [cities](../../leetcode/graph/disjoint-sets/cities.ts)                     | Count disconnected components                     |
| Earliest Acquaintance      | [friends](../../leetcode/graph/disjoint-sets/friends.ts)                   | Track friendship connectivity over time           |
| Smallest String with Swaps | [smallest-strings](../../leetcode/graph/disjoint-sets/smallest-strings.ts) | Group connected indices, sort chars within groups |

### Sort

| Problem                     | File                                                                              | Algorithm            | Key Technique                      |
| --------------------------- | --------------------------------------------------------------------------------- | -------------------- | ---------------------------------- |
| Sort an Array               | [sort-array](../../leetcode/sort/sort-array.ts)                                   | Merge / Radix / Heap | Multi-algorithm showcase           |
| Sort Colors                 | [sort-colors](../../leetcode/sort/sort-colors.ts)                                 | 3-way partition      | Dutch National Flag                |
| Insertion Sort List         | [insertion-sort-list](../../leetcode/sort/insertion-sort-list.ts)                 | Insertion Sort       | In-place linked list sort          |
| Maximum Gap                 | [maximum-gap](../../leetcode/sort/maximum-gap.ts)                                 | Radix Sort           | Linear-time sort constraint        |
| Height Checker              | [height-checker](../../leetcode/sort/height-checker.ts)                           | Count Sort           | Compare with expected sorted order |
| Minimum Absolute Difference | [minimum-absolute-difference](../../leetcode/sort/minimum-absolute-difference.ts) | Sort                 | Adjacent comparison after sorting  |
| Query Kth Smallest Trimmed  | [query-kth-smallest-trimmed](../../leetcode/sort/query-kth-smallest-trimmed.ts)   | Custom Sort          | Substring comparison sort          |
| Search a 2D Matrix II       | [search-2d-matrix](../../leetcode/sort/search-2d-matrix.ts)                       | MinHeap              | Sorted-matrix traversal            |
| Validate Binary Search Tree | [validate-bst](../../leetcode/sort/validate-bst.ts)                               | BST in-order         | Min/max constraint propagation     |

### Recursion

| Problem                       | File                                                                               | Key Technique                                |
| ----------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------- |
| Fibonacci Number              | [fibonacci](../../leetcode/recursion/fibonacci.ts)                                 | Memoisation / DP                             |
| Maximum Depth of Binary Tree  | [maximum-depth-binary-tree](../../leetcode/recursion/maximum-depth-binary-tree.ts) | Post-order traversal                         |
| Merge Two Sorted Lists        | [merge-two-sorted-lists](../../leetcode/recursion/merge-two-sorted-lists.ts)       | Recursive pointer advancement                |
| K-th Symbol in Grammar        | [nth-row-kth-symbol](../../leetcode/recursion/nth-row-kth-symbol.ts)               | Binary transformation rule                   |
| Pascal's Triangle             | [pascals-triangle](../../leetcode/recursion/pascals-triangle.ts)                   | Row generation, binomial coefficients        |
| Pow(x, n)                     | [pow-x-n](../../leetcode/recursion/pow-x-n.ts)                                     | Fast exponentiation (halving recursion)      |
| Reverse Linked List           | [reverse-linked-list](../../leetcode/recursion/reverse-linked-list.ts)             | Recursive list reversal                      |
| Search in BST                 | [search-bst](../../leetcode/recursion/search-bst.ts)                               | Left/right pruning by value                  |
| Swap Nodes in Pairs           | [swap-nodes-in-pairs](../../leetcode/recursion/swap-nodes-in-pairs.ts)             | Pairwise node exchange                       |
| Unique Binary Search Trees II | [unique-bsts-ii](../../leetcode/recursion/unique-bsts-ii.ts)                       | Catalan number recursion — generate all BSTs |

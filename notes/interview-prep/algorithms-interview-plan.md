# Pair Programming Interview Study Plan (1-2 weeks)

**Focus:** Algorithms & Data Structures | **Level:** Advanced | **Goal:** Breadth across 6 critical areas

---

## 📋 Quick Overview

- **22 core problems** in Phase 1 (3-4/day, 60-90 min each)
- **8-10 expansion problems** in Phase 2 (optional breadth)
- **Study method:** Cold solve → compare with repo → explain aloud
- **Pair coding emphasis:** Trade-offs, complexity analysis, edge cases
- **Timeline:** Week 1 = Phase 1, Week 2 = Phase 2 (if time allows)

---

## ✅ Phase 1: Core Problem Set (Weeks 1–1.5)

### **Category 1: Graph Algorithms (6 problems)** — Most Critical

_Understanding graph traversals + pathfinding is foundational for pair interviews_

#### BFS/DFS Fundamentals (3 problems)

- [ ] `leetcode/graph/bfs/all-paths.ts` — **Easy/Medium**
  - **Topic:** Basic DFS/recursion warm-up
  - **Focus:** Path enumeration, visited tracking
  - **Pair Programming Talking Points:** How does DFS differ from BFS for this problem? Space complexity of the result set?
  - **Reference Code:** `algorithms/graph/depth-first-search/`

- [ ] `leetcode/graph/dfs/clone-graph.ts` — **Medium**
  - **Topic:** Deep copy of graph with visited tracking
  - **Focus:** BFS/DFS with dictionary-based memoization
  - **Pair Programming Talking Points:** Why do you need a visited map? What happens without it?
  - **Reference Code:** `structures/graph/`

- [ ] `leetcode/graph/dfs/reconstruct-itinerary.ts` — **Medium-Hard**
  - **Topic:** Eulerian path variant; Hierholzer's algorithm
  - **Focus:** DFS with backtracking, edge consumption
  - **Pair Programming Talking Points:** Why does order of DFS matter here? How would you handle multiple valid itineraries?
  - **Reference Code:** `algorithms/graph/depth-first-search/`

#### Shortest Path & Dijkstra (1 problem)

- [ ] `leetcode/graph/dijkstra/network-delay-time.ts` — **Medium**
  - **Topic:** Classic Dijkstra's algorithm application
  - **Focus:** Priority queue (min-heap), relaxation, visited nodes
  - **Pair Programming Talking Points:** Why Dijkstra over BFS here? What's the time complexity with different heap implementations? Can you handle negative edges?
  - **Reference Code:** `algorithms/graph/dijkstra/`

#### Topological Sort / Kahn's Algorithm (2 problems)

- [ ] `leetcode/graph/kahn/alien-dictionary.ts` — **Hard**
  - **Topic:** Order inference via topological sort
  - **Focus:** Building graph from constraints, Kahn's algorithm, detecting cycles
  - **Pair Programming Talking Points:** How do you detect impossible cases? What's the relationship to topological sort?
  - **Reference Code:** `algorithms/graph/kahn/`

- [ ] `leetcode/graph/kahn/course-schedule-ii.ts` — **Medium**
  - **Topic:** Dependency resolution with topological ordering
  - **Focus:** Cycle detection in directed graphs, course ordering
  - **Pair Programming Talking Points:** How would you detect a cycle during topological sort? Why use Kahn's vs. DFS-based approach?
  - **Reference Code:** `algorithms/graph/kahn/`

**Daily Target:** Days 1-2 (solve 3/day)

---

### **Category 2: Heaps & Priority Queues (5 problems)**

_Critical for optimization; shows O(log n) thinking_

- [ ] `leetcode/heap/median-finder.ts` — **Hard**
  - **Topic:** Two heaps technique (very common interview pattern)
  - **Focus:** Max heap + min heap, balanced partition, lazy deletion
  - **Pair Programming Talking Points:** Why two heaps? How do you maintain balance? What's the trade-off vs. sorting?
  - **Reference Code:** `structures/heap/min-heap/`, `structures/heap/max-heap/`

- [ ] `leetcode/heap/kth-largest.ts` — **Medium**
  - **Topic:** Heap basics with stream updates
  - **Focus:** Min-heap of size k, insertion with eviction
  - **Pair Programming Talking Points:** Why maintain a heap of size k instead of sorting all elements? What's the space/time trade-off?
  - **Reference Code:** `structures/heap/`

- [ ] `leetcode/heap/top-k-frequent.ts` — **Medium**
  - **Topic:** Frequency counting + heap vs. bucket sort
  - **Focus:** Hash map + heap, or bucket sort optimization
  - **Pair Programming Talking Points:** Compare heap approach (O(n log k)) vs. bucket sort (O(n)). When would you use each?
  - **Reference Code:** `structures/heap/`, `algorithms/sort/non-comparison/bucket-sort/`

- [ ] `leetcode/heap/k-closest-points.ts` — **Medium**
  - **Topic:** Custom comparator + heap
  - **Focus:** Distance metric, max-heap trick for k smallest
  - **Pair Programming Talking Points:** Why use max-heap instead of min-heap? How do you define "closest"?
  - **Reference Code:** `structures/heap/`

- [ ] `leetcode/heap/connect-sticks.ts` — **Medium**
  - **Topic:** Greedy + heap optimization
  - **Focus:** Greedy problem selection, heap efficiency proof
  - **Pair Programming Talking Points:** Why is the greedy approach optimal here? Can you prove it? What's the cost model?
  - **Reference Code:** `structures/heap/`, `algorithms/greedy/`

**Daily Target:** Days 2-3 (solve 2.5/day, partial overlap with graphs)

---

### **Category 3: Recursion & Backtracking (4 problems)**

_Critical for pair programming: showing recursive thinking + optimization_

- [ ] `leetcode/recursion/merge-two-sorted-lists.ts` — **Easy**
  - **Topic:** Recursive base case pattern
  - **Focus:** Linked list traversal, recursive unwinding
  - **Pair Programming Talking Points:** How many recursive calls does this make? Can you convert to iterative? Which is clearer?
  - **Reference Code:** `structures/linked-list/`, `algorithms/recursion/`

- [ ] `leetcode/recursion/reverse-linked-list.ts` — **Medium**
  - **Topic:** Tail recursion optimization
  - **Focus:** Reverse pointers, recursive vs. iterative trade-off
  - **Pair Programming Talking Points:** What's the recursion depth? Can you tail-optimize? Why choose recursion here?
  - **Reference Code:** `structures/linked-list/`, `algorithms/recursion/`

- [ ] `leetcode/recursion/swap-nodes-in-pairs.ts` — **Medium**
  - **Topic:** Pattern variation on linked list recursion
  - **Focus:** Pointer manipulation, recursive pattern matching
  - **Pair Programming Talking Points:** How does this differ from reverse? What's the base case here?
  - **Reference Code:** `structures/linked-list/`

- [ ] `leetcode/recursion/unique-bsts-ii.ts` — **Hard**
  - **Topic:** Backtracking + memoization opportunity
  - **Focus:** Generating all valid structures, pruning search space
  - **Pair Programming Talking Points:** How many unique BSTs exist? Can you optimize with memoization? What's the state?
  - **Reference Code:** `algorithms/recursion/`, `structures/tree/bst/`

**Daily Target:** Days 3-4 (solve 2/day)

---

### **Category 4: Sorting & Selection (4 problems)**

_Pair programming bonus: compare algorithms, discuss trade-offs_

- [ ] `leetcode/sort/sort-colors.ts` — **Medium**
  - **Topic:** Three-way partition (Dutch flag problem)
  - **Focus:** In-place partitioning, two-pointer technique
  - **Pair Programming Talking Points:** Why is this better than sorting? Can you do it in one pass? What's the minimum swaps needed?
  - **Reference Code:** `algorithms/sort/` (compare sorting approaches)

- [ ] `leetcode/sort/insertion-sort-list.ts` — **Medium**
  - **Topic:** Insertion sort on linked list
  - **Focus:** List node insertion, sorted position finding
  - **Pair Programming Talking Points:** Why insertion sort works well here (can't do merge sort efficiently). Time complexity? Can you optimize?
  - **Reference Code:** `algorithms/sort/comparison/insertion-sort/`, `structures/linked-list/`

- [ ] `leetcode/sort/maximum-gap.ts` — **Hard**
  - **Topic:** Radix sort application (non-comparison sort)
  - **Focus:** Linear-time sorting, breaking ties, bucket-based counting
  - **Pair Programming Talking Points:** Why can't comparison-based sorting beat O(n log n)? How does radix sort work? When use it?
  - **Reference Code:** `algorithms/sort/non-comparison/radix-sort/`

- [ ] `leetcode/sort/search-2d-matrix.ts` — **Medium**
  - **Topic:** Binary search variant on 2D structure
  - **Focus:** Treating 2D array as virtual 1D sorted array
  - **Pair Programming Talking Points:** Why can you treat 2D as 1D? What about sorting order guarantees? Can you solve without conversion?
  - **Reference Code:** `algorithms/sort/` (binary search concepts)

**Daily Target:** Days 4-5 (solve 2/day)

---

### **Category 5: Disjoint-Set (Union-Find) (2 problems)**

_Small set but very powerful; often overlooked—interview differentiator_

- [ ] `leetcode/graph/disjoint-sets/friends.ts` — **Medium**
  - **Topic:** Connected components via union-find
  - **Focus:** Union-by-rank, path compression, component counting
  - **Pair Programming Talking Points:** What's union-find's time complexity? Why path compression matters? DFS alternative?
  - **Reference Code:** `structures/disjoint-set/`

- [ ] `leetcode/graph/disjoint-sets/cities.ts` — **Medium**
  - **Topic:** Edge case handling in DSU
  - **Focus:** Cycle detection, minimal spanning tree concepts
  - **Pair Programming Talking Points:** How detect cycles with union-find? What's the edge case with isolated nodes?
  - **Reference Code:** `structures/disjoint-set/`

**Daily Target:** Days 5-6 (solve 1/day)

---

### **Category 6: Trees (BST & Basic Operations) (3 problems)**

_Foundational; pair programming often includes tree variations_

- [ ] `leetcode/recursion/search-bst.ts` — **Medium**
  - **Topic:** BST properties + recursion
  - **Focus:** Binary search on tree structure, pruning branches
  - **Pair Programming Talking Points:** How do BST properties help? What if tree weren't BST? Time/space complexity?
  - **Reference Code:** `structures/tree/bst/`

- [ ] `leetcode/recursion/maximum-depth-binary-tree.ts` — **Easy**
  - **Topic:** Tree traversal base case
  - **Focus:** DFS/BFS on trees, recursion termination
  - **Pair Programming Talking Points:** Recursive vs. iterative? Why is height = max(left, right) + 1?
  - **Reference Code:** `structures/tree/`, `algorithms/recursion/`

- [ ] `leetcode/sort/validate-bst.ts` — **Medium**
  - **Topic:** BST validation with constraints
  - **Focus:** Node value constraints (min/max bounds), inorder traversal
  - **Pair Programming Talking Points:** Why simple `left.val < root.val < right.val` fails? How do you track bounds?
  - **Reference Code:** `structures/tree/bst/`

**Daily Target:** Days 6-7 (solve 1.5/day)

---

## 📊 Phase 1 Summary

| Category         | Problems | Difficulty  | Days       | Total Time |
| ---------------- | -------- | ----------- | ---------- | ---------- |
| **Graphs**       | 6        | Easy-Hard   | 2          | 9-13.5h    |
| **Heaps**        | 5        | Medium-Hard | 2          | 7.5-11.25h |
| **Recursion**    | 4        | Easy-Hard   | 1.5        | 6-9h       |
| **Sorting**      | 4        | Medium-Hard | 1.5        | 6-9h       |
| **Disjoint-Set** | 2        | Medium      | 1          | 3-4.5h     |
| **Trees**        | 3        | Easy-Medium | 1          | 4.5-6.75h  |
| **TOTAL**        | **24**   | Mixed       | **9 days** | **36-54h** |

\*With 3-4 problems/day at 60-90 min each, Phase 1 fits in **7-9 days\***

---

## 🚀 Phase 2: Breadth & Edge Cases (Week 2, Optional)

### Expand Heap Problems (3)

- [ ] `leetcode/heap/meeting-rooms.ts` — **Medium**
  - **Topic:** Interval scheduling + heap
  - **Pair Programming Talking Points:** Why is this different from the classic interval problem?

- [ ] `leetcode/heap/kth-smallest-matrix.ts` — **Hard**
  - **Topic:** Heap on 2D sorted matrix
  - **Pair Programming Talking Points:** How do you avoid exploring the entire matrix?

- [ ] `leetcode/heap/last-stone.ts` — **Medium**
  - **Topic:** Greedy + max-heap simulation
  - **Pair Programming Talking Points:** Why max-heap? Could min-heap work?

### Expand Graph Problems (3)

- [ ] `leetcode/graph/dfs/all-paths-lead-to-destination.ts` — **Medium**
  - **Topic:** Graph validation via DFS
  - **Pair Programming Talking Points:** How to detect impossible paths?

- [ ] `leetcode/graph/bfs/populating-next-pointers.ts` — **Medium**
  - **Topic:** Level-order traversal on linked tree
  - **Pair Programming Talking Points:** Why BFS here instead of DFS?

- [ ] `leetcode/graph/kahn/minimum-height-trees.ts` — **Medium**
  - **Topic:** Topological sort + tree center concept
  - **Pair Programming Talking Points:** How do you find graph centers?

### Advanced Recursion/DP (2)

- [ ] `leetcode/recursion/fibonacci.ts` — **Easy/Medium**
  - **Topic:** Compare recursive, memoized, iterative approaches
  - **Pair Programming Talking Points:** Time/space trade-offs of each method?

- [ ] `leetcode/recursion/pow-x-n.ts` — **Medium**
  - **Topic:** Fast exponentiation via recursion
  - **Pair Programming Talking Points:** Why divide-and-conquer works? Handling negative exponents?

### Additional Sorting (2)

- [ ] `leetcode/sort/height-checker.ts` — **Easy**
  - **Topic:** Frequency-based sorting
  - **Pair Programming Talking Points:** Is sorting necessary? Can you count instead?

- [ ] `leetcode/sort/minimum-absolute-difference.ts` — **Easy**
  - **Topic:** Sorting + greedy insight
  - **Pair Programming Talking Points:** Why does sorting help? What's the key insight?

**Phase 2 Total:** 10 problems in 2-3 days (if time permits)

---

## 🎯 How to Study Each Problem

### Step 1: Cold Solve (40-60 min)

1. Read problem 2-3 times until you understand constraints
2. **Don't look at the repo solution yet**
3. Write your approach on paper first (pseudocode)
4. Code it up in your editor (any language)
5. Test against provided examples + edge cases
6. Analyze your time/space complexity

### Step 2: Compare & Learn (15-20 min)

1. Open the corresponding file in `leetcode/` folder
2. Compare your solution to the repo's solution
3. Note any differences:
   - Different algorithm choice? Why might one be better?
   - Edge cases you missed?
   - Optimization tricks?
4. If repo solution is better, understand **why** you didn't see it

### Step 3: Explain Aloud (10-15 min) ⭐ CRITICAL FOR PAIRING

1. Explain your approach to an imaginary interviewer:
   - "I would use a [data structure] because..."
   - "The time complexity is O(...) because..."
   - "Edge cases: [list them]"
   - "If asked to optimize, I could..."
2. **Pair programming is 50% explanation, 50% coding**
3. Practice this daily—you'll sound confident in real interviews

### Step 4: Reference the Core Implementations (5-10 min)

1. Review the algorithm/data structure reference:
   - Problem uses a heap? Check `structures/heap/`
   - Problem uses graphs? Check `algorithms/graph/dijkstra/` or `algorithms/graph/kahn/`
2. Understand the underlying implementation, not just API usage

---

## 🛠️ Data Structures & Algorithms Reference

### By Problem Category:

| Category         | Data Structure Ref                                       | Algorithm Ref                                                                                                                            |
| ---------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Graphs**       | `structures/graph/`                                      | `algorithms/graph/breadth-first-search/`, `algorithms/graph/depth-first-search/`, `algorithms/graph/dijkstra/`, `algorithms/graph/kahn/` |
| **Heaps**        | `structures/heap/min-heap/`, `structures/heap/max-heap/` | (Heap operations built into structures)                                                                                                  |
| **Recursion**    | `structures/linked-list/`, `structures/tree/`            | `algorithms/recursion/`                                                                                                                  |
| **Sorting**      | N/A                                                      | `algorithms/sort/comparison/`, `algorithms/sort/divide-conquer/`, `algorithms/sort/non-comparison/`                                      |
| **Disjoint-Set** | `structures/disjoint-set/`                               | (Union-find built into structure)                                                                                                        |
| **Trees**        | `structures/tree/bst/`, `structures/tree/avl/`           | (Tree ops in structures)                                                                                                                 |

### Utility Helpers:

- `algorithms/utils/build-adjacency-list/` — For graph problems
- `algorithms/utils/partition/` — For sorting/selection problems
- `algorithms/complexity-theory/` — Reference Big O analysis

---

## 📅 Sample 1-Week Schedule

### **Day 1 (Tuesday):**

- [ ] morning: `all-paths.ts` (graph/bfs) + explain aloud
- [ ] afternoon: `clone-graph.ts` (graph/dfs) + explain aloud
- [ ] evening: Review `structures/graph/` and `algorithms/graph/depth-first-search/`

### **Day 2 (Wednesday):**

- [ ] morning: `reconstruct-itinerary.ts` (graph/dfs) + explain aloud
- [ ] afternoon: `network-delay-time.ts` (graph/dijkstra) + explain aloud
- [ ] evening: Review `algorithms/graph/dijkstra/`

### **Day 3 (Thursday):**

- [ ] morning: `alien-dictionary.ts` (graph/kahn) + explain aloud
- [ ] afternoon: `course-schedule-ii.ts` (graph/kahn) + explain aloud
- [ ] evening: Review `algorithms/graph/kahn/`

### **Day 4 (Friday):**

- [ ] morning: `median-finder.ts` (heap) + explain aloud
- [ ] afternoon: `kth-largest.ts` (heap) + explain aloud
- [ ] evening: Mock pairing session (randomly pick 2 problems from Days 1-3, solve with a friend)

### **Day 5 (Saturday):**

- [ ] morning: `top-k-frequent.ts` (heap) + explain aloud
- [ ] afternoon: `k-closest-points.ts` (heap) + explain aloud
- [ ] evening: Review `structures/heap/`

### **Day 6 (Sunday):**

- [ ] morning: `connect-sticks.ts` (heap) + explain aloud
- [ ] afternoon: `merge-two-sorted-lists.ts` (recursion) + explain aloud
- [ ] evening: Rest or light review of weak areas

### **Day 7 (Monday):**

- [ ] morning: `reverse-linked-list.ts` (recursion) + explain aloud
- [ ] afternoon: `swap-nodes-in-pairs.ts` (recursion) + explain aloud
- [ ] evening: `unique-bsts-ii.ts` (recursion) + explain aloud

_(Continue Days 8-9 with Sorting, DSU, Trees)_

---

## ⚠️ Common Pitfalls to Watch For

### **Graph Problems:**

- Forgetting visited tracking → infinite loops
- Not handling disconnected components
- Confusing BFS (shortest path) vs. DFS (all paths)
- Dijkstra edge case: no path exists (INF)

### **Heap Problems:**

- Off-by-one with k-th element
- Max-heap vs. min-heap confusion
- Not handling duplicates correctly
- Forgetting heap isn't fully sorted (only top-k)

### **Recursion Problems:**

- Stack overflow on large inputs
- Not handling base case correctly
- Memory overhead of recursion (consider iterative)
- Off-by-one in indices

### **Sorting/Selection:**

- Assuming optimal algorithm always wins (context matters)
- Forgetting about stable sorting
- Not considering space complexity (in-place vs. extra space)
- Radix sort only works for non-negative integers (usually)

### **Disjoint-Set:**

- Forgetting path compression
- Not using union-by-rank (leads to O(n) worst case)
- Assuming DSU always better than DFS (same complexity, different constant factors)

### **Tree Problems:**

- Confusing height vs. depth
- BST validation: simple comparison isn't enough (need bounds)
- Not handling null/empty subtrees correctly

---

## 🎬 Pair Programming Practice

### Weekly Mocking Schedule:

- **After Day 4:** Mock pair on 2 random Phase 1 problems (60 min total)
- **After Day 7:** Mock pair on 3 random Phase 1 problems (90 min total)
- **Day 9+:** If doing Phase 2, mock pair on Phase 1 + Phase 2 mix

### Mock Pairing Rules:

1. **Explain while coding** — Don't go silent for > 2 min
2. **Ask for feedback** — "Does this approach make sense?" "What am I missing?"
3. **Handle interruptions well** — "Good point, let me reconsider..."
4. **Admit unknowns** — "I haven't solved this pattern before; let me think..."
5. **Discuss trade-offs** — "This is O(n log n) space but O(n) time vs..."

---

## ✨ Final Checklist

Before your real interview:

- [ ] Solved all 24 Phase 1 problems cold (without looking at repo)
- [ ] Explained all 24 problems aloud fluently
- [ ] Reviewed corresponding algorithm/data structure implementations
- [ ] Done 2+ mock pairing sessions
- [ ] Identified your weak areas and re-studied them
- [ ] Can discuss trade-offs (time/space, algorithm choice, etc.)
- [ ] Comfortable with `structures/` and `algorithms/` reference materials
- [ ] Can write clean, readable code under pressure

---

## 📚 Additional Resources from Your Repo

### When Stuck on a Concept:

- **Complexity Analysis:** `algorithms/complexity-theory/`
- **Sorting Trade-offs:** `algorithms/sort/` (11 sorting algorithms to compare)
- **Design Patterns** (for system design context): `patterns/behavioral/`, `patterns/creational/`, `patterns/structural/`

### For Deep Dives (if time allows):

- Review `structures/tree/avl/` for self-balancing trees (interview bonus)
- Study `algorithms/sort/non-comparison/` to understand linear-time sorting concepts
- Explore `algorithms/greedy/` for greedy algorithm patterns

---

**Good luck! You've got this.** 💪

Remember: In pair programming interviews, **clear communication beats clever algorithms**. They're evaluating how you think and collaborate, not just if you get the right answer. Practice explaining your approach as much as you code.

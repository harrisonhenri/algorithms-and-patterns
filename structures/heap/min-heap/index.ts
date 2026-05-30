import { Heap } from "..";

/**
 * MinHeap data structure where the parent node is smaller than its children.
 *
 * ## 📋 Heap Invariant (The Contract)
 *
 * **For every node i (except root):**
 * ```
 * parent(i) <= i  (parents dominate children)
 * ```
 * The minimum element is ALWAYS at the root.
 *
 * All operations (`add`, `poll`, `heapify`) work by **restoring this invariant
 * after a controlled violation**.
 *
 * ## 🔑 Key Insight: Direction Depends on Where Violation Can Occur
 *
 * | Operation | Where invariant breaks     | Fix direction | Method         |
 * |-----------|---------------------------|---------------|----------------|
 * | **add**   | Between node and **parent** | ⬆ upward     | `bubbleUp`    |
 * | **poll**  | Between node and **children** | ⬇ downward   | `bubbleDown`  |
 * | **heapify** | Between node and **children** | ⬇ downward   | `bubbleDown`  |
 *
 * **Why only one direction per operation?**
 * Heap operations are designed so each mutation creates at most ONE type of violation.
 * This keeps all operations O(log n) or O(n).
 *
 * **Time Complexity:**
 * - `add()` → **O(log n)** - leaf might be too small → bubble UP
 * - `poll()` → **O(log n)** - root might be too large → bubble DOWN
 * - `peek()` → **O(1)** - just read root
 *
 * **Space Complexity:**
 * - **O(n)** - Stores n elements in the internal array
 *
 * ## 🎯 MinHeap Decision Framework
 *
 * ### The Core Rule
 *
 * **MinHeap = "What comes next?" (Enumeration/Exploration)**
 *
 * Use MinHeap when:
 * - You need to **repeatedly extract elements in sorted order**
 * - You **discover new candidates dynamically** as you explore
 * - Your goal is **"next smallest"**, not **"keep only top k"**
 *
 * The heap represents a **frontier of candidates**, not a filter.
 *
 * ### 📊 Concrete Problem Patterns (When to Use MinHeap)
 *
 * | Problem | Why | Pattern |
 * |---------|-----|---------|
 * | Merge k sorted lists | Need next smallest from k sources | Pop → push from sources |
 * | **Kth smallest in sorted matrix** | Enumerate elements in order | Pop corner → add neighbors |
 * | Dijkstra's shortest path | Next closest unvisited node | Pop node → relax edges |
 * | Prim's MST | Next cheapest edge to tree | Pop edge → add new candidates |
 * | A* search | Best candidate first | Pop state → expand neighbors |
 * | External merge sort | Pull smallest from buffers | Pop → read from file |
 * | Event simulation | Time-ordered events | Pop event → add future events |
 * | CPU scheduling (SJF) | Smallest remaining time | Pop job → add new jobs |
 * | Sliding window median | Track min/max of lower/upper half | Two heaps, partition data |
 *
 * 👉 **Pattern recognition:**
 * > "I pop something and then **discover new candidates** that were hidden before."
 *
 * ### 📐 Key Dimensions for MinHeap
 *
 * **Dimension 1: Enumeration vs Filtering**
 * - ✅ MinHeap → **Enumeration** (need sorted order)
 * - ❌ MinHeap → **NOT filtering** (for that, use MaxHeap or opposite heap)
 *
 * **Dimension 2: Input Structure**
 * - **Sorted/Structured input** → MinHeap shines
 *   - Kth smallest matrix: O(k log k), not O(n² log n²)
 *   - Merge sorted lists: O(n log k), not O(n²)
 *   - Reason: You only explore reachable candidates
 *
 * - **Unstructured input** → MinHeap is weaker
 *   - Would need to push all n elements
 *   - Use filtering heap instead for top-k problems
 *
 * **Dimension 3: Heap Growth**
 * - ✅ MinHeap → **Growing heap** (add as you explore)
 *   - Pop → push neighbors → heap expands dynamically
 *   - Size grows with exploration, not capped
 *
 * - ❌ MinHeap → **NOT bounded heap** (for that, use bounded opposite heap)
 *
 * ### 🔦 Visual Intuition: MinHeap as a Spotlight
 *
 * ```
 * MinHeap = 🔦 Spotlight in the dark
 *
 * You don't know the future — you discover it gradually.
 * You illuminated the next smallest, then find neighbors.
 *
 * Examples:
 *   - Dijkstra: You discover closest nodes
 *   - Merge lists: You discover which list has next smallest
 *   - Sorted matrix: You discover row/col neighbors of smallest
 * ```
 *
 * ### ⚠️ Common Mistake
 *
 * ❌ **WRONG:** "I need kth smallest, so MinHeap!"
 *
 * ✅ **CORRECT:** Ask first:
 * > "Do I need to **enumerate in sorted order**, or just **keep top k**?"
 *
 * - Enumeration? → MinHeap
 * - Keep top k? → Opposite heap (MaxHeap for smallest k)
 *
 * ### 📋 Decision Table for MinHeap vs MaxHeap
 *
 * | Question | MinHeap | MaxHeap |
 * |----------|---------|---------|
 * | "What comes **next** (smallest)?" | ✅ | ❌ |
 * | "Keep smallest k elements?" | ❌ | ✅ |
 * | Explore neighbors dynamically? | ✅ | ❌ |
 * | Heap must stay size ≤ k? | ❌ | ✅ |
 * | Stream arrives, find top k? | ❌ | ✅ |
 * | Matrix/graph traversal? | ✅ | ❌ |
 * | Can stop early at k? | ✅ | ✅ (different reason) |
 *
 * **Use cases:**
 * - Priority queues (where "first" = minimum)
 * - Finding minimum elements efficiently
 * - Traversing sorted matrix/graph
 * - Dijkstra's shortest path
 * - A* pathfinding
 * - Merging sorted sequences
 * - Event-driven simulation
 *
 * @date 17/12/2025 - 00:00:00 | Enhanced 26/01/2026
 */
export class MinHeap<T> extends Heap<T> {
  private comparator: (a: T, b: T) => number;
  private maxSize?: number; // Optional capacity limit

  /**
   * Creates a new MinHeap with optional custom comparator and max size.
   *
   * @param {Function} [comparator] - Optional comparison function.
   *   Returns: < 0 if a < b, 0 if a === b, > 0 if a > b
   *   If not provided, uses default < operator for primitives
   * @param {number} [maxSize] - Optional maximum heap capacity
   * @param {T[]} [elements] - Optional initial elements to build the heap in O(n log n)
   *
   * @example
   * // Min-heap of objects with custom comparator
   * const minHeap = new MinHeap((a, b) => a.priority - b.priority);
   *
   * @example
   * // Min-heap of numbers with capacity limit
   * const minHeap = new MinHeap(undefined, 10);
   *
   * @example
   * // Min-heap of numbers (default)
   * const minHeap = new MinHeap();
   */
  constructor(
    comparator?: (a: T, b: T) => number,
    maxSize?: number,
    elements?: T[],
  ) {
    super();
    this.comparator = comparator || this.defaultComparator;
    this.maxSize = maxSize;

    elements?.forEach((el) => this.add(el));
  }

  private defaultComparator = (a: T, b: T) => {
    if (a < b) return -1;

    if (a > b) return 1;

    return 0;
  };

  /**
   * **HEAPIFY: Build heap from array in O(n) time (bottom-up)**
   *
   * Replaces current heap with heapified array. Starts from last non-leaf node
   * and bubbles down.
   *
   * **Invariant Analysis:**
   * - Start: only leaves are valid heaps
   * - Process i: both children of i are ALREADY heaps
   * - Violation can only occur: between i and its children (below)
   * - Fix: bubble DOWN from i
   *
   * **Why bubbleDown (not up)?**
   * ```
   *         i           ← violation can only be HERE (parent too large)
   *        / \
   *      heap heap     ← children already satisfy invariant
   * ```
   * The problem is always downward. If we bubbled up, we'd break the parent's
   * invariant and lose the bottom-up guarantee.
   *
   * @param {T[]} items - Array of items to heapify
   * @returns {void}
   * @time O(n) - Linear time heap construction
   * @space O(1) - Constant space (in-place rearrangement)
   */
  heapify(items: T[]): void {
    this.items = [...items];
    // Start from the last non-leaf node and bubble down
    for (let i = Math.floor(this.items.length / 2) - 1; i >= 0; i--) {
      this.bubbleDownFromIndex(i);
    }
  }

  /**
   * Creates a new MinHeap from an array in O(n) time using heapify.
   * More efficient than adding elements one-by-one for bulk initialization.
   *
   * @static
   * @param {T[]} items - Array of items to build heap from
   * @param {Function} [comparator] - Optional comparison function
   * @param {number} [maxSize] - Optional maximum heap capacity
   * @returns {MinHeap<T>} A new MinHeap containing all items
   * @time O(n) - Linear time heap construction
   * @space O(n) - Stores n elements
   *
   * @example
   * const heap = MinHeap.from([3, 1, 4, 1, 5, 9, 2, 6]);
   * console.log(heap.peek()); // 1
   */
  static from<T>(
    items: T[],
    comparator?: (a: T, b: T) => number,
    maxSize?: number,
  ): MinHeap<T> {
    const heap = new MinHeap(comparator, maxSize);
    heap.heapify(items);
    return heap;
  }

  /**
   * **ADD: Insert element and restore invariant (bubble up)**
   *
   * Inserts at the last position (as a leaf), then bubbles up to correct position.
   *
   * **Invariant Analysis:**
   * - New node: inserted as leaf (no children)
   * - Children check: ✅ passes (no children to violate with)
   * - Other nodes: ✅ untouched
   * - Parent check: ❌ might be violated (new node could be < parent)
   *
   * **Why bubbleUp (not down)?**
   * ```
   *        P
   *        |
   *      NEW  ← violation can ONLY be HERE (child too small)
   * ```
   * The problem is always upward (toward root). There's nothing below to fix.
   *
   * **Invariant guarantee:** After add + bubbleUp, heap property restored.
   *
   * @param {T} item - The item to add
   * @returns {boolean} true if added successfully, false if heap is full
   * @time O(log n) - Bubbles up from leaf to potentially root
   * @space O(1) - Constant space; no additional data structures needed
   */
  add(item: T): boolean {
    if (this.maxSize && this.items.length >= this.maxSize) {
      console.warn("Heap capacity exceeded! Max size: " + this.maxSize);
      return false;
    }
    this.items[this.items.length] = item;
    this.bubbleUp();
    return true;
  }

  /**
   * **POLL: Remove min element and restore invariant (bubble down)**
   *
   * Removes root, moves last element to root, then bubbles down to correct position.
   *
   * **Invariant Analysis:**
   * - Root: no parent to check ✅
   * - All subtrees: still valid heaps ✅
   * - Root vs children: ❌ might be violated (new root could be > children)
   *
   * **Why bubbleDown (not up)?**
   * ```
   *      NEW_ROOT
   *      /     \
   *   child   child  ← violation can ONLY be HERE (root too large)
   * ```
   * The problem is always downward (toward leaves). Root has no parent to go up to.
   *
   * **Invariant guarantee:** After poll + bubbleDown, heap property restored.
   *
   * @returns {T} The minimum element from the heap
   * @time O(log n) - Bubbles down from root to potentially leaf
   * @space O(1) - Constant space; no additional data structures needed
   */
  poll(): T {
    const item = this.items[0];
    this.items[0] = this.items[this.items.length - 1];
    this.items.pop();
    this.bubbleDown();
    return item;
  }

  /**
   * **BUBBLEDOWN: Fix downward violations**
   *
   * Moves node down the tree by repeatedly swapping with the smaller child until
   * the node is <= both children (heap property satisfied).
   *
   * **When used:**
   * - After `poll()`: root might be larger than children
   * - During `heapify()`: parent might be larger than children
   *
   * **Loop invariant:**
   * At each step, violations below current index are fixed; violations above
   * are not our concern (they were already correct or will be handled by caller).
   *
   * @private
   * @time O(log n) - Traverses from root to potentially a leaf
   * @space O(1) - Constant space; uses only index variable
   */
  bubbleDown() {
    this.bubbleDownFromIndex(0);
  }

  /**
   * **BUBBLEDOWNFROMINDEX: Fix downward violations starting at index**
   *
   * Helper for `bubbleDown()` (poll) and `heapify()`. Shared logic for
   * moving a node down the tree.
   *
   * **Why separate?** During heapify we call this on many indices; reusing
   * the logic avoids duplication.
   *
   * @private
   * @param {number} index - Starting index for bubble down operation
   * @time O(log n) - Traverses from index to potentially a leaf
   * @space O(1) - Constant space; uses only index variable
   */
  private bubbleDownFromIndex(index: number) {
    while (true) {
      const leftIdx = this.leftChildIndex(index);
      const rightIdx = this.rightChildIndex(index);
      let smallest = index;

      // Check if left child exists and is smaller than current smallest
      if (
        leftIdx < this.items.length &&
        this.comparator(this.items[leftIdx], this.items[smallest]) < 0
      ) {
        smallest = leftIdx;
      }

      // Check if right child exists and is smaller than current smallest
      if (
        rightIdx < this.items.length &&
        this.comparator(this.items[rightIdx], this.items[smallest]) < 0
      ) {
        smallest = rightIdx;
      }

      // If smallest is not current index, swap and continue bubbling
      if (smallest !== index) {
        this.swap(index, smallest);
        index = smallest;
      } else {
        // Heap property satisfied
        break;
      }
    }
  }

  /**
   * **BUBBLEUP: Fix upward violations**
   *
   * Moves node up the tree by repeatedly swapping with parent until
   * the node is >= its parent (heap property satisfied).
   *
   * **When used:**
   * - After `add()`: new leaf might be smaller than its parent
   *
   * **Loop invariant:**
   * At each step, violations above current index are fixed; violations below
   * are not our concern (leaf has no children).
   *
   * @private
   * @time O(log n) - Traverses from leaf to potentially the root
   * @space O(1) - Constant space; uses only index variable
   */
  bubbleUp() {
    let index = this.items.length - 1;
    while (
      this.parent(index) &&
      this.comparator(this.items[index], this.parent(index)) < 0
    ) {
      this.swap(this.parentIndex(index), index);
      index = this.parentIndex(index);
    }
  }

  /**
   * Returns a string representation of the heap for debugging.
   *
   * @returns {string} Array-like string of heap elements
   */
  toString(): string {
    if (this.items.length === 0) {
      return "Empty heap";
    }
    return "[" + this.items.join(", ") + "]";
  }
}

// Example usage
if (require.main === module) {
  // Example 1: Basic min-heap with numbers
  console.log("=== Example 1: Basic Min-Heap ===");
  const minHeap = new MinHeap<number>();
  minHeap.add(5);
  minHeap.add(3);
  minHeap.add(7);
  minHeap.add(1);
  minHeap.add(9);

  console.log("Heap contents:", minHeap.toString());
  console.log("Min element:", minHeap.peek()); // 1
  console.log("Poll min:", minHeap.poll()); // 1
  console.log("After poll:", minHeap.toString());

  // Example 2: Min-heap with custom comparator
  console.log("\n=== Example 2: Custom Comparator ===");
  interface Task {
    id: string;
    priority: number;
  }

  const priorityHeap = new MinHeap<Task>((a, b) => a.priority - b.priority);
  priorityHeap.add({ id: "task1", priority: 5 });
  priorityHeap.add({ id: "task2", priority: 2 });
  priorityHeap.add({ id: "task3", priority: 8 });
  priorityHeap.add({ id: "task4", priority: 1 });

  console.log("Highest priority task:", priorityHeap.peek()); // { id: 'task4', priority: 1 }
  while (priorityHeap.size() > 0) {
    console.log("Processing:", priorityHeap.poll());
  }

  // Example 3: Building heap from array using heapify
  console.log("\n=== Example 3: Heapify ===");
  const data = [9, 5, 6, 2, 3, 7, 1, 4, 8];
  const heap = MinHeap.from(data);
  console.log("Heapified:", heap.toString());
  console.log("Min:", heap.peek()); // 1

  // Example 4: Heap with capacity limit
  console.log("\n=== Example 4: Capacity Limited Heap ===");
  const limitedHeap = new MinHeap<number>(undefined, 3);
  console.log("Add 5:", limitedHeap.add(5)); // true
  console.log("Add 3:", limitedHeap.add(3)); // true
  console.log("Add 7:", limitedHeap.add(7)); // true
  console.log("Add 1:", limitedHeap.add(1)); // false (exceeds capacity)
  console.log("Limited heap:", limitedHeap.toString()); // [3, 5, 7]

  // Example 5: Using in a sorting context
  console.log("\n=== Example 5: Heap Sort ===");
  const unsorted = [64, 34, 25, 12, 22, 11, 90];
  const sortedHeap = MinHeap.from(unsorted);
  const sorted = [];
  while (sortedHeap.size() > 0) {
    sorted.push(sortedHeap.poll());
  }
  console.log("Original:", unsorted);
  console.log("Sorted:", sorted); // [11, 12, 22, 25, 34, 64, 90]
}

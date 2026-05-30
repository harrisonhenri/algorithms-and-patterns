import { Heap } from "..";

/**
 * MaxHeap data structure where the parent node is larger than its children.
 *
 * ## 📋 Heap Invariant (The Contract)
 *
 * **For every node i (except root):**
 * ```
 * parent(i) >= i  (parents dominate children)
 * ```
 * The maximum element is ALWAYS at the root.
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
 * - `add()` → **O(log n)** - leaf might be too big → bubble UP
 * - `poll()` → **O(log n)** - root might be too small → bubble DOWN
 * - `peek()` → **O(1)** - just read root
 *
 * **Space Complexity:**
 * - **O(n)** - Stores n elements in the internal array
 *
 * ## 🎯 MaxHeap Decision Framework
 *
 * ### The Core Rule
 *
 * **MaxHeap = "What should I discard?" (Filtering/Gatekeeper)**
 *
 * Use MaxHeap when:
 * - You only care about **keeping the smallest k elements**
 * - Everything larger than current k must be **discarded**
 * - Your goal is **"keep only top k"**, not **"enumerate in order"**
 * - **Heap size is bounded** at k (gatekeeper logic)
 *
 * The heap is acting as a **gatekeeper/filter**, not an explorer.
 *
 * ### 📊 Concrete Problem Patterns (When to Use MaxHeap)
 *
 * | Problem | Goal | MaxHeap Size | Why |
 * |---------|------|------|--------|
 * | **K smallest numbers** | Keep smallest k | MaxHeap(k) | Peek = largest of k smallest → throw away |
 * | **Top K frequent elements** | Keep k most frequent | MinHeap(k) | Opposite: keep k, discard large frequencies |
 * | **Weakest K rows** | Keep k weakest rows | MaxHeap(k) | Peek = strongest of k weakest → replace |
 * | **K closest points** | Keep k nearest points | MaxHeap(k) | Peek = farthest of k nearest → discard |
 * | **Streaming median (lower half)** | Keep bottom 50% | MaxHeap | Partition data: lower = max half |
 * | **Leaderboard top k** | Keep top k scores | MinHeap(k) | Peek = lowest score → remove if beaten |
 * | **Memory-limited top k** | Can't store all n | Bounded heap(k) | Streaming: add if better, evict worst |
 * | **Stock span** | Previous greater element | MaxHeap/Stack | Discard smaller elements |
 *
 * 👉 **Pattern recognition:**
 * > "When heap grows beyond k, **something must be thrown away**."
 * > Root is the candidate for eviction.
 *
 * ### 🗑️ Visual Intuition: MaxHeap as a Trash Can
 *
 * ```
 * MaxHeap = 🗑️ Trash can (size k)
 *
 * You don't care about order — only survival.
 * The root is the FIRST to go if something better arrives.
 *
 * Examples:
 *   - K smallest: root is largest of the k, evict it when new smaller arrives
 *   - K frequent: keep k, throw away the one with lowest frequency
 *   - Weakest rows: root is strongest of k weakest, replace with actual weaker row
 * ```
 *
 * ### 📐 Key Dimensions for MaxHeap Filtering
 *
 * **Dimension 1: Enumeration vs Filtering**
 * - ❌ MaxHeap → **NOT enumeration** (don't need sorted order)
 * - ✅ MaxHeap → **Filtering** (keep only k, discard rest)
 *
 * **Dimension 2: What "Top K" Means**
 * - **MaxHeap(size=k)** → Keep smallest k (evict largest)
 *   - Use when: want k smallest numbers from stream
 *   - Root (max of k smallest) is the eviction candidate
 *
 * - **MinHeap(size=k)** → Keep largest k (evict smallest)
 *   - Use when: want k largest numbers from stream
 *   - Root (min of k largest) is the eviction candidate
 *
 * **Dimension 3: Heap Size is Always Bounded**
 * - ✅ MaxHeap → **Heap size capped at k**
 *   - Logic: `if size > k: poll()`
 *   - Space: O(k), not O(n)
 *
 * - ❌ MaxHeap → **NOT growing unbounded**
 *   - For that, use MinHeap exploration
 *
 * ### ⚠️ Common Mistake
 *
 * ❌ **WRONG:** "I need k largest, so MaxHeap!"
 *
 * ✅ **CORRECT:** Ask first:
 * > "Do I need to **keep k largest**, or **enumerate all in order**?"
 *
 * - Keep k largest? → MaxHeap(k) (we discard k largest by popping min)
 * - Keep k smallest? → MaxHeap(k) (we discard k smallest by popping max)
 * - Enumerate all? → MinHeap (we explore smallest to largest)
 *
 * ### 📋 Decision Table for MaxHeap vs MinHeap
 *
 * | Question | MaxHeap (Filter) | MinHeap (Explore) |
 * |----------|-----|----------|
 * | "Keep only **smallest k**?" | ✅ | ❌ |
 * | "Keep only **largest k**?" | ❌ | ✅ (MinHeap of size k) |
 * | Enumerate in sorted order? | ❌ | ✅ |
 * | Explore neighbors dynamically? | ❌ | ✅ |
 * | Heap must stay size ≤ k? | ✅ | ❌ |
 * | Stream arrives, find top k? | ✅ | ✅ (opposite heap) |
 * | Early termination possible? | ✅ | ✅ |
 *
 * **Use cases:**
 * - Priority queues (descending priority, keep worst candidate visible)
 * - Finding k smallest elements (bounded heap)
 * - Scheduling/load balancing (select heaviest task)
 * - Streaming top-k queries
 * - K weakest rows in matrix
 * - K closest points
 * - Filtering/trimming data
 *
 * @date 25/01/2026 - 00:00:00 | Enhanced 26/01/2026
 */
export class MaxHeap<T> extends Heap<T> {
  private comparator: (a: T, b: T) => number;
  private maxSize?: number; // Optional capacity limit

  /**
   * Creates a new MaxHeap with optional custom comparator and max size.
   *
   * @param {Function} [comparator] - Optional comparison function.
   *   Returns: < 0 if a < b, 0 if a === b, > 0 if a > b
   *   If not provided, uses default > operator for primitives
   * @param {number} [maxSize] - Optional maximum heap capacity
   * @param {T[]} [elements] - Optional initial elements to build the heap in O(n log n)
   *
   * @example
   * // Max-heap of objects with custom comparator
   * const maxHeap = new MaxHeap((a, b) => b.priority - a.priority);
   *
   * @example
   * // Max-heap of numbers with capacity limit
   * const maxHeap = new MaxHeap(undefined, 10);
   *
   * @example
   * // Max-heap of numbers (default)
   * const maxHeap = new MaxHeap();
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
    if (a > b) return -1;

    if (a < b) return 1;

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
   *         i           ← violation can only be HERE (parent too small)
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
   * Creates a new MaxHeap from an array in O(n) time using heapify.
   * More efficient than adding elements one-by-one for bulk initialization.
   *
   * @static
   * @param {T[]} items - Array of items to build heap from
   * @param {Function} [comparator] - Optional comparison function
   * @param {number} [maxSize] - Optional maximum heap capacity
   * @returns {MaxHeap<T>} A new MaxHeap containing all items
   * @time O(n) - Linear time heap construction
   * @space O(n) - Stores n elements
   *
   * @example
   * const heap = MaxHeap.from([3, 1, 4, 1, 5, 9, 2, 6]);
   * console.log(heap.peek()); // 9
   */
  static from<T>(
    items: T[],
    comparator?: (a: T, b: T) => number,
    maxSize?: number,
  ): MaxHeap<T> {
    const heap = new MaxHeap(comparator, maxSize);
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
   * - Parent check: ❌ might be violated (new node could be > parent)
   *
   * **Why bubbleUp (not down)?**
   * ```
   *        P
   *        |
   *      NEW  ← violation can ONLY be HERE (child too big)
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
   * **POLL: Remove max element and restore invariant (bubble down)**
   *
   * Removes root, moves last element to root, then bubbles down to correct position.
   *
   * **Invariant Analysis:**
   * - Root: no parent to check ✅
   * - All subtrees: still valid heaps ✅
   * - Root vs children: ❌ might be violated (new root could be < children)
   *
   * **Why bubbleDown (not up)?**
   * ```
   *      NEW_ROOT
   *      /     \
   *   child   child  ← violation can ONLY be HERE (root too small)
   * ```
   * The problem is always downward (toward leaves). Root has no parent to go up to.
   *
   * **Invariant guarantee:** After poll + bubbleDown, heap property restored.
   *
   * @time O(log n) - Bubbles down from root to potentially leaf
   * @space O(1) - Constant space; no additional data structures needed
   */
  poll(): T {
    const item = this.items[0];
    this.items[0] = this.items[this.items.length - 1];
    this.items.pop();
    if (this.items.length > 0) {
      this.bubbleDown();
    }
    return item;
  }

  /**
   * **BUBBLEDOWN: Fix downward violations**
   *
   * Moves node down the tree by repeatedly swapping with the larger child until
   * the node is >= both children (heap property satisfied).
   *
   * **When used:**
   * - After `poll()`: root might be smaller than children
   * - During `heapify()`: parent might be smaller than children
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
      let largest = index;

      // Check if left child exists and is larger than current largest
      // Note: comparator is reversed for MaxHeap (a > b returns -1)
      if (
        leftIdx < this.items.length &&
        this.comparator(this.items[leftIdx], this.items[largest]) < 0
      ) {
        largest = leftIdx;
      }

      // Check if right child exists and is larger than current largest
      if (
        rightIdx < this.items.length &&
        this.comparator(this.items[rightIdx], this.items[largest]) < 0
      ) {
        largest = rightIdx;
      }

      // If largest is not current index, swap and continue bubbling
      if (largest !== index) {
        this.swap(index, largest);
        index = largest;
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
   * the node is <= its parent (heap property satisfied).
   *
   * **When used:**
   * - After `add()`: new leaf might be larger than its parent
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
  // Example 1: Basic max-heap with numbers
  console.log("=== Example 1: Basic Max-Heap ===");
  const maxHeap = new MaxHeap<number>();
  maxHeap.add(5);
  maxHeap.add(3);
  maxHeap.add(7);
  maxHeap.add(1);
  maxHeap.add(9);

  console.log("Heap contents:", maxHeap.toString());
  console.log("Max element:", maxHeap.peek()); // 9
  console.log("Poll max:", maxHeap.poll()); // 9
  console.log("After poll:", maxHeap.toString());

  // Example 2: Max-heap with custom comparator (descending priority)
  console.log("\n=== Example 2: Custom Comparator ===");
  interface Task {
    id: string;
    priority: number;
  }

  const taskQueue = new MaxHeap<Task>((a, b) => b.priority - a.priority);
  taskQueue.add({ id: "task1", priority: 5 });
  taskQueue.add({ id: "task2", priority: 2 });
  taskQueue.add({ id: "task3", priority: 8 });
  taskQueue.add({ id: "task4", priority: 1 });

  console.log("Highest priority task:", taskQueue.peek()); // { id: 'task3', priority: 8 }
  while (taskQueue.size() > 0) {
    console.log("Processing:", taskQueue.poll());
  }

  // Example 3: Building heap from array using heapify
  console.log("\n=== Example 3: Heapify ===");
  const data = [9, 5, 6, 2, 3, 7, 1, 4, 8];
  const heap = MaxHeap.from(data);
  console.log("Heapified:", heap.toString());
  console.log("Max:", heap.peek()); // 9

  // Example 4: Heap with capacity limit (top-k elements)
  console.log("\n=== Example 4: Capacity Limited Heap (Top-K) ===");
  const topKHeap = new MaxHeap<number>(undefined, 3);
  console.log("Add 5:", topKHeap.add(5)); // true
  console.log("Add 3:", topKHeap.add(3)); // true
  console.log("Add 7:", topKHeap.add(7)); // true
  console.log("Add 1:", topKHeap.add(1)); // false (exceeds capacity)
  console.log("Top-K heap:", topKHeap.toString()); // [7, 3, 5]

  // Example 5: Using in reverse sorting context
  console.log("\n=== Example 5: Reverse Heap Sort ===");
  const unsorted = [64, 34, 25, 12, 22, 11, 90];
  const sortedHeap = MaxHeap.from(unsorted);
  const sorted = [];
  while (sortedHeap.size() > 0) {
    sorted.push(sortedHeap.poll());
  }
  console.log("Original:", unsorted);
  console.log("Reverse sorted:", sorted); // [90, 64, 34, 25, 22, 12, 11]
}

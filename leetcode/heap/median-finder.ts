import { MinHeap } from "../../structures/heap/min-heap";
import { MaxHeap } from "../../structures/heap/max-heap";

/**
 * Find the Median from Data Stream - LeetCode Problem 295
 *
 * Problem Statement:
 * The median is the middle value in an ordered integer list. If the size of the
 * list is even, there is no middle value, and the median is the mean of the two
 * middle values.
 *
 * Implement the MedianFinder class:
 * - MedianFinder() initializes the MedianFinder object.
 * - void addNum(int num) adds the integer num from the data stream to the data structure.
 * - double findMedian() returns the median of all elements so far.
 *
 * @example
 * const medianFinder = new MedianFinder();
 * medianFinder.addNum(1);    // arr = [1]
 * medianFinder.addNum(2);    // arr = [1, 2]
 * medianFinder.findMedian(); // return 1.5 (i.e., (1 + 2) / 2)
 * medianFinder.addNum(3);    // arr = [1, 2, 3]
 * medianFinder.findMedian(); // return 2.0
 *
 * @constraints
 * - -10^5 <= num <= 10^5
 * - There will be at least one element in the data structure before calling findMedian.
 * - At most 5 * 10^4 calls will be made to addNum and findMedian.
 *
 * ## Approaches
 *
 * **Approach 1: Two Heaps (Partitioning Pattern - Optimal)**
 *
 * Partition the data into two halves:
 * - MaxHeap for the smaller half (max at root)
 * - MinHeap for the larger half (min at root)
 *
 * Invariants:
 * 1. size(maxHeap) == size(minHeap) OR size(maxHeap) == size(minHeap) + 1
 * 2. all(maxHeap) <= all(minHeap)
 *
 * Algorithm:
 * 1. Add number to maxHeap if empty or num <= maxHeap.peek()
 * 2. Else add to minHeap
 * 3. Balance heaps: if |size(maxHeap) - size(minHeap)| > 1, rebalance
 * 4. Median:
 *    - If odd: maxHeap.peek()
 *    - If even: (maxHeap.peek() + minHeap.peek()) / 2
 *
 * @time O(log n) per addNum, O(1) per findMedian - heap operations are logarithmic
 * @space O(n) - store all elements across both heaps
 * **Trade-off:** Perfect for streaming. Median always O(1) after each add.
 *
 * **Approach 2: Sorted Array with Binary Search (Alternative)**
 *
 * Keep array sorted using binary search insertion point.
 *
 * @time O(n) per addNum (array shift), O(1) per findMedian
 * @space O(n) - store all elements
 * **Trade-off:** Insertion is slow due to array shifts. Better if more findMedian calls.
 *
 * **Approach 3: Balanced BST (Alternative)**
 *
 * Use self-balancing BST (AVL/RedBlack tree) to maintain sorted order.
 * Track size and median pointer.
 *
 * @time O(log n) per addNum, O(1) per findMedian
 * @space O(n) - tree nodes
 * **Trade-off:** Complex to implement. Same asymptotic as two heaps.
 *
 * **Approach 4: Insertion Sort on Array (Alternative)**
 *
 * Maintain array in sorted order by inserting each number at correct position.
 * Use linear scan to find insertion point (not binary search).
 *
 * @time O(n) per addNum (scan + shift), O(1) per findMedian
 * @space O(n) - store all elements
 * **Trade-off:** Simple to understand. Slower than binary search variant.
 * Best when: infrequent additions, many median queries.
 *
 * ## Further Thoughts - Advanced Approaches
 *
 * **Buckets Strategy:**
 * If numbers are statistically distributed, track buckets where the median would land
 * rather than maintaining entire array. Once correct bucket identified, sort only that
 * bucket to find median. If bucket size << total input size, yields significant time
 * savings. Works well for bounded ranges (e.g., temperature readings, normalized scores).
 *
 * **Reservoir Sampling:**
 * For statistically distributed streams, maintain a single representative sample
 * (reservoir) of the entire stream instead of all elements. Reservoir Sampling
 * allows you to estimate the median of the entire stream from this small sample.
 * Trade-off: Determining "good" reservoir size is non-trivial.
 * Best for: extremely large data streams with memory constraints.
 *
 * **Segment Trees:**
 * Excellent for problems with many insertions and read queries over limited range
 * of input values. Enables fast insertion, deletion, and range queries in roughly
 * same time complexity. Drawback: complex to implement and rarely required in interviews.
 * Best for: competitive programming, complex range operations.
 *
 * **Order Statistic Trees:**
 * Data structures tailor-made for finding k-th order element in a set.
 * Combine BST features with O(log n) access to k-th smallest element.
 * Drawback: non-trivial to implement. Some languages provide ready implementations
 * (e.g., C++ std::tree with GNU extensions).
 * Best for: languages with built-in implementations, when k-th queries are frequent.
 *
 * @date 27/01/2026
 */

/**
 * **Approach 1: Two Heaps (Partitioning Pattern - Optimal)**
 *
 * Time: O(log n) addNum, O(1) findMedian
 * Space: O(n)
 *
 * Use MaxHeap for lower half and MinHeap for upper half.
 * Maintain size invariant: size(maxHeap) >= size(minHeap) and difference <= 1.
 *
 * Key insight: Instead of sorting, we partition data into two sorted halves.
 * Median is always accessible at the roots.
 */
class MedianFinder {
  // MaxHeap stores smaller half (comparator makes larger values go down)
  private maxHeap: MaxHeap<number>;
  // MinHeap stores larger half (comparator makes smaller values go down)
  private minHeap: MinHeap<number>;

  constructor() {
    // Default comparators: max for maxHeap, min for minHeap
    this.maxHeap = new MaxHeap<number>();
    this.minHeap = new MinHeap<number>();
  }

  /**
   * Add a number to the data stream
   *
   * Strategy:
   * 1. If num should be in lower half: add to maxHeap
   * 2. Else: add to minHeap
   * 3. Balance if needed
   *
   * @param num - Integer to add
   */
  addNum(num: number): void {
    // Add to appropriate heap
    if (this.maxHeap.size() === 0 || num <= this.maxHeap.peek()!) {
      this.maxHeap.add(num);
    } else {
      this.minHeap.add(num);
    }

    // Balance heaps: maxHeap should have size >= minHeap with difference <= 1
    // Keep maxHeap slightly larger to handle odd-length median
    if (this.maxHeap.size() > this.minHeap.size() + 1) {
      // maxHeap too large, move largest from maxHeap to minHeap
      const max = this.maxHeap.poll()!;
      this.minHeap.add(max);
    } else if (this.minHeap.size() > this.maxHeap.size()) {
      // minHeap too large, move smallest from minHeap to maxHeap
      const min = this.minHeap.poll()!;
      this.maxHeap.add(min);
    }
  }

  /**
   * Find the median of all numbers added so far
   *
   * Cases:
   * - Odd count: median = maxHeap.peek() (root of larger half)
   * - Even count: median = (maxHeap.peek() + minHeap.peek()) / 2
   *
   * @returns Median value
   */
  findMedian(): number {
    const totalSize = this.maxHeap.size() + this.minHeap.size();

    if (totalSize % 2 === 1) {
      // Odd count: return max of lower half
      return this.maxHeap.peek()!;
    } else {
      // Even count: return average of two middle elements
      return (this.maxHeap.peek()! + this.minHeap.peek()!) / 2;
    }
  }
}

// Example usage
if (require.main === module) {
  console.log("=== Find Median from Data Stream ===\n");

  // Example 1: Basic sequence
  console.log("Example 1: Basic Sequence");
  const mf1 = new MedianFinder();
  console.log("Operations:");
  console.log("  addNum(1)    // arr = [1]");
  mf1.addNum(1);

  console.log("  addNum(2)    // arr = [1, 2]");
  mf1.addNum(2);

  console.log("  findMedian() // return 1.5");
  console.log("  Median:", mf1.findMedian(), "Expected: 1.5");

  console.log("  addNum(3)    // arr = [1, 2, 3]");
  mf1.addNum(3);

  console.log("  findMedian() // return 2.0");
  console.log("  Median:", mf1.findMedian(), "Expected: 2.0");
  console.log();

  // Example 2: All same values
  console.log("Example 2: All Same Values");
  const mf2 = new MedianFinder();
  console.log("Adding: [5, 5, 5, 5]");
  mf2.addNum(5);
  mf2.addNum(5);
  console.log("  After 2 nums: median =", mf2.findMedian(), "(Expected: 5)");
  mf2.addNum(5);
  mf2.addNum(5);
  console.log("  After 4 nums: median =", mf2.findMedian(), "(Expected: 5)");
  console.log();

  // Example 3: Ascending sequence
  console.log("Example 3: Ascending Sequence");
  const mf3 = new MedianFinder();
  const nums3 = [1, 2, 3, 4, 5];
  console.log(`Adding: [${nums3.join(", ")}]`);
  nums3.forEach((num, i) => {
    mf3.addNum(num);
    const median = mf3.findMedian();
    const expected =
      (nums3.length + 1) % 2 === 1
        ? nums3[Math.floor(nums3.length / 2)]
        : (nums3[Math.floor(nums3.length / 2) - 1] +
            nums3[Math.floor(nums3.length / 2)]) /
          2;
    console.log(`  After ${i + 1} nums: median = ${median}`);
  });
  console.log();

  // Example 4: Random sequence
  console.log("Example 4: Random Sequence");
  const mf4 = new MedianFinder();
  const nums4 = [6, 2, 4, 1, 3, 5];
  console.log(`Adding: [${nums4.join(", ")}]`);
  nums4.forEach((num, i) => {
    mf4.addNum(num);
    console.log(`  After adding ${num}: median = ${mf4.findMedian()}`);
  });
  console.log();

  // Example 5: Negative and positive numbers
  console.log("Example 5: Negative and Positive");
  const mf5 = new MedianFinder();
  const nums5 = [-2, 0, 2, -1, 3];
  console.log(`Adding: [${nums5.join(", ")}]`);
  nums5.forEach((num, i) => {
    mf5.addNum(num);
    console.log(`  After adding ${num}: median = ${mf5.findMedian()}`);
  });
  console.log();

  // Performance analysis
  console.log("=== Performance Analysis ===");
  console.log("Approach 1 - Two Heaps (Implemented):");
  console.log("  - addNum(): O(log n) - heap insertion + balancing");
  console.log("  - findMedian(): O(1) - just peek at roots");
  console.log("  - Space: O(n) - store all elements");
  console.log("  - Best for: streaming data with frequent median queries");
  console.log("  - Pattern: Partitioning (lower half vs upper half)");
  console.log();
  console.log("Approach 2 - Sorted Array with Binary Search (Alternative):");
  console.log("  - addNum(): O(n) - binary search + array shift");
  console.log("  - findMedian(): O(1) - direct array access");
  console.log("  - Space: O(n) - store all elements");
  console.log("  - Trade-off: Better if more findMedian than addNum calls");
  console.log();
  console.log("Approach 3 - Balanced BST (Alternative):");
  console.log("  - addNum(): O(log n) - tree insertion");
  console.log("  - findMedian(): O(1) - with pointer tracking");
  console.log("  - Space: O(n) - tree nodes");
  console.log("  - Trade-off: Same asymptotic as two heaps, more complex");
  console.log();
  console.log("Approach 4 - Insertion Sort on Array (Alternative):");
  console.log("  - addNum(): O(n) - linear scan + array shift");
  console.log("  - findMedian(): O(1) - direct array access");
  console.log("  - Space: O(n) - store all elements");
  console.log("  - Trade-off: Simpler than binary search variant");
  console.log("  - Best for: infrequent additions with many median queries");
}

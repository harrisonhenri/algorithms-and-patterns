import { MinHeap } from "../../structures/heap/min-heap";

/**
 * Kth Largest Element in a Stream - LeetCode Problem 703
 *
 * University Admissions Office Use Case:
 * Keep track of the kth highest test score from applicants in real-time.
 * Dynamically determine cut-off marks for interviews as new applicants submit scores.
 *
 * Problem Statement:
 * Design a class to find the kth largest element in a stream of numbers.
 * Note that it is the kth largest element in the sorted order, not the kth distinct element.
 *
 * Implement the KthLargest class:
 * - KthLargest(int k, int[] nums): Initializes the object with k and initial stream of scores
 * - add(int val): Adds a new score and returns the kth largest element
 *
 * @example
 * const kthLargest = new KthLargest(3, [4, 5, 8, 2]);
 * kthLargest.add(3);   // return 4
 * kthLargest.add(5);   // return 5
 * kthLargest.add(10);  // return 5
 * kthLargest.add(9);   // return 8
 * kthLargest.add(4);   // return 8
 *
 * Explanation for [4,5,8,2]:
 * - Sorted: [2,4,5,8], 3rd largest = 4
 * - After add(3): [2,3,4,5,8], 3rd largest = 4
 * - After add(5): [2,3,4,5,5,8], 3rd largest = 5
 * - After add(10): [2,3,4,5,5,8,10], 3rd largest = 5
 * - After add(9): [2,3,4,5,5,8,9,10], 3rd largest = 8
 * - After add(4): [2,3,4,4,5,5,8,9,10], 3rd largest = 8
 *
 * @constraints
 * - 1 <= k <= 10^4
 * - 0 <= nums.length <= 10^4
 * - -10^4 <= nums[i] <= 10^4
 * - -10^4 <= val <= 10^4
 * - At most 10^4 calls to add()
 * - It is guaranteed that there will be at least k elements in the array when you search for the kth element
 *
 * ## Approaches
 *
 * **Approach 1: Min-Heap (Optimal for Streaming)**
 *
 * Maintain a min-heap of size k. The root always contains the kth largest element.
 * New elements better than the current minimum replace it.
 *
 * Algorithm:
 * 1. Build a min-heap from initial nums (size at most k)
 * 2. For each new value:
 *    - If heap.size < k: always add
 *    - Else if value > heap.peek(): remove min, add new value
 * 3. Return heap.peek() (always the kth largest)
 *
 * @time Constructor: O(n log k), add(): O(log k)
 * @space O(k) - heap maintains at most k elements
 * **Trade-off:** Optimal for streaming. O(log k) per add is very efficient even for unlimited data.
 *
 * **Approach 2: Brute Force with Sorting**
 *
 * Maintain array of all elements. Sort on each add() to find kth largest.
 * Simple but inefficient for streams.
 *
 * @time Constructor: O(n), add(): O(n log n) per call
 * @space O(n) where n = total elements ever added
 * **Trade-off:** Only suitable for small datasets or when add() is rarely called.
 *
 * **Approach 3: Binary Search + Sorted Array (Middle Ground)**
 *
 * Maintain a sorted array. Use binary search to find insertion position for new element.
 * Direct access to kth largest at index `size - k`.
 *
 * Algorithm:
 * 1. Initialize with sorted array of nums
 * 2. For each new value:
 *    - Binary search to find correct insertion position
 *    - Insert element at that position (shift elements if needed)
 * 3. Return element at position `size - k`
 *
 * @time Constructor: O(n log n), add(): O(n) per call (binary search O(log n) + insertion O(n))
 * @space O(n) for storing all elements
 * **Trade-off:** Middle ground - no full sort per add(), but insertion is linear. Better than brute force for frequent adds.
 *
 * @date 26/01/2026
 */

/**
 * **Approach 1: Min-Heap (Optimal for Streaming)**
 *
 * Time: Constructor O(n log k), add() O(log k)
 * Space: O(k)
 *
 * Maintains a min-heap of exactly k elements.
 * Root always contains the kth largest element.
 */
class KthLargestMinHeap {
  private minHeap: MinHeap<number>;
  private k: number;

  /**
   * Initialize with k and initial stream of numbers
   * @param k - Position to track (1 = largest, 2 = 2nd largest, etc.)
   * @param nums - Initial stream of numbers
   *
   * Time: O(n log k) where n = nums.length
   * Space: O(k)
   */
  constructor(k: number, nums: number[]) {
    this.k = k;
    this.minHeap = new MinHeap<number>((a, b) => a - b); // Min-heap: smaller values bubble up

    // Add all initial numbers, maintaining heap size <= k
    for (const num of nums) {
      this.addToHeap(num);
    }
  }

  /**
   * Add a new number to the stream and return the kth largest
   * @param val - New number to add
   * @returns The kth largest element in the current stream
   *
   * Time: O(log k) - at most one poll and one add
   * Space: O(1)
   */
  add(val: number): number {
    this.addToHeap(val);
    return this.minHeap.peek()!;
  }

  /**
   * Helper: Add value to heap, maintaining size <= k
   */
  private addToHeap(val: number): void {
    // If heap not full, always add
    if (this.minHeap.size() < this.k) {
      this.minHeap.add(val);
    }
    // If heap full and new value is larger than min, replace min
    else if (val > this.minHeap.peek()!) {
      this.minHeap.poll(); // Remove minimum
      this.minHeap.add(val); // Add new value
    }
    // Otherwise, ignore (value is smaller than current kth largest)
  }
}

/**
 * **Approach 2: Brute Force with Sorting**
 *
 * Time: Constructor O(n), add() O(n log n)
 * Space: O(n) where n = total elements
 *
 * Maintains all elements in array, sorts on each query.
 * Simple implementation but inefficient for streams.
 */
class KthLargestBruteForce {
  private nums: number[];
  private k: number;

  /**
   * Initialize with k and initial stream of numbers
   * @param k - Position to track
   * @param nums - Initial stream of numbers
   *
   * Time: O(n)
   * Space: O(n)
   */
  constructor(k: number, nums: number[]) {
    this.k = k;
    this.nums = [...nums];
  }

  /**
   * Add a new number to the stream and return the kth largest
   * @param val - New number to add
   * @returns The kth largest element in the current stream
   *
   * Time: O(n log n) - full sort each time
   * Space: O(1) - sorting in-place
   */
  add(val: number): number {
    this.nums.push(val);
    this.nums.sort((a, b) => b - a); // Sort descending
    return this.nums[this.k - 1]; // Return kth element (0-indexed)
  }
}

/**
 * **Approach 3: Binary Search + Sorted Array (Middle Ground)**
 *
 * Time: Constructor O(n log n), add() O(n)
 * Space: O(n) for storing all elements
 *
 * Maintains sorted array. Uses binary search to find insertion position.
 * Avoids full sort each time, but insertion is linear.
 */
class KthLargestBinarySearchSorted {
  private stream: number[];
  private k: number;

  /**
   * Initialize with k and initial stream of numbers
   * @param k - Position to track
   * @param nums - Initial stream of numbers
   *
   * Time: O(n log n) for sorting
   * Space: O(n)
   */
  constructor(k: number, nums: number[]) {
    this.k = k;
    this.stream = [...nums];
    this.stream.sort((a, b) => a - b); // Sort in ascending order
  }

  /**
   * Add a new number to the stream and return the kth largest
   * @param val - New number to add
   * @returns The kth largest element in the current stream
   *
   * Time: O(n) - binary search O(log n) + insertion O(n)
   * Space: O(1) - insertion in-place
   */
  add(val: number): number {
    // Find correct insertion position using binary search
    const index = this.findInsertionIndex(val);

    // Insert element at correct position (maintains sorted order)
    this.stream.splice(index, 0, val);

    // Return kth largest element (at position size - k from end)
    return this.stream[this.stream.length - this.k];
  }

  /**
   * Helper: Binary search to find insertion position for value
   * Returns index where value should be inserted to maintain sorted order
   */
  private findInsertionIndex(val: number): number {
    let left = 0;
    let right = this.stream.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midElement = this.stream[mid];

      if (midElement === val) {
        return mid; // Insert at this position
      } else if (midElement > val) {
        // Value is smaller, search left half
        right = mid - 1;
      } else {
        // Value is larger, search right half
        left = mid + 1;
      }
    }

    // left points to correct insertion position
    return left;
  }
}

// Example usage
if (require.main === module) {
  console.log("=== Kth Largest Element in a Stream ===\n");

  // Example 1: Basic stream
  console.log("Example 1: University Admissions Stream");
  console.log("Tracking 3rd highest score among applicants");
  const minHeap1 = new KthLargestMinHeap(3, [4, 5, 8, 2]);
  const brute1 = new KthLargestBruteForce(3, [4, 5, 8, 2]);
  const binarySearch1 = new KthLargestBinarySearchSorted(3, [4, 5, 8, 2]);
  console.log("Initial scores: [4, 5, 8, 2], k=3");
  console.log("Sorted: [2, 4, 5, 8], 3rd largest = 4");
  console.log(
    "add(3)  | Min-Heap:",
    minHeap1.add(3),
    " | Brute:",
    brute1.add(3),
    " | Binary:",
    binarySearch1.add(3),
  );
  console.log(
    "add(5)  | Min-Heap:",
    minHeap1.add(5),
    " | Brute:",
    brute1.add(5),
    " | Binary:",
    binarySearch1.add(5),
  );
  console.log(
    "add(10) | Min-Heap:",
    minHeap1.add(10),
    " | Brute:",
    brute1.add(10),
    " | Binary:",
    binarySearch1.add(10),
  );
  console.log(
    "add(9)  | Min-Heap:",
    minHeap1.add(9),
    " | Brute:",
    brute1.add(9),
    " | Binary:",
    binarySearch1.add(9),
  );
  console.log(
    "add(4)  | Min-Heap:",
    minHeap1.add(4),
    " | Brute:",
    brute1.add(4),
    " | Binary:",
    binarySearch1.add(4),
  );
  console.log();

  // Example 2: k=1 (largest element)
  console.log("Example 2: Tracking Maximum");
  const minHeap2 = new KthLargestMinHeap(1, []);
  const brute2 = new KthLargestBruteForce(1, []);
  const binarySearch2 = new KthLargestBinarySearchSorted(1, []);
  console.log("k=1 (largest element)");
  console.log(
    "add(3) | Min-Heap:",
    minHeap2.add(3),
    " | Brute:",
    brute2.add(3),
    " | Binary:",
    binarySearch2.add(3),
  );
  console.log(
    "add(0) | Min-Heap:",
    minHeap2.add(0),
    " | Brute:",
    brute2.add(0),
    " | Binary:",
    binarySearch2.add(0),
  );
  console.log(
    "add(4) | Min-Heap:",
    minHeap2.add(4),
    " | Brute:",
    brute2.add(4),
    " | Binary:",
    binarySearch2.add(4),
  );
  console.log(
    "add(2) | Min-Heap:",
    minHeap2.add(2),
    " | Brute:",
    brute2.add(2),
    " | Binary:",
    binarySearch2.add(2),
  );
  console.log();

  // Example 3: Negative numbers
  console.log("Example 3: With Negative Scores");
  const minHeap3 = new KthLargestMinHeap(2, [-1, -1]);
  const brute3 = new KthLargestBruteForce(2, [-1, -1]);
  const binarySearch3 = new KthLargestBinarySearchSorted(2, [-1, -1]);
  console.log("Initial: [-1, -1], k=2 (2nd largest = -1)");
  console.log(
    "add(-2) | Min-Heap:",
    minHeap3.add(-2),
    " | Brute:",
    brute3.add(-2),
    " | Binary:",
    binarySearch3.add(-2),
  );
  console.log(
    "add(0)  | Min-Heap:",
    minHeap3.add(0),
    "  | Brute:",
    brute3.add(0),
    "  | Binary:",
    binarySearch3.add(0),
  );
  console.log(
    "add(1)  | Min-Heap:",
    minHeap3.add(1),
    "  | Brute:",
    brute3.add(1),
    "  | Binary:",
    binarySearch3.add(1),
  );
  console.log();

  // Example 4: Duplicate scores
  console.log("Example 4: Duplicate Scores");
  const minHeap4 = new KthLargestMinHeap(3, [1, 2]);
  const brute4 = new KthLargestBruteForce(3, [1, 2]);
  const binarySearch4 = new KthLargestBinarySearchSorted(3, [1, 2]);
  console.log("Initial: [1, 2], k=3 (need at least k elements)");
  console.log(
    "add(3) | Min-Heap:",
    minHeap4.add(3),
    " | Brute:",
    brute4.add(3),
    " | Binary:",
    binarySearch4.add(3),
    " // [1,2,3] -> 3rd=1",
  );
  console.log(
    "add(3) | Min-Heap:",
    minHeap4.add(3),
    " | Brute:",
    brute4.add(3),
    " | Binary:",
    binarySearch4.add(3),
    " // [1,2,3,3] -> 3rd=2",
  );
  console.log(
    "add(3) | Min-Heap:",
    minHeap4.add(3),
    " | Brute:",
    brute4.add(3),
    " | Binary:",
    binarySearch4.add(3),
    " // [1,2,3,3,3] -> 3rd=3",
  );
  console.log();

  // Example 5: Large k (many elements to track)
  console.log("Example 5: Tracking 5th Largest in Larger Stream");
  const minHeap5 = new KthLargestMinHeap(5, [10, 20, 15, 25, 30]);
  const brute5 = new KthLargestBruteForce(5, [10, 20, 15, 25, 30]);
  const binarySearch5 = new KthLargestBinarySearchSorted(
    5,
    [10, 20, 15, 25, 30],
  );
  console.log("Initial: [10, 20, 15, 25, 30], k=5");
  console.log("Sorted: [10, 15, 20, 25, 30], 5th largest = 10");
  console.log(
    "add(5)  | Min-Heap:",
    minHeap5.add(5),
    "  | Brute:",
    brute5.add(5),
    "  | Binary:",
    binarySearch5.add(5),
    "  // smallest, skip",
  );
  console.log(
    "add(12) | Min-Heap:",
    minHeap5.add(12),
    "  | Brute:",
    brute5.add(12),
    "  | Binary:",
    binarySearch5.add(12),
    "  // replace 10",
  );
  console.log(
    "add(40) | Min-Heap:",
    minHeap5.add(40),
    "  | Brute:",
    brute5.add(40),
    "  | Binary:",
    binarySearch5.add(40),
    "  // 5th = 15",
  );
  console.log(
    "add(8)  | Min-Heap:",
    minHeap5.add(8),
    "   | Brute:",
    brute5.add(8),
    "   | Binary:",
    binarySearch5.add(8),
    "   // smaller, skip",
  );
  console.log();

  // Performance comparison
  console.log("=== Performance Analysis ===");
  console.log("Approach 1 - Min-Heap (Optimal):");
  console.log("  - Constructor: O(n log k)");
  console.log("  - add(): O(log k) per element");
  console.log("  - Space: O(k)");
  console.log("  - Best for: streaming data, unlimited scale");
  console.log();
  console.log("Approach 2 - Brute Force Sorting:");
  console.log("  - Constructor: O(n)");
  console.log("  - add(): O(n log n) per element (full sort)");
  console.log("  - Space: O(n) total elements");
  console.log("  - Only for: small datasets or rare add() calls");
  console.log();
  console.log("Approach 3 - Binary Search + Sorted Array:");
  console.log("  - Constructor: O(n log n)");
  console.log(
    "  - add(): O(n) per element (binary search O(log n) + insertion O(n))",
  );
  console.log("  - Space: O(n) total elements");
  console.log(
    "  - Best for: moderate datasets with frequent adds (middle ground)",
  );
}

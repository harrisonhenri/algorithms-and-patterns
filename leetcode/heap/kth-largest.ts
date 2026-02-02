import { MinHeap } from "../../structures/heap/min-heap";
import { MaxHeap } from "../../structures/heap/max-heap";

/**
 * Kth Largest Element in an Array - LeetCode Problem 215
 *
 * Given an integer array nums and an integer k, return the kth largest element in the array.
 *
 * Note that it is the kth largest element in the sorted order, not the kth distinct element.
 *
 * **Can you solve it without sorting?**
 *
 * @example
 * Input: nums = [3,2,1,5,6,4], k = 2
 * Output: 5
 *
 * Explanation:
 * - Sorted array: [1, 2, 3, 4, 5, 6]
 * - 1st largest: 6
 * - 2nd largest: 5 ← Answer
 *
 * @example
 * Input: nums = [3,2,3,1,2,4,5,5,6], k = 4
 * Output: 4
 *
 * Explanation:
 * - Sorted array: [1, 2, 2, 3, 3, 4, 5, 5, 6]
 * - 4th largest: 4 ← Answer
 *
 * @constraints
 * - 1 <= k <= nums.length <= 10^5
 * - -10^4 <= nums[i] <= 10^4
 *
 * ## Approaches
 *
 * **Approach 1: Min-Heap of Size k (Optimal)**
 *
 * Maintain a min-heap containing only the k largest elements.
 * The root of this min-heap is the kth largest element.
 *
 * Algorithm:
 * 1. Build a min-heap from first k elements
 * 2. For each element from index k to end:
 *    - If element > heap.peek() (kth smallest in our heap):
 *      - Remove the min element
 *      - Add the new element
 * 3. Return heap.peek() (the kth largest element)
 *
 * **Why it works:**
 * - Min-heap of k elements keeps the k largest values
 * - The minimum of these k values is the kth largest in array
 * - Each comparison/insertion is O(log k), done n times
 *
 * **Example trace for [3,2,1,5,6,4], k=2:**
 * - Build heap from [3,2]: heap=[2,3] (min at root)
 * - Process 1: 1 <= 2, skip
 * - Process 5: 5 > 2, remove 2, add 5: heap=[3,5]
 * - Process 6: 6 > 3, remove 3, add 6: heap=[5,6]
 * - Process 4: 4 <= 5, skip
 * - Return 5 ✓
 *
 * @time O(n log k) - Heapify k elements O(k) + (n-k) insertions O(log k) each
 * @space O(k) - Min-heap of k elements
 *
 * **Approach 2: Max-Heap with k Polls (Simple)**
 *
 * Build a max-heap from all elements, then poll k times.
 *
 * Algorithm:
 * 1. Build max-heap from all n elements
 * 2. Poll k times from the heap
 * 3. Return the last polled element (the kth largest)
 *
 * @time O(n log n) - Heapify O(n) + k polls O(log n) each
 * @space O(n) - Max-heap of all elements
 * **Trade-off:** Simpler to implement, but slower for small k
 *
 * **Approach 3: QuickSelect (Average O(n), Worst O(n²))**
 *
 * Similar to QuickSort partition: select a pivot and partition array.
 * Find pivot position; if it's k-1, that's the kth largest.
 * Recursively search left or right based on pivot position.
 *
 * @time O(n) average, O(n²) worst case
 * @space O(1) - In-place partitioning
 * **Trade-off:** Average better than heap but worst case is bad
 *
 * **Approach 4: Counting Sort (When range is small)**
 *
 * When the range of values is limited (given: -10^4 to 10^4),
 * counting sort efficiently finds kth largest without comparison sorting.
 *
 * Algorithm:
 * 1. Create a count array for all possible values
 * 2. Count occurrences of each number
 * 3. Iterate from max to min, tracking cumulative count
 * 4. When cumulative count >= k, return current value
 *
 * **Why it works:**
 * - No comparisons needed; uses value range as index
 * - O(n + range) = O(n) since range is constant (20,000)
 * - Space trade-off: store counts for all possible values
 *
 * **Example trace for [3,2,1,5,6,4], k=2:**
 * - Count: {1:1, 2:1, 3:1, 4:1, 5:1, 6:1}
 * - Iterate from 6 down:
 *   - 6: cumCount = 1 < 2
 *   - 5: cumCount = 2 >= 2 → Return 5 ✓
 *
 * @time O(n + range) where range = max - min. Since range ≤ 20,000, effectively O(n)
 * @space O(range) - Count array for all possible values
 * **Trade-off:** Optimal when range is small relative to array size
 *
 * @date 26/01/2026
 */

/**
 * **Approach 1: Min-Heap of Size k (Optimal)**
 *
 * Time: O(n log k), Space: O(k)
 * Best when k is much smaller than n.
 */
function findKthLargestMinHeap(nums: number[], k: number): number {
  // Build min-heap from first k elements
  const minHeap = MinHeap.from(nums.slice(0, k));

  // Process remaining elements
  for (let i = k; i < nums.length; i++) {
    // If current element is larger than the kth largest (heap root)
    if (nums[i] > minHeap.peek()) {
      minHeap.poll(); // Remove the smallest of k largest
      minHeap.add(nums[i]); // Add the new larger element
    }
  }

  // The root of min-heap is the kth largest element
  return minHeap.peek();
}

/**
 * **Approach 2: Max-Heap with k Polls (Simple)**
 *
 * Time: O(n log n), Space: O(n)
 * Simpler implementation but slower for small k.
 */
function findKthLargestMaxHeap(nums: number[], k: number): number {
  // Build max-heap from all elements
  const maxHeap = MaxHeap.from(nums);

  let result = 0;
  // Poll k times to get the kth largest
  for (let i = 0; i < k; i++) {
    result = maxHeap.poll();
  }

  return result;
}

/**
 * **Approach 3: QuickSelect (Average O(n), Worst O(n²))**
 *
 * Similar to QuickSort partition: select a pivot and partition array.
 * Find pivot position; if it's k-1, that's the kth largest.
 * Recursively search left or right based on pivot position.
 *
 * @time O(n) average, O(n²) worst case
 * @space O(1) - In-place partitioning
 * **Trade-off:** Average better than heap but worst case is bad
 *
 * Implementation: See {@link ../../algorithms/sort/count-sort#quickSelect}
 */

/**
 * **Approach 4: Counting Sort (When range is small) (Optimal)**
 *
 * Time: O(n + range) ≈ O(n), Space: O(range)
 * Best when value range is small (like -10^4 to 10^4).
 *
 * When the range of values is limited, counting sort efficiently finds kth largest
 * without comparison sorting.
 *
 * Algorithm:
 * 1. Create a count array for all possible values
 * 2. Count occurrences of each number
 * 3. Iterate from max to min, tracking cumulative count
 * 4. When cumulative count >= k, return current value
 *
 * **Why it works:**
 * - No comparisons needed; uses value range as index
 * - O(n + range) = O(n) since range is constant (20,000)
 * - Space trade-off: store counts for all possible values
 *
 * **Example trace for [3,2,1,5,6,4], k=2:**
 * - Count: {1:1, 2:1, 3:1, 4:1, 5:1, 6:1}
 * - Iterate from 6 down:
 *   - 6: cumCount = 1 < 2
 *   - 5: cumCount = 2 >= 2 → Return 5 ✓
 *
 * @time O(n + range) where range = max - min. Since range ≤ 20,000, effectively O(n)
 * @space O(range) - Count array for all possible values
 * **Trade-off:** Optimal when range is small relative to array size
 */
function findKthLargestCountSort(
  nums: number[],
  k: number,
  min: number = -10_000,
  max: number = 10_000,
): number {
  const range = max - min + 1;

  // Create count array indexed by value offset
  const count = new Array<number>(range).fill(0);
  for (const num of nums) {
    count[num - min]++;
  }

  // Traverse from max to min, accumulating count until we reach k
  let accumulated = 0;
  for (let value = max; value >= min; value--) {
    accumulated += count[value - min];
    if (accumulated >= k) return value;
  }

  return -1; // Should never reach if k is valid
}

// Example usage
if (require.main === module) {
  // Example 1
  console.log("=== Example 1: Min-Heap Approach ===");
  const nums1 = [3, 2, 1, 5, 6, 4];
  const k1 = 2;
  console.log("Input: nums =", nums1, ", k =", k1);
  console.log("Min-Heap output:", findKthLargestMinHeap([...nums1], k1)); // 5
  console.log("Max-Heap output:", findKthLargestMaxHeap([...nums1], k1)); // 5
  console.log("CountSort output:", findKthLargestCountSort([...nums1], k1)); // 5

  // Example 2
  console.log("\n=== Example 2: Multiple Duplicates ===");
  const nums2 = [3, 2, 3, 1, 2, 4, 5, 5, 6];
  const k2 = 4;
  console.log("Input: nums =", nums2, ", k =", k2);
  console.log("Min-Heap output:", findKthLargestMinHeap([...nums2], k2)); // 4
  console.log("Max-Heap output:", findKthLargestMaxHeap([...nums2], k2)); // 4
  console.log("CountSort output:", findKthLargestCountSort([...nums2], k2)); // 4

  // Example 3: k = 1 (largest element)
  console.log("\n=== Example 3: k = 1 (Find Maximum) ===");
  const nums3 = [7, 2, 9, 1, 5];
  const k3 = 1;
  console.log("Input: nums =", nums3, ", k =", k3);
  console.log("Min-Heap output:", findKthLargestMinHeap([...nums3], k3)); // 9
  console.log("Max-Heap output:", findKthLargestMaxHeap([...nums3], k3)); // 9
  console.log("CountSort output:", findKthLargestCountSort([...nums3], k3)); // 9

  // Example 4: k = n (smallest element)
  console.log("\n=== Example 4: k = n (Find Minimum) ===");
  const nums4 = [7, 2, 9, 1, 5];
  const k4 = 5;
  console.log("Input: nums =", nums4, ", k =", k4);
  console.log("Min-Heap output:", findKthLargestMinHeap([...nums4], k4)); // 1
  console.log("Max-Heap output:", findKthLargestMaxHeap([...nums4], k4)); // 1
  console.log("CountSort output:", findKthLargestCountSort([...nums4], k4)); // 1

  // Example 5: Single element
  console.log("\n=== Example 5: Single Element ===");
  const nums5 = [42];
  const k5 = 1;
  console.log("Input: nums =", nums5, ", k =", k5);
  console.log("Min-Heap output:", findKthLargestMinHeap([...nums5], k5)); // 42
  console.log("Max-Heap output:", findKthLargestMaxHeap([...nums5], k5)); // 42
  console.log("CountSort output:", findKthLargestCountSort([...nums5], k5)); // 42

  // Performance comparison
  console.log("\n=== Approach Comparison ===");
  const largeArray = Array.from({ length: 1000 }, () =>
    Math.floor(Math.random() * 10000),
  );
  const kSmall = 2;
  const kLarge = 500;

  console.log(`Array size: ${largeArray.length}`);
  console.log(`\nFor small k=${kSmall} (Min-Heap is optimal):`);
  console.log("Min-Heap:", findKthLargestMinHeap([...largeArray], kSmall));
  console.log("Max-Heap:", findKthLargestMaxHeap([...largeArray], kSmall));

  console.log(`\nFor large k=${kLarge}:`);
  console.log("Min-Heap:", findKthLargestMinHeap([...largeArray], kLarge));
  console.log("Max-Heap:", findKthLargestMaxHeap([...largeArray], kLarge));
}

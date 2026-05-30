import { MinHeap } from "../../structures/heap/min-heap";
import { partition } from "../../algorithms/utils/partition";

/**
 * Top K Frequent Elements - LeetCode Problem 347
 *
 * Given an integer array nums and an integer k, return the k most frequent elements.
 * You may return the answer in any order.
 *
 * @example
 * Input: nums = [1,1,1,2,2,3], k = 2
 * Output: [1,2]
 *
 * Explanation:
 * - 1 appears 3 times
 * - 2 appears 2 times
 * - 3 appears 1 time
 * - The 2 most frequent elements are 1 and 2
 *
 * @example
 * Input: nums = [4,1,1,1,2,2,3], k = 2
 * Output: [1,2]
 *
 * Explanation:
 * - 1 appears 3 times (most frequent)
 * - 2 appears 2 times (second most)
 * - 3 appears 1 time
 * - 4 appears 1 time
 * - The 2 most frequent are 1 and 2
 *
 * @constraints
 * - 1 <= nums.length <= 10^5
 * - -10^4 <= nums[i] <= 10^4
 * - 1 <= k <= number of unique elements
 * - It is guaranteed that the answer is unique
 *
 * ## Approaches
 *
 * **Approach 1: Min-Heap by Frequency (Optimal)**
 *
 * Use a frequency map to count element occurrences, then maintain a min-heap of size k.
 * The heap stores elements sorted by their frequency (min at root).
 *
 * Algorithm:
 * 1. Build a frequency map: element → count
 * 2. Create a min-heap of size k using a custom comparator by frequency
 * 3. For each unique element:
 *    - If heap size < k: add to heap
 *    - Else if element frequency > heap.peek() frequency: remove min, add element
 * 4. Return heap contents
 *
 * **Why it works:**
 * - Heap maintains k most frequent elements
 * - The minimum frequency element is always at root
 * - We can efficiently replace it if we find more frequent elements
 * - Time complexity is optimal: O(n log k) where n = unique elements
 *
 * **Example trace for [1,1,1,2,2,3], k=2:**
 * - Frequencies: {1: 3, 2: 2, 3: 1}
 * - Build heap with size 2:
 *   - Add 1 (freq 3): heap=[1]
 *   - Add 2 (freq 2): heap=[2, 1] (min-heap by frequency)
 *   - Process 3 (freq 1): 1 < 2, skip
 * - Return [1, 2] ✓
 *
 * @time O(n log k) where n = unique elements, k = heap size
 * @space O(n) for frequency map + O(k) for heap = O(n)
 * **Trade-off:** Optimal for small k. When k ≈ n, quickselect might be better.
 *
 * **Approach 2: QuickSelect on Frequencies**
 *
 * Use quickselect on the frequency array to partition around the kth largest frequency,
 * then collect all elements with frequency >= kth frequency.
 *
 * Algorithm:
 * 1. Build frequency map
 * 2. Extract frequency values into array
 * 3. Use quickselect to find kth largest frequency
 * 4. Collect all elements with frequency >= kth frequency
 *
 * @time O(n) average, O(n²) worst case (quickselect complexity)
 * @space O(n) for frequency map + frequency array
 * **Trade-off:** Two-pass approach (partition frequencies, then filter elements)
 *
 * **Approach 3: QuickSelect on Unique Elements (Optimized)**
 *
 * Partition the unique elements array directly by frequency (in-place).
 * After partition, top k elements are already positioned at [n-k, n].
 *
 * Algorithm:
 * 1. Build frequency map
 * 2. Extract unique elements array
 * 3. QuickSelect on unique array partitioned by frequency
 * 4. Return elements at positions [n-k, n] (already in place)
 *
 * @time O(n) average, O(n²) worst case
 * @space O(n) for frequency map only
 * **Trade-off:** Most efficient - single pass, in-place partition, no extra filtering
 *
 * @date 26/01/2026
 */

/**
 * **Approach 1: Min-Heap by Frequency (Optimal)**
 *
 * Time: O(n log k), Space: O(n)
 * Best when k << n (small k relative to unique elements).
 */
function topKFrequentMinHeap(nums: number[], k: number): number[] {
  // Step 1: Build frequency map
  const frequency = new Map<number, number>();
  for (const num of nums) {
    frequency.set(num, (frequency.get(num) || 0) + 1);
  }

  // Step 2: Create min-heap with custom comparator (min by frequency)
  // Comparator: return true if a should come AFTER b (for min-heap)
  const minHeap = new MinHeap<number>((a, b) => {
    // Return true if frequency[a] > frequency[b]
    // This makes the element with SMALLER frequency bubble up
    return (frequency.get(a) || 0) - (frequency.get(b) || 0);
  });

  // Step 3: Build heap of size k
  for (const [num, freq] of frequency) {
    minHeap.add(num);

    // Keep only k elements in heap
    // Heap maintains k most frequent, with least frequent at root
    if (minHeap.size() > k) {
      minHeap.poll(); // Remove least frequent
    }
  }

  // Step 4: Extract all elements from heap
  const result: number[] = [];
  while (minHeap.size() > 0) {
    result.push(minHeap.poll()!);
  }

  return result;
}

/**
 * **Approach 2: QuickSelect on Frequencies**
 *
 * Time: O(n) average, O(n²) worst case
 * Space: O(n) for frequency map and frequencies array
 *
 * Use quickselect on the frequency array to partition around the kth largest frequency.
 * Then collect all elements with frequency >= kth frequency.
 */
function topKFrequentQuickSelect(nums: number[], k: number): number[] {
  // Step 1: Build frequency map
  const frequency = new Map<number, number>();
  for (const num of nums) {
    frequency.set(num, (frequency.get(num) || 0) + 1);
  }

  // Step 2: Extract unique elements and their frequencies
  const uniqueElements = Array.from(frequency.keys());
  const frequencies = uniqueElements.map((num) => frequency.get(num)!);

  // Step 3: Use quickSelect to find kth largest frequency
  // We want to partition by frequency, so we need to find the frequency
  // at position (n - k) when sorted in ascending order
  // Or equivalently, the kth largest frequency value itself
  const targetFrequency = quickSelectFrequency(
    frequencies,
    frequencies.length - k,
  );

  // Step 4: Collect all elements with frequency >= targetFrequency
  const result: number[] = [];
  for (const [num, freq] of frequency) {
    if (freq >= targetFrequency) {
      result.push(num);
    }
  }

  return result;
}

/**
 * Helper function: QuickSelect on frequencies to find kth smallest frequency
 * Returns the frequency value at position k (0-indexed) after partitioning
 * Uses the shared partition utility from the codebase
 */
function quickSelectFrequency(
  frequencies: number[],
  k: number,
  left: number = 0,
  right: number = frequencies.length - 1,
): number {
  if (left === right) return frequencies[left];

  // Use shared partition utility
  const pivotIndex = partition(frequencies, left, right);

  if (k === pivotIndex) {
    return frequencies[k];
  } else if (k < pivotIndex) {
    return quickSelectFrequency(frequencies, k, left, pivotIndex - 1);
  } else {
    return quickSelectFrequency(frequencies, k, pivotIndex + 1, right);
  }
}

/**
 * **Approach 3: QuickSelect on Unique Elements (Optimized)**
 *
 * Time: O(n) average, O(n²) worst case
 * Space: O(n) for frequency map only
 *
 * Partition the unique elements array directly by frequency (in-place).
 * After partition, top k elements are already at positions [n-k, n].
 * More efficient than Approach 2 because it avoids the second filtering pass.
 *
 * Uses **Lomuto's Partition Scheme** for in-place partitioning:
 * 1. Move pivot to the end of the partition
 * 2. Set store_index pointer to the beginning
 * 3. Iterate and swap all less frequent elements to the left
 * 4. Move pivot to its final position and return the index
 *
 * @see https://en.wikipedia.org/wiki/Quicksort#Lomuto_partition_scheme
 */
function topKFrequentQuickSelectOptimized(nums: number[], k: number): number[] {
  // Step 1: Build frequency map
  const frequency = new Map<number, number>();
  for (const num of nums) {
    frequency.set(num, (frequency.get(num) || 0) + 1);
  }

  // Step 2: Extract unique elements array
  const unique = Array.from(frequency.keys());
  const n = unique.length;

  // Step 3: QuickSelect on unique array (partitioned by frequency)
  // We want the top k frequent elements at positions [n-k, n]
  quickSelectOnUnique(unique, frequency, 0, n - 1, n - k);

  // Step 4: Return the k most frequent elements (already positioned at [n-k, n])
  return unique.slice(n - k, n);
}

/**
 * Helper: QuickSelect that partitions unique elements by their frequency
 * Positions elements so that kSmallest position contains elements with
 * frequencies >= all elements to the left
 */
function quickSelectOnUnique(
  unique: number[],
  frequency: Map<number, number>,
  left: number,
  right: number,
  kSmallest: number,
): void {
  // Base case: single element is already in place
  if (left === right) return;

  // Random pivot selection for better average case (avoids worst case on sorted data)
  const pivotIndex = left + Math.floor(Math.random() * (right - left + 1));

  // Partition by frequency and get pivot's final position
  const finalIndex = partitionByFrequency(
    unique,
    frequency,
    left,
    right,
    pivotIndex,
  );

  // If pivot is in its final sorted position, we're done
  if (kSmallest === finalIndex) {
    return;
  } else if (kSmallest < finalIndex) {
    // Need to search left (less frequent elements)
    quickSelectOnUnique(unique, frequency, left, finalIndex - 1, kSmallest);
  } else {
    // Need to search right (more frequent elements)
    quickSelectOnUnique(unique, frequency, finalIndex + 1, right, kSmallest);
  }
}

/**
 * Helper: Partition unique array by frequency of elements
 * Similar to QuickSort partition, but compares frequencies instead of values
 *
 * After partition:
 * - Elements [left...storeIndex-1] have frequency < pivotFrequency
 * - Element at storeIndex has frequency = pivotFrequency
 * - Elements [storeIndex+1...right] have frequency >= pivotFrequency
 */
function partitionByFrequency(
  unique: number[],
  frequency: Map<number, number>,
  left: number,
  right: number,
  pivotIndex: number,
): number {
  const pivotFrequency = frequency.get(unique[pivotIndex])!;

  // Step 1: Move pivot to end
  [unique[pivotIndex], unique[right]] = [unique[right], unique[pivotIndex]];
  let storeIndex = left;

  // Step 2: Move all less frequent elements to the left
  for (let i = left; i < right; i++) {
    if ((frequency.get(unique[i]) || 0) < pivotFrequency) {
      [unique[storeIndex], unique[i]] = [unique[i], unique[storeIndex]];
      storeIndex++;
    }
  }

  // Step 3: Move the pivot to its final place
  [unique[storeIndex], unique[right]] = [unique[right], unique[storeIndex]];

  return storeIndex;
}

// Example usage
if (require.main === module) {
  // Example 1
  console.log("=== Example 1: Basic Case ===");
  const nums1 = [1, 1, 1, 2, 2, 3];
  const k1 = 2;
  console.log("Input: nums =", nums1, ", k =", k1);
  console.log("Min-Heap output:", topKFrequentMinHeap([...nums1], k1)); // [1, 2]
  console.log("QuickSelect output:", topKFrequentQuickSelect([...nums1], k1)); // [1, 2]
  console.log(
    "QuickSelect Optimized output:",
    topKFrequentQuickSelectOptimized([...nums1], k1),
  ); // [1, 2]
  console.log("Explanation: 1 appears 3 times, 2 appears 2 times");
  console.log();

  // Example 2
  console.log("=== Example 2: Multiple Frequencies ===");
  const nums2 = [4, 1, 1, 1, 2, 2, 3];
  const k2 = 2;
  console.log("Input: nums =", nums2, ", k =", k2);
  console.log("Min-Heap output:", topKFrequentMinHeap([...nums2], k2)); // [1, 2]
  console.log("QuickSelect output:", topKFrequentQuickSelect([...nums2], k2)); // [1, 2]
  console.log(
    "QuickSelect Optimized output:",
    topKFrequentQuickSelectOptimized([...nums2], k2),
  ); // [1, 2]
  console.log("Explanation: 1 (3x), 2 (2x), 3 (1x), 4 (1x)");
  console.log();

  // Example 3
  console.log("=== Example 3: k = 1 (Single Most Frequent) ===");
  const nums3 = [1];
  const k3 = 1;
  console.log("Input: nums =", nums3, ", k =", k3);
  console.log("Min-Heap output:", topKFrequentMinHeap([...nums3], k3)); // [1]
  console.log("QuickSelect output:", topKFrequentQuickSelect([...nums3], k3)); // [1]
  console.log(
    "QuickSelect Optimized output:",
    topKFrequentQuickSelectOptimized([...nums3], k3),
  ); // [1]
  console.log();

  // Example 4
  console.log("=== Example 4: All Unique Elements ===");
  const nums4 = [1, 2, 3, 4, 5];
  const k4 = 2;
  console.log("Input: nums =", nums4, ", k =", k4);
  console.log("Min-Heap output:", topKFrequentMinHeap([...nums4], k4)); // [1, 2] or any 2
  console.log("QuickSelect output:", topKFrequentQuickSelect([...nums4], k4)); // [1, 2] or any 2
  console.log(
    "QuickSelect Optimized output:",
    topKFrequentQuickSelectOptimized([...nums4], k4),
  ); // [1, 2] or any 2
  console.log("Explanation: All appear once, any 2 elements are valid");
  console.log();

  // Example 5
  console.log("=== Example 5: Large Dataset ===");
  const nums5 = [1, 1, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5];
  const k5 = 3;
  console.log("Input: nums =", nums5, ", k =", k5);
  console.log("Min-Heap output:", topKFrequentMinHeap([...nums5], k5)); // [1, 3, 4]
  console.log("QuickSelect output:", topKFrequentQuickSelect([...nums5], k5)); // [1, 3, 4]
  console.log(
    "QuickSelect Optimized output:",
    topKFrequentQuickSelectOptimized([...nums5], k5),
  ); // [1, 3, 4]
  console.log("Explanation: 3 appears 4x, 1 appears 3x, 4 appears 3x");
  console.log();

  // Example 6
  console.log("=== Example 6: Negative Numbers ===");
  const nums6 = [-1, -1, 0, 1, 1, 1];
  const k6 = 2;
  console.log("Input: nums =", nums6, ", k =", k6);
  console.log("Min-Heap output:", topKFrequentMinHeap([...nums6], k6)); // [1, -1]
  console.log("QuickSelect output:", topKFrequentQuickSelect([...nums6], k6)); // [1, -1]
  console.log(
    "QuickSelect Optimized output:",
    topKFrequentQuickSelectOptimized([...nums6], k6),
  ); // [1, -1]
  console.log("Explanation: 1 appears 3x, -1 appears 2x");
}

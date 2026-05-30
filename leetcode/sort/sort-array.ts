import { MinHeap } from "../../structures/heap/min-heap";
import { radixSort } from "../../algorithms/sort/non-comparison/radix-sort";
import { mergeSort as mergeSortAlgo } from "../../algorithms/sort/divide-conquer/merge-sort";

/**
 * Sort an Array - LeetCode Problem 912
 *
 * Given an array of integers nums, sort the array in ascending order and return it.
 *
 * You must solve this problem without using the library's sort function.
 *
 * @example
 * Input: nums = [5,2,3,1]
 * Output: [1,2,3,5]
 * Explanation: Elements are sorted in ascending order.
 *
 * @example
 * Input: nums = [5,1,1,2,0,0]
 * Output: [0,0,1,1,2,5]
 * Explanation: Duplicate values are allowed.
 *
 * @constraints
 * - 1 <= nums.length <= 50000
 * - -50000 <= nums[i] <= 50000
 *
 * ## Approaches
 *
 * **Approach 1: Min-Heap (Implemented)**
 *
 * Use a min-heap to extract elements in sorted order:
 * 1. Insert all elements into min-heap: O(n)
 * 2. Extract all elements in order: O(n log n)
 * 3. Return sorted array
 *
 * @time O(n log n) - heap operations for each element
 * @space O(n) - heap storage
 *
 * **Trade-off:** Simple, intuitive, uses project's MinHeap structure.
 * Works efficiently for any integer range including negatives.
 *
 * **Approach 2: Merge Sort (Alternative)**
 *
 * Divide-and-conquer approach:
 * 1. Divide array in half recursively
 * 2. Merge sorted halves
 * 3. Return merged result
 *
 * @time O(n log n) - optimal comparison sort
 * @space O(n) - auxiliary arrays for merging
 *
 * **Trade-off:** Best for comparison-based sorting, stable sort.
 *
 * **Approach 3: Quick Sort (Alternative)**
 *
 * Partition-based approach:
 * 1. Choose pivot, partition array
 * 2. Recursively sort partitions
 * 3. Concatenate results
 *
 * @time O(n log n) average - O(n²) worst case
 * @space O(log n) - recursion stack
 *
 * **Trade-off:** Faster in practice, but unstable and worst-case O(n²).
 *
 * **Approach 4: Radix Sort (Alternative - Linear Time)**
 *
 * Non-comparison digit-by-digit sorting:
 * 1. Handle negative numbers separately
 * 2. Sort by each digit position (least to most significant)
 * 3. Combine positive and negative sorted arrays
 *
 * @time O(d*(n+k)) where d=digits, k=base → O(n) for bounded integers
 * @space O(n) - buckets
 *
 * **Trade-off:** O(n) time but only for non-negative integers.
 * With negatives, O(n) becomes O(n) for positive + O(n) for negative.
 *
 * @date 30/01/2026
 */

/**
 * **Approach 1: Min-Heap (Extract Minimums)**
 *
 * Time: O(n log n)
 * Space: O(n)
 *
 * Extract minimum elements from min-heap repeatedly to get sorted array.
 * Uses the project's MinHeap data structure for clean, efficient implementation.
 *
 * Algorithm:
 * 1. Insert all elements into min-heap: O(n log n) - each add is O(log n)
 * 2. Extract minimum n times: O(n log n) total - each poll is O(log n)
 * 3. Each extraction pops root and restores heap property via bubbleDown
 */
function sortArrayHeap(nums: number[]): number[] {
  if (nums.length <= 1) {
    return [...nums];
  }

  // Step 1: Create min-heap and add all elements
  const minHeap = new MinHeap<number>();
  for (const num of nums) {
    minHeap.add(num);
  }

  // Step 2: Extract elements in sorted order
  const result: number[] = [];
  while (minHeap.size() > 0) {
    result.push(minHeap.poll());
  }

  return result;
}

/**
 * **Approach 2: Merge Sort (Divide and Conquer)**
 *
 * Time: O(n log n) - guaranteed
 * Space: O(n) - auxiliary arrays
 *
 * Classic divide-and-conquer approach:
 * 1. **Divide:** Split array into two halves recursively
 * 2. **Conquer:** Recursively sort each half
 * 3. **Combine:** Merge two sorted halves back together
 *
 * Uses the project's optimized merge sort implementation from algorithms module.
 *
 * Key advantages:
 * - Guaranteed O(n log n) performance (unlike QuickSort's worst case)
 * - Stable sort (preserves relative order of equal elements)
 * - Predictable, cache-friendly access patterns
 * - Reuses tested implementation (DRY principle)
 */
function sortArrayMerge(nums: number[]): number[] {
  if (nums.length <= 1) {
    return [...nums];
  }

  // Use the project's merge sort implementation
  return mergeSortAlgo([...nums]);
}

/**
 * **Approach 4: Radix Sort (Handles Negatives)**
 *
 * Time: O(d*(n+k)) = O(n) for bounded integers
 * Space: O(n) for buckets
 *
 * Extend radix sort to handle negative numbers by:
 * 1. Separating negatives and non-negatives
 * 2. Sorting non-negatives with radix sort
 * 3. Sorting absolute values of negatives with radix sort
 * 4. Reversing negative sorted array (descending absolute values)
 * 5. Concatenating: negatives (ascending) + non-negatives
 *
 * Key insight: Radix sort is fastest for arrays with bounded range.
 */
function sortArrayRadix(nums: number[]): number[] {
  // Edge case: empty or single element
  if (nums.length <= 1) {
    return [...nums];
  }

  // Separate negatives and non-negatives
  const negatives: number[] = [];
  const nonNegatives: number[] = [];

  for (const num of nums) {
    if (num < 0) {
      negatives.push(Math.abs(num)); // Store absolute value
    } else {
      nonNegatives.push(num);
    }
  }

  // Sort both parts using radix sort
  const sortedPositives =
    nonNegatives.length > 0 ? radixSort(nonNegatives) : [];
  const sortedNegativeAbsolutes =
    negatives.length > 0 ? radixSort(negatives) : [];

  // Reverse negative absolutes to get them in ascending order
  // e.g., [-5, -3, -1] have absolutes [5, 3, 1]
  // radix sorts to [1, 3, 5]
  // reversed becomes [5, 3, 1] which represents [-5, -3, -1]
  sortedNegativeAbsolutes.reverse();

  // Convert back to negative numbers
  const result: number[] = [];

  // Add negatives in ascending order (most negative first)
  for (const abs of sortedNegativeAbsolutes) {
    result.push(-abs);
  }

  // Add non-negatives
  result.push(...sortedPositives);

  return result;
}

// Example usage
if (require.main === module) {
  console.log("=== Sort an Array - LeetCode 912 ===\n");

  console.log("=== Example 1: Mixed positive and negative ===");
  const nums1 = [5, 2, 3, 1];
  console.log("Input:", nums1);
  console.log("Heap Sort:", sortArrayHeap(nums1));
  console.log("Merge Sort:", sortArrayMerge(nums1));
  console.log("Radix Sort:", sortArrayRadix(nums1));
  console.log("Expected: [1,2,3,5]");
  console.log();

  console.log("=== Example 2: Duplicates ===");
  const nums2 = [5, 1, 1, 2, 0, 0];
  console.log("Input:", nums2);
  console.log("Heap Sort:", sortArrayHeap(nums2));
  console.log("Merge Sort:", sortArrayMerge(nums2));
  console.log("Radix Sort:", sortArrayRadix(nums2));
  console.log("Expected: [0,0,1,1,2,5]");
  console.log();

  console.log("=== Example 3: With negatives ===");
  const nums3 = [3, -1, 0, -5, 4];
  console.log("Input:", nums3);
  console.log("Heap Sort:", sortArrayHeap(nums3));
  console.log("Merge Sort:", sortArrayMerge(nums3));
  console.log("Radix Sort:", sortArrayRadix(nums3));
  console.log("Expected: [-5,-1,0,3,4]");
  console.log();

  console.log("=== Example 4: All negatives ===");
  const nums4 = [-3, -1, -5, -4];
  console.log("Input:", nums4);
  console.log("Heap Sort:", sortArrayHeap(nums4));
  console.log("Merge Sort:", sortArrayMerge(nums4));
  console.log("Radix Sort:", sortArrayRadix(nums4));
  console.log("Expected: [-5,-4,-3,-1]");
  console.log();

  console.log("=== Example 5: Single element ===");
  const nums5 = [42];
  console.log("Input:", nums5);
  console.log("Heap Sort:", sortArrayHeap(nums5));
  console.log("Merge Sort:", sortArrayMerge(nums5));
  console.log("Radix Sort:", sortArrayRadix(nums5));
  console.log("Expected: [42]");
  console.log();

  console.log("=== Example 6: Already sorted ===");
  const nums6 = [1, 2, 3, 4, 5];
  console.log("Input:", nums6);
  console.log("Heap Sort:", sortArrayHeap(nums6));
  console.log("Merge Sort:", sortArrayMerge(nums6));
  console.log("Radix Sort:", sortArrayRadix(nums6));
  console.log("Expected: [1,2,3,4,5]");
  console.log();

  console.log("=== Example 7: Reverse sorted ===");
  const nums7 = [5, 4, 3, 2, 1];
  console.log("Input:", nums7);
  console.log("Heap Sort:", sortArrayHeap(nums7));
  console.log("Merge Sort:", sortArrayMerge(nums7));
  console.log("Radix Sort:", sortArrayRadix(nums7));
  console.log("Expected: [1,2,3,4,5]");
  console.log();

  console.log("=== Example 8: Large range ===");
  const nums8 = [-50000, 50000, 0, 25000, -25000];
  console.log("Input:", nums8);
  console.log("Heap Sort:", sortArrayHeap(nums8));
  console.log("Merge Sort:", sortArrayMerge(nums8));
  console.log("Radix Sort:", sortArrayRadix(nums8));
  console.log("Expected: [-50000,-25000,0,25000,50000]");
  console.log();

  console.log("=== Performance Comparison ===");
  const largeArray = Array.from({ length: 50000 }, () =>
    Math.floor(Math.random() * 100000 - 50000),
  );

  const startHeap = performance.now();
  const resultHeap = sortArrayHeap([...largeArray]);
  const timeHeap = performance.now() - startHeap;

  const startMerge = performance.now();
  const resultMerge = sortArrayMerge([...largeArray]);
  const timeMerge = performance.now() - startMerge;

  const startRadix = performance.now();
  const resultRadix = sortArrayRadix([...largeArray]);
  const timeRadix = performance.now() - startRadix;

  console.log(`Array size: ${largeArray.length}`);
  console.log(`Heap Sort time: ${timeHeap.toFixed(2)}ms (O(n log n))`);
  console.log(`Merge Sort time: ${timeMerge.toFixed(2)}ms (O(n log n) stable)`);
  console.log(`Radix Sort time: ${timeRadix.toFixed(2)}ms (O(n))`);
  console.log();
  console.log(`Merge vs Heap: ${(timeMerge / timeHeap).toFixed(2)}x`);
  console.log(
    `Radix vs Merge: ${(timeRadix / timeMerge).toFixed(2)}x - Radix sort is faster for large arrays!`,
  );
  console.log();
}

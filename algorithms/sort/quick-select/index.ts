import { partition } from "../../utils/partition";

/**
 * QuickSelect Algorithm - Find kth smallest element in average O(n) time
 *
 * Divide and conquer approach using partitioning similar to QuickSort.
 * Instead of fully sorting, we only partition until we find the kth element.
 *
 * **Algorithm:**
 * 1. Partition array using a pivot (similar to QuickSort)
 * 2. If pivot index equals k, return that element
 * 3. If k < pivot index, search left partition
 * 4. If k > pivot index, search right partition
 *
 * **Complexity Analysis:**
 * - Average case: **O(n)** - Each partition eliminates half the array
 * - Worst case: **O(n²)** - When pivot is always smallest/largest
 *
 * **Space Complexity:** **O(1)** - In-place partitioning (ignoring recursion stack: O(log n) avg)
 *
 * **Stability:** Not stable (elements equal to pivot can be reordered)
 *
 * **When to use:**
 * - Finding median or percentiles
 * - Kth smallest/largest element queries
 * - Better average case than heap for small k values
 * - When in-place is required
 *
 * **Weaknesses:**
 * - Worst-case O(n²) is worse than heap's O(n log n)
 * - Modifies original array (unless copied)
 * - Less consistent than heap-based approaches
 *
 * @param array - Array to search in
 * @param k - Target index (0-indexed, where 0 = smallest)
 * @param left - Left boundary (default: 0)
 * @param right - Right boundary (default: array.length - 1)
 * @returns The kth smallest element
 *
 * @example
 * const arr = [3, 2, 1, 5, 6, 4];
 * quickSelect([...arr], 2); // Returns 3 (3rd smallest element)
 * quickSelect([...arr], 4); // Returns 5 (5th smallest element)
 *
 * @date 26/01/2026
 */
export const quickSelect = (
  array: number[],
  k: number,
  left: number = 0,
  right: number = array.length - 1,
): number => {
  if (left === right) return array[left];

  // Partition the array and get pivot index
  const pivotIndex = partition(array, left, right);

  if (k === pivotIndex) {
    return array[k];
  } else if (k < pivotIndex) {
    return quickSelect(array, k, left, pivotIndex - 1);
  } else {
    return quickSelect(array, k, pivotIndex + 1, right);
  }
};

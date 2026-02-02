/**
 * Height Checker - LeetCode Problem 1051
 *
 * Problem Statement:
 * A school is trying to take an annual photo of all the students. The students
 * are asked to stand in a single file line in non-decreasing order by height.
 * Let this ordering be represented by the integer array expected where
 * expected[i] is the expected height of the ith student in line.
 *
 * You are given an integer array heights representing the current order that
 * the students are standing in. Each heights[i] is the height of the ith
 * student in line (0-indexed).
 *
 * Return the number of indices where heights[i] != expected[i].
 *
 * @example
 * Input: heights = [1, 1, 4, 2, 1, 3]
 * Output: 3
 * Explanation: heights: [1, 1, 4, 2, 1, 3]
 *              expected: [1, 1, 1, 2, 3, 4]
 * Indices 2, 4, 5 have different values (4≠1, 1≠3, 3≠4)
 *
 * @example
 * Input: heights = [5, 1, 2, 3, 4]
 * Output: 5
 * Explanation: All students are standing in wrong positions
 *
 * @constraints
 * - 1 <= heights.length <= 100
 * - 1 <= heights[i] <= 100
 *
 * ## Approaches
 *
 * **Approach 1: Bubble Sort (Implemented - Intuitive)**
 *
 * Algorithm:
 * 1. Create a copy of heights array
 * 2. Sort the copy using bubble sort to get expected positions
 * 3. Compare original array with sorted array element by element
 * 4. Count positions where they differ
 *
 * Implementation details:
 * - Uses bubble sort to demonstrate sorting approach
 * - Array comparison is straightforward and clear
 * - Mismatches identified directly from comparison
 *
 * @time O(n²) - bubble sort dominates the comparison
 * @space O(n) - need copy of array for expected ordering
 *
 * **Trade-off:** Intuitive and educational, uses direct sorting comparison.
 * Pattern: Sort and compare for position verification.
 *
 * **Approach 2: Quick Sort (Alternative)**
 *
 * Use a faster sorting algorithm (Quick Sort) instead of bubble sort:
 * 1. Create a copy of heights array
 * 2. Sort the copy using quick sort
 * 3. Compare and count mismatches
 *
 * @time O(n log n) average case - much faster than bubble sort
 * @space O(n) - need copy + O(log n) recursion stack
 * **Trade-off:** More efficient sorting, same comparison approach.
 *
 * **Approach 3: Counting Sort (Alternative)**
 *
 * Since heights are in range [1, 100], use counting sort:
 * 1. Count frequency of each height
 * 2. Reconstruct sorted array from counts
 * 3. Compare and count mismatches
 *
 * @time O(n + k) where k = max height (100)
 * @space O(k) - counting array for heights
 * **Trade-off:** Most efficient when range is limited (heights 1-100).
 * Best for: This specific problem with bounded values.
 *
 * **Approach 4: Heap Sort (Alternative)**
 *
 * Use a heap-based sorting approach:
 * 1. Build a min-heap from heights
 * 2. Extract elements in sorted order
 * 3. Compare and count mismatches
 *
 * @time O(n log n) - heap operations
 * @space O(n) - heap structure
 * **Trade-off:** Guaranteed O(n log n), in-place heap construction possible.
 *
 * @date 28/01/2026
 */

import { bubbleSort } from "../../algorithms/sort/comparison/bubble-sort";

/**
 * **Approach 1: Bubble Sort (Position Verification)**
 *
 * Time: O(n²) - bubble sort complexity
 * Space: O(n) - copy of array
 *
 * Create sorted copy using bubble sort, then count mismatches.
 * Simple and educational approach showing the concept clearly.
 *
 * Key insight: Any position where heights[i] != expected[i] means
 * the student at that position is standing in wrong height order.
 */
function heightChecker(heights: number[]): number {
  // Create a copy of heights to sort
  const expected = [...heights];

  // Sort the copy using bubble sort
  bubbleSort(expected);

  // Count positions where current != expected
  let mismatches = 0;
  for (let i = 0; i < heights.length; i++) {
    if (heights[i] !== expected[i]) {
      mismatches++;
    }
  }

  return mismatches;
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Partial mismatch ===");
  const heights1 = [1, 1, 4, 2, 1, 3];
  console.log(`Input: [${heights1}]`);
  console.log(`Expected (sorted): [1, 1, 1, 2, 3, 4]`);
  console.log(`Result: ${heightChecker(heights1)}`);
  console.log(`Expected: 3`);
  console.log(`Explanation:
  Index 0: 1 = 1 ✓
  Index 1: 1 = 1 ✓
  Index 2: 4 ≠ 1 ✗ (mismatch)
  Index 3: 2 = 2 ✓
  Index 4: 1 ≠ 3 ✗ (mismatch)
  Index 5: 3 ≠ 4 ✗ (mismatch)
  Total mismatches: 3`);
  console.log();

  console.log("=== Example 2: Completely reverse sorted ===");
  const heights2 = [5, 1, 2, 3, 4];
  console.log(`Input: [${heights2}]`);
  console.log(`Expected (sorted): [1, 2, 3, 4, 5]`);
  console.log(`Result: ${heightChecker(heights2)}`);
  console.log(`Expected: 5`);
  console.log(
    `Explanation: All students in wrong positions (completely reversed)`,
  );
  console.log();

  console.log("=== Example 3: Already sorted ===");
  const heights3 = [1, 2, 3, 4, 5];
  console.log(`Input: [${heights3}]`);
  console.log(`Expected (sorted): [1, 2, 3, 4, 5]`);
  console.log(`Result: ${heightChecker(heights3)}`);
  console.log(`Expected: 0`);
  console.log(`Explanation: All students already in correct positions`);
  console.log();

  console.log("=== Example 4: All same height ===");
  const heights4 = [2, 2, 2, 2, 2];
  console.log(`Input: [${heights4}]`);
  console.log(`Expected (sorted): [2, 2, 2, 2, 2]`);
  console.log(`Result: ${heightChecker(heights4)}`);
  console.log(`Expected: 0`);
  console.log(`Explanation: Order doesn't matter when all same height`);
  console.log();

  console.log("=== Example 5: Two elements out of place ===");
  const heights5 = [1, 3, 2, 4];
  console.log(`Input: [${heights5}]`);
  console.log(`Expected (sorted): [1, 2, 3, 4]`);
  console.log(`Result: ${heightChecker(heights5)}`);
  console.log(`Expected: 2`);
  console.log(`Explanation:
  Index 0: 1 = 1 ✓
  Index 1: 3 ≠ 2 ✗ (mismatch)
  Index 2: 2 ≠ 3 ✗ (mismatch)
  Index 3: 4 = 4 ✓
  Total mismatches: 2`);
  console.log();
}

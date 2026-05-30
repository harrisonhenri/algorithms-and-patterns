/**
 * Query Kth Smallest Trimmed Number - LeetCode Problem 1851
 *
 * You are given a 0-indexed array of strings nums, where each string is of equal length
 * and consists of only digits.
 *
 * You are also given a 0-indexed 2D integer array queries where queries[i] = [ki, trimi].
 * For each queries[i], you need to:
 *
 * 1. Trim each number in nums to its rightmost trimi digits.
 * 2. Determine the index of the kith smallest trimmed number in nums.
 *    If two trimmed numbers are equal, the number with the lower index is considered smaller.
 * 3. Reset each number in nums to its original length.
 *
 * Return an array answer of the same length as queries, where answer[i] is the answer
 * to the ith query.
 *
 * **Note:**
 * - To trim to the rightmost x digits means to keep removing the leftmost digit,
 *   until only x digits remain.
 * - Strings in nums may contain leading zeros.
 *
 * @example
 * Input: nums = ["102","473","251","814"], queries = [[1,1],[2,3],[4,2],[1,2]]
 * Output: [2,2,1,0]
 *
 * Explanation:
 * 1. After trimming to the last digit, nums = ["2","3","1","4"].
 *    The 1st smallest is "1" at index 2.
 * 2. Trimmed to the last 3 digits, nums is unchanged = ["102","473","251","814"].
 *    The 2nd smallest is "251" at index 2.
 * 3. Trimmed to the last 2 digits, nums = ["02","73","51","14"].
 *    The 4th smallest is "73" (index 1).
 * 4. Trimmed to the last 2 digits, nums = ["02","73","51","14"].
 *    The 1st smallest is "02" at index 0.
 *
 * @example
 * Input: nums = ["24","37","96","04"], queries = [[2,1],[2,2]]
 * Output: [3,0]
 *
 * Explanation:
 * 1. Trimmed to the last digit, nums = ["4","7","6","4"].
 *    The 2nd smallest is "4" at index 3 (first "4" is at index 0).
 * 2. Trimmed to the last 2 digits, nums = ["24","37","96","04"].
 *    The 2nd smallest is "24" at index 0.
 *
 * @constraints
 * - 1 <= nums.length <= 100
 * - 1 <= nums[i].length <= 100
 * - nums[i] consists of only digits.
 * - All nums[i].length is the same.
 * - 1 <= queries.length <= 100
 * - 1 <= ki <= nums.length
 * - 1 <= trimi <= nums[i].length
 * - Multiple queries can have different trim lengths.
 *
 * ## Approaches
 *
 * **Approach 1: Simple Sort and Access**
 *
 * For each query:
 * 1. Trim all numbers to the specified length
 * 2. Create (trimmed_value, original_index) pairs
 * 3. Sort pairs in ascending order (by value, then by index)
 * 4. Return the original index at position k-1
 *
 * @time O(q * n log n) where q = number of queries, n = array size
 * @space O(n) for pairs array
 *
 * **Why this works:**
 * - Simple and straightforward approach
 * - Comparison sort is efficient for small to medium arrays
 * - Sorting by value then by index naturally handles ties
 * - Time complexity O(n log n) per query is acceptable for n ≤ 100
 *
 * **Trade-off:** General-purpose approach, good baseline
 *
 * **Approach 2: Radix Sort (Optimal for multiple queries)**
 *
 * For each query:
 * 1. Trim all numbers to the specified length
 * 2. Use radix sort to sort pairs (trimmed_value, original_index)
 * 3. Return the index of the kth pair (1-indexed becomes 0-indexed)
 *
 * **Why radix sort is better:**
 * - Radix sort for strings is O(n * m) where m = trim length
 * - Heap approach is O(n log k) which is slower when k is large
 * - Both have same asymptotic, but radix sort has better constants for string sorting
 * - Radix sort is stable, naturally handles duplicate trimmed values with index ordering
 *
 * Algorithm:
 * 1. For each query [k, trim]:
 *    a. Extract last `trim` characters from each number
 *    b. Create array of [trimmedString, originalIndex] pairs
 *    c. Radix sort pairs by trimmed string (lexicographically)
 *    d. Return original_index of pair at position k-1
 *
 * @time O(q * (n * m + k)) where q = queries, m = trim length, n = array size
 * @space O(n) for pairs and sorting
 *
 * **Trade-off:** Radix sort excels when:
 * - Trim length is small (string length is bounded)
 * - Many queries (can reuse same sorting for different k values)
 * - Strings have repeated characters (radix sort handles well)
 *
 * **Approach 3: Max-Heap with Project's Heap Structure (Optimal for single queries)**
 *
 * For each query:
 * 1. Trim all numbers to the specified length
 * 2. Create (trimmed_value, original_index) pairs
 * 3. Use a max-heap to maintain only the k smallest elements
 * 4. Return the index of the kth smallest (heap root)
 *
 * **Why this approach:**
 * - Uses project's optimized MaxHeap implementation
 * - O(n log k) time complexity - only heap operations on k elements
 * - Efficient when k is much smaller than n
 * - Better than radix sort when k << n
 *
 * Algorithm:
 * 1. For each query [k, trim]:
 *    a. Extract last `trim` characters from each number
 *    b. Create array of [trimmedString, originalIndex] pairs
 *    c. Build max-heap from first k pairs
 *    d. For each remaining pair:
 *       - If pair < heap.root, remove root and add pair
 *    e. Return original_index of heap.root (the kth smallest)
 *
 * @time O(q * n log k) where q = queries, k = kth smallest, n = array size
 * @space O(k) for max-heap
 *
 * **Trade-off:** Best when:
 * - k is small compared to n
 * - Single queries are processed (no reuse of sorted data)
 * - Memory efficiency is important
 *
 * @date 30/01/2026
 */

import { MinHeap } from "../../structures/heap/min-heap";

/**
 * **Approach 1: Simple Sort and Access**
 *
 * Time: O(q * n log n), Space: O(n)
 * Straightforward: trim, sort ascending, return kth smallest.
 */
function smallestTrimmedNumbersSort(
  nums: string[],
  queries: number[][],
): number[] {
  const result: number[] = [];

  for (const [k, trim] of queries) {
    // Create pairs of [trimmedValue, originalIndex]
    const pairs: [string, number][] = nums.map((num, idx) => [
      num.slice(-trim),
      idx,
    ]);

    // Sort ascending by trimmed value, then by index
    pairs.sort((a, b) => {
      if (a[0] !== b[0]) {
        return a[0].localeCompare(b[0]); // Ascending order for values
      }
      return a[1] - b[1]; // Ascending order for indices (lower index first)
    });

    // Return the original index of the kth smallest (k is 1-indexed)
    result.push(pairs[k - 1][1]);
  }

  return result;
}

/**
 * **Approach 2: Radix Sort for Strings (Optimal)**
 *
 * Time: O(q * n * m) where m = trim length, Space: O(n)
 * Best for multiple queries and moderate trim lengths.
 *
 * Radix sort handles string sorting naturally by processing characters
 * from right to left (least to most significant position).
 */
function smallestTrimmedNumbersRadixSort(
  nums: string[],
  queries: number[][],
): number[] {
  const result: number[] = [];

  for (const [k, trim] of queries) {
    // Step 1: Extract trimmed values with original indices
    const pairs: [string, number][] = nums.map((num, idx) => [
      num.slice(-trim),
      idx,
    ]);

    // Step 2: Radix sort pairs by trimmed string (character by character)
    // Process from rightmost character to leftmost (LSD radix sort for strings)
    const sorted = radixSortStringPairs(pairs, trim);

    // Step 3: Return the original index of the kth smallest (k is 1-indexed)
    result.push(sorted[k - 1][1]);
  }

  return result;
}

/**
 * **Approach 3: Min-Heap (Efficient for processing all elements)**
 *
 * Time: O(q * n log n), Space: O(n)
 * Uses MinHeap to sort all pairs and extract the kth smallest.
 *
 * Alternative approach that leverages the project's MinHeap structure
 * for a different perspective on the problem.
 */
function smallestTrimmedNumbersMaxHeap(
  nums: string[],
  queries: number[][],
): number[] {
  const result: number[] = [];

  for (const [k, trim] of queries) {
    // Step 1: Create pairs of [trimmedValue, originalIndex]
    const pairs: [string, number][] = nums.map((num, idx) => [
      num.slice(-trim),
      idx,
    ]);

    // Step 2: Use MinHeap to sort pairs
    // MinHeap naturally puts smallest at root
    type Pair = [string, number];

    const compareFn = (a: Pair, b: Pair): number => {
      const cmp = a[0].localeCompare(b[0]);
      if (cmp !== 0) return cmp;
      return a[1] - b[1];
    };

    const minHeap = MinHeap.from(pairs, compareFn);

    // Step 3: Poll k-1 smallest elements, leaving kth at root
    for (let i = 1; i < k; i++) {
      minHeap.poll();
    }

    // Step 4: Return the original index of the kth smallest (heap root)
    result.push(minHeap.peek()[1]);
  }

  return result;
}

/**
 * Radix sort for string-index pairs
 * Sorts lexicographically by trimmed string, preserving index order for equal strings
 *
 * @param pairs - Array of [trimmedString, originalIndex] pairs
 * @param maxLength - Maximum string length to sort by
 * @returns Sorted pairs array
 *
 * @time O(n * m) where n = number of pairs, m = string length
 * @space O(n) for buckets
 */
function radixSortStringPairs(
  pairs: [string, number][],
  maxLength: number,
): [string, number][] {
  let sorted = [...pairs];

  // Process each character position from right to left (LSD approach)
  for (let pos = maxLength - 1; pos >= 0; pos--) {
    // Create 10 buckets for digits (0-9)
    const buckets: [string, number][][] = Array.from({ length: 10 }, () => []);

    // Place each pair in bucket based on digit at current position
    for (const pair of sorted) {
      const digit = parseInt(pair[0][pos], 10);
      buckets[digit].push(pair);
    }

    // Concatenate buckets back into sorted array (stable sort)
    sorted = buckets.flat();
  }

  return sorted;
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Multiple Queries ===");
  const nums1 = ["102", "473", "251", "814"];
  const queries1 = [
    [1, 1],
    [2, 3],
    [4, 2],
    [1, 2],
  ];
  console.log("Input: nums =", nums1);
  console.log("Queries =", queries1);
  console.log("Sort approach:", smallestTrimmedNumbersSort(nums1, queries1));
  console.log(
    "Radix sort approach:",
    smallestTrimmedNumbersRadixSort(nums1, queries1),
  );
  console.log(
    "MaxHeap approach:",
    smallestTrimmedNumbersMaxHeap(nums1, queries1),
  );
  console.log("Expected: [2, 2, 1, 0]");
  console.log();

  console.log("=== Example 2: Duplicates in Trimmed Values ===");
  const nums2 = ["24", "37", "96", "04"];
  const queries2 = [
    [2, 1],
    [2, 2],
  ];
  console.log("Input: nums =", nums2);
  console.log("Queries =", queries2);
  console.log("Sort approach:", smallestTrimmedNumbersSort(nums2, queries2));
  console.log(
    "Radix sort approach:",
    smallestTrimmedNumbersRadixSort(nums2, queries2),
  );
  console.log(
    "MaxHeap approach:",
    smallestTrimmedNumbersMaxHeap(nums2, queries2),
  );
  console.log("Expected: [3, 0]");
  console.log();

  console.log("=== Example 3: Single Query ===");
  const nums3 = ["5", "1", "9", "8", "3"];
  const queries3 = [[2, 1]];
  console.log("Input: nums =", nums3);
  console.log("Queries =", queries3);
  console.log("Sort approach:", smallestTrimmedNumbersSort(nums3, queries3));
  console.log(
    "Radix sort approach:",
    smallestTrimmedNumbersRadixSort(nums3, queries3),
  );
  console.log(
    "MaxHeap approach:",
    smallestTrimmedNumbersMaxHeap(nums3, queries3),
  );
  console.log("Expected: [3] (2nd smallest is '3' at index 4)");
  console.log();

  console.log("=== Example 4: Leading Zeros ===");
  const nums4 = ["001", "010", "100", "020"];
  const queries4 = [[1, 2]];
  console.log("Input: nums =", nums4);
  console.log("Queries =", queries4);
  console.log("Sort approach:", smallestTrimmedNumbersSort(nums4, queries4));
  console.log(
    "Radix sort approach:",
    smallestTrimmedNumbersRadixSort(nums4, queries4),
  );
  console.log(
    "MaxHeap approach:",
    smallestTrimmedNumbersMaxHeap(nums4, queries4),
  );
  console.log(
    "Expected: [0] (1st smallest trimmed to last 2 is '01' at index 0)",
  );
  console.log();

  console.log("=== Example 5: Kth = N (Find Maximum) ===");
  const nums5 = ["42", "17", "88", "23"];
  const queries5 = [[4, 2]];
  console.log("Input: nums =", nums5);
  console.log("Queries =", queries5);
  console.log("Sort approach:", smallestTrimmedNumbersSort(nums5, queries5));
  console.log(
    "Radix sort approach:",
    smallestTrimmedNumbersRadixSort(nums5, queries5),
  );
  console.log(
    "MaxHeap approach:",
    smallestTrimmedNumbersMaxHeap(nums5, queries5),
  );
  console.log("Expected: [2] (4th/largest is '88' at index 2)");
  console.log();

  console.log("=== Example 6: All Same Trimmed Values ===");
  const nums6 = ["123", "456", "789"];
  const queries6 = [[2, 1]];
  console.log("Input: nums =", nums6);
  console.log("Queries =", queries6);
  console.log("Sort approach:", smallestTrimmedNumbersSort(nums6, queries6));
  console.log(
    "Radix sort approach:",
    smallestTrimmedNumbersRadixSort(nums6, queries6),
  );
  console.log(
    "MaxHeap approach:",
    smallestTrimmedNumbersMaxHeap(nums6, queries6),
  );
  console.log(
    "Expected: [1] (all trim to '3', '6', '9' respectively, 2nd is '6' at index 1)",
  );
}

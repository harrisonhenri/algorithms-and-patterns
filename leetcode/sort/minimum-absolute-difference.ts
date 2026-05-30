/**
 * Minimum Absolute Difference of Array - LeetCode Problem 1200
 *
 * Given an array of distinct integers arr, find all pairs of elements with the
 * minimum absolute difference of any two elements.
 *
 * Return a list of pairs in ascending order (with respect to pairs), each pair [a, b] follows:
 * - a, b are from arr
 * - a < b
 * - b - a equals to the minimum absolute difference of any two elements in arr
 *
 * @example
 * Input: arr = [4,2,1,3]
 * Output: [[1,2],[2,3],[3,4]]
 *
 * Explanation:
 * - The minimum absolute difference is 1, and there are three pairs with difference 1.
 * - Pairs: (1,2), (2,3), (3,4)
 *
 * @example
 * Input: arr = [1,3,6,10,15]
 * Output: [[1,3]]
 *
 * Explanation:
 * - The minimum absolute difference is 2, and only (1,3) has this difference.
 *
 * @example
 * Input: arr = [3,8,10,3]
 * Output: [[3,8]]
 *
 * Explanation:
 * - The minimum difference is 5, and (3,8) is the only pair with this difference.
 *
 * @constraints
 * - 1 <= arr.length <= 10^5
 * - -10^6 <= arr[i] <= 10^6
 * - All the values of arr are unique.
 *
 * ## Approaches
 *
 * **Approach 1: Sort + Single Pass (Optimal)**
 *
 * The key insight is that if we sort the array, the minimum difference will always be
 * between adjacent elements in the sorted array. Then we can:
 * 1. Sort the array
 * 2. Find the minimum difference by comparing adjacent elements
 * 3. Collect all pairs with that minimum difference
 *
 * Algorithm:
 * 1. Sort array (O(n log n) for comparison sorts)
 * 2. Iterate through consecutive pairs, track minimum difference
 * 3. Collect pairs with minimum difference in a second pass
 *
 * @time O(n log n) - dominated by sorting
 * @space O(1) or O(n) depending on in-place sort implementation
 *
 * **Why this works:**
 * - After sorting, any minimum difference must occur between adjacent elements
 * - Non-adjacent elements can never have a smaller difference than adjacent ones
 * - Example: For [1,2,3,10], sorted is [1,2,3,10]
 *   - Compare 1-2 (diff=1), 2-3 (diff=1), 3-10 (diff=7)
 *   - Min difference is 1, found between adjacent elements
 *
 * **Approach 2: Counting Sort (Optimal for bounded range)**
 *
 * When the range of values is small relative to the array size, counting sort provides
 * a faster alternative:
 * 1. Find min and max values to determine range
 * 2. Use counting sort to sort the array in O(n + k) time where k is the range
 * 3. Find minimum difference and collect pairs
 *
 * Algorithm:
 * 1. Find min and max in array
 * 2. Count frequency of each value (offset by min to handle negatives)
 * 3. Reconstruct sorted array by iterating through counts
 * 4. Find minimum difference and collect pairs
 *
 * @time O(n + k) where k = max - min
 * @space O(k) for the count array
 *
 * **When to use:**
 * - If k (range) is small: countSort is faster O(n + k) vs O(n log n)
 * - If k is large (e.g., range 10^6 with n=1000): comparison sort is better
 * - Constraint: -10^6 <= arr[i] <= 10^6, so range can be up to 2 million
 *
 * **Trade-off:** Counting sort beats comparison sort when range ≤ array size
 *
 * @date 29/01/2026
 */

/**
 * **Approach 1: Sort + Single Pass (Using comparison sort)**
 *
 * Time: O(n log n), Space: O(1)
 * Simple and efficient for most cases.
 */
function minimumAbsoluteDifferenceSorted(arr: number[]): number[][] {
  // Sort array
  const sorted = [...arr].sort((a, b) => a - b);

  // Find minimum difference
  let minDiff = Infinity;
  for (let i = 1; i < sorted.length; i++) {
    minDiff = Math.min(minDiff, sorted[i] - sorted[i - 1]);
  }

  // Collect all pairs with minimum difference
  const result: number[][] = [];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] === minDiff) {
      result.push([sorted[i - 1], sorted[i]]);
    }
  }

  return result;
}

/**
 * **Approach 2: Counting Sort (Optimal for bounded range)**
 *
 * Time: O(n + k) where k is the range of values, Space: O(k)
 * Best when value range is small relative to array size.
 *
 * Steps:
 * 1. Find min and max to determine range
 * 2. Count occurrences of each value (offset by min for negative numbers)
 * 3. Reconstruct sorted array from counts
 * 4. Find minimum difference and collect pairs
 */
function minimumAbsoluteDifferenceCountSort(arr: number[]): number[][] {
  if (arr.length <= 1) return [];

  // Step 1: Find min and max to determine range
  let min = arr[0];
  let max = arr[0];
  for (const num of arr) {
    min = Math.min(min, num);
    max = Math.max(max, num);
  }

  // Step 2: Count occurrences (offset by min to handle negatives)
  const range = max - min + 1;
  const count = new Array<number>(range).fill(0);

  for (const num of arr) {
    count[num - min]++;
  }

  // Step 3: Reconstruct sorted array from counts
  const sorted: number[] = [];
  for (let value = min; value <= max; value++) {
    if (count[value - min] > 0) {
      sorted.push(value);
    }
  }

  // Step 4: Find minimum difference
  let minDiff = Infinity;
  for (let i = 1; i < sorted.length; i++) {
    minDiff = Math.min(minDiff, sorted[i] - sorted[i - 1]);
  }

  // Step 5: Collect all pairs with minimum difference
  const result: number[][] = [];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] === minDiff) {
      result.push([sorted[i - 1], sorted[i]]);
    }
  }

  return result;
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Multiple Pairs ===");
  const arr1 = [4, 2, 1, 3];
  console.log("Input:", arr1);
  console.log("Sorted approach:", minimumAbsoluteDifferenceSorted([...arr1]));
  console.log(
    "CountSort approach:",
    minimumAbsoluteDifferenceCountSort([...arr1]),
  );
  console.log("Expected: [[1,2],[2,3],[3,4]]");
  console.log();

  console.log("=== Example 2: Single Pair ===");
  const arr2 = [1, 3, 6, 10, 15];
  console.log("Input:", arr2);
  console.log("Sorted approach:", minimumAbsoluteDifferenceSorted([...arr2]));
  console.log(
    "CountSort approach:",
    minimumAbsoluteDifferenceCountSort([...arr2]),
  );
  console.log("Expected: [[1,3]]");
  console.log();

  console.log("=== Example 3: With Duplicates in Results ===");
  const arr3 = [3, 8, 10, 3];
  console.log("Input:", arr3);
  console.log("Sorted approach:", minimumAbsoluteDifferenceSorted([...arr3]));
  console.log(
    "CountSort approach:",
    minimumAbsoluteDifferenceCountSort([...arr3]),
  );
  console.log("Expected: [[3,8]]");
  console.log();

  console.log("=== Example 4: Negative Numbers ===");
  const arr4 = [-10, -5, 0, 5, 10];
  console.log("Input:", arr4);
  console.log("Sorted approach:", minimumAbsoluteDifferenceSorted([...arr4]));
  console.log(
    "CountSort approach:",
    minimumAbsoluteDifferenceCountSort([...arr4]),
  );
  console.log("Expected: [[-10,-5],[-5,0],[0,5],[5,10]]");
  console.log();

  console.log("=== Example 5: Large Gaps ===");
  const arr5 = [100, 101, 200, 201];
  console.log("Input:", arr5);
  console.log("Sorted approach:", minimumAbsoluteDifferenceSorted([...arr5]));
  console.log(
    "CountSort approach:",
    minimumAbsoluteDifferenceCountSort([...arr5]),
  );
  console.log("Expected: [[100,101],[200,201]]");
  console.log();

  console.log("=== Example 6: Single Element ===");
  const arr6 = [42];
  console.log("Input:", arr6);
  console.log("Sorted approach:", minimumAbsoluteDifferenceSorted([...arr6]));
  console.log(
    "CountSort approach:",
    minimumAbsoluteDifferenceCountSort([...arr6]),
  );
  console.log("Expected: []");
  console.log();

  console.log("=== Performance Comparison ===");
  const largeArray = Array.from({ length: 10000 }, (_, i) => {
    // Create array with values in range 0-100000
    return Math.floor(Math.random() * 100000);
  });

  console.log(`Array size: ${largeArray.length}`);

  console.log("\nSmall range (0-1000):");
  const smallRangeArray = largeArray.map((x) => x % 1000);
  const start1 = performance.now();
  minimumAbsoluteDifferenceSorted([...smallRangeArray]);
  const time1 = performance.now() - start1;

  const start2 = performance.now();
  minimumAbsoluteDifferenceCountSort([...smallRangeArray]);
  const time2 = performance.now() - start2;

  console.log(`Sorted approach: ${time1.toFixed(2)}ms`);
  console.log(`CountSort approach: ${time2.toFixed(2)}ms`);

  console.log("\nLarge range (0-100000):");
  const start3 = performance.now();
  minimumAbsoluteDifferenceSorted([...largeArray]);
  const time3 = performance.now() - start3;

  const start4 = performance.now();
  minimumAbsoluteDifferenceCountSort([...largeArray]);
  const time4 = performance.now() - start4;

  console.log(`Sorted approach: ${time3.toFixed(2)}ms`);
  console.log(`CountSort approach: ${time4.toFixed(2)}ms`);
}

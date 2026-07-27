/**
 * Two Sum II - Input Array Is Sorted - LeetCode Problem 167
 *
 * Given a 1-indexed array of integers `numbers`
 * that is already sorted in non-decreasing order,
 * find two numbers such that they add up to a specific target number.
 *
 * Return the indices of the two numbers (1-indexed)
 * as an array `[index1, index2]`.
 *
 * Constraints guarantee exactly one valid solution,
 * and the same element cannot be used twice.
 *
 * @example
 * Input: numbers = [2,7,11,15], target = 9
 * Output: [1,2]
 *
 * Explanation:
 * numbers[0] + numbers[1] = 2 + 7 = 9
 *
 * Since the array is 1-indexed:
 * return [1,2]
 *
 * @example
 * Input: numbers = [2,3,4], target = 6
 * Output: [1,3]
 *
 * Explanation:
 * 2 + 4 = 6
 *
 * @example
 * Input: numbers = [-1,0], target = -1
 * Output: [1,2]
 *
 * @constraints
 * - 2 <= numbers.length <= 3 * 10^4
 * - -1000 <= numbers[i] <= 1000
 * - numbers is sorted in non-decreasing order
 * - -1000 <= target <= 1000
 * - Exactly one solution exists
 *
 * ## Approaches
 *
 * **Approach 1: Two Pointers (Implemented)**
 *
 * A brute-force solution would check every pair:
 *
 * for i:
 *   for j:
 *     check sum
 *
 * That approach requires:
 * - Time: O(n²)
 * - Space: O(1)
 *
 * Another common solution uses a hash map:
 * - Time: O(n)
 * - Space: O(n)
 *
 * However, this problem provides an important property:
 *
 * The array is already sorted.
 *
 * We can use that ordering to eliminate unnecessary work
 * and achieve:
 *
 * - Time: O(n)
 * - Space: O(1)
 *
 * Algorithm:
 *
 * 1. Initialize:
 *    - left pointer at beginning
 *    - right pointer at end
 *
 * 2. Compute:
 *    currentSum = numbers[left] + numbers[right]
 *
 * 3. Compare currentSum with target:
 *
 *    If currentSum === target:
 *    - solution found
 *
 *    If currentSum < target:
 *    - move left pointer right
 *    - we need a larger value
 *
 *    If currentSum > target:
 *    - move right pointer left
 *    - we need a smaller value
 *
 * 4. Continue until solution is found
 *
 * Why this works:
 *
 * Since the array is sorted:
 *
 * Moving left pointer right:
 * - increases sum
 *
 * Moving right pointer left:
 * - decreases sum
 *
 * Therefore each move removes impossible combinations
 * without losing the correct answer.
 *
 * Example:
 *
 * numbers = [2,7,11,15]
 * target = 9
 *
 * Step 1:
 * left = 0 -> 2
 * right = 3 -> 15
 *
 * sum = 17 > 9
 * Move right leftward
 *
 * Step 2:
 * left = 0 -> 2
 * right = 2 -> 11
 *
 * sum = 13 > 9
 * Move right leftward
 *
 * Step 3:
 * left = 0 -> 2
 * right = 1 -> 7
 *
 * sum = 9
 * Solution found.
 *
 * Follow-Up:
 *
 * What about integer overflow?
 *
 * In languages with fixed-size integer types,
 * adding two large integers may overflow.
 *
 * Example in C++:
 *
 * long sum =
 *   static_cast<long>(numbers[left]) +
 *   numbers[right];
 *
 * Casting to a larger integer type prevents overflow.
 *
 * Another alternative:
 *
 * Instead of computing:
 * numbers[left] + numbers[right]
 *
 * We can check:
 *
 * numbers[left] >
 * INT_MAX - numbers[right]
 *
 * before performing addition.
 *
 * JavaScript safely handles this problem here because
 * numbers are stored using 64-bit floating point values.
 *
 * @time O(n) - array traversed at most once
 * @space O(1) - constant extra memory
 *
 * **Trade-off:** Optimal solution leveraging sorted order.
 *
 * Pattern:
 * - Two pointers
 * - Sorted array optimization
 * - Shrinking search space
 *
 * @date 08/07/2026
 */

/**
 * **Approach 1: Two Pointers**
 *
 * Time: O(n) - each pointer moves at most n times
 * Space: O(1) - constant auxiliary memory
 *
 * Uses two pointers:
 * - left starts at beginning
 * - right starts at end
 *
 * Compare current sum against target
 * and shrink the search window.
 *
 * Example:
 *
 * numbers = [2,7,11,15]
 * target = 9
 *
 * 2 + 15 = 17 -> too large
 * Move right
 *
 * 2 + 11 = 13 -> too large
 * Move right
 *
 * 2 + 7 = 9 -> found
 */
function twoSum(numbers: number[], target: number): number[] {
  // Pointer at beginning
  let left = 0;

  // Pointer at end
  let right = numbers.length - 1;

  while (left < right) {
    // Current pair sum
    const currentSum = numbers[left] + numbers[right];

    // Found solution
    if (currentSum === target) {
      // Return 1-indexed positions
      return [left + 1, right + 1];
    }

    // Need larger value
    if (currentSum < target) {
      left++;
      continue;
    }

    // Need smaller value
    right--;
  }

  // Problem guarantees one solution,
  // but return fallback for completeness
  return [];
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Basic sorted array ===");

  const numbers1 = [2, 7, 11, 15];
  const target1 = 9;

  console.log("Numbers:", numbers1);
  console.log("Target:", target1);

  const result1 = twoSum(numbers1, target1);

  console.log("Result:", result1);
  console.log("Expected: [1,2]");
  console.log();

  console.log("=== Example 2: Middle pair ===");

  const numbers2 = [2, 3, 4];
  const target2 = 6;

  console.log("Numbers:", numbers2);
  console.log("Target:", target2);

  const result2 = twoSum(numbers2, target2);

  console.log("Result:", result2);
  console.log("Expected: [1,3]");
  console.log();

  console.log("=== Example 3: Negative values ===");

  const numbers3 = [-1, 0];
  const target3 = -1;

  console.log("Numbers:", numbers3);
  console.log("Target:", target3);

  const result3 = twoSum(numbers3, target3);

  console.log("Result:", result3);
  console.log("Expected: [1,2]");
  console.log();

  console.log("=== Example 4: Larger sorted array ===");

  const numbers4 = [1, 2, 4, 6, 10, 15];
  const target4 = 16;

  console.log("Numbers:", numbers4);
  console.log("Target:", target4);

  const result4 = twoSum(numbers4, target4);

  console.log("Result:", result4);
  console.log("Expected: [1,6]");
  console.log();

  console.log("=== Example 5: Duplicate values ===");

  const numbers5 = [1, 2, 3, 4, 4, 9];
  const target5 = 8;

  console.log("Numbers:", numbers5);
  console.log("Target:", target5);

  const result5 = twoSum(numbers5, target5);

  console.log("Result:", result5);
  console.log("Expected: [4,5]");
  console.log();

  console.log("=== Example 6: Large values ===");

  const numbers6 = [100, 200, 300, 700, 900];
  const target6 = 1000;

  console.log("Numbers:", numbers6);
  console.log("Target:", target6);

  const result6 = twoSum(numbers6, target6);

  console.log("Result:", result6);
  console.log("Expected: [1,5]");
  console.log();
}

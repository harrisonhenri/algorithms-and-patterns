/**
 * Minimum Size Subarray Sum - LeetCode Problem 209
 *
 * Given an array of positive integers `nums`
 * and a positive integer `target`,
 * return the minimal length of a subarray
 * whose sum is greater than or equal to target.
 *
 * If no such subarray exists,
 * return 0.
 *
 * A subarray is a contiguous sequence
 * of elements within the array.
 *
 * @example
 * Input: target = 7, nums = [2,3,1,2,4,3]
 * Output: 2
 *
 * Explanation:
 * The subarray [4,3] has sum = 7
 * and length = 2.
 *
 * No smaller valid subarray exists.
 *
 * @example
 * Input: target = 4, nums = [1,4,4]
 * Output: 1
 *
 * Explanation:
 * [4] alone satisfies the requirement.
 *
 * @example
 * Input: target = 11, nums = [1,1,1,1,1,1,1,1]
 * Output: 0
 *
 * Explanation:
 * No subarray reaches sum 11.
 *
 * @constraints
 * - 1 <= target <= 10^9
 * - 1 <= nums.length <= 10^5
 * - 1 <= nums[i] <= 10^4
 *
 * ## Approaches
 *
 * **Approach 1: Sliding Window (Implemented)**
 *
 * A brute-force solution checks every possible subarray.
 *
 * Example:
 *
 * Start at index 0:
 * [2]
 * [2,3]
 * [2,3,1]
 * ...
 *
 * Then start at index 1:
 * [3]
 * [3,1]
 * ...
 *
 * This requires nested loops,
 * producing:
 *
 * @time O(n²)
 *
 * Such an approach leads to
 * Time Limit Exceeded (TLE)
 * for large inputs.
 *
 * We can do better.
 *
 * Intuition:
 *
 * Since all numbers are positive:
 *
 * Adding more elements always increases the sum.
 *
 * Therefore:
 *
 * Once a window already reaches target,
 * expanding it further is unnecessary because
 * it only creates larger subarrays.
 *
 * Instead:
 * - try shrinking the window
 * - search for a smaller valid subarray
 *
 * This observation enables the
 * Sliding Window technique.
 *
 * Sliding Window Concept:
 *
 * Use two pointers:
 *
 * - left  -> start of window
 * - right -> end of window
 *
 * The window expands by moving right.
 *
 * When the window sum becomes
 * greater than or equal to target:
 *
 * - update answer
 * - shrink from the left
 *
 * Continue shrinking while the
 * condition remains satisfied.
 *
 * Example:
 *
 * target = 7
 * nums = [2,3,1,2,4,3]
 *
 * Step 1:
 * Window = [2]
 * Sum = 2
 *
 * Step 2:
 * Window = [2,3]
 * Sum = 5
 *
 * Step 3:
 * Window = [2,3,1]
 * Sum = 6
 *
 * Step 4:
 * Window = [2,3,1,2]
 * Sum = 8
 *
 * Valid window found.
 *
 * Length = 4
 *
 * Now shrink from left:
 *
 * Remove 2
 * Window = [3,1,2]
 * Sum = 6
 *
 * Sum is now too small.
 *
 * Expand again:
 *
 * Add 4
 * Window = [3,1,2,4]
 * Sum = 10
 *
 * Shrink repeatedly:
 *
 * [1,2,4]
 * Sum = 7
 *
 * [2,4]
 * Sum = 6
 *
 * Best length so far = 2
 *
 * Algorithm:
 *
 * 1. Initialize:
 *    - left = 0
 *    - currentWindowSum = 0
 *    - minimumLength = Infinity
 *
 * 2. Expand window:
 *    - move right pointer
 *    - add nums[right]
 *
 * 3. While current sum >= target:
 *    - update answer
 *    - remove nums[left]
 *    - increment left
 *
 * 4. Return:
 *    - 0 if no valid subarray exists
 *    - otherwise minimum length
 *
 * Why this works:
 *
 * Every element enters the window once
 * and leaves the window once.
 *
 * Therefore:
 * both pointers move only forward.
 *
 * Complexity Analysis:
 *
 * @time O(n) - each index visited at most twice
 * @space O(1) - constant extra memory
 *
 * **Trade-off:** Optimal solution using
 * dynamic window resizing.
 *
 * Pattern:
 * - Sliding window
 * - Two pointers
 * - Dynamic subarray resizing
 *
 * @date 08/07/2026
 */

/**
 * Sliding Window implementation.
 *
 * Time: O(n)
 * Space: O(1)
 */
function minSubArrayLen(target: number, nums: number[]): number {
  // Start of sliding window
  let left = 0;

  // Current window total
  let currentWindowSum = 0;

  // Smallest valid length found
  let minimumLength = Infinity;

  // Expand window using right pointer
  for (let right = 0; right < nums.length; right++) {
    // Add current element into window
    currentWindowSum += nums[right];

    // Shrink window while valid
    while (currentWindowSum >= target) {
      // Update smallest valid window
      minimumLength = Math.min(minimumLength, right - left + 1);

      // Remove leftmost value
      currentWindowSum -= nums[left];

      // Move window forward
      left++;
    }
  }

  // No valid subarray found
  if (minimumLength === Infinity) {
    return 0;
  }

  return minimumLength;
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Standard sliding window ===");

  const target1 = 7;
  const nums1 = [2, 3, 1, 2, 4, 3];

  console.log("Target:", target1);
  console.log("Nums:", nums1);

  const result1 = minSubArrayLen(target1, nums1);

  console.log("Result:", result1);
  console.log("Expected: 2");
  console.log();

  console.log("=== Example 2: Single element solution ===");

  const target2 = 4;
  const nums2 = [1, 4, 4];

  console.log("Target:", target2);
  console.log("Nums:", nums2);

  const result2 = minSubArrayLen(target2, nums2);

  console.log("Result:", result2);
  console.log("Expected: 1");
  console.log();

  console.log("=== Example 3: No valid subarray ===");

  const target3 = 11;
  const nums3 = [1, 1, 1, 1, 1, 1, 1, 1];

  console.log("Target:", target3);
  console.log("Nums:", nums3);

  const result3 = minSubArrayLen(target3, nums3);

  console.log("Result:", result3);
  console.log("Expected: 0");
  console.log();

  console.log("=== Example 4: Entire array required ===");

  const target4 = 15;
  const nums4 = [1, 2, 3, 4, 5];

  console.log("Target:", target4);
  console.log("Nums:", nums4);

  const result4 = minSubArrayLen(target4, nums4);

  console.log("Result:", result4);
  console.log("Expected: 5");
  console.log();

  console.log("=== Example 5: Immediate large value ===");

  const target5 = 8;
  const nums5 = [9, 1, 1, 1];

  console.log("Target:", target5);
  console.log("Nums:", nums5);

  const result5 = minSubArrayLen(target5, nums5);

  console.log("Result:", result5);
  console.log("Expected: 1");
  console.log();

  console.log("=== Example 6: Multiple shrinking operations ===");

  const target6 = 15;
  const nums6 = [5, 1, 3, 5, 10, 7, 4, 9, 2, 8];

  console.log("Target:", target6);
  console.log("Nums:", nums6);

  const result6 = minSubArrayLen(target6, nums6);

  console.log("Result:", result6);
  console.log("Expected: 2");
  console.log();
}

/**
 * Max Consecutive Ones - LeetCode Problem 485
 *
 * Given a binary array `nums`,
 * return the maximum number of consecutive 1's in the array.
 *
 * A consecutive sequence means:
 * - values appear continuously
 * - no interruptions between them
 *
 * Since the array only contains:
 * - 0
 * - 1
 *
 * Every 0 acts as a "break"
 * between groups of consecutive 1's.
 *
 * @example
 * Input: nums = [1,1,0,1,1,1]
 * Output: 3
 *
 * Explanation:
 * The first sequence contains:
 * [1,1] -> length 2
 *
 * The second sequence contains:
 * [1,1,1] -> length 3
 *
 * Maximum = 3
 *
 * @example
 * Input: nums = [1,0,1,1,0,1]
 * Output: 2
 *
 * @constraints
 * - 1 <= nums.length <= 10^4
 * - nums[i] is either 0 or 1
 *
 * ## Approaches
 *
 *
 *
 */

/**
 * **Approach 1: One Pass Traversal (Implemented)**
 *
 * The constraints strongly suggest that
 * a single traversal is sufficient.
 *
 * To determine the number of 1's,
 * we must inspect the array at least once.
 *
 * Therefore, an optimal solution should:
 * - traverse once
 * - use constant memory
 *
 * Intuition:
 *
 * We continuously count how many 1's
 * appear without interruption.
 *
 * Whenever we encounter:
 *
 * - 1:
 *   continue the streak
 *
 * - 0:
 *   the streak breaks
 *
 * We then:
 * - update maximum streak
 * - reset current streak
 *
 * This is similar to counting uninterrupted
 * hours of sleep:
 *
 * Sleeping:
 * 1 1 1 1
 *
 * Waking up:
 * 0
 *
 * Once interrupted, the streak resets.
 *
 * Algorithm:
 *
 * 1. Maintain:
 *    - current streak of 1's
 *    - maximum streak found so far
 *
 * 2. Traverse array:
 *
 *    If current number is 1:
 *    - increment current streak
 *
 *    If current number is 0:
 *    - update maximum streak
 *    - reset current streak
 *
 * 3. Final update:
 *    The array may end with 1's,
 *    so compare once more after traversal.
 *
 * Example:
 *
 * nums = [1,1,0,1,1,1]
 *
 * Step-by-step:
 *
 * current = 1
 * max = 1
 *
 * current = 2
 * max = 2
 *
 * encounter 0:
 * reset current
 *
 * current = 1
 * current = 2
 * current = 3
 *
 * max = 3
 *
 * Answer = 3
 *
 * Why maximum updates happen at 0:
 *
 * A sequence of consecutive 1's only ends
 * when a 0 is encountered.
 *
 * Therefore:
 * 0 acts as the boundary of a subarray.
 *
 * Complexity Analysis:
 *
 * @time O(n) - single traversal of array
 * @space O(1) - constant extra memory
 *
 * **Trade-off:** Most efficient and simplest solution.
 *
 * Pattern:
 * - Sliding count
 * - Sequence tracking
 * - One-pass traversal
 *
 * Follow-up:
 *
 * A concise Python one-liner exists:
 *
 * max(map(len,
 *   ''.join(map(str, nums)).split('0')
 * ))
 *
 * Explanation:
 *
 * 1. Convert numbers into string:
 *    [1,1,0,1]
 *    -> "1101"
 *
 * 2. Split by "0":
 *    ["11", "1"]
 *
 * 3. Compute longest substring length
 *
 * While elegant,
 * the one-liner:
 * - allocates extra memory
 * - hides algorithmic intuition
 * - is less interview-friendly
 *
 * The iterative approach is clearer
 * and more memory efficient.
 *
 * @date 08/07/2026
 */
function findMaxConsecutiveOnes(nums: number[]): number {
  // Longest streak found
  let maxConsecutive = 0;

  // Current streak of 1's
  let currentConsecutive = 0;

  for (const num of nums) {
    // Continue streak
    if (num === 1) {
      currentConsecutive++;

      // Update maximum immediately
      maxConsecutive = Math.max(maxConsecutive, currentConsecutive);

      continue;
    }

    // Streak broken by 0
    currentConsecutive = 0;
  }

  return maxConsecutive;
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Basic consecutive ones ===");

  const nums1 = [1, 1, 0, 1, 1, 1];

  console.log("Input:", nums1);

  const result1 = findMaxConsecutiveOnes(nums1);

  console.log("Result:", result1);
  console.log("Expected: 3");
  console.log();

  console.log("=== Example 2: Multiple breaks ===");

  const nums2 = [1, 0, 1, 1, 0, 1];

  console.log("Input:", nums2);

  const result2 = findMaxConsecutiveOnes(nums2);

  console.log("Result:", result2);
  console.log("Expected: 2");
  console.log();

  console.log("=== Example 3: All ones ===");

  const nums3 = [1, 1, 1, 1, 1];

  console.log("Input:", nums3);

  const result3 = findMaxConsecutiveOnes(nums3);

  console.log("Result:", result3);
  console.log("Expected: 5");
  console.log();

  console.log("=== Example 4: All zeros ===");

  const nums4 = [0, 0, 0, 0];

  console.log("Input:", nums4);

  const result4 = findMaxConsecutiveOnes(nums4);

  console.log("Result:", result4);
  console.log("Expected: 0");
  console.log();

  console.log("=== Example 5: Single element ===");

  const nums5 = [1];

  console.log("Input:", nums5);

  const result5 = findMaxConsecutiveOnes(nums5);

  console.log("Result:", result5);
  console.log("Expected: 1");
  console.log();

  console.log("=== Example 6: Alternating values ===");

  const nums6 = [1, 0, 1, 0, 1, 0, 1];

  console.log("Input:", nums6);

  const result6 = findMaxConsecutiveOnes(nums6);

  console.log("Result:", result6);
  console.log("Expected: 1");
  console.log();
}

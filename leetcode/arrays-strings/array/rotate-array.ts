/**
 * Rotate Array - LeetCode Problem 189
 *
 * Given an integer array nums,
 * rotate the array to the right by k steps,
 * where k is non-negative.
 *
 * @example
 * Input: nums = [1,2,3,4,5,6,7], k = 3
 * Output: [5,6,7,1,2,3,4]
 *
 * Explanation:
 * rotate 1 step to the right: [7,1,2,3,4,5,6]
 * rotate 2 steps to the right: [6,7,1,2,3,4,5]
 * rotate 3 steps to the right: [5,6,7,1,2,3,4]
 *
 * @example
 * Input: nums = [-1,-100,3,99], k = 2
 * Output: [3,99,-1,-100]
 *
 * Explanation:
 * rotate 1 step to the right: [99,-1,-100,3]
 * rotate 2 steps to the right: [3,99,-1,-100]
 *
 * @constraints
 * - 1 <= nums.length <= 10^5
 * - -2^31 <= nums[i] <= 2^31 - 1
 * - 0 <= k <= 10^5
 *
 * ## Approaches
 *
 * **Approach 1: Brute Force**
 *
 * The simplest approach is to rotate all the elements
 * of the array in k steps by rotating the elements
 * by 1 unit in each step.
 *
 * Algorithm:
 *
 * 1. Repeat k times:
 *    - Store the last element
 *    - Shift every element one position right
 *    - Place the stored value at index 0
 *
 * Example:
 *
 * nums = [1,2,3,4]
 * k = 2
 *
 * Step 1:
 * [4,1,2,3]
 *
 * Step 2:
 * [3,4,1,2]
 *
 * Complexity Analysis:
 *
 * @time O(n × k)
 * All elements are shifted by one step,
 * repeated k times.
 *
 * @space O(1)
 * No extra space is used.
 *
 * **Trade-off:** Very intuitive but inefficient
 * for large values of k.
 *
 * ---
 *
 * **Approach 2: Using Extra Array**
 *
 * Use an additional array and place each number
 * directly into its rotated position.
 *
 * Formula:
 *
 * newIndex = (i + k) % nums.length
 *
 * Algorithm:
 *
 * 1. Create an extra array
 * 2. For every index i:
 *    - place nums[i] into:
 *      (i + k) % n
 * 3. Copy values back into original array
 *
 * Example:
 *
 * nums = [1,2,3,4,5,6,7]
 * k = 3
 *
 * Index mapping:
 *
 * 1 -> index 3
 * 2 -> index 4
 * 3 -> index 5
 * 4 -> index 6
 * 5 -> index 0
 * 6 -> index 1
 * 7 -> index 2
 *
 * Result:
 * [5,6,7,1,2,3,4]
 *
 * Complexity Analysis:
 *
 * @time O(n)
 * One traversal to place values,
 * another traversal to copy values back.
 *
 * @space O(n)
 * Additional array required.
 *
 * **Trade-off:** Easy to understand and efficient,
 * but requires extra memory.
 *
 * ---
 *
 * **Approach 3: Using Cyclic Replacements**
 *
 * Instead of using extra memory,
 * directly place each element into
 * its correct rotated position.
 *
 * Since overwriting destroys values,
 * temporarily store replaced elements
 * and continue cyclic movement.
 *
 * Key idea:
 *
 * Every element moves to:
 *
 * (currentIndex + k) % n
 *
 * However, cycles may form.
 *
 * Example:
 *
 * nums = [1,2,3,4,5,6]
 * k = 2
 *
 * Starting at index 0:
 *
 * 1 -> index 2
 * 3 -> index 4
 * 5 -> index 0
 *
 * One cycle completed.
 *
 * Then continue from next untouched index.
 *
 * Important observation:
 *
 * If n % k === 0,
 * we may return to the starting index
 * before all elements are processed.
 *
 * Therefore:
 * multiple cycles may be required.
 *
 * Complexity Analysis:
 *
 * @time O(n)
 * Every element is moved exactly once.
 *
 * @space O(1)
 * Only temporary variables used.
 *
 * **Trade-off:** Optimal memory usage,
 * but implementation is more complex.
 *
 * ---
 *
 * **Approach 4: Using Reverse (Implemented)**
 *
 * This approach is based on an important observation:
 *
 * After rotating right by k:
 *
 * - the final k elements move to the front
 * - the remaining n-k elements shift right
 *
 * Instead of moving elements individually,
 * we can achieve the same result using reversals.
 *
 * Algorithm:
 *
 * 1. Reverse the entire array
 * 2. Reverse the first k elements
 * 3. Reverse the remaining n-k elements
 *
 * Example:
 *
 * nums = [1,2,3,4,5,6,7]
 * k = 3
 *
 * Original:
 * 1 2 3 4 5 6 7
 *
 * Reverse all:
 * 7 6 5 4 3 2 1
 *
 * Reverse first k:
 * 5 6 7 4 3 2 1
 *
 * Reverse remaining:
 * 5 6 7 1 2 3 4
 *
 * Result:
 * [5,6,7,1,2,3,4]
 *
 * Why this works:
 *
 * Reversing the entire array places the
 * future front segment into the correct region,
 * but in reverse order.
 *
 * Reversing each partition restores
 * the correct internal ordering.
 *
 * Complexity Analysis:
 *
 * @time O(n)
 * Each element participates in at most
 * three reversals.
 *
 * @space O(1)
 * Rotation occurs in-place.
 *
 * **Trade-off:** Optimal time and space
 * with relatively simple implementation.
 *
 * Pattern:
 * - Array reversal
 * - In-place transformation
 * - Index manipulation
 *
 * @date 08/07/2026
 */

/**
 * Reverse a portion of the array in-place.
 *
 * Uses two pointers:
 * - left starts at beginning
 * - right starts at end
 *
 * Swap values while moving inward.
 */
function reverse(nums: number[], left: number, right: number): void {
  while (left < right) {
    // Swap current pair
    [nums[left], nums[right]] = [nums[right], nums[left]];

    left++;
    right--;
  }
}

/**
 * **Approach 4: Using Reverse**
 *
 * Time: O(n)
 * Space: O(1)
 *
 * Performs rotation using three reversals.
 *
 * Steps:
 * 1. Reverse entire array
 * 2. Reverse first k elements
 * 3. Reverse remaining elements
 */
function rotate(nums: number[], k: number): void {
  const n = nums.length;

  // Reduce unnecessary full rotations
  k %= n;

  // Reverse all elements
  reverse(nums, 0, n - 1);

  // Reverse first k elements
  reverse(nums, 0, k - 1);

  // Reverse remaining elements
  reverse(nums, k, n - 1);
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Standard rotation ===");

  const nums1 = [1, 2, 3, 4, 5, 6, 7];
  const k1 = 3;

  console.log("Original:", nums1);
  console.log("k =", k1);

  rotate(nums1, k1);

  console.log("Result:", nums1);
  console.log("Expected: [5,6,7,1,2,3,4]");
  console.log();

  console.log("=== Example 2: Negative values ===");

  const nums2 = [-1, -100, 3, 99];
  const k2 = 2;

  console.log("Original:", nums2);
  console.log("k =", k2);

  rotate(nums2, k2);

  console.log("Result:", nums2);
  console.log("Expected: [3,99,-1,-100]");
  console.log();

  console.log("=== Example 3: Single rotation ===");

  const nums3 = [1, 2, 3, 4];
  const k3 = 1;

  console.log("Original:", nums3);
  console.log("k =", k3);

  rotate(nums3, k3);

  console.log("Result:", nums3);
  console.log("Expected: [4,1,2,3]");
  console.log();

  console.log("=== Example 4: k larger than array size ===");

  const nums4 = [1, 2, 3];
  const k4 = 5;

  console.log("Original:", nums4);
  console.log("k =", k4);

  rotate(nums4, k4);

  console.log("Result:", nums4);
  console.log("Expected: [2,3,1]");
  console.log(`Explanation:
  k = 5
  Effective rotation = 5 % 3 = 2`);
  console.log();

  console.log("=== Example 5: No rotation ===");

  const nums5 = [10, 20, 30];
  const k5 = 0;

  console.log("Original:", nums5);
  console.log("k =", k5);

  rotate(nums5, k5);

  console.log("Result:", nums5);
  console.log("Expected: [10,20,30]");
  console.log();

  console.log("=== Example 6: Two-element array ===");

  const nums6 = [1, 2];
  const k6 = 3;

  console.log("Original:", nums6);
  console.log("k =", k6);

  rotate(nums6, k6);

  console.log("Result:", nums6);
  console.log("Expected: [2,1]");
  console.log();
}

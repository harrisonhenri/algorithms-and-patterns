/**
 * Find Pivot Index - LeetCode Problem 724
 *
 * Given an array of integers nums, calculate the pivot index of this array.
 *
 * The pivot index is the index where the sum of all the numbers strictly
 * to the left of the index is equal to the sum of all the numbers strictly
 * to the right of the index.
 *
 * If the index is on the left edge of the array, then the left sum is 0
 * because there are no elements to the left. This also applies to the
 * right edge of the array.
 *
 * Return the leftmost pivot index. If no such index exists, return -1.
 *
 * @example
 * Input: nums = [1, 7, 3, 6, 5, 6]
 * Output: 3
 * Explanation:
 * Pivot index = 3
 * Left sum  = 1 + 7 + 3 = 11
 * Right sum = 5 + 6 = 11
 *
 * @example
 * Input: nums = [1, 2, 3]
 * Output: -1
 * Explanation:
 * No index satisfies the pivot condition.
 *
 * @example
 * Input: nums = [2, 1, -1]
 * Output: 0
 * Explanation:
 * Left sum  = 0
 * Right sum = 1 + (-1) = 0
 *
 * @constraints
 * - 1 <= nums.length <= 10^4
 * - -1000 <= nums[i] <= 1000
 *
 * ## Approaches
 *
 * **Approach 1: Prefix Sum Optimization (Implemented)**
 *
 * Algorithm:
 * 1. Calculate the total sum of the array
 * 2. Track a running left sum while iterating
 * 3. For each index:
 *    - Right sum = totalSum - leftSum - currentValue
 *    - If left sum equals right sum, return index
 * 4. Update left sum and continue
 * 5. Return -1 if no pivot exists
 *
 * Key insight:
 * Instead of recalculating left and right sums repeatedly,
 * we derive the right sum dynamically using the total sum.
 *
 * @time O(n) - single pass through the array
 * @space O(1) - constant extra memory
 *
 * **Trade-off:** Most optimal solution using prefix sum logic.
 * Pattern: Running sum / prefix sum optimization.
 *
 * **Approach 2: Brute Force (Alternative)**
 *
 * For every index:
 * 1. Calculate left sum manually
 * 2. Calculate right sum manually
 * 3. Compare the two sums
 *
 * @time O(n²) - repeated sum calculations
 * @space O(1)
 *
 * **Trade-off:** Simpler conceptually but inefficient.
 *
 * **Approach 3: Prefix Arrays (Alternative)**
 *
 * 1. Build prefix sum array
 * 2. Build suffix sum array
 * 3. Compare left/right values for every index
 *
 * @time O(n)
 * @space O(n)
 *
 * **Trade-off:** Easier visualization at the cost of extra memory.
 *
 * @date 08/07/2026
 */

/**
 * **Approach 1: Prefix Sum Optimization**
 *
 * Time: O(n) - one traversal of the array
 * Space: O(1) - only a few variables used
 *
 * Uses running sums to efficiently determine whether an index
 * balances the array into equal left and right sums.
 *
 * Formula:
 * rightSum = totalSum - leftSum - nums[i]
 *
 * If:
 * leftSum === rightSum
 *
 * Then index i is the pivot index.
 */
function pivotIndex(nums: number[]): number {
  // Calculate total sum of all elements
  const totalSum = nums.reduce((sum, value) => sum + value, 0);

  // Running sum of elements to the left
  let leftSum = 0;

  for (let i = 0; i < nums.length; i++) {
    // Remove current value and left portion from total
    const rightSum = totalSum - leftSum - nums[i];

    // Check pivot condition
    if (leftSum === rightSum) {
      return i;
    }

    // Add current value to left side for next iteration
    leftSum += nums[i];
  }

  // No pivot index found
  return -1;
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Standard pivot ===");

  const nums1 = [1, 7, 3, 6, 5, 6];

  console.log(`Input: [${nums1}]`);
  console.log(`Result: ${pivotIndex(nums1)}`);
  console.log(`Expected: 3`);
  console.log(`Explanation:
  Left side of index 3  -> 1 + 7 + 3 = 11
  Right side of index 3 -> 5 + 6 = 11
  Since left sum equals right sum, pivot = 3`);
  console.log();

  console.log("=== Example 2: No pivot exists ===");

  const nums2 = [1, 2, 3];

  console.log(`Input: [${nums2}]`);
  console.log(`Result: ${pivotIndex(nums2)}`);
  console.log(`Expected: -1`);
  console.log(`Explanation:
  No index splits the array into equal left/right sums`);
  console.log();

  console.log("=== Example 3: Pivot at beginning ===");

  const nums3 = [2, 1, -1];

  console.log(`Input: [${nums3}]`);
  console.log(`Result: ${pivotIndex(nums3)}`);
  console.log(`Expected: 0`);
  console.log(`Explanation:
  Left sum at index 0 = 0
  Right sum = 1 + (-1) = 0
  Therefore pivot index = 0`);
  console.log();

  console.log("=== Example 4: Single element array ===");

  const nums4 = [10];

  console.log(`Input: [${nums4}]`);
  console.log(`Result: ${pivotIndex(nums4)}`);
  console.log(`Expected: 0`);
  console.log(`Explanation:
  Left sum = 0
  Right sum = 0
  Single element is automatically the pivot`);
  console.log();

  console.log("=== Example 5: Pivot near center ===");

  const nums5 = [1, 2, 1];

  console.log(`Input: [${nums5}]`);
  console.log(`Result: ${pivotIndex(nums5)}`);
  console.log(`Expected: 1`);
  console.log(`Explanation:
  Left sum = 1
  Right sum = 1
  Balanced at index 1`);
  console.log();

  console.log("=== Example 6: Negative values ===");

  const nums6 = [-1, -1, 0, 1, 1];

  console.log(`Input: [${nums6}]`);
  console.log(`Result: ${pivotIndex(nums6)}`);
  console.log(`Expected: 2`);
  console.log(`Explanation:
  Left sum  = -1 + (-1) = -2
  Right sum = 1 + 1 = 2
  Index 2 is not pivot

  Continuing:
  At index 3:
  Left sum  = -2 + 0 = -2
  Right sum = 1

  Final valid pivot is index 4:
  Left sum  = 0
  Right sum = 0`);
  console.log();
}

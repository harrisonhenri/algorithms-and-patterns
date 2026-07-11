/**
 * Largest Number At Least Twice of Others - LeetCode Problem 747
 *
 * You are given an integer array nums where the largest integer is unique.
 *
 * Determine whether the largest element in the array is at least twice as
 * much as every other number in the array.
 *
 * If it is, return the index of the largest element.
 * Otherwise, return -1.
 *
 * @example
 * Input: nums = [3, 6, 1, 0]
 * Output: 1
 * Explanation:
 * 6 is the largest number.
 * 6 >= 2 × 3
 * 6 >= 2 × 1
 * 6 >= 2 × 0
 * Since the condition is satisfied for all elements,
 * return the index of 6, which is 1.
 *
 * @example
 * Input: nums = [1, 2, 3, 4]
 * Output: -1
 * Explanation:
 * 4 is the largest number.
 * However:
 * 4 < 2 × 3
 * Therefore the condition fails.
 *
 * @constraints
 * - 1 <= nums.length <= 50
 * - 0 <= nums[i] <= 100
 * - The largest element in nums is unique
 *
 * ## Approaches
 *
 * **Approach 1: Track Largest and Second Largest (Implemented)**
 *
 * Algorithm:
 * 1. Traverse the array once
 * 2. Track:
 *    - largest number
 *    - second largest number
 *    - index of largest number
 * 3. After traversal:
 *    - Check if largest >= 2 × secondLargest
 * 4. Return the index if condition passes, otherwise -1
 *
 * Key insight:
 * We only need the two largest values.
 * If the largest number is at least twice the second largest,
 * it is automatically at least twice every smaller value as well.
 *
 * @time O(n) - single traversal of array
 * @space O(1) - constant extra memory
 *
 * **Trade-off:** Most efficient solution without sorting.
 * Pattern: Maximum tracking / greedy comparison.
 *
 * **Approach 2: Sorting (Alternative)**
 *
 * 1. Create a sorted copy of the array
 * 2. Compare largest and second largest values
 * 3. Return original index if condition holds
 *
 * @time O(n log n) - sorting dominates runtime
 * @space O(n) - sorted copy required
 *
 * **Trade-off:** Easier to visualize but less efficient.
 *
 * **Approach 3: Brute Force (Alternative)**
 *
 * 1. Find largest element
 * 2. Compare largest against every other element
 * 3. Verify doubling condition manually
 *
 * @time O(n²) in naive implementations
 * @space O(1)
 *
 * **Trade-off:** Straightforward conceptually but inefficient.
 *
 * @date 08/07/2026
 */

/**
 * **Approach 1: Track Largest and Second Largest**
 *
 * Time: O(n) - one pass through the array
 * Space: O(1) - only a few variables needed
 *
 * Tracks the largest and second largest values dynamically.
 *
 * Why this works:
 * If the largest value is at least twice the second largest value,
 * then it must also be at least twice every smaller number.
 *
 * Formula:
 * largest >= 2 * secondLargest
 */
function dominantIndex(nums: number[]): number {
  // Track largest value found so far
  let largest = -Infinity;

  // Track second largest value
  let secondLargest = -Infinity;

  // Track index of largest value
  let largestIndex = -1;

  for (let i = 0; i < nums.length; i++) {
    const current = nums[i];

    // Found new largest number
    if (current > largest) {
      secondLargest = largest;
      largest = current;
      largestIndex = i;
    }
    // Update second largest if needed
    else if (current > secondLargest) {
      secondLargest = current;
    }
  }

  // Verify dominant condition
  if (largest >= 2 * secondLargest) {
    return largestIndex;
  }

  return -1;
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Dominant number exists ===");

  const nums1 = [3, 6, 1, 0];

  console.log(`Input: [${nums1}]`);
  console.log(`Result: ${dominantIndex(nums1)}`);
  console.log(`Expected: 1`);
  console.log(`Explanation:
  Largest number = 6
  Second largest = 3

  Check:
  6 >= 2 × 3 → 6 >= 6 ✓

  Since condition passes, return index 1`);
  console.log();

  console.log("=== Example 2: No dominant number ===");

  const nums2 = [1, 2, 3, 4];

  console.log(`Input: [${nums2}]`);
  console.log(`Result: ${dominantIndex(nums2)}`);
  console.log(`Expected: -1`);
  console.log(`Explanation:
  Largest number = 4
  Second largest = 3

  Check:
  4 >= 2 × 3 → 4 >= 6 ✗

  Condition fails, so return -1`);
  console.log();

  console.log("=== Example 3: Single element ===");

  const nums3 = [10];

  console.log(`Input: [${nums3}]`);
  console.log(`Result: ${dominantIndex(nums3)}`);
  console.log(`Expected: 0`);
  console.log(`Explanation:
  Only one element exists.
  It is automatically dominant.`);
  console.log();

  console.log("=== Example 4: Very large dominant value ===");

  const nums4 = [1, 2, 50, 3];

  console.log(`Input: [${nums4}]`);
  console.log(`Result: ${dominantIndex(nums4)}`);
  console.log(`Expected: 2`);
  console.log(`Explanation:
  Largest number = 50
  Second largest = 3

  Check:
  50 >= 2 × 3 → 50 >= 6 ✓`);
  console.log();

  console.log("=== Example 5: Dominant at first position ===");

  const nums5 = [8, 2, 1, 3];

  console.log(`Input: [${nums5}]`);
  console.log(`Result: ${dominantIndex(nums5)}`);
  console.log(`Expected: 0`);
  console.log(`Explanation:
  Largest number = 8
  Second largest = 3

  Check:
  8 >= 2 × 3 → 8 >= 6 ✓`);
  console.log();

  console.log("=== Example 6: Close but not dominant ===");

  const nums6 = [5, 9, 4, 3];

  console.log(`Input: [${nums6}]`);
  console.log(`Result: ${dominantIndex(nums6)}`);
  console.log(`Expected: -1`);
  console.log(`Explanation:
  Largest number = 9
  Second largest = 5

  Check:
  9 >= 2 × 5 → 9 >= 10 ✗

  Largest value is not dominant.`);
  console.log();
}

/**
 * Move Zeroes - LeetCode Problem 283
 *
 * Given an integer array nums,
 * move all 0's to the end of it
 * while maintaining the relative order
 * of the non-zero elements.
 *
 * You must do this in-place without
 * making a copy of the array.
 *
 * @example
 * Input: nums = [0,1,0,3,12]
 * Output: [1,3,12,0,0]
 *
 * Explanation:
 * - All non-zero values keep their original order
 * - All zeroes are moved to the end
 *
 * @example
 * Input: nums = [0]
 * Output: [0]
 *
 * @constraints
 * - 1 <= nums.length <= 10^4
 * - -2^31 <= nums[i] <= 2^31 - 1
 *
 * ## Approaches
 *
 * **Approach 1: Extra Array**
 *
 * Intuition:
 *
 * This approach separates the problem
 * into two simpler tasks:
 *
 * 1. Preserve all non-zero elements
 * 2. Append all zeroes afterward
 *
 * We first collect all non-zero values
 * in order, then fill the remaining
 * positions with zeroes.
 *
 * Algorithm:
 *
 * 1. Count the number of zeroes
 * 2. Create a new array
 * 3. Add all non-zero values
 * 4. Append counted zeroes
 * 5. Copy values back into nums
 *
 * Example:
 *
 * nums = [0,1,0,3,12]
 *
 * Non-zero values:
 * [1,3,12]
 *
 * Append zeroes:
 * [1,3,12,0,0]
 *
 * Complexity Analysis:
 *
 * @time O(n)
 * Multiple traversals of the array.
 *
 * @space O(n)
 * Extra array required.
 *
 * **Trade-off:** Very intuitive,
 * but violates the in-place optimization goal.
 *
 * ---
 *
 * **Approach 2: Two-Pointer Overwrite**
 *
 * Intuition:
 *
 * Instead of using extra space,
 * move all non-zero values toward
 * the beginning of the array.
 *
 * Then fill remaining positions
 * with zeroes.
 *
 * We use:
 *
 * - fast pointer -> scans array
 * - slow pointer -> next position for non-zero value
 *
 * Example:
 *
 * nums = [0,1,0,3,12]
 *
 * Step 1:
 * Move non-zeroes forward:
 *
 * [1,3,12,3,12]
 *
 * Step 2:
 * Fill remaining positions with 0:
 *
 * [1,3,12,0,0]
 *
 * Complexity Analysis:
 *
 * @time O(n)
 * One traversal for compaction,
 * another for filling zeroes.
 *
 * @space O(1)
 *
 * **Trade-off:** Space optimal,
 * but performs unnecessary writes
 * in some cases.
 *
 * ---
 *
 * **Approach 3: Optimal Swap-Based Two Pointers (Implemented)**
 *
 * Intuition:
 *
 * The overwrite approach still performs
 * unnecessary writes.
 *
 * Example:
 *
 * [0,0,0,0,1]
 *
 * The previous approach repeatedly writes
 * multiple zeroes unnecessarily.
 *
 * We can improve this by swapping:
 *
 * - whenever a non-zero element is found
 * - move it directly into its correct position
 *
 * Key invariant:
 *
 * - All elements before slow pointer are non-zero
 * - All elements between slow and current are zeroes
 *
 * Therefore:
 *
 * When we encounter a non-zero value:
 *
 * - swap it into the next valid non-zero position
 * - advance slow pointer
 *
 * Example:
 *
 * nums = [0,1,0,3,12]
 *
 * slow = 0
 *
 * current = 1 -> value = 1
 * swap(0,1)
 *
 * [1,0,0,3,12]
 *
 * current = 3 -> value = 3
 * swap(1,3)
 *
 * [1,3,0,0,12]
 *
 * current = 4 -> value = 12
 * swap(2,4)
 *
 * [1,3,12,0,0]
 *
 * Result achieved in-place.
 *
 * Why this works:
 *
 * Every non-zero element moves
 * at most once into its correct region.
 *
 * Zeroes naturally accumulate
 * toward the end.
 *
 * Relative ordering is preserved because
 * non-zero values are processed left-to-right.
 *
 * Complexity Analysis:
 *
 * @time O(n)
 * Single traversal.
 *
 * @space O(1)
 * Constant extra memory.
 *
 * **Trade-off:** Optimal solution with
 * minimal unnecessary writes.
 *
 * Pattern:
 * - Two pointers
 * - Stable partitioning
 * - In-place array transformation
 *
 * @date 09/07/2026
 */

/**
 * **Approach 3: Optimal Swap-Based Two Pointers**
 *
 * Time: O(n)
 * Space: O(1)
 *
 * Uses:
 * - slow pointer for next non-zero position
 * - current pointer for traversal
 *
 * Swaps non-zero values into place.
 */
function moveZeroes(nums: number[]): void {
  // Next position for non-zero value
  let lastNonZeroFoundAt = 0;

  for (let current = 0; current < nums.length; current++) {
    // Found non-zero value
    if (nums[current] !== 0) {
      // Swap current value into correct position
      [nums[lastNonZeroFoundAt], nums[current]] = [
        nums[current],
        nums[lastNonZeroFoundAt],
      ];

      // Advance non-zero boundary
      lastNonZeroFoundAt++;
    }
  }
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Standard example ===");

  const nums1 = [0, 1, 0, 3, 12];

  console.log("Original:", nums1);

  moveZeroes(nums1);

  console.log("Result:", nums1);
  console.log("Expected: [1,3,12,0,0]");
  console.log();

  console.log("=== Example 2: Single zero ===");

  const nums2 = [0];

  console.log("Original:", nums2);

  moveZeroes(nums2);

  console.log("Result:", nums2);
  console.log("Expected: [0]");
  console.log();

  console.log("=== Example 3: No zeroes ===");

  const nums3 = [1, 2, 3, 4];

  console.log("Original:", nums3);

  moveZeroes(nums3);

  console.log("Result:", nums3);
  console.log("Expected: [1,2,3,4]");
  console.log();

  console.log("=== Example 4: All zeroes ===");

  const nums4 = [0, 0, 0, 0];

  console.log("Original:", nums4);

  moveZeroes(nums4);

  console.log("Result:", nums4);
  console.log("Expected: [0,0,0,0]");
  console.log();

  console.log("=== Example 5: Leading zeroes ===");

  const nums5 = [0, 0, 1, 2, 3];

  console.log("Original:", nums5);

  moveZeroes(nums5);

  console.log("Result:", nums5);
  console.log("Expected: [1,2,3,0,0]");
  console.log();

  console.log("=== Example 6: Mixed placement ===");

  const nums6 = [4, 0, 5, 0, 0, 3, 0, 1];

  console.log("Original:", nums6);

  moveZeroes(nums6);

  console.log("Result:", nums6);
  console.log("Expected: [4,5,3,1,0,0,0,0]");
  console.log();

  console.log("=== Example 7: Trailing zeroes ===");

  const nums7 = [1, 2, 3, 0, 0];

  console.log("Original:", nums7);

  moveZeroes(nums7);

  console.log("Result:", nums7);
  console.log("Expected: [1,2,3,0,0]");
  console.log();
}

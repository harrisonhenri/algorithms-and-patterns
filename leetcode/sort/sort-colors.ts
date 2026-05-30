import { swap } from "../../algorithms/utils/swap";

/**
 * Sort Colors - LeetCode Problem 75
 *
 * Problem Statement:
 * Given an array nums with n objects colored red, white, or blue, sort them
 * in-place so that objects of the same color are adjacent, with the colors
 * in the order red, white, and blue.
 *
 * We will use the integers 0, 1, and 2 to represent the color red, white,
 * and blue, respectively.
 *
 * You must solve this problem without using the library's sort function.
 *
 * Related Algorithm: See {@link ../../algorithms/sort/comparison/selection-sort/index.ts | Selection Sort}
 * This problem applies the selection sort principle but optimized for 3 discrete colors.
 *
 * @example
 * Input: nums = [2, 0, 2, 1, 1, 0]
 * Output: [0, 0, 1, 1, 2, 2]
 *
 * @example
 * Input: nums = [2, 0, 1]
 * Output: [0, 1, 2]
 *
 * @constraints
 * - 1 <= nums.length <= 300
 * - nums[i] is either 0, 1, or 2
 *
 * ## Approaches
 *
 * **Approach 1: Selection Sort Optimized (Implemented - Intuitive)**
 *
 * Applies selection sort principle but optimized for 3 colors:
 * 1. First pass: Move all 0's to the front by finding each 0 and swapping
 * 2. Second pass: Move all 1's to the middle
 * 3. All 2's automatically end up at the end
 *
 * Algorithm:
 * - Keep a boundary `zeroEnd` where all elements to the left are 0
 * - Find the next 0, swap it to position zeroEnd, increment zeroEnd
 * - Repeat for 1's with boundary `oneEnd`
 * - Uses same `swap()` utility as the selection sort algorithm
 *
 * @time O(n) - two passes through the array (not O(n²) like general selection sort)
 * @space O(1) - in-place sorting, only uses pointers
 *
 * **Trade-off:** Simple and intuitive, works well for fixed number of colors.
 * Pattern: Selection sort principle optimized for discrete values.
 *
 * **Approach 2: Dutch National Flag (Alternative)**
 *
 * This elegant algorithm was first proposed by Edsger Dijkstra to solve the
 * "Dutch National Flag" problem, named after the three colors in the Dutch flag.
 * It's a brilliant demonstration of partitioning with minimal swaps.
 *
 * Use three pointers (left, mid, right) in single pass:
 * - left: boundary for 0's (elements < left are 0)
 * - mid: current element being examined
 * - right: boundary for 2's (elements > right are 2)
 * - Invariant: [0..left-1]=0, [left..mid-1]=1, [right+1..n-1]=2
 *
 * Algorithm:
 * - If nums[mid] == 0: swap with left, move both left and mid right
 * - If nums[mid] == 1: just move mid right
 * - If nums[mid] == 2: swap with right, move right left (don't move mid)
 *
 * @time O(n) - single pass with three pointers
 * @space O(1) - in-place sorting
 * **CPU Cache Efficiency:** Single pass is more cache-friendly because:
 * - You iterate through array once (not twice like Approach 1)
 * - Array data stays "hot" in L1/L2 CPU cache longer
 * - Fewer cache misses and memory reloads
 * - Better utilization of CPU prefetcher
 * **Trade-off:** Most efficient (single pass), Dijkstra's elegant solution.
 * **Historical Note:** First proposed by Edsger W. Dijkstra in 1976 for partitioning.
 *
 * **Approach 3: Counting Sort (Alternative)**
 *
 * Count occurrences of each color, then write back:
 * - Count 0's, 1's, 2's
 * - Fill first count[0] positions with 0
 * - Fill next count[1] positions with 1
 * - Fill remaining with 2
 *
 * @time O(n) - single pass to count, single pass to fill
 * @space O(1) - only three counters (constant space for known 3 colors)
 * **Trade-off:** Most efficient for this specific problem (3 colors).
 *
 * **Approach 4: Bucket Sort (Alternative)**
 *
 * Create 3 buckets for each color, collect results:
 * - Bucket 0: all 0's
 * - Bucket 1: all 1's
 * - Bucket 2: all 2's
 * - Concatenate buckets
 *
 * @time O(n) - distribute + collect
 * @space O(n) - need buckets
 * **Trade-off:** Requires extra space (not in-place).
 *
 * @date 28/01/2026
 */

/**
 * **Approach 1: Selection Sort (Two-Pass Color Sorting)**
 *
 * Time: O(n) - two passes (not nested loops)
 * Space: O(1) - in-place
 *
 * Use selection sort principle: find each value type and place in correct position.
 * First pass places all 0's, second pass places all 1's, 2's follow naturally.
 *
 * Key insight: Unlike general selection sort O(n²), this is O(n) because we know
 * there are only 3 distinct values, so we only need 2 passes.
 */
function sortColors(nums: number[]): void {
  // First pass: move all 0's to the front
  let zeroEnd = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0) {
      swap(nums, i, zeroEnd);
      zeroEnd++;
    }
  }

  // Second pass: move all 1's to the middle (after the 0's)
  let oneEnd = zeroEnd;
  for (let i = zeroEnd; i < nums.length; i++) {
    if (nums[i] === 1) {
      swap(nums, i, oneEnd);
      oneEnd++;
    }
  }

  // 2's are now automatically in the correct positions
}

/**
 * **Approach 2: Dutch National Flag (Alternative)**
 *
 * Time: O(n) - single pass
 * Space: O(1) - in-place
 *
 * Dijkstra's elegant algorithm uses three pointers to partition in a single pass.
 * Maintains invariant: [0..left-1]=0, [left..mid-1]=1, [right+1..n-1]=2
 *
 * Key insight: Process elements once as we scan from left to right, immediately
 * placing them in their final positions without needing multiple passes.
 */
function sortColorsAlt(nums: number[]): void {
  let left = 0; // boundary for 0's
  let mid = 0; // current element being examined
  let right = nums.length - 1; // boundary for 2's

  while (mid <= right) {
    if (nums[mid] === 0) {
      // 0 goes to the left side
      swap(nums, mid, left);
      left++;
      mid++;
    } else if (nums[mid] === 1) {
      // 1 stays in the middle, just move mid
      mid++;
    } else {
      // 2 goes to the right side
      swap(nums, mid, right);
      right--;
      // Don't increment mid, we need to check the swapped element
    }
  }
}

/**
 * **Approach 4: Bucket Sort**
 *
 * Time: O(n) - distribute into buckets + collect
 * Space: O(n) - need 3 buckets to store all elements
 *
 * Create 3 separate buckets for each color, distribute elements,
 * then concatenate buckets back into the original array.
 *
 * Key insight: Group elements by value, then combine groups in order.
 * Demonstrates the bucket sort principle applied to color partitioning.
 * Trade-off: Uses extra space but is intuitive and generalizes to more colors.
 */
function sortColorsBucketSort(nums: number[]): void {
  // Step 1: Create 3 buckets for each color
  const bucket0: number[] = [];
  const bucket1: number[] = [];
  const bucket2: number[] = [];

  // Step 2: Distribute elements into appropriate buckets
  for (const num of nums) {
    if (num === 0) {
      bucket0.push(num);
    } else if (num === 1) {
      bucket1.push(num);
    } else {
      bucket2.push(num);
    }
  }

  // Step 3: Concatenate buckets back into original array
  let idx = 0;

  // Copy all 0's
  for (const num of bucket0) {
    nums[idx++] = num;
  }

  // Copy all 1's
  for (const num of bucket1) {
    nums[idx++] = num;
  }

  // Copy all 2's
  for (const num of bucket2) {
    nums[idx++] = num;
  }
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Mixed colors ===");
  const nums1 = [2, 0, 2, 1, 1, 0];
  console.log(`Input: [${nums1}]`);
  sortColors(nums1);
  console.log(`Approach 1 (Selection Sort): [${nums1}]`);
  console.log(`Expected: [0, 0, 1, 1, 2, 2]`);
  console.log();

  console.log("=== Example 2: Already sorted ===");
  const nums2 = [0, 1, 2];
  console.log(`Input: [${nums2}]`);
  sortColors(nums2);
  console.log(`Approach 1 (Selection Sort): [${nums2}]`);
  console.log(`Expected: [0, 1, 2]`);
  console.log();

  console.log("=== Example 3: Reverse sorted ===");
  const nums3 = [2, 1, 0];
  console.log(`Input: [${nums3}]`);
  sortColors(nums3);
  console.log(`Approach 1 (Selection Sort): [${nums3}]`);
  console.log(`Expected: [0, 1, 2]`);
  console.log();

  console.log("=== Example 4: All same color ===");
  const nums4 = [1, 1, 1, 1];
  console.log(`Input: [${nums4}]`);
  sortColors(nums4);
  console.log(`Approach 1 (Selection Sort): [${nums4}]`);
  console.log(`Expected: [1, 1, 1, 1]`);
  console.log();

  console.log("=== Example 5: Two colors only ===");
  const nums5 = [0, 2, 0, 2, 1];
  console.log(`Input: [${nums5}]`);
  sortColors(nums5);
  console.log(`Approach 1 (Selection Sort): [${nums5}]`);
  console.log(`Expected: [0, 0, 1, 2, 2]`);
  console.log();

  console.log("=== Example 2 (Alt): Already sorted ===");
  const nums2Alt = [0, 1, 2];
  console.log(`Input: [${nums2Alt}]`);
  sortColorsAlt(nums2Alt);
  console.log(`Approach 2 (Dutch Flag): [${nums2Alt}]`);
  console.log(`Expected: [0, 1, 2]`);
  console.log();

  console.log("=== Example 3 (Alt): Reverse sorted ===");
  const nums3Alt = [2, 1, 0];
  console.log(`Input: [${nums3Alt}]`);
  sortColorsAlt(nums3Alt);
  console.log(`Approach 2 (Dutch Flag): [${nums3Alt}]`);
  console.log(`Expected: [0, 1, 2]`);
  console.log();

  console.log("=== Example 4 (Alt): All same color ===");
  const nums4Alt = [1, 1, 1, 1];
  console.log(`Input: [${nums4Alt}]`);
  sortColorsAlt(nums4Alt);
  console.log(`Approach 2 (Dutch Flag): [${nums4Alt}]`);
  console.log(`Expected: [1, 1, 1, 1]`);
  console.log();

  console.log("=== Example 5 (Alt): Two colors only ===");
  const nums5Alt = [0, 2, 0, 2, 1];
  console.log(`Input: [${nums5Alt}]`);
  sortColorsAlt(nums5Alt);
  console.log(`Approach 2 (Dutch Flag): [${nums5Alt}]`);
  console.log(`Expected: [0, 0, 1, 2, 2]`);
  console.log();

  console.log("\n=== Approach 3: Counting Sort ===\n");

  console.log("=== Example 1 (Bucket): Mixed colors ===");
  const nums1Bucket = [2, 0, 2, 1, 1, 0];
  console.log(`Input: [${nums1Bucket}]`);
  sortColorsBucketSort(nums1Bucket);
  console.log(`Approach 4 (Bucket Sort): [${nums1Bucket}]`);
  console.log(`Expected: [0, 0, 1, 1, 2, 2]`);
  console.log(`Algorithm:
  Step 1: Create 3 buckets
  Step 2: Distribute - bucket0=[0,0], bucket1=[1,1], bucket2=[2,2]
  Step 3: Concatenate - [0,0] + [1,1] + [2,2] = [0,0,1,1,2,2]`);
  console.log();

  console.log("=== Example 2 (Bucket): Already sorted ===");
  const nums2Bucket = [0, 1, 2];
  console.log(`Input: [${nums2Bucket}]`);
  sortColorsBucketSort(nums2Bucket);
  console.log(`Approach 4 (Bucket Sort): [${nums2Bucket}]`);
  console.log(`Expected: [0, 1, 2]`);
  console.log();

  console.log("=== Example 3 (Bucket): Reverse sorted ===");
  const nums3Bucket = [2, 1, 0];
  console.log(`Input: [${nums3Bucket}]`);
  sortColorsBucketSort(nums3Bucket);
  console.log(`Approach 4 (Bucket Sort): [${nums3Bucket}]`);
  console.log(`Expected: [0, 1, 2]`);
  console.log();

  console.log("=== Example 4 (Bucket): All same color ===");
  const nums4Bucket = [1, 1, 1, 1];
  console.log(`Input: [${nums4Bucket}]`);
  sortColorsBucketSort(nums4Bucket);
  console.log(`Approach 4 (Bucket Sort): [${nums4Bucket}]`);
  console.log(`Expected: [1, 1, 1, 1]`);
  console.log();

  console.log("=== Example 5 (Bucket): Two colors only ===");
  const nums5Bucket = [0, 2, 0, 2, 1];
  console.log(`Input: [${nums5Bucket}]`);
  sortColorsBucketSort(nums5Bucket);
  console.log(`Approach 4 (Bucket Sort): [${nums5Bucket}]`);
  console.log(`Expected: [0, 0, 1, 2, 2]`);
  console.log();
}

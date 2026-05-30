/**
 * Maximum Gap - LeetCode Problem 164
 *
 * Given an integer array nums, return the maximum difference between two successive
 * elements in its sorted form. If the array contains less than two elements, return 0.
 *
 * **Constraint:** You must write an algorithm that runs in linear time and uses linear
 * extra space.
 *
 * @example
 * Input: nums = [3,6,9,1]
 * Output: 3
 *
 * Explanation:
 * - The sorted array is [1,3,6,9]
 * - The maximum gap between successive elements is 9 - 6 = 3
 *
 * @example
 * Input: nums = [10]
 * Output: 0
 *
 * Explanation:
 * - Array has less than 2 elements
 *
 * @example
 * Input: nums = [1,1,1,1]
 * Output: 0
 *
 * Explanation:
 * - All elements are the same, so maximum gap is 0
 *
 * @constraints
 * - 1 <= nums.length <= 10^5
 * - 0 <= nums[i] <= 10^9
 *
 * ## Approaches
 *
 * **Why Linear Time is Required:**
 *
 * Standard comparison sorting algorithms (merge sort, quicksort, heap sort) all have
 * a lower bound of O(n log n). To achieve O(n) time complexity, we must use a
 * non-comparison sorting algorithm.
 *
 * **Approach: Radix Sort (Linear Time)**
 *
 * Radix sort processes numbers digit by digit, sorting based on each digit position.
 * Since we're dealing with numbers up to 10^9 (10 digits), radix sort runs in
 * O(d * (n + k)) = O(10 * (n + 10)) = O(n) time, where:
 * - d = 10 (max digits in 10^9)
 * - k = 10 (digits 0-9)
 * - n = array size
 *
 * **Algorithm:**
 * 1. Use radix sort to sort the array in O(n) time
 * 2. Iterate through sorted array to find maximum gap
 * 3. Return the maximum gap found
 *
 * **Time Complexity:**
 * - Radix Sort: O(d * (n + k)) where d = digits, k = base (10)
 * - With n ≤ 10^5 and numbers ≤ 10^9 (10 digits): O(10 * (n + 10)) = O(n)
 * - Finding max gap: O(n)
 * - **Total: O(n)**
 *
 * **Space Complexity:**
 * - Radix sort requires O(n + k) space for buckets
 * - O(k) = O(10) for digit buckets
 * - **Total: O(n)**
 *
 * **Trade-offs:**
 * - ✅ Linear time O(n) - meets constraint
 * - ✅ Linear space O(n) - meets constraint
 * - ❌ Not stable in-place (uses extra space for buckets)
 * - ❌ Only works for non-negative integers
 * - ✅ Better constants than comparison sorts for large arrays
 *
 * **Why Radix Sort:**
 * - Counting sort would use O(10^9) space (too large for the constraint)
 * - Comparison sorts have O(n log n) lower bound (violates linear time constraint)
 * - Radix sort is the perfect fit: linear time, reasonable space
 *
 * **Approach 2: Bucket Sort (Distribution-Based)**
 *
 * A more elegant approach using the pigeonhole principle:
 * - By pigeonhole principle, the maximum gap is at least ceil((max-min)/(n-1))
 * - Create buckets of fixed size and distribute elements
 * - Track only the min and max value in each bucket (not all values)
 * - The answer is the maximum gap between adjacent non-empty buckets
 *
 * **Key Insight:** The maximum gap cannot be between elements in the same bucket
 * (since bucket size ≤ max gap), so it must be between adjacent buckets.
 *
 * **Algorithm:**
 * 1. Find min and max of array
 * 2. Calculate bucket size = ceil((max - min) / (n - 1))
 * 3. Create buckets and track only min/max in each bucket
 * 4. Compare adjacent bucket boundaries to find maximum gap
 *
 * **Time Complexity:**
 * - Finding min/max: O(n)
 * - Distributing to buckets: O(n)
 * - Finding max gap: O(n)
 * - **Total: O(n)**
 *
 * **Space Complexity:**
 * - Number of buckets = ceil((max - min) / bucketSize) = O(n)
 * - Each bucket stores only 2 values (min, max)
 * - **Total: O(n)**
 *
 * **Comparison:**
 * | Aspect | Radix Sort | Bucket Sort |
 * |--------|-----------|------------|
 * | Time | O(d*(n+k)) | O(n) |
 * | Space | O(n+k) | O(n) |
 * | Stability | Stable | Not stable |
 * | Best for | Any integers | This specific problem |
 * | Complexity | More complex | Elegant, fewer operations |
 * | Cache friendly | Yes | Better (fewer allocations) |
 *
 * @date 30/01/2026
 */

import { radixSort } from "../../algorithms/sort/non-comparison/radix-sort";

/**
 * **Radix Sort Approach: Stable, Linear Time Sorting**
 *
 * Sorts the array using the project's radix sort implementation,
 * then finds the maximum gap between consecutive elements.
 *
 * @param nums - Input array of non-negative integers
 * @returns Maximum difference between successive elements in sorted form
 *
 * @time O(d * (n + k)) where d = digits, k = base (10), simplifies to O(n)
 * @space O(n + k) for bucket arrays
 *
 * Algorithm:
 * 1. Use radix sort (least significant digit first) to sort array - O(n)
 * 2. Calculate maximum gap from sorted array - O(n)
 * 3. Return maximum gap
 */
function maximumGapRadixSort(nums: number[]): number {
  // Edge case: less than 2 elements
  if (nums.length < 2) {
    return 0;
  }

  // Step 1: Sort using radix sort (O(n))
  const sorted = radixSort([...nums]);

  // Step 2: Find maximum gap between consecutive elements
  let maxGap = 0;
  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i] - sorted[i - 1];
    maxGap = Math.max(maxGap, gap);
  }

  return maxGap;
}

interface Bucket {
  used: boolean;
  minVal: number;
  maxVal: number;
}

/**
 * **Bucket Sort Approach: Pigeonhole Principle**
 *
 * Uses the insight that the maximum gap must be between adjacent buckets,
 * not within a bucket. Only tracks min/max in each bucket for efficiency.
 *
 * @param nums - Input array of non-negative integers
 * @returns Maximum difference between successive elements in sorted form
 *
 * @time O(n) - linear distribution and one pass through buckets
 * @space O(n) - for bucket array
 *
 * Algorithm:
 * 1. Find min and max values
 * 2. Calculate bucket size using pigeonhole principle
 * 3. Create buckets and store only min/max in each
 * 4. Find maximum gap between adjacent non-empty bucket boundaries
 */
function maximumGapBucketSort(nums: number[]): number {
  // Edge case: less than 2 elements
  if (nums.length < 2) {
    return 0;
  }

  // Step 1: Find min and max
  let min = nums[0];
  let max = nums[0];
  for (const num of nums) {
    min = Math.min(min, num);
    max = Math.max(max, num);
  }

  // Edge case: all numbers are the same
  if (min === max) {
    return 0;
  }

  // Step 2: Calculate bucket size and number of buckets
  // By pigeonhole principle, max gap ≥ ceil((max - min) / (n - 1))
  // So bucket size should be at least this value
  const bucketSize = Math.max(1, Math.floor((max - min) / (nums.length - 1)));
  const bucketCount = Math.floor((max - min) / bucketSize) + 1;

  // Step 3: Create buckets to track min/max in each
  const buckets: Bucket[] = Array.from({ length: bucketCount }, () => ({
    used: false,
    minVal: Infinity,
    maxVal: -Infinity,
  }));

  // Step 4: Distribute numbers into buckets
  for (const num of nums) {
    const bucketIdx = Math.floor((num - min) / bucketSize);
    buckets[bucketIdx].used = true;
    buckets[bucketIdx].minVal = Math.min(buckets[bucketIdx].minVal, num);
    buckets[bucketIdx].maxVal = Math.max(buckets[bucketIdx].maxVal, num);
  }

  // Step 5: Find maximum gap between adjacent non-empty buckets
  let maxGap = 0;
  let prevBucketMax = min;

  for (const bucket of buckets) {
    // Skip empty buckets
    if (!bucket.used) {
      continue;
    }

    // Gap from previous bucket's max to current bucket's min
    maxGap = Math.max(maxGap, bucket.minVal - prevBucketMax);

    // Update previous bucket's max for next iteration
    prevBucketMax = bucket.maxVal;
  }

  return maxGap;
}

// Example usage
if (require.main === module) {
  console.log("=== Maximum Gap - LeetCode 164 ===\n");

  console.log("=== Example 1: Basic Gap ===");
  const nums1 = [3, 6, 9, 1];
  console.log("Input:", nums1);
  console.log("Radix Sort:", maximumGapRadixSort(nums1));
  console.log("Bucket Sort:", maximumGapBucketSort(nums1));
  console.log("Expected: 3");
  console.log(
    "Explanation: Sorted [1,3,6,9] → gaps: 3-1=2, 6-3=3, 9-6=3 → max=3",
  );
  console.log();

  console.log("=== Example 2: Single Element ===");
  const nums2 = [10];
  console.log("Input:", nums2);
  console.log("Radix Sort:", maximumGapRadixSort(nums2));
  console.log("Bucket Sort:", maximumGapBucketSort(nums2));
  console.log("Expected: 0");
  console.log("Explanation: Less than 2 elements");
  console.log();

  console.log("=== Example 3: All Same ===");
  const nums3 = [1, 1, 1, 1];
  console.log("Input:", nums3);
  console.log("Radix Sort:", maximumGapRadixSort(nums3));
  console.log("Bucket Sort:", maximumGapBucketSort(nums3));
  console.log("Expected: 0");
  console.log("Explanation: No gap between identical elements");
  console.log();

  console.log("=== Example 4: Two Elements ===");
  const nums4 = [1, 10000000];
  console.log("Input:", nums4);
  console.log("Radix Sort:", maximumGapRadixSort(nums4));
  console.log("Bucket Sort:", maximumGapBucketSort(nums4));
  console.log("Expected: 9999999");
  console.log("Explanation: Only one gap: 10000000 - 1");
  console.log();

  console.log("=== Example 5: Unsorted Large Numbers ===");
  const nums5 = [999, 1, 500, 250, 750];
  console.log("Input:", nums5);
  console.log("Radix Sort:", maximumGapRadixSort(nums5));
  console.log("Bucket Sort:", maximumGapBucketSort(nums5));
  console.log("Expected: 250");
  console.log(
    "Explanation: Sorted [1,250,500,750,999] → gaps: 249,250,250,249 → max=250",
  );
  console.log();

  console.log("=== Example 6: Already Sorted ===");
  const nums6 = [1, 2, 3, 4, 5];
  console.log("Input:", nums6);
  console.log("Radix Sort:", maximumGapRadixSort(nums6));
  console.log("Bucket Sort:", maximumGapBucketSort(nums6));
  console.log("Expected: 1");
  console.log("Explanation: Sorted [1,2,3,4,5] → gaps: 1,1,1,1 → max=1");
  console.log();

  console.log("=== Example 7: Reverse Sorted ===");
  const nums7 = [5, 4, 3, 2, 1];
  console.log("Input:", nums7);
  console.log("Radix Sort:", maximumGapRadixSort(nums7));
  console.log("Bucket Sort:", maximumGapBucketSort(nums7));
  console.log("Expected: 1");
  console.log("Explanation: Sorted [1,2,3,4,5] → gaps: 1,1,1,1 → max=1");
  console.log();

  console.log("=== Example 8: Random Distribution ===");
  const nums8 = [100, 200, 1, 50];
  console.log("Input:", nums8);
  console.log("Radix Sort:", maximumGapRadixSort(nums8));
  console.log("Bucket Sort:", maximumGapBucketSort(nums8));
  console.log("Expected: 100");
  console.log("Explanation: Sorted [1,50,100,200] → gaps: 49,50,100 → max=100");
  console.log();

  console.log("=== Performance Comparison ===");
  const largeArray = Array.from({ length: 100000 }, (_, i) =>
    Math.floor(Math.random() * 1000000000),
  );

  const startRadix = performance.now();
  const resultRadix = maximumGapRadixSort([...largeArray]);
  const timeRadix = performance.now() - startRadix;

  const startBucket = performance.now();
  const resultBucket = maximumGapBucketSort([...largeArray]);
  const timeBucket = performance.now() - startBucket;

  console.log(`Array size: ${largeArray.length}`);
  console.log(`Maximum gap (both approaches): ${resultRadix}`);
  console.log(`Radix Sort time: ${timeRadix.toFixed(2)}ms`);
  console.log(`Bucket Sort time: ${timeBucket.toFixed(2)}ms`);
  console.log(`Ratio: ${(timeRadix / timeBucket).toFixed(2)}x`);
  console.log(
    "Note: Both are O(n) - bucket sort often faster in practice with fewer operations!",
  );
}

import { maxArrayIndex } from "../../../utils/max-array-index";
import { timer } from "../../../utils/timer";

/**
 * # Counting Sort - A Non-Comparison Based Sorting Algorithm
 *
 * ## Overview
 *
 * Counting sort is one of the simplest building blocks in the world of non-comparison based sorts.
 * Unlike comparison-based algorithms (quicksort, mergesort, heapsort), counting sort leverages
 * the specific properties of the input data to achieve linear time complexity.
 *
 * **Time Complexity:** O(N + K) where N is the input size and K is the range of values
 * **Space Complexity:** O(N + K) - requires output array and counts array
 *
 * ## Basic Concept - Motivation
 *
 * Consider a special array A = [1, 5, 0, 3, 6, 4, 2] where:
 * - Maximum element is 6, minimum is 0
 * - Each value between 0 and 6 appears exactly once
 * - Array size is 7 (all elements from 0 to 6 show up exactly once)
 *
 * For such arrays, we can sort in a single pass:
 * 1. Initialize an output array of size 7
 * 2. For each element A[i], place it at index A[i] in output
 * 3. Result: sorted array in O(N) time!
 *
 * This works because we map each element directly to its final position using its own value as index.
 *
 * ## Extensions to Handle Real-World Cases
 *
 * The simple version above only works if:
 * 1. Each element is between 0 and N-1 (no negatives)
 * 2. No element is repeated
 * 3. All elements from 0 to N-1 appear exactly once
 *
 * Real-world counting sort handles these limitations:
 * 1. **Duplicate elements** - Track frequency of each value
 * 2. **Non-consecutive values** - Handle arrays with missing values in the range
 * 3. **Offset ranges** - Map values from [min, max] to [0, K] for processing
 *
 * ## Algorithm with Duplicates and Gaps
 *
 * Example: A = [5, 4, 5, 5, 1, 1, 3]
 *
 * **Step 1:** Count frequencies
 * - Create counts array of size max(A) + 1 = [0, 2, 0, 1, 1, 3, 0]
 * - counts[0]=0, counts[1]=2, counts[2]=0, counts[3]=1, counts[4]=1, counts[5]=3
 * - This tells us: 1 appears 2 times, 3 appears 1 time, 4 appears 1 time, 5 appears 3 times
 *
 * **Step 2:** Calculate cumulative sums (starting indices)
 * - startingIndices = [0, 0, 2, 2, 3, 4, 7]
 * - Element 1 starts at index 0 (minimum)
 * - Element 5 starts at index 4 (after 0 zeros, 2 ones, 1 two, 1 three, 1 four)
 * - This tells us exactly where each distinct value's first instance should be placed
 *
 * **Step 3:** Place elements in output
 * - For each element in input, use its value to look up the starting index
 * - Place the element at that index
 * - Increment the index counter for that value so the next instance goes to the next position
 *
 * **Implementation optimization:** Overwrite the counts array with starting indices
 * in-place to reduce additional space usage.
 *
 * ## Handling Negative Numbers and General Ranges
 *
 * If values are between arbitrary min and max (e.g., -5 to 10):
 * 1. **Shift:** Map each value x to x - min (maps to 0-based range)
 * 2. **Count Sort:** Perform counting sort on shifted values
 * 3. **Unshift:** Remap values back to original range
 *
 * Example: Array [-5, -2, 0, 10] with min=-5, max=10
 * - Shift by 5: [0, 3, 5, 15]
 * - Count sort on this range [0, 15]
 * - Unshift by 5: back to original values
 *
 * ## Advantages
 *
 * 1. **Stable sort** - Maintains relative order of equal elements
 * 2. **Linear time complexity** - O(N + K) is optimal for fixed-range integers
 * 3. **Significantly faster** - For large collections with small value range,
 *    outperforms O(N log N) comparison sorts
 * 4. **Predictable performance** - No worst-case degradation like quicksort
 *
 * ## Disadvantages
 *
 * 1. **Extra memory required** - O(N + K) space overhead
 *    (Many comparison sorts work in-place with O(1) or O(log N) space)
 * 2. **Not suitable for large ranges** - When K >> N (e.g., sorting 5 integers with range 0-1M),
 *    the O(N + K) overhead makes it slower than O(N log N) sorts
 * 3. **Not suitable for non-comparable keys** - Cannot sort arrays of arbitrary strings or objects
 * 4. **Limited to fixed-size keys** - Only works with well-defined, bounded key spaces
 *    (integers in range, characters, enums, etc.)
 *
 * ## When to Use Counting Sort
 *
 * ✅ Use when:
 * - Sorting integers in a known, bounded range (like grades 0-100, ages 0-120)
 * - Range K is small relative to input size N (K ≈ N or less)
 * - Stability is important (maintaining original order of equal elements)
 * - Performance-critical with repeated values in small range
 *
 * ❌ Don't use when:
 * - Range K is much larger than N (e.g., sorting 10 billion-value integers)
 * - Keys are strings, complex objects, or unbounded
 * - In-place sorting is required (O(1) space)
 * - Input contains negative numbers (unless you implement the offset version)
 *
 * @date 21/06/2023 - 00:00:00
 */
export const countSort = (array: number[]) => {
  const maxIndex = maxArrayIndex(array);
  const maxValue = array[maxIndex];
  let counter = new Array(maxValue + 1).fill(0);
  let result = [];
  let numItemsBefore = 0;

  // The counting step is considered the first pass
  for (const element of array) {
    counter[element]++;
  }

  // The starting indexes is the second pass (cumulative sum). Some authors
  // desconsider this as a pass
  for (const [index, count] of counter.entries()) {
    counter[index] = numItemsBefore;
    numItemsBefore += count;
  }

  // This is the third pass (placement)
  for (const element of array) {
    result[counter[element]] = element;
    // since we have placed an item in index counts[elem], we need to
    // increment counts[elem] index by 1 so the next duplicate element
    // is placed in appropriate index
    counter[element]++;
  }

  return result;
};

// Example usage
if (require.main === module) {
  // Example 1: Basic countSort with small range
  console.log("=== Example 1: Basic Count Sort ===");
  const arr1 = [4, 2, 8, 1, 9, 2, 5];
  console.log("Input:", arr1);
  console.log("Output:", countSort([...arr1]));
  console.log();

  // Example 2: Array with duplicates
  console.log("=== Example 2: Array with Duplicates ===");
  const arr2 = [3, 3, 1, 2, 1, 3, 2, 1];
  console.log("Input:", arr2);
  console.log("Output:", countSort([...arr2]));
  console.log();

  // Example 3: Already sorted array
  console.log("=== Example 3: Already Sorted Array ===");
  const arr3 = [1, 2, 3, 4, 5];
  console.log("Input:", arr3);
  console.log("Output:", countSort([...arr3]));
  console.log();

  // Example 4: Reverse sorted array
  console.log("=== Example 4: Reverse Sorted Array ===");
  const arr4 = [9, 7, 5, 3, 1];
  console.log("Input:", arr4);
  console.log("Output:", countSort([...arr4]));
  console.log();

  // Example 5: Large dataset performance
  console.log("=== Example 5: Performance Test - Large Dataset ===");
  console.log(
    timer(() =>
      countSort([
        499, 498, 497, 496, 495, 494, 493, 492, 491, 490, 489, 488, 487, 486,
        485, 484, 483, 482, 481, 480, 479, 478, 477, 476, 475, 474, 473, 472,
        471, 470, 469, 468, 467, 466, 465, 464, 463, 462, 461, 460, 459, 458,
        457, 456, 455, 454, 453, 452, 451, 450, 449, 448, 447, 446, 445, 444,
        443, 442, 441, 440, 439, 438, 437, 436, 435, 434, 433, 432, 431, 430,
        429, 428, 427, 426, 425, 424, 423, 422, 421, 420, 419, 418, 417, 416,
        415, 414, 413, 412, 411, 410, 409, 408, 407, 406, 405, 404, 403, 402,
        401, 400, 399, 398, 397, 396, 395, 394, 393, 392, 391, 390, 389, 388,
        387, 386, 385, 384, 383, 382, 381, 380, 379, 378, 377, 376, 375, 374,
        373, 372, 371, 370, 369, 368, 367, 366, 365, 364, 363, 362, 361, 360,
        359, 358, 357, 356, 355, 354, 353, 352, 351, 350, 349, 348, 347, 346,
        345, 344, 343, 342, 341, 340, 339, 338, 337, 336, 335, 334, 333, 332,
        331, 330, 329, 328, 327, 326, 325, 324, 323, 322, 321, 320, 319, 318,
        317, 316, 315, 314, 313, 312, 311, 310, 309, 308, 307, 306, 305, 304,
        303, 302, 301, 300, 299, 298, 297, 296, 295, 294, 293, 292, 291, 290,
        289, 288, 287, 286, 285, 284, 283, 282, 281, 280, 279, 278, 277, 276,
        275, 274, 273, 272, 271, 270, 269, 268, 267, 266, 265, 264, 263, 262,
        261, 260, 259, 258, 257, 256, 255, 254, 253, 252, 251, 250, 249, 248,
        247, 246, 245, 244, 243, 242, 241, 240, 239, 238, 237, 236, 235, 234,
        233, 232, 231, 230, 229, 228, 227, 226, 225, 224, 223, 222, 221, 220,
        219, 218, 217, 216, 215, 214, 213, 212, 211, 210, 209, 208, 207, 206,
        205, 204, 203, 202, 201, 200, 199, 198, 197, 196, 195, 194, 193, 192,
        191, 190, 189, 188, 187, 186, 185, 184, 183, 182, 181, 180, 179, 178,
        177, 176, 175, 174, 173, 172, 171, 170, 169, 168, 167, 166, 165, 164,
        163, 162, 161, 160, 159, 158, 157, 156, 155, 154, 153, 152, 151, 150,
        149, 148, 147, 146, 145, 144, 143, 142, 141, 140, 139, 138, 137, 136,
        135, 134, 133, 132, 131, 130, 129, 128, 127, 126, 125, 124, 123, 122,
        121, 120, 119, 118, 117, 116, 115, 114, 113, 112, 111, 110, 109, 108,
        107, 106, 105, 104, 103, 102, 101, 100, 99, 98, 97, 96, 95, 94, 93, 92,
        91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74,
        73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56,
        55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38,
        37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20,
        19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0,
      ]),
    ),
  );

  // Example 6: Single element
  console.log("=== Example 6: Single Element ===");
  const arr7 = [42];
  console.log("Input:", arr7);
  console.log("Output:", countSort([...arr7]));
  console.log();

  // Example 7: All same elements
  console.log("=== Example 7: All Same Elements ===");
  const arr8 = [5, 5, 5, 5, 5];
  console.log("Input:", arr8);
  console.log("Output:", countSort([...arr8]));
}

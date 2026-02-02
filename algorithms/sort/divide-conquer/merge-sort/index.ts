import { timer } from "../../../utils/timer";

const merge = (a: number[], b: number[]) => {
  let i = 0;
  let j = 0;
  const result = [];

  while (i < a.length && j < b.length) {
    result.push(a[i] < b[j] ? a[i++] : b[j++]);
  }

  return result.concat(i < a.length ? a.slice(i) : b.slice(j));
};

/**
 * # Merge Sort - Classic Divide-and-Conquer Algorithm
 *
 * One of the classic examples of the divide-and-conquer algorithm is the merge sort algorithm.
 * Merge sort is an efficient and general-purpose sorting algorithm that guarantees O(n log n)
 * time complexity in all cases (best, average, and worst).
 *
 * ## Intuition
 *
 * There are two approaches to implement merge sort: **top-down** and **bottom-up**.
 * This implementation uses the **top-down approach**, which is naturally implemented using recursion.
 *
 * ### Three Steps (Divide-and-Conquer Pattern)
 *
 * **1. DIVIDE:** Split the unsorted list into two equal halves (approximately)
 *    - Example: [5, 2, 8, 1, 9, 3, 7, 4] → [5, 2, 8, 1] + [9, 3, 7, 4]
 *
 * **2. CONQUER:** Recursively sort each of the sublists
 *    - Recursively apply divide-and-conquer to each half
 *    - Base case: Single element or empty list is already sorted
 *
 * **3. COMBINE:** Merge the sorted sublists to produce the final sorted list
 *    - Combine two sorted lists into one sorted list in O(n) time
 *    - Repeatedly merge until one single sorted list remains
 *
 * ### Top-down Approach (Recursive)
 *
 * Visual representation:
 * ```
 * [8,3,5,4,7,6,1,2]              Level 0 (1 list of 8 elements)
 *        |
 *   /----+----\
 *   |         |
 * [8,3,5,4] [7,6,1,2]             Level 1 (2 lists of 4 elements)
 *   |          |
 *  /+\        /+\
 * [8,3][5,4] [7,6][1,2]           Level 2 (4 lists of 2 elements)
 * | | | | | | | |
 * [3,8][4,5][6,7][1,2]            Level 3 (8 lists of 1 element - sorted)
 *   |          |
 *  /+\        /+\
 * [3,4,5,8] [1,2,6,7]             Level 2 (merge back up)
 *   \----+----/
 *        |
 * [1,2,3,4,5,6,7,8]               Level 0 (final sorted list)
 * ```
 *
 * ### Merging Process
 *
 * The merging process compares elements from two sorted lists and places the smaller
 * element first, maintaining relative order (stable sort):
 *
 * Example: Merge [3, 8] and [4, 5]
 * ```
 * Pointers:     i=0, j=0    (start of each list)
 *             [3, 8]
 *             [4, 5]
 *
 * Step 1: Compare 3 and 4 → 3 is smaller, add to result
 *       Result: [3], i=1, j=0
 *
 * Step 2: Compare 8 and 4 → 4 is smaller, add to result
 *       Result: [3, 4], i=1, j=1
 *
 * Step 3: Compare 8 and 5 → 5 is smaller, add to result
 *       Result: [3, 4, 5], i=1, j=2
 *
 * Step 4: j reached end, add remaining from first list
 *       Result: [3, 4, 5, 8]
 * ```
 *
 * ## Complexity Analysis
 *
 * ### Time Complexity: O(n log n)
 *
 * The algorithm has two phases:
 *
 * **Phase 1: Dividing (Top-down)**
 * - We recursively divide the list in half until single elements remain
 * - Each division takes O(1) time (just calculating the midpoint)
 * - We perform log(n) divisions (depth of recursion tree)
 * - Total: O(log n) levels
 *
 * **Phase 2: Merging (Bottom-up)**
 * - At each level, we merge all elements together
 * - Merging two sorted lists of total size n takes O(n) time
 * - Each level contains all n elements (regardless of how many lists)
 * - There are log(n) levels
 * - Total merging work: O(n) × O(log n) = O(n log n)
 *
 * **Overall Time Complexity: O(n log n)** for all cases (best, average, worst)
 *
 * This is better than:
 * - Bubble Sort: O(n²)
 * - Selection Sort: O(n²)
 * - Insertion Sort: O(n²) worst case
 *
 * ### Space Complexity: O(n)
 *
 * - We need space to store sublists during division: O(log n) for recursion stack
 * - We need space to store merged results: O(n) for temporary arrays
 * - Total space required: O(n)
 *
 * This is a trade-off: we sacrifice space for guaranteed fast time.
 *
 * **Stability:** Stable by default (equal elements maintain original order)
 *
 * ## Strengths
 *
 * ✅ Guaranteed O(n log n) time in all cases (predictable performance)
 * ✅ Stable sort (preserves relative order of equal elements)
 * ✅ Easily parallelizable for multi-core processing
 * ✅ Excellent for external sorting (data larger than RAM)
 * ✅ Works well with linked lists
 *
 * ## Weaknesses
 *
 * ❌ Requires O(n) extra space for temporary arrays
 * ❌ Slower in practice than QuickSort (constant factor overhead)
 * ❌ Memory allocation/copying overhead on small datasets
 * ❌ Harder to implement in-place (complex, not commonly done)
 *
 * ## When to Use
 *
 * ✅ Use merge sort when:
 * - Worst-case O(n log n) guarantee is essential (real-time systems)
 * - Stability matters (sorting records by multiple fields)
 * - Parallel processing is needed
 * - External sorting (data doesn't fit in memory)
 * - Sorting linked lists (better than QuickSort)
 * - You need predictable, consistent performance
 *
 * ❌ Avoid merge sort when:
 * - Space is limited and you need in-place sorting
 * - Average-case speed matters more than worst-case (use QuickSort)
 * - Working with small datasets (overhead dominates)
 *
 * ## Comparison with Other Algorithms
 *
 * See [algorithms/sort/index.ts](../index.ts) for a comprehensive comparison table
 * of all sorting algorithms (Bubble Sort, Selection Sort, Insertion Sort, Merge Sort,
 * Quick Sort, Heap Sort, Counting Sort, and Radix Sort).
 *
 * Key differences for Merge Sort:
 * - **Time:** O(n log n) guaranteed in all cases (best, average, worst)
 * - **Space:** O(n) extra space required (trade-off for guaranteed performance)
 * - **Stability:** ✅ Stable (preserves equal element order)
 * - **Use Case:** Predictable performance, stability matters, external sorting
 *
 * ## References
 *
 * - Merge Sort algorithm. Wikipedia: https://en.wikipedia.org/wiki/Merge_sort
 * - Introduction to Algorithms (CLRS) - Chapter 2.3
 * - LeetCode Explore: Merge Sort Fundamentals
 * - Sorting Fundamentals: [algorithms/sort/index.ts](../index.ts)
 *
 * @date 30/01/2026
 *
 * Mergesort - Stable divide-and-conquer comparison-based sorting algorithm.
 *
 * **Time Complexity:**
 * - Best, average, and worst case: **O(n log n)** - Guaranteed predictable performance
 *
 * **Space Complexity:** **O(n)** - Requires additional space for temporary merge arrays
 *
 * **Stability:** Stable by default (equal elements maintain original order)
 */
export const mergeSort = (array: number[]) => {
  if (array.length > 1) {
    const middle = Math.floor(array.length / 2);
    const left = mergeSort(array.slice(0, middle));
    const right = mergeSort(array.slice(middle));
    array = merge(left, right);
  }

  return array;
};

// Example usage
if (require.main === module) {
  console.log(
    timer(() =>
      mergeSort([
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
}

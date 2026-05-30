import { swap } from "../../../utils/swap";
import { timer } from "../../../utils/timer";

/**
 * Bubble Sort Algorithm
 *
 * ## Core Concept
 *
 * Bubble sort is a simple sorting algorithm that repeatedly compares adjacent elements
 * and swaps them if they're in the wrong order. The process continues until no more
 * swaps are needed, indicating the array is sorted.
 *
 * **The Idea:** Large values "bubble up" to the end of the array with each pass.
 *
 * ## Algorithm Overview
 *
 * Bubble sort operates on a simple principle:
 * 1. Compare two adjacent elements
 * 2. If the left element is greater than the right element, swap them
 * 3. Move to the next pair of adjacent elements
 * 4. Repeat until the end of the array is reached (one complete pass)
 * 5. Repeat entire process until a complete pass makes no swaps
 *
 * **Why it works:** After each pass, the largest unsorted element settles in its
 * correct position at the end. After n passes, all elements are sorted.
 *
 * ## Time Complexity
 *
 * **Worst Case: O(n²)**
 * - Occurs when array is reverse sorted (minimum element at end)
 * - Requires (n-1) passes to move minimum element to front
 * - Each pass examines (n-1) pairs
 * - Total: (n-1) + (n-2) + ... + 1 = n(n-1)/2 = O(n²)
 *
 * **Best Case: O(n)**
 * - Occurs when array is already sorted
 * - Single pass detects no swaps needed
 *
 * **Average Case: O(n²)**
 * - Most random inputs still require quadratic time
 *
 * ## Space Complexity
 *
 * **O(1) - Constant Space**
 * - All operations performed in-place
 * - Only swaps adjacent elements in original array
 * - No additional data structures required
 *
 * ## Stability
 *
 * **Bubble Sort is STABLE**
 * - Equal elements are never swapped with each other
 * - Since swaps only occur when left > right (strictly greater)
 * - Equal elements maintain their relative order
 * - Important when sorting objects with multiple attributes
 *
 * ## Key Characteristics
 *
 * ✅ **Advantages:**
 * - Simple to understand and implement
 * - Stable sort (preserves relative order of equal elements)
 * - In-place sorting (minimal memory overhead)
 * - Can detect nearly-sorted arrays (best case O(n))
 *
 * ❌ **Disadvantages:**
 * - Very slow for large datasets (O(n²) worst case)
 * - Inefficient compared to modern algorithms
 * - Rarely used in practice for real applications
 * - Makes many unnecessary comparisons and swaps
 *
 * ## When to Use
 *
 * Bubble sort is primarily useful for:
 * - Educational purposes (learning sorting concepts)
 * - Very small datasets where simplicity matters
 * - Nearly-sorted data where early termination is possible
 * - Systems where stable sorting is critical and data is tiny
 *
 * Avoid bubble sort for:
 * - Production code with performance requirements
 * - Large datasets (thousands+ elements)
 * - Any performance-critical application
 *
 * @date 28/01/2026
 */
export const bubbleSort = (array: number[]) => {
  for (let i = 0, arrayLength = array.length; i < arrayLength; i++) {
    for (let j = 0; j < arrayLength - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        swap(array, j, j + 1);
      }
    }
  }
  return array;
};

// Example usage
if (require.main === module) {
  console.log(
    timer(() =>
      bubbleSort([
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

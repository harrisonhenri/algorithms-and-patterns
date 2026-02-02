import { getDigit } from "../../../utils/get-digit";
import { maxDigitCount } from "../../../utils/max-digit-count";
import { timer } from "../../../utils/timer";

/**
 * # Radix Sort - Non-Comparison Sorting with Linear Time Complexity
 *
 * ## Overview
 *
 * Radix sort is an extension of counting sort that overcomes its key limitations:
 * - Counting sort struggles with strings (unconstrained alphabet size)
 * - Counting sort becomes inefficient with very large integer ranges (huge memory overhead)
 *
 * **Radix sort excels at:**
 * - Collections of strings with reasonable lengths
 * - Collections of integers, especially when maximum value is large
 * - Any data where you can extract comparable "digits" or "characters"
 *
 * **Time Complexity:** O(W * (N + K)) where:
 * - W = maximum digit length (number of passes through the array)
 * - N = array size
 * - K = alphabet size (10 for digits, 26+ for letters)
 *
 * **Space Complexity:** O(N + K) - same as counting sort per pass
 *
 * ## Key Insight: Least Significant Digit (LSD) Radix Sort
 *
 * The algorithm processes digits from **right to left** (least significant to most significant):
 * 1. Sort by the rightmost digit using counting sort (stable)
 * 2. Sort by the next digit (ties maintain previous order due to stability)
 * 3. Repeat until all digits are processed
 * 4. Result: fully sorted array
 *
 * **Why this works:** The stability of counting sort ensures that when two numbers
 * have the same digit at position k, their relative order from previous iterations
 * is preserved, achieving correct sorting with multiple passes.
 *
 * ## Example: LSD Radix Sort Step-by-Step
 *
 * Input: A = [256, 336, 736, 443, 831, 907]
 *
 * **Pass 1 (Sort by ones place):**
 * ```
 * 256(6) 336(6) 736(6) 443(3) 831(1) 907(7)
 *                                      ↓
 * [831, 443, 256, 336, 736, 907]
 * ```
 * - 831 first (1 is smallest)
 * - Then 443 (3)
 * - Then 256, 336, 736 (all have 6, maintain relative order)
 * - Then 907 (7 is largest)
 *
 * **Pass 2 (Sort by tens place):**
 * ```
 * 831(3) 443(4) 256(5) 336(3) 736(3) 907(0)
 *                                      ↓
 * [907, 831, 336, 736, 443, 256]
 * ```
 * - 907 first (0 is smallest)
 * - Then 831, 336, 736 (all have 3, maintain relative order from pass 1)
 * - Then 443 (4)
 * - Then 256 (5)
 *
 * **Pass 3 (Sort by hundreds place):**
 * ```
 * 907(9) 831(8) 336(3) 736(7) 443(4) 256(2)
 *                                      ↓
 * [256, 336, 443, 736, 831, 907]  ← Fully sorted!
 * ```
 *
 * ## Handling Variable Digit Lengths
 *
 * When numbers have different digit counts:
 * - Numbers with fewer digits are treated as having leading zeros
 * - These zeros automatically sort them to the beginning (correct placement)
 * - Example: 256 (3 digits) vs 5 (1 digit) treats 5 as 005
 *
 * For strings:
 * - Pad shorter strings with special characters (treated as minimum values)
 * - Example: "cat" becomes "cat\0" to match length of "dogs"
 *
 * ## Algorithm Steps
 *
 * 1. **Find maximum digit count (W)** - determines number of passes needed
 * 2. **For k = 0 to W-1 (from least to most significant):**
 *    - Create 10 buckets (digits 0-9) or K buckets (alphabet size)
 *    - Place each number in bucket based on its digit at position k
 *    - Concatenate buckets back into array (stable sort property preserved)
 * 3. **Return sorted array**
 *
 * ## Advantages
 *
 * 1. **Linear time for fixed-width data** - O(W*(N+K)) ≈ O(N) when W is small
 * 2. **Faster than O(N log N) sorts** - for large datasets with small W
 * 3. **Stable sort** - maintains relative order of equal elements
 * 4. **Handles strings naturally** - extends easily to string sorting
 * 5. **Predictable performance** - no worst-case degradation
 *
 * ## Disadvantages
 *
 * 1. **Memory overhead** - requires O(N + K) extra space per pass
 * 2. **Only for fixed-range keys** - requires extractable "digits" or characters
 * 3. **Overhead for small datasets** - O(W * K) overhead can be significant
 * 4. **Must process all digits** - can't short-circuit even if partially sorted
 *    (unlike MSD radix sort which can be adaptive)
 * 5. **Space issues with large K** - if alphabet size is huge, memory becomes problem
 *
 * ## When to Use Radix Sort
 *
 * ✅ Use when:
 * - Sorting integers with many digits but reasonable range
 * - W (digit count) is small compared to N
 * - Sorting strings of bounded length
 * - Stability is important
 * - You need predictable O(W*N) performance
 * - Need faster than O(N log N) for large datasets
 *
 * ❌ Don't use when:
 * - K (alphabet size) is extremely large
 * - W (digit/character count) is very large
 * - In-place sorting required (radix sort needs O(N + K) space)
 * - Keys are truly unbounded (arbitrary strings with variable length)
 * - Small datasets (overhead of multiple passes dominates)
 *
 * ## LSD vs MSD Radix Sort
 *
 * **LSD (Least Significant Digit) - This Implementation:**
 * - Processes digits right to left
 * - Simpler to implement
 * - Processes all digits regardless of data distribution
 * - Stability comes naturally
 *
 * **MSD (Most Significant Digit):**
 * - Processes digits left to right
 * - More complex implementation (recursive)
 * - Can adapt to data distribution
 * - Better average/best case in some scenarios
 * - Can be used for prefix-based partitioning
 *
 * @date 21/06/2023 - 00:00:00
 */
export const radixSort = (array: number[]) => {
  let maxDigitValue = maxDigitCount(array);

  for (let k = 0; k < maxDigitValue; k++) {
    let digitBuckets: number[][] = Array.from({ length: 10 }, () => []);

    for (let i = 0; i < array.length; i++) {
      let digit = getDigit(array[i], k);
      digitBuckets[digit].push(array[i]);
    }

    array = [...digitBuckets.flat()];
  }

  return array;
};

// Example usage
if (require.main === module) {
  console.log(
    timer(() =>
      radixSort([
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

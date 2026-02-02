import { MinHeap } from "../../structures/heap/min-heap";

/**
 * Kth Smallest Element in a Sorted Matrix - LeetCode Problem 378
 *
 * Problem Statement:
 * Given an n x n matrix where each of the rows and columns is sorted in
 * ascending order, return the kth smallest element in the matrix.
 *
 * Note that it is the kth smallest element in the sorted order, not the
 * kth distinct element.
 *
 * You must find a solution with a memory complexity better than O(n²).
 *
 * @example
 * Input: matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8
 * Output: 13
 * Explanation: The elements in the matrix are [1,5,9,10,11,12,13,13,15],
 * and the 8th smallest number is 13.
 *
 * @constraints
 * - n == matrix.length == matrix[i].length
 * - 1 <= n <= 300
 * - -10^9 <= matrix[i][j] <= 10^9
 * - All the rows and columns of the matrix are guaranteed to be sorted.
 * - 1 <= k <= n²
 * - All the elements of the matrix are unique (implied by constraints)
 *
 * ## Approaches
 *
 * **Approach 1: Min-Heap with Early Termination (Optimal Time-Space Tradeoff)**
 *
 * Use a min-heap to explore the matrix in sorted order.
 * Start with top-left corner (smallest), pop k times.
 * When popping (r, c), add neighbors (r+1, c) and (r, c+1) if not visited.
 *
 * Algorithm:
 * 1. Create min-heap with (value, row, col)
 * 2. Add (matrix[0][0], 0, 0) to heap
 * 3. Use visited set to avoid adding same cell twice
 * 4. Pop from heap k times:
 *    - Each pop gets the next smallest
 *    - Add unvisited neighbors
 * 5. Return kth popped value
 *
 * @time O(k log k) - heap operations up to k elements, k < n²
 * @space O(k) - heap stores at most k elements
 * **Trade-off:** Excellent when k << n². Early termination avoids exploring whole matrix.
 *
 * **Approach 2: Binary Search on Value Range**
 *
 * Binary search on the range [min_value, max_value] to find kth smallest.
 * For each mid value, count how many elements ≤ mid.
 * Use the property that matrix is sorted row-wise and column-wise.
 *
 * Algorithm:
 * 1. Set left = matrix[0][0], right = matrix[n-1][n-1]
 * 2. Binary search on value:
 *    - For each mid, count(≤ mid) elements
 *      - Start from top-right (n-1, 0)
 *      - Move left if mid < matrix[r][c], down otherwise
 *    - If count ≤ k, search higher; else search lower
 * 3. Return the binary search result
 *
 * Count algorithm (O(n)):
 * - Start at top-right corner
 * - If element ≤ target: increment count, move down (more elements in this column)
 * - Else: move left (fewer elements needed)
 *
 * @time O(n log n log(max - min)) - binary search + counting n elements per check
 * @space O(1) - only pointers, no heap/visited set
 * **Trade-off:** Space optimal. Slower for small k, but scales for any k.
 *
 * **Approach 3: Min-Heap Extract All (Simple but Slower)**
 *
 * Add all n² elements to min-heap, pop k times.
 * Simplest to implement but uses O(n²) space.
 *
 * @time O(n² + k log n²) = O(n² + k log n)
 * @space O(n²) - all elements in heap (violates space constraint)
 * **Trade-off:** Simplest code, worst space. Only for small n or understanding.
 *
 * @date 26/01/2026
 */

/**
 * Represents a cell in the matrix with its value and position
 */
interface MatrixCell {
  value: number;
  row: number;
  col: number;
}

/**
 * **Approach 1: Min-Heap with Early Termination (Optimal)**
 *
 * Time: O(k log k), Space: O(k)
 *
 * Use a min-heap to pop elements in sorted order.
 * Start from top-left (smallest) and expand to neighbors.
 *
 * @param matrix - n x n sorted matrix (rows and columns ascending)
 * @param k - Find the kth smallest element
 * @returns The kth smallest element in the matrix
 */
function kthSmallestMinHeap(matrix: number[][], k: number): number {
  const n = matrix.length;

  // Min-heap comparator: smaller value comes first
  const minHeap = new MinHeap<MatrixCell>((a, b) => a.value - b.value);

  // Track visited cells to avoid duplicates
  const visited = new Set<string>();

  // Start from top-left corner (smallest element)
  minHeap.add({ value: matrix[0][0], row: 0, col: 0 });
  visited.add("0,0");

  let result = matrix[0][0];

  // Poll k times to get kth smallest
  for (let i = 0; i < k; i++) {
    const cell = minHeap.poll();
    if (!cell) break;

    result = cell.value;

    // Add neighbors: right and down
    // Right neighbor (same row, next column)
    if (cell.col + 1 < n && !visited.has(`${cell.row},${cell.col + 1}`)) {
      minHeap.add({
        value: matrix[cell.row][cell.col + 1],
        row: cell.row,
        col: cell.col + 1,
      });
      visited.add(`${cell.row},${cell.col + 1}`);
    }

    // Down neighbor (next row, same column)
    if (cell.row + 1 < n && !visited.has(`${cell.row + 1},${cell.col}`)) {
      minHeap.add({
        value: matrix[cell.row + 1][cell.col],
        row: cell.row + 1,
        col: cell.col,
      });
      visited.add(`${cell.row + 1},${cell.col}`);
    }
  }

  return result;
}

/**
 * Helper function to count elements ≤ target and track bounds
 * Uses top-right corner traversal: O(n) time
 *
 * Algorithm:
 * - Start at bottom-left (n-1, 0)
 * - If element ≤ target: count all elements in this column below, move right
 * - Else: move up and track smallest element > target
 * - Track largest element ≤ target for binary search optimization
 *
 * @param matrix - n x n sorted matrix
 * @param target - Value to count against
 * @param bounds - [smallestLessOrEqual, largestGreater] for binary search optimization
 * @returns Count of elements ≤ target
 */
function countElementsLessOrEqual(
  matrix: number[][],
  target: number,
  bounds: [number, number],
): number {
  const n = matrix.length;
  let count = 0;
  let row = n - 1; // Start at bottom-left
  let col = 0;

  while (row >= 0 && col < n) {
    if (matrix[row][col] > target) {
      // Current element > target
      // Track the smallest number greater than target
      bounds[1] = Math.min(bounds[1], matrix[row][col]);
      row--; // Move up
    } else {
      // Current element ≤ target
      // Track the largest number less than or equal to target
      bounds[0] = Math.max(bounds[0], matrix[row][col]);
      // All elements above in this column are also ≤ target
      count += row + 1;
      col++; // Move right
    }
  }

  return count;
}

/**
 * **Approach 2: Binary Search on Value Range with Bounds Tracking (Space-Optimal)**
 *
 * Time: O(n log(max - min)), Space: O(1)
 *
 * Binary search on the value range [min, max] to find the kth smallest.
 * During count, track the actual smallest value ≤ mid and largest value > mid.
 * Use these tracked values as the next binary search bounds (smarter than mid±1).
 * Early return when count == k (exact match).
 *
 * @param matrix - n x n sorted matrix
 * @param k - Find the kth smallest element
 * @returns The kth smallest element in the matrix
 */
function kthSmallestBinarySearch(matrix: number[][], k: number): number {
  const n = matrix.length;
  let start = matrix[0][0]; // Minimum: top-left
  let end = matrix[n - 1][n - 1]; // Maximum: bottom-right

  // Binary search on the value range
  while (start < end) {
    const mid = start + Math.floor((end - start) / 2);

    // Track bounds: [largest ≤ mid, smallest > mid]
    // This allows us to jump to actual matrix values instead of arbitrary midpoints
    const bounds: [number, number] = [matrix[0][0], matrix[n - 1][n - 1]];
    const count = countElementsLessOrEqual(matrix, mid, bounds);

    // Early return if we found the exact kth element during count
    if (count === k) {
      return bounds[0]; // Return the largest value ≤ mid
    }

    if (count < k) {
      // kth element is larger than mid
      // Jump to smallest value > mid (better than mid + 1)
      start = bounds[1];
    } else {
      // kth element is ≤ mid
      // Jump to largest value ≤ mid (better than mid - 1)
      end = bounds[0];
    }
  }

  return start;
}

/**
 * **Approach 3: Min-Heap Extract All (Simple, Higher Space)**
 *
 * Time: O(n² + k log n), Space: O(n²)
 *
 * Add all elements to heap, pop k times.
 * Simplest implementation but violates space constraint.
 *
 * @param matrix - n x n sorted matrix
 * @param k - Find the kth smallest element
 * @returns The kth smallest element in the matrix
 */
function kthSmallestHeapAll(matrix: number[][], k: number): number {
  const n = matrix.length;

  // Min-heap with all elements
  const minHeap = new MinHeap<number>((a, b) => a - b);

  // Add all elements to heap
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      minHeap.add(matrix[i][j]);
    }
  }

  // Poll k-1 times to reach kth element
  let result = 0;
  for (let i = 0; i < k; i++) {
    result = minHeap.poll()!;
  }

  return result;
}

// Example usage
if (require.main === module) {
  console.log("=== Kth Smallest Element in a Sorted Matrix ===\n");

  // Example 1: Basic case
  console.log("Example 1: Basic Case");
  const matrix1 = [
    [1, 5, 9],
    [10, 11, 13],
    [12, 13, 15],
  ];
  const k1 = 8;
  console.log("Matrix:");
  matrix1.forEach((row) => console.log(`  [${row.join(", ")}]`));
  console.log(`k = ${k1}`);
  console.log(
    "Min-Heap:",
    kthSmallestMinHeap(matrix1, k1),
    "| Binary-Search:",
    kthSmallestBinarySearch(matrix1, k1),
    "| Heap-All:",
    kthSmallestHeapAll(matrix1, k1),
  );
  console.log("Expected: 13 (sorted array: [1,5,9,10,11,12,13,13,15])");
  console.log();

  // Example 2: k = 1 (minimum element)
  console.log("Example 2: k = 1 (Find Minimum)");
  const matrix2 = [
    [1, 2],
    [1, 1],
  ];
  const k2 = 1;
  console.log("Matrix:");
  matrix2.forEach((row) => console.log(`  [${row.join(", ")}]`));
  console.log(`k = ${k2}`);
  console.log(
    "Min-Heap:",
    kthSmallestMinHeap(matrix2, k2),
    "| Binary-Search:",
    kthSmallestBinarySearch(matrix2, k2),
  );
  console.log("Expected: 1 (minimum element)");
  console.log();

  // Example 3: k = n² (maximum element)
  console.log("Example 3: k = n² (Find Maximum)");
  const matrix3 = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  const k3 = 9;
  console.log("Matrix:");
  matrix3.forEach((row) => console.log(`  [${row.join(", ")}]`));
  console.log(`k = ${k3}`);
  console.log(
    "Min-Heap:",
    kthSmallestMinHeap(matrix3, k3),
    "| Binary-Search:",
    kthSmallestBinarySearch(matrix3, k3),
  );
  console.log("Expected: 9 (maximum element)");
  console.log();

  // Example 4: Larger matrix, small k
  console.log("Example 4: Larger Matrix with Small k");
  const matrix4 = [
    [-8, -7, -7, 0, 9],
    [-6, -5, -3, 0, 9],
    [-5, -4, -2, 2, 9],
    [1, 2, 4, 4, 9],
    [2, 3, 5, 6, 9],
  ];
  const k4 = 5;
  console.log("Matrix 5x5 with various values");
  console.log(`k = ${k4}`);
  console.log(
    "Min-Heap:",
    kthSmallestMinHeap(matrix4, k4),
    "| Binary-Search:",
    kthSmallestBinarySearch(matrix4, k4),
  );
  console.log();

  // Example 5: Performance comparison
  console.log("=== Performance Analysis ===");
  console.log("Approach 1 - Min-Heap with Early Termination:");
  console.log("  - Time: O(k log k) - pop k elements with log k heap ops");
  console.log("  - Space: O(k) - heap and visited set grow up to k");
  console.log("  - Best for: small k relative to n²");
  console.log("  - Advantage: Early termination, doesn't explore whole matrix");
  console.log();
  console.log("Approach 2 - Binary Search on Value:");
  console.log("  - Time: O(n log(max - min)) - log range × counting");
  console.log("  - Space: O(1) - only pointers, true space optimal!");
  console.log("  - Best for: any k, need constant space");
  console.log("  - Advantage: Space optimal, works for large k");
  console.log();
  console.log("Approach 3 - Heap All Elements:");
  console.log("  - Time: O(n² + k log n²) - load all then pop k");
  console.log("  - Space: O(n²) - violates space constraint");
  console.log("  - Best for: understanding, very small n");
  console.log("  - Disadvantage: Violates memory constraint!");
}

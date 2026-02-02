import { MinHeap } from "../../structures/heap/min-heap";

/**
 * Search a 2D Matrix II - LeetCode Problem 240
 *
 * Problem Statement:
 * Write an efficient algorithm that searches for a value target in an m x n
 * integer matrix matrix. This matrix has the following properties:
 *
 * - Integers in each row are sorted in ascending order from left to right.
 * - Integers in each column are sorted in ascending order from top to bottom.
 *
 * If the value is found, return true. Otherwise, return false.
 *
 * @example
 * Input: matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22]], target = 5
 * Output: true
 * Explanation: 5 is found in the matrix
 *
 * @example
 * Input: matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22]], target = 20
 * Output: false
 * Explanation: 20 is not in the matrix
 *
 * @constraints
 * - m == matrix.length
 * - n == matrix[i].length
 * - 1 <= m, n <= 300
 * - -10^9 <= matrix[i][j] <= 10^9
 * - All the integers in each row are sorted in ascending order
 * - All the integers in each column are sorted in ascending order
 *
 * ## Approaches
 *
 * **Approach 1: Heap-based BFS (Demonstrates Data Structure Usage)**
 *
 * Use a min-heap to explore the matrix in sorted order.
 * Start from top-left corner, expand to neighbors.
 *
 * Algorithm:
 * 1. Create min-heap with (value, row, col)
 * 2. Add (matrix[0][0], 0, 0) to heap
 * 3. Use visited set to avoid revisiting cells
 * 4. While heap is not empty:
 *    - Pop smallest element
 *    - If value == target, return true
 *    - Add unvisited neighbors (right and down)
 * 5. If heap empties without finding target, return false
 *
 * Time: O((m + n) log(m + n)) - explores at most m + n cells
 * Space: O(m + n) - heap stores at most m + n cells
 *
 * **Approach 2: Divide & Conquer (Recursive Quadrant Division)**
 *
 * Divide the matrix into quadrants and recursively search.
 * Use sorted properties to eliminate impossible quadrants.
 *
 * Algorithm:
 * 1. For a submatrix [r1:r2, c1:c2]:
 *    - If empty or invalid, return false
 *    - If target < top-left or target > bottom-right, return false
 *    - Check middle row and column
 *    - Recursively search 4 quadrants based on comparisons
 * 2. Combine results: return true if any quadrant returns true
 *
 * Time: O(m + n) - each cell visited at most once via recursion
 * Space: O(m + n) - recursion stack depth
 *
 * **Approach 3: Binary Search on Rows (Two-pass Binary Search)**
 *
 * Use binary search twice: first iterate rows, then binary search within each row.
 *
 * Algorithm:
 * 1. For each row in the matrix:
 *    - Perform binary search on that row
 *    - If target found, return true
 * 2. If no row contains target, return false
 *
 * Time: O(m log n) - iterate m rows, binary search each row
 * Space: O(1) - no extra space needed
 *
 * **Approach 3b: Binary Search on Flattened Matrix (Optimal Binary Search)**
 *
 * Treat the 2D matrix as a 1D sorted array and use binary search.
 * Map 1D index to 2D coordinates using: row = i / n, col = i % n
 *
 * Algorithm:
 * 1. Binary search on range [0, m*n - 1]
 * 2. Map mid index to (row, col) coordinates
 * 3. Compare matrix[row][col] with target
 * 4. Adjust left/right pointers based on comparison
 *
 * Time: O(log(m * n)) - optimal logarithmic complexity
 * Space: O(1) - only pointers, no extra data structures
 *
 * @trade-off D&C approach is O(m+n) and most efficient for this problem.
 * Binary search (flattened) is O(log(m*n)) but less intuitive.
 * Heap approach demonstrates data structure usage but is slower.
 * Choose based on clarity vs efficiency needs.
 *
 * @date 31/01/2026
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
 * **Approach 1: Heap-based BFS (Demonstrates MinHeap Data Structure)**
 *
 * Time: O((m + n) log(m + n))
 * Space: O(m + n)
 *
 * Explores the matrix in sorted order using a min-heap.
 * Similar to Dijkstra's algorithm but without weights.
 *
 * Advantages:
 * - Demonstrates project's MinHeap structure
 * - Intuitive BFS-like exploration
 * - Early termination when target found
 *
 * Disadvantages:
 * - Heap overhead (log n per operation)
 * - Uses O(m + n) space for heap and visited set
 */
function searchMatrixHeap(matrix: number[][], target: number): boolean {
  if (!matrix || !matrix[0]) return false;

  const m = matrix.length;
  const n = matrix[0].length;

  // Min-heap comparator: smaller value comes first
  const minHeap = new MinHeap<MatrixCell>((a, b) => a.value - b.value);

  // Track visited cells to avoid duplicates
  const visited = new Set<string>();

  // Start from top-left corner (smallest element)
  minHeap.add({ value: matrix[0][0], row: 0, col: 0 });
  visited.add("0,0");

  // Explore using heap
  while (minHeap.size() > 0) {
    const cell = minHeap.poll();

    if (!cell) break;

    // Found target
    if (cell.value === target) {
      return true;
    }

    // Skip if already visited or out of bounds
    if (cell.value > target) {
      continue; // This branch won't have target (all future elements will be larger)
    }

    // Add right neighbor (same row, next column)
    if (cell.col + 1 < n && !visited.has(`${cell.row},${cell.col + 1}`)) {
      minHeap.add({
        value: matrix[cell.row][cell.col + 1],
        row: cell.row,
        col: cell.col + 1,
      });
      visited.add(`${cell.row},${cell.col + 1}`);
    }

    // Add down neighbor (next row, same column)
    if (cell.row + 1 < m && !visited.has(`${cell.row + 1},${cell.col}`)) {
      minHeap.add({
        value: matrix[cell.row + 1][cell.col],
        row: cell.row + 1,
        col: cell.col,
      });
      visited.add(`${cell.row + 1},${cell.col}`);
    }
  }

  return false;
}

/**
 * **Approach 2: Divide & Conquer (Recursive Diagonal Divide)**
 *
 * Time: O(m + n)
 * Space: O(m + n)
 *
 * Recursively divides the matrix along diagonals and eliminates regions.
 * By comparing with matrix elements at boundaries, we can eliminate
 * entire rows or columns based on the sorted properties.
 *
 * Key Insight:
 * - Start from top-right or bottom-left corner
 * - These corners allow us to eliminate one row or column per comparison
 * - This gives us O(m + n) complexity
 *
 * Advantages:
 * - Optimal time complexity O(m + n)
 * - No heap overhead or visited set
 * - Demonstrates divide-and-conquer pattern with matrix search
 *
 * Disadvantages:
 * - Still uses recursion stack, though minimal
 */
function searchMatrixDivideConquer(
  matrix: number[][],
  target: number,
): boolean {
  if (!matrix || !matrix[0]) return false;

  const m = matrix.length;
  const n = matrix[0].length;

  /**
   * Helper function: Search by eliminating rows/columns
   * Uses top-right corner approach: can eliminate either a row or column
   * with each comparison
   *
   * @param r - Current row (starts at 0)
   * @param c - Current column (starts at n-1, i.e., right side)
   */
  function searchFromTopRight(r: number, c: number): boolean {
    // Base cases
    if (r >= m || c < 0) {
      return false; // Out of bounds
    }

    const current = matrix[r][c];

    if (current === target) {
      return true; // Found!
    } else if (current < target) {
      // Current value is too small
      // All elements in this column to the left are also < current (column is sorted)
      // All elements in this row to the left are also < current (row is sorted)
      // So move down to the next row (which has larger values)
      return searchFromTopRight(r + 1, c);
    } else {
      // current > target
      // All elements in this row to the right are > current (row is sorted)
      // All elements in this column below are > current (column is sorted)
      // So move left to previous column (which has smaller values)
      return searchFromTopRight(r, c - 1);
    }
  }

  return searchFromTopRight(0, n - 1);
}

// Example usage
if (require.main === module) {
  console.log("=== Search a 2D Matrix II - LeetCode 240 ===\n");

  console.log("=== Example 1: Target Found ===");
  const matrix1 = [
    [1, 4, 7, 11, 15],
    [2, 5, 8, 12, 19],
    [3, 6, 9, 16, 22],
  ];
  const target1 = 5;
  console.log("Matrix:");
  matrix1.forEach((row) => console.log(`  [${row.join(", ")}]`));
  console.log(`Target: ${target1}`);
  console.log("Visual:");
  console.log("  [1,  4,  7, 11, 15]");
  console.log("  [2,  5✓, 8, 12, 19]");
  console.log("  [3,  6,  9, 16, 22]");
  console.log("Heap Approach:", searchMatrixHeap(matrix1, target1)); // true
  console.log("Divide & Conquer:", searchMatrixDivideConquer(matrix1, target1)); // true
  console.log("Expected: true ✅\n");

  console.log("=== Example 2: Target Not Found ===");
  const matrix2 = [
    [1, 4, 7, 11, 15],
    [2, 5, 8, 12, 19],
    [3, 6, 9, 16, 22],
  ];
  const target2 = 20;
  console.log("Matrix:");
  matrix2.forEach((row) => console.log(`  [${row.join(", ")}]`));
  console.log(`Target: ${target2} (between 19 and 22, not in matrix)`);
  console.log("Heap Approach:", searchMatrixHeap(matrix2, target2)); // false
  console.log("Divide & Conquer:", searchMatrixDivideConquer(matrix2, target2)); // false
  console.log("Expected: false ❌\n");

  console.log("=== Example 3: Target at Boundaries ===");
  const matrix3 = [
    [1, 4, 7, 11, 15],
    [2, 5, 8, 12, 19],
    [3, 6, 9, 16, 22],
  ];
  console.log("Matrix:");
  matrix3.forEach((row) => console.log(`  [${row.join(", ")}]`));

  console.log("\nTop-left (1):");
  console.log("  Heap:", searchMatrixHeap(matrix3, 1)); // true
  console.log("  D&C:", searchMatrixDivideConquer(matrix3, 1)); // true

  console.log("\nBottom-right (22):");
  console.log("  Heap:", searchMatrixHeap(matrix3, 22)); // true
  console.log("  D&C:", searchMatrixDivideConquer(matrix3, 22)); // true

  console.log("\nTop-right (15):");
  console.log("  Heap:", searchMatrixHeap(matrix3, 15)); // true
  console.log("  D&C:", searchMatrixDivideConquer(matrix3, 15)); // true

  console.log("\nBottom-left (3):");
  console.log("  Heap:", searchMatrixHeap(matrix3, 3)); // true
  console.log("  D&C:", searchMatrixDivideConquer(matrix3, 3)); // true
  console.log("Expected: all true ✅\n");

  console.log("=== Example 4: Single Row ===");
  const matrix4 = [[1, 4, 7, 11, 15]];
  const target4 = 7;
  console.log("Matrix: [[1, 4, 7, 11, 15]]");
  console.log(`Target: ${target4}`);
  console.log("Heap Approach:", searchMatrixHeap(matrix4, target4)); // true
  console.log("Divide & Conquer:", searchMatrixDivideConquer(matrix4, target4)); // true
  console.log("Expected: true ✅\n");

  console.log("=== Example 5: Single Column ===");
  const matrix5 = [[1], [2], [3]];
  const target5 = 2;
  console.log("Matrix:");
  matrix5.forEach((row) => console.log(`  [${row[0]}]`));
  console.log(`Target: ${target5}`);
  console.log("Heap Approach:", searchMatrixHeap(matrix5, target5)); // true
  console.log("Divide & Conquer:", searchMatrixDivideConquer(matrix5, target5)); // true
  console.log("Expected: true ✅\n");

  console.log("=== Example 6: Negative Numbers ===");
  const matrix6 = [
    [-10, -5, 0, 5],
    [-8, -2, 2, 8],
    [-6, 0, 4, 10],
  ];
  const target6 = 4;
  console.log("Matrix:");
  matrix6.forEach((row) => console.log(`  [${row.join(", ")}]`));
  console.log(`Target: ${target6}`);
  console.log("Heap Approach:", searchMatrixHeap(matrix6, target6)); // true
  console.log("Divide & Conquer:", searchMatrixDivideConquer(matrix6, target6)); // true
  console.log("Expected: true ✅\n");

  console.log("=== Performance Comparison ===\n");

  // Create a larger matrix
  const largeMatrix: number[][] = [];
  for (let i = 0; i < 50; i++) {
    const row: number[] = [];
    for (let j = 0; j < 50; j++) {
      row.push(i * 50 + j + 1);
    }
    largeMatrix.push(row);
  }

  const targetLarge = 1500;

  console.log(`Large Matrix: 50x50, Target: ${targetLarge}`);

  const t1 = performance.now();
  const r1 = searchMatrixHeap(largeMatrix, targetLarge);
  const t2 = performance.now();
  console.log(`Heap Approach: ${r1} (${(t2 - t1).toFixed(3)}ms)`);

  const t3 = performance.now();
  const r2 = searchMatrixDivideConquer(largeMatrix, targetLarge);
  const t4 = performance.now();
  console.log(`Divide & Conquer: ${r2} (${(t4 - t3).toFixed(3)}ms)`);

  console.log("\nNot found test:");
  const targetNotFound = 3000;
  const t5 = performance.now();
  const r3 = searchMatrixHeap(largeMatrix, targetNotFound);
  const t6 = performance.now();
  console.log(`Heap Approach: ${r3} (${(t6 - t5).toFixed(3)}ms)`);

  const t7 = performance.now();
  const r4 = searchMatrixDivideConquer(largeMatrix, targetNotFound);
  const t8 = performance.now();
  console.log(`Divide & Conquer: ${r4} (${(t8 - t7).toFixed(3)}ms)`);
}

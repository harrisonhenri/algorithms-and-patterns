/**
 * Shortest Path in Binary Matrix (LeetCode 1091)
 *
 * Given an n x n binary matrix grid, return the length of the shortest clear path
 * in the matrix. A clear path only traverses cells with value 0.
 *
 * **Movement:** 8-directional (horizontal, vertical, and diagonal)
 * **Path:** From top-left (0, 0) to bottom-right (n-1, n-1)
 * **Constraint:** Only traverse cells with value 0; blocked by cells with value 1
 *
 * **Problem:** Find shortest clear path length. Return -1 if no path exists.
 *
 * **Example 1:**
 * ```
 * Input: grid = [[0,1],[1,0]]
 * Output: 2
 * Path: (0,0) → (1,1)
 * ```
 *
 * **Example 2:**
 * ```
 * Input: grid = [[0,0,0],[1,1,0],[1,1,0]]
 * Output: 4
 * Path: (0,0) → (0,1) → (0,2) → (1,2) → (2,2) or similar
 * ```
 *
 * **Approach: BFS (Shortest Path in Unweighted Grid)**
 * 1. Use queue to explore cells level by level
 * 2. Process each cell's 8 neighbors (up, down, left, right, 4 diagonals)
 * 3. Track distance from (0, 0) to each cell
 * 4. Return distance when reaching (n-1, n-1), or -1 if unreachable
 *
 * **Time Complexity:** O(N) where N is the total number of cells - Each cell enqueued at most once
 * **Space Complexity:** O(N) - Queue can hold at most N cells in worst case
 *
 * **Note:** It must track visited cells to avoid cycles and reprocessing.
 *
 * @date 21/01/2026
 */

/**
 * **Approach: BFS with 8-Directional Movement (Space-Optimized)**
 *
 * Explores the grid level by level, storing distance directly in the grid.
 * Processes all 8 neighbors (horizontal, vertical, diagonal) for each cell.
 *
 * **Algorithm:**
 * 1. Check boundaries and starting cell validity
 * 2. Mark starting cell with distance 1
 * 3. Initialize queue with (0, 0)
 * 4. While queue not empty:
 *    - Dequeue cell (row, col)
 *    - Get current distance from grid
 *    - If reached destination, return distance
 *    - For each of 8 neighbors:
 *      - If valid, unvisited (= 0), mark with distance + 1 and enqueue
 * 5. If queue empties, return -1 (no path)
 *
 * **Time Complexity:** O(N) where N is the total number of cells - Each cell enqueued at most once
 * **Space Complexity:** O(N) - Queue space in worst case
 *
 * **Key insight:** Store distance directly in the grid to eliminate need for tuple
 * in queue. Mark visited cells with distance value > 0.
 */

// Import Queue structure
import { Queue } from "../../../structures/queue";

function shortestPathBinaryMatrix(data: number[][]): number {
  const n = data.length;
  const m = data[0].length;
  const grid = data.map((row) => [...row]);

  // Edge case: starting cell is blocked
  if (grid[0][0] !== 0 || grid[n - 1][m - 1] !== 0) {
    return -1;
  }

  // Edge case: single cell
  if (n === 1 && m === 1) {
    return 1;
  }

  // 8 directions: up, down, left, right, 4 diagonals
  const directions = [
    [-1, -1], // top-left
    [-1, 0], // top
    [-1, 1], // top-right
    [0, -1], // left
    [0, 1], // right
    [1, -1], // bottom-left
    [1, 0], // bottom
    [1, 1], // bottom-right
  ];

  const queue = new Queue<[number, number]>();
  grid[0][0] = 1; // Mark starting cell with distance 1
  queue.enqueue([0, 0]);

  while (!queue.isEmpty()) {
    const [row, col] = queue.dequeue()!;
    const distance = grid[row][col];

    // Check if reached destination
    if (row === n - 1 && col === m - 1) {
      return distance;
    }

    // Explore all 8 neighbors
    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;

      // Check boundaries and if cell is clear and unvisited
      if (
        newRow >= 0 &&
        newRow < n &&
        newCol >= 0 &&
        newCol < m &&
        grid[newRow][newCol] === 0
      ) {
        grid[newRow][newCol] = distance + 1; // Mark visited with distance
        queue.enqueue([newRow, newCol]);
      }
    }
  }

  return -1; // No path found
}

// Example usage
if (require.main === module) {
  console.log("=== Shortest Path in Binary Matrix (BFS) ===\n");

  // Test Case 1: Simple 2x2 grid
  console.log("Test Case 1: Simple 2x2 grid");
  const grid1 = [
    [0, 1],
    [1, 0],
  ];
  const result1 = shortestPathBinaryMatrix(grid1);
  console.log("Grid:");
  grid1.forEach((row) => console.log(row.join(" ")));
  console.log(`Output: ${result1}`);
  console.log("Expected: 2\n");

  // Test Case 2: 3x3 with clear path
  console.log("Test Case 2: 3x3 with clear path");
  const grid2 = [
    [0, 0, 0],
    [1, 1, 0],
    [1, 1, 0],
  ];
  const result2 = shortestPathBinaryMatrix(grid2);
  console.log("Grid:");
  grid2.forEach((row) => console.log(row.join(" ")));
  console.log(`Output: ${result2}`);
  console.log("Expected: 4\n");

  // Test Case 3: Blocked starting cell
  console.log("Test Case 3: Blocked starting cell");
  const grid3 = [
    [1, 0],
    [0, 0],
  ];
  const result3 = shortestPathBinaryMatrix(grid3);
  console.log("Grid:");
  grid3.forEach((row) => console.log(row.join(" ")));
  console.log(`Output: ${result3}`);
  console.log("Expected: -1\n");

  // Test Case 4: Single cell
  console.log("Test Case 4: Single cell");
  const grid4 = [[0]];
  const result4 = shortestPathBinaryMatrix(grid4);
  console.log("Grid:");
  grid4.forEach((row) => console.log(row.join(" ")));
  console.log(`Output: ${result4}`);
  console.log("Expected: 1\n");

  // Test Case 5: Diagonal path
  console.log("Test Case 5: Diagonal path available");
  const grid5 = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const result5 = shortestPathBinaryMatrix(grid5);
  console.log("Grid:");
  grid5.forEach((row) => console.log(row.join(" ")));
  console.log(`Output: ${result5}`);
  console.log("Expected: 3 (via diagonals)\n");

  // Test Case 6: No path
  console.log("Test Case 6: No path (blocked)");
  const grid6 = [
    [0, 1, 0],
    [1, 1, 0],
    [0, 0, 0],
  ];
  const result6 = shortestPathBinaryMatrix(grid6);
  console.log("Grid:");
  grid6.forEach((row) => console.log(row.join(" ")));
  console.log(`Output: ${result6}`);
  console.log("Expected: -1\n");
}

export default shortestPathBinaryMatrix;

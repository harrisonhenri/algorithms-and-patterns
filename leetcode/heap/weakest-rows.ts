import { MaxHeap } from "../../structures/heap/max-heap";

/**
 * K Weakest Rows in a Matrix - LeetCode Problem 1337
 *
 * Problem Statement:
 * You are given an m x n binary matrix mat of 1's (representing soldiers) and
 * 0's (representing civilians). The soldiers are positioned in front of the
 * civilians. That is, all the 1's will appear to the left of all the 0's in
 * each row.
 *
 * A row i is weaker than a row j if one of the following is true:
 * 1. The number of soldiers in row i is less than the number of soldiers in row j.
 * 2. Both rows have the same number of soldiers and i < j.
 *
 * Return the indices of the k weakest rows in the matrix ordered from weakest
 * to strongest.
 *
 * @example
 * Input: mat = [
 *   [1,1,0,0,0],
 *   [1,1,1,1,0],
 *   [1,0,0,0,0],
 *   [1,1,0,0,0],
 *   [1,1,1,1,1]
 * ], k = 3
 * Output: [2,0,3]
 *
 * Explanation:
 * The number of soldiers in each row is: [2, 4, 1, 2, 5]
 * Weakness ranking:
 * - Row 2: 1 soldier (weakest)
 * - Row 0: 2 soldiers
 * - Row 3: 2 soldiers (but index > 0, so weaker)
 * - Row 1: 4 soldiers
 * - Row 4: 5 soldiers (strongest)
 * Return top 3 weakest: [2, 0, 3]
 *
 * @constraints
 * - m == mat.length
 * - n == mat[i].length
 * - 2 <= m <= 100
 * - 1 <= n <= 100
 * - mat[i][j] is either 0 or 1
 * - 1 <= k <= m
 * - Each row is sorted: all 1's come before all 0's
 *
 * ## Approaches
 *
 * **Approach 1: Max-Heap (Optimal for Small k)**
 *
 * Maintain a max-heap of size k based on (soldier_count, row_index) pairs.
 * The strongest row in the heap is at the root, making it easy to evict.
 *
 * Algorithm:
 * 1. For each row:
 *    - Count soldiers using binary search (exploiting sorted property)
 *    - Create (strength, rowIndex) tuple
 * 2. Maintain max-heap of size k:
 *    - If heap.size < k: add row
 *    - Else if row is weaker than root: remove root, add row
 * 3. Extract k rows from heap (need to reverse order)
 *
 * @time O(m log k) - m rows, each log k for heap operation
 * @space O(k) for heap storage
 * **Trade-off:** Optimal when k << m. Better than sorting all m rows.
 *
 * **Approach 2: Sort All Rows (with Binary Search)**
 *
 * Count soldiers for each row using binary search, then sort by (soldier_count, row_index).
 * Extract first k rows.
 *
 * @time O(m log m + m log n) - m rows, sorting takes O(m log m), binary search for count O(log n) per row
 * @space O(m) for storing (count, index) pairs
 * **Trade-off:** Simple and works well for any k. No constant factor advantage over approach 1 when k is small.
 *
 * **Approach 3: Counting + Direct Access**
 *
 * Count soldiers in each row, group by count, return first k from weakest.
 * Useful when soldier counts have limited range [0, n].
 *
 * @time O(m + m log n) - counting O(m log n) with binary search per row, grouping O(m)
 * @space O(n) - at most n different counts
 * **Trade-off:** Best when n is small and well-distributed across rows.
 *
 * **Approach 4: Simple Sort with Linear Count (Straightforward)**
 *
 * Count soldiers for each row by linear scan (simpler than binary search).
 * Create (soldier_count, row_index) pairs and sort them.
 * Extract first k rows.
 *
 * Algorithm:
 * 1. For each row, count soldiers: iterate until hitting a 0
 * 2. Create pairs of (strength, index)
 * 3. Sort pairs by strength first, then by index
 * 4. Return indices of first k pairs
 *
 * @time O(m * n + m log m) - linear count O(m * n), sorting O(m log m)
 * @space O(m) for pairs array
 * **Trade-off:** Simplest implementation. When n is small, linear scan is competitive with binary search due to lower constant factors.
 *
 * **Approach 5: Vertical Iteration (Space-Optimal)**
 *
 * Scan column-by-column (left to right) to find the first 0 in each row.
 * The order rows are found is already sorted (weakest to strongest).
 * Handle all-1's rows as a special case at the end.
 *
 * Algorithm:
 * 1. For each column from 0 to n-1:
 *    - For each row from 0 to m-1:
 *      - If current cell is 0 AND left cell is 1:
 *        - This row's strength = column index
 *        - Add row index to result
 *        - If result.length === k: return result
 * 2. If result.length < k:
 *    - Add remaining rows with all 1's (strength = n)
 *
 * Key insight: Rows are discovered in sorted order! First 0 found = smallest strength first.
 *
 * @time O(m * n) - visit at most m*n cells, but output is found early
 * @space O(1) - only result array (considered working memory for output)
 * **Trade-off:** True space optimization! Practical speedup when k << m.
 *
 * @date 26/01/2026
 */

/**
 * Represents a row's strength (count of soldiers) and its original index
 */
interface RowStrength {
  index: number;
  soldiers: number;
}

/**
 * **Approach 1: Max-Heap (Optimal for Small k)**
 *
 * Time: O(m log k), Space: O(k)
 *
 * Maintains a max-heap of k weakest rows.
 * Root contains the strongest of the k weakest.
 *
 * @param mat - Binary matrix where 1's are soldiers, 0's are civilians
 * @param k - Number of weakest rows to return
 * @returns Indices of k weakest rows in order from weakest to strongest
 */
function getWeakestRowsMaxHeap(mat: number[][], k: number): number[] {
  const m = mat.length;

  // Max-heap comparator: stronger rows (more soldiers) bubble up
  // Tiebreaker: larger index goes up (row with same soldiers but larger index is stronger)
  const maxHeap = new MaxHeap<RowStrength>((a, b) => {
    // First compare by soldier count (more soldiers = stronger)
    if (a.soldiers !== b.soldiers) {
      return a.soldiers - b.soldiers; // More soldiers means goes DOWN (not up)
    }
    // Tiebreaker: same soldiers, larger index is stronger
    return a.index - b.index; // Larger index goes DOWN (not up)
  });

  // Process each row
  for (let i = 0; i < m; i++) {
    // Count soldiers using binary search (exploiting sorted property)
    const soldiers = countSoldiers(mat[i]);
    const rowData: RowStrength = { index: i, soldiers };

    if (maxHeap.size() < k) {
      // Heap not full, always add
      maxHeap.add(rowData);
    } else {
      // Heap full, check if this row is weaker than the strongest in heap
      const strongest = maxHeap.peek()!;
      if (isWeaker(rowData, strongest)) {
        // This row is weaker, so remove strongest and add this
        maxHeap.poll();
        maxHeap.add(rowData);
      }
    }
  }

  // Extract rows from heap (will be in reverse order)
  const result: RowStrength[] = [];
  while (maxHeap.size() > 0) {
    result.push(maxHeap.poll()!);
  }

  // Reverse to get weakest to strongest order
  return result.reverse().map((r) => r.index);
}

/**
 * **Approach 2: Sort All Rows**
 *
 * Time: O(m log m + m log n), Space: O(m)
 *
 * Count soldiers for each row, then sort by weakness criteria.
 *
 * @param mat - Binary matrix
 * @param k - Number of weakest rows to return
 * @returns Indices of k weakest rows
 */
function getWeakestRowsSort(mat: number[][], k: number): number[] {
  const rows: RowStrength[] = mat.map((row, index) => ({
    index,
    soldiers: countSoldiers(row),
  }));

  // Sort by weakness: fewer soldiers first, then by index for tiebreak
  rows.sort((a, b) => {
    if (a.soldiers !== b.soldiers) {
      return a.soldiers - b.soldiers; // Fewer soldiers = weaker
    }
    return a.index - b.index; // Earlier index = weaker
  });

  // Return indices of k weakest rows
  return rows.slice(0, k).map((r) => r.index);
}

/**
 * **Approach 3: Counting + Direct Access**
 *
 * Time: O(m log n), Space: O(n)
 *
 * Count soldiers in each row, group by count, return from weakest.
 *
 * @param mat - Binary matrix
 * @param k - Number of weakest rows to return
 * @returns Indices of k weakest rows
 */
function getWeakestRowsCounting(mat: number[][], k: number): number[] {
  const n = mat[0].length;
  const m = mat.length;

  // Group rows by soldier count
  // buckets[i] = array of row indices with i soldiers
  const buckets: number[][] = Array.from({ length: n + 1 }, () => []);

  for (let i = 0; i < m; i++) {
    const soldiers = countSoldiers(mat[i]);
    buckets[soldiers].push(i);
  }

  // Collect k weakest rows in order
  const result: number[] = [];
  for (let soldiers = 0; soldiers <= n && result.length < k; soldiers++) {
    // Within same soldier count, rows are already in index order
    for (const index of buckets[soldiers]) {
      result.push(index);
      if (result.length === k) break;
    }
  }

  return result;
}

/**
 * **Approach 4: Simple Sort with Linear Count**
 *
 * Time: O(m * n + m log m), Space: O(m)
 *
 * Straightforward approach: count soldiers with linear scan, sort pairs, extract k.
 *
 * @param mat - Binary matrix
 * @param k - Number of weakest rows to return
 * @returns Indices of k weakest rows in order from weakest to strongest
 */
function getWeakestRowsLinearSort(mat: number[][], k: number): number[] {
  const m = mat.length;
  const n = mat[0].length;

  // Create pairs of (strength, index) for all rows
  const pairs: RowStrength[] = [];

  for (let i = 0; i < m; i++) {
    // Count soldiers with linear scan: iterate until hitting a 0
    let strength = 0;
    for (let j = 0; j < n; j++) {
      if (mat[i][j] === 0) break;
      strength++;
    }
    pairs.push({ index: i, soldiers: strength });
  }

  // Sort by strength first, then by index as tiebreaker
  pairs.sort((a, b) => {
    if (a.soldiers !== b.soldiers) {
      return a.soldiers - b.soldiers; // Fewer soldiers = weaker
    }
    return a.index - b.index; // Earlier index = weaker
  });

  // Return indices of k weakest rows
  return pairs.slice(0, k).map((p) => p.index);
}

/**
 * **Approach 5: Vertical Iteration (Space-Optimal)**
 *
 * Time: O(m * n), Space: O(1)
 *
 * Scan column-by-column to find first 0 in each row.
 * Rows are discovered in sorted order (weakest to strongest).
 *
 * @param mat - Binary matrix where 1's are soldiers, 0's are civilians
 * @param k - Number of weakest rows to return
 * @returns Indices of k weakest rows in order from weakest to strongest
 */
function getWeakestRowsVertical(mat: number[][], k: number): number[] {
  const m = mat.length;
  const n = mat[0].length;
  const result: number[] = [];
  const visited = new Set<number>();

  // Scan column by column (left to right)
  for (let j = 0; j < n && result.length < k; j++) {
    for (let i = 0; i < m && result.length < k; i++) {
      // Found first 0 in this row (and not already added)
      if (mat[i][j] === 0 && !visited.has(i)) {
        result.push(i);
        visited.add(i);
      }
    }
  }

  // Handle rows with all 1's (strength = n)
  // Add remaining rows in order until we have k rows
  for (let i = 0; i < m && result.length < k; i++) {
    if (!visited.has(i)) {
      result.push(i);
    }
  }

  return result;
}

/**
 * Helper: Count soldiers in a row using binary search
 * Exploits the property that all 1's come before all 0's
 *
 * Time: O(log n) - binary search
 */
function countSoldiers(row: number[]): number {
  let left = 0;
  let right = row.length - 1;
  let count = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (row[mid] === 1) {
      count = mid + 1; // All positions [0, mid] are soldiers
      left = mid + 1; // Look for more 1's to the right
    } else {
      right = mid - 1; // Look for 1's to the left
    }
  }

  return count;
}

/**
 * Helper: Determine if rowA is weaker than rowB
 */
function isWeaker(a: RowStrength, b: RowStrength): boolean {
  if (a.soldiers !== b.soldiers) {
    return a.soldiers < b.soldiers;
  }
  return a.index < b.index;
}

// Example usage
if (require.main === module) {
  console.log("=== K Weakest Rows in a Matrix ===\n");

  // Example 1: Basic case
  console.log("Example 1: Basic Case");
  const mat1 = [
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ];
  const k1 = 3;
  console.log("Matrix:");
  mat1.forEach((row, i) =>
    console.log(
      `  Row ${i}: ${row.join("")} (${row.reduce((a, b) => a + b)} soldiers)`,
    ),
  );
  console.log(`k = ${k1}`);
  console.log(
    "Max-Heap:",
    getWeakestRowsMaxHeap(mat1, k1),
    "| Binary-Sort:",
    getWeakestRowsSort(mat1, k1),
    "| Counting:",
    getWeakestRowsCounting(mat1, k1),
    "| Linear-Sort:",
    getWeakestRowsLinearSort(mat1, k1),
    "| Vertical:",
    getWeakestRowsVertical(mat1, k1),
  );
  console.log();

  // Example 2: All same soldier count
  console.log("Example 2: All Rows Have Same Soldier Count");
  const mat2 = [
    [1, 0],
    [1, 0],
    [1, 0],
    [1, 0],
  ];
  const k2 = 2;
  console.log("Matrix: All rows have 1 soldier");
  console.log(`k = ${k2}`);
  console.log(
    "Max-Heap:",
    getWeakestRowsMaxHeap(mat2, k2),
    "| Binary-Sort:",
    getWeakestRowsSort(mat2, k2),
    "| Counting:",
    getWeakestRowsCounting(mat2, k2),
    "| Linear-Sort:",
    getWeakestRowsLinearSort(mat2, k2),
    "| Vertical:",
    getWeakestRowsVertical(mat2, k2),
  );
  console.log("(Should return [0, 1] - first k rows by index)");
  console.log();

  // Example 3: Already sorted
  console.log("Example 3: Rows Already Sorted by Strength");
  const mat3 = [
    [1, 0, 0],
    [1, 1, 0],
    [1, 1, 1],
  ];
  const k3 = 2;
  console.log("Matrix:");
  mat3.forEach((row, i) =>
    console.log(
      `  Row ${i}: ${row.join("")} (${row.reduce((a, b) => a + b)} soldiers)`,
    ),
  );
  console.log(`k = ${k3}`);
  console.log(
    "Max-Heap:",
    getWeakestRowsMaxHeap(mat3, k3),
    "| Binary-Sort:",
    getWeakestRowsSort(mat3, k3),
    "| Counting:",
    getWeakestRowsCounting(mat3, k3),
    "| Linear-Sort:",
    getWeakestRowsLinearSort(mat3, k3),
    "| Vertical:",
    getWeakestRowsVertical(mat3, k3),
  );
  console.log();

  // Example 4: k = m (all rows)
  console.log("Example 4: Return All Rows (k = m)");
  const mat4 = [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 0],
  ];
  const k4 = 3;
  console.log("Matrix:");
  mat4.forEach((row, i) =>
    console.log(
      `  Row ${i}: ${row.join("")} (${row.reduce((a, b) => a + b)} soldiers)`,
    ),
  );
  console.log(`k = ${k4}`);
  console.log(
    "Max-Heap:",
    getWeakestRowsMaxHeap(mat4, k4),
    "| Binary-Sort:",
    getWeakestRowsSort(mat4, k4),
    "| Counting:",
    getWeakestRowsCounting(mat4, k4),
    "| Linear-Sort:",
    getWeakestRowsLinearSort(mat4, k4),
    "| Vertical:",
    getWeakestRowsVertical(mat4, k4),
  );
  console.log();

  // Example 5: Large matrix
  console.log("Example 5: Larger Matrix with Mixed Values");
  const mat5 = [
    [1, 1, 1, 1, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0],
    [1, 0, 0, 0, 0, 0, 0],
  ];
  const k5 = 4;
  console.log("Matrix soldiers count: [4, 1, 2, 3, 5, 1]");
  console.log(`k = ${k5}`);
  console.log(
    "Max-Heap:",
    getWeakestRowsMaxHeap(mat5, k5),
    "| Sort:",
    getWeakestRowsSort(mat5, k5),
    "| Counting:",
    getWeakestRowsCounting(mat5, k5),
    "| Linear-Sort:",
    getWeakestRowsLinearSort(mat5, k5),
    "| Vertical:",
    getWeakestRowsVertical(mat5, k5),
  );
  console.log();

  // Performance comparison
  console.log("=== Performance Analysis ===");
  console.log("Approach 1 - Max-Heap:");
  console.log("  - Time: O(m log k) - only k elements in heap");
  console.log("  - Space: O(k)");
  console.log("  - Best for: small k relative to m");
  console.log();
  console.log("Approach 2 - Sort All:");
  console.log("  - Time: O(m log m + m log n) - sort dominates");
  console.log("  - Space: O(m)");
  console.log("  - Best for: simple implementation, no special structure");
  console.log();
  console.log("Approach 3 - Counting:");
  console.log("  - Time: O(m log n + n) - counting with binary search");
  console.log("  - Space: O(n) - bucket array");
  console.log(
    "  - Best for: when n is small, distributed across soldier counts",
  );
  console.log();
  console.log("Approach 4 - Linear Sort:");
  console.log("  - Time: O(m*n + m log m) - linear scan then sort");
  console.log("  - Space: O(m) - pair array");
  console.log(
    "  - Best for: when n is small (≤100), linear scan has better constants than binary search",
  );
  console.log();
  console.log("Approach 5 - Vertical Iteration:");
  console.log(
    "  - Time: O(m*n) - column-by-column scan, early exit when k found",
  );
  console.log("  - Space: O(1) - result array only (true space optimal!)");
  console.log(
    "  - Best for: small k, when many rows already have known soldier counts in sorted order",
  );
  console.log(
    "  - Insight: Rows discovered in already-sorted order, no need to sort!",
  );
}

/**
 * Pascal's Triangle (LeetCode 119)
 *
 * **Problem Statement:**
 * Given an integer rowIndex, return the rowIndexth (0-indexed) row of the Pascal's triangle.
 *
 * In Pascal's triangle, each number is the sum of the two numbers directly above it.
 * Each row starts and ends with 1.
 *
 * Pascal's Triangle structure:
 * ```
 *        1           Row 0
 *       1 1          Row 1
 *      1 2 1         Row 2
 *     1 3 3 1        Row 3
 *    1 4 6 4 1       Row 4
 *   1 5 10 10 5 1    Row 5
 * ```
 *
 * **Example 1:**
 * ```
 * Input: rowIndex = 3
 * Output: [1,3,3,1]
 * ```
 *
 * **Example 2:**
 * ```
 * Input: rowIndex = 0
 * Output: [1]
 * ```
 *
 * **Example 3:**
 * ```
 * Input: rowIndex = 1
 * Output: [1,1]
 * ```
 *
 * **Constraints:**
 * - 0 <= rowIndex <= 33
 *
 * **Approaches:**
 * 1. **Recursive with Memoization** - Top-down DP
 * 2. **Tabulation (Bottom-Up DP)** - Build entire triangle up to rowIndex
 * 3. **Space-Optimized Tabulation** - Use only two arrays (current and previous row)
 * 4. **Mathematical Approach (Combinations)** - Direct calculation using C(n,k)
 * 5. **Iterative Pascal's Rule** - Build each element using previous element formula
 *
 * **Key Insight:**
 * Each element at row[n][k] = C(n,k) (binomial coefficient).
 * Row n has n+1 elements: [C(n,0), C(n,1), ..., C(n,n)].
 * See /algorithms/recursion/index.ts for:
 * - Comprehensive DP fundamentals
 * - Binomial coefficient theory and efficiency using ratios
 * - Master Theorem application
 * - Recursion complexity analysis with Stirling's approximation
 *
 * **Complexity Analysis Summary:**
 * - Recursive with Memoization: O(n²) time, O(n²) space
 * - Tabulation: O(n²) time, O(n²) space
 * - Space-Optimized: O(n²) time, O(n) space
 * - Mathematical (BEST): O(n) time, O(n) space (output size)
 *
 * @date 24/01/2026 - 00:00:00
 */

/**
 * **Approach 1: Recursive with Memoization**
 *
 * Recursively compute each element using the recurrence:
 * triangle[n][k] = triangle[n-1][k-1] + triangle[n-1][k]
 *
 * Use memoization to cache computed values and avoid redundant calculations.
 *
 * **Algorithm:**
 * 1. Base cases:
 *    - If k = 0 or k = n, return 1
 * 2. Recursive case:
 *    - Check memo for (n, k)
 *    - If exists, return cached value
 *    - Otherwise, compute: helper(n-1, k-1) + helper(n-1, k)
 *    - Cache and return result
 * 3. Build the entire row from index 0 to rowIndex
 *
 * **Recurrence Relation (Without Memoization):**
 * T(n,k) = T(n-1,k) + T(n-1,k-1) + O(1)
 * - Base cases: T(n,0) = T(n,n) = O(1)
 * - Maximum calls: O(2ⁿ)
 * - Worst case k = n/2: O(2ⁿ / √n) by Stirling's approximation
 *
 * **With Memoization:**
 * - Reduces redundant computation of same (n,k) pairs
 * - Only O(n²) unique subproblems exist
 * - Number of base case returns ≈ C(n, n/2) = binomial coefficient value
 *
 * **Time Complexity:** O(n²) - Must compute all (n,k) pairs once (with memoization)
 * **Space Complexity:** O(n²) - Memoization table + O(n) recursion stack
 *
 * See /algorithms/recursion/index.ts for detailed recursion tree analysis
 * and Stirling's approximation explanation.
 *
 * **Further Reading:**
 * Time Complexity Analysis: https://stackoverflow.com/questions/26228385/time-complexity-of-recursive-algorithm-for-calculating-binomial-coefficient/26229383
 */
function getPascalRowMemoization(rowIndex: number): number[] {
  const memo = new Map<string, number>();

  function helper(n: number, k: number): number {
    if (k === 0 || k === n) return 1;

    const key = `${n},${k}`;
    if (memo.has(key)) {
      return memo.get(key)!;
    }

    const result = helper(n - 1, k - 1) + helper(n - 1, k);
    memo.set(key, result);
    return result;
  }

  const row: number[] = [];
  for (let k = 0; k <= rowIndex; k++) {
    row.push(helper(rowIndex, k));
  }
  return row;
}

/**
 * **Approach 2: Bottom-Up Tabulation**
 *
 * Iteratively build the entire Pascal's triangle from row 0 to rowIndex.
 * Each row is computed from the previous row using the recurrence relation.
 *
 * **Algorithm:**
 * 1. Create 2D array dp with rowIndex+1 rows
 * 2. For each row n from 0 to rowIndex:
 *    a. Initialize row with rowIndex+1 elements
 *    b. Set dp[n][0] = 1 and dp[n][n] = 1 (edges)
 *    c. For each element k from 1 to n-1:
 *       - dp[n][k] = dp[n-1][k-1] + dp[n-1][k]
 * 3. Return dp[rowIndex]
 *
 * **Advantage:**
 * - Natural iterative approach, easy to understand
 * - No recursion overhead
 * - Straightforward implementation
 *
 * **Disadvantage:**
 * - O(n²) space to store entire triangle (wasteful since we only need one row)
 *
 * **Time Complexity:** O(n²) - Must compute all elements
 * **Space Complexity:** O(n²) - Store entire triangle
 */
function getPascalRowTabulation(rowIndex: number): number[] {
  const dp: number[][] = Array.from({ length: rowIndex + 1 }, () => []);

  for (let n = 0; n <= rowIndex; n++) {
    dp[n] = new Array(n + 1);
    dp[n][0] = 1;
    dp[n][n] = 1;

    for (let k = 1; k < n; k++) {
      dp[n][k] = dp[n - 1][k - 1] + dp[n - 1][k];
    }
  }

  return dp[rowIndex];
}

/**
 * **Approach 3: Space-Optimized Tabulation** - BEST FOR SPACE
 *
 * Only store the previous row and current row being computed.
 * This reduces space from O(n²) to O(n) while maintaining O(n²) time.
 *
 * **Algorithm:**
 * 1. Initialize prev = [1]
 * 2. For each row n from 1 to rowIndex:
 *    a. Initialize curr = [1, ..., 1] with n+1 elements
 *    b. For each k from 1 to n-1:
 *       - curr[k] = prev[k-1] + prev[k]
 *    c. Set prev = curr
 * 3. Return prev (which now contains rowIndex)
 *
 * **Intuition:**
 * - Each row only depends on the previous row
 * - No need to store all previous rows, only the most recent one
 * - After computing each row, it becomes the "previous" for the next iteration
 *
 * **Time Complexity:** O(n²) - Iterate through all elements
 * **Space Complexity:** O(n) - Only store current and previous row
 */
function getPascalRowSpaceOptimized(rowIndex: number): number[] {
  let prev = [1];

  for (let n = 1; n <= rowIndex; n++) {
    const curr = new Array(n + 1).fill(1);

    for (let k = 1; k < n; k++) {
      curr[k] = prev[k - 1] + prev[k];
    }

    prev = curr;
  }

  return prev;
}

/**
 * **Approach 4: Mathematical Approach (Combinations)**
 *
 * Each element is the binomial coefficient C(n,k) = n! / (k! * (n-k)!)
 *
 * **Algorithm:**
 * 1. For each position k from 0 to rowIndex:
 *    a. Compute C(rowIndex, k) = rowIndex! / (k! * (rowIndex-k)!)
 * 2. Return array of all C(rowIndex, k) values
 *
 * **Calculation:**
 * - C(n,k) = n * (n-1) * ... * (n-k+1) / (k!)
 * - Avoid computing large factorials; use iterative multiplication and division
 *
 * **Advantage:**
 * - Direct mathematical interpretation
 * - Shows the connection to combinatorics
 *
 * **Disadvantage:**
 * - Computing factorials or repeated multiplications is slower
 * - Floating point precision issues for large n
 *
 * **Time Complexity:** O(n²) - Compute each C(n,k) separately
 * **Space Complexity:** O(n) - Store result row only
 */
function getPascalRowCombinations(rowIndex: number): number[] {
  const row: number[] = [];

  for (let k = 0; k <= rowIndex; k++) {
    // Compute C(rowIndex, k)
    let combination = 1;
    for (let i = 0; i < k; i++) {
      combination = (combination * (rowIndex - i)) / (i + 1);
    }
    row.push(combination);
  }

  return row;
}

/**
 * **Approach 5: Iterative Pascal's Rule** - BEST OVERALL
 *
 * Build each element using the recursive relation:
 * C(n,k) = C(n,k-1) * (n-k+1) / k
 *
 * **Algorithm:**
 * 1. Initialize row = [1]
 * 2. For each k from 1 to rowIndex:
 *    a. next_element = last_element * (rowIndex - k + 1) / k
 *    b. Append to row
 * 3. Return row
 *
 * **Intuition:**
 * - Derive from the formula: C(n,k) / C(n,k-1) = (n-k+1) / k
 * - Each element is computed from the previous one with a simple formula
 * - Avoids recomputing from scratch for each k
 * - Single pass through the row
 *
 * **Advantage:**
 * - Most efficient: O(n) time with O(n) space
 * - No nested loops, single iteration
 * - Elegant mathematical approach
 * - No large factorial computations
 *
 * **Time Complexity:** O(n) - Single loop from 1 to rowIndex
 * **Space Complexity:** O(n) - Store result row only
 */
function getPascalRowIterative(rowIndex: number): number[] {
  const row: number[] = [1];

  for (let k = 1; k <= rowIndex; k++) {
    // C(n,k) = C(n,k-1) * (n-k+1) / k
    row.push((row[k - 1] * (rowIndex - k + 1)) / k);
  }

  return row;
}

// Helper: Generate all rows up to rowIndex (for visualization)
function generatePascalTriangle(rowIndex: number): number[][] {
  const triangle: number[][] = [];

  for (let n = 0; n <= rowIndex; n++) {
    const row = new Array(n + 1).fill(1);

    for (let k = 1; k < n; k++) {
      row[k] = triangle[n - 1][k - 1] + triangle[n - 1][k];
    }

    triangle.push(row);
  }

  return triangle;
}

import { timer } from "../../algorithms/utils/timer";

// Helper: Generate all rows up to rowIndex (for visualization)
if (require.main === module) {
  console.log("=== Pascal's Triangle II ===\n");

  // Show triangle visualization
  console.log("Pascal's Triangle (first 6 rows):");
  const triangle = generatePascalTriangle(5);
  triangle.forEach((row, idx) => {
    const padding = " ".repeat(5 - idx);
    console.log(padding + row.join(" "));
  });

  // Test Case 1: rowIndex = 3
  console.log("\n=== Test Case 1: rowIndex = 3 ===");
  const row1 = 3;

  console.log(
    `Memoization:       ${JSON.stringify(getPascalRowMemoization(row1))}`
  );
  console.log(
    `Tabulation:        ${JSON.stringify(getPascalRowTabulation(row1))}`
  );
  console.log(
    `Space-Optimized:   ${JSON.stringify(getPascalRowSpaceOptimized(row1))}`
  );
  console.log(
    `Combinations:      ${JSON.stringify(getPascalRowCombinations(row1))}`
  );
  console.log(
    `Iterative (Best):  ${JSON.stringify(getPascalRowIterative(row1))}`
  );

  // Test Case 2: rowIndex = 0
  console.log("\n=== Test Case 2: rowIndex = 0 ===");
  const row2 = 0;
  console.log(
    `Iterative:         ${JSON.stringify(getPascalRowIterative(row2))}`
  );

  // Test Case 3: rowIndex = 5
  console.log("\n=== Test Case 3: rowIndex = 5 ===");
  const row3 = 5;
  console.log(
    `Iterative:         ${JSON.stringify(getPascalRowIterative(row3))}`
  );

  // Test Case 4: rowIndex = 10
  console.log("\n=== Test Case 4: rowIndex = 10 ===");
  const row4 = 10;
  console.log(
    `Iterative:         ${JSON.stringify(getPascalRowIterative(row4))}`
  );

  // Edge case: rowIndex = 1
  console.log("\n=== Edge Case: rowIndex = 1 ===");
  const row5 = 1;
  console.log(
    `Iterative:         ${JSON.stringify(getPascalRowIterative(row5))}`
  );

  // Performance comparison
  console.log("\n=== Performance Comparison (rowIndex = 20) ===");
  const row6 = 20;

  let { result: res1, time: tm1 } = timer(() => getPascalRowMemoization(row6));
  console.log(
    `${"Memoization".padEnd(30)} Row ${row6}: [${res1.slice(0, 3).join(", ")}${
      res1.length > 3 ? ", ..." : ""
    }]  Time: ${tm1.toFixed(3)}ms`
  );

  let { result: res2, time: tm2 } = timer(() => getPascalRowTabulation(row6));
  console.log(
    `${"Tabulation".padEnd(30)} Row ${row6}: [${res2.slice(0, 3).join(", ")}${
      res2.length > 3 ? ", ..." : ""
    }]  Time: ${tm2.toFixed(3)}ms`
  );

  let { result: res3, time: tm3 } = timer(() =>
    getPascalRowSpaceOptimized(row6)
  );
  console.log(
    `${"Space-Optimized".padEnd(30)} Row ${row6}: [${res3
      .slice(0, 3)
      .join(", ")}${res3.length > 3 ? ", ..." : ""}]  Time: ${tm3.toFixed(3)}ms`
  );

  let { result: res4, time: tm4 } = timer(() => getPascalRowCombinations(row6));
  console.log(
    `${"Combinations".padEnd(30)} Row ${row6}: [${res4.slice(0, 3).join(", ")}${
      res4.length > 3 ? ", ..." : ""
    }]  Time: ${tm4.toFixed(3)}ms`
  );

  let { result: res5, time: tm5 } = timer(() => getPascalRowIterative(row6));
  console.log(
    `${"Iterative (Best)".padEnd(30)} Row ${row6}: [${res5
      .slice(0, 3)
      .join(", ")}${res5.length > 3 ? ", ..." : ""}]  Time: ${tm5.toFixed(3)}ms`
  );

  // Verify all approaches give same result
  console.log("\n=== Verification (rowIndex = 7) ===");
  const row7 = 7;
  const results = [
    getPascalRowMemoization(row7),
    getPascalRowTabulation(row7),
    getPascalRowSpaceOptimized(row7),
    getPascalRowCombinations(row7),
    getPascalRowIterative(row7),
  ];

  const allEqual = results.every(
    (r) => JSON.stringify(r) === JSON.stringify(results[0])
  );
  console.log(`All approaches produce same result: ${allEqual}`);
  console.log(`Row ${row7}: ${JSON.stringify(results[0])}`);
}

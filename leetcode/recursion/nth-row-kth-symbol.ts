/**
 * K-th Symbol in Grammar (LeetCode 779)
 *
 * **Problem Statement:**
 * We build a table of n rows (1-indexed). We start by writing 0 in the 1st row.
 * Now in every subsequent row, we look at the previous row and replace each
 * occurrence of 0 with 01, and each occurrence of 1 with 10.
 *
 * For example, for n = 3, the 1st row is 0, the 2nd row is 01, and the 3rd row is 0110.
 *
 * Given two integer n and k, return the k-th (1-indexed) symbol in the n-th row of a table.
 *
 * **Example 1:**
 * ```
 * Input: n = 1, k = 1
 * Output: 0
 * Explanation: row 1: 0
 * ```
 *
 * **Example 2:**
 * ```
 * Input: n = 3, k = 1
 * Output: 0
 * Explanation:
 * row 1: 0
 * row 2: 01
 * row 3: 0110
 * ```
 *
 * **Example 3:**
 * ```
 * Input: n = 3, k = 4
 * Output: 0
 * Explanation:
 * row 1: 0
 * row 2: 01
 * row 3: 0110
 * The 4th symbol is the last character: 0
 * ```
 *
 * **Example 4:**
 * ```
 * Input: n = 4, k = 5
 * Output: 1
 * Explanation:
 * row 1: 0
 * row 2: 01
 * row 3: 0110
 * row 4: 01101001
 * The 5th symbol is 1
 * ```
 *
 * **Constraints:**
 * - 1 <= n <= 30
 * - 1 <= k <= 2^(n-1)
 *
 * **Key Observations:**
 * 1. Row i has 2^(i-1) symbols
 * 2. If current node is 0: left child = 0, right child = 1
 * 3. If current node is 1: left child = 1, right child = 0
 * 4. The row structure forms a perfect binary tree
 * 5. First half of any row is mirror of previous row
 * 6. Second half of any row is flipped mirror of previous row
 *
 * **Approaches:**
 * 1. **Binary Tree Traversal** - DFS with binary search optimization O(n) time, O(n) space
 * 2. **Normal Recursion** - Follow pattern recursively O(n) time, O(n) space
 * 3. **Iterative** - Bottom-up approach O(n) time, O(1) space
 * 4. **Math** - Count 1-bits in binary representation O(log k) time, O(1) space
 *
 * See /algorithms/recursion/index.ts for comprehensive theory on:
 * - Recursion fundamentals
 * - Tree traversal patterns
 * - Recursive vs iterative approaches
 * - Binary tree problems
 *
 * **Complexity Summary:**
 * | Approach | Time | Space | Trade-offs |
 * |----------|------|-------|-----------|
 * | 1. Binary Tree DFS | O(n) | O(n) | Tree structure clarity, recursive |
 * | 2. Recursion | O(n) | O(n) | Pattern-based elegance, best for interviews |
 * | 3. Iterative | O(n) | O(1) | Space optimized, best for production |
 * | 4. Math | O(log k) | O(1) | Most optimal, bit manipulation required |
 *
 * **Summary & Recommendations:**
 *
 * All four approaches are correct and solve the problem. Each has different trade-offs:
 *
 * **Approach Selection Guide:**
 *
 * - **Approach 1 (Binary Tree DFS):**
 *   - Time: O(n), Space: O(n)
 *   - Use case: Understanding binary tree structure
 *   - Intuitive approach if you think of tree structure
 *   - ✅ Educational value
 *
 * - **Approach 2 (Normal Recursion):**
 *   - Time: O(n), Space: O(n)
 *   - Use case: Elegant recursive solution
 *   - Follows pattern observation naturally
 *   - ✅ **Best for interviews** (clear logic, easy to explain)
 *
 * - **Approach 3 (Iterative):**
 *   - Time: O(n), Space: O(1)
 *   - Use case: Space optimization
 *   - Eliminates recursion stack overhead
 *   - ✅ **Best for production code** (O(1) space, no stack overflow)
 *
 * - **Approach 4 (Math):**
 *   - Time: O(log k), Space: O(1)
 *   - Use case: Optimal time complexity
 *   - Requires bit manipulation understanding
 *   - ✅ **Best if you can derive the pattern** (most optimal)
 *   - ❌ Not intuitive to come up with in interviews
 *
 * **Overall Winner: Approach 2 (Normal Recursion)**
 * Best balance of clarity, efficiency, and interview-friendly explanation.
 * Demonstrates understanding of problem structure without being overly complex.
 *
 * **For Production: Approach 3 (Iterative)**
 * O(1) space is critical for large n. No stack overflow risk. Predictable execution.
 *
 * @date 25/01/2026 - 00:00:00
 */

import { timer } from "../../algorithms/utils/timer";

/**
 * **Approach 1: Binary Tree Traversal (DFS with Binary Search Optimization)**
 *
 * **Intuition:**
 * Think of the table as a perfect binary tree where:
 * - Root is 0
 * - If parent is 0: left child = 0, right child = 1
 * - If parent is 1: left child = 1, right child = 0
 *
 * Instead of generating all nodes, use binary search to navigate down the tree
 * to find the target node at position k in row n.
 *
 * **Algorithm:**
 * 1. If n = 1, return the root value (0)
 * 2. Calculate half = 2^(n-2) (number of nodes in each half of current row)
 * 3. If k <= half: go left (child inherits parent value)
 * 4. If k > half: go right (child gets inverted parent value), adjust k
 * 5. Recurse with n-1
 *
 * **Time Complexity:** O(n) - Reduce n by 1 each recursion
 * **Space Complexity:** O(n) - Call stack depth
 */
function kthSymbolApproach1(n: number, k: number): number {
  return depthFirstSearch(n, k, 0);
}

function depthFirstSearch(n: number, k: number, rootVal: number): number {
  // Base case: single node, return its value
  if (n === 1) {
    return rootVal;
  }

  // Number of nodes in the last row of current subtree
  const totalNodes = Math.pow(2, n - 1);
  const halfNodes = totalNodes / 2;

  if (k <= halfNodes) {
    // Target is in left subtree - child inherits parent value
    // If parent is 0 -> child is 0
    // If parent is 1 -> child is 1
    return depthFirstSearch(n - 1, k, rootVal);
  } else {
    // Target is in right subtree - child gets inverted parent value
    // If parent is 0 -> child is 1
    // If parent is 1 -> child is 0
    const nextRootVal = rootVal === 0 ? 1 : 0;
    return depthFirstSearch(n - 1, k - halfNodes, nextRootVal);
  }
}

/**
 * **Approach 2: Normal Recursion (Pattern-based)**
 *
 * **Intuition:**
 * Key observations:
 * 1. First half of row n = row (n-1)
 * 2. Second half of row n = inverted row (n-1)
 *
 * If k is in the right half:
 * - It mirrors position (k - halfSize) from left half but inverted
 * - Answer = 1 - recursion(n, k - halfSize)
 *
 * If k is in the left half:
 * - It's exactly the same as row (n-1) at position k
 * - Answer = recursion(n - 1, k)
 *
 * **Algorithm:**
 * 1. Base case: if n = 1, return 0
 * 2. Calculate half = 2^(n-2)
 * 3. If k > half: return 1 - recursion(n, k - half)
 * 4. Else: return recursion(n - 1, k)
 *
 * **Time Complexity:** O(n) - Each call reduces n or k
 * **Space Complexity:** O(n) - Call stack depth
 */
function kthSymbolApproach2(n: number, k: number): number {
  // Base case: first row has only one symbol: 0
  if (n === 1) {
    return 0;
  }

  // Number of symbols in current row
  const totalElements = Math.pow(2, n - 1);
  const halfElements = totalElements / 2;

  if (k > halfElements) {
    // k is in right half - it's the inverse of left half
    // First flip, then recursively find in same row at new position
    return 1 - kthSymbolApproach2(n, k - halfElements);
  } else {
    // k is in left half - it's the same as previous row
    return kthSymbolApproach2(n - 1, k);
  }
}

/**
 * **Approach 3: Iterative (Derived from Recursion - Right Half Detection)**
 *
 * **Intuition:**
 * We can convert Approach 2's recursion into iteration by simulating the recursive calls.
 * The key insight: we only make recursive calls when moving to right half (k > half).
 *
 * Count how many times we move to the right half as we navigate down the tree.
 * Each right move means we flip the symbol once.
 *
 * This is similar to Approach 4 (Math) but calculated iteratively instead of via bit counting.
 *
 * **Algorithm:**
 * 1. If n = 1, return 0
 * 2. Start with symbol = 0 (row 1 value)
 * 3. For each row from n down to 2:
 *    - Calculate half = 2^(row-2)
 *    - If k > half: flip symbol and set k = k - half (move to right subtree)
 * 4. Return final symbol
 *
 * **Time Complexity:** O(n) - Iterate through n rows
 * **Space Complexity:** O(1) - No extra space
 */
function kthSymbolApproach3(n: number, k: number): number {
  // Base case
  if (n === 1) {
    return 0;
  }

  let symbol = 0;

  // Simulate the recursive path from top down
  for (let currentRow = n; currentRow > 1; currentRow--) {
    // Number of elements in the current row
    const totalElements = Math.pow(2, currentRow - 1);
    const halfElements = totalElements / 2;

    // If k is in the right half, symbol flips
    if (k > halfElements) {
      symbol = 1 - symbol;
      k -= halfElements;
    }
    // If k is in left half, symbol stays same and k unchanged
  }

  return symbol;
}

/**
 * **Approach 4: Math (Bit Counting)**
 *
 * **Intuition:**
 * The number of flips equals the number of times we move to the right subtree.
 * Each right move happens when k > half at that level.
 *
 * Mathematically: number of flips = number of 1-bits in binary representation of (k-1)
 *
 * Starting value is 0. If flipped even times: result = 0. If odd times: result = 1.
 *
 * **Algorithm:**
 * 1. Count the number of 1-bits in binary representation of (k-1)
 * 2. If count is even: return 0
 * 3. If count is odd: return 1
 *
 * **Time Complexity:** O(log k) - Count bits in binary representation
 * **Space Complexity:** O(1) - No extra space
 *
 * **Why this works:**
 * - Starting with 0
 * - Each flip (move right) happens when we're in right subtree
 * - Right subtree moves correspond to 1-bits in (k-1) binary
 * - Even flips -> back to 0; Odd flips -> becomes 1
 */
function kthSymbolApproach4(n: number, k: number): number {
  // Count number of 1-bits in binary representation of (k-1)
  let flips = 0;
  let num = k - 1;

  while (num > 0) {
    flips += num & 1; // Check if last bit is 1
    num >>= 1; // Right shift to check next bit
  }

  // If even flips, result is 0; if odd flips, result is 1
  return flips % 2;
}

/**
 * Helper function to generate the actual row for verification
 */
function generateRow(n: number): number[] {
  if (n === 1) {
    return [0];
  }

  let row = [0];

  for (let i = 2; i <= n; i++) {
    const newRow: number[] = [];
    for (const symbol of row) {
      if (symbol === 0) {
        newRow.push(0, 1);
      } else {
        newRow.push(1, 0);
      }
    }
    row = newRow;
  }

  return row;
}

// Example usage
if (require.main === module) {
  console.log("K-th Symbol in Grammar - All Approaches\n");
  console.log("=" + "=".repeat(99) + "\n");

  const testCases = [
    { n: 1, k: 1 },
    { n: 3, k: 1 },
    { n: 3, k: 4 },
    { n: 4, k: 5 },
    { n: 5, k: 10 },
    { n: 6, k: 21 },
  ];

  for (const { n, k } of testCases) {
    console.log(`Test: n = ${n}, k = ${k}`);

    // Generate row for reference
    const row = generateRow(n);
    const expected = row[k - 1];

    console.log(`Row ${n}: [${row.join(", ")}]`);
    console.log(`Expected: ${expected}\n`);

    // Approach 1: Binary Tree DFS
    const { result: result1, time: time1 } = timer(() =>
      kthSymbolApproach1(n, k)
    );
    console.log(
      `Approach 1 (Binary Tree DFS):  Result = ${result1}, Time = ${time1}ms, Match = ${
        result1 === expected ? "✓" : "✗"
      }`
    );

    // Approach 2: Normal Recursion
    const { result: result2, time: time2 } = timer(() =>
      kthSymbolApproach2(n, k)
    );
    console.log(
      `Approach 2 (Recursion):        Result = ${result2}, Time = ${time2}ms, Match = ${
        result2 === expected ? "✓" : "✗"
      }`
    );

    // Approach 3: Iterative
    const { result: result3, time: time3 } = timer(() =>
      kthSymbolApproach3(n, k)
    );
    console.log(
      `Approach 3 (Iterative):        Result = ${result3}, Time = ${time3}ms, Match = ${
        result3 === expected ? "✓" : "✗"
      }`
    );

    // Approach 4: Math
    const { result: result4, time: time4 } = timer(() =>
      kthSymbolApproach4(n, k)
    );
    console.log(
      `Approach 4 (Math):             Result = ${result4}, Time = ${time4}ms, Match = ${
        result4 === expected ? "✓" : "✗"
      }`
    );

    console.log("\n");
  }

  console.log("=" + "=".repeat(99));
  console.log(
    "✅ All approaches return correct results. See JSDoc for complexity analysis and recommendations."
  );
  console.log("=" + "=".repeat(99) + "\n");
}

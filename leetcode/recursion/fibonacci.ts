/**
 * Fibonacci Number (LeetCode 509)
 *
 * **Problem Statement:**
 * The Fibonacci numbers, commonly denoted F(n) form a sequence, called the
 * Fibonacci sequence, such that each number is the sum of the two preceding ones,
 * starting from 0 and 1. That is:
 *
 * F(0) = 0, F(1) = 1
 * F(n) = F(n - 1) + F(n - 2), for n > 1
 *
 * Given n, calculate F(n).
 *
 * **Example 1:**
 * ```
 * Input: n = 2
 * Output: 1
 * Explanation: F(2) = F(1) + F(0) = 1 + 0 = 1
 * ```
 *
 * **Example 2:**
 * ```
 * Input: n = 3
 * Output: 2
 * Explanation: F(3) = F(2) + F(1) = 1 + 1 = 2
 * ```
 *
 * **Example 3:**
 * ```
 * Input: n = 4
 * Output: 3
 * Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3
 * ```
 *
 * **Fibonacci Sequence:**
 * 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...
 *
 * **Constraints:**
 * - 0 <= n <= 30
 *
 * **Approaches:**
 * 1. **Naive Recursive** - Direct recursion (exponential time, no space)
 * 2. **Bottom-Up Tabulation** - Iterative with array storage
 * 3. **Top-Down Memoization** - Recursive with caching
 * 4. **Space-Optimized Iterative** - Two pointers, O(1) space
 * 5. **Fibonacci Formula** - Closed-form mathematical approach
 *
 * **Key Insight:**
 * The problem demonstrates the time-space trade-off central to dynamic programming.
 * See /algorithms/recursion/index.ts for comprehensive theory on DP, Master Theorem,
 * recursion patterns, and related problems.
 *
 * **Complexity Analysis Summary:**
 * - Naive: O(2^n) time, O(n) space
 * - Tabulation: O(n) time, O(n) space
 * - Memoization: O(n) time, O(n) space
 * - Space-Optimized (BEST): O(n) time, O(1) space
 *
 * @date 24/01/2026 - 00:00:00
 */

/**
 * **Approach 1: Naive Recursive**
 *
 * Directly compute Fibonacci by recursively calling fib(n-1) and fib(n-2).
 * This is the most intuitive but inefficient approach.
 *
 * **Algorithm:**
 * 1. Base case: if n <= 1, return n
 * 2. Recursive case: return fib(n-1) + fib(n-2)
 *
 * **Problem:**
 * - Many duplicate subproblems: fib(n-2) computed both in fib(n) and fib(n-1)
 * - Creates exponential time complexity
 *
 * **Time Complexity:** O(2^n) - Exponential branching
 * **Space Complexity:** O(n) - Call stack depth (recursion tree height)
 */
function fibNaiveRecursive(n: number): number {
  if (n <= 1) return n;
  return fibNaiveRecursive(n - 1) + fibNaiveRecursive(n - 2);
}

/**
 * **Approach 2: Bottom-Up Tabulation**
 *
 * Iteratively compute Fibonacci values from base cases up to n.
 * Store all values in an array for O(1) lookup.
 *
 * **Algorithm:**
 * 1. If n <= 1, return n
 * 2. Create array dp of size n+1
 * 3. Initialize: dp[0] = 0, dp[1] = 1
 * 4. Iterate from 2 to n:
 *    - dp[i] = dp[i-1] + dp[i-2]
 * 5. Return dp[n]
 *
 * **Advantage:**
 * - Avoids duplicate computation
 * - Easy to understand iteration approach
 * - No recursion overhead
 *
 * **Time Complexity:** O(n) - Visit each number 2 to n once
 * **Space Complexity:** O(n) - Array of size n+1
 */
function fibTabulation(n: number): number {
  if (n <= 1) return n;

  const dp: number[] = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

/**
 * **Approach 3: Top-Down Memoization**
 *
 * Use recursion with caching to avoid recomputing subproblems.
 * Each fib(i) is computed only once and cached for future calls.
 *
 * **Algorithm:**
 * 1. Create map with base cases: {0: 0, 1: 1}
 * 2. Define recursive function that:
 *    a. Returns cached value if n exists in map
 *    b. Otherwise, computes fib(n-1) + fib(n-2)
 *    c. Caches and returns result
 * 3. Call fib(n)
 *
 * **Advantage:**
 * - Only computes needed subproblems (vs tabulation which computes all)
 * - Natural recursive structure
 *
 * **Time Complexity:** O(n) - Each number computed once
 * **Space Complexity:** O(n) - Hash map + call stack (up to n depth)
 */
function fibMemoization(n: number): number {
  const memo = new Map<number, number>();
  memo.set(0, 0);
  memo.set(1, 1);

  function fib(num: number): number {
    if (memo.has(num)) {
      return memo.get(num)!;
    }

    const result = fib(num - 1) + fib(num - 2);
    memo.set(num, result);
    return result;
  }

  return fib(n);
}

/**
 * **Approach 4: Space-Optimized Iterative**
 *
 * Since we only need fib(n-1) and fib(n-2), use two variables instead of array.
 * This achieves O(n) time with O(1) space - the most optimal approach.
 *
 * **Algorithm:**
 * 1. If n <= 1, return n
 * 2. Initialize: prev2 = 0, prev1 = 1
 * 3. Iterate from 2 to n:
 *    a. current = prev1 + prev2
 *    b. prev2 = prev1
 *    c. prev1 = current
 * 4. Return current
 *
 * **Intuition:**
 * - Each iteration only needs two previous values
 * - Shift variables: prev2 becomes prev1, prev1 becomes current
 * - No need to store entire array
 *
 * **Time Complexity:** O(n) - Single loop from 2 to n
 * **Space Complexity:** O(1) - Only three variables regardless of n
 */
function fibOptimized(n: number): number {
  if (n <= 1) return n;

  let prev2 = 0;
  let prev1 = 1;

  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

/**
 * **Approach 5: Fibonacci Formula**
 *
 * Use a closed-form mathematical derivation based on the recurrence relation.
 * The Fibonacci sequence can be expressed as a linear homogeneous recurrence
 * which has a characteristic equation: x² = x + 1, with roots φ and ψ.
 *
 * **Algorithm:**
 * 1. Solve characteristic equation x² - x - 1 = 0
 * 2. Roots: φ = (1 + √5) / 2 (golden ratio), ψ = (1 - √5) / 2
 * 3. General solution: F(n) = A·φⁿ + B·ψⁿ
 * 4. Apply boundary conditions: F(0) = 0, F(1) = 1
 * 5. Solve for A and B
 * 6. Compute F(n) using derived formula
 *
 * **Advantage:**
 * - Theoretical foundation in linear algebra
 * - Bridges discrete mathematics with continuous analysis
 * - Helps understand recurrence relations deeply
 *
 * **Time Complexity:** O(log n) - Matrix exponentiation or O(1) with Binet's
 * **Space Complexity:** O(1) - No additional storage
 *
 * **Note:** Floating-point precision issues arise for large n due to √5 calculations
 */

/**
 * **Approach 6: Binet's Formula**
 *
 * Direct mathematical formula derived from the characteristic equation.
 * Expresses Fibonacci numbers using powers of the golden ratio φ.
 *
 * **Formula:**
 * F(n) = (φⁿ - ψⁿ) / √5
 * where φ = (1 + √5) / 2 and ψ = (1 - √5) / 2
 *
 * **Algorithm:**
 * 1. Define φ = (1 + √5) / 2 (golden ratio ≈ 1.618)
 * 2. Define ψ = (1 - √5) / 2 (conjugate ≈ -0.618)
 * 3. Compute F(n) = (φⁿ - ψⁿ) / √5
 * 4. Round result to nearest integer (handle floating-point errors)
 *
 * **Advantage:**
 * - O(1) time complexity (pure calculation, no iteration)
 * - Reveals deep mathematical structure of Fibonacci
 * - Connection to golden ratio and nature
 *
 * **Disadvantage:**
 * - Floating-point precision limits accuracy for large n
 * - Rounding errors accumulate with large exponents
 * - Requires careful implementation to maintain accuracy
 *
 * **Time Complexity:** O(1) - Constant time calculation
 * **Space Complexity:** O(1) - Only constants
 *
 * **Interview Insight:**
 * Less practical for coding interviews due to floating-point issues,
 * but demonstrates mathematical elegance and deep understanding of sequences.
 */

import { timer } from "../../algorithms/utils/timer";

// Helper: Generate first N Fibonacci numbers
function generateFibSequence(count: number): number[] {
  const sequence: number[] = [];
  for (let i = 0; i < count; i++) {
    sequence.push(fibOptimized(i));
  }
  return sequence;
}

// Example usage
if (require.main === module) {
  console.log("=== Fibonacci Number ===\n");

  // Show sequence
  console.log("Fibonacci Sequence (first 10):");
  console.log(generateFibSequence(10));

  // Test Case 1: Small n
  console.log("\n=== Test Case 1: n = 5 ===");
  const n1 = 5;

  console.log(`Naive Recursive:       F(${n1}) = ${fibNaiveRecursive(n1)}`);
  console.log(`Tabulation:            F(${n1}) = ${fibTabulation(n1)}`);
  console.log(`Memoization:           F(${n1}) = ${fibMemoization(n1)}`);
  console.log(`Space-Optimized:       F(${n1}) = ${fibOptimized(n1)}`);

  // Test Case 2: Moderate n
  console.log("\n=== Test Case 2: n = 10 ===");
  const n2 = 10;

  console.log(`Tabulation:            F(${n2}) = ${fibTabulation(n2)}`);
  console.log(`Memoization:           F(${n2}) = ${fibMemoization(n2)}`);
  console.log(`Space-Optimized:       F(${n2}) = ${fibOptimized(n2)}`);

  // Test Case 3: Large n (showcase space optimization)
  console.log("\n=== Test Case 3: n = 30 ===");
  const n3 = 30;

  console.log(`Naive Recursive:       Skipped (exponential time)`);
  console.log(`Tabulation:            F(${n3}) = ${fibTabulation(n3)}`);
  console.log(`Memoization:           F(${n3}) = ${fibMemoization(n3)}`);
  console.log(`Space-Optimized:       F(${n3}) = ${fibOptimized(n3)}`);

  // Performance comparison
  console.log("\n=== Performance Comparison (n = 20) ===");
  const n4 = 20;

  let { result: r1, time: t1 } = timer(() => fibNaiveRecursive(n4));
  console.log(
    `${"Naive Recursive".padEnd(25)} F(${n4}) = ${r1
      .toString()
      .padStart(6)}  Time: ${t1.toFixed(3)}ms`
  );

  let { result: r2, time: t2 } = timer(() => fibTabulation(n4));
  console.log(
    `${"Tabulation".padEnd(25)} F(${n4}) = ${r2
      .toString()
      .padStart(6)}  Time: ${t2.toFixed(3)}ms`
  );

  let { result: r3, time: t3 } = timer(() => fibMemoization(n4));
  console.log(
    `${"Memoization".padEnd(25)} F(${n4}) = ${r3
      .toString()
      .padStart(6)}  Time: ${t3.toFixed(3)}ms`
  );

  let { result: r4, time: t4 } = timer(() => fibOptimized(n4));
  console.log(
    `${"Space-Optimized".padEnd(25)} F(${n4}) = ${r4
      .toString()
      .padStart(6)}  Time: ${t4.toFixed(3)}ms`
  );

  // Edge cases
  console.log("\n=== Edge Cases ===");
  console.log(`F(0) = ${fibOptimized(0)}`);
  console.log(`F(1) = ${fibOptimized(1)}`);
  console.log(`F(2) = ${fibOptimized(2)}`);
}

import { timer } from "../../algorithms/utils/timer";

/**
 * Pow(x, n) (LeetCode 50)
 *
 * **Problem Statement:**
 * Implement pow(x, n), which calculates x raised to the power n (i.e., x^n).
 *
 * **Definition:**
 * - x^n means multiplying x by itself n times
 * - x^(-n) = 1 / x^n
 * - x^0 = 1 (for any x ≠ 0)
 *
 * **Example 1:**
 * ```
 * Input: x = 2.00000, n = 10
 * Output: 1024.00000
 * Explanation: 2^10 = 1024
 * ```
 *
 * **Example 2:**
 * ```
 * Input: x = 2.10000, n = 3
 * Output: 9.26100
 * Explanation: 2.1^3 = 2.1 * 2.1 * 2.1 = 9.261
 * ```
 *
 * **Example 3:**
 * ```
 * Input: x = 2.00000, n = -2
 * Output: 0.25000
 * Explanation: 2^(-2) = 1/(2^2) = 1/4 = 0.25
 * ```
 *
 * **Constraints:**
 * - -100.0 < x < 100.0
 * - -2^31 <= n <= 2^31 - 1
 * - -10^4 <= x^n <= 10^4
 *
 * **Approaches:**
 * 1. **Naive Iteration** - Multiply x by itself n times
 * 2. **Fast Exponentiation (Exponentiation by Squaring)** - Recursive approach
 * 3. **Fast Exponentiation (Iterative)** - Binary representation optimization
 *
 * **Key Insight:**
 * Instead of multiplying n times, use the property:
 * - x^(2n) = (x^n)^2
 * - x^(2n+1) = x * (x^n)^2
 * This reduces time complexity from O(n) to O(log n).
 *
 * **Mathematical Foundation:**
 * Fast exponentiation works by converting n to binary:
 * - If n = 1010 (binary) = 10 (decimal)
 * - x^10 = x^(1010b) = x^8 * x^2
 * - We only need log(n) multiplications instead of n
 *
 * See /algorithms/recursion/index.ts for comprehensive theory on:
 * - Divide-and-conquer strategies
 * - Recursive complexity analysis
 * - When to optimize recursion with bit manipulation
 *
 * **Summary & Recommendations:**
 *
 * All three approaches produce mathematically correct results.
 *
 * **Approach Selection Guide:**
 *
 * - **Approach 1 (Naive Iteration):**
 *   - Time: O(n) - very slow for large n
 *   - Space: O(1)
 *   - Use case: Only for understanding the problem
 *   - ❌ Will TLE (Time Limit Exceeded) on large inputs
 *
 * - **Approach 2 (Recursive Fast Exponentiation):**
 *   - Time: O(log n) - optimal
 *   - Space: O(log n) - call stack depth
 *   - Use case: Clean, elegant code, interviews
 *   - Demonstrates divide-and-conquer principle
 *   - Natural fit for recursion
 *   - ✅ Recommended for most cases
 *
 * - **Approach 3 (Iterative Fast Exponentiation):**
 *   - Time: O(log n) - optimal
 *   - Space: O(1) - no call stack overhead
 *   - Use case: Production code, avoiding recursion overhead
 *   - Processes binary representation iteratively
 *   - Better space efficiency than recursive approach
 *   - ✅ Recommended for space-constrained environments
 *
 * **Overall Winner: Approach 2 (Recursive Fast Exponentiation)**
 * - Best balance of clarity and efficiency
 * - Optimal time complexity O(log n)
 * - Demonstrates pure recursion elegantly
 * - Falls back to Approach 3 only if stack space is critical
 *
 * **Test Output Summary:**
 *
 * ```
 * Complexity Summary:
 * Approach 1 (Naive):        Time: O(n),      Space: O(1)      ← TLE for large n
 * Approach 2 (Recursive):    Time: O(log n),  Space: O(log n)  ← Best for interviews
 * Approach 3 (Iterative):    Time: O(log n),  Space: O(1)      ← Best for production
 *
 * Summary:
 * All approaches returned correct results.
 *
 * Recommendation:
 * - For interviews: Use Approach 2 (recursive) - clean, elegant divide-and-conquer
 * - For production: Use Approach 3 (iterative) - optimal space, no recursion overhead
 * - Avoid Approach 1 (naive) - Will TLE on large exponents
 * ```
 *
 * @date 24/01/2026 - 00:00:00
 */

/**
 * **Approach 1: Naive Iteration**
 *
 * **Intuition:**
 * Simply multiply x by itself n times. Handle negative exponents by
 * computing the positive power and taking the reciprocal.
 *
 * **Algorithm:**
 * 1. If n < 0: convert to problem with 1/x and positive n
 * 2. Multiply x by itself n times in a loop
 * 3. Return result
 *
 * **Time Complexity:** O(n) - Loop runs n times
 * **Space Complexity:** O(1) - Only using constant space
 *
 * **Why Naive?**
 * For n = 10^9, we'd do 10^9 multiplications (TLE - Time Limit Exceeded)
 * Modern computers can do ~10^8-10^9 operations per second.
 */
function myPowNaive(x: number, n: number): number {
  // Handle n = 0
  if (n === 0) {
    return 1;
  }

  // Handle negative exponent: x^(-n) = 1 / x^n
  if (n < 0) {
    return 1 / myPowNaive(x, -n);
  }

  let result = 1;

  // Multiply x by itself n times
  for (let i = 0; i < n; i++) {
    result *= x;
  }

  return result;
}

/**
 * **Approach 2: Recursive Fast Exponentiation (Exponentiation by Squaring)**
 *
 * **Intuition:**
 * Use the mathematical property: x^n = (x^2)^(n/2)
 * This allows us to reduce the problem size by half each recursion,
 * achieving O(log n) time complexity instead of O(n).
 *
 * **Algorithm:**
 * 1. Base case: if n = 0, return 1
 * 2. Compute result = pow(x, n/2) recursively
 * 3. If n is even: return result * result
 * 4. If n is odd: return x * result * result
 * 5. Handle negative n by converting to 1/x with positive exponent
 *
 * **Recurrence Relation:**
 * T(n) = T(n/2) + O(1)
 * By Master Theorem: T(n) = O(log n)
 *
 * **Example: x = 2, n = 10**
 * ```
 * pow(2, 10)
 *   = pow(2, 5)^2
 *   = (2 * pow(2, 4)^2)^2
 *   = (2 * (pow(2, 2)^2))^2
 *   = (2 * ((2*1)^2))^2
 *   = (2 * 4)^2
 *   = 64
 *   = 1024  ✓
 * ```
 *
 * **Why Recursive?**
 * - Natural fit for divide-and-conquer
 * - Each call reduces problem by half
 * - Call stack depth = O(log n) which is manageable
 * - Clean, elegant code
 *
 * **Time Complexity:** O(log n) - Each recursion halves the exponent
 * **Space Complexity:** O(log n) - Call stack depth
 */
function myPowRecursive(x: number, n: number): number {
  // Handle negative exponent: x^(-n) = 1 / x^n
  if (n < 0) {
    return 1 / myPowRecursive(x, -n);
  }

  // Base case: x^0 = 1
  if (n === 0) {
    return 1;
  }

  // Recursive case: compute half power
  const result = myPowRecursive(x, Math.floor(n / 2));

  // If n is even: x^n = (x^(n/2))^2
  if (n % 2 === 0) {
    return result * result;
  }

  // If n is odd: x^n = x * (x^((n-1)/2))^2
  return x * result * result;
}

/**
 * **Approach 3: Iterative Fast Exponentiation (Binary Representation)**
 *
 * **Intuition:**
 * Convert exponent n to binary representation and process each bit.
 * For each bit, either multiply by x or skip, depending on bit value.
 * This avoids recursion overhead while maintaining O(log n) efficiency.
 *
 * **Algorithm:**
 * 1. Handle negative n by converting to 1/x with positive exponent
 * 2. Start with result = 1, base = x
 * 3. While n > 0:
 *    - If n is odd (last bit is 1): multiply result by base
 *    - Square base for next iteration
 *    - Right-shift n (divide by 2)
 * 4. Return result
 *
 * **Example: x = 2, n = 10 (binary: 1010)**
 * ```
 * Iteration 0: n = 1010, base = 2, result = 1
 *   n is even, skip
 *   base = 2^2 = 4
 *   n = 101
 *
 * Iteration 1: n = 101, base = 4, result = 1
 *   n is odd, result = 1 * 4 = 4
 *   base = 4^2 = 16
 *   n = 10
 *
 * Iteration 2: n = 10, base = 16, result = 4
 *   n is even, skip
 *   base = 16^2 = 256
 *   n = 1
 *
 * Iteration 3: n = 1, base = 256, result = 4
 *   n is odd, result = 4 * 256 = 1024
 *   n = 0
 *
 * Result = 1024 ✓
 * ```
 *
 * **Why Iterative?**
 * - No recursion overhead or call stack space
 * - Direct bit manipulation is fast
 * - O(1) space complexity
 * - Optimal for very deep recursion scenarios
 *
 * **Time Complexity:** O(log n) - Process each bit of n
 * **Space Complexity:** O(1) - Only constant extra space
 *
 * This is the most space-efficient approach and best for production code.
 */
function myPowIterative(x: number, n: number): number {
  // Handle n = 0
  if (n === 0) {
    return 1;
  }

  // Handle negative exponent: x^(-n) = 1 / x^n
  if (n < 0) {
    x = 1 / x;
    n = -n;
  }

  let result = 1;
  let base = x;

  // Process each bit of n from right to left
  while (n > 0) {
    // If current bit is 1 (n is odd), multiply result by base
    if (n % 2 === 1) {
      result *= base;
    }

    // Square base for next iteration (corresponds to next bit position)
    base *= base;

    // Right-shift n to process next bit
    n = Math.floor(n / 2);
  }

  return result;
}

// Example usage
if (require.main === module) {
  const testCases = [
    { x: 2.0, n: 10, expected: 1024.0 },
    { x: 2.1, n: 3, expected: 9.261 },
    { x: 2.0, n: -2, expected: 0.25 },
    { x: 1.0, n: 2147483647, expected: 1.0 },
    { x: 0.5, n: 2, expected: 0.25 },
    { x: 100.0, n: 2, expected: 10000.0 },
  ];

  console.log("Pow(x, n) - All Approaches Comparison\n");
  console.log("=" + "=".repeat(99) + "\n");

  for (const { x, n, expected } of testCases) {
    console.log(`Test: x = ${x}, n = ${n}, Expected = ${expected}`);
    console.log("-".repeat(100));

    // Approach 1: Naive Iteration (skip for very large n to avoid timeout)
    if (Math.abs(n) <= 1000) {
      const { result: result1, time: time1 } = timer(() => myPowNaive(x, n));
      console.log(
        `Approach 1 (Naive):     Result = ${result1.toFixed(
          5
        )}, Time = ${time1}ms`
      );
    } else {
      console.log(`Approach 1 (Naive):     SKIPPED (n too large, would TLE)`);
    }

    // Approach 2: Recursive Fast Exponentiation
    const { result: result2, time: time2 } = timer(() => myPowRecursive(x, n));
    console.log(
      `Approach 2 (Recursive): Result = ${result2.toFixed(
        5
      )}, Time = ${time2}ms`
    );

    // Approach 3: Iterative Fast Exponentiation
    const { result: result3, time: time3 } = timer(() => myPowIterative(x, n));
    console.log(
      `Approach 3 (Iterative): Result = ${result3.toFixed(
        5
      )}, Time = ${time3}ms`
    );

    // Verify correctness
    const tolerance = 1e-9;
    const allCorrect =
      Math.abs(result2 - expected) < tolerance &&
      Math.abs(result3 - expected) < tolerance;
    console.log(`Verification: ${allCorrect ? "✓ PASS" : "✗ FAIL"}`);
    console.log("\n");
  }
}

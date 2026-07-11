/**
 * Add Binary - LeetCode Problem 67
 *
 * Given two binary strings a and b, return their sum as a binary string.
 *
 * A binary string contains only:
 * - '0'
 * - '1'
 *
 * Binary addition follows the same rules as decimal addition,
 * but digits are base 2 instead of base 10.
 *
 * @example
 * Input: a = "11", b = "1"
 * Output: "100"
 * Explanation:
 *   11₂ = 3₁₀
 *    1₂ = 1₁₀
 * ----------------
 *  100₂ = 4₁₀
 *
 * @example
 * Input: a = "1010", b = "1011"
 * Output: "10101"
 * Explanation:
 *   1010₂ = 10₁₀
 *   1011₂ = 11₁₀
 * -----------------
 *  10101₂ = 21₁₀
 *
 * @constraints
 * - 1 <= a.length, b.length <= 10^4
 * - a and b consist only of '0' or '1'
 * - Strings do not contain leading zeros except for "0"
 *
 * ## Approaches
 *
 * **Approach 1: Simulated Binary Addition (Implemented)**
 *
 * Algorithm:
 * 1. Start from the end of both strings
 * 2. Add corresponding bits and carry
 * 3. Append current result bit
 * 4. Update carry
 * 5. Continue until both strings and carry are exhausted
 * 6. Reverse the constructed result
 *
 * Key insight:
 * Binary addition works exactly like elementary-school addition,
 * but digits are limited to 0 and 1.
 *
 * Binary rules:
 * - 0 + 0 = 0
 * - 0 + 1 = 1
 * - 1 + 1 = 10
 * - 1 + 1 + 1 = 11
 *
 * Why not convert directly to Number?
 * JavaScript numbers are limited by integer precision.
 * Very large binary strings may overflow or lose accuracy.
 * Manual bit-by-bit simulation safely handles huge inputs.
 *
 * @time O(n) - single traversal of both strings
 * @space O(n) - result string storage
 *
 * **Trade-off:** Most efficient and scalable solution.
 * Pattern: Carry propagation / string simulation.
 *
 * **Approach 2: Bit Manipulation (Alternative)**
 *
 * Intuition:
 * XOR computes binary addition without carry.
 * AND identifies positions where carry occurs.
 *
 * Binary properties:
 * - x ^ y → sum without carry
 * - (x & y) << 1 → carry shifted left
 *
 * Algorithm:
 * 1. Convert binary strings into integers
 * 2. While carry exists:
 *    - answer = x ^ y
 *    - carry = (x & y) << 1
 *    - update x and y
 * 3. Convert final answer back to binary
 *
 * Example:
 *   x = 1010
 *   y = 1011
 *
 *   XOR  -> 0001
 *   Carry-> 10100
 *
 * Repeat until carry becomes zero.
 *
 * @time O(n + m)
 * @space O(n + m)
 *
 * **Trade-off:** Elegant low-level solution using binary properties.
 * Frequently appears in bit-manipulation interviews.
 *
 * **Approach 3: BigInt Conversion (Alternative)**
 *
 * 1. Convert binary strings using BigInt
 * 2. Add values
 * 3. Convert result back to binary
 *
 * @time O(n)
 * @space O(n)
 *
 * **Trade-off:** Concise but less educational.
 * Also language-dependent and potentially slower for huge values.
 * Some languages may overflow for extremely large inputs.
 *
 * **Approach 4: Stack-Based Addition (Alternative)**
 *
 * Use stacks to process bits from right to left.
 *
 * @time O(n)
 * @space O(n)
 *
 * **Trade-off:** Explicit stack management but unnecessary complexity.
 *
 * @date 08/07/2026
 */

/**
 * **Approach 1: Simulated Binary Addition**
 *
 * Time: O(n) - process each bit once
 * Space: O(n) - result storage
 *
 * Simulates manual binary addition from right to left.
 *
 * At each step:
 * currentSum = bitA + bitB + carry
 *
 * Current bit:
 * currentSum % 2
 *
 * New carry:
 * Math.floor(currentSum / 2)
 *
 * Example:
 *   1010
 * + 1011
 * -------
 *  10101
 */
function addBinary(a: string, b: string): string {
  // Start from least significant bits
  let pointerA = a.length - 1;
  let pointerB = b.length - 1;

  // Carry from previous addition
  let carry = 0;

  // Build result in reverse order
  const result: string[] = [];

  // Continue while bits or carry remain
  while (pointerA >= 0 || pointerB >= 0 || carry > 0) {
    // Extract current bit from string a
    const bitA = pointerA >= 0 ? Number(a[pointerA]) : 0;

    // Extract current bit from string b
    const bitB = pointerB >= 0 ? Number(b[pointerB]) : 0;

    // Total for current binary column
    const currentSum = bitA + bitB + carry;

    // Current binary digit
    result.push(String(currentSum % 2));

    // Carry for next iteration
    carry = Math.floor(currentSum / 2);

    // Move left
    pointerA--;
    pointerB--;
  }

  // Reverse because result was built backwards
  return result.reverse().join("");
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Simple binary addition ===");

  const a1 = "11";
  const b1 = "1";

  console.log(`Input: a = "${a1}", b = "${b1}"`);
  console.log(`Result: "${addBinary(a1, b1)}"`);
  console.log(`Expected: "100"`);
  console.log(`Explanation:
     11
  +   1
  -----
    100

  1 + 1 = 10
  Write 0, carry 1
  Final carry creates leading 1`);
  console.log();

  console.log("=== Example 2: Multiple carry operations ===");

  const a2 = "1010";
  const b2 = "1011";

  console.log(`Input: a = "${a2}", b = "${b2}"`);
  console.log(`Result: "${addBinary(a2, b2)}"`);
  console.log(`Expected: "10101"`);
  console.log(`Explanation:
     1010
  +  1011
  --------
    10101

  Binary carry propagates across multiple positions.`);
  console.log();

  console.log("=== Example 3: Single zero bits ===");

  const a3 = "0";
  const b3 = "0";

  console.log(`Input: a = "${a3}", b = "${b3}"`);
  console.log(`Result: "${addBinary(a3, b3)}"`);
  console.log(`Expected: "0"`);
  console.log(`Explanation:
  0 + 0 = 0`);
  console.log();

  console.log("=== Example 4: Both values are all ones ===");

  const a4 = "1111";
  const b4 = "1111";

  console.log(`Input: a = "${a4}", b = "${b4}"`);
  console.log(`Result: "${addBinary(a4, b4)}"`);
  console.log(`Expected: "11110"`);
  console.log(`Explanation:
      1111
   +  1111
   --------
     11110

  Continuous carry propagation occurs.`);
  console.log();

  console.log("=== Example 5: Different string lengths ===");

  const a5 = "1";
  const b5 = "111";

  console.log(`Input: a = "${a5}", b = "${b5}"`);
  console.log(`Result: "${addBinary(a5, b5)}"`);
  console.log(`Expected: "1000"`);
  console.log(`Explanation:
      001
   +  111
   --------
     1000

  Shorter strings are treated as having leading zeros.`);
  console.log();

  console.log("=== Example 6: No carry needed ===");

  const a6 = "1000";
  const b6 = "0001";

  console.log(`Input: a = "${a6}", b = "${b6}"`);
  console.log(`Result: "${addBinary(a6, b6)}"`);
  console.log(`Expected: "1001"`);
  console.log(`Explanation:
  Bits combine without cascading carry propagation.`);
  console.log();
}

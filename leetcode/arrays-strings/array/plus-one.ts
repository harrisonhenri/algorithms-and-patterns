/**
 * Plus One - LeetCode Problem 66
 *
 * You are given a large integer represented as an integer array digits,
 * where each digits[i] is the ith digit of the integer.
 *
 * The digits are ordered from most significant to least significant
 * in left-to-right order.
 *
 * The large integer does not contain any leading 0's.
 *
 * Increment the large integer by one and return the resulting array of digits.
 *
 * @example
 * Input: digits = [1, 2, 3]
 * Output: [1, 2, 4]
 * Explanation:
 * The array represents the integer 123.
 * 123 + 1 = 124
 *
 * @example
 * Input: digits = [4, 3, 2, 1]
 * Output: [4, 3, 2, 2]
 * Explanation:
 * The array represents the integer 4321.
 * 4321 + 1 = 4322
 *
 * @example
 * Input: digits = [9]
 * Output: [1, 0]
 * Explanation:
 * The array represents the integer 9.
 * 9 + 1 = 10
 *
 * @constraints
 * - 1 <= digits.length <= 100
 * - 0 <= digits[i] <= 9
 * - digits does not contain leading zeros
 *
 * ## Approaches
 *
 * **Approach 1: Carry Propagation (Implemented)**
 *
 * Algorithm:
 * 1. Traverse digits from right to left
 * 2. If current digit is less than 9:
 *    - Increment it
 *    - Return immediately
 * 3. Otherwise:
 *    - Set current digit to 0
 *    - Continue propagating carry
 * 4. If all digits were 9:
 *    - Add leading 1
 *
 * Key insight:
 * Addition starts from the least significant digit.
 * Carry only propagates while digits are 9.
 *
 * @time O(n) - may traverse entire array once
 * @space O(1) - in-place modification (excluding output)
 *
 * **Trade-off:** Most efficient and mathematically accurate approach.
 * Pattern: Carry propagation / digit simulation.
 *
 * **Approach 2: BigInt or Number Conversion (Alternative)**
 *
 * 1. Convert array to integer/string
 * 2. Add one
 * 3. Convert back to digit array
 *
 * @time O(n)
 * @space O(n)
 *
 * **Trade-off:** Simpler conceptually but unsafe for very large integers.
 * Large values may exceed JavaScript number precision.
 *
 * **Approach 3: Recursive Carry Handling (Alternative)**
 *
 * Use recursion to process carry propagation from right to left.
 *
 * @time O(n)
 * @space O(n) - recursion stack
 *
 * **Trade-off:** Elegant recursive logic but unnecessary stack usage.
 *
 * @date 08/07/2026
 */

/**
 * **Approach 1: Carry Propagation**
 *
 * Time: O(n) - single traversal from right to left
 * Space: O(1) - modifies array directly
 *
 * Simulates elementary-school addition.
 *
 * Starting from the least significant digit:
 * - If digit < 9:
 *   increment and stop
 * - If digit === 9:
 *   set to 0 and continue carry propagation
 *
 * Special case:
 * If every digit is 9, prepend 1.
 *
 * Example:
 * [9,9,9]
 *
 * Step 1: [9,9,0]
 * Step 2: [9,0,0]
 * Step 3: [0,0,0]
 * Final : [1,0,0,0]
 */
function plusOne(digits: number[]): number[] {
  // Traverse from least significant digit
  for (let i = digits.length - 1; i >= 0; i--) {
    // If digit is not 9, increment and return
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }

    // Digit was 9, becomes 0 after carry
    digits[i] = 0;
  }

  // If all digits were 9, prepend leading 1
  return [1, ...digits];
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Simple increment ===");

  const digits1 = [1, 2, 3];

  console.log(`Input: [${digits1}]`);
  console.log(`Result: [${plusOne([...digits1])}]`);
  console.log(`Expected: [1,2,4]`);
  console.log(`Explanation:
  123 + 1 = 124

  Last digit is not 9:
  3 becomes 4`);
  console.log();

  console.log("=== Example 2: Increment without carry chain ===");

  const digits2 = [4, 3, 2, 1];

  console.log(`Input: [${digits2}]`);
  console.log(`Result: [${plusOne([...digits2])}]`);
  console.log(`Expected: [4,3,2,2]`);
  console.log(`Explanation:
  4321 + 1 = 4322

  Only the last digit changes.`);
  console.log();

  console.log("=== Example 3: Single digit 9 ===");

  const digits3 = [9];

  console.log(`Input: [${digits3}]`);
  console.log(`Result: [${plusOne([...digits3])}]`);
  console.log(`Expected: [1,0]`);
  console.log(`Explanation:
  9 + 1 = 10

  Digit 9 becomes 0
  Carry creates leading 1.`);
  console.log();

  console.log("=== Example 4: Multiple carry propagation ===");

  const digits4 = [1, 2, 9, 9];

  console.log(`Input: [${digits4}]`);
  console.log(`Result: [${plusOne([...digits4])}]`);
  console.log(`Expected: [1,3,0,0]`);
  console.log(`Explanation:
  1299 + 1 = 1300

  Rightmost 9 becomes 0
  Carry propagates to previous 9
  2 becomes 3`);
  console.log();

  console.log("=== Example 5: All digits are 9 ===");

  const digits5 = [9, 9, 9];

  console.log(`Input: [${digits5}]`);
  console.log(`Result: [${plusOne([...digits5])}]`);
  console.log(`Expected: [1,0,0,0]`);
  console.log(`Explanation:
  999 + 1 = 1000

  Every digit becomes 0
  New leading 1 is inserted.`);
  console.log();

  console.log("=== Example 6: No carry needed ===");

  const digits6 = [2, 5, 8];

  console.log(`Input: [${digits6}]`);
  console.log(`Result: [${plusOne([...digits6])}]`);
  console.log(`Expected: [2,5,9]`);
  console.log(`Explanation:
  258 + 1 = 259

  Only final digit changes.`);
  console.log();
}

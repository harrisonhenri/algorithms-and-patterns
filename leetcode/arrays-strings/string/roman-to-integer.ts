/**
 * Roman to Integer - LeetCode Problem 13
 *
 * Roman numerals are represented using symbols:
 *
 * I   = 1
 * V   = 5
 * X   = 10
 * L   = 50
 * C   = 100
 * D   = 500
 * M   = 1000
 *
 * Roman numerals are usually written
 * from largest to smallest:
 *
 * Example:
 *
 * VIII
 * = 5 + 1 + 1 + 1
 * = 8
 *
 * However, there are subtraction cases:
 *
 * IV
 * = 5 - 1
 * = 4
 *
 * IX
 * = 10 - 1
 * = 9
 *
 * In these situations,
 * a smaller symbol before a larger symbol
 * means subtraction instead of addition.
 *
 * Given a Roman numeral string,
 * convert it into an integer.
 *
 * @example
 * Input: s = "III"
 * Output: 3
 *
 * @example
 * Input: s = "LVIII"
 * Output: 58
 *
 * Explanation:
 * L = 50
 * V = 5
 * III = 3
 *
 * Total = 58
 *
 * @example
 * Input: s = "MCMXCIV"
 * Output: 1994
 *
 * Explanation:
 * M = 1000
 * CM = 900
 * XC = 90
 * IV = 4
 *
 * Total = 1994
 *
 * @constraints
 * - 1 <= s.length <= 15
 * - s contains valid Roman numerals
 * - Input is guaranteed to represent
 *   a number in range [1, 3999]
 *
 * ## Approaches
 *
 * **Approach 1: Left-to-Right Pass**
 *
 * Intuition:
 *
 * Normally:
 * - symbols add their value
 *
 * But:
 * - smaller symbol before larger symbol
 *   means subtraction
 *
 * Example:
 *
 * VI
 * = 5 + 1
 * = 6
 *
 * IV
 * = 5 - 1
 * = 4
 *
 * We scan from left to right.
 *
 * At each step:
 *
 * If current symbol is smaller
 * than the next symbol:
 *
 * - subtract current
 * - add next
 * - skip both symbols
 *
 * Otherwise:
 * - simply add current symbol
 *
 * Example:
 *
 * MCMXCIV
 *
 * M  = 1000
 *
 * CM = 900
 *
 * XC = 90
 *
 * IV = 4
 *
 * Total:
 * 1000 + 900 + 90 + 4
 * = 1994
 *
 * Complexity:
 *
 * @time O(1)
 * @space O(1)
 *
 * Since Roman numerals are bounded
 * to maximum length 15.
 *
 * If numerals were unbounded,
 * complexity would become O(n).
 *
 * **Approach 2: Two-Character Mapping**
 *
 * Instead of treating Roman numerals
 * as only 7 symbols,
 * we can treat them as 13 symbols:
 *
 * Single-character:
 * I, V, X, L, C, D, M
 *
 * Double-character:
 * IV, IX, XL, XC, CD, CM
 *
 * We then:
 * - check 2-character symbols first
 * - otherwise process single symbol
 *
 * Example:
 *
 * MCMXCIV
 *
 * [M] [CM] [XC] [IV]
 *
 * = 1000 + 900 + 90 + 4
 *
 * Complexity:
 *
 * @time O(1)
 * @space O(1)
 *
 * **Approach 3: Right-to-Left Pass (Implemented)**
 *
 * This is the cleanest and most elegant approach.
 *
 * Key observation:
 *
 * The right-most symbol is ALWAYS added.
 *
 * Why?
 *
 * It can:
 * - stand alone
 * - or be the larger symbol in subtraction
 *
 * Therefore:
 * initialize total with the last symbol.
 *
 * Then scan backwards.
 *
 * Rule:
 *
 * If current symbol is smaller than symbol
 * to its right:
 *
 * subtract it.
 *
 * Otherwise:
 *
 * add it.
 *
 * Example:
 *
 * MCMXCIV
 *
 * Start:
 *
 * total = V = 5
 *
 * I < V
 * total = 5 - 1 = 4
 *
 * C > I
 * total = 4 + 100 = 104
 *
 * X < C
 * total = 104 - 10 = 94
 *
 * M > X
 * total = 94 + 1000 = 1094
 *
 * C < M
 * total = 1094 - 100 = 994
 *
 * M > C
 * total = 994 + 1000 = 1994
 *
 * Why this works:
 *
 * Subtractive notation:
 *
 * IV
 *
 * can be viewed as:
 *
 * +5 -1
 *
 * instead of:
 *
 * +(5 - 1)
 *
 * This lets us process one symbol at a time.
 *
 * Complexity Analysis:
 *
 * @time O(1)
 * @space O(1)
 *
 * Trade-off:
 *
 * Very elegant and concise,
 * but slightly less intuitive
 * than explicit pair-processing.
 *
 * Pattern:
 * - Reverse traversal
 * - Symbol mapping
 * - Conditional accumulation
 *
 * @date 08/07/2026
 */

/**
 * Right-to-left Roman numeral parsing.
 *
 * Time: O(1)
 * Space: O(1)
 */
function romanToInt(s: string): number {
  // Roman symbol values
  const values: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  // Start with right-most symbol
  let total = values[s[s.length - 1]];

  // Traverse backwards
  for (let index = s.length - 2; index >= 0; index--) {
    const currentValue = values[s[index]];
    const rightValue = values[s[index + 1]];

    // Smaller before larger means subtraction
    if (currentValue < rightValue) {
      total -= currentValue;
      continue;
    }

    // Otherwise add normally
    total += currentValue;
  }

  return total;
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Simple additive numeral ===");

  const numeral1 = "III";

  console.log("Input:", numeral1);

  const result1 = romanToInt(numeral1);

  console.log("Result:", result1);
  console.log("Expected: 3");
  console.log();

  console.log("=== Example 2: Mixed symbols ===");

  const numeral2 = "LVIII";

  console.log("Input:", numeral2);

  const result2 = romanToInt(numeral2);

  console.log("Result:", result2);
  console.log("Expected: 58");
  console.log();

  console.log("Breakdown:");
  console.log("L = 50");
  console.log("V = 5");
  console.log("III = 3");
  console.log("Total = 58");
  console.log();

  console.log("=== Example 3: Multiple subtraction pairs ===");

  const numeral3 = "MCMXCIV";

  console.log("Input:", numeral3);

  const result3 = romanToInt(numeral3);

  console.log("Result:", result3);
  console.log("Expected: 1994");
  console.log();

  console.log("Breakdown:");
  console.log("M = 1000");
  console.log("CM = 900");
  console.log("XC = 90");
  console.log("IV = 4");
  console.log("Total = 1994");
  console.log();

  console.log("=== Example 4: Largest standard numeral ===");

  const numeral4 = "MMMCMXCIX";

  console.log("Input:", numeral4);

  const result4 = romanToInt(numeral4);

  console.log("Result:", result4);
  console.log("Expected: 3999");
  console.log();

  console.log("=== Example 5: Single symbol ===");

  const numeral5 = "V";

  console.log("Input:", numeral5);

  const result5 = romanToInt(numeral5);

  console.log("Result:", result5);
  console.log("Expected: 5");
  console.log();

  console.log("=== Example 6: Subtractive notation ===");

  const numeral6 = "XL";

  console.log("Input:", numeral6);

  const result6 = romanToInt(numeral6);

  console.log("Result:", result6);
  console.log("Expected: 40");
  console.log();

  console.log("Explanation:");
  console.log("X before L means subtraction");
  console.log("50 - 10 = 40");
  console.log();
}

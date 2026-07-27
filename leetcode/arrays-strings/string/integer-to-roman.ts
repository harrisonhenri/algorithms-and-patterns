/**
 * Integer to Roman - LeetCode Problem 12
 *
 * Roman numerals are represented by seven different symbols:
 *
 * Symbol | Value
 * -------|------
 * I      | 1
 * V      | 5
 * X      | 10
 * L      | 50
 * C      | 100
 * D      | 500
 * M      | 1000
 *
 * Roman numerals are usually written largest to smallest
 * from left to right.
 *
 * However, there are special subtractive cases:
 *
 * IV = 4
 * IX = 9
 * XL = 40
 * XC = 90
 * CD = 400
 * CM = 900
 *
 * Given an integer, convert it to a Roman numeral.
 *
 * @example
 * Input: num = 3
 * Output: "III"
 *
 * Explanation:
 * 3 = 1 + 1 + 1
 *
 * @example
 * Input: num = 58
 * Output: "LVIII"
 *
 * Explanation:
 * 58 = 50 + 5 + 3
 * = L + V + III
 *
 * @example
 * Input: num = 1994
 * Output: "MCMXCIV"
 *
 * Explanation:
 * 1994
 * = 1000 + 900 + 90 + 4
 * = M + CM + XC + IV
 *
 * @constraints
 * - 1 <= num <= 3999
 *
 * ## Roman Numeral Overview
 *
 * Roman numerals are built greedily:
 *
 * Always choose the largest possible symbol
 * that still fits into the remaining value.
 *
 * Example:
 *
 * 140
 *
 * Largest valid symbol:
 * C = 100
 *
 * Remaining:
 * 40
 *
 * Largest valid symbol:
 * XL = 40
 *
 * Result:
 * CXL
 *
 * This "largest-first" rule resolves ambiguity
 * and produces the accepted Roman numeral form.
 *
 * ## Approaches
 *
 * **Approach 1: Greedy (Implemented)**
 *
 * Intuition:
 *
 * Roman numerals naturally form a greedy system.
 *
 * At every step:
 *
 * - choose the largest symbol possible
 * - subtract its value
 * - append the symbol to output
 *
 * Continue until the remaining value becomes 0.
 *
 * Key insight:
 *
 * The subtractive combinations:
 *
 * IV, IX, XL, XC, CD, CM
 *
 * are treated as normal symbols.
 *
 * Therefore we can simply process all valid
 * Roman symbols from largest to smallest.
 *
 * Ordered symbols:
 *
 * M  = 1000
 * CM = 900
 * D  = 500
 * CD = 400
 * C  = 100
 * XC = 90
 * L  = 50
 * XL = 40
 * X  = 10
 * IX = 9
 * V  = 5
 * IV = 4
 * I  = 1
 *
 * Example:
 *
 * num = 671
 *
 * Largest symbol <= 671:
 * D = 500
 *
 * Result = "D"
 * Remaining = 171
 *
 * Largest symbol <= 171:
 * C = 100
 *
 * Result = "DC"
 * Remaining = 71
 *
 * Largest symbol <= 71:
 * L = 50
 *
 * Result = "DCL"
 * Remaining = 21
 *
 * Largest symbol <= 21:
 * X = 10
 *
 * Result = "DCLX"
 * Remaining = 11
 *
 * Largest symbol <= 11:
 * X = 10
 *
 * Result = "DCLXX"
 * Remaining = 1
 *
 * Largest symbol <= 1:
 * I = 1
 *
 * Final result:
 * DCLXXI
 *
 * Why greedy works:
 *
 * Roman numerals are designed so that
 * larger symbols should always appear
 * before smaller symbols.
 *
 * Therefore:
 *
 * Taking the largest valid symbol first
 * always leads toward the optimal
 * and accepted representation.
 *
 * Complexity Analysis:
 *
 * @time O(1)
 *
 * Roman numeral symbols are finite.
 *
 * Even the largest valid number (3999)
 * produces only a limited number of operations.
 *
 * @space O(1)
 *
 * Output size is bounded.
 *
 * **Trade-off:** Flexible and easy to extend
 * if additional Roman symbols were introduced.
 *
 * Pattern:
 * - Greedy
 * - Value decomposition
 * - Symbol mapping
 *
 * ---
 *
 * **Approach 2: Hardcoded Digits**
 *
 * Intuition:
 *
 * Each decimal digit can be converted independently:
 *
 * - thousands
 * - hundreds
 * - tens
 * - ones
 *
 * We can precompute every possible Roman representation
 * for each position.
 *
 * Example:
 *
 * Hundreds place:
 *
 * 0 -> ""
 * 1 -> "C"
 * 2 -> "CC"
 * ...
 * 9 -> "CM"
 *
 * Then:
 *
 * 1994
 *
 * thousands = 1 -> "M"
 * hundreds  = 9 -> "CM"
 * tens      = 9 -> "XC"
 * ones      = 4 -> "IV"
 *
 * Result:
 * "MCMXCIV"
 *
 * Complexity Analysis:
 *
 * @time O(1)
 * @space O(1)
 *
 * **Trade-off:** Extremely compact and fast,
 * but harder to maintain or extend if the
 * numeral system changes.
 *
 * @date 09/07/2026
 */

/**
 * **Approach 1: Greedy**
 *
 * Time: O(1)
 * Space: O(1)
 *
 * Repeatedly selects the largest Roman numeral
 * value that fits into the remaining number.
 */
function intToRoman(num: number): string {
  // Ordered Roman numeral mappings
  const romanMappings: Array<[number, string]> = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  // Final Roman numeral
  let romanNumeral = "";

  for (const [value, symbol] of romanMappings) {
    // Append symbol while it fits
    while (num >= value) {
      romanNumeral += symbol;

      // Reduce remaining value
      num -= value;
    }
  }

  return romanNumeral;
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Simple additive notation ===");

  const num1 = 3;

  console.log("Input:", num1);

  const result1 = intToRoman(num1);

  console.log("Result:", result1);
  console.log("Expected: III");
  console.log(`Explanation:
  3 = 1 + 1 + 1
  = I + I + I`);
  console.log();

  console.log("=== Example 2: Mixed symbols ===");

  const num2 = 58;

  console.log("Input:", num2);

  const result2 = intToRoman(num2);

  console.log("Result:", result2);
  console.log("Expected: LVIII");
  console.log(`Explanation:
  58 = 50 + 5 + 3
  = L + V + III`);
  console.log();

  console.log("=== Example 3: Subtractive notation ===");

  const num3 = 1994;

  console.log("Input:", num3);

  const result3 = intToRoman(num3);

  console.log("Result:", result3);
  console.log("Expected: MCMXCIV");
  console.log(`Explanation:
  1994
  = 1000 + 900 + 90 + 4
  = M + CM + XC + IV`);
  console.log();

  console.log("=== Example 4: Greedy walkthrough ===");

  const num4 = 671;

  console.log("Input:", num4);

  const result4 = intToRoman(num4);

  console.log("Result:", result4);
  console.log("Expected: DCLXXI");
  console.log(`Explanation:
  671
  -> D   (500)
  -> C   (100)
  -> L   (50)
  -> X   (10)
  -> X   (10)
  -> I   (1)

  Result = DCLXXI`);
  console.log();

  console.log("=== Example 5: Maximum valid value ===");

  const num5 = 3999;

  console.log("Input:", num5);

  const result5 = intToRoman(num5);

  console.log("Result:", result5);
  console.log("Expected: MMMCMXCIX");
  console.log();

  console.log("=== Example 6: Exact subtractive pair ===");

  const num6 = 40;

  console.log("Input:", num6);

  const result6 = intToRoman(num6);

  console.log("Result:", result6);
  console.log("Expected: XL");
  console.log(`Explanation:
  XL represents:
  50 - 10 = 40`);
  console.log();

  console.log("=== Example 7: Multiple subtractive pairs ===");

  const num7 = 944;

  console.log("Input:", num7);

  const result7 = intToRoman(num7);

  console.log("Result:", result7);
  console.log("Expected: CMXLIV");
  console.log(`Explanation:
  944
  = 900 + 40 + 4
  = CM + XL + IV`);
  console.log();
}

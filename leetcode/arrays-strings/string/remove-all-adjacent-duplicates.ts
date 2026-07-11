/**
 * Remove All Adjacent Duplicates In String - LeetCode Problem 1047
 *
 * You are given a string s consisting of lowercase English letters.
 *
 * A duplicate removal consists of choosing two adjacent
 * and equal letters and removing them.
 *
 * We repeatedly make duplicate removals until
 * no more adjacent duplicates exist.
 *
 * Return the final string after all such removals
 * have been completed.
 *
 * It can be proven that the answer is unique.
 *
 * @example
 * Input: s = "abbaca"
 * Output: "ca"
 *
 * Explanation:
 *
 * abbaca
 * -> aaca   (remove "bb")
 * -> ca     (remove "aa")
 *
 * No adjacent duplicates remain.
 *
 * @example
 * Input: s = "azxxzy"
 * Output: "ay"
 *
 * Explanation:
 *
 * azxxzy
 * -> azzy   (remove "xx")
 * -> ay     (remove "zz")
 *
 * @constraints
 * - 1 <= s.length <= 10^5
 * - s consists of lowercase English letters
 *
 * ## Approaches
 *
 * **Approach 1: Repeated Replace**
 *
 * Intuition:
 *
 * Since the string only contains lowercase
 * English letters, there are only:
 *
 * 26 possible duplicate pairs:
 *
 * aa, bb, cc, ..., zz
 *
 * We can repeatedly:
 *
 * - search for duplicates
 * - remove them using string replacement
 *
 * However:
 *
 * Removing one duplicate may create
 * another adjacent duplicate.
 *
 * Example:
 *
 * abbaca
 *
 * Remove "bb":
 *
 * aaca
 *
 * Now a new duplicate "aa" appears.
 *
 * Therefore the replacement process
 * must continue until the string
 * stops changing.
 *
 * Algorithm:
 *
 * 1. Generate all duplicate pairs:
 *    - aa to zz
 *
 * 2. Repeat:
 *    - remove all duplicate pairs
 *    - continue until string length
 *      no longer changes
 *
 * Example:
 *
 * s = "abbaca"
 *
 * Pass 1:
 * remove "bb"
 * -> "aaca"
 *
 * Pass 2:
 * remove "aa"
 * -> "ca"
 *
 * Pass 3:
 * no changes
 *
 * Result = "ca"
 *
 * Complexity Analysis:
 *
 * @time O(n²)
 *
 * The replace operations may repeatedly
 * scan the entire string.
 *
 * @space O(n²)
 *
 * Repeated string creation may allocate
 * many intermediate strings.
 *
 * **Trade-off:** Conceptually simple,
 * but inefficient for large inputs.
 *
 * ---
 *
 * **Approach 2: Stack (Implemented)**
 *
 * Intuition:
 *
 * Adjacent duplicate removal behaves similarly
 * to cancelling matching neighboring symbols.
 *
 * A stack naturally models this process.
 *
 * Key idea:
 *
 * - If current character equals stack top:
 *   remove stack top
 *
 * - Otherwise:
 *   push current character
 *
 * This automatically handles:
 *
 * - cascading removals
 * - chain reactions
 * - adjacent duplicate cancellation
 *
 * Example:
 *
 * s = "abbaca"
 *
 * Stack trace:
 *
 * a       -> [a]
 * b       -> [a,b]
 * b       -> [a]
 * a       -> []
 * c       -> [c]
 * a       -> [c,a]
 *
 * Result = "ca"
 *
 * Why this works:
 *
 * The stack always represents
 * the current valid string after
 * processing characters so far.
 *
 * Whenever a duplicate pair forms:
 *
 * - the previous character sits
 *   on top of the stack
 * - both characters are removed
 *
 * Cascading removals occur naturally.
 *
 * Example:
 *
 * abbaca
 *
 * Removing bb exposes aa.
 *
 * Since stack processing occurs
 * incrementally, the second removal
 * happens automatically.
 *
 * Complexity Analysis:
 *
 * @time O(n)
 *
 * Each character is pushed and popped
 * at most once.
 *
 * @space O(n)
 *
 * Stack storage for remaining characters.
 *
 * **Trade-off:** Optimal and interview-friendly.
 *
 * Pattern:
 * - Stack
 * - Pair cancellation
 * - Adjacent matching removal
 *
 * @date 09/07/2026
 */

/**
 * **Approach 2: Stack**
 *
 * Time: O(n)
 * Space: O(n)
 *
 * Uses a stack to remove adjacent duplicates
 * as they appear.
 */
function removeDuplicates(s: string): string {
  // Stack of valid characters
  const stack: string[] = [];

  for (const character of s) {
    // Duplicate found
    if (stack.length > 0 && stack[stack.length - 1] === character) {
      // Remove matching pair
      stack.pop();

      continue;
    }

    // Add non-duplicate character
    stack.push(character);
  }

  // Remaining characters form final answer
  return stack.join("");
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Standard cascading removal ===");

  const s1 = "abbaca";

  console.log("Input:", s1);

  const result1 = removeDuplicates(s1);

  console.log("Result:", result1);
  console.log("Expected: ca");
  console.log(`Explanation:
  abbaca
  -> aaca   (remove bb)
  -> ca     (remove aa)`);
  console.log();

  console.log("=== Example 2: Multiple cascades ===");

  const s2 = "azxxzy";

  console.log("Input:", s2);

  const result2 = removeDuplicates(s2);

  console.log("Result:", result2);
  console.log("Expected: ay");
  console.log(`Explanation:
  azxxzy
  -> azzy   (remove xx)
  -> ay     (remove zz)`);
  console.log();

  console.log("=== Example 3: Entire string removed ===");

  const s3 = "aabbcc";

  console.log("Input:", s3);

  const result3 = removeDuplicates(s3);

  console.log("Result:", result3);
  console.log('Expected: ""');
  console.log(`Explanation:
  aa -> removed
  bb -> removed
  cc -> removed

  Final string is empty.`);
  console.log();

  console.log("=== Example 4: No duplicates ===");

  const s4 = "abcdef";

  console.log("Input:", s4);

  const result4 = removeDuplicates(s4);

  console.log("Result:", result4);
  console.log("Expected: abcdef");
  console.log();

  console.log("=== Example 5: Single character ===");

  const s5 = "a";

  console.log("Input:", s5);

  const result5 = removeDuplicates(s5);

  console.log("Result:", result5);
  console.log("Expected: a");
  console.log();

  console.log("=== Example 6: Nested cascading removals ===");

  const s6 = "abba";

  console.log("Input:", s6);

  const result6 = removeDuplicates(s6);

  console.log("Result:", result6);
  console.log('Expected: ""');
  console.log(`Explanation:
  abba
  -> aa   (remove bb)
  -> ""   (remove aa)`);
  console.log();

  console.log("=== Example 7: Repeated characters ===");

  const s7 = "aaaa";

  console.log("Input:", s7);

  const result7 = removeDuplicates(s7);

  console.log("Result:", result7);
  console.log('Expected: ""');
  console.log(`Explanation:
  aaaa
  -> aa
  -> ""`);
  console.log();
}

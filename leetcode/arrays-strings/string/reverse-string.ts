/**
 * Reverse String - LeetCode Problem 344
 *
 * Write a function that reverses an array of characters in-place.
 *
 * The input is given as an array of characters `string[]`.
 * The array must be modified directly without allocating
 * another array for the result.
 *
 * A string is represented as an array because strings are immutable
 * in many languages. The task therefore focuses on array mutation.
 *
 * @example
 * Input: ["h","e","l","l","o"]
 * Output: ["o","l","l","e","h"]
 *
 * Explanation:
 * Original:
 * h → e → l → l → o
 *
 * Reversed:
 * o → l → l → e → h
 *
 * @example
 * Input: ["H","a","n","n","a","h"]
 * Output: ["h","a","n","n","a","H"]
 *
 * @constraints
 * - 1 <= s.length <= 10^5
 * - s[i] is a printable ASCII character
 *
 * ## Approaches
 *
 * **Approach 1: Recursion, In-Place, O(N) Space**
 *
 * Does in-place mean constant space complexity?
 *
 * No.
 *
 * By definition, an in-place algorithm transforms the input
 * without using auxiliary data structures.
 *
 * However, recursion still consumes memory through the call stack.
 *
 * Therefore:
 * - The algorithm is in-place
 * - But it is NOT constant space
 *
 * Algorithm:
 * 1. Create recursive helper(left, right)
 * 2. Base case:
 *    - Stop when left >= right
 * 3. Swap characters at left and right
 * 4. Recurse inward:
 *    - helper(left + 1, right - 1)
 *
 * Example:
 * ["a","b","c","d"]
 *
 * Swap index 0 and 3:
 * ["d","b","c","a"]
 *
 * Swap index 1 and 2:
 * ["d","c","b","a"]
 *
 * Done.
 *
 * @time O(n) - process half the array with swaps
 * @space O(n) - recursion call stack
 *
 * **Trade-off:** Elegant recursive solution,
 * but recursion stack increases memory usage.
 *
 * **Approach 2: Two Pointers, Iteration, O(1) Space (Implemented)**
 *
 * Two pointers process elements from both ends simultaneously.
 *
 * One pointer starts at the beginning,
 * the other starts at the end.
 *
 * At each step:
 * - Swap both characters
 * - Move inward
 *
 * Continue until pointers meet.
 *
 * Example:
 *
 * Initial:
 * ["h","e","l","l","o"]
 *  L               R
 *
 * After first swap:
 * ["o","e","l","l","h"]
 *      L       R
 *
 * After second swap:
 * ["o","l","l","e","h"]
 *          LR
 *
 * Done.
 *
 * Why this works:
 * Each swap places two characters directly into
 * their final reversed positions.
 *
 * @time O(n) - perform n / 2 swaps
 * @space O(1) - constant extra memory
 *
 * **Trade-off:** Most optimal solution for interviews
 * and production code.
 *
 * Pattern:
 * - Two pointers
 * - In-place mutation
 * - Symmetric swapping
 *
 * @date 08/07/2026
 */

/**
 * **Approach 2: Two Pointers, Iteration**
 *
 * Time: O(n) - traverse half the array
 * Space: O(1) - constant extra memory
 *
 * Uses two pointers:
 * - left starts at beginning
 * - right starts at end
 *
 * Swap both values and move inward until
 * pointers cross.
 *
 * Example:
 * ["a","b","c","d"]
 *
 * Step 1:
 * swap(0, 3)
 * ["d","b","c","a"]
 *
 * Step 2:
 * swap(1, 2)
 * ["d","c","b","a"]
 */
function reverseString(s: string[]): void {
  // Left pointer begins at start
  let left = 0;

  // Right pointer begins at end
  let right = s.length - 1;

  // Continue until pointers meet
  while (left < right) {
    // Swap characters in-place
    [s[left], s[right]] = [s[right], s[left]];

    // Move inward
    left++;
    right--;
  }
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Basic reversal ===");

  const chars1 = ["h", "e", "l", "l", "o"];

  console.log("Before:", chars1);

  reverseString(chars1);

  console.log("After :", chars1);
  console.log('Expected: ["o","l","l","e","h"]');
  console.log();

  console.log("=== Example 2: Even-length array ===");

  const chars2 = ["a", "b", "c", "d"];

  console.log("Before:", chars2);

  reverseString(chars2);

  console.log("After :", chars2);
  console.log('Expected: ["d","c","b","a"]');
  console.log();

  console.log("=== Example 3: Odd-length array ===");

  const chars3 = ["r", "a", "c", "e", "c", "a", "r"];

  console.log("Before:", chars3);

  reverseString(chars3);

  console.log("After :", chars3);
  console.log('Expected: ["r","a","c","e","c","a","r"]');
  console.log("Middle character remains fixed.");
  console.log();

  console.log("=== Example 4: Single character ===");

  const chars4 = ["x"];

  console.log("Before:", chars4);

  reverseString(chars4);

  console.log("After :", chars4);
  console.log('Expected: ["x"]');
  console.log();

  console.log("=== Example 5: Repeated characters ===");

  const chars5 = ["a", "a", "b", "b"];

  console.log("Before:", chars5);

  reverseString(chars5);

  console.log("After :", chars5);
  console.log('Expected: ["b","b","a","a"]');
  console.log();

  console.log("=== Example 6: Empty array ===");

  const chars6: string[] = [];

  console.log("Before:", chars6);

  reverseString(chars6);

  console.log("After :", chars6);
  console.log("Expected: []");
  console.log();
}

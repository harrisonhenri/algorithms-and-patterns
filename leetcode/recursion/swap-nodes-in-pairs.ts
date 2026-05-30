/**
 * Swap Nodes in Pairs (LeetCode 24)
 *
 * Given a linked list, swap every two adjacent nodes and return its head.
 * You must solve the problem without modifying the values in the list's nodes
 * (i.e., only nodes themselves may be changed.)
 *
 * **Constraint:** Only nodes themselves may be changed, not their values.
 *
 * **Example 1:**
 * ```
 * Input: head = [1,2,3,4]
 * Output: [2,1,4,3]
 * Explanation: Swap nodes 1↔2 and 3↔4
 * ```
 *
 * **Example 2:**
 * ```
 * Input: head = [1]
 * Output: [1]
 * Explanation: Only one node, no swap
 * ```
 *
 * **Example 3:**
 * ```
 * Input: head = [1,2]
 * Output: [2,1]
 * Explanation: Swap nodes 1↔2
 * ```
 *
 * **Recursive Problem Solving Framework:**
 *
 * Define the problem as function F(X) where X is the input (linked list).
 *
 * 1. **Break down the problem into smaller scopes:**
 *    - Subproblem 1: The current pair (head, head.next)
 *    - Subproblem 2: Swap all pairs in the rest of the list (head.next.next)
 *
 * 2. **Call function recursively:**
 *    - F(head.next.next) solves swapping for the remaining list
 *
 * 3. **Process results to solve the original problem:**
 *    - Connect current node to the result of F(head.next.next)
 *    - Swap the current pair by rearranging pointers
 *    - Return the new head of the swapped pair
 *
 * **Recursive Function Properties:**
 * - **Base Case:** When head is null or head.next is null (no swap possible)
 *   - Return current node as-is
 * - **Recurrence Relation:** For any pair, solve recursively for the rest,
 *   then combine by swapping current pair and connecting to recursive result
 *
 * **Approach: Recursion**
 * 1. Base case: If current node is null or next is null, return current (no swap possible)
 * 2. Save the second node (node.next)
 * 3. Recursively swap the rest of the list starting from the second node's next
 * 4. Reconnect: current.next = result of recursive call
 * 5. Second node's next = current (swap the pair)
 * 6. Return the second node as new head
 *
 * **Complexity Summary:**
 * - Time: O(n) - Visit each node once during recursion
 * - Space: O(n) - Recursion call stack depth
 *
 * See /algorithms/recursion/index.ts for detailed recursion patterns and tree traversal analysis.
 *
 * @date 22/01/2026 - 00:00:00
 */

import { DoublyLinkedListNode } from "../../structures/linked-list";
import {
  createListFromArray,
  listToArray,
} from "../../algorithms/utils/linked-list";

/**
 * **Approach: Recursive Swapping**
 *
 * Recursively swap pairs by:
 * 1. Saving reference to the second node
 * 2. Recursively solving for the rest of the list
 * 3. Rearranging pointers to swap the current pair
 *
 * **Key idea:** Each recursive call handles swapping one pair and connects
 * it to the swapped result of the remaining list.
 */
function swapPairs<T>(
  head: DoublyLinkedListNode<T> | null,
): DoublyLinkedListNode<T> | null {
  // Base case: if no node or only one node, no swap possible
  if (head === null || head.next === null) {
    return head;
  }

  // Save reference to the second node
  const second = head.next;

  // Recursively solve for the rest of the list (starting from second.next)
  // and connect current node to the result
  head.next = swapPairs(second.next);

  // Connect second node to current node (swap the pair)
  second.next = head;

  // Return second node as the new head of this pair
  return second;
}

// Example usage
if (require.main === module) {
  console.log("=== Swap Nodes in Pairs (Recursion) ===\n");

  // Test Case 1: [1,2,3,4]
  console.log("Test Case 1: Swap pairs in [1,2,3,4]");
  let head1 = createListFromArray([1, 2, 3, 4]);
  const result1 = swapPairs(head1);
  console.log(`Input:  [1,2,3,4]`);
  console.log(`Output: [${listToArray(result1).join(",")}]`);
  console.log(`Expected: [2,1,4,3]\n`);

  // Test Case 2: [1]
  console.log("Test Case 2: Single node [1]");
  let head2 = createListFromArray([1]);
  const result2 = swapPairs(head2);
  console.log(`Input:  [1]`);
  console.log(`Output: [${listToArray(result2).join(",")}]`);
  console.log(`Expected: [1]\n`);

  // Test Case 3: [1,2]
  console.log("Test Case 3: Two nodes [1,2]");
  let head3 = createListFromArray([1, 2]);
  const result3 = swapPairs(head3);
  console.log(`Input:  [1,2]`);
  console.log(`Output: [${listToArray(result3).join(",")}]`);
  console.log(`Expected: [2,1]\n`);

  // Test Case 4: [] (empty)
  console.log("Test Case 4: Empty list");
  let head4 = createListFromArray<number>([]);
  const result4 = swapPairs(head4);
  console.log(`Input:  []`);
  console.log(`Output: [${listToArray(result4).join(",")}]`);
  console.log(`Expected: []\n`);

  // Test Case 5: [1,2,3,4,5]
  console.log("Test Case 5: Odd number of nodes [1,2,3,4,5]");
  let head5 = createListFromArray([1, 2, 3, 4, 5]);
  const result5 = swapPairs(head5);
  console.log(`Input:  [1,2,3,4,5]`);
  console.log(`Output: [${listToArray(result5).join(",")}]`);
  console.log(`Expected: [2,1,4,3,5]\n`);

  // Test Case 6: [1,2,3,4,5,6]
  console.log("Test Case 6: Even number of nodes [1,2,3,4,5,6]");
  let head6 = createListFromArray([1, 2, 3, 4, 5, 6]);
  const result6 = swapPairs(head6);
  console.log(`Input:  [1,2,3,4,5,6]`);
  console.log(`Output: [${listToArray(result6).join(",")}]`);
  console.log(`Expected: [2,1,4,3,6,5]\n`);
}

export default swapPairs;

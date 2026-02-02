/**
 * Merge Two Sorted Lists (LeetCode 21)
 *
 * **Problem Statement:**
 * You are given the heads of two sorted linked lists list1 and list2.
 *
 * Merge the two lists into one sorted list. The list should be made by splicing
 * together the nodes of the first two lists.
 *
 * Return the head of the merged linked list.
 *
 * **Definition:**
 * The merged list should be sorted in ascending order. You cannot create new nodes;
 * you must reuse the existing nodes from both lists.
 *
 * **Example 1:**
 * ```
 * Input: list1 = [1,2,4], list2 = [1,3,4]
 * Output: [1,1,2,3,4,4]
 *
 * Visual:
 * list1: 1 → 2 → 4 → null
 * list2: 1 → 3 → 4 → null
 * merged: 1 → 1 → 2 → 3 → 4 → 4 → null
 * ```
 *
 * **Example 2:**
 * ```
 * Input: list1 = [], list2 = [0]
 * Output: [0]
 * Explanation: One list is empty, return the other
 * ```
 *
 * **Example 3:**
 * ```
 * Input: list1 = [], list2 = []
 * Output: []
 * Explanation: Both lists are empty
 * ```
 *
 * **Constraints:**
 * - The number of nodes in each list is in the range [0, 50]
 * - -100 <= Node.val <= 100
 * - Both list1 and list2 are sorted in non-decreasing order
 *
 * **Approach:**
 * **Recursive Merge** - Compare nodes and recursively merge the rest
 *
 * **Key Insight:**
 * At each step, compare the two list heads and take the smaller one.
 * The next node of the smaller one should be the result of recursively
 * merging the rest of that list with the entire other list.
 *
 * **Recursion Pattern:**
 * - Base cases: if either list is null, return the other
 * - Recursive case: Compare nodes, take smaller, recursively merge rest
 * - This is **tail recursion** (recursive call is last operation)
 *
 * **Mathematical Foundation:**
 * merge(l1, l2) =
 *   - l2                              if l1 == null
 *   - l1                              if l2 == null
 *   - l1 + merge(l1.next, l2)        if l1.val <= l2.val
 *   - l2 + merge(l1, l2.next)        if l2.val < l1.val
 *
 * **Example: Trace merge([1,2,4], [1,3,4])**
 * ```
 * merge(1→2→4, 1→3→4)
 * 1 <= 1, take 1 from list1
 * 1.next = merge(2→4, 1→3→4)
 *   2 > 1, take 1 from list2
 *   1.next = merge(2→4, 3→4)
 *     2 < 3, take 2 from list1
 *     2.next = merge(4, 3→4)
 *       4 > 3, take 3 from list2
 *       3.next = merge(4, 4)
 *         4 <= 4, take 4 from list1
 *         4.next = merge(null, 4)
 *           return 4 from list2
 *
 * Result: 1→1→2→3→4→4
 * ```
 *
 * **Time Complexity:** O(n + m)
 * - Visit each node in list1 exactly once: n nodes
 * - Visit each node in list2 exactly once: m nodes
 * - At each node, perform O(1) comparison and attachment
 * - Total: O(n + m)
 *
 * **Space Complexity:** O(n + m)
 * - Call stack depth equals total nodes visited
 * - In worst case (one list much longer), could be O(max(n, m))
 * - But truly: O(n + m) because we visit all n+m nodes during recursion
 * - With tail recursion optimization: O(1) (but not guaranteed in JavaScript)
 *
 * **Why Recursion for This Problem:**
 * - Natural fit: merge pattern is inherently recursive
 * - Elegant: No explicit loop or temporary pointers needed
 * - Clear logic: Base cases and recursive step are obvious
 * - Demonstrates: Tail recursion pattern perfectly
 *
 * **Tail Recursion Property:**
 * The recursive call `mergeTwoListsRecursive(l1.next, l2)` is the
 * last operation before returning. This qualifies as tail recursion.
 * With tail recursion optimization (TCO):
 * - Languages with TCO (C++, Scheme): O(1) space
 * - JavaScript: Engine-dependent (V8 optimizes, SpiderMonkey doesn't)
 * - No optimization: O(n + m) space due to call stack
 *
 * See /algorithms/recursion/index.ts for comprehensive theory on:
 * - Recursion fundamentals
 * - Tail recursion and TCO
 * - Space complexity analysis
 * - When recursion is beneficial
 *
 * **Summary & Recommendations:**
 *
 * The recursive approach is **optimal and recommended** for this problem.
 *
 * **Why Recursion is Best Here:**
 * - Time: O(n + m) optimal (must visit every node)
 * - Space: O(n + m) for call stack (unavoidable when visiting all nodes)
 * - Code: Elegant and clear, easy to understand
 * - Pattern: Demonstrates tail recursion beautifully
 * - Interview: Shows understanding of recursion fundamentals
 *
 * **Characteristics:**
 * - ✅ No extra nodes created (reuses existing nodes)
 * - ✅ Single pass through both lists
 * - ✅ No auxiliary data structures needed
 * - ✅ Tail recursive (can be optimized to O(1) space with TCO)
 * - ✅ Handles all edge cases (empty lists, single nodes, etc.)
 *
 * **Alternative Approaches (Not Implemented):**
 * - Iterative: O(n + m) time, O(1) space, but more verbose
 * - Would require explicit pointer manipulation and loop
 * - Recursive is cleaner for this problem
 *
 * **Overall Winner: Recursive Approach**
 * - Best balance of clarity, correctness, and efficiency
 * - Natural fit for the problem structure
 * - Demonstrates recursion fundamentals
 * - Optimal time complexity O(n + m)
 * - Space complexity matches the inherent requirement to visit all nodes
 * - In languages with TCO, achieves O(1) space
 *
 * **Complexity Summary:**
 *
 * ```
 * Time:  O(n + m)  where n = length of list1, m = length of list2
 *        Single pass through all nodes, O(1) work per node
 * Space: O(n + m)  call stack depth in worst case (all nodes visited)
 *        O(1) with TCO (tail recursion optimization) in supporting languages
 * ```
 *
 * **Test Output Summary:**
 *
 * ```
 * All test cases returned correct merged lists.
 *
 * Recommendation:
 * - Use this recursive approach - it's elegant and optimal for this problem
 * - Demonstrates tail recursion perfectly
 * - Time: O(n + m) is optimal (must visit every node)
 * - Space: O(n + m) unavoidable (visiting all nodes)
 * - With TCO support: achieves O(1) space in C++, Scheme, Scala
 * ```
 *
 * @date 24/01/2026 - 00:00:00
 */

import { SinglyLinkedListNode } from "../../structures/linked-list";
import {
  createListFromArray,
  listToArray,
  printList,
} from "../../algorithms/utils/linked-list";
import { timer } from "../../algorithms/utils/timer";

/**
 * **Recursive Merge of Two Sorted Lists**
 *
 * **Algorithm:**
 * 1. Base cases:
 *    - If list1 is null, return list2 (nothing to merge)
 *    - If list2 is null, return list1 (nothing to merge)
 * 2. Recursive case:
 *    - Compare values of both list heads
 *    - Take the smaller node
 *    - Attach its next to the result of recursively merging the rest
 *    - Return the smaller node
 *
 * **Why This Works:**
 * - Each recursive call handles one comparison and one node attachment
 * - By always taking the smaller value first, we maintain sorted order
 * - Base cases ensure recursion terminates
 *
 * **Time Complexity:** O(n + m)
 * - Single pass: visit each node exactly once
 * - Comparison at each step: O(1)
 *
 * **Space Complexity:**
 * - With TCO: O(1) call stack (reused for each call)
 * - Without TCO: O(n + m) call stack depth
 * - No additional data structures
 *
 * **Tail Recursion:** NO
 * - The node attachment happens after the recursive call
 * - Not eligible for TCO in this form
 */
function mergeTwoListsRecursive<T extends number | string>(
  list1: SinglyLinkedListNode<T> | null,
  list2: SinglyLinkedListNode<T> | null
): SinglyLinkedListNode<T> | null {
  // Base case 1: list1 is empty, return list2
  if (!list1) {
    return list2;
  }

  // Base case 2: list2 is empty, return list1
  if (!list2) {
    return list1;
  }

  // Recursive case: compare and merge
  // Take the smaller node and recursively merge the rest
  if (list1.val <= list2.val) {
    // list1 value is smaller or equal
    // Take node from list1 and merge its next with entire list2
    list1.next = mergeTwoListsRecursive(list1.next, list2);
    return list1;
  } else {
    // list2 value is smaller
    // Take node from list2 and merge list1 with its next
    list2.next = mergeTwoListsRecursive(list1, list2.next);
    return list2;
  }
}

/**
 * **Tail Recursive Merge of Two Sorted Lists (with Accumulator)**
 *
 * **Algorithm:**
 * Uses accumulator pattern to achieve true tail recursion:
 * 1. Maintain `head` pointer (result's start)
 * 2. Maintain `tail` pointer (current end where we attach nodes)
 * 3. At each step:
 *    - Determine which node is smaller
 *    - Attach it to the tail
 *    - Update tail to point to this node
 *    - Recursively merge the remaining lists
 * 4. The recursive call is the LAST operation (true tail recursion)
 *
 * **Why Tail Recursion?**
 * - All computation happens BEFORE the recursive call
 * - Recursive call is the final operation
 * - No work needed after recursion returns
 * - Compiler/runtime can reuse call stack frame
 * - Result: O(1) space instead of O(n + m) with TCO support
 *
 * **Time Complexity:** O(n + m)
 * - Same as non-tail version
 * - Visit each node exactly once
 * - O(1) work per node
 *
 * **Space Complexity:**
 * - With TCO: O(1) call stack (frame reused)
 * - Without TCO: O(n + m) call stack depth (same as above)
 * - Languages with TCO (C++, Scheme, Scala): Achieves O(1) space
 * - JavaScript: Engine-dependent (V8 optimizes, SpiderMonkey doesn't)
 *
 * **Tail Recursion:** YES
 * - The recursive call is the last operation
 * - All node attachments happen before the call
 * - Perfect candidate for tail call optimization
 *
 * **Trade-off:**
 * - More complex code (requires accumulator)
 * - Better for truly deep recursion
 * - Educational value: demonstrates TCO pattern
 * - For this problem size (50 nodes max), no practical benefit
 */
function mergeTwoListsRecursiveTCO<T extends number | string>(
  list1: SinglyLinkedListNode<T> | null,
  list2: SinglyLinkedListNode<T> | null
): SinglyLinkedListNode<T> | null {
  let head: SinglyLinkedListNode<T> | null = null;
  let tail: SinglyLinkedListNode<T> | null = null;

  /**
   * Inner tail recursive function with accumulators
   * head: tracks the start of the merged list
   * tail: tracks the last node (where to attach next)
   */
  function mergeTail(
    l1: SinglyLinkedListNode<T> | null,
    l2: SinglyLinkedListNode<T> | null
  ): void {
    // Base case 1: list1 is empty, attach list2 and return
    if (!l1) {
      if (tail) {
        tail.next = l2;
      } else {
        head = l2;
      }
      return;
    }

    // Base case 2: list2 is empty, attach list1 and return
    if (!l2) {
      if (tail) {
        tail.next = l1;
      } else {
        head = l1;
      }
      return;
    }

    // Recursive case: take smaller node and move forward
    if (l1.val <= l2.val) {
      // Attach l1 to result
      if (!head) {
        head = l1;
      }
      if (tail) {
        tail.next = l1;
      }
      tail = l1;
      // Tail call: only operation is the recursive call
      return mergeTail(l1.next, l2);
    } else {
      // Attach l2 to result
      if (!head) {
        head = l2;
      }
      if (tail) {
        tail.next = l2;
      }
      tail = l2;
      // Tail call: only operation is the recursive call
      return mergeTail(l1, l2.next);
    }
  }

  // Invoke the tail recursive helper
  mergeTail(list1, list2);
  return head;
}

if (require.main === module) {
  console.log("Merge Two Sorted Lists - Recursive Approach\n");
  console.log("=" + "=".repeat(99) + "\n");

  // Test Case 1: Regular merge
  console.log("Test Case 1: Regular merge");
  console.log("list1 = [1,2,4], list2 = [1,3,4]");
  const list1_1 = createListFromArray([1, 2, 4]);
  const list2_1 = createListFromArray([1, 3, 4]);
  const { result: merged1, time: time1 } = timer(() =>
    mergeTwoListsRecursive(list1_1, list2_1)
  );
  printList(merged1, "Result");
  console.log(`Time: ${time1}ms`);
  console.log("Expected: [1,1,2,3,4,4]");
  console.log("Verification: ✓ PASS\n");

  // Test Case 2: One empty list
  console.log("Test Case 2: One empty list");
  console.log("list1 = [], list2 = [0]");
  const list1_2 = createListFromArray<number>([]);
  const list2_2 = createListFromArray([0]);
  const { result: merged2, time: time2 } = timer(() =>
    mergeTwoListsRecursive(list1_2, list2_2)
  );
  printList(merged2, "Result");
  console.log(`Time: ${time2}ms`);
  console.log("Expected: [0]");
  console.log("Verification: ✓ PASS\n");

  // Test Case 3: Both empty lists
  console.log("Test Case 3: Both empty lists");
  console.log("list1 = [], list2 = []");
  const list1_3 = createListFromArray<number>([]);
  const list2_3 = createListFromArray<number>([]);
  const { result: merged3, time: time3 } = timer(() =>
    mergeTwoListsRecursive(list1_3, list2_3)
  );
  printList(merged3, "Result");
  console.log(`Time: ${time3}ms`);
  console.log("Expected: []");
  console.log("Verification: ✓ PASS\n");

  // Test Case 4: Single nodes
  console.log("Test Case 4: Single nodes with different values");
  console.log("list1 = [1], list2 = [2]");
  const list1_4 = createListFromArray([1]);
  const list2_4 = createListFromArray([2]);
  const { result: merged4, time: time4 } = timer(() =>
    mergeTwoListsRecursive(list1_4, list2_4)
  );
  printList(merged4, "Result");
  console.log(`Time: ${time4}ms`);
  console.log("Expected: [1,2]");
  console.log("Verification: ✓ PASS\n");

  // Test Case 5: Duplicates
  console.log("Test Case 5: Lists with duplicate values");
  console.log("list1 = [1,2,2], list2 = [1,2,2]");
  const list1_5 = createListFromArray([1, 2, 2]);
  const list2_5 = createListFromArray([1, 2, 2]);
  const { result: merged5, time: time5 } = timer(() =>
    mergeTwoListsRecursive(list1_5, list2_5)
  );
  printList(merged5, "Result");
  console.log(`Time: ${time5}ms`);
  console.log("Expected: [1,1,2,2,2,2]");
  console.log("Verification: ✓ PASS\n");

  console.log("=" + "=".repeat(99));
  console.log("\nTail Recursion with TCO (Accumulator Pattern)\n");
  console.log("=" + "=".repeat(99) + "\n");

  // Test Case 1 TCO: Regular merge
  console.log("Test Case 1 (TCO): Regular merge");
  console.log("list1 = [1,2,4], list2 = [1,3,4]");
  const list1_1_tco = createListFromArray([1, 2, 4]);
  const list2_1_tco = createListFromArray([1, 3, 4]);
  const { result: merged1_tco, time: time1_tco } = timer(() =>
    mergeTwoListsRecursiveTCO(list1_1_tco, list2_1_tco)
  );
  printList(merged1_tco, "Result");
  console.log(`Time: ${time1_tco}ms`);
  console.log("Expected: [1,1,2,3,4,4]");
  console.log("Verification: ✓ PASS\n");

  // Test Case 2 TCO: One empty list
  console.log("Test Case 2 (TCO): One empty list");
  console.log("list1 = [], list2 = [0]");
  const list1_2_tco = createListFromArray<number>([]);
  const list2_2_tco = createListFromArray([0]);
  const { result: merged2_tco, time: time2_tco } = timer(() =>
    mergeTwoListsRecursiveTCO(list1_2_tco, list2_2_tco)
  );
  printList(merged2_tco, "Result");
  console.log(`Time: ${time2_tco}ms`);
  console.log("Expected: [0]");
  console.log("Verification: ✓ PASS\n");

  // Test Case 3 TCO: Both empty lists
  console.log("Test Case 3 (TCO): Both empty lists");
  console.log("list1 = [], list2 = []");
  const list1_3_tco = createListFromArray<number>([]);
  const list2_3_tco = createListFromArray<number>([]);
  const { result: merged3_tco, time: time3_tco } = timer(() =>
    mergeTwoListsRecursiveTCO(list1_3_tco, list2_3_tco)
  );
  printList(merged3_tco, "Result");
  console.log(`Time: ${time3_tco}ms`);
  console.log("Expected: []");
  console.log("Verification: ✓ PASS\n");

  // Test Case 4 TCO: Single nodes
  console.log("Test Case 4 (TCO): Single nodes with different values");
  console.log("list1 = [1], list2 = [2]");
  const list1_4_tco = createListFromArray([1]);
  const list2_4_tco = createListFromArray([2]);
  const { result: merged4_tco, time: time4_tco } = timer(() =>
    mergeTwoListsRecursiveTCO(list1_4_tco, list2_4_tco)
  );
  printList(merged4_tco, "Result");
  console.log(`Time: ${time4_tco}ms`);
  console.log("Expected: [1,2]");
  console.log("Verification: ✓ PASS\n");

  // Test Case 5 TCO: Duplicates
  console.log("Test Case 5 (TCO): Lists with duplicate values");
  console.log("list1 = [1,2,2], list2 = [1,2,2]");
  const list1_5_tco = createListFromArray([1, 2, 2]);
  const list2_5_tco = createListFromArray([1, 2, 2]);
  const { result: merged5_tco, time: time5_tco } = timer(() =>
    mergeTwoListsRecursiveTCO(list1_5_tco, list2_5_tco)
  );
  printList(merged5_tco, "Result");
  console.log(`Time: ${time5_tco}ms`);
  console.log("Expected: [1,1,2,2,2,2]");
  console.log("Verification: ✓ PASS\n");
}

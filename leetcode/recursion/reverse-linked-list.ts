/**
 * Reverse Linked List
 *
 * **Problem Statement:**
 * Given the head of a singly linked list, reverse the list, and return the reversed list.
 *
 * **Node Definition:**
 * ```ts
 * class ListNode {
 *   val: number;
 *   next: ListNode | null;
 * }
 * ```
 *
 * **Example 1:**
 * ```
 * Input: head = [1,2,3,4,5]
 * Output: [5,4,3,2,1]
 * ```
 *
 * **Example 2:**
 * ```
 * Input: head = [1,2]
 * Output: [2,1]
 * ```
 *
 * **Example 3:**
 * ```
 * Input: head = []
 * Output: []
 * ```
 *
 * **Approaches:**
 * 1. **Recursive** - Reverse by unwinding the call stack
 * 2. **Iterative** - Reverse by flipping pointers as we traverse
 * 3. **Using Project's DoublyLinkedList** - Leverage project data structures
 *
 * **Constraints:**
 * - The number of nodes in the list is the range [0, 5000]
 * - -5000 <= Node.val <= 5000
 *
 * **Key Insight:**
 * Natural fit for recursion - demonstrates call stack unwinding and in-place pointer reversal.
 * See /algorithms/recursion/index.ts for tree traversal pattern analysis.
 *
 * **Complexity Summary:**
 * - Recursive: O(n) time, O(n) space (call stack)
 * - Iterative: O(n) time, O(1) space (two pointers)
 *
 * @date 23/01/2026 - 00:00:00
 */

import {
  SinglyLinkedList,
  SinglyLinkedListNode,
} from "../../structures/linked-list";
import {
  createListFromArray,
  listToArray,
} from "../../algorithms/utils/linked-list";

type ListNode<T> = SinglyLinkedListNode<T>;

/**
 * **Approach 1: Recursive**
 *
 * Reverses the list by recursively reaching the end, then flipping pointers
 * as the call stack unwinds.
 *
 * **Algorithm:**
 * 1. Base case: if node is null or has no next, return it (new head)
 * 2. Recursively reverse the rest of the list
 * 3. Make current node's next point back to current (reverse link)
 * 4. Break the old forward link by setting current.next = null
 *
 * **How it works:**
 * - Original: 1 -> 2 -> 3 -> null
 * - After recursion unwinds:
 *   - 3 (new head) <- 2 <- 1
 *   - null <- 3
 *
 * **Time Complexity:** O(n) - Visit each node once during recursion
 * **Space Complexity:** O(n) - Call stack depth equals list length (n recursive calls)
 */
function reverseListRecursive<T>(head: ListNode<T> | null): ListNode<T> | null {
  // Base case: empty list or single node
  if (!head || !head.next) {
    return head;
  }

  // Recursively reverse the rest of the list
  // newHead will eventually be the last node
  const newHead = reverseListRecursive(head.next);

  // Reverse the link: make head.next point back to head
  // head.next.next = head means: the node after head now points to head
  head.next.next = head;

  // Break the forward link
  head.next = null;

  return newHead;
}

/**
 * **Approach 2: Iterative (Two-Pointer)**
 *
 * Reverses the list by maintaining previous and current pointers,
 * flipping the next pointer for each node as we traverse.
 *
 * **Algorithm:**
 * 1. Initialize prev = null, current = head
 * 2. While current is not null:
 *    a. Save next node (because we're about to change current.next)
 *    b. Reverse the link: current.next = prev
 *    c. Move prev to current
 *    d. Move current to next
 * 3. Return prev (new head)
 *
 * **How it works:**
 * - Original: 1 -> 2 -> 3 -> null
 * - Step 1: null <- 1  2 -> 3 -> null
 * - Step 2: null <- 1 <- 2  3 -> null
 * - Step 3: null <- 1 <- 2 <- 3
 *
 * **Time Complexity:** O(n) - Single pass through the list
 * **Space Complexity:** O(1) - Only uses three pointers (prev, current, nextTemp)
 */
function reverseListIterative<T>(head: ListNode<T> | null): ListNode<T> | null {
  let prev: ListNode<T> | null = null;
  let current = head;

  while (current) {
    // Save the next node before we change current.next
    const nextTemp = current.next;

    // Reverse the link
    current.next = prev;

    // Move prev and current one step forward
    prev = current;
    current = nextTemp;
  }

  // prev is now the head of the reversed list
  return prev;
}

/**
 * **Approach 3: Using Project's SinglyLinkedList**
 *
 * Uses the project's SinglyLinkedList structure to reverse by leveraging
 * the insert() method which prepends (adds at head), naturally reversing order.
 *
 * **Algorithm:**
 * 1. Extract all values from input list
 * 2. Create SinglyLinkedList and insert each value (prepend = reverse)
 * 3. Return the reversed list's head
 *
 * **Why this approach:**
 * - Demonstrates using project data structures
 * - insert() naturally reverses by prepending to head
 * - Shows composition with project's optimized LinkedList
 *
 * **Time Complexity:** O(n) - Traverse input list + insert each value into project list
 * **Space Complexity:** O(n) - Creates n new SinglyLinkedListNode instances
 */
function reverseListWithProject<T>(
  head: ListNode<T> | null
): ListNode<T> | null {
  if (!head) return null;

  // Use SinglyLinkedList - insert() prepends, naturally reversing
  const projectList = new SinglyLinkedList<T>();
  let current: ListNode<T> | null = head;
  while (current) {
    projectList.insert(current.val);
    current = current.next;
  }

  // Return the project list's head (which is now the reversed list)
  return projectList["head"]; // Access private head via bracket notation
}

// Example usage
if (require.main === module) {
  console.log("=== Test Case 1: Normal List ===");
  const list1 = createListFromArray([1, 2, 3, 4, 5]);
  console.log("Original:", listToArray(list1));

  const reversed1Recursive = reverseListRecursive(list1);
  console.log("Reversed (Recursive):", listToArray(reversed1Recursive));

  const list1b = createListFromArray([1, 2, 3, 4, 5]);
  const reversed1Iterative = reverseListIterative(list1b);
  console.log("Reversed (Iterative):", listToArray(reversed1Iterative));

  const list1c = createListFromArray([1, 2, 3, 4, 5]);
  const reversed1Project = reverseListWithProject(list1c);
  console.log("Reversed (Project Structure):", listToArray(reversed1Project));

  // Test case 2: Single element
  console.log("\n=== Test Case 2: Single Element ===");
  const list2 = createListFromArray([1]);
  console.log("Original:", listToArray(list2));

  const reversed2Recursive = reverseListRecursive(list2);
  console.log("Reversed (Recursive):", listToArray(reversed2Recursive));

  // Test case 3: Two elements
  console.log("\n=== Test Case 3: Two Elements ===");
  const list3 = createListFromArray([1, 2]);
  console.log("Original:", listToArray(list3));

  const reversed3Iterative = reverseListIterative(list3);
  console.log("Reversed (Iterative):", listToArray(reversed3Iterative));

  // Test case 4: Empty list
  console.log("\n=== Test Case 4: Empty List ===");
  const list4: ListNode<number> | null = null;
  console.log("Original:", listToArray(list4));

  const reversed4 = reverseListRecursive(list4);
  console.log("Reversed:", listToArray(reversed4));

  // Complexity analysis
  console.log("\n=== Complexity Analysis ===");
  console.log("Recursive:           Time O(n), Space O(n) - call stack");
  console.log("Iterative:           Time O(n), Space O(1) - only pointers");
  console.log(
    "Project Structure:   Time O(n), Space O(n) - SinglyLinkedList nodes"
  );
}

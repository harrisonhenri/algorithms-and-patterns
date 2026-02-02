import { SinglyLinkedListNode } from "../../structures/linked-list";
import {
  createListFromArray,
  listToArray,
} from "../../algorithms/utils/linked-list";

/**
 * Insertion Sort List - LeetCode Problem 147
 *
 * Problem Statement:
 * Given the head of a singly linked list, sort the list using insertion sort,
 * and return the sorted list's head.
 *
 * The insertion sort algorithm:
 * 1. Iterates through the list, consuming one element each repetition
 * 2. Grows a sorted output list by finding where each element belongs
 * 3. Inserts the element into its correct position in the sorted portion
 * 4. Repeats until all input elements are processed
 *
 * @example
 * Input: head = [4, 2, 1, 3]
 * Output: [1, 2, 3, 4]
 *
 * @example
 * Input: head = [-1, 5, 3, 4, 0]
 * Output: [-1, 0, 3, 4, 5]
 *
 * @constraints
 * - The number of nodes in the list is in the range [1, 5000]
 * - -5000 <= Node.val <= 5000
 *
 * ## Approaches
 *
 * **Approach 1: Insertion Sort on Linked List (Implemented)**
 *
 * Algorithm:
 * 1. Create a dummy node as the head of sorted list
 * 2. Iterate through the original list
 * 3. For each node, find its correct position in the sorted list
 * 4. Insert it at that position by updating pointers
 * 5. Return the sorted list (dummy.next)
 *
 * Key insight: Build sorted list in-place by traversing and inserting nodes.
 * Time spent finding position dominates: O(n) positions × O(n) search = O(n²)
 *
 * Implementation details:
 * - Dummy node eliminates edge case of inserting before head
 * - Single pass through original list
 * - Multiple searches backward in sorted portion for each node
 *
 * @time O(n²) - For each node (n), find position by scanning sorted portion (up to n nodes)
 * @space O(1) - Only pointer manipulation, no extra data structures
 *
 * **Trade-off:** Intuitive and educational. Works well on nearly-sorted lists.
 * Pattern: Grow sorted section by inserting unsorted elements one at a time.
 *
 * **Approach 2: Merge Sort on Linked List (Alternative)**
 *
 * Use merge sort instead (better for linked lists):
 * 1. Find middle using slow/fast pointer technique
 * 2. Recursively sort left and right halves
 * 3. Merge sorted halves
 *
 * @time O(n log n) - Merge sort is O(n log n)
 * @space O(log n) - Recursion depth for divide-and-conquer
 *
 * **Trade-off:** Faster for large lists with many inversions.
 * Merge sort is generally preferred for linked lists over quicksort.
 *
 * **Approach 3: Convert to Array, Sort, Rebuild (Alternative)**
 *
 * Convert linked list → array → sort array → rebuild linked list:
 * 1. Traverse list, collect all values in array
 * 2. Sort array using any comparison sort (quicksort, heapsort)
 * 3. Rebuild linked list from sorted array
 *
 * @time O(n log n) - Array sort dominates
 * @space O(n) - Need array to store all values
 *
 * **Trade-off:** Can use optimized array sorting, but requires O(n) extra space.
 *
 * **Approach 4: Bucket Sort on Linked List (Alternative)**
 *
 * For integers in bounded range:
 * 1. Count frequency of each value
 * 2. Rebuild linked list in sorted order
 *
 * @time O(n + k) where k = range of values
 * @space O(k) - Counting array
 *
 * **Trade-off:** Linear time if range is small (like values [−5000, 5000]).
 *
 * @date 29/01/2026
 */

/**
 * **Approach 1: Insertion Sort on Linked List**
 *
 * Time: O(n²) - Find position for each node by scanning sorted portion
 * Space: O(1) - Only pointer manipulation
 *
 * Build sorted list by inserting each node into its correct position.
 * Simple and intuitive approach, effective on nearly-sorted lists.
 *
 * Key insight: Dummy node eliminates edge cases when inserting before head.
 */
function insertionSortList(
  head: SinglyLinkedListNode<number> | null,
): SinglyLinkedListNode<number> | null {
  // Create dummy node to simplify insertion at head
  const dummy = new SinglyLinkedListNode(Number.MIN_SAFE_INTEGER);
  let current = head;

  while (current !== null) {
    // Find correct position to insert current node
    let pos = dummy;
    while (pos.next !== null && pos.next.val < current.val) {
      pos = pos.next;
    }

    // Save next node to process
    const next = current.next;

    // Insert current between pos and pos.next
    current.next = pos.next;
    pos.next = current;

    // Move to next unprocessed node
    current = next;
  }

  return dummy.next;
}

// Example usage
if (require.main === module) {
  console.log("=== Example 1: Random order ===");
  const head1 = createListFromArray([4, 2, 1, 3]);
  console.log(`Input: [4, 2, 1, 3]`);
  console.log(`Result: [${listToArray(insertionSortList(head1))}]`);
  console.log(`Expected: [1, 2, 3, 4]`);
  console.log(`Trace:
  Start: [4, 2, 1, 3]
  After 4: [4]
  After 2: [2, 4]
  After 1: [1, 2, 4]
  After 3: [1, 2, 3, 4]`);
  console.log();

  console.log("=== Example 2: Contains negatives ===");
  const head2 = createListFromArray([-1, 5, 3, 4, 0]);
  console.log(`Input: [-1, 5, 3, 4, 0]`);
  console.log(`Result: [${listToArray(insertionSortList(head2))}]`);
  console.log(`Expected: [-1, 0, 3, 4, 5]`);
  console.log(`Trace:
  Start: [-1, 5, 3, 4, 0]
  After -1: [-1]
  After 5: [-1, 5]
  After 3: [-1, 3, 5]
  After 4: [-1, 3, 4, 5]
  After 0: [-1, 0, 3, 4, 5]`);
  console.log();

  console.log("=== Example 3: Already sorted ===");
  const head3 = createListFromArray([1, 2, 3, 4, 5]);
  console.log(`Input: [1, 2, 3, 4, 5]`);
  console.log(`Result: [${listToArray(insertionSortList(head3))}]`);
  console.log(`Expected: [1, 2, 3, 4, 5]`);
  console.log(`Explanation: Each node already in position, minimal searches`);
  console.log();

  console.log("=== Example 4: Reverse sorted ===");
  const head4 = createListFromArray([5, 4, 3, 2, 1]);
  console.log(`Input: [5, 4, 3, 2, 1]`);
  console.log(`Result: [${listToArray(insertionSortList(head4))}]`);
  console.log(`Expected: [1, 2, 3, 4, 5]`);
  console.log(`Explanation: Worst case - each node inserted at beginning`);
  console.log();

  console.log("=== Example 5: Single element ===");
  const head5 = createListFromArray([42]);
  console.log(`Input: [42]`);
  console.log(`Result: [${listToArray(insertionSortList(head5))}]`);
  console.log(`Expected: [42]`);
  console.log(`Explanation: Single element already sorted`);
  console.log();
}

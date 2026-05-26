/**
 * Linked List Utilities
 *
 * Common helper functions for working with DoublyLinkedList and DoublyLinkedListNode.
 *
 * @date 23/01/2026 - 00:00:00
 */

import { DoublyLinkedListNode } from "../../../structures/linked-list";

/**
 * Create a linked list from an array of values.
 *
 * **Time Complexity:** O(n) - Create n nodes
 * **Space Complexity:** O(n) - Store n nodes
 *
 * @param arr - Array of values to convert
 * @returns Head node of the created linked list, or null if array is empty
 */
export function createListFromArray<T>(
  arr: T[],
): DoublyLinkedListNode<T> | null {
  if (arr.length === 0) return null;

  const head = new DoublyLinkedListNode(arr[0]);
  let current = head;

  for (let i = 1; i < arr.length; i++) {
    current.next = new DoublyLinkedListNode(arr[i]);
    current = current.next;
  }

  return head;
}

/**
 * Convert a linked list to an array of values.
 *
 * **Time Complexity:** O(n) - Traverse all nodes
 * **Space Complexity:** O(n) - Store n values in array
 *
 * @param head - Head node of the linked list
 * @returns Array of values from the linked list
 */
export function listToArray<T>(head: DoublyLinkedListNode<T> | null): T[] {
  const arr: T[] = [];
  let current = head;

  while (current !== null) {
    arr.push(current.val);
    current = current.next;
  }

  return arr;
}

/**
 * Print a linked list to console in readable format.
 *
 * **Time Complexity:** O(n) - Traverse all nodes
 * **Space Complexity:** O(n) - Convert to array for display
 *
 * @param head - Head node of the linked list
 * @param label - Optional label to prefix the output
 */
export function printList<T>(
  head: DoublyLinkedListNode<T> | null,
  label: string = "List",
): void {
  const arr = listToArray(head);
  console.log(`${label}: [${arr.join(", ")}]`);
}

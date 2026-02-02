/**
 * ## Priority Queues & Heaps
 *
 * A **priority queue** is an abstract data type where elements have associated priorities.
 * High-priority elements are served before low-priority ones. While arrays and linked lists
 * can implement priority queues, they guarantee O(1) for insertion OR deletion (but not both),
 * with the other being O(N). A **Heap** is a data structure that implements priority queues efficiently.
 *
 * **Key distinction:** A Heap is NOT a Priority Queue; it's a way to implement one.
 *
 * ## Heap Definition
 *
 * A Heap is a complete binary tree where each node's value is:
 * - **Max Heap:** No less than its child nodes (largest value at root)
 * - **Min Heap:** No larger than its child nodes (smallest value at root)
 *
 * Heaps are data structures where the parent is smaller than (min-heap) its
 * children or bigger than (max-heap) its children. Heaps usually can store any values of any types.
 *
 * **Typical use cases / strengths:**
 * - Priority queues
 * - Scheduling
 * - Finding min/max efficiently
 * - Heap sort algorithm
 *
 * **Time Complexity:**
 * - `peek()` (min/max) → **O(1)** - Constant time access to root
 * - `insert()` / `extract()` → **O(log n)** - Logarithmic operations
 *
 * **Interview intuition:** "Give me the best element fast"
 * @date 13/01/2026 - 00:00:00
 *
 */
export class Heap<T> {
  protected items: T[] = [];

  swap(index1: number, index2: number) {
    const temp = this.items[index1];
    this.items[index1] = this.items[index2];
    this.items[index2] = temp;
  }

  parentIndex(index: number) {
    return Math.floor((index - 1) / 2);
  }

  leftChildIndex(index: number) {
    return index * 2 + 1;
  }

  rightChildIndex(index: number) {
    return index * 2 + 2;
  }

  parent(index: number) {
    return this.items[this.parentIndex(index)];
  }

  leftChild(index: number) {
    return this.items[this.leftChildIndex(index)];
  }

  rightChild(index: number) {
    return this.items[this.rightChildIndex(index)];
  }

  peek() {
    return this.items[0];
  }

  size() {
    return this.items.length;
  }
}

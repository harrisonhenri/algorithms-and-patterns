import { Heap } from "..";

/**
 * Min heaps. Since percolation takes O(lgn) and to sort we need to do n peeks,
 * the heap sort algorithm takes O(nlgn).
 * @date 17/12/2025 - 00:00:00
 *
 */
class MinHeap<T> extends Heap<T> {
  add(item: T) {
    this.items[this.items.length] = item;
    this.bubbleUp();
  }

  poll() {
    const item = this.items[0];
    this.items[0] = this.items[this.items.length - 1];
    this.items.pop();
    this.bubbleDown();
    return item;
  }

  bubbleDown() {
    let index = 0;
    while (
      this.leftChild(index) &&
      (this.leftChild(index) < this.items[index] ||
        this.rightChild(index) < this.items[index])
    ) {
      let smallerIndex = this.leftChildIndex(index);
      if (
        this.rightChild(index) &&
        this.rightChild(index) < this.items[smallerIndex]
      ) {
        smallerIndex = this.rightChildIndex(index);
      }
      this.swap(smallerIndex, index);
      index = smallerIndex;
    }
  }

  bubbleUp() {
    let index = this.items.length - 1;
    while (this.parent(index) && this.parent(index) > this.items[index]) {
      this.swap(this.parentIndex(index), index);
      index = this.parentIndex(index);
    }
  }
}

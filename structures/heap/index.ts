/**
 * Heaps are data structures where the parent is smaller than (min-heap) than its
 * children or bigger than (max-heap) its children. Heaps usually can store any
 * values of any types.
 * @date 17/12/2025 - 00:00:00
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

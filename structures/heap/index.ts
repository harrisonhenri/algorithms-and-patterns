/**
 * Basic heap.
 * @date 21/06/2023 - 00:01:00
 *
 */
export class Heap {
  #elements: number[];

  constructor(array: number[]) {
    this.#elements = [];
    array.forEach((element) => {
      this.insert(element);
    });
  }

  #swap(a: number, b: number) {
    const tmp = this.#elements[a];
    this.#elements[a] = this.#elements[b];
    this.#elements[b] = tmp;
  }

  #getLeftChildIndex(parentIndex: number) {
    return 2 * parentIndex + 1;
  }

  #getRightChildIndex(parentIndex: number) {
    return 2 * parentIndex + 2;
  }

  #getParentIndex(childIndex: number) {
    return Math.floor((childIndex - 1) / 2);
  }

  #hasLeftChild(index: number) {
    return this.#getLeftChildIndex(index) < this.#elements.length;
  }

  #hasRightChild(index: number) {
    return this.#getRightChildIndex(index) < this.#elements.length;
  }

  #hasParent(index: number) {
    return this.#getParentIndex(index) >= 0;
  }

  #parent(index: number) {
    return this.#elements[this.#getParentIndex(index)];
  }

  #leftChild(index: number) {
    return this.#elements[this.#getLeftChildIndex(index)];
  }

  #rightChild(index: number) {
    return this.#elements[this.#getRightChildIndex(index)];
  }

  isEmpty() {
    return this.#elements.length === 0;
  }

  insert(e: number) {
    this.#elements.push(e);
    this.heapifyUp();
  }

  remove() {
    if (this.#elements.length === 0) {
      return null;
    }
    const item = this.#elements[0];
    this.#elements[0] = this.#elements[this.#elements.length - 1];
    this.#elements.pop();
    this.heapifyDown();
    return item;
  }

  heapifyUp() {
    let index = this.#elements.length - 1;
    while (
      this.#hasParent(index) &&
      this.#parent(index) > this.#elements[index]
    ) {
      this.#swap(this.#getParentIndex(index), index);
      index = this.#getParentIndex(index);
    }
  }

  heapifyDown() {
    let index = 0;
    while (this.#hasLeftChild(index)) {
      let smallerChildIndex = this.#getLeftChildIndex(index);
      if (
        this.#hasRightChild(index) &&
        this.#rightChild(index) < this.#leftChild(index)
      ) {
        smallerChildIndex = this.#getRightChildIndex(index);
      }
      if (this.#elements[index] < this.#elements[smallerChildIndex]) {
        break;
      } else {
        this.#swap(index, smallerChildIndex);
      }
      index = smallerChildIndex;
    }
  }
}

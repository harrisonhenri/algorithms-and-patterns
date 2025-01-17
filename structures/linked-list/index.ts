/**
 * Singly linked lists.
 * @date 15/12/2025 - 00:00:00
 *
 */
class SinglyLinkedListNode<T> {
  data: T;
  next: SinglyLinkedListNode<T> | null;

  constructor(data: T) {
    this.data = data;
    this.next = null;
  }
}

class SinglyLinkedList<T> {
  private head: SinglyLinkedListNode<T> | null;
  private size: number;

  constructor() {
    this.head = null;
    this.size = 0;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  insert(value: T): void {
    if (this.head === null) {
      this.head = new SinglyLinkedListNode(value);
    } else {
      const temp = this.head;
      this.head = new SinglyLinkedListNode(value);
      this.head.next = temp;
    }
    this.size++;
  }

  remove(value: T): void {
    let currentHead = this.head;

    if (currentHead === null) {
      return;
    }

    // If the value is at the head
    if (currentHead.data === value) {
      this.head = currentHead.next;
      this.size--;
      return;
    }

    let prev = currentHead;

    // Traverse the list to find the node to remove
    while (currentHead.next) {
      if (currentHead.data === value) {
        prev.next = currentHead.next;
        this.size--;
        return;
      }
      prev = currentHead;
      currentHead = currentHead.next;
    }

    // If the value is at the tail
    if (currentHead.data === value) {
      prev.next = null;
      this.size--;
    }
  }

  deleteAtHead(): T | null {
    if (this.head === null) {
      return null;
    }

    const toReturn = this.head.data;

    if (this.head.next === null) {
      this.head = null;
    } else {
      this.head = this.head.next;
    }

    this.size--;
    return toReturn;
  }

  find(value: T): boolean {
    let currentHead = this.head;

    while (currentHead) {
      if (currentHead.data === value) {
        return true;
      }
      currentHead = currentHead.next;
    }

    return false;
  }

  getSize(): number {
    return this.size;
  }
}

const linkedList = new SinglyLinkedList();
linkedList.insert(1);
linkedList.insert(12);
linkedList.insert(20);
linkedList.deleteAtHead();

/**
 * Doubly Linked List implementation.
 *
 * **Typical use cases / strengths:**
 * - Dynamic size; flexible structure
 * - Frequent insertions/deletions when reference is known - O(1)
 * - Implementing deques and queues with O(1) tail operations
 * - Backtracking algorithms requiring LIFO path management
 * - Adjacency lists for graphs
 *
 * **Linked Lists vs Arrays:**
 * | Operation | Doubly Linked List | Array | Notes |
 * |-----------|-------------------|-------|-------|
 * | Insert/delete (with reference) | O(1) | O(n) | Constant with node pointer |
 * | Insert/delete at tail | O(1) | O(1) | Tail pointer + prev link |
 * | Search/access | O(n) | O(1) | Must traverse |
 * | Memory overhead | Higher | Lower | Both next and prev pointers |
 *
 * **Key characteristics:**
 * - Bidirectional traversal (next and prev pointers)
 * - O(1) append and removeLast operations (via tail pointer and prev links)
 * - Higher memory overhead (2 pointers per node vs 1 for singly-linked)
 * - No cache locality (unlike arrays)
 * - Perfect for deque/stack patterns in backtracking
 *
 * **Common complexity summary:**
 * - append(): O(1) - Direct tail pointer access
 * - removeLast(): O(1) - Tail pointer + prev link
 * - insert(): O(1) - Direct head pointer access
 * - remove(value): O(n) - Must search for value
 * - find(value): O(n) - Must traverse list
 * - deleteAtHead(): O(1) - Direct head pointer access
 *
 * **Interview intuition:** "Bidirectional access, O(1) tail ops, ideal for deques"
 * @date 13/01/2026 - 00:00:00
 *
 */
class SinglyLinkedListNode<T> {
  val: T;
  next: SinglyLinkedListNode<T> | null;
  prev: SinglyLinkedListNode<T> | null;

  constructor(val: T) {
    this.val = val;
    this.next = null;
    this.prev = null;
  }
}

export { SinglyLinkedListNode };

export class SinglyLinkedList<T> {
  private head: SinglyLinkedListNode<T> | null;
  private tail: SinglyLinkedListNode<T> | null;
  private size: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  insert(value: T): void {
    if (this.head === null) {
      this.head = new SinglyLinkedListNode(value);
      this.tail = this.head;
    } else {
      const newNode = new SinglyLinkedListNode(value);
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.size++;
  }

  remove(value: T): void {
    let currentHead = this.head;

    if (currentHead === null) {
      return;
    }

    // If the value is at the head
    if (currentHead.val === value) {
      this.head = currentHead.next;
      if (this.head === null) {
        this.tail = null;
      } else {
        this.head.prev = null;
      }
      this.size--;
      return;
    }

    // Traverse the list to find the node to remove
    while (currentHead) {
      if (currentHead.val === value) {
        if (currentHead.next) {
          currentHead.next.prev = currentHead.prev;
        } else {
          // Removing tail
          this.tail = currentHead.prev;
        }

        if (currentHead.prev) {
          currentHead.prev.next = currentHead.next;
        }

        this.size--;
        return;
      }
      currentHead = currentHead.next;
    }
  }

  deleteAtHead(): T | null {
    if (this.head === null) {
      return null;
    }

    const toReturn = this.head.val;

    if (this.head.next === null) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head.next;
    }

    this.size--;
    return toReturn;
  }

  find(value: T): boolean {
    let currentHead = this.head;

    while (currentHead) {
      if (currentHead.val === value) {
        return true;
      }
      currentHead = currentHead.next;
    }

    return false;
  }

  getSize(): number {
    return this.size;
  }

  /**
   * Append a value to the end of the list.
   * Time Complexity: O(1) - direct tail pointer access
   * Useful for deque operations and certain backtracking algorithms
   */
  append(value: T): void {
    const newNode = new SinglyLinkedListNode(value);

    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      if (this.tail) {
        this.tail.next = newNode;
        newNode.prev = this.tail;
      }
      this.tail = newNode;
    }

    this.size++;
  }

  /**
   * Remove and return the last value from the list.
   * Time Complexity: O(1) - direct tail and prev pointer access
   * Useful for deque operations and backtracking algorithms
   */
  removeLast(): T | null {
    if (this.tail === null) {
      return null;
    }

    const value = this.tail.val;

    // If there's only one node
    if (this.tail.prev === null) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = this.tail.prev;
      this.tail.next = null;
    }

    this.size--;
    return value;
  }

  /**
   * Convert linked list to array for easy output/comparison
   */
  toArray(): T[] {
    const arr: T[] = [];
    let current = this.head;
    while (current) {
      arr.push(current.val);
      current = current.next;
    }
    return arr;
  }
}

if (require.main === module) {
  const linkedList = new SinglyLinkedList();
  linkedList.insert(1);
  linkedList.insert(12);
  linkedList.insert(20);
  linkedList.deleteAtHead();
}

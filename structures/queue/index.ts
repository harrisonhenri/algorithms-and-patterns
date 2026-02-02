/**
 * Queue is a data structure that implements a FIFO (First-In-First-Out) principle
 * where enqueue and dequeue happen in O(1).
 *
 * **Typical use cases / strengths:**
 * - Task scheduling and job processing
 * - BFS (Breadth-First Search) graph traversals
 * - Print queue management
 * - Message buffering
 *
 * **Time Complexity:**
 * - `enqueue()` → **O(1)**
 * - `dequeue()` → **O(1)**
 * - `peek()` → **O(1)**
 *
 * **Note:** The limitation is that access to non-first elements takes O(n).
 * Similar trade-offs exist between Stacks and Queues.
 *
 * **Interview intuition:** "Process in order (FIFO)"
 * @date 13/01/2026 - 00:00:00
 *
 */
class Queue<T> {
  private array: T[] = [];
  private head = 0;

  constructor(array: T[] = []) {
    this.array = array;
  }

  getBuffer(): T[] {
    return this.array.slice();
  }

  enqueue(x: T) {
    this.array.push(x);
  }

  dequeue(): T | undefined {
    return this.head < this.array.length ? this.array[this.head++] : undefined;
  }

  size() {
    return this.array.length - this.head;
  }

  isEmpty() {
    return this.size() === 0;
  }
}

export { Queue };

if (require.main === module) {
  const queue = new Queue();
  queue.enqueue(1);
  queue.enqueue(2);
  queue.enqueue(3);

  function queueAccessNthTopNode<T>(queue: Queue<T>, n: number) {
    if (n <= 0) {
      throw new Error("n must be greater than 0");
    }

    const bufferArray = queue.getBuffer();
    const buffer = new Queue(bufferArray);

    while (--n !== 0) {
      buffer.dequeue();
    }

    return buffer.dequeue();
  }

  console.log(queueAccessNthTopNode(queue, 1));
  console.log(queue);
}

/**
 * Queue is a data structure that implements a FIFO principle where lookup and
 * insertion happen in O(1). The limitation of stacks and queues are the same.
 * @date 14/12/2025 - 00:00:00
 *
 */
class Queue<T> {
  private readonly array: T[];

  constructor(array: T[] = []) {
    this.array = array;
  }

  getBuffer(): T[] {
    return this.array.slice();
  }

  isEmpty(): boolean {
    return this.array.length === 0;
  }

  peek(): T | undefined {
    return this.array[0];
  }

  enqueue(value: T): void {
    this.array.push(value);
  }

  dequeue(): T | undefined {
    return this.array.shift();
  }
}

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

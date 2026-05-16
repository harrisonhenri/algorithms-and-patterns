/**
 * Stack is a data structure that implements a LIFO (Last-In-First-Out) principle where lookup and
 * insertion happen in O(1). The limitation is that access of non-last added elements takes O(n).
 *
 * **Typical use cases / strengths:**
 * - Function call stacks in recursive algorithms
 * - Undo/Redo functionality
 * - Expression evaluation and parsing (infix to postfix)
 * - Backtracking algorithms (maze solving, DFS)
 * - Browser history navigation
 *
 * **Time Complexity:**
 * - `push()` → **O(1) amortized** (occasional resize reallocates array)
 * - `pop()` → **O(1)**
 * - `peek()` → **O(1)**
 * - `getBuffer()` → **O(n)** (creates a copy via slice)
 *
 * **Note:** Access to elements other than the top takes O(n).
 * JavaScript arrays use dynamic allocation, so `push()` is amortized O(1),
 * meaning most operations are O(1) but occasional resizes cost O(n).
 * Similar trade-offs exist between Stacks and Queues.
 *
 * **Interview intuition:** "Process in reverse (LIFO)"
 * @date 13/01/2026 - 00:00:00
 *
 */
export class Stack<T> {
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
    return this.array[this.array.length - 1];
  }

  push(value: T): void {
    this.array.push(value);
  }

  pop(): T | undefined {
    return this.array.pop();
  }
}

if (require.main === module) {
  const stack = new Stack();
  stack.push(1);
  stack.push(2);
  stack.push(3);

  function stackAccessNthTopNode<T>(stack: Stack<T>, n: number) {
    if (n <= 0) {
      throw new Error("n must be greater than 0");
    }

    const bufferArray = stack.getBuffer();
    const buffer = new Stack(bufferArray);

    while (--n !== 0) {
      buffer.pop();
    }

    return buffer.pop();
  }

  console.log(stackAccessNthTopNode(stack, 1));
  console.log(stack);
}

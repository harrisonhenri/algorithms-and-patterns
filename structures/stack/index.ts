/**
 * Stack is a data structure that implements a LIFO principle where lookup and
 * insertion happen in O(1). The limitation is that the access of the non
 * last added takes O(n).
 * @date 15/12/2025 - 00:00:00
 *
 */
class Stack<T> {
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

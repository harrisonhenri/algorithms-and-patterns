/**
 * Closure pattern examples - functions remembering outer scope
 * @date 26/05/2026
 */

import {
  createCounter,
  memoize,
  createMultiplier,
  createUser,
  partial,
} from "./closure";

// Example 1: Counter with closure
console.log("=== Counter with Closure ===");
const counter = createCounter(0);
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.get()); // 2
counter.reset();
console.log(counter.get()); // 0

// Example 2: Independent counters maintain separate state
console.log("\n=== Independent Counters ===");
const counter1 = createCounter(10);
const counter2 = createCounter(100);
console.log(counter1.increment()); // 11
console.log(counter2.increment()); // 101
console.log("counter1:", counter1.get()); // 11
console.log("counter2:", counter2.get()); // 101

// Example 3: Memoization via closure
console.log("\n=== Memoization ===");
let callCount = 0;
const expensiveCalc = memoize((n: number) => {
  callCount++;
  return n * n;
});

console.log("First call:", expensiveCalc(5)); // calculates
console.log("Call count:", callCount); // 1
console.log("Second call:", expensiveCalc(5)); // returns cached
console.log("Call count:", callCount); // still 1 (cached!)
console.log("Different arg:", expensiveCalc(10)); // calculates
console.log("Call count:", callCount); // 2

// Example 4: Factory function - create specialized functions
console.log("\n=== Factory Functions ===");
const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log("double(5):", double(5)); // 10
console.log("triple(5):", triple(5)); // 15

// Example 5: Private state via closure
console.log("\n=== Private State ===");
const user = createUser("Alice");
user.setEmail("alice@example.com");
console.log(user.getName()); // Alice
console.log(user.getEmail()); // alice@example.com
console.log(user.getInfo()); // Alice <alice@example.com>
console.log((user as any)._email); // undefined (private!)

// Example 6: Partial application
console.log("\n=== Partial Application ===");
const add = (a: number, b: number, c: number) => a + b + c;
const add5 = partial(add, 5);
console.log(add5(3, 2)); // 10

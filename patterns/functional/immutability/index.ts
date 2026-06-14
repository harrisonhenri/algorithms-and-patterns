/**
 * Immutability pattern examples - never modify, always create new copies
 * @date 26/05/2026
 */

import { push, updateAt, removeAt, set, update, unset } from "./immutability";

// Example 1: Immutable array operations
console.log("=== Immutable Arrays ===");
const arr = [1, 2, 3];
const arr2 = push(4)(arr);
console.log("Original:", arr); // [1, 2, 3]
console.log("New:", arr2); // [1, 2, 3, 4]

// Example 2: Update element at index
console.log("\n=== Update at Index ===");
const numbers = [10, 20, 30];
const updated = updateAt(1, 99)(numbers);
console.log("Original:", numbers); // [10, 20, 30]
console.log("Updated:", updated); // [10, 99, 30]

// Example 3: Remove element
console.log("\n=== Remove at Index ===");
const items = ["a", "b", "c", "d"];
const removed = removeAt(1)(items);
console.log("Original:", items); // ['a', 'b', 'c', 'd']
console.log("Removed:", removed); // ['a', 'c', 'd']

// Example 4: Immutable object updates
console.log("\n=== Immutable Objects ===");
const user = { name: "John", age: 30 };
const updatedUser = set("age", 31)(user);
console.log("Original:", user); // { name: 'John', age: 30 }
console.log("Updated:", updatedUser); // { name: 'John', age: 31 }

// Example 5: Batch update
console.log("\n=== Batch Updates ===");
const state = { count: 0, status: "idle", message: "" };
const newState = update({ count: 5, status: "loading" })(state);
console.log("Original:", state); // { count: 0, status: 'idle', message: '' }
console.log("Updated:", newState); // { count: 5, status: 'loading', message: '' }

// Example 6: Remove property
console.log("\n=== Remove Property ===");
const config = { host: "localhost", port: 3000, debug: true };
const cleaned = unset("debug")(config);
console.log("Original:", config); // { host: 'localhost', port: 3000, debug: true }
console.log("Cleaned:", cleaned); // { host: 'localhost', port: 3000 }

// Example 7: Chaining immutable operations
console.log("\n=== Chaining Operations ===");
const initialState = { items: [1, 2, 3], count: 3 };
const final = update({
  items: removeAt(1)(initialState.items),
  count: 2,
})(initialState);
console.log("Original:", initialState); // { items: [1, 2, 3], count: 3 }
console.log("Final:", final); // { items: [1, 3], count: 2 }

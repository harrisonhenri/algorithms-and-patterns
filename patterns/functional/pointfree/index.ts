/**
 * Pointfree pattern example - compose string transformations without mentioning data
 * @date 26/05/2026
 */

import {
  compose,
  pipe,
  toLowerCase,
  replace,
  toUpperCase,
  trim,
} from "./pointfree";

// Example 1: String transformation pipeline
const snakeCase = pipe(trim, toLowerCase, replace(/\s+/g, "_"));

console.log("=== Pointfree String Transform ===");
console.log(snakeCase("  Hello World  ")); // hello_world
console.log(snakeCase("Foo Bar Baz")); // foo_bar_baz

// Example 2: Reverse composition with compose (right-to-left)
const shout = compose(toUpperCase, replace(/\s+/g, "!"));

console.log("\n=== Pointfree Compose ===");
console.log(shout("hello world")); // HELLO!WORLD

// Example 3: Array transformation pipeline
const { map, filter } = require("./pointfree");

const numbers = [1, 2, 3, 4, 5];
const isEven = (n: number) => n % 2 === 0;
const double = (n: number) => n * 2;

const doubleEvens = pipe(filter(isEven), map(double));

console.log("\n=== Pointfree Array Transform ===");
console.log(doubleEvens(numbers)); // [4, 8]

// Example 4: Complex composition
const processUserName = pipe(trim, toLowerCase, replace(/\s+/g, "_"));

const user = "  John Doe  ";
console.log("\n=== Process User Name ===");
console.log(processUserName(user)); // john_doe

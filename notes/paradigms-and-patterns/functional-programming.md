---
tags: [functional-programming, theory]
title: "Functional programming"
---

# Functional programming

# Introduction

Functional programming can be caracterized mainly by three factors:

- The preference for **expressions**, which always evaluate to a value and promote a more **declarative** style, over **statements**, which typically do not return a value and rely on constructs like `if`, `while`, and `for`, favoring an **imperative** approach (procedural or step by step instructions)
- Most of modern functional languages functions are first-class citizens: functions are just a just another data type, so, they can be assigned, passed as parameters
- The preference for pure functions: given the same input, will always return the same output and does not have any observable side effect. This purity has a lot of benefits. It turns the code: cacheable, portable, testable, parallelizable

# Design patterns

## Pointfree

Functional design patterns favor pointfree design: never having to say your data explicity.

```jsx
// not pointfree because we mention the data: word
const snakeCase = (word) => word.toLowerCase().replace(/\s+/gi, "_");

// pointfree (but depends of replace been partially applied)
const snakeCase = compose(replace(/\s+/gi, "_"), toLowerCase);
```

## Closure

A closure is when a function remembers variables from its outer scope even after that scope has finished executing

```jsx
function outer() {
  let count = 0;
  return function inner() {
    count++;
    console.log(count);
  };
}
const counter = outer();
counter(); // 1
counter(); // 2
```

## Currying

Currying is a technique of converting a function that takes multiple arguments into a sequence of functions, each taking a single argument. This enables **partial application** and more flexible function composition.

```jsx
// Traditional function
const add = (a, b, c) => a + b + c;
add(1, 2, 3); // 6

// Curried version
const curriedAdd = (a) => (b) => (c) => a + b + c;
curriedAdd(1)(2)(3); // 6

// Enables partial application
const add1 = curriedAdd(1);
const add1And2 = add1(2);
const result = add1And2(3); // 6

// Or more practically
const multiply = (a) => (b) => a * b;
const double = multiply(2);
double(5); // 10
double(10); // 20
```

Benefits:

- **Composability**: Curried functions are easier to compose
- **Reusability**: Create specialized versions of generic functions
- **Lazy evaluation**: Defer execution until all arguments are provided

## Immutability

Immutability means data cannot be changed after creation. Instead of modifying data, you create new copies with the changes. This is a core principle of functional programming.

```jsx
// ❌ Imperative (mutable)
const arr = [1, 2, 3];
arr.push(4); // Modifies original array
arr[0] = 99; // Modifies in place

// ✅ Functional (immutable)
const arr = [1, 2, 3];
const newArr = [...arr, 4]; // Creates new array
const updated = arr.map((x, i) => (i === 0 ? 99 : x)); // Creates new array

// ❌ Imperative (mutable object)
const user = { name: "John", age: 30 };
user.age = 31; // Modifies original

// ✅ Functional (immutable object)
const user = { name: "John", age: 30 };
const updatedUser = { ...user, age: 31 }; // Creates new object
```

Benefits:

- **Predictability**: No hidden state changes; easier to reason about
- **Parallelizability**: No race conditions since data is never mutated
- **Debugging**: Easier to track state changes; each step is explicit
- **Testability**: Pure functions with immutable data are easier to test

**Note**: Immutability doesn't mean performance is sacrificed—modern engines optimize structural sharing (copy-on-write), and immutable data structures can be very efficient.

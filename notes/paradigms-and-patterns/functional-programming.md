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

# Pointfree

Functional design patterns favor pointfree design: never having to say your data explicity.

```jsx
// not pointfree because we mention the data: word
const snakeCase = word => word.toLowerCase().replace(/\s+/ig, '_');

// pointfree (but depends of replace been partially applied)
const snakeCase = compose(replace(/\s+/ig, '_'), toLowerCase);
```

# Design patterns

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

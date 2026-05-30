---
tags: [javascript, theory]
title: "JavaScript scopes"
---

# Javascript scopes

Scopes determines how and where variables are accessible.

## Lexical scope

A function can access variables from its outer scope because the important is where the function is defined rather than where it's called.:

```jsx
function outerFunction() {
  let outerVar = "I'm from outer scope";

  function innerFunction() {
    console.log(outerVar); // ✅ Accessible
  }

  innerFunction();
}

outerFunction();
```

## This also works because there's a **scope chaining**: when a variable isn’t found in the current scope, JavaScript looks up the chain until it finds it or reaches the global scope.

## Hoisting

Hoisting is JavaScript's behavior of moving declarations to the top of their scope before code execution. However, only the **declaration** is hoisted, not the **initialization**.

### `var` Hoisting

Variables declared with `var` are hoisted and initialized with `undefined`:

```jsx
console.log(x); // undefined (not ReferenceError!)
var x = 5;
console.log(x); // 5

// Equivalent to:
var x;
console.log(x); // undefined
x = 5;
console.log(x); // 5
```

### `let` and `const` Hoisting (Temporal Dead Zone)

Variables declared with `let` and `const` are hoisted but **not initialized**. Accessing them before declaration throws a `ReferenceError`. This period is called the **Temporal Dead Zone (TDZ)**.

```jsx
console.log(y); // ❌ ReferenceError: Cannot access 'y' before initialization
let y = 5;

console.log(z); // ❌ ReferenceError: Cannot access 'z' before initialization
const z = 10;
```

### Function Hoisting

Function **declarations** are fully hoisted (declaration + body):

```jsx
foo(); // ✅ Works! Prints "Hello"

function foo() {
  console.log("Hello");
}
```

Function **expressions** are not fully hoisted:

```jsx
bar(); // ❌ TypeError: bar is not a function

var bar = function () {
  console.log("Hello");
};
```

---

## `var`, `let`, and `const` Differences

| Feature            | `var`                               | `let`                                   | `const`                        |
| ------------------ | ----------------------------------- | --------------------------------------- | ------------------------------ |
| **Scope**          | Function scope                      | Block scope                             | Block scope                    |
| **Hoisting**       | Hoisted, initialized as `undefined` | Hoisted but Temporal Dead Zone          | Hoisted but Temporal Dead Zone |
| **Re-declaration** | ✅ Allowed                          | ❌ Not allowed                          | ❌ Not allowed                 |
| **Re-assignment**  | ✅ Allowed                          | ✅ Allowed                              | ❌ Not allowed                 |
| **Initialized**    | Optional (defaults to `undefined`)  | Optional (but can't access before init) | Required at declaration        |
| **Recommendation** | ❌ Avoid (legacy)                   | ✅ Use by default                       | ✅ Use when value won't change |

### Scope Example: `var` vs `let` / `const`

```jsx
// var is function-scoped
function testVar() {
  if (true) {
    var x = 1;
  }
  console.log(x); // ✅ 1 (visible outside block)
}

// let and const are block-scoped
function testLet() {
  if (true) {
    let y = 1;
  }
  console.log(y); // ❌ ReferenceError (not accessible)
}

// Loop example
for (var i = 0; i < 3; i++) {}
console.log(i); // ✅ 3 (var leaks out)

for (let j = 0; j < 3; j++) {}
console.log(j); // ❌ ReferenceError (j is block-scoped)
```

### Re-declaration Example

```jsx
var x = 1;
var x = 2; // ✅ OK

let y = 1;
let y = 2; // ❌ SyntaxError: Identifier 'y' has already been declared

const z = 1;
const z = 2; // ❌ SyntaxError: Identifier 'z' has already been declared
```

### Const Immutability Caveat

`const` prevents reassignment, but does **not** prevent mutation of objects:

```jsx
const obj = { name: "John" };
obj.name = "Jane"; // ✅ OK (mutation allowed)
obj = {}; // ❌ TypeError: Assignment to constant variable (reassignment not allowed)

const arr = [1, 2, 3];
arr.push(4); // ✅ OK (mutation allowed)
arr = []; // ❌ TypeError: Assignment to constant variable
```

---

## Best Practice

- **Use `const` by default** — signals immutability intent
- **Use `let` when reassignment is needed** — signals that value will change
- **Avoid `var`** — it has confusing hoisting and function-scoping behavior

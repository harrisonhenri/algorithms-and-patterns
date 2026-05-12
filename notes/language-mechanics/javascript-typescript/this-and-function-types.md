---
tags: [javascript, functions, this, theory]
title: "this binding and function types"
---

# The `this` Keyword

The value of `this` is determined by **how a function is called**, not where it's defined. Understanding `this` context is crucial for working with objects, methods, and callbacks.

## `this` in Different Contexts

### 1. **Global Context**

In the global scope, `this` refers to the global object:

```jsx
// In browser
console.log(this); // window

// In Node.js
console.log(this); // global (but in modules, this is module.exports)
```

### 2. **Method Call (Object Context)**

When a function is called as a **method of an object**, `this` refers to that object:

```jsx
const user = {
  name: "John",
  greet: function () {
    console.log(this.name); // 'John'
  },
};

user.greet(); // ✅ this = user
```

### 3. **Function Call (Non-method)**

When a function is called directly (not as a method), `this` is undefined (in strict mode) or the global object (in non-strict mode):

```jsx
function greet() {
  console.log(this);
}

greet(); // ❌ undefined (strict) or global (non-strict)

// Problem: method loses context when passed as callback
const user = {
  name: "John",
  greet: function () {
    console.log(this.name);
  },
};

setTimeout(user.greet, 1000); // ❌ undefined or 'undefined' (this is not user)
```

### 4. **Constructor Context**

When a function is called with `new`, `this` refers to the newly created object:

```jsx
function Person(name) {
  this.name = name;
}

const john = new Person("John");
console.log(john.name); // 'John'
```

### 5. **Explicit Binding with `call()`, `apply()`, and `bind()`**

You can explicitly set `this`:

```jsx
function greet(greeting) {
  console.log(greeting + ", " + this.name);
}

const user = { name: "John" };

greet.call(user, "Hello"); // ✅ 'Hello, John' (call executes immediately)
greet.apply(user, ["Hi"]); // ✅ 'Hi, John' (apply takes array of args)

const boundGreet = greet.bind(user, "Hey"); // bind returns a new function
boundGreet(); // ✅ 'Hey, John' (executes later)
```

| Method    | Syntax                        | Executes             | Arguments                 |
| --------- | ----------------------------- | -------------------- | ------------------------- |
| `call()`  | `fn.call(obj, arg1, arg2)`    | Immediately          | Individual args           |
| `apply()` | `fn.apply(obj, [arg1, arg2])` | Immediately          | Array of args             |
| `bind()`  | `fn.bind(obj, arg1, arg2)`    | Returns new function | Individual args (partial) |

---

## Arrow Functions vs Regular Functions

### Key Differences

| Feature                  | Regular Function              | Arrow Function                          |
| ------------------------ | ----------------------------- | --------------------------------------- |
| **Syntax**               | `function() {}` or `() => {}` | `() => {}`                              |
| **`this` binding**       | Bound to caller               | Inherits from enclosing scope (lexical) |
| **`arguments` object**   | ✅ Available                  | ❌ Not available (use rest params)      |
| **Can be constructor**   | ✅ Yes                        | ❌ No (no `new`)                        |
| **`prototype` property** | ✅ Has                        | ❌ No                                   |
| **Implicit return**      | ❌ Need `return`              | ✅ Single expression only               |

### `this` Binding Comparison

**Regular Function**: `this` is bound at **call time**

```jsx
const user = {
  name: "John",
  delayedGreet: function () {
    setTimeout(function () {
      console.log(this.name); // ❌ undefined (this = global)
    }, 1000);
  },
};

user.delayedGreet();
```

**Arrow Function**: `this` is bound at **definition time** (inherits from outer scope)

```jsx
const user = {
  name: "John",
  delayedGreet: function () {
    setTimeout(() => {
      console.log(this.name); // ✅ 'John' (this = user)
    }, 1000);
  },
};

user.delayedGreet();
```

### Practical Example: Fixing the Context Problem

**Problem:** Event handlers lose context

```jsx
class Counter {
  count = 0;

  // ❌ Regular function loses context
  increment = function () {
    this.count++;
    console.log(this.count); // ❌ Error: this is undefined
  };

  // ✅ Arrow function preserves context
  increment = () => {
    this.count++;
    console.log(this.count); // ✅ Works correctly
  };
}
```

Or use `bind()`:

```jsx
class Counter {
  count = 0;

  constructor() {
    // Bind the function to preserve `this`
    this.increment = this.increment.bind(this);
  }

  increment() {
    this.count++;
  }
}
```

### When to Use Each

**Use Regular Functions when:**

- You need independent `this` context
- You need the `arguments` object
- You're creating constructors or prototypes
- You need a `prototype` property

```jsx
function Person(name) {
  this.name = name;
}

const john = new Person("John"); // ✅ Works
```

**Use Arrow Functions when:**

- You want to inherit `this` from the enclosing scope
- You're writing short methods or callbacks
- You want concise syntax for single-expression functions

```jsx
const numbers = [1, 2, 3];
const squared = numbers.map((n) => n * n); // ✅ Clean and concise

const user = {
  name: "John",
  greet: () => console.log(this), // ❌ Don't use for methods!
};
```

### ⚠️ Arrow Functions as Object Methods

**Don't use arrow functions for object methods** — they inherit `this` from the outer scope, not the object:

```jsx
const user = {
  name: "John",
  greet: () => {
    console.log(this.name); // ❌ undefined (this is global/module)
  },
};

user.greet(); // Won't work as intended
```

Use regular functions for methods:

```jsx
const user = {
  name: "John",
  greet: function () {
    console.log(this.name); // ✅ 'John'
  },
};

user.greet(); // Works as intended
```

---

## Summary

| Scenario                 | Best Choice      | Why                     |
| ------------------------ | ---------------- | ----------------------- |
| Object method            | Regular function | Needs `this` = object   |
| Event handler / callback | Arrow function   | Inherits outer `this`   |
| Constructor              | Regular function | Must use `new`          |
| Short expressions        | Arrow function   | Concise syntax          |
| Needs `arguments`        | Regular function | Arrow doesn't have it   |
| Needs independent `this` | Regular function | Different binding model |

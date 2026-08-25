---
tags: [typescript, theory]
title: "Types vs Interfaces vs Enums"
---

# Types vs Interfaces vs Enums

## Short definitions

**`type` (type alias)**

- A **name for any type** (primitive, object, union, tuple, function, etc.).
- Used to **alias** existing types.
- Can represent advanced types (unions, intersections, mapped types, conditional types).

**`interface`**

- Describes the **shape of objects and contracts**.
- Inspired by **object-oriented programming contracts** and works well with classes (`implements`).

**`enum`**

- Defines a set of **named constants** (numeric or string-based).
- A TypeScript-specific construct — it compiles to actual JavaScript code (unlike `type` and `interface`).
- Available in two flavors: regular `enum` and `const enum`.

---

## Key differences

### 1) Declaration merging

- `interface` supports **declaration merging**: multiple declarations with the same name are automatically combined.
- `type` **cannot** be reopened or redeclared — it causes a duplicate identifier error.
- `enum` also supports **declaration merging** (members are merged across declarations with the same name).

> Useful for extending third-party types or global APIs, but can have unintended effects if used carelessly.

### 2) Ability to represent advanced types

- `type` can express:
  - **unions** (`'a' | 'b'`)
  - **intersections** (`A & B`)
  - **tuples**
  - **mapped/conditional types**
- `interface` **cannot** define unions or most of these advanced types.
- `enum` is limited to named constant sets — it cannot express unions or generics.

> `type` is the most expressive and flexible of the three.

### 3) Extension / Inheritance

- `interface` uses `extends`, which is idiomatic for OO-style contracts and polymorphism.
- `type` uses intersection (`&`) to compose types — this works differently and can produce **subtle errors** if properties conflict.
- `enum` does not support extension; you cannot extend or merge enum _values_, only declarations.

### 4) Runtime presence

- `type` and `interface` are **erased at compile time** — they produce no JavaScript output.
- `enum` **emits JavaScript code**:
  ```ts
  enum Direction {
    Up,
    Down,
  }
  // compiles to:
  var Direction;
  (function (Direction) {
    Direction[(Direction["Up"] = 0)] = "Up";
    Direction[(Direction["Down"] = 1)] = "Down";
  })(Direction || (Direction = {}));
  ```
- `const enum` is inlined at compile time and produces no output, but has limitations with `isolatedModules`.

### 5) Numeric vs string enums

```ts
// Numeric enum (default — values auto-increment from 0)
enum Status {
  Pending, // 0
  Active, // 1
  Closed, // 2
}

// String enum (explicit values — preferred for readability and safety)
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

String enums are generally preferred because numeric enums allow **reverse mapping** (`Direction[0]` is valid), which can lead to unexpected behavior.

---

## When to use each — practical rules

### Use `interface` when:

- You want an **open, extensible contract** (e.g., public APIs, objects that may grow).
- You want other parts of the codebase to **extend or augment** the definition.
- You are working with **classes** and want them to `implements` that type.

> Typical example: defining an object shape that multiple packages will extend.

### Use `type` when:

- You need **advanced type features** (unions, conditional types, mapped types).
- You want a type that **should not be accidentally merged**.
- You are modeling **complex or derived types**, not just plain objects.

> Example: `type Event = 'click' | 'keydown'`.

### Use `enum` when:

- You have a **fixed, closed set of named constants** that must exist at runtime.
- You need to **iterate over values** or use them as keys at runtime.
- You want the values to be **self-documenting** in logs, API payloads, or switch statements.

> Prefer **string enums** over numeric enums for clarity and to avoid reverse-mapping pitfalls.

### Consider `as const` as a lightweight enum alternative:

```ts
const Direction = {
  Up: "UP",
  Down: "DOWN",
} as const;

type Direction = (typeof Direction)[keyof typeof Direction]; // 'UP' | 'DOWN'
```

This gives you enum-like named constants with no runtime overhead and full type inference, which is why many teams prefer it over `enum`.

---

## Quick comparison table

| Feature                    | `interface` | `type`              | `enum` |
| -------------------------- | ----------- | ------------------- | ------ |
| Describe object shape      | ✅          | ✅                  | ❌     |
| Union types                | ❌          | ✅                  | ❌     |
| Tuples                     | ❌          | ✅                  | ❌     |
| Declaration merging        | ✅          | ❌                  | ✅     |
| Extendable                 | ✅          | ❌                  | ❌     |
| Mapped / conditional types | ❌          | ✅                  | ❌     |
| Emits runtime JS           | ❌          | ❌                  | ✅     |
| Named constants            | ❌          | ⚠️ (union literals) | ✅     |
| Iterable at runtime        | ❌          | ❌                  | ✅     |

---

## Important notes

**All three can coexist.** A common pattern is to define an `enum` for a fixed set of values and then use a `type` to derive a union or a mapped type from it:

```ts
enum Role {
  Admin = "ADMIN",
  User = "USER",
  Guest = "GUEST",
}
type RolePermissions = Record<Role, string[]>;
```

**`enum` is the only one that can be used in a `switch` with exhaustiveness checking out of the box**, though union types with `never` assertions achieve the same.

---

## Golden rule

> Use `type` by default for closed and advanced types; use `interface` for open, extendable contracts; use `enum` (or `as const`) when you need named constants that exist at runtime.

This combines:

- The modern flexibility of the TS type system
- The OO contract semantics of `interface`
- The runtime utility of `enum`, balanced against the zero-cost alternative of `as const`

---

## Related

- [Type Systems](../../software-architecture/type-systems.md) — Comprehensive guide to structural vs nominal typing, static vs dynamic, and how these concepts apply to TypeScript's design

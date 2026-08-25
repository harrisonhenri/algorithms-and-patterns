---
tags: [architecture, theory, type-systems, structural-typing, nominal-typing]
title: "Type Systems: Structural, Nominal, Static, and Dynamic"
---

# Type Systems

A **type system** is a set of rules that assigns types to expressions in a program and defines which operations are valid on those types.

Type systems are fundamental to how we:
- **Reason about correctness** — can this operation even happen?
- **Enable polymorphism** — how can the same code work with different types?
- **Catch errors** — when do we find mistakes (compile-time vs runtime)?
- **Design abstractions** — what contracts do interfaces establish?

This guide covers the **orthogonal dimensions** of type systems and how they interact.

---

## Quick Reference: Type System Dimensions

Type systems vary along multiple independent axes:

| Dimension | Option A | Option B | Option C |
|-----------|----------|----------|----------|
| **Type identity** | Structural (shape-based) | Nominal (name-based) | — |
| **Checking timing** | Static (compile-time) | Dynamic (runtime) | Gradual (both) |
| **Type inference** | Explicit annotations | Inferred from usage | Mixed |
| **Subtyping** | Structural (shape) | Nominal (hierarchy) | — |

**Key insight:** These dimensions are **independent**. A language can be:
- Static + Structural (TypeScript, Go)
- Static + Nominal (Java, C++, Rust)
- Dynamic + Nominal (Python, Ruby, JavaScript)
- Gradual + Mixed (TypeScript, Python 3.5+)

---

## 1. Structural Typing (Shape-Based Type Compatibility)

### Definition

**Structural typing** determines type compatibility by examining the **structure (shape) of types**, not their declared names.

Two types are compatible if they have the same shape — regardless of whether they were intentionally defined as compatible.

### The Core Principle

> "If it walks like a duck and quacks like a duck, it's a duck."

```
Dog {
  bark(): void
}

Cat {
  bark(): void
}

Since Dog and Cat have the same bark() method,
they are structurally compatible.
```

### Language Examples

**TypeScript** — Structural typing by default (interfaces and types)

```typescript
interface Animal {
  name: string;
  move(): void;
}

class Dog {
  name: string;
  move() { console.log("running"); }
}

class Cat {
  name: string;
  move() { console.log("climbing"); }
}

// ✅ Dog and Cat are structurally compatible with Animal
const animals: Animal[] = [new Dog(), new Cat()];
// No explicit "implements Animal" needed!
```

**Go** — Implicit structural typing

```go
type Reader interface {
  Read(p []byte) (n int, err error)
}

type File struct { /* ... */ }

func (f *File) Read(p []byte) (n int, err error) { /* ... */ }

// ✅ *File is automatically a Reader — no explicit declaration needed
func Process(r Reader) { /* ... */ }
```

**Python (Duck Typing)** — Runtime structural typing

```python
class Dog:
  def bark(self):
    print("Woof!")

class Cat:
  def bark(self):
    print("Meow!")

def make_it_bark(animal):
  animal.bark()  # Works with anything that has bark()

make_it_bark(Dog())  # ✅ Works
make_it_bark(Cat())  # ✅ Works
```

### Advantages

- **Flexibility** — Reuse code without explicit class hierarchies
- **No boilerplate** — No need to declare "implements X"
- **Third-party integration** — External types automatically compatible if structurally matching
- **Decoupling** — Types don't need to know about each other

### Disadvantages

- **Accidental compatibility** — Two unrelated types might match structurally
- **Harder debugging** — "Why is this type accepted?" (unexpected shape match)
- **Large interfaces are brittle** — Small shape changes break compatibility
- **Less explicit intent** — Readers can't see which contract is being used

### When to Use

✅ **Prefer structural typing when:**
- You want **loose coupling** and high flexibility
- You're **integrating external libraries** with compatible shapes
- You want to **avoid rigid hierarchies**
- You need **duck typing** for runtime flexibility

❌ **Avoid structural typing when:**
- You need **explicit contracts** for code clarity
- You want to **prevent accidental compatibility**
- You're modeling **strong semantic boundaries** (e.g., User vs Admin)

---

## 2. Nominal Typing (Name-Based Type Identity)

### Definition

**Nominal typing** determines type compatibility based on **explicit names and declarations**.

Two types are compatible only if they are explicitly related through inheritance, interfaces, or type aliases.

### The Core Principle

> "Types are equal only if they have the same declared name or explicit relationship."

```
class Dog { bark() }
class Cat { bark() }

Even though Dog and Cat have the same bark() method,
they are NOT compatible because they have different names.
```

### Language Examples

**Java** — Explicit nominal typing

```java
interface Animal {
  void move();
}

class Dog implements Animal {
  public void move() { System.out.println("running"); }
}

class Cat implements Animal {
  public void move() { System.out.println("climbing"); }
}

// ✅ Dog and Cat are compatible with Animal
// ❌ But ONLY because they explicitly declare "implements Animal"
// Without the explicit declaration, they would NOT be compatible,
// even if they had identical methods!
```

**Rust** — Nominal trait system

```rust
trait Animal {
  fn move_around(&self);
}

struct Dog;
impl Animal for Dog {
  fn move_around(&self) { println!("running"); }
}

struct Cat;
impl Animal for Cat {
  fn move_around(&self) { println!("climbing"); }
}

// ✅ Only Dog and Cat, which explicitly impl Animal, are compatible
fn run<T: Animal>(animal: T) { animal.move_around(); }
```

**C++** — Nominal class hierarchy

```cpp
class Animal {
public:
  virtual void move() = 0;
};

class Dog : public Animal {
public:
  void move() override { std::cout << "running\n"; }
};

// ✅ Dog is compatible with Animal due to explicit inheritance
// ❌ Any other class with move(), but no inheritance, is NOT compatible
```

### Advantages

- **Explicit intent** — Relationships are declared; readers know what's intended
- **No accidental compatibility** — Must opt-in to relationships
- **Safer refactoring** — Changing a method signature breaks explicit contracts
- **Clear error messages** — "Dog does not implement Animal" is obvious

### Disadvantages

- **Rigid hierarchies** — Must plan inheritance upfront
- **Boilerplate** — Explicit `implements` / inheritance declarations everywhere
- **Hard to integrate** — External types can't retroactively satisfy your interfaces
- **Fragile base class problem** — Parent changes break all children

### When to Use

✅ **Prefer nominal typing when:**
- You need **clear contracts** and explicit relationships
- You want to **prevent accidental compatibility**
- You're modeling **semantic boundaries** with strong intent
- You value **clarity and safety** over flexibility

❌ **Avoid nominal typing when:**
- You want **loose coupling** across many types
- You need **flexible composition** without hierarchies
- You're **integrating external libraries** with compatible shapes

---

## 3. Static vs Dynamic Typing

### Definition

**Static typing** checks types at **compile time** before code runs.
**Dynamic typing** checks types at **runtime** as code executes.

This is **orthogonal to structural vs nominal** — you can mix them.

### Static Typing

Types are checked and enforced before the program runs.

**Advantages:**
- Errors caught early (compile-time)
- Better IDE support and autocomplete
- Optimized by compiler/JIT for runtime performance
- Contracts are explicit and validated upfront

**Disadvantages:**
- Slower development (more annotations)
- Less flexible (some valid patterns forbidden)
- Type annotations can be verbose

**Examples:** Java, C++, Rust, TypeScript (strict mode), Go

```typescript
// TypeScript: Static typing
function add(a: number, b: number): number {
  return a + b;
}

add(5, 10);        // ✅ Compile-time: types match
add("5", 10);      // ❌ Compile-time error
```

### Dynamic Typing

Types are checked as expressions are evaluated at runtime.

**Advantages:**
- Faster to write (no annotations)
- More flexible (duck typing possible)
- No artificial restrictions
- Good for prototyping and scripting

**Disadvantages:**
- Errors caught late (runtime) — harder debugging
- Slower performance (type checks at runtime)
- Less IDE support
- Contracts are implicit

**Examples:** Python, Ruby, JavaScript, Lisp

```python
# Python: Dynamic typing
def add(a, b):
  return a + b

add(5, 10)         # ✅ Runtime: works, both are numbers
add("5", 10)       # ✅ Runtime: works, returns "510" (string concat)
add(5, "10")       # ❌ Runtime error: can't add int and str
```

### Gradual Typing

**Gradual typing** allows **mixing static and dynamic** in the same codebase.

Some expressions have explicit types; others are checked dynamically.

**Benefits:**
- Migrate incrementally from dynamic to static
- Use static where it matters (performance, contracts)
- Use dynamic where flexibility is needed
- Catch errors gradually

**Examples:** TypeScript, Python 3.5+, Mypy, Flow

```typescript
// TypeScript: Gradual typing
function add(a: number, b: unknown) {
  // a is static (number)
  // b is dynamic (unknown)
  if (typeof b === 'number') {
    return a + b;  // ✅ Safe: TypeScript knows b is number here
  }
  return 0;
}
```

### Decision Framework

| Need | Static | Dynamic | Gradual |
|------|--------|---------|---------|
| **Performance critical** | ✅ | ❌ | ⚠️ |
| **Large codebase** | ✅ | ❌ | ✅ |
| **Rapid prototyping** | ❌ | ✅ | ✅ |
| **Early error detection** | ✅ | ❌ | ✅ |
| **Flexible composition** | ⚠️ | ✅ | ✅ |
| **IDE support** | ✅ | ⚠️ | ✅ |

---

## 4. Type Inference

### Definition

**Type inference** is the ability of a language or type checker to automatically deduce the type of an expression without explicit annotation.

### Examples

**Rust** — Strong local type inference

```rust
let x = 5;           // ✅ x: i32 (inferred from literal)
let y = "hello";     // ✅ y: &str (inferred from string literal)

// Can still add explicit annotations when needed
let z: u64 = 5;      // ✅ z: u64 (explicit)
```

**TypeScript** — Contextual type inference

```typescript
// Function return type inferred
function add(a: number, b: number) {
  return a + b;      // ✅ Return type: number (inferred)
}

// Variable type inferred from assignment
const x = 5;         // ✅ x: number (inferred)
const y = [1, 2, 3]; // ✅ y: number[] (inferred)

// Contextual inference
const arr: number[] = [1, 2, 3];
// Element types inferred from array type
arr.forEach((item) => {
  // item: number (inferred from array context)
});
```

**Python with Mypy** — Optional type inference

```python
# No inference in vanilla Python
x = 5
y = "hello"

# With type hints and mypy
x: int = 5           # ✅ Explicit hint
y = "hello"          # ✅ Mypy infers y: str

def add(a: int, b: int) -> int:  # ✅ Return type explicit
  return a + b
```

### Benefits

- **Less boilerplate** — Fewer annotations to write
- **Readability** — Code isn't cluttered with obvious types
- **Safety** — Still get compile-time checking without verbosity
- **Refactoring** — Types propagate automatically through inferred expressions

### Limitations

- **Complex types don't infer** — Functions often need explicit signatures
- **Can be surprising** — Inferred type might not match intent
- **Harder to understand code** — Readers can't see types without IDE

---

## 5. Combining Dimensions: Type System Design Space

Most modern languages occupy different regions of this space:

### TypeScript

- **Structural + Static + Gradual**
- Interfaces match by shape (structural)
- Types checked at compile-time (static)
- Mix typed and untyped code (gradual)

```typescript
// Structural + Static
interface Reader {
  read(): string;
}

class FileReader {
  read() { return "content"; }
}

const reader: Reader = new FileReader();
// ✅ Works: FileReader's shape matches Reader
```

### Java

- **Nominal + Static**
- Types must be explicitly declared
- Checked at compile-time
- No gradual typing

```java
interface Animal { void move(); }
class Dog implements Animal {  // Must declare explicitly
  public void move() { }
}

// Can only use Dog where Animal is expected due to explicit relationship
```

### Go

- **Structural + Static + Inferred**
- Implicit interface satisfaction (structural)
- Compile-time type checking (static)
- Strong type inference

```go
type Reader interface {
  Read([]byte) (int, error)
}

// File automatically satisfies Reader if it has Read method
func ProcessFile(r Reader) { /* ... */ }
```

### Python

- **Structural + Dynamic + Optional Static**
- Duck typing at runtime (structural)
- Runtime type checking (dynamic)
- Optional type hints for tools like mypy (static)

```python
# Runtime duck typing
def process(obj):
  obj.read()  # Works if obj has read() method

# Optional static hints for mypy
from typing import Protocol

class Reader(Protocol):
  def read(self) -> str: ...
```

### Rust

- **Nominal + Static + Inferred**
- Traits must be explicitly implemented (nominal)
- Compile-time checking (static)
- Strong inference for generics

```rust
trait Animal { fn move_around(&self); }

struct Dog;
impl Animal for Dog { fn move_around(&self) { } }

// Strong type inference
let animals: Vec<Box<dyn Animal>> = vec![Box::new(Dog)];
```

---

## 6. How Type Systems Enable Polymorphism

**Polymorphism** (covered in [Generalization and Polymorphism](./generalization-polymorphism.md)) is the ability to write code that works with multiple types.

Type systems enable polymorphism through different mechanisms:

### Structural Polymorphism

Used in structurally-typed languages (TypeScript, Go, Python).

```typescript
// Single implementation works with any type that has bark()
function makePet(animal: { bark(): void }) {
  animal.bark();
}

// Works with Dog, Cat, or any type with bark()
makePet(new Dog());
makePet(new Cat());
```

**Benefit:** No planning needed upfront. Any compatible type works.

### Nominal Polymorphism (Subtype Polymorphism)

Used in nominally-typed languages (Java, C++, Rust).

```java
interface Animal { void move(); }

class Dog implements Animal {
  public void move() { }
}

class Cat implements Animal {
  public void move() { }
}

// Single implementation works with any type that implements Animal
void process(Animal a) {
  a.move();
}

process(new Dog());   // ✅ Upcasting allowed
process(new Cat());   // ✅ Upcasting allowed
```

**Benefit:** Explicit contracts. Clear what types are intended.

### Parametric Polymorphism (Generics)

Works in both structural and nominal systems.

```typescript
// Generic works with any type
function first<T>(arr: T[]): T {
  return arr[0];
}

first([1, 2, 3]);        // ✅ T = number
first(["a", "b"]);       // ✅ T = string
first([new Dog()]);      // ✅ T = Dog
```

**Benefit:** Type-safe code reuse. Single implementation for many types.

---

## 7. Decision Framework: Choosing a Type System

When designing a language or choosing a typing strategy:

### For Flexibility and Ease (Scripting, Prototyping)

→ **Dynamic + Structural** (Python, Ruby, JavaScript)
- No type declarations needed
- Duck typing enables rapid composition
- Errors caught at runtime

### For Safety and Performance (Systems, Large Codebases)

→ **Static + Nominal** (Java, C++, Rust)
- Explicit contracts prevent mistakes
- Compile-time checking catches errors early
- Compiler can optimize aggressively

### For Pragmatic Balance (Web Development, Data Science)

→ **Gradual + Mixed** (TypeScript, Python 3.5+)
- Static types where they matter most
- Dynamic freedom where needed
- Incremental migration path

### For Modern Expressiveness (Modern Systems)

→ **Static + Structural** (Go, TypeScript)
- Compile-time safety
- Implicit structural satisfaction (less boilerplate)
- Type inference reduces annotation verbosity

---

## 8. Anti-Patterns and Common Mistakes

### Mistake 1: Confusing Structural and Nominal

❌ **WRONG:**
```java
// Java: Can't accidentally satisfy an interface structurally
class Dog { public void move() { } }
class Cat { public void move() { } }

// Neither Dog nor Cat satisfies Animal
interface Animal { void move(); }
```

✅ **CORRECT:** Declare explicit relationships
```java
interface Animal { void move(); }
class Dog implements Animal { public void move() { } }
class Cat implements Animal { public void move() { } }
```

### Mistake 2: Over-Inferring Types

❌ **WRONG:**
```typescript
// Type is inferred as number, but we meant string
const status = 200;

// Later, someone treats it as a success code (correct for HTTP)
// But the variable name says "status" — ambiguous intent
```

✅ **CORRECT:** Explicit when intent matters
```typescript
const HTTP_OK: 200 = 200;
const statusCode: number = 200;
```

### Mistake 3: Designing Interfaces Too Broadly (Structural)

❌ **WRONG:**
```typescript
// Too broad — accidentally compatible with unrelated types
interface Thing {
  name: string;
  value: number;
}

class Product implements Thing { }
class Error implements Thing { }  // Oops, not related!
```

✅ **CORRECT:** Narrow, specific interfaces
```typescript
interface Product {
  name: string;
  price: number;
}

interface ErrorInfo {
  name: string;
  code: number;  // "code" not "value"
}
```

---

## Related

- [Generalization and Polymorphism](./generalization-polymorphism.md) — How type systems enable abstraction
- [Types vs Interfaces vs Enums](../language-mechanics/javascript-typescript/types-vs-interfaces-vs-enums.md) — TypeScript-specific type constructs

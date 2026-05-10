---
tags: [architecture, oop, theory]
title: "Generalization and polymorphism"
---
# Generalization

**Generalization** is the process of **identifying common properties, behaviors, or structures among different abstractions and organizing them into a shared abstraction**.

In other words:

```
find commonality
↓
extract an abstraction
↓
reuse it
```

The goal is to reduce:

- code duplication
- conceptual complexity
- coupling

Generalization is a fundamental concept in software design and appears in several different forms.

---

## Hierarchical Generalization (Inheritance)

This is the most classical form of generalization.

A **more general abstraction** captures the common properties of several **more specific abstractions**.

Example in Java:

```java
class Animal {
    void move() {}
}

class Dog extends Animal {}
class Cat extends Animal {}
```

Hierarchy:

```
      Animal
      /   \
    Dog   Cat
```

Two directions exist.

### Generalization (bottom → top)

Extracting common features from specific types.

```
Dog
Cat
 ↓
Animal
```

### Specialization (top → bottom)

Creating more specific types from a general abstraction.

```
Animal
 ↓
Dog
Cat
```

Inheritance allows **code reuse and conceptual organization**.

---

## Genericity (Generics)

Genericity captures commonality **across types** rather than behaviors.

Instead of writing separate implementations for each type, you parameterize the type.

Example in Java:

```java
class Box<T> {
    T value;
}
```

Usage:

```
Box<Integer>
Box<String>
Box<User>
```

The algorithm or structure stays the same; only the **type parameter varies**.

This is also called **parametric polymorphism**.

Benefits:

- type safety
- code reuse
- compile-time verification

---

## Polymorphism

Polymorphism captures **commonality in algorithms**.

An algorithm may need to operate on objects of different types.

A naïve implementation might look like this:

```
if (object is Dog)
   bark()
else if (object is Cat)
   meow()
else if (object is Cow)
   moo()
```

This is a **type-switching algorithm**.

Polymorphism removes this conditional complexity.

Instead:

```
animal.makeSound()
```

Each object decides what to do.

Example in Java:

```java
class Animal {
    void makeSound() {}
}

class Dog extends Animal {
    void makeSound() { bark(); }
}

class Cat extends Animal {
    void makeSound() { meow(); }
}
```

Now the algorithm becomes:

```java
for (Animal a : animals) {
    a.makeSound();
}
```

The algorithm is **uniform**, while the behavior varies.

This is achieved through **dynamic binding**.

---

## Dynamic Binding (Runtime Polymorphism)

Dynamic binding means that the **method implementation is selected at runtime based on the object's actual type**.

Example:

```
Animal a = new Dog();
a.makeSound();
```

Even though the variable type is `Animal`, the runtime type is `Dog`.

So the call resolves to:

```
Dog.makeSound()
```

---

## Static Binding (Compile-Time Polymorphism)

Another form of polymorphism occurs at compile time.

Examples include:

- method overloading
- operator overloading

Example in Java:

```java
void print(int x)
void print(String s)
void print(double d)
```

The compiler decides **which method to call** based on argument types.

This is called **static polymorphism**.

---

## Upcasting

Upcasting converts a **subclass reference to a superclass reference**.

Example:

```java
Dog dog = new Dog();
Animal animal = dog;
```

Hierarchy:

```
Dog → Animal
```

Properties:

- implicit
- safe
- commonly used for polymorphism

Example usage:

```java
Animal a = new Dog();
a.makeSound();
```

The algorithm works with the **general type**, while the runtime object determines behavior.

---

## Downcasting

Downcasting converts a **superclass reference back to a subclass reference**.

Example:

```java
Animal animal = new Dog();
Dog dog = (Dog) animal;
```

Hierarchy:

```
Animal → Dog
```

Properties:

- explicit cast required
- potentially unsafe
- may cause runtime errors

Example of failure:

```java
Animal a = new Animal();
Dog d = (Dog) a;  // runtime error
```

Safe approach:

```java
if (animal instanceof Dog) {
    Dog d = (Dog) animal;
}
```

---

## How Generalization Supports Good Architecture

Generalization enables:

- abstraction
- extensibility
- decoupling
- reuse

For example, an algorithm that works with:

```
List<Animal>
```

does not need to know about:

```
Dog
Cat
Horse
```

New types can be added **without modifying the algorithm**.

This idea is widely discussed in Clean Architecture and Clean Code.

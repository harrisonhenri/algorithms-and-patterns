---
tags: [architecture, solid, theory]
title: "SOLID principles"
---
# SOLID Design Principles (Software Architecture)

## 1. Overview of SOLID

SOLID is a set of **software design principles** that guide how functions and data structures should be organized into modules (often classes). These principles help create **maintainable, flexible, and understandable systems**.

### Goals of SOLID

SOLID aims to produce **mid-level software structures** (modules, classes, components) that:

- **Tolerate change**
- **Are easy to understand**
- **Enable reuse across systems**

These principles operate **above the level of raw code but below full architecture**, helping structure modules and components.

### What is a "Class" in SOLID?

The term *class* should be understood broadly as:

- A **cohesive grouping of functions and data**
- A **module or unit of responsibility**

Thus, SOLID applies even outside classical object-oriented programming.

### Historical Context

- Developed gradually from the **late 1980s**
- Popularized by **Robert C. Martin**
- The acronym **SOLID** was suggested by **Michael Feathers (~2004)**

### The Five SOLID Principles

1. **SRP — Single Responsibility Principle**
2. **OCP — Open-Closed Principle**
3. **LSP — Liskov Substitution Principle**
4. **ISP — Interface Segregation Principle**
5. **DIP — Dependency Inversion Principle**

---

# 2. SRP — Single Responsibility Principle

## Core Idea

A module should have **one and only one reason to change**.

### Interpretation

A module should be responsible to **only one actor**.

An **actor** is a group of stakeholders that require the same type of change.

### Key Insight

SRP is **not** the rule that a function should do only one thing.

That rule applies to **low-level functions**, not modules.

SRP is about **separating responsibilities driven by different stakeholders**.

---

## Cohesion

SRP promotes **cohesion**:

- Cohesion = functions and data that serve the **same actor**

High cohesion → easier maintenance and evolution.

---

## Symptoms of SRP Violation

### 1. Accidental Duplication

Example: `Employee` class

```
Employee
 ├ calculatePay()
 ├ reportHours()
 └ save()
```

Each method belongs to a different actor:

| Method | Actor |
| --- | --- |
| calculatePay() | Accounting |
| reportHours() | HR |
| save() | Database administrators |

Problem:

If `calculatePay()` and `reportHours()` share a helper function:

```
regularHours()
```

A change required by **Accounting** might break **HR reports**.

Result:

- Hidden coupling
- Unexpected bugs

---

### 2. Merge Conflicts

When multiple teams modify the same class:

Example:

- HR modifies `reportHours()`
- DB team modifies `save()`

Both modify `Employee` → merge conflicts.

This increases:

- risk
- coordination overhead
- deployment failures

---

## SRP Solutions

### 1. Separate Responsibilities

Split the class into separate modules:

```
EmployeeData
PayrollCalculator
HoursReporter
EmployeeSaver
```

Each module handles one actor.

Shared structure:

```
EmployeeData
  (data only)
```

---

### 2. Use a Facade

To simplify usage:

```
EmployeeFacade
   ├ PayrollCalculator
   ├ HoursReporter
   └ EmployeeSaver
```

The facade coordinates operations while responsibilities remain separated.

---

## SRP Across Architectural Levels

SRP appears again in other forms:

| Level | Equivalent Principle |
| --- | --- |
| Classes | Single Responsibility Principle |
| Components | Common Closure Principle |
| Architecture | Axis of Change |

---

# 3. OCP — Open-Closed Principle

## Core Idea

Software artifacts should be:

- **Open for extension**
- **Closed for modification**

Meaning:

> New behavior should be added **without modifying existing code**.
> 

---

## Why OCP Matters

If every requirement change forces large code modifications, the architecture has failed.

OCP enables:

- extensibility
- low-risk evolution
- scalable architecture

---

## Example: Financial Report System

Initial system:

- Web page showing financial summary
- Negative numbers in red

New requirement:

- Printable report
- Pagination
- Headers and footers
- Negative numbers in parentheses

Goal: **add functionality without changing existing code**.

---

## Responsibility Separation

Two responsibilities exist:

1. **Calculate report data**
2. **Format the output**

Architecture:

```
Financial Data
     ↓
Report Generator (Interactor)
     ↓
Presenters
     ↓
Views
```

---

## Component Architecture

Main components:

```
Controller
Interactor (business rules)
Database
Presenters
Views
```

Dependency hierarchy:

```
Controller → Interactor
Presenter → Controller
View → Presenter
```

Key rule:

> Dependencies point **toward components we want to protect from change**.
> 

---

## Architectural Insight

Higher-level components should be **protected from lower-level changes**.

Hierarchy example:

| Level | Component |
| --- | --- |
| Highest | Interactor (business rules) |
| Medium | Controller |
| Lower | Presenters |
| Lowest | Views |

Changes to Views should **never impact Interactors**.

---

## Information Hiding

Interfaces hide internal details.

Example:

```
FinancialReportRequester
```

Purpose:

- Prevent the Controller from depending on internal Interactor details.

This avoids **transitive dependencies**.

---

# 4. LSP — Liskov Substitution Principle

## Core Idea

Subtypes must be **substitutable** for their base types without altering program behavior.

Formal definition (Barbara Liskov):

> If S is a subtype of T, objects of type T should be replaceable with objects of type S.
> 

---

## Correct Example

```
License
 ├ PersonalLicense
 └ BusinessLicense
```

Billing system calls:

```
calcFee()
```

The algorithm differs internally but **behavior remains compatible**.

Thus substitution works.

---

## Classic Violation: Square–Rectangle Problem

Design:

```
Rectangle
 ├ setWidth()
 └ setHeight()

Square extends Rectangle
```

Problem:

Rectangle allows width and height to vary independently.

Square must enforce:

```
width = height
```

Example failure:

```
Rectangle r = new Square();
r.setW(5);
r.setH(2);

assert(r.area() == 10); // fails
```

Thus `Square` is **not a valid subtype**.

---

## Architectural Implications

LSP applies not only to classes but also to:

- APIs
- services
- plugins
- microservices

---

## Example: Taxi Dispatch System

Aggregator system dispatches taxis through REST APIs.

Expected interface:

```
/pickupAddress/{}
/pickupTime/{}
/destination/{}
```

But one company uses:

```
/dest/{}
```

Now the system requires:

```
if (company == "Acme") ...
```

Consequences:

- architecture complexity
- special-case logic
- configuration systems

Root cause: **interface incompatibility → LSP violation**

---

# 5. ISP — Interface Segregation Principle

## Core Idea

Clients should **not depend on methods they do not use**.

---

## Problem Example

```
OPS
 ├ op1
 ├ op2
 └ op3
```

Users:

```
User1 → op1
User2 → op2
User3 → op3
```

In static languages:

User1 depends on `OPS`, which contains `op2` and `op3`.

Thus:

- Changes in `op2` force recompilation of User1.

---

## ISP Solution

Split the interface:

```
U1Ops → op1
U2Ops → op2
U3Ops → op3
```

Now dependencies are minimized.

---

## ISP Beyond Programming Languages

Even if dynamic languages reduce compilation issues, the principle still matters.

The deeper problem:

> Depending on **modules with unnecessary functionality**.
> 

---

## Architectural Example

System `S` depends on framework `F`.

```
S → F → Database D
```

If `D` changes (even unused features):

- F must redeploy
- S must redeploy

Thus **unnecessary dependency coupling** exists.

---

# 6. DIP — Dependency Inversion Principle

## Core Idea

High-level policies should **not depend on low-level details**.

Both should depend on **abstractions**.

---

## Dependency Direction

Instead of:

```
High-Level → Low-Level
```

Use:

```
High-Level → Abstraction ← Low-Level
```

---

## Stable Abstractions

Interfaces change **less frequently** than implementations.

Therefore architectures should:

- depend on **interfaces**
- avoid **volatile concrete classes**

---

## DIP Coding Guidelines

1. Do not depend on concrete classes
2. Do not inherit from volatile classes
3. Do not override concrete methods
4. Do not reference volatile implementations directly

---

## Object Creation Problem

Creating objects introduces a dependency on concrete types.

Example:

```
new ConcreteImpl()
```

Solution: **Abstract Factory**

---

## Abstract Factory Pattern

Structure:

```
Application
     ↓
Service (interface)
     ↓
ConcreteImpl
```

Factory creation:

```
ServiceFactory
    ↓
ServiceFactoryImpl
```

Creation flow:

```
Application
   → ServiceFactory
       → ConcreteImpl
```

This isolates the dependency.

---

## Architectural Boundary

DIP creates a boundary between:

```
Abstract Layer (business rules)
Concrete Layer (implementation details)
```

Example:

```
Business Rules
      ↑
Interfaces
      ↑
Frameworks / DB / UI
```

Control flow:

```
UI → Business Logic
```

Dependency direction:

```
UI ← Business Logic
```

This inversion gives the principle its name.

---

## Concrete Components

Some components **must remain concrete** (e.g., main modules).

These are usually:

- startup code
- wiring logic
- dependency configuration

Their role is to **assemble the system while isolating volatility**.

---

# 7. Key Takeaways

### SOLID promotes

- maintainable systems
- low coupling
- high cohesion
- extensibility

### Principle Summary

| Principle | Goal |
| --- | --- |
| SRP | Separate responsibilities by actor |
| OCP | Extend behavior without modifying code |
| LSP | Ensure substitutable implementations |
| ISP | Avoid depending on unused interfaces |
| DIP | Depend on abstractions instead of details |

### Architectural Impact

SOLID ultimately leads to:

- layered architectures
- clear dependency hierarchies
- protected business logic
- flexible evolution of systems

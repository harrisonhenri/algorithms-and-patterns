---
tags: [architecture, clean-architecture, theory]
title: "Clean Architecture and components"
---
# Component-Based Architecture & Code Organization (Clean Architecture)

## 1. Overview

**Four approaches to organize code**:

1. Package by Layer (horizontal)
2. Package by Feature (vertical)
3. Ports & Adapters (hexagonal)
4. Package by Component (recommended refinement)

⚠️ Key insight:

> These approaches **only work if encapsulation is enforced**. Otherwise, they all collapse into the same thing.
> 

---

## 2. Package by Layer (Horizontal)

### Structure

```
web/
  OrdersController

service/
  OrdersService
  OrdersServiceImpl

data/
  OrdersRepository
  JdbcOrdersRepository
```

### Idea

Group code by **technical role**:

- Web
- Business logic
- Persistence

### Pros

- Simple
- Easy to start
- Common in frameworks

### Problems

### 1. Does NOT reflect the business

Two completely different systems may look identical:

```
web / service / repository
```

➡️ Architecture **doesn’t "scream the domain"**

---

### 2. Encourages wrong dependencies

Example (real problem from the book):

```tsx
// ❌ Controller bypassing business logic
ordersController -> ordersRepository
```

➡️ This creates a **relaxed layered architecture**

Which breaks rules like:

> "Controllers should not access repositories directly"
> 

---

### 3. Weak enforcement

Teams rely on:

- Code reviews
- Discipline
- Static analysis

But:

> Humans fail under pressure (deadlines, delivery, etc.)
> 

---

## 3. Package by Feature (Vertical)

### Structure

```
orders/
  OrdersController
  OrdersService
  OrdersRepository
```

### Idea

Group everything by **business concept**

---

### Pros

- Code **reflects domain**
- Easier to find related logic
- Better for changes in a use case

---

### Problem

Still **leaks internal structure**

Other modules can do this:

```tsx
// ❌ accessing internals
import { OrdersRepository } from "../orders";
```

➡️ No strong encapsulation

---

## 4. Package by Component (Key Concept)

### Definition (book + refinement)

> A **component** is:
> 
> - A **group of related functionality**
> - Behind a **clean interface**
> - That can be **independently deployed or evolved**

---

### Structure

```
orders/
  index.ts            // PUBLIC API
  CreateOrder.ts      // use case
  OrderRepository.ts  // internal
  OrderValidator.ts   // internal
```

---

### Public API (critical)

```tsx
// index.ts
export { CreateOrder } from "./CreateOrder";
```

---

### Internal code (hidden)

```tsx
// OrderValidator.ts
export function validateOrder() {}
```

---

### Usage

```tsx
// ✅ correct
import { CreateOrder } from "../orders";

// ❌ forbidden (should be impossible)
import { validateOrder } from "../orders/OrderValidator";
```

---

### Key Idea

> The **compiler enforces architecture**
> 

From the PDF:

> “The fewer public types you have, the smaller the number of potential dependencies.”
> 

---

## 5. OrdersComponent (What it really is)

### ❌ Not just a "use case"

### ✅ It is:

> A **facade/interface** that exposes multiple use cases
> 

---

### Example (Node + TS)

```tsx
// orders/index.ts (public API)
export interface OrdersComponent {
  createOrder(input: CreateOrderInput): Promise<OrderDTO>;
  getOrder(id: string): Promise<OrderDTO>;
}

export { OrdersComponentImpl } from "./OrdersComponentImpl";
```

---

```tsx
// OrdersComponentImpl.ts
export class OrdersComponentImpl implements OrdersComponent {
  constructor(
    private repo: OrderRepository
  ) {}

  async createOrder(input: CreateOrderInput) {
    const order = Order.create(input);
    await this.repo.save(order);
    return OrderMapper.toDTO(order);
  }

  async getOrder(id: string) {
    const order = await this.repo.findById(id);
    return OrderMapper.toDTO(order);
  }
}
```

---

### Controller uses ONLY the component

```tsx
// OrdersController.ts
export class OrdersController {
  constructor(private orders: OrdersComponent) {}

  async create(req, res) {
    const result = await this.orders.createOrder(req.body);
    res.json(result);
  }
}
```

---

### Result

```
Controller → OrdersComponent → (internal stuff hidden)
```

NOT:

```
Controller → Repository ❌
```

---

## 6. Encapsulation vs Organization (CRITICAL)

From the book:

> If everything is public, packages are just folders.
> 

---

### Bad (what most teams do)

```tsx
export class OrdersServiceImpl {}
export class JdbcOrdersRepository {}
```

➡️ Everything accessible from anywhere

➡️ Architecture = illusion

---

### Good (real encapsulation)

Only expose:

```tsx
export { OrdersComponent }
```

Hide:

- repositories
- validators
- mappers
- entities (sometimes)

---

## 7. Why "Architecture that Screams Framework" happens

When you do:

```
controllers/
services/
repositories/
```

You get:

> "This is a Spring app"
> 
> 
> "This is an Express app"
> 

Instead of:

> "This is an Orders system"
> 

---

### Root cause

- Organizing by **technology**
- Not by **business capability**

---

## 8. Dependency Management (Important Concept)

### Flow of control

```
Controller → Interactor → Presenter → View
```

---

### Dependencies (inverted!)

```
View → Presenter → Interactor ← Controller
```

➡️ Dependencies point **inward (to business rules)**

---

### Why?

> Protect high-level policies from low-level details
> 

---

## 9. Real Problem: The “Big Ball of Mud”

Without enforcement:

- Controllers call repositories
- Services bypass rules
- Tests depend on everything

➡️ System becomes:

> tightly coupled, fragile, hard to evolve
> 

---

## 10. Key Takeaways

### Architecture is NOT just structure

It depends on:

- **Encapsulation**
- **Dependency direction**
- **Compiler enforcement**

---

### Golden Rules

- Expose **as little as possible**
- Depend on **interfaces**
- Hide **implementation details**
- Organize around **business capabilities**

---

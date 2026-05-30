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

---

### 3. Weak enforcement

Teams rely on:

- Code reviews
- Discipline
- Static analysis

But:

> Humans fail under pressure (deadlines, delivery, etc.)

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

From the PDF:

> “The fewer public types you have, the smaller the number of potential dependencies.”

---

## 5. OrdersComponent (What it really is)

### ❌ Not just a "use case"

### ✅ It is:

> A **facade/interface** that exposes multiple use cases

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
  constructor(private repo: OrderRepository) {}

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

## 5.5. Connecting: Hexagonal, Clean, Onion Architectures

These three patterns are **closely related** and often confused. They all address the same core problem: **protecting business logic from framework and technical details**. The key difference is how they **organize and name** layers, and crucially, **where they define interfaces**.

### Similarity: They All Enforce Inward Dependencies

All three create **concentric layers** where dependencies point **inward toward domain logic**:

```
Frameworks/External (Adapters, Controllers, DB drivers)
    ↓ (depends on)
Business Rules (Use Cases, Application Logic)
    ↓ (depends on)
Domain/Entities (Pure domain logic, no dependencies)
```

---

## Explicit Organizational Styles

### **Hexagonal Architecture (Ports & Adapters)**

**Philosophy**: Treat all external systems symmetrically; the core domain is surrounded by adapters.

**Typical Folder Structure**:

```
src/
  core/                          # Domain (unexposed)
    domain/
      Order.ts
      OrderRepository.ts         # Interface (port)
    application/
      CreateOrderUseCase.ts

  adapters/                      # All external interactions
    in/                          # Input adapters (primary/driving)
      http/
        OrdersController.ts
      cli/
        OrdersCli.ts
    out/                         # Output adapters (secondary/driven)
      persistence/
        JdbcOrdersRepository.ts   # Implements OrderRepository
      payment/
        StripePaymentAdapter.ts
```

**Key Characteristics**:

- **Interfaces (Ports)** live in core → adapters implement them
- **Symmetry**: HTTP controller = database adapter (both adapters)
- **Naming**: "Adapters" explicitly show these are replaceable connectors
- **Dependency**: Adapters depend on core, never the reverse

**Example Dependency Flow**:

```
HTTP Request → OrdersController (adapter) → OrderRepository (port/interface) → IOrderRepository impl
```

---

### **Clean Architecture**

**Philosophy**: Strict layering with inner layers having no knowledge of outer layers.

**Typical Folder Structure** (organized by feature inside each layer):

```
src/
  1_entities/                    # Innermost (Enterprise Business Rules)
    Order.ts
    OrderValue.ts

  2_use_cases/                   # Application Business Rules
    orders/                      # Feature: Orders
      CreateOrder.ts
      GetOrder.ts
      IOrderRepository.ts        # Interface (gateway)
    payments/                    # Feature: Payments
      ProcessPayment.ts

  3_interface_adapters/          # Controllers, Presenters, Gateways
    controllers/
      orders/
        OrdersController.ts
    presenters/
      OrderPresenter.ts
    gateways/                    # Implementations
      JdbcOrdersRepository.ts

  4_frameworks/                  # Outermost (Frameworks & Drivers)
    express/
      app.ts
    database/
      connection.ts
```

**Key Characteristics**:

- **Strict layering**: Layer N only depends on Layer N-1, never N+1
- **Layer 1 (Entities)**: Pure domain, no dependencies on anything
- **Layer 2 (Use Cases)**: Contains interfaces; is the core policy
- **Layer 3 (Adapters)**: Translates between use cases and frameworks
- **Layer 4 (Frameworks)**: Switches, configuration, plugin details
- **Organization**: Often organized by feature **within** each layer (OrdersController in feature folder)

**Example Dependency Flow**:

```
Express app (L4) → OrdersController (L3) → CreateOrder (L2, use case) → Order (L1, entity)
```

**No reverse dependency**: Entity never "knows about" Express or databases.

---

#### **Clean Architecture Variation: Feature-First Organization**

Some teams invert the structure: organize by **feature first**, then by **layer within each feature**:

```
src/
  orders/                        # Feature: Orders
    entities/
      Order.ts
      OrderValue.ts
    use_cases/
      CreateOrder.ts
      GetOrder.ts
      IOrderRepository.ts        # Interface (gateway)
    controllers/
      OrdersController.ts
    adapters/
      JdbcOrdersRepository.ts    # Implements IOrderRepository

  payments/                      # Feature: Payments
    entities/
      Payment.ts
    use_cases/
      ProcessPayment.ts
      IPaymentProvider.ts
    controllers/
      PaymentsController.ts
    adapters/
      StripePaymentAdapter.ts

  shared/                        # Cross-cutting concerns
    utils/
    types/
    config/
```

**Key Characteristics**:

- **Feature-first organization**: All Orders code lives in `orders/`, all Payments code in `payments/`
- **Layering within features**: Each feature has its own `entities/`, `use_cases/`, `controllers/`, `adapters/`
- **Locality**: Related code is physically close, easier to navigate
- **Scalability**: Adding new features doesn't pollute the root structure
- **Dependency rule still holds**: Layers within a feature follow the same rules (entities → use cases → controllers)

**Pros**:

- 🎯 **Easier to navigate**: Find all Orders code in one place
- 🧱 **Better for large teams**: Reduce merge conflicts (feature teams own their folder)
- 📦 **Scales well**: 50 features don't create 50+ root folders
- 🔍 **Domain-driven**: Feature folders are business concepts, not technical layers

**Cons**:

- 🤔 **More folders to traverse**: Slightly deeper hierarchy
- ⚠️ **Can blur layer boundaries**: Tempting to make features depend on each other directly

**Comparison to Standard Clean**:

| Aspect                         | Standard Clean                                                | Feature-First                                             |
| ------------------------------ | ------------------------------------------------------------- | --------------------------------------------------------- |
| **Root structure**             | `1_entities/`, `2_use_cases/`, `3_adapters/`                  | `orders/`, `payments/`, `shared/`                         |
| **Code location**              | Orders code scattered across 3+ directories                   | Orders code in one `orders/` folder                       |
| **Navigating a feature**       | Jump between `use_cases/orders/`, `controllers/orders/`, etc. | Stay in `orders/` folder                                  |
| **Cross-feature dependencies** | Easier to accidentally create (same layer)                    | Harder to accidentally create (different folders isolate) |
| **New team member**            | Takes time to understand layer structure                      | Naturally understands: "go to orders/ folder"             |
| **Monorepo scaling**           | Can get messy with many features                              | Cleaner with many features                                |

**When to use Feature-First Clean**:

- Medium to large teams
- Many features (10+)
- Need to reduce cognitive load
- Want clear feature boundaries

**When to use Standard Clean**:

- Small projects
- Want to emphasize strict layer separation
- Teaching/learning purposes
- Highly reusable entities across features

---

### **Onion Architecture**

**Philosophy**: Domain at center; layers wrap around it like an onion. Interfaces defined at domain boundary.

**Typical Folder Structure** (also organized by feature):

```
src/
  domain/                        # Core (innermost)
    IOrderRepository.ts          # Interfaces defined HERE (crucial!)
    Order.ts
    OrderValidator.ts

  application/                   # Around domain
    orders/                      # Feature: Orders
      CreateOrderHandler.ts
      GetOrderHandler.ts
    shared/
      ServiceLocator.ts

  infrastructure/                # Around application
    persistence/
      JdbcOrdersRepository.ts    # Implements domain interface
      DbConnection.ts
    external/
      StripePaymentService.ts

  presentation/                  # Outermost
    http/
      OrdersController.ts
    cli/
      OrdersCli.ts
```

**Key Characteristics**:

- **Interfaces live in domain layer** (not in infrastructure)
- **Inversion of Control**: Infrastructure implements domain interfaces
- **True dependency inversion**: Outer layers depend on inner contracts
- **Organization**: Often feature-based in application layer (OrdersHandler)

**Example Dependency Flow**:

```
OrdersController → CreateOrderHandler → IOrderRepository (domain interface)
                                             ↑ (implemented by)
                                    JdbcOrdersRepository (infrastructure)
```

**Critical difference from Clean**: Interfaces are **domain artifacts**, not layer artifacts.

---

## Side-by-Side Comparison: Code Organization

For the same "Orders" module, here's how each organizes it:

### Hexagonal Version:

```
src/domain/
  Order.ts
  IOrderRepository.ts

src/adapters/in/http/
  OrdersController.ts

src/adapters/out/db/
  JdbcOrdersRepository.ts (implements IOrderRepository)
```

### Clean Version (Standard - Layer First):

```
src/entities/
  Order.ts

src/use_cases/orders/
  IOrderRepository.ts (gateway interface)
  CreateOrder.ts

src/interface_adapters/controllers/orders/
  OrdersController.ts

src/interface_adapters/gateways/
  JdbcOrdersRepository.ts (implements IOrderRepository)
```

### Clean Version (Feature-First - Popular Variation):

```
src/orders/
  entities/
    Order.ts
  use_cases/
    CreateOrder.ts
    GetOrder.ts
    IOrderRepository.ts
  controllers/
    OrdersController.ts
  adapters/
    JdbcOrdersRepository.ts (implements IOrderRepository)
```

### Onion Version:

```
src/domain/
  Order.ts
  IOrderRepository.ts (defined here!)

src/application/orders/
  CreateOrderHandler.ts

src/infrastructure/persistence/
  JdbcOrdersRepository.ts (implements domain IOrderRepository)

src/presentation/http/
  OrdersController.ts
```

---

## Key Differences Summarized

| Aspect                       | Hexagonal                          | Clean (Standard)                                 | Clean (Feature-First)                     | Onion                                        |
| ---------------------------- | ---------------------------------- | ------------------------------------------------ | ----------------------------------------- | -------------------------------------------- |
| **Folder naming**            | `domain/`, `adapters/`             | `entities/`, `use_cases/`, `interface_adapters/` | `orders/`, `payments/` (features)         | `domain/`, `application/`, `infrastructure/` |
| **Organization principle**   | Ports & Adapters                   | Strict layers first                              | Features first, then layers               | Concentric rings                             |
| **Root structure**           | `core/` + `adapters/`              | Numbered layers (1,2,3,4)                        | Feature folders                           | Concentric layers                            |
| **Where interfaces live**    | Core/domain                        | Use case layer (Layer 2)                         | Within feature folder                     | Domain layer (center)                        |
| **Navigability**             | Good (related code in core/)       | Scattered (Orders code in multiple places)       | **Excellent** (all Orders in one folder)  | Good (by ring)                               |
| **Scale with many features** | OK (adapters folder grows)         | Struggles (many feature subfolders)              | **Excellent** (clean feature separation)  | Good                                         |
| **Typical file structure**   | `adapters/in/` and `adapters/out/` | `use_cases/`, `controllers/`, `gateways/`        | `feature/entities/`, `feature/use_cases/` | `domain/`, `application/`, `infrastructure/` |
| **Dependency rule**          | Adapters → Core                    | Layer N → Layer N-1                              | Layer N → Layer N-1 (within feature)      | Outer → Inner (always)                       |
| **Input/Output symmetry**    | Yes (all "adapters")               | No (layers differ)                               | No (layers differ)                        | No (layers differ)                           |

---

## Which to Use?

- **Hexagonal**: Best when you have multiple input/output channels (HTTP, CLI, gRPC all equally important)
- **Clean (Standard)**: Best when you want very explicit, numbered layers and clear separation of concerns (teaching/small projects)
- **Clean (Feature-First)** ⭐: **Most practical for real projects** — balances layer separation with code locality. Best for medium to large teams
- **Onion**: Best when you want **domain-driven design** with domain-defined contracts (true inversion of control)

**All approaches achieve the same goal**: dependency inversion, framework independence, and testable domain logic.

---

## Incorrectness: What All Three Forbid

```tsx
// ❌ WRONG in ALL THREE architectures
export class OrdersController {
  constructor(private repo: JdbcOrdersRepository) {}

  async create(req, res) {
    const order = new Order(req.body);
    await this.repo.save(order); // Direct access bypasses all layers!
    res.json(order);
  }
}
```

**Violates all three**:

- Hexagonal: Adapter directly depends on another adapter (not on a port)
- Clean: Layer 4 depends on Layer 1 directly, skipping layers
- Onion: Presentation depends on infrastructure implementation, not domain interface

---

## Correct in All Three

```tsx
// ✅ Interface/Port defined first
export interface OrderRepository {
  save(order: Order): Promise<void>;
}

// ✅ Controller depends on abstraction
export class OrdersController {
  constructor(private service: OrderService) {} // Or OrdersPort, or handler

  async create(req, res) {
    const result = await this.service.createOrder(req.body);
    res.json(result);
  }
}

// ✅ Implementation is pluggable
export class JdbcOrdersRepository implements OrderRepository {
  async save(order: Order) {
    /* JDBC code */
  }
}
```

All three agree: **depend on abstractions, implement details pluggably**.

---

## 6. Encapsulation vs Organization (CRITICAL)

From the book:

> If everything is public, packages are just folders.

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
export { OrdersComponent };
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
> "This is an Express app"

Instead of:

> "This is an Orders system"

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

---

## 9. Real Problem: The “Big Ball of Mud”

Without enforcement:

- Controllers call repositories
- Services bypass rules
- Tests depend on everything

➡️ System becomes:

> tightly coupled, fragile, hard to evolve

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

## 11. Functional Decomposition Trap

### What is Functional Decomposition?

Functional decomposition means breaking a system into services (or components) by **what the system does step-by-step** — the technical pipeline — rather than by **what business rules belong together**.

```
# ❌ Functional decomposition (steps/pipeline)
TaxiFinder
TaxiSelector
TaxiDispatcher
```

Each service owns one step of the workflow. Looks clean. Fails in practice.

---

### A Real Example: Adding "Kitten Delivery"

Imagine the original system:

```
request → TaxiFinder → TaxiSelector → TaxiDispatcher
```

Then the business adds: **deliver cats, not just humans**.

New rules:

- Driver may be allergic to cats
- Customer may be allergic to cats
- Car used for cat transport has a 3-day restriction afterward
- Only some suppliers support cat delivery

Where do these rules go?

| Service        | What changes                            |
| -------------- | --------------------------------------- |
| Taxi UI        | must expose "deliver cat" option        |
| TaxiFinder     | must filter allergic drivers            |
| TaxiSelector   | must apply allergy and preference rules |
| TaxiDispatcher | must route to capable suppliers         |
| Suppliers      | must support the new operation type     |

**Every service changes.** This is a **cross-cutting concern**.

---

### What is a Cross-Cutting Concern?

> A business rule or feature that **spans multiple components** and cannot be cleanly assigned to any single one.

When a feature forces you to change every service:

- You lose deploy independence
- You need coordinated releases
- One team's bug blocks another's release
- Services are coupled even though they look separate

---

### Why Functional Decomposition Causes This

Functional decomposition aligns services to **technical phases**, not to **business policies**. When a new business requirement arrives, it rarely respects your technical phases — it has its own shape that cuts across them.

```
# What you designed:
Finder → Selector → Dispatcher

# What the business added:
         KittenDelivery
         (which touches all three)
```

The architecture was optimized for the **original flow**, not for **future business rules**.

---

### The Right Decomposition: By Business Capability

Instead of steps, organize around **what policies and rules belong together**:

```
# ✅ business-capability decomposition
RideService          # standard rides
KittenDeliveryService  # cat transport rules
AllergyPolicy        # allergy enforcement (domain service)
VehiclePolicy        # vehicle eligibility rules (domain service)
```

Now:

- `KittenDeliveryService` owns the full business rule about cat transport
- `AllergyPolicy` is a domain rule used by services that need it
- **Adding kitten delivery = change one bounded context**, not all services

---

### Use Cases as the Unit of Isolation

The same applies within a single service. Instead of spreading logic:

```ts
// ❌ logic scattered across the pipeline
if (hasKitten) {
  /* in Finder */
}
if (allergy) {
  /* in Selector */
}
if (kittenSupplier) {
  /* in Dispatcher */
}
```

Centralize it into a use case:

```ts
// ✅ one use case owns all rules for this scenario
class SelectTaxiForKittenDelivery {
  execute(input: KittenRideInput) {
    this.allergyPolicy.check(input.driver, input.passenger);
    this.vehiclePolicy.checkKittenEligibility(input.vehicle);
    return this.finder.findKittenCapableDrivers(input);
  }
}
```

This is why Clean Architecture puts **Use Cases at the center**: they're the unit that captures a complete business scenario, not a single technical step.

---

### Answering: What Should Be a Separate Service?

This is the practical question in microservices design.

#### 1. Use Cases — `RideService` vs `KittenDeliveryService`

**Yes, these can and should be different services** if they have:

- Different rate of change (kitten delivery changes more often)
- Different team ownership
- Different SLA/scaling requirements
- Distinct domain rules that don't overlap

They map to **Bounded Contexts** in DDD. Each service owns its domain model independently.

```
RideService:
  - own Ride entity
  - own Driver concept (only ride-relevant attributes)

KittenDeliveryService:
  - own Delivery entity
  - own Driver concept (allergy, eligibility — different attributes)
```

Both have a "Driver", but they mean **different things** in each context. This is intentional.

#### 2. Policies — `AllergyPolicy`, `VehiclePolicy`

**Usually NOT separate microservices.** Policies are **domain services** — pure business rules with no state of their own. They belong _inside_ the service that uses them.

```ts
// ✅ Domain service — lives inside KittenDeliveryService
class AllergyPolicy {
  check(driver: Driver, passenger: Passenger): void {
    if (driver.isAllergicToCats && passenger.hasACat) {
      throw new AllergicDriverException();
    }
  }
}
```

Making policies separate microservices creates:

- Network call overhead for pure business logic
- Distributed coupling (all services depend on AllergyPolicy service)
- A shared service that becomes a bottleneck

**Exception**: If a policy is truly shared across many bounded contexts and changes independently (e.g., a regulatory compliance engine), a separate service can make sense — but it's the exception, not the rule.

#### 3. Finder / Dispatcher (Infra/Adapters)

**Not separate services — these are adapters.** They are infrastructure details:

- `TaxiFinder` queries a database or external API → it's an **output adapter**
- `TaxiDispatcher` sends a command to a driver → it's an **output adapter** or an **event publisher**

```
# In hexagonal terms:
KittenDeliveryService (core domain)
  ├── AllergyPolicy (domain rule)
  ├── VehiclePolicy (domain rule)
  ├── DriverRepository (port/interface)  ← implemented by DriverFinder
  └── DispatchPort (port/interface)      ← implemented by TaxiDispatcher
```

The Finder and Dispatcher are **implementations of ports** — they live in the infrastructure layer and are injected into the use case. They are not business logic; they are how the service talks to the outside world.

**Separating them into microservices** is the exact functional decomposition anti-pattern: you split a single business operation into multiple technical steps that become tightly coupled at deployment.

---

### Summary: The Decision Rule

| What is it?                                   | Separate service? | Why?                                                      |
| --------------------------------------------- | ----------------- | --------------------------------------------------------- |
| Distinct business capability (Ride vs Kitten) | ✅ Yes            | Different bounded contexts, different change rate         |
| Domain policy/rule (AllergyPolicy)            | ❌ No             | Business rule, lives inside the owning service            |
| Infrastructure adapter (Finder, Dispatcher)   | ❌ No             | It's a port implementation, not a separate concern        |
| Shared compliance/regulation engine           | ⚠️ Maybe          | Only if it truly needs to evolve and deploy independently |

> **The signal for a service boundary**: a team could own it end-to-end, change it independently, and deploy it without coordinating with others. If a change to this "service" always requires changes in others — it's not a real service, it's a tightly coupled module wearing a service costume.

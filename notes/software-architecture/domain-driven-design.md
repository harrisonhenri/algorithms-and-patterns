---
tags: [architecture, ddd, theory]
title: "Domain-Driven Design"
---

# DDD

![image.png](../assets/microservices/ddd.png)

## Entities

A unique thing (that can be distinguished) that can be continuously changed over time. It can be a person, car, city, etc. It is NOT a database table or an object from an ORM!!!!

<aside>
Avoid anemic entities (those that only have getters and setters, transporting data between application layers without containing business rules) that don't self-validate!

</aside>

## Value Objects

An object whose immutable attributes are the most important aspect. Example: address.

## Aggregate

A collection of associated objects that can be treated as a unit. Example: Order and Order Items.

## Bounded Contexts

Defines the boundary within which a specific domain model applies. Ensures that terms and concepts are consistent within this boundary, reducing complexity and ambiguity.

## Domain Events

Used to notify other bounded contexts about domain changes. Tipically, only aggregates should publish domain events.

```tsx
// domain-event-example.ts

// 1. Base Domain Event interface
interface DomainEvent {
  readonly occurredAt: Date;
  readonly name: string;
}

// 2. Concrete Domain Event
class UserRegistered implements DomainEvent {
  readonly occurredAt = new Date();
  readonly name = "UserRegistered";

  constructor(
    public readonly userId: string,
    public readonly email: string,
  ) {}
}

// 3. User Aggregate Root
class User {
  public readonly domainEvents: DomainEvent[] = [];

  constructor(
    public readonly id: string,
    public readonly email: string,
  ) {}

  static register(id: string, email: string): User {
    const user = new User(id, email);
    user.domainEvents.push(new UserRegistered(id, email));
    return user;
  }
}

// 4. Event Dispatcher
type EventHandler<T extends DomainEvent> = (event: T) => void;

class DomainEventDispatcher {
  private handlers: { [eventName: string]: EventHandler<any>[] } = {};

  register<T extends DomainEvent>(eventName: string, handler: EventHandler<T>) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);
  }

  dispatch(event: DomainEvent) {
    const handlers = this.handlers[event.name] || [];
    handlers.forEach((handler) => handler(event));
  }

  dispatchAll(events: DomainEvent[]) {
    events.forEach((event) => this.dispatch(event));
  }
}

// 5. Setup: Register Listener
const dispatcher = new DomainEventDispatcher();

dispatcher.register("UserRegistered", (event: UserRegistered) => {
  console.log(`📨 Sending welcome email to ${event.email}`);
});

// 6. Simulate usage
const user = User.register("1", "harrison@example.com");
dispatcher.dispatchAll(user.domainEvents);
```

---

## Functional Decomposition Anti-Pattern

**The mistake:** Organizing services by technical function rather than business domain.

**Example (BAD):**

```
UserService (all user operations)
OrderService (all order operations)
PaymentService (all payment operations)
↓
But payment logic is entangled: user validation, order state, pricing
Each service touches every domain; no clear ownership
```

**The problem:**

- Services become god objects touching all domains
- Tight coupling across technical boundaries
- Hard to change one domain without affecting others
- Scaling is limited to entire service (not per-domain)

**Domain decomposition (GOOD):**

```
OrderDomain owns: order creation, fulfillment, cancellation
PaymentDomain owns: payment processing, reconciliation
UserDomain owns: authentication, profile
↓
Each domain has clear business responsibility
Changes in one domain don't leak to others
Can scale and deploy independently
```

---

## Bounded Contexts and Context Mapping

### Defining Bounded Context Boundaries

A bounded context is a boundary around a domain model where:

1. **Clear ownership**: One team responsible for one context
2. **Consistent language**: Terms have one meaning within the boundary
3. **Isolated model**: Internal representation can differ from other contexts
4. **Explicit contract**: Interfaces to other contexts are well-defined

### Context Mapping: Relationships Between Contexts

When multiple bounded contexts need to interact, define the relationship:

#### 1. Conformist

The downstream context **accepts the upstream model as-is**:

```
Payment Context (upstream)
  publishes: PaymentProcessed event with {paymentId, orderId, amount, timestamp}
    ↓
Order Context (downstream)
  consumes: PaymentProcessed event
  maps internally: orderId → OrderAggregate, updates status
```

**When to use:**

- Upstream is a core system (bank API, payment gateway)
- Downstream can adapt without business loss
- Integration cost < value of stability

**Risk:** Tight coupling; upstream changes ripple downstream

#### 2. Anti-Corruption Layer (ACL)

The downstream context **translates upstream model** to its own model:

```
Legacy Inventory System (upstream, hard to change)
  API returns: {product_code: "ABC", qty_on_hand: 50, unit_price: "99.99"}
    ↓
Order Context (downstream, owns order fulfillment)
  ACL translates to: {productId, availableQty, priceInCents}
  stores internally: Order.LineItem{productId, quantity, unitPrice}
```

**When to use:**

- Upstream model is legacy, complex, or volatile
- Downstream has stricter consistency requirements
- Want to isolate upstream changes

**Trade-off:** Translation cost, more code

#### 3. Shared Kernel

Two contexts **share a core model** (rarely recommended):

```
Shared:
  User { id, email, name }

Auth Context:
  AuthUser extends User { passwordHash, lastLogin }

Profile Context:
  ProfileUser extends User { bio, avatar }
```

**Risk:** Changes to shared kernel require coordination; high coupling

#### 4. Separate Ways

Two contexts **don't integrate**; each maintains its own model independently:

```
Analytics Context:
  owns: Event logs, aggregations
  does NOT call: Order Context directly

Order Context:
  owns: order lifecycle
  does NOT consume: Analytics events

Integration: Asynchronous event stream (optional)
```

**When:** Contexts have divergent needs; sync integration would be painful

---

## Architecture Quality Depends on Domain Model Quality

**Key insight:**

> A well-designed system follows domain boundaries. A poorly-designed domain model will create architectural friction no matter what technology you choose.

### How Domain Model Quality Drives Architecture

**Poor domain model:**

```
Order contains: Customer, Payment, Shipping, Billing, Inventory
→ Order becomes a god object
→ Cannot decompose into services (all data is tangled)
→ Must use shared database (no domain ownership)
→ Result: monolith, tight coupling
```

**Good domain model:**

```
OrderDomain: Order, LineItem, OrderStatus
PaymentDomain: Payment, PaymentMethod, Receipt
ShippingDomain: Shipment, TrackingInfo
InventoryDomain: Stock, Allocation

Services map cleanly to domains
Services own independent databases
Clear contracts between services
Result: scalable, loosely-coupled microservices
```

### Reinforcement Loop

```
Good domain model
  ↓
Clear service boundaries
  ↓
Decoupled architecture
  ↓
Easier to scale + maintain
  ↓
Team can reason about system
```

vs.

```
Poor domain model
  ↓
Fuzzy service boundaries
  ↓
Tangled dependencies
  ↓
Hard to scale or maintain
  ↓
Team struggles; more rewrites
```

---

## DDD & Event-Driven Architecture

Domain-driven design and event-driven architecture are **complementary**:

**DDD provides:** Domain modeling, bounded contexts, language clarity
**EDA provides:** Asynchronous communication, event sourcing, scalability

**Integration:**

- Domain events (DDD concept) are published to event streams (EDA infrastructure)
- Bounded contexts communicate via domain events
- Event sourcing naturally preserves domain audit trail
- See [event-driven-architecture.md](../system-design/event-driven-architecture.md) for event stream patterns

---

## References

- Evans, E. "Domain-Driven Design" (Addison-Wesley, 2003)
- Vernon, V. "Implementing Domain-Driven Design" (Addison-Wesley, 2013)
- Related: [Event-Driven Architecture](../system-design/event-driven-architecture.md), [Transactions and Concurrency](../system-design/transactions-and-concurrency.md)

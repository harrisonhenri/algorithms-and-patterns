---
tags: [concurrency, theory]
title: "Scheduling models"
---
# Scheduling models

- **Necessary:** To manage CPU time among multiple tasks and ensure responsiveness, fairness, or real-time guarantees.
- **Unnecessary:** In very simple, single-task systems where no concurrency is required.

---

## Preemptive vs Cooperative Scheduling

Scheduling strategies that define **who controls when a task stops running**.

### Cooperative scheduling (non-preemptive)

A cooperative model where **tasks voluntarily yield control** of the CPU.

- A task runs until it:
    - explicitly yields
    - blocks on I/O
    - finishes execution
- The scheduler **cannot interrupt** a running task

**Characteristics**

- Simple to implement
- Low overhead
- A single misbehaving task can block the entire system
- Poor real-time guarantees

**Common use cases**

- Event loops
- Coroutines / async–await
- UI frameworks
- Early operating systems

---

### Preemptive scheduling

A preemptive model where the **scheduler can interrupt tasks at any time**.

- Tasks are stopped via:
    - timer interrupts
    - priority rules
- The system saves context and switches execution automatically

**Characteristics**

- Fair CPU sharing
- Strong responsiveness
- Supports real-time constraints
- Requires synchronization primitives (locks, mutexes)

**Common use cases**

- Modern operating systems (Linux, Windows, macOS)
- RTOS environments
- Multithreaded applications

---

## Time slicing

A mechanism commonly used in **preemptive systems**.

- Each task gets a fixed time quantum
- When time expires, the scheduler preempts the task
- Often implemented as round-robin scheduling

---

## Priority-based scheduling

A scheduling strategy where **higher-priority tasks preempt lower-priority ones**.

- Critical tasks can interrupt non-critical ones
- Common in real-time systems

**Risk**

- Priority inversion (mitigated with priority inheritance)

---

## Coroutines and async models

Concurrency mechanisms that are **cooperative by design**.

- Execution switches only at explicit suspension points
- No true parallelism unless backed by threads

**Examples**

- JavaScript async/await
- Python asyncio
- Kotlin coroutines

---

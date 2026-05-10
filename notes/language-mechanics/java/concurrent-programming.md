---
tags: [java, concurrency, theory]
title: "Java concurrent programming"
---
# Concurrent programming (java)

## volatile

Field declaration that provides visibility for a shared data among different threads. This feature is rarely used, since, generally threads want to read and write a shared data.

## synchronized

Declaration that can be used as block or in a method providing visibility and atomicity (mutual exclusion, or all or nothing) for a shared data among different threads. Ensures that one and one only thread can enter the synchronized chunk, so, it's a pessimistic approach.

## atomic

Similar to synchronized, but applied to only one variable.

## adders

It has a higher comsuption memory. Use when writes are more common than reads.

### cas

Technique used when designing concurrent algorithms. It is one of the atomic methods and its implementation used low-level abstractions (tipically, hardware based)./

## Thread execution

The code to be executed by the thread must be specified to meet the runnable interface.

### Executor Service

Part of the concurrency api introduced as a high level replacement for working with threads directly. In addition to runnable, executor service accepts a callable interface (similar to runnable, but it returns a value). The executor service must be stopped explicitly:

- shutdown: waits for currently tasks to finish
- shutdown: interrupts all running tasks and shutdown the executor

It also enables to run scheduled tasks periodically.

## Alternatives to volatile, atomic and synchronized

### monitor

A monitor is an object shared safely by more than one thread. The object class was designed to allow any object behave like a monitor. Enables the synchronized keyword.

Availables locks:

- Reentrant lock: mutual exclusion with the same basic beahvior as the implicit monitors accessed via the synchronized keyword. New calls to a acquired lock is gonna cause a pause until the lock is released
- Read write lock: maintains two locks, one for read and another for write. The read-lock can be held simultaneously by multiple threads as long as no threads hold the write-lock
- Stampled lock: also supports read and write locks but its methods return a stamp represented by a long value. These stamps can be used to either release a lock or to check if the lock is valid. It suports a optimistic mode

### semaphores

Locks grant exclusive access to variables, but a sempahore maintains a set of permits. Useful in case we have to limit the amount of concurrent access.

### concurrent maps

Extend the Map interface adding thread-safe operations.

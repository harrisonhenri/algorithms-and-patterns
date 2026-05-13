---
tags: [java, jvm, memory, theory]
title: "Heap, stack, call stack"
---

# Heap, Stack & Call Stack (JVM)

---

## Overview

The JVM splits memory into several distinct regions, each with a different purpose, lifecycle, and GC behaviour.

```
┌─────────────────────────────────────────────────────────┐
│                        JVM Memory                       │
│                                                         │
│  ┌──────────────────────┐   ┌───────────────────────┐  │
│  │        Heap          │   │   Non-Heap / Off-heap  │  │
│  │  ┌────────────────┐  │   │  ┌─────────────────┐  │  │
│  │  │   Young Gen    │  │   │  │   Metaspace      │  │  │
│  │  │ Eden | S0 | S1 │  │   │  │ (class metadata) │  │  │
│  │  └────────────────┘  │   │  └─────────────────┘  │  │
│  │  ┌────────────────┐  │   │  ┌─────────────────┐  │  │
│  │  │   Old Gen      │  │   │  │   Code Cache     │  │  │
│  │  │  (Tenured)     │  │   │  │   (JIT output)   │  │  │
│  │  └────────────────┘  │   │  └─────────────────┘  │  │
│  └──────────────────────┘   └───────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Per-Thread Memory (one per thread)              │  │
│  │  ┌────────────┐  ┌───────────┐  ┌────────────┐  │  │
│  │  │   Stack    │  │   PC Reg  │  │ Native Stk │  │  │
│  │  └────────────┘  └───────────┘  └────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Stack

- One stack **per thread**, created when the thread starts, destroyed when it exits.
- Stores **stack frames** — one frame per method invocation.
- Each frame holds:
  - **Local variables** (primitives and object references)
  - **Operand stack** (intermediate computation values)
  - **Reference to the runtime constant pool** of the current class
- Memory is allocated/deallocated in LIFO order — extremely fast.
- **Fixed size** (configurable via `-Xss`). Overflow → `StackOverflowError` (e.g., unbounded recursion).
- **Not shared** between threads — no synchronization needed for stack data.

### What lives on the stack

| Data                                                    | Location |
| ------------------------------------------------------- | -------- |
| Primitive local variables (`int`, `long`, `boolean`, …) | Stack    |
| Object **references** (the pointer)                     | Stack    |
| Method arguments                                        | Stack    |
| Return address                                          | Stack    |
| Object **contents**                                     | Heap     |

---

## Heap

- **Shared** across all threads — requires GC and synchronization.
- All object instances and arrays are allocated here.
- Managed by the **Garbage Collector**.
- Size controlled by `-Xms` (initial) and `-Xmx` (max). Exceeded → `OutOfMemoryError: Java heap space`.

### Generational structure

#### Young Generation

New objects are allocated in **Eden**. When Eden fills up, a **Minor GC (Scavenge)** runs:

1. Live objects are copied to a **Survivor space** (S0 or S1).
2. Objects that survive enough Minor GCs (threshold controlled by `-XX:MaxTenuringThreshold`, default 15) are **promoted** to Old Gen.
3. Dead objects are discarded — no sweep needed.

```
Allocation → Eden
                 ↓ (Minor GC)
       Survivor S0 ↔ Survivor S1  (ping-pong copy)
                 ↓ (after N GCs)
             Old Gen (Tenured)
```

#### Old Generation (Tenured)

- Holds long-lived objects.
- Collected by **Major GC** (Mark-Sweep) or **Full GC** (Mark-Sweep-Compact of the entire heap).
- Full GC causes a **stop-the-world** pause — the main source of latency spikes.

#### Metaspace (Java 8+, replaced PermGen)

- Stores **class metadata** (structure, method bytecode, constant pool).
- Allocated in **native memory** (not the JVM heap) — no `OutOfMemoryError: PermGen`, but can still exhaust native memory.
- Grows automatically; bounded by `-XX:MaxMetaspaceSize`.
- Unbounded growth → class loader leak (common in app servers with hot-redeployment).

---

## Code Cache

- Stores **JIT-compiled native code** produced by the C1 and C2 (Turbofan equivalent) compilers.
- Fixed size (`-XX:ReservedCodeCacheSize`). When full, JIT compilation stops and the JVM falls back to interpreted mode — massive performance cliff.

---

## Example: memory regions in action

```java
class Person {
    String name;

    Person(String name) {
        this.name = name;
    }
}

public class MemoryExample {
    public static void main(String[] args) {          // new stack frame on main thread
        int a = 10;                                   // primitive → stack (local var slot)
        Person p = new Person("Alice");               // object → Eden (heap); reference p → stack
        greet(p);                                     // new stack frame pushed
    }                                                 // frame popped; p eligible for GC

    static void greet(Person person) {                // new stack frame
        String message = "Hello, " + person.name;    // new String object → Eden; ref → stack
        System.out.println(message);
    }                                                 // frame popped; message eligible for GC
}
```

**Memory trace:**

| Variable              | Type                    | Location            |
| --------------------- | ----------------------- | ------------------- |
| `a`                   | `int` (primitive)       | Stack (main frame)  |
| `p`                   | reference to `Person`   | Stack (main frame)  |
| `new Person("Alice")` | object instance         | Heap (Eden)         |
| `person`              | reference (copy of `p`) | Stack (greet frame) |
| `message`             | reference to `String`   | Stack (greet frame) |
| `"Hello, Alice"`      | `String` object         | Heap (Eden)         |

---

## String Pool

Java interns **string literals** in a special area of the heap (the **String Pool**). Two literals with the same value share the same object:

```java
String s1 = "hello";           // interned in String Pool
String s2 = "hello";           // same reference as s1
String s3 = new String("hello"); // new object on heap, NOT interned

s1 == s2   // true  (same reference)
s1 == s3   // false (different object)
s1.equals(s3) // true (same content)
```

---

## Escape Analysis & Stack Allocation

The JIT compiler performs **escape analysis**: if an object is determined to never leave the scope of a method (does not "escape"), the JVM may allocate it **on the stack** instead of the heap, eliminating GC pressure entirely.

```java
void compute() {
    Point p = new Point(1, 2); // may be stack-allocated — never escapes this method
    System.out.println(p.x + p.y);
}
```

---

## GC algorithms (brief)

| Collector   | Flag                   | Pause model                       | When to use                     |
| ----------- | ---------------------- | --------------------------------- | ------------------------------- |
| Serial GC   | `-XX:+UseSerialGC`     | Stop-the-world                    | Single-core / small heaps       |
| Parallel GC | `-XX:+UseParallelGC`   | Stop-the-world (parallel threads) | Throughput-focused batch jobs   |
| G1GC        | `-XX:+UseG1GC`         | Mostly concurrent + short pauses  | Default since Java 9; balanced  |
| ZGC         | `-XX:+UseZGC`          | Sub-millisecond pauses            | Low-latency services (Java 15+) |
| Shenandoah  | `-XX:+UseShenandoahGC` | Sub-millisecond pauses            | Low-latency services (OpenJDK)  |

---

## Key JVM flags

```
-Xms512m                  # initial heap size
-Xmx2g                    # max heap size
-Xss512k                  # stack size per thread
-XX:MaxMetaspaceSize=256m # cap Metaspace
-XX:+PrintGCDetails       # verbose GC log
-XX:+UseG1GC              # select G1 collector
-XX:MaxGCPauseMillis=200  # G1 pause target (ms)
```

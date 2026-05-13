---
tags: [javascript, nodejs, libuv, v8, theory]
title: "Event loop, libuv, V8"
---

# Event Loop, libuv & V8

Node.js and its dependencies:

![image.png](../../assets/miscellaneous/nodejs-internals.png)

---

## Event Loop

The event loop is responsible for scheduling and executing asynchronous callbacks, allowing Node.js to perform **non-blocking I/O operations** despite JavaScript being single-threaded.

In practice it works by continuously monitoring the **call stack** and a set of **queues**. Whenever the call stack is empty, the event loop picks the next item to run according to a strict phase ordering.

Each iteration of the event loop is called a **tick**.

---

### Event loop phases (Node.js / libuv)

The loop goes through these phases **in order** on every tick:

```
   ┌────────────────────────────────┐
   │           timers               │  setTimeout / setInterval callbacks
   └──────────────┬─────────────────┘
                  │
   ┌──────────────▼─────────────────┐
   │      pending callbacks         │  I/O callbacks deferred from previous tick
   └──────────────┬─────────────────┘
                  │
   ┌──────────────▼─────────────────┐
   │       idle / prepare           │  internal use only
   └──────────────┬─────────────────┘
                  │
   ┌──────────────▼─────────────────┐
   │            poll                │  retrieve new I/O events; execute I/O callbacks
   └──────────────┬─────────────────┘
                  │
   ┌──────────────▼─────────────────┐
   │            check               │  setImmediate callbacks
   └──────────────┬─────────────────┘
                  │
   ┌──────────────▼─────────────────┐
   │       close callbacks          │  e.g. socket.on('close', ...)
   └────────────────────────────────┘
```

**Between each phase**, Node.js drains two internal queues before moving on:

1. **`process.nextTick` queue** — highest priority microtasks; always runs before Promises
2. **Microtask queue** — resolved Promise callbacks (`then`, `catch`, `finally`), `queueMicrotask`

> `process.nextTick` fires before the next event loop phase, even before resolved Promises. Recursive `nextTick` calls can **starve** the event loop.

---

### Macrotasks vs Microtasks

| Type          | Examples                                                   | When it runs                               |
| ------------- | ---------------------------------------------------------- | ------------------------------------------ |
| **Macrotask** | `setTimeout`, `setInterval`, `setImmediate`, I/O callbacks | One per phase/tick                         |
| **Microtask** | `Promise.then`, `queueMicrotask`                           | All of them, after each macrotask          |
| **nextTick**  | `process.nextTick`                                         | Before microtasks, after current operation |

**Execution order example:**

```js
console.log("1 - sync");

setTimeout(() => console.log("5 - setTimeout"), 0);
setImmediate(() => console.log("6 - setImmediate"));

Promise.resolve().then(() => console.log("3 - Promise"));
process.nextTick(() => console.log("2 - nextTick"));

console.log("4 is wrong — sync ends at 1");
// actual output: 1, 4 (sync), 2 (nextTick), 3 (Promise), 5 or 6 (timers/check)
```

Corrected:

```js
console.log("sync 1");
setTimeout(() => console.log("macrotask - setTimeout"), 0);
setImmediate(() => console.log("macrotask - setImmediate"));
Promise.resolve().then(() => console.log("microtask - Promise"));
process.nextTick(() => console.log("nextTick"));
console.log("sync 2");

// Output:
// sync 1
// sync 2
// nextTick
// microtask - Promise
// macrotask - setTimeout  (or setImmediate, order can vary outside I/O)
// macrotask - setImmediate
```

---

### The poll phase in depth

The **poll** phase is where the loop spends most of its time:

1. It executes I/O callbacks that are ready.
2. If there are no scheduled timers or `setImmediate` callbacks, it **blocks** waiting for new I/O events (up to a calculated timeout).
3. Once a timer threshold is reached or a `setImmediate` is queued, it exits the poll phase.

This blocking-wait is what lets Node.js idle without spinning the CPU.

---

### `setImmediate` vs `setTimeout(fn, 0)`

Both schedule a macrotask, but:

- `setImmediate` runs in the **check** phase — always after the current poll phase completes.
- `setTimeout(fn, 0)` runs in the **timers** phase — on the _next_ tick, but the OS timer resolution means the delay may exceed 1 ms.

Inside an I/O callback, `setImmediate` **always** fires before `setTimeout(fn, 0)`.

---

## libuv

[libuv](https://vimeo.com/24713213) is the C library that implements the event loop for Node.js. It:

- Implements the **event loop phases** described above
- Manages the **thread pool** (default size: 4 threads, configurable via `UV_THREADPOOL_SIZE`)
- Handles **async I/O** — wrapping OS-specific mechanisms: `epoll` (Linux), `kqueue` (macOS), `IOCP` (Windows)
- Handles **DNS resolution** (`dns.lookup` uses the thread pool; `dns.resolve` uses the network)
- Handles **file system operations** (all `fs.*` are thread-pool operations)
- Handles **signals** and **inter-process communication (IPC)**
- Handles **child processes** and **pipes**
- Provides **timers** and **idle handles**

### Thread pool

Blocking operations that can't be made async at the OS level offload to libuv's thread pool:

| Uses thread pool                                        | Does NOT use thread pool |
| ------------------------------------------------------- | ------------------------ |
| `fs.*` (file I/O)                                       | TCP / UDP sockets        |
| `dns.lookup`                                            | `dns.resolve*`           |
| CPU-intensive crypto (`crypto.pbkdf2`, `crypto.scrypt`) |                          |
| `zlib` (compression)                                    |                          |
| User code via `worker_threads`                          |                          |

> **Thread pool saturation** is a common Node.js performance trap. If all 4 threads are busy (e.g., with `fs.readFile`), subsequent calls queue up and event loop lag rises even though the loop itself isn't blocked. Increase `UV_THREADPOOL_SIZE` or move heavy work to Worker Threads.

---

## V8

V8 is Google's JavaScript engine (written in C++), also used in Chrome. It is responsible for:

- **Parsing and compiling** JavaScript to native machine code (JIT)
- **Memory management** — allocating objects on the heap, running GC
- **The call stack** — tracking currently executing functions
- **Optimizing hot code paths** via Turbofan (the optimizing compiler)

### Memory layout

```
┌────────────────────────────────────────────┐
│                  V8 Heap                   │
│  ┌───────────────┐  ┌────────────────────┐ │
│  │   Young Gen   │  │     Old Gen        │ │
│  │  (Nursery /   │  │  (long-lived       │ │
│  │   Semi-space) │  │   objects)         │ │
│  └───────────────┘  └────────────────────┘ │
│  ┌──────────────────────────────────────┐  │
│  │         Code Space / Large Object   │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
       ↑ not tracked by V8 heap
  External / Buffer (managed by Node.js / OS)
```

- **Young Gen (Scavenger GC):** Short-lived objects. Collected frequently with fast copy-GC. Most objects die here.
- **Old Gen (Mark-Sweep / Mark-Compact):** Objects that survive 2+ Young Gen collections. Collected less frequently but with longer pauses.
- **External memory:** `Buffer`s and native add-ons allocate outside the V8 heap — visible in `process.memoryUsage().external` but not in `heapUsed`.

### JIT Compilation pipeline

```
Source JS
   │
   ▼
Parser → AST
   │
   ▼
Ignition (interpreter) ──→ executes bytecode, collects type feedback
   │
   ▼  (hot path)
Turbofan (optimizing compiler) ──→ generates optimized machine code
   │
   ▼  (if type assumption violated)
Deoptimization ──→ back to Ignition
```

> Passing inconsistent types to the same function prevents Turbofan from optimizing it ("megamorphic call site"). Keep hot functions **monomorphic**.

### Call stack

- Tracks active function frames (synchronous execution only).
- V8 imposes a stack size limit — deep recursion throws `RangeError: Maximum call stack size exceeded`.
- The event loop only picks up the next callback when the call stack is **completely empty**.

---

## How it all connects

```
┌─────────────────────────────────────────────┐
│                  Node.js                    │
│                                             │
│   JS code → V8 (compile + execute + GC)    │
│                    │                        │
│          async call (e.g. fs.readFile)      │
│                    │                        │
│              libuv thread pool              │
│                    │                        │
│         OS completes I/O operation          │
│                    │                        │
│       libuv queues callback into poll       │
│                    │                        │
│    Event loop picks up callback → V8        │
└─────────────────────────────────────────────┘
```

1. **V8** executes your JS and exposes the call stack. When it hits an async call (e.g., `fs.readFile`), it hands off to libuv and returns immediately.
2. **libuv** handles the I/O in its thread pool or via OS async primitives. When done, it posts the callback to the appropriate event loop phase queue.
3. The **event loop** (also libuv) picks up the callback when the call stack is empty and the right phase is active, pushing it back into V8 for execution.

---

## Further reading

- [libuv design overview](https://docs.libuv.org/en/v1.x/design.html)
- [Node.js event loop official docs](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick)
- [V8 blog](https://v8.dev/blog)
- [Clinic.js](https://clinicjs.org/) — flame graphs and event loop lag diagnostics
- [What the heck is the event loop anyway? (Philip Roberts, JSConf)](https://www.youtube.com/watch?v=8aGhZQkoFbQ)

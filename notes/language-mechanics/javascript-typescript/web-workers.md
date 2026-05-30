---
tags: [javascript, browser, theory]
title: "Web Workers"
---
# Web workers

Provide a set of APIs to create background threads to solve heavy operations whitout blocking JS single thread. Since workers run its tasks in different threads:

- Worker thread does not have access to some browser features like dom, global objects, etc
- But the worker can run tasks using websocket, indexedb
- A worker can create child workers
- Dedicated (only interacts with the script that initially created) vs Shared (can be accessed from different scripts)

## Use cases

- Prefetch data
- Real-time tasks
- Heavy data processing
- Long polling

## Data transfering

| **Mechanism** | **Description** |
| --- | --- |
| Structured cloned message | The basic form of data transfer between main thread and worker thread. However, in some cases where large data needs to be transmitted, structured cloning can slow down performance. |
| Transferable | Improves the lack of performance when the data has several tens of MB. |

---
tags: [patterns, architecture, theory]
title: "Design pattern comparisons"
---
# Design patterns

[What is the difference between association, aggregation and composition?](https://stackoverflow.com/questions/885937/what-is-the-difference-between-association-aggregation-and-composition/34069760#34069760)

[Design Patterns](https://medium.com/xp-inc/design-patterns-727494af001d)

<aside>
📌 Remeber**:**  Always be alert and beware of over-application.

</aside>

# Comparisons

| **Pattern** | **Use cases** |
| --- | --- |
| Adapter | Different from bridge, is commonly used with an existing app to make some otherwise-incompatible classes work together nicely |
| Bridge | Usually is defined up-front to allow parts of the software that have been developed independently |
| Proxy | Used to control or add functionally to an object |
| Decorators | The interfaces are usually the same and this pattern also enables recursive composition (used to model hierarchical structures, etc)  |
| Facade | Really similar to Proxy, but Proxy has the same interface as its service object, which makes them interchangeable |
| Command | Establishes unidirectional connections between senders and receivers turning requests into objects |
| Observer | Lets receivers dynamically subscribe to and unsubscribe from receiving requests |
| State | Focus in state transitions, fsms etc. |
| Strategy | Focus in choosing algorithms dynamically based on composition at object level (switch behaviors dinamically at runtime) |
| Template method | Based on inheritance |
## Implementations in this repository

| Pattern | Source |
| --- | --- |
| Bridge | [patterns/structural/bridge/index.ts](../../../patterns/structural/bridge/index.ts) |
| Proxy | [patterns/structural/proxy/index.ts](../../../patterns/structural/proxy/index.ts) |
| Decorator | [patterns/structural/decorator/index.ts](../../../patterns/structural/decorator/index.ts) |
| Facade | [patterns/structural/facade/index.ts](../../../patterns/structural/facade/index.ts) |
| Command | [patterns/behavioral/command/index.ts](../../../patterns/behavioral/command/index.ts) |
| Observer | [patterns/behavioral/observer/index.ts](../../../patterns/behavioral/observer/index.ts) |
| State | [patterns/behavioral/state/index.ts](../../../patterns/behavioral/state/index.ts) |
| Strategy | [patterns/behavioral/strategy/index.ts](../../../patterns/behavioral/strategy/index.ts) |
| Template method | [patterns/behavioral/template/index.ts](../../../patterns/behavioral/template/index.ts) |
| Adapter | [patterns/structural/adapter/index.ts](../../../patterns/structural/adapter/index.ts) |

![image.png](../assets/design-patterns/document-1.png)

![image.png](../assets/design-patterns/document-2.png)

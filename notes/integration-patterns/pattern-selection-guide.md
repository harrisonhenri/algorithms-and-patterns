---
type: guide
domain: integration-patterns
tags: [integration-pattern, selection, architecture, decision-matrix]
---

# Pattern Selection Guide

A decision matrix to help choose the right Enterprise Integration Patterns based on your system requirements.

## Decision Matrix

| Requirement               | Patterns                                                                           | Use When                                                        |
| ------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Loose Coupling**        | Publish-Subscribe Channel, Asynchronous Messaging, Message Router, Process Manager | Systems must evolve independently; minimize direct dependencies |
| **Tight Coupling OK**     | Point-to-Point Channel, Request-Reply, Synchronous RPC                             | Real-time response required; coordination acceptable            |
| **High Throughput**       | Message Channel, Pipes and Filters, Competing Consumers, Content-Based Router      | Processing many messages/sec; parallelism needed                |
| **Low Latency**           | Request-Reply, Direct channels, Polling Consumer                                   | Sub-second response critical; asynchrony acceptable? No.        |
| **Reliability**           | Guaranteed Delivery, Dead Letter Channel, Idempotent Receiver, Durable Subscriber  | Message loss unacceptable; must survive failures                |
| **Scalability**           | Aggregator, Scatter-Gather, Load balancing, Competing Consumers                    | Handle variable load; elastic resource allocation               |
| **Flexible Routing**      | Content-Based Router, Dynamic Router, Recipient List                               | Routing rules change; multiple destinations                     |
| **Data Transformation**   | Message Translator, Content Enricher, Envelope Wrapper, Claim Check                | Format differences; data enrichment needed                      |
| **Process Orchestration** | Process Manager, Routing Slip, Saga pattern                                        | Multi-step workflows; stateful coordination                     |
| **Time-Based Workflows**  | Process Manager, Message Expiration, Idempotent Receiver                           | Need delayed retries, scheduled actions, or timeout checks      |
| **Simple Integration**    | Message Channel, Pipes and Filters, Point-to-Point Channel                         | Basic request-response or pub-sub; minimal complexity           |
| **Testing & Debugging**   | Wire Tap, Message History, Test Message, Detour                                    | Visibility into message flow; debugging production issues       |
| **Legacy System Adapter** | Channel Adapter, Message Translator, Content Enricher                              | Bridging old + new systems; format adaptation                   |

## Selection by Architecture Style

### Microservices

- **Async communication**: Event Message, Pub-Subscribe Channel, Process Manager
- **Sync requests**: Request-Reply, Message Router
- **Coordination**: Saga (Process Manager + Compensation patterns)
- **Data consistency**: Idempotent Receiver, Correlation Identifier

### Event-Driven Architecture

- **Core**: Event Message, Publish-Subscribe Channel
- **Choreography**: Durable Subscriber, Event-Driven Consumer
- **Orchestration**: Process Manager, Routing Slip
- **Replay**: Message Store, Datatype Channel

### Serverless / Functions

- **Async orchestration**: Process Manager (AWS Step Functions, GCP Workflows)
- **Pub-Sub model**: Publish-Subscribe Channel (Google Pub/Sub, AWS EventBridge)
- **Fan-out**: Scatter-Gather, Recipient List
- **State management**: Correlation Identifier, Message Store

### Traditional Enterprise (ESB / Integration Platform)

- **Message Bus**: Message Bus, Message Router, Message Broker
- **Transformation**: Message Translator, Content Enricher, Canonical Data Model
- **Routing**: Content-Based Router, Dynamic Router, Routing Slip
- **Management**: Control Bus, Message History, Wire Tap

### Request-Response (REST, gRPC)

- **Async wrapper**: Messaging Gateway
- **Correlation**: Correlation Identifier, Return Address
- **Timeout handling**: Message Expiration
- **Fallback**: Dead Letter Channel, Retry patterns

### Long-Running Workflows (Orders, Payments, Fulfillment)

- **Coordinator**: Process Manager (orchestration)
- **Timeout strategy**: Delayed or scheduled timeout events instead of periodic scans
- **Safety**: Idempotent Receiver + state revalidation before cancellation/compensation
- **Consistency model**: At-least-once + idempotent side effects for external systems

## Selection by Key Patterns

### How messages are transported?

- **One-way broadcast**: Publish-Subscribe Channel
- **Point-to-point queue**: Point-to-Point Channel
- **Request-response**: Request-Reply (via Return Address)
- **Multi-step pipeline**: Pipes and Filters, Routing Slip

### How are senders and receivers decoupled?

- **Temporal decoupling**: Asynchronous channels, Message Bus
- **Format decoupling**: Message Translator, Canonical Data Model
- **Destination decoupling**: Dynamic Router, Message Router, Publish-Subscribe
- **Schema evolution**: Format Indicator, Versioning

### What happens when messages fail?

- **Retry**: Idempotent Receiver (+ application retry logic)
- **Dead letter**: Dead Letter Channel, Invalid Message Channel
- **Durability**: Guaranteed Delivery, Durable Subscriber
- **Visibility**: Wire Tap, Message History, Message Store

### How are multi-message interactions coordinated?

- **Aggregation**: Aggregator (wait for N messages, combine)
- **Sequencing**: Resequencer (order out-of-sequence messages)
- **Choreography**: Durable Subscriber (event-driven, stateless)
- **Orchestration**: Process Manager (central coordinator, stateful)

### How is data enriched or transformed?

- **Add data**: Content Enricher
- **Remove data**: Content Filter
- **Reformat**: Message Translator
- **Store temporarily**: Claim Check
- **Standardize**: Canonical Data Model, Normalizer

## Common Pattern Combinations

### Fan-Out / Fan-In Pattern

```
Sender → Splitter → [Filter 1, Filter 2, Filter 3] → Aggregator → Receiver
```

**Patterns**: Splitter, Content-Based Router, Aggregator

### Request-Reply with Correlation

```
Client → Command Message + Return Address
       ← Event Message + Correlation ID (when ready)
```

**Patterns**: Request-Reply, Return Address, Correlation Identifier, Event Message

### Multi-Step Orchestration

```
Initiator → Command → Process Manager → Routing Slip
                     (coordinates steps)
            ← Event (completion/failure)
```

**Patterns**: Process Manager, Routing Slip, Command Message, Event Message

### Timeout-Driven Saga Step

```
OrderCreated -> schedule CheckPaymentTimeout(+30m)
CheckPaymentTimeout -> read current state -> cancel only if still pending
```

**Patterns**: Process Manager, Message Expiration, Idempotent Receiver, Command Message

### Pub-Sub with Durable Delivery

```
Publisher → Publish-Subscribe Channel → Durable Subscriber ✓
                                      → Event-Driven Consumer
```

**Patterns**: Publish-Subscribe Channel, Durable Subscriber, Event-Driven Consumer

### Format Bridge

```
Legacy System ← Channel Adapter ← Message Translator ← Modern System
```

**Patterns**: Channel Adapter, Message Translator, Canonical Data Model

### Async Query / CQRS

```
Client ← Query → Polling Consumer ← Event-Driven Consumer ← Event Stream
                (polls for result)
```

**Patterns**: Polling Consumer, Selective Consumer, Message Store

## Technology Examples

### Apache Kafka

- **Channels**: Publish-Subscribe Channel, Topics as queues (Point-to-Point via consumer groups)
- **Routing**: Partition-based routing (Content-Based Router)
- **Endpoints**: Event-Driven Consumer (via KafkaListener)
- **Coordination**: Process Manager (via workflow engines reading from Kafka)

### AWS EventBridge / SQS / SNS

- **Channels**: SNS = Publish-Subscribe Channel; SQS = Point-to-Point Channel
- **Routing**: EventBridge Rules (Content-Based Router)
- **Orchestration**: Step Functions (Process Manager)
- **Endpoints**: Lambda handlers (Event-Driven Consumer)

### Azure Service Bus

- **Channels**: Topics = Pub-Sub; Queues = Point-to-Point
- **Routing**: Forwarding rules, Content-Based Subscriptions
- **Endpoints**: MessageHandler (Event-Driven Consumer)
- **Orchestration**: Logic Apps (Process Manager)

### RabbitMQ / AMQP

- **Channels**: Exchanges (Pub-Sub/routing), Queues (Point-to-Point)
- **Routing**: Exchange routing rules, Topic exchanges (Content-Based Router)
- **Endpoints**: Consumer callbacks (Event-Driven Consumer)
- **Features**: TTL (Message Expiration), Dead Letter Exchanges

### Apache Camel / Spring Integration

- **Native**: Route DSL implements Content-Based Router, Splitter, Aggregator, etc.
- **Endpoints**: Hundreds of integrations (Channel Adapter pattern)
- **Transformation**: Processors and transformers (Message Translator, Content Enricher)
- **Management**: JMX for Control Bus, debugging tools

## Anti-Patterns & Pitfalls

| Anti-Pattern                     | Problem                                 | Solution                                                  |
| -------------------------------- | --------------------------------------- | --------------------------------------------------------- |
| **Chatty Interface**             | Too many round-trips; high latency      | Use Document Message, Batch messages, Claim Check         |
| **Shared Database**              | Tight coupling; scalability issues      | Migrate to Message-Driven communication                   |
| **Synchronous Chains**           | Cascading failures; poor resilience     | Add timeouts, circuit breakers, use async (Event Message) |
| **No Idempotency**               | Duplicate processing; data corruption   | Implement Idempotent Receiver + Correlation ID            |
| **Lost Messages**                | Silent failures in production           | Use Guaranteed Delivery + Dead Letter Channel             |
| **Message Explosion**            | Too many small messages; overhead       | Use Aggregator or batch messages                          |
| **Tightly-Coupled Consumers**    | Inflexible; hard to scale               | Use Publish-Subscribe Channel + Competing Consumers       |
| **No Correlation**               | Can't track multi-step workflows        | Use Correlation Identifier + Message History              |
| **Timeout without revalidation** | Late timeout cancels already-paid order | Re-read current state before timeout action               |
| **Assuming global EOS**          | Duplicate external side effects         | Use idempotency keys + dedup + outbox/reconciliation      |

---

**See Also**:

- [Process Manager](./routing-patterns/process-manager.md)
- [Idempotent Receiver](./messaging-endpoints/idempotent-receiver.md)
- [Event-Driven Architecture](../system-design/event-driven-architecture.md)
- [Transactions and Concurrency](../system-design/transactions-and-concurrency.md)

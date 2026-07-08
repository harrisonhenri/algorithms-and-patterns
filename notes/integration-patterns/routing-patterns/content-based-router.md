---
type: integration-pattern
category: routing-patterns
aliases: [content-based-routing, conditional-routing, switch-statement]
tags: [integration-pattern, routing-patterns, routing, conditional]
---

# Content-Based Router

## Problem

How do we handle a situation where the implementation of a single logical function (e.g., inventory check) is spread across multiple physical systems?

## Solution

Construct a message router that evaluates a set of conditions on the incoming message and directs the message to the appropriate destination channel based on data contained in the message.

## Context & Forces

**When to use:**

- Message must be routed to different destinations based on content
- Logic for routing is complex and data-dependent
- Destinations are known upfront but routing rules may change
- Centralizing routing logic is desired

**Avoid when:**

- Simple destination always same (direct channel)
- Routing rules unknowable at design-time (use Dynamic Router)
- Destinations are list of subscribers (use Publish-Subscribe)

## Key Mechanisms

1. **Message inspection**: Extract data from message header/content
2. **Condition evaluation**: Apply rules (if X > threshold, route to A; else B)
3. **Destination routing**: Send to appropriate channel based on result
4. **Multi-criteria**: Can combine multiple conditions (AND, OR)

## Implementation Patterns

**Simple conditional:**

```
IF message.customerType == "Premium" THEN route to PremiumQueue
ELSE route to StandardQueue
```

**Multi-branch routing:**

```
SWITCH on message.product:
  CASE "Electronics" → WarehouseA
  CASE "Clothing" → WarehouseB
  CASE "Food" → WarehouseC
  DEFAULT → DefaultQueue
```

**Complex rules:**

```
IF (message.amount > 10000 AND message.riskScore > 0.8)
THEN route to ManualReviewQueue
ELSE route to AutoApprovalQueue
```

## Related Patterns

- **Alternative destination selection**:
  - Message Filter: Filter OUT messages (don't route)
  - Recipient List: Route to multiple destinations
  - Dynamic Router: Discover destinations at runtime
  - Routing Slip: Route through sequence of steps
- **Condition-based transformation**: Content Enricher (add data before routing)

## Implementation Notes

- **Technology-independent**: Logic applies across all messaging platforms
- **DSL vs code**: Use routing DSL (Apache Camel) vs. custom code trade-off
- **Performance**: Condition evaluation is fast; bottleneck usually elsewhere
- **Maintenance**: Complex rules become hard to test; keep conditions simple
- **Versioning**: New product types require code change; consider external config

## Example Scenarios

1. **Order routing**: Route orders to warehouse based on product type, location
2. **Claim processing**: Route insurance claims to different processors based on type/amount
3. **Patient triage**: Route patient requests based on severity, specialty
4. **Request routing**: Route API requests to different backend services by endpoint
5. **Device routing**: Route device data based on device type, model, firmware version

## Common Mistakes

1. **Over-complex conditions**: Becomes unmaintainable; break into multiple routers
2. **Tight coupling to destinations**: Hard-coded destination names; use indirection
3. **Missing default case**: Unknown message types silently lost; always include dead letter
4. **Performance concern**: Unnecessary optimization; condition evaluation is typically fast
5. **Hard to test**: Isolate routing logic; unit test conditions independently

## Scalability Considerations

- **High volume**: Condition evaluation is O(1) or O(n) in number of routes (typically small)
- **Many routes**: Break into hierarchical routers (router → sub-router)
- **Dynamic rules**: Consider Dynamic Router or externalize config

## Technology Examples

- **Apache Camel**: `choice().when(predicate).to(endpoint)...`
- **Spring Integration**: `@Router` annotation, expression-based
- **Kafka Streams**: `branch()` method for conditional routing
- **AWS Lambda**: Custom logic in function; route via SNS/SQS topics
- **RabbitMQ**: Exchange routing logic (limited; mostly via headers/routing keys)
- **Mule ESB**: Choice router component

## Technology Implementation

### Apache Camel

```java
from("direct:orders")
  .choice()
    .when(header("orderType").isEqualTo("Premium"))
      .to("direct:premiumProcess")
      .setHeader("queue", constant("premium-queue"))
    .when(header("orderType").isEqualTo("Standard"))
      .to("direct:standardProcess")
      .setHeader("queue", constant("standard-queue"))
    .when(body().regex(".*urgent.*"))
      .to("direct:urgentProcess")
      .setHeader("queue", constant("urgent-queue"))
    .otherwise()
      .setHeader("queue", constant("default-queue"))
      .to("direct:defaultProcess")
  .end()
  .to("jms:${header.queue}");
```

### Spring Integration

```java
@Configuration
public class OrderRouterConfig {

  @Bean
  public IntegrationFlow orderRouter() {
    return IntegrationFlows
      .from("input-channel")
      .route(message -> {
        Order order = (Order) message.getPayload();
        if (order.getAmount() > 10000) {
          return "high-value-channel";
        } else if (order.isPremium()) {
          return "premium-channel";
        } else {
          return "standard-channel";
        }
      })
      .get();
  }

  @Bean
  public MessageChannel inputChannel() {
    return new DirectChannel();
  }
}
```

### Kafka Streams

```java
KStream<String, Order> orders = builder.stream("orders-topic");

orders.split()
  .branch(
    (orderId, order) -> order.getAmount() > 10000,
    Branched.as("high-value")
      .withConsumer(stream -> stream.to("high-value-orders"))
  )
  .branch(
    (orderId, order) -> order.isPremium(),
    Branched.as("premium")
      .withConsumer(stream -> stream.to("premium-orders"))
  )
  .defaultBranch(
    Branched.as("standard")
      .withConsumer(stream -> stream.to("standard-orders"))
  );
```

### AWS EventBridge

```yaml
# Define rules for conditional routing
Rules:
  - Name: HighValueOrderRule
    Pattern:
      source: ["order.service"]
      detail-type: ["OrderPlaced"]
      detail:
        amount: [{ numeric: [">", 10000] }]
    Targets:
      - Arn: arn:aws:sqs:us-east-1:123456789:high-value-queue

  - Name: StandardOrderRule
    Pattern:
      source: ["order.service"]
      detail-type: ["OrderPlaced"]
    Targets:
      - Arn: arn:aws:sqs:us-east-1:123456789:standard-queue
```

**Publish:**

```python
response = eventBridge.put_events(
  Entries=[{
    'Source': 'order.service',
    'DetailType': 'OrderPlaced',
    'Detail': json.dumps({
      'orderId': 'ORD-123',
      'amount': 15000,  # Will match HighValueOrderRule
      'customerType': 'Premium'
    })
  }]
)
# EventBridge evaluates patterns and routes to matching targets
```

### RabbitMQ (with routing key)

```python
# Declare exchange and queues
channel.exchange_declare(exchange='orders', exchange_type='topic')
channel.queue_declare(queue='high-value-queue')
channel.queue_declare(queue='standard-queue')

# Bind with routing key patterns
channel.queue_bind(exchange='orders', queue='high-value-queue',
                   routing_key='order.high-value.*')
channel.queue_bind(exchange='orders', queue='standard-queue',
                   routing_key='order.standard.*')

# Publisher determines routing key based on order content
def route_order(order):
  if order.amount > 10000:
    routing_key = 'order.high-value.premium'
  elif order.is_premium:
    routing_key = 'order.standard.premium'
  else:
    routing_key = 'order.standard.basic'

  channel.basic_publish(
    exchange='orders',
    routing_key=routing_key,
    body=json.dumps(order)
  )
```

### Custom Lambda Router (AWS)

```python
# Lambda function acts as router
def lambda_handler(event, context):
  order = json.loads(event['body'])

  # Determine destination
  if order['amount'] > 10000:
    destination = 'high-value-sqs'
  elif order['isPremium']:
    destination = 'premium-sqs'
  else:
    destination = 'standard-sqs'

  # Send to appropriate SQS queue
  sqs = boto3.client('sqs')
  sqs.send_message(
    QueueUrl=f"https://sqs.us-east-1.amazonaws.com/123456789/{destination}",
    MessageBody=json.dumps(order)
  )

  return {'statusCode': 200, 'message': f'Routed to {destination}'}
```

### Comparison

| Platform          | Method           | Complexity        | Performance              | Config             |
| ----------------- | ---------------- | ----------------- | ------------------------ | ------------------ |
| **Camel**         | DSL + predicates | Low (declarative) | High (optimized)         | Easy (XML/Java)    |
| **Spring Int.**   | @Router bean     | Medium (code)     | High                     | Java-based         |
| **Kafka Streams** | branch() method  | Medium (code)     | High (stream processing) | Topology-based     |
| **EventBridge**   | Pattern matching | Low (declarative) | High (native)            | JSON patterns      |
| **RabbitMQ**      | Routing keys     | Low (template)    | High (exchange native)   | Limited to headers |
| **Custom Lambda** | Code logic       | High (flexible)   | Medium (cold start)      | Full control       |

## Related Patterns

- **Splitter**: Split message into parts; route each differently
- **Aggregator**: Combine multiple routed messages
- **Message Filter**: Filter (discard) rather than route
- **Compose**: Multiple routers in sequence (Pipes and Filters)

## References

- [Content-Based Router on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/ContentBasedRouter.html)
- **Variant**: Dynamic Router (discovery at runtime)
- **Recipient destination**: Recipient List (multiple destinations), Splitter → route
- Book: Enterprise Integration Patterns, Chapter 5

---

_Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)_

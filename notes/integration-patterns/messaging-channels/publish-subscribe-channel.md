---
type: integration-pattern
category: messaging-channels
aliases: [broadcast, topic, event-stream]
tags: [integration-pattern, messaging-channels, channel, publish-subscribe]
---

# Publish-Subscribe Channel

## Problem

How can the sender broadcast an event to all interested receivers?

## Solution

Send the event to a Publish-Subscribe Channel, which delivers a copy of the message to each receiver.

## Context & Forces

**When to use:**

- One event needs to reach multiple independent consumers
- Loose coupling; sender doesn't know who subscribers are
- Event notification pattern (user signed up, order placed, etc.)
- Broadcast or fanout required

**Avoid when:**

- Only one consumer should process message (use Point-to-Point)
- Tight coupling acceptable
- Request-response interaction pattern

## Key Characteristics

1. **Broadcast delivery**: Each subscriber receives independent copy
2. **Loose coupling**: Publishers and subscribers don't know about each other
3. **Event-driven**: Natural fit for event-based architecture
4. **Fan-out**: Single message → many destinations
5. **Multiple instances**: Multiple instances of same subscriber type = ?
   - **Competing Consumers**: Each instance gets copy (watch for duplicates)
   - **Durable Subscriber**: Subscribers registered; late subscribers can receive past events

## Implementation Notes

- **Technology**: Topics, fanout exchanges, event streams
- **Late subscribers**: Risk of missed events (use Durable Subscriber if needed)
- **Filtering**: Subscribers typically filter events they care about (Content Filter)
- **Ordering**: Event order maintained within single topic; parallel subscribers may process out-of-order

## Example Scenarios

1. **Order placed**: OMS publishes OrderPlaced; Warehouse, Billing, Analytics each subscribe
2. **User signup**: Auth service publishes UserSignedUp; Onboarding, CRM, Analytics react
3. **Data changed**: Database publishes Change Data Capture events; read models update
4. **System events**: Microservice publishes events; any interested service subscribes

## Related Patterns

- **Alternative to**: Point-to-Point Channel (when multiple recipients needed)
- **Content filter**: Subscribers can filter (Content Filter, Selective Consumer)
- **Ordering**: Resequencer if messages out of order
- **Late arrival**: Durable Subscriber (store events), Message Store (query history)
- **Fan-out**: Splitter pattern combined with Pub-Sub

## Technology Examples

- **Apache Kafka**: Topics are Pub-Sub; consumer groups optionally load-balance
- **RabbitMQ**: Topic exchange + multiple queues = Pub-Sub
- **AWS**: SNS (Pub-Sub), EventBridge (event routing), SQS (P2P)
- **Azure**: Service Bus Topics + Subscriptions
- **GCP**: Pub/Sub service
- **Apache Pulsar**: Topics with subscriptions
- **Redis**: Pub/Sub or Streams

## Durable Subscriber Consideration

**Basic Pub-Sub**: Subscribers must be listening; messages sent when subscriber down = lost
**Durable Subscriber**: Broker stores messages; subscriber retrieves when available

- Kafka: Offset tracking = durability built-in
- RabbitMQ: Queue + Topic Exchange = durability
- AWS SNS+SQS: SQS as dead-letter for durability

## Technology Deep Dive

### Apache Kafka

**Setup:**

```yaml
# Create topic (replicated, persisted)
kafka-topics --create \
--topic order-events \
--partitions 3 \
--replication-factor 3
```

**Producer (Publisher):**

```python
from kafka import KafkaProducer
producer = KafkaProducer(bootstrap_servers='localhost:9092')
producer.send('order-events',
  key=b'order-123',
  value=b'{"eventType":"OrderPlaced","orderId":"ORD-123"}'
)
```

**Consumers (Subscribers - independent):**

```python
from kafka import KafkaConsumer
# Warehouse subscriber
consumer_warehouse = KafkaConsumer(
  'order-events',
  group_id='warehouse-group',  # Each subscriber group gets all messages
  bootstrap_servers='localhost:9092'
)

# Billing subscriber (independent, gets same events)
consumer_billing = KafkaConsumer(
  'order-events',
  group_id='billing-group',
  bootstrap_servers='localhost:9092'
)

# Each processes independently
for message in consumer_warehouse:
  handle_order_placed(message.value)
```

**Key feature:** Each consumer group gets independent copy of all events (true Pub-Sub).

### RabbitMQ

**Setup:**

```yaml
# Declare topic exchange
exchange_declare(
  exchange='orders',
  exchange_type='topic',  # or 'fanout' for all subscribers
  durable=true
)

# Declare subscriber queues
queue_declare(queue='warehouse-queue', durable=true)
queue_declare(queue='billing-queue', durable=true)

# Bind queues to exchange
queue_bind(
  exchange='orders',
  queue='warehouse-queue',
  routing_key='order.*'  # Warehouse gets all order events
)

queue_bind(
  exchange='orders',
  queue='billing-queue',
  routing_key='order.placed'  # Billing only gets order.placed
)
```

**Publisher:**

```python
channel.basic_publish(
  exchange='orders',
  routing_key='order.placed',
  body=json.dumps({"eventType":"OrderPlaced", "orderId":"ORD-123"}),
  properties=pika.BasicProperties(delivery_mode=2)  # Persistent
)
```

**Subscribers:**

```python
# Warehouse
def on_order_event(ch, method, properties, body):
  event = json.loads(body)
  warehouse.handle_order(event)
  ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_consume(queue='warehouse-queue', on_message_callback=on_order_event)

# Billing (independent queue, independent processing)
def on_billing_event(ch, method, properties, body):
  event = json.loads(body)
  billing.handle_order(event)
  ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_consume(queue='billing-queue', on_message_callback=on_billing_event)
```

### AWS (SNS for Pub-Sub)

**Setup:**

```yaml
# Create SNS topic
topic_arn = sns.create_topic(Name='order-events')

# Subscribe warehouse
subscription_1 = sns.subscribe(
  TopicArn=topic_arn,
  Protocol='sqs',
  Endpoint='arn:aws:sqs:us-east-1:123456789:warehouse-queue'
)

# Subscribe billing
subscription_2 = sns.subscribe(
  TopicArn=topic_arn,
  Protocol='sqs',
  Endpoint='arn:aws:sqs:us-east-1:123456789:billing-queue'
)

# Subscribe analytics Lambda
subscription_3 = sns.subscribe(
  TopicArn=topic_arn,
  Protocol='lambda',
  Endpoint='arn:aws:lambda:us-east-1:123456789:function:analytics'
)
```

**Publish (all subscribers get notified):**

```python
sns.publish(
  TopicArn=topic_arn,
  Subject='Order Event',
  Message=json.dumps({"eventType":"OrderPlaced", "orderId":"ORD-123"})
)
# Warehouse SQS receives → pulls from queue
# Billing SQS receives → pulls from queue
# Analytics Lambda invoked automatically
```

### Azure Service Bus

**Setup:**

```yaml
# Create topic
topic_name = 'order-events'
service_bus_client.create_topic(topic_name)

# Create subscriptions (each subscriber gets copy)
service_bus_client.create_subscription(
  topic_name=topic_name,
  subscription_name='warehouse-sub'
)

service_bus_client.create_subscription(
  topic_name=topic_name,
  subscription_name='billing-sub'
)
```

**Publish:**

```python
with service_bus_client.get_topic_sender(topic_name='order-events') as sender:
  message = ServiceBusMessage(
    body=json.dumps({"eventType":"OrderPlaced", "orderId":"ORD-123"}),
    content_type='application/json'
  )
  sender.send_messages(message)
# Both subscriptions receive independently
```

**Subscribe:**

```python
# Warehouse
with service_bus_client.get_subscription_receiver(
  topic_name='order-events',
  subscription_name='warehouse-sub'
) as receiver:
  for message in receiver:
    warehouse.handle_order(json.loads(str(message)))
    receiver.complete_message(message)

# Billing (independent)
with service_bus_client.get_subscription_receiver(
  topic_name='order-events',
  subscription_name='billing-sub'
) as receiver:
  for message in receiver:
    billing.handle_order(json.loads(str(message)))
    receiver.complete_message(message)
```

### Pattern Summary Across Platforms

| Feature                  | Kafka                     | RabbitMQ              | AWS SNS              | Azure Bus              |
| ------------------------ | ------------------------- | --------------------- | -------------------- | ---------------------- |
| **Multiple subscribers** | Consumer groups           | Bound queues          | Topic subscriptions  | Topic subscriptions    |
| **Independent delivery** | Yes (offset per group)    | Yes (per queue)       | Yes (per subscriber) | Yes (per subscription) |
| **Late subscriber**      | Can replay (log retained) | Misses past events    | Misses past events   | Misses past events     |
| **Filtering**            | Consumer-side             | Routing key + binding | Message filters      | SQL filters            |
| **Durability**           | Log persisted             | Queue persisted       | Dead-letter queue    | Subscription backlog   |
| **Ordering**             | Per partition             | Per queue             | No guarantee         | Per subscription       |

## Scale Considerations

- **Many subscribers**: Each must process independently; scale each separately
- **High throughput**: Partition topics; assign partitions to subscriber groups
- **Ordering guarantee**: Within single partition only; lossy across parallel subscribers
- **Late subscribers**: Consider Event Sourcing / Message Store for replay

## References

- [Publish-Subscribe Channel on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/PublishSubscribeChannel.html)
- **Counterpart**: Point-to-Point Channel
- **Resilience**: Durable Subscriber, Dead Letter Channel
- **Modern implementations**: Kafka, RabbitMQ, cloud event buses
- Book: Enterprise Integration Patterns, Chapter 4

---

_Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)_

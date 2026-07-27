---
type: integration-pattern
category: message-construction
aliases: [command, instruction, request]
tags: [integration-pattern, message-construction, message-type, command]
---

# Command Message

## Problem

How can messaging be used to invoke a procedure in another application?

## Solution

Send a Command Message which is a message that specifies a procedure to be invoked and the corresponding arguments.

## Context & Forces

**When to use:**
- Request an action/procedure in another system
- Expecting no return value (fire-and-forget)
- or expecting Result Message in return (Request-Reply pattern)
- Loose coupling required; caller doesn't know implementation details
- Asynchronous processing acceptable

**Avoid when:**
- Return value absolutely required in synchronous call (use RPC or Request-Reply)
- Simple data exchange better served by Document Message
- Events more appropriate (use Event Message)

## Key Characteristics

1. **Directive**: "Do this" command structure (vs. Event "this happened", Document "here's data")
2. **Action-oriented**: Implies work to be done; state change expected
3. **Correlation**: Often paired with Return Address if response needed (Request-Reply)
4. **Idempotency**: Should be safe to reprocess if duplicate received (Idempotent Receiver)

## Message Structure

**Typical Command Message:**
```
{
  "commandType": "ProcessOrder",
  "commandId": "cmd-12345",
  "orderId": "ORD-998877",
  "customerId": "CUST-5555",
  "items": [...],
  "returnAddress": "reply-queue://orders/reply"  // if expecting response
}
```

**Key elements:**
- Command type/name (what action)
- Arguments (parameters needed for action)
- Correlation ID (tie back to request if needed)
- Return Address (if response required)
- Timestamp (when issued)

## Command Message vs. Others

| Pattern | Intent | Structure | Response |
|---------|--------|-----------|----------|
| **Command** | "Do this" | Method + args | Optional (via Return Address) |
| **Event** | "This happened" | What occurred | None expected |
| **Document** | "Here's data" | Raw data | None expected |
| **Request-Reply** | "Get result" | Request → Response pair | Required |

## Implementation Notes

- **Fire-and-forget**: Send command, don't wait (async)
- **Request-Reply**: Send command + Return Address, wait for result
- **Idempotency**: Receiver should handle duplicate commands gracefully
- **Error handling**: What if command can't be executed? (Dead Letter Channel, error message)

## Related Patterns

- **Response model**: Request-Reply (if expecting return value)
- **Reply address**: Return Address (where to send response)
- **Tracking**: Correlation Identifier (tie request to response)
- **Failure**: Dead Letter Channel (unreceivable commands)
- **Transaction**: Transactional Client (ensure command processed exactly-once)

## Example Scenarios

1. **Order processing**: "Process order 12345 for customer X"
2. **Email service**: "Send email to user@example.com with subject..."
3. **Report generation**: "Generate monthly sales report for division Y"
4. **Account operation**: "Transfer $1000 from account A to account B"
5. **Workflow step**: "Approve purchase request PR-999"

## Design Considerations

1. **Verb naming**: Use action verbs ("Transfer", "Generate", "Approve")
2. **Atomicity**: Should command be single atomic operation or multi-step?
3. **Versioning**: Future command types; allow extensibility
4. **Authorization**: Who can issue this command? Enforce in handler
5. **Validation**: Validate required fields before processing

## Idempotency Strategy

**Problem**: Duplicate command messages (network retry, duplicate send)
**Solution**: Make command handler idempotent
- Check if already processed (by command ID)
- Track processed command IDs (command log, distributed cache)
- Alternatively: Receiver can deduplicate based on business logic

## Error Handling

**Command fails:**
- Log error
- Send error response (if Request-Reply)
- Optionally send to Dead Letter Channel for manual review
- Consider retry strategy (exponential backoff, Idempotent Receiver)

## References

- [Command Message on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/CommandMessage.html)
- **Related**: Document Message, Event Message (other message types)
- **Responses**: Request-Reply, Return Address, Correlation Identifier
- Book: Enterprise Integration Patterns, Chapter 3

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

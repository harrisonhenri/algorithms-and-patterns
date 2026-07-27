---
type: integration-pattern
category: message-construction
aliases: [document, data-message, payload-message]
tags: [integration-pattern, message-construction, message-type, document]
---

# Document Message

## Problem

How can messaging be used to transmit data between applications without imposing a specific semantic interpretation?

## Solution

Send a Document Message, which contains a data document with no implied action or event notification. The receiver interprets the data and decides what to do with it.

## Context & Forces

**When to use:**

- Raw data transfer between systems (no specific action implied)
- Sender doesn't know what receiver will do with data
- Data acts as reference material or information resource
- Loose coupling; receiver maintains autonomy over interpretation
- Legacy system data migration or synchronization
- Simple data sharing without choreography

**Avoid when:**

- Action required from receiver (use Command Message)
- Need to notify of state change (use Event Message)
- Expecting return value or response (use Request-Reply)
- Receiver needs to know intent (prefer Command or Event)

## Key Characteristics

1. **Neutral**: "Here's data" (vs. Command "do this", Event "this happened")
2. **Data-oriented**: Pure information payload; no implied semantics
3. **Receiver-determined**: Receiver decides how to use data
4. **Static**: Data capture at point-in-time; interpretation deferred
5. **Flexible**: Same document can be used for multiple purposes

## Message Structure

**Typical Document Message:**

```json
{
  "documentId": "doc-12345",
  "documentType": "CustomerData",
  "timestamp": "2026-05-16T10:30:00Z",
  "version": 1,
  "data": {
    "customerId": "CUST-5555",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1-555-0123",
    "address": {
      "street": "123 Main St",
      "city": "Portland",
      "state": "OR",
      "zip": "97201"
    },
    "customerSince": "2020-03-15",
    "status": "active"
  },
  "metadata": {
    "source": "CRM",
    "sourceVersion": "1.2.3"
  }
}
```

**Key elements:**

- Document ID (unique identifier)
- Document type (what kind of data)
- Timestamp (when extracted/created)
- Data (the payload; structure varies)
- Version (schema version)
- Metadata (provenance, source system)

## Document vs. Command vs. Event

| Pattern      | Intent          | Direction | Semantics              | Response |
| ------------ | --------------- | --------- | ---------------------- | -------- |
| **Document** | "Here's data"   | Transfer  | None; receiver decides | No       |
| **Command**  | "Do this"       | Directed  | Explicit action        | Optional |
| **Event**    | "This happened" | Broadcast | State change occurred  | No       |

## Implementation Notes

- **Naming**: Noun-based ("CustomerData", "OrderSummary", "InventorySnapshot")
- **Payload focus**: Emphasis on data structure, not behavior
- **Interpretation**: Receiver logic determines use case
- **Versioning**: Version schema for backward compatibility
- **Composition**: Can contain complex nested structures

## Document Message Patterns

### 1. **Reference Data Sync**

Send read-only reference data (lookup tables, master data):

```json
{
  "documentType": "ProductCatalog",
  "data": [
    {
      "productId": "PROD-001",
      "name": "Widget",
      "price": 29.99,
      "category": "Hardware"
    }
  ]
}
```

### 2. **Data Extract / Snapshot**

Export point-in-time snapshot of entity state:

```json
{
  "documentType": "BalanceSnapshot",
  "data": {
    "accountId": "ACC-999",
    "currentBalance": 15000.5,
    "lastUpdated": "2026-05-16T09:00:00Z"
  }
}
```

### 3. **Batch/Bulk Data**

Transfer multiple records (EDI, bulk import):

```json
{
  "documentType": "OrderBatch",
  "data": {
    "records": [
      { "orderId": "ORD-001", "total": 100.0 },
      { "orderId": "ORD-002", "total": 250.5 }
    ],
    "recordCount": 2,
    "batchId": "BATCH-123"
  }
}
```

## Related Patterns

- **Distribution**: Point-to-Point Channel (direct data transfer)
- **Transformation**: Message Translator (convert document format)
- **Enrichment**: Message Translator, Enricher (add context to document)
- **Parsing**: Content-Based Router (route based on document type)
- **Storage**: Message Store (archive documents for later retrieval)
- **Deduplication**: Idempotent Receiver (handle duplicate documents)

## Example Scenarios

1. **Master data sync**: Publish Product Catalog daily to all subscribers
2. **Data warehouse feed**: Export customer records for analytics platform
3. **Legacy system integration**: Send invoice scans to document management system
4. **Data migration**: Transfer employee records from old HR system to new one
5. **Snapshot export**: Export current inventory levels to branch offices
6. **Compliance archive**: Send audit trail documents to compliance system

## Design Considerations

1. **Self-describing**: Include document type, version, timestamp
2. **Schema evolution**: Version documents; handle backward compatibility
3. **Receiver autonomy**: Don't constrain how receiver uses data
4. **Data freshness**: Mark when data was captured
5. **Completeness**: Include all data receiver might need
6. **Privacy**: What sensitive data is in the document?

## When to Choose: Document vs. Command vs. Event

**Use Document Message when:**

- You're transferring data; receiver decides what to do
- Same data might be useful for multiple purposes
- Sender doesn't know receiver's use case
- Data is historical/snapshot in nature

**Use Command Message when:**

- You're requesting an action
- Sender expects work to be done
- Specific outcome/behavior required

**Use Event Message when:**

- You're notifying of state change
- Multiple subscribers should react
- Action is choreographed response to change

## Comparison: Document, Command, Event

**Order processing example:**

| Message Type | Sample                                  | Use Case                                     |
| ------------ | --------------------------------------- | -------------------------------------------- |
| **Document** | "CustomerData: {id, name, address...}"  | Share customer reference data with Warehouse |
| **Command**  | "ReserveInventory: {itemId, qty}"       | Request Warehouse to reserve items           |
| **Event**    | "OrderPlaced: {orderId, customerId...}" | Notify Warehouse order was created           |

## Handling Document Message Duplicates

**Problem**: Duplicate document messages (network retry, sender error)

**Solution:**

- **Idempotent Receiver**: Check if document already processed (by documentId)
- **Merge/overwrite**: If merging data, last-write-wins or manual reconciliation
- **Deduplication store**: Track processed documentIds in cache/database
- **Versioning**: Use timestamp/version to determine freshness

## References

- [Document Message on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/DocumentMessage.html)
- **Related**: Command Message, Event Message (other message types)
- **Integration**: Point-to-Point Channel, Publish-Subscribe Channel
- Book: Enterprise Integration Patterns, Chapter 3

---

_Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)_

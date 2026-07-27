---
type: integration-pattern
category: integration-styles
aliases: [file-based integration]
tags: [integration-pattern, integration-styles, file-transfer, batch]
---

# File Transfer

## Problem

How can I integrate multiple applications so that they work together and can exchange information, when each application produces and consumes files?

## Solution

Have each application produce files that contain the data to be shared with other applications. An integration solution reads the files and either distributes the data contained in the files to other applications or updates applications on the files it has written.

## Context & Forces

**When to use:**
- Applications natively produce/consume files (batch processing, reports, exports)
- Volume is moderate and latency requirements are relaxed
- File format is stable; systems have direct file system access
- Integration is one-directional or periodic

**Avoid when:**
- Real-time communication required; files introduce latency
- Tight coupling to file system; poor scalability
- Binary data or large messages; file I/O overhead
- Complex routing or transformation rules

## Key Considerations

1. **File Format**: Establish clear contracts (CSV, XML, JSON, EDI)
2. **Polling**: How often are files checked? Polling interval vs. latency trade-off
3. **Duplicate Processing**: Implement markers (lock files, headers) to avoid reprocessing
4. **Error Handling**: What happens to malformed files? (quarantine folder, Dead Letter Channel)
5. **Scalability**: File I/O becomes bottleneck; consider Message Channel alternatives
6. **Archival**: Keep processed files for audit trail

## Related Patterns

- **Alternative to**: Messaging, Remote Procedure Invocation, Shared Database
- **Often combined with**: Message Channel (reading files feeds into async messaging)
- **Successor pattern**: Migrate to Messaging or Database for real-time requirements

## Implementation Notes

- **Monitoring**: Use polling interval based on business requirements; longer interval = lower cost, higher latency
- **Durability**: Archive files after processing for audit compliance
- **Concurrency**: Use file locks or atomic rename operations to avoid race conditions
- **Legacy**: Common in batch ETL, EDI interchange, data warehouse loads

## Example Use Cases

- EDI (Electronic Data Interchange): X12, EDIFACT files exchanged via FTP/SFTP
- Batch reporting: Nightly reports exported to CSV, consumed by analytics system
- Data warehouse: Flat files from operational systems loaded via scheduled jobs
- Legacy system integration: Fixed-format files as lowest common denominator

## Trade-Offs

| Aspect | File Transfer | Messaging |
|--------|---------------|-----------|
| **Latency** | High (polling/batch) | Low (event-driven) |
| **Coupling** | Loose (asynchronous) | Loose (asynchronous) |
| **Scalability** | Limited (I/O bound) | High (queued) |
| **Simplicity** | Very simple | Moderate complexity |
| **Real-time** | No | Yes |
| **Monitoring** | Basic (file count) | Rich (message metadata) |

## References

- [File Transfer pattern on EIP site](https://www.enterpriseintegrationpatterns.com/patterns/messaging/FileTransferIntegration.html)
- Relative to Messaging: Consider when batch processing is acceptable; migrate to Messaging for real-time
- Book: Enterprise Integration Patterns, Chapter 2

---

*Pattern from [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) (Hohpe & Woolf, CC-BY)*

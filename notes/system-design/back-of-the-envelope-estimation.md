---
tags:
  [system-design, estimation, scalability, capacity-planning, interview-prep]
title: "Back-of-the-envelope estimation"
---

# Back-of-the-Envelope Estimation

## Goal

Back-of-the-envelope estimation helps you quickly estimate:

- system scale
- traffic
- storage
- bandwidth
- server capacity

during system design interviews.

The interviewer usually cares more about:

- your reasoning
- assumptions
- tradeoff awareness

than perfectly accurate numbers.

---

# 1. Power of Two

Storage systems commonly use powers of two.

| Unit | Value     |
| ---- | --------- |
| KB   | 2¹⁰ bytes |
| MB   | 2²⁰ bytes |
| GB   | 2³⁰ bytes |
| TB   | 2⁴⁰ bytes |
| PB   | 2⁵⁰ bytes |

Useful approximations:

- 1 KB ≈ 1,000 bytes
- 1 MB ≈ 1 million bytes
- 1 GB ≈ 1 billion bytes

These approximations make interview calculations faster.

---

# 2. Latency Numbers

Useful intuition:

```text
CPU Cache
↓

RAM
↓

SSD
↓

Disk
↓

Network
↓

Cross-region Network
```

Key lessons:

- Memory is dramatically faster than disk.
- Disk seeks are expensive.
- Compression is often cheaper than network transfer.
- Cross-region communication adds significant latency.
- Network round trips dominate many distributed system costs.

For more detailed latency references, see:
[system-design-estimation-cheat-sheet.md](./system-design-estimation-cheat-sheet.md)

---

# 3. Availability

Availability measures system uptime.

| Availability | Downtime per Year |
| ------------ | ----------------- |
| 99%          | ~3.65 days        |
| 99.9%        | ~8.8 hours        |
| 99.99%       | ~53 minutes       |
| 99.999%      | ~5 minutes        |

Important intuition:

- Each additional “9” becomes increasingly expensive.
- High availability requires:
  - redundancy
  - failover
  - replication
  - operational maturity
  - careful disaster recovery planning

For more reliability concepts, see:
[reliability-and-networking.md](./reliability-and-networking.md)

---

# 4. Example Estimation (Twitter)

## Assumptions

- 300M monthly active users (MAU)
- 150M daily active users (DAU)
- 2 tweets per user per day
- 10% of tweets include media
- Data retained for 5 years

---

## Daily Active Users

```text
300M × 50%
=
150M
```

---

## Tweet QPS

```text
150M × 2
-----------
86400

≈ 3500 QPS
```

---

## Peak QPS

Peak traffic is usually multiple times average traffic.

```text
≈ 7000 QPS
```

---

## Media Storage per Day

Assume:

- 10% include media
- average media size = 1 MB

```text
150M
× 2
× 10%
× 1MB

≈ 30 TB/day
```

---

## Five-Year Storage

```text
30TB
× 365
× 5

≈ 55PB
```

In real systems, also consider:

- replication factor
- index overhead
- metadata
- backups
- compression

Actual infrastructure requirements are often significantly larger.

---

# 5. Estimation Tips

Interview recommendations:

- Round numbers aggressively.
- State assumptions clearly.
- Always include units.
- Explain your reasoning step-by-step.
- Use approximations to move quickly.
- Mention peak traffic separately from average traffic.

Common things to estimate:

- QPS
- Peak QPS
- Storage
- Cache size
- Number of servers
- Bandwidth
- Replication overhead

---

# Common Estimation Workflow

A practical interview flow:

```text
Users
  ↓
Requests per user
  ↓
Average QPS
  ↓
Peak multiplier
  ↓
Storage growth
  ↓
Bandwidth estimation
  ↓
Capacity planning
```

---

# Practical Rules of Thumb

Common interview shortcuts:

| Estimate           | Rule of Thumb                 |
| ------------------ | ----------------------------- |
| 1 day              | ~100k seconds                 |
| 1 year             | ~31M seconds                  |
| Peak traffic       | ~5× average                   |
| Replication factor | Usually 3                     |
| Cache hit rate     | 80–99%                        |
| JSON overhead      | Often 2–5× larger than binary |

---

# Final Intuition

The purpose of estimation is not mathematical precision.

The purpose is to:

- reason about scale
- identify bottlenecks
- understand infrastructure costs
- communicate tradeoffs clearly

Strong estimations usually prioritize:

- clarity
- reasonable assumptions
- engineering intuition
- fast approximation

over exact arithmetic.

---

# Related Notes

- [System design estimation cheat sheet](./system-design-estimation-cheat-sheet.md)
- [System design interview guide](./system-design-interview-guide.md)
- [Reliability and networking](./reliability-and-networking.md)

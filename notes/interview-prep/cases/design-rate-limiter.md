---
tags: [system-design, interview-prep, rate-limiting, distributed-systems, redis]
title: "Design a Rate Limiter"
---

# Design a Rate Limiter

## Goal

Limit the number of requests within a time window to:

- Prevent abuse and DoS attacks
- Protect servers from overload
- Reduce infrastructure and third-party API costs

---

## Requirements

A good rate limiter should be:

- Accurate
- Low latency
- Memory efficient
- Distributed
- Fault tolerant
- Return clear errors (HTTP 429)

---

## Where to Place It?

### Client-side

- Easy to bypass
- Not recommended

### Server-side

- Full control
- Common solution

### API Gateway (recommended for microservices)

- Centralized
- Also handles auth, SSL, routing, etc.

Choose based on:

- Existing infrastructure
- Engineering resources
- Required flexibility

---

# Rate Limiting Algorithms

## 1. Token Bucket ⭐

How it works:

- Bucket stores tokens.
- Tokens refill periodically.
- Each request consumes one token.
- No token → reject request.

Parameters:

- Bucket size
- Refill rate

Pros:

- Simple
- Memory efficient
- Allows bursts

Cons:

- Parameters require tuning

Used by: Amazon, Stripe

---

## 2. Leaky Bucket

How it works:

- Requests enter a FIFO queue.
- Queue is processed at a constant rate.
- Full queue → reject request.

Parameters:

- Queue size
- Processing rate

Pros:

- Stable output rate
- Memory efficient

Cons:

- Bursts may fill queue with old requests

Used by: Shopify

---

## 3. Fixed Window Counter

How it works:

- Counter per time window.
- Reset at window boundary.
- Reject after limit.

Pros:

- Very simple
- Low memory

Cons:

- Window-edge problem (double burst)

---

## 4. Sliding Window Log

How it works:

- Store timestamp of every request.
- Remove expired timestamps.
- Count remaining timestamps.

Usually implemented with:

- Redis Sorted Set (ZSET)

Pros:

- Very accurate

Cons:

- High memory usage

---

## 5. Sliding Window Counter

Hybrid of:

- Fixed Window
- Sliding Log

Idea:

- Current window count
- Previous window weighted by overlap

Pros:

- Smooths spikes
- Memory efficient

Cons:

- Approximation (not perfectly accurate)

---

# High-Level Architecture

Typical components:

```
Client
   ↓
Rate Limiter Middleware
   ↓
Redis (Counters)
   ↓
API Servers
```

Redis stores counters because:

- Very fast
- Supports expiration (EXPIRE)
- Atomic increment (INCR)

Flow:

1. Read counter
2. Check limit
3. Reject or forward
4. Increment counter

---

# Deep Dive

## Rules

Rules are configuration-driven.

Example:

- Login: 5/min
- Marketing messages: 5/day

---

## Rate-Limited Response

Return:

- HTTP 429
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Retry-After`

Optionally enqueue rejected requests instead of dropping them.

---

## Detailed Flow

```
Client
      ↓
Rate Limiter
      ↓
Load Rules
      ↓
Read Redis
      ↓
Allowed?
   ├── Yes → API
   └── No → HTTP 429 / Queue
```

---

# Distributed Challenges

## Race Condition

Problem:

```
Read counter
Check limit
Increment
```

Two concurrent requests may both succeed incorrectly.

Solutions:

- Lua Scripts
- Redis Sorted Sets
- (Avoid locks due to latency)

---

## Synchronization

Multiple rate limiter instances must share state.

Avoid:

- Sticky Sessions

Prefer:

- Centralized Redis

---

# Performance Optimization

- Multi-region / Edge deployment
- Eventual consistency between regions
- Redis for low latency

---

# Monitoring

Track:

- Requests allowed
- Requests blocked
- Rule effectiveness
- False positives
- Traffic spikes

Adjust:

- Algorithm
- Thresholds
- Refill rates

---

# Additional Interview Topics

- Hard vs Soft rate limiting
- Layer 3 vs Layer 7 rate limiting
- Client retry with exponential backoff
- Client-side caching
- Graceful recovery from HTTP 429

---

# Algorithm Selection Cheat Sheet

| Algorithm       | Burst  | Accuracy  | Memory   | Best Use             |
| --------------- | ------ | --------- | -------- | -------------------- |
| Token Bucket    | ⭐⭐⭐ | Medium    | Low      | General-purpose APIs |
| Leaky Bucket    | ⭐     | Medium    | Low      | Stable throughput    |
| Fixed Window    | ⭐⭐   | Low       | Very Low | Simple systems       |
| Sliding Log     | ⭐⭐⭐ | Very High | High     | Strict rate limiting |
| Sliding Counter | ⭐⭐   | High      | Low      | Production systems   |

---

# Related Notes

- [distributed-systems-algorithms.md](../distributed-systems-algorithms.md) — consistent hashing, gossip, vector clocks
- [reliability-and-networking.md](../reliability-and-networking.md) — load balancing, circuit breakers, retries
- [aws-services-gotchas.md](../aws-services-gotchas.md) — Redis, SQS, API Gateway rate limiting

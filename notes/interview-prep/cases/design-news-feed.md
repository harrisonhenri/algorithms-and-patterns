---
tags: [system-design, interview-prep, feed, fanout, caching, social-media]
title: "Design a News Feed System"
---

# Design a News Feed System

## Goal

Design a system that constantly updates a list of stories in the middle of a user's home page. Support updates like status, photos, videos, links, app activity, and likes from followed people, pages, and groups.

Applicable to: Facebook, Instagram, Twitter.

---

## Requirements and Scope

- **Platform**: Both mobile and web app.
- **Core Features**: Publish a post and view friends' posts on the news feed.
- **Sorting**: Reverse chronological order.
- **Friend Limit**: Up to 5,000 friends per user.
- **Traffic Volume**: 10 million Daily Active Users (DAU).
- **Media Support**: Text, images, and videos.

---

## High-Level Architecture

The design is divided into two primary flows: feed publishing and news feed building.

### Feed Publishing Flow

- **Client**: User sends a request via browser or mobile app.
- **Load Balancer**: Distributes incoming traffic.
- **Web Servers**: Enforce authentication and rate-limiting to prevent spam, then redirect traffic to internal services.
- **Post Service**: Persists the post data into the database and cache.
- **Fanout Service**: Pushes new content to friends' news feed caches for fast retrieval.
- **Notification Service**: Informs friends of new content via push notifications.

### News Feed Building Flow

- **Client**: User requests to retrieve the feed.
- **Load Balancer**: Routes the request to web servers.
- **Web Servers**: Route the requests to the news feed service.
- **News Feed Service**: Fetches feed IDs from the cache, then hydrates them with complete user and post objects from caches.
- **News Feed Cache**: Stores the IDs needed to render the feed.
- **CDN**: Stores media content like images and videos for fast retrieval.
- **Response**: Fully hydrated feed is returned to the client in JSON format.

---

## Core APIs

### Feed Publishing API

- **Endpoint**: `POST /v1/me/feed`
- **Parameters**: `content`, `auth_token`

### News Feed Retrieval API

- **Endpoint**: `GET /v1/me/feed`
- **Parameters**: `auth_token`

---

## Fanout Service Deep Dive

Fanout is the process of delivering a post to all friends.

### Fanout Step-by-Step

1. Fetch friend IDs from the graph database.
2. Get friend info from the user cache and filter out muted or restricted friends.
3. Send the friends list and new post ID to the message queue.
4. Fanout workers fetch data from the queue and store `<post_id, user_id>` mappings in the news feed cache.
5. Set a configurable memory limit to store only IDs, since users rarely scroll through thousands of posts.

### Fanout Model Comparison

| Model                      | Approach                                  | Pros                                                 | Cons                                                                           |
| -------------------------- | ----------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Fanout on write (Push)** | Pre-computed during write time            | Fast reads; generated in real-time                   | Hotkey problem for users with many friends; wastes resources on inactive users |
| **Fanout on read (Pull)**  | Generated on-demand during read time      | Saves resources on inactive users; no hotkey problem | Slow reads; feed generation latency increases                                  |
| **Hybrid (Recommended)**   | Push for most users, pull for celebrities | Fast fetching for majority; prevents overload        | Requires consistent hashing to mitigate hotkeys                                |

---

## Celebrity Problem

A user with millions of followers creates extreme fanout amplification. One write may generate millions of feed updates, causing:

- Queue spikes
- Hot partitions
- Cache hotspots
- Overloaded fanout workers

**Mitigations:**

- Hybrid fanout (pull for high-follower accounts)
- Batching and async queues
- Partitioned workers
- Consistent hashing
- Rate smoothing

---

## Cache Architecture

Cache is divided into 5 layers:

- **News Feed**: Stores IDs of news feeds.
- **Content**: Stores post data, with popular content kept in a hot cache.
- **Social Graph**: Stores user relationship data.
- **Action**: Stores whether a user liked, replied, or interacted with a post.
- **Counters**: Stores aggregate numbers for likes, replies, followers, and following.

---

## Feed Hydration

Timeline cache stores IDs only — e.g. `[post_1, post_2, post_3]`.

Feed service then hydrates:

- Author info
- Post content
- Counters
- Interaction metadata

This keeps memory consumption low, cache invalidation simpler, and fanout payloads smaller.

---

## Key Trade-offs

### Push vs Pull (Fanout)

- **Push**: fast reads, write amplification, celebrity problem.
- **Pull**: slow reads, no amplification, better for inactive users.
- **Hybrid**: production standard.

### Consistency

- News feeds usually prioritize availability and low latency.
- Eventual consistency is acceptable: users may temporarily see delayed likes, comments, or missing recent posts.
- Strong consistency across all feeds is extremely expensive.

### Reverse Chronological vs Ranked Feeds

- Chronological: simpler, predictable, easier to cache.
- Ranked: requires ML/ranking pipelines, engagement scoring, recommendation systems.
- Start chronological in interviews; evolve into ranking systems.

### SQL vs NoSQL

- SQL: relationships, transactions, metadata.
- NoSQL: timeline storage, feed lookup, distributed scalability.
- Graph databases for follower/friendship relationships.
- Key-value stores for feed caches, counters, session state.

---

## Database Sharding

- Common shard key: `user_id`.
- Mitigations for celebrity hotspots: consistent hashing, virtual nodes, hot-shard isolation.

---

## Media Storage

- Images/videos → object/blob storage + CDN edge caching.
- Media pipeline: upload service → transcoding/compression → thumbnail generation → CDN distribution.

---

## Monitoring

- Feed refresh latency
- Fanout queue depth
- Cache hit rate
- Hot partitions
- CDN bandwidth
- Peak QPS
- Storage growth
- Notification delivery lag

---

# Related Notes

- [databases-and-storage.md](../databases-and-storage.md) — SQL vs NoSQL, partitioning, indexing
- [event-driven-architecture.md](../event-driven-architecture.md) — Kafka, queues, fanout patterns
- [reliability-and-networking.md](../reliability-and-networking.md) — CDN, load balancing, circuit breakers
- [aws-services-gotchas.md](../aws-services-gotchas.md) — S3, CloudFront, SQS/SNS for fanout, DynamoDB for timeline
- [distributed-systems-algorithms.md](../distributed-systems-algorithms.md) — consistent hashing, hot partition mitigation

# System Design Estimation Cheat Sheet

## Time

| Unit     | Approximation | Notes     |
| -------- | ------------: | --------- |
| 1 second |           1 s |           |
| 1 minute |          60 s |           |
| 1 hour   |       3,600 s |           |
| 1 day    |      86,400 s | ≈ 100k s  |
| 1 week   |     604,800 s | ≈ 600k s  |
| 1 month  |       30 days | ≈ 2.6M s  |
| 1 year   |      365 days | ≈ 31.5M s |

---

## Storage Units

| Unit | Approximation |   Binary |
| ---- | ------------: | -------: |
| 1 KB |       1,000 B |  1,024 B |
| 1 MB |      1,000 KB | 1,024 KB |
| 1 GB |      1,000 MB | 1,024 MB |
| 1 TB |      1,000 GB | 1,024 GB |
| 1 PB |      1,000 TB | 1,024 TB |

---

## Primitive Data Types

| Type            |              Size |
| --------------- | ----------------: |
| Boolean         |               1 B |
| char (ASCII)    |               1 B |
| char (UTF-16)   |               2 B |
| string (UTF-8)  | ~1 B/char average |
| string (UTF-16) |         ~2 B/char |
| int32           |               4 B |
| int64           |               8 B |
| float           |               4 B |
| double          |               8 B |
| Timestamp       |               8 B |
| UUID            |              16 B |
| IPv4            |               4 B |
| IPv6            |              16 B |

---

## Typical Record Sizes

| Object            | Typical Size |
| ----------------- | -----------: |
| User ID           |       8–16 B |
| Username          |      20–40 B |
| Email             |      30–80 B |
| Password hash     |     60–120 B |
| URL               |    100–200 B |
| Metadata          |    100–500 B |
| Session           |   500 B–2 KB |
| User profile      |       1–5 KB |
| Product           |      2–10 KB |
| Blog post         |      5–20 KB |
| Chat message      |   200 B–2 KB |
| Tweet/Post        |       1–3 KB |
| Kafka event       |       1–5 KB |
| Log entry         |   200 B–1 KB |
| JSON API response |      1–10 KB |

---

## Images

| Image     | Typical Size |
| --------- | -----------: |
| Thumbnail |    20–100 KB |
| Avatar    |    50–200 KB |
| Web image |   100–500 KB |
| JPEG      |       2–5 MB |
| PNG       |      1–10 MB |
| RAW photo |     20–50 MB |

---

## Video

| Resolution | Bitrate | Storage/hour |
| ---------- | ------: | -----------: |
| 480p       |  1 Mbps |      ~450 MB |
| 720p       |  3 Mbps |     ~1.35 GB |
| 1080p      |  5 Mbps |     ~2.25 GB |
| 1440p      | 10 Mbps |      ~4.5 GB |
| 4K         | 20 Mbps |        ~9 GB |

---

## Audio

| Format         |    Typical Size |
| -------------- | --------------: |
| Voice message  | 300 KB–1 MB/min |
| MP3 (128 kbps) |       ~1 MB/min |
| MP3 (320 kbps) |     ~2.5 MB/min |

---

## Network

| Link Speed | Throughput |
| ---------- | ---------: |
| 1 Mbps     |   125 KB/s |
| 10 Mbps    |  1.25 MB/s |
| 100 Mbps   |  12.5 MB/s |
| 1 Gbps     |   125 MB/s |
| 10 Gbps    |  1.25 GB/s |
| 100 Gbps   |  12.5 GB/s |

---

## Requests → Bandwidth

### 1 KB Payload

|       RPS | Bandwidth |
| --------: | --------: |
|       100 |  100 KB/s |
|     1,000 |    1 MB/s |
|    10,000 |   10 MB/s |
|   100,000 |  100 MB/s |
| 1,000,000 |    1 GB/s |

### 10 KB Payload

|     RPS | Bandwidth |
| ------: | --------: |
|     100 |    1 MB/s |
|   1,000 |   10 MB/s |
|  10,000 |  100 MB/s |
| 100,000 |    1 GB/s |

### 100 KB Payload

|    RPS | Bandwidth |
| -----: | --------: |
|    100 |   10 MB/s |
|  1,000 |  100 MB/s |
| 10,000 |    1 GB/s |

### 1 MB Payload

|   RPS | Bandwidth |
| ----: | --------: |
|    10 |   10 MB/s |
|   100 |  100 MB/s |
| 1,000 |    1 GB/s |

---

## Storage Estimation

### 100 B Records

| Records | Storage |
| ------: | ------: |
|     1 M |  100 MB |
|    10 M |    1 GB |
|   100 M |   10 GB |
|     1 B |  100 GB |

### 500 B Records

| Records | Storage |
| ------: | ------: |
|     1 M |  500 MB |
|     2 M |    1 GB |
|    20 M |   10 GB |
|   200 M |  100 GB |

### 1 KB Records

| Records | Storage |
| ------: | ------: |
|     1 M |    1 GB |
|    10 M |   10 GB |
|   100 M |  100 GB |
|     1 B |    1 TB |

### 2 KB Records

| Records | Storage |
| ------: | ------: |
|   500 K |    1 GB |
|     5 M |   10 GB |
|    50 M |  100 GB |
|   500 M |    1 TB |

---

## Cache Capacity

| Cache  | Approximate Objects |
| ------ | ------------------: |
| 1 GB   |   1M × 1 KB objects |
| 10 GB  |  10M × 1 KB objects |
| 100 GB | 100M × 1 KB objects |

---

## Traffic Assumptions

| Metric             | Rule of Thumb                  |
| ------------------ | ------------------------------ |
| Peak traffic       | 3–10× average                  |
| Read-heavy systems | 90/10 reads/writes             |
| Social media       | 95–99% reads                   |
| Banking            | 60/40 to 80/20                 |
| Analytics          | Mostly writes during ingestion |
| Cache hit rate     | 80–99%                         |

---

## User Activity

| Metric                 | Typical Value |
| ---------------------- | ------------: |
| DAU → Concurrent users |         5–10% |
| Concurrent → Active    |        10–20% |
| Request interval       |   5–20 s/user |
| Peak multiplier        | 3–10× average |
| Session duration       |      5–30 min |

---

## Read/Write Ratios

| System          |   Read | Write |
| --------------- | -----: | ----: |
| Banking         |    70% |   30% |
| Messaging       |    80% |   20% |
| Ecommerce       |    90% |   10% |
| News            |    99% |    1% |
| Video streaming |   >99% |   <1% |
| CDN             | >99.9% | <0.1% |

---

## Latency Targets

| Operation             | Typical Latency |
| --------------------- | --------------: |
| L1 cache              |           ~1 ns |
| L2 cache              |           ~4 ns |
| RAM                   |       50–100 ns |
| SSD                   |       50–200 μs |
| HDD seek              |         5–10 ms |
| Redis                 |           <1 ms |
| Database query        |         1–20 ms |
| Internal service call |         5–50 ms |
| Internet API          |       50–300 ms |

---

## Common Interview Assumptions

| Metric                    | Typical Value |
| ------------------------- | ------------: |
| Replication factor        |             3 |
| Compression               |          2–5× |
| Index overhead            |        20–50% |
| Metadata overhead         |        10–30% |
| Storage safety margin     |        20–30% |
| CPU utilization target    |        60–70% |
| Disk utilization target   |          <80% |
| Memory utilization target |          <75% |

---

# Mental Math Shortcuts

| Rule                 |             Approximation |
| -------------------- | ------------------------: |
| 1 day                |             ~100k seconds |
| 1 year               |              ~31M seconds |
| 1 KB × 1M records    |                     ~1 GB |
| 100 B × 10M records  |                     ~1 GB |
| 1 Mbps               |                 ~125 KB/s |
| 1 Mbps               |              ~450 MB/hour |
| 1 Gbps               |                 ~125 MB/s |
| 8 bits               |                    1 byte |
| 1M users × 1 KB      |                     ~1 GB |
| Peak traffic         | 5× average (good default) |
| Replication factor 3 |           Raw storage × 3 |
| Secondary index      |           +20–50% storage |
| JSON vs binary       | JSON is often 2–5× larger |

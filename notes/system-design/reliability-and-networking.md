---
tags: [system-design, networking, theory]
title: "Servers, proxies, gateways, load balancers"
---
# App server vs Web server vs Proxy server vs Reverse proxy vs Gateway vs Load balancer

| Concept | Primary Purpose | Typical Position / OSI Layer | Traffic Direction | Routing Capabilities | Common Features | Statefulness | Examples |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Web Server** | Serve web content and terminate HTTP | Edge or app-adjacent • Mostly L7 (Application) | Client → server | Basic URL/path routing | Static files, TLS, compression, caching | Usually stateless | NGINX, Apache, IIS |
| **Application Server** | Execute business/application logic | Core backend • L7 (Application) | Client → app logic | Application-defined routing | Business logic, DB access, transactions | Can be stateless or stateful | Spring Boot, Django, Node.js |
| **Proxy Server (Forward Proxy)** | Forward outbound client traffic | Client-side intermediary • L4/L7 | Client → external internet | Simple forwarding/filtering | Caching, anonymity, filtering | Usually stateless | Squid, Privoxy |
| **Reverse Proxy** | Front internal services/apps | Edge or ingress layer • Mostly L7 | Internet → internal services | Advanced HTTP routing | TLS termination, caching, auth, rewrites | Usually stateless | NGINX, Envoy, Traefik |
| **API Gateway** | Manage and orchestrate APIs | API boundary / edge • L7 (Application) | Client → APIs/microservices | API-aware routing | OAuth, rate limiting, observability, transformations | Usually stateless | Kong, Tyk, Apigee |
| **Load Balancer** | Distribute traffic across instances | Front of server pools • L4 and/or L7 | Client → server pool | Traffic distribution-focused | Health checks, failover, balancing algorithms | Stateless | AWS ALB/NLB, HAProxy, F5 |

### 1. Reverse Proxy vs Load Balancer

This is the biggest conceptual overlap.

A reverse proxy can:

- load balance
- cache
- terminate TLS
- rewrite requests
- authenticate users

A load balancer can:

- reverse proxy traffic
- terminate TLS
- do path-based routing

Modern infrastructure blurred the boundary.

Example:

- [Envoy Proxy](https://www.envoyproxy.io/?utm_source=chatgpt.com) acts simultaneously as:
    - reverse proxy
    - service mesh proxy
    - load balancer
    - API edge

---

### 2. Application Servers Are Not Necessarily Stateful

Historically:

- Java EE servers (JBoss, WebLogic) tightly managed sessions and state.

Modern cloud-native systems:

- Prefer stateless applications
- Store sessions in Redis, JWTs, or databases

So “stateful” is no longer a defining property of an application server.

---

### 3. “Gateway” Is Ambiguous

“Gateway” alone can mean many things:

- API Gateway
- Network Gateway
- Payment Gateway
- Service Mesh Gateway

This table specifically refers to an **API Gateway**.

---

### 4. Roles vs Products

Many technologies play multiple roles simultaneously.

Example:

- [NGINX](https://nginx.org/?utm_source=chatgpt.com) can be:
    - web server
    - reverse proxy
    - load balancer
    - TLS terminator

These are architectural responsibilities, not mutually exclusive software categories.

Example:

```
NGINX
 ├── serves static files
 ├── reverse proxies /api
 ├── load balances instances
 └── terminates HTTPS
```

---

### 5. L4 vs L7 Routing

A useful mental model:

- **L4 routing** works using:
    - IP
    - Port
    - TCP/UDP connection info
- **L7 routing** understands:
    - URLs
    - Headers
    - Cookies
    - HTTP methods
    - APIs
    - WebSockets
    - gRPC

Example:

```
L4:
192.168.0.10:443 → server A

L7:
GET /api/users → user-service
```

Higher-layer routing gives more flexibility, but generally adds more processing overhead.

---

## Resumo (SLA / SLO / SLI)

# Resumo

| Métrica | O que é | Foco |
| --- | --- | --- |
| **SLA** | Compromisso com o cliente | Externo |
| **SLO** | Meta interna para cumprir o SLA | Interno |
| **SLI** | Medição real do desempenho | Monitoramento |

---

## Resiliency, HA, fault tolerance

# Resiliency, HA, Fault tolerance

<aside>
Remember: a **fault** is a component deviating from spec, while a **failure** is the system no longer providing the required service.

</aside>

| Concept | Definition | Focus | Handles Failures? | Key Techniques / Examples | Typical Metrics |
| --- | --- | --- | --- | --- | --- |
| Resilient / Fault Tolerant | Ability to recover quickly from failures and continue functioning. | Recovery & Continuity | Yes | Retries, circuit breakers, fallback logic, redundancy, failover systems | MTTR (Mean Time to Recovery), system uptime, failover time, error rate |
| **Highly Available** | Minimizes downtime and ensures system is available for use most of the time. | Availability | Contributes | Load balancing, clustering, automatic failover, redundancy | Uptime %, SLA compliance, downtime duration |
| **Reliable** | Consistently performs correctly over time, even when things go wrong. | Accuracy and consistency | Contributes | Data validation, testing, durable storage | Error rate, data loss rate, success rate, MTTF |
| **Scalable** | Can handle increased load without degrading performance. | Performance under growth | No | Horizontal/vertical scaling, auto-scaling groups | Throughput, response time under load, resource utilization |
| **Robust** | Can operate under stress or invalid inputs. | Stability under edge cases | Yes | Input validation, graceful degradation | Crash rate under stress, exception rate |
| **Redundant** | Duplicate components to avoid single points of failure. | Backup systems | Yes | RAID, multiple data centers, active-passive configurations | Redundancy level (N+1, N+2), failover success rate |
| **Elastic** | Dynamically adjusts resources based on demand and reduces resources when demand decreases. | Efficient resource allocation | No | Cloud auto-scaling, container orchestration (Kubernetes) | Auto-scaling latency, cost efficiency, resource utilization % |
|  |  |  |  |  |  |

## Failover types

| **Failover Type** | **Description (includes cost and context)** | **Standby Mode (Readiness & Activity)** | **Recovery Speed (RTO) / Data Loss Risk (RPO)** | **Typical Cost** | **Typical Use Cases** |
| --- | --- | --- | --- | --- | --- |
| **Active–Active** | Multiple nodes handle requests simultaneously. Provides load balancing and instant failover. Highly resilient but complex and costly due to synchronization and consistency overhead. | All nodes fully **active** (no standby) | **RTO:** Near-zero**RPO:** Very low | 💰💰💰 (High) | Web clusters, distributed caches (Redis, DynamoDB), message brokers (Kafka) |
| **Active–Passive (Cold)** | Standby is powered off or manually started after failure. Simplest and cheapest, but slow recovery and higher risk of data loss. | **Cold** – Standby **inactive/off**, requires manual or scripted start | **RTO:** Hours**RPO:** High | 💰 (Low) | Non-critical workloads, dev/test, cost-optimized setups |
| **Active–Passive (Warm)** | Standby runs partially and syncs periodically. Balanced cost vs. recovery time; small chance of losing recent data. | **Warm** – Standby **semi-active**, periodically synchronized | **RTO:** Minutes**RPO:** Medium | 💰💰 (Moderate) | Disaster recovery sites, RDS Multi-AZ, secondary cloud regions |
| **Active–Passive (Hot)** | Fully synchronized mirror ready for instant takeover. High cost but minimal downtime and data loss. | **Hot** – Standby **active**, fully synchronized but not serving traffic | **RTO:** Seconds**RPO:** Near-zero | 💰💰💰 (High) | Mission-critical systems (banking, aviation, telecom) |
| **N+1 Redundancy** | One or more standby nodes protect several active nodes. Shares spare capacity, reducing cost while keeping reliability. | **Warm/Shared** – Standby covers multiple actives | **RTO:** Seconds–Minutes**RPO:** Low | 💰💰 (Moderate) | Load balancers, clustered web servers |
| **Geo-Distributed Failover** | Systems replicated across regions for large-scale disaster recovery. Extremely resilient but adds latency and replication cost. | **Warm or Hot** – Remote standby varies by sync mode | **RTO:** Seconds–Minutes**RPO:** Depends on replication | 💰💰💰 (High–Very High) | Multi-region cloud deployments, global services |

## SLA, SLO e SLI

SLA, SLO e SLI são métricas usadas para medir a saúde e a confiabilidade de um sistema. Elas ajudam a entender se tudo está funcionando bem ou se há risco de problemas.

### Analogia do Hospital

Imagine que seu sistema é um hospital:

- O objetivo é atender pacientes com **rapidez e qualidade**.
- Cada métrica representa um nível diferente de compromisso e acompanhamento.

---

### SLA (Service Level Agreement)

É o **compromisso público** firmado com o cliente.

> Exemplo: “Atendemos em até 15 minutos.”
> 
- Define o que foi prometido oficialmente.
- Pode envolver penalidades se não for cumprido.
- Representa o contrato entre empresa e cliente.

Se o SLA for descumprido, pode haver multa ou quebra de confiança do cliente.

---

### SLO (Service Level Objective)

É a **meta interna da equipe** para garantir que o SLA seja cumprido com margem de segurança.

> Exemplo: Realizar 90% dos atendimentos em até 10 minutos.
> 
- Funciona como um alvo operacional.
- É mais rigoroso que o SLA.
- Ajuda a evitar violações do contrato.

---

### SLI (Service Level Indicator)

É o **indicador real medido**.

> Exemplo: Tempo médio real de atendimento nas últimas 24h.
> 
- Mostra o que realmente aconteceu.
- É a métrica observável do desempenho do sistema.

Se o **SLI ficar abaixo do SLO**, é sinal de alerta 🚨 — o SLA pode estar em risco.

---

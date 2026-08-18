# Agent-to-Agent (A2A) Protocol

## Overview

A2A (Agent2Agent) is an open protocol that defines how autonomous AI agents discover, communicate with, and delegate tasks to one another across organizational and framework boundaries.

It was created by Google and open-sourced in April 2025, then donated to the **Linux Foundation** (LF AI & Data) for community governance. The current specification version is 1.0.1. The canonical repository is `a2aproject/A2A` (Apache 2.0 license).

**Core problem A2A solves:**

Before A2A, the only way for one agent to use another was to wrap it as a tool — a stateless function call. That approach is insufficient when the counterpart is an autonomous reasoning system that:

- needs multiple turns to clarify intent
- runs tasks for minutes or hours
- requires auth credentials mid-execution
- produces rich, typed artifacts

A2A gives agents a standard way to behave as peers: discover capabilities, delegate tasks, exchange context, and receive results without either side exposing internal memory, tool implementations, or reasoning traces.

---

# Core Concepts

---

# Agent Card

The Agent Card is the entry point for discovery. Every A2A server exposes a JSON manifest at:

```
GET /.well-known/agent-card.json
```

The card declares:

- **Identity** — name, description, version, provider, icon, documentation URL
- **Capabilities** — whether the agent supports streaming, push notifications, and protocol extensions
- **Skills** — array of skill objects, each with an ID, name, description, tags, examples, and supported input/output MIME types
- **Supported Interfaces** — protocol bindings (JSON-RPC 2.0, gRPC, HTTP+JSON) with their endpoint URLs, protocol versions, and optional tenant routing fields
- **Security Schemes** — supported authentication mechanisms (API key, Bearer/JWT, OAuth 2.0, OpenID Connect, mTLS)
- **Signatures** — optional JWS signatures (RFC 7515) for tamper verification

An agent can also serve an **Extended Agent Card** (via authenticated `GET /extendedAgentCard`) that reveals additional skills not exposed publicly.

Clients parse the Agent Card to determine what an agent can do, how to reach it, and how to authenticate before sending a single byte of task data.

---

# Task

The Task is the fundamental unit of work. Every non-trivial interaction creates a server-generated Task with a UUID.

### Task fields

- `id` — unique identifier
- `contextId` — groups related tasks and messages into a logical conversation session
- `status` — current `TaskState` with optional message and timestamp
- `artifacts` — output results produced by the agent
- `history` — message turns exchanged during the task
- `metadata` — arbitrary key-value pairs

### Task lifecycle

| State            | Category    | Meaning                            |
| ---------------- | ----------- | ---------------------------------- |
| `SUBMITTED`      | Active      | Acknowledged; not yet processing   |
| `WORKING`        | Active      | Actively being processed           |
| `INPUT_REQUIRED` | Interrupted | Agent needs more input from client |
| `AUTH_REQUIRED`  | Interrupted | Agent needs credentials            |
| `COMPLETED`      | Terminal    | Finished successfully              |
| `FAILED`         | Terminal    | Finished with error                |
| `CANCELED`       | Terminal    | Canceled before completion         |
| `REJECTED`       | Terminal    | Agent refused the task             |

Interrupted states are not terminal — the task resumes once the client provides the needed input or credentials.

---

# Message

A Message is a single conversational turn. Roles are `ROLE_USER` (client) and `ROLE_AGENT` (server).

Messages are used to initiate tasks, provide clarification, and carry status updates. They should **not** carry task results — that is the responsibility of Artifacts.

Messages may reference prior tasks via `referenceTaskIds` for context continuity across sessions.

---

# Part

A Part is the atomic content unit inside a Message or Artifact. Each Part holds exactly one of:

- `text` — plain string
- `raw` — binary bytes (base64-encoded in JSON)
- `url` — link to file content
- `data` — arbitrary structured JSON

Parts also carry `mediaType` (MIME type), optional `filename`, and `metadata`.

---

# Artifact

An Artifact is a named, typed output — the persistent deliverable of a task. It contains one or more Parts and is attached to `Task.artifacts`.

Unlike messages (ephemeral communication), artifacts survive the conversation as the result. Examples: a generated PDF, a JSON dataset, a rendered image.

---

# Update Delivery Mechanisms

A2A supports three mechanisms for receiving task updates, covering all connectivity scenarios:

| Mechanism              | How it works                                                                               | Best for                                |
| ---------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------- |
| **Polling**            | `GET /tasks/{id}` on an interval                                                           | Simple integrations, firewalled clients |
| **Streaming (SSE)**    | `POST /message:stream` or `POST /tasks/{id}:subscribe` returns a Server-Sent Events stream | Real-time dashboards, interactive UX    |
| **Push notifications** | Client registers a webhook URL; agent HTTP-POSTs updates to it                             | Server-to-server, long-running tasks    |

Streaming and push notifications are opt-in capabilities declared in the Agent Card. The SSE and webhook payload formats are identical, making it straightforward to switch between them.

---

# Communication Flow

```
1. DISCOVERY
Client
  → GET /.well-known/agent-card.json
  ← AgentCard (skills, capabilities, auth schemes, endpoint URL)

2. AUTHENTICATION (out-of-band)
Client → Auth Server (OAuth flow, OIDC, API key exchange, etc.)
  ← JWT / Bearer token

3. TASK INITIATION
Client
  → POST /message:send   (Message with task intent; JWT in Authorization header)
  ← Task { id, contextId, status: SUBMITTED }

4a. STREAMING PATH
Client
  → POST /message:stream
  ← SSE: Task (WORKING)
  ← SSE: TaskArtifactUpdateEvent (chunk 1)
  ← SSE: TaskArtifactUpdateEvent (chunk N, lastChunk: true)
  ← SSE: TaskStatusUpdateEvent (COMPLETED)

4b. ASYNC / WEBHOOK PATH
Client
  → POST /tasks/{id}/pushNotificationConfigs  (registers webhook URL)
  ← 200 OK

  [task runs asynchronously...]

Agent
  → POST {webhook_url}  (TaskStatusUpdateEvent: COMPLETED)
  ← 200 OK (acknowledged)

5. MULTI-TURN (when INPUT_REQUIRED or AUTH_REQUIRED)
Agent  ← Task { status: INPUT_REQUIRED, message: "Which region?" }
Client → POST /message:send  (same taskId, clarification message)
Agent  ← Task { status: COMPLETED, artifacts: [...] }
```

### Key operational details

- By default `POST /message:send` blocks until the task reaches a terminal or interrupted state. Set `returnImmediately: true` in `SendMessageConfiguration` for non-blocking behavior.
- `contextId` groups related tasks into a logical session. Agents may infer it from `taskId`.
- `AUTH_REQUIRED` allows an agent to pause mid-task and delegate credential acquisition up the chain — the orchestrator pauses too, propagating the request to the user.

---

# A2A vs MCP

A2A and MCP (Model Context Protocol, by Anthropic) are **complementary, not competing** standards.

| Dimension             | MCP                                                | A2A                                               |
| --------------------- | -------------------------------------------------- | ------------------------------------------------- |
| **Focus**             | Agent ↔ Tool / Resource                            | Agent ↔ Agent                                     |
| **Counterpart**       | Stateless functions (APIs, databases, calculators) | Autonomous, stateful agents that reason and plan  |
| **Interaction style** | Structured function call, single-turn              | Multi-turn conversations, negotiation, delegation |
| **State**             | Typically stateless                                | Stateful tasks with full lifecycle management     |
| **Discovery**         | Tool schema / function descriptions                | Agent Cards with skills, capabilities, auth       |
| **Latency**           | Immediate (synchronous)                            | Async-first; tasks run for seconds to hours       |

### How they combine in practice

```
Orchestrator Agent
  │
  ├── A2A → Specialist Agent A   (autonomous, stateful, multi-turn)
  │           └── MCP → Database
  │           └── MCP → Web Search API
  │
  └── A2A → Specialist Agent B   (autonomous, stateful, multi-turn)
              └── MCP → Code Execution Sandbox
```

The orchestrator uses A2A to delegate tasks to specialist agents. Each specialist uses MCP to call its own tools. An A2A Server can also expose some skills as MCP-compatible resources for simple, stateless invocations — but A2A's primary strength is richer, stateful, multi-turn collaboration.

---

# Key Design Principles

### Simple

Reuses existing, well-understood standards: HTTPS, JSON-RPC 2.0, Server-Sent Events, Protocol Buffers. No new transport was invented.

### Enterprise Ready

Built-in support for OAuth 2.0, OIDC, mTLS, API keys, authorization scoping, TLS, audit logging, rate limiting, multi-tenancy (via `tenant` routing field in the Agent Card), and Agent Card signing (JWS / RFC 7515).

### Async First

Natively supports long-running operations. Tasks can persist for extended periods, pause for human-in-the-loop approvals, gate on auth acquisition, and deliver progress via streaming or webhooks.

### Modality Agnostic

Parts and Artifacts support any MIME type: `text/plain`, `application/json`, `image/png`, `video/mp4`, `application/pdf`. Agents declare `defaultInputModes` and `defaultOutputModes` in their card; clients declare `acceptedOutputModes` per request.

### Opaque Execution

Agents collaborate based only on declared capabilities and exchanged messages. Internal memory, tool implementations, reasoning traces, and proprietary logic are never exposed. This preserves intellectual property and limits lateral attack surface.

### Protocol Neutral

The canonical data model is defined in Protocol Buffers as the normative source. Three official bindings exist: JSON-RPC 2.0, gRPC, and HTTP+JSON/REST. Custom bindings are supported via the extension mechanism.

### Versioned and Extensible

Clients send an `A2A-Version` header; servers return `VersionNotSupportedError` for unsupported versions. Agents declare protocol extensions in their Agent Card; clients opt in via `A2A-Extensions`. Extensions can be required or optional, URI-addressed with versioning via URI changes on breaking changes.

---

# When to Use A2A

**Use A2A when:**

- Two autonomous, stateful agents need to collaborate as peers — orchestrator delegating to specialist
- Interactions are multi-turn: clarification, negotiation, back-and-forth reasoning
- Agents are built by different teams or vendors and must interoperate without sharing internals
- Tasks are long-running (minutes to hours) and require async callbacks or streaming progress
- You need agents from different frameworks (LangGraph, Google ADK, CrewAI, AutoGen, BeeAI) to collaborate without custom bridges
- Enterprise security is required: authentication, authorization scoping, observability, multi-tenancy

**Use MCP instead when:**

- Your agent needs to call a stateless tool or external API (database query, calculator, file lookup)
- The integration is a single-turn function call with structured inputs and outputs
- The counterpart is a resource, not an agent — it does not reason, plan, or maintain state

**Use direct API calls when:**

- You control both sides completely and the protocol overhead provides no value
- Performance is the only requirement and standardization is unnecessary

---

# Relationship to Agent Orchestration Patterns

A2A is the transport and protocol layer that enables multi-agent orchestration patterns across process and organizational boundaries. It does not define the orchestration logic — that remains the responsibility of the pattern.

| Orchestration Pattern         | How A2A enables it                                                                                                            |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Supervisor–Workers**        | Supervisor delegates to worker agents via A2A; each worker is a remote A2A server with declared skills                        |
| **Planner–Executor**          | Planner sends decomposed tasks to specialized executor agents via A2A; each executor runs independently                       |
| **Parallel Fan-Out / Gather** | Coordinator issues concurrent A2A tasks to specialist agents; SSE streaming surfaces partial results                          |
| **Event-Driven Agents**       | Long-running A2A tasks with push notification webhooks map directly to event-driven async workflows                           |
| **ReAct**                     | An A2A-capable agent appears as a callable tool in the orchestrator's tool registry, invokable from any Thought → Action step |

See [Agent Orchestration Patterns](./agent-orchestration-patterns.md) for a full treatment of each pattern and when to use them.

---

# Related Concepts

## Distributed systems

- Durable execution (checkpoints, retries, idempotency)
- Webhook delivery guarantees
- Long-polling vs push vs streaming trade-offs

## Enterprise integration

- Channel Adapter (A2A as an adapter between agent frameworks)
- Event-Driven Consumer (webhook-triggered agent activation)
- Process Manager (orchestrator managing A2A task lifecycles)

## AI engineering

- MCP (Model Context Protocol) — tool and resource access
- Multi-agent collaboration and swarm architectures
- Human-in-the-loop approval workflows
- Agent observability and tracing across A2A boundaries

---

# References

- [A2A specification](https://a2aproject.github.io/A2A/) — canonical reference
- [a2aproject/A2A on GitHub](https://github.com/a2aproject/A2A) — open-source repository (Apache 2.0)
- [Google announcement](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/) — original April 2025 blog post
- [Agent Orchestration Patterns](./agent-orchestration-patterns.md) — orchestration patterns that A2A enables at scale

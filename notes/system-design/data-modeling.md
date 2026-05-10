---
tags: [system-design, data-modeling, theory]
title: "Data modeling layers"
---
# Data Model

A **data model** is a structured way to represent, organize, and interact with data in software systems. It defines:

- **What data** is stored
- **How it is structured**
- **How it can be accessed and manipulated**

---

## Layers of Data Models

Most software applications are built by **layering data models** on top of each other. Each layer hides the complexity of the one below it.

| Layer | Description | Example |
| --- | --- | --- |
| **1. Application Layer** | Models the real world using objects or data structures | Classes for `User`, `Order`, etc. |
| **2. General-Purpose Data Model** | Maps structures to a database-friendly format | Relational (SQL), Document (JSON), Graph |
| **3. Storage Engine** | Manages low-level representation of data | Indexes, memory structures, serialization |
| **4. Hardware Layer** | Stores data as physical signals | Electrical currents, light pulses, magnetic fields |

## Why Data Models Matter

- They **shape how we think** about the problem we're solving.
- They influence **how data is stored, queried, and processed**.
- The wrong model can make certain tasks **slow, awkward, or impossible**.
- Choosing the right model helps you build **efficient, maintainable software**.

## Choosing the Right Data Model

Different models have different strengths:

| Data Model | Best For | Format | Example |
| --- | --- | --- | --- |
| **Relational** | Structured, tabular data with strong relationships | Tables | SQL databases (PostgreSQL, MySQL) |
| **Document** | Semi-structured or nested data | JSON, BSON, XML | MongoDB, CouchDB |
| **Graph** | Complex, interconnected data | Nodes and Edges | Neo4j, ArangoDB |

Each model has trade-offs in:

- **Query performance**
- **Schema flexibility**
- **Ease of use**
- **Scalability**

<aside>

**DES, Blowfish and RC4 algorithms are vulnerable to attacks that allow an attacker to view communication in plaintext. Currently, AES has not been proved to be vulnerable so it is the best choice for encryption in TLS connections.**

</aside>

![image.png](../assets/microservices/image%204.png)

![image.png](../assets/microservices/image%205.png)

# Retrieval-Augmented Generation Architecture

## Overview

Retrieval-Augmented Generation (RAG) has evolved from attaching external documents to an LLM into a sophisticated multi-stage system for grounding, reasoning, and information access.

The central architectural lesson of modern RAG is that **retrieval is not a single operation**.

A production-quality RAG system is a sequence of increasingly expensive information-reduction stages:

```
Query
  → Understanding
  → Candidate Generation
  → Fusion
  → Reranking
  → Compression
  → Generation
  → Verification
```

Each stage solves a different problem:

| Stage                     | Question answered                                                          |
| ------------------------- | -------------------------------------------------------------------------- |
| Lexical retrieval         | Which documents contain the important words?                               |
| Dense retrieval           | Which documents express concepts similar to the query?                     |
| Hybrid retrieval          | Can we combine lexical exactness with semantic similarity?                 |
| Graph retrieval           | Which entities, relationships, and communities are structurally connected? |
| Late interaction          | Which documents contain the strongest token-level matches?                 |
| Cross-encoder reranking   | Which candidates are actually most relevant to this specific query?        |
| Context compression       | Which portions of the retrieved material are necessary?                    |
| Agentic / self-reflective | Is the current evidence sufficient, or should the system retrieve again?   |

Modern RAG should not be thought of as:

```
Embedding → Vector DB → LLM
```

but rather as a **multi-stage information retrieval and reasoning system**:

```
R(q) = G( C( S( F( E(q) ) ) ) )

E = query understanding and expansion
F = candidate retrieval and fusion
S = semantic reranking
C = context selection / compression
G = generation and verification
```

The most effective architectures do not replace older retrieval methods. They **compose them**.

---

## Conceptual Architecture

```
                ┌───────────────────┐
                │      User Query   │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ Query Processing  │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │    Retrieval      │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │    Reranking      │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ Context Selection │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │       LLM         │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ Verification /    │
                │ Citation / Output │
                └───────────────────┘
```

---

## Historical Evolution

| Era              | Architecture                  | Representation           | Primary Strength                  | Primary Weakness                 |
| ---------------- | ----------------------------- | ------------------------ | --------------------------------- | -------------------------------- |
| Pre-RAG          | TF-IDF / BM25                 | Terms                    | Exact lexical matching            | Vocabulary mismatch              |
| Early RAG        | Dense bi-encoder              | Single vector            | Semantic similarity               | Loss of fine-grained information |
| Advanced RAG     | Hybrid + query optimization   | Multiple representations | Better recall and precision       | More pipeline complexity         |
| GraphRAG         | Knowledge graph + communities | Nodes, edges, summaries  | Global / cross-document reasoning | Expensive indexing               |
| Late Interaction | ColBERT-style multi-vector    | Token vectors            | Fine-grained semantic matching    | Higher storage cost              |
| Agentic RAG      | Iterative retrieval           | Dynamic state            | Multi-hop reasoning               | Latency and control complexity   |
| Modular RAG      | Composable operators          | Multiple modalities      | Flexible orchestration            | Operational complexity           |

### Lexical Era

Classical information retrieval relies on inverted indexes and term-weighting via BM25.

Remains highly effective for:

- names, product IDs, error messages
- legal clauses, exact terminology
- source-code identifiers, acronyms, version numbers
- rare domain-specific terms

The importance of lexical retrieval has not disappeared in the age of embeddings.

### Dense Retrieval Era

Neural embedding models changed retrieval from symbolic matching to geometric similarity. A query and document are each mapped to a vector and relevance is approximated by dot product or cosine similarity.

Dense retrieval excels when query and document use different vocabulary but express the same concept:

```
Query:    "How can I terminate my subscription?"
Document: "Customers may cancel their membership at any time..."
```

A lexical system may not regard these as strongly related. A dense retriever can.

### Hybrid Retrieval

Lexical and dense retrieval have complementary failure modes. Modern systems execute both:

```
                    Query
                      │
             ┌────────┴────────┐
             ▼                 ▼
          BM25             Dense ANN
             │                 │
             └────────┬────────┘
                      ▼
                  Fusion
                      │
                      ▼
                 Reranking
```

Particularly valuable in enterprise systems where exact identifiers coexist with natural language.

### Graph-Based Retrieval

Dense retrieval captures local semantic similarity. Many questions are relational:

> "Which suppliers are exposed to companies affected by the acquisition?"

Answering requires traversing structured relationships:

```
Company_A → AcquiredBy → Company_B → Supplier → Region
```

A vector representation does not explicitly encode this topology. GraphRAG-style architectures construct an intermediate representation of entities, relationships, claims, communities, and hierarchical summaries.

### Late Interaction

A standard dense retriever compresses an entire document into one vector. This is computationally efficient but information-destructive.

ColBERT-style architectures retain **multiple contextualized vectors** per document — one per token. This creates a middle ground between fast single-vector retrieval and expensive cross-encoder inference.

---

## The Four Retrieval Paradigms

### 1. Lexical Retrieval (BM25)

BM25 is the classical lexical ranking function that combines **term frequency** (TF), **inverse document frequency** (IDF), with term-frequency saturation and document-length normalization.

**Strengths:** Excellent exact matching, extremely fast, interpretable scoring, great for rare terminology (names, product IDs, error messages, domain-specific terms).

**Weaknesses:** Synonym mismatch, paraphrase mismatch, weak semantic understanding.

> **For detailed formulas, tuning parameters, and implementation guidance**, see [Lexical Ranking: TF, IDF, and BM25](../../notes/system-design/text-and-lexical-search.md#lexical-ranking-tf-idf-and-bm25) in the text-and-lexical-search reference.

### 2. Dense Vector Retrieval

Text is mapped into continuous vector spaces. Given a query vector `q` and document vectors `X`, the system seeks the top-K most similar vectors.

Common similarity metrics:

- **Dot product:** `S(x, q) = xᵀq`
- **Cosine similarity:** `S(x, q) = (xᵀq) / (|x| × |q|)`
- **Euclidean distance:** `d(x, q) = sqrt(sum of (xi - qi)²)`

The choice of metric must correspond to the embedding model's training objective and normalization assumptions.

### 3. Hybrid Retrieval

Runs BM25 and dense retrieval in parallel and fuses results. See the [Hybrid Retrieval & Fusion](#hybrid-retrieval--fusion) section.

### 4. Graph Retrieval

Traverses explicit entity-relationship graphs. Enables relational, multi-hop, and corpus-level reasoning. See the [GraphRAG](#graphrag) section.

---

## Approximate Nearest Neighbor Search

Brute-force vector search against N vectors of dimension d is `O(N × d)`. For millions or billions of vectors, this is expensive.

Approximate Nearest Neighbor (ANN) algorithms trade some recall for dramatically lower search cost. Major families:

- HNSW (Hierarchical Navigable Small World)
- IVF (Inverted File Index)
- IVF-PQ (IVF with Product Quantization)
- Tree-based and graph-based indexes

ANN is an **engineering trade-off**, not an exact mathematical replacement for nearest-neighbor search.

### HNSW

HNSW represents vectors as a navigable multi-layer graph:

```
Layer L       ●──────────────●
               \              \
Layer L-1       ●──────●──────●
                 \      \     /
Layer 1           ●──●──●──●──●
                   \ │ / │ \ /
Layer 0        ●─●─●─●─●─●─●─●─●
```

Higher layers contain fewer nodes and longer-range connections. Lower layers contain the dense graph for final retrieval.

**Search process:**

1. Enter at an upper layer
2. Greedily navigate toward the query
3. Descend to the next layer
4. Repeat until Layer 0
5. At Layer 0, perform broader best-first search controlled by `efSearch`

**Key parameters:**

| Parameter        | Role                        | Effect of increasing                         |
| ---------------- | --------------------------- | -------------------------------------------- |
| `M`              | Graph connectivity          | Higher recall, more memory and indexing cost |
| `efConstruction` | Construction search breadth | Better graph quality, slower indexing        |
| `efSearch`       | Query search breadth        | Higher recall, higher latency                |

The fundamental trade-off: `Recall ↑ ⟺ Latency ↑`

---

## Product Quantization

Large-scale vector retrieval creates a memory problem. A dataset of 100M vectors at dimension 768 stored as FP32 requires approximately 307 GB before accounting for indexing structures.

Product Quantization (PQ) decomposes vectors into subvectors and quantizes each against a learned codebook. Each subvector is replaced by the index of its nearest centroid. With 256 centroids per subvector, each index requires only 8 bits (`log2(256)`).

PQ converts large floating-point vectors into compact codes — substantially reducing memory while preserving approximate similarity.

---

## Hybrid Retrieval & Fusion

Consider a query like:

> "What was the impairment charge recorded under ASC 360?"

The terms `ASC 360` and `impairment charge` are highly discriminative lexically. BM25 protects against the dense model retrieving documents about impairment more generally.

Conversely:

> "How did management's restructuring affect profitability?"

may benefit more from dense retrieval because relevant documents might not use the exact words.

Hybrid retrieval combines both.

### Score Fusion

A simple weighted combination:

```
S(d) = α × S_dense(d) + (1 - α) × S_BM25(d)
```

However, raw scores from BM25 and vector search are not calibrated to the same distribution.

### Reciprocal Rank Fusion (RRF)

A more robust rank-based strategy:

```
RRF(d) = sum over retrieval systems r of:
  1 / (k + rank_r(d))
```

A document appearing near the top of both rankings receives a strong fused score. RRF is particularly useful when retrieval systems produce incompatible score distributions.

---

## Query Understanding

Retrieval quality depends heavily on how the query is represented. Users frequently issue queries that are ambiguous, conversational, underspecified, or dependent on previous conversation turns.

### Query Rewriting

Transforms an underspecified query into a more explicit retrieval query:

```
Input:  "What about their exposure in Europe?"
Output: "What is Company X's regulatory and operational exposure in European markets?"
```

The rewriting model should preserve the user's information need while removing conversational ambiguity.

### HyDE — Hypothetical Document Embeddings

Addresses a subtle problem: a user query and a relevant document often occupy different linguistic distributions.

Instead of embedding the query directly, the system asks an LLM to generate a hypothetical answer/document, then embeds that:

```
User Query
    │
    ▼
Hypothetical Document (generated, not necessarily factually correct)
    │
    ▼
Embedding
    │
    ▼
Dense Retrieval
```

The hypothetical document does not need to be factually correct. Its purpose is to produce a representation closer to the style and semantic density of corpus documents.

**Trade-off:** can improve retrieval for knowledge-intensive queries but adds generation latency and can propagate query misunderstanding into the retrieval stage.

### Query Decomposition

Complex queries contain multiple information needs. Decomposition transforms one query into subqueries:

```
Q → {q1, q2, ..., qn}
```

Each subquery is retrieved independently; results are joined during synthesis.

Particularly valuable for:

- multi-hop questions
- comparative analysis
- temporal reasoning
- entity resolution
- relational queries

---

## Reranking: The Critical Middle Layer

Reranking is arguably the most important component separating a basic RAG system from a high-quality architecture.

- **Retriever:** optimized for candidate generation → prioritizes **Recall**
- **Reranker:** optimized for candidate ordering → prioritizes **Precision@K**

```
Retriever:  1,000,000 → 100
Reranker:         100 → 10
```

This is a classic information-retrieval cascade. A reranker cannot recover a document the retriever failed to retrieve — if the relevant document is absent from the candidate set, no reranker can surface it.

**Two separate metrics:**

```
Recall@K    = Relevant docs in top K / Total relevant docs
Precision@K = Relevant docs in top K / K
```

Poor recall cannot be rescued by an excellent reranker. Poor ordering can still provide terrible context to the LLM even with excellent recall.

### Reranking Objectives

**Pointwise:** each document receives an independent score `s_i = f(q, d_i)`.

**Pairwise:** the model learns `P(d_i > d_j | q)` — whether one document should rank above another.

**Listwise:** the model considers the full candidate set as a ranking problem `P(π | q, D)`.

---

## Why Single-Vector Retrieval Loses Information

A bi-encoder compresses a 1,000-token document into a single vector (e.g., 768 dimensions). This single vector must simultaneously represent topic, entities, relationships, terminology, numerical information, and semantic context.

This creates a fundamental hierarchy of accuracy vs. cost:

```
Single Vector
     │  Fast
     ▼
Approximate Semantic Retrieval
     │
     ▼
Multi-Vector Late Interaction
     │
     ▼
Cross-Encoder
     │  Expensive
     ▼
Full Query-Document Attention
```

---

## Late Interaction & ColBERT

ColBERT occupies the middle ground between bi-encoders and cross-encoders.

Instead of compressing a document to one vector, it retains one vector per token:

```
D → {d1, d2, ..., dn}   (n token vectors)
Q → {q1, q2, ..., qm}   (m token vectors)
```

Query and document are encoded **independently** — documents can be precomputed. Interaction happens at search time via **MaxSim**.

### MaxSim

The core scoring mechanism:

```
Score(Q, D) = sum over each query token qi of:
  max over all document tokens dj of:
    qi · dj
```

For each query token, find the document token with maximum similarity, then sum across all query tokens:

```
Query Tokens                 Document Tokens

"acquisition"      ────────► "acquired"
"regulatory"       ────────► "regulation"
"exposure"         ────────► "exposure"
"Europe"           ────────► "European"
```

The model does not require the entire document to be globally similar. Different portions can independently satisfy different parts of the query — this is the critical advantage of late interaction.

### Architecture Comparison

| Architecture     | Query Encoding           | Document Encoding        | Interaction    | Accuracy  | Latency  |
| ---------------- | ------------------------ | ------------------------ | -------------- | --------- | -------- |
| Bi-Encoder       | Independent              | Independent              | Dot product    | Good      | Very low |
| Late Interaction | Independent multi-vector | Independent multi-vector | MaxSim         | Very high | Medium   |
| Cross-Encoder    | Joint                    | Joint                    | Full attention | Highest   | High     |

### Cross-Encoder

A cross-encoder receives query and document jointly and runs full self-attention across all tokens:

```
[CLS] query [SEP] document [SEP]
```

This is computationally expensive because each candidate requires a forward pass with both query and document. But it provides a major advantage: the model can directly inspect interactions between specific query terms and document terms.

### PLAID (Efficient Late Interaction)

The major obstacle to ColBERT-style retrieval is storage: memory scales with `N × L × d` where L is vectors per document.

PLAID-style systems accelerate candidate pruning before full MaxSim evaluation:

```
All Passage Vectors
       │
       ▼
Centroid / Cluster Filtering
       │
       ▼
Candidate Pruning
       │
       ▼
Approximate MaxSim
       │
       ▼
Exact MaxSim
       │
       ▼
Top-K
```

The pattern: cheap approximate computation reduces the candidate set before expensive exact computation.

---

## Reranking Cascade in Production

A mature RAG system employs a cascade:

```
Stage 1 — Broad Retrieval
  BM25: top 100
  Dense: top 100

Stage 2 — Fusion
  Union / RRF → ~150 candidates

Stage 3 — Lightweight Semantic Reranker
  150 → 50

Stage 4 — Late Interaction
  50 → 20

Stage 5 — Cross-Encoder
  20 → 5–10

Stage 6 — Context Compression
  5–10 documents → relevant passages

Stage 7 — Generation
  Compressed evidence → LLM
```

Expensive models operate only on candidates that have already survived inexpensive filtering.

---

## Context Compression

A retrieved document may contain 5,000 tokens while only 100 tokens answer the question. Feeding the entire document to the LLM introduces token cost, distraction, redundancy, context-window pressure, and attention dilution.

Context compression operates after retrieval and reranking.

**Strategies:**

- **Extractive:** select relevant sentences or passages
- **Abstractive:** ask an LLM to summarize the evidence
- **Token-level:** remove low-information tokens while preserving semantic content
- **Query-focused:** retain only information directly relevant to the query

The objective is not simply to make the context shorter. It is to maximize:

```
Relevant Information / Context Tokens
```

### Lost in the Middle

LLMs do not necessarily use every retrieved passage equally well. Information positioned in the middle of a large context can receive less effective attention than information near the beginning or end.

```
More retrieved information ≠ Better answer
```

The correct objective is to maximize **evidence quality**, not quantity. This is a primary reason reranking and compression matter so much.

---

## GraphRAG

Dense retrieval asks: _which pieces of text are near the query in embedding space?_

Graph retrieval asks: _which entities and relationships are structurally connected to the information need?_

This difference is important for global questions:

> "What are the major risk themes shared across all business units?"

Retrieving the top 10 semantically similar passages produces local evidence. A graph-based system can instead reason over:

```
Business Unit A
 ├── Supplier Risk
 ├── Regulatory Risk
 └── Cybersecurity

Business Unit B
 ├── Supplier Risk
 ├── Currency Risk
 └── Cybersecurity

Business Unit C
 ├── Supplier Risk
 └── Regulatory Risk
```

The repeated topology exposes corpus-level themes that local similarity cannot surface.

### Indexing Pipeline

```
Documents
   │
   ▼
Chunking
   │
   ▼
Entity Extraction
   │
   ▼
Relationship Extraction
   │
   ▼
Claim Extraction
   │
   ▼
Graph Construction  G = (V, E)
   │
   ▼
Community Detection (e.g., Leiden)
   │
   ▼
Community Summarization
   │
   ▼
Hierarchical Knowledge Representation
```

Graph attributes can encode provenance, timestamps, document IDs, confidence, relationship types, and extracted claims.

### Community Detection

Community detection partitions the graph `G → C1, C2, ..., Ck` where each `Ci` is a structurally coherent cluster. The system generates a summary `S(Ci)` for each community, then constructs higher-level summaries hierarchically:

```
Corpus
  │
  ├── Global Themes
  │      │
  │      ├── Community A
  │      │     ├── Entity
  │      │     └── Entity
  │      │
  │      └── Community B
  │            ├── Entity
  │            └── Entity
```

---

## Agentic & Self-Reflective RAG

Traditional RAG is:

```
Query → Retrieve → Generate
```

Agentic RAG changes this into an iterative control loop:

```
Query → Plan → Retrieve → Evaluate → Retrieve → Synthesize → Verify
```

```
                  ┌─────────────┐
                  │    Query    │
                  └──────┬──────┘
                         ▼
                  ┌─────────────┐
                  │    Plan     │
                  └──────┬──────┘
                         ▼
                  ┌─────────────┐
                  │   Retrieve  │
                  └──────┬──────┘
                         ▼
                  ┌─────────────┐
                  │ Evidence    │
                  │ Sufficient? │
                  └───┬─────┬───┘
                     No    Yes
                      │      │
                      ▼      ▼
                  Re-query  Generate
                      │
                      └───────┘
```

### Self-Reflective Loop

A self-reflective system evaluates its own intermediate state, asking:

1. Did retrieval find relevant evidence?
2. Are important claims unsupported?
3. Is another query necessary?
4. Are there conflicting sources?
5. Does the generated answer satisfy the original question?

```
Answer_0 → Critique → Retrieve → Answer_1
```

**Trade-off:** each iteration adds `latency_retrieval + latency_LLM`. Agentic RAG requires explicit stopping criteria to remain practical.

---

## Production Architecture

A production architecture separates offline indexing from online query execution.

### Offline Pipeline

```
                Documents
                    │
                    ▼
              Ingestion Layer
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
      Chunking            Metadata
          │                   │
          └─────────┬─────────┘
                    ▼
              Embedding Layer
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
        BM25      Dense      Graph
       Index      Index      Index
                    │
                    ▼
               Late Interaction
                   Index
```

### Online Pipeline

```
User Query
    │
    ▼
Authentication / Authorization
    │
    ▼
Query Understanding
    │
    ▼
Metadata Filtering
    │
    ▼
Parallel Retrieval
 ┌──┼───────┬───────┐
 ▼  ▼       ▼       ▼
BM25 Dense Graph  Other
 └──┴───────┴───────┘
          │
          ▼
       Fusion
          │
          ▼
      Reranking
          │
          ▼
     Compression
          │
          ▼
         LLM
          │
          ▼
 Verification / Citations
          │
          ▼
        Answer
```

### Metadata Filtering

Semantic retrieval should not be responsible for every constraint. The effective retrieval operation is:

```
R(q) = R_semantic ∩ F_metadata
```

For a query like "Show me the 2025 annual report for Company X", metadata constraints (`company = X`, `document_type = annual_report`, `year = 2025`) dramatically improve precision and reduce the candidate search space.

### Access Control

Production RAG must treat authorization as part of retrieval, not post-processing.

**Dangerous:**

```
Retrieve Everything → Filter Unauthorized Results
```

(sensitive information has already entered the model context)

**Safer:**

```
User Identity
     │
     ▼
Authorization Policy
     │
     ▼
Allowed Corpus
     │
     ▼
Retrieval → Reranking → LLM
```

---

## Evaluation

RAG evaluation must distinguish retrieval failures from generation failures.

### Retrieval Metrics

| Metric      | Formula                               | What it measures                           |
| ----------- | ------------------------------------- | ------------------------------------------ |
| Recall@K    | Relevant in top K / Total relevant    | Did we retrieve the evidence?              |
| Precision@K | Relevant in top K / K                 | Is the candidate set clean?                |
| MRR         | (1/N) × sum of (1 / rank_i)           | How quickly did we find relevant evidence? |
| nDCG        | Normalized Discounted Cumulative Gain | Is relevance correctly ordered?            |

### Generation Metrics

| Metric                      | Question                                           |
| --------------------------- | -------------------------------------------------- |
| Faithfulness / Groundedness | Are claims supported by retrieved evidence?        |
| Answer Relevancy            | Does the answer address the user's question?       |
| Completeness                | Are important answer components present?           |
| Citation Correctness        | Do citations actually support the attached claims? |

A response can be relevant but unfaithful, faithful but incomplete, factually correct but poorly cited, or well-retrieved but poorly generated.

### Full Evaluation Matrix

| Metric               | Component             | Failure Diagnosed       |
| -------------------- | --------------------- | ----------------------- |
| Recall@K             | Retrieval             | Missing evidence        |
| Precision@K          | Retrieval             | Retrieval noise         |
| MRR                  | Retrieval             | Poor ranking            |
| nDCG                 | Retrieval / Reranking | Ranking quality         |
| Context Precision    | Context               | Context pollution       |
| Context Recall       | Context               | Missing evidence        |
| Faithfulness         | Generation            | Hallucination           |
| Answer Relevancy     | Generation            | Query drift             |
| Citation Correctness | Verification          | Unsupported attribution |

---

## Observability & Telemetry

Production RAG requires tracing at the level of individual retrieval operations. Without this telemetry, a poor answer is difficult to diagnose:

```
Poor Answer
    │
    ├── Retrieval failure?
    ├── Reranking failure?
    ├── Compression failure?
    ├── Context ordering failure?
    ├── LLM reasoning failure?
    └── Citation failure?
```

A useful trace structure:

```
request_id
    │
    ├── original_query
    ├── rewritten_query
    ├── filters
    ├── BM25_candidates
    ├── dense_candidates
    ├── graph_candidates
    ├── fusion_scores
    ├── reranker_scores
    ├── compression_output
    ├── final_context
    ├── model
    ├── token_count
    ├── latency
    ├── citations
    └── final_answer
```

---

## Latency Engineering & Cost-Aware Retrieval

Total latency is approximately:

```
L_total = L_query + L_retrieval + L_fusion + L_rerank + L_compression + L_generation + L_verification
```

Adding sophistication indiscriminately can make a system unusable. Expensive computation should only be applied where it provides measurable quality improvements:

```
Fast
 │
 ├── BM25
 ├── ANN
 └── Metadata filtering
        │
        ▼
Moderate
 │
 ├── Fusion
 ├── Late Interaction
 └── Lightweight reranking
        │
        ▼
Expensive
 │
 ├── Cross-Encoder
 ├── Context compression
 └── LLM reasoning
```

The optimal RAG architecture is not the one with the highest retrieval accuracy. The actual optimization is closer to:

```
maximize:  Quality / (Cost + Latency)
```

A cross-encoder applied to one million documents is impractical. A cross-encoder applied to 50 candidates may be extremely effective. The architecture derives its efficiency from **candidate reduction**.

---

## The Complete RAG Stack

```
┌────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                      │
│ Chat • Search • Analytics • Copilot • Agents • APIs        │
└─────────────────────────────┬──────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                     ORCHESTRATION                          │
│ Routing • Planning • Tool Selection • State • Verification │
└─────────────────────────────┬──────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                  QUERY UNDERSTANDING                       │
│ Rewrite • Expansion • HyDE • Decomposition • Classification│
└─────────────────────────────┬──────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                   CANDIDATE RETRIEVAL                      │
│ BM25 • Dense ANN • Hybrid • Metadata • Graph • SQL         │
└─────────────────────────────┬──────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                       FUSION                               │
│ RRF • Weighted Fusion • Deduplication • Result Aggregation │
└─────────────────────────────┬──────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                     RERANKING                              │
│ Cross-Encoder • ColBERT • Late Interaction • LTR           │
└─────────────────────────────┬──────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                CONTEXT SELECTION                           │
│ Compression • Diversity • Deduplication • Ordering         │
└─────────────────────────────┬──────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                       GENERATION                           │
│ LLM • Structured Output • Citations • Tool Calls           │
└─────────────────────────────┬──────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                   VERIFICATION                             │
│ Grounding • Citation Validation • Contradiction Detection  │
└────────────────────────────────────────────────────────────┘
```

---

## Reference Retrieval Cascade

A high-quality enterprise RAG system implements:

```
                         User Query
                              │
                              ▼
                    Query Understanding
                              │
                  ┌───────────┼───────────┐
                  │           │           │
                  ▼           ▼           ▼
               Rewrite      HyDE      Decompose
                  │           │           │
                  └───────────┼───────────┘
                              ▼
                    Parallel Retrieval
                  ┌───────────┼───────────┐
                  ▼           ▼           ▼
                BM25        Dense       Graph
                  │          ANN          │
                  └──────────┬────────────┘
                             ▼
                    Reciprocal Rank Fusion
                             │
                             ▼
                       Candidate Set
                             │
                             ▼
                     Late Interaction
                        / ColBERT
                             │
                             ▼
                       Top Candidates
                             │
                             ▼
                     Cross-Encoder
                       Reranking
                             │
                             ▼
                    Context Compression
                             │
                             ▼
                       Evidence Set
                             │
                             ▼
                            LLM
                             │
                             ▼
                     Grounding Check
                             │
                  ┌──────────┴──────────┐
                  │                     │
               Sufficient            Insufficient
                  │                     │
                  ▼                     ▼
                Answer               Re-retrieve
```

This architecture is more representative of state-of-the-art RAG engineering than `Embedding → VectorDB → LLM`.

---

## Key Takeaways

Each retrieval paradigm solves a different information problem:

| Method           | Best at                                              |
| ---------------- | ---------------------------------------------------- |
| Lexical (BM25)   | Exact terminology, rare identifiers                  |
| Dense retrieval  | Semantic similarity despite vocabulary mismatch      |
| Hybrid retrieval | Lexical + semantic recall together                   |
| Graph retrieval  | Relationships, global structure, multi-hop reasoning |
| Late interaction | Fine-grained token-level matching                    |
| Cross-encoder    | Deep query-document interaction                      |
| Agentic RAG      | Iterative, multi-step information seeking            |

The modern system does not ask: _"Which retrieval method is best?"_

It asks: _"Which retrieval method is appropriate for this information need, and at which stage should it be applied?"_

The strongest systems **compose these paradigms** rather than treating them as competing architectures:

```
Lexical → Dense → Hybrid → Graph → Late Interaction → Cross-Encoder → Reasoning
```

---

## References

- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401) — original RAG paper (Lewis et al., 2020)
- [GraphRAG](https://arxiv.org/abs/2404.16130) — graph-based community summarization for RAG (Edge et al., 2024)
- [ColBERT](https://arxiv.org/abs/2004.12832) — efficient and effective passage search via contextualized late interaction (Khattab & Zaharia, 2020)
- [HyDE](https://arxiv.org/abs/2212.10496) — hypothetical document embeddings for zero-shot dense retrieval (Gao et al., 2022)
- [PLAID](https://arxiv.org/abs/2205.09707) — an efficient engine for late interaction retrieval (Santhanam et al., 2022)
- [HNSW](https://arxiv.org/abs/1603.09320) — efficient and robust approximate nearest neighbor search (Malkov & Yashunin, 2016)
- [RRF](https://dl.acm.org/doi/10.1145/1571941.1572114) — reciprocal rank fusion outperforms condorcet and individual rank learning methods (Cormack et al., 2009)

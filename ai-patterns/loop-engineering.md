# Agentic Auto-Scheduling: An Experimental Study of LLM-Guided Loop Optimization

## Agentic Auto-Scheduling — Summary

**Paper:** _Agentic Auto-Scheduling: An Experimental Study of LLM-Guided Loop Optimization_ (PACT 2025)  
**Authors:** Massinissa Merouani, Islem Kara Bernou, Riyadh Baghdadi

**Goal:** Use a general-purpose LLM as an optimization agent that interacts with a compiler through a feedback loop to optimize loop nests.

---

## Core Idea

Instead of asking the LLM to rewrite optimized C code, the system lets the LLM propose **high-level loop transformations** such as:

- Tiling
- Parallelization
- Loop interchange
- Unrolling
- Skewing
- Fusion

The compiler:

1. Checks syntax validity.
2. Checks semantic legality via dependence analysis.
3. Generates code.
4. Executes the code.
5. Returns measured speedup/slowdown to the LLM.

The LLM then uses this feedback to refine its next proposal.

---

## Architecture (Agent Loop)

\`\`\`
Input program / loop nest
↓
LLM agent
(analyze + propose schedule)
↓
Compiler / runtime
(validate → compile → run)
↓
Feedback
(legal? speedup? crash?)
↓
LLM updates strategy
↺
\`\`\`

This is a classic **closed-loop agent architecture**.

---

## Agentic Pattern

The paper can be viewed as an **Action → Observation → Update** cycle.

| Agent concept | COMPILOT                            |
| ------------- | ----------------------------------- |
| State         | Full dialogue history               |
| Action        | Propose transformation schedule     |
| Environment   | Compiler + runtime                  |
| Observation   | Legality + performance feedback     |
| Memory        | Conversation context                |
| Policy        | LLM reasoning / in-context learning |

---

## Supported Transformations

The LLM can combine multiple transformations.

- Loop fusion
- Loop interchange
- Parallelization
- 2D / 3D tiling
- Unrolling
- Skewing
- Reversal
- Shifting

Example:

\`\`\`
comp01.Tile2D(L1, L2, 32, 32) + comp01.Parallelize(L0)
\`\`\`

---

## Why Not Generate Optimized C Directly?

The paper compares two approaches.

### Direct code generation

- LLM rewrites the C code.
- Correctness is checked by output comparison.

### Problems

- ~18% of "correct" programs were actually wrong under different inputs.
- ~5.3× more tokens.
- Lower performance.

### Compiler-guided approach (chosen)

- Formal legality checking.
- Much cheaper.
- Better speedups.

**Important design lesson:** **Delegate correctness to the deterministic system; use the LLM for search and strategy.**

---

## Feedback Types

The environment returns structured observations.

### Invalid

Syntax / semantic pre-check failed.

### Illegal

Dependence violation detected by the compiler.

### Solver failure

Skewing or shifting parameters could not be derived.

### Crash

Compiler or runtime error.

### Success

Measured speedup or slowdown.

This is **grounded feedback**, not self-evaluation.

---

## Results

Using **PolyBench (150 benchmark instances)**:

| Scenario       | Result                           |
| -------------- | -------------------------------- |
| Single run     | **2.66×** geometric mean speedup |
| Best of 5 runs | **3.54×** geometric mean speedup |
| Over Pluto     | **2.94×** geometric mean speedup |

Some kernels achieved **100×+ speedups** on large inputs due to aggressive parallelization.

---

## Feedback Matters (Key Ablation)

Without feedback, performance drops substantially.

- With feedback: **2.66×**
- Without feedback: **2.01×**

**Takeaway:** the LLM is not simply generating good schedules from prior knowledge; it is **learning within the dialogue**.

---

## What the LLM Actually Learns

Illegal schedules are very common initially and decrease during the interaction.

This suggests a form of **in-context adaptation**:

- Avoiding previously illegal patterns.
- Refining profitable schedules.
- Escaping bad local choices through continued exploration.

---

## Multi-Run Strategy

Because LLMs are stochastic, the authors restart the dialogue several times.

\`\`\`python
for run in range(5):
reset_conversation()
optimize(iterations=30)

keep_best_schedule()
\`\`\`

This is equivalent to **parallel exploration of different optimization trajectories**.

---

## Comparison of LLMs

Best performers were **general-purpose frontier models**.

| Model             | Speedup @30 |
| ----------------- | ----------- |
| Gemini 2.0 Flash  | 2.66×       |
| GPT-4o            | 2.63×       |
| Llama 3.3 70B     | 2.47×       |
| QwQ 32B           | 2.36×       |
| Qwen2.5-Coder 32B | 2.14×       |
| Codestral 22B     | 1.75×       |

**Interesting result:** coding-specialized models were not the best.

---

# Enrichment: The "Loop Engineer" Connection

The paper becomes especially interesting when interpreted through the **Loop Engineer** perspective popularized by Andrej Karpathy and discussed in the TabNews article.

## Conceptual Mapping

| Loop Engineer concept | COMPILOT                |
| --------------------- | ----------------------- |
| System to improve     | Loop nest               |
| Agent                 | LLM                     |
| Action                | Transformation proposal |
| Evaluator             | Compiler + runtime      |
| Reward                | Speedup                 |
| Memory                | Dialogue history        |
| Iteration             | Optimization loop       |
| Restart / exploration | Best-of-K runs          |

The key similarity is that **the agent does not need to know the optimal solution in advance**. It improves the system through **repeated cycles of hypothesis → execution → measurement → adaptation**.

---

## Karpathy-Style Autonomous Improvement Loop

The Loop Engineer pattern can be summarized as:

\`\`\`
Observe
↓
Hypothesize
↓
Act
↓
Measure
↓
Learn
↺
\`\`\`

COMPILOT fits this pattern almost perfectly.

### Observe

Read the loop structure and previous feedback.

### Hypothesize

"Tiling + parallelization may improve locality and throughput."

### Act

Emit a schedule.

### Measure

Compiler checks legality and runtime.

### Learn

Update the next proposal.

---

## Why This Matters Beyond Compilers

This architecture is reusable for many engineering domains.

### Database tuning

- Actions: indexes, partitions
- Reward: query latency

### Kubernetes optimization

- Actions: CPU/memory limits, replicas
- Reward: cost and throughput

### ML pipelines

- Actions: hyperparameters, features
- Reward: validation score

### Data engineering

- Actions: repartitioning, caching
- Reward: runtime and cost

### Infrastructure cost optimization

- Actions: instance types, autoscaling
- Reward: performance per dollar

---

## Harnessed Agent Architecture

The paper is a strong example of a **harnessed agent**.

| Agent concept    | In the paper               |
| ---------------- | -------------------------- |
| Harness          | Interaction loop handler   |
| Tool calling     | Compiler API               |
| State management | Dialogue history           |
| Evaluator        | Runtime measurement        |
| Guardrails       | Validity + legality checks |
| Memory           | Conversation context       |
| Search           | Multi-run exploration      |

This is very close to **LangGraph / OpenAI Agents / AutoGen** style architectures.

---

## Important Insight

The biggest contribution is **separating strategic reasoning from operational correctness**.

### LLM

- Explore
- Hypothesize
- Compose actions

### Compiler

- Verify
- Execute
- Measure

This pattern is likely more scalable than **"LLM writes everything"**.

---

## A Useful Mental Model

Think of COMPILOT as a **scientist agent**:

1. Form a hypothesis.
2. Run an experiment.
3. Observe the result.
4. Update the hypothesis.
5. Repeat.

The compiler acts as the **laboratory**.

This is arguably closer to **experimental science** than to traditional code generation.

---

## Limitations

- Only **36% of proposed schedules were runnable**.
- Many illegal transformations.
- Needs multiple runs.
- Optimization takes minutes, not milliseconds.
- Context grows with the dialogue.

---

## Future Directions

The authors propose richer feedback:

- Which dependency was violated.
- Cache miss rates.
- Vectorization utilization.
- Hardware counters.

This would turn the environment into a much richer **observation space**, approaching a reinforcement-learning-style signal.

---

# Final Takeaway

**Use an LLM as a strategic search agent, keep a deterministic system responsible for correctness and execution, and close the loop with empirical feedback.**

That is the central architectural lesson of this paper for **agentic systems beyond compilers**.

---

# References

### Primary paper

Merouani, M., Kara Bernou, I., & Baghdadi, R. (2025). _Agentic Auto-Scheduling: An Experimental Study of LLM-Guided Loop Optimization_. Proceedings of the 34th International Conference on Parallel Architectures and Compilation Techniques (PACT 2025). arXiv:2511.00592.  
https://arxiv.org/abs/2511.00592

### Related article (Loop Engineer perspective)

Lima, A. (2026). _Loop Engineer: o método de Andrej Karpathy para criar agentes que melhoram sistemas em ciclos autônomos_. TabNews.  
https://www.tabnews.com.br/andersonlimadev/loop-engineer-o-metodo-de-andrej-karpathy-para-criar-agentes-que-melhoram-sistemas-em-ciclos-autonomos

### Background references mentioned in the paper

- Bondhugula, U., et al. (2008). _A Practical Automatic Polyhedral Parallelizer and Locality Optimizer (Pluto)_.
- Ragan-Kelley, J., et al. (2013). _Halide: A Language and Compiler for Optimizing Parallelism, Locality, and Recomputation in Image Processing Pipelines_.
- Chen, T., et al. (2018). _TVM: An Automated End-to-End Optimizing Compiler for Deep Learning_.
- Lewis, P., et al. (2020). _Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks_.

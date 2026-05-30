/**
 * # P, NP, NP-Complete, and NP-Hard: Understanding Problem Complexity
 *
 * These classes categorize decision problems (yes/no answers) by computational difficulty.
 * Understanding them helps you recognize when a problem is inherently hard.
 *
 * **Related Guides:**
 * - **Greedy Algorithms:** See `algorithms/greedy/index.ts`
 *   - Learn how greedy algorithms approximate solutions for NP-Hard problems
 *   - Understand approximation ratios and problem-specific heuristics
 * - **Recursion & Dynamic Programming:** See `algorithms/recursion/index.ts`
 *   - Learn when DP can solve NP problems (small inputs) vs when approximation is needed
 * - **Divide and Conquer:** See `algorithms/sort/divide-conquer/index.ts`
 *   - Master Theorem helps analyze recursive algorithms you might use to solve hard problems
 *
 * @date 16/05/2026
 */

/**
 * ## P (Polynomial Time)
 *
 * **Definition:**
 * Problems that can be **solved** in polynomial time on a deterministic computer.
 *
 * **Meaning:**
 * - We have an efficient algorithm (O(n²), O(n³), O(n log n), etc.)
 * - Algorithm runs fast: answer guaranteed in reasonable time
 * - "Easy" problems from computational perspective
 *
 * **Examples:**
 * - ✅ Sorting: O(n log n) with merge sort or quicksort
 * - ✅ Shortest path: O(n²) with Dijkstra's algorithm
 * - ✅ Check if number is prime: O(√n) trial division or O(log³ n) AKS primality
 * - ✅ Searching: O(log n) binary search
 * - ✅ Tree traversal: O(n) DFS/BFS
 *
 * **Real-World Impact:**
 * If your problem is in P, you can solve it on modern computers efficiently.
 */

/**
 * ## NP (Nondeterministic Polynomial Time)
 *
 * **Definition:**
 * Problems whose **solutions can be verified** in polynomial time.
 *
 * **Key Insight (The Game Changer):**
 * - Finding solution might be hard (exponential)
 * - But **checking** if a proposed solution is correct is easy (polynomial)
 * - Example: Sudoku puzzle vs verifying completed sudoku
 *
 * **How NP Works:**
 * 1. Someone gives you a **certificate** (proposed solution)
 * 2. You can **verify** it's correct in polynomial time
 * 3. If verification succeeds → answer is "YES"
 *
 * **Important:** P ⊆ NP
 * - All P problems are in NP (if you can solve it, you can verify it)
 * - Question: Are there NP problems NOT in P? (The famous P vs NP problem!)
 *
 * **Examples:**
 * - ✅ Graph Coloring: Given k colors, can you color this graph?
 *   - Finding coloring: Hard (exponential)
 *   - Verifying coloring: Easy (check each edge has different colors)
 *
 * - ✅ Subset Sum: Does subset exist that sums to target?
 *   - Finding subset: Hard (check all 2^n subsets)
 *   - Verifying subset: Easy (add numbers, check sum)
 *
 * - ✅ Hamiltonian Cycle: Does path visit each node exactly once?
 *   - Finding cycle: Hard (check all n! permutations)
 *   - Verifying cycle: Easy (check path exists and visits each node once)
 *
 * - ✅ Boolean Satisfiability (SAT): Can boolean formula be satisfied?
 *   - Finding assignment: Hard (try all 2^n assignments)
 *   - Verifying assignment: Easy (evaluate formula with given values)
 */

/**
 * ## NP-Complete
 *
 * **Definition:**
 * NP problems that are **as hard as any other NP problem**.
 * - Every NP problem can be reduced to this problem in polynomial time
 * - If you solve NP-Complete in polynomial time, you solve ALL NP problems!
 *
 * **Why It Matters:**
 * - NP-Complete problems form the "hardest" tier in NP
 * - If P = NP (unlikely but unproven), NP-Complete has polynomial solution
 * - If P ≠ NP (likely), NP-Complete has NO polynomial solution
 *
 * **The Reduction Concept:**
 * Problem A **reduces to** Problem B if:
 * - Any instance of A can be solved using a solver for B
 * - The conversion from A to B is polynomial time
 * - Solution to B gives solution to A
 *
 * Example: Converting graph coloring to SAT (polynomial time reduction)
 *
 * **Famous NP-Complete Problems:**
 * - ✅ Boolean Satisfiability (SAT): First proven NP-Complete
 * - ✅ Hamiltonian Cycle: Visit each node exactly once
 * - ✅ Traveling Salesman Problem (TSP): Shortest path visiting all cities
 * - ✅ Subset Sum: Find subset summing to target
 * - ✅ Graph Coloring: Color graph with k colors (adjacent ≠ same color)
 * - ✅ Knapsack Problem (0/1): Maximize value with weight constraint
 * - ✅ Vertex Cover: Find minimum set of vertices covering all edges
 *
 * **Practical Consequence:**
 * No known polynomial-time algorithm for any NP-Complete problem.
 * Best known algorithms are exponential: O(2^n) or O(n!)
 */

/**
 * ## NP-Hard
 *
 * **Definition:**
 * Problems **at least as hard as NP-Complete problems**.
 * - Not necessarily in NP (might not even be decision problems)
 * - Every NP problem reduces to it in polynomial time
 * - Harder than NP-Complete!
 *
 * **Key Difference from NP-Complete:**
 * - NP-Complete: Must be in NP AND as hard as any NP problem
 * - NP-Hard: Just needs to be "at least as hard" (doesn't need to be in NP)
 * - NP-Hard ⊇ NP-Complete
 *
 * **Examples:**
 * - ✅ TSP Optimization: Find shortest path (not just "does one exist?")
 *   - NP-Hard but not NP-Complete (it's optimization, not decision)
 *
 * - ✅ Knapsack Optimization: Maximize value with constraint (not just "can we reach value X?")
 *   - NP-Hard but not NP-Complete (optimization, not decision)
 *
 * - ✅ Chess: Determine if position is winning
 *   - NP-Hard (harder than NP-Complete)
 *   - Can't even verify solution quickly
 *
 * - ✅ Halting Problem: Will program halt?
 *   - NP-Hard but UNDECIDABLE (no algorithm exists, even exponential)
 *   - Beyond NP in the hierarchy
 */

/**
 * ## Problem Classification Hierarchy
 *
 * ```
 * All Problems
 * ├─ Decidable Problems (have algorithms)
 * │  ├─ P (fast: polynomial time)
 * │  │  ├─ Sorting, searching, shortest path
 * │  │  └─ (These are also NP)
 * │  │
 * │  └─ Non-P Decidable (slow: exponential or worse)
 * │     ├─ NP (verifiable in polynomial time)
 * │     │  ├─ NP-Complete (hardest in NP)
 * │     │  │  ├─ SAT, TSP (decision), Graph Coloring
 * │     │  │  └─ If any NP-Complete is in P, then P=NP
 * │     │  │
 * │     │  └─ NP-Intermediate? (if P ≠ NP)
 * │     │     └─ NP but not NP-Complete (believed to exist)
 * │     │
 * │     └─ Harder than NP
 * │        └─ NP-Hard (at least as hard as NP-Complete)
 * │           ├─ TSP Optimization (NP-Hard but not decision)
 * │           ├─ Knapsack Optimization
 * │           └─ Chess analysis
 * │
 * └─ Undecidable Problems (no algorithm exists)
 *    ├─ Halting Problem
 *    ├─ Rice's Theorem consequences
 *    └─ (Even more intractable than NP-Hard)
 * ```
 */

/**
 * ## Venn Diagram Relationship
 *
 * ```
 * ┌─────────────────────────────────┐
 * │     ALL PROBLEMS               │
 * │                                 │
 * │  ┌──────────────────────────┐  │
 * │  │    NP-Hard              │  │
 * │  │                          │  │
 * │  │  ┌────────────────────┐ │  │
 * │  │  │   NP-Complete     │ │  │
 * │  │  │                  │ │  │
 * │  │  │  ┌──────────────┐│ │  │
 * │  │  │  │      P       ││ │  │
 * │  │  │  └──────────────┘│ │  │
 * │  │  └────────────────────┘ │  │
 * │  └──────────────────────────┘  │
 * └─────────────────────────────────┘
 *
 * P ⊂ NP ⊂ NP-Complete ⊂ NP-Hard
 * (NP-Complete = hardest in NP)
 * ```
 */

/**
 * ## How to Recognize NP-Complete Problems
 *
 * There's no foolproof way, but these are **strong indicators**:
 *
 * **Indicator 1: Exponential Growth**
 * - Algorithm runs fast for small inputs (n ≤ 10)
 * - Performance drops off a cliff with size increase (n > 15)
 * - Time roughly doubles for each +1 to input size
 * - ⚠️ Classic signature of NP-Complete
 *
 * **Indicator 2: "All Combinations"**
 * - Problem involves finding "all combinations of X"
 * - Or selecting subset with certain properties
 * - Examples: "find best selection", "all permutations"
 * - ⚠️ Usually means checking all 2^n or n! possibilities
 *
 * **Indicator 3: Can't Decompose into Subproblems**
 * - Problem requires checking **every possible version** of X
 * - Can't break into independent smaller subproblems
 * - Dynamic programming doesn't work
 * - ⚠️ Often indicates NP-Complete
 *
 * **Indicator 4: Involves Sequences (Permutations)**
 * - Find optimal "sequence of X" (like cities in TSP)
 * - Finding shortest/longest sequence with properties
 * - If hard to solve → likely NP-Complete
 * - ⚠️ TSP, Hamiltonian path, scheduling problems
 *
 * **Indicator 5: Involves Sets**
 * - Find optimal "set of X" (like minimum radio stations)
 * - Selecting subset with best properties
 * - If hard to solve → likely NP-Complete
 * - ⚠️ Set cover, subset sum, vertex cover
 *
 * **Indicator 6: Reduces to Known NP-Complete**
 * - Problem can be reformulated as SAT, TSP, or subset sum?
 * - If yes: **DEFINITELY NP-Complete**
 * - This is the rigorous way to prove NP-Completeness
 */

/**
 * ## Practical Handling of NP-Complete Problems
 *
 * **For Small Inputs (n ≤ 20):**
 * - ✅ Brute force: O(2^n) exponential is acceptable
 * - ✅ Dynamic programming with bitmasks: O(n² · 2^n)
 * - ✅ Branch and bound with pruning
 *
 * **For Medium Inputs (n ≤ 100):**
 * - ✅ Greedy approximation: Fast, "good enough"
 * - ✅ Local search heuristics (2-opt, 3-opt)
 * - ✅ Simulated annealing or genetic algorithms
 * - ✅ Integer linear programming solvers
 *
 * **For Large Inputs (n > 1000):**
 * - ✅ Greedy heuristic: O(n log n) approximation
 * - ✅ Accept suboptimal solution as business requirement
 * - ✅ Approximation algorithms with proven bounds
 * - ✅ Problem-specific insights to reduce search space
 *
 * **Quick Decision Table:**
 *
 * | Input Size | Best Approach | Expected Quality |
 * |---|---|---|
 * | n ≤ 20 | Exact (brute force, DP) | Optimal solution |
 * | 20 < n ≤ 100 | Approximation + local search | Good solution (~95% optimal) |
 * | n > 100 | Greedy heuristic | Fast approximation (50-80% optimal) |
 */

/**
 * ## Summary: The Complexity Landscape
 *
 * | Category | Time | Verification | Examples | Approach |
 * |---|---|---|---|---|
 * | **P** | Polynomial O(n²) | N/A (solve it) | Sorting, shortest path | Use exact algorithm |
 * | **NP** | Unknown | Polynomial | Coloring, SAT | Greedy or DP for small n |
 * | **NP-Complete** | Likely exponential | Polynomial | TSP, Hamiltonian | Approximation + heuristics |
 * | **NP-Hard** | Likely exponential+ | Often difficult | TSP optimization, Chess | Approximation or heuristics |
 * | **Undecidable** | Impossible | Impossible | Halting problem | No algorithm exists |
 */

/**
 * ## P vs NP: The Million Dollar Question
 *
 * **The Problem:**
 * Is P = NP?
 * - P = NP means: solving = verifying (for decision problems)
 * - P ≠ NP means: some problems are inherently harder to solve than verify
 *
 * **Current Consensus:**
 * - Widely believed: P ≠ NP (solving harder than verifying)
 * - No proof either way (one of 7 Millennium Prize Problems, $1M reward)
 * - All practical cryptography depends on P ≠ NP being true
 *
 * **If P = NP (unlikely):**
 * - NP-Complete problems would have polynomial solutions
 * - All modern encryption would be broken
 * - Many optimization problems become "easy"
 *
 * **If P ≠ NP (likely):**
 * - NP-Complete problems are fundamentally hard
 * - No polynomial algorithm exists for them
 * - Approximation and heuristics are the only approach
 */

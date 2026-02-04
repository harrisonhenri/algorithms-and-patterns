/**
 * Recursion & Dynamic Programming: Comprehensive Guide
 *
 * This module contains shared theoretical knowledge about recursion and dynamic programming
 * techniques used across LeetCode problem solutions.
 *
 * @date 24/01/2026 - 00:00:00
 */

/**
 * # Dynamic Programming (DP) Fundamentals
 *
 * **Definition:**
 * Dynamic Programming is an optimization technique that solves problems by:
 * 1. Breaking them into overlapping subproblems
 * 2. Storing (caching) results to avoid recomputation
 * 3. Building up solutions from smaller subproblems
 *
 * **Two Main DP Strategies:**
 * - **Top-Down (Memoization)**: Recursive + caching via hash map
 * - **Bottom-Up (Tabulation)**: Iterative + array storage
 *
 * **Requirements for DP:**
 * 1. **Overlapping Subproblems**: Same subproblems solved multiple times
 * 2. **Optimal Substructure**: Optimal solution built from optimal subproblem solutions
 *
 * **Why it Matters:**
 * - Converts exponential algorithms O(2^n) into polynomial ones O(n) or O(n²)
 * - Essential for interview problems (Fibonacci, Climbing Stairs, Coin Change, etc.)
 */

/**
 * # Master Theorem for Recurrence Relations
 *
 * **Purpose:** Analyze time complexity of recursive algorithms using mathematical formula
 *
 * **When to Use Master Theorem:**
 * - When your recurrence has the form: T(n) = a·T(n/b) + f(n)
 * - Divide-and-conquer problems (split into equal subproblems)
 * - More formal than execution tree method
 *
 * **Form:** T(n) = a·T(n/b) + f(n)
 *
 * Where:
 * - a: number of recursive calls
 * - b: factor by which input shrinks
 * - f(n): cost of non-recursive work (combining results)
 *
 * **Three Cases (comparing f(n) to n^(log_b(a))):**
 *
 * **Case 1:** If f(n) = O(n^d) where d < log_b(a)
 * - Work is negligible vs recursive calls
 * - Result: T(n) = O(n^(log_b(a)))
 * - Example: T(n) = 2T(n/2) + O(1) → O(n) [d=0 < log_2(2)=1]
 *
 * **Case 2:** If f(n) = O(n^d) where d = log_b(a)
 * - Work and recursive calls are balanced
 * - Result: T(n) = O(n^d · log n)
 * - Example: T(n) = 2T(n/2) + O(n) → O(n log n) [d=1 = log_2(2)=1]
 *
 * **Case 3:** If f(n) = O(n^d) where d > log_b(a)
 * - Work dominates the recursive calls
 * - Result: T(n) = O(f(n))
 * - Example: T(n) = T(n/2) + O(n²) → O(n²) [d=2 > log_2(1)=0]
 *
 * **Applications:**
 * - Fibonacci with memoization: T(n) = T(n-1) + T(n-2) + O(1) → O(n)
 * - Binary Search: T(n) = T(n/2) + O(1) → O(log n)
 * - Merge Sort: T(n) = 2T(n/2) + O(n) → O(n log n)
 *
 * **Limitation:**
 * Master Theorem doesn't directly apply to linear recurrences (like Fibonacci).
 * For those, use execution tree analysis or closed-form formulas instead.
 */

/**
 * # Recursion Time Complexity Calculation
 *
 * **Core Formula:**
 * The time complexity O(T) of a recursive algorithm is the product of:
 * - R = Number of recursion invocations (how many times recursion is called)
 * - O(s) = Time complexity of work at each invocation
 *
 * Therefore: **O(T) = R × O(s)**
 *
 * **Example 1: String Reversal (printReverse)**
 * Problem: Print string in reverse order
 * Recurrence: printReverse(str) = printReverse(str[1...n]) + print(str[0])
 * - Number of invocations: R = n (length of string)
 * - Work per invocation: O(s) = O(1) (print one character)
 * - Total complexity: O(T) = n × O(1) = O(n)
 *
 * **Example 2: Fibonacci (Without Optimization)**
 * Problem: Calculate F(n) where F(n) = F(n-1) + F(n-2)
 * - Recurrence has 2 branches at each level
 * - Forms a binary execution tree
 * - Total invocations grows exponentially
 * - Total complexity: O(T) = O(2^n)
 */

/**
 * # Greedy Algorithms: Making Locally Optimal Choices
 *
 * **Definition:**
 * A Greedy Algorithm is an optimization approach that makes the **locally optimal choice**
 * at each step, hoping to find a **global optimum**. Unlike DP which considers all
 * possibilities, greedy commits to each choice immediately without reconsideration.
 *
 * **Core Principle:**
 * At each step, make the choice that **looks best in the current moment**, then
 * never look back (no backtracking).
 *
 * ## How Greedy Works vs Other Approaches
 *
 * **Dynamic Programming (Both Top-Down & Bottom-Up):**
 * - Explores multiple choices and picks the best overall solution
 * - Considers future consequences of current choice
 * - Can backtrack or change decisions based on subproblem results
 * - Time: O(n²) or O(n³) but guaranteed optimal solution
 *
 * **Greedy Algorithm:**
 * - Makes one choice at each step (locally optimal)
 * - Never reconsiders previous choices
 * - Fast: typically O(n log n) or O(n)
 * - May NOT find global optimum (but sometimes does!)
 *
 * **Brute Force:**
 * - Tries all possible combinations
 * - Time: O(2^n) or O(n!)
 * - Guaranteed optimal but impractical for large inputs
 *
 * **Comparison Table:**
 *
 * | Approach | Optimal? | Time | Reconsiders Choices? | Use Case |
 * |----------|----------|------|----------------------|----------|
 * | Greedy | Maybe | Fast O(n) | No | Simple, when greedy property holds |
 * | DP Top-Down | Yes | Poly O(n²) | Yes (memoization) | Overlapping subproblems |
 * | DP Bottom-Up | Yes | Poly O(n²) | Yes (tabulation) | Overlapping subproblems |
 * | Brute Force | Yes | Exponential | Yes (all paths) | Small inputs only |
 * | Approximate | Approximate | Fast | No | When optimal is too slow |
 *
 * ## DP Implementation Strategies (Both Bottom-Up and Top-Down)
 *
 * **Top-Down Approach (Memoization):**
 * - Start with problem of size n
 * - Recursively break into smaller subproblems
 * - Store results in hash map (memoization table)
 * - Return cached result if subproblem already solved
 * - More intuitive: matches problem decomposition naturally
 * - Easier to add memoization to existing recursive code
 *
 * ```typescript
 * // Top-Down with Memoization
 * function fib(n, memo = {}) {
 *   if (n in memo) return memo[n];        // Check cache
 *   if (n <= 1) return n;                  // Base case
 *   memo[n] = fib(n-1, memo) + fib(n-2, memo);  // Solve & cache
 *   return memo[n];
 * }
 * // Time: O(n), Space: O(n) recursion stack + hash map
 * ```
 *
 * **Bottom-Up Approach (Tabulation):**
 * - Start with smallest subproblems (base cases)
 * - **TYPICALLY ITERATIVE** - uses loops (for/while) instead of recursion
 * - Build up to problem of size n by repeating steps in loops
 * - Store results in array (DP table)
 * - No recursion: uses iteration instead
 * - More efficient: avoids function call overhead and stack growth
 * - Better for interviews: clearer iteration pattern
 *
 * **What is "Iterative"?**
 * - Opposite of recursion: solves problem by repeating steps in loops
 * - vs Recursive: solves by function calling itself
 * - Bottom-up naturally fits iterative because we build from small→large using `for`/`while`
 * - This is why: "bottom-up approaches are typically iterative"
 *
 * ```typescript
 * // Bottom-Up with Tabulation (ITERATIVE - uses loop)
 * function fib(n) {
 *   if (n <= 1) return n;
 *   const dp = [0, 1];
 *   for (let i = 2; i <= n; i++) {  // Loop repeats steps
 *     dp[i] = dp[i-1] + dp[i-2];    // Build from smaller subproblems
 *   }
 *   return dp[n];
 * }
 * // Time: O(n), Space: O(n) for DP array
 * // vs Recursive: would use function calls, not loops
 * ```
 *
 * **Space-Optimized Bottom-Up:**
 * - Only keep variables needed for current computation
 * - If i-th value depends only on (i-1), use rolling array
 * - Space: O(1) instead of O(n)
 *
 * ```typescript
 * // Bottom-Up Space-Optimized (Rolling Variables)
 * function fib(n) {
 *   let [prev2, prev1] = [0, 1];
 *   for (let i = 2; i <= n; i++) {
 *     let current = prev1 + prev2;
 *     [prev2, prev1] = [prev1, current];  // Roll forward
 *   }
 *   return prev1;
 * }
 * // Time: O(n), Space: O(1)
 * ```
 *
 * ## When Greedy Works: The Greedy Choice Property
 *
 * A greedy algorithm finds the **global optimum** only when the problem has two properties:
 *
 * ### 1. Greedy Choice Property
 * - A globally optimal solution can be arrived at by making locally optimal choices
 * - The choice made at one step doesn't affect the validity of previous choices
 * - Example: Making small steps toward a mountain top (local direction = global direction)
 * - **NOT always true**: shortest path in weighted graphs (need DP/Dijkstra)
 *
 * ### 2. Optimal Substructure
 * - Optimal solution contains optimal solutions to subproblems
 * - This property is shared with DP!
 * - Difference: DP proves it by exploring all options, greedy just assumes it
 *
 * **When Greedy Succeeds:**
 * - ✅ Coin Change (Largest coins first) - works for real currency systems
 * - ✅ Activity Selection (Earliest end time) - greedy maximizes room for future activities
 * - ✅ Huffman Coding (Merge rarest trees) - greedy minimizes total encoding length
 * - ✅ Minimum Spanning Tree (Kruskal's) - add smallest edges without cycles
 *
 * **When Greedy Fails:**
 * - ❌ Coin Change with arbitrary denominations (e.g., 1,3,4 with amount 6)
 *   - Greedy: 4+1+1 = 3 coins
 *   - Optimal: 3+3 = 2 coins
 * - ❌ 0/1 Knapsack (most valuable first may not fit well)
 * - ❌ Shortest Path in weighted graphs (Dijkstra's uses greedy with priority queue)
 * - ❌ Longest Increasing Subsequence (needs DP, not greedy)
 *
 * ## Greedy Algorithms and Approximate Solutions
 *
 * **When Optimal is Too Slow:**
 * Some problems are NP-Hard (no polynomial-time optimal solution known):
 * - Traveling Salesman Problem (TSP): O(n!) optimal, too slow for large n
 * - Knapsack Problem: O(n·W) DP for 0/1 variant
 * - Set Cover: O(n²) greedy approximation vs exponential optimal
 * - Graph Coloring: NP-Hard to find minimum colors
 *
 * **Approximate Algorithms:**
 * Use greedy or heuristic methods to find **reasonably good** solutions quickly:
 *
 * ```
 * NP-Hard Problem (TSP)
 * ├─ Optimal Solution: O(n!) - Impractical for n > 15
 * ├─ DP Solution: O(n² · 2^n) - Better but still exponential
 * └─ Greedy Approximate: O(n²) - Fast, "good enough" solution (not optimal)
 * ```
 *
 * **Approximation Ratio:**
 * How close is the greedy solution to optimal?
 * - Example: Greedy TSP gives solution ≤ 2x optimal (for metric TSP)
 * - Set Cover: Greedy gives solution ≤ (ln n) × optimal
 * - Means: "Greedy is at most 2 times worse than optimal"
 *
 * **When to Use Approximate Algorithms:**
 * - ✅ Optimal solution takes too long (exponential time)
 * - ✅ Problem is NP-Hard (no known polynomial algorithm)
 * - ✅ Good solution is "good enough" for business needs
 * - ✅ Real-time systems (must respond quickly)
 * - ❌ Correctness is critical (medical, safety systems)
 * - ❌ Small inputs where optimal is feasible
 *
 * ## Choosing Between Greedy, DP, and Approximation
 *
 * **Decision Flow:**
 *
 * ```
 * Is optimal solution required?
 * ├─ YES
 * │  ├─ Does greedy choice property hold?
 * │  │  ├─ YES: Use Greedy (O(n log n) typical)
 * │  │  └─ NO: Are there overlapping subproblems?
 * │  │     ├─ YES: Use DP (top-down or bottom-up)
 * │  │     └─ NO: Use Divide & Conquer or other approach
 * └─ NO (Approximate solution acceptable)
 *    └─ Use Greedy Approximation (fast + good enough)
 * ```
 *
 * **Complexity Comparison:**
 *
 * | Problem | Greedy Optimal | DP Optimal | Greedy Approx | Choice |
 * |---------|---|---|---|---|
 * | Activity Selection | O(n log n) ✅ | O(n²) | - | Greedy (optimal + fast) |
 * | Coin Change (std) | O(n log n) ✅ | O(n·W) | - | Greedy (optimal + fast) |
 * | Coin Change (arbitrary) | ❌ fails | O(n·W) ✅ | O(n²) | DP if optimal needed |
 * | 0/1 Knapsack | ❌ fails | O(n·W) ✅ | O(n) | DP for optimal |
 * | TSP | ❌ fails | O(n²·2^n) | O(n²) ✅ | Greedy approximation for large n |
 * | Set Cover | ❌ fails | O(2^n) | O(n² ln n) ✅ | Greedy approximation |
 *
 * ## Key Insight: Greedy ⊂ Approximate Algorithms
 *
 * **All greedy algorithms used for hard problems are approximate:**
 * - They run fast but don't guarantee optimality
 * - Approximation ratio tells us "how close to optimal"
 * - Different from greedy that finds optimal (like coin change)
 *
 * **Two Types of Greedy:**
 * 1. **Greedy that Finds Optimal** (Activity Selection, Huffman)
 *    - Problem has greedy choice property
 *    - Provably optimal solution
 *    - Fast: O(n log n) typical
 *
 * 2. **Greedy as Approximation** (TSP, Set Cover)
 *    - Problem doesn't have greedy choice property
 *    - Finds "good" solution, not always optimal
 *    - Approximation ratio ≤ c (e.g., ≤ 2x optimal for metric TSP)
 *
 * ## Summary Table
 *
 * | Algorithm Type | Guarantee | Time | Space | When to Use |
 * |---|---|---|---|---|
 * | Greedy (Optimal) | Finds optimal | O(n log n) | O(1) | When greedy property provable |
 * | Top-Down DP | Finds optimal | O(n²) | O(n²) memo | Overlapping subproblems, intuitive |
 * | Bottom-Up DP | Finds optimal | O(n²) | O(n²) array | Overlapping subproblems, efficient |
 * | Space-Opt DP | Finds optimal | O(n²) | O(1) | Large inputs, limited dependencies |
 * | Greedy Approx | Approx ratio | O(n log n) | O(1) | NP-Hard, optimal too slow |
 * | Brute Force | Finds optimal | O(n!) | O(n) | Small inputs only (n < 15) |
 */

/**
 * # P, NP, NP-Complete, and NP-Hard: Understanding Problem Complexity
 *
 * These classes categorize decision problems (yes/no answers) by computational difficulty.
 * Understanding them helps you recognize when a problem is inherently hard.
 *
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
 *
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
 *
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
 *
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
 *
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
 *
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
 *
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
 *
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
 *
 * ## Summary: The Complexity Landscape
 *
 * | Category | Time | Verification | Examples | Approach |
 * |---|---|---|---|---|
 * | **P** | Polynomial O(n²) | N/A (solve it) | Sorting, shortest path | Use exact algorithm |
 * | **NP** | Unknown | Polynomial | Coloring, SAT | Greedy or DP for small n |
 * | **NP-Complete** | Likely exponential | Polynomial | TSP, Hamiltonian | Approximation + heuristics |
 * | **NP-Hard** | Likely exponential+ | Often difficult | TSP optimization, Chess | Approximation or heuristics |
 * | **Undecidable** | Impossible | Impossible | Halting problem | No algorithm exists |
 *
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

/**
 * # Execution Tree Analysis
 *
 * **Purpose:**
 * For complex recursion (not just linear chains), use execution trees to visualize
 * and count total recursion invocations.
 *
 * **What is an Execution Tree?**
 * - Each node represents one recursive function invocation
 * - Tree structure mirrors the recursion pattern
 * - Total number of nodes = total number of recursive calls
 * - For recurrence with k recursive calls, tree is k-ary
 *
 * **Example: Fibonacci Execution Tree f(4)**
 * ```
 *           f(4)
 *          /    \
 *       f(3)    f(2)
 *       /  \     /   \
 *     f(2) f(1) f(1) f(0)
 *     / \
 *   f(1) f(0)
 * ```
 *
 * **Counting Nodes:**
 * - Full binary tree with n levels has 2^n - 1 total nodes
 * - For f(n), tree depth is n, so total nodes ≈ 2^n
 * - Upper bound: O(2^n) for naive Fibonacci
 *
 * **Why Execution Trees Matter:**
 * - Visualizes redundant computation (same subproblems appear multiple times)
 * - Shows why memoization helps (can eliminate duplicate branches)
 * - For divide-and-conquer, helps apply Master Theorem
 */

/**
 * # Memoization Impact on Recursion Complexity
 *
 * **Without Memoization:**
 * - Execution tree has exponential nodes (many duplicates)
 * - Same subproblems solved repeatedly
 * - Time: O(2^n) for Fibonacci
 *
 * **With Memoization:**
 * - Each unique subproblem solved exactly once
 * - Results cached and reused from hash map
 * - For Fibonacci: Only n unique values to compute
 * - Time complexity becomes: O(1) × n = O(n)
 *
 * **Recalculating Complexity with Memoization:**
 * - R = Number of unique subproblems (often linear or polynomial)
 * - O(s) = Work per unique computation + O(1) for cache lookup
 * - For Fibonacci: R = n unique values, O(s) = O(1) per value
 * - Result: O(T) = n × O(1) = O(n)
 *
 * **Key Insight:**
 * Memoization simplifies complexity analysis by dramatically reducing R (recursion count).
 * This is why it's often the first optimization step.
 */

/**
 * # Common Recursion Complexity Patterns
 *
 * **Pattern 1: Linear Chain (no branching)**
 * - Recurrence: T(n) = T(n-1) + O(1)
 * - Invocation count: R = n
 * - Work per call: O(s) = O(1)
 * - Result: O(n)
 * - Example: printReverse, linear tree traversal
 *
 * **Pattern 2: Binary Branching (no memoization)**
 * - Recurrence: T(n) = T(n-1) + T(n-2) + O(1)
 * - Invocation count: R ≈ 2^n
 * - Work per call: O(s) = O(1)
 * - Result: O(2^n)
 * - Example: Fibonacci without memoization
 *
 * **Pattern 3: Binary Branching (with memoization)**
 * - Same recurrence but memoized
 * - Invocation count: R = n (unique subproblems)
 * - Work per call: O(s) = O(1)
 * - Result: O(n)
 * - Example: Fibonacci with memoization
 *
 * **Pattern 4: N-ary Branching**
 * - Recurrence: T(n) = k × T(n/c) + O(f)
 * - Invocation count: Grows with branching factor k
 * - Use execution tree or Master Theorem
 * - Example: Ternary search, multi-branch recursive problems
 *
 * **Why Recursion Matters:**
 * - Natural problem decomposition
 * - Elegant solutions for backtracking, tree traversal, dynamic programming
 * - Understanding execution trees prevents exponential blowup
 * - Memoization is your primary optimization tool
 *
 * **Common Time Complexities:**
 *
 * **Exponential O(2^n) - Naive Recursion:**
 * - Fibonacci without memoization: F(n) = F(n-1) + F(n-2)
 * - Recurrence: T(n) = T(n-1) + T(n-2) + O(1)
 * - Tree grows exponentially, redundant subproblems
 * - For F(n), base cases (1's) = C(n, n/2) ≈ 2^n / √n
 *
 * **Linear O(n) - With Memoization:**
 * - Same recurrence but each subproblem solved once
 * - Only O(n) unique (i, j) pairs need computation
 * - Memoization table stores n² results (for 2D DP)
 *
 * **Worst Case k = n/2:**
 * - For binomial problems C(n, k), worst case is k = n/2 (middle of row)
 * - Number of unique subproblems maximized at this point
 * - Demonstrates importance of choosing divide strategy
 *
 * **Recursion Call Stack:**
 * - Space complexity affected by maximum recursion depth
 * - Deep trees (n levels) require O(n) space on call stack
 * - Tail recursion can be optimized in some languages
 */

/**
 * # Tail Recursion & Tail Call Optimization (TCO)
 *
 * **Definition:**
 * Tail recursion is a special case where the recursive call is the **final instruction**
 * in the function, with **no additional computation** after the recursive call returns.
 *
 * **Tail Recursion Pattern:**
 * ```
 * function f(x) {
 *   if (baseCase(x)) return base_value;
 *   // No computation after this line!
 *   return f(next_value);  // Last thing executed
 * }
 * ```
 *
 * **Non-Tail Recursion Pattern (Computation After Call):**
 * ```
 * function f(x) {
 *   if (baseCase(x)) return base_value;
 *   result = f(x - 1);       // Recursive call
 *   return result + x;       // Computation AFTER call - NOT tail recursive!
 * }
 * ```
 *
 * **Key Differences:**
 *
 * | Aspect | Tail Recursion | Non-Tail Recursion |
 * |--------|----------------|-------------------|
 * | Last instruction | Recursive call | Other computation |
 * | Stack usage | Can be optimized to O(1) | Always O(n) |
 * | Compiler optimization | Yes (in C/C++) | No |
 * | Requires all info in parameters | Yes | No |
 * | Examples | Reverse string (iterate), Linear search | Fibonacci, Sum with +x after call |
 *
 * **Space Complexity Impact:**
 *
 * Non-Tail Recursion: f(x1) → f(x2) → f(x3)
 * - Stack grows: [f(x1), f(x2), f(x3), ...]
 * - Must maintain all frames until base case returns
 * - Space: O(n) for n recursive calls
 *
 * Tail Recursion (with TCO): f(x1) → f(x2) → f(x3)
 * - Stack reused: [f(x1)] → [f(x2)] → [f(x3)]
 * - System reuses same stack space for each call
 * - Only one frame needed at a time
 * - Space: O(1) - fixed amount regardless of recursion depth
 *
 * **How Tail Call Optimization Works:**
 *
 * Step-by-step for f(x1) → f(x2) → f(x3):
 *
 * 1. **Call f(x1):** Allocate stack frame for f(x1)
 *    - Stack: [f(x1)]
 *    - f(x1) prepares to call f(x2)
 *
 * 2. **Call f(x2):** Instead of creating new frame, **reuse** f(x1)'s frame
 *    - Stack: [f(x2)]  ← Same space as f(x1)
 *    - f(x2) prepares to call f(x3)
 *
 * 3. **Call f(x3):** Again, **reuse** the same frame
 *    - Stack: [f(x3)]  ← Same space as f(x1) and f(x2)
 *    - f(x3) reaches base case
 *
 * 4. **Return:** No need to unwind chain, return directly to original caller
 *    - Skip intermediate functions entirely
 *    - Direct return: f(x3) → Original Caller
 *
 * **Why Tail Recursion is Efficient:**
 * - System knows: after recursive call returns, we immediately return too
 * - No need to maintain call stack of intermediate functions
 * - Can jump straight from deepest call back to original caller
 * - Requires **all computation done via parameters** (accumulator pattern)
 *
 * **Example: Tail vs Non-Tail Recursion**
 *
 * Non-Tail (Factorial):
 * ```
 * function factorial(n) {
 *   if (n <= 1) return 1;
 *   return n * factorial(n - 1);  // Multiplication AFTER call - NOT tail
 * }
 * ```
 * Problem: Must wait for f(n-1) to return, then multiply by n
 * Stack grows: f(5) → f(4) → f(3) → f(2) → f(1)
 *
 * Tail Recursion (Factorial with Accumulator):
 * ```
 * function factorial(n, acc = 1) {
 *   if (n <= 1) return acc;
 *   return factorial(n - 1, n * acc);  // Tail call - last instruction
 * }
 * ```
 * Benefit: All computation done in parameters; recursive call is last
 * Stack reused: Each call reuses same space
 *
 * **Compiler Support by Language:**
 *
 * **Languages with TCO Support (Recommended):**
 * - C/C++: Compiler automatically optimizes tail recursion
 * - Scheme: Guaranteed tail call optimization
 * - Scala: Supports @tailrec annotation for verification
 * - Functional languages (Haskell, Lisp): Built-in support
 *
 * **Languages WITHOUT Native TCO:**
 * - Java: No built-in tail recursion optimization
 *   - Workaround: Use trampoline pattern with lambdas/streams
 *   - Alternative: Convert to iterative approach
 * - Python: Intentionally doesn't support TCO (design choice)
 *   - Reason: Preserves readable stack traces for debugging
 *   - Workaround: Use @lru_cache or convert to iteration
 *   - Alternative: Tail recursion library or manual TCO
 *   - Reference: https://stackoverflow.com/questions/13591970/does-python-optimize-tail-recursion
 * - JavaScript: Some engines optimize (V8, SpiderMonkey), not guaranteed
 *
 * **Practical Implications:**
 *
 * **Best Practice:**
 * 1. In C/C++ or Scheme: Use tail recursion for deep recursion (avoids stack overflow)
 * 2. In Java/Python: Convert to iteration or use accumulator parameters anyway
 * 3. Always: If recursion depth could exceed stack limit, consider iterative solution
 *
 * **When to Use Tail Recursion:**
 * ✅ Recursive algorithm with limited stack space
 * ✅ Language with guaranteed TCO support
 * ✅ Replacement for loops (accumulator pattern)
 * ❌ When you need information from previous calls (non-tail)
 * ❌ In Java/Python without special workarounds
 *
 * **Pattern Recognition:**
 * Check: Is the recursive call the **last thing** executed?
 * - Yes + all computation in parameters → Tail recursion ✓
 * - No + computation after call → Non-tail recursion ✗
 */

/**
 * # Binomial Coefficients & Pascal's Triangle
 *
 * **Definition:**
 * C(n,k) = n! / (k! · (n-k)!)
 * - "n choose k" = ways to select k items from n items
 *
 * **Pascal's Triangle Connection:**
 * - Each element = binomial coefficient C(n,k)
 * - Each row n contains: [C(n,0), C(n,1), ..., C(n,n)]
 * - Recurrence: C(n,k) = C(n-1,k-1) + C(n-1,k)
 * - Edges: C(n,0) = C(n,n) = 1
 *
 * **Efficiency Using Ratio:**
 * - Successive coefficients differ by: C(n,k) / C(n,k-1) = (n-k+1) / k
 * - Can build row iteratively: next = prev * (n-k+1) / k
 * - Avoids computing factorials, O(n) time instead of O(n²)
 *
 * **Mathematical Properties:**
 * - Binomial expansion: (a + b)ⁿ = Σ C(n,k) · aⁿ⁻ᵏ · bᵏ for k=0 to n
 * - Fibonacci in diagonals: F(n) = Σ C(n-1-i, i) for i=0 to n
 * - Catalan numbers appear as central elements
 */

/**
 * # Common Recursion Patterns in LeetCode (Advanced)
 *
 * **Pattern 1: Linear Recurrence (Fibonacci-like)**
 * - F(n) = F(n-1) + F(n-2) + ... + F(n-k)
 * - Examples: Fibonacci, Climbing Stairs, House Robber
 * - Without memoization: O(2^n) time
 * - With memoization: O(n) time
 * - Best solution: Iterative with O(k) space (rolling array)
 *
 * **Pattern 2: Tree Traversal**
 * - Visit nodes in DFS/BFS order
 * - Examples: Reverse Linked List, Tree Maximum Path
 * - Time: O(n) - visit each node
 * - Space: O(h) for recursion stack, h = height
 * - Natural fit for recursion (call stack = traversal path)
 *
 * **Pattern 3: Backtracking**
 * - Explore all possibilities, undo choices
 * - Examples: N-Queens, Permutations, Subsets
 * - Time: O(n!) to O(2^n) depending on problem
 * - Recursion maintains search space naturally
 * - Memoization helps prune duplicate states
 *
 * **Pattern 4: Divide and Conquer**
 * - Split problem, solve subproblems, merge results
 * - Examples: Merge Sort, Quick Sort, Binary Search
 * - Time: Use Master Theorem for analysis
 * - Recursion expresses problem decomposition naturally
 * - Execution tree method for non-dividing recurrences
 */

/**
 * # Space Optimization Techniques
 *
 * **Rolling Array (Sliding Window):**
 * - Instead of DP array of size n, use only 2 or 3 variables
 * - When i-th value only depends on (i-1), use prev/curr pattern
 * - Reduces space from O(n) to O(1)
 * - Example: Fibonacci with prev2, prev1, current
 *
 * **Two Pointers (Linked Lists):**
 * - Reverse pointers as traversing instead of building new list
 * - Space: O(1) instead of O(n) for new list
 * - Example: Reverse Linked List iterative approach
 *
 * **In-Place Modifications:**
 * - Modify input directly when allowed
 * - Common in array/string problems
 * - Always verify problem allows this before using
 */

/**
 * # Time Complexity Cheat Sheet
 *
 * | Approach | Time | Space | Use Case |
 * |----------|------|-------|----------|
 * | Naive Recursion | O(2^n) | O(n) stack | Never - exponential |
 * | Memoization | O(n²) | O(n²) memo | Small n, exploring variants |
 * | Tabulation | O(n²) | O(n²) array | Medium n, standard DP |
 * | Space-Optimized | O(n²) | O(n) or O(1) | Large n, linear dependencies |
 * | Math Formula | O(1) or O(n) | O(1) | When formula exists (rare) |
 *
 * **Selection Guide:**
 * - Always prefer space-optimized when possible
 * - Use mathematical formulas if they exist and are accurate
 * - For interviews: show memoization first, then optimize to tabulation
 * - For production: use space-optimized or mathematical approach
 */

/**
 * # Interview Tips
 *
 * **For Recursion Problems:**
 * 1. **Identify the recurrence relation** (what are the subproblems?)
 * 2. **Find base cases** (when does recursion stop?)
 * 3. **Check for overlapping subproblems** (apply memoization?)
 * 4. **Analyze time/space complexity** (exponential → convert to DP)
 * 5. **Optimize with memoization or tabulation** (bottom-up better)
 * 6. **Further optimize with space reduction** (rolling array if possible)
 *
 * **Common Mistakes:**
 * - ❌ Submitting naive recursion (TLE = Time Limit Exceeded)
 * - ❌ Forgetting base cases (infinite recursion → stack overflow)
 * - ❌ Not recognizing overlapping subproblems
 * - ✅ Always think: "Is this exponential? Add memoization!"
 *
 * **Communication:**
 * - Explain the recurrence relation clearly
 * - Show why memoization helps (eliminates redundancy)
 * - Discuss space-time tradeoffs
 * - Mention any mathematical insights (binomial coefficients, etc.)
 */

/**
 * # Conclusion: Practical Recursion Strategies
 *
 * Recursion is indeed a powerful technique that allows us to solve many problems
 * elegantly and efficiently. However, it is not a silver bullet. Not every problem
 * can be solved with recursion due to time or space constraints, and recursion
 * itself might come with undesired side effects such as stack overflow.
 *
 * Here are practical tips for applying recursion effectively in the real world:
 *
 * ## 1. Write Down the Recurrence Relationship
 *
 * **When to use this:** At first glance, it's not always evident that a recursion
 * algorithm can solve a problem.
 *
 * **How to apply:** Deduct relationships using mathematical formulas. The recurrence
 * nature in recursion is closely related to mathematics we're familiar with.
 *
 * **Why it helps:** Often clarifies ideas and uncovers hidden recurrence relationships.
 * Mathematical formulas can transform a complex problem into a simple recursive pattern.
 *
 * **Example:**
 * - Fibonacci: F(n) = F(n-1) + F(n-2) [recurrence becomes clear]
 * - Unique Binary Search Trees: T(n) = Σ T(i) * T(n-1-i) [mathematical insight reveals recursion]
 *
 * **Process:**
 * 1. Write down what you're trying to compute
 * 2. Express it in terms of smaller subproblems
 * 3. Identify base cases
 * 4. Implement the recurrence relationship
 *
 * ## 2. Apply Memoization Whenever Possible
 *
 * **The Problem:** When drafting a recursion algorithm, you often start with the
 * most naive strategy. This can lead to duplicate calculations, e.g., Fibonacci numbers.
 *
 * **The Solution:** Apply **memoization** - store intermediate results in a cache
 * for later reuse.
 *
 * **Why It Works:**
 * - Eliminates expensive duplicate calculations
 * - Converts exponential algorithms O(2^n) into polynomial O(n)
 * - Trade-off: slight increase in space complexity for massive time gain
 *
 * **Example: Fibonacci Transformation**
 * ```
 * Naive:      F(5) computes F(3) twice, F(2) thrice → O(2^5)
 * Memoized:   F(5) computes each F(i) once, reuses from cache → O(5)
 * Speedup:    32 calls → 5 calls (6.4x faster for F(5), exponentially larger for larger n)
 * ```
 *
 * **Implementation Patterns:**
 * - **Top-Down:** Add hash map to cache results (memoization)
 * - **Bottom-Up:** Build array from base cases upward (tabulation)
 * - **Space-Optimized:** Use rolling variables if dependencies are local
 *
 * **When to apply:**
 * - ✅ Overlapping subproblems exist (same computation appears multiple times)
 * - ✅ Optimal substructure exists (optimal solution uses optimal subproblems)
 * - ✅ Exponential algorithms that can be optimized
 *
 * ## 3. Use Tail Recursion to Prevent Stack Overflow
 *
 * **The Problem:** Recursion maintains a call stack. Deep recursion can cause
 * **stack overflow** - running out of stack memory.
 *
 * **The Solution:** Convert to **tail recursion** when possible. Different from
 * memoization, tail recursion optimizes space complexity by eliminating stack overhead.
 *
 * **Key Advantages:**
 * 1. **Avoids stack overflow:** Safe for deep recursion (with TCO support)
 * 2. **Better space complexity:** O(1) call stack instead of O(n)
 * 3. **More readable:** No post-call dependencies to track
 *
 * **Why Tail Recursion Works:**
 * - The recursive call is the **final action** in the function
 * - No need to maintain previous stack frames
 * - Compiler/runtime can reuse the same stack space
 * - Direct jump from deepest call to original caller
 *
 * **Example: Factorial**
 * ```
 * Non-Tail (Stack grows O(n)):
 * function factorial(n) {
 *   if (n <= 1) return 1;
 *   return n * factorial(n - 1);  // Multiply AFTER call
 * }
 *
 * Tail Recursion (Stack reused, O(1)):
 * function factorial(n, acc = 1) {
 *   if (n <= 1) return acc;
 *   return factorial(n - 1, n * acc);  // Tail call
 * }
 * ```
 *
 * **Language Support:**
 * - ✅ C/C++: Automatic compiler optimization
 * - ✅ Scheme: Guaranteed tail call optimization
 * - ✅ Scala: @tailrec annotation for verification
 * - ❌ Java: No built-in support (use iterative)
 * - ❌ Python: Intentionally disabled for debugging (use iteration or @lru_cache)
 * - ⚠️ JavaScript: Engine-dependent (some optimize, some don't)
 *
 * **When to apply:**
 * - ✅ Recursion depth could exceed stack limit
 * - ✅ Language has guaranteed TCO support
 * - ✅ Using recursion as loop replacement
 * - ❌ When you need results from previous calls (non-tail)
 * - ❌ In languages without TCO (prefer iteration instead)
 *
 * ## Decision Tree: When to Use Recursion
 *
 * ```
 * Problem requires breaking into subproblems?
 * ├─ YES: Can it be solved with tail recursion?
 * │  ├─ YES & language supports TCO: Use tail recursion
 * │  └─ NO or no TCO: Are there overlapping subproblems?
 * │     ├─ YES: Use memoization (top-down) or tabulation (bottom-up)
 * │     └─ NO: Use simple recursion (tree traversal, backtracking)
 * └─ NO: Use iteration
 * ```
 *
 * ## Summary of Strategies
 *
 * | Problem Type | Recommended Approach | Why |
 * |--------------|---------------------|-----|
 * | Overlapping subproblems | Memoization → Tabulation | Eliminates exponential blowup |
 * | Deep recursion | Tail recursion or iteration | Avoids stack overflow |
 * | Tree/graph traversal | DFS recursion | Natural fit for tree structure |
 * | Backtracking | Recursion + pruning | Naturally explores all paths |
 * | Loop replacement | Tail recursion or iteration | Cleaner code than loop |
 * | No recurrence found | Iteration | Recursion not applicable |
 *
 * ## Final Checklist
 *
 * Before implementing recursion, ask:
 * 1. ✓ Can I write down the recurrence relationship?
 * 2. ✓ Are there overlapping subproblems? (Apply memoization if yes)
 * 3. ✓ Could this cause stack overflow? (Use tail recursion or iteration)
 * 4. ✓ Is recursion cleaner than iteration? (Worth the complexity?)
 * 5. ✓ Have I identified all base cases? (Prevent infinite recursion)
 *
 * **Remember:** Recursion is elegant, but iteration is often safer. Choose recursion
 * when it genuinely simplifies the solution, not just because it's possible.
 */

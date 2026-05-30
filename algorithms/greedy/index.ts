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
 * **Related Guides:**
 * - **Complexity Theory (P, NP, NP-Complete, NP-Hard):** See `algorithms/complexity-theory/index.ts`
 *   - Learn why greedy is often the only practical approach for NP-Hard problems
 *   - Understand approximation ratios and when greedy solutions are "good enough"
 * - **Dynamic Programming:** See `algorithms/recursion/index.ts` for DP comparison
 *   - Compare greedy choice property vs optimal substructure
 *   - Understand when to use greedy vs DP
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
 *
 * @date 16/05/2026
 */

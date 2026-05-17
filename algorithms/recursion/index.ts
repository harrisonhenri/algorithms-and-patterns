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
 *
 * **Example 1: Fibonacci - Without Optimization (O(2^n))**
 * ```typescript
 * function fibNaive(n: number): number {
 *   if (n <= 1) return n;
 *   return fibNaive(n - 1) + fibNaive(n - 2);
 * }
 * // Problem: Recalculates same values multiple times
 * // fibNaive(5) calls: fibNaive(4) + fibNaive(3)
 * //                   = (fibNaive(3) + fibNaive(2)) + (fibNaive(2) + fibNaive(1))
 * // Notice fibNaive(3) and fibNaive(2) are calculated multiple times!
 * ```
 *
 * **Example 2: Fibonacci - Top-Down DP/Memoization (O(n))**
 * ```typescript
 * function fibMemo(n: number, memo: Map<number, number> = new Map()): number {
 *   if (n <= 1) return n;
 *   if (memo.has(n)) return memo.get(n)!;
 *
 *   const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
 *   memo.set(n, result);
 *   return result;
 * }
 * // Cache stores computed values to avoid recomputation
 * // Same recursion structure but with memoization layer
 * ```
 *
 * **Example 3: Fibonacci - Bottom-Up DP/Tabulation (O(n))**
 * ```typescript
 * function fibTab(n: number): number {
 *   if (n <= 1) return n;
 *   const dp = [0, 1];
 *
 *   for (let i = 2; i <= n; i++) {
 *     dp[i] = dp[i - 1] + dp[i - 2];
 *   }
 *   return dp[n];
 * }
 * // Build solution iteratively from bottom up
 * // More intuitive and avoids recursion overhead
 * ```
 *
 * **Comparison:**
 * - fibNaive(40): ~1 second (2^40 ≈ 1 trillion calls)
 * - fibMemo(40): ~0.001 seconds (only 40 unique subproblems)
 * - fibTab(40): ~0.001 seconds (simple iteration)
 */

/**
 * # Master Theorem for Recurrence Relations
 *
 * Master Theorem is primarily a **divide-and-conquer** analysis tool, not a general
 * recursion rule. Keep the full explanation and case-by-case table centralized in:
 * `algorithms/sort/divide-conquer/index.ts`
 *
 * **Use it when recurrence matches:**
 * T(n) = a·T(n/b) + f(n)
 *
 * **Do not use it for:**
 * - Unequal subproblem sizes (for example, Fibonacci: F(n-1), F(n-2))
 * - Non-standard recurrences
 *
 * In this recursion guide, prefer execution-tree reasoning and memoization analysis.
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
 * **Example 1: String Reversal (printReverse) - O(n)**
 * Problem: Print string in reverse order
 *
 * ```typescript
 * function printReverse(str: string, index: number = str.length - 1): void {
 *   if (index < 0) return;  // Base case
 *   console.log(str[index]);
 *   printReverse(str, index - 1);  // Recurse on smaller index
 * }
 * // Usage: printReverse("hello")
 * // Output: o, l, l, e, h
 * ```
 *
 * Complexity Analysis:
 * - Number of invocations: R = n (one for each character)
 * - Work per invocation: O(s) = O(1) (print one character)
 * - Total complexity: O(T) = n × O(1) = O(n)
 *
 * **Example 2: Fibonacci (Without Optimization) - O(2^n)**
 * Problem: Calculate F(n) where F(n) = F(n-1) + F(n-2)
 *
 * ```typescript
 * function fib(n: number): number {
 *   if (n <= 1) return n;
 *   return fib(n - 1) + fib(n - 2);
 * }
 * // fib(5) execution tree:
 * //                fib(5)
 * //              /        \\
 * //          fib(4)        fib(3)
 * //         /      \\      /      \\
 * //     fib(3)    fib(2) fib(2)  fib(1)
 * //    /    \\    /   \\  /   \\
 * // fib(2) fib(1) ...
 * ```
 *
 * Complexity Analysis:
 * - Each call creates 2 branches (binary tree of calls)
 * - Tree height: n
 * - Number of leaves: 2^n
 * - Total invocations: R = 2^n
 * - Work per invocation: O(s) = O(1) (just addition)
 * - Total complexity: O(T) = 2^n × O(1) = O(2^n) ❌ EXPONENTIAL!
 *
 * **Example 3: Sum Array - O(n)**
 * Problem: Sum all elements in array recursively
 *
 * ```typescript
 * function sumArray(arr: number[], index: number = 0): number {
 *   if (index === arr.length) return 0;  // Base case
 *   return arr[index] + sumArray(arr, index + 1);  // Add + recurse
 * }
 * // Usage: sumArray([1, 2, 3, 4, 5]) → 15
 * ```
 *
 * Complexity Analysis:
 * - Linear call chain: sumArray(5) → sumArray(4) → ... → sumArray(0)
 * - Number of invocations: R = n
 * - Work per invocation: O(s) = O(1) (just addition)
 * - Total complexity: O(T) = n × O(1) = O(n)
 *
 * **Example 4: Power Calculation (Exponentiation) - O(log n)**
 * Problem: Calculate x^n efficiently
 *
 * ```typescript
 * function power(x: number, n: number): number {
 *   if (n === 0) return 1;  // Base case
 *   if (n < 0) return 1 / power(x, -n);
 *   if (n % 2 === 0) {
 *     const half = power(x, n / 2);
 *     return half * half;  // x^n = (x^(n/2))^2
 *   }
 *   return x * power(x, n - 1);  // x^n = x * x^(n-1)
 * }
 * // Usage: power(2, 10) → 1024
 * // power(2, 10) → power(2, 5) * power(2, 5)
 * //             → (2 * power(2, 4)) * (2 * power(2, 4))
 * //             → 2 * (power(2, 2))^2 * 2 * (power(2, 2))^2
 * //             → depth is O(log n) due to dividing by 2
 * ```
 *
 * Complexity Analysis:
 * - Each call divides n by 2 (or does a constant amount of work)
 * - Call chain: power(n) → power(n/2) → power(n/4) → ... → power(1)
 * - Number of invocations: R = log₂(n)
 * - Work per invocation: O(s) = O(1) (just multiplication/comparison)
 * - Total complexity: O(T) = log₂(n) × O(1) = O(log n) ✓ OPTIMAL!
 *
 * **Example 5: Tree Traversal - O(n)**
 * Problem: Traverse all nodes in a binary tree
 *
 * ```typescript
 * function traverseTree(node: TreeNode | null): number {
 *   if (!node) return 0;  // Base case
 *
 *   const leftCount = traverseTree(node.left);    // Visit left subtree
 *   const rightCount = traverseTree(node.right);  // Visit right subtree
 *   return 1 + leftCount + rightCount;  // Count this node + children
 * }
 * // Binary tree with 7 nodes requires 7 calls
 * ```
 *
 * Complexity Analysis:
 * - Must visit every node in tree exactly once
 * - Number of invocations: R = n (number of nodes)
 * - Work per invocation: O(s) = O(1) (process current node)
 * - Total complexity: O(T) = n × O(1) = O(n)
 *
 * **Complexity Comparison Summary:**
 * | Algorithm | Calls | Work/Call | Total | Status |
 * |-----------|-------|-----------|-------|--------|
 * | Print String | n | O(1) | O(n) | ✓ Linear |
 * | Fibonacci Naive | 2^n | O(1) | O(2^n) | ❌ Exponential |
 * | Sum Array | n | O(1) | O(n) | ✓ Linear |
 * | Power(x, n) | log n | O(1) | O(log n) | ✓ Logarithmic |
 * | Tree Traversal | n | O(1) | O(n) | ✓ Linear |
 */

/**
 * # Greedy Algorithms and Complexity Theory
 *
 * **Greedy Algorithms** (decision-making paradigm) have been moved to:
 * `algorithms/greedy/index.ts`
 *
 * This guide covers:
 * - Greedy choice property vs DP
 * - When greedy finds optimal vs approximation
 * - Approximation algorithms
 * - Choosing between greedy, DP, and approximation approaches
 *
 * **P, NP, NP-Complete, and NP-Hard** (complexity theory) have been moved to:
 * `algorithms/complexity-theory/index.ts`
 *
 * This guide covers:
 * - P (polynomial-time solvable)
 * - NP (polynomial-time verifiable)
 * - NP-Complete (hardest in NP)
 * - NP-Hard (at least as hard as NP-Complete)
 * - Recognizing NP-Complete problems
 * - Practical handling strategies by input size
 * - The P vs NP problem
 *
 * **Why They Were Moved:**
 * While these concepts are related to optimization and recursion, they are
 * distinct algorithm design paradigms and theoretical frameworks that deserve
 * their own focused modules for clarity and discoverability.
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
 * **Non-Tail (Factorial):**
 * ```typescript
 * function factorial(n: number): number {
 *   if (n <= 1) return 1;
 *   return n * factorial(n - 1);  // Computation AFTER call (n * ...)
 * }
 * // Call stack grows:
 * // factorial(5)
 * //   → 5 * factorial(4)
 * //       → 4 * factorial(3)
 * //           → 3 * factorial(2)
 * //               → 2 * factorial(1)
 * //                   → 1
 * //
 * // Must unwind entire chain because of multiplication pending
 * // Stack: [factorial(5), factorial(4), factorial(3), factorial(2), factorial(1)]
 * // Space: O(n)
 * ```
 *
 * **Tail Recursive (Factorial with Accumulator):**
 * ```typescript
 * function factorialTail(n: number, acc: number = 1): number {
 *   if (n <= 1) return acc;  // Base case returns accumulated result
 *   return factorialTail(n - 1, n * acc);  // Tail call: ONLY recursive call
 * }
 * // No computation after recursive call!
 * // Call pattern:
 * // factorialTail(5, 1)
 * //   → factorialTail(4, 5)
 * //       → factorialTail(3, 20)
 * //           → factorialTail(2, 60)
 * //               → factorialTail(1, 120)
 * //                   → 120
 * //
 * // With TCO: Reuses same stack frame
 * // Stack: [factorialTail(...)]  ← Same frame reused
 * // Space: O(1) with TCO, O(n) without
 * ```
 *
 * **Tail Recursive (Print Reverse - Cleaner Example):**
 * ```typescript
 * function printReverseTail(str: string, index: number = str.length - 1): void {
 *   if (index < 0) return;  // Base case
 *   console.log(str[index]);  // Process current position
 *   printReverseTail(str, index - 1);  // Tail call - nothing after!
 * }
 * // Each call: process one character, then call next
 * // No computation pending when returning
 * // Perfect candidate for TCO
 * ```
 *
 * **Converting to Tail Recursion (Accumulator Pattern):**
 *
 * Pattern: Move all computation **into parameters** using accumulator
 *
 * ```typescript
 * // Before (Non-Tail): Computation after call
 * function sum(arr: number[], i: number): number {
 *   if (i === arr.length) return 0;
 *   return arr[i] + sum(arr, i + 1);  // Addition AFTER call ❌
 * }
 *
 * // After (Tail): Computation in parameters via accumulator
 * function sumTail(arr: number[], i: number, acc: number = 0): number {
 *   if (i === arr.length) return acc;  // Return accumulated result
 *   return sumTail(arr, i + 1, acc + arr[i]);  // Addition BEFORE call ✓
 * }
 * ```
 *
 * **TCO Support by Language:**
 *
 * | Language | TCO Support | Notes |
 * |----------|-------------|-------|
 * | C/C++ | Yes | Compiler optimization enabled with -O flag |
 * | JavaScript | Partial | Only Safari (ES6), not Chrome/Node.js |
 * | Python | No | Guido van Rossum intentionally disabled it |
 * | Java | No | JVM doesn't support TCO |
 * | Lisp/Scheme | Yes | Full support, idiomatic |
 * | Rust | Limited | Only in specific cases |
 * | Go | Yes | Partial support in some cases |
 * | Scala | Yes | Via @tailrec annotation |
 *
 * **In JavaScript/TypeScript:**
 * - Safari implements TCO for tail-recursive functions
 * - Chrome, Node.js do NOT implement TCO
 * - For safe tail recursion in all environments:
 *   - Convert to iteration (for/while loop)
 *   - Use trampolining technique
 *   - Or accept O(n) space requirement
 *
 * **When to Use Tail Recursion:**
 * - ✅ Language supports TCO (C/C++, Scheme, Scala)
 * - ✅ Processing sequences one element at a time
 * - ✅ Linear recursion (not branching)
 * - ✅ Need to avoid stack overflow for large n
 * - ❌ Language doesn't support TCO (JavaScript, Python, Java)
 * - ❌ Need branching recursion (tree traversal, backtracking)
 *
 * **Practical Advice for Interviews:**
 * - In JavaScript: Avoid relying on TCO, convert to loops if needed
 * - Mention TCO pattern to show understanding, but know its limitations
 * - Prioritize readability: sometimes loop-based solution is clearer
 * - For exponential algorithms: memoization > TCO for complexity reduction
 */

/**
 * # Backtracking: Exploring All Possibilities Systematically
 *
 * **Definition:**
 * Backtracking is a recursion technique that explores all possible solutions by:
 * 1. Building solution step by step
 * 2. Checking constraints at each step
 * 3. **Abandoning paths** that violate constraints (pruning)
 * 4. Recovering to try alternative paths
 *
 * **Key Insight:**
 * Unlike simple recursion that explores all paths,
 * backtracking **prunes invalid paths early**, avoiding exponential waste.
 *
 * **Backtracking vs Brute Force:**
 * - Brute Force: Generate all possibilities, then filter
 * - Backtracking: Prune invalid possibilities during exploration
 * - Backtracking is faster: avoids generating invalid solutions
 *
 * **Backtracking Template:**
 * ```typescript
 * function backtrack(current: any[], constraints: any): void {
 *   // Base case: solution found
 *   if (isComplete(current)) {
 *     solutions.push([...current]);
 *     return;
 *   }
 *
 *   // Try each candidate
 *   for (const candidate of getCandidates(current)) {
 *     // Check constraints (pruning)
 *     if (isValid(current, candidate)) {
 *       // Make choice
 *       current.push(candidate);
 *
 *       // Explore recursively
 *       backtrack(current, constraints);
 *
 *       // Undo choice (backtrack)
 *       current.pop();
 *     }
 *   }
 * }
 * ```
 *
 * **Example 1: Generate Permutations**
 * ```typescript
 * function permute(nums: number[]): number[][] {
 *   const result: number[][] = [];
 *   const current: number[] = [];
 *   const used = new Set<number>();
 *
 *   function backtrack(): void {
 *     // Base: all numbers used
 *     if (current.length === nums.length) {
 *       result.push([...current]);
 *       return;
 *     }
 *
 *     // Try each number
 *     for (const num of nums) {
 *       if (!used.has(num)) {  // Pruning: skip if already used
 *         current.push(num);
 *         used.add(num);
 *
 *         backtrack();  // Explore
 *
 *         current.pop();  // Undo
 *         used.delete(num);
 *       }
 *     }
 *   }
 *
 *   backtrack();
 *   return result;
 * }
 * // Usage: permute([1, 2, 3])
 * // Output: [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
 * // Time: O(n! · n) - n! permutations × n to copy each
 * ```
 *
 * **Example 2: N-Queens Problem**
 * ```typescript
 * function solveNQueens(n: number): string[][] {
 *   const result: string[][] = [];
 *   const board = Array(n).fill('.'.repeat(n));  // n×n board
 *   const cols = new Set<number>();
 *   const diag1 = new Set<number>();  // row - col
 *   const diag2 = new Set<number>();  // row + col
 *
 *   function backtrack(row: number): void {
 *     if (row === n) {  // Placed all queens
 *       result.push([...board]);
 *       return;
 *     }
 *
 *     for (let col = 0; col < n; col++) {
 *       // Pruning: Check if position is safe
 *       if (!cols.has(col) && !diag1.has(row - col) && !diag2.has(row + col)) {
 *         // Place queen
 *         board[row] = board[row].slice(0, col) + 'Q' + board[row].slice(col + 1);
 *         cols.add(col);
 *         diag1.add(row - col);
 *         diag2.add(row + col);
 *
 *         backtrack(row + 1);  // Try next row
 *
 *         // Remove queen (undo)
 *         board[row] = board[row].slice(0, col) + '.' + board[row].slice(col + 1);
 *         cols.delete(col);
 *         diag1.delete(row - col);
 *         diag2.delete(row + col);
 *       }
 *     }
 *   }
 *
 *   backtrack(0);
 *   return result;
 * }
 * // Time: O(N!) worst case, but pruning eliminates most branches
 * // For N=8: Only 92 solutions exist out of 8! = 40,320 possibilities
 * ```
 *
 * **Example 3: Subset Sum**
 * ```typescript
 * function findSubsets(target: number, nums: number[]): number[][] {
 *   const result: number[][] = [];
 *   const current: number[] = [];
 *
 *   function backtrack(index: number, sum: number): void {
 *     // Base: reached target
 *     if (sum === target) {
 *       result.push([...current]);
 *       return;
 *     }
 *
 *     // Pruning: exceeded target
 *     if (sum > target || index === nums.length) {
 *       return;
 *     }
 *
 *     // Include current number
 *     current.push(nums[index]);
 *     backtrack(index + 1, sum + nums[index]);
 *     current.pop();
 *
 *     // Exclude current number
 *     backtrack(index + 1, sum);
 *   }
 *
 *   backtrack(0, 0);
 *   return result;
 * }
 * // Usage: findSubsets(7, [2, 3, 5])
 * // Output: [[2,5], [3, 2, 2], ...]  subsets that sum to 7
 * // Pruning: If sum > target, stop exploring that branch
 * ```
 *
 * **Why Backtracking is Powerful:**
 *
 * **Advantage 1: Early Termination (Pruning)**
 * - N-Queens: Detect conflict early (queen in same column/diagonal)
 * - Subset Sum: Stop if sum exceeds target
 * - Reduces actual work from O(2^n) to manageable size
 *
 * **Advantage 2: Space-Efficient**
 * - Only maintains current path (recursive stack)
 * - No need to store all intermediate solutions
 * - Space: O(n) for recursion depth + current solution
 *
 * **Advantage 3: Natural Problem Decomposition**
 * - Problems naturally break into "try all choices"
 * - Matches human problem-solving approach
 * - Easier to understand than nested loops
 *
 * **Complexity Trade-offs:**
 *
 * | Problem | Brute Force | Backtracking | Improvement |
 * |---------|---|---|---|
 * | Permutations | O(n! · n) | O(n! · n) | None (all valid) |
 * | N-Queens (n=8) | O(2^(64)) | O(92 solutions) | 10^18× faster! |
 * | Subset Sum | O(2^n) | O(2^n) pruned | Depends on target |
 * | Sudoku | O(9^81) | Heavily pruned | 10^10× faster |
 *
 * **When to Use Backtracking:**
 * - ✅ Need all solutions (not just one)
 * - ✅ Problem has constraints (prune invalid branches)
 * - ✅ Solution builds step-by-step
 * - ✅ State space is large but pruning helps
 * - ❌ Need only one solution (early termination + return)
 * - ❌ No constraints to prune (becomes brute force)
 * - ❌ Problem can be solved greedily or with DP
 */

/**
 * # Divide & Conquer: Recursive Problem Decomposition
 *
 * **Definition:**
 * Divide & Conquer is a recursive approach that solves problems by:
 * 1. **Divide**: Break problem into smaller independent subproblems
 * 2. **Conquer**: Recursively solve each subproblem
 * 3. **Combine**: Merge subproblem solutions into final answer
 *
 * **Key Characteristic:**
 * Subproblems are **independent** (no overlap between them)
 * - Opposite of Dynamic Programming (which has overlapping subproblems)
 * - Each subproblem solved exactly once
 *
 * **Divide & Conquer vs Dynamic Programming:**
 *
 * | Aspect | Divide & Conquer | Dynamic Programming |
 * |--------|---|---|
 * | Subproblems | **Independent** | Overlapping |
 * | Solved | Once each | Multiple times (cached) |
 * | Approach | Recursive decomposition | Memoization or tabulation |
 * | Time | Usually O(n log n) | Depends, often O(n²) |
 * | When to use | Binary search, merge sort | Fibonacci, LCS, coin change |
 *
 * **Example 1: Merge Sort (Classic Divide & Conquer)**
 * ```typescript
 * function mergeSort(arr: number[]): number[] {
 *   // Base case: single element is sorted
 *   if (arr.length <= 1) return arr;
 *
 *   // DIVIDE: Split into two halves
 *   const mid = Math.floor(arr.length / 2);
 *   const left = arr.slice(0, mid);
 *   const right = arr.slice(mid);
 *
 *   // CONQUER: Recursively sort each half
 *   const sortedLeft = mergeSort(left);
 *   const sortedRight = mergeSort(right);
 *
 *   // COMBINE: Merge sorted halves
 *   return merge(sortedLeft, sortedRight);
 * }
 *
 * function merge(left: number[], right: number[]): number[] {
 *   const result: number[] = [];
 *   let i = 0, j = 0;
 *
 *   while (i < left.length && j < right.length) {
 *     if (left[i] <= right[j]) {
 *       result.push(left[i++]);
 *     } else {
 *       result.push(right[j++]);
 *     }
 *   }
 *   result.push(...left.slice(i), ...right.slice(j));
 *   return result;
 * }
 * // Time: O(n log n) via Master Theorem
 * // Space: O(n) for temporary arrays
 * ```
 *
 * **Example 2: Quick Sort (Divide & Conquer)**
 *
 * Quick Sort is a highly practical divide-and-conquer algorithm that:
 * - Partitions around a pivot value
 * - Recursively sorts left (smaller) and right (larger) sublists
 * - Achieves O(n log n) average time with better cache locality than Merge Sort
 *
 * For detailed quicksort implementation, complexity analysis, pivot strategies,
 * and practical considerations, see: `algorithms/sort/divide-conquer/quick-sort/index.ts`
 *
 * **Brief Example:**
 * ```typescript
 * function quickSort(arr: number[], low: number = 0, high: number = arr.length - 1): void {
 *   if (low < high) {
 *     const pi = partition(arr, low, high);  // DIVIDE: Partition around pivot
 *     quickSort(arr, low, pi - 1);           // CONQUER: Sort left half
 *     quickSort(arr, pi + 1, high);          // CONQUER: Sort right half
 *   }
 * }
 * // Time: O(n log n) average, O(n²) worst case
 * // Space: O(log n) recursion depth
 * ```
 *
 *
 * **Example 3: Binary Search (Divide & Conquer)**
 * ```typescript
 * function binarySearch(arr: number[], target: number): number {
 *   function search(low: number, high: number): number {
 *     if (low > high) return -1;  // Base: not found
 *
 *     const mid = Math.floor((low + high) / 2);
 *
 *     if (arr[mid] === target) return mid;       // Found
 *     if (arr[mid] > target)
 *       return search(low, mid - 1);             // DIVIDE: search left
 *     return search(mid + 1, high);              // DIVIDE: search right
 *   }
 *   return search(0, arr.length - 1);
 * }
 * // Time: O(log n) - eliminates half on each call
 * // Space: O(log n) recursion depth
 * ```
 *
 * **Example 4: Count Inversions (Divide & Conquer)**
 * An inversion is a pair (i, j) where i < j but arr[i] > arr[j]
 * ```typescript
 * function countInversions(arr: number[]): number {
 *   if (arr.length <= 1) return 0;
 *
 *   const mid = Math.floor(arr.length / 2);
 *   const left = arr.slice(0, mid);
 *   const right = arr.slice(mid);
 *
 *   // Count inversions in each half
 *   const leftInversions = countInversions(left);
 *   const rightInversions = countInversions(right);
 *
 *   // Count inversions across halves (during merge)
 *   const merged: number[] = [];
 *   let crossInversions = 0;
 *   let i = 0, j = 0;
 *
 *   while (i < left.length && j < right.length) {
 *     if (left[i] <= right[j]) {
 *       merged.push(left[i++]);
 *     } else {
 *       // left[i] > right[j]: all remaining left elements form inversions
 *       crossInversions += left.length - i;
 *       merged.push(right[j++]);
 *     }
 *   }
 *   merged.push(...left.slice(i), ...right.slice(j));
 *
 *   // In real implementation, return inversion count and sorted array
 *   return leftInversions + rightInversions + crossInversions;
 * }
 * // Time: O(n log n) - counts inversions while merging
 * // Without D&C: O(n²) to count all pairs
 * ```
 *
 * **Divide & Conquer Master Theorem Application:**
 * Form: T(n) = a·T(n/b) + f(n)
 *
 * | Algorithm | a | b | f(n) | Result |
 * |---|---|---|---|---|
 * | Merge Sort | 2 | 2 | O(n) | O(n log n) |
 * | Quick Sort (avg) | 2 | 2 | O(n) | O(n log n) |
 * | Binary Search | 1 | 2 | O(1) | O(log n) |
 * | Count Inversions | 2 | 2 | O(n) | O(n log n) |
 * | Strassen Matrix | 7 | 2 | O(1) | O(n^2.81) |
 *
 * **When to Use Divide & Conquer:**
 * - ✅ Problem breaks naturally into independent subproblems
 * - ✅ Subproblems are similar to original (recursive structure)
 * - ✅ Combining solutions is straightforward
 * - ✅ Want O(n log n) or O(log n) complexity
 * - ❌ Subproblems overlap (use DP instead)
 * - ❌ Can solve greedily
 * - ❌ Sequential/linear approach is simpler
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

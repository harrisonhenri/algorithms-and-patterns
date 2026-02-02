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

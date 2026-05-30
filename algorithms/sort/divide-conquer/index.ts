/**
 * # Divide and Conquer (D&C) - Complete Guide
 *
 * ## Definition
 * Divide and Conquer is one of the most important paradigms in algorithm design. It works by
 * recursively breaking a problem down into two or more subproblems of the same or related type,
 * until these subproblems become simple enough to be solved directly. Then one combines the
 * results of subproblems to form the final solution.
 *
 * ## Key Distinction
 * **Divide and Conquer ≠ Recursion**
 * - Recursion is just a *tool* for implementation
 * - D&C breaks problem into **multiple subproblems** (n ≥ 2)
 * - Other recursive algorithms (e.g., Binary Search) solve a **single subproblem** per call
 *   (known as **Decrease and Conquer**)
 * - Binary Search is the canonical decrease-and-conquer example:
 *   it discards half and continues, with no meaningful combine phase
 *
 * ## Three Steps of Divide and Conquer
 *
 * ### 1. DIVIDE
 * Break the problem into a set of subproblems: {S₁, S₂, ..., Sₙ} where n ≥ 2
 * Each subproblem should be independent and of the same or related type.
 *
 * Example (Merge Sort):
 * ```
 * [5, 2, 8, 1, 9] → [5, 2, 8] + [1, 9]
 * ```
 *
 * ### 2. CONQUER
 * Solve each subproblem recursively.
 * If a subproblem is small enough, solve it directly (base case).
 *
 * Example (Merge Sort):
 * ```
 * [5, 2, 8] → [5] + [2, 8] → [5] + [2] + [8]
 * ```
 *
 * ### 3. COMBINE
 * Merge the results of each subproblem to form the final solution.
 * This is the critical difference from simple recursion.
 *
 * Example (Merge Sort):
 * ```
 * [5] + [2] + [8] → [2, 5, 8] → [1, 2, 5, 8, 9]
 * ```
 *
 * ## Mental Test (5-Second Rule): Is it Divide & Conquer?
 *
 * ### Question 1: Is the problem divided into smaller parts?
 * ✔ Divide & Conquer: array → left half + right half
 * ✘ Not D&C: processes array sequentially without dividing
 *
 * ### Question 2: Are the subproblems independent?
 * ✔ Divide & Conquer: Solving left half doesn't depend on right half
 * ✘ Not D&C (DP): Subproblems often depend on each other
 *
 * ### Question 3: Is there a combine/merge phase?
 * ✔ Divide & Conquer: Results are merged/combined
 * ✘ Not D&C: No meaningful combination step
 *
 * ## Quick Checklist: Common Algorithms
 *
 * | Algorithm           | Divides? | Combines? | Is D&C? | Notes |
 * | ------------------- | -------- | --------- | ------- | ----- |
 * | **Merge Sort**      | ✔        | ✔         | ✔       | Divides into 2 halves, merges results |
 * | **Quick Sort**      | ✔        | ✔         | ✔       | Divides by pivot, concatenates partitions |
 * | **Binary Search**   | ✔        | ✘         | ✘       | Decrease-and-conquer: discard half, recurse into one side |
 * | **Strassen's Algo** | ✔        | ✔         | ✔       | Matrix multiplication: 7 subproblems |
 * | **Tower of Hanoi**  | ✔        | ✔         | ✔       | Divides into n-1 and 1 disk |
 * | **Factorial**       | ✘        | ✘         | ✘       | Single recursive call, not dividing |
 * | **Fibonacci (naive)** | ✘      | ✘         | ✘       | Single recursive call path |
 * | **DFS/BFS**         | ✘        | ✘         | ✘       | Graph traversal, no combining |
 * | **Linear Search**   | ✘        | ✘         | ✘       | Processes one element at a time |
 *
 * ## Common Pitfall
 * **"Recursion = Divide and Conquer"** ❌ WRONG
 *
 * Recursion is just the implementation technique. D&C is a specific problem-solving paradigm
 * where you MUST divide the problem into multiple parts and combine results.
 *
 * ## Quick Rule: Can You Draw It?
 *
 * If you can visualize:
 * ```
 *          Problem
 *           /    \\
 *     Subproblem1  Subproblem2
 *           \\    /
 *           Combine
 *             Result
 * ```
 *
 * Then it's **Divide and Conquer**.
 *
 * ## Master Theorem - Time Complexity Analysis
 *
 * Master Theorem (also called Master Method) provides a systematic way to calculate
 * the time complexity of divide-and-conquer algorithms without analyzing each case individually.
 *
 * **Important:** Master Theorem is a standard technique for analyzing
 * divide-and-conquer recurrences. It specifically applies to algorithms where subproblems are of **equal size**.
 *
 * ### The Master Theorem Formula
 *
 * For D&C algorithms following this recurrence pattern:
 * ```
 * T(n) = a·T(n/b) + f(n)
 * ```
 *
 * Where:
 * - `a` = number of subproblems (a ≥ 1)
 * - `b` = factor by which problem size reduces (b > 1)
 * - `n/b` = size of each subproblem
 * - `f(n)` = cost of dividing problem and combining results
 *
 * For this guide, we use the common simplified form `f(n) = O(n^d)` where `d ≥ 0`.
 * More general variants also handle terms like `Theta(n^d log^k n)`.
 *
 * ### Three Cases of Master Theorem
 *
 * The complexity depends on comparing `a` vs `b^d` (or equivalently, `d` vs `log_b(a)`):
 *
 * #### Case 1: f(n) is negligible compared to subproblem work
 * **Condition:** `a > b^d` (i.e., `d < log_b(a)`)
 * **Result:** T(n) = **O(n^(log_b(a)))**
 *
 * **Intuition:** The work to divide and combine is dwarfed by the work of subproblems.
 * The overall complexity reduces to just the subproblem complexity.
 *
 * **Example: Strassen's Matrix Multiplication**
 * - a = 7 (seven recursive multiplications)
 * - b = 2 (matrix dimensions halved)
 * - f(n) = O(n²) (matrix additions), so d = 2
 * - Since 2 < log₂(7) ≈ 2.81, Case 1 applies
 * - Result: T(n) = O(n^log₂(7)) = O(n^2.81) ✓
 *
 * #### Case 2: f(n) is balanced with subproblem work
 * **Condition:** `a = b^d` (i.e., `d = log_b(a)`)
 * **Result:** T(n) = **O(n^d · log(n))** = **O(n^(log_b(a)) · log(n))**
 *
 * **Intuition:** The divide/combine work and subproblem work are equally significant.
 * They occur at each level of recursion tree, giving an extra log(n) factor.
 *
 * **Example 1: Merge Sort**
 * - a = 2 (sort left and right halves)
 * - b = 2 (array divided into halves)
 * - f(n) = O(n) (merging takes O(n) time), so d = 1
 * - Since log₂(2) = 1, we have d = log_b(a), Case 2 applies
 * - Result: T(n) = O(n · log(n)) ✓
 *
 * **Example 2: Binary Search**
 * - a = 1 (search only one half)
 * - b = 2 (problem size reduced by half)
 * - f(n) = O(1) (constant work to find middle), so d = 0
 * - Since 0 = log₂(1), Case 2 applies
 * - Result: T(n) = O(n^0 · log(n)) = O(log(n)) ✓
 *
 * #### Case 3: f(n) dominates subproblem work
 * **Condition:** `a < b^d` (i.e., `d > log_b(a)`)
 * **Result:** T(n) = **O(n^d)** = **O(f(n))**
 *
 * **Intuition:** The divide/combine work outweighs the subproblem work.
 * The overall complexity is dominated by the divide/combine operations.
 *
 * **Example: QuickSelect (finding kth element)**
 * - Assume optimal pivot (median) is chosen
 * - a = 1 (only search one partition)
 * - b = 2 (partition divided into halves)
 * - f(n) = O(n) (partitioning takes O(n) time), so d = 1
 * - Since 1 > log₂(1) = 0, Case 3 applies
 * - Result: T(n) = O(n^1) = O(n) ✓
 * - Makes sense: average O(n) for finding kth element
 *
 * ### Quick Comparison Table
 *
 * | Algorithm | a | b | d | Condition | Case | Result |
 * |-----------|---|---|---|-----------|------|--------|
 * | Strassen's Matrix Mult. | 7 | 2 | 2 | 2 < log₂(7)≈2.81 | 1 | O(n^2.81) |
 * | Merge Sort | 2 | 2 | 1 | 1 = 1 | 2 | O(n log n) |
 * | Binary Search | 1 | 2 | 0 | 0 = 0 | 2 | O(log n) |
 * | QuickSelect | 1 | 2 | 1 | 1 > 0 | 3 | O(n) |
 * | Karatsuba Multiplication | 3 | 2 | 1 | 1 < log₂(3)≈1.58 | 1 | O(n^1.58) |
 *
 * ### Limitations of Master Theorem
 *
 * Master Theorem **only applies when:**
 * - Subproblems are of **equal size** (exactly n/b)
 * - The recurrence follows the pattern T(n) = a·T(n/b) + f(n)
 *
 * Master Theorem **does NOT apply when:**
 * - Subproblems are of **different sizes**
 *   - Example: Fibonacci F(n) = F(n-1) + F(n-2)
 *   - Here subproblems are F(n-1) and F(n-2) (different sizes)
 *   - Example: QuickSort worst-case T(n) = T(n-1) + O(n)
 *   - Partitions are highly unbalanced, so n/b equal-size assumption does not hold
 * - The recurrence doesn't match the standard pattern
 * - Recursive work is not uniform across branches
 *
 * **For unequal subproblems:** Use the **Akra-Bazzi Theorem**, which is a generalization
 * of Master Theorem designed to handle cases with different-sized subproblems.
 *
 * ## Classic D&C Algorithms in This Project
 *
 * ### 1. Merge Sort
 * - **Divide:** Split array into 2 halves
 * - **Conquer:** Recursively sort each half
 * - **Combine:** Merge two sorted halves
 * - **Complexity:** O(n log n) guaranteed
 * - **Use:** Stable sorting, guaranteed performance
 *
 * ### 2. Quick Sort
 * - **Divide:** Partition around pivot (left < pivot < right)
 * - **Conquer:** Recursively sort partitions
 * - **Combine:** Concatenate (left + pivot + right)
 * - **Complexity:** O(n log n) average, O(n²) worst
 * - **Recurrence caveat:**
 *   - Average-case is often modeled as T(n) ≈ 2T(n/2) + O(n)
 *   - Worst-case is T(n) = T(n-1) + O(n), which Master Theorem does not cover
 * - **Use:** Fast average case, in-place
 *
 * ### 3. Binary Search
 * - **Divide:** Compare with middle element
 * - **Conquer:** Search only left OR right half (not both)
 * - **Combine:** None (discard one half and continue)
 * - **Complexity:** O(log n)
 * - **Note:** **Decrease and Conquer** (single subproblem), not classic D&C
 *
 * ## When to Use Divide and Conquer
 *
 * ✔ Use D&C when:
 * - Problem naturally breaks into independent subproblems
 * - Subproblems are similar to original problem
 * - Combining results is feasible
 * - You need better than brute-force complexity
 *
 * ✘ Avoid D&C when:
 * - Subproblems heavily overlap (use Dynamic Programming)
 * - Only one subproblem per step (Decrease and Conquer)
 * - Combining is more expensive than solving separately
 * - Problem requires looking at all solutions simultaneously
 *
 * ## D&C Template
 *
 * The essential part of divide-and-conquer is figuring out the **recurrence relationship**
 * between subproblems and the original problem. This defines the functions for dividing
 * and combining.
 *
 * ### Pseudocode Template
 *
 * ```
 * function solveWithDivideAndConquer(problem) {
 *   // Base case: problem is small enough to solve directly
 *   if (problem is trivial) {
 *     return solution directly
 *   }
 *
 *   // Divide: Split problem into subproblems
 *   subproblems = divide(problem)  // Returns: {S1, S2, ..., Sn} where n ≥ 2
 *
 *   // Conquer: Solve each subproblem recursively
 *   results = []
 *   for each subproblem in subproblems:
 *     result = solveWithDivideAndConquer(subproblem)
 *     results.add(result)
 *
 *   // Combine: Merge results of subproblems
 *   solution = combine(results)
 *   return solution
 * }
 * ```
 *
 * ### Key Points
 *
 * ⭐ **Essential:** Figure out how to **divide** the problem and how to **combine** results
 *
 * - **Divide:** What are the independent subproblems?
 * - **Conquer:** Recursively solve each subproblem
 * - **Combine:** How do subproblem solutions form the complete solution?
 * - **Base Case:** When is the problem trivial enough to solve directly?
 *
 * ## Concrete Example: Validate Binary Search Tree
 *
 * ### Problem Statement
 *
 * Given a binary tree, validate if it's a valid Binary Search Tree (BST).
 * A BST must satisfy:
 * 1. All values in **left subtree** < node value
 * 2. All values in **right subtree** > node value
 * 3. Both **left and right subtrees** are also valid BSTs
 *
 * **Key Insight:** Point 3 is recursive in nature → Perfect for Divide-and-Conquer!
 *
 * ### Applying the D&C Template
 *
 * **1. DIVIDE:**
 * - Split the tree into two subtrees: left child and right child
 * - Each subtree is a smaller instance of the same problem
 *
 * **2. CONQUER:**
 * - Recursively validate if the left subtree is a valid BST
 * - Recursively validate if the right subtree is a valid BST
 * - Base case: empty tree or single node is always a valid BST
 *
 * **3. COMBINE:**
 * - Return **true** if BOTH subtrees are valid BSTs
 * - Return **false** if EITHER subtree is invalid
 * - Verify constraints using propagated value bounds (min/max), not subtree rescans
 *
 * ### Example Tree
 *
 * ```
 *        10          Valid BST ✅
 *       /  \\
 *      5    15
 *     / \\   / \\
 *    2   7 12  20
 *
 * Validation process:
 * - Check node 10: validate left subtree (5) and right subtree (15)
 *   - Check node 5: validate left subtree (2) and right subtree (7)
 *     - Check node 2: empty subtrees → valid ✅
 *     - Check node 7: empty subtrees → valid ✅
 *     - Combine: 2 < 5 < 7 ✅
 *   - Check node 15: validate left subtree (12) and right subtree (20)
 *     - Check node 12: empty subtrees → valid ✅
 *     - Check node 20: empty subtrees → valid ✅
 *     - Combine: 12 < 15 < 20 ✅
 *   - Combine: (5 valid) AND (15 valid) ✅
 * ```
 *
 * ### Implementation Pattern
 *
 * ```typescript
 * function isValidBST(node, min = -Infinity, max = Infinity): boolean {
 *   // Base case: empty tree or single node
 *   if (node === null) return true
 *
 *   // Combine constraint from ancestors first
 *   if (node.value <= min || node.value >= max) return false
 *
 *   // Conquer with propagated bounds
 *   return (
 *     isValidBST(node.left, min, node.value) &&
 *     isValidBST(node.right, node.value, max)
 *   )
 * }
 * ```
 *
 * ### Important Details
 *
 * ⚠️ **Challenge:** The simple recursive check misses a crucial constraint:
 *
 * You need to verify:
 * - All values in **entire left subtree** must be < node value (not just direct child)
 * - All values in **entire right subtree** must be > node value (not just direct child)
 *
 * Example of invalid tree that simple check might miss:
 * ```
 *       10
 *      /  \\
 *     5   15
 *          /
 *         12
 *        /
 *       8  ❌ Should be > 10 (ancestor), but it's < 10!
 * ```
 *
 * **Solutions:**
 * 1. Pass min/max bounds to each recursive call (most efficient and standard)
 * 2. Return both validation result and min/max values
 * 3. Collect all values in subtrees and verify constraints

 * **Recommended framing:**
 * The most efficient approach propagates valid value ranges (min/max constraints)
 * down the recursion tree.
 *
 * ## References
 * - [1] Divide and Conquer. Wikipedia: https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm
 * - Master Theorem for analyzing recursive algorithms
 * - Introduction to Algorithms (CLRS) - Chapter 4
 *
 * @date 30/01/2026
 */

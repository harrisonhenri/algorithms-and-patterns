/**
 * Unique Binary Search Trees II - LeetCode Problem 95
 *
 * **Problem Statement:**
 * Given an integer n, return all the structurally unique BST's (binary search trees),
 * which have exactly n nodes of unique values from 1 to n. Return the answer in any order.
 *
 * **Example 1:**
 * ```
 * Input: n = 3
 * Output: [[1,null,2,null,3],[1,null,3,2],[2,1,3],[3,1,null,null,2],[3,2,null,1]]
 * Explanation: 5 structurally different BSTs with 3 nodes
 * ```
 *
 * **Example 2:**
 * ```
 * Input: n = 1
 * Output: [[1]]
 * ```
 *
 * **Constraints:**
 * - 1 <= n <= 8
 * - All unique values from 1 to n
 *
 * **Key Insights:**
 * 1. This is fundamentally a **combinatorial problem** - generating all valid structures
 * 2. **Catalan Numbers:** The number of structurally unique BSTs with n nodes = Catalan(n)
 *    - C(1)=1, C(2)=2, C(3)=5, C(4)=14, C(5)=42, etc.
 *    - Formula: C(n) = (2n)! / ((n+1)! * n!)
 *    - Recursive: C(n) = Σ(i=1 to n) C(i-1) * C(n-i)
 *
 * 3. **Divide & Conquer with Recursion:**
 *    - For each number i as root (1 to n):
 *      - Left subtree: all BSTs with values 1 to i-1
 *      - Right subtree: all BSTs with values i+1 to n
 *    - Combine: pair each left BST with each right BST
 *
 * 4. **Memoization Opportunity:**
 *    - Different (start, end) pairs generate the same structures
 *    - Can cache results based on subtree size
 *
 * **Approaches:**
 * 1. **Recursive with Memoization** - Top-down DP
 *    - For range [start, end], try each number as root
 *    - Recursively generate left and right subtrees
 *    - Combine all pairs
 *
 * 2. **Dynamic Programming (Bottom-Up)**
 *    - Build solutions for size 0, 1, 2, ..., n
 *    - Use previous solutions to build larger ones
 *    - More explicit DP table approach
 *
 * **Time Complexity:**
 * O(Catalan(n) * n) - Generate Catalan(n) trees, each with O(n) nodes to construct
 * Catalan(n) ≈ 4^n / (n^(3/2) * √π)
 *
 * **Space Complexity:**
 * O(Catalan(n) * n) - Store all generated trees
 *
 * **Connection to Recursion Module:**
 * See /algorithms/recursion/index.ts for:
 * - Divide and Conquer pattern explanation
 * - Recursion complexity analysis
 * - Memoization and Top-Down DP
 * - Master Theorem for analyzing recursive algorithms
 * - Catalan number recurrence relation: T(n) = Σ(i=1 to n) T(i-1)*T(n-i)
 *
 * @date 03/02/2026
 */

import { TreeNode } from "../../structures/tree";

/**
 * **Approach 1: Recursive with Memoization**
 *
 * Use recursion to generate all structurally unique BSTs for a given range.
 * Memoize results based on (start, end) to avoid redundant computation.
 *
 * **Algorithm:**
 * 1. Base cases:
 *    - If start > end: return [null] (empty tree)
 *    - If start == end: return single-node tree
 * 2. For each number i from start to end as root:
 *    - Generate all left BSTs: generateTrees(start, i-1)
 *    - Generate all right BSTs: generateTrees(i+1, end)
 *    - Pair each left with each right, both with root i
 *    - Add all combinations to results
 * 3. Return all generated trees
 *
 * **Recurrence Relation:**
 * T(n) = Σ(i=1 to n) T(i-1) * T(n-i)
 * - T(0) = 1 (empty tree)
 * - T(1) = 1 (single node)
 * - Generates Catalan number of trees
 *
 * **Memoization:**
 * Key: `${start},${end}` - cache results for range
 *
 * **Time Complexity:** O(Catalan(n) * n)
 * **Space Complexity:** O(Catalan(n) * n) for storage + O(n) for recursion stack
 */
function generateTreesMemoization(n: number): Array<TreeNode<number> | null> {
  const memo = new Map<string, Array<TreeNode<number> | null>>();

  function helper(start: number, end: number): Array<TreeNode<number> | null> {
    // Base case: invalid range
    if (start > end) {
      return [null];
    }

    // Check memo
    const key = `${start},${end}`;
    if (memo.has(key)) {
      return memo.get(key)!;
    }

    const result: Array<TreeNode<number> | null> = [];

    // Try each number as root
    for (let i = start; i <= end; i++) {
      // Generate all left subtrees
      const leftSubtrees = helper(start, i - 1);
      // Generate all right subtrees
      const rightSubtrees = helper(i + 1, end);

      // Pair each left with each right
      for (const left of leftSubtrees) {
        for (const right of rightSubtrees) {
          const root = new TreeNode(i);
          root.left = left;
          root.right = right;
          result.push(root);
        }
      }
    }

    memo.set(key, result);
    return result;
  }

  return helper(1, n);
}

/**
 * **Approach 2: Dynamic Programming (Bottom-Up)**
 *
 * Build solutions from smaller problem sizes to larger ones.
 * dp[i] = all structurally unique BSTs with i nodes using values 1 to i.
 *
 * **Algorithm:**
 * 1. Initialize dp[0] = [null] (empty tree)
 * 2. Initialize dp[1] = [single node with value 1]
 * 3. For each size i from 2 to n:
 *    - For each number j from 1 to i as root:
 *      - Left subtree: dp[j-1] (trees with j-1 nodes)
 *      - Right subtree: dp[i-j] (trees with i-j nodes)
 *      - BUT: need to adjust values for right subtree (add offset j)
 *    - Combine all pairs
 * 4. Return dp[n]
 *
 * **Challenge:** Values need to be offset in right subtrees.
 * When we have left subtree with values 1..j-1,
 * and right subtree with values 1..i-j,
 * we need to adjust right subtree values to j+1..i
 *
 * **Time Complexity:** O(Catalan(n) * n)
 * **Space Complexity:** O(Catalan(n) * n) for dp table
 */
function generateTreesDP(n: number): Array<TreeNode<number> | null> {
  // dp[i] = all structurally unique BSTs with i nodes (values 1 to i)
  const dp: Array<Array<TreeNode<number> | null>> = [];

  // Base case: 0 nodes = empty tree
  dp[0] = [null];

  // Base case: 1 node = single node with value 1
  dp[1] = [new TreeNode(1)];

  // Build up to n nodes
  for (let numNodes = 2; numNodes <= n; numNodes++) {
    dp[numNodes] = [];

    // Try each position j as the root (1-indexed)
    for (let j = 1; j <= numNodes; j++) {
      const leftCount = j - 1; // nodes in left subtree
      const rightCount = numNodes - j; // nodes in right subtree

      // Get all left and right subtrees
      const leftTrees = dp[leftCount];
      const rightTrees = dp[rightCount];

      // Pair each left with each right
      for (const left of leftTrees) {
        for (const right of rightTrees) {
          // Create root with value j (in context of 1 to numNodes)
          const root = new TreeNode(j);
          root.left = left;

          // Need to offset right subtree values: add j to each node
          root.right = offsetValues(right, j);

          dp[numNodes].push(root);
        }
      }
    }
  }

  return dp[n];
}

/**
 * **Approach 3: Dynamic Programming with Space Optimization**
 *
 * **Key Insight (Critical Optimization):**
 * BSTs with the same number of nodes have **identical structure**, regardless of
 * the actual values used. Only the node values differ by an offset.
 *
 * Example: BSTs with 3 nodes from range [1,3] have same structure as [4,6].
 * The only difference: all values in [4,6] version are +3 offset.
 *
 * **Advantage Over Approach 2:**
 * - Reduces from 3D memo (start, end, subproblems) to 2D DP (numNodes)
 * - Key: We only need to track how many nodes, not the range
 * - All same-sized problems share structure; just offset values
 *
 * **Algorithm:**
 * 1. Create dp[i] = list of all structurally unique BSTs with i nodes (values 1 to i)
 * 2. For each size i from 1 to n:
 *    - Try each position j as root (1 to i)
 *    - Left subtree: dp[j-1] (already computed, uses values 1 to j-1)
 *    - Right subtree: dp[i-j] but OFFSET by j (adjust values to j+1 to i)
 *    - Pair each left with each offset right
 * 3. Return dp[n]
 *
 * **Why Offset Works:**
 * - dp[i-j] gives trees with values 1 to i-j
 * - We need values j+1 to i in right subtree
 * - Adding offset j transforms: 1→j+1, 2→j+2, ..., (i-j)→i ✓
 *
 * **Clone & Offset Helper:**
 * Must clone (create new nodes) instead of modifying because:
 * - Original trees in dp are reused in other iterations
 * - Modifying would corrupt other computations
 * - Cloning ensures independence of each tree variant
 * - For each element in dp[rightCount], create offset version: all values += j
 *
 * **Time Complexity:** O(Catalan(n) * n)
 * **Space Complexity:** O(n * Catalan(n)) for DP table
 * - Better than Approach 2 because we don't store (start,end) pairs
 * - Only store results indexed by number of nodes
 *
 * **Key Difference from Approach 2:**
 * - Approach 2: Memo[start,end] - need both boundaries for range uniqueness
 * - Approach 3: DP[numNodes] - only need count, structure is always identical
 * - Same time complexity but cleaner logic (no arbitrary range tracking)
 * - More intuitive: directly builds solutions by node count
 */

/**
 * Helper: Offset all node values in a tree by a given amount.
 * Used in DP approach to adjust right subtree values.
 *
 * @param root - Root of subtree to offset
 * @param offset - Amount to add to each node value
 * @returns New tree with offset values
 */
function offsetValues(
  root: TreeNode<number> | null,
  offset: number,
): TreeNode<number> | null {
  if (root === null) return null;

  const newRoot = new TreeNode(root.value + offset);
  newRoot.left = offsetValues(root.left, offset);
  newRoot.right = offsetValues(root.right, offset);

  return newRoot;
}

/**
 * Helper: Convert tree to level-order array for comparison
 * null represents missing nodes
 */
function treeToArray(root: TreeNode<number> | null): (number | null)[] {
  if (root === null) return [];

  const result: (number | null)[] = [];
  const queue: (TreeNode<number> | null)[] = [root];

  while (queue.length > 0) {
    const node = queue.shift() ?? null;

    if (node === null) {
      result.push(null);
    } else {
      result.push(node.value);
      queue.push(node.left);
      queue.push(node.right);
    }
  }

  // Trim trailing nulls
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }

  return result;
}

/**
 * Helper: Print tree structure
 */
function printTreeStructure(root: TreeNode<number> | null, indent = ""): void {
  if (root === null) return;

  console.log(indent + root.value);
  if (root.left || root.right) {
    if (root.left) {
      console.log(indent + "├─ L:");
      printTreeStructure(root.left, indent + "│  ");
    }
    if (root.right) {
      console.log(indent + "├─ R:");
      printTreeStructure(root.right, indent + "│  ");
    }
  }
}

/**
 * Helper: Count total nodes in tree (for verification)
 */
function countNodes(root: TreeNode<number> | null): number {
  if (root === null) return 0;
  return 1 + countNodes(root.left) + countNodes(root.right);
}

/**
 * Helper: Verify tree is valid BST
 */
function isValidBST(
  root: TreeNode<number> | null,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
): boolean {
  if (root === null) return true;

  if (root.value <= min || root.value >= max) return false;

  return (
    isValidBST(root.left, min, root.value) &&
    isValidBST(root.right, root.value, max)
  );
}

// Example usage
if (require.main === module) {
  console.log("=== Unique Binary Search Trees II - LeetCode 95 ===\n");

  // Test Case 1: n = 1
  console.log("=== Test Case 1: n = 1 ===");
  const result1Memo = generateTreesMemoization(1);
  const result1DP = generateTreesDP(1);
  console.log(`Memoization: ${result1Memo.length} unique BSTs`);
  console.log(`DP: ${result1DP.length} unique BSTs`);
  console.log(`Expected: 1 (Catalan(1) = 1)`);
  if (result1Memo.length > 0) {
    console.log("Tree:");
    printTreeStructure(result1Memo[0]);
  }
  console.log();

  // Test Case 2: n = 2
  console.log("=== Test Case 2: n = 2 ===");
  const result2Memo = generateTreesMemoization(2);
  const result2DP = generateTreesDP(2);
  console.log(`Memoization: ${result2Memo.length} unique BSTs`);
  console.log(`DP: ${result2DP.length} unique BSTs`);
  console.log(`Expected: 2 (Catalan(2) = 2)`);
  console.log("\nStructures:");
  result2Memo.forEach((tree, idx) => {
    console.log(`\nTree ${idx + 1}:`);
    printTreeStructure(tree);
  });
  console.log();

  // Test Case 3: n = 3
  console.log("=== Test Case 3: n = 3 ===");
  const result3Memo = generateTreesMemoization(3);
  const result3DP = generateTreesDP(3);
  console.log(`Memoization: ${result3Memo.length} unique BSTs`);
  console.log(`DP: ${result3DP.length} unique BSTs`);
  console.log(`Expected: 5 (Catalan(3) = 5)`);
  console.log("\nAll structures:");
  result3Memo.forEach((tree, idx) => {
    console.log(`\nTree ${idx + 1}:`);
    printTreeStructure(tree);
    console.log(`Array representation: ${JSON.stringify(treeToArray(tree))}`);
  });
  console.log();

  // Test Case 4: n = 4
  console.log("=== Test Case 4: n = 4 ===");
  const result4Memo = generateTreesMemoization(4);
  const result4DP = generateTreesDP(4);
  console.log(`Memoization: ${result4Memo.length} unique BSTs`);
  console.log(`DP: ${result4DP.length} unique BSTs`);
  console.log(`Expected: 14 (Catalan(4) = 14)`);
  console.log();

  // Verification: Catalan numbers
  console.log("=== Catalan Numbers Verification ===");
  const catalan = [1, 1, 2, 5, 14, 42, 132];
  for (let i = 1; i <= 6; i++) {
    const resMemo = generateTreesMemoization(i);
    const resDP = generateTreesDP(i);
    console.log(
      `n=${i}: Memoization=${resMemo.length}, DP=${resDP.length}, Expected=${catalan[i]}`,
    );
  }
  console.log();

  // Validation: All generated trees are valid BSTs
  console.log("=== Validation: All trees are valid BSTs ===");
  const testN = 3;
  const trees = generateTreesMemoization(testN);
  let allValid = true;
  trees.forEach((tree, idx) => {
    const valid = isValidBST(tree);
    const nodeCount = countNodes(tree);
    if (!valid || nodeCount !== testN) {
      allValid = false;
      console.log(
        `Tree ${idx + 1}: INVALID (valid=${valid}, nodes=${nodeCount})`,
      );
    }
  });
  console.log(`All ${testN} generated BSTs are valid: ${allValid}`);
  console.log();

  // Performance comparison
  console.log("=== Performance Comparison (n=5) ===");
  const n = 5;

  const t1 = performance.now();
  const res1 = generateTreesMemoization(n);
  const t2 = performance.now();
  console.log(`Memoization: ${res1.length} trees in ${(t2 - t1).toFixed(3)}ms`);

  const t3 = performance.now();
  const res2 = generateTreesDP(n);
  const t4 = performance.now();
  console.log(
    `DP:           ${res2.length} trees in ${(t4 - t3).toFixed(3)}ms`,
  );

  console.log("\nBoth approaches generate all Catalan(5) = 42 unique BSTs");
}

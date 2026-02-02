/**
 * Maximum Depth of Binary Tree (LeetCode 104)
 *
 * **Problem Statement:**
 * Given the root of a binary tree, return its maximum depth.
 *
 * A binary tree's maximum depth is the number of nodes along the longest path
 * from the root node down to the farthest leaf node.
 *
 * **Definition:**
 * A leaf node is a node with no children (both left and right are null).
 *
 * **Example 1:**
 * ```
 * Input: root = [3,9,20,null,null,15,7]
 * Tree Structure:
 *       3
 *      / \
 *     9  20
 *       /  \
 *      15   7
 * Output: 3
 * Explanation: The longest path is 3 -> 20 -> 7 (3 nodes)
 * ```
 *
 * **Example 2:**
 * ```
 * Input: root = [1,null,2]
 * Tree Structure:
 *     1
 *      \
 *       2
 * Output: 2
 * Explanation: The longest path is 1 -> 2 (2 nodes)
 * ```
 *
 * **Constraints:**
 * - The number of nodes in the tree is in the range [0, 10^4]
 * - -100 <= Node.val <= 100
 *
 * **Approaches:**
 * 1. **DFS Recursion** - Direct recursive traversal
 * 2. **Tail Recursion + BFS** - Level-order with tail recursive helper
 * 3. **Iteration with Stack** - Iterative DFS using explicit stack
 *
 * **Key Insight:**
 * Maximum depth = 1 + max(maxDepth(left), maxDepth(right))
 * Base case: null node has depth 0
 *
 * See /algorithms/recursion/index.ts for comprehensive theory on:
 * - Tree traversal patterns
 * - DFS vs BFS complexity analysis
 * - Tail recursion optimization
 * - Recursion vs iteration trade-offs
 *
 * **Summary & Recommendations:**
 *
 * All three approaches return the correct maximum depth (3 for the example).
 *
 * **Approach Selection Guide:**
 * - **For balanced trees:** Use Approach 1 (DFS Recursion)
 *   - Cleanest code
 *   - Space-efficient: O(log N) call stack
 *   - Simple to understand and implement
 *   - Preferred in interviews
 *
 * - **For very deep trees:** Use Approach 3 (Iterative DFS)
 *   - Avoids stack overflow risk
 *   - Most practical for real-world deep trees (especially in Python/Java)
 *   - No recursion overhead
 *   - Similar space complexity to recursive but explicit control
 *
 * - **Avoid Approach 2 (Tail Recursion + BFS):**
 *   - For this problem, tail recursion doesn't provide benefits
 *   - BFS requires O(N) queue space in worst case
 *   - Defeats the purpose of tail recursion optimization
 *   - Educational example: shows when NOT to use tail recursion
 *   - Use this pattern only when BFS is specifically required
 *
 * **Overall Winner: Approach 1 (DFS Recursion)**
 * - Best time/space trade-off for typical trees
 * - Clearest code
 * - Most efficient for balanced/practical trees
 * - Falls back to Approach 3 only if stack overflow risk is real
 *
 * @date 24/01/2026 - 00:00:00
 */

import { TreeNode, BinaryTree } from "../../structures/tree";
import { Stack } from "../../structures/stack";
import { Queue } from "../../structures/queue";
import { timer } from "../../algorithms/utils/timer";

/**
 * **Approach 1: Depth-First Search (DFS) Recursion**
 *
 * **Intuition:**
 * By definition, the maximum depth is the number of steps to reach a leaf node.
 * We traverse the tree recursively and compute the maximum depth by taking
 * the maximum of left and right subtree depths plus 1 (current node).
 *
 * **Algorithm:**
 * 1. Base case: if node is null, return 0 (no depth)
 * 2. Recursively get max depth of left subtree
 * 3. Recursively get max depth of right subtree
 * 4. Return 1 + max(left_depth, right_depth)
 *
 * **Why it works:**
 * - Visit each node exactly once
 * - At each node, compute depth based on children's depths
 * - Postorder traversal (process children before parent)
 *
 * **Time Complexity:** O(N) - Visit each node exactly once
 * **Space Complexity:**
 * - Worst case: O(N) - Completely unbalanced tree (linear chain)
 *   - All nodes are left/right children only
 *   - Call stack depth = N
 * - Best case: O(log N) - Completely balanced tree
 *   - Call stack depth = height = log(N)
 * - Average case: O(log N) - Most practical trees
 */
function maxDepthRecursive<T>(root: TreeNode<T> | null): number {
  // Base case: null node has depth 0
  if (!root) {
    return 0;
  }

  // Recursively calculate max depth of left and right subtrees
  const leftDepth = maxDepthRecursive(root.left);
  const rightDepth = maxDepthRecursive(root.right);

  // Current depth = 1 (for current node) + max of children
  return 1 + Math.max(leftDepth, rightDepth);
}

/**
 * **Approach 2: Tail Recursion + BFS (Level-Order Traversal with Project's Queue)**
 *
 * **Intuition:**
 * Instead of computing depth from bottom-up (like Approach 1),
 * we traverse level-by-level and track the maximum level reached.
 * This demonstrates tail recursion pattern with the project's Queue structure.
 *
 * **Algorithm:**
 * 1. Use project's Queue to store (node, depth) pairs for BFS
 * 2. Process nodes level by level
 * 3. For each node, enqueue children with depth + 1
 * 4. Track maximum depth encountered
 * 5. Return maximum depth
 *
 * **Why Tail Recursion?**
 * The recursive helper function makes the recursive call as its last action,
 * which is the tail recursion pattern. However, this approach uses BFS,
 * so it doesn't reduce space complexity.
 *
 * **Why Not Optimal?**
 * Though we use tail recursion pattern, we maintain a queue with O(N)
 * nodes in worst case, defeating the purpose of tail recursion optimization.
 * This example shows tail recursion doesn't always improve efficiency.
 *
 * **Project's Queue Benefits:**
 * - FIFO guarantee: enqueue() and dequeue() both O(1)
 * - Clean API with isEmpty() for base case checking
 * - Type-safe and reusable across codebase
 * - Optimized for level-order traversals (BFS)
 *
 * **Time Complexity:** O(N) - Visit each node exactly once
 * **Space Complexity:**
 * - Queue space: O(W) where W is maximum width (nodes at same level)
 * - For complete binary tree: W = 2^(h-1) ≈ N/2 = O(N)
 * - For tail recursion call stack: O(N) in worst case
 * - Total: O(N)
 *
 * Note: This is NOT more space-efficient than DFS due to queue overhead.
 */
function maxDepthTailRecursive<T>(root: TreeNode<T> | null): number {
  // Type for queue entries: node with its depth
  type QueueEntry = { node: TreeNode<T> | null; depth: number };

  // Initialize project's Queue with root node
  const queue = new Queue<QueueEntry>();

  if (root) {
    queue.enqueue({ node: root, depth: 1 });
  }

  let maxDepth = 0;

  // Tail recursive helper function
  function helperBFS(q: Queue<QueueEntry>, currentMax: number): number {
    // Base case: queue is empty
    if (q.isEmpty()) {
      return currentMax;
    }

    // Dequeue the first element
    const entry = q.dequeue();
    if (!entry) {
      return currentMax;
    }

    const { node, depth } = entry;

    if (!node) {
      // Continue with next iteration (tail call)
      return helperBFS(q, currentMax);
    }

    // Update max depth
    const newMax = Math.max(currentMax, depth);

    // Enqueue children with incremented depth
    if (node.left) {
      q.enqueue({ node: node.left, depth: depth + 1 });
    }
    if (node.right) {
      q.enqueue({ node: node.right, depth: depth + 1 });
    }

    // Tail recursive call (last action)
    return helperBFS(q, newMax);
  }

  return helperBFS(queue, maxDepth);
}

/**
 * **Approach 3: Iterative DFS Using Project's Stack Structure**
 *
 * **Intuition:**
 * Convert recursion to iteration using the project's Stack data structure.
 * The stack mimics the function call stack behavior (FILO - First-In-Last-Out).
 *
 * **Algorithm:**
 * 1. Initialize project's Stack with (root node, depth=1)
 * 2. While stack is not empty:
 *    - Pop current node and its depth
 *    - Update maximum depth
 *    - Push child nodes with depth + 1 onto stack
 * 3. Return maximum depth
 *
 * **Why Project's Stack?**
 * - Encapsulates LIFO behavior with clean API (push, pop, peek, isEmpty)
 * - Type-safe implementation
 * - O(1) push/pop operations
 * - Reusable across the codebase
 * - Demonstrates good software design principles
 *
 * **Advantages over Recursion:**
 * - No recursion overhead or risk of stack overflow
 * - Full control over traversal order
 * - More suitable for deep trees in Python/Java
 *
 * **Time Complexity:** O(N) - Visit each node exactly once
 * **Space Complexity:**
 * - Worst case: O(N) - Completely unbalanced tree
 *   - Stack holds all nodes in linear chain
 * - Best case: O(log N) - Balanced tree
 *   - Stack holds at most height nodes at any time
 * - Average: O(log N) - Most practical trees
 *
 * This is the most practical approach for real-world use since it avoids
 * recursion overhead while maintaining DFS efficiency and using project structures.
 */
function maxDepthIterative<T>(root: TreeNode<T> | null): number {
  if (!root) {
    return 0;
  }

  // Type for stack entries: node with its depth
  type StackEntry = { node: TreeNode<T>; depth: number };

  // Initialize project's Stack with root node
  const stack = new Stack<StackEntry>();
  stack.push({ node: root, depth: 1 });

  let maxDepth = 0;

  // Iterate until stack is empty
  while (!stack.isEmpty()) {
    const { node, depth } = stack.pop()!;

    // Update maximum depth (we found a deeper node)
    maxDepth = Math.max(maxDepth, depth);

    // Push children onto stack (they'll be processed later due to LIFO)
    if (node.right) {
      stack.push({ node: node.right, depth: depth + 1 });
    }
    if (node.left) {
      stack.push({ node: node.left, depth: depth + 1 });
    }
  }

  return maxDepth;
}

// Example usage
if (require.main === module) {
  // Create test tree from array
  const testTreeArray = [3, 9, 20, null, null, 15, 7];

  // Build tree manually for demonstration
  const root = new TreeNode(3);
  root.left = new TreeNode(9);
  root.right = new TreeNode(20);
  root.right.left = new TreeNode(15);
  root.right.right = new TreeNode(7);

  console.log("Maximum Depth of Binary Tree - All Approaches\n");
  console.log("Tree: [3,9,20,null,null,15,7]");
  console.log("Structure:");
  console.log("       3");
  console.log("      / \\");
  console.log("     9  20");
  console.log("       /  \\");
  console.log("      15   7\n");

  // Approach 1: DFS Recursion
  console.log("Approach 1: DFS Recursion");
  const { result: result1, time: time1 } = timer(() => maxDepthRecursive(root));
  console.log(`Result: ${result1}, Time: ${time1}ms`);
  console.log(
    "Complexity: O(N) time, O(log N) to O(N) space depending on tree shape\n"
  );

  // Approach 2: Tail Recursion + BFS
  console.log("Approach 2: Tail Recursion + BFS");
  const { result: result2, time: time2 } = timer(() =>
    maxDepthTailRecursive(root)
  );
  console.log(`Result: ${result2}, Time: ${time2}ms`);
  console.log("Complexity: O(N) time, O(N) space (queue overhead)\n");

  // Approach 3: Iterative with Stack
  console.log("Approach 3: Iterative DFS with Stack");
  const { result: result3, time: time3 } = timer(() => maxDepthIterative(root));
  console.log(`Result: ${result3}, Time: ${time3}ms`);
  console.log(
    "Complexity: O(N) time, O(log N) to O(N) space depending on tree shape\n"
  );
}

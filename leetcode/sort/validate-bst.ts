import { MinHeap } from "../../structures/heap/min-heap";
import { TreeNode } from "../../structures/tree";

/**
 * Validate Binary Search Tree - LeetCode Problem 98
 *
 * Given the root of a binary tree, determine if it is a valid binary search tree (BST).
 *
 * A valid BST is defined as follows:
 *
 * 1. The left subtree of a node contains only nodes with keys **strictly less than**
 *    the node's key.
 * 2. The right subtree of a node contains only nodes with keys **strictly greater than**
 *    the node's key.
 * 3. Both the left and right subtrees must also be binary search trees.
 *
 * @example
 * Input: root = [2,1,3]
 * Output: true
 * Explanation:
 *     2
 *    / \
 *   1   3
 * All nodes satisfy BST properties ✅
 *
 * @example
 * Input: root = [5,1,4,null,null,3,6]
 * Output: false
 * Explanation:
 *       5
 *      / \
 *     1   4
 *        / \
 *       3   6
 * The root's value is 5, but right subtree has value 3 which is < 5 ❌
 *
 * @constraints
 * - Tree has at most 10^4 nodes
 * - -2^31 <= Node.val <= 2^31 - 1
 *
 * ## Approaches
 *
 * **Approach 1: In-order Traversal (Classic)**
 *
 * BSTs have a special property: **in-order traversal produces sorted array**.
 *
 * Algorithm:
 * 1. Perform in-order traversal (Left → Node → Right)
 * 2. Collect all values
 * 3. Check if values are strictly increasing
 *
 * Time: O(n), Space: O(n) for array
 *
 * **Approach 2: Min-Max Bounds (Optimal)**
 *
 * Pass min/max bounds at each node to validate constraints.
 *
 * Algorithm:
 * 1. At each node, check if value is within [min, max] bounds
 * 2. For left subtree: update max to current node value
 * 3. For right subtree: update min to current node value
 *
 * Time: O(n), Space: O(h) for recursion stack
 *
 * **Approach 3: Heap-based Collection**
 *
 * Use a heap to collect and validate values in sorted order.
 *
 * Algorithm:
 * 1. In-order traversal: add all values to min-heap
 * 2. Extract values from heap one by one
 * 3. Verify each extracted value is strictly greater than previous
 * 4. If any value breaks the order, BST is invalid
 *
 * Time: O(n log n) - heap operations
 * Space: O(n) - heap storage
 *
 * **Approach 4: Iterative In-order Traversal (With Stack)**
 *
 * Iterative in-order traversal using explicit stack (no recursion overhead).
 *
 * Algorithm:
 * 1. Use stack to traverse tree iteratively (Left → Node → Right)
 * 2. Collect all values during traversal
 * 3. Check if values are strictly increasing
 *
 * Time: O(n), Space: O(h) for stack (better than recursive for deep trees)
 *
 * @trade-off Heap approach demonstrates data structure usage but is slower than
 * min-max bounds approach. Use min-max or iterative approach in production.
 *
 * @date 31/01/2026
 */

/**
 * Helper function: Recursive in-order traversal to collect all node values
 *
 * In-order: Left → Node → Right produces sorted order for valid BSTs
 *
 * @param node - Current node
 * @param values - Array to collect values
 */
function inOrderTraversal(
  node: TreeNode<number> | null,
  values: number[],
): void {
  if (node === null) return;

  // Left subtree
  inOrderTraversal(node.left, values);

  // Current node
  values.push(node.value);

  // Right subtree
  inOrderTraversal(node.right, values);
}

/**
 * Helper function: Iterative in-order traversal using stack
 *
 * In-order: Left → Node → Right produces sorted order for valid BSTs
 * Uses explicit stack to avoid recursion overhead.
 *
 * @param node - Root node
 * @param values - Array to collect values
 */
function inOrderTraversalIterative(
  node: TreeNode<number> | null,
  values: number[],
): void {
  const stack: (TreeNode<number> | null)[] = [];
  let current = node;

  // Traverse using stack
  while (current !== null || stack.length > 0) {
    // Go to leftmost node
    while (current !== null) {
      stack.push(current);
      current = current.left;
    }

    // Current is null, pop from stack
    current = stack.pop() ?? null;

    if (current !== null) {
      // Process current node
      values.push(current.value);

      // Visit right subtree
      current = current.right;
    }
  }
}

/**
 * **Approach 1: In-order Traversal (Recursive, Array-based)**
 *
 * Time: O(n)
 * Space: O(n) for array + O(h) for recursion stack
 *
 * Validates BST by checking if in-order traversal produces strictly increasing sequence.
 * Uses recursive helper function.
 */
function isValidBSTInOrder(root: TreeNode<number> | null): boolean {
  const values: number[] = [];
  inOrderTraversal(root, values);

  // Check if values are strictly increasing
  for (let i = 1; i < values.length; i++) {
    if (values[i] <= values[i - 1]) {
      return false;
    }
  }

  return true;
}

/**
 * **Approach 2: Min-Max Bounds (Most Optimal)**
 *
 * Time: O(n)
 * Space: O(h) for recursion stack
 *
 * Validates BST by passing min/max bounds through recursion.
 * This is the most efficient approach.
 */
function isValidBSTBounds(
  node: TreeNode<number> | null,
  min: number = Number.NEGATIVE_INFINITY,
  max: number = Number.POSITIVE_INFINITY,
): boolean {
  // Base case: empty node is valid
  if (node === null) return true;

  // Check if current node violates bounds
  if (node.value <= min || node.value >= max) {
    return false;
  }

  // Recursively validate subtrees with updated bounds
  // Left subtree: all values must be < node.value
  const leftValid = isValidBSTBounds(node.left, min, node.value);

  // Right subtree: all values must be > node.value
  const rightValid = isValidBSTBounds(node.right, node.value, max);

  return leftValid && rightValid;
}

/**
 * **Approach 4: Iterative In-order Traversal (Array-based, With Stack)**
 *
 * Time: O(n)
 * Space: O(n) for array + O(h) for explicit stack (h = height)
 *
 * Iterative version of in-order traversal using explicit stack.
 * Avoids recursion overhead and function call stack limits.
 * Better for very deep trees.
 */
function isValidBSTIterative(root: TreeNode<number> | null): boolean {
  const values: number[] = [];
  inOrderTraversalIterative(root, values);

  // Check if values are strictly increasing
  for (let i = 1; i < values.length; i++) {
    if (values[i] <= values[i - 1]) {
      return false;
    }
  }

  return true;
}

/**
 * **Approach 3: Heap-based Level-Order Validation**
 *
 * Time: O(n log n) - heap operations
 * Space: O(n) - heap storage
 *
 * Uses a min-heap to track node values and their constraints during level-order traversal.
 *
 * Algorithm:
 * 1. Use min-heap to store (node_value, min_bound, max_bound) tuples
 * 2. Start with root: (root.value, -∞, +∞)
 * 3. For each node from heap:
 *    - Verify value is within [min, max]
 *    - Add left child with updated max = node.value
 *    - Add right child with updated min = node.value
 * 4. If any node violates bounds, BST is invalid
 */
interface HeapNode {
  value: number;
  min: number;
  max: number;
}

function isValidBSTHeap(root: TreeNode<number> | null): boolean {
  if (root === null) return true;

  // Min-heap to process nodes with their bounds
  // Ordered by node value to process in sorted order
  const heap = new MinHeap<HeapNode>((a, b) => a.value - b.value);

  // Initialize with root node and its bounds
  heap.add({
    value: root.value,
    min: Number.NEGATIVE_INFINITY,
    max: Number.POSITIVE_INFINITY,
  });

  // Collect all nodes that need to be validated
  const nodesToValidate: HeapNode[] = [];

  // Level-order traversal to collect all nodes with their bounds
  const queue: Array<{
    node: TreeNode<number> | null;
    min: number;
    max: number;
  }> = [
    {
      node: root,
      min: Number.NEGATIVE_INFINITY,
      max: Number.POSITIVE_INFINITY,
    },
  ];

  while (queue.length > 0) {
    const { node, min, max } = queue.shift() || { node: null, min: 0, max: 0 };

    if (node === null) continue;

    // Add this node to validation list
    nodesToValidate.push({ value: node.value, min, max });

    // Add children to queue with updated bounds
    if (node.left) {
      queue.push({ node: node.left, min, max: node.value });
    }
    if (node.right) {
      queue.push({ node: node.right, min: node.value, max });
    }
  }

  // Validate all nodes using heap order
  for (const heapNode of nodesToValidate) {
    heap.add(heapNode);
  }

  // Extract from heap and validate constraints
  while (heap.size() > 0) {
    const { value, min, max } = heap.poll();

    // Check if value violates bounds
    if (value <= min || value >= max) {
      return false;
    }
  }

  return true;
}

// Helper function to build tree from array (null represents missing nodes)
function buildTreeFromArray(arr: (number | null)[]): TreeNode<number> | null {
  if (arr.length === 0 || arr[0] === null) return null;

  const root = new TreeNode(arr[0]!);
  const queue: (TreeNode<number> | null)[] = [root];
  let i = 1;

  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift() ?? null;
    if (node === null) continue;

    // Add left child
    if (i < arr.length) {
      const leftChild = arr[i] !== null ? new TreeNode(arr[i]!) : null;
      if (node) node.left = leftChild;
      queue.push(leftChild);
      i++;
    }

    // Add right child
    if (i < arr.length) {
      const rightChild = arr[i] !== null ? new TreeNode(arr[i]!) : null;
      if (node) node.right = rightChild;
      queue.push(rightChild);
      i++;
    }
  }

  return root;
}

// Example usage
if (require.main === module) {
  console.log("=== Validate Binary Search Tree - LeetCode 98 ===\n");

  console.log("=== Example 1: Valid BST ===");
  const tree1 = buildTreeFromArray([2, 1, 3]);
  console.log("Tree: [2,1,3]");
  console.log("Visual:");
  console.log("    2");
  console.log("   / \\");
  console.log("  1   3");
  console.log("Heap Approach:", isValidBSTHeap(tree1)); // true
  console.log("In-Order Approach:", isValidBSTInOrder(tree1)); // true
  console.log("Bounds Approach:", isValidBSTBounds(tree1)); // true
  console.log("Iterative Approach:", isValidBSTIterative(tree1)); // true
  console.log("Expected: true ✅\n");

  console.log("=== Example 2: Invalid BST (Right subtree violation) ===");
  const tree2 = buildTreeFromArray([5, 1, 4, null, null, 3, 6]);
  console.log("Tree: [5,1,4,null,null,3,6]");
  console.log("Visual:");
  console.log("      5");
  console.log("     / \\");
  console.log("    1   4");
  console.log("       / \\");
  console.log("      3   6");
  console.log("Problem: Node 3 < 5 but in right subtree!");
  console.log("Heap Approach:", isValidBSTHeap(tree2)); // false
  console.log("In-Order Approach:", isValidBSTInOrder(tree2)); // false
  console.log("Bounds Approach:", isValidBSTBounds(tree2)); // false
  console.log("Iterative Approach:", isValidBSTIterative(tree2)); // false
  console.log("Expected: false ❌\n");

  console.log("=== Example 3: Single node ===");
  const tree3 = buildTreeFromArray([0]);
  console.log("Tree: [0]");
  console.log("Heap Approach:", isValidBSTHeap(tree3)); // true
  console.log("In-Order Approach:", isValidBSTInOrder(tree3)); // true
  console.log("Bounds Approach:", isValidBSTBounds(tree3)); // true
  console.log("Iterative Approach:", isValidBSTIterative(tree3)); // true
  console.log("Expected: true ✅\n");

  console.log("=== Example 4: Left-heavy tree ===");
  const tree4 = buildTreeFromArray([3, 1, null, null, 2]);
  console.log("Tree: [3,1,null,null,2]");
  console.log("Visual:");
  console.log("    3");
  console.log("   /");
  console.log("  1");
  console.log("   \\");
  console.log("    2");
  console.log("Heap Approach:", isValidBSTHeap(tree4)); // true
  console.log("In-Order Approach:", isValidBSTInOrder(tree4)); // true
  console.log("Bounds Approach:", isValidBSTBounds(tree4)); // true
  console.log("Iterative Approach:", isValidBSTIterative(tree4)); // true
  console.log("Expected: true ✅\n");

  console.log("=== Example 5: Edge case - Node at boundary ===");
  const tree5 = buildTreeFromArray([2147483647, 2147483647, 2147483647]);
  console.log("Tree: [2147483647,2147483647,2147483647]");
  console.log("Problem: Duplicate max values");
  console.log("Heap Approach:", isValidBSTHeap(tree5)); // false
  console.log("In-Order Approach:", isValidBSTInOrder(tree5)); // false
  console.log("Bounds Approach:", isValidBSTBounds(tree5)); // false
  console.log("Iterative Approach:", isValidBSTIterative(tree5)); // false
  console.log("Expected: false ❌\n");

  console.log("=== Performance Comparison ===\n");

  // Create a larger valid BST
  const largeValidBST = buildTreeFromArray([
    50, 25, 75, 12, 37, 62, 87, 6, 18, 31, 43, 56, 68, 81, 93,
  ]);

  // Create a larger invalid BST
  const largeInvalidBST = buildTreeFromArray([
    50,
    25,
    75,
    12,
    37,
    62,
    87,
    6,
    18,
    31,
    43,
    56,
    68,
    81,
    80, // 80 < 87 but in right subtree
  ]);

  console.log("Valid BST (15 nodes):");
  const t1 = performance.now();
  const r1 = isValidBSTHeap(largeValidBST);
  const t2 = performance.now();
  console.log(`Heap Approach: ${r1} (${(t2 - t1).toFixed(3)}ms)\n`);

  console.log("Invalid BST (15 nodes):");
  const t3 = performance.now();
  const r2 = isValidBSTHeap(largeInvalidBST);
  const t4 = performance.now();
  console.log(`Heap Approach: ${r2} (${(t4 - t3).toFixed(3)}ms)\n`);
}

/**
 * Search in a Binary Search Tree (LeetCode 700)
 *
 * **Problem Statement:**
 * You are given the root of a binary search tree (BST) and an integer val.
 * Find the node in the BST that the node's value equals val and return the
 * subtree rooted with that node. If such a node does not exist, return null.
 *
 * **Key Property of BST:**
 * - For each node: left subtree values < node value < right subtree values
 * - This allows us to eliminate half of the remaining nodes at each step
 *
 * **Example 1:**
 * ```
 * Input: root = [4,2,7,1,3], val = 2
 * Output: [2,1,3]
 * Tree:
 *        4
 *       / \
 *      2   7
 *     / \
 *    1   3
 * Searching for 2 returns subtree rooted at 2
 * ```
 *
 * **Example 2:**
 * ```
 * Input: root = [4,2,7,1,3], val = 5
 * Output: null
 * 5 does not exist in the tree
 * ```
 *
 * **Example 3:**
 * ```
 * Input: root = [1], val = 1
 * Output: [1]
 * Single node tree, value found
 * ```
 *
 * **Approaches:**
 * 1. **Recursive DFS** - Use BST property to prune search space recursively
 * 2. **Iterative** - Use a pointer to traverse the tree without recursion
 * 3. **Using Project's TreeNode** - Leverage project's tree structure
 *
 * **Constraints:**
 * - The number of nodes in the tree is in the range [1, 5000]
 * - 1 <= Node.val <= 10^7
 * - root is a valid binary search tree
 * - 1 <= val <= 10^7
 *
 * **Key Insight:**
 * Binary Search Tree enables O(log n) average search by comparison elimination.
 * See /algorithms/recursion/index.ts for Master Theorem analysis of tree traversal patterns.
 *
 * **Complexity Summary:**
 * - Best case: O(1) - Root node has the value
 * - Average case: O(log n) - Balanced BST
 * - Worst case: O(n) - Skewed tree
 * - Recursive space: O(h) where h is height (call stack)
 * - Iterative space: O(1) - Only using pointers
 *
 * @date 23/01/2026 - 00:00:00
 */

import { TreeNode, BinaryTree } from "../../structures/tree";

/**
 * **Approach 1: Recursive DFS**
 *
 * Use the BST property to eliminate branches:
 * - If target < current.val, search left subtree (target is smaller)
 * - If target > current.val, search right subtree (target is larger)
 * - If target === current.val, return current node (found!)
 *
 * **Algorithm:**
 * 1. Base case: if node is null, value not found, return null
 * 2. If node.val === val, return node (found)
 * 3. If val < node.val, recursively search left subtree
 * 4. If val > node.val, recursively search right subtree
 *
 * **Why efficient:**
 * - Each comparison eliminates half the remaining tree
 * - No need to explore irrelevant subtrees
 *
 * **Time Complexity:** O(h) - h = height (best O(log n) for balanced, worst O(n) for skewed)
 * **Space Complexity:** O(h) - Recursion call stack depth equals height
 */
function searchBSTRecursive(
  root: TreeNode<number> | null,
  val: number
): TreeNode<number> | null {
  // Base case: node not found
  if (root === null) {
    return null;
  }

  // Found the node
  if (root.value === val) {
    return root;
  }

  return val < root.value
    ? searchBSTRecursive(root.left, val)
    : searchBSTRecursive(root.right, val);
}

/**
 * **Approach 2: Iterative**
 *
 * Traverse the tree using a pointer instead of recursion.
 * Same logic as recursive: compare value and go left or right.
 *
 * **Algorithm:**
 * 1. Start with current = root
 * 2. While current is not null:
 *    a. If current.val === val, return current (found)
 *    b. If val < current.val, move to left child
 *    c. If val > current.val, move to right child
 * 3. If loop ends, value not found, return null
 *
 * **Advantage over recursive:**
 * - No call stack overhead
 * - Constant space complexity O(1)
 *
 * **Time Complexity:** O(h) - h = height (best O(log n) for balanced, worst O(n) for skewed)
 * **Space Complexity:** O(1) - Only using a pointer variable
 */
function searchBSTIterative(
  root: TreeNode<number> | null,
  val: number
): TreeNode<number> | null {
  let current = root;

  while (current !== null) {
    // Found the node
    if (current.value === val) {
      return current;
    }

    // Navigate based on BST property
    if (val < current.value) {
      current = current.left;
    } else {
      current = current.right;
    }
  }

  // Value not found
  return null;
}

/**
 * **Approach 3: Using Project's BinaryTree**
 *
 * Uses the project's BinaryTree class to build and search the tree.
 * Demonstrates composition with project data structures.
 *
 * **Algorithm:**
 * 1. Create BinaryTree instance using insert()
 * 2. Call searchBSTRecursive on the resulting tree
 * 3. Return matching subtree
 *
 * **Why this approach:**
 * - Demonstrates using project's BinaryTree structure
 * - Shows how to compose algorithms with existing data structures
 * - Builds level-order balanced trees (different from manual array approach)
 *
 * **Trade-off:**
 * - Less control over exact tree shape vs. manual creation
 * - But leverages project's optimized structure
 *
 * **Time Complexity:** O(h) - h = height (best O(log n) for balanced, worst O(n) for skewed)
 * **Space Complexity:** O(h) - Recursion call stack depth
 */
function searchBSTWithBinaryTree(
  root: TreeNode<number> | null,
  val: number
): TreeNode<number> | null {
  // Same search logic regardless of how tree was built
  return searchBSTRecursive(root, val);
}

// Helper function: Build tree from level-order array (manual node creation)
function buildBSTFromArray(arr: (number | null)[]): TreeNode<number> | null {
  if (!arr || arr.length === 0 || arr[0] === null) return null;

  const root = new TreeNode(arr[0]);
  const queue: TreeNode<number>[] = [root];
  let index = 1;

  while (queue.length > 0 && index < arr.length) {
    const node = queue.shift()!;

    // Add left child
    if (index < arr.length && arr[index] !== null) {
      node.left = new TreeNode(arr[index] as number);
      queue.push(node.left);
    }
    index++;

    // Add right child
    if (index < arr.length && arr[index] !== null) {
      node.right = new TreeNode(arr[index] as number);
      queue.push(node.right);
    }
    index++;
  }

  return root;
}

// Helper function: Build tree using BinaryTree.insert()
function buildBSTUsingBinaryTree(
  arr: (number | null)[]
): TreeNode<number> | null {
  if (!arr || arr.length === 0 || arr[0] === null) return null;

  const tree = new BinaryTree<number>();

  // Use BinaryTree.insert() for each non-null value
  for (const value of arr) {
    if (value !== null) {
      tree.insert(value);
    }
  }

  // Access root via getRoot() method
  return tree.getRoot();
}

// Helper function: Print tree for visualization
function printTree(
  root: TreeNode<number> | null,
  prefix: string = "",
  isLeft: boolean = true
): void {
  if (root === null) return;

  console.log(prefix + (isLeft ? "├── " : "└── ") + root.value);

  if (root.left !== null || root.right !== null) {
    if (root.left !== null) {
      printTree(root.left, prefix + (isLeft ? "│   " : "    "), true);
    }
    if (root.right !== null) {
      printTree(root.right, prefix + (isLeft ? "│   " : "    "), false);
    }
  }
}

// Example usage
if (require.main === module) {
  console.log("=== Search in Binary Search Tree ===\n");

  // Test Case 1: Value found in middle
  console.log("Test Case 1: Search for value in middle of tree");
  const root1 = buildBSTFromArray([4, 2, 7, 1, 3]);
  console.log("BST:");
  printTree(root1);
  console.log();

  const result1Recursive = searchBSTRecursive(root1, 2);
  console.log(
    `Recursive search for 2: ${
      result1Recursive ? result1Recursive.value : "null"
    }`
  );
  if (result1Recursive) {
    console.log("Subtree rooted at 2:");
    printTree(result1Recursive);
  }

  const root1b = buildBSTFromArray([4, 2, 7, 1, 3]);
  const result1Iterative = searchBSTIterative(root1b, 2);
  console.log(
    `Iterative search for 2: ${
      result1Iterative ? result1Iterative.value : "null"
    }`
  );

  // Test Case 2: Value not found
  console.log("\nTest Case 2: Search for value not in tree");
  const root2 = buildBSTFromArray([4, 2, 7, 1, 3]);
  const result2 = searchBSTRecursive(root2, 5);
  console.log(
    `Search for 5: ${result2 === null ? "null (not found)" : result2.value}`
  );

  // Test Case 3: Search for root value
  console.log("\nTest Case 3: Search for root value");
  const root3 = buildBSTFromArray([4, 2, 7, 1, 3]);
  const result3 = searchBSTRecursive(root3, 4);
  console.log(`Search for 4 (root): ${result3 ? result3.value : "null"}`);
  if (result3) {
    console.log("Subtree rooted at 4 (entire tree):");
    printTree(result3);
  }

  // Test Case 4: Single node
  console.log("\nTest Case 4: Single node tree");
  const root4 = buildBSTFromArray([1]);
  const result4 = searchBSTRecursive(root4, 1);
  console.log(`Search for 1: ${result4 ? result4.value : "null"}`);

  // Test Case 5: Skewed tree (like linked list)
  console.log("\nTest Case 5: Skewed BST (worst case)");
  const root5 = buildBSTFromArray([1, null, 2, null, 3, null, 4, null, 5]);
  console.log("Skewed BST:");
  printTree(root5);
  const result5 = searchBSTRecursive(root5, 5);
  console.log(
    `Search for 5: ${result5 ? result5.value : "null"} (worst case: O(n))`
  );

  // Test Case 6: Using BinaryTree approach
  console.log("\nTest Case 6: Search using BinaryTree structure");
  const root6 = buildBSTUsingBinaryTree([4, 2, 7, 1, 3]);
  console.log("BST built with BinaryTree.insert():");
  printTree(root6);
  const result6 = searchBSTWithBinaryTree(root6, 2);
  console.log(
    `Search for 2 (using BinaryTree): ${result6 ? result6.value : "null"}`
  );
  if (result6) {
    console.log("Subtree rooted at 2:");
    printTree(result6);
  }

  // Complexity analysis
  console.log("\n=== Complexity Analysis ===");
  console.log("Recursive:        Time O(h), Space O(h) - h = height");
  console.log("Iterative:        Time O(h), Space O(1) - Most efficient");
  console.log(
    "BinaryTree:       Time O(h), Space O(h) - Uses project structure"
  );
  console.log("\nBest case: O(log n) - Balanced BST");
  console.log("Worst case: O(n) - Skewed tree");

  console.log("\n=== Master Theorem Analysis (Recursive) ===");
  console.log(
    "Recurrence: T(n) = T(n/2) + O(1)  [one recursive call on half the tree]"
  );
  console.log(
    "Parameters: a=1, b=2, d=0  [1 subproblem, size n/2, constant work]"
  );
  console.log("log_b(a) = log_2(1) = 0 = d  [Case 2 of Master Theorem]");
  console.log(
    "Result: T(n) = O(n^0 * log^1(n)) = O(log n)  [for balanced BST]"
  );
  console.log("Key insight: Each comparison eliminates half the search space");
}

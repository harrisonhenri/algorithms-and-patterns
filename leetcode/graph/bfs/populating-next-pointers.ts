/**
 * Populating Next Right Pointers in Each Node (LeetCode 116)
 *
 * You are given a perfect binary tree where all leaves are on the same level,
 * and every parent has two children. Populate each next pointer to point to its
 * next right node at the same level. If there is no next right node, set to NULL.
 *
 * **Structure:**
 * ```ts
 * class Node {
 *   val: number;
 *   left: Node | null;
 *   right: Node | null;
 *   next: Node | null;  // Initially all NULL
 * }
 * ```
 *
 * **Problem:** Connect nodes horizontally at each level (next pointer points right)
 *
 * **Example:**
 * ```
 * Input:  1           Output:  1->#
 *        / \                 /  \
 *       2   3                2->3->#
 *      / \ / \              / \ / \
 *     4  5 6  7            4->5->6->7->#
 * ```
 *
 * **Approach: Level-Order BFS**
 * 1. Use queue to traverse level by level
 * 2. For each level, connect nodes using next pointers
 * 3. Track level size to know when level ends
 * 4. Time: O(n), Space: O(w) where w is max width
 *
 * **Note:** It must track nodes at each level to connect them horizontally.
 *
 * @date 21/01/2026
 */

import { Queue } from "../../../structures/queue";

interface Node {
  val: number;
  left: Node | null;
  right: Node | null;
  next: Node | null;
}

/**
 * **Approach: Level-Order BFS with Queue**
 *
 * Processes the tree level by level, connecting all nodes in each level.
 * Uses queue to manage nodes at current level and discovers next level's nodes.
 *
 * **Algorithm:**
 * 1. Initialize queue with root node
 * 2. While queue not empty:
 *    - Get current level size
 *    - Process each node in current level:
 *      - If not the last node in level, set its next pointer to the next node
 *      - Add left and right children to queue (next level)
 * 3. All nodes at each level are now connected horizontally
 *
 * **Time Complexity:** O(n) - Visit each node once
 * **Space Complexity:** O(w) - Queue stores at most w nodes (max level width)
 *
 * **Key insight:** Track current level size to know when to stop connecting nodes.
 * Last node in a level has no right sibling, so its next stays NULL.
 */
function connect(root: Node | null): Node | null {
  if (!root) return null;

  const queue = new Queue<Node>();
  queue.enqueue(root);

  while (!queue.isEmpty()) {
    // Get current level size (number of nodes at this level)
    const levelSize = queue.size();

    // Process all nodes in current level
    const levelNodes: Node[] = [];
    for (let i = 0; i < levelSize; i++) {
      const currentNode = queue.dequeue();
      if (!currentNode) continue;
      levelNodes.push(currentNode);
    }

    // Connect nodes in current level
    for (let i = 0; i < levelNodes.length - 1; i++) {
      levelNodes[i].next = levelNodes[i + 1];
    }

    // Add all children to queue (next level)
    for (const node of levelNodes) {
      if (node.left) {
        queue.enqueue(node.left);
      }
      if (node.right) {
        queue.enqueue(node.right);
      }
    }
  }

  return root;
}

/**
 * Helper function: Print tree with next pointers
 * Format: node.val->next.val or node.val-># if no next
 */
function printTreeWithNext(root: Node | null): void {
  if (!root) return;

  const queue = new Queue<Node>();
  queue.enqueue(root);

  while (!queue.isEmpty()) {
    const levelSize = queue.size();
    const levelOutput: string[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.dequeue();

      if (!node) continue;

      // Format: "val->" or "val->#" if last in level
      if (i < levelSize - 1 && node.next) {
        levelOutput.push(`${node.val}->${node.next.val}`);
      } else {
        levelOutput.push(`${node.val}->#`);
      }

      if (node.left) queue.enqueue(node.left);
      if (node.right) queue.enqueue(node.right);
    }

    console.log(levelOutput.join(" "));
  }
}

// Helper: Create a perfect binary tree
function createPerfectBinaryTree(values: number[]): Node | null {
  if (!values || values.length === 0 || values[0] === null) return null;

  const root: Node = {
    val: values[0],
    left: null,
    right: null,
    next: null,
  };

  const queue = new Queue<Node>();
  queue.enqueue(root);
  let index = 1;

  while (!queue.isEmpty() && index < values.length) {
    const currentNode = queue.dequeue();

    if (currentNode === null || currentNode === undefined) continue;

    // Add left child
    if (index < values.length && values[index] !== null) {
      const leftVal = values[index];
      currentNode.left = {
        val: leftVal as number,
        left: null,
        right: null,
        next: null,
      };
      queue.enqueue(currentNode.left);
    }
    index++;

    // Add right child
    if (index < values.length && values[index] !== null) {
      const rightVal = values[index];
      currentNode.right = {
        val: rightVal as number,
        left: null,
        right: null,
        next: null,
      };
      queue.enqueue(currentNode.right);
    }
    index++;
  }

  return root;
}

// Example usage
if (require.main === module) {
  console.log("=== Populating Next Right Pointers (BFS) ===\n");

  // Test Case 1: Perfect binary tree (7 nodes)
  console.log("Test Case 1: Perfect binary tree");
  console.log("Input:  [1,2,3,4,5,6,7] (values in level-order)\n");

  const tree1 = createPerfectBinaryTree([1, 2, 3, 4, 5, 6, 7]);
  const result1 = connect(tree1);

  console.log("After connecting next pointers:");
  printTreeWithNext(result1);
  console.log(
    "\nExpected level-order with next: 1-># / 2->3-># / 4->5->6->7->#\n"
  );

  // Test Case 2: Single node
  console.log("Test Case 2: Single node");
  console.log("Input: [1]\n");

  const tree2 = createPerfectBinaryTree([1]);
  const result2 = connect(tree2);

  console.log("After connecting next pointers:");
  printTreeWithNext(result2);
  console.log("Expected: 1->#\n");

  // Test Case 3: Two levels
  console.log("Test Case 3: Two levels");
  console.log("Input: [1,2,3]\n");

  const tree3 = createPerfectBinaryTree([1, 2, 3]);
  const result3 = connect(tree3);

  console.log("After connecting next pointers:");
  printTreeWithNext(result3);
  console.log("Expected: 1-># / 2->3->#\n");

  // Test Case 4: Four levels
  console.log("Test Case 4: Full perfect binary tree (4 levels)");
  console.log("Input: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]\n");

  const tree4 = createPerfectBinaryTree([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  ]);
  const result4 = connect(tree4);

  console.log("After connecting next pointers:");
  printTreeWithNext(result4);
  console.log(
    "\nExpected: Each level has nodes connected left to right with ->#"
  );
}

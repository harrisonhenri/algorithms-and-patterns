import { Queue } from "../queue";

/**
 * ## Binary Trees
 *
 * A binary tree is a tree where each node has at most two children nodes (left and right).
 * Tree traversal is always O(n).
 *
 * ### Characteristics of Binary Trees
 *
 * - **Complete Binary Tree:** All levels are fully filled except possibly the last, which is filled left-to-right
 * - **Perfect Binary Tree:** All internal nodes have two children and all leaves are at the same level
 * - **Balanced Binary Tree:** Height difference between left and right subtrees is at most 1
 * - **Degenerate/Skewed Tree:** Each node has at most one child (essentially a linked list)
 * - **Full Binary Tree:** Every node has either 0 or 2 children
 *
 * ### Types of Binary Trees
 *
 * - **Binary Search Tree (BST):** Left child < Parent < Right child; enables efficient searching
 * - **AVL Tree:** Self-balancing BST where height of left and right subtrees differ by at most 1
 * - **Red-Black Tree:** Self-balancing BST with color properties ensuring balance
 * - **B-Tree:** Generalization allowing multiple children per node; used in databases
 * - **Trie:** Tree for storing strings; each path represents a prefix
 *
 * **Typical use cases / strengths:**
 * - Hierarchical data (filesystems, DOM)
 * - Ordered data structures
 * - Searching and sorting (BSTs, AVL, Red-Black trees)
 * - Range queries
 *
 * **Traversal Strategies:**
 *
 * | Traversal | Type | Strategy | Typical Use Cases |
 * |-----------|------|----------|-------------------|
 * | **BFS** (Level order) | Graph/Tree Traversal | Level by level (Queue) | Shortest path, search wide |
 * | **DFS** | Graph/Tree Traversal | Deep before backtracking (Stack/Recursion) | Path finding, topological sort |
 * | **Pre-order** | Tree Traversal | Node → Left → Right | Expression trees, serialization |
 * | **In-order** | Binary Tree Traversal | Left → Node → Right | BSTs: get sorted values |
 * | **Post-order** | Tree Traversal | Left → Right → Node | Deletion, freeing memory |
 *
 * **Common Tree Traversal Use Cases:**
 * - Use pre-order traversal to explore roots before leaves
 * - Use post-order traversal to explore all leaves before any nodes
 * - Use in-order traversal to flatten the tree into its original sequence (especially for BSTs)
 *
 * **Note:** Trees are a broad family (binary trees, BSTs, B-trees, tries, etc.),
 * each optimized for different operations.
 *
 * **Interview intuition:** "Store data in order with structure"
 * @date 13/01/2026 - 00:00:00
 *
 */
export class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export class BinaryTree<T> {
  protected root: TreeNode<T> | null = null;

  insert(value: T) {
    const newNode = new TreeNode(value);

    if (!this.root) {
      this.root = newNode;
      return;
    }

    const queue = new Queue<TreeNode<T>>([this.root]);

    while (!queue.isEmpty()) {
      const currentNode = queue.dequeue();

      if (currentNode) {
        if (!currentNode.left) {
          currentNode.left = newNode;
          break;
        } else {
          queue.enqueue(currentNode.left);
        }

        if (!currentNode.right) {
          currentNode.right = newNode;
          break;
        } else {
          queue.enqueue(currentNode.right);
        }
      }
    }
  }

  traversePreOrder() {
    this.traversePreOrderHelper(this.root);
  }

  getRoot() {
    return this.root;
  }

  private traversePreOrderHelper(node: TreeNode<T> | null) {
    if (!node) return;
    console.log(node.value);
    this.traversePreOrderHelper(node.left);
    this.traversePreOrderHelper(node.right);
  }

  traverseInOrder() {
    this.traverseInOrderHelper(this.root);
  }

  private traverseInOrderHelper(node: TreeNode<T> | null) {
    if (!node) return;
    this.traverseInOrderHelper(node.left);
    console.log(node.value);
    this.traverseInOrderHelper(node.right);
  }

  traversePostOrder() {
    this.traversePostOrderHelper(this.root);
  }

  private traversePostOrderHelper(node: TreeNode<T> | null) {
    if (!node) return;
    this.traversePostOrderHelper(node.left);
    this.traversePostOrderHelper(node.right);
    console.log(node.value);
  }

  traverseLevelOrder() {
    if (!this.root) return;

    const queue = new Queue<TreeNode<T>>([this.root]);

    while (!queue.isEmpty()) {
      const currentNode = queue.dequeue();

      if (currentNode) {
        console.log(currentNode.value);

        if (currentNode.left) {
          queue.enqueue(currentNode.left);
        }

        if (currentNode.right) {
          queue.enqueue(currentNode.right);
        }
      }
    }
  }
}

const tree = new BinaryTree<number>();
tree.insert(42);
tree.insert(41);
tree.insert(50);
tree.insert(10);
tree.insert(40);
tree.insert(45);
tree.insert(75);
tree.traverseInOrder();

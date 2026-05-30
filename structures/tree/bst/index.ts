/**
 * ## Binary Search Trees (BST)
 *
 * A Binary Search Tree is an ordered tree structure where the left child is strictly less than
 * the parent node, and the right child is strictly greater. This property enables efficient
 * searching, insertion, and deletion operations.
 *
 * ### Core Property
 * For every node: `left.value < parent.value < right.value`
 *
 * ### Complexity Analysis
 *
 * | Operation | Best Case | Average | Worst Case | Notes |
 * |-----------|-----------|---------|------------|-------|
 * | **Search** | O(1) | O(lg n) | O(n) | Worst case is unbalanced tree |
 * | **Insert** | O(1) | O(lg n) | O(n) | Duplicate values ignored |
 * | **Delete** | O(1) | O(lg n) | O(n) | 3 cases: leaf, 1 child, 2 children |
 * | **Space** | — | O(n) | O(n) | Storing n nodes |
 *
 * ### Characteristics
 *
 * - **In-order traversal** produces sorted sequence: Left → Node → Right
 * - **Unbalanced risk:** If insertions are sorted, tree degenerates to linked list O(n)
 * - **Self-balancing variants:** AVL trees and Red-Black trees maintain height balance
 * - **Simple implementation:** Straightforward recursive patterns for search/insert/delete
 *
 * ### Use Cases
 *
 * - Sorted data retrieval (in-order traversal)
 * - Range queries (find all values between A and B)
 * - Priority-based systems (though heaps are often better)
 * - Database indexing (B-trees extend this concept)
 * - When consistent performance matters less than simplicity
 *
 * ### Interview Intuition
 * "Ordered binary tree — left < parent < right"
 *
 * **Note:** For systems requiring guaranteed O(lg n) operations with frequent insertions/deletions,
 * use AVL trees or Red-Black trees instead of unbalanced BSTs.
 * @date 16/12/2025 - 00:00:00
 *
 */

import { BinaryTree, TreeNode } from "..";

class BinarySearchTree<T> extends BinaryTree<T> {
  /**
   * Insert a value into the BST while maintaining the BST property.
   * Duplicate values are ignored (not inserted).
   *
   * **Time Complexity:** O(lg n) average, O(n) worst case (unbalanced tree)
   * **Space Complexity:** O(1) if not counting recursive stack
   *
   * @param value - The value to insert into the tree
   * @returns void
   */
  insert(value: T) {
    const newNode = new TreeNode(value);

    if (!this.root) {
      // If there is no root, set the new node as the root
      this.root = newNode;
    } else {
      let currentNode = this.root;

      while (true) {
        if (value < currentNode.value) {
          // Traverse the left subtree (BST property: smaller values go left)
          if (currentNode.left) {
            currentNode = currentNode.left;
          } else {
            currentNode.left = newNode;
            break;
          }
        } else if (value > currentNode.value) {
          // Traverse the right subtree (BST property: larger values go right)
          if (currentNode.right) {
            currentNode = currentNode.right;
          } else {
            currentNode.right = newNode;
            break;
          }
        } else {
          // Value already exists; skip duplicate insertion (maintain uniqueness)
          break;
        }
      }
    }
  }

  /**
   * Remove a value from the BST, maintaining the BST property.
   * Handles three deletion cases: leaf nodes, nodes with one child, and nodes with two children.
   *
   * **Time Complexity:** O(lg n) average, O(n) worst case (unbalanced tree)
   * **Space Complexity:** O(h) where h is tree height (call stack)
   *
   * @param value - The value to remove from the tree
   * @returns void
   */
  remove(value: T) {
    this.root = this.deleteRecursively(this.root, value);
  }

  /**
   * Search for a value in the BST using iterative approach.
   *
   * **Time Complexity:** O(lg n) average, O(n) worst case (unbalanced tree)
   * **Space Complexity:** O(1) — only tracking current node reference
   *
   * @param value - The value to search for
   * @returns boolean - true if value exists in tree, false otherwise
   */
  findNode(value: T) {
    let currentRoot = this.root;
    let found = false;

    while (currentRoot !== null) {
      if (currentRoot.value > value) {
        // Target is smaller, go left
        currentRoot = currentRoot.left;
      } else if (currentRoot.value < value) {
        // Target is larger, go right
        currentRoot = currentRoot.right;
      } else {
        // Node found
        found = true;
        break;
      }
    }

    return found;
  }

  /**
   * Recursively delete a value from the BST. Handles three cases:
   * 1. Leaf node (no children): simply return null
   * 2. One child: return the non-null child (bypass current node)
   * 3. Two children: replace with in-order successor (smallest value in right subtree),
   *    then recursively delete the successor
   *
   * **Time Complexity:** O(lg n) average, O(n) worst case
   * **Space Complexity:** O(h) call stack depth
   *
   * @param root - Current node being examined
   * @param value - Value to delete
   * @returns Updated subtree root (may be null if node was deleted)
   * @private
   */
  private deleteRecursively(root: TreeNode<T> | null, value: T) {
    if (!root) {
      return null; // Value not found in this branch
    }

    if (value < root.value) {
      // Recursively search left subtree
      root.left = this.deleteRecursively(root.left, value);
    } else if (value > root.value) {
      // Recursively search right subtree
      root.right = this.deleteRecursively(root.right, value);
    } else {
      // Found the node to delete — handle three cases

      // **Case 1: No children (leaf node)**
      // Simply remove by returning null
      if (!root.left && !root.right) {
        return null;
      }

      // **Case 2: One child**
      // Replace node with its child (effectively bypassing it)
      if (!root.left) {
        return root.right; // Only right child exists
      }
      if (!root.right) {
        return root.left; // Only left child exists
      }

      // **Case 3: Two children**
      // Replace with in-order successor (smallest in right subtree) to maintain BST property
      const temp = this.findMin(root.right);
      root.value = temp.value; // Copy successor value to current node
      root.right = this.deleteRecursively(root.right, temp.value); // Delete duplicate successor
    }

    return root;
  }

  /**
   * Find the node with minimum value in a subtree by traversing left.
   * Used in deletion (Case 3) to find the in-order successor.
   *
   * **Time Complexity:** O(lg n) average, O(n) worst case (unbalanced tree)
   * **Space Complexity:** O(1)
   *
   * @param root - Root of subtree to search
   * @returns The node with the minimum value in the subtree
   * @private
   */
  private findMin(root: TreeNode<T>) {
    // In-order successor is the leftmost node in right subtree
    while (root.left) {
      root = root.left;
    }
    return root;
  }
}

const tree = new BinarySearchTree<number>();
tree.insert(42);
tree.insert(41);
tree.insert(50);
tree.insert(10);
tree.insert(40);
tree.insert(45);
tree.insert(75);
tree.traverseInOrder();

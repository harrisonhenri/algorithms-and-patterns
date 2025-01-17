/**
 * Binary Search Trees. Since the left node < parent < right node the searching, insertion
 * and exclusion are done in O(lg(n)). It's worth to say that, if the BST is unbalanced the
 * search is done in O(n).
 * @date 16/12/2025 - 00:00:00
 *
 */

import { BinaryTree, TreeNode } from "..";

class BinarSearchTree<T> extends BinaryTree<T> {
  insert(value: T) {
    const newNode = new TreeNode(value);

    if (!this.root) {
      // If there is no root, set the new node as the root
      this.root = newNode;
    } else {
      let currentNode = this.root;

      while (true) {
        if (value < currentNode.value) {
          // Traverse the left subtree
          if (currentNode.left) {
            currentNode = currentNode.left;
          } else {
            currentNode.left = newNode;
            break;
          }
        } else if (value > currentNode.value) {
          // Traverse the right subtree
          if (currentNode.right) {
            currentNode = currentNode.right;
          } else {
            currentNode.right = newNode;
            break;
          }
        } else {
          // Value already exists; do nothing
          break;
        }
      }
    }
  }

  remove(value: T) {
    this.root = this.deleteRecursively(this.root, value);
  }

  findNode(value: T) {
    let currentRoot = this.root;
    let found = false;

    while (currentRoot !== null) {
      if (currentRoot.value > value) {
        currentRoot = currentRoot.left;
      } else if (currentRoot.value < value) {
        currentRoot = currentRoot.right;
      } else {
        // Node found
        found = true;
        break;
      }
    }

    return found;
  }

  private deleteRecursively(root: TreeNode<T> | null, value: T) {
    if (!root) {
      return null; // Value not found
    }

    if (value < root.value) {
      root.left = this.deleteRecursively(root.left, value); // Search in left subtree
    } else if (value > root.value) {
      root.right = this.deleteRecursively(root.right, value); // Search in right subtree
    } else {
      // Found the node to delete
      // Case 1: No children (leaf node)
      if (!root.left && !root.right) {
        return null;
      }

      // Case 2: One child
      if (!root.left) {
        return root.right; // Only right child
      }
      if (!root.right) {
        return root.left; // Only left child
      }

      // Case 3: Two children
      const temp = this.findMin(root.right);
      root.value = temp.value; // Replace value with the minimum value in the right subtree
      root.right = this.deleteRecursively(root.right, temp.value); // Remove the duplicate node
    }

    return root;
  }

  private findMin(root: TreeNode<T>) {
    while (root.left) {
      root = root.left;
    }
    return root;
  }
}

const tree = new BinarSearchTree<number>();
tree.insert(42);
tree.insert(41);
tree.insert(50);
tree.insert(10);
tree.insert(40);
tree.insert(45);
tree.insert(75);
tree.traverseInOrder();

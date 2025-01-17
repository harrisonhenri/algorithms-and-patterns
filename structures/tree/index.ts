/**
 * Binary tree is a tree where each node has only two children nodes. The tree
 * traversal is always O(n).
 * Use pre-order traversal to explore roots before leaves.
 * Use post-order traversal to explore all leaves before any nodes.
 * Use in-order traversal to flatten the tree into its original sequence.
 * @date 16/12/2025 - 00:00:00
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

    const queue: Array<TreeNode<T>> = [this.root];

    while (queue.length > 0) {
      const currentNode = queue.shift();

      if (currentNode) {
        if (!currentNode.left) {
          currentNode.left = newNode;
          break;
        } else {
          queue.push(currentNode.left);
        }

        if (!currentNode.right) {
          currentNode.right = newNode;
          break;
        } else {
          queue.push(currentNode.right);
        }
      }
    }
  }

  traversePreOrder() {
    this.traversePreOrderHelper(this.root);
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

    const queue: Array<TreeNode<T>> = [this.root];

    while (queue.length > 0) {
      const currentNode = queue.shift();

      if (currentNode) {
        console.log(currentNode.value);

        if (currentNode.left) {
          queue.push(currentNode.left);
        }

        if (currentNode.right) {
          queue.push(currentNode.right);
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

/**
 * AVL tree is a BST that is self-balanced.
 * @date 17/12/2025 - 00:00:00
 *
 */
class AVLTree {
  private left: AVLTree | null = null;
  private right: AVLTree | null = null;
  private value: number;
  private depth = 1;

  constructor(value: number) {
    this.value = value;
  }

  setDepthBasedOnChildren() {
    if (this.left === null && this.right === null) {
      this.depth = 1;
    }

    if (this.left !== null) {
      this.depth = this.left.depth + 1;
    }
    if (this.right !== null && this.depth <= this.right.depth) {
      this.depth = this.right.depth + 1;
    }
  }

  rotateLL() {
    const valueBefore = this.value;
    const rightBefore = this.right;

    this.value = this.left!.value;
    this.right = this.left!;
    this.left = this.left!.left;
    this.right.left = this.right.right;
    this.right.right = rightBefore;
    this.right.value = valueBefore;

    this.right.setDepthBasedOnChildren();
    this.setDepthBasedOnChildren();
  }

  rotateRR() {
    const valueBefore = this.value;
    const leftBefore = this.left;

    this.value = this.right!.value;
    this.left = this.right!;
    this.right = this.right!.right;
    this.left.right = this.left.left;
    this.left.left = leftBefore;
    this.left.value = valueBefore;

    this.left.setDepthBasedOnChildren();
    this.setDepthBasedOnChildren();
  }

  private balance() {
    const ldepth = this.left === null ? 0 : this.left.depth;
    const rdepth = this.right === null ? 0 : this.right.depth;

    if (ldepth > rdepth + 1) {
      const lldepth = this.left!.left === null ? 0 : this.left!.left.depth;
      const lrdepth = this.left!.right === null ? 0 : this.left!.right.depth;

      if (lldepth < lrdepth) {
        this.left!.rotateRR();
      }
      this.rotateLL();
    } else if (ldepth + 1 < rdepth) {
      const rrdepth = this.right!.right === null ? 0 : this.right!.right.depth;
      const rldepth = this.right!.left === null ? 0 : this.right!.left.depth;

      if (rldepth > rrdepth) {
        this.right!.rotateLL();
      }
      this.rotateRR();
    }
  }

  insert(value: number): boolean {
    let childInserted = false;

    if (value === this.value) {
      return false; // all unique
    } else if (value < this.value) {
      if (this.left === null) {
        this.left = new AVLTree(value);
        childInserted = true;
      } else {
        childInserted = this.left.insert(value);
        if (childInserted) this.balance();
      }
    } else if (value > this.value) {
      if (this.right === null) {
        this.right = new AVLTree(value);
        childInserted = true;
      } else {
        childInserted = this.right.insert(value);
        if (childInserted) this.balance();
      }
    }

    if (childInserted) this.setDepthBasedOnChildren();
    return childInserted;
  }

  remove(value: number): boolean {
    const deleteRecursively = (
      root: AVLTree | null,
      value: number
    ): AVLTree | null => {
      if (!root) {
        return null;
      } else if (value < root.value) {
        root.left = deleteRecursively(root.left, value);
      } else if (value > root.value) {
        root.right = deleteRecursively(root.right, value);
      } else {
        if (!root.left && !root.right) {
          return null; // case 1
        } else if (!root.left) {
          return root.right;
        } else if (!root.right) {
          return root.left;
        } else {
          const temp = findMin(root.right);
          root.value = temp.value;
          root.right = deleteRecursively(root.right, temp.value);
        }
      }

      root.setDepthBasedOnChildren();
      return root;
    };

    const findMin = (root: AVLTree): AVLTree => {
      while (root.left) root = root.left;
      return root;
    };

    const result = deleteRecursively(this, value);
    return result !== null;
  }
}

const avlTree = new AVLTree(1);
avlTree.insert(2);
avlTree.insert(3);
avlTree.insert(4);
avlTree.insert(5);
avlTree.insert(123);
avlTree.insert(203);
avlTree.insert(2222);

console.log(avlTree);

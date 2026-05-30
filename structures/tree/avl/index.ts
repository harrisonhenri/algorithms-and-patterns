/**
 * ## AVL Trees (Adelson-Velsky and Landis)
 *
 * An AVL tree is a self-balancing Binary Search Tree where the heights of left and right
 * subtrees differ by at most 1 (balance factor). This guarantees O(lg n) performance for all
 * operations, even in worst-case scenarios.
 *
 * ### Core Concepts
 *
 * **Balance Factor:** `height(left) - height(right)` must be in [-1, 0, 1]
 * - **-1:** Right subtree is taller
 * - **0:** Both subtrees are equal height
 * - **1:** Left subtree is taller
 *
 * **Key invariant:** After every insertion/deletion, rebalance if factor exceeds [-1, 1]
 *
 * ### Four Rotation Types
 *
 * When balance factor violates the [-1, 1] constraint, perform rotations:
 *
 * | Case | Condition | Solution | When |
 * |------|-----------|----------|------|
 * | **LL** | Left-left imbalance | Single right rotation | Left child is heavy, its left is heavier |
 * | **LR** | Left-right imbalance | Left rotate on left child, then right rotate | Left child is heavy, its right is heavier |
 * | **RR** | Right-right imbalance | Single left rotation | Right child is heavy, its right is heavier |
 * | **RL** | Right-left imbalance | Right rotate on right child, then left rotate | Right child is heavy, its left is heavier |
 *
 * ### Complexity Analysis
 *
 * | Operation | Complexity | Notes |
 * |-----------|------------|-------|
 * | **Search** | O(lg n) | Guaranteed balanced |
 * | **Insert** | O(lg n) | Includes rebalancing |
 * | **Delete** | O(lg n) | Includes rebalancing |
 * | **Space** | O(n) | Stores n nodes |
 *
 * ### Characteristics
 *
 * - **Guaranteed balance:** Height is always O(lg n)
 * - **Higher insertion/deletion cost:** Rotations and depth recalculation overhead
 * - **Perfect for read-heavy systems:** With frequent insertions/deletions
 * - **More complex than BST:** But predictable performance
 *
 * ### Use Cases
 *
 * - Database indexing (when consistent O(lg n) is critical)
 * - In-memory search structures with frequent updates
 * - File systems and memory allocation
 * - Compared to Red-Black trees: AVL stricter balance (more rotations, deeper trees)
 *
 * ### Interview Intuition
 * "Balanced BST with height difference ≤ 1; rotations keep it balanced"
 *
 * **Note:** Red-Black trees are often preferred in practice due to fewer rotations,
 * though AVL guarantees tighter height bounds.
 * @date 17/12/2025 - 00:00:00
 *
 */
class AVLTree {
  /** Left child node reference */
  private left: AVLTree | null = null;

  /** Right child node reference */
  private right: AVLTree | null = null;

  /** The numeric value stored in this node */
  private value: number;

  /** Height of subtree rooted at this node; used for balance factor calculation */
  private depth = 1;

  /**
   * Create a new AVL tree node with the given value.
   *
   * @param value - The numeric value to store in this node
   * @returns AVLTree instance with initialized properties
   */
  constructor(value: number) {
    this.value = value;
  }

  /**
   * Recalculate the depth (height) of this subtree based on children's depths.
   * Depth = 1 + max(left.depth, right.depth).
   * Called after rotations and insertions to maintain accurate balance factors.
   *
   * **Time Complexity:** O(1)
   * **Space Complexity:** O(1)
   *
   * @returns void
   */
  setDepthBasedOnChildren() {
    // Leaf node: depth is 1
    if (this.left === null && this.right === null) {
      this.depth = 1;
      return;
    }

    // Depth is 1 + the maximum depth of children
    this.depth = 1;
    if (this.left !== null) {
      this.depth = Math.max(this.depth, this.left.depth + 1);
    }
    if (this.right !== null) {
      this.depth = Math.max(this.depth, this.right.depth + 1);
    }
  }

  /**
   * Perform a Left-Left (LL) rotation to rebalance when the left child is heavy
   * and its left subtree is even heavier.
   *
   * **Visual Example:**
   *        A (current)           B (left child)
   *       /                     / \
   *      B        ==>          C   A
   *     /                         / \
   *    C                       null  right
   *
   * **Time Complexity:** O(1) + depth recalculation
   * **Triggered by:** balance() when left depth > right depth + 1 AND left.left is heavier
   *
   * @returns void
   */
  rotateLL() {
    const valueBefore = this.value;
    const rightBefore = this.right;

    // Move left child's value to current node
    this.value = this.left!.value;
    // Move left child to right position
    this.right = this.left!;
    // Move left child's left subtree to become new left
    this.left = this.left!.left;
    // Fix the new right child: move its right child to left
    this.right.left = this.right.right;
    // Attach old right to new right's right
    this.right.right = rightBefore;
    // Move old value to new right child
    this.right.value = valueBefore;

    // Update depths after rotation
    this.right.setDepthBasedOnChildren();
    this.setDepthBasedOnChildren();
  }

  /**
   * Perform a Right-Right (RR) rotation to rebalance when the right child is heavy
   * and its right subtree is even heavier.
   *
   * **Visual Example:**
   *      A (current)           B (right child)
   *       \                   / \
   *        B       ==>       A   C
   *         \               / \
   *          C           left   null
   *
   * **Time Complexity:** O(1) + depth recalculation
   * **Triggered by:** balance() when right depth > left depth + 1 AND right.right is heavier
   *
   * @returns void
   */
  rotateRR() {
    const valueBefore = this.value;
    const leftBefore = this.left;

    // Move right child's value to current node
    this.value = this.right!.value;
    // Move right child to left position
    this.left = this.right!;
    // Move right child's right subtree to become new right
    this.right = this.right!.right;
    // Fix the new left child: move its left child to right
    this.left.right = this.left.left;
    // Attach old left to new left's left
    this.left.left = leftBefore;
    // Move old value to new left child
    this.left.value = valueBefore;

    // Update depths after rotation
    this.left.setDepthBasedOnChildren();
    this.setDepthBasedOnChildren();
  }

  /**
   * Check balance factor and perform necessary rotations to restore AVL property.
   * Called after insert/delete when children subtrees have changed.
   *
   * **Balance Factor Rules:**
   * - If left depth > right depth + 1: left-heavy (needs LL or LR rotation)
   * - If right depth > left depth + 1: right-heavy (needs RR or RL rotation)
   * - Otherwise: balanced, no action needed
   *
   * **Two-stage rotations (LR, RL):**
   * - LR: Left child is heavy, but its RIGHT is heavier (zig-zag) → Rotate left child RR first, then LL
   * - RL: Right child is heavy, but its LEFT is heavier (zig-zag) → Rotate right child LL first, then RR
   *
   * **Time Complexity:** O(1) — at most 2 rotations
   * **Space Complexity:** O(1)
   *
   * @returns void
   * @private
   */
  private balance() {
    // Calculate balance factor
    const ldepth = this.left === null ? 0 : this.left.depth;
    const rdepth = this.right === null ? 0 : this.right.depth;

    // **LEFT-HEAVY CASE:** Left subtree is taller
    if (ldepth > rdepth + 1) {
      const lldepth = this.left!.left === null ? 0 : this.left!.left.depth;
      const lrdepth = this.left!.right === null ? 0 : this.left!.right.depth;

      // Check if it's LR case (left child's right is heavier)
      // Two-step: RR on left child first, then LL on self
      if (lldepth < lrdepth) {
        this.left!.rotateRR();
      }
      // Perform LL rotation (single or after LR prep)
      this.rotateLL();
    }
    // **RIGHT-HEAVY CASE:** Right subtree is taller
    else if (ldepth + 1 < rdepth) {
      const rrdepth = this.right!.right === null ? 0 : this.right!.right.depth;
      const rldepth = this.right!.left === null ? 0 : this.right!.left.depth;

      // Check if it's RL case (right child's left is heavier)
      // Two-step: LL on right child first, then RR on self
      if (rldepth > rrdepth) {
        this.right!.rotateLL();
      }
      // Perform RR rotation (single or after RL prep)
      this.rotateRR();
    }
    // Otherwise, balanced — no rotations needed
  }

  /**
   * Insert a unique value into the AVL tree, maintaining BST property and rebalancing.
   * Duplicates are rejected. After insertion, rebalance this subtree if needed.
   *
   * **Time Complexity:** O(lg n) — tree height is always lg n
   * **Space Complexity:** O(lg n) — recursive call stack
   *
   * @param value - The value to insert (must be unique)
   * @returns boolean - true if insertion succeeded, false if value already exists
   */
  insert(value: number): boolean {
    let childInserted = false;

    if (value === this.value) {
      // Maintain uniqueness
      return false;
    } else if (value < this.value) {
      // Insert in left subtree
      if (this.left === null) {
        this.left = new AVLTree(value);
        childInserted = true;
      } else {
        childInserted = this.left.insert(value);
        // If child inserted successfully, rebalance this node
        if (childInserted) this.balance();
      }
    } else if (value > this.value) {
      // Insert in right subtree
      if (this.right === null) {
        this.right = new AVLTree(value);
        childInserted = true;
      } else {
        childInserted = this.right.insert(value);
        // If child inserted successfully, rebalance this node
        if (childInserted) this.balance();
      }
    }

    // Update depth after successful insertions
    if (childInserted) this.setDepthBasedOnChildren();
    return childInserted;
  }

  /**
   * Remove a value from the AVL tree, maintaining BST property and rebalancing.
   * Handles three deletion cases: leaf nodes, nodes with one child, nodes with two children.
   * After deletion, rebalance this subtree if needed.
   *
   * **Time Complexity:** O(lg n) — tree height is always lg n
   * **Space Complexity:** O(lg n) — recursive call stack
   *
   * @param value - The value to remove
   * @returns boolean - true if deletion succeeded, false if value not found
   */
  remove(value: number): boolean {
    /**
     * **Case 1: Leaf node (no children)** → Remove by returning null
     * **Case 2: One child** → Return the non-null child (bypass current node)
     * **Case 3: Two children** → Replace with in-order successor (min of right subtree),
     *           then recursively delete the successor
     */
    const deleteRecursively = (
      root: AVLTree | null,
      value: number
    ): AVLTree | null => {
      if (!root) {
        return null; // Value not found
      } else if (value < root.value) {
        // Recursively search left subtree
        root.left = deleteRecursively(root.left, value);
      } else if (value > root.value) {
        // Recursively search right subtree
        root.right = deleteRecursively(root.right, value);
      } else {
        // Found the node to delete — handle three cases
        if (!root.left && !root.right) {
          return null; // **Case 1: Leaf node**
        } else if (!root.left) {
          return root.right; // **Case 2: Only right child**
        } else if (!root.right) {
          return root.left; // **Case 2: Only left child**
        } else {
          // **Case 3: Two children**
          // Replace with in-order successor (smallest in right subtree)
          const temp = findMin(root.right);
          root.value = temp.value;
          // Recursively delete the successor node
          root.right = deleteRecursively(root.right, temp.value);
        }
      }

      // Rebalance and update depth after deletion
      if (root) {
        root.balance();
        root.setDepthBasedOnChildren();
      }
      return root;
    };

    /**
     * Helper: Find the minimum value node by traversing left.
     * Used to find in-order successor in deletion Case 3.
     */
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

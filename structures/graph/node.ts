/**
 * GraphNode - Generic node for graph representation
 *
 * Represents a vertex in an undirected or directed graph where each node
 * contains a value and maintains references to its neighbors.
 *
 * **Typical use cases:**
 * - Graph traversal problems (DFS, BFS)
 * - Graph cloning
 * - Adjacency list representation
 * - Network and relationship modeling
 *
 * **Time Complexity:**
 * - Node creation: O(1)
 * - Adding neighbor: O(1)
 *
 * **Interview intuition:** "Node with neighbor references for graph operations"
 * @date 15/01/2026 - 00:00:00
 */

export class GraphNode<T> {
  val: T;
  neighbors: GraphNode<T>[];

  constructor(val: T, neighbors: GraphNode<T>[] = []) {
    this.val = val;
    this.neighbors = neighbors;
  }

  /**
   * Add a neighbor to this node
   */
  addNeighbor(neighbor: GraphNode<T>): void {
    this.neighbors.push(neighbor);
  }

  /**
   * Remove a neighbor from this node
   */
  removeNeighbor(neighbor: GraphNode<T>): void {
    const index = this.neighbors.indexOf(neighbor);
    if (index > -1) {
      this.neighbors.splice(index, 1);
    }
  }

  /**
   * Get all neighbors
   */
  getNeighbors(): GraphNode<T>[] {
    return this.neighbors;
  }

  /**
   * Check if a node is a neighbor
   */
  isNeighbor(node: GraphNode<T>): boolean {
    return this.neighbors.includes(node);
  }
}

import { Stack } from "../../../structures/stack";
import { timer } from "../../utils/timer";

/**
 * Depth-First Search (DFS) traversal on a graph, with optional distance tracking.
 *
 * **Time Complexity:**
 * - O(V + E) when used for standard traversal (visit each vertex and edge once)
 * - O((V - 1)!) in the worst case when enumerating *all possible simple paths*
 *   between two vertices in a complete graph
 *
 * **Space Complexity:**
 * - O(V) for standard DFS (stack + visited set)
 * - O(V²) for recursion stack when enumerating all paths (depth × state per level)
 * - O((V-1)! × V) to store all enumerated paths in the result
 *
 * **Typical use cases:**
 * - Graph traversal
 * - Connected components detection
 * - Cycle detection
 * - Topological sorting (DAGs)
 * - Path existence checking
 * - Enumerating all simple paths (with backtracking)
 *
 * **How it works:**
 * 1. Starts from a source (root) vertex
 * 2. Explores as deep as possible along each branch before backtracking
 * 3. Uses a stack (explicit or recursive) following LIFO order
 * 4. Tracks visited vertices to prevent revisiting nodes in the same path
 * 5. Optionally accumulates distance or path information from the source
 *
 * **Notes:**
 * - When used only for traversal, DFS is linear in the size of the graph
 * - When used to find all paths, complexity grows factorially due to
 *   combinatorial explosion in dense graphs
 */
/**
 * Depth-First Search (DFS) traversal on an adjacency matrix graph.
 *
 * **Key DFS Invariants:**
 * 1. For each popped node, **ALL** unvisited neighbors are explored
 * 2. Visited marking happens **when pushing**, preventing duplicates
 * 3. Stack maintains the path during exploration
 * 4. Backtracking is implicit via stack operations
 *
 * **Note on Distance:**
 * Despite using DFS (stack-based), this implementation computes shortest paths
 * by incrementing distance uniformly (+1 per edge). The distance represents
 * the minimum number of edges from root, not depth in traversal order.
 * This works correctly because each edge contributes equally (unweighted graph).
 *
 * @param adjacencyMatrix 2D array where matrix[i][j] = 1 means edge i→j
 * @returns Distance map (shortest path distance) from root node
 */
const dfs = (adjacencyMatrix: number[][]): { [key: number]: number } => {
  const n = adjacencyMatrix.length;
  const rootNode = 0;

  // Initialize distances
  const nodeDistance: { [key: number]: number } = {};
  for (let i = 0; i < n; i++) {
    nodeDistance[i] = Infinity;
  }
  nodeDistance[rootNode] = 0;

  const stack = new Stack<number>();
  stack.push(rootNode);

  const visited = new Set<number>([rootNode]);

  // DFS: Explore depth-first using explicit stack
  while (!stack.isEmpty()) {
    const currentNode = stack.pop();

    if (currentNode === undefined) continue;

    // **Process ALL neighbors of current node - directly from matrix**
    for (let neighbor = 0; neighbor < n; neighbor++) {
      if (
        adjacencyMatrix[currentNode][neighbor] === 1 &&
        !visited.has(neighbor)
      ) {
        visited.add(neighbor); // Mark visited **when pushing**
        nodeDistance[neighbor] = nodeDistance[currentNode] + 1;
        stack.push(neighbor);
      }
    }
  }

  return nodeDistance;
};

if (require.main === module) {
  console.log(
    timer(() =>
      dfs([
        [0, 1, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 1, 1],
        [0, 1, 1, 0, 0],
        [0, 0, 1, 0, 0],
      ]),
    ),
  );
}

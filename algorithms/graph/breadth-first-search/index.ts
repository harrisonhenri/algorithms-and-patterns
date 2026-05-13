import { Queue } from "../../../structures/queue";
import { timer } from "../../utils/timer";

/**
 * Breadth-First Search (BFS) traversal on a graph, with optional distance tracking.
 *
 * **Time Complexity:**
 * - O(V + E) - Visit each vertex and edge exactly once
 *
 * **Space Complexity:**
 * - O(V) for the queue and visited set
 *
 * **Typical use cases:**
 * - Graph traversal
 * - Shortest path in unweighted graphs
 * - Connected components detection
 * - Level-order traversal in trees
 * - Finding all nodes at a given distance
 * - Bipartite graph detection
 *
 * **How it works:**
 * 1. Starts from a source (root) vertex
 * 2. Explores all neighbors at the current depth before moving deeper
 * 3. Uses a queue (FIFO) to maintain the traversal order
 * 4. Tracks visited vertices to prevent revisiting nodes
 * 5. Accumulates distance information from the source
 *
 * **Key difference from DFS:**
 * - DFS uses a stack (explores deeply first)
 * - BFS uses a queue (explores breadthwise first)
 * - BFS finds shortest path in unweighted graphs
 */
/**
 * Breadth-First Search (BFS) traversal on an adjacency matrix graph.
 *
 * **Key BFS Invariants:**
 * 1. For each dequeued node, **ALL** unvisited neighbors are processed
 * 2. Visited marking happens **when enqueueing**, preventing duplicates
 * 3. Queue represents the entire frontier at each level
 * 4. Distances are correct because nodes are discovered level-by-level
 *
 * @param adjacencyMatrix 2D array where matrix[i][j] = 1 means edge i→j
 * @returns Distance map from root node to all reachable nodes
 */
const bfs = (adjacencyMatrix: number[][]): { [key: number]: number } => {
  const n = adjacencyMatrix.length;
  const rootNode = 0;

  // Initialize distances
  const nodeDistance: { [key: number]: number } = {};
  for (let i = 0; i < n; i++) {
    nodeDistance[i] = Infinity;
  }
  nodeDistance[rootNode] = 0;

  const queue = new Queue<number>();
  queue.enqueue(rootNode);

  const visited = new Set<number>([rootNode]);

  // BFS: Process frontier level by level
  while (!queue.isEmpty()) {
    const currentNode = queue.dequeue();

    if (currentNode === undefined) continue;

    // **Process ALL neighbors of current node - directly from matrix**
    for (let neighbor = 0; neighbor < n; neighbor++) {
      if (
        adjacencyMatrix[currentNode][neighbor] === 1 &&
        !visited.has(neighbor)
      ) {
        visited.add(neighbor); // Mark visited **when enqueueing**
        nodeDistance[neighbor] = nodeDistance[currentNode] + 1;
        queue.enqueue(neighbor);
      }
    }
  }

  return nodeDistance;
};

if (require.main === module) {
  console.log(
    timer(() =>
      bfs([
        [0, 1, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 1, 1],
        [0, 1, 1, 0, 0],
        [0, 0, 1, 0, 0],
      ])
    )
  );
}

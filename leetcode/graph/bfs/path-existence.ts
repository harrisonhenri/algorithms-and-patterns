/**
 * Determines whether there exists a valid path between two vertices
 * in a bi-directional (undirected) graph using BFS.
 *
 * The graph contains `n` vertices labeled from `0` to `n - 1`.
 * Edges are given as pairs `[u, v]`, indicating an undirected edge
 * between vertices `u` and `v`. There are no self-loops and at most
 * one edge between any pair of vertices.
 *
 * **Problem:** Given `n`, `edges`, `source`, and `destination`, determine
 * if there is a valid path from `source` to `destination`.
 *
 * **Example:**
 * ```ts
 * const n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2
 * validPath(n, edges, source, destination) // true
 * ```
 *
 * **Approach: BFS (Breadth-First Search)**
 * - Explores graph level-by-level from source
 * - Finds shortest path in unweighted graphs
 * - Time: O(V + E), Space: O(V)
 *
 * @date 20/01/2026
 */

import { Queue } from "../../../structures/queue";
import { buildAdjacencyList } from "../../../algorithms/utils/build-adjacency-list";

/**
 * **Approach: BFS (Breadth-First Search)**
 *
 * **Time Complexity:** O(V + E) - Visit each vertex and edge once
 * **Space Complexity:** O(V) - Queue + adjacency list + visited set
 *
 * **Algorithm:**
 * 1. Build adjacency list from edges
 * 2. Use queue to explore graph level-by-level from source
 * 3. Mark vertices as visited when enqueueing (prevents duplicates)
 * 4. Return true if destination is reached
 *
 * **Advantages:**
 * - Finds shortest path in unweighted graphs
 * - Often faster in practice for connected vertices
 * - More natural for level-by-level exploration
 * - Early termination when destination found
 */
function validPath(
  n: number,
  edges: number[][],
  source: number,
  destination: number
): boolean {
  if (source === destination) return true;

  // Build adjacency list
  const adjacencyList = buildAdjacencyList(n, edges);

  // BFS with queue
  const queue = new Queue<number>();
  queue.enqueue(source);

  const visited: Set<number> = new Set([source]);

  while (!queue.isEmpty()) {
    const node = queue.dequeue();

    if (node === undefined) continue;

    if (node === destination) {
      return true;
    }

    for (const neighbor of adjacencyList.get(node) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.enqueue(neighbor);
      }
    }
  }

  return false;
}

// Example usage
if (require.main === module) {
  console.log("=== Path Existence using BFS ===\n");

  // Test Case 1: Path exists (simple triangle)
  const n1 = 3;
  const edges1 = [
    [0, 1],
    [1, 2],
    [2, 0],
  ];
  const source1 = 0;
  const destination1 = 2;

  console.log("Test Case 1: Path exists");
  console.log(`n = ${n1}, edges = ${JSON.stringify(edges1)}`);
  console.log(`source = ${source1}, destination = ${destination1}`);
  console.log(`Result: ${validPath(n1, edges1, source1, destination1)}`);
  console.log(`Expected: true\n`);

  // Test Case 2: No path (disconnected components)
  const n2 = 6;
  const edges2 = [
    [0, 1],
    [0, 2],
    [3, 5],
    [5, 4],
    [4, 3],
  ];
  const source2 = 0;
  const destination2 = 5;

  console.log("Test Case 2: No path (disconnected)");
  console.log(`n = ${n2}, edges = ${JSON.stringify(edges2)}`);
  console.log(`source = ${source2}, destination = ${destination2}`);
  console.log(`Result: ${validPath(n2, edges2, source2, destination2)}`);
  console.log(`Expected: false\n`);

  // Test Case 3: Source equals destination
  const n3 = 2;
  const edges3 = [[0, 1]];
  const source3 = 1;
  const destination3 = 1;

  console.log("Test Case 3: Source equals destination");
  console.log(`n = ${n3}, edges = ${JSON.stringify(edges3)}`);
  console.log(`source = ${source3}, destination = ${destination3}`);
  console.log(`Result: ${validPath(n3, edges3, source3, destination3)}`);
  console.log(`Expected: true\n`);

  // Test Case 4: Long path
  const n4 = 5;
  const edges4 = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
  ];
  const source4 = 0;
  const destination4 = 4;

  console.log("Test Case 4: Long path (linear)");
  console.log(`n = ${n4}, edges = ${JSON.stringify(edges4)}`);
  console.log(`source = ${source4}, destination = ${destination4}`);
  console.log(`Result: ${validPath(n4, edges4, source4, destination4)}`);
  console.log(`Expected: true\n`);
}

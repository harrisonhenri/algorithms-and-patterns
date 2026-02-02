import { MinHeap } from "../../../structures/heap/min-heap";

/**
 * Dijkstra's Algorithm - Finds shortest paths from a source vertex to all other vertices.
 *
 * Uses a greedy approach with a priority queue (MinHeap) to efficiently explore
 * the nearest unvisited vertex at each step. Works with non-negative edge weights.
 *
 * **Time Complexity:** O((V + E) log V) with MinHeap priority queue
 * - V extractions from heap: O(V log V)
 * - E edge relaxations: O(E log V)
 *
 * **Space Complexity:** O(V + E)
 * - Distance array: O(V)
 * - Heap: O(V)
 * - Graph adjacency list: O(V + E)
 *
 * **Key Characteristics:**
 * - Greedy algorithm: Always selects minimum distance unvisited vertex
 * - Works only with non-negative weights (negative weights require Bellman-Ford)
 * - Maintains distance and parent arrays for path reconstruction
 * - Optimal substructure: Shortest path contains shortest subpaths
 *
 * @date 18/01/2026
 */

export interface Edge {
  node: number;
  weight: number;
}

export interface HeapNode {
  distance: number;
  vertex: number;
}

/**
 * Finds shortest paths from source to all vertices using Dijkstra's algorithm.
 *
 * **Algorithm Steps:**
 * 1. Initialize distances with infinity except source (0)
 * 2. Add source to priority queue with distance 0
 * 3. While heap is not empty:
 *    - Extract vertex with minimum distance
 *    - For each adjacent edge:
 *      - If new distance is shorter, update and add to queue
 * 4. Return distances array
 *
 * **Use Case:** GPS navigation, network routing, game pathfinding
 *
 * @param {number} n - Number of vertices (0 to n-1)
 * @param {Edge[][]} graph - Adjacency list representation (graph[u] = [{node: v, weight: w}])
 * @param {number} source - Starting vertex index
 * @returns {number[]} Array where index i contains shortest distance from source to vertex i
 * @time O((V + E) log V) - MinHeap-based implementation
 *
 * @example
 * const graph = [
 *   [{node: 1, weight: 4}, {node: 2, weight: 1}],
 *   [{node: 2, weight: 2}],
 *   [{node: 0, weight: 1}, {node: 3, weight: 1}],
 *   [{node: 2, weight: 1}, {node: 1, weight: 5}]
 * ];
 * const distances = dijkstra(4, graph, 0);
 * console.log(distances); // [0, 3, 1, 2]
 */
export function dijkstra(n: number, graph: Edge[][], source: number): number[] {
  const distances = Array(n).fill(Infinity);
  distances[source] = 0;

  const minHeap = new MinHeap<HeapNode>((a, b) => a.distance - b.distance);
  minHeap.add({ distance: 0, vertex: source });

  while (minHeap.size() > 0) {
    const { distance, vertex } = minHeap.poll();

    // Skip if we've already found a better path
    if (distance > distances[vertex]) continue;

    // Relax edges from current vertex
    for (const edge of graph[vertex]) {
      const newDistance = distances[vertex] + edge.weight;

      if (newDistance < distances[edge.node]) {
        distances[edge.node] = newDistance;
        minHeap.add({
          distance: newDistance,
          vertex: edge.node,
        });
      }
    }
  }

  return distances;
}

/**
 * Finds shortest path and reconstructs the actual path from source to target.
 *
 * **Algorithm Steps:**
 * 1. Run Dijkstra's algorithm to get distances and track parent nodes
 * 2. Reconstruct path by backtracking from target to source using parent array
 * 3. Reverse path to get source → target order
 *
 * **Use Case:** GPS showing actual route, network packet tracing
 *
 * @param {number} n - Number of vertices (0 to n-1)
 * @param {Edge[][]} graph - Adjacency list representation
 * @param {number} source - Starting vertex index
 * @param {number} target - Destination vertex index
 * @returns {Object} Object with path array and total distance
 * @time O((V + E) log V) - Dijkstra's plus O(V) path reconstruction
 *
 * @example
 * const graph = [
 *   [{node: 1, weight: 4}, {node: 2, weight: 1}],
 *   [{node: 2, weight: 2}],
 *   [{node: 0, weight: 1}, {node: 3, weight: 1}],
 *   [{node: 2, weight: 1}, {node: 1, weight: 5}]
 * ];
 * const result = dijkstraWithPath(4, graph, 0, 3);
 * console.log(result); // { path: [0, 2, 3], distance: 2 }
 */
export function dijkstraWithPath(
  n: number,
  graph: Edge[][],
  source: number,
  target: number
): { path: number[]; distance: number } {
  const distances = Array(n).fill(Infinity);
  const parent = Array(n).fill(-1);
  distances[source] = 0;

  const minHeap = new MinHeap<HeapNode>((a, b) => a.distance - b.distance);
  minHeap.add({ distance: 0, vertex: source });

  while (minHeap.size() > 0) {
    const { distance, vertex } = minHeap.poll();

    // Skip if we've already found a better path
    if (distance > distances[vertex]) continue;

    // Early termination if we reached target
    if (vertex === target) break;

    // Relax edges from current vertex
    for (const edge of graph[vertex]) {
      const newDistance = distances[vertex] + edge.weight;

      if (newDistance < distances[edge.node]) {
        distances[edge.node] = newDistance;
        parent[edge.node] = vertex;
        minHeap.add({
          distance: newDistance,
          vertex: edge.node,
        });
      }
    }
  }

  // Reconstruct path
  const path: number[] = [];
  let current = target;
  while (current !== -1) {
    path.unshift(current);
    current = parent[current];
  }

  return {
    path: distances[target] === Infinity ? [] : path,
    distance: distances[target],
  };
}

/**
 * Multi-source shortest paths: finds shortest distance from any of multiple sources.
 *
 * **Algorithm Steps:**
 * 1. Initialize all source vertices with distance 0
 * 2. Add all sources to priority queue
 * 3. Run standard Dijkstra's algorithm
 *
 * **Use Case:** Finding nearest service station, hospital, or charging point
 *
 * @param {number} n - Number of vertices (0 to n-1)
 * @param {Edge[][]} graph - Adjacency list representation
 * @param {number[]} sources - Array of starting vertex indices
 * @returns {number[]} Array where index i contains shortest distance to vertex i from any source
 * @time O((V + E) log V) - Same as single-source with multiple starting points
 *
 * @example
 * const graph = [
 *   [{node: 1, weight: 1}],
 *   [{node: 2, weight: 1}],
 *   [{node: 3, weight: 1}],
 *   []
 * ];
 * const distances = multiSourceDijkstra(4, graph, [0, 3]);
 * console.log(distances); // [0, 1, 2, 0]
 */
export function multiSourceDijkstra(
  n: number,
  graph: Edge[][],
  sources: number[]
): number[] {
  const distances = Array(n).fill(Infinity);
  const minHeap = new MinHeap<HeapNode>((a, b) => a.distance - b.distance);

  // Initialize all sources
  for (const source of sources) {
    distances[source] = 0;
    minHeap.add({ distance: 0, vertex: source });
  }

  while (minHeap.size() > 0) {
    const { distance, vertex } = minHeap.poll();

    // Skip if we've already found a better path
    if (distance > distances[vertex]) continue;

    // Relax edges from current vertex
    for (const edge of graph[vertex]) {
      const newDistance = distances[vertex] + edge.weight;

      if (newDistance < distances[edge.node]) {
        distances[edge.node] = newDistance;
        minHeap.add({
          distance: newDistance,
          vertex: edge.node,
        });
      }
    }
  }

  return distances;
}

// ============================================================================
// EXAMPLES AND TEST CASES
// ============================================================================

if (require.main === module) {
  console.log("=== Dijkstra's Algorithm Examples ===\n");

  // Example 1: Basic shortest paths
  console.log("Example 1: Single-source shortest paths");
  const graph1: Edge[][] = [
    [
      { node: 1, weight: 4 },
      { node: 2, weight: 1 },
    ],
    [{ node: 2, weight: 2 }],
    [
      { node: 0, weight: 1 },
      { node: 3, weight: 1 },
    ],
    [
      { node: 2, weight: 1 },
      { node: 1, weight: 5 },
    ],
  ];

  dijkstra(4, graph1, 0);
  console.log("Graph: 0→1(4), 0→2(1), 1→2(2), 2→0(1), 2→3(1), 3→2(1), 3→1(5)");
  console.log("Explanation: 0→2 costs 1, 0→2→1 costs 3, 0→2→3 costs 2\n");

  // Example 2: Path reconstruction
  console.log("Example 2: Shortest path with reconstruction");
  const result = dijkstraWithPath(4, graph1, 0, 3);
  console.log("Path from 0 to 3:", result.path, "Distance:", result.distance); // [0, 2, 3], 2
  console.log();

  // Example 3: Complex graph
  console.log("Example 3: Complex graph");
  const graph3: Edge[][] = [
    [
      { node: 1, weight: 7 },
      { node: 2, weight: 9 },
      { node: 5, weight: 14 },
    ],
    [
      { node: 0, weight: 7 },
      { node: 2, weight: 10 },
      { node: 3, weight: 15 },
    ],
    [
      { node: 0, weight: 9 },
      { node: 1, weight: 10 },
      { node: 3, weight: 11 },
      { node: 5, weight: 2 },
    ],
    [
      { node: 1, weight: 15 },
      { node: 2, weight: 11 },
      { node: 4, weight: 6 },
    ],
    [
      { node: 3, weight: 6 },
      { node: 5, weight: 9 },
    ],
    [
      { node: 0, weight: 14 },
      { node: 2, weight: 2 },
      { node: 4, weight: 9 },
    ],
  ];

  const distances3 = dijkstra(6, graph3, 0);
  console.log("Shortest distances from vertex 0:", distances3);
  // [0, 7, 9, 22, 20, 11]
  console.log();

  // Example 4: Multi-source
  console.log("Example 4: Multi-source shortest paths");
  const graph4: Edge[][] = [
    [{ node: 1, weight: 1 }],
    [{ node: 2, weight: 1 }],
    [{ node: 3, weight: 1 }],
    [],
  ];

  const distances4 = multiSourceDijkstra(4, graph4, [0, 3]);
  console.log("Graph: 0→1(1), 1→2(1), 2→3(1), 3→(none)");
  console.log("Distances from sources [0, 3]:", distances4); // [0, 1, 2, 0]
  console.log(
    "Explanation: 3 is source (0), 2→3 costs 1, 1→2→3 costs 2, 0→1→2→3 costs 3\n"
  );

  // Example 5: Disconnected vertices
  console.log("Example 5: Graph with unreachable vertex");
  const graph5: Edge[][] = [
    [{ node: 1, weight: 5 }],
    [],
    [{ node: 3, weight: 2 }],
    [],
  ];

  const distances5 = dijkstra(4, graph5, 0);
  console.log("Distances from 0:", distances5); // [0, 5, Infinity, Infinity]
  console.log("Vertices 2 and 3 are unreachable from 0\n");
}

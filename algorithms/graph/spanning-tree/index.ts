/**
 * Spanning Tree and Minimum Spanning Tree (MST) algorithms.
 *
 * **Spanning Tree:**
 * A spanning tree of a connected graph is a subgraph that:
 * - Includes all vertices of the original graph
 * - Is a tree (connected and acyclic)
 * - Has exactly (V - 1) edges for V vertices
 * - Can be found using DFS or BFS
 *
 * **Minimum Spanning Tree (MST):**
 * A minimum spanning tree is a spanning tree with the minimum possible total edge weight.
 * For an undirected weighted graph, it's unique when all edge weights are distinct.
 *
 * **Common Algorithms:**
 * 1. **Kruskal's Algorithm** - Greedy approach using Union-Find
 *    - Sort edges by weight
 *    - Add edges if they don't create a cycle (using Union-Find)
 *    - Time: O(E log E) where E is number of edges
 *
 * 2. **Prim's Algorithm** - Greedy approach using priority queue
 *    - Start from a vertex
 *    - Repeatedly add minimum weight edge connecting tree to non-tree vertex
 *    - Time: O(E log V) with binary heap
 *
 * **Applications:**
 * - Network design (roads, cables, pipelines)
 * - Circuit design
 * - Cluster analysis
 * - Image processing
 *
 * @date 16/01/2026 - 00:00:00
 */

import { buildAdjacencyList } from "../../utils/build-adjacency-list";
import { DisjointSet } from "../../../structures/disjoint-set";
import { MinHeap } from "../../../structures/heap/min-heap";

/**
 * Edge representation for graph algorithms.
 * @typedef {Object} Edge
 * @property {number} u - First vertex
 * @property {number} v - Second vertex
 * @property {number} weight - Edge weight (for MST problems)
 */
type Edge = {
  u: number;
  v: number;
  weight: number;
};

/**
 * Finds a spanning tree of an undirected graph using DFS.
 *
 * **Algorithm:**
 * 1. Initialize visited set
 * 2. Start DFS from vertex 0
 * 3. For each unvisited neighbor, add edge to spanning tree and recurse
 * 4. Return collected edges
 *
 * **Time Complexity:** O(V + E) - DFS traversal
 * **Space Complexity:** O(V) - Recursion stack + visited set
 *
 * @param {number} n - Number of vertices (0 to n-1)
 * @param {[number, number][]} edges - List of edges [u, v]
 * @returns {[number, number][]} Spanning tree edges
 *
 * @example
 * const n = 4;
 * const edges = [[0,1], [0,2], [1,3], [2,3]];
 * const tree = findSpanningTreeDFS(n, edges);
 * // Returns: [[0,1], [0,2], [1,3]] (one possible spanning tree)
 */
function findSpanningTreeDFS(
  n: number,
  edges: [number, number][]
): [number, number][] {
  // Build adjacency list
  const graph = buildAdjacencyList(n, edges);

  const visited = new Set<number>();
  const spanningTree: [number, number][] = [];

  /**
   * DFS helper to build spanning tree
   * @param {number} node - Current node
   */
  function dfs(node: number): void {
    visited.add(node);

    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        spanningTree.push([node, neighbor]);
        dfs(neighbor);
      }
    }
  }

  dfs(0);
  return spanningTree;
}

/**
 * Finds the Minimum Spanning Tree using Kruskal's Algorithm with coordinates.
 *
 * **Problem: Minimum Cost to Connect All Points**
 * Given an array of points in 2D space, connect all points with minimum total distance.
 * Uses Manhattan distance: |x1 - x2| + |y1 - y2|
 *
 * **Algorithm:**
 * 1. Calculate distances between all pairs of points
 * 2. Create edges with calculated distances
 * 3. Use MinHeap (priority queue) to process edges by cost
 * 4. Use Union-Find to detect cycles
 * 5. Add edge if it doesn't create a cycle
 * 6. Stop when all points are connected (V-1 edges)
 *
 * **Time Complexity:** O(n² log n) where n is number of points
 * **Space Complexity:** O(n²) for storing all edges in heap
 *
 * **Advantages of using MinHeap:**
 * - O(log n) insertion and extraction instead of O(n) for array operations
 * - Early termination when MST is complete
 * - More efficient priority queue semantics
 *
 * @param {[number, number][]} points - Array of 2D points [x, y]
 * @returns {number} Minimum total cost to connect all points
 *
 * @example
 * const points = [[0,0], [2,2], [3,10], [5,2], [7,0]];
 * const cost = minCostConnectPoints(points);
 * // Returns: 20 (minimum total distance to connect all points)
 */
function minCostConnectPoints(points: [number, number][]): number {
  if (!points || points.length === 0) {
    return 0;
  }

  const n = points.length;

  // Use MinHeap to efficiently extract minimum cost edge
  // Store edges as objects: { cost, point1, point2 }
  const edgeHeap = new MinHeap<{
    cost: number;
    point1: number;
    point2: number;
  }>();

  // Calculate distances between all pairs of points
  // Using Manhattan distance: |x1-x2| + |y1-y2|
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[j];
      const cost = Math.abs(x1 - x2) + Math.abs(y1 - y2);
      edgeHeap.add({ cost, point1: i, point2: j });
    }
  }

  // Initialize Union-Find
  const ds = new DisjointSet(n);
  let totalCost = 0;
  let edgesAdded = 0;

  // Process edges in order of increasing cost
  while (edgesAdded < n - 1 && edgeHeap.size() > 0) {
    const edge = edgeHeap.poll();

    if (!edge) break;

    const { cost, point1, point2 } = edge;

    // If union succeeds, points were not already connected
    if (ds.union(point1, point2)) {
      totalCost += cost;
      edgesAdded++;
    }
  }

  return totalCost;
}

/**
 * Finds the Minimum Spanning Tree using Kruskal's Algorithm.
 *
 * **Algorithm:**
 * 1. Sort all edges by weight
 * 2. Initialize Union-Find data structure
 * 3. Iterate through sorted edges
 * 4. For each edge, if it doesn't create a cycle (checked via Union-Find), add it
 * 5. Stop when we have V-1 edges
 *
 * **Time Complexity:** O(E log E) for sorting edges
 * **Space Complexity:** O(V) for Union-Find
 *
 * **Why Kruskal's works (Greedy Choice Property):**
 * - At each step, we add the minimum weight edge that doesn't create a cycle
 * - This is guaranteed to produce an MST due to the cut property
 *
 * **Advantages:**
 * - Simple to implement
 * - Good for sparse graphs
 * - Works on disconnected graphs (finds MST for each component)
 *
 * @param {number} n - Number of vertices
 * @param {Edge[]} edges - List of edges with weights
 * @returns {{edges: Edge[], totalWeight: number}} MST edges and total weight
 *
 * @example
 * const n = 4;
 * const edges = [
 *   { u: 0, v: 1, weight: 10 },
 *   { u: 0, v: 2, weight: 6 },
 *   { u: 0, v: 3, weight: 5 },
 *   { u: 1, v: 3, weight: 15 },
 *   { u: 2, v: 3, weight: 4 }
 * ];
 * const mst = kruskalMST(n, edges);
 * // Returns: { edges: [{u:2,v:3,weight:4}, {u:0,v:3,weight:5}, {u:0,v:2,weight:6}], totalWeight: 15 }
 */
function kruskalMST(
  n: number,
  edges: Edge[]
): {
  edges: Edge[];
  totalWeight: number;
} {
  // Sort edges by weight
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

  // Initialize Union-Find
  const ds = new DisjointSet(n);
  const mstEdges: Edge[] = [];
  let totalWeight = 0;

  // Add edges one by one if they don't create a cycle
  for (const edge of sortedEdges) {
    // If union succeeds, edge doesn't create a cycle
    if (ds.union(edge.u, edge.v)) {
      mstEdges.push(edge);
      totalWeight += edge.weight;

      // MST has V-1 edges
      if (mstEdges.length === n - 1) {
        break;
      }
    }
  }

  return { edges: mstEdges, totalWeight };
}

/**
 * Finds the Minimum Spanning Tree using Prim's Algorithm.
 *
 * **Algorithm:**
 * 1. Start from vertex 0, mark it as visited
 * 2. Use min-heap to track minimum weight edges from visited to unvisited vertices
 * 3. Repeatedly extract minimum weight edge from heap
 * 4. If it connects to unvisited vertex, add it to MST
 * 5. Continue until all vertices are visited
 *
 * **Time Complexity:** O(E log V) with binary heap
 * **Space Complexity:** O(V + E) for adjacency list and priority queue
 *
 * **Advantages:**
 * - Good for dense graphs
 * - Better with dense adjacency matrices
 * - More efficient with good priority queue implementation (uses project's MinHeap)
 *
 * **Comparison with Kruskal's:**
 * - Kruskal's: Better for sparse graphs, simple implementation
 * - Prim's: Better for dense graphs, good for dense adjacency matrices
 *
 * @param {number} n - Number of vertices
 * @param {number[][]} adjacencyMatrix - Weight matrix (0 if no edge)
 * @returns {{edges: Edge[], totalWeight: number}} MST edges and total weight
 *
 * @example
 * const n = 4;
 * const adj = [
 *   [0, 10, 6, 5],
 *   [10, 0, 0, 15],
 *   [6, 0, 0, 4],
 *   [5, 15, 4, 0]
 * ];
 * const mst = primMST(n, adj);
 * // Returns MST with edges: (2,3,4), (0,3,5), (0,2,6), totalWeight: 15
 */
function primMST(
  n: number,
  adjacencyMatrix: number[][]
): {
  edges: Edge[];
  totalWeight: number;
} {
  const visited = new Set<number>();
  const mstEdges: Edge[] = [];
  let totalWeight = 0;

  // Start from vertex 0
  visited.add(0);

  // Use MinHeap to efficiently extract minimum weight edge
  // Store edges as objects: { weight, u, v }
  const edgeHeap = new MinHeap<{ weight: number; u: number; v: number }>();

  // Add all edges from vertex 0
  for (let v = 1; v < n; v++) {
    if (adjacencyMatrix[0][v] > 0) {
      edgeHeap.add({ weight: adjacencyMatrix[0][v], u: 0, v });
    }
  }

  while (mstEdges.length < n - 1 && edgeHeap.size() > 0) {
    const edge = edgeHeap.poll();

    if (!edge) break;

    const { weight, u, v } = edge;

    // If v is already visited, skip (would create cycle)
    if (visited.has(v)) {
      continue;
    }

    // Add edge to MST
    mstEdges.push({ u, v, weight });
    totalWeight += weight;
    visited.add(v);

    // Add new edges from v to unvisited vertices
    for (let next = 0; next < n; next++) {
      if (!visited.has(next) && adjacencyMatrix[v][next] > 0) {
        edgeHeap.add({ weight: adjacencyMatrix[v][next], u: v, v: next });
      }
    }
  }

  return { edges: mstEdges, totalWeight };
}

// ============================================
// Examples
// ============================================

if (require.main === module) {
  console.log("=== Spanning Tree (DFS) ===");
  const n1 = 4;
  const edges1: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
  ];

  const spanningTree = findSpanningTreeDFS(n1, edges1);
  console.log("Graph edges:", edges1);
  console.log("Spanning tree edges:", spanningTree);
  console.log(
    `Spanning tree has ${spanningTree.length} edges (expected: ${n1 - 1})\n`
  );

  console.log("=== Minimum Spanning Tree (Kruskal's with Coordinates) ===");
  const points = [
    [0, 0],
    [2, 2],
    [3, 10],
    [5, 2],
    [7, 0],
  ];

  const minCost = minCostConnectPoints(points as [number, number][]);
  console.log("Points:", points);
  console.log("Minimum cost to connect all points:", minCost);
  console.log("Expected: 20\n");

  console.log("=== Minimum Spanning Tree (Kruskal's with Edge List) ===");
  const n2 = 4;
  const edges2: Edge[] = [
    { u: 0, v: 1, weight: 10 },
    { u: 0, v: 2, weight: 6 },
    { u: 0, v: 3, weight: 5 },
    { u: 1, v: 3, weight: 15 },
    { u: 2, v: 3, weight: 4 },
  ];

  const mstKruskal = kruskalMST(n2, edges2);
  console.log("Graph edges:", edges2);
  console.log("MST edges (Kruskal's):", mstKruskal.edges);
  console.log("Total weight:", mstKruskal.totalWeight);
  console.log(
    `MST has ${mstKruskal.edges.length} edges (expected: ${n2 - 1})\n`
  );

  console.log("=== Minimum Spanning Tree (Prim's) ===");
  const n3 = 4;
  const adj3 = [
    [0, 10, 6, 5],
    [10, 0, 0, 15],
    [6, 0, 0, 4],
    [5, 15, 4, 0],
  ];

  const mstPrim = primMST(n3, adj3);
  console.log("Adjacency matrix:");
  adj3.forEach((row, i) => console.log(`  ${i}: ${row}`));
  console.log("MST edges (Prim's):", mstPrim.edges);
  console.log("Total weight:", mstPrim.totalWeight);
  console.log(`MST has ${mstPrim.edges.length} edges (expected: ${n3 - 1})\n`);

  console.log("=== Comparison ===");
  console.log(
    `Kruskal's and Prim's both find MST with weight: ${mstKruskal.totalWeight} = ${mstPrim.totalWeight}`
  );
}

export { findSpanningTreeDFS, kruskalMST, primMST, minCostConnectPoints };

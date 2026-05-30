/**
 * Builds an adjacency list representation from edges
 *
 * Supports both directed and undirected graphs by:
 * - Directed: Only adds edge u→v
 * - Undirected: Adds edge u→v and v→u
 *
 * **Time Complexity:** O(n + e) where n = nodes, e = edges
 * **Space Complexity:** O(n + e)
 *
 * @param n - Number of nodes (0 to n-1)
 * @param edges - Array of edges as [u, v] pairs
 * @param directed - If false (default), treats graph as undirected
 * @returns Map where key is node and value is array of neighbors
 *
 * @example
 * // Undirected tree: 0-1-2-3
 * const adj = buildAdjacencyList(4, [[0, 1], [1, 2], [2, 3]]);
 * console.log(adj.get(1)); // [0, 2]
 *
 * @example
 * // Directed graph: 0→1→2
 * const adj = buildAdjacencyList(3, [[0, 1], [1, 2]], true);
 * console.log(adj.get(1)); // [2]
 */
export function buildAdjacencyList(
  n: number,
  edges: number[][],
  directed: boolean = false
): Map<number, number[]> {
  const adj = new Map<number, number[]>();

  // Initialize adjacency list for all nodes
  for (let i = 0; i < n; i++) {
    adj.set(i, []);
  }

  // Add edges
  for (const [u, v] of edges) {
    adj.get(u)!.push(v);

    // For undirected graphs, add reverse edge
    if (!directed) {
      adj.get(v)!.push(u);
    }
  }

  return adj;
}

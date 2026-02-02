/**
 * All Paths Lead to Destination (LeetCode 1059)
 *
 * Determines whether all paths starting from source eventually end at destination.
 *
 * Given the edges of a directed acyclic graph where edges[i] = [ai, bi] indicates there
 * is an edge from node ai to node bi, and two nodes source and destination,
 * determine if all paths from source lead to destination.
 *
 * Requirements:
 * - At least one path exists from source to destination
 * - If a path reaches a node with no outgoing edges, that node must be destination
 * - The number of possible paths from source to destination is finite
 *
 * **Example 1:**
 * n = 3, edges = [[0,1],[0,2]], source = 0, destination = 2
 * Output: false
 *
 * **Example 2:**
 * n = 4, edges = [[0,1],[0,3],[1,2],[2,1]], source = 0, destination = 3
 * Output: false
 *
 * **Example 3:**
 * n = 4, edges = [[0,1],[0,2],[1,3],[2,3]], source = 0, destination = 3
 * Output: true
 *
 * **Approach:**
 * Use DFS to explore all paths from source. For each path:
 * 1. If we reach a dead-end (node with no outgoing edges), check if it's the destination
 * 2. If we reach destination, continue checking other paths
 * 3. Use cycle detection (visiting state) to avoid infinite loops
 * 4. Return true only if ALL paths lead to destination
 *
 * **Time Complexity:** O(2^n * n) in worst case (exponential paths)
 * **Space Complexity:** O(n) for recursion stack and state array
 *
 * @date 14/01/2026
 */

import { buildAdjacencyList } from "../../../algorithms/utils/build-adjacency-list";

/**
 * Determines if all paths lead to destination using DFS with state tracking
 *
 * States:
 * - 0: unvisited
 * - 1: currently visiting (in recursion stack)
 * - 2: completely visited
 */
function allPathsLeadToDestinationDFS(
  n: number,
  edges: number[][],
  source: number,
  destination: number
): boolean {
  // Build adjacency list (directed graph)
  const graph = buildAdjacencyList(n, edges, true);

  // State tracking: 0 = unvisited, 1 = visiting, 2 = visited
  const state = new Array<number>(n).fill(0);

  /**
   * DFS helper to check if all paths from current node lead to destination.
   *
   * @param {number} node - Current node in traversal
   * @returns {boolean} True if all paths from node reach destination
   */
  function dfs(node: number): boolean {
    // Reached destination successfully
    if (node === destination) {
      return true;
    }

    // Mark as visiting to detect cycles
    state[node] = 1;

    // Get neighbors
    const neighbors = graph.get(node) || [];

    // If no neighbors and not at destination, path doesn't lead to destination
    if (neighbors.length === 0) {
      state[node] = 2;
      return false;
    }

    // Check all neighbors - ALL must lead to destination
    for (const neighbor of neighbors) {
      // Cycle detected
      if (state[neighbor] === 1) {
        state[node] = 2;
        return false;
      }

      // If any path doesn't lead to destination, return false
      if (!dfs(neighbor)) {
        state[node] = 2;
        return false;
      }
    }

    // All paths from this node lead to destination
    state[node] = 2;
    return true;
  }

  return dfs(source);
}

export function allPathsLeadToDestination(
  n: number,
  edges: number[][],
  source: number,
  destination: number
): boolean {
  return allPathsLeadToDestinationDFS(n, edges, source, destination);
}

// Test cases
if (require.main === module) {
  console.log("=== All Paths Lead to Destination Examples ===\n");

  // Example 1: Not all paths lead to destination
  console.log("Example 1: Multiple dead ends");
  const n1 = 3;
  const edges1 = [
    [0, 1],
    [0, 2],
  ];
  const result1 = allPathsLeadToDestination(n1, edges1, 0, 2);
  console.log(`n = ${n1}, edges = ${JSON.stringify(edges1)}`);
  console.log("Paths from 0:");
  console.log("  - 0 → 1 (dead end, not destination)");
  console.log("  - 0 → 2 (reaches destination)");
  console.log("Output:", result1);
  console.log("Expected: false\n");

  // Example 2: Cycle exists, not all paths reach destination
  console.log("Example 2: Cycle with unreachable destination");
  const n2 = 4;
  const edges2 = [
    [0, 1],
    [0, 3],
    [1, 2],
    [2, 1],
  ];
  const result2 = allPathsLeadToDestination(n2, edges2, 0, 3);
  console.log(`n = ${n2}, edges = ${JSON.stringify(edges2)}`);
  console.log("Paths from 0:");
  console.log("  - 0 → 1 → 2 → 1 → ... (cycle)");
  console.log("  - 0 → 3 (reaches destination)");
  console.log("Output:", result2);
  console.log("Expected: false\n");

  // Example 3: All paths lead to destination
  console.log("Example 3: All paths reach destination");
  const n3 = 4;
  const edges3 = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
  ];
  const result3 = allPathsLeadToDestination(n3, edges3, 0, 3);
  console.log(`n = ${n3}, edges = ${JSON.stringify(edges3)}`);
  console.log("Paths from 0:");
  console.log("  - 0 → 1 → 3");
  console.log("  - 0 → 2 → 3");
  console.log("Output:", result3);
  console.log("Expected: true\n");

  // Example 4: Single node
  console.log("Example 4: Source is destination");
  const result4 = allPathsLeadToDestination(1, [], 0, 0);
  console.log("Output:", result4);
  console.log("Expected: true\n");

  // Example 5: Direct path
  console.log("Example 5: Single direct path");
  const n5 = 3;
  const edges5 = [
    [0, 1],
    [1, 2],
  ];
  const result5 = allPathsLeadToDestination(n5, edges5, 0, 2);
  console.log(`n = ${n5}, edges = ${JSON.stringify(edges5)}`);
  console.log("Output:", result5);
  console.log("Expected: true\n");
}

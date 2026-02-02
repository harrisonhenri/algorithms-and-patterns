import { dijkstra, Edge } from "../../../algorithms/graph/dijkstra";

/**
 * Network Delay Time (LeetCode 743)
 *
 * **Problem:**
 * You are given a network of n nodes labeled from 1 to n. You are also given times,
 * a list of travel times as directed edges times[i] = (ui, vi, wi), where ui is the
 * source node, vi is the target node, and wi is the time it takes for a signal to
 * travel from source to target.
 *
 * Send a signal from node k. Return the minimum time it takes for ALL nodes to
 * receive the signal. If it is impossible, return -1.
 *
 * **Algorithm:**
 * Uses Dijkstra's algorithm from algorithms/graph/dijkstra to find shortest paths
 * from node k to all other nodes. The answer is the maximum distance (when the last
 * node receives the signal), or -1 if any node is unreachable.
 *
 * **Alternative Approaches:**
 * This problem can also be solved with:
 * - BFS: Level-order traversal to find minimum steps (unweighted variant) - O(n + m)
 * - DFS with memoization: Track visited nodes and update distances recursively - O(n + m)
 * - Bellman-Ford: Works with negative weights (but slower than Dijkstra for non-negative) - O(n·m)
 *
 * **Time Complexity:** O((n + times.length) log n) via Dijkstra's algorithm
 * **Space Complexity:** O(n + times.length) for distance array and adjacency list
 *
 * @date 19/01/2026
 */

/**
 * Finds minimum time for signal to reach all nodes using Dijkstra's algorithm.
 *
 * **Algorithm Steps:**
 * 1. Build adjacency list from times array
 * 2. Run Dijkstra from node k to find shortest time to each node
 * 3. Return maximum distance (or -1 if any node unreachable)
 *
 * @param {number} n - Number of nodes (labeled 1 to n)
 * @param {number[][]} times - Array of [source, target, time] edges
 * @param {number} k - Starting node to send signal
 * @returns {number} Minimum time for all nodes to receive signal, or -1 if impossible
 * @time O((n + m) log n) where m = times.length
 *
 * @example
 * const times = [[2,1,1],[2,3,1],[3,4,1]];
 * const result = networkDelayTime(times, 4, 2);
 * console.log(result); // 2
 * // Path: 2→1 (1ms), 2→3 (1ms), 3→4 (1ms)
 * // Signal reaches all nodes at time 2
 */
export function networkDelayTime(
  times: number[][],
  n: number,
  k: number
): number {
  // Build adjacency list (1-indexed to match problem: nodes 1 to n)
  const graph: Edge[][] = Array.from({ length: n + 1 }, () => []);
  for (const [source, target, time] of times) {
    graph[source].push({ node: target, weight: time });
  }

  // Use Dijkstra's algorithm to find shortest paths from k to all nodes
  const distances = dijkstra(n + 1, graph, k);

  // Find maximum distance to any node (1 to n, excluding index 0)
  let maxTime = 0;
  for (let i = 1; i <= n; i++) {
    if (distances[i] === Infinity) return -1; // Unreachable node
    maxTime = Math.max(maxTime, distances[i]);
  }

  return maxTime;
}

// ============================================================================
// EXAMPLES AND TEST CASES
// ============================================================================

if (require.main === module) {
  console.log("=== Network Delay Time Examples ===\n");

  // Example 1: Basic case
  console.log("Example 1: Signal reaches all nodes");
  const times1 = [
    [2, 1, 1],
    [2, 3, 1],
    [3, 4, 1],
  ];
  const result1 = networkDelayTime(times1, 4, 2);
  console.log("Times:", times1);
  console.log("n = 4, k = 2");
  console.log("Result:", result1); // 2
  console.log(
    "Explanation: 2→1 (1ms), 2→3 (1ms), 3→4 (1ms). Last signal at time 2\n"
  );

  // Example 2: Unreachable node
  console.log("Example 2: Unreachable nodes");
  const times2 = [[1, 2, 1]];
  const result2 = networkDelayTime(times2, 2, 2);
  console.log("Times:", times2);
  console.log("n = 2, k = 2");
  console.log("Result:", result2); // -1
  console.log("Explanation: Node 1 is unreachable from node 2\n");

  // Example 3: Linear path
  console.log("Example 3: Linear path (1→2→3→4)");
  const times3 = [
    [1, 2, 1],
    [2, 3, 1],
    [3, 4, 1],
  ];
  const result3 = networkDelayTime(times3, 4, 1);
  console.log("Times:", times3);
  console.log("n = 4, k = 1");
  console.log("Result:", result3); // 3
  console.log("Explanation: Signal travels 1→2→3→4, taking 3 time units\n");

  // Example 4: Complex network with shortcuts
  console.log("Example 4: Complex network with shortcuts");
  const times4 = [
    [1, 2, 1],
    [1, 3, 4],
    [2, 3, 1],
    [3, 4, 1],
  ];
  const result4 = networkDelayTime(times4, 4, 1);
  console.log("Times:", times4);
  console.log("n = 4, k = 1");
  console.log("Result:", result4); // 3
  console.log("Explanation: 1→2 (1), 2→3 (1), 3→4 (1). Total = 3\n");

  // Example 5: Early termination test
  console.log("Example 5: Complex network with multiple paths");
  const times5 = [
    [1, 2, 1],
    [2, 3, 1],
    [3, 4, 1],
  ];
  const result5 = networkDelayTime(times5, 4, 1);
  console.log("Times:", times5);
  console.log("n = 4, k = 1");
  console.log("Result:", result5); // 3
  console.log("Explanation: Signal travels 1→2→3→4, taking 3 time units\n");

  // Example 6: Single node
  console.log("Example 6: Single node network");
  const times6: number[][] = [];
  const result6 = networkDelayTime(times6, 1, 1);
  console.log("Times:", times6);
  console.log("n = 1, k = 1");
  console.log("Result:", result6); // 0
  console.log("Explanation: Only one node, signal already there\n");

  // Example 7: Large delay edge
  console.log("Example 7: Large delay edges");
  const times7 = [
    [1, 2, 100],
    [2, 3, 100],
    [1, 3, 150],
  ];
  const result7 = networkDelayTime(times7, 3, 1);
  console.log("Times:", times7);
  console.log("n = 3, k = 1");
  console.log("Result:", result7); // 150
  console.log(
    "Explanation: 1→2 (100), 2→3 (100) = 200. But 1→3 (150) is shorter\n"
  );
}

/**
 * Finds all possible paths from node 0 to node n - 1 in a Directed Acyclic Graph (DAG).
 *
 * The graph is represented as an adjacency list where:
 *   graph[i] contains all nodes that can be visited directly from node i.
 *
 * The algorithm uses Breadth-First Search (BFS) to explore every possible path
 * from the source to the target. Since the graph is a DAG, there are no cycles.
 *
 * **Problem:** Given a DAG with n nodes labeled from 0 to n - 1, return all paths
 * from node 0 to node n - 1 as a 2D array.
 *
 * **Example:**
 * ```ts
 * const graph = [[1,2],[3],[3],[]];
 * allPathsSourceTarget(graph); // [[0,1,3],[0,2,3]]
 * ```
 *
 * **Approach: BFS with Queue**
 * 1. Initialize queue with (node 0, path [0])
 * 2. While queue is not empty:
 *    - Dequeue (currentNode, currentPath)
 *    - If currentNode is target, add path to results
 *    - For each neighbor, enqueue (neighbor, path + neighbor)
 * 3. Return all collected paths
 *
 * **Time Complexity:** O(2^n × n) - Exponential paths × path length
 * **Space Complexity:** O(2^n × n) - Queue can hold many paths
 *
 * **Note:** BFS finds paths level by level, but still discovers all paths.
 * Order of results differs from DFS but completeness is same.
 *
 * @date 20/01/2026
 */

import { Queue } from "../../../structures/queue";

/**
 * **Approach: BFS with Queue**
 *
 * Uses a queue to manage (node, path) tuples, exploring all paths level by level.
 * Each queue element contains the current node and the path taken to reach it.
 *
 * **Time Complexity:** O(2^n × n) - All paths × path length
 * **Space Complexity:** O(2^n × n) - Queue stores all paths being explored
 *
 * **Algorithm:**
 * 1. Initialize queue with (source node=0, initial path=[0])
 * 2. Process nodes level by level:
 *    - Dequeue (currentNode, currentPath)
 *    - If currentNode is target, save the path
 *    - For each neighbor, enqueue new state with updated path
 * 3. Return all discovered paths
 *
 * **Key characteristics:**
 * - Explores paths breadth-first (by depth level)
 * - Completes all paths of depth k before starting depth k+1
 * - No visited tracking needed (DAG has no cycles)
 * - Queue prevents stack overflow vs recursive DFS
 */
function allPathsSourceTarget(graph: number[][]): number[][] {
  const target = graph.length - 1;
  const allPaths: number[][] = [];

  // Queue stores tuples of [currentNode, currentPath]
  const queue = new Queue<[number, number[]]>();
  queue.enqueue([0, [0]]);

  while (!queue.isEmpty()) {
    const state = queue.dequeue();

    if (state === undefined) continue;

    const [currentNode, currentPath] = state;

    // If reached destination, add path to results
    if (currentNode === target) {
      allPaths.push(currentPath);
      continue;
    }

    // Explore all neighbors
    for (const neighbor of graph[currentNode]) {
      const newPath = [...currentPath, neighbor];
      queue.enqueue([neighbor, newPath]);
    }
  }

  return allPaths;
}

// Example usage
if (require.main === module) {
  console.log("=== All Paths using BFS ===\n");

  // Test Case 1: Simple graph
  const testGraph1 = [[1, 2], [3], [3], []];

  console.log("Test Case 1: Simple graph");
  console.log("Graph: [[1,2],[3],[3],[]]");
  console.log("Task: Find all paths from node 0 to node 3\n");

  const result1 = allPathsSourceTarget(testGraph1);
  console.log("All paths (BFS):");
  result1.forEach((path, idx) => {
    console.log(`  Path ${idx + 1}: ${path.join(" → ")}`);
  });
  console.log(`Total paths: ${result1.length}`);
  console.log("Expected: [[0,1,3],[0,2,3]] (or [[0,2,3],[0,1,3]])\n");

  // Test Case 2: More complex graph
  const testGraph2 = [[4, 3, 1], [3, 2, 4], [3], [4], []];

  console.log("Test Case 2: More complex graph");
  console.log("Graph: [[4,3,1],[3,2,4],[3],[4],[]]");
  console.log("Task: Find all paths from node 0 to node 4\n");

  const result2 = allPathsSourceTarget(testGraph2);
  console.log("All paths (BFS):");
  result2.forEach((path, idx) => {
    console.log(`  Path ${idx + 1}: ${path.join(" → ")}`);
  });
  console.log(`Total paths: ${result2.length}\n`);

  // Test Case 3: Single node
  const testGraph3 = [[]];

  console.log("Test Case 3: Single node (source = target)");
  console.log("Graph: [[]]");
  console.log("Task: Find all paths from node 0 to node 0\n");

  const result3 = allPathsSourceTarget(testGraph3);
  console.log("All paths (BFS):");
  result3.forEach((path, idx) => {
    console.log(`  Path ${idx + 1}: ${path.join(" → ")}`);
  });
  console.log("Expected: [[0]]\n");

  // Test Case 4: Linear path
  const testGraph4 = [[1], [2], [3], [4], []];

  console.log("Test Case 4: Linear path");
  console.log("Graph: [[1],[2],[3],[4],[]]");
  console.log("Task: Find all paths from node 0 to node 4\n");

  const result4 = allPathsSourceTarget(testGraph4);
  console.log("All paths (BFS):");
  result4.forEach((path, idx) => {
    console.log(`  Path ${idx + 1}: ${path.join(" → ")}`);
  });
  console.log("Expected: [[0,1,2,3,4]] (only one path)\n");

  // Test Case 5: Diamond graph
  const testGraph5 = [[1, 2], [3], [3], []];

  console.log("Test Case 5: Diamond graph");
  console.log("Graph: [[1,2],[3],[3],[]]");
  console.log("Task: Find all paths from node 0 to node 3\n");

  const result5 = allPathsSourceTarget(testGraph5);
  console.log("All paths (BFS):");
  result5.forEach((path, idx) => {
    console.log(`  Path ${idx + 1}: ${path.join(" → ")}`);
  });
  console.log("Expected: [[0,1,3],[0,2,3]]\n");
}

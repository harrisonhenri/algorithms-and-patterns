/**
 * Finds all possible paths from node 0 to node n - 1 in a Directed Acyclic Graph (DAG).
 *
 * The graph is represented as an adjacency list where:
 *   graph[i] contains all nodes that can be visited directly from node i.
 *
 * The algorithm uses Depth-First Search (DFS) with backtracking to explore
 * every possible path from the source to the target. Since the graph is a DAG,
 * there are no cycles, so no visited array is required.
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
 * **Approach: DFS with Backtracking**
 * 1. Start from node 0 with an empty path
 * 2. For each neighbor of current node, recursively explore
 * 3. When reaching the target node (n-1), store the complete path
 * 4. Backtrack by removing the current node from the path
 *
 * **Time Complexity:** O(2^n × n) - Exponential paths × path length
 * **Space Complexity:** O(n) - Recursion depth (excluding output)
 *
 * @date 14/01/2026 - 00:00:00
 */

import { SinglyLinkedList } from "../../../structures/linked-list";

/**
 * **Approach 1: Recursive DFS with Backtracking**
 *
 * Explores all paths by recursively visiting each neighbor and backtracking
 * to explore alternative paths.
 */
function allPathsSourceTarget(graph: number[][]): number[][] {
  const target = graph.length - 1;
  const allPaths: number[][] = [];
  const currentPath: number[] = [0];

  dfs(0, target, graph, currentPath, allPaths);
  return allPaths;
}

/**
 * Helper function for recursive DFS
 * Explores all paths from currentNode to target node
 */
function dfs(
  currentNode: number,
  target: number,
  graph: number[][],
  currentPath: number[],
  allPaths: number[][]
): void {
  // Base case: reached destination
  if (currentNode === target) {
    allPaths.push([...currentPath]); // Add a copy of the path
    return;
  }

  // Explore all neighbors
  for (const neighbor of graph[currentNode]) {
    // Move to neighbor
    currentPath.push(neighbor);

    // Recursively explore from neighbor
    dfs(neighbor, target, graph, currentPath, allPaths);

    // Backtrack: remove neighbor from path
    currentPath.pop();
  }
}

/**
 * **Approach 2: Iterative DFS with Stack (Alternative)**
 *
 * Uses an explicit stack to manage paths and nodes, avoiding recursion.
 * Each stack element contains the current node and the path to reach it.
 */
function allPathsSourceTargetIterative(graph: number[][]): number[][] {
  const target = graph.length - 1;
  const allPaths: number[][] = [];

  // Stack contains tuples of [currentNode, currentPath]
  const stack: Array<[number, number[]]> = [[0, [0]]];

  while (stack.length > 0) {
    const [currentNode, currentPath] = stack.pop()!;

    // If reached destination, add path to results
    if (currentNode === target) {
      allPaths.push(currentPath);
      continue;
    }

    // Add all neighbors to stack with updated path
    for (const neighbor of graph[currentNode]) {
      const newPath = [...currentPath, neighbor];
      stack.push([neighbor, newPath]);
    }
  }

  return allPaths;
}

/**
 * **Approach 3: Recursive DFS with Project's SinglyLinkedList**
 *
 * Uses the project's SinglyLinkedList directly to maintain the current path during traversal.
 * This demonstrates proper integration of project data structures into algorithm solutions.
 *
 * **Implementation notes:**
 * - Uses `append()` to add nodes to the path (O(n) tail traversal)
 * - Uses `removeLast()` for efficient backtracking (O(n) tail removal)
 * - Uses `toArray()` to convert path to result format
 * - True composition: leveraging project's data structure API
 *
 * **Trade-offs:**
 * - O(n) append/removeLast operations (must traverse to tail)
 * - Higher memory overhead (pointers per node)
 * - Best demonstrates data structure integration in projects
 * - For small paths (typical DAG), performance is acceptable
 */
function allPathsSourceTargetWithSinglyLinkedList(
  graph: number[][]
): number[][] {
  const target = graph.length - 1;
  const allPaths: number[][] = [];

  function dfs(currentNode: number, path: SinglyLinkedList<number>): void {
    // Base case: reached destination
    if (currentNode === target) {
      allPaths.push(path.toArray());
      return;
    }

    // Explore all neighbors
    for (const neighbor of graph[currentNode]) {
      // Append neighbor to path
      path.append(neighbor);

      // Recursively explore from neighbor
      dfs(neighbor, path);

      // Backtrack: remove neighbor from path
      path.removeLast();
    }
  }

  // Start DFS with node 0 in the path
  const initialPath = new SinglyLinkedList<number>();
  initialPath.append(0);
  dfs(0, initialPath);

  return allPaths;
}

// Example usage - Test Case 1: Simple Graph
if (require.main === module) {
  const testGraph1 = [[1, 2], [3], [3], []];

  console.log("=== Recursive DFS with Backtracking ===");
  const resultRecursive = allPathsSourceTarget(testGraph1);
  console.log("All paths from 0 to 3:", JSON.stringify(resultRecursive));
  // Output: [[0,1,3],[0,2,3]]

  console.log("\n=== Iterative DFS with Stack ===");
  const resultIterative = allPathsSourceTargetIterative(testGraph1);
  console.log("All paths from 0 to 3:", JSON.stringify(resultIterative));
  // Output: [[0,2,3],[0,1,3]] (order may differ due to stack order)

  console.log("\n=== Recursive DFS with SinglyLinkedList ===");
  const resultSinglyLinkedList =
    allPathsSourceTargetWithSinglyLinkedList(testGraph1);
  console.log("All paths from 0 to 3:", JSON.stringify(resultSinglyLinkedList));
  // Output: [[0,1,3],[0,2,3]]

  // Additional test case: More complex graph
  const testGraph2 = [[4, 3, 1], [3, 2, 4], [3], [4], []];

  console.log("\n=== Test Case 2: More Complex Graph ===");
  const result2Recursive = allPathsSourceTarget(testGraph2);
  console.log("All paths from 0 to 4:", JSON.stringify(result2Recursive));

  const result2Iterative = allPathsSourceTargetIterative(testGraph2);
  console.log(
    "All paths from 0 to 4 (Iterative):",
    JSON.stringify(result2Iterative)
  );

  const result2SinglyLinkedList =
    allPathsSourceTargetWithSinglyLinkedList(testGraph2);
  console.log(
    "All paths from 0 to 4 (SinglyLinkedList):",
    JSON.stringify(result2SinglyLinkedList)
  );
}
